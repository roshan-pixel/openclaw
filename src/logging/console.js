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
exports.getConsoleSettings = getConsoleSettings;
exports.getResolvedConsoleSettings = getResolvedConsoleSettings;
exports.routeLogsToStderr = routeLogsToStderr;
exports.setConsoleSubsystemFilter = setConsoleSubsystemFilter;
exports.setConsoleTimestampPrefix = setConsoleTimestampPrefix;
exports.shouldLogSubsystemToConsole = shouldLogSubsystemToConsole;
exports.enableConsoleCapture = enableConsoleCapture;
var node_module_1 = require("node:module");
var node_util_1 = require("node:util");
var globals_js_1 = require("../globals.js");
var ansi_js_1 = require("../terminal/ansi.js");
var levels_js_1 = require("./levels.js");
var logger_js_1 = require("./logger.js");
var config_js_1 = require("./config.js");
var state_js_1 = require("./state.js");
var requireConfig = (0, node_module_1.createRequire)(import.meta.url);
function normalizeConsoleLevel(level) {
  if ((0, globals_js_1.isVerbose)()) {
    return "debug";
  }
  return (0, levels_js_1.normalizeLogLevel)(level, "info");
}
function normalizeConsoleStyle(style) {
  if (style === "compact" || style === "json" || style === "pretty") {
    return style;
  }
  if (!process.stdout.isTTY) {
    return "compact";
  }
  return "pretty";
}
function resolveConsoleSettings() {
  var _a, _b;
  var cfg =
    (_a = state_js_1.loggingState.overrideSettings) !== null && _a !== void 0
      ? _a
      : (0, config_js_1.readLoggingConfig)();
  if (!cfg) {
    if (state_js_1.loggingState.resolvingConsoleSettings) {
      cfg = undefined;
    } else {
      state_js_1.loggingState.resolvingConsoleSettings = true;
      try {
        var loaded = requireConfig("../config/config.js");
        cfg = (_b = loaded.loadConfig) === null || _b === void 0 ? void 0 : _b.call(loaded).logging;
      } catch (_c) {
        cfg = undefined;
      } finally {
        state_js_1.loggingState.resolvingConsoleSettings = false;
      }
    }
  }
  var level = normalizeConsoleLevel(cfg === null || cfg === void 0 ? void 0 : cfg.consoleLevel);
  var style = normalizeConsoleStyle(cfg === null || cfg === void 0 ? void 0 : cfg.consoleStyle);
  return { level: level, style: style };
}
function consoleSettingsChanged(a, b) {
  if (!a) {
    return true;
  }
  return a.level !== b.level || a.style !== b.style;
}
function getConsoleSettings() {
  var settings = resolveConsoleSettings();
  var cached = state_js_1.loggingState.cachedConsoleSettings;
  if (!cached || consoleSettingsChanged(cached, settings)) {
    state_js_1.loggingState.cachedConsoleSettings = settings;
  }
  return state_js_1.loggingState.cachedConsoleSettings;
}
function getResolvedConsoleSettings() {
  return getConsoleSettings();
}
// Route all console output (including tslog console writes) to stderr.
// This keeps stdout clean for RPC/JSON modes.
function routeLogsToStderr() {
  state_js_1.loggingState.forceConsoleToStderr = true;
}
function setConsoleSubsystemFilter(filters) {
  if (!filters || filters.length === 0) {
    state_js_1.loggingState.consoleSubsystemFilter = null;
    return;
  }
  var normalized = filters
    .map(function (value) {
      return value.trim();
    })
    .filter(function (value) {
      return value.length > 0;
    });
  state_js_1.loggingState.consoleSubsystemFilter = normalized.length > 0 ? normalized : null;
}
function setConsoleTimestampPrefix(enabled) {
  state_js_1.loggingState.consoleTimestampPrefix = enabled;
}
function shouldLogSubsystemToConsole(subsystem) {
  var filter = state_js_1.loggingState.consoleSubsystemFilter;
  if (!filter || filter.length === 0) {
    return true;
  }
  return filter.some(function (prefix) {
    return subsystem === prefix || subsystem.startsWith("".concat(prefix, "/"));
  });
}
var SUPPRESSED_CONSOLE_PREFIXES = [
  "Closing session:",
  "Opening session:",
  "Removing old closed session:",
  "Session already closed",
  "Session already open",
];
function shouldSuppressConsoleMessage(message) {
  if ((0, globals_js_1.isVerbose)()) {
    return false;
  }
  if (
    SUPPRESSED_CONSOLE_PREFIXES.some(function (prefix) {
      return message.startsWith(prefix);
    })
  ) {
    return true;
  }
  if (
    message.startsWith("[EventQueue] Slow listener detected") &&
    message.includes("DiscordMessageListener")
  ) {
    return true;
  }
  return false;
}
function isEpipeError(err) {
  var code = err === null || err === void 0 ? void 0 : err.code;
  return code === "EPIPE" || code === "EIO";
}
function formatConsoleTimestamp(style) {
  var now = new Date().toISOString();
  if (style === "pretty") {
    return now.slice(11, 19);
  }
  return now;
}
function hasTimestampPrefix(value) {
  return /^(?:\d{2}:\d{2}:\d{2}|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)/.test(value);
}
function isJsonPayload(value) {
  var trimmed = value.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return false;
  }
  try {
    JSON.parse(trimmed);
    return true;
  } catch (_a) {
    return false;
  }
}
/**
 * Route console.* calls through file logging while still emitting to stdout/stderr.
 * This keeps user-facing output unchanged but guarantees every console call is captured in log files.
 */
