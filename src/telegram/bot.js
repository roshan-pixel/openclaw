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
exports.getTelegramSequentialKey = getTelegramSequentialKey;
exports.createTelegramBot = createTelegramBot;
exports.createTelegramWebhookCallback = createTelegramWebhookCallback;
// @ts-nocheck
var runner_1 = require("@grammyjs/runner");
var transformer_throttler_1 = require("@grammyjs/transformer-throttler");
var grammy_1 = require("grammy");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var command_detection_js_1 = require("../auto-reply/command-detection.js");
var chunk_js_1 = require("../auto-reply/chunk.js");
var history_js_1 = require("../auto-reply/reply/history.js");
var commands_js_1 = require("../config/commands.js");
var config_js_1 = require("../config/config.js");
var group_policy_js_1 = require("../config/group-policy.js");
var sessions_js_1 = require("../config/sessions.js");
var globals_js_1 = require("../globals.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var errors_js_1 = require("../infra/errors.js");
var system_events_js_1 = require("../infra/system-events.js");
var logging_js_1 = require("../logging.js");
var api_logging_js_1 = require("./api-logging.js");
var resolve_route_js_1 = require("../routing/resolve-route.js");
var session_key_js_1 = require("../routing/session-key.js");
var accounts_js_1 = require("./accounts.js");
var helpers_js_1 = require("./bot/helpers.js");
var bot_handlers_js_1 = require("./bot-handlers.js");
var bot_message_js_1 = require("./bot-message.js");
var bot_native_commands_js_1 = require("./bot-native-commands.js");
var bot_updates_js_1 = require("./bot-updates.js");
var fetch_js_1 = require("./fetch.js");
var sent_message_cache_js_1 = require("./sent-message-cache.js");
function getTelegramSequentialKey(ctx) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
  // Handle reaction updates
  var reaction = (_a = ctx.update) === null || _a === void 0 ? void 0 : _a.message_reaction;
  if (
    (_b = reaction === null || reaction === void 0 ? void 0 : reaction.chat) === null ||
    _b === void 0
      ? void 0
      : _b.id
  ) {
    return "telegram:".concat(reaction.chat.id);
  }
  var msg =
    (_g =
      (_e =
        (_c = ctx.message) !== null && _c !== void 0
          ? _c
          : (_d = ctx.update) === null || _d === void 0
            ? void 0
            : _d.message) !== null && _e !== void 0
        ? _e
        : (_f = ctx.update) === null || _f === void 0
          ? void 0
          : _f.edited_message) !== null && _g !== void 0
      ? _g
      : (_j = (_h = ctx.update) === null || _h === void 0 ? void 0 : _h.callback_query) === null ||
          _j === void 0
        ? void 0
        : _j.message;
  var chatId =
    (_l =
      (_k = msg === null || msg === void 0 ? void 0 : msg.chat) === null || _k === void 0
        ? void 0
        : _k.id) !== null && _l !== void 0
      ? _l
      : (_m = ctx.chat) === null || _m === void 0
        ? void 0
        : _m.id;
  var rawText =
    (_o = msg === null || msg === void 0 ? void 0 : msg.text) !== null && _o !== void 0
      ? _o
      : msg === null || msg === void 0
        ? void 0
        : msg.caption;
  var botUsername = (_p = ctx.me) === null || _p === void 0 ? void 0 : _p.username;
  if (
    rawText &&
    (0, command_detection_js_1.isControlCommandMessage)(
      rawText,
      undefined,
      botUsername ? { botUsername: botUsername } : undefined,
    )
  ) {
    if (typeof chatId === "number") {
      return "telegram:".concat(chatId, ":control");
    }
    return "telegram:control";
  }
  var isGroup =
    ((_q = msg === null || msg === void 0 ? void 0 : msg.chat) === null || _q === void 0
      ? void 0
      : _q.type) === "group" ||
    ((_r = msg === null || msg === void 0 ? void 0 : msg.chat) === null || _r === void 0
      ? void 0
      : _r.type) === "supergroup";
  var messageThreadId = msg === null || msg === void 0 ? void 0 : msg.message_thread_id;
  var isForum =
    (_s = msg === null || msg === void 0 ? void 0 : msg.chat) === null || _s === void 0
      ? void 0
      : _s.is_forum;
  var threadId = isGroup
    ? (0, helpers_js_1.resolveTelegramForumThreadId)({
        isForum: isForum,
        messageThreadId: messageThreadId,
      })
    : messageThreadId;
  if (typeof chatId === "number") {
    return threadId != null
      ? "telegram:".concat(chatId, ":topic:").concat(threadId)
      : "telegram:".concat(chatId);
  }
  return "telegram:unknown";
}
function createTelegramBot(opts) {
  var _this = this;
  var _a,
    _b,
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
    _0;
  var runtime =
    (_a = opts.runtime) !== null && _a !== void 0
      ? _a
      : {
          log: console.log,
          error: console.error,
          exit: function (code) {
            throw new Error("exit ".concat(code));
          },
        };
  var cfg = (_b = opts.config) !== null && _b !== void 0 ? _b : (0, config_js_1.loadConfig)();
  var account = (0, accounts_js_1.resolveTelegramAccount)({
    cfg: cfg,
    accountId: opts.accountId,
  });
  var telegramCfg = account.config;
  var fetchImpl = (0, fetch_js_1.resolveTelegramFetch)(opts.proxyFetch, {
    network: telegramCfg.network,
  });
  var shouldProvideFetch = Boolean(fetchImpl);
  var timeoutSeconds =
    typeof (telegramCfg === null || telegramCfg === void 0
      ? void 0
      : telegramCfg.timeoutSeconds) === "number" && Number.isFinite(telegramCfg.timeoutSeconds)
      ? Math.max(1, Math.floor(telegramCfg.timeoutSeconds))
      : undefined;
  var client =
    shouldProvideFetch || timeoutSeconds
      ? __assign(
          __assign({}, shouldProvideFetch && fetchImpl ? { fetch: fetchImpl } : {}),
          timeoutSeconds ? { timeoutSeconds: timeoutSeconds } : {},
        )
      : undefined;
  var bot = new grammy_1.Bot(opts.token, client ? { client: client } : undefined);
  bot.api.config.use((0, transformer_throttler_1.apiThrottler)());
  bot.use((0, runner_1.sequentialize)(getTelegramSequentialKey));
  bot.catch(function (err) {
    var _a;
    (_a = runtime.error) === null || _a === void 0
      ? void 0
      : _a.call(
          runtime,
          (0, globals_js_1.danger)(
            "telegram bot error: ".concat((0, errors_js_1.formatUncaughtError)(err)),
          ),
        );
  });
  // Catch all errors from bot middleware to prevent unhandled rejections
  bot.catch(function (err) {
    var _a;
    var message = err instanceof Error ? err.message : String(err);
    (_a = runtime.error) === null || _a === void 0
      ? void 0
      : _a.call(runtime, (0, globals_js_1.danger)("telegram bot error: ".concat(message)));
  });
  var recentUpdates = (0, bot_updates_js_1.createTelegramUpdateDedupe)();
  var lastUpdateId =
    typeof ((_c = opts.updateOffset) === null || _c === void 0 ? void 0 : _c.lastUpdateId) ===
    "number"
      ? opts.updateOffset.lastUpdateId
      : null;
  var recordUpdateId = function (ctx) {
    var _a, _b;
    var updateId = (0, bot_updates_js_1.resolveTelegramUpdateId)(ctx);
    if (typeof updateId !== "number") {
      return;
    }
    if (lastUpdateId !== null && updateId <= lastUpdateId) {
      return;
    }
    lastUpdateId = updateId;
    void ((_b = (_a = opts.updateOffset) === null || _a === void 0 ? void 0 : _a.onUpdateId) ===
      null || _b === void 0
      ? void 0
      : _b.call(_a, updateId));
  };
  var shouldSkipUpdate = function (ctx) {
    var updateId = (0, bot_updates_js_1.resolveTelegramUpdateId)(ctx);
    if (typeof updateId === "number" && lastUpdateId !== null) {
      if (updateId <= lastUpdateId) {
        return true;
      }
    }
    var key = (0, bot_updates_js_1.buildTelegramUpdateKey)(ctx);
    var skipped = recentUpdates.check(key);
    if (skipped && key && (0, globals_js_1.shouldLogVerbose)()) {
      (0, globals_js_1.logVerbose)("telegram dedupe: skipped ".concat(key));
    }
    return skipped;
  };
  var rawUpdateLogger = (0, subsystem_js_1.createSubsystemLogger)(
    "gateway/channels/telegram/raw-update",
  );
  var MAX_RAW_UPDATE_CHARS = 8000;
  var MAX_RAW_UPDATE_STRING = 500;
  var MAX_RAW_UPDATE_ARRAY = 20;
  var stringifyUpdate = function (update) {
    var seen = new WeakSet();
    return JSON.stringify(
      update !== null && update !== void 0 ? update : null,
      function (key, value) {
        if (typeof value === "string" && value.length > MAX_RAW_UPDATE_STRING) {
          return "".concat(value.slice(0, MAX_RAW_UPDATE_STRING), "...");
        }
        if (Array.isArray(value) && value.length > MAX_RAW_UPDATE_ARRAY) {
          return __spreadArray(
            __spreadArray([], value.slice(0, MAX_RAW_UPDATE_ARRAY), true),
            ["...(".concat(value.length - MAX_RAW_UPDATE_ARRAY, " more)")],
            false,
          );
        }
        if (value && typeof value === "object") {
          var obj = value;
          if (seen.has(obj)) {
            return "[Circular]";
          }
          seen.add(obj);
        }
        return value;
      },
    );
  };
  bot.use(function (ctx, next) {
    return __awaiter(_this, void 0, void 0, function () {
      var raw, preview;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if ((0, globals_js_1.shouldLogVerbose)()) {
              try {
                raw = stringifyUpdate(ctx.update);
                preview =
                  raw.length > MAX_RAW_UPDATE_CHARS
                    ? "".concat(raw.slice(0, MAX_RAW_UPDATE_CHARS), "...")
                    : raw;
                rawUpdateLogger.debug("telegram update: ".concat(preview));
              } catch (err) {
                rawUpdateLogger.debug("telegram update log failed: ".concat(String(err)));
              }
            }
            return [4 /*yield*/, next()];
          case 1:
            _a.sent();
            recordUpdateId(ctx);
            return [2 /*return*/];
        }
      });
    });
  });
  var historyLimit = Math.max(
    0,
    (_g =
      (_d = telegramCfg.historyLimit) !== null && _d !== void 0
        ? _d
        : (_f = (_e = cfg.messages) === null || _e === void 0 ? void 0 : _e.groupChat) === null ||
            _f === void 0
          ? void 0
          : _f.historyLimit) !== null && _g !== void 0
      ? _g
      : history_js_1.DEFAULT_GROUP_HISTORY_LIMIT,
  );
  var groupHistories = new Map();
  var textLimit = (0, chunk_js_1.resolveTextChunkLimit)(cfg, "telegram", account.accountId);
  var dmPolicy = (_h = telegramCfg.dmPolicy) !== null && _h !== void 0 ? _h : "pairing";
  var allowFrom = (_j = opts.allowFrom) !== null && _j !== void 0 ? _j : telegramCfg.allowFrom;
  var groupAllowFrom =
    (_m =
      (_l =
        (_k = opts.groupAllowFrom) !== null && _k !== void 0 ? _k : telegramCfg.groupAllowFrom) !==
        null && _l !== void 0
        ? _l
        : telegramCfg.allowFrom && telegramCfg.allowFrom.length > 0
          ? telegramCfg.allowFrom
          : undefined) !== null && _m !== void 0
      ? _m
      : opts.allowFrom && opts.allowFrom.length > 0
        ? opts.allowFrom
        : undefined;
  var replyToMode =
    (_p = (_o = opts.replyToMode) !== null && _o !== void 0 ? _o : telegramCfg.replyToMode) !==
      null && _p !== void 0
      ? _p
      : "first";
  var streamMode = (0, helpers_js_1.resolveTelegramStreamMode)(telegramCfg);
  var nativeEnabled = (0, commands_js_1.resolveNativeCommandsEnabled)({
    providerId: "telegram",
    providerSetting: (_q = telegramCfg.commands) === null || _q === void 0 ? void 0 : _q.native,
    globalSetting: (_r = cfg.commands) === null || _r === void 0 ? void 0 : _r.native,
  });
  var nativeSkillsEnabled = (0, commands_js_1.resolveNativeSkillsEnabled)({
    providerId: "telegram",
    providerSetting:
      (_s = telegramCfg.commands) === null || _s === void 0 ? void 0 : _s.nativeSkills,
    globalSetting: (_t = cfg.commands) === null || _t === void 0 ? void 0 : _t.nativeSkills,
  });
  var nativeDisabledExplicit = (0, commands_js_1.isNativeCommandsExplicitlyDisabled)({
    providerSetting: (_u = telegramCfg.commands) === null || _u === void 0 ? void 0 : _u.native,
    globalSetting: (_v = cfg.commands) === null || _v === void 0 ? void 0 : _v.native,
  });
  var useAccessGroups =
    ((_w = cfg.commands) === null || _w === void 0 ? void 0 : _w.useAccessGroups) !== false;
  var ackReactionScope =
    (_y = (_x = cfg.messages) === null || _x === void 0 ? void 0 : _x.ackReactionScope) !== null &&
    _y !== void 0
      ? _y
      : "group-mentions";
  var mediaMaxBytes =
    ((_0 = (_z = opts.mediaMaxMb) !== null && _z !== void 0 ? _z : telegramCfg.mediaMaxMb) !==
      null && _0 !== void 0
      ? _0
      : 5) *
    1024 *
    1024;
  var logger = (0, logging_js_1.getChildLogger)({ module: "telegram-auto-reply" });
  var botHasTopicsEnabled;
  var resolveBotTopicsEnabled = function (ctx) {
    return __awaiter(_this, void 0, void 0, function () {
      var fromCtx, me, err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            fromCtx = ctx === null || ctx === void 0 ? void 0 : ctx.me;
            if (
              typeof (fromCtx === null || fromCtx === void 0
                ? void 0
                : fromCtx.has_topics_enabled) === "boolean"
            ) {
              botHasTopicsEnabled = fromCtx.has_topics_enabled;
              return [2 /*return*/, botHasTopicsEnabled];
            }
            if (typeof botHasTopicsEnabled === "boolean") {
              return [2 /*return*/, botHasTopicsEnabled];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [
              4 /*yield*/,
              (0, api_logging_js_1.withTelegramApiErrorLogging)({
                operation: "getMe",
                runtime: runtime,
                fn: function () {
                  return bot.api.getMe();
                },
              }),
            ];
          case 2:
            me = _a.sent();
            botHasTopicsEnabled = Boolean(
              me === null || me === void 0 ? void 0 : me.has_topics_enabled,
            );
            return [3 /*break*/, 4];
          case 3:
            err_1 = _a.sent();
            (0, globals_js_1.logVerbose)("telegram getMe failed: ".concat(String(err_1)));
            botHasTopicsEnabled = false;
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/, botHasTopicsEnabled];
        }
      });
    });
  };
  var resolveGroupPolicy = function (chatId) {
    return (0, group_policy_js_1.resolveChannelGroupPolicy)({
      cfg: cfg,
      channel: "telegram",
      accountId: account.accountId,
      groupId: String(chatId),
    });
  };
  var resolveGroupActivation = function (params) {
    var _a, _b, _c;
    var agentId =
      (_a = params.agentId) !== null && _a !== void 0
        ? _a
        : (0, agent_scope_js_1.resolveDefaultAgentId)(cfg);
    var sessionKey =
      (_b = params.sessionKey) !== null && _b !== void 0
        ? _b
        : "agent:"
            .concat(agentId, ":telegram:group:")
            .concat(
              (0, helpers_js_1.buildTelegramGroupPeerId)(params.chatId, params.messageThreadId),
            );
    var storePath = (0, sessions_js_1.resolveStorePath)(
      (_c = cfg.session) === null || _c === void 0 ? void 0 : _c.store,
      { agentId: agentId },
    );
    try {
      var store = (0, sessions_js_1.loadSessionStore)(storePath);
      var entry = store[sessionKey];
      if ((entry === null || entry === void 0 ? void 0 : entry.groupActivation) === "always") {
        return false;
      }
      if ((entry === null || entry === void 0 ? void 0 : entry.groupActivation) === "mention") {
        return true;
      }
    } catch (err) {
      (0, globals_js_1.logVerbose)(
        "Failed to load session for activation check: ".concat(String(err)),
      );
    }
    return undefined;
  };
  var resolveGroupRequireMention = function (chatId) {
    return (0, group_policy_js_1.resolveChannelGroupRequireMention)({
      cfg: cfg,
      channel: "telegram",
      accountId: account.accountId,
      groupId: String(chatId),
      requireMentionOverride: opts.requireMention,
      overrideOrder: "after-config",
    });
  };
  var resolveTelegramGroupConfig = function (chatId, messageThreadId) {
    var _a, _b;
    var groups = telegramCfg.groups;
    if (!groups) {
      return { groupConfig: undefined, topicConfig: undefined };
    }
    var groupKey = String(chatId);
    var groupConfig = (_a = groups[groupKey]) !== null && _a !== void 0 ? _a : groups["*"];
    var topicConfig =
      messageThreadId != null
        ? (_b = groupConfig === null || groupConfig === void 0 ? void 0 : groupConfig.topics) ===
            null || _b === void 0
          ? void 0
          : _b[String(messageThreadId)]
        : undefined;
    return { groupConfig: groupConfig, topicConfig: topicConfig };
  };
  var processMessage = (0, bot_message_js_1.createTelegramMessageProcessor)({
    bot: bot,
    cfg: cfg,
    account: account,
    telegramCfg: telegramCfg,
    historyLimit: historyLimit,
    groupHistories: groupHistories,
    dmPolicy: dmPolicy,
    allowFrom: allowFrom,
    groupAllowFrom: groupAllowFrom,
    ackReactionScope: ackReactionScope,
    logger: logger,
    resolveGroupActivation: resolveGroupActivation,
    resolveGroupRequireMention: resolveGroupRequireMention,
    resolveTelegramGroupConfig: resolveTelegramGroupConfig,
    runtime: runtime,
    replyToMode: replyToMode,
    streamMode: streamMode,
    textLimit: textLimit,
    opts: opts,
    resolveBotTopicsEnabled: resolveBotTopicsEnabled,
  });
  (0, bot_native_commands_js_1.registerTelegramNativeCommands)({
    bot: bot,
    cfg: cfg,
    runtime: runtime,
    accountId: account.accountId,
    telegramCfg: telegramCfg,
    allowFrom: allowFrom,
    groupAllowFrom: groupAllowFrom,
    replyToMode: replyToMode,
    textLimit: textLimit,
    useAccessGroups: useAccessGroups,
    nativeEnabled: nativeEnabled,
    nativeSkillsEnabled: nativeSkillsEnabled,
    nativeDisabledExplicit: nativeDisabledExplicit,
    resolveGroupPolicy: resolveGroupPolicy,
    resolveTelegramGroupConfig: resolveTelegramGroupConfig,
    shouldSkipUpdate: shouldSkipUpdate,
    opts: opts,
  });
  // Handle emoji reactions to messages
  bot.on("message_reaction", function (ctx) {
    return __awaiter(_this, void 0, void 0, function () {
      var reaction,
        chatId,
        messageId,
        user,
        reactionMode,
        oldEmojis_1,
        addedReactions,
        senderName,
        senderUsername,
        senderLabel,
        messageThreadId,
        isForum,
        resolvedThreadId,
        isGroup,
        peerId,
        route,
        baseSessionKey,
        dmThreadId,
        threadKeys,
        sessionKey,
        _i,
        addedReactions_1,
        r,
        emoji,
        text;
      var _a, _b, _c, _d;
      return __generator(this, function (_e) {
        try {
          reaction = ctx.messageReaction;
          if (!reaction) {
            return [2 /*return*/];
          }
          if (shouldSkipUpdate(ctx)) {
            return [2 /*return*/];
          }
          chatId = reaction.chat.id;
          messageId = reaction.message_id;
          user = reaction.user;
          reactionMode =
            (_a = telegramCfg.reactionNotifications) !== null && _a !== void 0 ? _a : "own";
          if (reactionMode === "off") {
            return [2 /*return*/];
          }
          if (user === null || user === void 0 ? void 0 : user.is_bot) {
            return [2 /*return*/];
          }
          if (
            reactionMode === "own" &&
            !(0, sent_message_cache_js_1.wasSentByBot)(chatId, messageId)
          ) {
            return [2 /*return*/];
          }
          oldEmojis_1 = new Set(
            reaction.old_reaction
              .filter(function (r) {
                return r.type === "emoji";
              })
              .map(function (r) {
                return r.emoji;
              }),
          );
          addedReactions = reaction.new_reaction
            .filter(function (r) {
              return r.type === "emoji";
            })
            .filter(function (r) {
              return !oldEmojis_1.has(r.emoji);
            });
          if (addedReactions.length === 0) {
            return [2 /*return*/];
          }
          senderName = user
            ? [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || user.username
            : undefined;
          senderUsername = (user === null || user === void 0 ? void 0 : user.username)
            ? "@".concat(user.username)
            : undefined;
          senderLabel = senderName;
          if (senderName && senderUsername) {
            senderLabel = "".concat(senderName, " (").concat(senderUsername, ")");
          } else if (!senderName && senderUsername) {
            senderLabel = senderUsername;
          }
          if (!senderLabel && (user === null || user === void 0 ? void 0 : user.id)) {
            senderLabel = "id:".concat(user.id);
          }
          senderLabel = senderLabel || "unknown";
          messageThreadId = reaction.message_thread_id;
          isForum = reaction.chat.is_forum === true;
          resolvedThreadId = (0, helpers_js_1.resolveTelegramForumThreadId)({
            isForum: isForum,
            messageThreadId: messageThreadId,
          });
          isGroup = reaction.chat.type === "group" || reaction.chat.type === "supergroup";
          peerId = isGroup
            ? (0, helpers_js_1.buildTelegramGroupPeerId)(chatId, resolvedThreadId)
            : String(chatId);
          route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "telegram",
            accountId: account.accountId,
            peer: { kind: isGroup ? "group" : "dm", id: peerId },
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
            (_b = threadKeys === null || threadKeys === void 0 ? void 0 : threadKeys.sessionKey) !==
              null && _b !== void 0
              ? _b
              : baseSessionKey;
          // Enqueue system event for each added reaction
          for (_i = 0, addedReactions_1 = addedReactions; _i < addedReactions_1.length; _i++) {
            r = addedReactions_1[_i];
            emoji = r.emoji;
            text = "Telegram reaction added: "
              .concat(emoji, " by ")
              .concat(senderLabel, " on msg ")
              .concat(messageId);
            (0, system_events_js_1.enqueueSystemEvent)(text, {
              sessionKey: sessionKey,
              contextKey: "telegram:reaction:add:"
                .concat(chatId, ":")
                .concat(messageId, ":")
                .concat(
                  (_c = user === null || user === void 0 ? void 0 : user.id) !== null &&
                    _c !== void 0
                    ? _c
                    : "anon",
                  ":",
                )
                .concat(emoji),
            });
            (0, globals_js_1.logVerbose)("telegram: reaction event enqueued: ".concat(text));
          }
        } catch (err) {
          (_d = runtime.error) === null || _d === void 0
            ? void 0
            : _d.call(
                runtime,
                (0, globals_js_1.danger)("telegram reaction handler failed: ".concat(String(err))),
              );
        }
        return [2 /*return*/];
      });
    });
  });
  (0, bot_handlers_js_1.registerTelegramHandlers)({
    cfg: cfg,
    accountId: account.accountId,
    bot: bot,
    opts: opts,
    runtime: runtime,
    mediaMaxBytes: mediaMaxBytes,
    telegramCfg: telegramCfg,
    groupAllowFrom: groupAllowFrom,
    resolveGroupPolicy: resolveGroupPolicy,
    resolveTelegramGroupConfig: resolveTelegramGroupConfig,
    shouldSkipUpdate: shouldSkipUpdate,
    processMessage: processMessage,
    logger: logger,
  });
  return bot;
}
function createTelegramWebhookCallback(bot, path) {
  if (path === void 0) {
    path = "/telegram-webhook";
  }
  return { path: path, handler: (0, grammy_1.webhookCallback)(bot, "http") };
}
