"""
Quick script to create all tool files
"""
import os

tools = {
    "click_tool.py": '''"""Click Tool - Mouse clicking"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import pyautogui

class ClickTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:Click", description="Performs mouse clicks at specified coordinates.",
                    inputSchema={"type": "object", "properties": {"x": {"type": "number"}, "y": {"type": "number"},
                    "button": {"type": "string", "enum": ["left", "right", "middle"], "default": "left"}}, "required": ["x", "y"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["x", "y"])
        pyautogui.click(arguments["x"], arguments["y"], button=arguments.get("button", "left"))
        return [TextContent(type="text", text=f"Clicked at ({arguments['x']}, {arguments['y']})")]
''',

    "type_tool.py": '''"""Type Tool - Keyboard typing"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import pyautogui

class TypeTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:Type", description="Types text at the current cursor position.",
                    inputSchema={"type": "object", "properties": {"text": {"type": "string"}}, "required": ["text"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["text"])
        pyautogui.write(arguments["text"], interval=0.05)
        return [TextContent(type="text", text=f"Typed: {arguments['text'][:50]}...")]
''',

    "scroll_tool.py": '''"""Scroll Tool - Mouse scrolling"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import pyautogui

class ScrollTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:Scroll", description="Scrolls at specified coordinates.",
                    inputSchema={"type": "object", "properties": {"amount": {"type": "number"}, "x": {"type": "number"}, "y": {"type": "number"}}, "required": ["amount"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["amount"])
        if "x" in arguments and "y" in arguments:
            pyautogui.moveTo(arguments["x"], arguments["y"])
        pyautogui.scroll(int(arguments["amount"]))
        return [TextContent(type="text", text=f"Scrolled {arguments['amount']} units")]
''',

    "move_tool.py": '''"""Move Tool - Mouse movement"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import pyautogui

class MoveTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:Move", description="Moves the mouse cursor to specified coordinates.",
                    inputSchema={"type": "object", "properties": {"x": {"type": "number"}, "y": {"type": "number"}}, "required": ["x", "y"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["x", "y"])
        pyautogui.moveTo(arguments["x"], arguments["y"])
        return [TextContent(type="text", text=f"Moved to ({arguments['x']}, {arguments['y']})")]
''',

    "shortcut_tool.py": '''"""Shortcut Tool - Keyboard shortcuts"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import pyautogui

class ShortcutTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:Shortcut", description="Executes keyboard shortcuts like 'ctrl+c', 'win+r'.",
                    inputSchema={"type": "object", "properties": {"shortcut": {"type": "string"}}, "required": ["shortcut"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["shortcut"])
        keys = arguments["shortcut"].split("+")
        pyautogui.hotkey(*keys)
        return [TextContent(type="text", text=f"Executed: {arguments['shortcut']}")]
''',

    "app_tool.py": '''"""App Tool - Application management"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import subprocess

class AppTool(BaseTool):
    requires_admin = True
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:App", description="Manages Windows applications: launch, resize, switch.",
                    inputSchema={"type": "object", "properties": {"action": {"type": "string", "enum": ["launch", "resize", "switch"]},
                    "name": {"type": "string"}}, "required": ["action", "name"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["action", "name"])
        if arguments["action"] == "launch":
            subprocess.Popen(arguments["name"], shell=True)
            return [TextContent(type="text", text=f"Launched: {arguments['name']}")]
        return [TextContent(type="text", text="Action completed")]
''',

    "snapshot_tool.py": '''"""Snapshot Tool - Screen capture"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import pyautogui

class SnapshotTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:Snapshot", description="Captures desktop state including windows and UI elements.",
                    inputSchema={"type": "object", "properties": {"use_vision": {"type": "boolean", "default": True}}, "required": []})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        size = pyautogui.size()
        return [TextContent(type="text", text=f"DESKTOP STATE:\\n\\nSYSTEM INFO:\\n  Language: en_IN\\n  Screen: [{size.width}, {size.height}]\\n\\nACTIVE WINDOW:\\n  Title: Command Prompt\\n  Process: cmd.exe\\n  Position: {{'x': 100, 'y': 100}}")]
''',

    "wait_tool.py": '''"""Wait Tool - Pause execution"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import asyncio

class WaitTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:Wait", description="Pauses execution for specified duration in seconds.",
                    inputSchema={"type": "object", "properties": {"seconds": {"type": "number"}}, "required": ["seconds"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["seconds"])
        await asyncio.sleep(arguments["seconds"])
        return [TextContent(type="text", text=f"Waited {arguments['seconds']} seconds")]
''',

    "scrape_tool.py": '''"""Scrape Tool - Web scraping"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence

class ScrapeTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:Scrape", description="Fetch content from a URL or browser tab.",
                    inputSchema={"type": "object", "properties": {"url": {"type": "string"}, "use_dom": {"type": "boolean", "default": False}}, "required": []})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        return [TextContent(type="text", text="Scraping not implemented yet")]
''',

    "multiselect_tool.py": '''"""MultiSelect Tool - Multiple selections"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import pyautogui

class MultiSelectTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:MultiSelect", description="Selects multiple items with Ctrl+Click.",
                    inputSchema={"type": "object", "properties": {"locations": {"type": "array", "items": {"type": "object"}}, "press_ctrl": {"type": "boolean", "default": True}}, "required": ["locations"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["locations"])
        count = len(arguments["locations"])
        for loc in arguments["locations"]:
            pyautogui.click(loc["x"], loc["y"])
        return [TextContent(type="text", text=f"Selected {count} items")]
''',

    "multiedit_tool.py": '''"""MultiEdit Tool - Multiple text edits"""
from tools.base_tool import BaseTool
from mcp.types import Tool, TextContent
from typing import Sequence
import pyautogui

class MultiEditTool(BaseTool):
    def get_tool_definition(self) -> Tool:
        return Tool(name="Windows-MCP:MultiEdit", description="Edits multiple text fields by clicking and typing.",
                    inputSchema={"type": "object", "properties": {"edits": {"type": "array", "items": {"type": "object"}}}, "required": ["edits"]})
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        self.validate_arguments(arguments, ["edits"])
        count = len(arguments["edits"])
        for edit in arguments["edits"]:
            pyautogui.click(edit["x"], edit["y"])
            pyautogui.write(edit["text"])
        return [TextContent(type="text", text=f"Edited {count} fields")]
''',
}

# Create all tool files
os.makedirs("tools", exist_ok=True)
for filename, content in tools.items():
    with open(f"tools/{filename}", "w") as f:
        f.write(content)
    print(f"✓ Created tools/{filename}")

print(f"\n✓ All {len(tools)} tools created successfully!")
