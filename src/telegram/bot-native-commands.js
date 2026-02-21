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
exports.registerTelegramNativeCommands = void 0;
var identity_js_1 = require("../agents/identity.js");
var chunk_js_1 = require("../auto-reply/chunk.js");
var commands_registry_js_1 = require("../auto-reply/commands-registry.js");
var skill_commands_js_1 = require("../auto-reply/skill-commands.js");
var telegram_custom_commands_js_1 = require("../config/telegram-custom-commands.js");
var provider_dispatcher_js_1 = require("../auto-reply/reply/provider-dispatcher.js");
var inbound_context_js_1 = require("../auto-reply/reply/inbound-context.js");
var globals_js_1 = require("../globals.js");
var markdown_tables_js_1 = require("../config/markdown-tables.js");
var api_logging_js_1 = require("./api-logging.js");
var telegram_custom_commands_js_2 = require("../config/telegram-custom-commands.js");
var resolve_route_js_1 = require("../routing/resolve-route.js");
var session_key_js_1 = require("../routing/session-key.js");
var command_gating_js_1 = require("../channels/command-gating.js");
var commands_js_1 = require("../plugins/commands.js");
var delivery_js_1 = require("./bot/delivery.js");
var send_js_1 = require("./send.js");
var helpers_js_1 = require("./bot/helpers.js");
var bot_access_js_1 = require("./bot-access.js");
var pairing_store_js_1 = require("./pairing-store.js");
var EMPTY_RESPONSE_FALLBACK = "No response generated. Please try again.";
function resolveTelegramCommandAuth(params) {
  return __awaiter(this, void 0, void 0, function () {
    var msg,
      bot,
      cfg,
      telegramCfg,
      allowFrom,
      groupAllowFrom,
      useAccessGroups,
      resolveGroupPolicy,
      resolveTelegramGroupConfig,
      requireAuth,
      chatId,
      isGroup,
      messageThreadId,
      isForum,
      resolvedThreadId,
      storeAllowFrom,
      _a,
      groupConfig,
      topicConfig,
      groupAllowOverride,
      effectiveGroupAllow,
      hasGroupAllowOverride,
      senderIdRaw,
      senderId,
      senderUsername,
      defaultGroupPolicy,
      groupPolicy,
      groupAllowlist,
      dmAllow,
      senderAllowed,
      commandAuthorized;
    var _b, _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
      switch (_j.label) {
        case 0:
          ((msg = params.msg),
            (bot = params.bot),
            (cfg = params.cfg),
            (telegramCfg = params.telegramCfg),
            (allowFrom = params.allowFrom),
            (groupAllowFrom = params.groupAllowFrom),
            (useAccessGroups = params.useAccessGroups),
            (resolveGroupPolicy = params.resolveGroupPolicy),
            (resolveTelegramGroupConfig = params.resolveTelegramGroupConfig),
            (requireAuth = params.requireAuth));
          chatId = msg.chat.id;
          isGroup = msg.chat.type === "group" || msg.chat.type === "supergroup";
          messageThreadId = msg.message_thread_id;
          isForum = msg.chat.is_forum === true;
          resolvedThreadId = (0, helpers_js_1.resolveTelegramForumThreadId)({
            isForum: isForum,
            messageThreadId: messageThreadId,
          });
          return [
            4 /*yield*/,
            (0, pairing_store_js_1.readTelegramAllowFromStore)().catch(function () {
              return [];
            }),
          ];
        case 1:
          storeAllowFrom = _j.sent();
          ((_a = resolveTelegramGroupConfig(chatId, resolvedThreadId)),
            (groupConfig = _a.groupConfig),
            (topicConfig = _a.topicConfig));
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
          senderIdRaw = (_b = msg.from) === null || _b === void 0 ? void 0 : _b.id;
          senderId = senderIdRaw ? String(senderIdRaw) : "";
          senderUsername =
            (_d = (_c = msg.from) === null || _c === void 0 ? void 0 : _c.username) !== null &&
            _d !== void 0
              ? _d
              : "";
          if (
            !(
              isGroup &&
              (groupConfig === null || groupConfig === void 0 ? void 0 : groupConfig.enabled) ===
                false
            )
          ) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            (0, api_logging_js_1.withTelegramApiErrorLogging)({
              operation: "sendMessage",
              fn: function () {
                return bot.api.sendMessage(chatId, "This group is disabled.");
              },
            }),
          ];
        case 2:
          _j.sent();
          return [2 /*return*/, null];
        case 3:
          if (
            !(
              isGroup &&
              (topicConfig === null || topicConfig === void 0 ? void 0 : topicConfig.enabled) ===
                false
            )
          ) {
            return [3 /*break*/, 5];
          }
          return [
            4 /*yield*/,
            (0, api_logging_js_1.withTelegramApiErrorLogging)({
              operation: "sendMessage",
              fn: function () {
                return bot.api.sendMessage(chatId, "This topic is disabled.");
              },
            }),
          ];
        case 4:
          _j.sent();
          return [2 /*return*/, null];
        case 5:
          if (!(requireAuth && isGroup && hasGroupAllowOverride)) {
            return [3 /*break*/, 7];
          }
          if (
            !(
              senderIdRaw == null ||
              !(0, bot_access_js_1.isSenderAllowed)({
                allow: effectiveGroupAllow,
                senderId: String(senderIdRaw),
                senderUsername: senderUsername,
              })
            )
          ) {
            return [3 /*break*/, 7];
          }
          return [
            4 /*yield*/,
            (0, api_logging_js_1.withTelegramApiErrorLogging)({
              operation: "sendMessage",
              fn: function () {
                return bot.api.sendMessage(chatId, "You are not authorized to use this command.");
              },
            }),
          ];
        case 6:
          _j.sent();
          return [2 /*return*/, null];
        case 7:
          if (!(isGroup && useAccessGroups)) {
            return [3 /*break*/, 13];
          }
          defaultGroupPolicy =
            (_f = (_e = cfg.channels) === null || _e === void 0 ? void 0 : _e.defaults) === null ||
            _f === void 0
              ? void 0
              : _f.groupPolicy;
          groupPolicy =
            (_h =
              (_g = telegramCfg.groupPolicy) !== null && _g !== void 0
                ? _g
                : defaultGroupPolicy) !== null && _h !== void 0
              ? _h
              : "open";
          if (!(groupPolicy === "disabled")) {
            return [3 /*break*/, 9];
          }
          return [
            4 /*yield*/,
            (0, api_logging_js_1.withTelegramApiErrorLogging)({
              operation: "sendMessage",
              fn: function () {
                return bot.api.sendMessage(chatId, "Telegram group commands are disabled.");
              },
            }),
          ];
        case 8:
          _j.sent();
          return [2 /*return*/, null];
        case 9:
          if (!(groupPolicy === "allowlist" && requireAuth)) {
            return [3 /*break*/, 11];
          }
          if (
            !(
              senderIdRaw == null ||
              !(0, bot_access_js_1.isSenderAllowed)({
                allow: effectiveGroupAllow,
                senderId: String(senderIdRaw),
                senderUsername: senderUsername,
              })
            )
          ) {
            return [3 /*break*/, 11];
          }
          return [
            4 /*yield*/,
            (0, api_logging_js_1.withTelegramApiErrorLogging)({
              operation: "sendMessage",
              fn: function () {
                return bot.api.sendMessage(chatId, "You are not authorized to use this command.");
              },
            }),
          ];
        case 10:
          _j.sent();
          return [2 /*return*/, null];
        case 11:
          groupAllowlist = resolveGroupPolicy(chatId);
          if (!(groupAllowlist.allowlistEnabled && !groupAllowlist.allowed)) {
            return [3 /*break*/, 13];
          }
          return [
            4 /*yield*/,
            (0, api_logging_js_1.withTelegramApiErrorLogging)({
              operation: "sendMessage",
              fn: function () {
                return bot.api.sendMessage(chatId, "This group is not allowed.");
              },
            }),
          ];
        case 12:
          _j.sent();
          return [2 /*return*/, null];
        case 13:
          dmAllow = (0, bot_access_js_1.normalizeAllowFromWithStore)({
            allowFrom: allowFrom,
            storeAllowFrom: storeAllowFrom,
          });
          senderAllowed = (0, bot_access_js_1.isSenderAllowed)({
            allow: dmAllow,
            senderId: senderId,
            senderUsername: senderUsername,
          });
          commandAuthorized = (0, command_gating_js_1.resolveCommandAuthorizedFromAuthorizers)({
            useAccessGroups: useAccessGroups,
            authorizers: [{ configured: dmAllow.hasEntries, allowed: senderAllowed }],
            modeWhenAccessGroupsOff: "configured",
          });
          if (!(requireAuth && !commandAuthorized)) {
            return [3 /*break*/, 15];
          }
          return [
            4 /*yield*/,
            (0, api_logging_js_1.withTelegramApiErrorLogging)({
              operation: "sendMessage",
              fn: function () {
                return bot.api.sendMessage(chatId, "You are not authorized to use this command.");
              },
            }),
          ];
        case 14:
          _j.sent();
          return [2 /*return*/, null];
        case 15:
          return [
            2 /*return*/,
            {
              chatId: chatId,
              isGroup: isGroup,
              isForum: isForum,
              resolvedThreadId: resolvedThreadId,
              senderId: senderId,
              senderUsername: senderUsername,
              groupConfig: groupConfig,
              topicConfig: topicConfig,
              commandAuthorized: commandAuthorized,
            },
          ];
      }
    });
  });
}
var registerTelegramNativeCommands = function (_a) {
  var _b, _c, _d, _e, _f;
  var bot = _a.bot,
    cfg = _a.cfg,
    runtime = _a.runtime,
    accountId = _a.accountId,
    telegramCfg = _a.telegramCfg,
    allowFrom = _a.allowFrom,
    groupAllowFrom = _a.groupAllowFrom,
    replyToMode = _a.replyToMode,
    textLimit = _a.textLimit,
    useAccessGroups = _a.useAccessGroups,
    nativeEnabled = _a.nativeEnabled,
    nativeSkillsEnabled = _a.nativeSkillsEnabled,
    nativeDisabledExplicit = _a.nativeDisabledExplicit,
    resolveGroupPolicy = _a.resolveGroupPolicy,
    resolveTelegramGroupConfig = _a.resolveTelegramGroupConfig,
    shouldSkipUpdate = _a.shouldSkipUpdate,
    opts = _a.opts;
  var boundRoute =
    nativeEnabled && nativeSkillsEnabled
      ? (0, resolve_route_js_1.resolveAgentRoute)({
          cfg: cfg,
          channel: "telegram",
          accountId: accountId,
        })
      : null;
  var boundAgentIds =
    boundRoute && boundRoute.matchedBy.startsWith("binding.") ? [boundRoute.agentId] : null;
  var skillCommands =
    nativeEnabled && nativeSkillsEnabled
      ? (0, skill_commands_js_1.listSkillCommandsForAgents)(
          boundAgentIds ? { cfg: cfg, agentIds: boundAgentIds } : { cfg: cfg },
        )
      : [];
  var nativeCommands = nativeEnabled
    ? (0, commands_registry_js_1.listNativeCommandSpecsForConfig)(cfg, {
        skillCommands: skillCommands,
        provider: "telegram",
      })
    : [];
  var reservedCommands = new Set(
    (0, commands_registry_js_1.listNativeCommandSpecs)().map(function (command) {
      return command.name.toLowerCase();
    }),
  );
  for (var _i = 0, skillCommands_1 = skillCommands; _i < skillCommands_1.length; _i++) {
    var command = skillCommands_1[_i];
    reservedCommands.add(command.name.toLowerCase());
  }
  var customResolution = (0, telegram_custom_commands_js_1.resolveTelegramCustomCommands)({
    commands: telegramCfg.customCommands,
    reservedCommands: reservedCommands,
  });
  for (var _g = 0, _h = customResolution.issues; _g < _h.length; _g++) {
    var issue = _h[_g];
    (_b = runtime.error) === null || _b === void 0
      ? void 0
      : _b.call(runtime, (0, globals_js_1.danger)(issue.message));
  }
  var customCommands = customResolution.commands;
  var pluginCommandSpecs = (0, commands_js_1.getPluginCommandSpecs)();
  var pluginCommands = [];
  var existingCommands = new Set(
    __spreadArray(
      __spreadArray(
        [],
        nativeCommands.map(function (command) {
          return command.name;
        }),
        true,
      ),
      customCommands.map(function (command) {
        return command.command;
      }),
      true,
    ).map(function (command) {
      return command.toLowerCase();
    }),
  );
  var pluginCommandNames = new Set();
  for (
    var _j = 0, pluginCommandSpecs_1 = pluginCommandSpecs;
    _j < pluginCommandSpecs_1.length;
    _j++
  ) {
    var spec = pluginCommandSpecs_1[_j];
    var normalized = (0, telegram_custom_commands_js_2.normalizeTelegramCommandName)(spec.name);
    if (
      !normalized ||
      !telegram_custom_commands_js_2.TELEGRAM_COMMAND_NAME_PATTERN.test(normalized)
    ) {
      (_c = runtime.error) === null || _c === void 0
        ? void 0
        : _c.call(
            runtime,
            (0, globals_js_1.danger)(
              'Plugin command "/'.concat(
                spec.name,
                '" is invalid for Telegram (use a-z, 0-9, underscore; max 32 chars).',
              ),
            ),
          );
      continue;
    }
    var description = spec.description.trim();
    if (!description) {
      (_d = runtime.error) === null || _d === void 0
        ? void 0
        : _d.call(
            runtime,
            (0, globals_js_1.danger)(
              'Plugin command "/'.concat(normalized, '" is missing a description.'),
            ),
          );
      continue;
    }
    if (existingCommands.has(normalized)) {
      (_e = runtime.error) === null || _e === void 0
        ? void 0
        : _e.call(
            runtime,
            (0, globals_js_1.danger)(
              'Plugin command "/'.concat(
                normalized,
                '" conflicts with an existing Telegram command.',
              ),
            ),
          );
      continue;
    }
    if (pluginCommandNames.has(normalized)) {
      (_f = runtime.error) === null || _f === void 0
        ? void 0
        : _f.call(
            runtime,
            (0, globals_js_1.danger)('Plugin command "/'.concat(normalized, '" is duplicated.')),
          );
      continue;
    }
    pluginCommandNames.add(normalized);
    existingCommands.add(normalized);
    pluginCommands.push({ command: normalized, description: description });
  }
  var allCommands = __spreadArray(
    __spreadArray(
      __spreadArray(
        [],
        nativeCommands.map(function (command) {
          return {
            command: command.name,
            description: command.description,
          };
        }),
        true,
      ),
      pluginCommands,
      true,
    ),
    customCommands,
    true,
  );
  if (allCommands.length > 0) {
    (0, api_logging_js_1.withTelegramApiErrorLogging)({
      operation: "setMyCommands",
      runtime: runtime,
      fn: function () {
        return bot.api.setMyCommands(allCommands);
      },
    }).catch(function () {});
    if (typeof bot.command !== "function") {
      (0, globals_js_1.logVerbose)("telegram: bot.command unavailable; skipping native handlers");
    } else {
      var _loop_1 = function (command) {
        bot.command(command.name, function (ctx) {
          return __awaiter(void 0, void 0, void 0, function () {
            var msg,
              auth,
              chatId,
              isGroup,
              isForum,
              resolvedThreadId,
              senderId,
              senderUsername,
              groupConfig,
              topicConfig,
              commandAuthorized,
              messageThreadId,
              threadIdForSend,
              commandDefinition,
              rawText,
              commandArgs,
              prompt,
              menu,
              title_1,
              rows,
              i,
              slice,
              replyMarkup_1,
              route,
              baseSessionKey,
              dmThreadId,
              threadKeys,
              sessionKey,
              tableMode,
              skillFilter,
              systemPromptParts,
              groupSystemPrompt,
              conversationLabel,
              ctxPayload,
              disableBlockStreaming,
              chunkMode,
              deliveryState;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
              switch (_k.label) {
                case 0:
                  msg = ctx.message;
                  if (!msg) {
                    return [2 /*return*/];
                  }
                  if (shouldSkipUpdate(ctx)) {
                    return [2 /*return*/];
                  }
                  return [
                    4 /*yield*/,
                    resolveTelegramCommandAuth({
                      msg: msg,
                      bot: bot,
                      cfg: cfg,
                      telegramCfg: telegramCfg,
                      allowFrom: allowFrom,
                      groupAllowFrom: groupAllowFrom,
                      useAccessGroups: useAccessGroups,
                      resolveGroupPolicy: resolveGroupPolicy,
                      resolveTelegramGroupConfig: resolveTelegramGroupConfig,
                      requireAuth: true,
                    }),
                  ];
                case 1:
                  auth = _k.sent();
                  if (!auth) {
                    return [2 /*return*/];
                  }
                  ((chatId = auth.chatId),
                    (isGroup = auth.isGroup),
                    (isForum = auth.isForum),
                    (resolvedThreadId = auth.resolvedThreadId),
                    (senderId = auth.senderId),
                    (senderUsername = auth.senderUsername),
                    (groupConfig = auth.groupConfig),
                    (topicConfig = auth.topicConfig),
                    (commandAuthorized = auth.commandAuthorized));
                  messageThreadId = msg.message_thread_id;
                  threadIdForSend = isGroup ? resolvedThreadId : messageThreadId;
                  commandDefinition = (0, commands_registry_js_1.findCommandByNativeName)(
                    command.name,
                    "telegram",
                  );
                  rawText =
                    (_b = (_a = ctx.match) === null || _a === void 0 ? void 0 : _a.trim()) !==
                      null && _b !== void 0
                      ? _b
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
                  menu = commandDefinition
                    ? (0, commands_registry_js_1.resolveCommandArgMenu)({
                        command: commandDefinition,
                        args: commandArgs,
                        cfg: cfg,
                      })
                    : null;
                  if (!(menu && commandDefinition)) {
                    return [3 /*break*/, 3];
                  }
                  title_1 =
                    (_c = menu.title) !== null && _c !== void 0
                      ? _c
                      : "Choose "
                          .concat(menu.arg.description || menu.arg.name, " for /")
                          .concat(
                            (_d = commandDefinition.nativeName) !== null && _d !== void 0
                              ? _d
                              : commandDefinition.key,
                            ".",
                          );
                  rows = [];
                  for (i = 0; i < menu.choices.length; i += 2) {
                    slice = menu.choices.slice(i, i + 2);
                    rows.push(
                      slice.map(function (choice) {
                        var _a;
                        var args = {
                          values: ((_a = {}), (_a[menu.arg.name] = choice.value), _a),
                        };
                        return {
                          text: choice.label,
                          callback_data: (0, commands_registry_js_1.buildCommandTextFromArgs)(
                            commandDefinition,
                            args,
                          ),
                        };
                      }),
                    );
                  }
                  replyMarkup_1 = (0, send_js_1.buildInlineKeyboard)(rows);
                  return [
                    4 /*yield*/,
                    (0, api_logging_js_1.withTelegramApiErrorLogging)({
                      operation: "sendMessage",
                      runtime: runtime,
                      fn: function () {
                        return bot.api.sendMessage(
                          chatId,
                          title_1,
                          __assign(
                            __assign({}, replyMarkup_1 ? { reply_markup: replyMarkup_1 } : {}),
                            threadIdForSend != null ? { message_thread_id: threadIdForSend } : {},
                          ),
                        );
                      },
                    }),
                  ];
                case 2:
                  _k.sent();
                  return [2 /*return*/];
                case 3:
                  route = (0, resolve_route_js_1.resolveAgentRoute)({
                    cfg: cfg,
                    channel: "telegram",
                    accountId: accountId,
                    peer: {
                      kind: isGroup ? "group" : "dm",
                      id: isGroup
                        ? (0, helpers_js_1.buildTelegramGroupPeerId)(chatId, resolvedThreadId)
                        : String(chatId),
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
                    (_e =
                      threadKeys === null || threadKeys === void 0
                        ? void 0
                        : threadKeys.sessionKey) !== null && _e !== void 0
                      ? _e
                      : baseSessionKey;
                  tableMode = (0, markdown_tables_js_1.resolveMarkdownTableMode)({
                    cfg: cfg,
                    channel: "telegram",
                    accountId: route.accountId,
                  });
                  skillFilter = (0, bot_access_js_1.firstDefined)(
                    topicConfig === null || topicConfig === void 0 ? void 0 : topicConfig.skills,
                    groupConfig === null || groupConfig === void 0 ? void 0 : groupConfig.skills,
                  );
                  systemPromptParts = [
                    ((_f =
                      groupConfig === null || groupConfig === void 0
                        ? void 0
                        : groupConfig.systemPrompt) === null || _f === void 0
                      ? void 0
                      : _f.trim()) || null,
                    ((_g =
                      topicConfig === null || topicConfig === void 0
                        ? void 0
                        : topicConfig.systemPrompt) === null || _g === void 0
                      ? void 0
                      : _g.trim()) || null,
                  ].filter(function (entry) {
                    return Boolean(entry);
                  });
                  groupSystemPrompt =
                    systemPromptParts.length > 0 ? systemPromptParts.join("\n\n") : undefined;
                  conversationLabel = isGroup
                    ? msg.chat.title
                      ? "".concat(msg.chat.title, " id:").concat(chatId)
                      : "group:".concat(chatId)
                    : (_h = (0, helpers_js_1.buildSenderName)(msg)) !== null && _h !== void 0
                      ? _h
                      : String(senderId || chatId);
                  ctxPayload = (0, inbound_context_js_1.finalizeInboundContext)({
                    Body: prompt,
                    RawBody: prompt,
                    CommandBody: prompt,
                    CommandArgs: commandArgs,
                    From: isGroup
                      ? (0, helpers_js_1.buildTelegramGroupFrom)(chatId, resolvedThreadId)
                      : "telegram:".concat(chatId),
                    To: "slash:".concat(senderId || chatId),
                    ChatType: isGroup ? "group" : "direct",
                    ConversationLabel: conversationLabel,
                    GroupSubject: isGroup
                      ? (_j = msg.chat.title) !== null && _j !== void 0
                        ? _j
                        : undefined
                      : undefined,
                    GroupSystemPrompt: isGroup ? groupSystemPrompt : undefined,
                    SenderName: (0, helpers_js_1.buildSenderName)(msg),
                    SenderId: senderId || undefined,
                    SenderUsername: senderUsername || undefined,
                    Surface: "telegram",
                    MessageSid: String(msg.message_id),
                    Timestamp: msg.date ? msg.date * 1000 : undefined,
                    WasMentioned: true,
                    CommandAuthorized: commandAuthorized,
                    CommandSource: "native",
                    SessionKey: "telegram:slash:".concat(senderId || chatId),
                    AccountId: route.accountId,
                    CommandTargetSessionKey: sessionKey,
                    MessageThreadId: threadIdForSend,
                    IsForum: isForum,
                    // Originating context for sub-agent announce routing
                    OriginatingChannel: "telegram",
                    OriginatingTo: "telegram:".concat(chatId),
                  });
                  disableBlockStreaming =
                    typeof telegramCfg.blockStreaming === "boolean"
                      ? !telegramCfg.blockStreaming
                      : undefined;
                  chunkMode = (0, chunk_js_1.resolveChunkMode)(cfg, "telegram", route.accountId);
                  deliveryState = {
                    delivered: false,
                    skippedNonSilent: 0,
                  };
                  return [
                    4 /*yield*/,
                    (0, provider_dispatcher_js_1.dispatchReplyWithBufferedBlockDispatcher)({
                      ctx: ctxPayload,
                      cfg: cfg,
                      dispatcherOptions: {
                        responsePrefix: (0, identity_js_1.resolveEffectiveMessagesConfig)(
                          cfg,
                          route.agentId,
                        ).responsePrefix,
                        deliver: function (payload, _info) {
                          return __awaiter(void 0, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                              switch (_a.label) {
                                case 0:
                                  return [
                                    4 /*yield*/,
                                    (0, delivery_js_1.deliverReplies)({
                                      replies: [payload],
                                      chatId: String(chatId),
                                      token: opts.token,
                                      runtime: runtime,
                                      bot: bot,
                                      replyToMode: replyToMode,
                                      textLimit: textLimit,
                                      messageThreadId: threadIdForSend,
                                      tableMode: tableMode,
                                      chunkMode: chunkMode,
                                      linkPreview: telegramCfg.linkPreview,
                                    }),
                                  ];
                                case 1:
                                  result = _a.sent();
                                  if (result.delivered) {
                                    deliveryState.delivered = true;
                                  }
                                  return [2 /*return*/];
                              }
                            });
                          });
                        },
                        onSkip: function (_payload, info) {
                          if (info.reason !== "silent") {
                            deliveryState.skippedNonSilent += 1;
                          }
                        },
                        onError: function (err, info) {
                          var _a;
                          (_a = runtime.error) === null || _a === void 0
                            ? void 0
                            : _a.call(
                                runtime,
                                (0, globals_js_1.danger)(
                                  "telegram slash "
                                    .concat(info.kind, " reply failed: ")
                                    .concat(String(err)),
                                ),
                              );
                        },
                      },
                      replyOptions: {
                        skillFilter: skillFilter,
                        disableBlockStreaming: disableBlockStreaming,
                      },
                    }),
                  ];
                case 4:
                  _k.sent();
                  if (!(!deliveryState.delivered && deliveryState.skippedNonSilent > 0)) {
                    return [3 /*break*/, 6];
                  }
                  return [
                    4 /*yield*/,
                    (0, delivery_js_1.deliverReplies)({
                      replies: [{ text: EMPTY_RESPONSE_FALLBACK }],
                      chatId: String(chatId),
                      token: opts.token,
                      runtime: runtime,
                      bot: bot,
                      replyToMode: replyToMode,
                      textLimit: textLimit,
                      messageThreadId: threadIdForSend,
                      tableMode: tableMode,
                      chunkMode: chunkMode,
                      linkPreview: telegramCfg.linkPreview,
                    }),
                  ];
                case 5:
                  _k.sent();
                  _k.label = 6;
                case 6:
                  return [2 /*return*/];
              }
            });
          });
        });
      };
      for (var _k = 0, nativeCommands_1 = nativeCommands; _k < nativeCommands_1.length; _k++) {
        var command = nativeCommands_1[_k];
        _loop_1(command);
      }
      var _loop_2 = function (pluginCommand) {
        bot.command(pluginCommand.command, function (ctx) {
          return __awaiter(void 0, void 0, void 0, function () {
            var msg,
              chatId,
              rawText,
              commandBody,
              match,
              auth,
              resolvedThreadId,
              senderId,
              commandAuthorized,
              isGroup,
              messageThreadId,
              threadIdForSend,
              result,
              tableMode,
              chunkMode;
            var _a, _b;
            return __generator(this, function (_c) {
              switch (_c.label) {
                case 0:
                  msg = ctx.message;
                  if (!msg) {
                    return [2 /*return*/];
                  }
                  if (shouldSkipUpdate(ctx)) {
                    return [2 /*return*/];
                  }
                  chatId = msg.chat.id;
                  rawText =
                    (_b = (_a = ctx.match) === null || _a === void 0 ? void 0 : _a.trim()) !==
                      null && _b !== void 0
                      ? _b
                      : "";
                  commandBody = "/"
                    .concat(pluginCommand.command)
                    .concat(rawText ? " ".concat(rawText) : "");
                  match = (0, commands_js_1.matchPluginCommand)(commandBody);
                  if (!!match) {
                    return [3 /*break*/, 2];
                  }
                  return [
                    4 /*yield*/,
                    (0, api_logging_js_1.withTelegramApiErrorLogging)({
                      operation: "sendMessage",
                      runtime: runtime,
                      fn: function () {
                        return bot.api.sendMessage(chatId, "Command not found.");
                      },
                    }),
                  ];
                case 1:
                  _c.sent();
                  return [2 /*return*/];
                case 2:
                  return [
                    4 /*yield*/,
                    resolveTelegramCommandAuth({
                      msg: msg,
                      bot: bot,
                      cfg: cfg,
                      telegramCfg: telegramCfg,
                      allowFrom: allowFrom,
                      groupAllowFrom: groupAllowFrom,
                      useAccessGroups: useAccessGroups,
                      resolveGroupPolicy: resolveGroupPolicy,
                      resolveTelegramGroupConfig: resolveTelegramGroupConfig,
                      requireAuth: match.command.requireAuth !== false,
                    }),
                  ];
                case 3:
                  auth = _c.sent();
                  if (!auth) {
                    return [2 /*return*/];
                  }
                  ((resolvedThreadId = auth.resolvedThreadId),
                    (senderId = auth.senderId),
                    (commandAuthorized = auth.commandAuthorized),
                    (isGroup = auth.isGroup));
                  messageThreadId = msg.message_thread_id;
                  threadIdForSend = isGroup ? resolvedThreadId : messageThreadId;
                  return [
                    4 /*yield*/,
                    (0, commands_js_1.executePluginCommand)({
                      command: match.command,
                      args: match.args,
                      senderId: senderId,
                      channel: "telegram",
                      isAuthorizedSender: commandAuthorized,
                      commandBody: commandBody,
                      config: cfg,
                    }),
                  ];
                case 4:
                  result = _c.sent();
                  tableMode = (0, markdown_tables_js_1.resolveMarkdownTableMode)({
                    cfg: cfg,
                    channel: "telegram",
                    accountId: accountId,
                  });
                  chunkMode = (0, chunk_js_1.resolveChunkMode)(cfg, "telegram", accountId);
                  return [
                    4 /*yield*/,
                    (0, delivery_js_1.deliverReplies)({
                      replies: [result],
                      chatId: String(chatId),
                      token: opts.token,
                      runtime: runtime,
                      bot: bot,
                      replyToMode: replyToMode,
                      textLimit: textLimit,
                      messageThreadId: threadIdForSend,
                      tableMode: tableMode,
                      chunkMode: chunkMode,
                      linkPreview: telegramCfg.linkPreview,
                    }),
                  ];
                case 5:
                  _c.sent();
                  return [2 /*return*/];
              }
            });
          });
        });
      };
      for (var _l = 0, pluginCommands_1 = pluginCommands; _l < pluginCommands_1.length; _l++) {
        var pluginCommand = pluginCommands_1[_l];
        _loop_2(pluginCommand);
      }
    }
  } else if (nativeDisabledExplicit) {
    (0, api_logging_js_1.withTelegramApiErrorLogging)({
      operation: "setMyCommands",
      runtime: runtime,
      fn: function () {
        return bot.api.setMyCommands([]);
      },
    }).catch(function () {});
  }
};
exports.registerTelegramNativeCommands = registerTelegramNativeCommands;
