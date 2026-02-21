"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDiscordToken = normalizeDiscordToken;
exports.resolveDiscordToken = resolveDiscordToken;
var session_key_js_1 = require("../routing/session-key.js");
function normalizeDiscordToken(raw) {
  if (!raw) {
    return undefined;
  }
  var trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }
  return trimmed.replace(/^Bot\s+/i, "");
}
function resolveDiscordToken(cfg, opts) {
  var _a, _b, _c, _d, _e, _f;
  if (opts === void 0) {
    opts = {};
  }
  var accountId = (0, session_key_js_1.normalizeAccountId)(opts.accountId);
  var discordCfg =
    (_a = cfg === null || cfg === void 0 ? void 0 : cfg.channels) === null || _a === void 0
      ? void 0
      : _a.discord;
  var accountCfg =
    accountId !== session_key_js_1.DEFAULT_ACCOUNT_ID
      ? (_b = discordCfg === null || discordCfg === void 0 ? void 0 : discordCfg.accounts) ===
          null || _b === void 0
        ? void 0
        : _b[accountId]
      : (_c = discordCfg === null || discordCfg === void 0 ? void 0 : discordCfg.accounts) ===
            null || _c === void 0
        ? void 0
        : _c[session_key_js_1.DEFAULT_ACCOUNT_ID];
  var accountToken = normalizeDiscordToken(
    (_d = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.token) !== null &&
      _d !== void 0
      ? _d
      : undefined,
  );
  if (accountToken) {
    return { token: accountToken, source: "config" };
  }
  var allowEnv = accountId === session_key_js_1.DEFAULT_ACCOUNT_ID;
  var configToken = allowEnv
    ? normalizeDiscordToken(
        (_e = discordCfg === null || discordCfg === void 0 ? void 0 : discordCfg.token) !== null &&
          _e !== void 0
          ? _e
          : undefined,
      )
    : undefined;
  if (configToken) {
    return { token: configToken, source: "config" };
  }
  var envToken = allowEnv
    ? normalizeDiscordToken(
        (_f = opts.envToken) !== null && _f !== void 0 ? _f : process.env.DISCORD_BOT_TOKEN,
      )
    : undefined;
  if (envToken) {
    return { token: envToken, source: "env" };
  }
  return { token: "", source: "none" };
}
