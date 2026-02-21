"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listWhatsAppAuthDirs = listWhatsAppAuthDirs;
exports.hasAnyWhatsAppAuth = hasAnyWhatsAppAuth;
exports.listWhatsAppAccountIds = listWhatsAppAccountIds;
exports.resolveDefaultWhatsAppAccountId = resolveDefaultWhatsAppAccountId;
exports.resolveWhatsAppAuthDir = resolveWhatsAppAuthDir;
exports.resolveWhatsAppAccount = resolveWhatsAppAccount;
exports.listEnabledWhatsAppAccounts = listEnabledWhatsAppAccounts;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var paths_js_1 = require("../config/paths.js");
var session_key_js_1 = require("../routing/session-key.js");
var utils_js_1 = require("../utils.js");
var auth_store_js_1 = require("./auth-store.js");
function listConfiguredAccountIds(cfg) {
  var _a, _b;
  var accounts =
    (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.whatsapp) === null ||
    _b === void 0
      ? void 0
      : _b.accounts;
  if (!accounts || typeof accounts !== "object") {
    return [];
  }
  return Object.keys(accounts).filter(Boolean);
}
function listWhatsAppAuthDirs(cfg) {
  var oauthDir = (0, paths_js_1.resolveOAuthDir)();
  var whatsappDir = node_path_1.default.join(oauthDir, "whatsapp");
  var authDirs = new Set([
    oauthDir,
    node_path_1.default.join(whatsappDir, session_key_js_1.DEFAULT_ACCOUNT_ID),
  ]);
  var accountIds = listConfiguredAccountIds(cfg);
  for (var _i = 0, accountIds_1 = accountIds; _i < accountIds_1.length; _i++) {
    var accountId = accountIds_1[_i];
    authDirs.add(resolveWhatsAppAuthDir({ cfg: cfg, accountId: accountId }).authDir);
  }
  try {
    var entries = node_fs_1.default.readdirSync(whatsappDir, { withFileTypes: true });
    for (var _a = 0, entries_1 = entries; _a < entries_1.length; _a++) {
      var entry = entries_1[_a];
      if (!entry.isDirectory()) {
        continue;
      }
      authDirs.add(node_path_1.default.join(whatsappDir, entry.name));
    }
  } catch (_b) {
    // ignore missing dirs
  }
  return Array.from(authDirs);
}
function hasAnyWhatsAppAuth(cfg) {
  return listWhatsAppAuthDirs(cfg).some(function (authDir) {
    return (0, auth_store_js_1.hasWebCredsSync)(authDir);
  });
}
function listWhatsAppAccountIds(cfg) {
  var ids = listConfiguredAccountIds(cfg);
  if (ids.length === 0) {
    return [session_key_js_1.DEFAULT_ACCOUNT_ID];
  }
  return ids.toSorted(function (a, b) {
    return a.localeCompare(b);
  });
}
function resolveDefaultWhatsAppAccountId(cfg) {
  var _a;
  var ids = listWhatsAppAccountIds(cfg);
  if (ids.includes(session_key_js_1.DEFAULT_ACCOUNT_ID)) {
    return session_key_js_1.DEFAULT_ACCOUNT_ID;
  }
  return (_a = ids[0]) !== null && _a !== void 0 ? _a : session_key_js_1.DEFAULT_ACCOUNT_ID;
}
function resolveAccountConfig(cfg, accountId) {
  var _a, _b;
  var accounts =
    (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.whatsapp) === null ||
    _b === void 0
      ? void 0
      : _b.accounts;
  if (!accounts || typeof accounts !== "object") {
    return undefined;
  }
  var entry = accounts[accountId];
  return entry;
}
function resolveDefaultAuthDir(accountId) {
  return node_path_1.default.join((0, paths_js_1.resolveOAuthDir)(), "whatsapp", accountId);
}
function resolveLegacyAuthDir() {
  // Legacy Baileys creds lived in the same directory as OAuth tokens.
  return (0, paths_js_1.resolveOAuthDir)();
}
function legacyAuthExists(authDir) {
  try {
    return node_fs_1.default.existsSync(node_path_1.default.join(authDir, "creds.json"));
  } catch (_a) {
    return false;
  }
}
function resolveWhatsAppAuthDir(params) {
  var _a;
  var accountId = params.accountId.trim() || session_key_js_1.DEFAULT_ACCOUNT_ID;
  var account = resolveAccountConfig(params.cfg, accountId);
  var configured =
    (_a = account === null || account === void 0 ? void 0 : account.authDir) === null ||
    _a === void 0
      ? void 0
      : _a.trim();
  if (configured) {
    return { authDir: (0, utils_js_1.resolveUserPath)(configured), isLegacy: false };
  }
  var defaultDir = resolveDefaultAuthDir(accountId);
  if (accountId === session_key_js_1.DEFAULT_ACCOUNT_ID) {
    var legacyDir = resolveLegacyAuthDir();
    if (legacyAuthExists(legacyDir) && !legacyAuthExists(defaultDir)) {
      return { authDir: legacyDir, isLegacy: true };
    }
  }
  return { authDir: defaultDir, isLegacy: false };
}
function resolveWhatsAppAccount(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
  var rootCfg = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.whatsapp;
  var accountId =
    ((_b = params.accountId) === null || _b === void 0 ? void 0 : _b.trim()) ||
    resolveDefaultWhatsAppAccountId(params.cfg);
  var accountCfg = resolveAccountConfig(params.cfg, accountId);
  var enabled =
    (accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.enabled) !== false;
  var _w = resolveWhatsAppAuthDir({
      cfg: params.cfg,
      accountId: accountId,
    }),
    authDir = _w.authDir,
    isLegacy = _w.isLegacy;
  return {
    accountId: accountId,
    name:
      ((_c = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.name) === null ||
      _c === void 0
        ? void 0
        : _c.trim()) || undefined,
    enabled: enabled,
    sendReadReceipts:
      (_e =
        (_d =
          accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.sendReadReceipts) !==
          null && _d !== void 0
          ? _d
          : rootCfg === null || rootCfg === void 0
            ? void 0
            : rootCfg.sendReadReceipts) !== null && _e !== void 0
        ? _e
        : true,
    messagePrefix:
      (_g =
        (_f = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.messagePrefix) !==
          null && _f !== void 0
          ? _f
          : rootCfg === null || rootCfg === void 0
            ? void 0
            : rootCfg.messagePrefix) !== null && _g !== void 0
        ? _g
        : (_h = params.cfg.messages) === null || _h === void 0
          ? void 0
          : _h.messagePrefix,
    authDir: authDir,
    isLegacyAuthDir: isLegacy,
    selfChatMode:
      (_j = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.selfChatMode) !==
        null && _j !== void 0
        ? _j
        : rootCfg === null || rootCfg === void 0
          ? void 0
          : rootCfg.selfChatMode,
    dmPolicy:
      (_k = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.dmPolicy) !== null &&
      _k !== void 0
        ? _k
        : rootCfg === null || rootCfg === void 0
          ? void 0
          : rootCfg.dmPolicy,
    allowFrom:
      (_l = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.allowFrom) !==
        null && _l !== void 0
        ? _l
        : rootCfg === null || rootCfg === void 0
          ? void 0
          : rootCfg.allowFrom,
    groupAllowFrom:
      (_m = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.groupAllowFrom) !==
        null && _m !== void 0
        ? _m
        : rootCfg === null || rootCfg === void 0
          ? void 0
          : rootCfg.groupAllowFrom,
    groupPolicy:
      (_o = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.groupPolicy) !==
        null && _o !== void 0
        ? _o
        : rootCfg === null || rootCfg === void 0
          ? void 0
          : rootCfg.groupPolicy,
    textChunkLimit:
      (_p = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.textChunkLimit) !==
        null && _p !== void 0
        ? _p
        : rootCfg === null || rootCfg === void 0
          ? void 0
          : rootCfg.textChunkLimit,
    chunkMode:
      (_q = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.chunkMode) !==
        null && _q !== void 0
        ? _q
        : rootCfg === null || rootCfg === void 0
          ? void 0
          : rootCfg.chunkMode,
    mediaMaxMb:
      (_r = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.mediaMaxMb) !==
        null && _r !== void 0
        ? _r
        : rootCfg === null || rootCfg === void 0
          ? void 0
          : rootCfg.mediaMaxMb,
    blockStreaming:
      (_s = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.blockStreaming) !==
        null && _s !== void 0
        ? _s
        : rootCfg === null || rootCfg === void 0
          ? void 0
          : rootCfg.blockStreaming,
    ackReaction:
      (_t = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.ackReaction) !==
        null && _t !== void 0
        ? _t
        : rootCfg === null || rootCfg === void 0
          ? void 0
          : rootCfg.ackReaction,
    groups:
      (_u = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.groups) !== null &&
      _u !== void 0
        ? _u
        : rootCfg === null || rootCfg === void 0
          ? void 0
          : rootCfg.groups,
    debounceMs:
      (_v = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.debounceMs) !==
        null && _v !== void 0
        ? _v
        : rootCfg === null || rootCfg === void 0
          ? void 0
          : rootCfg.debounceMs,
  };
}
function listEnabledWhatsAppAccounts(cfg) {
  return listWhatsAppAccountIds(cfg)
    .map(function (accountId) {
      return resolveWhatsAppAccount({ cfg: cfg, accountId: accountId });
    })
    .filter(function (account) {
      return account.enabled;
    });
}
