"use strict";
// Shared helpers for parsing MEDIA tokens from command/stdout text.
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
exports.MEDIA_TOKEN_RE = void 0;
exports.normalizeMediaSource = normalizeMediaSource;
exports.splitMediaFromOutput = splitMediaFromOutput;
var fences_js_1 = require("../markdown/fences.js");
var audio_tags_js_1 = require("./audio-tags.js");
// Allow optional wrapping backticks and punctuation after the token; capture the core token.
exports.MEDIA_TOKEN_RE = /\bMEDIA:\s*`?([^\n]+)`?/gi;
function normalizeMediaSource(src) {
  return src.startsWith("file://") ? src.replace("file://", "") : src;
}
function cleanCandidate(raw) {
  return raw.replace(/^[`"'[{(]+/, "").replace(/[`"'\\})\],]+$/, "");
}
function isValidMedia(candidate, opts) {
  if (!candidate) {
    return false;
  }
  if (candidate.length > 4096) {
    return false;
  }
  if (!(opts === null || opts === void 0 ? void 0 : opts.allowSpaces) && /\s/.test(candidate)) {
    return false;
  }
  if (/^https?:\/\//i.test(candidate)) {
    return true;
  }
  if (candidate.startsWith("/")) {
    return true;
  }
  if (candidate.startsWith("./")) {
    return true;
  }
  if (candidate.startsWith("../")) {
    return true;
  }
  if (candidate.startsWith("~")) {
    return true;
  }
  return false;
}
function unwrapQuoted(value) {
  var trimmed = value.trim();
  if (trimmed.length < 2) {
    return undefined;
  }
  var first = trimmed[0];
  var last = trimmed[trimmed.length - 1];
  if (first !== last) {
    return undefined;
  }
  if (first !== '"' && first !== "'" && first !== "`") {
    return undefined;
  }
  return trimmed.slice(1, -1).trim();
}
// Check if a character offset is inside any fenced code block
function isInsideFence(fenceSpans, offset) {
  return fenceSpans.some(function (span) {
    return offset >= span.start && offset < span.end;
  });
}
function splitMediaFromOutput(raw) {
  var _a;
  // KNOWN: Leading whitespace is semantically meaningful in Markdown (lists, indented fences).
  // We only trim the end; token cleanup below handles removing `MEDIA:` lines.
  var trimmedRaw = raw.trimEnd();
  if (!trimmedRaw.trim()) {
    return { text: "" };
  }
  var media = [];
  var foundMediaToken = false;
  // Parse fenced code blocks to avoid extracting MEDIA tokens from inside them
  var fenceSpans = (0, fences_js_1.parseFenceSpans)(trimmedRaw);
  // Collect tokens line by line so we can strip them cleanly.
  var lines = trimmedRaw.split("\n");
  var keptLines = [];
  var lineOffset = 0; // Track character offset for fence checking
  for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
    var line = lines_1[_i];
    // Skip MEDIA extraction if this line is inside a fenced code block
    if (isInsideFence(fenceSpans, lineOffset)) {
      keptLines.push(line);
      lineOffset += line.length + 1; // +1 for newline
      continue;
    }
    var trimmedStart = line.trimStart();
    if (!trimmedStart.startsWith("MEDIA:")) {
      keptLines.push(line);
      lineOffset += line.length + 1; // +1 for newline
      continue;
    }
    var matches = Array.from(line.matchAll(exports.MEDIA_TOKEN_RE));
    if (matches.length === 0) {
      keptLines.push(line);
      lineOffset += line.length + 1; // +1 for newline
      continue;
    }
    foundMediaToken = true;
    var pieces = [];
    var cursor = 0;
    var hasValidMedia = false;
    for (var _b = 0, matches_1 = matches; _b < matches_1.length; _b++) {
      var match = matches_1[_b];
      var start = (_a = match.index) !== null && _a !== void 0 ? _a : 0;
      pieces.push(line.slice(cursor, start));
      var payload = match[1];
      var unwrapped = unwrapQuoted(payload);
      var payloadValue = unwrapped !== null && unwrapped !== void 0 ? unwrapped : payload;
      var parts = unwrapped ? [unwrapped] : payload.split(/\s+/).filter(Boolean);
      var mediaStartIndex = media.length;
      var validCount = 0;
      var invalidParts = [];
      for (var _c = 0, parts_1 = parts; _c < parts_1.length; _c++) {
        var part = parts_1[_c];
        var candidate = normalizeMediaSource(cleanCandidate(part));
        if (isValidMedia(candidate, unwrapped ? { allowSpaces: true } : undefined)) {
          media.push(candidate);
          hasValidMedia = true;
          validCount += 1;
        } else {
          invalidParts.push(part);
        }
      }
      var trimmedPayload = payloadValue.trim();
      var looksLikeLocalPath =
        trimmedPayload.startsWith("/") ||
        trimmedPayload.startsWith("./") ||
        trimmedPayload.startsWith("../") ||
        trimmedPayload.startsWith("~") ||
        trimmedPayload.startsWith("file://");
      if (
        !unwrapped &&
        validCount === 1 &&
        invalidParts.length > 0 &&
        /\s/.test(payloadValue) &&
        looksLikeLocalPath
      ) {
        var fallback = normalizeMediaSource(cleanCandidate(payloadValue));
        if (isValidMedia(fallback, { allowSpaces: true })) {
          media.splice(mediaStartIndex, media.length - mediaStartIndex, fallback);
          hasValidMedia = true;
          validCount = 1;
          invalidParts.length = 0;
        }
      }
      if (!hasValidMedia) {
        var fallback = normalizeMediaSource(cleanCandidate(payloadValue));
        if (isValidMedia(fallback, { allowSpaces: true })) {
          media.push(fallback);
          hasValidMedia = true;
          invalidParts.length = 0;
        }
      }
      if (hasValidMedia && invalidParts.length > 0) {
        pieces.push(invalidParts.join(" "));
      }
      cursor = start + match[0].length;
    }
    pieces.push(line.slice(cursor));
    var cleanedLine = pieces
      .join("")
      .replace(/[ \t]{2,}/g, " ")
      .trim();
    // If the line becomes empty, drop it.
    if (cleanedLine) {
      keptLines.push(cleanedLine);
    }
    lineOffset += line.length + 1; // +1 for newline
  }
  var cleanedText = keptLines
    .join("\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
  // Detect and strip [[audio_as_voice]] tag
  var audioTagResult = (0, audio_tags_js_1.parseAudioTag)(cleanedText);
  var hasAudioAsVoice = audioTagResult.audioAsVoice;
  if (audioTagResult.hadTag) {
    cleanedText = audioTagResult.text.replace(/\n{2,}/g, "\n").trim();
  }
  if (media.length === 0) {
    var result = {
      // Return cleaned text if we found a media token OR audio tag, otherwise original
      text: foundMediaToken || hasAudioAsVoice ? cleanedText : trimmedRaw,
    };
    if (hasAudioAsVoice) {
      result.audioAsVoice = true;
    }
    return result;
  }
  return __assign(
    { text: cleanedText, mediaUrls: media, mediaUrl: media[0] },
    hasAudioAsVoice ? { audioAsVoice: true } : {},
  );
}
