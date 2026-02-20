import sys
import importlib

required = [
    'mcp', 'pyautogui', 'pywinauto', 'PIL', 
    'pytesseract', 'win32api', 'psutil', 'comtypes'
]

for package in required:
    try:
        importlib.import_module(package)
        print(f"✓ {package}")
    except ImportError:
        print(f"✗ {package} - MISSING")
        sys.exit(1)

print("\n✓ All prerequisites installed!")
