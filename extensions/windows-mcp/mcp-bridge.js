const { spawn } = require("child_process");
const readline = require("readline");

class MCPBridge {
  constructor(serverPath) {
    this.serverPath = serverPath;
    this.process = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
    this.initialized = false;
  }

  async start() {
    console.log("[windows-mcp] Starting MCP server...");

    this.process = spawn("python", [this.serverPath], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    this.rl = readline.createInterface({
      input: this.process.stdout,
      crlfDelay: Infinity,
    });

    this.rl.on("line", (line) => {
      try {
        const response = JSON.parse(line);
        const request = this.pendingRequests.get(response.id);
        if (request) {
          request.resolve(response);
          this.pendingRequests.delete(response.id);
        }
      } catch (e) {
        console.error("[windows-mcp] Parse error:", e, "Line:", line);
      }
    });

    this.process.stderr.on("data", (data) => {
      const msg = data.toString();
      if (!msg.includes("WARNING:root")) {
        console.error(`[windows-mcp] ${msg}`);
      }
    });

    console.log("[windows-mcp] MCP server started");

    // Initialize MCP connection
    await this.initialize();

    // Get list of tools
    return this.listTools();
  }

  async initialize() {
    try {
      const response = await this.sendRequest("initialize", {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: {
          name: "openclaw-windows-mcp",
          version: "1.0.0",
        },
      });
      this.initialized = true;
      console.log("[windows-mcp] MCP connection initialized");
      return response;
    } catch (error) {
      console.error("[windows-mcp] Initialization failed:", error);
      throw error;
    }
  }

  async listTools() {
    const response = await this.sendRequest("tools/list", {});
    const tools = response.result?.tools || response.tools || [];
    console.log(
      `[windows-mcp] Received ${tools.length} tools:`,
      tools.map((t) => t.name),
    );
    return tools;
  }

  async callTool(name, toolArgs) {
    const response = await this.sendRequest("tools/call", {
      name: name,
      arguments: toolArgs,
    });
    return response.result?.content || response.content || [];
  }

  sendRequest(method, params) {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId;

      this.pendingRequests.set(id, { resolve, reject });

      const request = {
        jsonrpc: "2.0",
        id: id,
        method: method,
        params: params,
      };

      const requestStr = JSON.stringify(request) + "\n";
      console.log("[windows-mcp] Sending request:", method);
      this.process.stdin.write(requestStr);

      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`Request timeout: ${method}`));
        }
      }, 30000);
    });
  }

  stop() {
    if (this.process) {
      this.process.kill();
    }
  }
}

module.exports = { MCPBridge };
