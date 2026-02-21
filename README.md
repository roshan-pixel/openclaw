# 🦞 WinClaw — Windows AI Automation via MCP

Connect AI models (Claude, Ollama/DeepSeek) to 21 Windows automation tools. Control your desktop, run commands, send WhatsApp messages, take screenshots, and more.

---

## 📖 Table of Contents
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

## 🧐 What is This?
**WinClaw** is an AI agent framework that gives Claude (or any LLM) the ability to control your Windows PC in real-time. It uses the **Model Context Protocol (MCP)**, an open standard that lets AI models call tools like taking a screenshot, clicking a button, or running a shell command during a conversation.

**In simple terms:**
1. **You type:** "Open Chrome and search for the weather in Jaipur."
2. **Claude thinks:** Calls tools (clicks, types, takes screenshot).
3. **Claude replies:** With the result + screenshot.

---

## 🏗 Architecture Overview
```
YOU (User Chat via API)
      │
      ▼
OpenClaw Gateway (winclaw_gateway.py — HTTP port 18789)
      │─── Manages agent loop (Think -> Act -> Observe)
      │─── Sends to Claude / LiteLLM / Ollama
      ▼
  MCP Server (windows_mcp_server.py or windows_mcp_server.mjs)
      │─── 21 Windows Tools (Snapshot, Click, Shell, etc.)
      │─── Transport: stdio (JSON-RPC over stdin/stdout)
      ▼
WhatsApp Bridge (whatsapp_log_bridge_server.py — HTTP port 5001)
```

**Data flow for one AI action:**
1. User sends message -> Gateway.
2. Gateway calls Claude/Ollama with tools list.
3. Claude decides to call `windows-mcp-snapshot` tool.
4. MCP Server takes screenshot -> returns base64 image.
5. Claude sees screenshot -> decides to click something.
6. MCP calls `windows-mcp-click` tool -> mouse clicks.
7. Claude replies to user with what happened.

> **Note:** The MCP server communicates with the host (Claude Desktop or the WinClaw gateway) via **stdio** (standard input/output), not a network port. Only the gateway REST API (port 18789) and the WhatsApp bridge (port 5001) are network services.

---

## 📂 Folder Structure

All core WinClaw files live under `mcp-servers/`.

### 🚀 Core Entry Points (`mcp-servers/`)
- `winclaw_main.py`: Simple CLI chat entry point.
- `winclaw_gateway.py`: Full FastAPI REST gateway (main server).
- `start_gateway.py`: Helper to start gateway with env check.
- `windows_mcp_server.py`: The MCP server — 21 Windows tools (Python).
- `windows_mcp_server.mjs`: Node.js version of the MCP server.

### 💬 WhatsApp Integration (`mcp-servers/`)
- `whatsapp_bridge_mcp.py`: MCP wrapper for WhatsApp bridge.
- `whatsapp_http_bridge.py`: HTTP REST bridge server.
- `whatsapp_log_bridge.py`: Log-based bridge.
- `whatsapp_log_bridge_server.py`: Bridge server (port 5001).

### 🛠 Startup Utilities (`mcp-servers/`)
- `start_complete_system.bat`: One-click starts ALL services.
- `check_system_status.bat`: Check if all services are running.
- `mcp-cli-tool.py`: CLI interface for MCP tools.
- `requirements.txt`: Python dependencies.

### ⚙️ Config Templates (`mcp-servers/`)
- `.env.example`: Copy this to `.env` and fill in keys.
- `winclaw-mcp-config.template.json`: Copy & customize for WinClaw.
- `config/api_config.json`: Choose your model.
- `config/mcp_config.json`: Define which MCP servers to start.
- `config/agent_config.json`: Set behavior (retries, parallelism).
- `package.json`: Node.js config for the `.mjs` server.

### 🧠 lib — Core Library (`mcp-servers/lib/`)
- `mcp_manager.py`: Manages MCP server connections.
- `agent_integration.py`: Enhanced agent wrapper.
- `agent_loop.py`: Think -> Act -> Observe loop.
- `agent_orchestrator.py`: Parallel task orchestration.
- `claude_client.py`: Anthropic API client.
- `conversation_manager.py`: Saves/loads conversation history.
- `error_recovery.py`: Auto-retry fallback logic.
- `performance_optimizer.py`: Caching & rate limiting.
- `smart_navigator.py`: Intelligent UI navigation.
- `swarm_intelligence.py`: Run multiple tasks in parallel.
- `self_synthesizing_tools.py`: Auto-generate new tools with AI.
- `predictive_execution.py`: Pre-execute predicted next actions.
- `semantic_graph_memory.py`: Knowledge graph memory.
- `human_conversation_sentient.py`: Personality engine.
- `vision_analyzer.py`: Screen understanding with Vision AI.

