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
exports.preflightDiscordMessage = preflightDiscordMessage;
var carbon_1 = require("@buape/carbon");
var command_detection_js_1 = require("../../auto-reply/command-detection.js");
var commands_registry_js_1 = require("../../auto-reply/commands-registry.js");
var history_js_1 = require("../../auto-reply/reply/history.js");
var mentions_js_1 = require("../../auto-reply/reply/mentions.js");
var globals_js_1 = require("../../globals.js");
var channel_activity_js_1 = require("../../infra/channel-activity.js");
var system_events_js_1 = require("../../infra/system-events.js");
var logging_js_1 = require("../../logging.js");
var pairing_messages_js_1 = require("../../pairing/pairing-messages.js");
var pairing_store_js_1 = require("../../pairing/pairing-store.js");
var resolve_route_js_1 = require("../../routing/resolve-route.js");
var mention_gating_js_1 = require("../../channels/mention-gating.js");
var allowlist_match_js_1 = require("../../channels/allowlist-match.js");
var send_js_1 = require("../send.js");
var command_gating_js_1 = require("../../channels/command-gating.js");
var logging_js_2 = require("../../channels/logging.js");
var allow_list_js_1 = require("./allow-list.js");
var format_js_1 = require("./format.js");
var message_utils_js_1 = require("./message-utils.js");
var system_events_js_2 = require("./system-events.js");
var threading_js_1 = require("./threading.js");
function preflightDiscordMessage(params) {
  return __awaiter(this, void 0, void 0, function () {
    var logger,
      message,
      author,
      allowBots,
      isGuildMessage,
      channelInfo,
      isDirectMessage,
      isGroupDm,
      dmPolicy,
      commandAuthorized,
      storeAllowFrom,
      effectiveAllowFrom,
      allowList,
      allowMatch,
      allowMatchMeta,
      permitted,
      _a,
      code,
      created,
      err_1,
      botId,
      baseText,
      messageText,
      route,
      mentionRegexes,
      explicitlyMentioned,
      hasAnyMention,
      wasMentioned,
      implicitMention,
      guildInfo,
      channelName,
      threadChannel,
      threadParentId,
      threadParentName,
      threadParentType,
      parentInfo,
      threadName,
      configChannelName,
      configChannelSlug,
      displayChannelName,
      displayChannelSlug,
      guildSlug,
      threadChannelSlug,
      threadParentSlug,
      baseSessionKey,
      channelConfig,
      channelMatchMeta,
      groupDmAllowed,
      channelAllowlistConfigured,
      channelAllowed,
      textForHistory,
      historyEntry,
      threadOwnerId,
      shouldRequireMention,
      allowTextCommands,
      hasControlCommandInMessage,
      ownerAllowList,
      ownerOk,
      channelUsers,
      usersOk,
      useAccessGroups,
      commandGate,
      canDetectMention,
      mentionGate,
      effectiveWasMentioned,
      channelUsers,
      userOk,
      systemLocation,
      systemText;
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
      _7;
    return __generator(this, function (_8) {
      switch (_8.label) {
        case 0:
          logger = (0, logging_js_1.getChildLogger)({ module: "discord-auto-reply" });
          message = params.data.message;
          author = params.data.author;
          if (!author) {
            return [2 /*return*/, null];
          }
          allowBots =
            (_c = (_b = params.discordConfig) === null || _b === void 0 ? void 0 : _b.allowBots) !==
              null && _c !== void 0
              ? _c
              : false;
          if (author.bot) {
            // Always ignore own messages to prevent self-reply loops
            if (params.botUserId && author.id === params.botUserId) {
              return [2 /*return*/, null];
            }
            if (!allowBots) {
              (0, globals_js_1.logVerbose)("discord: drop bot message (allowBots=false)");
              return [2 /*return*/, null];
            }
          }
          isGuildMessage = Boolean(params.data.guild_id);
          return [
            4 /*yield*/,
            (0, message_utils_js_1.resolveDiscordChannelInfo)(params.client, message.channelId),
          ];
        case 1:
          channelInfo = _8.sent();
          isDirectMessage =
            (channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.type) ===
            carbon_1.ChannelType.DM;
          isGroupDm =
            (channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.type) ===
            carbon_1.ChannelType.GroupDM;
          if (isGroupDm && !params.groupDmEnabled) {
            (0, globals_js_1.logVerbose)("discord: drop group dm (group dms disabled)");
            return [2 /*return*/, null];
          }
          if (isDirectMessage && !params.dmEnabled) {
            (0, globals_js_1.logVerbose)("discord: drop dm (dms disabled)");
            return [2 /*return*/, null];
          }
          dmPolicy =
            (_f =
              (_e = (_d = params.discordConfig) === null || _d === void 0 ? void 0 : _d.dm) ===
                null || _e === void 0
                ? void 0
                : _e.policy) !== null && _f !== void 0
              ? _f
              : "pairing";
          commandAuthorized = true;
          if (!isDirectMessage) {
            return [3 /*break*/, 11];
          }
          if (dmPolicy === "disabled") {
            (0, globals_js_1.logVerbose)("discord: drop dm (dmPolicy: disabled)");
            return [2 /*return*/, null];
          }
          if (!(dmPolicy !== "open")) {
            return [3 /*break*/, 11];
          }
          return [
            4 /*yield*/,
            (0, pairing_store_js_1.readChannelAllowFromStore)("discord").catch(function () {
              return [];
            }),
          ];
        case 2:
          storeAllowFrom = _8.sent();
          effectiveAllowFrom = __spreadArray(
            __spreadArray([], (_g = params.allowFrom) !== null && _g !== void 0 ? _g : [], true),
            storeAllowFrom,
            true,
          );
          allowList = (0, allow_list_js_1.normalizeDiscordAllowList)(effectiveAllowFrom, [
            "discord:",
            "user:",
          ]);
          allowMatch = allowList
            ? (0, allow_list_js_1.resolveDiscordAllowListMatch)({
                allowList: allowList,
                candidate: {
                  id: author.id,
                  name: author.username,
                  tag: (0, format_js_1.formatDiscordUserTag)(author),
                },
              })
            : { allowed: false };
          allowMatchMeta = (0, allowlist_match_js_1.formatAllowlistMatchMeta)(allowMatch);
          permitted = allowMatch.allowed;
          if (!!permitted) {
            return [3 /*break*/, 10];
          }
          commandAuthorized = false;
          if (!(dmPolicy === "pairing")) {
            return [3 /*break*/, 8];
          }
          return [
            4 /*yield*/,
            (0, pairing_store_js_1.upsertChannelPairingRequest)({
              channel: "discord",
              id: author.id,
              meta: {
                tag: (0, format_js_1.formatDiscordUserTag)(author),
                name: (_h = author.username) !== null && _h !== void 0 ? _h : undefined,
              },
            }),
          ];
        case 3:
          ((_a = _8.sent()), (code = _a.code), (created = _a.created));
          if (!created) {
            return [3 /*break*/, 7];
          }
          (0, globals_js_1.logVerbose)(
            "discord pairing request sender="
              .concat(author.id, " tag=")
              .concat((0, format_js_1.formatDiscordUserTag)(author), " (")
              .concat(allowMatchMeta, ")"),
          );
          _8.label = 4;
        case 4:
          _8.trys.push([4, 6, , 7]);
          return [
            4 /*yield*/,
            (0, send_js_1.sendMessageDiscord)(
              "user:".concat(author.id),
              (0, pairing_messages_js_1.buildPairingReply)({
                channel: "discord",
                idLine: "Your Discord user id: ".concat(author.id),
                code: code,
              }),
              {
                token: params.token,
                rest: params.client.rest,
                accountId: params.accountId,
              },
            ),
          ];
        case 5:
          _8.sent();
          return [3 /*break*/, 7];
        case 6:
          err_1 = _8.sent();
          (0, globals_js_1.logVerbose)(
            "discord pairing reply failed for ".concat(author.id, ": ").concat(String(err_1)),
          );
          return [3 /*break*/, 7];
        case 7:
          return [3 /*break*/, 9];
        case 8:
          (0, globals_js_1.logVerbose)(
            "Blocked unauthorized discord sender "
              .concat(author.id, " (dmPolicy=")
              .concat(dmPolicy, ", ")
              .concat(allowMatchMeta, ")"),
          );
          _8.label = 9;
        case 9:
          return [2 /*return*/, null];
        case 10:
          commandAuthorized = true;
          _8.label = 11;
        case 11:
          botId = params.botUserId;
          baseText = (0, message_utils_js_1.resolveDiscordMessageText)(message, {
            includeForwarded: false,
          });
          messageText = (0, message_utils_js_1.resolveDiscordMessageText)(message, {
            includeForwarded: true,
          });
          (0, channel_activity_js_1.recordChannelActivity)({
            channel: "discord",
            accountId: params.accountId,
            direction: "inbound",
          });
          route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: params.cfg,
            channel: "discord",
            accountId: params.accountId,
            guildId: (_j = params.data.guild_id) !== null && _j !== void 0 ? _j : undefined,
            peer: {
              kind: isDirectMessage ? "dm" : isGroupDm ? "group" : "channel",
              id: isDirectMessage ? author.id : message.channelId,
            },
          });
          mentionRegexes = (0, mentions_js_1.buildMentionRegexes)(params.cfg, route.agentId);
          explicitlyMentioned = Boolean(
            botId &&
            ((_k = message.mentionedUsers) === null || _k === void 0
              ? void 0
              : _k.some(function (user) {
                  return user.id === botId;
                })),
          );
          hasAnyMention = Boolean(
            !isDirectMessage &&
            (message.mentionedEveryone ||
              ((_m =
                (_l = message.mentionedUsers) === null || _l === void 0 ? void 0 : _l.length) !==
                null && _m !== void 0
                ? _m
                : 0) > 0 ||
              ((_p =
                (_o = message.mentionedRoles) === null || _o === void 0 ? void 0 : _o.length) !==
                null && _p !== void 0
                ? _p
                : 0) > 0),
          );
          wasMentioned =
            !isDirectMessage &&
            (0, mentions_js_1.matchesMentionWithExplicit)({
              text: baseText,
              mentionRegexes: mentionRegexes,
              explicit: {
                hasAnyMention: hasAnyMention,
                isExplicitlyMentioned: explicitlyMentioned,
                canResolveExplicit: Boolean(botId),
              },
            });
          implicitMention = Boolean(
            !isDirectMessage &&
            botId &&
            ((_r =
              (_q = message.referencedMessage) === null || _q === void 0 ? void 0 : _q.author) ===
              null || _r === void 0
              ? void 0
              : _r.id) &&
            message.referencedMessage.author.id === botId,
          );
          if ((0, globals_js_1.shouldLogVerbose)()) {
            (0, globals_js_1.logVerbose)(
              "discord: inbound id="
                .concat(message.id, " guild=")
                .concat(
                  (_t = (_s = message.guild) === null || _s === void 0 ? void 0 : _s.id) !== null &&
                    _t !== void 0
                    ? _t
                    : "dm",
                  " channel=",
                )
                .concat(message.channelId, " mention=")
                .concat(wasMentioned ? "yes" : "no", " type=")
                .concat(isDirectMessage ? "dm" : isGroupDm ? "group-dm" : "guild", " content=")
                .concat(messageText ? "yes" : "no"),
            );
          }
          if (
            isGuildMessage &&
            (message.type === carbon_1.MessageType.ChatInputCommand ||
              message.type === carbon_1.MessageType.ContextMenuCommand)
          ) {
            (0, globals_js_1.logVerbose)("discord: drop channel command message");
            return [2 /*return*/, null];
          }
          guildInfo = isGuildMessage
            ? (0, allow_list_js_1.resolveDiscordGuildEntry)({
                guild: (_u = params.data.guild) !== null && _u !== void 0 ? _u : undefined,
                guildEntries: params.guildEntries,
              })
            : null;
          if (
            isGuildMessage &&
            params.guildEntries &&
            Object.keys(params.guildEntries).length > 0 &&
            !guildInfo
          ) {
            (0, globals_js_1.logVerbose)(
              "Blocked discord guild ".concat(
                (_v = params.data.guild_id) !== null && _v !== void 0 ? _v : "unknown",
                " (not in discord.guilds)",
              ),
            );
            return [2 /*return*/, null];
          }
          channelName =
            (_w = channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name) !==
              null && _w !== void 0
              ? _w
              : (isGuildMessage || isGroupDm) && message.channel && "name" in message.channel
                ? message.channel.name
                : undefined;
          threadChannel = (0, threading_js_1.resolveDiscordThreadChannel)({
            isGuildMessage: isGuildMessage,
            message: message,
            channelInfo: channelInfo,
          });
          if (!threadChannel) {
            return [3 /*break*/, 13];
          }
          return [
            4 /*yield*/,
            (0, threading_js_1.resolveDiscordThreadParentInfo)({
              client: params.client,
              threadChannel: threadChannel,
              channelInfo: channelInfo,
            }),
          ];
        case 12:
          parentInfo = _8.sent();
          threadParentId = parentInfo.id;
          threadParentName = parentInfo.name;
          threadParentType = parentInfo.type;
          _8.label = 13;
        case 13:
          threadName =
            threadChannel === null || threadChannel === void 0 ? void 0 : threadChannel.name;
          configChannelName =
            threadParentName !== null && threadParentName !== void 0
              ? threadParentName
              : channelName;
          configChannelSlug = configChannelName
            ? (0, allow_list_js_1.normalizeDiscordSlug)(configChannelName)
            : "";
          displayChannelName =
            threadName !== null && threadName !== void 0 ? threadName : channelName;
          displayChannelSlug = displayChannelName
            ? (0, allow_list_js_1.normalizeDiscordSlug)(displayChannelName)
            : "";
          guildSlug =
            (guildInfo === null || guildInfo === void 0 ? void 0 : guildInfo.slug) ||
            (((_x = params.data.guild) === null || _x === void 0 ? void 0 : _x.name)
              ? (0, allow_list_js_1.normalizeDiscordSlug)(params.data.guild.name)
              : "");
          threadChannelSlug = channelName
            ? (0, allow_list_js_1.normalizeDiscordSlug)(channelName)
            : "";
          threadParentSlug = threadParentName
            ? (0, allow_list_js_1.normalizeDiscordSlug)(threadParentName)
            : "";
          baseSessionKey = route.sessionKey;
          channelConfig = isGuildMessage
            ? (0, allow_list_js_1.resolveDiscordChannelConfigWithFallback)({
                guildInfo: guildInfo,
                channelId: message.channelId,
                channelName: channelName,
                channelSlug: threadChannelSlug,
                parentId:
                  threadParentId !== null && threadParentId !== void 0 ? threadParentId : undefined,
                parentName:
                  threadParentName !== null && threadParentName !== void 0
                    ? threadParentName
                    : undefined,
                parentSlug: threadParentSlug,
                scope: threadChannel ? "thread" : "channel",
              })
            : null;
          channelMatchMeta = (0, allowlist_match_js_1.formatAllowlistMatchMeta)(channelConfig);
          if (
            isGuildMessage &&
            (channelConfig === null || channelConfig === void 0
              ? void 0
              : channelConfig.enabled) === false
          ) {
            (0, globals_js_1.logVerbose)(
              "Blocked discord channel "
                .concat(message.channelId, " (channel disabled, ")
                .concat(channelMatchMeta, ")"),
            );
            return [2 /*return*/, null];
          }
          groupDmAllowed =
            isGroupDm &&
            (0, allow_list_js_1.resolveGroupDmAllow)({
              channels: params.groupDmChannels,
              channelId: message.channelId,
              channelName: displayChannelName,
              channelSlug: displayChannelSlug,
            });
          if (isGroupDm && !groupDmAllowed) {
            return [2 /*return*/, null];
          }
          channelAllowlistConfigured =
            Boolean(guildInfo === null || guildInfo === void 0 ? void 0 : guildInfo.channels) &&
            Object.keys(
              (_y = guildInfo === null || guildInfo === void 0 ? void 0 : guildInfo.channels) !==
                null && _y !== void 0
                ? _y
                : {},
            ).length > 0;
          channelAllowed =
            (channelConfig === null || channelConfig === void 0
              ? void 0
              : channelConfig.allowed) !== false;
          if (
            isGuildMessage &&
            !(0, allow_list_js_1.isDiscordGroupAllowedByPolicy)({
              groupPolicy: params.groupPolicy,
              guildAllowlisted: Boolean(guildInfo),
              channelAllowlistConfigured: channelAllowlistConfigured,
              channelAllowed: channelAllowed,
            })
          ) {
            if (params.groupPolicy === "disabled") {
              (0, globals_js_1.logVerbose)(
                "discord: drop guild message (groupPolicy: disabled, ".concat(
                  channelMatchMeta,
                  ")",
                ),
              );
            } else if (!channelAllowlistConfigured) {
              (0, globals_js_1.logVerbose)(
                "discord: drop guild message (groupPolicy: allowlist, no channel allowlist, ".concat(
                  channelMatchMeta,
                  ")",
                ),
              );
            } else {
              (0, globals_js_1.logVerbose)(
                "Blocked discord channel "
                  .concat(
                    message.channelId,
                    " not in guild channel allowlist (groupPolicy: allowlist, ",
                  )
                  .concat(channelMatchMeta, ")"),
              );
            }
            return [2 /*return*/, null];
          }
          if (
            isGuildMessage &&
            (channelConfig === null || channelConfig === void 0
              ? void 0
              : channelConfig.allowed) === false
          ) {
            (0, globals_js_1.logVerbose)(
              "Blocked discord channel "
                .concat(message.channelId, " not in guild channel allowlist (")
                .concat(channelMatchMeta, ")"),
            );
            return [2 /*return*/, null];
          }
          if (isGuildMessage) {
            (0, globals_js_1.logVerbose)(
              "discord: allow channel "
                .concat(message.channelId, " (")
                .concat(channelMatchMeta, ")"),
            );
          }
          textForHistory = (0, message_utils_js_1.resolveDiscordMessageText)(message, {
            includeForwarded: true,
          });
          historyEntry =
            isGuildMessage && params.historyLimit > 0 && textForHistory
              ? {
                  sender:
                    (_2 =
                      (_1 =
                        (_0 =
                          (_z = params.data.member) === null || _z === void 0
                            ? void 0
                            : _z.nickname) !== null && _0 !== void 0
                          ? _0
                          : author.globalName) !== null && _1 !== void 0
                        ? _1
                        : author.username) !== null && _2 !== void 0
                      ? _2
                      : author.id,
                  body: textForHistory,
                  timestamp: (0, format_js_1.resolveTimestampMs)(message.timestamp),
                  messageId: message.id,
                }
              : undefined;
          threadOwnerId = threadChannel
            ? (_3 = threadChannel.ownerId) !== null && _3 !== void 0
              ? _3
              : channelInfo === null || channelInfo === void 0
                ? void 0
                : channelInfo.ownerId
            : undefined;
          shouldRequireMention = (0, allow_list_js_1.resolveDiscordShouldRequireMention)({
            isGuildMessage: isGuildMessage,
            isThread: Boolean(threadChannel),
            botId: botId,
            threadOwnerId: threadOwnerId,
            channelConfig: channelConfig,
            guildInfo: guildInfo,
          });
          allowTextCommands = (0, commands_registry_js_1.shouldHandleTextCommands)({
            cfg: params.cfg,
            surface: "discord",
          });
          hasControlCommandInMessage = (0, command_detection_js_1.hasControlCommand)(
            baseText,
            params.cfg,
          );
          if (!isDirectMessage) {
            ownerAllowList = (0, allow_list_js_1.normalizeDiscordAllowList)(params.allowFrom, [
              "discord:",
              "user:",
            ]);
            ownerOk = ownerAllowList
              ? (0, allow_list_js_1.allowListMatches)(ownerAllowList, {
                  id: author.id,
                  name: author.username,
                  tag: (0, format_js_1.formatDiscordUserTag)(author),
                })
              : false;
            channelUsers =
              (_4 =
                channelConfig === null || channelConfig === void 0
                  ? void 0
                  : channelConfig.users) !== null && _4 !== void 0
                ? _4
                : guildInfo === null || guildInfo === void 0
                  ? void 0
                  : guildInfo.users;
            usersOk =
              Array.isArray(channelUsers) && channelUsers.length > 0
                ? (0, allow_list_js_1.resolveDiscordUserAllowed)({
                    allowList: channelUsers,
                    userId: author.id,
                    userName: author.username,
                    userTag: (0, format_js_1.formatDiscordUserTag)(author),
                  })
                : false;
            useAccessGroups =
              ((_5 = params.cfg.commands) === null || _5 === void 0
                ? void 0
                : _5.useAccessGroups) !== false;
            commandGate = (0, command_gating_js_1.resolveControlCommandGate)({
              useAccessGroups: useAccessGroups,
              authorizers: [
                { configured: ownerAllowList != null, allowed: ownerOk },
                {
                  configured: Array.isArray(channelUsers) && channelUsers.length > 0,
                  allowed: usersOk,
                },
              ],
              modeWhenAccessGroupsOff: "configured",
              allowTextCommands: allowTextCommands,
              hasControlCommand: hasControlCommandInMessage,
            });
            commandAuthorized = commandGate.commandAuthorized;
            if (commandGate.shouldBlock) {
              (0, logging_js_2.logInboundDrop)({
                log: globals_js_1.logVerbose,
                channel: "discord",
                reason: "control command (unauthorized)",
                target: author.id,
              });
              return [2 /*return*/, null];
            }
          }
          canDetectMention = Boolean(botId) || mentionRegexes.length > 0;
          mentionGate = (0, mention_gating_js_1.resolveMentionGatingWithBypass)({
            isGroup: isGuildMessage,
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
          if (isGuildMessage && shouldRequireMention) {
            if (botId && mentionGate.shouldSkip) {
              (0, globals_js_1.logVerbose)(
                "discord: drop guild message (mention required, botId=".concat(botId, ")"),
              );
              logger.info(
                {
                  channelId: message.channelId,
                  reason: "no-mention",
                },
                "discord: skipping guild message",
              );
              (0, history_js_1.recordPendingHistoryEntryIfEnabled)({
                historyMap: params.guildHistories,
                historyKey: message.channelId,
                limit: params.historyLimit,
                entry: historyEntry !== null && historyEntry !== void 0 ? historyEntry : null,
              });
              return [2 /*return*/, null];
            }
          }
          if (isGuildMessage) {
            channelUsers =
              (_6 =
                channelConfig === null || channelConfig === void 0
                  ? void 0
                  : channelConfig.users) !== null && _6 !== void 0
                ? _6
                : guildInfo === null || guildInfo === void 0
                  ? void 0
                  : guildInfo.users;
            if (Array.isArray(channelUsers) && channelUsers.length > 0) {
              userOk = (0, allow_list_js_1.resolveDiscordUserAllowed)({
                allowList: channelUsers,
                userId: author.id,
                userName: author.username,
                userTag: (0, format_js_1.formatDiscordUserTag)(author),
              });
              if (!userOk) {
                (0, globals_js_1.logVerbose)(
                  "Blocked discord guild sender ".concat(
                    author.id,
                    " (not in channel users allowlist)",
                  ),
                );
                return [2 /*return*/, null];
              }
            }
          }
          systemLocation = (0, format_js_1.resolveDiscordSystemLocation)({
            isDirectMessage: isDirectMessage,
            isGroupDm: isGroupDm,
            guild: (_7 = params.data.guild) !== null && _7 !== void 0 ? _7 : undefined,
            channelName:
              channelName !== null && channelName !== void 0 ? channelName : message.channelId,
          });
          systemText = (0, system_events_js_2.resolveDiscordSystemEvent)(message, systemLocation);
          if (systemText) {
            (0, system_events_js_1.enqueueSystemEvent)(systemText, {
              sessionKey: route.sessionKey,
              contextKey: "discord:system:".concat(message.channelId, ":").concat(message.id),
            });
            return [2 /*return*/, null];
          }
          if (!messageText) {
            (0, globals_js_1.logVerbose)(
              "discord: drop message ".concat(message.id, " (empty content)"),
            );
            return [2 /*return*/, null];
          }
          return [
            2 /*return*/,
            {
              cfg: params.cfg,
              discordConfig: params.discordConfig,
              accountId: params.accountId,
              token: params.token,
              runtime: params.runtime,
              botUserId: params.botUserId,
              guildHistories: params.guildHistories,
              historyLimit: params.historyLimit,
              mediaMaxBytes: params.mediaMaxBytes,
              textLimit: params.textLimit,
              replyToMode: params.replyToMode,
              ackReactionScope: params.ackReactionScope,
              groupPolicy: params.groupPolicy,
              data: params.data,
              client: params.client,
              message: message,
              author: author,
              channelInfo: channelInfo,
              channelName: channelName,
              isGuildMessage: isGuildMessage,
              isDirectMessage: isDirectMessage,
              isGroupDm: isGroupDm,
              commandAuthorized: commandAuthorized,
              baseText: baseText,
              messageText: messageText,
              wasMentioned: wasMentioned,
              route: route,
              guildInfo: guildInfo,
              guildSlug: guildSlug,
              threadChannel: threadChannel,
              threadParentId: threadParentId,
              threadParentName: threadParentName,
              threadParentType: threadParentType,
              threadName: threadName,
              configChannelName: configChannelName,
              configChannelSlug: configChannelSlug,
              displayChannelName: displayChannelName,
              displayChannelSlug: displayChannelSlug,
              baseSessionKey: baseSessionKey,
              channelConfig: channelConfig,
              channelAllowlistConfigured: channelAllowlistConfigured,
              channelAllowed: channelAllowed,
              shouldRequireMention: shouldRequireMention,
              hasAnyMention: hasAnyMention,
              allowTextCommands: allowTextCommands,
              shouldBypassMention: mentionGate.shouldBypassMention,
              effectiveWasMentioned: effectiveWasMentioned,
              canDetectMention: canDetectMention,
              historyEntry: historyEntry,
            },
          ];
      }
    });
  });
}
