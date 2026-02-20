import os
import json
from pathlib import Path

print("=" * 70)
print("VISION API TEST")
print("=" * 70)

# Check config
config_path = "config/vision_config.json"
print(f"\n1. Checking config: {config_path}")

if os.path.exists(config_path):
    with open(config_path) as f:
        config = json.load(f)
    print(f"   ✓ Config found")
    print(f"   - Enabled: {config.get('enabled')}")
    print(f"   - Credentials: {config.get('credentials_path')}")
    print(f"   - Project ID: {config.get('project_id')}")
else:
    print(f"   ✗ Config not found!")
    exit(1)

# Check credentials file
creds_path = config.get('credentials_path')
print(f"\n2. Checking credentials file: {creds_path}")

# Handle relative path
if not os.path.isabs(creds_path):
    creds_path = os.path.join(os.path.dirname(config_path), creds_path)
    creds_path = os.path.normpath(creds_path)
    print(f"   - Resolved to: {creds_path}")

if os.path.exists(creds_path):
    print(f"   ✓ Credentials file found")
    file_size = os.path.getsize(creds_path)
    print(f"   - File size: {file_size} bytes")
    
    # Validate JSON
    try:
        with open(creds_path) as f:
            creds = json.load(f)
        print(f"   ✓ Valid JSON")
        print(f"   - Type: {creds.get('type')}")
        print(f"   - Project ID: {creds.get('project_id')}")
        print(f"   - Client email: {creds.get('client_email', 'N/A')[:50]}...")
    except Exception as e:
        print(f"   ✗ Invalid JSON: {e}")
        exit(1)
else:
    print(f"   ✗ Credentials file NOT FOUND!")
    print(f"\n   Searched in: {creds_path}")
    exit(1)

# Try to import and initialize Google Cloud Vision
print(f"\n3. Testing Google Cloud Vision API")

try:
    from google.cloud import vision
    print(f"   ✓ google-cloud-vision installed")
except ImportError:
    print(f"   ✗ google-cloud-vision NOT installed")
    print(f"\n   Install with: pip install google-cloud-vision==3.7.2")
    exit(1)

# Set credentials
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = creds_path

# Initialize client
try:
    client = vision.ImageAnnotatorClient()
    print(f"   ✓ Vision API client initialized")
except Exception as e:
    print(f"   ✗ Failed to initialize client: {e}")
    exit(1)

# Test with a simple image (take screenshot first)
print(f"\n4. Testing with screenshot")

try:
    import pyautogui
    screenshot = pyautogui.screenshot()
    screenshot.save('test_screenshot.png')
    print(f"   ✓ Screenshot saved: test_screenshot.png")
    
    # Analyze with Vision API
    with open('test_screenshot.png', 'rb') as f:
        content = f.read()
    
    image = vision.Image(content=content)
    response = client.label_detection(image=image)
    
    print(f"\n   ✓ VISION API WORKING!")
    print(f"\n   Labels detected:")
    for label in response.label_annotations[:5]:
        print(f"      - {label.description} ({label.score:.2%})")
    
    # Test text detection
    text_response = client.text_detection(image=image)
    if text_response.text_annotations:
        print(f"\n   Text detected:")
        print(f"      {text_response.text_annotations[0].description[:100]}...")
    
except Exception as e:
    print(f"   ✗ API call failed: {e}")
    import traceback
    traceback.print_exc()

print(f"\n" + "=" * 70)
print("TEST COMPLETE")
print("=" * 70)
