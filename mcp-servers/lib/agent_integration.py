"""
Agent Integration - Combines all enhancement modules into a unified system
"""
import asyncio
import logging
import json
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional, Callable

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from lib.conversation_manager import ConversationManager
from lib.agent_orchestrator import AgentOrchestrator, Task, Workflow
from lib.error_recovery import ErrorRecoveryManager
from lib.performance_optimizer import PerformanceOptimizer

logger = logging.getLogger(__name__)


class EnhancedAgent:
    """
    Enhanced AI Agent with:
    - Multi-turn conversation memory
    - Task decomposition and orchestration
    - Intelligent error recovery
    - Performance optimization (caching, rate limiting)
    """
    
    def __init__(
        self,
        tool_executor: Callable,
        config_path: str = "config/agent_config.json"
    ):
        """
        Initialize the enhanced agent.
        
        Args:
            tool_executor: Async function to execute tools (tool_name, arguments) -> result
            config_path: Path to configuration file
        """
        self.tool_executor = tool_executor
        self.config = self._load_config(config_path)
        
        # Initialize all managers
        self._init_managers()
        
        logger.info("EnhancedAgent initialized successfully")
    
    def _load_config(self, config_path: str) -> Dict[str, Any]:
        """Load configuration from file."""
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
            logger.info(f"Loaded configuration from {config_path}")
            return config
        except FileNotFoundError:
            logger.warning(f"Config file not found: {config_path}, using defaults")
            return self._default_config()
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in config: {e}, using defaults")
            return self._default_config()
    
    def _default_config(self) -> Dict[str, Any]:
        """Return default configuration."""
        return {
            "conversation": {
                "storage_dir": "conversations",
                "max_sessions": 100,
                "session_timeout_hours": 24,
                # Keep context budget small to prevent screenshot-heavy histories
                # from flooding the LLM with tokens.
                "context_max_tokens": 8000
            },
            "orchestrator": {
                "max_parallel_tasks": 5,
                "max_retries": 3
            },
            "error_recovery": {
                "allow_fallback": True,
                "allow_partial_success": True
            },
            "performance": {
                "cache_ttl_seconds": 300,
                "rate_limit_per_second": 10.0,
                "max_concurrent_executions": 5
            }
        }
    
    def _init_managers(self):
        """Initialize all component managers."""
        # Conversation Manager
        conv_config = self.config.get("conversation", {})
        self.conversation_manager = ConversationManager(
            storage_dir=conv_config.get("storage_dir", "conversations"),
            max_sessions=conv_config.get("max_sessions", 100)
        )
        
        # Performance Optimizer (wraps tool executor)
        perf_config = self.config.get("performance", {})
        self.performance_optimizer = PerformanceOptimizer(
            tool_executor=self.tool_executor,
            cache_ttl=perf_config.get("cache_ttl_seconds", 300),
            max_cache_size=perf_config.get("max_cache_size", 1000),
            rate_limit_per_second=perf_config.get("rate_limit_per_second", 10.0),
            max_concurrent=perf_config.get("max_concurrent_executions", 5)
        )
        
        # Error Recovery Manager (uses performance optimizer)
        self.error_recovery = ErrorRecoveryManager(
            tool_executor=self._optimized_tool_executor
        )
        
        # Agent Orchestrator (uses error recovery)
        orch_config = self.config.get("orchestrator", {})
        self.orchestrator = AgentOrchestrator(
            tool_executor=self._recovered_tool_executor,
            max_parallel=orch_config.get("max_parallel_tasks", 5)
        )
        
        logger.info("All managers initialized")
    
    async def _optimized_tool_executor(self, tool_name: str, arguments: Dict[str, Any]) -> Any:
        """Tool executor wrapped with performance optimization."""
        result = await self.performance_optimizer.execute(tool_name, arguments)
        
        if result["success"]:
            return result["result"]
        else:
            raise Exception(result.get("error", "Unknown error"))
    
    async def _recovered_tool_executor(self, tool_name: str, arguments: Dict[str, Any]) -> Any:
        """Tool executor wrapped with error recovery."""
        recovery_config = self.config.get("error_recovery", {})
        
        result = await self.error_recovery.execute_with_recovery(
            tool_name=tool_name,
            arguments=arguments,
            max_retries=recovery_config.get("max_retries", 3),
            allow_fallback=recovery_config.get("allow_fallback", True),
            allow_partial=recovery_config.get("allow_partial_success", True)
        )
        
        if result["success"]:
            return result["result"]
        else:
            raise Exception(result.get("error", "Tool execution failed"))
    
    async def execute_task(
        self,
        task: str,
        session_id: Optional[str] = None,
        decompose: bool = True,
        context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Execute a task with full enhancement features.
        
        Args:
            task: Task description (natural language)
            session_id: Conversation session ID (creates new if None)
            decompose: Whether to decompose complex tasks
            context: Additional context
            
        Returns:
            Dictionary with execution results and metadata
        """
        # Create or get session
        if session_id is None:
            session_id = self.conversation_manager.create_session(
                metadata={"created_by": "enhanced_agent"}
            )
        
        # Add user message to conversation
        self.conversation_manager.add_message(session_id, "user", task)
        
        logger.info(f"Executing task in session {session_id}: {task[:50]}...")
        
        try:
            if decompose:
                # Decompose task into subtasks
                subtasks = self.orchestrator.decompose_task(task, context)
                
                if len(subtasks) > 1:
                    logger.info(f"Task decomposed into {len(subtasks)} subtasks")
                    
                    # Execute as workflow
                    workflow = await self.orchestrator.execute_workflow(
                        workflow_id=f"wf_{session_id}_{int(asyncio.get_event_loop().time())}",
                        tasks=subtasks,
                        timeout=300  # 5 minute timeout
                    )
                    
                    result = {
                        "success": not workflow.has_failures(),
                        "workflow": workflow.summary(),
                        "tasks": [task.to_dict() for task in workflow.tasks],
                        "decomposed": True
                    }
                else:
                    # Single task
                    subtask = subtasks[0]
                    result = await self._recovered_tool_executor(
                        subtask.tool_name,
                        subtask.arguments
                    )
                    result = {"success": True, "result": result, "decomposed": False}
            else:
                # Execute as single action (you'd integrate with Claude here)
                result = {"success": True, "message": "Direct execution not implemented"}
            
            # Add result to conversation
            self.conversation_manager.add_message(
                session_id,
                "assistant",
                result,
                tool_calls=[]
            )
            
            # Add session and performance stats
            result["session_id"] = session_id
            result["stats"] = self.get_stats()
            
            return result
            
        except Exception as e:
            logger.error(f"Task execution failed: {e}", exc_info=True)
            
            # Add error to conversation
            self.conversation_manager.add_message(
                session_id,
                "assistant",
                f"Error: {str(e)}"
            )
            
            return {
                "success": False,
                "error": str(e),
                "session_id": session_id
            }
    
    async def execute_with_conversation(
        self,
        message: str,
        session_id: str,
        max_context_tokens: int = None
    ) -> Dict[str, Any]:
        """
        Execute with full conversation context.
        
        Args:
            message: User message
            session_id: Session ID
            max_context_tokens: Maximum tokens for context
            
        Returns:
            Execution result with conversation context
        """
        # Get conversation history
        if max_context_tokens is None:
            max_context_tokens = self.config.get("conversation", {}).get("context_max_tokens", 8000)
        
        messages = self.conversation_manager.get_messages_for_api(
            session_id,
            max_tokens=max_context_tokens
        )
        
        logger.info(f"Executing with {len(messages)} messages of context")
        
        # Execute task
        return await self.execute_task(message, session_id, context={"messages": messages})
    
    def get_conversation_history(self, session_id: str) -> List[Dict[str, Any]]:
        """Get conversation history for a session."""
        return self.conversation_manager.get_messages_for_api(session_id)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get comprehensive statistics."""
        return {
            "conversations": {
                "active_sessions": len(self.conversation_manager.sessions),
                "sessions": self.conversation_manager.list_sessions()
            },
            "performance": self.performance_optimizer.get_stats(),
            "errors": self.error_recovery.get_error_summary(),
            "workflows": self.orchestrator.list_workflows()
        }
    
    async def shutdown(self):
        """Shutdown all managers gracefully."""
        logger.info("Shutting down EnhancedAgent...")
        await self.performance_optimizer.shutdown()
        logger.info("EnhancedAgent shutdown complete")


# Example usage
async def mock_tool_executor(tool_name: str, arguments: Dict[str, Any]) -> str:
    """Mock tool executor for testing."""
    await asyncio.sleep(0.2)
    logger.info(f"  Executed: {tool_name}({arguments})")
    return f"Success: {tool_name}"


async def main():
    """Test the enhanced agent."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    agent = EnhancedAgent(tool_executor=mock_tool_executor)
    
    print("\n" + "="*60)
    print("ENHANCED AGENT - INTEGRATION TEST")
    print("="*60)
    
    # Test 1: Simple task
    print("\nTest 1: Simple Task")
    result = await agent.execute_task("take a screenshot")
    print(f"Result: {result['success']}")
    
    # Test 2: Complex task with decomposition
    print("\nTest 2: Complex Task (Decomposed)")
    result = await agent.execute_task(
        "open chrome and search for weather and take a screenshot",
        decompose=True
    )
    print(f"Success: {result['success']}")
    print(f"Decomposed: {result.get('decomposed')}")
    if 'workflow' in result:
        print(f"Workflow: {result['workflow']}")
    
    # Test 3: Conversation context
    print("\nTest 3: With Conversation Context")
    session_id = agent.conversation_manager.create_session()
    
    await agent.execute_with_conversation("open notepad", session_id)
    await agent.execute_with_conversation("type hello world", session_id)
    result = await agent.execute_with_conversation("save the file", session_id)
    
    history = agent.get_conversation_history(session_id)
    print(f"Conversation has {len(history)} messages")
    
    # Show stats
    print("\n" + "="*60)
    print("STATISTICS")
    print("="*60)
    
    stats = agent.get_stats()
    print(f"\nActive Sessions: {stats['conversations']['active_sessions']}")
    print(f"Total Requests: {stats['performance']['total_requests']}")
    print(f"Cache Hit Rate: {stats['performance']['cache']['hit_rate']}")
    print(f"Total Errors: {stats['errors']['total_errors']}")
    
    await agent.shutdown()


if __name__ == "__main__":
    asyncio.run(main())
