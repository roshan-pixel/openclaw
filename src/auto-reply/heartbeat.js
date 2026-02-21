"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_HEARTBEAT_ACK_MAX_CHARS =
  exports.DEFAULT_HEARTBEAT_EVERY =
  exports.HEARTBEAT_PROMPT =
    void 0;
exports.isHeartbeatContentEffectivelyEmpty = isHeartbeatContentEffectivelyEmpty;
exports.resolveHeartbeatPrompt = resolveHeartbeatPrompt;
exports.stripHeartbeatToken = stripHeartbeatToken;
var tokens_js_1 = require("./tokens.js");
// Default heartbeat prompt (used when config.agents.defaults.heartbeat.prompt is unset).
// Keep it tight and avoid encouraging the model to invent/rehash "open loops" from prior chat context.
exports.HEARTBEAT_PROMPT =
  "Read HEARTBEAT.md if it exists (workspace context). Follow it strictly. Do not infer or repeat old tasks from prior chats. If nothing needs attention, reply HEARTBEAT_OK.";
exports.DEFAULT_HEARTBEAT_EVERY = "30m";
exports.DEFAULT_HEARTBEAT_ACK_MAX_CHARS = 300;
/**
 * Check if HEARTBEAT.md content is "effectively empty" - meaning it has no actionable tasks.
 * This allows skipping heartbeat API calls when no tasks are configured.
 *
 * A file is considered effectively empty if it contains only:
 * - Whitespace
 * - Comment lines (lines starting with #)
 * - Empty lines
 *
 * Note: A missing file returns false (not effectively empty) so the LLM can still
 * decide what to do. This function is only for when the file exists but has no content.
 */
function isHeartbeatContentEffectivelyEmpty(content) {
  if (content === undefined || content === null) {
    return false;
  }
  if (typeof content !== "string") {
    return false;
  }
  var lines = content.split("\n");
  for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
    var line = lines_1[_i];
    var trimmed = line.trim();
    // Skip empty lines
    if (!trimmed) {
      continue;
    }
    // Skip markdown header lines (# followed by space or EOL, ## etc)
    // This intentionally does NOT skip lines like "#TODO" or "#hashtag" which might be content
    // (Those aren't valid markdown headers - ATX headers require space after #)
    if (/^#+(\s|$)/.test(trimmed)) {
      continue;
    }
    // Skip empty markdown list items like "- [ ]" or "* [ ]" or just "- "
    if (/^[-*+]\s*(\[[\sXx]?\]\s*)?$/.test(trimmed)) {
      continue;
    }
    // Found a non-empty, non-comment line - there's actionable content
    return false;
  }
  // All lines were either empty or comments
  return true;
}
function resolveHeartbeatPrompt(raw) {
  var trimmed = typeof raw === "string" ? raw.trim() : "";
  return trimmed || exports.HEARTBEAT_PROMPT;
}
function stripTokenAtEdges(raw) {
  var text = raw.trim();
  if (!text) {
    return { text: "", didStrip: false };
  }
  var token = tokens_js_1.HEARTBEAT_TOKEN;
  if (!text.includes(token)) {
    return { text: text, didStrip: false };
  }
  var didStrip = false;
  var changed = true;
  while (changed) {
    changed = false;
    var next = text.trim();
    if (next.startsWith(token)) {
      var after = next.slice(token.length).trimStart();
      text = after;
      didStrip = true;
      changed = true;
      continue;
    }
    if (next.endsWith(token)) {
      var before = next.slice(0, Math.max(0, next.length - token.length));
      text = before.trimEnd();
      didStrip = true;
      changed = true;
    }
  }
  var collapsed = text.replace(/\s+/g, " ").trim();
  return { text: collapsed, didStrip: didStrip };
}
function stripHeartbeatToken(raw, opts) {
  var _a;
  if (opts === void 0) {
    opts = {};
  }
  if (!raw) {
    return { shouldSkip: true, text: "", didStrip: false };
  }
  var trimmed = raw.trim();
  if (!trimmed) {
    return { shouldSkip: true, text: "", didStrip: false };
  }
  var mode = (_a = opts.mode) !== null && _a !== void 0 ? _a : "message";
  var maxAckCharsRaw = opts.maxAckChars;
  var parsedAckChars = typeof maxAckCharsRaw === "string" ? Number(maxAckCharsRaw) : maxAckCharsRaw;
  var maxAckChars = Math.max(
    0,
    typeof parsedAckChars === "number" && Number.isFinite(parsedAckChars)
      ? parsedAckChars
      : exports.DEFAULT_HEARTBEAT_ACK_MAX_CHARS,
  );
  // Normalize lightweight markup so HEARTBEAT_OK wrapped in HTML/Markdown
  // (e.g., <b>HEARTBEAT_OK</b> or **HEARTBEAT_OK**) still strips.
  var stripMarkup = function (text) {
    return (
      text
        // Drop HTML tags.
        .replace(/<[^>]*>/g, " ")
        // Decode common nbsp variant.
        .replace(/&nbsp;/gi, " ")
        // Remove markdown-ish wrappers at the edges.
        .replace(/^[*`~_]+/, "")
        .replace(/[*`~_]+$/, "")
    );
  };
  var trimmedNormalized = stripMarkup(trimmed);
  var hasToken =
    trimmed.includes(tokens_js_1.HEARTBEAT_TOKEN) ||
    trimmedNormalized.includes(tokens_js_1.HEARTBEAT_TOKEN);
  if (!hasToken) {
    return { shouldSkip: false, text: trimmed, didStrip: false };
  }
  var strippedOriginal = stripTokenAtEdges(trimmed);
  var strippedNormalized = stripTokenAtEdges(trimmedNormalized);
  var picked =
    strippedOriginal.didStrip && strippedOriginal.text ? strippedOriginal : strippedNormalized;
  if (!picked.didStrip) {
    return { shouldSkip: false, text: trimmed, didStrip: false };
  }
  if (!picked.text) {
    return { shouldSkip: true, text: "", didStrip: true };
  }
  var rest = picked.text.trim();
  if (mode === "heartbeat") {
    if (rest.length <= maxAckChars) {
      return { shouldSkip: true, text: "", didStrip: true };
    }
  }
  return { shouldSkip: false, text: rest, didStrip: true };
}
