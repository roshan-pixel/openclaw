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
exports.buildSystemPromptParams = buildSystemPromptParams;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var date_time_js_1 = require("./date-time.js");
function buildSystemPromptParams(params) {
  var _a, _b, _c, _d, _e, _f;
  var repoRoot = resolveRepoRoot({
    config: params.config,
    workspaceDir: params.workspaceDir,
    cwd: params.cwd,
  });
  var userTimezone = (0, date_time_js_1.resolveUserTimezone)(
    (_c =
      (_b = (_a = params.config) === null || _a === void 0 ? void 0 : _a.agents) === null ||
      _b === void 0
        ? void 0
        : _b.defaults) === null || _c === void 0
      ? void 0
      : _c.userTimezone,
  );
  var userTimeFormat = (0, date_time_js_1.resolveUserTimeFormat)(
    (_f =
      (_e = (_d = params.config) === null || _d === void 0 ? void 0 : _d.agents) === null ||
      _e === void 0
        ? void 0
        : _e.defaults) === null || _f === void 0
      ? void 0
      : _f.timeFormat,
  );
  var userTime = (0, date_time_js_1.formatUserTime)(new Date(), userTimezone, userTimeFormat);
  return {
    runtimeInfo: __assign(__assign({ agentId: params.agentId }, params.runtime), {
      repoRoot: repoRoot,
    }),
    userTimezone: userTimezone,
    userTime: userTime,
    userTimeFormat: userTimeFormat,
  };
}
function resolveRepoRoot(params) {
  var _a, _b, _c, _d;
  var configured =
    (_d =
      (_c =
        (_b = (_a = params.config) === null || _a === void 0 ? void 0 : _a.agents) === null ||
        _b === void 0
          ? void 0
          : _b.defaults) === null || _c === void 0
        ? void 0
        : _c.repoRoot) === null || _d === void 0
      ? void 0
      : _d.trim();
  if (configured) {
    try {
      var resolved = node_path_1.default.resolve(configured);
      var stat = node_fs_1.default.statSync(resolved);
      if (stat.isDirectory()) {
        return resolved;
      }
    } catch (_e) {
      // ignore invalid config path
    }
  }
  var candidates = [params.workspaceDir, params.cwd]
    .map(function (value) {
      return value === null || value === void 0 ? void 0 : value.trim();
    })
    .filter(Boolean);
  var seen = new Set();
  for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
    var candidate = candidates_1[_i];
    var resolved = node_path_1.default.resolve(candidate);
    if (seen.has(resolved)) {
      continue;
    }
    seen.add(resolved);
    var root = findGitRoot(resolved);
    if (root) {
      return root;
    }
  }
  return undefined;
}
function findGitRoot(startDir) {
  var current = node_path_1.default.resolve(startDir);
  for (var i = 0; i < 12; i += 1) {
    var gitPath = node_path_1.default.join(current, ".git");
    try {
      var stat = node_fs_1.default.statSync(gitPath);
      if (stat.isDirectory() || stat.isFile()) {
        return current;
      }
    } catch (_a) {
      // ignore missing .git at this level
    }
    var parent_1 = node_path_1.default.dirname(current);
    if (parent_1 === current) {
      break;
    }
    current = parent_1;
  }
  return null;
}
