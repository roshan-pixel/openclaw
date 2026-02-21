"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveChannelCapabilities = resolveChannelCapabilities;
var index_js_1 = require("../channels/plugins/index.js");
var session_key_js_1 = require("../routing/session-key.js");
var isStringArray = function (value) {
  return (
    Array.isArray(value) &&
    value.every(function (entry) {
      return typeof entry === "string";
    })
  );
};
function normalizeCapabilities(capabilities) {
  // Handle object-format capabilities (e.g., { inlineButtons: "dm" }) gracefully.
  // Channel-specific handlers (like resolveTelegramInlineButtonsScope) process these separately.
  if (!isStringArray(capabilities)) {
    return undefined;
  }
  var normalized = capabilities
    .map(function (entry) {
      return entry.trim();
    })
    .filter(Boolean);
  return normalized.length > 0 ? normalized : undefined;
}
function resolveAccountCapabilities(params) {
  var _a, _b;
  var cfg = params.cfg;
  if (!cfg) {
    return undefined;
  }
  var normalizedAccountId = (0, session_key_js_1.normalizeAccountId)(params.accountId);
  var accounts = cfg.accounts;
  if (accounts && typeof accounts === "object") {
    var direct = accounts[normalizedAccountId];
    if (direct) {
      return (_a = normalizeCapabilities(direct.capabilities)) !== null && _a !== void 0
        ? _a
        : normalizeCapabilities(cfg.capabilities);
    }
    var matchKey = Object.keys(accounts).find(function (key) {
      return key.toLowerCase() === normalizedAccountId.toLowerCase();
    });
    var match = matchKey ? accounts[matchKey] : undefined;
    if (match) {
      return (_b = normalizeCapabilities(match.capabilities)) !== null && _b !== void 0
        ? _b
        : normalizeCapabilities(cfg.capabilities);
    }
  }
  return normalizeCapabilities(cfg.capabilities);
}
function resolveChannelCapabilities(params) {
  var _a;
  var cfg = params.cfg;
  var channel = (0, index_js_1.normalizeChannelId)(params.channel);
  if (!cfg || !channel) {
    return undefined;
  }
  var channelsConfig = cfg.channels;
  var channelConfig =
    (_a =
      channelsConfig === null || channelsConfig === void 0 ? void 0 : channelsConfig[channel]) !==
      null && _a !== void 0
      ? _a
      : cfg[channel];
  return resolveAccountCapabilities({
    cfg: channelConfig,
    accountId: params.accountId,
  });
}
