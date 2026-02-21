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
exports.buildInlineProviderModels = buildInlineProviderModels;
exports.buildModelAliasLines = buildModelAliasLines;
exports.resolveModel = resolveModel;
var pi_coding_agent_1 = require("@mariozechner/pi-coding-agent");
var agent_paths_js_1 = require("../agent-paths.js");
var defaults_js_1 = require("../defaults.js");
var model_compat_js_1 = require("../model-compat.js");
var model_selection_js_1 = require("../model-selection.js");
function buildInlineProviderModels(providers) {
  return Object.entries(providers).flatMap(function (_a) {
    var _b;
    var providerId = _a[0],
      entry = _a[1];
    var trimmed = providerId.trim();
    if (!trimmed) {
      return [];
    }
    return (
      (_b = entry === null || entry === void 0 ? void 0 : entry.models) !== null && _b !== void 0
        ? _b
        : []
    ).map(function (model) {
      var _a;
      return __assign(__assign({}, model), {
        provider: trimmed,
        baseUrl: entry === null || entry === void 0 ? void 0 : entry.baseUrl,
        api:
          (_a = model.api) !== null && _a !== void 0
            ? _a
            : entry === null || entry === void 0
              ? void 0
              : entry.api,
      });
    });
  });
}
function buildModelAliasLines(cfg) {
  var _a, _b, _c, _d;
  var models =
    (_c =
      (_b =
        (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0
          ? void 0
          : _a.defaults) === null || _b === void 0
        ? void 0
        : _b.models) !== null && _c !== void 0
      ? _c
      : {};
  var entries = [];
  for (var _i = 0, _e = Object.entries(models); _i < _e.length; _i++) {
    var _f = _e[_i],
      keyRaw = _f[0],
      entryRaw = _f[1];
    var model = String(keyRaw !== null && keyRaw !== void 0 ? keyRaw : "").trim();
    if (!model) {
      continue;
    }
    var alias = String(
      (_d = entryRaw === null || entryRaw === void 0 ? void 0 : entryRaw.alias) !== null &&
        _d !== void 0
        ? _d
        : "",
    ).trim();
    if (!alias) {
      continue;
    }
    entries.push({ alias: alias, model: model });
  }
  return entries
    .toSorted(function (a, b) {
      return a.alias.localeCompare(b.alias);
    })
    .map(function (entry) {
      return "- ".concat(entry.alias, ": ").concat(entry.model);
    });
}
function resolveModel(provider, modelId, agentDir, cfg) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j;
  var resolvedAgentDir =
    agentDir !== null && agentDir !== void 0
      ? agentDir
      : (0, agent_paths_js_1.resolveOpenClawAgentDir)();
  var authStorage = (0, pi_coding_agent_1.discoverAuthStorage)(resolvedAgentDir);
  var modelRegistry = (0, pi_coding_agent_1.discoverModels)(authStorage, resolvedAgentDir);
  var model = modelRegistry.find(provider, modelId);
  if (!model) {
    var providers =
      (_b =
        (_a = cfg === null || cfg === void 0 ? void 0 : cfg.models) === null || _a === void 0
          ? void 0
          : _a.providers) !== null && _b !== void 0
        ? _b
        : {};
    var inlineModels = buildInlineProviderModels(providers);
    var normalizedProvider_1 = (0, model_selection_js_1.normalizeProviderId)(provider);
    var inlineMatch = inlineModels.find(function (entry) {
      return (
        (0, model_selection_js_1.normalizeProviderId)(entry.provider) === normalizedProvider_1 &&
        entry.id === modelId
      );
    });
    if (inlineMatch) {
      var normalized = (0, model_compat_js_1.normalizeModelCompat)(inlineMatch);
      return {
        model: normalized,
        authStorage: authStorage,
        modelRegistry: modelRegistry,
      };
    }
    var providerCfg = providers[provider];
    if (providerCfg || modelId.startsWith("mock-")) {
      var fallbackModel = (0, model_compat_js_1.normalizeModelCompat)({
        id: modelId,
        name: modelId,
        api:
          (_c = providerCfg === null || providerCfg === void 0 ? void 0 : providerCfg.api) !==
            null && _c !== void 0
            ? _c
            : "openai-responses",
        provider: provider,
        baseUrl: providerCfg === null || providerCfg === void 0 ? void 0 : providerCfg.baseUrl,
        reasoning: false,
        input: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow:
          (_f =
            (_e =
              (_d =
                providerCfg === null || providerCfg === void 0 ? void 0 : providerCfg.models) ===
                null || _d === void 0
                ? void 0
                : _d[0]) === null || _e === void 0
              ? void 0
              : _e.contextWindow) !== null && _f !== void 0
            ? _f
            : defaults_js_1.DEFAULT_CONTEXT_TOKENS,
        maxTokens:
          (_j =
            (_h =
              (_g =
                providerCfg === null || providerCfg === void 0 ? void 0 : providerCfg.models) ===
                null || _g === void 0
                ? void 0
                : _g[0]) === null || _h === void 0
              ? void 0
              : _h.maxTokens) !== null && _j !== void 0
            ? _j
            : defaults_js_1.DEFAULT_CONTEXT_TOKENS,
      });
      return { model: fallbackModel, authStorage: authStorage, modelRegistry: modelRegistry };
    }
    return {
      error: "Unknown model: ".concat(provider, "/").concat(modelId),
      authStorage: authStorage,
      modelRegistry: modelRegistry,
    };
  }
  return {
    model: (0, model_compat_js_1.normalizeModelCompat)(model),
    authStorage: authStorage,
    modelRegistry: modelRegistry,
  };
}
