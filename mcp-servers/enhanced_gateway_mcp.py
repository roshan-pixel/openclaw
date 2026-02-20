#!/usr/bin/env python3
"""
MCP stdio wrapper for the Enhanced Gateway at http://localhost:18788
Exposes all 21 Windows tools via MCP protocol to OpenClaw.
"""
import sys
import os
import asyncio
import json
import logging
import requests

log_file = open(os.path.join(os.path.dirname(__file__), "enhanced_gw_mcp.log"), "a")
sys.stderr = log_file

from mcp.server import Server
from mcp.types import Tool, TextContent
from mcp.server.stdio import stdio_server

GATEWAY_URL = "http://localhost:18788"
logger = logging.getLogger("enhanced-gateway-mcp")
logging.basicConfig(stream=log_file, level=logging.INFO)

server = Server("enhanced-gateway")

def fetch_tools():
    try:
        resp = requests.get(f"{GATEWAY_URL}/tools", timeout=5)
        data = resp.json()
        return data.get("tools", [])
    except Exception as e:
        logger.error(f"Failed to fetch tools: {e}")
        return []

def call_tool_http(tool_name: str, arguments: dict):
    try:
        # Direct tool execution via responses endpoint
        resp = requests.post(
            f"{GATEWAY_URL}/v1/responses",
            json={
                "model": "gpt-4",
                "messages": [{"role": "user", "content": f"Execute: {tool_name}"}],
                "_direct_tool_call": True,
                "_tool_name": tool_name,
                "_tool_args": arguments
            },
            timeout=60
        )
        data = resp.json()
        if "choices" in data:
            msg = data["choices"][0].get("message", {})
            return msg.get("content", json.dumps(data))
        return json.dumps(data)
    except Exception as e:
        return f"Error calling {tool_name}: {str(e)}"

@server.list_tools()
async def list_tools():
    tools_data = fetch_tools()
    tools = []
    for t in tools_data:
        tools.append(Tool(
            name=t["name"],
            description=t.get("description", ""),
            inputSchema=t.get("input_schema", {"type": "object", "properties": {}})
        ))
    return tools

@server.call_tool()
async def call_tool_handler(name: str, arguments: dict):
    result = call_tool_http(name, arguments)
    return [TextContent(type="text", text=str(result))]

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
