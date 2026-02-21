"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeConfigPaths = normalizeConfigPaths;
var utils_js_1 = require("../utils.js");
var PATH_VALUE_RE = /^~(?=$|[\\/])/;
var PATH_KEY_RE = /(dir|path|paths|file|root|workspace)$/i;
var PATH_LIST_KEYS = new Set(["paths", "pathPrepend"]);
function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function normalizeStringValue(key, value) {
  if (!PATH_VALUE_RE.test(value.trim())) {
    return value;
  }
  if (!key) {
    return value;
  }
  if (PATH_KEY_RE.test(key) || PATH_LIST_KEYS.has(key)) {
    return (0, utils_js_1.resolveUserPath)(value);
  }
  return value;
}
function normalizeAny(key, value) {
  if (typeof value === "string") {
    return normalizeStringValue(key, value);
  }
  if (Array.isArray(value)) {
    var normalizeChildren_1 = Boolean(key && PATH_LIST_KEYS.has(key));
    return value.map(function (entry) {
      if (typeof entry === "string") {
        return normalizeChildren_1 ? normalizeStringValue(key, entry) : entry;
      }
      if (Array.isArray(entry)) {
        return normalizeAny(undefined, entry);
      }
      if (isPlainObject(entry)) {
        return normalizeAny(undefined, entry);
      }
      return entry;
    });
  }
  if (!isPlainObject(value)) {
    return value;
  }
  for (var _i = 0, _a = Object.entries(value); _i < _a.length; _i++) {
    var _b = _a[_i],
      childKey = _b[0],
      childValue = _b[1];
    var next = normalizeAny(childKey, childValue);
    if (next !== childValue) {
      value[childKey] = next;
    }
  }
  return value;
}
/**
 * Normalize "~" paths in path-ish config fields.
 *
 * Goal: accept `~/...` consistently across config file + env overrides, while
 * keeping the surface area small and predictable.
 */
function normalizeConfigPaths(cfg) {
  if (!cfg || typeof cfg !== "object") {
    return cfg;
  }
  normalizeAny(undefined, cfg);
  return cfg;
}
