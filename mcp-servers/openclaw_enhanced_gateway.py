"""
OpenClaw Enhanced Gateway - With MCP Tools, Log Bridge & Local LLM
Integrates WhatsApp → 21 Tools → Log Bridge → LiteLLM → Ollama
"""

import os
import sys
import json
import logging
import asyncio
import io
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime

# Fix Windows UTF-8 encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Add lib to path
sys.path.insert(0, str(Path(__file__).parent / "lib"))

from flask import Flask, request, jsonify
import requests

# Try to import MCP Manager (optional for now)
try:
    from mcp_manager import MCPConnectionManager
    MCP_AVAILABLE = True
    print("MCP Manager imported successfully")
except ImportError as e:
    MCP_AVAILABLE = False
    print(f"WARNING: MCP Manager not available: {e}")
    print("Running in SIMPLIFIED mode (WhatsApp -> LLM only)")

# Create logs directory
log_dir = Path(__file__).parent / "logs"
log_dir.mkdir(exist_ok=True)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_dir / 'enhanced_gateway.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('enhanced_gateway')

class EnhancedGateway:
    """Enhanced Gateway with MCP Tools, Log Bridge, and Local LLM"""

    def __init__(self):
        self.app = Flask(__name__)
        self.mcp_manager = None
        self.log_bridge_url = "http://localhost:5001"
        self.litellm_url = "http://localhost:4000"
        self.conversation_history = {}

        # Setup routes
        self.setup_routes()

        logger.info("=" * 80)
        logger.info("ENHANCED GATEWAY INITIALIZING")
        if MCP_AVAILABLE:
            logger.info("Mode: FULL (with MCP tools)")
        else:
            logger.info("Mode: SIMPLIFIED (WhatsApp -> LLM only)")
        logger.info("=" * 80)

    async def initialize_mcp(self):
        """Initialize MCP connection to 21 tools"""
        if not MCP_AVAILABLE:
            logger.warning("MCP not available - skipping tool initialization")
            return False

        try:
            config_path = Path(__file__).parent / "config" / "mcp_config.json"

            if not config_path.exists():
                logger.warning(f"MCP config not found: {config_path}")
                return False

            self.mcp_manager = MCPConnectionManager(str(config_path))
            await self.mcp_manager.connect_all()

            tools = await self.mcp_manager.list_all_tools()
            logger.info(f"MCP Connected - {len(tools)} tools available")

            return True
        except Exception as e:
            logger.error(f"MCP initialization failed: {e}")
            return False

    def log_to_bridge(self, event_type: str, data: Dict[str, Any]):
        """Send logs to WhatsApp Log Bridge"""
        try:
            log_data = {
                "timestamp": datetime.now().isoformat(),
                "event_type": event_type,
                "data": data
            }

            response = requests.post(
                f"{self.log_bridge_url}/log",
                json=log_data,
                timeout=2
            )

            if response.status_code != 200:
                logger.debug(f"Log bridge returned: {response.status_code}")

        except requests.exceptions.RequestException:
            pass  # Log bridge is optional
        except Exception as e:
            logger.error(f"Error logging to bridge: {e}")

    async def call_llm_with_tools(
        self, 
        message: str, 
        user_id: str,
        tools_available: list
    ) -> str:
        """Call LiteLLM with tool support"""
        try:
            # Get conversation history
            history = self.conversation_history.get(user_id, [])

            # Add user message
            history.append({"role": "user", "content": message})

            # Prepare request for LiteLLM
            llm_request = {
                "model": "deepseek-r1:8b",
                "messages": history,
                "temperature": 0.7,
                "max_tokens": 2000
            }

            # Only add tools if available
            if tools_available:
                llm_request["tools"] = tools_available

            self.log_to_bridge("llm_request", {
                "user_id": user_id,
                "message": message[:100],
                "tools_count": len(tools_available)
            })

            logger.info(f"Calling LiteLLM for user: {user_id}")

            # Call LiteLLM
            response = requests.post(
                f"{self.litellm_url}/chat/completions",
                json=llm_request,
                headers={"Content-Type": "application/json"},
                timeout=60
            )

            if response.status_code != 200:
                logger.error(f"LiteLLM error: {response.status_code} - {response.text}")
                return "Sorry, I encountered an error processing your request."

            result = response.json()

            # Extract response
            assistant_message = result["choices"][0]["message"]

            # Check if tool calls are needed
            if "tool_calls" in assistant_message and assistant_message.get("tool_calls"):
                if self.mcp_manager:
                    # Execute tool calls
                    tool_results = await self.execute_tools(assistant_message["tool_calls"])

                    # Add assistant message and tool results to history
                    history.append(assistant_message)

                    for tool_result in tool_results:
                        history.append({
                            "role": "tool",
                            "tool_call_id": tool_result["id"],
                            "content": json.dumps(tool_result["result"])
                        })

                    # Call LLM again with tool results
                    llm_request["messages"] = history
                    response = requests.post(
                        f"{self.litellm_url}/chat/completions",
                        json=llm_request,
                        headers={"Content-Type": "application/json"},
                        timeout=60
                    )

                    result = response.json()
                    final_response = result["choices"][0]["message"]["content"]
                else:
                    # No MCP manager, just return the message
                    final_response = assistant_message.get("content", "Tool execution not available")
            else:
                final_response = assistant_message.get("content", "No response generated")

            # Update conversation history
            history.append({"role": "assistant", "content": final_response})
            self.conversation_history[user_id] = history[-10:]  # Keep last 10 messages

            self.log_to_bridge("llm_response", {
                "user_id": user_id,
                "response_length": len(final_response)
            })

            logger.info(f"Response generated: {len(final_response)} chars")

            return final_response

        except Exception as e:
            logger.error(f"Error calling LLM: {e}", exc_info=True)
            self.log_to_bridge("llm_error", {"error": str(e)})
            return f"Error: {str(e)}"

    async def execute_tools(self, tool_calls: list) -> list:
        """Execute MCP tool calls"""
        results = []

        if not self.mcp_manager:
            logger.error("Cannot execute tools - MCP manager not available")
            return results

        for tool_call in tool_calls:
            try:
                tool_name = tool_call["function"]["name"]
                tool_args = json.loads(tool_call["function"]["arguments"])

                self.log_to_bridge("tool_execution", {
                    "tool": tool_name,
                    "args": tool_args
                })

                logger.info(f"Executing tool: {tool_name}")

                # Execute via MCP
                result = await self.mcp_manager.call_tool(
                    server_name="Windows-MCP",
                    tool_name=tool_name,
                    arguments=tool_args
                )

                results.append({
                    "id": tool_call["id"],
                    "result": result
                })

                logger.info(f"Tool {tool_name} completed successfully")

            except Exception as e:
                logger.error(f"Tool {tool_name} failed: {e}")
                results.append({
                    "id": tool_call["id"],
                    "result": {"error": str(e)}
                })

        return results

    def setup_routes(self):
        """Setup Flask routes"""

        @self.app.route('/health', methods=['GET'])
        def health():
            return jsonify({
                "status": "healthy",
                "gateway": "enhanced",
                "mcp_available": MCP_AVAILABLE,
                "mcp_connected": self.mcp_manager is not None
            }), 200

        @self.app.route('/webhook', methods=['POST'])
        def webhook():
            """Handle WhatsApp messages"""
            try:
                data = request.json

                self.log_to_bridge("incoming_message", data)

                # Extract message details
                message = data.get('message', {})
                text = message.get('text', '')
                user_id = data.get('from', 'unknown')

                logger.info(f"Message from {user_id}: {text[:100]}")

                # Get available tools
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)

                tools_formatted = []
                if self.mcp_manager:
                    try:
                        tools = loop.run_until_complete(self.mcp_manager.list_all_tools())

                        # Convert MCP tools to OpenAI format
                        for tool in tools:
                            tools_formatted.append({
                                "type": "function",
                                "function": {
                                    "name": tool["name"],
                                    "description": tool.get("description", ""),
                                    "parameters": tool.get("inputSchema", {})
                                }
                            })

                        logger.info(f"Loaded {len(tools_formatted)} tools")
                    except Exception as e:
                        logger.warning(f"Could not load tools: {e}")

                # Process with LLM
                response_text = loop.run_until_complete(
                    self.call_llm_with_tools(text, user_id, tools_formatted)
                )

                loop.close()

                self.log_to_bridge("outgoing_response", {
                    "user_id": user_id,
                    "response": response_text[:100]
                })

                logger.info(f"Response sent: {response_text[:100]}...")

                return jsonify({
                    "status": "success",
                    "response": response_text
                }), 200

            except Exception as e:
                logger.error(f"Error processing webhook: {e}", exc_info=True)
                self.log_to_bridge("webhook_error", {"error": str(e)})

                return jsonify({
                    "status": "error",
                    "message": str(e)
                }), 500

    def run(self, host='0.0.0.0', port=18789):
        """Run the gateway"""
        logger.info(f"Starting Enhanced Gateway on {host}:{port}")
        logger.info("=" * 80)

        # Initialize MCP in background (optional)
        if MCP_AVAILABLE:
            try:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                loop.run_until_complete(self.initialize_mcp())
                loop.close()
            except Exception as e:
                logger.warning(f"MCP initialization skipped: {e}")

        logger.info("Gateway ready - waiting for messages")
        logger.info("=" * 80)

        self.app.run(host=host, port=port, debug=False, threaded=True)

def main():
    """Main entry point"""
    try:
        gateway = EnhancedGateway()
        gateway.run()
    except KeyboardInterrupt:
        logger.info("Gateway stopped by user")
    except Exception as e:
        logger.error(f"Gateway crashed: {e}", exc_info=True)

if __name__ == '__main__':
    main()
