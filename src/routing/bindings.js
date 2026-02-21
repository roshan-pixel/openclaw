"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBindings = listBindings;
exports.listBoundAccountIds = listBoundAccountIds;
exports.resolveDefaultAgentBoundAccountId = resolveDefaultAgentBoundAccountId;
exports.buildChannelAccountBindings = buildChannelAccountBindings;
exports.resolvePreferredAccountId = resolvePreferredAccountId;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var registry_js_1 = require("../channels/registry.js");
var session_key_js_1 = require("./session-key.js");
function normalizeBindingChannelId(raw) {
  var normalized = (0, registry_js_1.normalizeChatChannelId)(raw);
  if (normalized) {
    return normalized;
  }
  var fallback = (raw !== null && raw !== void 0 ? raw : "").trim().toLowerCase();
  return fallback || null;
}
function listBindings(cfg) {
  return Array.isArray(cfg.bindings) ? cfg.bindings : [];
}
function listBoundAccountIds(cfg, channelId) {
  var normalizedChannel = normalizeBindingChannelId(channelId);
  if (!normalizedChannel) {
    return [];
  }
  var ids = new Set();
  for (var _i = 0, _a = listBindings(cfg); _i < _a.length; _i++) {
    var binding = _a[_i];
    if (!binding || typeof binding !== "object") {
      continue;
    }
    var match = binding.match;
    if (!match || typeof match !== "object") {
      continue;
    }
    var channel = normalizeBindingChannelId(match.channel);
    if (!channel || channel !== normalizedChannel) {
      continue;
    }
    var accountId = typeof match.accountId === "string" ? match.accountId.trim() : "";
    if (!accountId || accountId === "*") {
      continue;
    }
    ids.add((0, session_key_js_1.normalizeAccountId)(accountId));
  }
  return Array.from(ids).toSorted(function (a, b) {
    return a.localeCompare(b);
  });
}
function resolveDefaultAgentBoundAccountId(cfg, channelId) {
  var normalizedChannel = normalizeBindingChannelId(channelId);
  if (!normalizedChannel) {
    return null;
  }
  var defaultAgentId = (0, session_key_js_1.normalizeAgentId)(
    (0, agent_scope_js_1.resolveDefaultAgentId)(cfg),
  );
  for (var _i = 0, _a = listBindings(cfg); _i < _a.length; _i++) {
    var binding = _a[_i];
    if (!binding || typeof binding !== "object") {
      continue;
    }
    if ((0, session_key_js_1.normalizeAgentId)(binding.agentId) !== defaultAgentId) {
      continue;
    }
    var match = binding.match;
    if (!match || typeof match !== "object") {
      continue;
    }
    var channel = normalizeBindingChannelId(match.channel);
    if (!channel || channel !== normalizedChannel) {
      continue;
    }
    var accountId = typeof match.accountId === "string" ? match.accountId.trim() : "";
    if (!accountId || accountId === "*") {
      continue;
    }
    return (0, session_key_js_1.normalizeAccountId)(accountId);
  }
  return null;
}
function buildChannelAccountBindings(cfg) {
  var _a, _b;
  var map = new Map();
  for (var _i = 0, _c = listBindings(cfg); _i < _c.length; _i++) {
    var binding = _c[_i];
    if (!binding || typeof binding !== "object") {
      continue;
    }
    var match = binding.match;
    if (!match || typeof match !== "object") {
      continue;
    }
    var channelId = normalizeBindingChannelId(match.channel);
    if (!channelId) {
      continue;
    }
    var accountId = typeof match.accountId === "string" ? match.accountId.trim() : "";
    if (!accountId || accountId === "*") {
      continue;
    }
    var agentId = (0, session_key_js_1.normalizeAgentId)(binding.agentId);
    var byAgent = (_a = map.get(channelId)) !== null && _a !== void 0 ? _a : new Map();
    var list = (_b = byAgent.get(agentId)) !== null && _b !== void 0 ? _b : [];
    var normalizedAccountId = (0, session_key_js_1.normalizeAccountId)(accountId);
    if (!list.includes(normalizedAccountId)) {
      list.push(normalizedAccountId);
    }
    byAgent.set(agentId, list);
    map.set(channelId, byAgent);
  }
  return map;
}
function resolvePreferredAccountId(params) {
  if (params.boundAccounts.length > 0) {
    return params.boundAccounts[0];
  }
  return params.defaultAccountId;
}
