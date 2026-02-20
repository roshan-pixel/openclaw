"""
Wait Tool - Pauses execution for specified duration
"""

import asyncio
from typing import Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from . import BaseTool
from utils.logger import get_logger

logger = get_logger("wait_tool")

class WaitTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:Wait",
            description="Pauses execution for specified duration in seconds. "
                       "Use when waiting for: applications to launch/load, UI animations to complete, "
                       "page content to render, dialogs to appear, or between rapid actions."
        )
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name=self.name,
            description=self.description,
            inputSchema={
                "type": "object",
                "properties": {
                    "duration": {
                        "type": "integer",
                        "description": "Duration to wait in seconds",
                        "minimum": 1,
                        "maximum": 30
                    }
                },
                "required": ["duration"]
            }
        )
    
    async def execute(self, arguments: dict) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
        duration = arguments["duration"]
        
        try:
            logger.info(f"Waiting for {duration} seconds...")
            await asyncio.sleep(duration)
            
            result_text = f"Waited for {duration} second(s)"
            logger.info(result_text)
            
            return [TextContent(
                type="text",
                text=result_text
            )]
            
        except Exception as e:
            error_msg = f"Wait failed: {str(e)}"
            logger.error(error_msg, exc_info=True)
            return [TextContent(
                type="text",
                text=f"ERROR: {error_msg}"
            )]
