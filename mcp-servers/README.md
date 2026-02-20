# OpenClaw MCP Servers

> Windows AI Automation via Model Context Protocol (MCP)
> Connect AI models (Claude, Ollama/DeepSeek) to 22 Windows automation tools.

---

## Table of Contents

- What is This?
- Architecture Overview
- Folder Structure
- Prerequisites
- Installation
- Configuration
- Running the Server
- Available Tools
- WhatsApp Bridge
- Troubleshooting
- FAQ for Beginners

---

## What is This?

OpenClaw is an AI agent framework that gives Claude (or any LLM) the ability to control your Windows PC in real time.

It uses the Model Context Protocol (MCP) -- an open standard that lets AI models call 'tools' (like taking a screenshot, clicking a button, or running a shell command) during a conversation.

In simple terms:
  You type: 'Open Chrome and search for the weather in Jaipur'
        |
  Claude thinks -> calls tools -> clicks, types, takes screenshot
        |
  Claude replies with the result + screenshot

---

## Architecture Overview

    YOU (User)
    Chat via API / OpenClaw Client
           |  HTTP (port 18789)
           v
    OpenClaw Gateway (openclaw_gateway.py)
    - Receives your message
    - Sends to Claude / LiteLLM / Ollama
    - Manages agent loop (think -> act -> observe)
           |               |                |
           v               v                v
    MCP Server      LiteLLM Proxy    WhatsApp Bridge
    21 Windows      (port 4000)      (port 5001)
    Tools (stdio)        |
                    Ollama (optional)
                    (port 11434)

Data flow for one AI action:
  1. User sends message -> Gateway
  2. Gateway calls Claude/Ollama with tools list
  3. Claude decides to call Windows-MCP:Snapshot tool
  4. MCP Server takes screenshot -> returns base64 image
  5. Claude sees screenshot -> decides to click something
  6. MCP calls Windows-MCP:Click tool -> mouse clicks
  7. Claude replies to user with what happened

---

## Folder Structure

    mcp-servers/
    |
    +-- Core Entry Points
    |   +-- openclaw_main.py          <- Simple CLI chat entry point
    |   +-- openclaw_gateway.py       <- Full FastAPI REST gateway (main server)
    |   +-- start_gateway.py          <- Helper to start gateway with env check
    |   +-- windows_mcp_server.py     <- The MCP server (21 Windows tools)
    |   +-- windows_mcp_server.mjs    <- Node.js version of MCP server
    |
    +-- WhatsApp Integration
    |   +-- whatsapp_bridge_mcp.py        <- MCP wrapper for WhatsApp bridge
    |   +-- whatsapp_http_bridge.py       <- HTTP REST bridge server
    |   +-- whatsapp_log_bridge_server.py <- Bridge server (port 5001)
    |
    +-- Startup & Utilities
    |   +-- start_complete_system.bat     <- One-click: starts ALL services
    |   +-- check_system_status.bat       <- Check if all services are running
    |   +-- mcp-cli-tool.py               <- CLI interface for MCP tools
    |   +-- requirements.txt              <- Python dependencies
    |
    +-- Config & Templates
    |   +-- .env.example                          <- COPY TO .env AND FILL KEYS
    |   +-- openclaw-mcp-config.template.json     <- COPY AND CUSTOMIZE
    |   +-- config.json                           <- Server-level config
    |   +-- package.json                          <- Node.js config
    |
    +-- config/
    |   +-- agent_config.json     <- Agent behavior (retries, parallelism)
    |   +-- api_config.json       <- API model & token settings
    |   +-- mcp_config.json       <- Which MCP servers to connect
    |   +-- vision_config.json    <- Vision/screenshot settings
    |
    +-- tools/                    <- Individual MCP tool implementations
    |   +-- snapshot_tool.py      <- Take screenshot
    |   +-- click_tool.py         <- Mouse click
    |   +-- type_tool.py          <- Keyboard typing
    |   +-- scroll_tool.py        <- Mouse scroll
    |   +-- move_tool.py          <- Mouse move / drag
    |   +-- shortcut_tool.py      <- Keyboard shortcuts (Ctrl+C, Win+R, etc.)
    |   +-- shell_tool.py         <- Run PowerShell / CMD commands
    |   +-- app_tool.py           <- Launch / resize / switch apps
    |   +-- scrape_tool.py        <- Fetch web page content
    |   +-- wait_tool.py          <- Pause execution
    |   +-- vision_tool.py        <- Google Vision API analysis
    |   +-- multiselect_tool.py   <- Multi-click (Ctrl+Click)
    |   +-- multiedit_tool.py     <- Type in multiple fields at once
    |
    +-- lib/                      <- Core library / brain of the agent
    |   +-- mcp_manager.py            <- Manages MCP server connections
    |   +-- agent_loop.py             <- Think -> Act -> Observe loop
    |   +-- agent_orchestrator.py     <- Parallel task orchestration
    |   +-- claude_client.py          <- Anthropic API client
    |   +-- conversation_manager.py   <- Saves/loads conversation history
    |   +-- error_recovery.py         <- Auto-retry & fallback logic
    |   +-- smart_navigator.py        <- Intelligent UI navigation
    |   +-- swarm_intelligence.py     <- Run multiple tasks in parallel
    |   +-- self_synthesizing_tools.py <- Auto-generate new tools with AI
    |   +-- semantic_graph_memory.py  <- Knowledge graph memory
    |   +-- vision_analyzer.py        <- Screen understanding with Vision AI
    |
    +-- utils/                    <- Helper utilities
    |   +-- logger.py             <- Logging setup
    |   +-- admin.py              <- Windows admin privilege helpers
    |   +-- screenshot.py         <- Screenshot capture utilities
    |
    +-- conversations/            <- GITIGNORED: Auto-generated chat sessions
    +-- logs/                     <- GITIGNORED: Runtime log files

