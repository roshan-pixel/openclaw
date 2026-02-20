import os
import json

print("=" * 70)
print("VISION API TEST - FIXED")
print("=" * 70)

# Use absolute path
creds_path = os.path.join(os.path.expanduser("~"), "openclaw-repos", "openclaw", "keys", "vision-key.json")

print(f"\n1. Checking credentials: {creds_path}")
if os.path.exists(creds_path):
    print(f"   ✓ File exists ({os.path.getsize(creds_path)} bytes)")
    
    # Validate JSON
    with open(creds_path) as f:
        creds = json.load(f)
    print(f"   ✓ Valid JSON")
    print(f"   - Type: {creds.get('type')}")
    print(f"   - Project: {creds.get('project_id')}")
    print(f"   - Email: {creds.get('client_email', 'N/A')[:60]}...")
else:
    print(f"   ✗ File not found!")
    exit(1)

# Test Vision API
print(f"\n2. Testing Google Cloud Vision API")

try:
    from google.cloud import vision
    print(f"   ✓ Library installed")
except ImportError:
    print(f"   ✗ Library not installed")
    print(f"   Run: pip install google-cloud-vision")
    exit(1)

# Set credentials
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = creds_path

# Initialize client
try:
    client = vision.ImageAnnotatorClient()
    print(f"   ✓ Client initialized")
except Exception as e:
    print(f"   ✗ Client failed: {e}")
    exit(1)

# Take screenshot and test
print(f"\n3. Testing with screenshot")

try:
    import pyautogui
    screenshot = pyautogui.screenshot()
    screenshot.save('test_vision_screenshot.png')
    print(f"   ✓ Screenshot saved")
    
    # Analyze
    with open('test_vision_screenshot.png', 'rb') as f:
        content = f.read()
    
    image = vision.Image(content=content)
    
    # Label detection
    print(f"\n   Testing label detection...")
    response = client.label_detection(image=image, max_results=5)
    labels = response.label_annotations
    
    if labels:
        print(f"   ✓ VISION API WORKING!")
        print(f"\n   Top 5 labels:")
        for label in labels:
            print(f"      - {label.description}: {label.score:.1%}")
    
    # Text detection
    print(f"\n   Testing text detection...")
    text_response = client.text_detection(image=image)
    texts = text_response.text_annotations
    
    if texts:
        print(f"   ✓ Text detected:")
        text_preview = texts[0].description[:200].replace('\n', ' ')
        print(f"      {text_preview}...")
    else:
        print(f"   - No text found in screenshot")
    
    print(f"\n" + "=" * 70)
    print("✓✓✓ VISION API IS WORKING! ✓✓✓")
    print("=" * 70)
    
except Exception as e:
    print(f"   ✗ API test failed: {e}")
    import traceback
    traceback.print_exc()
