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
exports.modelKey = modelKey;
exports.normalizeProviderId = normalizeProviderId;
exports.isCliProvider = isCliProvider;
exports.parseModelRef = parseModelRef;
exports.buildModelAliasIndex = buildModelAliasIndex;
exports.resolveModelRefFromString = resolveModelRefFromString;
exports.resolveConfiguredModelRef = resolveConfiguredModelRef;
exports.resolveDefaultModelForAgent = resolveDefaultModelForAgent;
exports.buildAllowedModelSet = buildAllowedModelSet;
exports.getModelRefStatus = getModelRefStatus;
exports.resolveAllowedModelRef = resolveAllowedModelRef;
exports.resolveThinkingDefault = resolveThinkingDefault;
exports.resolveHooksGmailModel = resolveHooksGmailModel;
var models_config_providers_js_1 = require("./models-config.providers.js");
var agent_scope_js_1 = require("./agent-scope.js");
var defaults_js_1 = require("./defaults.js");
function normalizeAliasKey(value) {
  return value.trim().toLowerCase();
}
function modelKey(provider, model) {
  return "".concat(provider, "/").concat(model);
}
function normalizeProviderId(provider) {
  var normalized = provider.trim().toLowerCase();
  if (normalized === "z.ai" || normalized === "z-ai") {
    return "zai";
  }
  if (normalized === "opencode-zen") {
    return "opencode";
  }
  if (normalized === "qwen") {
    return "qwen-portal";
  }
  return normalized;
}
function isCliProvider(provider, cfg) {
  var _a, _b, _c;
  var normalized = normalizeProviderId(provider);
  if (normalized === "claude-cli") {
    return true;
  }
  if (normalized === "codex-cli") {
    return true;
  }
  var backends =
    (_c =
      (_b =
        (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0
          ? void 0
          : _a.defaults) === null || _b === void 0
        ? void 0
        : _b.cliBackends) !== null && _c !== void 0
      ? _c
      : {};
  return Object.keys(backends).some(function (key) {
    return normalizeProviderId(key) === normalized;
  });
}
function normalizeAnthropicModelId(model) {
  var trimmed = model.trim();
  if (!trimmed) {
    return trimmed;
  }
  var lower = trimmed.toLowerCase();
  if (lower === "opus-4.5") {
    return "claude-opus-4-5";
  }
  if (lower === "sonnet-4.5") {
    return "claude-sonnet-4-5";
  }
  return trimmed;
}
function normalizeProviderModelId(provider, model) {
  if (provider === "anthropic") {
    return normalizeAnthropicModelId(model);
  }
  if (provider === "google") {
    return (0, models_config_providers_js_1.normalizeGoogleModelId)(model);
  }
  return model;
}
function parseModelRef(raw, defaultProvider) {
  var trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  var slash = trimmed.indexOf("/");
  if (slash === -1) {
    var provider_1 = normalizeProviderId(defaultProvider);
    var model_1 = normalizeProviderModelId(provider_1, trimmed);
    return { provider: provider_1, model: model_1 };
  }
  var providerRaw = trimmed.slice(0, slash).trim();
  var provider = normalizeProviderId(providerRaw);
  var model = trimmed.slice(slash + 1).trim();
  if (!provider || !model) {
    return null;
  }
  var normalizedModel = normalizeProviderModelId(provider, model);
  return { provider: provider, model: normalizedModel };
}
function buildModelAliasIndex(params) {
  var _a, _b, _c, _d, _e;
  var byAlias = new Map();
  var byKey = new Map();
  var rawModels =
    (_c =
      (_b = (_a = params.cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null ||
      _b === void 0
        ? void 0
        : _b.models) !== null && _c !== void 0
      ? _c
      : {};
  for (var _i = 0, _f = Object.entries(rawModels); _i < _f.length; _i++) {
    var _g = _f[_i],
      keyRaw = _g[0],
      entryRaw = _g[1];
    var parsed = parseModelRef(
      String(keyRaw !== null && keyRaw !== void 0 ? keyRaw : ""),
      params.defaultProvider,
    );
    if (!parsed) {
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
    var aliasKey = normalizeAliasKey(alias);
    byAlias.set(aliasKey, { alias: alias, ref: parsed });
    var key = modelKey(parsed.provider, parsed.model);
    var existing = (_e = byKey.get(key)) !== null && _e !== void 0 ? _e : [];
    existing.push(alias);
    byKey.set(key, existing);
  }
  return { byAlias: byAlias, byKey: byKey };
}
function resolveModelRefFromString(params) {
  var _a;
  var trimmed = params.raw.trim();
  if (!trimmed) {
    return null;
  }
  if (!trimmed.includes("/")) {
    var aliasKey = normalizeAliasKey(trimmed);
    var aliasMatch =
      (_a = params.aliasIndex) === null || _a === void 0 ? void 0 : _a.byAlias.get(aliasKey);
    if (aliasMatch) {
      return { ref: aliasMatch.ref, alias: aliasMatch.alias };
    }
  }
  var parsed = parseModelRef(trimmed, params.defaultProvider);
  if (!parsed) {
    return null;
  }
  return { ref: parsed };
}
function resolveConfiguredModelRef(params) {
  var rawModel = (function () {
    var _a, _b, _c, _d;
    var raw =
      (_b = (_a = params.cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null ||
      _b === void 0
        ? void 0
        : _b.model;
    if (typeof raw === "string") {
      return raw.trim();
    }
    return (_d =
      (_c = raw === null || raw === void 0 ? void 0 : raw.primary) === null || _c === void 0
        ? void 0
        : _c.trim()) !== null && _d !== void 0
      ? _d
      : "";
  })();
  if (rawModel) {
    var trimmed = rawModel.trim();
    var aliasIndex = buildModelAliasIndex({
      cfg: params.cfg,
      defaultProvider: params.defaultProvider,
    });
    if (!trimmed.includes("/")) {
      var aliasKey = normalizeAliasKey(trimmed);
      var aliasMatch = aliasIndex.byAlias.get(aliasKey);
      if (aliasMatch) {
        return aliasMatch.ref;
      }
      // Default to anthropic if no provider is specified, but warn as this is deprecated.
      console.warn(
        '[openclaw] Model "'
          .concat(trimmed, '" specified without provider. Falling back to "anthropic/')
          .concat(trimmed, '". Please use "anthropic/')
          .concat(trimmed, '" in your config.'),
      );
      return { provider: "anthropic", model: trimmed };
    }
    var resolved = resolveModelRefFromString({
      raw: trimmed,
      defaultProvider: params.defaultProvider,
      aliasIndex: aliasIndex,
    });
    if (resolved) {
      return resolved.ref;
    }
  }
  return { provider: params.defaultProvider, model: params.defaultModel };
}
function resolveDefaultModelForAgent(params) {
  var _a, _b, _c;
  var agentModelOverride = params.agentId
    ? (0, agent_scope_js_1.resolveAgentModelPrimary)(params.cfg, params.agentId)
    : undefined;
  var cfg =
    agentModelOverride && agentModelOverride.length > 0
      ? __assign(__assign({}, params.cfg), {
          agents: __assign(__assign({}, params.cfg.agents), {
            defaults: __assign(
              __assign(
                {},
                (_a = params.cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults,
              ),
              {
                model: __assign(
                  __assign(
                    {},
                    typeof ((_c =
                      (_b = params.cfg.agents) === null || _b === void 0 ? void 0 : _b.defaults) ===
                      null || _c === void 0
                      ? void 0
                      : _c.model) === "object"
                      ? params.cfg.agents.defaults.model
                      : undefined,
                  ),
                  { primary: agentModelOverride },
                ),
              },
            ),
          }),
        })
      : params.cfg;
  return resolveConfiguredModelRef({
    cfg: cfg,
    defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
    defaultModel: defaults_js_1.DEFAULT_MODEL,
  });
}
function buildAllowedModelSet(params) {
  var _a, _b, _c;
  var rawAllowlist = (function () {
    var _a, _b, _c;
    var modelMap =
      (_c =
        (_b = (_a = params.cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null ||
        _b === void 0
          ? void 0
          : _b.models) !== null && _c !== void 0
        ? _c
        : {};
    return Object.keys(modelMap);
  })();
  var allowAny = rawAllowlist.length === 0;
  var defaultModel = (_a = params.defaultModel) === null || _a === void 0 ? void 0 : _a.trim();
  var defaultKey =
    defaultModel && params.defaultProvider
      ? modelKey(params.defaultProvider, defaultModel)
      : undefined;
  var catalogKeys = new Set(
    params.catalog.map(function (entry) {
      return modelKey(entry.provider, entry.id);
    }),
  );
  if (allowAny) {
    if (defaultKey) {
      catalogKeys.add(defaultKey);
    }
    return {
      allowAny: true,
      allowedCatalog: params.catalog,
      allowedKeys: catalogKeys,
    };
  }
  var allowedKeys = new Set();
  var configuredProviders =
    (_c = (_b = params.cfg.models) === null || _b === void 0 ? void 0 : _b.providers) !== null &&
    _c !== void 0
      ? _c
      : {};
  for (var _i = 0, rawAllowlist_1 = rawAllowlist; _i < rawAllowlist_1.length; _i++) {
    var raw = rawAllowlist_1[_i];
    var parsed = parseModelRef(String(raw), params.defaultProvider);
    if (!parsed) {
      continue;
    }
    var key = modelKey(parsed.provider, parsed.model);
    var providerKey = normalizeProviderId(parsed.provider);
    if (isCliProvider(parsed.provider, params.cfg)) {
      allowedKeys.add(key);
    } else if (catalogKeys.has(key)) {
      allowedKeys.add(key);
    } else if (configuredProviders[providerKey] != null) {
      // Explicitly configured providers should be allowlist-able even when
      // they don't exist in the curated model catalog.
      allowedKeys.add(key);
    }
  }
  if (defaultKey) {
    allowedKeys.add(defaultKey);
  }
  var allowedCatalog = params.catalog.filter(function (entry) {
    return allowedKeys.has(modelKey(entry.provider, entry.id));
  });
  if (allowedCatalog.length === 0 && allowedKeys.size === 0) {
    if (defaultKey) {
      catalogKeys.add(defaultKey);
    }
    return {
      allowAny: true,
      allowedCatalog: params.catalog,
      allowedKeys: catalogKeys,
    };
  }
  return { allowAny: false, allowedCatalog: allowedCatalog, allowedKeys: allowedKeys };
}
function getModelRefStatus(params) {
  var allowed = buildAllowedModelSet({
    cfg: params.cfg,
    catalog: params.catalog,
    defaultProvider: params.defaultProvider,
    defaultModel: params.defaultModel,
  });
  var key = modelKey(params.ref.provider, params.ref.model);
  return {
    key: key,
    inCatalog: params.catalog.some(function (entry) {
      return modelKey(entry.provider, entry.id) === key;
    }),
    allowAny: allowed.allowAny,
    allowed: allowed.allowAny || allowed.allowedKeys.has(key),
  };
}
function resolveAllowedModelRef(params) {
  var trimmed = params.raw.trim();
  if (!trimmed) {
    return { error: "invalid model: empty" };
  }
  var aliasIndex = buildModelAliasIndex({
    cfg: params.cfg,
    defaultProvider: params.defaultProvider,
  });
  var resolved = resolveModelRefFromString({
    raw: trimmed,
    defaultProvider: params.defaultProvider,
    aliasIndex: aliasIndex,
  });
  if (!resolved) {
    return { error: "invalid model: ".concat(trimmed) };
  }
  var status = getModelRefStatus({
    cfg: params.cfg,
    catalog: params.catalog,
    ref: resolved.ref,
    defaultProvider: params.defaultProvider,
    defaultModel: params.defaultModel,
  });
  if (!status.allowed) {
    return { error: "model not allowed: ".concat(status.key) };
  }
  return { ref: resolved.ref, key: status.key };
}
function resolveThinkingDefault(params) {
  var _a, _b, _c;
  var configured =
    (_b = (_a = params.cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null ||
    _b === void 0
      ? void 0
      : _b.thinkingDefault;
  if (configured) {
    return configured;
  }
  var candidate =
    (_c = params.catalog) === null || _c === void 0
      ? void 0
      : _c.find(function (entry) {
          return entry.provider === params.provider && entry.id === params.model;
        });
  if (candidate === null || candidate === void 0 ? void 0 : candidate.reasoning) {
    return "low";
  }
  return "off";
}
/**
 * Resolve the model configured for Gmail hook processing.
 * Returns null if hooks.gmail.model is not set.
 */
function resolveHooksGmailModel(params) {
  var _a, _b, _c;
  var hooksModel =
    (_b = (_a = params.cfg.hooks) === null || _a === void 0 ? void 0 : _a.gmail) === null ||
    _b === void 0
      ? void 0
      : _b.model;
  if (!(hooksModel === null || hooksModel === void 0 ? void 0 : hooksModel.trim())) {
    return null;
  }
  var aliasIndex = buildModelAliasIndex({
    cfg: params.cfg,
    defaultProvider: params.defaultProvider,
  });
  var resolved = resolveModelRefFromString({
    raw: hooksModel,
    defaultProvider: params.defaultProvider,
    aliasIndex: aliasIndex,
  });
  return (_c = resolved === null || resolved === void 0 ? void 0 : resolved.ref) !== null &&
    _c !== void 0
    ? _c
    : null;
}
