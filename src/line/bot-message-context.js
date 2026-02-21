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
exports.buildLineMessageContext = buildLineMessageContext;
exports.buildLinePostbackContext = buildLinePostbackContext;
var envelope_js_1 = require("../auto-reply/envelope.js");
var inbound_context_js_1 = require("../auto-reply/reply/inbound-context.js");
var location_js_1 = require("../channels/location.js");
var sessions_js_1 = require("../config/sessions.js");
var globals_js_1 = require("../globals.js");
var channel_activity_js_1 = require("../infra/channel-activity.js");
var resolve_route_js_1 = require("../routing/resolve-route.js");
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
function buildPeerId(source) {
  if (source.type === "group" && source.groupId) {
    return "group:".concat(source.groupId);
  }
  if (source.type === "room" && source.roomId) {
    return "room:".concat(source.roomId);
  }
  if (source.type === "user" && source.userId) {
    return source.userId;
  }
  return "unknown";
}
// Common LINE sticker package descriptions
var STICKER_PACKAGES = {
  1: "Moon & James",
  2: "Cony & Brown",
  3: "Brown & Friends",
  4: "Moon Special",
  11537: "Cony",
  11538: "Brown",
  11539: "Moon",
  6136: "Cony's Happy Life",
  6325: "Brown's Life",
  6359: "Choco",
  6362: "Sally",
  6370: "Edward",
  789: "LINE Characters",
};
function describeStickerKeywords(sticker) {
  // Use sticker keywords if available (LINE provides these for some stickers)
  var keywords = sticker.keywords;
  if (keywords && keywords.length > 0) {
    return keywords.slice(0, 3).join(", ");
  }
  // Use sticker text if available
  var stickerText = sticker.text;
  if (stickerText) {
    return stickerText;
  }
  return "";
}
function extractMessageText(message) {
  var _a, _b;
  if (message.type === "text") {
    return message.text;
  }
  if (message.type === "location") {
    var loc = message;
    return (_a = (0, location_js_1.formatLocationText)({
      latitude: loc.latitude,
      longitude: loc.longitude,
      name: loc.title,
      address: loc.address,
    })) !== null && _a !== void 0
      ? _a
      : "";
  }
  if (message.type === "sticker") {
    var sticker = message;
    var packageName =
      (_b = STICKER_PACKAGES[sticker.packageId]) !== null && _b !== void 0 ? _b : "sticker";
    var keywords = describeStickerKeywords(sticker);
    if (keywords) {
      return "[Sent a ".concat(packageName, " sticker: ").concat(keywords, "]");
    }
    return "[Sent a ".concat(packageName, " sticker]");
  }
  return "";
}
function extractMediaPlaceholder(message) {
  switch (message.type) {
    case "image":
      return "<media:image>";
    case "video":
      return "<media:video>";
    case "audio":
      return "<media:audio>";
    case "file":
      return "<media:document>";
    default:
      return "";
  }
}
function buildLineMessageContext(params) {
  return __awaiter(this, void 0, void 0, function () {
    var event,
      allMedia,
      cfg,
      account,
      source,
      _a,
      userId,
      groupId,
      roomId,
      isGroup,
      peerId,
      route,
      message,
      messageId,
      timestamp,
      textContent,
      placeholder,
      rawBody,
      senderId,
      senderLabel,
      conversationLabel,
      storePath,
      envelopeOptions,
      previousTimestamp,
      body,
      locationContext,
      loc,
      fromAddress,
      toAddress,
      originatingTo,
      ctxPayload,
      preview,
      mediaInfo;
    var _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          ((event = params.event),
            (allMedia = params.allMedia),
            (cfg = params.cfg),
            (account = params.account));
          (0, channel_activity_js_1.recordChannelActivity)({
            channel: "line",
            accountId: account.accountId,
            direction: "inbound",
          });
          source = event.source;
          ((_a = getSourceInfo(source)),
            (userId = _a.userId),
            (groupId = _a.groupId),
            (roomId = _a.roomId),
            (isGroup = _a.isGroup));
          peerId = buildPeerId(source);
          route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "line",
            accountId: account.accountId,
            peer: {
              kind: isGroup ? "group" : "dm",
              id: peerId,
            },
          });
          message = event.message;
          messageId = message.id;
          timestamp = event.timestamp;
          textContent = extractMessageText(message);
          placeholder = extractMediaPlaceholder(message);
          rawBody = textContent || placeholder;
          if (!rawBody && allMedia.length > 0) {
            rawBody = "<media:image>".concat(
              allMedia.length > 1 ? " (".concat(allMedia.length, " images)") : "",
            );
          }
          if (!rawBody && allMedia.length === 0) {
            return [2 /*return*/, null];
          }
          senderId = userId !== null && userId !== void 0 ? userId : "unknown";
          senderLabel = userId ? "user:".concat(userId) : "unknown";
          conversationLabel = isGroup
            ? groupId
              ? "group:".concat(groupId)
              : roomId
                ? "room:".concat(roomId)
                : "unknown-group"
            : senderLabel;
          storePath = (0, sessions_js_1.resolveStorePath)(
            (_b = cfg.session) === null || _b === void 0 ? void 0 : _b.store,
            {
              agentId: route.agentId,
            },
          );
          envelopeOptions = (0, envelope_js_1.resolveEnvelopeFormatOptions)(cfg);
          previousTimestamp = (0, sessions_js_1.readSessionUpdatedAt)({
            storePath: storePath,
            sessionKey: route.sessionKey,
          });
          body = (0, envelope_js_1.formatInboundEnvelope)({
            channel: "LINE",
            from: conversationLabel,
            timestamp: timestamp,
            body: rawBody,
            chatType: isGroup ? "group" : "direct",
            sender: {
              id: senderId,
            },
            previousTimestamp: previousTimestamp,
            envelope: envelopeOptions,
          });
          if (message.type === "location") {
            loc = message;
            locationContext = (0, location_js_1.toLocationContext)({
              latitude: loc.latitude,
              longitude: loc.longitude,
              name: loc.title,
              address: loc.address,
            });
          }
          fromAddress = isGroup
            ? groupId
              ? "line:group:".concat(groupId)
              : roomId
                ? "line:room:".concat(roomId)
                : "line:".concat(peerId)
            : "line:".concat(userId !== null && userId !== void 0 ? userId : peerId);
          toAddress = isGroup
            ? fromAddress
            : "line:".concat(userId !== null && userId !== void 0 ? userId : peerId);
          originatingTo = isGroup
            ? fromAddress
            : "line:".concat(userId !== null && userId !== void 0 ? userId : peerId);
          ctxPayload = (0, inbound_context_js_1.finalizeInboundContext)(
            __assign(
              __assign(
                {
                  Body: body,
                  RawBody: rawBody,
                  CommandBody: rawBody,
                  From: fromAddress,
                  To: toAddress,
                  SessionKey: route.sessionKey,
                  AccountId: route.accountId,
                  ChatType: isGroup ? "group" : "direct",
                  ConversationLabel: conversationLabel,
                  GroupSubject: isGroup
                    ? groupId !== null && groupId !== void 0
                      ? groupId
                      : roomId
                    : undefined,
                  SenderId: senderId,
                  Provider: "line",
                  Surface: "line",
                  MessageSid: messageId,
                  Timestamp: timestamp,
                  MediaPath: (_c = allMedia[0]) === null || _c === void 0 ? void 0 : _c.path,
                  MediaType: (_d = allMedia[0]) === null || _d === void 0 ? void 0 : _d.contentType,
                  MediaUrl: (_e = allMedia[0]) === null || _e === void 0 ? void 0 : _e.path,
                  MediaPaths:
                    allMedia.length > 0
                      ? allMedia.map(function (m) {
                          return m.path;
                        })
                      : undefined,
                  MediaUrls:
                    allMedia.length > 0
                      ? allMedia.map(function (m) {
                          return m.path;
                        })
                      : undefined,
                  MediaTypes:
                    allMedia.length > 0
                      ? allMedia
                          .map(function (m) {
                            return m.contentType;
                          })
                          .filter(Boolean)
                      : undefined,
                },
                locationContext,
              ),
              { OriginatingChannel: "line", OriginatingTo: originatingTo },
            ),
          );
          void (0, sessions_js_1.recordSessionMetaFromInbound)({
            storePath: storePath,
            sessionKey:
              (_f = ctxPayload.SessionKey) !== null && _f !== void 0 ? _f : route.sessionKey,
            ctx: ctxPayload,
          }).catch(function (err) {
            (0, globals_js_1.logVerbose)(
              "line: failed updating session meta: ".concat(String(err)),
            );
          });
          if (!!isGroup) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateLastRoute)({
              storePath: storePath,
              sessionKey: route.mainSessionKey,
              deliveryContext: {
                channel: "line",
                to: userId !== null && userId !== void 0 ? userId : peerId,
                accountId: route.accountId,
              },
              ctx: ctxPayload,
            }),
          ];
        case 1:
          _g.sent();
          _g.label = 2;
        case 2:
          if ((0, globals_js_1.shouldLogVerbose)()) {
            preview = body.slice(0, 200).replace(/\n/g, "\\n");
            mediaInfo = allMedia.length > 1 ? " mediaCount=".concat(allMedia.length) : "";
            (0, globals_js_1.logVerbose)(
              "line inbound: from="
                .concat(ctxPayload.From, " len=")
                .concat(body.length)
                .concat(mediaInfo, ' preview="')
                .concat(preview, '"'),
            );
          }
          return [
            2 /*return*/,
            {
              ctxPayload: ctxPayload,
              event: event,
              userId: userId,
              groupId: groupId,
              roomId: roomId,
              isGroup: isGroup,
              route: route,
              replyToken: event.replyToken,
              accountId: account.accountId,
            },
          ];
      }
    });
  });
}
function buildLinePostbackContext(params) {
  return __awaiter(this, void 0, void 0, function () {
    var event,
      cfg,
      account,
      source,
      _a,
      userId,
      groupId,
      roomId,
      isGroup,
      peerId,
      route,
      timestamp,
      rawData,
      rawBody,
      params_1,
      action,
      device,
      senderId,
      senderLabel,
      conversationLabel,
      storePath,
      envelopeOptions,
      previousTimestamp,
      body,
      fromAddress,
      toAddress,
      originatingTo,
      ctxPayload,
      preview;
    var _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          ((event = params.event), (cfg = params.cfg), (account = params.account));
          (0, channel_activity_js_1.recordChannelActivity)({
            channel: "line",
            accountId: account.accountId,
            direction: "inbound",
          });
          source = event.source;
          ((_a = getSourceInfo(source)),
            (userId = _a.userId),
            (groupId = _a.groupId),
            (roomId = _a.roomId),
            (isGroup = _a.isGroup));
          peerId = buildPeerId(source);
          route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "line",
            accountId: account.accountId,
            peer: {
              kind: isGroup ? "group" : "dm",
              id: peerId,
            },
          });
          timestamp = event.timestamp;
          rawData =
            (_d =
              (_c = (_b = event.postback) === null || _b === void 0 ? void 0 : _b.data) === null ||
              _c === void 0
                ? void 0
                : _c.trim()) !== null && _d !== void 0
              ? _d
              : "";
          if (!rawData) {
            return [2 /*return*/, null];
          }
          rawBody = rawData;
          if (rawData.includes("line.action=")) {
            params_1 = new URLSearchParams(rawData);
            action = (_e = params_1.get("line.action")) !== null && _e !== void 0 ? _e : "";
            device = params_1.get("line.device");
            rawBody = device
              ? "line action ".concat(action, " device ").concat(device)
              : "line action ".concat(action);
          }
          senderId = userId !== null && userId !== void 0 ? userId : "unknown";
          senderLabel = userId ? "user:".concat(userId) : "unknown";
          conversationLabel = isGroup
            ? groupId
              ? "group:".concat(groupId)
              : roomId
                ? "room:".concat(roomId)
                : "unknown-group"
            : senderLabel;
          storePath = (0, sessions_js_1.resolveStorePath)(
            (_f = cfg.session) === null || _f === void 0 ? void 0 : _f.store,
            {
              agentId: route.agentId,
            },
          );
          envelopeOptions = (0, envelope_js_1.resolveEnvelopeFormatOptions)(cfg);
          previousTimestamp = (0, sessions_js_1.readSessionUpdatedAt)({
            storePath: storePath,
            sessionKey: route.sessionKey,
          });
          body = (0, envelope_js_1.formatInboundEnvelope)({
            channel: "LINE",
            from: conversationLabel,
            timestamp: timestamp,
            body: rawBody,
            chatType: isGroup ? "group" : "direct",
            sender: {
              id: senderId,
            },
            previousTimestamp: previousTimestamp,
            envelope: envelopeOptions,
          });
          fromAddress = isGroup
            ? groupId
              ? "line:group:".concat(groupId)
              : roomId
                ? "line:room:".concat(roomId)
                : "line:".concat(peerId)
            : "line:".concat(userId !== null && userId !== void 0 ? userId : peerId);
          toAddress = isGroup
            ? fromAddress
            : "line:".concat(userId !== null && userId !== void 0 ? userId : peerId);
          originatingTo = isGroup
            ? fromAddress
            : "line:".concat(userId !== null && userId !== void 0 ? userId : peerId);
          ctxPayload = (0, inbound_context_js_1.finalizeInboundContext)({
            Body: body,
            RawBody: rawBody,
            CommandBody: rawBody,
            From: fromAddress,
            To: toAddress,
            SessionKey: route.sessionKey,
            AccountId: route.accountId,
            ChatType: isGroup ? "group" : "direct",
            ConversationLabel: conversationLabel,
            GroupSubject: isGroup
              ? groupId !== null && groupId !== void 0
                ? groupId
                : roomId
              : undefined,
            SenderId: senderId,
            Provider: "line",
            Surface: "line",
            MessageSid: event.replyToken
              ? "postback:".concat(event.replyToken)
              : "postback:".concat(timestamp),
            Timestamp: timestamp,
            MediaPath: "",
            MediaType: undefined,
            MediaUrl: "",
            MediaPaths: undefined,
            MediaUrls: undefined,
            MediaTypes: undefined,
            OriginatingChannel: "line",
            OriginatingTo: originatingTo,
          });
          void (0, sessions_js_1.recordSessionMetaFromInbound)({
            storePath: storePath,
            sessionKey:
              (_g = ctxPayload.SessionKey) !== null && _g !== void 0 ? _g : route.sessionKey,
            ctx: ctxPayload,
          }).catch(function (err) {
            (0, globals_js_1.logVerbose)(
              "line: failed updating session meta: ".concat(String(err)),
            );
          });
          if (!!isGroup) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateLastRoute)({
              storePath: storePath,
              sessionKey: route.mainSessionKey,
              deliveryContext: {
                channel: "line",
                to: userId !== null && userId !== void 0 ? userId : peerId,
                accountId: route.accountId,
              },
              ctx: ctxPayload,
            }),
          ];
        case 1:
          _h.sent();
          _h.label = 2;
        case 2:
          if ((0, globals_js_1.shouldLogVerbose)()) {
            preview = body.slice(0, 200).replace(/\n/g, "\\n");
            (0, globals_js_1.logVerbose)(
              "line postback: from="
                .concat(ctxPayload.From, " len=")
                .concat(body.length, ' preview="')
                .concat(preview, '"'),
            );
          }
          return [
            2 /*return*/,
            {
              ctxPayload: ctxPayload,
              event: event,
              userId: userId,
              groupId: groupId,
              roomId: roomId,
              isGroup: isGroup,
              route: route,
              replyToken: event.replyToken,
              accountId: account.accountId,
            },
          ];
      }
    });
  });
}
