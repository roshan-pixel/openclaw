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
exports.renderMarkdownWithMarkers = renderMarkdownWithMarkers;
var STYLE_ORDER = ["code_block", "code", "bold", "italic", "strikethrough", "spoiler"];
var STYLE_RANK = new Map(
  STYLE_ORDER.map(function (style, index) {
    return [style, index];
  }),
);
function sortStyleSpans(spans) {
  return __spreadArray([], spans, true).toSorted(function (a, b) {
    var _a, _b;
    if (a.start !== b.start) {
      return a.start - b.start;
    }
    if (a.end !== b.end) {
      return b.end - a.end;
    }
    return (
      ((_a = STYLE_RANK.get(a.style)) !== null && _a !== void 0 ? _a : 0) -
      ((_b = STYLE_RANK.get(b.style)) !== null && _b !== void 0 ? _b : 0)
    );
  });
}
function renderMarkdownWithMarkers(ir, options) {
  var _a, _b;
  var text = (_a = ir.text) !== null && _a !== void 0 ? _a : "";
  if (!text) {
    return "";
  }
  var styleMarkers = options.styleMarkers;
  var styled = sortStyleSpans(
    ir.styles.filter(function (span) {
      return Boolean(styleMarkers[span.style]);
    }),
  );
  var boundaries = new Set();
  boundaries.add(0);
  boundaries.add(text.length);
  var startsAt = new Map();
  for (var _i = 0, styled_1 = styled; _i < styled_1.length; _i++) {
    var span = styled_1[_i];
    if (span.start === span.end) {
      continue;
    }
    boundaries.add(span.start);
    boundaries.add(span.end);
    var bucket = startsAt.get(span.start);
    if (bucket) {
      bucket.push(span);
    } else {
      startsAt.set(span.start, [span]);
    }
  }
  for (var _c = 0, _d = startsAt.values(); _c < _d.length; _c++) {
    var spans = _d[_c];
    spans.sort(function (a, b) {
      var _a, _b;
      if (a.end !== b.end) {
        return b.end - a.end;
      }
      return (
        ((_a = STYLE_RANK.get(a.style)) !== null && _a !== void 0 ? _a : 0) -
        ((_b = STYLE_RANK.get(b.style)) !== null && _b !== void 0 ? _b : 0)
      );
    });
  }
  var linkStarts = new Map();
  if (options.buildLink) {
    for (var _e = 0, _f = ir.links; _e < _f.length; _e++) {
      var link = _f[_e];
      if (link.start === link.end) {
        continue;
      }
      var rendered = options.buildLink(link, text);
      if (!rendered) {
        continue;
      }
      boundaries.add(rendered.start);
      boundaries.add(rendered.end);
      var openBucket = linkStarts.get(rendered.start);
      if (openBucket) {
        openBucket.push(rendered);
      } else {
        linkStarts.set(rendered.start, [rendered]);
      }
    }
  }
  var points = __spreadArray([], boundaries, true).toSorted(function (a, b) {
    return a - b;
  });
  // Unified stack for both styles and links, tracking close string and end position
  var stack = [];
  var out = "";
  for (var i = 0; i < points.length; i += 1) {
    var pos = points[i];
    // Close ALL elements (styles and links) in LIFO order at this position
    while (
      stack.length &&
      ((_b = stack[stack.length - 1]) === null || _b === void 0 ? void 0 : _b.end) === pos
    ) {
      var item = stack.pop();
      if (item) {
        out += item.close;
      }
    }
    var openingItems = [];
    var openingLinks = linkStarts.get(pos);
    if (openingLinks && openingLinks.length > 0) {
      for (var _g = 0, _h = openingLinks.entries(); _g < _h.length; _g++) {
        var _j = _h[_g],
          index = _j[0],
          link = _j[1];
        openingItems.push({
          end: link.end,
          open: link.open,
          close: link.close,
          kind: "link",
          index: index,
        });
      }
    }
    var openingStyles = startsAt.get(pos);
    if (openingStyles) {
      for (var _k = 0, _l = openingStyles.entries(); _k < _l.length; _k++) {
        var _m = _l[_k],
          index = _m[0],
          span = _m[1];
        var marker = styleMarkers[span.style];
        if (!marker) {
          continue;
        }
        openingItems.push({
          end: span.end,
          open: marker.open,
          close: marker.close,
          kind: "style",
          style: span.style,
          index: index,
        });
      }
    }
    if (openingItems.length > 0) {
      openingItems.sort(function (a, b) {
        var _a, _b;
        if (a.end !== b.end) {
          return b.end - a.end;
        }
        if (a.kind !== b.kind) {
          return a.kind === "link" ? -1 : 1;
        }
        if (a.kind === "style" && b.kind === "style") {
          return (
            ((_a = STYLE_RANK.get(a.style)) !== null && _a !== void 0 ? _a : 0) -
            ((_b = STYLE_RANK.get(b.style)) !== null && _b !== void 0 ? _b : 0)
          );
        }
        return a.index - b.index;
      });
      // Open outer spans first (larger end) so LIFO closes stay valid for same-start overlaps.
      for (var _o = 0, openingItems_1 = openingItems; _o < openingItems_1.length; _o++) {
        var item = openingItems_1[_o];
        out += item.open;
        stack.push({ close: item.close, end: item.end });
      }
    }
    var next = points[i + 1];
    if (next === undefined) {
      break;
    }
    if (next > pos) {
      out += options.escapeText(text.slice(pos, next));
    }
  }
  return out;
}
