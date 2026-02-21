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
exports.createSlackMessageHandler = createSlackMessageHandler;
var command_detection_js_1 = require("../../auto-reply/command-detection.js");
var inbound_debounce_js_1 = require("../../auto-reply/inbound-debounce.js");
var dispatch_js_1 = require("./message-handler/dispatch.js");
var prepare_js_1 = require("./message-handler/prepare.js");
var thread_resolution_js_1 = require("./thread-resolution.js");
function createSlackMessageHandler(params) {
  var _this = this;
  var ctx = params.ctx,
    account = params.account;
  var debounceMs = (0, inbound_debounce_js_1.resolveInboundDebounceMs)({
    cfg: ctx.cfg,
    channel: "slack",
  });
  var threadTsResolver = (0, thread_resolution_js_1.createSlackThreadTsResolver)({
    client: ctx.app.client,
  });
  var debouncer = (0, inbound_debounce_js_1.createInboundDebouncer)({
    debounceMs: debounceMs,
    buildKey: function (entry) {
      var _a, _b;
      var senderId =
        (_a = entry.message.user) !== null && _a !== void 0 ? _a : entry.message.bot_id;
      if (!senderId) {
        return null;
      }
      var messageTs =
        (_b = entry.message.ts) !== null && _b !== void 0 ? _b : entry.message.event_ts;
      // If Slack flags a thread reply but omits thread_ts, isolate it from root debouncing.
      var threadKey = entry.message.thread_ts
        ? "".concat(entry.message.channel, ":").concat(entry.message.thread_ts)
        : entry.message.parent_user_id && messageTs
          ? "".concat(entry.message.channel, ":maybe-thread:").concat(messageTs)
          : entry.message.channel;
      return "slack:".concat(ctx.accountId, ":").concat(threadKey, ":").concat(senderId);
    },
    shouldDebounce: function (entry) {
      var _a;
      var text = (_a = entry.message.text) !== null && _a !== void 0 ? _a : "";
      if (!text.trim()) {
        return false;
      }
      if (entry.message.files && entry.message.files.length > 0) {
        return false;
      }
      return !(0, command_detection_js_1.hasControlCommand)(text, ctx.cfg);
    },
    onFlush: function (entries) {
      return __awaiter(_this, void 0, void 0, function () {
        var last, combinedText, combinedMentioned, syntheticMessage, prepared, ids;
        var _a;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              last = entries.at(-1);
              if (!last) {
                return [2 /*return*/];
              }
              combinedText =
                entries.length === 1
                  ? (_a = last.message.text) !== null && _a !== void 0
                    ? _a
                    : ""
                  : entries
                      .map(function (entry) {
                        var _a;
                        return (_a = entry.message.text) !== null && _a !== void 0 ? _a : "";
                      })
                      .filter(Boolean)
                      .join("\n");
              combinedMentioned = entries.some(function (entry) {
                return Boolean(entry.opts.wasMentioned);
              });
              syntheticMessage = __assign(__assign({}, last.message), { text: combinedText });
              return [
                4 /*yield*/,
                (0, prepare_js_1.prepareSlackMessage)({
                  ctx: ctx,
                  account: account,
                  message: syntheticMessage,
                  opts: __assign(__assign({}, last.opts), {
                    wasMentioned: combinedMentioned || last.opts.wasMentioned,
                  }),
                }),
              ];
            case 1:
              prepared = _b.sent();
              if (!prepared) {
                return [2 /*return*/];
              }
              if (entries.length > 1) {
                ids = entries
                  .map(function (entry) {
                    return entry.message.ts;
                  })
                  .filter(Boolean);
                if (ids.length > 0) {
                  prepared.ctxPayload.MessageSids = ids;
                  prepared.ctxPayload.MessageSidFirst = ids[0];
                  prepared.ctxPayload.MessageSidLast = ids[ids.length - 1];
                }
              }
              return [4 /*yield*/, (0, dispatch_js_1.dispatchPreparedSlackMessage)(prepared)];
            case 2:
              _b.sent();
              return [2 /*return*/];
          }
        });
      });
    },
    onError: function (err) {
      var _a, _b;
      (_b = (_a = ctx.runtime).error) === null || _b === void 0
        ? void 0
        : _b.call(_a, "slack inbound debounce flush failed: ".concat(String(err)));
    },
  });
  return function (message, opts) {
    return __awaiter(_this, void 0, void 0, function () {
      var resolvedMessage;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (opts.source === "message" && message.type !== "message") {
              return [2 /*return*/];
            }
            if (
              opts.source === "message" &&
              message.subtype &&
              message.subtype !== "file_share" &&
              message.subtype !== "bot_message"
            ) {
              return [2 /*return*/];
            }
            if (ctx.markMessageSeen(message.channel, message.ts)) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              threadTsResolver.resolve({ message: message, source: opts.source }),
            ];
          case 1:
            resolvedMessage = _a.sent();
            return [4 /*yield*/, debouncer.enqueue({ message: resolvedMessage, opts: opts })];
          case 2:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
}
