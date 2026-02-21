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
exports.deriveSessionOrigin = deriveSessionOrigin;
exports.snapshotSessionOrigin = snapshotSessionOrigin;
exports.deriveGroupSessionPatch = deriveGroupSessionPatch;
exports.deriveSessionMetaPatch = deriveSessionMetaPatch;
var chat_type_js_1 = require("../../channels/chat-type.js");
var conversation_label_js_1 = require("../../channels/conversation-label.js");
var dock_js_1 = require("../../channels/dock.js");
var index_js_1 = require("../../channels/plugins/index.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var group_js_1 = require("./group.js");
var mergeOrigin = function (existing, next) {
  if (!existing && !next) {
    return undefined;
  }
  var merged = existing ? __assign({}, existing) : {};
  if (next === null || next === void 0 ? void 0 : next.label) {
    merged.label = next.label;
  }
  if (next === null || next === void 0 ? void 0 : next.provider) {
    merged.provider = next.provider;
  }
  if (next === null || next === void 0 ? void 0 : next.surface) {
    merged.surface = next.surface;
  }
  if (next === null || next === void 0 ? void 0 : next.chatType) {
    merged.chatType = next.chatType;
  }
  if (next === null || next === void 0 ? void 0 : next.from) {
    merged.from = next.from;
  }
  if (next === null || next === void 0 ? void 0 : next.to) {
    merged.to = next.to;
  }
  if (next === null || next === void 0 ? void 0 : next.accountId) {
    merged.accountId = next.accountId;
  }
  if ((next === null || next === void 0 ? void 0 : next.threadId) != null && next.threadId !== "") {
    merged.threadId = next.threadId;
  }
  return Object.keys(merged).length > 0 ? merged : undefined;
};
function deriveSessionOrigin(ctx) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  var label =
    (_a = (0, conversation_label_js_1.resolveConversationLabel)(ctx)) === null || _a === void 0
      ? void 0
      : _a.trim();
  var providerRaw =
    (typeof ctx.OriginatingChannel === "string" && ctx.OriginatingChannel) ||
    ctx.Surface ||
    ctx.Provider;
  var provider = (0, message_channel_js_1.normalizeMessageChannel)(providerRaw);
  var surface = (_b = ctx.Surface) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase();
  var chatType =
    (_c = (0, chat_type_js_1.normalizeChatType)(ctx.ChatType)) !== null && _c !== void 0
      ? _c
      : undefined;
  var from = (_d = ctx.From) === null || _d === void 0 ? void 0 : _d.trim();
  var to =
    (_f =
      (_e = typeof ctx.OriginatingTo === "string" ? ctx.OriginatingTo : ctx.To) === null ||
      _e === void 0
        ? void 0
        : _e.trim()) !== null && _f !== void 0
      ? _f
      : undefined;
  var accountId = (_g = ctx.AccountId) === null || _g === void 0 ? void 0 : _g.trim();
  var threadId = (_h = ctx.MessageThreadId) !== null && _h !== void 0 ? _h : undefined;
  var origin = {};
  if (label) {
    origin.label = label;
  }
  if (provider) {
    origin.provider = provider;
  }
  if (surface) {
    origin.surface = surface;
  }
  if (chatType) {
    origin.chatType = chatType;
  }
  if (from) {
    origin.from = from;
  }
  if (to) {
    origin.to = to;
  }
  if (accountId) {
    origin.accountId = accountId;
  }
  if (threadId != null && threadId !== "") {
    origin.threadId = threadId;
  }
  return Object.keys(origin).length > 0 ? origin : undefined;
}
function snapshotSessionOrigin(entry) {
  if (!(entry === null || entry === void 0 ? void 0 : entry.origin)) {
    return undefined;
  }
  return __assign({}, entry.origin);
}
function deriveGroupSessionPatch(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j;
  var resolution =
    (_a = params.groupResolution) !== null && _a !== void 0
      ? _a
      : (0, group_js_1.resolveGroupSessionKey)(params.ctx);
  if (!(resolution === null || resolution === void 0 ? void 0 : resolution.channel)) {
    return null;
  }
  var channel = resolution.channel;
  var subject = (_b = params.ctx.GroupSubject) === null || _b === void 0 ? void 0 : _b.trim();
  var space = (_c = params.ctx.GroupSpace) === null || _c === void 0 ? void 0 : _c.trim();
  var explicitChannel =
    (_d = params.ctx.GroupChannel) === null || _d === void 0 ? void 0 : _d.trim();
  var normalizedChannel = (0, index_js_1.normalizeChannelId)(channel);
  var isChannelProvider = Boolean(
    normalizedChannel &&
    ((_e = (0, dock_js_1.getChannelDock)(normalizedChannel)) === null || _e === void 0
      ? void 0
      : _e.capabilities.chatTypes.includes("channel")),
  );
  var nextGroupChannel =
    explicitChannel !== null && explicitChannel !== void 0
      ? explicitChannel
      : (resolution.chatType === "channel" || isChannelProvider) &&
          subject &&
          subject.startsWith("#")
        ? subject
        : undefined;
  var nextSubject = nextGroupChannel ? undefined : subject;
  var patch = {
    chatType: (_f = resolution.chatType) !== null && _f !== void 0 ? _f : "group",
    channel: channel,
    groupId: resolution.id,
  };
  if (nextSubject) {
    patch.subject = nextSubject;
  }
  if (nextGroupChannel) {
    patch.groupChannel = nextGroupChannel;
  }
  if (space) {
    patch.space = space;
  }
  var displayName = (0, group_js_1.buildGroupDisplayName)({
    provider: channel,
    subject:
      nextSubject !== null && nextSubject !== void 0
        ? nextSubject
        : (_g = params.existing) === null || _g === void 0
          ? void 0
          : _g.subject,
    groupChannel:
      nextGroupChannel !== null && nextGroupChannel !== void 0
        ? nextGroupChannel
        : (_h = params.existing) === null || _h === void 0
          ? void 0
          : _h.groupChannel,
    space:
      space !== null && space !== void 0
        ? space
        : (_j = params.existing) === null || _j === void 0
          ? void 0
          : _j.space,
    id: resolution.id,
    key: params.sessionKey,
  });
  if (displayName) {
    patch.displayName = displayName;
  }
  return patch;
}
function deriveSessionMetaPatch(params) {
  var _a;
  var groupPatch = deriveGroupSessionPatch(params);
  var origin = deriveSessionOrigin(params.ctx);
  if (!groupPatch && !origin) {
    return null;
  }
  var patch = groupPatch ? __assign({}, groupPatch) : {};
  var mergedOrigin = mergeOrigin(
    (_a = params.existing) === null || _a === void 0 ? void 0 : _a.origin,
    origin,
  );
  if (mergedOrigin) {
    patch.origin = mergedOrigin;
  }
  return Object.keys(patch).length > 0 ? patch : null;
}
