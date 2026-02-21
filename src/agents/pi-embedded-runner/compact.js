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
exports.compactEmbeddedPiSessionDirect = compactEmbeddedPiSessionDirect;
exports.compactEmbeddedPiSession = compactEmbeddedPiSession;
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var pi_coding_agent_1 = require("@mariozechner/pi-coding-agent");
var heartbeat_js_1 = require("../../auto-reply/heartbeat.js");
var channel_tools_js_1 = require("../channel-tools.js");
var channel_capabilities_js_1 = require("../../config/channel-capabilities.js");
var machine_name_js_1 = require("../../infra/machine-name.js");
var inline_buttons_js_1 = require("../../telegram/inline-buttons.js");
var reaction_level_js_1 = require("../../telegram/reaction-level.js");
var reaction_level_js_2 = require("../../signal/reaction-level.js");
var command_queue_js_1 = require("../../process/command-queue.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var session_key_js_1 = require("../../routing/session-key.js");
var provider_utils_js_1 = require("../../utils/provider-utils.js");
var utils_js_1 = require("../../utils.js");
var agent_paths_js_1 = require("../agent-paths.js");
var agent_scope_js_1 = require("../agent-scope.js");
var bootstrap_files_js_1 = require("../bootstrap-files.js");
var docs_path_js_1 = require("../docs-path.js");
var defaults_js_1 = require("../defaults.js");
var model_auth_js_1 = require("../model-auth.js");
var models_config_js_1 = require("../models-config.js");
var pi_embedded_helpers_js_1 = require("../pi-embedded-helpers.js");
var pi_settings_js_1 = require("../pi-settings.js");
var pi_tools_js_1 = require("../pi-tools.js");
var sandbox_js_1 = require("../sandbox.js");
var session_tool_result_guard_wrapper_js_1 = require("../session-tool-result-guard-wrapper.js");
var transcript_policy_js_1 = require("../transcript-policy.js");
var session_write_lock_js_1 = require("../session-write-lock.js");
var skills_js_1 = require("../skills.js");
var extensions_js_1 = require("./extensions.js");
var google_js_1 = require("./google.js");
var history_js_1 = require("./history.js");
var lanes_js_1 = require("./lanes.js");
var logger_js_1 = require("./logger.js");
var model_js_1 = require("./model.js");
var sandbox_info_js_1 = require("./sandbox-info.js");
var session_manager_cache_js_1 = require("./session-manager-cache.js");
var system_prompt_js_1 = require("./system-prompt.js");
var tool_split_js_1 = require("./tool-split.js");
var date_time_js_1 = require("../date-time.js");
var utils_js_2 = require("./utils.js");
var tts_js_1 = require("../../tts/tts.js");
/**
 * Core compaction logic without lane queueing.
 * Use this when already inside a session/global lane to avoid deadlocks.
 */
function compactEmbeddedPiSessionDirect(params) {
  return __awaiter(this, void 0, void 0, function () {
    var resolvedWorkspace,
      prevCwd,
      provider,
      modelId,
      agentDir,
      _a,
      model,
      error,
      authStorage,
      modelRegistry,
      apiKeyInfo,
      resolveCopilotApiToken,
      copilotToken,
      err_1,
      sandboxSessionKey,
      sandbox,
      effectiveWorkspace,
      restoreSkillEnv,
      shouldLoadSkillEntries,
      skillEntries,
      skillsPrompt,
      sessionLabel,
      contextFiles,
      runAbortController,
      toolsRaw,
      tools,
      machineName,
      runtimeChannel_1,
      runtimeCapabilities,
      inlineButtonsScope,
      reactionGuidance,
      channelActions,
      messageToolHints,
      runtimeInfo,
      sandboxInfo,
      reasoningTagHint,
      userTimezone,
      userTimeFormat,
      userTime,
      _b,
      defaultAgentId,
      sessionAgentId,
      isDefaultAgent,
      promptMode,
      docsPath,
      ttsHint,
      appendPrompt,
      systemPrompt,
      sessionLock,
      transcriptPolicy,
      sessionManager,
      settingsManager,
      additionalExtensionPaths,
      _c,
      builtInTools,
      customTools,
      session,
      prior,
      validatedGemini,
      validated,
      limited,
      result,
      tokensAfter,
      _i,
      _d,
      message,
      err_2;
    var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    return __generator(this, function (_2) {
      switch (_2.label) {
        case 0:
          resolvedWorkspace = (0, utils_js_1.resolveUserPath)(params.workspaceDir);
          prevCwd = process.cwd();
          provider =
            ((_e = params.provider) !== null && _e !== void 0
              ? _e
              : defaults_js_1.DEFAULT_PROVIDER
            ).trim() || defaults_js_1.DEFAULT_PROVIDER;
          modelId =
            ((_f = params.model) !== null && _f !== void 0
              ? _f
              : defaults_js_1.DEFAULT_MODEL
            ).trim() || defaults_js_1.DEFAULT_MODEL;
          agentDir =
            (_g = params.agentDir) !== null && _g !== void 0
              ? _g
              : (0, agent_paths_js_1.resolveOpenClawAgentDir)();
          return [
            4 /*yield*/,
            (0, models_config_js_1.ensureOpenClawModelsJson)(params.config, agentDir),
          ];
        case 1:
          _2.sent();
          ((_a = (0, model_js_1.resolveModel)(provider, modelId, agentDir, params.config)),
            (model = _a.model),
            (error = _a.error),
            (authStorage = _a.authStorage),
            (modelRegistry = _a.modelRegistry));
          if (!model) {
            return [
              2 /*return*/,
              {
                ok: false,
                compacted: false,
                reason:
                  error !== null && error !== void 0
                    ? error
                    : "Unknown model: ".concat(provider, "/").concat(modelId),
              },
            ];
          }
          _2.label = 2;
        case 2:
          _2.trys.push([2, 9, , 10]);
          return [
            4 /*yield*/,
            (0, model_auth_js_1.getApiKeyForModel)({
              model: model,
              cfg: params.config,
              profileId: params.authProfileId,
              agentDir: agentDir,
            }),
          ];
        case 3:
          apiKeyInfo = _2.sent();
          if (!!apiKeyInfo.apiKey) {
            return [3 /*break*/, 4];
          }
          if (apiKeyInfo.mode !== "aws-sdk") {
            throw new Error(
              'No API key resolved for provider "'
                .concat(model.provider, '" (auth mode: ')
                .concat(apiKeyInfo.mode, ")."),
            );
          }
          return [3 /*break*/, 8];
        case 4:
          if (!(model.provider === "github-copilot")) {
            return [3 /*break*/, 7];
          }
          return [
            4 /*yield*/,
            Promise.resolve().then(function () {
              return require("../../providers/github-copilot-token.js");
            }),
          ];
        case 5:
          resolveCopilotApiToken = _2.sent().resolveCopilotApiToken;
          return [
            4 /*yield*/,
            resolveCopilotApiToken({
              githubToken: apiKeyInfo.apiKey,
            }),
          ];
        case 6:
          copilotToken = _2.sent();
          authStorage.setRuntimeApiKey(model.provider, copilotToken.token);
          return [3 /*break*/, 8];
        case 7:
          authStorage.setRuntimeApiKey(model.provider, apiKeyInfo.apiKey);
          _2.label = 8;
        case 8:
          return [3 /*break*/, 10];
        case 9:
          err_1 = _2.sent();
          return [
            2 /*return*/,
            {
              ok: false,
              compacted: false,
              reason: (0, utils_js_2.describeUnknownError)(err_1),
            },
          ];
        case 10:
          return [4 /*yield*/, promises_1.default.mkdir(resolvedWorkspace, { recursive: true })];
        case 11:
          _2.sent();
          sandboxSessionKey =
            ((_h = params.sessionKey) === null || _h === void 0 ? void 0 : _h.trim()) ||
            params.sessionId;
          return [
            4 /*yield*/,
            (0, sandbox_js_1.resolveSandboxContext)({
              config: params.config,
              sessionKey: sandboxSessionKey,
              workspaceDir: resolvedWorkspace,
            }),
          ];
        case 12:
          sandbox = _2.sent();
          effectiveWorkspace = (sandbox === null || sandbox === void 0 ? void 0 : sandbox.enabled)
            ? sandbox.workspaceAccess === "rw"
              ? resolvedWorkspace
              : sandbox.workspaceDir
            : resolvedWorkspace;
          return [4 /*yield*/, promises_1.default.mkdir(effectiveWorkspace, { recursive: true })];
        case 13:
          _2.sent();
          return [
            4 /*yield*/,
            (0, pi_embedded_helpers_js_1.ensureSessionHeader)({
              sessionFile: params.sessionFile,
              sessionId: params.sessionId,
              cwd: effectiveWorkspace,
            }),
          ];
        case 14:
          _2.sent();
          process.chdir(effectiveWorkspace);
          _2.label = 15;
        case 15:
          _2.trys.push([15, 31, 32, 33]);
          shouldLoadSkillEntries = !params.skillsSnapshot || !params.skillsSnapshot.resolvedSkills;
          skillEntries = shouldLoadSkillEntries
            ? (0, skills_js_1.loadWorkspaceSkillEntries)(effectiveWorkspace)
            : [];
          restoreSkillEnv = params.skillsSnapshot
            ? (0, skills_js_1.applySkillEnvOverridesFromSnapshot)({
                snapshot: params.skillsSnapshot,
                config: params.config,
              })
            : (0, skills_js_1.applySkillEnvOverrides)({
                skills: skillEntries !== null && skillEntries !== void 0 ? skillEntries : [],
                config: params.config,
              });
          skillsPrompt = (0, skills_js_1.resolveSkillsPromptForRun)({
            skillsSnapshot: params.skillsSnapshot,
            entries: shouldLoadSkillEntries ? skillEntries : undefined,
            config: params.config,
            workspaceDir: effectiveWorkspace,
          });
          sessionLabel = (_j = params.sessionKey) !== null && _j !== void 0 ? _j : params.sessionId;
          return [
            4 /*yield*/,
            (0, bootstrap_files_js_1.resolveBootstrapContextForRun)({
              workspaceDir: effectiveWorkspace,
              config: params.config,
              sessionKey: params.sessionKey,
              sessionId: params.sessionId,
              warn: (0, bootstrap_files_js_1.makeBootstrapWarn)({
                sessionLabel: sessionLabel,
                warn: function (message) {
                  return logger_js_1.log.warn(message);
                },
              }),
            }),
          ];
        case 16:
          contextFiles = _2.sent().contextFiles;
          runAbortController = new AbortController();
          toolsRaw = (0, pi_tools_js_1.createOpenClawCodingTools)({
            exec: __assign(__assign({}, (0, utils_js_2.resolveExecToolDefaults)(params.config)), {
              elevated: params.bashElevated,
            }),
            sandbox: sandbox,
            messageProvider:
              (_k = params.messageChannel) !== null && _k !== void 0 ? _k : params.messageProvider,
            agentAccountId: params.agentAccountId,
            sessionKey: (_l = params.sessionKey) !== null && _l !== void 0 ? _l : params.sessionId,
            groupId: params.groupId,
            groupChannel: params.groupChannel,
            groupSpace: params.groupSpace,
            spawnedBy: params.spawnedBy,
            agentDir: agentDir,
            workspaceDir: effectiveWorkspace,
            config: params.config,
            abortSignal: runAbortController.signal,
            modelProvider: model.provider,
            modelId: modelId,
            modelAuthMode: (0, model_auth_js_1.resolveModelAuthMode)(model.provider, params.config),
          });
          tools = (0, google_js_1.sanitizeToolsForGoogle)({ tools: toolsRaw, provider: provider });
          (0, google_js_1.logToolSchemasForGoogle)({ tools: tools, provider: provider });
          return [4 /*yield*/, (0, machine_name_js_1.getMachineDisplayName)()];
        case 17:
          machineName = _2.sent();
          runtimeChannel_1 = (0, message_channel_js_1.normalizeMessageChannel)(
            (_m = params.messageChannel) !== null && _m !== void 0 ? _m : params.messageProvider,
          );
          runtimeCapabilities = runtimeChannel_1
            ? (_o = (0, channel_capabilities_js_1.resolveChannelCapabilities)({
                cfg: params.config,
                channel: runtimeChannel_1,
                accountId: params.agentAccountId,
              })) !== null && _o !== void 0
              ? _o
              : []
            : undefined;
          if (runtimeChannel_1 === "telegram" && params.config) {
            inlineButtonsScope = (0, inline_buttons_js_1.resolveTelegramInlineButtonsScope)({
              cfg: params.config,
              accountId: (_p = params.agentAccountId) !== null && _p !== void 0 ? _p : undefined,
            });
            if (inlineButtonsScope !== "off") {
              if (!runtimeCapabilities) {
                runtimeCapabilities = [];
              }
              if (
                !runtimeCapabilities.some(function (cap) {
                  return String(cap).trim().toLowerCase() === "inlinebuttons";
                })
              ) {
                runtimeCapabilities.push("inlineButtons");
              }
            }
          }
          reactionGuidance =
            runtimeChannel_1 && params.config
              ? (function () {
                  var _a, _b;
                  if (runtimeChannel_1 === "telegram") {
                    var resolved = (0, reaction_level_js_1.resolveTelegramReactionLevel)({
                      cfg: params.config,
                      accountId:
                        (_a = params.agentAccountId) !== null && _a !== void 0 ? _a : undefined,
                    });
                    var level = resolved.agentReactionGuidance;
                    return level ? { level: level, channel: "Telegram" } : undefined;
                  }
                  if (runtimeChannel_1 === "signal") {
                    var resolved = (0, reaction_level_js_2.resolveSignalReactionLevel)({
                      cfg: params.config,
                      accountId:
                        (_b = params.agentAccountId) !== null && _b !== void 0 ? _b : undefined,
                    });
                    var level = resolved.agentReactionGuidance;
                    return level ? { level: level, channel: "Signal" } : undefined;
                  }
                  return undefined;
                })()
              : undefined;
          channelActions = runtimeChannel_1
            ? (0, channel_tools_js_1.listChannelSupportedActions)({
                cfg: params.config,
                channel: runtimeChannel_1,
              })
            : undefined;
          messageToolHints = runtimeChannel_1
            ? (0, channel_tools_js_1.resolveChannelMessageToolHints)({
                cfg: params.config,
                channel: runtimeChannel_1,
                accountId: params.agentAccountId,
              })
            : undefined;
          runtimeInfo = {
            host: machineName,
            os: "".concat(node_os_1.default.type(), " ").concat(node_os_1.default.release()),
            arch: node_os_1.default.arch(),
            node: process.version,
            model: "".concat(provider, "/").concat(modelId),
            channel: runtimeChannel_1,
            capabilities: runtimeCapabilities,
            channelActions: channelActions,
          };
          sandboxInfo = (0, sandbox_info_js_1.buildEmbeddedSandboxInfo)(
            sandbox,
            params.bashElevated,
          );
          reasoningTagHint = (0, provider_utils_js_1.isReasoningTagProvider)(provider);
          userTimezone = (0, date_time_js_1.resolveUserTimezone)(
            (_s =
              (_r = (_q = params.config) === null || _q === void 0 ? void 0 : _q.agents) === null ||
              _r === void 0
                ? void 0
                : _r.defaults) === null || _s === void 0
              ? void 0
              : _s.userTimezone,
          );
          userTimeFormat = (0, date_time_js_1.resolveUserTimeFormat)(
            (_v =
              (_u = (_t = params.config) === null || _t === void 0 ? void 0 : _t.agents) === null ||
              _u === void 0
                ? void 0
                : _u.defaults) === null || _v === void 0
              ? void 0
              : _v.timeFormat,
          );
          userTime = (0, date_time_js_1.formatUserTime)(new Date(), userTimezone, userTimeFormat);
          ((_b = (0, agent_scope_js_1.resolveSessionAgentIds)({
            sessionKey: params.sessionKey,
            config: params.config,
          })),
            (defaultAgentId = _b.defaultAgentId),
            (sessionAgentId = _b.sessionAgentId));
          isDefaultAgent = sessionAgentId === defaultAgentId;
          promptMode = (0, session_key_js_1.isSubagentSessionKey)(params.sessionKey)
            ? "minimal"
            : "full";
          return [
            4 /*yield*/,
            (0, docs_path_js_1.resolveOpenClawDocsPath)({
              workspaceDir: effectiveWorkspace,
              argv1: process.argv[1],
              cwd: process.cwd(),
              moduleUrl: import.meta.url,
            }),
          ];
        case 18:
          docsPath = _2.sent();
          ttsHint = params.config
            ? (0, tts_js_1.buildTtsSystemPromptHint)(params.config)
            : undefined;
          appendPrompt = (0, system_prompt_js_1.buildEmbeddedSystemPrompt)({
            workspaceDir: effectiveWorkspace,
            defaultThinkLevel: params.thinkLevel,
            reasoningLevel: (_w = params.reasoningLevel) !== null && _w !== void 0 ? _w : "off",
            extraSystemPrompt: params.extraSystemPrompt,
            ownerNumbers: params.ownerNumbers,
            reasoningTagHint: reasoningTagHint,
            heartbeatPrompt: isDefaultAgent
              ? (0, heartbeat_js_1.resolveHeartbeatPrompt)(
                  (_0 =
                    (_z =
                      (_y = (_x = params.config) === null || _x === void 0 ? void 0 : _x.agents) ===
                        null || _y === void 0
                        ? void 0
                        : _y.defaults) === null || _z === void 0
                      ? void 0
                      : _z.heartbeat) === null || _0 === void 0
                    ? void 0
                    : _0.prompt,
                )
              : undefined,
            skillsPrompt: skillsPrompt,
            docsPath: docsPath !== null && docsPath !== void 0 ? docsPath : undefined,
            ttsHint: ttsHint,
            promptMode: promptMode,
            runtimeInfo: runtimeInfo,
            reactionGuidance: reactionGuidance,
            messageToolHints: messageToolHints,
            sandboxInfo: sandboxInfo,
            tools: tools,
            modelAliasLines: (0, model_js_1.buildModelAliasLines)(params.config),
            userTimezone: userTimezone,
            userTime: userTime,
            userTimeFormat: userTimeFormat,
            contextFiles: contextFiles,
          });
          systemPrompt = (0, system_prompt_js_1.createSystemPromptOverride)(appendPrompt);
          return [
            4 /*yield*/,
            (0, session_write_lock_js_1.acquireSessionWriteLock)({
              sessionFile: params.sessionFile,
            }),
          ];
        case 19:
          sessionLock = _2.sent();
          _2.label = 20;
        case 20:
          _2.trys.push([20, , 28, 30]);
          return [
            4 /*yield*/,
            (0, session_manager_cache_js_1.prewarmSessionFile)(params.sessionFile),
          ];
        case 21:
          _2.sent();
          transcriptPolicy = (0, transcript_policy_js_1.resolveTranscriptPolicy)({
            modelApi: model.api,
            provider: provider,
            modelId: modelId,
          });
          sessionManager = (0, session_tool_result_guard_wrapper_js_1.guardSessionManager)(
            pi_coding_agent_1.SessionManager.open(params.sessionFile),
            {
              agentId: sessionAgentId,
              sessionKey: params.sessionKey,
              allowSyntheticToolResults: transcriptPolicy.allowSyntheticToolResults,
            },
          );
          (0, session_manager_cache_js_1.trackSessionManagerAccess)(params.sessionFile);
          settingsManager = pi_coding_agent_1.SettingsManager.create(effectiveWorkspace, agentDir);
          (0, pi_settings_js_1.ensurePiCompactionReserveTokens)({
            settingsManager: settingsManager,
            minReserveTokens: (0, pi_settings_js_1.resolveCompactionReserveTokensFloor)(
              params.config,
            ),
          });
          additionalExtensionPaths = (0, extensions_js_1.buildEmbeddedExtensionPaths)({
            cfg: params.config,
            sessionManager: sessionManager,
            provider: provider,
            modelId: modelId,
            model: model,
          });
          ((_c = (0, tool_split_js_1.splitSdkTools)({
            tools: tools,
            sandboxEnabled: !!(sandbox === null || sandbox === void 0 ? void 0 : sandbox.enabled),
          })),
            (builtInTools = _c.builtInTools),
            (customTools = _c.customTools));
          session = void 0;
          return [
            4 /*yield*/,
            (0, pi_coding_agent_1.createAgentSession)({
              cwd: resolvedWorkspace,
              agentDir: agentDir,
              authStorage: authStorage,
              modelRegistry: modelRegistry,
              model: model,
              thinkingLevel: (0, utils_js_2.mapThinkingLevel)(params.thinkLevel),
              systemPrompt: systemPrompt,
              tools: builtInTools,
              customTools: customTools,
              sessionManager: sessionManager,
              settingsManager: settingsManager,
              skills: [],
              contextFiles: [],
              additionalExtensionPaths: additionalExtensionPaths,
            }),
          ];
        case 22:
          session = _2.sent().session;
          _2.label = 23;
        case 23:
          _2.trys.push([23, , 26, 27]);
          return [
            4 /*yield*/,
            (0, google_js_1.sanitizeSessionHistory)({
              messages: session.messages,
              modelApi: model.api,
              modelId: modelId,
              provider: provider,
              sessionManager: sessionManager,
              sessionId: params.sessionId,
              policy: transcriptPolicy,
            }),
          ];
        case 24:
          prior = _2.sent();
          validatedGemini = transcriptPolicy.validateGeminiTurns
            ? (0, pi_embedded_helpers_js_1.validateGeminiTurns)(prior)
            : prior;
          validated = transcriptPolicy.validateAnthropicTurns
            ? (0, pi_embedded_helpers_js_1.validateAnthropicTurns)(validatedGemini)
            : validatedGemini;
          limited = (0, history_js_1.limitHistoryTurns)(
            validated,
            (0, history_js_1.getDmHistoryLimitFromSessionKey)(params.sessionKey, params.config),
          );
          if (limited.length > 0) {
            session.agent.replaceMessages(limited);
          }
          return [4 /*yield*/, session.compact(params.customInstructions)];
        case 25:
          result = _2.sent();
          tokensAfter = void 0;
          try {
            tokensAfter = 0;
            for (_i = 0, _d = session.messages; _i < _d.length; _i++) {
              message = _d[_i];
              tokensAfter += (0, pi_coding_agent_1.estimateTokens)(message);
            }
            // Sanity check: tokensAfter should be less than tokensBefore
            if (tokensAfter > result.tokensBefore) {
              tokensAfter = undefined; // Don't trust the estimate
            }
          } catch (_3) {
            // If estimation fails, leave tokensAfter undefined
            tokensAfter = undefined;
          }
          return [
            2 /*return*/,
            {
              ok: true,
              compacted: true,
              result: {
                summary: result.summary,
                firstKeptEntryId: result.firstKeptEntryId,
                tokensBefore: result.tokensBefore,
                tokensAfter: tokensAfter,
                details: result.details,
              },
            },
          ];
        case 26:
          (_1 = sessionManager.flushPendingToolResults) === null || _1 === void 0
            ? void 0
            : _1.call(sessionManager);
          session.dispose();
          return [7 /*endfinally*/];
        case 27:
          return [3 /*break*/, 30];
        case 28:
          return [4 /*yield*/, sessionLock.release()];
        case 29:
          _2.sent();
          return [7 /*endfinally*/];
        case 30:
          return [3 /*break*/, 33];
        case 31:
          err_2 = _2.sent();
          return [
            2 /*return*/,
            {
              ok: false,
              compacted: false,
              reason: (0, utils_js_2.describeUnknownError)(err_2),
            },
          ];
        case 32:
          restoreSkillEnv === null || restoreSkillEnv === void 0 ? void 0 : restoreSkillEnv();
          process.chdir(prevCwd);
          return [7 /*endfinally*/];
        case 33:
          return [2 /*return*/];
      }
    });
  });
}
/**
 * Compacts a session with lane queueing (session lane + global lane).
 * Use this from outside a lane context. If already inside a lane, use
 * `compactEmbeddedPiSessionDirect` to avoid deadlocks.
 */
function compactEmbeddedPiSession(params) {
  return __awaiter(this, void 0, void 0, function () {
    var sessionLane, globalLane, enqueueGlobal;
    var _this = this;
    var _a, _b;
    return __generator(this, function (_c) {
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
      return [
        2 /*return*/,
        (0, command_queue_js_1.enqueueCommandInLane)(sessionLane, function () {
          return enqueueGlobal(function () {
            return __awaiter(_this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                return [2 /*return*/, compactEmbeddedPiSessionDirect(params)];
              });
            });
          });
        }),
      ];
    });
  });
}
