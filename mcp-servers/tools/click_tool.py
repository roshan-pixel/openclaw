"""
Click Tool - Performs mouse clicks at specified coordinates
"""

import pyautogui
from typing import Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from . import BaseTool
import sys
sys.path.append('..')
from utils.logger import get_logger

logger = get_logger("click_tool")

class ClickTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:Click",
            description="Performs mouse clicks at specified coordinates."
        )
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name=self.name,
            description=self.description,
            inputSchema={
                "type": "object",
                "properties": {
                    "x": {
                        "type": "integer",
                        "description": "X coordinate"
                    },
                    "y": {
                        "type": "integer",
                        "description": "Y coordinate"
                    },
                    "button": {
                        "type": "string",
                        "enum": ["left", "right", "middle"],
                        "default": "left",
                        "description": "Mouse button to click"
                    },
                    "clicks": {
                        "type": "integer",
                        "default": 1,
                        "minimum": 1,
                        "maximum": 3,
                        "description": "Number of clicks (1-3)"
                    }
                },
                "required": ["x", "y"]
            }
        )
    
    async def execute(self, arguments: dict) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
        is_valid, error = self.validate_arguments(arguments, self.get_tool_definition().inputSchema)
        if not is_valid:
            return [TextContent(type="text", text=f"ERROR: {error}")]
        
        x = arguments["x"]
        y = arguments["y"]
        button = arguments.get("button", "left")
        clicks = arguments.get("clicks", 1)
        
        try:
            pyautogui.click(x, y, clicks=clicks, button=button)
            result_text = f"Clicked {button} button {clicks}x at ({x}, {y})"
            logger.info(result_text)
            return [TextContent(type="text", text=result_text)]
            
        except Exception as e:
            logger.error(f"Click failed: {e}", exc_info=True)
            return [TextContent(type="text", text=f"ERROR: {str(e)}")]
