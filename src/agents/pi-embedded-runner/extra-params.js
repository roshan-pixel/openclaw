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
exports.resolveExtraParams = resolveExtraParams;
exports.applyExtraParamsToAgent = applyExtraParamsToAgent;
var pi_ai_1 = require("@mariozechner/pi-ai");
var logger_js_1 = require("./logger.js");
/**
 * Resolve provider-specific extra params from model config.
 * Used to pass through stream params like temperature/maxTokens.
 *
 * @internal Exported for testing only
 */
function resolveExtraParams(params) {
  var _a, _b, _c, _d;
  var modelKey = "".concat(params.provider, "/").concat(params.modelId);
  var modelConfig =
    (_d =
      (_c =
        (_b = (_a = params.cfg) === null || _a === void 0 ? void 0 : _a.agents) === null ||
        _b === void 0
          ? void 0
          : _b.defaults) === null || _c === void 0
        ? void 0
        : _c.models) === null || _d === void 0
      ? void 0
      : _d[modelKey];
  return (modelConfig === null || modelConfig === void 0 ? void 0 : modelConfig.params)
    ? __assign({}, modelConfig.params)
    : undefined;
}
function resolveCacheControlTtl(extraParams, provider, modelId) {
  var raw = extraParams === null || extraParams === void 0 ? void 0 : extraParams.cacheControlTtl;
  if (raw !== "5m" && raw !== "1h") {
    return undefined;
  }
  if (provider === "anthropic") {
    return raw;
  }
  if (provider === "openrouter" && modelId.startsWith("anthropic/")) {
    return raw;
  }
  return undefined;
}
function createStreamFnWithExtraParams(baseStreamFn, extraParams, provider, modelId) {
  if (!extraParams || Object.keys(extraParams).length === 0) {
    return undefined;
  }
  var streamParams = {};
  if (typeof extraParams.temperature === "number") {
    streamParams.temperature = extraParams.temperature;
  }
  if (typeof extraParams.maxTokens === "number") {
    streamParams.maxTokens = extraParams.maxTokens;
  }
  var cacheControlTtl = resolveCacheControlTtl(extraParams, provider, modelId);
  if (cacheControlTtl) {
    streamParams.cacheControlTtl = cacheControlTtl;
  }
  if (Object.keys(streamParams).length === 0) {
    return undefined;
  }
  logger_js_1.log.debug(
    "creating streamFn wrapper with params: ".concat(JSON.stringify(streamParams)),
  );
  var underlying =
    baseStreamFn !== null && baseStreamFn !== void 0 ? baseStreamFn : pi_ai_1.streamSimple;
  var wrappedStreamFn = function (model, context, options) {
    return underlying(model, context, __assign(__assign({}, streamParams), options));
  };
  return wrappedStreamFn;
}
/**
 * Apply extra params (like temperature) to an agent's streamFn.
 *
 * @internal Exported for testing
 */
function applyExtraParamsToAgent(agent, cfg, provider, modelId, extraParamsOverride) {
  var extraParams = resolveExtraParams({
    cfg: cfg,
    provider: provider,
    modelId: modelId,
  });
  var override =
    extraParamsOverride && Object.keys(extraParamsOverride).length > 0
      ? Object.fromEntries(
          Object.entries(extraParamsOverride).filter(function (_a) {
            var value = _a[1];
            return value !== undefined;
          }),
        )
      : undefined;
  var merged = Object.assign({}, extraParams, override);
  var wrappedStreamFn = createStreamFnWithExtraParams(agent.streamFn, merged, provider, modelId);
  if (wrappedStreamFn) {
    logger_js_1.log.debug(
      "applying extraParams to agent streamFn for ".concat(provider, "/").concat(modelId),
    );
    agent.streamFn = wrappedStreamFn;
  }
}
