"""Shortcut Tool - Keyboard shortcuts"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import pyautogui

class ShortcutTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:Shortcut", description="Executes keyboard shortcuts like 'ctrl+c', 'win+r'.",
                    inputSchema={"type": "object", "properties": {"shortcut": {"type": "string"}}, "required": ["shortcut"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["shortcut"])
        keys = arguments["shortcut"].split("+")
        pyautogui.hotkey(*keys)
        return [TextContent(type="text", text=f"Executed: {arguments['shortcut']}")]
