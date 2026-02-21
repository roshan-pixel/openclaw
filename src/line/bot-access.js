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
exports.isSenderAllowed =
  exports.firstDefined =
  exports.normalizeAllowFromWithStore =
  exports.normalizeAllowFrom =
    void 0;
function normalizeAllowEntry(value) {
  var trimmed = String(value).trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed === "*") {
    return "*";
  }
  return trimmed.replace(/^line:(?:user:)?/i, "");
}
var normalizeAllowFrom = function (list) {
  var entries = (list !== null && list !== void 0 ? list : [])
    .map(function (value) {
      return normalizeAllowEntry(value);
    })
    .filter(Boolean);
  var hasWildcard = entries.includes("*");
  return {
    entries: entries,
    hasWildcard: hasWildcard,
    hasEntries: entries.length > 0,
  };
};
exports.normalizeAllowFrom = normalizeAllowFrom;
var normalizeAllowFromWithStore = function (params) {
  var _a, _b;
  var combined = __spreadArray(
    __spreadArray([], (_a = params.allowFrom) !== null && _a !== void 0 ? _a : [], true),
    (_b = params.storeAllowFrom) !== null && _b !== void 0 ? _b : [],
    true,
  );
  return (0, exports.normalizeAllowFrom)(combined);
};
exports.normalizeAllowFromWithStore = normalizeAllowFromWithStore;
var firstDefined = function () {
  var values = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    values[_i] = arguments[_i];
  }
  for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
    var value = values_1[_a];
    if (typeof value !== "undefined") {
      return value;
    }
  }
  return undefined;
};
exports.firstDefined = firstDefined;
var isSenderAllowed = function (params) {
  var allow = params.allow,
    senderId = params.senderId;
  if (!allow.hasEntries) {
    return false;
  }
  if (allow.hasWildcard) {
    return true;
  }
  if (!senderId) {
    return false;
  }
  return allow.entries.includes(senderId);
};
exports.isSenderAllowed = isSenderAllowed;
