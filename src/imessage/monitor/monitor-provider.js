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
exports.monitorIMessageProvider = monitorIMessageProvider;
var promises_1 = require("node:fs/promises");
var identity_js_1 = require("../../agents/identity.js");
var chunk_js_1 = require("../../auto-reply/chunk.js");
var command_detection_js_1 = require("../../auto-reply/command-detection.js");
var envelope_js_1 = require("../../auto-reply/envelope.js");
var inbound_debounce_js_1 = require("../../auto-reply/inbound-debounce.js");
var dispatch_js_1 = require("../../auto-reply/dispatch.js");
var inbound_context_js_1 = require("../../auto-reply/reply/inbound-context.js");
var history_js_1 = require("../../auto-reply/reply/history.js");
var mentions_js_1 = require("../../auto-reply/reply/mentions.js");
var reply_dispatcher_js_1 = require("../../auto-reply/reply/reply-dispatcher.js");
var logging_js_1 = require("../../channels/logging.js");
var reply_prefix_js_1 = require("../../channels/reply-prefix.js");
var session_js_1 = require("../../channels/session.js");
var config_js_1 = require("../../config/config.js");
var group_policy_js_1 = require("../../config/group-policy.js");
var sessions_js_1 = require("../../config/sessions.js");
var globals_js_1 = require("../../globals.js");
var transport_ready_js_1 = require("../../infra/transport-ready.js");
var constants_js_1 = require("../../media/constants.js");
var pairing_messages_js_1 = require("../../pairing/pairing-messages.js");
var pairing_store_js_1 = require("../../pairing/pairing-store.js");
var resolve_route_js_1 = require("../../routing/resolve-route.js");
var utils_js_1 = require("../../utils.js");
var command_gating_js_1 = require("../../channels/command-gating.js");
var accounts_js_1 = require("../accounts.js");
var client_js_1 = require("../client.js");
var probe_js_1 = require("../probe.js");
var send_js_1 = require("../send.js");
var targets_js_1 = require("../targets.js");
var deliver_js_1 = require("./deliver.js");
var runtime_js_1 = require("./runtime.js");
/**
 * Try to detect remote host from an SSH wrapper script like:
 *   exec ssh -T openclaw@192.168.64.3 /opt/homebrew/bin/imsg "$@"
 *   exec ssh -T mac-mini imsg "$@"
 * Returns the user@host or host portion if found, undefined otherwise.
 */
