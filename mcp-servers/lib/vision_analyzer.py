"""
Vision Analyzer - Google Cloud Vision API Integration
Provides image analysis, OCR, object detection, and UI element extraction
"""
import os
import sys
import json
import hashlib
import time
from typing import Dict, List, Any, Optional
from pathlib import Path

# Suppress stdout prints during import for MCP compatibility
_MCP_MODE = os.environ.get('MCP_MODE', 'false').lower() == 'true'

try:
    from google.cloud import vision
    from google.oauth2 import service_account
    import cv2
    import numpy as np
    VISION_AVAILABLE = True
except ImportError:
    VISION_AVAILABLE = False


class VisionAnalyzer:
    """
    Google Cloud Vision API wrapper for advanced image analysis
    Provides OCR, object detection, label detection, and UI element extraction
    """
    
    def __init__(self, config_path: str = "config/vision_config.json"):
        """Initialize Vision API client"""
        if not VISION_AVAILABLE:
            raise ImportError("google-cloud-vision not installed. Run: pip install google-cloud-vision")
        
        # Load configuration
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        
        if not self.config.get('enabled', False):
            raise ValueError("Vision API is disabled in config")
        
        # Initialize Google Cloud Vision client
        credentials_path = self.config.get('credentials_path')
        if not credentials_path:
            raise ValueError("credentials_path not found in config")
        
        # Resolve relative path
        if not os.path.isabs(credentials_path):
            config_dir = os.path.dirname(os.path.abspath(config_path))
            credentials_path = os.path.join(config_dir, credentials_path)
        
        if not os.path.exists(credentials_path):
            raise FileNotFoundError(f"Credentials file not found: {credentials_path}")
        
        # Create credentials and client
        credentials = service_account.Credentials.from_service_account_file(credentials_path)
        self.client = vision.ImageAnnotatorClient(credentials=credentials)
        
        # Cache setup
        self.cache_enabled = self.config.get('cache_enabled', True)
        self.cache_ttl = self.config.get('cache_ttl_seconds', 300)
        self.cache = {}
        
        # Project info
        self.project_id = self.config.get('project_id', 'unknown')
        
        # Only log to stderr if not in MCP mode
        if not _MCP_MODE:
            print(f"✅ Vision API initialized (project: {self.project_id})", file=sys.stderr)
    
    def _get_cache_key(self, image_path: str) -> str:
        """Generate cache key from image file"""
        with open(image_path, 'rb') as f:
            file_hash = hashlib.md5(f.read()).hexdigest()
        return file_hash
    
    def _get_cached_result(self, cache_key: str) -> Optional[Dict]:
        """Get cached analysis result if available and not expired"""
        if not self.cache_enabled:
            return None
        
        if cache_key in self.cache:
            cached_data = self.cache[cache_key]
            if time.time() - cached_data['timestamp'] < self.cache_ttl:
                if not _MCP_MODE:
                    print("📦 Using cached analysis", file=sys.stderr)
                return cached_data['result']
            else:
                del self.cache[cache_key]
        return None
    
    def _cache_result(self, cache_key: str, result: Dict):
        """Cache analysis result"""
        if self.cache_enabled:
            self.cache[cache_key] = {
                'timestamp': time.time(),
                'result': result
            }
    
    def analyze_screenshot(self, image_path: str) -> Dict[str, Any]:
        """
        Perform comprehensive vision analysis on screenshot
        
        Args:
            image_path: Path to screenshot image
            
        Returns:
            Dict containing labels, text, objects, and UI elements
        """
        # Check cache
        cache_key = self._get_cache_key(image_path)
        cached_result = self._get_cached_result(cache_key)
        if cached_result:
            return cached_result
        
        if not _MCP_MODE:
            print(f"🔍 Analyzing screenshot: {image_path}", file=sys.stderr)
        
        # Read image
        with open(image_path, 'rb') as image_file:
            content = image_file.read()
        
        image = vision.Image(content=content)
        
        # Perform different types of analysis
        result = {
            'labels': [],
            'text': [],
            'objects': [],
            'ui_elements': []
        }
        
        try:
            # Label detection
            labels_response = self.client.label_detection(image=image)
            for label in labels_response.label_annotations:
                result['labels'].append({
                    'label': label.description,
                    'confidence': round(label.score * 100, 2)
                })
        except Exception as e:
            if not _MCP_MODE:
                print(f"⚠️  Label detection failed: {e}", file=sys.stderr)
        
        try:
            # Text detection (OCR)
            text_response = self.client.text_detection(image=image)
            for text_annotation in text_response.text_annotations[1:]:  # Skip first (full text)
                vertices = text_annotation.bounding_poly.vertices
                bbox = {
                    'x': vertices[0].x,
                    'y': vertices[0].y,
                    'width': vertices[2].x - vertices[0].x,
                    'height': vertices[2].y - vertices[0].y
                }
                center = {
                    'x': vertices[0].x + bbox['width'] // 2,
                    'y': vertices[0].y + bbox['height'] // 2
                }
                result['text'].append({
                    'text': text_annotation.description,
                    'bbox': bbox,
                    'center': center,
                    'confidence': round(text_annotation.confidence * 100, 2) if hasattr(text_annotation, 'confidence') else 100
                })
        except Exception as e:
            if not _MCP_MODE:
                print(f"⚠️  Text detection failed: {e}", file=sys.stderr)
        
        try:
            # Object localization
            objects_response = self.client.object_localization(image=image)
            for obj in objects_response.localized_object_annotations:
                vertices = obj.bounding_poly.normalized_vertices
                # Convert normalized coordinates to pixel coordinates
                # (Assuming standard screen size, adjust as needed)
                bbox = {
                    'x': int(vertices[0].x * 1920),
                    'y': int(vertices[0].y * 1080),
                    'width': int((vertices[2].x - vertices[0].x) * 1920),
                    'height': int((vertices[2].y - vertices[0].y) * 1080)
                }
                center = {
                    'x': bbox['x'] + bbox['width'] // 2,
                    'y': bbox['y'] + bbox['height'] // 2
                }
                result['objects'].append({
                    'name': obj.name,
                    'confidence': round(obj.score * 100, 2),
                    'bbox': bbox,
                    'center': center
                })
        except Exception as e:
            if not _MCP_MODE:
                print(f"⚠️  Object detection failed: {e}", file=sys.stderr)
        
        # Extract UI elements from text (buttons, inputs, etc.)
        result['ui_elements'] = self._extract_ui_elements(result['text'])
        
        if not _MCP_MODE:
            print(f"✅ Analysis complete: {len(result['text'])} texts, {len(result['objects'])} objects, {len(result['ui_elements'])} UI elements", file=sys.stderr)
        
        # Cache result
        self._cache_result(cache_key, result)
        
        return result
    
    def _extract_ui_elements(self, text_elements: List[Dict]) -> List[Dict]:
        """
        Extract potential UI elements from text detections
        Identifies buttons, inputs, links, etc.
        """
        ui_elements = []
        
        # Keywords that suggest UI elements
        button_keywords = ['button', 'btn', 'submit', 'send', 'ok', 'cancel', 'save', 'delete', 'add', 'edit']
        input_keywords = ['search', 'enter', 'input', 'type', 'username', 'password', 'email']
        
        for text_elem in text_elements:
            text_lower = text_elem['text'].lower()
            
            # Identify element type
            elem_type = 'text'
            if any(keyword in text_lower for keyword in button_keywords):
                elem_type = 'button'
            elif any(keyword in text_lower for keyword in input_keywords):
                elem_type = 'input'
            elif len(text_elem['text']) < 3:  # Very short text might be icon/button
                elem_type = 'button'
            
            # Only add if likely to be interactive
            if elem_type in ['button', 'input']:
                ui_elements.append({
                    'type': elem_type,
                    'text': text_elem['text'],
                    'bbox': text_elem['bbox'],
                    'center': text_elem['center']
                })
        
        return ui_elements
    
    def find_element_by_text(self, image_path: str, search_text: str) -> Optional[Dict]:
        """
        Find specific text in image and return its location
        
        Args:
            image_path: Path to screenshot
            search_text: Text to search for
            
        Returns:
            Dict with bbox and center coordinates, or None if not found
        """
        analysis = self.analyze_screenshot(image_path)
        
        search_lower = search_text.lower()
        
        # Exact match first
        for text_elem in analysis['text']:
            if text_elem['text'].lower() == search_lower:
                return text_elem
        
        # Partial match
        for text_elem in analysis['text']:
            if search_lower in text_elem['text'].lower():
                return text_elem
        
        return None
    
    def get_all_clickable_elements(self, image_path: str) -> List[Dict]:
        """
        Get all potentially clickable UI elements
        
        Args:
            image_path: Path to screenshot
            
        Returns:
            List of UI elements with coordinates
        """
        analysis = self.analyze_screenshot(image_path)
        return analysis['ui_elements']
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        return {
            'enabled': self.cache_enabled,
            'entries': len(self.cache),
            'ttl': self.cache_ttl
        }


# Module-level initialization message (only if not in MCP mode)
if VISION_AVAILABLE and not _MCP_MODE:
    print("✅ Vision API module loaded", file=sys.stderr)
