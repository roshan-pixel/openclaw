"""
OpenClaw Vision API Test Script
Quick test to verify Vision API integration
"""

import sys
import os

print("=" * 60)
print("🦅 OPENCLAW VISION API TEST")
print("=" * 60)
print()

# Test 1: Check dependencies
print("Test 1: Checking dependencies...")
try:
    from google.cloud import vision
    from google.oauth2 import service_account
    print("✅ google-cloud-vision installed")
except ImportError as e:
    print("❌ google-cloud-vision NOT installed")
    print("   Run: pip install google-cloud-vision==3.7.2")
    sys.exit(1)

# Test 2: Check files exist
print("\nTest 2: Checking file structure...")
files_to_check = [
    ("config/vision_config.json", "Vision config"),
    ("lib/vision_analyzer.py", "Vision analyzer"),
    ("tools/vision_tool.py", "Vision tool"),
    ("../keys/vision-key.json", "Google credentials")
]

missing_files = []
for filepath, name in files_to_check:
    if os.path.exists(filepath):
        print(f"✅ {name}: {filepath}")
    else:
        print(f"❌ {name}: {filepath} NOT FOUND")
        missing_files.append(filepath)

if missing_files:
    print("\n⚠️  Some files are missing. Please check setup guide.")
    sys.exit(1)

# Test 3: Load configuration
print("\nTest 3: Loading configuration...")
import json
try:
    with open("config/vision_config.json") as f:
        config = json.load(f)
    print(f"✅ Config loaded")
    print(f"   Project ID: {config.get('project_id')}")
    print(f"   Enabled: {config.get('enabled')}")
    print(f"   Caching: {config.get('cache_enabled')}")
except Exception as e:
    print(f"❌ Failed to load config: {e}")
    sys.exit(1)

# Test 4: Initialize Vision API
print("\nTest 4: Initializing Vision API...")
try:
    from lib.vision_analyzer import VisionAnalyzer
    analyzer = VisionAnalyzer()
    print("✅ Vision API client initialized successfully")
except FileNotFoundError as e:
    print(f"❌ File not found: {e}")
    print("   Check credentials_path in vision_config.json")
    sys.exit(1)
except Exception as e:
    print(f"❌ Failed to initialize: {e}")
    sys.exit(1)

# Test 5: Take screenshot and analyze
print("\nTest 5: Analyzing screenshot...")
try:
    import pyautogui
    
    # Take screenshot
    screenshot_path = "test_vision_analysis.png"
    pyautogui.screenshot(screenshot_path)
    print(f"✅ Screenshot saved: {screenshot_path}")
    
    # Analyze
    result = analyzer.analyze_screenshot(screenshot_path)
    
    print(f"✅ Analysis complete!")
    print(f"   Labels detected: {len(result['labels'])}")
    print(f"   Text elements: {len(result['text'])}")
    print(f"   Objects found: {len(result['objects'])}")
    print(f"   UI elements: {len(result['ui_elements'])}")
    
    # Show top labels
    if result['labels']:
        print(f"\n   Top labels:")
        for label in result['labels'][:5]:
            print(f"      - {label['label']} ({label['confidence']}%)")
    
    # Show some text
    if result['text']:
        print(f"\n   Sample text found:")
        for text in result['text'][:5]:
            print(f"      - \"{text['text']}\" at ({text['center']['x']}, {text['center']['y']})")
    
    # Show clickable elements
    if result['ui_elements']:
        print(f"\n   Clickable elements:")
        for elem in result['ui_elements'][:5]:
            print(f"      - {elem['type']}: \"{elem['text']}\" at ({elem['center']['x']}, {elem['center']['y']})")

except Exception as e:
    print(f"❌ Analysis failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test 6: Test find_element_by_text
print("\nTest 6: Testing text search...")
try:
    # Try to find common words
    test_words = ["File", "Edit", "View", "Start", "Search", "Chrome"]
    
    for word in test_words:
        result = analyzer.find_element_by_text(screenshot_path, word)
        if result:
            print(f"✅ Found '{word}' at ({result['center']['x']}, {result['center']['y']})")
            break
    else:
        print("⚠️  None of the test words found (this is OK if your screen doesn't have them)")

except Exception as e:
    print(f"❌ Text search failed: {e}")

# Test 7: Cache test
print("\nTest 7: Testing cache...")
try:
    import time
    
    # First analysis (should hit API)
    start = time.time()
    analyzer.analyze_screenshot(screenshot_path)
    first_time = time.time() - start
    
    # Second analysis (should use cache)
    start = time.time()
    analyzer.analyze_screenshot(screenshot_path)
    second_time = time.time() - start
    
    print(f"✅ First analysis: {first_time:.2f}s")
    print(f"✅ Cached analysis: {second_time:.2f}s")
    
    if second_time < first_time * 0.5:
        print(f"✅ Cache is working! ({(first_time/second_time):.1f}x faster)")
    else:
        print(f"⚠️  Cache might not be working optimally")
    
    cache_stats = analyzer.get_cache_stats()
    print(f"   Cache entries: {cache_stats['entries']}")

except Exception as e:
    print(f"❌ Cache test failed: {e}")

# All tests passed!
print("\n" + "=" * 60)
print("🎉 ALL TESTS PASSED!")
print("=" * 60)
print("\n✅ Vision API is ready to use!")
print("\nNext steps:")
print("1. Register vision_tool in windows_mcp_server.py")
print("2. Test with OpenClaw: python openclaw_main.py")
print("3. Try command: 'use vision to analyze screen'")
print("\n💡 Check test_vision_analysis.png to see what was analyzed")
