"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMarkdownTableMode = resolveMarkdownTableMode;
var index_js_1 = require("../channels/plugins/index.js");
var session_key_js_1 = require("../routing/session-key.js");
var DEFAULT_TABLE_MODES = new Map([
  ["signal", "bullets"],
  ["whatsapp", "bullets"],
]);
var isMarkdownTableMode = function (value) {
  return value === "off" || value === "bullets" || value === "code";
};
function resolveMarkdownModeFromSection(section, accountId) {
  var _a, _b, _c;
  if (!section) {
    return undefined;
  }
  var normalizedAccountId = (0, session_key_js_1.normalizeAccountId)(accountId);
  var accounts = section.accounts;
  if (accounts && typeof accounts === "object") {
    var direct = accounts[normalizedAccountId];
    var directMode =
      (_a = direct === null || direct === void 0 ? void 0 : direct.markdown) === null ||
      _a === void 0
        ? void 0
        : _a.tables;
    if (isMarkdownTableMode(directMode)) {
      return directMode;
    }
    var matchKey = Object.keys(accounts).find(function (key) {
      return key.toLowerCase() === normalizedAccountId.toLowerCase();
    });
    var match = matchKey ? accounts[matchKey] : undefined;
    var matchMode =
      (_b = match === null || match === void 0 ? void 0 : match.markdown) === null || _b === void 0
        ? void 0
        : _b.tables;
    if (isMarkdownTableMode(matchMode)) {
      return matchMode;
    }
  }
  var sectionMode = (_c = section.markdown) === null || _c === void 0 ? void 0 : _c.tables;
  return isMarkdownTableMode(sectionMode) ? sectionMode : undefined;
}
function resolveMarkdownTableMode(params) {
  var _a, _b, _c, _d;
  var channel = (0, index_js_1.normalizeChannelId)(params.channel);
  var defaultMode = channel
    ? (_a = DEFAULT_TABLE_MODES.get(channel)) !== null && _a !== void 0
      ? _a
      : "code"
    : "code";
  if (!channel || !params.cfg) {
    return defaultMode;
  }
  var channelsConfig = params.cfg.channels;
  var section =
    (_b =
      channelsConfig === null || channelsConfig === void 0 ? void 0 : channelsConfig[channel]) !==
      null && _b !== void 0
      ? _b
      : (_c = params.cfg) === null || _c === void 0
        ? void 0
        : _c[channel];
  return (_d = resolveMarkdownModeFromSection(section, params.accountId)) !== null && _d !== void 0
    ? _d
    : defaultMode;
}
