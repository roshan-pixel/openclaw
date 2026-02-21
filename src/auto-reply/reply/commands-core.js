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
exports.handleCommands = handleCommands;
var globals_js_1 = require("../../globals.js");
var send_policy_js_1 = require("../../sessions/send-policy.js");
var commands_registry_js_1 = require("../commands-registry.js");
var internal_hooks_js_1 = require("../../hooks/internal-hooks.js");
var route_reply_js_1 = require("./route-reply.js");
var commands_bash_js_1 = require("./commands-bash.js");
var commands_compact_js_1 = require("./commands-compact.js");
var commands_config_js_1 = require("./commands-config.js");
var commands_info_js_1 = require("./commands-info.js");
var commands_allowlist_js_1 = require("./commands-allowlist.js");
var commands_approve_js_1 = require("./commands-approve.js");
var commands_subagents_js_1 = require("./commands-subagents.js");
var commands_models_js_1 = require("./commands-models.js");
var commands_tts_js_1 = require("./commands-tts.js");
var commands_session_js_1 = require("./commands-session.js");
var commands_plugin_js_1 = require("./commands-plugin.js");
var HANDLERS = [
  // Plugin commands are processed first, before built-in commands
  commands_plugin_js_1.handlePluginCommand,
  commands_bash_js_1.handleBashCommand,
  commands_session_js_1.handleActivationCommand,
  commands_session_js_1.handleSendPolicyCommand,
  commands_session_js_1.handleUsageCommand,
  commands_session_js_1.handleRestartCommand,
  commands_tts_js_1.handleTtsCommands,
  commands_info_js_1.handleHelpCommand,
  commands_info_js_1.handleCommandsListCommand,
  commands_info_js_1.handleStatusCommand,
  commands_allowlist_js_1.handleAllowlistCommand,
  commands_approve_js_1.handleApproveCommand,
  commands_info_js_1.handleContextCommand,
  commands_info_js_1.handleWhoamiCommand,
  commands_subagents_js_1.handleSubagentsCommand,
  commands_config_js_1.handleConfigCommand,
  commands_config_js_1.handleDebugCommand,
  commands_models_js_1.handleModelsCommand,
  commands_session_js_1.handleStopCommand,
  commands_compact_js_1.handleCompactCommand,
  commands_session_js_1.handleAbortTrigger,
];
function handleCommands(params) {
  return __awaiter(this, void 0, void 0, function () {
    var resetMatch,
      resetRequested,
      commandAction,
      hookEvent,
      channel,
      to,
      hookReply,
      allowTextCommands,
      _i,
      HANDLERS_1,
      handler,
      result,
      sendPolicy;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          resetMatch = params.command.commandBodyNormalized.match(/^\/(new|reset)(?:\s|$)/);
          resetRequested = Boolean(resetMatch);
          if (resetRequested && !params.command.isAuthorizedSender) {
            (0, globals_js_1.logVerbose)(
              "Ignoring /reset from unauthorized sender: ".concat(
                params.command.senderId || "<unknown>",
              ),
            );
            return [2 /*return*/, { shouldContinue: false }];
          }
          if (!(resetRequested && params.command.isAuthorizedSender)) {
            return [3 /*break*/, 3];
          }
          commandAction =
            (_a = resetMatch === null || resetMatch === void 0 ? void 0 : resetMatch[1]) !== null &&
            _a !== void 0
              ? _a
              : "new";
          hookEvent = (0, internal_hooks_js_1.createInternalHookEvent)(
            "command",
            commandAction,
            (_b = params.sessionKey) !== null && _b !== void 0 ? _b : "",
            {
              sessionEntry: params.sessionEntry,
              previousSessionEntry: params.previousSessionEntry,
              commandSource: params.command.surface,
              senderId: params.command.senderId,
              cfg: params.cfg, // Pass config for LLM slug generation
            },
          );
          return [4 /*yield*/, (0, internal_hooks_js_1.triggerInternalHook)(hookEvent)];
        case 1:
          _g.sent();
          if (!(hookEvent.messages.length > 0)) {
            return [3 /*break*/, 3];
          }
          channel = params.ctx.OriginatingChannel || params.command.channel;
          to = params.ctx.OriginatingTo || params.command.from || params.command.to;
          if (!(channel && to)) {
            return [3 /*break*/, 3];
          }
          hookReply = { text: hookEvent.messages.join("\n\n") };
          return [
            4 /*yield*/,
            (0, route_reply_js_1.routeReply)({
              payload: hookReply,
              channel: channel,
              to: to,
              sessionKey: params.sessionKey,
              accountId: params.ctx.AccountId,
              threadId: params.ctx.MessageThreadId,
              cfg: params.cfg,
            }),
          ];
        case 2:
          _g.sent();
          _g.label = 3;
        case 3:
          allowTextCommands = (0, commands_registry_js_1.shouldHandleTextCommands)({
            cfg: params.cfg,
            surface: params.command.surface,
            commandSource: params.ctx.CommandSource,
          });
          ((_i = 0), (HANDLERS_1 = HANDLERS));
          _g.label = 4;
        case 4:
          if (!(_i < HANDLERS_1.length)) {
            return [3 /*break*/, 7];
          }
          handler = HANDLERS_1[_i];
          return [4 /*yield*/, handler(params, allowTextCommands)];
        case 5:
          result = _g.sent();
          if (result) {
            return [2 /*return*/, result];
          }
          _g.label = 6;
        case 6:
          _i++;
          return [3 /*break*/, 4];
        case 7:
          sendPolicy = (0, send_policy_js_1.resolveSendPolicy)({
            cfg: params.cfg,
            entry: params.sessionEntry,
            sessionKey: params.sessionKey,
            channel:
              (_d = (_c = params.sessionEntry) === null || _c === void 0 ? void 0 : _c.channel) !==
                null && _d !== void 0
                ? _d
                : params.command.channel,
            chatType: (_e = params.sessionEntry) === null || _e === void 0 ? void 0 : _e.chatType,
          });
          if (sendPolicy === "deny") {
            (0, globals_js_1.logVerbose)(
              "Send blocked by policy for session ".concat(
                (_f = params.sessionKey) !== null && _f !== void 0 ? _f : "unknown",
              ),
            );
            return [2 /*return*/, { shouldContinue: false }];
          }
          return [2 /*return*/, { shouldContinue: true }];
      }
    });
  });
}
