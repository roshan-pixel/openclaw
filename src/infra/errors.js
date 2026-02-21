"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractErrorCode = extractErrorCode;
exports.formatErrorMessage = formatErrorMessage;
exports.formatUncaughtError = formatUncaughtError;
function extractErrorCode(err) {
  if (!err || typeof err !== "object") {
    return undefined;
  }
  var code = err.code;
  if (typeof code === "string") {
    return code;
  }
  if (typeof code === "number") {
    return String(code);
  }
  return undefined;
}
function formatErrorMessage(err) {
  if (err instanceof Error) {
    return err.message || err.name || "Error";
  }
  if (typeof err === "string") {
    return err;
  }
  if (typeof err === "number" || typeof err === "boolean" || typeof err === "bigint") {
    return String(err);
  }
  try {
    return JSON.stringify(err);
  } catch (_a) {
    return Object.prototype.toString.call(err);
  }
}
function formatUncaughtError(err) {
  var _a, _b;
  if (extractErrorCode(err) === "INVALID_CONFIG") {
    return formatErrorMessage(err);
  }
  if (err instanceof Error) {
    return (_b = (_a = err.stack) !== null && _a !== void 0 ? _a : err.message) !== null &&
      _b !== void 0
      ? _b
      : err.name;
  }
  return formatErrorMessage(err);
}
