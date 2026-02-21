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
exports.createSignalEventHandler = createSignalEventHandler;
var identity_js_1 = require("../../agents/identity.js");
var command_detection_js_1 = require("../../auto-reply/command-detection.js");
var envelope_js_1 = require("../../auto-reply/envelope.js");
var inbound_debounce_js_1 = require("../../auto-reply/inbound-debounce.js");
var dispatch_js_1 = require("../../auto-reply/dispatch.js");
var history_js_1 = require("../../auto-reply/reply/history.js");
var inbound_context_js_1 = require("../../auto-reply/reply/inbound-context.js");
var reply_dispatcher_js_1 = require("../../auto-reply/reply/reply-dispatcher.js");
var logging_js_1 = require("../../channels/logging.js");
var reply_prefix_js_1 = require("../../channels/reply-prefix.js");
var session_js_1 = require("../../channels/session.js");
var typing_js_1 = require("../../channels/typing.js");
var sessions_js_1 = require("../../config/sessions.js");
var globals_js_1 = require("../../globals.js");
var system_events_js_1 = require("../../infra/system-events.js");
var constants_js_1 = require("../../media/constants.js");
var pairing_messages_js_1 = require("../../pairing/pairing-messages.js");
var pairing_store_js_1 = require("../../pairing/pairing-store.js");
var resolve_route_js_1 = require("../../routing/resolve-route.js");
var utils_js_1 = require("../../utils.js");
var command_gating_js_1 = require("../../channels/command-gating.js");
var identity_js_2 = require("../identity.js");
var send_js_1 = require("../send.js");
function createSignalEventHandler(deps) {
  var _this = this;
  var inboundDebounceMs = (0, inbound_debounce_js_1.resolveInboundDebounceMs)({
    cfg: deps.cfg,
    channel: "signal",
  });
  function handleSignalInboundMessage(entry) {
    return __awaiter(this, void 0, void 0, function () {
      var fromLabel,
        route,
        storePath,
        envelopeOptions,
        previousTimestamp,
        body,
        combinedBody,
        historyKey,
        signalTo,
        ctxPayload,
        preview,
        prefixContext,
        typingCallbacks,
        _a,
        dispatcher,
        replyOptions,
        markDispatchIdle,
        queuedFinal;
      var _this = this;
      var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
      return __generator(this, function (_m) {
        switch (_m.label) {
          case 0:
            fromLabel = (0, envelope_js_1.formatInboundFromLabel)({
              isGroup: entry.isGroup,
              groupLabel: (_b = entry.groupName) !== null && _b !== void 0 ? _b : undefined,
              groupId: (_c = entry.groupId) !== null && _c !== void 0 ? _c : "unknown",
              groupFallback: "Group",
              directLabel: entry.senderName,
              directId: entry.senderDisplay,
            });
            route = (0, resolve_route_js_1.resolveAgentRoute)({
              cfg: deps.cfg,
              channel: "signal",
              accountId: deps.accountId,
              peer: {
                kind: entry.isGroup ? "group" : "dm",
                id: entry.isGroup
                  ? (_d = entry.groupId) !== null && _d !== void 0
                    ? _d
                    : "unknown"
                  : entry.senderPeerId,
              },
            });
            storePath = (0, sessions_js_1.resolveStorePath)(
              (_e = deps.cfg.session) === null || _e === void 0 ? void 0 : _e.store,
              {
                agentId: route.agentId,
              },
            );
            envelopeOptions = (0, envelope_js_1.resolveEnvelopeFormatOptions)(deps.cfg);
            previousTimestamp = (0, sessions_js_1.readSessionUpdatedAt)({
              storePath: storePath,
              sessionKey: route.sessionKey,
            });
            body = (0, envelope_js_1.formatInboundEnvelope)({
              channel: "Signal",
              from: fromLabel,
              timestamp: (_f = entry.timestamp) !== null && _f !== void 0 ? _f : undefined,
              body: entry.bodyText,
              chatType: entry.isGroup ? "group" : "direct",
              sender: { name: entry.senderName, id: entry.senderDisplay },
              previousTimestamp: previousTimestamp,
              envelope: envelopeOptions,
            });
            combinedBody = body;
            historyKey = entry.isGroup
              ? String((_g = entry.groupId) !== null && _g !== void 0 ? _g : "unknown")
              : undefined;
            if (entry.isGroup && historyKey) {
              combinedBody = (0, history_js_1.buildPendingHistoryContextFromMap)({
                historyMap: deps.groupHistories,
                historyKey: historyKey,
                limit: deps.historyLimit,
                currentMessage: combinedBody,
                formatEntry: function (historyEntry) {
                  return (0, envelope_js_1.formatInboundEnvelope)({
                    channel: "Signal",
                    from: fromLabel,
                    timestamp: historyEntry.timestamp,
                    body: ""
                      .concat(historyEntry.body)
                      .concat(
                        historyEntry.messageId ? " [id:".concat(historyEntry.messageId, "]") : "",
                      ),
                    chatType: "group",
                    senderLabel: historyEntry.sender,
                    envelope: envelopeOptions,
                  });
                },
              });
            }
            signalTo = entry.isGroup
              ? "group:".concat(entry.groupId)
              : "signal:".concat(entry.senderRecipient);
            ctxPayload = (0, inbound_context_js_1.finalizeInboundContext)({
              Body: combinedBody,
              RawBody: entry.bodyText,
              CommandBody: entry.bodyText,
              From: entry.isGroup
                ? "group:".concat((_h = entry.groupId) !== null && _h !== void 0 ? _h : "unknown")
                : "signal:".concat(entry.senderRecipient),
              To: signalTo,
              SessionKey: route.sessionKey,
              AccountId: route.accountId,
              ChatType: entry.isGroup ? "group" : "direct",
              ConversationLabel: fromLabel,
              GroupSubject: entry.isGroup
                ? (_j = entry.groupName) !== null && _j !== void 0
                  ? _j
                  : undefined
                : undefined,
              SenderName: entry.senderName,
              SenderId: entry.senderDisplay,
              Provider: "signal",
              Surface: "signal",
              MessageSid: entry.messageId,
              Timestamp: (_k = entry.timestamp) !== null && _k !== void 0 ? _k : undefined,
              MediaPath: entry.mediaPath,
              MediaType: entry.mediaType,
              MediaUrl: entry.mediaPath,
              CommandAuthorized: entry.commandAuthorized,
              OriginatingChannel: "signal",
              OriginatingTo: signalTo,
            });
            return [
              4 /*yield*/,
              (0, session_js_1.recordInboundSession)({
                storePath: storePath,
                sessionKey:
                  (_l = ctxPayload.SessionKey) !== null && _l !== void 0 ? _l : route.sessionKey,
                ctx: ctxPayload,
                updateLastRoute: !entry.isGroup
                  ? {
                      sessionKey: route.mainSessionKey,
                      channel: "signal",
                      to: entry.senderRecipient,
                      accountId: route.accountId,
                    }
                  : undefined,
                onRecordError: function (err) {
                  (0, globals_js_1.logVerbose)(
                    "signal: failed updating session meta: ".concat(String(err)),
                  );
                },
              }),
            ];
          case 1:
            _m.sent();
            if ((0, globals_js_1.shouldLogVerbose)()) {
              preview = body.slice(0, 200).replace(/\\n/g, "\\\\n");
              (0, globals_js_1.logVerbose)(
                "signal inbound: from="
                  .concat(ctxPayload.From, " len=")
                  .concat(body.length, ' preview="')
                  .concat(preview, '"'),
              );
            }
            prefixContext = (0, reply_prefix_js_1.createReplyPrefixContext)({
              cfg: deps.cfg,
              agentId: route.agentId,
            });
            typingCallbacks = (0, typing_js_1.createTypingCallbacks)({
              start: function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        if (!ctxPayload.To) {
                          return [2 /*return*/];
                        }
                        return [
                          4 /*yield*/,
                          (0, send_js_1.sendTypingSignal)(ctxPayload.To, {
                            baseUrl: deps.baseUrl,
                            account: deps.account,
                            accountId: deps.accountId,
                          }),
                        ];
                      case 1:
                        _a.sent();
                        return [2 /*return*/];
                    }
                  });
                });
              },
              onStartError: function (err) {
                var _a;
                (0, logging_js_1.logTypingFailure)({
                  log: globals_js_1.logVerbose,
                  channel: "signal",
                  target: (_a = ctxPayload.To) !== null && _a !== void 0 ? _a : undefined,
                  error: err,
                });
              },
            });
            ((_a = (0, reply_dispatcher_js_1.createReplyDispatcherWithTyping)({
              responsePrefix: prefixContext.responsePrefix,
              responsePrefixContextProvider: prefixContext.responsePrefixContextProvider,
              humanDelay: (0, identity_js_1.resolveHumanDelayConfig)(deps.cfg, route.agentId),
              deliver: function (payload) {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [
                          4 /*yield*/,
                          deps.deliverReplies({
                            replies: [payload],
                            target: ctxPayload.To,
                            baseUrl: deps.baseUrl,
                            account: deps.account,
                            accountId: deps.accountId,
                            runtime: deps.runtime,
                            maxBytes: deps.mediaMaxBytes,
                            textLimit: deps.textLimit,
                          }),
                        ];
                      case 1:
                        _a.sent();
                        return [2 /*return*/];
                    }
                  });
                });
              },
              onError: function (err, info) {
                var _a, _b;
                (_b = (_a = deps.runtime).error) === null || _b === void 0
                  ? void 0
                  : _b.call(
                      _a,
                      (0, globals_js_1.danger)(
                        "signal ".concat(info.kind, " reply failed: ").concat(String(err)),
                      ),
                    );
              },
              onReplyStart: typingCallbacks.onReplyStart,
            })),
              (dispatcher = _a.dispatcher),
              (replyOptions = _a.replyOptions),
              (markDispatchIdle = _a.markDispatchIdle));
            return [
              4 /*yield*/,
              (0, dispatch_js_1.dispatchInboundMessage)({
                ctx: ctxPayload,
                cfg: deps.cfg,
                dispatcher: dispatcher,
                replyOptions: __assign(__assign({}, replyOptions), {
                  disableBlockStreaming:
                    typeof deps.blockStreaming === "boolean" ? !deps.blockStreaming : undefined,
                  onModelSelected: function (ctx) {
                    prefixContext.onModelSelected(ctx);
                  },
                }),
              }),
            ];
          case 2:
            queuedFinal = _m.sent().queuedFinal;
            markDispatchIdle();
            if (!queuedFinal) {
              if (entry.isGroup && historyKey) {
                (0, history_js_1.clearHistoryEntriesIfEnabled)({
                  historyMap: deps.groupHistories,
                  historyKey: historyKey,
                  limit: deps.historyLimit,
                });
              }
              return [2 /*return*/];
            }
            if (entry.isGroup && historyKey) {
              (0, history_js_1.clearHistoryEntriesIfEnabled)({
                historyMap: deps.groupHistories,
                historyKey: historyKey,
                limit: deps.historyLimit,
              });
            }
            return [2 /*return*/];
        }
      });
    });
  }
  var inboundDebouncer = (0, inbound_debounce_js_1.createInboundDebouncer)({
    debounceMs: inboundDebounceMs,
    buildKey: function (entry) {
      var _a;
      var conversationId = entry.isGroup
        ? (_a = entry.groupId) !== null && _a !== void 0
          ? _a
          : "unknown"
        : entry.senderPeerId;
      if (!conversationId || !entry.senderPeerId) {
        return null;
      }
      return "signal:"
        .concat(deps.accountId, ":")
        .concat(conversationId, ":")
        .concat(entry.senderPeerId);
    },
    shouldDebounce: function (entry) {
      if (!entry.bodyText.trim()) {
        return false;
      }
      if (entry.mediaPath || entry.mediaType) {
        return false;
      }
      return !(0, command_detection_js_1.hasControlCommand)(entry.bodyText, deps.cfg);
    },
    onFlush: function (entries) {
      return __awaiter(_this, void 0, void 0, function () {
        var last, combinedText;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              last = entries.at(-1);
              if (!last) {
                return [2 /*return*/];
              }
              if (!(entries.length === 1)) {
                return [3 /*break*/, 2];
              }
              return [4 /*yield*/, handleSignalInboundMessage(last)];
            case 1:
              _a.sent();
              return [2 /*return*/];
            case 2:
              combinedText = entries
                .map(function (entry) {
                  return entry.bodyText;
                })
                .filter(Boolean)
                .join("\\n");
              if (!combinedText.trim()) {
                return [2 /*return*/];
              }
              return [
                4 /*yield*/,
                handleSignalInboundMessage(
                  __assign(__assign({}, last), {
                    bodyText: combinedText,
                    mediaPath: undefined,
                    mediaType: undefined,
                  }),
                ),
              ];
            case 3:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    },
    onError: function (err) {
      var _a, _b;
      (_b = (_a = deps.runtime).error) === null || _b === void 0
        ? void 0
        : _b.call(_a, "signal debounce flush failed: ".concat(String(err)));
    },
  });
  return function (event) {
    return __awaiter(_this, void 0, void 0, function () {
      var payload,
        envelope,
        sender,
        dataMessage,
        reaction,
        messageText,
        quoteText,
        hasBodyContent,
        emojiLabel,
        senderDisplay_1,
        senderName_1,
        targets,
        shouldNotify,
        groupId_1,
        groupName_1,
        isGroup_1,
        senderPeerId_1,
        route,
        groupLabel,
        messageId_1,
        text,
        senderId,
        contextKey,
        senderDisplay,
        senderRecipient,
        senderPeerId,
        senderAllowId,
        senderIdLine,
        groupId,
        groupName,
        isGroup,
        storeAllowFrom,
        effectiveDmAllow,
        effectiveGroupAllow,
        dmAllowed,
        senderId,
        _a,
        code,
        created,
        err_1,
        useAccessGroups,
        ownerAllowedForCommands,
        groupAllowedForCommands,
        hasControlCommandInMessage,
        commandGate,
        commandAuthorized,
        mediaPath,
        mediaType,
        placeholder,
        firstAttachment,
        fetched,
        err_2,
        kind,
        bodyText,
        receiptTimestamp,
        err_3,
        senderName,
        messageId;
      var _b,
        _c,
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
        _2,
        _3,
        _4,
        _5,
        _6,
        _7,
        _8,
        _9,
        _10,
        _11;
      return __generator(this, function (_12) {
        switch (_12.label) {
          case 0:
            if (event.event !== "receive" || !event.data) {
              return [2 /*return*/];
            }
            payload = null;
            try {
              payload = JSON.parse(event.data);
            } catch (err) {
              (_c = (_b = deps.runtime).error) === null || _c === void 0
                ? void 0
                : _c.call(_b, "failed to parse event: ".concat(String(err)));
              return [2 /*return*/];
            }
            if (
              (_d = payload === null || payload === void 0 ? void 0 : payload.exception) === null ||
              _d === void 0
                ? void 0
                : _d.message
            ) {
              (_f = (_e = deps.runtime).error) === null || _f === void 0
                ? void 0
                : _f.call(_e, "receive exception: ".concat(payload.exception.message));
            }
            envelope = payload === null || payload === void 0 ? void 0 : payload.envelope;
            if (!envelope) {
              return [2 /*return*/];
            }
            if (envelope.syncMessage) {
              return [2 /*return*/];
            }
            sender = (0, identity_js_2.resolveSignalSender)(envelope);
            if (!sender) {
              return [2 /*return*/];
            }
            if (deps.account && sender.kind === "phone") {
              if (sender.e164 === (0, utils_js_1.normalizeE164)(deps.account)) {
                return [2 /*return*/];
              }
            }
            dataMessage =
              (_g = envelope.dataMessage) !== null && _g !== void 0
                ? _g
                : (_h = envelope.editMessage) === null || _h === void 0
                  ? void 0
                  : _h.dataMessage;
            reaction = deps.isSignalReactionMessage(envelope.reactionMessage)
              ? envelope.reactionMessage
              : deps.isSignalReactionMessage(
                    dataMessage === null || dataMessage === void 0 ? void 0 : dataMessage.reaction,
                  )
                ? dataMessage === null || dataMessage === void 0
                  ? void 0
                  : dataMessage.reaction
                : null;
            messageText = (
              (_j =
                dataMessage === null || dataMessage === void 0 ? void 0 : dataMessage.message) !==
                null && _j !== void 0
                ? _j
                : ""
            ).trim();
            quoteText =
              (_m =
                (_l =
                  (_k =
                    dataMessage === null || dataMessage === void 0 ? void 0 : dataMessage.quote) ===
                    null || _k === void 0
                    ? void 0
                    : _k.text) === null || _l === void 0
                  ? void 0
                  : _l.trim()) !== null && _m !== void 0
                ? _m
                : "";
            hasBodyContent =
              Boolean(messageText || quoteText) ||
              Boolean(
                !reaction &&
                ((_o =
                  dataMessage === null || dataMessage === void 0
                    ? void 0
                    : dataMessage.attachments) === null || _o === void 0
                  ? void 0
                  : _o.length),
              );
            if (reaction && !hasBodyContent) {
              if (reaction.isRemove) {
                return [2 /*return*/];
              } // Ignore reaction removals
              emojiLabel =
                ((_p = reaction.emoji) === null || _p === void 0 ? void 0 : _p.trim()) || "emoji";
              senderDisplay_1 = (0, identity_js_2.formatSignalSenderDisplay)(sender);
              senderName_1 =
                (_q = envelope.sourceName) !== null && _q !== void 0 ? _q : senderDisplay_1;
              (0, globals_js_1.logVerbose)(
                "signal reaction: ".concat(emojiLabel, " from ").concat(senderName_1),
              );
              targets = deps.resolveSignalReactionTargets(reaction);
              shouldNotify = deps.shouldEmitSignalReactionNotification({
                mode: deps.reactionMode,
                account: deps.account,
                targets: targets,
                sender: sender,
                allowlist: deps.reactionAllowlist,
              });
              if (!shouldNotify) {
                return [2 /*return*/];
              }
              groupId_1 =
                (_s = (_r = reaction.groupInfo) === null || _r === void 0 ? void 0 : _r.groupId) !==
                  null && _s !== void 0
                  ? _s
                  : undefined;
              groupName_1 =
                (_u =
                  (_t = reaction.groupInfo) === null || _t === void 0 ? void 0 : _t.groupName) !==
                  null && _u !== void 0
                  ? _u
                  : undefined;
              isGroup_1 = Boolean(groupId_1);
              senderPeerId_1 = (0, identity_js_2.resolveSignalPeerId)(sender);
              route = (0, resolve_route_js_1.resolveAgentRoute)({
                cfg: deps.cfg,
                channel: "signal",
                accountId: deps.accountId,
                peer: {
                  kind: isGroup_1 ? "group" : "dm",
                  id: isGroup_1
                    ? groupId_1 !== null && groupId_1 !== void 0
                      ? groupId_1
                      : "unknown"
                    : senderPeerId_1,
                },
              });
              groupLabel = isGroup_1
                ? ""
                    .concat(
                      groupName_1 !== null && groupName_1 !== void 0 ? groupName_1 : "Signal Group",
                      " id:",
                    )
                    .concat(groupId_1)
                : undefined;
              messageId_1 = reaction.targetSentTimestamp
                ? String(reaction.targetSentTimestamp)
                : "unknown";
              text = deps.buildSignalReactionSystemEventText({
                emojiLabel: emojiLabel,
                actorLabel: senderName_1,
                messageId: messageId_1,
                targetLabel: (_v = targets[0]) === null || _v === void 0 ? void 0 : _v.display,
                groupLabel: groupLabel,
              });
              senderId = (0, identity_js_2.formatSignalSenderId)(sender);
              contextKey = [
                "signal",
                "reaction",
                "added",
                messageId_1,
                senderId,
                emojiLabel,
                groupId_1 !== null && groupId_1 !== void 0 ? groupId_1 : "",
              ]
                .filter(Boolean)
                .join(":");
              (0, system_events_js_1.enqueueSystemEvent)(text, {
                sessionKey: route.sessionKey,
                contextKey: contextKey,
              });
              return [2 /*return*/];
            }
            if (!dataMessage) {
              return [2 /*return*/];
            }
            senderDisplay = (0, identity_js_2.formatSignalSenderDisplay)(sender);
            senderRecipient = (0, identity_js_2.resolveSignalRecipient)(sender);
            senderPeerId = (0, identity_js_2.resolveSignalPeerId)(sender);
            senderAllowId = (0, identity_js_2.formatSignalSenderId)(sender);
            if (!senderRecipient) {
              return [2 /*return*/];
            }
            senderIdLine = (0, identity_js_2.formatSignalPairingIdLine)(sender);
            groupId =
              (_x =
                (_w = dataMessage.groupInfo) === null || _w === void 0 ? void 0 : _w.groupId) !==
                null && _x !== void 0
                ? _x
                : undefined;
            groupName =
              (_z =
                (_y = dataMessage.groupInfo) === null || _y === void 0 ? void 0 : _y.groupName) !==
                null && _z !== void 0
                ? _z
                : undefined;
            isGroup = Boolean(groupId);
            return [
              4 /*yield*/,
              (0, pairing_store_js_1.readChannelAllowFromStore)("signal").catch(function () {
                return [];
              }),
            ];
          case 1:
            storeAllowFrom = _12.sent();
            effectiveDmAllow = __spreadArray(
              __spreadArray([], deps.allowFrom, true),
              storeAllowFrom,
              true,
            );
            effectiveGroupAllow = __spreadArray(
              __spreadArray([], deps.groupAllowFrom, true),
              storeAllowFrom,
              true,
            );
            dmAllowed =
              deps.dmPolicy === "open"
                ? true
                : (0, identity_js_2.isSignalSenderAllowed)(sender, effectiveDmAllow);
            if (!!isGroup) {
              return [3 /*break*/, 9];
            }
            if (deps.dmPolicy === "disabled") {
              return [2 /*return*/];
            }
            if (!!dmAllowed) {
              return [3 /*break*/, 9];
            }
            if (!(deps.dmPolicy === "pairing")) {
              return [3 /*break*/, 7];
            }
            senderId = senderAllowId;
            return [
              4 /*yield*/,
              (0, pairing_store_js_1.upsertChannelPairingRequest)({
                channel: "signal",
                id: senderId,
                meta: {
                  name: (_0 = envelope.sourceName) !== null && _0 !== void 0 ? _0 : undefined,
                },
              }),
            ];
          case 2:
            ((_a = _12.sent()), (code = _a.code), (created = _a.created));
            if (!created) {
              return [3 /*break*/, 6];
            }
            (0, globals_js_1.logVerbose)("signal pairing request sender=".concat(senderId));
            _12.label = 3;
          case 3:
            _12.trys.push([3, 5, , 6]);
            return [
              4 /*yield*/,
              (0, send_js_1.sendMessageSignal)(
                "signal:".concat(senderRecipient),
                (0, pairing_messages_js_1.buildPairingReply)({
                  channel: "signal",
                  idLine: senderIdLine,
                  code: code,
                }),
                {
                  baseUrl: deps.baseUrl,
                  account: deps.account,
                  maxBytes: deps.mediaMaxBytes,
                  accountId: deps.accountId,
                },
              ),
            ];
          case 4:
            _12.sent();
            return [3 /*break*/, 6];
          case 5:
            err_1 = _12.sent();
            (0, globals_js_1.logVerbose)(
              "signal pairing reply failed for ".concat(senderId, ": ").concat(String(err_1)),
            );
            return [3 /*break*/, 6];
          case 6:
            return [3 /*break*/, 8];
          case 7:
            (0, globals_js_1.logVerbose)(
              "Blocked signal sender "
                .concat(senderDisplay, " (dmPolicy=")
                .concat(deps.dmPolicy, ")"),
            );
            _12.label = 8;
          case 8:
            return [2 /*return*/];
          case 9:
            if (isGroup && deps.groupPolicy === "disabled") {
              (0, globals_js_1.logVerbose)("Blocked signal group message (groupPolicy: disabled)");
              return [2 /*return*/];
            }
            if (isGroup && deps.groupPolicy === "allowlist") {
              if (effectiveGroupAllow.length === 0) {
                (0, globals_js_1.logVerbose)(
                  "Blocked signal group message (groupPolicy: allowlist, no groupAllowFrom)",
                );
                return [2 /*return*/];
              }
              if (!(0, identity_js_2.isSignalSenderAllowed)(sender, effectiveGroupAllow)) {
                (0, globals_js_1.logVerbose)(
                  "Blocked signal group sender ".concat(senderDisplay, " (not in groupAllowFrom)"),
                );
                return [2 /*return*/];
              }
            }
            useAccessGroups =
              ((_1 = deps.cfg.commands) === null || _1 === void 0 ? void 0 : _1.useAccessGroups) !==
              false;
            ownerAllowedForCommands = (0, identity_js_2.isSignalSenderAllowed)(
              sender,
              effectiveDmAllow,
            );
            groupAllowedForCommands = (0, identity_js_2.isSignalSenderAllowed)(
              sender,
              effectiveGroupAllow,
            );
            hasControlCommandInMessage = (0, command_detection_js_1.hasControlCommand)(
              messageText,
              deps.cfg,
            );
            commandGate = (0, command_gating_js_1.resolveControlCommandGate)({
              useAccessGroups: useAccessGroups,
              authorizers: [
                { configured: effectiveDmAllow.length > 0, allowed: ownerAllowedForCommands },
                { configured: effectiveGroupAllow.length > 0, allowed: groupAllowedForCommands },
              ],
              allowTextCommands: true,
              hasControlCommand: hasControlCommandInMessage,
            });
            commandAuthorized = isGroup ? commandGate.commandAuthorized : dmAllowed;
            if (isGroup && commandGate.shouldBlock) {
              (0, logging_js_1.logInboundDrop)({
                log: globals_js_1.logVerbose,
                channel: "signal",
                reason: "control command (unauthorized)",
                target: senderDisplay,
              });
              return [2 /*return*/];
            }
            placeholder = "";
            firstAttachment =
              (_2 = dataMessage.attachments) === null || _2 === void 0 ? void 0 : _2[0];
            if (
              !(
                (firstAttachment === null || firstAttachment === void 0
                  ? void 0
                  : firstAttachment.id) && !deps.ignoreAttachments
              )
            ) {
              return [3 /*break*/, 13];
            }
            _12.label = 10;
          case 10:
            _12.trys.push([10, 12, , 13]);
            return [
              4 /*yield*/,
              deps.fetchAttachment({
                baseUrl: deps.baseUrl,
                account: deps.account,
                attachment: firstAttachment,
                sender: senderRecipient,
                groupId: groupId,
                maxBytes: deps.mediaMaxBytes,
              }),
            ];
          case 11:
            fetched = _12.sent();
            if (fetched) {
              mediaPath = fetched.path;
              mediaType =
                (_4 =
                  (_3 = fetched.contentType) !== null && _3 !== void 0
                    ? _3
                    : firstAttachment.contentType) !== null && _4 !== void 0
                  ? _4
                  : undefined;
            }
            return [3 /*break*/, 13];
          case 12:
            err_2 = _12.sent();
            (_6 = (_5 = deps.runtime).error) === null || _6 === void 0
              ? void 0
              : _6.call(
                  _5,
                  (0, globals_js_1.danger)("attachment fetch failed: ".concat(String(err_2))),
                );
            return [3 /*break*/, 13];
          case 13:
            kind = (0, constants_js_1.mediaKindFromMime)(
              mediaType !== null && mediaType !== void 0 ? mediaType : undefined,
            );
            if (kind) {
              placeholder = "<media:".concat(kind, ">");
            } else if (
              (_7 = dataMessage.attachments) === null || _7 === void 0 ? void 0 : _7.length
            ) {
              placeholder = "<media:attachment>";
            }
            bodyText =
              messageText ||
              placeholder ||
              ((_9 = (_8 = dataMessage.quote) === null || _8 === void 0 ? void 0 : _8.text) ===
                null || _9 === void 0
                ? void 0
                : _9.trim()) ||
              "";
            if (!bodyText) {
              return [2 /*return*/];
            }
            receiptTimestamp =
              typeof envelope.timestamp === "number"
                ? envelope.timestamp
                : typeof dataMessage.timestamp === "number"
                  ? dataMessage.timestamp
                  : undefined;
            if (
              !(
                deps.sendReadReceipts &&
                !deps.readReceiptsViaDaemon &&
                !isGroup &&
                receiptTimestamp
              )
            ) {
              return [3 /*break*/, 18];
            }
            _12.label = 14;
          case 14:
            _12.trys.push([14, 16, , 17]);
            return [
              4 /*yield*/,
              (0, send_js_1.sendReadReceiptSignal)(
                "signal:".concat(senderRecipient),
                receiptTimestamp,
                {
                  baseUrl: deps.baseUrl,
                  account: deps.account,
                  accountId: deps.accountId,
                },
              ),
            ];
          case 15:
            _12.sent();
            return [3 /*break*/, 17];
          case 16:
            err_3 = _12.sent();
            (0, globals_js_1.logVerbose)(
              "signal read receipt failed for ".concat(senderDisplay, ": ").concat(String(err_3)),
            );
            return [3 /*break*/, 17];
          case 17:
            return [3 /*break*/, 19];
          case 18:
            if (
              deps.sendReadReceipts &&
              !deps.readReceiptsViaDaemon &&
              !isGroup &&
              !receiptTimestamp
            ) {
              (0, globals_js_1.logVerbose)(
                "signal read receipt skipped (missing timestamp) for ".concat(senderDisplay),
              );
            }
            _12.label = 19;
          case 19:
            senderName =
              (_10 = envelope.sourceName) !== null && _10 !== void 0 ? _10 : senderDisplay;
            messageId =
              typeof envelope.timestamp === "number" ? String(envelope.timestamp) : undefined;
            return [
              4 /*yield*/,
              inboundDebouncer.enqueue({
                senderName: senderName,
                senderDisplay: senderDisplay,
                senderRecipient: senderRecipient,
                senderPeerId: senderPeerId,
                groupId: groupId,
                groupName: groupName,
                isGroup: isGroup,
                bodyText: bodyText,
                timestamp: (_11 = envelope.timestamp) !== null && _11 !== void 0 ? _11 : undefined,
                messageId: messageId,
                mediaPath: mediaPath,
                mediaType: mediaType,
                commandAuthorized: commandAuthorized,
              }),
            ];
          case 20:
            _12.sent();
            return [2 /*return*/];
        }
      });
    });
  };
}
