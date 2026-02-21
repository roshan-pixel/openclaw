"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveChannelConfigWrites = resolveChannelConfigWrites;
var session_key_js_1 = require("../../routing/session-key.js");
function resolveAccountConfig(accounts, accountId) {
  if (!accounts || typeof accounts !== "object") {
    return undefined;
  }
  if (accountId in accounts) {
    return accounts[accountId];
  }
  var matchKey = Object.keys(accounts).find(function (key) {
    return key.toLowerCase() === accountId.toLowerCase();
  });
  return matchKey ? accounts[matchKey] : undefined;
}
function resolveChannelConfigWrites(params) {
  var _a;
  if (!params.channelId) {
    return true;
  }
  var channels = params.cfg.channels;
  var channelConfig =
    channels === null || channels === void 0 ? void 0 : channels[params.channelId];
  if (!channelConfig) {
    return true;
  }
  var accountId = (0, session_key_js_1.normalizeAccountId)(params.accountId);
  var accountConfig = resolveAccountConfig(channelConfig.accounts, accountId);
  var value =
    (_a =
      accountConfig === null || accountConfig === void 0 ? void 0 : accountConfig.configWrites) !==
      null && _a !== void 0
      ? _a
      : channelConfig.configWrites;
  return value !== false;
}
