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
exports.shortenPath = shortenPath;
exports.shortenMeta = shortenMeta;
exports.formatToolAggregate = formatToolAggregate;
exports.formatToolPrefix = formatToolPrefix;
var tool_display_js_1 = require("../agents/tool-display.js");
var utils_js_1 = require("../utils.js");
function shortenPath(p) {
  return (0, utils_js_1.shortenHomePath)(p);
}
function shortenMeta(meta) {
  if (!meta) {
    return meta;
  }
  var colonIdx = meta.indexOf(":");
  if (colonIdx === -1) {
    return (0, utils_js_1.shortenHomeInString)(meta);
  }
  var base = meta.slice(0, colonIdx);
  var rest = meta.slice(colonIdx);
  return "".concat((0, utils_js_1.shortenHomeInString)(base)).concat(rest);
}
function formatToolAggregate(toolName, metas, options) {
  var _a;
  var filtered = (metas !== null && metas !== void 0 ? metas : []).filter(Boolean).map(shortenMeta);
  var display = (0, tool_display_js_1.resolveToolDisplay)({ name: toolName });
  var prefix = "".concat(display.emoji, " ").concat(display.label);
  if (!filtered.length) {
    return prefix;
  }
  var rawSegments = [];
  // Group by directory and brace-collapse filenames
  var grouped = {};
  for (var _i = 0, filtered_1 = filtered; _i < filtered_1.length; _i++) {
    var m = filtered_1[_i];
    if (!isPathLike(m)) {
      rawSegments.push(m);
      continue;
    }
    if (m.includes("→")) {
      rawSegments.push(m);
      continue;
    }
    var parts = m.split("/");
    if (parts.length > 1) {
      var dir = parts.slice(0, -1).join("/");
      var base = (_a = parts.at(-1)) !== null && _a !== void 0 ? _a : m;
      if (!grouped[dir]) {
        grouped[dir] = [];
      }
      grouped[dir].push(base);
    } else {
      if (!grouped["."]) {
        grouped["."] = [];
      }
      grouped["."].push(m);
    }
  }
  var segments = Object.entries(grouped).map(function (_a) {
    var dir = _a[0],
      files = _a[1];
    var brace = files.length > 1 ? "{".concat(files.join(", "), "}") : files[0];
    if (dir === ".") {
      return brace;
    }
    return "".concat(dir, "/").concat(brace);
  });
  var allSegments = __spreadArray(__spreadArray([], rawSegments, true), segments, true);
  var meta = allSegments.join("; ");
  return ""
    .concat(prefix, ": ")
    .concat(
      formatMetaForDisplay(
        toolName,
        meta,
        options === null || options === void 0 ? void 0 : options.markdown,
      ),
    );
}
function formatToolPrefix(toolName, meta) {
  var extra = (meta === null || meta === void 0 ? void 0 : meta.trim())
    ? shortenMeta(meta)
    : undefined;
  var display = (0, tool_display_js_1.resolveToolDisplay)({ name: toolName, meta: extra });
  return (0, tool_display_js_1.formatToolSummary)(display);
}
function formatMetaForDisplay(toolName, meta, markdown) {
  var normalized = (toolName !== null && toolName !== void 0 ? toolName : "").trim().toLowerCase();
  if (normalized === "exec" || normalized === "bash") {
    var _a = splitExecFlags(meta),
      flags = _a.flags,
      body = _a.body;
    if (flags.length > 0) {
      if (!body) {
        return flags.join(" · ");
      }
      return "".concat(flags.join(" · "), " \u00B7 ").concat(maybeWrapMarkdown(body, markdown));
    }
  }
  return maybeWrapMarkdown(meta, markdown);
}
function splitExecFlags(meta) {
  var parts = meta
    .split(" · ")
    .map(function (part) {
      return part.trim();
    })
    .filter(Boolean);
  if (parts.length === 0) {
    return { flags: [], body: "" };
  }
  var flags = [];
  var bodyParts = [];
  for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
    var part = parts_1[_i];
    if (part === "elevated" || part === "pty") {
      flags.push(part);
      continue;
    }
    bodyParts.push(part);
  }
  return { flags: flags, body: bodyParts.join(" · ") };
}
function isPathLike(value) {
  if (!value) {
    return false;
  }
  if (value.includes(" ")) {
    return false;
  }
  if (value.includes("://")) {
    return false;
  }
  if (value.includes("·")) {
    return false;
  }
  if (value.includes("&&") || value.includes("||")) {
    return false;
  }
  return /^~?(\/[^\s]+)+$/.test(value);
}
function maybeWrapMarkdown(value, markdown) {
  if (!markdown) {
    return value;
  }
  if (value.includes("`")) {
    return value;
  }
  return "`".concat(value, "`");
}
