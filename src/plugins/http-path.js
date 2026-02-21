"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePluginHttpPath = normalizePluginHttpPath;
function normalizePluginHttpPath(path, fallback) {
  var trimmed = path === null || path === void 0 ? void 0 : path.trim();
  if (!trimmed) {
    var fallbackTrimmed = fallback === null || fallback === void 0 ? void 0 : fallback.trim();
    if (!fallbackTrimmed) {
      return null;
    }
    return fallbackTrimmed.startsWith("/") ? fallbackTrimmed : "/".concat(fallbackTrimmed);
  }
  return trimmed.startsWith("/") ? trimmed : "/".concat(trimmed);
}
