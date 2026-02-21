#!/usr/bin/env python3
"""
Smoke tests for WinClaw MCP security hardening.

These tests do NOT require a live Windows machine or a running gateway.
They validate config-level and unit-level logic only.

Run with: pytest mcp-servers/test_smoke.py -v
"""

import importlib
import os
import re
import sys
import types
import pytest


def _read(path: str) -> str:
    """Read a file with UTF-8 encoding."""
    with open(path, encoding="utf-8") as f:
        return f.read()


REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MCP_SERVERS = os.path.join(REPO_ROOT, "mcp-servers")
UTILS = os.path.join(REPO_ROOT, "utils")

# ---------------------------------------------------------------------------
# PHASE 0 – secret containment
# ---------------------------------------------------------------------------

class TestSecretContainment:
    """No live secrets must exist in committed files."""

    SENSITIVE_PATTERNS = [
        "sk-ant-api03-",       # Anthropic key prefix with API version
        "AIzaSy",              # Google/Gemini API key prefix
    ]

    def test_no_live_anthropic_key_in_env_backup(self):
        path = os.path.join(REPO_ROOT, ".env.backup")
        if not os.path.exists(path):
            pytest.skip(".env.backup not found")
        content = _read(path)
        for pattern in self.SENSITIVE_PATTERNS:
            assert pattern not in content, (
                f"Live credential pattern '{pattern}' found in .env.backup – rotate and replace with placeholder."
            )

    def test_no_live_keys_in_env_example(self):
        for path in [
            os.path.join(MCP_SERVERS, ".env.example"),
            os.path.join(REPO_ROOT, ".env.example"),
        ]:
            if not os.path.exists(path):
                continue
            content = _read(path)
            for pattern in self.SENSITIVE_PATTERNS:
                assert pattern not in content, (
                    f"Live credential pattern '{pattern}' found in {path}."
                )


# ---------------------------------------------------------------------------
# PHASE 1 – requirements completeness
# ---------------------------------------------------------------------------

class TestRequirements:
    def test_requirements_txt_exists(self):
        path = os.path.join(MCP_SERVERS, "requirements.txt")
        assert os.path.exists(path), "mcp-servers/requirements.txt not found"

    def test_requirements_contains_core_packages(self):
        path = os.path.join(MCP_SERVERS, "requirements.txt")
        content = _read(path).lower()
        for pkg in ("mcp", "fastapi", "uvicorn", "pydantic", "pillow", "pyautogui", "python-dotenv"):
            assert pkg in content, f"Package '{pkg}' missing from requirements.txt"


# ---------------------------------------------------------------------------
# PHASE 1 – logger utility
# ---------------------------------------------------------------------------

class TestLoggerUtility:
    def test_get_logger_is_callable(self):
        sys.path.insert(0, REPO_ROOT)
        from utils.logger import get_logger
        log = get_logger("test_logger")
        assert log is not None
        assert hasattr(log, "info")


# ---------------------------------------------------------------------------
# PHASE 2 / 3 – gateway security config (env-driven, no live server)
# ---------------------------------------------------------------------------

class TestGatewayConfig:
    """Validate gateway security defaults by inspecting source without starting the server."""

    def _gateway_source(self) -> str:
        return _read(os.path.join(MCP_SERVERS, "winclaw_gateway.py"))

    def test_no_hardcoded_default_api_keys(self):
        src = self._gateway_source()
        assert "dev-key-123" not in src, "Insecure default API key 'dev-key-123' still present in gateway"
        assert "test-key-456" not in src, "Insecure default API key 'test-key-456' still present in gateway"

    def test_cors_not_wildcard(self):
        src = self._gateway_source()
        assert 'allow_origins=["*"]' not in src, "Gateway CORS must not be set to wildcard '*'"

    def test_bind_defaults_to_localhost(self):
        src = self._gateway_source()
        assert '"0.0.0.0"' not in src, "Gateway must not hard-code bind host 0.0.0.0"

    def test_rate_limit_middleware_present(self):
        src = self._gateway_source()
        assert "RateLimitMiddleware" in src, "RateLimitMiddleware missing from gateway"

    def test_request_size_middleware_present(self):
        src = self._gateway_source()
        assert "RequestSizeLimitMiddleware" in src, "RequestSizeLimitMiddleware missing from gateway"

    def test_requires_api_key_env_var(self):
        """Gateway source must raise when WinClaw_API_KEYS is unset."""
        src = self._gateway_source()
        assert "WinClaw_API_KEYS" in src
        assert "RuntimeError" in src, "Gateway must raise RuntimeError when WinClaw_API_KEYS is absent"


# ---------------------------------------------------------------------------
# PHASE 3 – shell tool destructive-command guard
# ---------------------------------------------------------------------------

class TestShellToolGuard:
    """Unit-test the destructive-command pattern without executing real subprocesses."""

    # Compile the same pattern inline so we validate intent independently of
    # source extraction; the pattern must match shell_tool._DESTRUCTIVE_PATTERNS.
    _PAT = re.compile(
        r"\b(Remove-Item|del\b|rd\b|rmdir|format|reg\s+delete|Stop-Service|"
        r"sc\s+delete|net\s+user|shutdown|restart-computer)\b",
        re.IGNORECASE,
    )

    def test_destructive_pattern_matches_remove_item(self):
        assert self._PAT.search("Remove-Item C:\\temp\\file.txt")

    def test_destructive_pattern_matches_del(self):
        assert self._PAT.search("del /f /q C:\\temp\\file.txt")

    def test_destructive_pattern_does_not_match_get_command(self):
        assert not self._PAT.search("Get-ChildItem C:\\Users")

    def test_destructive_pattern_does_not_match_echo(self):
        assert not self._PAT.search("echo Hello World")

    def test_confirmed_flag_in_schema(self):
        """The shell tool schema must expose the 'confirmed' boolean field."""
        src = _read(os.path.join(MCP_SERVERS, "tools", "shell_tool.py"))
        assert '"confirmed"' in src, "Shell tool schema missing 'confirmed' field"
        assert "SHELL_REQUIRE_CONFIRM" in src, "Shell tool must read SHELL_REQUIRE_CONFIRM env var"
