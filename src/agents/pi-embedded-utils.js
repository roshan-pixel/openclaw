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
exports.stripMinimaxToolCallXml = stripMinimaxToolCallXml;
exports.stripDowngradedToolCallText = stripDowngradedToolCallText;
exports.stripThinkingTagsFromText = stripThinkingTagsFromText;
exports.extractAssistantText = extractAssistantText;
exports.extractAssistantThinking = extractAssistantThinking;
exports.formatReasoningMessage = formatReasoningMessage;
exports.splitThinkingTaggedText = splitThinkingTaggedText;
exports.promoteThinkingTagsToBlocks = promoteThinkingTagsToBlocks;
exports.extractThinkingFromTaggedText = extractThinkingFromTaggedText;
exports.extractThinkingFromTaggedStream = extractThinkingFromTaggedStream;
exports.inferToolMetaFromArgs = inferToolMetaFromArgs;
var reasoning_tags_js_1 = require("../shared/text/reasoning-tags.js");
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
var tool_display_js_1 = require("./tool-display.js");
/**
 * Strip malformed Minimax tool invocations that leak into text content.
 * Minimax sometimes embeds tool calls as XML in text blocks instead of
 * proper structured tool calls. This removes:
 * - <invoke name="...">...</invoke> blocks
 * - </minimax:tool_call> closing tags
 */
function stripMinimaxToolCallXml(text) {
  if (!text) {
    return text;
  }
  if (!/minimax:tool_call/i.test(text)) {
    return text;
  }
  // Remove <invoke ...>...</invoke> blocks (non-greedy to handle multiple).
  var cleaned = text.replace(/<invoke\b[^>]*>[\s\S]*?<\/invoke>/gi, "");
  // Remove stray minimax tool tags.
  cleaned = cleaned.replace(/<\/?minimax:tool_call>/gi, "");
  return cleaned;
}
/**
 * Strip downgraded tool call text representations that leak into text content.
 * When replaying history to Gemini, tool calls without `thought_signature` are
 * downgraded to text blocks like `[Tool Call: name (ID: ...)]`. These should
 * not be shown to users.
 */
function stripDowngradedToolCallText(text) {
  if (!text) {
    return text;
  }
  if (!/\[Tool (?:Call|Result)/i.test(text)) {
    return text;
  }
  var consumeJsonish = function (input, start, options) {
    var _a = (options !== null && options !== void 0 ? options : {}).allowLeadingNewlines,
      allowLeadingNewlines = _a === void 0 ? false : _a;
    var index = start;
    while (index < input.length) {
      var ch = input[index];
      if (ch === " " || ch === "\t") {
        index += 1;
        continue;
      }
      if (allowLeadingNewlines && (ch === "\n" || ch === "\r")) {
        index += 1;
        continue;
      }
      break;
    }
    if (index >= input.length) {
      return null;
    }
    var startChar = input[index];
    if (startChar === "{" || startChar === "[") {
      var depth = 0;
      var inString = false;
      var escape_1 = false;
      for (var i = index; i < input.length; i += 1) {
        var ch = input[i];
        if (inString) {
          if (escape_1) {
            escape_1 = false;
          } else if (ch === "\\") {
            escape_1 = true;
          } else if (ch === '"') {
            inString = false;
          }
          continue;
        }
        if (ch === '"') {
          inString = true;
          continue;
        }
        if (ch === "{" || ch === "[") {
          depth += 1;
          continue;
        }
        if (ch === "}" || ch === "]") {
          depth -= 1;
          if (depth === 0) {
            return i + 1;
          }
        }
      }
      return null;
    }
    if (startChar === '"') {
      var escape_2 = false;
      for (var i = index + 1; i < input.length; i += 1) {
        var ch = input[i];
        if (escape_2) {
          escape_2 = false;
          continue;
        }
        if (ch === "\\") {
          escape_2 = true;
          continue;
        }
        if (ch === '"') {
          return i + 1;
        }
      }
      return null;
    }
    var end = index;
    while (end < input.length && input[end] !== "\n" && input[end] !== "\r") {
      end += 1;
    }
    return end;
  };
  var stripToolCalls = function (input) {
    var _a;
    var markerRe = /\[Tool Call:[^\]]*\]/gi;
    var result = "";
    var cursor = 0;
    for (var _i = 0, _b = input.matchAll(markerRe); _i < _b.length; _i++) {
      var match = _b[_i];
      var start = (_a = match.index) !== null && _a !== void 0 ? _a : 0;
      if (start < cursor) {
        continue;
      }
      result += input.slice(cursor, start);
      var index = start + match[0].length;
      while (index < input.length && (input[index] === " " || input[index] === "\t")) {
        index += 1;
      }
      if (input[index] === "\r") {
        index += 1;
        if (input[index] === "\n") {
          index += 1;
        }
      } else if (input[index] === "\n") {
        index += 1;
      }
      while (index < input.length && (input[index] === " " || input[index] === "\t")) {
        index += 1;
      }
      if (input.slice(index, index + 9).toLowerCase() === "arguments") {
        index += 9;
        if (input[index] === ":") {
          index += 1;
        }
        if (input[index] === " ") {
          index += 1;
        }
        var end = consumeJsonish(input, index, { allowLeadingNewlines: true });
        if (end !== null) {
          index = end;
        }
      }
      if (
        (input[index] === "\n" || input[index] === "\r") &&
        (result.endsWith("\n") || result.endsWith("\r") || result.length === 0)
      ) {
        if (input[index] === "\r") {
          index += 1;
        }
        if (input[index] === "\n") {
          index += 1;
        }
      }
      cursor = index;
    }
    result += input.slice(cursor);
    return result;
  };
  // Remove [Tool Call: name (ID: ...)] blocks and their Arguments.
  var cleaned = stripToolCalls(text);
  // Remove [Tool Result for ID ...] blocks and their content.
  cleaned = cleaned.replace(/\[Tool Result for ID[^\]]*\]\n?[\s\S]*?(?=\n*\[Tool |\n*$)/gi, "");
  return cleaned.trim();
}
/**
 * Strip thinking tags and their content from text.
 * This is a safety net for cases where the model outputs <think> tags
 * that slip through other filtering mechanisms.
 */
