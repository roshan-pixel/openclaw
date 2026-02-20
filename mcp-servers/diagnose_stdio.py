#!/usr/bin/env python3
"""
Diagnostic script to identify what's polluting stdio
Run this BEFORE the MCP server to find the issue
"""

import sys
import os

print("=== STDIO Diagnostic Tool ===", file=sys.stderr)
print(f"Python: {sys.version}", file=sys.stderr)
print(f"Working dir: {os.getcwd()}", file=sys.stderr)
print(f"", file=sys.stderr)

# Check if running in correct directory
if not os.path.exists("tools"):
    print("ERROR: 'tools' directory not found!", file=sys.stderr)
    print("Make sure you're running from the correct directory", file=sys.stderr)
    sys.exit(1)

print("Step 1: Testing basic imports...", file=sys.stderr)

# Test each import individually
imports_to_test = [
    "importlib",
    "asyncio",
    "pathlib",
    "typing",
]

for imp in imports_to_test:
    try:
        __import__(imp)
        print(f"  ✓ {imp}", file=sys.stderr)
    except Exception as e:
        print(f"  ✗ {imp}: {e}", file=sys.stderr)

print("", file=sys.stderr)
print("Step 2: Testing MCP imports...", file=sys.stderr)

mcp_imports = [
    "mcp.server",
    "mcp.types",
    "mcp.server.stdio",
]

for imp in mcp_imports:
    try:
        __import__(imp)
        print(f"  ✓ {imp}", file=sys.stderr)
    except Exception as e:
        print(f"  ✗ {imp}: {e}", file=sys.stderr)

print("", file=sys.stderr)
print("Step 3: Testing tool imports (this might pollute stdout)...", file=sys.stderr)

tool_modules = [
    "tools.click_tool",
    "tools.type_tool",
    "tools.app_tool",
]

for module_name in tool_modules:
    print(f"  Testing {module_name}...", file=sys.stderr)
    
    # Capture what gets written to stdout
    from io import StringIO
    
    old_stdout = sys.stdout
    old_stderr = sys.stderr
    
    capture_out = StringIO()
    capture_err = StringIO()
    
    sys.stdout = capture_out
    sys.stderr = capture_err
    
    try:
        __import__(module_name)
        sys.stdout = old_stdout
        sys.stderr = old_stderr
        
        out_content = capture_out.getvalue()
        err_content = capture_err.getvalue()
        
        if out_content:
            print(f"    ⚠ STDOUT pollution detected:", file=sys.stderr)
            print(f"      {repr(out_content[:100])}", file=sys.stderr)
        
        if err_content:
            print(f"    ⚠ STDERR pollution detected:", file=sys.stderr)
            print(f"      {repr(err_content[:100])}", file=sys.stderr)
        
        if not out_content and not err_content:
            print(f"    ✓ Clean import", file=sys.stderr)
            
    except Exception as e:
        sys.stdout = old_stdout
        sys.stderr = old_stderr
        print(f"    ✗ Import failed: {e}", file=sys.stderr)

print("", file=sys.stderr)
print("=== Diagnostic Complete ===", file=sys.stderr)
print("Check above for any STDOUT/STDERR pollution", file=sys.stderr)
print("", file=sys.stderr)
