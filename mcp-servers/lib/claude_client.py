"""
Claude Client - Wrapper for Anthropic API with tool support
"""
import logging
from typing import List, Dict, Any, Optional
import anthropic

logger = logging.getLogger(__name__)


class ClaudeClient:
    """Wrapper for Claude API with enhanced tool support."""
    
    def __init__(self, api_key: str, model: str = "claude-haiku-4-20250514"):
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = model
        self.default_max_tokens = 4096
        
    def create_message(
        self,
        messages: List[Dict[str, Any]],
        tools: Optional[List[Dict[str, Any]]] = None,
        max_tokens: Optional[int] = None,
        system: Optional[str] = None,
        **kwargs
    ) -> anthropic.types.Message:
        """
        Create a message with the Claude API.
        
        Args:
            messages: Conversation history in Messages API format
            tools: List of available tools in Claude API format
            max_tokens: Maximum tokens for response (default: 4096)
            system: System prompt
            **kwargs: Additional parameters for the API
            
        Returns:
            Message object from Claude
        """
        params = {
            "model": self.model,
            "max_tokens": max_tokens or self.default_max_tokens,
            "messages": messages,
        }
        
        if tools:
            params["tools"] = tools
            logger.debug(f"Calling Claude with {len(tools)} tools available")
        
        if system:
            params["system"] = system
        
        # Merge any additional parameters
        params.update(kwargs)
        
        logger.info(f"Sending request to Claude ({self.model})")
        logger.debug(f"  Messages: {len(messages)}")
        logger.debug(f"  Tools: {len(tools) if tools else 0}")
        
        response = self.client.messages.create(**params)
        
        logger.info(f"Received response: {response.stop_reason}")
        logger.debug(f"  Usage: {response.usage}")
        
        return response
    
    def extract_text(self, response: anthropic.types.Message) -> str:
        """Extract text content from a Claude response."""
        text_parts = []
        for block in response.content:
            if block.type == "text":
                text_parts.append(block.text)
        return "\n".join(text_parts)
    
    def extract_tool_uses(self, response: anthropic.types.Message) -> List[Dict[str, Any]]:
        """
        Extract tool use blocks from a Claude response.
        
        Returns:
            List of tool use dictionaries with 'id', 'name', and 'input'
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


# Example usage
def main():
    """Test the Claude Client."""
    import json
    import os
    from pathlib import Path
    
    # Load environment variables from .env
    env_file = Path(__file__).parent.parent.parent / '.env'
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()
    
    # Load API configuration
    with open('config/api_config.json') as f:
        config = json.load(f)
    
    # Get API key from environment
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY not found in .env file!")
        return
    
    client = ClaudeClient(api_key=api_key, model=config.get('model'))
    
    # Simple test message
    print(f"Testing Claude Client with model: {config.get('model')}")
    response = client.create_message(
        messages=[
            {"role": "user", "content": "Hello! Respond with just 'Hi!' to confirm you're working."}
        ]
    )
    
    print(f"\nClaude's response:")
    print(client.extract_text(response))
    print(f"\nStop reason: {response.stop_reason}")
    print(f"Model used: {response.model}")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
