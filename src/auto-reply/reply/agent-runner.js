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
exports.runReplyAgent = runReplyAgent;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var context_js_1 = require("../../agents/context.js");
var defaults_js_1 = require("../../agents/defaults.js");
var model_auth_js_1 = require("../../agents/model-auth.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var pi_embedded_js_1 = require("../../agents/pi-embedded.js");
var usage_js_1 = require("../../agents/usage.js");
var sessions_js_1 = require("../../config/sessions.js");
var runtime_js_1 = require("../../runtime.js");
var usage_format_js_1 = require("../../utils/usage-format.js");
var thinking_js_1 = require("../thinking.js");
var agent_runner_execution_js_1 = require("./agent-runner-execution.js");
var agent_runner_helpers_js_1 = require("./agent-runner-helpers.js");
var agent_runner_memory_js_1 = require("./agent-runner-memory.js");
var agent_runner_payloads_js_1 = require("./agent-runner-payloads.js");
var agent_runner_utils_js_1 = require("./agent-runner-utils.js");
var block_reply_pipeline_js_1 = require("./block-reply-pipeline.js");
var block_streaming_js_1 = require("./block-streaming.js");
var followup_runner_js_1 = require("./followup-runner.js");
var queue_js_1 = require("./queue.js");
var reply_threading_js_1 = require("./reply-threading.js");
var session_usage_js_1 = require("./session-usage.js");
var session_updates_js_1 = require("./session-updates.js");
var typing_mode_js_1 = require("./typing-mode.js");
var diagnostic_events_js_1 = require("../../infra/diagnostic-events.js");
var BLOCK_REPLY_SEND_TIMEOUT_MS = 15000;
function runReplyAgent(params) {
  return __awaiter(this, void 0, void 0, function () {
    var commandBody,
      followupRun,
      queueKey,
      resolvedQueue,
      shouldSteer,
      shouldFollowup,
      isActive,
      isStreaming,
      opts,
      typing,
      sessionEntry,
      sessionStore,
      sessionKey,
      storePath,
      defaultModel,
      agentCfgContextTokens,
      resolvedVerboseLevel,
      isNewSession,
      blockStreamingEnabled,
      blockReplyChunking,
      resolvedBlockStreamingBreak,
      sessionCtx,
      shouldInjectGroupIntro,
      typingMode,
      activeSessionEntry,
      activeSessionStore,
      activeIsNewSession,
      isHeartbeat,
      typingSignals,
      shouldEmitToolResult,
      shouldEmitToolOutput,
      pendingToolTasks,
      blockReplyTimeoutMs,
      replyToChannel,
      replyToMode,
      applyReplyToMode,
      cfg,
      blockReplyCoalescing,
      blockReplyPipeline,
      steered,
      updatedAt_1,
      updatedAt_2,
      runFollowupTurn,
      responseUsageLine,
      resetSession,
      resetSessionAfterCompactionFailure,
      resetSessionAfterRoleOrderingConflict,
      runStartedAt,
      runOutcome,
      runResult,
      fallbackProvider,
      fallbackModel,
      directlySentBlockKeys,
      didLogHeartbeatStrip,
      autoCompactionCompleted,
      updatedAt_3,
      payloadArray,
      usage,
      modelUsed,
      providerUsed,
      cliSessionId,
      contextTokensUsed,
      payloadResult,
      replyPayloads,
      input,
      output,
      cacheRead,
      cacheWrite,
      promptTokens,
      totalTokens,
      costConfig,
      costUsd,
      responseUsageRaw,
      responseUsageMode,
      authMode,
      showCost,
      costConfig,
      formatted,
      finalPayloads,
      verboseEnabled,
      count,
      suffix;
    var _this = this;
    var _a,
      _b,
      _c,
      _d,
      _e,
      _f,
      _g,
      _h,
      _j,
      _k,
      _l,
      _m,
      _o,
      _p,
      _q,
      _r,
      _s,
      _t,
      _u,
      _v,
      _w,
      _x,
      _y,
      _z,
      _0;
    return __generator(this, function (_1) {
      switch (_1.label) {
        case 0:
          ((commandBody = params.commandBody),
            (followupRun = params.followupRun),
            (queueKey = params.queueKey),
            (resolvedQueue = params.resolvedQueue),
            (shouldSteer = params.shouldSteer),
            (shouldFollowup = params.shouldFollowup),
            (isActive = params.isActive),
            (isStreaming = params.isStreaming),
            (opts = params.opts),
            (typing = params.typing),
            (sessionEntry = params.sessionEntry),
            (sessionStore = params.sessionStore),
            (sessionKey = params.sessionKey),
            (storePath = params.storePath),
            (defaultModel = params.defaultModel),
            (agentCfgContextTokens = params.agentCfgContextTokens),
            (resolvedVerboseLevel = params.resolvedVerboseLevel),
            (isNewSession = params.isNewSession),
            (blockStreamingEnabled = params.blockStreamingEnabled),
            (blockReplyChunking = params.blockReplyChunking),
            (resolvedBlockStreamingBreak = params.resolvedBlockStreamingBreak),
            (sessionCtx = params.sessionCtx),
            (shouldInjectGroupIntro = params.shouldInjectGroupIntro),
            (typingMode = params.typingMode));
          activeSessionEntry = sessionEntry;
          activeSessionStore = sessionStore;
          activeIsNewSession = isNewSession;
          isHeartbeat = (opts === null || opts === void 0 ? void 0 : opts.isHeartbeat) === true;
          typingSignals = (0, typing_mode_js_1.createTypingSignaler)({
            typing: typing,
            mode: typingMode,
            isHeartbeat: isHeartbeat,
          });
          shouldEmitToolResult = (0, agent_runner_helpers_js_1.createShouldEmitToolResult)({
            sessionKey: sessionKey,
            storePath: storePath,
            resolvedVerboseLevel: resolvedVerboseLevel,
          });
          shouldEmitToolOutput = (0, agent_runner_helpers_js_1.createShouldEmitToolOutput)({
            sessionKey: sessionKey,
            storePath: storePath,
            resolvedVerboseLevel: resolvedVerboseLevel,
          });
          pendingToolTasks = new Set();
          blockReplyTimeoutMs =
            (_a = opts === null || opts === void 0 ? void 0 : opts.blockReplyTimeoutMs) !== null &&
            _a !== void 0
              ? _a
              : BLOCK_REPLY_SEND_TIMEOUT_MS;
          replyToChannel =
            (_b = sessionCtx.OriginatingChannel) !== null && _b !== void 0
              ? _b
              : (_d =
                    (_c = sessionCtx.Surface) !== null && _c !== void 0
                      ? _c
                      : sessionCtx.Provider) === null || _d === void 0
                ? void 0
                : _d.toLowerCase();
          replyToMode = (0, reply_threading_js_1.resolveReplyToMode)(
            followupRun.run.config,
            replyToChannel,
            sessionCtx.AccountId,
            sessionCtx.ChatType,
          );
          applyReplyToMode = (0, reply_threading_js_1.createReplyToModeFilterForChannel)(
            replyToMode,
            replyToChannel,
          );
          cfg = followupRun.run.config;
          blockReplyCoalescing =
            blockStreamingEnabled && (opts === null || opts === void 0 ? void 0 : opts.onBlockReply)
              ? (0, block_streaming_js_1.resolveBlockStreamingCoalescing)(
                  cfg,
                  sessionCtx.Provider,
                  sessionCtx.AccountId,
                  blockReplyChunking,
                )
              : undefined;
          blockReplyPipeline =
            blockStreamingEnabled && (opts === null || opts === void 0 ? void 0 : opts.onBlockReply)
              ? (0, block_reply_pipeline_js_1.createBlockReplyPipeline)({
                  onBlockReply: opts.onBlockReply,
                  timeoutMs: blockReplyTimeoutMs,
                  coalescing: blockReplyCoalescing,
                  buffer: (0, block_reply_pipeline_js_1.createAudioAsVoiceBuffer)({
                    isAudioPayload: agent_runner_helpers_js_1.isAudioPayload,
                  }),
                })
              : null;
          if (!(shouldSteer && isStreaming)) {
            return [3 /*break*/, 3];
          }
          steered = (0, pi_embedded_js_1.queueEmbeddedPiMessage)(
            followupRun.run.sessionId,
            followupRun.prompt,
          );
          if (!(steered && !shouldFollowup)) {
            return [3 /*break*/, 3];
          }
          if (!(activeSessionEntry && activeSessionStore && sessionKey)) {
            return [3 /*break*/, 2];
          }
          updatedAt_1 = Date.now();
          activeSessionEntry.updatedAt = updatedAt_1;
          activeSessionStore[sessionKey] = activeSessionEntry;
          if (!storePath) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStoreEntry)({
              storePath: storePath,
              sessionKey: sessionKey,
              update: function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    return [2 /*return*/, { updatedAt: updatedAt_1 }];
                  });
                });
              },
            }),
          ];
        case 1:
          _1.sent();
          _1.label = 2;
        case 2:
          typing.cleanup();
          return [2 /*return*/, undefined];
        case 3:
          if (!(isActive && (shouldFollowup || resolvedQueue.mode === "steer"))) {
            return [3 /*break*/, 6];
          }
          (0, queue_js_1.enqueueFollowupRun)(queueKey, followupRun, resolvedQueue);
          if (!(activeSessionEntry && activeSessionStore && sessionKey)) {
            return [3 /*break*/, 5];
          }
          updatedAt_2 = Date.now();
          activeSessionEntry.updatedAt = updatedAt_2;
          activeSessionStore[sessionKey] = activeSessionEntry;
          if (!storePath) {
            return [3 /*break*/, 5];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStoreEntry)({
              storePath: storePath,
              sessionKey: sessionKey,
              update: function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    return [2 /*return*/, { updatedAt: updatedAt_2 }];
                  });
                });
              },
            }),
          ];
        case 4:
          _1.sent();
          _1.label = 5;
        case 5:
          typing.cleanup();
          return [2 /*return*/, undefined];
        case 6:
          return [4 /*yield*/, typingSignals.signalRunStart()];
        case 7:
          _1.sent();
          return [
            4 /*yield*/,
            (0, agent_runner_memory_js_1.runMemoryFlushIfNeeded)({
              cfg: cfg,
              followupRun: followupRun,
              sessionCtx: sessionCtx,
              opts: opts,
              defaultModel: defaultModel,
              agentCfgContextTokens: agentCfgContextTokens,
              resolvedVerboseLevel: resolvedVerboseLevel,
              sessionEntry: activeSessionEntry,
              sessionStore: activeSessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
              isHeartbeat: isHeartbeat,
            }),
          ];
        case 8:
          activeSessionEntry = _1.sent();
          runFollowupTurn = (0, followup_runner_js_1.createFollowupRunner)({
            opts: opts,
            typing: typing,
            typingMode: typingMode,
            sessionEntry: activeSessionEntry,
            sessionStore: activeSessionStore,
            sessionKey: sessionKey,
            storePath: storePath,
            defaultModel: defaultModel,
            agentCfgContextTokens: agentCfgContextTokens,
          });
          resetSession = function (_a) {
            return __awaiter(_this, [_a], void 0, function (_b) {
              var prevEntry,
                prevSessionId,
                nextSessionId,
                nextEntry,
                agentId,
                nextSessionFile,
                err_1,
                transcriptCandidates,
                resolved,
                _i,
                transcriptCandidates_1,
                candidate;
              var _c;
              var failureLabel = _b.failureLabel,
                buildLogMessage = _b.buildLogMessage,
                cleanupTranscripts = _b.cleanupTranscripts;
              return __generator(this, function (_d) {
                switch (_d.label) {
                  case 0:
                    if (!sessionKey || !activeSessionStore || !storePath) {
                      return [2 /*return*/, false];
                    }
                    prevEntry =
                      (_c = activeSessionStore[sessionKey]) !== null && _c !== void 0
                        ? _c
                        : activeSessionEntry;
                    if (!prevEntry) {
                      return [2 /*return*/, false];
                    }
                    prevSessionId = cleanupTranscripts ? prevEntry.sessionId : undefined;
                    nextSessionId = node_crypto_1.default.randomUUID();
                    nextEntry = __assign(__assign({}, prevEntry), {
                      sessionId: nextSessionId,
                      updatedAt: Date.now(),
                      systemSent: false,
                      abortedLastRun: false,
                    });
                    agentId = (0, sessions_js_1.resolveAgentIdFromSessionKey)(sessionKey);
                    nextSessionFile = (0, sessions_js_1.resolveSessionTranscriptPath)(
                      nextSessionId,
                      agentId,
                      sessionCtx.MessageThreadId,
                    );
                    nextEntry.sessionFile = nextSessionFile;
                    activeSessionStore[sessionKey] = nextEntry;
                    _d.label = 1;
                  case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [
                      4 /*yield*/,
                      (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                        store[sessionKey] = nextEntry;
                      }),
                    ];
                  case 2:
                    _d.sent();
                    return [3 /*break*/, 4];
                  case 3:
                    err_1 = _d.sent();
                    runtime_js_1.defaultRuntime.error(
                      "Failed to persist session reset after "
                        .concat(failureLabel, " (")
                        .concat(sessionKey, "): ")
                        .concat(String(err_1)),
                    );
                    return [3 /*break*/, 4];
                  case 4:
                    followupRun.run.sessionId = nextSessionId;
                    followupRun.run.sessionFile = nextSessionFile;
                    activeSessionEntry = nextEntry;
                    activeIsNewSession = true;
                    runtime_js_1.defaultRuntime.error(buildLogMessage(nextSessionId));
                    if (cleanupTranscripts && prevSessionId) {
                      transcriptCandidates = new Set();
                      resolved = (0, sessions_js_1.resolveSessionFilePath)(
                        prevSessionId,
                        prevEntry,
                        { agentId: agentId },
                      );
                      if (resolved) {
                        transcriptCandidates.add(resolved);
                      }
                      transcriptCandidates.add(
                        (0, sessions_js_1.resolveSessionTranscriptPath)(prevSessionId, agentId),
                      );
                      for (
                        _i = 0, transcriptCandidates_1 = transcriptCandidates;
                        _i < transcriptCandidates_1.length;
                        _i++
                      ) {
                        candidate = transcriptCandidates_1[_i];
                        try {
                          node_fs_1.default.unlinkSync(candidate);
                        } catch (_e) {
                          // Best-effort cleanup.
                        }
                      }
                    }
                    return [2 /*return*/, true];
                }
              });
            });
          };
          resetSessionAfterCompactionFailure = function (reason) {
            return __awaiter(_this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                return [
                  2 /*return*/,
                  resetSession({
                    failureLabel: "compaction failure",
                    buildLogMessage: function (nextSessionId) {
                      return "Auto-compaction failed ("
                        .concat(reason, "). Restarting session ")
                        .concat(sessionKey, " -> ")
                        .concat(nextSessionId, " and retrying.");
                    },
                  }),
                ];
              });
            });
          };
          resetSessionAfterRoleOrderingConflict = function (reason) {
            return __awaiter(_this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                return [
                  2 /*return*/,
                  resetSession({
                    failureLabel: "role ordering conflict",
                    buildLogMessage: function (nextSessionId) {
                      return "Role ordering conflict ("
                        .concat(reason, "). Restarting session ")
                        .concat(sessionKey, " -> ")
                        .concat(nextSessionId, ".");
                    },
                    cleanupTranscripts: true,
                  }),
                ];
              });
            });
          };
          _1.label = 9;
        case 9:
          _1.trys.push([9, , 21, 22]);
          runStartedAt = Date.now();
          return [
            4 /*yield*/,
            (0, agent_runner_execution_js_1.runAgentTurnWithFallback)({
              commandBody: commandBody,
              followupRun: followupRun,
              sessionCtx: sessionCtx,
              opts: opts,
              typingSignals: typingSignals,
              blockReplyPipeline: blockReplyPipeline,
              blockStreamingEnabled: blockStreamingEnabled,
              blockReplyChunking: blockReplyChunking,
              resolvedBlockStreamingBreak: resolvedBlockStreamingBreak,
              applyReplyToMode: applyReplyToMode,
              shouldEmitToolResult: shouldEmitToolResult,
              shouldEmitToolOutput: shouldEmitToolOutput,
              pendingToolTasks: pendingToolTasks,
              resetSessionAfterCompactionFailure: resetSessionAfterCompactionFailure,
              resetSessionAfterRoleOrderingConflict: resetSessionAfterRoleOrderingConflict,
              isHeartbeat: isHeartbeat,
              sessionKey: sessionKey,
              getActiveSessionEntry: function () {
                return activeSessionEntry;
              },
              activeSessionStore: activeSessionStore,
              storePath: storePath,
              resolvedVerboseLevel: resolvedVerboseLevel,
            }),
          ];
        case 10:
          runOutcome = _1.sent();
          if (runOutcome.kind === "final") {
            return [
              2 /*return*/,
              (0, agent_runner_helpers_js_1.finalizeWithFollowup)(
                runOutcome.payload,
                queueKey,
                runFollowupTurn,
              ),
            ];
          }
          ((runResult = runOutcome.runResult),
            (fallbackProvider = runOutcome.fallbackProvider),
            (fallbackModel = runOutcome.fallbackModel),
            (directlySentBlockKeys = runOutcome.directlySentBlockKeys));
          ((didLogHeartbeatStrip = runOutcome.didLogHeartbeatStrip),
            (autoCompactionCompleted = runOutcome.autoCompactionCompleted));
          if (
            !(
              shouldInjectGroupIntro &&
              activeSessionEntry &&
              activeSessionStore &&
              sessionKey &&
              activeSessionEntry.groupActivationNeedsSystemIntro
            )
          ) {
            return [3 /*break*/, 12];
          }
          updatedAt_3 = Date.now();
          activeSessionEntry.groupActivationNeedsSystemIntro = false;
          activeSessionEntry.updatedAt = updatedAt_3;
          activeSessionStore[sessionKey] = activeSessionEntry;
          if (!storePath) {
            return [3 /*break*/, 12];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStoreEntry)({
              storePath: storePath,
              sessionKey: sessionKey,
              update: function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    return [
                      2 /*return*/,
                      {
                        groupActivationNeedsSystemIntro: false,
                        updatedAt: updatedAt_3,
                      },
                    ];
                  });
                });
              },
            }),
          ];
        case 11:
          _1.sent();
          _1.label = 12;
        case 12:
          payloadArray = (_e = runResult.payloads) !== null && _e !== void 0 ? _e : [];
          if (!blockReplyPipeline) {
            return [3 /*break*/, 14];
          }
          return [4 /*yield*/, blockReplyPipeline.flush({ force: true })];
        case 13:
          _1.sent();
          blockReplyPipeline.stop();
          _1.label = 14;
        case 14:
          if (!(pendingToolTasks.size > 0)) {
            return [3 /*break*/, 16];
          }
          return [4 /*yield*/, Promise.allSettled(pendingToolTasks)];
        case 15:
          _1.sent();
          _1.label = 16;
        case 16:
          usage = (_f = runResult.meta.agentMeta) === null || _f === void 0 ? void 0 : _f.usage;
          modelUsed =
            (_j =
              (_h =
                (_g = runResult.meta.agentMeta) === null || _g === void 0 ? void 0 : _g.model) !==
                null && _h !== void 0
                ? _h
                : fallbackModel) !== null && _j !== void 0
              ? _j
              : defaultModel;
          providerUsed =
            (_m =
              (_l =
                (_k = runResult.meta.agentMeta) === null || _k === void 0
                  ? void 0
                  : _k.provider) !== null && _l !== void 0
                ? _l
                : fallbackProvider) !== null && _m !== void 0
              ? _m
              : followupRun.run.provider;
          cliSessionId = (0, model_selection_js_1.isCliProvider)(providerUsed, cfg)
            ? (_p =
                (_o = runResult.meta.agentMeta) === null || _o === void 0
                  ? void 0
                  : _o.sessionId) === null || _p === void 0
              ? void 0
              : _p.trim()
            : undefined;
          contextTokensUsed =
            (_r =
              (_q =
                agentCfgContextTokens !== null && agentCfgContextTokens !== void 0
                  ? agentCfgContextTokens
                  : (0, context_js_1.lookupContextTokens)(modelUsed)) !== null && _q !== void 0
                ? _q
                : activeSessionEntry === null || activeSessionEntry === void 0
                  ? void 0
                  : activeSessionEntry.contextTokens) !== null && _r !== void 0
              ? _r
              : defaults_js_1.DEFAULT_CONTEXT_TOKENS;
          return [
            4 /*yield*/,
            (0, session_usage_js_1.persistSessionUsageUpdate)({
              storePath: storePath,
              sessionKey: sessionKey,
              usage: usage,
              modelUsed: modelUsed,
              providerUsed: providerUsed,
              contextTokensUsed: contextTokensUsed,
              systemPromptReport: runResult.meta.systemPromptReport,
              cliSessionId: cliSessionId,
            }),
          ];
        case 17:
          _1.sent();
          // Drain any late tool/block deliveries before deciding there's "nothing to send".
          // Otherwise, a late typing trigger (e.g. from a tool callback) can outlive the run and
          // keep the typing indicator stuck.
          if (payloadArray.length === 0) {
            return [
              2 /*return*/,
              (0, agent_runner_helpers_js_1.finalizeWithFollowup)(
                undefined,
                queueKey,
                runFollowupTurn,
              ),
            ];
          }
          payloadResult = (0, agent_runner_payloads_js_1.buildReplyPayloads)({
            payloads: payloadArray,
            isHeartbeat: isHeartbeat,
            didLogHeartbeatStrip: didLogHeartbeatStrip,
            blockStreamingEnabled: blockStreamingEnabled,
            blockReplyPipeline: blockReplyPipeline,
            directlySentBlockKeys: directlySentBlockKeys,
            replyToMode: replyToMode,
            replyToChannel: replyToChannel,
            currentMessageId:
              (_s = sessionCtx.MessageSidFull) !== null && _s !== void 0
                ? _s
                : sessionCtx.MessageSid,
            messageProvider: followupRun.run.messageProvider,
            messagingToolSentTexts: runResult.messagingToolSentTexts,
            messagingToolSentTargets: runResult.messagingToolSentTargets,
            originatingTo:
              (_t = sessionCtx.OriginatingTo) !== null && _t !== void 0 ? _t : sessionCtx.To,
            accountId: sessionCtx.AccountId,
          });
          replyPayloads = payloadResult.replyPayloads;
          didLogHeartbeatStrip = payloadResult.didLogHeartbeatStrip;
          if (replyPayloads.length === 0) {
            return [
              2 /*return*/,
              (0, agent_runner_helpers_js_1.finalizeWithFollowup)(
                undefined,
                queueKey,
                runFollowupTurn,
              ),
            ];
          }
          return [
            4 /*yield*/,
            (0, agent_runner_helpers_js_1.signalTypingIfNeeded)(replyPayloads, typingSignals),
          ];
        case 18:
          _1.sent();
          if (
            (0, diagnostic_events_js_1.isDiagnosticsEnabled)(cfg) &&
            (0, usage_js_1.hasNonzeroUsage)(usage)
          ) {
            input = (_u = usage.input) !== null && _u !== void 0 ? _u : 0;
            output = (_v = usage.output) !== null && _v !== void 0 ? _v : 0;
            cacheRead = (_w = usage.cacheRead) !== null && _w !== void 0 ? _w : 0;
            cacheWrite = (_x = usage.cacheWrite) !== null && _x !== void 0 ? _x : 0;
            promptTokens = input + cacheRead + cacheWrite;
            totalTokens = (_y = usage.total) !== null && _y !== void 0 ? _y : promptTokens + output;
            costConfig = (0, usage_format_js_1.resolveModelCostConfig)({
              provider: providerUsed,
              model: modelUsed,
              config: cfg,
            });
            costUsd = (0, usage_format_js_1.estimateUsageCost)({ usage: usage, cost: costConfig });
            (0, diagnostic_events_js_1.emitDiagnosticEvent)({
              type: "model.usage",
              sessionKey: sessionKey,
              sessionId: followupRun.run.sessionId,
              channel: replyToChannel,
              provider: providerUsed,
              model: modelUsed,
              usage: {
                input: input,
                output: output,
                cacheRead: cacheRead,
                cacheWrite: cacheWrite,
                promptTokens: promptTokens,
                total: totalTokens,
              },
              context: {
                limit: contextTokensUsed,
                used: totalTokens,
              },
              costUsd: costUsd,
              durationMs: Date.now() - runStartedAt,
            });
          }
          responseUsageRaw =
            (_z =
              activeSessionEntry === null || activeSessionEntry === void 0
                ? void 0
                : activeSessionEntry.responseUsage) !== null && _z !== void 0
              ? _z
              : sessionKey
                ? (_0 =
                    activeSessionStore === null || activeSessionStore === void 0
                      ? void 0
                      : activeSessionStore[sessionKey]) === null || _0 === void 0
                  ? void 0
                  : _0.responseUsage
                : undefined;
          responseUsageMode = (0, thinking_js_1.resolveResponseUsageMode)(responseUsageRaw);
          if (responseUsageMode !== "off" && (0, usage_js_1.hasNonzeroUsage)(usage)) {
            authMode = (0, model_auth_js_1.resolveModelAuthMode)(providerUsed, cfg);
            showCost = authMode === "api-key";
            costConfig = showCost
              ? (0, usage_format_js_1.resolveModelCostConfig)({
                  provider: providerUsed,
                  model: modelUsed,
                  config: cfg,
                })
              : undefined;
            formatted = (0, agent_runner_utils_js_1.formatResponseUsageLine)({
              usage: usage,
              showCost: showCost,
              costConfig: costConfig,
            });
            if (formatted && responseUsageMode === "full" && sessionKey) {
              formatted = "".concat(formatted, " \u00B7 session ").concat(sessionKey);
            }
            if (formatted) {
              responseUsageLine = formatted;
            }
          }
          finalPayloads = replyPayloads;
          verboseEnabled = resolvedVerboseLevel !== "off";
          if (!autoCompactionCompleted) {
            return [3 /*break*/, 20];
          }
          return [
            4 /*yield*/,
            (0, session_updates_js_1.incrementCompactionCount)({
              sessionEntry: activeSessionEntry,
              sessionStore: activeSessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
            }),
          ];
        case 19:
          count = _1.sent();
          if (verboseEnabled) {
            suffix = typeof count === "number" ? " (count ".concat(count, ")") : "";
            finalPayloads = __spreadArray(
              [{ text: "\uD83E\uDDF9 Auto-compaction complete".concat(suffix, ".") }],
              finalPayloads,
              true,
            );
          }
          _1.label = 20;
        case 20:
          if (verboseEnabled && activeIsNewSession) {
            finalPayloads = __spreadArray(
              [{ text: "\uD83E\uDDED New session: ".concat(followupRun.run.sessionId) }],
              finalPayloads,
              true,
            );
          }
          if (responseUsageLine) {
            finalPayloads = (0, agent_runner_utils_js_1.appendUsageLine)(
              finalPayloads,
              responseUsageLine,
            );
          }
          return [
            2 /*return*/,
            (0, agent_runner_helpers_js_1.finalizeWithFollowup)(
              finalPayloads.length === 1 ? finalPayloads[0] : finalPayloads,
              queueKey,
              runFollowupTurn,
            ),
          ];
        case 21:
          blockReplyPipeline === null || blockReplyPipeline === void 0
            ? void 0
            : blockReplyPipeline.stop();
          typing.markRunComplete();
          return [7 /*endfinally*/];
        case 22:
          return [2 /*return*/];
      }
    });
  });
}
