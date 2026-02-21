"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldEmitSlackReactionNotification = shouldEmitSlackReactionNotification;
exports.resolveSlackChannelLabel = resolveSlackChannelLabel;
exports.resolveSlackChannelConfig = resolveSlackChannelConfig;
var channel_config_js_1 = require("../../channels/channel-config.js");
var allow_list_js_1 = require("./allow-list.js");
function firstDefined() {
  var values = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    values[_i] = arguments[_i];
  }
  for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
    var value = values_1[_a];
    if (typeof value !== "undefined") {
      return value;
    }
  }
  return undefined;
}
function shouldEmitSlackReactionNotification(params) {
  var mode = params.mode,
    botId = params.botId,
    messageAuthorId = params.messageAuthorId,
    userId = params.userId,
    userName = params.userName,
    allowlist = params.allowlist;
  var effectiveMode = mode !== null && mode !== void 0 ? mode : "own";
  if (effectiveMode === "off") {
    return false;
  }
  if (effectiveMode === "own") {
    if (!botId || !messageAuthorId) {
      return false;
    }
    return messageAuthorId === botId;
  }
  if (effectiveMode === "allowlist") {
    if (!Array.isArray(allowlist) || allowlist.length === 0) {
      return false;
    }
    var users = (0, allow_list_js_1.normalizeAllowListLower)(allowlist);
    return (0, allow_list_js_1.allowListMatches)({
      allowList: users,
      id: userId,
      name: userName !== null && userName !== void 0 ? userName : undefined,
    });
  }
  return true;
}
function resolveSlackChannelLabel(params) {
  var _a, _b;
  var channelName = (_a = params.channelName) === null || _a === void 0 ? void 0 : _a.trim();
  if (channelName) {
    var slug = (0, allow_list_js_1.normalizeSlackSlug)(channelName);
    return "#".concat(slug || channelName);
  }
  var channelId = (_b = params.channelId) === null || _b === void 0 ? void 0 : _b.trim();
  return channelId ? "#".concat(channelId) : "unknown channel";
}
function resolveSlackChannelConfig(params) {
  var _a, _b, _c;
  var channelId = params.channelId,
    channelName = params.channelName,
    channels = params.channels,
    defaultRequireMention = params.defaultRequireMention;
  var entries = channels !== null && channels !== void 0 ? channels : {};
  var keys = Object.keys(entries);
  var normalizedName = channelName ? (0, allow_list_js_1.normalizeSlackSlug)(channelName) : "";
  var directName = channelName ? channelName.trim() : "";
  var candidates = (0, channel_config_js_1.buildChannelKeyCandidates)(
    channelId,
    channelName ? "#".concat(directName) : undefined,
    directName,
    normalizedName,
  );
  var match = (0, channel_config_js_1.resolveChannelEntryMatchWithFallback)({
    entries: entries,
    keys: candidates,
    wildcardKey: "*",
  });
  var matched = match.entry,
    fallback = match.wildcardEntry;
  var requireMentionDefault =
    defaultRequireMention !== null && defaultRequireMention !== void 0
      ? defaultRequireMention
      : true;
  if (keys.length === 0) {
    return { allowed: true, requireMention: requireMentionDefault };
  }
  if (!matched && !fallback) {
    return { allowed: false, requireMention: requireMentionDefault };
  }
  var resolved =
    (_a = matched !== null && matched !== void 0 ? matched : fallback) !== null && _a !== void 0
      ? _a
      : {};
  var allowed =
    (_b = firstDefined(
      resolved.enabled,
      resolved.allow,
      fallback === null || fallback === void 0 ? void 0 : fallback.enabled,
      fallback === null || fallback === void 0 ? void 0 : fallback.allow,
      true,
    )) !== null && _b !== void 0
      ? _b
      : true;
  var requireMention =
    (_c = firstDefined(
      resolved.requireMention,
      fallback === null || fallback === void 0 ? void 0 : fallback.requireMention,
      requireMentionDefault,
    )) !== null && _c !== void 0
      ? _c
      : requireMentionDefault;
  var allowBots = firstDefined(
    resolved.allowBots,
    fallback === null || fallback === void 0 ? void 0 : fallback.allowBots,
  );
  var users = firstDefined(
    resolved.users,
    fallback === null || fallback === void 0 ? void 0 : fallback.users,
  );
  var skills = firstDefined(
    resolved.skills,
    fallback === null || fallback === void 0 ? void 0 : fallback.skills,
  );
  var systemPrompt = firstDefined(
    resolved.systemPrompt,
    fallback === null || fallback === void 0 ? void 0 : fallback.systemPrompt,
  );
  var result = {
    allowed: allowed,
    requireMention: requireMention,
    allowBots: allowBots,
    users: users,
    skills: skills,
    systemPrompt: systemPrompt,
  };
  return (0, channel_config_js_1.applyChannelMatchMeta)(result, match);
}
