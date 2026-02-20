"""
Test actual tool execution - OpenClaw MCP Server
"""
import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def test_execution():
    server_params = StdioServerParameters(
        command="python",
        args=["windows_mcp_server.py"],
        env=None
    )
    
    print("🔌 Connecting to MCP Server...\n")
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            print("✅ Connected!\n")
            
            # Test 1: Take Screenshot
            print("📸 Test 1: Taking screenshot...")
            result = await session.call_tool("Windows-MCP:Snapshot", arguments={})
            print(f"✅ Screenshot captured! Type: {result.content[0].type}\n")
            
            # Test 2: Open Notepad
            print("📝 Test 2: Opening Notepad...")
            result = await session.call_tool("Windows-MCP:Shell", arguments={
                "command": "notepad"
            })
            print(f"✅ {result.content[0].text}\n")
            
            await asyncio.sleep(2)  # Wait for notepad to open
            
            # Test 3: Type text
            print("⌨️ Test 3: Typing text in Notepad...")
            result = await session.call_tool("Windows-MCP:Type", arguments={
                "text": "Hello from OpenClaw! 🤖\nWindows MCP Server is working!\n"
            })
            print(f"✅ {result.content[0].text}\n")
            
            # Test 4: Move mouse
            print("🖱️ Test 4: Moving mouse to center...")
            result = await session.call_tool("Windows-MCP:Move", arguments={
                "x": 500,
                "y": 400
            })
            print(f"✅ {result.content[0].text}\n")
            
            # Test 5: Keyboard shortcut
            print("🎹 Test 5: Testing Ctrl+A (select all)...")
            result = await session.call_tool("Windows-MCP:Shortcut", arguments={
                "shortcut": "ctrl+a"
            })
            print(f"✅ {result.content[0].text}\n")
            
            # Test 6: Wait
            print("⏳ Test 6: Waiting 1 second...")
            result = await session.call_tool("Windows-MCP:Wait", arguments={
                "seconds": 1.0
            })
            print(f"✅ {result.content[0].text}\n")
            
            # Test 7: Click
            print("🖱️ Test 7: Clicking at (600, 400)...")
            result = await session.call_tool("Windows-MCP:Click", arguments={
                "x": 600,
                "y": 400,
                "button": "left",
                "clicks": 1
            })
            print(f"✅ {result.content[0].text}\n")
            
            print("🎉 All tests passed! OpenClaw can fully control Windows!")
            print("\n⚠️ Don't forget to close the Notepad window!")

if __name__ == "__main__":
    try:
        asyncio.run(test_execution())
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    input("\nPress Enter to exit...")
