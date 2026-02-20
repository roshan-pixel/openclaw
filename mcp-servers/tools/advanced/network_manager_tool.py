"""
Network Manager Tool - Network operations and monitoring
"""

import subprocess
from typing import Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from .. import BaseTool
import sys
sys.path.append('../..')
from utils.logger import get_logger

logger = get_logger("network_manager_tool")

class NetworkManagerTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:NetworkManager",
            description="Network operations: active connections, port info, DNS flush, network stats."
        )
        self.requires_admin = True

    def get_tool_definition(self):
        return Tool(
            name=self.name,
            description=self.description,
            inputSchema={
                "type": "object",
                "properties": {
                    "action": {
                        "type": "string",
                        "enum": ["connections", "dns_flush", "netstat", "ipconfig", "ping"],
                        "description": "Action to perform"
                    },
                    "target": {
                        "type": "string",
                        "description": "Target host for ping"
                    }
                },
                "required": ["action"]
            }
        )

    async def execute(self, arguments):
        is_valid, error = self.validate_arguments(arguments, self.get_tool_definition().inputSchema)
        if not is_valid:
            return [TextContent(type="text", text=f"ERROR: {error}")]

        action = arguments["action"]
        target = arguments.get("target")

        try:
            if action == "connections":
                result = subprocess.run(["netstat", "-ano"], capture_output=True, text=True)
                return [TextContent(type="text", text=result.stdout[:2000])]
            
            elif action == "dns_flush":
                result = subprocess.run(["ipconfig", "/flushdns"], capture_output=True, text=True)
                return [TextContent(type="text", text=result.stdout)]
            
            elif action == "netstat":
                result = subprocess.run(["netstat", "-s"], capture_output=True, text=True)
                return [TextContent(type="text", text=result.stdout[:2000])]
            
            elif action == "ipconfig":
                result = subprocess.run(["ipconfig", "/all"], capture_output=True, text=True)
                return [TextContent(type="text", text=result.stdout)]
            
            elif action == "ping":
                if not target:
                    return [TextContent(type="text", text="ERROR: target required for ping")]
                result = subprocess.run(["ping", "-n", "4", target], capture_output=True, text=True)
                return [TextContent(type="text", text=result.stdout)]
        
        except Exception as e:
            return [TextContent(type="text", text=f"ERROR: {str(e)}")]
