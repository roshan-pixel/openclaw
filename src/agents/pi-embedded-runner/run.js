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
exports.runEmbeddedPiAgent = runEmbeddedPiAgent;
var promises_1 = require("node:fs/promises");
var command_queue_js_1 = require("../../process/command-queue.js");
var utils_js_1 = require("../../utils.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var agent_paths_js_1 = require("../agent-paths.js");
var auth_profiles_js_1 = require("../auth-profiles.js");
var context_window_guard_js_1 = require("../context-window-guard.js");
var defaults_js_1 = require("../defaults.js");
var failover_error_js_1 = require("../failover-error.js");
var model_auth_js_1 = require("../model-auth.js");
var model_selection_js_1 = require("../model-selection.js");
var models_config_js_1 = require("../models-config.js");
var pi_embedded_helpers_js_1 = require("../pi-embedded-helpers.js");
var usage_js_1 = require("../usage.js");
var compact_js_1 = require("./compact.js");
var lanes_js_1 = require("./lanes.js");
var logger_js_1 = require("./logger.js");
var model_js_1 = require("./model.js");
var attempt_js_1 = require("./run/attempt.js");
var payloads_js_1 = require("./run/payloads.js");
var utils_js_2 = require("./utils.js");
// Avoid Anthropic's refusal test token poisoning session transcripts.
var ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL = "ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL";
var ANTHROPIC_MAGIC_STRING_REPLACEMENT = "ANTHROPIC MAGIC STRING TRIGGER REFUSAL (redacted)";
function scrubAnthropicRefusalMagic(prompt) {
  if (!prompt.includes(ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL)) {
    return prompt;
  }
  return prompt.replaceAll(
    ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL,
    ANTHROPIC_MAGIC_STRING_REPLACEMENT,
  );
}
function runEmbeddedPiAgent(params) {
  return __awaiter(this, void 0, void 0, function () {
    var sessionLane,
      globalLane,
      enqueueGlobal,
      enqueueSession,
      channelHint,
      resolvedToolResultFormat,
      isProbeSession;
    var _this = this;
    var _a, _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
      sessionLane = (0, lanes_js_1.resolveSessionLane)(
        ((_a = params.sessionKey) === null || _a === void 0 ? void 0 : _a.trim()) ||
          params.sessionId,
      );
      globalLane = (0, lanes_js_1.resolveGlobalLane)(params.lane);
      enqueueGlobal =
        (_b = params.enqueue) !== null && _b !== void 0
          ? _b
          : function (task, opts) {
              return (0, command_queue_js_1.enqueueCommandInLane)(globalLane, task, opts);
            };
      enqueueSession =
        (_c = params.enqueue) !== null && _c !== void 0
          ? _c
          : function (task, opts) {
              return (0, command_queue_js_1.enqueueCommandInLane)(sessionLane, task, opts);
            };
      channelHint =
        (_d = params.messageChannel) !== null && _d !== void 0 ? _d : params.messageProvider;
      resolvedToolResultFormat =
        (_e = params.toolResultFormat) !== null && _e !== void 0
          ? _e
          : channelHint
            ? (0, message_channel_js_1.isMarkdownCapableMessageChannel)(channelHint)
              ? "markdown"
              : "plain"
            : "markdown";
      isProbeSession =
        (_g =
          (_f = params.sessionId) === null || _f === void 0 ? void 0 : _f.startsWith("probe-")) !==
          null && _g !== void 0
          ? _g
          : false;
      return [
        2 /*return*/,
        enqueueSession(function () {
          return enqueueGlobal(function () {
            return __awaiter(_this, void 0, void 0, function () {
              var started,
                resolvedWorkspace,
                prevCwd,
                provider,
                modelId,
                agentDir,
                fallbackConfigured,
                _a,
                model,
                error,
                authStorage,
                modelRegistry,
                ctxInfo,
                ctxGuard,
                authStore,
                preferredProfileId,
                lockedProfileId,
                lockedProfile,
                profileOrder,
                profileCandidates,
                profileIndex,
                initialThinkLevel,
                thinkLevel,
                attemptedThinking,
                apiKeyInfo,
                lastProfileId,
                resolveAuthProfileFailoverReason,
                throwAuthProfileFailover,
                resolveApiKeyForCandidate,
                applyApiKeyInfo,
                advanceAuthProfile,
                candidate,
                err_1,
                advanced,
                overflowCompactionAttempted,
                prompt_1,
                attempt,
                aborted,
                promptError,
                timedOut,
                sessionIdUsed,
                lastAssistant,
                errorText,
                isCompactionFailure,
                compactResult,
                kind,
                imageSizeError,
                maxMb,
                maxMbLabel,
                maxBytesHint,
                promptFailoverReason,
                _b,
                fallbackThinking_1,
                fallbackThinking,
                authFailure,
                rateLimitFailure,
                failoverFailure,
                assistantFailoverReason,
                cloudCodeAssistFormatError,
                imageDimensionError,
                details,
                shouldRotate,
                reason,
                rotated,
                message,
                status_1,
                usage,
                agentMeta,
                payloads;
              var _this = this;
              var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
              return __generator(this, function (_y) {
                switch (_y.label) {
                  case 0:
                    started = Date.now();
                    resolvedWorkspace = (0, utils_js_1.resolveUserPath)(params.workspaceDir);
                    prevCwd = process.cwd();
                    provider =
                      ((_c = params.provider) !== null && _c !== void 0
                        ? _c
                        : defaults_js_1.DEFAULT_PROVIDER
                      ).trim() || defaults_js_1.DEFAULT_PROVIDER;
                    modelId =
                      ((_d = params.model) !== null && _d !== void 0
                        ? _d
                        : defaults_js_1.DEFAULT_MODEL
                      ).trim() || defaults_js_1.DEFAULT_MODEL;
                    agentDir =
                      (_e = params.agentDir) !== null && _e !== void 0
                        ? _e
                        : (0, agent_paths_js_1.resolveOpenClawAgentDir)();
                    fallbackConfigured =
                      ((_l =
                        (_k =
                          (_j =
                            (_h =
                              (_g =
                                (_f = params.config) === null || _f === void 0
                                  ? void 0
                                  : _f.agents) === null || _g === void 0
                                ? void 0
                                : _g.defaults) === null || _h === void 0
                              ? void 0
                              : _h.model) === null || _j === void 0
                            ? void 0
                            : _j.fallbacks) === null || _k === void 0
                          ? void 0
                          : _k.length) !== null && _l !== void 0
                        ? _l
                        : 0) > 0;
                    return [
                      4 /*yield*/,
                      (0, models_config_js_1.ensureOpenClawModelsJson)(params.config, agentDir),
                    ];
                  case 1:
                    _y.sent();
                    ((_a = (0, model_js_1.resolveModel)(
                      provider,
                      modelId,
                      agentDir,
                      params.config,
                    )),
                      (model = _a.model),
                      (error = _a.error),
                      (authStorage = _a.authStorage),
                      (modelRegistry = _a.modelRegistry));
                    if (!model) {
                      throw new Error(
                        error !== null && error !== void 0
                          ? error
                          : "Unknown model: ".concat(provider, "/").concat(modelId),
                      );
                    }
                    ctxInfo = (0, context_window_guard_js_1.resolveContextWindowInfo)({
                      cfg: params.config,
                      provider: provider,
                      modelId: modelId,
                      modelContextWindow: model.contextWindow,
                      defaultTokens: defaults_js_1.DEFAULT_CONTEXT_TOKENS,
                    });
                    ctxGuard = (0, context_window_guard_js_1.evaluateContextWindowGuard)({
                      info: ctxInfo,
                      warnBelowTokens: context_window_guard_js_1.CONTEXT_WINDOW_WARN_BELOW_TOKENS,
                      hardMinTokens: context_window_guard_js_1.CONTEXT_WINDOW_HARD_MIN_TOKENS,
                    });
                    if (ctxGuard.shouldWarn) {
                      logger_js_1.log.warn(
                        "low context window: "
                          .concat(provider, "/")
                          .concat(modelId, " ctx=")
                          .concat(ctxGuard.tokens, " (warn<")
                          .concat(
                            context_window_guard_js_1.CONTEXT_WINDOW_WARN_BELOW_TOKENS,
                            ") source=",
                          )
                          .concat(ctxGuard.source),
                      );
                    }
                    if (ctxGuard.shouldBlock) {
                      logger_js_1.log.error(
                        "blocked model (context window too small): "
                          .concat(provider, "/")
                          .concat(modelId, " ctx=")
                          .concat(ctxGuard.tokens, " (min=")
                          .concat(
                            context_window_guard_js_1.CONTEXT_WINDOW_HARD_MIN_TOKENS,
                            ") source=",
                          )
                          .concat(ctxGuard.source),
                      );
                      throw new failover_error_js_1.FailoverError(
                        "Model context window too small ("
                          .concat(ctxGuard.tokens, " tokens). Minimum is ")
                          .concat(context_window_guard_js_1.CONTEXT_WINDOW_HARD_MIN_TOKENS, "."),
                        { reason: "unknown", provider: provider, model: modelId },
                      );
                    }
                    authStore = (0, model_auth_js_1.ensureAuthProfileStore)(agentDir, {
                      allowKeychainPrompt: false,
                    });
                    preferredProfileId =
                      (_m = params.authProfileId) === null || _m === void 0 ? void 0 : _m.trim();
                    lockedProfileId =
                      params.authProfileIdSource === "user" ? preferredProfileId : undefined;
                    if (lockedProfileId) {
                      lockedProfile = authStore.profiles[lockedProfileId];
                      if (
                        !lockedProfile ||
                        (0, model_selection_js_1.normalizeProviderId)(lockedProfile.provider) !==
                          (0, model_selection_js_1.normalizeProviderId)(provider)
                      ) {
                        lockedProfileId = undefined;
                      }
                    }
                    profileOrder = (0, model_auth_js_1.resolveAuthProfileOrder)({
                      cfg: params.config,
                      store: authStore,
                      provider: provider,
                      preferredProfile: preferredProfileId,
                    });
                    if (lockedProfileId && !profileOrder.includes(lockedProfileId)) {
                      throw new Error(
                        'Auth profile "'
                          .concat(lockedProfileId, '" is not configured for ')
                          .concat(provider, "."),
                      );
                    }
                    profileCandidates = lockedProfileId
                      ? [lockedProfileId]
                      : profileOrder.length > 0
                        ? profileOrder
                        : [undefined];
                    profileIndex = 0;
                    initialThinkLevel =
                      (_o = params.thinkLevel) !== null && _o !== void 0 ? _o : "off";
                    thinkLevel = initialThinkLevel;
                    attemptedThinking = new Set();
                    apiKeyInfo = null;
                    resolveAuthProfileFailoverReason = function (params) {
                      if (params.allInCooldown) {
                        return "rate_limit";
                      }
                      var classified = (0, pi_embedded_helpers_js_1.classifyFailoverReason)(
                        params.message,
                      );
                      return classified !== null && classified !== void 0 ? classified : "auth";
                    };
                    throwAuthProfileFailover = function (params) {
                      var _a;
                      var fallbackMessage = "No available auth profile for ".concat(
                        provider,
                        " (all in cooldown or unavailable).",
                      );
                      var message =
                        ((_a = params.message) === null || _a === void 0 ? void 0 : _a.trim()) ||
                        (params.error
                          ? (0, utils_js_2.describeUnknownError)(params.error).trim()
                          : "") ||
                        fallbackMessage;
                      var reason = resolveAuthProfileFailoverReason({
                        allInCooldown: params.allInCooldown,
                        message: message,
                      });
                      if (fallbackConfigured) {
                        throw new failover_error_js_1.FailoverError(message, {
                          reason: reason,
                          provider: provider,
                          model: modelId,
                          status: (0, failover_error_js_1.resolveFailoverStatus)(reason),
                          cause: params.error,
                        });
                      }
                      if (params.error instanceof Error) {
                        throw params.error;
                      }
                      throw new Error(message);
                    };
                    resolveApiKeyForCandidate = function (candidate) {
                      return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                          return [
                            2 /*return*/,
                            (0, model_auth_js_1.getApiKeyForModel)({
                              model: model,
                              cfg: params.config,
                              profileId: candidate,
                              store: authStore,
                              agentDir: agentDir,
                            }),
                          ];
                        });
                      });
                    };
                    applyApiKeyInfo = function (candidate) {
                      return __awaiter(_this, void 0, void 0, function () {
                        var resolvedProfileId, resolveCopilotApiToken, copilotToken;
                        var _a;
                        return __generator(this, function (_b) {
                          switch (_b.label) {
                            case 0:
                              return [4 /*yield*/, resolveApiKeyForCandidate(candidate)];
                            case 1:
                              apiKeyInfo = _b.sent();
                              resolvedProfileId =
                                (_a = apiKeyInfo.profileId) !== null && _a !== void 0
                                  ? _a
                                  : candidate;
                              if (!apiKeyInfo.apiKey) {
                                if (apiKeyInfo.mode !== "aws-sdk") {
                                  throw new Error(
                                    'No API key resolved for provider "'
                                      .concat(model.provider, '" (auth mode: ')
                                      .concat(apiKeyInfo.mode, ")."),
                                  );
                                }
                                lastProfileId = resolvedProfileId;
                                return [2 /*return*/];
                              }
                              if (!(model.provider === "github-copilot")) {
                                return [3 /*break*/, 4];
                              }
                              return [
                                4 /*yield*/,
                                Promise.resolve().then(function () {
                                  return require("../../providers/github-copilot-token.js");
                                }),
                              ];
                            case 2:
                              resolveCopilotApiToken = _b.sent().resolveCopilotApiToken;
                              return [
                                4 /*yield*/,
                                resolveCopilotApiToken({
                                  githubToken: apiKeyInfo.apiKey,
                                }),
                              ];
                            case 3:
                              copilotToken = _b.sent();
                              authStorage.setRuntimeApiKey(model.provider, copilotToken.token);
                              return [3 /*break*/, 5];
                            case 4:
                              authStorage.setRuntimeApiKey(model.provider, apiKeyInfo.apiKey);
                              _b.label = 5;
                            case 5:
                              lastProfileId = apiKeyInfo.profileId;
                              return [2 /*return*/];
                          }
                        });
                      });
                    };
                    advanceAuthProfile = function () {
                      return __awaiter(_this, void 0, void 0, function () {
                        var nextIndex, candidate, err_2;
                        return __generator(this, function (_a) {
                          switch (_a.label) {
                            case 0:
                              if (lockedProfileId) {
                                return [2 /*return*/, false];
                              }
                              nextIndex = profileIndex + 1;
                              _a.label = 1;
                            case 1:
                              if (!(nextIndex < profileCandidates.length)) {
                                return [3 /*break*/, 6];
                              }
                              candidate = profileCandidates[nextIndex];
                              if (
                                candidate &&
                                (0, auth_profiles_js_1.isProfileInCooldown)(authStore, candidate)
                              ) {
                                nextIndex += 1;
                                return [3 /*break*/, 1];
                              }
                              _a.label = 2;
                            case 2:
                              _a.trys.push([2, 4, , 5]);
                              return [4 /*yield*/, applyApiKeyInfo(candidate)];
                            case 3:
                              _a.sent();
                              profileIndex = nextIndex;
                              thinkLevel = initialThinkLevel;
                              attemptedThinking.clear();
                              return [2 /*return*/, true];
                            case 4:
                              err_2 = _a.sent();
                              if (candidate && candidate === lockedProfileId) {
                                throw err_2;
                              }
                              nextIndex += 1;
                              return [3 /*break*/, 5];
                            case 5:
                              return [3 /*break*/, 1];
                            case 6:
                              return [2 /*return*/, false];
                          }
                        });
                      });
                    };
                    _y.label = 2;
                  case 2:
                    _y.trys.push([2, 6, , 8]);
                    _y.label = 3;
                  case 3:
                    if (!(profileIndex < profileCandidates.length)) {
                      return [3 /*break*/, 5];
                    }
                    candidate = profileCandidates[profileIndex];
                    if (
                      candidate &&
                      candidate !== lockedProfileId &&
                      (0, auth_profiles_js_1.isProfileInCooldown)(authStore, candidate)
                    ) {
                      profileIndex += 1;
                      return [3 /*break*/, 3];
                    }
                    return [4 /*yield*/, applyApiKeyInfo(profileCandidates[profileIndex])];
                  case 4:
                    _y.sent();
                    return [3 /*break*/, 5];
                  case 5:
                    if (profileIndex >= profileCandidates.length) {
                      throwAuthProfileFailover({ allInCooldown: true });
                    }
                    return [3 /*break*/, 8];
                  case 6:
                    err_1 = _y.sent();
                    if (err_1 instanceof failover_error_js_1.FailoverError) {
                      throw err_1;
                    }
                    if (profileCandidates[profileIndex] === lockedProfileId) {
                      throwAuthProfileFailover({ allInCooldown: false, error: err_1 });
                    }
                    return [4 /*yield*/, advanceAuthProfile()];
                  case 7:
                    advanced = _y.sent();
                    if (!advanced) {
                      throwAuthProfileFailover({ allInCooldown: false, error: err_1 });
                    }
                    return [3 /*break*/, 8];
                  case 8:
                    overflowCompactionAttempted = false;
                    _y.label = 9;
                  case 9:
                    _y.trys.push([9, , 29, 30]);
                    _y.label = 10;
                  case 10:
                    if (!true) {
                      return [3 /*break*/, 28];
                    }
                    attemptedThinking.add(thinkLevel);
                    return [
                      4 /*yield*/,
                      promises_1.default.mkdir(resolvedWorkspace, { recursive: true }),
                    ];
                  case 11:
                    _y.sent();
                    prompt_1 =
                      provider === "anthropic"
                        ? scrubAnthropicRefusalMagic(params.prompt)
                        : params.prompt;
                    return [
                      4 /*yield*/,
                      (0, attempt_js_1.runEmbeddedAttempt)({
                        sessionId: params.sessionId,
                        sessionKey: params.sessionKey,
                        messageChannel: params.messageChannel,
                        messageProvider: params.messageProvider,
                        agentAccountId: params.agentAccountId,
                        messageTo: params.messageTo,
                        messageThreadId: params.messageThreadId,
                        groupId: params.groupId,
                        groupChannel: params.groupChannel,
                        groupSpace: params.groupSpace,
                        spawnedBy: params.spawnedBy,
                        currentChannelId: params.currentChannelId,
                        currentThreadTs: params.currentThreadTs,
                        replyToMode: params.replyToMode,
                        hasRepliedRef: params.hasRepliedRef,
                        sessionFile: params.sessionFile,
                        workspaceDir: params.workspaceDir,
                        agentDir: agentDir,
                        config: params.config,
                        skillsSnapshot: params.skillsSnapshot,
                        prompt: prompt_1,
                        images: params.images,
                        disableTools: params.disableTools,
                        provider: provider,
                        modelId: modelId,
                        model: model,
                        authStorage: authStorage,
                        modelRegistry: modelRegistry,
                        thinkLevel: thinkLevel,
                        verboseLevel: params.verboseLevel,
                        reasoningLevel: params.reasoningLevel,
                        toolResultFormat: resolvedToolResultFormat,
                        execOverrides: params.execOverrides,
                        bashElevated: params.bashElevated,
                        timeoutMs: params.timeoutMs,
                        runId: params.runId,
                        abortSignal: params.abortSignal,
                        shouldEmitToolResult: params.shouldEmitToolResult,
                        shouldEmitToolOutput: params.shouldEmitToolOutput,
                        onPartialReply: params.onPartialReply,
                        onAssistantMessageStart: params.onAssistantMessageStart,
                        onBlockReply: params.onBlockReply,
                        onBlockReplyFlush: params.onBlockReplyFlush,
                        blockReplyBreak: params.blockReplyBreak,
                        blockReplyChunking: params.blockReplyChunking,
                        onReasoningStream: params.onReasoningStream,
                        onToolResult: params.onToolResult,
                        onAgentEvent: params.onAgentEvent,
                        extraSystemPrompt: params.extraSystemPrompt,
                        streamParams: params.streamParams,
                        ownerNumbers: params.ownerNumbers,
                        enforceFinalTag: params.enforceFinalTag,
                      }),
                    ];
                  case 12:
                    attempt = _y.sent();
                    ((aborted = attempt.aborted),
                      (promptError = attempt.promptError),
                      (timedOut = attempt.timedOut),
                      (sessionIdUsed = attempt.sessionIdUsed),
                      (lastAssistant = attempt.lastAssistant));
                    if (!(promptError && !aborted)) {
                      return [3 /*break*/, 20];
                    }
                    errorText = (0, utils_js_2.describeUnknownError)(promptError);
                    if (!(0, pi_embedded_helpers_js_1.isContextOverflowError)(errorText)) {
                      return [3 /*break*/, 15];
                    }
                    isCompactionFailure = (0, pi_embedded_helpers_js_1.isCompactionFailureError)(
                      errorText,
                    );
                    if (!(!isCompactionFailure && !overflowCompactionAttempted)) {
                      return [3 /*break*/, 14];
                    }
                    logger_js_1.log.warn(
                      "context overflow detected; attempting auto-compaction for "
                        .concat(provider, "/")
                        .concat(modelId),
                    );
                    overflowCompactionAttempted = true;
                    return [
                      4 /*yield*/,
                      (0, compact_js_1.compactEmbeddedPiSessionDirect)({
                        sessionId: params.sessionId,
                        sessionKey: params.sessionKey,
                        messageChannel: params.messageChannel,
                        messageProvider: params.messageProvider,
                        agentAccountId: params.agentAccountId,
                        authProfileId: lastProfileId,
                        sessionFile: params.sessionFile,
                        workspaceDir: params.workspaceDir,
                        agentDir: agentDir,
                        config: params.config,
                        skillsSnapshot: params.skillsSnapshot,
                        provider: provider,
                        model: modelId,
                        thinkLevel: thinkLevel,
                        reasoningLevel: params.reasoningLevel,
                        bashElevated: params.bashElevated,
                        extraSystemPrompt: params.extraSystemPrompt,
                        ownerNumbers: params.ownerNumbers,
                      }),
                    ];
                  case 13:
                    compactResult = _y.sent();
                    if (compactResult.compacted) {
                      logger_js_1.log.info(
                        "auto-compaction succeeded for "
                          .concat(provider, "/")
                          .concat(modelId, "; retrying prompt"),
                      );
                      return [3 /*break*/, 10];
                    }
                    logger_js_1.log.warn(
                      "auto-compaction failed for "
                        .concat(provider, "/")
                        .concat(modelId, ": ")
                        .concat(
                          (_p = compactResult.reason) !== null && _p !== void 0
                            ? _p
                            : "nothing to compact",
                        ),
                    );
                    _y.label = 14;
                  case 14:
                    kind = isCompactionFailure ? "compaction_failure" : "context_overflow";
                    return [
                      2 /*return*/,
                      {
                        payloads: [
                          {
                            text:
                              "Context overflow: prompt too large for the model. " +
                              "Try again with less input or a larger-context model.",
                            isError: true,
                          },
                        ],
                        meta: {
                          durationMs: Date.now() - started,
                          agentMeta: {
                            sessionId: sessionIdUsed,
                            provider: provider,
                            model: model.id,
                          },
                          systemPromptReport: attempt.systemPromptReport,
                          error: { kind: kind, message: errorText },
                        },
                      },
                    ];
                  case 15:
                    // Handle role ordering errors with a user-friendly message
                    if (/incorrect role information|roles must alternate/i.test(errorText)) {
                      return [
                        2 /*return*/,
                        {
                          payloads: [
                            {
                              text:
                                "Message ordering conflict - please try again. " +
                                "If this persists, use /new to start a fresh session.",
                              isError: true,
                            },
                          ],
                          meta: {
                            durationMs: Date.now() - started,
                            agentMeta: {
                              sessionId: sessionIdUsed,
                              provider: provider,
                              model: model.id,
                            },
                            systemPromptReport: attempt.systemPromptReport,
                            error: { kind: "role_ordering", message: errorText },
                          },
                        },
                      ];
                    }
                    imageSizeError = (0, pi_embedded_helpers_js_1.parseImageSizeError)(errorText);
                    if (imageSizeError) {
                      maxMb = imageSizeError.maxMb;
                      maxMbLabel =
                        typeof maxMb === "number" && Number.isFinite(maxMb)
                          ? "".concat(maxMb)
                          : null;
                      maxBytesHint = maxMbLabel ? " (max ".concat(maxMbLabel, "MB)") : "";
                      return [
                        2 /*return*/,
                        {
                          payloads: [
                            {
                              text:
                                "Image too large for the model".concat(maxBytesHint, ". ") +
                                "Please compress or resize the image and try again.",
                              isError: true,
                            },
                          ],
                          meta: {
                            durationMs: Date.now() - started,
                            agentMeta: {
                              sessionId: sessionIdUsed,
                              provider: provider,
                              model: model.id,
                            },
                            systemPromptReport: attempt.systemPromptReport,
                            error: { kind: "image_size", message: errorText },
                          },
                        },
                      ];
                    }
                    promptFailoverReason = (0, pi_embedded_helpers_js_1.classifyFailoverReason)(
                      errorText,
                    );
                    if (
                      !(promptFailoverReason && promptFailoverReason !== "timeout" && lastProfileId)
                    ) {
                      return [3 /*break*/, 17];
                    }
                    return [
                      4 /*yield*/,
                      (0, auth_profiles_js_1.markAuthProfileFailure)({
                        store: authStore,
                        profileId: lastProfileId,
                        reason: promptFailoverReason,
                        cfg: params.config,
                        agentDir: params.agentDir,
                      }),
                    ];
                  case 16:
                    _y.sent();
                    _y.label = 17;
                  case 17:
                    _b =
                      (0, pi_embedded_helpers_js_1.isFailoverErrorMessage)(errorText) &&
                      promptFailoverReason !== "timeout";
                    if (!_b) {
                      return [3 /*break*/, 19];
                    }
                    return [4 /*yield*/, advanceAuthProfile()];
                  case 18:
                    _b = _y.sent();
                    _y.label = 19;
                  case 19:
                    if (_b) {
                      return [3 /*break*/, 10];
                    }
                    fallbackThinking_1 = (0, pi_embedded_helpers_js_1.pickFallbackThinkingLevel)({
                      message: errorText,
                      attempted: attemptedThinking,
                    });
                    if (fallbackThinking_1) {
                      logger_js_1.log.warn(
                        "unsupported thinking level for "
                          .concat(provider, "/")
                          .concat(modelId, "; retrying with ")
                          .concat(fallbackThinking_1),
                      );
                      thinkLevel = fallbackThinking_1;
                      return [3 /*break*/, 10];
                    }
                    // FIX: Throw FailoverError for prompt errors when fallbacks configured
                    // This enables model fallback for quota/rate limit errors during prompt submission
                    if (
                      fallbackConfigured &&
                      (0, pi_embedded_helpers_js_1.isFailoverErrorMessage)(errorText)
                    ) {
                      throw new failover_error_js_1.FailoverError(errorText, {
                        reason:
                          promptFailoverReason !== null && promptFailoverReason !== void 0
                            ? promptFailoverReason
                            : "unknown",
                        provider: provider,
                        model: modelId,
                        profileId: lastProfileId,
                        status: (0, failover_error_js_1.resolveFailoverStatus)(
                          promptFailoverReason !== null && promptFailoverReason !== void 0
                            ? promptFailoverReason
                            : "unknown",
                        ),
                      });
                    }
                    throw promptError;
                  case 20:
                    fallbackThinking = (0, pi_embedded_helpers_js_1.pickFallbackThinkingLevel)({
                      message:
                        lastAssistant === null || lastAssistant === void 0
                          ? void 0
                          : lastAssistant.errorMessage,
                      attempted: attemptedThinking,
                    });
                    if (fallbackThinking && !aborted) {
                      logger_js_1.log.warn(
                        "unsupported thinking level for "
                          .concat(provider, "/")
                          .concat(modelId, "; retrying with ")
                          .concat(fallbackThinking),
                      );
                      thinkLevel = fallbackThinking;
                      return [3 /*break*/, 10];
                    }
                    authFailure = (0, pi_embedded_helpers_js_1.isAuthAssistantError)(lastAssistant);
                    rateLimitFailure = (0, pi_embedded_helpers_js_1.isRateLimitAssistantError)(
                      lastAssistant,
                    );
                    failoverFailure = (0, pi_embedded_helpers_js_1.isFailoverAssistantError)(
                      lastAssistant,
                    );
                    assistantFailoverReason = (0, pi_embedded_helpers_js_1.classifyFailoverReason)(
                      (_q =
                        lastAssistant === null || lastAssistant === void 0
                          ? void 0
                          : lastAssistant.errorMessage) !== null && _q !== void 0
                        ? _q
                        : "",
                    );
                    cloudCodeAssistFormatError = attempt.cloudCodeAssistFormatError;
                    imageDimensionError = (0, pi_embedded_helpers_js_1.parseImageDimensionError)(
                      (_r =
                        lastAssistant === null || lastAssistant === void 0
                          ? void 0
                          : lastAssistant.errorMessage) !== null && _r !== void 0
                        ? _r
                        : "",
                    );
                    if (imageDimensionError && lastProfileId) {
                      details = [
                        imageDimensionError.messageIndex !== undefined
                          ? "message=".concat(imageDimensionError.messageIndex)
                          : null,
                        imageDimensionError.contentIndex !== undefined
                          ? "content=".concat(imageDimensionError.contentIndex)
                          : null,
                        imageDimensionError.maxDimensionPx !== undefined
                          ? "limit=".concat(imageDimensionError.maxDimensionPx, "px")
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" ");
                      logger_js_1.log.warn(
                        "Profile "
                          .concat(lastProfileId, " rejected image payload")
                          .concat(details ? " (".concat(details, ")") : "", "."),
                      );
                    }
                    shouldRotate = (!aborted && failoverFailure) || timedOut;
                    if (!shouldRotate) {
                      return [3 /*break*/, 24];
                    }
                    if (!lastProfileId) {
                      return [3 /*break*/, 22];
                    }
                    reason =
                      timedOut || assistantFailoverReason === "timeout"
                        ? "timeout"
                        : assistantFailoverReason !== null && assistantFailoverReason !== void 0
                          ? assistantFailoverReason
                          : "unknown";
                    return [
                      4 /*yield*/,
                      (0, auth_profiles_js_1.markAuthProfileFailure)({
                        store: authStore,
                        profileId: lastProfileId,
                        reason: reason,
                        cfg: params.config,
                        agentDir: params.agentDir,
                      }),
                    ];
                  case 21:
                    _y.sent();
                    if (timedOut && !isProbeSession) {
                      logger_js_1.log.warn(
                        "Profile ".concat(
                          lastProfileId,
                          " timed out (possible rate limit). Trying next account...",
                        ),
                      );
                    }
                    if (cloudCodeAssistFormatError) {
                      logger_js_1.log.warn(
                        "Profile ".concat(
                          lastProfileId,
                          " hit Cloud Code Assist format error. Tool calls will be sanitized on retry.",
                        ),
                      );
                    }
                    _y.label = 22;
                  case 22:
                    return [4 /*yield*/, advanceAuthProfile()];
                  case 23:
                    rotated = _y.sent();
                    if (rotated) {
                      return [3 /*break*/, 10];
                    }
                    if (fallbackConfigured) {
                      message =
                        (lastAssistant
                          ? (0, pi_embedded_helpers_js_1.formatAssistantErrorText)(lastAssistant, {
                              cfg: params.config,
                              sessionKey:
                                (_s = params.sessionKey) !== null && _s !== void 0
                                  ? _s
                                  : params.sessionId,
                            })
                          : undefined) ||
                        ((_t =
                          lastAssistant === null || lastAssistant === void 0
                            ? void 0
                            : lastAssistant.errorMessage) === null || _t === void 0
                          ? void 0
                          : _t.trim()) ||
                        (timedOut
                          ? "LLM request timed out."
                          : rateLimitFailure
                            ? "LLM request rate limited."
                            : authFailure
                              ? "LLM request unauthorized."
                              : "LLM request failed.");
                      status_1 =
                        (_u = (0, failover_error_js_1.resolveFailoverStatus)(
                          assistantFailoverReason !== null && assistantFailoverReason !== void 0
                            ? assistantFailoverReason
                            : "unknown",
                        )) !== null && _u !== void 0
                          ? _u
                          : (0, pi_embedded_helpers_js_1.isTimeoutErrorMessage)(message)
                            ? 408
                            : undefined;
                      throw new failover_error_js_1.FailoverError(message, {
                        reason:
                          assistantFailoverReason !== null && assistantFailoverReason !== void 0
                            ? assistantFailoverReason
                            : "unknown",
                        provider: provider,
                        model: modelId,
                        profileId: lastProfileId,
                        status: status_1,
                      });
                    }
                    _y.label = 24;
                  case 24:
                    usage = (0, usage_js_1.normalizeUsage)(
                      lastAssistant === null || lastAssistant === void 0
                        ? void 0
                        : lastAssistant.usage,
                    );
                    agentMeta = {
                      sessionId: sessionIdUsed,
                      provider:
                        (_v =
                          lastAssistant === null || lastAssistant === void 0
                            ? void 0
                            : lastAssistant.provider) !== null && _v !== void 0
                          ? _v
                          : provider,
                      model:
                        (_w =
                          lastAssistant === null || lastAssistant === void 0
                            ? void 0
                            : lastAssistant.model) !== null && _w !== void 0
                          ? _w
                          : model.id,
                      usage: usage,
                    };
                    payloads = (0, payloads_js_1.buildEmbeddedRunPayloads)({
                      assistantTexts: attempt.assistantTexts,
                      toolMetas: attempt.toolMetas,
                      lastAssistant: attempt.lastAssistant,
                      lastToolError: attempt.lastToolError,
                      config: params.config,
                      sessionKey:
                        (_x = params.sessionKey) !== null && _x !== void 0 ? _x : params.sessionId,
                      verboseLevel: params.verboseLevel,
                      reasoningLevel: params.reasoningLevel,
                      toolResultFormat: resolvedToolResultFormat,
                      inlineToolResultsAllowed: false,
                    });
                    logger_js_1.log.debug(
                      "embedded run done: runId="
                        .concat(params.runId, " sessionId=")
                        .concat(params.sessionId, " durationMs=")
                        .concat(Date.now() - started, " aborted=")
                        .concat(aborted),
                    );
                    if (!lastProfileId) {
                      return [3 /*break*/, 27];
                    }
                    return [
                      4 /*yield*/,
                      (0, auth_profiles_js_1.markAuthProfileGood)({
                        store: authStore,
                        provider: provider,
                        profileId: lastProfileId,
                        agentDir: params.agentDir,
                      }),
                    ];
                  case 25:
                    _y.sent();
                    return [
                      4 /*yield*/,
                      (0, auth_profiles_js_1.markAuthProfileUsed)({
                        store: authStore,
                        profileId: lastProfileId,
                        agentDir: params.agentDir,
                      }),
                    ];
                  case 26:
                    _y.sent();
                    _y.label = 27;
                  case 27:
                    return [
                      2 /*return*/,
                      {
                        payloads: payloads.length ? payloads : undefined,
                        meta: {
                          durationMs: Date.now() - started,
                          agentMeta: agentMeta,
                          aborted: aborted,
                          systemPromptReport: attempt.systemPromptReport,
                          // Handle client tool calls (OpenResponses hosted tools)
                          stopReason: attempt.clientToolCall ? "tool_calls" : undefined,
                          pendingToolCalls: attempt.clientToolCall
                            ? [
                                {
                                  id: "call_".concat(Date.now()),
                                  name: attempt.clientToolCall.name,
                                  arguments: JSON.stringify(attempt.clientToolCall.params),
                                },
                              ]
                            : undefined,
                        },
                        didSendViaMessagingTool: attempt.didSendViaMessagingTool,
                        messagingToolSentTexts: attempt.messagingToolSentTexts,
                        messagingToolSentTargets: attempt.messagingToolSentTargets,
                      },
                    ];
                  case 28:
                    return [3 /*break*/, 30];
                  case 29:
                    process.chdir(prevCwd);
                    return [7 /*endfinally*/];
                  case 30:
                    return [2 /*return*/];
                }
              });
            });
          });
        }),
      ];
    });
  });
}
