"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAgentSessionKey = parseAgentSessionKey;
exports.isSubagentSessionKey = isSubagentSessionKey;
exports.isAcpSessionKey = isAcpSessionKey;
exports.resolveThreadParentSessionKey = resolveThreadParentSessionKey;
function parseAgentSessionKey(sessionKey) {
  var _a;
  var raw = (sessionKey !== null && sessionKey !== void 0 ? sessionKey : "").trim();
  if (!raw) {
    return null;
  }
  var parts = raw.split(":").filter(Boolean);
  if (parts.length < 3) {
    return null;
  }
  if (parts[0] !== "agent") {
    return null;
  }
  var agentId = (_a = parts[1]) === null || _a === void 0 ? void 0 : _a.trim();
  var rest = parts.slice(2).join(":");
  if (!agentId || !rest) {
    return null;
  }
  return { agentId: agentId, rest: rest };
}
function isSubagentSessionKey(sessionKey) {
  var _a;
  var raw = (sessionKey !== null && sessionKey !== void 0 ? sessionKey : "").trim();
  if (!raw) {
    return false;
  }
  if (raw.toLowerCase().startsWith("subagent:")) {
    return true;
  }
  var parsed = parseAgentSessionKey(raw);
  return Boolean(
    ((_a = parsed === null || parsed === void 0 ? void 0 : parsed.rest) !== null && _a !== void 0
      ? _a
      : ""
    )
      .toLowerCase()
      .startsWith("subagent:"),
  );
}
function isAcpSessionKey(sessionKey) {
  var _a;
  var raw = (sessionKey !== null && sessionKey !== void 0 ? sessionKey : "").trim();
  if (!raw) {
    return false;
  }
  var normalized = raw.toLowerCase();
  if (normalized.startsWith("acp:")) {
    return true;
  }
  var parsed = parseAgentSessionKey(raw);
  return Boolean(
    ((_a = parsed === null || parsed === void 0 ? void 0 : parsed.rest) !== null && _a !== void 0
      ? _a
      : ""
    )
      .toLowerCase()
      .startsWith("acp:"),
  );
}
var THREAD_SESSION_MARKERS = [":thread:", ":topic:"];
function resolveThreadParentSessionKey(sessionKey) {
  var raw = (sessionKey !== null && sessionKey !== void 0 ? sessionKey : "").trim();
  if (!raw) {
    return null;
  }
  var normalized = raw.toLowerCase();
  var idx = -1;
  for (
    var _i = 0, THREAD_SESSION_MARKERS_1 = THREAD_SESSION_MARKERS;
    _i < THREAD_SESSION_MARKERS_1.length;
    _i++
  ) {
    var marker = THREAD_SESSION_MARKERS_1[_i];
    var candidate = normalized.lastIndexOf(marker);
    if (candidate > idx) {
      idx = candidate;
    }
  }
  if (idx <= 0) {
    return null;
  }
  var parent = raw.slice(0, idx).trim();
  return parent ? parent : null;
}
