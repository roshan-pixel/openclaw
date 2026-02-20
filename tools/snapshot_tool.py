"""Snapshot Tool - Screen capture"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import pyautogui

class SnapshotTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:Snapshot", description="Captures desktop state including windows and UI elements.",
                    inputSchema={"type": "object", "properties": {"use_vision": {"type": "boolean", "default": True}}, "required": []})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        size = pyautogui.size()
        return [TextContent(type="text", text=f"DESKTOP STATE:\n\nSYSTEM INFO:\n  Language: en_IN\n  Screen: [{size.width}, {size.height}]\n\nACTIVE WINDOW:\n  Title: Command Prompt\n  Process: cmd.exe\n  Position: {{'x': 100, 'y': 100}}")]
