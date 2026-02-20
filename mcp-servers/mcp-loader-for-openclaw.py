#!/usr/bin/env python3
"""
MCP Loader for OpenClaw
Connects to running MCP servers and provides tool definitions to OpenClaw
This enables full integration of 22+ MCP tools with OpenClaw agents
"""

import asyncio
import json
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")
logger = logging.getLogger("mcp-loader")

class MCPClient:
    """Client for connecting to an MCP server over stdio"""
    
    def __init__(self, name: str, script_path: Path):
        self.name = name
        self.script_path = script_path
        self.process = None
        self.msg_id = 0
        
    async def start(self):
        """Start the MCP server"""
        try:
            self.process = await asyncio.create_subprocess_exec(
                sys.executable, str(self.script_path),
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=str(self.script_path.parent)
            )
            logger.info(f"✅ Started {self.name} (PID {self.process.pid})")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to start {self.name}: {e}")
            return False
    
    async def call_method(self, method: str, params: Dict = None) -> Optional[Dict]:
        """Call an MCP method and get response"""
        if not self.process or self.process.returncode is not None:
            logger.error(f"{self.name} process not running")
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
            request_line = json.dumps(request) + "\n"
            self.process.stdin.write(request_line.encode())
            await self.process.stdin.drain()
            
            # Read response
            response_line = await asyncio.wait_for(
                self.process.stdout.readline(),
                timeout=5.0
            )
            
            if not response_line:
                return None
            
            response = json.loads(response_line)
            return response
        except asyncio.TimeoutError:
            logger.warning(f"Timeout calling {method} on {self.name}")
            return None
        except Exception as e:
            logger.error(f"Error calling {method} on {self.name}: {e}")
            return None
    
    async def list_tools(self) -> List[Dict]:
        """Get list of tools from server"""
        response = await self.call_method("tools/list")
        if response and "result" in response:
            return response["result"].get("tools", [])
        return []
    
    async def stop(self):
        """Stop the server"""
        if self.process:
            self.process.terminate()
            try:
                await asyncio.wait_for(self.process.wait(), timeout=2.0)
            except:
                self.process.kill()
            logger.info(f"Stopped {self.name}")

class MCPLoader:
    """Loads MCP servers and aggregates their tools for OpenClaw"""
    
    def __init__(self, mcp_dir: Path):
        self.mcp_dir = mcp_dir
        self.clients: Dict[str, MCPClient] = {}
        self.tools: List[Dict] = []
    
    async def add_server(self, name: str, script: str) -> bool:
        """Add and start an MCP server"""
        script_path = self.mcp_dir / script
        if not script_path.exists():
            logger.warning(f"Script not found: {script_path}")
            return False
        
        client = MCPClient(name, script_path)
        if await client.start():
            self.clients[name] = client
            return True
        return False
    
    async def load_all_tools(self):
        """Load tool definitions from all servers"""
        logger.info("Loading tools from MCP servers...")
        
        for name, client in self.clients.items():
            tools = await client.list_tools()
            for tool in tools:
                # Add server name as source
                tool["mcp_server"] = name
                self.tools.append(tool)
                logger.info(f"  • Loaded: {tool['name']} ({name})")
        
        logger.info(f"✅ Total tools loaded: {len(self.tools)}")
    
    async def shutdown(self):
        """Shutdown all servers"""
        logger.info("Shutting down MCP servers...")
        for client in self.clients.values():
            await client.stop()
    
    def export_tools_json(self, path: Path):
        """Export tool definitions as JSON for OpenClaw to use"""
        output = {
            "version": "1.0",
            "timestamp": str(Path(__file__).stat().st_mtime),
            "total_tools": len(self.tools),
            "mcp_servers": list(self.clients.keys()),
            "tools": self.tools
        }
        
        path.write_text(json.dumps(output, indent=2))
        logger.info(f"Exported tools to: {path}")

async def main():
    """Main entry point"""
    print("\n" + "="*60)
    print("OpenClaw MCP Loader")
    print("="*60 + "\n")
    
    mcp_dir = Path(__file__).parent
    loader = MCPLoader(mcp_dir)
    
    try:
        # Add servers
        logger.info("Starting MCP servers...")
        added = 0
        added += await loader.add_server("Windows MCP", "windows_mcp_server.py")
        added += await loader.add_server("WhatsApp Bridge", "whatsapp_bridge_mcp.py")
        
        if added == 0:
            logger.error("No MCP servers could be started!")
            return 1
        
        # Load tools
        await asyncio.sleep(1)  # Give servers time to start
        await loader.load_all_tools()
        
        # Export for OpenClaw
        export_path = mcp_dir / "mcp_tools.json"
        loader.export_tools_json(export_path)
        
        print(f"\n✅ MCP Integration Complete!")
        print(f"   Tools available: {len(loader.tools)}")
        print(f"   Tool definitions: {export_path}")
        print("\nNext steps:")
        print("1. Copy mcp_tools.json to your OpenClaw config")
        print("2. Register the tools in your agent configuration")
        print("3. The tools will be available in your agent sessions")
        
        # Keep running
        logger.info("MCP servers active. Press Ctrl+C to shutdown.")
        try:
            while True:
                await asyncio.sleep(1)
        except KeyboardInterrupt:
            logger.info("Shutting down...")
        
    finally:
        await loader.shutdown()
    
    return 0

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
