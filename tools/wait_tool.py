"""Wait Tool - Pause execution"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import asyncio

class WaitTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:Wait", description="Pauses execution for specified duration in seconds.",
                    inputSchema={"type": "object", "properties": {"seconds": {"type": "number"}}, "required": ["seconds"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["seconds"])
        await asyncio.sleep(arguments["seconds"])
        return [TextContent(type="text", text=f"Waited {arguments['seconds']} seconds")]
