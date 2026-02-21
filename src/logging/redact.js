"use strict";
var __makeTemplateObject =
  (this && this.__makeTemplateObject) ||
  function (cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, "raw", { value: raw });
    } else {
      cooked.raw = raw;
    }
    return cooked;
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
exports.redactSensitiveText = redactSensitiveText;
exports.redactToolDetail = redactToolDetail;
exports.getDefaultRedactPatterns = getDefaultRedactPatterns;
var node_module_1 = require("node:module");
var requireConfig = (0, node_module_1.createRequire)(import.meta.url);
var DEFAULT_REDACT_MODE = "tools";
var DEFAULT_REDACT_MIN_LENGTH = 18;
var DEFAULT_REDACT_KEEP_START = 6;
var DEFAULT_REDACT_KEEP_END = 4;
var DEFAULT_REDACT_PATTERNS = [
  // ENV-style assignments.
  String.raw(
    templateObject_1 ||
      (templateObject_1 = __makeTemplateObject(
        [void 0],
        [
          "\\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD)\\b\\s*[=:]\\s*([\"']?)([^\\s\"'\\\\]+)\\1",
        ],
      )),
  ),
  // JSON fields.
  String.raw(
    templateObject_3 ||
      (templateObject_3 = __makeTemplateObject(
        ['"(?:apiKey|token|secret|password|passwd|accessToken|refreshToken)"s*:s*"([^"]+)"'],
        ['"(?:apiKey|token|secret|password|passwd|accessToken|refreshToken)"\\s*:\\s*"([^"]+)"'],
      )),
  ),
  // CLI flags.
  String.raw(
    templateObject_2 ||
      (templateObject_2 = __makeTemplateObject(
        [void 0],
        ["--(?:api[-_]?key|token|secret|password|passwd)\\s+([\"']?)([^\\s\"']+)\\1"],
      )),
  ),
  // Authorization headers.
  String.raw(
    templateObject_4 ||
      (templateObject_4 = __makeTemplateObject(
        ["Authorizations*[:=]s*Bearers+([A-Za-z0-9._-+=]+)"],
        ["Authorization\\s*[:=]\\s*Bearer\\s+([A-Za-z0-9._\\-+=]+)"],
      )),
  ),
  String.raw(
    templateObject_5 ||
      (templateObject_5 = __makeTemplateObject(
        ["\bBearers+([A-Za-z0-9._-+=]{18,})\b"],
        ["\\bBearer\\s+([A-Za-z0-9._\\-+=]{18,})\\b"],
      )),
  ),
  // PEM blocks.
  String.raw(
    templateObject_6 ||
      (templateObject_6 = __makeTemplateObject(
        ["-----BEGIN [A-Z ]*PRIVATE KEY-----[sS]+?-----END [A-Z ]*PRIVATE KEY-----"],
        ["-----BEGIN [A-Z ]*PRIVATE KEY-----[\\s\\S]+?-----END [A-Z ]*PRIVATE KEY-----"],
      )),
  ),
  // Common token prefixes.
  String.raw(
    templateObject_7 ||
      (templateObject_7 = __makeTemplateObject(
        ["\b(sk-[A-Za-z0-9_-]{8,})\b"],
        ["\\b(sk-[A-Za-z0-9_-]{8,})\\b"],
      )),
  ),
  String.raw(
    templateObject_8 ||
      (templateObject_8 = __makeTemplateObject(
        ["\b(ghp_[A-Za-z0-9]{20,})\b"],
        ["\\b(ghp_[A-Za-z0-9]{20,})\\b"],
      )),
  ),
  String.raw(
    templateObject_9 ||
      (templateObject_9 = __makeTemplateObject(
        ["\b(github_pat_[A-Za-z0-9_]{20,})\b"],
        ["\\b(github_pat_[A-Za-z0-9_]{20,})\\b"],
      )),
  ),
  String.raw(
    templateObject_10 ||
      (templateObject_10 = __makeTemplateObject(
        ["\b(xox[baprs]-[A-Za-z0-9-]{10,})\b"],
        ["\\b(xox[baprs]-[A-Za-z0-9-]{10,})\\b"],
      )),
  ),
  String.raw(
    templateObject_11 ||
      (templateObject_11 = __makeTemplateObject(
        ["\b(xapp-[A-Za-z0-9-]{10,})\b"],
        ["\\b(xapp-[A-Za-z0-9-]{10,})\\b"],
      )),
  ),
  String.raw(
    templateObject_12 ||
      (templateObject_12 = __makeTemplateObject(
        ["\b(gsk_[A-Za-z0-9_-]{10,})\b"],
        ["\\b(gsk_[A-Za-z0-9_-]{10,})\\b"],
      )),
  ),
  String.raw(
    templateObject_13 ||
      (templateObject_13 = __makeTemplateObject(
        ["\b(AIza[0-9A-Za-z-_]{20,})\b"],
        ["\\b(AIza[0-9A-Za-z\\-_]{20,})\\b"],
      )),
  ),
  String.raw(
    templateObject_14 ||
      (templateObject_14 = __makeTemplateObject(
        ["\b(pplx-[A-Za-z0-9_-]{10,})\b"],
        ["\\b(pplx-[A-Za-z0-9_-]{10,})\\b"],
      )),
  ),
  String.raw(
    templateObject_15 ||
      (templateObject_15 = __makeTemplateObject(
        ["\b(npm_[A-Za-z0-9]{10,})\b"],
        ["\\b(npm_[A-Za-z0-9]{10,})\\b"],
      )),
  ),
  String.raw(
    templateObject_16 ||
      (templateObject_16 = __makeTemplateObject(
        ["\b(d{6,}:[A-Za-z0-9_-]{20,})\b"],
        ["\\b(\\d{6,}:[A-Za-z0-9_-]{20,})\\b"],
      )),
  ),
];
function normalizeMode(value) {
  return value === "off" ? "off" : DEFAULT_REDACT_MODE;
}
function parsePattern(raw) {
  if (!raw.trim()) {
    return null;
  }
  var match = raw.match(/^\/(.+)\/([gimsuy]*)$/);
  try {
    if (match) {
      var flags = match[2].includes("g") ? match[2] : "".concat(match[2], "g");
      return new RegExp(match[1], flags);
    }
    return new RegExp(raw, "gi");
  } catch (_a) {
    return null;
  }
}
function resolvePatterns(value) {
  var source = (value === null || value === void 0 ? void 0 : value.length)
    ? value
    : DEFAULT_REDACT_PATTERNS;
  return source.map(parsePattern).filter(function (re) {
    return Boolean(re);
  });
}
function maskToken(token) {
  if (token.length < DEFAULT_REDACT_MIN_LENGTH) {
    return "***";
  }
  var start = token.slice(0, DEFAULT_REDACT_KEEP_START);
  var end = token.slice(-DEFAULT_REDACT_KEEP_END);
  return "".concat(start, "\u2026").concat(end);
}
function redactPemBlock(block) {
  var lines = block.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    return "***";
  }
  return "".concat(lines[0], "\n\u2026redacted\u2026\n").concat(lines[lines.length - 1]);
}
function redactMatch(match, groups) {
  var _a;
  if (match.includes("PRIVATE KEY-----")) {
    return redactPemBlock(match);
  }
  var token =
    (_a = groups
      .filter(function (value) {
        return typeof value === "string" && value.length > 0;
      })
      .at(-1)) !== null && _a !== void 0
      ? _a
      : match;
  var masked = maskToken(token);
  if (token === match) {
    return masked;
  }
  return match.replace(token, masked);
}
function redactText(text, patterns) {
  var next = text;
  for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
    var pattern = patterns_1[_i];
    next = next.replace(pattern, function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return redactMatch(args[0], args.slice(1, args.length - 2));
    });
  }
  return next;
}
function resolveConfigRedaction() {
  var _a;
  var cfg;
  try {
    var loaded = requireConfig("../config/config.js");
    cfg = (_a = loaded.loadConfig) === null || _a === void 0 ? void 0 : _a.call(loaded).logging;
  } catch (_b) {
    cfg = undefined;
  }
  return {
    mode: normalizeMode(cfg === null || cfg === void 0 ? void 0 : cfg.redactSensitive),
    patterns: cfg === null || cfg === void 0 ? void 0 : cfg.redactPatterns,
  };
}
function redactSensitiveText(text, options) {
  if (!text) {
    return text;
  }
  var resolved = options !== null && options !== void 0 ? options : resolveConfigRedaction();
  if (normalizeMode(resolved.mode) === "off") {
    return text;
  }
  var patterns = resolvePatterns(resolved.patterns);
  if (!patterns.length) {
    return text;
  }
  return redactText(text, patterns);
}
function redactToolDetail(detail) {
  var resolved = resolveConfigRedaction();
  if (normalizeMode(resolved.mode) !== "tools") {
    return detail;
  }
  return redactSensitiveText(detail, resolved);
}
function getDefaultRedactPatterns() {
  return __spreadArray([], DEFAULT_REDACT_PATTERNS, true);
}
var templateObject_1, templateObject_2;
var templateObject_3,
  templateObject_4,
  templateObject_5,
  templateObject_6,
  templateObject_7,
  templateObject_8,
  templateObject_9,
  templateObject_10,
  templateObject_11,
  templateObject_12,
  templateObject_13,
  templateObject_14,
  templateObject_15,
  templateObject_16;
