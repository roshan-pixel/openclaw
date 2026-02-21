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
exports.dispatchPreparedSlackMessage = dispatchPreparedSlackMessage;
var identity_js_1 = require("../../../agents/identity.js");
var dispatch_js_1 = require("../../../auto-reply/dispatch.js");
var history_js_1 = require("../../../auto-reply/reply/history.js");
var ack_reactions_js_1 = require("../../../channels/ack-reactions.js");
var logging_js_1 = require("../../../channels/logging.js");
var reply_prefix_js_1 = require("../../../channels/reply-prefix.js");
var typing_js_1 = require("../../../channels/typing.js");
var reply_dispatcher_js_1 = require("../../../auto-reply/reply/reply-dispatcher.js");
var sessions_js_1 = require("../../../config/sessions.js");
var globals_js_1 = require("../../../globals.js");
var actions_js_1 = require("../../actions.js");
var threading_js_1 = require("../../threading.js");
var replies_js_1 = require("../replies.js");
function dispatchPreparedSlackMessage(prepared) {
  return __awaiter(this, void 0, void 0, function () {
    var ctx,
      account,
      message,
      route,
      cfg,
      runtime,
      sessionCfg,
      storePath,
      statusThreadTs,
      messageTs,
      incomingThreadTs,
      didSetStatus,
      hasRepliedRef,
      replyPlan,
      typingTarget,
      typingCallbacks,
      prefixContext,
      _a,
      dispatcher,
      replyOptions,
      markDispatchIdle,
      _b,
      queuedFinal,
      counts,
      anyReplyDelivered,
      finalCount;
    var _this = this;
    var _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          ((ctx = prepared.ctx),
            (account = prepared.account),
            (message = prepared.message),
            (route = prepared.route));
          cfg = ctx.cfg;
          runtime = ctx.runtime;
          if (!prepared.isDirectMessage) {
            return [3 /*break*/, 2];
          }
          sessionCfg = cfg.session;
          storePath = (0, sessions_js_1.resolveStorePath)(
            sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.store,
            {
              agentId: route.agentId,
            },
          );
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateLastRoute)({
              storePath: storePath,
              sessionKey: route.mainSessionKey,
              deliveryContext: {
                channel: "slack",
                to: "user:".concat(message.user),
                accountId: route.accountId,
              },
              ctx: prepared.ctxPayload,
            }),
          ];
        case 1:
          _g.sent();
          _g.label = 2;
        case 2:
          statusThreadTs = (0, threading_js_1.resolveSlackThreadTargets)({
            message: message,
            replyToMode: ctx.replyToMode,
          }).statusThreadTs;
          messageTs = (_c = message.ts) !== null && _c !== void 0 ? _c : message.event_ts;
          incomingThreadTs = message.thread_ts;
          didSetStatus = false;
          hasRepliedRef = { value: false };
          replyPlan = (0, replies_js_1.createSlackReplyDeliveryPlan)({
            replyToMode: ctx.replyToMode,
            incomingThreadTs: incomingThreadTs,
            messageTs: messageTs,
            hasRepliedRef: hasRepliedRef,
          });
          typingTarget = statusThreadTs
            ? "".concat(message.channel, "/").concat(statusThreadTs)
            : message.channel;
          typingCallbacks = (0, typing_js_1.createTypingCallbacks)({
            start: function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      didSetStatus = true;
                      return [
                        4 /*yield*/,
                        ctx.setSlackThreadStatus({
                          channelId: message.channel,
                          threadTs: statusThreadTs,
                          status: "is typing...",
                        }),
                      ];
                    case 1:
                      _a.sent();
                      return [2 /*return*/];
                  }
                });
              });
            },
            stop: function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      if (!didSetStatus) {
                        return [2 /*return*/];
                      }
                      didSetStatus = false;
                      return [
                        4 /*yield*/,
                        ctx.setSlackThreadStatus({
                          channelId: message.channel,
                          threadTs: statusThreadTs,
                          status: "",
                        }),
                      ];
                    case 1:
                      _a.sent();
                      return [2 /*return*/];
                  }
                });
              });
            },
            onStartError: function (err) {
              (0, logging_js_1.logTypingFailure)({
                log: function (message) {
                  var _a;
                  return (_a = runtime.error) === null || _a === void 0
                    ? void 0
                    : _a.call(runtime, (0, globals_js_1.danger)(message));
                },
                channel: "slack",
                action: "start",
                target: typingTarget,
                error: err,
              });
            },
            onStopError: function (err) {
              (0, logging_js_1.logTypingFailure)({
                log: function (message) {
                  var _a;
                  return (_a = runtime.error) === null || _a === void 0
                    ? void 0
                    : _a.call(runtime, (0, globals_js_1.danger)(message));
                },
                channel: "slack",
                action: "stop",
                target: typingTarget,
                error: err,
              });
            },
          });
          prefixContext = (0, reply_prefix_js_1.createReplyPrefixContext)({
            cfg: cfg,
            agentId: route.agentId,
          });
          ((_a = (0, reply_dispatcher_js_1.createReplyDispatcherWithTyping)({
            responsePrefix: prefixContext.responsePrefix,
            responsePrefixContextProvider: prefixContext.responsePrefixContextProvider,
            humanDelay: (0, identity_js_1.resolveHumanDelayConfig)(cfg, route.agentId),
            deliver: function (payload) {
              return __awaiter(_this, void 0, void 0, function () {
                var replyThreadTs;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      replyThreadTs = replyPlan.nextThreadTs();
                      return [
                        4 /*yield*/,
                        (0, replies_js_1.deliverReplies)({
                          replies: [payload],
                          target: prepared.replyTarget,
                          token: ctx.botToken,
                          accountId: account.accountId,
                          runtime: runtime,
                          textLimit: ctx.textLimit,
                          replyThreadTs: replyThreadTs,
                        }),
                      ];
                    case 1:
                      _a.sent();
                      replyPlan.markSent();
                      return [2 /*return*/];
                  }
                });
              });
            },
            onError: function (err, info) {
              var _a, _b;
              (_a = runtime.error) === null || _a === void 0
                ? void 0
                : _a.call(
                    runtime,
                    (0, globals_js_1.danger)(
                      "slack ".concat(info.kind, " reply failed: ").concat(String(err)),
                    ),
                  );
              (_b = typingCallbacks.onIdle) === null || _b === void 0
                ? void 0
                : _b.call(typingCallbacks);
            },
            onReplyStart: typingCallbacks.onReplyStart,
            onIdle: typingCallbacks.onIdle,
          })),
            (dispatcher = _a.dispatcher),
            (replyOptions = _a.replyOptions),
            (markDispatchIdle = _a.markDispatchIdle));
          return [
            4 /*yield*/,
            (0, dispatch_js_1.dispatchInboundMessage)({
              ctx: prepared.ctxPayload,
              cfg: cfg,
              dispatcher: dispatcher,
              replyOptions: __assign(__assign({}, replyOptions), {
                skillFilter:
                  (_d = prepared.channelConfig) === null || _d === void 0 ? void 0 : _d.skills,
                hasRepliedRef: hasRepliedRef,
                disableBlockStreaming:
                  typeof account.config.blockStreaming === "boolean"
                    ? !account.config.blockStreaming
                    : undefined,
                onModelSelected: function (ctx) {
                  prefixContext.onModelSelected(ctx);
                },
              }),
            }),
          ];
        case 3:
          ((_b = _g.sent()), (queuedFinal = _b.queuedFinal), (counts = _b.counts));
          markDispatchIdle();
          anyReplyDelivered =
            queuedFinal ||
            ((_e = counts.block) !== null && _e !== void 0 ? _e : 0) > 0 ||
            ((_f = counts.final) !== null && _f !== void 0 ? _f : 0) > 0;
          if (!anyReplyDelivered) {
            if (prepared.isRoomish) {
              (0, history_js_1.clearHistoryEntriesIfEnabled)({
                historyMap: ctx.channelHistories,
                historyKey: prepared.historyKey,
                limit: ctx.historyLimit,
              });
            }
            return [2 /*return*/];
          }
          if ((0, globals_js_1.shouldLogVerbose)()) {
            finalCount = counts.final;
            (0, globals_js_1.logVerbose)(
              "slack: delivered "
                .concat(finalCount, " reply")
                .concat(finalCount === 1 ? "" : "ies", " to ")
                .concat(prepared.replyTarget),
            );
          }
          (0, ack_reactions_js_1.removeAckReactionAfterReply)({
            removeAfterReply: ctx.removeAckAfterReply,
            ackReactionPromise: prepared.ackReactionPromise,
            ackReactionValue: prepared.ackReactionValue,
            remove: function () {
              var _a;
              return (0, actions_js_1.removeSlackReaction)(
                message.channel,
                (_a = prepared.ackReactionMessageTs) !== null && _a !== void 0 ? _a : "",
                prepared.ackReactionValue,
                {
                  token: ctx.botToken,
                  client: ctx.app.client,
                },
              );
            },
            onError: function (err) {
              (0, logging_js_1.logAckFailure)({
                log: globals_js_1.logVerbose,
                channel: "slack",
                target: "".concat(message.channel, "/").concat(message.ts),
                error: err,
              });
            },
          });
          if (prepared.isRoomish) {
            (0, history_js_1.clearHistoryEntriesIfEnabled)({
              historyMap: ctx.channelHistories,
              historyKey: prepared.historyKey,
              limit: ctx.historyLimit,
            });
          }
          return [2 /*return*/];
      }
    });
  });
}
