# 🚀 OpenClaw WhatsApp Automation - Windows Setup Guide

## ⚠️ CRITICAL: Node.js Installation Required

**Your system does not have Node.js installed!** This is required to run OpenClaw.

---

## 📋 Step 1: Install Node.js (REQUIRED)

### Download and Install Node.js:

1. **Open your browser** (outside VS Code)
2. **Go to**: https://nodejs.org/
3. **Download**: Node.js LTS version (currently v20.x or v22.x)
   - Click the **"LTS"** (Long Term Support) button
   - This will download the Windows installer (.msi file)
4. **Run the installer**:
   - Double-click the downloaded file
   - Click **"Next"** through all steps
   - **IMPORTANT**: Check the box that says **"Automatically install necessary tools"**
   - Click **"Install"**
   - Wait for installation to complete (3-5 minutes)
5. **Restart VS Code**:
   - Close VS Code completely
   - Open it again
   - Reconnect to your tunnel

### Verify Installation:

After restarting VS Code, run in terminal:

```powershell
node --version
npm --version
```

**Expected output:**

```
v20.11.0 (or similar)
10.2.4 (or similar)
```

---

## 📋 Step 2: Install Dependencies

Once Node.js is installed, run:

```powershell
cd C:\path\to\winclaw
npm install
```

This will take 2-5 minutes to download all required packages.

---

## 📋 Step 3: Create Configuration

### Create config directory:

```powershell
mkdir $env:USERPROFILE\.openclaw\credentials\whatsapp\default -Force
```

### Create configuration file:

```powershell
notepad $env:USERPROFILE\.openclaw\openclaw.json
```

Paste this configuration (replace YOUR_PHONE and YOUR_API_KEY):

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "allowlist",
      "allowFrom": ["+91XXXXXXXXXX"],
      "groupPolicy": "denyall"
    }
  },
  "agents": {
    "list": [
      {
        "id": "personal",
        "name": "My AI Assistant",
        "model": "gpt-4",
        "provider": "openai",
        "apiKey": "sk-YOUR_OPENAI_API_KEY_HERE"
      }
    ]
  }
}
```

**Replace:**

- `+91XXXXXXXXXX` → Your WhatsApp number (e.g., `+919876543210`)
- `sk-YOUR_OPENAI_API_KEY_HERE` → Your OpenAI API key from https://platform.openai.com/api-keys

**Save and close Notepad**

---

## 📋 Step 4: Build the Project

```powershell
npm run build
```

This compiles TypeScript to JavaScript (takes 30-60 seconds).

---

## 📋 Step 5: Start the Gateway

**Open Terminal 1** (in VS Code):

```powershell
npm run gateway
```

**Expected output:**

```
[gateway] Starting OpenClaw Gateway
[gateway] WebSocket server listening on ws://127.0.0.1:18789
[gateway] WhatsApp channel initialized
[gateway] Ready to accept connections
```

**Keep this terminal running!**

---

## 📋 Step 6: Login to WhatsApp

**Open Terminal 2** (click the "+" button in terminal panel):

```powershell
npm run cli channels login
```

### Scan QR Code:

1. **On your phone**:
   - Open WhatsApp
   - Tap **⋮** (three dots) → **Linked Devices**
   - Tap **"Link a Device"**
2. **Scan the QR code** shown in Terminal 2
3. **Confirm** with fingerprint/face ID

**Expected output:**

```
✓ WhatsApp connected successfully
✓ Session saved
```

---

## 📋 Step 7: Verify Connection

In Terminal 2:

```powershell
npm run cli channels status
```

**Expected output:**

```
WhatsApp: ✓ linked, connected
  Account: +919876543210
  Session: active
