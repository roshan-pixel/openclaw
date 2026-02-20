"""
Enhanced Agent - Advanced agentic loop for OpenClaw
Orchestrates Claude + MCP tools for multi-step task execution
"""
import asyncio
import logging
import json
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from lib.claude_wrapper import ClaudeWrapper
from lib.mcp_tools_manager import MCPToolsManager

logger = logging.getLogger(__name__)


class EnhancedAgent:
    """
    Advanced agentic system that orchestrates Claude and MCP tools.
    Handles multi-step workflows with tool execution.
    """
    
    def __init__(self, config_path: str = "config/agent_config.json"):
        self.config_path = config_path
        self.config = self._load_config()
        
        # Initialize components
        self.claude = None
        self.mcp = None
        
        # Agent state
        self.conversation_history: List[Dict[str, Any]] = []
        self.max_iterations = self.config['agent']['max_iterations']
        self.system_prompt = self.config['claude']['system_prompt']
        
        logger.info("Enhanced Agent initialized")
    
    def _load_config(self) -> Dict[str, Any]:
        """Load agent configuration."""
        config_file = Path(self.config_path)
        if not config_file.exists():
            raise FileNotFoundError(f"Config not found: {self.config_path}")
        
        with open(config_file, 'r') as f:
            return json.load(f)
    
    async def initialize(self):
        """Initialize Claude client and MCP manager."""
        logger.info("="*60)
        logger.info("INITIALIZING ENHANCED AGENT")
        logger.info("="*60)
        
        # Initialize Claude
        logger.info("Initializing Claude client...")
        self.claude = ClaudeWrapper(
            model=self.config['claude']['model']
        )
        logger.info("[OK] Claude client ready")
        
        # Initialize MCP
        logger.info("\nInitializing MCP Tools Manager...")
        self.mcp = MCPToolsManager(
            config_path=self.config['mcp']['config_path']
        )
        await self.mcp.initialize()
        
        logger.info("\n" + "="*60)
        logger.info("[OK] ENHANCED AGENT READY")
        logger.info("="*60)
        
        return self
    
    async def run(
        self,
        user_message: str,
        verbose: bool = True
    ) -> Dict[str, Any]:
        """
        Run the agentic loop for a user request.
        
        Args:
            user_message: User's request
            verbose: Print progress to console
            
        Returns:
            Dict with 'response', 'iterations', 'tools_used', 'messages'
        """
        if verbose:
            print(f"\n{'='*60}")
            print(f"USER: {user_message}")
            print(f"{'='*60}\n")
        
        # Add user message to conversation
        messages = self.conversation_history.copy()
        messages.append({"role": "user", "content": user_message})
        
        # Get available tools
        tools = self.mcp.get_tools_for_claude()
        
        # Tracking
        iterations = 0
        tools_used = []
        final_response = None
        
        # Agentic loop
        while iterations < self.max_iterations:
            iterations += 1
            
            if verbose:
                print(f"[Iteration {iterations}]")
            
            # Call Claude
            try:
                response = self.claude.create_message(
                    messages=messages,
                    tools=tools,
                    system=self.system_prompt,
                    max_tokens=self.config['claude']['max_tokens'],
                    temperature=self.config['claude']['temperature']
                )
            except Exception as e:
                logger.error(f"Claude API error: {e}", exc_info=True)
                return {
                    "response": f"Error calling Claude: {str(e)}",
                    "iterations": iterations,
                    "tools_used": tools_used,
                    "messages": messages,
                    "error": True
                }
            
            # Check stop reason
            if response.stop_reason == "end_turn":
                # Task completed
                final_response = self.claude.extract_text(response)
                if verbose:
                    print(f"\n{'='*60}")
                    print(f"CLAUDE: {final_response}")
                    print(f"{'='*60}\n")
                break
            
            elif response.stop_reason == "tool_use":
                # Claude wants to use tools
                tool_uses = self.claude.extract_tool_uses(response)
                
                # Show Claude's thinking
                thinking = self.claude.extract_text(response)
                if verbose and thinking:
                    print(f"Thinking: {thinking}\n")
                
                if verbose:
                    print(f"Using {len(tool_uses)} tool(s):")
                
                # Add Claude's response to conversation
                messages.append({
                    "role": "assistant",
                    "content": response.content
                })
                
                # Execute all tools
                tool_results = await self._execute_tools(tool_uses, verbose)
                tools_used.extend([tu["name"] for tu in tool_uses])
                
                # Add tool results to conversation
                messages.append({
                    "role": "user",
                    "content": tool_results
                })
            
            elif response.stop_reason == "max_tokens":
                logger.warning("Hit max tokens limit")
                final_response = self.claude.extract_text(response)
                final_response += "\n\n[Response truncated - max tokens reached]"
                break
            
            else:
                logger.error(f"Unexpected stop reason: {response.stop_reason}")
                final_response = self.claude.extract_text(response) or "Unexpected response from Claude"
                break
        
        # Check if we hit max iterations
        if iterations >= self.max_iterations:
            logger.warning("Hit maximum iterations")
            final_response = final_response or "Maximum iterations reached. Task may be incomplete."
        
        # Update conversation history (keep last 20 messages)
        self.conversation_history = messages[-20:]
        
        return {
            "response": final_response,
            "iterations": iterations,
            "tools_used": tools_used,
            "messages": messages,
            "error": False
        }
    
    async def _execute_tools(
        self,
        tool_uses: List[Dict[str, Any]],
        verbose: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Execute a list of tool calls via MCP.
        
        Args:
            tool_uses: List of tool use dictionaries
            verbose: Print execution details
            
        Returns:
            List of tool result dictionaries for Claude
        """
        tool_results = []
        
        for tool_use in tool_uses:
            tool_name = tool_use["name"]
            tool_input = tool_use["input"]
            tool_id = tool_use["id"]
            
            if verbose:
                print(f"  -> {tool_name}")
                input_str = json.dumps(tool_input, indent=2)
                if len(input_str) > 100:
                    input_str = input_str[:100] + "..."
                print(f"    Input: {input_str}")
            
            try:
                # Execute via MCP
                result = await self.mcp.execute_tool(tool_name, tool_input)
                
                # Extract result content
                if hasattr(result, 'content') and result.content:
                    result_text = result.content[0].text
                else:
                    result_text = str(result)
                
                if verbose:
                    display_result = result_text[:200] + "..." if len(result_text) > 200 else result_text
                    print(f"    Result: {display_result}")
                
                # Format for Claude
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": tool_id,
                    "content": result_text
                })
            
            except Exception as e:
                logger.error(f"Tool execution failed: {tool_name} - {e}", exc_info=True)
                
                # Return error to Claude
                error_msg = f"Error executing {tool_name}: {str(e)}"
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": tool_id,
                    "content": error_msg,
                    "is_error": True
                })
                
                if verbose:
                    print(f"    ERROR: {e}")
        
        if verbose:
            print()
        
        return tool_results
    
    def clear_history(self):
        """Clear conversation history."""
        self.conversation_history.clear()
        logger.info("Conversation history cleared")
    
    async def close(self):
        """Clean up resources."""
        if self.mcp:
            await self.mcp.close()
        logger.info("Enhanced Agent closed")


# Test function
async def main():
    """Test the Enhanced Agent."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    try:
        # Initialize agent
        agent = EnhancedAgent()
        await agent.initialize()
        
        # Test with a simple task
        print("\n" + "="*60)
        print("TESTING ENHANCED AGENT")
        print("="*60)
        
        result = await agent.run(
            user_message="List all available tools you have access to",
            verbose=True
        )
        
        print("\n" + "="*60)
        print("EXECUTION SUMMARY")
        print("="*60)
        print(f"Iterations: {result['iterations']}")
        print(f"Tools used: {result['tools_used']}")
        
        # Cleanup
        await agent.close()
        
    except Exception as e:
        logger.error(f"Test failed: {e}", exc_info=True)


if __name__ == "__main__":
    asyncio.run(main())
