"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripReasoningTagsFromText = stripReasoningTagsFromText;
var QUICK_TAG_RE = /<\s*\/?\s*(?:think(?:ing)?|thought|antthinking|final)\b/i;
var FINAL_TAG_RE = /<\s*\/?\s*final\b[^<>]*>/gi;
var THINKING_TAG_RE = /<\s*(\/?)\s*(?:think(?:ing)?|thought|antthinking)\b[^<>]*>/gi;
function findCodeRegions(text) {
  var _a, _b;
  var regions = [];
  var fencedRe = /(^|\n)(```|~~~)[^\n]*\n[\s\S]*?(?:\n\2(?:\n|$)|$)/g;
  for (var _i = 0, _c = text.matchAll(fencedRe); _i < _c.length; _i++) {
    var match = _c[_i];
    var start = ((_a = match.index) !== null && _a !== void 0 ? _a : 0) + match[1].length;
    regions.push({ start: start, end: start + match[0].length - match[1].length });
  }
  var inlineRe = /`+[^`]+`+/g;
  var _loop_1 = function (match) {
    var start = (_b = match.index) !== null && _b !== void 0 ? _b : 0;
    var end = start + match[0].length;
    var insideFenced = regions.some(function (r) {
      return start >= r.start && end <= r.end;
    });
    if (!insideFenced) {
      regions.push({ start: start, end: end });
    }
  };
  for (var _d = 0, _e = text.matchAll(inlineRe); _d < _e.length; _d++) {
    var match = _e[_d];
    _loop_1(match);
  }
  regions.sort(function (a, b) {
    return a.start - b.start;
  });
  return regions;
}
function isInsideCode(pos, regions) {
  return regions.some(function (r) {
    return pos >= r.start && pos < r.end;
  });
}
function applyTrim(value, mode) {
  if (mode === "none") {
    return value;
  }
  if (mode === "start") {
    return value.trimStart();
  }
  return value.trim();
}
function stripReasoningTagsFromText(text, options) {
  var _a, _b, _c, _d;
  if (!text) {
    return text;
  }
  if (!QUICK_TAG_RE.test(text)) {
    return text;
  }
  var mode =
    (_a = options === null || options === void 0 ? void 0 : options.mode) !== null && _a !== void 0
      ? _a
      : "strict";
  var trimMode =
    (_b = options === null || options === void 0 ? void 0 : options.trim) !== null && _b !== void 0
      ? _b
      : "both";
  var cleaned = text;
  if (FINAL_TAG_RE.test(cleaned)) {
    FINAL_TAG_RE.lastIndex = 0;
    var finalMatches = [];
    var preCodeRegions = findCodeRegions(cleaned);
    for (var _i = 0, _e = cleaned.matchAll(FINAL_TAG_RE); _i < _e.length; _i++) {
      var match = _e[_i];
      var start = (_c = match.index) !== null && _c !== void 0 ? _c : 0;
      finalMatches.push({
        start: start,
        length: match[0].length,
        inCode: isInsideCode(start, preCodeRegions),
      });
    }
    for (var i = finalMatches.length - 1; i >= 0; i--) {
      var m = finalMatches[i];
      if (!m.inCode) {
        cleaned = cleaned.slice(0, m.start) + cleaned.slice(m.start + m.length);
      }
    }
  } else {
    FINAL_TAG_RE.lastIndex = 0;
  }
  var codeRegions = findCodeRegions(cleaned);
  THINKING_TAG_RE.lastIndex = 0;
  var result = "";
  var lastIndex = 0;
  var inThinking = false;
  for (var _f = 0, _g = cleaned.matchAll(THINKING_TAG_RE); _f < _g.length; _f++) {
    var match = _g[_f];
    var idx = (_d = match.index) !== null && _d !== void 0 ? _d : 0;
    var isClose = match[1] === "/";
    if (isInsideCode(idx, codeRegions)) {
      continue;
    }
    if (!inThinking) {
      result += cleaned.slice(lastIndex, idx);
      if (!isClose) {
        inThinking = true;
      }
    } else if (isClose) {
      inThinking = false;
    }
    lastIndex = idx + match[0].length;
  }
  if (!inThinking || mode === "preserve") {
    result += cleaned.slice(lastIndex);
  }
  return applyTrim(result, trimMode);
}
