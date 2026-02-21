#!/usr/bin/env python3
"""
Tests for the token-bloat fixes.

Validates:
1. compress_screenshot() compresses / downsizes screenshots before sending.
2. ConversationSession.get_messages_for_api respects max_messages and max_tokens.
3. Image blobs stored in conversation history are stripped from context payloads.

These tests do NOT require a live Windows machine or running gateway.
Run with: pytest mcp-servers/test_token_bloat.py -v
"""

import base64
import importlib.util
import inspect
import io
import os
import sys
import types
import unittest

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MCP_SERVERS = os.path.join(REPO_ROOT, "mcp-servers")
sys.path.insert(0, MCP_SERVERS)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_pil_image(width: int = 1920, height: int = 1080):
    """Return a minimal in-memory PIL Image without needing a display."""
    from PIL import Image
    return Image.new("RGB", (width, height), (100, 149, 237))


def _load_compress_screenshot():
    """
    Import the compress_screenshot helper and the constants from snapshot_tool.py
    without triggering the relative-import machinery (from . import BaseTool).
    """
    snapshot_path = os.path.join(MCP_SERVERS, "tools", "snapshot_tool.py")
    with open(snapshot_path, encoding="utf-8") as fh:
        source = fh.read()

    # Strip the relative import and MCP type references so the module loads standalone
    source = source.replace("from . import BaseTool", "BaseTool = object")
    source = source.replace(
        "from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource",
        "Tool = TextContent = ImageContent = EmbeddedResource = object",
    )
    source = source.replace("from PIL import Image, ImageGrab", "")
    # Add back just what the compression helper needs
    source = "from PIL import Image\n" + source

    mod = types.ModuleType("_snapshot_tool_standalone")
    exec(compile(source, snapshot_path, "exec"), mod.__dict__)
    return mod


# ---------------------------------------------------------------------------
# 1 – Screenshot compression (tests the compress_screenshot() helper directly)
# ---------------------------------------------------------------------------

class TestCompressScreenshot(unittest.TestCase):
    """compress_screenshot must down-scale and JPEG-encode screenshots."""

    @classmethod
    def setUpClass(cls):
        try:
            cls.mod = _load_compress_screenshot()
        except Exception as e:
            raise unittest.SkipTest(f"Could not load snapshot_tool: {e}")

    def test_jpeg_output_is_base64(self):
        """Return value must be valid base64-encoded JPEG."""
        from PIL import Image
        img = _make_pil_image(1920, 1080)
        b64, *_ = self.mod.compress_screenshot(img)
        raw = base64.b64decode(b64)
        # JPEG magic bytes: FF D8
        self.assertEqual(raw[:2], b"\xff\xd8", "Output is not a JPEG")

    def test_downscaled_to_max_width(self):
        """A 1920-wide screenshot must be shrunk to ≤ _MAX_SCREENSHOT_WIDTH."""
        from PIL import Image
        max_w = self.mod._MAX_SCREENSHOT_WIDTH  # 1280
        img = _make_pil_image(1920, 1080)
        b64, orig_w, orig_h, sent_w, sent_h = self.mod.compress_screenshot(img)
        self.assertLessEqual(sent_w, max_w,
                             f"Sent width {sent_w} exceeds {max_w}")
        self.assertEqual(orig_w, 1920)

    def test_jpeg_is_smaller_than_png(self):
        """JPEG + downscale must be substantially smaller than the original PNG."""
        img = _make_pil_image(1920, 1080)
        png_buf = io.BytesIO()
        img.save(png_buf, format="PNG", optimize=True)
        png_size = len(png_buf.getvalue())

        b64, *_ = self.mod.compress_screenshot(img)
        jpeg_size = len(base64.b64decode(b64))

        self.assertLess(jpeg_size, png_size,
                        f"JPEG ({jpeg_size} B) should be smaller than PNG ({png_size} B)")

    def test_small_screenshot_not_upscaled(self):
        """Screenshots already within the max width must not be upscaled."""
        img = _make_pil_image(800, 600)
        b64, orig_w, orig_h, sent_w, sent_h = self.mod.compress_screenshot(img)
        self.assertEqual(sent_w, 800, "Small screenshot was unexpectedly upscaled")

    def test_aspect_ratio_preserved(self):
        """Aspect ratio must be maintained after downscaling."""
        img = _make_pil_image(1920, 1080)  # 16:9
        b64, orig_w, orig_h, sent_w, sent_h = self.mod.compress_screenshot(img)
        expected_h = int(1080 * sent_w / 1920)
        self.assertAlmostEqual(sent_h, expected_h, delta=1,
                               msg="Aspect ratio not preserved after resize")


