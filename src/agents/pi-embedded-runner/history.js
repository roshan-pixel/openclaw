"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitHistoryTurns = limitHistoryTurns;
exports.getDmHistoryLimitFromSessionKey = getDmHistoryLimitFromSessionKey;
var THREAD_SUFFIX_REGEX = /^(.*)(?::(?:thread|topic):\d+)$/i;
function stripThreadSuffix(value) {
  var _a;
  var match = value.match(THREAD_SUFFIX_REGEX);
  return (_a = match === null || match === void 0 ? void 0 : match[1]) !== null && _a !== void 0
    ? _a
    : value;
}
/**
 * Limits conversation history to the last N user turns (and their associated
 * assistant responses). This reduces token usage for long-running DM sessions.
 */
function limitHistoryTurns(messages, limit) {
  if (!limit || limit <= 0 || messages.length === 0) {
    return messages;
  }
  var userCount = 0;
  var lastUserIndex = messages.length;
  for (var i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") {
      userCount++;
      if (userCount > limit) {
        return messages.slice(lastUserIndex);
      }
      lastUserIndex = i;
    }
  }
  return messages;
}
/**
 * Extract provider + user ID from a session key and look up dmHistoryLimit.
 * Supports per-DM overrides and provider defaults.
 */
function getDmHistoryLimitFromSessionKey(sessionKey, config) {
  var _a, _b;
  if (!sessionKey || !config) {
    return undefined;
  }
  var parts = sessionKey.split(":").filter(Boolean);
  var providerParts = parts.length >= 3 && parts[0] === "agent" ? parts.slice(2) : parts;
  var provider = (_a = providerParts[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
  if (!provider) {
    return undefined;
  }
  var kind = (_b = providerParts[1]) === null || _b === void 0 ? void 0 : _b.toLowerCase();
  var userIdRaw = providerParts.slice(2).join(":");
  var userId = stripThreadSuffix(userIdRaw);
  if (kind !== "dm") {
    return undefined;
  }
  var getLimit = function (providerConfig) {
    var _a, _b;
    if (!providerConfig) {
      return undefined;
    }
    if (
      userId &&
      ((_b = (_a = providerConfig.dms) === null || _a === void 0 ? void 0 : _a[userId]) === null ||
      _b === void 0
        ? void 0
        : _b.historyLimit) !== undefined
    ) {
      return providerConfig.dms[userId].historyLimit;
    }
    return providerConfig.dmHistoryLimit;
  };
  var resolveProviderConfig = function (cfg, providerId) {
    var channels = cfg === null || cfg === void 0 ? void 0 : cfg.channels;
    if (!channels || typeof channels !== "object") {
      return undefined;
    }
    var entry = channels[providerId];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      return undefined;
    }
    return entry;
  };
  return getLimit(resolveProviderConfig(config, provider));
}
