import sys
from pathlib import Path
import inspect

print("=" * 80)
print("MCP MANAGER ADVANCED DIAGNOSTIC")
print("=" * 80)

# Check if mcp_manager.py exists
mcp_path = Path(__file__).parent / "lib" / "mcp_manager.py"
print(f"\nFile exists: {mcp_path.exists()}")
print(f"File path: {mcp_path}")

if mcp_path.exists():
    print("\nFile size:", mcp_path.stat().st_size, "bytes")

    # Try to import and list everything
    sys.path.insert(0, str(Path(__file__).parent / "lib"))

    try:
        import mcp_manager
        print("\n✅ Import successful!")

        print("\n" + "=" * 80)
        print("AVAILABLE CLASSES:")
        print("=" * 80)

        classes_found = []
        for name in dir(mcp_manager):
            if not name.startswith('_'):
                obj = getattr(mcp_manager, name)
                if inspect.isclass(obj):
                    classes_found.append(name)
                    print(f"\n  CLASS: {name}")

                    # Show methods
                    methods = [m for m in dir(obj) if not m.startswith('_') and callable(getattr(obj, m, None))]
                    if methods:
                        print(f"  Methods: {', '.join(methods[:5])}")
                        if len(methods) > 5:
                            print(f"           ... and {len(methods) - 5} more")

        if not classes_found:
            print("\n  No classes found!")
            print("\n  Available items:")
            for name in dir(mcp_manager):
                if not name.startswith('_'):
                    print(f"    - {name}")
        else:
            print("\n" + "=" * 80)
            print("RECOMMENDATION:")
            print("=" * 80)
            print(f"\nUse one of these classes: {', '.join(classes_found)}")
            print(f"\nMost likely: {classes_found[0]}")

    except Exception as e:
        print(f"\n❌ Import failed: {e}")
        import traceback
        traceback.print_exc()
else:
    print("\n❌ File not found!")

print("\n" + "=" * 80)
