"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeChannelTargetInput = normalizeChannelTargetInput;
exports.normalizeTargetForProvider = normalizeTargetForProvider;
exports.buildTargetResolverSignature = buildTargetResolverSignature;
var index_js_1 = require("../../channels/plugins/index.js");
function normalizeChannelTargetInput(raw) {
  return raw.trim();
}
function normalizeTargetForProvider(provider, raw) {
  var _a, _b, _c;
  if (!raw) {
    return undefined;
  }
  var providerId = (0, index_js_1.normalizeChannelId)(provider);
  var plugin = providerId ? (0, index_js_1.getChannelPlugin)(providerId) : undefined;
  var normalized =
    (_c =
      (_b =
        (_a = plugin === null || plugin === void 0 ? void 0 : plugin.messaging) === null ||
        _a === void 0
          ? void 0
          : _a.normalizeTarget) === null || _b === void 0
        ? void 0
        : _b.call(_a, raw)) !== null && _c !== void 0
      ? _c
      : raw.trim().toLowerCase() || undefined;
  return normalized || undefined;
}
function buildTargetResolverSignature(channel) {
  var _a, _b;
  var plugin = (0, index_js_1.getChannelPlugin)(channel);
  var resolver =
    (_a = plugin === null || plugin === void 0 ? void 0 : plugin.messaging) === null ||
    _a === void 0
      ? void 0
      : _a.targetResolver;
  var hint =
    (_b = resolver === null || resolver === void 0 ? void 0 : resolver.hint) !== null &&
    _b !== void 0
      ? _b
      : "";
  var looksLike = resolver === null || resolver === void 0 ? void 0 : resolver.looksLikeId;
  var source = looksLike ? looksLike.toString() : "";
  return hashSignature("".concat(hint, "|").concat(source));
}
function hashSignature(value) {
  var hash = 5381;
  for (var i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) + hash) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}
