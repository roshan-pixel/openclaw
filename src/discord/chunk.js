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
exports.chunkDiscordText = chunkDiscordText;
exports.chunkDiscordTextWithMode = chunkDiscordTextWithMode;
var chunk_js_1 = require("../auto-reply/chunk.js");
var DEFAULT_MAX_CHARS = 2000;
var DEFAULT_MAX_LINES = 17;
var FENCE_RE = /^( {0,3})(`{3,}|~{3,})(.*)$/;
function countLines(text) {
  if (!text) {
    return 0;
  }
  return text.split("\n").length;
}
function parseFenceLine(line) {
  var _a, _b, _c;
  var match = line.match(FENCE_RE);
  if (!match) {
    return null;
  }
  var indent = (_a = match[1]) !== null && _a !== void 0 ? _a : "";
  var marker = (_b = match[2]) !== null && _b !== void 0 ? _b : "";
  return {
    indent: indent,
    markerChar: (_c = marker[0]) !== null && _c !== void 0 ? _c : "`",
    markerLen: marker.length,
    openLine: line,
  };
}
function closeFenceLine(openFence) {
  return "".concat(openFence.indent).concat(openFence.markerChar.repeat(openFence.markerLen));
}
function closeFenceIfNeeded(text, openFence) {
  if (!openFence) {
    return text;
  }
  var closeLine = closeFenceLine(openFence);
  if (!text) {
    return closeLine;
  }
  if (!text.endsWith("\n")) {
    return "".concat(text, "\n").concat(closeLine);
  }
  return "".concat(text).concat(closeLine);
}
function splitLongLine(line, maxChars, opts) {
  var limit = Math.max(1, Math.floor(maxChars));
  if (line.length <= limit) {
    return [line];
  }
  var out = [];
  var remaining = line;
  while (remaining.length > limit) {
    if (opts.preserveWhitespace) {
      out.push(remaining.slice(0, limit));
      remaining = remaining.slice(limit);
      continue;
    }
    var window_1 = remaining.slice(0, limit);
    var breakIdx = -1;
    for (var i = window_1.length - 1; i >= 0; i--) {
      if (/\s/.test(window_1[i])) {
        breakIdx = i;
        break;
      }
    }
    if (breakIdx <= 0) {
      breakIdx = limit;
    }
    out.push(remaining.slice(0, breakIdx));
    // Keep the separator for the next segment so words don't get glued together.
    remaining = remaining.slice(breakIdx);
  }
  if (remaining.length) {
    out.push(remaining);
  }
  return out;
}
/**
 * Chunks outbound Discord text by both character count and (soft) line count,
 * while keeping fenced code blocks balanced across chunks.
 */
