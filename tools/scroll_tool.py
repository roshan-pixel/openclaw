"""Scroll Tool - Mouse scrolling"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import pyautogui

class ScrollTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:Scroll", description="Scrolls at specified coordinates.",
                    inputSchema={"type": "object", "properties": {"amount": {"type": "number"}, "x": {"type": "number"}, "y": {"type": "number"}}, "required": ["amount"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["amount"])
        if "x" in arguments and "y" in arguments:
            pyautogui.moveTo(arguments["x"], arguments["y"])
        pyautogui.scroll(int(arguments["amount"]))
        return [TextContent(type="text", text=f"Scrolled {arguments['amount']} units")]
