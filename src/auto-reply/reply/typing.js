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
exports.createTypingController = createTypingController;
var tokens_js_1 = require("../tokens.js");
function createTypingController(params) {
  var _this = this;
  var onReplyStart = params.onReplyStart,
    _a = params.typingIntervalSeconds,
    typingIntervalSeconds = _a === void 0 ? 6 : _a,
    _b = params.typingTtlMs,
    typingTtlMs = _b === void 0 ? 2 * 60000 : _b,
    _c = params.silentToken,
    silentToken = _c === void 0 ? tokens_js_1.SILENT_REPLY_TOKEN : _c,
    log = params.log;
  var started = false;
  var active = false;
  var runComplete = false;
  var dispatchIdle = false;
  // Important: callbacks (tool/block streaming) can fire late (after the run completed),
  // especially when upstream event emitters don't await async listeners.
  // Once we stop typing, we "seal" the controller so late events can't restart typing forever.
  var sealed = false;
  var typingTimer;
  var typingTtlTimer;
  var typingIntervalMs = typingIntervalSeconds * 1000;
  var formatTypingTtl = function (ms) {
    if (ms % 60000 === 0) {
      return "".concat(ms / 60000, "m");
    }
    return "".concat(Math.round(ms / 1000), "s");
  };
  var resetCycle = function () {
    started = false;
    active = false;
    runComplete = false;
    dispatchIdle = false;
  };
  var cleanup = function () {
    if (sealed) {
      return;
    }
    if (typingTtlTimer) {
      clearTimeout(typingTtlTimer);
      typingTtlTimer = undefined;
    }
    if (typingTimer) {
      clearInterval(typingTimer);
      typingTimer = undefined;
    }
    resetCycle();
    sealed = true;
  };
  var refreshTypingTtl = function () {
    if (sealed) {
      return;
    }
    if (!typingIntervalMs || typingIntervalMs <= 0) {
      return;
    }
    if (typingTtlMs <= 0) {
      return;
    }
    if (typingTtlTimer) {
      clearTimeout(typingTtlTimer);
    }
    typingTtlTimer = setTimeout(function () {
      if (!typingTimer) {
        return;
      }
      log === null || log === void 0
        ? void 0
        : log(
            "typing TTL reached (".concat(
              formatTypingTtl(typingTtlMs),
              "); stopping typing indicator",
            ),
          );
      cleanup();
    }, typingTtlMs);
  };
  var isActive = function () {
    return active && !sealed;
  };
  var triggerTyping = function () {
    return __awaiter(_this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (sealed) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              onReplyStart === null || onReplyStart === void 0 ? void 0 : onReplyStart(),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  var ensureStart = function () {
    return __awaiter(_this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (sealed) {
              return [2 /*return*/];
            }
            // Late callbacks after a run completed should never restart typing.
            if (runComplete) {
              return [2 /*return*/];
            }
            if (!active) {
              active = true;
            }
            if (started) {
              return [2 /*return*/];
            }
            started = true;
            return [4 /*yield*/, triggerTyping()];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  var maybeStopOnIdle = function () {
    if (!active) {
      return;
    }
    // Stop only when the model run is done and the dispatcher queue is empty.
    if (runComplete && dispatchIdle) {
      cleanup();
    }
  };
  var startTypingLoop = function () {
    return __awaiter(_this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (sealed) {
              return [2 /*return*/];
            }
            if (runComplete) {
              return [2 /*return*/];
            }
            // Always refresh TTL when called, even if loop already running.
            // This keeps typing alive during long tool executions.
            refreshTypingTtl();
            if (!onReplyStart) {
              return [2 /*return*/];
            }
            if (typingIntervalMs <= 0) {
              return [2 /*return*/];
            }
            if (typingTimer) {
              return [2 /*return*/];
            }
            return [4 /*yield*/, ensureStart()];
          case 1:
            _a.sent();
            typingTimer = setInterval(function () {
              void triggerTyping();
            }, typingIntervalMs);
            return [2 /*return*/];
        }
      });
    });
  };
  var startTypingOnText = function (text) {
    return __awaiter(_this, void 0, void 0, function () {
      var trimmed;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (sealed) {
              return [2 /*return*/];
            }
            trimmed = text === null || text === void 0 ? void 0 : text.trim();
            if (!trimmed) {
              return [2 /*return*/];
            }
            if (silentToken && (0, tokens_js_1.isSilentReplyText)(trimmed, silentToken)) {
              return [2 /*return*/];
            }
            refreshTypingTtl();
            return [4 /*yield*/, startTypingLoop()];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  var markRunComplete = function () {
    runComplete = true;
    maybeStopOnIdle();
  };
  var markDispatchIdle = function () {
    dispatchIdle = true;
    maybeStopOnIdle();
  };
  return {
    onReplyStart: ensureStart,
    startTypingLoop: startTypingLoop,
    startTypingOnText: startTypingOnText,
    refreshTypingTtl: refreshTypingTtl,
    isActive: isActive,
    markRunComplete: markRunComplete,
    markDispatchIdle: markDispatchIdle,
    cleanup: cleanup,
  };
}
