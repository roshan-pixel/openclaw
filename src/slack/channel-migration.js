"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateSlackChannelsInPlace = migrateSlackChannelsInPlace;
exports.migrateSlackChannelConfig = migrateSlackChannelConfig;
var session_key_js_1 = require("../routing/session-key.js");
function resolveAccountChannels(cfg, accountId) {
  var _a, _b, _c;
  if (!accountId) {
    return {};
  }
  var normalized = (0, session_key_js_1.normalizeAccountId)(accountId);
  var accounts =
    (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.slack) === null ||
    _b === void 0
      ? void 0
      : _b.accounts;
  if (!accounts || typeof accounts !== "object") {
    return {};
  }
  var exact = accounts[normalized];
  if (exact === null || exact === void 0 ? void 0 : exact.channels) {
    return { channels: exact.channels };
  }
  var matchKey = Object.keys(accounts).find(function (key) {
    return key.toLowerCase() === normalized.toLowerCase();
  });
  return {
    channels: matchKey
      ? (_c = accounts[matchKey]) === null || _c === void 0
        ? void 0
        : _c.channels
      : undefined,
  };
}
function migrateSlackChannelsInPlace(channels, oldChannelId, newChannelId) {
  if (!channels) {
    return { migrated: false, skippedExisting: false };
  }
  if (oldChannelId === newChannelId) {
    return { migrated: false, skippedExisting: false };
  }
  if (!Object.hasOwn(channels, oldChannelId)) {
    return { migrated: false, skippedExisting: false };
  }
  if (Object.hasOwn(channels, newChannelId)) {
    return { migrated: false, skippedExisting: true };
  }
  channels[newChannelId] = channels[oldChannelId];
  delete channels[oldChannelId];
  return { migrated: true, skippedExisting: false };
}
function migrateSlackChannelConfig(params) {
  var _a, _b;
  var scopes = [];
  var migrated = false;
  var skippedExisting = false;
  var accountChannels = resolveAccountChannels(params.cfg, params.accountId).channels;
  if (accountChannels) {
    var result = migrateSlackChannelsInPlace(
      accountChannels,
      params.oldChannelId,
      params.newChannelId,
    );
    if (result.migrated) {
      migrated = true;
      scopes.push("account");
    }
    if (result.skippedExisting) {
      skippedExisting = true;
    }
  }
  var globalChannels =
    (_b = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.slack) === null ||
    _b === void 0
      ? void 0
      : _b.channels;
  if (globalChannels) {
    var result = migrateSlackChannelsInPlace(
      globalChannels,
      params.oldChannelId,
      params.newChannelId,
    );
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
