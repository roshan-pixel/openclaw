"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractLinksFromMessage = extractLinksFromMessage;
var defaults_js_1 = require("./defaults.js");
// Remove markdown link syntax so only bare URLs are considered.
var MARKDOWN_LINK_RE = /\[[^\]]*]\((https?:\/\/\S+?)\)/gi;
var BARE_LINK_RE = /https?:\/\/\S+/gi;
function stripMarkdownLinks(message) {
  return message.replace(MARKDOWN_LINK_RE, " ");
}
function resolveMaxLinks(value) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }
  return defaults_js_1.DEFAULT_MAX_LINKS;
}
function isAllowedUrl(raw) {
  try {
    var parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    if (parsed.hostname === "127.0.0.1") {
      return false;
    }
    return true;
  } catch (_a) {
    return false;
  }
}
function extractLinksFromMessage(message, opts) {
  var _a;
  var source = message === null || message === void 0 ? void 0 : message.trim();
  if (!source) {
    return [];
  }
  var maxLinks = resolveMaxLinks(opts === null || opts === void 0 ? void 0 : opts.maxLinks);
  var sanitized = stripMarkdownLinks(source);
  var seen = new Set();
  var results = [];
  for (var _i = 0, _b = sanitized.matchAll(BARE_LINK_RE); _i < _b.length; _i++) {
    var match = _b[_i];
    var raw = (_a = match[0]) === null || _a === void 0 ? void 0 : _a.trim();
    if (!raw) {
      continue;
    }
    if (!isAllowedUrl(raw)) {
      continue;
    }
    if (seen.has(raw)) {
      continue;
    }
    seen.add(raw);
    results.push(raw);
    if (results.length >= maxLinks) {
      break;
    }
  }
  return results;
}