---

## 📋 Prerequisites
| Tool | Version | Why Needed | Download |
| :--- | :--- | :--- | :--- |
| **Python** | 3.10+ | Runs all .py files | [python.org](https://www.python.org/) |
| **Node.js** | 18+ | For .mjs MCP server | [nodejs.org](https://nodejs.org/) |
| **Git** | Any | To clone the repo | [git-scm.com](https://git-scm.com/) |
| **Anthropic Key** | - | Powers Claude AI | [console.anthropic.com](https://console.anthropic.com/) |
| **Ollama** | Optional | Run local LLMs | [ollama.ai](https://ollama.ai/) |

---

## 📥 Installation

```powershell
# 1. Clone the repository
git clone https://github.com/roshan-pixel/winclaw.git
cd winclaw

# 2. Install Python dependencies
pip install -r mcp-servers/requirements.txt

# 3. Install Node.js dependencies (for .mjs server)
cd mcp-servers
npm install
cd ..

# 4. Copy the environment template and add your API key
copy mcp-servers\.env.example mcp-servers\.env
notepad mcp-servers\.env
```

---

## ⚙️ Configuration

### 1. Environment Variables
Copy `mcp-servers/.env.example` to `mcp-servers/.env` and add your **ANTHROPIC_API_KEY**.

> ⚠️ **Security:** Never commit your `.env` file. Keep `GODMODE=false` (the default) until you fully understand the implications of elevated shell access.

### 2. Config Files
- `mcp-servers/config/api_config.json`: Choose your model (default: `claude-3-haiku-20240307`).
- `mcp-servers/config/mcp_config.json`: Define which MCP servers to start.
- `mcp-servers/config/agent_config.json`: Set behavior (retries, parallelism).

### 3. Claude Desktop Integration
To use WinClaw directly with Claude Desktop, add the following to your Claude Desktop `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "windows-mcp": {
      "command": "python",
      "args": ["C:/path/to/winclaw/mcp-servers/windows_mcp_server.py"]
    }
  }
}
```

---

## 🏃 Running the Server

```powershell
cd mcp-servers
```

### Option A: Simple CLI Chat (Easiest)
```powershell
python winclaw_main.py
```

### Option B: Full Gateway Server (REST API)
```powershell
python start_gateway.py
```

### Option C: Start Everything at Once (Recommended)
```powershell
.\start_complete_system.bat
```

---

## 🛠 Available Tools
The MCP server exposes **21 tools** to the AI, including:
- **windows-mcp-snapshot**: Take a screenshot.
- **windows-mcp-click**: Click at x,y coordinates.
- **windows-mcp-type**: Type text anywhere.
- **windows-mcp-shortcut**: Run keyboard shortcuts (Ctrl+C, Win+R).
- **windows-mcp-shell**: Run PowerShell/CMD commands.
- **windows-mcp-app**: Launch/resize/switch apps.
- **windows-mcp-vision**: OCR and screen analysis.
- **windows-mcp-scroll**: Scroll at coordinates.
- **windows-mcp-process-manager**: Manage running processes.
- **windows-mcp-registry**: Read/write Windows registry.
- And 11 more system tools (file ops, network, services, etc.)

---

## 💬 WhatsApp Bridge
Start the bridge server to send/receive messages via AI:
```powershell
python mcp-servers\whatsapp_log_bridge_server.py
```
It runs at `http://localhost:5001`.

---

## ❓ FAQ for Beginners
**Q: Is this safe? Can the AI delete my files?**
A: The AI only does what you ask. However, the Shell tool can run any PowerShell command — there is no command allowlist, and **commands execute immediately** when the AI calls the tool with no confirmation step. Keep `GODMODE=false` in your `.env` and only grant access to users you fully trust.

**Q: How do I update?**
```powershell
git pull origin main
pip install -r mcp-servers/requirements.txt
```

---

## ⚖️ License
MIT License — free to use, modify, and distribute.

Built with ❤️ using Anthropic Claude, MCP, and Python.
