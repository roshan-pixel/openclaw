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
exports.CONTEXT_WINDOW_WARN_BELOW_TOKENS = exports.CONTEXT_WINDOW_HARD_MIN_TOKENS = void 0;
exports.resolveContextWindowInfo = resolveContextWindowInfo;
exports.evaluateContextWindowGuard = evaluateContextWindowGuard;
exports.CONTEXT_WINDOW_HARD_MIN_TOKENS = 16000;
exports.CONTEXT_WINDOW_WARN_BELOW_TOKENS = 32000;
function normalizePositiveInt(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }
  var int = Math.floor(value);
  return int > 0 ? int : null;
}
function resolveContextWindowInfo(params) {
  var _a, _b, _c;
  var fromModel = normalizePositiveInt(params.modelContextWindow);
  if (fromModel) {
    return { tokens: fromModel, source: "model" };
  }
  var fromModelsConfig = (function () {
    var _a, _b;
    var providers =
      (_b = (_a = params.cfg) === null || _a === void 0 ? void 0 : _a.models) === null ||
      _b === void 0
        ? void 0
        : _b.providers;
    var providerEntry =
      providers === null || providers === void 0 ? void 0 : providers[params.provider];
    var models = Array.isArray(
      providerEntry === null || providerEntry === void 0 ? void 0 : providerEntry.models,
    )
      ? providerEntry.models
      : [];
    var match = models.find(function (m) {
      return (m === null || m === void 0 ? void 0 : m.id) === params.modelId;
    });
    return normalizePositiveInt(match === null || match === void 0 ? void 0 : match.contextWindow);
  })();
  if (fromModelsConfig) {
    return { tokens: fromModelsConfig, source: "modelsConfig" };
  }
  var fromAgentConfig = normalizePositiveInt(
    (_c =
      (_b = (_a = params.cfg) === null || _a === void 0 ? void 0 : _a.agents) === null ||
      _b === void 0
        ? void 0
        : _b.defaults) === null || _c === void 0
      ? void 0
      : _c.contextTokens,
  );
  if (fromAgentConfig) {
    return { tokens: fromAgentConfig, source: "agentContextTokens" };
  }
  return { tokens: Math.floor(params.defaultTokens), source: "default" };
}
function evaluateContextWindowGuard(params) {
  var _a, _b;
  var warnBelow = Math.max(
    1,
    Math.floor(
      (_a = params.warnBelowTokens) !== null && _a !== void 0
        ? _a
        : exports.CONTEXT_WINDOW_WARN_BELOW_TOKENS,
    ),
  );
  var hardMin = Math.max(
    1,
    Math.floor(
      (_b = params.hardMinTokens) !== null && _b !== void 0
        ? _b
        : exports.CONTEXT_WINDOW_HARD_MIN_TOKENS,
    ),
  );
  var tokens = Math.max(0, Math.floor(params.info.tokens));
  return __assign(__assign({}, params.info), {
    tokens: tokens,
    shouldWarn: tokens > 0 && tokens < warnBelow,
    shouldBlock: tokens > 0 && tokens < hardMin,
  });
}