---

## Prerequisites

Make sure you have these installed BEFORE cloning:

  Tool              Version  Why Needed                  Download
  ----              -------  ----------                  --------
  Python            3.10+    Runs all .py files          python.org
  Node.js           18+      For .mjs MCP server         nodejs.org
  Git               Any      To clone the repo           git-scm.com
  Anthropic API Key  ---     Powers Claude AI            console.anthropic.com
  Ollama (optional) Latest   Run local LLMs              ollama.ai

Quick check -- open PowerShell and run:
  python --version    # Should show 3.10+
  node --version      # Should show 18+
  git --version       # Any version is fine

---

## Installation

### Step 1 -- Clone the Repository

  git clone https://github.com/YOUR_USERNAME/openclaw.git
  cd openclaw/mcp-servers


### Step 2 -- Set Up Python Virtual Environment (Recommended)

  # Create virtual environment (keeps dependencies isolated)
  python -m venv venv

  # Activate it (Windows PowerShell)
  .\venv\Scripts\Activate.ps1

  # You should see (venv) in your prompt now


### Step 3 -- Install Python Dependencies

  pip install -r requirements.txt

This installs: flask, requests, aiohttp, python-dotenv, fastapi, uvicorn, mcp, anthropic, litellm, etc.


### Step 4 -- Install Node.js Dependencies

  npm install


### Step 5 -- Set Up Your Environment Variables

  # Copy the example file
  copy .env.example .env

  # Open .env in Notepad and fill in your API key
  notepad .env

In .env, replace the placeholder with your real Anthropic API key:
  ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxx...


### Step 6 -- Configure OpenClaw (if using with OpenClaw client)

  # Copy the template
  copy openclaw-mcp-config.template.json openclaw-mcp-config.json

  # Open and replace <YOUR_ABSOLUTE_PATH> with your actual path
  notepad openclaw-mcp-config.json

Example -- replace:
  "args": ["<YOUR_ABSOLUTE_PATH>/mcp-servers/mcp-cli-tool.py"]

With your actual path:
  "args": ["C:/Users/YourName/openclaw/mcp-servers/mcp-cli-tool.py"]

---

## Configuration

### config/api_config.json -- Which AI model to use:

  {
    "api_key": "FROM_ENV",         <- Reads from your .env (never hardcode!)
    "model": "claude-3-haiku-20240307",
    "max_tokens": 4096
  }

### config/mcp_config.json -- Which MCP servers to start:

  {
    "mcpServers": {
      "windows-control": {
        "command": "python",
        "args": ["windows_mcp_server.py"]
      }
    }
  }

---

## Running the Server

### Option A -- Simple CLI Chat (Easiest for beginners)

  python openclaw_main.py

Type your instructions and press Enter. Claude will respond and take actions.


### Option B -- Full Gateway Server (REST API)

  python start_gateway.py

