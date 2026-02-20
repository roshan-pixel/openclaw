#!/usr/bin/env python3
"""
MCP CLI Tool for OpenClaw
Exposes 22 MCP tools as a single callable endpoint
Register this in openclaw.json as a cliBackend to enable all MCP tools

Usage from OpenClaw:
  python mcp-cli-tool.py list-tools
  python mcp-cli-tool.py call TOOL_NAME '{"arg1": "value1"}'
"""

import sys
import os
import json
import subprocess
import time
from pathlib import Path
from typing import Dict, List, Optional, Any

# ============================================================================
# Configuration
# ============================================================================

MCP_SERVERS = [
    {
        "name": "windows",
        "command": [sys.executable, "windows_mcp_server.py"],
        "tools_count": 21,
        "description": "Windows system tools (snapshot, shell, click, etc.)"
    },
    {
        "name": "whatsapp",
        "command": [sys.executable, "whatsapp_bridge_mcp.py"],
        "tools_count": 3,
        "description": "WhatsApp bridge tools (log-message, health, send-log)"
    }
]

MCP_DIR = Path(__file__).parent
PIDS_FILE = MCP_DIR / ".mcp_pids"
TIMEOUT = 5.0  # seconds

# ============================================================================
# MCP Client
# ============================================================================

class MCPClient:
    """Communicates with an MCP server via JSON-RPC stdio"""
    
    def __init__(self, name: str, command: List[str], cwd: Path = MCP_DIR):
        self.name = name
        self.command = command
        self.cwd = cwd
        self.process: Optional[subprocess.Popen] = None
        self.msg_id = 0
        self.initialized = False
        self._start()
    
    def _start(self):
        """Start the MCP server process"""
        try:
            self.process = subprocess.Popen(
                self.command,
                cwd=str(self.cwd),
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=1
            )
            # Wait for initialization
            time.sleep(0.5)
            self._initialize()
        except Exception as e:
            print(f"ERROR: Failed to start {self.name}: {e}", file=sys.stderr)
            self.process = None
    
    def _initialize(self):
        """Send initialization request to MCP server"""
        if not self.process:
            return
        
        init_request = {
            "jsonrpc": "2.0",
            "id": 0,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {
                    "name": "openclaw-mcp-cli",
                    "version": "1.0"
                }
            }
        }
        
        try:
            self.process.stdin.write(json.dumps(init_request) + "\n")
            self.process.stdin.flush()
            
            # Read initialization response
            response_line = self.process.stdout.readline()
            if response_line:
                response = json.loads(response_line)
                self.initialized = True
                self.msg_id = 1
        except Exception as e:
            print(f"ERROR: Initialization failed for {self.name}: {e}", file=sys.stderr)
    
    def _ensure_running(self):
        """Restart if crashed"""
        if not self.process or self.process.poll() is not None:
            self._start()
        elif not self.initialized:
            self._initialize()
    
    def call_method(self, method: str, params: Dict = None) -> Optional[Dict]:
        """Call a method on the MCP server"""
        self._ensure_running()
        if not self.process:
            return None
        
        self.msg_id += 1
        request = {
            "jsonrpc": "2.0",
            "id": self.msg_id,
            "method": method,
            "params": params or {}
        }
        
        try:
            # Send request
            request_json = json.dumps(request) + "\n"
            self.process.stdin.write(request_json)
            self.process.stdin.flush()
            
            # Read response with timeout
            self.process.stdout.flush()
            response_line = self.process.stdout.readline()
            
            if not response_line:
                print(f"ERROR: No response from {self.name}", file=sys.stderr)
                return None
            
            response = json.loads(response_line)
            
            if "error" in response:
                print(f"RPC Error: {response['error']}", file=sys.stderr)
                return None
            
            return response.get("result")
        
        except Exception as e:
            print(f"ERROR calling {method}: {e}", file=sys.stderr)
            return None
    
    def list_tools(self) -> List[Dict]:
        """Get available tools"""
        result = self.call_method("tools/list")
        if result and isinstance(result, dict):
            return result.get("tools", [])
        return []
    
    def call_tool(self, name: str, arguments: Dict) -> str:
        """Execute a tool"""
        result = self.call_method("tools/call", {
            "name": name,
            "arguments": arguments
        })
        if result:
            return json.dumps(result)
        return json.dumps({"error": f"Tool {name} failed"})
    
    def stop(self):
        """Stop the server"""
        if self.process:
            self.process.terminate()
            try:
                self.process.wait(timeout=2)
            except:
                self.process.kill()

