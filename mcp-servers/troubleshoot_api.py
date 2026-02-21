#!/usr/bin/env python3
"""
Complete Anthropic API Troubleshooting
"""

import os
import sys
import subprocess

print("=" * 70)
print("ANTHROPIC API KEY - COMPLETE TROUBLESHOOTING")
print("=" * 70)

# 1. Check environment variable
print("\n1. Environment Variable Check:")
api_key = os.environ.get('ANTHROPIC_API_KEY', '')
if api_key:
    print(f"   ✓ FOUND in Python: {api_key[:25]}...{api_key[-4:]}")
    print(f"   Length: {len(api_key)} characters")

    # Validate format
    if api_key.startswith('sk-ant-api03-'):
        print(f"   ✓ Format looks correct (starts with sk-ant-api03-)")
    elif api_key.startswith('sk-ant-'):
        print(f"   ⚠ Format: starts with sk-ant- (might be older format)")
    else:
        print(f"   ✗ Format looks WRONG (should start with sk-ant-)")

    # Check for common issues
    if '"' in api_key or "'" in api_key:
        print(f"   ✗ WARNING: API key contains quotes!")
    if ' ' in api_key:
        print(f"   ✗ WARNING: API key contains spaces!")
    if '\n' in api_key or '\r' in api_key:
        print(f"   ✗ WARNING: API key contains newlines!")
else:
    print(f"   ✗ NOT FOUND in Python environment")

# 2. Check Windows registry (where setx stores it)
print("\n2. Windows Registry Check:")
try:
    result = subprocess.run(
        ['reg', 'query', 'HKCU\\Environment', '/v', 'ANTHROPIC_API_KEY'],
        capture_output=True,
        text=True
    )
    if result.returncode == 0:
        print(f"   ✓ Found in User registry")
        # Extract value from output
        lines = result.stdout.split('\n')
        for line in lines:
            if 'ANTHROPIC_API_KEY' in line and 'REG_SZ' in line:
                parts = line.split('REG_SZ')
                if len(parts) > 1:
                    reg_key = parts[1].strip()
                    print(f"   Registry value: {reg_key[:25]}...{reg_key[-4:]}")
    else:
        print(f"   ✗ Not found in User registry")
except Exception as e:
    print(f"   Error checking registry: {e}")

# 3. Check system-wide
print("\n3. System Environment Check:")
try:
    result = subprocess.run(
        ['reg', 'query', 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment', '/v', 'ANTHROPIC_API_KEY'],
        capture_output=True,
        text=True
    )
    if result.returncode == 0:
        print(f"   ✓ Found in System registry")
    else:
        print(f"   - Not in System environment (this is OK)")
except Exception as e:
    print(f"   - Not in System environment")

# 4. Check .env files
print("\n4. .env Files Check:")
_home = os.path.expanduser("~")
env_locations = [
    os.path.join(_home, "openclaw-repos", "openclaw", ".env"),
    os.path.join(_home, ".openclaw", ".env"),
    os.path.join(_home, "openclaw-repos", ".env"),
]

for env_path in env_locations:
    if os.path.exists(env_path):
        print(f"\n   ✓ {env_path}")
        try:
            with open(env_path, 'r', encoding='utf-8') as f:
                content = f.read()
                if 'ANTHROPIC_API_KEY' in content:
                    for line in content.split('\n'):
                        if line.strip().startswith('ANTHROPIC_API_KEY'):
                            key = line.split('=', 1)[1].strip()
                            # Remove quotes
                            key = key.strip('"').strip("'")
                            print(f"     Value: {key[:25]}...{key[-4:]}")
                            print(f"     Length: {len(key)} chars")

                            # Check if it matches environment
                            if api_key and key == api_key:
                                print(f"     ✓ MATCHES environment variable")
                            elif api_key:
                                print(f"     ✗ DIFFERENT from environment!")
        except Exception as e:
            print(f"     Error: {e}")

# 5. Test the API key with Anthropic
print("\n5. API Key Validation Test:")
if api_key:
    try:
        import anthropic
        print(f"   ✓ anthropic library installed")

        # Try to create a client
        try:
            client = anthropic.Anthropic(api_key=api_key)
            print(f"   ✓ Client created successfully")

            # Try a simple API call
            print(f"   Testing API call...")
            response = client.messages.create(
                model="claude-3-5-haiku-20241022",
                max_tokens=10,
                messages=[{"role": "user", "content": "Hi"}]
            )
            print(f"   ✓✓✓ API KEY IS VALID AND WORKING! ✓✓✓")

        except anthropic.AuthenticationError as e:
            print(f"   ✗ AUTHENTICATION ERROR: {e}")
            print(f"   → The API key is INVALID or EXPIRED")
        except Exception as e:
            print(f"   ✗ API Error: {e}")

    except ImportError:
        print(f"   ✗ anthropic library not installed")
        print(f"     Install: pip install anthropic")
else:
    print(f"   ⊘ Skipped (no API key in environment)")

# Summary
print("\n" + "=" * 70)
print("DIAGNOSIS")
print("=" * 70)

if api_key:
    print(f"\n✓ API key IS in environment")
    print(f"\nThe 401 error might be because:")
    print(f"  1. The API key is invalid/expired")
    print(f"  2. OpenClaw is using a DIFFERENT key")
    print(f"  3. The key has quotes or spaces")
    print(f"\nTry running the validation test above.")
else:
    print(f"\n✗ API key NOT in environment")
    print(f"\nOpenClaw cannot see the API key!")
    print(f"\nSolution:")
    print(f"  1. Copy key from .env file")
    print(f"  2. Run: setx ANTHROPIC_API_KEY \"your-key\"")
    print(f"  3. CLOSE ALL terminals")
    print(f"  4. Open NEW terminal")
    print(f"  5. Verify: echo %ANTHROPIC_API_KEY%")

print(f"\n" + "=" * 70)
