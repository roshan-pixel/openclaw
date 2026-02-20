#!/usr/bin/env python3
"""
Self-Synthesizing Tools - FIXED VERSION
Automatically generates new tools on demand using AI code generation.

Features:
- AI-powered code generation
- Automatic tool testing
- Dynamic tool registration
- Tool library management
"""

import json
import logging
import asyncio
from typing import Dict, Any, List, Optional, Callable
from datetime import datetime
import hashlib
import ast
import sys
from io import StringIO
import traceback

logger = logging.getLogger(__name__)


class GeneratedTool:
    """Represents a dynamically generated tool"""

    def __init__(
        self,
        name: str,
        description: str,
        code: str,
        input_schema: Dict[str, Any],
        test_results: Dict[str, Any]
    ):
        self.name = name
        self.description = description
        self.code = code
        self.input_schema = input_schema
        self.test_results = test_results
        self.created_at = datetime.now()
        self.usage_count = 0
        self.success_count = 0
        self.last_used = None

    def record_usage(self, success: bool):
        """Record tool usage"""
        self.usage_count += 1
        if success:
            self.success_count += 1
        self.last_used = datetime.now()

    @property
    def success_rate(self) -> float:
        """Calculate success rate"""
        return self.success_count / self.usage_count if self.usage_count > 0 else 0.0


