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
exports.computeSandboxConfigHash = computeSandboxConfigHash;
var node_crypto_1 = require("node:crypto");
function isPrimitive(value) {
  return value === null || (typeof value !== "object" && typeof value !== "function");
}
function normalizeForHash(value) {
  if (value === undefined) {
    return undefined;
  }
  if (Array.isArray(value)) {
    var normalized = value.map(normalizeForHash).filter(function (item) {
      return item !== undefined;
    });
    var primitives = normalized.filter(isPrimitive);
    if (primitives.length === normalized.length) {
      return __spreadArray([], primitives, true).toSorted(function (a, b) {
        return primitiveToString(a).localeCompare(primitiveToString(b));
      });
    }
    return normalized;
  }
  if (value && typeof value === "object") {
    var entries = Object.entries(value).toSorted(function (_a, _b) {
      var a = _a[0];
      var b = _b[0];
      return a.localeCompare(b);
    });
    var normalized = {};
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
      var _a = entries_1[_i],
        key = _a[0],
        entryValue = _a[1];
      var next = normalizeForHash(entryValue);
      if (next !== undefined) {
        normalized[key] = next;
      }
    }
    return normalized;
  }
  return value;
}
function primitiveToString(value) {
  if (value === null) {
    return "null";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return JSON.stringify(value);
}
function computeSandboxConfigHash(input) {
  var payload = normalizeForHash(input);
  var raw = JSON.stringify(payload);
  return node_crypto_1.default.createHash("sha1").update(raw).digest("hex");
}
