"""
CLI Agent - Interactive command-line interface for OpenClaw Enhanced Agent
"""
import asyncio
import logging
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from lib.enhanced_agent import EnhancedAgent


class CLIAgent:
    """Interactive CLI for OpenClaw Enhanced Agent."""
    
    def __init__(self):
        self.agent = None
        self.running = True
        
    async def initialize(self):
        """Initialize the agent."""
        print("\n" + "="*60)
        print("OPENCLAW ENHANCED AGENT - CLI MODE")
        print("="*60)
        
        self.agent = EnhancedAgent()
        await self.agent.initialize()
        
        return self
    
    async def run_interactive(self):
        """Run interactive CLI mode."""
        print("\n" + "="*60)
        print("Interactive Mode Ready!")
        print("="*60)
        print("\nCommands:")
        print("  • Type your request to execute tasks")
        print("  • 'clear' - Clear conversation history")
        print("  • 'tools' - List available tools")
        print("  • 'help' - Show this help")
        print("  • 'exit' or 'quit' - Exit the program")
        print("="*60 + "\n")
        
        while self.running:
            try:
                # Get user input
                user_input = input("\n🤖 OpenClaw> ").strip()
                
                if not user_input:
                    continue
                
                # Handle commands
                if user_input.lower() in ['exit', 'quit', 'q']:
                    print("\n👋 Goodbye!")
                    self.running = False
                    break
                
                elif user_input.lower() == 'clear':
                    self.agent.clear_history()
                    print("✓ Conversation history cleared")
                    continue
                
                elif user_input.lower() == 'tools':
                    self._show_tools()
                    continue
                
                elif user_input.lower() == 'help':
                    self._show_help()
                    continue
                
                # Execute the request
                result = await self.agent.run(
                    user_message=user_input,
                    verbose=True
                )
                
                # Show summary
                if result.get('error'):
                    print(f"\n❌ Error: {result['response']}")
                else:
                    print(f"\n📊 Summary: {result['iterations']} iteration(s), {len(result['tools_used'])} tool(s) used")
                    if result['tools_used']:
                        print(f"   Tools: {', '.join(set(result['tools_used']))}")
                
            except KeyboardInterrupt:
                print("\n\n👋 Interrupted. Goodbye!")
                self.running = False
                break
            
            except Exception as e:
                print(f"\n❌ Error: {e}")
                logging.error(f"CLI error: {e}", exc_info=True)
    
    def _show_tools(self):
        """Display available tools."""
        if not self.agent or not self.agent.mcp:
            print("❌ Agent not initialized")
            return
        
        tools = self.agent.mcp.get_tools_for_claude()
        print(f"\n{'='*60}")
        print(f"AVAILABLE TOOLS ({len(tools)})")
        print("="*60)
        
        for i, tool in enumerate(tools, 1):
            print(f"\n{i}. {tool['name']}")
            print(f"   {tool['description'][:80]}...")
    
    def _show_help(self):
        """Show help information."""
        print("\n" + "="*60)
        print("OPENCLAW ENHANCED AGENT - HELP")
        print("="*60)
        print("\nCommands:")
        print("  clear  - Clear conversation history")
        print("  tools  - List all available tools")
        print("  help   - Show this help message")
        print("  exit   - Exit the program (or Ctrl+C)")
        print("\nExamples:")
        print("  • Take a screenshot")
        print("  • Open Notepad and type Hello World")
        print("  • Show me what's on my screen")
        print("  • Search for Python in Start Menu")
        print("="*60)
    
    async def cleanup(self):
        """Clean up resources."""
        if self.agent:
            await self.agent.close()


async def main():
    """Main entry point."""
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('logs/agent.log'),
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Create and run CLI
    cli = CLIAgent()
    
    try:
        await cli.initialize()
        await cli.run_interactive()
    except Exception as e:
        logging.error(f"Fatal error: {e}", exc_info=True)
        print(f"\n❌ Fatal error: {e}")
    finally:
        await cli.cleanup()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")
