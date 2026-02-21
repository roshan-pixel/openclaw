"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveToolDisplay = resolveToolDisplay;
exports.formatToolDetail = formatToolDetail;
exports.formatToolSummary = formatToolSummary;
var redact_js_1 = require("../logging/redact.js");
var utils_js_1 = require("../utils.js");
var tool_display_json_1 = require("./tool-display.json");
var TOOL_DISPLAY_CONFIG = tool_display_json_1.default;
var FALLBACK = (_a = TOOL_DISPLAY_CONFIG.fallback) !== null && _a !== void 0 ? _a : { emoji: "🧩" };
var TOOL_MAP = (_b = TOOL_DISPLAY_CONFIG.tools) !== null && _b !== void 0 ? _b : {};
var DETAIL_LABEL_OVERRIDES = {
  agentId: "agent",
  sessionKey: "session",
  targetId: "target",
  targetUrl: "url",
  nodeId: "node",
  requestId: "request",
  messageId: "message",
  threadId: "thread",
  channelId: "channel",
  guildId: "guild",
  userId: "user",
  runTimeoutSeconds: "timeout",
  timeoutSeconds: "timeout",
  includeTools: "tools",
  pollQuestion: "poll",
  maxChars: "max chars",
};
var MAX_DETAIL_ENTRIES = 8;
function normalizeToolName(name) {
  return (name !== null && name !== void 0 ? name : "tool").trim();
}
function defaultTitle(name) {
  var cleaned = name.replace(/_/g, " ").trim();
  if (!cleaned) {
    return "Tool";
  }
  return cleaned
    .split(/\s+/)
    .map(function (part) {
      var _a, _b;
      return part.length <= 2 && part.toUpperCase() === part
        ? part
        : ""
            .concat(
              (_b = (_a = part.at(0)) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !==
                null && _b !== void 0
                ? _b
                : "",
            )
            .concat(part.slice(1));
    })
    .join(" ");
}
function normalizeVerb(value) {
  var trimmed = value === null || value === void 0 ? void 0 : value.trim();
  if (!trimmed) {
    return undefined;
  }
  return trimmed.replace(/_/g, " ");
}
function coerceDisplayValue(value) {
  var _a, _b;
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === "string") {
    var trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }
    var firstLine =
      (_b = (_a = trimmed.split(/\r?\n/)[0]) === null || _a === void 0 ? void 0 : _a.trim()) !==
        null && _b !== void 0
        ? _b
        : "";
    if (!firstLine) {
      return undefined;
    }
    return firstLine.length > 160 ? "".concat(firstLine.slice(0, 157), "\u2026") : firstLine;
  }
  if (typeof value === "boolean") {
    return value ? "true" : undefined;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value === 0) {
      return undefined;
    }
    return String(value);
  }
  if (Array.isArray(value)) {
    var values = value
      .map(function (item) {
        return coerceDisplayValue(item);
      })
      .filter(function (item) {
        return Boolean(item);
      });
    if (values.length === 0) {
      return undefined;
    }
    var preview = values.slice(0, 3).join(", ");
    return values.length > 3 ? "".concat(preview, "\u2026") : preview;
  }
  return undefined;
}
function lookupValueByPath(args, path) {
  if (!args || typeof args !== "object") {
    return undefined;
  }
  var current = args;
  for (var _i = 0, _a = path.split("."); _i < _a.length; _i++) {
    var segment = _a[_i];
    if (!segment) {
      return undefined;
    }
    if (!current || typeof current !== "object") {
      return undefined;
    }
    var record = current;
    current = record[segment];
  }
  return current;
}
function formatDetailKey(raw) {
  var _a;
  var segments = raw.split(".").filter(Boolean);
  var last = (_a = segments.at(-1)) !== null && _a !== void 0 ? _a : raw;
  var override = DETAIL_LABEL_OVERRIDES[last];
  if (override) {
    return override;
  }
  var cleaned = last.replace(/_/g, " ").replace(/-/g, " ");
  var spaced = cleaned.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return spaced.trim().toLowerCase() || last.toLowerCase();
}
function resolveDetailFromKeys(args, keys) {
  var entries = [];
  for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
    var key = keys_1[_i];
    var value = lookupValueByPath(args, key);
    var display = coerceDisplayValue(value);
    if (!display) {
      continue;
    }
    entries.push({ label: formatDetailKey(key), value: display });
  }
  if (entries.length === 0) {
    return undefined;
  }
  if (entries.length === 1) {
    return entries[0].value;
  }
  var seen = new Set();
  var unique = [];
  for (var _a = 0, entries_1 = entries; _a < entries_1.length; _a++) {
    var entry = entries_1[_a];
    var token = "".concat(entry.label, ":").concat(entry.value);
    if (seen.has(token)) {
      continue;
    }
    seen.add(token);
    unique.push(entry);
  }
  if (unique.length === 0) {
    return undefined;
  }
  return unique
    .slice(0, MAX_DETAIL_ENTRIES)
    .map(function (entry) {
      return "".concat(entry.label, " ").concat(entry.value);
    })
    .join(" · ");
}
function resolveReadDetail(args) {
  if (!args || typeof args !== "object") {
    return undefined;
  }
  var record = args;
  var path = typeof record.path === "string" ? record.path : undefined;
  if (!path) {
    return undefined;
  }
  var offset = typeof record.offset === "number" ? record.offset : undefined;
  var limit = typeof record.limit === "number" ? record.limit : undefined;
  if (offset !== undefined && limit !== undefined) {
    return ""
      .concat(path, ":")
      .concat(offset, "-")
      .concat(offset + limit);
  }
  return path;
}
function resolveWriteDetail(args) {
  if (!args || typeof args !== "object") {
    return undefined;
  }
  var record = args;
  var path = typeof record.path === "string" ? record.path : undefined;
  return path;
}
function resolveActionSpec(spec, action) {
  var _a, _b;
  if (!spec || !action) {
    return undefined;
  }
  return (_b = (_a = spec.actions) === null || _a === void 0 ? void 0 : _a[action]) !== null &&
    _b !== void 0
    ? _b
    : undefined;
}
function resolveToolDisplay(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  var name = normalizeToolName(params.name);
  var key = name.toLowerCase();
  var spec = TOOL_MAP[key];
  var emoji =
    (_b =
      (_a = spec === null || spec === void 0 ? void 0 : spec.emoji) !== null && _a !== void 0
        ? _a
        : FALLBACK.emoji) !== null && _b !== void 0
      ? _b
      : "🧩";
  var title =
    (_c = spec === null || spec === void 0 ? void 0 : spec.title) !== null && _c !== void 0
      ? _c
      : defaultTitle(name);
  var label =
    (_d = spec === null || spec === void 0 ? void 0 : spec.label) !== null && _d !== void 0
      ? _d
      : title;
  var actionRaw = params.args && typeof params.args === "object" ? params.args.action : undefined;
  var action = typeof actionRaw === "string" ? actionRaw.trim() : undefined;
  var actionSpec = resolveActionSpec(spec, action);
  var verb = normalizeVerb(
    (_e = actionSpec === null || actionSpec === void 0 ? void 0 : actionSpec.label) !== null &&
      _e !== void 0
      ? _e
      : action,
  );
  var detail;
  if (key === "read") {
    detail = resolveReadDetail(params.args);
  }
  if (!detail && (key === "write" || key === "edit" || key === "attach")) {
    detail = resolveWriteDetail(params.args);
  }
  var detailKeys =
    (_h =
      (_g =
        (_f = actionSpec === null || actionSpec === void 0 ? void 0 : actionSpec.detailKeys) !==
          null && _f !== void 0
          ? _f
          : spec === null || spec === void 0
            ? void 0
            : spec.detailKeys) !== null && _g !== void 0
        ? _g
        : FALLBACK.detailKeys) !== null && _h !== void 0
      ? _h
      : [];
  if (!detail && detailKeys.length > 0) {
    detail = resolveDetailFromKeys(params.args, detailKeys);
  }
  if (!detail && params.meta) {
    detail = params.meta;
  }
  if (detail) {
    detail = (0, utils_js_1.shortenHomeInString)(detail);
  }
  return {
    name: name,
    emoji: emoji,
    title: title,
    label: label,
    verb: verb,
    detail: detail,
  };
}
function formatToolDetail(display) {
  var parts = [];
  if (display.verb) {
    parts.push(display.verb);
  }
  if (display.detail) {
    parts.push((0, redact_js_1.redactToolDetail)(display.detail));
  }
  if (parts.length === 0) {
    return undefined;
  }
  return parts.join(" · ");
}
function formatToolSummary(display) {
  var detail = formatToolDetail(display);
  return detail
    ? "".concat(display.emoji, " ").concat(display.label, ": ").concat(detail)
    : "".concat(display.emoji, " ").concat(display.label);
}
