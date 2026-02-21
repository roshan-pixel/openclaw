"use strict";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) {
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
          }
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== "function" && b !== null) {
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      }
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailoverError = void 0;
exports.isFailoverError = isFailoverError;
exports.resolveFailoverStatus = resolveFailoverStatus;
exports.isTimeoutError = isTimeoutError;
exports.resolveFailoverReasonFromError = resolveFailoverReasonFromError;
exports.describeFailoverError = describeFailoverError;
exports.coerceToFailoverError = coerceToFailoverError;
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
var TIMEOUT_HINT_RE = /timeout|timed out|deadline exceeded|context deadline exceeded/i;
var ABORT_TIMEOUT_RE = /request was aborted|request aborted/i;
var FailoverError = /** @class */ (function (_super) {
  __extends(FailoverError, _super);
  function FailoverError(message, params) {
    var _this = _super.call(this, message, { cause: params.cause }) || this;
    _this.name = "FailoverError";
    _this.reason = params.reason;
    _this.provider = params.provider;
    _this.model = params.model;
    _this.profileId = params.profileId;
    _this.status = params.status;
    _this.code = params.code;
    return _this;
  }
  return FailoverError;
})(Error);
exports.FailoverError = FailoverError;
function isFailoverError(err) {
  return err instanceof FailoverError;
}
function resolveFailoverStatus(reason) {
  switch (reason) {
    case "billing":
      return 402;
    case "rate_limit":
      return 429;
    case "auth":
      return 401;
    case "timeout":
      return 408;
    case "format":
      return 400;
    default:
      return undefined;
  }
}
function getStatusCode(err) {
  var _a;
  if (!err || typeof err !== "object") {
    return undefined;
  }
  var candidate = (_a = err.status) !== null && _a !== void 0 ? _a : err.statusCode;
  if (typeof candidate === "number") {
    return candidate;
  }
  if (typeof candidate === "string" && /^\d+$/.test(candidate)) {
    return Number(candidate);
  }
  return undefined;
}
function getErrorName(err) {
  if (!err || typeof err !== "object") {
    return "";
  }
  return "name" in err ? String(err.name) : "";
}
function getErrorCode(err) {
  if (!err || typeof err !== "object") {
    return undefined;
  }
  var candidate = err.code;
  if (typeof candidate !== "string") {
    return undefined;
  }
  var trimmed = candidate.trim();
  return trimmed ? trimmed : undefined;
}
function getErrorMessage(err) {
  var _a;
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === "string") {
    return err;
  }
  if (typeof err === "number" || typeof err === "boolean" || typeof err === "bigint") {
    return String(err);
  }
  if (typeof err === "symbol") {
    return (_a = err.description) !== null && _a !== void 0 ? _a : "";
  }
  if (err && typeof err === "object") {
    var message = err.message;
    if (typeof message === "string") {
      return message;
    }
  }
  return "";
}
function hasTimeoutHint(err) {
  if (!err) {
    return false;
  }
  if (getErrorName(err) === "TimeoutError") {
    return true;
  }
  var message = getErrorMessage(err);
  return Boolean(message && TIMEOUT_HINT_RE.test(message));
}
function isTimeoutError(err) {
  if (hasTimeoutHint(err)) {
    return true;
  }
  if (!err || typeof err !== "object") {
    return false;
  }
  if (getErrorName(err) !== "AbortError") {
    return false;
  }
  var message = getErrorMessage(err);
  if (message && ABORT_TIMEOUT_RE.test(message)) {
    return true;
  }
  var cause = "cause" in err ? err.cause : undefined;
  var reason = "reason" in err ? err.reason : undefined;
  return hasTimeoutHint(cause) || hasTimeoutHint(reason);
}
function resolveFailoverReasonFromError(err) {
  var _a;
  if (isFailoverError(err)) {
    return err.reason;
  }
  var status = getStatusCode(err);
  if (status === 402) {
    return "billing";
  }
  if (status === 429) {
    return "rate_limit";
  }
  if (status === 401 || status === 403) {
    return "auth";
  }
  if (status === 408) {
    return "timeout";
  }
  var code = ((_a = getErrorCode(err)) !== null && _a !== void 0 ? _a : "").toUpperCase();
  if (["ETIMEDOUT", "ESOCKETTIMEDOUT", "ECONNRESET", "ECONNABORTED"].includes(code)) {
    return "timeout";
  }
  if (isTimeoutError(err)) {
    return "timeout";
  }
  var message = getErrorMessage(err);
  if (!message) {
    return null;
  }
  return (0, pi_embedded_helpers_js_1.classifyFailoverReason)(message);
}
function describeFailoverError(err) {
  var _a;
  if (isFailoverError(err)) {
    return {
      message: err.message,
      reason: err.reason,
      status: err.status,
      code: err.code,
    };
  }
  var message = getErrorMessage(err) || String(err);
  return {
    message: message,
    reason: (_a = resolveFailoverReasonFromError(err)) !== null && _a !== void 0 ? _a : undefined,
    status: getStatusCode(err),
    code: getErrorCode(err),
  };
}
function coerceToFailoverError(err, context) {
  var _a;
  if (isFailoverError(err)) {
    return err;
  }
  var reason = resolveFailoverReasonFromError(err);
  if (!reason) {
    return null;
  }
  var message = getErrorMessage(err) || String(err);
  var status =
    (_a = getStatusCode(err)) !== null && _a !== void 0 ? _a : resolveFailoverStatus(reason);
  var code = getErrorCode(err);
  return new FailoverError(message, {
    reason: reason,
    provider: context === null || context === void 0 ? void 0 : context.provider,
    model: context === null || context === void 0 ? void 0 : context.model,
    profileId: context === null || context === void 0 ? void 0 : context.profileId,
    status: status,
    code: code,
    cause: err instanceof Error ? err : undefined,
  });
}
