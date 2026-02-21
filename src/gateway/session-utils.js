"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }
    if (s != null && typeof Object.getOwnPropertySymbols === "function") {
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    }
    return t;
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSessionTranscriptCandidates =
  exports.readSessionMessages =
  exports.readSessionPreviewItemsFromTranscript =
  exports.readLastMessagePreviewFromTranscript =
  exports.readFirstUserMessageFromTranscript =
  exports.capArrayByJsonBytes =
  exports.archiveFileOnDisk =
    void 0;
exports.deriveSessionTitle = deriveSessionTitle;
exports.loadSessionEntry = loadSessionEntry;
exports.classifySessionKey = classifySessionKey;
exports.parseGroupKey = parseGroupKey;
exports.listAgentsForGateway = listAgentsForGateway;
exports.resolveSessionStoreKey = resolveSessionStoreKey;
exports.resolveGatewaySessionStoreTarget = resolveGatewaySessionStoreTarget;
exports.loadCombinedSessionStoreForGateway = loadCombinedSessionStoreForGateway;
exports.getSessionDefaults = getSessionDefaults;
exports.resolveSessionModelRef = resolveSessionModelRef;
exports.listSessionsFromStore = listSessionsFromStore;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var context_js_1 = require("../agents/context.js");
var defaults_js_1 = require("../agents/defaults.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var config_js_1 = require("../config/config.js");
var paths_js_1 = require("../config/paths.js");
var sessions_js_1 = require("../config/sessions.js");
var session_key_js_1 = require("../routing/session-key.js");
var delivery_context_js_1 = require("../utils/delivery-context.js");
var session_utils_fs_js_1 = require("./session-utils.fs.js");
var session_utils_fs_js_2 = require("./session-utils.fs.js");
Object.defineProperty(exports, "archiveFileOnDisk", {
  enumerable: true,
  get: function () {
    return session_utils_fs_js_2.archiveFileOnDisk;
  },
});
Object.defineProperty(exports, "capArrayByJsonBytes", {
  enumerable: true,
  get: function () {
    return session_utils_fs_js_2.capArrayByJsonBytes;
  },
});
Object.defineProperty(exports, "readFirstUserMessageFromTranscript", {
  enumerable: true,
  get: function () {
    return session_utils_fs_js_2.readFirstUserMessageFromTranscript;
  },
});
Object.defineProperty(exports, "readLastMessagePreviewFromTranscript", {
  enumerable: true,
  get: function () {
    return session_utils_fs_js_2.readLastMessagePreviewFromTranscript;
  },
});
Object.defineProperty(exports, "readSessionPreviewItemsFromTranscript", {
  enumerable: true,
  get: function () {
    return session_utils_fs_js_2.readSessionPreviewItemsFromTranscript;
  },
});
Object.defineProperty(exports, "readSessionMessages", {
  enumerable: true,
  get: function () {
    return session_utils_fs_js_2.readSessionMessages;
  },
});
Object.defineProperty(exports, "resolveSessionTranscriptCandidates", {
  enumerable: true,
  get: function () {
    return session_utils_fs_js_2.resolveSessionTranscriptCandidates;
  },
});
var DERIVED_TITLE_MAX_LEN = 60;
var AVATAR_MAX_BYTES = 2 * 1024 * 1024;
var AVATAR_DATA_RE = /^data:/i;
var AVATAR_HTTP_RE = /^https?:\/\//i;
var AVATAR_SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;
var WINDOWS_ABS_RE = /^[a-zA-Z]:[\\/]/;
var AVATAR_MIME_BY_EXT = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
};
function resolveAvatarMime(filePath) {
  var _a;
  var ext = node_path_1.default.extname(filePath).toLowerCase();
  return (_a = AVATAR_MIME_BY_EXT[ext]) !== null && _a !== void 0 ? _a : "application/octet-stream";
}
function isWorkspaceRelativePath(value) {
  if (!value) {
    return false;
  }
  if (value.startsWith("~")) {
    return false;
  }
  if (AVATAR_SCHEME_RE.test(value) && !WINDOWS_ABS_RE.test(value)) {
    return false;
  }
  return true;
}
function resolveIdentityAvatarUrl(cfg, agentId, avatar) {
  if (!avatar) {
    return undefined;
  }
  var trimmed = avatar.trim();
  if (!trimmed) {
    return undefined;
  }
  if (AVATAR_DATA_RE.test(trimmed) || AVATAR_HTTP_RE.test(trimmed)) {
    return trimmed;
  }
  if (!isWorkspaceRelativePath(trimmed)) {
    return undefined;
  }
  var workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, agentId);
  var workspaceRoot = node_path_1.default.resolve(workspaceDir);
  var resolved = node_path_1.default.resolve(workspaceRoot, trimmed);
  var relative = node_path_1.default.relative(workspaceRoot, resolved);
  if (relative.startsWith("..") || node_path_1.default.isAbsolute(relative)) {
    return undefined;
  }
  try {
    var stat = node_fs_1.default.statSync(resolved);
    if (!stat.isFile() || stat.size > AVATAR_MAX_BYTES) {
      return undefined;
    }
    var buffer = node_fs_1.default.readFileSync(resolved);
    var mime = resolveAvatarMime(resolved);
    return "data:".concat(mime, ";base64,").concat(buffer.toString("base64"));
  } catch (_a) {
    return undefined;
  }
}
function formatSessionIdPrefix(sessionId, updatedAt) {
  var prefix = sessionId.slice(0, 8);
  if (updatedAt && updatedAt > 0) {
    var d = new Date(updatedAt);
    var date = d.toISOString().slice(0, 10);
    return "".concat(prefix, " (").concat(date, ")");
  }
  return prefix;
}
function truncateTitle(text, maxLen) {
  if (text.length <= maxLen) {
    return text;
  }
  var cut = text.slice(0, maxLen - 1);
  var lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > maxLen * 0.6) {
    return cut.slice(0, lastSpace) + "…";
  }
  return cut + "…";
}
function deriveSessionTitle(entry, firstUserMessage) {
  var _a, _b;
  if (!entry) {
    return undefined;
  }
  if ((_a = entry.displayName) === null || _a === void 0 ? void 0 : _a.trim()) {
    return entry.displayName.trim();
  }
  if ((_b = entry.subject) === null || _b === void 0 ? void 0 : _b.trim()) {
    return entry.subject.trim();
  }
  if (firstUserMessage === null || firstUserMessage === void 0 ? void 0 : firstUserMessage.trim()) {
    var normalized = firstUserMessage.replace(/\s+/g, " ").trim();
    return truncateTitle(normalized, DERIVED_TITLE_MAX_LEN);
  }
  if (entry.sessionId) {
    return formatSessionIdPrefix(entry.sessionId, entry.updatedAt);
  }
  return undefined;
}
function loadSessionEntry(sessionKey) {
  var cfg = (0, config_js_1.loadConfig)();
  var sessionCfg = cfg.session;
  var canonicalKey = resolveSessionStoreKey({ cfg: cfg, sessionKey: sessionKey });
  var agentId = resolveSessionStoreAgentId(cfg, canonicalKey);
  var storePath = (0, sessions_js_1.resolveStorePath)(
    sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.store,
    { agentId: agentId },
  );
  var store = (0, sessions_js_1.loadSessionStore)(storePath);
  var entry = store[canonicalKey];
  return { cfg: cfg, storePath: storePath, store: store, entry: entry, canonicalKey: canonicalKey };
}
function classifySessionKey(key, entry) {
  if (key === "global") {
    return "global";
  }
  if (key === "unknown") {
    return "unknown";
  }
  if (
    (entry === null || entry === void 0 ? void 0 : entry.chatType) === "group" ||
    (entry === null || entry === void 0 ? void 0 : entry.chatType) === "channel"
  ) {
    return "group";
  }
  if (key.includes(":group:") || key.includes(":channel:")) {
    return "group";
  }
  return "direct";
}
function parseGroupKey(key) {
  var _a;
  var agentParsed = (0, session_key_js_1.parseAgentSessionKey)(key);
  var rawKey =
    (_a = agentParsed === null || agentParsed === void 0 ? void 0 : agentParsed.rest) !== null &&
    _a !== void 0
      ? _a
      : key;
  var parts = rawKey.split(":").filter(Boolean);
  if (parts.length >= 3) {
    var channel = parts[0],
      kind = parts[1],
      rest = parts.slice(2);
    if (kind === "group" || kind === "channel") {
      var id = rest.join(":");
      return { channel: channel, kind: kind, id: id };
    }
  }
  return null;
}
function isStorePathTemplate(store) {
  return typeof store === "string" && store.includes("{agentId}");
}
function listExistingAgentIdsFromDisk() {
  var root = (0, paths_js_1.resolveStateDir)();
  var agentsDir = node_path_1.default.join(root, "agents");
  try {
    var entries = node_fs_1.default.readdirSync(agentsDir, { withFileTypes: true });
    return entries
      .filter(function (entry) {
        return entry.isDirectory();
      })
      .map(function (entry) {
        return (0, session_key_js_1.normalizeAgentId)(entry.name);
      })
      .filter(Boolean);
  } catch (_a) {
    return [];
  }
}
function listConfiguredAgentIds(cfg) {
  var _a, _b;
  var agents =
    (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.list) !== null && _b !== void 0
      ? _b
      : [];
  if (agents.length > 0) {
    var ids_1 = new Set();
    for (var _i = 0, agents_1 = agents; _i < agents_1.length; _i++) {
      var entry = agents_1[_i];
      if (entry === null || entry === void 0 ? void 0 : entry.id) {
        ids_1.add((0, session_key_js_1.normalizeAgentId)(entry.id));
      }
    }
    var defaultId_1 = (0, session_key_js_1.normalizeAgentId)(
      (0, agent_scope_js_1.resolveDefaultAgentId)(cfg),
    );
    ids_1.add(defaultId_1);
    var sorted_1 = Array.from(ids_1).filter(Boolean);
    sorted_1.sort(function (a, b) {
      return a.localeCompare(b);
    });
    return sorted_1.includes(defaultId_1)
      ? __spreadArray(
          [defaultId_1],
          sorted_1.filter(function (id) {
            return id !== defaultId_1;
          }),
          true,
        )
      : sorted_1;
  }
  var ids = new Set();
  var defaultId = (0, session_key_js_1.normalizeAgentId)(
    (0, agent_scope_js_1.resolveDefaultAgentId)(cfg),
  );
  ids.add(defaultId);
  for (var _c = 0, _d = listExistingAgentIdsFromDisk(); _c < _d.length; _c++) {
    var id = _d[_c];
    ids.add(id);
  }
  var sorted = Array.from(ids).filter(Boolean);
  sorted.sort(function (a, b) {
    return a.localeCompare(b);
  });
  if (sorted.includes(defaultId)) {
    return __spreadArray(
      [defaultId],
      sorted.filter(function (id) {
        return id !== defaultId;
      }),
      true,
    );
  }
  return sorted;
}
function listAgentsForGateway(cfg) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
  var defaultId = (0, session_key_js_1.normalizeAgentId)(
    (0, agent_scope_js_1.resolveDefaultAgentId)(cfg),
  );
  var mainKey = (0, session_key_js_1.normalizeMainKey)(
    (_a = cfg.session) === null || _a === void 0 ? void 0 : _a.mainKey,
  );
  var scope =
    (_c = (_b = cfg.session) === null || _b === void 0 ? void 0 : _b.scope) !== null &&
    _c !== void 0
      ? _c
      : "per-sender";
  var configuredById = new Map();
  for (
    var _i = 0,
      _o =
        (_e = (_d = cfg.agents) === null || _d === void 0 ? void 0 : _d.list) !== null &&
        _e !== void 0
          ? _e
          : [];
    _i < _o.length;
    _i++
  ) {
    var entry = _o[_i];
    if (!(entry === null || entry === void 0 ? void 0 : entry.id)) {
      continue;
    }
    var identity = entry.identity
      ? {
          name:
            ((_f = entry.identity.name) === null || _f === void 0 ? void 0 : _f.trim()) ||
            undefined,
          theme:
            ((_g = entry.identity.theme) === null || _g === void 0 ? void 0 : _g.trim()) ||
            undefined,
          emoji:
            ((_h = entry.identity.emoji) === null || _h === void 0 ? void 0 : _h.trim()) ||
            undefined,
          avatar:
            ((_j = entry.identity.avatar) === null || _j === void 0 ? void 0 : _j.trim()) ||
            undefined,
          avatarUrl: resolveIdentityAvatarUrl(
            cfg,
            (0, session_key_js_1.normalizeAgentId)(entry.id),
            (_k = entry.identity.avatar) === null || _k === void 0 ? void 0 : _k.trim(),
          ),
        }
      : undefined;
    configuredById.set((0, session_key_js_1.normalizeAgentId)(entry.id), {
      name: typeof entry.name === "string" && entry.name.trim() ? entry.name.trim() : undefined,
      identity: identity,
    });
  }
  var explicitIds = new Set(
    ((_m = (_l = cfg.agents) === null || _l === void 0 ? void 0 : _l.list) !== null && _m !== void 0
      ? _m
      : []
    )
      .map(function (entry) {
        return (entry === null || entry === void 0 ? void 0 : entry.id)
          ? (0, session_key_js_1.normalizeAgentId)(entry.id)
          : "";
      })
      .filter(Boolean),
  );
  var allowedIds =
    explicitIds.size > 0
      ? new Set(__spreadArray(__spreadArray([], explicitIds, true), [defaultId], false))
      : null;
  var agentIds = listConfiguredAgentIds(cfg).filter(function (id) {
    return allowedIds ? allowedIds.has(id) : true;
  });
  if (mainKey && !agentIds.includes(mainKey)) {
    agentIds = __spreadArray(__spreadArray([], agentIds, true), [mainKey], false);
  }
  var agents = agentIds.map(function (id) {
    var meta = configuredById.get(id);
    return {
      id: id,
      name: meta === null || meta === void 0 ? void 0 : meta.name,
      identity: meta === null || meta === void 0 ? void 0 : meta.identity,
    };
  });
  return { defaultId: defaultId, mainKey: mainKey, scope: scope, agents: agents };
}
function canonicalizeSessionKeyForAgent(agentId, key) {
  if (key === "global" || key === "unknown") {
    return key;
  }
  if (key.startsWith("agent:")) {
    return key;
  }
  return "agent:".concat((0, session_key_js_1.normalizeAgentId)(agentId), ":").concat(key);
}
function resolveDefaultStoreAgentId(cfg) {
  return (0, session_key_js_1.normalizeAgentId)((0, agent_scope_js_1.resolveDefaultAgentId)(cfg));
}
function resolveSessionStoreKey(params) {
  var _a;
  var raw = params.sessionKey.trim();
  if (!raw) {
    return raw;
  }
  if (raw === "global" || raw === "unknown") {
    return raw;
  }
  var parsed = (0, session_key_js_1.parseAgentSessionKey)(raw);
  if (parsed) {
    var agentId_1 = (0, session_key_js_1.normalizeAgentId)(parsed.agentId);
    var canonical = (0, sessions_js_1.canonicalizeMainSessionAlias)({
      cfg: params.cfg,
      agentId: agentId_1,
      sessionKey: raw,
    });
    if (canonical !== raw) {
      return canonical;
    }
    return raw;
  }
  var rawMainKey = (0, session_key_js_1.normalizeMainKey)(
    (_a = params.cfg.session) === null || _a === void 0 ? void 0 : _a.mainKey,
  );
  if (raw === "main" || raw === rawMainKey) {
    return (0, sessions_js_1.resolveMainSessionKey)(params.cfg);
  }
  var agentId = resolveDefaultStoreAgentId(params.cfg);
  return canonicalizeSessionKeyForAgent(agentId, raw);
}
function resolveSessionStoreAgentId(cfg, canonicalKey) {
  if (canonicalKey === "global" || canonicalKey === "unknown") {
    return resolveDefaultStoreAgentId(cfg);
  }
  var parsed = (0, session_key_js_1.parseAgentSessionKey)(canonicalKey);
  if (parsed === null || parsed === void 0 ? void 0 : parsed.agentId) {
    return (0, session_key_js_1.normalizeAgentId)(parsed.agentId);
  }
  return resolveDefaultStoreAgentId(cfg);
}
function canonicalizeSpawnedByForAgent(agentId, spawnedBy) {
  var raw = spawnedBy === null || spawnedBy === void 0 ? void 0 : spawnedBy.trim();
  if (!raw) {
    return undefined;
  }
  if (raw === "global" || raw === "unknown") {
    return raw;
  }
  if (raw.startsWith("agent:")) {
    return raw;
  }
  return "agent:".concat((0, session_key_js_1.normalizeAgentId)(agentId), ":").concat(raw);
}
function resolveGatewaySessionStoreTarget(params) {
  var _a;
  var key = params.key.trim();
  var canonicalKey = resolveSessionStoreKey({
    cfg: params.cfg,
    sessionKey: key,
  });
  var agentId = resolveSessionStoreAgentId(params.cfg, canonicalKey);
  var storeConfig = (_a = params.cfg.session) === null || _a === void 0 ? void 0 : _a.store;
  var storePath = (0, sessions_js_1.resolveStorePath)(storeConfig, { agentId: agentId });
  if (canonicalKey === "global" || canonicalKey === "unknown") {
    var storeKeys_1 = key && key !== canonicalKey ? [canonicalKey, key] : [key];
    return {
      agentId: agentId,
      storePath: storePath,
      canonicalKey: canonicalKey,
      storeKeys: storeKeys_1,
    };
  }
  var storeKeys = new Set();
  storeKeys.add(canonicalKey);
  if (key && key !== canonicalKey) {
    storeKeys.add(key);
  }
  return {
    agentId: agentId,
    storePath: storePath,
    canonicalKey: canonicalKey,
    storeKeys: Array.from(storeKeys),
  };
}
// Merge with existing entry based on latest timestamp to ensure data consistency and avoid overwriting with less complete data.
function mergeSessionEntryIntoCombined(params) {
  var _a, _b, _c, _d;
  var combined = params.combined,
    entry = params.entry,
    agentId = params.agentId,
    canonicalKey = params.canonicalKey;
  var existing = combined[canonicalKey];
  if (
    existing &&
    ((_a = existing.updatedAt) !== null && _a !== void 0 ? _a : 0) >
      ((_b = entry.updatedAt) !== null && _b !== void 0 ? _b : 0)
  ) {
    combined[canonicalKey] = __assign(__assign(__assign({}, entry), existing), {
      spawnedBy: canonicalizeSpawnedByForAgent(
        agentId,
        (_c = existing.spawnedBy) !== null && _c !== void 0 ? _c : entry.spawnedBy,
      ),
    });
  } else {
    combined[canonicalKey] = __assign(__assign(__assign({}, existing), entry), {
      spawnedBy: canonicalizeSpawnedByForAgent(
        agentId,
        (_d = entry.spawnedBy) !== null && _d !== void 0
          ? _d
          : existing === null || existing === void 0
            ? void 0
            : existing.spawnedBy,
      ),
    });
  }
}
function loadCombinedSessionStoreForGateway(cfg) {
  var _a;
  var storeConfig = (_a = cfg.session) === null || _a === void 0 ? void 0 : _a.store;
  if (storeConfig && !isStorePathTemplate(storeConfig)) {
    var storePath_1 = (0, sessions_js_1.resolveStorePath)(storeConfig);
    var defaultAgentId = (0, session_key_js_1.normalizeAgentId)(
      (0, agent_scope_js_1.resolveDefaultAgentId)(cfg),
    );
    var store = (0, sessions_js_1.loadSessionStore)(storePath_1);
    var combined_1 = {};
    for (var _i = 0, _b = Object.entries(store); _i < _b.length; _i++) {
      var _c = _b[_i],
        key = _c[0],
        entry = _c[1];
      var canonicalKey = canonicalizeSessionKeyForAgent(defaultAgentId, key);
      mergeSessionEntryIntoCombined({
        combined: combined_1,
        entry: entry,
        agentId: defaultAgentId,
        canonicalKey: canonicalKey,
      });
    }
    return { storePath: storePath_1, store: combined_1 };
  }
  var agentIds = listConfiguredAgentIds(cfg);
  var combined = {};
  for (var _d = 0, agentIds_1 = agentIds; _d < agentIds_1.length; _d++) {
    var agentId = agentIds_1[_d];
    var storePath_2 = (0, sessions_js_1.resolveStorePath)(storeConfig, { agentId: agentId });
    var store = (0, sessions_js_1.loadSessionStore)(storePath_2);
    for (var _e = 0, _f = Object.entries(store); _e < _f.length; _e++) {
      var _g = _f[_e],
        key = _g[0],
        entry = _g[1];
      var canonicalKey = canonicalizeSessionKeyForAgent(agentId, key);
      mergeSessionEntryIntoCombined({
        combined: combined,
        entry: entry,
        agentId: agentId,
        canonicalKey: canonicalKey,
      });
    }
  }
  var storePath =
    typeof storeConfig === "string" && storeConfig.trim() ? storeConfig.trim() : "(multiple)";
  return { storePath: storePath, store: combined };
}
function getSessionDefaults(cfg) {
  var _a, _b, _c, _d, _e, _f;
  var resolved = (0, model_selection_js_1.resolveConfiguredModelRef)({
    cfg: cfg,
    defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
    defaultModel: defaults_js_1.DEFAULT_MODEL,
  });
  var contextTokens =
    (_d =
      (_c =
        (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null ||
        _b === void 0
          ? void 0
          : _b.contextTokens) !== null && _c !== void 0
        ? _c
        : (0, context_js_1.lookupContextTokens)(resolved.model)) !== null && _d !== void 0
      ? _d
      : defaults_js_1.DEFAULT_CONTEXT_TOKENS;
  return {
    modelProvider: (_e = resolved.provider) !== null && _e !== void 0 ? _e : null,
    model: (_f = resolved.model) !== null && _f !== void 0 ? _f : null,
    contextTokens: contextTokens !== null && contextTokens !== void 0 ? contextTokens : null,
  };
}
function resolveSessionModelRef(cfg, entry) {
  var _a, _b;
  var resolved = (0, model_selection_js_1.resolveConfiguredModelRef)({
    cfg: cfg,
    defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
    defaultModel: defaults_js_1.DEFAULT_MODEL,
  });
  var provider = resolved.provider;
  var model = resolved.model;
  var storedModelOverride =
    (_a = entry === null || entry === void 0 ? void 0 : entry.modelOverride) === null ||
    _a === void 0
      ? void 0
      : _a.trim();
  if (storedModelOverride) {
    provider =
      ((_b = entry === null || entry === void 0 ? void 0 : entry.providerOverride) === null ||
      _b === void 0
        ? void 0
        : _b.trim()) || provider;
    model = storedModelOverride;
  }
  return { provider: provider, model: model };
}
function listSessionsFromStore(params) {
  var cfg = params.cfg,
    storePath = params.storePath,
    store = params.store,
    opts = params.opts;
  var now = Date.now();
  var includeGlobal = opts.includeGlobal === true;
  var includeUnknown = opts.includeUnknown === true;
  var includeDerivedTitles = opts.includeDerivedTitles === true;
  var includeLastMessage = opts.includeLastMessage === true;
  var spawnedBy = typeof opts.spawnedBy === "string" ? opts.spawnedBy : "";
  var label = typeof opts.label === "string" ? opts.label.trim() : "";
  var agentId =
    typeof opts.agentId === "string" ? (0, session_key_js_1.normalizeAgentId)(opts.agentId) : "";
  var search = typeof opts.search === "string" ? opts.search.trim().toLowerCase() : "";
  var activeMinutes =
    typeof opts.activeMinutes === "number" && Number.isFinite(opts.activeMinutes)
      ? Math.max(1, Math.floor(opts.activeMinutes))
      : undefined;
  var sessions = Object.entries(store)
    .filter(function (_a) {
      var key = _a[0];
      if (!includeGlobal && key === "global") {
        return false;
      }
      if (!includeUnknown && key === "unknown") {
        return false;
      }
      if (agentId) {
        if (key === "global" || key === "unknown") {
          return false;
        }
        var parsed = (0, session_key_js_1.parseAgentSessionKey)(key);
        if (!parsed) {
          return false;
        }
        return (0, session_key_js_1.normalizeAgentId)(parsed.agentId) === agentId;
      }
      return true;
    })
    .filter(function (_a) {
      var key = _a[0],
        entry = _a[1];
      if (!spawnedBy) {
        return true;
      }
      if (key === "unknown" || key === "global") {
        return false;
      }
      return (entry === null || entry === void 0 ? void 0 : entry.spawnedBy) === spawnedBy;
    })
    .filter(function (_a) {
      var entry = _a[1];
      if (!label) {
        return true;
      }
      return (entry === null || entry === void 0 ? void 0 : entry.label) === label;
    })
    .map(function (_a) {
      var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
      var key = _a[0],
        entry = _a[1];
      var updatedAt =
        (_b = entry === null || entry === void 0 ? void 0 : entry.updatedAt) !== null &&
        _b !== void 0
          ? _b
          : null;
      var input =
        (_c = entry === null || entry === void 0 ? void 0 : entry.inputTokens) !== null &&
        _c !== void 0
          ? _c
          : 0;
      var output =
        (_d = entry === null || entry === void 0 ? void 0 : entry.outputTokens) !== null &&
        _d !== void 0
          ? _d
          : 0;
      var total =
        (_e = entry === null || entry === void 0 ? void 0 : entry.totalTokens) !== null &&
        _e !== void 0
          ? _e
          : input + output;
      var parsed = parseGroupKey(key);
      var channel =
        (_f = entry === null || entry === void 0 ? void 0 : entry.channel) !== null && _f !== void 0
          ? _f
          : parsed === null || parsed === void 0
            ? void 0
            : parsed.channel;
      var subject = entry === null || entry === void 0 ? void 0 : entry.subject;
      var groupChannel = entry === null || entry === void 0 ? void 0 : entry.groupChannel;
      var space = entry === null || entry === void 0 ? void 0 : entry.space;
      var id = parsed === null || parsed === void 0 ? void 0 : parsed.id;
      var origin = entry === null || entry === void 0 ? void 0 : entry.origin;
      var originLabel = origin === null || origin === void 0 ? void 0 : origin.label;
      var displayName =
        (_j =
          (_h =
            (_g = entry === null || entry === void 0 ? void 0 : entry.displayName) !== null &&
            _g !== void 0
              ? _g
              : channel
                ? (0, sessions_js_1.buildGroupDisplayName)({
                    provider: channel,
                    subject: subject,
                    groupChannel: groupChannel,
                    space: space,
                    id: id,
                    key: key,
                  })
                : undefined) !== null && _h !== void 0
            ? _h
            : entry === null || entry === void 0
              ? void 0
              : entry.label) !== null && _j !== void 0
          ? _j
          : originLabel;
      var deliveryFields = (0, delivery_context_js_1.normalizeSessionDeliveryFields)(entry);
      return {
        key: key,
        entry: entry,
        kind: classifySessionKey(key, entry),
        label: entry === null || entry === void 0 ? void 0 : entry.label,
        displayName: displayName,
        channel: channel,
        subject: subject,
        groupChannel: groupChannel,
        space: space,
        chatType: entry === null || entry === void 0 ? void 0 : entry.chatType,
        origin: origin,
        updatedAt: updatedAt,
        sessionId: entry === null || entry === void 0 ? void 0 : entry.sessionId,
        systemSent: entry === null || entry === void 0 ? void 0 : entry.systemSent,
        abortedLastRun: entry === null || entry === void 0 ? void 0 : entry.abortedLastRun,
        thinkingLevel: entry === null || entry === void 0 ? void 0 : entry.thinkingLevel,
        verboseLevel: entry === null || entry === void 0 ? void 0 : entry.verboseLevel,
        reasoningLevel: entry === null || entry === void 0 ? void 0 : entry.reasoningLevel,
        elevatedLevel: entry === null || entry === void 0 ? void 0 : entry.elevatedLevel,
        sendPolicy: entry === null || entry === void 0 ? void 0 : entry.sendPolicy,
        inputTokens: entry === null || entry === void 0 ? void 0 : entry.inputTokens,
        outputTokens: entry === null || entry === void 0 ? void 0 : entry.outputTokens,
        totalTokens: total,
        responseUsage: entry === null || entry === void 0 ? void 0 : entry.responseUsage,
        modelProvider: entry === null || entry === void 0 ? void 0 : entry.modelProvider,
        model: entry === null || entry === void 0 ? void 0 : entry.model,
        contextTokens: entry === null || entry === void 0 ? void 0 : entry.contextTokens,
        deliveryContext: deliveryFields.deliveryContext,
        lastChannel:
          (_k = deliveryFields.lastChannel) !== null && _k !== void 0
            ? _k
            : entry === null || entry === void 0
              ? void 0
              : entry.lastChannel,
        lastTo:
          (_l = deliveryFields.lastTo) !== null && _l !== void 0
            ? _l
            : entry === null || entry === void 0
              ? void 0
              : entry.lastTo,
        lastAccountId:
          (_m = deliveryFields.lastAccountId) !== null && _m !== void 0
            ? _m
            : entry === null || entry === void 0
              ? void 0
              : entry.lastAccountId,
      };
    })
    .toSorted(function (a, b) {
      var _a, _b;
      return (
        ((_a = b.updatedAt) !== null && _a !== void 0 ? _a : 0) -
        ((_b = a.updatedAt) !== null && _b !== void 0 ? _b : 0)
      );
    });
  if (search) {
    sessions = sessions.filter(function (s) {
      var fields = [s.displayName, s.label, s.subject, s.sessionId, s.key];
      return fields.some(function (f) {
        return typeof f === "string" && f.toLowerCase().includes(search);
      });
    });
  }
  if (activeMinutes !== undefined) {
    var cutoff_1 = now - activeMinutes * 60000;
    sessions = sessions.filter(function (s) {
      var _a;
      return ((_a = s.updatedAt) !== null && _a !== void 0 ? _a : 0) >= cutoff_1;
    });
  }
  if (typeof opts.limit === "number" && Number.isFinite(opts.limit)) {
    var limit = Math.max(1, Math.floor(opts.limit));
    sessions = sessions.slice(0, limit);
  }
  var finalSessions = sessions.map(function (s) {
    var entry = s.entry,
      rest = __rest(s, ["entry"]);
    var derivedTitle;
    var lastMessagePreview;
    if (entry === null || entry === void 0 ? void 0 : entry.sessionId) {
      if (includeDerivedTitles) {
        var firstUserMsg = (0, session_utils_fs_js_1.readFirstUserMessageFromTranscript)(
          entry.sessionId,
          storePath,
          entry.sessionFile,
        );
        derivedTitle = deriveSessionTitle(entry, firstUserMsg);
      }
      if (includeLastMessage) {
        var lastMsg = (0, session_utils_fs_js_1.readLastMessagePreviewFromTranscript)(
          entry.sessionId,
          storePath,
          entry.sessionFile,
        );
        if (lastMsg) {
          lastMessagePreview = lastMsg;
        }
      }
    }
    return __assign(__assign({}, rest), {
      derivedTitle: derivedTitle,
      lastMessagePreview: lastMessagePreview,
    });
  });
  return {
    ts: now,
    path: storePath,
    count: finalSessions.length,
    defaults: getSessionDefaults(cfg),
    sessions: finalSessions,
  };
}
