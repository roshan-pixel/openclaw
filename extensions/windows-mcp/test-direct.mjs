import { spawn } from "child_process";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class MCPBridge {
  constructor(serverPath) {
    this.serverPath = serverPath;
    this.process = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
  }

  async start() {
    console.log("[test] Starting MCP server...");

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
      } catch (e) {}
    });

    this.process.stderr.on("data", () => {});

    await this.initialize();
    return this.listTools();
  }

  async initialize() {
    return this.sendRequest("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "test", version: "1.0.0" },
    });
  }

  async listTools() {
    const response = await this.sendRequest("tools/list", {});
    return response.result?.tools || response.tools || [];
  }

  async callTool(name, args) {
    const response = await this.sendRequest("tools/call", {
      name: name,
      arguments: args,
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

      this.process.stdin.write(JSON.stringify(request) + "\n");

      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`Timeout: ${method}`));
        }
      }, 30000);
    });
  }

  stop() {
    if (this.process) this.process.kill();
  }
}

async function test() {
  const serverPath = path.join(__dirname, "..", "..", "mcp-servers", "windows_mcp_server.py");
  const bridge = new MCPBridge(serverPath);

  try {
    console.log("🚀 Starting tests...\n");
    const tools = await bridge.start();
    console.log(`✅ Loaded ${tools.length} tools\n`);

    console.log("📋 Test 1: Wait 2 seconds");
    const wait = await bridge.callTool("Windows-MCP:Wait", { duration: 2 });
    console.log("Result:", wait[0]?.text || JSON.stringify(wait));

    console.log("\n📋 Test 2: Desktop snapshot");
    const snapshot = await bridge.callTool("Windows-MCP:Snapshot", { use_vision: false });
    console.log("Snapshot size:", JSON.stringify(snapshot).length, "bytes");

    console.log("\n🎉 All tests passed!");
    bridge.stop();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed:", error);
    bridge.stop();
    process.exit(1);
  }
}

test();
