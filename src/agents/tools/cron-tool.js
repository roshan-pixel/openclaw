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
exports.createCronTool = createCronTool;
var typebox_1 = require("@sinclair/typebox");
var normalize_js_1 = require("../../cron/normalize.js");
var config_js_1 = require("../../config/config.js");
var utils_js_1 = require("../../utils.js");
var typebox_js_1 = require("../schema/typebox.js");
var agent_scope_js_1 = require("../agent-scope.js");
var common_js_1 = require("./common.js");
var gateway_js_1 = require("./gateway.js");
var sessions_helpers_js_1 = require("./sessions-helpers.js");
// NOTE: We use Type.Object({}, { additionalProperties: true }) for job/patch
// instead of CronAddParamsSchema/CronJobPatchSchema because the gateway schemas
// contain nested unions. Tool schemas need to stay provider-friendly, so we
// accept "any object" here and validate at runtime.
var CRON_ACTIONS = ["status", "list", "add", "update", "remove", "run", "runs", "wake"];
var CRON_WAKE_MODES = ["now", "next-heartbeat"];
var REMINDER_CONTEXT_MESSAGES_MAX = 10;
var REMINDER_CONTEXT_PER_MESSAGE_MAX = 220;
var REMINDER_CONTEXT_TOTAL_MAX = 700;
var REMINDER_CONTEXT_MARKER = "\n\nRecent context:\n";
// Flattened schema: runtime validates per-action requirements.
var CronToolSchema = typebox_1.Type.Object({
  action: (0, typebox_js_1.stringEnum)(CRON_ACTIONS),
  gatewayUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
  gatewayToken: typebox_1.Type.Optional(typebox_1.Type.String()),
  timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Number()),
  includeDisabled: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
  job: typebox_1.Type.Optional(typebox_1.Type.Object({}, { additionalProperties: true })),
  jobId: typebox_1.Type.Optional(typebox_1.Type.String()),
  id: typebox_1.Type.Optional(typebox_1.Type.String()),
  patch: typebox_1.Type.Optional(typebox_1.Type.Object({}, { additionalProperties: true })),
  text: typebox_1.Type.Optional(typebox_1.Type.String()),
  mode: (0, typebox_js_1.optionalStringEnum)(CRON_WAKE_MODES),
  contextMessages: typebox_1.Type.Optional(
    typebox_1.Type.Number({ minimum: 0, maximum: REMINDER_CONTEXT_MESSAGES_MAX }),
  ),
});
function stripExistingContext(text) {
  var index = text.indexOf(REMINDER_CONTEXT_MARKER);
  if (index === -1) {
    return text;
  }
  return text.slice(0, index).trim();
}
function truncateText(input, maxLen) {
  if (input.length <= maxLen) {
    return input;
  }
  var truncated = (0, utils_js_1.truncateUtf16Safe)(input, Math.max(0, maxLen - 3)).trimEnd();
  return "".concat(truncated, "...");
}
function normalizeContextText(raw) {
  return raw.replace(/\s+/g, " ").trim();
}
function extractMessageText(message) {
  var role = typeof message.role === "string" ? message.role : "";
  if (role !== "user" && role !== "assistant") {
    return null;
  }
  var content = message.content;
  if (typeof content === "string") {
    var normalized = normalizeContextText(content);
    return normalized ? { role: role, text: normalized } : null;
  }
  if (!Array.isArray(content)) {
    return null;
  }
  var chunks = [];
  for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
    var block = content_1[_i];
    if (!block || typeof block !== "object") {
      continue;
    }
    if (block.type !== "text") {
      continue;
    }
    var text = block.text;
    if (typeof text === "string" && text.trim()) {
      chunks.push(text);
    }
  }
  var joined = normalizeContextText(chunks.join(" "));
  return joined ? { role: role, text: joined } : null;
}
function buildReminderContextLines(params) {
  return __awaiter(this, void 0, void 0, function () {
    var maxMessages,
      sessionKey,
      cfg,
      _a,
      mainKey,
      alias,
      resolvedKey,
      res,
      messages,
      parsed,
      recent,
      lines,
      total,
      _i,
      recent_1,
      entry,
      label,
      text,
      line,
      _b;
    var _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          maxMessages = Math.min(
            REMINDER_CONTEXT_MESSAGES_MAX,
            Math.max(0, Math.floor(params.contextMessages)),
          );
          if (maxMessages <= 0) {
            return [2 /*return*/, []];
          }
          sessionKey = (_c = params.agentSessionKey) === null || _c === void 0 ? void 0 : _c.trim();
          if (!sessionKey) {
            return [2 /*return*/, []];
          }
          cfg = (0, config_js_1.loadConfig)();
          ((_a = (0, sessions_helpers_js_1.resolveMainSessionAlias)(cfg)),
            (mainKey = _a.mainKey),
            (alias = _a.alias));
          resolvedKey = (0, sessions_helpers_js_1.resolveInternalSessionKey)({
            key: sessionKey,
            alias: alias,
            mainKey: mainKey,
          });
          _d.label = 1;
        case 1:
          _d.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            (0, gateway_js_1.callGatewayTool)("chat.history", params.gatewayOpts, {
              sessionKey: resolvedKey,
              limit: maxMessages,
            }),
          ];
        case 2:
          res = _d.sent();
          messages = Array.isArray(res === null || res === void 0 ? void 0 : res.messages)
            ? res.messages
            : [];
          parsed = messages
            .map(function (msg) {
              return extractMessageText(msg);
            })
            .filter(function (msg) {
              return Boolean(msg);
            });
          recent = parsed.slice(-maxMessages);
          if (recent.length === 0) {
            return [2 /*return*/, []];
          }
          lines = [];
          total = 0;
          for (_i = 0, recent_1 = recent; _i < recent_1.length; _i++) {
            entry = recent_1[_i];
            label = entry.role === "user" ? "User" : "Assistant";
            text = truncateText(entry.text, REMINDER_CONTEXT_PER_MESSAGE_MAX);
            line = "- ".concat(label, ": ").concat(text);
            total += line.length;
            if (total > REMINDER_CONTEXT_TOTAL_MAX) {
              break;
            }
            lines.push(line);
          }
          return [2 /*return*/, lines];
        case 3:
          _b = _d.sent();
          return [2 /*return*/, []];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function createCronTool(opts) {
  var _this = this;
  return {
    label: "Cron",
    name: "cron",
    description:
      'Manage Gateway cron jobs (status/list/add/update/remove/run/runs) and send wake events.\n\nACTIONS:\n- status: Check cron scheduler status\n- list: List jobs (use includeDisabled:true to include disabled)\n- add: Create job (requires job object, see schema below)\n- update: Modify job (requires jobId + patch object)\n- remove: Delete job (requires jobId)\n- run: Trigger job immediately (requires jobId)\n- runs: Get job run history (requires jobId)\n- wake: Send wake event (requires text, optional mode)\n\nJOB SCHEMA (for add action):\n{\n  "name": "string (optional)",\n  "schedule": { ... },      // Required: when to run\n  "payload": { ... },       // Required: what to execute\n  "sessionTarget": "main" | "isolated",  // Required\n  "enabled": true | false   // Optional, default true\n}\n\nSCHEDULE TYPES (schedule.kind):\n- "at": One-shot at absolute time\n  { "kind": "at", "atMs": <unix-ms-timestamp> }\n- "every": Recurring interval\n  { "kind": "every", "everyMs": <interval-ms>, "anchorMs": <optional-start-ms> }\n- "cron": Cron expression\n  { "kind": "cron", "expr": "<cron-expression>", "tz": "<optional-timezone>" }\n\nPAYLOAD TYPES (payload.kind):\n- "systemEvent": Injects text as system event into session\n  { "kind": "systemEvent", "text": "<message>" }\n- "agentTurn": Runs agent with message (isolated sessions only)\n  { "kind": "agentTurn", "message": "<prompt>", "model": "<optional>", "thinking": "<optional>", "timeoutSeconds": <optional>, "deliver": <optional-bool>, "channel": "<optional>", "to": "<optional>", "bestEffortDeliver": <optional-bool> }\n\nCRITICAL CONSTRAINTS:\n- sessionTarget="main" REQUIRES payload.kind="systemEvent"\n- sessionTarget="isolated" REQUIRES payload.kind="agentTurn"\n\nWAKE MODES (for wake action):\n- "next-heartbeat" (default): Wake on next heartbeat\n- "now": Wake immediately\n\nUse jobId as the canonical identifier; id is accepted for compatibility. Use contextMessages (0-10) to add previous messages as context to the job text.',
    parameters: CronToolSchema,
    execute: function (_toolCallId, args) {
      return __awaiter(_this, void 0, void 0, function () {
        var params,
          action,
          gatewayOpts,
          _a,
          _b,
          _c,
          job,
          cfg,
          agentId,
          contextMessages,
          payload,
          contextLines,
          baseText,
          _d,
          id,
          patch,
          _e,
          id,
          _f,
          id,
          _g,
          id,
          _h,
          text,
          mode,
          _j;
        var _k, _l, _m, _o, _p, _q, _r;
        return __generator(this, function (_s) {
          switch (_s.label) {
            case 0:
              params = args;
              action = (0, common_js_1.readStringParam)(params, "action", { required: true });
              gatewayOpts = {
                gatewayUrl: (0, common_js_1.readStringParam)(params, "gatewayUrl", { trim: false }),
                gatewayToken: (0, common_js_1.readStringParam)(params, "gatewayToken", {
                  trim: false,
                }),
                timeoutMs: typeof params.timeoutMs === "number" ? params.timeoutMs : undefined,
              };
              _a = action;
              switch (_a) {
                case "status":
                  return [3 /*break*/, 1];
                case "list":
                  return [3 /*break*/, 3];
                case "add":
                  return [3 /*break*/, 5];
                case "update":
                  return [3 /*break*/, 9];
                case "remove":
                  return [3 /*break*/, 11];
                case "run":
                  return [3 /*break*/, 13];
                case "runs":
                  return [3 /*break*/, 15];
                case "wake":
                  return [3 /*break*/, 17];
              }
              return [3 /*break*/, 19];
            case 1:
              _b = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("cron.status", gatewayOpts, {}),
              ];
            case 2:
              return [2 /*return*/, _b.apply(void 0, [_s.sent()])];
            case 3:
              _c = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("cron.list", gatewayOpts, {
                  includeDisabled: Boolean(params.includeDisabled),
                }),
              ];
            case 4:
              return [2 /*return*/, _c.apply(void 0, [_s.sent()])];
            case 5:
              if (!params.job || typeof params.job !== "object") {
                throw new Error("job required");
              }
              job =
                (_k = (0, normalize_js_1.normalizeCronJobCreate)(params.job)) !== null &&
                _k !== void 0
                  ? _k
                  : params.job;
              if (job && typeof job === "object" && !("agentId" in job)) {
                cfg = (0, config_js_1.loadConfig)();
                agentId = (opts === null || opts === void 0 ? void 0 : opts.agentSessionKey)
                  ? (0, agent_scope_js_1.resolveSessionAgentId)({
                      sessionKey: opts.agentSessionKey,
                      config: cfg,
                    })
                  : undefined;
                if (agentId) {
                  job.agentId = agentId;
                }
              }
              contextMessages =
                typeof params.contextMessages === "number" &&
                Number.isFinite(params.contextMessages)
                  ? params.contextMessages
                  : 0;
              if (
                !(
                  job &&
                  typeof job === "object" &&
                  "payload" in job &&
                  ((_l = job.payload) === null || _l === void 0 ? void 0 : _l.kind) ===
                    "systemEvent"
                )
              ) {
                return [3 /*break*/, 7];
              }
              payload = job.payload;
              if (!(typeof payload.text === "string" && payload.text.trim())) {
                return [3 /*break*/, 7];
              }
              return [
                4 /*yield*/,
                buildReminderContextLines({
                  agentSessionKey: opts === null || opts === void 0 ? void 0 : opts.agentSessionKey,
                  gatewayOpts: gatewayOpts,
                  contextMessages: contextMessages,
                }),
              ];
            case 6:
              contextLines = _s.sent();
              if (contextLines.length > 0) {
                baseText = stripExistingContext(payload.text);
                payload.text = ""
                  .concat(baseText)
                  .concat(REMINDER_CONTEXT_MARKER)
                  .concat(contextLines.join("\n"));
              }
              _s.label = 7;
            case 7:
              _d = common_js_1.jsonResult;
              return [4 /*yield*/, (0, gateway_js_1.callGatewayTool)("cron.add", gatewayOpts, job)];
            case 8:
              return [2 /*return*/, _d.apply(void 0, [_s.sent()])];
            case 9:
              id =
                (_m = (0, common_js_1.readStringParam)(params, "jobId")) !== null && _m !== void 0
                  ? _m
                  : (0, common_js_1.readStringParam)(params, "id");
              if (!id) {
                throw new Error("jobId required (id accepted for backward compatibility)");
              }
              if (!params.patch || typeof params.patch !== "object") {
                throw new Error("patch required");
              }
              patch =
                (_o = (0, normalize_js_1.normalizeCronJobPatch)(params.patch)) !== null &&
                _o !== void 0
                  ? _o
                  : params.patch;
              _e = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("cron.update", gatewayOpts, {
                  id: id,
                  patch: patch,
                }),
              ];
            case 10:
              return [2 /*return*/, _e.apply(void 0, [_s.sent()])];
            case 11:
              id =
                (_p = (0, common_js_1.readStringParam)(params, "jobId")) !== null && _p !== void 0
                  ? _p
                  : (0, common_js_1.readStringParam)(params, "id");
              if (!id) {
                throw new Error("jobId required (id accepted for backward compatibility)");
              }
              _f = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("cron.remove", gatewayOpts, { id: id }),
              ];
            case 12:
              return [2 /*return*/, _f.apply(void 0, [_s.sent()])];
            case 13:
              id =
                (_q = (0, common_js_1.readStringParam)(params, "jobId")) !== null && _q !== void 0
                  ? _q
                  : (0, common_js_1.readStringParam)(params, "id");
              if (!id) {
                throw new Error("jobId required (id accepted for backward compatibility)");
              }
              _g = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("cron.run", gatewayOpts, { id: id }),
              ];
            case 14:
              return [2 /*return*/, _g.apply(void 0, [_s.sent()])];
            case 15:
              id =
                (_r = (0, common_js_1.readStringParam)(params, "jobId")) !== null && _r !== void 0
                  ? _r
                  : (0, common_js_1.readStringParam)(params, "id");
              if (!id) {
                throw new Error("jobId required (id accepted for backward compatibility)");
              }
              _h = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("cron.runs", gatewayOpts, { id: id }),
              ];
            case 16:
              return [2 /*return*/, _h.apply(void 0, [_s.sent()])];
            case 17:
              text = (0, common_js_1.readStringParam)(params, "text", { required: true });
              mode =
                params.mode === "now" || params.mode === "next-heartbeat"
                  ? params.mode
                  : "next-heartbeat";
              _j = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)(
                  "wake",
                  gatewayOpts,
                  { mode: mode, text: text },
                  { expectFinal: false },
                ),
              ];
            case 18:
              return [2 /*return*/, _j.apply(void 0, [_s.sent()])];
            case 19:
              throw new Error("Unknown action: ".concat(action));
          }
        });
      });
    },
  };
}
