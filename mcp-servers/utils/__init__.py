"""
Utility modules for Windows MCP Server
"""

# Logger utilities
from .logger import setup_logger, get_logger

# Admin utilities
from .admin import (
    check_admin_privileges,
    request_admin_elevation,
    run_as_admin,
    run_powershell_as_admin,
    check_uac_enabled,
    is_admin_required
)

# Screenshot utilities
from .screenshot import (
    capture_full_screen,
    capture_screen_region,
    capture_window,
    image_to_base64,
    base64_to_image,
    get_screen_size,
    compress_image
)

# Accessibility utilities
from .accessibility import (
    get_accessibility_tree,
    get_system_info,
    get_active_window_info,
    get_ui_elements,
    get_browser_elements,
    get_browser_dom,
    get_scrollable_areas
)

__all__ = [
    # Logger
    'setup_logger',
    'get_logger',
    
    # Admin
    'check_admin_privileges',
    'request_admin_elevation',
    'run_as_admin',
    'run_powershell_as_admin',
    'check_uac_enabled',
    'is_admin_required',
    
    # Screenshot
    'capture_full_screen',
    'capture_screen_region',
    'capture_window',
    'image_to_base64',
    'base64_to_image',
    'get_screen_size',
    'compress_image',
    
    # Accessibility
    'get_accessibility_tree',
    'get_system_info',
    'get_active_window_info',
    'get_ui_elements',
    'get_browser_elements',
    'get_browser_dom',
    'get_scrollable_areas',
]
