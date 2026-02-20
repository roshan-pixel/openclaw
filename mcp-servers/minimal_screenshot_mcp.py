#!/usr/bin/env python3
"""
Minimal Screenshot MCP Server - For Testing Only
Only implements windows-mcp-snapshot to verify MCP protocol works
"""

import sys
import os

# Redirect stderr IMMEDIATELY
sys.stderr = open(os.devnull, 'w')

import asyncio
import base64
from io import BytesIO

from mcp.server import Server
from mcp.types import Tool, TextContent, ImageContent
from mcp.server.stdio import stdio_server

server = Server("screenshot-test")

@server.list_tools()
async def list_tools() -> list[Tool]:
    """Return only the screenshot tool"""
    return [
        Tool(
            name="windows-mcp-snapshot",
            description="Captures screenshot of the desktop",
            inputSchema={
                "type": "object",
                "properties": {
                    "use_vision": {
                        "type": "boolean",
                        "description": "Whether to use vision analysis (not implemented in minimal version)",
                        "default": False
                    }
                },
                "required": []
            }
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    """Execute the screenshot tool"""
    if name != "windows-mcp-snapshot":
        return [TextContent(type="text", text="Unknown tool")]
    
    try:
        # Import pyautogui only when needed
        import pyautogui
        
        # Take screenshot
        screenshot = pyautogui.screenshot()
        
        # Convert to bytes
        buffer = BytesIO()
        screenshot.save(buffer, format='PNG')
        image_bytes = buffer.getvalue()
        
        # Encode as base64
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')
        
        return [
            ImageContent(
                type="image",
                data=image_b64,
                mimeType="image/png"
            )
        ]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Screenshot failed: {str(e)}")]

async def main():
    """Run the minimal MCP server"""
    async with stdio_server() as (read_stream, write_stream):
        init_options = server.create_initialization_options()
        await server.run(read_stream, write_stream, init_options)

if __name__ == "__main__":
    asyncio.run(main())
