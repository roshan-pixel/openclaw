"""
Agent Loop - Orchestrates the agentic workflow with tool execution
"""
import asyncio
import logging
from typing import List, Dict, Any, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from lib.claude_client import ClaudeClient
    from lib.mcp_manager import MCPManager

logger = logging.getLogger(__name__)


class AgentLoop:
    """
    Manages the agentic loop: prompt → Claude → tools → results → repeat
    """
    
    def __init__(self, claude_client, mcp_manager):
        self.claude = claude_client
        self.mcp = mcp_manager
        self.max_iterations = 25  # Prevent infinite loops
        self.system_prompt = (
            "You are a helpful AI assistant with access to Windows automation tools. "
            "You can control the computer, run commands, and help users accomplish tasks.\n\n"
            
            "CRITICAL RULES - ALWAYS FOLLOW:\n"
            "1. LOOK BEFORE YOU ACT: Before performing ANY action (click, type, etc), you MUST take a screenshot using Windows-MCP-Snapshot with use_vision=True to see the current state.\n"
            "2. VERIFY AFTER ACTIONS: After opening apps or performing actions, ALWAYS take another screenshot to verify success.\n"
            "3. USE REAL COORDINATES: Only click/type at coordinates you can SEE in the screenshot. Never guess coordinates.\n"
            "4. CHECK FOR ERRORS: If a screenshot shows something didn't work (app didn't open, wrong window, etc), acknowledge it and try a different approach.\n"
            "5. BE HONEST: If you can't see something clearly in a screenshot, say so. Don't pretend.\n\n"
            
            "WORKFLOW:\n"
            "Step 1: Take screenshot (Windows-MCP-Snapshot with use_vision=True)\n"
            "Step 2: Analyze what you see\n"
            "Step 3: Plan your action based on ACTUAL screen state\n"
            "Step 4: Execute action\n"
            "Step 5: Take screenshot again to verify\n"
            "Step 6: Confirm success or try alternative\n\n"
            
            "When a task is complete, provide a clear summary of what was accomplished."
        )
    
    async def run(
        self,
        user_message: str,
        conversation_history: Optional[List[Dict[str, Any]]] = None,
        verbose: bool = True
    ) -> Dict[str, Any]:
        """
        Run the agentic loop for a user message.
        
        Args:
            user_message: The user's request
            conversation_history: Previous messages (for context)
            verbose: Print progress to console
            
        Returns:
            Dictionary with 'response', 'iterations', 'tools_used', 'messages'
        """
        # Initialize conversation
        messages = conversation_history or []
        messages.append({"role": "user", "content": user_message})
        
        # Get available tools
        tools = self.mcp.get_claude_tools()
        
        # Tracking
        iterations = 0
        tools_used = []
        final_response = None
        
        if verbose:
            print(f"\n{'='*60}")
            print(f"USER: {user_message}")
            print(f"{'='*60}\n")
        
        # Agentic loop
        while iterations < self.max_iterations:
            iterations += 1
            
            if verbose:
                print(f"[Iteration {iterations}]")
            
            # Call Claude
            response = self.claude.create_message(
                messages=messages,
                tools=tools,
                system=self.system_prompt
            )
            
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
                
                if verbose:
                    thinking = self.claude.extract_text(response)
                    if thinking:
                        print(f"Claude's thinking: {thinking}\n")
                    print(f"Claude is using {len(tool_uses)} tool(s):")
                
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
                final_response = self.claude.extract_text(response) + "\n\n[Response truncated - max tokens reached]"
                break
            
            else:
                logger.error(f"Unexpected stop reason: {response.stop_reason}")
                break
        
        if iterations >= self.max_iterations:
            logger.warning("Hit maximum iterations")
            final_response = final_response or "Maximum iterations reached. Task may be incomplete."
        
        return {
            "response": final_response,
            "iterations": iterations,
            "tools_used": tools_used,
            "messages": messages
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
                print(f"  → {tool_name}")
                print(f"    Input: {tool_input}")
            
            try:
                # Execute via MCP
                result = await self.mcp.call_tool(tool_name, tool_input)
                
                # Extract result content
                if hasattr(result, 'content') and result.content:
                    result_text = result.content[0].text
                else:
                    result_text = str(result)
                
                if verbose:
                    print(f"    Result: {result_text[:100]}...")
                
                # Format for Claude
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": tool_id,
                    "content": result_text
                })
            
            except Exception as e:
                logger.error(f"Tool execution failed: {tool_name} - {e}")
                
                # Return error to Claude
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": tool_id,
                    "content": f"Error executing {tool_name}: {str(e)}",
                    "is_error": True
                })
                
                if verbose:
                    print(f"    ERROR: {e}")
        
        if verbose:
            print()
        
        return tool_results


# Example usage
async def main():
    """Test the Agent Loop."""
    import json
    import os
    import sys
    from pathlib import Path
    
    # Add parent directory to path for imports
    sys.path.insert(0, str(Path(__file__).parent.parent))
    
    from lib.claude_client import ClaudeClient
    from lib.mcp_manager import MCPManager
    
    # Load environment variables
    env_file = Path(__file__).parent.parent.parent / '.env'
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()
    
    # Load configuration
    config_path = Path(__file__).parent.parent / 'config' / 'api_config.json'
    with open(config_path) as f:
        api_config = json.load(f)
    
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    
    # Initialize components
    print("Initializing Claude Client...")
    claude_client = ClaudeClient(api_key=api_key, model=api_config.get('model'))
    
    print("Initializing MCP Manager...")
    mcp_manager = MCPManager()
    await mcp_manager.initialize()
    
    # Create agent
    print("Creating Agent Loop...\n")
    agent = AgentLoop(claude_client, mcp_manager)
    
    # Run a test task
    result = await agent.run(
        user_message="Take a screenshot and tell me what you see",
        verbose=True
    )
    
    print(f"\n{'='*60}")
    print("EXECUTION SUMMARY:")
    print(f"{'='*60}")
    print(f"Iterations: {result['iterations']}")
    print(f"Tools used: {', '.join(result['tools_used'])}")
    print(f"\nFinal response:\n{result['response']}")
    
    # Cleanup
    await mcp_manager.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
