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
exports.resolveDiagnosticFlags = resolveDiagnosticFlags;
exports.matchesDiagnosticFlag = matchesDiagnosticFlag;
exports.isDiagnosticFlagEnabled = isDiagnosticFlagEnabled;
var DIAGNOSTICS_ENV = "OPENCLAW_DIAGNOSTICS";
function normalizeFlag(value) {
  return value.trim().toLowerCase();
}
function parseEnvFlags(raw) {
  if (!raw) {
    return [];
  }
  var trimmed = raw.trim();
  if (!trimmed) {
    return [];
  }
  var lowered = trimmed.toLowerCase();
  if (["0", "false", "off", "none"].includes(lowered)) {
    return [];
  }
  if (["1", "true", "all", "*"].includes(lowered)) {
    return ["*"];
  }
  return trimmed
    .split(/[,\s]+/)
    .map(normalizeFlag)
    .filter(Boolean);
}
function uniqueFlags(flags) {
  var seen = new Set();
  var out = [];
  for (var _i = 0, flags_1 = flags; _i < flags_1.length; _i++) {
    var flag = flags_1[_i];
    var normalized = normalizeFlag(flag);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}
function resolveDiagnosticFlags(cfg, env) {
  var _a, _b;
  if (env === void 0) {
    env = process.env;
  }
  var configFlags = Array.isArray(
    (_a = cfg === null || cfg === void 0 ? void 0 : cfg.diagnostics) === null || _a === void 0
      ? void 0
      : _a.flags,
  )
    ? (_b = cfg === null || cfg === void 0 ? void 0 : cfg.diagnostics) === null || _b === void 0
      ? void 0
      : _b.flags
    : [];
  var envFlags = parseEnvFlags(env[DIAGNOSTICS_ENV]);
  return uniqueFlags(__spreadArray(__spreadArray([], configFlags, true), envFlags, true));
}
function matchesDiagnosticFlag(flag, enabledFlags) {
  var target = normalizeFlag(flag);
  if (!target) {
    return false;
  }
  for (var _i = 0, enabledFlags_1 = enabledFlags; _i < enabledFlags_1.length; _i++) {
    var raw = enabledFlags_1[_i];
    var enabled = normalizeFlag(raw);
    if (!enabled) {
      continue;
    }
    if (enabled === "*" || enabled === "all") {
      return true;
    }
    if (enabled.endsWith(".*")) {
      var prefix = enabled.slice(0, -2);
      if (target === prefix || target.startsWith("".concat(prefix, "."))) {
        return true;
      }
    }
    if (enabled.endsWith("*")) {
      var prefix = enabled.slice(0, -1);
      if (target.startsWith(prefix)) {
        return true;
      }
    }
    if (enabled === target) {
      return true;
    }
  }
  return false;
}
function isDiagnosticFlagEnabled(flag, cfg, env) {
  if (env === void 0) {
    env = process.env;
  }
  var flags = resolveDiagnosticFlags(cfg, env);
  return matchesDiagnosticFlag(flag, flags);
}