function chunkDiscordText(text, opts) {
  var _a, _b;
  if (opts === void 0) {
    opts = {};
  }
  var maxChars = Math.max(
    1,
    Math.floor((_a = opts.maxChars) !== null && _a !== void 0 ? _a : DEFAULT_MAX_CHARS),
  );
  var maxLines = Math.max(
    1,
    Math.floor((_b = opts.maxLines) !== null && _b !== void 0 ? _b : DEFAULT_MAX_LINES),
  );
  var body = text !== null && text !== void 0 ? text : "";
  if (!body) {
    return [];
  }
  var alreadyOk = body.length <= maxChars && countLines(body) <= maxLines;
  if (alreadyOk) {
    return [body];
  }
  var lines = body.split("\n");
  var chunks = [];
  var current = "";
  var currentLines = 0;
  var openFence = null;
  var flush = function () {
    if (!current) {
      return;
    }
    var payload = closeFenceIfNeeded(current, openFence);
    if (payload.trim().length) {
      chunks.push(payload);
    }
    current = "";
    currentLines = 0;
    if (openFence) {
      current = openFence.openLine;
      currentLines = 1;
    }
  };
  for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
    var originalLine = lines_1[_i];
    var fenceInfo = parseFenceLine(originalLine);
    var wasInsideFence = openFence !== null;
    var nextOpenFence = openFence;
    if (fenceInfo) {
      if (!openFence) {
        nextOpenFence = fenceInfo;
      } else if (
        openFence.markerChar === fenceInfo.markerChar &&
        fenceInfo.markerLen >= openFence.markerLen
      ) {
        nextOpenFence = null;
      }
    }
    var reserveChars = nextOpenFence ? closeFenceLine(nextOpenFence).length + 1 : 0;
    var reserveLines = nextOpenFence ? 1 : 0;
    var effectiveMaxChars = maxChars - reserveChars;
    var effectiveMaxLines = maxLines - reserveLines;
    var charLimit = effectiveMaxChars > 0 ? effectiveMaxChars : maxChars;
    var lineLimit = effectiveMaxLines > 0 ? effectiveMaxLines : maxLines;
    var prefixLen = current.length > 0 ? current.length + 1 : 0;
    var segmentLimit = Math.max(1, charLimit - prefixLen);
    var segments = splitLongLine(originalLine, segmentLimit, {
      preserveWhitespace: wasInsideFence,
    });
    for (var segIndex = 0; segIndex < segments.length; segIndex++) {
      var segment = segments[segIndex];
      var isLineContinuation = segIndex > 0;
      var delimiter = isLineContinuation ? "" : current.length > 0 ? "\n" : "";
      var addition = "".concat(delimiter).concat(segment);
      var nextLen = current.length + addition.length;
      var nextLines = currentLines + (isLineContinuation ? 0 : 1);
      var wouldExceedChars = nextLen > charLimit;
      var wouldExceedLines = nextLines > lineLimit;
      if ((wouldExceedChars || wouldExceedLines) && current.length > 0) {
        flush();
      }
      if (current.length > 0) {
        current += addition;
        if (!isLineContinuation) {
          currentLines += 1;
        }
      } else {
        current = segment;
        currentLines = 1;
      }
    }
    openFence = nextOpenFence;
  }
  if (current.length) {
    var payload = closeFenceIfNeeded(current, openFence);
    if (payload.trim().length) {
      chunks.push(payload);
    }
  }
  return rebalanceReasoningItalics(text, chunks);
}
function chunkDiscordTextWithMode(text, opts) {
  var _a, _b;
  var chunkMode = (_a = opts.chunkMode) !== null && _a !== void 0 ? _a : "length";
  if (chunkMode !== "newline") {
    return chunkDiscordText(text, opts);
  }
  var lineChunks = (0, chunk_js_1.chunkMarkdownTextWithMode)(
    text,
    Math.max(
      1,
      Math.floor((_b = opts.maxChars) !== null && _b !== void 0 ? _b : DEFAULT_MAX_CHARS),
    ),
    "newline",
  );
  var chunks = [];
  for (var _i = 0, lineChunks_1 = lineChunks; _i < lineChunks_1.length; _i++) {
    var line = lineChunks_1[_i];
    var nested = chunkDiscordText(line, opts);
    if (!nested.length && line) {
      chunks.push(line);
      continue;
    }
    chunks.push.apply(chunks, nested);
  }
  return chunks;
}
// Keep italics intact for reasoning payloads that are wrapped once with `_…_`.
// When Discord chunking splits the message, we close italics at the end of
// each chunk and reopen at the start of the next so every chunk renders
// consistently.
function rebalanceReasoningItalics(source, chunks) {
  if (chunks.length <= 1) {
    return chunks;
  }
  var opensWithReasoningItalics =
    source.startsWith("Reasoning:\n_") && source.trimEnd().endsWith("_");
  if (!opensWithReasoningItalics) {
    return chunks;
  }
  var adjusted = __spreadArray([], chunks, true);
  for (var i = 0; i < adjusted.length; i++) {
    var isLast = i === adjusted.length - 1;
    var current = adjusted[i];
    // Ensure current chunk closes italics so Discord renders it italicized.
    var needsClosing = !current.trimEnd().endsWith("_");
    if (needsClosing) {
      adjusted[i] = "".concat(current, "_");
    }
    if (isLast) {
      break;
    }
    // Re-open italics on the next chunk if needed.
    var next = adjusted[i + 1];
    var leadingWhitespaceLen = next.length - next.trimStart().length;
    var leadingWhitespace = next.slice(0, leadingWhitespaceLen);
    var nextBody = next.slice(leadingWhitespaceLen);
    if (!nextBody.startsWith("_")) {
      adjusted[i + 1] = "".concat(leadingWhitespace, "_").concat(nextBody);
    }
  }
  return adjusted;
}
