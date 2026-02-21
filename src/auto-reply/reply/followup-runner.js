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
exports.createFollowupRunner = createFollowupRunner;
var node_crypto_1 = require("node:crypto");
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var context_js_1 = require("../../agents/context.js");
var defaults_js_1 = require("../../agents/defaults.js");
var model_fallback_js_1 = require("../../agents/model-fallback.js");
var pi_embedded_js_1 = require("../../agents/pi-embedded.js");
var sessions_js_1 = require("../../config/sessions.js");
var globals_js_1 = require("../../globals.js");
var agent_events_js_1 = require("../../infra/agent-events.js");
var runtime_js_1 = require("../../runtime.js");
var heartbeat_js_1 = require("../heartbeat.js");
var tokens_js_1 = require("../tokens.js");
var reply_payloads_js_1 = require("./reply-payloads.js");
var reply_threading_js_1 = require("./reply-threading.js");
var route_reply_js_1 = require("./route-reply.js");
var session_usage_js_1 = require("./session-usage.js");
var session_updates_js_1 = require("./session-updates.js");
var typing_mode_js_1 = require("./typing-mode.js");
function createFollowupRunner(params) {
  var _this = this;
  var opts = params.opts,
    typing = params.typing,
    typingMode = params.typingMode,
    sessionEntry = params.sessionEntry,
    sessionStore = params.sessionStore,
    sessionKey = params.sessionKey,
    storePath = params.storePath,
    defaultModel = params.defaultModel,
    agentCfgContextTokens = params.agentCfgContextTokens;
  var typingSignals = (0, typing_mode_js_1.createTypingSignaler)({
    typing: typing,
    mode: typingMode,
    isHeartbeat: (opts === null || opts === void 0 ? void 0 : opts.isHeartbeat) === true,
  });
  /**
   * Sends followup payloads, routing to the originating channel if set.
   *
   * When originatingChannel/originatingTo are set on the queued run,
   * replies are routed directly to that provider instead of using the
   * session's current dispatcher. This ensures replies go back to
   * where the message originated.
   */
  var sendFollowupPayloads = function (payloads, queued) {
    return __awaiter(_this, void 0, void 0, function () {
      var originatingChannel,
        originatingTo,
        shouldRouteToOriginating,
        _i,
        payloads_1,
        payload,
        result,
        errorMsg;
      var _a, _b, _c;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            ((originatingChannel = queued.originatingChannel),
              (originatingTo = queued.originatingTo));
            shouldRouteToOriginating =
              (0, route_reply_js_1.isRoutableChannel)(originatingChannel) && originatingTo;
            if (
              !shouldRouteToOriginating &&
              !(opts === null || opts === void 0 ? void 0 : opts.onBlockReply)
            ) {
              (0, globals_js_1.logVerbose)(
                "followup queue: no onBlockReply handler; dropping payloads",
              );
              return [2 /*return*/];
            }
            ((_i = 0), (payloads_1 = payloads));
            _d.label = 1;
          case 1:
            if (!(_i < payloads_1.length)) {
              return [3 /*break*/, 9];
            }
            payload = payloads_1[_i];
            if (
              !(payload === null || payload === void 0 ? void 0 : payload.text) &&
              !(payload === null || payload === void 0 ? void 0 : payload.mediaUrl) &&
              !((_a = payload === null || payload === void 0 ? void 0 : payload.mediaUrls) ===
                null || _a === void 0
                ? void 0
                : _a.length)
            ) {
              return [3 /*break*/, 8];
            }
            if (
              (0, tokens_js_1.isSilentReplyText)(payload.text, tokens_js_1.SILENT_REPLY_TOKEN) &&
              !payload.mediaUrl &&
              !((_b = payload.mediaUrls) === null || _b === void 0 ? void 0 : _b.length)
            ) {
              return [3 /*break*/, 8];
            }
            return [4 /*yield*/, typingSignals.signalTextDelta(payload.text)];
          case 2:
            _d.sent();
            if (!shouldRouteToOriginating) {
              return [3 /*break*/, 6];
            }
            return [
              4 /*yield*/,
              (0, route_reply_js_1.routeReply)({
                payload: payload,
                channel: originatingChannel,
                to: originatingTo,
                sessionKey: queued.run.sessionKey,
                accountId: queued.originatingAccountId,
                threadId: queued.originatingThreadId,
                cfg: queued.run.config,
              }),
            ];
          case 3:
            result = _d.sent();
            if (!!result.ok) {
              return [3 /*break*/, 5];
            }
            errorMsg = (_c = result.error) !== null && _c !== void 0 ? _c : "unknown error";
            (0, globals_js_1.logVerbose)("followup queue: route-reply failed: ".concat(errorMsg));
            if (!(opts === null || opts === void 0 ? void 0 : opts.onBlockReply)) {
              return [3 /*break*/, 5];
            }
            return [4 /*yield*/, opts.onBlockReply(payload)];
          case 4:
            _d.sent();
            _d.label = 5;
          case 5:
            return [3 /*break*/, 8];
          case 6:
            if (!(opts === null || opts === void 0 ? void 0 : opts.onBlockReply)) {
              return [3 /*break*/, 8];
            }
            return [4 /*yield*/, opts.onBlockReply(payload)];
          case 7:
            _d.sent();
            _d.label = 8;
          case 8:
            _i++;
            return [3 /*break*/, 1];
          case 9:
            return [2 /*return*/];
        }
      });
    });
  };
  return function (queued) {
    return __awaiter(_this, void 0, void 0, function () {
      var runId_1,
        autoCompactionCompleted_1,
        runResult,
        fallbackProvider,
        fallbackModel,
        fallbackResult,
        err_1,
        message,
        usage,
        modelUsed,
        contextTokensUsed,
        payloadArray,
        sanitizedPayloads,
        replyToChannel,
        replyToMode,
        replyTaggedPayloads,
        dedupedPayloads,
        suppressMessagingToolReplies,
        finalPayloads,
        count,
        suffix;
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
      return __generator(this, function (_m) {
        switch (_m.label) {
          case 0:
            _m.trys.push([0, , 10, 11]);
            runId_1 = node_crypto_1.default.randomUUID();
            if (queued.run.sessionKey) {
              (0, agent_events_js_1.registerAgentRunContext)(runId_1, {
                sessionKey: queued.run.sessionKey,
                verboseLevel: queued.run.verboseLevel,
              });
            }
            autoCompactionCompleted_1 = false;
            runResult = void 0;
            fallbackProvider = queued.run.provider;
            fallbackModel = queued.run.model;
            _m.label = 1;
          case 1:
            _m.trys.push([1, 3, , 4]);
            return [
              4 /*yield*/,
              (0, model_fallback_js_1.runWithModelFallback)({
                cfg: queued.run.config,
                provider: queued.run.provider,
                model: queued.run.model,
                agentDir: queued.run.agentDir,
                fallbacksOverride: (0, agent_scope_js_1.resolveAgentModelFallbacksOverride)(
                  queued.run.config,
                  (0, sessions_js_1.resolveAgentIdFromSessionKey)(queued.run.sessionKey),
                ),
                run: function (provider, model) {
                  var authProfileId =
                    provider === queued.run.provider ? queued.run.authProfileId : undefined;
                  return (0, pi_embedded_js_1.runEmbeddedPiAgent)({
                    sessionId: queued.run.sessionId,
                    sessionKey: queued.run.sessionKey,
                    messageProvider: queued.run.messageProvider,
                    agentAccountId: queued.run.agentAccountId,
                    messageTo: queued.originatingTo,
                    messageThreadId: queued.originatingThreadId,
                    groupId: queued.run.groupId,
                    groupChannel: queued.run.groupChannel,
                    groupSpace: queued.run.groupSpace,
                    senderId: queued.run.senderId,
                    senderName: queued.run.senderName,
                    senderUsername: queued.run.senderUsername,
                    senderE164: queued.run.senderE164,
                    sessionFile: queued.run.sessionFile,
                    workspaceDir: queued.run.workspaceDir,
                    config: queued.run.config,
                    skillsSnapshot: queued.run.skillsSnapshot,
                    prompt: queued.prompt,
                    extraSystemPrompt: queued.run.extraSystemPrompt,
                    ownerNumbers: queued.run.ownerNumbers,
                    enforceFinalTag: queued.run.enforceFinalTag,
                    provider: provider,
                    model: model,
                    authProfileId: authProfileId,
                    authProfileIdSource: authProfileId ? queued.run.authProfileIdSource : undefined,
                    thinkLevel: queued.run.thinkLevel,
                    verboseLevel: queued.run.verboseLevel,
                    reasoningLevel: queued.run.reasoningLevel,
                    execOverrides: queued.run.execOverrides,
                    bashElevated: queued.run.bashElevated,
                    timeoutMs: queued.run.timeoutMs,
                    runId: runId_1,
                    blockReplyBreak: queued.run.blockReplyBreak,
                    onAgentEvent: function (evt) {
                      if (evt.stream !== "compaction") {
                        return;
                      }
                      var phase = typeof evt.data.phase === "string" ? evt.data.phase : "";
                      var willRetry = Boolean(evt.data.willRetry);
                      if (phase === "end" && !willRetry) {
                        autoCompactionCompleted_1 = true;
                      }
                    },
                  });
                },
              }),
            ];
          case 2:
            fallbackResult = _m.sent();
            runResult = fallbackResult.result;
            fallbackProvider = fallbackResult.provider;
            fallbackModel = fallbackResult.model;
            return [3 /*break*/, 4];
          case 3:
            err_1 = _m.sent();
            message = err_1 instanceof Error ? err_1.message : String(err_1);
            (_a = runtime_js_1.defaultRuntime.error) === null || _a === void 0
              ? void 0
              : _a.call(
                  runtime_js_1.defaultRuntime,
                  "Followup agent failed before reply: ".concat(message),
                );
            return [2 /*return*/];
          case 4:
            if (!(storePath && sessionKey)) {
              return [3 /*break*/, 6];
            }
            usage = (_b = runResult.meta.agentMeta) === null || _b === void 0 ? void 0 : _b.usage;
            modelUsed =
              (_e =
                (_d =
                  (_c = runResult.meta.agentMeta) === null || _c === void 0 ? void 0 : _c.model) !==
                  null && _d !== void 0
                  ? _d
                  : fallbackModel) !== null && _e !== void 0
                ? _e
                : defaultModel;
            contextTokensUsed =
              (_g =
                (_f =
                  agentCfgContextTokens !== null && agentCfgContextTokens !== void 0
                    ? agentCfgContextTokens
                    : (0, context_js_1.lookupContextTokens)(modelUsed)) !== null && _f !== void 0
                  ? _f
                  : sessionEntry === null || sessionEntry === void 0
                    ? void 0
                    : sessionEntry.contextTokens) !== null && _g !== void 0
                ? _g
                : defaults_js_1.DEFAULT_CONTEXT_TOKENS;
            return [
              4 /*yield*/,
              (0, session_usage_js_1.persistSessionUsageUpdate)({
                storePath: storePath,
                sessionKey: sessionKey,
                usage: usage,
                modelUsed: modelUsed,
                providerUsed: fallbackProvider,
                contextTokensUsed: contextTokensUsed,
                logLabel: "followup",
              }),
            ];
          case 5:
            _m.sent();
            _m.label = 6;
          case 6:
            payloadArray = (_h = runResult.payloads) !== null && _h !== void 0 ? _h : [];
            if (payloadArray.length === 0) {
              return [2 /*return*/];
            }
            sanitizedPayloads = payloadArray.flatMap(function (payload) {
              var _a, _b;
              var text = payload.text;
              if (!text || !text.includes("HEARTBEAT_OK")) {
                return [payload];
              }
              var stripped = (0, heartbeat_js_1.stripHeartbeatToken)(text, { mode: "message" });
              var hasMedia =
                Boolean(payload.mediaUrl) ||
                ((_b = (_a = payload.mediaUrls) === null || _a === void 0 ? void 0 : _a.length) !==
                  null && _b !== void 0
                  ? _b
                  : 0) > 0;
              if (stripped.shouldSkip && !hasMedia) {
                return [];
              }
              return [__assign(__assign({}, payload), { text: stripped.text })];
            });
            replyToChannel =
              (_j = queued.originatingChannel) !== null && _j !== void 0
                ? _j
                : (_k = queued.run.messageProvider) === null || _k === void 0
                  ? void 0
                  : _k.toLowerCase();
            replyToMode = (0, reply_threading_js_1.resolveReplyToMode)(
              queued.run.config,
              replyToChannel,
              queued.originatingAccountId,
              queued.originatingChatType,
            );
            replyTaggedPayloads = (0, reply_payloads_js_1.applyReplyThreading)({
              payloads: sanitizedPayloads,
              replyToMode: replyToMode,
              replyToChannel: replyToChannel,
            });
            dedupedPayloads = (0, reply_payloads_js_1.filterMessagingToolDuplicates)({
              payloads: replyTaggedPayloads,
              sentTexts:
                (_l = runResult.messagingToolSentTexts) !== null && _l !== void 0 ? _l : [],
            });
            suppressMessagingToolReplies = (0,
            reply_payloads_js_1.shouldSuppressMessagingToolReplies)({
              messageProvider: queued.run.messageProvider,
              messagingToolSentTargets: runResult.messagingToolSentTargets,
              originatingTo: queued.originatingTo,
              accountId: queued.run.agentAccountId,
            });
            finalPayloads = suppressMessagingToolReplies ? [] : dedupedPayloads;
            if (finalPayloads.length === 0) {
              return [2 /*return*/];
            }
            if (!autoCompactionCompleted_1) {
              return [3 /*break*/, 8];
            }
            return [
              4 /*yield*/,
              (0, session_updates_js_1.incrementCompactionCount)({
                sessionEntry: sessionEntry,
                sessionStore: sessionStore,
                sessionKey: sessionKey,
                storePath: storePath,
              }),
            ];
          case 7:
            count = _m.sent();
            if (queued.run.verboseLevel && queued.run.verboseLevel !== "off") {
              suffix = typeof count === "number" ? " (count ".concat(count, ")") : "";
              finalPayloads.unshift({
                text: "\uD83E\uDDF9 Auto-compaction complete".concat(suffix, "."),
              });
            }
            _m.label = 8;
          case 8:
            return [4 /*yield*/, sendFollowupPayloads(finalPayloads, queued)];
          case 9:
            _m.sent();
            return [3 /*break*/, 11];
          case 10:
            typing.markRunComplete();
            return [7 /*endfinally*/];
          case 11:
            return [2 /*return*/];
        }
      });
    });
  };
}
