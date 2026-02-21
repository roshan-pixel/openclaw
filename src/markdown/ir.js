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
exports.markdownToIR = markdownToIR;
exports.markdownToIRWithMeta = markdownToIRWithMeta;
exports.chunkMarkdownIR = chunkMarkdownIR;
var markdown_it_1 = require("markdown-it");
var chunk_js_1 = require("../auto-reply/chunk.js");
function createMarkdownIt(options) {
  var _a;
  var md = new markdown_it_1.default({
    html: false,
    linkify: (_a = options.linkify) !== null && _a !== void 0 ? _a : true,
    breaks: false,
    typographer: false,
  });
  md.enable("strikethrough");
  if (options.tableMode && options.tableMode !== "off") {
    md.enable("table");
  } else {
    md.disable("table");
  }
  if (options.autolink === false) {
    md.disable("autolink");
  }
  return md;
}
function getAttr(token, name) {
  if (token.attrGet) {
    return token.attrGet(name);
  }
  if (token.attrs) {
    for (var _i = 0, _a = token.attrs; _i < _a.length; _i++) {
      var _b = _a[_i],
        key = _b[0],
        value = _b[1];
      if (key === name) {
        return value;
      }
    }
  }
  return null;
}
function createTextToken(base, content) {
  return __assign(__assign({}, base), { type: "text", content: content, children: undefined });
}
function applySpoilerTokens(tokens) {
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (token.children && token.children.length > 0) {
      token.children = injectSpoilersIntoInline(token.children);
    }
  }
}
function injectSpoilersIntoInline(tokens) {
  var _a;
  var result = [];
  var state = { spoilerOpen: false };
  for (var _i = 0, tokens_2 = tokens; _i < tokens_2.length; _i++) {
    var token = tokens_2[_i];
    if (token.type !== "text") {
      result.push(token);
      continue;
    }
    var content = (_a = token.content) !== null && _a !== void 0 ? _a : "";
    if (!content.includes("||")) {
      result.push(token);
      continue;
    }
    var index = 0;
    while (index < content.length) {
      var next = content.indexOf("||", index);
      if (next === -1) {
        if (index < content.length) {
          result.push(createTextToken(token, content.slice(index)));
        }
        break;
      }
      if (next > index) {
        result.push(createTextToken(token, content.slice(index, next)));
      }
      state.spoilerOpen = !state.spoilerOpen;
      result.push({
        type: state.spoilerOpen ? "spoiler_open" : "spoiler_close",
      });
      index = next + 2;
    }
  }
  return result;
}
function initRenderTarget() {
  return {
    text: "",
    styles: [],
    openStyles: [],
    links: [],
    linkStack: [],
  };
}
function resolveRenderTarget(state) {
  var _a, _b;
  return (_b = (_a = state.table) === null || _a === void 0 ? void 0 : _a.currentCell) !== null &&
    _b !== void 0
    ? _b
    : state;
}
function appendText(state, value) {
  if (!value) {
    return;
  }
  var target = resolveRenderTarget(state);
  target.text += value;
}
function openStyle(state, style) {
  var target = resolveRenderTarget(state);
  target.openStyles.push({ style: style, start: target.text.length });
}
function closeStyle(state, style) {
  var _a;
  var target = resolveRenderTarget(state);
  for (var i = target.openStyles.length - 1; i >= 0; i -= 1) {
    if (((_a = target.openStyles[i]) === null || _a === void 0 ? void 0 : _a.style) === style) {
      var start = target.openStyles[i].start;
      target.openStyles.splice(i, 1);
      var end = target.text.length;
      if (end > start) {
        target.styles.push({ start: start, end: end, style: style });
      }
      return;
    }
  }
}
function appendParagraphSeparator(state) {
  if (state.env.listStack.length > 0) {
    return;
  }
  if (state.table) {
    return;
  } // Don't add paragraph separators inside tables
  state.text += "\n\n";
}
function appendListPrefix(state) {
  var stack = state.env.listStack;
  var top = stack[stack.length - 1];
  if (!top) {
    return;
  }
  top.index += 1;
  var indent = "  ".repeat(Math.max(0, stack.length - 1));
  var prefix = top.type === "ordered" ? "".concat(top.index, ". ") : "• ";
  state.text += "".concat(indent).concat(prefix);
}
function renderInlineCode(state, content) {
  if (!content) {
    return;
  }
  var target = resolveRenderTarget(state);
  var start = target.text.length;
  target.text += content;
  target.styles.push({ start: start, end: start + content.length, style: "code" });
}
function renderCodeBlock(state, content) {
  var code = content !== null && content !== void 0 ? content : "";
  if (!code.endsWith("\n")) {
    code = "".concat(code, "\n");
  }
  var target = resolveRenderTarget(state);
  var start = target.text.length;
  target.text += code;
  target.styles.push({ start: start, end: start + code.length, style: "code_block" });
  if (state.env.listStack.length === 0) {
    target.text += "\n";
  }
}
function handleLinkClose(state) {
  var target = resolveRenderTarget(state);
  var link = target.linkStack.pop();
  if (!(link === null || link === void 0 ? void 0 : link.href)) {
    return;
  }
  var href = link.href.trim();
  if (!href) {
    return;
  }
  var start = link.labelStart;
  var end = target.text.length;
  if (end <= start) {
    target.links.push({ start: start, end: end, href: href });
    return;
  }
  target.links.push({ start: start, end: end, href: href });
}
function initTableState() {
  return {
    headers: [],
    rows: [],
    currentRow: [],
    currentCell: null,
    inHeader: false,
  };
}
function finishTableCell(cell) {
  closeRemainingStyles(cell);
  return {
    text: cell.text,
    styles: cell.styles,
    links: cell.links,
  };
}
function trimCell(cell) {
  var _a, _b;
  var text = cell.text;
  var start = 0;
  var end = text.length;
  while (start < end && /\s/.test((_a = text[start]) !== null && _a !== void 0 ? _a : "")) {
    start += 1;
  }
  while (end > start && /\s/.test((_b = text[end - 1]) !== null && _b !== void 0 ? _b : "")) {
    end -= 1;
  }
  if (start === 0 && end === text.length) {
    return cell;
  }
  var trimmedText = text.slice(start, end);
  var trimmedLength = trimmedText.length;
  var trimmedStyles = [];
  for (var _i = 0, _c = cell.styles; _i < _c.length; _i++) {
    var span = _c[_i];
    var sliceStart = Math.max(0, span.start - start);
    var sliceEnd = Math.min(trimmedLength, span.end - start);
    if (sliceEnd > sliceStart) {
      trimmedStyles.push({ start: sliceStart, end: sliceEnd, style: span.style });
    }
  }
  var trimmedLinks = [];
  for (var _d = 0, _e = cell.links; _d < _e.length; _d++) {
    var span = _e[_d];
    var sliceStart = Math.max(0, span.start - start);
    var sliceEnd = Math.min(trimmedLength, span.end - start);
    if (sliceEnd > sliceStart) {
      trimmedLinks.push({ start: sliceStart, end: sliceEnd, href: span.href });
    }
  }
  return { text: trimmedText, styles: trimmedStyles, links: trimmedLinks };
}
function appendCell(state, cell) {
  if (!cell.text) {
    return;
  }
  var start = state.text.length;
  state.text += cell.text;
  for (var _i = 0, _a = cell.styles; _i < _a.length; _i++) {
    var span = _a[_i];
    state.styles.push({
      start: start + span.start,
      end: start + span.end,
      style: span.style,
    });
  }
  for (var _b = 0, _c = cell.links; _b < _c.length; _b++) {
    var link = _c[_b];
    state.links.push({
      start: start + link.start,
      end: start + link.end,
      href: link.href,
    });
  }
}
function renderTableAsBullets(state) {
  if (!state.table) {
    return;
  }
  var headers = state.table.headers.map(trimCell);
  var rows = state.table.rows.map(function (row) {
    return row.map(trimCell);
  });
  // If no headers or rows, skip
  if (headers.length === 0 && rows.length === 0) {
    return;
  }
  // Determine if first column should be used as row labels
  // (common pattern: first column is category/feature name)
  var useFirstColAsLabel = headers.length > 1 && rows.length > 0;
  if (useFirstColAsLabel) {
    // Format: each row becomes a section with header as row[0], then key:value pairs
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
      var row = rows_1[_i];
      if (row.length === 0) {
        continue;
      }
      var rowLabel = row[0];
      if (rowLabel === null || rowLabel === void 0 ? void 0 : rowLabel.text) {
        var labelStart = state.text.length;
        appendCell(state, rowLabel);
        var labelEnd = state.text.length;
        if (labelEnd > labelStart) {
          state.styles.push({ start: labelStart, end: labelEnd, style: "bold" });
        }
        state.text += "\n";
      }
      // Add each column as a bullet point
      for (var i = 1; i < row.length; i++) {
        var header = headers[i];
        var value = row[i];
        if (!(value === null || value === void 0 ? void 0 : value.text)) {
          continue;
        }
        state.text += "• ";
        if (header === null || header === void 0 ? void 0 : header.text) {
          appendCell(state, header);
          state.text += ": ";
        } else {
          state.text += "Column ".concat(i, ": ");
        }
        appendCell(state, value);
        state.text += "\n";
      }
      state.text += "\n";
    }
  } else {
    // Simple table: just list headers and values
    for (var _a = 0, rows_2 = rows; _a < rows_2.length; _a++) {
      var row = rows_2[_a];
      for (var i = 0; i < row.length; i++) {
        var header = headers[i];
        var value = row[i];
        if (!(value === null || value === void 0 ? void 0 : value.text)) {
          continue;
        }
        state.text += "• ";
        if (header === null || header === void 0 ? void 0 : header.text) {
          appendCell(state, header);
          state.text += ": ";
        }
        appendCell(state, value);
        state.text += "\n";
      }
      state.text += "\n";
    }
  }
}
function renderTableAsCode(state) {
  if (!state.table) {
    return;
  }
  var headers = state.table.headers.map(trimCell);
  var rows = state.table.rows.map(function (row) {
    return row.map(trimCell);
  });
  var columnCount = Math.max.apply(
    Math,
    __spreadArray(
      [headers.length],
      rows.map(function (row) {
        return row.length;
      }),
      false,
    ),
  );
  if (columnCount === 0) {
    return;
  }
  var widths = Array.from({ length: columnCount }, function () {
    return 0;
  });
  var updateWidths = function (cells) {
    var _a;
    for (var i = 0; i < columnCount; i += 1) {
      var cell = cells[i];
      var width =
        (_a = cell === null || cell === void 0 ? void 0 : cell.text.length) !== null &&
        _a !== void 0
          ? _a
          : 0;
      if (widths[i] < width) {
        widths[i] = width;
      }
    }
  };
  updateWidths(headers);
  for (var _i = 0, rows_3 = rows; _i < rows_3.length; _i++) {
    var row = rows_3[_i];
    updateWidths(row);
  }
  var codeStart = state.text.length;
  var appendRow = function (cells) {
    var _a;
    state.text += "|";
    for (var i = 0; i < columnCount; i += 1) {
      state.text += " ";
      var cell = cells[i];
      if (cell) {
        appendCell(state, cell);
      }
      var pad =
        widths[i] -
        ((_a = cell === null || cell === void 0 ? void 0 : cell.text.length) !== null &&
        _a !== void 0
          ? _a
          : 0);
      if (pad > 0) {
        state.text += " ".repeat(pad);
      }
      state.text += " |";
    }
    state.text += "\n";
  };
  var appendDivider = function () {
    state.text += "|";
    for (var i = 0; i < columnCount; i += 1) {
      var dashCount = Math.max(3, widths[i]);
      state.text += " ".concat("-".repeat(dashCount), " |");
    }
    state.text += "\n";
  };
  appendRow(headers);
  appendDivider();
  for (var _a = 0, rows_4 = rows; _a < rows_4.length; _a++) {
    var row = rows_4[_a];
    appendRow(row);
  }
  var codeEnd = state.text.length;
  if (codeEnd > codeStart) {
    state.styles.push({ start: codeStart, end: codeEnd, style: "code_block" });
  }
  if (state.env.listStack.length === 0) {
    state.text += "\n";
  }
}
function renderTokens(tokens, state) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  for (var _i = 0, tokens_3 = tokens; _i < tokens_3.length; _i++) {
    var token = tokens_3[_i];
    switch (token.type) {
      case "inline":
        if (token.children) {
          renderTokens(token.children, state);
        }
        break;
      case "text":
        appendText(state, (_a = token.content) !== null && _a !== void 0 ? _a : "");
        break;
      case "em_open":
        openStyle(state, "italic");
        break;
      case "em_close":
        closeStyle(state, "italic");
        break;
      case "strong_open":
        openStyle(state, "bold");
        break;
      case "strong_close":
        closeStyle(state, "bold");
        break;
      case "s_open":
        openStyle(state, "strikethrough");
        break;
      case "s_close":
        closeStyle(state, "strikethrough");
        break;
      case "code_inline":
        renderInlineCode(state, (_b = token.content) !== null && _b !== void 0 ? _b : "");
        break;
      case "spoiler_open":
        if (state.enableSpoilers) {
          openStyle(state, "spoiler");
        }
        break;
      case "spoiler_close":
        if (state.enableSpoilers) {
          closeStyle(state, "spoiler");
        }
        break;
      case "link_open": {
        var href = (_c = getAttr(token, "href")) !== null && _c !== void 0 ? _c : "";
        var target = resolveRenderTarget(state);
        target.linkStack.push({ href: href, labelStart: target.text.length });
        break;
      }
      case "link_close":
        handleLinkClose(state);
        break;
      case "image":
        appendText(state, (_d = token.content) !== null && _d !== void 0 ? _d : "");
        break;
      case "softbreak":
      case "hardbreak":
        appendText(state, "\n");
        break;
      case "paragraph_close":
        appendParagraphSeparator(state);
        break;
      case "heading_open":
        if (state.headingStyle === "bold") {
          openStyle(state, "bold");
        }
        break;
      case "heading_close":
        if (state.headingStyle === "bold") {
          closeStyle(state, "bold");
        }
        appendParagraphSeparator(state);
        break;
      case "blockquote_open":
        if (state.blockquotePrefix) {
          state.text += state.blockquotePrefix;
        }
        break;
      case "blockquote_close":
        state.text += "\n";
        break;
      case "bullet_list_open":
        state.env.listStack.push({ type: "bullet", index: 0 });
        break;
      case "bullet_list_close":
        state.env.listStack.pop();
        break;
      case "ordered_list_open": {
        var start = Number((_e = getAttr(token, "start")) !== null && _e !== void 0 ? _e : "1");
        state.env.listStack.push({ type: "ordered", index: start - 1 });
        break;
      }
      case "ordered_list_close":
        state.env.listStack.pop();
        break;
      case "list_item_open":
        appendListPrefix(state);
        break;
      case "list_item_close":
        state.text += "\n";
        break;
      case "code_block":
      case "fence":
        renderCodeBlock(state, (_f = token.content) !== null && _f !== void 0 ? _f : "");
        break;
      case "html_block":
      case "html_inline":
        appendText(state, (_g = token.content) !== null && _g !== void 0 ? _g : "");
        break;
      // Table handling
      case "table_open":
        if (state.tableMode !== "off") {
          state.table = initTableState();
          state.hasTables = true;
        }
        break;
      case "table_close":
        if (state.table) {
          if (state.tableMode === "bullets") {
            renderTableAsBullets(state);
          } else if (state.tableMode === "code") {
            renderTableAsCode(state);
          }
        }
        state.table = null;
        break;
      case "thead_open":
        if (state.table) {
          state.table.inHeader = true;
        }
        break;
      case "thead_close":
        if (state.table) {
          state.table.inHeader = false;
        }
        break;
      case "tbody_open":
      case "tbody_close":
        break;
      case "tr_open":
        if (state.table) {
          state.table.currentRow = [];
        }
        break;
      case "tr_close":
        if (state.table) {
          if (state.table.inHeader) {
            state.table.headers = state.table.currentRow;
          } else {
            state.table.rows.push(state.table.currentRow);
          }
          state.table.currentRow = [];
        }
        break;
      case "th_open":
      case "td_open":
        if (state.table) {
          state.table.currentCell = initRenderTarget();
        }
        break;
      case "th_close":
      case "td_close":
        if ((_h = state.table) === null || _h === void 0 ? void 0 : _h.currentCell) {
          state.table.currentRow.push(finishTableCell(state.table.currentCell));
          state.table.currentCell = null;
        }
        break;
      case "hr":
        state.text += "\n";
        break;
      default:
        if (token.children) {
          renderTokens(token.children, state);
        }
        break;
    }
  }
}
function closeRemainingStyles(target) {
  for (var i = target.openStyles.length - 1; i >= 0; i -= 1) {
    var open_1 = target.openStyles[i];
    var end = target.text.length;
    if (end > open_1.start) {
      target.styles.push({
        start: open_1.start,
        end: end,
        style: open_1.style,
      });
    }
  }
  target.openStyles = [];
}
function clampStyleSpans(spans, maxLength) {
  var clamped = [];
  for (var _i = 0, spans_1 = spans; _i < spans_1.length; _i++) {
    var span = spans_1[_i];
    var start = Math.max(0, Math.min(span.start, maxLength));
    var end = Math.max(start, Math.min(span.end, maxLength));
    if (end > start) {
      clamped.push({ start: start, end: end, style: span.style });
    }
  }
  return clamped;
}
function clampLinkSpans(spans, maxLength) {
  var clamped = [];
  for (var _i = 0, spans_2 = spans; _i < spans_2.length; _i++) {
    var span = spans_2[_i];
    var start = Math.max(0, Math.min(span.start, maxLength));
    var end = Math.max(start, Math.min(span.end, maxLength));
    if (end > start) {
      clamped.push({ start: start, end: end, href: span.href });
    }
  }
  return clamped;
}
function mergeStyleSpans(spans) {
  var sorted = __spreadArray([], spans, true).toSorted(function (a, b) {
    if (a.start !== b.start) {
      return a.start - b.start;
    }
    if (a.end !== b.end) {
      return a.end - b.end;
    }
    return a.style.localeCompare(b.style);
  });
  var merged = [];
  for (var _i = 0, sorted_1 = sorted; _i < sorted_1.length; _i++) {
    var span = sorted_1[_i];
    var prev = merged[merged.length - 1];
    if (prev && prev.style === span.style && span.start <= prev.end) {
      prev.end = Math.max(prev.end, span.end);
      continue;
    }
    merged.push(__assign({}, span));
  }
  return merged;
}
function sliceStyleSpans(spans, start, end) {
  if (spans.length === 0) {
    return [];
  }
  var sliced = [];
  for (var _i = 0, spans_3 = spans; _i < spans_3.length; _i++) {
    var span = spans_3[_i];
    var sliceStart = Math.max(span.start, start);
    var sliceEnd = Math.min(span.end, end);
    if (sliceEnd > sliceStart) {
      sliced.push({
        start: sliceStart - start,
        end: sliceEnd - start,
        style: span.style,
      });
    }
  }
  return mergeStyleSpans(sliced);
}
function sliceLinkSpans(spans, start, end) {
  if (spans.length === 0) {
    return [];
  }
  var sliced = [];
  for (var _i = 0, spans_4 = spans; _i < spans_4.length; _i++) {
    var span = spans_4[_i];
    var sliceStart = Math.max(span.start, start);
    var sliceEnd = Math.min(span.end, end);
    if (sliceEnd > sliceStart) {
      sliced.push({
        start: sliceStart - start,
        end: sliceEnd - start,
        href: span.href,
      });
    }
  }
  return sliced;
}
function markdownToIR(markdown, options) {
  if (options === void 0) {
    options = {};
  }
  return markdownToIRWithMeta(markdown, options).ir;
}
function markdownToIRWithMeta(markdown, options) {
  var _a, _b, _c, _d;
  if (options === void 0) {
    options = {};
  }
  var env = { listStack: [] };
  var md = createMarkdownIt(options);
  var tokens = md.parse(markdown !== null && markdown !== void 0 ? markdown : "", env);
  if (options.enableSpoilers) {
    applySpoilerTokens(tokens);
  }
  var tableMode = (_a = options.tableMode) !== null && _a !== void 0 ? _a : "off";
  var state = {
    text: "",
    styles: [],
    openStyles: [],
    links: [],
    linkStack: [],
    env: env,
    headingStyle: (_b = options.headingStyle) !== null && _b !== void 0 ? _b : "none",
    blockquotePrefix: (_c = options.blockquotePrefix) !== null && _c !== void 0 ? _c : "",
    enableSpoilers: (_d = options.enableSpoilers) !== null && _d !== void 0 ? _d : false,
    tableMode: tableMode,
    table: null,
    hasTables: false,
  };
  renderTokens(tokens, state);
  closeRemainingStyles(state);
  var trimmedText = state.text.trimEnd();
  var trimmedLength = trimmedText.length;
  var codeBlockEnd = 0;
  for (var _i = 0, _e = state.styles; _i < _e.length; _i++) {
    var span = _e[_i];
    if (span.style !== "code_block") {
      continue;
    }
    if (span.end > codeBlockEnd) {
      codeBlockEnd = span.end;
    }
  }
  var finalLength = Math.max(trimmedLength, codeBlockEnd);
  var finalText = finalLength === state.text.length ? state.text : state.text.slice(0, finalLength);
  return {
    ir: {
      text: finalText,
      styles: mergeStyleSpans(clampStyleSpans(state.styles, finalLength)),
      links: clampLinkSpans(state.links, finalLength),
    },
    hasTables: state.hasTables,
  };
}
function chunkMarkdownIR(ir, limit) {
  if (!ir.text) {
    return [];
  }
  if (limit <= 0 || ir.text.length <= limit) {
    return [ir];
  }
  var chunks = (0, chunk_js_1.chunkText)(ir.text, limit);
  var results = [];
  var cursor = 0;
  chunks.forEach(function (chunk, index) {
    var _a;
    if (!chunk) {
      return;
    }
    if (index > 0) {
      while (
        cursor < ir.text.length &&
        /\s/.test((_a = ir.text[cursor]) !== null && _a !== void 0 ? _a : "")
      ) {
        cursor += 1;
      }
    }
    var start = cursor;
    var end = Math.min(ir.text.length, start + chunk.length);
    results.push({
      text: chunk,
      styles: sliceStyleSpans(ir.styles, start, end),
      links: sliceLinkSpans(ir.links, start, end),
    });
    cursor = end;
  });
  return results;
}
