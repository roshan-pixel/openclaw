"use strict";
// Utilities for splitting outbound text into platform-sized chunks without
// unintentionally breaking on newlines. Using [\s\S] keeps newlines inside
// the chunk so messages are only split when they truly exceed the limit.
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTextChunkLimit = resolveTextChunkLimit;
exports.resolveChunkMode = resolveChunkMode;
exports.chunkByNewline = chunkByNewline;
exports.chunkByParagraph = chunkByParagraph;
exports.chunkTextWithMode = chunkTextWithMode;
exports.chunkMarkdownTextWithMode = chunkMarkdownTextWithMode;
exports.chunkText = chunkText;
exports.chunkMarkdownText = chunkMarkdownText;
var fences_js_1 = require("../markdown/fences.js");
var session_key_js_1 = require("../routing/session-key.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var DEFAULT_CHUNK_LIMIT = 4000;
var DEFAULT_CHUNK_MODE = "length";
function resolveChunkLimitForProvider(cfgSection, accountId) {
  if (!cfgSection) {
    return undefined;
  }
  var normalizedAccountId = (0, session_key_js_1.normalizeAccountId)(accountId);
  var accounts = cfgSection.accounts;
  if (accounts && typeof accounts === "object") {
    var direct = accounts[normalizedAccountId];
    if (
      typeof (direct === null || direct === void 0 ? void 0 : direct.textChunkLimit) === "number"
    ) {
      return direct.textChunkLimit;
    }
    var matchKey = Object.keys(accounts).find(function (key) {
      return key.toLowerCase() === normalizedAccountId.toLowerCase();
    });
    var match = matchKey ? accounts[matchKey] : undefined;
    if (typeof (match === null || match === void 0 ? void 0 : match.textChunkLimit) === "number") {
      return match.textChunkLimit;
    }
  }
  return cfgSection.textChunkLimit;
}
function resolveTextChunkLimit(cfg, provider, accountId, opts) {
  var fallback =
    typeof (opts === null || opts === void 0 ? void 0 : opts.fallbackLimit) === "number" &&
    opts.fallbackLimit > 0
      ? opts.fallbackLimit
      : DEFAULT_CHUNK_LIMIT;
  var providerOverride = (function () {
    var _a;
    if (!provider || provider === message_channel_js_1.INTERNAL_MESSAGE_CHANNEL) {
      return undefined;
    }
    var channelsConfig = cfg === null || cfg === void 0 ? void 0 : cfg.channels;
    var providerConfig =
      (_a =
        channelsConfig === null || channelsConfig === void 0
          ? void 0
          : channelsConfig[provider]) !== null && _a !== void 0
        ? _a
        : cfg === null || cfg === void 0
          ? void 0
          : cfg[provider];
    return resolveChunkLimitForProvider(providerConfig, accountId);
  })();
  if (typeof providerOverride === "number" && providerOverride > 0) {
    return providerOverride;
  }
  return fallback;
}
function resolveChunkModeForProvider(cfgSection, accountId) {
  if (!cfgSection) {
    return undefined;
  }
  var normalizedAccountId = (0, session_key_js_1.normalizeAccountId)(accountId);
  var accounts = cfgSection.accounts;
  if (accounts && typeof accounts === "object") {
    var direct = accounts[normalizedAccountId];
    if (direct === null || direct === void 0 ? void 0 : direct.chunkMode) {
      return direct.chunkMode;
    }
    var matchKey = Object.keys(accounts).find(function (key) {
      return key.toLowerCase() === normalizedAccountId.toLowerCase();
    });
    var match = matchKey ? accounts[matchKey] : undefined;
    if (match === null || match === void 0 ? void 0 : match.chunkMode) {
      return match.chunkMode;
    }
  }
  return cfgSection.chunkMode;
}
function resolveChunkMode(cfg, provider, accountId) {
  var _a;
  if (!provider || provider === message_channel_js_1.INTERNAL_MESSAGE_CHANNEL) {
    return DEFAULT_CHUNK_MODE;
  }
  var channelsConfig = cfg === null || cfg === void 0 ? void 0 : cfg.channels;
  var providerConfig =
    (_a =
      channelsConfig === null || channelsConfig === void 0 ? void 0 : channelsConfig[provider]) !==
      null && _a !== void 0
      ? _a
      : cfg === null || cfg === void 0
        ? void 0
        : cfg[provider];
  var mode = resolveChunkModeForProvider(providerConfig, accountId);
  return mode !== null && mode !== void 0 ? mode : DEFAULT_CHUNK_MODE;
}
/**
 * Split text on newlines, trimming line whitespace.
 * Blank lines are folded into the next non-empty line as leading "\n" prefixes.
 * Long lines can be split by length (default) or kept intact via splitLongLines:false.
 */
function chunkByNewline(text, maxLineLength, opts) {
  if (!text) {
    return [];
  }
  if (maxLineLength <= 0) {
    return text.trim() ? [text] : [];
  }
  var splitLongLines = (opts === null || opts === void 0 ? void 0 : opts.splitLongLines) !== false;
  var trimLines = (opts === null || opts === void 0 ? void 0 : opts.trimLines) !== false;
  var lines = splitByNewline(text, opts === null || opts === void 0 ? void 0 : opts.isSafeBreak);
  var chunks = [];
  var pendingBlankLines = 0;
  for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
    var line = lines_1[_i];
    var trimmed = line.trim();
    if (!trimmed) {
      pendingBlankLines += 1;
      continue;
    }
    var maxPrefix = Math.max(0, maxLineLength - 1);
    var cappedBlankLines = pendingBlankLines > 0 ? Math.min(pendingBlankLines, maxPrefix) : 0;
    var prefix = cappedBlankLines > 0 ? "\n".repeat(cappedBlankLines) : "";
    pendingBlankLines = 0;
    var lineValue = trimLines ? trimmed : line;
    if (!splitLongLines || lineValue.length + prefix.length <= maxLineLength) {
      chunks.push(prefix + lineValue);
      continue;
    }
    var firstLimit = Math.max(1, maxLineLength - prefix.length);
    var first = lineValue.slice(0, firstLimit);
    chunks.push(prefix + first);
    var remaining = lineValue.slice(firstLimit);
    if (remaining) {
      chunks.push.apply(chunks, chunkText(remaining, maxLineLength));
    }
  }
  if (pendingBlankLines > 0 && chunks.length > 0) {
    chunks[chunks.length - 1] += "\n".repeat(pendingBlankLines);
  }
  return chunks;
}
/**
 * Split text into chunks on paragraph boundaries (blank lines), preserving lists and
 * single-newline line wraps inside paragraphs.
 *
 * - Only breaks at paragraph separators ("\n\n" or more, allowing whitespace on blank lines)
 * - Packs multiple paragraphs into a single chunk up to `limit`
 * - Falls back to length-based splitting when a single paragraph exceeds `limit`
 *   (unless `splitLongParagraphs` is disabled)
 */