# ============================================================================
# Global Server Pool
# ============================================================================

_servers: Dict[str, MCPClient] = {}

def get_server(server_name: str) -> Optional[MCPClient]:
    """Get or create MCP client for a server"""
    if server_name not in _servers:
        # Find server config
        for config in MCP_SERVERS:
            if config["name"] == server_name:
                _servers[server_name] = MCPClient(server_name, config["command"])
                return _servers[server_name]
        return None
    return _servers[server_name]

# ============================================================================
# Commands
# ============================================================================

def cmd_list_tools():
    """List all available tools from all servers"""
    all_tools = []
    
    for server_config in MCP_SERVERS:
        server = get_server(server_config["name"])
        if not server:
            print(f"⚠️  Could not connect to {server_config['name']}", file=sys.stderr)
            continue
        
        tools = server.list_tools()
        for tool in tools:
            tool["server"] = server_config["name"]
            all_tools.append(tool)
    
    output = {
        "total": len(all_tools),
        "tools": all_tools
    }
    print(json.dumps(output, indent=2))
    return 0

def cmd_tool_info(tool_name: str):
    """Get info about a specific tool"""
    for server_config in MCP_SERVERS:
        server = get_server(server_config["name"])
        if not server:
            continue
        
        tools = server.list_tools()
        for tool in tools:
            if tool["name"] == tool_name:
                tool["server"] = server_config["name"]
                print(json.dumps(tool, indent=2))
                return 0
    
    print(f"ERROR: Tool '{tool_name}' not found", file=sys.stderr)
    return 1

def cmd_call_tool(tool_name: str, args_json: str):
    """Execute a tool"""
    try:
        args = json.loads(args_json) if args_json else {}
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON arguments: {e}", file=sys.stderr)
        return 1
    
    # Find which server has this tool
    for server_config in MCP_SERVERS:
        server = get_server(server_config["name"])
        if not server:
            continue
        
        tools = server.list_tools()
        if any(t["name"] == tool_name for t in tools):
            # Found it!
            result = server.call_tool(tool_name, args)
            print(result)
            return 0
    
    print(f"ERROR: Tool '{tool_name}' not found in any server", file=sys.stderr)
    return 1

def cmd_status():
    """Check status of all MCP servers"""
    status = {
        "servers": [],
        "total_tools": 0
    }
    
    for server_config in MCP_SERVERS:
        server = get_server(server_config["name"])
        tools = server.list_tools() if server else []
        
        status["servers"].append({
            "name": server_config["name"],
            "description": server_config["description"],
            "running": bool(tools),
            "tools_available": len(tools),
            "expected": server_config["tools_count"]
        })
        
        status["total_tools"] += len(tools)
    
    print(json.dumps(status, indent=2))
    return 0

# ============================================================================
# Main
# ============================================================================

def main():
    """Main entry point"""
    if not sys.argv[1:]:
        print("Usage: mcp-cli-tool.py COMMAND [ARGS]", file=sys.stderr)
        print("", file=sys.stderr)
        print("Commands:", file=sys.stderr)
        print("  list-tools              - List all available tools", file=sys.stderr)
        print("  tool-info TOOL_NAME     - Get info about a tool", file=sys.stderr)
        print("  call TOOL_NAME JSON     - Execute a tool", file=sys.stderr)
        print("  status                  - Check MCP server status", file=sys.stderr)
        print("", file=sys.stderr)
        print("Example:", file=sys.stderr)
        print('  python mcp-cli-tool.py call windows-mcp-click \'{"x": 100, "y": 200}\'', file=sys.stderr)
        return 1
    
    cmd = sys.argv[1]
    
    if cmd == "list-tools":
        return cmd_list_tools()
    elif cmd == "tool-info" and len(sys.argv) > 2:
        return cmd_tool_info(sys.argv[2])
    elif cmd == "call" and len(sys.argv) > 2:
        args_json = sys.argv[3] if len(sys.argv) > 3 else ""
        return cmd_call_tool(sys.argv[2], args_json)
    elif cmd == "status":
        return cmd_status()
    else:
        print(f"ERROR: Unknown command '{cmd}'", file=sys.stderr)
        return 1

if __name__ == "__main__":
    try:
        exit_code = main()
    finally:
        # Clean up
        for server in _servers.values():
            server.stop()
    
    sys.exit(exit_code)
