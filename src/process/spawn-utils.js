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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCommandStdio = resolveCommandStdio;
exports.formatSpawnError = formatSpawnError;
exports.spawnWithFallback = spawnWithFallback;
var node_child_process_1 = require("node:child_process");
var DEFAULT_RETRY_CODES = ["EBADF"];
function resolveCommandStdio(params) {
  var stdin = params.hasInput ? "pipe" : params.preferInherit ? "inherit" : "pipe";
  return [stdin, "pipe", "pipe"];
}
function formatSpawnError(err) {
  var _a;
  if (!(err instanceof Error)) {
    return String(err);
  }
  var details = err;
  var parts = [];
  var message = (_a = err.message) === null || _a === void 0 ? void 0 : _a.trim();
  if (message) {
    parts.push(message);
  }
  if (
    details.code &&
    !(message === null || message === void 0 ? void 0 : message.includes(details.code))
  ) {
    parts.push(details.code);
  }
  if (details.syscall) {
    parts.push("syscall=".concat(details.syscall));
  }
  if (typeof details.errno === "number") {
    parts.push("errno=".concat(details.errno));
  }
  return parts.join(" ");
}
function shouldRetry(err, codes) {
  var code = err && typeof err === "object" && "code" in err ? String(err.code) : "";
  return code.length > 0 && codes.includes(code);
}
function spawnAndWaitForSpawn(spawnImpl, argv, options) {
  return __awaiter(this, void 0, void 0, function () {
    var child;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          child = spawnImpl(argv[0], argv.slice(1), options);
          return [
            4 /*yield*/,
            new Promise(function (resolve, reject) {
              var settled = false;
              var cleanup = function () {
                child.removeListener("error", onError);
                child.removeListener("spawn", onSpawn);
              };
              var finishResolve = function () {
                if (settled) {
                  return;
                }
                settled = true;
                cleanup();
                resolve(child);
              };
              var onError = function (err) {
                if (settled) {
                  return;
                }
                settled = true;
                cleanup();
                reject(err);
              };
              var onSpawn = function () {
                finishResolve();
              };
              child.once("error", onError);
              child.once("spawn", onSpawn);
              // Ensure mocked spawns that never emit "spawn" don't stall.
              process.nextTick(function () {
                if (typeof child.pid === "number") {
                  finishResolve();
                }
              });
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function spawnWithFallback(params) {
  return __awaiter(this, void 0, void 0, function () {
    var spawnImpl,
      retryCodes,
      baseOptions,
      fallbacks,
      attempts,
      lastError,
      index,
      attempt,
      child,
      err_1,
      nextFallback;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          spawnImpl =
            (_a = params.spawnImpl) !== null && _a !== void 0 ? _a : node_child_process_1.spawn;
          retryCodes =
            (_b = params.retryCodes) !== null && _b !== void 0 ? _b : DEFAULT_RETRY_CODES;
          baseOptions = __assign({}, params.options);
          fallbacks = (_c = params.fallbacks) !== null && _c !== void 0 ? _c : [];
          attempts = __spreadArray(
            [{ options: baseOptions }],
            fallbacks.map(function (fallback) {
              return {
                label: fallback.label,
                options: __assign(__assign({}, baseOptions), fallback.options),
              };
            }),
            true,
          );
          index = 0;
          _e.label = 1;
        case 1:
          if (!(index < attempts.length)) {
            return [3 /*break*/, 6];
          }
          attempt = attempts[index];
          _e.label = 2;
        case 2:
          _e.trys.push([2, 4, , 5]);
          return [4 /*yield*/, spawnAndWaitForSpawn(spawnImpl, params.argv, attempt.options)];
        case 3:
          child = _e.sent();
          return [
            2 /*return*/,
            {
              child: child,
              usedFallback: index > 0,
              fallbackLabel: attempt.label,
            },
          ];
        case 4:
          err_1 = _e.sent();
          lastError = err_1;
          nextFallback = fallbacks[index];
          if (!nextFallback || !shouldRetry(err_1, retryCodes)) {
            throw err_1;
          }
          (_d = params.onFallback) === null || _d === void 0
            ? void 0
            : _d.call(params, err_1, nextFallback);
          return [3 /*break*/, 5];
        case 5:
          index += 1;
          return [3 /*break*/, 1];
        case 6:
          throw lastError;
      }
    });
  });
}