function chunkByParagraph(text, limit, opts) {
  var _a;
  if (!text) {
    return [];
  }
  if (limit <= 0) {
    return [text];
  }
  var splitLongParagraphs =
    (opts === null || opts === void 0 ? void 0 : opts.splitLongParagraphs) !== false;
  // Normalize to \n so blank line detection is consistent.
  var normalized = text.replace(/\r\n?/g, "\n");
  // Fast-path: if there are no blank-line paragraph separators, do not split.
  // (We *do not* early-return based on `limit` — newline mode is about paragraph
  // boundaries, not only exceeding a length limit.)
  var paragraphRe = /\n[\t ]*\n+/;
  if (!paragraphRe.test(normalized)) {
    if (normalized.length <= limit) {
      return [normalized];
    }
    if (!splitLongParagraphs) {
      return [normalized];
    }
    return chunkText(normalized, limit);
  }
  var spans = (0, fences_js_1.parseFenceSpans)(normalized);
  var parts = [];
  var re = /\n[\t ]*\n+/g; // paragraph break: blank line(s), allowing whitespace
  var lastIndex = 0;
  for (var _i = 0, _b = normalized.matchAll(re); _i < _b.length; _i++) {
    var match = _b[_i];
    var idx = (_a = match.index) !== null && _a !== void 0 ? _a : 0;
    // Do not split on blank lines that occur inside fenced code blocks.
    if (!(0, fences_js_1.isSafeFenceBreak)(spans, idx)) {
      continue;
    }
    parts.push(normalized.slice(lastIndex, idx));
    lastIndex = idx + match[0].length;
  }
  parts.push(normalized.slice(lastIndex));
  var chunks = [];
  for (var _c = 0, parts_1 = parts; _c < parts_1.length; _c++) {
    var part = parts_1[_c];
    var paragraph = part.replace(/\s+$/g, "");
    if (!paragraph.trim()) {
      continue;
    }
    if (paragraph.length <= limit) {
      chunks.push(paragraph);
    } else if (!splitLongParagraphs) {
      chunks.push(paragraph);
    } else {
      chunks.push.apply(chunks, chunkText(paragraph, limit));
    }
  }
  return chunks;
}
/**
 * Unified chunking function that dispatches based on mode.
 */
