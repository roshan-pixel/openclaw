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
exports.DEFAULT_LOG_FILE = exports.DEFAULT_LOG_DIR = void 0;
exports.isFileLogLevelEnabled = isFileLogLevelEnabled;
exports.getLogger = getLogger;
exports.getChildLogger = getChildLogger;
exports.toPinoLikeLogger = toPinoLikeLogger;
exports.getResolvedLoggerSettings = getResolvedLoggerSettings;
exports.setLoggerOverride = setLoggerOverride;
exports.resetLogger = resetLogger;
exports.registerLogTransport = registerLogTransport;
var node_module_1 = require("node:module");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var tslog_1 = require("tslog");
var levels_js_1 = require("./levels.js");
var config_js_1 = require("./config.js");
var state_js_1 = require("./state.js");
// Pin to /tmp so mac Debug UI and docs match; os.tmpdir() can be a per-user
// randomized path on macOS which made the “Open log” button a no-op.
exports.DEFAULT_LOG_DIR = "/tmp/openclaw";
exports.DEFAULT_LOG_FILE = node_path_1.default.join(exports.DEFAULT_LOG_DIR, "openclaw.log"); // legacy single-file path
var LOG_PREFIX = "openclaw";
var LOG_SUFFIX = ".log";
var MAX_LOG_AGE_MS = 24 * 60 * 60 * 1000; // 24h
var requireConfig = (0, node_module_1.createRequire)(import.meta.url);
var externalTransports = new Set();
function attachExternalTransport(logger, transport) {
  logger.attachTransport(function (logObj) {
    if (!externalTransports.has(transport)) {
      return;
    }
    try {
      transport(logObj);
    } catch (_a) {
      // never block on logging failures
    }
  });
}
function resolveSettings() {
  var _a, _b, _c;
  var cfg =
    (_a = state_js_1.loggingState.overrideSettings) !== null && _a !== void 0
      ? _a
      : (0, config_js_1.readLoggingConfig)();
  if (!cfg) {
    try {
      var loaded = requireConfig("../config/config.js");
      cfg = (_b = loaded.loadConfig) === null || _b === void 0 ? void 0 : _b.call(loaded).logging;
    } catch (_d) {
      cfg = undefined;
    }
  }
  var level = (0, levels_js_1.normalizeLogLevel)(
    cfg === null || cfg === void 0 ? void 0 : cfg.level,
    "info",
  );
  var file =
    (_c = cfg === null || cfg === void 0 ? void 0 : cfg.file) !== null && _c !== void 0
      ? _c
      : defaultRollingPathForToday();
  return { level: level, file: file };
}
function settingsChanged(a, b) {
  if (!a) {
    return true;
  }
  return a.level !== b.level || a.file !== b.file;
}
function isFileLogLevelEnabled(level) {
  var _a;
  var settings =
    (_a = state_js_1.loggingState.cachedSettings) !== null && _a !== void 0
      ? _a
      : resolveSettings();
  if (!state_js_1.loggingState.cachedSettings) {
    state_js_1.loggingState.cachedSettings = settings;
  }
  if (settings.level === "silent") {
    return false;
  }
  return (
    (0, levels_js_1.levelToMinLevel)(level) <= (0, levels_js_1.levelToMinLevel)(settings.level)
  );
}
function buildLogger(settings) {
  node_fs_1.default.mkdirSync(node_path_1.default.dirname(settings.file), { recursive: true });
  // Clean up stale rolling logs when using a dated log filename.
  if (isRollingPath(settings.file)) {
    pruneOldRollingLogs(node_path_1.default.dirname(settings.file));
  }
  var logger = new tslog_1.Logger({
    name: "openclaw",
    minLevel: (0, levels_js_1.levelToMinLevel)(settings.level),
    type: "hidden", // no ansi formatting
  });
  logger.attachTransport(function (logObj) {
    var _a, _b, _c;
    try {
      var time =
        (_c =
          (_b = (_a = logObj.date) === null || _a === void 0 ? void 0 : _a.toISOString) === null ||
          _b === void 0
            ? void 0
            : _b.call(_a)) !== null && _c !== void 0
          ? _c
          : new Date().toISOString();
      var line = JSON.stringify(__assign(__assign({}, logObj), { time: time }));
      node_fs_1.default.appendFileSync(settings.file, "".concat(line, "\n"), { encoding: "utf8" });
    } catch (_d) {
      // never block on logging failures
    }
  });
  for (
    var _i = 0, externalTransports_1 = externalTransports;
    _i < externalTransports_1.length;
    _i++
  ) {
    var transport = externalTransports_1[_i];
    attachExternalTransport(logger, transport);
  }
  return logger;
}
function getLogger() {
  var settings = resolveSettings();
  var cachedLogger = state_js_1.loggingState.cachedLogger;
  var cachedSettings = state_js_1.loggingState.cachedSettings;
  if (!cachedLogger || settingsChanged(cachedSettings, settings)) {
    state_js_1.loggingState.cachedLogger = buildLogger(settings);
    state_js_1.loggingState.cachedSettings = settings;
  }
  return state_js_1.loggingState.cachedLogger;
}
function getChildLogger(bindings, opts) {
  var base = getLogger();
  var minLevel = (opts === null || opts === void 0 ? void 0 : opts.level)
    ? (0, levels_js_1.levelToMinLevel)(opts.level)
    : undefined;
  var name = bindings ? JSON.stringify(bindings) : undefined;
  return base.getSubLogger({
    name: name,
    minLevel: minLevel,
    prefix: bindings ? [name !== null && name !== void 0 ? name : ""] : [],
  });
}
// Baileys expects a pino-like logger shape. Provide a lightweight adapter.
function toPinoLikeLogger(logger, level) {
  var buildChild = function (bindings) {
    return toPinoLikeLogger(
      logger.getSubLogger({
        name: bindings ? JSON.stringify(bindings) : undefined,
      }),
      level,
    );
  };
  return {
    level: level,
    child: buildChild,
    trace: function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return logger.trace.apply(logger, args);
    },
    debug: function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return logger.debug.apply(logger, args);
    },
    info: function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return logger.info.apply(logger, args);
    },
    warn: function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return logger.warn.apply(logger, args);
    },
    error: function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return logger.error.apply(logger, args);
    },
    fatal: function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return logger.fatal.apply(logger, args);
    },
  };
}
function getResolvedLoggerSettings() {
  return resolveSettings();
}
// Test helpers
function setLoggerOverride(settings) {
  state_js_1.loggingState.overrideSettings = settings;
  state_js_1.loggingState.cachedLogger = null;
  state_js_1.loggingState.cachedSettings = null;
  state_js_1.loggingState.cachedConsoleSettings = null;
}
function resetLogger() {
  state_js_1.loggingState.cachedLogger = null;
  state_js_1.loggingState.cachedSettings = null;
  state_js_1.loggingState.cachedConsoleSettings = null;
  state_js_1.loggingState.overrideSettings = null;
}
function registerLogTransport(transport) {
  externalTransports.add(transport);
  var logger = state_js_1.loggingState.cachedLogger;
  if (logger) {
    attachExternalTransport(logger, transport);
  }
  return function () {
    externalTransports.delete(transport);
  };
}
function formatLocalDate(date) {
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var day = String(date.getDate()).padStart(2, "0");
  return "".concat(year, "-").concat(month, "-").concat(day);
}
function defaultRollingPathForToday() {
  var today = formatLocalDate(new Date());
  return node_path_1.default.join(
    exports.DEFAULT_LOG_DIR,
    "".concat(LOG_PREFIX, "-").concat(today).concat(LOG_SUFFIX),
  );
}
function isRollingPath(file) {
  var base = node_path_1.default.basename(file);
  return (
    base.startsWith("".concat(LOG_PREFIX, "-")) &&
    base.endsWith(LOG_SUFFIX) &&
    base.length === "".concat(LOG_PREFIX, "-YYYY-MM-DD").concat(LOG_SUFFIX).length
  );
}
function pruneOldRollingLogs(dir) {
  try {
    var entries = node_fs_1.default.readdirSync(dir, { withFileTypes: true });
    var cutoff = Date.now() - MAX_LOG_AGE_MS;
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
      var entry = entries_1[_i];
      if (!entry.isFile()) {
        continue;
      }
      if (!entry.name.startsWith("".concat(LOG_PREFIX, "-")) || !entry.name.endsWith(LOG_SUFFIX)) {
        continue;
      }
      var fullPath = node_path_1.default.join(dir, entry.name);
      try {
        var stat = node_fs_1.default.statSync(fullPath);
        if (stat.mtimeMs < cutoff) {
          node_fs_1.default.rmSync(fullPath, { force: true });
        }
      } catch (_a) {
        // ignore errors during pruning
      }
    }
  } catch (_b) {
    // ignore missing dir or read errors
  }
}
