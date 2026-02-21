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
exports.dispatchReplyFromConfig = dispatchReplyFromConfig;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var sessions_js_1 = require("../../config/sessions.js");
var globals_js_1 = require("../../globals.js");
var diagnostic_events_js_1 = require("../../infra/diagnostic-events.js");
var diagnostic_js_1 = require("../../logging/diagnostic.js");
var hook_runner_global_js_1 = require("../../plugins/hook-runner-global.js");
var reply_js_1 = require("../reply.js");
var abort_js_1 = require("./abort.js");
var inbound_dedupe_js_1 = require("./inbound-dedupe.js");
var route_reply_js_1 = require("./route-reply.js");
var tts_js_1 = require("../../tts/tts.js");
var AUDIO_PLACEHOLDER_RE = /^<media:audio>(\s*\([^)]*\))?$/i;
var AUDIO_HEADER_RE = /^\[Audio\b/i;
var normalizeMediaType = function (value) {
  var _a;
  return (_a = value.split(";")[0]) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
};
var isInboundAudioContext = function (ctx) {
  var rawTypes = __spreadArray(
    [typeof ctx.MediaType === "string" ? ctx.MediaType : undefined],
    Array.isArray(ctx.MediaTypes) ? ctx.MediaTypes : [],
    true,
  ).filter(Boolean);
  var types = rawTypes.map(function (type) {
    return normalizeMediaType(type);
  });
  if (
    types.some(function (type) {
      return type === "audio" || type.startsWith("audio/");
    })
  ) {
    return true;
  }
  var body =
    typeof ctx.BodyForCommands === "string"
      ? ctx.BodyForCommands
      : typeof ctx.CommandBody === "string"
        ? ctx.CommandBody
        : typeof ctx.RawBody === "string"
          ? ctx.RawBody
          : typeof ctx.Body === "string"
            ? ctx.Body
            : "";
  var trimmed = body.trim();
  if (!trimmed) {
    return false;
  }
  if (AUDIO_PLACEHOLDER_RE.test(trimmed)) {
    return true;
  }
  return AUDIO_HEADER_RE.test(trimmed);
};
var resolveSessionTtsAuto = function (ctx, cfg) {
  var _a, _b, _c, _d;
  var targetSessionKey =
    ctx.CommandSource === "native"
      ? (_a = ctx.CommandTargetSessionKey) === null || _a === void 0
        ? void 0
        : _a.trim()
      : undefined;
  var sessionKey =
    (_b =
      targetSessionKey !== null && targetSessionKey !== void 0
        ? targetSessionKey
        : ctx.SessionKey) === null || _b === void 0
      ? void 0
      : _b.trim();
  if (!sessionKey) {
    return undefined;
  }
  var agentId = (0, agent_scope_js_1.resolveSessionAgentId)({
    sessionKey: sessionKey,
    config: cfg,
  });
  var storePath = (0, sessions_js_1.resolveStorePath)(
    (_c = cfg.session) === null || _c === void 0 ? void 0 : _c.store,
    { agentId: agentId },
  );
  try {
    var store = (0, sessions_js_1.loadSessionStore)(storePath);
    var entry =
      (_d = store[sessionKey.toLowerCase()]) !== null && _d !== void 0 ? _d : store[sessionKey];
    return (0, tts_js_1.normalizeTtsAutoMode)(
      entry === null || entry === void 0 ? void 0 : entry.ttsAuto,
    );
  } catch (_e) {
    return undefined;
  }
};
function dispatchReplyFromConfig(params) {
  return __awaiter(this, void 0, void 0, function () {
    var ctx,
      cfg,
      dispatcher,
      diagnosticsEnabled,
      channel,
      chatId,
      messageId,
      sessionKey,
      startTime,
      canTrackSession,
      recordProcessed,
      markProcessing,
      markIdle,
      inboundAudio,
      sessionTtsAuto,
      hookRunner,
      timestamp,
      messageIdForHook,
      content,
      channelId,
      conversationId,
      originatingChannel,
      originatingTo,
      currentSurface,
      shouldRouteToOriginating,
      ttsChannel,
      sendPayloadAsync,
      fastAbort,
      payload,
      queuedFinal_1,
      routedFinalCount_1,
      result,
      counts_1,
      accumulatedBlockText_1,
      blockCount_1,
      replyResult,
      replies,
      queuedFinal,
      routedFinalCount,
      _i,
      replies_1,
      reply,
      ttsReply,
      result,
      ttsMode,
      ttsSyntheticReply,
      ttsOnlyPayload,
      result,
      didQueue,
      err_1,
      counts,
      err_2;
    var _this = this;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    return __generator(this, function (_y) {
      switch (_y.label) {
        case 0:
          ((ctx = params.ctx), (cfg = params.cfg), (dispatcher = params.dispatcher));
          diagnosticsEnabled = (0, diagnostic_events_js_1.isDiagnosticsEnabled)(cfg);
          channel = String(
            (_b = (_a = ctx.Surface) !== null && _a !== void 0 ? _a : ctx.Provider) !== null &&
              _b !== void 0
              ? _b
              : "unknown",
          ).toLowerCase();
          chatId = (_c = ctx.To) !== null && _c !== void 0 ? _c : ctx.From;
          messageId =
            (_e = (_d = ctx.MessageSid) !== null && _d !== void 0 ? _d : ctx.MessageSidFirst) !==
              null && _e !== void 0
              ? _e
              : ctx.MessageSidLast;
          sessionKey = ctx.SessionKey;
          startTime = diagnosticsEnabled ? Date.now() : 0;
          canTrackSession = diagnosticsEnabled && Boolean(sessionKey);
          recordProcessed = function (outcome, opts) {
            if (!diagnosticsEnabled) {
              return;
            }
            (0, diagnostic_js_1.logMessageProcessed)({
              channel: channel,
              chatId: chatId,
              messageId: messageId,
              sessionKey: sessionKey,
              durationMs: Date.now() - startTime,
              outcome: outcome,
              reason: opts === null || opts === void 0 ? void 0 : opts.reason,
              error: opts === null || opts === void 0 ? void 0 : opts.error,
            });
          };
          markProcessing = function () {
            if (!canTrackSession || !sessionKey) {
              return;
            }
            (0, diagnostic_js_1.logMessageQueued)({
              sessionKey: sessionKey,
              channel: channel,
              source: "dispatch",
            });
            (0, diagnostic_js_1.logSessionStateChange)({
              sessionKey: sessionKey,
              state: "processing",
              reason: "message_start",
            });
          };
          markIdle = function (reason) {
            if (!canTrackSession || !sessionKey) {
              return;
            }
            (0, diagnostic_js_1.logSessionStateChange)({
              sessionKey: sessionKey,
              state: "idle",
              reason: reason,
            });
          };
          if ((0, inbound_dedupe_js_1.shouldSkipDuplicateInbound)(ctx)) {
            recordProcessed("skipped", { reason: "duplicate" });
            return [2 /*return*/, { queuedFinal: false, counts: dispatcher.getQueuedCounts() }];
          }
          inboundAudio = isInboundAudioContext(ctx);
          sessionTtsAuto = resolveSessionTtsAuto(ctx, cfg);
          hookRunner = (0, hook_runner_global_js_1.getGlobalHookRunner)();
          if (
            hookRunner === null || hookRunner === void 0
              ? void 0
              : hookRunner.hasHooks("message_received")
          ) {
            timestamp =
              typeof ctx.Timestamp === "number" && Number.isFinite(ctx.Timestamp)
                ? ctx.Timestamp
                : undefined;
            messageIdForHook =
              (_h =
                (_g = (_f = ctx.MessageSidFull) !== null && _f !== void 0 ? _f : ctx.MessageSid) !==
                  null && _g !== void 0
                  ? _g
                  : ctx.MessageSidFirst) !== null && _h !== void 0
                ? _h
                : ctx.MessageSidLast;
            content =
              typeof ctx.BodyForCommands === "string"
                ? ctx.BodyForCommands
                : typeof ctx.RawBody === "string"
                  ? ctx.RawBody
                  : typeof ctx.Body === "string"
                    ? ctx.Body
                    : "";
            channelId = (
              (_l =
                (_k =
                  (_j = ctx.OriginatingChannel) !== null && _j !== void 0 ? _j : ctx.Surface) !==
                  null && _k !== void 0
                  ? _k
                  : ctx.Provider) !== null && _l !== void 0
                ? _l
                : ""
            ).toLowerCase();
            conversationId =
              (_p =
                (_o = (_m = ctx.OriginatingTo) !== null && _m !== void 0 ? _m : ctx.To) !== null &&
                _o !== void 0
                  ? _o
                  : ctx.From) !== null && _p !== void 0
                ? _p
                : undefined;
            void hookRunner
              .runMessageReceived(
                {
                  from: (_q = ctx.From) !== null && _q !== void 0 ? _q : "",
                  content: content,
                  timestamp: timestamp,
                  metadata: {
                    to: ctx.To,
                    provider: ctx.Provider,
                    surface: ctx.Surface,
                    threadId: ctx.MessageThreadId,
                    originatingChannel: ctx.OriginatingChannel,
                    originatingTo: ctx.OriginatingTo,
                    messageId: messageIdForHook,
                    senderId: ctx.SenderId,
                    senderName: ctx.SenderName,
                    senderUsername: ctx.SenderUsername,
                    senderE164: ctx.SenderE164,
                  },
                },
                {
                  channelId: channelId,
                  accountId: ctx.AccountId,
                  conversationId: conversationId,
                },
              )
              .catch(function (err) {
                (0, globals_js_1.logVerbose)(
                  "dispatch-from-config: message_received hook failed: ".concat(String(err)),
                );
              });
          }
          originatingChannel = ctx.OriginatingChannel;
          originatingTo = ctx.OriginatingTo;
          currentSurface =
            (_s = (_r = ctx.Surface) !== null && _r !== void 0 ? _r : ctx.Provider) === null ||
            _s === void 0
              ? void 0
              : _s.toLowerCase();
          shouldRouteToOriginating =
            (0, route_reply_js_1.isRoutableChannel)(originatingChannel) &&
            originatingTo &&
            originatingChannel !== currentSurface;
          ttsChannel = shouldRouteToOriginating ? originatingChannel : currentSurface;
          sendPayloadAsync = function (payload, abortSignal, mirror) {
            return __awaiter(_this, void 0, void 0, function () {
              var result;
              var _a;
              return __generator(this, function (_b) {
                switch (_b.label) {
                  case 0:
                    // TypeScript doesn't narrow these from the shouldRouteToOriginating check,
                    // but they're guaranteed non-null when this function is called.
                    if (!originatingChannel || !originatingTo) {
                      return [2 /*return*/];
                    }
                    if (
                      abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted
                    ) {
                      return [2 /*return*/];
                    }
                    return [
                      4 /*yield*/,
                      (0, route_reply_js_1.routeReply)({
                        payload: payload,
                        channel: originatingChannel,
                        to: originatingTo,
                        sessionKey: ctx.SessionKey,
                        accountId: ctx.AccountId,
                        threadId: ctx.MessageThreadId,
                        cfg: cfg,
                        abortSignal: abortSignal,
                        mirror: mirror,
                      }),
                    ];
                  case 1:
                    result = _b.sent();
                    if (!result.ok) {
                      (0, globals_js_1.logVerbose)(
                        "dispatch-from-config: route-reply failed: ".concat(
                          (_a = result.error) !== null && _a !== void 0 ? _a : "unknown error",
                        ),
                      );
                    }
                    return [2 /*return*/];
                }
              });
            });
          };
          markProcessing();
          _y.label = 1;
        case 1:
          _y.trys.push([1, 23, , 24]);
          return [4 /*yield*/, (0, abort_js_1.tryFastAbortFromMessage)({ ctx: ctx, cfg: cfg })];
        case 2:
          fastAbort = _y.sent();
          if (!fastAbort.handled) {
            return [3 /*break*/, 7];
          }
          payload = {
            text: (0, abort_js_1.formatAbortReplyText)(fastAbort.stoppedSubagents),
          };
          queuedFinal_1 = false;
          routedFinalCount_1 = 0;
          if (!(shouldRouteToOriginating && originatingChannel && originatingTo)) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            (0, route_reply_js_1.routeReply)({
              payload: payload,
              channel: originatingChannel,
              to: originatingTo,
              sessionKey: ctx.SessionKey,
              accountId: ctx.AccountId,
              threadId: ctx.MessageThreadId,
              cfg: cfg,
            }),
          ];
        case 3:
          result = _y.sent();
          queuedFinal_1 = result.ok;
          if (result.ok) {
            routedFinalCount_1 += 1;
          }
          if (!result.ok) {
            (0, globals_js_1.logVerbose)(
              "dispatch-from-config: route-reply (abort) failed: ".concat(
                (_t = result.error) !== null && _t !== void 0 ? _t : "unknown error",
              ),
            );
          }
          return [3 /*break*/, 5];
        case 4:
          queuedFinal_1 = dispatcher.sendFinalReply(payload);
          _y.label = 5;
        case 5:
          return [4 /*yield*/, dispatcher.waitForIdle()];
        case 6:
          _y.sent();
          counts_1 = dispatcher.getQueuedCounts();
          counts_1.final += routedFinalCount_1;
          recordProcessed("completed", { reason: "fast_abort" });
          markIdle("message_completed");
          return [2 /*return*/, { queuedFinal: queuedFinal_1, counts: counts_1 }];
        case 7:
          accumulatedBlockText_1 = "";
          blockCount_1 = 0;
          return [
            4 /*yield*/,
            ((_u = params.replyResolver) !== null && _u !== void 0
              ? _u
              : reply_js_1.getReplyFromConfig)(
              ctx,
              __assign(__assign({}, params.replyOptions), {
                onToolResult:
                  ctx.ChatType !== "group" && ctx.CommandSource !== "native"
                    ? function (payload) {
                        var run = function () {
                          return __awaiter(_this, void 0, void 0, function () {
                            var ttsPayload;
                            return __generator(this, function (_a) {
                              switch (_a.label) {
                                case 0:
                                  return [
                                    4 /*yield*/,
                                    (0, tts_js_1.maybeApplyTtsToPayload)({
                                      payload: payload,
                                      cfg: cfg,
                                      channel: ttsChannel,
                                      kind: "tool",
                                      inboundAudio: inboundAudio,
                                      ttsAuto: sessionTtsAuto,
                                    }),
                                  ];
                                case 1:
                                  ttsPayload = _a.sent();
                                  if (!shouldRouteToOriginating) {
                                    return [3 /*break*/, 3];
                                  }
                                  return [
                                    4 /*yield*/,
                                    sendPayloadAsync(ttsPayload, undefined, false),
                                  ];
                                case 2:
                                  _a.sent();
                                  return [3 /*break*/, 4];
                                case 3:
                                  dispatcher.sendToolResult(ttsPayload);
                                  _a.label = 4;
                                case 4:
                                  return [2 /*return*/];
                              }
                            });
                          });
                        };
                        return run();
                      }
                    : undefined,
                onBlockReply: function (payload, context) {
                  var run = function () {
                    return __awaiter(_this, void 0, void 0, function () {
                      var ttsPayload;
                      return __generator(this, function (_a) {
                        switch (_a.label) {
                          case 0:
                            // Accumulate block text for TTS generation after streaming
                            if (payload.text) {
                              if (accumulatedBlockText_1.length > 0) {
                                accumulatedBlockText_1 += "\n";
                              }
                              accumulatedBlockText_1 += payload.text;
                              blockCount_1++;
                            }
                            return [
                              4 /*yield*/,
                              (0, tts_js_1.maybeApplyTtsToPayload)({
                                payload: payload,
                                cfg: cfg,
                                channel: ttsChannel,
                                kind: "block",
                                inboundAudio: inboundAudio,
                                ttsAuto: sessionTtsAuto,
                              }),
                            ];
                          case 1:
                            ttsPayload = _a.sent();
                            if (!shouldRouteToOriginating) {
                              return [3 /*break*/, 3];
                            }
                            return [
                              4 /*yield*/,
                              sendPayloadAsync(
                                ttsPayload,
                                context === null || context === void 0
                                  ? void 0
                                  : context.abortSignal,
                                false,
                              ),
                            ];
                          case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                          case 3:
                            dispatcher.sendBlockReply(ttsPayload);
                            _a.label = 4;
                          case 4:
                            return [2 /*return*/];
                        }
                      });
                    });
                  };
                  return run();
                },
              }),
              cfg,
            ),
          ];
        case 8:
          replyResult = _y.sent();
          replies = replyResult ? (Array.isArray(replyResult) ? replyResult : [replyResult]) : [];
          queuedFinal = false;
          routedFinalCount = 0;
          ((_i = 0), (replies_1 = replies));
          _y.label = 9;
        case 9:
          if (!(_i < replies_1.length)) {
            return [3 /*break*/, 14];
          }
          reply = replies_1[_i];
          return [
            4 /*yield*/,
            (0, tts_js_1.maybeApplyTtsToPayload)({
              payload: reply,
              cfg: cfg,
              channel: ttsChannel,
              kind: "final",
              inboundAudio: inboundAudio,
              ttsAuto: sessionTtsAuto,
            }),
          ];
        case 10:
          ttsReply = _y.sent();
          if (!(shouldRouteToOriginating && originatingChannel && originatingTo)) {
            return [3 /*break*/, 12];
          }
          return [
            4 /*yield*/,
            (0, route_reply_js_1.routeReply)({
              payload: ttsReply,
              channel: originatingChannel,
              to: originatingTo,
              sessionKey: ctx.SessionKey,
              accountId: ctx.AccountId,
              threadId: ctx.MessageThreadId,
              cfg: cfg,
            }),
          ];
        case 11:
          result = _y.sent();
          if (!result.ok) {
            (0, globals_js_1.logVerbose)(
              "dispatch-from-config: route-reply (final) failed: ".concat(
                (_v = result.error) !== null && _v !== void 0 ? _v : "unknown error",
              ),
            );
          }
          queuedFinal = result.ok || queuedFinal;
          if (result.ok) {
            routedFinalCount += 1;
          }
          return [3 /*break*/, 13];
        case 12:
          queuedFinal = dispatcher.sendFinalReply(ttsReply) || queuedFinal;
          _y.label = 13;
        case 13:
          _i++;
          return [3 /*break*/, 9];
        case 14:
          ttsMode =
            (_w = (0, tts_js_1.resolveTtsConfig)(cfg).mode) !== null && _w !== void 0
              ? _w
              : "final";
          if (
            !(
              ttsMode === "final" &&
              replies.length === 0 &&
              blockCount_1 > 0 &&
              accumulatedBlockText_1.trim()
            )
          ) {
            return [3 /*break*/, 21];
          }
          _y.label = 15;
        case 15:
          _y.trys.push([15, 20, , 21]);
          return [
            4 /*yield*/,
            (0, tts_js_1.maybeApplyTtsToPayload)({
              payload: { text: accumulatedBlockText_1 },
              cfg: cfg,
              channel: ttsChannel,
              kind: "final",
              inboundAudio: inboundAudio,
              ttsAuto: sessionTtsAuto,
            }),
          ];
        case 16:
          ttsSyntheticReply = _y.sent();
          if (!ttsSyntheticReply.mediaUrl) {
            return [3 /*break*/, 19];
          }
          ttsOnlyPayload = {
            mediaUrl: ttsSyntheticReply.mediaUrl,
            audioAsVoice: ttsSyntheticReply.audioAsVoice,
          };
          if (!(shouldRouteToOriginating && originatingChannel && originatingTo)) {
            return [3 /*break*/, 18];
          }
          return [
            4 /*yield*/,
            (0, route_reply_js_1.routeReply)({
              payload: ttsOnlyPayload,
              channel: originatingChannel,
              to: originatingTo,
              sessionKey: ctx.SessionKey,
              accountId: ctx.AccountId,
              threadId: ctx.MessageThreadId,
              cfg: cfg,
            }),
          ];
        case 17:
          result = _y.sent();
          queuedFinal = result.ok || queuedFinal;
          if (result.ok) {
            routedFinalCount += 1;
          }
          if (!result.ok) {
            (0, globals_js_1.logVerbose)(
              "dispatch-from-config: route-reply (tts-only) failed: ".concat(
                (_x = result.error) !== null && _x !== void 0 ? _x : "unknown error",
              ),
            );
          }
          return [3 /*break*/, 19];
        case 18:
          didQueue = dispatcher.sendFinalReply(ttsOnlyPayload);
          queuedFinal = didQueue || queuedFinal;
          _y.label = 19;
        case 19:
          return [3 /*break*/, 21];
        case 20:
          err_1 = _y.sent();
          (0, globals_js_1.logVerbose)(
            "dispatch-from-config: accumulated block TTS failed: ".concat(
              err_1 instanceof Error ? err_1.message : String(err_1),
            ),
          );
          return [3 /*break*/, 21];
        case 21:
          return [4 /*yield*/, dispatcher.waitForIdle()];
        case 22:
          _y.sent();
          counts = dispatcher.getQueuedCounts();
          counts.final += routedFinalCount;
          recordProcessed("completed");
          markIdle("message_completed");
          return [2 /*return*/, { queuedFinal: queuedFinal, counts: counts }];
        case 23:
          err_2 = _y.sent();
          recordProcessed("error", { error: String(err_2) });
          markIdle("message_error");
          throw err_2;
        case 24:
          return [2 /*return*/];
      }
    });
  });
}
