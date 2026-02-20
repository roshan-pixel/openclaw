"""
MultiSelect Tool - Selects multiple items (files, folders, checkboxes)
"""

import pyautogui
import time
from typing import Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from . import BaseTool
from utils.logger import get_logger

logger = get_logger("multiselect_tool")

class MultiSelectTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:MultiSelect",
            description="Selects multiple items such as files, folders, or checkboxes. "
                       "If press_ctrl=True, performs Ctrl+Click on each location. "
                       "If False, performs multiple separate clicks."
        )
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name=self.name,
            description=self.description,
            inputSchema={
                "type": "object",
                "properties": {
                    "locs": {
                        "type": "array",
                        "items": {
                            "type": "array",
                            "items": {"type": "integer"},
                            "minItems": 2,
                            "maxItems": 2
                        },
                        "description": "Array of coordinates [[x1, y1], [x2, y2], ...]"
                    },
                    "press_ctrl": {
                        "type": "boolean",
                        "default": True,
                        "description": "Hold Ctrl while clicking (for multi-select)"
                    }
                },
                "required": ["locs"]
            }
        )
    
    async def execute(self, arguments: dict) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
        locs = arguments["locs"]
        press_ctrl = arguments.get("press_ctrl", True)
        
        try:
            if press_ctrl:
                # Hold Ctrl and click each location
                pyautogui.keyDown('ctrl')
                time.sleep(0.05)
                
                for loc in locs:
                    x, y = loc[0], loc[1]
                    pyautogui.click(x, y, duration=0.05)
                    time.sleep(0.05)
                
                pyautogui.keyUp('ctrl')
                
                result_text = f"Multi-selected {len(locs)} items with Ctrl+Click"
            else:
                # Click each location separately
                for loc in locs:
                    x, y = loc[0], loc[1]
                    pyautogui.click(x, y, duration=0.05)
                    time.sleep(0.1)
                
                result_text = f"Clicked {len(locs)} locations separately"
            
            logger.info(result_text)
            
            return [TextContent(
                type="text",
                text=result_text
            )]
            
        except Exception as e:
            error_msg = f"MultiSelect failed: {str(e)}"
            logger.error(error_msg, exc_info=True)
            return [TextContent(
                type="text",
                text=f"ERROR: {error_msg}"
            )]
