"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveToolsBySender = resolveToolsBySender;
exports.resolveChannelGroupPolicy = resolveChannelGroupPolicy;
exports.resolveChannelGroupRequireMention = resolveChannelGroupRequireMention;
exports.resolveChannelGroupToolsPolicy = resolveChannelGroupToolsPolicy;
var session_key_js_1 = require("../routing/session-key.js");
function normalizeSenderKey(value) {
  var trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  var withoutAt = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
  return withoutAt.toLowerCase();
}
function resolveToolsBySender(params) {
  var toolsBySender = params.toolsBySender;
  if (!toolsBySender) {
    return undefined;
  }
  var entries = Object.entries(toolsBySender);
  if (entries.length === 0) {
    return undefined;
  }
  var normalized = new Map();
  var wildcard;
  for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
    var _a = entries_1[_i],
      rawKey = _a[0],
      policy = _a[1];
    if (!policy) {
      continue;
    }
    var key = normalizeSenderKey(rawKey);
    if (!key) {
      continue;
    }
    if (key === "*") {
      wildcard = policy;
      continue;
    }
    if (!normalized.has(key)) {
      normalized.set(key, policy);
    }
  }
  var candidates = [];
  var pushCandidate = function (value) {
    var trimmed = value === null || value === void 0 ? void 0 : value.trim();
    if (!trimmed) {
      return;
    }
    candidates.push(trimmed);
  };
  pushCandidate(params.senderId);
  pushCandidate(params.senderE164);
  pushCandidate(params.senderUsername);
  pushCandidate(params.senderName);
  for (var _b = 0, candidates_1 = candidates; _b < candidates_1.length; _b++) {
    var candidate = candidates_1[_b];
    var key = normalizeSenderKey(candidate);
    if (!key) {
      continue;
    }
    var match = normalized.get(key);
    if (match) {
      return match;
    }
  }
  return wildcard;
}
function resolveChannelGroups(cfg, channel, accountId) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  var normalizedAccountId = (0, session_key_js_1.normalizeAccountId)(accountId);
  var channelConfig = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a[channel];
  if (!channelConfig) {
    return undefined;
  }
  var accountGroups =
    (_d =
      (_c =
        (_b = channelConfig.accounts) === null || _b === void 0
          ? void 0
          : _b[normalizedAccountId]) === null || _c === void 0
        ? void 0
        : _c.groups) !== null && _d !== void 0
      ? _d
      : (_h =
            (_e = channelConfig.accounts) === null || _e === void 0
              ? void 0
              : _e[
                  (_g = Object.keys(
                    (_f = channelConfig.accounts) !== null && _f !== void 0 ? _f : {},
                  ).find(function (key) {
                    return key.toLowerCase() === normalizedAccountId.toLowerCase();
                  })) !== null && _g !== void 0
                    ? _g
                    : ""
                ]) === null || _h === void 0
        ? void 0
        : _h.groups;
  return accountGroups !== null && accountGroups !== void 0 ? accountGroups : channelConfig.groups;
}
function resolveChannelGroupPolicy(params) {
  var _a;
  var cfg = params.cfg,
    channel = params.channel;
  var groups = resolveChannelGroups(cfg, channel, params.accountId);
  var allowlistEnabled = Boolean(groups && Object.keys(groups).length > 0);
  var normalizedId = (_a = params.groupId) === null || _a === void 0 ? void 0 : _a.trim();
  var groupConfig = normalizedId && groups ? groups[normalizedId] : undefined;
  var defaultConfig = groups === null || groups === void 0 ? void 0 : groups["*"];
  var allowAll = allowlistEnabled && Boolean(groups && Object.hasOwn(groups, "*"));
  var allowed =
    !allowlistEnabled ||
    allowAll ||
    (normalizedId ? Boolean(groups && Object.hasOwn(groups, normalizedId)) : false);
  return {
    allowlistEnabled: allowlistEnabled,
    allowed: allowed,
    groupConfig: groupConfig,
    defaultConfig: defaultConfig,
  };
}
function resolveChannelGroupRequireMention(params) {
  var requireMentionOverride = params.requireMentionOverride,
    _a = params.overrideOrder,
    overrideOrder = _a === void 0 ? "after-config" : _a;
  var _b = resolveChannelGroupPolicy(params),
    groupConfig = _b.groupConfig,
    defaultConfig = _b.defaultConfig;
  var configMention =
    typeof (groupConfig === null || groupConfig === void 0
      ? void 0
      : groupConfig.requireMention) === "boolean"
      ? groupConfig.requireMention
      : typeof (defaultConfig === null || defaultConfig === void 0
            ? void 0
            : defaultConfig.requireMention) === "boolean"
        ? defaultConfig.requireMention
        : undefined;
  if (overrideOrder === "before-config" && typeof requireMentionOverride === "boolean") {
    return requireMentionOverride;
  }
  if (typeof configMention === "boolean") {
    return configMention;
  }
  if (overrideOrder !== "before-config" && typeof requireMentionOverride === "boolean") {
    return requireMentionOverride;
  }
  return true;
}
function resolveChannelGroupToolsPolicy(params) {
  var _a = resolveChannelGroupPolicy(params),
    groupConfig = _a.groupConfig,
    defaultConfig = _a.defaultConfig;
  var groupSenderPolicy = resolveToolsBySender({
    toolsBySender:
      groupConfig === null || groupConfig === void 0 ? void 0 : groupConfig.toolsBySender,
    senderId: params.senderId,
    senderName: params.senderName,
    senderUsername: params.senderUsername,
    senderE164: params.senderE164,
  });
  if (groupSenderPolicy) {
    return groupSenderPolicy;
  }
  if (groupConfig === null || groupConfig === void 0 ? void 0 : groupConfig.tools) {
    return groupConfig.tools;
  }
  var defaultSenderPolicy = resolveToolsBySender({
    toolsBySender:
      defaultConfig === null || defaultConfig === void 0 ? void 0 : defaultConfig.toolsBySender,
    senderId: params.senderId,
    senderName: params.senderName,
    senderUsername: params.senderUsername,
    senderE164: params.senderE164,
  });
  if (defaultSenderPolicy) {
    return defaultSenderPolicy;
  }
  if (defaultConfig === null || defaultConfig === void 0 ? void 0 : defaultConfig.tools) {
    return defaultConfig.tools;
  }
  return undefined;
}
