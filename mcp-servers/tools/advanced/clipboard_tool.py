"""
Clipboard Tool - Advanced clipboard operations
"""

import pyperclip
from typing import Any, Sequence
from mcp.types import Tool, TextContent

class ClipboardTool:
    """Advanced clipboard operations"""
    
    requires_admin = False
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name="Windows-MCP:Clipboard",
            description="Read from and write to Windows clipboard. Supports text content.",
            inputSchema={
                "type": "object",
                "properties": {
                    "action": {
                        "type": "string",
                        "enum": ["read", "write", "clear"],
                        "description": "Clipboard operation"
                    },
                    "text": {
                        "type": "string",
                        "description": "Text to write to clipboard (for write action)"
                    }
                },
                "required": ["action"]
            }
        )
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        """Execute clipboard operation"""
        action = arguments.get("action")
        
        try:
            if action == "read":
                content = pyperclip.paste()
                return [TextContent(
                    type="text",
                    text=f"✓ Clipboard content:\n{content}"
                )]
            
            elif action == "write":
                text = arguments.get("text", "")
                pyperclip.copy(text)
                return [TextContent(
                    type="text",
                    text=f"✓ Text written to clipboard:\n{text[:100]}{'...' if len(text) > 100 else ''}"
                )]
            
            elif action == "clear":
                pyperclip.copy("")
                return [TextContent(
                    type="text",
                    text="✓ Clipboard cleared"
                )]
        
        except Exception as e:
            return [TextContent(
                type="text",
                text=f"✗ Clipboard operation failed: {str(e)}"
            )]
