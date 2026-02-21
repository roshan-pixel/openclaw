"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ACCOUNT_ID =
  exports.DEFAULT_MAIN_KEY =
  exports.DEFAULT_AGENT_ID =
  exports.parseAgentSessionKey =
  exports.isSubagentSessionKey =
  exports.isAcpSessionKey =
    void 0;
exports.normalizeMainKey = normalizeMainKey;
exports.toAgentRequestSessionKey = toAgentRequestSessionKey;
exports.toAgentStoreSessionKey = toAgentStoreSessionKey;
exports.resolveAgentIdFromSessionKey = resolveAgentIdFromSessionKey;
exports.normalizeAgentId = normalizeAgentId;
exports.sanitizeAgentId = sanitizeAgentId;
exports.normalizeAccountId = normalizeAccountId;
exports.buildAgentMainSessionKey = buildAgentMainSessionKey;
exports.buildAgentPeerSessionKey = buildAgentPeerSessionKey;
exports.buildGroupHistoryKey = buildGroupHistoryKey;
exports.resolveThreadSessionKeys = resolveThreadSessionKeys;
var session_key_utils_js_1 = require("../sessions/session-key-utils.js");
var session_key_utils_js_2 = require("../sessions/session-key-utils.js");
Object.defineProperty(exports, "isAcpSessionKey", {
  enumerable: true,
  get: function () {
    return session_key_utils_js_2.isAcpSessionKey;
  },
});
Object.defineProperty(exports, "isSubagentSessionKey", {
  enumerable: true,
  get: function () {
    return session_key_utils_js_2.isSubagentSessionKey;
  },
});
Object.defineProperty(exports, "parseAgentSessionKey", {
  enumerable: true,
  get: function () {
    return session_key_utils_js_2.parseAgentSessionKey;
  },
});
exports.DEFAULT_AGENT_ID = "main";
exports.DEFAULT_MAIN_KEY = "main";
exports.DEFAULT_ACCOUNT_ID = "default";
// Pre-compiled regex
var VALID_ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
var INVALID_CHARS_RE = /[^a-z0-9_-]+/g;
var LEADING_DASH_RE = /^-+/;
var TRAILING_DASH_RE = /-+$/;
function normalizeToken(value) {
  return (value !== null && value !== void 0 ? value : "").trim().toLowerCase();
}
function normalizeMainKey(value) {
  var trimmed = (value !== null && value !== void 0 ? value : "").trim();
  return trimmed ? trimmed.toLowerCase() : exports.DEFAULT_MAIN_KEY;
}
function toAgentRequestSessionKey(storeKey) {
  var _a, _b;
  var raw = (storeKey !== null && storeKey !== void 0 ? storeKey : "").trim();
  if (!raw) {
    return undefined;
  }
  return (_b =
    (_a = (0, session_key_utils_js_1.parseAgentSessionKey)(raw)) === null || _a === void 0
      ? void 0
      : _a.rest) !== null && _b !== void 0
    ? _b
    : raw;
}
function toAgentStoreSessionKey(params) {
  var _a;
  var raw = ((_a = params.requestKey) !== null && _a !== void 0 ? _a : "").trim();
  if (!raw || raw === exports.DEFAULT_MAIN_KEY) {
    return buildAgentMainSessionKey({ agentId: params.agentId, mainKey: params.mainKey });
  }
  var lowered = raw.toLowerCase();
  if (lowered.startsWith("agent:")) {
    return lowered;
  }
  if (lowered.startsWith("subagent:")) {
    return "agent:".concat(normalizeAgentId(params.agentId), ":").concat(lowered);
  }
  return "agent:".concat(normalizeAgentId(params.agentId), ":").concat(lowered);
}
function resolveAgentIdFromSessionKey(sessionKey) {
  var _a;
  var parsed = (0, session_key_utils_js_1.parseAgentSessionKey)(sessionKey);
  return normalizeAgentId(
    (_a = parsed === null || parsed === void 0 ? void 0 : parsed.agentId) !== null && _a !== void 0
      ? _a
      : exports.DEFAULT_AGENT_ID,
  );
}
function normalizeAgentId(value) {
  var trimmed = (value !== null && value !== void 0 ? value : "").trim();
  if (!trimmed) {
    return exports.DEFAULT_AGENT_ID;
  }
  // Keep it path-safe + shell-friendly.
  if (VALID_ID_RE.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  // Best-effort fallback: collapse invalid characters to "-"
  return (
    trimmed
      .toLowerCase()
      .replace(INVALID_CHARS_RE, "-")
      .replace(LEADING_DASH_RE, "")
      .replace(TRAILING_DASH_RE, "")
      .slice(0, 64) || exports.DEFAULT_AGENT_ID
  );
}
function sanitizeAgentId(value) {
  var trimmed = (value !== null && value !== void 0 ? value : "").trim();
  if (!trimmed) {
    return exports.DEFAULT_AGENT_ID;
  }
  if (VALID_ID_RE.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  return (
    trimmed
      .toLowerCase()
      .replace(INVALID_CHARS_RE, "-")
      .replace(LEADING_DASH_RE, "")
      .replace(TRAILING_DASH_RE, "")
      .slice(0, 64) || exports.DEFAULT_AGENT_ID
  );
}
function normalizeAccountId(value) {
  var trimmed = (value !== null && value !== void 0 ? value : "").trim();
  if (!trimmed) {
    return exports.DEFAULT_ACCOUNT_ID;
  }
  if (VALID_ID_RE.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  return (
    trimmed
      .toLowerCase()
      .replace(INVALID_CHARS_RE, "-")
      .replace(LEADING_DASH_RE, "")
      .replace(TRAILING_DASH_RE, "")
      .slice(0, 64) || exports.DEFAULT_ACCOUNT_ID
  );
}
function buildAgentMainSessionKey(params) {
  var agentId = normalizeAgentId(params.agentId);
  var mainKey = normalizeMainKey(params.mainKey);
  return "agent:".concat(agentId, ":").concat(mainKey);
}
function buildAgentPeerSessionKey(params) {
  var _a, _b, _c, _d, _e, _f, _g;
  var peerKind = (_a = params.peerKind) !== null && _a !== void 0 ? _a : "dm";
  if (peerKind === "dm") {
    var dmScope = (_b = params.dmScope) !== null && _b !== void 0 ? _b : "main";
    var peerId_1 = ((_c = params.peerId) !== null && _c !== void 0 ? _c : "").trim();
    var linkedPeerId =
      dmScope === "main"
        ? null
        : resolveLinkedPeerId({
            identityLinks: params.identityLinks,
            channel: params.channel,
            peerId: peerId_1,
          });
    if (linkedPeerId) {
      peerId_1 = linkedPeerId;
    }
    peerId_1 = peerId_1.toLowerCase();
    if (dmScope === "per-account-channel-peer" && peerId_1) {
      var channel_1 =
        ((_d = params.channel) !== null && _d !== void 0 ? _d : "").trim().toLowerCase() ||
        "unknown";
      var accountId = normalizeAccountId(params.accountId);
      return "agent:"
        .concat(normalizeAgentId(params.agentId), ":")
        .concat(channel_1, ":")
        .concat(accountId, ":dm:")
        .concat(peerId_1);
    }
    if (dmScope === "per-channel-peer" && peerId_1) {
      var channel_2 =
        ((_e = params.channel) !== null && _e !== void 0 ? _e : "").trim().toLowerCase() ||
        "unknown";
      return "agent:"
        .concat(normalizeAgentId(params.agentId), ":")
        .concat(channel_2, ":dm:")
        .concat(peerId_1);
    }
    if (dmScope === "per-peer" && peerId_1) {
      return "agent:".concat(normalizeAgentId(params.agentId), ":dm:").concat(peerId_1);
    }
    return buildAgentMainSessionKey({
      agentId: params.agentId,
      mainKey: params.mainKey,
    });
  }
  var channel =
    ((_f = params.channel) !== null && _f !== void 0 ? _f : "").trim().toLowerCase() || "unknown";
  var peerId = (
    ((_g = params.peerId) !== null && _g !== void 0 ? _g : "").trim() || "unknown"
  ).toLowerCase();
  return "agent:"
    .concat(normalizeAgentId(params.agentId), ":")
    .concat(channel, ":")
    .concat(peerKind, ":")
    .concat(peerId);
}
function resolveLinkedPeerId(params) {
  var identityLinks = params.identityLinks;
  if (!identityLinks) {
    return null;
  }
  var peerId = params.peerId.trim();
  if (!peerId) {
    return null;
  }
  var candidates = new Set();
  var rawCandidate = normalizeToken(peerId);
  if (rawCandidate) {
    candidates.add(rawCandidate);
  }
  var channel = normalizeToken(params.channel);
  if (channel) {
    var scopedCandidate = normalizeToken("".concat(channel, ":").concat(peerId));
    if (scopedCandidate) {
      candidates.add(scopedCandidate);
    }
  }
  if (candidates.size === 0) {
    return null;
  }
  for (var _i = 0, _a = Object.entries(identityLinks); _i < _a.length; _i++) {
    var _b = _a[_i],
      canonical = _b[0],
      ids = _b[1];
    var canonicalName = canonical.trim();
    if (!canonicalName) {
      continue;
    }
    if (!Array.isArray(ids)) {
      continue;
    }
    for (var _c = 0, ids_1 = ids; _c < ids_1.length; _c++) {
      var id = ids_1[_c];
      var normalized = normalizeToken(id);
      if (normalized && candidates.has(normalized)) {
        return canonicalName;
      }
    }
  }
  return null;
}
function buildGroupHistoryKey(params) {
  var channel = normalizeToken(params.channel) || "unknown";
  var accountId = normalizeAccountId(params.accountId);
  var peerId = params.peerId.trim().toLowerCase() || "unknown";
  return "".concat(channel, ":").concat(accountId, ":").concat(params.peerKind, ":").concat(peerId);
}
function resolveThreadSessionKeys(params) {
  var _a, _b;
  var threadId = ((_a = params.threadId) !== null && _a !== void 0 ? _a : "").trim();
  if (!threadId) {
    return { sessionKey: params.baseSessionKey, parentSessionKey: undefined };
  }
  var normalizedThreadId = threadId.toLowerCase();
  var useSuffix = (_b = params.useSuffix) !== null && _b !== void 0 ? _b : true;
  var sessionKey = useSuffix
    ? "".concat(params.baseSessionKey, ":thread:").concat(normalizedThreadId)
    : params.baseSessionKey;
  return { sessionKey: sessionKey, parentSessionKey: params.parentSessionKey };
}
