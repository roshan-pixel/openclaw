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
exports.monitorWebChannel = monitorWebChannel;
var history_js_1 = require("../../auto-reply/reply/history.js");
var reply_js_1 = require("../../auto-reply/reply.js");
var command_detection_js_1 = require("../../auto-reply/command-detection.js");
var inbound_debounce_js_1 = require("../../auto-reply/inbound-debounce.js");
var wait_js_1 = require("../../cli/wait.js");
var config_js_1 = require("../../config/config.js");
var globals_js_1 = require("../../globals.js");
var format_duration_js_1 = require("../../infra/format-duration.js");
var system_events_js_1 = require("../../infra/system-events.js");
var unhandled_rejections_js_1 = require("../../infra/unhandled-rejections.js");
var logging_js_1 = require("../../logging.js");
var resolve_route_js_1 = require("../../routing/resolve-route.js");
var runtime_js_1 = require("../../runtime.js");
var command_format_js_1 = require("../../cli/command-format.js");
var accounts_js_1 = require("../accounts.js");
var active_listener_js_1 = require("../active-listener.js");
var inbound_js_1 = require("../inbound.js");
var reconnect_js_1 = require("../reconnect.js");
var session_js_1 = require("../session.js");
var constants_js_1 = require("./constants.js");
var loggers_js_1 = require("./loggers.js");
var mentions_js_1 = require("./mentions.js");
var echo_js_1 = require("./monitor/echo.js");
var on_message_js_1 = require("./monitor/on-message.js");
var util_js_1 = require("./util.js");
function monitorWebChannel(verbose_1) {
  return __awaiter(
    this,
    arguments,
    void 0,
    function (verbose, listenerFactory, keepAlive, replyResolver, runtime, abortSignal, tuning) {
      var runId,
        replyLogger,
        heartbeatLogger,
        reconnectLogger,
        status,
        emitStatus,
        baseCfg,
        account,
        cfg,
        configuredMaxMb,
        maxMediaBytes,
        heartbeatSeconds,
        reconnectPolicy,
        baseMentionConfig,
        groupHistoryLimit,
        groupHistories,
        groupMemberNames,
        echoTracker,
        sleep,
        stopRequested,
        abortPromise,
        currentMaxListeners,
        sigintStop,
        handleSigint,
        reconnectAttempts,
        _loop_1,
        state_1;
      var _this = this;
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
      if (listenerFactory === void 0) {
        listenerFactory = inbound_js_1.monitorWebInbox;
      }
      if (keepAlive === void 0) {
        keepAlive = true;
      }
      if (replyResolver === void 0) {
        replyResolver = reply_js_1.getReplyFromConfig;
      }
      if (runtime === void 0) {
        runtime = runtime_js_1.defaultRuntime;
      }
      if (tuning === void 0) {
        tuning = {};
      }
      return __generator(this, function (_x) {
        switch (_x.label) {
          case 0:
            runId = (0, reconnect_js_1.newConnectionId)();
            replyLogger = (0, logging_js_1.getChildLogger)({
              module: "web-auto-reply",
              runId: runId,
            });
            heartbeatLogger = (0, logging_js_1.getChildLogger)({
              module: "web-heartbeat",
              runId: runId,
            });
            reconnectLogger = (0, logging_js_1.getChildLogger)({
              module: "web-reconnect",
              runId: runId,
            });
            status = {
              running: true,
              connected: false,
              reconnectAttempts: 0,
              lastConnectedAt: null,
              lastDisconnect: null,
              lastMessageAt: null,
              lastEventAt: null,
              lastError: null,
            };
            emitStatus = function () {
              var _a;
              (_a = tuning.statusSink) === null || _a === void 0
                ? void 0
                : _a.call(
                    tuning,
                    __assign(__assign({}, status), {
                      lastDisconnect: status.lastDisconnect
                        ? __assign({}, status.lastDisconnect)
                        : null,
                    }),
                  );
            };
            emitStatus();
            baseCfg = (0, config_js_1.loadConfig)();
            account = (0, accounts_js_1.resolveWhatsAppAccount)({
              cfg: baseCfg,
              accountId: tuning.accountId,
            });
            cfg = __assign(__assign({}, baseCfg), {
              channels: __assign(__assign({}, baseCfg.channels), {
                whatsapp: __assign(
                  __assign(
                    {},
                    (_a = baseCfg.channels) === null || _a === void 0 ? void 0 : _a.whatsapp,
                  ),
                  {
                    ackReaction: account.ackReaction,
                    messagePrefix: account.messagePrefix,
                    allowFrom: account.allowFrom,
                    groupAllowFrom: account.groupAllowFrom,
                    groupPolicy: account.groupPolicy,
                    textChunkLimit: account.textChunkLimit,
                    chunkMode: account.chunkMode,
                    mediaMaxMb: account.mediaMaxMb,
                    blockStreaming: account.blockStreaming,
                    groups: account.groups,
                  },
                ),
              }),
            });
            configuredMaxMb =
              (_c = (_b = cfg.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null ||
              _c === void 0
                ? void 0
                : _c.mediaMaxMb;
            maxMediaBytes =
              typeof configuredMaxMb === "number" && configuredMaxMb > 0
                ? configuredMaxMb * 1024 * 1024
                : constants_js_1.DEFAULT_WEB_MEDIA_BYTES;
            heartbeatSeconds = (0, reconnect_js_1.resolveHeartbeatSeconds)(
              cfg,
              tuning.heartbeatSeconds,
            );
            reconnectPolicy = (0, reconnect_js_1.resolveReconnectPolicy)(cfg, tuning.reconnect);
            baseMentionConfig = (0, mentions_js_1.buildMentionConfig)(cfg);
            groupHistoryLimit =
              (_q =
                (_m =
                  (_j =
                    (_h =
                      (_f =
                        (_e =
                          (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.whatsapp) ===
                          null || _e === void 0
                          ? void 0
                          : _e.accounts) === null || _f === void 0
                        ? void 0
                        : _f[(_g = tuning.accountId) !== null && _g !== void 0 ? _g : ""]) ===
                      null || _h === void 0
                      ? void 0
                      : _h.historyLimit) !== null && _j !== void 0
                    ? _j
                    : (_l =
                          (_k = cfg.channels) === null || _k === void 0 ? void 0 : _k.whatsapp) ===
                          null || _l === void 0
                      ? void 0
                      : _l.historyLimit) !== null && _m !== void 0
                  ? _m
                  : (_p = (_o = cfg.messages) === null || _o === void 0 ? void 0 : _o.groupChat) ===
                        null || _p === void 0
                    ? void 0
                    : _p.historyLimit) !== null && _q !== void 0
                ? _q
                : history_js_1.DEFAULT_GROUP_HISTORY_LIMIT;
            groupHistories = new Map();
            groupMemberNames = new Map();
            echoTracker = (0, echo_js_1.createEchoTracker)({
              maxItems: 100,
              logVerbose: globals_js_1.logVerbose,
            });
            sleep =
              (_r = tuning.sleep) !== null && _r !== void 0
                ? _r
                : function (ms, signal) {
                    return (0, reconnect_js_1.sleepWithAbort)(
                      ms,
                      signal !== null && signal !== void 0 ? signal : abortSignal,
                    );
                  };
            stopRequested = function () {
              return (
                (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) ===
                true
              );
            };
            abortPromise =
              abortSignal &&
              new Promise(function (resolve) {
                return abortSignal.addEventListener(
                  "abort",
                  function () {
                    return resolve("aborted");
                  },
                  {
                    once: true,
                  },
                );
              });
            currentMaxListeners =
              (_t =
                (_s = process.getMaxListeners) === null || _s === void 0
                  ? void 0
                  : _s.call(process)) !== null && _t !== void 0
                ? _t
                : 10;
            if (process.setMaxListeners && currentMaxListeners < 50) {
              process.setMaxListeners(50);
            }
            sigintStop = false;
            handleSigint = function () {
              sigintStop = true;
            };
            process.once("SIGINT", handleSigint);
            reconnectAttempts = 0;
            _loop_1 = function () {
              var connectionId,
                startedAt,
                heartbeat,
                watchdogTimer,
                lastMessageAt,
                handledMessages,
                _lastInboundMsg,
                unregisterUnhandled,
                MESSAGE_TIMEOUT_MS,
                WATCHDOG_CHECK_MS,
                backgroundTasks,
                onMessage,
                inboundDebounceMs,
                shouldDebounce,
                listener,
                selfE164,
                connectRoute,
                closeListener,
                reason,
                uptimeMs,
                statusCode,
                loggedOut,
                errorStr,
                delay,
                _y;
              return __generator(this, function (_z) {
                switch (_z.label) {
                  case 0:
                    if (stopRequested()) {
                      return [2 /*return*/, "break"];
                    }
                    connectionId = (0, reconnect_js_1.newConnectionId)();
                    startedAt = Date.now();
                    heartbeat = null;
                    watchdogTimer = null;
                    lastMessageAt = null;
                    handledMessages = 0;
                    _lastInboundMsg = null;
                    unregisterUnhandled = null;
                    MESSAGE_TIMEOUT_MS = 30 * 60 * 1000;
                    WATCHDOG_CHECK_MS = 60 * 1000;
                    backgroundTasks = new Set();
                    onMessage = (0, on_message_js_1.createWebOnMessageHandler)({
                      cfg: cfg,
                      verbose: verbose,
                      connectionId: connectionId,
                      maxMediaBytes: maxMediaBytes,
                      groupHistoryLimit: groupHistoryLimit,
                      groupHistories: groupHistories,
                      groupMemberNames: groupMemberNames,
                      echoTracker: echoTracker,
                      backgroundTasks: backgroundTasks,
                      replyResolver:
                        replyResolver !== null && replyResolver !== void 0
                          ? replyResolver
                          : reply_js_1.getReplyFromConfig,
                      replyLogger: replyLogger,
                      baseMentionConfig: baseMentionConfig,
                      account: account,
                    });
                    inboundDebounceMs = (0, inbound_debounce_js_1.resolveInboundDebounceMs)({
                      cfg: cfg,
                      channel: "whatsapp",
                    });
                    shouldDebounce = function (msg) {
                      if (msg.mediaPath || msg.mediaType) {
                        return false;
                      }
                      if (msg.location) {
                        return false;
                      }
                      if (msg.replyToId || msg.replyToBody) {
                        return false;
                      }
                      return !(0, command_detection_js_1.hasControlCommand)(msg.body, cfg);
                    };
                    return [
                      4 /*yield*/,
                      (listenerFactory !== null && listenerFactory !== void 0
                        ? listenerFactory
                        : inbound_js_1.monitorWebInbox)({
                        verbose: verbose,
                        accountId: account.accountId,
                        authDir: account.authDir,
                        mediaMaxMb: account.mediaMaxMb,
                        sendReadReceipts: account.sendReadReceipts,
                        debounceMs: inboundDebounceMs,
                        shouldDebounce: shouldDebounce,
                        onMessage: function (msg) {
                          return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                              switch (_a.label) {
                                case 0:
                                  handledMessages += 1;
                                  lastMessageAt = Date.now();
                                  status.lastMessageAt = lastMessageAt;
                                  status.lastEventAt = lastMessageAt;
                                  emitStatus();
                                  _lastInboundMsg = msg;
                                  return [4 /*yield*/, onMessage(msg)];
                                case 1:
                                  _a.sent();
                                  return [2 /*return*/];
                              }
                            });
                          });
                        },
                      }),
                    ];
                  case 1:
                    listener = _z.sent();
                    status.connected = true;
                    status.lastConnectedAt = Date.now();
                    status.lastEventAt = status.lastConnectedAt;
                    status.lastError = null;
                    emitStatus();
                    selfE164 = (0, session_js_1.readWebSelfId)(account.authDir).e164;
                    connectRoute = (0, resolve_route_js_1.resolveAgentRoute)({
                      cfg: cfg,
                      channel: "whatsapp",
                      accountId: account.accountId,
                    });
                    (0, system_events_js_1.enqueueSystemEvent)(
                      "WhatsApp gateway connected".concat(
                        selfE164 ? " as ".concat(selfE164) : "",
                        ".",
                      ),
                      {
                        sessionKey: connectRoute.sessionKey,
                      },
                    );
                    (0, active_listener_js_1.setActiveWebListener)(account.accountId, listener);
                    unregisterUnhandled = (0,
                    unhandled_rejections_js_1.registerUnhandledRejectionHandler)(function (reason) {
                      var _a;
                      if (!(0, util_js_1.isLikelyWhatsAppCryptoError)(reason)) {
                        return false;
                      }
                      var errorStr = (0, session_js_1.formatError)(reason);
                      reconnectLogger.warn(
                        { connectionId: connectionId, error: errorStr },
                        "web reconnect: unhandled rejection from WhatsApp socket; forcing reconnect",
                      );
                      (_a = listener.signalClose) === null || _a === void 0
                        ? void 0
                        : _a.call(listener, {
                            status: 499,
                            isLoggedOut: false,
                            error: reason,
                          });
                      return true;
                    });
                    closeListener = function () {
                      return __awaiter(_this, void 0, void 0, function () {
                        var err_1;
                        return __generator(this, function (_a) {
                          switch (_a.label) {
                            case 0:
                              (0, active_listener_js_1.setActiveWebListener)(
                                account.accountId,
                                null,
                              );
                              if (unregisterUnhandled) {
                                unregisterUnhandled();
                                unregisterUnhandled = null;
                              }
                              if (heartbeat) {
                                clearInterval(heartbeat);
                              }
                              if (watchdogTimer) {
                                clearInterval(watchdogTimer);
                              }
                              if (!(backgroundTasks.size > 0)) {
                                return [3 /*break*/, 2];
                              }
                              return [4 /*yield*/, Promise.allSettled(backgroundTasks)];
                            case 1:
                              _a.sent();
                              backgroundTasks.clear();
                              _a.label = 2;
                            case 2:
                              _a.trys.push([2, 4, , 5]);
                              return [4 /*yield*/, listener.close()];
                            case 3:
                              _a.sent();
                              return [3 /*break*/, 5];
                            case 4:
                              err_1 = _a.sent();
                              (0, globals_js_1.logVerbose)(
                                "Socket close failed: ".concat(
                                  (0, session_js_1.formatError)(err_1),
                                ),
                              );
                              return [3 /*break*/, 5];
                            case 5:
                              return [2 /*return*/];
                          }
                        });
                      });
                    };
                    if (keepAlive) {
                      heartbeat = setInterval(function () {
                        var authAgeMs = (0, session_js_1.getWebAuthAgeMs)(account.authDir);
                        var minutesSinceLastMessage = lastMessageAt
                          ? Math.floor((Date.now() - lastMessageAt) / 60000)
                          : null;
                        var logData = __assign(
                          {
                            connectionId: connectionId,
                            reconnectAttempts: reconnectAttempts,
                            messagesHandled: handledMessages,
                            lastMessageAt: lastMessageAt,
                            authAgeMs: authAgeMs,
                            uptimeMs: Date.now() - startedAt,
                          },
                          minutesSinceLastMessage !== null && minutesSinceLastMessage > 30
                            ? { minutesSinceLastMessage: minutesSinceLastMessage }
                            : {},
                        );
                        if (minutesSinceLastMessage && minutesSinceLastMessage > 30) {
                          heartbeatLogger.warn(
                            logData,
                            "⚠️ web gateway heartbeat - no messages in 30+ minutes",
                          );
                        } else {
                          heartbeatLogger.info(logData, "web gateway heartbeat");
                        }
                      }, heartbeatSeconds * 1000);
                      watchdogTimer = setInterval(function () {
                        var _a;
                        if (!lastMessageAt) {
                          return;
                        }
                        var timeSinceLastMessage = Date.now() - lastMessageAt;
                        if (timeSinceLastMessage <= MESSAGE_TIMEOUT_MS) {
                          return;
                        }
                        var minutesSinceLastMessage = Math.floor(timeSinceLastMessage / 60000);
                        heartbeatLogger.warn(
                          {
                            connectionId: connectionId,
                            minutesSinceLastMessage: minutesSinceLastMessage,
                            lastMessageAt: new Date(lastMessageAt),
                            messagesHandled: handledMessages,
                          },
                          "Message timeout detected - forcing reconnect",
                        );
                        loggers_js_1.whatsappHeartbeatLog.warn(
                          "No messages received in ".concat(
                            minutesSinceLastMessage,
                            "m - restarting connection",
                          ),
                        );
                        void closeListener().catch(function (err) {
                          (0, globals_js_1.logVerbose)(
                            "Close listener failed: ".concat((0, session_js_1.formatError)(err)),
                          );
                        });
                        (_a = listener.signalClose) === null || _a === void 0
                          ? void 0
                          : _a.call(listener, {
                              status: 499,
                              isLoggedOut: false,
                              error: "watchdog-timeout",
                            });
                      }, WATCHDOG_CHECK_MS);
                    }
                    loggers_js_1.whatsappLog.info(
                      "Listening for personal WhatsApp inbound messages.",
                    );
                    if (process.stdout.isTTY || process.stderr.isTTY) {
                      loggers_js_1.whatsappLog.raw("Ctrl+C to stop.");
                    }
                    if (!!keepAlive) {
                      return [3 /*break*/, 3];
                    }
                    return [4 /*yield*/, closeListener()];
                  case 2:
                    _z.sent();
                    return [2 /*return*/, { value: void 0 }];
                  case 3:
                    return [
                      4 /*yield*/,
                      Promise.race([
                        (_v =
                          (_u = listener.onClose) === null || _u === void 0
                            ? void 0
                            : _u.catch(function (err) {
                                reconnectLogger.error(
                                  { error: (0, session_js_1.formatError)(err) },
                                  "listener.onClose rejected",
                                );
                                return { status: 500, isLoggedOut: false, error: err };
                              })) !== null && _v !== void 0
                          ? _v
                          : (0, wait_js_1.waitForever)(),
                        abortPromise !== null && abortPromise !== void 0
                          ? abortPromise
                          : (0, wait_js_1.waitForever)(),
                      ]),
                    ];
                  case 4:
                    reason = _z.sent();
                    uptimeMs = Date.now() - startedAt;
                    if (uptimeMs > heartbeatSeconds * 1000) {
                      reconnectAttempts = 0; // Healthy stretch; reset the backoff.
                    }
                    status.reconnectAttempts = reconnectAttempts;
                    emitStatus();
                    if (!(stopRequested() || sigintStop || reason === "aborted")) {
                      return [3 /*break*/, 6];
                    }
                    return [4 /*yield*/, closeListener()];
                  case 5:
                    _z.sent();
                    return [2 /*return*/, "break"];
                  case 6:
                    statusCode =
                      (_w =
                        typeof reason === "object" && reason && "status" in reason
                          ? reason.status
                          : undefined) !== null && _w !== void 0
                        ? _w
                        : "unknown";
                    loggedOut =
                      typeof reason === "object" &&
                      reason &&
                      "isLoggedOut" in reason &&
                      reason.isLoggedOut;
                    errorStr = (0, session_js_1.formatError)(reason);
                    status.connected = false;
                    status.lastEventAt = Date.now();
                    status.lastDisconnect = {
                      at: status.lastEventAt,
                      status: typeof statusCode === "number" ? statusCode : undefined,
                      error: errorStr,
                      loggedOut: Boolean(loggedOut),
                    };
                    status.lastError = errorStr;
                    status.reconnectAttempts = reconnectAttempts;
                    emitStatus();
                    reconnectLogger.info(
                      {
                        connectionId: connectionId,
                        status: statusCode,
                        loggedOut: loggedOut,
                        reconnectAttempts: reconnectAttempts,
                        error: errorStr,
                      },
                      "web reconnect: connection closed",
                    );
                    (0, system_events_js_1.enqueueSystemEvent)(
                      "WhatsApp gateway disconnected (status ".concat(
                        statusCode !== null && statusCode !== void 0 ? statusCode : "unknown",
                        ")",
                      ),
                      {
                        sessionKey: connectRoute.sessionKey,
                      },
                    );
                    if (!loggedOut) {
                      return [3 /*break*/, 8];
                    }
                    runtime.error(
                      "WhatsApp session logged out. Run `".concat(
                        (0, command_format_js_1.formatCliCommand)(
                          "openclaw channels login --channel web",
                        ),
                        "` to relink.",
                      ),
                    );
                    return [4 /*yield*/, closeListener()];
                  case 7:
                    _z.sent();
                    return [2 /*return*/, "break"];
                  case 8:
                    reconnectAttempts += 1;
                    status.reconnectAttempts = reconnectAttempts;
                    emitStatus();
                    if (
                      !(
                        reconnectPolicy.maxAttempts > 0 &&
                        reconnectAttempts >= reconnectPolicy.maxAttempts
                      )
                    ) {
                      return [3 /*break*/, 10];
                    }
                    reconnectLogger.warn(
                      {
                        connectionId: connectionId,
                        status: statusCode,
                        reconnectAttempts: reconnectAttempts,
                        maxAttempts: reconnectPolicy.maxAttempts,
                      },
                      "web reconnect: max attempts reached; continuing in degraded mode",
                    );
                    runtime.error(
                      "WhatsApp Web reconnect: max attempts reached ("
                        .concat(reconnectAttempts, "/")
                        .concat(reconnectPolicy.maxAttempts, "). Stopping web monitoring."),
                    );
                    return [4 /*yield*/, closeListener()];
                  case 9:
                    _z.sent();
                    return [2 /*return*/, "break"];
                  case 10:
                    delay = (0, reconnect_js_1.computeBackoff)(reconnectPolicy, reconnectAttempts);
                    reconnectLogger.info(
                      {
                        connectionId: connectionId,
                        status: statusCode,
                        reconnectAttempts: reconnectAttempts,
                        maxAttempts: reconnectPolicy.maxAttempts || "unlimited",
                        delayMs: delay,
                      },
                      "web reconnect: scheduling retry",
                    );
                    runtime.error(
                      "WhatsApp Web connection closed (status "
                        .concat(statusCode, "). Retry ")
                        .concat(reconnectAttempts, "/")
                        .concat(reconnectPolicy.maxAttempts || "∞", " in ")
                        .concat((0, format_duration_js_1.formatDurationMs)(delay), "\u2026 (")
                        .concat(errorStr, ")"),
                    );
                    return [4 /*yield*/, closeListener()];
                  case 11:
                    _z.sent();
                    _z.label = 12;
                  case 12:
                    _z.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, sleep(delay, abortSignal)];
                  case 13:
                    _z.sent();
                    return [3 /*break*/, 15];
                  case 14:
                    _y = _z.sent();
                    return [2 /*return*/, "break"];
                  case 15:
                    return [2 /*return*/];
                }
              });
            };
            _x.label = 1;
          case 1:
            if (!true) {
              return [3 /*break*/, 3];
            }
            return [5 /*yield**/, _loop_1()];
          case 2:
            state_1 = _x.sent();
            if (typeof state_1 === "object") {
              return [2 /*return*/, state_1.value];
            }
            if (state_1 === "break") {
              return [3 /*break*/, 3];
            }
            return [3 /*break*/, 1];
          case 3:
            status.running = false;
            status.connected = false;
            status.lastEventAt = Date.now();
            emitStatus();
            process.removeListener("SIGINT", handleSigint);
            return [2 /*return*/];
        }
      });
    },
  );
}
