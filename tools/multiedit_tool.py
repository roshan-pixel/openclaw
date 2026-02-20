"""MultiEdit Tool - Multiple text edits"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import pyautogui

class MultiEditTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:MultiEdit", description="Edits multiple text fields by clicking and typing.",
                    inputSchema={"type": "object", "properties": {"edits": {"type": "array", "items": {"type": "object"}}}, "required": ["edits"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["edits"])
        count = len(arguments["edits"])
        for edit in arguments["edits"]:
            pyautogui.click(edit["x"], edit["y"])
            pyautogui.write(edit["text"])
        return [TextContent(type="text", text=f"Edited {count} fields")]
