import uvicorn
from fastapi import FastAPI, HTTPException
from typing import Dict, Any
import requests
import time

ULTIMATE_WEBHOOK_URL = "http://localhost:18788/webhook"

app = FastAPI(title="OpenClaw → ULTIMATE Adapter (GOD MODE)", version="1.3.0")

@app.post("/responses")
def openclaw_responses(payload: Dict[str, Any]):
    """
    Accepts OpenClaw's complex nested payload and forwards to ULTIMATE /webhook.
    """
    print(f"📥 Received payload keys: {list(payload.keys())}")

    # OpenClaw sends: {"model": "...", "input": [...rich nested messages...], ...}
    input_messages = payload.get("input", [])
    
    if not input_messages:
        raise HTTPException(status_code=400, detail="No input messages in payload")

    # Find the last user message with actual text
    user_text = None
    for item in reversed(input_messages):
        # Item structure: {"role": "user", "content": [{"type": "input_text", "text": "..."}]}
        if item.get("role") == "user":
            content = item.get("content")
            if isinstance(content, list):
                for part in content:
                    if isinstance(part, dict) and part.get("type") in ["input_text", "inputtext"]:
                        text = part.get("text", "")
                        # Skip system prompts and agent context (they start with "WhatsApp" or are very long)
                        if text and not text.startswith("WhatsApp") and len(text) < 500:
                            user_text = text
                            break
            elif isinstance(content, str):
                user_text = content
                break
        if user_text:
            break

    if not user_text:
        raise HTTPException(status_code=400, detail="No valid user text found in input")

    print(f"📤 Forwarding to ULTIMATE: '{user_text}'")

    # Call ULTIMATE webhook
    body = {
        "from": "openclaw",
        "message": {"text": user_text}
    }

    try:
        resp = requests.post(ULTIMATE_WEBHOOK_URL, json=body, timeout=600)
    except Exception as e:
        print(f"❌ Connection error: {e}")
        raise HTTPException(status_code=502, detail=f"ULTIMATE connection failed: {e}")

    if resp.status_code != 200:
        print(f"❌ ULTIMATE error {resp.status_code}: {resp.text}")
        raise HTTPException(status_code=resp.status_code, detail=resp.text or "ULTIMATE error")

    try:
        data = resp.json()
    except:
        print(f"❌ Invalid JSON from ULTIMATE: {resp.text[:200]}")
        raise HTTPException(status_code=502, detail="ULTIMATE returned invalid JSON")

    text = data.get("response") or data.get("text") or str(data)
    print(f"✅ ULTIMATE response: '{text[:100]}...'")

    # Return OpenClaw format
    return {
        "text": text,
        "attachments": [],
        "actions": []
    }

if __name__ == "__main__":
    uvicorn.run("adapter:app", host="0.0.0.0", port=4100, reload=False)
