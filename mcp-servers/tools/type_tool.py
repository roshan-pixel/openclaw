"""
Type Tool - Types text at current cursor position
"""

import pyautogui
from typing import Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from . import BaseTool
import sys
sys.path.append('..')
from utils.logger import get_logger

logger = get_logger("type_tool")

class TypeTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:Type",
            description="Types text at the current cursor position."
        )
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name=self.name,
            description=self.description,
            inputSchema={
                "type": "object",
                "properties": {
                    "text": {
                        "type": "string",
                        "description": "Text to type"
                    }
                },
                "required": ["text"]
            }
        )
    
    async def execute(self, arguments: dict) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
        is_valid, error = self.validate_arguments(arguments, self.get_tool_definition().inputSchema)
        if not is_valid:
            return [TextContent(type="text", text=f"ERROR: {error}")]
        
        text = arguments["text"]
        
        try:
            pyautogui.write(text, interval=0.05)
            result_text = f"Typed {len(text)} characters"
            logger.info(result_text)
            return [TextContent(type="text", text=result_text)]
            
        except Exception as e:
            logger.error(f"Type failed: {e}", exc_info=True)
            return [TextContent(type="text", text=f"ERROR: {str(e)}")]
