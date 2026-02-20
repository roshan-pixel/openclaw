"""
File Operations Tool - Advanced file management
"""

import os
import shutil
import glob
from typing import Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from .. import BaseTool
import sys
sys.path.append('../..')
from utils.logger import get_logger

logger = get_logger("file_ops_tool")

class FileOperationsTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:FileOps",
            description="Advanced file operations: bulk rename, search, copy, move, delete with patterns."
        )
        self.requires_admin = False

    def get_tool_definition(self):
        return Tool(
            name=self.name,
            description=self.description,
            inputSchema={
                "type": "object",
                "properties": {
                    "action": {
                        "type": "string",
                        "enum": ["search", "bulk_delete", "disk_usage", "list_files"],
                        "description": "Action to perform"
                    },
                    "path": {
                        "type": "string",
                        "description": "File or directory path"
                    },
                    "pattern": {
                        "type": "string",
                        "description": "Search pattern (e.g., *.txt)"
                    }
                },
                "required": ["action", "path"]
            }
        )

    async def execute(self, arguments):
        is_valid, error = self.validate_arguments(arguments, self.get_tool_definition().inputSchema)
        if not is_valid:
            return [TextContent(type="text", text=f"ERROR: {error}")]

        action = arguments["action"]
        path = arguments["path"]
        pattern = arguments.get("pattern", "*")

        try:
            if action == "search":
                search_path = os.path.join(path, "**", pattern)
                files = glob.glob(search_path, recursive=True)
                result = f"Found {len(files)} files:\n" + "\n".join(files[:100])
                if len(files) > 100:
                    result += f"\n... and {len(files) - 100} more"
                return [TextContent(type="text", text=result)]
            
            elif action == "disk_usage":
                if os.path.exists(path):
                    total, used, free = shutil.disk_usage(path)
                    result = f"Disk Usage for {path}:\n"
                    result += f"Total: {total / 1024**3:.1f} GB\n"
                    result += f"Used: {used / 1024**3:.1f} GB\n"
                    result += f"Free: {free / 1024**3:.1f} GB"
                    return [TextContent(type="text", text=result)]
                else:
                    return [TextContent(type="text", text=f"ERROR: Path does not exist: {path}")]
            
            elif action == "list_files":
                if os.path.isdir(path):
                    files = os.listdir(path)[:100]
                    result = f"Files in {path}:\n" + "\n".join(files)
                    return [TextContent(type="text", text=result)]
                else:
                    return [TextContent(type="text", text=f"ERROR: Not a directory: {path}")]
            
            elif action == "bulk_delete":
                search_path = os.path.join(path, pattern)
                files = glob.glob(search_path)
                count = 0
                for f in files:
                    try:
                        if os.path.isfile(f):
                            os.remove(f)
                            count += 1
                    except:
                        pass
                return [TextContent(type="text", text=f"Deleted {count} files")]
        
        except Exception as e:
            return [TextContent(type="text", text=f"ERROR: {str(e)}")]
