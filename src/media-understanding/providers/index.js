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
exports.normalizeMediaProviderId = normalizeMediaProviderId;
exports.buildMediaUnderstandingRegistry = buildMediaUnderstandingRegistry;
exports.getMediaUnderstandingProvider = getMediaUnderstandingProvider;
var model_selection_js_1 = require("../../agents/model-selection.js");
var index_js_1 = require("./anthropic/index.js");
var index_js_2 = require("./deepgram/index.js");
var index_js_3 = require("./google/index.js");
var index_js_4 = require("./groq/index.js");
var index_js_5 = require("./minimax/index.js");
var index_js_6 = require("./openai/index.js");
var PROVIDERS = [
  index_js_4.groqProvider,
  index_js_6.openaiProvider,
  index_js_3.googleProvider,
  index_js_1.anthropicProvider,
  index_js_5.minimaxProvider,
  index_js_2.deepgramProvider,
];
function normalizeMediaProviderId(id) {
  var normalized = (0, model_selection_js_1.normalizeProviderId)(id);
  if (normalized === "gemini") {
    return "google";
  }
  return normalized;
}
function buildMediaUnderstandingRegistry(overrides) {
  var _a;
  var registry = new Map();
  for (var _i = 0, PROVIDERS_1 = PROVIDERS; _i < PROVIDERS_1.length; _i++) {
    var provider = PROVIDERS_1[_i];
    registry.set(normalizeMediaProviderId(provider.id), provider);
  }
  if (overrides) {
    for (var _b = 0, _c = Object.entries(overrides); _b < _c.length; _b++) {
      var _d = _c[_b],
        key = _d[0],
        provider = _d[1];
      var normalizedKey = normalizeMediaProviderId(key);
      var existing = registry.get(normalizedKey);
      var merged = existing
        ? __assign(__assign(__assign({}, existing), provider), {
            capabilities:
              (_a = provider.capabilities) !== null && _a !== void 0 ? _a : existing.capabilities,
          })
        : provider;
      registry.set(normalizedKey, merged);
    }
  }
  return registry;
}
function getMediaUnderstandingProvider(id, registry) {
  return registry.get(normalizeMediaProviderId(id));
}
