# 🦞 WinClaw — Windows AI Automation via MCP

Connect AI models (Claude, Ollama/DeepSeek) to 22+ Windows automation tools. Control your desktop, run commands, send WhatsApp messages, take screenshots, and more.

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
1. **You type:** \"Open Chrome and search for the weather in Jaipur.\"
2. **Claude thinks:** Calls tools (clicks, types, takes screenshot).
3. **Claude replies:** With the result + screenshot.

---

## 🏗 Architecture Overview
```
YOU (User Chat via API)
      │
      ▼
OpenClaw Client (HTTP port 18789)
      │
      ▼
OpenClaw Gateway (winclawgateway.py)
      │─── Manages agent loop (Think -> Act -> Observe)
      │─── Sends to Claude / LiteLLM / Ollama
      ▼
  MCP Server (windowsmcpserver.py) 
      │─── 21+ Windows Tools (Snapshot, Click, Shell, etc.)
      │─── Proxy port 5001
      ▼
WhatsApp Bridge (whatsappbridgemcp.py)
```

**Data flow for one AI action:**
1. User sends message -> Gateway.
2. Gateway calls Claude/Ollama with tools list.
3. Claude decides to call `Windows-MCPSnapshot` tool.
4. MCP Server takes screenshot -> returns base64 image.
5. Claude sees screenshot -> decides to click something.
6. MCP calls `Windows-MCPClick` tool -> mouse clicks.
7. Claude replies to user with what happened.

---

## 📂 Folder Structure

### 🚀 Core Entry Points
- `winclawmain.py`: Simple CLI chat entry point.
- `winclawgateway.py`: Full FastAPI REST gateway (main server).
- `startgateway.py`: Helper to start gateway with env check.
- `windowsmcpserver.py`: The MCP server (21 Windows tools).
- `windowsmcpserver.mjs`: Node.js version of MCP server.

### 💬 WhatsApp Integration
- `whatsappbridgemcp.py`: MCP wrapper for WhatsApp bridge.
- `whatsapphttpbridge.py`: HTTP REST bridge server.
- `whatsapplogbridge.py`: Log-based bridge.
- `whatsapplogbridgeserver.py`: Bridge server (port 5001).

### 🛠 Startup Utilities
- `startcompletesystem.bat`: One-click starts ALL services.
- `checksystemstatus.bat`: Check if all services are running.
- `mcp-cli-tool.py`: CLI interface for MCP tools.
- `requirements.txt`: Python dependencies.

### ⚙️ Config Templates
- `.env.example`: Copy this to `.env` and fill in keys.
- `winclaw-mcp-config.template.json`: Copy & customize for WinClaw.
- `config.json`: Server-level config (transport, logging).
- `package.json`: Node.js config for `.mjs` server.

### 🧠 lib (Core Library)
- `mcpmanager.py`: Manages MCP server connections.
- `agentintegration.py`: Enhanced agent wrapper.
- `agentloop.py`: Think -> Act -> Observe loop.
- `agentorchestrator.py`: Parallel task orchestration.
- `claudeclient.py`: Anthropic API client.
- `conversationmanager.py`: Saves/loads conversation history.
- `errorrecovery.py`: Auto-retry fallback logic.
- `performanceoptimizer.py`: Caching & rate limiting.
- `smartnavigator.py`: Intelligent UI navigation.
- `swarmintelligence.py`: Run multiple tasks in parallel.
- `selfsynthesizingtools.py`: Auto-generate new tools with AI.
- `predictiveexecution.py`: Pre-execute predicted next actions.
- `semanticgraphmemory.py`: Knowledge graph memory.
- `humanconversationsentient.py`: Personality engine.
- `visionanalyzer.py`: Screen understanding with Vision AI.

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

## ⚙️ Configuration

### 1. Environment Variables
Copy `.env.example` to `.env` and add your **ANTHROPIC_API_KEY**.

### 2. Config Files
- `config/apiconfig.json`: Choose your model (default: `claude-3-haiku-20240307`).
- `config/mcpconfig.json`: Define which MCP servers to start.
- `config/agentconfig.json`: Set behavior (retries, parallelism).

---

## 🏃 Running the Server

### Option A: Simple CLI Chat (Easiest)
```powershell
python winclawmain.py
```

### Option B: Full Gateway Server (REST API)
```powershell
python startgateway.py
```

### Option C: Start Everything at Once (Recommended)
```powershell
./startcompletesystem.bat
```

---

## 🛠 Available Tools
The MCP server exposes **21 tools** to the AI, including:
- **Windows-MCPSnapshot**: Take a screenshot.
- **Windows-MCPClick**: Click at x,y coordinates.
- **Windows-MCPType**: Type text anywhere.
- **Windows-MCPShortcut**: Run keyboard shortcuts (Ctrl+C, Win+R).
- **Windows-MCPShell**: Run PowerShell/CMD commands.
- **Windows-MCPApp**: Launch/resize/switch apps.
- **WhatsApp-Log-Message**: Log messages to WhatsApp bridge.

---

## 💬 WhatsApp Bridge
Start the bridge server to send/receive messages via AI:
```powershell
python whatsapplogbridgeserver.py
```
It runs at `http://localhost:5001`.

---

## ❓ FAQ for Beginners
**Q: Is this safe? Can the AI delete my files?**
A: The AI only does what you ask. However, the Shell tool can run any PowerShell command. Keep `GODMODE=false` in your `.env` until you are comfortable.

**Q: How do I update?**
```powershell
git pull origin main
pip install -r requirements.txt
```

---

## ⚖️ License
MIT License — free to use, modify, and distribute.

Built with ❤️ using Anthropic Claude, MCP, and Python.
