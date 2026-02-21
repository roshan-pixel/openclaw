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
exports.TELEGRAM_RETRY_DEFAULTS = exports.DISCORD_RETRY_DEFAULTS = void 0;
exports.createDiscordRetryRunner = createDiscordRetryRunner;
exports.createTelegramRetryRunner = createTelegramRetryRunner;
var carbon_1 = require("@buape/carbon");
var errors_js_1 = require("./errors.js");
var retry_js_1 = require("./retry.js");
exports.DISCORD_RETRY_DEFAULTS = {
  attempts: 3,
  minDelayMs: 500,
  maxDelayMs: 30000,
  jitter: 0.1,
};
exports.TELEGRAM_RETRY_DEFAULTS = {
  attempts: 3,
  minDelayMs: 400,
  maxDelayMs: 30000,
  jitter: 0.1,
};
var TELEGRAM_RETRY_RE = /429|timeout|connect|reset|closed|unavailable|temporarily/i;
function getTelegramRetryAfterMs(err) {
  var _a, _b;
  if (!err || typeof err !== "object") {
    return undefined;
  }
  var candidate =
    "parameters" in err && err.parameters && typeof err.parameters === "object"
      ? err.parameters.retry_after
      : "response" in err &&
          err.response &&
          typeof err.response === "object" &&
          "parameters" in err.response
        ? (_a = err.response.parameters) === null || _a === void 0
          ? void 0
          : _a.retry_after
        : "error" in err && err.error && typeof err.error === "object" && "parameters" in err.error
          ? (_b = err.error.parameters) === null || _b === void 0
            ? void 0
            : _b.retry_after
          : undefined;
  return typeof candidate === "number" && Number.isFinite(candidate) ? candidate * 1000 : undefined;
}
function createDiscordRetryRunner(params) {
  var retryConfig = (0, retry_js_1.resolveRetryConfig)(
    exports.DISCORD_RETRY_DEFAULTS,
    __assign(__assign({}, params.configRetry), params.retry),
  );
  return function (fn, label) {
    return (0, retry_js_1.retryAsync)(
      fn,
      __assign(__assign({}, retryConfig), {
        label: label,
        shouldRetry: function (err) {
          return err instanceof carbon_1.RateLimitError;
        },
        retryAfterMs: function (err) {
          return err instanceof carbon_1.RateLimitError ? err.retryAfter * 1000 : undefined;
        },
        onRetry: params.verbose
          ? function (info) {
              var _a;
              var labelText = (_a = info.label) !== null && _a !== void 0 ? _a : "request";
              var maxRetries = Math.max(1, info.maxAttempts - 1);
              console.warn(
                "discord "
                  .concat(labelText, " rate limited, retry ")
                  .concat(info.attempt, "/")
                  .concat(maxRetries, " in ")
                  .concat(info.delayMs, "ms"),
              );
            }
          : undefined,
      }),
    );
  };
}
function createTelegramRetryRunner(params) {
  var retryConfig = (0, retry_js_1.resolveRetryConfig)(
    exports.TELEGRAM_RETRY_DEFAULTS,
    __assign(__assign({}, params.configRetry), params.retry),
  );
  var shouldRetry = params.shouldRetry
    ? function (err) {
        var _a;
        return (
          ((_a = params.shouldRetry) === null || _a === void 0 ? void 0 : _a.call(params, err)) ||
          TELEGRAM_RETRY_RE.test((0, errors_js_1.formatErrorMessage)(err))
        );
      }
    : function (err) {
        return TELEGRAM_RETRY_RE.test((0, errors_js_1.formatErrorMessage)(err));
      };
  return function (fn, label) {
    return (0, retry_js_1.retryAsync)(
      fn,
      __assign(__assign({}, retryConfig), {
        label: label,
        shouldRetry: shouldRetry,
        retryAfterMs: getTelegramRetryAfterMs,
        onRetry: params.verbose
          ? function (info) {
              var _a, _b;
              var maxRetries = Math.max(1, info.maxAttempts - 1);
              console.warn(
                "telegram send retry "
                  .concat(info.attempt, "/")
                  .concat(maxRetries, " for ")
                  .concat(
                    (_b = (_a = info.label) !== null && _a !== void 0 ? _a : label) !== null &&
                      _b !== void 0
                      ? _b
                      : "request",
                    " in ",
                  )
                  .concat(info.delayMs, "ms: ")
                  .concat((0, errors_js_1.formatErrorMessage)(info.err)),
              );
            }
          : undefined,
      }),
    );
  };
}
