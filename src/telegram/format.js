"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToTelegramHtml = markdownToTelegramHtml;
exports.renderTelegramHtmlText = renderTelegramHtmlText;
exports.markdownToTelegramChunks = markdownToTelegramChunks;
exports.markdownToTelegramHtmlChunks = markdownToTelegramHtmlChunks;
var ir_js_1 = require("../markdown/ir.js");
var render_js_1 = require("../markdown/render.js");
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeHtmlAttr(text) {
  return escapeHtml(text).replace(/"/g, "&quot;");
}
function buildTelegramLink(link, _text) {
  var href = link.href.trim();
  if (!href) {
    return null;
  }
  if (link.start === link.end) {
    return null;
  }
  var safeHref = escapeHtmlAttr(href);
  return {
    start: link.start,
    end: link.end,
    open: '<a href="'.concat(safeHref, '">'),
    close: "</a>",
  };
}
function renderTelegramHtml(ir) {
  return (0, render_js_1.renderMarkdownWithMarkers)(ir, {
    styleMarkers: {
      bold: { open: "<b>", close: "</b>" },
      italic: { open: "<i>", close: "</i>" },
      strikethrough: { open: "<s>", close: "</s>" },
      code: { open: "<code>", close: "</code>" },
      code_block: { open: "<pre><code>", close: "</code></pre>" },
    },
    escapeText: escapeHtml,
    buildLink: buildTelegramLink,
  });
}
function markdownToTelegramHtml(markdown, options) {
  if (options === void 0) {
    options = {};
  }
  var ir = (0, ir_js_1.markdownToIR)(markdown !== null && markdown !== void 0 ? markdown : "", {
    linkify: true,
    headingStyle: "none",
    blockquotePrefix: "",
    tableMode: options.tableMode,
  });
  return renderTelegramHtml(ir);
}
function renderTelegramHtmlText(text, options) {
  var _a;
  if (options === void 0) {
    options = {};
  }
  var textMode = (_a = options.textMode) !== null && _a !== void 0 ? _a : "markdown";
  if (textMode === "html") {
    return text;
  }
  return markdownToTelegramHtml(text, { tableMode: options.tableMode });
}
function markdownToTelegramChunks(markdown, limit, options) {
  if (options === void 0) {
    options = {};
  }
  var ir = (0, ir_js_1.markdownToIR)(markdown !== null && markdown !== void 0 ? markdown : "", {
    linkify: true,
    headingStyle: "none",
    blockquotePrefix: "",
    tableMode: options.tableMode,
  });
  var chunks = (0, ir_js_1.chunkMarkdownIR)(ir, limit);
  return chunks.map(function (chunk) {
    return {
      html: renderTelegramHtml(chunk),
      text: chunk.text,
    };
  });
}
function markdownToTelegramHtmlChunks(markdown, limit) {
  return markdownToTelegramChunks(markdown, limit).map(function (chunk) {
    return chunk.html;
  });
}
