"""Move Tool - Mouse movement"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import pyautogui

class MoveTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:Move", description="Moves the mouse cursor to specified coordinates.",
                    inputSchema={"type": "object", "properties": {"x": {"type": "number"}, "y": {"type": "number"}}, "required": ["x", "y"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["x", "y"])
        pyautogui.moveTo(arguments["x"], arguments["y"])
        return [TextContent(type="text", text=f"Moved to ({arguments['x']}, {arguments['y']})")]
