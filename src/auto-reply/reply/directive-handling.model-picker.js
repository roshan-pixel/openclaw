"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildModelPickerItems = buildModelPickerItems;
exports.resolveProviderEndpointLabel = resolveProviderEndpointLabel;
var model_selection_js_1 = require("../../agents/model-selection.js");
var MODEL_PICK_PROVIDER_PREFERENCE = [
  "anthropic",
  "openai",
  "openai-codex",
  "minimax",
  "synthetic",
  "google",
  "zai",
  "openrouter",
  "opencode",
  "github-copilot",
  "groq",
  "cerebras",
  "mistral",
  "xai",
  "lmstudio",
];
var PROVIDER_RANK = new Map(
  MODEL_PICK_PROVIDER_PREFERENCE.map(function (provider, idx) {
    return [provider, idx];
  }),
);
function compareProvidersForPicker(a, b) {
  var pa = PROVIDER_RANK.get(a);
  var pb = PROVIDER_RANK.get(b);
  if (pa !== undefined && pb !== undefined) {
    return pa - pb;
  }
  if (pa !== undefined) {
    return -1;
  }
  if (pb !== undefined) {
    return 1;
  }
  return a.localeCompare(b);
}
function buildModelPickerItems(catalog) {
  var _a;
  var seen = new Set();
  var out = [];
  for (var _i = 0, catalog_1 = catalog; _i < catalog_1.length; _i++) {
    var entry = catalog_1[_i];
    var provider = (0, model_selection_js_1.normalizeProviderId)(entry.provider);
    var model = (_a = entry.id) === null || _a === void 0 ? void 0 : _a.trim();
    if (!provider || !model) {
      continue;
    }
    var key = "".concat(provider, "/").concat(model);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push({ model: model, provider: provider });
  }
  // Sort by provider preference first, then by model name
  out.sort(function (a, b) {
    var providerOrder = compareProvidersForPicker(a.provider, b.provider);
    if (providerOrder !== 0) {
      return providerOrder;
    }
    return a.model.toLowerCase().localeCompare(b.model.toLowerCase());
  });
  return out;
}
function resolveProviderEndpointLabel(provider, cfg) {
  var _a, _b, _c, _d;
  var normalized = (0, model_selection_js_1.normalizeProviderId)(provider);
  var providers =
    (_b = (_a = cfg.models) === null || _a === void 0 ? void 0 : _a.providers) !== null &&
    _b !== void 0
      ? _b
      : {};
  var entry = providers[normalized];
  var endpoint =
    (_c = entry === null || entry === void 0 ? void 0 : entry.baseUrl) === null || _c === void 0
      ? void 0
      : _c.trim();
  var api =
    (_d = entry === null || entry === void 0 ? void 0 : entry.api) === null || _d === void 0
      ? void 0
      : _d.trim();
  return {
    endpoint: endpoint || undefined,
    api: api || undefined,
  };
}
