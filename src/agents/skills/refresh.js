"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SKILLS_WATCH_IGNORED = void 0;
exports.registerSkillsChangeListener = registerSkillsChangeListener;
exports.bumpSkillsSnapshotVersion = bumpSkillsSnapshotVersion;
exports.getSkillsSnapshotVersion = getSkillsSnapshotVersion;
exports.ensureSkillsWatcher = ensureSkillsWatcher;
var node_path_1 = require("node:path");
var chokidar_1 = require("chokidar");
var subsystem_js_1 = require("../../logging/subsystem.js");
var utils_js_1 = require("../../utils.js");
var plugin_skills_js_1 = require("./plugin-skills.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("gateway/skills");
var listeners = new Set();
var workspaceVersions = new Map();
var watchers = new Map();
var globalVersion = 0;
exports.DEFAULT_SKILLS_WATCH_IGNORED = [
  /(^|[\\/])\.git([\\/]|$)/,
  /(^|[\\/])node_modules([\\/]|$)/,
  /(^|[\\/])dist([\\/]|$)/,
];
function bumpVersion(current) {
  var now = Date.now();
  return now <= current ? current + 1 : now;
}
function emit(event) {
  for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
    var listener = listeners_1[_i];
    try {
      listener(event);
    } catch (err) {
      log.warn("skills change listener failed: ".concat(String(err)));
    }
  }
}
function resolveWatchPaths(workspaceDir, config) {
  var _a, _b, _c;
  var paths = [];
  if (workspaceDir.trim()) {
    paths.push(node_path_1.default.join(workspaceDir, "skills"));
  }
  paths.push(node_path_1.default.join(utils_js_1.CONFIG_DIR, "skills"));
  var extraDirsRaw =
    (_c =
      (_b =
        (_a = config === null || config === void 0 ? void 0 : config.skills) === null ||
        _a === void 0
          ? void 0
          : _a.load) === null || _b === void 0
        ? void 0
        : _b.extraDirs) !== null && _c !== void 0
      ? _c
      : [];
  var extraDirs = extraDirsRaw
    .map(function (d) {
      return typeof d === "string" ? d.trim() : "";
    })
    .filter(Boolean)
    .map(function (dir) {
      return (0, utils_js_1.resolveUserPath)(dir);
    });
  paths.push.apply(paths, extraDirs);
  var pluginSkillDirs = (0, plugin_skills_js_1.resolvePluginSkillDirs)({
    workspaceDir: workspaceDir,
    config: config,
  });
  paths.push.apply(paths, pluginSkillDirs);
  return paths;
}
function registerSkillsChangeListener(listener) {
  listeners.add(listener);
  return function () {
    listeners.delete(listener);
  };
}
function bumpSkillsSnapshotVersion(params) {
  var _a, _b;
  var reason =
    (_a = params === null || params === void 0 ? void 0 : params.reason) !== null && _a !== void 0
      ? _a
      : "manual";
  var changedPath = params === null || params === void 0 ? void 0 : params.changedPath;
  if (params === null || params === void 0 ? void 0 : params.workspaceDir) {
    var current =
      (_b = workspaceVersions.get(params.workspaceDir)) !== null && _b !== void 0 ? _b : 0;
    var next = bumpVersion(current);
    workspaceVersions.set(params.workspaceDir, next);
    emit({ workspaceDir: params.workspaceDir, reason: reason, changedPath: changedPath });
    return next;
  }
  globalVersion = bumpVersion(globalVersion);
  emit({ reason: reason, changedPath: changedPath });
  return globalVersion;
}
function getSkillsSnapshotVersion(workspaceDir) {
  var _a;
  if (!workspaceDir) return globalVersion;
  var local = (_a = workspaceVersions.get(workspaceDir)) !== null && _a !== void 0 ? _a : 0;
  return Math.max(globalVersion, local);
}
function ensureSkillsWatcher(params) {
  var _a, _b, _c, _d, _e, _f;
  var workspaceDir = params.workspaceDir.trim();
  if (!workspaceDir) return;
  var watchEnabled =
    ((_c =
      (_b = (_a = params.config) === null || _a === void 0 ? void 0 : _a.skills) === null ||
      _b === void 0
        ? void 0
        : _b.load) === null || _c === void 0
      ? void 0
      : _c.watch) !== false;
  var debounceMsRaw =
    (_f =
      (_e = (_d = params.config) === null || _d === void 0 ? void 0 : _d.skills) === null ||
      _e === void 0
        ? void 0
        : _e.load) === null || _f === void 0
      ? void 0
      : _f.watchDebounceMs;
  var debounceMs =
    typeof debounceMsRaw === "number" && Number.isFinite(debounceMsRaw)
      ? Math.max(0, debounceMsRaw)
      : 250;
  var existing = watchers.get(workspaceDir);
  if (!watchEnabled) {
    if (existing) {
      watchers.delete(workspaceDir);
      if (existing.timer) clearTimeout(existing.timer);
      void existing.watcher.close().catch(function () {});
    }
    return;
  }
  var watchPaths = resolveWatchPaths(workspaceDir, params.config);
  var pathsKey = watchPaths.join("|");
  if (existing && existing.pathsKey === pathsKey && existing.debounceMs === debounceMs) {
    return;
  }
  if (existing) {
    watchers.delete(workspaceDir);
    if (existing.timer) clearTimeout(existing.timer);
    void existing.watcher.close().catch(function () {});
  }
  var watcher = chokidar_1.default.watch(watchPaths, {
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: debounceMs,
      pollInterval: 100,
    },
    // Avoid FD exhaustion on macOS when a workspace contains huge trees.
    // This watcher only needs to react to skill changes.
    ignored: exports.DEFAULT_SKILLS_WATCH_IGNORED,
  });
  var state = { watcher: watcher, pathsKey: pathsKey, debounceMs: debounceMs };
  var schedule = function (changedPath) {
    state.pendingPath =
      changedPath !== null && changedPath !== void 0 ? changedPath : state.pendingPath;
    if (state.timer) clearTimeout(state.timer);
    state.timer = setTimeout(function () {
      var pendingPath = state.pendingPath;
      state.pendingPath = undefined;
      state.timer = undefined;
      bumpSkillsSnapshotVersion({
        workspaceDir: workspaceDir,
        reason: "watch",
        changedPath: pendingPath,
      });
    }, debounceMs);
  };
  watcher.on("add", function (p) {
    return schedule(p);
  });
  watcher.on("change", function (p) {
    return schedule(p);
  });
  watcher.on("unlink", function (p) {
    return schedule(p);
  });
  watcher.on("error", function (err) {
    log.warn("skills watcher error (".concat(workspaceDir, "): ").concat(String(err)));
  });
  watchers.set(workspaceDir, state);
}
