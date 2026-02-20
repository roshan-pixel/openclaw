#!/usr/bin/env python3
"""
Anthropic API Key Manager - Enhanced
Interactive tool with API testing and gateway verification
"""

import os
import sys
import base64
import json
import getpass
import time
import subprocess
from pathlib import Path

print("=" * 70)
print("ANTHROPIC API KEY MANAGER - ENHANCED")
print("=" * 70)

# Locations where API key should be stored
_home = os.path.expanduser("~")
locations = {
    'openclaw': os.path.join(_home, '.openclaw', '.env'),
    'project': os.path.join(_home, 'openclaw-repos', 'openclaw', '.env'),
    'registry': 'HKCU\\Environment',
}

def simple_encrypt(text, key="openclaw2026"):
    """Simple encryption (XOR with key)"""
    result = []
    for i, char in enumerate(text):
        key_char = key[i % len(key)]
        encrypted_char = chr(ord(char) ^ ord(key_char))
        result.append(encrypted_char)
    return base64.b64encode(''.join(result).encode()).decode()

def simple_decrypt(encrypted_text, key="openclaw2026"):
    """Simple decryption"""
    try:
        decoded = base64.b64decode(encrypted_text.encode()).decode()
        result = []
        for i, char in enumerate(decoded):
            key_char = key[i % len(key)]
            decrypted_char = chr(ord(char) ^ ord(key_char))
            result.append(decrypted_char)
        return ''.join(result)
    except:
        return None

def validate_api_key(key):
    """Validate API key format"""
    if not key:
        return False, "API key is empty"

    key = key.strip().strip('"').strip("'")

    if not key.startswith('sk-ant-'):
        return False, "Must start with 'sk-ant-'"

    if len(key) < 50:
        return False, "Too short (should be ~108 characters)"

    if ' ' in key or '\n' in key:
        return False, "Contains invalid characters (spaces/newlines)"

    return True, "Valid format"

def test_claude_api(api_key):
    """Test if the API key works with Claude"""
    print("\n" + "=" * 70)
    print("TESTING CLAUDE API")
    print("=" * 70)

    try:
        import anthropic
        print("✓ anthropic library installed")
    except ImportError:
        print("✗ anthropic library not installed")
        print("  Install: pip install anthropic")
        return False

    try:
        print("\nCreating Anthropic client...")
        client = anthropic.Anthropic(api_key=api_key)
        print("✓ Client created")

        print("\nSending test message to Claude...")
        response = client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=50,
            messages=[{"role": "user", "content": "Say 'API working' if you receive this"}]
        )

        result_text = response.content[0].text
        print(f"✓ Response received: {result_text[:100]}")

        print("\n" + "🎉" * 35)
        print("✓✓✓ CLAUDE API IS WORKING PERFECTLY! ✓✓✓")
        print("🎉" * 35)
        return True

    except anthropic.AuthenticationError as e:
        print(f"\n✗ AUTHENTICATION FAILED!")
        print(f"  Error: {e}")
        print(f"  → The API key is INVALID or EXPIRED")
        return False

    except Exception as e:
        print(f"\n✗ API Test Failed: {e}")
        return False

