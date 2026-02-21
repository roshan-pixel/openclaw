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
exports.decodeDataUrl = decodeDataUrl;
exports.coerceImageAssistantText = coerceImageAssistantText;
exports.coerceImageModelConfig = coerceImageModelConfig;
exports.resolveProviderVisionModelFromConfig = resolveProviderVisionModelFromConfig;
var pi_embedded_utils_js_1 = require("../pi-embedded-utils.js");
function decodeDataUrl(dataUrl) {
  var _a, _b;
  var trimmed = dataUrl.trim();
  var match = /^data:([^;,]+);base64,([a-z0-9+/=\r\n]+)$/i.exec(trimmed);
  if (!match) {
    throw new Error("Invalid data URL (expected base64 data: URL).");
  }
  var mimeType = ((_a = match[1]) !== null && _a !== void 0 ? _a : "").trim().toLowerCase();
  if (!mimeType.startsWith("image/")) {
    throw new Error("Unsupported data URL type: ".concat(mimeType || "unknown"));
  }
  var b64 = ((_b = match[2]) !== null && _b !== void 0 ? _b : "").trim();
  var buffer = Buffer.from(b64, "base64");
  if (buffer.length === 0) {
    throw new Error("Invalid data URL: empty payload.");
  }
  return { buffer: buffer, mimeType: mimeType, kind: "image" };
}
function coerceImageAssistantText(params) {
  var _a;
  var stop = params.message.stopReason;
  var errorMessage =
    (_a = params.message.errorMessage) === null || _a === void 0 ? void 0 : _a.trim();
  if (stop === "error" || stop === "aborted") {
    throw new Error(
      errorMessage
        ? "Image model failed ("
            .concat(params.provider, "/")
            .concat(params.model, "): ")
            .concat(errorMessage)
        : "Image model failed (".concat(params.provider, "/").concat(params.model, ")"),
    );
  }
  if (errorMessage) {
    throw new Error(
      "Image model failed ("
        .concat(params.provider, "/")
        .concat(params.model, "): ")
        .concat(errorMessage),
    );
  }
  var text = (0, pi_embedded_utils_js_1.extractAssistantText)(params.message);
  if (text.trim()) {
    return text.trim();
  }
  throw new Error(
    "Image model returned no text (".concat(params.provider, "/").concat(params.model, ")."),
  );
}
function coerceImageModelConfig(cfg) {
  var _a, _b, _c;
  var imageModel =
    (_b =
      (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0
        ? void 0
        : _a.defaults) === null || _b === void 0
      ? void 0
      : _b.imageModel;
  var primary =
    typeof imageModel === "string"
      ? imageModel.trim()
      : imageModel === null || imageModel === void 0
        ? void 0
        : imageModel.primary;
  var fallbacks =
    typeof imageModel === "object"
      ? (_c = imageModel === null || imageModel === void 0 ? void 0 : imageModel.fallbacks) !==
          null && _c !== void 0
        ? _c
        : []
      : [];
  return __assign(
    __assign(
      {},
      (primary === null || primary === void 0 ? void 0 : primary.trim())
        ? { primary: primary.trim() }
        : {},
    ),
    fallbacks.length > 0 ? { fallbacks: fallbacks } : {},
  );
}
function resolveProviderVisionModelFromConfig(params) {
  var _a, _b, _c, _d, _e;
  var providerCfg =
    (_c =
      (_b = (_a = params.cfg) === null || _a === void 0 ? void 0 : _a.models) === null ||
      _b === void 0
        ? void 0
        : _b.providers) === null || _c === void 0
      ? void 0
      : _c[params.provider];
  var models =
    (_d = providerCfg === null || providerCfg === void 0 ? void 0 : providerCfg.models) !== null &&
    _d !== void 0
      ? _d
      : [];
  var preferMinimaxVl =
    params.provider === "minimax"
      ? models.find(function (m) {
          var _a;
          return (
            ((_a = m === null || m === void 0 ? void 0 : m.id) !== null && _a !== void 0
              ? _a
              : ""
            ).trim() === "MiniMax-VL-01" &&
            Array.isArray(m === null || m === void 0 ? void 0 : m.input) &&
            m.input.includes("image")
          );
        })
      : null;
  var picked =
    preferMinimaxVl !== null && preferMinimaxVl !== void 0
      ? preferMinimaxVl
      : models.find(function (m) {
          var _a, _b;
          return (
            Boolean(
              ((_a = m === null || m === void 0 ? void 0 : m.id) !== null && _a !== void 0
                ? _a
                : ""
              ).trim(),
            ) && ((_b = m.input) === null || _b === void 0 ? void 0 : _b.includes("image"))
          );
        });
  var id = (
    (_e = picked === null || picked === void 0 ? void 0 : picked.id) !== null && _e !== void 0
      ? _e
      : ""
  ).trim();
  return id ? "".concat(params.provider, "/").concat(id) : null;
}
