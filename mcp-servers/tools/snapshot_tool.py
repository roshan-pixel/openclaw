"""
Snapshot Tool - FIXED VERSION - Fast and Reliable
Captures screenshots without hanging on accessibility tree
"""

import base64
import io
from typing import Sequence
from PIL import ImageGrab
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from . import BaseTool

class SnapshotTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:Snapshot",
            description="Captures screenshot of the desktop. Set use_vision=True for full resolution."
        )
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name=self.name,
            description=self.description,
            inputSchema={
                "type": "object",
                "properties": {
                    "use_vision": {
                        "type": "boolean",
                        "default": True,
                        "description": "Include screenshot (default: True)"
                    },
                    "use_dom": {
                        "type": "boolean",
                        "default": False,
                        "description": "Legacy parameter, ignored"
                    }
                },
                "required": []
            }
        )
    
    async def execute(self, arguments: dict) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
        use_vision = arguments.get("use_vision", True)  # Default to True
        
        try:
            results = []
            
            # ALWAYS capture screenshot - that's what users want
            # Take screenshot
            screenshot = ImageGrab.grab()
            
            # Convert to PNG bytes
            buffered = io.BytesIO()
            screenshot.save(buffered, format="PNG", optimize=True)
            
            # Encode to base64
            img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
            # Return image
            results.append(ImageContent(
                type="image",
                data=img_base64,
                mimeType="image/png"
            ))
            
            # Add text confirmation
            results.append(TextContent(
                type="text",
                text=f"Screenshot captured: {screenshot.size[0]}x{screenshot.size[1]} pixels"
            ))
            
            return results
            
        except Exception as e:
            error_msg = f"Screenshot failed: {str(e)}"
            return [TextContent(
                type="text",
                text=f"ERROR: {error_msg}"
            )]
