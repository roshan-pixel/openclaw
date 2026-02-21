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
exports.registerSlackMonitorSlashCommands = registerSlackMonitorSlashCommands;
var chunk_js_1 = require("../../auto-reply/chunk.js");
var identity_js_1 = require("../../agents/identity.js");
var commands_registry_js_1 = require("../../auto-reply/commands-registry.js");
var skill_commands_js_1 = require("../../auto-reply/skill-commands.js");
var provider_dispatcher_js_1 = require("../../auto-reply/reply/provider-dispatcher.js");
var inbound_context_js_1 = require("../../auto-reply/reply/inbound-context.js");
var commands_js_1 = require("../../config/commands.js");
var markdown_tables_js_1 = require("../../config/markdown-tables.js");
var globals_js_1 = require("../../globals.js");
var pairing_messages_js_1 = require("../../pairing/pairing-messages.js");
var pairing_store_js_1 = require("../../pairing/pairing-store.js");
var resolve_route_js_1 = require("../../routing/resolve-route.js");
var conversation_label_js_1 = require("../../channels/conversation-label.js");
var command_gating_js_1 = require("../../channels/command-gating.js");
var allowlist_match_js_1 = require("../../channels/allowlist-match.js");
var allow_list_js_1 = require("./allow-list.js");
var channel_config_js_1 = require("./channel-config.js");
var commands_js_2 = require("./commands.js");
var policy_js_1 = require("./policy.js");
var replies_js_1 = require("./replies.js");
var SLACK_COMMAND_ARG_ACTION_ID = "openclaw_cmdarg";
var SLACK_COMMAND_ARG_VALUE_PREFIX = "cmdarg";
function chunkItems(items, size) {
  if (size <= 0) {
    return [items];
  }
  var rows = [];
  for (var i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}
function encodeSlackCommandArgValue(parts) {
  return [
    SLACK_COMMAND_ARG_VALUE_PREFIX,
    encodeURIComponent(parts.command),
    encodeURIComponent(parts.arg),
    encodeURIComponent(parts.value),
    encodeURIComponent(parts.userId),
  ].join("|");
}
function parseSlackCommandArgValue(raw) {
  if (!raw) {
    return null;
  }
  var parts = raw.split("|");
  if (parts.length !== 5 || parts[0] !== SLACK_COMMAND_ARG_VALUE_PREFIX) {
    return null;
  }
  var command = parts[1],
    arg = parts[2],
    value = parts[3],
    userId = parts[4];
  if (!command || !arg || !value || !userId) {
    return null;
  }
  var decode = function (text) {
    try {
      return decodeURIComponent(text);
    } catch (_a) {
      return null;
    }
  };
  var decodedCommand = decode(command);
  var decodedArg = decode(arg);
  var decodedValue = decode(value);
  var decodedUserId = decode(userId);
  if (!decodedCommand || !decodedArg || !decodedValue || !decodedUserId) {
    return null;
  }
  return {
    command: decodedCommand,
    arg: decodedArg,
    value: decodedValue,
    userId: decodedUserId,
  };
}
function buildSlackCommandArgMenuBlocks(params) {
  var rows = chunkItems(params.choices, 5).map(function (choices) {
    return {
      type: "actions",
      elements: choices.map(function (choice) {
        return {
          type: "button",
          action_id: SLACK_COMMAND_ARG_ACTION_ID,
          text: { type: "plain_text", text: choice.label },
          value: encodeSlackCommandArgValue({
            command: params.command,
            arg: params.arg,
            value: choice.value,
            userId: params.userId,
          }),
        };
      }),
    };
  });
  return __spreadArray(
    [
      {
        type: "section",
        text: { type: "mrkdwn", text: params.title },
      },
    ],
    rows,
    true,
  );
}
function registerSlackMonitorSlashCommands(params) {
  var _this = this;
  var _a, _b, _c, _d, _e;
  var ctx = params.ctx,
    account = params.account;
  var cfg = ctx.cfg;
  var runtime = ctx.runtime;
  var supportsInteractiveArgMenus = typeof ctx.app.action === "function";
  var slashCommand = (0, commands_js_2.resolveSlackSlashCommandConfig)(
    (_a = ctx.slashCommand) !== null && _a !== void 0 ? _a : account.config.slashCommand,
  );
  var handleSlashCommand = function (p) {
    return __awaiter(_this, void 0, void 0, function () {
      var command,
        ack,
        respond,
        prompt,
        commandArgs,
        commandDefinition,
        channelInfo,
        channelType,
        isDirectMessage,
        isGroupDm,
        isRoom,
        isRoomish,
        storeAllowFrom,
        effectiveAllowFrom,
        effectiveAllowFromLower,
        commandAuthorized,
        channelConfig,
        sender_1,
        senderName_1,
        allowMatch,
        allowMatchMeta,
        _a,
        code,
        created,
        channelAllowlistConfigured,
        channelAllowed,
        hasExplicitConfig,
        sender,
        senderName,
        channelUsersAllowlistConfigured,
        channelUserAllowed,
        ownerAllowed,
        menu,
        commandLabel,
        title,
        blocks,
        channelName,
        roomLabel,
        route_1,
        channelDescription,
        systemPromptParts,
        groupSystemPrompt,
        ctxPayload,
        counts,
        err_1;
      var _this = this;
      var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
      return __generator(this, function (_m) {
        switch (_m.label) {
          case 0:
            ((command = p.command),
              (ack = p.ack),
              (respond = p.respond),
              (prompt = p.prompt),
              (commandArgs = p.commandArgs),
              (commandDefinition = p.commandDefinition));
            _m.label = 1;
          case 1:
            _m.trys.push([1, 34, , 36]);
            if (!!prompt.trim()) {
              return [3 /*break*/, 3];
            }
            return [
              4 /*yield*/,
              ack({
                text: "Message required.",
                response_type: "ephemeral",
              }),
            ];
          case 2:
            _m.sent();
            return [2 /*return*/];
          case 3:
            return [4 /*yield*/, ack()];
          case 4:
            _m.sent();
            if (ctx.botUserId && command.user_id === ctx.botUserId) {
              return [2 /*return*/];
            }
            return [4 /*yield*/, ctx.resolveChannelName(command.channel_id)];
          case 5:
            channelInfo = _m.sent();
            channelType =
              (_b = channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.type) !==
                null && _b !== void 0
                ? _b
                : command.channel_name === "directmessage"
                  ? "im"
                  : undefined;
            isDirectMessage = channelType === "im";
            isGroupDm = channelType === "mpim";
            isRoom = channelType === "channel" || channelType === "group";
            isRoomish = isRoom || isGroupDm;
            if (
              !!ctx.isChannelAllowed({
                channelId: command.channel_id,
                channelName:
                  channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name,
                channelType: channelType,
              })
            ) {
              return [3 /*break*/, 7];
            }
            return [
              4 /*yield*/,
              respond({
                text: "This channel is not allowed.",
                response_type: "ephemeral",
              }),
            ];
          case 6:
            _m.sent();
            return [2 /*return*/];
          case 7:
            return [
              4 /*yield*/,
              (0, pairing_store_js_1.readChannelAllowFromStore)("slack").catch(function () {
                return [];
              }),
            ];
          case 8:
            storeAllowFrom = _m.sent();
            effectiveAllowFrom = (0, allow_list_js_1.normalizeAllowList)(
              __spreadArray(__spreadArray([], ctx.allowFrom, true), storeAllowFrom, true),
            );
            effectiveAllowFromLower = (0, allow_list_js_1.normalizeAllowListLower)(
              effectiveAllowFrom,
            );
            commandAuthorized = true;
            channelConfig = null;
            if (!isDirectMessage) {
              return [3 /*break*/, 19];
            }
            if (!(!ctx.dmEnabled || ctx.dmPolicy === "disabled")) {
              return [3 /*break*/, 10];
            }
            return [
              4 /*yield*/,
              respond({
                text: "Slack DMs are disabled.",
                response_type: "ephemeral",
              }),
            ];
          case 9:
            _m.sent();
            return [2 /*return*/];
          case 10:
            if (!(ctx.dmPolicy !== "open")) {
              return [3 /*break*/, 19];
            }
            return [4 /*yield*/, ctx.resolveUserName(command.user_id)];
          case 11:
            sender_1 = _m.sent();
            senderName_1 =
              (_c = sender_1 === null || sender_1 === void 0 ? void 0 : sender_1.name) !== null &&
              _c !== void 0
                ? _c
                : undefined;
            allowMatch = (0, allow_list_js_1.resolveSlackAllowListMatch)({
              allowList: effectiveAllowFromLower,
              id: command.user_id,
              name: senderName_1,
            });
            allowMatchMeta = (0, allowlist_match_js_1.formatAllowlistMatchMeta)(allowMatch);
            if (!!allowMatch.allowed) {
              return [3 /*break*/, 18];
            }
            if (!(ctx.dmPolicy === "pairing")) {
              return [3 /*break*/, 15];
            }
            return [
              4 /*yield*/,
              (0, pairing_store_js_1.upsertChannelPairingRequest)({
                channel: "slack",
                id: command.user_id,
                meta: { name: senderName_1 },
              }),
            ];
          case 12:
            ((_a = _m.sent()), (code = _a.code), (created = _a.created));
            if (!created) {
              return [3 /*break*/, 14];
            }
            (0, globals_js_1.logVerbose)(
              "slack pairing request sender="
                .concat(command.user_id, " name=")
                .concat(
                  senderName_1 !== null && senderName_1 !== void 0 ? senderName_1 : "unknown",
                  " (",
                )
                .concat(allowMatchMeta, ")"),
            );
            return [
              4 /*yield*/,
              respond({
                text: (0, pairing_messages_js_1.buildPairingReply)({
                  channel: "slack",
                  idLine: "Your Slack user id: ".concat(command.user_id),
                  code: code,
                }),
                response_type: "ephemeral",
              }),
            ];
          case 13:
            _m.sent();
            _m.label = 14;
          case 14:
            return [3 /*break*/, 17];
          case 15:
            (0, globals_js_1.logVerbose)(
              "slack: blocked slash sender "
                .concat(command.user_id, " (dmPolicy=")
                .concat(ctx.dmPolicy, ", ")
                .concat(allowMatchMeta, ")"),
            );
            return [
              4 /*yield*/,
              respond({
                text: "You are not authorized to use this command.",
                response_type: "ephemeral",
              }),
            ];
          case 16:
            _m.sent();
            _m.label = 17;
          case 17:
            return [2 /*return*/];
          case 18:
            commandAuthorized = true;
            _m.label = 19;
          case 19:
            if (!isRoom) {
              return [3 /*break*/, 23];
            }
            channelConfig = (0, channel_config_js_1.resolveSlackChannelConfig)({
              channelId: command.channel_id,
              channelName:
                channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name,
              channels: ctx.channelsConfig,
              defaultRequireMention: ctx.defaultRequireMention,
            });
            if (!ctx.useAccessGroups) {
              return [3 /*break*/, 23];
            }
            channelAllowlistConfigured =
              Boolean(ctx.channelsConfig) &&
              Object.keys((_d = ctx.channelsConfig) !== null && _d !== void 0 ? _d : {}).length > 0;
            channelAllowed =
              (channelConfig === null || channelConfig === void 0
                ? void 0
                : channelConfig.allowed) !== false;
            if (
              !!(0, policy_js_1.isSlackChannelAllowedByPolicy)({
                groupPolicy: ctx.groupPolicy,
                channelAllowlistConfigured: channelAllowlistConfigured,
                channelAllowed: channelAllowed,
              })
            ) {
              return [3 /*break*/, 21];
            }
            return [
              4 /*yield*/,
              respond({
                text: "This channel is not allowed.",
                response_type: "ephemeral",
              }),
            ];
          case 20:
            _m.sent();
            return [2 /*return*/];
          case 21:
            hasExplicitConfig = Boolean(
              channelConfig === null || channelConfig === void 0
                ? void 0
                : channelConfig.matchSource,
            );
            if (!(!channelAllowed && (ctx.groupPolicy !== "open" || hasExplicitConfig))) {
              return [3 /*break*/, 23];
            }
            return [
              4 /*yield*/,
              respond({
                text: "This channel is not allowed.",
                response_type: "ephemeral",
              }),
            ];
          case 22:
            _m.sent();
            return [2 /*return*/];
          case 23:
            return [4 /*yield*/, ctx.resolveUserName(command.user_id)];
          case 24:
            sender = _m.sent();
            senderName =
              (_f =
                (_e = sender === null || sender === void 0 ? void 0 : sender.name) !== null &&
                _e !== void 0
                  ? _e
                  : command.user_name) !== null && _f !== void 0
                ? _f
                : command.user_id;
            channelUsersAllowlistConfigured =
              isRoom &&
              Array.isArray(
                channelConfig === null || channelConfig === void 0 ? void 0 : channelConfig.users,
              ) &&
              channelConfig.users.length > 0;
            channelUserAllowed = channelUsersAllowlistConfigured
              ? (0, allow_list_js_1.resolveSlackUserAllowed)({
                  allowList:
                    channelConfig === null || channelConfig === void 0
                      ? void 0
                      : channelConfig.users,
                  userId: command.user_id,
                  userName: senderName,
                })
              : false;
            if (!(channelUsersAllowlistConfigured && !channelUserAllowed)) {
              return [3 /*break*/, 26];
            }
            return [
              4 /*yield*/,
              respond({
                text: "You are not authorized to use this command here.",
                response_type: "ephemeral",
              }),
            ];
          case 25:
            _m.sent();
            return [2 /*return*/];
          case 26:
            ownerAllowed = (0, allow_list_js_1.resolveSlackAllowListMatch)({
              allowList: effectiveAllowFromLower,
              id: command.user_id,
              name: senderName,
            }).allowed;
            if (!isRoomish) {
              return [3 /*break*/, 28];
            }
            commandAuthorized = (0, command_gating_js_1.resolveCommandAuthorizedFromAuthorizers)({
              useAccessGroups: ctx.useAccessGroups,
              authorizers: [
                { configured: effectiveAllowFromLower.length > 0, allowed: ownerAllowed },
                { configured: channelUsersAllowlistConfigured, allowed: channelUserAllowed },
              ],
            });
            if (!(ctx.useAccessGroups && !commandAuthorized)) {
              return [3 /*break*/, 28];
            }
            return [
              4 /*yield*/,
              respond({
                text: "You are not authorized to use this command.",
                response_type: "ephemeral",
              }),
            ];
          case 27:
            _m.sent();
            return [2 /*return*/];
          case 28:
            if (!(commandDefinition && supportsInteractiveArgMenus)) {
              return [3 /*break*/, 30];
            }
            menu = (0, commands_registry_js_1.resolveCommandArgMenu)({
              command: commandDefinition,
              args: commandArgs,
              cfg: cfg,
            });
            if (!menu) {
              return [3 /*break*/, 30];
            }
            commandLabel =
              (_g = commandDefinition.nativeName) !== null && _g !== void 0
                ? _g
                : commandDefinition.key;
            title =
              (_h = menu.title) !== null && _h !== void 0
                ? _h
                : "Choose "
                    .concat(menu.arg.description || menu.arg.name, " for /")
                    .concat(commandLabel, ".");
            blocks = buildSlackCommandArgMenuBlocks({
              title: title,
              command: commandLabel,
              arg: menu.arg.name,
              choices: menu.choices,
              userId: command.user_id,
            });
            return [
              4 /*yield*/,
              respond({
                text: title,
                blocks: blocks,
                response_type: "ephemeral",
              }),
            ];
          case 29:
            _m.sent();
            return [2 /*return*/];
          case 30:
            channelName =
              channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name;
            roomLabel = channelName ? "#".concat(channelName) : "#".concat(command.channel_id);
            route_1 = (0, resolve_route_js_1.resolveAgentRoute)({
              cfg: cfg,
              channel: "slack",
              accountId: account.accountId,
              teamId: ctx.teamId || undefined,
              peer: {
                kind: isDirectMessage ? "dm" : isRoom ? "channel" : "group",
                id: isDirectMessage ? command.user_id : command.channel_id,
              },
            });
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
              ((_j =
                channelConfig === null || channelConfig === void 0
                  ? void 0
                  : channelConfig.systemPrompt) === null || _j === void 0
                ? void 0
                : _j.trim()) || null,
            ].filter(function (entry) {
              return Boolean(entry);
            });
            groupSystemPrompt =
              systemPromptParts.length > 0 ? systemPromptParts.join("\n\n") : undefined;
            ctxPayload = (0, inbound_context_js_1.finalizeInboundContext)({
              Body: prompt,
              RawBody: prompt,
              CommandBody: prompt,
              CommandArgs: commandArgs,
              From: isDirectMessage
                ? "slack:".concat(command.user_id)
                : isRoom
                  ? "slack:channel:".concat(command.channel_id)
                  : "slack:group:".concat(command.channel_id),
              To: "slash:".concat(command.user_id),
              ChatType: isDirectMessage ? "direct" : "channel",
              ConversationLabel:
                (_k = (0, conversation_label_js_1.resolveConversationLabel)({
                  ChatType: isDirectMessage ? "direct" : "channel",
                  SenderName: senderName,
                  GroupSubject: isRoomish ? roomLabel : undefined,
                  From: isDirectMessage
                    ? "slack:".concat(command.user_id)
                    : isRoom
                      ? "slack:channel:".concat(command.channel_id)
                      : "slack:group:".concat(command.channel_id),
                })) !== null && _k !== void 0
                  ? _k
                  : isDirectMessage
                    ? senderName
                    : roomLabel,
              GroupSubject: isRoomish ? roomLabel : undefined,
              GroupSystemPrompt: isRoomish ? groupSystemPrompt : undefined,
              SenderName: senderName,
              SenderId: command.user_id,
              Provider: "slack",
              Surface: "slack",
              WasMentioned: true,
              MessageSid: command.trigger_id,
              Timestamp: Date.now(),
              SessionKey: "agent:"
                .concat(route_1.agentId, ":")
                .concat(slashCommand.sessionPrefix, ":")
                .concat(command.user_id)
                .toLowerCase(),
              CommandTargetSessionKey: route_1.sessionKey,
              AccountId: route_1.accountId,
              CommandSource: "native",
              CommandAuthorized: commandAuthorized,
              OriginatingChannel: "slack",
              OriginatingTo: "user:".concat(command.user_id),
            });
            return [
              4 /*yield*/,
              (0, provider_dispatcher_js_1.dispatchReplyWithDispatcher)({
                ctx: ctxPayload,
                cfg: cfg,
                dispatcherOptions: {
                  responsePrefix: (0, identity_js_1.resolveEffectiveMessagesConfig)(
                    cfg,
                    route_1.agentId,
                  ).responsePrefix,
                  deliver: function (payload) {
                    return __awaiter(_this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        switch (_a.label) {
                          case 0:
                            return [
                              4 /*yield*/,
                              (0, replies_js_1.deliverSlackSlashReplies)({
                                replies: [payload],
                                respond: respond,
                                ephemeral: slashCommand.ephemeral,
                                textLimit: ctx.textLimit,
                                chunkMode: (0, chunk_js_1.resolveChunkMode)(
                                  cfg,
                                  "slack",
                                  route_1.accountId,
                                ),
                                tableMode: (0, markdown_tables_js_1.resolveMarkdownTableMode)({
                                  cfg: cfg,
                                  channel: "slack",
                                  accountId: route_1.accountId,
                                }),
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
                            "slack slash ".concat(info.kind, " reply failed: ").concat(String(err)),
                          ),
                        );
                  },
                },
                replyOptions: {
                  skillFilter:
                    channelConfig === null || channelConfig === void 0
                      ? void 0
                      : channelConfig.skills,
                },
              }),
            ];
          case 31:
            counts = _m.sent().counts;
            if (!(counts.final + counts.tool + counts.block === 0)) {
              return [3 /*break*/, 33];
            }
            return [
              4 /*yield*/,
              (0, replies_js_1.deliverSlackSlashReplies)({
                replies: [],
                respond: respond,
                ephemeral: slashCommand.ephemeral,
                textLimit: ctx.textLimit,
                chunkMode: (0, chunk_js_1.resolveChunkMode)(cfg, "slack", route_1.accountId),
                tableMode: (0, markdown_tables_js_1.resolveMarkdownTableMode)({
                  cfg: cfg,
                  channel: "slack",
                  accountId: route_1.accountId,
                }),
              }),
            ];
          case 32:
            _m.sent();
            _m.label = 33;
          case 33:
            return [3 /*break*/, 36];
          case 34:
            err_1 = _m.sent();
            (_l = runtime.error) === null || _l === void 0
              ? void 0
              : _l.call(
                  runtime,
                  (0, globals_js_1.danger)("slack slash handler failed: ".concat(String(err_1))),
                );
            return [
              4 /*yield*/,
              respond({
                text: "Sorry, something went wrong handling that command.",
                response_type: "ephemeral",
              }),
            ];
          case 35:
            _m.sent();
            return [3 /*break*/, 36];
          case 36:
            return [2 /*return*/];
        }
      });
    });
  };
  var nativeEnabled = (0, commands_js_1.resolveNativeCommandsEnabled)({
    providerId: "slack",
    providerSetting: (_b = account.config.commands) === null || _b === void 0 ? void 0 : _b.native,
    globalSetting: (_c = cfg.commands) === null || _c === void 0 ? void 0 : _c.native,
  });
  var nativeSkillsEnabled = (0, commands_js_1.resolveNativeSkillsEnabled)({
    providerId: "slack",
    providerSetting:
      (_d = account.config.commands) === null || _d === void 0 ? void 0 : _d.nativeSkills,
    globalSetting: (_e = cfg.commands) === null || _e === void 0 ? void 0 : _e.nativeSkills,
  });
  var skillCommands =
    nativeEnabled && nativeSkillsEnabled
      ? (0, skill_commands_js_1.listSkillCommandsForAgents)({ cfg: cfg })
      : [];
  var nativeCommands = nativeEnabled
    ? (0, commands_registry_js_1.listNativeCommandSpecsForConfig)(cfg, {
        skillCommands: skillCommands,
        provider: "slack",
      })
    : [];
  if (nativeCommands.length > 0) {
    var _loop_1 = function (command) {
      ctx.app.command("/".concat(command.name), function (_a) {
        return __awaiter(_this, [_a], void 0, function (_b) {
          var commandDefinition, rawText, commandArgs, prompt;
          var _c, _d;
          var cmd = _b.command,
            ack = _b.ack,
            respond = _b.respond;
          return __generator(this, function (_e) {
            switch (_e.label) {
              case 0:
                commandDefinition = (0, commands_registry_js_1.findCommandByNativeName)(
                  command.name,
                  "slack",
                );
                rawText =
                  (_d = (_c = cmd.text) === null || _c === void 0 ? void 0 : _c.trim()) !== null &&
                  _d !== void 0
                    ? _d
                    : "";
                commandArgs = commandDefinition
                  ? (0, commands_registry_js_1.parseCommandArgs)(commandDefinition, rawText)
                  : rawText
                    ? { raw: rawText }
                    : undefined;
                prompt = commandDefinition
                  ? (0, commands_registry_js_1.buildCommandTextFromArgs)(
                      commandDefinition,
                      commandArgs,
                    )
                  : rawText
                    ? "/".concat(command.name, " ").concat(rawText)
                    : "/".concat(command.name);
                return [
                  4 /*yield*/,
                  handleSlashCommand({
                    command: cmd,
                    ack: ack,
                    respond: respond,
                    prompt: prompt,
                    commandArgs: commandArgs,
                    commandDefinition:
                      commandDefinition !== null && commandDefinition !== void 0
                        ? commandDefinition
                        : undefined,
                  }),
                ];
              case 1:
                _e.sent();
                return [2 /*return*/];
            }
          });
        });
      });
    };
    for (var _i = 0, nativeCommands_1 = nativeCommands; _i < nativeCommands_1.length; _i++) {
      var command = nativeCommands_1[_i];
      _loop_1(command);
    }
  } else if (slashCommand.enabled) {
    ctx.app.command(
      (0, commands_js_2.buildSlackSlashCommandMatcher)(slashCommand.name),
      function (_a) {
        return __awaiter(_this, [_a], void 0, function (_b) {
          var _c, _d;
          var command = _b.command,
            ack = _b.ack,
            respond = _b.respond;
          return __generator(this, function (_e) {
            switch (_e.label) {
              case 0:
                return [
                  4 /*yield*/,
                  handleSlashCommand({
                    command: command,
                    ack: ack,
                    respond: respond,
                    prompt:
                      (_d = (_c = command.text) === null || _c === void 0 ? void 0 : _c.trim()) !==
                        null && _d !== void 0
                        ? _d
                        : "",
                  }),
                ];
              case 1:
                _e.sent();
                return [2 /*return*/];
            }
          });
        });
      },
    );
  } else {
    (0, globals_js_1.logVerbose)("slack: slash commands disabled");
  }
  if (nativeCommands.length === 0 || !supportsInteractiveArgMenus) {
    return;
  }
  var registerArgAction = function (actionId) {
    ctx.app.action(actionId, function (args) {
      return __awaiter(_this, void 0, void 0, function () {
        var ack,
          body,
          respond,
          action,
          respondFn,
          parsed,
          commandDefinition,
          commandArgs,
          prompt,
          user,
          userName,
          triggerId,
          commandPayload;
        var _a;
        var _this = this;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
          switch (_l.label) {
            case 0:
              ((ack = args.ack), (body = args.body), (respond = args.respond));
              action = args.action;
              return [4 /*yield*/, ack()];
            case 1:
              _l.sent();
              respondFn =
                respond !== null && respond !== void 0
                  ? respond
                  : function (payload) {
                      return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                          switch (_c.label) {
                            case 0:
                              if (
                                !((_a = body.channel) === null || _a === void 0 ? void 0 : _a.id) ||
                                !((_b = body.user) === null || _b === void 0 ? void 0 : _b.id)
                              ) {
                                return [2 /*return*/];
                              }
                              return [
                                4 /*yield*/,
                                ctx.app.client.chat.postEphemeral({
                                  token: ctx.botToken,
                                  channel: body.channel.id,
                                  user: body.user.id,
                                  text: payload.text,
                                  blocks: payload.blocks,
                                }),
                              ];
                            case 1:
                              _c.sent();
                              return [2 /*return*/];
                          }
                        });
                      });
                    };
              parsed = parseSlackCommandArgValue(
                action === null || action === void 0 ? void 0 : action.value,
              );
              if (!!parsed) {
                return [3 /*break*/, 3];
              }
              return [
                4 /*yield*/,
                respondFn({
                  text: "Sorry, that button is no longer valid.",
                  response_type: "ephemeral",
                }),
              ];
            case 2:
              _l.sent();
              return [2 /*return*/];
            case 3:
              if (
                !(
                  ((_b = body.user) === null || _b === void 0 ? void 0 : _b.id) &&
                  parsed.userId !== body.user.id
                )
              ) {
                return [3 /*break*/, 5];
              }
              return [
                4 /*yield*/,
                respondFn({
                  text: "That menu is for another user.",
                  response_type: "ephemeral",
                }),
              ];
            case 4:
              _l.sent();
              return [2 /*return*/];
            case 5:
              commandDefinition = (0, commands_registry_js_1.findCommandByNativeName)(
                parsed.command,
                "slack",
              );
              commandArgs = {
                values: ((_a = {}), (_a[parsed.arg] = parsed.value), _a),
              };
              prompt = commandDefinition
                ? (0, commands_registry_js_1.buildCommandTextFromArgs)(
                    commandDefinition,
                    commandArgs,
                  )
                : "/".concat(parsed.command, " ").concat(parsed.value);
              user = body.user;
              userName =
                user && "name" in user && user.name
                  ? user.name
                  : user && "username" in user && user.username
                    ? user.username
                    : (_c = user === null || user === void 0 ? void 0 : user.id) !== null &&
                        _c !== void 0
                      ? _c
                      : "";
              triggerId = "trigger_id" in body ? body.trigger_id : undefined;
              commandPayload = {
                user_id:
                  (_d = user === null || user === void 0 ? void 0 : user.id) !== null &&
                  _d !== void 0
                    ? _d
                    : "",
                user_name: userName,
                channel_id:
                  (_f = (_e = body.channel) === null || _e === void 0 ? void 0 : _e.id) !== null &&
                  _f !== void 0
                    ? _f
                    : "",
                channel_name:
                  (_k =
                    (_h = (_g = body.channel) === null || _g === void 0 ? void 0 : _g.name) !==
                      null && _h !== void 0
                      ? _h
                      : (_j = body.channel) === null || _j === void 0
                        ? void 0
                        : _j.id) !== null && _k !== void 0
                    ? _k
                    : "",
                trigger_id:
                  triggerId !== null && triggerId !== void 0 ? triggerId : String(Date.now()),
              };
              return [
                4 /*yield*/,
                handleSlashCommand({
                  command: commandPayload,
                  ack: function () {
                    return __awaiter(_this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        return [2 /*return*/];
                      });
                    });
                  },
                  respond: respondFn,
                  prompt: prompt,
                  commandArgs: commandArgs,
                  commandDefinition:
                    commandDefinition !== null && commandDefinition !== void 0
                      ? commandDefinition
                      : undefined,
                }),
              ];
            case 6:
              _l.sent();
              return [2 /*return*/];
          }
        });
      });
    });
  };
  registerArgAction(SLACK_COMMAND_ARG_ACTION_ID);
}
