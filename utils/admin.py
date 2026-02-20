"""Admin privileges check"""
import ctypes
import sys

def check_admin_privileges() -> bool:
    """Check if running with administrator privileges."""
    try:
        return ctypes.windll.shell32.IsUserAnAdmin() != 0
    except Exception:
        return False
