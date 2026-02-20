"""
GodMode Launcher - Auto-elevates to admin privileges with auto-cleanup
"""
import ctypes
import sys
import subprocess
import os
import shutil
import time

# Prevent bytecode generation globally
sys.dont_write_bytecode = True
os.environ['PYTHONDONTWRITEBYTECODE'] = '1'


def is_admin():
    """Check if running as administrator."""
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False


def cleanup_cache():
    """Kill old Python processes and clean cache (fast mode)."""
    print("\n🧹 Auto-cleanup: Clearing cache...")
    
    # Kill other Python processes (EXCEPT current one)
    try:
        current_pid = os.getpid()
        subprocess.run(
            ["taskkill", "/F", "/IM", "python.exe", "/FI", f"PID ne {current_pid}"], 
            stdout=subprocess.DEVNULL, 
            stderr=subprocess.DEVNULL,
            timeout=2
        )
        time.sleep(0.5)
    except:
        pass
    
    # Only clean specific directories (not full recursive scan)
    cache_count = 0
    folders_to_check = ['.', 'tools', 'lib', 'scripts', 'mcp-servers']
    
    for folder in folders_to_check:
        if not os.path.exists(folder):
            continue
        
        cache_path = os.path.join(folder, '__pycache__')
        if os.path.exists(cache_path):
            try:
                shutil.rmtree(cache_path)
                cache_count += 1
            except:
                pass
    
    print(f"   ✓ Cleaned {cache_count} cache directories")
    print("   ✓ Ready!\n")


def elevate():
    """Re-launch the script with admin privileges."""
    if is_admin():
        return True
    
    print("[GODMODE] Requesting administrator privileges...")
    
    # Re-run the script with admin rights
    try:
        script = sys.argv[0]
        params = " ".join([f'"{arg}"' for arg in sys.argv[1:]])
        
        # Use ShellExecute with 'runas' to trigger UAC
        ctypes.windll.shell32.ShellExecuteW(
            None, 
            "runas",  # Request elevation
            sys.executable,  # Python executable
            f'"{script}" {params}',  # Script + args
            None,
            1  # SW_SHOWNORMAL
        )
        
        # Exit current non-elevated process
        sys.exit(0)
        
    except Exception as e:
        print(f"[ERROR] Failed to elevate: {e}")
        print("Please run as administrator manually:")
        print(f"  Right-click → Run as Administrator")
        sys.exit(1)


def main():
    """Main entry point."""
    # Ensure admin privileges
    if not is_admin():
        elevate()
        return
    
    print("\n" + "="*60)
    print("🔥 GODMODE ACTIVE - Administrator Privileges Enabled")
    print("="*60)
    
    # AUTO-CLEANUP: Kill old processes and clear cache (fast)
    cleanup_cache()
    
    # Launch the CLI agent with admin rights
    print("Starting OpenClaw Enhanced Agent with GodMode...\n")
    
    agent_script = os.path.join(os.path.dirname(__file__), "scripts", "cli_agent.py")
    
    # Run the agent with -B flag to prevent bytecode generation
    subprocess.run([sys.executable, "-B", agent_script], env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"})


if __name__ == "__main__":
    main()
