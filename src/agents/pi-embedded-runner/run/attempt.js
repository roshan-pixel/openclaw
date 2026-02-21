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
exports.injectHistoryImagesIntoMessages = injectHistoryImagesIntoMessages;
exports.runEmbeddedAttempt = runEmbeddedAttempt;
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var pi_ai_1 = require("@mariozechner/pi-ai");
var pi_coding_agent_1 = require("@mariozechner/pi-coding-agent");
var heartbeat_js_1 = require("../../../auto-reply/heartbeat.js");
var channel_tools_js_1 = require("../../channel-tools.js");
var channel_capabilities_js_1 = require("../../../config/channel-capabilities.js");
var machine_name_js_1 = require("../../../infra/machine-name.js");
var inline_buttons_js_1 = require("../../../telegram/inline-buttons.js");
var reaction_level_js_1 = require("../../../telegram/reaction-level.js");
var reaction_level_js_2 = require("../../../signal/reaction-level.js");
var message_channel_js_1 = require("../../../utils/message-channel.js");
var provider_utils_js_1 = require("../../../utils/provider-utils.js");
var session_key_js_1 = require("../../../routing/session-key.js");
var utils_js_1 = require("../../../utils.js");
var cache_trace_js_1 = require("../../cache-trace.js");
var anthropic_payload_log_js_1 = require("../../anthropic-payload-log.js");
var agent_paths_js_1 = require("../../agent-paths.js");
var agent_scope_js_1 = require("../../agent-scope.js");
var bootstrap_files_js_1 = require("../../bootstrap-files.js");
var docs_path_js_1 = require("../../docs-path.js");
var model_auth_js_1 = require("../../model-auth.js");
var pi_embedded_helpers_js_1 = require("../../pi-embedded-helpers.js");
var pi_embedded_subscribe_js_1 = require("../../pi-embedded-subscribe.js");
var pi_settings_js_1 = require("../../pi-settings.js");
var pi_tools_js_1 = require("../../pi-tools.js");
var sandbox_js_1 = require("../../sandbox.js");
var session_tool_result_guard_wrapper_js_1 = require("../../session-tool-result-guard-wrapper.js");
var transcript_policy_js_1 = require("../../transcript-policy.js");
var session_write_lock_js_1 = require("../../session-write-lock.js");
var skills_js_1 = require("../../skills.js");
var workspace_js_1 = require("../../workspace.js");
var system_prompt_report_js_1 = require("../../system-prompt-report.js");
var model_selection_js_1 = require("../../model-selection.js");
var abort_js_1 = require("../abort.js");
var extensions_js_1 = require("../extensions.js");
var extra_params_js_1 = require("../extra-params.js");
var cache_ttl_js_1 = require("../cache-ttl.js");
var google_js_1 = require("../google.js");
var history_js_1 = require("../history.js");
var logger_js_1 = require("../logger.js");
var model_js_1 = require("../model.js");
var runs_js_1 = require("../runs.js");
var sandbox_info_js_1 = require("../sandbox-info.js");
var session_manager_cache_js_1 = require("../session-manager-cache.js");
var session_manager_init_js_1 = require("../session-manager-init.js");
var system_prompt_js_1 = require("../system-prompt.js");
var tool_split_js_1 = require("../tool-split.js");
var pi_tool_definition_adapter_js_1 = require("../../pi-tool-definition-adapter.js");
var system_prompt_params_js_1 = require("../../system-prompt-params.js");
var utils_js_2 = require("../utils.js");
var runtime_status_js_1 = require("../../sandbox/runtime-status.js");
var tts_js_1 = require("../../../tts/tts.js");
var failover_error_js_1 = require("../../failover-error.js");
var hook_runner_global_js_1 = require("../../../plugins/hook-runner-global.js");
var constants_js_1 = require("../../../media/constants.js");
var images_js_1 = require("./images.js");
function injectHistoryImagesIntoMessages(messages, historyImagesByIndex) {
  if (historyImagesByIndex.size === 0) {
    return false;
  }
  var didMutate = false;
  for (
    var _i = 0, historyImagesByIndex_1 = historyImagesByIndex;
    _i < historyImagesByIndex_1.length;
    _i++
  ) {
    var _a = historyImagesByIndex_1[_i],
      msgIndex = _a[0],
      images = _a[1];
    // Bounds check: ensure index is valid before accessing
    if (msgIndex < 0 || msgIndex >= messages.length) {
      continue;
    }
    var msg = messages[msgIndex];
    if (msg && msg.role === "user") {
      // Convert string content to array format if needed
      if (typeof msg.content === "string") {
        msg.content = [{ type: "text", text: msg.content }];
        didMutate = true;
      }
      if (Array.isArray(msg.content)) {
        // Check for existing image content to avoid duplicates across turns
        var existingImageData = new Set(
          msg.content
            .filter(function (c) {
              return (
                c != null &&
                typeof c === "object" &&
                c.type === "image" &&
                typeof c.data === "string"
              );
            })
            .map(function (c) {
              return c.data;
            }),
        );
        for (var _b = 0, images_1 = images; _b < images_1.length; _b++) {
          var img = images_1[_b];
          // Only add if this image isn't already in the message
          if (!existingImageData.has(img.data)) {
            msg.content.push(img);
            didMutate = true;
          }
        }
      }
    }
  }
  return didMutate;
}
function runEmbeddedAttempt(params) {
  return __awaiter(this, void 0, void 0, function () {
    var resolvedWorkspace,
      prevCwd,
      runAbortController,
      sandboxSessionKey,
      sandbox,
      effectiveWorkspace,
      restoreSkillEnv,
      shouldLoadSkillEntries,
      skillEntries,
      skillsPrompt,
      sessionLabel,
      _a,
      hookAdjustedBootstrapFiles,
      contextFiles,
      workspaceNotes,
      agentDir,
      modelHasVision,
      toolsRaw,
      tools,
      machineName,
      runtimeChannel_1,
      runtimeCapabilities,
      inlineButtonsScope,
      reactionGuidance,
      _b,
      defaultAgentId,
      sessionAgentId,
      sandboxInfo,
      reasoningTagHint,
      channelActions,
      messageToolHints,
      defaultModelRef,
      defaultModelLabel,
      _c,
      runtimeInfo,
      userTimezone,
      userTime,
      userTimeFormat,
      isDefaultAgent,
      promptMode,
      docsPath,
      ttsHint,
      appendPrompt,
      systemPromptReport,
      systemPrompt,
      sessionLock,
      sessionManager,
      session,
      hadSessionFile,
      transcriptPolicy,
      settingsManager,
      additionalExtensionPaths,
      _d,
      builtInTools,
      customTools,
      clientToolCallDetected_1,
      clientToolDefs,
      allCustomTools,
      activeSession_1,
      cacheTrace,
      anthropicPayloadLogger,
      prior,
      validatedGemini,
      validated,
      limited,
      err_1,
      aborted_1,
      timedOut_1,
      getAbortReason_1,
      makeTimeoutAbortReason_1,
      makeAbortError_1,
      abortRun_1,
      abortable,
      subscription_1,
      assistantTexts,
      toolMetas,
      unsubscribe,
      waitForCompactionRetry,
      getMessagingToolSentTexts,
      getMessagingToolSentTargets,
      didSendViaMessagingTool,
      getLastToolError,
      queueHandle,
      abortWarnTimer_1,
      isProbeSession_1,
      abortTimer,
      messagesSnapshot,
      sessionIdUsed,
      onAbort,
      hookRunner,
      promptError,
      promptStartedAt,
      effectivePrompt,
      hookResult,
      hookErr_1,
      leafEntry,
      sessionContext,
      imageResult,
      didMutate,
      shouldTrackCacheTtl,
      err_2,
      err_3,
      lastAssistant,
      toolMetasNormalized;
    var _this = this;
    var _e,
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
      _0,
      _1,
      _2,
      _3,
      _4,
      _5,
      _6,
      _7,
      _8,
      _9,
      _10,
      _11,
      _12,
      _13,
      _14,
      _15,
      _16;
    return __generator(this, function (_17) {
      switch (_17.label) {
        case 0:
          resolvedWorkspace = (0, utils_js_1.resolveUserPath)(params.workspaceDir);
          prevCwd = process.cwd();
          runAbortController = new AbortController();
          logger_js_1.log.debug(
            "embedded run start: runId="
              .concat(params.runId, " sessionId=")
              .concat(params.sessionId, " provider=")
              .concat(params.provider, " model=")
              .concat(params.modelId, " thinking=")
              .concat(params.thinkLevel, " messageChannel=")
              .concat(
                (_f =
                  (_e = params.messageChannel) !== null && _e !== void 0
                    ? _e
                    : params.messageProvider) !== null && _f !== void 0
                  ? _f
                  : "unknown",
              ),
          );
          return [4 /*yield*/, promises_1.default.mkdir(resolvedWorkspace, { recursive: true })];
        case 1:
          _17.sent();
          sandboxSessionKey =
            ((_g = params.sessionKey) === null || _g === void 0 ? void 0 : _g.trim()) ||
            params.sessionId;
          return [
            4 /*yield*/,
            (0, sandbox_js_1.resolveSandboxContext)({
              config: params.config,
              sessionKey: sandboxSessionKey,
              workspaceDir: resolvedWorkspace,
            }),
          ];
        case 2:
          sandbox = _17.sent();
          effectiveWorkspace = (sandbox === null || sandbox === void 0 ? void 0 : sandbox.enabled)
            ? sandbox.workspaceAccess === "rw"
              ? resolvedWorkspace
              : sandbox.workspaceDir
            : resolvedWorkspace;
          return [4 /*yield*/, promises_1.default.mkdir(effectiveWorkspace, { recursive: true })];
        case 3:
          _17.sent();
          process.chdir(effectiveWorkspace);
          _17.label = 4;
        case 4:
          _17.trys.push([4, , 40, 41]);
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
          sessionLabel = (_h = params.sessionKey) !== null && _h !== void 0 ? _h : params.sessionId;
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
        case 5:
          ((_a = _17.sent()),
            (hookAdjustedBootstrapFiles = _a.bootstrapFiles),
            (contextFiles = _a.contextFiles));
          workspaceNotes = hookAdjustedBootstrapFiles.some(function (file) {
            return file.name === workspace_js_1.DEFAULT_BOOTSTRAP_FILENAME && !file.missing;
          })
            ? ["Reminder: commit your changes in this workspace after edits."]
            : undefined;
          agentDir =
            (_j = params.agentDir) !== null && _j !== void 0
              ? _j
              : (0, agent_paths_js_1.resolveOpenClawAgentDir)();
          modelHasVision =
            (_l =
              (_k = params.model.input) === null || _k === void 0
                ? void 0
                : _k.includes("image")) !== null && _l !== void 0
              ? _l
              : false;
          toolsRaw = params.disableTools
            ? []
            : (0, pi_tools_js_1.createOpenClawCodingTools)({
                exec: __assign(__assign({}, params.execOverrides), {
                  elevated: params.bashElevated,
                }),
                sandbox: sandbox,
                messageProvider:
                  (_m = params.messageChannel) !== null && _m !== void 0
                    ? _m
                    : params.messageProvider,
                agentAccountId: params.agentAccountId,
                messageTo: params.messageTo,
                messageThreadId: params.messageThreadId,
                groupId: params.groupId,
                groupChannel: params.groupChannel,
                groupSpace: params.groupSpace,
                spawnedBy: params.spawnedBy,
                senderId: params.senderId,
                senderName: params.senderName,
                senderUsername: params.senderUsername,
                senderE164: params.senderE164,
                sessionKey:
                  (_o = params.sessionKey) !== null && _o !== void 0 ? _o : params.sessionId,
                agentDir: agentDir,
                workspaceDir: effectiveWorkspace,
                config: params.config,
                abortSignal: runAbortController.signal,
                modelProvider: params.model.provider,
                modelId: params.modelId,
                modelAuthMode: (0, model_auth_js_1.resolveModelAuthMode)(
                  params.model.provider,
                  params.config,
                ),
                currentChannelId: params.currentChannelId,
                currentThreadTs: params.currentThreadTs,
                replyToMode: params.replyToMode,
                hasRepliedRef: params.hasRepliedRef,
                modelHasVision: modelHasVision,
              });
          tools = (0, google_js_1.sanitizeToolsForGoogle)({
            tools: toolsRaw,
            provider: params.provider,
          });
          (0, google_js_1.logToolSchemasForGoogle)({ tools: tools, provider: params.provider });
          return [4 /*yield*/, (0, machine_name_js_1.getMachineDisplayName)()];
        case 6:
          machineName = _17.sent();
          runtimeChannel_1 = (0, message_channel_js_1.normalizeMessageChannel)(
            (_p = params.messageChannel) !== null && _p !== void 0 ? _p : params.messageProvider,
          );
          runtimeCapabilities = runtimeChannel_1
            ? (_q = (0, channel_capabilities_js_1.resolveChannelCapabilities)({
                cfg: params.config,
                channel: runtimeChannel_1,
                accountId: params.agentAccountId,
              })) !== null && _q !== void 0
              ? _q
              : []
            : undefined;
          if (runtimeChannel_1 === "telegram" && params.config) {
            inlineButtonsScope = (0, inline_buttons_js_1.resolveTelegramInlineButtonsScope)({
              cfg: params.config,
              accountId: (_r = params.agentAccountId) !== null && _r !== void 0 ? _r : undefined,
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
          ((_b = (0, agent_scope_js_1.resolveSessionAgentIds)({
            sessionKey: params.sessionKey,
            config: params.config,
          })),
            (defaultAgentId = _b.defaultAgentId),
            (sessionAgentId = _b.sessionAgentId));
          sandboxInfo = (0, sandbox_info_js_1.buildEmbeddedSandboxInfo)(
            sandbox,
            params.bashElevated,
          );
          reasoningTagHint = (0, provider_utils_js_1.isReasoningTagProvider)(params.provider);
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
          defaultModelRef = (0, model_selection_js_1.resolveDefaultModelForAgent)({
            cfg: (_s = params.config) !== null && _s !== void 0 ? _s : {},
            agentId: sessionAgentId,
          });
          defaultModelLabel = ""
            .concat(defaultModelRef.provider, "/")
            .concat(defaultModelRef.model);
          ((_c = (0, system_prompt_params_js_1.buildSystemPromptParams)({
            config: params.config,
            agentId: sessionAgentId,
            workspaceDir: effectiveWorkspace,
            cwd: process.cwd(),
            runtime: {
              host: machineName,
              os: "".concat(node_os_1.default.type(), " ").concat(node_os_1.default.release()),
              arch: node_os_1.default.arch(),
              node: process.version,
              model: "".concat(params.provider, "/").concat(params.modelId),
              defaultModel: defaultModelLabel,
              channel: runtimeChannel_1,
              capabilities: runtimeCapabilities,
              channelActions: channelActions,
            },
          })),
            (runtimeInfo = _c.runtimeInfo),
            (userTimezone = _c.userTimezone),
            (userTime = _c.userTime),
            (userTimeFormat = _c.userTimeFormat));
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
        case 7:
          docsPath = _17.sent();
          ttsHint = params.config
            ? (0, tts_js_1.buildTtsSystemPromptHint)(params.config)
            : undefined;
          appendPrompt = (0, system_prompt_js_1.buildEmbeddedSystemPrompt)({
            workspaceDir: effectiveWorkspace,
            defaultThinkLevel: params.thinkLevel,
            reasoningLevel: (_t = params.reasoningLevel) !== null && _t !== void 0 ? _t : "off",
            extraSystemPrompt: params.extraSystemPrompt,
            ownerNumbers: params.ownerNumbers,
            reasoningTagHint: reasoningTagHint,
            heartbeatPrompt: isDefaultAgent
              ? (0, heartbeat_js_1.resolveHeartbeatPrompt)(
                  (_x =
                    (_w =
                      (_v = (_u = params.config) === null || _u === void 0 ? void 0 : _u.agents) ===
                        null || _v === void 0
                        ? void 0
                        : _v.defaults) === null || _w === void 0
                      ? void 0
                      : _w.heartbeat) === null || _x === void 0
                    ? void 0
                    : _x.prompt,
                )
              : undefined,
            skillsPrompt: skillsPrompt,
            docsPath: docsPath !== null && docsPath !== void 0 ? docsPath : undefined,
            ttsHint: ttsHint,
            workspaceNotes: workspaceNotes,
            reactionGuidance: reactionGuidance,
            promptMode: promptMode,
            runtimeInfo: runtimeInfo,
            messageToolHints: messageToolHints,
            sandboxInfo: sandboxInfo,
            tools: tools,
            modelAliasLines: (0, model_js_1.buildModelAliasLines)(params.config),
            userTimezone: userTimezone,
            userTime: userTime,
            userTimeFormat: userTimeFormat,
            contextFiles: contextFiles,
          });
          systemPromptReport = (0, system_prompt_report_js_1.buildSystemPromptReport)({
            source: "run",
            generatedAt: Date.now(),
            sessionId: params.sessionId,
            sessionKey: params.sessionKey,
            provider: params.provider,
            model: params.modelId,
            workspaceDir: effectiveWorkspace,
            bootstrapMaxChars: (0, pi_embedded_helpers_js_1.resolveBootstrapMaxChars)(
              params.config,
            ),
            sandbox: (function () {
              var _a;
              var runtime = (0, runtime_status_js_1.resolveSandboxRuntimeStatus)({
                cfg: params.config,
                sessionKey:
                  (_a = params.sessionKey) !== null && _a !== void 0 ? _a : params.sessionId,
              });
              return { mode: runtime.mode, sandboxed: runtime.sandboxed };
            })(),
            systemPrompt: appendPrompt,
            bootstrapFiles: hookAdjustedBootstrapFiles,
            injectedFiles: contextFiles,
            skillsPrompt: skillsPrompt,
            tools: tools,
          });
          systemPrompt = (0, system_prompt_js_1.createSystemPromptOverride)(appendPrompt);
          return [
            4 /*yield*/,
            (0, session_write_lock_js_1.acquireSessionWriteLock)({
              sessionFile: params.sessionFile,
            }),
          ];
        case 8:
          sessionLock = _17.sent();
          sessionManager = void 0;
          session = void 0;
          _17.label = 9;
        case 9:
          _17.trys.push([9, , 37, 39]);
          return [
            4 /*yield*/,
            promises_1.default
              .stat(params.sessionFile)
              .then(function () {
                return true;
              })
              .catch(function () {
                return false;
              }),
          ];
        case 10:
          hadSessionFile = _17.sent();
          transcriptPolicy = (0, transcript_policy_js_1.resolveTranscriptPolicy)({
            modelApi: (_y = params.model) === null || _y === void 0 ? void 0 : _y.api,
            provider: params.provider,
            modelId: params.modelId,
          });
          return [
            4 /*yield*/,
            (0, session_manager_cache_js_1.prewarmSessionFile)(params.sessionFile),
          ];
        case 11:
          _17.sent();
          sessionManager = (0, session_tool_result_guard_wrapper_js_1.guardSessionManager)(
            pi_coding_agent_1.SessionManager.open(params.sessionFile),
            {
              agentId: sessionAgentId,
              sessionKey: params.sessionKey,
              allowSyntheticToolResults: transcriptPolicy.allowSyntheticToolResults,
            },
          );
          (0, session_manager_cache_js_1.trackSessionManagerAccess)(params.sessionFile);
          return [
            4 /*yield*/,
            (0, session_manager_init_js_1.prepareSessionManagerForRun)({
              sessionManager: sessionManager,
              sessionFile: params.sessionFile,
              hadSessionFile: hadSessionFile,
              sessionId: params.sessionId,
              cwd: effectiveWorkspace,
            }),
          ];
        case 12:
          _17.sent();
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
            provider: params.provider,
            modelId: params.modelId,
            model: params.model,
          });
          ((_d = (0, tool_split_js_1.splitSdkTools)({
            tools: tools,
            sandboxEnabled: !!(sandbox === null || sandbox === void 0 ? void 0 : sandbox.enabled),
          })),
            (builtInTools = _d.builtInTools),
            (customTools = _d.customTools));
          clientToolCallDetected_1 = null;
          clientToolDefs = params.clientTools
            ? (0, pi_tool_definition_adapter_js_1.toClientToolDefinitions)(
                params.clientTools,
                function (toolName, toolParams) {
                  clientToolCallDetected_1 = { name: toolName, params: toolParams };
                },
              )
            : [];
          allCustomTools = __spreadArray(
            __spreadArray([], customTools, true),
            clientToolDefs,
            true,
          );
          return [
            4 /*yield*/,
            (0, pi_coding_agent_1.createAgentSession)({
              cwd: resolvedWorkspace,
              agentDir: agentDir,
              authStorage: params.authStorage,
              modelRegistry: params.modelRegistry,
              model: params.model,
              thinkingLevel: (0, utils_js_2.mapThinkingLevel)(params.thinkLevel),
              systemPrompt: systemPrompt,
              tools: builtInTools,
              customTools: allCustomTools,
              sessionManager: sessionManager,
              settingsManager: settingsManager,
              skills: [],
              contextFiles: [],
              additionalExtensionPaths: additionalExtensionPaths,
            }),
          ];
        case 13:
          session = _17.sent().session;
          if (!session) {
            throw new Error("Embedded agent session missing");
          }
          activeSession_1 = session;
          cacheTrace = (0, cache_trace_js_1.createCacheTrace)({
            cfg: params.config,
            env: process.env,
            runId: params.runId,
            sessionId: activeSession_1.sessionId,
            sessionKey: params.sessionKey,
            provider: params.provider,
            modelId: params.modelId,
            modelApi: params.model.api,
            workspaceDir: params.workspaceDir,
          });
          anthropicPayloadLogger = (0, anthropic_payload_log_js_1.createAnthropicPayloadLogger)({
            env: process.env,
            runId: params.runId,
            sessionId: activeSession_1.sessionId,
            sessionKey: params.sessionKey,
            provider: params.provider,
            modelId: params.modelId,
            modelApi: params.model.api,
            workspaceDir: params.workspaceDir,
          });
          // Force a stable streamFn reference so vitest can reliably mock @mariozechner/pi-ai.
          activeSession_1.agent.streamFn = pi_ai_1.streamSimple;
          (0, extra_params_js_1.applyExtraParamsToAgent)(
            activeSession_1.agent,
            params.config,
            params.provider,
            params.modelId,
            params.streamParams,
          );
          if (cacheTrace) {
            cacheTrace.recordStage("session:loaded", {
              messages: activeSession_1.messages,
              system: systemPrompt,
              note: "after session create",
            });
            activeSession_1.agent.streamFn = cacheTrace.wrapStreamFn(
              activeSession_1.agent.streamFn,
            );
          }
          if (anthropicPayloadLogger) {
            activeSession_1.agent.streamFn = anthropicPayloadLogger.wrapStreamFn(
              activeSession_1.agent.streamFn,
            );
          }
          _17.label = 14;
        case 14:
          _17.trys.push([14, 16, , 17]);
          return [
            4 /*yield*/,
            (0, google_js_1.sanitizeSessionHistory)({
              messages: activeSession_1.messages,
              modelApi: params.model.api,
              modelId: params.modelId,
              provider: params.provider,
              sessionManager: sessionManager,
              sessionId: params.sessionId,
              policy: transcriptPolicy,
            }),
          ];
        case 15:
          prior = _17.sent();
          cacheTrace === null || cacheTrace === void 0
            ? void 0
            : cacheTrace.recordStage("session:sanitized", { messages: prior });
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
          cacheTrace === null || cacheTrace === void 0
            ? void 0
            : cacheTrace.recordStage("session:limited", { messages: limited });
          if (limited.length > 0) {
            activeSession_1.agent.replaceMessages(limited);
          }
          return [3 /*break*/, 17];
        case 16:
          err_1 = _17.sent();
          (_z = sessionManager.flushPendingToolResults) === null || _z === void 0
            ? void 0
            : _z.call(sessionManager);
          activeSession_1.dispose();
          throw err_1;
        case 17:
          aborted_1 = Boolean(
            (_0 = params.abortSignal) === null || _0 === void 0 ? void 0 : _0.aborted,
          );
          timedOut_1 = false;
          getAbortReason_1 = function (signal) {
            return "reason" in signal ? signal.reason : undefined;
          };
          makeTimeoutAbortReason_1 = function () {
            var err = new Error("request timed out");
            err.name = "TimeoutError";
            return err;
          };
          makeAbortError_1 = function (signal) {
            var reason = getAbortReason_1(signal);
            var err = reason ? new Error("aborted", { cause: reason }) : new Error("aborted");
            err.name = "AbortError";
            return err;
          };
          abortRun_1 = function (isTimeout, reason) {
            if (isTimeout === void 0) {
              isTimeout = false;
            }
            aborted_1 = true;
            if (isTimeout) {
              timedOut_1 = true;
            }
            if (isTimeout) {
              runAbortController.abort(
                reason !== null && reason !== void 0 ? reason : makeTimeoutAbortReason_1(),
              );
            } else {
              runAbortController.abort(reason);
            }
            void activeSession_1.abort();
          };
          abortable = function (promise) {
            var signal = runAbortController.signal;
            if (signal.aborted) {
              return Promise.reject(makeAbortError_1(signal));
            }
            return new Promise(function (resolve, reject) {
              var onAbort = function () {
                signal.removeEventListener("abort", onAbort);
                reject(makeAbortError_1(signal));
              };
              signal.addEventListener("abort", onAbort, { once: true });
              promise.then(
                function (value) {
                  signal.removeEventListener("abort", onAbort);
                  resolve(value);
                },
                function (err) {
                  signal.removeEventListener("abort", onAbort);
                  reject(err);
                },
              );
            });
          };
          subscription_1 = (0, pi_embedded_subscribe_js_1.subscribeEmbeddedPiSession)({
            session: activeSession_1,
            runId: params.runId,
            verboseLevel: params.verboseLevel,
            reasoningMode: (_1 = params.reasoningLevel) !== null && _1 !== void 0 ? _1 : "off",
            toolResultFormat: params.toolResultFormat,
            shouldEmitToolResult: params.shouldEmitToolResult,
            shouldEmitToolOutput: params.shouldEmitToolOutput,
            onToolResult: params.onToolResult,
            onReasoningStream: params.onReasoningStream,
            onBlockReply: params.onBlockReply,
            onBlockReplyFlush: params.onBlockReplyFlush,
            blockReplyBreak: params.blockReplyBreak,
            blockReplyChunking: params.blockReplyChunking,
            onPartialReply: params.onPartialReply,
            onAssistantMessageStart: params.onAssistantMessageStart,
            onAgentEvent: params.onAgentEvent,
            enforceFinalTag: params.enforceFinalTag,
          });
          ((assistantTexts = subscription_1.assistantTexts),
            (toolMetas = subscription_1.toolMetas),
            (unsubscribe = subscription_1.unsubscribe),
            (waitForCompactionRetry = subscription_1.waitForCompactionRetry),
            (getMessagingToolSentTexts = subscription_1.getMessagingToolSentTexts),
            (getMessagingToolSentTargets = subscription_1.getMessagingToolSentTargets),
            (didSendViaMessagingTool = subscription_1.didSendViaMessagingTool),
            (getLastToolError = subscription_1.getLastToolError));
          queueHandle = {
            queueMessage: function (text) {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4 /*yield*/, activeSession_1.steer(text)];
                    case 1:
                      _a.sent();
                      return [2 /*return*/];
                  }
                });
              });
            },
            isStreaming: function () {
              return activeSession_1.isStreaming;
            },
            isCompacting: function () {
              return subscription_1.isCompacting();
            },
            abort: abortRun_1,
          };
          (0, runs_js_1.setActiveEmbeddedRun)(params.sessionId, queueHandle);
          isProbeSession_1 =
            (_3 =
              (_2 = params.sessionId) === null || _2 === void 0
                ? void 0
                : _2.startsWith("probe-")) !== null && _3 !== void 0
              ? _3
              : false;
          abortTimer = setTimeout(
            function () {
              if (!isProbeSession_1) {
                logger_js_1.log.warn(
                  "embedded run timeout: runId="
                    .concat(params.runId, " sessionId=")
                    .concat(params.sessionId, " timeoutMs=")
                    .concat(params.timeoutMs),
                );
              }
              abortRun_1(true);
              if (!abortWarnTimer_1) {
                abortWarnTimer_1 = setTimeout(function () {
                  if (!activeSession_1.isStreaming) {
                    return;
                  }
                  if (!isProbeSession_1) {
                    logger_js_1.log.warn(
                      "embedded run abort still streaming: runId="
                        .concat(params.runId, " sessionId=")
                        .concat(params.sessionId),
                    );
                  }
                }, 10000);
              }
            },
            Math.max(1, params.timeoutMs),
          );
          messagesSnapshot = [];
          sessionIdUsed = activeSession_1.sessionId;
          onAbort = function () {
            var reason = params.abortSignal ? getAbortReason_1(params.abortSignal) : undefined;
            var timeout = reason ? (0, failover_error_js_1.isTimeoutError)(reason) : false;
            abortRun_1(timeout, reason);
          };
          if (params.abortSignal) {
            if (params.abortSignal.aborted) {
              onAbort();
            } else {
              params.abortSignal.addEventListener("abort", onAbort, {
                once: true,
              });
            }
          }
          hookRunner = (0, hook_runner_global_js_1.getGlobalHookRunner)();
          promptError = null;
          _17.label = 18;
        case 18:
          _17.trys.push([18, , 35, 36]);
          promptStartedAt = Date.now();
          effectivePrompt = params.prompt;
          if (
            !(hookRunner === null || hookRunner === void 0
              ? void 0
              : hookRunner.hasHooks("before_agent_start"))
          ) {
            return [3 /*break*/, 22];
          }
          _17.label = 19;
        case 19:
          _17.trys.push([19, 21, , 22]);
          return [
            4 /*yield*/,
            hookRunner.runBeforeAgentStart(
              {
                prompt: params.prompt,
                messages: activeSession_1.messages,
              },
              {
                agentId:
                  (_5 =
                    (_4 = params.sessionKey) === null || _4 === void 0
                      ? void 0
                      : _4.split(":")[0]) !== null && _5 !== void 0
                    ? _5
                    : "main",
                sessionKey: params.sessionKey,
                workspaceDir: params.workspaceDir,
                messageProvider:
                  (_6 = params.messageProvider) !== null && _6 !== void 0 ? _6 : undefined,
              },
            ),
          ];
        case 20:
          hookResult = _17.sent();
          if (hookResult === null || hookResult === void 0 ? void 0 : hookResult.prependContext) {
            effectivePrompt = "".concat(hookResult.prependContext, "\n\n").concat(params.prompt);
            logger_js_1.log.debug(
              "hooks: prepended context to prompt (".concat(
                hookResult.prependContext.length,
                " chars)",
              ),
            );
          }
          return [3 /*break*/, 22];
        case 21:
          hookErr_1 = _17.sent();
          logger_js_1.log.warn("before_agent_start hook failed: ".concat(String(hookErr_1)));
          return [3 /*break*/, 22];
        case 22:
          logger_js_1.log.debug(
            "embedded run prompt start: runId="
              .concat(params.runId, " sessionId=")
              .concat(params.sessionId),
          );
          cacheTrace === null || cacheTrace === void 0
            ? void 0
            : cacheTrace.recordStage("prompt:before", {
                prompt: effectivePrompt,
                messages: activeSession_1.messages,
              });
          leafEntry = sessionManager.getLeafEntry();
          if (
            (leafEntry === null || leafEntry === void 0 ? void 0 : leafEntry.type) === "message" &&
            leafEntry.message.role === "user"
          ) {
            if (leafEntry.parentId) {
              sessionManager.branch(leafEntry.parentId);
            } else {
              sessionManager.resetLeaf();
            }
            sessionContext = sessionManager.buildSessionContext();
            activeSession_1.agent.replaceMessages(sessionContext.messages);
            logger_js_1.log.warn(
              "Removed orphaned user message to prevent consecutive user turns. " +
                "runId=".concat(params.runId, " sessionId=").concat(params.sessionId),
            );
          }
          _17.label = 23;
        case 23:
          _17.trys.push([23, 29, 30, 31]);
          return [
            4 /*yield*/,
            (0, images_js_1.detectAndLoadPromptImages)({
              prompt: effectivePrompt,
              workspaceDir: effectiveWorkspace,
              model: params.model,
              existingImages: params.images,
              historyMessages: activeSession_1.messages,
              maxBytes: constants_js_1.MAX_IMAGE_BYTES,
              // Enforce sandbox path restrictions when sandbox is enabled
              sandboxRoot: (sandbox === null || sandbox === void 0 ? void 0 : sandbox.enabled)
                ? sandbox.workspaceDir
                : undefined,
            }),
          ];
        case 24:
          imageResult = _17.sent();
          didMutate = injectHistoryImagesIntoMessages(
            activeSession_1.messages,
            imageResult.historyImagesByIndex,
          );
          if (didMutate) {
            // Persist message mutations (e.g., injected history images) so we don't re-scan/reload.
            activeSession_1.agent.replaceMessages(activeSession_1.messages);
          }
          cacheTrace === null || cacheTrace === void 0
            ? void 0
            : cacheTrace.recordStage("prompt:images", {
                prompt: effectivePrompt,
                messages: activeSession_1.messages,
                note: "images: prompt="
                  .concat(imageResult.images.length, " history=")
                  .concat(imageResult.historyImagesByIndex.size),
              });
          shouldTrackCacheTtl =
            ((_10 =
              (_9 =
                (_8 = (_7 = params.config) === null || _7 === void 0 ? void 0 : _7.agents) ===
                  null || _8 === void 0
                  ? void 0
                  : _8.defaults) === null || _9 === void 0
                ? void 0
                : _9.contextPruning) === null || _10 === void 0
              ? void 0
              : _10.mode) === "cache-ttl" &&
            (0, cache_ttl_js_1.isCacheTtlEligibleProvider)(params.provider, params.modelId);
          if (shouldTrackCacheTtl) {
            (0, cache_ttl_js_1.appendCacheTtlTimestamp)(sessionManager, {
              timestamp: Date.now(),
              provider: params.provider,
              modelId: params.modelId,
            });
          }
          if (!(imageResult.images.length > 0)) {
            return [3 /*break*/, 26];
          }
          return [
            4 /*yield*/,
            abortable(activeSession_1.prompt(effectivePrompt, { images: imageResult.images })),
          ];
        case 25:
          _17.sent();
          return [3 /*break*/, 28];
        case 26:
          return [4 /*yield*/, abortable(activeSession_1.prompt(effectivePrompt))];
        case 27:
          _17.sent();
          _17.label = 28;
        case 28:
          return [3 /*break*/, 31];
        case 29:
          err_2 = _17.sent();
          promptError = err_2;
          return [3 /*break*/, 31];
        case 30:
          logger_js_1.log.debug(
            "embedded run prompt end: runId="
              .concat(params.runId, " sessionId=")
              .concat(params.sessionId, " durationMs=")
              .concat(Date.now() - promptStartedAt),
          );
          return [7 /*endfinally*/];
        case 31:
          _17.trys.push([31, 33, , 34]);
          return [4 /*yield*/, waitForCompactionRetry()];
        case 32:
          _17.sent();
          return [3 /*break*/, 34];
        case 33:
          err_3 = _17.sent();
          if ((0, abort_js_1.isAbortError)(err_3)) {
            if (!promptError) {
              promptError = err_3;
            }
          } else {
            throw err_3;
          }
          return [3 /*break*/, 34];
        case 34:
          messagesSnapshot = activeSession_1.messages.slice();
          sessionIdUsed = activeSession_1.sessionId;
          cacheTrace === null || cacheTrace === void 0
            ? void 0
            : cacheTrace.recordStage("session:after", {
                messages: messagesSnapshot,
                note: promptError ? "prompt error" : undefined,
              });
          anthropicPayloadLogger === null || anthropicPayloadLogger === void 0
            ? void 0
            : anthropicPayloadLogger.recordUsage(messagesSnapshot, promptError);
          // Run agent_end hooks to allow plugins to analyze the conversation
          // This is fire-and-forget, so we don't await
          if (
            hookRunner === null || hookRunner === void 0 ? void 0 : hookRunner.hasHooks("agent_end")
          ) {
            hookRunner
              .runAgentEnd(
                {
                  messages: messagesSnapshot,
                  success: !aborted_1 && !promptError,
                  error: promptError
                    ? (0, utils_js_2.describeUnknownError)(promptError)
                    : undefined,
                  durationMs: Date.now() - promptStartedAt,
                },
                {
                  agentId:
                    (_12 =
                      (_11 = params.sessionKey) === null || _11 === void 0
                        ? void 0
                        : _11.split(":")[0]) !== null && _12 !== void 0
                      ? _12
                      : "main",
                  sessionKey: params.sessionKey,
                  workspaceDir: params.workspaceDir,
                  messageProvider:
                    (_13 = params.messageProvider) !== null && _13 !== void 0 ? _13 : undefined,
                },
              )
              .catch(function (err) {
                logger_js_1.log.warn("agent_end hook failed: ".concat(err));
              });
          }
          return [3 /*break*/, 36];
        case 35:
          clearTimeout(abortTimer);
          if (abortWarnTimer_1) {
            clearTimeout(abortWarnTimer_1);
          }
          unsubscribe();
          (0, runs_js_1.clearActiveEmbeddedRun)(params.sessionId, queueHandle);
          (_15 =
            (_14 = params.abortSignal) === null || _14 === void 0
              ? void 0
              : _14.removeEventListener) === null || _15 === void 0
            ? void 0
            : _15.call(_14, "abort", onAbort);
          return [7 /*endfinally*/];
        case 36:
          lastAssistant = messagesSnapshot
            .slice()
            .toReversed()
            .find(function (m) {
              return (m === null || m === void 0 ? void 0 : m.role) === "assistant";
            });
          toolMetasNormalized = toolMetas
            .filter(function (entry) {
              return typeof entry.toolName === "string" && entry.toolName.trim().length > 0;
            })
            .map(function (entry) {
              return { toolName: entry.toolName, meta: entry.meta };
            });
          return [
            2 /*return*/,
            {
              aborted: aborted_1,
              timedOut: timedOut_1,
              promptError: promptError,
              sessionIdUsed: sessionIdUsed,
              systemPromptReport: systemPromptReport,
              messagesSnapshot: messagesSnapshot,
              assistantTexts: assistantTexts,
              toolMetas: toolMetasNormalized,
              lastAssistant: lastAssistant,
              lastToolError:
                getLastToolError === null || getLastToolError === void 0
                  ? void 0
                  : getLastToolError(),
              didSendViaMessagingTool: didSendViaMessagingTool(),
              messagingToolSentTexts: getMessagingToolSentTexts(),
              messagingToolSentTargets: getMessagingToolSentTargets(),
              cloudCodeAssistFormatError: Boolean(
                (lastAssistant === null || lastAssistant === void 0
                  ? void 0
                  : lastAssistant.errorMessage) &&
                (0, pi_embedded_helpers_js_1.isCloudCodeAssistFormatError)(
                  lastAssistant.errorMessage,
                ),
              ),
              // Client tool call detected (OpenResponses hosted tools)
              clientToolCall:
                clientToolCallDetected_1 !== null && clientToolCallDetected_1 !== void 0
                  ? clientToolCallDetected_1
                  : undefined,
            },
          ];
        case 37:
          // Always tear down the session (and release the lock) before we leave this attempt.
          (_16 =
            sessionManager === null || sessionManager === void 0
              ? void 0
              : sessionManager.flushPendingToolResults) === null || _16 === void 0
            ? void 0
            : _16.call(sessionManager);
          session === null || session === void 0 ? void 0 : session.dispose();
          return [4 /*yield*/, sessionLock.release()];
        case 38:
          _17.sent();
          return [7 /*endfinally*/];
        case 39:
          return [3 /*break*/, 41];
        case 40:
          restoreSkillEnv === null || restoreSkillEnv === void 0 ? void 0 : restoreSkillEnv();
          process.chdir(prevCwd);
          return [7 /*endfinally*/];
        case 41:
          return [2 /*return*/];
      }
    });
  });
}
