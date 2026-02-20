"""
Base Tool Class - Foundation for all MCP tools with admin support
"""
from abc import ABC, abstractmethod
from typing import Any, Sequence
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource


class BaseTool(ABC):
    """Abstract base class for all tools with GodMode support."""
    
    requires_admin = False  # Override to True in subclasses that need admin privileges
    
    @abstractmethod
    def get_tool_definition(self) -> Tool:
        """Return the MCP tool definition."""
        pass
    
    @abstractmethod
    async def execute(self, arguments: dict) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
        """Execute the tool with given arguments."""
        pass
    
    def validate_arguments(self, arguments: dict, required: list) -> None:
        """
        Validate that required arguments are present.
        
        Args:
            arguments: Dictionary of provided arguments
            required: List of required argument names
            
        Raises:
            ValueError: If a required argument is missing
        """
        for arg in required:
            if arg not in arguments:
                raise ValueError(f"Missing required argument: {arg}")
