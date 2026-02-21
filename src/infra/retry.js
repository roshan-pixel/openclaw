"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) {
            throw t[1];
          }
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) {
        throw new TypeError("Generator is already executing.");
      }
      while ((g && ((g = 0), op[0] && (_ = 0)), _)) {
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      }
      if (op[0] & 5) {
        throw op[1];
      }
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRetryConfig = resolveRetryConfig;
exports.retryAsync = retryAsync;
var DEFAULT_RETRY_CONFIG = {
  attempts: 3,
  minDelayMs: 300,
  maxDelayMs: 30000,
  jitter: 0,
};
var sleep = function (ms) {
  return new Promise(function (r) {
    return setTimeout(r, ms);
  });
};
var asFiniteNumber = function (value) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
};
var clampNumber = function (value, fallback, min, max) {
  var next = asFiniteNumber(value);
  if (next === undefined) {
    return fallback;
  }
  var floor = typeof min === "number" ? min : Number.NEGATIVE_INFINITY;
  var ceiling = typeof max === "number" ? max : Number.POSITIVE_INFINITY;
  return Math.min(Math.max(next, floor), ceiling);
};
function resolveRetryConfig(defaults, overrides) {
  if (defaults === void 0) {
    defaults = DEFAULT_RETRY_CONFIG;
  }
  var attempts = Math.max(
    1,
    Math.round(
      clampNumber(
        overrides === null || overrides === void 0 ? void 0 : overrides.attempts,
        defaults.attempts,
        1,
      ),
    ),
  );
  var minDelayMs = Math.max(
    0,
    Math.round(
      clampNumber(
        overrides === null || overrides === void 0 ? void 0 : overrides.minDelayMs,
        defaults.minDelayMs,
        0,
      ),
    ),
  );
  var maxDelayMs = Math.max(
    minDelayMs,
    Math.round(
      clampNumber(
        overrides === null || overrides === void 0 ? void 0 : overrides.maxDelayMs,
        defaults.maxDelayMs,
        0,
      ),
    ),
  );
  var jitter = clampNumber(
    overrides === null || overrides === void 0 ? void 0 : overrides.jitter,
    defaults.jitter,
    0,
    1,
  );
  return { attempts: attempts, minDelayMs: minDelayMs, maxDelayMs: maxDelayMs, jitter: jitter };
}
function applyJitter(delayMs, jitter) {
  if (jitter <= 0) {
    return delayMs;
  }
  var offset = (Math.random() * 2 - 1) * jitter;
  return Math.max(0, Math.round(delayMs * (1 + offset)));
}
function retryAsync(fn_1) {
  return __awaiter(this, arguments, void 0, function (fn, attemptsOrOptions, initialDelayMs) {
    var attempts,
      lastErr_1,
      i,
      err_1,
      delay,
      options,
      resolved,
      maxAttempts,
      minDelayMs,
      maxDelayMs,
      jitter,
      shouldRetry,
      lastErr,
      attempt,
      err_2,
      retryAfterMs,
      hasRetryAfter,
      baseDelay,
      delay;
    var _a, _b, _c;
    if (attemptsOrOptions === void 0) {
      attemptsOrOptions = 3;
    }
    if (initialDelayMs === void 0) {
      initialDelayMs = 300;
    }
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          if (!(typeof attemptsOrOptions === "number")) {
            return [3 /*break*/, 8];
          }
          attempts = Math.max(1, Math.round(attemptsOrOptions));
          i = 0;
          _d.label = 1;
        case 1:
          if (!(i < attempts)) {
            return [3 /*break*/, 7];
          }
          _d.label = 2;
        case 2:
          _d.trys.push([2, 4, , 6]);
          return [4 /*yield*/, fn()];
        case 3:
          return [2 /*return*/, _d.sent()];
        case 4:
          err_1 = _d.sent();
          lastErr_1 = err_1;
          if (i === attempts - 1) {
            return [3 /*break*/, 7];
          }
          delay = initialDelayMs * Math.pow(2, i);
          return [4 /*yield*/, sleep(delay)];
        case 5:
          _d.sent();
          return [3 /*break*/, 6];
        case 6:
          i += 1;
          return [3 /*break*/, 1];
        case 7:
          throw lastErr_1 !== null && lastErr_1 !== void 0 ? lastErr_1 : new Error("Retry failed");
        case 8:
          options = attemptsOrOptions;
          resolved = resolveRetryConfig(DEFAULT_RETRY_CONFIG, options);
          maxAttempts = resolved.attempts;
          minDelayMs = resolved.minDelayMs;
          maxDelayMs =
            Number.isFinite(resolved.maxDelayMs) && resolved.maxDelayMs > 0
              ? resolved.maxDelayMs
              : Number.POSITIVE_INFINITY;
          jitter = resolved.jitter;
          shouldRetry =
            (_a = options.shouldRetry) !== null && _a !== void 0
              ? _a
              : function () {
                  return true;
                };
          attempt = 1;
          _d.label = 9;
        case 9:
          if (!(attempt <= maxAttempts)) {
            return [3 /*break*/, 15];
          }
          _d.label = 10;
        case 10:
          _d.trys.push([10, 12, , 14]);
          return [4 /*yield*/, fn()];
        case 11:
          return [2 /*return*/, _d.sent()];
        case 12:
          err_2 = _d.sent();
          lastErr = err_2;
          if (attempt >= maxAttempts || !shouldRetry(err_2, attempt)) {
            return [3 /*break*/, 15];
          }
          retryAfterMs =
            (_b = options.retryAfterMs) === null || _b === void 0
              ? void 0
              : _b.call(options, err_2);
          hasRetryAfter = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs);
          baseDelay = hasRetryAfter
            ? Math.max(retryAfterMs, minDelayMs)
            : minDelayMs * Math.pow(2, attempt - 1);
          delay = Math.min(baseDelay, maxDelayMs);
          delay = applyJitter(delay, jitter);
          delay = Math.min(Math.max(delay, minDelayMs), maxDelayMs);
          (_c = options.onRetry) === null || _c === void 0
            ? void 0
            : _c.call(options, {
                attempt: attempt,
                maxAttempts: maxAttempts,
                delayMs: delay,
                err: err_2,
                label: options.label,
              });
          return [4 /*yield*/, sleep(delay)];
        case 13:
          _d.sent();
          return [3 /*break*/, 14];
        case 14:
          attempt += 1;
          return [3 /*break*/, 9];
        case 15:
          throw lastErr !== null && lastErr !== void 0 ? lastErr : new Error("Retry failed");
      }
    });
  });
}
