"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTelegramForumThreadId = resolveTelegramForumThreadId;
exports.buildTelegramThreadParams = buildTelegramThreadParams;
exports.buildTypingThreadParams = buildTypingThreadParams;
exports.resolveTelegramStreamMode = resolveTelegramStreamMode;
exports.buildTelegramGroupPeerId = buildTelegramGroupPeerId;
exports.buildTelegramGroupFrom = buildTelegramGroupFrom;
exports.buildSenderName = buildSenderName;
exports.buildSenderLabel = buildSenderLabel;
exports.buildGroupLabel = buildGroupLabel;
exports.hasBotMention = hasBotMention;
exports.expandTextLinks = expandTextLinks;
exports.resolveTelegramReplyId = resolveTelegramReplyId;
exports.describeReplyTarget = describeReplyTarget;
exports.normalizeForwardedContext = normalizeForwardedContext;
exports.extractTelegramLocation = extractTelegramLocation;
var location_js_1 = require("../../channels/location.js");
var TELEGRAM_GENERAL_TOPIC_ID = 1;
/**
 * Resolve the thread ID for Telegram forum topics.
 * For non-forum groups, returns undefined even if messageThreadId is present
 * (reply threads in regular groups should not create separate sessions).
 * For forum groups, returns the topic ID (or General topic ID=1 if unspecified).
 */
function resolveTelegramForumThreadId(params) {
  // Non-forum groups: ignore message_thread_id (reply threads are not real topics)
  if (!params.isForum) {
    return undefined;
  }
  // Forum groups: use the topic ID, defaulting to General topic
  if (params.messageThreadId == null) {
    return TELEGRAM_GENERAL_TOPIC_ID;
  }
  return params.messageThreadId;
}
/**
 * Build thread params for Telegram API calls (messages, media).
 * General forum topic (id=1) must be treated like a regular supergroup send:
 * Telegram rejects sendMessage/sendMedia with message_thread_id=1 ("thread not found").
 */
function buildTelegramThreadParams(messageThreadId) {
  if (messageThreadId == null) {
    return undefined;
  }
  var normalized = Math.trunc(messageThreadId);
  if (normalized === TELEGRAM_GENERAL_TOPIC_ID) {
    return undefined;
  }
  return { message_thread_id: normalized };
}
/**
 * Build thread params for typing indicators (sendChatAction).
 * Empirically, General topic (id=1) needs message_thread_id for typing to appear.
 */
