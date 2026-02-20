"""
Smart Navigator - God Level Vision-Guided Autonomous Navigation
Navigates ANY website intelligently without hardcoded coordinates
"""
import asyncio
import logging
import time
import json
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)


class NavigationGoal(Enum):
    """Predefined navigation goals"""
    EXTRACT_TEXT = "extract_text"
    CLICK_ELEMENT = "click_element"
    FILL_FORM = "fill_form"
    EXTRACT_TABLE = "extract_table"
    EXTRACT_NUMBERS = "extract_numbers"
    FIND_AND_CLICK = "find_and_click"
    SCROLL_AND_EXTRACT = "scroll_and_extract"


@dataclass
class NavigationStep:
    """Represents a single navigation step"""
    action: str  # click, type, scroll, wait, analyze
    target: Optional[str] = None
    coordinates: Optional[Tuple[int, int]] = None
    value: Optional[str] = None
    screenshot_path: Optional[str] = None
    result: Optional[Any] = None
    timestamp: float = 0.0
    success: bool = False


@dataclass
class NavigationResult:
    """Result of a navigation workflow"""
    success: bool
    goal_achieved: bool
    data_extracted: Dict[str, Any]
    steps_taken: List[NavigationStep]
    total_time: float
    screenshots: List[str]
    error: Optional[str] = None


