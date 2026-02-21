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
exports.handleLineWebhookEvents = handleLineWebhookEvents;
var globals_js_1 = require("../globals.js");
var pairing_labels_js_1 = require("../pairing/pairing-labels.js");
var pairing_messages_js_1 = require("../pairing/pairing-messages.js");
var pairing_store_js_1 = require("../pairing/pairing-store.js");
var bot_message_context_js_1 = require("./bot-message-context.js");
var bot_access_js_1 = require("./bot-access.js");
var download_js_1 = require("./download.js");
var send_js_1 = require("./send.js");
function getSourceInfo(source) {
  var userId =
    source.type === "user"
      ? source.userId
      : source.type === "group"
        ? source.userId
        : source.type === "room"
          ? source.userId
          : undefined;
  var groupId = source.type === "group" ? source.groupId : undefined;
  var roomId = source.type === "room" ? source.roomId : undefined;
  var isGroup = source.type === "group" || source.type === "room";
  return { userId: userId, groupId: groupId, roomId: roomId, isGroup: isGroup };
}
function resolveLineGroupConfig(params) {
  var _a, _b, _c, _d, _e;
  var groups = (_a = params.config.groups) !== null && _a !== void 0 ? _a : {};
  if (params.groupId) {
    return (_c =
      (_b = groups[params.groupId]) !== null && _b !== void 0
        ? _b
        : groups["group:".concat(params.groupId)]) !== null && _c !== void 0
      ? _c
      : groups["*"];
  }
  if (params.roomId) {
    return (_e =
      (_d = groups[params.roomId]) !== null && _d !== void 0
        ? _d
        : groups["room:".concat(params.roomId)]) !== null && _e !== void 0
      ? _e
      : groups["*"];
  }
  return groups["*"];
}
function sendLinePairingReply(params) {
  return __awaiter(this, void 0, void 0, function () {
    var senderId, replyToken, context, _a, code, created, idLabel, text, err_1, err_2;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ((senderId = params.senderId),
            (replyToken = params.replyToken),
            (context = params.context));
          return [
            4 /*yield*/,
            (0, pairing_store_js_1.upsertChannelPairingRequest)({
              channel: "line",
              id: senderId,
            }),
          ];
        case 1:
          ((_a = _b.sent()), (code = _a.code), (created = _a.created));
          if (!created) {
            return [2 /*return*/];
          }
          (0, globals_js_1.logVerbose)("line pairing request sender=".concat(senderId));
          idLabel = (function () {
            try {
              return (0, pairing_labels_js_1.resolvePairingIdLabel)("line");
            } catch (_a) {
              return "lineUserId";
            }
          })();
          text = (0, pairing_messages_js_1.buildPairingReply)({
            channel: "line",
            idLine: "Your ".concat(idLabel, ": ").concat(senderId),
            code: code,
          });
          _b.label = 2;
        case 2:
          _b.trys.push([2, 5, , 6]);
          if (!replyToken) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.replyMessageLine)(replyToken, [{ type: "text", text: text }], {
              accountId: context.account.accountId,
              channelAccessToken: context.account.channelAccessToken,
            }),
          ];
        case 3:
          _b.sent();
          return [2 /*return*/];
        case 4:
          return [3 /*break*/, 6];
        case 5:
          err_1 = _b.sent();
          (0, globals_js_1.logVerbose)(
            "line pairing reply failed for ".concat(senderId, ": ").concat(String(err_1)),
          );
          return [3 /*break*/, 6];
        case 6:
          _b.trys.push([6, 8, , 9]);
          return [
            4 /*yield*/,
            (0, send_js_1.pushMessageLine)("line:".concat(senderId), text, {
              accountId: context.account.accountId,
              channelAccessToken: context.account.channelAccessToken,
            }),
          ];
        case 7:
          _b.sent();
          return [3 /*break*/, 9];
        case 8:
          err_2 = _b.sent();
          (0, globals_js_1.logVerbose)(
            "line pairing reply failed for ".concat(senderId, ": ").concat(String(err_2)),
          );
          return [3 /*break*/, 9];
        case 9:
          return [2 /*return*/];
      }
    });
  });
}
function shouldProcessLineEvent(event, context) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      account,
      _a,
      userId,
      groupId,
      roomId,
      isGroup,
      senderId,
      storeAllowFrom,
      effectiveDmAllow,
      groupConfig,
      groupAllowOverride,
      fallbackGroupAllowFrom,
      groupAllowFrom,
      effectiveGroupAllow,
      dmPolicy,
      defaultGroupPolicy,
      groupPolicy,
      dmAllowed;
    var _b, _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
      switch (_j.label) {
        case 0:
          ((cfg = context.cfg), (account = context.account));
          ((_a = getSourceInfo(event.source)),
            (userId = _a.userId),
            (groupId = _a.groupId),
            (roomId = _a.roomId),
            (isGroup = _a.isGroup));
          senderId = userId !== null && userId !== void 0 ? userId : "";
          return [
            4 /*yield*/,
            (0, pairing_store_js_1.readChannelAllowFromStore)("line").catch(function () {
              return [];
            }),
          ];
        case 1:
          storeAllowFrom = _j.sent();
          effectiveDmAllow = (0, bot_access_js_1.normalizeAllowFromWithStore)({
            allowFrom: account.config.allowFrom,
            storeAllowFrom: storeAllowFrom,
          });
          groupConfig = resolveLineGroupConfig({
            config: account.config,
            groupId: groupId,
            roomId: roomId,
          });
          groupAllowOverride =
            groupConfig === null || groupConfig === void 0 ? void 0 : groupConfig.allowFrom;
          fallbackGroupAllowFrom = (
            (_b = account.config.allowFrom) === null || _b === void 0 ? void 0 : _b.length
          )
            ? account.config.allowFrom
            : undefined;
          groupAllowFrom = (0, bot_access_js_1.firstDefined)(
            groupAllowOverride,
            account.config.groupAllowFrom,
            fallbackGroupAllowFrom,
          );
          effectiveGroupAllow = (0, bot_access_js_1.normalizeAllowFromWithStore)({
            allowFrom: groupAllowFrom,
            storeAllowFrom: storeAllowFrom,
          });
          dmPolicy = (_c = account.config.dmPolicy) !== null && _c !== void 0 ? _c : "pairing";
          defaultGroupPolicy =
            (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.defaults) === null ||
            _e === void 0
              ? void 0
              : _e.groupPolicy;
          groupPolicy =
            (_g =
              (_f = account.config.groupPolicy) !== null && _f !== void 0
                ? _f
                : defaultGroupPolicy) !== null && _g !== void 0
              ? _g
              : "allowlist";
          if (isGroup) {
            if (
              (groupConfig === null || groupConfig === void 0 ? void 0 : groupConfig.enabled) ===
              false
            ) {
              (0, globals_js_1.logVerbose)(
                "Blocked line group ".concat(
                  (_h = groupId !== null && groupId !== void 0 ? groupId : roomId) !== null &&
                    _h !== void 0
                    ? _h
                    : "unknown",
                  " (group disabled)",
                ),
              );
              return [2 /*return*/, false];
            }
            if (typeof groupAllowOverride !== "undefined") {
              if (!senderId) {
                (0, globals_js_1.logVerbose)(
                  "Blocked line group message (group allowFrom override, no sender ID)",
                );
                return [2 /*return*/, false];
              }
              if (
                !(0, bot_access_js_1.isSenderAllowed)({
                  allow: effectiveGroupAllow,
                  senderId: senderId,
                })
              ) {
                (0, globals_js_1.logVerbose)(
                  "Blocked line group sender ".concat(senderId, " (group allowFrom override)"),
                );
                return [2 /*return*/, false];
              }
            }
            if (groupPolicy === "disabled") {
              (0, globals_js_1.logVerbose)("Blocked line group message (groupPolicy: disabled)");
              return [2 /*return*/, false];
            }
            if (groupPolicy === "allowlist") {
              if (!senderId) {
                (0, globals_js_1.logVerbose)(
                  "Blocked line group message (no sender ID, groupPolicy: allowlist)",
                );
                return [2 /*return*/, false];
              }
              if (!effectiveGroupAllow.hasEntries) {
                (0, globals_js_1.logVerbose)(
                  "Blocked line group message (groupPolicy: allowlist, no groupAllowFrom)",
                );
                return [2 /*return*/, false];
              }
              if (
                !(0, bot_access_js_1.isSenderAllowed)({
                  allow: effectiveGroupAllow,
                  senderId: senderId,
                })
              ) {
                (0, globals_js_1.logVerbose)(
                  "Blocked line group message from ".concat(senderId, " (groupPolicy: allowlist)"),
                );
                return [2 /*return*/, false];
              }
            }
            return [2 /*return*/, true];
          }
          if (dmPolicy === "disabled") {
            (0, globals_js_1.logVerbose)("Blocked line sender (dmPolicy: disabled)");
            return [2 /*return*/, false];
          }
          dmAllowed =
            dmPolicy === "open" ||
            (0, bot_access_js_1.isSenderAllowed)({ allow: effectiveDmAllow, senderId: senderId });
          if (!!dmAllowed) {
            return [3 /*break*/, 5];
          }
          if (!(dmPolicy === "pairing")) {
            return [3 /*break*/, 3];
          }
          if (!senderId) {
            (0, globals_js_1.logVerbose)("Blocked line sender (dmPolicy: pairing, no sender ID)");
            return [2 /*return*/, false];
          }
          return [
            4 /*yield*/,
            sendLinePairingReply({
              senderId: senderId,
              replyToken: "replyToken" in event ? event.replyToken : undefined,
              context: context,
            }),
          ];
        case 2:
          _j.sent();
          return [3 /*break*/, 4];
        case 3:
          (0, globals_js_1.logVerbose)(
            "Blocked line sender "
              .concat(senderId || "unknown", " (dmPolicy: ")
              .concat(dmPolicy, ")"),
          );
          _j.label = 4;
        case 4:
          return [2 /*return*/, false];
        case 5:
          return [2 /*return*/, true];
      }
    });
  });
}
function handleMessageEvent(event, context) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      account,
      runtime,
      mediaMaxBytes,
      processMessage,
      message,
      allMedia,
      media,
      err_3,
      errMsg,
      messageContext;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ((cfg = context.cfg),
            (account = context.account),
            (runtime = context.runtime),
            (mediaMaxBytes = context.mediaMaxBytes),
            (processMessage = context.processMessage));
          message = event.message;
          return [4 /*yield*/, shouldProcessLineEvent(event, context)];
        case 1:
          if (!_b.sent()) {
            return [2 /*return*/];
          }
          allMedia = [];
          if (!(message.type === "image" || message.type === "video" || message.type === "audio")) {
            return [3 /*break*/, 5];
          }
          _b.label = 2;
        case 2:
          _b.trys.push([2, 4, , 5]);
          return [
            4 /*yield*/,
            (0, download_js_1.downloadLineMedia)(
              message.id,
              account.channelAccessToken,
              mediaMaxBytes,
            ),
          ];
        case 3:
          media = _b.sent();
          allMedia.push({
            path: media.path,
            contentType: media.contentType,
          });
          return [3 /*break*/, 5];
        case 4:
          err_3 = _b.sent();
          errMsg = String(err_3);
          if (errMsg.includes("exceeds") && errMsg.includes("limit")) {
            (0, globals_js_1.logVerbose)(
              "line: media exceeds size limit for message ".concat(message.id),
            );
            // Continue without media
          } else {
            (_a = runtime.error) === null || _a === void 0
              ? void 0
              : _a.call(
                  runtime,
                  (0, globals_js_1.danger)("line: failed to download media: ".concat(errMsg)),
                );
          }
          return [3 /*break*/, 5];
        case 5:
          return [
            4 /*yield*/,
            (0, bot_message_context_js_1.buildLineMessageContext)({
              event: event,
              allMedia: allMedia,
              cfg: cfg,
              account: account,
            }),
          ];
        case 6:
          messageContext = _b.sent();
          if (!messageContext) {
            (0, globals_js_1.logVerbose)("line: skipping empty message");
            return [2 /*return*/];
          }
          return [4 /*yield*/, processMessage(messageContext)];
        case 7:
          _b.sent();
          return [2 /*return*/];
      }
    });
  });
}
function handleFollowEvent(event, _context) {
  return __awaiter(this, void 0, void 0, function () {
    var userId;
    return __generator(this, function (_a) {
      userId = event.source.type === "user" ? event.source.userId : undefined;
      (0, globals_js_1.logVerbose)(
        "line: user ".concat(
          userId !== null && userId !== void 0 ? userId : "unknown",
          " followed",
        ),
      );
      return [2 /*return*/];
    });
  });
}
function handleUnfollowEvent(event, _context) {
  return __awaiter(this, void 0, void 0, function () {
    var userId;
    return __generator(this, function (_a) {
      userId = event.source.type === "user" ? event.source.userId : undefined;
      (0, globals_js_1.logVerbose)(
        "line: user ".concat(
          userId !== null && userId !== void 0 ? userId : "unknown",
          " unfollowed",
        ),
      );
      return [2 /*return*/];
    });
  });
}
function handleJoinEvent(event, _context) {
  return __awaiter(this, void 0, void 0, function () {
    var groupId, roomId;
    return __generator(this, function (_a) {
      groupId = event.source.type === "group" ? event.source.groupId : undefined;
      roomId = event.source.type === "room" ? event.source.roomId : undefined;
      (0, globals_js_1.logVerbose)(
        "line: bot joined ".concat(groupId ? "group ".concat(groupId) : "room ".concat(roomId)),
      );
      return [2 /*return*/];
    });
  });
}
function handleLeaveEvent(event, _context) {
  return __awaiter(this, void 0, void 0, function () {
    var groupId, roomId;
    return __generator(this, function (_a) {
      groupId = event.source.type === "group" ? event.source.groupId : undefined;
      roomId = event.source.type === "room" ? event.source.roomId : undefined;
      (0, globals_js_1.logVerbose)(
        "line: bot left ".concat(groupId ? "group ".concat(groupId) : "room ".concat(roomId)),
      );
      return [2 /*return*/];
    });
  });
}
function handlePostbackEvent(event, context) {
  return __awaiter(this, void 0, void 0, function () {
    var data, postbackContext;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          data = event.postback.data;
          (0, globals_js_1.logVerbose)("line: received postback: ".concat(data));
          return [4 /*yield*/, shouldProcessLineEvent(event, context)];
        case 1:
          if (!_a.sent()) {
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            (0, bot_message_context_js_1.buildLinePostbackContext)({
              event: event,
              cfg: context.cfg,
              account: context.account,
            }),
          ];
        case 2:
          postbackContext = _a.sent();
          if (!postbackContext) {
            return [2 /*return*/];
          }
          return [4 /*yield*/, context.processMessage(postbackContext)];
        case 3:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function handleLineWebhookEvents(events, context) {
  return __awaiter(this, void 0, void 0, function () {
    var _i, events_1, event_1, _a, err_4;
    var _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          ((_i = 0), (events_1 = events));
          _d.label = 1;
        case 1:
          if (!(_i < events_1.length)) {
            return [3 /*break*/, 19];
          }
          event_1 = events_1[_i];
          _d.label = 2;
        case 2:
          _d.trys.push([2, 17, , 18]);
          _a = event_1.type;
          switch (_a) {
            case "message":
              return [3 /*break*/, 3];
            case "follow":
              return [3 /*break*/, 5];
            case "unfollow":
              return [3 /*break*/, 7];
            case "join":
              return [3 /*break*/, 9];
            case "leave":
              return [3 /*break*/, 11];
            case "postback":
              return [3 /*break*/, 13];
          }
          return [3 /*break*/, 15];
        case 3:
          return [4 /*yield*/, handleMessageEvent(event_1, context)];
        case 4:
          _d.sent();
          return [3 /*break*/, 16];
        case 5:
          return [4 /*yield*/, handleFollowEvent(event_1, context)];
        case 6:
          _d.sent();
          return [3 /*break*/, 16];
        case 7:
          return [4 /*yield*/, handleUnfollowEvent(event_1, context)];
        case 8:
          _d.sent();
          return [3 /*break*/, 16];
        case 9:
          return [4 /*yield*/, handleJoinEvent(event_1, context)];
        case 10:
          _d.sent();
          return [3 /*break*/, 16];
        case 11:
          return [4 /*yield*/, handleLeaveEvent(event_1, context)];
        case 12:
          _d.sent();
          return [3 /*break*/, 16];
        case 13:
          return [4 /*yield*/, handlePostbackEvent(event_1, context)];
        case 14:
          _d.sent();
          return [3 /*break*/, 16];
        case 15:
          (0, globals_js_1.logVerbose)("line: unhandled event type: ".concat(event_1.type));
          _d.label = 16;
        case 16:
          return [3 /*break*/, 18];
        case 17:
          err_4 = _d.sent();
          (_c = (_b = context.runtime).error) === null || _c === void 0
            ? void 0
            : _c.call(
                _b,
                (0, globals_js_1.danger)("line: event handler failed: ".concat(String(err_4))),
              );
          return [3 /*break*/, 18];
        case 18:
          _i++;
          return [3 /*break*/, 1];
        case 19:
          return [2 /*return*/];
      }
    });
  });
}
