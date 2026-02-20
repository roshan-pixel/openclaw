import asyncio
from tools.snapshot_tool import SnapshotTool
from tools.wait_tool import WaitTool
from tools.scrape_tool import ScrapeTool

async def test_tools():
    print("\n=== Testing Wait Tool ===")
    wait_tool = WaitTool()
    result = await wait_tool.execute({"duration": 2})
    print(f"Result: {result[0].text}")
    
    print("\n=== Testing Snapshot Tool ===")
    snapshot_tool = SnapshotTool()
    result = await snapshot_tool.execute({"use_vision": False})
    print(f"Desktop State Captured: {len(result[0].text)} characters")
    
    print("\n=== Testing Scrape Tool ===")
    scrape_tool = ScrapeTool()
    result = await scrape_tool.execute({"url": "https://example.com"})
    print(f"Scraped: {result[0].text[:100]}...")
    
    print("\n✅ All tools working!")

if __name__ == "__main__":
    asyncio.run(test_tools())
