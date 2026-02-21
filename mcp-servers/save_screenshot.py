import os
import requests
import json
import base64
from datetime import datetime

print("Calling screenshot API...")
response = requests.post(
    "http://localhost:8000/screenshot",
    headers={"X-API-Key": os.environ.get("WINCLAW_API_KEY", "")}
)

data = response.json()
print(f"Success: {data['success']}")
print(f"Result items: {len(data['result'])}")

# Save full response for debugging
with open('screenshot_response.json', 'w') as f:
    json.dump(data, f, indent=2)
print("Full response saved to: screenshot_response.json")

# Look for image in result
for i, item in enumerate(data['result']):
    print(f"\nItem {i}: type={item.get('type')}")
    
    if item.get('type') == 'image':
        # Extract base64 image
        if 'data' in item:
            image_data = item['data']
            image_bytes = base64.b64decode(image_data)
            
            filename = f"screenshot_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            with open(filename, 'wb') as f:
                f.write(image_bytes)
            print(f"✓ Screenshot saved: {filename}")
        else:
            print("Image item has no 'data' field")
            print(json.dumps(item, indent=2))
