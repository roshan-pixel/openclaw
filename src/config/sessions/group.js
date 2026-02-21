"use strict";
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildGroupDisplayName = buildGroupDisplayName;
exports.resolveGroupSessionKey = resolveGroupSessionKey;
var message_channel_js_1 = require("../../utils/message-channel.js");
var getGroupSurfaces = function () {
  return new Set(
    __spreadArray(
      __spreadArray([], (0, message_channel_js_1.listDeliverableMessageChannels)(), true),
      ["webchat"],
      false,
    ),
  );
};
function normalizeGroupLabel(raw) {
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
function shortenGroupId(value) {
  var _a;
  var trimmed =
    (_a = value === null || value === void 0 ? void 0 : value.trim()) !== null && _a !== void 0
      ? _a
      : "";
  if (!trimmed) {
    return "";
  }
  if (trimmed.length <= 14) {
    return trimmed;
  }
  return "".concat(trimmed.slice(0, 6), "...").concat(trimmed.slice(-4));
}
function buildGroupDisplayName(params) {
  var _a, _b, _c, _d, _e;
  var providerKey = (
    ((_a = params.provider) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) || "group"
  ).trim();
  var groupChannel = (_b = params.groupChannel) === null || _b === void 0 ? void 0 : _b.trim();
  var space = (_c = params.space) === null || _c === void 0 ? void 0 : _c.trim();
  var subject = (_d = params.subject) === null || _d === void 0 ? void 0 : _d.trim();
  var detail =
    (groupChannel && space
      ? ""
          .concat(space)
          .concat(groupChannel.startsWith("#") ? "" : "#")
          .concat(groupChannel)
      : groupChannel || subject || space || "") || "";
  var fallbackId = ((_e = params.id) === null || _e === void 0 ? void 0 : _e.trim()) || params.key;
  var rawLabel = detail || fallbackId;
  var token = normalizeGroupLabel(rawLabel);
  if (!token) {
    token = normalizeGroupLabel(shortenGroupId(rawLabel));
  }
  if (!params.groupChannel && token.startsWith("#")) {
    token = token.replace(/^#+/, "");
  }
  if (token && !/^[@#]/.test(token) && !token.startsWith("g-") && !token.includes("#")) {
    token = "g-".concat(token);
  }
  return token ? "".concat(providerKey, ":").concat(token) : providerKey;
}
function resolveGroupSessionKey(ctx) {
  var _a, _b, _c, _d, _e;
  var from = typeof ctx.From === "string" ? ctx.From.trim() : "";
  var chatType = (_a = ctx.ChatType) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
  var normalizedChatType =
    chatType === "channel" ? "channel" : chatType === "group" ? "group" : undefined;
  var isWhatsAppGroupId = from.toLowerCase().endsWith("@g.us");
  var looksLikeGroup =
    normalizedChatType === "group" ||
    normalizedChatType === "channel" ||
    from.includes(":group:") ||
    from.includes(":channel:") ||
    isWhatsAppGroupId;
  if (!looksLikeGroup) {
    return null;
  }
  var providerHint =
    (_b = ctx.Provider) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase();
  var parts = from.split(":").filter(Boolean);
  var head =
    (_d = (_c = parts[0]) === null || _c === void 0 ? void 0 : _c.trim().toLowerCase()) !== null &&
    _d !== void 0
      ? _d
      : "";
  var headIsSurface = head ? getGroupSurfaces().has(head) : false;
  var provider = headIsSurface
    ? head
    : providerHint !== null && providerHint !== void 0
      ? providerHint
      : isWhatsAppGroupId
        ? "whatsapp"
        : undefined;
  if (!provider) {
    return null;
  }
  var second = (_e = parts[1]) === null || _e === void 0 ? void 0 : _e.trim().toLowerCase();
  var secondIsKind = second === "group" || second === "channel";
  var kind = secondIsKind
    ? second
    : from.includes(":channel:") || normalizedChatType === "channel"
      ? "channel"
      : "group";
  var id = headIsSurface
    ? secondIsKind
      ? parts.slice(2).join(":")
      : parts.slice(1).join(":")
    : from;
  var finalId = id.trim().toLowerCase();
  if (!finalId) {
    return null;
  }
  return {
    key: "".concat(provider, ":").concat(kind, ":").concat(finalId),
    channel: provider,
    id: finalId,
    chatType: kind === "channel" ? "channel" : "group",
  };
}
