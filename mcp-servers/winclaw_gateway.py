#!/usr/bin/env python3
"""
WinClaw Gateway v4.0 - ULTIMATE GOD MODE EDITION
Full integration with ALL advanced systems:
- Swarm Intelligence (Parallel Omnipresence)
- Self-Synthesizing Tools (Auto-generates missing tools)
- Predictive Execution (Predicts and pre-executes next actions)
- Semantic Graph Memory (Infinite knowledge graph)
- Sentient Conversation Engine (Human-like personality)
"""

from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import logging
import os
import sys
from datetime import datetime
from pathlib import Path
import uvicorn
import asyncio
import litellm
import json

# Add lib to path
sys.path.insert(0, str(Path(__file__).parent))

# ============================================================
# LOGGING - Set up BEFORE imports
# ============================================================
os.makedirs("logs", exist_ok=True)

logger = logging.getLogger("WinClaw_gateway")
logger.setLevel(logging.INFO)
logger.propagate = False

file_handler = logging.FileHandler('logs/gateway_ultimate.log', mode='w', encoding='utf-8')
file_handler.setLevel(logging.INFO)
file_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(file_formatter)
logger.addHandler(file_handler)

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_formatter = logging.Formatter('%(levelname)s - %(message)s')
console_handler.setFormatter(console_formatter)
logger.addHandler(console_handler)

logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

# ============================================================
# IMPORTS - Core systems (required)
# ============================================================
from lib.mcp_manager import MCPManager
from lib.agent_integration import EnhancedAgent
from lib.smart_navigator import SmartNavigator
from lib.swarm_intelligence import SwarmIntelligence, TaskPriority

# ============================================================
# IMPORTS - New systems (optional, with error handling)
# ============================================================
HAS_SYNTHESIZING = False
HAS_PREDICTIVE = False
HAS_MEMORY = False
HAS_SENTIENT = False

try:
    import lib.self_synthesizing_tools as sst_module
    SelfSynthesizingTools = getattr(sst_module, 'SelfSynthesizingTools', None)
    if SelfSynthesizingTools:
        HAS_SYNTHESIZING = True
        logger.info("✓ Self-Synthesizing Tools module loaded")
except Exception as e:
    logger.warning(f"⚠ Self-Synthesizing Tools not available: {e}")
    SelfSynthesizingTools = None

try:
    import lib.predictive_execution as pe_module
    PredictiveExecutionEngine = getattr(pe_module, 'PredictiveExecutionEngine', None)
    if PredictiveExecutionEngine:
        HAS_PREDICTIVE = True
        logger.info("✓ Predictive Execution module loaded")
except Exception as e:
    logger.warning(f"⚠ Predictive Execution not available: {e}")
    PredictiveExecutionEngine = None

try:
    import lib.semantic_graph_memory as sgm_module
    SemanticGraphMemory = getattr(sgm_module, 'SemanticGraphMemory', None)
    if SemanticGraphMemory:
        HAS_MEMORY = True
        logger.info("✓ Semantic Graph Memory module loaded")
except Exception as e:
    logger.warning(f"⚠ Semantic Memory not available: {e}")
    SemanticGraphMemory = None

try:
    import lib.human_conversation_sentient as hcs_module
    SentientConversationEngine = getattr(hcs_module, 'SentientConversationEngine', None)
    if SentientConversationEngine:
        HAS_SENTIENT = True
        logger.info("✓ Sentient Conversation module loaded")
except Exception as e:
    logger.warning(f"⚠ Sentient Conversation not available: {e}")
    SentientConversationEngine = None

# ============================================================
# CONFIG
# ============================================================
_raw_api_keys = os.environ.get("WinClaw_API_KEYS", "")
if not _raw_api_keys:
    raise RuntimeError(
        "WinClaw_API_KEYS environment variable is not set. "
        "Set it to a comma-separated list of API keys before starting the gateway."
    )
VALID_API_KEYS = set(k.strip() for k in _raw_api_keys.split(",") if k.strip())
if not VALID_API_KEYS:
    raise RuntimeError(
        "WinClaw_API_KEYS contains no valid (non-whitespace) keys. "
        "Provide at least one key."
    )

# WhatsApp bridge / local LLM endpoint — override via WHATSAPP_BRIDGE_URL env var
WHATSAPP_BRIDGE_URL = os.environ.get("WHATSAPP_BRIDGE_URL", "http://localhost:18788")

