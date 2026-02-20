"""
Shortcut Tool - Executes keyboard shortcuts
"""

import pyautogui
import time
from typing import Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from . import BaseTool
import sys
sys.path.append('..')
from utils.logger import get_logger

logger = get_logger("shortcut_tool")

class ShortcutTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:Shortcut",
            description="Executes keyboard shortcuts like 'ctrl+c', 'win+r', 'alt+f4'."
        )
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name=self.name,
            description=self.description,
            inputSchema={
                "type": "object",
                "properties": {
                    "shortcut": {
                        "type": "string",
                        "description": "Keyboard shortcut (e.g., 'ctrl+c', 'win+r')"
                    }
                },
                "required": ["shortcut"]
            }
        )
    
    async def execute(self, arguments: dict) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
        is_valid, error = self.validate_arguments(arguments, self.get_tool_definition().inputSchema)
        if not is_valid:
            return [TextContent(type="text", text=f"ERROR: {error}")]
        
        shortcut = arguments["shortcut"].lower().strip()
        
        try:
            keys = [k.strip() for k in shortcut.split('+')]
            key_mapping = {
                'ctrl': 'ctrl', 'control': 'ctrl', 'alt': 'alt', 'shift': 'shift',
                'win': 'win', 'windows': 'win', 'cmd': 'win', 'command': 'win'
            }
            
            normalized_keys = [key_mapping.get(key, key) for key in keys]
            
            if len(normalized_keys) == 1:
                pyautogui.press(normalized_keys[0])
            else:
                pyautogui.hotkey(*normalized_keys)
            
            time.sleep(0.1)
            result_text = f"Executed: {' + '.join(normalized_keys)}"
            logger.info(result_text)
            return [TextContent(type="text", text=result_text)]
            
        except Exception as e:
            logger.error(f"Shortcut failed: {e}", exc_info=True)
            return [TextContent(type="text", text=f"ERROR: {str(e)}")]