def check_openclaw_gateway():
    """Check if OpenClaw gateway is accessible"""
    print("\n" + "=" * 70)
    print("CHECKING OPENCLAW GATEWAY")
    print("=" * 70)

    # Check if openclaw is installed
    try:
        result = subprocess.run(
            ['openclaw', '--version'],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            print(f"✓ OpenClaw installed: {result.stdout.strip()}")
        else:
            print("✓ OpenClaw command found")
    except subprocess.TimeoutExpired:
        print("⚠ OpenClaw command timeout")
    except FileNotFoundError:
        print("✗ OpenClaw command not found")
        print("  Is OpenClaw installed?")
        return False
    except Exception as e:
        print(f"⚠ Cannot verify OpenClaw: {e}")

    # Check if gateway is running
    print("\nChecking if gateway is running...")
    try:
        import socket

        # Check port 18789 (OpenClaw default)
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex(('127.0.0.1', 18789))
        sock.close()

        if result == 0:
            print("✓ Gateway is running on port 18789")
            return True
        else:
            print("⚠ Gateway not running on port 18789")
            print("  Start with: openclaw gateway")
            return False

    except Exception as e:
        print(f"⚠ Cannot check gateway: {e}")
        return False

def read_existing_keys():
    """Read existing API keys from all locations"""
    print("\n" + "=" * 70)
    print("SCANNING EXISTING KEYS")
    print("=" * 70)

    keys_found = {}

    for name, path in locations.items():
        if name == 'registry':
            continue

        if os.path.exists(path):
            print(f"\n✓ Found: {path}")
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    for line in f:
                        if line.strip().startswith('ANTHROPIC_API_KEY='):
                            key = line.split('=', 1)[1].strip().strip('"').strip("'")
                            keys_found[name] = key
                            print(f"  Current: {key[:25]}...{key[-4:]}")
                            break
            except Exception as e:
                print(f"  Error reading: {e}")
        else:
            print(f"\n✗ Not found: {path}")

    return keys_found

def update_env_file(path, api_key):
    """Update or create .env file with API key"""
    os.makedirs(os.path.dirname(path), exist_ok=True)

    content = []
    key_exists = False

    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.readlines()

        for i, line in enumerate(content):
            if line.strip().startswith('ANTHROPIC_API_KEY='):
                content[i] = f'ANTHROPIC_API_KEY={api_key}\n'
                key_exists = True
                break

    if not key_exists:
        content.append(f'ANTHROPIC_API_KEY={api_key}\n')

    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(content)

def store_encrypted_backup(api_key):
    """Store encrypted backup"""
    backup_path = os.path.join(os.path.expanduser('~'), '.openclaw', 'api_key.encrypted')
    os.makedirs(os.path.dirname(backup_path), exist_ok=True)

    encrypted = simple_encrypt(api_key)

    backup_data = {
        'encrypted_key': encrypted,
        'timestamp': str(time.time()),
        'note': 'Encrypted with XOR cipher - not for security, just obfuscation'
    }

    with open(backup_path, 'w') as f:
        json.dump(backup_data, f, indent=2)

    return backup_path

def set_registry_key(api_key):
    """Set Windows registry environment variable"""
    try:
        result = subprocess.run(
            ['setx', 'ANTHROPIC_API_KEY', api_key],
            capture_output=True,
            text=True
        )
        return result.returncode == 0
    except Exception as e:
        print(f"Error setting registry: {e}")
        return False

def main():
    existing_keys = read_existing_keys()

    print("\n" + "=" * 70)
    print("UPDATE API KEY")
    print("=" * 70)

    print("\nOptions:")
    print("  1. Enter new API key")
    print("  2. Use existing key from project .env")
    print("  3. Decrypt from backup")
    print("  4. Exit")

    choice = input("\nChoice (1-4): ").strip()

    api_key = None

    if choice == '1':
        print("\nEnter your Anthropic API key:")
        print("(Paste the full key - it will not be displayed)")
        api_key = getpass.getpass("API Key: ").strip().strip('"').strip("'")

    elif choice == '2':
        if 'project' in existing_keys:
            api_key = existing_keys['project']
            print(f"\nUsing: {api_key[:25]}...{api_key[-4:]}")
        else:
            print("\n✗ No key found in project .env")
            return

    elif choice == '3':
        backup_path = os.path.join(os.path.expanduser('~'), '.openclaw', 'api_key.encrypted')
        if os.path.exists(backup_path):
            with open(backup_path, 'r') as f:
                data = json.load(f)
                api_key = simple_decrypt(data['encrypted_key'])
                if api_key:
                    print(f"\n✓ Decrypted: {api_key[:25]}...{api_key[-4:]}")
                else:
                    print("\n✗ Failed to decrypt")
                    return
        else:
            print("\n✗ No encrypted backup found")
            return
    else:
        print("\nExiting...")
        return

    # Validate
    valid, msg = validate_api_key(api_key)
    if not valid:
        print(f"\n✗ Invalid API key: {msg}")
        return

    print(f"\n✓ API key validated: {msg}")

    # TEST THE API KEY WITH CLAUDE
    api_works = test_claude_api(api_key)

    if not api_works:
        print("\n⚠ API key doesn't work! Do you still want to store it?")
        cont = input("Continue? (y/n): ").strip().lower()
        if cont != 'y':
            print("Cancelled.")
            return

    # Ask where to store
    print("\n" + "=" * 70)
    print("STORAGE OPTIONS")
    print("=" * 70)
    print("\nWhere to store the API key?")
    print("  1. OpenClaw .env (recommended)")
    print("  2. Project .env")
    print("  3. Windows registry (environment variable)")
    print("  4. All of the above")

    store_choice = input("\nChoice (1-4): ").strip()

    # Store in selected locations
    print("\n" + "=" * 70)
    print("STORING API KEY")
    print("=" * 70)

    if store_choice in ['1', '4']:
        try:
            update_env_file(locations['openclaw'], api_key)
            print(f"\n✓ Stored in: {locations['openclaw']}")
        except Exception as e:
            print(f"\n✗ Failed to store in OpenClaw .env: {e}")

    if store_choice in ['2', '4']:
        try:
            update_env_file(locations['project'], api_key)
            print(f"✓ Stored in: {locations['project']}")
        except Exception as e:
            print(f"✗ Failed to store in project .env: {e}")

    if store_choice in ['3', '4']:
        if set_registry_key(api_key):
            print(f"✓ Stored in Windows registry")
            print(f"  NOTE: Close and reopen terminal for this to take effect")
        else:
            print(f"✗ Failed to store in registry")

    # Always create encrypted backup
    try:
        backup_path = store_encrypted_backup(api_key)
        print(f"\n✓ Encrypted backup: {backup_path}")
    except Exception as e:
        print(f"\n⚠ Failed to create backup: {e}")

    # Check OpenClaw Gateway
    check_openclaw_gateway()

    # Summary
    print("\n" + "=" * 70)
    print("FINAL SUMMARY")
    print("=" * 70)

    if api_works:
        print("\n✓ Claude API: WORKING")
    else:
        print("\n✗ Claude API: NOT WORKING")

    print(f"\n✓ API key stored successfully")

    print("\n" + "=" * 70)
    print("NEXT STEPS")
    print("=" * 70)

    if store_choice in ['3', '4']:
        print("\n1. CLOSE ALL terminals")
        print("2. Open NEW terminal")
        print("3. cd <your-openclaw-repo-path>\\mcp-servers")
        print("4. openclaw gateway")
    else:
        print("\n1. Restart OpenClaw gateway:")
        print("   cd <your-openclaw-repo-path>\\mcp-servers")
        print("   openclaw gateway")

    print("\n5. Test via WhatsApp:")
    print("   Send: 'Hi, is vision working?'")

    if api_works:
        print("\n✓ The API key is valid - should work now!")
    else:
        print("\n⚠ The API key didn't work in testing - may need a valid key")

    print("\n" + "=" * 70)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nCancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
