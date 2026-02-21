"""
Snapshot Tool - FIXED VERSION - Fast and Reliable
Captures screenshots without hanging on accessibility tree
"""

import base64
import io
from typing import Sequence
from PIL import Image, ImageGrab
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from . import BaseTool

# Maximum width (pixels) for captured screenshots.  Larger images are scaled
# down proportionally before encoding so they don't blow up the token budget.
_MAX_SCREENSHOT_WIDTH = 1280
# JPEG quality used when encoding.  75 is a good balance: visually good, small.
_JPEG_QUALITY = 75


def compress_screenshot(image: Image.Image) -> tuple[str, int, int, int, int]:
    """
    Resize *image* to at most _MAX_SCREENSHOT_WIDTH wide and encode as JPEG.

    Returns:
        (base64_string, original_width, original_height, sent_width, sent_height)

    This is a pure helper so it can be unit-tested without the full MCP stack.
    """
    orig_w, orig_h = image.size

    if orig_w > _MAX_SCREENSHOT_WIDTH:
        scale = _MAX_SCREENSHOT_WIDTH / orig_w
        new_w = _MAX_SCREENSHOT_WIDTH
        new_h = int(orig_h * scale)
        image = image.resize((new_w, new_h))

    sent_w, sent_h = image.size
    buf = io.BytesIO()
    # Flatten alpha channel onto white before JPEG encoding (JPEG has no alpha).
    if image.mode in ("RGBA", "LA", "P"):
        background = Image.new("RGB", image.size, (255, 255, 255))
        mask = image.convert("RGBA").split()[3]
        background.paste(image.convert("RGBA"), mask=mask)
        image = background
    else:
        image = image.convert("RGB")
    image.save(buf, format="JPEG", quality=_JPEG_QUALITY, optimize=True)
    img_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    return img_b64, orig_w, orig_h, sent_w, sent_h


class SnapshotTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:Snapshot",
            description="Captures screenshot of the desktop. Set use_vision=True for full resolution."
        )
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name=self.name,
            description=self.description,
            inputSchema={
                "type": "object",
                "properties": {
                    "use_vision": {
                        "type": "boolean",
                        "default": True,
                        "description": "Include screenshot (default: True)"
                    },
                    "use_dom": {
                        "type": "boolean",
                        "default": False,
                        "description": "Legacy parameter, ignored"
                    }
                },
                "required": []
            }
        )
    
    async def execute(self, arguments: dict) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
        use_vision = arguments.get("use_vision", True)  # Default to True
        
        try:
            results = []
            
            # ALWAYS capture screenshot - that's what users want
            screenshot = ImageGrab.grab()

            # Downscale to _MAX_SCREENSHOT_WIDTH to keep token count manageable.
            # A full 1920x1080 PNG can exceed 1 MB (≈250 K tokens); a 1280-wide
            # JPEG at quality 75 is typically under 100 KB (≈25 K tokens).
            img_b64, orig_w, orig_h, sent_w, sent_h = compress_screenshot(screenshot)

            # Return image
            results.append(ImageContent(
                type="image",
                data=img_b64,
                mimeType="image/jpeg"
            ))
            
            # Add text confirmation
            results.append(TextContent(
                type="text",
                text=f"Screenshot captured: {orig_w}x{orig_h} pixels (sent as {sent_w}x{sent_h} JPEG)"
            ))
            
            return results
            
        except Exception as e:
            error_msg = f"Screenshot failed: {str(e)}"
            return [TextContent(
                type="text",
                text=f"ERROR: {error_msg}"
            )]
