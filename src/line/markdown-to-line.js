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
exports.extractMarkdownTables = extractMarkdownTables;
exports.convertTableToFlexBubble = convertTableToFlexBubble;
exports.extractCodeBlocks = extractCodeBlocks;
exports.convertCodeBlockToFlexBubble = convertCodeBlockToFlexBubble;
exports.extractLinks = extractLinks;
exports.convertLinksToFlexBubble = convertLinksToFlexBubble;
exports.stripMarkdown = stripMarkdown;
exports.processLineMessage = processLineMessage;
exports.hasMarkdownToConvert = hasMarkdownToConvert;
var flex_templates_js_1 = require("./flex-templates.js");
/**
 * Regex patterns for markdown detection
 */
var MARKDOWN_TABLE_REGEX = /^\|(.+)\|[\r\n]+\|[-:\s|]+\|[\r\n]+((?:\|.+\|[\r\n]*)+)/gm;
var MARKDOWN_CODE_BLOCK_REGEX = /```(\w*)\n([\s\S]*?)```/g;
var MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;
/**
 * Detect and extract markdown tables from text
 */
function extractMarkdownTables(text) {
  var tables = [];
  var textWithoutTables = text;
  // Reset regex state
  MARKDOWN_TABLE_REGEX.lastIndex = 0;
  var match;
  var matches = [];
  while ((match = MARKDOWN_TABLE_REGEX.exec(text)) !== null) {
    var fullMatch = match[0];
    var headerLine = match[1];
    var bodyLines = match[2];
    var headers = parseTableRow(headerLine);
    var rows = bodyLines
      .trim()
      .split(/[\r\n]+/)
      .filter(function (line) {
        return line.trim();
      })
      .map(parseTableRow);
    if (headers.length > 0 && rows.length > 0) {
      matches.push({
        fullMatch: fullMatch,
        table: { headers: headers, rows: rows },
      });
    }
  }
  // Remove tables from text in reverse order to preserve indices
  for (var i = matches.length - 1; i >= 0; i--) {
    var _a = matches[i],
      fullMatch = _a.fullMatch,
      table = _a.table;
    tables.unshift(table);
    textWithoutTables = textWithoutTables.replace(fullMatch, "");
  }
  return { tables: tables, textWithoutTables: textWithoutTables };
}
/**
 * Parse a single table row (pipe-separated values)
 */
function parseTableRow(row) {
  return row
    .split("|")
    .map(function (cell) {
      return cell.trim();
    })
    .filter(function (cell, index, arr) {
      // Filter out empty cells at start/end (from leading/trailing pipes)
      if (index === 0 && cell === "") {
        return false;
      }
      if (index === arr.length - 1 && cell === "") {
        return false;
      }
      return true;
    });
}
/**
 * Convert a markdown table to a LINE Flex Message bubble
 */
