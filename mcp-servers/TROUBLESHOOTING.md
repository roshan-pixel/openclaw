# MCP Server STDIO Fix - Troubleshooting Guide

## The Problem
Your MCP server is receiving corrupted input (newlines) instead of valid JSON-RPC messages. This happens when something pollutes stdout/stdin.

## Step-by-Step Fix

### Step 1: Test Basic MCP Functionality
Run the minimal test server first to verify MCP itself works:

```bash
python test_mcp_minimal.py
```

If this gives the same error, the problem is with your Python environment or how you're running it.
If this works, the problem is with the tool imports.

### Step 2: Run Diagnostics
Identify which tool imports are polluting stdio:

```bash
python diagnose_stdio.py 2> diagnostic_output.txt
```

Look at `diagnostic_output.txt` for any STDOUT/STDERR pollution warnings.

### Step 3: Use the Fixed Server
Replace your current server with `windows_mcp_server.py` which has:
- Early stderr redirection before any imports
- Complete stream isolation during tool loading
- Debug logging to file (check `mcp_server_debug.log`)

## Common Causes of STDIO Pollution

1. **Print statements in tool code** - Tools calling `print()` during import/initialization
2. **Library warnings** - Dependencies writing to stderr during import
3. **Logging configuration** - Logging to console instead of file
4. **Environment variables** - Python warnings enabled (PYTHONWARNINGS)

## Quick Fixes to Try

### Fix 1: Disable Python Warnings
```bash
set PYTHONWARNINGS=ignore
python windows_mcp_server.py
```

### Fix 2: Check Your Python Environment
```bash
python --version
where python
```

Make sure you're using the correct Python environment.

### Fix 3: Verify Working Directory
The server must be run from the directory containing the `tools` folder:

```powershell
cd C:\path\to\winclaw\mcp-servers
python windows_mcp_server.py
```

### Fix 4: Check for Buffering Issues
Some Windows terminals buffer output. Try:

```bash
python -u windows_mcp_server.py
```

The `-u` flag forces unbuffered output.

## How the Fixed Server Works

1. **Early Redirection**: Redirects stderr to null BEFORE any imports
2. **Lazy Loading**: Tools are loaded only when needed, not at startup
3. **Stream Isolation**: Every tool load/execution runs with streams redirected
4. **File Logging**: Debug info goes to `mcp_server_debug.log`, not stdout
5. **Guaranteed Restoration**: Streams always restored even on errors

## If Nothing Works

The error might be coming from the MCP client (not the server). Check:

1. How are you connecting to the server? (Claude Desktop, custom client, etc.)
2. Is the client sending malformed requests?
3. Check the client's configuration for this MCP server

## Debug Log Analysis

After running the server, check `mcp_server_debug.log`:

```
=== MCP Server Starting ===
Starting MCP server
STDIO server started
list_tools called
Loaded tool: windows-mcp-click
...
```

If the log is empty or stops early, the server crashed before MCP started.
If the log shows tool loading, but you still get errors, the client is sending bad data.

## File Descriptions

- `windows_mcp_server.py` - Fixed MCP server with complete stream isolation
- `test_mcp_minimal.py` - Minimal server to test if basic MCP works
- `diagnose_stdio.py` - Identifies which imports pollute stdio
- `mcp_server_debug.log` - Runtime debug log (created when server runs)
