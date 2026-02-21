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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMessage = processMessage;
var identity_js_1 = require("../../../agents/identity.js");
var chunk_js_1 = require("../../../auto-reply/chunk.js");
var envelope_js_1 = require("../../../auto-reply/envelope.js");
var history_js_1 = require("../../../auto-reply/reply/history.js");
var provider_dispatcher_js_1 = require("../../../auto-reply/reply/provider-dispatcher.js");
var command_detection_js_1 = require("../../../auto-reply/command-detection.js");
var inbound_context_js_1 = require("../../../auto-reply/reply/inbound-context.js");
var location_js_1 = require("../../../channels/location.js");
var reply_prefix_js_1 = require("../../../channels/reply-prefix.js");
var sessions_js_1 = require("../../../config/sessions.js");
var markdown_tables_js_1 = require("../../../config/markdown-tables.js");
var globals_js_1 = require("../../../globals.js");
var pairing_store_js_1 = require("../../../pairing/pairing-store.js");
var utils_js_1 = require("../../../utils.js");
var reconnect_js_1 = require("../../reconnect.js");
var session_js_1 = require("../../session.js");
var deliver_reply_js_1 = require("../deliver-reply.js");
var loggers_js_1 = require("../loggers.js");
var util_js_1 = require("../util.js");
var ack_reaction_js_1 = require("./ack-reaction.js");
var group_members_js_1 = require("./group-members.js");
var last_route_js_1 = require("./last-route.js");
var message_line_js_1 = require("./message-line.js");
function normalizeAllowFromE164(values) {
  var list = Array.isArray(values) ? values : [];
  return list
    .map(function (entry) {
      return String(entry).trim();
    })
    .filter(function (entry) {
      return entry && entry !== "*";
    })
    .map(function (entry) {
      return (0, utils_js_1.normalizeE164)(entry);
    })
    .filter(function (entry) {
      return Boolean(entry);
    });
}
function resolveWhatsAppCommandAuthorized(params) {
  return __awaiter(this, void 0, void 0, function () {
    var useAccessGroups,
      isGroup,
      senderE164,
      configuredAllowFrom,
      configuredGroupAllowFrom,
      storeAllowFrom,
      combinedAllowFrom,
      allowFrom;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
      switch (_l.label) {
        case 0:
          useAccessGroups =
            ((_a = params.cfg.commands) === null || _a === void 0 ? void 0 : _a.useAccessGroups) !==
            false;
          if (!useAccessGroups) {
            return [2 /*return*/, true];
          }
          isGroup = params.msg.chatType === "group";
          senderE164 = (0, utils_js_1.normalizeE164)(
            isGroup
              ? (_b = params.msg.senderE164) !== null && _b !== void 0
                ? _b
                : ""
              : (_d =
                    (_c = params.msg.senderE164) !== null && _c !== void 0
                      ? _c
                      : params.msg.from) !== null && _d !== void 0
                ? _d
                : "",
          );
          if (!senderE164) {
            return [2 /*return*/, false];
          }
          configuredAllowFrom =
            (_g =
              (_f = (_e = params.cfg.channels) === null || _e === void 0 ? void 0 : _e.whatsapp) ===
                null || _f === void 0
                ? void 0
                : _f.allowFrom) !== null && _g !== void 0
              ? _g
              : [];
          configuredGroupAllowFrom =
            (_k =
              (_j = (_h = params.cfg.channels) === null || _h === void 0 ? void 0 : _h.whatsapp) ===
                null || _j === void 0
                ? void 0
                : _j.groupAllowFrom) !== null && _k !== void 0
              ? _k
              : configuredAllowFrom.length > 0
                ? configuredAllowFrom
                : undefined;
          if (isGroup) {
            if (!configuredGroupAllowFrom || configuredGroupAllowFrom.length === 0) {
              return [2 /*return*/, false];
            }
            if (
              configuredGroupAllowFrom.some(function (v) {
                return String(v).trim() === "*";
              })
            ) {
              return [2 /*return*/, true];
            }
            return [
              2 /*return*/,
              normalizeAllowFromE164(configuredGroupAllowFrom).includes(senderE164),
            ];
          }
          return [
            4 /*yield*/,
            (0, pairing_store_js_1.readChannelAllowFromStore)("whatsapp").catch(function () {
              return [];
            }),
          ];
        case 1:
          storeAllowFrom = _l.sent();
          combinedAllowFrom = Array.from(
            new Set(
              __spreadArray(
                __spreadArray(
                  [],
                  configuredAllowFrom !== null && configuredAllowFrom !== void 0
                    ? configuredAllowFrom
                    : [],
                  true,
                ),
                storeAllowFrom,
                true,
              ),
            ),
          );
          allowFrom =
            combinedAllowFrom.length > 0
              ? combinedAllowFrom
              : params.msg.selfE164
                ? [params.msg.selfE164]
                : [];
          if (
            allowFrom.some(function (v) {
              return String(v).trim() === "*";
            })
          ) {
            return [2 /*return*/, true];
          }
          return [2 /*return*/, normalizeAllowFromE164(allowFrom).includes(senderE164)];
      }
    });
  });
}
function processMessage(params) {
  return __awaiter(this, void 0, void 0, function () {
    var conversationId,
      storePath,
      envelopeOptions,
      previousTimestamp,
      combinedBody,
      shouldClearGroupHistory,
      history_1,
      historyEntries,
      combinedEchoKey,
      correlationId,
      fromDisplay,
      kindLabel,
      dmRouteTarget,
      textLimit,
      chunkMode,
      tableMode,
      didLogHeartbeatStrip,
      didSendReply,
      commandAuthorized,
      _a,
      configuredResponsePrefix,
      prefixContext,
      isSelfChat,
      responsePrefix,
      ctxPayload,
      metaTask,
      queuedFinal;
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    return __generator(this, function (_t) {
      switch (_t.label) {
        case 0:
          conversationId =
            (_b = params.msg.conversationId) !== null && _b !== void 0 ? _b : params.msg.from;
          storePath = (0, sessions_js_1.resolveStorePath)(
            (_c = params.cfg.session) === null || _c === void 0 ? void 0 : _c.store,
            {
              agentId: params.route.agentId,
            },
          );
          envelopeOptions = (0, envelope_js_1.resolveEnvelopeFormatOptions)(params.cfg);
          previousTimestamp = (0, sessions_js_1.readSessionUpdatedAt)({
            storePath: storePath,
            sessionKey: params.route.sessionKey,
          });
          combinedBody = (0, message_line_js_1.buildInboundLine)({
            cfg: params.cfg,
            msg: params.msg,
            agentId: params.route.agentId,
            previousTimestamp: previousTimestamp,
            envelope: envelopeOptions,
          });
          shouldClearGroupHistory = false;
          if (params.msg.chatType === "group") {
            history_1 =
              (_e =
                (_d = params.groupHistory) !== null && _d !== void 0
                  ? _d
                  : params.groupHistories.get(params.groupHistoryKey)) !== null && _e !== void 0
                ? _e
                : [];
            if (history_1.length > 0) {
              historyEntries = history_1.map(function (m) {
                return {
                  sender: m.sender,
                  body: m.body,
                  timestamp: m.timestamp,
                  messageId: m.id,
                };
              });
              combinedBody = (0, history_js_1.buildHistoryContextFromEntries)({
                entries: historyEntries,
                currentMessage: combinedBody,
                excludeLast: false,
                formatEntry: function (entry) {
                  var bodyWithId = entry.messageId
                    ? "".concat(entry.body, "\n[message_id: ").concat(entry.messageId, "]")
                    : entry.body;
                  return (0, envelope_js_1.formatInboundEnvelope)({
                    channel: "WhatsApp",
                    from: conversationId,
                    timestamp: entry.timestamp,
                    body: bodyWithId,
                    chatType: "group",
                    senderLabel: entry.sender,
                    envelope: envelopeOptions,
                  });
                },
              });
            }
            shouldClearGroupHistory = !((_f = params.suppressGroupHistoryClear) !== null &&
            _f !== void 0
              ? _f
              : false);
          }
          combinedEchoKey = params.buildCombinedEchoKey({
            sessionKey: params.route.sessionKey,
            combinedBody: combinedBody,
          });
          if (params.echoHas(combinedEchoKey)) {
            (0, globals_js_1.logVerbose)("Skipping auto-reply: detected echo for combined message");
            params.echoForget(combinedEchoKey);
            return [2 /*return*/, false];
          }
          // Send ack reaction immediately upon message receipt (post-gating)
          (0, ack_reaction_js_1.maybeSendAckReaction)({
            cfg: params.cfg,
            msg: params.msg,
            agentId: params.route.agentId,
            sessionKey: params.route.sessionKey,
            conversationId: conversationId,
            verbose: params.verbose,
            accountId: params.route.accountId,
            info: params.replyLogger.info.bind(params.replyLogger),
            warn: params.replyLogger.warn.bind(params.replyLogger),
          });
          correlationId =
            (_g = params.msg.id) !== null && _g !== void 0
              ? _g
              : (0, reconnect_js_1.newConnectionId)();
          params.replyLogger.info(
            {
              connectionId: params.connectionId,
              correlationId: correlationId,
              from: params.msg.chatType === "group" ? conversationId : params.msg.from,
              to: params.msg.to,
              body: (0, util_js_1.elide)(combinedBody, 240),
              mediaType: (_h = params.msg.mediaType) !== null && _h !== void 0 ? _h : null,
              mediaPath: (_j = params.msg.mediaPath) !== null && _j !== void 0 ? _j : null,
            },
            "inbound web message",
          );
          fromDisplay = params.msg.chatType === "group" ? conversationId : params.msg.from;
          kindLabel = params.msg.mediaType ? ", ".concat(params.msg.mediaType) : "";
          loggers_js_1.whatsappInboundLog.info(
            "Inbound message "
              .concat(fromDisplay, " -> ")
              .concat(params.msg.to, " (")
              .concat(params.msg.chatType)
              .concat(kindLabel, ", ")
              .concat(combinedBody.length, " chars)"),
          );
          if ((0, globals_js_1.shouldLogVerbose)()) {
            loggers_js_1.whatsappInboundLog.debug(
              "Inbound body: ".concat((0, util_js_1.elide)(combinedBody, 400)),
            );
          }
          dmRouteTarget =
            params.msg.chatType !== "group"
              ? (function () {
                  if (params.msg.senderE164) {
                    return (0, utils_js_1.normalizeE164)(params.msg.senderE164);
                  }
                  // In direct chats, `msg.from` is already the canonical conversation id.
                  if (params.msg.from.includes("@")) {
                    return (0, utils_js_1.jidToE164)(params.msg.from);
                  }
                  return (0, utils_js_1.normalizeE164)(params.msg.from);
                })()
              : undefined;
          textLimit =
            (_k = params.maxMediaTextChunkLimit) !== null && _k !== void 0
              ? _k
              : (0, chunk_js_1.resolveTextChunkLimit)(params.cfg, "whatsapp");
          chunkMode = (0, chunk_js_1.resolveChunkMode)(
            params.cfg,
            "whatsapp",
            params.route.accountId,
          );
          tableMode = (0, markdown_tables_js_1.resolveMarkdownTableMode)({
            cfg: params.cfg,
            channel: "whatsapp",
            accountId: params.route.accountId,
          });
          didLogHeartbeatStrip = false;
          didSendReply = false;
          if (
            !(0, command_detection_js_1.shouldComputeCommandAuthorized)(params.msg.body, params.cfg)
          ) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            resolveWhatsAppCommandAuthorized({ cfg: params.cfg, msg: params.msg }),
          ];
        case 1:
          _a = _t.sent();
          return [3 /*break*/, 3];
        case 2:
          _a = undefined;
          _t.label = 3;
        case 3:
          commandAuthorized = _a;
          configuredResponsePrefix =
            (_l = params.cfg.messages) === null || _l === void 0 ? void 0 : _l.responsePrefix;
          prefixContext = (0, reply_prefix_js_1.createReplyPrefixContext)({
            cfg: params.cfg,
            agentId: params.route.agentId,
          });
          isSelfChat =
            params.msg.chatType !== "group" &&
            Boolean(params.msg.selfE164) &&
            (0, utils_js_1.normalizeE164)(params.msg.from) ===
              (0, utils_js_1.normalizeE164)(
                (_m = params.msg.selfE164) !== null && _m !== void 0 ? _m : "",
              );
          responsePrefix =
            (_o = prefixContext.responsePrefix) !== null && _o !== void 0
              ? _o
              : configuredResponsePrefix === undefined && isSelfChat
                ? (_p = (0, identity_js_1.resolveIdentityNamePrefix)(
                    params.cfg,
                    params.route.agentId,
                  )) !== null && _p !== void 0
                  ? _p
                  : "[openclaw]"
                : undefined;
          ctxPayload = (0, inbound_context_js_1.finalizeInboundContext)(
            __assign(
              __assign(
                {
                  Body: combinedBody,
                  RawBody: params.msg.body,
                  CommandBody: params.msg.body,
                  From: params.msg.from,
                  To: params.msg.to,
                  SessionKey: params.route.sessionKey,
                  AccountId: params.route.accountId,
                  MessageSid: params.msg.id,
                  ReplyToId: params.msg.replyToId,
                  ReplyToBody: params.msg.replyToBody,
                  ReplyToSender: params.msg.replyToSender,
                  MediaPath: params.msg.mediaPath,
                  MediaUrl: params.msg.mediaUrl,
                  MediaType: params.msg.mediaType,
                  ChatType: params.msg.chatType,
                  ConversationLabel:
                    params.msg.chatType === "group" ? conversationId : params.msg.from,
                  GroupSubject: params.msg.groupSubject,
                  GroupMembers: (0, group_members_js_1.formatGroupMembers)({
                    participants: params.msg.groupParticipants,
                    roster: params.groupMemberNames.get(params.groupHistoryKey),
                    fallbackE164: params.msg.senderE164,
                  }),
                  SenderName: params.msg.senderName,
                  SenderId:
                    ((_q = params.msg.senderJid) === null || _q === void 0 ? void 0 : _q.trim()) ||
                    params.msg.senderE164,
                  SenderE164: params.msg.senderE164,
                  CommandAuthorized: commandAuthorized,
                  WasMentioned: params.msg.wasMentioned,
                },
                params.msg.location
                  ? (0, location_js_1.toLocationContext)(params.msg.location)
                  : {},
              ),
              {
                Provider: "whatsapp",
                Surface: "whatsapp",
                OriginatingChannel: "whatsapp",
                OriginatingTo: params.msg.from,
              },
            ),
          );
          if (dmRouteTarget) {
            (0, last_route_js_1.updateLastRouteInBackground)({
              cfg: params.cfg,
              backgroundTasks: params.backgroundTasks,
              storeAgentId: params.route.agentId,
              sessionKey: params.route.mainSessionKey,
              channel: "whatsapp",
              to: dmRouteTarget,
              accountId: params.route.accountId,
              ctx: ctxPayload,
              warn: params.replyLogger.warn.bind(params.replyLogger),
            });
          }
          metaTask = (0, sessions_js_1.recordSessionMetaFromInbound)({
            storePath: storePath,
            sessionKey: params.route.sessionKey,
            ctx: ctxPayload,
          }).catch(function (err) {
            params.replyLogger.warn(
              {
                error: (0, session_js_1.formatError)(err),
                storePath: storePath,
                sessionKey: params.route.sessionKey,
              },
              "failed updating session meta",
            );
          });
          (0, last_route_js_1.trackBackgroundTask)(params.backgroundTasks, metaTask);
          return [
            4 /*yield*/,
            (0, provider_dispatcher_js_1.dispatchReplyWithBufferedBlockDispatcher)({
              ctx: ctxPayload,
              cfg: params.cfg,
              replyResolver: params.replyResolver,
              dispatcherOptions: {
                responsePrefix: responsePrefix,
                responsePrefixContextProvider: prefixContext.responsePrefixContextProvider,
                onHeartbeatStrip: function () {
                  if (!didLogHeartbeatStrip) {
                    didLogHeartbeatStrip = true;
                    (0, globals_js_1.logVerbose)(
                      "Stripped stray HEARTBEAT_OK token from web reply",
                    );
                  }
                },
                deliver: function (payload, info) {
                  return __awaiter(_this, void 0, void 0, function () {
                    var shouldLog, fromDisplay_1, hasMedia, preview;
                    var _a, _b;
                    return __generator(this, function (_c) {
                      switch (_c.label) {
                        case 0:
                          return [
                            4 /*yield*/,
                            (0, deliver_reply_js_1.deliverWebReply)({
                              replyResult: payload,
                              msg: params.msg,
                              maxMediaBytes: params.maxMediaBytes,
                              textLimit: textLimit,
                              chunkMode: chunkMode,
                              replyLogger: params.replyLogger,
                              connectionId: params.connectionId,
                              // Tool + block updates are noisy; skip their log lines.
                              skipLog: info.kind !== "final",
                              tableMode: tableMode,
                            }),
                          ];
                        case 1:
                          _c.sent();
                          didSendReply = true;
                          if (info.kind === "tool") {
                            params.rememberSentText(payload.text, {});
                            return [2 /*return*/];
                          }
                          shouldLog = info.kind === "final" && payload.text ? true : undefined;
                          params.rememberSentText(payload.text, {
                            combinedBody: combinedBody,
                            combinedBodySessionKey: params.route.sessionKey,
                            logVerboseMessage: shouldLog,
                          });
                          if (info.kind === "final") {
                            fromDisplay_1 =
                              params.msg.chatType === "group"
                                ? conversationId
                                : (_a = params.msg.from) !== null && _a !== void 0
                                  ? _a
                                  : "unknown";
                            hasMedia = Boolean(
                              payload.mediaUrl ||
                              ((_b = payload.mediaUrls) === null || _b === void 0
                                ? void 0
                                : _b.length),
                            );
                            loggers_js_1.whatsappOutboundLog.info(
                              "Auto-replied to "
                                .concat(fromDisplay_1)
                                .concat(hasMedia ? " (media)" : ""),
                            );
                            if ((0, globals_js_1.shouldLogVerbose)()) {
                              preview =
                                payload.text != null
                                  ? (0, util_js_1.elide)(payload.text, 400)
                                  : "<media>";
                              loggers_js_1.whatsappOutboundLog.debug(
                                "Reply body: ".concat(preview).concat(hasMedia ? " (media)" : ""),
                              );
                            }
                          }
                          return [2 /*return*/];
                      }
                    });
                  });
                },
                onError: function (err, info) {
                  var _a;
                  var label =
                    info.kind === "tool"
                      ? "tool update"
                      : info.kind === "block"
                        ? "block update"
                        : "auto-reply";
                  loggers_js_1.whatsappOutboundLog.error(
                    "Failed sending web "
                      .concat(label, " to ")
                      .concat(
                        (_a = params.msg.from) !== null && _a !== void 0 ? _a : conversationId,
                        ": ",
                      )
                      .concat((0, session_js_1.formatError)(err)),
                  );
                },
                onReplyStart: params.msg.sendComposing,
              },
              replyOptions: {
                disableBlockStreaming:
                  typeof ((_s =
                    (_r = params.cfg.channels) === null || _r === void 0 ? void 0 : _r.whatsapp) ===
                    null || _s === void 0
                    ? void 0
                    : _s.blockStreaming) === "boolean"
                    ? !params.cfg.channels.whatsapp.blockStreaming
                    : undefined,
                onModelSelected: prefixContext.onModelSelected,
              },
            }),
          ];
        case 4:
          queuedFinal = _t.sent().queuedFinal;
          if (!queuedFinal) {
            if (shouldClearGroupHistory) {
              params.groupHistories.set(params.groupHistoryKey, []);
            }
            (0, globals_js_1.logVerbose)(
              "Skipping auto-reply: silent token or no text/media returned from resolver",
            );
            return [2 /*return*/, false];
          }
          if (shouldClearGroupHistory) {
            params.groupHistories.set(params.groupHistoryKey, []);
          }
          return [2 /*return*/, didSendReply];
      }
    });
  });
}
