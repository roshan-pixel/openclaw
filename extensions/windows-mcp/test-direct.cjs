const { MCPBridge } = require("./mcp-bridge.js");
const path = require("path");

async function test() {
  const serverPath = path.join(__dirname, "..", "..", "mcp-servers", "windows_mcp_server.py");
  const bridge = new MCPBridge(serverPath);

  try {
    console.log("🚀 Starting MCP server...\n");
    const tools = await bridge.start();
    console.log(`✅ Loaded ${tools.length} tools\n`);

    // Test 1: Wait Tool
    console.log("📋 Test 1: Wait for 2 seconds");
    const wait = await bridge.callTool("Windows-MCP:Wait", { duration: 2 });
    console.log("Result:", wait[0]?.text || JSON.stringify(wait));

    // Test 2: Snapshot Tool
    console.log("\n📋 Test 2: Take desktop snapshot");
    const snapshot = await bridge.callTool("Windows-MCP:Snapshot", { use_vision: false });
    console.log("Result length:", JSON.stringify(snapshot).length, "bytes");
    console.log("Preview:", JSON.stringify(snapshot).substring(0, 200) + "...");

    // Test 3: Scrape Tool
    console.log("\n📋 Test 3: Scrape example.com");
    const scrape = await bridge.callTool("Windows-MCP:Scrape", { url: "https://example.com" });
    console.log("Result:", scrape[0]?.text?.substring(0, 100) + "...");

    console.log("\n\n🎉 All tests passed!");
    bridge.stop();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    bridge.stop();
    process.exit(1);
  }
}

test();
