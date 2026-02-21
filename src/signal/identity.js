"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSignalSender = resolveSignalSender;
exports.formatSignalSenderId = formatSignalSenderId;
exports.formatSignalSenderDisplay = formatSignalSenderDisplay;
exports.formatSignalPairingIdLine = formatSignalPairingIdLine;
exports.resolveSignalRecipient = resolveSignalRecipient;
exports.resolveSignalPeerId = resolveSignalPeerId;
exports.isSignalSenderAllowed = isSignalSenderAllowed;
exports.isSignalGroupAllowed = isSignalGroupAllowed;
var utils_js_1 = require("../utils.js");
var UUID_HYPHENATED_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var UUID_COMPACT_RE = /^[0-9a-f]{32}$/i;
function looksLikeUuid(value) {
  if (UUID_HYPHENATED_RE.test(value) || UUID_COMPACT_RE.test(value)) {
    return true;
  }
  var compact = value.replace(/-/g, "");
  if (!/^[0-9a-f]+$/i.test(compact)) {
    return false;
  }
  return /[a-f]/i.test(compact);
}
function stripSignalPrefix(value) {
  return value.replace(/^signal:/i, "").trim();
}
function resolveSignalSender(params) {
  var _a, _b;
  var sourceNumber = (_a = params.sourceNumber) === null || _a === void 0 ? void 0 : _a.trim();
  if (sourceNumber) {
    return {
      kind: "phone",
      raw: sourceNumber,
      e164: (0, utils_js_1.normalizeE164)(sourceNumber),
    };
  }
  var sourceUuid = (_b = params.sourceUuid) === null || _b === void 0 ? void 0 : _b.trim();
  if (sourceUuid) {
    return { kind: "uuid", raw: sourceUuid };
  }
  return null;
}
function formatSignalSenderId(sender) {
  return sender.kind === "phone" ? sender.e164 : "uuid:".concat(sender.raw);
}
function formatSignalSenderDisplay(sender) {
  return sender.kind === "phone" ? sender.e164 : "uuid:".concat(sender.raw);
}
function formatSignalPairingIdLine(sender) {
  if (sender.kind === "phone") {
    return "Your Signal number: ".concat(sender.e164);
  }
  return "Your Signal sender id: ".concat(formatSignalSenderId(sender));
}
function resolveSignalRecipient(sender) {
  return sender.kind === "phone" ? sender.e164 : sender.raw;
}
function resolveSignalPeerId(sender) {
  return sender.kind === "phone" ? sender.e164 : "uuid:".concat(sender.raw);
}
function parseSignalAllowEntry(entry) {
  var trimmed = entry.trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed === "*") {
    return { kind: "any" };
  }
  var stripped = stripSignalPrefix(trimmed);
  var lower = stripped.toLowerCase();
  if (lower.startsWith("uuid:")) {
    var raw = stripped.slice("uuid:".length).trim();
    if (!raw) {
      return null;
    }
    return { kind: "uuid", raw: raw };
  }
  if (looksLikeUuid(stripped)) {
    return { kind: "uuid", raw: stripped };
  }
  return { kind: "phone", e164: (0, utils_js_1.normalizeE164)(stripped) };
}
function isSignalSenderAllowed(sender, allowFrom) {
  if (allowFrom.length === 0) {
    return false;
  }
  var parsed = allowFrom.map(parseSignalAllowEntry).filter(function (entry) {
    return entry !== null;
  });
  if (
    parsed.some(function (entry) {
      return entry.kind === "any";
    })
  ) {
    return true;
  }
  return parsed.some(function (entry) {
    if (entry.kind === "phone" && sender.kind === "phone") {
      return entry.e164 === sender.e164;
    }
    if (entry.kind === "uuid" && sender.kind === "uuid") {
      return entry.raw === sender.raw;
    }
    return false;
  });
}
function isSignalGroupAllowed(params) {
  var groupPolicy = params.groupPolicy,
    allowFrom = params.allowFrom,
    sender = params.sender;
  if (groupPolicy === "disabled") {
    return false;
  }
  if (groupPolicy === "open") {
    return true;
  }
  if (allowFrom.length === 0) {
    return false;
  }
  return isSignalSenderAllowed(sender, allowFrom);
}
