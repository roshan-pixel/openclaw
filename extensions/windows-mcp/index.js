const { MCPBridge } = require("./mcp-bridge.js");
const path = require("path");

let mcpBridge = null;
let toolsReady = false;
let registeredTools = [];

// Start MCP server immediately
const serverPath = path.join(__dirname, "..", "..", "mcp-servers", "windows_mcp_server.py");
mcpBridge = new MCPBridge(serverPath);

// Start server in background
mcpBridge
  .start()
  .then((tools) => {
    console.log(`[windows-mcp] Successfully loaded ${tools.length} tools from MCP server`);
    registeredTools = tools;
    toolsReady = true;
  })
  .catch((error) => {
    console.error("[windows-mcp] Failed to start MCP server:", error);
  });

module.exports = function register(api) {
  console.log("[windows-mcp] Registering plugin...");

  // Register a proxy tool that waits for MCP server to be ready
  for (let i = 0; i < 12; i++) {
    api.registerTool(
      (ctx) => {
        if (ctx.sandboxed) return null;

        return {
          name: `windows-mcp-tool-${i}`,
          description: "Windows automation tool (loading...)",
          inputSchema: { type: "object", properties: {} },
          execute: async (args) => {
            // Wait for tools to be ready
            if (!toolsReady) {
              return {
                content: [{ type: "text", text: "MCP server is still initializing..." }],
              };
            }

            // Get the actual tool
            const tool = registeredTools[i];
            if (!tool) {
              return {
                content: [{ type: "text", text: "Tool not found" }],
              };
            }

            // Execute the tool via MCP bridge
            const result = await mcpBridge.callTool(tool.name, args);
            return {
              content: result || [{ type: "text", text: "Done" }],
            };
          },
        };
      },
      { optional: true },
    );
  }

  console.log("[windows-mcp] Registered 12 tool slots");
};
