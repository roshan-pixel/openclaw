"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SANDBOX_BROWSER_REGISTRY_PATH = exports.SANDBOX_REGISTRY_PATH = exports.SANDBOX_STATE_DIR = exports.SANDBOX_AGENT_WORKSPACE_MOUNT = exports.DEFAULT_SANDBOX_BROWSER_AUTOSTART_TIMEOUT_MS = exports.DEFAULT_SANDBOX_BROWSER_NOVNC_PORT = exports.DEFAULT_SANDBOX_BROWSER_VNC_PORT = exports.DEFAULT_SANDBOX_BROWSER_CDP_PORT = exports.DEFAULT_SANDBOX_BROWSER_PREFIX = exports.DEFAULT_SANDBOX_COMMON_IMAGE = exports.DEFAULT_SANDBOX_BROWSER_IMAGE = exports.DEFAULT_TOOL_DENY = exports.DEFAULT_TOOL_ALLOW = exports.DEFAULT_SANDBOX_MAX_AGE_DAYS = exports.DEFAULT_SANDBOX_IDLE_HOURS = exports.DEFAULT_SANDBOX_WORKDIR = exports.DEFAULT_SANDBOX_CONTAINER_PREFIX = exports.DEFAULT_SANDBOX_IMAGE = exports.DEFAULT_SANDBOX_WORKSPACE_ROOT = void 0;
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var registry_js_1 = require("../../channels/registry.js");
var config_js_1 = require("../../config/config.js");
exports.DEFAULT_SANDBOX_WORKSPACE_ROOT = node_path_1.default.join(node_os_1.default.homedir(), ".openclaw", "sandboxes");
exports.DEFAULT_SANDBOX_IMAGE = "openclaw-sandbox:bookworm-slim";
exports.DEFAULT_SANDBOX_CONTAINER_PREFIX = "openclaw-sbx-";
exports.DEFAULT_SANDBOX_WORKDIR = "/workspace";
exports.DEFAULT_SANDBOX_IDLE_HOURS = 24;
exports.DEFAULT_SANDBOX_MAX_AGE_DAYS = 7;
exports.DEFAULT_TOOL_ALLOW = [
    "exec",
    "process",
    "read",
    "write",
    "edit",
    "apply_patch",
    "image",
    "sessions_list",
    "sessions_history",
    "sessions_send",
    "sessions_spawn",
    "session_status",
];
// Provider docking: keep sandbox policy aligned with provider tool names.
exports.DEFAULT_TOOL_DENY = __spreadArray([
    "browser",
    "canvas",
    "nodes",
    "cron",
    "gateway"
], registry_js_1.CHANNEL_IDS, true);
exports.DEFAULT_SANDBOX_BROWSER_IMAGE = "openclaw-sandbox-browser:bookworm-slim";
exports.DEFAULT_SANDBOX_COMMON_IMAGE = "openclaw-sandbox-common:bookworm-slim";
exports.DEFAULT_SANDBOX_BROWSER_PREFIX = "openclaw-sbx-browser-";
exports.DEFAULT_SANDBOX_BROWSER_CDP_PORT = 9222;
exports.DEFAULT_SANDBOX_BROWSER_VNC_PORT = 5900;
exports.DEFAULT_SANDBOX_BROWSER_NOVNC_PORT = 6080;
exports.DEFAULT_SANDBOX_BROWSER_AUTOSTART_TIMEOUT_MS = 12000;
exports.SANDBOX_AGENT_WORKSPACE_MOUNT = "/agent";
var resolvedSandboxStateDir = config_js_1.STATE_DIR !== null && config_js_1.STATE_DIR !== void 0 ? config_js_1.STATE_DIR : node_path_1.default.join(node_os_1.default.homedir(), ".openclaw");
exports.SANDBOX_STATE_DIR = node_path_1.default.join(resolvedSandboxStateDir, "sandbox");
exports.SANDBOX_REGISTRY_PATH = node_path_1.default.join(exports.SANDBOX_STATE_DIR, "containers.json");
exports.SANDBOX_BROWSER_REGISTRY_PATH = node_path_1.default.join(exports.SANDBOX_STATE_DIR, "browsers.json");
