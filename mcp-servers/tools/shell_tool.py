"""
Shell Tool - Executes shell commands
"""

import subprocess
from typing import Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from . import BaseTool
import sys
sys.path.append('..')
from utils.logger import get_logger
from utils.admin import check_admin_privileges

logger = get_logger("shell_tool")

class ShellTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:Shell",
            description="Executes shell commands via PowerShell or CMD. "
                       "Returns stdout, stderr, and exit code."
        )
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name=self.name,
            description=self.description,
            inputSchema={
                "type": "object",
                "properties": {
                    "command": {
                        "type": "string",
                        "description": "Shell command to execute"
                    },
                    "shell": {
                        "type": "string",
                        "enum": ["powershell", "cmd"],
                        "default": "powershell",
                        "description": "Shell type"
                    },
                    "timeout": {
                        "type": "integer",
                        "default": 30,
                        "minimum": 1,
                        "maximum": 300,
                        "description": "Timeout in seconds"
                    },
                    "confirmed": {
                        "type": "boolean",
                        "default": False,
                        "description": "Set to true to confirm you intend to execute this command. Required acknowledgement for shell execution."
                    }
                },
                "required": ["command", "confirmed"]
            }
        )

    async def execute(self, arguments: dict) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
        is_valid, error = self.validate_arguments(arguments, self.get_tool_definition().inputSchema)
        if not is_valid:
            return [TextContent(type="text", text=f"ERROR: {error}")]

        if not arguments.get("confirmed", False):
            return [TextContent(type="text", text="ERROR: Shell execution requires confirmed=true. Set confirmed=true to acknowledge you intend to run this command.")]

        command = arguments["command"]
        shell = arguments.get("shell", "powershell")
        timeout = arguments.get("timeout", 30)
        
        try:
            is_admin = check_admin_privileges()
            
            if shell == "powershell":
                full_command = ["powershell", "-Command", command]
            else:
                full_command = ["cmd", "/c", command]
            
            logger.info(f"Executing {shell} command: {command}")
            
            result = subprocess.run(full_command, capture_output=True, text=True, timeout=timeout)
            
            response_text = f"Command executed via {shell}\nExit Code: {result.returncode}\n"
            response_text += f"Admin: {'Yes' if is_admin else 'No'}\n\n"
            
            if result.stdout:
                response_text += f"STDOUT:\n{result.stdout}\n"
            if result.stderr:
                response_text += f"\nSTDERR:\n{result.stderr}\n"
            
            return [TextContent(type="text", text=response_text)]
            
        except subprocess.TimeoutExpired:
            return [TextContent(type="text", text=f"ERROR: Timeout after {timeout}s")]
        except Exception as e:
            return [TextContent(type="text", text=f"ERROR: {str(e)}")]
