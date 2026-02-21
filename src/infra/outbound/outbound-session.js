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
exports.resolveOutboundSessionRoute = resolveOutboundSessionRoute;
exports.ensureOutboundSessionEntry = ensureOutboundSessionEntry;
var index_js_1 = require("../../channels/plugins/index.js");
var sessions_js_1 = require("../../config/sessions.js");
var targets_js_1 = require("../../discord/targets.js");
var targets_js_2 = require("../../imessage/targets.js");
var resolve_route_js_1 = require("../../routing/resolve-route.js");
var session_key_js_1 = require("../../routing/session-key.js");
var accounts_js_1 = require("../../slack/accounts.js");
var client_js_1 = require("../../slack/client.js");
var allow_list_js_1 = require("../../slack/monitor/allow-list.js");
var identity_js_1 = require("../../signal/identity.js");
var targets_js_3 = require("../../slack/targets.js");
var helpers_js_1 = require("../../telegram/bot/helpers.js");
var inline_buttons_js_1 = require("../../telegram/inline-buttons.js");
var targets_js_4 = require("../../telegram/targets.js");
var normalize_js_1 = require("../../whatsapp/normalize.js");
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var UUID_COMPACT_RE = /^[0-9a-f]{32}$/i;
// Cache Slack channel type lookups to avoid repeated API calls.
var SLACK_CHANNEL_TYPE_CACHE = new Map();
function looksLikeUuid(value) {
  if (UUID_RE.test(value) || UUID_COMPACT_RE.test(value)) {
    return true;
  }
  var compact = value.replace(/-/g, "");
  if (!/^[0-9a-f]+$/i.test(compact)) {
    return false;
  }
  return /[a-f]/i.test(compact);
}
function normalizeThreadId(value) {
  if (value == null) {
    return undefined;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return undefined;
    }
    return String(Math.trunc(value));
  }
  var trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}
