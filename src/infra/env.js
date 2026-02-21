"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAcceptedEnvOption = logAcceptedEnvOption;
exports.normalizeZaiEnv = normalizeZaiEnv;
exports.isTruthyEnvValue = isTruthyEnvValue;
exports.normalizeEnv = normalizeEnv;
var subsystem_js_1 = require("../logging/subsystem.js");
var boolean_js_1 = require("../utils/boolean.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("env");
var loggedEnv = new Set();
function formatEnvValue(value, redact) {
  if (redact) {
    return "<redacted>";
  }
  var singleLine = value.replace(/\s+/g, " ").trim();
  if (singleLine.length <= 160) {
    return singleLine;
  }
  return "".concat(singleLine.slice(0, 160), "\u2026");
}
function logAcceptedEnvOption(option) {
  var _a;
  if (process.env.VITEST || process.env.NODE_ENV === "test") {
    return;
  }
  if (loggedEnv.has(option.key)) {
    return;
  }
  var rawValue = (_a = option.value) !== null && _a !== void 0 ? _a : process.env[option.key];
  if (!rawValue || !rawValue.trim()) {
    return;
  }
  loggedEnv.add(option.key);
  log.info(
    "env: "
      .concat(option.key, "=")
      .concat(formatEnvValue(rawValue, option.redact), " (")
      .concat(option.description, ")"),
  );
}
function normalizeZaiEnv() {
  var _a, _b;
  if (
    !((_a = process.env.ZAI_API_KEY) === null || _a === void 0 ? void 0 : _a.trim()) &&
    ((_b = process.env.Z_AI_API_KEY) === null || _b === void 0 ? void 0 : _b.trim())
  ) {
    process.env.ZAI_API_KEY = process.env.Z_AI_API_KEY;
  }
}
function isTruthyEnvValue(value) {
  return (0, boolean_js_1.parseBooleanValue)(value) === true;
}
function normalizeEnv() {
  normalizeZaiEnv();
}
