"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugifySessionKey = slugifySessionKey;
exports.resolveSandboxWorkspaceDir = resolveSandboxWorkspaceDir;
exports.resolveSandboxScopeKey = resolveSandboxScopeKey;
exports.resolveSandboxAgentId = resolveSandboxAgentId;
var node_crypto_1 = require("node:crypto");
var node_path_1 = require("node:path");
var session_key_js_1 = require("../../routing/session-key.js");
var utils_js_1 = require("../../utils.js");
var agent_scope_js_1 = require("../agent-scope.js");
function slugifySessionKey(value) {
  var trimmed = value.trim() || "session";
  var hash = node_crypto_1.default.createHash("sha1").update(trimmed).digest("hex").slice(0, 8);
  var safe = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  var base = safe.slice(0, 32) || "session";
  return "".concat(base, "-").concat(hash);
}
function resolveSandboxWorkspaceDir(root, sessionKey) {
  var resolvedRoot = (0, utils_js_1.resolveUserPath)(root);
  var slug = slugifySessionKey(sessionKey);
  return node_path_1.default.join(resolvedRoot, slug);
}
function resolveSandboxScopeKey(scope, sessionKey) {
  var trimmed = sessionKey.trim() || "main";
  if (scope === "shared") {
    return "shared";
  }
  if (scope === "session") {
    return trimmed;
  }
  var agentId = (0, agent_scope_js_1.resolveAgentIdFromSessionKey)(trimmed);
  return "agent:".concat(agentId);
}
function resolveSandboxAgentId(scopeKey) {
  var trimmed = scopeKey.trim();
  if (!trimmed || trimmed === "shared") {
    return undefined;
  }
  var parts = trimmed.split(":").filter(Boolean);
  if (parts[0] === "agent" && parts[1]) {
    return (0, session_key_js_1.normalizeAgentId)(parts[1]);
  }
  return (0, agent_scope_js_1.resolveAgentIdFromSessionKey)(trimmed);
}
