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
exports.markdownToSignalText = markdownToSignalText;
exports.markdownToSignalTextChunks = markdownToSignalTextChunks;
var ir_js_1 = require("../markdown/ir.js");
function mapStyle(style) {
  switch (style) {
    case "bold":
      return "BOLD";
    case "italic":
      return "ITALIC";
    case "strikethrough":
      return "STRIKETHROUGH";
    case "code":
    case "code_block":
      return "MONOSPACE";
    case "spoiler":
      return "SPOILER";
    default:
      return null;
  }
}
function mergeStyles(styles) {
  var sorted = __spreadArray([], styles, true).toSorted(function (a, b) {
    if (a.start !== b.start) {
      return a.start - b.start;
    }
    if (a.length !== b.length) {
      return a.length - b.length;
    }
    return a.style.localeCompare(b.style);
  });
  var merged = [];
  for (var _i = 0, sorted_1 = sorted; _i < sorted_1.length; _i++) {
    var style = sorted_1[_i];
    var prev = merged[merged.length - 1];
    if (prev && prev.style === style.style && style.start <= prev.start + prev.length) {
      var prevEnd = prev.start + prev.length;
      var nextEnd = Math.max(prevEnd, style.start + style.length);
      prev.length = nextEnd - prev.start;
      continue;
    }
    merged.push(__assign({}, style));
  }
  return merged;
}
function clampStyles(styles, maxLength) {
  var clamped = [];
  for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
    var style = styles_1[_i];
    var start = Math.max(0, Math.min(style.start, maxLength));
    var end = Math.min(style.start + style.length, maxLength);
    var length_1 = end - start;
    if (length_1 > 0) {
      clamped.push({ start: start, length: length_1, style: style.style });
    }
  }
  return clamped;
}
function applyInsertionsToStyles(spans, insertions) {
  if (insertions.length === 0) {
    return spans;
  }
  var sortedInsertions = __spreadArray([], insertions, true).toSorted(function (a, b) {
    return a.pos - b.pos;
  });
  var updated = spans;
  for (var _i = 0, sortedInsertions_1 = sortedInsertions; _i < sortedInsertions_1.length; _i++) {
    var insertion = sortedInsertions_1[_i];
    var next = [];
    for (var _a = 0, updated_1 = updated; _a < updated_1.length; _a++) {
      var span = updated_1[_a];
      if (span.end <= insertion.pos) {
        next.push(span);
        continue;
      }
      if (span.start >= insertion.pos) {
        next.push({
          start: span.start + insertion.length,
          end: span.end + insertion.length,
          style: span.style,
        });
        continue;
      }
      if (span.start < insertion.pos && span.end > insertion.pos) {
        if (insertion.pos > span.start) {
          next.push({
            start: span.start,
            end: insertion.pos,
            style: span.style,
          });
        }
        var shiftedStart = insertion.pos + insertion.length;
        var shiftedEnd = span.end + insertion.length;
        if (shiftedEnd > shiftedStart) {
          next.push({
            start: shiftedStart,
            end: shiftedEnd,
            style: span.style,
          });
        }
      }
    }
    updated = next;
  }
  return updated;
}
function renderSignalText(ir) {
  var _a;
  var text = (_a = ir.text) !== null && _a !== void 0 ? _a : "";
  if (!text) {
    return { text: "", styles: [] };
  }
  var sortedLinks = __spreadArray([], ir.links, true).toSorted(function (a, b) {
    return a.start - b.start;
  });
  var out = "";
  var cursor = 0;
  var insertions = [];
  for (var _i = 0, sortedLinks_1 = sortedLinks; _i < sortedLinks_1.length; _i++) {
    var link = sortedLinks_1[_i];
    if (link.start < cursor) {
      continue;
    }
    out += text.slice(cursor, link.end);
    var href = link.href.trim();
    var label = text.slice(link.start, link.end);
    var trimmedLabel = label.trim();
    var comparableHref = href.startsWith("mailto:") ? href.slice("mailto:".length) : href;
    if (href) {
      if (!trimmedLabel) {
        out += href;
        insertions.push({ pos: link.end, length: href.length });
      } else if (trimmedLabel !== href && trimmedLabel !== comparableHref) {
        var addition = " (".concat(href, ")");
        out += addition;
        insertions.push({ pos: link.end, length: addition.length });
      }
    }
    cursor = link.end;
  }
  out += text.slice(cursor);
  var mappedStyles = ir.styles
    .map(function (span) {
      var mapped = mapStyle(span.style);
      if (!mapped) {
        return null;
      }
      return { start: span.start, end: span.end, style: mapped };
    })
    .filter(function (span) {
      return span !== null;
    });
  var adjusted = applyInsertionsToStyles(mappedStyles, insertions);
  var trimmedText = out.trimEnd();
  var trimmedLength = trimmedText.length;
  var clamped = clampStyles(
    adjusted.map(function (span) {
      return {
        start: span.start,
        length: span.end - span.start,
        style: span.style,
      };
    }),
    trimmedLength,
  );
  return {
    text: trimmedText,
    styles: mergeStyles(clamped),
  };
}
function markdownToSignalText(markdown, options) {
  if (options === void 0) {
    options = {};
  }
  var ir = (0, ir_js_1.markdownToIR)(markdown !== null && markdown !== void 0 ? markdown : "", {
    linkify: true,
    enableSpoilers: true,
    headingStyle: "none",
    blockquotePrefix: "",
    tableMode: options.tableMode,
  });
  return renderSignalText(ir);
}
function markdownToSignalTextChunks(markdown, limit, options) {
  if (options === void 0) {
    options = {};
  }
  var ir = (0, ir_js_1.markdownToIR)(markdown !== null && markdown !== void 0 ? markdown : "", {
    linkify: true,
    enableSpoilers: true,
    headingStyle: "none",
    blockquotePrefix: "",
    tableMode: options.tableMode,
  });
  var chunks = (0, ir_js_1.chunkMarkdownIR)(ir, limit);
  return chunks.map(function (chunk) {
    return renderSignalText(chunk);
  });
}
