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
exports.runSessionsSendA2AFlow = runSessionsSendA2AFlow;
var node_crypto_1 = require("node:crypto");
var call_js_1 = require("../../gateway/call.js");
var errors_js_1 = require("../../infra/errors.js");
var subsystem_js_1 = require("../../logging/subsystem.js");
var lanes_js_1 = require("../lanes.js");
var agent_step_js_1 = require("./agent-step.js");
var sessions_announce_target_js_1 = require("./sessions-announce-target.js");
var sessions_send_helpers_js_1 = require("./sessions-send-helpers.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("agents/sessions-send");
function runSessionsSendA2AFlow(params) {
  return __awaiter(this, void 0, void 0, function () {
    var runContextId,
      primaryReply,
      latestReply,
      waitMs,
      wait,
      announceTarget,
      targetChannel,
      currentSessionKey,
      nextSessionKey,
      incomingMessage,
      turn,
      currentRole,
      replyPrompt,
      replyText,
      swap,
      announcePrompt,
      announceReply,
      err_1,
      err_2;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          runContextId = (_a = params.waitRunId) !== null && _a !== void 0 ? _a : "unknown";
          _c.label = 1;
        case 1:
          _c.trys.push([1, 15, , 16]);
          primaryReply = params.roundOneReply;
          latestReply = params.roundOneReply;
          if (!(!primaryReply && params.waitRunId)) {
            return [3 /*break*/, 4];
          }
          waitMs = Math.min(params.announceTimeoutMs, 60000);
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              method: "agent.wait",
              params: {
                runId: params.waitRunId,
                timeoutMs: waitMs,
              },
              timeoutMs: waitMs + 2000,
            }),
          ];
        case 2:
          wait = _c.sent();
          if (!((wait === null || wait === void 0 ? void 0 : wait.status) === "ok")) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            (0, agent_step_js_1.readLatestAssistantReply)({
              sessionKey: params.targetSessionKey,
            }),
          ];
        case 3:
          primaryReply = _c.sent();
          latestReply = primaryReply;
          _c.label = 4;
        case 4:
          if (!latestReply) {
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            (0, sessions_announce_target_js_1.resolveAnnounceTarget)({
              sessionKey: params.targetSessionKey,
              displayKey: params.displayKey,
            }),
          ];
        case 5:
          announceTarget = _c.sent();
          targetChannel =
            (_b =
              announceTarget === null || announceTarget === void 0
                ? void 0
                : announceTarget.channel) !== null && _b !== void 0
              ? _b
              : "unknown";
          if (
            !(
              params.maxPingPongTurns > 0 &&
              params.requesterSessionKey &&
              params.requesterSessionKey !== params.targetSessionKey
            )
          ) {
            return [3 /*break*/, 9];
          }
          currentSessionKey = params.requesterSessionKey;
          nextSessionKey = params.targetSessionKey;
          incomingMessage = latestReply;
          turn = 1;
          _c.label = 6;
        case 6:
          if (!(turn <= params.maxPingPongTurns)) {
            return [3 /*break*/, 9];
          }
          currentRole = currentSessionKey === params.requesterSessionKey ? "requester" : "target";
          replyPrompt = (0, sessions_send_helpers_js_1.buildAgentToAgentReplyContext)({
            requesterSessionKey: params.requesterSessionKey,
            requesterChannel: params.requesterChannel,
            targetSessionKey: params.displayKey,
            targetChannel: targetChannel,
            currentRole: currentRole,
            turn: turn,
            maxTurns: params.maxPingPongTurns,
          });
          return [
            4 /*yield*/,
            (0, agent_step_js_1.runAgentStep)({
              sessionKey: currentSessionKey,
              message: incomingMessage,
              extraSystemPrompt: replyPrompt,
              timeoutMs: params.announceTimeoutMs,
              lane: lanes_js_1.AGENT_LANE_NESTED,
            }),
          ];
        case 7:
          replyText = _c.sent();
          if (!replyText || (0, sessions_send_helpers_js_1.isReplySkip)(replyText)) {
            return [3 /*break*/, 9];
          }
          latestReply = replyText;
          incomingMessage = replyText;
          swap = currentSessionKey;
          currentSessionKey = nextSessionKey;
          nextSessionKey = swap;
          _c.label = 8;
        case 8:
          turn += 1;
          return [3 /*break*/, 6];
        case 9:
          announcePrompt = (0, sessions_send_helpers_js_1.buildAgentToAgentAnnounceContext)({
            requesterSessionKey: params.requesterSessionKey,
            requesterChannel: params.requesterChannel,
            targetSessionKey: params.displayKey,
            targetChannel: targetChannel,
            originalMessage: params.message,
            roundOneReply: primaryReply,
            latestReply: latestReply,
          });
          return [
            4 /*yield*/,
            (0, agent_step_js_1.runAgentStep)({
              sessionKey: params.targetSessionKey,
              message: "Agent-to-agent announce step.",
              extraSystemPrompt: announcePrompt,
              timeoutMs: params.announceTimeoutMs,
              lane: lanes_js_1.AGENT_LANE_NESTED,
            }),
          ];
        case 10:
          announceReply = _c.sent();
          if (
            !(
              announceTarget &&
              announceReply &&
              announceReply.trim() &&
              !(0, sessions_send_helpers_js_1.isAnnounceSkip)(announceReply)
            )
          ) {
            return [3 /*break*/, 14];
          }
          _c.label = 11;
        case 11:
          _c.trys.push([11, 13, , 14]);
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              method: "send",
              params: {
                to: announceTarget.to,
                message: announceReply.trim(),
                channel: announceTarget.channel,
                accountId: announceTarget.accountId,
                idempotencyKey: node_crypto_1.default.randomUUID(),
              },
              timeoutMs: 10000,
            }),
          ];
        case 12:
          _c.sent();
          return [3 /*break*/, 14];
        case 13:
          err_1 = _c.sent();
          log.warn("sessions_send announce delivery failed", {
            runId: runContextId,
            channel: announceTarget.channel,
            to: announceTarget.to,
            error: (0, errors_js_1.formatErrorMessage)(err_1),
          });
          return [3 /*break*/, 14];
        case 14:
          return [3 /*break*/, 16];
        case 15:
          err_2 = _c.sent();
          log.warn("sessions_send announce flow failed", {
            runId: runContextId,
            error: (0, errors_js_1.formatErrorMessage)(err_2),
          });
          return [3 /*break*/, 16];
        case 16:
          return [2 /*return*/];
      }
    });
  });
}
