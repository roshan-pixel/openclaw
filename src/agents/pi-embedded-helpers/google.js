"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeGoogleTurnOrdering = void 0;
exports.isGoogleModelApi = isGoogleModelApi;
exports.isAntigravityClaude = isAntigravityClaude;
var bootstrap_js_1 = require("./bootstrap.js");
Object.defineProperty(exports, "sanitizeGoogleTurnOrdering", {
  enumerable: true,
  get: function () {
    return bootstrap_js_1.sanitizeGoogleTurnOrdering;
  },
});
function isGoogleModelApi(api) {
  return (
    api === "google-gemini-cli" || api === "google-generative-ai" || api === "google-antigravity"
  );
}
function isAntigravityClaude(params) {
  var _a, _b, _c, _d;
  var provider = (_a = params.provider) === null || _a === void 0 ? void 0 : _a.toLowerCase();
  var api = (_b = params.api) === null || _b === void 0 ? void 0 : _b.toLowerCase();
  if (provider !== "google-antigravity" && api !== "google-antigravity") {
    return false;
  }
  return (_d =
    (_c = params.modelId) === null || _c === void 0
      ? void 0
      : _c.toLowerCase().includes("claude")) !== null && _d !== void 0
    ? _d
    : false;
}
