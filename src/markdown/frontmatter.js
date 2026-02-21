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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFrontmatterBlock = parseFrontmatterBlock;
var yaml_1 = require("yaml");
function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}
function coerceFrontmatterValue(value) {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch (_a) {
      return undefined;
    }
  }
  return undefined;
}
function parseYamlFrontmatter(block) {
  try {
    var parsed = yaml_1.default.parse(block);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    var result = {};
    for (var _i = 0, _a = Object.entries(parsed); _i < _a.length; _i++) {
      var _b = _a[_i],
        rawKey = _b[0],
        value = _b[1];
      var key = rawKey.trim();
      if (!key) {
        continue;
      }
      var coerced = coerceFrontmatterValue(value);
      if (coerced === undefined) {
        continue;
      }
      result[key] = coerced;
    }
    return result;
  } catch (_c) {
    return null;
  }
}
function extractMultiLineValue(lines, startIndex) {
  var startLine = lines[startIndex];
  var match = startLine.match(/^([\w-]+):\s*(.*)$/);
  if (!match) {
    return { value: "", linesConsumed: 1 };
  }
  var inlineValue = match[2].trim();
  if (inlineValue) {
    return { value: inlineValue, linesConsumed: 1 };
  }
  var valueLines = [];
  var i = startIndex + 1;
  while (i < lines.length) {
    var line = lines[i];
    if (line.length > 0 && !line.startsWith(" ") && !line.startsWith("\t")) {
      break;
    }
    valueLines.push(line);
    i++;
  }
  var combined = valueLines.join("\n").trim();
  return { value: combined, linesConsumed: i - startIndex };
}
function parseLineFrontmatter(block) {
  var frontmatter = {};
  var lines = block.split("\n");
  var i = 0;
  while (i < lines.length) {
    var line = lines[i];
    var match = line.match(/^([\w-]+):\s*(.*)$/);
    if (!match) {
      i++;
      continue;
    }
    var key = match[1];
    var inlineValue = match[2].trim();
    if (!key) {
      i++;
      continue;
    }
    if (!inlineValue && i + 1 < lines.length) {
      var nextLine = lines[i + 1];
      if (nextLine.startsWith(" ") || nextLine.startsWith("\t")) {
        var _a = extractMultiLineValue(lines, i),
          value_1 = _a.value,
          linesConsumed = _a.linesConsumed;
        if (value_1) {
          frontmatter[key] = value_1;
        }
        i += linesConsumed;
        continue;
      }
    }
    var value = stripQuotes(inlineValue);
    if (value) {
      frontmatter[key] = value;
    }
    i++;
  }
  return frontmatter;
}
function parseFrontmatterBlock(content) {
  var normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (!normalized.startsWith("---")) {
    return {};
  }
  var endIndex = normalized.indexOf("\n---", 3);
  if (endIndex === -1) {
    return {};
  }
  var block = normalized.slice(4, endIndex);
  var lineParsed = parseLineFrontmatter(block);
  var yamlParsed = parseYamlFrontmatter(block);
  if (yamlParsed === null) {
    return lineParsed;
  }
  var merged = __assign({}, yamlParsed);
  for (var _i = 0, _a = Object.entries(lineParsed); _i < _a.length; _i++) {
    var _b = _a[_i],
      key = _b[0],
      value = _b[1];
    if (value.startsWith("{") || value.startsWith("[")) {
      merged[key] = value;
    }
  }
  return merged;
}