function detectRemoteHostFromCliPath(cliPath) {
  return __awaiter(this, void 0, void 0, function () {
    var expanded, content, userHostMatch, hostOnlyMatch, _a;
    var _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          _c.trys.push([0, 2, , 3]);
          expanded = cliPath.startsWith("~")
            ? cliPath.replace(/^~/, (_b = process.env.HOME) !== null && _b !== void 0 ? _b : "")
            : cliPath;
          return [4 /*yield*/, promises_1.default.readFile(expanded, "utf8")];
        case 1:
          content = _c.sent();
          userHostMatch = content.match(/\bssh\b[^\n]*?\s+([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+)/);
          if (userHostMatch) {
            return [2 /*return*/, userHostMatch[1]];
          }
          hostOnlyMatch = content.match(/\bssh\b[^\n]*?\s+([a-zA-Z][a-zA-Z0-9._-]*)\s+\S*\bimsg\b/);
          return [
            2 /*return*/,
            hostOnlyMatch === null || hostOnlyMatch === void 0 ? void 0 : hostOnlyMatch[1],
          ];
        case 2:
          _a = _c.sent();
          return [2 /*return*/, undefined];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function normalizeReplyField(value) {
  if (typeof value === "string") {
    var trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return undefined;
}
function describeReplyContext(message) {
  var body = normalizeReplyField(message.reply_to_text);
  if (!body) {
    return null;
  }
  var id = normalizeReplyField(message.reply_to_id);
  var sender = normalizeReplyField(message.reply_to_sender);
  return { body: body, id: id, sender: sender };
}
function monitorIMessageProvider() {
  return __awaiter(this, arguments, void 0, function (opts) {
    function handleMessageNow(message) {
      return __awaiter(this, void 0, void 0, function () {
        var senderRaw,
          sender,
          senderNormalized,
          chatId,
          chatGuid,
          chatIdentifier,
          groupIdCandidate,
          groupListPolicy,
          treatAsGroupByConfig,
          isGroup,
          groupId,
          storeAllowFrom,
          effectiveDmAllowFrom,
          effectiveGroupAllowFrom,
          allowed,
          dmHasWildcard,
          dmAuthorized,
          senderId,
          _a,
          code,
          created,
          err_2,
          route,
          mentionRegexes,
          messageText,
          attachments,
          validAttachments,
          firstAttachment,
          mediaPath,
          mediaType,
          mediaPaths,
          mediaTypes,
          kind,
          placeholder,
          bodyText,
          replyContext,
          createdAt,
          historyKey,
          mentioned,
          requireMention,
          canDetectMention,
          useAccessGroups,
          ownerAllowedForCommands,
          groupAllowedForCommands,
          hasControlCommandInMessage,
          commandGate,
          commandAuthorized,
          shouldBypassMention,
          effectiveWasMentioned,
          chatTarget,
          fromLabel,
          storePath,
          envelopeOptions,
          previousTimestamp,
          replySuffix,
          body,
          combinedBody,
          imessageTo,
          ctxPayload,
          updateTarget,
          preview,
          prefixContext,
          dispatcher,
          queuedFinal;
        var _this = this;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        return __generator(this, function (_u) {
          switch (_u.label) {
            case 0:
              senderRaw = (_b = message.sender) !== null && _b !== void 0 ? _b : "";
              sender = senderRaw.trim();
              if (!sender) {
                return [2 /*return*/];
              }
              senderNormalized = (0, targets_js_1.normalizeIMessageHandle)(sender);
              if (message.is_from_me) {
                return [2 /*return*/];
              }
              chatId = (_c = message.chat_id) !== null && _c !== void 0 ? _c : undefined;
              chatGuid = (_d = message.chat_guid) !== null && _d !== void 0 ? _d : undefined;
              chatIdentifier =
                (_e = message.chat_identifier) !== null && _e !== void 0 ? _e : undefined;
              groupIdCandidate = chatId !== undefined ? String(chatId) : undefined;
              groupListPolicy = groupIdCandidate
                ? (0, group_policy_js_1.resolveChannelGroupPolicy)({
                    cfg: cfg,
                    channel: "imessage",
                    accountId: accountInfo.accountId,
                    groupId: groupIdCandidate,
                  })
                : {
                    allowlistEnabled: false,
                    allowed: true,
                    groupConfig: undefined,
                    defaultConfig: undefined,
                  };
              treatAsGroupByConfig = Boolean(
                groupIdCandidate && groupListPolicy.allowlistEnabled && groupListPolicy.groupConfig,
              );
              isGroup = Boolean(message.is_group) || treatAsGroupByConfig;
              if (isGroup && !chatId) {
                return [2 /*return*/];
              }
              groupId = isGroup ? groupIdCandidate : undefined;
              return [
                4 /*yield*/,
                (0, pairing_store_js_1.readChannelAllowFromStore)("imessage").catch(function () {
                  return [];
                }),
              ];
            case 1:
              storeAllowFrom = _u.sent();
              effectiveDmAllowFrom = Array.from(
                new Set(__spreadArray(__spreadArray([], allowFrom, true), storeAllowFrom, true)),
              )
                .map(function (v) {
                  return String(v).trim();
                })
                .filter(Boolean);
              effectiveGroupAllowFrom = Array.from(
                new Set(
                  __spreadArray(__spreadArray([], groupAllowFrom, true), storeAllowFrom, true),
                ),
              )
                .map(function (v) {
                  return String(v).trim();
                })
                .filter(Boolean);
              if (isGroup) {
                if (groupPolicy === "disabled") {
                  (0, globals_js_1.logVerbose)(
                    "Blocked iMessage group message (groupPolicy: disabled)",
                  );
                  return [2 /*return*/];
                }
                if (groupPolicy === "allowlist") {
                  if (effectiveGroupAllowFrom.length === 0) {
                    (0, globals_js_1.logVerbose)(
                      "Blocked iMessage group message (groupPolicy: allowlist, no groupAllowFrom)",
                    );
                    return [2 /*return*/];
                  }
                  allowed = (0, targets_js_1.isAllowedIMessageSender)({
                    allowFrom: effectiveGroupAllowFrom,
                    sender: sender,
                    chatId: chatId !== null && chatId !== void 0 ? chatId : undefined,
                    chatGuid: chatGuid,
                    chatIdentifier: chatIdentifier,
                  });
                  if (!allowed) {
                    (0, globals_js_1.logVerbose)(
                      "Blocked iMessage sender ".concat(sender, " (not in groupAllowFrom)"),
                    );
                    return [2 /*return*/];
                  }
                }
                if (groupListPolicy.allowlistEnabled && !groupListPolicy.allowed) {
                  (0, globals_js_1.logVerbose)(
                    "imessage: skipping group message (".concat(
                      groupId !== null && groupId !== void 0 ? groupId : "unknown",
                      ") not in allowlist",
                    ),
                  );
                  return [2 /*return*/];
                }
              }
              dmHasWildcard = effectiveDmAllowFrom.includes("*");
              dmAuthorized =
                dmPolicy === "open"
                  ? true
                  : dmHasWildcard ||
                    (effectiveDmAllowFrom.length > 0 &&
                      (0, targets_js_1.isAllowedIMessageSender)({
                        allowFrom: effectiveDmAllowFrom,
                        sender: sender,
                        chatId: chatId !== null && chatId !== void 0 ? chatId : undefined,
                        chatGuid: chatGuid,
                        chatIdentifier: chatIdentifier,
                      }));
              if (!!isGroup) {
                return [3 /*break*/, 9];
              }
              if (dmPolicy === "disabled") {
                return [2 /*return*/];
              }
              if (!!dmAuthorized) {
                return [3 /*break*/, 9];
              }
              if (!(dmPolicy === "pairing")) {
                return [3 /*break*/, 7];
              }
              senderId = (0, targets_js_1.normalizeIMessageHandle)(sender);
              return [
                4 /*yield*/,
                (0, pairing_store_js_1.upsertChannelPairingRequest)({
                  channel: "imessage",
                  id: senderId,
                  meta: {
                    sender: senderId,
                    chatId: chatId ? String(chatId) : undefined,
                  },
                }),
              ];
            case 2:
              ((_a = _u.sent()), (code = _a.code), (created = _a.created));
              if (!created) {
                return [3 /*break*/, 6];
              }
              (0, globals_js_1.logVerbose)("imessage pairing request sender=".concat(senderId));
              _u.label = 3;
            case 3:
              _u.trys.push([3, 5, , 6]);
              return [
                4 /*yield*/,
                (0, send_js_1.sendMessageIMessage)(
                  sender,
                  (0, pairing_messages_js_1.buildPairingReply)({
                    channel: "imessage",
                    idLine: "Your iMessage sender id: ".concat(senderId),
                    code: code,
                  }),
                  __assign(
                    { client: client, maxBytes: mediaMaxBytes, accountId: accountInfo.accountId },
                    chatId ? { chatId: chatId } : {},
                  ),
                ),
              ];
            case 4:
              _u.sent();
              return [3 /*break*/, 6];
            case 5:
              err_2 = _u.sent();
              (0, globals_js_1.logVerbose)(
                "imessage pairing reply failed for ".concat(senderId, ": ").concat(String(err_2)),
              );
              return [3 /*break*/, 6];
            case 6:
              return [3 /*break*/, 8];
            case 7:
              (0, globals_js_1.logVerbose)(
                "Blocked iMessage sender ".concat(sender, " (dmPolicy=").concat(dmPolicy, ")"),
              );
              _u.label = 8;
            case 8:
              return [2 /*return*/];
            case 9:
              route = (0, resolve_route_js_1.resolveAgentRoute)({
                cfg: cfg,
                channel: "imessage",
                accountId: accountInfo.accountId,
                peer: {
                  kind: isGroup ? "group" : "dm",
                  id: isGroup
                    ? String(chatId !== null && chatId !== void 0 ? chatId : "unknown")
                    : (0, targets_js_1.normalizeIMessageHandle)(sender),
                },
              });
              mentionRegexes = (0, mentions_js_1.buildMentionRegexes)(cfg, route.agentId);
              messageText = ((_f = message.text) !== null && _f !== void 0 ? _f : "").trim();
              attachments = includeAttachments
                ? (_g = message.attachments) !== null && _g !== void 0
                  ? _g
                  : []
                : [];
              validAttachments = attachments.filter(function (entry) {
                return (
                  (entry === null || entry === void 0 ? void 0 : entry.original_path) &&
                  !(entry === null || entry === void 0 ? void 0 : entry.missing)
                );
              });
              firstAttachment = validAttachments[0];
              mediaPath =
                (_h =
                  firstAttachment === null || firstAttachment === void 0
                    ? void 0
                    : firstAttachment.original_path) !== null && _h !== void 0
                  ? _h
                  : undefined;
              mediaType =
                (_j =
                  firstAttachment === null || firstAttachment === void 0
                    ? void 0
                    : firstAttachment.mime_type) !== null && _j !== void 0
                  ? _j
                  : undefined;
              mediaPaths = validAttachments
                .map(function (a) {
                  return a.original_path;
                })
                .filter(Boolean);
              mediaTypes = validAttachments.map(function (a) {
                var _a;
                return (_a = a.mime_type) !== null && _a !== void 0 ? _a : undefined;
              });
              kind = (0, constants_js_1.mediaKindFromMime)(
                mediaType !== null && mediaType !== void 0 ? mediaType : undefined,
              );
              placeholder = kind
                ? "<media:".concat(kind, ">")
                : (attachments === null || attachments === void 0 ? void 0 : attachments.length)
                  ? "<media:attachment>"
                  : "";
              bodyText = messageText || placeholder;
              if (!bodyText) {
                return [2 /*return*/];
              }
              replyContext = describeReplyContext(message);
              createdAt = message.created_at ? Date.parse(message.created_at) : undefined;
              historyKey = isGroup
                ? String(
                    (_l =
                      (_k = chatId !== null && chatId !== void 0 ? chatId : chatGuid) !== null &&
                      _k !== void 0
                        ? _k
                        : chatIdentifier) !== null && _l !== void 0
                      ? _l
                      : "unknown",
                  )
                : undefined;
              mentioned = isGroup
                ? (0, mentions_js_1.matchesMentionPatterns)(messageText, mentionRegexes)
                : true;
              requireMention = (0, group_policy_js_1.resolveChannelGroupRequireMention)({
                cfg: cfg,
                channel: "imessage",
                accountId: accountInfo.accountId,
                groupId: groupId,
                requireMentionOverride: opts.requireMention,
                overrideOrder: "before-config",
              });
              canDetectMention = mentionRegexes.length > 0;
              useAccessGroups =
                ((_m = cfg.commands) === null || _m === void 0 ? void 0 : _m.useAccessGroups) !==
                false;
              ownerAllowedForCommands =
                effectiveDmAllowFrom.length > 0
                  ? (0, targets_js_1.isAllowedIMessageSender)({
                      allowFrom: effectiveDmAllowFrom,
                      sender: sender,
                      chatId: chatId !== null && chatId !== void 0 ? chatId : undefined,
                      chatGuid: chatGuid,
                      chatIdentifier: chatIdentifier,
                    })
                  : false;
              groupAllowedForCommands =
                effectiveGroupAllowFrom.length > 0
                  ? (0, targets_js_1.isAllowedIMessageSender)({
                      allowFrom: effectiveGroupAllowFrom,
                      sender: sender,
                      chatId: chatId !== null && chatId !== void 0 ? chatId : undefined,
                      chatGuid: chatGuid,
                      chatIdentifier: chatIdentifier,
                    })
                  : false;
              hasControlCommandInMessage = (0, command_detection_js_1.hasControlCommand)(
                messageText,
                cfg,
              );
              commandGate = (0, command_gating_js_1.resolveControlCommandGate)({
                useAccessGroups: useAccessGroups,
                authorizers: [
                  { configured: effectiveDmAllowFrom.length > 0, allowed: ownerAllowedForCommands },
                  {
                    configured: effectiveGroupAllowFrom.length > 0,
                    allowed: groupAllowedForCommands,
                  },
                ],
                allowTextCommands: true,
                hasControlCommand: hasControlCommandInMessage,
              });
              commandAuthorized = isGroup ? commandGate.commandAuthorized : dmAuthorized;
              if (isGroup && commandGate.shouldBlock) {
                (0, logging_js_1.logInboundDrop)({
                  log: globals_js_1.logVerbose,
                  channel: "imessage",
                  reason: "control command (unauthorized)",
                  target: sender,
                });
                return [2 /*return*/];
              }
              shouldBypassMention =
                isGroup &&
                requireMention &&
                !mentioned &&
                commandAuthorized &&
                hasControlCommandInMessage;
              effectiveWasMentioned = mentioned || shouldBypassMention;
              if (
                isGroup &&
                requireMention &&
                canDetectMention &&
                !mentioned &&
                !shouldBypassMention
              ) {
                (0, globals_js_1.logVerbose)("imessage: skipping group message (no mention)");
                (0, history_js_1.recordPendingHistoryEntryIfEnabled)({
                  historyMap: groupHistories,
                  historyKey: historyKey !== null && historyKey !== void 0 ? historyKey : "",
                  limit: historyLimit,
                  entry: historyKey
                    ? {
                        sender: senderNormalized,
                        body: bodyText,
                        timestamp: createdAt,
                        messageId: message.id ? String(message.id) : undefined,
                      }
                    : null,
                });
                return [2 /*return*/];
              }
              chatTarget = (0, targets_js_1.formatIMessageChatTarget)(chatId);
              fromLabel = (0, envelope_js_1.formatInboundFromLabel)({
                isGroup: isGroup,
                groupLabel: (_o = message.chat_name) !== null && _o !== void 0 ? _o : undefined,
                groupId: chatId !== undefined ? String(chatId) : "unknown",
                groupFallback: "Group",
                directLabel: senderNormalized,
                directId: sender,
              });
              storePath = (0, sessions_js_1.resolveStorePath)(
                (_p = cfg.session) === null || _p === void 0 ? void 0 : _p.store,
                {
                  agentId: route.agentId,
                },
              );
              envelopeOptions = (0, envelope_js_1.resolveEnvelopeFormatOptions)(cfg);
              previousTimestamp = (0, sessions_js_1.readSessionUpdatedAt)({
                storePath: storePath,
                sessionKey: route.sessionKey,
              });
              replySuffix = replyContext
                ? "\n\n[Replying to "
                    .concat(
                      (_q = replyContext.sender) !== null && _q !== void 0 ? _q : "unknown sender",
                    )
                    .concat(replyContext.id ? " id:".concat(replyContext.id) : "", "]\n")
                    .concat(replyContext.body, "\n[/Replying]")
                : "";
              body = (0, envelope_js_1.formatInboundEnvelope)({
                channel: "iMessage",
                from: fromLabel,
                timestamp: createdAt,
                body: "".concat(bodyText).concat(replySuffix),
                chatType: isGroup ? "group" : "direct",
                sender: { name: senderNormalized, id: sender },
                previousTimestamp: previousTimestamp,
                envelope: envelopeOptions,
              });
              combinedBody = body;
              if (isGroup && historyKey) {
                combinedBody = (0, history_js_1.buildPendingHistoryContextFromMap)({
                  historyMap: groupHistories,
                  historyKey: historyKey,
                  limit: historyLimit,
                  currentMessage: combinedBody,
                  formatEntry: function (entry) {
                    return (0, envelope_js_1.formatInboundEnvelope)({
                      channel: "iMessage",
                      from: fromLabel,
                      timestamp: entry.timestamp,
                      body: ""
                        .concat(entry.body)
                        .concat(entry.messageId ? " [id:".concat(entry.messageId, "]") : ""),
                      chatType: "group",
                      senderLabel: entry.sender,
                      envelope: envelopeOptions,
                    });
                  },
                });
              }
              imessageTo = (isGroup ? chatTarget : undefined) || "imessage:".concat(sender);
              ctxPayload = (0, inbound_context_js_1.finalizeInboundContext)({
                Body: combinedBody,
                RawBody: bodyText,
                CommandBody: bodyText,
                From: isGroup
                  ? "imessage:group:".concat(
                      chatId !== null && chatId !== void 0 ? chatId : "unknown",
                    )
                  : "imessage:".concat(sender),
                To: imessageTo,
                SessionKey: route.sessionKey,
                AccountId: route.accountId,
                ChatType: isGroup ? "group" : "direct",
                ConversationLabel: fromLabel,
                GroupSubject: isGroup
                  ? (_r = message.chat_name) !== null && _r !== void 0
                    ? _r
                    : undefined
                  : undefined,
                GroupMembers: isGroup
                  ? ((_s = message.participants) !== null && _s !== void 0 ? _s : [])
                      .filter(Boolean)
                      .join(", ")
                  : undefined,
                SenderName: senderNormalized,
                SenderId: sender,
                Provider: "imessage",
                Surface: "imessage",
                MessageSid: message.id ? String(message.id) : undefined,
                ReplyToId:
                  replyContext === null || replyContext === void 0 ? void 0 : replyContext.id,
                ReplyToBody:
                  replyContext === null || replyContext === void 0 ? void 0 : replyContext.body,
                ReplyToSender:
                  replyContext === null || replyContext === void 0 ? void 0 : replyContext.sender,
                Timestamp: createdAt,
                MediaPath: mediaPath,
                MediaType: mediaType,
                MediaUrl: mediaPath,
                MediaPaths: mediaPaths.length > 0 ? mediaPaths : undefined,
                MediaTypes: mediaTypes.length > 0 ? mediaTypes : undefined,
                MediaUrls: mediaPaths.length > 0 ? mediaPaths : undefined,
                MediaRemoteHost: remoteHost,
                WasMentioned: effectiveWasMentioned,
                CommandAuthorized: commandAuthorized,
                // Originating channel for reply routing.
                OriginatingChannel: "imessage",
                OriginatingTo: imessageTo,
              });
              updateTarget = (isGroup ? chatTarget : undefined) || sender;
              return [
                4 /*yield*/,
                (0, session_js_1.recordInboundSession)({
                  storePath: storePath,
                  sessionKey:
                    (_t = ctxPayload.SessionKey) !== null && _t !== void 0 ? _t : route.sessionKey,
                  ctx: ctxPayload,
                  updateLastRoute:
                    !isGroup && updateTarget
                      ? {
                          sessionKey: route.mainSessionKey,
                          channel: "imessage",
                          to: updateTarget,
                          accountId: route.accountId,
                        }
                      : undefined,
                  onRecordError: function (err) {
                    (0, globals_js_1.logVerbose)(
                      "imessage: failed updating session meta: ".concat(String(err)),
                    );
                  },
                }),
              ];
            case 10:
              _u.sent();
              if ((0, globals_js_1.shouldLogVerbose)()) {
                preview = (0, utils_js_1.truncateUtf16Safe)(body, 200).replace(/\n/g, "\\n");
                (0, globals_js_1.logVerbose)(
                  "imessage inbound: chatId="
                    .concat(chatId !== null && chatId !== void 0 ? chatId : "unknown", " from=")
                    .concat(ctxPayload.From, " len=")
                    .concat(body.length, ' preview="')
                    .concat(preview, '"'),
                );
              }
              prefixContext = (0, reply_prefix_js_1.createReplyPrefixContext)({
                cfg: cfg,
                agentId: route.agentId,
              });
              dispatcher = (0, reply_dispatcher_js_1.createReplyDispatcher)({
                responsePrefix: prefixContext.responsePrefix,
                responsePrefixContextProvider: prefixContext.responsePrefixContextProvider,
                humanDelay: (0, identity_js_1.resolveHumanDelayConfig)(cfg, route.agentId),
                deliver: function (payload) {
                  return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [
                            4 /*yield*/,
                            (0, deliver_js_1.deliverReplies)({
                              replies: [payload],
                              target: ctxPayload.To,
                              client: client,
                              accountId: accountInfo.accountId,
                              runtime: runtime,
                              maxBytes: mediaMaxBytes,
                              textLimit: textLimit,
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
                  var _a;
                  (_a = runtime.error) === null || _a === void 0
                    ? void 0
                    : _a.call(
                        runtime,
                        (0, globals_js_1.danger)(
                          "imessage ".concat(info.kind, " reply failed: ").concat(String(err)),
                        ),
                      );
                },
              });
              return [
                4 /*yield*/,
                (0, dispatch_js_1.dispatchInboundMessage)({
                  ctx: ctxPayload,
                  cfg: cfg,
                  dispatcher: dispatcher,
                  replyOptions: {
                    disableBlockStreaming:
                      typeof accountInfo.config.blockStreaming === "boolean"
                        ? !accountInfo.config.blockStreaming
                        : undefined,
                    onModelSelected: prefixContext.onModelSelected,
                  },
                }),
              ];
            case 11:
              queuedFinal = _u.sent().queuedFinal;
              if (!queuedFinal) {
                if (isGroup && historyKey) {
                  (0, history_js_1.clearHistoryEntriesIfEnabled)({
                    historyMap: groupHistories,
                    historyKey: historyKey,
                    limit: historyLimit,
                  });
                }
                return [2 /*return*/];
              }
              if (isGroup && historyKey) {
                (0, history_js_1.clearHistoryEntriesIfEnabled)({
                  historyMap: groupHistories,
                  historyKey: historyKey,
                  limit: historyLimit,
                });
              }
              return [2 /*return*/];
          }
        });
      });
    }
    var runtime,
      cfg,
      accountInfo,
      imessageCfg,
      historyLimit,
      groupHistories,
      textLimit,
      allowFrom,
      groupAllowFrom,
      defaultGroupPolicy,
      groupPolicy,
      dmPolicy,
      includeAttachments,
      mediaMaxBytes,
      cliPath,
      dbPath,
      remoteHost,
      inboundDebounceMs,
      inboundDebouncer,
      handleMessage,
      client,
      subscriptionId,
      abort,
      onAbort,
      result,
      err_1;
    var _this = this;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_z) {
      switch (_z.label) {
        case 0:
          runtime = (0, runtime_js_1.resolveRuntime)(opts);
          cfg = (_a = opts.config) !== null && _a !== void 0 ? _a : (0, config_js_1.loadConfig)();
          accountInfo = (0, accounts_js_1.resolveIMessageAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          imessageCfg = accountInfo.config;
          historyLimit = Math.max(
            0,
            (_e =
              (_b = imessageCfg.historyLimit) !== null && _b !== void 0
                ? _b
                : (_d = (_c = cfg.messages) === null || _c === void 0 ? void 0 : _c.groupChat) ===
                      null || _d === void 0
                  ? void 0
                  : _d.historyLimit) !== null && _e !== void 0
              ? _e
              : history_js_1.DEFAULT_GROUP_HISTORY_LIMIT,
          );
          groupHistories = new Map();
          textLimit = (0, chunk_js_1.resolveTextChunkLimit)(cfg, "imessage", accountInfo.accountId);
          allowFrom = (0, runtime_js_1.normalizeAllowList)(
            (_f = opts.allowFrom) !== null && _f !== void 0 ? _f : imessageCfg.allowFrom,
          );
          groupAllowFrom = (0, runtime_js_1.normalizeAllowList)(
            (_h =
              (_g = opts.groupAllowFrom) !== null && _g !== void 0
                ? _g
                : imessageCfg.groupAllowFrom) !== null && _h !== void 0
              ? _h
              : imessageCfg.allowFrom && imessageCfg.allowFrom.length > 0
                ? imessageCfg.allowFrom
                : [],
          );
          defaultGroupPolicy =
            (_k = (_j = cfg.channels) === null || _j === void 0 ? void 0 : _j.defaults) === null ||
            _k === void 0
              ? void 0
              : _k.groupPolicy;
          groupPolicy =
            (_m =
              (_l = imessageCfg.groupPolicy) !== null && _l !== void 0
                ? _l
                : defaultGroupPolicy) !== null && _m !== void 0
              ? _m
              : "open";
          dmPolicy = (_o = imessageCfg.dmPolicy) !== null && _o !== void 0 ? _o : "pairing";
          includeAttachments =
            (_q =
              (_p = opts.includeAttachments) !== null && _p !== void 0
                ? _p
                : imessageCfg.includeAttachments) !== null && _q !== void 0
              ? _q
              : false;
          mediaMaxBytes =
            ((_s =
              (_r = opts.mediaMaxMb) !== null && _r !== void 0 ? _r : imessageCfg.mediaMaxMb) !==
              null && _s !== void 0
              ? _s
              : 16) *
            1024 *
            1024;
          cliPath =
            (_u = (_t = opts.cliPath) !== null && _t !== void 0 ? _t : imessageCfg.cliPath) !==
              null && _u !== void 0
              ? _u
              : "imsg";
          dbPath = (_v = opts.dbPath) !== null && _v !== void 0 ? _v : imessageCfg.dbPath;
          remoteHost = imessageCfg.remoteHost;
          if (!(!remoteHost && cliPath && cliPath !== "imsg")) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, detectRemoteHostFromCliPath(cliPath)];
        case 1:
          remoteHost = _z.sent();
          if (remoteHost) {
            (0, globals_js_1.logVerbose)(
              "imessage: detected remoteHost=".concat(remoteHost, " from cliPath"),
            );
          }
          _z.label = 2;
        case 2:
          inboundDebounceMs = (0, inbound_debounce_js_1.resolveInboundDebounceMs)({
            cfg: cfg,
            channel: "imessage",
          });
          inboundDebouncer = (0, inbound_debounce_js_1.createInboundDebouncer)({
            debounceMs: inboundDebounceMs,
            buildKey: function (entry) {
              var _a, _b, _c;
              var sender =
                (_a = entry.message.sender) === null || _a === void 0 ? void 0 : _a.trim();
              if (!sender) {
                return null;
              }
              var conversationId =
                entry.message.chat_id != null
                  ? "chat:".concat(entry.message.chat_id)
                  : (_c =
                        (_b = entry.message.chat_guid) !== null && _b !== void 0
                          ? _b
                          : entry.message.chat_identifier) !== null && _c !== void 0
                    ? _c
                    : "unknown";
              return "imessage:"
                .concat(accountInfo.accountId, ":")
                .concat(conversationId, ":")
                .concat(sender);
            },
            shouldDebounce: function (entry) {
              var _a, _b;
              var text =
                (_b = (_a = entry.message.text) === null || _a === void 0 ? void 0 : _a.trim()) !==
                  null && _b !== void 0
                  ? _b
                  : "";
              if (!text) {
                return false;
              }
              if (entry.message.attachments && entry.message.attachments.length > 0) {
                return false;
              }
              return !(0, command_detection_js_1.hasControlCommand)(text, cfg);
            },
            onFlush: function (entries) {
              return __awaiter(_this, void 0, void 0, function () {
                var last, combinedText, syntheticMessage;
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
                      return [4 /*yield*/, handleMessageNow(last.message)];
                    case 1:
                      _a.sent();
                      return [2 /*return*/];
                    case 2:
                      combinedText = entries
                        .map(function (entry) {
                          var _a;
                          return (_a = entry.message.text) !== null && _a !== void 0 ? _a : "";
                        })
                        .filter(Boolean)
                        .join("\n");
                      syntheticMessage = __assign(__assign({}, last.message), {
                        text: combinedText,
                        attachments: null,
                      });
                      return [4 /*yield*/, handleMessageNow(syntheticMessage)];
                    case 3:
                      _a.sent();
                      return [2 /*return*/];
                  }
                });
              });
            },
            onError: function (err) {
              var _a;
              (_a = runtime.error) === null || _a === void 0
                ? void 0
                : _a.call(runtime, "imessage debounce flush failed: ".concat(String(err)));
            },
          });
          handleMessage = function (raw) {
            return __awaiter(_this, void 0, void 0, function () {
              var params, message;
              var _a;
              return __generator(this, function (_b) {
                switch (_b.label) {
                  case 0:
                    params = raw;
                    message =
                      (_a = params === null || params === void 0 ? void 0 : params.message) !==
                        null && _a !== void 0
                        ? _a
                        : null;
                    if (!message) {
                      return [2 /*return*/];
                    }
                    return [4 /*yield*/, inboundDebouncer.enqueue({ message: message })];
                  case 1:
                    _b.sent();
                    return [2 /*return*/];
                }
              });
            });
          };
          return [
            4 /*yield*/,
            (0, transport_ready_js_1.waitForTransportReady)({
              label: "imsg rpc",
              timeoutMs: 30000,
              logAfterMs: 10000,
              logIntervalMs: 10000,
              pollIntervalMs: 500,
              abortSignal: opts.abortSignal,
              runtime: runtime,
              check: function () {
                return __awaiter(_this, void 0, void 0, function () {
                  var probe;
                  var _a, _b;
                  return __generator(this, function (_c) {
                    switch (_c.label) {
                      case 0:
                        return [
                          4 /*yield*/,
                          (0, probe_js_1.probeIMessage)(2000, {
                            cliPath: cliPath,
                            dbPath: dbPath,
                            runtime: runtime,
                          }),
                        ];
                      case 1:
                        probe = _c.sent();
                        if (probe.ok) {
                          return [2 /*return*/, { ok: true }];
                        }
                        if (probe.fatal) {
                          throw new Error(
                            (_a = probe.error) !== null && _a !== void 0
                              ? _a
                              : "imsg rpc unavailable",
                          );
                        }
                        return [
                          2 /*return*/,
                          {
                            ok: false,
                            error:
                              (_b = probe.error) !== null && _b !== void 0 ? _b : "unreachable",
                          },
                        ];
                    }
                  });
                });
              },
            }),
          ];
        case 3:
          _z.sent();
          if ((_w = opts.abortSignal) === null || _w === void 0 ? void 0 : _w.aborted) {
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            (0, client_js_1.createIMessageRpcClient)({
              cliPath: cliPath,
              dbPath: dbPath,
              runtime: runtime,
              onNotification: function (msg) {
                var _a;
                if (msg.method === "message") {
                  void handleMessage(msg.params).catch(function (err) {
                    var _a;
                    (_a = runtime.error) === null || _a === void 0
                      ? void 0
                      : _a.call(runtime, "imessage: handler failed: ".concat(String(err)));
                  });
                } else if (msg.method === "error") {
                  (_a = runtime.error) === null || _a === void 0
                    ? void 0
                    : _a.call(runtime, "imessage: watch error ".concat(JSON.stringify(msg.params)));
                }
              },
            }),
          ];
        case 4:
          client = _z.sent();
          subscriptionId = null;
          abort = opts.abortSignal;
          onAbort = function () {
            if (subscriptionId) {
              void client
                .request("watch.unsubscribe", {
                  subscription: subscriptionId,
                })
                .catch(function () {
                  // Ignore disconnect errors during shutdown.
                });
            }
            void client.stop().catch(function () {
              // Ignore disconnect errors during shutdown.
            });
          };
          abort === null || abort === void 0
            ? void 0
            : abort.addEventListener("abort", onAbort, { once: true });
          _z.label = 5;
        case 5:
          _z.trys.push([5, 8, 9, 11]);
          return [
            4 /*yield*/,
            client.request("watch.subscribe", {
              attachments: includeAttachments,
            }),
          ];
        case 6:
          result = _z.sent();
          subscriptionId =
            (_x = result === null || result === void 0 ? void 0 : result.subscription) !== null &&
            _x !== void 0
              ? _x
              : null;
          return [4 /*yield*/, client.waitForClose()];
        case 7:
          _z.sent();
          return [3 /*break*/, 11];
        case 8:
          err_1 = _z.sent();
          if (abort === null || abort === void 0 ? void 0 : abort.aborted) {
            return [2 /*return*/];
          }
          (_y = runtime.error) === null || _y === void 0
            ? void 0
            : _y.call(
                runtime,
                (0, globals_js_1.danger)("imessage: monitor failed: ".concat(String(err_1))),
              );
          throw err_1;
        case 9:
          abort === null || abort === void 0 ? void 0 : abort.removeEventListener("abort", onAbort);
          return [4 /*yield*/, client.stop()];
        case 10:
          _z.sent();
          return [7 /*endfinally*/];
        case 11:
          return [2 /*return*/];
      }
    });
  });
}
