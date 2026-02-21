"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRecoverableTelegramNetworkError = isRecoverableTelegramNetworkError;
var errors_js_1 = require("../infra/errors.js");
var RECOVERABLE_ERROR_CODES = new Set([
  "ECONNRESET",
  "ECONNREFUSED",
  "EPIPE",
  "ETIMEDOUT",
  "ESOCKETTIMEDOUT",
  "ENETUNREACH",
  "EHOSTUNREACH",
  "ENOTFOUND",
  "EAI_AGAIN",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_HEADERS_TIMEOUT",
  "UND_ERR_BODY_TIMEOUT",
  "UND_ERR_SOCKET",
  "UND_ERR_ABORTED",
  "ECONNABORTED",
  "ERR_NETWORK",
]);
var RECOVERABLE_ERROR_NAMES = new Set([
  "AbortError",
  "TimeoutError",
  "ConnectTimeoutError",
  "HeadersTimeoutError",
  "BodyTimeoutError",
]);
var RECOVERABLE_MESSAGE_SNIPPETS = [
  "fetch failed",
  "typeerror: fetch failed",
  "undici",
  "network error",
  "network request",
  "client network socket disconnected",
  "socket hang up",
  "getaddrinfo",
];
function normalizeCode(code) {
  var _a;
  return (_a = code === null || code === void 0 ? void 0 : code.trim().toUpperCase()) !== null &&
    _a !== void 0
    ? _a
    : "";
}
function getErrorName(err) {
  if (!err || typeof err !== "object") {
    return "";
  }
  return "name" in err ? String(err.name) : "";
}
function getErrorCode(err) {
  var direct = (0, errors_js_1.extractErrorCode)(err);
  if (direct) {
    return direct;
  }
  if (!err || typeof err !== "object") {
    return undefined;
  }
  var errno = err.errno;
  if (typeof errno === "string") {
    return errno;
  }
  if (typeof errno === "number") {
    return String(errno);
  }
  return undefined;
}
function collectErrorCandidates(err) {
  var queue = [err];
  var seen = new Set();
  var candidates = [];
  while (queue.length > 0) {
    var current = queue.shift();
    if (current == null || seen.has(current)) {
      continue;
    }
    seen.add(current);
    candidates.push(current);
    if (typeof current === "object") {
      var cause = current.cause;
      if (cause && !seen.has(cause)) {
        queue.push(cause);
      }
      var reason = current.reason;
      if (reason && !seen.has(reason)) {
        queue.push(reason);
      }
      var errors = current.errors;
      if (Array.isArray(errors)) {
        for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
          var nested = errors_1[_i];
          if (nested && !seen.has(nested)) {
            queue.push(nested);
          }
        }
      }
    }
  }
  return candidates;
}
function isRecoverableTelegramNetworkError(err, options) {
  if (options === void 0) {
    options = {};
  }
  if (!err) {
    return false;
  }
  var allowMessageMatch =
    typeof options.allowMessageMatch === "boolean"
      ? options.allowMessageMatch
      : options.context !== "send";
  var _loop_1 = function (candidate) {
    var code = normalizeCode(getErrorCode(candidate));
    if (code && RECOVERABLE_ERROR_CODES.has(code)) {
      return { value: true };
    }
    var name_1 = getErrorName(candidate);
    if (name_1 && RECOVERABLE_ERROR_NAMES.has(name_1)) {
      return { value: true };
    }
    if (allowMessageMatch) {
      var message_1 = (0, errors_js_1.formatErrorMessage)(candidate).toLowerCase();
      if (
        message_1 &&
        RECOVERABLE_MESSAGE_SNIPPETS.some(function (snippet) {
          return message_1.includes(snippet);
        })
      ) {
        return { value: true };
      }
    }
  };
  for (var _i = 0, _a = collectErrorCandidates(err); _i < _a.length; _i++) {
    var candidate = _a[_i];
    var state_1 = _loop_1(candidate);
    if (typeof state_1 === "object") {
      return state_1.value;
    }
  }
  return false;
}