function convertTableToFlexBubble(table) {
  var parseCell = function (value) {
    var _a;
    var raw =
      (_a = value === null || value === void 0 ? void 0 : value.trim()) !== null && _a !== void 0
        ? _a
        : "";
    if (!raw) {
      return { text: "-", bold: false, hasMarkup: false };
    }
    var hasMarkup = false;
    var stripped = raw.replace(/\*\*(.+?)\*\*/g, function (_, inner) {
      hasMarkup = true;
      return String(inner);
    });
    var text = stripped.trim() || "-";
    var bold = /^\*\*.+\*\*$/.test(raw);
    return { text: text, bold: bold, hasMarkup: hasMarkup };
  };
  var headerCells = table.headers.map(function (header) {
    return parseCell(header);
  });
  var rowCells = table.rows.map(function (row) {
    return row.map(function (cell) {
      return parseCell(cell);
    });
  });
  var hasInlineMarkup =
    headerCells.some(function (cell) {
      return cell.hasMarkup;
    }) ||
    rowCells.some(function (row) {
      return row.some(function (cell) {
        return cell.hasMarkup;
      });
    });
  // For simple 2-column tables, use receipt card format
  if (table.headers.length === 2 && !hasInlineMarkup) {
    var items = rowCells.map(function (row) {
      var _a, _b, _c, _d;
      return {
        name:
          (_b = (_a = row[0]) === null || _a === void 0 ? void 0 : _a.text) !== null &&
          _b !== void 0
            ? _b
            : "-",
        value:
          (_d = (_c = row[1]) === null || _c === void 0 ? void 0 : _c.text) !== null &&
          _d !== void 0
            ? _d
            : "-",
      };
    });
    return (0, flex_templates_js_1.createReceiptCard)({
      title: headerCells
        .map(function (cell) {
          return cell.text;
        })
        .join(" / "),
      items: items,
    });
  }
  // For multi-column tables, create a custom layout
  var headerRow = {
    type: "box",
    layout: "horizontal",
    contents: headerCells.map(function (cell) {
      return {
        type: "text",
        text: cell.text,
        weight: "bold",
        size: "sm",
        color: "#333333",
        flex: 1,
        wrap: true,
      };
    }),
    paddingBottom: "sm",
  };
  var dataRows = rowCells.slice(0, 10).map(function (row, rowIndex) {
    var rowContents = table.headers.map(function (_, colIndex) {
      var _a;
      var cell =
        (_a = row[colIndex]) !== null && _a !== void 0
          ? _a
          : { text: "-", bold: false, hasMarkup: false };
      return {
        type: "text",
        text: cell.text,
        size: "sm",
        color: "#666666",
        flex: 1,
        wrap: true,
        weight: cell.bold ? "bold" : undefined,
      };
    });
    return {
      type: "box",
      layout: "horizontal",
      contents: rowContents,
      margin: rowIndex === 0 ? "md" : "sm",
    };
  });
  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: __spreadArray([headerRow, { type: "separator", margin: "sm" }], dataRows, true),
      paddingAll: "lg",
    },
  };
}
/**
 * Detect and extract code blocks from text
 */
function extractCodeBlocks(text) {
  var codeBlocks = [];
  var textWithoutCode = text;
  // Reset regex state
  MARKDOWN_CODE_BLOCK_REGEX.lastIndex = 0;
  var match;
  var matches = [];
  while ((match = MARKDOWN_CODE_BLOCK_REGEX.exec(text)) !== null) {
    var fullMatch = match[0];
    var language = match[1] || undefined;
    var code = match[2];
    matches.push({
      fullMatch: fullMatch,
      block: { language: language, code: code.trim() },
    });
  }
  // Remove code blocks in reverse order
  for (var i = matches.length - 1; i >= 0; i--) {
    var _a = matches[i],
      fullMatch = _a.fullMatch,
      block = _a.block;
    codeBlocks.unshift(block);
    textWithoutCode = textWithoutCode.replace(fullMatch, "");
  }
  return { codeBlocks: codeBlocks, textWithoutCode: textWithoutCode };
}
/**
 * Convert a code block to a LINE Flex Message bubble
 */
function convertCodeBlockToFlexBubble(block) {
  var titleText = block.language ? "Code (".concat(block.language, ")") : "Code";
  // Truncate very long code to fit LINE's limits
  var displayCode = block.code.length > 2000 ? block.code.slice(0, 2000) + "\n..." : block.code;
  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: titleText,
          weight: "bold",
          size: "sm",
          color: "#666666",
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: displayCode,
              size: "xs",
              color: "#333333",
              wrap: true,
            },
          ],
          backgroundColor: "#F5F5F5",
          paddingAll: "md",
          cornerRadius: "md",
          margin: "sm",
        },
      ],
      paddingAll: "lg",
    },
  };
}
/**
 * Extract markdown links from text
 */
function extractLinks(text) {
  var links = [];
  // Reset regex state
  MARKDOWN_LINK_REGEX.lastIndex = 0;
  var match;
  while ((match = MARKDOWN_LINK_REGEX.exec(text)) !== null) {
    links.push({
      text: match[1],
      url: match[2],
    });
  }
  // Replace markdown links with just the text (for plain text output)
  var textWithLinks = text.replace(MARKDOWN_LINK_REGEX, "$1");
  return { links: links, textWithLinks: textWithLinks };
}
/**
 * Create a Flex Message with tappable link buttons
 */
