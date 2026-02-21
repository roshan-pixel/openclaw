#!/usr/bin/env python3
"""
WhatsApp Memory Bridge - LOG PARSING VERSION
Reads OpenClaw CLI log file for WhatsApp messages
"""

import requests
import time
import json
import os
from datetime import datetime
import hashlib

# Gateway v4.0
GATEWAY_URL = "http://localhost:8000"
GATEWAY_API_KEY = os.environ.get("WINCLAW_API_KEY", "")

# OpenClaw CLI log file (TODAY'S LOG)
OPENCLAW_LOG = r"C:\tmp\openclaw\openclaw-2026-02-14.log"

# WhatsApp pattern
WHATSAPP_PATTERN = "[whatsapp] Inbound message"

processed_lines = set()

def get_whatsapp_messages_from_log():
    """Parse OpenClaw CLI log for WhatsApp messages"""
    messages = []

    if not os.path.exists(OPENCLAW_LOG):
        print(f"❌ Log file not found: {OPENCLAW_LOG}")
        return messages

    try:
        with open(OPENCLAW_LOG, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        print(f"📄 Scanning log: {len(lines)} lines")

        for line in lines[-100:]:  # Last 100 lines (most recent)
            if WHATSAPP_PATTERN in line:
                # Extract message info
                parts = line.strip().split()
                if len(parts) >= 6:
                    timestamp = parts[0]
                    from_user = parts[3] 
                    to_user = parts[5]
                    msg_length = parts[7]

                    # Generate unique ID
                    line_hash = hashlib.md5(line.encode()).hexdigest()

                    if line_hash not in processed_lines:
                        messages.append({
                            "timestamp": timestamp,
                            "from": from_user,
                            "to": to_user,
                            "length": msg_length,
                            "raw": line.strip()
                        })
                        print(f"  📱 Found: {from_user} -> {to_user} ({msg_length} chars)")

        return messages

    except Exception as e:
        print(f"❌ Log parsing error: {e}")
        return []

def store_message(user_id, content):
    """Store in Gateway v4.0 memory"""
    try:
        response = requests.post(
            f"{GATEWAY_URL}/memory/add",
            params={
                "content": content,
                "node_type": "whatsapp_message",
                "importance": 0.9
            },
            headers={"X-API-Key": GATEWAY_API_KEY},
            timeout=5
        )

        if response.status_code == 200:
            print(f"  ✓ Memory stored: {user_id}")
            return True
        else:
            print(f"  ❌ API error: {response.status_code}")
            return False

    except Exception as e:
        print(f"  ❌ Request error: {e}")
        return False

if __name__ == "__main__":
    print("📱 WhatsApp Log Memory Bridge")
    print(f"Log: {OPENCLAW_LOG}")
    print("Gateway: http://localhost:8000")
    print("-" * 50)

    while True:
        try:
            messages = get_whatsapp_messages_from_log()

            for msg in messages:
                user_id = msg["from"]
                content = f"WhatsApp [{msg['timestamp']}] {msg['from']} -> {msg['to']}: {msg['raw']}"

                if store_message(user_id, content):
                    processed_lines.add(hashlib.md5(msg["raw"].encode()).hexdigest())

            if not messages:
                print("⏳ No new WhatsApp messages...")

            print(f"⏳ Waiting 10 seconds... (Press Ctrl+C to stop)")
            time.sleep(10)

        except KeyboardInterrupt:
            print("\n👋 Bridge stopped")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
            time.sleep(10)
