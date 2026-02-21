"""
Test Enhanced Snapshot Features - OCR and UI Tree
"""
import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def test_enhanced():
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
            
            # Test 1: Basic Screenshot
            print("=" * 60)
            print("📸 Test 1: Basic Screenshot")
            print("=" * 60)
            result = await session.call_tool("Windows-MCP:Snapshot", arguments={})
            print(f"✅ Screenshot captured: {result.content[0].type}\n")
            
            # Test 2: With Accessibility Info
            print("=" * 60)
            print("🪟 Test 2: Screenshot + Accessibility")
            print("=" * 60)
            result = await session.call_tool("Windows-MCP:Snapshot", arguments={
                "include_accessibility": True
            })
            print(f"✅ Screenshot: {result.content[0].type}")
            if len(result.content) > 1:
                print(f"✅ Window info:\n{result.content[1].text[:300]}...\n")
            
            # Test 3: With OCR
            print("=" * 60)
            print("📝 Test 3: Screenshot + OCR")
            print("=" * 60)
            result = await session.call_tool("Windows-MCP:Snapshot", arguments={
                "include_ocr": True
            })
            print(f"✅ Screenshot: {result.content[0].type}")
            if len(result.content) > 1:
                print(f"✅ OCR text:\n{result.content[1].text[:200]}...\n")
            
            # Test 4: Full Enhanced (All features)
            print("=" * 60)
            print("🚀 Test 4: Full Enhanced Snapshot")
            print("=" * 60)
            result = await session.call_tool("Windows-MCP:Snapshot", arguments={
                "include_accessibility": True,
                "include_ocr": True,
                "include_ui_tree": True
            })
            print(f"✅ Screenshot: {result.content[0].type}")
            if len(result.content) > 1:
                print(f"✅ Full report:\n{result.content[1].text[:400]}...\n")
            
            print("=" * 60)
            print("🎉 All enhanced features tested!")
            print("=" * 60)

if __name__ == "__main__":
    try:
        asyncio.run(test_enhanced())
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    input("\nPress Enter to exit...")
