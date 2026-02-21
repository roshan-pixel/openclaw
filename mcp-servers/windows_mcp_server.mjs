#!/usr/bin/env node
import { execSync, exec } from "child_process";
import { promisify } from "util";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const execAsync = promisify(exec);

// ── HELPERS ──────────────────────────────────────────────────────────────────

function runPowerShell(command, timeoutMs = 10000) {
  try {
    const result = execSync(
      `powershell.exe -NoProfile -NonInteractive -Command "${command.replace(/"/g, '\\"')}"`,
      { timeout: timeoutMs, encoding: "utf8" },
    );
    return { success: true, output: result.trim() };
  } catch (err) {
    return { success: false, output: err.message };
  }
}

async function runPowerShellAsync(command, timeoutMs = 30000) {
  try {
    const { stdout, stderr } = await execAsync(
      `powershell.exe -NoProfile -NonInteractive -Command "${command.replace(/"/g, '\\"')}"`,
      { timeout: timeoutMs, encoding: "utf8" },
    );
    return { success: true, output: (stdout + stderr).trim() };
  } catch (err) {
    return { success: false, output: err.message };
  }
}

function runPython(script) {
  const pythonPaths = [
    "python",
    "python3",
    "C:\\Python312\\python.exe",
    "C:\\Python314\\python.exe",
    "C:\\Python311\\python.exe",
  ];
  for (const py of pythonPaths) {
    try {
      const result = execSync(
        `"${py}" -c "${script.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`,
        {
          timeout: 10000,
          encoding: "utf8",
        },
      );
      return { success: true, output: result.trim() };
    } catch (err) {
      if (!err.message.includes("not recognized") && !err.message.includes("No such file")) {
        return { success: false, output: err.message };
      }
    }
  }
  return { success: false, output: "Python not found" };
}

// ── TOOL DEFINITIONS ─────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: "Windows-MCP:App",
    description: "Launch, resize, or switch Windows applications.",
    inputSchema: {
      type: "object",
      properties: {
        mode: { type: "string", enum: ["launch", "resize", "switch"] },
        name: { type: "string" },
        window_size: { type: "array", items: { type: "integer" } },
        window_loc: { type: "array", items: { type: "integer" } },
      },
      required: ["mode"],
    },
  },
  {
    name: "Windows-MCP:Shell",
    description: "Execute PowerShell commands with admin rights.",
    inputSchema: {
      type: "object",
      properties: {
        command: { type: "string" },
        timeout: { type: "integer", default: 30 },
      },
      required: ["command"],
    },
  },
  {
    name: "Windows-MCP:Snapshot",
    description: "Capture desktop state — open windows, screen resolution, foreground window.",
    inputSchema: {
      type: "object",
      properties: {
        use_vision: { type: "boolean", default: false },
      },
    },
  },
  {
    name: "Windows-MCP:Click",
    description: "Mouse click at [x, y] coordinates.",
    inputSchema: {
      type: "object",
      properties: {
        loc: { type: "array", items: { type: "integer" } },
        button: { type: "string", enum: ["left", "right", "middle"], default: "left" },
        clicks: { type: "integer", default: 1 },
      },
      required: ["loc"],
    },
  },
  {
    name: "Windows-MCP:Type",
    description: "Click at [x, y] then type text.",
    inputSchema: {
      type: "object",
      properties: {
        loc: { type: "array", items: { type: "integer" } },
        text: { type: "string" },
        clear: { type: "boolean", default: false },
        press_enter: { type: "boolean", default: false },
      },
      required: ["loc", "text"],
    },
  },
  {
    name: "Windows-MCP:Scroll",
    description: "Scroll at [x, y] coordinates.",
    inputSchema: {
      type: "object",
      properties: {
        loc: { type: "array", items: { type: "integer" } },
        direction: { type: "string", enum: ["up", "down", "left", "right"], default: "down" },
        wheel_times: { type: "integer", default: 3 },
      },
    },
  },
  {
    name: "Windows-MCP:Move",
    description: "Move mouse to [x, y] or drag to [x, y].",
    inputSchema: {
      type: "object",
      properties: {
        loc: { type: "array", items: { type: "integer" } },
        drag: { type: "boolean", default: false },
      },
      required: ["loc"],
    },
  },
  {
    name: "Windows-MCP:Shortcut",
    description: "Press keyboard shortcut like ctrl+c, alt+tab, win+r.",
    inputSchema: {
      type: "object",
      properties: {
        shortcut: { type: "string" },
      },
      required: ["shortcut"],
    },
  },
  {
    name: "Windows-MCP:Wait",
    description: "Pause for N seconds.",
    inputSchema: {
      type: "object",
      properties: {
        duration: { type: "integer" },
      },
      required: ["duration"],
    },
  },
  {
    name: "Windows-MCP:Scrape",
    description: "Fetch webpage text content from a URL.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string" },
      },
      required: ["url"],
    },
  },
];

