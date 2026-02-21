"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSessionTranscriptsDir = resolveSessionTranscriptsDir;
exports.resolveSessionTranscriptsDirForAgent = resolveSessionTranscriptsDirForAgent;
exports.resolveDefaultSessionStorePath = resolveDefaultSessionStorePath;
exports.resolveSessionTranscriptPath = resolveSessionTranscriptPath;
exports.resolveSessionFilePath = resolveSessionFilePath;
exports.resolveStorePath = resolveStorePath;
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var session_key_js_1 = require("../../routing/session-key.js");
var paths_js_1 = require("../paths.js");
function resolveAgentSessionsDir(agentId, env, homedir) {
  if (env === void 0) {
    env = process.env;
  }
  if (homedir === void 0) {
    homedir = node_os_1.default.homedir;
  }
  var root = (0, paths_js_1.resolveStateDir)(env, homedir);
  var id = (0, session_key_js_1.normalizeAgentId)(
    agentId !== null && agentId !== void 0 ? agentId : session_key_js_1.DEFAULT_AGENT_ID,
  );
  return node_path_1.default.join(root, "agents", id, "sessions");
}
function resolveSessionTranscriptsDir(env, homedir) {
  if (env === void 0) {
    env = process.env;
  }
  if (homedir === void 0) {
    homedir = node_os_1.default.homedir;
  }
  return resolveAgentSessionsDir(session_key_js_1.DEFAULT_AGENT_ID, env, homedir);
}
function resolveSessionTranscriptsDirForAgent(agentId, env, homedir) {
  if (env === void 0) {
    env = process.env;
  }
  if (homedir === void 0) {
    homedir = node_os_1.default.homedir;
  }
  return resolveAgentSessionsDir(agentId, env, homedir);
}
function resolveDefaultSessionStorePath(agentId) {
  return node_path_1.default.join(resolveAgentSessionsDir(agentId), "sessions.json");
}
function resolveSessionTranscriptPath(sessionId, agentId, topicId) {
  var safeTopicId =
    typeof topicId === "string"
      ? encodeURIComponent(topicId)
      : typeof topicId === "number"
        ? String(topicId)
        : undefined;
  var fileName =
    safeTopicId !== undefined
      ? "".concat(sessionId, "-topic-").concat(safeTopicId, ".jsonl")
      : "".concat(sessionId, ".jsonl");
  return node_path_1.default.join(resolveAgentSessionsDir(agentId), fileName);
}
function resolveSessionFilePath(sessionId, entry, opts) {
  var _a;
  var candidate =
    (_a = entry === null || entry === void 0 ? void 0 : entry.sessionFile) === null || _a === void 0
      ? void 0
      : _a.trim();
  return candidate
    ? candidate
    : resolveSessionTranscriptPath(
        sessionId,
        opts === null || opts === void 0 ? void 0 : opts.agentId,
      );
}
function resolveStorePath(store, opts) {
  var _a;
  var agentId = (0, session_key_js_1.normalizeAgentId)(
    (_a = opts === null || opts === void 0 ? void 0 : opts.agentId) !== null && _a !== void 0
      ? _a
      : session_key_js_1.DEFAULT_AGENT_ID,
  );
  if (!store) {
    return resolveDefaultSessionStorePath(agentId);
  }
  if (store.includes("{agentId}")) {
    var expanded = store.replaceAll("{agentId}", agentId);
    if (expanded.startsWith("~")) {
      return node_path_1.default.resolve(
        expanded.replace(/^~(?=$|[\\/])/, node_os_1.default.homedir()),
      );
    }
    return node_path_1.default.resolve(expanded);
  }
  if (store.startsWith("~")) {
    return node_path_1.default.resolve(store.replace(/^~(?=$|[\\/])/, node_os_1.default.homedir()));
  }
  return node_path_1.default.resolve(store);
}
