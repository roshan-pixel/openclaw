"""
Accessibility tree and UI element detection utilities
"""

import json
from typing import Dict, List, Optional
import logging

try:
    import win32gui
    import win32con
    import win32process
    import psutil
    from comtypes import client
    from comtypes.gen import UIAutomationClient
    UIAUTOMATION_AVAILABLE = True
except ImportError:
    UIAUTOMATION_AVAILABLE = False

logger = logging.getLogger("accessibility")


def get_accessibility_tree(use_dom: bool = False) -> Dict:
    """
    Get the accessibility tree for the desktop or active browser
    
    Args:
        use_dom: If True, get browser DOM instead of desktop UI
        
    Returns:
        Dictionary containing accessibility tree data
    """
    if not UIAUTOMATION_AVAILABLE:
        logger.error("UI Automation not available")
        return {"error": "UI Automation libraries not installed"}
    
    try:
        tree = {
            "system": get_system_info(),
            "active_window": get_active_window_info(),
            "elements": [],
            "scrollable": []
        }
        
        if use_dom:
            # Get browser DOM
            tree["elements"] = get_browser_elements()
        else:
            # Get desktop UI elements
            tree["elements"] = get_ui_elements()
        
        tree["scrollable"] = get_scrollable_areas(tree["elements"])
        
        return tree
        
    except Exception as e:
        logger.error(f"Failed to get accessibility tree: {e}", exc_info=True)
        return {"error": str(e)}


def get_system_info() -> Dict:
    """Get system information"""
    try:
        import locale
        import pyautogui
        
        return {
            "language": locale.getdefaultlocale()[0],
            "screen_size": list(pyautogui.size())
        }
    except Exception as e:
        logger.error(f"Failed to get system info: {e}")
        return {}


def get_active_window_info() -> Dict:
    """Get information about the active window"""
    try:
        hwnd = win32gui.GetForegroundWindow()
        
        # Get window title
        title = win32gui.GetWindowText(hwnd)
        
        # Get process name
        _, pid = win32process.GetWindowThreadProcessId(hwnd)
        try:
            process = psutil.Process(pid)
            process_name = process.name()
        except:
            process_name = "Unknown"
        
        # Get window position
        rect = win32gui.GetWindowRect(hwnd)
        
        return {
            "title": title,
            "process": process_name,
            "position": {
                "x": rect[0],
                "y": rect[1],
                "width": rect[2] - rect[0],
                "height": rect[3] - rect[1]
            },
            "handle": hwnd
        }
    except Exception as e:
        logger.error(f"Failed to get window info: {e}")
        return {}


def get_ui_elements() -> List[Dict]:
    """
    Get interactive UI elements from the desktop
    
    Returns:
        List of element dictionaries with type, name, and coordinates
    """
    elements = []
    
    try:
        # Initialize UI Automation
        uia = client.CreateObject(
            "{ff48dba4-60ef-4201-aa87-54103eef594e}",
            interface=UIAutomationClient.IUIAutomation
        )
        
        # Get root element (desktop)
        root = uia.GetRootElement()
        
        # Get active window
        hwnd = win32gui.GetForegroundWindow()
        window_element = uia.ElementFromHandle(hwnd)
        
        if window_element:
            # Walk the tree
            elements = _walk_ui_tree(uia, window_element, max_depth=5)
        
    except Exception as e:
        logger.error(f"Failed to get UI elements: {e}", exc_info=True)
    
    return elements


def _walk_ui_tree(
    uia: 'UIAutomationClient.IUIAutomation',
    element: 'UIAutomationClient.IUIAutomationElement',
    max_depth: int = 5,
    current_depth: int = 0
) -> List[Dict]:
    """
    Recursively walk the UI automation tree
    
    Args:
        uia: UI Automation instance
        element: Current element
        max_depth: Maximum tree depth
        current_depth: Current depth
        
    Returns:
        List of element dictionaries
    """
    elements = []
    
    if current_depth >= max_depth:
        return elements
    
    try:
        # Get element properties
        control_type = element.CurrentControlType
        name = element.CurrentName
        
        # Get bounding rectangle
        try:
            rect = element.CurrentBoundingRectangle
            x = int(rect.left)
            y = int(rect.top)
            width = int(rect.right - rect.left)
            height = int(rect.bottom - rect.top)
        except:
            x, y, width, height = 0, 0, 0, 0
        
        # Map control type to friendly name
        control_type_map = {
            50000: "button",
            50004: "edit",
            50033: "link",
            50025: "menu",
            50011: "checkbox",
            50003: "combobox",
            50021: "list",
            50005: "image",
            50020: "scrollbar"
        }
        
        type_name = control_type_map.get(control_type, "unknown")
        
        # Only add interactive elements
        if type_name in ["button", "edit", "link", "checkbox", "combobox"] and name:
            elements.append({
                "type": type_name,
                "name": name,
                "coordinates": [x + width // 2, y + height // 2],
                "bounds": {"x": x, "y": y, "width": width, "height": height}
            })
        
        # Get children
        try:
            tree_walker = uia.ControlViewWalker
            child = tree_walker.GetFirstChildElement(element)
            
            while child:
                child_elements = _walk_ui_tree(uia, child, max_depth, current_depth + 1)
                elements.extend(child_elements)
                child = tree_walker.GetNextSiblingElement(child)
        except:
            pass
        
    except Exception as e:
        logger.debug(f"Error processing element: {e}")
    
    return elements


def get_browser_elements() -> List[Dict]:
    """
    Get elements from active browser tab using browser automation
    
    Returns:
        List of element dictionaries
    """
    # This would require Selenium/Playwright integration
    # Placeholder for now
    logger.warning("Browser DOM extraction not yet implemented")
    return []


def get_browser_dom(url: str) -> str:
    """
    Extract DOM content from browser
    
    Args:
        url: URL to extract from
        
    Returns:
        DOM content as markdown
    """
    # Placeholder - would use Selenium/Playwright
    logger.warning("Browser DOM extraction not yet implemented")
    return f"Browser DOM extraction for {url} not yet implemented"


def get_scrollable_areas(elements: List[Dict]) -> List[Dict]:
    """
    Identify scrollable areas from element list
    
    Args:
        elements: List of UI elements
        
    Returns:
        List of scrollable area dictionaries
    """
    scrollable = []
    
    for elem in elements:
        if elem.get("type") == "scrollbar":
            scrollable.append({
                "name": elem.get("name", "Scrollbar"),
                "coordinates": elem["coordinates"]
            })
    
    return scrollable
