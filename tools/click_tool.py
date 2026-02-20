"""Click Tool - Mouse clicking"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import pyautogui

class ClickTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:Click", description="Performs mouse clicks at specified coordinates.",
                    inputSchema={"type": "object", "properties": {"x": {"type": "number"}, "y": {"type": "number"},
                    "button": {"type": "string", "enum": ["left", "right", "middle"], "default": "left"}}, "required": ["x", "y"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["x", "y"])
        pyautogui.click(arguments["x"], arguments["y"], button=arguments.get("button", "left"))
        return [TextContent(type="text", text=f"Clicked at ({arguments['x']}, {arguments['y']})")]
