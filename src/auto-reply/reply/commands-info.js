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
exports.handleWhoamiCommand =
  exports.handleContextCommand =
  exports.handleStatusCommand =
  exports.handleCommandsListCommand =
  exports.handleHelpCommand =
    void 0;
exports.buildCommandsPaginationKeyboard = buildCommandsPaginationKeyboard;
var globals_js_1 = require("../../globals.js");
var skill_commands_js_1 = require("../skill-commands.js");
var status_js_1 = require("../status.js");
var commands_status_js_1 = require("./commands-status.js");
var commands_context_report_js_1 = require("./commands-context-report.js");
var handleHelpCommand = function (params, allowTextCommands) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      if (!allowTextCommands) {
        return [2 /*return*/, null];
      }
      if (params.command.commandBodyNormalized !== "/help") {
        return [2 /*return*/, null];
      }
      if (!params.command.isAuthorizedSender) {
        (0, globals_js_1.logVerbose)(
          "Ignoring /help from unauthorized sender: ".concat(
            params.command.senderId || "<unknown>",
          ),
        );
        return [2 /*return*/, { shouldContinue: false }];
      }
      return [
        2 /*return*/,
        {
          shouldContinue: false,
          reply: { text: (0, status_js_1.buildHelpMessage)(params.cfg) },
        },
      ];
    });
  });
};
exports.handleHelpCommand = handleHelpCommand;
var handleCommandsListCommand = function (params, allowTextCommands) {
  return __awaiter(void 0, void 0, void 0, function () {
    var skillCommands, surface, result;
    var _a;
    return __generator(this, function (_b) {
      if (!allowTextCommands) {
        return [2 /*return*/, null];
      }
      if (params.command.commandBodyNormalized !== "/commands") {
        return [2 /*return*/, null];
      }
      if (!params.command.isAuthorizedSender) {
        (0, globals_js_1.logVerbose)(
          "Ignoring /commands from unauthorized sender: ".concat(
            params.command.senderId || "<unknown>",
          ),
        );
        return [2 /*return*/, { shouldContinue: false }];
      }
      skillCommands =
        (_a = params.skillCommands) !== null && _a !== void 0
          ? _a
          : (0, skill_commands_js_1.listSkillCommandsForAgents)({
              cfg: params.cfg,
              agentIds: params.agentId ? [params.agentId] : undefined,
            });
      surface = params.ctx.Surface;
      if (surface === "telegram") {
        result = (0, status_js_1.buildCommandsMessagePaginated)(params.cfg, skillCommands, {
          page: 1,
          surface: surface,
        });
        if (result.totalPages > 1) {
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: {
                text: result.text,
                channelData: {
                  telegram: {
                    buttons: buildCommandsPaginationKeyboard(
                      result.currentPage,
                      result.totalPages,
                      params.agentId,
                    ),
                  },
                },
              },
            },
          ];
        }
        return [
          2 /*return*/,
          {
            shouldContinue: false,
            reply: { text: result.text },
          },
        ];
      }
      return [
        2 /*return*/,
        {
          shouldContinue: false,
          reply: {
            text: (0, status_js_1.buildCommandsMessage)(params.cfg, skillCommands, {
              surface: surface,
            }),
          },
        },
      ];
    });
  });
};
exports.handleCommandsListCommand = handleCommandsListCommand;
function buildCommandsPaginationKeyboard(currentPage, totalPages, agentId) {
  var buttons = [];
  var suffix = agentId ? ":".concat(agentId) : "";
  if (currentPage > 1) {
    buttons.push({
      text: "◀ Prev",
      callback_data: "commands_page_".concat(currentPage - 1).concat(suffix),
    });
  }
  buttons.push({
    text: "".concat(currentPage, "/").concat(totalPages),
    callback_data: "commands_page_noop".concat(suffix),
  });
  if (currentPage < totalPages) {
    buttons.push({
      text: "Next ▶",
      callback_data: "commands_page_".concat(currentPage + 1).concat(suffix),
    });
  }
  return [buttons];
}
var handleStatusCommand = function (params, allowTextCommands) {
  return __awaiter(void 0, void 0, void 0, function () {
    var statusRequested, reply;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!allowTextCommands) {
            return [2 /*return*/, null];
          }
          statusRequested =
            params.directives.hasStatusDirective ||
            params.command.commandBodyNormalized === "/status";
          if (!statusRequested) {
            return [2 /*return*/, null];
          }
          if (!params.command.isAuthorizedSender) {
            (0, globals_js_1.logVerbose)(
              "Ignoring /status from unauthorized sender: ".concat(
                params.command.senderId || "<unknown>",
              ),
            );
            return [2 /*return*/, { shouldContinue: false }];
          }
          return [
            4 /*yield*/,
            (0, commands_status_js_1.buildStatusReply)({
              cfg: params.cfg,
              command: params.command,
              sessionEntry: params.sessionEntry,
              sessionKey: params.sessionKey,
              sessionScope: params.sessionScope,
              provider: params.provider,
              model: params.model,
              contextTokens: params.contextTokens,
              resolvedThinkLevel: params.resolvedThinkLevel,
              resolvedVerboseLevel: params.resolvedVerboseLevel,
              resolvedReasoningLevel: params.resolvedReasoningLevel,
              resolvedElevatedLevel: params.resolvedElevatedLevel,
              resolveDefaultThinkingLevel: params.resolveDefaultThinkingLevel,
              isGroup: params.isGroup,
              defaultGroupActivation: params.defaultGroupActivation,
              mediaDecisions: params.ctx.MediaUnderstandingDecisions,
            }),
          ];
        case 1:
          reply = _a.sent();
          return [2 /*return*/, { shouldContinue: false, reply: reply }];
      }
    });
  });
};
exports.handleStatusCommand = handleStatusCommand;
var handleContextCommand = function (params, allowTextCommands) {
  return __awaiter(void 0, void 0, void 0, function () {
    var normalized;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (!allowTextCommands) {
            return [2 /*return*/, null];
          }
          normalized = params.command.commandBodyNormalized;
          if (normalized !== "/context" && !normalized.startsWith("/context ")) {
            return [2 /*return*/, null];
          }
          if (!params.command.isAuthorizedSender) {
            (0, globals_js_1.logVerbose)(
              "Ignoring /context from unauthorized sender: ".concat(
                params.command.senderId || "<unknown>",
              ),
            );
            return [2 /*return*/, { shouldContinue: false }];
          }
          _a = { shouldContinue: false };
          return [4 /*yield*/, (0, commands_context_report_js_1.buildContextReply)(params)];
        case 1:
          return [2 /*return*/, ((_a.reply = _b.sent()), _a)];
      }
    });
  });
};
exports.handleContextCommand = handleContextCommand;
var handleWhoamiCommand = function (params, allowTextCommands) {
  return __awaiter(void 0, void 0, void 0, function () {
    var senderId, senderUsername, lines, handle;
    var _a, _b;
    return __generator(this, function (_c) {
      if (!allowTextCommands) {
        return [2 /*return*/, null];
      }
      if (params.command.commandBodyNormalized !== "/whoami") {
        return [2 /*return*/, null];
      }
      if (!params.command.isAuthorizedSender) {
        (0, globals_js_1.logVerbose)(
          "Ignoring /whoami from unauthorized sender: ".concat(
            params.command.senderId || "<unknown>",
          ),
        );
        return [2 /*return*/, { shouldContinue: false }];
      }
      senderId = (_a = params.ctx.SenderId) !== null && _a !== void 0 ? _a : "";
      senderUsername = (_b = params.ctx.SenderUsername) !== null && _b !== void 0 ? _b : "";
      lines = ["🧭 Identity", "Channel: ".concat(params.command.channel)];
      if (senderId) {
        lines.push("User id: ".concat(senderId));
      }
      if (senderUsername) {
        handle = senderUsername.startsWith("@") ? senderUsername : "@".concat(senderUsername);
        lines.push("Username: ".concat(handle));
      }
      if (params.ctx.ChatType === "group" && params.ctx.From) {
        lines.push("Chat: ".concat(params.ctx.From));
      }
      if (params.ctx.MessageThreadId != null) {
        lines.push("Thread: ".concat(params.ctx.MessageThreadId));
      }
      if (senderId) {
        lines.push("AllowFrom: ".concat(senderId));
      }
      return [2 /*return*/, { shouldContinue: false, reply: { text: lines.join("\n") } }];
    });
  });
};
exports.handleWhoamiCommand = handleWhoamiCommand;
