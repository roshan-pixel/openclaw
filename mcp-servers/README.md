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
- WhatsApp Integration
- Troubleshooting
- FAQ for Beginners

---

## What is This?

OpenClaw is an AI agent framework that gives Claude (or any LLM) the ability to control your Windows PC in real time.

It uses the Model Context Protocol (MCP) -- an open standard that lets AI models call 'tools' (like taking a screenshot, clicking a button, or running a shell command) during a conversation.

**In simple terms:**
You type: 'Open Chrome and search for the weather in Jaipur'
|
Claude thinks -> calls tools -> clicks, types, takes screenshot
|
Claude replies with the result + screenshot

---

## Architecture Overview

```text
YOU (User)
  Chat via API / OpenClaw Client
             |
             v
    OpenClaw Gateway (openclaw_gateway.py)
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

---

## Folder Structure

```text
mcp-servers/
│
├── 📄 Core Entry Points
│   ├── openclaw_main.py          ← Simple CLI chat entry point
│   ├── openclaw_gateway.py       ← Full FastAPI REST gateway (main server)
│   ├── start_gateway.py          ← Helper to start gateway with env check
│   ├── windows_mcp_server.py     ← The MCP server (21 Windows tools)
│   └── windows_mcp_server.mjs    ← Node.js version of MCP server
│
├── 📄 WhatsApp Integration
│   ├── whatsapp_bridge_mcp.py        ← MCP wrapper for WhatsApp bridge
│   ├── whatsapp_http_bridge.py       ← HTTP REST bridge server
│   ├── whatsapp_log_bridge.py        ← Log-based bridge
│   └── whatsapp_log_bridge_server.py ← Bridge server (port 5001)
│
├── 📄 Startup & Utilities
│   ├── start_complete_system.bat     ← One-click: starts ALL services
│   ├── check_system_status.bat       ← Check if all services are running
│   ├── mcp-cli-tool.py               ← CLI interface for MCP tools
│   └── requirements.txt              ← Python dependencies
│
├── 📄 Config & Templates
│   ├── .env.example                  ← ⭐ Copy this to .env and fill in keys
│   ├── openclaw-mcp-config.template.json ← ⭐ Copy & customize for OpenClaw
│   ├── config.json                   ← Server-level config (transport, logging)
│   └── package.json                  ← Node.js config (for .mjs server)
│
├── 📁 config/
│   ├── agent_config.json     ← Agent behavior (retries, parallelism, caching)
│   ├── api_config.json       ← API model & token settings
│   ├── mcp_config.json       ← Which MCP servers to connect
│   └── vision_config.json    ← Vision/screenshot settings
│
├── 📁 tools/                 ← Individual MCP tool implementations
│   ├── __init__.py           ← BaseTool class all tools inherit from
│   ├── snapshot_tool.py      ← Take screenshot
│   ├── click_tool.py         ← Mouse click
│   ├── type_tool.py          ← Keyboard typing
│   ├── scroll_tool.py        ← Mouse scroll
│   ├── move_tool.py          ← Mouse move / drag
│   ├── shortcut_tool.py      ← Keyboard shortcuts (Ctrl+C, Win+R, etc.)
│   ├── shell_tool.py         ← Run PowerShell / CMD commands
│   ├── app_tool.py           ← Launch / resize / switch apps
│   ├── scrape_tool.py        ← Fetch web page content
│   ├── wait_tool.py          ← Pause execution
│   ├── window_tool.py        ← Window management
│   ├── vision_tool.py        ← Google Vision API analysis
│   ├── multiselect_tool.py   ← Multi-click (Ctrl+Click)
│   └── multiedit_tool.py     ← Type in multiple fields at once
│
├── 📁 lib/                   ← Core library / brain of the agent
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
├── 📁 utils/                 ← Helper utilities
│   ├── __init__.py
│   ├── logger.py             ← Logging setup
│   ├── admin.py              ← Windows admin privilege helpers
│   ├── accessibility.py      ← Windows accessibility tree reader
│   └── screenshot.py         ← Screenshot capture utilities
│
├── 📁 conversations/         ← 🔒 Auto-generated, gitignored
│   └── (saved chat sessions)
│
└── 📁 logs/                  ← 🔒 Auto-generated, gitignored
    └── (runtime log files)
```
