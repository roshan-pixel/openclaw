"""
OpenClaw - AI Agent with MCP Integration
Main entry point
"""
import asyncio
import logging
import json
import sys
import os
from pathlib import Path

# Add lib directory to path
sys.path.insert(0, str(Path(__file__).parent))

from lib.claude_client import ClaudeClient
from lib.mcp_manager import MCPManager
from lib.agent_loop import AgentLoop


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class OpenClaw:
    """Main OpenClaw application."""
    
    def __init__(self):
        self.claude_client = None
        self.mcp_manager = None
        self.agent = None
        self.conversation_history = []
    
    async def initialize(self):
        """Initialize all components."""
        logger.info("="*60)
        logger.info("OPENCLAW - AI AGENT STARTING")
        logger.info("="*60)
        
        # Load environment variables from .env
        env_file = Path(__file__).parent.parent / '.env'
        if env_file.exists():
            with open(env_file) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        os.environ[key.strip()] = value.strip()
        
        # Load API configuration
        try:
            with open('config/api_config.json') as f:
                api_config = json.load(f)
            logger.info("✓ Loaded API configuration")
        except Exception as e:
            logger.error(f"Failed to load API config: {e}")
            raise
        
        # Get API key from environment
        api_key = os.environ.get('ANTHROPIC_API_KEY')
        if not api_key:
            logger.error("ANTHROPIC_API_KEY not found in .env file!")
            raise ValueError("Missing API key")
        
        # Initialize Claude client
        try:
            self.claude_client = ClaudeClient(
                api_key=api_key,
                model=api_config.get('model', 'claude-3-haiku-20240307')
            )
            logger.info(f"✓ Initialized Claude client (model: {api_config.get('model')})")
        except Exception as e:
            logger.error(f"Failed to initialize Claude client: {e}")
            raise
        
        # Initialize MCP Manager
        try:
            self.mcp_manager = MCPManager()
            await self.mcp_manager.initialize()
            logger.info("✓ Initialized MCP Manager")
            
            # Show available tools
            tools = self.mcp_manager.get_claude_tools()
            logger.info(f"✓ {len(tools)} tools available")
        except Exception as e:
            logger.error(f"Failed to initialize MCP Manager: {e}")
            raise
        
        # Initialize Agent Loop
        try:
            self.agent = AgentLoop(self.claude_client, self.mcp_manager)
            logger.info("✓ Initialized Agent Loop")
        except Exception as e:
            logger.error(f"Failed to initialize Agent Loop: {e}")
            raise
        
        logger.info("="*60)
        logger.info("OPENCLAW READY")
        logger.info("="*60)
    
    async def run_task(self, user_message: str, verbose: bool = True) -> str:
        """
        Run a single task.
        
        Args:
            user_message: User's request
            verbose: Show execution details
            
        Returns:
            Claude's final response
        """
        # Clean history: remove orphaned tool results and keep only valid messages
        cleaned_history = []
        skip_next_user = False
        
        for i, msg in enumerate(self.conversation_history):
            if msg['role'] == 'assistant':
                # Keep all assistant messages
                cleaned_history.append(msg)
                skip_next_user = False
            elif msg['role'] == 'user' and not skip_next_user:
                # Check if this is a tool_result message
                content = msg.get('content', [])
                if isinstance(content, list):
                    # Check if it contains tool_result
                    has_tool_result = any(
                        isinstance(c, dict) and c.get('type') == 'tool_result' 
                        for c in content
                    )
                    if has_tool_result:
                        # Only keep if previous message was assistant with tool_use
                        if cleaned_history and cleaned_history[-1]['role'] == 'assistant':
                            prev_content = cleaned_history[-1].get('content', [])
                            has_tool_use = any(
                                hasattr(c, 'type') and c.type == 'tool_use' or
                                isinstance(c, dict) and c.get('type') == 'tool_use'
                                for c in prev_content
                            )
                            if has_tool_use:
                                cleaned_history.append(msg)
                        # Skip if no matching tool_use
                    else:
                        # Regular user message
                        cleaned_history.append(msg)
                else:
                    # String content - regular user message
                    cleaned_history.append(msg)
        
        # Keep only last 10 messages (5 turns)
        self.conversation_history = cleaned_history[-10:]
        
        result = await self.agent.run(
            user_message=user_message,
            conversation_history=self.conversation_history.copy(),
            verbose=verbose
        )
        
        # Update conversation history (keep last 10 turns)
        self.conversation_history = result['messages'][-20:]  # Keep 10 turns (20 messages)
        
        return result['response']
    
    async def interactive_mode(self):
        """Run in interactive chat mode."""
        print("\n" + "="*60)
        print("OPENCLAW INTERACTIVE MODE")
        print("="*60)
        print("Type your requests. Commands:")
        print("  'quit' or 'exit' - Exit the program")
        print("  'clear' - Clear conversation history")
        print("  'tools' - List available tools")
        print("="*60 + "\n")
        
        while True:
            try:
                user_input = input("\nYou: ").strip()
                
                if not user_input:
                    continue
                
                if user_input.lower() in ['quit', 'exit']:
                    print("\nGoodbye!")
                    break
                
                if user_input.lower() == 'clear':
                    self.conversation_history.clear()
                    print("✓ Conversation history cleared.")
                    continue
                
                if user_input.lower() == 'tools':
                    tools = self.mcp_manager.get_claude_tools()
                    print(f"\nAvailable tools ({len(tools)}):")
                    for tool in tools:
                        print(f"  • {tool['name']}")
                        print(f"    {tool['description'][:60]}...")
                    continue
                
                # Run the task
                response = await self.run_task(user_input, verbose=True)
                
            except KeyboardInterrupt:
                print("\n\nInterrupted by user. Goodbye!")
                break
            except Exception as e:
                logger.error(f"Error in interactive mode: {e}", exc_info=True)
                print(f"\n❌ Error: {e}")
                
                # Auto-clear history on conversation errors
                if "tool_result" in str(e) or "tool_use" in str(e) or "invalid_request_error" in str(e):
                    self.conversation_history.clear()
                    print("⚠️  Conversation history cleared due to error. Please try again.")
    
    async def cleanup(self):
        """Clean up resources."""
        logger.info("Cleaning up...")
        if self.mcp_manager:
            await self.mcp_manager.close()
        logger.info("Cleanup complete")


async def main():
    """Main entry point."""
    openclaw = OpenClaw()
    
    try:
        # Initialize
        await openclaw.initialize()
        
        # Check command line arguments
        if len(sys.argv) > 1:
            # Single command mode
            command = " ".join(sys.argv[1:])
            print(f"\n{'='*60}")
            print(f"RUNNING COMMAND: {command}")
            print(f"{'='*60}\n")
            response = await openclaw.run_task(command, verbose=True)
        else:
            # Interactive mode
            await openclaw.interactive_mode()
    
    except KeyboardInterrupt:
        logger.info("Interrupted by user")
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        sys.exit(1)
    finally:
        await openclaw.cleanup()


if __name__ == "__main__":
    asyncio.run(main())
