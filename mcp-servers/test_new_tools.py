"""
Test the 3 new tools - Scrape, MultiSelect, MultiEdit
For OpenClaw Windows MCP Server
"""
import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def test_new_tools():
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
            
            # Test 1: Scrape Tool - Scrape a website
            print("🌐 Test 1: Web Scraping...")
            print("Scraping example.com...")
            result = await session.call_tool("Windows-MCP:Scrape", arguments={
                "url": "https://example.com",
                "selector": "h1"
            })
            print(f"✅ Scraped content:\n{result.content[0].text[:200]}...\n")
            
            await asyncio.sleep(2)
            
            # Test 2: MultiSelect Tool - Select multiple items
            print("🖱️ Test 2: Multi-Select...")
            print("Opening File Explorer first...")
            result = await session.call_tool("Windows-MCP:Shell", arguments={
                "command": "explorer C:\\"
            })
            print(f"✅ {result.content[0].text}")
            
            await asyncio.sleep(3)  # Wait for explorer to open
            
            print("Selecting multiple items (simulated coordinates)...")
            result = await session.call_tool("Windows-MCP:MultiSelect", arguments={
                "locations": [[300, 300], [300, 350], [300, 400]],
                "delay": 0.3
            })
            print(f"✅ {result.content[0].text}\n")
            
            await asyncio.sleep(2)
            
            # Test 3: MultiEdit Tool - Edit multiple fields
            print("📝 Test 3: Multi-Edit...")
            print("Opening 3 Notepad windows...")
            
            for i in range(3):
                await session.call_tool("Windows-MCP:Shell", arguments={
                    "command": "notepad"
                })
                await asyncio.sleep(1.5)
            
            print("Typing in multiple notepad windows...")
            result = await session.call_tool("Windows-MCP:MultiEdit", arguments={
                "edits": [
                    {
                        "location": [400, 300],
                        "text": "First notepad - OpenClaw Test 1",
                        "clear": False
                    },
                    {
                        "location": [450, 350],
                        "text": "Second notepad - OpenClaw Test 2",
                        "clear": False
                    },
                    {
                        "location": [500, 400],
                        "text": "Third notepad - OpenClaw Test 3",
                        "clear": False
                    }
                ],
                "delay": 1.0
            })
            print(f"✅ {result.content[0].text}\n")
            
            print("🎉 All 3 new tools tested successfully!")
            print("\n⚠️ Don't forget to close the Notepad windows and Explorer!")

if __name__ == "__main__":
    try:
        asyncio.run(test_new_tools())
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    input("\nPress Enter to exit...")
