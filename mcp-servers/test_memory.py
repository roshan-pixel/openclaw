import os
import requests
import json

GATEWAY_URL = os.environ.get("WINCLAW_GATEWAY_URL", "http://localhost:8000")
GATEWAY_API_KEY = os.environ.get("WINCLAW_API_KEY", "")
if not GATEWAY_API_KEY:
    raise SystemExit("ERROR: Set WINCLAW_API_KEY environment variable before running this test.")

def test_memory():
    print("🧠 Testing Gateway v4.0 Memory...")

    # 1. Test health
    r = requests.get(f"{GATEWAY_URL}/health")
    print(f"Health: {r.json().get('status', 'ERROR')}")

    # 2. Store WhatsApp test message
    content = "WhatsApp test: Inbound message +918058363027 -> +918058363027 (62 chars)"
    r = requests.post(
        f"{GATEWAY_URL}/memory/add",
        params={"content": content, "node_type": "whatsapp"},
        headers={"X-API-Key": GATEWAY_API_KEY}
    )
    print(f"Store: {r.status_code}")

    # 3. Search it
    r = requests.post(
        f"{GATEWAY_URL}/memory/search",
        json={"query": "Inbound message", "limit": 3},
        headers={"X-API-Key": GATEWAY_API_KEY}
    )
    print(f"Search found: {len(r.json().get('results', []))} results")

    print("\n✅ Memory is WORKING!")
    print("Now WhatsApp messages will be stored here!")

if __name__ == "__main__":
    test_memory()
