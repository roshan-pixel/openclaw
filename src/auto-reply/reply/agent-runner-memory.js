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
exports.runMemoryFlushIfNeeded = runMemoryFlushIfNeeded;
var node_crypto_1 = require("node:crypto");
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var model_fallback_js_1 = require("../../agents/model-fallback.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var pi_embedded_js_1 = require("../../agents/pi-embedded.js");
var sandbox_js_1 = require("../../agents/sandbox.js");
var sessions_js_1 = require("../../config/sessions.js");
var globals_js_1 = require("../../globals.js");
var agent_events_js_1 = require("../../infra/agent-events.js");
var agent_runner_utils_js_1 = require("./agent-runner-utils.js");
var memory_flush_js_1 = require("./memory-flush.js");
var session_updates_js_1 = require("./session-updates.js");
function runMemoryFlushIfNeeded(params) {
  return __awaiter(this, void 0, void 0, function () {
    var memoryFlushSettings,
      memoryFlushWritable,
      shouldFlushMemory,
      activeSessionEntry,
      activeSessionStore,
      flushRunId,
      memoryCompactionCompleted,
      flushSystemPrompt,
      memoryFlushCompactionCount_1,
      nextCount,
      updatedEntry,
      err_1,
      err_2;
    var _this = this;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          memoryFlushSettings = (0, memory_flush_js_1.resolveMemoryFlushSettings)(params.cfg);
          if (!memoryFlushSettings) {
            return [2 /*return*/, params.sessionEntry];
          }
          memoryFlushWritable = (function () {
            if (!params.sessionKey) {
              return true;
            }
            var runtime = (0, sandbox_js_1.resolveSandboxRuntimeStatus)({
              cfg: params.cfg,
              sessionKey: params.sessionKey,
            });
            if (!runtime.sandboxed) {
              return true;
            }
            var sandboxCfg = (0, sandbox_js_1.resolveSandboxConfigForAgent)(
              params.cfg,
              runtime.agentId,
            );
            return sandboxCfg.workspaceAccess === "rw";
          })();
          shouldFlushMemory =
            memoryFlushSettings &&
            memoryFlushWritable &&
            !params.isHeartbeat &&
            !(0, model_selection_js_1.isCliProvider)(params.followupRun.run.provider, params.cfg) &&
            (0, memory_flush_js_1.shouldRunMemoryFlush)({
              entry:
                (_a = params.sessionEntry) !== null && _a !== void 0
                  ? _a
                  : params.sessionKey
                    ? (_b = params.sessionStore) === null || _b === void 0
                      ? void 0
                      : _b[params.sessionKey]
                    : undefined,
              contextWindowTokens: (0, memory_flush_js_1.resolveMemoryFlushContextWindowTokens)({
                modelId:
                  (_c = params.followupRun.run.model) !== null && _c !== void 0
                    ? _c
                    : params.defaultModel,
                agentCfgContextTokens: params.agentCfgContextTokens,
              }),
              reserveTokensFloor: memoryFlushSettings.reserveTokensFloor,
              softThresholdTokens: memoryFlushSettings.softThresholdTokens,
            });
          if (!shouldFlushMemory) {
            return [2 /*return*/, params.sessionEntry];
          }
          activeSessionEntry = params.sessionEntry;
          activeSessionStore = params.sessionStore;
          flushRunId = node_crypto_1.default.randomUUID();
          if (params.sessionKey) {
            (0, agent_events_js_1.registerAgentRunContext)(flushRunId, {
              sessionKey: params.sessionKey,
              verboseLevel: params.resolvedVerboseLevel,
            });
          }
          memoryCompactionCompleted = false;
          flushSystemPrompt = [
            params.followupRun.run.extraSystemPrompt,
            memoryFlushSettings.systemPrompt,
          ]
            .filter(Boolean)
            .join("\n\n");
          _g.label = 1;
        case 1:
          _g.trys.push([1, 9, , 10]);
          return [
            4 /*yield*/,
            (0, model_fallback_js_1.runWithModelFallback)({
              cfg: params.followupRun.run.config,
              provider: params.followupRun.run.provider,
              model: params.followupRun.run.model,
              agentDir: params.followupRun.run.agentDir,
              fallbacksOverride: (0, agent_scope_js_1.resolveAgentModelFallbacksOverride)(
                params.followupRun.run.config,
                (0, sessions_js_1.resolveAgentIdFromSessionKey)(params.followupRun.run.sessionKey),
              ),
              run: function (provider, model) {
                var _a, _b, _c, _d, _e, _f, _g, _h;
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
                          ((_a = params.sessionCtx.Provider) === null || _a === void 0
                            ? void 0
                            : _a.trim().toLowerCase()) || undefined,
                        agentAccountId: params.sessionCtx.AccountId,
                        messageTo:
                          (_b = params.sessionCtx.OriginatingTo) !== null && _b !== void 0
                            ? _b
                            : params.sessionCtx.To,
                        messageThreadId:
                          (_c = params.sessionCtx.MessageThreadId) !== null && _c !== void 0
                            ? _c
                            : undefined,
                      },
                      (0, agent_runner_utils_js_1.buildThreadingToolContext)({
                        sessionCtx: params.sessionCtx,
                        config: params.followupRun.run.config,
                        hasRepliedRef:
                          (_d = params.opts) === null || _d === void 0 ? void 0 : _d.hasRepliedRef,
                      }),
                    ),
                    {
                      senderId:
                        ((_e = params.sessionCtx.SenderId) === null || _e === void 0
                          ? void 0
                          : _e.trim()) || undefined,
                      senderName:
                        ((_f = params.sessionCtx.SenderName) === null || _f === void 0
                          ? void 0
                          : _f.trim()) || undefined,
                      senderUsername:
                        ((_g = params.sessionCtx.SenderUsername) === null || _g === void 0
                          ? void 0
                          : _g.trim()) || undefined,
                      senderE164:
                        ((_h = params.sessionCtx.SenderE164) === null || _h === void 0
                          ? void 0
                          : _h.trim()) || undefined,
                      sessionFile: params.followupRun.run.sessionFile,
                      workspaceDir: params.followupRun.run.workspaceDir,
                      agentDir: params.followupRun.run.agentDir,
                      config: params.followupRun.run.config,
                      skillsSnapshot: params.followupRun.run.skillsSnapshot,
                      prompt: memoryFlushSettings.prompt,
                      extraSystemPrompt: flushSystemPrompt,
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
                      bashElevated: params.followupRun.run.bashElevated,
                      timeoutMs: params.followupRun.run.timeoutMs,
                      runId: flushRunId,
                      onAgentEvent: function (evt) {
                        if (evt.stream === "compaction") {
                          var phase = typeof evt.data.phase === "string" ? evt.data.phase : "";
                          var willRetry = Boolean(evt.data.willRetry);
                          if (phase === "end" && !willRetry) {
                            memoryCompactionCompleted = true;
                          }
                        }
                      },
                    },
                  ),
                );
              },
            }),
          ];
        case 2:
          _g.sent();
          memoryFlushCompactionCount_1 =
            (_f =
              (_d =
                activeSessionEntry === null || activeSessionEntry === void 0
                  ? void 0
                  : activeSessionEntry.compactionCount) !== null && _d !== void 0
                ? _d
                : params.sessionKey
                  ? (_e =
                      activeSessionStore === null || activeSessionStore === void 0
                        ? void 0
                        : activeSessionStore[params.sessionKey]) === null || _e === void 0
                    ? void 0
                    : _e.compactionCount
                  : 0) !== null && _f !== void 0
              ? _f
              : 0;
          if (!memoryCompactionCompleted) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            (0, session_updates_js_1.incrementCompactionCount)({
              sessionEntry: activeSessionEntry,
              sessionStore: activeSessionStore,
              sessionKey: params.sessionKey,
              storePath: params.storePath,
            }),
          ];
        case 3:
          nextCount = _g.sent();
          if (typeof nextCount === "number") {
            memoryFlushCompactionCount_1 = nextCount;
          }
          _g.label = 4;
        case 4:
          if (!(params.storePath && params.sessionKey)) {
            return [3 /*break*/, 8];
          }
          _g.label = 5;
        case 5:
          _g.trys.push([5, 7, , 8]);
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStoreEntry)({
              storePath: params.storePath,
              sessionKey: params.sessionKey,
              update: function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    return [
                      2 /*return*/,
                      {
                        memoryFlushAt: Date.now(),
                        memoryFlushCompactionCount: memoryFlushCompactionCount_1,
                      },
                    ];
                  });
                });
              },
            }),
          ];
        case 6:
          updatedEntry = _g.sent();
          if (updatedEntry) {
            activeSessionEntry = updatedEntry;
          }
          return [3 /*break*/, 8];
        case 7:
          err_1 = _g.sent();
          (0, globals_js_1.logVerbose)(
            "failed to persist memory flush metadata: ".concat(String(err_1)),
          );
          return [3 /*break*/, 8];
        case 8:
          return [3 /*break*/, 10];
        case 9:
          err_2 = _g.sent();
          (0, globals_js_1.logVerbose)("memory flush run failed: ".concat(String(err_2)));
          return [3 /*break*/, 10];
        case 10:
          return [2 /*return*/, activeSessionEntry];
      }
    });
  });
}
