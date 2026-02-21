"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAbortError = isAbortError;
exports.isTransientNetworkError = isTransientNetworkError;
exports.registerUnhandledRejectionHandler = registerUnhandledRejectionHandler;
exports.isUnhandledRejectionHandled = isUnhandledRejectionHandled;
exports.installUnhandledRejectionHandler = installUnhandledRejectionHandler;
var node_process_1 = require("node:process");
var errors_js_1 = require("./errors.js");
var handlers = new Set();
var FATAL_ERROR_CODES = new Set([
  "ERR_OUT_OF_MEMORY",
  "ERR_SCRIPT_EXECUTION_TIMEOUT",
  "ERR_WORKER_OUT_OF_MEMORY",
  "ERR_WORKER_UNCAUGHT_EXCEPTION",
  "ERR_WORKER_INITIALIZATION_FAILED",
]);
var CONFIG_ERROR_CODES = new Set(["INVALID_CONFIG", "MISSING_API_KEY", "MISSING_CREDENTIALS"]);
// Network error codes that indicate transient failures (shouldn't crash the gateway)
var TRANSIENT_NETWORK_CODES = new Set([
  "ECONNRESET",
  "ECONNREFUSED",
  "ENOTFOUND",
  "ETIMEDOUT",
  "ESOCKETTIMEDOUT",
  "ECONNABORTED",
  "EPIPE",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "EAI_AGAIN",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_DNS_RESOLVE_FAILED",
  "UND_ERR_CONNECT",
  "UND_ERR_SOCKET",
  "UND_ERR_HEADERS_TIMEOUT",
  "UND_ERR_BODY_TIMEOUT",
]);
function getErrorCause(err) {
  if (!err || typeof err !== "object") {
    return undefined;
  }
  return err.cause;
}
function extractErrorCodeWithCause(err) {
  var direct = (0, errors_js_1.extractErrorCode)(err);
  if (direct) {
    return direct;
  }
  return (0, errors_js_1.extractErrorCode)(getErrorCause(err));
}
/**
 * Checks if an error is an AbortError.
 * These are typically intentional cancellations (e.g., during shutdown) and shouldn't crash.
 */
function isAbortError(err) {
  if (!err || typeof err !== "object") {
    return false;
  }
  var name = "name" in err ? String(err.name) : "";
  if (name === "AbortError") {
    return true;
  }
  // Check for "This operation was aborted" message from Node's undici
  var message = "message" in err && typeof err.message === "string" ? err.message : "";
  if (message === "This operation was aborted") {
    return true;
  }
  return false;
}
function isFatalError(err) {
  var code = extractErrorCodeWithCause(err);
  return code !== undefined && FATAL_ERROR_CODES.has(code);
}
function isConfigError(err) {
  var code = extractErrorCodeWithCause(err);
  return code !== undefined && CONFIG_ERROR_CODES.has(code);
}
/**
 * Checks if an error is a transient network error that shouldn't crash the gateway.
 * These are typically temporary connectivity issues that will resolve on their own.
 */
function isTransientNetworkError(err) {
  var _a;
  if (!err) {
    return false;
  }
  var code = extractErrorCodeWithCause(err);
  if (code && TRANSIENT_NETWORK_CODES.has(code)) {
    return true;
  }
  // "fetch failed" TypeError from undici (Node's native fetch)
  if (err instanceof TypeError && err.message === "fetch failed") {
    var cause_1 = getErrorCause(err);
    if (cause_1) {
      return isTransientNetworkError(cause_1);
    }
    return true;
  }
  // Check the cause chain recursively
  var cause = getErrorCause(err);
  if (cause && cause !== err) {
    return isTransientNetworkError(cause);
  }
  // AggregateError may wrap multiple causes
  if (
    err instanceof AggregateError &&
    ((_a = err.errors) === null || _a === void 0 ? void 0 : _a.length)
  ) {
    return err.errors.some(function (e) {
      return isTransientNetworkError(e);
    });
  }
  return false;
}
function registerUnhandledRejectionHandler(handler) {
  handlers.add(handler);
  return function () {
    handlers.delete(handler);
  };
}
function isUnhandledRejectionHandled(reason) {
  var _a;
  for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
    var handler = handlers_1[_i];
    try {
      if (handler(reason)) {
        return true;
      }
    } catch (err) {
      console.error(
        "[openclaw] Unhandled rejection handler failed:",
        err instanceof Error
          ? (_a = err.stack) !== null && _a !== void 0
            ? _a
            : err.message
          : err,
      );
    }
  }
  return false;
}
function installUnhandledRejectionHandler() {
  node_process_1.default.on("unhandledRejection", function (reason, _promise) {
    if (isUnhandledRejectionHandled(reason)) {
      return;
    }
    // AbortError is typically an intentional cancellation (e.g., during shutdown)
    // Log it but don't crash - these are expected during graceful shutdown
    if (isAbortError(reason)) {
      console.warn(
        "[openclaw] Suppressed AbortError:",
        (0, errors_js_1.formatUncaughtError)(reason),
      );
      return;
    }
    if (isFatalError(reason)) {
      console.error(
        "[openclaw] FATAL unhandled rejection:",
        (0, errors_js_1.formatUncaughtError)(reason),
      );
      node_process_1.default.exit(1);
      return;
    }
    if (isConfigError(reason)) {
      console.error(
        "[openclaw] CONFIGURATION ERROR - requires fix:",
        (0, errors_js_1.formatUncaughtError)(reason),
      );
      node_process_1.default.exit(1);
      return;
    }
    if (isTransientNetworkError(reason)) {
      console.warn(
        "[openclaw] Non-fatal unhandled rejection (continuing):",
        (0, errors_js_1.formatUncaughtError)(reason),
      );
      return;
    }
    console.error(
      "[openclaw] Unhandled promise rejection:",
      (0, errors_js_1.formatUncaughtError)(reason),
    );
    node_process_1.default.exit(1);
  });
}
