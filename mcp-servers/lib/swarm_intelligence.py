"""
Swarm Intelligence - Parallel Omnipresence
Multiple AI agents working simultaneously across different tasks
"""
import asyncio
import logging
import time
import uuid
from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime
import json

logger = logging.getLogger(__name__)


class AgentStatus(Enum):
    """Agent lifecycle states"""
    IDLE = "idle"
    WORKING = "working"
    WAITING = "waiting"
    FAILED = "failed"
    TERMINATED = "terminated"


class TaskPriority(Enum):
    """Task priority levels"""
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4


@dataclass
class SwarmTask:
    """Task to be executed by swarm"""
    id: str
    name: str
    tool_name: str
    arguments: Dict[str, Any]
    priority: TaskPriority = TaskPriority.MEDIUM
    dependencies: List[str] = field(default_factory=list)
    assigned_agent: Optional[str] = None
    result: Optional[Any] = None
    error: Optional[str] = None
    started_at: Optional[float] = None
    completed_at: Optional[float] = None
    retries: int = 0
    max_retries: int = 3
    
    @property
    def status(self) -> str:
        if self.error and self.retries >= self.max_retries:
            return "failed"
        elif self.completed_at:
            return "completed"
        elif self.started_at:
            return "executing"
        elif self.assigned_agent:
            return "assigned"
        else:
            return "pending"
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "tool": self.tool_name,
            "status": self.status,
            "priority": self.priority.name,
            "assigned_agent": self.assigned_agent,
            "retries": self.retries,
            "execution_time": self.completed_at - self.started_at if self.completed_at and self.started_at else None
        }


@dataclass
class SwarmAgent:
    """Individual agent in the swarm"""
    id: str
    name: str
    status: AgentStatus = AgentStatus.IDLE
    current_task: Optional[SwarmTask] = None
    tasks_completed: int = 0
    tasks_failed: int = 0
    total_execution_time: float = 0.0
    created_at: float = field(default_factory=time.time)
    last_active: float = field(default_factory=time.time)
    capabilities: List[str] = field(default_factory=list)  # Which tools this agent can execute
    
    @property
    def is_available(self) -> bool:
        return self.status == AgentStatus.IDLE
    
    @property
    def success_rate(self) -> float:
        total = self.tasks_completed + self.tasks_failed
        return self.tasks_completed / total if total > 0 else 0.0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "status": self.status.value,
            "current_task": self.current_task.id if self.current_task else None,
            "tasks_completed": self.tasks_completed,
            "tasks_failed": self.tasks_failed,
            "success_rate": f"{self.success_rate * 100:.1f}%",
            "uptime": time.time() - self.created_at,
            "capabilities": self.capabilities
        }


@dataclass
class SwarmKnowledge:
    """Shared knowledge base across all agents"""
    learned_patterns: Dict[str, Any] = field(default_factory=dict)
    successful_strategies: List[Dict[str, Any]] = field(default_factory=list)
    failed_patterns: List[Dict[str, Any]] = field(default_factory=list)
    performance_metrics: Dict[str, float] = field(default_factory=dict)
    
    def record_success(self, task: SwarmTask, execution_time: float):
        """Record successful execution pattern"""
        pattern = {
            "tool": task.tool_name,
            "arguments_pattern": str(sorted(task.arguments.keys())),
            "execution_time": execution_time,
            "timestamp": time.time()
        }
        self.successful_strategies.append(pattern)
        
        # Update performance metrics
        key = f"{task.tool_name}_avg_time"
        if key not in self.performance_metrics:
            self.performance_metrics[key] = execution_time
        else:
            # Moving average
            self.performance_metrics[key] = (self.performance_metrics[key] * 0.8 + execution_time * 0.2)
    
    def record_failure(self, task: SwarmTask, error: str):
        """Record failed execution pattern"""
        pattern = {
            "tool": task.tool_name,
            "error": error,
            "arguments": task.arguments,
            "timestamp": time.time()
        }
        self.failed_patterns.append(pattern)
    
    def get_estimated_time(self, tool_name: str) -> float:
        """Get estimated execution time for a tool"""
        key = f"{tool_name}_avg_time"
        return self.performance_metrics.get(key, 5.0)  # Default 5 seconds


