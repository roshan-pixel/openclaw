"""
MCP Tools Manager - Enhanced tool discovery and execution for OpenClaw
"""
import asyncio
import json
import logging
from typing import Dict, List, Any, Optional
from pathlib import Path
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

logger = logging.getLogger(__name__)


class MCPToolsManager:
    """Manages MCP server connections and tool execution with caching."""
    
    def __init__(self, config_path: str = "config/mcp_config.json"):
        self.config_path = config_path
        self.sessions: Dict[str, ClientSession] = {}
        self.tools: List[Dict[str, Any]] = []
        self.tool_cache: Dict[str, Any] = {}
        self.server_configs: Dict[str, Dict] = {}
        self._stdio_contexts = []
        
    async def initialize(self):
        """Initialize all MCP servers and discover tools."""
        logger.info("="*60)
        logger.info("Initializing MCP Tools Manager...")
        logger.info("="*60)
        
        # Load configuration
        config_file = Path(self.config_path)
        if not config_file.exists():
            logger.error(f"MCP config not found: {self.config_path}")
            raise FileNotFoundError(f"Config file missing: {self.config_path}")
        
        with open(config_file, 'r') as f:
            config = json.load(f)
            self.server_configs = config.get('mcpServers', {})
        
        if not self.server_configs:
            logger.warning("No MCP servers configured!")
            return self
        
        # Connect to each server
        for server_name, server_config in self.server_configs.items():
            try:
                await self._connect_server(server_name, server_config)
            except Exception as e:
                logger.error(f"Failed to connect to {server_name}: {e}", exc_info=True)
                continue
        
        logger.info("="*60)
        logger.info(f"[OK] Connected to {len(self.sessions)} MCP server(s)")
        logger.info(f"[OK] Discovered {len(self.tools)} tool(s)")
        logger.info("="*60)
        
        # Log available tools
        if self.tools:
            logger.info("\nAvailable Tools:")
            for tool in self.tools:
                logger.info(f"  • {tool['name']}")
        
        return self
    
    async def _connect_server(self, server_name: str, config: Dict[str, Any]):
        """Connect to a single MCP server and discover its tools."""
        logger.info(f"Connecting to: {server_name}")
        
        # Validate command
        command = config.get('command')
        if not command:
            raise ValueError(f"No command specified for {server_name}")
        
        # Create server parameters
        params = StdioServerParameters(
            command=command,
            args=config.get('args', []),
            env=config.get('env')
        )
        
        # Create stdio client context
        stdio_context = stdio_client(params)
        read_stream, write_stream = await stdio_context.__aenter__()
        self._stdio_contexts.append((stdio_context, read_stream, write_stream))
        
        # Create and initialize session
        session = ClientSession(read_stream, write_stream)
        await session.__aenter__()
        await session.initialize()
        
        # Store session
        self.sessions[server_name] = session
        
        # Discover tools
        tools_response = await session.list_tools()
        server_tools = tools_response.tools
        
        logger.info(f"  [OK] {server_name}: {len(server_tools)} tools discovered")
        
        # Convert and store tools
        for tool in server_tools:
            claude_tool = self._convert_to_claude_format(tool, server_name)
            self.tools.append(claude_tool)
            logger.debug(f"    - {tool.name}")
    
    def _convert_to_claude_format(self, mcp_tool: Any, server_name: str) -> Dict[str, Any]:
        """Convert MCP tool to Claude API format."""
        # Claude API requires tool names to match: ^[a-zA-Z0-9_-]{1,128}$
        # Replace colons and spaces with underscores
        clean_name = mcp_tool.name.replace(":", "_").replace(" ", "_")
        
        return {
            "name": clean_name,
            "description": mcp_tool.description or f"Tool: {mcp_tool.name}",
            "input_schema": mcp_tool.inputSchema,
            "_mcp_server": server_name,  # Internal tracking
            "_original_name": mcp_tool.name  # Keep original for execution
        }
    
    def get_tools_for_claude(self) -> List[Dict[str, Any]]:
        """Get tools in Claude API format (without internal metadata)."""
        return [
            {
                "name": tool["name"],
                "description": tool["description"],
                "input_schema": tool["input_schema"]
            }
            for tool in self.tools
        ]
    
    async def execute_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Any:
        """Execute a tool via MCP."""
        # Find server for this tool
        server_name = None
        original_name = None
        
        for tool in self.tools:
            if tool['name'] == tool_name:
                server_name = tool.get('_mcp_server')
                original_name = tool.get('_original_name', tool_name)
                break
        
        if not server_name:
            raise ValueError(f"Tool not found: {tool_name}")
        
        if server_name not in self.sessions:
            raise ValueError(f"Server not connected: {server_name}")
        
        logger.info(f"Executing: {tool_name} (original: {original_name}) on {server_name}")
        logger.debug(f"  Arguments: {arguments}")
        
        # Execute via MCP using original name
        session = self.sessions[server_name]
        result = await session.call_tool(original_name, arguments)
        
        # Extract result
        if hasattr(result, 'content') and result.content:
            result_text = result.content[0].text
        else:
            result_text = str(result)
        
        logger.debug(f"  Result: {result_text[:200]}...")
        
        return result
    
    def get_tool_info(self, tool_name: str) -> Optional[Dict[str, Any]]:
        """Get information about a specific tool."""
        for tool in self.tools:
            if tool['name'] == tool_name:
                return tool
        return None
    
    async def close(self):
        """Close all MCP connections."""
        logger.info("Closing MCP Tools Manager...")
        
        # Close sessions
        for server_name, session in self.sessions.items():
            try:
                await session.__aexit__(None, None, None)
                logger.debug(f"  [OK] Closed: {server_name}")
            except Exception as e:
                logger.error(f"  [X] Error closing {server_name}: {e}")
        
        # Close stdio contexts
        for context, read_stream, write_stream in self._stdio_contexts:
            try:
                await context.__aexit__(None, None, None)
            except Exception:
                pass
        
        self.sessions.clear()
        self.tools.clear()
        self._stdio_contexts.clear()
        logger.info("[OK] MCP Tools Manager closed")


# Test function
async def main():
    """Test the MCP Tools Manager."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    manager = MCPToolsManager()
    await manager.initialize()
    
    print(f"\n{'='*60}")
    print("AVAILABLE TOOLS:")
    print(f"{'='*60}")
    for tool in manager.get_tools_for_claude():
        print(f"\n• {tool['name']}")
        print(f"  {tool['description']}")
    
    await manager.close()


if __name__ == "__main__":
    asyncio.run(main())