// ── TOOL HANDLERS ─────────────────────────────────────────────────────────────

async function handleApp({ mode, name, window_size, window_loc }) {
  if (mode === "launch") {
    const res = await runPowerShellAsync(`Start-Process '${name}'`);
    return res.success ? `Launched: ${name}` : `Failed: ${res.output}`;
  }
  if (mode === "switch") {
    const res = runPowerShell(`
      $p = Get-Process | Where-Object { $_.MainWindowTitle -like '*${name}*' } | Select-Object -First 1
      if ($p) {
        $h = $p.MainWindowHandle
        Add-Type -Name W -Namespace W -MemberDefinition '[DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h); [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int n);'
        [W.W]::ShowWindow($h, 9); [W.W]::SetForegroundWindow($h)
        "Switched to: $($p.MainWindowTitle)"
      } else { "Not found: ${name}" }
    `);
    return res.output;
  }
  if (mode === "resize") {
    const w = window_size ? window_size[0] : 800;
    const h = window_size ? window_size[1] : 600;
    const x = window_loc ? window_loc[0] : 0;
    const y = window_loc ? window_loc[1] : 0;
    const res = runPowerShell(`
      $p = Get-Process | Where-Object { $_.MainWindowTitle -like '*${name}*' } | Select-Object -First 1
      if ($p) {
        Add-Type -Name R -Namespace R -MemberDefinition '[DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr h, int x, int y, int w, int ht, bool r);'
        [R.R]::MoveWindow($p.MainWindowHandle, ${x}, ${y}, ${w}, ${h}, $true)
        "Resized: ${name} to ${w}x${h} at (${x},${y})"
      } else { "Not found: ${name}" }
    `);
    return res.output;
  }
  return "Unknown mode. Use: launch, switch, resize";
}

async function handleShell({ command, timeout = 30 }) {
  const res = await runPowerShellAsync(command, timeout * 1000);
  return `[${res.success ? "OK" : "ERROR"}]\n${res.output}`;
}

function handleSnapshot({ use_vision = false }) {
  const res = runPowerShell(
    `
    Write-Output "=== OPEN WINDOWS ==="
    Get-Process | Where-Object { $_.MainWindowTitle -ne '' } |
      ForEach-Object { "  PID:$($_.Id) | $($_.ProcessName) | $($_.MainWindowTitle)" }
    Write-Output ""
    Write-Output "=== SCREEN ==="
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.Screen]::AllScreens | ForEach-Object { "  $($_.DeviceName): $($_.Bounds.Width)x$($_.Bounds.Height)" }
    Write-Output ""
    Write-Output "=== FOREGROUND ==="
    Add-Type -Name FG -Namespace FG -MemberDefinition '[DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow(); [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr h, System.Text.StringBuilder s, int n);'
    $sb = New-Object System.Text.StringBuilder 256
    [FG.FG]::GetWindowText([FG.FG]::GetForegroundWindow(), $sb, 256) | Out-Null
    "  $($sb.ToString())"
  `,
    15000,
  );

  let output = res.output;

  if (use_vision) {
    const pyRes = runPython(
      "import base64,io; from PIL import ImageGrab; img=ImageGrab.grab(); buf=io.BytesIO(); img.save(buf,format='PNG'); print(base64.b64encode(buf.getvalue()).decode())",
    );
    output += pyRes.success
      ? `\n\n=== SCREENSHOT (base64 PNG) ===\n${pyRes.output}`
      : `\n\nScreenshot failed: ${pyRes.output}`;
  }
  return output;
}