function buildTypingThreadParams(messageThreadId) {
  if (messageThreadId == null) {
    return undefined;
  }
  return { message_thread_id: Math.trunc(messageThreadId) };
}
function resolveTelegramStreamMode(telegramCfg) {
  var _a;
  var raw =
    (_a = telegramCfg === null || telegramCfg === void 0 ? void 0 : telegramCfg.streamMode) ===
      null || _a === void 0
      ? void 0
      : _a.trim().toLowerCase();
  if (raw === "off" || raw === "partial" || raw === "block") {
    return raw;
  }
  return "partial";
}
function buildTelegramGroupPeerId(chatId, messageThreadId) {
  return messageThreadId != null
    ? "".concat(chatId, ":topic:").concat(messageThreadId)
    : String(chatId);
}
function buildTelegramGroupFrom(chatId, messageThreadId) {
  return "telegram:group:".concat(buildTelegramGroupPeerId(chatId, messageThreadId));
}
function buildSenderName(msg) {
  var _a, _b, _c;
  var name =
    [
      (_a = msg.from) === null || _a === void 0 ? void 0 : _a.first_name,
      (_b = msg.from) === null || _b === void 0 ? void 0 : _b.last_name,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() || ((_c = msg.from) === null || _c === void 0 ? void 0 : _c.username);
  return name || undefined;
}
function buildSenderLabel(msg, senderId) {
  var _a, _b;
  var name = buildSenderName(msg);
  var username = ((_a = msg.from) === null || _a === void 0 ? void 0 : _a.username)
    ? "@".concat(msg.from.username)
    : undefined;
  var label = name;
  if (name && username) {
    label = "".concat(name, " (").concat(username, ")");
  } else if (!name && username) {
    label = username;
  }
  var normalizedSenderId =
    senderId != null && "".concat(senderId).trim() ? "".concat(senderId).trim() : undefined;
  var fallbackId =
    normalizedSenderId !== null && normalizedSenderId !== void 0
      ? normalizedSenderId
      : ((_b = msg.from) === null || _b === void 0 ? void 0 : _b.id) != null
        ? String(msg.from.id)
        : undefined;
  var idPart = fallbackId ? "id:".concat(fallbackId) : undefined;
  if (label && idPart) {
    return "".concat(label, " ").concat(idPart);
  }
  if (label) {
    return label;
  }
  return idPart !== null && idPart !== void 0 ? idPart : "id:unknown";
}
function buildGroupLabel(msg, chatId, messageThreadId) {
  var _a;
  var title = (_a = msg.chat) === null || _a === void 0 ? void 0 : _a.title;
  var topicSuffix = messageThreadId != null ? " topic:".concat(messageThreadId) : "";
  if (title) {
    return "".concat(title, " id:").concat(chatId).concat(topicSuffix);
  }
  return "group:".concat(chatId).concat(topicSuffix);
}
function hasBotMention(msg, botUsername) {
  var _a, _b, _c, _d, _e, _f;
  var text = (
    (_b = (_a = msg.text) !== null && _a !== void 0 ? _a : msg.caption) !== null && _b !== void 0
      ? _b
      : ""
  ).toLowerCase();
  if (text.includes("@".concat(botUsername))) {
    return true;
  }
  var entities =
    (_d = (_c = msg.entities) !== null && _c !== void 0 ? _c : msg.caption_entities) !== null &&
    _d !== void 0
      ? _d
      : [];
  for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
    var ent = entities_1[_i];
    if (ent.type !== "mention") {
      continue;
    }
    var slice = (
      (_f = (_e = msg.text) !== null && _e !== void 0 ? _e : msg.caption) !== null && _f !== void 0
        ? _f
        : ""
    ).slice(ent.offset, ent.offset + ent.length);
    if (slice.toLowerCase() === "@".concat(botUsername)) {
      return true;
    }
  }
  return false;
}
function expandTextLinks(text, entities) {
  if (!text || !(entities === null || entities === void 0 ? void 0 : entities.length)) {
    return text;
  }
  var textLinks = entities
    .filter(function (entity) {
      return entity.type === "text_link" && Boolean(entity.url);
    })
    .toSorted(function (a, b) {
      return b.offset - a.offset;
    });
  if (textLinks.length === 0) {
    return text;
  }
  var result = text;
  for (var _i = 0, textLinks_1 = textLinks; _i < textLinks_1.length; _i++) {
    var entity = textLinks_1[_i];
    var linkText = text.slice(entity.offset, entity.offset + entity.length);
    var markdown = "[".concat(linkText, "](").concat(entity.url, ")");
    result =
      result.slice(0, entity.offset) + markdown + result.slice(entity.offset + entity.length);
  }
  return result;
}
function resolveTelegramReplyId(raw) {
  if (!raw) {
    return undefined;
  }
  var parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }
  return parsed;
}
function describeReplyTarget(msg) {
  var _a, _b;
  var reply = msg.reply_to_message;
  var quote = msg.quote;
  var body = "";
  var kind = "reply";
  if (quote === null || quote === void 0 ? void 0 : quote.text) {
    body = quote.text.trim();
    if (body) {
      kind = "quote";
    }
  }
  if (!body && reply) {
    var replyBody = (
      (_b = (_a = reply.text) !== null && _a !== void 0 ? _a : reply.caption) !== null &&
      _b !== void 0
        ? _b
        : ""
    ).trim();
    body = replyBody;
    if (!body) {
      if (reply.photo) {
        body = "<media:image>";
      } else if (reply.video) {
        body = "<media:video>";
      } else if (reply.audio || reply.voice) {
        body = "<media:audio>";
      } else if (reply.document) {
        body = "<media:document>";
      } else {
        var locationData = extractTelegramLocation(reply);
        if (locationData) {
          body = (0, location_js_1.formatLocationText)(locationData);
        }
      }
    }
  }
  if (!body) {
    return null;
  }
  var sender = reply ? buildSenderName(reply) : undefined;
  var senderLabel = sender ? "".concat(sender) : "unknown sender";
  return {
    id: (reply === null || reply === void 0 ? void 0 : reply.message_id)
      ? String(reply.message_id)
      : undefined,
    sender: senderLabel,
    body: body,
    kind: kind,
  };
}
function normalizeForwardedUserLabel(user) {
  var _a;
  var name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  var username = ((_a = user.username) === null || _a === void 0 ? void 0 : _a.trim()) || undefined;
  var id = user.id != null ? String(user.id) : undefined;
  var display =
    (name && username
      ? "".concat(name, " (@").concat(username, ")")
      : name || (username ? "@".concat(username) : undefined)) ||
    (id ? "user:".concat(id) : undefined);
  return { display: display, name: name || undefined, username: username, id: id };
}
function normalizeForwardedChatLabel(chat, fallbackKind) {
  var _a, _b;
  var title = ((_a = chat.title) === null || _a === void 0 ? void 0 : _a.trim()) || undefined;
  var username = ((_b = chat.username) === null || _b === void 0 ? void 0 : _b.trim()) || undefined;
  var id = chat.id != null ? String(chat.id) : undefined;
  var display =
    title ||
    (username ? "@".concat(username) : undefined) ||
    (id ? "".concat(fallbackKind, ":").concat(id) : undefined);
  return { display: display, title: title, username: username, id: id };
}
function buildForwardedContextFromUser(params) {
  var _a = normalizeForwardedUserLabel(params.user),
    display = _a.display,
    name = _a.name,
    username = _a.username,
    id = _a.id;
  if (!display) {
    return null;
  }
  return {
    from: display,
    date: params.date,
    fromType: params.type,
    fromId: id,
    fromUsername: username,
    fromTitle: name,
  };
}
function buildForwardedContextFromHiddenName(params) {
  var _a;
  var trimmed = (_a = params.name) === null || _a === void 0 ? void 0 : _a.trim();
  if (!trimmed) {
    return null;
  }
  return {
    from: trimmed,
    date: params.date,
    fromType: params.type,
    fromTitle: trimmed,
  };
}
function buildForwardedContextFromChat(params) {
  var _a;
  var fallbackKind =
    params.type === "channel" || params.type === "legacy_channel" ? "channel" : "chat";
  var _b = normalizeForwardedChatLabel(params.chat, fallbackKind),
    display = _b.display,
    title = _b.title,
    username = _b.username,
    id = _b.id;
  if (!display) {
    return null;
  }
  var signature =
    ((_a = params.signature) === null || _a === void 0 ? void 0 : _a.trim()) || undefined;
  var from = signature ? "".concat(display, " (").concat(signature, ")") : display;
  return {
    from: from,
    date: params.date,
    fromType: params.type,
    fromId: id,
    fromUsername: username,
    fromTitle: title,
    fromSignature: signature,
  };
}
function resolveForwardOrigin(origin, signature) {
  if (origin.type === "user" && origin.sender_user) {
    return buildForwardedContextFromUser({
      user: origin.sender_user,
      date: origin.date,
      type: "user",
    });
  }
  if (origin.type === "hidden_user") {
    return buildForwardedContextFromHiddenName({
      name: origin.sender_user_name,
      date: origin.date,
      type: "hidden_user",
    });
  }
  if (origin.type === "chat" && origin.sender_chat) {
    return buildForwardedContextFromChat({
      chat: origin.sender_chat,
      date: origin.date,
      type: "chat",
      signature: signature,
    });
  }
  if (origin.type === "channel" && origin.chat) {
    return buildForwardedContextFromChat({
      chat: origin.chat,
      date: origin.date,
      type: "channel",
      signature: signature,
    });
  }
  return null;
}
/**
 * Extract forwarded message origin info from Telegram message.
 * Supports both new forward_origin API and legacy forward_from/forward_from_chat fields.
 */
