# ⚡ OpenClaw WhatsApp - QUICK START

## 🚨 FIRST TIME SETUP (Do Once)

### 1. Install Node.js

```
Download from: https://nodejs.org/
Install LTS version (v20 or v22)
Restart VS Code after install
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Configure

```powershell
# Create config directory
mkdir $env:USERPROFILE\.openclaw\credentials\whatsapp\default -Force

# Create config file
notepad $env:USERPROFILE\.openclaw\openclaw.json
```

**Paste this (edit phone & API key):**

```json
{
  "channels": { "whatsapp": { "dmPolicy": "allowlist", "allowFrom": ["+91XXXXXXXXXX"] } },
  "agents": {
    "list": [
      {
        "id": "personal",
        "name": "Assistant",
        "model": "gpt-4",
        "provider": "openai",
        "apiKey": "sk-YOUR_KEY"
      }
    ]
  }
}
```

### 4. Build

```powershell
npm run build
```

---

## 🚀 DAILY USE (Every Time)

### Terminal 1 - Start Gateway (keep running)

```powershell
npm run gateway
```

### Terminal 2 - Login WhatsApp (first time only)

```powershell
npm run cli channels login
# Scan QR with WhatsApp app
```

### Test

Message yourself on WhatsApp - bot will reply!

---

## 📝 USEFUL COMMANDS

```powershell
# Check status
npm run cli channels status

# Logout
npm run cli channels logout

# Rebuild after code changes
npm run build

# View logs
npm run gateway  # Shows live logs
```

---

## 🐞 TROUBLESHOOTING

**Bot not responding?**

- Check Terminal 1 is running
- Verify your phone in allowFrom list
- Check OpenAI API key is valid

**QR not showing?**

- Logout first: `npm run cli channels logout`
- Then login again

**Node not found?**

- Install Node.js from https://nodejs.org/
- Restart VS Code

---

## 📍 CONFIG FILE LOCATION

**Windows:**

```
%USERPROFILE%\.openclaw\openclaw.json
```

**Credentials:**

```
%USERPROFILE%\.openclaw\credentials\whatsapp\default\creds.json
```

---

## 📞 YOUR SETUP

**Phone Format:** +<country_code><10_digits> (e.g. `+12125551234`)

**Example phone:** `+12125551234`  
**OpenAI Key:** Get from https://platform.openai.com/api-keys

---

## ✅ SUCCESS LOOKS LIKE

**Terminal 1:**

```
[gateway] WhatsApp channel initialized
[gateway] Ready to accept connections
```

**Terminal 2:**

```
WhatsApp: ✓ linked, connected
  Account: +919876543210
```

**Phone:**

- You: "Hello"
- Bot: 👀 (instant)
- Bot: "Hi! How can I help?" (3-5 sec)

---

## 🔗 HELPFUL LINKS

- Full Guide: `WINDOWS_SETUP_GUIDE.md`
- Deep Analysis: (from earlier documentation)
- Node.js: https://nodejs.org/
- OpenAI Keys: https://platform.openai.com/api-keys
- OpenClaw Docs: https://docs.openclaw.ai/

---

**Date:** January 31, 2026  
**Next Step:** Install Node.js if not done yet!
