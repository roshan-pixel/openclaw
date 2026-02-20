#!/usr/bin/env python3
"""
MCP Server Starter - Launches all MCP servers and logs their status
This enables OpenClaw to discover and use 22+ MCP tools
"""

import subprocess
import sys
import os
import time
import json
from pathlib import Path

# Configuration
MCP_SERVERS = [
    {
        "name": "Windows MCP",
        "script": "windows_mcp_server.py",
        "description": "21 Windows system tools (snapshot, shell, click, etc.)"
    },
    {
        "name": "WhatsApp Bridge MCP",
        "script": "whatsapp_bridge_mcp.py",
        "description": "WhatsApp logging and bridge tools"
    }
]

SCRIPT_DIR = Path(__file__).parent
LOG_FILE = SCRIPT_DIR / "mcp_servers_startup.log"
PIDS_FILE = SCRIPT_DIR / "mcp_servers.pids"

def log(msg: str):
    """Log to file and stdout"""
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def start_mcp_server(server_config: dict) -> subprocess.Popen:
    """Start a single MCP server"""
    script = SCRIPT_DIR / server_config["script"]
    
    if not script.exists():
        log(f"⚠️  {server_config['name']}: Script not found at {script}")
        return None
    
    try:
        # Start the server
        proc = subprocess.Popen(
            [sys.executable, str(script)],
            cwd=str(SCRIPT_DIR),
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1
        )
        
        # Give it a moment to start
        time.sleep(0.5)
        
        if proc.poll() is None:  # Still running
            log(f"✅ {server_config['name']} started (PID {proc.pid})")
            log(f"   {server_config['description']}")
            return proc
        else:
            stderr = proc.stderr.read() if proc.stderr else "Unknown error"
            log(f"❌ {server_config['name']} failed to start: {stderr}")
            return None
    except Exception as e:
        log(f"❌ {server_config['name']} error: {e}")
        return None

def main():
    """Start all MCP servers"""
    print("\n" + "="*60)
    print("OpenClaw MCP Server Launcher")
    print("="*60 + "\n")
    
    # Clear old log
    LOG_FILE.write_text("")
    
    log(f"Starting {len(MCP_SERVERS)} MCP servers from {SCRIPT_DIR}")
    log("")
    
    # Start all servers
    running_servers = {}
    for server_config in MCP_SERVERS:
        proc = start_mcp_server(server_config)
        if proc:
            running_servers[server_config["name"]] = proc
    
    # Save PIDs for cleanup
    pids = {name: proc.pid for name, proc in running_servers.items()}
    PIDS_FILE.write_text(json.dumps(pids, indent=2))
    
    if not running_servers:
        log("\n❌ No MCP servers started successfully!")
        return 1
    
    log(f"\n✅ {len(running_servers)} MCP servers running")
    log(f"   PIDs saved to: {PIDS_FILE}")
    log(f"   Logs available at: {LOG_FILE}")
    log("\nMCP servers are ready for OpenClaw to use.")
    log("The following tools should now be available:")
    log("  • 21 Windows system tools (windows_mcp_server)")
    log("  • 3 WhatsApp bridge tools (whatsapp_bridge_mcp)")
    
    # Keep servers running
    try:
        log("\nMonitoring servers... (Press Ctrl+C to stop)")
        while True:
            time.sleep(1)
            # Check if any servers died
            for name, proc in list(running_servers.items()):
                if proc.poll() is not None:
                    log(f"⚠️  {name} died (exit code {proc.returncode})")
                    del running_servers[name]
    except KeyboardInterrupt:
        log("\n\nShutting down MCP servers...")
        for name, proc in running_servers.items():
            proc.terminate()
            log(f"Stopped: {name}")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
