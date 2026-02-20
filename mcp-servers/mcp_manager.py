"""
MCP Manager - GOD-LEVEL DEBUG EDITION
Maximum verbosity for troubleshooting
"""
import asyncio
import json
import logging
import os
import sys
import traceback
from typing import Dict, List, Any, Optional
from pathlib import Path
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

logger = logging.getLogger(__name__)


class MCPManager:
    """Manages connections to multiple MCP servers and tool discovery."""
    
    def __init__(self, config_path: str = "config/mcp_config.json"):
        self.config_path = config_path
        self.sessions: Dict[str, ClientSession] = {}
        self.tools: List[Dict[str, Any]] = []
        self.server_configs: Dict[str, Dict] = {}
        self._stdio_contexts: Dict[str, Any] = {}
        
        logger.info(f"🔍 MCPManager initialized with config: {config_path}")
        
    async def initialize(self):
        """Initialize all MCP servers from configuration."""
        logger.info("=" * 70)
        logger.info("🚀 INITIALIZING MCP MANAGER - GOD-LEVEL DEBUG MODE")
        logger.info("=" * 70)
        
        # Load configuration
        try:
            logger.info(f"📄 Loading config from: {self.config_path}")
            logger.info(f"📁 Current working directory: {os.getcwd()}")
            logger.info(f"🐍 Python executable: {sys.executable}")
            logger.info(f"🐍 Python version: {sys.version}")
            
            with open(self.config_path, 'r') as f:
                config = json.load(f)
                self.server_configs = config.get('mcpServers', {})
            
            logger.info(f"✅ Config loaded successfully")
            logger.info(f"📊 Found {len(self.server_configs)} server(s) in config")
            
            for name, cfg in self.server_configs.items():
                logger.info(f"  • {name}:")
                logger.info(f"      Command: {cfg.get('command')}")
                logger.info(f"      Args: {cfg.get('args')}")
                logger.info(f"      Env: {cfg.get('env', {})}")
                logger.info(f"      CWD: {cfg.get('cwd', '(not set)')}")
                
        except FileNotFoundError:
            logger.error(f"❌ MCP config file not found: {self.config_path}")
            logger.error(f"📁 Looked in: {os.path.abspath(self.config_path)}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"❌ Invalid JSON in MCP config: {e}")
            raise
        
        # Connect to each server
        logger.info("")
        logger.info("🔌 CONNECTING TO SERVERS...")
        logger.info("-" * 70)
        
        for server_name, server_config in self.server_configs.items():
            try:
                await self._connect_server(server_name, server_config)
            except Exception as e:
                logger.error(f"❌ Failed to connect to {server_name}: {e}")
                logger.error(f"📋 Full traceback:")
                traceback.print_exc()
                continue
        
        logger.info("")
        logger.info("=" * 70)
        logger.info(f"✅ MCP Manager initialized with {len(self.sessions)} server(s)")
        logger.info(f"🛠️  Total tools available: {len(self.tools)}")
        logger.info("=" * 70)
        
        return self
    
    async def _connect_server(self, server_name: str, config: Dict[str, Any]):
        """Connect to a single MCP server."""
        logger.info("")
        logger.info(f"🔌 CONNECTING TO: {server_name}")
        logger.info(f"{'='*70}")
        
        # Debug environment
        logger.info(f"🌍 ENVIRONMENT:")
        logger.info(f"  • Current directory: {os.getcwd()}")
        logger.info(f"  • Config command: {config['command']}")
        logger.info(f"  • Config args: {config.get('args', [])}")
        
        cwd = config.get('cwd')
        original_cwd = os.getcwd()
        
        if cwd:
            logger.info(f"  • Will change to: {cwd}")
            logger.info(f"  • CWD exists: {os.path.exists(cwd)}")
        
        try:
            # Change directory if specified
            if cwd:
                logger.info(f"📁 Changing directory to: {cwd}")
                os.chdir(cwd)
                logger.info(f"✅ Changed to: {os.getcwd()}")
            
            # Check if server file exists
            server_file = config.get('args', [''])[0] if config.get('args') else None
            if server_file:
                full_path = os.path.abspath(server_file)
                logger.info(f"🔍 Server file: {server_file}")
                logger.info(f"  • Full path: {full_path}")
                logger.info(f"  • Exists: {os.path.exists(full_path)}")
                if os.path.exists(full_path):
                    logger.info(f"  • Size: {os.path.getsize(full_path)} bytes")
            
            # Create server parameters
            logger.info(f"⚙️  Creating StdioServerParameters...")
            params = StdioServerParameters(
                command=config['command'],
                args=config.get('args', []),
                env=config.get('env', None)
            )
            logger.info(f"✅ Parameters created")
            
            # Create stdio client context
            logger.info(f"🔗 Creating stdio_client context...")
            stdio_context = stdio_client(params)
            logger.info(f"✅ Context created")
            
            # Enter context and get streams
            logger.info(f"🚀 Entering context (launching subprocess)...")
            try:
                read_stream, write_stream = await stdio_context.__aenter__()
                logger.info(f"✅ Context entered, streams obtained")
                logger.info(f"  • Read stream: {type(read_stream).__name__}")
                logger.info(f"  • Write stream: {type(write_stream).__name__}")
            except Exception as e:
                logger.error(f"❌ Failed to enter context: {e}")
                logger.error(f"📋 This usually means the subprocess failed to start")
                raise
            
            # Store context for cleanup
            self._stdio_contexts[server_name] = stdio_context
            logger.info(f"💾 Stored stdio context")
            
            # Create and initialize session
            logger.info(f"🤝 Creating ClientSession...")
            session = ClientSession(read_stream, write_stream)
            logger.info(f"✅ Session created")
            
            logger.info(f"🔓 Entering session context...")
            await session.__aenter__()
            logger.info(f"✅ Session context entered")
            
            # Initialize session
            logger.info(f"🎬 Initializing session (MCP handshake)...")
            try:
                init_result = await session.initialize()
                logger.info(f"✅ Session initialized successfully")
                logger.info(f"  • Protocol version: {getattr(init_result, 'protocolVersion', 'unknown')}")
                logger.info(f"  • Server info: {getattr(init_result, 'serverInfo', 'unknown')}")
            except Exception as e:
                logger.error(f"❌ Session initialization failed: {e}")
                logger.error(f"📋 This means the server started but MCP protocol failed")
                raise
            
            # Store session
            self.sessions[server_name] = session
            logger.info(f"💾 Stored session")
            
            # Discover tools
            logger.info(f"🔍 Discovering tools...")
            try:
                tools_response = await session.list_tools()
                server_tools = tools_response.tools
                logger.info(f"✅ Tools discovered: {len(server_tools)}")
            except Exception as e:
                logger.error(f"❌ Tool discovery failed: {e}")
                raise
            
            # Log each tool
            logger.info(f"🛠️  TOOLS FROM {server_name}:")
            for i, tool in enumerate(server_tools, 1):
                logger.info(f"  {i}. {tool.name}")
                logger.info(f"     Description: {tool.description[:80]}...")
            
            # Convert MCP tools to Claude API format and store
            for tool in server_tools:
                claude_tool = self._mcp_to_claude_tool(tool, server_name)
                self.tools.append(claude_tool)
            
            logger.info(f"✅ CONNECTION SUCCESSFUL: {server_name}")
            logger.info(f"{'='*70}")
                
        except Exception as e:
            logger.error(f"❌ CONNECTION FAILED: {server_name}")
            logger.error(f"Error type: {type(e).__name__}")
            logger.error(f"Error message: {str(e)}")
            logger.error(f"Full traceback:")
            traceback.print_exc()
            
            # Clean up if partially initialized
            if server_name in self._stdio_contexts:
                logger.info(f"🧹 Cleaning up stdio context...")
                try:
                    await self._stdio_contexts[server_name].__aexit__(None, None, None)
                    logger.info(f"✅ Cleaned up")
                except Exception as cleanup_error:
                    logger.error(f"❌ Cleanup failed: {cleanup_error}")
                del self._stdio_contexts[server_name]
            raise
        finally:
            # Restore original working directory
            if cwd and os.getcwd() != original_cwd:
                logger.info(f"📁 Restoring directory to: {original_cwd}")
                os.chdir(original_cwd)
    
    def _mcp_to_claude_tool(self, mcp_tool: Any, server_name: str) -> Dict[str, Any]:
        """Convert an MCP tool definition to Claude API tool format."""
        # Sanitize tool name: Claude only accepts [a-zA-Z0-9_-]
        sanitized_name = mcp_tool.name.replace(":", "-")
        
        return {
            "name": sanitized_name,
            "description": mcp_tool.description,
            "input_schema": mcp_tool.inputSchema,
            "_mcp_server": server_name,
            "_original_name": mcp_tool.name
        }
    
    async def call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Any:
        """Execute a tool call via the appropriate MCP server."""
        logger.info(f"🔧 CALLING TOOL: {tool_name}")
        logger.info(f"  Arguments: {arguments}")
        
        # Find which server owns this tool
        server_name = None
        original_name = None
        for tool in self.tools:
            if tool['name'] == tool_name:
                server_name = tool.get('_mcp_server')
                original_name = tool.get('_original_name', tool_name)
                break
        
        if not server_name:
            logger.error(f"❌ Tool not found: {tool_name}")
            raise ValueError(f"Tool not found: {tool_name}")
        
        if server_name not in self.sessions:
            logger.error(f"❌ Server not connected: {server_name}")
            raise ValueError(f"Server not connected: {server_name}")
        
        logger.info(f"  • Server: {server_name}")
        logger.info(f"  • Original name: {original_name}")
        
        # Execute tool via MCP
        session = self.sessions[server_name]
        try:
            result = await session.call_tool(original_name, arguments)
            logger.info(f"✅ Tool executed successfully")
            return result
        except Exception as e:
            logger.error(f"❌ Tool execution failed: {e}")
            raise
    
    def get_claude_tools(self) -> List[Dict[str, Any]]:
        """Get all tools in Claude API format without internal metadata."""
        clean_tools = []
        for tool in self.tools:
            clean_tool = {
                "name": tool["name"],
                "description": tool["description"],
                "input_schema": tool["input_schema"]
            }
            clean_tools.append(clean_tool)
        return clean_tools
    
    async def close(self):
        """Close all MCP server connections."""
        logger.info("🔌 CLOSING MCP MANAGER...")
        
        # Close sessions first
        for server_name, session in list(self.sessions.items()):
            try:
                logger.info(f"  Closing session: {server_name}")
                await session.__aexit__(None, None, None)
                logger.info(f"  ✅ Session closed")
            except Exception as e:
                logger.error(f"  ❌ Error closing session {server_name}: {e}")
        
        # Then close stdio contexts
        for server_name, context in list(self._stdio_contexts.items()):
            try:
                logger.info(f"  Closing stdio context: {server_name}")
                await context.__aexit__(None, None, None)
                logger.info(f"  ✅ Context closed")
            except Exception as e:
                logger.error(f"  ❌ Error closing context {server_name}: {e}")
        
        self.sessions.clear()
        self._stdio_contexts.clear()
        self.tools.clear()
        logger.info("✅ MCP Manager closed")


# Test function
async def main():
    """Test the MCP Manager with god-level debug."""
    logging.basicConfig(
        level=logging.DEBUG,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    manager = MCPManager()
    await manager.initialize()
    
    print(f"\n{'='*60}")
    print("MCP SERVERS CONNECTED:")
    print(f"{'='*60}")
    for server_name in manager.sessions.keys():
        print(f"  ✓ {server_name}")
    
    print(f"\n{'='*60}")
    print("AVAILABLE TOOLS:")
    print(f"{'='*60}")
    for tool in manager.get_claude_tools():
        print(f"  • {tool['name']}")
    
    await manager.close()


if __name__ == "__main__":
    asyncio.run(main())
