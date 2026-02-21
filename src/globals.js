"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.danger = exports.info = exports.warn = exports.success = void 0;
exports.setVerbose = setVerbose;
exports.isVerbose = isVerbose;
exports.shouldLogVerbose = shouldLogVerbose;
exports.logVerbose = logVerbose;
exports.logVerboseConsole = logVerboseConsole;
exports.setYes = setYes;
exports.isYes = isYes;
var logger_js_1 = require("./logging/logger.js");
var theme_js_1 = require("./terminal/theme.js");
var globalVerbose = false;
var globalYes = false;
function setVerbose(v) {
  globalVerbose = v;
}
function isVerbose() {
  return globalVerbose;
}
function shouldLogVerbose() {
  return globalVerbose || (0, logger_js_1.isFileLogLevelEnabled)("debug");
}
function logVerbose(message) {
  if (!shouldLogVerbose()) {
    return;
  }
  try {
    (0, logger_js_1.getLogger)().debug({ message: message }, "verbose");
  } catch (_a) {
    // ignore logger failures to avoid breaking verbose printing
  }
  if (!globalVerbose) {
    return;
  }
  console.log(theme_js_1.theme.muted(message));
}
function logVerboseConsole(message) {
  if (!globalVerbose) {
    return;
  }
  console.log(theme_js_1.theme.muted(message));
}
function setYes(v) {
  globalYes = v;
}
function isYes() {
  return globalYes;
}
exports.success = theme_js_1.theme.success;
exports.warn = theme_js_1.theme.warn;
exports.info = theme_js_1.theme.info;
exports.danger = theme_js_1.theme.error;
