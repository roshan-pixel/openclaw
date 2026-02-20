"""
MultiEdit Tool - Edit multiple text fields sequentially
"""

import pyautogui
import time
from typing import Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from . import BaseTool
import sys
sys.path.append('..')
from utils.logger import get_logger

logger = get_logger("multiedit_tool")

class MultiEditTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:MultiEdit",
            description="Edits multiple text fields by clicking and typing at multiple locations."
        )
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name=self.name,
            description=self.description,
            inputSchema={
                "type": "object",
                "properties": {
                    "edits": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "location": {
                                    "type": "array",
                                    "items": {"type": "integer"},
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "description": "Coordinates [x, y] of text field"
                                },
                                "text": {
                                    "type": "string",
                                    "description": "Text to type"
                                },
                                "clear": {
                                    "type": "boolean",
                                    "default": False,
                                    "description": "Clear existing text first"
                                }
                            },
                            "required": ["location", "text"]
                        },
                        "description": "Array of edit operations",
                        "minItems": 1
                    },
                    "delay": {
                        "type": "number",
                        "default": 0.5,
                        "description": "Delay between edits in seconds"
                    }
                },
                "required": ["edits"]
            }
        )
    
    async def execute(self, arguments: dict) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
        is_valid, error = self.validate_arguments(arguments, self.get_tool_definition().inputSchema)
        if not is_valid:
            return [TextContent(type="text", text=f"ERROR: {error}")]
        
        edits = arguments["edits"]
        delay = arguments.get("delay", 0.5)
        
        try:
            edited_count = 0
            
            for edit in edits:
                location = edit["location"]
                text = edit["text"]
                clear = edit.get("clear", False)
                
                x, y = location[0], location[1]
                
                # Click to focus
                pyautogui.click(x, y)
                time.sleep(0.2)
                
                # Clear if requested
                if clear:
                    pyautogui.hotkey('ctrl', 'a')
                    time.sleep(0.05)
                    pyautogui.press('delete')
                    time.sleep(0.05)
                
                # Type text
                pyautogui.write(text, interval=0.01)
                edited_count += 1
                
                logger.info(f"Edited field at [{x}, {y}]: '{text}'")
                
                # Delay before next edit
                if edited_count < len(edits):
                    time.sleep(delay)
            
            result_text = f"Completed {edited_count} edits"
            logger.info(result_text)
            
            return [TextContent(type="text", text=result_text)]
            
        except Exception as e:
            logger.error(f"MultiEdit failed: {e}", exc_info=True)
            return [TextContent(type="text", text=f"ERROR: {str(e)}")]
