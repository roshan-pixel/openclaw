"use strict";
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
exports.validateConfigObject = validateConfigObject;
exports.validateConfigObjectWithPlugins = validateConfigObjectWithPlugins;
var node_path_1 = require("node:path");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var registry_js_1 = require("../channels/registry.js");
var config_state_js_1 = require("../plugins/config-state.js");
var manifest_registry_js_1 = require("../plugins/manifest-registry.js");
var schema_validator_js_1 = require("../plugins/schema-validator.js");
var agent_dirs_js_1 = require("./agent-dirs.js");
var defaults_js_1 = require("./defaults.js");
var legacy_js_1 = require("./legacy.js");
var zod_schema_js_1 = require("./zod-schema.js");
var AVATAR_SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;
var AVATAR_DATA_RE = /^data:/i;
var AVATAR_HTTP_RE = /^https?:\/\//i;
var WINDOWS_ABS_RE = /^[a-zA-Z]:[\\/]/;
function isWorkspaceAvatarPath(value, workspaceDir) {
  var workspaceRoot = node_path_1.default.resolve(workspaceDir);
  var resolved = node_path_1.default.resolve(workspaceRoot, value);
  var relative = node_path_1.default.relative(workspaceRoot, resolved);
  if (relative === "") {
    return true;
  }
  if (relative.startsWith("..")) {
    return false;
  }
  return !node_path_1.default.isAbsolute(relative);
}
function validateIdentityAvatar(config) {
  var _a, _b, _c;
  var agents = (_a = config.agents) === null || _a === void 0 ? void 0 : _a.list;
  if (!Array.isArray(agents) || agents.length === 0) {
    return [];
  }
  var issues = [];
  for (var _i = 0, _d = agents.entries(); _i < _d.length; _i++) {
    var _e = _d[_i],
      index = _e[0],
      entry = _e[1];
    if (!entry || typeof entry !== "object") {
      continue;
    }
    var avatarRaw = (_b = entry.identity) === null || _b === void 0 ? void 0 : _b.avatar;
    if (typeof avatarRaw !== "string") {
      continue;
    }
    var avatar = avatarRaw.trim();
    if (!avatar) {
      continue;
    }
    if (AVATAR_DATA_RE.test(avatar) || AVATAR_HTTP_RE.test(avatar)) {
      continue;
    }
    if (avatar.startsWith("~")) {
      issues.push({
        path: "agents.list.".concat(index, ".identity.avatar"),
        message: "identity.avatar must be a workspace-relative path, http(s) URL, or data URI.",
      });
      continue;
    }
    var hasScheme = AVATAR_SCHEME_RE.test(avatar);
    if (hasScheme && !WINDOWS_ABS_RE.test(avatar)) {
      issues.push({
        path: "agents.list.".concat(index, ".identity.avatar"),
        message: "identity.avatar must be a workspace-relative path, http(s) URL, or data URI.",
      });
      continue;
    }
    var workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(
      config,
      (_c = entry.id) !== null && _c !== void 0
        ? _c
        : (0, agent_scope_js_1.resolveDefaultAgentId)(config),
    );
    if (!isWorkspaceAvatarPath(avatar, workspaceDir)) {
      issues.push({
        path: "agents.list.".concat(index, ".identity.avatar"),
        message: "identity.avatar must stay within the agent workspace.",
      });
    }
  }
  return issues;
}
function validateConfigObject(raw) {
  var legacyIssues = (0, legacy_js_1.findLegacyConfigIssues)(raw);
  if (legacyIssues.length > 0) {
    return {
      ok: false,
      issues: legacyIssues.map(function (iss) {
        return {
          path: iss.path,
          message: iss.message,
        };
      }),
    };
  }
  var validated = zod_schema_js_1.OpenClawSchema.safeParse(raw);
  if (!validated.success) {
    return {
      ok: false,
      issues: validated.error.issues.map(function (iss) {
        return {
          path: iss.path.join("."),
          message: iss.message,
        };
      }),
    };
  }
  var duplicates = (0, agent_dirs_js_1.findDuplicateAgentDirs)(validated.data);
  if (duplicates.length > 0) {
    return {
      ok: false,
      issues: [
        {
          path: "agents.list",
          message: (0, agent_dirs_js_1.formatDuplicateAgentDirError)(duplicates),
        },
      ],
    };
  }
  var avatarIssues = validateIdentityAvatar(validated.data);
  if (avatarIssues.length > 0) {
    return { ok: false, issues: avatarIssues };
  }
  return {
    ok: true,
    config: (0, defaults_js_1.applyModelDefaults)(
      (0, defaults_js_1.applyAgentDefaults)(
        (0, defaults_js_1.applySessionDefaults)(validated.data),
      ),
    ),
  };
}
function isRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function validateConfigObjectWithPlugins(raw) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
  var base = validateConfigObject(raw);
  if (!base.ok) {
    return { ok: false, issues: base.issues, warnings: [] };
  }
  var config = base.config;
  var issues = [];
  var warnings = [];
  var pluginsConfig = config.plugins;
  var normalizedPlugins = (0, config_state_js_1.normalizePluginsConfig)(pluginsConfig);
  var workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(
    config,
    (0, agent_scope_js_1.resolveDefaultAgentId)(config),
  );
  var registry = (0, manifest_registry_js_1.loadPluginManifestRegistry)({
    config: config,
    workspaceDir: workspaceDir !== null && workspaceDir !== void 0 ? workspaceDir : undefined,
  });
  var knownIds = new Set(
    registry.plugins.map(function (record) {
      return record.id;
    }),
  );
  for (var _i = 0, _l = registry.diagnostics; _i < _l.length; _i++) {
    var diag = _l[_i];
    var path_1 = diag.pluginId ? "plugins.entries.".concat(diag.pluginId) : "plugins";
    if (!diag.pluginId && diag.message.includes("plugin path not found")) {
      path_1 = "plugins.load.paths";
    }
    var pluginLabel = diag.pluginId ? "plugin ".concat(diag.pluginId) : "plugin";
    var message = "".concat(pluginLabel, ": ").concat(diag.message);
    if (diag.level === "error") {
      issues.push({ path: path_1, message: message });
    } else {
      warnings.push({ path: path_1, message: message });
    }
  }
  var entries = pluginsConfig === null || pluginsConfig === void 0 ? void 0 : pluginsConfig.entries;
  if (entries && isRecord(entries)) {
    for (var _m = 0, _o = Object.keys(entries); _m < _o.length; _m++) {
      var pluginId = _o[_m];
      if (!knownIds.has(pluginId)) {
        issues.push({
          path: "plugins.entries.".concat(pluginId),
          message: "plugin not found: ".concat(pluginId),
        });
      }
    }
  }
  var allow =
    (_a = pluginsConfig === null || pluginsConfig === void 0 ? void 0 : pluginsConfig.allow) !==
      null && _a !== void 0
      ? _a
      : [];
  for (var _p = 0, allow_1 = allow; _p < allow_1.length; _p++) {
    var pluginId = allow_1[_p];
    if (typeof pluginId !== "string" || !pluginId.trim()) {
      continue;
    }
    if (!knownIds.has(pluginId)) {
      issues.push({
        path: "plugins.allow",
        message: "plugin not found: ".concat(pluginId),
      });
    }
  }
  var deny =
    (_b = pluginsConfig === null || pluginsConfig === void 0 ? void 0 : pluginsConfig.deny) !==
      null && _b !== void 0
      ? _b
      : [];
  for (var _q = 0, deny_1 = deny; _q < deny_1.length; _q++) {
    var pluginId = deny_1[_q];
    if (typeof pluginId !== "string" || !pluginId.trim()) {
      continue;
    }
    if (!knownIds.has(pluginId)) {
      issues.push({
        path: "plugins.deny",
        message: "plugin not found: ".concat(pluginId),
      });
    }
  }
  var memorySlot = normalizedPlugins.slots.memory;
  if (typeof memorySlot === "string" && memorySlot.trim() && !knownIds.has(memorySlot)) {
    issues.push({
      path: "plugins.slots.memory",
      message: "plugin not found: ".concat(memorySlot),
    });
  }
  var allowedChannels = new Set(__spreadArray(["defaults"], registry_js_1.CHANNEL_IDS, true));
  for (var _r = 0, _s = registry.plugins; _r < _s.length; _r++) {
    var record = _s[_r];
    for (var _t = 0, _u = record.channels; _t < _u.length; _t++) {
      var channelId = _u[_t];
      allowedChannels.add(channelId);
    }
  }
  if (config.channels && isRecord(config.channels)) {
    for (var _v = 0, _w = Object.keys(config.channels); _v < _w.length; _v++) {
      var key = _w[_v];
      var trimmed = key.trim();
      if (!trimmed) {
        continue;
      }
      if (!allowedChannels.has(trimmed)) {
        issues.push({
          path: "channels.".concat(trimmed),
          message: "unknown channel id: ".concat(trimmed),
        });
      }
    }
  }
  var heartbeatChannelIds = new Set();
  for (var _x = 0, CHANNEL_IDS_1 = registry_js_1.CHANNEL_IDS; _x < CHANNEL_IDS_1.length; _x++) {
    var channelId = CHANNEL_IDS_1[_x];
    heartbeatChannelIds.add(channelId.toLowerCase());
  }
  for (var _y = 0, _z = registry.plugins; _y < _z.length; _y++) {
    var record = _z[_y];
    for (var _0 = 0, _1 = record.channels; _0 < _1.length; _0++) {
      var channelId = _1[_0];
      var trimmed = channelId.trim();
      if (trimmed) {
        heartbeatChannelIds.add(trimmed.toLowerCase());
      }
    }
  }
  var validateHeartbeatTarget = function (target, path) {
    if (typeof target !== "string") {
      return;
    }
    var trimmed = target.trim();
    if (!trimmed) {
      issues.push({ path: path, message: "heartbeat target must not be empty" });
      return;
    }
    var normalized = trimmed.toLowerCase();
    if (normalized === "last" || normalized === "none") {
      return;
    }
    if ((0, registry_js_1.normalizeChatChannelId)(trimmed)) {
      return;
    }
    if (heartbeatChannelIds.has(normalized)) {
      return;
    }
    issues.push({ path: path, message: "unknown heartbeat target: ".concat(target) });
  };
  validateHeartbeatTarget(
    (_e =
      (_d = (_c = config.agents) === null || _c === void 0 ? void 0 : _c.defaults) === null ||
      _d === void 0
        ? void 0
        : _d.heartbeat) === null || _e === void 0
      ? void 0
      : _e.target,
    "agents.defaults.heartbeat.target",
  );
  if (Array.isArray((_f = config.agents) === null || _f === void 0 ? void 0 : _f.list)) {
    for (var _2 = 0, _3 = config.agents.list.entries(); _2 < _3.length; _2++) {
      var _4 = _3[_2],
        index = _4[0],
        entry = _4[1];
      validateHeartbeatTarget(
        (_g = entry === null || entry === void 0 ? void 0 : entry.heartbeat) === null ||
          _g === void 0
          ? void 0
          : _g.target,
        "agents.list.".concat(index, ".heartbeat.target"),
      );
    }
  }
  var selectedMemoryPluginId = null;
  var seenPlugins = new Set();
  for (var _5 = 0, _6 = registry.plugins; _5 < _6.length; _5++) {
    var record = _6[_5];
    var pluginId = record.id;
    if (seenPlugins.has(pluginId)) {
      continue;
    }
    seenPlugins.add(pluginId);
    var entry = normalizedPlugins.entries[pluginId];
    var entryHasConfig = Boolean(entry === null || entry === void 0 ? void 0 : entry.config);
    var enableState = (0, config_state_js_1.resolveEnableState)(
      pluginId,
      record.origin,
      normalizedPlugins,
    );
    var enabled = enableState.enabled;
    var reason = enableState.reason;
    if (enabled) {
      var memoryDecision = (0, config_state_js_1.resolveMemorySlotDecision)({
        id: pluginId,
        kind: record.kind,
        slot: memorySlot,
        selectedId: selectedMemoryPluginId,
      });
      if (!memoryDecision.enabled) {
        enabled = false;
        reason = memoryDecision.reason;
      }
      if (memoryDecision.selected && record.kind === "memory") {
        selectedMemoryPluginId = pluginId;
      }
    }
    var shouldValidate = enabled || entryHasConfig;
    if (shouldValidate) {
      if (record.configSchema) {
        var res = (0, schema_validator_js_1.validateJsonSchemaValue)({
          schema: record.configSchema,
          cacheKey:
            (_j =
              (_h = record.schemaCacheKey) !== null && _h !== void 0 ? _h : record.manifestPath) !==
              null && _j !== void 0
              ? _j
              : pluginId,
          value:
            (_k = entry === null || entry === void 0 ? void 0 : entry.config) !== null &&
            _k !== void 0
              ? _k
              : {},
        });
        if (!res.ok) {
          for (var _7 = 0, _8 = res.errors; _7 < _8.length; _7++) {
            var error = _8[_7];
            issues.push({
              path: "plugins.entries.".concat(pluginId, ".config"),
              message: "invalid config: ".concat(error),
            });
          }
        }
      } else {
        issues.push({
          path: "plugins.entries.".concat(pluginId),
          message: "plugin schema missing for ".concat(pluginId),
        });
      }
    }
    if (!enabled && entryHasConfig) {
      warnings.push({
        path: "plugins.entries.".concat(pluginId),
        message: "plugin disabled (".concat(
          reason !== null && reason !== void 0 ? reason : "disabled",
          ") but config is present",
        ),
      });
    }
  }
  if (issues.length > 0) {
    return { ok: false, issues: issues, warnings: warnings };
  }
  return { ok: true, config: config, warnings: warnings };
}
