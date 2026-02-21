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
exports.resolveSenderAllowMatch =
  exports.isSenderAllowed =
  exports.firstDefined =
  exports.normalizeAllowFromWithStore =
  exports.normalizeAllowFrom =
    void 0;
var normalizeAllowFrom = function (list) {
  var entries = (list !== null && list !== void 0 ? list : [])
    .map(function (value) {
      return String(value).trim();
    })
    .filter(Boolean);
  var hasWildcard = entries.includes("*");
  var normalized = entries
    .filter(function (value) {
      return value !== "*";
    })
    .map(function (value) {
      return value.replace(/^(telegram|tg):/i, "");
    });
  var normalizedLower = normalized.map(function (value) {
    return value.toLowerCase();
  });
  return {
    entries: normalized,
    entriesLower: normalizedLower,
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
  )
    .map(function (value) {
      return String(value).trim();
    })
    .filter(Boolean);
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
    senderId = params.senderId,
    senderUsername = params.senderUsername;
  if (!allow.hasEntries) {
    return true;
  }
  if (allow.hasWildcard) {
    return true;
  }
  if (senderId && allow.entries.includes(senderId)) {
    return true;
  }
  var username =
    senderUsername === null || senderUsername === void 0 ? void 0 : senderUsername.toLowerCase();
  if (!username) {
    return false;
  }
  return allow.entriesLower.some(function (entry) {
    return entry === username || entry === "@".concat(username);
  });
};
exports.isSenderAllowed = isSenderAllowed;
var resolveSenderAllowMatch = function (params) {
  var allow = params.allow,
    senderId = params.senderId,
    senderUsername = params.senderUsername;
  if (allow.hasWildcard) {
    return { allowed: true, matchKey: "*", matchSource: "wildcard" };
  }
  if (!allow.hasEntries) {
    return { allowed: false };
  }
  if (senderId && allow.entries.includes(senderId)) {
    return { allowed: true, matchKey: senderId, matchSource: "id" };
  }
  var username =
    senderUsername === null || senderUsername === void 0 ? void 0 : senderUsername.toLowerCase();
  if (!username) {
    return { allowed: false };
  }
  var entry = allow.entriesLower.find(function (candidate) {
    return candidate === username || candidate === "@".concat(username);
  });
  if (entry) {
    return { allowed: true, matchKey: entry, matchSource: "username" };
  }
  return { allowed: false };
};
exports.resolveSenderAllowMatch = resolveSenderAllowMatch;
