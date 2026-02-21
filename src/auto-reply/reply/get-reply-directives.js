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
exports.resolveReplyDirectives = resolveReplyDirectives;
var sandbox_js_1 = require("../../agents/sandbox.js");
var commands_registry_js_1 = require("../commands-registry.js");
var skill_commands_js_1 = require("../skill-commands.js");
var block_streaming_js_1 = require("./block-streaming.js");
var commands_js_1 = require("./commands.js");
var directive_handling_js_1 = require("./directive-handling.js");
var get_reply_directives_apply_js_1 = require("./get-reply-directives-apply.js");
var get_reply_directives_utils_js_1 = require("./get-reply-directives-utils.js");
var groups_js_1 = require("./groups.js");
var mentions_js_1 = require("./mentions.js");
var model_selection_js_1 = require("./model-selection.js");
var reply_elevated_js_1 = require("./reply-elevated.js");
var reply_inline_js_1 = require("./reply-inline.js");
function resolveExecOverrides(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  var host =
    (_a = params.directives.execHost) !== null && _a !== void 0
      ? _a
      : (_b = params.sessionEntry) === null || _b === void 0
        ? void 0
        : _b.execHost;
  var security =
    (_c = params.directives.execSecurity) !== null && _c !== void 0
      ? _c
      : (_d = params.sessionEntry) === null || _d === void 0
        ? void 0
        : _d.execSecurity;
  var ask =
    (_e = params.directives.execAsk) !== null && _e !== void 0
      ? _e
      : (_f = params.sessionEntry) === null || _f === void 0
        ? void 0
        : _f.execAsk;
  var node =
    (_g = params.directives.execNode) !== null && _g !== void 0
      ? _g
      : (_h = params.sessionEntry) === null || _h === void 0
        ? void 0
        : _h.execNode;
  if (!host && !security && !ask && !node) {
    return undefined;
  }
  return { host: host, security: security, ask: ask, node: node };
}
function resolveReplyDirectives(params) {
  return __awaiter(this, void 0, void 0, function () {
    var ctx,
      cfg,
      agentId,
      agentCfg,
      agentDir,
      workspaceDir,
      sessionCtx,
      sessionEntry,
      sessionStore,
      sessionKey,
      storePath,
      sessionScope,
      groupResolution,
      isGroup,
      triggerBodyNormalized,
      commandAuthorized,
      defaultProvider,
      defaultModel,
      initialProvider,
      initialModel,
      typing,
      opts,
      skillFilter,
      provider,
      model,
      commandSource,
      promptSource,
      commandText,
      command,
      allowTextCommands,
      shouldResolveSkillCommands,
      skillCommands,
      reservedCommands,
      _i,
      skillCommands_1,
      command_1,
      configuredAliases,
      allowStatusDirective,
      parsedDirectives,
      hasInlineStatus,
      hasInlineDirective,
      stripped,
      noMentions,
      directiveOnlyCheck,
      allowInlineStatus,
      directives,
      existingBody,
      cleanedBody,
      messageProviderKey,
      elevated,
      elevatedEnabled,
      elevatedAllowed,
      elevatedFailures,
      runtimeSandboxed,
      requireMention,
      defaultActivation,
      resolvedThinkLevel,
      resolvedVerboseLevel,
      resolvedReasoningLevel,
      resolvedElevatedLevel,
      resolvedBlockStreaming,
      resolvedBlockStreamingBreak,
      blockStreamingEnabled,
      blockReplyChunking,
      modelState,
      contextTokens,
      initialModelLabel,
      formatModelSwitchEvent,
      isModelListAlias,
      effectiveModelDirective,
      inlineStatusRequested,
      applyResult,
      directiveAck,
      perMessageQueueMode,
      perMessageQueueOptions,
      execOverrides;
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
      _0,
      _1,
      _2,
      _3,
      _4,
      _5,
      _6,
      _7;
    return __generator(this, function (_8) {
      switch (_8.label) {
        case 0:
          ((ctx = params.ctx),
            (cfg = params.cfg),
            (agentId = params.agentId),
            (agentCfg = params.agentCfg),
            (agentDir = params.agentDir),
            (workspaceDir = params.workspaceDir),
            (sessionCtx = params.sessionCtx),
            (sessionEntry = params.sessionEntry),
            (sessionStore = params.sessionStore),
            (sessionKey = params.sessionKey),
            (storePath = params.storePath),
            (sessionScope = params.sessionScope),
            (groupResolution = params.groupResolution),
            (isGroup = params.isGroup),
            (triggerBodyNormalized = params.triggerBodyNormalized),
            (commandAuthorized = params.commandAuthorized),
            (defaultProvider = params.defaultProvider),
            (defaultModel = params.defaultModel),
            (initialProvider = params.provider),
            (initialModel = params.model),
            (typing = params.typing),
            (opts = params.opts),
            (skillFilter = params.skillFilter));
          provider = initialProvider;
          model = initialModel;
          commandSource =
            (_j =
              (_h =
                (_g =
                  (_f =
                    (_e =
                      (_d =
                        (_c =
                          (_b =
                            (_a = sessionCtx.BodyForCommands) !== null && _a !== void 0
                              ? _a
                              : sessionCtx.CommandBody) !== null && _b !== void 0
                            ? _b
                            : sessionCtx.RawBody) !== null && _c !== void 0
                          ? _c
                          : sessionCtx.Transcript) !== null && _d !== void 0
                        ? _d
                        : sessionCtx.BodyStripped) !== null && _e !== void 0
                      ? _e
                      : sessionCtx.Body) !== null && _f !== void 0
                    ? _f
                    : ctx.BodyForCommands) !== null && _g !== void 0
                  ? _g
                  : ctx.CommandBody) !== null && _h !== void 0
                ? _h
                : ctx.RawBody) !== null && _j !== void 0
              ? _j
              : "";
          promptSource =
            (_m =
              (_l =
                (_k = sessionCtx.BodyForAgent) !== null && _k !== void 0
                  ? _k
                  : sessionCtx.BodyStripped) !== null && _l !== void 0
                ? _l
                : sessionCtx.Body) !== null && _m !== void 0
              ? _m
              : "";
          commandText = commandSource || promptSource;
          command = (0, commands_js_1.buildCommandContext)({
            ctx: ctx,
            cfg: cfg,
            agentId: agentId,
            sessionKey: sessionKey,
            isGroup: isGroup,
            triggerBodyNormalized: triggerBodyNormalized,
            commandAuthorized: commandAuthorized,
          });
          allowTextCommands = (0, commands_registry_js_1.shouldHandleTextCommands)({
            cfg: cfg,
            surface: command.surface,
            commandSource: ctx.CommandSource,
          });
          shouldResolveSkillCommands =
            allowTextCommands && command.commandBodyNormalized.includes("/");
          skillCommands = shouldResolveSkillCommands
            ? (0, skill_commands_js_1.listSkillCommandsForWorkspace)({
                workspaceDir: workspaceDir,
                cfg: cfg,
                skillFilter: skillFilter,
              })
            : [];
          reservedCommands = new Set(
            (0, commands_registry_js_1.listChatCommands)().flatMap(function (cmd) {
              return cmd.textAliases.map(function (a) {
                return a.replace(/^\//, "").toLowerCase();
              });
            }),
          );
          for (_i = 0, skillCommands_1 = skillCommands; _i < skillCommands_1.length; _i++) {
            command_1 = skillCommands_1[_i];
            reservedCommands.add(command_1.name.toLowerCase());
          }
          configuredAliases = Object.values(
            (_q =
              (_p = (_o = cfg.agents) === null || _o === void 0 ? void 0 : _o.defaults) === null ||
              _p === void 0
                ? void 0
                : _p.models) !== null && _q !== void 0
              ? _q
              : {},
          )
            .map(function (entry) {
              var _a;
              return (_a = entry.alias) === null || _a === void 0 ? void 0 : _a.trim();
            })
            .filter(function (alias) {
              return Boolean(alias);
            })
            .filter(function (alias) {
              return !reservedCommands.has(alias.toLowerCase());
            });
          allowStatusDirective = allowTextCommands && command.isAuthorizedSender;
          parsedDirectives = (0, directive_handling_js_1.parseInlineDirectives)(commandText, {
            modelAliases: configuredAliases,
            allowStatusDirective: allowStatusDirective,
          });
          hasInlineStatus =
            parsedDirectives.hasStatusDirective && parsedDirectives.cleaned.trim().length > 0;
          if (hasInlineStatus) {
            parsedDirectives = __assign(__assign({}, parsedDirectives), {
              hasStatusDirective: false,
            });
          }
          if (isGroup && ctx.WasMentioned !== true && parsedDirectives.hasElevatedDirective) {
            if (parsedDirectives.elevatedLevel !== "off") {
              parsedDirectives = __assign(__assign({}, parsedDirectives), {
                hasElevatedDirective: false,
                elevatedLevel: undefined,
                rawElevatedLevel: undefined,
              });
            }
          }
          if (isGroup && ctx.WasMentioned !== true && parsedDirectives.hasExecDirective) {
            if (parsedDirectives.execSecurity !== "deny") {
              parsedDirectives = __assign(__assign({}, parsedDirectives), {
                hasExecDirective: false,
                execHost: undefined,
                execSecurity: undefined,
                execAsk: undefined,
                execNode: undefined,
                rawExecHost: undefined,
                rawExecSecurity: undefined,
                rawExecAsk: undefined,
                rawExecNode: undefined,
                hasExecOptions: false,
                invalidExecHost: false,
                invalidExecSecurity: false,
                invalidExecAsk: false,
                invalidExecNode: false,
              });
            }
          }
          hasInlineDirective =
            parsedDirectives.hasThinkDirective ||
            parsedDirectives.hasVerboseDirective ||
            parsedDirectives.hasReasoningDirective ||
            parsedDirectives.hasElevatedDirective ||
            parsedDirectives.hasExecDirective ||
            parsedDirectives.hasModelDirective ||
            parsedDirectives.hasQueueDirective;
          if (hasInlineDirective) {
            stripped = (0, mentions_js_1.stripStructuralPrefixes)(parsedDirectives.cleaned);
            noMentions = isGroup
              ? (0, mentions_js_1.stripMentions)(stripped, ctx, cfg, agentId)
              : stripped;
            if (noMentions.trim().length > 0) {
              directiveOnlyCheck = (0, directive_handling_js_1.parseInlineDirectives)(noMentions, {
                modelAliases: configuredAliases,
              });
              if (directiveOnlyCheck.cleaned.trim().length > 0) {
                allowInlineStatus =
                  parsedDirectives.hasStatusDirective &&
                  allowTextCommands &&
                  command.isAuthorizedSender;
                parsedDirectives = allowInlineStatus
                  ? __assign(
                      __assign(
                        {},
                        (0, get_reply_directives_utils_js_1.clearInlineDirectives)(
                          parsedDirectives.cleaned,
                        ),
                      ),
                      { hasStatusDirective: true },
                    )
                  : (0, get_reply_directives_utils_js_1.clearInlineDirectives)(
                      parsedDirectives.cleaned,
                    );
              }
            }
          }
          directives = commandAuthorized
            ? parsedDirectives
            : __assign(__assign({}, parsedDirectives), {
                hasThinkDirective: false,
                hasVerboseDirective: false,
                hasReasoningDirective: false,
                hasStatusDirective: false,
                hasModelDirective: false,
                hasQueueDirective: false,
                queueReset: false,
              });
          existingBody =
            (_s =
              (_r = sessionCtx.BodyStripped) !== null && _r !== void 0 ? _r : sessionCtx.Body) !==
              null && _s !== void 0
              ? _s
              : "";
          cleanedBody = (function () {
            if (!existingBody) {
              return parsedDirectives.cleaned;
            }
            if (!sessionCtx.CommandBody && !sessionCtx.RawBody) {
              return (0, directive_handling_js_1.parseInlineDirectives)(existingBody, {
                modelAliases: configuredAliases,
                allowStatusDirective: allowStatusDirective,
              }).cleaned;
            }
            var markerIndex = existingBody.indexOf(mentions_js_1.CURRENT_MESSAGE_MARKER);
            if (markerIndex < 0) {
              return (0, directive_handling_js_1.parseInlineDirectives)(existingBody, {
                modelAliases: configuredAliases,
                allowStatusDirective: allowStatusDirective,
              }).cleaned;
            }
            var head = existingBody.slice(
              0,
              markerIndex + mentions_js_1.CURRENT_MESSAGE_MARKER.length,
            );
            var tail = existingBody.slice(
              markerIndex + mentions_js_1.CURRENT_MESSAGE_MARKER.length,
            );
            var cleanedTail = (0, directive_handling_js_1.parseInlineDirectives)(tail, {
              modelAliases: configuredAliases,
              allowStatusDirective: allowStatusDirective,
            }).cleaned;
            return "".concat(head).concat(cleanedTail);
          })();
          if (allowStatusDirective) {
            cleanedBody = (0, reply_inline_js_1.stripInlineStatus)(cleanedBody).cleaned;
          }
          sessionCtx.BodyForAgent = cleanedBody;
          sessionCtx.Body = cleanedBody;
          sessionCtx.BodyStripped = cleanedBody;
          messageProviderKey =
            (_w =
              (_u =
                (_t = sessionCtx.Provider) === null || _t === void 0
                  ? void 0
                  : _t.trim().toLowerCase()) !== null && _u !== void 0
                ? _u
                : (_v = ctx.Provider) === null || _v === void 0
                  ? void 0
                  : _v.trim().toLowerCase()) !== null && _w !== void 0
              ? _w
              : "";
          elevated = (0, reply_elevated_js_1.resolveElevatedPermissions)({
            cfg: cfg,
            agentId: agentId,
            ctx: ctx,
            provider: messageProviderKey,
          });
          elevatedEnabled = elevated.enabled;
          elevatedAllowed = elevated.allowed;
          elevatedFailures = elevated.failures;
          if (directives.hasElevatedDirective && (!elevatedEnabled || !elevatedAllowed)) {
            typing.cleanup();
            runtimeSandboxed = (0, sandbox_js_1.resolveSandboxRuntimeStatus)({
              cfg: cfg,
              sessionKey: ctx.SessionKey,
            }).sandboxed;
            return [
              2 /*return*/,
              {
                kind: "reply",
                reply: {
                  text: (0, reply_elevated_js_1.formatElevatedUnavailableMessage)({
                    runtimeSandboxed: runtimeSandboxed,
                    failures: elevatedFailures,
                    sessionKey: ctx.SessionKey,
                  }),
                },
              },
            ];
          }
          requireMention = (0, groups_js_1.resolveGroupRequireMention)({
            cfg: cfg,
            ctx: sessionCtx,
            groupResolution: groupResolution,
          });
          defaultActivation = (0, groups_js_1.defaultGroupActivation)(requireMention);
          resolvedThinkLevel =
            (_y =
              (_x = directives.thinkLevel) !== null && _x !== void 0
                ? _x
                : sessionEntry === null || sessionEntry === void 0
                  ? void 0
                  : sessionEntry.thinkingLevel) !== null && _y !== void 0
              ? _y
              : agentCfg === null || agentCfg === void 0
                ? void 0
                : agentCfg.thinkingDefault;
          resolvedVerboseLevel =
            (_0 =
              (_z = directives.verboseLevel) !== null && _z !== void 0
                ? _z
                : sessionEntry === null || sessionEntry === void 0
                  ? void 0
                  : sessionEntry.verboseLevel) !== null && _0 !== void 0
              ? _0
              : agentCfg === null || agentCfg === void 0
                ? void 0
                : agentCfg.verboseDefault;
          resolvedReasoningLevel =
            (_2 =
              (_1 = directives.reasoningLevel) !== null && _1 !== void 0
                ? _1
                : sessionEntry === null || sessionEntry === void 0
                  ? void 0
                  : sessionEntry.reasoningLevel) !== null && _2 !== void 0
              ? _2
              : "off";
          resolvedElevatedLevel = elevatedAllowed
            ? (_5 =
                (_4 =
                  (_3 = directives.elevatedLevel) !== null && _3 !== void 0
                    ? _3
                    : sessionEntry === null || sessionEntry === void 0
                      ? void 0
                      : sessionEntry.elevatedLevel) !== null && _4 !== void 0
                  ? _4
                  : agentCfg === null || agentCfg === void 0
                    ? void 0
                    : agentCfg.elevatedDefault) !== null && _5 !== void 0
              ? _5
              : "on"
            : "off";
          resolvedBlockStreaming =
            (opts === null || opts === void 0 ? void 0 : opts.disableBlockStreaming) === true
              ? "off"
              : (opts === null || opts === void 0 ? void 0 : opts.disableBlockStreaming) === false
                ? "on"
                : (agentCfg === null || agentCfg === void 0
                      ? void 0
                      : agentCfg.blockStreamingDefault) === "on"
                  ? "on"
                  : "off";
          resolvedBlockStreamingBreak =
            (agentCfg === null || agentCfg === void 0 ? void 0 : agentCfg.blockStreamingBreak) ===
            "message_end"
              ? "message_end"
              : "text_end";
          blockStreamingEnabled =
            resolvedBlockStreaming === "on" &&
            (opts === null || opts === void 0 ? void 0 : opts.disableBlockStreaming) !== true;
          blockReplyChunking = blockStreamingEnabled
            ? (0, block_streaming_js_1.resolveBlockStreamingChunking)(
                cfg,
                sessionCtx.Provider,
                sessionCtx.AccountId,
              )
            : undefined;
          return [
            4 /*yield*/,
            (0, model_selection_js_1.createModelSelectionState)({
              cfg: cfg,
              agentCfg: agentCfg,
              sessionEntry: sessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              parentSessionKey: ctx.ParentSessionKey,
              storePath: storePath,
              defaultProvider: defaultProvider,
              defaultModel: defaultModel,
              provider: provider,
              model: model,
              hasModelDirective: directives.hasModelDirective,
            }),
          ];
        case 1:
          modelState = _8.sent();
          provider = modelState.provider;
          model = modelState.model;
          contextTokens = (0, model_selection_js_1.resolveContextTokens)({
            agentCfg: agentCfg,
            model: model,
          });
          initialModelLabel = "".concat(provider, "/").concat(model);
          formatModelSwitchEvent = function (label, alias) {
            return alias
              ? "Model switched to ".concat(alias, " (").concat(label, ").")
              : "Model switched to ".concat(label, ".");
          };
          isModelListAlias =
            directives.hasModelDirective &&
            ["status", "list"].includes(
              (_7 =
                (_6 = directives.rawModelDirective) === null || _6 === void 0
                  ? void 0
                  : _6.trim().toLowerCase()) !== null && _7 !== void 0
                ? _7
                : "",
            );
          effectiveModelDirective = isModelListAlias ? undefined : directives.rawModelDirective;
          inlineStatusRequested =
            hasInlineStatus && allowTextCommands && command.isAuthorizedSender;
          return [
            4 /*yield*/,
            (0, get_reply_directives_apply_js_1.applyInlineDirectiveOverrides)({
              ctx: ctx,
              cfg: cfg,
              agentId: agentId,
              agentDir: agentDir,
              agentCfg: agentCfg,
              sessionEntry: sessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
              sessionScope: sessionScope,
              isGroup: isGroup,
              allowTextCommands: allowTextCommands,
              command: command,
              directives: directives,
              messageProviderKey: messageProviderKey,
              elevatedEnabled: elevatedEnabled,
              elevatedAllowed: elevatedAllowed,
              elevatedFailures: elevatedFailures,
              defaultProvider: defaultProvider,
              defaultModel: defaultModel,
              aliasIndex: params.aliasIndex,
              provider: provider,
              model: model,
              modelState: modelState,
              initialModelLabel: initialModelLabel,
              formatModelSwitchEvent: formatModelSwitchEvent,
              resolvedElevatedLevel: resolvedElevatedLevel,
              defaultActivation: function () {
                return defaultActivation;
              },
              contextTokens: contextTokens,
              effectiveModelDirective: effectiveModelDirective,
              typing: typing,
            }),
          ];
        case 2:
          applyResult = _8.sent();
          if (applyResult.kind === "reply") {
            return [2 /*return*/, { kind: "reply", reply: applyResult.reply }];
          }
          directives = applyResult.directives;
          provider = applyResult.provider;
          model = applyResult.model;
          contextTokens = applyResult.contextTokens;
          ((directiveAck = applyResult.directiveAck),
            (perMessageQueueMode = applyResult.perMessageQueueMode),
            (perMessageQueueOptions = applyResult.perMessageQueueOptions));
          execOverrides = resolveExecOverrides({
            directives: directives,
            sessionEntry: sessionEntry,
          });
          return [
            2 /*return*/,
            {
              kind: "continue",
              result: {
                commandSource: commandText,
                command: command,
                allowTextCommands: allowTextCommands,
                skillCommands: skillCommands,
                directives: directives,
                cleanedBody: cleanedBody,
                messageProviderKey: messageProviderKey,
                elevatedEnabled: elevatedEnabled,
                elevatedAllowed: elevatedAllowed,
                elevatedFailures: elevatedFailures,
                defaultActivation: defaultActivation,
                resolvedThinkLevel: resolvedThinkLevel,
                resolvedVerboseLevel: resolvedVerboseLevel,
                resolvedReasoningLevel: resolvedReasoningLevel,
                resolvedElevatedLevel: resolvedElevatedLevel,
                execOverrides: execOverrides,
                blockStreamingEnabled: blockStreamingEnabled,
                blockReplyChunking: blockReplyChunking,
                resolvedBlockStreamingBreak: resolvedBlockStreamingBreak,
                provider: provider,
                model: model,
                modelState: modelState,
                contextTokens: contextTokens,
                inlineStatusRequested: inlineStatusRequested,
                directiveAck: directiveAck,
                perMessageQueueMode: perMessageQueueMode,
                perMessageQueueOptions: perMessageQueueOptions,
              },
            },
          ];
      }
    });
  });
}
