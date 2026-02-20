"""
Window Tool - Window management operations
"""

from typing import Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from . import BaseTool
import sys
sys.path.append('..')
from utils.logger import get_logger
from utils.accessibility import get_window_list, get_active_window, focus_window_by_title

logger = get_logger("window_tool")

class WindowTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="Windows-MCP:Window",
            description="Manages windows: list, focus, or get active window."
        )
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name=self.name,
            description=self.description,
            inputSchema={
                "type": "object",
                "properties": {
                    "action": {
                        "type": "string",
                        "enum": ["list", "focus", "active"],
                        "description": "Action: 'list' all windows, 'focus' window by title, 'active' get current window"
                    },
                    "title": {
                        "type": "string",
                        "description": "Window title (partial match) for 'focus' action"
                    }
                },
                "required": ["action"]
            }
        )
    
    async def execute(self, arguments: dict) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
        is_valid, error = self.validate_arguments(arguments, self.get_tool_definition().inputSchema)
        if not is_valid:
            return [TextContent(type="text", text=f"ERROR: {error}")]
        
        action = arguments["action"]
        
        try:
            if action == "list":
                windows = get_window_list()
                result = f"Found {len(windows)} windows:\n"
                for i, win in enumerate(windows, 1):
                    result += f"{i}. {win['title']} ({win['width']}x{win['height']})\n"
                logger.info(f"Listed {len(windows)} windows")
                return [TextContent(type="text", text=result)]
                
            elif action == "active":
                active = get_active_window()
                result = f"Active: {active['title']}\nPosition: ({active['x']}, {active['y']})\nSize: {active['width']}x{active['height']}"
                logger.info(f"Got active window: {active['title']}")
                return [TextContent(type="text", text=result)]
                
            elif action == "focus":
                title = arguments.get("title")
                if not title:
                    return [TextContent(type="text", text="ERROR: 'title' required for focus action")]
                
                success = focus_window_by_title(title)
                if success:
                    logger.info(f"Focused window: {title}")
                    return [TextContent(type="text", text=f"Focused window: {title}")]
                else:
                    logger.warning(f"Window not found: {title}")
                    return [TextContent(type="text", text=f"ERROR: Window not found: {title}")]
                    
        except Exception as e:
            logger.error(f"Window operation failed: {e}", exc_info=True)
            return [TextContent(type="text", text=f"ERROR: {str(e)}")]
