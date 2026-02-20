import shutil
import os

print("=" * 80)
print("GOD MODE PATCH - Fixing LiteLLM Auth")
print("=" * 80)

AUTH_FILE = r"C:\Python314\Lib\site-packages\litellm\proxy\auth\user_api_key_auth.py"

# Check if file exists
if not os.path.exists(AUTH_FILE):
    print("ERROR: File not found!")
    print(f"Looking for: {AUTH_FILE}")
    input("Press Enter to exit...")
    exit(1)

print(f"Found file: {AUTH_FILE}")

# Create backup
backup = AUTH_FILE + ".original"
if not os.path.exists(backup):
    shutil.copy2(AUTH_FILE, backup)
    print(f"Created backup: {backup}")

# Read file
with open(AUTH_FILE, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line with the error
patched = False
new_lines = []

for i, line in enumerate(lines):
    new_lines.append(line)

    # Look for the specific error line
    if 'elif isinstance(response, UserAPIKeyAuth):' in line:
        # Insert fix before this line
        indent = len(line) - len(line.lstrip())
        fix = ' ' * indent + '# GOD MODE: Import UserAPIKeyAuth in local scope\n'
        fix += ' ' * indent + 'from litellm.proxy._types import UserAPIKeyAuth as UAK\n'
        fix += ' ' * indent + 'UserAPIKeyAuth = UAK\n'
        new_lines.insert(-1, fix)
        patched = True
        print(f"Patched at line {i+1}")
        break

if patched:
    # Write patched file
    with open(AUTH_FILE, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("SUCCESS: Patch applied!")
    print("Restart LiteLLM now!")
else:
    print("WARNING: Could not find target line")
    print("File might already be patched or version is different")

print("=" * 80)
input("Press Enter to exit...")
