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
exports.runWebHeartbeatOnce = runWebHeartbeatOnce;
exports.resolveHeartbeatRecipients = resolveHeartbeatRecipients;
var heartbeat_js_1 = require("../../auto-reply/heartbeat.js");
var tokens_js_1 = require("../../auto-reply/tokens.js");
var reply_js_1 = require("../../auto-reply/reply.js");
var whatsapp_heartbeat_js_1 = require("../../channels/plugins/whatsapp-heartbeat.js");
var config_js_1 = require("../../config/config.js");
var sessions_js_1 = require("../../config/sessions.js");
var heartbeat_events_js_1 = require("../../infra/heartbeat-events.js");
var heartbeat_visibility_js_1 = require("../../infra/heartbeat-visibility.js");
var logging_js_1 = require("../../logging.js");
var session_key_js_1 = require("../../routing/session-key.js");
var outbound_js_1 = require("../outbound.js");
var reconnect_js_1 = require("../reconnect.js");
var session_js_1 = require("../session.js");
var loggers_js_1 = require("./loggers.js");
var session_snapshot_js_1 = require("./session-snapshot.js");
var util_js_1 = require("./util.js");
function resolveHeartbeatReplyPayload(replyResult) {
  if (!replyResult) {
    return undefined;
  }
  if (!Array.isArray(replyResult)) {
    return replyResult;
  }
  for (var idx = replyResult.length - 1; idx >= 0; idx -= 1) {
    var payload = replyResult[idx];
    if (!payload) {
      continue;
    }
    if (payload.text || payload.mediaUrl || (payload.mediaUrls && payload.mediaUrls.length > 0)) {
      return payload;
    }
  }
  return undefined;
}
function runWebHeartbeatOnce(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var cfgOverride,
      to,
      _a,
      verbose,
      sessionId,
      overrideBody,
      _b,
      dryRun,
      replyResolver,
      sender,
      runId,
      heartbeatLogger,
      cfg,
      visibility,
      heartbeatOkText,
      sessionCfg,
      sessionScope,
      mainKey,
      sessionKey,
      storePath,
      store,
      current_1,
      sessionSnapshot,
      sendResult_1,
      replyResult,
      replyPayload,
      okSent,
      sendResult_2,
      hasMedia,
      ackMaxChars,
      stripped,
      storePath,
      store,
      okSent,
      sendResult_3,
      finalText,
      sendResult,
      err_1,
      reason;
    var _c,
      _d,
      _e,
      _f,
      _g,
      _h,
      _j,
      _k,
      _l,
      _m,
      _o,
      _p,
      _q,
      _r,
      _s,
      _t,
      _u,
      _v,
      _w,
      _x,
      _y,
      _z,
      _0,
      _1,
      _2;
    return __generator(this, function (_3) {
      switch (_3.label) {
        case 0:
          ((cfgOverride = opts.cfg),
            (to = opts.to),
            (_a = opts.verbose),
            (verbose = _a === void 0 ? false : _a),
            (sessionId = opts.sessionId),
            (overrideBody = opts.overrideBody),
            (_b = opts.dryRun),
            (dryRun = _b === void 0 ? false : _b));
          replyResolver =
            (_c = opts.replyResolver) !== null && _c !== void 0
              ? _c
              : reply_js_1.getReplyFromConfig;
          sender =
            (_d = opts.sender) !== null && _d !== void 0 ? _d : outbound_js_1.sendMessageWhatsApp;
          runId = (0, reconnect_js_1.newConnectionId)();
          heartbeatLogger = (0, logging_js_1.getChildLogger)({
            module: "web-heartbeat",
            runId: runId,
            to: to,
          });
          cfg =
            cfgOverride !== null && cfgOverride !== void 0
              ? cfgOverride
              : (0, config_js_1.loadConfig)();
          visibility = (0, heartbeat_visibility_js_1.resolveHeartbeatVisibility)({
            cfg: cfg,
            channel: "whatsapp",
          });
          heartbeatOkText = tokens_js_1.HEARTBEAT_TOKEN;
          sessionCfg = cfg.session;
          sessionScope =
            (_e = sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.scope) !==
              null && _e !== void 0
              ? _e
              : "per-sender";
          mainKey = (0, session_key_js_1.normalizeMainKey)(
            sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.mainKey,
          );
          sessionKey = (0, sessions_js_1.resolveSessionKey)(sessionScope, { From: to }, mainKey);
          if (!sessionId) {
            return [3 /*break*/, 2];
          }
          storePath = (0, sessions_js_1.resolveStorePath)(
            (_f = cfg.session) === null || _f === void 0 ? void 0 : _f.store,
          );
          store = (0, sessions_js_1.loadSessionStore)(storePath);
          current_1 = (_g = store[sessionKey]) !== null && _g !== void 0 ? _g : {};
          store[sessionKey] = __assign(__assign({}, current_1), {
            sessionId: sessionId,
            updatedAt: Date.now(),
          });
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(storePath, function (nextStore) {
              var _a;
              var nextCurrent =
                (_a = nextStore[sessionKey]) !== null && _a !== void 0 ? _a : current_1;
              nextStore[sessionKey] = __assign(__assign({}, nextCurrent), {
                sessionId: sessionId,
                updatedAt: Date.now(),
              });
            }),
          ];
        case 1:
          _3.sent();
          _3.label = 2;
        case 2:
          sessionSnapshot = (0, session_snapshot_js_1.getSessionSnapshot)(cfg, to, true);
          if (verbose) {
            heartbeatLogger.info(
              {
                to: to,
                sessionKey: sessionSnapshot.key,
                sessionId:
                  (_j =
                    sessionId !== null && sessionId !== void 0
                      ? sessionId
                      : (_h = sessionSnapshot.entry) === null || _h === void 0
                        ? void 0
                        : _h.sessionId) !== null && _j !== void 0
                    ? _j
                    : null,
                sessionFresh: sessionSnapshot.fresh,
                resetMode: sessionSnapshot.resetPolicy.mode,
                resetAtHour: sessionSnapshot.resetPolicy.atHour,
                idleMinutes:
                  (_k = sessionSnapshot.resetPolicy.idleMinutes) !== null && _k !== void 0
                    ? _k
                    : null,
                dailyResetAt:
                  (_l = sessionSnapshot.dailyResetAt) !== null && _l !== void 0 ? _l : null,
                idleExpiresAt:
                  (_m = sessionSnapshot.idleExpiresAt) !== null && _m !== void 0 ? _m : null,
              },
              "heartbeat session snapshot",
            );
          }
          if (overrideBody && overrideBody.trim().length === 0) {
            throw new Error("Override body must be non-empty when provided.");
          }
          _3.label = 3;
        case 3:
          _3.trys.push([3, 18, , 19]);
          if (!overrideBody) {
            return [3 /*break*/, 5];
          }
          if (dryRun) {
            loggers_js_1.whatsappHeartbeatLog.info(
              "[dry-run] web send -> "
                .concat(to, ": ")
                .concat((0, util_js_1.elide)(overrideBody.trim(), 200), " (manual message)"),
            );
            return [2 /*return*/];
          }
          return [4 /*yield*/, sender(to, overrideBody, { verbose: verbose })];
        case 4:
          sendResult_1 = _3.sent();
          (0, heartbeat_events_js_1.emitHeartbeatEvent)({
            status: "sent",
            to: to,
            preview: overrideBody.slice(0, 160),
            hasMedia: false,
            channel: "whatsapp",
            indicatorType: visibility.useIndicator
              ? (0, heartbeat_events_js_1.resolveIndicatorType)("sent")
              : undefined,
          });
          heartbeatLogger.info(
            {
              to: to,
              messageId: sendResult_1.messageId,
              chars: overrideBody.length,
              reason: "manual-message",
            },
            "manual heartbeat message sent",
          );
          loggers_js_1.whatsappHeartbeatLog.info(
            "manual heartbeat sent to ".concat(to, " (id ").concat(sendResult_1.messageId, ")"),
          );
          return [2 /*return*/];
        case 5:
          if (!visibility.showAlerts && !visibility.showOk && !visibility.useIndicator) {
            heartbeatLogger.info({ to: to, reason: "alerts-disabled" }, "heartbeat skipped");
            (0, heartbeat_events_js_1.emitHeartbeatEvent)({
              status: "skipped",
              to: to,
              reason: "alerts-disabled",
              channel: "whatsapp",
            });
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            replyResolver(
              {
                Body: (0, heartbeat_js_1.resolveHeartbeatPrompt)(
                  (_q =
                    (_p = (_o = cfg.agents) === null || _o === void 0 ? void 0 : _o.defaults) ===
                      null || _p === void 0
                      ? void 0
                      : _p.heartbeat) === null || _q === void 0
                    ? void 0
                    : _q.prompt,
                ),
                From: to,
                To: to,
                MessageSid:
                  sessionId !== null && sessionId !== void 0
                    ? sessionId
                    : (_r = sessionSnapshot.entry) === null || _r === void 0
                      ? void 0
                      : _r.sessionId,
              },
              { isHeartbeat: true },
              cfg,
            ),
          ];
        case 6:
          replyResult = _3.sent();
          replyPayload = resolveHeartbeatReplyPayload(replyResult);
          if (
            !(
              !replyPayload ||
              (!replyPayload.text &&
                !replyPayload.mediaUrl &&
                !((_s = replyPayload.mediaUrls) === null || _s === void 0 ? void 0 : _s.length))
            )
          ) {
            return [3 /*break*/, 10];
          }
          heartbeatLogger.info(
            {
              to: to,
              reason: "empty-reply",
              sessionId:
                (_u =
                  (_t = sessionSnapshot.entry) === null || _t === void 0
                    ? void 0
                    : _t.sessionId) !== null && _u !== void 0
                  ? _u
                  : null,
            },
            "heartbeat skipped",
          );
          okSent = false;
          if (!visibility.showOk) {
            return [3 /*break*/, 9];
          }
          if (!dryRun) {
            return [3 /*break*/, 7];
          }
          loggers_js_1.whatsappHeartbeatLog.info("[dry-run] heartbeat ok -> ".concat(to));
          return [3 /*break*/, 9];
        case 7:
          return [4 /*yield*/, sender(to, heartbeatOkText, { verbose: verbose })];
        case 8:
          sendResult_2 = _3.sent();
          okSent = true;
          heartbeatLogger.info(
            {
              to: to,
              messageId: sendResult_2.messageId,
              chars: heartbeatOkText.length,
              reason: "heartbeat-ok",
            },
            "heartbeat ok sent",
          );
          loggers_js_1.whatsappHeartbeatLog.info(
            "heartbeat ok sent to ".concat(to, " (id ").concat(sendResult_2.messageId, ")"),
          );
          _3.label = 9;
        case 9:
          (0, heartbeat_events_js_1.emitHeartbeatEvent)({
            status: "ok-empty",
            to: to,
            channel: "whatsapp",
            silent: !okSent,
            indicatorType: visibility.useIndicator
              ? (0, heartbeat_events_js_1.resolveIndicatorType)("ok-empty")
              : undefined,
          });
          return [2 /*return*/];
        case 10:
          hasMedia = Boolean(
            replyPayload.mediaUrl ||
            ((_w = (_v = replyPayload.mediaUrls) === null || _v === void 0 ? void 0 : _v.length) !==
              null && _w !== void 0
              ? _w
              : 0) > 0,
          );
          ackMaxChars = Math.max(
            0,
            (_0 =
              (_z =
                (_y = (_x = cfg.agents) === null || _x === void 0 ? void 0 : _x.defaults) ===
                  null || _y === void 0
                  ? void 0
                  : _y.heartbeat) === null || _z === void 0
                ? void 0
                : _z.ackMaxChars) !== null && _0 !== void 0
              ? _0
              : heartbeat_js_1.DEFAULT_HEARTBEAT_ACK_MAX_CHARS,
          );
          stripped = (0, heartbeat_js_1.stripHeartbeatToken)(replyPayload.text, {
            mode: "heartbeat",
            maxAckChars: ackMaxChars,
          });
          if (!(stripped.shouldSkip && !hasMedia)) {
            return [3 /*break*/, 16];
          }
          storePath = (0, sessions_js_1.resolveStorePath)(
            (_1 = cfg.session) === null || _1 === void 0 ? void 0 : _1.store,
          );
          store = (0, sessions_js_1.loadSessionStore)(storePath);
          if (!(sessionSnapshot.entry && store[sessionSnapshot.key])) {
            return [3 /*break*/, 12];
          }
          store[sessionSnapshot.key].updatedAt = sessionSnapshot.entry.updatedAt;
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(storePath, function (nextStore) {
              var nextEntry = nextStore[sessionSnapshot.key];
              if (!nextEntry) {
                return;
              }
              nextStore[sessionSnapshot.key] = __assign(__assign({}, nextEntry), {
                updatedAt: sessionSnapshot.entry.updatedAt,
              });
            }),
          ];
        case 11:
          _3.sent();
          _3.label = 12;
        case 12:
          heartbeatLogger.info(
            {
              to: to,
              reason: "heartbeat-token",
              rawLength: (_2 = replyPayload.text) === null || _2 === void 0 ? void 0 : _2.length,
            },
            "heartbeat skipped",
          );
          okSent = false;
          if (!visibility.showOk) {
            return [3 /*break*/, 15];
          }
          if (!dryRun) {
            return [3 /*break*/, 13];
          }
          loggers_js_1.whatsappHeartbeatLog.info("[dry-run] heartbeat ok -> ".concat(to));
          return [3 /*break*/, 15];
        case 13:
          return [4 /*yield*/, sender(to, heartbeatOkText, { verbose: verbose })];
        case 14:
          sendResult_3 = _3.sent();
          okSent = true;
          heartbeatLogger.info(
            {
              to: to,
              messageId: sendResult_3.messageId,
              chars: heartbeatOkText.length,
              reason: "heartbeat-ok",
            },
            "heartbeat ok sent",
          );
          loggers_js_1.whatsappHeartbeatLog.info(
            "heartbeat ok sent to ".concat(to, " (id ").concat(sendResult_3.messageId, ")"),
          );
          _3.label = 15;
        case 15:
          (0, heartbeat_events_js_1.emitHeartbeatEvent)({
            status: "ok-token",
            to: to,
            channel: "whatsapp",
            silent: !okSent,
            indicatorType: visibility.useIndicator
              ? (0, heartbeat_events_js_1.resolveIndicatorType)("ok-token")
              : undefined,
          });
          return [2 /*return*/];
        case 16:
          if (hasMedia) {
            heartbeatLogger.warn({ to: to }, "heartbeat reply contained media; sending text only");
          }
          finalText = stripped.text || replyPayload.text || "";
          // Check if alerts are disabled for WhatsApp
          if (!visibility.showAlerts) {
            heartbeatLogger.info({ to: to, reason: "alerts-disabled" }, "heartbeat skipped");
            (0, heartbeat_events_js_1.emitHeartbeatEvent)({
              status: "skipped",
              to: to,
              reason: "alerts-disabled",
              preview: finalText.slice(0, 200),
              channel: "whatsapp",
              hasMedia: hasMedia,
              indicatorType: visibility.useIndicator
                ? (0, heartbeat_events_js_1.resolveIndicatorType)("sent")
                : undefined,
            });
            return [2 /*return*/];
          }
          if (dryRun) {
            heartbeatLogger.info(
              { to: to, reason: "dry-run", chars: finalText.length },
              "heartbeat dry-run",
            );
            loggers_js_1.whatsappHeartbeatLog.info(
              "[dry-run] heartbeat -> "
                .concat(to, ": ")
                .concat((0, util_js_1.elide)(finalText, 200)),
            );
            return [2 /*return*/];
          }
          return [4 /*yield*/, sender(to, finalText, { verbose: verbose })];
        case 17:
          sendResult = _3.sent();
          (0, heartbeat_events_js_1.emitHeartbeatEvent)({
            status: "sent",
            to: to,
            preview: finalText.slice(0, 160),
            hasMedia: hasMedia,
            channel: "whatsapp",
            indicatorType: visibility.useIndicator
              ? (0, heartbeat_events_js_1.resolveIndicatorType)("sent")
              : undefined,
          });
          heartbeatLogger.info(
            {
              to: to,
              messageId: sendResult.messageId,
              chars: finalText.length,
              preview: (0, util_js_1.elide)(finalText, 140),
            },
            "heartbeat sent",
          );
          loggers_js_1.whatsappHeartbeatLog.info("heartbeat alert sent to ".concat(to));
          return [3 /*break*/, 19];
        case 18:
          err_1 = _3.sent();
          reason = (0, session_js_1.formatError)(err_1);
          heartbeatLogger.warn({ to: to, error: reason }, "heartbeat failed");
          loggers_js_1.whatsappHeartbeatLog.warn("heartbeat failed (".concat(reason, ")"));
          (0, heartbeat_events_js_1.emitHeartbeatEvent)({
            status: "failed",
            to: to,
            reason: reason,
            channel: "whatsapp",
            indicatorType: visibility.useIndicator
              ? (0, heartbeat_events_js_1.resolveIndicatorType)("failed")
              : undefined,
          });
          throw err_1;
        case 19:
          return [2 /*return*/];
      }
    });
  });
}
function resolveHeartbeatRecipients(cfg, opts) {
  if (opts === void 0) {
    opts = {};
  }
  return (0, whatsapp_heartbeat_js_1.resolveWhatsAppHeartbeatRecipients)(cfg, opts);
}
