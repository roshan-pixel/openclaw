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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }
    if (s != null && typeof Object.getOwnPropertySymbols === "function") {
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    }
    return t;
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSlackAccountIds = listSlackAccountIds;
exports.resolveDefaultSlackAccountId = resolveDefaultSlackAccountId;
exports.resolveSlackAccount = resolveSlackAccount;
exports.listEnabledSlackAccounts = listEnabledSlackAccounts;
exports.resolveSlackReplyToMode = resolveSlackReplyToMode;
var chat_type_js_1 = require("../channels/chat-type.js");
var session_key_js_1 = require("../routing/session-key.js");
var token_js_1 = require("./token.js");
function listConfiguredAccountIds(cfg) {
  var _a, _b;
  var accounts =
    (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.slack) === null ||
    _b === void 0
      ? void 0
      : _b.accounts;
  if (!accounts || typeof accounts !== "object") {
    return [];
  }
  return Object.keys(accounts).filter(Boolean);
}
function listSlackAccountIds(cfg) {
  var ids = listConfiguredAccountIds(cfg);
  if (ids.length === 0) {
    return [session_key_js_1.DEFAULT_ACCOUNT_ID];
  }
  return ids.toSorted(function (a, b) {
    return a.localeCompare(b);
  });
}
function resolveDefaultSlackAccountId(cfg) {
  var _a;
  var ids = listSlackAccountIds(cfg);
  if (ids.includes(session_key_js_1.DEFAULT_ACCOUNT_ID)) {
    return session_key_js_1.DEFAULT_ACCOUNT_ID;
  }
  return (_a = ids[0]) !== null && _a !== void 0 ? _a : session_key_js_1.DEFAULT_ACCOUNT_ID;
}
function resolveAccountConfig(cfg, accountId) {
  var _a, _b;
  var accounts =
    (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.slack) === null ||
    _b === void 0
      ? void 0
      : _b.accounts;
  if (!accounts || typeof accounts !== "object") {
    return undefined;
  }
  return accounts[accountId];
}
function mergeSlackAccountConfig(cfg, accountId) {
  var _a, _b, _c;
  var _d =
      (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.slack) !== null &&
      _b !== void 0
        ? _b
        : {},
    _ignored = _d.accounts,
    base = __rest(_d, ["accounts"]);
  var account = (_c = resolveAccountConfig(cfg, accountId)) !== null && _c !== void 0 ? _c : {};
  return __assign(__assign({}, base), account);
}
function resolveSlackAccount(params) {
  var _a, _b, _c;
  var accountId = (0, session_key_js_1.normalizeAccountId)(params.accountId);
  var baseEnabled =
    ((_b = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.slack) === null ||
    _b === void 0
      ? void 0
      : _b.enabled) !== false;
  var merged = mergeSlackAccountConfig(params.cfg, accountId);
  var accountEnabled = merged.enabled !== false;
  var enabled = baseEnabled && accountEnabled;
  var allowEnv = accountId === session_key_js_1.DEFAULT_ACCOUNT_ID;
  var envBot = allowEnv
    ? (0, token_js_1.resolveSlackBotToken)(process.env.SLACK_BOT_TOKEN)
    : undefined;
  var envApp = allowEnv
    ? (0, token_js_1.resolveSlackAppToken)(process.env.SLACK_APP_TOKEN)
    : undefined;
  var configBot = (0, token_js_1.resolveSlackBotToken)(merged.botToken);
  var configApp = (0, token_js_1.resolveSlackAppToken)(merged.appToken);
  var botToken = configBot !== null && configBot !== void 0 ? configBot : envBot;
  var appToken = configApp !== null && configApp !== void 0 ? configApp : envApp;
  var botTokenSource = configBot ? "config" : envBot ? "env" : "none";
  var appTokenSource = configApp ? "config" : envApp ? "env" : "none";
  return {
    accountId: accountId,
    enabled: enabled,
    name: ((_c = merged.name) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
    botToken: botToken,
    appToken: appToken,
    botTokenSource: botTokenSource,
    appTokenSource: appTokenSource,
    config: merged,
    groupPolicy: merged.groupPolicy,
    textChunkLimit: merged.textChunkLimit,
    mediaMaxMb: merged.mediaMaxMb,
    reactionNotifications: merged.reactionNotifications,
    reactionAllowlist: merged.reactionAllowlist,
    replyToMode: merged.replyToMode,
    replyToModeByChatType: merged.replyToModeByChatType,
    actions: merged.actions,
    slashCommand: merged.slashCommand,
    dm: merged.dm,
    channels: merged.channels,
  };
}
function listEnabledSlackAccounts(cfg) {
  return listSlackAccountIds(cfg)
    .map(function (accountId) {
      return resolveSlackAccount({ cfg: cfg, accountId: accountId });
    })
    .filter(function (account) {
      return account.enabled;
    });
}
function resolveSlackReplyToMode(account, chatType) {
  var _a, _b, _c, _d;
  var normalized = (0, chat_type_js_1.normalizeChatType)(
    chatType !== null && chatType !== void 0 ? chatType : undefined,
  );
  if (
    normalized &&
    ((_a = account.replyToModeByChatType) === null || _a === void 0 ? void 0 : _a[normalized]) !==
      undefined
  ) {
    return (_b = account.replyToModeByChatType[normalized]) !== null && _b !== void 0 ? _b : "off";
  }
  if (
    normalized === "direct" &&
    ((_c = account.dm) === null || _c === void 0 ? void 0 : _c.replyToMode) !== undefined
  ) {
    return account.dm.replyToMode;
  }
  return (_d = account.replyToMode) !== null && _d !== void 0 ? _d : "off";
}
