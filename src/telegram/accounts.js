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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTelegramAccountIds = listTelegramAccountIds;
exports.resolveDefaultTelegramAccountId = resolveDefaultTelegramAccountId;
exports.resolveTelegramAccount = resolveTelegramAccount;
exports.listEnabledTelegramAccounts = listEnabledTelegramAccounts;
var env_js_1 = require("../infra/env.js");
var bindings_js_1 = require("../routing/bindings.js");
var session_key_js_1 = require("../routing/session-key.js");
var token_js_1 = require("./token.js");
var debugAccounts = function () {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  if ((0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_DEBUG_TELEGRAM_ACCOUNTS)) {
    console.warn.apply(console, __spreadArray(["[telegram:accounts]"], args, false));
  }
};
function listConfiguredAccountIds(cfg) {
  var _a, _b;
  var accounts =
    (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.telegram) === null ||
    _b === void 0
      ? void 0
      : _b.accounts;
  if (!accounts || typeof accounts !== "object") {
    return [];
  }
  var ids = new Set();
  for (var _i = 0, _c = Object.keys(accounts); _i < _c.length; _i++) {
    var key = _c[_i];
    if (!key) {
      continue;
    }
    ids.add((0, session_key_js_1.normalizeAccountId)(key));
  }
  return __spreadArray([], ids, true);
}
function listTelegramAccountIds(cfg) {
  var ids = Array.from(
    new Set(
      __spreadArray(
        __spreadArray([], listConfiguredAccountIds(cfg), true),
        (0, bindings_js_1.listBoundAccountIds)(cfg, "telegram"),
        true,
      ),
    ),
  );
  debugAccounts("listTelegramAccountIds", ids);
  if (ids.length === 0) {
    return [session_key_js_1.DEFAULT_ACCOUNT_ID];
  }
  return ids.toSorted(function (a, b) {
    return a.localeCompare(b);
  });
}
function resolveDefaultTelegramAccountId(cfg) {
  var _a;
  var boundDefault = (0, bindings_js_1.resolveDefaultAgentBoundAccountId)(cfg, "telegram");
  if (boundDefault) {
    return boundDefault;
  }
  var ids = listTelegramAccountIds(cfg);
  if (ids.includes(session_key_js_1.DEFAULT_ACCOUNT_ID)) {
    return session_key_js_1.DEFAULT_ACCOUNT_ID;
  }
  return (_a = ids[0]) !== null && _a !== void 0 ? _a : session_key_js_1.DEFAULT_ACCOUNT_ID;
}
function resolveAccountConfig(cfg, accountId) {
  var _a, _b;
  var accounts =
    (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.telegram) === null ||
    _b === void 0
      ? void 0
      : _b.accounts;
  if (!accounts || typeof accounts !== "object") {
    return undefined;
  }
  var direct = accounts[accountId];
  if (direct) {
    return direct;
  }
  var normalized = (0, session_key_js_1.normalizeAccountId)(accountId);
  var matchKey = Object.keys(accounts).find(function (key) {
    return (0, session_key_js_1.normalizeAccountId)(key) === normalized;
  });
  return matchKey ? accounts[matchKey] : undefined;
}
function mergeTelegramAccountConfig(cfg, accountId) {
  var _a, _b, _c;
  var _d =
      (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.telegram) !== null &&
      _b !== void 0
        ? _b
        : {},
    _ignored = _d.accounts,
    base = __rest(_d, ["accounts"]);
  var account = (_c = resolveAccountConfig(cfg, accountId)) !== null && _c !== void 0 ? _c : {};
  return __assign(__assign({}, base), account);
}
function resolveTelegramAccount(params) {
  var _a, _b, _c;
  var hasExplicitAccountId = Boolean(
    (_a = params.accountId) === null || _a === void 0 ? void 0 : _a.trim(),
  );
  var baseEnabled =
    ((_c = (_b = params.cfg.channels) === null || _b === void 0 ? void 0 : _b.telegram) === null ||
    _c === void 0
      ? void 0
      : _c.enabled) !== false;
  var resolve = function (accountId) {
    var _a;
    var merged = mergeTelegramAccountConfig(params.cfg, accountId);
    var accountEnabled = merged.enabled !== false;
    var enabled = baseEnabled && accountEnabled;
    var tokenResolution = (0, token_js_1.resolveTelegramToken)(params.cfg, {
      accountId: accountId,
    });
    debugAccounts("resolve", {
      accountId: accountId,
      enabled: enabled,
      tokenSource: tokenResolution.source,
    });
    return {
      accountId: accountId,
      enabled: enabled,
      name: ((_a = merged.name) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
      token: tokenResolution.token,
      tokenSource: tokenResolution.source,
      config: merged,
    };
  };
  var normalized = (0, session_key_js_1.normalizeAccountId)(params.accountId);
  var primary = resolve(normalized);
  if (hasExplicitAccountId) {
    return primary;
  }
  if (primary.tokenSource !== "none") {
    return primary;
  }
  // If accountId is omitted, prefer a configured account token over failing on
  // the implicit "default" account. This keeps env-based setups working while
  // making config-only tokens work for things like heartbeats.
  var fallbackId = resolveDefaultTelegramAccountId(params.cfg);
  if (fallbackId === primary.accountId) {
    return primary;
  }
  var fallback = resolve(fallbackId);
  if (fallback.tokenSource === "none") {
    return primary;
  }
  return fallback;
}
function listEnabledTelegramAccounts(cfg) {
  return listTelegramAccountIds(cfg)
    .map(function (accountId) {
      return resolveTelegramAccount({ cfg: cfg, accountId: accountId });
    })
    .filter(function (account) {
      return account.enabled;
    });
}
