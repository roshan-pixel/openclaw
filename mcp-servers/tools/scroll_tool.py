"""
Scroll Tool - Scrolls at coordinates or current mouse position
"""

import pyautogui
from typing import Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from . import BaseTool
import sys
sys.path.append('..')
from utils.logger import get_logger

logger = get_logger("scroll_tool")

class ScrollTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:Scroll",
            description="Scrolls at coordinates [x, y] or current position. "
                       "Type: vertical or horizontal. Direction: up/down/left/right."
        )
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name=self.name,
            description=self.description,
            inputSchema={
                "type": "object",
                "properties": {
                    "loc": {
                        "type": ["array", "null"],
                        "items": {"type": "integer"},
                        "description": "Coordinates [x, y] or null for current position",
                        "default": None
                    },
                    "type": {
                        "type": "string",
                        "enum": ["vertical", "horizontal"],
                        "default": "vertical"
                    },
                    "direction": {
                        "type": "string",
                        "enum": ["up", "down", "left", "right"],
                        "default": "down"
                    },
                    "wheel_times": {
                        "type": "integer",
                        "default": 1,
                        "minimum": 1,
                        "maximum": 20
                    }
                },
                "required": []
            }
        )
    
    async def execute(self, arguments: dict) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
        loc = arguments.get("loc")
        scroll_type = arguments.get("type", "vertical")
        direction = arguments.get("direction", "down")
        wheel_times = arguments.get("wheel_times", 1)
        
        try:
            if loc is not None:
                x, y = loc[0], loc[1]
                pyautogui.moveTo(x, y, duration=0.1)
                location_str = f"at [{x}, {y}]"
            else:
                location_str = "at current position"
            
            if scroll_type == "vertical":
                scroll_amount = wheel_times * 120 if direction == "up" else wheel_times * -120
                pyautogui.scroll(scroll_amount)
            else:
                scroll_amount = wheel_times * 120 if direction == "left" else wheel_times * -120
                pyautogui.hscroll(scroll_amount)
            
            result_text = f"Scrolled {direction} ({scroll_type}) {wheel_times}x {location_str}"
            logger.info(result_text)
            return [TextContent(type="text", text=result_text)]
            
        except Exception as e:
            logger.error(f"Scroll failed: {e}", exc_info=True)
            return [TextContent(type="text", text=f"ERROR: {str(e)}")]
