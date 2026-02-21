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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }
    if (s != null && typeof Object.getOwnPropertySymbols === "function") {
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    }
    return t;
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSubagentRegistryPath = resolveSubagentRegistryPath;
exports.loadSubagentRegistryFromDisk = loadSubagentRegistryFromDisk;
exports.saveSubagentRegistryToDisk = saveSubagentRegistryToDisk;
var node_path_1 = require("node:path");
var paths_js_1 = require("../config/paths.js");
var json_file_js_1 = require("../infra/json-file.js");
var delivery_context_js_1 = require("../utils/delivery-context.js");
var REGISTRY_VERSION = 2;
function resolveSubagentRegistryPath() {
  return node_path_1.default.join(paths_js_1.STATE_DIR, "subagents", "runs.json");
}
function loadSubagentRegistryFromDisk() {
  var _a, _b;
  var pathname = resolveSubagentRegistryPath();
  var raw = (0, json_file_js_1.loadJsonFile)(pathname);
  if (!raw || typeof raw !== "object") {
    return new Map();
  }
  var record = raw;
  if (record.version !== 1 && record.version !== 2) {
    return new Map();
  }
  var runsRaw = record.runs;
  if (!runsRaw || typeof runsRaw !== "object") {
    return new Map();
  }
  var out = new Map();
  var isLegacy = record.version === 1;
  var migrated = false;
  for (var _i = 0, _c = Object.entries(runsRaw); _i < _c.length; _i++) {
    var _d = _c[_i],
      runId = _d[0],
      entry = _d[1];
    if (!entry || typeof entry !== "object") {
      continue;
    }
    var typed = entry;
    if (!typed.runId || typeof typed.runId !== "string") {
      continue;
    }
    var legacyCompletedAt =
      isLegacy && typeof typed.announceCompletedAt === "number"
        ? typed.announceCompletedAt
        : undefined;
    var cleanupCompletedAt =
      typeof typed.cleanupCompletedAt === "number" ? typed.cleanupCompletedAt : legacyCompletedAt;
    var cleanupHandled =
      typeof typed.cleanupHandled === "boolean"
        ? typed.cleanupHandled
        : isLegacy
          ? Boolean(
              (_a = typed.announceHandled) !== null && _a !== void 0 ? _a : cleanupCompletedAt,
            )
          : undefined;
    var requesterOrigin = (0, delivery_context_js_1.normalizeDeliveryContext)(
      (_b = typed.requesterOrigin) !== null && _b !== void 0
        ? _b
        : {
            channel:
              typeof typed.requesterChannel === "string" ? typed.requesterChannel : undefined,
            accountId:
              typeof typed.requesterAccountId === "string" ? typed.requesterAccountId : undefined,
          },
    );
    var _announceCompletedAt = typed.announceCompletedAt,
      _announceHandled = typed.announceHandled,
      _channel = typed.requesterChannel,
      _accountId = typed.requesterAccountId,
      rest = __rest(typed, [
        "announceCompletedAt",
        "announceHandled",
        "requesterChannel",
        "requesterAccountId",
      ]);
    out.set(
      runId,
      __assign(__assign({}, rest), {
        requesterOrigin: requesterOrigin,
        cleanupCompletedAt: cleanupCompletedAt,
        cleanupHandled: cleanupHandled,
      }),
    );
    if (isLegacy) {
      migrated = true;
    }
  }
  if (migrated) {
    try {
      saveSubagentRegistryToDisk(out);
    } catch (_e) {
      // ignore migration write failures
    }
  }
  return out;
}
function saveSubagentRegistryToDisk(runs) {
  var pathname = resolveSubagentRegistryPath();
  var serialized = {};
  for (var _i = 0, _a = runs.entries(); _i < _a.length; _i++) {
    var _b = _a[_i],
      runId = _b[0],
      entry = _b[1];
    serialized[runId] = entry;
  }
  var out = {
    version: REGISTRY_VERSION,
    runs: serialized,
  };
  (0, json_file_js_1.saveJsonFile)(pathname, out);
}
