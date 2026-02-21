"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveConfigPath = resolveConfigPath;
exports.isConfigPathTruthy = isConfigPathTruthy;
exports.resolveSkillConfig = resolveSkillConfig;
exports.resolveRuntimePlatform = resolveRuntimePlatform;
exports.resolveBundledAllowlist = resolveBundledAllowlist;
exports.isBundledSkillAllowed = isBundledSkillAllowed;
exports.hasBinary = hasBinary;
exports.shouldIncludeSkill = shouldIncludeSkill;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var frontmatter_js_1 = require("./frontmatter.js");
var DEFAULT_CONFIG_VALUES = {
  "browser.enabled": true,
  "browser.evaluateEnabled": true,
};
function isTruthy(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}
function resolveConfigPath(config, pathStr) {
  var parts = pathStr.split(".").filter(Boolean);
  var current = config;
  for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
    var part = parts_1[_i];
    if (typeof current !== "object" || current === null) return undefined;
    current = current[part];
  }
  return current;
}
function isConfigPathTruthy(config, pathStr) {
  var value = resolveConfigPath(config, pathStr);
  if (value === undefined && pathStr in DEFAULT_CONFIG_VALUES) {
    return DEFAULT_CONFIG_VALUES[pathStr] === true;
  }
  return isTruthy(value);
}
function resolveSkillConfig(config, skillKey) {
  var _a;
  var skills =
    (_a = config === null || config === void 0 ? void 0 : config.skills) === null || _a === void 0
      ? void 0
      : _a.entries;
  if (!skills || typeof skills !== "object") return undefined;
  var entry = skills[skillKey];
  if (!entry || typeof entry !== "object") return undefined;
  return entry;
}
function resolveRuntimePlatform() {
  return process.platform;
}
function normalizeAllowlist(input) {
  if (!input) return undefined;
  if (!Array.isArray(input)) return undefined;
  var normalized = input
    .map(function (entry) {
      return String(entry).trim();
    })
    .filter(Boolean);
  return normalized.length > 0 ? normalized : undefined;
}
var BUNDLED_SOURCES = new Set(["openclaw-bundled"]);
function isBundledSkill(entry) {
  return BUNDLED_SOURCES.has(entry.skill.source);
}
function resolveBundledAllowlist(config) {
  var _a;
  return normalizeAllowlist(
    (_a = config === null || config === void 0 ? void 0 : config.skills) === null || _a === void 0
      ? void 0
      : _a.allowBundled,
  );
}
function isBundledSkillAllowed(entry, allowlist) {
  if (!allowlist || allowlist.length === 0) return true;
  if (!isBundledSkill(entry)) return true;
  var key = (0, frontmatter_js_1.resolveSkillKey)(entry.skill, entry);
  return allowlist.includes(key) || allowlist.includes(entry.skill.name);
}
function hasBinary(bin) {
  var _a;
  var pathEnv = (_a = process.env.PATH) !== null && _a !== void 0 ? _a : "";
  var parts = pathEnv.split(node_path_1.default.delimiter).filter(Boolean);
  for (var _i = 0, parts_2 = parts; _i < parts_2.length; _i++) {
    var part = parts_2[_i];
    var candidate = node_path_1.default.join(part, bin);
    try {
      node_fs_1.default.accessSync(candidate, node_fs_1.default.constants.X_OK);
      return true;
    } catch (_b) {
      // keep scanning
    }
  }
  return false;
}
function shouldIncludeSkill(params) {
  var _a,
    _b,
    _c,
    _d,
    _e,
    _f,
    _g,
    _h,
    _j,
    _k,
    _l,
    _m,
    _o,
    _p,
    _q,
    _r,
    _s,
    _t,
    _u,
    _v,
    _w,
    _x,
    _y,
    _z;
  var entry = params.entry,
    config = params.config,
    eligibility = params.eligibility;
  var skillKey = (0, frontmatter_js_1.resolveSkillKey)(entry.skill, entry);
  var skillConfig = resolveSkillConfig(config, skillKey);
  var allowBundled = normalizeAllowlist(
    (_a = config === null || config === void 0 ? void 0 : config.skills) === null || _a === void 0
      ? void 0
      : _a.allowBundled,
  );
  var osList =
    (_c = (_b = entry.metadata) === null || _b === void 0 ? void 0 : _b.os) !== null &&
    _c !== void 0
      ? _c
      : [];
  var remotePlatforms =
    (_e =
      (_d = eligibility === null || eligibility === void 0 ? void 0 : eligibility.remote) ===
        null || _d === void 0
        ? void 0
        : _d.platforms) !== null && _e !== void 0
      ? _e
      : [];
  if ((skillConfig === null || skillConfig === void 0 ? void 0 : skillConfig.enabled) === false)
    return false;
  if (!isBundledSkillAllowed(entry, allowBundled)) return false;
  if (
    osList.length > 0 &&
    !osList.includes(resolveRuntimePlatform()) &&
    !remotePlatforms.some(function (platform) {
      return osList.includes(platform);
    })
  ) {
    return false;
  }
  if (((_f = entry.metadata) === null || _f === void 0 ? void 0 : _f.always) === true) {
    return true;
  }
  var requiredBins =
    (_j =
      (_h = (_g = entry.metadata) === null || _g === void 0 ? void 0 : _g.requires) === null ||
      _h === void 0
        ? void 0
        : _h.bins) !== null && _j !== void 0
      ? _j
      : [];
  if (requiredBins.length > 0) {
    for (var _i = 0, requiredBins_1 = requiredBins; _i < requiredBins_1.length; _i++) {
      var bin = requiredBins_1[_i];
      if (hasBinary(bin)) continue;
      if (
        (_l =
          (_k = eligibility === null || eligibility === void 0 ? void 0 : eligibility.remote) ===
            null || _k === void 0
            ? void 0
            : _k.hasBin) === null || _l === void 0
          ? void 0
          : _l.call(_k, bin)
      )
        continue;
      return false;
    }
  }
  var requiredAnyBins =
    (_p =
      (_o = (_m = entry.metadata) === null || _m === void 0 ? void 0 : _m.requires) === null ||
      _o === void 0
        ? void 0
        : _o.anyBins) !== null && _p !== void 0
      ? _p
      : [];
  if (requiredAnyBins.length > 0) {
    var anyFound =
      requiredAnyBins.some(function (bin) {
        return hasBinary(bin);
      }) ||
      ((_r =
        (_q = eligibility === null || eligibility === void 0 ? void 0 : eligibility.remote) ===
          null || _q === void 0
          ? void 0
          : _q.hasAnyBin) === null || _r === void 0
        ? void 0
        : _r.call(_q, requiredAnyBins));
    if (!anyFound) return false;
  }
  var requiredEnv =
    (_u =
      (_t = (_s = entry.metadata) === null || _s === void 0 ? void 0 : _s.requires) === null ||
      _t === void 0
        ? void 0
        : _t.env) !== null && _u !== void 0
      ? _u
      : [];
  if (requiredEnv.length > 0) {
    for (var _0 = 0, requiredEnv_1 = requiredEnv; _0 < requiredEnv_1.length; _0++) {
      var envName = requiredEnv_1[_0];
      if (process.env[envName]) continue;
      if (
        (_v = skillConfig === null || skillConfig === void 0 ? void 0 : skillConfig.env) === null ||
        _v === void 0
          ? void 0
          : _v[envName]
      )
        continue;
      if (
        (skillConfig === null || skillConfig === void 0 ? void 0 : skillConfig.apiKey) &&
        ((_w = entry.metadata) === null || _w === void 0 ? void 0 : _w.primaryEnv) === envName
      ) {
        continue;
      }
      return false;
    }
  }
  var requiredConfig =
    (_z =
      (_y = (_x = entry.metadata) === null || _x === void 0 ? void 0 : _x.requires) === null ||
      _y === void 0
        ? void 0
        : _y.config) !== null && _z !== void 0
      ? _z
      : [];
  if (requiredConfig.length > 0) {
    for (var _1 = 0, requiredConfig_1 = requiredConfig; _1 < requiredConfig_1.length; _1++) {
      var configPath = requiredConfig_1[_1];
      if (!isConfigPathTruthy(config, configPath)) return false;
    }
  }
  return true;
}