class SwarmIntelligence:
    """
    🔥 SWARM INTELLIGENCE: Parallel Omnipresence
    
    Multiple AI agents working simultaneously across different tasks.
    
    Features:
    - Parallel execution (10+ agents)
    - Intelligent task distribution
    - Shared knowledge base
    - Auto-scaling (spawn agents as needed)
    - Self-healing (auto-recover failed agents)
    - Collective decision making
    - Load balancing
    """
    
    def __init__(
        self,
        tool_executor: Callable,
        min_agents: int = 3,
        max_agents: int = 10,
        auto_scale: bool = True
    ):
        """
        Initialize Swarm Intelligence System
        
        Args:
            tool_executor: Async function to execute tools
            min_agents: Minimum number of agents to maintain
            max_agents: Maximum number of agents to spawn
            auto_scale: Automatically spawn/terminate agents based on load
        """
        self.tool_executor = tool_executor
        self.min_agents = min_agents
        self.max_agents = max_agents
        self.auto_scale = auto_scale
        
        # Swarm components
        self.agents: Dict[str, SwarmAgent] = {}
        self.task_queue: List[SwarmTask] = []
        self.completed_tasks: List[SwarmTask] = []
        self.knowledge_base = SwarmKnowledge()
        
        # Swarm state
        self.swarm_active = False
        self.total_tasks_processed = 0
        self.swarm_start_time = time.time()
        
        # Communication channel (agents can send messages)
        self.message_bus: List[Dict[str, Any]] = []
        
        logger.info(f"🔥 Swarm Intelligence initialized (min={min_agents}, max={max_agents})")
    
    async def initialize_swarm(self):
        """Initialize the swarm with minimum agents"""
        logger.info(f"🐝 Spawning initial swarm ({self.min_agents} agents)...")
        
        for i in range(self.min_agents):
            await self._spawn_agent(f"Agent-{i+1}")
        
        self.swarm_active = True
        logger.info(f"✅ Swarm active with {len(self.agents)} agents")
    
    async def _spawn_agent(self, name: Optional[str] = None) -> SwarmAgent:
        """Spawn a new agent"""
        agent_id = str(uuid.uuid4())[:8]
        agent_name = name or f"Agent-{agent_id}"
        
        agent = SwarmAgent(
            id=agent_id,
            name=agent_name,
            capabilities=["*"]  # All tools by default
        )
        
        self.agents[agent_id] = agent
        logger.info(f"🐝 Spawned {agent_name} (ID: {agent_id})")
        
        return agent
    
    async def _terminate_agent(self, agent_id: str):
        """Terminate an agent"""
        if agent_id in self.agents:
            agent = self.agents[agent_id]
            agent.status = AgentStatus.TERMINATED
            del self.agents[agent_id]
            logger.info(f"💀 Terminated {agent.name}")
    
    async def execute_swarm_tasks(
        self,
        tasks: List[Dict[str, Any]],
        wait_for_completion: bool = True
    ) -> Dict[str, Any]:
        """
        🔥 MAIN METHOD: Execute multiple tasks in parallel using swarm
        
        Args:
            tasks: List of tasks to execute
                   [{"name": "task1", "tool": "windows-mcp-click", "args": {...}}, ...]
            wait_for_completion: Wait for all tasks to complete
            
        Returns:
            Swarm execution result with statistics
        """
        if not self.swarm_active:
            await self.initialize_swarm()
        
        start_time = time.time()
        
        # Convert to SwarmTask objects
        swarm_tasks = []
        for task_def in tasks:
            task = SwarmTask(
                id=str(uuid.uuid4())[:8],
                name=task_def.get("name", "unnamed"),
                tool_name=task_def.get("tool"),
                arguments=task_def.get("args", {}),
                priority=TaskPriority[task_def.get("priority", "MEDIUM").upper()],
                dependencies=task_def.get("dependencies", [])
            )
            swarm_tasks.append(task)
            self.task_queue.append(task)
        
        logger.info(f"🚀 Swarm executing {len(swarm_tasks)} tasks with {len(self.agents)} agents")
        
        # Auto-scale if needed
        if self.auto_scale:
            await self._auto_scale()
        
        # Start task distribution
        distribution_task = asyncio.create_task(self._distribute_tasks())
        
        if wait_for_completion:
            # Wait for all tasks to complete
            while self.task_queue or any(a.status == AgentStatus.WORKING for a in self.agents.values()):
                await asyncio.sleep(0.5)
            
            distribution_task.cancel()
        
        execution_time = time.time() - start_time
        
        # Collect results
        results = {
            "success": True,
            "total_tasks": len(swarm_tasks),
            "completed": len([t for t in swarm_tasks if t.status == "completed"]),
            "failed": len([t for t in swarm_tasks if t.status == "failed"]),
            "execution_time": execution_time,
            "tasks": [t.to_dict() for t in swarm_tasks],
            "swarm_stats": self.get_swarm_stats()
        }
        
        logger.info(f"✅ Swarm completed {results['completed']}/{results['total_tasks']} tasks in {execution_time:.2f}s")
        
        return results
    
    async def _distribute_tasks(self):
        """Continuously distribute tasks to available agents"""
        while self.swarm_active:
            try:
                # Find available agents
                available_agents = [a for a in self.agents.values() if a.is_available]
                
                if available_agents and self.task_queue:
                    # Sort tasks by priority
                    self.task_queue.sort(key=lambda t: t.priority.value, reverse=True)
                    
                    # Assign tasks to agents
                    for agent in available_agents:
                        if not self.task_queue:
                            break
                        
                        # Find a task this agent can handle
                        task = self._find_suitable_task(agent)
                        if task:
                            asyncio.create_task(self._execute_task_with_agent(agent, task))
                
                await asyncio.sleep(0.1)  # Check every 100ms
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Task distribution error: {e}")
    
    def _find_suitable_task(self, agent: SwarmAgent) -> Optional[SwarmTask]:
        """Find a task suitable for this agent"""
        for task in self.task_queue:
            # Check if dependencies are met
            if task.dependencies:
                deps_met = all(
                    any(t.id == dep_id and t.status == "completed" for t in self.completed_tasks)
                    for dep_id in task.dependencies
                )
                if not deps_met:
                    continue
            
            # Check if agent has capability
            if "*" in agent.capabilities or task.tool_name in agent.capabilities:
                self.task_queue.remove(task)
                return task
        
        return None
    
    async def _execute_task_with_agent(self, agent: SwarmAgent, task: SwarmTask):
        """Execute a task with a specific agent"""
        agent.status = AgentStatus.WORKING
        agent.current_task = task
        agent.last_active = time.time()
        task.assigned_agent = agent.id
        task.started_at = time.time()
        
        logger.info(f"🐝 {agent.name} executing {task.name} ({task.tool_name})")
        
        try:
            # Execute the tool
            result = await self.tool_executor(task.tool_name, task.arguments)
            
            # Record success
            task.result = result
            task.completed_at = time.time()
            execution_time = task.completed_at - task.started_at
            
            agent.tasks_completed += 1
            agent.total_execution_time += execution_time
            agent.status = AgentStatus.IDLE
            agent.current_task = None
            
            self.completed_tasks.append(task)
            self.total_tasks_processed += 1
            
            # Learn from success
            self.knowledge_base.record_success(task, execution_time)
            
            logger.info(f"✅ {agent.name} completed {task.name} in {execution_time:.2f}s")
            
        except Exception as e:
            logger.error(f"❌ {agent.name} failed {task.name}: {e}")
            
            task.error = str(e)
            task.retries += 1
            
            agent.tasks_failed += 1
            agent.status = AgentStatus.IDLE
            agent.current_task = None
            
            # Learn from failure
            self.knowledge_base.record_failure(task, str(e))
            
            # Retry if possible
            if task.retries < task.max_retries:
                logger.info(f"🔄 Re-queuing {task.name} (retry {task.retries}/{task.max_retries})")
                task.assigned_agent = None
                task.started_at = None
                self.task_queue.append(task)
            else:
                self.completed_tasks.append(task)
    
    async def _auto_scale(self):
        """Automatically scale swarm based on load"""
        queue_size = len(self.task_queue)
        num_agents = len(self.agents)
        
        # Scale up if queue is too large
        if queue_size > num_agents * 2 and num_agents < self.max_agents:
            agents_to_spawn = min(3, self.max_agents - num_agents)
            logger.info(f"📈 Scaling UP: Spawning {agents_to_spawn} agents (queue: {queue_size})")
            for _ in range(agents_to_spawn):
                await self._spawn_agent()
        
        # Scale down if too many idle agents
        idle_agents = [a for a in self.agents.values() if a.is_available]
        if len(idle_agents) > self.min_agents and queue_size == 0:
            agents_to_remove = len(idle_agents) - self.min_agents
            logger.info(f"📉 Scaling DOWN: Removing {agents_to_remove} idle agents")
            for agent in idle_agents[:agents_to_remove]:
                await self._terminate_agent(agent.id)
    
    def get_swarm_stats(self) -> Dict[str, Any]:
        """Get swarm statistics"""
        total_agents = len(self.agents)
        active_agents = len([a for a in self.agents.values() if a.status == AgentStatus.WORKING])
        idle_agents = len([a for a in self.agents.values() if a.status == AgentStatus.IDLE])
        
        return {
            "total_agents": total_agents,
            "active_agents": active_agents,
            "idle_agents": idle_agents,
            "tasks_in_queue": len(self.task_queue),
            "tasks_completed": len(self.completed_tasks),
            "total_processed": self.total_tasks_processed,
            "swarm_uptime": time.time() - self.swarm_start_time,
            "agents": [a.to_dict() for a in self.agents.values()],
            "knowledge_patterns": len(self.knowledge_base.successful_strategies),
            "avg_execution_times": self.knowledge_base.performance_metrics
        }
    
    async def broadcast_message(self, sender_id: str, message: Dict[str, Any]):
        """Broadcast message to all agents"""
        msg = {
            "from": sender_id,
            "timestamp": time.time(),
            "content": message
        }
        self.message_bus.append(msg)
        logger.info(f"📡 Broadcast from {sender_id}: {message}")
    
    async def shutdown_swarm(self):
        """Shutdown the entire swarm"""
        logger.info("🛑 Shutting down swarm...")
        self.swarm_active = False
        
        for agent_id in list(self.agents.keys()):
            await self._terminate_agent(agent_id)
        
        logger.info("✅ Swarm shutdown complete")


# Export
__all__ = ['SwarmIntelligence', 'SwarmTask', 'SwarmAgent', 'TaskPriority']
