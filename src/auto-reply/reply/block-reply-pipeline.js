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
exports.createAudioAsVoiceBuffer = createAudioAsVoiceBuffer;
exports.createBlockReplyPayloadKey = createBlockReplyPayloadKey;
exports.createBlockReplyPipeline = createBlockReplyPipeline;
var globals_js_1 = require("../../globals.js");
var block_reply_coalescer_js_1 = require("./block-reply-coalescer.js");
function createAudioAsVoiceBuffer(params) {
  var seenAudioAsVoice = false;
  return {
    onEnqueue: function (payload) {
      if (payload.audioAsVoice) {
        seenAudioAsVoice = true;
      }
    },
    shouldBuffer: function (payload) {
      return params.isAudioPayload(payload);
    },
    finalize: function (payload) {
      return seenAudioAsVoice ? __assign(__assign({}, payload), { audioAsVoice: true }) : payload;
    },
  };
}
function createBlockReplyPayloadKey(payload) {
  var _a, _b, _c, _d;
  var text =
    (_b = (_a = payload.text) === null || _a === void 0 ? void 0 : _a.trim()) !== null &&
    _b !== void 0
      ? _b
      : "";
  var mediaList = ((_c = payload.mediaUrls) === null || _c === void 0 ? void 0 : _c.length)
    ? payload.mediaUrls
    : payload.mediaUrl
      ? [payload.mediaUrl]
      : [];
  return JSON.stringify({
    text: text,
    mediaList: mediaList,
    replyToId: (_d = payload.replyToId) !== null && _d !== void 0 ? _d : null,
  });
}
var withTimeout = function (promise, timeoutMs, timeoutError) {
  return __awaiter(void 0, void 0, void 0, function () {
    var timer, timeoutPromise;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!timeoutMs || timeoutMs <= 0) {
            return [2 /*return*/, promise];
          }
          timeoutPromise = new Promise(function (_, reject) {
            timer = setTimeout(function () {
              return reject(timeoutError);
            }, timeoutMs);
          });
          _a.label = 1;
        case 1:
          _a.trys.push([1, , 3, 4]);
          return [4 /*yield*/, Promise.race([promise, timeoutPromise])];
        case 2:
          return [2 /*return*/, _a.sent()];
        case 3:
          if (timer) {
            clearTimeout(timer);
          }
          return [7 /*endfinally*/];
        case 4:
          return [2 /*return*/];
      }
    });
  });
};
function createBlockReplyPipeline(params) {
  var _this = this;
  var onBlockReply = params.onBlockReply,
    timeoutMs = params.timeoutMs,
    coalescing = params.coalescing,
    buffer = params.buffer;
  var sentKeys = new Set();
  var pendingKeys = new Set();
  var seenKeys = new Set();
  var bufferedKeys = new Set();
  var bufferedPayloadKeys = new Set();
  var bufferedPayloads = [];
  var sendChain = Promise.resolve();
  var aborted = false;
  var didStream = false;
  var didLogTimeout = false;
  var sendPayload = function (payload, skipSeen) {
    if (aborted) {
      return;
    }
    var payloadKey = createBlockReplyPayloadKey(payload);
    if (!skipSeen) {
      if (seenKeys.has(payloadKey)) {
        return;
      }
      seenKeys.add(payloadKey);
    }
    if (sentKeys.has(payloadKey) || pendingKeys.has(payloadKey)) {
      return;
    }
    pendingKeys.add(payloadKey);
    var timeoutError = new Error("block reply delivery timed out after ".concat(timeoutMs, "ms"));
    var abortController = new AbortController();
    sendChain = sendChain
      .then(function () {
        return __awaiter(_this, void 0, void 0, function () {
          var _a;
          return __generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                if (aborted) {
                  return [2 /*return*/, false];
                }
                return [
                  4 /*yield*/,
                  withTimeout(
                    (_a = onBlockReply(payload, {
                      abortSignal: abortController.signal,
                      timeoutMs: timeoutMs,
                    })) !== null && _a !== void 0
                      ? _a
                      : Promise.resolve(),
                    timeoutMs,
                    timeoutError,
                  ),
                ];
              case 1:
                _b.sent();
                return [2 /*return*/, true];
            }
          });
        });
      })
      .then(function (didSend) {
        if (!didSend) {
          return;
        }
        sentKeys.add(payloadKey);
        didStream = true;
      })
      .catch(function (err) {
        if (err === timeoutError) {
          abortController.abort();
          aborted = true;
          if (!didLogTimeout) {
            didLogTimeout = true;
            (0, globals_js_1.logVerbose)(
              "block reply delivery timed out after ".concat(
                timeoutMs,
                "ms; skipping remaining block replies to preserve ordering",
              ),
            );
          }
          return;
        }
        (0, globals_js_1.logVerbose)("block reply delivery failed: ".concat(String(err)));
      })
      .finally(function () {
        pendingKeys.delete(payloadKey);
      });
  };
  var coalescer = coalescing
    ? (0, block_reply_coalescer_js_1.createBlockReplyCoalescer)({
        config: coalescing,
        shouldAbort: function () {
          return aborted;
        },
        onFlush: function (payload) {
          bufferedKeys.clear();
          sendPayload(payload);
        },
      })
    : null;
  var bufferPayload = function (payload) {
    var _a;
    (_a = buffer === null || buffer === void 0 ? void 0 : buffer.onEnqueue) === null ||
    _a === void 0
      ? void 0
      : _a.call(buffer, payload);
    if (!(buffer === null || buffer === void 0 ? void 0 : buffer.shouldBuffer(payload))) {
      return false;
    }
    var payloadKey = createBlockReplyPayloadKey(payload);
    if (
      seenKeys.has(payloadKey) ||
      sentKeys.has(payloadKey) ||
      pendingKeys.has(payloadKey) ||
      bufferedPayloadKeys.has(payloadKey)
    ) {
      return true;
    }
    seenKeys.add(payloadKey);
    bufferedPayloadKeys.add(payloadKey);
    bufferedPayloads.push(payload);
    return true;
  };
  var flushBuffered = function () {
    var _a, _b;
    if (!bufferedPayloads.length) {
      return;
    }
    for (var _i = 0, bufferedPayloads_1 = bufferedPayloads; _i < bufferedPayloads_1.length; _i++) {
      var payload = bufferedPayloads_1[_i];
      var finalPayload =
        (_b =
          (_a = buffer === null || buffer === void 0 ? void 0 : buffer.finalize) === null ||
          _a === void 0
            ? void 0
            : _a.call(buffer, payload)) !== null && _b !== void 0
          ? _b
          : payload;
      sendPayload(finalPayload, true);
    }
    bufferedPayloads.length = 0;
    bufferedPayloadKeys.clear();
  };
  var enqueue = function (payload) {
    var _a, _b;
    if (aborted) {
      return;
    }
    if (bufferPayload(payload)) {
      return;
    }
    var hasMedia =
      Boolean(payload.mediaUrl) ||
      ((_b = (_a = payload.mediaUrls) === null || _a === void 0 ? void 0 : _a.length) !== null &&
      _b !== void 0
        ? _b
        : 0) > 0;
    if (hasMedia) {
      void (coalescer === null || coalescer === void 0 ? void 0 : coalescer.flush({ force: true }));
      sendPayload(payload);
      return;
    }
    if (coalescer) {
      var payloadKey = createBlockReplyPayloadKey(payload);
      if (seenKeys.has(payloadKey) || pendingKeys.has(payloadKey) || bufferedKeys.has(payloadKey)) {
        return;
      }
      bufferedKeys.add(payloadKey);
      coalescer.enqueue(payload);
      return;
    }
    sendPayload(payload);
  };
  var flush = function (options) {
    return __awaiter(_this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              coalescer === null || coalescer === void 0 ? void 0 : coalescer.flush(options),
            ];
          case 1:
            _a.sent();
            flushBuffered();
            return [4 /*yield*/, sendChain];
          case 2:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  var stop = function () {
    coalescer === null || coalescer === void 0 ? void 0 : coalescer.stop();
  };
  return {
    enqueue: enqueue,
    flush: flush,
    stop: stop,
    hasBuffered: function () {
      return Boolean(
        (coalescer === null || coalescer === void 0 ? void 0 : coalescer.hasBuffered()) ||
        bufferedPayloads.length > 0,
      );
    },
    didStream: function () {
      return didStream;
    },
    isAborted: function () {
      return aborted;
    },
    hasSentPayload: function (payload) {
      var payloadKey = createBlockReplyPayloadKey(payload);
      return sentKeys.has(payloadKey);
    },
  };
}
