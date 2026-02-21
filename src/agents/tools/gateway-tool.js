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
exports.createGatewayTool = createGatewayTool;
var typebox_1 = require("@sinclair/typebox");
var io_js_1 = require("../../config/io.js");
var sessions_js_1 = require("../../config/sessions.js");
var restart_js_1 = require("../../infra/restart.js");
var restart_sentinel_js_1 = require("../../infra/restart-sentinel.js");
var typebox_js_1 = require("../schema/typebox.js");
var common_js_1 = require("./common.js");
var gateway_js_1 = require("./gateway.js");
function resolveBaseHashFromSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") {
    return undefined;
  }
  var hashValue = snapshot.hash;
  var rawValue = snapshot.raw;
  var hash = (0, io_js_1.resolveConfigSnapshotHash)({
    hash: typeof hashValue === "string" ? hashValue : undefined,
    raw: typeof rawValue === "string" ? rawValue : undefined,
  });
  return hash !== null && hash !== void 0 ? hash : undefined;
}
var GATEWAY_ACTIONS = [
  "restart",
  "config.get",
  "config.schema",
  "config.apply",
  "config.patch",
  "update.run",
];
// NOTE: Using a flattened object schema instead of Type.Union([Type.Object(...), ...])
// because Claude API on Vertex AI rejects nested anyOf schemas as invalid JSON Schema.
// The discriminator (action) determines which properties are relevant; runtime validates.
var GatewayToolSchema = typebox_1.Type.Object({
  action: (0, typebox_js_1.stringEnum)(GATEWAY_ACTIONS),
  // restart
  delayMs: typebox_1.Type.Optional(typebox_1.Type.Number()),
  reason: typebox_1.Type.Optional(typebox_1.Type.String()),
  // config.get, config.schema, config.apply, update.run
  gatewayUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
  gatewayToken: typebox_1.Type.Optional(typebox_1.Type.String()),
  timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Number()),
  // config.apply, config.patch
  raw: typebox_1.Type.Optional(typebox_1.Type.String()),
  baseHash: typebox_1.Type.Optional(typebox_1.Type.String()),
  // config.apply, config.patch, update.run
  sessionKey: typebox_1.Type.Optional(typebox_1.Type.String()),
  note: typebox_1.Type.Optional(typebox_1.Type.String()),
  restartDelayMs: typebox_1.Type.Optional(typebox_1.Type.Number()),
});
// NOTE: We intentionally avoid top-level `allOf`/`anyOf`/`oneOf` conditionals here:
// - OpenAI rejects tool schemas that include these keywords at the *top-level*.
// - Claude/Vertex has other JSON Schema quirks.
// Conditional requirements (like `raw` for config.apply) are enforced at runtime.
function createGatewayTool(opts) {
  var _this = this;
  return {
    label: "Gateway",
    name: "gateway",
    description:
      "Restart, apply config, or update the gateway in-place (SIGUSR1). Use config.patch for safe partial config updates (merges with existing). Use config.apply only when replacing entire config. Both trigger restart after writing.",
    parameters: GatewayToolSchema,
    execute: function (_toolCallId, args) {
      return __awaiter(_this, void 0, void 0, function () {
        var params,
          action,
          sessionKey,
          delayMs,
          reason,
          note,
          deliveryContext,
          threadId,
          threadMarker,
          threadIndex,
          baseSessionKey,
          threadIdRaw,
          cfg,
          storePath,
          store,
          entry,
          payload,
          _a,
          scheduled,
          gatewayUrl,
          gatewayToken,
          timeoutMs,
          gatewayOpts,
          result,
          result,
          raw,
          baseHash,
          snapshot,
          sessionKey,
          note,
          restartDelayMs,
          result,
          raw,
          baseHash,
          snapshot,
          sessionKey,
          note,
          restartDelayMs,
          result,
          sessionKey,
          note,
          restartDelayMs,
          result;
        var _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
          switch (_k.label) {
            case 0:
              params = args;
              action = (0, common_js_1.readStringParam)(params, "action", { required: true });
              if (!(action === "restart")) {
                return [3 /*break*/, 5];
              }
              if (
                ((_c =
                  (_b = opts === null || opts === void 0 ? void 0 : opts.config) === null ||
                  _b === void 0
                    ? void 0
                    : _b.commands) === null || _c === void 0
                  ? void 0
                  : _c.restart) !== true
              ) {
                throw new Error(
                  "Gateway restart is disabled. Set commands.restart=true to enable.",
                );
              }
              sessionKey =
                typeof params.sessionKey === "string" && params.sessionKey.trim()
                  ? params.sessionKey.trim()
                  : ((_d = opts === null || opts === void 0 ? void 0 : opts.agentSessionKey) ===
                      null || _d === void 0
                      ? void 0
                      : _d.trim()) || undefined;
              delayMs =
                typeof params.delayMs === "number" && Number.isFinite(params.delayMs)
                  ? Math.floor(params.delayMs)
                  : undefined;
              reason =
                typeof params.reason === "string" && params.reason.trim()
                  ? params.reason.trim().slice(0, 200)
                  : undefined;
              note =
                typeof params.note === "string" && params.note.trim()
                  ? params.note.trim()
                  : undefined;
              deliveryContext = void 0;
              threadId = void 0;
              if (sessionKey) {
                threadMarker = ":thread:";
                threadIndex = sessionKey.lastIndexOf(threadMarker);
                baseSessionKey = threadIndex === -1 ? sessionKey : sessionKey.slice(0, threadIndex);
                threadIdRaw =
                  threadIndex === -1
                    ? undefined
                    : sessionKey.slice(threadIndex + threadMarker.length);
                threadId =
                  (threadIdRaw === null || threadIdRaw === void 0 ? void 0 : threadIdRaw.trim()) ||
                  undefined;
                try {
                  cfg = (0, io_js_1.loadConfig)();
                  storePath = (0, sessions_js_1.resolveStorePath)(
                    (_e = cfg.session) === null || _e === void 0 ? void 0 : _e.store,
                  );
                  store = (0, sessions_js_1.loadSessionStore)(storePath);
                  entry = store[sessionKey];
                  if (
                    !(entry === null || entry === void 0 ? void 0 : entry.deliveryContext) &&
                    threadIndex !== -1 &&
                    baseSessionKey
                  ) {
                    entry = store[baseSessionKey];
                  }
                  if (entry === null || entry === void 0 ? void 0 : entry.deliveryContext) {
                    deliveryContext = {
                      channel: entry.deliveryContext.channel,
                      to: entry.deliveryContext.to,
                      accountId: entry.deliveryContext.accountId,
                    };
                  }
                } catch (_l) {
                  // ignore: best-effort
                }
              }
              payload = {
                kind: "restart",
                status: "ok",
                ts: Date.now(),
                sessionKey: sessionKey,
                deliveryContext: deliveryContext,
                threadId: threadId,
                message:
                  (_f = note !== null && note !== void 0 ? note : reason) !== null && _f !== void 0
                    ? _f
                    : null,
                doctorHint: (0, restart_sentinel_js_1.formatDoctorNonInteractiveHint)(),
                stats: {
                  mode: "gateway.restart",
                  reason: reason,
                },
              };
              _k.label = 1;
            case 1:
              _k.trys.push([1, 3, , 4]);
              return [4 /*yield*/, (0, restart_sentinel_js_1.writeRestartSentinel)(payload)];
            case 2:
              _k.sent();
              return [3 /*break*/, 4];
            case 3:
              _a = _k.sent();
              return [3 /*break*/, 4];
            case 4:
              console.info(
                "gateway tool: restart requested (delayMs="
                  .concat(delayMs !== null && delayMs !== void 0 ? delayMs : "default", ", reason=")
                  .concat(reason !== null && reason !== void 0 ? reason : "none", ")"),
              );
              scheduled = (0, restart_js_1.scheduleGatewaySigusr1Restart)({
                delayMs: delayMs,
                reason: reason,
              });
              return [2 /*return*/, (0, common_js_1.jsonResult)(scheduled)];
            case 5:
              gatewayUrl =
                typeof params.gatewayUrl === "string" && params.gatewayUrl.trim()
                  ? params.gatewayUrl.trim()
                  : undefined;
              gatewayToken =
                typeof params.gatewayToken === "string" && params.gatewayToken.trim()
                  ? params.gatewayToken.trim()
                  : undefined;
              timeoutMs =
                typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs)
                  ? Math.max(1, Math.floor(params.timeoutMs))
                  : undefined;
              gatewayOpts = {
                gatewayUrl: gatewayUrl,
                gatewayToken: gatewayToken,
                timeoutMs: timeoutMs,
              };
              if (!(action === "config.get")) {
                return [3 /*break*/, 7];
              }
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("config.get", gatewayOpts, {}),
              ];
            case 6:
              result = _k.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, result: result })];
            case 7:
              if (!(action === "config.schema")) {
                return [3 /*break*/, 9];
              }
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("config.schema", gatewayOpts, {}),
              ];
            case 8:
              result = _k.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, result: result })];
            case 9:
              if (!(action === "config.apply")) {
                return [3 /*break*/, 13];
              }
              raw = (0, common_js_1.readStringParam)(params, "raw", { required: true });
              baseHash = (0, common_js_1.readStringParam)(params, "baseHash");
              if (!!baseHash) {
                return [3 /*break*/, 11];
              }
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("config.get", gatewayOpts, {}),
              ];
            case 10:
              snapshot = _k.sent();
              baseHash = resolveBaseHashFromSnapshot(snapshot);
              _k.label = 11;
            case 11:
              sessionKey =
                typeof params.sessionKey === "string" && params.sessionKey.trim()
                  ? params.sessionKey.trim()
                  : ((_g = opts === null || opts === void 0 ? void 0 : opts.agentSessionKey) ===
                      null || _g === void 0
                      ? void 0
                      : _g.trim()) || undefined;
              note =
                typeof params.note === "string" && params.note.trim()
                  ? params.note.trim()
                  : undefined;
              restartDelayMs =
                typeof params.restartDelayMs === "number" && Number.isFinite(params.restartDelayMs)
                  ? Math.floor(params.restartDelayMs)
                  : undefined;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("config.apply", gatewayOpts, {
                  raw: raw,
                  baseHash: baseHash,
                  sessionKey: sessionKey,
                  note: note,
                  restartDelayMs: restartDelayMs,
                }),
              ];
            case 12:
              result = _k.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, result: result })];
            case 13:
              if (!(action === "config.patch")) {
                return [3 /*break*/, 17];
              }
              raw = (0, common_js_1.readStringParam)(params, "raw", { required: true });
              baseHash = (0, common_js_1.readStringParam)(params, "baseHash");
              if (!!baseHash) {
                return [3 /*break*/, 15];
              }
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("config.get", gatewayOpts, {}),
              ];
            case 14:
              snapshot = _k.sent();
              baseHash = resolveBaseHashFromSnapshot(snapshot);
              _k.label = 15;
            case 15:
              sessionKey =
                typeof params.sessionKey === "string" && params.sessionKey.trim()
                  ? params.sessionKey.trim()
                  : ((_h = opts === null || opts === void 0 ? void 0 : opts.agentSessionKey) ===
                      null || _h === void 0
                      ? void 0
                      : _h.trim()) || undefined;
              note =
                typeof params.note === "string" && params.note.trim()
                  ? params.note.trim()
                  : undefined;
              restartDelayMs =
                typeof params.restartDelayMs === "number" && Number.isFinite(params.restartDelayMs)
                  ? Math.floor(params.restartDelayMs)
                  : undefined;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("config.patch", gatewayOpts, {
                  raw: raw,
                  baseHash: baseHash,
                  sessionKey: sessionKey,
                  note: note,
                  restartDelayMs: restartDelayMs,
                }),
              ];
            case 16:
              result = _k.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, result: result })];
            case 17:
              if (!(action === "update.run")) {
                return [3 /*break*/, 19];
              }
              sessionKey =
                typeof params.sessionKey === "string" && params.sessionKey.trim()
                  ? params.sessionKey.trim()
                  : ((_j = opts === null || opts === void 0 ? void 0 : opts.agentSessionKey) ===
                      null || _j === void 0
                      ? void 0
                      : _j.trim()) || undefined;
              note =
                typeof params.note === "string" && params.note.trim()
                  ? params.note.trim()
                  : undefined;
              restartDelayMs =
                typeof params.restartDelayMs === "number" && Number.isFinite(params.restartDelayMs)
                  ? Math.floor(params.restartDelayMs)
                  : undefined;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("update.run", gatewayOpts, {
                  sessionKey: sessionKey,
                  note: note,
                  restartDelayMs: restartDelayMs,
                  timeoutMs: timeoutMs,
                }),
              ];
            case 18:
              result = _k.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, result: result })];
            case 19:
              throw new Error("Unknown action: ".concat(action));
          }
        });
      });
    },
  };
}
