"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveSessionKey = deriveSessionKey;
exports.resolveSessionKey = resolveSessionKey;
var session_key_js_1 = require("../../routing/session-key.js");
var utils_js_1 = require("../../utils.js");
var group_js_1 = require("./group.js");
// Decide which session bucket to use (per-sender vs global).
function deriveSessionKey(scope, ctx) {
  if (scope === "global") {
    return "global";
  }
  var resolvedGroup = (0, group_js_1.resolveGroupSessionKey)(ctx);
  if (resolvedGroup) {
    return resolvedGroup.key;
  }
  var from = ctx.From ? (0, utils_js_1.normalizeE164)(ctx.From) : "";
  return from || "unknown";
}
/**
 * Resolve the session key with a canonical direct-chat bucket (default: "main").
 * All non-group direct chats collapse to this bucket; groups stay isolated.
 */
function resolveSessionKey(scope, ctx, mainKey) {
  var _a;
  var explicit = (_a = ctx.SessionKey) === null || _a === void 0 ? void 0 : _a.trim();
  if (explicit) {
    return explicit.toLowerCase();
  }
  var raw = deriveSessionKey(scope, ctx);
  if (scope === "global") {
    return raw;
  }
  var canonicalMainKey = (0, session_key_js_1.normalizeMainKey)(mainKey);
  var canonical = (0, session_key_js_1.buildAgentMainSessionKey)({
    agentId: session_key_js_1.DEFAULT_AGENT_ID,
    mainKey: canonicalMainKey,
  });
  var isGroup = raw.includes(":group:") || raw.includes(":channel:");
  if (!isGroup) {
    return canonical;
  }
  return "agent:".concat(session_key_js_1.DEFAULT_AGENT_ID, ":").concat(raw);
}
