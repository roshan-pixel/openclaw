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
exports.createSessionsSpawnTool = createSessionsSpawnTool;
var node_crypto_1 = require("node:crypto");
var typebox_1 = require("@sinclair/typebox");
var thinking_js_1 = require("../../auto-reply/thinking.js");
var config_js_1 = require("../../config/config.js");
var call_js_1 = require("../../gateway/call.js");
var session_key_js_1 = require("../../routing/session-key.js");
var delivery_context_js_1 = require("../../utils/delivery-context.js");
var agent_scope_js_1 = require("../agent-scope.js");
var lanes_js_1 = require("../lanes.js");
var typebox_js_1 = require("../schema/typebox.js");
var subagent_announce_js_1 = require("../subagent-announce.js");
var subagent_registry_js_1 = require("../subagent-registry.js");
var common_js_1 = require("./common.js");
var sessions_helpers_js_1 = require("./sessions-helpers.js");
var SessionsSpawnToolSchema = typebox_1.Type.Object({
  task: typebox_1.Type.String(),
  label: typebox_1.Type.Optional(typebox_1.Type.String()),
  agentId: typebox_1.Type.Optional(typebox_1.Type.String()),
  model: typebox_1.Type.Optional(typebox_1.Type.String()),
  thinking: typebox_1.Type.Optional(typebox_1.Type.String()),
  runTimeoutSeconds: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0 })),
  // Back-compat alias. Prefer runTimeoutSeconds.
  timeoutSeconds: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0 })),
  cleanup: (0, typebox_js_1.optionalStringEnum)(["delete", "keep"]),
});
function splitModelRef(ref) {
  if (!ref) {
    return { provider: undefined, model: undefined };
  }
  var trimmed = ref.trim();
  if (!trimmed) {
    return { provider: undefined, model: undefined };
  }
  var _a = trimmed.split("/", 2),
    provider = _a[0],
    model = _a[1];
  if (model) {
    return { provider: provider, model: model };
  }
  return { provider: undefined, model: trimmed };
}
function normalizeModelSelection(value) {
  if (typeof value === "string") {
    var trimmed = value.trim();
    return trimmed || undefined;
  }
  if (!value || typeof value !== "object") {
    return undefined;
  }
  var primary = value.primary;
  if (typeof primary === "string" && primary.trim()) {
    return primary.trim();
  }
  return undefined;
}
function createSessionsSpawnTool(opts) {
  var _this = this;
  return {
    label: "Sessions",
    name: "sessions_spawn",
    description:
      "Spawn a background sub-agent run in an isolated session and announce the result back to the requester chat.",
    parameters: SessionsSpawnToolSchema,
    execute: function (_toolCallId, args) {
      return __awaiter(_this, void 0, void 0, function () {
        var params,
          task,
          label,
          requestedAgentId,
          modelOverride,
          thinkingOverrideRaw,
          cleanup,
          requesterOrigin,
          runTimeoutSeconds,
          modelWarning,
          modelApplied,
          cfg,
          _a,
          mainKey,
          alias,
          requesterSessionKey,
          requesterInternalKey,
          requesterDisplayKey,
          requesterAgentId,
          targetAgentId,
          allowAgents,
          allowAny,
          normalizedTargetId,
          allowSet,
          allowedText,
          childSessionKey,
          spawnedByKey,
          targetAgentConfig,
          resolvedModel,
          thinkingOverride,
          normalized,
          _b,
          provider,
          model,
          hint,
          err_1,
          messageText,
          recoverable,
          childSystemPrompt,
          childIdem,
          childRunId,
          response,
          err_2,
          messageText;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return __generator(this, function (_s) {
          switch (_s.label) {
            case 0:
              params = args;
              task = (0, common_js_1.readStringParam)(params, "task", { required: true });
              label = typeof params.label === "string" ? params.label.trim() : "";
              requestedAgentId = (0, common_js_1.readStringParam)(params, "agentId");
              modelOverride = (0, common_js_1.readStringParam)(params, "model");
              thinkingOverrideRaw = (0, common_js_1.readStringParam)(params, "thinking");
              cleanup =
                params.cleanup === "keep" || params.cleanup === "delete" ? params.cleanup : "keep";
              requesterOrigin = (0, delivery_context_js_1.normalizeDeliveryContext)({
                channel: opts === null || opts === void 0 ? void 0 : opts.agentChannel,
                accountId: opts === null || opts === void 0 ? void 0 : opts.agentAccountId,
                to: opts === null || opts === void 0 ? void 0 : opts.agentTo,
                threadId: opts === null || opts === void 0 ? void 0 : opts.agentThreadId,
              });
              runTimeoutSeconds = (function () {
                var explicit =
                  typeof params.runTimeoutSeconds === "number" &&
                  Number.isFinite(params.runTimeoutSeconds)
                    ? Math.max(0, Math.floor(params.runTimeoutSeconds))
                    : undefined;
                if (explicit !== undefined) {
                  return explicit;
                }
                var legacy =
                  typeof params.timeoutSeconds === "number" &&
                  Number.isFinite(params.timeoutSeconds)
                    ? Math.max(0, Math.floor(params.timeoutSeconds))
                    : undefined;
                return legacy !== null && legacy !== void 0 ? legacy : 0;
              })();
              modelApplied = false;
              cfg = (0, config_js_1.loadConfig)();
              ((_a = (0, sessions_helpers_js_1.resolveMainSessionAlias)(cfg)),
                (mainKey = _a.mainKey),
                (alias = _a.alias));
              requesterSessionKey =
                opts === null || opts === void 0 ? void 0 : opts.agentSessionKey;
              if (
                typeof requesterSessionKey === "string" &&
                (0, session_key_js_1.isSubagentSessionKey)(requesterSessionKey)
              ) {
                return [
                  2 /*return*/,
                  (0, common_js_1.jsonResult)({
                    status: "forbidden",
                    error: "sessions_spawn is not allowed from sub-agent sessions",
                  }),
                ];
              }
              requesterInternalKey = requesterSessionKey
                ? (0, sessions_helpers_js_1.resolveInternalSessionKey)({
                    key: requesterSessionKey,
                    alias: alias,
                    mainKey: mainKey,
                  })
                : alias;
              requesterDisplayKey = (0, sessions_helpers_js_1.resolveDisplaySessionKey)({
                key: requesterInternalKey,
                alias: alias,
                mainKey: mainKey,
              });
              requesterAgentId = (0, session_key_js_1.normalizeAgentId)(
                (_c = opts === null || opts === void 0 ? void 0 : opts.requesterAgentIdOverride) !==
                  null && _c !== void 0
                  ? _c
                  : (_d = (0, session_key_js_1.parseAgentSessionKey)(requesterInternalKey)) ===
                        null || _d === void 0
                    ? void 0
                    : _d.agentId,
              );
              targetAgentId = requestedAgentId
                ? (0, session_key_js_1.normalizeAgentId)(requestedAgentId)
                : requesterAgentId;
              if (targetAgentId !== requesterAgentId) {
                allowAgents =
                  (_g =
                    (_f =
                      (_e = (0, agent_scope_js_1.resolveAgentConfig)(cfg, requesterAgentId)) ===
                        null || _e === void 0
                        ? void 0
                        : _e.subagents) === null || _f === void 0
                      ? void 0
                      : _f.allowAgents) !== null && _g !== void 0
                    ? _g
                    : [];
                allowAny = allowAgents.some(function (value) {
                  return value.trim() === "*";
                });
                normalizedTargetId = targetAgentId.toLowerCase();
                allowSet = new Set(
                  allowAgents
                    .filter(function (value) {
                      return value.trim() && value.trim() !== "*";
                    })
                    .map(function (value) {
                      return (0, session_key_js_1.normalizeAgentId)(value).toLowerCase();
                    }),
                );
                if (!allowAny && !allowSet.has(normalizedTargetId)) {
                  allowedText = allowAny
                    ? "*"
                    : allowSet.size > 0
                      ? Array.from(allowSet).join(", ")
                      : "none";
                  return [
                    2 /*return*/,
                    (0, common_js_1.jsonResult)({
                      status: "forbidden",
                      error: "agentId is not allowed for sessions_spawn (allowed: ".concat(
                        allowedText,
                        ")",
                      ),
                    }),
                  ];
                }
              }
              childSessionKey = "agent:"
                .concat(targetAgentId, ":subagent:")
                .concat(node_crypto_1.default.randomUUID());
              spawnedByKey = requesterInternalKey;
              targetAgentConfig = (0, agent_scope_js_1.resolveAgentConfig)(cfg, targetAgentId);
              resolvedModel =
                (_k =
                  (_h = normalizeModelSelection(modelOverride)) !== null && _h !== void 0
                    ? _h
                    : normalizeModelSelection(
                        (_j =
                          targetAgentConfig === null || targetAgentConfig === void 0
                            ? void 0
                            : targetAgentConfig.subagents) === null || _j === void 0
                          ? void 0
                          : _j.model,
                      )) !== null && _k !== void 0
                  ? _k
                  : normalizeModelSelection(
                      (_o =
                        (_m =
                          (_l = cfg.agents) === null || _l === void 0 ? void 0 : _l.defaults) ===
                          null || _m === void 0
                          ? void 0
                          : _m.subagents) === null || _o === void 0
                        ? void 0
                        : _o.model,
                    );
              if (thinkingOverrideRaw) {
                normalized = (0, thinking_js_1.normalizeThinkLevel)(thinkingOverrideRaw);
                if (!normalized) {
                  ((_b = splitModelRef(resolvedModel)),
                    (provider = _b.provider),
                    (model = _b.model));
                  hint = (0, thinking_js_1.formatThinkingLevels)(provider, model);
                  return [
                    2 /*return*/,
                    (0, common_js_1.jsonResult)({
                      status: "error",
                      error: 'Invalid thinking level "'
                        .concat(thinkingOverrideRaw, '". Use one of: ')
                        .concat(hint, "."),
                    }),
                  ];
                }
                thinkingOverride = normalized;
              }
              if (!resolvedModel) {
                return [3 /*break*/, 4];
              }
              _s.label = 1;
            case 1:
              _s.trys.push([1, 3, , 4]);
              return [
                4 /*yield*/,
                (0, call_js_1.callGateway)({
                  method: "sessions.patch",
                  params: { key: childSessionKey, model: resolvedModel },
                  timeoutMs: 10000,
                }),
              ];
            case 2:
              _s.sent();
              modelApplied = true;
              return [3 /*break*/, 4];
            case 3:
              err_1 = _s.sent();
              messageText =
                err_1 instanceof Error
                  ? err_1.message
                  : typeof err_1 === "string"
                    ? err_1
                    : "error";
              recoverable =
                messageText.includes("invalid model") || messageText.includes("model not allowed");
              if (!recoverable) {
                return [
                  2 /*return*/,
                  (0, common_js_1.jsonResult)({
                    status: "error",
                    error: messageText,
                    childSessionKey: childSessionKey,
                  }),
                ];
              }
              modelWarning = messageText;
              return [3 /*break*/, 4];
            case 4:
              childSystemPrompt = (0, subagent_announce_js_1.buildSubagentSystemPrompt)({
                requesterSessionKey: requesterSessionKey,
                requesterOrigin: requesterOrigin,
                childSessionKey: childSessionKey,
                label: label || undefined,
                task: task,
              });
              childIdem = node_crypto_1.default.randomUUID();
              childRunId = childIdem;
              _s.label = 5;
            case 5:
              _s.trys.push([5, 7, , 8]);
              return [
                4 /*yield*/,
                (0, call_js_1.callGateway)({
                  method: "agent",
                  params: {
                    message: task,
                    sessionKey: childSessionKey,
                    channel:
                      requesterOrigin === null || requesterOrigin === void 0
                        ? void 0
                        : requesterOrigin.channel,
                    idempotencyKey: childIdem,
                    deliver: false,
                    lane: lanes_js_1.AGENT_LANE_SUBAGENT,
                    extraSystemPrompt: childSystemPrompt,
                    thinking: thinkingOverride,
                    timeout: runTimeoutSeconds > 0 ? runTimeoutSeconds : undefined,
                    label: label || undefined,
                    spawnedBy: spawnedByKey,
                    groupId:
                      (_p = opts === null || opts === void 0 ? void 0 : opts.agentGroupId) !==
                        null && _p !== void 0
                        ? _p
                        : undefined,
                    groupChannel:
                      (_q = opts === null || opts === void 0 ? void 0 : opts.agentGroupChannel) !==
                        null && _q !== void 0
                        ? _q
                        : undefined,
                    groupSpace:
                      (_r = opts === null || opts === void 0 ? void 0 : opts.agentGroupSpace) !==
                        null && _r !== void 0
                        ? _r
                        : undefined,
                  },
                  timeoutMs: 10000,
                }),
              ];
            case 6:
              response = _s.sent();
              if (
                typeof (response === null || response === void 0 ? void 0 : response.runId) ===
                  "string" &&
                response.runId
              ) {
                childRunId = response.runId;
              }
              return [3 /*break*/, 8];
            case 7:
              err_2 = _s.sent();
              messageText =
                err_2 instanceof Error
                  ? err_2.message
                  : typeof err_2 === "string"
                    ? err_2
                    : "error";
              return [
                2 /*return*/,
                (0, common_js_1.jsonResult)({
                  status: "error",
                  error: messageText,
                  childSessionKey: childSessionKey,
                  runId: childRunId,
                }),
              ];
            case 8:
              (0, subagent_registry_js_1.registerSubagentRun)({
                runId: childRunId,
                childSessionKey: childSessionKey,
                requesterSessionKey: requesterInternalKey,
                requesterOrigin: requesterOrigin,
                requesterDisplayKey: requesterDisplayKey,
                task: task,
                cleanup: cleanup,
                label: label || undefined,
                runTimeoutSeconds: runTimeoutSeconds,
              });
              return [
                2 /*return*/,
                (0, common_js_1.jsonResult)({
                  status: "accepted",
                  childSessionKey: childSessionKey,
                  runId: childRunId,
                  modelApplied: resolvedModel ? modelApplied : undefined,
                  warning: modelWarning,
                }),
              ];
          }
        });
      });
    },
  };
}
