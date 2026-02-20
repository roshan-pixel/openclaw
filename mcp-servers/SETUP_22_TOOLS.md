# Setup: Enable 22 MCP Tools in OpenClaw (5 Minutes)

## What You Have

✅ 21 Windows MCP tools (snapshot, shell, click, type, etc.)  
✅ 3 WhatsApp Bridge tools (logging, health checks)  
✅ Ready to integrate = **22 tools total**

## What You Need to Do

### Step 1: Verify MCP Servers Work (1 min)

```bash
cd C:\path\to\winclaw\mcp-servers

# Check status
python mcp-cli-tool.py status
```

Expected output: Both servers listed with tool counts.

### Step 2: Update Your OpenClaw Config (2 min)

**File:** `%USERPROFILE%\.openclaw\openclaw.json`

Add this to your config (or merge if sections exist):

```json
{
  "agents": {
    "defaults": {
      "cliBackends": {
        "mcp": {
          "command": "python",
          "args": ["C:/path/to/winclaw/mcp-servers/mcp-cli-tool.py"],
          "output": "json",
          "input": "stdin"
        }
      }
    }
  },
  "tools": {
    "alsoAllow": ["mcp"]
  }
}
```

Or use the provided template:

```bash
cat openclaw-mcp-config.json
# Copy the relevant parts to your openclaw.json
```

### Step 3: Restart OpenClaw Gateway (1 min)

```bash
openclaw gateway restart
```

Or:

```bash
python -m openclaw.gateway restart
```

### Step 4: Test One Tool (1 min)

In your agent chat:

```
Take a screenshot for me
```

Your agent will now have access to all 22 tools.

## How to Use the Tools

### In Your Agent Code

```python
# Your agent can now call any MCP tool
response = await agent.execute_mcp_tool(
    "windows-mcp-snapshot",
    {"use_vision": true}
)
```

### Via OpenClaw CLI

```bash
# List all tools
python mcp-cli-tool.py list-tools

# Get info about a specific tool
python mcp-cli-tool.py tool-info windows-mcp-click

# Call a tool
python mcp-cli-tool.py call windows-mcp-shell '{"command": "dir"}'
```

### In Chat

```
Agent: I have access to 22 tools now:
- 21 Windows system tools
- 3 WhatsApp bridge tools

What would you like me to do?
User: Take a screenshot and analyze it
Agent: [Uses windows-mcp-snapshot and windows-mcp-vision]
```

## Available Tools

### Windows MCP (21 tools)

1. `windows-mcp-snapshot` - Take screenshot (with optional vision analysis)
2. `windows-mcp-shell` - Execute PowerShell commands
3. `windows-mcp-click` - Click at coordinates
4. `windows-mcp-type` - Type text
5. `windows-mcp-scroll` - Scroll screen
6. `windows-mcp-move` - Move mouse
7. `windows-mcp-shortcut` - Keyboard shortcuts
8. `windows-mcp-app` - Launch/switch/resize windows
9. `windows-mcp-wait` - Wait N seconds
10. `windows-mcp-scrape` - Fetch URL content
11. `windows-mcp-vision` - OCR and image analysis
12. `windows-mcp-multiselect` - Multi-click
13. `windows-mcp-multiedit` - Edit multiple fields
14. `windows-mcp-process-manager` - Kill/list processes
15. `windows-mcp-service-manager` - Windows services
16. `windows-mcp-file-ops` - File operations
17. `windows-mcp-network-manager` - Network tools
18. `windows-mcp-registry` - Registry read/write
19. `windows-mcp-task-scheduler` - Scheduled tasks
20. `windows-mcp-system-info` - CPU/RAM/disk info
21. `windows-mcp-clipboard` - Read/write clipboard

### WhatsApp Bridge (3 tools)

1. `whatsapp-log-message` - Log events/messages
2. `whatsapp-bridge-health` - Check bridge status
3. `whatsapp-send-log` - Send message logs

## Troubleshooting

### Tools Not Showing Up

1. **Verify servers are running:**
   ```bash
   python mcp-cli-tool.py status
   ```
   Look for "running": true for both servers.

2. **Check MCP CLI tool works:**
   ```bash
   python mcp-cli-tool.py list-tools
   ```
   Should list all 22 tools in JSON.

3. **Verify OpenClaw config:**
   ```bash
   grep -A 5 "cliBackends" %USERPROFILE%\.openclaw\openclaw.json
   ```

4. **Restart gateway:**
   ```bash
   openclaw gateway restart
   ```

### Process Issues

If servers crash, they auto-restart. Check logs:

```bash
cat mcp_execution.log
cat mcp_servers_startup.log
```

### Permissions Error

Make sure the Python script is executable:

```bash
icacls "C:\path\to\winclaw\mcp-servers\mcp-cli-tool.py" /grant Everyone:F
```

## Next Steps

### Option 1: Quick Testing
Use the tools in your agent immediately via chat.

### Option 2: Advanced Configuration
- Add tool aliases in openclaw.json (see `openclaw-mcp-config.json`)
- Create custom wrappers for frequently-used tools
- Add tool cost tracking for metered usage

### Option 3: Production Deployment
- Move MCP servers to a stable location
- Create systemd services or Windows scheduled tasks to auto-start servers
- Add health monitoring and alerting
- Document tool usage patterns

## FAQ

**Q: Do I need to keep a terminal open?**  
A: No. MCPs run as background processes. Just start them once with `python start-mcp-servers.py` and they stay running.

**Q: Can I add more MCP servers?**  
A: Yes. Edit `mcp-cli-tool.py` and add to the `MCP_SERVERS` list.

**Q: What's the latency?**  
A: ~100ms per tool call. If performance is critical, run MCPs on the same machine.

**Q: Can I use these tools from other applications?**  
A: Yes, they're standard MCPs. Any MCP-compatible client can use them.

**Q: How do I update/modify tools?**  
A: Edit the .py files in `mcp-servers/`, then run `python mcp-cli-tool.py list-tools` to reload.

## Support

- Check `MCP_INTEGRATION_GUIDE.md` for deeper technical details
- Review `mcp-cli-tool.py` source code for implementation
- See individual MCP server files (`windows_mcp_server.py`, etc.) for tool schemas

---

**Status:** ✅ 22 tools ready to use!  
**Next:** Run `python mcp-cli-tool.py status` to verify everything is working.
