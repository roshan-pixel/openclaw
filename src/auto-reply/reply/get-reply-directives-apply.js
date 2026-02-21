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
exports.applyInlineDirectiveOverrides = applyInlineDirectiveOverrides;
var commands_js_1 = require("./commands.js");
var directive_handling_js_1 = require("./directive-handling.js");
function applyInlineDirectiveOverrides(params) {
  return __awaiter(this, void 0, void 0, function () {
    var ctx,
      cfg,
      agentId,
      agentDir,
      agentCfg,
      sessionEntry,
      sessionStore,
      sessionKey,
      storePath,
      sessionScope,
      isGroup,
      allowTextCommands,
      command,
      messageProviderKey,
      elevatedEnabled,
      elevatedAllowed,
      elevatedFailures,
      defaultProvider,
      defaultModel,
      aliasIndex,
      modelState,
      initialModelLabel,
      formatModelSwitchEvent,
      resolvedElevatedLevel,
      defaultActivation,
      typing,
      effectiveModelDirective,
      directives,
      provider,
      model,
      contextTokens,
      directiveAck,
      resolvedDefaultThinkLevel_1,
      _a,
      currentThinkLevel,
      currentVerboseLevel,
      currentReasoningLevel,
      currentElevatedLevel,
      directiveReply,
      statusReply,
      hasAnyDirective,
      fastLane,
      persisted,
      perMessageQueueMode,
      perMessageQueueOptions;
    var _this = this;
    var _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          ((ctx = params.ctx),
            (cfg = params.cfg),
            (agentId = params.agentId),
            (agentDir = params.agentDir),
            (agentCfg = params.agentCfg),
            (sessionEntry = params.sessionEntry),
            (sessionStore = params.sessionStore),
            (sessionKey = params.sessionKey),
            (storePath = params.storePath),
            (sessionScope = params.sessionScope),
            (isGroup = params.isGroup),
            (allowTextCommands = params.allowTextCommands),
            (command = params.command),
            (messageProviderKey = params.messageProviderKey),
            (elevatedEnabled = params.elevatedEnabled),
            (elevatedAllowed = params.elevatedAllowed),
            (elevatedFailures = params.elevatedFailures),
            (defaultProvider = params.defaultProvider),
            (defaultModel = params.defaultModel),
            (aliasIndex = params.aliasIndex),
            (modelState = params.modelState),
            (initialModelLabel = params.initialModelLabel),
            (formatModelSwitchEvent = params.formatModelSwitchEvent),
            (resolvedElevatedLevel = params.resolvedElevatedLevel),
            (defaultActivation = params.defaultActivation),
            (typing = params.typing),
            (effectiveModelDirective = params.effectiveModelDirective));
          directives = params.directives;
          ((provider = params.provider), (model = params.model));
          contextTokens = params.contextTokens;
          if (!command.isAuthorizedSender) {
            directives = __assign(__assign({}, directives), {
              hasThinkDirective: false,
              hasVerboseDirective: false,
              hasReasoningDirective: false,
              hasElevatedDirective: false,
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
              hasStatusDirective: false,
              hasModelDirective: false,
              hasQueueDirective: false,
              queueReset: false,
            });
          }
          if (
            !(0, directive_handling_js_1.isDirectiveOnly)({
              directives: directives,
              cleanedBody: directives.cleaned,
              ctx: ctx,
              cfg: cfg,
              agentId: agentId,
              isGroup: isGroup,
            })
          ) {
            return [3 /*break*/, 7];
          }
          if (!command.isAuthorizedSender) {
            typing.cleanup();
            return [2 /*return*/, { kind: "reply", reply: undefined }];
          }
          if (
            !(
              (_c =
                (_b =
                  sessionEntry === null || sessionEntry === void 0
                    ? void 0
                    : sessionEntry.thinkingLevel) !== null && _b !== void 0
                  ? _b
                  : agentCfg === null || agentCfg === void 0
                    ? void 0
                    : agentCfg.thinkingDefault) !== null && _c !== void 0
            )
          ) {
            return [3 /*break*/, 1];
          }
          _a = _c;
          return [3 /*break*/, 3];
        case 1:
          return [4 /*yield*/, modelState.resolveDefaultThinkingLevel()];
        case 2:
          _a = _g.sent();
          _g.label = 3;
        case 3:
          resolvedDefaultThinkLevel_1 = _a;
          currentThinkLevel = resolvedDefaultThinkLevel_1;
          currentVerboseLevel =
            (_d =
              sessionEntry === null || sessionEntry === void 0
                ? void 0
                : sessionEntry.verboseLevel) !== null && _d !== void 0
              ? _d
              : agentCfg === null || agentCfg === void 0
                ? void 0
                : agentCfg.verboseDefault;
          currentReasoningLevel =
            (_e =
              sessionEntry === null || sessionEntry === void 0
                ? void 0
                : sessionEntry.reasoningLevel) !== null && _e !== void 0
              ? _e
              : "off";
          currentElevatedLevel =
            (_f =
              sessionEntry === null || sessionEntry === void 0
                ? void 0
                : sessionEntry.elevatedLevel) !== null && _f !== void 0
              ? _f
              : agentCfg === null || agentCfg === void 0
                ? void 0
                : agentCfg.elevatedDefault;
          return [
            4 /*yield*/,
            (0, directive_handling_js_1.handleDirectiveOnly)({
              cfg: cfg,
              directives: directives,
              sessionEntry: sessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
              elevatedEnabled: elevatedEnabled,
              elevatedAllowed: elevatedAllowed,
              elevatedFailures: elevatedFailures,
              messageProviderKey: messageProviderKey,
              defaultProvider: defaultProvider,
              defaultModel: defaultModel,
              aliasIndex: aliasIndex,
              allowedModelKeys: modelState.allowedModelKeys,
              allowedModelCatalog: modelState.allowedModelCatalog,
              resetModelOverride: modelState.resetModelOverride,
              provider: provider,
              model: model,
              initialModelLabel: initialModelLabel,
              formatModelSwitchEvent: formatModelSwitchEvent,
              currentThinkLevel: currentThinkLevel,
              currentVerboseLevel: currentVerboseLevel,
              currentReasoningLevel: currentReasoningLevel,
              currentElevatedLevel: currentElevatedLevel,
            }),
          ];
        case 4:
          directiveReply = _g.sent();
          statusReply = void 0;
          if (!(directives.hasStatusDirective && allowTextCommands && command.isAuthorizedSender)) {
            return [3 /*break*/, 6];
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
              resolvedThinkLevel: resolvedDefaultThinkLevel_1,
              resolvedVerboseLevel:
                currentVerboseLevel !== null && currentVerboseLevel !== void 0
                  ? currentVerboseLevel
                  : "off",
              resolvedReasoningLevel:
                currentReasoningLevel !== null && currentReasoningLevel !== void 0
                  ? currentReasoningLevel
                  : "off",
              resolvedElevatedLevel: resolvedElevatedLevel,
              resolveDefaultThinkingLevel: function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    return [2 /*return*/, resolvedDefaultThinkLevel_1];
                  });
                });
              },
              isGroup: isGroup,
              defaultGroupActivation: defaultActivation,
              mediaDecisions: ctx.MediaUnderstandingDecisions,
            }),
          ];
        case 5:
          statusReply = _g.sent();
          _g.label = 6;
        case 6:
          typing.cleanup();
          if (
            (statusReply === null || statusReply === void 0 ? void 0 : statusReply.text) &&
            (directiveReply === null || directiveReply === void 0 ? void 0 : directiveReply.text)
          ) {
            return [
              2 /*return*/,
              {
                kind: "reply",
                reply: { text: "".concat(directiveReply.text, "\n").concat(statusReply.text) },
              },
            ];
          }
          return [
            2 /*return*/,
            {
              kind: "reply",
              reply: statusReply !== null && statusReply !== void 0 ? statusReply : directiveReply,
            },
          ];
        case 7:
          hasAnyDirective =
            directives.hasThinkDirective ||
            directives.hasVerboseDirective ||
            directives.hasReasoningDirective ||
            directives.hasElevatedDirective ||
            directives.hasExecDirective ||
            directives.hasModelDirective ||
            directives.hasQueueDirective ||
            directives.hasStatusDirective;
          if (!(hasAnyDirective && command.isAuthorizedSender)) {
            return [3 /*break*/, 9];
          }
          return [
            4 /*yield*/,
            (0, directive_handling_js_1.applyInlineDirectivesFastLane)({
              directives: directives,
              commandAuthorized: command.isAuthorizedSender,
              ctx: ctx,
              cfg: cfg,
              agentId: agentId,
              isGroup: isGroup,
              sessionEntry: sessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
              elevatedEnabled: elevatedEnabled,
              elevatedAllowed: elevatedAllowed,
              elevatedFailures: elevatedFailures,
              messageProviderKey: messageProviderKey,
              defaultProvider: defaultProvider,
              defaultModel: defaultModel,
              aliasIndex: aliasIndex,
              allowedModelKeys: modelState.allowedModelKeys,
              allowedModelCatalog: modelState.allowedModelCatalog,
              resetModelOverride: modelState.resetModelOverride,
              provider: provider,
              model: model,
              initialModelLabel: initialModelLabel,
              formatModelSwitchEvent: formatModelSwitchEvent,
              agentCfg: agentCfg,
              modelState: {
                resolveDefaultThinkingLevel: modelState.resolveDefaultThinkingLevel,
                allowedModelKeys: modelState.allowedModelKeys,
                allowedModelCatalog: modelState.allowedModelCatalog,
                resetModelOverride: modelState.resetModelOverride,
              },
            }),
          ];
        case 8:
          fastLane = _g.sent();
          directiveAck = fastLane.directiveAck;
          provider = fastLane.provider;
          model = fastLane.model;
          _g.label = 9;
        case 9:
          return [
            4 /*yield*/,
            (0, directive_handling_js_1.persistInlineDirectives)({
              directives: directives,
              effectiveModelDirective: effectiveModelDirective,
              cfg: cfg,
              agentDir: agentDir,
              sessionEntry: sessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
              elevatedEnabled: elevatedEnabled,
              elevatedAllowed: elevatedAllowed,
              defaultProvider: defaultProvider,
              defaultModel: defaultModel,
              aliasIndex: aliasIndex,
              allowedModelKeys: modelState.allowedModelKeys,
              provider: provider,
              model: model,
              initialModelLabel: initialModelLabel,
              formatModelSwitchEvent: formatModelSwitchEvent,
              agentCfg: agentCfg,
            }),
          ];
        case 10:
          persisted = _g.sent();
          provider = persisted.provider;
          model = persisted.model;
          contextTokens = persisted.contextTokens;
          perMessageQueueMode =
            directives.hasQueueDirective && !directives.queueReset
              ? directives.queueMode
              : undefined;
          perMessageQueueOptions =
            directives.hasQueueDirective && !directives.queueReset
              ? {
                  debounceMs: directives.debounceMs,
                  cap: directives.cap,
                  dropPolicy: directives.dropPolicy,
                }
              : undefined;
          return [
            2 /*return*/,
            {
              kind: "continue",
              directives: directives,
              provider: provider,
              model: model,
              contextTokens: contextTokens,
              directiveAck: directiveAck,
              perMessageQueueMode: perMessageQueueMode,
              perMessageQueueOptions: perMessageQueueOptions,
            },
          ];
      }
    });
  });
}
