import asyncio
from mcp.server import Server
from mcp.types import Tool, TextContent
import pyautogui
import json

app = Server("windows-automation")

@app.list_tools()
async def list_tools():
    return [
        Tool(
            name="screenshot",
            description="Take a screenshot",
            inputSchema={
                "type": "object",
                "properties": {},
            }
        ),
        Tool(
            name="click",
            description="Click at coordinates",
            inputSchema={
                "type": "object",
                "properties": {
                    "x": {"type": "number"},
                    "y": {"type": "number"}
                },
                "required": ["x", "y"]
            }
        ),
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "screenshot":
        screenshot = pyautogui.screenshot()
        screenshot.save("screenshot.png")
        return [TextContent(type="text", text="Screenshot saved")]
    
    elif name == "click":
        pyautogui.click(arguments["x"], arguments["y"])
        return [TextContent(type="text", text=f"Clicked at {arguments['x']}, {arguments['y']}")]

async def main():
    from mcp.server.stdio import stdio_server
    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream, app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
