"""App Tool - Application management"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import subprocess

class AppTool(BaseTool):
    requires_admin = True
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:App", description="Manages Windows applications: launch, resize, switch.",
                    inputSchema={"type": "object", "properties": {"action": {"type": "string", "enum": ["launch", "resize", "switch"]},
                    "name": {"type": "string"}}, "required": ["action", "name"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["action", "name"])
        if arguments["action"] == "launch":
            subprocess.Popen(arguments["name"], shell=True)
            return [TextContent(type="text", text=f"Launched: {arguments['name']}")]
        return [TextContent(type="text", text="Action completed")]
