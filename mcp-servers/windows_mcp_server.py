#!/usr/bin/env python3
"""
Windows MCP Server - ULTRA CLEAN STDIO + READ TOOL
Guarantees zero stdout pollution during tool execution
"""

# ============================================================
# CRITICAL: REDIRECT BEFORE ANY IMPORTS
# ============================================================
import sys
import os

# Save original streams for MCP protocol
_stdin = sys.stdin
_stdout = sys.stdout
_stderr = sys.stderr

# Redirect stderr immediately (before any imports can write to it)
sys.stderr = open(os.devnull, 'w', buffering=1)

# NOW import everything else
import asyncio
import importlib
from typing import Any, Sequence, Dict

# Import MCP with original stdout (needed for JSON-RPC)
sys.stdout = _stdout

from mcp.server import Server
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from mcp.server.stdio import stdio_server

# ============================================================
# FILE LOGGING ONLY (never to stdout/stderr)
# ============================================================
LOG_FILE = "mcp_execution.log"

def log(message: str):
    """Log to file only"""
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            from datetime import datetime
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            f.write(f"[{timestamp}] {message}\n")
    except:
        pass  # Silently fail - never print errors

# ============================================================
# COMPLETE STREAM ISOLATION
# ============================================================
class NullIO:
    """Perfect null device"""
    def write(self, s): pass
    def flush(self): pass
    def read(self, n=-1): return ""
    def readline(self): return ""
    def close(self): pass
    def isatty(self): return False

def with_null_streams(func):
    """Decorator to execute function with all streams redirected"""
    def wrapper(*args, **kwargs):
        # Save current streams
        old_stdout = sys.stdout
        old_stderr = sys.stderr
        old_stdin = sys.stdin
        
        # Redirect everything
        null = NullIO()
        sys.stdout = null
        sys.stderr = null
        sys.stdin = null
        
        try:
            result = func(*args, **kwargs)
            return result
        except Exception as e:
            log(f"ERROR in {func.__name__}: {str(e)}")
            raise
        finally:
            # Always restore
            sys.stdout = old_stdout
            sys.stderr = old_stderr
            sys.stdin = old_stdin
    return wrapper

# ============================================================
# SERVER SETUP
# ============================================================
server = Server("windows-control")

TOOL_PATHS = {
    "windows-mcp-click": "tools.click_tool.ClickTool",
    "windows-mcp-type": "tools.type_tool.TypeTool",
    "windows-mcp-scroll": "tools.scroll_tool.ScrollTool",
    "windows-mcp-move": "tools.move_tool.MoveTool",
    "windows-mcp-shortcut": "tools.shortcut_tool.ShortcutTool",
    "windows-mcp-app": "tools.app_tool.AppTool",
    "windows-mcp-shell": "tools.shell_tool.ShellTool",
    "windows-mcp-snapshot": "tools.snapshot_tool.SnapshotTool",
    "windows-mcp-wait": "tools.wait_tool.WaitTool",
    "windows-mcp-scrape": "tools.scrape_tool.ScrapeTool",
    "windows-mcp-multiselect": "tools.multiselect_tool.MultiSelectTool",
    "windows-mcp-multiedit": "tools.multiedit_tool.MultiEditTool",
    "windows-mcp-vision": "tools.vision_tool.VisionTool",
    "windows-mcp-process-manager": "tools.advanced.process_manager_tool.ProcessManagerTool",
    "windows-mcp-service-manager": "tools.advanced.service_manager_tool.ServiceManagerTool",
    "windows-mcp-file-ops": "tools.advanced.file_ops_tool.FileOperationsTool",
    "windows-mcp-network-manager": "tools.advanced.network_manager_tool.NetworkManagerTool",
    "windows-mcp-registry": "tools.advanced.registry_tool.RegistryTool",
    "windows-mcp-task-scheduler": "tools.advanced.task_scheduler_tool.TaskSchedulerTool",
    "windows-mcp-system-info": "tools.advanced.system_info_tool.SystemInfoTool",
    "windows-mcp-clipboard": "tools.advanced.clipboard_tool.ClipboardTool",
}

HANDLERS: Dict[str, Any] = {}

@with_null_streams
def load_tool_silent(tool_name: str) -> Any:
    """Load tool with complete stream isolation"""
    path = TOOL_PATHS.get(tool_name)
    if not path:
        return None
    
    try:
        module_name, class_name = path.rsplit('.', 1)
        module = importlib.import_module(module_name)
        cls = getattr(module, class_name)
        instance = cls()
        return instance
    except Exception as e:
        log(f"Failed to load {tool_name}: {str(e)}")
        return None

