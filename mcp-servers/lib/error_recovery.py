"""
Error Recovery - Intelligent fallbacks, partial success handling, and rollback mechanisms
"""
import logging
import asyncio
from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime

logger = logging.getLogger(__name__)


class RecoveryStrategy(Enum):
    """Error recovery strategies."""
    RETRY = "retry"
    FALLBACK = "fallback"
    SKIP = "skip"
    ROLLBACK = "rollback"
    ABORT = "abort"


@dataclass
class ErrorContext:
    """Context information about an error."""
    tool_name: str
    arguments: Dict[str, Any]
    error_message: str
    error_type: str
    timestamp: float = field(default_factory=lambda: datetime.now().timestamp())
    retry_count: int = 0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "tool_name": self.tool_name,
            "arguments": self.arguments,
            "error_message": self.error_message,
            "error_type": self.error_type,
            "timestamp": self.timestamp,
            "retry_count": self.retry_count
        }


@dataclass
class RecoveryAction:
    """Represents a recovery action."""
    strategy: RecoveryStrategy
    alternative_tool: Optional[str] = None
    alternative_args: Optional[Dict[str, Any]] = None
    rollback_actions: List[Dict[str, Any]] = field(default_factory=list)
    message: str = ""


class ErrorRecoveryManager:
    """Manages error recovery with intelligent fallbacks and rollback mechanisms."""
    
    def __init__(self, tool_executor: Callable):
        """
        Initialize the error recovery manager.
        
        Args:
            tool_executor: Async function to execute tools (tool_name, arguments) -> result
        """
        self.tool_executor = tool_executor
        self.error_history: List[ErrorContext] = []
        self.rollback_stack: List[Dict[str, Any]] = []
        
        # Define fallback mappings: primary_tool -> fallback_tools
        self.fallback_map = {
            "browser": ["shell", "app"],
            "chrome_search": ["edge_search", "shell"],
            "type": ["clipboard", "shell"],
            "click": ["shell", "shortcut"],
            "file_ops": ["shell"],
            "app": ["shell"],
        }
        
        # Define tool equivalents for different browsers/apps
        self.tool_equivalents = {
            "browser": {
                "chrome": ["brave", "edge", "firefox"],
                "brave": ["chrome", "edge", "firefox"],
            },
            "shell": {
                "cmd": ["powershell", "bash"],
                "powershell": ["cmd"],
            }
        }
        
        logger.info("ErrorRecoveryManager initialized")
    
    async def execute_with_recovery(
        self,
        tool_name: str,
        arguments: Dict[str, Any],
        max_retries: int = 3,
        allow_fallback: bool = True,
        allow_partial: bool = True
    ) -> Dict[str, Any]:
        """
        Execute a tool with automatic error recovery.
        
        Args:
            tool_name: Name of the tool to execute
            arguments: Tool arguments
            max_retries: Maximum retry attempts
            allow_fallback: Allow fallback to alternative tools
            allow_partial: Allow partial success
            
        Returns:
            Dictionary with 'success', 'result', 'strategy_used', 'error' keys
        """
        original_tool = tool_name
        retry_count = 0
        
        while retry_count <= max_retries:
            try:
                logger.info(f"Executing {tool_name} (attempt {retry_count + 1}/{max_retries + 1})")
                
                result = await self.tool_executor(tool_name, arguments)
                
                # Success
                logger.info(f"✓ {tool_name} succeeded")
                return {
                    "success": True,
                    "result": result,
                    "strategy_used": "direct" if retry_count == 0 else "retry",
                    "retry_count": retry_count,
                    "error": None
                }
                
            except Exception as e:
                error_ctx = ErrorContext(
                    tool_name=tool_name,
                    arguments=arguments,
                    error_message=str(e),
                    error_type=type(e).__name__,
                    retry_count=retry_count
                )
                self.error_history.append(error_ctx)
                
                logger.warning(f"✗ {tool_name} failed: {e}")
                
                # Determine recovery strategy
                recovery = self._determine_recovery_strategy(error_ctx, allow_fallback, allow_partial)
                
                if recovery.strategy == RecoveryStrategy.RETRY:
                    retry_count += 1
                    await asyncio.sleep(1.0 * (2 ** retry_count))  # Exponential backoff
                    continue
                
                elif recovery.strategy == RecoveryStrategy.FALLBACK:
                    if recovery.alternative_tool:
                        logger.info(f"↻ Trying fallback: {recovery.alternative_tool}")
                        tool_name = recovery.alternative_tool
                        arguments = recovery.alternative_args or arguments
                        retry_count = 0  # Reset retry count for fallback tool
                        continue
                
                elif recovery.strategy == RecoveryStrategy.SKIP:
                    logger.warning(f"⊘ Skipping {tool_name}: {recovery.message}")
                    return {
                        "success": False,
                        "result": None,
                        "strategy_used": "skip",
                        "error": str(e),
                        "skipped": True
                    }
                
                elif recovery.strategy == RecoveryStrategy.ROLLBACK:
                    logger.warning(f"↶ Rolling back due to {tool_name} failure")
                    await self._execute_rollback(recovery.rollback_actions)
                    return {
                        "success": False,
                        "result": None,
                        "strategy_used": "rollback",
                        "error": str(e),
                        "rolled_back": True
                    }
                
                elif recovery.strategy == RecoveryStrategy.ABORT:
                    logger.error(f"⊗ Aborting due to critical failure in {tool_name}")
                    return {
                        "success": False,
                        "result": None,
                        "strategy_used": "abort",
                        "error": str(e),
                        "aborted": True
                    }
        
        # Max retries exceeded
        logger.error(f"✗ {original_tool} failed after {max_retries} retries")
        return {
            "success": False,
            "result": None,
            "strategy_used": "max_retries_exceeded",
            "error": f"Max retries ({max_retries}) exceeded",
            "retry_count": retry_count
        }
    
    def _determine_recovery_strategy(
        self,
        error_ctx: ErrorContext,
        allow_fallback: bool,
        allow_partial: bool
    ) -> RecoveryAction:
        """Determine the best recovery strategy for an error."""
        
        # Check error patterns
        error_msg = error_ctx.error_message.lower()
        
        # Critical errors - abort immediately
        if any(keyword in error_msg for keyword in ["permission denied", "access denied", "unauthorized"]):
            return RecoveryAction(
                strategy=RecoveryStrategy.ABORT,
                message="Critical permission error"
            )
        
        # Temporary/network errors - retry
        if any(keyword in error_msg for keyword in ["timeout", "connection", "network", "unreachable"]):
            if error_ctx.retry_count < 2:
                return RecoveryAction(
                    strategy=RecoveryStrategy.RETRY,
                    message="Temporary error, retrying"
                )
        
        # Tool not found or not available - try fallback
        if any(keyword in error_msg for keyword in ["not found", "cannot find", "not available", "no tab is connected"]):
            if allow_fallback:
                fallback = self._get_fallback_tool(error_ctx.tool_name, error_ctx.arguments)
                if fallback:
                    return fallback
        
        # Non-critical errors with partial success allowed - skip
        if allow_partial and error_ctx.retry_count >= 1:
            return RecoveryAction(
                strategy=RecoveryStrategy.SKIP,
                message="Non-critical error, continuing workflow"
            )
        
        # Default: retry if haven't tried much
        if error_ctx.retry_count < 2:
            return RecoveryAction(
                strategy=RecoveryStrategy.RETRY,
                message="Retrying operation"
            )
        
        # Give up
        return RecoveryAction(
            strategy=RecoveryStrategy.SKIP,
            message="Max recovery attempts reached"
        )
    
    def _get_fallback_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Optional[RecoveryAction]:
        """Get fallback tool for a failed tool."""
        
        # Check if tool has defined fallbacks
        if tool_name in self.fallback_map:
            fallback_tools = self.fallback_map[tool_name]
            
            for fallback_tool in fallback_tools:
                # Adapt arguments for fallback tool
                adapted_args = self._adapt_arguments(tool_name, fallback_tool, arguments)
                
                return RecoveryAction(
                    strategy=RecoveryStrategy.FALLBACK,
                    alternative_tool=fallback_tool,
                    alternative_args=adapted_args,
                    message=f"Using {fallback_tool} as fallback"
                )
        
        return None
    
    def _adapt_arguments(
        self,
        source_tool: str,
        target_tool: str,
        arguments: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Adapt arguments from source tool to target tool format."""
        
        # Browser -> Shell conversion
        if source_tool == "browser" and target_tool == "shell":
            if "url" in arguments:
                return {"command": f"start chrome {arguments['url']}"}
            else:
                return {"command": "start chrome"}
        
        # Browser -> App conversion
        if source_tool == "browser" and target_tool == "app":
            return {"action": "launch", "name": "chrome"}
        
        # Type -> Clipboard conversion
        if source_tool == "type" and target_tool == "clipboard":
            if "text" in arguments:
                return {"action": "set", "content": arguments["text"]}
        
        # Default: return as-is
        return arguments
    
    async def _execute_rollback(self, rollback_actions: List[Dict[str, Any]]):
        """Execute rollback actions in reverse order."""
        logger.info(f"Executing {len(rollback_actions)} rollback actions")
        
        for action in reversed(rollback_actions):
            try:
                tool_name = action.get("tool")
                args = action.get("arguments", {})
                
                logger.info(f"  Rollback: {tool_name}")
                await self.tool_executor(tool_name, args)
                
            except Exception as e:
                logger.error(f"  Rollback failed for {tool_name}: {e}")
                # Continue with other rollback actions
    
    def add_rollback_action(self, tool_name: str, arguments: Dict[str, Any]):
        """Add a rollback action to the stack."""
        self.rollback_stack.append({
            "tool": tool_name,
            "arguments": arguments,
            "timestamp": datetime.now().timestamp()
        })
        logger.debug(f"Added rollback action: {tool_name}")
    
    def clear_rollback_stack(self):
        """Clear the rollback stack (call after successful workflow completion)."""
        self.rollback_stack.clear()
        logger.debug("Cleared rollback stack")
    
    def get_error_summary(self) -> Dict[str, Any]:
        """Get summary of errors encountered."""
        if not self.error_history:
            return {"total_errors": 0}
        
        error_types = {}
        tool_errors = {}
        
        for error in self.error_history:
            # Count by error type
            error_types[error.error_type] = error_types.get(error.error_type, 0) + 1
            
            # Count by tool
            tool_errors[error.tool_name] = tool_errors.get(error.tool_name, 0) + 1
        
        return {
            "total_errors": len(self.error_history),
            "error_types": error_types,
            "tool_errors": tool_errors,
            "recent_errors": [e.to_dict() for e in self.error_history[-5:]]
        }


# Example usage and testing
async def mock_tool_executor(tool_name: str, arguments: Dict[str, Any]) -> str:
    """Mock tool executor for testing."""
    logger.info(f"  → Executing {tool_name} with {arguments}")
    
    await asyncio.sleep(0.3)
    
    # Simulate different failure scenarios
    if tool_name == "browser":
        raise Exception("Chrome extension relay is running, but no tab is connected")
    elif tool_name == "chrome_search":
        raise ConnectionError("Connection timeout")
    elif tool_name == "shell" and "chrome" in str(arguments):
        # Shell fallback succeeds
        return "Opened Chrome via shell"
    elif tool_name == "app":
        # App fallback succeeds
        return "Opened Chrome via app launcher"
    
    return f"Success: {tool_name}"


async def main():
    """Test the error recovery manager."""
    logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')
    
    manager = ErrorRecoveryManager(tool_executor=mock_tool_executor)
    
    print("\n" + "="*60)
    print("TEST 1: Browser Tool with Fallback")
    print("="*60)
    
    result = await manager.execute_with_recovery(
        "browser",
        {"url": "https://google.com"},
        max_retries=2,
        allow_fallback=True
    )
    
    print(f"\nResult: {result}")
    
    print("\n" + "="*60)
    print("TEST 2: Connection Error with Retry")
    print("="*60)
    
    result = await manager.execute_with_recovery(
        "chrome_search",
        {"query": "weather"},
        max_retries=3,
        allow_fallback=False
    )
    
    print(f"\nResult: {result}")
    
    print("\n" + "="*60)
    print("ERROR SUMMARY")
    print("="*60)
    
    summary = manager.get_error_summary()
    print(f"\nTotal Errors: {summary['total_errors']}")
    print(f"Error Types: {summary['error_types']}")
    print(f"Tool Errors: {summary['tool_errors']}")


if __name__ == "__main__":
    asyncio.run(main())