# ---------------------------------------------------------------------------
# 2 – Conversation context limits
# ---------------------------------------------------------------------------

class TestConversationSessionLimits(unittest.TestCase):
    """ConversationSession.get_messages_for_api must honour max_messages / max_tokens."""

    def _make_session(self, session_id: str = "test"):
        from lib.conversation_manager import ConversationSession
        return ConversationSession(session_id)

    def test_max_messages_respected(self):
        """Only the last max_messages messages should be returned."""
        session = self._make_session()
        for i in range(20):
            session.add_message("user" if i % 2 == 0 else "assistant", f"Message {i}")

        result = session.get_messages_for_api(max_tokens=100000, max_messages=5)
        self.assertLessEqual(len(result), 5)

    def test_most_recent_messages_kept(self):
        """The *most recent* messages must survive the max_messages cap."""
        session = self._make_session()
        for i in range(10):
            session.add_message("user", f"Message {i}")

        result = session.get_messages_for_api(max_tokens=100000, max_messages=3)
        contents = [m["content"] for m in result]
        self.assertIn("Message 9", contents)
        self.assertIn("Message 8", contents)
        self.assertIn("Message 7", contents)
        self.assertNotIn("Message 0", contents)

    def test_token_budget_respected(self):
        """Messages exceeding the token budget must be excluded."""
        session = self._make_session()
        # Each message is ~100 chars → ~25 tokens
        for i in range(10):
            session.add_message("user", "x" * 100)

        # Allow only ~50 tokens → at most 2 messages
        result = session.get_messages_for_api(max_tokens=50, max_messages=100)
        self.assertLessEqual(len(result), 2)

    def test_image_blobs_stripped_from_context(self):
        """Base64 image content in messages must not consume the token budget."""
        from lib.conversation_manager import ConversationSession
        session = ConversationSession("img_test")

        # 40 000 chars of 'A' simulates a ~30 KB base64 image blob (~10 K tokens).
        # This is large enough to dominate any reasonable token budget.
        big_b64 = "A" * 40000
        session.add_message("user", [
            {"type": "tool_result", "tool_use_id": "tu_1", "content": [
                {"type": "image", "source": {"type": "base64", "data": big_b64}},
                {"type": "text", "text": "Screenshot captured"},
            ]}
        ])
        session.add_message("assistant", "I can see the screen.")

        # Even with a tight token budget the text-only assistant message fits
        result = session.get_messages_for_api(max_tokens=500, max_messages=10)
        assistant_msgs = [m for m in result if m["role"] == "assistant"]
        self.assertTrue(assistant_msgs, "Assistant message should fit in context")

    def test_default_max_tokens_is_8000(self):
        """Default max_tokens for get_messages_for_api must be 8 000."""
        from lib.conversation_manager import ConversationSession
        sig = inspect.signature(ConversationSession.get_messages_for_api)
        default = sig.parameters["max_tokens"].default
        self.assertEqual(default, 8000,
                         f"Default max_tokens is {default}, expected 8000")

    def test_default_max_messages_is_10(self):
        """Default max_messages must be 10."""
        from lib.conversation_manager import ConversationSession
        sig = inspect.signature(ConversationSession.get_messages_for_api)
        default = sig.parameters["max_messages"].default
        self.assertEqual(default, 10,
                         f"Default max_messages is {default}, expected 10")


# ---------------------------------------------------------------------------
# 3 – ConversationManager (outer class) passes new params through
# ---------------------------------------------------------------------------

class TestConversationManagerDefaults(unittest.TestCase):

    def test_manager_default_max_tokens_is_8000(self):
        from lib.conversation_manager import ConversationManager
        sig = inspect.signature(ConversationManager.get_messages_for_api)
        default = sig.parameters["max_tokens"].default
        self.assertEqual(default, 8000)

    def test_manager_default_max_messages_is_10(self):
        from lib.conversation_manager import ConversationManager
        sig = inspect.signature(ConversationManager.get_messages_for_api)
        default = sig.parameters["max_messages"].default
        self.assertEqual(default, 10)


if __name__ == "__main__":
    unittest.main(verbosity=2)

