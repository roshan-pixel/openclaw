"""
Debug wrapper to capture server errors
"""
import sys
import traceback

try:
    print("🚀 Debug wrapper starting...", file=sys.stderr, flush=True)
    print(f"Python: {sys.version}", file=sys.stderr, flush=True)
    print(f"Working dir: {sys.path[0]}", file=sys.stderr, flush=True)
    
    # Import and run the actual server
    import windows_mcp_server
    print("✅ Imported windows_mcp_server", file=sys.stderr, flush=True)
    
    # Run it
    windows_mcp_server.asyncio.run(windows_mcp_server.main())
    
except Exception as e:
    print(f"❌ FATAL ERROR: {e}", file=sys.stderr, flush=True)
    traceback.print_exc(file=sys.stderr)
    sys.exit(1)
