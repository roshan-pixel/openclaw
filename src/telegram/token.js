"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTelegramToken = resolveTelegramToken;
var node_fs_1 = require("node:fs");
var session_key_js_1 = require("../routing/session-key.js");
function resolveTelegramToken(cfg, opts) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
  if (opts === void 0) {
    opts = {};
  }
  var accountId = (0, session_key_js_1.normalizeAccountId)(opts.accountId);
  var telegramCfg =
    (_a = cfg === null || cfg === void 0 ? void 0 : cfg.channels) === null || _a === void 0
      ? void 0
      : _a.telegram;
  var accountCfg =
    accountId !== session_key_js_1.DEFAULT_ACCOUNT_ID
      ? (_b = telegramCfg === null || telegramCfg === void 0 ? void 0 : telegramCfg.accounts) ===
          null || _b === void 0
        ? void 0
        : _b[accountId]
      : (_c = telegramCfg === null || telegramCfg === void 0 ? void 0 : telegramCfg.accounts) ===
            null || _c === void 0
        ? void 0
        : _c[session_key_js_1.DEFAULT_ACCOUNT_ID];
  var accountTokenFile =
    (_d = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.tokenFile) === null ||
    _d === void 0
      ? void 0
      : _d.trim();
  if (accountTokenFile) {
    if (!node_fs_1.default.existsSync(accountTokenFile)) {
      (_e = opts.logMissingFile) === null || _e === void 0
        ? void 0
        : _e.call(
            opts,
            "channels.telegram.accounts."
              .concat(accountId, ".tokenFile not found: ")
              .concat(accountTokenFile),
          );
      return { token: "", source: "none" };
    }
    try {
      var token = node_fs_1.default.readFileSync(accountTokenFile, "utf-8").trim();
      if (token) {
        return { token: token, source: "tokenFile" };
      }
    } catch (err) {
      (_f = opts.logMissingFile) === null || _f === void 0
        ? void 0
        : _f.call(
            opts,
            "channels.telegram.accounts."
              .concat(accountId, ".tokenFile read failed: ")
              .concat(String(err)),
          );
      return { token: "", source: "none" };
    }
    return { token: "", source: "none" };
  }
  var accountToken =
    (_g = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.botToken) === null ||
    _g === void 0
      ? void 0
      : _g.trim();
  if (accountToken) {
    return { token: accountToken, source: "config" };
  }
  var allowEnv = accountId === session_key_js_1.DEFAULT_ACCOUNT_ID;
  var tokenFile =
    (_h = telegramCfg === null || telegramCfg === void 0 ? void 0 : telegramCfg.tokenFile) ===
      null || _h === void 0
      ? void 0
      : _h.trim();
  if (tokenFile && allowEnv) {
    if (!node_fs_1.default.existsSync(tokenFile)) {
      (_j = opts.logMissingFile) === null || _j === void 0
        ? void 0
        : _j.call(opts, "channels.telegram.tokenFile not found: ".concat(tokenFile));
      return { token: "", source: "none" };
    }
    try {
      var token = node_fs_1.default.readFileSync(tokenFile, "utf-8").trim();
      if (token) {
        return { token: token, source: "tokenFile" };
      }
    } catch (err) {
      (_k = opts.logMissingFile) === null || _k === void 0
        ? void 0
        : _k.call(opts, "channels.telegram.tokenFile read failed: ".concat(String(err)));
      return { token: "", source: "none" };
    }
  }
  var configToken =
    (_l = telegramCfg === null || telegramCfg === void 0 ? void 0 : telegramCfg.botToken) ===
      null || _l === void 0
      ? void 0
      : _l.trim();
  if (configToken && allowEnv) {
    return { token: configToken, source: "config" };
  }
  var envToken = allowEnv
    ? (_o =
        (_m = opts.envToken) !== null && _m !== void 0 ? _m : process.env.TELEGRAM_BOT_TOKEN) ===
        null || _o === void 0
      ? void 0
      : _o.trim()
    : "";
  if (envToken) {
    return { token: envToken, source: "env" };
  }
  return { token: "", source: "none" };
}
