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
exports.stripRedundantSubsystemPrefixForConsole = stripRedundantSubsystemPrefixForConsole;
exports.createSubsystemLogger = createSubsystemLogger;
exports.runtimeForLogger = runtimeForLogger;
exports.createSubsystemRuntime = createSubsystemRuntime;
var chalk_1 = require("chalk");
var registry_js_1 = require("../channels/registry.js");
var runtime_js_1 = require("../runtime.js");
var console_js_1 = require("./console.js");
var globals_js_1 = require("../globals.js");
var levels_js_1 = require("./levels.js");
var logger_js_1 = require("./logger.js");
var state_js_1 = require("./state.js");
var progress_line_js_1 = require("../terminal/progress-line.js");
function shouldLogToConsole(level, settings) {
  if (settings.level === "silent") {
    return false;
  }
  var current = (0, levels_js_1.levelToMinLevel)(level);
  var min = (0, levels_js_1.levelToMinLevel)(settings.level);
  return current <= min;
}
function isRichConsoleEnv() {
  var _a;
  var term = ((_a = process.env.TERM) !== null && _a !== void 0 ? _a : "").toLowerCase();
  if (process.env.COLORTERM || process.env.TERM_PROGRAM) {
    return true;
  }
  return term.length > 0 && term !== "dumb";
}
function getColorForConsole() {
  var hasForceColor =
    typeof process.env.FORCE_COLOR === "string" &&
    process.env.FORCE_COLOR.trim().length > 0 &&
    process.env.FORCE_COLOR.trim() !== "0";
  if (process.env.NO_COLOR && !hasForceColor) {
    return new chalk_1.Chalk({ level: 0 });
  }
  var hasTty = Boolean(process.stdout.isTTY || process.stderr.isTTY);
  return hasTty || isRichConsoleEnv()
    ? new chalk_1.Chalk({ level: 1 })
    : new chalk_1.Chalk({ level: 0 });
}
var SUBSYSTEM_COLORS = ["cyan", "green", "yellow", "blue", "magenta", "red"];
var SUBSYSTEM_COLOR_OVERRIDES = {
  "gmail-watcher": "blue",
};
var SUBSYSTEM_PREFIXES_TO_DROP = ["gateway", "channels", "providers"];
var SUBSYSTEM_MAX_SEGMENTS = 2;
var CHANNEL_SUBSYSTEM_PREFIXES = new Set(registry_js_1.CHAT_CHANNEL_ORDER);
function pickSubsystemColor(color, subsystem) {
  var override = SUBSYSTEM_COLOR_OVERRIDES[subsystem];
  if (override) {
    return color[override];
  }
  var hash = 0;
  for (var i = 0; i < subsystem.length; i += 1) {
    hash = (hash * 31 + subsystem.charCodeAt(i)) | 0;
  }
  var idx = Math.abs(hash) % SUBSYSTEM_COLORS.length;
  var name = SUBSYSTEM_COLORS[idx];
  return color[name];
}
function formatSubsystemForConsole(subsystem) {
  var parts = subsystem.split("/").filter(Boolean);
  var original = parts.join("/") || subsystem;
  while (parts.length > 0 && SUBSYSTEM_PREFIXES_TO_DROP.includes(parts[0])) {
    parts.shift();
  }
  if (parts.length === 0) {
    return original;
  }
  if (CHANNEL_SUBSYSTEM_PREFIXES.has(parts[0])) {
    return parts[0];
  }
  if (parts.length > SUBSYSTEM_MAX_SEGMENTS) {
    return parts.slice(-SUBSYSTEM_MAX_SEGMENTS).join("/");
  }
  return parts.join("/");
}
function stripRedundantSubsystemPrefixForConsole(message, displaySubsystem) {
  if (!displaySubsystem) {
    return message;
  }
  // Common duplication: "[discord] discord: ..." (when a message manually includes the subsystem tag).
  if (message.startsWith("[")) {
    var closeIdx = message.indexOf("]");
    if (closeIdx > 1) {
      var bracketTag = message.slice(1, closeIdx);
      if (bracketTag.toLowerCase() === displaySubsystem.toLowerCase()) {
        var i_1 = closeIdx + 1;
        while (message[i_1] === " ") {
          i_1 += 1;
        }
        return message.slice(i_1);
      }
    }
  }
  var prefix = message.slice(0, displaySubsystem.length);
  if (prefix.toLowerCase() !== displaySubsystem.toLowerCase()) {
    return message;
  }
  var next = message.slice(displaySubsystem.length, displaySubsystem.length + 1);
  if (next !== ":" && next !== " ") {
    return message;
  }
  var i = displaySubsystem.length;
  while (message[i] === " ") {
    i += 1;
  }
  if (message[i] === ":") {
    i += 1;
  }
  while (message[i] === " ") {
    i += 1;
  }
  return message.slice(i);
}
function formatConsoleLine(opts) {
  var displaySubsystem =
    opts.style === "json" ? opts.subsystem : formatSubsystemForConsole(opts.subsystem);
  if (opts.style === "json") {
    return JSON.stringify(
      __assign(
        {
          time: new Date().toISOString(),
          level: opts.level,
          subsystem: displaySubsystem,
          message: opts.message,
        },
        opts.meta,
      ),
    );
  }
  var color = getColorForConsole();
  var prefix = "[".concat(displaySubsystem, "]");
  var prefixColor = pickSubsystemColor(color, displaySubsystem);
  var levelColor =
    opts.level === "error" || opts.level === "fatal"
      ? color.red
      : opts.level === "warn"
        ? color.yellow
        : opts.level === "debug" || opts.level === "trace"
          ? color.gray
          : color.cyan;
  var displayMessage = stripRedundantSubsystemPrefixForConsole(opts.message, displaySubsystem);
  var time = (function () {
    if (opts.style === "pretty") {
      return color.gray(new Date().toISOString().slice(11, 19));
    }
    if (state_js_1.loggingState.consoleTimestampPrefix) {
      return color.gray(new Date().toISOString());
    }
    return "";
  })();
  var prefixToken = prefixColor(prefix);
  var head = [time, prefixToken].filter(Boolean).join(" ");
  return "".concat(head, " ").concat(levelColor(displayMessage));
}
function writeConsoleLine(level, line) {
  var _a, _b, _c, _d;
  (0, progress_line_js_1.clearActiveProgressLine)();
  var sanitized =
    process.platform === "win32" && process.env.GITHUB_ACTIONS === "true"
      ? line.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "?").replace(/[\uD800-\uDFFF]/g, "?")
      : line;
  var sink = (_a = state_js_1.loggingState.rawConsole) !== null && _a !== void 0 ? _a : console;
  if (state_js_1.loggingState.forceConsoleToStderr || level === "error" || level === "fatal") {
    ((_b = sink.error) !== null && _b !== void 0 ? _b : console.error)(sanitized);
  } else if (level === "warn") {
    ((_c = sink.warn) !== null && _c !== void 0 ? _c : console.warn)(sanitized);
  } else {
    ((_d = sink.log) !== null && _d !== void 0 ? _d : console.log)(sanitized);
  }
}
function logToFile(fileLogger, level, message, meta) {
  if (level === "silent") {
    return;
  }
  var safeLevel = level;
  var method = fileLogger[safeLevel];
  if (typeof method !== "function") {
    return;
  }
  if (meta && Object.keys(meta).length > 0) {
    method.call(fileLogger, meta, message);
  } else {
    method.call(fileLogger, message);
  }
}
function createSubsystemLogger(subsystem) {
  var fileLogger = null;
  var getFileLogger = function () {
    if (!fileLogger) {
      fileLogger = (0, logger_js_1.getChildLogger)({ subsystem: subsystem });
    }
    return fileLogger;
  };
  var emit = function (level, message, meta) {
    var consoleSettings = (0, console_js_1.getConsoleSettings)();
    var consoleMessageOverride;
    var fileMeta = meta;
    if (meta && Object.keys(meta).length > 0) {
      var _a = meta,
        consoleMessage_1 = _a.consoleMessage,
        rest = __rest(_a, ["consoleMessage"]);
      if (typeof consoleMessage_1 === "string") {
        consoleMessageOverride = consoleMessage_1;
      }
      fileMeta = Object.keys(rest).length > 0 ? rest : undefined;
    }
    logToFile(getFileLogger(), level, message, fileMeta);
    if (!shouldLogToConsole(level, { level: consoleSettings.level })) {
      return;
    }
    if (!(0, console_js_1.shouldLogSubsystemToConsole)(subsystem)) {
      return;
    }
    var consoleMessage =
      consoleMessageOverride !== null && consoleMessageOverride !== void 0
        ? consoleMessageOverride
        : message;
    if (
      !(0, globals_js_1.isVerbose)() &&
      subsystem === "agent/embedded" &&
      /(sessionId|runId)=probe-/.test(consoleMessage)
    ) {
      return;
    }
    var line = formatConsoleLine({
      level: level,
      subsystem: subsystem,
      message: consoleSettings.style === "json" ? message : consoleMessage,
      style: consoleSettings.style,
      meta: fileMeta,
    });
    writeConsoleLine(level, line);
  };
  var logger = {
    subsystem: subsystem,
    trace: function (message, meta) {
      return emit("trace", message, meta);
    },
    debug: function (message, meta) {
      return emit("debug", message, meta);
    },
    info: function (message, meta) {
      return emit("info", message, meta);
    },
    warn: function (message, meta) {
      return emit("warn", message, meta);
    },
    error: function (message, meta) {
      return emit("error", message, meta);
    },
    fatal: function (message, meta) {
      return emit("fatal", message, meta);
    },
    raw: function (message) {
      logToFile(getFileLogger(), "info", message, { raw: true });
      if ((0, console_js_1.shouldLogSubsystemToConsole)(subsystem)) {
        if (
          !(0, globals_js_1.isVerbose)() &&
          subsystem === "agent/embedded" &&
          /(sessionId|runId)=probe-/.test(message)
        ) {
          return;
        }
        writeConsoleLine("info", message);
      }
    },
    child: function (name) {
      return createSubsystemLogger("".concat(subsystem, "/").concat(name));
    },
  };
  return logger;
}
function runtimeForLogger(logger, exit) {
  if (exit === void 0) {
    exit = runtime_js_1.defaultRuntime.exit;
  }
  return {
    log: function (message) {
      return logger.info(message);
    },
    error: function (message) {
      return logger.error(message);
    },
    exit: exit,
  };
}
function createSubsystemRuntime(subsystem, exit) {
  if (exit === void 0) {
    exit = runtime_js_1.defaultRuntime.exit;
  }
  return runtimeForLogger(createSubsystemLogger(subsystem), exit);
}
