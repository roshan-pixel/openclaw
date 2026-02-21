"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTelegramGroupRequireMention = resolveTelegramGroupRequireMention;
exports.resolveWhatsAppGroupRequireMention = resolveWhatsAppGroupRequireMention;
exports.resolveIMessageGroupRequireMention = resolveIMessageGroupRequireMention;
exports.resolveDiscordGroupRequireMention = resolveDiscordGroupRequireMention;
exports.resolveGoogleChatGroupRequireMention = resolveGoogleChatGroupRequireMention;
exports.resolveGoogleChatGroupToolPolicy = resolveGoogleChatGroupToolPolicy;
exports.resolveSlackGroupRequireMention = resolveSlackGroupRequireMention;
exports.resolveBlueBubblesGroupRequireMention = resolveBlueBubblesGroupRequireMention;
exports.resolveTelegramGroupToolPolicy = resolveTelegramGroupToolPolicy;
exports.resolveWhatsAppGroupToolPolicy = resolveWhatsAppGroupToolPolicy;
exports.resolveIMessageGroupToolPolicy = resolveIMessageGroupToolPolicy;
exports.resolveDiscordGroupToolPolicy = resolveDiscordGroupToolPolicy;
exports.resolveSlackGroupToolPolicy = resolveSlackGroupToolPolicy;
exports.resolveBlueBubblesGroupToolPolicy = resolveBlueBubblesGroupToolPolicy;
var group_policy_js_1 = require("../../config/group-policy.js");
var accounts_js_1 = require("../../slack/accounts.js");
function normalizeDiscordSlug(value) {
  if (!value) {
    return "";
  }
  var text = value.trim().toLowerCase();
  if (!text) {
    return "";
  }
  text = text.replace(/^[@#]+/, "");
  text = text.replace(/[\s_]+/g, "-");
  text = text.replace(/[^a-z0-9-]+/g, "-");
  text = text.replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
  return text;
}
function normalizeSlackSlug(raw) {
  var _a;
  var trimmed =
    (_a = raw === null || raw === void 0 ? void 0 : raw.trim().toLowerCase()) !== null &&
    _a !== void 0
      ? _a
      : "";
  if (!trimmed) {
    return "";
  }
  var dashed = trimmed.replace(/\s+/g, "-");
  var cleaned = dashed.replace(/[^a-z0-9#@._+-]+/g, "-");
  return cleaned.replace(/-{2,}/g, "-").replace(/^[-.]+|[-.]+$/g, "");
}
function parseTelegramGroupId(value) {
  var _a;
  var raw =
    (_a = value === null || value === void 0 ? void 0 : value.trim()) !== null && _a !== void 0
      ? _a
      : "";
  if (!raw) {
    return { chatId: undefined, topicId: undefined };
  }
  var parts = raw.split(":").filter(Boolean);
  if (
    parts.length >= 3 &&
    parts[1] === "topic" &&
    /^-?\d+$/.test(parts[0]) &&
    /^\d+$/.test(parts[2])
  ) {
    return { chatId: parts[0], topicId: parts[2] };
  }
  if (parts.length >= 2 && /^-?\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])) {
    return { chatId: parts[0], topicId: parts[1] };
  }
  return { chatId: raw, topicId: undefined };
}
function resolveTelegramRequireMention(params) {
  var _a, _b, _c, _d, _e, _f;
  var cfg = params.cfg,
    chatId = params.chatId,
    topicId = params.topicId;
  if (!chatId) {
    return undefined;
  }
  var groupConfig =
    (_c =
      (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.telegram) === null ||
      _b === void 0
        ? void 0
        : _b.groups) === null || _c === void 0
      ? void 0
      : _c[chatId];
  var groupDefault =
    (_f =
      (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.telegram) === null ||
      _e === void 0
        ? void 0
        : _e.groups) === null || _f === void 0
      ? void 0
      : _f["*"];
  var topicConfig =
    topicId && (groupConfig === null || groupConfig === void 0 ? void 0 : groupConfig.topics)
      ? groupConfig.topics[topicId]
      : undefined;
  var defaultTopicConfig =
    topicId && (groupDefault === null || groupDefault === void 0 ? void 0 : groupDefault.topics)
      ? groupDefault.topics[topicId]
      : undefined;
  if (
    typeof (topicConfig === null || topicConfig === void 0
      ? void 0
      : topicConfig.requireMention) === "boolean"
  ) {
    return topicConfig.requireMention;
  }
  if (
    typeof (defaultTopicConfig === null || defaultTopicConfig === void 0
      ? void 0
      : defaultTopicConfig.requireMention) === "boolean"
  ) {
    return defaultTopicConfig.requireMention;
  }
  if (
    typeof (groupConfig === null || groupConfig === void 0
      ? void 0
      : groupConfig.requireMention) === "boolean"
  ) {
    return groupConfig.requireMention;
  }
  if (
    typeof (groupDefault === null || groupDefault === void 0
      ? void 0
      : groupDefault.requireMention) === "boolean"
  ) {
    return groupDefault.requireMention;
  }
  return undefined;
}
function resolveDiscordGuildEntry(guilds, groupSpace) {
  var _a, _b;
  if (!guilds || Object.keys(guilds).length === 0) {
    return null;
  }
  var space =
    (_a = groupSpace === null || groupSpace === void 0 ? void 0 : groupSpace.trim()) !== null &&
    _a !== void 0
      ? _a
      : "";
  if (space && guilds[space]) {
    return guilds[space];
  }
  var normalized = normalizeDiscordSlug(space);
  if (normalized && guilds[normalized]) {
    return guilds[normalized];
  }
  if (normalized) {
    var match = Object.values(guilds).find(function (entry) {
      var _a;
      return (
        normalizeDiscordSlug(
          (_a = entry === null || entry === void 0 ? void 0 : entry.slug) !== null && _a !== void 0
            ? _a
            : undefined,
        ) === normalized
      );
    });
    if (match) {
      return match;
    }
  }
  return (_b = guilds["*"]) !== null && _b !== void 0 ? _b : null;
}
function resolveTelegramGroupRequireMention(params) {
  var _a = parseTelegramGroupId(params.groupId),
    chatId = _a.chatId,
    topicId = _a.topicId;
  var requireMention = resolveTelegramRequireMention({
    cfg: params.cfg,
    chatId: chatId,
    topicId: topicId,
  });
  if (typeof requireMention === "boolean") {
    return requireMention;
  }
  return (0, group_policy_js_1.resolveChannelGroupRequireMention)({
    cfg: params.cfg,
    channel: "telegram",
    groupId: chatId !== null && chatId !== void 0 ? chatId : params.groupId,
    accountId: params.accountId,
  });
}
function resolveWhatsAppGroupRequireMention(params) {
  return (0, group_policy_js_1.resolveChannelGroupRequireMention)({
    cfg: params.cfg,
    channel: "whatsapp",
    groupId: params.groupId,
    accountId: params.accountId,
  });
}
function resolveIMessageGroupRequireMention(params) {
  return (0, group_policy_js_1.resolveChannelGroupRequireMention)({
    cfg: params.cfg,
    channel: "imessage",
    groupId: params.groupId,
    accountId: params.accountId,
  });
}
function resolveDiscordGroupRequireMention(params) {
  var _a, _b, _c, _d, _e;
  var guildEntry = resolveDiscordGuildEntry(
    (_b = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.discord) === null ||
      _b === void 0
      ? void 0
      : _b.guilds,
    params.groupSpace,
  );
  var channelEntries = guildEntry === null || guildEntry === void 0 ? void 0 : guildEntry.channels;
  if (channelEntries && Object.keys(channelEntries).length > 0) {
    var groupChannel = params.groupChannel;
    var channelSlug = normalizeDiscordSlug(groupChannel);
    var entry =
      (_e =
        (_c = params.groupId ? channelEntries[params.groupId] : undefined) !== null && _c !== void 0
          ? _c
          : channelSlug
            ? (_d = channelEntries[channelSlug]) !== null && _d !== void 0
              ? _d
              : channelEntries["#".concat(channelSlug)]
            : undefined) !== null && _e !== void 0
        ? _e
        : groupChannel
          ? channelEntries[normalizeDiscordSlug(groupChannel)]
          : undefined;
    if (entry && typeof entry.requireMention === "boolean") {
      return entry.requireMention;
    }
  }
  if (
    typeof (guildEntry === null || guildEntry === void 0 ? void 0 : guildEntry.requireMention) ===
    "boolean"
  ) {
    return guildEntry.requireMention;
  }
  return true;
}
function resolveGoogleChatGroupRequireMention(params) {
  return (0, group_policy_js_1.resolveChannelGroupRequireMention)({
    cfg: params.cfg,
    channel: "googlechat",
    groupId: params.groupId,
    accountId: params.accountId,
  });
}
function resolveGoogleChatGroupToolPolicy(params) {
  return (0, group_policy_js_1.resolveChannelGroupToolsPolicy)({
    cfg: params.cfg,
    channel: "googlechat",
    groupId: params.groupId,
    accountId: params.accountId,
    senderId: params.senderId,
    senderName: params.senderName,
    senderUsername: params.senderUsername,
    senderE164: params.senderE164,
  });
}
function resolveSlackGroupRequireMention(params) {
  var _a, _b;
  var account = (0, accounts_js_1.resolveSlackAccount)({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  var channels = (_a = account.channels) !== null && _a !== void 0 ? _a : {};
  var keys = Object.keys(channels);
  if (keys.length === 0) {
    return true;
  }
  var channelId = (_b = params.groupId) === null || _b === void 0 ? void 0 : _b.trim();
  var groupChannel = params.groupChannel;
  var channelName =
    groupChannel === null || groupChannel === void 0 ? void 0 : groupChannel.replace(/^#/, "");
  var normalizedName = normalizeSlackSlug(channelName);
  var candidates = [
    channelId !== null && channelId !== void 0 ? channelId : "",
    channelName ? "#".concat(channelName) : "",
    channelName !== null && channelName !== void 0 ? channelName : "",
    normalizedName,
  ].filter(Boolean);
  var matched;
  for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
    var candidate = candidates_1[_i];
    if (candidate && channels[candidate]) {
      matched = channels[candidate];
      break;
    }
  }
  var fallback = channels["*"];
  var resolved = matched !== null && matched !== void 0 ? matched : fallback;
  if (
    typeof (resolved === null || resolved === void 0 ? void 0 : resolved.requireMention) ===
    "boolean"
  ) {
    return resolved.requireMention;
  }
  return true;
}
function resolveBlueBubblesGroupRequireMention(params) {
  return (0, group_policy_js_1.resolveChannelGroupRequireMention)({
    cfg: params.cfg,
    channel: "bluebubbles",
    groupId: params.groupId,
    accountId: params.accountId,
  });
}
function resolveTelegramGroupToolPolicy(params) {
  var chatId = parseTelegramGroupId(params.groupId).chatId;
  return (0, group_policy_js_1.resolveChannelGroupToolsPolicy)({
    cfg: params.cfg,
    channel: "telegram",
    groupId: chatId !== null && chatId !== void 0 ? chatId : params.groupId,
    accountId: params.accountId,
    senderId: params.senderId,
    senderName: params.senderName,
    senderUsername: params.senderUsername,
    senderE164: params.senderE164,
  });
}
function resolveWhatsAppGroupToolPolicy(params) {
  return (0, group_policy_js_1.resolveChannelGroupToolsPolicy)({
    cfg: params.cfg,
    channel: "whatsapp",
    groupId: params.groupId,
    accountId: params.accountId,
    senderId: params.senderId,
    senderName: params.senderName,
    senderUsername: params.senderUsername,
    senderE164: params.senderE164,
  });
}
function resolveIMessageGroupToolPolicy(params) {
  return (0, group_policy_js_1.resolveChannelGroupToolsPolicy)({
    cfg: params.cfg,
    channel: "imessage",
    groupId: params.groupId,
    accountId: params.accountId,
    senderId: params.senderId,
    senderName: params.senderName,
    senderUsername: params.senderUsername,
    senderE164: params.senderE164,
  });
}
function resolveDiscordGroupToolPolicy(params) {
  var _a, _b, _c, _d, _e;
  var guildEntry = resolveDiscordGuildEntry(
    (_b = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.discord) === null ||
      _b === void 0
      ? void 0
      : _b.guilds,
    params.groupSpace,
  );
  var channelEntries = guildEntry === null || guildEntry === void 0 ? void 0 : guildEntry.channels;
  if (channelEntries && Object.keys(channelEntries).length > 0) {
    var groupChannel = params.groupChannel;
    var channelSlug = normalizeDiscordSlug(groupChannel);
    var entry =
      (_e =
        (_c = params.groupId ? channelEntries[params.groupId] : undefined) !== null && _c !== void 0
          ? _c
          : channelSlug
            ? (_d = channelEntries[channelSlug]) !== null && _d !== void 0
              ? _d
              : channelEntries["#".concat(channelSlug)]
            : undefined) !== null && _e !== void 0
        ? _e
        : groupChannel
          ? channelEntries[normalizeDiscordSlug(groupChannel)]
          : undefined;
    var senderPolicy = (0, group_policy_js_1.resolveToolsBySender)({
      toolsBySender: entry === null || entry === void 0 ? void 0 : entry.toolsBySender,
      senderId: params.senderId,
      senderName: params.senderName,
      senderUsername: params.senderUsername,
      senderE164: params.senderE164,
    });
    if (senderPolicy) {
      return senderPolicy;
    }
    if (entry === null || entry === void 0 ? void 0 : entry.tools) {
      return entry.tools;
    }
  }
  var guildSenderPolicy = (0, group_policy_js_1.resolveToolsBySender)({
    toolsBySender: guildEntry === null || guildEntry === void 0 ? void 0 : guildEntry.toolsBySender,
    senderId: params.senderId,
    senderName: params.senderName,
    senderUsername: params.senderUsername,
    senderE164: params.senderE164,
  });
  if (guildSenderPolicy) {
    return guildSenderPolicy;
  }
  if (guildEntry === null || guildEntry === void 0 ? void 0 : guildEntry.tools) {
    return guildEntry.tools;
  }
  return undefined;
}
function resolveSlackGroupToolPolicy(params) {
  var _a, _b;
  var account = (0, accounts_js_1.resolveSlackAccount)({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  var channels = (_a = account.channels) !== null && _a !== void 0 ? _a : {};
  var keys = Object.keys(channels);
  if (keys.length === 0) {
    return undefined;
  }
  var channelId = (_b = params.groupId) === null || _b === void 0 ? void 0 : _b.trim();
  var groupChannel = params.groupChannel;
  var channelName =
    groupChannel === null || groupChannel === void 0 ? void 0 : groupChannel.replace(/^#/, "");
  var normalizedName = normalizeSlackSlug(channelName);
  var candidates = [
    channelId !== null && channelId !== void 0 ? channelId : "",
    channelName ? "#".concat(channelName) : "",
    channelName !== null && channelName !== void 0 ? channelName : "",
    normalizedName,
  ].filter(Boolean);
  var matched;
  for (var _i = 0, candidates_2 = candidates; _i < candidates_2.length; _i++) {
    var candidate = candidates_2[_i];
    if (candidate && channels[candidate]) {
      matched = channels[candidate];
      break;
    }
  }
  var resolved = matched !== null && matched !== void 0 ? matched : channels["*"];
  var senderPolicy = (0, group_policy_js_1.resolveToolsBySender)({
    toolsBySender: resolved === null || resolved === void 0 ? void 0 : resolved.toolsBySender,
    senderId: params.senderId,
    senderName: params.senderName,
    senderUsername: params.senderUsername,
    senderE164: params.senderE164,
  });
  if (senderPolicy) {
    return senderPolicy;
  }
  if (resolved === null || resolved === void 0 ? void 0 : resolved.tools) {
    return resolved.tools;
  }
  return undefined;
}
function resolveBlueBubblesGroupToolPolicy(params) {
  return (0, group_policy_js_1.resolveChannelGroupToolsPolicy)({
    cfg: params.cfg,
    channel: "bluebubbles",
    groupId: params.groupId,
    accountId: params.accountId,
    senderId: params.senderId,
    senderName: params.senderName,
    senderUsername: params.senderUsername,
    senderE164: params.senderE164,
  });
}