function handleClick({ loc, button = "left", clicks = 1 }) {
  const res = runPython(
    `import pyautogui; pyautogui.FAILSAFE=False; pyautogui.click(${loc[0]},${loc[1]},clicks=${clicks},button='${button}',interval=0.1); print('Clicked ${button} x${clicks} at (${loc[0]},${loc[1]})')`,
  );
  return res.success ? res.output : `Click failed: ${res.output}`;
}

function handleType({ loc, text, clear = false, press_enter = false }) {
  const escaped = text.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  const script = [
    "import pyautogui,time",
    "pyautogui.FAILSAFE=False",
    `pyautogui.click(${loc[0]},${loc[1]})`,
    "time.sleep(0.2)",
    clear ? "pyautogui.hotkey('ctrl','a'); pyautogui.press('delete')" : "",
    `pyautogui.write('${escaped}',interval=0.04)`,
    press_enter ? "pyautogui.press('enter')" : "",
    `print('Typed at (${loc[0]},${loc[1]})')`,
  ]
    .filter(Boolean)
    .join(";");
  const res = runPython(script);
  return res.success ? res.output : `Type failed: ${res.output}`;
}

function handleScroll({ loc, direction = "down", wheel_times = 3 }) {
  const amount = ["up", "left"].includes(direction) ? wheel_times : -wheel_times;
  const moveCmd = loc ? `pyautogui.moveTo(${loc[0]},${loc[1]});` : "";
  const res = runPython(
    `import pyautogui; pyautogui.FAILSAFE=False; ${moveCmd} pyautogui.scroll(${amount}); print('Scrolled ${direction} x${wheel_times}')`,
  );
  return res.success ? res.output : `Scroll failed: ${res.output}`;
}

function handleMove({ loc, drag = false }) {
  const cmd = drag
    ? `pyautogui.dragTo(${loc[0]},${loc[1]},duration=0.5); print('Dragged to (${loc[0]},${loc[1]})')`
    : `pyautogui.moveTo(${loc[0]},${loc[1]}); print('Moved to (${loc[0]},${loc[1]})')`;
  const res = runPython(`import pyautogui; pyautogui.FAILSAFE=False; ${cmd}`);
  return res.success ? res.output : `Move failed: ${res.output}`;
}

function handleShortcut({ shortcut }) {
  const keys = shortcut
    .split("+")
    .map((k) => `'${k.trim().toLowerCase()}'`)
    .join(",");
  const res = runPython(
    `import pyautogui; pyautogui.FAILSAFE=False; pyautogui.hotkey(${keys}); print('Pressed: ${shortcut}')`,
  );
  return res.success ? res.output : `Shortcut failed: ${res.output}`;
}

async function handleWait({ duration }) {
  await new Promise((r) => setTimeout(r, duration * 1000));
  return `Waited ${duration}s`;
}

async function handleScrape({ url }) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 OpenClaw/2026" },
      signal: AbortSignal.timeout(15000),
    });
    const html = await res.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, 5000);
    return `URL: ${url}\nStatus: ${res.status}\n\n${text}`;
  } catch (err) {
    return `Scrape failed: ${err.message}`;
  }
}

// ── SERVER ────────────────────────────────────────────────────────────────────

const server = new Server(
  { name: "windows-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  let result;
  try {
    switch (name) {
      case "Windows-MCP:App":
        result = await handleApp(args);
        break;
      case "Windows-MCP:Shell":
        result = await handleShell(args);
        break;
      case "Windows-MCP:Snapshot":
        result = handleSnapshot(args);
        break;
      case "Windows-MCP:Click":
        result = handleClick(args);
        break;
      case "Windows-MCP:Type":
        result = handleType(args);
        break;
      case "Windows-MCP:Scroll":
        result = handleScroll(args);
        break;
      case "Windows-MCP:Move":
        result = handleMove(args);
        break;
      case "Windows-MCP:Shortcut":
        result = handleShortcut(args);
        break;
      case "Windows-MCP:Wait":
        result = await handleWait(args);
        break;
      case "Windows-MCP:Scrape":
        result = await handleScrape(args);
        break;
      default:
        result = `Unknown tool: ${name}`;
    }
  } catch (err) {
    result = `Error in ${name}: ${err.message}`;
  }
  return { content: [{ type: "text", text: String(result) }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("[windows-mcp] Server running on stdio");