```

---

## 📋 Step 8: Test the Bot

1. **On your phone**, open WhatsApp
2. **Message yourself**:
   - Go to your profile
   - Tap **"Message yourself"**
3. **Send a test message**: `"Hello, are you there?"`
4. **Watch the magic happen**:
   - Bot reacts with 👀 (instant)
   - Bot replies via GPT-4 (3-5 seconds)

---

## ✅ Success Checklist

- [ ] Node.js installed (v18-22)
- [ ] Dependencies installed (`npm install` completed)
- [ ] Config file created with your phone number
- [ ] OpenAI API key added to config
- [ ] Project built (`npm run build` successful)
- [ ] Gateway running (Terminal 1 active)
- [ ] WhatsApp logged in (QR scanned)
- [ ] Bot responding to messages

---

## 🔧 Troubleshooting

### Issue: "node is not recognized"

**Solution**: Node.js not installed. Go to Step 1.

### Issue: QR code not appearing

**Solution**:

- Check if Gateway is running in Terminal 1
- Try: `npm run cli channels logout` then login again

### Issue: Bot not responding

**Solution**:

- Check your phone number is in `allowFrom` list
- Verify OpenAI API key is valid
- Check Terminal 1 for error messages

### Issue: "Cannot find module"

**Solution**: Run `npm install` again

---

## 🎯 What's Next?

### Advanced Configuration:

**Multi-Account Setup**:

```json
{
  "channels": {
    "whatsapp": {
      "accounts": {
        "personal": {},
        "work": {}
      }
    }
  }
}
```

**Group Chat Support**:

````json
{
  "channels": {
    "whatsapp": {
      "groupPolicy": "allowlist",
      "allowFrom": ["91987654

---

## ✅ Windows Validation Checklist (Clean-Machine)

Use this checklist to verify a fresh WinClaw installation on Windows 10/11.
Each item has an explicit **PASS** / **FAIL** signal.

### Prerequisites

| # | Check | Command | PASS signal | FAIL signal |
|---|-------|---------|-------------|-------------|
| 1 | Python 3.10+ installed | `python --version` | `Python 3.1x.x` | "not recognized" → install from python.org |
| 2 | pip available | `pip --version` | version printed | install pip or use `py -m pip` |
| 3 | Node.js 20+ installed | `node --version` | `v20.x.x` or higher | "not recognized" → install from nodejs.org |
| 4 | `WinClaw_API_KEYS` env var set | `echo %WinClaw_API_KEYS%` | non-empty value | empty → set it before starting gateway |

### Python virtualenv setup

```powershell
# Create and activate venv
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r mcp-servers\requirements.txt
````

**PASS**: `pip install` completes without errors.  
**FAIL**: missing package errors → upgrade pip (`pip install --upgrade pip`) and retry.

### MCP stdio handshake

```powershell
# Run the minimal MCP server in a separate terminal
python mcp-servers\test_mcp_minimal.py
```

**PASS**: process stays running and prints `MCP server started`.  
**FAIL**: `ModuleNotFoundError: mcp` → `pip install mcp` in the venv.

### Claude Desktop connection

1. Open `mcp-servers\winclaw-mcp-config.template.json`, copy to `winclaw-mcp-config.json`, and fill in:
   - `pythonPath` — output of `where python` (inside venv)
   - `apiKey` — value of `WinClaw_API_KEYS`
2. Set `WinClaw_API_KEYS` in your environment and start the gateway:
   ```powershell
   $env:WinClaw_API_KEYS="<your-key>"
   python mcp-servers\winclaw_gateway.py
   ```
3. Copy `winclaw-mcp-config.json` to Claude Desktop's MCP config directory.
4. Restart Claude Desktop.

**PASS**: Claude Desktop shows WinClaw tools in the tool list.  
**FAIL**: check `logs\gateway_ultimate.log` for startup errors.

### Screenshot tool (Snapshot)

In Claude Desktop: ask _"Take a screenshot"_.

**PASS**: screenshot image appears in the chat.  
**FAIL**: `PIL` import error → `pip install Pillow`; `pyautogui` error → `pip install pyautogui`.

### Shell tool

In Claude Desktop: ask _"Run `echo hello` in PowerShell"_.

**PASS**: response contains `STDOUT: hello`.  
**FAIL**: `subprocess` error or timeout → check PowerShell execution policy (`Set-ExecutionPolicy RemoteSigned`).

### Admin elevation path

1. Right-click Command Prompt / PowerShell → **Run as administrator**.
2. Run `python run_godmode.py` — UAC prompt must appear first.
3. After accepting, the script reports `GODMODE ACTIVE`.

**PASS**: UAC dialog is shown before elevation; `GODMODE ACTIVE` printed after.  
**FAIL**: elevation happens silently without UAC → OS policy or script issue; investigate immediately.

### Smoke tests (no Windows required)

```powershell
pip install pytest
pytest mcp-servers\test_smoke.py -v
```

**PASS**: all 16 tests pass.  
**FAIL**: see error output; most failures indicate missing env vars or modified source files.
