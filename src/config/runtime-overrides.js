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
exports.getConfigOverrides = getConfigOverrides;
exports.resetConfigOverrides = resetConfigOverrides;
exports.setConfigOverride = setConfigOverride;
exports.unsetConfigOverride = unsetConfigOverride;
exports.applyConfigOverrides = applyConfigOverrides;
var config_paths_js_1 = require("./config-paths.js");
var overrides = {};
function mergeOverrides(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override;
  }
  var next = __assign({}, base);
  for (var _i = 0, _a = Object.entries(override); _i < _a.length; _i++) {
    var _b = _a[_i],
      key = _b[0],
      value = _b[1];
    if (value === undefined) {
      continue;
    }
    next[key] = mergeOverrides(base[key], value);
  }
  return next;
}
function isPlainObject(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}
function getConfigOverrides() {
  return overrides;
}
function resetConfigOverrides() {
  overrides = {};
}
function setConfigOverride(pathRaw, value) {
  var _a;
  var parsed = (0, config_paths_js_1.parseConfigPath)(pathRaw);
  if (!parsed.ok || !parsed.path) {
    return {
      ok: false,
      error: (_a = parsed.error) !== null && _a !== void 0 ? _a : "Invalid path.",
    };
  }
  (0, config_paths_js_1.setConfigValueAtPath)(overrides, parsed.path, value);
  return { ok: true };
}
function unsetConfigOverride(pathRaw) {
  var _a;
  var parsed = (0, config_paths_js_1.parseConfigPath)(pathRaw);
  if (!parsed.ok || !parsed.path) {
    return {
      ok: false,
      removed: false,
      error: (_a = parsed.error) !== null && _a !== void 0 ? _a : "Invalid path.",
    };
  }
  var removed = (0, config_paths_js_1.unsetConfigValueAtPath)(overrides, parsed.path);
  return { ok: true, removed: removed };
}
function applyConfigOverrides(cfg) {
  if (!overrides || Object.keys(overrides).length === 0) {
    return cfg;
  }
  return mergeOverrides(cfg, overrides);
}