function stripProviderPrefix(raw, channel) {
  var trimmed = raw.trim();
  var lower = trimmed.toLowerCase();
  var prefix = "".concat(channel.toLowerCase(), ":");
  if (lower.startsWith(prefix)) {
    return trimmed.slice(prefix.length).trim();
  }
  return trimmed;
}
function stripKindPrefix(raw) {
  return raw.replace(/^(user|channel|group|conversation|room|dm):/i, "").trim();
}
function inferPeerKind(params) {
  var _a, _b, _c;
  var resolvedKind = (_a = params.resolvedTarget) === null || _a === void 0 ? void 0 : _a.kind;
  if (resolvedKind === "user") {
    return "dm";
  }
  if (resolvedKind === "channel") {
    return "channel";
  }
  if (resolvedKind === "group") {
    var plugin = (0, index_js_1.getChannelPlugin)(params.channel);
    var chatTypes =
      (_c =
        (_b = plugin === null || plugin === void 0 ? void 0 : plugin.capabilities) === null ||
        _b === void 0
          ? void 0
          : _b.chatTypes) !== null && _c !== void 0
        ? _c
        : [];
    var supportsChannel = chatTypes.includes("channel");
    var supportsGroup = chatTypes.includes("group");
    if (supportsChannel && !supportsGroup) {
      return "channel";
    }
    return "group";
  }
  return "dm";
}
function buildBaseSessionKey(params) {
  var _a, _b, _c;
  return (0, resolve_route_js_1.buildAgentSessionKey)({
    agentId: params.agentId,
    channel: params.channel,
    accountId: params.accountId,
    peer: params.peer,
    dmScope:
      (_b = (_a = params.cfg.session) === null || _a === void 0 ? void 0 : _a.dmScope) !== null &&
      _b !== void 0
        ? _b
        : "main",
    identityLinks: (_c = params.cfg.session) === null || _c === void 0 ? void 0 : _c.identityLinks,
  });
}
// Best-effort mpim detection: allowlist/config, then Slack API (if token available).
function resolveSlackChannelType(params) {
  return __awaiter(this, void 0, void 0, function () {
    var channelId,
      cached,
      account,
      groupChannels,
      channelIdLower,
      channelKeys,
      token,
      client,
      info,
      channel,
      type,
      _a;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          channelId = params.channelId.trim();
          if (!channelId) {
            return [2 /*return*/, "unknown"];
          }
          cached = SLACK_CHANNEL_TYPE_CACHE.get(
            ""
              .concat((_b = params.accountId) !== null && _b !== void 0 ? _b : "default", ":")
              .concat(channelId),
          );
          if (cached) {
            return [2 /*return*/, cached];
          }
          account = (0, accounts_js_1.resolveSlackAccount)({
            cfg: params.cfg,
            accountId: params.accountId,
          });
          groupChannels = (0, allow_list_js_1.normalizeAllowListLower)(
            (_c = account.dm) === null || _c === void 0 ? void 0 : _c.groupChannels,
          );
          channelIdLower = channelId.toLowerCase();
          if (
            groupChannels.includes(channelIdLower) ||
            groupChannels.includes("slack:".concat(channelIdLower)) ||
            groupChannels.includes("channel:".concat(channelIdLower)) ||
            groupChannels.includes("group:".concat(channelIdLower)) ||
            groupChannels.includes("mpim:".concat(channelIdLower))
          ) {
            SLACK_CHANNEL_TYPE_CACHE.set(
              "".concat(account.accountId, ":").concat(channelId),
              "group",
            );
            return [2 /*return*/, "group"];
          }
          channelKeys = Object.keys((_d = account.channels) !== null && _d !== void 0 ? _d : {});
          if (
            channelKeys.some(function (key) {
              var normalized = key.trim().toLowerCase();
              return (
                normalized === channelIdLower ||
                normalized === "channel:".concat(channelIdLower) ||
                normalized.replace(/^#/, "") === channelIdLower
              );
            })
          ) {
            SLACK_CHANNEL_TYPE_CACHE.set(
              "".concat(account.accountId, ":").concat(channelId),
              "channel",
            );
            return [2 /*return*/, "channel"];
          }
          token =
            ((_e = account.botToken) === null || _e === void 0 ? void 0 : _e.trim()) ||
            (typeof account.config.userToken === "string" ? account.config.userToken.trim() : "");
          if (!token) {
            SLACK_CHANNEL_TYPE_CACHE.set(
              "".concat(account.accountId, ":").concat(channelId),
              "unknown",
            );
            return [2 /*return*/, "unknown"];
          }
          _f.label = 1;
        case 1:
          _f.trys.push([1, 3, , 4]);
          client = (0, client_js_1.createSlackWebClient)(token);
          return [4 /*yield*/, client.conversations.info({ channel: channelId })];
        case 2:
          info = _f.sent();
          channel = info.channel;
          type = (channel === null || channel === void 0 ? void 0 : channel.is_im)
            ? "dm"
            : (channel === null || channel === void 0 ? void 0 : channel.is_mpim)
              ? "group"
              : "channel";
          SLACK_CHANNEL_TYPE_CACHE.set("".concat(account.accountId, ":").concat(channelId), type);
          return [2 /*return*/, type];
        case 3:
          _a = _f.sent();
          SLACK_CHANNEL_TYPE_CACHE.set(
            "".concat(account.accountId, ":").concat(channelId),
            "unknown",
          );
          return [2 /*return*/, "unknown"];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function resolveSlackSession(params) {
  return __awaiter(this, void 0, void 0, function () {
    var parsed, isDm, peerKind, channelType, peer, baseSessionKey, threadId, threadKeys;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          parsed = (0, targets_js_3.parseSlackTarget)(params.target, { defaultKind: "channel" });
          if (!parsed) {
            return [2 /*return*/, null];
          }
          isDm = parsed.kind === "user";
          peerKind = isDm ? "dm" : "channel";
          if (!(!isDm && /^G/i.test(parsed.id))) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            resolveSlackChannelType({
              cfg: params.cfg,
              accountId: params.accountId,
              channelId: parsed.id,
            }),
          ];
        case 1:
          channelType = _b.sent();
          if (channelType === "group") {
            peerKind = "group";
          }
          if (channelType === "dm") {
            peerKind = "dm";
          }
          _b.label = 2;
        case 2:
          peer = {
            kind: peerKind,
            id: parsed.id,
          };
          baseSessionKey = buildBaseSessionKey({
            cfg: params.cfg,
            agentId: params.agentId,
            channel: "slack",
            accountId: params.accountId,
            peer: peer,
          });
          threadId = normalizeThreadId(
            (_a = params.threadId) !== null && _a !== void 0 ? _a : params.replyToId,
          );
          threadKeys = (0, session_key_js_1.resolveThreadSessionKeys)({
            baseSessionKey: baseSessionKey,
            threadId: threadId,
          });
          return [
            2 /*return*/,
            {
              sessionKey: threadKeys.sessionKey,
              baseSessionKey: baseSessionKey,
              peer: peer,
              chatType: peerKind === "dm" ? "direct" : "channel",
              from:
                peerKind === "dm"
                  ? "slack:".concat(parsed.id)
                  : peerKind === "group"
                    ? "slack:group:".concat(parsed.id)
                    : "slack:channel:".concat(parsed.id),
              to: peerKind === "dm" ? "user:".concat(parsed.id) : "channel:".concat(parsed.id),
              threadId: threadId,
            },
          ];
      }
    });
  });
}
function resolveDiscordSession(params) {
  var parsed = (0, targets_js_1.parseDiscordTarget)(params.target, { defaultKind: "channel" });
  if (!parsed) {
    return null;
  }
  var isDm = parsed.kind === "user";
  var peer = {
    kind: isDm ? "dm" : "channel",
    id: parsed.id,
  };
  var baseSessionKey = buildBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "discord",
    accountId: params.accountId,
    peer: peer,
  });
  var explicitThreadId = normalizeThreadId(params.threadId);
  var threadCandidate =
    explicitThreadId !== null && explicitThreadId !== void 0
      ? explicitThreadId
      : normalizeThreadId(params.replyToId);
  // Discord threads use their own channel id; avoid adding a :thread suffix.
  var threadKeys = (0, session_key_js_1.resolveThreadSessionKeys)({
    baseSessionKey: baseSessionKey,
    threadId: threadCandidate,
    useSuffix: false,
  });
  return {
    sessionKey: threadKeys.sessionKey,
    baseSessionKey: baseSessionKey,
    peer: peer,
    chatType: isDm ? "direct" : "channel",
    from: isDm ? "discord:".concat(parsed.id) : "discord:channel:".concat(parsed.id),
    to: isDm ? "user:".concat(parsed.id) : "channel:".concat(parsed.id),
    threadId:
      explicitThreadId !== null && explicitThreadId !== void 0 ? explicitThreadId : undefined,
  };
}
function resolveTelegramSession(params) {
  var _a;
  var parsed = (0, targets_js_4.parseTelegramTarget)(params.target);
  var chatId = parsed.chatId.trim();
  if (!chatId) {
    return null;
  }
  var parsedThreadId = parsed.messageThreadId;
  var fallbackThreadId = normalizeThreadId(params.threadId);
  var resolvedThreadId =
    parsedThreadId !== null && parsedThreadId !== void 0
      ? parsedThreadId
      : fallbackThreadId
        ? Number.parseInt(fallbackThreadId, 10)
        : undefined;
  // Telegram topics are encoded in the peer id (chatId:topic:<id>).
  var chatType = (0, inline_buttons_js_1.resolveTelegramTargetChatType)(params.target);
  // If the target is a username and we lack a resolvedTarget, default to DM to avoid group keys.
  var isGroup =
    chatType === "group" ||
    (chatType === "unknown" &&
      ((_a = params.resolvedTarget) === null || _a === void 0 ? void 0 : _a.kind) &&
      params.resolvedTarget.kind !== "user");
  var peerId = isGroup
    ? (0, helpers_js_1.buildTelegramGroupPeerId)(chatId, resolvedThreadId)
    : chatId;
  var peer = {
    kind: isGroup ? "group" : "dm",
    id: peerId,
  };
  var baseSessionKey = buildBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "telegram",
    accountId: params.accountId,
    peer: peer,
  });
  return {
    sessionKey: baseSessionKey,
    baseSessionKey: baseSessionKey,
    peer: peer,
    chatType: isGroup ? "group" : "direct",
    from: isGroup ? "telegram:group:".concat(peerId) : "telegram:".concat(chatId),
    to: "telegram:".concat(chatId),
    threadId: resolvedThreadId,
  };
}
function resolveWhatsAppSession(params) {
  var normalized = (0, normalize_js_1.normalizeWhatsAppTarget)(params.target);
  if (!normalized) {
    return null;
  }
  var isGroup = (0, normalize_js_1.isWhatsAppGroupJid)(normalized);
  var peer = {
    kind: isGroup ? "group" : "dm",
    id: normalized,
  };
  var baseSessionKey = buildBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "whatsapp",
    accountId: params.accountId,
    peer: peer,
  });
  return {
    sessionKey: baseSessionKey,
    baseSessionKey: baseSessionKey,
    peer: peer,
    chatType: isGroup ? "group" : "direct",
    from: normalized,
    to: normalized,
  };
}
function resolveSignalSession(params) {
  var stripped = stripProviderPrefix(params.target, "signal");
  var lowered = stripped.toLowerCase();
  if (lowered.startsWith("group:")) {
    var groupId = stripped.slice("group:".length).trim();
    if (!groupId) {
      return null;
    }
    var peer_1 = { kind: "group", id: groupId };
    var baseSessionKey_1 = buildBaseSessionKey({
      cfg: params.cfg,
      agentId: params.agentId,
      channel: "signal",
      accountId: params.accountId,
      peer: peer_1,
    });
    return {
      sessionKey: baseSessionKey_1,
      baseSessionKey: baseSessionKey_1,
      peer: peer_1,
      chatType: "group",
      from: "group:".concat(groupId),
      to: "group:".concat(groupId),
    };
  }
  var recipient = stripped.trim();
  if (lowered.startsWith("username:")) {
    recipient = stripped.slice("username:".length).trim();
  } else if (lowered.startsWith("u:")) {
    recipient = stripped.slice("u:".length).trim();
  }
  if (!recipient) {
    return null;
  }
  var uuidCandidate = recipient.toLowerCase().startsWith("uuid:")
    ? recipient.slice("uuid:".length)
    : recipient;
  var sender = (0, identity_js_1.resolveSignalSender)({
    sourceUuid: looksLikeUuid(uuidCandidate) ? uuidCandidate : null,
    sourceNumber: looksLikeUuid(uuidCandidate) ? null : recipient,
  });
  var peerId = sender ? (0, identity_js_1.resolveSignalPeerId)(sender) : recipient;
  var displayRecipient = sender ? (0, identity_js_1.resolveSignalRecipient)(sender) : recipient;
  var peer = { kind: "dm", id: peerId };
  var baseSessionKey = buildBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "signal",
    accountId: params.accountId,
    peer: peer,
  });
  return {
    sessionKey: baseSessionKey,
    baseSessionKey: baseSessionKey,
    peer: peer,
    chatType: "direct",
    from: "signal:".concat(displayRecipient),
    to: "signal:".concat(displayRecipient),
  };
}
function resolveIMessageSession(params) {
  var parsed = (0, targets_js_2.parseIMessageTarget)(params.target);
  if (parsed.kind === "handle") {
    var handle = (0, targets_js_2.normalizeIMessageHandle)(parsed.to);
    if (!handle) {
      return null;
    }
    var peer_2 = { kind: "dm", id: handle };
    var baseSessionKey_2 = buildBaseSessionKey({
      cfg: params.cfg,
      agentId: params.agentId,
      channel: "imessage",
      accountId: params.accountId,
      peer: peer_2,
    });
    return {
      sessionKey: baseSessionKey_2,
      baseSessionKey: baseSessionKey_2,
      peer: peer_2,
      chatType: "direct",
      from: "imessage:".concat(handle),
      to: "imessage:".concat(handle),
    };
  }
  var peerId =
    parsed.kind === "chat_id"
      ? String(parsed.chatId)
      : parsed.kind === "chat_guid"
        ? parsed.chatGuid
        : parsed.chatIdentifier;
  if (!peerId) {
    return null;
  }
  var peer = { kind: "group", id: peerId };
  var baseSessionKey = buildBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "imessage",
    accountId: params.accountId,
    peer: peer,
  });
  var toPrefix =
    parsed.kind === "chat_id"
      ? "chat_id"
      : parsed.kind === "chat_guid"
        ? "chat_guid"
        : "chat_identifier";
  return {
    sessionKey: baseSessionKey,
    baseSessionKey: baseSessionKey,
    peer: peer,
    chatType: "group",
    from: "imessage:group:".concat(peerId),
    to: "".concat(toPrefix, ":").concat(peerId),
  };
}
function resolveMatrixSession(params) {
  var _a;
  var stripped = stripProviderPrefix(params.target, "matrix");
  var isUser =
    ((_a = params.resolvedTarget) === null || _a === void 0 ? void 0 : _a.kind) === "user" ||
    stripped.startsWith("@") ||
    /^user:/i.test(stripped);
  var rawId = stripKindPrefix(stripped);
  if (!rawId) {
    return null;
  }
  var peer = { kind: isUser ? "dm" : "channel", id: rawId };
  var baseSessionKey = buildBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "matrix",
    accountId: params.accountId,
    peer: peer,
  });
  return {
    sessionKey: baseSessionKey,
    baseSessionKey: baseSessionKey,
    peer: peer,
    chatType: isUser ? "direct" : "channel",
    from: isUser ? "matrix:".concat(rawId) : "matrix:channel:".concat(rawId),
    to: "room:".concat(rawId),
  };
}
function resolveMSTeamsSession(params) {
  var _a;
  var trimmed = params.target.trim();
  if (!trimmed) {
    return null;
  }
  trimmed = trimmed.replace(/^(msteams|teams):/i, "").trim();
  var lower = trimmed.toLowerCase();
  var isUser = lower.startsWith("user:");
  var rawId = stripKindPrefix(trimmed);
  if (!rawId) {
    return null;
  }
  var conversationId = (_a = rawId.split(";")[0]) !== null && _a !== void 0 ? _a : rawId;
  var isChannel = !isUser && /@thread\.tacv2/i.test(conversationId);
  var peer = {
    kind: isUser ? "dm" : isChannel ? "channel" : "group",
    id: conversationId,
  };
  var baseSessionKey = buildBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "msteams",
    accountId: params.accountId,
    peer: peer,
  });
  return {
    sessionKey: baseSessionKey,
    baseSessionKey: baseSessionKey,
    peer: peer,
    chatType: isUser ? "direct" : isChannel ? "channel" : "group",
    from: isUser
      ? "msteams:".concat(conversationId)
      : isChannel
        ? "msteams:channel:".concat(conversationId)
        : "msteams:group:".concat(conversationId),
    to: isUser ? "user:".concat(conversationId) : "conversation:".concat(conversationId),
  };
}
function resolveMattermostSession(params) {
  var _a;
  var trimmed = params.target.trim();
  if (!trimmed) {
    return null;
  }
  trimmed = trimmed.replace(/^mattermost:/i, "").trim();
  var lower = trimmed.toLowerCase();
  var isUser = lower.startsWith("user:") || trimmed.startsWith("@");
  if (trimmed.startsWith("@")) {
    trimmed = trimmed.slice(1).trim();
  }
  var rawId = stripKindPrefix(trimmed);
  if (!rawId) {
    return null;
  }
  var peer = { kind: isUser ? "dm" : "channel", id: rawId };
  var baseSessionKey = buildBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "mattermost",
    accountId: params.accountId,
    peer: peer,
  });
  var threadId = normalizeThreadId(
    (_a = params.replyToId) !== null && _a !== void 0 ? _a : params.threadId,
  );
  var threadKeys = (0, session_key_js_1.resolveThreadSessionKeys)({
    baseSessionKey: baseSessionKey,
    threadId: threadId,
  });
  return {
    sessionKey: threadKeys.sessionKey,
    baseSessionKey: baseSessionKey,
    peer: peer,
    chatType: isUser ? "direct" : "channel",
    from: isUser ? "mattermost:".concat(rawId) : "mattermost:channel:".concat(rawId),
    to: isUser ? "user:".concat(rawId) : "channel:".concat(rawId),
    threadId: threadId,
  };
}
function resolveBlueBubblesSession(params) {
  var stripped = stripProviderPrefix(params.target, "bluebubbles");
  var lower = stripped.toLowerCase();
  var isGroup =
    lower.startsWith("chat_id:") ||
    lower.startsWith("chat_guid:") ||
    lower.startsWith("chat_identifier:") ||
    lower.startsWith("group:");
  var rawPeerId = isGroup
    ? stripKindPrefix(stripped)
    : stripped.replace(/^(imessage|sms|auto):/i, "");
  // BlueBubbles inbound group ids omit chat_* prefixes; strip them to align sessions.
  var peerId = isGroup
    ? rawPeerId.replace(/^(chat_id|chat_guid|chat_identifier):/i, "")
    : rawPeerId;
  if (!peerId) {
    return null;
  }
  var peer = {
    kind: isGroup ? "group" : "dm",
    id: peerId,
  };
  var baseSessionKey = buildBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "bluebubbles",
    accountId: params.accountId,
    peer: peer,
  });
  return {
    sessionKey: baseSessionKey,
    baseSessionKey: baseSessionKey,
    peer: peer,
    chatType: isGroup ? "group" : "direct",
    from: isGroup ? "group:".concat(peerId) : "bluebubbles:".concat(peerId),
    to: "bluebubbles:".concat(stripped),
  };
}
function resolveNextcloudTalkSession(params) {
  var trimmed = params.target.trim();
  if (!trimmed) {
    return null;
  }
  trimmed = trimmed.replace(/^(nextcloud-talk|nc-talk|nc):/i, "").trim();
  trimmed = trimmed.replace(/^room:/i, "").trim();
  if (!trimmed) {
    return null;
  }
  var peer = { kind: "group", id: trimmed };
  var baseSessionKey = buildBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "nextcloud-talk",
    accountId: params.accountId,
    peer: peer,
  });
  return {
    sessionKey: baseSessionKey,
    baseSessionKey: baseSessionKey,
    peer: peer,
    chatType: "group",
    from: "nextcloud-talk:room:".concat(trimmed),
    to: "nextcloud-talk:".concat(trimmed),
  };
}
function resolveZaloSession(params) {
  var trimmed = stripProviderPrefix(params.target, "zalo")
    .replace(/^(zl):/i, "")
    .trim();
  if (!trimmed) {
    return null;
  }
  var isGroup = trimmed.toLowerCase().startsWith("group:");
  var peerId = stripKindPrefix(trimmed);
  var peer = { kind: isGroup ? "group" : "dm", id: peerId };
  var baseSessionKey = buildBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "zalo",
    accountId: params.accountId,
    peer: peer,
  });
  return {
    sessionKey: baseSessionKey,
    baseSessionKey: baseSessionKey,
    peer: peer,
    chatType: isGroup ? "group" : "direct",
    from: isGroup ? "zalo:group:".concat(peerId) : "zalo:".concat(peerId),
    to: "zalo:".concat(peerId),
  };
}
function resolveZalouserSession(params) {
  var trimmed = stripProviderPrefix(params.target, "zalouser")
    .replace(/^(zlu):/i, "")
    .trim();
  if (!trimmed) {
    return null;
  }
  var isGroup = trimmed.toLowerCase().startsWith("group:");
  var peerId = stripKindPrefix(trimmed);
  // Keep DM vs group aligned with inbound sessions for Zalo Personal.
  var peer = { kind: isGroup ? "group" : "dm", id: peerId };
  var baseSessionKey = buildBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "zalouser",
    accountId: params.accountId,
    peer: peer,
  });
  return {
    sessionKey: baseSessionKey,
    baseSessionKey: baseSessionKey,
    peer: peer,
    chatType: isGroup ? "group" : "direct",
    from: isGroup ? "zalouser:group:".concat(peerId) : "zalouser:".concat(peerId),
    to: "zalouser:".concat(peerId),
  };
}
function resolveNostrSession(params) {
  var trimmed = stripProviderPrefix(params.target, "nostr").trim();
  if (!trimmed) {
    return null;
  }
  var peer = { kind: "dm", id: trimmed };
  var baseSessionKey = buildBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "nostr",
    accountId: params.accountId,
    peer: peer,
  });
  return {
    sessionKey: baseSessionKey,
    baseSessionKey: baseSessionKey,
    peer: peer,
    chatType: "direct",
    from: "nostr:".concat(trimmed),
    to: "nostr:".concat(trimmed),
  };
}
function normalizeTlonShip(raw) {
  var trimmed = raw.trim();
  if (!trimmed) {
    return trimmed;
  }
  return trimmed.startsWith("~") ? trimmed : "~".concat(trimmed);
}
function resolveTlonSession(params) {
  var trimmed = stripProviderPrefix(params.target, "tlon");
  trimmed = trimmed.trim();
  if (!trimmed) {
    return null;
  }
  var lower = trimmed.toLowerCase();
  var isGroup =
    lower.startsWith("group:") || lower.startsWith("room:") || lower.startsWith("chat/");
  var peerId = trimmed;
  if (lower.startsWith("group:") || lower.startsWith("room:")) {
    peerId = trimmed.replace(/^(group|room):/i, "").trim();
    if (!peerId.startsWith("chat/")) {
      var parts = peerId.split("/").filter(Boolean);
      if (parts.length === 2) {
        peerId = "chat/".concat(normalizeTlonShip(parts[0]), "/").concat(parts[1]);
      }
    }
    isGroup = true;
  } else if (lower.startsWith("dm:")) {
    peerId = normalizeTlonShip(trimmed.slice("dm:".length));
    isGroup = false;
  } else if (lower.startsWith("chat/")) {
    peerId = trimmed;
    isGroup = true;
  } else if (trimmed.includes("/")) {
    var parts = trimmed.split("/").filter(Boolean);
    if (parts.length === 2) {
      peerId = "chat/".concat(normalizeTlonShip(parts[0]), "/").concat(parts[1]);
      isGroup = true;
    }
  } else {
    peerId = normalizeTlonShip(trimmed);
  }
  var peer = { kind: isGroup ? "group" : "dm", id: peerId };
  var baseSessionKey = buildBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "tlon",
    accountId: params.accountId,
    peer: peer,
  });
  return {
    sessionKey: baseSessionKey,
    baseSessionKey: baseSessionKey,
    peer: peer,
    chatType: isGroup ? "group" : "direct",
    from: isGroup ? "tlon:group:".concat(peerId) : "tlon:".concat(peerId),
    to: "tlon:".concat(peerId),
  };
}
function resolveFallbackSession(params) {
  var trimmed = stripProviderPrefix(params.target, params.channel).trim();
  if (!trimmed) {
    return null;
  }
  var peerKind = inferPeerKind({
    channel: params.channel,
    resolvedTarget: params.resolvedTarget,
  });
  var peerId = stripKindPrefix(trimmed);
  if (!peerId) {
    return null;
  }
  var peer = { kind: peerKind, id: peerId };
  var baseSessionKey = buildBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: params.channel,
    peer: peer,
  });
  var chatType = peerKind === "dm" ? "direct" : peerKind === "channel" ? "channel" : "group";
  var from =
    peerKind === "dm"
      ? "".concat(params.channel, ":").concat(peerId)
      : "".concat(params.channel, ":").concat(peerKind, ":").concat(peerId);
  var toPrefix = peerKind === "dm" ? "user" : "channel";
  return {
    sessionKey: baseSessionKey,
    baseSessionKey: baseSessionKey,
    peer: peer,
    chatType: chatType,
    from: from,
    to: "".concat(toPrefix, ":").concat(peerId),
  };
}
function resolveOutboundSessionRoute(params) {
  return __awaiter(this, void 0, void 0, function () {
    var target, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          target = params.target.trim();
          if (!target) {
            return [2 /*return*/, null];
          }
          _a = params.channel;
          switch (_a) {
            case "slack":
              return [3 /*break*/, 1];
            case "discord":
              return [3 /*break*/, 3];
            case "telegram":
              return [3 /*break*/, 4];
            case "whatsapp":
              return [3 /*break*/, 5];
            case "signal":
              return [3 /*break*/, 6];
            case "imessage":
              return [3 /*break*/, 7];
            case "matrix":
              return [3 /*break*/, 8];
            case "msteams":
              return [3 /*break*/, 9];
            case "mattermost":
              return [3 /*break*/, 10];
            case "bluebubbles":
              return [3 /*break*/, 11];
            case "nextcloud-talk":
              return [3 /*break*/, 12];
            case "zalo":
              return [3 /*break*/, 13];
            case "zalouser":
              return [3 /*break*/, 14];
            case "nostr":
              return [3 /*break*/, 15];
            case "tlon":
              return [3 /*break*/, 16];
          }
          return [3 /*break*/, 17];
        case 1:
          return [
            4 /*yield*/,
            resolveSlackSession(__assign(__assign({}, params), { target: target })),
          ];
        case 2:
          return [2 /*return*/, _b.sent()];
        case 3:
          return [
            2 /*return*/,
            resolveDiscordSession(__assign(__assign({}, params), { target: target })),
          ];
        case 4:
          return [
            2 /*return*/,
            resolveTelegramSession(__assign(__assign({}, params), { target: target })),
          ];
        case 5:
          return [
            2 /*return*/,
            resolveWhatsAppSession(__assign(__assign({}, params), { target: target })),
          ];
        case 6:
          return [
            2 /*return*/,
            resolveSignalSession(__assign(__assign({}, params), { target: target })),
          ];
        case 7:
          return [
            2 /*return*/,
            resolveIMessageSession(__assign(__assign({}, params), { target: target })),
          ];
        case 8:
          return [
            2 /*return*/,
            resolveMatrixSession(__assign(__assign({}, params), { target: target })),
          ];
        case 9:
          return [
            2 /*return*/,
            resolveMSTeamsSession(__assign(__assign({}, params), { target: target })),
          ];
        case 10:
          return [
            2 /*return*/,
            resolveMattermostSession(__assign(__assign({}, params), { target: target })),
          ];
        case 11:
          return [
            2 /*return*/,
            resolveBlueBubblesSession(__assign(__assign({}, params), { target: target })),
          ];
        case 12:
          return [
            2 /*return*/,
            resolveNextcloudTalkSession(__assign(__assign({}, params), { target: target })),
          ];
        case 13:
          return [
            2 /*return*/,
            resolveZaloSession(__assign(__assign({}, params), { target: target })),
          ];
        case 14:
          return [
            2 /*return*/,
            resolveZalouserSession(__assign(__assign({}, params), { target: target })),
          ];
        case 15:
          return [
            2 /*return*/,
            resolveNostrSession(__assign(__assign({}, params), { target: target })),
          ];
        case 16:
          return [
            2 /*return*/,
            resolveTlonSession(__assign(__assign({}, params), { target: target })),
          ];
        case 17:
          return [
            2 /*return*/,
            resolveFallbackSession(__assign(__assign({}, params), { target: target })),
          ];
      }
    });
  });
}
function ensureOutboundSessionEntry(params) {
  return __awaiter(this, void 0, void 0, function () {
    var storePath, ctx, _a;
    var _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          storePath = (0, sessions_js_1.resolveStorePath)(
            (_b = params.cfg.session) === null || _b === void 0 ? void 0 : _b.store,
            {
              agentId: params.agentId,
            },
          );
          ctx = {
            From: params.route.from,
            To: params.route.to,
            SessionKey: params.route.sessionKey,
            AccountId: (_c = params.accountId) !== null && _c !== void 0 ? _c : undefined,
            ChatType: params.route.chatType,
            Provider: params.channel,
            Surface: params.channel,
            MessageThreadId: params.route.threadId,
            OriginatingChannel: params.channel,
            OriginatingTo: params.route.to,
          };
          _d.label = 1;
        case 1:
          _d.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            (0, sessions_js_1.recordSessionMetaFromInbound)({
              storePath: storePath,
              sessionKey: params.route.sessionKey,
              ctx: ctx,
            }),
          ];
        case 2:
          _d.sent();
          return [3 /*break*/, 4];
        case 3:
          _a = _d.sent();
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