# Global instances
mcp_manager: Optional[MCPManager] = None
enhanced_agent: Optional[EnhancedAgent] = None
smart_navigator: Optional[SmartNavigator] = None
swarm_intelligence: Optional[SwarmIntelligence] = None
self_synthesizing = None
predictive_engine = None
semantic_memory = None
sentient_conversation = None

API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

# ============================================================
# MODELS
# ============================================================

class TaskRequest(BaseModel):
    goal: str
    session_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = Field(default_factory=dict)
    max_iterations: Optional[int] = 10

class TaskResponse(BaseModel):
    success: bool
    session_id: str
    result: Optional[str] = None
    iterations: int
    actions_taken: List[Dict[str, Any]]
    error: Optional[str] = None
    timestamp: str

class NavigationRequest(BaseModel):
    goal: str
    url: str
    session_id: Optional[str] = None
    max_steps: Optional[int] = 20

class NavigationResponse(BaseModel):
    success: bool
    session_id: str
    result: Optional[str] = None
    steps_taken: int
    path: List[Dict[str, Any]]
    error: Optional[str] = None
    timestamp: str

class SwarmTaskRequest(BaseModel):
    tasks: List[Dict[str, Any]]
    parallel: Optional[bool] = True
    priority: Optional[str] = "normal"

class SwarmTaskResponse(BaseModel):
    success: bool
    task_id: str
    results: List[Dict[str, Any]]
    total_tasks: int
    completed: int
    failed: int
    execution_time: float
    timestamp: str

class ToolRequest(BaseModel):
    arguments: Dict[str, Any] = Field(default_factory=dict)

class ToolResponse(BaseModel):
    success: bool
    tool_name: str
    result: Any
    timestamp: str
    error: Optional[str] = None
    cached: Optional[bool] = None
    execution_time: Optional[float] = None
    retry_count: Optional[int] = None
    predicted: Optional[bool] = None
    synthesized: Optional[bool] = None

class SentientChatRequest(BaseModel):
    user_id: str
    message: str
    session_id: Optional[str] = None

class SentientChatResponse(BaseModel):
    success: bool
    message: str
    wait_time: float
    typing_indicator: bool
    correction: Optional[str] = None
    mood: Dict[str, Any]
    user_profile: Dict[str, Any]

class MemorySearchRequest(BaseModel):
    query: str
    limit: int = 10
    node_types: Optional[List[str]] = None

class MemorySearchResponse(BaseModel):
    success: bool
    results: List[Dict[str, Any]]
    count: int

class SynthesizeToolRequest(BaseModel):
    description: str
    requirements: Optional[List[str]] = None

class HealthResponse(BaseModel):
    status: str
    version: str
    mcp_connected: bool
    tools_available: int
    enhanced_agent_active: bool
    smart_navigator_active: bool
    swarm_intelligence_active: bool
    self_synthesizing_active: bool
    predictive_execution_active: bool
    semantic_memory_active: bool
    sentient_conversation_active: bool
    active_sessions: int
    active_swarm_agents: int
    total_memories: int
    timestamp: str

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    session_id: Optional[str] = None
    max_tokens: Optional[int] = 4096

class ChatResponse(BaseModel):
    text: str
    attachments: List[Any] = []
    actions: List[Any] = []

