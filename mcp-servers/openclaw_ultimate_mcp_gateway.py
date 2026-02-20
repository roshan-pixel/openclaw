#!/usr/bin/env python3
"""
ULTIMATE MCP Gateway - Direct MCP Protocol
Uses actual MCP protocol methods
"""

import asyncio
import json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent / "lib"))
from mcp_manager import MCPManager
from flask import Flask, request, jsonify
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

gateway = MCPManager(str(Path(__file__).parent / "config" / "mcp_config.json"))

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "mcp": "ready"})

@app.route('/tools', methods=['GET'])
async def tools():
    loop = asyncio.new_event_loop()
    asyncio.set