function stripThinkingTagsFromText(text) {
  return (0, reasoning_tags_js_1.stripReasoningTagsFromText)(text, {
    mode: "strict",
    trim: "both",
  });
}
function extractAssistantText(msg) {
  var isTextBlock = function (block) {
    if (!block || typeof block !== "object") {
      return false;
    }
    var rec = block;
    return rec.type === "text" && typeof rec.text === "string";
  };
  var blocks = Array.isArray(msg.content)
    ? msg.content
        .filter(isTextBlock)
        .map(function (c) {
          return stripThinkingTagsFromText(
            stripDowngradedToolCallText(stripMinimaxToolCallXml(c.text)),
          ).trim();
        })
        .filter(Boolean)
    : [];
  var extracted = blocks.join("\n").trim();
  return (0, pi_embedded_helpers_js_1.sanitizeUserFacingText)(extracted);
}
function extractAssistantThinking(msg) {
  if (!Array.isArray(msg.content)) {
    return "";
  }
  var blocks = msg.content
    .map(function (block) {
      if (!block || typeof block !== "object") {
        return "";
      }
      var record = block;
      if (record.type === "thinking" && typeof record.thinking === "string") {
        return record.thinking.trim();
      }
      return "";
    })
    .filter(Boolean);
  return blocks.join("\n").trim();
}
function formatReasoningMessage(text) {
  var trimmed = text.trim();
  if (!trimmed) {
    return "";
  }
  // Show reasoning in italics (cursive) for markdown-friendly surfaces (Discord, etc.).
  // Keep the plain "Reasoning:" prefix so existing parsing/detection keeps working.
  // Note: Underscore markdown cannot span multiple lines on Telegram, so we wrap
  // each non-empty line separately.
  var italicLines = trimmed
    .split("\n")
    .map(function (line) {
      return line ? "_".concat(line, "_") : line;
    })
    .join("\n");
  return "Reasoning:\n".concat(italicLines);
}
function splitThinkingTaggedText(text) {
  var _a, _b;
  var trimmedStart = text.trimStart();
  // Avoid false positives: only treat it as structured thinking when it begins
  // with a think tag (common for local/OpenAI-compat providers that emulate
  // reasoning blocks via tags).
  if (!trimmedStart.startsWith("<")) {
    return null;
  }
  var openRe = /<\s*(?:think(?:ing)?|thought|antthinking)\s*>/i;
  var closeRe = /<\s*\/\s*(?:think(?:ing)?|thought|antthinking)\s*>/i;
  if (!openRe.test(trimmedStart)) {
    return null;
  }
  if (!closeRe.test(text)) {
    return null;
  }
  var scanRe = /<\s*(\/?)\s*(?:think(?:ing)?|thought|antthinking)\s*>/gi;
  var inThinking = false;
  var cursor = 0;
  var thinkingStart = 0;
  var blocks = [];
  var pushText = function (value) {
    if (!value) {
      return;
    }
    blocks.push({ type: "text", text: value });
  };
  var pushThinking = function (value) {
    var cleaned = value.trim();
    if (!cleaned) {
      return;
    }
    blocks.push({ type: "thinking", thinking: cleaned });
  };
  for (var _i = 0, _c = text.matchAll(scanRe); _i < _c.length; _i++) {
    var match = _c[_i];
    var index = (_a = match.index) !== null && _a !== void 0 ? _a : 0;
    var isClose = Boolean((_b = match[1]) === null || _b === void 0 ? void 0 : _b.includes("/"));
    if (!inThinking && !isClose) {
      pushText(text.slice(cursor, index));
      thinkingStart = index + match[0].length;
      inThinking = true;
      continue;
    }
    if (inThinking && isClose) {
      pushThinking(text.slice(thinkingStart, index));
      cursor = index + match[0].length;
      inThinking = false;
    }
  }
  if (inThinking) {
    return null;
  }
  pushText(text.slice(cursor));
  var hasThinking = blocks.some(function (b) {
    return b.type === "thinking";
  });
  if (!hasThinking) {
    return null;
  }
  return blocks;
}
function promoteThinkingTagsToBlocks(message) {
  if (!Array.isArray(message.content)) {
    return;
  }
  var hasThinkingBlock = message.content.some(function (block) {
    return block.type === "thinking";
  });
  if (hasThinkingBlock) {
    return;
  }
  var next = [];
  var changed = false;
  for (var _i = 0, _a = message.content; _i < _a.length; _i++) {
    var block = _a[_i];
    if (block.type !== "text") {
      next.push(block);
      continue;
    }
    var split = splitThinkingTaggedText(block.text);
    if (!split) {
      next.push(block);
      continue;
    }
    changed = true;
    for (var _b = 0, split_1 = split; _b < split_1.length; _b++) {
      var part = split_1[_b];
      if (part.type === "thinking") {
        next.push({ type: "thinking", thinking: part.thinking });
      } else if (part.type === "text") {
        var cleaned = part.text.trimStart();
        if (cleaned) {
          next.push({ type: "text", text: cleaned });
        }
      }
    }
  }
  if (!changed) {
    return;
  }
  message.content = next;
}
function extractThinkingFromTaggedText(text) {
  var _a;
  if (!text) {
    return "";
  }
  var scanRe = /<\s*(\/?)\s*(?:think(?:ing)?|thought|antthinking)\s*>/gi;
  var result = "";
  var lastIndex = 0;
  var inThinking = false;
  for (var _i = 0, _b = text.matchAll(scanRe); _i < _b.length; _i++) {
    var match = _b[_i];
    var idx = (_a = match.index) !== null && _a !== void 0 ? _a : 0;
    if (inThinking) {
      result += text.slice(lastIndex, idx);
    }
    var isClose = match[1] === "/";
    inThinking = !isClose;
    lastIndex = idx + match[0].length;
  }
  return result.trim();
}
function extractThinkingFromTaggedStream(text) {
  var _a, _b, _c;
  if (!text) {
    return "";
  }
  var closed = extractThinkingFromTaggedText(text);
  if (closed) {
    return closed;
  }
  var openRe = /<\s*(?:think(?:ing)?|thought|antthinking)\s*>/gi;
  var closeRe = /<\s*\/\s*(?:think(?:ing)?|thought|antthinking)\s*>/gi;
  var openMatches = __spreadArray([], text.matchAll(openRe), true);
  if (openMatches.length === 0) {
    return "";
  }
  var closeMatches = __spreadArray([], text.matchAll(closeRe), true);
  var lastOpen = openMatches[openMatches.length - 1];
  var lastClose = closeMatches[closeMatches.length - 1];
  if (
    lastClose &&
    ((_a = lastClose.index) !== null && _a !== void 0 ? _a : -1) >
      ((_b = lastOpen.index) !== null && _b !== void 0 ? _b : -1)
  ) {
    return closed;
  }
  var start = ((_c = lastOpen.index) !== null && _c !== void 0 ? _c : 0) + lastOpen[0].length;
  return text.slice(start).trim();
}
function inferToolMetaFromArgs(toolName, args) {
  var display = (0, tool_display_js_1.resolveToolDisplay)({ name: toolName, args: args });
  return (0, tool_display_js_1.formatToolDetail)(display);
}
