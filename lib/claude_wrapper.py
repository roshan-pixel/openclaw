"""
Claude Wrapper - Enhanced Anthropic API client for OpenClaw
"""
import logging
import json
from typing import List, Dict, Any, Optional
from anthropic import Anthropic
import anthropic

logger = logging.getLogger(__name__)


class ClaudeWrapper:
    """Wrapper for Claude API with OpenClaw enhancements."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "anthropic/claude-haiku-4-5"):
        # Load API key from .env if not provided
        if not api_key:
            api_key = self._load_api_key()
        
        self.client = Anthropic(api_key=api_key)
        self.model = model.replace("anthropic/", "")  # Remove prefix for API
        self.default_max_tokens = 4096
        
        logger.info(f"Claude Wrapper initialized with model: {self.model}")
    
    def _load_api_key(self) -> str:
        """Load API key from .env file or environment."""
        try:
            # Try loading from .env file
            from dotenv import load_dotenv
            import os
            
            # Load .env from openclaw root directory
            env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
            load_dotenv(env_path)
            
            api_key = os.environ.get("ANTHROPIC_API_KEY")
            if not api_key:
                raise ValueError(
                    "No API key found in .env file. Add: ANTHROPIC_API_KEY=your-key"
                )
            
            logger.info("[OK] API key loaded from .env file")
            return api_key
            
        except ImportError:
            raise ValueError("python-dotenv not installed. Run: pip install python-dotenv")
        except Exception as e:
            logger.error(f"Failed to load API key: {e}")
            raise
    
    def create_message(
        self,
        messages: List[Dict[str, Any]],
        tools: Optional[List[Dict[str, Any]]] = None,
        system: Optional[str] = None,
        max_tokens: Optional[int] = None,
        temperature: float = 1.0,
        **kwargs
    ) -> anthropic.types.Message:
        """
        Create a message with Claude API.
        
        Args:
            messages: Conversation history
            tools: Available tools in Claude format
            system: System prompt
            max_tokens: Max response tokens
            temperature: Sampling temperature
            **kwargs: Additional API parameters
        
        Returns:
            Claude API Message object
        """
        params = {
            "model": self.model,
            "max_tokens": max_tokens or self.default_max_tokens,
            "messages": messages,
            "temperature": temperature,
        }
        
        if tools:
            params["tools"] = tools
            logger.debug(f"Calling Claude with {len(tools)} tools available")
        
        if system:
            params["system"] = system
        
        # Merge additional parameters
        params.update(kwargs)
        
        logger.info(f"-> Calling Claude API ({self.model})")
        logger.debug(f"  Messages: {len(messages)}, Tools: {len(tools) if tools else 0}")
        
        try:
            response = self.client.messages.create(**params)
            
            logger.info(f"<- Response received: {response.stop_reason}")
            logger.debug(f"  Usage - Input: {response.usage.input_tokens}, Output: {response.usage.output_tokens}")
            
            return response
            
        except Exception as e:
            logger.error(f"Claude API error: {e}", exc_info=True)
            raise
    
    def extract_text(self, response: anthropic.types.Message) -> str:
        """Extract all text content from Claude's response."""
        text_parts = []
        for block in response.content:
            if block.type == "text":
                text_parts.append(block.text)
        return "\n".join(text_parts)
    
    def extract_tool_uses(self, response: anthropic.types.Message) -> List[Dict[str, Any]]:
        """
        Extract tool use blocks from Claude's response.
        
        Returns:
            List of dicts with 'id', 'name', and 'input'
        """
        tool_uses = []
        for block in response.content:
            if block.type == "tool_use":
                tool_uses.append({
                    "id": block.id,
                    "name": block.name,
                    "input": block.input
                })
        return tool_uses
    
    def format_tool_result(self, tool_use_id: str, content: str, is_error: bool = False) -> Dict[str, Any]:
        """Format a tool result for Claude."""
        result = {
            "type": "tool_result",
            "tool_use_id": tool_use_id,
            "content": content
        }
        
        if is_error:
            result["is_error"] = True
        
        return result


# Test function
def main():
    """Test the Claude Wrapper."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    try:
        # Try to initialize
        wrapper = ClaudeWrapper()
        print(f"\n{'='*60}")
        print(f"[OK] Claude Wrapper initialized successfully!")
        print(f"[OK] Model: {wrapper.model}")
        print(f"{'='*60}\n")
        
    except ValueError as e:
        print(f"\n{'='*60}")
        print(f"[!] API key not configured: {e}")
        print(f"{'='*60}")
        print("\nTo fix:")
        print("1. Install: pip install python-dotenv")
        print("2. Create .env file with: ANTHROPIC_API_KEY=your-key")
        print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
