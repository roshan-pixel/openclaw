"""
Execute Tool - Runs commands and applications
"""

import subprocess
import os
from typing import Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from . import BaseTool
import sys
sys.path.append('..')
from utils.logger import get_logger

logger = get_logger("execute_tool")

class ExecuteTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:Execute",
            description="Executes commands, opens apps, or runs scripts."
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
                        "description": "Command to execute (e.g., 'notepad', 'explorer C:\\')"
                    },
                    "wait": {
                        "type": "boolean",
                        "default": False,
                        "description": "Wait for command to complete"
                    }
                },
                "required": ["command"]
            }
        )
    
    async def execute(self, arguments: dict) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
        is_valid, error = self.validate_arguments(arguments, self.get_tool_definition().inputSchema)
        if not is_valid:
            return [TextContent(type="text", text=f"ERROR: {error}")]
        
        command = arguments["command"]
        wait = arguments.get("wait", False)
        
        try:
            if wait:
                result = subprocess.run(
                    command,
                    shell=True,
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                output = result.stdout if result.stdout else "Command completed"
                if result.stderr:
                    output += f"\nErrors: {result.stderr}"
                logger.info(f"Executed with wait: {command}")
                return [TextContent(type="text", text=output)]
            else:
                subprocess.Popen(command, shell=True)
                logger.info(f"Executed without wait: {command}")
                return [TextContent(type="text", text=f"Launched: {command}")]
                
        except subprocess.TimeoutExpired:
            logger.error(f"Command timeout: {command}")
            return [TextContent(type="text", text="ERROR: Command timeout (30s)")]
        except Exception as e:
            logger.error(f"Execute failed: {e}", exc_info=True)
            return [TextContent(type="text", text=f"ERROR: {str(e)}")]
