"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensurePiCompactionReserveTokens = void 0;
exports.buildEmbeddedExtensionPaths = buildEmbeddedExtensionPaths;
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var context_window_guard_js_1 = require("../context-window-guard.js");
var defaults_js_1 = require("../defaults.js");
var compaction_safeguard_runtime_js_1 = require("../pi-extensions/compaction-safeguard-runtime.js");
var runtime_js_1 = require("../pi-extensions/context-pruning/runtime.js");
var settings_js_1 = require("../pi-extensions/context-pruning/settings.js");
var tools_js_1 = require("../pi-extensions/context-pruning/tools.js");
var pi_settings_js_1 = require("../pi-settings.js");
Object.defineProperty(exports, "ensurePiCompactionReserveTokens", {
  enumerable: true,
  get: function () {
    return pi_settings_js_1.ensurePiCompactionReserveTokens;
  },
});
var cache_ttl_js_1 = require("./cache-ttl.js");
function resolvePiExtensionPath(id) {
  var self = (0, node_url_1.fileURLToPath)(import.meta.url);
  var dir = node_path_1.default.dirname(self);
  // In dev this file is `.ts` (tsx), in production it's `.js`.
  var ext = node_path_1.default.extname(self) === ".ts" ? "ts" : "js";
  return node_path_1.default.join(dir, "..", "pi-extensions", "".concat(id, ".").concat(ext));
}
function resolveContextWindowTokens(params) {
  var _a;
  return (0, context_window_guard_js_1.resolveContextWindowInfo)({
    cfg: params.cfg,
    provider: params.provider,
    modelId: params.modelId,
    modelContextWindow: (_a = params.model) === null || _a === void 0 ? void 0 : _a.contextWindow,
    defaultTokens: defaults_js_1.DEFAULT_CONTEXT_TOKENS,
  }).tokens;
}
function buildContextPruningExtension(params) {
  var _a, _b, _c;
  var raw =
    (_c =
      (_b = (_a = params.cfg) === null || _a === void 0 ? void 0 : _a.agents) === null ||
      _b === void 0
        ? void 0
        : _b.defaults) === null || _c === void 0
      ? void 0
      : _c.contextPruning;
  if ((raw === null || raw === void 0 ? void 0 : raw.mode) !== "cache-ttl") {
    return {};
  }
  if (!(0, cache_ttl_js_1.isCacheTtlEligibleProvider)(params.provider, params.modelId)) {
    return {};
  }
  var settings = (0, settings_js_1.computeEffectiveSettings)(raw);
  if (!settings) {
    return {};
  }
  (0, runtime_js_1.setContextPruningRuntime)(params.sessionManager, {
    settings: settings,
    contextWindowTokens: resolveContextWindowTokens(params),
    isToolPrunable: (0, tools_js_1.makeToolPrunablePredicate)(settings.tools),
    lastCacheTouchAt: (0, cache_ttl_js_1.readLastCacheTtlTimestamp)(params.sessionManager),
  });
  return {
    additionalExtensionPaths: [resolvePiExtensionPath("context-pruning")],
  };
}
function resolveCompactionMode(cfg) {
  var _a, _b, _c;
  return ((_c =
    (_b =
      (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0
        ? void 0
        : _a.defaults) === null || _b === void 0
      ? void 0
      : _b.compaction) === null || _c === void 0
    ? void 0
    : _c.mode) === "safeguard"
    ? "safeguard"
    : "default";
}
function buildEmbeddedExtensionPaths(params) {
  var _a, _b, _c;
  var paths = [];
  if (resolveCompactionMode(params.cfg) === "safeguard") {
    var compactionCfg =
      (_c =
        (_b = (_a = params.cfg) === null || _a === void 0 ? void 0 : _a.agents) === null ||
        _b === void 0
          ? void 0
          : _b.defaults) === null || _c === void 0
        ? void 0
        : _c.compaction;
    (0, compaction_safeguard_runtime_js_1.setCompactionSafeguardRuntime)(params.sessionManager, {
      maxHistoryShare:
        compactionCfg === null || compactionCfg === void 0 ? void 0 : compactionCfg.maxHistoryShare,
    });
    paths.push(resolvePiExtensionPath("compaction-safeguard"));
  }
  var pruning = buildContextPruningExtension(params);
  if (pruning.additionalExtensionPaths) {
    paths.push.apply(paths, pruning.additionalExtensionPaths);
  }
  return paths;
}
