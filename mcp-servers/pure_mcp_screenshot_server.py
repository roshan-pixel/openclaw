# pure_mcp_screenshot_server.py
import asyncio
from mcp.server import Server
from mcp.types import Tool, ImageContent
from mcp.server.stdio import stdio_server
import pyautogui, base64
from io import BytesIO

server = Server("windows-control")

@server.list_tools()
async def list_tools():
    return [Tool(
        name="windows-mcp-snapshot",
        description="Take a full-screen screenshot",
        inputSchema={"type": "object", "properties": {}}
    )]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name != "windows-mcp-snapshot":
        return []
    img = pyautogui.screenshot()
    buf = BytesIO()
    img.save(buf, format="PNG")
    data = base64.b64encode(buf.getvalue()).decode("utf-8")
    return [ImageContent(type="image", mimeType="image/png", data=data)]

async def main():
    async with stdio_server() as (r, w):
        init = server.create_initialization_options()
        await server.run(r, w, init)

if __name__ == "__main__":
    asyncio.run(main())
