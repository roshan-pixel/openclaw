"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeIMessageHandle = normalizeIMessageHandle;
exports.parseIMessageTarget = parseIMessageTarget;
exports.parseIMessageAllowTarget = parseIMessageAllowTarget;
exports.isAllowedIMessageSender = isAllowedIMessageSender;
exports.formatIMessageChatTarget = formatIMessageChatTarget;
var utils_js_1 = require("../utils.js");
var CHAT_ID_PREFIXES = ["chat_id:", "chatid:", "chat:"];
var CHAT_GUID_PREFIXES = ["chat_guid:", "chatguid:", "guid:"];
var CHAT_IDENTIFIER_PREFIXES = ["chat_identifier:", "chatidentifier:", "chatident:"];
var SERVICE_PREFIXES = [
  { prefix: "imessage:", service: "imessage" },
  { prefix: "sms:", service: "sms" },
  { prefix: "auto:", service: "auto" },
];
function stripPrefix(value, prefix) {
  return value.slice(prefix.length).trim();
}
function normalizeIMessageHandle(raw) {
  var trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }
  var lowered = trimmed.toLowerCase();
  if (lowered.startsWith("imessage:")) {
    return normalizeIMessageHandle(trimmed.slice(9));
  }
  if (lowered.startsWith("sms:")) {
    return normalizeIMessageHandle(trimmed.slice(4));
  }
  if (lowered.startsWith("auto:")) {
    return normalizeIMessageHandle(trimmed.slice(5));
  }
  // Normalize chat_id/chat_guid/chat_identifier prefixes case-insensitively
  for (var _i = 0, CHAT_ID_PREFIXES_1 = CHAT_ID_PREFIXES; _i < CHAT_ID_PREFIXES_1.length; _i++) {
    var prefix = CHAT_ID_PREFIXES_1[_i];
    if (lowered.startsWith(prefix)) {
      var value = trimmed.slice(prefix.length).trim();
      return "chat_id:".concat(value);
    }
  }
  for (
    var _a = 0, CHAT_GUID_PREFIXES_1 = CHAT_GUID_PREFIXES;
    _a < CHAT_GUID_PREFIXES_1.length;
    _a++
  ) {
    var prefix = CHAT_GUID_PREFIXES_1[_a];
    if (lowered.startsWith(prefix)) {
      var value = trimmed.slice(prefix.length).trim();
      return "chat_guid:".concat(value);
    }
  }
  for (
    var _b = 0, CHAT_IDENTIFIER_PREFIXES_1 = CHAT_IDENTIFIER_PREFIXES;
    _b < CHAT_IDENTIFIER_PREFIXES_1.length;
    _b++
  ) {
    var prefix = CHAT_IDENTIFIER_PREFIXES_1[_b];
    if (lowered.startsWith(prefix)) {
      var value = trimmed.slice(prefix.length).trim();
      return "chat_identifier:".concat(value);
    }
  }
  if (trimmed.includes("@")) {
    return trimmed.toLowerCase();
  }
  var normalized = (0, utils_js_1.normalizeE164)(trimmed);
  if (normalized) {
    return normalized;
  }
  return trimmed.replace(/\s+/g, "");
}
function parseIMessageTarget(raw) {
  var trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("iMessage target is required");
  }
  var lower = trimmed.toLowerCase();
  var _loop_1 = function (prefix, service) {
    if (lower.startsWith(prefix)) {
      var remainder = stripPrefix(trimmed, prefix);
      if (!remainder) {
        throw new Error("".concat(prefix, " target is required"));
      }
      var remainderLower_1 = remainder.toLowerCase();
      var isChatTarget =
        CHAT_ID_PREFIXES.some(function (p) {
          return remainderLower_1.startsWith(p);
        }) ||
        CHAT_GUID_PREFIXES.some(function (p) {
          return remainderLower_1.startsWith(p);
        }) ||
        CHAT_IDENTIFIER_PREFIXES.some(function (p) {
          return remainderLower_1.startsWith(p);
        });
      if (isChatTarget) {
        return { value: parseIMessageTarget(remainder) };
      }
      return { value: { kind: "handle", to: remainder, service: service } };
    }
  };
  for (var _i = 0, SERVICE_PREFIXES_1 = SERVICE_PREFIXES; _i < SERVICE_PREFIXES_1.length; _i++) {
    var _a = SERVICE_PREFIXES_1[_i],
      prefix = _a.prefix,
      service = _a.service;
    var state_1 = _loop_1(prefix, service);
    if (typeof state_1 === "object") {
      return state_1.value;
    }
  }
  for (var _b = 0, CHAT_ID_PREFIXES_2 = CHAT_ID_PREFIXES; _b < CHAT_ID_PREFIXES_2.length; _b++) {
    var prefix = CHAT_ID_PREFIXES_2[_b];
    if (lower.startsWith(prefix)) {
      var value = stripPrefix(trimmed, prefix);
      var chatId = Number.parseInt(value, 10);
      if (!Number.isFinite(chatId)) {
        throw new Error("Invalid chat_id: ".concat(value));
      }
      return { kind: "chat_id", chatId: chatId };
    }
  }
  for (
    var _c = 0, CHAT_GUID_PREFIXES_2 = CHAT_GUID_PREFIXES;
    _c < CHAT_GUID_PREFIXES_2.length;
    _c++
  ) {
    var prefix = CHAT_GUID_PREFIXES_2[_c];
    if (lower.startsWith(prefix)) {
      var value = stripPrefix(trimmed, prefix);
      if (!value) {
        throw new Error("chat_guid is required");
      }
      return { kind: "chat_guid", chatGuid: value };
    }
  }
  for (
    var _d = 0, CHAT_IDENTIFIER_PREFIXES_2 = CHAT_IDENTIFIER_PREFIXES;
    _d < CHAT_IDENTIFIER_PREFIXES_2.length;
    _d++
  ) {
    var prefix = CHAT_IDENTIFIER_PREFIXES_2[_d];
    if (lower.startsWith(prefix)) {
      var value = stripPrefix(trimmed, prefix);
      if (!value) {
        throw new Error("chat_identifier is required");
      }
      return { kind: "chat_identifier", chatIdentifier: value };
    }
  }
  return { kind: "handle", to: trimmed, service: "auto" };
}
function parseIMessageAllowTarget(raw) {
  var trimmed = raw.trim();
  if (!trimmed) {
    return { kind: "handle", handle: "" };
  }
  var lower = trimmed.toLowerCase();
  for (var _i = 0, SERVICE_PREFIXES_2 = SERVICE_PREFIXES; _i < SERVICE_PREFIXES_2.length; _i++) {
    var prefix = SERVICE_PREFIXES_2[_i].prefix;
    if (lower.startsWith(prefix)) {
      var remainder = stripPrefix(trimmed, prefix);
      if (!remainder) {
        return { kind: "handle", handle: "" };
      }
      return parseIMessageAllowTarget(remainder);
    }
  }
  for (var _a = 0, CHAT_ID_PREFIXES_3 = CHAT_ID_PREFIXES; _a < CHAT_ID_PREFIXES_3.length; _a++) {
    var prefix = CHAT_ID_PREFIXES_3[_a];
    if (lower.startsWith(prefix)) {
      var value = stripPrefix(trimmed, prefix);
      var chatId = Number.parseInt(value, 10);
      if (Number.isFinite(chatId)) {
        return { kind: "chat_id", chatId: chatId };
      }
    }
  }
  for (
    var _b = 0, CHAT_GUID_PREFIXES_3 = CHAT_GUID_PREFIXES;
    _b < CHAT_GUID_PREFIXES_3.length;
    _b++
  ) {
    var prefix = CHAT_GUID_PREFIXES_3[_b];
    if (lower.startsWith(prefix)) {
      var value = stripPrefix(trimmed, prefix);
      if (value) {
        return { kind: "chat_guid", chatGuid: value };
      }
    }
  }
  for (
    var _c = 0, CHAT_IDENTIFIER_PREFIXES_3 = CHAT_IDENTIFIER_PREFIXES;
    _c < CHAT_IDENTIFIER_PREFIXES_3.length;
    _c++
  ) {
    var prefix = CHAT_IDENTIFIER_PREFIXES_3[_c];
    if (lower.startsWith(prefix)) {
      var value = stripPrefix(trimmed, prefix);
      if (value) {
        return { kind: "chat_identifier", chatIdentifier: value };
      }
    }
  }
  return { kind: "handle", handle: normalizeIMessageHandle(trimmed) };
}
function isAllowedIMessageSender(params) {
  var _a, _b, _c;
  var allowFrom = params.allowFrom.map(function (entry) {
    return String(entry).trim();
  });
  if (allowFrom.length === 0) {
    return true;
  }
  if (allowFrom.includes("*")) {
    return true;
  }
  var senderNormalized = normalizeIMessageHandle(params.sender);
  var chatId = (_a = params.chatId) !== null && _a !== void 0 ? _a : undefined;
  var chatGuid = (_b = params.chatGuid) === null || _b === void 0 ? void 0 : _b.trim();
  var chatIdentifier = (_c = params.chatIdentifier) === null || _c === void 0 ? void 0 : _c.trim();
  for (var _i = 0, allowFrom_1 = allowFrom; _i < allowFrom_1.length; _i++) {
    var entry = allowFrom_1[_i];
    if (!entry) {
      continue;
    }
    var parsed = parseIMessageAllowTarget(entry);
    if (parsed.kind === "chat_id" && chatId !== undefined) {
      if (parsed.chatId === chatId) {
        return true;
      }
    } else if (parsed.kind === "chat_guid" && chatGuid) {
      if (parsed.chatGuid === chatGuid) {
        return true;
      }
    } else if (parsed.kind === "chat_identifier" && chatIdentifier) {
      if (parsed.chatIdentifier === chatIdentifier) {
        return true;
      }
    } else if (parsed.kind === "handle" && senderNormalized) {
      if (parsed.handle === senderNormalized) {
        return true;
      }
    }
  }
  return false;
}
function formatIMessageChatTarget(chatId) {
  if (!chatId || !Number.isFinite(chatId)) {
    return "";
  }
  return "chat_id:".concat(chatId);
}
