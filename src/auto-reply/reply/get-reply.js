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
exports.getReplyFromConfig = getReplyFromConfig;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var timeout_js_1 = require("../../agents/timeout.js");
var workspace_js_1 = require("../../agents/workspace.js");
var config_js_1 = require("../../config/config.js");
var runtime_js_1 = require("../../runtime.js");
var command_auth_js_1 = require("../command-auth.js");
var tokens_js_1 = require("../tokens.js");
var apply_js_1 = require("../../media-understanding/apply.js");
var apply_js_2 = require("../../link-understanding/apply.js");
var directive_handling_js_1 = require("./directive-handling.js");
var get_reply_directives_js_1 = require("./get-reply-directives.js");
var get_reply_inline_actions_js_1 = require("./get-reply-inline-actions.js");
var get_reply_run_js_1 = require("./get-reply-run.js");
var inbound_context_js_1 = require("./inbound-context.js");
var session_js_1 = require("./session.js");
var session_reset_model_js_1 = require("./session-reset-model.js");
var stage_sandbox_media_js_1 = require("./stage-sandbox-media.js");
var typing_js_1 = require("./typing.js");
function getReplyFromConfig(ctx, opts, configOverride) {
  return __awaiter(this, void 0, void 0, function () {
    var isFastTestEnv,
      cfg,
      targetSessionKey,
      agentSessionKey,
      agentId,
      agentCfg,
      sessionCfg,
      _a,
      defaultProvider,
      defaultModel,
      aliasIndex,
      provider,
      model,
      heartbeatRaw,
      heartbeatRef,
      workspaceDirRaw,
      workspace,
      workspaceDir,
      agentDir,
      timeoutMs,
      configuredTypingSeconds,
      typingIntervalSeconds,
      typing,
      finalized,
      commandAuthorized,
      sessionState,
      sessionCtx,
      sessionEntry,
      previousSessionEntry,
      sessionStore,
      sessionKey,
      sessionId,
      isNewSession,
      resetTriggered,
      systemSent,
      abortedLastRun,
      storePath,
      sessionScope,
      groupResolution,
      isGroup,
      triggerBodyNormalized,
      bodyStripped,
      directiveResult,
      _b,
      commandSource,
      command,
      allowTextCommands,
      skillCommands,
      directives,
      cleanedBody,
      elevatedEnabled,
      elevatedAllowed,
      elevatedFailures,
      defaultActivation,
      resolvedThinkLevel,
      resolvedVerboseLevel,
      resolvedReasoningLevel,
      resolvedElevatedLevel,
      execOverrides,
      blockStreamingEnabled,
      blockReplyChunking,
      resolvedBlockStreamingBreak,
      resolvedProvider,
      resolvedModel,
      modelState,
      contextTokens,
      inlineStatusRequested,
      directiveAck,
      perMessageQueueMode,
      perMessageQueueOptions,
      inlineActionResult;
    var _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
      switch (_m.label) {
        case 0:
          isFastTestEnv = process.env.OPENCLAW_TEST_FAST === "1";
          cfg =
            configOverride !== null && configOverride !== void 0
              ? configOverride
              : (0, config_js_1.loadConfig)();
          targetSessionKey =
            ctx.CommandSource === "native"
              ? (_c = ctx.CommandTargetSessionKey) === null || _c === void 0
                ? void 0
                : _c.trim()
              : undefined;
          agentSessionKey = targetSessionKey || ctx.SessionKey;
          agentId = (0, agent_scope_js_1.resolveSessionAgentId)({
            sessionKey: agentSessionKey,
            config: cfg,
          });
          agentCfg = (_d = cfg.agents) === null || _d === void 0 ? void 0 : _d.defaults;
          sessionCfg = cfg.session;
          ((_a = (0, directive_handling_js_1.resolveDefaultModel)({
            cfg: cfg,
            agentId: agentId,
          })),
            (defaultProvider = _a.defaultProvider),
            (defaultModel = _a.defaultModel),
            (aliasIndex = _a.aliasIndex));
          provider = defaultProvider;
          model = defaultModel;
          if (opts === null || opts === void 0 ? void 0 : opts.isHeartbeat) {
            heartbeatRaw =
              (_g =
                (_f =
                  (_e = agentCfg === null || agentCfg === void 0 ? void 0 : agentCfg.heartbeat) ===
                    null || _e === void 0
                    ? void 0
                    : _e.model) === null || _f === void 0
                  ? void 0
                  : _f.trim()) !== null && _g !== void 0
                ? _g
                : "";
            heartbeatRef = heartbeatRaw
              ? (0, model_selection_js_1.resolveModelRefFromString)({
                  raw: heartbeatRaw,
                  defaultProvider: defaultProvider,
                  aliasIndex: aliasIndex,
                })
              : null;
            if (heartbeatRef) {
              provider = heartbeatRef.ref.provider;
              model = heartbeatRef.ref.model;
            }
          }
          workspaceDirRaw =
            (_h = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, agentId)) !== null &&
            _h !== void 0
              ? _h
              : workspace_js_1.DEFAULT_AGENT_WORKSPACE_DIR;
          return [
            4 /*yield*/,
            (0, workspace_js_1.ensureAgentWorkspace)({
              dir: workspaceDirRaw,
              ensureBootstrapFiles:
                !(agentCfg === null || agentCfg === void 0 ? void 0 : agentCfg.skipBootstrap) &&
                !isFastTestEnv,
            }),
          ];
        case 1:
          workspace = _m.sent();
          workspaceDir = workspace.dir;
          agentDir = (0, agent_scope_js_1.resolveAgentDir)(cfg, agentId);
          timeoutMs = (0, timeout_js_1.resolveAgentTimeoutMs)({ cfg: cfg });
          configuredTypingSeconds =
            (_j =
              agentCfg === null || agentCfg === void 0
                ? void 0
                : agentCfg.typingIntervalSeconds) !== null && _j !== void 0
              ? _j
              : sessionCfg === null || sessionCfg === void 0
                ? void 0
                : sessionCfg.typingIntervalSeconds;
          typingIntervalSeconds =
            typeof configuredTypingSeconds === "number" ? configuredTypingSeconds : 6;
          typing = (0, typing_js_1.createTypingController)({
            onReplyStart: opts === null || opts === void 0 ? void 0 : opts.onReplyStart,
            typingIntervalSeconds: typingIntervalSeconds,
            silentToken: tokens_js_1.SILENT_REPLY_TOKEN,
            log: runtime_js_1.defaultRuntime.log,
          });
          (_k = opts === null || opts === void 0 ? void 0 : opts.onTypingController) === null ||
          _k === void 0
            ? void 0
            : _k.call(opts, typing);
          finalized = (0, inbound_context_js_1.finalizeInboundContext)(ctx);
          if (!!isFastTestEnv) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            (0, apply_js_1.applyMediaUnderstanding)({
              ctx: finalized,
              cfg: cfg,
              agentDir: agentDir,
              activeModel: { provider: provider, model: model },
            }),
          ];
        case 2:
          _m.sent();
          return [
            4 /*yield*/,
            (0, apply_js_2.applyLinkUnderstanding)({
              ctx: finalized,
              cfg: cfg,
            }),
          ];
        case 3:
          _m.sent();
          _m.label = 4;
        case 4:
          commandAuthorized = finalized.CommandAuthorized;
          (0, command_auth_js_1.resolveCommandAuthorization)({
            ctx: finalized,
            cfg: cfg,
            commandAuthorized: commandAuthorized,
          });
          return [
            4 /*yield*/,
            (0, session_js_1.initSessionState)({
              ctx: finalized,
              cfg: cfg,
              commandAuthorized: commandAuthorized,
            }),
          ];
        case 5:
          sessionState = _m.sent();
          ((sessionCtx = sessionState.sessionCtx),
            (sessionEntry = sessionState.sessionEntry),
            (previousSessionEntry = sessionState.previousSessionEntry),
            (sessionStore = sessionState.sessionStore),
            (sessionKey = sessionState.sessionKey),
            (sessionId = sessionState.sessionId),
            (isNewSession = sessionState.isNewSession),
            (resetTriggered = sessionState.resetTriggered),
            (systemSent = sessionState.systemSent),
            (abortedLastRun = sessionState.abortedLastRun),
            (storePath = sessionState.storePath),
            (sessionScope = sessionState.sessionScope),
            (groupResolution = sessionState.groupResolution),
            (isGroup = sessionState.isGroup),
            (triggerBodyNormalized = sessionState.triggerBodyNormalized),
            (bodyStripped = sessionState.bodyStripped));
          return [
            4 /*yield*/,
            (0, session_reset_model_js_1.applyResetModelOverride)({
              cfg: cfg,
              resetTriggered: resetTriggered,
              bodyStripped: bodyStripped,
              sessionCtx: sessionCtx,
              ctx: finalized,
              sessionEntry: sessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
              defaultProvider: defaultProvider,
              defaultModel: defaultModel,
              aliasIndex: aliasIndex,
            }),
          ];
        case 6:
          _m.sent();
          return [
            4 /*yield*/,
            (0, get_reply_directives_js_1.resolveReplyDirectives)({
              ctx: finalized,
              cfg: cfg,
              agentId: agentId,
              agentDir: agentDir,
              workspaceDir: workspaceDir,
              agentCfg: agentCfg,
              sessionCtx: sessionCtx,
              sessionEntry: sessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
              sessionScope: sessionScope,
              groupResolution: groupResolution,
              isGroup: isGroup,
              triggerBodyNormalized: triggerBodyNormalized,
              commandAuthorized: commandAuthorized,
              defaultProvider: defaultProvider,
              defaultModel: defaultModel,
              aliasIndex: aliasIndex,
              provider: provider,
              model: model,
              typing: typing,
              opts: opts,
              skillFilter: opts === null || opts === void 0 ? void 0 : opts.skillFilter,
            }),
          ];
        case 7:
          directiveResult = _m.sent();
          if (directiveResult.kind === "reply") {
            return [2 /*return*/, directiveResult.reply];
          }
          ((_b = directiveResult.result),
            (commandSource = _b.commandSource),
            (command = _b.command),
            (allowTextCommands = _b.allowTextCommands),
            (skillCommands = _b.skillCommands),
            (directives = _b.directives),
            (cleanedBody = _b.cleanedBody),
            (elevatedEnabled = _b.elevatedEnabled),
            (elevatedAllowed = _b.elevatedAllowed),
            (elevatedFailures = _b.elevatedFailures),
            (defaultActivation = _b.defaultActivation),
            (resolvedThinkLevel = _b.resolvedThinkLevel),
            (resolvedVerboseLevel = _b.resolvedVerboseLevel),
            (resolvedReasoningLevel = _b.resolvedReasoningLevel),
            (resolvedElevatedLevel = _b.resolvedElevatedLevel),
            (execOverrides = _b.execOverrides),
            (blockStreamingEnabled = _b.blockStreamingEnabled),
            (blockReplyChunking = _b.blockReplyChunking),
            (resolvedBlockStreamingBreak = _b.resolvedBlockStreamingBreak),
            (resolvedProvider = _b.provider),
            (resolvedModel = _b.model),
            (modelState = _b.modelState),
            (contextTokens = _b.contextTokens),
            (inlineStatusRequested = _b.inlineStatusRequested),
            (directiveAck = _b.directiveAck),
            (perMessageQueueMode = _b.perMessageQueueMode),
            (perMessageQueueOptions = _b.perMessageQueueOptions));
          provider = resolvedProvider;
          model = resolvedModel;
          return [
            4 /*yield*/,
            (0, get_reply_inline_actions_js_1.handleInlineActions)({
              ctx: ctx,
              sessionCtx: sessionCtx,
              cfg: cfg,
              agentId: agentId,
              agentDir: agentDir,
              sessionEntry: sessionEntry,
              previousSessionEntry: previousSessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
              sessionScope: sessionScope,
              workspaceDir: workspaceDir,
              isGroup: isGroup,
              opts: opts,
              typing: typing,
              allowTextCommands: allowTextCommands,
              inlineStatusRequested: inlineStatusRequested,
              command: command,
              skillCommands: skillCommands,
              directives: directives,
              cleanedBody: cleanedBody,
              elevatedEnabled: elevatedEnabled,
              elevatedAllowed: elevatedAllowed,
              elevatedFailures: elevatedFailures,
              defaultActivation: function () {
                return defaultActivation;
              },
              resolvedThinkLevel: resolvedThinkLevel,
              resolvedVerboseLevel: resolvedVerboseLevel,
              resolvedReasoningLevel: resolvedReasoningLevel,
              resolvedElevatedLevel: resolvedElevatedLevel,
              resolveDefaultThinkingLevel: modelState.resolveDefaultThinkingLevel,
              provider: provider,
              model: model,
              contextTokens: contextTokens,
              directiveAck: directiveAck,
              abortedLastRun: abortedLastRun,
              skillFilter: opts === null || opts === void 0 ? void 0 : opts.skillFilter,
            }),
          ];
        case 8:
          inlineActionResult = _m.sent();
          if (inlineActionResult.kind === "reply") {
            return [2 /*return*/, inlineActionResult.reply];
          }
          directives = inlineActionResult.directives;
          abortedLastRun =
            (_l = inlineActionResult.abortedLastRun) !== null && _l !== void 0
              ? _l
              : abortedLastRun;
          return [
            4 /*yield*/,
            (0, stage_sandbox_media_js_1.stageSandboxMedia)({
              ctx: ctx,
              sessionCtx: sessionCtx,
              cfg: cfg,
              sessionKey: sessionKey,
              workspaceDir: workspaceDir,
            }),
          ];
        case 9:
          _m.sent();
          return [
            2 /*return*/,
            (0, get_reply_run_js_1.runPreparedReply)({
              ctx: ctx,
              sessionCtx: sessionCtx,
              cfg: cfg,
              agentId: agentId,
              agentDir: agentDir,
              agentCfg: agentCfg,
              sessionCfg: sessionCfg,
              commandAuthorized: commandAuthorized,
              command: command,
              commandSource: commandSource,
              allowTextCommands: allowTextCommands,
              directives: directives,
              defaultActivation: defaultActivation,
              resolvedThinkLevel: resolvedThinkLevel,
              resolvedVerboseLevel: resolvedVerboseLevel,
              resolvedReasoningLevel: resolvedReasoningLevel,
              resolvedElevatedLevel: resolvedElevatedLevel,
              execOverrides: execOverrides,
              elevatedEnabled: elevatedEnabled,
              elevatedAllowed: elevatedAllowed,
              blockStreamingEnabled: blockStreamingEnabled,
              blockReplyChunking: blockReplyChunking,
              resolvedBlockStreamingBreak: resolvedBlockStreamingBreak,
              modelState: modelState,
              provider: provider,
              model: model,
              perMessageQueueMode: perMessageQueueMode,
              perMessageQueueOptions: perMessageQueueOptions,
              typing: typing,
              opts: opts,
              defaultProvider: defaultProvider,
              defaultModel: defaultModel,
              timeoutMs: timeoutMs,
              isNewSession: isNewSession,
              resetTriggered: resetTriggered,
              systemSent: systemSent,
              sessionEntry: sessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              sessionId: sessionId,
              storePath: storePath,
              workspaceDir: workspaceDir,
              abortedLastRun: abortedLastRun,
            }),
          ];
      }
    });
  });
}
