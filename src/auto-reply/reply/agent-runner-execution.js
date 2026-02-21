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
exports.runAgentTurnWithFallback = runAgentTurnWithFallback;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var cli_runner_js_1 = require("../../agents/cli-runner.js");
var cli_session_js_1 = require("../../agents/cli-session.js");
var model_fallback_js_1 = require("../../agents/model-fallback.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var pi_embedded_js_1 = require("../../agents/pi-embedded.js");
var pi_embedded_helpers_js_1 = require("../../agents/pi-embedded-helpers.js");
var sessions_js_1 = require("../../config/sessions.js");
var globals_js_1 = require("../../globals.js");
var agent_events_js_1 = require("../../infra/agent-events.js");
var runtime_js_1 = require("../../runtime.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var heartbeat_js_1 = require("../heartbeat.js");
var tokens_js_1 = require("../tokens.js");
var agent_runner_utils_js_1 = require("./agent-runner-utils.js");
var block_reply_pipeline_js_1 = require("./block-reply-pipeline.js");
var reply_directives_js_1 = require("./reply-directives.js");
var reply_payloads_js_1 = require("./reply-payloads.js");
function runAgentTurnWithFallback(params) {
  return __awaiter(this, void 0, void 0, function () {
    var didLogHeartbeatStrip,
      autoCompactionCompleted,
      directlySentBlockKeys,
      runId,
      runResult,
      fallbackProvider,
      fallbackModel,
      didResetAfterCompactionFailure,
      _loop_1,
      state_1;
    var _this = this;
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
      switch (_j.label) {
        case 0:
          didLogHeartbeatStrip = false;
          autoCompactionCompleted = false;
          directlySentBlockKeys = new Set();
          runId =
            (_b = (_a = params.opts) === null || _a === void 0 ? void 0 : _a.runId) !== null &&
            _b !== void 0
              ? _b
              : node_crypto_1.default.randomUUID();
          (_d = (_c = params.opts) === null || _c === void 0 ? void 0 : _c.onAgentRunStart) ===
            null || _d === void 0
            ? void 0
            : _d.call(_c, runId);
          if (params.sessionKey) {
            (0, agent_events_js_1.registerAgentRunContext)(runId, {
              sessionKey: params.sessionKey,
              verboseLevel: params.resolvedVerboseLevel,
              isHeartbeat: params.isHeartbeat,
            });
          }
          fallbackProvider = params.followupRun.run.provider;
          fallbackModel = params.followupRun.run.model;
          didResetAfterCompactionFailure = false;
          _loop_1 = function () {
            var allowPartialStream_1,
              normalizeStreamingText_1,
              handlePartialForTyping_1,
              blockReplyPipeline_1,
              onToolResult_1,
              fallbackResult,
              embeddedError,
              _k,
              didReset,
              err_1,
              message,
              isContextOverflow,
              isCompactionFailure,
              isSessionCorruption,
              isRoleOrderingError,
              _l,
              didReset,
              sessionKey_1,
              corruptedSessionId,
              transcriptPath,
              cleanupErr_1,
              trimmedMessage,
              fallbackText;
            return __generator(this, function (_m) {
              switch (_m.label) {
                case 0:
                  _m.trys.push([0, 6, , 16]);
                  allowPartialStream_1 = !(
                    params.followupRun.run.reasoningLevel === "stream" &&
                    ((_e = params.opts) === null || _e === void 0 ? void 0 : _e.onReasoningStream)
                  );
                  normalizeStreamingText_1 = function (payload) {
                    var _a, _b;
                    if (!allowPartialStream_1) {
                      return { skip: true };
                    }
                    var text = payload.text;
                    if (
                      !params.isHeartbeat &&
                      (text === null || text === void 0 ? void 0 : text.includes("HEARTBEAT_OK"))
                    ) {
                      var stripped = (0, heartbeat_js_1.stripHeartbeatToken)(text, {
                        mode: "message",
                      });
                      if (stripped.didStrip && !didLogHeartbeatStrip) {
                        didLogHeartbeatStrip = true;
                        (0, globals_js_1.logVerbose)(
                          "Stripped stray HEARTBEAT_OK token from reply",
                        );
                      }
                      if (
                        stripped.shouldSkip &&
                        ((_b =
                          (_a = payload.mediaUrls) === null || _a === void 0
                            ? void 0
                            : _a.length) !== null && _b !== void 0
                          ? _b
                          : 0) === 0
                      ) {
                        return { skip: true };
                      }
                      text = stripped.text;
                    }
                    if ((0, tokens_js_1.isSilentReplyText)(text, tokens_js_1.SILENT_REPLY_TOKEN)) {
                      return { skip: true };
                    }
                    if (!text) {
                      return { skip: true };
                    }
                    var sanitized = (0, pi_embedded_helpers_js_1.sanitizeUserFacingText)(text);
                    if (!sanitized.trim()) {
                      return { skip: true };
                    }
                    return { text: sanitized, skip: false };
                  };
                  handlePartialForTyping_1 = function (payload) {
                    return __awaiter(_this, void 0, void 0, function () {
                      var _a, text, skip;
                      return __generator(this, function (_b) {
                        switch (_b.label) {
                          case 0:
                            ((_a = normalizeStreamingText_1(payload)),
                              (text = _a.text),
                              (skip = _a.skip));
                            if (skip || !text) {
                              return [2 /*return*/, undefined];
                            }
                            return [4 /*yield*/, params.typingSignals.signalTextDelta(text)];
                          case 1:
                            _b.sent();
                            return [2 /*return*/, text];
                        }
                      });
                    });
                  };
                  blockReplyPipeline_1 = params.blockReplyPipeline;
                  onToolResult_1 =
                    (_f = params.opts) === null || _f === void 0 ? void 0 : _f.onToolResult;
                  return [
                    4 /*yield*/,
                    (0, model_fallback_js_1.runWithModelFallback)({
                      cfg: params.followupRun.run.config,
                      provider: params.followupRun.run.provider,
                      model: params.followupRun.run.model,
                      agentDir: params.followupRun.run.agentDir,
                      fallbacksOverride: (0, agent_scope_js_1.resolveAgentModelFallbacksOverride)(
                        params.followupRun.run.config,
                        (0, sessions_js_1.resolveAgentIdFromSessionKey)(
                          params.followupRun.run.sessionKey,
                        ),
                      ),
                      run: function (provider, model) {
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
                          _w;
                        // Notify that model selection is complete (including after fallback).
                        // This allows responsePrefix template interpolation with the actual model.
                        (_b =
                          (_a = params.opts) === null || _a === void 0
                            ? void 0
                            : _a.onModelSelected) === null || _b === void 0
                          ? void 0
                          : _b.call(_a, {
                              provider: provider,
                              model: model,
                              thinkLevel: params.followupRun.run.thinkLevel,
                            });
                        if (
                          (0, model_selection_js_1.isCliProvider)(
                            provider,
                            params.followupRun.run.config,
                          )
                        ) {
                          var startedAt_1 = Date.now();
                          (0, agent_events_js_1.emitAgentEvent)({
                            runId: runId,
                            stream: "lifecycle",
                            data: {
                              phase: "start",
                              startedAt: startedAt_1,
                            },
                          });
                          var cliSessionId = (0, cli_session_js_1.getCliSessionId)(
                            params.getActiveSessionEntry(),
                            provider,
                          );
                          return (0, cli_runner_js_1.runCliAgent)({
                            sessionId: params.followupRun.run.sessionId,
                            sessionKey: params.sessionKey,
                            sessionFile: params.followupRun.run.sessionFile,
                            workspaceDir: params.followupRun.run.workspaceDir,
                            config: params.followupRun.run.config,
                            prompt: params.commandBody,
                            provider: provider,
                            model: model,
                            thinkLevel: params.followupRun.run.thinkLevel,
                            timeoutMs: params.followupRun.run.timeoutMs,
                            runId: runId,
                            extraSystemPrompt: params.followupRun.run.extraSystemPrompt,
                            ownerNumbers: params.followupRun.run.ownerNumbers,
                            cliSessionId: cliSessionId,
                            images:
                              (_c = params.opts) === null || _c === void 0 ? void 0 : _c.images,
                          })
                            .then(function (result) {
                              var _a, _b, _c;
                              // CLI backends don't emit streaming assistant events, so we need to
                              // emit one with the final text so server-chat can populate its buffer
                              // and send the response to TUI/WebSocket clients.
                              var cliText =
                                (_c =
                                  (_b =
                                    (_a = result.payloads) === null || _a === void 0
                                      ? void 0
                                      : _a[0]) === null || _b === void 0
                                    ? void 0
                                    : _b.text) === null || _c === void 0
                                  ? void 0
                                  : _c.trim();
                              if (cliText) {
                                (0, agent_events_js_1.emitAgentEvent)({
                                  runId: runId,
                                  stream: "assistant",
                                  data: { text: cliText },
                                });
                              }
                              (0, agent_events_js_1.emitAgentEvent)({
                                runId: runId,
                                stream: "lifecycle",
                                data: {
                                  phase: "end",
                                  startedAt: startedAt_1,
                                  endedAt: Date.now(),
                                },
                              });
                              return result;
                            })
                            .catch(function (err) {
                              (0, agent_events_js_1.emitAgentEvent)({
                                runId: runId,
                                stream: "lifecycle",
                                data: {
                                  phase: "error",
                                  startedAt: startedAt_1,
                                  endedAt: Date.now(),
                                  error: err instanceof Error ? err.message : String(err),
                                },
                              });
                              throw err;
                            });
                        }
                        var authProfileId =
                          provider === params.followupRun.run.provider
                            ? params.followupRun.run.authProfileId
                            : undefined;
                        return (0, pi_embedded_js_1.runEmbeddedPiAgent)(
                          __assign(
                            __assign(
                              {
                                sessionId: params.followupRun.run.sessionId,
                                sessionKey: params.sessionKey,
                                messageProvider:
                                  ((_d = params.sessionCtx.Provider) === null || _d === void 0
                                    ? void 0
                                    : _d.trim().toLowerCase()) || undefined,
                                agentAccountId: params.sessionCtx.AccountId,
                                messageTo:
                                  (_e = params.sessionCtx.OriginatingTo) !== null && _e !== void 0
                                    ? _e
                                    : params.sessionCtx.To,
                                messageThreadId:
                                  (_f = params.sessionCtx.MessageThreadId) !== null && _f !== void 0
                                    ? _f
                                    : undefined,
                                groupId:
                                  (_g = (0, sessions_js_1.resolveGroupSessionKey)(
                                    params.sessionCtx,
                                  )) === null || _g === void 0
                                    ? void 0
                                    : _g.id,
                                groupChannel:
                                  (_j =
                                    (_h = params.sessionCtx.GroupChannel) === null || _h === void 0
                                      ? void 0
                                      : _h.trim()) !== null && _j !== void 0
                                    ? _j
                                    : (_k = params.sessionCtx.GroupSubject) === null ||
                                        _k === void 0
                                      ? void 0
                                      : _k.trim(),
                                groupSpace:
                                  (_m =
                                    (_l = params.sessionCtx.GroupSpace) === null || _l === void 0
                                      ? void 0
                                      : _l.trim()) !== null && _m !== void 0
                                    ? _m
                                    : undefined,
                                senderId:
                                  ((_o = params.sessionCtx.SenderId) === null || _o === void 0
                                    ? void 0
                                    : _o.trim()) || undefined,
                                senderName:
                                  ((_p = params.sessionCtx.SenderName) === null || _p === void 0
                                    ? void 0
                                    : _p.trim()) || undefined,
                                senderUsername:
                                  ((_q = params.sessionCtx.SenderUsername) === null || _q === void 0
                                    ? void 0
                                    : _q.trim()) || undefined,
                                senderE164:
                                  ((_r = params.sessionCtx.SenderE164) === null || _r === void 0
                                    ? void 0
                                    : _r.trim()) || undefined,
                              },
                              (0, agent_runner_utils_js_1.buildThreadingToolContext)({
                                sessionCtx: params.sessionCtx,
                                config: params.followupRun.run.config,
                                hasRepliedRef:
                                  (_s = params.opts) === null || _s === void 0
                                    ? void 0
                                    : _s.hasRepliedRef,
                              }),
                            ),
                            {
                              sessionFile: params.followupRun.run.sessionFile,
                              workspaceDir: params.followupRun.run.workspaceDir,
                              agentDir: params.followupRun.run.agentDir,
                              config: params.followupRun.run.config,
                              skillsSnapshot: params.followupRun.run.skillsSnapshot,
                              prompt: params.commandBody,
                              extraSystemPrompt: params.followupRun.run.extraSystemPrompt,
                              ownerNumbers: params.followupRun.run.ownerNumbers,
                              enforceFinalTag: (0, agent_runner_utils_js_1.resolveEnforceFinalTag)(
                                params.followupRun.run,
                                provider,
                              ),
                              provider: provider,
                              model: model,
                              authProfileId: authProfileId,
                              authProfileIdSource: authProfileId
                                ? params.followupRun.run.authProfileIdSource
                                : undefined,
                              thinkLevel: params.followupRun.run.thinkLevel,
                              verboseLevel: params.followupRun.run.verboseLevel,
                              reasoningLevel: params.followupRun.run.reasoningLevel,
                              execOverrides: params.followupRun.run.execOverrides,
                              toolResultFormat: (function () {
                                var channel = (0, message_channel_js_1.resolveMessageChannel)(
                                  params.sessionCtx.Surface,
                                  params.sessionCtx.Provider,
                                );
                                if (!channel) {
                                  return "markdown";
                                }
                                return (0, message_channel_js_1.isMarkdownCapableMessageChannel)(
                                  channel,
                                )
                                  ? "markdown"
                                  : "plain";
                              })(),
                              bashElevated: params.followupRun.run.bashElevated,
                              timeoutMs: params.followupRun.run.timeoutMs,
                              runId: runId,
                              images:
                                (_t = params.opts) === null || _t === void 0 ? void 0 : _t.images,
                              abortSignal:
                                (_u = params.opts) === null || _u === void 0
                                  ? void 0
                                  : _u.abortSignal,
                              blockReplyBreak: params.resolvedBlockStreamingBreak,
                              blockReplyChunking: params.blockReplyChunking,
                              onPartialReply: allowPartialStream_1
                                ? function (payload) {
                                    return __awaiter(_this, void 0, void 0, function () {
                                      var textForTyping;
                                      var _a;
                                      return __generator(this, function (_b) {
                                        switch (_b.label) {
                                          case 0:
                                            return [4 /*yield*/, handlePartialForTyping_1(payload)];
                                          case 1:
                                            textForTyping = _b.sent();
                                            if (
                                              !((_a = params.opts) === null || _a === void 0
                                                ? void 0
                                                : _a.onPartialReply) ||
                                              textForTyping === undefined
                                            ) {
                                              return [2 /*return*/];
                                            }
                                            return [
                                              4 /*yield*/,
                                              params.opts.onPartialReply({
                                                text: textForTyping,
                                                mediaUrls: payload.mediaUrls,
                                              }),
                                            ];
                                          case 2:
                                            _b.sent();
                                            return [2 /*return*/];
                                        }
                                      });
                                    });
                                  }
                                : undefined,
                              onAssistantMessageStart: function () {
                                return __awaiter(_this, void 0, void 0, function () {
                                  return __generator(this, function (_a) {
                                    switch (_a.label) {
                                      case 0:
                                        return [
                                          4 /*yield*/,
                                          params.typingSignals.signalMessageStart(),
                                        ];
                                      case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                    }
                                  });
                                });
                              },
                              onReasoningStream:
                                params.typingSignals.shouldStartOnReasoning ||
                                ((_v = params.opts) === null || _v === void 0
                                  ? void 0
                                  : _v.onReasoningStream)
                                  ? function (payload) {
                                      return __awaiter(_this, void 0, void 0, function () {
                                        var _a, _b;
                                        return __generator(this, function (_c) {
                                          switch (_c.label) {
                                            case 0:
                                              return [
                                                4 /*yield*/,
                                                params.typingSignals.signalReasoningDelta(),
                                              ];
                                            case 1:
                                              _c.sent();
                                              return [
                                                4 /*yield*/,
                                                (_b =
                                                  (_a = params.opts) === null || _a === void 0
                                                    ? void 0
                                                    : _a.onReasoningStream) === null ||
                                                _b === void 0
                                                  ? void 0
                                                  : _b.call(_a, {
                                                      text: payload.text,
                                                      mediaUrls: payload.mediaUrls,
                                                    }),
                                              ];
                                            case 2:
                                              _c.sent();
                                              return [2 /*return*/];
                                          }
                                        });
                                      });
                                    }
                                  : undefined,
                              onAgentEvent: function (evt) {
                                return __awaiter(_this, void 0, void 0, function () {
                                  var phase, phase, willRetry;
                                  return __generator(this, function (_a) {
                                    switch (_a.label) {
                                      case 0:
                                        if (!(evt.stream === "tool")) {
                                          return [3 /*break*/, 2];
                                        }
                                        phase =
                                          typeof evt.data.phase === "string" ? evt.data.phase : "";
                                        if (!(phase === "start" || phase === "update")) {
                                          return [3 /*break*/, 2];
                                        }
                                        return [
                                          4 /*yield*/,
                                          params.typingSignals.signalToolStart(),
                                        ];
                                      case 1:
                                        _a.sent();
                                        _a.label = 2;
                                      case 2:
                                        // Track auto-compaction completion
                                        if (evt.stream === "compaction") {
                                          phase =
                                            typeof evt.data.phase === "string"
                                              ? evt.data.phase
                                              : "";
                                          willRetry = Boolean(evt.data.willRetry);
                                          if (phase === "end" && !willRetry) {
                                            autoCompactionCompleted = true;
                                          }
                                        }
                                        return [2 /*return*/];
                                    }
                                  });
                                });
                              },
                              // Always pass onBlockReply so flushBlockReplyBuffer works before tool execution,
                              // even when regular block streaming is disabled. The handler sends directly
                              // via opts.onBlockReply when the pipeline isn't available.
                              onBlockReply: (
                                (_w = params.opts) === null || _w === void 0
                                  ? void 0
                                  : _w.onBlockReply
                              )
                                ? function (payload) {
                                    return __awaiter(_this, void 0, void 0, function () {
                                      var _a,
                                        text,
                                        skip,
                                        hasPayloadMedia,
                                        currentMessageId,
                                        taggedPayload,
                                        parsed,
                                        cleaned,
                                        hasRenderableMedia,
                                        blockPayload;
                                      var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                                      return __generator(this, function (_m) {
                                        switch (_m.label) {
                                          case 0:
                                            ((_a = normalizeStreamingText_1(payload)),
                                              (text = _a.text),
                                              (skip = _a.skip));
                                            hasPayloadMedia =
                                              ((_c =
                                                (_b = payload.mediaUrls) === null || _b === void 0
                                                  ? void 0
                                                  : _b.length) !== null && _c !== void 0
                                                ? _c
                                                : 0) > 0;
                                            if (skip && !hasPayloadMedia) {
                                              return [2 /*return*/];
                                            }
                                            currentMessageId =
                                              (_d = params.sessionCtx.MessageSidFull) !== null &&
                                              _d !== void 0
                                                ? _d
                                                : params.sessionCtx.MessageSid;
                                            taggedPayload = (0,
                                            reply_payloads_js_1.applyReplyTagsToPayload)(
                                              {
                                                text: text,
                                                mediaUrls: payload.mediaUrls,
                                                mediaUrl:
                                                  (_e = payload.mediaUrls) === null || _e === void 0
                                                    ? void 0
                                                    : _e[0],
                                                replyToId: payload.replyToId,
                                                replyToTag: payload.replyToTag,
                                                replyToCurrent: payload.replyToCurrent,
                                              },
                                              currentMessageId,
                                            );
                                            // Let through payloads with audioAsVoice flag even if empty (need to track it)
                                            if (
                                              !(0, reply_payloads_js_1.isRenderablePayload)(
                                                taggedPayload,
                                              ) &&
                                              !payload.audioAsVoice
                                            ) {
                                              return [2 /*return*/];
                                            }
                                            parsed = (0,
                                            reply_directives_js_1.parseReplyDirectives)(
                                              (_f = taggedPayload.text) !== null && _f !== void 0
                                                ? _f
                                                : "",
                                              {
                                                currentMessageId: currentMessageId,
                                                silentToken: tokens_js_1.SILENT_REPLY_TOKEN,
                                              },
                                            );
                                            cleaned = parsed.text || undefined;
                                            hasRenderableMedia =
                                              Boolean(taggedPayload.mediaUrl) ||
                                              ((_h =
                                                (_g = taggedPayload.mediaUrls) === null ||
                                                _g === void 0
                                                  ? void 0
                                                  : _g.length) !== null && _h !== void 0
                                                ? _h
                                                : 0) > 0;
                                            // Skip empty payloads unless they have audioAsVoice flag (need to track it)
                                            if (
                                              !cleaned &&
                                              !hasRenderableMedia &&
                                              !payload.audioAsVoice &&
                                              !parsed.audioAsVoice
                                            ) {
                                              return [2 /*return*/];
                                            }
                                            if (parsed.isSilent && !hasRenderableMedia) {
                                              return [2 /*return*/];
                                            }
                                            blockPayload = params.applyReplyToMode(
                                              __assign(__assign({}, taggedPayload), {
                                                text: cleaned,
                                                audioAsVoice: Boolean(
                                                  parsed.audioAsVoice || payload.audioAsVoice,
                                                ),
                                                replyToId:
                                                  (_j = taggedPayload.replyToId) !== null &&
                                                  _j !== void 0
                                                    ? _j
                                                    : parsed.replyToId,
                                                replyToTag:
                                                  taggedPayload.replyToTag || parsed.replyToTag,
                                                replyToCurrent:
                                                  taggedPayload.replyToCurrent ||
                                                  parsed.replyToCurrent,
                                              }),
                                            );
                                            void params.typingSignals
                                              .signalTextDelta(
                                                cleaned !== null && cleaned !== void 0
                                                  ? cleaned
                                                  : taggedPayload.text,
                                              )
                                              .catch(function (err) {
                                                (0, globals_js_1.logVerbose)(
                                                  "block reply typing signal failed: ".concat(
                                                    String(err),
                                                  ),
                                                );
                                              });
                                            if (
                                              !(
                                                params.blockStreamingEnabled &&
                                                params.blockReplyPipeline
                                              )
                                            ) {
                                              return [3 /*break*/, 1];
                                            }
                                            params.blockReplyPipeline.enqueue(blockPayload);
                                            return [3 /*break*/, 3];
                                          case 1:
                                            if (!params.blockStreamingEnabled) {
                                              return [3 /*break*/, 3];
                                            }
                                            // Send directly when flushing before tool execution (no pipeline but streaming enabled).
                                            // Track sent key to avoid duplicate in final payloads.
                                            directlySentBlockKeys.add(
                                              (0,
                                              block_reply_pipeline_js_1.createBlockReplyPayloadKey)(
                                                blockPayload,
                                              ),
                                            );
                                            return [
                                              4 /*yield*/,
                                              (_l =
                                                (_k = params.opts) === null || _k === void 0
                                                  ? void 0
                                                  : _k.onBlockReply) === null || _l === void 0
                                                ? void 0
                                                : _l.call(_k, blockPayload),
                                            ];
                                          case 2:
                                            _m.sent();
                                            _m.label = 3;
                                          case 3:
                                            return [2 /*return*/];
                                        }
                                      });
                                    });
                                  }
                                : undefined,
                              onBlockReplyFlush:
                                params.blockStreamingEnabled && blockReplyPipeline_1
                                  ? function () {
                                      return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                          switch (_a.label) {
                                            case 0:
                                              return [
                                                4 /*yield*/,
                                                blockReplyPipeline_1.flush({ force: true }),
                                              ];
                                            case 1:
                                              _a.sent();
                                              return [2 /*return*/];
                                          }
                                        });
                                      });
                                    }
                                  : undefined,
                              shouldEmitToolResult: params.shouldEmitToolResult,
                              shouldEmitToolOutput: params.shouldEmitToolOutput,
                              onToolResult: onToolResult_1
                                ? function (payload) {
                                    // `subscribeEmbeddedPiSession` may invoke tool callbacks without awaiting them.
                                    // If a tool callback starts typing after the run finalized, we can end up with
                                    // a typing loop that never sees a matching markRunComplete(). Track and drain.
                                    var task = (function () {
                                      return __awaiter(_this, void 0, void 0, function () {
                                        var _a, text, skip;
                                        return __generator(this, function (_b) {
                                          switch (_b.label) {
                                            case 0:
                                              ((_a = normalizeStreamingText_1(payload)),
                                                (text = _a.text),
                                                (skip = _a.skip));
                                              if (skip) {
                                                return [2 /*return*/];
                                              }
                                              return [
                                                4 /*yield*/,
                                                params.typingSignals.signalTextDelta(text),
                                              ];
                                            case 1:
                                              _b.sent();
                                              return [
                                                4 /*yield*/,
                                                onToolResult_1({
                                                  text: text,
                                                  mediaUrls: payload.mediaUrls,
                                                }),
                                              ];
                                            case 2:
                                              _b.sent();
                                              return [2 /*return*/];
                                          }
                                        });
                                      });
                                    })()
                                      .catch(function (err) {
                                        (0, globals_js_1.logVerbose)(
                                          "tool result delivery failed: ".concat(String(err)),
                                        );
                                      })
                                      .finally(function () {
                                        params.pendingToolTasks.delete(task);
                                      });
                                    params.pendingToolTasks.add(task);
                                  }
                                : undefined,
                            },
                          ),
                        );
                      },
                    }),
                  ];
                case 1:
                  fallbackResult = _m.sent();
                  runResult = fallbackResult.result;
                  fallbackProvider = fallbackResult.provider;
                  fallbackModel = fallbackResult.model;
                  embeddedError =
                    (_g = runResult.meta) === null || _g === void 0 ? void 0 : _g.error;
                  _k =
                    embeddedError &&
                    (0, pi_embedded_helpers_js_1.isContextOverflowError)(embeddedError.message) &&
                    !didResetAfterCompactionFailure;
                  if (!_k) {
                    return [3 /*break*/, 3];
                  }
                  return [
                    4 /*yield*/,
                    params.resetSessionAfterCompactionFailure(embeddedError.message),
                  ];
                case 2:
                  _k = _m.sent();
                  _m.label = 3;
                case 3:
                  if (_k) {
                    didResetAfterCompactionFailure = true;
                    return [
                      2 /*return*/,
                      {
                        value: {
                          kind: "final",
                          payload: {
                            text: "⚠️ Context limit exceeded. I've reset our conversation to start fresh - please try again.\n\nTo prevent this, increase your compaction buffer by setting `agents.defaults.compaction.reserveTokensFloor` to 4000 or higher in your config.",
                          },
                        },
                      },
                    ];
                  }
                  if (
                    !(
                      (embeddedError === null || embeddedError === void 0
                        ? void 0
                        : embeddedError.kind) === "role_ordering"
                    )
                  ) {
                    return [3 /*break*/, 5];
                  }
                  return [
                    4 /*yield*/,
                    params.resetSessionAfterRoleOrderingConflict(embeddedError.message),
                  ];
                case 4:
                  didReset = _m.sent();
                  if (didReset) {
                    return [
                      2 /*return*/,
                      {
                        value: {
                          kind: "final",
                          payload: {
                            text: "⚠️ Message ordering conflict. I've reset the conversation - please try again.",
                          },
                        },
                      },
                    ];
                  }
                  _m.label = 5;
                case 5:
                  return [2 /*return*/, "break"];
                case 6:
                  err_1 = _m.sent();
                  message = err_1 instanceof Error ? err_1.message : String(err_1);
                  isContextOverflow = (0, pi_embedded_helpers_js_1.isLikelyContextOverflowError)(
                    message,
                  );
                  isCompactionFailure = (0, pi_embedded_helpers_js_1.isCompactionFailureError)(
                    message,
                  );
                  isSessionCorruption = /function call turn comes immediately after/i.test(message);
                  isRoleOrderingError = /incorrect role information|roles must alternate/i.test(
                    message,
                  );
                  _l = isCompactionFailure && !didResetAfterCompactionFailure;
                  if (!_l) {
                    return [3 /*break*/, 8];
                  }
                  return [4 /*yield*/, params.resetSessionAfterCompactionFailure(message)];
                case 7:
                  _l = _m.sent();
                  _m.label = 8;
                case 8:
                  if (_l) {
                    didResetAfterCompactionFailure = true;
                    return [
                      2 /*return*/,
                      {
                        value: {
                          kind: "final",
                          payload: {
                            text: "⚠️ Context limit exceeded during compaction. I've reset our conversation to start fresh - please try again.\n\nTo prevent this, increase your compaction buffer by setting `agents.defaults.compaction.reserveTokensFloor` to 4000 or higher in your config.",
                          },
                        },
                      },
                    ];
                  }
                  if (!isRoleOrderingError) {
                    return [3 /*break*/, 10];
                  }
                  return [4 /*yield*/, params.resetSessionAfterRoleOrderingConflict(message)];
                case 9:
                  didReset = _m.sent();
                  if (didReset) {
                    return [
                      2 /*return*/,
                      {
                        value: {
                          kind: "final",
                          payload: {
                            text: "⚠️ Message ordering conflict. I've reset the conversation - please try again.",
                          },
                        },
                      },
                    ];
                  }
                  _m.label = 10;
                case 10:
                  if (
                    !(
                      isSessionCorruption &&
                      params.sessionKey &&
                      params.activeSessionStore &&
                      params.storePath
                    )
                  ) {
                    return [3 /*break*/, 15];
                  }
                  sessionKey_1 = params.sessionKey;
                  corruptedSessionId =
                    (_h = params.getActiveSessionEntry()) === null || _h === void 0
                      ? void 0
                      : _h.sessionId;
                  runtime_js_1.defaultRuntime.error(
                    "Session history corrupted (Gemini function call ordering). Resetting session: ".concat(
                      params.sessionKey,
                    ),
                  );
                  _m.label = 11;
                case 11:
                  _m.trys.push([11, 13, , 14]);
                  // Delete transcript file if it exists
                  if (corruptedSessionId) {
                    transcriptPath = (0, sessions_js_1.resolveSessionTranscriptPath)(
                      corruptedSessionId,
                    );
                    try {
                      node_fs_1.default.unlinkSync(transcriptPath);
                    } catch (_o) {
                      // Ignore if file doesn't exist
                    }
                  }
                  // Keep the in-memory snapshot consistent with the on-disk store reset.
                  delete params.activeSessionStore[sessionKey_1];
                  // Remove session entry from store using a fresh, locked snapshot.
                  return [
                    4 /*yield*/,
                    (0, sessions_js_1.updateSessionStore)(params.storePath, function (store) {
                      delete store[sessionKey_1];
                    }),
                  ];
                case 12:
                  // Remove session entry from store using a fresh, locked snapshot.
                  _m.sent();
                  return [3 /*break*/, 14];
                case 13:
                  cleanupErr_1 = _m.sent();
                  runtime_js_1.defaultRuntime.error(
                    "Failed to reset corrupted session "
                      .concat(params.sessionKey, ": ")
                      .concat(String(cleanupErr_1)),
                  );
                  return [3 /*break*/, 14];
                case 14:
                  return [
                    2 /*return*/,
                    {
                      value: {
                        kind: "final",
                        payload: {
                          text: "⚠️ Session history was corrupted. I've reset the conversation - please try again!",
                        },
                      },
                    },
                  ];
                case 15:
                  runtime_js_1.defaultRuntime.error(
                    "Embedded agent failed before reply: ".concat(message),
                  );
                  trimmedMessage = message.replace(/\.\s*$/, "");
                  fallbackText = isContextOverflow
                    ? "⚠️ Context overflow — prompt too large for this model. Try a shorter message or a larger-context model."
                    : isRoleOrderingError
                      ? "⚠️ Message ordering conflict - please try again. If this persists, use /new to start a fresh session."
                      : "\u26A0\uFE0F Agent failed before reply: ".concat(
                          trimmedMessage,
                          ".\nLogs: openclaw logs --follow",
                        );
                  return [
                    2 /*return*/,
                    {
                      value: {
                        kind: "final",
                        payload: {
                          text: fallbackText,
                        },
                      },
                    },
                  ];
                case 16:
                  return [2 /*return*/];
              }
            });
          };
          _j.label = 1;
        case 1:
          if (!true) {
            return [3 /*break*/, 3];
          }
          return [5 /*yield**/, _loop_1()];
        case 2:
          state_1 = _j.sent();
          if (typeof state_1 === "object") {
            return [2 /*return*/, state_1.value];
          }
          if (state_1 === "break") {
            return [3 /*break*/, 3];
          }
          return [3 /*break*/, 1];
        case 3:
          return [
            2 /*return*/,
            {
              kind: "success",
              runResult: runResult,
              fallbackProvider: fallbackProvider,
              fallbackModel: fallbackModel,
              didLogHeartbeatStrip: didLogHeartbeatStrip,
              autoCompactionCompleted: autoCompactionCompleted,
              directlySentBlockKeys:
                directlySentBlockKeys.size > 0 ? directlySentBlockKeys : undefined,
            },
          ];
      }
    });
  });
}
