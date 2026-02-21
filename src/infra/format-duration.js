"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDurationSeconds = formatDurationSeconds;
exports.formatDurationMs = formatDurationMs;
function formatDurationSeconds(ms, options) {
  var _a, _b;
  if (options === void 0) {
    options = {};
  }
  if (!Number.isFinite(ms)) {
    return "unknown";
  }
  var decimals = (_a = options.decimals) !== null && _a !== void 0 ? _a : 1;
  var unit = (_b = options.unit) !== null && _b !== void 0 ? _b : "s";
  var seconds = Math.max(0, ms) / 1000;
  var fixed = seconds.toFixed(Math.max(0, decimals));
  var trimmed = fixed.replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
  return unit === "seconds" ? "".concat(trimmed, " seconds") : "".concat(trimmed, "s");
}
function formatDurationMs(ms, options) {
  var _a, _b;
  if (options === void 0) {
    options = {};
  }
  if (!Number.isFinite(ms)) {
    return "unknown";
  }
  if (ms < 1000) {
    return "".concat(ms, "ms");
  }
  return formatDurationSeconds(ms, {
    decimals: (_a = options.decimals) !== null && _a !== void 0 ? _a : 2,
    unit: (_b = options.unit) !== null && _b !== void 0 ? _b : "s",
  });
}
