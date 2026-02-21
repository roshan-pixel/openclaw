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
exports.listSignalAccountIds = listSignalAccountIds;
exports.resolveDefaultSignalAccountId = resolveDefaultSignalAccountId;
exports.resolveSignalAccount = resolveSignalAccount;
exports.listEnabledSignalAccounts = listEnabledSignalAccounts;
var session_key_js_1 = require("../routing/session-key.js");
function listConfiguredAccountIds(cfg) {
  var _a, _b;
  var accounts =
    (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.signal) === null ||
    _b === void 0
      ? void 0
      : _b.accounts;
  if (!accounts || typeof accounts !== "object") {
    return [];
  }
  return Object.keys(accounts).filter(Boolean);
}
function listSignalAccountIds(cfg) {
  var ids = listConfiguredAccountIds(cfg);
  if (ids.length === 0) {
    return [session_key_js_1.DEFAULT_ACCOUNT_ID];
  }
  return ids.toSorted(function (a, b) {
    return a.localeCompare(b);
  });
}
function resolveDefaultSignalAccountId(cfg) {
  var _a;
  var ids = listSignalAccountIds(cfg);
  if (ids.includes(session_key_js_1.DEFAULT_ACCOUNT_ID)) {
    return session_key_js_1.DEFAULT_ACCOUNT_ID;
  }
  return (_a = ids[0]) !== null && _a !== void 0 ? _a : session_key_js_1.DEFAULT_ACCOUNT_ID;
}
function resolveAccountConfig(cfg, accountId) {
  var _a, _b;
  var accounts =
    (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.signal) === null ||
    _b === void 0
      ? void 0
      : _b.accounts;
  if (!accounts || typeof accounts !== "object") {
    return undefined;
  }
  return accounts[accountId];
}
function mergeSignalAccountConfig(cfg, accountId) {
  var _a, _b, _c;
  var _d =
      (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.signal) !== null &&
      _b !== void 0
        ? _b
        : {},
    _ignored = _d.accounts,
    base = __rest(_d, ["accounts"]);
  var account = (_c = resolveAccountConfig(cfg, accountId)) !== null && _c !== void 0 ? _c : {};
  return __assign(__assign({}, base), account);
}
function resolveSignalAccount(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
  var accountId = (0, session_key_js_1.normalizeAccountId)(params.accountId);
  var baseEnabled =
    ((_b = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.signal) === null ||
    _b === void 0
      ? void 0
      : _b.enabled) !== false;
  var merged = mergeSignalAccountConfig(params.cfg, accountId);
  var accountEnabled = merged.enabled !== false;
  var enabled = baseEnabled && accountEnabled;
  var host = ((_c = merged.httpHost) === null || _c === void 0 ? void 0 : _c.trim()) || "127.0.0.1";
  var port = (_d = merged.httpPort) !== null && _d !== void 0 ? _d : 8080;
  var baseUrl =
    ((_e = merged.httpUrl) === null || _e === void 0 ? void 0 : _e.trim()) ||
    "http://".concat(host, ":").concat(port);
  var configured = Boolean(
    ((_f = merged.account) === null || _f === void 0 ? void 0 : _f.trim()) ||
    ((_g = merged.httpUrl) === null || _g === void 0 ? void 0 : _g.trim()) ||
    ((_h = merged.cliPath) === null || _h === void 0 ? void 0 : _h.trim()) ||
    ((_j = merged.httpHost) === null || _j === void 0 ? void 0 : _j.trim()) ||
    typeof merged.httpPort === "number" ||
    typeof merged.autoStart === "boolean",
  );
  return {
    accountId: accountId,
    enabled: enabled,
    name: ((_k = merged.name) === null || _k === void 0 ? void 0 : _k.trim()) || undefined,
    baseUrl: baseUrl,
    configured: configured,
    config: merged,
  };
}
function listEnabledSignalAccounts(cfg) {
  return listSignalAccountIds(cfg)
    .map(function (accountId) {
      return resolveSignalAccount({ cfg: cfg, accountId: accountId });
    })
    .filter(function (account) {
      return account.enabled;
    });
}
