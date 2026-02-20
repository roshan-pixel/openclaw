"""
Screenshot and image capture utilities
"""

import io
import base64
from PIL import ImageGrab, Image
from typing import Tuple, Optional
import logging

logger = logging.getLogger("screenshot")

def capture_full_screen() -> str:
    """
    Capture full screen and return as base64 PNG
    
    Returns:
        Base64-encoded PNG image
    """
    try:
        screenshot = ImageGrab.grab()
        return image_to_base64(screenshot)
    except Exception as e:
        logger.error(f"Screenshot capture failed: {e}")
        raise


def capture_screen_region(x: int, y: int, width: int, height: int) -> str:
    """
    Capture a specific region of the screen
    
    Args:
        x, y: Top-left corner coordinates
        width, height: Region dimensions
        
    Returns:
        Base64-encoded PNG image
    """
    try:
        bbox = (x, y, x + width, y + height)
        screenshot = ImageGrab.grab(bbox=bbox)
        return image_to_base64(screenshot)
    except Exception as e:
        logger.error(f"Region capture failed: {e}")
        raise


def capture_window(window_handle: int) -> str:
    """
    Capture a specific window
    
    Args:
        window_handle: Windows HWND of the window
        
    Returns:
        Base64-encoded PNG image
    """
    try:
        import win32gui
        import win32ui
        import win32con
        
        # Get window dimensions
        left, top, right, bottom = win32gui.GetWindowRect(window_handle)
        width = right - left
        height = bottom - top
        
        # Capture window
        hwndDC = win32gui.GetWindowDC(window_handle)
        mfcDC = win32ui.CreateDCFromHandle(hwndDC)
        saveDC = mfcDC.CreateCompatibleDC()
        
        saveBitMap = win32ui.CreateBitmap()
        saveBitMap.CreateCompatibleBitmap(mfcDC, width, height)
        saveDC.SelectObject(saveBitMap)
        
        saveDC.BitBlt((0, 0), (width, height), mfcDC, (0, 0), win32con.SRCCOPY)
        
        # Convert to PIL Image
        bmpinfo = saveBitMap.GetInfo()
        bmpstr = saveBitMap.GetBitmapBits(True)
        
        image = Image.frombuffer(
            'RGB',
            (bmpinfo['bmWidth'], bmpinfo['bmHeight']),
            bmpstr, 'raw', 'BGRX', 0, 1
        )
        
        # Cleanup
        win32gui.DeleteObject(saveBitMap.GetHandle())
        saveDC.DeleteDC()
        mfcDC.DeleteDC()
        win32gui.ReleaseDC(window_handle, hwndDC)
        
        return image_to_base64(image)
        
    except Exception as e:
        logger.error(f"Window capture failed: {e}")
        raise


def image_to_base64(image: Image.Image, format: str = "PNG") -> str:
    """
    Convert PIL Image to base64 string
    
    Args:
        image: PIL Image object
        format: Image format (PNG, JPEG, etc.)
        
    Returns:
        Base64-encoded image string
    """
    buffered = io.BytesIO()
    image.save(buffered, format=format)
    img_bytes = buffered.getvalue()
    img_base64 = base64.b64encode(img_bytes).decode('utf-8')
    return img_base64


def base64_to_image(base64_str: str) -> Image.Image:
    """
    Convert base64 string to PIL Image
    
    Args:
        base64_str: Base64-encoded image
        
    Returns:
        PIL Image object
    """
    img_bytes = base64.b64decode(base64_str)
    image = Image.open(io.BytesIO(img_bytes))
    return image


def get_screen_size() -> Tuple[int, int]:
    """
    Get screen dimensions
    
    Returns:
        (width, height) tuple
    """
    try:
        import pyautogui
        return pyautogui.size()
    except:
        # Fallback to PIL
        screenshot = ImageGrab.grab()
        return screenshot.size


def compress_image(image: Image.Image, max_size: int = 1024) -> Image.Image:
    """
    Compress image to reduce size while maintaining aspect ratio
    
    Args:
        image: PIL Image to compress
        max_size: Maximum dimension (width or height)
        
    Returns:
        Compressed PIL Image
    """
    width, height = image.size
    
    if width <= max_size and height <= max_size:
        return image
    
    # Calculate new dimensions
    if width > height:
        new_width = max_size
        new_height = int(height * (max_size / width))
    else:
        new_height = max_size
        new_width = int(width * (max_size / height))
    
    return image.resize((new_width, new_height), Image.Resampling.LANCZOS)
