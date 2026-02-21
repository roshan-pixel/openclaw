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
exports.prepareSlackMessage = prepareSlackMessage;
var identity_js_1 = require("../../../agents/identity.js");
var command_detection_js_1 = require("../../../auto-reply/command-detection.js");
var commands_registry_js_1 = require("../../../auto-reply/commands-registry.js");
var envelope_js_1 = require("../../../auto-reply/envelope.js");
var history_js_1 = require("../../../auto-reply/reply/history.js");
var inbound_context_js_1 = require("../../../auto-reply/reply/inbound-context.js");
var mentions_js_1 = require("../../../auto-reply/reply/mentions.js");
var globals_js_1 = require("../../../globals.js");
var system_events_js_1 = require("../../../infra/system-events.js");
var pairing_messages_js_1 = require("../../../pairing/pairing-messages.js");
var pairing_store_js_1 = require("../../../pairing/pairing-store.js");
var resolve_route_js_1 = require("../../../routing/resolve-route.js");
var session_key_js_1 = require("../../../routing/session-key.js");
var ack_reactions_js_1 = require("../../../channels/ack-reactions.js");
var mention_gating_js_1 = require("../../../channels/mention-gating.js");
var conversation_label_js_1 = require("../../../channels/conversation-label.js");
var command_gating_js_1 = require("../../../channels/command-gating.js");
var logging_js_1 = require("../../../channels/logging.js");
var allowlist_match_js_1 = require("../../../channels/allowlist-match.js");
var session_js_1 = require("../../../channels/session.js");
var sessions_js_1 = require("../../../config/sessions.js");
var actions_js_1 = require("../../actions.js");
var send_js_1 = require("../../send.js");
var threading_js_1 = require("../../threading.js");
var allow_list_js_1 = require("../allow-list.js");
var auth_js_1 = require("../auth.js");
var channel_config_js_1 = require("../channel-config.js");
var context_js_1 = require("../context.js");
var media_js_1 = require("../media.js");
function prepareSlackMessage(params) {
  return __awaiter(this, void 0, void 0, function () {
    var ctx,
      account,
      message,
      opts,
      cfg,
      channelInfo,
      channelType,
      channelName,
      resolvedChannelType,
      isDirectMessage,
      isGroupDm,
      isRoom,
      isRoomish,
      channelConfig,
      allowBots,
      isBotMessage,
      senderId,
      allowFromLower,
      directUserId,
      allowMatch,
      allowMatchMeta,
      sender_1,
      senderName_1,
      _a,
      code,
      created,
      err_1,
      route,
      baseSessionKey,
      threadContext,
      threadTs,
      isThreadReply,
      threadKeys,
      sessionKey,
      historyKey,
      mentionRegexes,
      hasAnyMention,
      explicitlyMentioned,
      wasMentioned,
      implicitMention,
      sender,
      _b,
      senderName,
      channelUserAuthorized,
      allowTextCommands,
      hasControlCommandInMessage,
      ownerAuthorized,
      channelUsersAllowlistConfigured,
      channelCommandAuthorized,
      commandGate,
      commandAuthorized,
      shouldRequireMention,
      canDetectMention,
      mentionGate,
      effectiveWasMentioned,
      pendingText,
      fallbackFile,
      pendingBody,
      media,
      rawBody,
      ackReaction,
      ackReactionValue,
      shouldAckReaction,
      ackReactionMessageTs,
      ackReactionPromise,
      roomLabel,
      preview,
      inboundLabel,
      slackFrom,
      envelopeFrom,
      textWithId,
      storePath,
      envelopeOptions,
      previousTimestamp,
      body,
      combinedBody,
      slackTo,
      channelDescription,
      systemPromptParts,
      groupSystemPrompt,
      threadStarterBody,
      threadLabel,
      threadStarterMedia,
      starter,
      starterUser,
      _c,
      starterName,
      starterWithId,
      snippet,
      effectiveMedia,
      ctxPayload,
      replyTarget;
    var _d,
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
      _11,
      _12;
    return __generator(this, function (_13) {
      switch (_13.label) {
        case 0:
          ((ctx = params.ctx),
            (account = params.account),
            (message = params.message),
            (opts = params.opts));
          cfg = ctx.cfg;
          channelInfo = {};
          channelType = message.channel_type;
          if (!(!channelType || channelType !== "im")) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, ctx.resolveChannelName(message.channel)];
        case 1:
          channelInfo = _13.sent();
          channelType =
            channelType !== null && channelType !== void 0 ? channelType : channelInfo.type;
          _13.label = 2;
        case 2:
          channelName = channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name;
          resolvedChannelType = (0, context_js_1.normalizeSlackChannelType)(
            channelType,
            message.channel,
          );
          isDirectMessage = resolvedChannelType === "im";
          isGroupDm = resolvedChannelType === "mpim";
          isRoom = resolvedChannelType === "channel" || resolvedChannelType === "group";
          isRoomish = isRoom || isGroupDm;
          channelConfig = isRoom
            ? (0, channel_config_js_1.resolveSlackChannelConfig)({
                channelId: message.channel,
                channelName: channelName,
                channels: ctx.channelsConfig,
                defaultRequireMention: ctx.defaultRequireMention,
              })
            : null;
          allowBots =
            (_j =
              (_f =
                (_d =
                  channelConfig === null || channelConfig === void 0
                    ? void 0
                    : channelConfig.allowBots) !== null && _d !== void 0
                  ? _d
                  : (_e = account.config) === null || _e === void 0
                    ? void 0
                    : _e.allowBots) !== null && _f !== void 0
                ? _f
                : (_h = (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g.slack) ===
                      null || _h === void 0
                  ? void 0
                  : _h.allowBots) !== null && _j !== void 0
              ? _j
              : false;
          isBotMessage = Boolean(message.bot_id);
          if (isBotMessage) {
            if (message.user && ctx.botUserId && message.user === ctx.botUserId) {
              return [2 /*return*/, null];
            }
            if (!allowBots) {
              (0, globals_js_1.logVerbose)(
                "slack: drop bot message ".concat(
                  (_k = message.bot_id) !== null && _k !== void 0 ? _k : "unknown",
                  " (allowBots=false)",
                ),
              );
              return [2 /*return*/, null];
            }
          }
          if (isDirectMessage && !message.user) {
            (0, globals_js_1.logVerbose)("slack: drop dm message (missing user id)");
            return [2 /*return*/, null];
          }
          senderId =
            (_l = message.user) !== null && _l !== void 0
              ? _l
              : isBotMessage
                ? message.bot_id
                : undefined;
          if (!senderId) {
            (0, globals_js_1.logVerbose)("slack: drop message (missing sender id)");
            return [2 /*return*/, null];
          }
          if (
            !ctx.isChannelAllowed({
              channelId: message.channel,
              channelName: channelName,
              channelType: resolvedChannelType,
            })
          ) {
            (0, globals_js_1.logVerbose)("slack: drop message (channel not allowed)");
            return [2 /*return*/, null];
          }
          return [4 /*yield*/, (0, auth_js_1.resolveSlackEffectiveAllowFrom)(ctx)];
        case 3:
          allowFromLower = _13.sent().allowFromLower;
          if (!isDirectMessage) {
            return [3 /*break*/, 12];
          }
          directUserId = message.user;
          if (!directUserId) {
            (0, globals_js_1.logVerbose)("slack: drop dm message (missing user id)");
            return [2 /*return*/, null];
          }
          if (!ctx.dmEnabled || ctx.dmPolicy === "disabled") {
            (0, globals_js_1.logVerbose)("slack: drop dm (dms disabled)");
            return [2 /*return*/, null];
          }
          if (!(ctx.dmPolicy !== "open")) {
            return [3 /*break*/, 12];
          }
          allowMatch = (0, allow_list_js_1.resolveSlackAllowListMatch)({
            allowList: allowFromLower,
            id: directUserId,
          });
          allowMatchMeta = (0, allowlist_match_js_1.formatAllowlistMatchMeta)(allowMatch);
          if (!!allowMatch.allowed) {
            return [3 /*break*/, 12];
          }
          if (!(ctx.dmPolicy === "pairing")) {
            return [3 /*break*/, 10];
          }
          return [4 /*yield*/, ctx.resolveUserName(directUserId)];
        case 4:
          sender_1 = _13.sent();
          senderName_1 =
            (_m = sender_1 === null || sender_1 === void 0 ? void 0 : sender_1.name) !== null &&
            _m !== void 0
              ? _m
              : undefined;
          return [
            4 /*yield*/,
            (0, pairing_store_js_1.upsertChannelPairingRequest)({
              channel: "slack",
              id: directUserId,
              meta: { name: senderName_1 },
            }),
          ];
        case 5:
          ((_a = _13.sent()), (code = _a.code), (created = _a.created));
          if (!created) {
            return [3 /*break*/, 9];
          }
          (0, globals_js_1.logVerbose)(
            "slack pairing request sender="
              .concat(directUserId, " name=")
              .concat(
                senderName_1 !== null && senderName_1 !== void 0 ? senderName_1 : "unknown",
                " (",
              )
              .concat(allowMatchMeta, ")"),
          );
          _13.label = 6;
        case 6:
          _13.trys.push([6, 8, , 9]);
          return [
            4 /*yield*/,
            (0, send_js_1.sendMessageSlack)(
              message.channel,
              (0, pairing_messages_js_1.buildPairingReply)({
                channel: "slack",
                idLine: "Your Slack user id: ".concat(directUserId),
                code: code,
              }),
              {
                token: ctx.botToken,
                client: ctx.app.client,
                accountId: account.accountId,
              },
            ),
          ];
        case 7:
          _13.sent();
          return [3 /*break*/, 9];
        case 8:
          err_1 = _13.sent();
          (0, globals_js_1.logVerbose)(
            "slack pairing reply failed for ".concat(message.user, ": ").concat(String(err_1)),
          );
          return [3 /*break*/, 9];
        case 9:
          return [3 /*break*/, 11];
        case 10:
          (0, globals_js_1.logVerbose)(
            "Blocked unauthorized slack sender "
              .concat(message.user, " (dmPolicy=")
              .concat(ctx.dmPolicy, ", ")
              .concat(allowMatchMeta, ")"),
          );
          _13.label = 11;
        case 11:
          return [2 /*return*/, null];
        case 12:
          route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "slack",
            accountId: account.accountId,
            teamId: ctx.teamId || undefined,
            peer: {
              kind: isDirectMessage ? "dm" : isRoom ? "channel" : "group",
              id: isDirectMessage
                ? (_o = message.user) !== null && _o !== void 0
                  ? _o
                  : "unknown"
                : message.channel,
            },
          });
          baseSessionKey = route.sessionKey;
          threadContext = (0, threading_js_1.resolveSlackThreadContext)({
            message: message,
            replyToMode: ctx.replyToMode,
          });
          threadTs = threadContext.incomingThreadTs;
          isThreadReply = threadContext.isThreadReply;
          threadKeys = (0, session_key_js_1.resolveThreadSessionKeys)({
            baseSessionKey: baseSessionKey,
            threadId: isThreadReply ? threadTs : undefined,
            parentSessionKey: isThreadReply && ctx.threadInheritParent ? baseSessionKey : undefined,
          });
          sessionKey = threadKeys.sessionKey;
          historyKey =
            isThreadReply && ctx.threadHistoryScope === "thread" ? sessionKey : message.channel;
          mentionRegexes = (0, mentions_js_1.buildMentionRegexes)(cfg, route.agentId);
          hasAnyMention = /<@[^>]+>/.test((_p = message.text) !== null && _p !== void 0 ? _p : "");
          explicitlyMentioned = Boolean(
            ctx.botUserId &&
            ((_q = message.text) === null || _q === void 0
              ? void 0
              : _q.includes("<@".concat(ctx.botUserId, ">"))),
          );
          wasMentioned =
            (_r = opts.wasMentioned) !== null && _r !== void 0
              ? _r
              : !isDirectMessage &&
                (0, mentions_js_1.matchesMentionWithExplicit)({
                  text: (_s = message.text) !== null && _s !== void 0 ? _s : "",
                  mentionRegexes: mentionRegexes,
                  explicit: {
                    hasAnyMention: hasAnyMention,
                    isExplicitlyMentioned: explicitlyMentioned,
                    canResolveExplicit: Boolean(ctx.botUserId),
                  },
                });
          implicitMention = Boolean(
            !isDirectMessage &&
            ctx.botUserId &&
            message.thread_ts &&
            message.parent_user_id === ctx.botUserId,
          );
          if (!message.user) {
            return [3 /*break*/, 14];
          }
          return [4 /*yield*/, ctx.resolveUserName(message.user)];
        case 13:
          _b = _13.sent();
          return [3 /*break*/, 15];
        case 14:
          _b = null;
          _13.label = 15;
        case 15:
          sender = _b;
          senderName =
            (_x =
              (_w =
                (_v =
                  (_t = sender === null || sender === void 0 ? void 0 : sender.name) !== null &&
                  _t !== void 0
                    ? _t
                    : (_u = message.username) === null || _u === void 0
                      ? void 0
                      : _u.trim()) !== null && _v !== void 0
                  ? _v
                  : message.user) !== null && _w !== void 0
                ? _w
                : message.bot_id) !== null && _x !== void 0
              ? _x
              : "unknown";
          channelUserAuthorized = isRoom
            ? (0, allow_list_js_1.resolveSlackUserAllowed)({
                allowList:
                  channelConfig === null || channelConfig === void 0 ? void 0 : channelConfig.users,
                userId: senderId,
                userName: senderName,
              })
            : true;
          if (isRoom && !channelUserAuthorized) {
            (0, globals_js_1.logVerbose)(
              "Blocked unauthorized slack sender ".concat(senderId, " (not in channel users)"),
            );
            return [2 /*return*/, null];
          }
          allowTextCommands = (0, commands_registry_js_1.shouldHandleTextCommands)({
            cfg: cfg,
            surface: "slack",
          });
          hasControlCommandInMessage = (0, command_detection_js_1.hasControlCommand)(
            (_y = message.text) !== null && _y !== void 0 ? _y : "",
            cfg,
          );
          ownerAuthorized = (0, allow_list_js_1.resolveSlackAllowListMatch)({
            allowList: allowFromLower,
            id: senderId,
            name: senderName,
          }).allowed;
          channelUsersAllowlistConfigured =
            isRoom &&
            Array.isArray(
              channelConfig === null || channelConfig === void 0 ? void 0 : channelConfig.users,
            ) &&
            channelConfig.users.length > 0;
          channelCommandAuthorized =
            isRoom && channelUsersAllowlistConfigured
              ? (0, allow_list_js_1.resolveSlackUserAllowed)({
                  allowList:
                    channelConfig === null || channelConfig === void 0
                      ? void 0
                      : channelConfig.users,
                  userId: senderId,
                  userName: senderName,
                })
              : false;
          commandGate = (0, command_gating_js_1.resolveControlCommandGate)({
            useAccessGroups: ctx.useAccessGroups,
            authorizers: [
              { configured: allowFromLower.length > 0, allowed: ownerAuthorized },
              { configured: channelUsersAllowlistConfigured, allowed: channelCommandAuthorized },
            ],
            allowTextCommands: allowTextCommands,
            hasControlCommand: hasControlCommandInMessage,
          });
          commandAuthorized = commandGate.commandAuthorized;
          if (isRoomish && commandGate.shouldBlock) {
            (0, logging_js_1.logInboundDrop)({
              log: globals_js_1.logVerbose,
              channel: "slack",
              reason: "control command (unauthorized)",
              target: senderId,
            });
            return [2 /*return*/, null];
          }
          shouldRequireMention = isRoom
            ? (_z =
                channelConfig === null || channelConfig === void 0
                  ? void 0
                  : channelConfig.requireMention) !== null && _z !== void 0
              ? _z
              : ctx.defaultRequireMention
            : false;
          canDetectMention = Boolean(ctx.botUserId) || mentionRegexes.length > 0;
          mentionGate = (0, mention_gating_js_1.resolveMentionGatingWithBypass)({
            isGroup: isRoom,
            requireMention: Boolean(shouldRequireMention),
            canDetectMention: canDetectMention,
            wasMentioned: wasMentioned,
            implicitMention: implicitMention,
            hasAnyMention: hasAnyMention,
            allowTextCommands: allowTextCommands,
            hasControlCommand: hasControlCommandInMessage,
            commandAuthorized: commandAuthorized,
          });
          effectiveWasMentioned = mentionGate.effectiveWasMentioned;
          if (isRoom && shouldRequireMention && mentionGate.shouldSkip) {
            ctx.logger.info(
              { channel: message.channel, reason: "no-mention" },
              "skipping channel message",
            );
            pendingText = ((_0 = message.text) !== null && _0 !== void 0 ? _0 : "").trim();
            fallbackFile = (
              (_2 = (_1 = message.files) === null || _1 === void 0 ? void 0 : _1[0]) === null ||
              _2 === void 0
                ? void 0
                : _2.name
            )
              ? "[Slack file: ".concat(message.files[0].name, "]")
              : ((_3 = message.files) === null || _3 === void 0 ? void 0 : _3.length)
                ? "[Slack file]"
                : "";
            pendingBody = pendingText || fallbackFile;
            (0, history_js_1.recordPendingHistoryEntryIfEnabled)({
              historyMap: ctx.channelHistories,
              historyKey: historyKey,
              limit: ctx.historyLimit,
              entry: pendingBody
                ? {
                    sender: senderName,
                    body: pendingBody,
                    timestamp: message.ts ? Math.round(Number(message.ts) * 1000) : undefined,
                    messageId: message.ts,
                  }
                : null,
            });
            return [2 /*return*/, null];
          }
          return [
            4 /*yield*/,
            (0, media_js_1.resolveSlackMedia)({
              files: message.files,
              token: ctx.botToken,
              maxBytes: ctx.mediaMaxBytes,
            }),
          ];
        case 16:
          media = _13.sent();
          rawBody =
            ((_4 = message.text) !== null && _4 !== void 0 ? _4 : "").trim() ||
            (media === null || media === void 0 ? void 0 : media.placeholder) ||
            "";
          if (!rawBody) {
            return [2 /*return*/, null];
          }
          ackReaction = (0, identity_js_1.resolveAckReaction)(cfg, route.agentId);
          ackReactionValue = ackReaction !== null && ackReaction !== void 0 ? ackReaction : "";
          shouldAckReaction = function () {
            return Boolean(
              ackReaction &&
              (0, ack_reactions_js_1.shouldAckReaction)({
                scope: ctx.ackReactionScope,
                isDirect: isDirectMessage,
                isGroup: isRoomish,
                isMentionableGroup: isRoom,
                requireMention: Boolean(shouldRequireMention),
                canDetectMention: canDetectMention,
                effectiveWasMentioned: effectiveWasMentioned,
                shouldBypassMention: mentionGate.shouldBypassMention,
              }),
            );
          };
          ackReactionMessageTs = message.ts;
          ackReactionPromise =
            shouldAckReaction() && ackReactionMessageTs && ackReactionValue
              ? (0, actions_js_1.reactSlackMessage)(
                  message.channel,
                  ackReactionMessageTs,
                  ackReactionValue,
                  {
                    token: ctx.botToken,
                    client: ctx.app.client,
                  },
                ).then(
                  function () {
                    return true;
                  },
                  function (err) {
                    (0, globals_js_1.logVerbose)(
                      "slack react failed for channel "
                        .concat(message.channel, ": ")
                        .concat(String(err)),
                    );
                    return false;
                  },
                )
              : null;
          roomLabel = channelName ? "#".concat(channelName) : "#".concat(message.channel);
          preview = rawBody.replace(/\s+/g, " ").slice(0, 160);
          inboundLabel = isDirectMessage
            ? "Slack DM from ".concat(senderName)
            : "Slack message in ".concat(roomLabel, " from ").concat(senderName);
          slackFrom = isDirectMessage
            ? "slack:".concat(message.user)
            : isRoom
              ? "slack:channel:".concat(message.channel)
              : "slack:group:".concat(message.channel);
          (0, system_events_js_1.enqueueSystemEvent)(
            "".concat(inboundLabel, ": ").concat(preview),
            {
              sessionKey: sessionKey,
              contextKey: "slack:message:"
                .concat(message.channel, ":")
                .concat((_5 = message.ts) !== null && _5 !== void 0 ? _5 : "unknown"),
            },
          );
          envelopeFrom =
            (_6 = (0, conversation_label_js_1.resolveConversationLabel)({
              ChatType: isDirectMessage ? "direct" : "channel",
              SenderName: senderName,
              GroupSubject: isRoomish ? roomLabel : undefined,
              From: slackFrom,
            })) !== null && _6 !== void 0
              ? _6
              : isDirectMessage
                ? senderName
                : roomLabel;
          textWithId = ""
            .concat(rawBody, "\n[slack message id: ")
            .concat(message.ts, " channel: ")
            .concat(message.channel, "]");
          storePath = (0, sessions_js_1.resolveStorePath)(
            (_7 = ctx.cfg.session) === null || _7 === void 0 ? void 0 : _7.store,
            {
              agentId: route.agentId,
            },
          );
          envelopeOptions = (0, envelope_js_1.resolveEnvelopeFormatOptions)(ctx.cfg);
          previousTimestamp = (0, sessions_js_1.readSessionUpdatedAt)({
            storePath: storePath,
            sessionKey: route.sessionKey,
          });
          body = (0, envelope_js_1.formatInboundEnvelope)({
            channel: "Slack",
            from: envelopeFrom,
            timestamp: message.ts ? Math.round(Number(message.ts) * 1000) : undefined,
            body: textWithId,
            chatType: isDirectMessage ? "direct" : "channel",
            sender: { name: senderName, id: senderId },
            previousTimestamp: previousTimestamp,
            envelope: envelopeOptions,
          });
          combinedBody = body;
          if (isRoomish && ctx.historyLimit > 0) {
            combinedBody = (0, history_js_1.buildPendingHistoryContextFromMap)({
              historyMap: ctx.channelHistories,
              historyKey: historyKey,
              limit: ctx.historyLimit,
              currentMessage: combinedBody,
              formatEntry: function (entry) {
                return (0, envelope_js_1.formatInboundEnvelope)({
                  channel: "Slack",
                  from: roomLabel,
                  timestamp: entry.timestamp,
                  body: ""
                    .concat(entry.body)
                    .concat(
                      entry.messageId
                        ? " [id:".concat(entry.messageId, " channel:").concat(message.channel, "]")
                        : "",
                    ),
                  chatType: "channel",
                  senderLabel: entry.sender,
                  envelope: envelopeOptions,
                });
              },
            });
          }
          slackTo = isDirectMessage
            ? "user:".concat(message.user)
            : "channel:".concat(message.channel);
          channelDescription = [
            channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.topic,
            channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.purpose,
          ]
            .map(function (entry) {
              return entry === null || entry === void 0 ? void 0 : entry.trim();
            })
            .filter(function (entry) {
              return Boolean(entry);
            })
            .filter(function (entry, index, list) {
              return list.indexOf(entry) === index;
            })
            .join("\n");
          systemPromptParts = [
            channelDescription ? "Channel description: ".concat(channelDescription) : null,
            ((_8 =
              channelConfig === null || channelConfig === void 0
                ? void 0
                : channelConfig.systemPrompt) === null || _8 === void 0
              ? void 0
              : _8.trim()) || null,
          ].filter(function (entry) {
            return Boolean(entry);
          });
          groupSystemPrompt =
            systemPromptParts.length > 0 ? systemPromptParts.join("\n\n") : undefined;
          threadStarterMedia = null;
          if (!(isThreadReply && threadTs)) {
            return [3 /*break*/, 24];
          }
          return [
            4 /*yield*/,
            (0, media_js_1.resolveSlackThreadStarter)({
              channelId: message.channel,
              threadTs: threadTs,
              client: ctx.app.client,
            }),
          ];
        case 17:
          starter = _13.sent();
          if (!(starter === null || starter === void 0 ? void 0 : starter.text)) {
            return [3 /*break*/, 23];
          }
          if (!starter.userId) {
            return [3 /*break*/, 19];
          }
          return [4 /*yield*/, ctx.resolveUserName(starter.userId)];
        case 18:
          _c = _13.sent();
          return [3 /*break*/, 20];
        case 19:
          _c = null;
          _13.label = 20;
        case 20:
          starterUser = _c;
          starterName =
            (_10 =
              (_9 = starterUser === null || starterUser === void 0 ? void 0 : starterUser.name) !==
                null && _9 !== void 0
                ? _9
                : starter.userId) !== null && _10 !== void 0
              ? _10
              : "Unknown";
          starterWithId = ""
            .concat(starter.text, "\n[slack message id: ")
            .concat((_11 = starter.ts) !== null && _11 !== void 0 ? _11 : threadTs, " channel: ")
            .concat(message.channel, "]");
          threadStarterBody = (0, envelope_js_1.formatThreadStarterEnvelope)({
            channel: "Slack",
            author: starterName,
            timestamp: starter.ts ? Math.round(Number(starter.ts) * 1000) : undefined,
            body: starterWithId,
            envelope: envelopeOptions,
          });
          snippet = starter.text.replace(/\s+/g, " ").slice(0, 80);
          threadLabel = "Slack thread "
            .concat(roomLabel)
            .concat(snippet ? ": ".concat(snippet) : "");
          if (!(!media && starter.files && starter.files.length > 0)) {
            return [3 /*break*/, 22];
          }
          return [
            4 /*yield*/,
            (0, media_js_1.resolveSlackMedia)({
              files: starter.files,
              token: ctx.botToken,
              maxBytes: ctx.mediaMaxBytes,
            }),
          ];
        case 21:
          threadStarterMedia = _13.sent();
          if (threadStarterMedia) {
            (0, globals_js_1.logVerbose)(
              "slack: hydrated thread starter file ".concat(
                threadStarterMedia.placeholder,
                " from root message",
              ),
            );
          }
          _13.label = 22;
        case 22:
          return [3 /*break*/, 24];
        case 23:
          threadLabel = "Slack thread ".concat(roomLabel);
          _13.label = 24;
        case 24:
          effectiveMedia = media !== null && media !== void 0 ? media : threadStarterMedia;
          ctxPayload = (0, inbound_context_js_1.finalizeInboundContext)({
            Body: combinedBody,
            RawBody: rawBody,
            CommandBody: rawBody,
            From: slackFrom,
            To: slackTo,
            SessionKey: sessionKey,
            AccountId: route.accountId,
            ChatType: isDirectMessage ? "direct" : "channel",
            ConversationLabel: envelopeFrom,
            GroupSubject: isRoomish ? roomLabel : undefined,
            GroupSystemPrompt: isRoomish ? groupSystemPrompt : undefined,
            SenderName: senderName,
            SenderId: senderId,
            Provider: "slack",
            Surface: "slack",
            MessageSid: message.ts,
            ReplyToId: threadContext.replyToId,
            // Preserve thread context for routed tool notifications.
            MessageThreadId: threadContext.messageThreadId,
            ParentSessionKey: threadKeys.parentSessionKey,
            ThreadStarterBody: threadStarterBody,
            ThreadLabel: threadLabel,
            Timestamp: message.ts ? Math.round(Number(message.ts) * 1000) : undefined,
            WasMentioned: isRoomish ? effectiveWasMentioned : undefined,
            MediaPath:
              effectiveMedia === null || effectiveMedia === void 0 ? void 0 : effectiveMedia.path,
            MediaType:
              effectiveMedia === null || effectiveMedia === void 0
                ? void 0
                : effectiveMedia.contentType,
            MediaUrl:
              effectiveMedia === null || effectiveMedia === void 0 ? void 0 : effectiveMedia.path,
            CommandAuthorized: commandAuthorized,
            OriginatingChannel: "slack",
            OriginatingTo: slackTo,
          });
          return [
            4 /*yield*/,
            (0, session_js_1.recordInboundSession)({
              storePath: storePath,
              sessionKey: sessionKey,
              ctx: ctxPayload,
              updateLastRoute: isDirectMessage
                ? {
                    sessionKey: route.mainSessionKey,
                    channel: "slack",
                    to: "user:".concat(message.user),
                    accountId: route.accountId,
                  }
                : undefined,
              onRecordError: function (err) {
                ctx.logger.warn(
                  {
                    error: String(err),
                    storePath: storePath,
                    sessionKey: sessionKey,
                  },
                  "failed updating session meta",
                );
              },
            }),
          ];
        case 25:
          _13.sent();
          replyTarget = (_12 = ctxPayload.To) !== null && _12 !== void 0 ? _12 : undefined;
          if (!replyTarget) {
            return [2 /*return*/, null];
          }
          if ((0, globals_js_1.shouldLogVerbose)()) {
            (0, globals_js_1.logVerbose)(
              "slack inbound: channel="
                .concat(message.channel, " from=")
                .concat(slackFrom, ' preview="')
                .concat(preview, '"'),
            );
          }
          return [
            2 /*return*/,
            {
              ctx: ctx,
              account: account,
              message: message,
              route: route,
              channelConfig: channelConfig,
              replyTarget: replyTarget,
              ctxPayload: ctxPayload,
              isDirectMessage: isDirectMessage,
              isRoomish: isRoomish,
              historyKey: historyKey,
              preview: preview,
              ackReactionMessageTs: ackReactionMessageTs,
              ackReactionValue: ackReactionValue,
              ackReactionPromise: ackReactionPromise,
            },
          ];
      }
    });
  });
}