# ============================================================
# LIFESPAN
# ============================================================

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    global mcp_manager, enhanced_agent, smart_navigator, swarm_intelligence
    global self_synthesizing, predictive_engine, semantic_memory, sentient_conversation

    logger.info("=" * 70)
    logger.info("🔥 WinClaw GATEWAY v4.0 - ULTIMATE GOD MODE 🔥")
    logger.info("=" * 70)

    try:
        # 1. Initialize MCP Manager
        mcp_manager = MCPManager()
        await mcp_manager.initialize()
        logger.info(f"✓ MCP Manager initialized with {len(mcp_manager.tools)} tools")

        # Tool executor for all systems
        async def mcp_tool_executor(tool_name: str, arguments: Dict[str, Any]) -> Any:
            result = await mcp_manager.call_tool(tool_name, arguments)
            if hasattr(result, 'content') and result.content:
                return result.content[0].text if result.content else str(result)
            return str(result)

        # 2. Initialize Enhanced Agent
        enhanced_agent = EnhancedAgent(
            tool_executor=mcp_tool_executor,
            config_path="config/agent_config.json"
        )
        logger.info("✓ Enhanced Agent initialized (GOD MODE ACTIVE)")
        logger.info(f"  → Conversation Manager: ACTIVE")
        logger.info(f"  → Agent Orchestrator: ACTIVE")
        logger.info(f"  → Error Recovery: ACTIVE")
        logger.info(f"  → Performance Optimizer: ACTIVE")

        # 3. Initialize Smart Navigator
        smart_navigator = SmartNavigator(
            tool_executor=mcp_tool_executor,
            max_steps=20,
            wait_between_actions=2.0
        )
        logger.info("✓ Smart Navigator initialized (GOD LEVEL)")
        logger.info(f"  → Vision-guided navigation: ACTIVE")
        logger.info(f"  → Autonomous clicking: ACTIVE")
        logger.info(f"  → Intelligent data extraction: ACTIVE")

        # 4. Initialize Swarm Intelligence
        swarm_intelligence = SwarmIntelligence(
            tool_executor=mcp_tool_executor,
            min_agents=3,
            max_agents=10,
            auto_scale=True
        )
        await swarm_intelligence.initialize_swarm()
        logger.info("✓ Swarm Intelligence initialized (PARALLEL OMNIPRESENCE)")
        logger.info(f"  → Active agents: {len(swarm_intelligence.agents)}")
        logger.info(f"  → Auto-scaling: ENABLED")
        logger.info(f"  → Collective intelligence: ACTIVE")

        # 5. Initialize Predictive Execution (if available)
        if HAS_PREDICTIVE and PredictiveExecutionEngine:
            try:
                predictive_engine = PredictiveExecutionEngine(
                    min_confidence=0.6,
                    enable_pre_execution=True
                )
                logger.info("✓ Predictive Execution initialized (FUTURE SIGHT)")
                logger.info(f"  → Pre-execution: ENABLED")
                logger.info(f"  → Pattern learning: ACTIVE")
            except Exception as e:
                logger.warning(f"⚠ Predictive Execution failed to initialize: {e}")
                predictive_engine = None

        # 6. Initialize Semantic Graph Memory (if available)
        if HAS_MEMORY and SemanticGraphMemory:
            try:
                semantic_memory = SemanticGraphMemory(
                    embedding_function=None,
                    summarization_function=None,
                    max_nodes=100000,
                    enable_clustering=True
                )
                logger.info("✓ Semantic Graph Memory initialized (INFINITE MEMORY)")
                logger.info(f"  → Max nodes: 100,000")
                logger.info(f"  → Clustering: ENABLED")
            except Exception as e:
                logger.warning(f"⚠ Semantic Memory failed to initialize: {e}")
                semantic_memory = None

        # 7. Initialize Sentient Conversation Engine (if available)
        if HAS_SENTIENT and SentientConversationEngine:
            try:
                sentient_conversation = SentientConversationEngine(
                    ai_response_generator=None,
                    sentiment_analyzer=None,
                    enable_typing_delay=True,
                    enable_human_errors=True
                )
                logger.info("✓ Sentient Conversation Engine initialized (HUMAN PERSONALITY)")
                logger.info(f"  → Typing delays: ENABLED")
                logger.info(f"  → Human errors: ENABLED")
                logger.info(f"  → Personality learning: ACTIVE")
            except Exception as e:
                logger.warning(f"⚠ Sentient Conversation failed to initialize: {e}")
                sentient_conversation = None

        # 8. Initialize Self-Synthesizing Tools (if available and has API key)
        anthropic_key = os.environ.get("ANTHROPIC_API_KEY")
        if HAS_SYNTHESIZING and SelfSynthesizingTools and anthropic_key:
            try:
                self_synthesizing = SelfSynthesizingTools(
                    ai_api_key=anthropic_key,
                    ai_provider="anthropic"
                )
                logger.info("✓ Self-Synthesizing Tools initialized (CODE GENERATION)")
                logger.info(f"  → AI Provider: Anthropic Claude")
                logger.info(f"  → Auto-tool generation: ENABLED")
            except Exception as e:
                logger.warning(f"⚠ Self-Synthesizing failed to initialize: {e}")
                self_synthesizing = None
        elif not anthropic_key:
            logger.warning("⚠ Self-Synthesizing Tools disabled (no ANTHROPIC_API_KEY)")

    except Exception as e:
        logger.error(f"Failed to initialize: {e}", exc_info=True)
        raise

    logger.info("=" * 70)
    logger.info("GATEWAY READY - ALL SYSTEMS OPERATIONAL")
    logger.info("=" * 70)

    yield

    logger.info("Shutting down...")
    if swarm_intelligence:
        await swarm_intelligence.shutdown_swarm()
    if enhanced_agent:
        await enhanced_agent.shutdown()
    if mcp_manager:
        await mcp_manager.close()
    logger.info("Shutdown complete")

# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="WinClaw Gateway - ULTIMATE GOD MODE",
    description="Complete AI system with swarm intelligence, self-synthesis, prediction, memory, and human personality",
    version="4.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:8000", "http://127.0.0.1", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# AUTH
# ============================================================

async def verify_api_key(api_key: str = Security(api_key_header)):
    if api_key not in VALID_API_KEYS:
        raise HTTPException(status_code=403, detail="Invalid or missing API key")
    return api_key

# ============================================================
# ROUTES - BASIC
# ============================================================

@app.get("/")
async def root():
    return {
        "service": "WinClaw Gateway - ULTIMATE GOD MODE",
        "version": "4.0.0",
        "status": "online",
        "features": {
            "enhanced_agent": enhanced_agent is not None,
            "smart_navigator": smart_navigator is not None,
            "swarm_intelligence": swarm_intelligence is not None,
            "self_synthesizing": self_synthesizing is not None,
            "predictive_execution": predictive_engine is not None,
            "semantic_memory": semantic_memory is not None,
            "sentient_conversation": sentient_conversation is not None
        },
        "tools": len(mcp_manager.tools) if mcp_manager else 0,
        "docs": "/docs"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="ultimate_god_mode",
        version="4.0.0",
        mcp_connected=mcp_manager is not None,
        tools_available=len(mcp_manager.tools) if mcp_manager else 0,
        enhanced_agent_active=enhanced_agent is not None,
        smart_navigator_active=smart_navigator is not None,
        swarm_intelligence_active=swarm_intelligence is not None,
        self_synthesizing_active=self_synthesizing is not None,
        predictive_execution_active=predictive_engine is not None,
        semantic_memory_active=semantic_memory is not None,
        sentient_conversation_active=sentient_conversation is not None,
        active_sessions=len(enhanced_agent.conversation_manager.sessions) if enhanced_agent else 0,
        active_swarm_agents=len(swarm_intelligence.agents) if swarm_intelligence else 0,
        total_memories=len(semantic_memory.nodes) if (semantic_memory and hasattr(semantic_memory, 'nodes')) else 0,
        timestamp=datetime.now().isoformat()
    )

@app.get("/tools", dependencies=[Depends(verify_api_key)])
async def list_tools():
    """List all available MCP tools"""
    if not mcp_manager:
        raise HTTPException(status_code=503, detail="MCP Manager not initialized")

    return {
        "tools": [
            {
                "name": name,
                "description": tool.description if hasattr(tool, 'description') else "No description",
                "input_schema": tool.inputSchema if hasattr(tool, 'inputSchema') else {}
            }
            for name, tool in mcp_manager.tools.items()
        ],
        "count": len(mcp_manager.tools)
    }

# ============================================================
# ROUTES - ENHANCED AGENT
# ============================================================

@app.post("/agent/task", response_model=TaskResponse, dependencies=[Depends(verify_api_key)])
async def execute_agent_task(request: TaskRequest):
    """🤖 ENHANCED AGENT: Execute complex tasks with full system integration"""
    if not enhanced_agent:
        raise HTTPException(status_code=503, detail="Enhanced agent not initialized")

    try:
        session_id = request.session_id or f"session_{datetime.now().timestamp()}"

        result = await enhanced_agent.execute_task(
            goal=request.goal,
            session_id=session_id,
            context=request.context,
            max_iterations=request.max_iterations
        )

        return TaskResponse(
            success=result.get("success", False),
            session_id=session_id,
            result=result.get("result"),
            iterations=result.get("iterations", 0),
            actions_taken=result.get("actions", []),
            error=result.get("error"),
            timestamp=datetime.now().isoformat()
        )

    except Exception as e:
        logger.error(f"Agent task failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agent/sessions", dependencies=[Depends(verify_api_key)])
async def list_agent_sessions():
    """List all active agent sessions"""
    if not enhanced_agent:
        raise HTTPException(status_code=503, detail="Enhanced agent not initialized")

    return {
        "sessions": list(enhanced_agent.conversation_manager.sessions.keys()),
        "count": len(enhanced_agent.conversation_manager.sessions)
    }