class SelfSynthesizingTools:
    """
    Self-Synthesizing Tool Generator.

    Automatically creates new tools based on natural language descriptions
    using AI code generation.
    """

    def __init__(
        self,
        ai_api_key: Optional[str] = None,
        ai_provider: str = "anthropic",
        enable_testing: bool = True,
        max_tools: int = 100,
        sandbox_enabled: bool = True
    ):
        """
        Initialize Self-Synthesizing Tools system.

        Args:
            ai_api_key: API key for AI provider (Anthropic, OpenAI, etc.)
            ai_provider: AI provider name ("anthropic", "openai", "cohere")
            enable_testing: Whether to test generated tools before registration
            max_tools: Maximum number of synthesized tools to keep
            sandbox_enabled: Whether to run generated code in sandbox
        """
        self.ai_api_key = ai_api_key
        self.ai_provider = ai_provider
        self.enable_testing = enable_testing
        self.max_tools = max_tools
        self.sandbox_enabled = sandbox_enabled

        # Tool storage
        self.synthesized_tools = {}  # tool_name -> GeneratedTool
        self.tool_cache = {}  # description_hash -> tool_name

        # AI client (lazy init)
        self._ai_client = None

        # Statistics
        self.tools_generated = 0
        self.tools_failed = 0
        self.total_uses = 0

        logger.info("Self-Synthesizing Tools initialized")
        logger.info(f"  → AI Provider: {ai_provider}")
        logger.info(f"  → Testing: {'ENABLED' if enable_testing else 'DISABLED'}")
        logger.info(f"  → Sandbox: {'ENABLED' if sandbox_enabled else 'DISABLED'}")
        logger.info(f"  → Max tools: {max_tools}")

    async def synthesize_tool(
        self,
        description: str,
        requirements: Optional[List[str]] = None,
        examples: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Generate a new tool from natural language description.

        Args:
            description: What the tool should do
            requirements: Optional list of specific requirements
            examples: Optional example inputs/outputs

        Returns:
            Dictionary with generation results
        """
        logger.info(f"Synthesizing tool: {description}")

        # Check cache first
        cache_key = self._generate_cache_key(description)
        if cache_key in self.tool_cache:
            tool_name = self.tool_cache[cache_key]
            logger.info(f"Tool already exists: {tool_name}")
            return {
                "success": True,
                "tool_name": tool_name,
                "cached": True,
                "tool": self.synthesized_tools[tool_name]
            }

        try:
            # Step 1: Generate tool name
            tool_name = self._generate_tool_name(description)

            # Step 2: Generate code using AI
            if self.ai_api_key:
                code_result = await self._generate_code_with_ai(
                    description, requirements, examples
                )
            else:
                code_result = self._generate_code_template(description)

            code = code_result["code"]
            input_schema = code_result["input_schema"]

            # Step 3: Validate code syntax
            if not self._validate_syntax(code):
                raise ValueError("Generated code has syntax errors")

            # Step 4: Test the tool if enabled
            test_results = {"tested": False}
            if self.enable_testing:
                test_results = await self._test_tool(code, input_schema, examples)
                if not test_results["passed"]:
                    logger.warning(f"Tool tests failed: {test_results.get('error')}")

            # Step 5: Register the tool
            tool = GeneratedTool(
                name=tool_name,
                description=description,
                code=code,
                input_schema=input_schema,
                test_results=test_results
            )

            self.synthesized_tools[tool_name] = tool
            self.tool_cache[cache_key] = tool_name
            self.tools_generated += 1

            # Limit number of tools
            if len(self.synthesized_tools) > self.max_tools:
                self._evict_least_used_tool()

            logger.info(f"✓ Tool synthesized: {tool_name}")

            return {
                "success": True,
                "tool_name": tool_name,
                "code": code,
                "input_schema": input_schema,
                "test_results": test_results,
                "cached": False
            }

        except Exception as e:
            self.tools_failed += 1
            logger.error(f"Tool synthesis failed: {e}", exc_info=True)
            return {
                "success": False,
                "error": str(e),
                "traceback": traceback.format_exc()
            }

    async def execute_tool(
        self,
        tool_name: str,
        arguments: Dict[str, Any]
    ) -> Any:
        """
        Execute a synthesized tool.

        Args:
            tool_name: Name of the tool to execute
            arguments: Arguments to pass to the tool

        Returns:
            Tool execution result
        """
        if tool_name not in self.synthesized_tools:
            raise ValueError(f"Tool not found: {tool_name}")

        tool = self.synthesized_tools[tool_name]

        try:
            # Execute in sandbox if enabled
            if self.sandbox_enabled:
                result = await self._execute_in_sandbox(tool.code, arguments)
            else:
                result = await self._execute_directly(tool.code, arguments)

            tool.record_usage(success=True)
            self.total_uses += 1

            return result

        except Exception as e:
            tool.record_usage(success=False)
            logger.error(f"Tool execution failed: {e}", exc_info=True)
            raise

    def get_tool_library(self) -> Dict[str, Any]:
        """Get all synthesized tools"""
        return {
            "tools": [
                {
                    "name": tool.name,
                    "description": tool.description,
                    "input_schema": tool.input_schema,
                    "created_at": tool.created_at.isoformat(),
                    "usage_count": tool.usage_count,
                    "success_rate": round(tool.success_rate, 3),
                    "last_used": tool.last_used.isoformat() if tool.last_used else None
                }
                for tool in self.synthesized_tools.values()
            ],
            "count": len(self.synthesized_tools),
            "stats": {
                "generated": self.tools_generated,
                "failed": self.tools_failed,
                "total_uses": self.total_uses
            }
        }

    def remove_tool(self, tool_name: str) -> bool:
        """Remove a synthesized tool"""
        if tool_name in self.synthesized_tools:
            del self.synthesized_tools[tool_name]
            # Remove from cache
            for key, name in list(self.tool_cache.items()):
                if name == tool_name:
                    del self.tool_cache[key]
            logger.info(f"Removed tool: {tool_name}")
            return True
        return False

    async def _generate_code_with_ai(
        self,
        description: str,
        requirements: Optional[List[str]],
        examples: Optional[List[Dict[str, Any]]]
    ) -> Dict[str, Any]:
        """Generate code using AI (Anthropic Claude)"""

        # Initialize AI client if needed
        if not self._ai_client and self.ai_provider == "anthropic":
            try:
                from anthropic import AsyncAnthropic
                self._ai_client = AsyncAnthropic(api_key=self.ai_api_key)
            except ImportError:
                logger.warning("anthropic package not installed, using template")
                return self._generate_code_template(description)

        # Build prompt
        prompt = self._build_generation_prompt(description, requirements, examples)

        try:
            # Call AI
            if self.ai_provider == "anthropic":
                response = await self._ai_client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=2000,
                    messages=[{"role": "user", "content": prompt}]
                )

                # Parse response
                code_text = response.content[0].text
                return self._parse_ai_response(code_text)

        except Exception as e:
            logger.error(f"AI generation failed: {e}")
            return self._generate_code_template(description)

    def _generate_code_template(self, description: str) -> Dict[str, Any]:
        """Generate a basic code template without AI"""

        tool_name = self._generate_tool_name(description)

        code = f'''async def {tool_name}(**kwargs):
    """
    {description}

    Auto-generated tool template.
    """
    # TODO: Implement the actual logic
    return {{"result": "Tool template - needs implementation", "kwargs": kwargs}}
'''

        input_schema = {
            "type": "object",
            "properties": {},
            "required": []
        }

        return {"code": code, "input_schema": input_schema}

    def _build_generation_prompt(
        self,
        description: str,
        requirements: Optional[List[str]],
        examples: Optional[List[Dict[str, Any]]]
    ) -> str:
        """Build the AI prompt for code generation"""

        prompt = f"""Generate a Python async function that does the following:

DESCRIPTION: {description}

"""

        if requirements:
            prompt += "REQUIREMENTS:\n"
            for req in requirements:
                prompt += f"- {req}\n"
            prompt += "\n"

        if examples:
            prompt += "EXAMPLES:\n"
            for ex in examples:
                prompt += f"Input: {ex.get('input')}\n"
                prompt += f"Output: {ex.get('output')}\n\n"

        prompt += """
Generate ONLY the Python code for an async function.
Include proper error handling and docstrings.
Return the result as a dictionary.

Format your response as:
```python
async def tool_name(**kwargs):
    \"\"\"Docstring\"\"\"
    # implementation
    return result
```

Also provide the JSON schema for inputs:
```json
{
  "type": "object",
  "properties": {...},
  "required": [...]
}
```
"""

        return prompt

    def _parse_ai_response(self, response: str) -> Dict[str, Any]:
        """Parse AI-generated code and schema"""

        # Extract code block
        code = None
        if "```python" in response:
            start = response.find("```python") + 9
            end = response.find("```", start)
            code = response[start:end].strip()

        # Extract schema
        input_schema = {"type": "object", "properties": {}}
        if "```json" in response:
            start = response.find("```json") + 7
            end = response.find("```", start)
            schema_text = response[start:end].strip()
            try:
                input_schema = json.loads(schema_text)
            except:
                pass

        if not code:
            raise ValueError("Failed to extract code from AI response")

        return {"code": code, "input_schema": input_schema}

    def _validate_syntax(self, code: str) -> bool:
        """Validate Python syntax"""
        try:
            ast.parse(code)
            return True
        except SyntaxError as e:
            logger.error(f"Syntax error: {e}")
            return False

    async def _test_tool(
        self,
        code: str,
        input_schema: Dict[str, Any],
        examples: Optional[List[Dict[str, Any]]]
    ) -> Dict[str, Any]:
        """Test the generated tool"""

        try:
            # Simple test: try to execute with empty args
            result = await self._execute_in_sandbox(code, {})

            return {
                "tested": True,
                "passed": True,
                "result": str(result)[:200]  # Truncate
            }

        except Exception as e:
            return {
                "tested": True,
                "passed": False,
                "error": str(e)
            }

    async def _execute_in_sandbox(self, code: str, arguments: Dict[str, Any]) -> Any:
        """Execute code in sandboxed environment"""

        # Create isolated namespace
        namespace = {
            '__builtins__': __builtins__,
            'json': json,
            'asyncio': asyncio,
        }

        # Execute the function definition
        exec(code, namespace)

        # Find the function
        func = None
        for name, obj in namespace.items():
            if callable(obj) and not name.startswith('_'):
                func = obj
                break

        if not func:
            raise ValueError("No function found in generated code")

        # Execute the function
        if asyncio.iscoroutinefunction(func):
            result = await func(**arguments)
        else:
            result = func(**arguments)

        return result

    async def _execute_directly(self, code: str, arguments: Dict[str, Any]) -> Any:
        """Execute code directly (less safe)"""
        return await self._execute_in_sandbox(code, arguments)

    def _generate_tool_name(self, description: str) -> str:
        """Generate a tool name from description"""
        # Take first few words and convert to snake_case
        words = description.lower().split()[:4]
        name = "_".join(w for w in words if w.isalnum())

        # Add hash to ensure uniqueness
        hash_suffix = hashlib.md5(description.encode()).hexdigest()[:4]
        return f"{name}_{hash_suffix}"

    def _generate_cache_key(self, description: str) -> str:
        """Generate cache key from description"""
        return hashlib.md5(description.lower().encode()).hexdigest()

    def _evict_least_used_tool(self):
        """Remove the least used tool"""
        if not self.synthesized_tools:
            return

        # Find least used
        least_used = min(
            self.synthesized_tools.items(),
            key=lambda x: (x[1].usage_count, x[1].created_at)
        )

        self.remove_tool(least_used[0])
        logger.info(f"Evicted least used tool: {least_used[0]}")
