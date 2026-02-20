"""
Admin privilege handling utilities
"""

import ctypes
import sys
import subprocess
import os
from typing import Optional, Tuple
import logging

logger = logging.getLogger("admin")


def check_admin_privileges() -> bool:
    """
    Check if the current process has administrator privileges
    
    Returns:
        True if running as admin, False otherwise
    """
    try:
        return ctypes.windll.shell32.IsUserAnAdmin() != 0
    except Exception as e:
        logger.error(f"Failed to check admin status: {e}")
        return False


def request_admin_elevation():
    """
    Request admin elevation by restarting the script with elevated privileges
    
    Raises:
        SystemExit: Always exits after requesting elevation
    """
    if check_admin_privileges():
        logger.info("Already running as administrator")
        return
    
    logger.info("Requesting administrator privileges...")
    
    # Get the current script path
    script_path = os.path.abspath(sys.argv[0])
    
    try:
        # Request elevation
        ctypes.windll.shell32.ShellExecuteW(
            None,
            "runas",
            sys.executable,
            f'"{script_path}"',
            None,
            1  # SW_SHOWNORMAL
        )
        
        logger.info("Elevation requested - exiting current process")
        sys.exit(0)
        
    except Exception as e:
        logger.error(f"Failed to request elevation: {e}")
        raise


def run_as_admin(command: str, timeout: int = 30) -> Tuple[int, str, str]:
    """
    Execute a command with administrator privileges
    
    Args:
        command: Command to execute
        timeout: Timeout in seconds
        
    Returns:
        (return_code, stdout, stderr) tuple
    """
    if not check_admin_privileges():
        logger.warning("Not running as admin - command may fail")
    
    try:
        # Execute with PowerShell
        result = subprocess.run(
            ["powershell", "-NoProfile", "-Command", command],
            capture_output=True,
            text=True,
            timeout=timeout,
            shell=False
        )
        
        return (result.returncode, result.stdout, result.stderr)
        
    except subprocess.TimeoutExpired:
        logger.error(f"Command timed out after {timeout}s")
        return (-1, "", f"Timeout after {timeout}s")
        
    except Exception as e:
        logger.error(f"Command execution failed: {e}")
        return (-1, "", str(e))


def run_powershell_as_admin(script: str, timeout: int = 30) -> Tuple[int, str, str]:
    """
    Execute a PowerShell script with admin privileges
    
    Args:
        script: PowerShell script content
        timeout: Timeout in seconds
        
    Returns:
        (return_code, stdout, stderr) tuple
    """
    return run_as_admin(script, timeout)


def check_uac_enabled() -> bool:
    """
    Check if User Account Control (UAC) is enabled
    
    Returns:
        True if UAC is enabled
    """
    try:
        import winreg
        
        key = winreg.OpenKey(
            winreg.HKEY_LOCAL_MACHINE,
            r"SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System",
            0,
            winreg.KEY_READ
        )
        
        value, _ = winreg.QueryValueEx(key, "EnableLUA")
        winreg.CloseKey(key)
        
        return value == 1
        
    except Exception as e:
        logger.error(f"Failed to check UAC status: {e}")
        return True  # Assume enabled if we can't check


def is_admin_required(operation: str) -> bool:
    """
    Determine if an operation requires admin privileges
    
    Args:
        operation: Description of the operation
        
    Returns:
        True if admin is likely required
    """
    admin_keywords = [
        'system',
        'service',
        'registry',
        'program files',
        'windows',
        'drivers',
        'firewall',
        'security',
        'install',
        'uninstall'
    ]
    
    operation_lower = operation.lower()
    return any(keyword in operation_lower for keyword in admin_keywords)