@app.get("/agent/session/{session_id}", dependencies=[Depends(verify_api_key)])
async def get_agent_session(session_id: str):
    """Get details of a specific session"""
    if not enhanced_agent:
        raise HTTPException(status_code=503, detail="Enhanced agent not initialized")

    session = enhanced_agent.conversation_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    return session

# ============================================================
# ROUTES - SMART NAVIGATOR
# ============================================================

@app.post("/navigator/navigate", response_model=NavigationResponse, dependencies=[Depends(verify_api_key)])
async def smart_navigate(request: NavigationRequest):
    """🧭 SMART NAVIGATOR: Vision-guided autonomous web navigation"""
    if not smart_navigator:
        raise HTTPException(status_code=503, detail="Smart navigator not initialized")

    try:
        session_id = request.session_id or f"nav_{datetime.now().timestamp()}"

        result = await smart_navigator.navigate_to_goal(
            goal=request.goal,
            starting_url=request.url,
            max_steps=request.max_steps
        )

        return NavigationResponse(
            success=result.get("success", False),
            session_id=session_id,
            result=result.get("result"),
            steps_taken=result.get("steps", 0),
            path=result.get("path", []),
            error=result.get("error"),
            timestamp=datetime.now().isoformat()
        )

    except Exception as e:
        logger.error(f"Navigation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================
# ROUTES - SWARM INTELLIGENCE
# ============================================================

@app.post("/swarm/execute", response_model=SwarmTaskResponse, dependencies=[Depends(verify_api_key)])
async def execute_swarm_tasks(request: SwarmTaskRequest):
    """🐝 SWARM INTELLIGENCE: Execute multiple tasks in parallel"""
    if not swarm_intelligence:
        raise HTTPException(status_code=503, detail="Swarm intelligence not initialized")

    try:
        priority_map = {
            "low": TaskPriority.LOW,
            "normal": TaskPriority.NORMAL,
            "high": TaskPriority.HIGH,
            "critical": TaskPriority.CRITICAL
        }
        priority = priority_map.get(request.priority, TaskPriority.NORMAL)

        start_time = datetime.now()

        if request.parallel:
            results = await swarm_intelligence.execute_parallel_tasks(
                request.tasks,
                priority=priority
            )
        else:
            results = []
            for task in request.tasks:
                result = await swarm_intelligence.assign_task(task, priority=priority)
                results.append(result)

        execution_time = (datetime.now() - start_time).total_seconds()

        completed = sum(1 for r in results if r.get("success"))
        failed = len(results) - completed

        return SwarmTaskResponse(
            success=failed == 0,
            task_id=f"swarm_{datetime.now().timestamp()}",
            results=results,
            total_tasks=len(request.tasks),
            completed=completed,
            failed=failed,
            execution_time=execution_time,
            timestamp=datetime.now().isoformat()
        )

    except Exception as e:
        logger.error(f"Swarm execution failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/swarm/status", dependencies=[Depends(verify_api_key)])
async def get_swarm_status():
    """Get swarm intelligence status"""
    if not swarm_intelligence:
        raise HTTPException(status_code=503, detail="Swarm intelligence not initialized")

    return swarm_intelligence.get_swarm_status()

@app.get("/swarm/agents", dependencies=[Depends(verify_api_key)])
async def list_swarm_agents():
    """List all swarm agents and their status"""
    if not swarm_intelligence:
        raise HTTPException(status_code=503, detail="Swarm intelligence not initialized")

    return {
        "agents": [
            {
                "id": agent.agent_id,
                "status": agent.status,
                "current_task": agent.current_task,
                "tasks_completed": agent.tasks_completed,
                "success_rate": agent.success_rate
            }
            for agent in swarm_intelligence.agents
        ],
        "count": len(swarm_intelligence.agents)
    }

# ============================================================
# ROUTES - DIRECT TOOL EXECUTION
# ============================================================

@app.post("/tools/{tool_name}", response_model=ToolResponse, dependencies=[Depends(verify_api_key)])
async def execute_tool(tool_name: str, request: ToolRequest):
    """🔧 DIRECT TOOL: Execute any MCP tool directly"""
    if not mcp_manager:
        raise HTTPException(status_code=503, detail="MCP Manager not initialized")

    if tool_name not in mcp_manager.tools:
        raise HTTPException(status_code=404, detail=f"Tool '{tool_name}' not found")

    try:
        start_time = datetime.now()
        result = await mcp_manager.call_tool(tool_name, request.arguments)
        execution_time = (datetime.now() - start_time).total_seconds()

        if hasattr(result, 'content') and result.content:
            result_content = result.content[0].text if result.content else str(result)
        else:
            result_content = str(result)

        return ToolResponse(
            success=True,
            tool_name=tool_name,
            result=result_content,
            timestamp=datetime.now().isoformat(),
            execution_time=execution_time
        )

    except Exception as e:
        logger.error(f"Tool execution failed: {e}", exc_info=True)
        return ToolResponse(
            success=False,
            tool_name=tool_name,
            result=None,
            error=str(e),
            timestamp=datetime.now().isoformat()
        )

# ============================================================
# ROUTES - WHATSAPP INTEGRATION (ULTIMATE GATEWAY BRIDGE)
# ============================================================

@app.post("/responses", response_model=ChatResponse)
async def create_response(request: ChatRequest):
    """🦞 WHATSAPP BRIDGE: Route messages through ULTIMATE MCP Gateway on 18788"""
    try:
        logger.info(f"📨 WhatsApp message received: {request.messages[-1]['content'][:100]}...")

        # Get tools in OpenAI format
        tools = []
        if mcp_manager:
            for tool_name, tool_obj in mcp_manager.tools.items():
                tools.append({
                    "type": "function",
                    "function": {
                        "name": tool_name,
                        "description": tool_obj.description if hasattr(tool_obj, 'description') else "No description",
                        "parameters": tool_obj.inputSchema if hasattr(tool_obj, 'inputSchema') else {}
                    }
                })

        logger.info(f"🔧 Loaded {len(tools)} tools for AI")

        # Call ULTIMATE gateway via litellm-compatible interface
        response = await litellm.acompletion(
            model="deepseek-r1:8b",
            messages=request.messages,
            api_base=WHATSAPP_BRIDGE_URL,
            tools=tools if tools else None,
            max_tokens=request.max_tokens,
            stream=False
        )

        logger.info(f"✅ ULTIMATE gateway responded")

        choice = response.choices[0]
        if hasattr(choice.message, 'tool_calls') and choice.message.tool_calls:
            logger.info(f"🔧 AI wants to use {len(choice.message.tool_calls)} tools")

            tool_results = []
            for tool_call in choice.message.tool_calls:
                tool_name = tool_call.function.name
                tool_args = json.loads(tool_call.function.arguments)

                logger.info(f"  🔧 Executing: {tool_name}")

                try:
                    result = await mcp_manager.call_tool(tool_name, tool_args)

                    if hasattr(result, 'content') and result.content:
                        result_text = result.content[0].text if result.content else str(result)
                    else:
                        result_text = str(result)

                    tool_results.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": result_text
                    })

                    logger.info(f"  ✅ Result: {result_text[:100]}...")

                except Exception as e:
                    logger.error(f"  ❌ Tool error: {e}")
                    tool_results.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": f"Error executing {tool_name}: {str(e)}"
                    })

            messages = request.messages.copy()
            messages.append({
                "role": "assistant",
                "content": choice.message.content or "",
                "tool_calls": [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {
                            "name": tc.function.name,
                            "arguments": tc.function.arguments
                        }
                    }
                    for tc in choice.message.tool_calls
                ]
            })
            messages.extend(tool_results)

            logger.info("🔄 Getting final response from ULTIMATE gateway...")
            final_response = await litellm.acompletion(
                model="deepseek-r1:8b",
                messages=messages,
                api_base=WHATSAPP_BRIDGE_URL,
                max_tokens=request.max_tokens,
                stream=False
            )

            response_text = final_response.choices[0].message.content
            logger.info(f"✅ Final response: {response_text[:100]}...")
        else:
            response_text = choice.message.content
            logger.info(f"✅ Direct response (no tools): {response_text[:100]}...")

        return ChatResponse(
            text=response_text,
            attachments=[],
            actions=[]
        )

    except Exception as e:
        logger.error(f"❌ WhatsApp bridge error: {e}", exc_info=True)
        return ChatResponse(
            text=f"Sorry, I encountered an error: {str(e)}",
            attachments=[],
            actions=[]
        )

# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":
    print("\n" + "="*70)
    print("🔥 WinClaw GATEWAY v4.0 - ULTIMATE GOD MODE 🔥")
    print("="*70)
    print("Starting server on http://0.0.0.0:8000")
    print("API Docs: http://localhost:8000/docs")
    print("="*70 + "\n")

    uvicorn.run(
        "WinClaw_gateway:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info"
    )
