"""
Task Scheduler Tool - Windows Task Scheduler operations
"""

import subprocess
from typing import Any, Sequence
from mcp.types import Tool, TextContent

class TaskSchedulerTool:
    """Manage Windows scheduled tasks"""
    
    requires_admin = True
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name="Windows-MCP:TaskScheduler",
            description="Create, delete, enable, disable, and list Windows scheduled tasks. Requires admin privileges.",
            inputSchema={
                "type": "object",
                "properties": {
                    "action": {
                        "type": "string",
                        "enum": ["list", "create", "delete", "enable", "disable", "run", "info"],
                        "description": "Task scheduler operation"
                    },
                    "task_name": {
                        "type": "string",
                        "description": "Name of the task"
                    },
                    "task_path": {
                        "type": "string",
                        "description": "Task path (default: \\)",
                        "default": "\\"
                    },
                    "command": {
                        "type": "string",
                        "description": "Command to run (for create action)"
                    },
                    "trigger": {
                        "type": "string",
                        "enum": ["DAILY", "WEEKLY", "MONTHLY", "ONCE", "ONSTART", "ONLOGON"],
                        "description": "Task trigger type (for create action)"
                    },
                    "start_time": {
                        "type": "string",
                        "description": "Start time in HH:MM format (for create action)"
                    }
                },
                "required": ["action"]
            }
        )
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        """Execute task scheduler operation"""
        action = arguments.get("action")
        task_name = arguments.get("task_name", "")
        task_path = arguments.get("task_path", "\\")
        
        try:
            if action == "list":
                result = subprocess.run(
                    ["schtasks", "/Query", "/FO", "LIST", "/V"],
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                return [TextContent(
                    type="text",
                    text=f"✓ Scheduled tasks:\n{result.stdout}"
                )]
            
            elif action == "create":
                command = arguments.get("command")
                trigger = arguments.get("trigger", "DAILY")
                start_time = arguments.get("start_time", "12:00")
                
                cmd = [
                    "schtasks", "/Create",
                    "/TN", task_name,
                    "/TR", command,
                    "/SC", trigger,
                    "/ST", start_time,
                    "/F"
                ]
                
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
                
                if result.returncode == 0:
                    return [TextContent(
                        type="text",
                        text=f"✓ Task created: {task_name}\nCommand: {command}\nTrigger: {trigger} at {start_time}"
                    )]
                else:
                    return [TextContent(
                        type="text",
                        text=f"✗ Failed to create task:\n{result.stderr}"
                    )]
            
            elif action == "delete":
                result = subprocess.run(
                    ["schtasks", "/Delete", "/TN", task_name, "/F"],
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                
                if result.returncode == 0:
                    return [TextContent(
                        type="text",
                        text=f"✓ Task deleted: {task_name}"
                    )]
                else:
                    return [TextContent(
                        type="text",
                        text=f"✗ Failed to delete task:\n{result.stderr}"
                    )]
            
            elif action == "enable":
                result = subprocess.run(
                    ["schtasks", "/Change", "/TN", task_name, "/ENABLE"],
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                return [TextContent(
                    type="text",
                    text=f"✓ Task enabled: {task_name}"
                )]
            
            elif action == "disable":
                result = subprocess.run(
                    ["schtasks", "/Change", "/TN", task_name, "/DISABLE"],
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                return [TextContent(
                    type="text",
                    text=f"✓ Task disabled: {task_name}"
                )]
            
            elif action == "run":
                result = subprocess.run(
                    ["schtasks", "/Run", "/TN", task_name],
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                return [TextContent(
                    type="text",
                    text=f"✓ Task started: {task_name}"
                )]
            
            elif action == "info":
                result = subprocess.run(
                    ["schtasks", "/Query", "/TN", task_name, "/FO", "LIST", "/V"],
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                return [TextContent(
                    type="text",
                    text=f"✓ Task info for {task_name}:\n{result.stdout}"
                )]
        
        except subprocess.TimeoutExpired:
            return [TextContent(
                type="text",
                text=f"✗ Operation timed out"
            )]
        except Exception as e:
            return [TextContent(
                type="text",
                text=f"✗ Task scheduler operation failed: {str(e)}"
            )]