function normalizeForwardedContext(msg) {
  var _a;
  var forwardMsg = msg;
  var signature =
    ((_a = forwardMsg.forward_signature) === null || _a === void 0 ? void 0 : _a.trim()) ||
    undefined;
  if (forwardMsg.forward_origin) {
    var originContext = resolveForwardOrigin(forwardMsg.forward_origin, signature);
    if (originContext) {
      return originContext;
    }
  }
  if (forwardMsg.forward_from_chat) {
    var legacyType =
      forwardMsg.forward_from_chat.type === "channel" ? "legacy_channel" : "legacy_chat";
    var legacyContext = buildForwardedContextFromChat({
      chat: forwardMsg.forward_from_chat,
      date: forwardMsg.forward_date,
      type: legacyType,
      signature: signature,
    });
    if (legacyContext) {
      return legacyContext;
    }
  }
  if (forwardMsg.forward_from) {
    var legacyContext = buildForwardedContextFromUser({
      user: forwardMsg.forward_from,
      date: forwardMsg.forward_date,
      type: "legacy_user",
    });
    if (legacyContext) {
      return legacyContext;
    }
  }
  var hiddenContext = buildForwardedContextFromHiddenName({
    name: forwardMsg.forward_sender_name,
    date: forwardMsg.forward_date,
    type: "legacy_hidden_user",
  });
  if (hiddenContext) {
    return hiddenContext;
  }
  return null;
}
function extractTelegramLocation(msg) {
  var msgWithLocation = msg;
  var venue = msgWithLocation.venue,
    location = msgWithLocation.location;
  if (venue) {
    return {
      latitude: venue.location.latitude,
      longitude: venue.location.longitude,
      accuracy: venue.location.horizontal_accuracy,
      name: venue.title,
      address: venue.address,
      source: "place",
      isLive: false,
    };
  }
  if (location) {
    var isLive = typeof location.live_period === "number" && location.live_period > 0;
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.horizontal_accuracy,
      source: isLive ? "live" : "pin",
      isLive: isLive,
    };
  }
  return null;
}
