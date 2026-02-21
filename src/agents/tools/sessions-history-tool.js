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
exports.createSessionsHistoryTool = createSessionsHistoryTool;
var typebox_1 = require("@sinclair/typebox");
var config_js_1 = require("../../config/config.js");
var call_js_1 = require("../../gateway/call.js");
var session_key_js_1 = require("../../routing/session-key.js");
var common_js_1 = require("./common.js");
var sessions_helpers_js_1 = require("./sessions-helpers.js");
var SessionsHistoryToolSchema = typebox_1.Type.Object({
  sessionKey: typebox_1.Type.String(),
  limit: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 1 })),
  includeTools: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
});
function resolveSandboxSessionToolsVisibility(cfg) {
  var _a, _b, _c, _d;
  return (_d =
    (_c =
      (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null ||
      _b === void 0
        ? void 0
        : _b.sandbox) === null || _c === void 0
      ? void 0
      : _c.sessionToolsVisibility) !== null && _d !== void 0
    ? _d
    : "spawned";
}
function isSpawnedSessionAllowed(params) {
  return __awaiter(this, void 0, void 0, function () {
    var list, sessions, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              method: "sessions.list",
              params: {
                includeGlobal: false,
                includeUnknown: false,
                limit: 500,
                spawnedBy: params.requesterSessionKey,
              },
            }),
          ];
        case 1:
          list = _b.sent();
          sessions = Array.isArray(list === null || list === void 0 ? void 0 : list.sessions)
            ? list.sessions
            : [];
          return [
            2 /*return*/,
            sessions.some(function (entry) {
              return (
                (entry === null || entry === void 0 ? void 0 : entry.key) ===
                params.targetSessionKey
              );
            }),
          ];
        case 2:
          _a = _b.sent();
          return [2 /*return*/, false];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function createSessionsHistoryTool(opts) {
  var _this = this;
  return {
    label: "Session History",
    name: "sessions_history",
    description: "Fetch message history for a session.",
    parameters: SessionsHistoryToolSchema,
    execute: function (_toolCallId, args) {
      return __awaiter(_this, void 0, void 0, function () {
        var params,
          sessionKeyParam,
          cfg,
          _a,
          mainKey,
          alias,
          visibility,
          requesterInternalKey,
          restrictToSpawned,
          resolvedSession,
          resolvedKey,
          displayKey,
          resolvedViaSessionId,
          ok,
          a2aPolicy,
          requesterAgentId,
          targetAgentId,
          isCrossAgent,
          limit,
          includeTools,
          result,
          rawMessages,
          messages;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              params = args;
              sessionKeyParam = (0, common_js_1.readStringParam)(params, "sessionKey", {
                required: true,
              });
              cfg = (0, config_js_1.loadConfig)();
              ((_a = (0, sessions_helpers_js_1.resolveMainSessionAlias)(cfg)),
                (mainKey = _a.mainKey),
                (alias = _a.alias));
              visibility = resolveSandboxSessionToolsVisibility(cfg);
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
              return [
                4 /*yield*/,
                (0, sessions_helpers_js_1.resolveSessionReference)({
                  sessionKey: sessionKeyParam,
                  alias: alias,
                  mainKey: mainKey,
                  requesterInternalKey: requesterInternalKey,
                  restrictToSpawned: restrictToSpawned,
                }),
              ];
            case 1:
              resolvedSession = _b.sent();
              if (!resolvedSession.ok) {
                return [
                  2 /*return*/,
                  (0, common_js_1.jsonResult)({
                    status: resolvedSession.status,
                    error: resolvedSession.error,
                  }),
                ];
              }
              resolvedKey = resolvedSession.key;
              displayKey = resolvedSession.displayKey;
              resolvedViaSessionId = resolvedSession.resolvedViaSessionId;
              if (!(restrictToSpawned && !resolvedViaSessionId)) {
                return [3 /*break*/, 3];
              }
              return [
                4 /*yield*/,
                isSpawnedSessionAllowed({
                  requesterSessionKey: requesterInternalKey,
                  targetSessionKey: resolvedKey,
                }),
              ];
            case 2:
              ok = _b.sent();
              if (!ok) {
                return [
                  2 /*return*/,
                  (0, common_js_1.jsonResult)({
                    status: "forbidden",
                    error: "Session not visible from this sandboxed agent session: ".concat(
                      sessionKeyParam,
                    ),
                  }),
                ];
              }
              _b.label = 3;
            case 3:
              a2aPolicy = (0, sessions_helpers_js_1.createAgentToAgentPolicy)(cfg);
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
                      status: "forbidden",
                      error:
                        "Agent-to-agent history is disabled. Set tools.agentToAgent.enabled=true to allow cross-agent access.",
                    }),
                  ];
                }
                if (!a2aPolicy.isAllowed(requesterAgentId, targetAgentId)) {
                  return [
                    2 /*return*/,
                    (0, common_js_1.jsonResult)({
                      status: "forbidden",
                      error: "Agent-to-agent history denied by tools.agentToAgent.allow.",
                    }),
                  ];
                }
              }
              limit =
                typeof params.limit === "number" && Number.isFinite(params.limit)
                  ? Math.max(1, Math.floor(params.limit))
                  : undefined;
              includeTools = Boolean(params.includeTools);
              return [
                4 /*yield*/,
                (0, call_js_1.callGateway)({
                  method: "chat.history",
                  params: { sessionKey: resolvedKey, limit: limit },
                }),
              ];
            case 4:
              result = _b.sent();
              rawMessages = Array.isArray(
                result === null || result === void 0 ? void 0 : result.messages,
              )
                ? result.messages
                : [];
              messages = includeTools
                ? rawMessages
                : (0, sessions_helpers_js_1.stripToolMessages)(rawMessages);
              return [
                2 /*return*/,
                (0, common_js_1.jsonResult)({
                  sessionKey: displayKey,
                  messages: messages,
                }),
              ];
          }
        });
      });
    },
  };
}
