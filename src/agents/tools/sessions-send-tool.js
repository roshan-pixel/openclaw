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
exports.createSessionsSendTool = createSessionsSendTool;
var node_crypto_1 = require("node:crypto");
var typebox_1 = require("@sinclair/typebox");
var config_js_1 = require("../../config/config.js");
var call_js_1 = require("../../gateway/call.js");
var session_key_js_1 = require("../../routing/session-key.js");
var session_label_js_1 = require("../../sessions/session-label.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var lanes_js_1 = require("../lanes.js");
var common_js_1 = require("./common.js");
var sessions_helpers_js_1 = require("./sessions-helpers.js");
var sessions_send_helpers_js_1 = require("./sessions-send-helpers.js");
var sessions_send_tool_a2a_js_1 = require("./sessions-send-tool.a2a.js");
var SessionsSendToolSchema = typebox_1.Type.Object({
  sessionKey: typebox_1.Type.Optional(typebox_1.Type.String()),
  label: typebox_1.Type.Optional(
    typebox_1.Type.String({ minLength: 1, maxLength: session_label_js_1.SESSION_LABEL_MAX_LENGTH }),
  ),
  agentId: typebox_1.Type.Optional(typebox_1.Type.String({ minLength: 1, maxLength: 64 })),
  message: typebox_1.Type.String(),
  timeoutSeconds: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0 })),
});
function createSessionsSendTool(opts) {
  var _this = this;
  return {
    label: "Session Send",
    name: "sessions_send",
    description:
      "Send a message into another session. Use sessionKey or label to identify the target.",
    parameters: SessionsSendToolSchema,
    execute: function (_toolCallId, args) {
      return __awaiter(_this, void 0, void 0, function () {
        var params,
          message,
          cfg,
          _a,
          mainKey,
          alias,
          visibility,
          requesterInternalKey,
          restrictToSpawned,
          a2aPolicy,
          sessionKeyParam,
          labelParam,
          labelAgentIdParam,
          listSessions,
          sessionKey,
          requesterAgentId_1,
          requestedAgentId,
          resolveParams,
          resolvedKey_1,
          resolved,
          err_1,
          msg,
          resolvedSession,
          resolvedKey,
          displayKey,
          resolvedViaSessionId,
          sessions,
          ok,
          timeoutSeconds,
          timeoutMs,
          announceTimeoutMs,
          idempotencyKey,
          runId,
          requesterAgentId,
          targetAgentId,
          isCrossAgent,
          agentMessageContext,
          sendParams,
          requesterSessionKey,
          requesterChannel,
          maxPingPongTurns,
          delivery,
          startA2AFlow,
          response,
          err_2,
          messageText,
          response,
          err_3,
          messageText,
          waitStatus,
          waitError,
          wait,
          err_4,
          messageText,
          history,
          filtered,
          last,
          reply;
        var _this = this;
        var _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
          switch (_h.label) {
            case 0:
              params = args;
              message = (0, common_js_1.readStringParam)(params, "message", { required: true });
              cfg = (0, config_js_1.loadConfig)();
              ((_a = (0, sessions_helpers_js_1.resolveMainSessionAlias)(cfg)),
                (mainKey = _a.mainKey),
                (alias = _a.alias));
              visibility =
                (_e =
                  (_d =
                    (_c = (_b = cfg.agents) === null || _b === void 0 ? void 0 : _b.defaults) ===
                      null || _c === void 0
                      ? void 0
                      : _c.sandbox) === null || _d === void 0
                    ? void 0
                    : _d.sessionToolsVisibility) !== null && _e !== void 0
                  ? _e
                  : "spawned";
              requesterInternalKey =
                typeof (opts === null || opts === void 0 ? void 0 : opts.agentSessionKey) ===
                  "string" && opts.agentSessionKey.trim()
                  ? (0, sessions_helpers_js_1.resolveInternalSessionKey)({
                      key: opts.agentSessionKey,
                      alias: alias,
                      mainKey: mainKey,
                    })
                  : undefined;
              restrictToSpawned =
                (opts === null || opts === void 0 ? void 0 : opts.sandboxed) === true &&
                visibility === "spawned" &&
                !!requesterInternalKey &&
                !(0, session_key_js_1.isSubagentSessionKey)(requesterInternalKey);
              a2aPolicy = (0, sessions_helpers_js_1.createAgentToAgentPolicy)(cfg);
              sessionKeyParam = (0, common_js_1.readStringParam)(params, "sessionKey");
              labelParam =
                ((_f = (0, common_js_1.readStringParam)(params, "label")) === null || _f === void 0
                  ? void 0
                  : _f.trim()) || undefined;
              labelAgentIdParam =
                ((_g = (0, common_js_1.readStringParam)(params, "agentId")) === null ||
                _g === void 0
                  ? void 0
                  : _g.trim()) || undefined;
              if (sessionKeyParam && labelParam) {
                return [
                  2 /*return*/,
                  (0, common_js_1.jsonResult)({
                    runId: node_crypto_1.default.randomUUID(),
                    status: "error",
                    error: "Provide either sessionKey or label (not both).",
                  }),
                ];
              }
              listSessions = function (listParams) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [
                          4 /*yield*/,
                          (0, call_js_1.callGateway)({
                            method: "sessions.list",
                            params: listParams,
                            timeoutMs: 10000,
                          }),
                        ];
                      case 1:
                        result = _a.sent();
                        return [
                          2 /*return*/,
                          Array.isArray(
                            result === null || result === void 0 ? void 0 : result.sessions,
                          )
                            ? result.sessions
                            : [],
                        ];
                    }
                  });
                });
              };
              sessionKey = sessionKeyParam;
              if (!(!sessionKey && labelParam)) {
                return [3 /*break*/, 5];
              }
              requesterAgentId_1 = requesterInternalKey
                ? (0, session_key_js_1.resolveAgentIdFromSessionKey)(requesterInternalKey)
                : undefined;
              requestedAgentId = labelAgentIdParam
                ? (0, session_key_js_1.normalizeAgentId)(labelAgentIdParam)
                : undefined;
              if (
                restrictToSpawned &&
                requestedAgentId &&
                requesterAgentId_1 &&
                requestedAgentId !== requesterAgentId_1
              ) {
                return [
                  2 /*return*/,
                  (0, common_js_1.jsonResult)({
                    runId: node_crypto_1.default.randomUUID(),
                    status: "forbidden",
                    error: "Sandboxed sessions_send label lookup is limited to this agent",
                  }),
                ];
              }
              if (
                requesterAgentId_1 &&
                requestedAgentId &&
                requestedAgentId !== requesterAgentId_1
              ) {
                if (!a2aPolicy.enabled) {
                  return [
                    2 /*return*/,
                    (0, common_js_1.jsonResult)({
                      runId: node_crypto_1.default.randomUUID(),
                      status: "forbidden",
                      error:
                        "Agent-to-agent messaging is disabled. Set tools.agentToAgent.enabled=true to allow cross-agent sends.",
                    }),
                  ];
                }
                if (!a2aPolicy.isAllowed(requesterAgentId_1, requestedAgentId)) {
                  return [
                    2 /*return*/,
                    (0, common_js_1.jsonResult)({
                      runId: node_crypto_1.default.randomUUID(),
                      status: "forbidden",
                      error: "Agent-to-agent messaging denied by tools.agentToAgent.allow.",
                    }),
                  ];
                }
              }
              resolveParams = __assign(
                __assign(
                  { label: labelParam },
                  requestedAgentId ? { agentId: requestedAgentId } : {},
                ),
                restrictToSpawned ? { spawnedBy: requesterInternalKey } : {},
              );
              resolvedKey_1 = "";
              _h.label = 1;
            case 1:
              _h.trys.push([1, 3, , 4]);
              return [
                4 /*yield*/,
                (0, call_js_1.callGateway)({
                  method: "sessions.resolve",
                  params: resolveParams,
                  timeoutMs: 10000,
                }),
              ];
            case 2:
              resolved = _h.sent();
              resolvedKey_1 =
                typeof (resolved === null || resolved === void 0 ? void 0 : resolved.key) ===
                "string"
                  ? resolved.key.trim()
                  : "";
              return [3 /*break*/, 4];
            case 3:
              err_1 = _h.sent();
              msg = err_1 instanceof Error ? err_1.message : String(err_1);
              if (restrictToSpawned) {
                return [
                  2 /*return*/,
                  (0, common_js_1.jsonResult)({
                    runId: node_crypto_1.default.randomUUID(),
                    status: "forbidden",
                    error: "Session not visible from this sandboxed agent session.",
                  }),
                ];
              }
              return [
                2 /*return*/,
                (0, common_js_1.jsonResult)({
                  runId: node_crypto_1.default.randomUUID(),
                  status: "error",
                  error: msg || "No session found with label: ".concat(labelParam),
                }),
              ];
            case 4:
              if (!resolvedKey_1) {
                if (restrictToSpawned) {
                  return [
                    2 /*return*/,
                    (0, common_js_1.jsonResult)({
                      runId: node_crypto_1.default.randomUUID(),
                      status: "forbidden",
                      error: "Session not visible from this sandboxed agent session.",
                    }),
                  ];
                }
                return [
                  2 /*return*/,
                  (0, common_js_1.jsonResult)({
                    runId: node_crypto_1.default.randomUUID(),
                    status: "error",
                    error: "No session found with label: ".concat(labelParam),
                  }),
                ];
              }
              sessionKey = resolvedKey_1;
              _h.label = 5;
            case 5:
              if (!sessionKey) {
                return [
                  2 /*return*/,
                  (0, common_js_1.jsonResult)({
                    runId: node_crypto_1.default.randomUUID(),
                    status: "error",
                    error: "Either sessionKey or label is required",
                  }),
                ];
              }
              return [
                4 /*yield*/,
                (0, sessions_helpers_js_1.resolveSessionReference)({
                  sessionKey: sessionKey,
                  alias: alias,
                  mainKey: mainKey,
                  requesterInternalKey: requesterInternalKey,
                  restrictToSpawned: restrictToSpawned,
                }),
              ];
            case 6:
              resolvedSession = _h.sent();
              if (!resolvedSession.ok) {
                return [
                  2 /*return*/,
                  (0, common_js_1.jsonResult)({
                    runId: node_crypto_1.default.randomUUID(),
                    status: resolvedSession.status,
                    error: resolvedSession.error,
                  }),
                ];
              }
              resolvedKey = resolvedSession.key;
              displayKey = resolvedSession.displayKey;
              resolvedViaSessionId = resolvedSession.resolvedViaSessionId;
              if (!(restrictToSpawned && !resolvedViaSessionId)) {
                return [3 /*break*/, 8];
              }
              return [
                4 /*yield*/,
                listSessions({
                  includeGlobal: false,
                  includeUnknown: false,
                  limit: 500,
                  spawnedBy: requesterInternalKey,
                }),
              ];
            case 7:
              sessions = _h.sent();
              ok = sessions.some(function (entry) {
                return (entry === null || entry === void 0 ? void 0 : entry.key) === resolvedKey;
              });
              if (!ok) {
                return [
                  2 /*return*/,
                  (0, common_js_1.jsonResult)({
                    runId: node_crypto_1.default.randomUUID(),
                    status: "forbidden",
                    error: "Session not visible from this sandboxed agent session: ".concat(
                      sessionKey,
                    ),
                    sessionKey: displayKey,
                  }),
                ];
              }
              _h.label = 8;
            case 8:
              timeoutSeconds =
                typeof params.timeoutSeconds === "number" && Number.isFinite(params.timeoutSeconds)
                  ? Math.max(0, Math.floor(params.timeoutSeconds))
                  : 30;
              timeoutMs = timeoutSeconds * 1000;
              announceTimeoutMs = timeoutSeconds === 0 ? 30000 : timeoutMs;
              idempotencyKey = node_crypto_1.default.randomUUID();
              runId = idempotencyKey;
              requesterAgentId = (0, session_key_js_1.resolveAgentIdFromSessionKey)(
                requesterInternalKey,
              );
              targetAgentId = (0, session_key_js_1.resolveAgentIdFromSessionKey)(resolvedKey);
              isCrossAgent = requesterAgentId !== targetAgentId;
              if (isCrossAgent) {
                if (!a2aPolicy.enabled) {
                  return [
                    2 /*return*/,
                    (0, common_js_1.jsonResult)({
                      runId: node_crypto_1.default.randomUUID(),
                      status: "forbidden",
                      error:
                        "Agent-to-agent messaging is disabled. Set tools.agentToAgent.enabled=true to allow cross-agent sends.",
                      sessionKey: displayKey,
                    }),
                  ];
                }
                if (!a2aPolicy.isAllowed(requesterAgentId, targetAgentId)) {
                  return [
                    2 /*return*/,
                    (0, common_js_1.jsonResult)({
                      runId: node_crypto_1.default.randomUUID(),
                      status: "forbidden",
                      error: "Agent-to-agent messaging denied by tools.agentToAgent.allow.",
                      sessionKey: displayKey,
                    }),
                  ];
                }
              }
              agentMessageContext = (0, sessions_send_helpers_js_1.buildAgentToAgentMessageContext)(
                {
                  requesterSessionKey:
                    opts === null || opts === void 0 ? void 0 : opts.agentSessionKey,
                  requesterChannel: opts === null || opts === void 0 ? void 0 : opts.agentChannel,
                  targetSessionKey: displayKey,
                },
              );
              sendParams = {
                message: message,
                sessionKey: resolvedKey,
                idempotencyKey: idempotencyKey,
                deliver: false,
                channel: message_channel_js_1.INTERNAL_MESSAGE_CHANNEL,
                lane: lanes_js_1.AGENT_LANE_NESTED,
                extraSystemPrompt: agentMessageContext,
              };
              requesterSessionKey =
                opts === null || opts === void 0 ? void 0 : opts.agentSessionKey;
              requesterChannel = opts === null || opts === void 0 ? void 0 : opts.agentChannel;
              maxPingPongTurns = (0, sessions_send_helpers_js_1.resolvePingPongTurns)(cfg);
              delivery = { status: "pending", mode: "announce" };
              startA2AFlow = function (roundOneReply, waitRunId) {
                void (0, sessions_send_tool_a2a_js_1.runSessionsSendA2AFlow)({
                  targetSessionKey: resolvedKey,
                  displayKey: displayKey,
                  message: message,
                  announceTimeoutMs: announceTimeoutMs,
                  maxPingPongTurns: maxPingPongTurns,
                  requesterSessionKey: requesterSessionKey,
                  requesterChannel: requesterChannel,
                  roundOneReply: roundOneReply,
                  waitRunId: waitRunId,
                });
              };
              if (!(timeoutSeconds === 0)) {
                return [3 /*break*/, 12];
              }
              _h.label = 9;
            case 9:
              _h.trys.push([9, 11, , 12]);
              return [
                4 /*yield*/,
                (0, call_js_1.callGateway)({
                  method: "agent",
                  params: sendParams,
                  timeoutMs: 10000,
                }),
              ];
            case 10:
              response = _h.sent();
              if (
                typeof (response === null || response === void 0 ? void 0 : response.runId) ===
                  "string" &&
                response.runId
              ) {
                runId = response.runId;
              }
              startA2AFlow(undefined, runId);
              return [
                2 /*return*/,
                (0, common_js_1.jsonResult)({
                  runId: runId,
                  status: "accepted",
                  sessionKey: displayKey,
                  delivery: delivery,
                }),
              ];
            case 11:
              err_2 = _h.sent();
              messageText =
                err_2 instanceof Error
                  ? err_2.message
                  : typeof err_2 === "string"
                    ? err_2
                    : "error";
              return [
                2 /*return*/,
                (0, common_js_1.jsonResult)({
                  runId: runId,
                  status: "error",
                  error: messageText,
                  sessionKey: displayKey,
                }),
              ];
            case 12:
              _h.trys.push([12, 14, , 15]);
              return [
                4 /*yield*/,
                (0, call_js_1.callGateway)({
                  method: "agent",
                  params: sendParams,
                  timeoutMs: 10000,
                }),
              ];
            case 13:
              response = _h.sent();
              if (
                typeof (response === null || response === void 0 ? void 0 : response.runId) ===
                  "string" &&
                response.runId
              ) {
                runId = response.runId;
              }
              return [3 /*break*/, 15];
            case 14:
              err_3 = _h.sent();
              messageText =
                err_3 instanceof Error
                  ? err_3.message
                  : typeof err_3 === "string"
                    ? err_3
                    : "error";
              return [
                2 /*return*/,
                (0, common_js_1.jsonResult)({
                  runId: runId,
                  status: "error",
                  error: messageText,
                  sessionKey: displayKey,
                }),
              ];
            case 15:
              _h.trys.push([15, 17, , 18]);
              return [
                4 /*yield*/,
                (0, call_js_1.callGateway)({
                  method: "agent.wait",
                  params: {
                    runId: runId,
                    timeoutMs: timeoutMs,
                  },
                  timeoutMs: timeoutMs + 2000,
                }),
              ];
            case 16:
              wait = _h.sent();
              waitStatus =
                typeof (wait === null || wait === void 0 ? void 0 : wait.status) === "string"
                  ? wait.status
                  : undefined;
              waitError =
                typeof (wait === null || wait === void 0 ? void 0 : wait.error) === "string"
                  ? wait.error
                  : undefined;
              return [3 /*break*/, 18];
            case 17:
              err_4 = _h.sent();
              messageText =
                err_4 instanceof Error
                  ? err_4.message
                  : typeof err_4 === "string"
                    ? err_4
                    : "error";
              return [
                2 /*return*/,
                (0, common_js_1.jsonResult)({
                  runId: runId,
                  status: messageText.includes("gateway timeout") ? "timeout" : "error",
                  error: messageText,
                  sessionKey: displayKey,
                }),
              ];
            case 18:
              if (waitStatus === "timeout") {
                return [
                  2 /*return*/,
                  (0, common_js_1.jsonResult)({
                    runId: runId,
                    status: "timeout",
                    error: waitError,
                    sessionKey: displayKey,
                  }),
                ];
              }
              if (waitStatus === "error") {
                return [
                  2 /*return*/,
                  (0, common_js_1.jsonResult)({
                    runId: runId,
                    status: "error",
                    error: waitError !== null && waitError !== void 0 ? waitError : "agent error",
                    sessionKey: displayKey,
                  }),
                ];
              }
              return [
                4 /*yield*/,
                (0, call_js_1.callGateway)({
                  method: "chat.history",
                  params: { sessionKey: resolvedKey, limit: 50 },
                }),
              ];
            case 19:
              history = _h.sent();
              filtered = (0, sessions_helpers_js_1.stripToolMessages)(
                Array.isArray(history === null || history === void 0 ? void 0 : history.messages)
                  ? history.messages
                  : [],
              );
              last = filtered.length > 0 ? filtered[filtered.length - 1] : undefined;
              reply = last ? (0, sessions_helpers_js_1.extractAssistantText)(last) : undefined;
              startA2AFlow(reply !== null && reply !== void 0 ? reply : undefined);
              return [
                2 /*return*/,
                (0, common_js_1.jsonResult)({
                  runId: runId,
                  status: "ok",
                  reply: reply,
                  sessionKey: displayKey,
                  delivery: delivery,
                }),
              ];
          }
        });
      });
    },
  };
}
