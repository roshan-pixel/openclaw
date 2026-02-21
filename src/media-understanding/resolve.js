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
exports.resolveTimeoutMs = resolveTimeoutMs;
exports.resolvePrompt = resolvePrompt;
exports.resolveMaxChars = resolveMaxChars;
exports.resolveMaxBytes = resolveMaxBytes;
exports.resolveCapabilityConfig = resolveCapabilityConfig;
exports.resolveScopeDecision = resolveScopeDecision;
exports.resolveModelEntries = resolveModelEntries;
exports.resolveConcurrency = resolveConcurrency;
exports.resolveEntriesWithActiveFallback = resolveEntriesWithActiveFallback;
var globals_js_1 = require("../globals.js");
var defaults_js_1 = require("./defaults.js");
var index_js_1 = require("./providers/index.js");
var scope_js_1 = require("./scope.js");
function resolveTimeoutMs(seconds, fallbackSeconds) {
  var value = typeof seconds === "number" && Number.isFinite(seconds) ? seconds : fallbackSeconds;
  return Math.max(1000, Math.floor(value * 1000));
}
function resolvePrompt(capability, prompt, maxChars) {
  var base =
    (prompt === null || prompt === void 0 ? void 0 : prompt.trim()) ||
    defaults_js_1.DEFAULT_PROMPT[capability];
  if (!maxChars || capability === "audio") {
    return base;
  }
  return "".concat(base, " Respond in at most ").concat(maxChars, " characters.");
}
function resolveMaxChars(params) {
  var _a, _b, _c, _d, _e, _f;
  var capability = params.capability,
    entry = params.entry,
    cfg = params.cfg;
  var configured =
    (_c =
      (_a = entry.maxChars) !== null && _a !== void 0
        ? _a
        : (_b = params.config) === null || _b === void 0
          ? void 0
          : _b.maxChars) !== null && _c !== void 0
      ? _c
      : (_f =
            (_e = (_d = cfg.tools) === null || _d === void 0 ? void 0 : _d.media) === null ||
            _e === void 0
              ? void 0
              : _e[capability]) === null || _f === void 0
        ? void 0
        : _f.maxChars;
  if (typeof configured === "number") {
    return configured;
  }
  return defaults_js_1.DEFAULT_MAX_CHARS_BY_CAPABILITY[capability];
}
function resolveMaxBytes(params) {
  var _a, _b, _c, _d, _e, _f;
  var configured =
    (_c =
      (_a = params.entry.maxBytes) !== null && _a !== void 0
        ? _a
        : (_b = params.config) === null || _b === void 0
          ? void 0
          : _b.maxBytes) !== null && _c !== void 0
      ? _c
      : (_f =
            (_e = (_d = params.cfg.tools) === null || _d === void 0 ? void 0 : _d.media) === null ||
            _e === void 0
              ? void 0
              : _e[params.capability]) === null || _f === void 0
        ? void 0
        : _f.maxBytes;
  if (typeof configured === "number") {
    return configured;
  }
  return defaults_js_1.DEFAULT_MAX_BYTES[params.capability];
}
function resolveCapabilityConfig(cfg, capability) {
  var _a, _b;
  return (_b = (_a = cfg.tools) === null || _a === void 0 ? void 0 : _a.media) === null ||
    _b === void 0
    ? void 0
    : _b[capability];
}
function resolveScopeDecision(params) {
  var _a;
  return (0, scope_js_1.resolveMediaUnderstandingScope)({
    scope: params.scope,
    sessionKey: params.ctx.SessionKey,
    channel: (_a = params.ctx.Surface) !== null && _a !== void 0 ? _a : params.ctx.Provider,
    chatType: (0, scope_js_1.normalizeMediaUnderstandingChatType)(params.ctx.ChatType),
  });
}
function resolveEntryCapabilities(params) {
  var _a, _b, _c;
  var entryType =
    (_a = params.entry.type) !== null && _a !== void 0
      ? _a
      : params.entry.command
        ? "cli"
        : "provider";
  if (entryType === "cli") {
    return undefined;
  }
  var providerId = (0, index_js_1.normalizeMediaProviderId)(
    (_b = params.entry.provider) !== null && _b !== void 0 ? _b : "",
  );
  if (!providerId) {
    return undefined;
  }
  return (_c = params.providerRegistry.get(providerId)) === null || _c === void 0
    ? void 0
    : _c.capabilities;
}
function resolveModelEntries(params) {
  var _a, _b, _c, _d;
  var cfg = params.cfg,
    capability = params.capability,
    config = params.config;
  var sharedModels =
    (_c =
      (_b = (_a = cfg.tools) === null || _a === void 0 ? void 0 : _a.media) === null ||
      _b === void 0
        ? void 0
        : _b.models) !== null && _c !== void 0
      ? _c
      : [];
  var entries = __spreadArray(
    __spreadArray(
      [],
      ((_d = config === null || config === void 0 ? void 0 : config.models) !== null &&
      _d !== void 0
        ? _d
        : []
      ).map(function (entry) {
        return { entry: entry, source: "capability" };
      }),
      true,
    ),
    sharedModels.map(function (entry) {
      return { entry: entry, source: "shared" };
    }),
    true,
  );
  if (entries.length === 0) {
    return [];
  }
  return entries
    .filter(function (_a) {
      var _b, _c;
      var entry = _a.entry,
        source = _a.source;
      var caps =
        entry.capabilities && entry.capabilities.length > 0
          ? entry.capabilities
          : source === "shared"
            ? resolveEntryCapabilities({ entry: entry, providerRegistry: params.providerRegistry })
            : undefined;
      if (!caps || caps.length === 0) {
        if (source === "shared") {
          if ((0, globals_js_1.shouldLogVerbose)()) {
            (0, globals_js_1.logVerbose)(
              "Skipping shared media model without capabilities: ".concat(
                (_c = (_b = entry.provider) !== null && _b !== void 0 ? _b : entry.command) !==
                  null && _c !== void 0
                  ? _c
                  : "unknown",
              ),
            );
          }
          return false;
        }
        return true;
      }
      return caps.includes(capability);
    })
    .map(function (_a) {
      var entry = _a.entry;
      return entry;
    });
}
function resolveConcurrency(cfg) {
  var _a, _b;
  var configured =
    (_b = (_a = cfg.tools) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0
      ? void 0
      : _b.concurrency;
  if (typeof configured === "number" && Number.isFinite(configured) && configured > 0) {
    return Math.floor(configured);
  }
  return defaults_js_1.DEFAULT_MEDIA_CONCURRENCY;
}
function resolveEntriesWithActiveFallback(params) {
  var _a, _b, _c, _d, _e;
  var entries = resolveModelEntries({
    cfg: params.cfg,
    capability: params.capability,
    config: params.config,
    providerRegistry: params.providerRegistry,
  });
  if (entries.length > 0) {
    return entries;
  }
  if (((_a = params.config) === null || _a === void 0 ? void 0 : _a.enabled) !== true) {
    return entries;
  }
  var activeProviderRaw =
    (_c = (_b = params.activeModel) === null || _b === void 0 ? void 0 : _b.provider) === null ||
    _c === void 0
      ? void 0
      : _c.trim();
  if (!activeProviderRaw) {
    return entries;
  }
  var activeProvider = (0, index_js_1.normalizeMediaProviderId)(activeProviderRaw);
  if (!activeProvider) {
    return entries;
  }
  var capabilities =
    (_d = params.providerRegistry.get(activeProvider)) === null || _d === void 0
      ? void 0
      : _d.capabilities;
  if (!capabilities || !capabilities.includes(params.capability)) {
    return entries;
  }
  return [
    {
      type: "provider",
      provider: activeProvider,
      model: (_e = params.activeModel) === null || _e === void 0 ? void 0 : _e.model,
    },
  ];
}
