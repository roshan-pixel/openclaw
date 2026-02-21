Windows AI Automation via Model Context Protocol (MCP)
Connect AI models (Claude, Ollama/DeepSeek) to 22 Windows automation tools to control your desktop, run commands, send WhatsApp messages, take screenshots, and more.

---

# WinClaw MCP Servers

- [What is This?](#what-is-this)
- [Architecture Overview](#architecture-overview)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Available Tools](#available-tools)
- [WhatsApp Bridge](#whatsapp-bridge)
- [Troubleshooting](#troubleshooting)
- [FAQ for Beginners](#faq-for-beginners)

---

## What is This?

WinClaw is an AI agent framework that gives Claude (or any LLM) the ability to control your Windows PC in real time.

It uses the Model Context Protocol (MCP) — an open standard that lets AI models call 'tools' (like taking a screenshot, clicking a button, or running a shell command) during a conversation.

**In simple terms:**
You type: "Open Chrome and search for the weather in Jaipur"
|
Claude thinks -> calls tools -> clicks, types, takes screenshot
|
Claude replies with the result + screenshot

---

## Architecture Overview

```text
YOU (User)
Chat via API / WinClaw Client
     |
     v
WinClaw Gateway (winclaw_gateway.py)
  - Receives your message
  - Sends to Claude / LiteLLM / Ollama
  - Manages agent loop (think -> act -> observe)
     |
 +------+------+
 |      |      |
 v      v      v
MCP Server  LiteLLM Proxy  WhatsApp Bridge
(port 4000) (optional)    (port 5001)
 |      v
21 Windows Tools  Ollama
(stdio)
```

**Data flow for one AI action:**

1. User sends message -> Gateway
2. Gateway calls Claude/Ollama with tools list
3. Claude decides to call `Windows-MCP:Snapshot` tool
4. MCP Server takes screenshot -> returns base64 image
5. Claude sees screenshot -> decides to click something
6. MCP calls `Windows-MCP:Click` tool -> mouse clicks
7. Claude replies to user with what happened

---

## Folder Structure

```text
mcp-servers/
│
├── 📄 Core Entry Points
│   ├── winclaw_main.py          ← Simple CLI chat entry point
│   ├── winclaw_gateway.py       ← Full FastAPI REST gateway (main server)
│   ├── start_gateway.py          ← Helper to start gateway with env check
│   ├── windows_mcp_server.py     ← The MCP server (21 Windows tools)
│   └── windows_mcp_server.mjs    ← Node.js version of MCP server
│
├── 📄 WhatsApp Integration
│   ├── whatsapp_bridge_mcp.py    ← MCP wrapper for WhatsApp bridge
│   ├── whatsapp_http_bridge.py   ← HTTP REST bridge server
│   ├── whatsapp_log_bridge.py    ← Log-based bridge
│   └── whatsapp_log_bridge_server.py ← Bridge server (port 5001)
│
├── 📄 Startup & Utilities
│   ├── start_complete_system.bat ← One-click: starts ALL services
│   ├── check_system_status.bat   ← Check if all services are running
│   ├── mcp-cli-tool.py           ← CLI interface for MCP tools
│   └── requirements.txt          ← Python dependencies
│
├── 📄 Config & Templates
│   ├── .env.example              ← ⭐ Copy this to .env and fill in keys
│   ├── winclaw-mcp-config.template.json ← ⭐ Copy & customize for WinClaw
│   ├── config.json               ← Server-level config (transport, logging)
│   └── package.json              ← Node.js config (for .mjs server)
│
├── 📁 config/
│   ├── agent_config.json         ← Agent behavior (retries, parallelism, caching)
│   ├── api_config.json           ← API model & token settings
│   ├── mcp_config.json           ← Which MCP servers to connect
│   └── vision_config.json        ← Vision/screenshot settings
│
├── 📁 tools/                     ← Individual MCP tool implementations
│   ├── __init__.py               ← BaseTool class all tools inherit from
│   ├── snapshot_tool.py          ← Take screenshot
│   ├── click_tool.py             ← Mouse click
│   ├── type_tool.py              ← Keyboard typing
│   ├── scroll_tool.py            ← Mouse scroll
│   ├── move_tool.py              ← Mouse move / drag
│   ├── shortcut_tool.py          ← Keyboard shortcuts (Ctrl+C, Win+R, etc.)
│   ├── shell_tool.py             ← Run PowerShell / CMD commands
│   ├── app_tool.py               ← Launch / resize / switch apps
│   ├── scrape_tool.py            ← Fetch web page content
│   ├── wait_tool.py              ← Pause execution
│   ├── window_tool.py            ← Window management
│   ├── vision_tool.py            ← Google Vision API analysis
│   ├── multiselect_tool.py       ← Multi-click (Ctrl+Click)
│   └── multiedit_tool.py         ← Type in multiple fields at once
│
├── 📁 lib/                       ← Core library / brain of the agent
│   ├── __init__.py
│   ├── mcp_manager.py            ← Manages MCP server connections
│   ├── agent_integration.py      ← Enhanced agent wrapper
│   ├── agent_loop.py             ← Think → Act → Observe loop
│   ├── agent_orchestrator.py     ← Parallel task orchestration
│   ├── claude_client.py          ← Anthropic API client
│   ├── conversation_manager.py   ← Saves/loads conversation history
│   ├── error_recovery.py         ← Auto-retry & fallback logic
│   ├── performance_optimizer.py  ← Caching & rate limiting
│   ├── smart_navigator.py        ← Intelligent UI navigation
│   ├── swarm_intelligence.py     ← Run multiple tasks in parallel
│   ├── self_synthesizing_tools.py← Auto-generate new tools with AI
│   ├── predictive_execution.py   ← Pre-execute predicted next actions
│   ├── semantic_graph_memory.py  ← Knowledge graph memory
│   ├── human_conversation_sentient.py ← Personality engine
│   └── vision_analyzer.py        ← Screen understanding with Vision AI
│
├── 📁 utils/                     ← Helper utilities
│   ├── __init__.py
│   ├── logger.py                 ← Logging setup
│   ├── admin.py                  ← Windows admin privilege helpers
│   ├── accessibility.py          ← Windows accessibility tree reader
│   └── screenshot.py             ← Screenshot capture utilities
│
├── 📁 conversations/             ← 🔒 Auto-generated, gitignored
│   └── (saved chat sessions)
│
└── 📁 logs/                      ← 🔒 Auto-generated, gitignored
    └── (runtime log files)
```

---

## Prerequisites

| Tool              | Version | Why Needed          | Download                                                |
| :---------------- | :------ | :------------------ | :------------------------------------------------------ |
| Python            | 3.10+   | Runs all .py files  | [python.org](https://www.python.org/)                   |
| Node.js           | 18+     | For .mjs MCP server | [nodejs.org](https://nodejs.org/)                       |
| Git               | Any     | To clone the repo   | [git-scm.com](https://git-scm.com/)                     |
| Anthropic API Key | ---     | Powers Claude AI    | [console.anthropic.com](https://console.anthropic.com/) |
| Ollama (optional) | Latest  | Run local LLMs      | [ollama.ai](https://ollama.ai/)                         |

**Quick check:** Open PowerShell and run:

```powershell
python --version # Should show 3.10+
node --version # Should show 18+
git --version # Any version is fine
```

---

## Installation

### Step 1: Clone the Repository

```powershell
git clone https://github.com/roshan-pixel/winclaw.git
cd winclaw/mcp-servers
```

### Step 2: Set Up Python Virtual Environment (Recommended)

```powershell
# Create virtual environment
python -m venv venv

# Activate it (Windows PowerShell)
.\\venv\\Scripts\\Activate.ps1
```

_You should see (venv) in your prompt now._

### Step 3: Install Python Dependencies

```powershell
pip install -r requirements.txt
```

_This installs: flask, requests, aiohttp, python-dotenv, fastapi, uvicorn, mcp, anthropic, litellm, and more._

### Step 4: Install Node.js Dependencies

```powershell
npm install
```

### Step 5: Set Up Your Environment Variables

```powershell
# Copy the example file
copy .env.example .env

# Open .env in Notepad and fill in your API key
notepad .env
```

In `.env`, replace the placeholder with your real Anthropic key: `ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxx...`

### Step 6: Configure WinClaw (if using with WinClaw client)

```powershell
# Copy the template
copy winclaw-mcp-config.template.json winclaw-mcp-config.json

# Open and replace YOUR_ABSOLUTE_PATH with your actual path
notepad winclaw-mcp-config.json
```

**Example:** replace `["/mcp-servers/mcp-cli-tool.py"]` with your path: `["C:/Users/YourName/winclaw/mcp-servers/mcp-cli-tool.py"]`

---

## Configuration

### config/api_config.json — Which AI model to use:

```json
{
  "api_key": "FROM_ENV",
  "model": "claude-3-haiku-20240307",
  "max_tokens": 4096
}
```

### config/mcp_config.json — Which MCP servers to start:

```json
{
  "mcpServers": {
    "windows-control": {
      "command": "python",
      "args": ["windows_mcp_server.py"]
    }
  }
}
```

### config/agent_config.json — How the agent behaves:

```json
{
  "orchestrator": {
    "max_parallel_tasks": 5,
    "max_retries": 3
  }
}
```

---

## Running the Server

### Option A: Simple CLI Chat (Easiest)

```powershell
python winclaw_main.py
```

Type your instructions and press Enter. Claude will respond and take actions.

### Option B: Full Gateway Server (REST API)

```powershell
python start_gateway.py
```

Server starts at `http://localhost:18789`. Send requests via PowerShell:

```powershell
Invoke-WebRequest -Uri "http://localhost:18789/chat" -Method POST -ContentType "application/json" -Body '{"message": "Take a screenshot and describe what you see"}'
```

### Option C: Start Everything at Once (Recommended)

```powershell
.\\start_complete_system.bat
```

This opens 4 terminal windows:

1. MCP Server — Windows tools (21 tools, stdio)
2. LiteLLM Proxy — LLM routing (port 4000)
3. WhatsApp Bridge — Message logging (port 5001)
4. WinClaw Gateway — Main API (port 18789)

### Option D: MCP Server Standalone

```powershell
python windows_mcp_server.py
```

Use this when connecting from Claude Desktop or another MCP client.

---

## Available Tools

| Tool                    | What It Does                  | Example Use               |
| :---------------------- | :---------------------------- | :------------------------ |
| Windows-MCP:Snapshot    | Take a screenshot             | "What's on my screen?"    |
| Windows-MCP:Click       | Click at x,y coordinates      | "Click the OK button"     |
| Windows-MCP:Type        | Type text anywhere            | "Type Hello in the box"   |
| Windows-MCP:Scroll      | Scroll up/down/left/right     | "Scroll down the page"    |
| Windows-MCP:Move        | Move mouse / hover / drag     | "Hover over the menu"     |
| Windows-MCP:Shortcut    | Keyboard shortcuts            | "Press Ctrl+C"            |
| Windows-MCP:Shell       | Run PowerShell / CMD          | "List files in Downloads" |
| Windows-MCP:App         | Launch / resize / switch apps | "Open Notepad"            |
| Windows-MCP:Scrape      | Fetch web page content        | "Read article at URL"     |
| Windows-MCP:Wait        | Pause execution               | "Wait 3 seconds"          |
| Windows-MCP:MultiSelect | Ctrl+Click multiple items     | "Select files 1, 3, 5"    |
| Windows-MCP:MultiEdit   | Type in multiple fields       | "Fill out the form"       |
| whatsapp-log-message    | Log to WhatsApp bridge        | "Log this event"          |
| whatsapp-bridge-health  | Check bridge status           | "Is bridge running?"      |

---

## WhatsApp Bridge

The WhatsApp bridge lets you send and receive messages through your AI agent.

1. **Start the bridge server:**

```powershell
python whatsapp_log_bridge_server.py
```

Runs at `http://localhost:5001`.

2. **Check if it's working:**

```powershell
Invoke-WebRequest -Uri "http://localhost:5001/health"
```

---

## Troubleshooting

- **Problem:** `ModuleNotFoundError: No module named 'mcp'`
- **Solution:** `pip install mcp anthropic`
- **Problem:** `ANTHROPIC_API_KEY` not found
- **Solution:** Ensure `.env` exists in the `mcp-servers/` directory with your key.
- **Problem:** PowerShell script execution blocked
- **Solution:** `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- **Problem:** Screenshot tool fails or hangs
- **Solution:** Run PowerShell as Administrator or set `GODMODE=true` in `.env`.
- **Problem:** Port 18789 already in use
- **Solution:** Find the PID using `netstat -ano | findstr :18789` and kill it with `taskkill /PID /F`.

**Run diagnostics:**

```powershell
python diagnose_mcp_stdio.py # Test MCP connection
python diagnose_api_key.py # Test your API key
python test_prerequisites.py # Check requirements
```

---

## FAQ for Beginners

**Q: What is MCP?** A: Model Context Protocol is like a plug-in system for AI. It lets AI models call external tools (like 'take a screenshot' or 'run a command') during a conversation. Think of it like giving the AI hands.

**Q: Do I need to pay for Claude?** A: You need an Anthropic API key, which has usage-based pricing. Alternatively, use Ollama with a free local model.

**Q: Can I use this without an Anthropic key?** A: Yes! Install Ollama, pull a model (`ollama pull deepseek-r1`), then set `OLLAMA_MODEL=deepseek-r1` in `.env`.

**Q: Is this safe?** A: The AI only does what you ask. The Shell tool can run any command, so be careful. Keep `GODMODE=false` until you're comfortable.

---

## License

MIT License — free to use, modify, and distribute.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add my feature"`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

_Built with Anthropic Claude, MCP, and Python._
