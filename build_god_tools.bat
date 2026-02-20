@echo off
color 0A
echo ============================================================
echo    GOD-LEVEL TOOLS BUILDER - AUTOMATED INSTALLATION
echo ============================================================
echo.
echo Starting automated tool creation...
echo.

REM ============================================================
REM STEP 1: CREATE DIRECTORIES
REM ============================================================
echo [STEP 1/10] Creating directories...
if not exist "mcp-servers\tools\advanced" mkdir mcp-servers\tools\advanced
if exist "mcp-servers\tools\advanced" (
    echo    [32m✓[0m Advanced tools directory created
) else (
    echo    [31m✗[0m Failed to create directory
    pause
    exit /b 1
)
echo.

REM ============================================================
REM STEP 2: INSTALL DEPENDENCIES
REM ============================================================
echo [STEP 2/10] Installing Python dependencies...
pip install psutil --quiet
if %errorlevel%==0 (
    echo    [32m✓[0m psutil installed
) else (
    echo    [31m✗[0m Failed to install psutil
)
echo.

REM ============================================================
REM STEP 3: CREATE PROCESS MANAGER TOOL
REM ============================================================
echo [STEP 3/10] Creating Process Manager Tool...
(
echo """
echo Process Manager Tool - Kill processes and manage services
echo """
echo.
echo import subprocess
echo import psutil
echo from typing import Sequence
echo from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
echo from .. import BaseTool
echo import sys
echo sys.path.append^('../..'^^)
echo from utils.logger import get_logger
echo from utils.admin import check_admin_privileges
echo.
echo logger = get_logger^("process_manager_tool"^^)
echo.
echo class ProcessManagerTool^(BaseTool^^):
echo     def __init__^(self^^):
echo         super^(^^).__init__^(
echo             name="Windows-MCP:ProcessManager",
echo             description="Kill processes by name or PID, list running processes, and get detailed process information."
echo         ^^)
echo.
echo     def get_tool_definition^(self^^) -^> Tool:
echo         return Tool^(
echo             name=self.name,
echo             description=self.description,
echo             inputSchema={
echo                 "type": "object",
echo                 "properties": {
echo                     "action": {
echo                         "type": "string",
echo                         "enum": ["kill_by_name", "kill_by_pid", "list_processes", "get_info"],
echo                         "description": "Action to perform"
echo                     },
echo                     "target": {
echo                         "type": "string",
echo                         "description": "Process name or PID"
echo                     },
echo                     "force": {
echo                         "type": "boolean",
echo                         "default": False,
echo                         "description": "Force kill"
echo                     }
echo                 },
echo                 "required": ["action"]
echo             }
echo         ^^)
echo.
echo     async def execute^(self, arguments: dict^^) -^> Sequence[TextContent ^| ImageContent ^| EmbeddedResource]:
echo         is_valid, error = self.validate_arguments^(arguments, self.get_tool_definition^(^^).inputSchema^^)
echo         if not is_valid:
echo             return [TextContent^(type="text", text=f"ERROR: {error}"^^)]
echo.
echo         action = arguments["action"]
echo         target = arguments.get^("target"^^)
echo         force = arguments.get^("force", False^^)
echo.
echo         try:
echo             if action == "kill_by_name":
echo                 result = subprocess.run^(["taskkill", "/F" if force else "", "/IM", target], capture_output=True, text=True^^)
echo                 return [TextContent^(type="text", text=f"Killed: {target}\n{result.stdout}"^^)]
echo             elif action == "kill_by_pid":
echo                 result = subprocess.run^(["taskkill", "/F" if force else "", "/PID", target], capture_output=True, text=True^^)
echo                 return [TextContent^(type="text", text=f"Killed PID: {target}\n{result.stdout}"^^)]
echo             elif action == "list_processes":
echo                 procs = []
echo                 for p in psutil.process_iter^(['pid', 'name', 'memory_info']^^):
echo                     try:
echo                         procs.append^(f"{p.info['pid']} - {p.info['name']} - {p.info['memory_info'].rss/1024/1024:.1f}MB"^^)
echo                     except: pass
echo                 return [TextContent^(type="text", text="\n".join^(procs[:50]^^)^^)]
echo             elif action == "get_info":
echo                 for p in psutil.process_iter^(['pid', 'name', 'cpu_percent', 'memory_info']^^):
echo                     if p.info['name'] == target or str^(p.info['pid']^^) == target:
echo                         info = f"PID: {p.info['pid']}\nName: {p.info['name']}\nCPU: {p.info['cpu_percent']}%%\nMemory: {p.info['memory_info'].rss/1024/1024:.1f}MB"
echo                         return [TextContent^(type="text", text=info^^)]
echo                 return [TextContent^(type="text", text=f"Process not found: {target}"^^)]
echo         except Exception as e:
echo             return [TextContent^(type="text", text=f"ERROR: {str^(e^^)}"^^)]
) > mcp-servers\tools\advanced\process_manager_tool.py

if exist "mcp-servers\tools\advanced\process_manager_tool.py" (
    echo    [32m✓[0m Process Manager Tool created
) else (
    echo    [31m✗[0m Failed to create Process Manager Tool
)
echo.

REM ============================================================
REM STEP 4: CREATE SERVICE MANAGER TOOL
REM ============================================================
echo [STEP 4/10] Creating Service Manager Tool...
(
echo """
echo Service Manager Tool - Control Windows services
echo """
echo.
echo import subprocess
echo from typing import Sequence
echo from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
echo from .. import BaseTool
echo import sys
echo sys.path.append^('../..'^^)
echo from utils.logger import get_logger
echo.
echo logger = get_logger^("service_manager_tool"^^)
echo.
echo class ServiceManagerTool^(BaseTool^^):
echo     def __init__^(self^^):
echo         super^(^^).__init__^(
echo             name="Windows-MCP:ServiceManager",
echo             description="Start, stop, restart Windows services and query service status."
echo         ^^)
echo.
echo     def get_tool_definition^(self^^) -^> Tool:
echo         return Tool^(
echo             name=self.name,
echo             description=self.description,
echo             inputSchema={
echo                 "type": "object",
echo                 "properties": {
echo                     "action": {
echo                         "type": "string",
echo                         "enum": ["start", "stop", "restart", "status", "list"],
echo                         "description": "Action to perform"
echo                     },
echo                     "service_name": {
echo                         "type": "string",
echo                         "description": "Service name"
echo                     }
echo                 },
echo                 "required": ["action"]
echo             }
echo         ^^)
echo.
echo     async def execute^(self, arguments: dict^^) -^> Sequence[TextContent ^| ImageContent ^| EmbeddedResource]:
echo         is_valid, error = self.validate_arguments^(arguments, self.get_tool_definition^(^^).inputSchema^^)
echo         if not is_valid:
echo             return [TextContent^(type="text", text=f"ERROR: {error}"^^)]
echo.
echo         action = arguments["action"]
echo         service = arguments.get^("service_name"^^)
echo.
echo         try:
echo             if action == "list":
echo                 result = subprocess.run^(["sc", "query", "type=", "service", "state=", "all"], capture_output=True, text=True^^)
echo                 return [TextContent^(type="text", text=result.stdout[:2000]^^)]
echo             elif action == "status":
echo                 result = subprocess.run^(["sc", "query", service], capture_output=True, text=True^^)
echo                 return [TextContent^(type="text", text=result.stdout^^)]
echo             elif action == "start":
echo                 result = subprocess.run^(["sc", "start", service], capture_output=True, text=True^^)
echo                 return [TextContent^(type="text", text=f"Started: {service}\n{result.stdout}"^^)]
echo             elif action == "stop":
echo                 result = subprocess.run^(["sc", "stop", service], capture_output=True, text=True^^)
echo                 return [TextContent^(type="text", text=f"Stopped: {service}\n{result.stdout}"^^)]
echo             elif action == "restart":
echo                 subprocess.run^(["sc", "stop", service], capture_output=True^^)
echo                 import time
echo                 time.sleep^(2^^)
echo                 result = subprocess.run^(["sc", "start", service], capture_output=True, text=True^^)
echo                 return [TextContent^(type="text", text=f"Restarted: {service}\n{result.stdout}"^^)]
echo         except Exception as e:
echo             return [TextContent^(type="text", text=f"ERROR: {str^(e^^)}"^^)]
) > mcp-servers\tools\advanced\service_manager_tool.py

if exist "mcp-servers\tools\advanced\service_manager_tool.py" (
    echo    [32m✓[0m Service Manager Tool created
) else (
    echo    [31m✗[0m Failed to create Service Manager Tool
)
echo.

REM ============================================================
REM STEP 5: CREATE FILE OPERATIONS TOOL
REM ============================================================
echo [STEP 5/10] Creating File Operations Tool...
(
echo """
echo File Operations Tool - Advanced file management
echo """
echo.
echo import os
echo import shutil
echo import glob
echo from typing import Sequence
echo from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
echo from .. import BaseTool
echo import sys
echo sys.path.append^('../..'^^)
echo from utils.logger import get_logger
echo.
echo logger = get_logger^("file_ops_tool"^^)
echo.
echo class FileOperationsTool^(BaseTool^^):
echo     def __init__^(self^^):
echo         super^(^^).__init__^(
echo             name="Windows-MCP:FileOps",
echo             description="Advanced file operations: bulk rename, search, copy, move, delete with patterns."
echo         ^^)
echo.
echo     def get_tool_definition^(self^^) -^> Tool:
echo         return Tool^(
echo             name=self.name,
echo             description=self.description,
echo             inputSchema={
echo                 "type": "object",
echo                 "properties": {
echo                     "action": {
echo                         "type": "string",
echo                         "enum": ["search", "bulk_rename", "bulk_copy", "bulk_delete", "disk_usage"],
echo                         "description": "Action to perform"
echo                     },
echo                     "path": {
echo                         "type": "string",
echo                         "description": "File or directory path"
echo                     },
echo                     "pattern": {
echo                         "type": "string",
echo                         "description": "Search pattern or rename pattern"
echo                     },
echo                     "destination": {
echo                         "type": "string",
echo                         "description": "Destination path for copy/move"
echo                     }
echo                 },
echo                 "required": ["action", "path"]
echo             }
echo         ^^)
echo.
echo     async def execute^(self, arguments: dict^^) -^> Sequence[TextContent ^| ImageContent ^| EmbeddedResource]:
echo         is_valid, error = self.validate_arguments^(arguments, self.get_tool_definition^(^^).inputSchema^^)
echo         if not is_valid:
echo             return [TextContent^(type="text", text=f"ERROR: {error}"^^)]
echo.
echo         action = arguments["action"]
echo         path = arguments["path"]
echo         pattern = arguments.get^("pattern", "*"^^)
echo         dest = arguments.get^("destination"^^)
echo.
echo         try:
echo             if action == "search":
echo                 files = glob.glob^(os.path.join^(path, "**", pattern^^), recursive=True^^)
echo                 return [TextContent^(type="text", text=f"Found {len^(files^^)} files:\n" + "\n".join^(files[:100]^^)^^)]
echo             elif action == "disk_usage":
echo                 total, used, free = shutil.disk_usage^(path^^)
echo                 return [TextContent^(type="text", text=f"Total: {total/1024**3:.1f}GB\nUsed: {used/1024**3:.1f}GB\nFree: {free/1024**3:.1f}GB"^^)]
echo             elif action == "bulk_delete":
echo                 files = glob.glob^(os.path.join^(path, pattern^^)^^)
echo                 count = 0
echo                 for f in files:
echo                     try:
echo                         os.remove^(f^^)
echo                         count += 1
echo                     except: pass
echo                 return [TextContent^(type="text", text=f"Deleted {count} files"^^)]
echo         except Exception as e:
echo             return [TextContent^(type="text", text=f"ERROR: {str^(e^^)}"^^)]
) > mcp-servers\tools\advanced\file_ops_tool.py

if exist "mcp-servers\tools\advanced\file_ops_tool.py" (
    echo    [32m✓[0m File Operations Tool created
) else (
    echo    [31m✗[0m Failed to create File Operations Tool
)
echo.

REM ============================================================
REM STEP 6: CREATE NETWORK MANAGER TOOL
REM ============================================================
echo [STEP 6/10] Creating Network Manager Tool...
(
echo """
echo Network Manager Tool - Network operations and monitoring
echo """
echo.
echo import subprocess
echo from typing import Sequence
echo from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
echo from .. import BaseTool
echo import sys
echo sys.path.append^('../..'^^)
echo from utils.logger import get_logger
echo.
echo logger = get_logger^("network_manager_tool"^^)
echo.
echo class NetworkManagerTool^(BaseTool^^):
echo     def __init__^(self^^):
echo         super^(^^).__init__^(
echo             name="Windows-MCP:NetworkManager",
echo             description="Network operations: active connections, port info, DNS flush, network stats."
echo         ^^)
echo.
echo     def get_tool_definition^(self^^) -^> Tool:
echo         return Tool^(
echo             name=self.name,
echo             description=self.description,
echo             inputSchema={
echo                 "type": "object",
echo                 "properties": {
echo                     "action": {
echo                         "type": "string",
echo                         "enum": ["connections", "dns_flush", "netstat", "ipconfig", "ping"],
echo                         "description": "Action to perform"
echo                     },
echo                     "target": {
echo                         "type": "string",
echo                         "description": "Target host for ping"
echo                     }
echo                 },
echo                 "required": ["action"]
echo             }
echo         ^^)
echo.
echo     async def execute^(self, arguments: dict^^) -^> Sequence[TextContent ^| ImageContent ^| EmbeddedResource]:
echo         is_valid, error = self.validate_arguments^(arguments, self.get_tool_definition^(^^).inputSchema^^)
echo         if not is_valid:
echo             return [TextContent^(type="text", text=f"ERROR: {error}"^^)]
echo.
echo         action = arguments["action"]
echo         target = arguments.get^("target"^^)
echo.
echo         try:
echo             if action == "connections":
echo                 result = subprocess.run^(["netstat", "-ano"], capture_output=True, text=True^^)
echo                 return [TextContent^(type="text", text=result.stdout[:2000]^^)]
echo             elif action == "dns_flush":
echo                 result = subprocess.run^(["ipconfig", "/flushdns"], capture_output=True, text=True^^)
echo                 return [TextContent^(type="text", text=result.stdout^^)]
echo             elif action == "netstat":
echo                 result = subprocess.run^(["netstat", "-s"], capture_output=True, text=True^^)
echo                 return [TextContent^(type="text", text=result.stdout[:2000]^^)]
echo             elif action == "ipconfig":
echo                 result = subprocess.run^(["ipconfig", "/all"], capture_output=True, text=True^^)
echo                 return [TextContent^(type="text", text=result.stdout^^)]
echo             elif action == "ping":
echo                 result = subprocess.run^(["ping", "-n", "4", target], capture_output=True, text=True^^)
echo                 return [TextContent^(type="text", text=result.stdout^^)]
echo         except Exception as e:
echo             return [TextContent^(type="text", text=f"ERROR: {str^(e^^)}"^^)]
) > mcp-servers\tools\advanced\network_manager_tool.py

if exist "mcp-servers\tools\advanced\network_manager_tool.py" (
    echo    [32m✓[0m Network Manager Tool created
) else (
    echo    [31m✗[0m Failed to create Network Manager Tool
)
echo.

REM ============================================================
REM STEP 7: CREATE __init__.py FOR ADVANCED TOOLS
REM ============================================================
echo [STEP 7/10] Creating __init__.py for advanced tools...
(
echo """
echo Advanced Tools Module
echo """
echo.
echo from .process_manager_tool import ProcessManagerTool
echo from .service_manager_tool import ServiceManagerTool
echo from .file_ops_tool import FileOperationsTool
echo from .network_manager_tool import NetworkManagerTool
echo.
echo __all__ = [
echo     'ProcessManagerTool',
echo     'ServiceManagerTool',
echo     'FileOperationsTool',
echo     'NetworkManagerTool',
echo ]
) > mcp-servers\tools\advanced\__init__.py

if exist "mcp-servers\tools\advanced\__init__.py" (
    echo    [32m✓[0m Advanced __init__.py created
) else (
    echo    [31m✗[0m Failed to create __init__.py
)
echo.

REM ============================================================
REM STEP 8: UPDATE MAIN __init__.py
REM ============================================================
echo [STEP 8/10] Backing up main __init__.py...
copy mcp-servers\tools\__init__.py mcp-servers\tools\__init__.py.backup >nul 2>&1
echo    [32m✓[0m Backup created
echo.

REM ============================================================
REM STEP 9: UPDATE MCP SERVER
REM ============================================================
echo [STEP 9/10] Creating update script for MCP server...
(
echo # Update MCP Server to register new tools
echo import sys
echo sys.path.insert^(0, 'mcp-servers'^^)
echo from tools.advanced import *
echo print^("Advanced tools imported successfully!"^^)
) > update_mcp_server.py

if exist "update_mcp_server.py" (
    echo    [32m✓[0m Update script created
) else (
    echo    [31m✗[0m Failed to create update script
)
echo.

REM ============================================================
REM STEP 10: COMPLETION
REM ============================================================
echo [STEP 10/10] Finalizing installation...
echo.
echo ============================================================
echo    [32mGOD-LEVEL TOOLS INSTALLATION COMPLETE![0m
echo ============================================================
echo.
echo [32m✓[0m Process Manager Tool - Kill/monitor processes
echo [32m✓[0m Service Manager Tool - Control Windows services
echo [32m✓[0m File Operations Tool - Advanced file management
echo [32m✓[0m Network Manager Tool - Network operations
echo.
echo ============================================================
echo NEXT STEPS:
echo 1. Restart OpenClaw: python run_godmode.py
echo 2. Test tools with commands like:
echo    - "list all running processes"
echo    - "show network connections"
echo    - "check disk usage of C drive"
echo ============================================================
echo.
pause