function convertLinksToFlexBubble(links) {
  var buttons = links.slice(0, 4).map(function (link, index) {
    return {
      type: "button",
      action: {
        type: "uri",
        label: link.text.slice(0, 20), // LINE button label limit
        uri: link.url,
      },
      style: index === 0 ? "primary" : "secondary",
      margin: index > 0 ? "sm" : undefined,
    };
  });
  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "Links",
          weight: "bold",
          size: "md",
          color: "#333333",
        },
      ],
      paddingAll: "lg",
      paddingBottom: "sm",
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: buttons,
      paddingAll: "md",
    },
  };
}
/**
 * Strip markdown formatting from text (for plain text output)
 * Handles: bold, italic, strikethrough, headers, blockquotes, horizontal rules
 */
function stripMarkdown(text) {
  var result = text;
  // Remove bold: **text** or __text__
  result = result.replace(/\*\*(.+?)\*\*/g, "$1");
  result = result.replace(/__(.+?)__/g, "$1");
  // Remove italic: *text* or _text_ (but not already processed)
  result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "$1");
  result = result.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, "$1");
  // Remove strikethrough: ~~text~~
  result = result.replace(/~~(.+?)~~/g, "$1");
  // Remove headers: # Title, ## Title, etc.
  result = result.replace(/^#{1,6}\s+(.+)$/gm, "$1");
  // Remove blockquotes: > text
  result = result.replace(/^>\s?(.*)$/gm, "$1");
  // Remove horizontal rules: ---, ***, ___
  result = result.replace(/^[-*_]{3,}$/gm, "");
  // Remove inline code: `code`
  result = result.replace(/`([^`]+)`/g, "$1");
  // Clean up extra whitespace
  result = result.replace(/\n{3,}/g, "\n\n");
  result = result.trim();
  return result;
}
/**
 * Main function: Process text for LINE output
 * - Extracts tables → Flex Messages
 * - Extracts code blocks → Flex Messages
 * - Strips remaining markdown
 * - Returns processed text + Flex Messages
 */
function processLineMessage(text) {
  var flexMessages = [];
  var processedText = text;
  // 1. Extract and convert tables
  var _a = extractMarkdownTables(processedText),
    tables = _a.tables,
    textWithoutTables = _a.textWithoutTables;
  processedText = textWithoutTables;
  for (var _i = 0, tables_1 = tables; _i < tables_1.length; _i++) {
    var table = tables_1[_i];
    var bubble = convertTableToFlexBubble(table);
    flexMessages.push((0, flex_templates_js_1.toFlexMessage)("Table", bubble));
  }
  // 2. Extract and convert code blocks
  var _b = extractCodeBlocks(processedText),
    codeBlocks = _b.codeBlocks,
    textWithoutCode = _b.textWithoutCode;
  processedText = textWithoutCode;
  for (var _c = 0, codeBlocks_1 = codeBlocks; _c < codeBlocks_1.length; _c++) {
    var block = codeBlocks_1[_c];
    var bubble = convertCodeBlockToFlexBubble(block);
    flexMessages.push((0, flex_templates_js_1.toFlexMessage)("Code", bubble));
  }
  // 3. Handle links - convert [text](url) to plain text for display
  // (We could also create link buttons, but that can get noisy)
  var textWithLinks = extractLinks(processedText).textWithLinks;
  processedText = textWithLinks;
  // 4. Strip remaining markdown formatting
  processedText = stripMarkdown(processedText);
  return {
    text: processedText,
    flexMessages: flexMessages,
  };
}
/**
 * Check if text contains markdown that needs conversion
 */
function hasMarkdownToConvert(text) {
  // Check for tables
  MARKDOWN_TABLE_REGEX.lastIndex = 0;
  if (MARKDOWN_TABLE_REGEX.test(text)) {
    return true;
  }
  // Check for code blocks
  MARKDOWN_CODE_BLOCK_REGEX.lastIndex = 0;
  if (MARKDOWN_CODE_BLOCK_REGEX.test(text)) {
    return true;
  }
  // Check for other markdown patterns
  if (/\*\*[^*]+\*\*/.test(text)) {
    return true;
  } // bold
  if (/~~[^~]+~~/.test(text)) {
    return true;
  } // strikethrough
  if (/^#{1,6}\s+/m.test(text)) {
    return true;
  } // headers
  if (/^>\s+/m.test(text)) {
    return true;
  } // blockquotes
  return false;
}
