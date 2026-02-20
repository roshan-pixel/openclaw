"""MultiSelect Tool - Multiple selections"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import pyautogui

class MultiSelectTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:MultiSelect", description="Selects multiple items with Ctrl+Click.",
                    inputSchema={"type": "object", "properties": {"locations": {"type": "array", "items": {"type": "object"}}, "press_ctrl": {"type": "boolean", "default": True}}, "required": ["locations"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["locations"])
        count = len(arguments["locations"])
        for loc in arguments["locations"]:
            pyautogui.click(loc["x"], loc["y"])
        return [TextContent(type="text", text=f"Selected {count} items")]
