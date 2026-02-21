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
exports.listIMessageAccountIds = listIMessageAccountIds;
exports.resolveDefaultIMessageAccountId = resolveDefaultIMessageAccountId;
exports.resolveIMessageAccount = resolveIMessageAccount;
exports.listEnabledIMessageAccounts = listEnabledIMessageAccounts;
var session_key_js_1 = require("../routing/session-key.js");
function listConfiguredAccountIds(cfg) {
  var _a, _b;
  var accounts =
    (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.imessage) === null ||
    _b === void 0
      ? void 0
      : _b.accounts;
  if (!accounts || typeof accounts !== "object") {
    return [];
  }
  return Object.keys(accounts).filter(Boolean);
}
function listIMessageAccountIds(cfg) {
  var ids = listConfiguredAccountIds(cfg);
  if (ids.length === 0) {
    return [session_key_js_1.DEFAULT_ACCOUNT_ID];
  }
  return ids.toSorted(function (a, b) {
    return a.localeCompare(b);
  });
}
function resolveDefaultIMessageAccountId(cfg) {
  var _a;
  var ids = listIMessageAccountIds(cfg);
  if (ids.includes(session_key_js_1.DEFAULT_ACCOUNT_ID)) {
    return session_key_js_1.DEFAULT_ACCOUNT_ID;
  }
  return (_a = ids[0]) !== null && _a !== void 0 ? _a : session_key_js_1.DEFAULT_ACCOUNT_ID;
}
function resolveAccountConfig(cfg, accountId) {
  var _a, _b;
  var accounts =
    (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.imessage) === null ||
    _b === void 0
      ? void 0
      : _b.accounts;
  if (!accounts || typeof accounts !== "object") {
    return undefined;
  }
  return accounts[accountId];
}
function mergeIMessageAccountConfig(cfg, accountId) {
  var _a, _b, _c;
  var _d =
      (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.imessage) !== null &&
      _b !== void 0
        ? _b
        : {},
    _ignored = _d.accounts,
    base = __rest(_d, ["accounts"]);
  var account = (_c = resolveAccountConfig(cfg, accountId)) !== null && _c !== void 0 ? _c : {};
  return __assign(__assign({}, base), account);
}
function resolveIMessageAccount(params) {
  var _a, _b, _c, _d, _e, _f;
  var accountId = (0, session_key_js_1.normalizeAccountId)(params.accountId);
  var baseEnabled =
    ((_b = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.imessage) === null ||
    _b === void 0
      ? void 0
      : _b.enabled) !== false;
  var merged = mergeIMessageAccountConfig(params.cfg, accountId);
  var accountEnabled = merged.enabled !== false;
  var configured = Boolean(
    ((_c = merged.cliPath) === null || _c === void 0 ? void 0 : _c.trim()) ||
    ((_d = merged.dbPath) === null || _d === void 0 ? void 0 : _d.trim()) ||
    merged.service ||
    ((_e = merged.region) === null || _e === void 0 ? void 0 : _e.trim()) ||
    (merged.allowFrom && merged.allowFrom.length > 0) ||
    (merged.groupAllowFrom && merged.groupAllowFrom.length > 0) ||
    merged.dmPolicy ||
    merged.groupPolicy ||
    typeof merged.includeAttachments === "boolean" ||
    typeof merged.mediaMaxMb === "number" ||
    typeof merged.textChunkLimit === "number" ||
    (merged.groups && Object.keys(merged.groups).length > 0),
  );
  return {
    accountId: accountId,
    enabled: baseEnabled && accountEnabled,
    name: ((_f = merged.name) === null || _f === void 0 ? void 0 : _f.trim()) || undefined,
    config: merged,
    configured: configured,
  };
}
function listEnabledIMessageAccounts(cfg) {
  return listIMessageAccountIds(cfg)
    .map(function (accountId) {
      return resolveIMessageAccount({ cfg: cfg, accountId: accountId });
    })
    .filter(function (account) {
      return account.enabled;
    });
}
