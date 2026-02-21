"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOpenClawAgentDir = resolveOpenClawAgentDir;
exports.ensureOpenClawAgentEnv = ensureOpenClawAgentEnv;
var node_path_1 = require("node:path");
var paths_js_1 = require("../config/paths.js");
var session_key_js_1 = require("../routing/session-key.js");
var utils_js_1 = require("../utils.js");
function resolveOpenClawAgentDir() {
  var _a, _b;
  var override =
    ((_a = process.env.OPENCLAW_AGENT_DIR) === null || _a === void 0 ? void 0 : _a.trim()) ||
    ((_b = process.env.PI_CODING_AGENT_DIR) === null || _b === void 0 ? void 0 : _b.trim());
  if (override) {
    return (0, utils_js_1.resolveUserPath)(override);
  }
  var defaultAgentDir = node_path_1.default.join(
    (0, paths_js_1.resolveStateDir)(),
    "agents",
    session_key_js_1.DEFAULT_AGENT_ID,
    "agent",
  );
  return (0, utils_js_1.resolveUserPath)(defaultAgentDir);
}
function ensureOpenClawAgentEnv() {
  var dir = resolveOpenClawAgentDir();
  if (!process.env.OPENCLAW_AGENT_DIR) {
    process.env.OPENCLAW_AGENT_DIR = dir;
  }
  if (!process.env.PI_CODING_AGENT_DIR) {
    process.env.PI_CODING_AGENT_DIR = dir;
  }
  return dir;
}