function enableConsoleCapture() {
  if (state_js_1.loggingState.consolePatched) {
    return;
  }
  state_js_1.loggingState.consolePatched = true;
  var logger = null;
  var getLoggerLazy = function () {
    if (!logger) {
      logger = (0, logger_js_1.getLogger)();
    }
    return logger;
  };
  var original = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
    trace: console.trace,
  };
  state_js_1.loggingState.rawConsole = {
    log: original.log,
    info: original.info,
    warn: original.warn,
    error: original.error,
  };
  var forward = function (level, orig) {
    return function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      var formatted = node_util_1.default.format.apply(node_util_1.default, args);
      if (shouldSuppressConsoleMessage(formatted)) {
        return;
      }
      var trimmed = (0, ansi_js_1.stripAnsi)(formatted).trimStart();
      var shouldPrefixTimestamp =
        state_js_1.loggingState.consoleTimestampPrefix &&
        trimmed.length > 0 &&
        !hasTimestampPrefix(trimmed) &&
        !isJsonPayload(trimmed);
      var timestamp = shouldPrefixTimestamp
        ? formatConsoleTimestamp(getConsoleSettings().style)
        : "";
      try {
        var resolvedLogger = getLoggerLazy();
        // Map console levels to file logger
        if (level === "trace") {
          resolvedLogger.trace(formatted);
        } else if (level === "debug") {
          resolvedLogger.debug(formatted);
        } else if (level === "info") {
          resolvedLogger.info(formatted);
        } else if (level === "warn") {
          resolvedLogger.warn(formatted);
        } else if (level === "error" || level === "fatal") {
          resolvedLogger.error(formatted);
        } else {
          resolvedLogger.info(formatted);
        }
      } catch (_a) {
        // never block console output on logging failures
      }
      if (state_js_1.loggingState.forceConsoleToStderr) {
        // in RPC/JSON mode, keep stdout clean
        try {
          var line = timestamp ? "".concat(timestamp, " ").concat(formatted) : formatted;
          process.stderr.write("".concat(line, "\n"));
        } catch (err) {
          if (isEpipeError(err)) {
            return;
          }
          throw err;
        }
      } else {
        try {
          if (!timestamp) {
            orig.apply(console, args);
            return;
          }
          if (args.length === 0) {
            orig.call(console, timestamp);
            return;
          }
          if (typeof args[0] === "string") {
            orig.call.apply(
              orig,
              __spreadArray(
                [console, "".concat(timestamp, " ").concat(args[0])],
                args.slice(1),
                false,
              ),
            );
            return;
          }
          orig.call.apply(orig, __spreadArray([console, timestamp], args, false));
        } catch (err) {
          if (isEpipeError(err)) {
            return;
          }
          throw err;
        }
      }
    };
  };
  console.log = forward("info", original.log);
  console.info = forward("info", original.info);
  console.warn = forward("warn", original.warn);
  console.error = forward("error", original.error);
  console.debug = forward("debug", original.debug);
  console.trace = forward("trace", original.trace);
}
