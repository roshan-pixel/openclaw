# OpenClaw MCP Integration Guide

## Problem

You have 22 MCP tools built (21 Windows MCP + WhatsApp Bridge), but they're not connected to OpenClaw yet. OpenClaw doesn't auto-discover MCPs—they need to be explicitly wired in.

## Solution

OpenClaw currently supports MCPs through the **plugins system** or by creating a **wrapper that exposes MCP tools as OpenClaw tools**.

### Option 1: Quick Start - Use MCP via HTTP Proxy (Recommended for Testing)

The fastest way to enable the 22 tools is to:

1. **Start your MCP servers** (they run as independent processes)
2. **Create a proxy layer** that OpenClaw can call to execute MCP tools
3. **Register the proxy as a custom tool** in OpenClaw

### Option 2: Full Integration - MCP Plugin (For Production)

Create an official OpenClaw plugin that:

- Auto-discovers and loads MCP servers
- Exposes all MCP tools as native OpenClaw tools
- Handles stdio communication automatically

## Quick Setup (Option 1)

### Step 1: Install MCP SDK

```bash
pip install mcp anthropic
```

### Step 2: Start Your MCP Servers

Create `start-mcp-servers.sh` (or `.bat` for Windows):

```bash
#!/bin/bash
python windows_mcp_server.py &
sleep 1
python whatsapp_bridge_mcp.py &
```

Or use the provided `start-mcp-servers.py`:

```bash
python start-mcp-servers.py
```

### Step 3: Create MCP Proxy Tool

OpenClaw can call MCPs via a custom Python CLI backend or a direct MCP client.

Add to your OpenClaw config (`openclaw.json`):

```json
{
  "agents": {
    "defaults": {
      "cliBackends": {
        "mcp": {
          "command": "python",
          "args": ["/path/to/mcp-proxy.py"],
          "input": "stdin",
          "output": "json"
        }
      }
    }
  }
}
```

Then create `mcp-proxy.py` that forwards requests to your MCP servers.

### Step 4: Register Tools

Once the proxy is working, you can expose tools in your system prompt or register them as custom tools.

## How to Actually Get This Working Now

Since MCP integration in OpenClaw is custom, here's the **direct approach**:

### The Real Fix: Embed MCPs in OpenClaw

Your MCP servers are Python programs that communicate via **JSON-RPC over stdio**. To make them available:

**Option A: Run them in the background and create wrapper functions**

```python
# In your agent code or as a custom tool
import subprocess
import json

class MCPToolWrapper:
    def __init__(self, mcp_process):
        self.proc = mcp_process

    def call_tool(self, tool_name, args):
        """Call a tool on the running MCP server"""
        request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {"name": tool_name, "arguments": args}
        }
        self.proc.stdin.write(json.dumps(request) + "\n")
        response = json.loads(self.proc.stdout.readline())
        return response.get("result")
```

**Option B: Create an OpenClaw Skill** (bundled tool package)

Implement the 22 tools as a skill that OpenClaw natively understands.

**Option C: Use the MCP Registry** (if Anthropic/OpenClaw adds official support)

## What I've Created For You

### Files in this directory:

1. **`start-mcp-servers.py`** - Launches all your MCP servers and monitors them
2. **`mcp-loader-for-openclaw.py`** - Connects to servers and exports tool definitions
3. **`MCP_INTEGRATION_GUIDE.md`** (this file)

### To Use Them:

```bash
# Terminal 1: Start your MCP servers
python start-mcp-servers.py

# Terminal 2: Load and export tools
python mcp-loader-for-openclaw.py
```

This will create `mcp_tools.json` with all 22 tool definitions.

## The Gateway Fix

To make OpenClaw actually **see** your 22 tools, the best approach is:

### Create an MCP Gateway Extension

```python
# openclaw/mcp-gateway-extension.py
from mcp.client import Client
import json

class OpenClawMCPGateway:
    def __init__(self):
        self.servers = {}
        self.tools = {}

    def register_mcp_server(self, name: str, startup_cmd: List[str]):
        """Register an MCP server"""
        client = Client(name, startup_cmd)
        self.servers[name] = client
        # Load tools from this server
        tools = client.list_tools()
        for tool in tools:
            self.tools[tool['name']] = (name, tool)

    def execute_mcp_tool(self, tool_name: str, args: dict):
        """Execute a tool through its MCP server"""
        server_name, tool_def = self.tools[tool_name]
        client = self.servers[server_name]
        return client.execute(tool_name, args)
```

Then register it with OpenClaw's tool system.

## Current Status

✅ You have 22 MCP tools ready  
✅ You have 2 servers built (Windows + WhatsApp)  
❌ OpenClaw doesn't natively load MCPs (yet)  
🔧 Need: MCP gateway layer or plugin

## Next Steps

1. **Verify MCP servers work independently**

   ```bash
   python windows_mcp_server.py
   ```

2. **Create a simple test client** to confirm JSON-RPC communication works

3. **Choose integration method**:
   - If you want quick testing: Use the HTTP proxy method
   - If you want production: Build an OpenClaw plugin

4. **Register tools with OpenClaw** once the gateway is working

## Support

If you get stuck, verify:

- Are your MCP servers exporting tool definitions via `tools/list` method?
- Can you manually call a tool via the JSON-RPC protocol?
- Is OpenClaw's gateway able to execute `exec` commands? (This is your entry point)

## Resources

- MCP Spec: https://modelcontextprotocol.io/
- OpenClaw Plugins: https://clawhub.com
- MCP Python SDK: https://github.com/modelcontextprotocol/python-sdk
