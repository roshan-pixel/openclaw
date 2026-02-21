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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSignalSseLoop = runSignalSseLoop;
var globals_js_1 = require("../globals.js");
var backoff_js_1 = require("../infra/backoff.js");
var client_js_1 = require("./client.js");
var DEFAULT_RECONNECT_POLICY = {
  initialMs: 1000,
  maxMs: 10000,
  factor: 2,
  jitter: 0.2,
};
function runSignalSseLoop(_a) {
  return __awaiter(this, arguments, void 0, function (_b) {
    var reconnectPolicy,
      reconnectAttempts,
      logReconnectVerbose,
      delayMs,
      err_1,
      delayMs,
      sleepErr_1;
    var _c, _d;
    var baseUrl = _b.baseUrl,
      account = _b.account,
      abortSignal = _b.abortSignal,
      runtime = _b.runtime,
      onEvent = _b.onEvent,
      policy = _b.policy;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          reconnectPolicy = __assign(__assign({}, DEFAULT_RECONNECT_POLICY), policy);
          reconnectAttempts = 0;
          logReconnectVerbose = function (message) {
            if (!(0, globals_js_1.shouldLogVerbose)()) {
              return;
            }
            (0, globals_js_1.logVerbose)(message);
          };
          _e.label = 1;
        case 1:
          if (!!(abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted)) {
            return [3 /*break*/, 11];
          }
          _e.label = 2;
        case 2:
          _e.trys.push([2, 5, , 10]);
          return [
            4 /*yield*/,
            (0, client_js_1.streamSignalEvents)({
              baseUrl: baseUrl,
              account: account,
              abortSignal: abortSignal,
              onEvent: function (event) {
                reconnectAttempts = 0;
                onEvent(event);
              },
            }),
          ];
        case 3:
          _e.sent();
          if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
            return [2 /*return*/];
          }
          reconnectAttempts += 1;
          delayMs = (0, backoff_js_1.computeBackoff)(reconnectPolicy, reconnectAttempts);
          logReconnectVerbose(
            "Signal SSE stream ended, reconnecting in ".concat(delayMs / 1000, "s..."),
          );
          return [4 /*yield*/, (0, backoff_js_1.sleepWithAbort)(delayMs, abortSignal)];
        case 4:
          _e.sent();
          return [3 /*break*/, 10];
        case 5:
          err_1 = _e.sent();
          if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
            return [2 /*return*/];
          }
          (_c = runtime.error) === null || _c === void 0
            ? void 0
            : _c.call(runtime, "Signal SSE stream error: ".concat(String(err_1)));
          reconnectAttempts += 1;
          delayMs = (0, backoff_js_1.computeBackoff)(reconnectPolicy, reconnectAttempts);
          (_d = runtime.log) === null || _d === void 0
            ? void 0
            : _d.call(
                runtime,
                "Signal SSE connection lost, reconnecting in ".concat(delayMs / 1000, "s..."),
              );
          _e.label = 6;
        case 6:
          _e.trys.push([6, 8, , 9]);
          return [4 /*yield*/, (0, backoff_js_1.sleepWithAbort)(delayMs, abortSignal)];
        case 7:
          _e.sent();
          return [3 /*break*/, 9];
        case 8:
          sleepErr_1 = _e.sent();
          if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
            return [2 /*return*/];
          }
          throw sleepErr_1;
        case 9:
          return [3 /*break*/, 10];
        case 10:
          return [3 /*break*/, 1];
        case 11:
          return [2 /*return*/];
      }
    });
  });
}
