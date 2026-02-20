"""
Shell Tool - Execute shell commands with admin privileges
"""
import subprocess
import logging
from typing import Sequence
from mcp.types import Tool, TextContent

from tools.base_tool import BaseTool

logger = logging.getLogger(__name__)


class ShellTool(BaseTool):
    """Execute shell commands via PowerShell or CMD with GodMode."""
    
    requires_admin = True  # For GodMode
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name="Windows-MCP:Shell",
            description="[GODMODE] Executes shell commands via PowerShell or CMD with administrator privileges. Returns stdout, stderr, and exit code.",
            inputSchema={
                "type": "object",
                "properties": {
                    "command": {
                        "type": "string",
                        "description": "The command to execute"
                    },
                    "shell": {
                        "type": "string",
                        "description": "Shell to use: 'powershell' or 'cmd' (default: powershell)",
                        "enum": ["powershell", "cmd"],
                        "default": "powershell"
                    },
                    "timeout": {
                        "type": "number",
                        "description": "Timeout in seconds (default: 30)",
                        "default": 30
                    }
                },
                "required": ["command"]
            }
        )
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["command"])
        
        command = arguments["command"]
        shell = arguments.get("shell", "powershell")
        timeout = arguments.get("timeout", 30)
        
        logger.info(f"[GODMODE] Executing shell command: {command}")
        logger.info(f"  Shell: {shell}, Timeout: {timeout}s")
        
        try:
            # Prepare command based on shell
            if shell == "powershell":
                full_command = ["powershell", "-Command", command]
            else:  # cmd
                full_command = ["cmd", "/c", command]
            
            # Execute command with admin privileges (inherited from run_godmode.py)
            result = subprocess.run(
                full_command,
                capture_output=True,
                text=True,
                timeout=timeout
            )
            
            # Format output
            output = []
            
            if result.stdout:
                output.append(f"STDOUT:\n{result.stdout}")
            
            if result.stderr:
                output.append(f"STDERR:\n{result.stderr}")
            
            output.append(f"\nExit Code: {result.returncode}")
            
            response_text = "\n\n".join(output)
            
            logger.info(f"[GODMODE] Command executed (exit code: {result.returncode})")
            
            return [TextContent(
                type="text",
                text=response_text
            )]
            
        except subprocess.TimeoutExpired:
            error_msg = f"Command timed out after {timeout} seconds"
            logger.error(error_msg)
            return [TextContent(
                type="text",
                text=f"ERROR: {error_msg}"
            )]
            
        except Exception as e:
            error_msg = f"Command execution failed: {str(e)}"
            logger.error(error_msg, exc_info=True)
            return [TextContent(
                type="text",
                text=f"ERROR: {error_msg}"
            )]
