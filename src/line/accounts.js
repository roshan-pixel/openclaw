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
exports.DEFAULT_ACCOUNT_ID = void 0;
exports.resolveLineAccount = resolveLineAccount;
exports.listLineAccountIds = listLineAccountIds;
exports.resolveDefaultLineAccountId = resolveDefaultLineAccountId;
exports.normalizeAccountId = normalizeAccountId;
var node_fs_1 = require("node:fs");
exports.DEFAULT_ACCOUNT_ID = "default";
function readFileIfExists(filePath) {
  if (!filePath) {
    return undefined;
  }
  try {
    return node_fs_1.default.readFileSync(filePath, "utf-8").trim();
  } catch (_a) {
    return undefined;
  }
}
function resolveToken(params) {
  var _a, _b, _c;
  var accountId = params.accountId,
    baseConfig = params.baseConfig,
    accountConfig = params.accountConfig;
  // Check account-level config first
  if (
    (_a =
      accountConfig === null || accountConfig === void 0
        ? void 0
        : accountConfig.channelAccessToken) === null || _a === void 0
      ? void 0
      : _a.trim()
  ) {
    return { token: accountConfig.channelAccessToken.trim(), tokenSource: "config" };
  }
  // Check account-level token file
  var accountFileToken = readFileIfExists(
    accountConfig === null || accountConfig === void 0 ? void 0 : accountConfig.tokenFile,
  );
  if (accountFileToken) {
    return { token: accountFileToken, tokenSource: "file" };
  }
  // For default account, check base config and env
  if (accountId === exports.DEFAULT_ACCOUNT_ID) {
    if (
      (_b =
        baseConfig === null || baseConfig === void 0 ? void 0 : baseConfig.channelAccessToken) ===
        null || _b === void 0
        ? void 0
        : _b.trim()
    ) {
      return { token: baseConfig.channelAccessToken.trim(), tokenSource: "config" };
    }
    var baseFileToken = readFileIfExists(
      baseConfig === null || baseConfig === void 0 ? void 0 : baseConfig.tokenFile,
    );
    if (baseFileToken) {
      return { token: baseFileToken, tokenSource: "file" };
    }
    var envToken =
      (_c = process.env.LINE_CHANNEL_ACCESS_TOKEN) === null || _c === void 0 ? void 0 : _c.trim();
    if (envToken) {
      return { token: envToken, tokenSource: "env" };
    }
  }
  return { token: "", tokenSource: "none" };
}
function resolveSecret(params) {
  var _a, _b, _c;
  var accountId = params.accountId,
    baseConfig = params.baseConfig,
    accountConfig = params.accountConfig;
  // Check account-level config first
  if (
    (_a =
      accountConfig === null || accountConfig === void 0 ? void 0 : accountConfig.channelSecret) ===
      null || _a === void 0
      ? void 0
      : _a.trim()
  ) {
    return accountConfig.channelSecret.trim();
  }
  // Check account-level secret file
  var accountFileSecret = readFileIfExists(
    accountConfig === null || accountConfig === void 0 ? void 0 : accountConfig.secretFile,
  );
  if (accountFileSecret) {
    return accountFileSecret;
  }
  // For default account, check base config and env
  if (accountId === exports.DEFAULT_ACCOUNT_ID) {
    if (
      (_b = baseConfig === null || baseConfig === void 0 ? void 0 : baseConfig.channelSecret) ===
        null || _b === void 0
        ? void 0
        : _b.trim()
    ) {
      return baseConfig.channelSecret.trim();
    }
    var baseFileSecret = readFileIfExists(
      baseConfig === null || baseConfig === void 0 ? void 0 : baseConfig.secretFile,
    );
    if (baseFileSecret) {
      return baseFileSecret;
    }
    var envSecret =
      (_c = process.env.LINE_CHANNEL_SECRET) === null || _c === void 0 ? void 0 : _c.trim();
    if (envSecret) {
      return envSecret;
    }
  }
  return "";
}
function resolveLineAccount(params) {
  var _a, _b, _c, _d;
  var cfg = params.cfg,
    _e = params.accountId,
    accountId = _e === void 0 ? exports.DEFAULT_ACCOUNT_ID : _e;
  var lineConfig = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.line;
  var accounts = lineConfig === null || lineConfig === void 0 ? void 0 : lineConfig.accounts;
  var accountConfig =
    accountId !== exports.DEFAULT_ACCOUNT_ID
      ? accounts === null || accounts === void 0
        ? void 0
        : accounts[accountId]
      : undefined;
  var _f = resolveToken({
      accountId: accountId,
      baseConfig: lineConfig,
      accountConfig: accountConfig,
    }),
    token = _f.token,
    tokenSource = _f.tokenSource;
  var secret = resolveSecret({
    accountId: accountId,
    baseConfig: lineConfig,
    accountConfig: accountConfig,
  });
  var mergedConfig = __assign(__assign({}, lineConfig), accountConfig);
  var enabled =
    (_b = accountConfig === null || accountConfig === void 0 ? void 0 : accountConfig.enabled) !==
      null && _b !== void 0
      ? _b
      : accountId === exports.DEFAULT_ACCOUNT_ID
        ? (_c = lineConfig === null || lineConfig === void 0 ? void 0 : lineConfig.enabled) !==
            null && _c !== void 0
          ? _c
          : true
        : false;
  var name =
    (_d = accountConfig === null || accountConfig === void 0 ? void 0 : accountConfig.name) !==
      null && _d !== void 0
      ? _d
      : accountId === exports.DEFAULT_ACCOUNT_ID
        ? lineConfig === null || lineConfig === void 0
          ? void 0
          : lineConfig.name
        : undefined;
  return {
    accountId: accountId,
    name: name,
    enabled: enabled,
    channelAccessToken: token,
    channelSecret: secret,
    tokenSource: tokenSource,
    config: mergedConfig,
  };
}
function listLineAccountIds(cfg) {
  var _a, _b, _c;
  var lineConfig = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.line;
  var accounts = lineConfig === null || lineConfig === void 0 ? void 0 : lineConfig.accounts;
  var ids = new Set();
  // Add default account if configured at base level
  if (
    ((_b =
      lineConfig === null || lineConfig === void 0 ? void 0 : lineConfig.channelAccessToken) ===
      null || _b === void 0
      ? void 0
      : _b.trim()) ||
    (lineConfig === null || lineConfig === void 0 ? void 0 : lineConfig.tokenFile) ||
    ((_c = process.env.LINE_CHANNEL_ACCESS_TOKEN) === null || _c === void 0 ? void 0 : _c.trim())
  ) {
    ids.add(exports.DEFAULT_ACCOUNT_ID);
  }
  // Add named accounts
  if (accounts) {
    for (var _i = 0, _d = Object.keys(accounts); _i < _d.length; _i++) {
      var id = _d[_i];
      ids.add(id);
    }
  }
  return Array.from(ids);
}
function resolveDefaultLineAccountId(cfg) {
  var _a;
  var ids = listLineAccountIds(cfg);
  if (ids.includes(exports.DEFAULT_ACCOUNT_ID)) {
    return exports.DEFAULT_ACCOUNT_ID;
  }
  return (_a = ids[0]) !== null && _a !== void 0 ? _a : exports.DEFAULT_ACCOUNT_ID;
}
function normalizeAccountId(accountId) {
  var trimmed =
    accountId === null || accountId === void 0 ? void 0 : accountId.trim().toLowerCase();
  if (!trimmed || trimmed === "default") {
    return exports.DEFAULT_ACCOUNT_ID;
  }
  return trimmed;
}
