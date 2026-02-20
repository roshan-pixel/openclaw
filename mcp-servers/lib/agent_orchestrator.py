"""
Agent Orchestrator - Advanced task decomposition, parallel execution, and retry logic
"""
import asyncio
import logging
import time
from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime

logger = logging.getLogger(__name__)


class TaskStatus(Enum):
    """Task execution status."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    RETRYING = "retrying"
    CANCELLED = "cancelled"


@dataclass
class Task:
    """Represents a single task in a workflow."""
    task_id: str
    tool_name: str
    arguments: Dict[str, Any]
    dependencies: List[str] = field(default_factory=list)
    status: TaskStatus = TaskStatus.PENDING
    result: Any = None
    error: Optional[str] = None
    retry_count: int = 0
    max_retries: int = 3
    created_at: float = field(default_factory=time.time)
    started_at: Optional[float] = None
    completed_at: Optional[float] = None
    
    def duration(self) -> Optional[float]:
        """Get task execution duration in seconds."""
        if self.started_at and self.completed_at:
            return self.completed_at - self.started_at
        return None
    
    def can_retry(self) -> bool:
        """Check if task can be retried."""
        return self.retry_count < self.max_retries and self.status == TaskStatus.FAILED
    
    def to_dict(self) -> Dict[str, Any]:
        """Serialize task to dictionary."""
        return {
            "task_id": self.task_id,
            "tool_name": self.tool_name,
            "arguments": self.arguments,
            "dependencies": self.dependencies,
            "status": self.status.value,
            "result": str(self.result)[:200] if self.result else None,
            "error": self.error,
            "retry_count": self.retry_count,
            "duration": self.duration()
        }


@dataclass
class Workflow:
    """Represents a workflow of multiple tasks."""
    workflow_id: str
    tasks: List[Task] = field(default_factory=list)
    created_at: float = field(default_factory=time.time)
    completed_at: Optional[float] = None
    
    def add_task(self, task: Task):
        """Add a task to the workflow."""
        self.tasks.append(task)
    
    def get_task(self, task_id: str) -> Optional[Task]:
        """Get a task by ID."""
        for task in self.tasks:
            if task.task_id == task_id:
                return task
        return None
    
    def get_pending_tasks(self) -> List[Task]:
        """Get all pending tasks whose dependencies are met."""
        pending = []
        for task in self.tasks:
            if task.status != TaskStatus.PENDING:
                continue
            
            # Check if all dependencies are completed
            dependencies_met = all(
                self.get_task(dep_id).status == TaskStatus.COMPLETED
                for dep_id in task.dependencies
            )
            
            if dependencies_met:
                pending.append(task)
        
        return pending
    
    def get_failed_tasks(self) -> List[Task]:
        """Get all failed tasks that can be retried."""
        return [task for task in self.tasks if task.can_retry()]
    
    def is_complete(self) -> bool:
        """Check if workflow is complete."""
        return all(
            task.status in [TaskStatus.COMPLETED, TaskStatus.CANCELLED]
            for task in self.tasks
        )
    
    def has_failures(self) -> bool:
        """Check if workflow has any failures."""
        return any(task.status == TaskStatus.FAILED for task in self.tasks)
    
    def summary(self) -> Dict[str, Any]:
        """Get workflow summary."""
        status_counts = {}
        for status in TaskStatus:
            count = sum(1 for task in self.tasks if task.status == status)
            if count > 0:
                status_counts[status.value] = count
        
        return {
            "workflow_id": self.workflow_id,
            "total_tasks": len(self.tasks),
            "status_counts": status_counts,
            "is_complete": self.is_complete(),
            "has_failures": self.has_failures(),
            "duration": (self.completed_at or time.time()) - self.created_at
        }


class AgentOrchestrator:
    """Orchestrates complex multi-task workflows with parallel execution and retry logic."""
    
    def __init__(
        self,
        tool_executor: Callable,
        max_parallel: int = 5,
        retry_delay: float = 1.0,
        retry_backoff: float = 2.0
    ):
        """
        Initialize the orchestrator.
        
        Args:
            tool_executor: Async function to execute tools (tool_name, arguments) -> result
            max_parallel: Maximum number of parallel task executions
            retry_delay: Initial delay before retry (seconds)
            retry_backoff: Backoff multiplier for retries
        """
        self.tool_executor = tool_executor
        self.max_parallel = max_parallel
        self.retry_delay = retry_delay
        self.retry_backoff = retry_backoff
        
        self.workflows: Dict[str, Workflow] = {}
        self.task_queue = asyncio.Queue()
        
        logger.info(f"AgentOrchestrator initialized (max_parallel={max_parallel})")
    
    async def execute_workflow(
        self,
        workflow_id: str,
        tasks: List[Task],
        timeout: Optional[float] = None
    ) -> Workflow:
        """
        Execute a workflow of tasks.
        
        Args:
            workflow_id: Unique workflow identifier
            tasks: List of tasks to execute
            timeout: Optional timeout in seconds
            
        Returns:
            Completed workflow object
        """
        workflow = Workflow(workflow_id=workflow_id, tasks=tasks)
        self.workflows[workflow_id] = workflow
        
        logger.info(f"Starting workflow {workflow_id} with {len(tasks)} tasks")
        
        try:
            await asyncio.wait_for(
                self._execute_workflow_internal(workflow),
                timeout=timeout
            )
        except asyncio.TimeoutError:
            logger.error(f"Workflow {workflow_id} timed out")
            # Cancel remaining tasks
            for task in workflow.tasks:
                if task.status == TaskStatus.PENDING or task.status == TaskStatus.RUNNING:
                    task.status = TaskStatus.CANCELLED
        
        workflow.completed_at = time.time()
        logger.info(f"Workflow {workflow_id} completed: {workflow.summary()}")
        
        return workflow
    
    async def _execute_workflow_internal(self, workflow: Workflow):
        """Internal workflow execution logic."""
        # Create semaphore for parallel execution limit
        semaphore = asyncio.Semaphore(self.max_parallel)
        
        while not workflow.is_complete():
            # Get pending tasks
            pending_tasks = workflow.get_pending_tasks()
            
            if not pending_tasks:
                # Check for failed tasks that can be retried
                failed_tasks = workflow.get_failed_tasks()
                
                if failed_tasks:
                    logger.info(f"Retrying {len(failed_tasks)} failed tasks")
                    for task in failed_tasks:
                        task.status = TaskStatus.RETRYING
                        task.retry_count += 1
                    pending_tasks = failed_tasks
                else:
                    # No pending or retryable tasks, workflow is stuck or complete
                    break
            
            # Execute pending tasks in parallel
            if pending_tasks:
                await asyncio.gather(
                    *[self._execute_task(task, semaphore) for task in pending_tasks],
                    return_exceptions=True
                )
            else:
                # Wait a bit before checking again
                await asyncio.sleep(0.1)
    
    async def _execute_task(self, task: Task, semaphore: asyncio.Semaphore):
        """Execute a single task with retry logic."""
        async with semaphore:
            task.status = TaskStatus.RUNNING
            task.started_at = time.time()
            
            logger.info(f"Executing task {task.task_id}: {task.tool_name}")
            
            try:
                # Calculate retry delay with exponential backoff
                if task.retry_count > 0:
                    delay = self.retry_delay * (self.retry_backoff ** (task.retry_count - 1))
                    logger.info(f"Task {task.task_id} retry {task.retry_count}, waiting {delay:.1f}s")
                    await asyncio.sleep(delay)
                
                # Execute the tool
                result = await self.tool_executor(task.tool_name, task.arguments)
                
                task.result = result
                task.status = TaskStatus.COMPLETED
                task.completed_at = time.time()
                
                logger.info(f"Task {task.task_id} completed in {task.duration():.2f}s")
                
            except Exception as e:
                task.error = str(e)
                task.status = TaskStatus.FAILED
                task.completed_at = time.time()
                
                logger.error(f"Task {task.task_id} failed: {e}")
                
                # Check if we should retry
                if task.can_retry():
                    logger.info(f"Task {task.task_id} will be retried ({task.retry_count}/{task.max_retries})")
    
    def decompose_task(self, complex_task: str, context: Dict = None) -> List[Task]:
        """
        Decompose a complex task into subtasks.
        This is a simple rule-based decomposer. In production, you'd use Claude for this.
        
        Args:
            complex_task: Natural language task description
            context: Optional context for task decomposition
            
        Returns:
            List of subtasks
        """
        tasks = []
        task_counter = 0
        
        # Simple keyword-based decomposition
        lower_task = complex_task.lower()
        
        # Pattern: "open X and do Y"
        if "open" in lower_task and "and" in lower_task:
            parts = lower_task.split("and")
            
            for i, part in enumerate(parts):
                task_id = f"task_{task_counter}"
                task_counter += 1
                
                # Determine tool based on keywords
                if "chrome" in part or "browser" in part:
                    tool_name = "browser"
                    args = {"action": "launch"}
                elif "notepad" in part or "calculator" in part:
                    app_name = "notepad" if "notepad" in part else "calc"
                    tool_name = "app"
                    args = {"action": "launch", "name": app_name}
                elif "type" in part:
                    # Extract text to type
                    text = part.split("type")[-1].strip()
                    tool_name = "type"
                    args = {"text": text}
                elif "screenshot" in part or "snapshot" in part:
                    tool_name = "snapshot"
                    args = {}
                else:
                    tool_name = "shell"
                    args = {"command": part.strip()}
                
                # Add dependencies (sequential execution)
                deps = [f"task_{task_counter - 2}"] if i > 0 else []
                
                tasks.append(Task(
                    task_id=task_id,
                    tool_name=tool_name,
                    arguments=args,
                    dependencies=deps
                ))
        
        # Single action
        else:
            if "screenshot" in lower_task or "snapshot" in lower_task:
                tasks.append(Task(
                    task_id="task_0",
                    tool_name="snapshot",
                    arguments={}
                ))
            elif "open" in lower_task:
                tasks.append(Task(
                    task_id="task_0",
                    tool_name="app",
                    arguments={"action": "launch", "name": "notepad"}
                ))
            else:
                tasks.append(Task(
                    task_id="task_0",
                    tool_name="shell",
                    arguments={"command": complex_task}
                ))
        
        logger.info(f"Decomposed task into {len(tasks)} subtasks")
        return tasks
    
    def get_workflow(self, workflow_id: str) -> Optional[Workflow]:
        """Get a workflow by ID."""
        return self.workflows.get(workflow_id)
    
    def list_workflows(self) -> List[Dict[str, Any]]:
        """List all workflows."""
        return [wf.summary() for wf in self.workflows.values()]


# Example usage
async def mock_tool_executor(tool_name: str, arguments: Dict[str, Any]) -> str:
    """Mock tool executor for testing."""
    logger.info(f"Executing {tool_name} with {arguments}")
    
    # Simulate execution time
    await asyncio.sleep(0.5)
    
    # Simulate occasional failures
    import random
    if random.random() < 0.2:  # 20% failure rate
        raise Exception(f"Random failure in {tool_name}")
    
    return f"Result from {tool_name}"


async def main():
    """Test the agent orchestrator."""
    logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')
    
    # Create orchestrator
    orchestrator = AgentOrchestrator(
        tool_executor=mock_tool_executor,
        max_parallel=3
    )
    
    # Create a workflow with dependencies
    tasks = [
        Task("task_1", "snapshot", {}, dependencies=[]),
        Task("task_2", "app", {"action": "launch", "name": "notepad"}, dependencies=["task_1"]),
        Task("task_3", "type", {"text": "Hello World"}, dependencies=["task_2"]),
        Task("task_4", "snapshot", {}, dependencies=["task_3"]),
    ]
    
    print("\n" + "="*60)
    print("TESTING WORKFLOW EXECUTION")
    print("="*60)
    
    workflow = await orchestrator.execute_workflow("test_workflow", tasks, timeout=30)
    
    print("\n" + "="*60)
    print("WORKFLOW SUMMARY")
    print("="*60)
    print(f"Status: {workflow.summary()}")
    
    print("\n" + "="*60)
    print("TASK DETAILS")
    print("="*60)
    for task in workflow.tasks:
        print(f"\n{task.task_id}:")
        print(f"  Tool: {task.tool_name}")
        print(f"  Status: {task.status.value}")
        print(f"  Duration: {task.duration():.2f}s" if task.duration() else "  Duration: N/A")
        print(f"  Retries: {task.retry_count}")
        if task.error:
            print(f"  Error: {task.error}")
    
    # Test task decomposition
    print("\n" + "="*60)
    print("TESTING TASK DECOMPOSITION")
    print("="*60)
    
    complex_task = "open chrome and search for weather and take a screenshot"
    decomposed = orchestrator.decompose_task(complex_task)
    
    print(f"\nComplex task: '{complex_task}'")
    print(f"Decomposed into {len(decomposed)} subtasks:")
    for task in decomposed:
        print(f"  - {task.task_id}: {task.tool_name}({task.arguments}) [deps: {task.dependencies}]")


if __name__ == "__main__":
    asyncio.run(main())
