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
exports.getDiscordGatewayEmitter = getDiscordGatewayEmitter;
exports.waitForDiscordGatewayStop = waitForDiscordGatewayStop;
function getDiscordGatewayEmitter(gateway) {
  return gateway === null || gateway === void 0 ? void 0 : gateway.emitter;
}
function waitForDiscordGatewayStop(params) {
  return __awaiter(this, void 0, void 0, function () {
    var gateway, abortSignal, onGatewayError, shouldStopOnError, emitter;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          ((gateway = params.gateway),
            (abortSignal = params.abortSignal),
            (onGatewayError = params.onGatewayError),
            (shouldStopOnError = params.shouldStopOnError));
          emitter = gateway === null || gateway === void 0 ? void 0 : gateway.emitter;
          return [
            4 /*yield*/,
            new Promise(function (resolve, reject) {
              var settled = false;
              var cleanup = function () {
                abortSignal === null || abortSignal === void 0
                  ? void 0
                  : abortSignal.removeEventListener("abort", onAbort);
                emitter === null || emitter === void 0
                  ? void 0
                  : emitter.removeListener("error", onGatewayErrorEvent);
              };
              var finishResolve = function () {
                var _a;
                if (settled) {
                  return;
                }
                settled = true;
                cleanup();
                try {
                  (_a = gateway === null || gateway === void 0 ? void 0 : gateway.disconnect) ===
                    null || _a === void 0
                    ? void 0
                    : _a.call(gateway);
                } finally {
                  resolve();
                }
              };
              var finishReject = function (err) {
                var _a;
                if (settled) {
                  return;
                }
                settled = true;
                cleanup();
                try {
                  (_a = gateway === null || gateway === void 0 ? void 0 : gateway.disconnect) ===
                    null || _a === void 0
                    ? void 0
                    : _a.call(gateway);
                } finally {
                  reject(err);
                }
              };
              var onAbort = function () {
                finishResolve();
              };
              var onGatewayErrorEvent = function (err) {
                var _a;
                onGatewayError === null || onGatewayError === void 0 ? void 0 : onGatewayError(err);
                var shouldStop =
                  (_a =
                    shouldStopOnError === null || shouldStopOnError === void 0
                      ? void 0
                      : shouldStopOnError(err)) !== null && _a !== void 0
                    ? _a
                    : true;
                if (shouldStop) {
                  finishReject(err);
                }
              };
              if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
                onAbort();
                return;
              }
              abortSignal === null || abortSignal === void 0
                ? void 0
                : abortSignal.addEventListener("abort", onAbort, { once: true });
              emitter === null || emitter === void 0
                ? void 0
                : emitter.on("error", onGatewayErrorEvent);
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
