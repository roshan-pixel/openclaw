"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMarkdownTables = convertMarkdownTables;
var ir_js_1 = require("./ir.js");
var render_js_1 = require("./render.js");
var MARKDOWN_STYLE_MARKERS = {
  bold: { open: "**", close: "**" },
  italic: { open: "_", close: "_" },
  strikethrough: { open: "~~", close: "~~" },
  code: { open: "`", close: "`" },
  code_block: { open: "```\n", close: "```" },
};
function convertMarkdownTables(markdown, mode) {
  if (!markdown || mode === "off") {
    return markdown;
  }
  var _a = (0, ir_js_1.markdownToIRWithMeta)(markdown, {
      linkify: false,
      autolink: false,
      headingStyle: "none",
      blockquotePrefix: "",
      tableMode: mode,
    }),
    ir = _a.ir,
    hasTables = _a.hasTables;
  if (!hasTables) {
    return markdown;
  }
  return (0, render_js_1.renderMarkdownWithMarkers)(ir, {
    styleMarkers: MARKDOWN_STYLE_MARKERS,
    escapeText: function (text) {
      return text;
    },
    buildLink: function (link, text) {
      var href = link.href.trim();
      if (!href) {
        return null;
      }
      var label = text.slice(link.start, link.end);
      if (!label) {
        return null;
      }
      return { start: link.start, end: link.end, open: "[", close: "](".concat(href, ")") };
    },
  });
}
