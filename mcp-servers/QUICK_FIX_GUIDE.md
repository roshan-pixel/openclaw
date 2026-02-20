# QUICK FIX GUIDE - MCP STDIO Pollution

## The Problem
Your MCP server is printing something to stdout that's not valid JSON-RPC.
This breaks the stdio protocol between ULTIMATE Gateway and the MCP server.

Error you're seeing:
```
Invalid JSON: EOF while parsing a value at line 2 column 0 [input '\n']
```

This means: A stray newline (\n) or other text is going to stdout.

## Quick Solution (5 minutes)

### Option 1: Use the Ultra-Clean Server (Recommended)

1. **Backup your current server:**
   ```bash
   cd C:\path\to\winclaw\mcp-servers
   copy windows_mcp_server.py windows_mcp_server_backup.py
   ```

2. **Replace with ultra-clean version:**
   ```bash
   copy windows_mcp_server_ultraclean.py windows_mcp_server.py
   ```

3. **Restart your system:**
   ```bash
   FINAL-PATCH.bat
   ```

### Option 2: Test with Minimal Server First

If you want to verify the MCP protocol works before using the full server:

1. **Update config to use minimal server:**
   Edit `config\mcp_config.json`:
   ```json
   {
     "mcpServers": {
       "windows-control": {
         "command": "python",
         "args": ["minimal_screenshot_mcp.py"],
         "env": {
           "PYTHONWARNINGS": "ignore"
         }
       }
     }
   }
   ```

2. **Restart:**
   ```bash
   FINAL-PATCH.bat
   ```

3. **Test from WhatsApp:** "Take a screenshot"

4. **If it works:** Switch back to ultra-clean server in step 1

## Diagnostic Tool

To see exactly where the problem is:

```bash
python diagnose_mcp_stdio.py
```

This will test all available MCP servers and show you exactly which phase fails.

## What the Ultra-Clean Server Does Differently

1. **Redirects stderr BEFORE any imports**
   - Prevents import-time warnings/errors

2. **Uses decorator pattern for stream isolation**
   - Every tool load/execution wrapped in @with_null_streams

3. **All logging goes to file**
   - Check `mcp_execution.log` instead of stdout

4. **NullIO class**
   - Perfect null device that absorbs everything

5. **Try-finally guarantees**
   - Streams always restored even on errors

## Verify It's Working

After replacing the server, check ULTIMATE Gateway logs for:

```
✅ Session initialized successfully
✅ Tools discovered: 21
✅ CONNECTION SUCCESSFUL: windows-control
🔥 GOD MODE ACTIVE - ALL TOOLS READY! 🔥
```

Then test a tool:
```
WhatsApp: "Take a screenshot and send it to me"
```

You should see in logs:
```
🔧 Executing tool: windows-mcp-snapshot
🔧 CALLING TOOL: windows-mcp-snapshot
✅ Tool executed successfully
📸 Sending media to WhatsApp
```

## Still Not Working?

### Check 1: Python Warnings
Add to your environment variables:
```bash
set PYTHONWARNINGS=ignore
set PYTHONUNBUFFERED=1
```

### Check 2: Tool Module Pollution
Some tool modules might print on import. Check `mcp_execution.log`:
```bash
type mcp_execution.log | findstr "Loading tool"
```

If a tool fails to load, it might be printing during import.

### Check 3: Run Diagnostics
```bash
python diagnose_mcp_stdio.py 2> diagnostic_output.txt
type diagnostic_output.txt
```

Look for:
- Which phase fails (initialize, list_tools, call_tool)
- What raw output was received instead of JSON

### Check 4: Test Minimal Server
The minimal server has ZERO imports except MCP and pyautogui.
If this fails, the problem is with your Python environment or MCP library itself.

## Understanding the Files

| File | Purpose | When to Use |
|------|---------|-------------|
| `windows_mcp_server_ultraclean.py` | Full 21-tool server with perfect stdio | Production use |
| `minimal_screenshot_mcp.py` | Screenshot-only, minimal deps | Testing/debugging |
| `diagnose_mcp_stdio.py` | Test harness to find issues | Troubleshooting |

## The Root Cause

MCP uses JSON-RPC over stdio. This means:
- **stdin**: Client → Server (JSON-RPC requests)
- **stdout**: Server → Client (JSON-RPC responses) **MUST BE PURE JSON**
- **stderr**: Errors/logs (should be redirected to null or file)

ANY output to stdout that isn't valid JSON breaks the protocol.

Common sources:
- `print()` statements in code
- Logging to console
- Python warnings (SyntaxWarning, DeprecationWarning, etc.)
- Import-time prints from dependencies
- Exception tracebacks
- Debug output from libraries

The ultra-clean server blocks ALL of these.

## Success Indicators

✅ No "Invalid JSON" errors in ULTIMATE logs
✅ "21 tools discovered" in startup logs
✅ "GOD MODE ACTIVE" message appears
✅ Tool calls complete and return results
✅ Screenshots/other outputs appear in WhatsApp

## Next Steps After Fix

1. Monitor `mcp_execution.log` for any errors
2. Test each tool category:
   - Screenshot: "Take a screenshot"
   - Click: "Click at coordinates 500, 300"
   - Type: "Type 'hello world' on screen"
   - Shell: "Run command 'dir' for me"

3. If specific tools fail, check their individual modules in `tools/` directory

## Emergency Fallback

If NOTHING works, you can bypass MCP temporarily:

1. Create a simple HTTP endpoint in ULTIMATE that calls tools directly
2. Use subprocess to call tool scripts manually
3. Investigate why MCP stdio is broken in your environment

But the ultra-clean server SHOULD work on any Windows system with Python 3.7+.
