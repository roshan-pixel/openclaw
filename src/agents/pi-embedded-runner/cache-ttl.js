"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CACHE_TTL_CUSTOM_TYPE = void 0;
exports.isCacheTtlEligibleProvider = isCacheTtlEligibleProvider;
exports.readLastCacheTtlTimestamp = readLastCacheTtlTimestamp;
exports.appendCacheTtlTimestamp = appendCacheTtlTimestamp;
exports.CACHE_TTL_CUSTOM_TYPE = "openclaw.cache-ttl";
function isCacheTtlEligibleProvider(provider, modelId) {
  var normalizedProvider = provider.toLowerCase();
  var normalizedModelId = modelId.toLowerCase();
  if (normalizedProvider === "anthropic") {
    return true;
  }
  if (normalizedProvider === "openrouter" && normalizedModelId.startsWith("anthropic/")) {
    return true;
  }
  return false;
}
function readLastCacheTtlTimestamp(sessionManager) {
  var sm = sessionManager;
  if (!(sm === null || sm === void 0 ? void 0 : sm.getEntries)) {
    return null;
  }
  try {
    var entries = sm.getEntries();
    var last = null;
    for (var i = entries.length - 1; i >= 0; i--) {
      var entry = entries[i];
      if (
        (entry === null || entry === void 0 ? void 0 : entry.type) !== "custom" ||
        (entry === null || entry === void 0 ? void 0 : entry.customType) !==
          exports.CACHE_TTL_CUSTOM_TYPE
      ) {
        continue;
      }
      var data = entry === null || entry === void 0 ? void 0 : entry.data;
      var ts =
        typeof (data === null || data === void 0 ? void 0 : data.timestamp) === "number"
          ? data.timestamp
          : null;
      if (ts && Number.isFinite(ts)) {
        last = ts;
        break;
      }
    }
    return last;
  } catch (_a) {
    return null;
  }
}
function appendCacheTtlTimestamp(sessionManager, data) {
  var sm = sessionManager;
  if (!(sm === null || sm === void 0 ? void 0 : sm.appendCustomEntry)) {
    return;
  }
  try {
    sm.appendCustomEntry(exports.CACHE_TTL_CUSTOM_TYPE, data);
  } catch (_a) {
    // ignore persistence failures
  }
}
