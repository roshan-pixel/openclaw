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
exports.handleInlineActions = handleInlineActions;
var dock_js_1 = require("../../channels/dock.js");
var abort_js_1 = require("./abort.js");
var commands_js_1 = require("./commands.js");
var directive_handling_js_1 = require("./directive-handling.js");
var reply_inline_js_1 = require("./reply-inline.js");
var skill_commands_js_1 = require("../skill-commands.js");
var globals_js_1 = require("../../globals.js");
var openclaw_tools_js_1 = require("../../agents/openclaw-tools.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
function extractTextFromToolResult(result) {
  if (!result || typeof result !== "object") {
    return null;
  }
  var content = result.content;
  if (typeof content === "string") {
    var trimmed_1 = content.trim();
    return trimmed_1 ? trimmed_1 : null;
  }
  if (!Array.isArray(content)) {
    return null;
  }
  var parts = [];
  for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
    var block = content_1[_i];
    if (!block || typeof block !== "object") {
      continue;
    }
    var rec = block;
    if (rec.type === "text" && typeof rec.text === "string") {
      parts.push(rec.text);
    }
  }
  var out = parts.join("");
  var trimmed = out.trim();
  return trimmed ? trimmed : null;
}
function handleInlineActions(params) {
  return __awaiter(this, void 0, void 0, function () {
    var ctx,
      sessionCtx,
      cfg,
      agentId,
      agentDir,
      sessionEntry,
      previousSessionEntry,
      sessionStore,
      sessionKey,
      storePath,
      sessionScope,
      workspaceDir,
      isGroup,
      opts,
      typing,
      allowTextCommands,
      inlineStatusRequested,
      command,
      initialDirectives,
      initialCleanedBody,
      elevatedEnabled,
      elevatedAllowed,
      elevatedFailures,
      defaultActivation,
      resolvedThinkLevel,
      resolvedVerboseLevel,
      resolvedReasoningLevel,
      resolvedElevatedLevel,
      resolveDefaultThinkingLevel,
      provider,
      model,
      contextTokens,
      directiveAck,
      initialAbortedLastRun,
      skillFilter,
      directives,
      cleanedBody,
      shouldLoadSkillCommands,
      skillCommands,
      skillInvocation,
      dispatch_1,
      rawArgs,
      channel,
      tools,
      tool,
      toolCallId,
      result,
      text,
      err_1,
      message,
      promptParts,
      rewrittenBody,
      sendInlineReply,
      inlineCommand,
      handleInlineStatus,
      inlineStatusReply,
      inlineCommandContext,
      inlineResult,
      isEmptyConfig,
      skipWhenConfigEmpty,
      abortedLastRun,
      commandResult;
    var _this = this;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
      switch (_k.label) {
        case 0:
          ((ctx = params.ctx),
            (sessionCtx = params.sessionCtx),
            (cfg = params.cfg),
            (agentId = params.agentId),
            (agentDir = params.agentDir),
            (sessionEntry = params.sessionEntry),
            (previousSessionEntry = params.previousSessionEntry),
            (sessionStore = params.sessionStore),
            (sessionKey = params.sessionKey),
            (storePath = params.storePath),
            (sessionScope = params.sessionScope),
            (workspaceDir = params.workspaceDir),
            (isGroup = params.isGroup),
            (opts = params.opts),
            (typing = params.typing),
            (allowTextCommands = params.allowTextCommands),
            (inlineStatusRequested = params.inlineStatusRequested),
            (command = params.command),
            (initialDirectives = params.directives),
            (initialCleanedBody = params.cleanedBody),
            (elevatedEnabled = params.elevatedEnabled),
            (elevatedAllowed = params.elevatedAllowed),
            (elevatedFailures = params.elevatedFailures),
            (defaultActivation = params.defaultActivation),
            (resolvedThinkLevel = params.resolvedThinkLevel),
            (resolvedVerboseLevel = params.resolvedVerboseLevel),
            (resolvedReasoningLevel = params.resolvedReasoningLevel),
            (resolvedElevatedLevel = params.resolvedElevatedLevel),
            (resolveDefaultThinkingLevel = params.resolveDefaultThinkingLevel),
            (provider = params.provider),
            (model = params.model),
            (contextTokens = params.contextTokens),
            (directiveAck = params.directiveAck),
            (initialAbortedLastRun = params.abortedLastRun),
            (skillFilter = params.skillFilter));
          directives = initialDirectives;
          cleanedBody = initialCleanedBody;
          shouldLoadSkillCommands = command.commandBodyNormalized.startsWith("/");
          skillCommands =
            shouldLoadSkillCommands && params.skillCommands
              ? params.skillCommands
              : shouldLoadSkillCommands
                ? (0, skill_commands_js_1.listSkillCommandsForWorkspace)({
                    workspaceDir: workspaceDir,
                    cfg: cfg,
                    skillFilter: skillFilter,
                  })
                : [];
          skillInvocation =
            allowTextCommands && skillCommands.length > 0
              ? (0, skill_commands_js_1.resolveSkillCommandInvocation)({
                  commandBodyNormalized: command.commandBodyNormalized,
                  skillCommands: skillCommands,
                })
              : null;
          if (!skillInvocation) {
            return [3 /*break*/, 5];
          }
          if (!command.isAuthorizedSender) {
            (0, globals_js_1.logVerbose)(
              "Ignoring /"
                .concat(skillInvocation.command.name, " from unauthorized sender: ")
                .concat(command.senderId || "<unknown>"),
            );
            typing.cleanup();
            return [2 /*return*/, { kind: "reply", reply: undefined }];
          }
          dispatch_1 = skillInvocation.command.dispatch;
          if (
            !((dispatch_1 === null || dispatch_1 === void 0 ? void 0 : dispatch_1.kind) === "tool")
          ) {
            return [3 /*break*/, 4];
          }
          rawArgs = ((_a = skillInvocation.args) !== null && _a !== void 0 ? _a : "").trim();
          channel =
            (_c =
              (_b = (0, message_channel_js_1.resolveGatewayMessageChannel)(ctx.Surface)) !== null &&
              _b !== void 0
                ? _b
                : (0, message_channel_js_1.resolveGatewayMessageChannel)(ctx.Provider)) !== null &&
            _c !== void 0
              ? _c
              : undefined;
          tools = (0, openclaw_tools_js_1.createOpenClawTools)({
            agentSessionKey: sessionKey,
            agentChannel: channel,
            agentAccountId: ctx.AccountId,
            agentTo: (_d = ctx.OriginatingTo) !== null && _d !== void 0 ? _d : ctx.To,
            agentThreadId: (_e = ctx.MessageThreadId) !== null && _e !== void 0 ? _e : undefined,
            agentDir: agentDir,
            workspaceDir: workspaceDir,
            config: cfg,
          });
          tool = tools.find(function (candidate) {
            return candidate.name === dispatch_1.toolName;
          });
          if (!tool) {
            typing.cleanup();
            return [
              2 /*return*/,
              {
                kind: "reply",
                reply: { text: "\u274C Tool not available: ".concat(dispatch_1.toolName) },
              },
            ];
          }
          toolCallId = "cmd_".concat(Date.now(), "_").concat(Math.random().toString(16).slice(2));
          _k.label = 1;
        case 1:
          _k.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            tool.execute(toolCallId, {
              command: rawArgs,
              commandName: skillInvocation.command.name,
              skillName: skillInvocation.command.skillName,
            }),
          ];
        case 2:
          result = _k.sent();
          text =
            (_f = extractTextFromToolResult(result)) !== null && _f !== void 0 ? _f : "✅ Done.";
          typing.cleanup();
          return [2 /*return*/, { kind: "reply", reply: { text: text } }];
        case 3:
          err_1 = _k.sent();
          message = err_1 instanceof Error ? err_1.message : String(err_1);
          typing.cleanup();
          return [2 /*return*/, { kind: "reply", reply: { text: "\u274C ".concat(message) } }];
        case 4:
          promptParts = [
            'Use the "'.concat(skillInvocation.command.skillName, '" skill for this request.'),
            skillInvocation.args ? "User input:\n".concat(skillInvocation.args) : null,
          ].filter(function (entry) {
            return Boolean(entry);
          });
          rewrittenBody = promptParts.join("\n\n");
          ctx.Body = rewrittenBody;
          ctx.BodyForAgent = rewrittenBody;
          sessionCtx.Body = rewrittenBody;
          sessionCtx.BodyForAgent = rewrittenBody;
          sessionCtx.BodyStripped = rewrittenBody;
          cleanedBody = rewrittenBody;
          _k.label = 5;
        case 5:
          sendInlineReply = function (reply) {
            return __awaiter(_this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    if (!reply) {
                      return [2 /*return*/];
                    }
                    if (!(opts === null || opts === void 0 ? void 0 : opts.onBlockReply)) {
                      return [2 /*return*/];
                    }
                    return [4 /*yield*/, opts.onBlockReply(reply)];
                  case 1:
                    _a.sent();
                    return [2 /*return*/];
                }
              });
            });
          };
          inlineCommand =
            allowTextCommands && command.isAuthorizedSender
              ? (0, reply_inline_js_1.extractInlineSimpleCommand)(cleanedBody)
              : null;
          if (inlineCommand) {
            cleanedBody = inlineCommand.cleaned;
            sessionCtx.Body = cleanedBody;
            sessionCtx.BodyForAgent = cleanedBody;
            sessionCtx.BodyStripped = cleanedBody;
          }
          handleInlineStatus =
            !(0, directive_handling_js_1.isDirectiveOnly)({
              directives: directives,
              cleanedBody: directives.cleaned,
              ctx: ctx,
              cfg: cfg,
              agentId: agentId,
              isGroup: isGroup,
            }) && inlineStatusRequested;
          if (!handleInlineStatus) {
            return [3 /*break*/, 8];
          }
          return [
            4 /*yield*/,
            (0, commands_js_1.buildStatusReply)({
              cfg: cfg,
              command: command,
              sessionEntry: sessionEntry,
              sessionKey: sessionKey,
              sessionScope: sessionScope,
              provider: provider,
              model: model,
              contextTokens: contextTokens,
              resolvedThinkLevel: resolvedThinkLevel,
              resolvedVerboseLevel:
                resolvedVerboseLevel !== null && resolvedVerboseLevel !== void 0
                  ? resolvedVerboseLevel
                  : "off",
              resolvedReasoningLevel: resolvedReasoningLevel,
              resolvedElevatedLevel: resolvedElevatedLevel,
              resolveDefaultThinkingLevel: resolveDefaultThinkingLevel,
              isGroup: isGroup,
              defaultGroupActivation: defaultActivation,
              mediaDecisions: ctx.MediaUnderstandingDecisions,
            }),
          ];
        case 6:
          inlineStatusReply = _k.sent();
          return [4 /*yield*/, sendInlineReply(inlineStatusReply)];
        case 7:
          _k.sent();
          directives = __assign(__assign({}, directives), { hasStatusDirective: false });
          _k.label = 8;
        case 8:
          if (!inlineCommand) {
            return [3 /*break*/, 11];
          }
          inlineCommandContext = __assign(__assign({}, command), {
            rawBodyNormalized: inlineCommand.command,
            commandBodyNormalized: inlineCommand.command,
          });
          return [
            4 /*yield*/,
            (0, commands_js_1.handleCommands)({
              ctx: ctx,
              cfg: cfg,
              command: inlineCommandContext,
              agentId: agentId,
              directives: directives,
              elevated: {
                enabled: elevatedEnabled,
                allowed: elevatedAllowed,
                failures: elevatedFailures,
              },
              sessionEntry: sessionEntry,
              previousSessionEntry: previousSessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
              sessionScope: sessionScope,
              workspaceDir: workspaceDir,
              defaultGroupActivation: defaultActivation,
              resolvedThinkLevel: resolvedThinkLevel,
              resolvedVerboseLevel:
                resolvedVerboseLevel !== null && resolvedVerboseLevel !== void 0
                  ? resolvedVerboseLevel
                  : "off",
              resolvedReasoningLevel: resolvedReasoningLevel,
              resolvedElevatedLevel: resolvedElevatedLevel,
              resolveDefaultThinkingLevel: resolveDefaultThinkingLevel,
              provider: provider,
              model: model,
              contextTokens: contextTokens,
              isGroup: isGroup,
              skillCommands: skillCommands,
            }),
          ];
        case 9:
          inlineResult = _k.sent();
          if (!inlineResult.reply) {
            return [3 /*break*/, 11];
          }
          if (!inlineCommand.cleaned) {
            typing.cleanup();
            return [2 /*return*/, { kind: "reply", reply: inlineResult.reply }];
          }
          return [4 /*yield*/, sendInlineReply(inlineResult.reply)];
        case 10:
          _k.sent();
          _k.label = 11;
        case 11:
          if (!directiveAck) {
            return [3 /*break*/, 13];
          }
          return [4 /*yield*/, sendInlineReply(directiveAck)];
        case 12:
          _k.sent();
          _k.label = 13;
        case 13:
          isEmptyConfig = Object.keys(cfg).length === 0;
          skipWhenConfigEmpty = command.channelId
            ? Boolean(
                (_h =
                  (_g = (0, dock_js_1.getChannelDock)(command.channelId)) === null || _g === void 0
                    ? void 0
                    : _g.commands) === null || _h === void 0
                  ? void 0
                  : _h.skipWhenConfigEmpty,
              )
            : false;
          if (
            skipWhenConfigEmpty &&
            isEmptyConfig &&
            command.from &&
            command.to &&
            command.from !== command.to
          ) {
            typing.cleanup();
            return [2 /*return*/, { kind: "reply", reply: undefined }];
          }
          abortedLastRun = initialAbortedLastRun;
          if (!sessionEntry && command.abortKey) {
            abortedLastRun =
              (_j = (0, abort_js_1.getAbortMemory)(command.abortKey)) !== null && _j !== void 0
                ? _j
                : false;
          }
          return [
            4 /*yield*/,
            (0, commands_js_1.handleCommands)({
              ctx: ctx,
              cfg: cfg,
              command: command,
              agentId: agentId,
              directives: directives,
              elevated: {
                enabled: elevatedEnabled,
                allowed: elevatedAllowed,
                failures: elevatedFailures,
              },
              sessionEntry: sessionEntry,
              previousSessionEntry: previousSessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
              sessionScope: sessionScope,
              workspaceDir: workspaceDir,
              defaultGroupActivation: defaultActivation,
              resolvedThinkLevel: resolvedThinkLevel,
              resolvedVerboseLevel:
                resolvedVerboseLevel !== null && resolvedVerboseLevel !== void 0
                  ? resolvedVerboseLevel
                  : "off",
              resolvedReasoningLevel: resolvedReasoningLevel,
              resolvedElevatedLevel: resolvedElevatedLevel,
              resolveDefaultThinkingLevel: resolveDefaultThinkingLevel,
              provider: provider,
              model: model,
              contextTokens: contextTokens,
              isGroup: isGroup,
              skillCommands: skillCommands,
            }),
          ];
        case 14:
          commandResult = _k.sent();
          if (!commandResult.shouldContinue) {
            typing.cleanup();
            return [2 /*return*/, { kind: "reply", reply: commandResult.reply }];
          }
          return [
            2 /*return*/,
            {
              kind: "continue",
              directives: directives,
              abortedLastRun: abortedLastRun,
            },
          ];
      }
    });
  });
}