function chunkTextWithMode(text, limit, mode) {
  if (mode === "newline") {
    return chunkByParagraph(text, limit);
  }
  return chunkText(text, limit);
}
function chunkMarkdownTextWithMode(text, limit, mode) {
  if (mode === "newline") {
    // Paragraph chunking is fence-safe because we never split at arbitrary indices.
    // If a paragraph must be split by length, defer to the markdown-aware chunker.
    var paragraphChunks = chunkByParagraph(text, limit, { splitLongParagraphs: false });
    var out = [];
    for (var _i = 0, paragraphChunks_1 = paragraphChunks; _i < paragraphChunks_1.length; _i++) {
      var chunk = paragraphChunks_1[_i];
      var nested = chunkMarkdownText(chunk, limit);
      if (!nested.length && chunk) {
        out.push(chunk);
      } else {
        out.push.apply(out, nested);
      }
    }
    return out;
  }
  return chunkMarkdownText(text, limit);
}
function splitByNewline(text, isSafeBreak) {
  if (isSafeBreak === void 0) {
    isSafeBreak = function () {
      return true;
    };
  }
  var lines = [];
  var start = 0;
  for (var i = 0; i < text.length; i++) {
    if (text[i] === "\n" && isSafeBreak(i)) {
      lines.push(text.slice(start, i));
      start = i + 1;
    }
  }
  lines.push(text.slice(start));
  return lines;
}
function chunkText(text, limit) {
  if (!text) {
    return [];
  }
  if (limit <= 0) {
    return [text];
  }
  if (text.length <= limit) {
    return [text];
  }
  var chunks = [];
  var remaining = text;
  while (remaining.length > limit) {
    var window_1 = remaining.slice(0, limit);
    // 1) Prefer a newline break inside the window (outside parentheses).
    var _a = scanParenAwareBreakpoints(window_1),
      lastNewline = _a.lastNewline,
      lastWhitespace = _a.lastWhitespace;
    // 2) Otherwise prefer the last whitespace (word boundary) inside the window.
    var breakIdx = lastNewline > 0 ? lastNewline : lastWhitespace;
    // 3) Fallback: hard break exactly at the limit.
    if (breakIdx <= 0) {
      breakIdx = limit;
    }
    var rawChunk = remaining.slice(0, breakIdx);
    var chunk = rawChunk.trimEnd();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
    // If we broke on whitespace/newline, skip that separator; for hard breaks keep it.
    var brokeOnSeparator = breakIdx < remaining.length && /\s/.test(remaining[breakIdx]);
    var nextStart = Math.min(remaining.length, breakIdx + (brokeOnSeparator ? 1 : 0));
    remaining = remaining.slice(nextStart).trimStart();
  }
  if (remaining.length) {
    chunks.push(remaining);
  }
  return chunks;
}
function chunkMarkdownText(text, limit) {
  if (!text) {
    return [];
  }
  if (limit <= 0) {
    return [text];
  }
  if (text.length <= limit) {
    return [text];
  }
  var chunks = [];
  var remaining = text;
  while (remaining.length > limit) {
    var spans = (0, fences_js_1.parseFenceSpans)(remaining);
    var window_2 = remaining.slice(0, limit);
    var softBreak = pickSafeBreakIndex(window_2, spans);
    var breakIdx = softBreak > 0 ? softBreak : limit;
    var initialFence = (0, fences_js_1.isSafeFenceBreak)(spans, breakIdx)
      ? undefined
      : (0, fences_js_1.findFenceSpanAt)(spans, breakIdx);
    var fenceToSplit = initialFence;
    if (initialFence) {
      var closeLine = "".concat(initialFence.indent).concat(initialFence.marker);
      var maxIdxIfNeedNewline = limit - (closeLine.length + 1);
      if (maxIdxIfNeedNewline <= 0) {
        fenceToSplit = undefined;
        breakIdx = limit;
      } else {
        var minProgressIdx = Math.min(
          remaining.length,
          initialFence.start + initialFence.openLine.length + 2,
        );
        var maxIdxIfAlreadyNewline = limit - closeLine.length;
        var pickedNewline = false;
        var lastNewline = remaining.lastIndexOf("\n", Math.max(0, maxIdxIfAlreadyNewline - 1));
        while (lastNewline !== -1) {
          var candidateBreak = lastNewline + 1;
          if (candidateBreak < minProgressIdx) {
            break;
          }
          var candidateFence = (0, fences_js_1.findFenceSpanAt)(spans, candidateBreak);
          if (candidateFence && candidateFence.start === initialFence.start) {
            breakIdx = Math.max(1, candidateBreak);
            pickedNewline = true;
            break;
          }
          lastNewline = remaining.lastIndexOf("\n", lastNewline - 1);
        }
        if (!pickedNewline) {
          if (minProgressIdx > maxIdxIfAlreadyNewline) {
            fenceToSplit = undefined;
            breakIdx = limit;
          } else {
            breakIdx = Math.max(minProgressIdx, maxIdxIfNeedNewline);
          }
        }
      }
      var fenceAtBreak = (0, fences_js_1.findFenceSpanAt)(spans, breakIdx);
      fenceToSplit =
        fenceAtBreak && fenceAtBreak.start === initialFence.start ? fenceAtBreak : undefined;
    }
    var rawChunk = remaining.slice(0, breakIdx);
    if (!rawChunk) {
      break;
    }
    var brokeOnSeparator = breakIdx < remaining.length && /\s/.test(remaining[breakIdx]);
    var nextStart = Math.min(remaining.length, breakIdx + (brokeOnSeparator ? 1 : 0));
    var next = remaining.slice(nextStart);
    if (fenceToSplit) {
      var closeLine = "".concat(fenceToSplit.indent).concat(fenceToSplit.marker);
      rawChunk = rawChunk.endsWith("\n")
        ? "".concat(rawChunk).concat(closeLine)
        : "".concat(rawChunk, "\n").concat(closeLine);
      next = "".concat(fenceToSplit.openLine, "\n").concat(next);
    } else {
      next = stripLeadingNewlines(next);
    }
    chunks.push(rawChunk);
    remaining = next;
  }
  if (remaining.length) {
    chunks.push(remaining);
  }
  return chunks;
}
function stripLeadingNewlines(value) {
  var i = 0;
  while (i < value.length && value[i] === "\n") {
    i++;
  }
  return i > 0 ? value.slice(i) : value;
}
function pickSafeBreakIndex(window, spans) {
  var _a = scanParenAwareBreakpoints(window, function (index) {
      return (0, fences_js_1.isSafeFenceBreak)(spans, index);
    }),
    lastNewline = _a.lastNewline,
    lastWhitespace = _a.lastWhitespace;
  if (lastNewline > 0) {
    return lastNewline;
  }
  if (lastWhitespace > 0) {
    return lastWhitespace;
  }
  return -1;
}
function scanParenAwareBreakpoints(window, isAllowed) {
  if (isAllowed === void 0) {
    isAllowed = function () {
      return true;
    };
  }
  var lastNewline = -1;
  var lastWhitespace = -1;
  var depth = 0;
  for (var i = 0; i < window.length; i++) {
    if (!isAllowed(i)) {
      continue;
    }
    var char = window[i];
    if (char === "(") {
      depth += 1;
      continue;
    }
    if (char === ")" && depth > 0) {
      depth -= 1;
      continue;
    }
    if (depth !== 0) {
      continue;
    }
    if (char === "\n") {
      lastNewline = i;
    } else if (/\s/.test(char)) {
      lastWhitespace = i;
    }
  }
  return { lastNewline: lastNewline, lastWhitespace: lastWhitespace };
}
