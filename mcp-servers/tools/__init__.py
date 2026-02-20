"""
Tool modules for Windows MCP Server
"""

from abc import ABC, abstractmethod
from typing import Sequence, Tuple
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource


class BaseTool(ABC):
    """
    Base class for all MCP tools
    """
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description

    @abstractmethod
    def get_tool_definition(self) -> Tool:
        """
        Returns the MCP tool definition
        """
        pass

    @abstractmethod
    async def execute(self, arguments: dict) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
        """
        Executes the tool with given arguments
        """
        pass

    def validate_arguments(self, arguments: dict, schema: dict) -> Tuple[bool, str]:
        """
        Validate arguments against schema
        Returns (is_valid, error_message)
        """
        required = schema.get("required", [])
        properties = schema.get("properties", {})
        
        # Check required fields
        for field in required:
            if field not in arguments:
                return False, f"Missing required argument: {field}"
        
        # Check types (basic validation)
        for key, value in arguments.items():
            if key in properties:
                prop = properties[key]
                expected_type = prop.get("type")
                
                if expected_type == "string" and not isinstance(value, str):
                    return False, f"Argument '{key}' must be a string"
                elif expected_type == "integer" and not isinstance(value, int):
                    return False, f"Argument '{key}' must be an integer"
                elif expected_type == "number" and not isinstance(value, (int, float)):
                    return False, f"Argument '{key}' must be a number"
        
        return True, ""


# Import all tool classes (12 tools only)
from .click_tool import ClickTool
from .type_tool import TypeTool
from .scroll_tool import ScrollTool
from .move_tool import MoveTool
from .shortcut_tool import ShortcutTool
from .app_tool import AppTool
from .shell_tool import ShellTool
from .snapshot_tool import SnapshotTool
from .wait_tool import WaitTool
from .scrape_tool import ScrapeTool
from .multiselect_tool import MultiSelectTool
from .multiedit_tool import MultiEditTool

__all__ = [
    'BaseTool',
    'ClickTool',
    'TypeTool',
    'ScrollTool',
    'MoveTool',
    'ShortcutTool',
    'AppTool',
    'ShellTool',
    'SnapshotTool',
    'WaitTool',
    'ScrapeTool',
    'MultiSelectTool',
    'MultiEditTool',
]
