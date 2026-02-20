#!/usr/bin/env python3
"""
Minimal MCP Server Test - Verifies basic MCP protocol works
Run this first to ensure MCP itself is working
"""

import asyncio
import sys
import os

# Silence stderr during imports
sys.stderr = open(os.devnull, 'w')

from mcp.server import Server
from mcp.types import Tool, TextContent
from mcp.server.stdio import stdio_server

# Restore stderr for MCP
sys.stderr = sys.__stderr__

server = Server("test-server")

@server.list_tools()
async def list_tools() -> list[Tool]:
    """Return a simple test tool"""
    return [
        Tool(
            name="test-echo",
            description="Simple echo test tool",
            inputSchema={
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "description": "Message to echo"
                    }
                },
                "required": ["message"]
            }
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    """Execute the test tool"""
    if name == "test-echo":
        message = arguments.get("message", "no message")
        return [TextContent(type="text", text=f"Echo: {message}")]
    
    return [TextContent(type="text", text="Unknown tool")]

async def main():
    """Run the test server"""
    async with stdio_server() as (read_stream, write_stream):
        init_options = server.create_initialization_options()
        await server.run(read_stream, write_stream, init_options)

if __name__ == "__main__":
    asyncio.run(main())
