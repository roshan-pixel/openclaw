"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAgentIdFromSessionKey = void 0;
exports.listAgentIds = listAgentIds;
exports.resolveDefaultAgentId = resolveDefaultAgentId;
exports.resolveSessionAgentIds = resolveSessionAgentIds;
exports.resolveSessionAgentId = resolveSessionAgentId;
exports.resolveAgentConfig = resolveAgentConfig;
exports.resolveAgentModelPrimary = resolveAgentModelPrimary;
exports.resolveAgentModelFallbacksOverride = resolveAgentModelFallbacksOverride;
exports.resolveAgentWorkspaceDir = resolveAgentWorkspaceDir;
exports.resolveAgentDir = resolveAgentDir;
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var paths_js_1 = require("../config/paths.js");
var session_key_js_1 = require("../routing/session-key.js");
var utils_js_1 = require("../utils.js");
var workspace_js_1 = require("./workspace.js");
var session_key_js_2 = require("../routing/session-key.js");
Object.defineProperty(exports, "resolveAgentIdFromSessionKey", {
  enumerable: true,
  get: function () {
    return session_key_js_2.resolveAgentIdFromSessionKey;
  },
});
var defaultAgentWarned = false;
function listAgents(cfg) {
  var _a;
  var list = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.list;
  if (!Array.isArray(list)) {
    return [];
  }
  return list.filter(function (entry) {
    return Boolean(entry && typeof entry === "object");
  });
}
function listAgentIds(cfg) {
  var agents = listAgents(cfg);
  if (agents.length === 0) {
    return [session_key_js_1.DEFAULT_AGENT_ID];
  }
  var seen = new Set();
  var ids = [];
  for (var _i = 0, agents_1 = agents; _i < agents_1.length; _i++) {
    var entry = agents_1[_i];
    var id = (0, session_key_js_1.normalizeAgentId)(
      entry === null || entry === void 0 ? void 0 : entry.id,
    );
    if (seen.has(id)) {
      continue;
    }
    seen.add(id);
    ids.push(id);
  }
  return ids.length > 0 ? ids : [session_key_js_1.DEFAULT_AGENT_ID];
}
function resolveDefaultAgentId(cfg) {
  var _a, _b, _c;
  var agents = listAgents(cfg);
  if (agents.length === 0) {
    return session_key_js_1.DEFAULT_AGENT_ID;
  }
  var defaults = agents.filter(function (agent) {
    return agent === null || agent === void 0 ? void 0 : agent.default;
  });
  if (defaults.length > 1 && !defaultAgentWarned) {
    defaultAgentWarned = true;
    console.warn("Multiple agents marked default=true; using the first entry as default.");
  }
  var chosen =
    (_c =
      (_b = (_a = defaults[0]) !== null && _a !== void 0 ? _a : agents[0]) === null || _b === void 0
        ? void 0
        : _b.id) === null || _c === void 0
      ? void 0
      : _c.trim();
  return (0, session_key_js_1.normalizeAgentId)(chosen || session_key_js_1.DEFAULT_AGENT_ID);
}
function resolveSessionAgentIds(params) {
  var _a, _b;
  var defaultAgentId = resolveDefaultAgentId(
    (_a = params.config) !== null && _a !== void 0 ? _a : {},
  );
  var sessionKey = (_b = params.sessionKey) === null || _b === void 0 ? void 0 : _b.trim();
  var normalizedSessionKey = sessionKey ? sessionKey.toLowerCase() : undefined;
  var parsed = normalizedSessionKey
    ? (0, session_key_js_1.parseAgentSessionKey)(normalizedSessionKey)
    : null;
  var sessionAgentId = (parsed === null || parsed === void 0 ? void 0 : parsed.agentId)
    ? (0, session_key_js_1.normalizeAgentId)(parsed.agentId)
    : defaultAgentId;
  return { defaultAgentId: defaultAgentId, sessionAgentId: sessionAgentId };
}
function resolveSessionAgentId(params) {
  return resolveSessionAgentIds(params).sessionAgentId;
}
function resolveAgentEntry(cfg, agentId) {
  var id = (0, session_key_js_1.normalizeAgentId)(agentId);
  return listAgents(cfg).find(function (entry) {
    return (0, session_key_js_1.normalizeAgentId)(entry.id) === id;
  });
}
function resolveAgentConfig(cfg, agentId) {
  var id = (0, session_key_js_1.normalizeAgentId)(agentId);
  var entry = resolveAgentEntry(cfg, id);
  if (!entry) {
    return undefined;
  }
  return {
    name: typeof entry.name === "string" ? entry.name : undefined,
    workspace: typeof entry.workspace === "string" ? entry.workspace : undefined,
    agentDir: typeof entry.agentDir === "string" ? entry.agentDir : undefined,
    model:
      typeof entry.model === "string" || (entry.model && typeof entry.model === "object")
        ? entry.model
        : undefined,
    memorySearch: entry.memorySearch,
    humanDelay: entry.humanDelay,
    heartbeat: entry.heartbeat,
    identity: entry.identity,
    groupChat: entry.groupChat,
    subagents: typeof entry.subagents === "object" && entry.subagents ? entry.subagents : undefined,
    sandbox: entry.sandbox,
    tools: entry.tools,
  };
}
function resolveAgentModelPrimary(cfg, agentId) {
  var _a, _b;
  var raw = (_a = resolveAgentConfig(cfg, agentId)) === null || _a === void 0 ? void 0 : _a.model;
  if (!raw) {
    return undefined;
  }
  if (typeof raw === "string") {
    return raw.trim() || undefined;
  }
  var primary = (_b = raw.primary) === null || _b === void 0 ? void 0 : _b.trim();
  return primary || undefined;
}
function resolveAgentModelFallbacksOverride(cfg, agentId) {
  var _a;
  var raw = (_a = resolveAgentConfig(cfg, agentId)) === null || _a === void 0 ? void 0 : _a.model;
  if (!raw || typeof raw === "string") {
    return undefined;
  }
  // Important: treat an explicitly provided empty array as an override to disable global fallbacks.
  if (!Object.hasOwn(raw, "fallbacks")) {
    return undefined;
  }
  return Array.isArray(raw.fallbacks) ? raw.fallbacks : undefined;
}
function resolveAgentWorkspaceDir(cfg, agentId) {
  var _a, _b, _c, _d, _e;
  var id = (0, session_key_js_1.normalizeAgentId)(agentId);
  var configured =
    (_b = (_a = resolveAgentConfig(cfg, id)) === null || _a === void 0 ? void 0 : _a.workspace) ===
      null || _b === void 0
      ? void 0
      : _b.trim();
  if (configured) {
    return (0, utils_js_1.resolveUserPath)(configured);
  }
  var defaultAgentId = resolveDefaultAgentId(cfg);
  if (id === defaultAgentId) {
    var fallback =
      (_e =
        (_d = (_c = cfg.agents) === null || _c === void 0 ? void 0 : _c.defaults) === null ||
        _d === void 0
          ? void 0
          : _d.workspace) === null || _e === void 0
        ? void 0
        : _e.trim();
    if (fallback) {
      return (0, utils_js_1.resolveUserPath)(fallback);
    }
    return workspace_js_1.DEFAULT_AGENT_WORKSPACE_DIR;
  }
  return node_path_1.default.join(
    node_os_1.default.homedir(),
    ".openclaw",
    "workspace-".concat(id),
  );
}
function resolveAgentDir(cfg, agentId) {
  var _a, _b;
  var id = (0, session_key_js_1.normalizeAgentId)(agentId);
  var configured =
    (_b = (_a = resolveAgentConfig(cfg, id)) === null || _a === void 0 ? void 0 : _a.agentDir) ===
      null || _b === void 0
      ? void 0
      : _b.trim();
  if (configured) {
    return (0, utils_js_1.resolveUserPath)(configured);
  }
  var root = (0, paths_js_1.resolveStateDir)(process.env, node_os_1.default.homedir);
  return node_path_1.default.join(root, "agents", id, "agent");
}
