"""
OpenClaw Vision Tool - Google Cloud Vision API Integration
MCP Tool for advanced image analysis with OCR, object detection, and UI element extraction
Follows OpenClaw tool pattern with get_tool_definition() and execute() methods
"""

import sys
import os
from typing import Sequence
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from mcp.types import Tool, TextContent

try:
    from lib.vision_analyzer import VisionAnalyzer, VISION_AVAILABLE
except ImportError:
    VISION_AVAILABLE = False
    VisionAnalyzer = None


class VisionTool:
    """
    Google Cloud Vision API tool for advanced image analysis
    Provides OCR, object detection, label detection, and UI element extraction

    Features:
    - Text detection with exact coordinates (OCR)
    - Object localization (buttons, windows, icons)
    - Label detection (scene understanding)
    - UI element extraction (clickable elements)
    - Smart caching (5-minute TTL)
    - Find specific text and return coordinates
    """

    def __init__(self):
        """Initialize Vision tool"""
        self.name = "Windows-MCP:Vision"
        self.requires_admin = False
        self.analyzer = None

        # Try to initialize analyzer
        if VISION_AVAILABLE:
            try:
                self.analyzer = VisionAnalyzer()
                print("✅ Vision API initialized")
            except Exception as e:
                print(f"⚠️  Vision API initialization failed: {e}")
                print("    Tool will be available but return setup instructions")

    def get_tool_definition(self) -> Tool:
        """
        Return MCP tool definition

        Returns:
            Tool: MCP tool schema with all parameters
        """
        return Tool(
            name=self.name,
            description="""Advanced image analysis using Google Cloud Vision API.
Detects text (OCR), objects, labels, and UI elements with precise coordinates.
Much more accurate than basic screenshot analysis for finding clickable elements.

Use this tool to:
- Find text on screen with exact coordinates (e.g., find "Send" button)
- Detect all clickable UI elements (buttons, inputs, dropdowns)
- Analyze screenshots for automation planning
- Get object locations (windows, icons, images)
- Extract text with OCR (better than basic methods)

This tool provides superior accuracy for UI automation compared to basic screenshot tools.""",
            inputSchema={
                "type": "object",
                "properties": {
                    "image_path": {
                        "type": "string",
                        "description": "Path to screenshot image to analyze (required)"
                    },
                    "find_text": {
                        "type": "string",
                        "description": "Optional: Search for specific text and return its coordinates. Example: 'Send', 'Login', 'Settings'"
                    },
                    "analysis_type": {
                        "type": "string",
                        "enum": ["full", "text", "objects", "labels", "ui_elements"],
                        "description": "Type of analysis: 'full' (default, all features), 'text' (OCR only), 'objects' (object detection), 'labels' (scene labels), 'ui_elements' (clickable elements only)",
                        "default": "full"
                    },
                    "get_clickable": {
                        "type": "boolean",
                        "description": "Set to true to return only clickable UI elements (buttons, inputs). Useful for automation.",
                        "default": False
                    }
                },
                "required": ["image_path"]
            }
        )

    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        """
        Execute vision analysis

        Args:
            arguments: Tool arguments containing:
                - image_path (required): Path to screenshot
                - find_text (optional): Text to search for
                - analysis_type (optional): Type of analysis
                - get_clickable (optional): Return only clickable elements

        Returns:
            Sequence[TextContent]: Formatted analysis results
        """
        # Check if Vision API is available
        if not VISION_AVAILABLE or self.analyzer is None:
            setup_instructions = """ERROR: Google Cloud Vision API not available.

📋 SETUP REQUIRED:

1. Install Python package:
   pip install google-cloud-vision==3.7.2

2. Create Google Cloud project:
   - Go to: https://console.cloud.google.com
   - Create new project (e.g., "openclaw-vision")
   - Enable Cloud Vision API

3. Create service account:
   - Go to: IAM & Admin → Service Accounts
   - Create service account with "Cloud Vision API User" role
   - Download JSON credentials

4. Save credentials:
   - Place JSON file at: keys/vision-key.json

5. Create config file at: config/vision_config.json
   {
     "enabled": true,
     "credentials_path": "../keys/vision-key.json",
     "project_id": "your-project-id",
     "features": ["LABEL_DETECTION", "TEXT_DETECTION", "OBJECT_LOCALIZATION"],
     "cache_enabled": true
   }

6. Restart OpenClaw

💡 For now, use Windows-MCP:Snapshot for basic screenshot analysis.

📚 Need help? Check PHASE1_SETUP_GUIDE.md
"""
            return [TextContent(type="text", text=setup_instructions)]

        # Extract arguments
        image_path = arguments.get("image_path")
        find_text = arguments.get("find_text")
        analysis_type = arguments.get("analysis_type", "full")
        get_clickable = arguments.get("get_clickable", False)

        # Validate image exists
        if not os.path.exists(image_path):
            return [TextContent(
                type="text",
                text=f"ERROR: Image file not found: {image_path}\n\nMake sure to take a screenshot first using Windows-MCP:Snapshot"
            )]

        try:
            # MODE 1: Find specific text
            if find_text:
                result = self.analyzer.find_element_by_text(image_path, find_text)

                if result:
                    coords = result["center"]
                    bbox = result["bbox"]

                    response = f"""✅ FOUND TEXT: "{find_text}"

📍 COORDINATES:
   Center: ({coords['x']}, {coords['y']})

📦 BOUNDING BOX:
   X: {bbox['x']}
   Y: {bbox['y']}
   Width: {bbox['width']}
   Height: {bbox['height']}

✨ TEXT MATCHED: "{result['text']}"

💡 NEXT STEP:
   Use Windows-MCP:Click with coordinates ({coords['x']}, {coords['y']}) to click this element.

Example:
   Click at x={coords['x']}, y={coords['y']}
"""
                    return [TextContent(type="text", text=response)]
                else:
                    return [TextContent(
                        type="text",
                        text=f"""❌ TEXT NOT FOUND: "{find_text}"

The text "{find_text}" was not detected in the image.

💡 SUGGESTIONS:
   1. Try a shorter version (e.g., "Send" instead of "Send Message")
   2. Try partial text (e.g., "Settings" instead of "Settings Menu")
   3. Use analysis_type="text" to see all detected text
   4. Check if the text is visible in the screenshot

🔍 TIP: Run full analysis to see what text was detected:
   Use Windows-MCP:Vision with analysis_type="text"
"""
                    )]

            # MODE 2: Get only clickable elements
            if get_clickable:
                clickable_elements = self.analyzer.get_all_clickable_elements(image_path)

                if clickable_elements:
                    response = f"""🎯 CLICKABLE UI ELEMENTS DETECTED: {len(clickable_elements)}

"""
                    for i, elem in enumerate(clickable_elements[:25], 1):
                        coords = elem['center']
                        response += f"""{i}. {elem['type'].upper()}: "{elem['text']}"
   📍 Location: ({coords['x']}, {coords['y']})
   📦 Size: {elem['bbox']['width']}x{elem['bbox']['height']}

"""

                    if len(clickable_elements) > 25:
                        response += f"... and {len(clickable_elements) - 25} more elements\n\n"

                    response += """💡 HOW TO USE:
   Copy the coordinates and use Windows-MCP:Click to interact.
   Example: Click at x=850, y=450 for element #1
"""

                    return [TextContent(type="text", text=response)]
                else:
                    return [TextContent(
                        type="text",
                        text="""⚠️  NO CLICKABLE ELEMENTS DETECTED

No buttons or input fields were identified in the image.

💡 POSSIBLE REASONS:
   1. The screenshot doesn't contain UI elements
   2. Elements are not clearly visible
   3. Text is too small or unclear

🔍 TRY:
   Use analysis_type="full" to see all detected objects and text.
"""
                    )]

            # MODE 3: Full or filtered analysis
            analysis = self.analyzer.analyze_screenshot(image_path)

            # Format response based on analysis type
            if analysis_type == "text":
                texts = analysis["text"]
                response = f"""📝 TEXT ANALYSIS: {len(texts)} elements detected

"""
                for i, text in enumerate(texts[:40], 1):
                    coords = text['center']
                    response += f'{i}. "{text["text"]}" at ({coords["x"]}, {coords["y"]})\n'

                if len(texts) > 40:
                    response += f"\n... and {len(texts) - 40} more text elements\n"

                response += """\n💡 TIP: Use find_text parameter to get coordinates of specific text."""

            elif analysis_type == "objects":
                objects = analysis["objects"]
                response = f"""🎯 OBJECT ANALYSIS: {len(objects)} objects detected

"""
                for i, obj in enumerate(objects, 1):
                    coords = obj['center']
                    response += f"""{i}. {obj['name']} ({obj['confidence']}%)
   📍 Location: ({coords['x']}, {coords['y']})
   📦 Size: {obj['bbox']['width']}x{obj['bbox']['height']}

"""

            elif analysis_type == "labels":
                labels = analysis["labels"]
                response = f"""🏷️  LABEL ANALYSIS: {len(labels)} scene labels detected

"""
                for i, label in enumerate(labels[:20], 1):
                    response += f"{i}. {label['label']} ({label['confidence']}% confidence)\n"

                response += """\n💡 Labels describe the overall scene and content type."""

            elif analysis_type == "ui_elements":
                ui_elements = analysis["ui_elements"]
                response = f"""🖱️  UI ELEMENTS: {len(ui_elements)} clickable elements detected

"""
                for i, elem in enumerate(ui_elements, 1):
                    coords = elem['center']
                    response += f"""{i}. {elem['type'].upper()}: "{elem['text']}"
   📍 Click at: ({coords['x']}, {coords['y']})

"""

            else:  # full analysis
                response = f"""🔍 VISION API ANALYSIS COMPLETE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SUMMARY:
   • {len(analysis['labels'])} scene labels detected
   • {len(analysis['text'])} text elements found
   • {len(analysis['objects'])} objects localized
   • {len(analysis['ui_elements'])} clickable UI elements

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🖱️  CLICKABLE ELEMENTS (Top 15):
"""
                if analysis['ui_elements']:
                    for i, elem in enumerate(analysis['ui_elements'][:15], 1):
                        coords = elem['center']
                        response += f"   {i}. {elem['type'].upper()}: '{elem['text']}' at ({coords['x']}, {coords['y']})\n"
                else:
                    response += "   (No clickable elements detected)\n"

                response += f"""\n📝 TEXT ELEMENTS (Top 20):\n"""
                if analysis['text']:
                    for i, text in enumerate(analysis['text'][:20], 1):
                        coords = text['center']
                        response += f'   {i}. "{text["text"]}" at ({coords["x"]}, {coords["y"]})\n'
                else:
                    response += "   (No text detected)\n"

                response += f"""\n🎯 OBJECTS DETECTED (Top 10):\n"""
                if analysis['objects']:
                    for i, obj in enumerate(analysis['objects'][:10], 1):
                        coords = obj['center']
                        response += f"   {i}. {obj['name']} ({obj['confidence']}%) at ({coords['x']}, {coords['y']})\n"
                else:
                    response += "   (No objects detected)\n"

                response += f"""\n🏷️  SCENE LABELS (Top 10):\n"""
                if analysis['labels']:
                    for i, label in enumerate(analysis['labels'][:10], 1):
                        response += f"   {i}. {label['label']} ({label['confidence']}%)\n"
                else:
                    response += "   (No labels detected)\n"

                response += """\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 HOW TO USE THESE RESULTS:
   1. Find the element you want to interact with
   2. Use Windows-MCP:Click with the coordinates shown
   3. Or use find_text parameter to search for specific text

Example:
   "Use vision to find 'Send' button" → Returns coordinates → Click at those coordinates
"""

            return [TextContent(type="text", text=response)]

        except Exception as e:
            import traceback
            error_details = traceback.format_exc()

            error_msg = f"""ERROR: Vision analysis failed

❌ Error: {str(e)}

🔍 TROUBLESHOOTING:
   1. Check that Vision API credentials are valid
   2. Ensure Google Cloud Vision API is enabled
   3. Verify credentials at: keys/vision-key.json
   4. Check config at: config/vision_config.json
   5. Ensure you have API quota remaining

💡 FALLBACK:
   Use Windows-MCP:Snapshot for basic screenshot analysis.

📋 DETAILED ERROR:
{error_details}
"""
            return [TextContent(type="text", text=error_msg)]
