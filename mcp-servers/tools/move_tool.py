"""
Move Tool - Moves mouse cursor to coordinates
"""

import pyautogui
from typing import Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from . import BaseTool
import sys
sys.path.append('..')
from utils.logger import get_logger

logger = get_logger("move_tool")

class MoveTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:Move",
            description="Moves the mouse cursor to specified coordinates."
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
        
        try:
            pyautogui.moveTo(x, y, duration=0.2)
            result_text = f"Moved to ({x}, {y})"
            logger.info(result_text)
            return [TextContent(type="text", text=result_text)]
            
        except Exception as e:
            logger.error(f"Move failed: {e}", exc_info=True)
            return [TextContent(type="text", text=f"ERROR: {str(e)}")]
