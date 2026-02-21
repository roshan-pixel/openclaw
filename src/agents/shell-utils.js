"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShellConfig = getShellConfig;
exports.sanitizeBinaryOutput = sanitizeBinaryOutput;
exports.killProcessTree = killProcessTree;
var node_child_process_1 = require("node:child_process");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
function resolvePowerShellPath() {
  var systemRoot = process.env.SystemRoot || process.env.WINDIR;
  if (systemRoot) {
    var candidate = node_path_1.default.join(
      systemRoot,
      "System32",
      "WindowsPowerShell",
      "v1.0",
      "powershell.exe",
    );
    if (node_fs_1.default.existsSync(candidate)) {
      return candidate;
    }
  }
  return "powershell.exe";
}
function getShellConfig() {
  var _a;
  if (process.platform === "win32") {
    // Use PowerShell instead of cmd.exe on Windows.
    // Problem: Many Windows system utilities (ipconfig, systeminfo, etc.) write
    // directly to the console via WriteConsole API, bypassing stdout pipes.
    // When Node.js spawns cmd.exe with piped stdio, these utilities produce no output.
    // PowerShell properly captures and redirects their output to stdout.
    return {
      shell: resolvePowerShellPath(),
      args: ["-NoProfile", "-NonInteractive", "-Command"],
    };
  }
  var envShell = (_a = process.env.SHELL) === null || _a === void 0 ? void 0 : _a.trim();
  var shellName = envShell ? node_path_1.default.basename(envShell) : "";
  // Fish rejects common bashisms used by tools, so prefer bash when detected.
  if (shellName === "fish") {
    var bash = resolveShellFromPath("bash");
    if (bash) {
      return { shell: bash, args: ["-c"] };
    }
    var sh = resolveShellFromPath("sh");
    if (sh) {
      return { shell: sh, args: ["-c"] };
    }
  }
  var shell = envShell && envShell.length > 0 ? envShell : "sh";
  return { shell: shell, args: ["-c"] };
}
function resolveShellFromPath(name) {
  var _a;
  var envPath = (_a = process.env.PATH) !== null && _a !== void 0 ? _a : "";
  if (!envPath) {
    return undefined;
  }
  var entries = envPath.split(node_path_1.default.delimiter).filter(Boolean);
  for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
    var entry = entries_1[_i];
    var candidate = node_path_1.default.join(entry, name);
    try {
      node_fs_1.default.accessSync(candidate, node_fs_1.default.constants.X_OK);
      return candidate;
    } catch (_b) {
      // ignore missing or non-executable entries
    }
  }
  return undefined;
}
function sanitizeBinaryOutput(text) {
  var scrubbed = text.replace(/[\p{Format}\p{Surrogate}]/gu, "");
  if (!scrubbed) {
    return scrubbed;
  }
  var chunks = [];
  for (var _i = 0, scrubbed_1 = scrubbed; _i < scrubbed_1.length; _i++) {
    var char = scrubbed_1[_i];
    var code = char.codePointAt(0);
    if (code == null) {
      continue;
    }
    if (code === 0x09 || code === 0x0a || code === 0x0d) {
      chunks.push(char);
      continue;
    }
    if (code < 0x20) {
      continue;
    }
    chunks.push(char);
  }
  return chunks.join("");
}
function killProcessTree(pid) {
  if (process.platform === "win32") {
    try {
      (0, node_child_process_1.spawn)("taskkill", ["/F", "/T", "/PID", String(pid)], {
        stdio: "ignore",
        detached: true,
      });
    } catch (_a) {
      // ignore errors if taskkill fails
    }
    return;
  }
  try {
    process.kill(-pid, "SIGKILL");
  } catch (_b) {
    try {
      process.kill(pid, "SIGKILL");
    } catch (_c) {
      // process already dead
    }
  }
}
