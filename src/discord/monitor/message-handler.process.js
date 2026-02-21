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
exports.processDiscordMessage = processDiscordMessage;
var carbon_1 = require("@buape/carbon");
var identity_js_1 = require("../../agents/identity.js");
var ack_reactions_js_1 = require("../../channels/ack-reactions.js");
var logging_js_1 = require("../../channels/logging.js");
var reply_prefix_js_1 = require("../../channels/reply-prefix.js");
var typing_js_1 = require("../../channels/typing.js");
var envelope_js_1 = require("../../auto-reply/envelope.js");
var dispatch_js_1 = require("../../auto-reply/dispatch.js");
var history_js_1 = require("../../auto-reply/reply/history.js");
var inbound_context_js_1 = require("../../auto-reply/reply/inbound-context.js");
var reply_dispatcher_js_1 = require("../../auto-reply/reply/reply-dispatcher.js");
var session_js_1 = require("../../channels/session.js");
var sessions_js_1 = require("../../config/sessions.js");
var chunk_js_1 = require("../../auto-reply/chunk.js");
var markdown_tables_js_1 = require("../../config/markdown-tables.js");
var globals_js_1 = require("../../globals.js");
var resolve_route_js_1 = require("../../routing/resolve-route.js");
var session_key_js_1 = require("../../routing/session-key.js");
var utils_js_1 = require("../../utils.js");
var send_js_1 = require("../send.js");
var allow_list_js_1 = require("./allow-list.js");
var format_js_1 = require("./format.js");
var message_utils_js_1 = require("./message-utils.js");
var reply_context_js_1 = require("./reply-context.js");
var reply_delivery_js_1 = require("./reply-delivery.js");
var threading_js_1 = require("./threading.js");
var typing_js_2 = require("./typing.js");
function processDiscordMessage(ctx) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      discordConfig,
      accountId,
      token,
      runtime,
      guildHistories,
      historyLimit,
      mediaMaxBytes,
      textLimit,
      replyToMode,
      ackReactionScope,
      message,
      author,
      data,
      client,
      channelInfo,
      channelName,
      isGuildMessage,
      isDirectMessage,
      isGroupDm,
      baseText,
      messageText,
      shouldRequireMention,
      canDetectMention,
      effectiveWasMentioned,
      shouldBypassMention,
      threadChannel,
      threadParentId,
      threadParentName,
      threadParentType,
      threadName,
      displayChannelSlug,
      guildInfo,
      guildSlug,
      channelConfig,
      baseSessionKey,
      route,
      commandAuthorized,
      mediaList,
      text,
      ackReaction,
      removeAckAfterReply,
      shouldAckReaction,
      ackReactionPromise,
      fromLabel,
      senderTag,
      senderDisplay,
      senderLabel,
      isForumParent,
      forumParentSlug,
      threadChannelId,
      isForumStarter,
      forumContextLine,
      groupChannel,
      groupSubject,
      channelDescription,
      systemPromptParts,
      groupSystemPrompt,
      storePath,
      envelopeOptions,
      previousTimestamp,
      combinedBody,
      shouldIncludeChannelHistory,
      replyContext,
      threadStarterBody,
      threadLabel,
      parentSessionKey,
      starter,
      starterEnvelope,
      parentName,
      mediaPayload,
      threadKeys,
      replyPlan,
      deliverTarget,
      replyTarget,
      replyReference,
      autoThreadContext,
      effectiveFrom,
      effectiveTo,
      ctxPayload,
      preview,
      typingChannelId,
      prefixContext,
      tableMode,
      _a,
      dispatcher,
      replyOptions,
      markDispatchIdle,
      _b,
      queuedFinal,
      counts,
      finalCount;
    var _this = this;
    var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    return __generator(this, function (_z) {
      switch (_z.label) {
        case 0:
          ((cfg = ctx.cfg),
            (discordConfig = ctx.discordConfig),
            (accountId = ctx.accountId),
            (token = ctx.token),
            (runtime = ctx.runtime),
            (guildHistories = ctx.guildHistories),
            (historyLimit = ctx.historyLimit),
            (mediaMaxBytes = ctx.mediaMaxBytes),
            (textLimit = ctx.textLimit),
            (replyToMode = ctx.replyToMode),
            (ackReactionScope = ctx.ackReactionScope),
            (message = ctx.message),
            (author = ctx.author),
            (data = ctx.data),
            (client = ctx.client),
            (channelInfo = ctx.channelInfo),
            (channelName = ctx.channelName),
            (isGuildMessage = ctx.isGuildMessage),
            (isDirectMessage = ctx.isDirectMessage),
            (isGroupDm = ctx.isGroupDm),
            (baseText = ctx.baseText),
            (messageText = ctx.messageText),
            (shouldRequireMention = ctx.shouldRequireMention),
            (canDetectMention = ctx.canDetectMention),
            (effectiveWasMentioned = ctx.effectiveWasMentioned),
            (shouldBypassMention = ctx.shouldBypassMention),
            (threadChannel = ctx.threadChannel),
            (threadParentId = ctx.threadParentId),
            (threadParentName = ctx.threadParentName),
            (threadParentType = ctx.threadParentType),
            (threadName = ctx.threadName),
            (displayChannelSlug = ctx.displayChannelSlug),
            (guildInfo = ctx.guildInfo),
            (guildSlug = ctx.guildSlug),
            (channelConfig = ctx.channelConfig),
            (baseSessionKey = ctx.baseSessionKey),
            (route = ctx.route),
            (commandAuthorized = ctx.commandAuthorized));
          return [4 /*yield*/, (0, message_utils_js_1.resolveMediaList)(message, mediaMaxBytes)];
        case 1:
          mediaList = _z.sent();
          text = messageText;
          if (!text) {
            (0, globals_js_1.logVerbose)(
              "discord: drop message ".concat(message.id, " (empty content)"),
            );
            return [2 /*return*/];
          }
          ackReaction = (0, identity_js_1.resolveAckReaction)(cfg, route.agentId);
          removeAckAfterReply =
            (_d =
              (_c = cfg.messages) === null || _c === void 0 ? void 0 : _c.removeAckAfterReply) !==
              null && _d !== void 0
              ? _d
              : false;
          shouldAckReaction = function () {
            return Boolean(
              ackReaction &&
              (0, ack_reactions_js_1.shouldAckReaction)({
                scope: ackReactionScope,
                isDirect: isDirectMessage,
                isGroup: isGuildMessage || isGroupDm,
                isMentionableGroup: isGuildMessage,
                requireMention: Boolean(shouldRequireMention),
                canDetectMention: canDetectMention,
                effectiveWasMentioned: effectiveWasMentioned,
                shouldBypassMention: shouldBypassMention,
              }),
            );
          };
          ackReactionPromise = shouldAckReaction()
            ? (0, send_js_1.reactMessageDiscord)(message.channelId, message.id, ackReaction, {
                rest: client.rest,
              }).then(
                function () {
                  return true;
                },
                function (err) {
                  (0, globals_js_1.logVerbose)(
                    "discord react failed for channel "
                      .concat(message.channelId, ": ")
                      .concat(String(err)),
                  );
                  return false;
                },
              )
            : null;
          fromLabel = isDirectMessage
            ? (0, reply_context_js_1.buildDirectLabel)(author)
            : (0, reply_context_js_1.buildGuildLabel)({
                guild: (_e = data.guild) !== null && _e !== void 0 ? _e : undefined,
                channelName:
                  channelName !== null && channelName !== void 0 ? channelName : message.channelId,
                channelId: message.channelId,
              });
          senderTag = (0, format_js_1.formatDiscordUserTag)(author);
          senderDisplay =
            (_h =
              (_g = (_f = data.member) === null || _f === void 0 ? void 0 : _f.nickname) !== null &&
              _g !== void 0
                ? _g
                : author.globalName) !== null && _h !== void 0
              ? _h
              : author.username;
          senderLabel =
            senderDisplay && senderTag && senderDisplay !== senderTag
              ? "".concat(senderDisplay, " (").concat(senderTag, ")")
              : (_j =
                    senderDisplay !== null && senderDisplay !== void 0
                      ? senderDisplay
                      : senderTag) !== null && _j !== void 0
                ? _j
                : author.id;
          isForumParent =
            threadParentType === carbon_1.ChannelType.GuildForum ||
            threadParentType === carbon_1.ChannelType.GuildMedia;
          forumParentSlug =
            isForumParent && threadParentName
              ? (0, allow_list_js_1.normalizeDiscordSlug)(threadParentName)
              : "";
          threadChannelId =
            threadChannel === null || threadChannel === void 0 ? void 0 : threadChannel.id;
          isForumStarter =
            Boolean(threadChannelId && isForumParent && forumParentSlug) &&
            message.id === threadChannelId;
          forumContextLine = isForumStarter
            ? "[Forum parent: #".concat(forumParentSlug, "]")
            : null;
          groupChannel =
            isGuildMessage && displayChannelSlug ? "#".concat(displayChannelSlug) : undefined;
          groupSubject = isDirectMessage ? undefined : groupChannel;
          channelDescription =
            (_k = channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.topic) ===
              null || _k === void 0
              ? void 0
              : _k.trim();
          systemPromptParts = [
            channelDescription ? "Channel topic: ".concat(channelDescription) : null,
            ((_l =
              channelConfig === null || channelConfig === void 0
                ? void 0
                : channelConfig.systemPrompt) === null || _l === void 0
              ? void 0
              : _l.trim()) || null,
          ].filter(function (entry) {
            return Boolean(entry);
          });
          groupSystemPrompt =
            systemPromptParts.length > 0 ? systemPromptParts.join("\n\n") : undefined;
          storePath = (0, sessions_js_1.resolveStorePath)(
            (_m = cfg.session) === null || _m === void 0 ? void 0 : _m.store,
            {
              agentId: route.agentId,
            },
          );
          envelopeOptions = (0, envelope_js_1.resolveEnvelopeFormatOptions)(cfg);
          previousTimestamp = (0, sessions_js_1.readSessionUpdatedAt)({
            storePath: storePath,
            sessionKey: route.sessionKey,
          });
          combinedBody = (0, envelope_js_1.formatInboundEnvelope)({
            channel: "Discord",
            from: fromLabel,
            timestamp: (0, format_js_1.resolveTimestampMs)(message.timestamp),
            body: text,
            chatType: isDirectMessage ? "direct" : "channel",
            senderLabel: senderLabel,
            previousTimestamp: previousTimestamp,
            envelope: envelopeOptions,
          });
          shouldIncludeChannelHistory =
            !isDirectMessage &&
            !(
              isGuildMessage &&
              (channelConfig === null || channelConfig === void 0
                ? void 0
                : channelConfig.autoThread) &&
              !threadChannel
            );
          if (shouldIncludeChannelHistory) {
            combinedBody = (0, history_js_1.buildPendingHistoryContextFromMap)({
              historyMap: guildHistories,
              historyKey: message.channelId,
              limit: historyLimit,
              currentMessage: combinedBody,
              formatEntry: function (entry) {
                var _a;
                return (0, envelope_js_1.formatInboundEnvelope)({
                  channel: "Discord",
                  from: fromLabel,
                  timestamp: entry.timestamp,
                  body: ""
                    .concat(entry.body, " [id:")
                    .concat(
                      (_a = entry.messageId) !== null && _a !== void 0 ? _a : "unknown",
                      " channel:",
                    )
                    .concat(message.channelId, "]"),
                  chatType: "channel",
                  senderLabel: entry.sender,
                  envelope: envelopeOptions,
                });
              },
            });
          }
          replyContext = (0, reply_context_js_1.resolveReplyContext)(
            message,
            message_utils_js_1.resolveDiscordMessageText,
            {
              envelope: envelopeOptions,
            },
          );
          if (replyContext) {
            combinedBody = "[Replied message - for context]\n"
              .concat(replyContext, "\n\n")
              .concat(combinedBody);
          }
          if (forumContextLine) {
            combinedBody = "".concat(combinedBody, "\n").concat(forumContextLine);
          }
          if (!threadChannel) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            (0, threading_js_1.resolveDiscordThreadStarter)({
              channel: threadChannel,
              client: client,
              parentId: threadParentId,
              parentType: threadParentType,
              resolveTimestampMs: format_js_1.resolveTimestampMs,
            }),
          ];
        case 2:
          starter = _z.sent();
          if (starter === null || starter === void 0 ? void 0 : starter.text) {
            starterEnvelope = (0, envelope_js_1.formatThreadStarterEnvelope)({
              channel: "Discord",
              author: starter.author,
              timestamp: starter.timestamp,
              body: starter.text,
              envelope: envelopeOptions,
            });
            threadStarterBody = starterEnvelope;
          }
          parentName =
            threadParentName !== null && threadParentName !== void 0 ? threadParentName : "parent";
          threadLabel = threadName
            ? "Discord thread #"
                .concat((0, allow_list_js_1.normalizeDiscordSlug)(parentName), " \u203A ")
                .concat(threadName)
            : "Discord thread #".concat((0, allow_list_js_1.normalizeDiscordSlug)(parentName));
          if (threadParentId) {
            parentSessionKey = (0, resolve_route_js_1.buildAgentSessionKey)({
              agentId: route.agentId,
              channel: route.channel,
              peer: { kind: "channel", id: threadParentId },
            });
          }
          _z.label = 3;
        case 3:
          mediaPayload = (0, message_utils_js_1.buildDiscordMediaPayload)(mediaList);
          threadKeys = (0, session_key_js_1.resolveThreadSessionKeys)({
            baseSessionKey: baseSessionKey,
            threadId: threadChannel ? message.channelId : undefined,
            parentSessionKey: parentSessionKey,
            useSuffix: false,
          });
          return [
            4 /*yield*/,
            (0, threading_js_1.resolveDiscordAutoThreadReplyPlan)({
              client: client,
              message: message,
              isGuildMessage: isGuildMessage,
              channelConfig: channelConfig,
              threadChannel: threadChannel,
              baseText: baseText !== null && baseText !== void 0 ? baseText : "",
              combinedBody: combinedBody,
              replyToMode: replyToMode,
              agentId: route.agentId,
              channel: route.channel,
            }),
          ];
        case 4:
          replyPlan = _z.sent();
          deliverTarget = replyPlan.deliverTarget;
          replyTarget = replyPlan.replyTarget;
          replyReference = replyPlan.replyReference;
          autoThreadContext = replyPlan.autoThreadContext;
          effectiveFrom = isDirectMessage
            ? "discord:".concat(author.id)
            : (_o =
                  autoThreadContext === null || autoThreadContext === void 0
                    ? void 0
                    : autoThreadContext.From) !== null && _o !== void 0
              ? _o
              : "discord:channel:".concat(message.channelId);
          effectiveTo =
            (_p =
              autoThreadContext === null || autoThreadContext === void 0
                ? void 0
                : autoThreadContext.To) !== null && _p !== void 0
              ? _p
              : replyTarget;
          if (!effectiveTo) {
            (_q = runtime.error) === null || _q === void 0
              ? void 0
              : _q.call(runtime, (0, globals_js_1.danger)("discord: missing reply target"));
            return [2 /*return*/];
          }
          ctxPayload = (0, inbound_context_js_1.finalizeInboundContext)(
            __assign(
              __assign(
                {
                  Body: combinedBody,
                  RawBody: baseText,
                  CommandBody: baseText,
                  From: effectiveFrom,
                  To: effectiveTo,
                  SessionKey:
                    (_r =
                      autoThreadContext === null || autoThreadContext === void 0
                        ? void 0
                        : autoThreadContext.SessionKey) !== null && _r !== void 0
                      ? _r
                      : threadKeys.sessionKey,
                  AccountId: route.accountId,
                  ChatType: isDirectMessage ? "direct" : "channel",
                  ConversationLabel: fromLabel,
                  SenderName:
                    (_u =
                      (_t = (_s = data.member) === null || _s === void 0 ? void 0 : _s.nickname) !==
                        null && _t !== void 0
                        ? _t
                        : author.globalName) !== null && _u !== void 0
                      ? _u
                      : author.username,
                  SenderId: author.id,
                  SenderUsername: author.username,
                  SenderTag: (0, format_js_1.formatDiscordUserTag)(author),
                  GroupSubject: groupSubject,
                  GroupChannel: groupChannel,
                  GroupSystemPrompt: isGuildMessage ? groupSystemPrompt : undefined,
                  GroupSpace: isGuildMessage
                    ? ((_v = guildInfo === null || guildInfo === void 0 ? void 0 : guildInfo.id) !==
                        null && _v !== void 0
                        ? _v
                        : guildSlug) || undefined
                    : undefined,
                  Provider: "discord",
                  Surface: "discord",
                  WasMentioned: effectiveWasMentioned,
                  MessageSid: message.id,
                  ParentSessionKey:
                    (_w =
                      autoThreadContext === null || autoThreadContext === void 0
                        ? void 0
                        : autoThreadContext.ParentSessionKey) !== null && _w !== void 0
                      ? _w
                      : threadKeys.parentSessionKey,
                  ThreadStarterBody: threadStarterBody,
                  ThreadLabel: threadLabel,
                  Timestamp: (0, format_js_1.resolveTimestampMs)(message.timestamp),
                },
                mediaPayload,
              ),
              {
                CommandAuthorized: commandAuthorized,
                CommandSource: "text",
                // Originating channel for reply routing.
                OriginatingChannel: "discord",
                OriginatingTo:
                  (_x =
                    autoThreadContext === null || autoThreadContext === void 0
                      ? void 0
                      : autoThreadContext.OriginatingTo) !== null && _x !== void 0
                    ? _x
                    : replyTarget,
              },
            ),
          );
          return [
            4 /*yield*/,
            (0, session_js_1.recordInboundSession)({
              storePath: storePath,
              sessionKey:
                (_y = ctxPayload.SessionKey) !== null && _y !== void 0 ? _y : route.sessionKey,
              ctx: ctxPayload,
              updateLastRoute: isDirectMessage
                ? {
                    sessionKey: route.mainSessionKey,
                    channel: "discord",
                    to: "user:".concat(author.id),
                    accountId: route.accountId,
                  }
                : undefined,
              onRecordError: function (err) {
                (0, globals_js_1.logVerbose)(
                  "discord: failed updating session meta: ".concat(String(err)),
                );
              },
            }),
          ];
        case 5:
          _z.sent();
          if ((0, globals_js_1.shouldLogVerbose)()) {
            preview = (0, utils_js_1.truncateUtf16Safe)(combinedBody, 200).replace(/\n/g, "\\n");
            (0, globals_js_1.logVerbose)(
              "discord inbound: channel="
                .concat(message.channelId, " deliver=")
                .concat(deliverTarget, " from=")
                .concat(ctxPayload.From, ' preview="')
                .concat(preview, '"'),
            );
          }
          typingChannelId = deliverTarget.startsWith("channel:")
            ? deliverTarget.slice("channel:".length)
            : message.channelId;
          prefixContext = (0, reply_prefix_js_1.createReplyPrefixContext)({
            cfg: cfg,
            agentId: route.agentId,
          });
          tableMode = (0, markdown_tables_js_1.resolveMarkdownTableMode)({
            cfg: cfg,
            channel: "discord",
            accountId: accountId,
          });
          ((_a = (0, reply_dispatcher_js_1.createReplyDispatcherWithTyping)({
            responsePrefix: prefixContext.responsePrefix,
            responsePrefixContextProvider: prefixContext.responsePrefixContextProvider,
            humanDelay: (0, identity_js_1.resolveHumanDelayConfig)(cfg, route.agentId),
            deliver: function (payload) {
              return __awaiter(_this, void 0, void 0, function () {
                var replyToId;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      replyToId = replyReference.use();
                      return [
                        4 /*yield*/,
                        (0, reply_delivery_js_1.deliverDiscordReply)({
                          replies: [payload],
                          target: deliverTarget,
                          token: token,
                          accountId: accountId,
                          rest: client.rest,
                          runtime: runtime,
                          replyToId: replyToId,
                          textLimit: textLimit,
                          maxLinesPerMessage:
                            discordConfig === null || discordConfig === void 0
                              ? void 0
                              : discordConfig.maxLinesPerMessage,
                          tableMode: tableMode,
                          chunkMode: (0, chunk_js_1.resolveChunkMode)(cfg, "discord", accountId),
                        }),
                      ];
                    case 1:
                      _a.sent();
                      replyReference.markSent();
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
                      "discord ".concat(info.kind, " reply failed: ").concat(String(err)),
                    ),
                  );
            },
            onReplyStart: (0, typing_js_1.createTypingCallbacks)({
              start: function () {
                return (0, typing_js_2.sendTyping)({ client: client, channelId: typingChannelId });
              },
              onStartError: function (err) {
                (0, logging_js_1.logTypingFailure)({
                  log: globals_js_1.logVerbose,
                  channel: "discord",
                  target: typingChannelId,
                  error: err,
                });
              },
            }).onReplyStart,
          })),
            (dispatcher = _a.dispatcher),
            (replyOptions = _a.replyOptions),
            (markDispatchIdle = _a.markDispatchIdle));
          return [
            4 /*yield*/,
            (0, dispatch_js_1.dispatchInboundMessage)({
              ctx: ctxPayload,
              cfg: cfg,
              dispatcher: dispatcher,
              replyOptions: __assign(__assign({}, replyOptions), {
                skillFilter:
                  channelConfig === null || channelConfig === void 0
                    ? void 0
                    : channelConfig.skills,
                disableBlockStreaming:
                  typeof (discordConfig === null || discordConfig === void 0
                    ? void 0
                    : discordConfig.blockStreaming) === "boolean"
                    ? !discordConfig.blockStreaming
                    : undefined,
                onModelSelected: function (ctx) {
                  prefixContext.onModelSelected(ctx);
                },
              }),
            }),
          ];
        case 6:
          ((_b = _z.sent()), (queuedFinal = _b.queuedFinal), (counts = _b.counts));
          markDispatchIdle();
          if (!queuedFinal) {
            if (isGuildMessage) {
              (0, history_js_1.clearHistoryEntriesIfEnabled)({
                historyMap: guildHistories,
                historyKey: message.channelId,
                limit: historyLimit,
              });
            }
            return [2 /*return*/];
          }
          if ((0, globals_js_1.shouldLogVerbose)()) {
            finalCount = counts.final;
            (0, globals_js_1.logVerbose)(
              "discord: delivered "
                .concat(finalCount, " reply")
                .concat(finalCount === 1 ? "" : "ies", " to ")
                .concat(replyTarget),
            );
          }
          (0, ack_reactions_js_1.removeAckReactionAfterReply)({
            removeAfterReply: removeAckAfterReply,
            ackReactionPromise: ackReactionPromise,
            ackReactionValue: ackReaction,
            remove: function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [
                        4 /*yield*/,
                        (0, send_js_1.removeReactionDiscord)(
                          message.channelId,
                          message.id,
                          ackReaction,
                          {
                            rest: client.rest,
                          },
                        ),
                      ];
                    case 1:
                      _a.sent();
                      return [2 /*return*/];
                  }
                });
              });
            },
            onError: function (err) {
              (0, logging_js_1.logAckFailure)({
                log: globals_js_1.logVerbose,
                channel: "discord",
                target: "".concat(message.channelId, "/").concat(message.id),
                error: err,
              });
            },
          });
          if (isGuildMessage) {
            (0, history_js_1.clearHistoryEntriesIfEnabled)({
              historyMap: guildHistories,
              historyKey: message.channelId,
              limit: historyLimit,
            });
          }
          return [2 /*return*/];
      }
    });
  });
}
