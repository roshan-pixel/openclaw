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
exports.buildTelegramMessageContext = void 0;
var identity_js_1 = require("../agents/identity.js");
var model_catalog_js_1 = require("../agents/model-catalog.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var command_detection_js_1 = require("../auto-reply/command-detection.js");
var commands_registry_js_1 = require("../auto-reply/commands-registry.js");
var envelope_js_1 = require("../auto-reply/envelope.js");
var history_js_1 = require("../auto-reply/reply/history.js");
var inbound_context_js_1 = require("../auto-reply/reply/inbound-context.js");
var mentions_js_1 = require("../auto-reply/reply/mentions.js");
var location_js_1 = require("../channels/location.js");
var session_js_1 = require("../channels/session.js");
var command_format_js_1 = require("../cli/command-format.js");
var sessions_js_1 = require("../config/sessions.js");
var globals_js_1 = require("../globals.js");
var channel_activity_js_1 = require("../infra/channel-activity.js");
var resolve_route_js_1 = require("../routing/resolve-route.js");
var session_key_js_1 = require("../routing/session-key.js");
var ack_reactions_js_1 = require("../channels/ack-reactions.js");
var mention_gating_js_1 = require("../channels/mention-gating.js");
var command_gating_js_1 = require("../channels/command-gating.js");
var logging_js_1 = require("../channels/logging.js");
var api_logging_js_1 = require("./api-logging.js");
var helpers_js_1 = require("./bot/helpers.js");
var bot_access_js_1 = require("./bot-access.js");
var pairing_store_js_1 = require("./pairing-store.js");
function resolveStickerVisionSupport(params) {
  return __awaiter(this, void 0, void 0, function () {
    var catalog, defaultModel, entry, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: params.cfg })];
        case 1:
          catalog = _b.sent();
          defaultModel = (0, model_selection_js_1.resolveDefaultModelForAgent)({
            cfg: params.cfg,
            agentId: params.agentId,
          });
          entry = (0, model_catalog_js_1.findModelInCatalog)(
            catalog,
            defaultModel.provider,
            defaultModel.model,
          );
          if (!entry) {
            return [2 /*return*/, false];
          }
          return [2 /*return*/, (0, model_catalog_js_1.modelSupportsVision)(entry)];
        case 2:
          _a = _b.sent();
          return [2 /*return*/, false];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
var buildTelegramMessageContext = function (_a) {
  return __awaiter(void 0, [_a], void 0, function (_b) {
    var msg,
      chatId,
      isGroup,
      messageThreadId,
      isForum,
      resolvedThreadId,
      _c,
      groupConfig,
      topicConfig,
      peerId,
      route,
      baseSessionKey,
      dmThreadId,
      threadKeys,
      sessionKey,
      mentionRegexes,
      effectiveDmAllow,
      groupAllowOverride,
      effectiveGroupAllow,
      hasGroupAllowOverride,
      sendTyping,
      sendRecordVoice,
      candidate,
      senderUsername_1,
      allowMatch,
      allowMatchMeta,
      allowed,
      from,
      telegramUserId_1,
      _d,
      code_1,
      created,
      err_1,
      botUsername,
      senderId,
      senderUsername,
      allowed,
      allowForCommands,
      senderAllowedForCommands,
      useAccessGroups,
      hasControlCommandInMessage,
      commandGate,
      commandAuthorized,
      historyKey,
      placeholder,
      cachedStickerDescription,
      stickerSupportsVision,
      _e,
      stickerCacheHit,
      emoji,
      setName,
      stickerContext,
      locationData,
      locationText,
      rawTextSource,
      rawText,
      rawBody,
      bodyText,
      hasAnyMention,
      explicitlyMentioned,
      computedWasMentioned,
      wasMentioned,
      activationOverride,
      baseRequireMention,
      requireMention,
      botId,
      replyFromId,
      implicitMention,
      canDetectMention,
      mentionGate,
      effectiveWasMentioned,
      ackReaction,
      removeAckAfterReply,
      shouldAckReaction,
      api,
      reactionApi,
      ackReactionPromise,
      replyTarget,
      forwardOrigin,
      replySuffix,
      forwardPrefix,
      groupLabel,
      senderName,
      conversationLabel,
      storePath,
      envelopeOptions,
      previousTimestamp,
      body,
      combinedBody,
      skillFilter,
      systemPromptParts,
      groupSystemPrompt,
      commandBody,
      ctxPayload,
      preview,
      preview,
      mediaInfo,
      topicInfo;
    var _f,
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
      _12,
      _13,
      _14,
      _15,
      _16,
      _17,
      _18,
      _19,
      _20,
      _21,
      _22,
      _23;
    var primaryCtx = _b.primaryCtx,
      allMedia = _b.allMedia,
      storeAllowFrom = _b.storeAllowFrom,
      options = _b.options,
      bot = _b.bot,
      cfg = _b.cfg,
      account = _b.account,
      historyLimit = _b.historyLimit,
      groupHistories = _b.groupHistories,
      dmPolicy = _b.dmPolicy,
      allowFrom = _b.allowFrom,
      groupAllowFrom = _b.groupAllowFrom,
      ackReactionScope = _b.ackReactionScope,
      logger = _b.logger,
      resolveGroupActivation = _b.resolveGroupActivation,
      resolveGroupRequireMention = _b.resolveGroupRequireMention,
      resolveTelegramGroupConfig = _b.resolveTelegramGroupConfig;
    return __generator(this, function (_24) {
      switch (_24.label) {
        case 0:
          msg = primaryCtx.message;
          (0, channel_activity_js_1.recordChannelActivity)({
            channel: "telegram",
            accountId: account.accountId,
            direction: "inbound",
          });
          chatId = msg.chat.id;
          isGroup = msg.chat.type === "group" || msg.chat.type === "supergroup";
          messageThreadId = msg.message_thread_id;
          isForum = msg.chat.is_forum === true;
          resolvedThreadId = (0, helpers_js_1.resolveTelegramForumThreadId)({
            isForum: isForum,
            messageThreadId: messageThreadId,
          });
          ((_c = resolveTelegramGroupConfig(chatId, resolvedThreadId)),
            (groupConfig = _c.groupConfig),
            (topicConfig = _c.topicConfig));
          peerId = isGroup
            ? (0, helpers_js_1.buildTelegramGroupPeerId)(chatId, resolvedThreadId)
            : String(chatId);
          route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "telegram",
            accountId: account.accountId,
            peer: {
              kind: isGroup ? "group" : "dm",
              id: peerId,
            },
          });
          baseSessionKey = route.sessionKey;
          dmThreadId = !isGroup ? messageThreadId : undefined;
          threadKeys =
            dmThreadId != null
              ? (0, session_key_js_1.resolveThreadSessionKeys)({
                  baseSessionKey: baseSessionKey,
                  threadId: String(dmThreadId),
                })
              : null;
          sessionKey =
            (_f = threadKeys === null || threadKeys === void 0 ? void 0 : threadKeys.sessionKey) !==
              null && _f !== void 0
              ? _f
              : baseSessionKey;
          mentionRegexes = (0, mentions_js_1.buildMentionRegexes)(cfg, route.agentId);
          effectiveDmAllow = (0, bot_access_js_1.normalizeAllowFromWithStore)({
            allowFrom: allowFrom,
            storeAllowFrom: storeAllowFrom,
          });
          groupAllowOverride = (0, bot_access_js_1.firstDefined)(
            topicConfig === null || topicConfig === void 0 ? void 0 : topicConfig.allowFrom,
            groupConfig === null || groupConfig === void 0 ? void 0 : groupConfig.allowFrom,
          );
          effectiveGroupAllow = (0, bot_access_js_1.normalizeAllowFromWithStore)({
            allowFrom:
              groupAllowOverride !== null && groupAllowOverride !== void 0
                ? groupAllowOverride
                : groupAllowFrom,
            storeAllowFrom: storeAllowFrom,
          });
          hasGroupAllowOverride = typeof groupAllowOverride !== "undefined";
          if (
            isGroup &&
            (groupConfig === null || groupConfig === void 0 ? void 0 : groupConfig.enabled) ===
              false
          ) {
            (0, globals_js_1.logVerbose)(
              "Blocked telegram group ".concat(chatId, " (group disabled)"),
            );
            return [2 /*return*/, null];
          }
          if (
            isGroup &&
            (topicConfig === null || topicConfig === void 0 ? void 0 : topicConfig.enabled) ===
              false
          ) {
            (0, globals_js_1.logVerbose)(
              "Blocked telegram topic "
                .concat(chatId, " (")
                .concat(
                  resolvedThreadId !== null && resolvedThreadId !== void 0
                    ? resolvedThreadId
                    : "unknown",
                  ") (topic disabled)",
                ),
            );
            return [2 /*return*/, null];
          }
          sendTyping = function () {
            return __awaiter(void 0, void 0, void 0, function () {
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    return [
                      4 /*yield*/,
                      (0, api_logging_js_1.withTelegramApiErrorLogging)({
                        operation: "sendChatAction",
                        fn: function () {
                          return bot.api.sendChatAction(
                            chatId,
                            "typing",
                            (0, helpers_js_1.buildTypingThreadParams)(resolvedThreadId),
                          );
                        },
                      }),
                    ];
                  case 1:
                    _a.sent();
                    return [2 /*return*/];
                }
              });
            });
          };
          sendRecordVoice = function () {
            return __awaiter(void 0, void 0, void 0, function () {
              var err_2;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [
                      4 /*yield*/,
                      (0, api_logging_js_1.withTelegramApiErrorLogging)({
                        operation: "sendChatAction",
                        fn: function () {
                          return bot.api.sendChatAction(
                            chatId,
                            "record_voice",
                            (0, helpers_js_1.buildTypingThreadParams)(resolvedThreadId),
                          );
                        },
                      }),
                    ];
                  case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                  case 2:
                    err_2 = _a.sent();
                    (0, globals_js_1.logVerbose)(
                      "telegram record_voice cue failed for chat "
                        .concat(chatId, ": ")
                        .concat(String(err_2)),
                    );
                    return [3 /*break*/, 3];
                  case 3:
                    return [2 /*return*/];
                }
              });
            });
          };
          if (!!isGroup) {
            return [3 /*break*/, 9];
          }
          if (dmPolicy === "disabled") {
            return [2 /*return*/, null];
          }
          if (!(dmPolicy !== "open")) {
            return [3 /*break*/, 9];
          }
          candidate = String(chatId);
          senderUsername_1 =
            (_h = (_g = msg.from) === null || _g === void 0 ? void 0 : _g.username) !== null &&
            _h !== void 0
              ? _h
              : "";
          allowMatch = (0, bot_access_js_1.resolveSenderAllowMatch)({
            allow: effectiveDmAllow,
            senderId: candidate,
            senderUsername: senderUsername_1,
          });
          allowMatchMeta = "matchKey="
            .concat(
              (_j = allowMatch.matchKey) !== null && _j !== void 0 ? _j : "none",
              " matchSource=",
            )
            .concat((_k = allowMatch.matchSource) !== null && _k !== void 0 ? _k : "none");
          allowed =
            effectiveDmAllow.hasWildcard || (effectiveDmAllow.hasEntries && allowMatch.allowed);
          if (!!allowed) {
            return [3 /*break*/, 9];
          }
          if (!(dmPolicy === "pairing")) {
            return [3 /*break*/, 7];
          }
          _24.label = 1;
        case 1:
          _24.trys.push([1, 5, , 6]);
          from = msg.from;
          telegramUserId_1 = (from === null || from === void 0 ? void 0 : from.id)
            ? String(from.id)
            : candidate;
          return [
            4 /*yield*/,
            (0, pairing_store_js_1.upsertTelegramPairingRequest)({
              chatId: candidate,
              username: from === null || from === void 0 ? void 0 : from.username,
              firstName: from === null || from === void 0 ? void 0 : from.first_name,
              lastName: from === null || from === void 0 ? void 0 : from.last_name,
            }),
          ];
        case 2:
          ((_d = _24.sent()), (code_1 = _d.code), (created = _d.created));
          if (!created) {
            return [3 /*break*/, 4];
          }
          logger.info(
            {
              chatId: candidate,
              username: from === null || from === void 0 ? void 0 : from.username,
              firstName: from === null || from === void 0 ? void 0 : from.first_name,
              lastName: from === null || from === void 0 ? void 0 : from.last_name,
              matchKey: (_l = allowMatch.matchKey) !== null && _l !== void 0 ? _l : "none",
              matchSource: (_m = allowMatch.matchSource) !== null && _m !== void 0 ? _m : "none",
            },
            "telegram pairing request",
          );
          return [
            4 /*yield*/,
            (0, api_logging_js_1.withTelegramApiErrorLogging)({
              operation: "sendMessage",
              fn: function () {
                return bot.api.sendMessage(
                  chatId,
                  [
                    "OpenClaw: access not configured.",
                    "",
                    "Your Telegram user id: ".concat(telegramUserId_1),
                    "",
                    "Pairing code: ".concat(code_1),
                    "",
                    "Ask the bot owner to approve with:",
                    (0, command_format_js_1.formatCliCommand)(
                      "openclaw pairing approve telegram <code>",
                    ),
                  ].join("\n"),
                );
              },
            }),
          ];
        case 3:
          _24.sent();
          _24.label = 4;
        case 4:
          return [3 /*break*/, 6];
        case 5:
          err_1 = _24.sent();
          (0, globals_js_1.logVerbose)(
            "telegram pairing reply failed for chat ".concat(chatId, ": ").concat(String(err_1)),
          );
          return [3 /*break*/, 6];
        case 6:
          return [3 /*break*/, 8];
        case 7:
          (0, globals_js_1.logVerbose)(
            "Blocked unauthorized telegram sender "
              .concat(candidate, " (dmPolicy=")
              .concat(dmPolicy, ", ")
              .concat(allowMatchMeta, ")"),
          );
          _24.label = 8;
        case 8:
          return [2 /*return*/, null];
        case 9:
          botUsername =
            (_p = (_o = primaryCtx.me) === null || _o === void 0 ? void 0 : _o.username) === null ||
            _p === void 0
              ? void 0
              : _p.toLowerCase();
          senderId = ((_q = msg.from) === null || _q === void 0 ? void 0 : _q.id)
            ? String(msg.from.id)
            : "";
          senderUsername =
            (_s = (_r = msg.from) === null || _r === void 0 ? void 0 : _r.username) !== null &&
            _s !== void 0
              ? _s
              : "";
          if (isGroup && hasGroupAllowOverride) {
            allowed = (0, bot_access_js_1.isSenderAllowed)({
              allow: effectiveGroupAllow,
              senderId: senderId,
              senderUsername: senderUsername,
            });
            if (!allowed) {
              (0, globals_js_1.logVerbose)(
                "Blocked telegram group sender ".concat(
                  senderId || "unknown",
                  " (group allowFrom override)",
                ),
              );
              return [2 /*return*/, null];
            }
          }
          allowForCommands = isGroup ? effectiveGroupAllow : effectiveDmAllow;
          senderAllowedForCommands = (0, bot_access_js_1.isSenderAllowed)({
            allow: allowForCommands,
            senderId: senderId,
            senderUsername: senderUsername,
          });
          useAccessGroups =
            ((_t = cfg.commands) === null || _t === void 0 ? void 0 : _t.useAccessGroups) !== false;
          hasControlCommandInMessage = (0, command_detection_js_1.hasControlCommand)(
            (_v = (_u = msg.text) !== null && _u !== void 0 ? _u : msg.caption) !== null &&
              _v !== void 0
              ? _v
              : "",
            cfg,
            {
              botUsername: botUsername,
            },
          );
          commandGate = (0, command_gating_js_1.resolveControlCommandGate)({
            useAccessGroups: useAccessGroups,
            authorizers: [
              { configured: allowForCommands.hasEntries, allowed: senderAllowedForCommands },
            ],
            allowTextCommands: true,
            hasControlCommand: hasControlCommandInMessage,
          });
          commandAuthorized = commandGate.commandAuthorized;
          historyKey = isGroup
            ? (0, helpers_js_1.buildTelegramGroupPeerId)(chatId, resolvedThreadId)
            : undefined;
          placeholder = "";
          if (msg.photo) {
            placeholder = "<media:image>";
          } else if (msg.video) {
            placeholder = "<media:video>";
          } else if (msg.video_note) {
            placeholder = "<media:video>";
          } else if (msg.audio || msg.voice) {
            placeholder = "<media:audio>";
          } else if (msg.document) {
            placeholder = "<media:document>";
          } else if (msg.sticker) {
            placeholder = "<media:sticker>";
          }
          cachedStickerDescription =
            (_x = (_w = allMedia[0]) === null || _w === void 0 ? void 0 : _w.stickerMetadata) ===
              null || _x === void 0
              ? void 0
              : _x.cachedDescription;
          if (!msg.sticker) {
            return [3 /*break*/, 11];
          }
          return [4 /*yield*/, resolveStickerVisionSupport({ cfg: cfg, agentId: route.agentId })];
        case 10:
          _e = _24.sent();
          return [3 /*break*/, 12];
        case 11:
          _e = false;
          _24.label = 12;
        case 12:
          stickerSupportsVision = _e;
          stickerCacheHit = Boolean(cachedStickerDescription) && !stickerSupportsVision;
          if (stickerCacheHit) {
            emoji =
              (_z = (_y = allMedia[0]) === null || _y === void 0 ? void 0 : _y.stickerMetadata) ===
                null || _z === void 0
                ? void 0
                : _z.emoji;
            setName =
              (_1 = (_0 = allMedia[0]) === null || _0 === void 0 ? void 0 : _0.stickerMetadata) ===
                null || _1 === void 0
                ? void 0
                : _1.setName;
            stickerContext = [emoji, setName ? 'from "'.concat(setName, '"') : null]
              .filter(Boolean)
              .join(" ");
            placeholder = "[Sticker"
              .concat(stickerContext ? " ".concat(stickerContext) : "", "] ")
              .concat(cachedStickerDescription);
          }
          locationData = (0, helpers_js_1.extractTelegramLocation)(msg);
          locationText = locationData
            ? (0, location_js_1.formatLocationText)(locationData)
            : undefined;
          rawTextSource =
            (_3 = (_2 = msg.text) !== null && _2 !== void 0 ? _2 : msg.caption) !== null &&
            _3 !== void 0
              ? _3
              : "";
          rawText = (0, helpers_js_1.expandTextLinks)(
            rawTextSource,
            (_4 = msg.entities) !== null && _4 !== void 0 ? _4 : msg.caption_entities,
          ).trim();
          rawBody = [rawText, locationText].filter(Boolean).join("\n").trim();
          if (!rawBody) {
            rawBody = placeholder;
          }
          if (!rawBody && allMedia.length === 0) {
            return [2 /*return*/, null];
          }
          bodyText = rawBody;
          if (!bodyText && allMedia.length > 0) {
            bodyText = "<media:image>".concat(
              allMedia.length > 1 ? " (".concat(allMedia.length, " images)") : "",
            );
          }
          hasAnyMention = (
            (_6 = (_5 = msg.entities) !== null && _5 !== void 0 ? _5 : msg.caption_entities) !==
              null && _6 !== void 0
              ? _6
              : []
          ).some(function (ent) {
            return ent.type === "mention";
          });
          explicitlyMentioned = botUsername
            ? (0, helpers_js_1.hasBotMention)(msg, botUsername)
            : false;
          computedWasMentioned = (0, mentions_js_1.matchesMentionWithExplicit)({
            text:
              (_8 = (_7 = msg.text) !== null && _7 !== void 0 ? _7 : msg.caption) !== null &&
              _8 !== void 0
                ? _8
                : "",
            mentionRegexes: mentionRegexes,
            explicit: {
              hasAnyMention: hasAnyMention,
              isExplicitlyMentioned: explicitlyMentioned,
              canResolveExplicit: Boolean(botUsername),
            },
          });
          wasMentioned =
            (options === null || options === void 0 ? void 0 : options.forceWasMentioned) === true
              ? true
              : computedWasMentioned;
          if (isGroup && commandGate.shouldBlock) {
            (0, logging_js_1.logInboundDrop)({
              log: globals_js_1.logVerbose,
              channel: "telegram",
              reason: "control command (unauthorized)",
              target: senderId !== null && senderId !== void 0 ? senderId : "unknown",
            });
            return [2 /*return*/, null];
          }
          activationOverride = resolveGroupActivation({
            chatId: chatId,
            messageThreadId: resolvedThreadId,
            sessionKey: sessionKey,
            agentId: route.agentId,
          });
          baseRequireMention = resolveGroupRequireMention(chatId);
          requireMention = (0, bot_access_js_1.firstDefined)(
            activationOverride,
            topicConfig === null || topicConfig === void 0 ? void 0 : topicConfig.requireMention,
            groupConfig === null || groupConfig === void 0 ? void 0 : groupConfig.requireMention,
            baseRequireMention,
          );
          botId = (_9 = primaryCtx.me) === null || _9 === void 0 ? void 0 : _9.id;
          replyFromId =
            (_11 = (_10 = msg.reply_to_message) === null || _10 === void 0 ? void 0 : _10.from) ===
              null || _11 === void 0
              ? void 0
              : _11.id;
          implicitMention = botId != null && replyFromId === botId;
          canDetectMention = Boolean(botUsername) || mentionRegexes.length > 0;
          mentionGate = (0, mention_gating_js_1.resolveMentionGatingWithBypass)({
            isGroup: isGroup,
            requireMention: Boolean(requireMention),
            canDetectMention: canDetectMention,
            wasMentioned: wasMentioned,
            implicitMention: isGroup && Boolean(requireMention) && implicitMention,
            hasAnyMention: hasAnyMention,
            allowTextCommands: true,
            hasControlCommand: hasControlCommandInMessage,
            commandAuthorized: commandAuthorized,
          });
          effectiveWasMentioned = mentionGate.effectiveWasMentioned;
          if (isGroup && requireMention && canDetectMention) {
            if (mentionGate.shouldSkip) {
              logger.info({ chatId: chatId, reason: "no-mention" }, "skipping group message");
              (0, history_js_1.recordPendingHistoryEntryIfEnabled)({
                historyMap: groupHistories,
                historyKey: historyKey !== null && historyKey !== void 0 ? historyKey : "",
                limit: historyLimit,
                entry: historyKey
                  ? {
                      sender: (0, helpers_js_1.buildSenderLabel)(msg, senderId || chatId),
                      body: rawBody,
                      timestamp: msg.date ? msg.date * 1000 : undefined,
                      messageId:
                        typeof msg.message_id === "number" ? String(msg.message_id) : undefined,
                    }
                  : null,
              });
              return [2 /*return*/, null];
            }
          }
          ackReaction = (0, identity_js_1.resolveAckReaction)(cfg, route.agentId);
          removeAckAfterReply =
            (_13 =
              (_12 = cfg.messages) === null || _12 === void 0
                ? void 0
                : _12.removeAckAfterReply) !== null && _13 !== void 0
              ? _13
              : false;
          shouldAckReaction = function () {
            return Boolean(
              ackReaction &&
              (0, ack_reactions_js_1.shouldAckReaction)({
                scope: ackReactionScope,
                isDirect: !isGroup,
                isGroup: isGroup,
                isMentionableGroup: isGroup,
                requireMention: Boolean(requireMention),
                canDetectMention: canDetectMention,
                effectiveWasMentioned: effectiveWasMentioned,
                shouldBypassMention: mentionGate.shouldBypassMention,
              }),
            );
          };
          api = bot.api;
          reactionApi =
            typeof api.setMessageReaction === "function" ? api.setMessageReaction.bind(api) : null;
          ackReactionPromise =
            shouldAckReaction() && msg.message_id && reactionApi
              ? (0, api_logging_js_1.withTelegramApiErrorLogging)({
                  operation: "setMessageReaction",
                  fn: function () {
                    return reactionApi(chatId, msg.message_id, [
                      { type: "emoji", emoji: ackReaction },
                    ]);
                  },
                }).then(
                  function () {
                    return true;
                  },
                  function (err) {
                    (0, globals_js_1.logVerbose)(
                      "telegram react failed for chat ".concat(chatId, ": ").concat(String(err)),
                    );
                    return false;
                  },
                )
              : null;
          replyTarget = (0, helpers_js_1.describeReplyTarget)(msg);
          forwardOrigin = (0, helpers_js_1.normalizeForwardedContext)(msg);
          replySuffix = replyTarget
            ? replyTarget.kind === "quote"
              ? "\n\n[Quoting "
                  .concat(replyTarget.sender)
                  .concat(replyTarget.id ? " id:".concat(replyTarget.id) : "", ']\n"')
                  .concat(replyTarget.body, '"\n[/Quoting]')
              : "\n\n[Replying to "
                  .concat(replyTarget.sender)
                  .concat(replyTarget.id ? " id:".concat(replyTarget.id) : "", "]\n")
                  .concat(replyTarget.body, "\n[/Replying]")
            : "";
          forwardPrefix = forwardOrigin
            ? "[Forwarded from "
                .concat(forwardOrigin.from)
                .concat(
                  forwardOrigin.date
                    ? " at ".concat(new Date(forwardOrigin.date * 1000).toISOString())
                    : "",
                  "]\n",
                )
            : "";
          groupLabel = isGroup
            ? (0, helpers_js_1.buildGroupLabel)(msg, chatId, resolvedThreadId)
            : undefined;
          senderName = (0, helpers_js_1.buildSenderName)(msg);
          conversationLabel = isGroup
            ? groupLabel !== null && groupLabel !== void 0
              ? groupLabel
              : "group:".concat(chatId)
            : (0, helpers_js_1.buildSenderLabel)(msg, senderId || chatId);
          storePath = (0, sessions_js_1.resolveStorePath)(
            (_14 = cfg.session) === null || _14 === void 0 ? void 0 : _14.store,
            {
              agentId: route.agentId,
            },
          );
          envelopeOptions = (0, envelope_js_1.resolveEnvelopeFormatOptions)(cfg);
          previousTimestamp = (0, sessions_js_1.readSessionUpdatedAt)({
            storePath: storePath,
            sessionKey: sessionKey,
          });
          body = (0, envelope_js_1.formatInboundEnvelope)({
            channel: "Telegram",
            from: conversationLabel,
            timestamp: msg.date ? msg.date * 1000 : undefined,
            body: "".concat(forwardPrefix).concat(bodyText).concat(replySuffix),
            chatType: isGroup ? "group" : "direct",
            sender: {
              name: senderName,
              username: senderUsername || undefined,
              id: senderId || undefined,
            },
            previousTimestamp: previousTimestamp,
            envelope: envelopeOptions,
          });
          combinedBody = body;
          if (isGroup && historyKey && historyLimit > 0) {
            combinedBody = (0, history_js_1.buildPendingHistoryContextFromMap)({
              historyMap: groupHistories,
              historyKey: historyKey,
              limit: historyLimit,
              currentMessage: combinedBody,
              formatEntry: function (entry) {
                var _a;
                return (0, envelope_js_1.formatInboundEnvelope)({
                  channel: "Telegram",
                  from:
                    groupLabel !== null && groupLabel !== void 0
                      ? groupLabel
                      : "group:".concat(chatId),
                  timestamp: entry.timestamp,
                  body: ""
                    .concat(entry.body, " [id:")
                    .concat(
                      (_a = entry.messageId) !== null && _a !== void 0 ? _a : "unknown",
                      " chat:",
                    )
                    .concat(chatId, "]"),
                  chatType: "group",
                  senderLabel: entry.sender,
                  envelope: envelopeOptions,
                });
              },
            });
          }
          skillFilter = (0, bot_access_js_1.firstDefined)(
            topicConfig === null || topicConfig === void 0 ? void 0 : topicConfig.skills,
            groupConfig === null || groupConfig === void 0 ? void 0 : groupConfig.skills,
          );
          systemPromptParts = [
            ((_15 =
              groupConfig === null || groupConfig === void 0
                ? void 0
                : groupConfig.systemPrompt) === null || _15 === void 0
              ? void 0
              : _15.trim()) || null,
            ((_16 =
              topicConfig === null || topicConfig === void 0
                ? void 0
                : topicConfig.systemPrompt) === null || _16 === void 0
              ? void 0
              : _16.trim()) || null,
          ].filter(function (entry) {
            return Boolean(entry);
          });
          groupSystemPrompt =
            systemPromptParts.length > 0 ? systemPromptParts.join("\n\n") : undefined;
          commandBody = (0, commands_registry_js_1.normalizeCommandBody)(rawBody, {
            botUsername: botUsername,
          });
          ctxPayload = (0, inbound_context_js_1.finalizeInboundContext)(
            __assign(
              __assign(
                {
                  Body: combinedBody,
                  RawBody: rawBody,
                  CommandBody: commandBody,
                  From: isGroup
                    ? (0, helpers_js_1.buildTelegramGroupFrom)(chatId, resolvedThreadId)
                    : "telegram:".concat(chatId),
                  To: "telegram:".concat(chatId),
                  SessionKey: sessionKey,
                  AccountId: route.accountId,
                  ChatType: isGroup ? "group" : "direct",
                  ConversationLabel: conversationLabel,
                  GroupSubject: isGroup
                    ? (_17 = msg.chat.title) !== null && _17 !== void 0
                      ? _17
                      : undefined
                    : undefined,
                  GroupSystemPrompt: isGroup ? groupSystemPrompt : undefined,
                  SenderName: senderName,
                  SenderId: senderId || undefined,
                  SenderUsername: senderUsername || undefined,
                  Provider: "telegram",
                  Surface: "telegram",
                  MessageSid:
                    (_18 =
                      options === null || options === void 0
                        ? void 0
                        : options.messageIdOverride) !== null && _18 !== void 0
                      ? _18
                      : String(msg.message_id),
                  ReplyToId:
                    replyTarget === null || replyTarget === void 0 ? void 0 : replyTarget.id,
                  ReplyToBody:
                    replyTarget === null || replyTarget === void 0 ? void 0 : replyTarget.body,
                  ReplyToSender:
                    replyTarget === null || replyTarget === void 0 ? void 0 : replyTarget.sender,
                  ReplyToIsQuote:
                    (replyTarget === null || replyTarget === void 0 ? void 0 : replyTarget.kind) ===
                    "quote"
                      ? true
                      : undefined,
                  ForwardedFrom:
                    forwardOrigin === null || forwardOrigin === void 0
                      ? void 0
                      : forwardOrigin.from,
                  ForwardedFromType:
                    forwardOrigin === null || forwardOrigin === void 0
                      ? void 0
                      : forwardOrigin.fromType,
                  ForwardedFromId:
                    forwardOrigin === null || forwardOrigin === void 0
                      ? void 0
                      : forwardOrigin.fromId,
                  ForwardedFromUsername:
                    forwardOrigin === null || forwardOrigin === void 0
                      ? void 0
                      : forwardOrigin.fromUsername,
                  ForwardedFromTitle:
                    forwardOrigin === null || forwardOrigin === void 0
                      ? void 0
                      : forwardOrigin.fromTitle,
                  ForwardedFromSignature:
                    forwardOrigin === null || forwardOrigin === void 0
                      ? void 0
                      : forwardOrigin.fromSignature,
                  ForwardedDate: (
                    forwardOrigin === null || forwardOrigin === void 0 ? void 0 : forwardOrigin.date
                  )
                    ? forwardOrigin.date * 1000
                    : undefined,
                  Timestamp: msg.date ? msg.date * 1000 : undefined,
                  WasMentioned: isGroup ? effectiveWasMentioned : undefined,
                  // Filter out cached stickers from media - their description is already in the message body
                  MediaPath: stickerCacheHit
                    ? undefined
                    : (_19 = allMedia[0]) === null || _19 === void 0
                      ? void 0
                      : _19.path,
                  MediaType: stickerCacheHit
                    ? undefined
                    : (_20 = allMedia[0]) === null || _20 === void 0
                      ? void 0
                      : _20.contentType,
                  MediaUrl: stickerCacheHit
                    ? undefined
                    : (_21 = allMedia[0]) === null || _21 === void 0
                      ? void 0
                      : _21.path,
                  MediaPaths: stickerCacheHit
                    ? undefined
                    : allMedia.length > 0
                      ? allMedia.map(function (m) {
                          return m.path;
                        })
                      : undefined,
                  MediaUrls: stickerCacheHit
                    ? undefined
                    : allMedia.length > 0
                      ? allMedia.map(function (m) {
                          return m.path;
                        })
                      : undefined,
                  MediaTypes: stickerCacheHit
                    ? undefined
                    : allMedia.length > 0
                      ? allMedia
                          .map(function (m) {
                            return m.contentType;
                          })
                          .filter(Boolean)
                      : undefined,
                  Sticker:
                    (_22 = allMedia[0]) === null || _22 === void 0 ? void 0 : _22.stickerMetadata,
                },
                locationData ? (0, location_js_1.toLocationContext)(locationData) : undefined,
              ),
              {
                CommandAuthorized: commandAuthorized,
                // For groups: use resolvedThreadId (forum topics only); for DMs: use raw messageThreadId
                MessageThreadId: isGroup ? resolvedThreadId : messageThreadId,
                IsForum: isForum,
                // Originating channel for reply routing.
                OriginatingChannel: "telegram",
                OriginatingTo: "telegram:".concat(chatId),
              },
            ),
          );
          return [
            4 /*yield*/,
            (0, session_js_1.recordInboundSession)({
              storePath: storePath,
              sessionKey:
                (_23 = ctxPayload.SessionKey) !== null && _23 !== void 0 ? _23 : sessionKey,
              ctx: ctxPayload,
              updateLastRoute: !isGroup
                ? {
                    sessionKey: route.mainSessionKey,
                    channel: "telegram",
                    to: String(chatId),
                    accountId: route.accountId,
                  }
                : undefined,
              onRecordError: function (err) {
                (0, globals_js_1.logVerbose)(
                  "telegram: failed updating session meta: ".concat(String(err)),
                );
              },
            }),
          ];
        case 13:
          _24.sent();
          if (replyTarget && (0, globals_js_1.shouldLogVerbose)()) {
            preview = replyTarget.body.replace(/\s+/g, " ").slice(0, 120);
            (0, globals_js_1.logVerbose)(
              "telegram reply-context: replyToId="
                .concat(replyTarget.id, " replyToSender=")
                .concat(replyTarget.sender, ' replyToBody="')
                .concat(preview, '"'),
            );
          }
          if (forwardOrigin && (0, globals_js_1.shouldLogVerbose)()) {
            (0, globals_js_1.logVerbose)(
              'telegram forward-context: forwardedFrom="'
                .concat(forwardOrigin.from, '" type=')
                .concat(forwardOrigin.fromType),
            );
          }
          if ((0, globals_js_1.shouldLogVerbose)()) {
            preview = body.slice(0, 200).replace(/\n/g, "\\n");
            mediaInfo = allMedia.length > 1 ? " mediaCount=".concat(allMedia.length) : "";
            topicInfo = resolvedThreadId != null ? " topic=".concat(resolvedThreadId) : "";
            (0, globals_js_1.logVerbose)(
              "telegram inbound: chatId="
                .concat(chatId, " from=")
                .concat(ctxPayload.From, " len=")
                .concat(body.length)
                .concat(mediaInfo)
                .concat(topicInfo, ' preview="')
                .concat(preview, '"'),
            );
          }
          return [
            2 /*return*/,
            {
              ctxPayload: ctxPayload,
              primaryCtx: primaryCtx,
              msg: msg,
              chatId: chatId,
              isGroup: isGroup,
              resolvedThreadId: resolvedThreadId,
              isForum: isForum,
              historyKey: historyKey,
              historyLimit: historyLimit,
              groupHistories: groupHistories,
              route: route,
              skillFilter: skillFilter,
              sendTyping: sendTyping,
              sendRecordVoice: sendRecordVoice,
              ackReactionPromise: ackReactionPromise,
              reactionApi: reactionApi,
              removeAckAfterReply: removeAckAfterReply,
              accountId: account.accountId,
            },
          ];
      }
    });
  });
};
exports.buildTelegramMessageContext = buildTelegramMessageContext;
