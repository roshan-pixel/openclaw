#!/usr/bin/env python3
"""
WhatsApp HTTP Memory Bridge - SIMPLE VERSION
Polls OpenClaw CLI for recent messages every 5 seconds
"""

import requests
import time
import json
from datetime import datetime
import os

GATEWAY_URL = os.environ.get("WINCLAW_GATEWAY_URL", "http://localhost:8000")
GATEWAY_API_KEY = os.environ.get("WINCLAW_API_KEY", "")

# Poll OpenClaw CLI recent messages
def get_recent_messages():
    try:
        # Try to get recent conversations from OpenClaw
        # Adjust this URL based on your OpenClaw CLI API
        response = requests.get("http://127.0.0.1:18789/api/conversations?limit=5", timeout=3)
        if response.status_code == 200:
            return response.json()
    except:
        pass
    return []

def main():
    print("📱 WhatsApp HTTP Memory Bridge - SIMPLE")
    print("Polling OpenClaw CLI every 5 seconds...")
    print()
    
    last_messages = set()
    
    while True:
        try:
            messages = get_recent_messages()
            
            for msg in messages:
                msg_id = f"{msg.get('from')}_{msg.get('timestamp', '')}"
                
                if msg_id not in last_messages:
                    user_id = msg.get('from', 'unknown')
                    text = msg.get('text', '')
                    
                    print(f"📱 New WhatsApp: {user_id}: {text[:50]}...")
                    
                    # Store in Gateway v4.0
                    requests.post(
                        f"{GATEWAY_URL}/memory/add",
                        params={
                            "content": f"WhatsApp: {text}",
                            "node_type": "whatsapp"
                        },
                        headers={"X-API-Key": GATEWAY_API_KEY}
                    )
                    
                    last_messages.add(msg_id)
            
            time.sleep(5)  # Poll every 5 seconds
            
        except KeyboardInterrupt:
            print("\\n👋 Bridge stopped")
            break
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
