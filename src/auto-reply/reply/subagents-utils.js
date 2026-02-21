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
exports.formatDurationShort = formatDurationShort;
exports.formatAgeShort = formatAgeShort;
exports.resolveSubagentLabel = resolveSubagentLabel;
exports.formatRunLabel = formatRunLabel;
exports.formatRunStatus = formatRunStatus;
exports.sortSubagentRuns = sortSubagentRuns;
var utils_js_1 = require("../../utils.js");
function formatDurationShort(valueMs) {
  if (!valueMs || !Number.isFinite(valueMs) || valueMs <= 0) {
    return "n/a";
  }
  var totalSeconds = Math.round(valueMs / 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;
  if (hours > 0) {
    return "".concat(hours, "h").concat(minutes, "m");
  }
  if (minutes > 0) {
    return "".concat(minutes, "m").concat(seconds, "s");
  }
  return "".concat(seconds, "s");
}
function formatAgeShort(valueMs) {
  if (!valueMs || !Number.isFinite(valueMs) || valueMs <= 0) {
    return "n/a";
  }
  var minutes = Math.round(valueMs / 60000);
  if (minutes < 1) {
    return "just now";
  }
  if (minutes < 60) {
    return "".concat(minutes, "m ago");
  }
  var hours = Math.round(minutes / 60);
  if (hours < 48) {
    return "".concat(hours, "h ago");
  }
  var days = Math.round(hours / 24);
  return "".concat(days, "d ago");
}
function resolveSubagentLabel(entry, fallback) {
  var _a, _b;
  if (fallback === void 0) {
    fallback = "subagent";
  }
  var raw =
    ((_a = entry.label) === null || _a === void 0 ? void 0 : _a.trim()) ||
    ((_b = entry.task) === null || _b === void 0 ? void 0 : _b.trim()) ||
    "";
  return raw || fallback;
}
function formatRunLabel(entry, options) {
  var _a;
  var raw = resolveSubagentLabel(entry);
  var maxLength =
    (_a = options === null || options === void 0 ? void 0 : options.maxLength) !== null &&
    _a !== void 0
      ? _a
      : 72;
  if (!Number.isFinite(maxLength) || maxLength <= 0) {
    return raw;
  }
  return raw.length > maxLength
    ? "".concat((0, utils_js_1.truncateUtf16Safe)(raw, maxLength).trimEnd(), "\u2026")
    : raw;
}
function formatRunStatus(entry) {
  var _a, _b;
  if (!entry.endedAt) {
    return "running";
  }
  var status =
    (_b = (_a = entry.outcome) === null || _a === void 0 ? void 0 : _a.status) !== null &&
    _b !== void 0
      ? _b
      : "done";
  return status === "ok" ? "done" : status;
}
function sortSubagentRuns(runs) {
  return __spreadArray([], runs, true).toSorted(function (a, b) {
    var _a, _b, _c, _d;
    var aTime =
      (_b = (_a = a.startedAt) !== null && _a !== void 0 ? _a : a.createdAt) !== null &&
      _b !== void 0
        ? _b
        : 0;
    var bTime =
      (_d = (_c = b.startedAt) !== null && _c !== void 0 ? _c : b.createdAt) !== null &&
      _d !== void 0
        ? _d
        : 0;
    return bTime - aTime;
  });
}
