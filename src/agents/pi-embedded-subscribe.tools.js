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
exports.sanitizeToolResult = sanitizeToolResult;
exports.extractToolResultText = extractToolResultText;
exports.isToolResultError = isToolResultError;
exports.extractToolErrorMessage = extractToolErrorMessage;
exports.extractMessagingToolSend = extractMessagingToolSend;
var index_js_1 = require("../channels/plugins/index.js");
var utils_js_1 = require("../utils.js");
var target_normalization_js_1 = require("../infra/outbound/target-normalization.js");
var TOOL_RESULT_MAX_CHARS = 8000;
var TOOL_ERROR_MAX_CHARS = 400;
function truncateToolText(text) {
  if (text.length <= TOOL_RESULT_MAX_CHARS) {
    return text;
  }
  return "".concat(
    (0, utils_js_1.truncateUtf16Safe)(text, TOOL_RESULT_MAX_CHARS),
    "\n\u2026(truncated)\u2026",
  );
}
function normalizeToolErrorText(text) {
  var _a, _b;
  var trimmed = text.trim();
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
  return firstLine.length > TOOL_ERROR_MAX_CHARS
    ? "".concat((0, utils_js_1.truncateUtf16Safe)(firstLine, TOOL_ERROR_MAX_CHARS), "\u2026")
    : firstLine;
}
function readErrorCandidate(value) {
  if (typeof value === "string") {
    return normalizeToolErrorText(value);
  }
  if (!value || typeof value !== "object") {
    return undefined;
  }
  var record = value;
  if (typeof record.message === "string") {
    return normalizeToolErrorText(record.message);
  }
  if (typeof record.error === "string") {
    return normalizeToolErrorText(record.error);
  }
  return undefined;
}
function extractErrorField(value) {
  var _a, _b;
  if (!value || typeof value !== "object") {
    return undefined;
  }
  var record = value;
  var direct =
    (_b =
      (_a = readErrorCandidate(record.error)) !== null && _a !== void 0
        ? _a
        : readErrorCandidate(record.message)) !== null && _b !== void 0
      ? _b
      : readErrorCandidate(record.reason);
  if (direct) {
    return direct;
  }
  var status = typeof record.status === "string" ? record.status.trim() : "";
  return status ? normalizeToolErrorText(status) : undefined;
}
function sanitizeToolResult(result) {
  if (!result || typeof result !== "object") {
    return result;
  }
  var record = result;
  var content = Array.isArray(record.content) ? record.content : null;
  if (!content) {
    return record;
  }
  var sanitized = content.map(function (item) {
    if (!item || typeof item !== "object") {
      return item;
    }
    var entry = item;
    var type = typeof entry.type === "string" ? entry.type : undefined;
    if (type === "text" && typeof entry.text === "string") {
      return __assign(__assign({}, entry), { text: truncateToolText(entry.text) });
    }
    if (type === "image") {
      var data = typeof entry.data === "string" ? entry.data : undefined;
      var bytes = data ? data.length : undefined;
      var cleaned = __assign({}, entry);
      delete cleaned.data;
      return __assign(__assign({}, cleaned), { bytes: bytes, omitted: true });
    }
    return entry;
  });
  return __assign(__assign({}, record), { content: sanitized });
}
function extractToolResultText(result) {
  if (!result || typeof result !== "object") {
    return undefined;
  }
  var record = result;
  var content = Array.isArray(record.content) ? record.content : null;
  if (!content) {
    return undefined;
  }
  var texts = content
    .map(function (item) {
      if (!item || typeof item !== "object") {
        return undefined;
      }
      var entry = item;
      if (entry.type !== "text" || typeof entry.text !== "string") {
        return undefined;
      }
      var trimmed = entry.text.trim();
      return trimmed ? trimmed : undefined;
    })
    .filter(function (value) {
      return Boolean(value);
    });
  if (texts.length === 0) {
    return undefined;
  }
  return texts.join("\n");
}
function isToolResultError(result) {
  if (!result || typeof result !== "object") {
    return false;
  }
  var record = result;
  var details = record.details;
  if (!details || typeof details !== "object") {
    return false;
  }
  var status = details.status;
  if (typeof status !== "string") {
    return false;
  }
  var normalized = status.trim().toLowerCase();
  return normalized === "error" || normalized === "timeout";
}
function extractToolErrorMessage(result) {
  if (!result || typeof result !== "object") {
    return undefined;
  }
  var record = result;
  var fromDetails = extractErrorField(record.details);
  if (fromDetails) {
    return fromDetails;
  }
  var fromRoot = extractErrorField(record);
  if (fromRoot) {
    return fromRoot;
  }
  var text = extractToolResultText(result);
  if (!text) {
    return undefined;
  }
  try {
    var parsed = JSON.parse(text);
    var fromJson = extractErrorField(parsed);
    if (fromJson) {
      return fromJson;
    }
  } catch (_a) {
    // Fall through to first-line text fallback.
  }
  return normalizeToolErrorText(text);
}
function extractMessagingToolSend(toolName, args) {
  var _a, _b, _c;
  // Provider docking: new provider tools must implement plugin.actions.extractToolSend.
  var action = typeof args.action === "string" ? args.action.trim() : "";
  var accountIdRaw = typeof args.accountId === "string" ? args.accountId.trim() : undefined;
  var accountId = accountIdRaw ? accountIdRaw : undefined;
  if (toolName === "message") {
    if (action !== "send" && action !== "thread-reply") {
      return undefined;
    }
    var toRaw = typeof args.to === "string" ? args.to : undefined;
    if (!toRaw) {
      return undefined;
    }
    var providerRaw = typeof args.provider === "string" ? args.provider.trim() : "";
    var channelRaw = typeof args.channel === "string" ? args.channel.trim() : "";
    var providerHint = providerRaw || channelRaw;
    var providerId_1 = providerHint ? (0, index_js_1.normalizeChannelId)(providerHint) : null;
    var provider =
      providerId_1 !== null && providerId_1 !== void 0
        ? providerId_1
        : providerHint
          ? providerHint.toLowerCase()
          : "message";
    var to_1 = (0, target_normalization_js_1.normalizeTargetForProvider)(provider, toRaw);
    return to_1
      ? { tool: toolName, provider: provider, accountId: accountId, to: to_1 }
      : undefined;
  }
  var providerId = (0, index_js_1.normalizeChannelId)(toolName);
  if (!providerId) {
    return undefined;
  }
  var plugin = (0, index_js_1.getChannelPlugin)(providerId);
  var extracted =
    (_b =
      (_a = plugin === null || plugin === void 0 ? void 0 : plugin.actions) === null ||
      _a === void 0
        ? void 0
        : _a.extractToolSend) === null || _b === void 0
      ? void 0
      : _b.call(_a, { args: args });
  if (!(extracted === null || extracted === void 0 ? void 0 : extracted.to)) {
    return undefined;
  }
  var to = (0, target_normalization_js_1.normalizeTargetForProvider)(providerId, extracted.to);
  return to
    ? {
        tool: toolName,
        provider: providerId,
        accountId: (_c = extracted.accountId) !== null && _c !== void 0 ? _c : accountId,
        to: to,
      }
    : undefined;
}
