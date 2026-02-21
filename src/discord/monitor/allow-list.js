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
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDiscordAllowList = normalizeDiscordAllowList;
exports.normalizeDiscordSlug = normalizeDiscordSlug;
exports.allowListMatches = allowListMatches;
exports.resolveDiscordAllowListMatch = resolveDiscordAllowListMatch;
exports.resolveDiscordUserAllowed = resolveDiscordUserAllowed;
exports.resolveDiscordCommandAuthorized = resolveDiscordCommandAuthorized;
exports.resolveDiscordGuildEntry = resolveDiscordGuildEntry;
exports.resolveDiscordChannelConfig = resolveDiscordChannelConfig;
exports.resolveDiscordChannelConfigWithFallback = resolveDiscordChannelConfigWithFallback;
exports.resolveDiscordShouldRequireMention = resolveDiscordShouldRequireMention;
exports.isDiscordAutoThreadOwnedByBot = isDiscordAutoThreadOwnedByBot;
exports.isDiscordGroupAllowedByPolicy = isDiscordGroupAllowedByPolicy;
exports.resolveGroupDmAllow = resolveGroupDmAllow;
exports.shouldEmitDiscordReactionNotification = shouldEmitDiscordReactionNotification;
var channel_config_js_1 = require("../../channels/channel-config.js");
var format_js_1 = require("./format.js");
function normalizeDiscordAllowList(raw, prefixes) {
  if (!raw || raw.length === 0) {
    return null;
  }
  var ids = new Set();
  var names = new Set();
  var allowAll = raw.some(function (entry) {
    return String(entry).trim() === "*";
  });
  var _loop_1 = function (entry) {
    var text = String(entry).trim();
    if (!text || text === "*") {
      return "continue";
    }
    var normalized = normalizeDiscordSlug(text);
    var maybeId = text.replace(/^<@!?/, "").replace(/>$/, "");
    if (/^\d+$/.test(maybeId)) {
      ids.add(maybeId);
      return "continue";
    }
    var prefix = prefixes.find(function (entry) {
      return text.startsWith(entry);
    });
    if (prefix) {
      var candidate = text.slice(prefix.length);
      if (candidate) {
        ids.add(candidate);
      }
      return "continue";
    }
    if (normalized) {
      names.add(normalized);
    }
  };
  for (var _i = 0, raw_1 = raw; _i < raw_1.length; _i++) {
    var entry = raw_1[_i];
    _loop_1(entry);
  }
  return { allowAll: allowAll, ids: ids, names: names };
}
function normalizeDiscordSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^#/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function allowListMatches(list, candidate) {
  if (list.allowAll) {
    return true;
  }
  if (candidate.id && list.ids.has(candidate.id)) {
    return true;
  }
  var slug = candidate.name ? normalizeDiscordSlug(candidate.name) : "";
  if (slug && list.names.has(slug)) {
    return true;
  }
  if (candidate.tag && list.names.has(normalizeDiscordSlug(candidate.tag))) {
    return true;
  }
  return false;
}
function resolveDiscordAllowListMatch(params) {
  var allowList = params.allowList,
    candidate = params.candidate;
  if (allowList.allowAll) {
    return { allowed: true, matchKey: "*", matchSource: "wildcard" };
  }
  if (candidate.id && allowList.ids.has(candidate.id)) {
    return { allowed: true, matchKey: candidate.id, matchSource: "id" };
  }
  var nameSlug = candidate.name ? normalizeDiscordSlug(candidate.name) : "";
  if (nameSlug && allowList.names.has(nameSlug)) {
    return { allowed: true, matchKey: nameSlug, matchSource: "name" };
  }
  var tagSlug = candidate.tag ? normalizeDiscordSlug(candidate.tag) : "";
  if (tagSlug && allowList.names.has(tagSlug)) {
    return { allowed: true, matchKey: tagSlug, matchSource: "tag" };
  }
  return { allowed: false };
}
function resolveDiscordUserAllowed(params) {
  var allowList = normalizeDiscordAllowList(params.allowList, ["discord:", "user:"]);
  if (!allowList) {
    return true;
  }
  return allowListMatches(allowList, {
    id: params.userId,
    name: params.userName,
    tag: params.userTag,
  });
}
function resolveDiscordCommandAuthorized(params) {
  if (!params.isDirectMessage) {
    return true;
  }
  var allowList = normalizeDiscordAllowList(params.allowFrom, ["discord:", "user:"]);
  if (!allowList) {
    return true;
  }
  return allowListMatches(allowList, {
    id: params.author.id,
    name: params.author.username,
    tag: (0, format_js_1.formatDiscordUserTag)(params.author),
  });
}
function resolveDiscordGuildEntry(params) {
  var _a;
  var guild = params.guild;
  var entries = params.guildEntries;
  if (!guild || !entries) {
    return null;
  }
  var byId = entries[guild.id];
  if (byId) {
    return __assign(__assign({}, byId), { id: guild.id });
  }
  var slug = normalizeDiscordSlug((_a = guild.name) !== null && _a !== void 0 ? _a : "");
  var bySlug = entries[slug];
  if (bySlug) {
    return __assign(__assign({}, bySlug), { id: guild.id, slug: slug || bySlug.slug });
  }
  var wildcard = entries["*"];
  if (wildcard) {
    return __assign(__assign({}, wildcard), { id: guild.id, slug: slug || wildcard.slug });
  }
  return null;
}
function buildDiscordChannelKeys(params) {
  var allowNameMatch = params.allowNameMatch !== false;
  return (0, channel_config_js_1.buildChannelKeyCandidates)(
    params.id,
    allowNameMatch ? params.slug : undefined,
    allowNameMatch ? params.name : undefined,
  );
}
function resolveDiscordChannelEntryMatch(channels, params, parentParams) {
  var keys = buildDiscordChannelKeys(params);
  var parentKeys = parentParams ? buildDiscordChannelKeys(parentParams) : undefined;
  return (0, channel_config_js_1.resolveChannelEntryMatchWithFallback)({
    entries: channels,
    keys: keys,
    parentKeys: parentKeys,
    wildcardKey: "*",
  });
}
function resolveDiscordChannelConfigEntry(entry) {
  var resolved = {
    allowed: entry.allow !== false,
    requireMention: entry.requireMention,
    skills: entry.skills,
    enabled: entry.enabled,
    users: entry.users,
    systemPrompt: entry.systemPrompt,
    autoThread: entry.autoThread,
  };
  return resolved;
}
function resolveDiscordChannelConfig(params) {
  var guildInfo = params.guildInfo,
    channelId = params.channelId,
    channelName = params.channelName,
    channelSlug = params.channelSlug;
  var channels = guildInfo === null || guildInfo === void 0 ? void 0 : guildInfo.channels;
  if (!channels) {
    return null;
  }
  var match = resolveDiscordChannelEntryMatch(channels, {
    id: channelId,
    name: channelName,
    slug: channelSlug,
  });
  var resolved = (0, channel_config_js_1.resolveChannelMatchConfig)(
    match,
    resolveDiscordChannelConfigEntry,
  );
  return resolved !== null && resolved !== void 0 ? resolved : { allowed: false };
}
function resolveDiscordChannelConfigWithFallback(params) {
  var _a;
  var guildInfo = params.guildInfo,
    channelId = params.channelId,
    channelName = params.channelName,
    channelSlug = params.channelSlug,
    parentId = params.parentId,
    parentName = params.parentName,
    parentSlug = params.parentSlug,
    scope = params.scope;
  var channels = guildInfo === null || guildInfo === void 0 ? void 0 : guildInfo.channels;
  if (!channels) {
    return null;
  }
  var resolvedParentSlug =
    parentSlug !== null && parentSlug !== void 0
      ? parentSlug
      : parentName
        ? normalizeDiscordSlug(parentName)
        : "";
  var match = resolveDiscordChannelEntryMatch(
    channels,
    {
      id: channelId,
      name: channelName,
      slug: channelSlug,
      allowNameMatch: scope !== "thread",
    },
    parentId || parentName || parentSlug
      ? {
          id: parentId !== null && parentId !== void 0 ? parentId : "",
          name: parentName,
          slug: resolvedParentSlug,
        }
      : undefined,
  );
  return (_a = (0, channel_config_js_1.resolveChannelMatchConfig)(
    match,
    resolveDiscordChannelConfigEntry,
  )) !== null && _a !== void 0
    ? _a
    : { allowed: false };
}
function resolveDiscordShouldRequireMention(params) {
  var _a, _b, _c, _d, _e;
  if (!params.isGuildMessage) {
    return false;
  }
  // Only skip mention requirement in threads created by the bot (when autoThread is enabled).
  var isBotThread =
    (_a = params.isAutoThreadOwnedByBot) !== null && _a !== void 0
      ? _a
      : isDiscordAutoThreadOwnedByBot(params);
  if (isBotThread) {
    return false;
  }
  return (_e =
    (_c = (_b = params.channelConfig) === null || _b === void 0 ? void 0 : _b.requireMention) !==
      null && _c !== void 0
      ? _c
      : (_d = params.guildInfo) === null || _d === void 0
        ? void 0
        : _d.requireMention) !== null && _e !== void 0
    ? _e
    : true;
}
function isDiscordAutoThreadOwnedByBot(params) {
  var _a, _b, _c;
  if (!params.isThread) {
    return false;
  }
  if (!((_a = params.channelConfig) === null || _a === void 0 ? void 0 : _a.autoThread)) {
    return false;
  }
  var botId = (_b = params.botId) === null || _b === void 0 ? void 0 : _b.trim();
  var threadOwnerId = (_c = params.threadOwnerId) === null || _c === void 0 ? void 0 : _c.trim();
  return Boolean(botId && threadOwnerId && botId === threadOwnerId);
}
function isDiscordGroupAllowedByPolicy(params) {
  var groupPolicy = params.groupPolicy,
    guildAllowlisted = params.guildAllowlisted,
    channelAllowlistConfigured = params.channelAllowlistConfigured,
    channelAllowed = params.channelAllowed;
  if (groupPolicy === "disabled") {
    return false;
  }
  if (groupPolicy === "open") {
    return true;
  }
  if (!guildAllowlisted) {
    return false;
  }
  if (!channelAllowlistConfigured) {
    return true;
  }
  return channelAllowed;
}
function resolveGroupDmAllow(params) {
  var channels = params.channels,
    channelId = params.channelId,
    channelName = params.channelName,
    channelSlug = params.channelSlug;
  if (!channels || channels.length === 0) {
    return true;
  }
  var allowList = channels.map(function (entry) {
    return normalizeDiscordSlug(String(entry));
  });
  var candidates = [
    normalizeDiscordSlug(channelId),
    channelSlug,
    channelName ? normalizeDiscordSlug(channelName) : "",
  ].filter(Boolean);
  return (
    allowList.includes("*") ||
    candidates.some(function (candidate) {
      return allowList.includes(candidate);
    })
  );
}
function shouldEmitDiscordReactionNotification(params) {
  var _a;
  var mode = (_a = params.mode) !== null && _a !== void 0 ? _a : "own";
  if (mode === "off") {
    return false;
  }
  if (mode === "all") {
    return true;
  }
  if (mode === "own") {
    return Boolean(params.botId && params.messageAuthorId === params.botId);
  }
  if (mode === "allowlist") {
    var list = normalizeDiscordAllowList(params.allowlist, ["discord:", "user:"]);
    if (!list) {
      return false;
    }
    return allowListMatches(list, {
      id: params.userId,
      name: params.userName,
      tag: params.userTag,
    });
  }
  return false;
}
