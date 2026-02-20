import asyncio
import sys

async def test_connection():
    print("Starting test...")
    print(f"Python: {sys.version}")
    
    try:
        from mcp import ClientSession, StdioServerParameters
        from mcp.client.stdio import stdio_client
        print("✅ MCP imports successful")
        
        server_params = StdioServerParameters(
            command="python",
            args=["windows_mcp_server.py"],
            env=None
        )
        
        print("🔌 Connecting to Windows MCP Server...")
        
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                print("✅ Connection successful!\n")
                
                tools = await session.list_tools()
                print(f"📦 Found {len(tools.tools)} tools:\n")
                
                for i, tool in enumerate(tools.tools, 1):
                    print(f"{i}. {tool.name}")
                
                print("\n🎉 OpenClaw can access all tools!")
                
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_connection())
    input("\nPress Enter to exit...")
