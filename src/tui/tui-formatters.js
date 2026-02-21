"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveFinalAssistantText = resolveFinalAssistantText;
exports.composeThinkingAndContent = composeThinkingAndContent;
exports.extractThinkingFromMessage = extractThinkingFromMessage;
exports.extractContentFromMessage = extractContentFromMessage;
exports.extractTextFromMessage = extractTextFromMessage;
exports.isCommandMessage = isCommandMessage;
exports.formatTokens = formatTokens;
exports.formatContextUsageLine = formatContextUsageLine;
exports.asString = asString;
var usage_format_js_1 = require("../utils/usage-format.js");
var pi_embedded_helpers_js_1 = require("../agents/pi-embedded-helpers.js");
function resolveFinalAssistantText(params) {
  var _a, _b;
  var finalText = (_a = params.finalText) !== null && _a !== void 0 ? _a : "";
  if (finalText.trim()) {
    return finalText;
  }
  var streamedText = (_b = params.streamedText) !== null && _b !== void 0 ? _b : "";
  if (streamedText.trim()) {
    return streamedText;
  }
  return "(no output)";
}
function composeThinkingAndContent(params) {
  var _a, _b, _c, _d;
  var thinkingText =
    (_b = (_a = params.thinkingText) === null || _a === void 0 ? void 0 : _a.trim()) !== null &&
    _b !== void 0
      ? _b
      : "";
  var contentText =
    (_d = (_c = params.contentText) === null || _c === void 0 ? void 0 : _c.trim()) !== null &&
    _d !== void 0
      ? _d
      : "";
  var parts = [];
  if (params.showThinking && thinkingText) {
    parts.push("[thinking]\n".concat(thinkingText));
  }
  if (contentText) {
    parts.push(contentText);
  }
  return parts.join("\n\n").trim();
}
/**
 * Extract ONLY thinking blocks from message content.
 * Model-agnostic: returns empty string if no thinking blocks exist.
 */
function extractThinkingFromMessage(message) {
  if (!message || typeof message !== "object") {
    return "";
  }
  var record = message;
  var content = record.content;
  if (typeof content === "string") {
    return "";
  }
  if (!Array.isArray(content)) {
    return "";
  }
  var parts = [];
  for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
    var block = content_1[_i];
    if (!block || typeof block !== "object") {
      continue;
    }
    var rec = block;
    if (rec.type === "thinking" && typeof rec.thinking === "string") {
      parts.push(rec.thinking);
    }
  }
  return parts.join("\n").trim();
}
/**
 * Extract ONLY text content blocks from message (excludes thinking).
 * Model-agnostic: works for any model with text content blocks.
 */
function extractContentFromMessage(message) {
  if (!message || typeof message !== "object") {
    return "";
  }
  var record = message;
  var content = record.content;
  if (typeof content === "string") {
    return content.trim();
  }
  // Check for error BEFORE returning empty for non-array content
  if (!Array.isArray(content)) {
    var stopReason = typeof record.stopReason === "string" ? record.stopReason : "";
    if (stopReason === "error") {
      var errorMessage = typeof record.errorMessage === "string" ? record.errorMessage : "";
      return (0, pi_embedded_helpers_js_1.formatRawAssistantErrorForUi)(errorMessage);
    }
    return "";
  }
  var parts = [];
  for (var _i = 0, content_2 = content; _i < content_2.length; _i++) {
    var block = content_2[_i];
    if (!block || typeof block !== "object") {
      continue;
    }
    var rec = block;
    if (rec.type === "text" && typeof rec.text === "string") {
      parts.push(rec.text);
    }
  }
  // If no text blocks found, check for error
  if (parts.length === 0) {
    var stopReason = typeof record.stopReason === "string" ? record.stopReason : "";
    if (stopReason === "error") {
      var errorMessage = typeof record.errorMessage === "string" ? record.errorMessage : "";
      return (0, pi_embedded_helpers_js_1.formatRawAssistantErrorForUi)(errorMessage);
    }
  }
  return parts.join("\n").trim();
}
function extractTextBlocks(content, opts) {
  var _a;
  if (typeof content === "string") {
    return content.trim();
  }
  if (!Array.isArray(content)) {
    return "";
  }
  var thinkingParts = [];
  var textParts = [];
  for (var _i = 0, content_3 = content; _i < content_3.length; _i++) {
    var block = content_3[_i];
    if (!block || typeof block !== "object") {
      continue;
    }
    var record = block;
    if (record.type === "text" && typeof record.text === "string") {
      textParts.push(record.text);
    }
    if (
      (opts === null || opts === void 0 ? void 0 : opts.includeThinking) &&
      record.type === "thinking" &&
      typeof record.thinking === "string"
    ) {
      thinkingParts.push(record.thinking);
    }
  }
  return composeThinkingAndContent({
    thinkingText: thinkingParts.join("\n").trim(),
    contentText: textParts.join("\n").trim(),
    showThinking:
      (_a = opts === null || opts === void 0 ? void 0 : opts.includeThinking) !== null &&
      _a !== void 0
        ? _a
        : false,
  });
}
function extractTextFromMessage(message, opts) {
  if (!message || typeof message !== "object") {
    return "";
  }
  var record = message;
  var text = extractTextBlocks(record.content, opts);
  if (text) {
    return text;
  }
  var stopReason = typeof record.stopReason === "string" ? record.stopReason : "";
  if (stopReason !== "error") {
    return "";
  }
  var errorMessage = typeof record.errorMessage === "string" ? record.errorMessage : "";
  return (0, pi_embedded_helpers_js_1.formatRawAssistantErrorForUi)(errorMessage);
}
function isCommandMessage(message) {
  if (!message || typeof message !== "object") {
    return false;
  }
  return message.command === true;
}
function formatTokens(total, context) {
  if (total == null && context == null) {
    return "tokens ?";
  }
  var totalLabel = total == null ? "?" : (0, usage_format_js_1.formatTokenCount)(total);
  if (context == null) {
    return "tokens ".concat(totalLabel);
  }
  var pct =
    typeof total === "number" && context > 0
      ? Math.min(999, Math.round((total / context) * 100))
      : null;
  return "tokens "
    .concat(totalLabel, "/")
    .concat((0, usage_format_js_1.formatTokenCount)(context))
    .concat(pct !== null ? " (".concat(pct, "%)") : "");
}
function formatContextUsageLine(params) {
  var totalLabel =
    typeof params.total === "number" ? (0, usage_format_js_1.formatTokenCount)(params.total) : "?";
  var ctxLabel =
    typeof params.context === "number"
      ? (0, usage_format_js_1.formatTokenCount)(params.context)
      : "?";
  var pct = typeof params.percent === "number" ? Math.min(999, Math.round(params.percent)) : null;
  var remainingLabel =
    typeof params.remaining === "number"
      ? "".concat((0, usage_format_js_1.formatTokenCount)(params.remaining), " left")
      : null;
  var pctLabel = pct !== null ? "".concat(pct, "%") : null;
  var extra = [remainingLabel, pctLabel].filter(Boolean).join(", ");
  return "tokens "
    .concat(totalLabel, "/")
    .concat(ctxLabel)
    .concat(extra ? " (".concat(extra, ")") : "");
}
function asString(value, fallback) {
  if (fallback === void 0) {
    fallback = "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
}
