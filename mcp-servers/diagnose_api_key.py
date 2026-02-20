#!/usr/bin/env python3
"""
API Key Diagnostic Tool
Shows where OpenClaw is reading the Anthropic API key from
"""

import os
import sys
from pathlib import Path

print("=" * 70)
print("ANTHROPIC API KEY DIAGNOSTIC")
print("=" * 70)

# Check current working directory
print(f"\n1. Current directory: {os.getcwd()}")

# Check environment variable
print(f"\n2. Environment variable ANTHROPIC_API_KEY:")
api_key = os.environ.get('ANTHROPIC_API_KEY', '')
if api_key:
    print(f"   ✓ FOUND: {api_key[:20]}...{api_key[-4:]}")
    print(f"   Length: {len(api_key)} characters")
    print(f"   Starts with 'sk-ant-': {api_key.startswith('sk-ant-')}")
else:
    print(f"   ✗ NOT FOUND in environment")

# Check .env files in common locations
print(f"\n3. Searching for .env files:")

locations = [
    ".",
    "..",
    "../..",
    os.path.expanduser("~"),
    Path(os.getcwd()).parent.absolute(),  # Parent of current dir
    os.getcwd(),  # Current dir
]

found_env_files = []

for loc in locations:
    try:
        env_path = os.path.join(str(loc), ".env")
        if os.path.exists(env_path):
            abs_path = os.path.abspath(env_path)
            if abs_path not in found_env_files:
                found_env_files.append(abs_path)
                print(f"   ✓ Found: {abs_path}")

                # Read and check for ANTHROPIC_API_KEY
                try:
                    with open(env_path, 'r', encoding='utf-8') as f:
                        for line_num, line in enumerate(f, 1):
                            if 'ANTHROPIC_API_KEY' in line:
                                # Mask the key
                                if '=' in line:
                                    key_part = line.split('=', 1)[1].strip().strip('"').strip("'")
                                    if key_part:
                                        print(f"     Line {line_num}: ANTHROPIC_API_KEY={key_part[:20]}...{key_part[-4:]}")
                                        print(f"     Length: {len(key_part)} chars")
                                    else:
                                        print(f"     Line {line_num}: ANTHROPIC_API_KEY is EMPTY!")
                except Exception as e:
                    print(f"     Error reading file: {e}")
    except Exception as e:
        pass

if not found_env_files:
    print(f"   ✗ No .env files found in searched locations")

# Check if dotenv library is available
print(f"\n4. Python dotenv library:")
try:
    from dotenv import load_dotenv, find_dotenv
    print(f"   ✓ python-dotenv is installed")

    # Try to find .env
    dotenv_path = find_dotenv()
    if dotenv_path:
        print(f"   ✓ Auto-detected .env: {dotenv_path}")
    else:
        print(f"   ✗ No .env auto-detected by dotenv")

except ImportError:
    print(f"   ✗ python-dotenv NOT installed")
    print(f"     (OpenClaw might use this to load .env)")

# Check OpenClaw config locations
print(f"\n5. OpenClaw configuration:")

home = os.path.expanduser("~")
openclaw_configs = [
    os.path.join(home, ".openclaw", ".env"),
    os.path.join(home, ".openclaw", "config"),
]

for cfg in openclaw_configs:
    if os.path.exists(cfg):
        print(f"   ✓ Found: {cfg}")
    else:
        print(f"   - Not found: {cfg}")

# Summary
print(f"\n" + "=" * 70)
print("SUMMARY")
print("=" * 70)

if api_key:
    print(f"✓ API key IS in environment")
    print(f"  Key preview: {api_key[:20]}...{api_key[-4:]}")
else:
    print(f"✗ API key NOT in environment")

if found_env_files:
    print(f"\n✓ Found {len(found_env_files)} .env file(s):")
    for f in found_env_files:
        print(f"  - {f}")
else:
    print(f"\n✗ No .env files found")

print(f"\n" + "=" * 70)
print("RECOMMENDATIONS")
print("=" * 70)

if not api_key:
    print("\n1. Set environment variable:")
    print('   setx ANTHROPIC_API_KEY "your-key-here"')
    print()

if found_env_files:
    print(f"\n2. OpenClaw should read from:")
    for f in found_env_files:
        if 'openclaw' in f.lower():
            print(f"   → {f}")
    print()

print("\n3. After setting the key, restart with a FRESH terminal:")
print("   - Close ALL terminal windows")
print("   - Open NEW terminal")
print("   - Start OpenClaw")

print(f"\n" + "=" * 70)
