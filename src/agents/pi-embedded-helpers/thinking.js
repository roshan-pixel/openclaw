"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickFallbackThinkingLevel = pickFallbackThinkingLevel;
var thinking_js_1 = require("../../auto-reply/thinking.js");
function extractSupportedValues(raw) {
  var _a;
  var match =
    (_a = raw.match(/supported values are:\s*([^\n.]+)/i)) !== null && _a !== void 0
      ? _a
      : raw.match(/supported values:\s*([^\n.]+)/i);
  if (!(match === null || match === void 0 ? void 0 : match[1])) {
    return [];
  }
  var fragment = match[1];
  var quoted = Array.from(fragment.matchAll(/['"]([^'"]+)['"]/g)).map(function (entry) {
    var _a;
    return (_a = entry[1]) === null || _a === void 0 ? void 0 : _a.trim();
  });
  if (quoted.length > 0) {
    return quoted.filter(function (entry) {
      return Boolean(entry);
    });
  }
  return fragment
    .split(/,|\band\b/gi)
    .map(function (entry) {
      return entry.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "").trim();
    })
    .filter(Boolean);
}
function pickFallbackThinkingLevel(params) {
  var _a;
  var raw = (_a = params.message) === null || _a === void 0 ? void 0 : _a.trim();
  if (!raw) {
    return undefined;
  }
  var supported = extractSupportedValues(raw);
  if (supported.length === 0) {
    return undefined;
  }
  for (var _i = 0, supported_1 = supported; _i < supported_1.length; _i++) {
    var entry = supported_1[_i];
    var normalized = (0, thinking_js_1.normalizeThinkLevel)(entry);
    if (!normalized) {
      continue;
    }
    if (params.attempted.has(normalized)) {
      continue;
    }
    return normalized;
  }
  return undefined;
}
