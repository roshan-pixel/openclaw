"""
Service Manager Tool - Control Windows services
"""

import subprocess
from typing import Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from .. import BaseTool
import sys
sys.path.append('../..')
from utils.logger import get_logger

logger = get_logger("service_manager_tool")

class ServiceManagerTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:ServiceManager",
            description="Start, stop, restart Windows services and query service status."
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
                        "enum": ["start", "stop", "restart", "status", "list"],
                        "description": "Action to perform"
                    },
                    "service_name": {
                        "type": "string",
                        "description": "Service name"
                    },
                    "confirmed": {
                        "type": "boolean",
                        "default": False,
                        "description": "Set to true to confirm start/stop/restart operations. Required for any action that changes service state."
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
        service = arguments.get("service_name")

        # Require explicit confirmation for state-changing operations
        if action in ("start", "stop", "restart") and not arguments.get("confirmed", False):
            return [TextContent(type="text", text=f"ERROR: Service {action} requires confirmed=true. Set confirmed=true to acknowledge this will change service state.")]

        try:
            if action == "list":
                result = subprocess.run(["sc", "query", "type=", "service", "state=", "all"], 
                                      capture_output=True, text=True)
                return [TextContent(type="text", text=result.stdout[:2000])]
            
            elif action == "status":
                if not service:
                    return [TextContent(type="text", text="ERROR: service_name required")]
                result = subprocess.run(["sc", "query", service], capture_output=True, text=True)
                return [TextContent(type="text", text=result.stdout)]
            
            elif action == "start":
                if not service:
                    return [TextContent(type="text", text="ERROR: service_name required")]
                result = subprocess.run(["sc", "start", service], capture_output=True, text=True)
                return [TextContent(type="text", text=f"Started: {service}\n{result.stdout}")]
            
            elif action == "stop":
                if not service:
                    return [TextContent(type="text", text="ERROR: service_name required")]
                result = subprocess.run(["sc", "stop", service], capture_output=True, text=True)
                return [TextContent(type="text", text=f"Stopped: {service}\n{result.stdout}")]
            
            elif action == "restart":
                if not service:
                    return [TextContent(type="text", text="ERROR: service_name required")]
                subprocess.run(["sc", "stop", service], capture_output=True)
                import time
                time.sleep(2)
                result = subprocess.run(["sc", "start", service], capture_output=True, text=True)
                return [TextContent(type="text", text=f"Restarted: {service}\n{result.stdout}")]
        
        except Exception as e:
            return [TextContent(type="text", text=f"ERROR: {str(e)}")]