def get_tool_handler(tool_name: str) -> Any:
    """Get or load tool handler (with caching)"""
    if tool_name not in HANDLERS:
        log(f"Loading tool: {tool_name}")
        HANDLERS[tool_name] = load_tool_silent(tool_name)
    return HANDLERS[tool_name]

# ============================================================
# FIX: ADD READ TOOL (Standard MCP tool for file reading)
# ============================================================
@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available tools"""
    log("list_tools called")
    tools = []
    
    # Add standard READ tool first
    tools.append(Tool(
        name="read",
        description="Read file or resource content. Provide the full file path.",
        inputSchema={
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Full path to the file or resource to read"
                }
            },
            "required": ["path"]
        }
    ))
    
    # Add all Windows control tools
    for tool_name in TOOL_PATHS.keys():
        handler = get_tool_handler(tool_name)
        
        if handler is None:
            tools.append(Tool(
                name=tool_name,
                description=f"{tool_name} (failed to load)",
                inputSchema={"type": "object", "properties": {}}
            ))
            continue
        
        try:
            # Get tool definition with streams isolated
            @with_null_streams
            def get_def():
                return handler.get_tool_definition()
            
            tool_def = get_def()
            tool_def.name = tool_name
            tools.append(tool_def)
            
        except Exception as e:
            log(f"Error getting definition for {tool_name}: {str(e)}")
            tools.append(Tool(
                name=tool_name,
                description=f"{tool_name} (definition error)",
                inputSchema={"type": "object", "properties": {}}
            ))
    
    log(f"Returning {len(tools)} tools")
    return tools

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
    """Execute a tool with complete stdio isolation"""
    log(f"call_tool: {name} with args: {arguments}")
    
    # Handle READ tool
    if name == "read":
        path = arguments.get("path", "")
        if not path:
            log("READ tool called without path")
            return [TextContent(
                type="text", 
                text="ERROR: 'path' parameter is required for read tool"
            )]
        
        try:
            log(f"Reading file: {path}")
            if not os.path.exists(path):
                return [TextContent(
                    type="text",
                    text=f"ERROR: File not found: {path}"
                )]
            
            # Check file size (limit to 1MB for safety)
            file_size = os.path.getsize(path)
            if file_size > 1024 * 1024:
                return [TextContent(
                    type="text",
                    text=f"ERROR: File too large ({file_size} bytes). Max 1MB allowed."
                )]
            
            # Read the file
            with open(path, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
            
            log(f"Successfully read {len(content)} characters from {path}")
            return [TextContent(
                type="text",
                text=f"File: {path}\n\n{content}"
            )]
            
        except Exception as e:
            log(f"Error reading file {path}: {str(e)}")
            return [TextContent(
                type="text",
                text=f"ERROR reading file: {str(e)}"
            )]
    
    # Handle Windows control tools
    handler = get_tool_handler(name)
    if handler is None:
        log(f"Tool {name} not available")
        return [TextContent(type="text", text=f"ERROR: Tool '{name}' unavailable")]
    
    # Execute with streams isolated
    @with_null_streams
    async def execute_isolated():
        exec_args = arguments.copy()
        
        try:
            result = await asyncio.wait_for(
                handler.execute(exec_args),
                timeout=30.0
            )
            log(f"Tool {name} completed successfully")
            return result
        except asyncio.TimeoutError:
            log(f"Tool {name} timed out")
            raise
        except Exception as e:
            log(f"Tool {name} error: {str(e)}")
            raise
    
    try:
        result = await execute_isolated()
        if result:
            return result
        else:
            return [TextContent(type="text", text="Success")]
    except asyncio.TimeoutError:
        return [TextContent(type="text", text="ERROR: Tool execution timed out")]
    except Exception as e:
        return [TextContent(type="text", text=f"ERROR: {str(e)}")]

async def main():
    """Run MCP server with guaranteed clean stdio"""
    log("=== MCP Server Starting ===")
    
    # Ensure stdout is original (for JSON-RPC)
    sys.stdout = _stdout
    sys.stderr = open(os.devnull, 'w', buffering=1)
    
    try:
        async with stdio_server() as (read_stream, write_stream):
            log("STDIO server started")
            init_options = server.create_initialization_options()
            await server.run(read_stream, write_stream, init_options)
    except Exception as e:
        log(f"Server error: {str(e)}")
        raise

if __name__ == "__main__":
    # Final check: ensure clean streams
    sys.stdout = _stdout
    sys.stderr = open(os.devnull, 'w', buffering=1)
    log("Starting asyncio event loop")
    asyncio.run(main())