Server starts at http://localhost:18789

Send a request:
  Invoke-WebRequest -Uri "http://localhost:18789/chat" 
    -Method POST 
    -ContentType "application/json" 
    -Body '{"message": "Take a screenshot and describe what you see"}'


### Option C -- Start Everything at Once (Recommended)

  .\start_complete_system.bat

This opens 4 terminal windows:
  1. MCP Server       -- Windows tools (21 tools, stdio)
  2. LiteLLM Proxy    -- LLM routing (port 4000)
  3. WhatsApp Bridge  -- Message logging (port 5001)
  4. OpenClaw Gateway -- Main API (port 18789)


### Option D -- MCP Server Standalone (for OpenClaw / Claude Desktop)

  python windows_mcp_server.py

---

## Available Tools

  Tool                      What It Does                   Example Use
  ----                      ------------                   -----------
  Windows-MCP:Snapshot      Take a screenshot              "What's on my screen?"
  Windows-MCP:Click         Click at x,y coordinates       "Click the OK button"
  Windows-MCP:Type          Type text anywhere             "Type Hello in the box"
  Windows-MCP:Scroll        Scroll up/down/left/right      "Scroll down the page"
  Windows-MCP:Move          Move mouse / drag              "Hover over the menu"
  Windows-MCP:Shortcut      Keyboard shortcuts             "Press Ctrl+C"
  Windows-MCP:Shell         Run PowerShell/CMD             "List files in Downloads"
  Windows-MCP:App           Launch/resize/switch apps      "Open Notepad"
  Windows-MCP:Scrape        Fetch web page content         "Read the article at URL"
  Windows-MCP:Wait          Pause execution                "Wait 3 seconds"
  Windows-MCP:MultiSelect   Ctrl+Click multiple items      "Select files 1, 3, 5"
  Windows-MCP:MultiEdit     Type in multiple fields        "Fill out the form"
  whatsapp-log-message      Log to WhatsApp bridge         "Log this event"
  whatsapp-bridge-health    Check bridge status            "Is bridge running?"

---

## Troubleshooting

Problem: ModuleNotFoundError: No module named 'mcp'
  pip install mcp anthropic

Problem: ANTHROPIC_API_KEY not found
  - Make sure your .env file exists with your key
  - Run from the mcp-servers/ directory

Problem: PowerShell script execution blocked
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

Problem: Screenshot tool fails or hangs
  - Run PowerShell as Administrator
  - Set GODMODE=true in your .env

Problem: Port 18789 already in use
  netstat -ano | findstr :18789
  taskkill /PID <PID> /F

Run built-in diagnostics:
  python diagnose_mcp_stdio.py     <- Test MCP connection
  python diagnose_api_key.py       <- Test your API key
  python test_prerequisites.py     <- Check all requirements
  python test_mcp_connection.py    <- Full connection test

---

## FAQ for Beginners

Q: What is MCP?
A: Model Context Protocol is like a plug-in system for AI. It lets AI models call external tools
   (like 'take a screenshot' or 'run a command') during a conversation. Think of it like giving the AI hands.

Q: Do I need to pay for Claude?
A: You need an Anthropic API key, which has usage-based pricing. New accounts get free credits.
   The claude-3-haiku model (default) is the cheapest. Alternatively, use Ollama with a free local model.

Q: Can I use this without an Anthropic key?
A: Yes! Install Ollama (ollama.ai), pull a model (ollama pull deepseek-r1), then set OLLAMA_MODEL=deepseek-r1 in .env.

Q: Is this safe? Can the AI accidentally delete my files?
A: The AI only does what you ask. The Shell tool can run any PowerShell command, so be careful.
   Keep GODMODE=false until you're comfortable.

Q: The server crashed. How do I see what went wrong?
A: Check log files (gitignored, only exist locally):
     Get-Content logs\gateway_ultimate.log -Tail 50
     Get-Content mcp_execution.log -Tail 50

Q: How do I update to the latest version?
A: git pull origin main
   pip install -r requirements.txt

---

## License

MIT License -- free to use, modify, and distribute.

---

## Contributing

1. Fork the repository
2. Create a feature branch: git checkout -b feature/my-feature
3. Commit your changes: git commit -m "Add my feature"
4. Push to branch: git push origin feature/my-feature
5. Open a Pull Request

---
Built with Anthropic Claude, MCP, and Python.