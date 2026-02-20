"""Type Tool - Keyboard typing"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import pyautogui

class TypeTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:Type", description="Types text at the current cursor position.",
                    inputSchema={"type": "object", "properties": {"text": {"type": "string"}}, "required": ["text"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["text"])
        pyautogui.write(arguments["text"], interval=0.05)
        return [TextContent(type="text", text=f"Typed: {arguments['text'][:50]}...")]
