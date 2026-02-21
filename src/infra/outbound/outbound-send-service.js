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
exports.executeSendAction = executeSendAction;
exports.executePollAction = executePollAction;
var message_actions_js_1 = require("../../channels/plugins/message-actions.js");
var sessions_js_1 = require("../../config/sessions.js");
var message_js_1 = require("./message.js");
function extractToolPayload(result) {
  var _a;
  if (result.details !== undefined) {
    return result.details;
  }
  var textBlock = Array.isArray(result.content)
    ? result.content.find(function (block) {
        return (
          block &&
          typeof block === "object" &&
          block.type === "text" &&
          typeof block.text === "string"
        );
      })
    : undefined;
  var text = textBlock === null || textBlock === void 0 ? void 0 : textBlock.text;
  if (text) {
    try {
      return JSON.parse(text);
    } catch (_b) {
      return text;
    }
  }
  return (_a = result.content) !== null && _a !== void 0 ? _a : result;
}
function throwIfAborted(abortSignal) {
  if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
    var err = new Error("Message send aborted");
    err.name = "AbortError";
    throw err;
  }
}
function executeSendAction(params) {
  return __awaiter(this, void 0, void 0, function () {
    var handled, mirrorText, mirrorMediaUrls, result;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          throwIfAborted(params.ctx.abortSignal);
          if (!!params.ctx.dryRun) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            (0, message_actions_js_1.dispatchChannelMessageAction)({
              channel: params.ctx.channel,
              action: "send",
              cfg: params.ctx.cfg,
              params: params.ctx.params,
              accountId: (_a = params.ctx.accountId) !== null && _a !== void 0 ? _a : undefined,
              gateway: params.ctx.gateway,
              toolContext: params.ctx.toolContext,
              dryRun: params.ctx.dryRun,
            }),
          ];
        case 1:
          handled = _g.sent();
          if (!handled) {
            return [3 /*break*/, 4];
          }
          if (!params.ctx.mirror) {
            return [3 /*break*/, 3];
          }
          mirrorText =
            (_b = params.ctx.mirror.text) !== null && _b !== void 0 ? _b : params.message;
          mirrorMediaUrls =
            (_d =
              (_c = params.ctx.mirror.mediaUrls) !== null && _c !== void 0
                ? _c
                : params.mediaUrls) !== null && _d !== void 0
              ? _d
              : params.mediaUrl
                ? [params.mediaUrl]
                : undefined;
          return [
            4 /*yield*/,
            (0, sessions_js_1.appendAssistantMessageToSessionTranscript)({
              agentId: params.ctx.mirror.agentId,
              sessionKey: params.ctx.mirror.sessionKey,
              text: mirrorText,
              mediaUrls: mirrorMediaUrls,
            }),
          ];
        case 2:
          _g.sent();
          _g.label = 3;
        case 3:
          return [
            2 /*return*/,
            {
              handledBy: "plugin",
              payload: extractToolPayload(handled),
              toolResult: handled,
            },
          ];
        case 4:
          throwIfAborted(params.ctx.abortSignal);
          return [
            4 /*yield*/,
            (0, message_js_1.sendMessage)({
              cfg: params.ctx.cfg,
              to: params.to,
              content: params.message,
              mediaUrl: params.mediaUrl || undefined,
              mediaUrls: params.mediaUrls,
              channel: params.ctx.channel || undefined,
              accountId: (_e = params.ctx.accountId) !== null && _e !== void 0 ? _e : undefined,
              gifPlayback: params.gifPlayback,
              dryRun: params.ctx.dryRun,
              bestEffort: (_f = params.bestEffort) !== null && _f !== void 0 ? _f : undefined,
              deps: params.ctx.deps,
              gateway: params.ctx.gateway,
              mirror: params.ctx.mirror,
              abortSignal: params.ctx.abortSignal,
            }),
          ];
        case 5:
          result = _g.sent();
          return [
            2 /*return*/,
            {
              handledBy: "core",
              payload: result,
              sendResult: result,
            },
          ];
      }
    });
  });
}
function executePollAction(params) {
  return __awaiter(this, void 0, void 0, function () {
    var handled, result;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          if (!!params.ctx.dryRun) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, message_actions_js_1.dispatchChannelMessageAction)({
              channel: params.ctx.channel,
              action: "poll",
              cfg: params.ctx.cfg,
              params: params.ctx.params,
              accountId: (_a = params.ctx.accountId) !== null && _a !== void 0 ? _a : undefined,
              gateway: params.ctx.gateway,
              toolContext: params.ctx.toolContext,
              dryRun: params.ctx.dryRun,
            }),
          ];
        case 1:
          handled = _c.sent();
          if (handled) {
            return [
              2 /*return*/,
              {
                handledBy: "plugin",
                payload: extractToolPayload(handled),
                toolResult: handled,
              },
            ];
          }
          _c.label = 2;
        case 2:
          return [
            4 /*yield*/,
            (0, message_js_1.sendPoll)({
              cfg: params.ctx.cfg,
              to: params.to,
              question: params.question,
              options: params.options,
              maxSelections: params.maxSelections,
              durationHours: (_b = params.durationHours) !== null && _b !== void 0 ? _b : undefined,
              channel: params.ctx.channel,
              dryRun: params.ctx.dryRun,
              gateway: params.ctx.gateway,
            }),
          ];
        case 3:
          result = _c.sent();
          return [
            2 /*return*/,
            {
              handledBy: "core",
              payload: result,
              pollResult: result,
            },
          ];
      }
    });
  });
}
