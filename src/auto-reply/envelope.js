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
exports.resolveEnvelopeFormatOptions = resolveEnvelopeFormatOptions;
exports.formatAgentEnvelope = formatAgentEnvelope;
exports.formatInboundEnvelope = formatInboundEnvelope;
exports.formatInboundFromLabel = formatInboundFromLabel;
exports.formatThreadStarterEnvelope = formatThreadStarterEnvelope;
var date_time_js_1 = require("../agents/date-time.js");
var chat_type_js_1 = require("../channels/chat-type.js");
var sender_label_js_1 = require("../channels/sender-label.js");
function resolveEnvelopeFormatOptions(cfg) {
  var _a;
  var defaults =
    (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0
      ? void 0
      : _a.defaults;
  return {
    timezone: defaults === null || defaults === void 0 ? void 0 : defaults.envelopeTimezone,
    includeTimestamp:
      (defaults === null || defaults === void 0 ? void 0 : defaults.envelopeTimestamp) !== "off",
    includeElapsed:
      (defaults === null || defaults === void 0 ? void 0 : defaults.envelopeElapsed) !== "off",
    userTimezone: defaults === null || defaults === void 0 ? void 0 : defaults.userTimezone,
  };
}
function normalizeEnvelopeOptions(options) {
  var _a;
  var includeTimestamp =
    (options === null || options === void 0 ? void 0 : options.includeTimestamp) !== false;
  var includeElapsed =
    (options === null || options === void 0 ? void 0 : options.includeElapsed) !== false;
  return {
    timezone:
      ((_a = options === null || options === void 0 ? void 0 : options.timezone) === null ||
      _a === void 0
        ? void 0
        : _a.trim()) || "local",
    includeTimestamp: includeTimestamp,
    includeElapsed: includeElapsed,
    userTimezone: options === null || options === void 0 ? void 0 : options.userTimezone,
  };
}
function resolveExplicitTimezone(value) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format(new Date());
    return value;
  } catch (_a) {
    return undefined;
  }
}
function resolveEnvelopeTimezone(options) {
  var _a;
  var trimmed = (_a = options.timezone) === null || _a === void 0 ? void 0 : _a.trim();
  if (!trimmed) {
    return { mode: "local" };
  }
  var lowered = trimmed.toLowerCase();
  if (lowered === "utc" || lowered === "gmt") {
    return { mode: "utc" };
  }
  if (lowered === "local" || lowered === "host") {
    return { mode: "local" };
  }
  if (lowered === "user") {
    return {
      mode: "iana",
      timeZone: (0, date_time_js_1.resolveUserTimezone)(options.userTimezone),
    };
  }
  var explicit = resolveExplicitTimezone(trimmed);
  return explicit ? { mode: "iana", timeZone: explicit } : { mode: "utc" };
}
function formatUtcTimestamp(date) {
  var yyyy = String(date.getUTCFullYear()).padStart(4, "0");
  var mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  var dd = String(date.getUTCDate()).padStart(2, "0");
  var hh = String(date.getUTCHours()).padStart(2, "0");
  var min = String(date.getUTCMinutes()).padStart(2, "0");
  return "".concat(yyyy, "-").concat(mm, "-").concat(dd, "T").concat(hh, ":").concat(min, "Z");
}
function formatZonedTimestamp(date, timeZone) {
  var _a, _b;
  var parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  }).formatToParts(date);
  var pick = function (type) {
    var _a;
    return (_a = parts.find(function (part) {
      return part.type === type;
    })) === null || _a === void 0
      ? void 0
      : _a.value;
  };
  var yyyy = pick("year");
  var mm = pick("month");
  var dd = pick("day");
  var hh = pick("hour");
  var min = pick("minute");
  var tz =
    (_b =
      (_a = __spreadArray([], parts, true)
        .toReversed()
        .find(function (part) {
          return part.type === "timeZoneName";
        })) === null || _a === void 0
        ? void 0
        : _a.value) === null || _b === void 0
      ? void 0
      : _b.trim();
  if (!yyyy || !mm || !dd || !hh || !min) {
    return undefined;
  }
  return ""
    .concat(yyyy, "-")
    .concat(mm, "-")
    .concat(dd, " ")
    .concat(hh, ":")
    .concat(min)
    .concat(tz ? " ".concat(tz) : "");
}
function formatTimestamp(ts, options) {
  if (!ts) {
    return undefined;
  }
  var resolved = normalizeEnvelopeOptions(options);
  if (!resolved.includeTimestamp) {
    return undefined;
  }
  var date = ts instanceof Date ? ts : new Date(ts);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  var zone = resolveEnvelopeTimezone(resolved);
  if (zone.mode === "utc") {
    return formatUtcTimestamp(date);
  }
  if (zone.mode === "local") {
    return formatZonedTimestamp(date);
  }
  return formatZonedTimestamp(date, zone.timeZone);
}
function formatElapsedTime(currentMs, previousMs) {
  var elapsedMs = currentMs - previousMs;
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) {
    return undefined;
  }
  var seconds = Math.floor(elapsedMs / 1000);
  if (seconds < 60) {
    return "".concat(seconds, "s");
  }
  var minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return "".concat(minutes, "m");
  }
  var hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return "".concat(hours, "h");
  }
  var days = Math.floor(hours / 24);
  return "".concat(days, "d");
}
function formatAgentEnvelope(params) {
  var _a, _b, _c, _d;
  var channel = ((_a = params.channel) === null || _a === void 0 ? void 0 : _a.trim()) || "Channel";
  var parts = [channel];
  var resolved = normalizeEnvelopeOptions(params.envelope);
  var elapsed =
    resolved.includeElapsed && params.timestamp && params.previousTimestamp
      ? formatElapsedTime(
          params.timestamp instanceof Date ? params.timestamp.getTime() : params.timestamp,
          params.previousTimestamp instanceof Date
            ? params.previousTimestamp.getTime()
            : params.previousTimestamp,
        )
      : undefined;
  if ((_b = params.from) === null || _b === void 0 ? void 0 : _b.trim()) {
    var from = params.from.trim();
    parts.push(elapsed ? "".concat(from, " +").concat(elapsed) : from);
  } else if (elapsed) {
    parts.push("+".concat(elapsed));
  }
  if ((_c = params.host) === null || _c === void 0 ? void 0 : _c.trim()) {
    parts.push(params.host.trim());
  }
  if ((_d = params.ip) === null || _d === void 0 ? void 0 : _d.trim()) {
    parts.push(params.ip.trim());
  }
  var ts = formatTimestamp(params.timestamp, resolved);
  if (ts) {
    parts.push(ts);
  }
  var header = "[".concat(parts.join(" "), "]");
  return "".concat(header, " ").concat(params.body);
}
function formatInboundEnvelope(params) {
  var _a, _b;
  var chatType = (0, chat_type_js_1.normalizeChatType)(params.chatType);
  var isDirect = !chatType || chatType === "direct";
  var resolvedSender =
    ((_a = params.senderLabel) === null || _a === void 0 ? void 0 : _a.trim()) ||
    (0, sender_label_js_1.resolveSenderLabel)(
      (_b = params.sender) !== null && _b !== void 0 ? _b : {},
    );
  var body =
    !isDirect && resolvedSender ? "".concat(resolvedSender, ": ").concat(params.body) : params.body;
  return formatAgentEnvelope({
    channel: params.channel,
    from: params.from,
    timestamp: params.timestamp,
    previousTimestamp: params.previousTimestamp,
    envelope: params.envelope,
    body: body,
  });
}
function formatInboundFromLabel(params) {
  var _a, _b, _c;
  // Keep envelope headers compact: group labels include id, DMs only add id when it differs.
  if (params.isGroup) {
    var label =
      ((_a = params.groupLabel) === null || _a === void 0 ? void 0 : _a.trim()) ||
      params.groupFallback ||
      "Group";
    var id = (_b = params.groupId) === null || _b === void 0 ? void 0 : _b.trim();
    return id ? "".concat(label, " id:").concat(id) : label;
  }
  var directLabel = params.directLabel.trim();
  var directId = (_c = params.directId) === null || _c === void 0 ? void 0 : _c.trim();
  if (!directId || directId === directLabel) {
    return directLabel;
  }
  return "".concat(directLabel, " id:").concat(directId);
}
function formatThreadStarterEnvelope(params) {
  return formatAgentEnvelope({
    channel: params.channel,
    from: params.author,
    timestamp: params.timestamp,
    envelope: params.envelope,
    body: params.body,
  });
}
