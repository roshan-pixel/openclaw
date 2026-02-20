"""
App Tool - Manages Windows applications
"""

import subprocess
import time
from typing import Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from . import BaseTool
import sys
sys.path.append('..')
from utils.logger import get_logger

try:
    import win32gui
    import win32con
    WIN32_AVAILABLE = True
except ImportError:
    WIN32_AVAILABLE = False

logger = get_logger("app_tool")

class AppTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:App",
            description="Manages Windows applications with three modes: "
                       "'launch' (opens application), 'resize' (adjusts window), 'switch' (focus window)."
        )
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name=self.name,
            description=self.description,
            inputSchema={
                "type": "object",
                "properties": {
                    "mode": {
                        "type": "string",
                        "enum": ["launch", "resize", "switch"],
                        "description": "Operation mode"
                    },
                    "name": {
                        "type": ["string", "null"],
                        "default": None,
                        "description": "App name (launch) or window title (switch)"
                    },
                    "window_size": {
                        "type": ["array", "null"],
                        "items": {"type": "integer"},
                        "default": None,
                        "description": "Window size [width, height]"
                    },
                    "window_loc": {
                        "type": ["array", "null"],
                        "items": {"type": "integer"},
                        "default": None,
                        "description": "Window position [x, y]"
                    }
                },
                "required": ["mode"]
            }
        )
    
    async def execute(self, arguments: dict) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
        mode = arguments["mode"]
        name = arguments.get("name")
        window_size = arguments.get("window_size")
        window_loc = arguments.get("window_loc")
        
        try:
            if mode == "launch":
                return await self._launch_app(name)
            elif mode == "resize":
                return await self._resize_window(window_size, window_loc)
            elif mode == "switch":
                return await self._switch_window(name)
        except Exception as e:
            return [TextContent(type="text", text=f"ERROR: {str(e)}")]
    
    async def _launch_app(self, name: str) -> Sequence[TextContent]:
        if not name:
            return [TextContent(type="text", text="ERROR: App name required")]
        
        app_map = {
            "notepad": "notepad.exe", "calculator": "calc.exe", "paint": "mspaint.exe",
            "cmd": "cmd.exe", "powershell": "powershell.exe", "explorer": "explorer.exe"
        }
        
        executable = app_map.get(name.lower(), name)
        process = subprocess.Popen(executable, shell=True)
        time.sleep(1.0)
        
        return [TextContent(type="text", text=f"Launched: {name} (PID: {process.pid})")]
    
    async def _resize_window(self, window_size, window_loc) -> Sequence[TextContent]:
        if not WIN32_AVAILABLE:
            return [TextContent(type="text", text="ERROR: win32gui not available")]
        
        hwnd = win32gui.GetForegroundWindow()
        
        if window_size:
            width, height = window_size
            x = window_loc[0] if window_loc else 0
            y = window_loc[1] if window_loc else 0
            win32gui.MoveWindow(hwnd, x, y, width, height, True)
            return [TextContent(type="text", text=f"Resized to {width}x{height}")]
        
        return [TextContent(type="text", text="ERROR: window_size required")]
    
    async def _switch_window(self, title: str) -> Sequence[TextContent]:
        if not title or not WIN32_AVAILABLE:
            return [TextContent(type="text", text="ERROR: Title required")]
        
        def callback(hwnd, windows):
            if win32gui.IsWindowVisible(hwnd):
                window_title = win32gui.GetWindowText(hwnd)
                if title.lower() in window_title.lower():
                    windows.append((hwnd, window_title))
            return True
        
        windows = []
        win32gui.EnumWindows(callback, windows)
        
        if windows:
            hwnd, window_title = windows[0]
            win32gui.ShowWindow(hwnd, win32con.SW_RESTORE)
            win32gui.SetForegroundWindow(hwnd)
            return [TextContent(type="text", text=f"Switched to: {window_title}")]
        
        return [TextContent(type="text", text=f"ERROR: Window '{title}' not found")]
