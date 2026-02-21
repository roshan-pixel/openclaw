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
exports.monitorWebInbox = monitorWebInbox;
var baileys_1 = require("@whiskeysockets/baileys");
var location_js_1 = require("../../channels/location.js");
var globals_js_1 = require("../../globals.js");
var channel_activity_js_1 = require("../../infra/channel-activity.js");
var logger_js_1 = require("../../logging/logger.js");
var subsystem_js_1 = require("../../logging/subsystem.js");
var store_js_1 = require("../../media/store.js");
var inbound_debounce_js_1 = require("../../auto-reply/inbound-debounce.js");
var utils_js_1 = require("../../utils.js");
var session_js_1 = require("../session.js");
var access_control_js_1 = require("./access-control.js");
var dedupe_js_1 = require("./dedupe.js");
var extract_js_1 = require("./extract.js");
var media_js_1 = require("./media.js");
var send_api_js_1 = require("./send-api.js");
function monitorWebInbox(options) {
  return __awaiter(this, void 0, void 0, function () {
    var inboundLogger,
      inboundConsoleLog,
      sock,
      connectedAtMs,
      onCloseResolve,
      onClose,
      resolveClose,
      err_1,
      selfJid,
      selfE164,
      debouncer,
      groupMetaCache,
      GROUP_META_TTL_MS,
      lidLookup,
      resolveInboundJid,
      getGroupMeta,
      handleMessagesUpsert,
      handleConnectionUpdate,
      sendApi;
    var _this = this;
    var _a, _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          inboundLogger = (0, logger_js_1.getChildLogger)({ module: "web-inbound" });
          inboundConsoleLog = (0, subsystem_js_1.createSubsystemLogger)(
            "gateway/channels/whatsapp",
          ).child("inbound");
          return [
            4 /*yield*/,
            (0, session_js_1.createWaSocket)(false, options.verbose, {
              authDir: options.authDir,
            }),
          ];
        case 1:
          sock = _d.sent();
          return [4 /*yield*/, (0, session_js_1.waitForWaConnection)(sock)];
        case 2:
          _d.sent();
          connectedAtMs = Date.now();
          onCloseResolve = null;
          onClose = new Promise(function (resolve) {
            onCloseResolve = resolve;
          });
          resolveClose = function (reason) {
            if (!onCloseResolve) {
              return;
            }
            var resolver = onCloseResolve;
            onCloseResolve = null;
            resolver(reason);
          };
          _d.label = 3;
        case 3:
          _d.trys.push([3, 5, , 6]);
          return [4 /*yield*/, sock.sendPresenceUpdate("available")];
        case 4:
          _d.sent();
          if ((0, globals_js_1.shouldLogVerbose)()) {
            (0, globals_js_1.logVerbose)("Sent global 'available' presence on connect");
          }
          return [3 /*break*/, 6];
        case 5:
          err_1 = _d.sent();
          (0, globals_js_1.logVerbose)(
            "Failed to send 'available' presence on connect: ".concat(String(err_1)),
          );
          return [3 /*break*/, 6];
        case 6:
          selfJid = (_a = sock.user) === null || _a === void 0 ? void 0 : _a.id;
          selfE164 = selfJid ? (0, utils_js_1.jidToE164)(selfJid) : null;
          debouncer = (0, inbound_debounce_js_1.createInboundDebouncer)({
            debounceMs: (_b = options.debounceMs) !== null && _b !== void 0 ? _b : 0,
            buildKey: function (msg) {
              var _a, _b, _c;
              var senderKey =
                msg.chatType === "group"
                  ? (_c =
                      (_b =
                        (_a = msg.senderJid) !== null && _a !== void 0 ? _a : msg.senderE164) !==
                        null && _b !== void 0
                        ? _b
                        : msg.senderName) !== null && _c !== void 0
                    ? _c
                    : msg.from
                  : msg.from;
              if (!senderKey) {
                return null;
              }
              var conversationKey = msg.chatType === "group" ? msg.chatId : msg.from;
              return "".concat(msg.accountId, ":").concat(conversationKey, ":").concat(senderKey);
            },
            shouldDebounce: options.shouldDebounce,
            onFlush: function (entries) {
              return __awaiter(_this, void 0, void 0, function () {
                var last,
                  mentioned,
                  _i,
                  entries_1,
                  entry,
                  _a,
                  _b,
                  jid,
                  combinedBody,
                  combinedMessage;
                var _c;
                return __generator(this, function (_d) {
                  switch (_d.label) {
                    case 0:
                      last = entries.at(-1);
                      if (!last) {
                        return [2 /*return*/];
                      }
                      if (!(entries.length === 1)) {
                        return [3 /*break*/, 2];
                      }
                      return [4 /*yield*/, options.onMessage(last)];
                    case 1:
                      _d.sent();
                      return [2 /*return*/];
                    case 2:
                      mentioned = new Set();
                      for (_i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                        entry = entries_1[_i];
                        for (
                          _a = 0,
                            _b = (_c = entry.mentionedJids) !== null && _c !== void 0 ? _c : [];
                          _a < _b.length;
                          _a++
                        ) {
                          jid = _b[_a];
                          mentioned.add(jid);
                        }
                      }
                      combinedBody = entries
                        .map(function (entry) {
                          return entry.body;
                        })
                        .filter(Boolean)
                        .join("\n");
                      combinedMessage = __assign(__assign({}, last), {
                        body: combinedBody,
                        mentionedJids: mentioned.size > 0 ? Array.from(mentioned) : undefined,
                      });
                      return [4 /*yield*/, options.onMessage(combinedMessage)];
                    case 3:
                      _d.sent();
                      return [2 /*return*/];
                  }
                });
              });
            },
            onError: function (err) {
              inboundLogger.error({ error: String(err) }, "failed handling inbound web message");
              inboundConsoleLog.error("Failed handling inbound web message: ".concat(String(err)));
            },
          });
          groupMetaCache = new Map();
          GROUP_META_TTL_MS = 5 * 60 * 1000;
          lidLookup =
            (_c = sock.signalRepository) === null || _c === void 0 ? void 0 : _c.lidMapping;
          resolveInboundJid = function (jid) {
            return __awaiter(_this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                return [
                  2 /*return*/,
                  (0, utils_js_1.resolveJidToE164)(jid, {
                    authDir: options.authDir,
                    lidLookup: lidLookup,
                  }),
                ];
              });
            });
          };
          getGroupMeta = function (jid) {
            return __awaiter(_this, void 0, void 0, function () {
              var cached, meta, participants, entry, err_2;
              var _this = this;
              var _a, _b, _c;
              return __generator(this, function (_d) {
                switch (_d.label) {
                  case 0:
                    cached = groupMetaCache.get(jid);
                    if (cached && cached.expires > Date.now()) {
                      return [2 /*return*/, cached];
                    }
                    _d.label = 1;
                  case 1:
                    _d.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, sock.groupMetadata(jid)];
                  case 2:
                    meta = _d.sent();
                    return [
                      4 /*yield*/,
                      Promise.all(
                        (_b =
                          (_a = meta.participants) === null || _a === void 0
                            ? void 0
                            : _a.map(function (p) {
                                return __awaiter(_this, void 0, void 0, function () {
                                  var mapped;
                                  return __generator(this, function (_a) {
                                    switch (_a.label) {
                                      case 0:
                                        return [4 /*yield*/, resolveInboundJid(p.id)];
                                      case 1:
                                        mapped = _a.sent();
                                        return [
                                          2 /*return*/,
                                          mapped !== null && mapped !== void 0 ? mapped : p.id,
                                        ];
                                    }
                                  });
                                });
                              })) !== null && _b !== void 0
                          ? _b
                          : [],
                      ),
                    ];
                  case 3:
                    participants =
                      (_c = _d.sent().filter(Boolean)) !== null && _c !== void 0 ? _c : [];
                    entry = {
                      subject: meta.subject,
                      participants: participants,
                      expires: Date.now() + GROUP_META_TTL_MS,
                    };
                    groupMetaCache.set(jid, entry);
                    return [2 /*return*/, entry];
                  case 4:
                    err_2 = _d.sent();
                    (0, globals_js_1.logVerbose)(
                      "Failed to fetch group metadata for ".concat(jid, ": ").concat(String(err_2)),
                    );
                    return [2 /*return*/, { expires: Date.now() + GROUP_META_TTL_MS }];
                  case 5:
                    return [2 /*return*/];
                }
              });
            });
          };
          handleMessagesUpsert = function (upsert) {
            return __awaiter(_this, void 0, void 0, function () {
              var _loop_1, _i, _a, msg;
              var _this = this;
              var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
              return __generator(this, function (_q) {
                switch (_q.label) {
                  case 0:
                    if (upsert.type !== "notify" && upsert.type !== "append") {
                      return [2 /*return*/];
                    }
                    _loop_1 = function (msg) {
                      var id,
                        remoteJid,
                        group,
                        dedupeKey,
                        participantJid,
                        from,
                        _r,
                        senderE164,
                        _s,
                        _t,
                        groupSubject,
                        groupParticipants,
                        meta,
                        messageTimestampMs,
                        access,
                        participant,
                        suffix,
                        err_3,
                        location_1,
                        locationText,
                        body,
                        replyContext,
                        mediaPath,
                        mediaType,
                        inboundMedia,
                        maxMb,
                        maxBytes,
                        saved,
                        err_4,
                        chatJid,
                        sendComposing,
                        reply,
                        sendMedia,
                        timestamp,
                        mentionedJids,
                        senderName,
                        inboundMessage,
                        task;
                      return __generator(this, function (_u) {
                        switch (_u.label) {
                          case 0:
                            (0, channel_activity_js_1.recordChannelActivity)({
                              channel: "whatsapp",
                              accountId: options.accountId,
                              direction: "inbound",
                            });
                            id =
                              (_d = (_c = msg.key) === null || _c === void 0 ? void 0 : _c.id) !==
                                null && _d !== void 0
                                ? _d
                                : undefined;
                            remoteJid =
                              (_e = msg.key) === null || _e === void 0 ? void 0 : _e.remoteJid;
                            if (!remoteJid) {
                              return [2 /*return*/, "continue"];
                            }
                            if (remoteJid.endsWith("@status") || remoteJid.endsWith("@broadcast")) {
                              return [2 /*return*/, "continue"];
                            }
                            group = (0, baileys_1.isJidGroup)(remoteJid) === true;
                            if (id) {
                              dedupeKey = ""
                                .concat(options.accountId, ":")
                                .concat(remoteJid, ":")
                                .concat(id);
                              if ((0, dedupe_js_1.isRecentInboundMessage)(dedupeKey)) {
                                return [2 /*return*/, "continue"];
                              }
                            }
                            participantJid =
                              (_g =
                                (_f = msg.key) === null || _f === void 0
                                  ? void 0
                                  : _f.participant) !== null && _g !== void 0
                                ? _g
                                : undefined;
                            if (!group) {
                              return [3 /*break*/, 1];
                            }
                            _r = remoteJid;
                            return [3 /*break*/, 3];
                          case 1:
                            return [4 /*yield*/, resolveInboundJid(remoteJid)];
                          case 2:
                            _r = _u.sent();
                            _u.label = 3;
                          case 3:
                            from = _r;
                            if (!from) {
                              return [2 /*return*/, "continue"];
                            }
                            if (!group) {
                              return [3 /*break*/, 7];
                            }
                            if (!participantJid) {
                              return [3 /*break*/, 5];
                            }
                            return [4 /*yield*/, resolveInboundJid(participantJid)];
                          case 4:
                            _t = _u.sent();
                            return [3 /*break*/, 6];
                          case 5:
                            _t = null;
                            _u.label = 6;
                          case 6:
                            _s = _t;
                            return [3 /*break*/, 8];
                          case 7:
                            _s = from;
                            _u.label = 8;
                          case 8:
                            senderE164 = _s;
                            groupSubject = void 0;
                            groupParticipants = void 0;
                            if (!group) {
                              return [3 /*break*/, 10];
                            }
                            return [4 /*yield*/, getGroupMeta(remoteJid)];
                          case 9:
                            meta = _u.sent();
                            groupSubject = meta.subject;
                            groupParticipants = meta.participants;
                            _u.label = 10;
                          case 10:
                            messageTimestampMs = msg.messageTimestamp
                              ? Number(msg.messageTimestamp) * 1000
                              : undefined;
                            return [
                              4 /*yield*/,
                              (0, access_control_js_1.checkInboundAccessControl)({
                                accountId: options.accountId,
                                from: from,
                                selfE164: selfE164,
                                senderE164: senderE164,
                                group: group,
                                pushName:
                                  (_h = msg.pushName) !== null && _h !== void 0 ? _h : undefined,
                                isFromMe: Boolean(
                                  (_j = msg.key) === null || _j === void 0 ? void 0 : _j.fromMe,
                                ),
                                messageTimestampMs: messageTimestampMs,
                                connectedAtMs: connectedAtMs,
                                sock: {
                                  sendMessage: function (jid, content) {
                                    return sock.sendMessage(jid, content);
                                  },
                                },
                                remoteJid: remoteJid,
                              }),
                            ];
                          case 11:
                            access = _u.sent();
                            if (!access.allowed) {
                              return [2 /*return*/, "continue"];
                            }
                            if (!(id && !access.isSelfChat && options.sendReadReceipts !== false)) {
                              return [3 /*break*/, 16];
                            }
                            participant =
                              (_k = msg.key) === null || _k === void 0 ? void 0 : _k.participant;
                            _u.label = 12;
                          case 12:
                            _u.trys.push([12, 14, , 15]);
                            return [
                              4 /*yield*/,
                              sock.readMessages([
                                {
                                  remoteJid: remoteJid,
                                  id: id,
                                  participant: participant,
                                  fromMe: false,
                                },
                              ]),
                            ];
                          case 13:
                            _u.sent();
                            if ((0, globals_js_1.shouldLogVerbose)()) {
                              suffix = participant ? " (participant ".concat(participant, ")") : "";
                              (0, globals_js_1.logVerbose)(
                                "Marked message "
                                  .concat(id, " as read for ")
                                  .concat(remoteJid)
                                  .concat(suffix),
                              );
                            }
                            return [3 /*break*/, 15];
                          case 14:
                            err_3 = _u.sent();
                            (0, globals_js_1.logVerbose)(
                              "Failed to mark message ".concat(id, " read: ").concat(String(err_3)),
                            );
                            return [3 /*break*/, 15];
                          case 15:
                            return [3 /*break*/, 17];
                          case 16:
                            if (id && access.isSelfChat && (0, globals_js_1.shouldLogVerbose)()) {
                              // Self-chat mode: never auto-send read receipts (blue ticks) on behalf of the owner.
                              (0, globals_js_1.logVerbose)(
                                "Self-chat mode: skipping read receipt for ".concat(id),
                              );
                            }
                            _u.label = 17;
                          case 17:
                            // If this is history/offline catch-up, mark read above but skip auto-reply.
                            if (upsert.type === "append") {
                              return [2 /*return*/, "continue"];
                            }
                            location_1 = (0, extract_js_1.extractLocationData)(
                              (_l = msg.message) !== null && _l !== void 0 ? _l : undefined,
                            );
                            locationText = location_1
                              ? (0, location_js_1.formatLocationText)(location_1)
                              : undefined;
                            body = (0, extract_js_1.extractText)(
                              (_m = msg.message) !== null && _m !== void 0 ? _m : undefined,
                            );
                            if (locationText) {
                              body = [body, locationText].filter(Boolean).join("\n").trim();
                            }
                            if (!body) {
                              body = (0, extract_js_1.extractMediaPlaceholder)(
                                (_o = msg.message) !== null && _o !== void 0 ? _o : undefined,
                              );
                              if (!body) {
                                return [2 /*return*/, "continue"];
                              }
                            }
                            replyContext = (0, extract_js_1.describeReplyContext)(msg.message);
                            mediaPath = void 0;
                            mediaType = void 0;
                            _u.label = 18;
                          case 18:
                            _u.trys.push([18, 22, , 23]);
                            return [4 /*yield*/, (0, media_js_1.downloadInboundMedia)(msg, sock)];
                          case 19:
                            inboundMedia = _u.sent();
                            if (!inboundMedia) {
                              return [3 /*break*/, 21];
                            }
                            maxMb =
                              typeof options.mediaMaxMb === "number" && options.mediaMaxMb > 0
                                ? options.mediaMaxMb
                                : 50;
                            maxBytes = maxMb * 1024 * 1024;
                            return [
                              4 /*yield*/,
                              (0, store_js_1.saveMediaBuffer)(
                                inboundMedia.buffer,
                                inboundMedia.mimetype,
                                "inbound",
                                maxBytes,
                              ),
                            ];
                          case 20:
                            saved = _u.sent();
                            mediaPath = saved.path;
                            mediaType = inboundMedia.mimetype;
                            _u.label = 21;
                          case 21:
                            return [3 /*break*/, 23];
                          case 22:
                            err_4 = _u.sent();
                            (0, globals_js_1.logVerbose)(
                              "Inbound media download failed: ".concat(String(err_4)),
                            );
                            return [3 /*break*/, 23];
                          case 23:
                            chatJid = remoteJid;
                            sendComposing = function () {
                              return __awaiter(_this, void 0, void 0, function () {
                                var err_5;
                                return __generator(this, function (_a) {
                                  switch (_a.label) {
                                    case 0:
                                      _a.trys.push([0, 2, , 3]);
                                      return [
                                        4 /*yield*/,
                                        sock.sendPresenceUpdate("composing", chatJid),
                                      ];
                                    case 1:
                                      _a.sent();
                                      return [3 /*break*/, 3];
                                    case 2:
                                      err_5 = _a.sent();
                                      (0, globals_js_1.logVerbose)(
                                        "Presence update failed: ".concat(String(err_5)),
                                      );
                                      return [3 /*break*/, 3];
                                    case 3:
                                      return [2 /*return*/];
                                  }
                                });
                              });
                            };
                            reply = function (text) {
                              return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                  switch (_a.label) {
                                    case 0:
                                      return [
                                        4 /*yield*/,
                                        sock.sendMessage(chatJid, { text: text }),
                                      ];
                                    case 1:
                                      _a.sent();
                                      return [2 /*return*/];
                                  }
                                });
                              });
                            };
                            sendMedia = function (payload) {
                              return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                  switch (_a.label) {
                                    case 0:
                                      return [4 /*yield*/, sock.sendMessage(chatJid, payload)];
                                    case 1:
                                      _a.sent();
                                      return [2 /*return*/];
                                  }
                                });
                              });
                            };
                            timestamp = messageTimestampMs;
                            mentionedJids = (0, extract_js_1.extractMentionedJids)(msg.message);
                            senderName =
                              (_p = msg.pushName) !== null && _p !== void 0 ? _p : undefined;
                            inboundLogger.info(
                              {
                                from: from,
                                to: selfE164 !== null && selfE164 !== void 0 ? selfE164 : "me",
                                body: body,
                                mediaPath: mediaPath,
                                mediaType: mediaType,
                                timestamp: timestamp,
                              },
                              "inbound message",
                            );
                            inboundMessage = {
                              id: id,
                              from: from,
                              conversationId: from,
                              to: selfE164 !== null && selfE164 !== void 0 ? selfE164 : "me",
                              accountId: access.resolvedAccountId,
                              body: body,
                              pushName: senderName,
                              timestamp: timestamp,
                              chatType: group ? "group" : "direct",
                              chatId: remoteJid,
                              senderJid: participantJid,
                              senderE164:
                                senderE164 !== null && senderE164 !== void 0
                                  ? senderE164
                                  : undefined,
                              senderName: senderName,
                              replyToId:
                                replyContext === null || replyContext === void 0
                                  ? void 0
                                  : replyContext.id,
                              replyToBody:
                                replyContext === null || replyContext === void 0
                                  ? void 0
                                  : replyContext.body,
                              replyToSender:
                                replyContext === null || replyContext === void 0
                                  ? void 0
                                  : replyContext.sender,
                              replyToSenderJid:
                                replyContext === null || replyContext === void 0
                                  ? void 0
                                  : replyContext.senderJid,
                              replyToSenderE164:
                                replyContext === null || replyContext === void 0
                                  ? void 0
                                  : replyContext.senderE164,
                              groupSubject: groupSubject,
                              groupParticipants: groupParticipants,
                              mentionedJids:
                                mentionedJids !== null && mentionedJids !== void 0
                                  ? mentionedJids
                                  : undefined,
                              selfJid: selfJid,
                              selfE164: selfE164,
                              location:
                                location_1 !== null && location_1 !== void 0
                                  ? location_1
                                  : undefined,
                              sendComposing: sendComposing,
                              reply: reply,
                              sendMedia: sendMedia,
                              mediaPath: mediaPath,
                              mediaType: mediaType,
                            };
                            try {
                              task = Promise.resolve(debouncer.enqueue(inboundMessage));
                              void task.catch(function (err) {
                                inboundLogger.error(
                                  { error: String(err) },
                                  "failed handling inbound web message",
                                );
                                inboundConsoleLog.error(
                                  "Failed handling inbound web message: ".concat(String(err)),
                                );
                              });
                            } catch (err) {
                              inboundLogger.error(
                                { error: String(err) },
                                "failed handling inbound web message",
                              );
                              inboundConsoleLog.error(
                                "Failed handling inbound web message: ".concat(String(err)),
                              );
                            }
                            return [2 /*return*/];
                        }
                      });
                    };
                    ((_i = 0), (_a = (_b = upsert.messages) !== null && _b !== void 0 ? _b : []));
                    _q.label = 1;
                  case 1:
                    if (!(_i < _a.length)) {
                      return [3 /*break*/, 4];
                    }
                    msg = _a[_i];
                    return [5 /*yield**/, _loop_1(msg)];
                  case 2:
                    _q.sent();
                    _q.label = 3;
                  case 3:
                    _i++;
                    return [3 /*break*/, 1];
                  case 4:
                    return [2 /*return*/];
                }
              });
            });
          };
          sock.ev.on("messages.upsert", handleMessagesUpsert);
          handleConnectionUpdate = function (update) {
            var _a, _b;
            try {
              if (update.connection === "close") {
                var status_1 = (0, session_js_1.getStatusCode)(
                  (_a = update.lastDisconnect) === null || _a === void 0 ? void 0 : _a.error,
                );
                resolveClose({
                  status: status_1,
                  isLoggedOut: status_1 === baileys_1.DisconnectReason.loggedOut,
                  error: (_b = update.lastDisconnect) === null || _b === void 0 ? void 0 : _b.error,
                });
              }
            } catch (err) {
              inboundLogger.error({ error: String(err) }, "connection.update handler error");
              resolveClose({ status: undefined, isLoggedOut: false, error: err });
            }
          };
          sock.ev.on("connection.update", handleConnectionUpdate);
          sendApi = (0, send_api_js_1.createWebSendApi)({
            sock: {
              sendMessage: function (jid, content) {
                return sock.sendMessage(jid, content);
              },
              sendPresenceUpdate: function (presence, jid) {
                return sock.sendPresenceUpdate(presence, jid);
              },
            },
            defaultAccountId: options.accountId,
          });
          return [
            2 /*return*/,
            __assign(
              {
                close: function () {
                  return __awaiter(_this, void 0, void 0, function () {
                    var ev, messagesUpsertHandler, connectionUpdateHandler;
                    var _a;
                    return __generator(this, function (_b) {
                      try {
                        ev = sock.ev;
                        messagesUpsertHandler = handleMessagesUpsert;
                        connectionUpdateHandler = handleConnectionUpdate;
                        if (typeof ev.off === "function") {
                          ev.off("messages.upsert", messagesUpsertHandler);
                          ev.off("connection.update", connectionUpdateHandler);
                        } else if (typeof ev.removeListener === "function") {
                          ev.removeListener("messages.upsert", messagesUpsertHandler);
                          ev.removeListener("connection.update", connectionUpdateHandler);
                        }
                        (_a = sock.ws) === null || _a === void 0 ? void 0 : _a.close();
                      } catch (err) {
                        (0, globals_js_1.logVerbose)("Socket close failed: ".concat(String(err)));
                      }
                      return [2 /*return*/];
                    });
                  });
                },
                onClose: onClose,
                signalClose: function (reason) {
                  resolveClose(
                    reason !== null && reason !== void 0
                      ? reason
                      : { status: undefined, isLoggedOut: false, error: "closed" },
                  );
                },
              },
              sendApi,
            ),
          ];
      }
    });
  });
}
