"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCommitHash = void 0;
var node_fs_1 = require("node:fs");
var node_module_1 = require("node:module");
var node_path_1 = require("node:path");
var formatCommit = function (value) {
  if (!value) {
    return null;
  }
  var trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed.length > 7 ? trimmed.slice(0, 7) : trimmed;
};
var resolveGitHead = function (startDir) {
  var current = startDir;
  for (var i = 0; i < 12; i += 1) {
    var gitPath = node_path_1.default.join(current, ".git");
    try {
      var stat = node_fs_1.default.statSync(gitPath);
      if (stat.isDirectory()) {
        return node_path_1.default.join(gitPath, "HEAD");
      }
      if (stat.isFile()) {
        var raw = node_fs_1.default.readFileSync(gitPath, "utf-8");
        var match = raw.match(/gitdir:\s*(.+)/i);
        if (match === null || match === void 0 ? void 0 : match[1]) {
          var resolved = node_path_1.default.resolve(current, match[1].trim());
          return node_path_1.default.join(resolved, "HEAD");
        }
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
};
var cachedCommit;
var readCommitFromPackageJson = function () {
  var _a, _b;
  try {
    var require_1 = (0, node_module_1.createRequire)(import.meta.url);
    var pkg = require_1("../../package.json");
    return formatCommit(
      (_b = (_a = pkg.gitHead) !== null && _a !== void 0 ? _a : pkg.githead) !== null &&
        _b !== void 0
        ? _b
        : null,
    );
  } catch (_c) {
    return null;
  }
};
var readCommitFromBuildInfo = function () {
  var _a;
  try {
    var require_2 = (0, node_module_1.createRequire)(import.meta.url);
    var info = require_2("../build-info.json");
    return formatCommit((_a = info.commit) !== null && _a !== void 0 ? _a : null);
  } catch (_b) {
    return null;
  }
};
var resolveCommitHash = function (options) {
  var _a, _b, _c, _d;
  if (options === void 0) {
    options = {};
  }
  if (cachedCommit !== undefined) {
    return cachedCommit;
  }
  var env = (_a = options.env) !== null && _a !== void 0 ? _a : process.env;
  var envCommit =
    ((_b = env.GIT_COMMIT) === null || _b === void 0 ? void 0 : _b.trim()) ||
    ((_c = env.GIT_SHA) === null || _c === void 0 ? void 0 : _c.trim());
  var normalized = formatCommit(envCommit);
  if (normalized) {
    cachedCommit = normalized;
    return cachedCommit;
  }
  var buildInfoCommit = readCommitFromBuildInfo();
  if (buildInfoCommit) {
    cachedCommit = buildInfoCommit;
    return cachedCommit;
  }
  var pkgCommit = readCommitFromPackageJson();
  if (pkgCommit) {
    cachedCommit = pkgCommit;
    return cachedCommit;
  }
  try {
    var headPath = resolveGitHead(
      (_d = options.cwd) !== null && _d !== void 0 ? _d : process.cwd(),
    );
    if (!headPath) {
      cachedCommit = null;
      return cachedCommit;
    }
    var head = node_fs_1.default.readFileSync(headPath, "utf-8").trim();
    if (!head) {
      cachedCommit = null;
      return cachedCommit;
    }
    if (head.startsWith("ref:")) {
      var ref = head.replace(/^ref:\s*/i, "").trim();
      var refPath = node_path_1.default.resolve(node_path_1.default.dirname(headPath), ref);
      var refHash = node_fs_1.default.readFileSync(refPath, "utf-8").trim();
      cachedCommit = formatCommit(refHash);
      return cachedCommit;
    }
    cachedCommit = formatCommit(head);
    return cachedCommit;
  } catch (_e) {
    cachedCommit = null;
    return cachedCommit;
  }
};
exports.resolveCommitHash = resolveCommitHash;