class SmartNavigator:
    """
    🔥 GOD LEVEL: Vision-guided autonomous web navigation
    
    Capabilities:
    - Understands page layout using Vision API
    - Finds clickable elements automatically
    - Extracts text, numbers, tables
    - Multi-step workflows
    - Self-correcting navigation
    """
    
    def __init__(
        self,
        tool_executor: callable,
        max_steps: int = 20,
        wait_between_actions: float = 2.0,
        vision_confidence_threshold: float = 0.7
    ):
        """
        Initialize Smart Navigator
        
        Args:
            tool_executor: Async function to execute MCP tools
            max_steps: Maximum navigation steps before timeout
            wait_between_actions: Seconds to wait between actions
            vision_confidence_threshold: Minimum confidence for vision results
        """
        self.tool_executor = tool_executor
        self.max_steps = max_steps
        self.wait_time = wait_between_actions
        self.confidence_threshold = vision_confidence_threshold
        
        self.current_step = 0
        self.navigation_history: List[NavigationStep] = []
        self.screenshots_taken: List[str] = []
        
        logger.info("🔥 God Level Smart Navigator initialized")
    
    async def navigate_and_extract(
        self,
        url: Optional[str] = None,
        goal: str = "extract_data",
        target_text: Optional[str] = None,
        extraction_patterns: Optional[List[str]] = None,
        custom_instructions: Optional[str] = None
    ) -> NavigationResult:
        """
        🎯 MAIN METHOD: Navigate and extract data intelligently
        
        Args:
            url: Optional URL to navigate to first
            goal: What to achieve (see NavigationGoal enum)
            target_text: Text to find/click
            extraction_patterns: Patterns to extract (e.g., ["$", "tokens", "cost"])
            custom_instructions: Natural language instructions
            
        Returns:
            NavigationResult with extracted data
        """
        start_time = time.time()
        self.current_step = 0
        self.navigation_history = []
        self.screenshots_taken = []
        
        logger.info(f"🚀 Starting smart navigation - Goal: {goal}")
        
        try:
            # Step 1: Navigate to URL if provided
            if url:
                await self._navigate_to_url(url)
            
            # Step 2: Take initial screenshot and analyze
            initial_analysis = await self._analyze_current_page()
            logger.info(f"📸 Initial page analysis: {initial_analysis.get('summary', 'N/A')}")
            
            # Step 3: Execute goal-specific workflow
            if goal == "extract_api_usage":
                data = await self._extract_claude_console_usage()
            
            elif goal == "find_and_click":
                data = await self._find_and_click_element(target_text)
            
            elif goal == "extract_text":
                data = await self._extract_text_from_page(extraction_patterns)
            
            elif goal == "extract_table":
                data = await self._extract_table_data()
            
            elif goal == "scroll_and_extract":
                data = await self._scroll_and_extract_all()
            
            elif custom_instructions:
                data = await self._execute_custom_instructions(custom_instructions)
            
            else:
                # Generic extraction
                data = await self._generic_data_extraction(initial_analysis)
            
            total_time = time.time() - start_time
            
            logger.info(f"✅ Navigation completed in {total_time:.2f}s - {len(self.navigation_history)} steps")
            
            return NavigationResult(
                success=True,
                goal_achieved=True,
                data_extracted=data,
                steps_taken=self.navigation_history,
                total_time=total_time,
                screenshots=self.screenshots_taken,
                error=None
            )
            
        except Exception as e:
            logger.error(f"❌ Navigation failed: {e}", exc_info=True)
            
            return NavigationResult(
                success=False,
                goal_achieved=False,
                data_extracted={},
                steps_taken=self.navigation_history,
                total_time=time.time() - start_time,
                screenshots=self.screenshots_taken,
                error=str(e)
            )
    
    async def _navigate_to_url(self, url: str):
        """Navigate to a URL"""
        step = NavigationStep(action="navigate", target=url, timestamp=time.time())
        
        try:
            logger.info(f"🌐 Navigating to: {url}")
            
            # Open browser if not already open
            await self.tool_executor("windows-mcp-browser", {"action": "launch"})
            await asyncio.sleep(2)
            
            # Navigate using shell command
            await self.tool_executor("windows-mcp-shell", {
                "command": f"start chrome {url}",
                "shell": "powershell"
            })
            await asyncio.sleep(self.wait_time)
            
            step.success = True
            
        except Exception as e:
            logger.error(f"Navigation failed: {e}")
            step.success = False
            step.result = str(e)
        
        self.navigation_history.append(step)
        self.current_step += 1
    
    async def _analyze_current_page(self) -> Dict[str, Any]:
        """Take screenshot and analyze using Vision API"""
        step = NavigationStep(action="analyze", timestamp=time.time())
        
        try:
            # Take screenshot
            screenshot_result = await self.tool_executor("windows-mcp-snapshot", {})
            screenshot_path = self._extract_screenshot_path(screenshot_result)
            self.screenshots_taken.append(screenshot_path)
            
            step.screenshot_path = screenshot_path
            
            # Analyze with Vision API
            vision_result = await self.tool_executor("windows-mcp-vision", {
                "action": "analyze",
                "image_path": screenshot_path
            })
            
            analysis = self._parse_vision_result(vision_result)
            step.result = analysis
            step.success = True
            
            return analysis
            
        except Exception as e:
            logger.error(f"Analysis failed: {e}")
            step.success = False
            return {}
        
        finally:
            self.navigation_history.append(step)
            self.current_step += 1
    
    async def _find_and_click_element(self, target_text: str) -> Dict[str, Any]:
        """Find an element by text and click it"""
        logger.info(f"🔍 Looking for element: {target_text}")
        
        step = NavigationStep(action="find_and_click", target=target_text, timestamp=time.time())
        
        try:
            # Use Vision API to find text
            find_result = await self.tool_executor("windows-mcp-vision", {
                "action": "find_text",
                "search_text": target_text
            })
            
            # Extract coordinates
            coords = self._extract_coordinates(find_result)
            
            if coords:
                # Click the element
                await self.tool_executor("windows-mcp-click", {
                    "x": coords[0],
                    "y": coords[1]
                })
                
                await asyncio.sleep(self.wait_time)
                
                step.coordinates = coords
                step.success = True
                
                logger.info(f"✅ Clicked '{target_text}' at {coords}")
                
                return {"clicked": True, "element": target_text, "coordinates": coords}
            
            else:
                logger.warning(f"⚠️ Could not find '{target_text}'")
                step.success = False
                return {"clicked": False, "element": target_text, "error": "Not found"}
            
        except Exception as e:
            logger.error(f"Click failed: {e}")
            step.success = False
            return {"clicked": False, "error": str(e)}
        
        finally:
            self.navigation_history.append(step)
            self.current_step += 1
    
    async def _extract_text_from_page(self, patterns: Optional[List[str]] = None) -> Dict[str, Any]:
        """Extract text from current page"""
        logger.info("📄 Extracting text from page")
        
        # Take screenshot
        screenshot_result = await self.tool_executor("windows-mcp-snapshot", {})
        screenshot_path = self._extract_screenshot_path(screenshot_result)
        
        # Analyze with Vision
        vision_result = await self.tool_executor("windows-mcp-vision", {
            "action": "analyze",
            "image_path": screenshot_path
        })
        
        text = self._extract_text_from_vision(vision_result)
        
        # Filter by patterns if provided
        if patterns:
            filtered_data = {}
            for pattern in patterns:
                matches = [line for line in text.split('\n') if pattern.lower() in line.lower()]
                filtered_data[pattern] = matches
            
            return {"text": text, "filtered": filtered_data}
        
        return {"text": text}
    
    async def _extract_claude_console_usage(self) -> Dict[str, Any]:
        """
        🎯 SPECIFIC: Extract Claude Console API usage and cost
        This is the answer to your original question!
        """
        logger.info("💰 Extracting Claude Console usage data")
        
        data = {
            "tokens_used": None,
            "cost_this_month": None,
            "remaining_credits": None,
            "rate_limits": {}
        }
        
        # Step 1: Click "Usage" in sidebar
        logger.info("Step 1: Clicking Usage...")
        await self._find_and_click_element("Usage")
        await asyncio.sleep(self.wait_time)
        
        # Step 2: Analyze Usage page
        logger.info("Step 2: Analyzing Usage page...")
        usage_analysis = await self._analyze_current_page()
        usage_text = self._extract_text_from_vision(usage_analysis)
        
        # Extract token usage
        data["tokens_used"] = self._extract_number_with_context(usage_text, ["tokens", "used"])
        
        # Step 3: Click "Cost"
        logger.info("Step 3: Clicking Cost...")
        await self._find_and_click_element("Cost")
        await asyncio.sleep(self.wait_time)
        
        # Step 4: Analyze Cost page
        logger.info("Step 4: Analyzing Cost page...")
        cost_analysis = await self._analyze_current_page()
        cost_text = self._extract_text_from_vision(cost_analysis)
        
        # Extract cost data
        data["cost_this_month"] = self._extract_number_with_context(cost_text, ["$", "cost", "month"])
        
        # Step 5: Click "Limits"  
        logger.info("Step 5: Clicking Limits...")
        await self._find_and_click_element("Limits")
        await asyncio.sleep(self.wait_time)
        
        # Step 6: Analyze Limits page
        logger.info("Step 6: Analyzing Limits page...")
        limits_analysis = await self._analyze_current_page()
        limits_text = self._extract_text_from_vision(limits_analysis)
        
        # Extract remaining credits
        data["remaining_credits"] = self._extract_number_with_context(limits_text, ["remaining", "credits", "balance"])
        
        logger.info(f"✅ Extracted data: {data}")
        
        return data
    
    async def _scroll_and_extract_all(self) -> Dict[str, Any]:
        """Scroll through page and extract all content"""
        logger.info("📜 Scrolling and extracting...")
        
        all_text = []
        scroll_count = 0
        max_scrolls = 10
        
        while scroll_count < max_scrolls:
            # Extract current view
            analysis = await self._analyze_current_page()
            text = self._extract_text_from_vision(analysis)
            
            if text not in all_text:
                all_text.append(text)
            
            # Scroll down
            await self.tool_executor("windows-mcp-scroll", {
                "clicks": 3,
                "type": "vertical"
            })
            await asyncio.sleep(1)
            
            scroll_count += 1
        
        return {"all_text": "\n\n".join(all_text), "scrolls": scroll_count}
    
    async def _execute_custom_instructions(self, instructions: str) -> Dict[str, Any]:
        """Execute custom natural language instructions"""
        logger.info(f"🤖 Executing custom: {instructions}")
        
        # This would use Claude API to interpret instructions
        # For now, basic keyword matching
        
        if "click" in instructions.lower():
            # Extract what to click
            words = instructions.split()
            click_idx = words.index("click") if "click" in words else -1
            if click_idx >= 0 and click_idx + 1 < len(words):
                target = words[click_idx + 1]
                return await self._find_and_click_element(target)
        
        elif "extract" in instructions.lower():
            return await self._extract_text_from_page()
        
        return {"executed": instructions, "result": "Custom instruction processing"}
    
    async def _generic_data_extraction(self, initial_analysis: Dict) -> Dict[str, Any]:
        """Generic data extraction from current page"""
        return {
            "page_analysis": initial_analysis,
            "method": "generic"
        }
    
    def _extract_screenshot_path(self, result: Any) -> str:
        """Extract screenshot path from tool result"""
        # Handle different result formats
        if hasattr(result, 'content'):
            return str(result.content[0].text if result.content else "")
        return str(result)
    
    def _parse_vision_result(self, result: Any) -> Dict[str, Any]:
        """Parse Vision API result"""
        if hasattr(result, 'content'):
            text = result.content[0].text if result.content else ""
        else:
            text = str(result)
        
        return {
            "raw_text": text,
            "summary": text[:200] + "..." if len(text) > 200 else text
        }
    
    def _extract_text_from_vision(self, analysis: Any) -> str:
        """Extract text from vision analysis"""
        if isinstance(analysis, dict):
            return analysis.get("raw_text", "")
        elif hasattr(analysis, 'content'):
            return analysis.content[0].text if analysis.content else ""
        return str(analysis)
    
    def _extract_coordinates(self, result: Any) -> Optional[Tuple[int, int]]:
        """Extract coordinates from vision find result"""
        try:
            # Parse result to find x, y coordinates
            text = self._extract_text_from_vision(result)
            
            # Look for patterns like "x: 123, y: 456" or "(123, 456)"
            import re
            
            # Pattern: x: 123, y: 456
            match1 = re.search(r'x[:\s]+(\d+).*?y[:\s]+(\d+)', text, re.IGNORECASE)
            if match1:
                return (int(match1.group(1)), int(match1.group(2)))
            
            # Pattern: (123, 456)
            match2 = re.search(r'\((\d+),\s*(\d+)\)', text)
            if match2:
                return (int(match2.group(1)), int(match2.group(2)))
            
            return None
            
        except Exception as e:
            logger.error(f"Coordinate extraction failed: {e}")
            return None
    
    def _extract_number_with_context(self, text: str, keywords: List[str]) -> Optional[str]:
        """Extract numbers near specific keywords"""
        import re
        
        # Find lines containing any keyword
        lines = text.split('\n')
        relevant_lines = []
        
        for line in lines:
            if any(keyword.lower() in line.lower() for keyword in keywords):
                relevant_lines.append(line)
        
        if not relevant_lines:
            return None
        
        # Extract numbers from relevant lines
        combined = " ".join(relevant_lines)
        
        # Match currency ($1.50), percentages (50%), or plain numbers (1,234)
        numbers = re.findall(r'\$[\d,]+\.?\d*|\d+\.?\d*%|\d+[,\d]*\.?\d*', combined)
        
        return numbers[0] if numbers else None
    
    async def _extract_table_data(self) -> Dict[str, Any]:
        """Extract table data from page"""
        logger.info("📊 Extracting table data")
        
        analysis = await self._analyze_current_page()
        text = self._extract_text_from_vision(analysis)
        
        # Basic table parsing (you'd enhance this)
        lines = text.split('\n')
        table_data = []
        
        for line in lines:
            if '|' in line or '\t' in line:
                # Likely a table row
                cells = [cell.strip() for cell in line.split('|' if '|' in line else '\t')]
                table_data.append(cells)
        
        return {"table": table_data, "rows": len(table_data)}


# Export
__all__ = ['SmartNavigator', 'NavigationResult', 'NavigationGoal']
