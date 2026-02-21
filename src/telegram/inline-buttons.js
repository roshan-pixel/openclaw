"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTelegramInlineButtonsScope = resolveTelegramInlineButtonsScope;
exports.isTelegramInlineButtonsEnabled = isTelegramInlineButtonsEnabled;
exports.resolveTelegramTargetChatType = resolveTelegramTargetChatType;
var accounts_js_1 = require("./accounts.js");
var targets_js_1 = require("./targets.js");
var DEFAULT_INLINE_BUTTONS_SCOPE = "allowlist";
function normalizeInlineButtonsScope(value) {
  if (typeof value !== "string") {
    return undefined;
  }
  var trimmed = value.trim().toLowerCase();
  if (
    trimmed === "off" ||
    trimmed === "dm" ||
    trimmed === "group" ||
    trimmed === "all" ||
    trimmed === "allowlist"
  ) {
    return trimmed;
  }
  return undefined;
}
function resolveInlineButtonsScopeFromCapabilities(capabilities) {
  var _a;
  if (!capabilities) {
    return DEFAULT_INLINE_BUTTONS_SCOPE;
  }
  if (Array.isArray(capabilities)) {
    var enabled = capabilities.some(function (entry) {
      return String(entry).trim().toLowerCase() === "inlinebuttons";
    });
    return enabled ? "all" : "off";
  }
  if (typeof capabilities === "object") {
    var inlineButtons = capabilities.inlineButtons;
    return (_a = normalizeInlineButtonsScope(inlineButtons)) !== null && _a !== void 0
      ? _a
      : DEFAULT_INLINE_BUTTONS_SCOPE;
  }
  return DEFAULT_INLINE_BUTTONS_SCOPE;
}
function resolveTelegramInlineButtonsScope(params) {
  var account = (0, accounts_js_1.resolveTelegramAccount)({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  return resolveInlineButtonsScopeFromCapabilities(account.config.capabilities);
}
function isTelegramInlineButtonsEnabled(params) {
  if (params.accountId) {
    return resolveTelegramInlineButtonsScope(params) !== "off";
  }
  var accountIds = (0, accounts_js_1.listTelegramAccountIds)(params.cfg);
  if (accountIds.length === 0) {
    return resolveTelegramInlineButtonsScope(params) !== "off";
  }
  return accountIds.some(function (accountId) {
    return resolveTelegramInlineButtonsScope({ cfg: params.cfg, accountId: accountId }) !== "off";
  });
}
function resolveTelegramTargetChatType(target) {
  if (!target.trim()) {
    return "unknown";
  }
  var parsed = (0, targets_js_1.parseTelegramTarget)(target);
  var chatId = parsed.chatId.trim();
  if (!chatId) {
    return "unknown";
  }
  if (/^-?\d+$/.test(chatId)) {
    return chatId.startsWith("-") ? "group" : "direct";
  }
  return "unknown";
}
