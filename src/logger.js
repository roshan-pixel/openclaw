"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInfo = logInfo;
exports.logWarn = logWarn;
exports.logSuccess = logSuccess;
exports.logError = logError;
exports.logDebug = logDebug;
var globals_js_1 = require("./globals.js");
var logger_js_1 = require("./logging/logger.js");
var subsystem_js_1 = require("./logging/subsystem.js");
var runtime_js_1 = require("./runtime.js");
var subsystemPrefixRe = /^([a-z][a-z0-9-]{1,20}):\s+(.*)$/i;
function splitSubsystem(message) {
  var match = message.match(subsystemPrefixRe);
  if (!match) {
    return null;
  }
  var subsystem = match[1],
    rest = match[2];
  return { subsystem: subsystem, rest: rest };
}
function logInfo(message, runtime) {
  if (runtime === void 0) {
    runtime = runtime_js_1.defaultRuntime;
  }
  var parsed = runtime === runtime_js_1.defaultRuntime ? splitSubsystem(message) : null;
  if (parsed) {
    (0, subsystem_js_1.createSubsystemLogger)(parsed.subsystem).info(parsed.rest);
    return;
  }
  runtime.log((0, globals_js_1.info)(message));
  (0, logger_js_1.getLogger)().info(message);
}
function logWarn(message, runtime) {
  if (runtime === void 0) {
    runtime = runtime_js_1.defaultRuntime;
  }
  var parsed = runtime === runtime_js_1.defaultRuntime ? splitSubsystem(message) : null;
  if (parsed) {
    (0, subsystem_js_1.createSubsystemLogger)(parsed.subsystem).warn(parsed.rest);
    return;
  }
  runtime.log((0, globals_js_1.warn)(message));
  (0, logger_js_1.getLogger)().warn(message);
}
function logSuccess(message, runtime) {
  if (runtime === void 0) {
    runtime = runtime_js_1.defaultRuntime;
  }
  var parsed = runtime === runtime_js_1.defaultRuntime ? splitSubsystem(message) : null;
  if (parsed) {
    (0, subsystem_js_1.createSubsystemLogger)(parsed.subsystem).info(parsed.rest);
    return;
  }
  runtime.log((0, globals_js_1.success)(message));
  (0, logger_js_1.getLogger)().info(message);
}
function logError(message, runtime) {
  if (runtime === void 0) {
    runtime = runtime_js_1.defaultRuntime;
  }
  var parsed = runtime === runtime_js_1.defaultRuntime ? splitSubsystem(message) : null;
  if (parsed) {
    (0, subsystem_js_1.createSubsystemLogger)(parsed.subsystem).error(parsed.rest);
    return;
  }
  runtime.error((0, globals_js_1.danger)(message));
  (0, logger_js_1.getLogger)().error(message);
}
function logDebug(message) {
  // Always emit to file logger (level-filtered); console only when verbose.
  (0, logger_js_1.getLogger)().debug(message);
  (0, globals_js_1.logVerboseConsole)(message);
}
