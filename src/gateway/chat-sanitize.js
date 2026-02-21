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
exports.stripEnvelope = stripEnvelope;
exports.stripEnvelopeFromMessage = stripEnvelopeFromMessage;
exports.stripEnvelopeFromMessages = stripEnvelopeFromMessages;
var ENVELOPE_PREFIX = /^\[([^\]]+)\]\s*/;
var ENVELOPE_CHANNELS = [
  "WebChat",
  "WhatsApp",
  "Telegram",
  "Signal",
  "Slack",
  "Discord",
  "Google Chat",
  "iMessage",
  "Teams",
  "Matrix",
  "Zalo",
  "Zalo Personal",
  "BlueBubbles",
];
var MESSAGE_ID_LINE = /^\s*\[message_id:\s*[^\]]+\]\s*$/i;
function looksLikeEnvelopeHeader(header) {
  if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(header)) {
    return true;
  }
  if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(header)) {
    return true;
  }
  return ENVELOPE_CHANNELS.some(function (label) {
    return header.startsWith("".concat(label, " "));
  });
}
function stripEnvelope(text) {
  var _a;
  var match = text.match(ENVELOPE_PREFIX);
  if (!match) {
    return text;
  }
  var header = (_a = match[1]) !== null && _a !== void 0 ? _a : "";
  if (!looksLikeEnvelopeHeader(header)) {
    return text;
  }
  return text.slice(match[0].length);
}
function stripMessageIdHints(text) {
  if (!text.includes("[message_id:")) {
    return text;
  }
  var lines = text.split(/\r?\n/);
  var filtered = lines.filter(function (line) {
    return !MESSAGE_ID_LINE.test(line);
  });
  return filtered.length === lines.length ? text : filtered.join("\n");
}
function stripEnvelopeFromContent(content) {
  var changed = false;
  var next = content.map(function (item) {
    if (!item || typeof item !== "object") {
      return item;
    }
    var entry = item;
    if (entry.type !== "text" || typeof entry.text !== "string") {
      return item;
    }
    var stripped = stripMessageIdHints(stripEnvelope(entry.text));
    if (stripped === entry.text) {
      return item;
    }
    changed = true;
    return __assign(__assign({}, entry), { text: stripped });
  });
  return { content: next, changed: changed };
}
function stripEnvelopeFromMessage(message) {
  if (!message || typeof message !== "object") {
    return message;
  }
  var entry = message;
  var role = typeof entry.role === "string" ? entry.role.toLowerCase() : "";
  if (role !== "user") {
    return message;
  }
  var changed = false;
  var next = __assign({}, entry);
  if (typeof entry.content === "string") {
    var stripped = stripMessageIdHints(stripEnvelope(entry.content));
    if (stripped !== entry.content) {
      next.content = stripped;
      changed = true;
    }
  } else if (Array.isArray(entry.content)) {
    var updated = stripEnvelopeFromContent(entry.content);
    if (updated.changed) {
      next.content = updated.content;
      changed = true;
    }
  } else if (typeof entry.text === "string") {
    var stripped = stripMessageIdHints(stripEnvelope(entry.text));
    if (stripped !== entry.text) {
      next.text = stripped;
      changed = true;
    }
  }
  return changed ? next : message;
}
function stripEnvelopeFromMessages(messages) {
  if (messages.length === 0) {
    return messages;
  }
  var changed = false;
  var next = messages.map(function (message) {
    var stripped = stripEnvelopeFromMessage(message);
    if (stripped !== message) {
      changed = true;
    }
    return stripped;
  });
  return changed ? next : messages;
}
