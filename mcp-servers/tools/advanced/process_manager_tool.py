"""
Process Manager Tool - Kill processes and manage services
"""

import subprocess
import psutil
from typing import Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from .. import BaseTool
import sys
sys.path.append('../..')
from utils.logger import get_logger
from utils.admin import check_admin_privileges

logger = get_logger("process_manager_tool")

class ProcessManagerTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:ProcessManager",
            description="Kill processes by name or PID, list running processes, and get detailed process information."
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
                        "enum": ["kill_by_name", "kill_by_pid", "list_processes", "get_info"],
                        "description": "Action to perform"
                    },
                    "target": {
                        "type": "string",
                        "description": "Process name or PID"
                    },
                    "force": {
                        "type": "boolean",
                        "default": False,
                        "description": "Force kill"
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
        force = arguments.get("force", False)

        try:
            if action == "kill_by_name":
                cmd = ["taskkill", "/IM", target]
                if force:
                    cmd.insert(1, "/F")
                result = subprocess.run(cmd, capture_output=True, text=True)
                return [TextContent(type="text", text=f"Killed: {target}\n{result.stdout}")]
            
            elif action == "kill_by_pid":
                cmd = ["taskkill", "/PID", target]
                if force:
                    cmd.insert(1, "/F")
                result = subprocess.run(cmd, capture_output=True, text=True)
                return [TextContent(type="text", text=f"Killed PID: {target}\n{result.stdout}")]
            
            elif action == "list_processes":
                procs = []
                for p in psutil.process_iter(['pid', 'name', 'memory_info']):
                    try:
                        mem_mb = p.info['memory_info'].rss / 1024 / 1024
                        procs.append(f"{p.info['pid']} - {p.info['name']} - {mem_mb:.1f}MB")
                    except:
                        pass
                return [TextContent(type="text", text="\n".join(procs[:50]))]
            
            elif action == "get_info":
                for p in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info']):
                    if p.info['name'] == target or str(p.info['pid']) == target:
                        mem_mb = p.info['memory_info'].rss / 1024 / 1024
                        cpu = p.info.get('cpu_percent', 0)
                        info = f"PID: {p.info['pid']}\nName: {p.info['name']}\nCPU: {cpu}%\nMemory: {mem_mb:.1f}MB"
                        return [TextContent(type="text", text=info)]
                return [TextContent(type="text", text=f"Process not found: {target}")]
        
        except Exception as e:
            return [TextContent(type="text", text=f"ERROR: {str(e)}")]
