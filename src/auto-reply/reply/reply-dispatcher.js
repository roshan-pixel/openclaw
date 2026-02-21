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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }
    if (s != null && typeof Object.getOwnPropertySymbols === "function") {
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    }
    return t;
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReplyDispatcher = createReplyDispatcher;
exports.createReplyDispatcherWithTyping = createReplyDispatcherWithTyping;
var normalize_reply_js_1 = require("./normalize-reply.js");
var DEFAULT_HUMAN_DELAY_MIN_MS = 800;
var DEFAULT_HUMAN_DELAY_MAX_MS = 2500;
/** Generate a random delay within the configured range. */
function getHumanDelay(config) {
  var _a, _b, _c;
  var mode =
    (_a = config === null || config === void 0 ? void 0 : config.mode) !== null && _a !== void 0
      ? _a
      : "off";
  if (mode === "off") {
    return 0;
  }
  var min =
    mode === "custom"
      ? (_b = config === null || config === void 0 ? void 0 : config.minMs) !== null &&
        _b !== void 0
        ? _b
        : DEFAULT_HUMAN_DELAY_MIN_MS
      : DEFAULT_HUMAN_DELAY_MIN_MS;
  var max =
    mode === "custom"
      ? (_c = config === null || config === void 0 ? void 0 : config.maxMs) !== null &&
        _c !== void 0
        ? _c
        : DEFAULT_HUMAN_DELAY_MAX_MS
      : DEFAULT_HUMAN_DELAY_MAX_MS;
  if (max <= min) {
    return min;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/** Sleep for a given number of milliseconds. */
var sleep = function (ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
};
function normalizeReplyPayloadInternal(payload, opts) {
  var _a, _b;
  // Prefer dynamic context provider over static context
  var prefixContext =
    (_b =
      (_a = opts.responsePrefixContextProvider) === null || _a === void 0
        ? void 0
        : _a.call(opts)) !== null && _b !== void 0
      ? _b
      : opts.responsePrefixContext;
  return (0, normalize_reply_js_1.normalizeReplyPayload)(payload, {
    responsePrefix: opts.responsePrefix,
    responsePrefixContext: prefixContext,
    onHeartbeatStrip: opts.onHeartbeatStrip,
    onSkip: opts.onSkip,
  });
}
function createReplyDispatcher(options) {
  var _this = this;
  var sendChain = Promise.resolve();
  // Track in-flight deliveries so we can emit a reliable "idle" signal.
  var pending = 0;
  // Track whether we've sent a block reply (for human delay - skip delay on first block).
  var sentFirstBlock = false;
  // Serialize outbound replies to preserve tool/block/final order.
  var queuedCounts = {
    tool: 0,
    block: 0,
    final: 0,
  };
  var enqueue = function (kind, payload) {
    var normalized = normalizeReplyPayloadInternal(payload, {
      responsePrefix: options.responsePrefix,
      responsePrefixContext: options.responsePrefixContext,
      responsePrefixContextProvider: options.responsePrefixContextProvider,
      onHeartbeatStrip: options.onHeartbeatStrip,
      onSkip: function (reason) {
        var _a;
        return (_a = options.onSkip) === null || _a === void 0
          ? void 0
          : _a.call(options, payload, { kind: kind, reason: reason });
      },
    });
    if (!normalized) {
      return false;
    }
    queuedCounts[kind] += 1;
    pending += 1;
    // Determine if we should add human-like delay (only for block replies after the first).
    var shouldDelay = kind === "block" && sentFirstBlock;
    if (kind === "block") {
      sentFirstBlock = true;
    }
    sendChain = sendChain
      .then(function () {
        return __awaiter(_this, void 0, void 0, function () {
          var delayMs;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                if (!shouldDelay) {
                  return [3 /*break*/, 2];
                }
                delayMs = getHumanDelay(options.humanDelay);
                if (!(delayMs > 0)) {
                  return [3 /*break*/, 2];
                }
                return [4 /*yield*/, sleep(delayMs)];
              case 1:
                _a.sent();
                _a.label = 2;
              case 2:
                return [4 /*yield*/, options.deliver(normalized, { kind: kind })];
              case 3:
                _a.sent();
                return [2 /*return*/];
            }
          });
        });
      })
      .catch(function (err) {
        var _a;
        (_a = options.onError) === null || _a === void 0
          ? void 0
          : _a.call(options, err, { kind: kind });
      })
      .finally(function () {
        var _a;
        pending -= 1;
        if (pending === 0) {
          (_a = options.onIdle) === null || _a === void 0 ? void 0 : _a.call(options);
        }
      });
    return true;
  };
  return {
    sendToolResult: function (payload) {
      return enqueue("tool", payload);
    },
    sendBlockReply: function (payload) {
      return enqueue("block", payload);
    },
    sendFinalReply: function (payload) {
      return enqueue("final", payload);
    },
    waitForIdle: function () {
      return sendChain;
    },
    getQueuedCounts: function () {
      return __assign({}, queuedCounts);
    },
  };
}
function createReplyDispatcherWithTyping(options) {
  var onReplyStart = options.onReplyStart,
    onIdle = options.onIdle,
    dispatcherOptions = __rest(options, ["onReplyStart", "onIdle"]);
  var typingController;
  var dispatcher = createReplyDispatcher(
    __assign(__assign({}, dispatcherOptions), {
      onIdle: function () {
        typingController === null || typingController === void 0
          ? void 0
          : typingController.markDispatchIdle();
        onIdle === null || onIdle === void 0 ? void 0 : onIdle();
      },
    }),
  );
  return {
    dispatcher: dispatcher,
    replyOptions: {
      onReplyStart: onReplyStart,
      onTypingController: function (typing) {
        typingController = typing;
      },
    },
    markDispatchIdle: function () {
      typingController === null || typingController === void 0
        ? void 0
        : typingController.markDispatchIdle();
      onIdle === null || onIdle === void 0 ? void 0 : onIdle();
    },
  };
}
