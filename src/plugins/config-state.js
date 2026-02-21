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
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePluginsConfig = exports.BUNDLED_ENABLED_BY_DEFAULT = void 0;
exports.applyTestPluginDefaults = applyTestPluginDefaults;
exports.isTestDefaultMemorySlotDisabled = isTestDefaultMemorySlotDisabled;
exports.resolveEnableState = resolveEnableState;
exports.resolveMemorySlotDecision = resolveMemorySlotDecision;
var slots_js_1 = require("./slots.js");
exports.BUNDLED_ENABLED_BY_DEFAULT = new Set();
var normalizeList = function (value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map(function (entry) {
      return typeof entry === "string" ? entry.trim() : "";
    })
    .filter(Boolean);
};
var normalizeSlotValue = function (value) {
  if (typeof value !== "string") {
    return undefined;
  }
  var trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.toLowerCase() === "none") {
    return null;
  }
  return trimmed;
};
var normalizePluginEntries = function (entries) {
  if (!entries || typeof entries !== "object" || Array.isArray(entries)) {
    return {};
  }
  var normalized = {};
  for (var _i = 0, _a = Object.entries(entries); _i < _a.length; _i++) {
    var _b = _a[_i],
      key = _b[0],
      value = _b[1];
    if (!key.trim()) {
      continue;
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      normalized[key] = {};
      continue;
    }
    var entry = value;
    normalized[key] = {
      enabled: typeof entry.enabled === "boolean" ? entry.enabled : undefined,
      config: "config" in entry ? entry.config : undefined,
    };
  }
  return normalized;
};
var normalizePluginsConfig = function (config) {
  var _a, _b;
  var memorySlot = normalizeSlotValue(
    (_a = config === null || config === void 0 ? void 0 : config.slots) === null || _a === void 0
      ? void 0
      : _a.memory,
  );
  return {
    enabled: (config === null || config === void 0 ? void 0 : config.enabled) !== false,
    allow: normalizeList(config === null || config === void 0 ? void 0 : config.allow),
    deny: normalizeList(config === null || config === void 0 ? void 0 : config.deny),
    loadPaths: normalizeList(
      (_b = config === null || config === void 0 ? void 0 : config.load) === null || _b === void 0
        ? void 0
        : _b.paths,
    ),
    slots: {
      memory: memorySlot === undefined ? (0, slots_js_1.defaultSlotIdForKey)("memory") : memorySlot,
    },
    entries: normalizePluginEntries(config === null || config === void 0 ? void 0 : config.entries),
  };
};
exports.normalizePluginsConfig = normalizePluginsConfig;
var hasExplicitMemorySlot = function (plugins) {
  return Boolean(
    (plugins === null || plugins === void 0 ? void 0 : plugins.slots) &&
    Object.prototype.hasOwnProperty.call(plugins.slots, "memory"),
  );
};
var hasExplicitMemoryEntry = function (plugins) {
  return Boolean(
    (plugins === null || plugins === void 0 ? void 0 : plugins.entries) &&
    Object.prototype.hasOwnProperty.call(plugins.entries, "memory-core"),
  );
};
var hasExplicitPluginConfig = function (plugins) {
  var _a;
  if (!plugins) {
    return false;
  }
  if (typeof plugins.enabled === "boolean") {
    return true;
  }
  if (Array.isArray(plugins.allow) && plugins.allow.length > 0) {
    return true;
  }
  if (Array.isArray(plugins.deny) && plugins.deny.length > 0) {
    return true;
  }
  if (
    ((_a = plugins.load) === null || _a === void 0 ? void 0 : _a.paths) &&
    Array.isArray(plugins.load.paths) &&
    plugins.load.paths.length > 0
  ) {
    return true;
  }
  if (plugins.slots && Object.keys(plugins.slots).length > 0) {
    return true;
  }
  if (plugins.entries && Object.keys(plugins.entries).length > 0) {
    return true;
  }
  return false;
};
function applyTestPluginDefaults(cfg, env) {
  if (env === void 0) {
    env = process.env;
  }
  if (!env.VITEST) {
    return cfg;
  }
  var plugins = cfg.plugins;
  var explicitConfig = hasExplicitPluginConfig(plugins);
  if (explicitConfig) {
    if (hasExplicitMemorySlot(plugins) || hasExplicitMemoryEntry(plugins)) {
      return cfg;
    }
    return __assign(__assign({}, cfg), {
      plugins: __assign(__assign({}, plugins), {
        slots: __assign(
          __assign({}, plugins === null || plugins === void 0 ? void 0 : plugins.slots),
          { memory: "none" },
        ),
      }),
    });
  }
  return __assign(__assign({}, cfg), {
    plugins: __assign(__assign({}, plugins), {
      enabled: false,
      slots: __assign(
        __assign({}, plugins === null || plugins === void 0 ? void 0 : plugins.slots),
        { memory: "none" },
      ),
    }),
  });
}
function isTestDefaultMemorySlotDisabled(cfg, env) {
  if (env === void 0) {
    env = process.env;
  }
  if (!env.VITEST) {
    return false;
  }
  var plugins = cfg.plugins;
  if (hasExplicitMemorySlot(plugins) || hasExplicitMemoryEntry(plugins)) {
    return false;
  }
  return true;
}
function resolveEnableState(id, origin, config) {
  if (!config.enabled) {
    return { enabled: false, reason: "plugins disabled" };
  }
  if (config.deny.includes(id)) {
    return { enabled: false, reason: "blocked by denylist" };
  }
  if (config.allow.length > 0 && !config.allow.includes(id)) {
    return { enabled: false, reason: "not in allowlist" };
  }
  if (config.slots.memory === id) {
    return { enabled: true };
  }
  var entry = config.entries[id];
  if ((entry === null || entry === void 0 ? void 0 : entry.enabled) === true) {
    return { enabled: true };
  }
  if ((entry === null || entry === void 0 ? void 0 : entry.enabled) === false) {
    return { enabled: false, reason: "disabled in config" };
  }
  if (origin === "bundled" && exports.BUNDLED_ENABLED_BY_DEFAULT.has(id)) {
    return { enabled: true };
  }
  if (origin === "bundled") {
    return { enabled: false, reason: "bundled (disabled by default)" };
  }
  return { enabled: true };
}
function resolveMemorySlotDecision(params) {
  if (params.kind !== "memory") {
    return { enabled: true };
  }
  if (params.slot === null) {
    return { enabled: false, reason: "memory slot disabled" };
  }
  if (typeof params.slot === "string") {
    if (params.slot === params.id) {
      return { enabled: true, selected: true };
    }
    return {
      enabled: false,
      reason: 'memory slot set to "'.concat(params.slot, '"'),
    };
  }
  if (params.selectedId && params.selectedId !== params.id) {
    return {
      enabled: false,
      reason: 'memory slot already filled by "'.concat(params.selectedId, '"'),
    };
  }
  return { enabled: true, selected: true };
}
