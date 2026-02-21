"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToSlackMrkdwn = markdownToSlackMrkdwn;
exports.markdownToSlackMrkdwnChunks = markdownToSlackMrkdwnChunks;
var ir_js_1 = require("../markdown/ir.js");
var render_js_1 = require("../markdown/render.js");
// Escape special characters for Slack mrkdwn format.
// Preserve Slack's angle-bracket tokens so mentions and links stay intact.
function escapeSlackMrkdwnSegment(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var SLACK_ANGLE_TOKEN_RE = /<[^>\n]+>/g;
function isAllowedSlackAngleToken(token) {
  if (!token.startsWith("<") || !token.endsWith(">")) {
    return false;
  }
  var inner = token.slice(1, -1);
  return (
    inner.startsWith("@") ||
    inner.startsWith("#") ||
    inner.startsWith("!") ||
    inner.startsWith("mailto:") ||
    inner.startsWith("tel:") ||
    inner.startsWith("http://") ||
    inner.startsWith("https://") ||
    inner.startsWith("slack://")
  );
}
function escapeSlackMrkdwnContent(text) {
  var _a, _b;
  if (!text.includes("&") && !text.includes("<") && !text.includes(">")) {
    return text;
  }
  SLACK_ANGLE_TOKEN_RE.lastIndex = 0;
  var out = [];
  var lastIndex = 0;
  for (
    var match = SLACK_ANGLE_TOKEN_RE.exec(text);
    match;
    match = SLACK_ANGLE_TOKEN_RE.exec(text)
  ) {
    var matchIndex = (_a = match.index) !== null && _a !== void 0 ? _a : 0;
    out.push(escapeSlackMrkdwnSegment(text.slice(lastIndex, matchIndex)));
    var token = (_b = match[0]) !== null && _b !== void 0 ? _b : "";
    out.push(isAllowedSlackAngleToken(token) ? token : escapeSlackMrkdwnSegment(token));
    lastIndex = matchIndex + token.length;
  }
  out.push(escapeSlackMrkdwnSegment(text.slice(lastIndex)));
  return out.join("");
}
function escapeSlackMrkdwnText(text) {
  if (!text.includes("&") && !text.includes("<") && !text.includes(">")) {
    return text;
  }
  return text
    .split("\n")
    .map(function (line) {
      if (line.startsWith("> ")) {
        return "> ".concat(escapeSlackMrkdwnContent(line.slice(2)));
      }
      return escapeSlackMrkdwnContent(line);
    })
    .join("\n");
}
function buildSlackLink(link, text) {
  var href = link.href.trim();
  if (!href) {
    return null;
  }
  var label = text.slice(link.start, link.end);
  var trimmedLabel = label.trim();
  var comparableHref = href.startsWith("mailto:") ? href.slice("mailto:".length) : href;
  var useMarkup =
    trimmedLabel.length > 0 && trimmedLabel !== href && trimmedLabel !== comparableHref;
  if (!useMarkup) {
    return null;
  }
  var safeHref = escapeSlackMrkdwnSegment(href);
  return {
    start: link.start,
    end: link.end,
    open: "<".concat(safeHref, "|"),
    close: ">",
  };
}
function markdownToSlackMrkdwn(markdown, options) {
  if (options === void 0) {
    options = {};
  }
  var ir = (0, ir_js_1.markdownToIR)(markdown !== null && markdown !== void 0 ? markdown : "", {
    linkify: false,
    autolink: false,
    headingStyle: "bold",
    blockquotePrefix: "> ",
    tableMode: options.tableMode,
  });
  return (0, render_js_1.renderMarkdownWithMarkers)(ir, {
    styleMarkers: {
      bold: { open: "*", close: "*" },
      italic: { open: "_", close: "_" },
      strikethrough: { open: "~", close: "~" },
      code: { open: "`", close: "`" },
      code_block: { open: "```\n", close: "```" },
    },
    escapeText: escapeSlackMrkdwnText,
    buildLink: buildSlackLink,
  });
}
function markdownToSlackMrkdwnChunks(markdown, limit, options) {
  if (options === void 0) {
    options = {};
  }
  var ir = (0, ir_js_1.markdownToIR)(markdown !== null && markdown !== void 0 ? markdown : "", {
    linkify: false,
    autolink: false,
    headingStyle: "bold",
    blockquotePrefix: "> ",
    tableMode: options.tableMode,
  });
  var chunks = (0, ir_js_1.chunkMarkdownIR)(ir, limit);
  return chunks.map(function (chunk) {
    return (0, render_js_1.renderMarkdownWithMarkers)(chunk, {
      styleMarkers: {
        bold: { open: "*", close: "*" },
        italic: { open: "_", close: "_" },
        strikethrough: { open: "~", close: "~" },
        code: { open: "`", close: "`" },
        code_block: { open: "```\n", close: "```" },
      },
      escapeText: escapeSlackMrkdwnText,
      buildLink: buildSlackLink,
    });
  });
}
