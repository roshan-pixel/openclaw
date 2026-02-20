#!/usr/bin/env python3
"""
MCP stdio wrapper for the WhatsApp Log Bridge at http://localhost:5001
"""
import sys
import os
import asyncio
import json
import logging
import requests
from datetime import datetime

log_file = open(os.path.join(os.path.dirname(__file__), "whatsapp_bridge_mcp.log"), "a")
sys.stderr = log_file

from mcp.server import Server
from mcp.types import Tool, TextContent
from mcp.server.stdio import stdio_server

BRIDGE_URL = "http://localhost:5001"
logger = logging.getLogger("whatsapp-bridge-mcp")
logging.basicConfig(stream=log_file, level=logging.INFO)

server = Server("whatsapp-log-bridge")

@server.list_tools()
async def list_tools():
    return [
        Tool(
            name="whatsapp-log-message",
            description="Log a message or event to the WhatsApp Log Bridge server.",
            inputSchema={
                "type": "object",
                "properties": {
                    "message": {"type": "string", "description": "The message or event to log"},
                    "level": {"type": "string", "enum": ["info", "warning", "error", "debug"], "default": "info"},
                    "source": {"type": "string", "description": "Source of the log", "default": "openclaw"}
                },
                "required": ["message"]
            }
        ),
        Tool(
            name="whatsapp-bridge-health",
            description="Check if the WhatsApp Log Bridge is online.",
            inputSchema={"type": "object", "properties": {}}
        ),
        Tool(
            name="whatsapp-send-log",
            description="Send structured WhatsApp message log to the bridge for history/replay.",
            inputSchema={
                "type": "object",
                "properties": {
                    "sender": {"type": "string", "description": "Phone number or name"},
                    "message": {"type": "string", "description": "Message content"},
                    "timestamp": {"type": "string", "description": "ISO timestamp (optional)"},
                    "direction": {"type": "string", "enum": ["inbound", "outbound"], "default": "outbound"}
                },
                "required": ["sender", "message"]
            }
        )
    ]

@server.call_tool()
async def call_tool_handler(name: str, arguments: dict):
    try:
        if name == "whatsapp-bridge-health":
            resp = requests.get(f"{BRIDGE_URL}/health", timeout=5)
            return [TextContent(type="text", text=f"Status: {resp.status_code} - {resp.text}")]
        elif name in ("whatsapp-log-message", "whatsapp-send-log"):
            payload = {
                "message": arguments.get("message", ""),
                "sender": arguments.get("sender", "openclaw"),
                "level": arguments.get("level", "info"),
                "source": arguments.get("source", "openclaw"),
                "direction": arguments.get("direction", "outbound"),
                "timestamp": arguments.get("timestamp", datetime.utcnow().isoformat())
            }
            resp = requests.post(f"{BRIDGE_URL}/log", json=payload, timeout=10)
            return [TextContent(type="text", text=f"OK: {resp.status_code} - {resp.text}")]
        return [TextContent(type="text", text=f"Unknown tool: {name}")]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
