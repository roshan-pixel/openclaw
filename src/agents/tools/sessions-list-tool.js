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
exports.createSessionsListTool = createSessionsListTool;
var node_path_1 = require("node:path");
var typebox_1 = require("@sinclair/typebox");
var config_js_1 = require("../../config/config.js");
var call_js_1 = require("../../gateway/call.js");
var session_key_js_1 = require("../../routing/session-key.js");
var common_js_1 = require("./common.js");
var sessions_helpers_js_1 = require("./sessions-helpers.js");
var SessionsListToolSchema = typebox_1.Type.Object({
  kinds: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
  limit: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 1 })),
  activeMinutes: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 1 })),
  messageLimit: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0 })),
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
function createSessionsListTool(opts) {
  var _this = this;
  return {
    label: "Sessions",
    name: "sessions_list",
    description: "List sessions with optional filters and last messages.",
    parameters: SessionsListToolSchema,
    execute: function (_toolCallId, args) {
      return __awaiter(_this, void 0, void 0, function () {
        var params,
          cfg,
          _a,
          mainKey,
          alias,
          visibility,
          requesterInternalKey,
          restrictToSpawned,
          kindsRaw,
          allowedKindsList,
          allowedKinds,
          limit,
          activeMinutes,
          messageLimitRaw,
          messageLimit,
          list,
          sessions,
          storePath,
          a2aPolicy,
          requesterAgentId,
          rows,
          _i,
          sessions_1,
          entry,
          key,
          entryAgentId,
          crossAgent,
          gatewayKind,
          kind,
          displayKey,
          entryChannel,
          deliveryContext,
          deliveryChannel,
          deliveryTo,
          deliveryAccountId,
          lastChannel,
          lastAccountId,
          derivedChannel,
          sessionId,
          transcriptPath,
          row,
          resolvedKey,
          history_1,
          rawMessages,
          filtered;
        var _b;
        return __generator(this, function (_c) {
          switch (_c.label) {
            case 0:
              params = args;
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
                requesterInternalKey &&
                !(0, session_key_js_1.isSubagentSessionKey)(requesterInternalKey);
              kindsRaw =
                (_b = (0, common_js_1.readStringArrayParam)(params, "kinds")) === null ||
                _b === void 0
                  ? void 0
                  : _b.map(function (value) {
                      return value.trim().toLowerCase();
                    });
              allowedKindsList = (kindsRaw !== null && kindsRaw !== void 0 ? kindsRaw : []).filter(
                function (value) {
                  return ["main", "group", "cron", "hook", "node", "other"].includes(value);
                },
              );
              allowedKinds = allowedKindsList.length ? new Set(allowedKindsList) : undefined;
              limit =
                typeof params.limit === "number" && Number.isFinite(params.limit)
                  ? Math.max(1, Math.floor(params.limit))
                  : undefined;
              activeMinutes =
                typeof params.activeMinutes === "number" && Number.isFinite(params.activeMinutes)
                  ? Math.max(1, Math.floor(params.activeMinutes))
                  : undefined;
              messageLimitRaw =
                typeof params.messageLimit === "number" && Number.isFinite(params.messageLimit)
                  ? Math.max(0, Math.floor(params.messageLimit))
                  : 0;
              messageLimit = Math.min(messageLimitRaw, 20);
              return [
                4 /*yield*/,
                (0, call_js_1.callGateway)({
                  method: "sessions.list",
                  params: {
                    limit: limit,
                    activeMinutes: activeMinutes,
                    includeGlobal: !restrictToSpawned,
                    includeUnknown: !restrictToSpawned,
                    spawnedBy: restrictToSpawned ? requesterInternalKey : undefined,
                  },
                }),
              ];
            case 1:
              list = _c.sent();
              sessions = Array.isArray(list === null || list === void 0 ? void 0 : list.sessions)
                ? list.sessions
                : [];
              storePath =
                typeof (list === null || list === void 0 ? void 0 : list.path) === "string"
                  ? list.path
                  : undefined;
              a2aPolicy = (0, sessions_helpers_js_1.createAgentToAgentPolicy)(cfg);
              requesterAgentId = (0, session_key_js_1.resolveAgentIdFromSessionKey)(
                requesterInternalKey,
              );
              rows = [];
              ((_i = 0), (sessions_1 = sessions));
              _c.label = 2;
            case 2:
              if (!(_i < sessions_1.length)) {
                return [3 /*break*/, 6];
              }
              entry = sessions_1[_i];
              if (!entry || typeof entry !== "object") {
                return [3 /*break*/, 5];
              }
              key = typeof entry.key === "string" ? entry.key : "";
              if (!key) {
                return [3 /*break*/, 5];
              }
              entryAgentId = (0, session_key_js_1.resolveAgentIdFromSessionKey)(key);
              crossAgent = entryAgentId !== requesterAgentId;
              if (crossAgent && !a2aPolicy.isAllowed(requesterAgentId, entryAgentId)) {
                return [3 /*break*/, 5];
              }
              if (key === "unknown") {
                return [3 /*break*/, 5];
              }
              if (key === "global" && alias !== "global") {
                return [3 /*break*/, 5];
              }
              gatewayKind = typeof entry.kind === "string" ? entry.kind : undefined;
              kind = (0, sessions_helpers_js_1.classifySessionKind)({
                key: key,
                gatewayKind: gatewayKind,
                alias: alias,
                mainKey: mainKey,
              });
              if (allowedKinds && !allowedKinds.has(kind)) {
                return [3 /*break*/, 5];
              }
              displayKey = (0, sessions_helpers_js_1.resolveDisplaySessionKey)({
                key: key,
                alias: alias,
                mainKey: mainKey,
              });
              entryChannel = typeof entry.channel === "string" ? entry.channel : undefined;
              deliveryContext =
                entry.deliveryContext && typeof entry.deliveryContext === "object"
                  ? entry.deliveryContext
                  : undefined;
              deliveryChannel =
                typeof (deliveryContext === null || deliveryContext === void 0
                  ? void 0
                  : deliveryContext.channel) === "string"
                  ? deliveryContext.channel
                  : undefined;
              deliveryTo =
                typeof (deliveryContext === null || deliveryContext === void 0
                  ? void 0
                  : deliveryContext.to) === "string"
                  ? deliveryContext.to
                  : undefined;
              deliveryAccountId =
                typeof (deliveryContext === null || deliveryContext === void 0
                  ? void 0
                  : deliveryContext.accountId) === "string"
                  ? deliveryContext.accountId
                  : undefined;
              lastChannel =
                deliveryChannel !== null && deliveryChannel !== void 0
                  ? deliveryChannel
                  : typeof entry.lastChannel === "string"
                    ? entry.lastChannel
                    : undefined;
              lastAccountId =
                deliveryAccountId !== null && deliveryAccountId !== void 0
                  ? deliveryAccountId
                  : typeof entry.lastAccountId === "string"
                    ? entry.lastAccountId
                    : undefined;
              derivedChannel = (0, sessions_helpers_js_1.deriveChannel)({
                key: key,
                kind: kind,
                channel: entryChannel,
                lastChannel: lastChannel,
              });
              sessionId = typeof entry.sessionId === "string" ? entry.sessionId : undefined;
              transcriptPath =
                sessionId && storePath
                  ? node_path_1.default.join(
                      node_path_1.default.dirname(storePath),
                      "".concat(sessionId, ".jsonl"),
                    )
                  : undefined;
              row = {
                key: displayKey,
                kind: kind,
                channel: derivedChannel,
                label: typeof entry.label === "string" ? entry.label : undefined,
                displayName: typeof entry.displayName === "string" ? entry.displayName : undefined,
                deliveryContext:
                  deliveryChannel || deliveryTo || deliveryAccountId
                    ? {
                        channel: deliveryChannel,
                        to: deliveryTo,
                        accountId: deliveryAccountId,
                      }
                    : undefined,
                updatedAt: typeof entry.updatedAt === "number" ? entry.updatedAt : undefined,
                sessionId: sessionId,
                model: typeof entry.model === "string" ? entry.model : undefined,
                contextTokens:
                  typeof entry.contextTokens === "number" ? entry.contextTokens : undefined,
                totalTokens: typeof entry.totalTokens === "number" ? entry.totalTokens : undefined,
                thinkingLevel:
                  typeof entry.thinkingLevel === "string" ? entry.thinkingLevel : undefined,
                verboseLevel:
                  typeof entry.verboseLevel === "string" ? entry.verboseLevel : undefined,
                systemSent: typeof entry.systemSent === "boolean" ? entry.systemSent : undefined,
                abortedLastRun:
                  typeof entry.abortedLastRun === "boolean" ? entry.abortedLastRun : undefined,
                sendPolicy: typeof entry.sendPolicy === "string" ? entry.sendPolicy : undefined,
                lastChannel: lastChannel,
                lastTo:
                  deliveryTo !== null && deliveryTo !== void 0
                    ? deliveryTo
                    : typeof entry.lastTo === "string"
                      ? entry.lastTo
                      : undefined,
                lastAccountId: lastAccountId,
                transcriptPath: transcriptPath,
              };
              if (!(messageLimit > 0)) {
                return [3 /*break*/, 4];
              }
              resolvedKey = (0, sessions_helpers_js_1.resolveInternalSessionKey)({
                key: displayKey,
                alias: alias,
                mainKey: mainKey,
              });
              return [
                4 /*yield*/,
                (0, call_js_1.callGateway)({
                  method: "chat.history",
                  params: { sessionKey: resolvedKey, limit: messageLimit },
                }),
              ];
            case 3:
              history_1 = _c.sent();
              rawMessages = Array.isArray(
                history_1 === null || history_1 === void 0 ? void 0 : history_1.messages,
              )
                ? history_1.messages
                : [];
              filtered = (0, sessions_helpers_js_1.stripToolMessages)(rawMessages);
              row.messages =
                filtered.length > messageLimit ? filtered.slice(-messageLimit) : filtered;
              _c.label = 4;
            case 4:
              rows.push(row);
              _c.label = 5;
            case 5:
              _i++;
              return [3 /*break*/, 2];
            case 6:
              return [
                2 /*return*/,
                (0, common_js_1.jsonResult)({
                  count: rows.length,
                  sessions: rows,
                }),
              ];
          }
        });
      });
    },
  };
}
