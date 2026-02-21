"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateTelegramGroupsInPlace = migrateTelegramGroupsInPlace;
exports.migrateTelegramGroupConfig = migrateTelegramGroupConfig;
var session_key_js_1 = require("../routing/session-key.js");
function resolveAccountGroups(cfg, accountId) {
  var _a, _b, _c;
  if (!accountId) {
    return {};
  }
  var normalized = (0, session_key_js_1.normalizeAccountId)(accountId);
  var accounts =
    (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.telegram) === null ||
    _b === void 0
      ? void 0
      : _b.accounts;
  if (!accounts || typeof accounts !== "object") {
    return {};
  }
  var exact = accounts[normalized];
  if (exact === null || exact === void 0 ? void 0 : exact.groups) {
    return { groups: exact.groups };
  }
  var matchKey = Object.keys(accounts).find(function (key) {
    return key.toLowerCase() === normalized.toLowerCase();
  });
  return {
    groups: matchKey
      ? (_c = accounts[matchKey]) === null || _c === void 0
        ? void 0
        : _c.groups
      : undefined,
  };
}
function migrateTelegramGroupsInPlace(groups, oldChatId, newChatId) {
  if (!groups) {
    return { migrated: false, skippedExisting: false };
  }
  if (oldChatId === newChatId) {
    return { migrated: false, skippedExisting: false };
  }
  if (!Object.hasOwn(groups, oldChatId)) {
    return { migrated: false, skippedExisting: false };
  }
  if (Object.hasOwn(groups, newChatId)) {
    return { migrated: false, skippedExisting: true };
  }
  groups[newChatId] = groups[oldChatId];
  delete groups[oldChatId];
  return { migrated: true, skippedExisting: false };
}
function migrateTelegramGroupConfig(params) {
  var _a, _b;
  var scopes = [];
  var migrated = false;
  var skippedExisting = false;
  var accountGroups = resolveAccountGroups(params.cfg, params.accountId).groups;
  if (accountGroups) {
    var result = migrateTelegramGroupsInPlace(accountGroups, params.oldChatId, params.newChatId);
    if (result.migrated) {
      migrated = true;
      scopes.push("account");
    }
    if (result.skippedExisting) {
      skippedExisting = true;
    }
  }
  var globalGroups =
    (_b = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.telegram) === null ||
    _b === void 0
      ? void 0
      : _b.groups;
  if (globalGroups) {
    var result = migrateTelegramGroupsInPlace(globalGroups, params.oldChatId, params.newChatId);
    if (result.migrated) {
      migrated = true;
      scopes.push("global");
    }
    if (result.skippedExisting) {
      skippedExisting = true;
    }
  }
  return { migrated: migrated, skippedExisting: skippedExisting, scopes: scopes };
}
