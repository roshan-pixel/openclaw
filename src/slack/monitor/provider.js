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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitorSlackProvider = monitorSlackProvider;
var bolt_1 = require("@slack/bolt");
var chunk_js_1 = require("../../auto-reply/chunk.js");
var history_js_1 = require("../../auto-reply/reply/history.js");
var resolve_utils_js_1 = require("../../channels/allowlists/resolve-utils.js");
var config_js_1 = require("../../config/config.js");
var globals_js_1 = require("../../globals.js");
var session_key_js_1 = require("../../routing/session-key.js");
var accounts_js_1 = require("../accounts.js");
var resolve_channels_js_1 = require("../resolve-channels.js");
var resolve_users_js_1 = require("../resolve-users.js");
var token_js_1 = require("../token.js");
var index_js_1 = require("../http/index.js");
var client_js_1 = require("../client.js");
var commands_js_1 = require("./commands.js");
var context_js_1 = require("./context.js");
var events_js_1 = require("./events.js");
var message_handler_js_1 = require("./message-handler.js");
var slash_js_1 = require("./slash.js");
var allow_list_js_1 = require("./allow-list.js");
var slackBoltModule = bolt_1.default;
// Bun allows named imports from CJS; Node ESM doesn't. Use default+fallback for compatibility.
// Fix: Check if module has App property directly (Node 25.x ESM/CJS compat issue)
var slackBolt =
  (_a = slackBoltModule.App ? slackBoltModule : slackBoltModule.default) !== null && _a !== void 0
    ? _a
    : slackBoltModule;
var App = slackBolt.App,
  HTTPReceiver = slackBolt.HTTPReceiver;
function parseApiAppIdFromAppToken(raw) {
  var _a;
  var token = raw === null || raw === void 0 ? void 0 : raw.trim();
  if (!token) {
    return undefined;
  }
  var match = /^xapp-\d-([a-z0-9]+)-/i.exec(token);
  return (_a = match === null || match === void 0 ? void 0 : match[1]) === null || _a === void 0
    ? void 0
    : _a.toUpperCase();
}
function monitorSlackProvider() {
  return __awaiter(this, arguments, void 0, function (opts) {
    var cfg,
      account,
      historyLimit,
      sessionCfg,
      sessionScope,
      mainKey,
      slackMode,
      slackWebhookPath,
      signingSecret,
      botToken,
      appToken,
      missing,
      runtime,
      slackCfg,
      dmConfig,
      dmEnabled,
      dmPolicy,
      allowFrom,
      groupDmEnabled,
      groupDmChannels,
      channelsConfig,
      defaultGroupPolicy,
      groupPolicy,
      resolveToken,
      useAccessGroups,
      reactionMode,
      reactionAllowlist,
      replyToMode,
      threadHistoryScope,
      threadInheritParent,
      slashCommand,
      textLimit,
      ackReactionScope,
      mediaMaxBytes,
      removeAckAfterReply,
      receiver,
      clientOptions,
      app,
      slackHttpHandler,
      unregisterHttpHandler,
      botUserId,
      teamId,
      apiAppId,
      expectedApiAppIdFromAppToken,
      auth,
      _a,
      ctx,
      handleSlackMessage,
      stopOnAbort;
    var _this = this;
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
      _21;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_22) {
      switch (_22.label) {
        case 0:
          cfg = (_b = opts.config) !== null && _b !== void 0 ? _b : (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveSlackAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          historyLimit = Math.max(
            0,
            (_f =
              (_c = account.config.historyLimit) !== null && _c !== void 0
                ? _c
                : (_e = (_d = cfg.messages) === null || _d === void 0 ? void 0 : _d.groupChat) ===
                      null || _e === void 0
                  ? void 0
                  : _e.historyLimit) !== null && _f !== void 0
              ? _f
              : history_js_1.DEFAULT_GROUP_HISTORY_LIMIT,
          );
          sessionCfg = cfg.session;
          sessionScope =
            (_g = sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.scope) !==
              null && _g !== void 0
              ? _g
              : "per-sender";
          mainKey = (0, session_key_js_1.normalizeMainKey)(
            sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.mainKey,
          );
          slackMode =
            (_j = (_h = opts.mode) !== null && _h !== void 0 ? _h : account.config.mode) !== null &&
            _j !== void 0
              ? _j
              : "socket";
          slackWebhookPath = (0, index_js_1.normalizeSlackWebhookPath)(account.config.webhookPath);
          signingSecret =
            (_k = account.config.signingSecret) === null || _k === void 0 ? void 0 : _k.trim();
          botToken = (0, token_js_1.resolveSlackBotToken)(
            (_l = opts.botToken) !== null && _l !== void 0 ? _l : account.botToken,
          );
          appToken = (0, token_js_1.resolveSlackAppToken)(
            (_m = opts.appToken) !== null && _m !== void 0 ? _m : account.appToken,
          );
          if (!botToken || (slackMode !== "http" && !appToken)) {
            missing =
              slackMode === "http"
                ? 'Slack bot token missing for account "'
                    .concat(account.accountId, '" (set channels.slack.accounts.')
                    .concat(account.accountId, ".botToken or SLACK_BOT_TOKEN for default).")
                : 'Slack bot + app tokens missing for account "'
                    .concat(account.accountId, '" (set channels.slack.accounts.')
                    .concat(
                      account.accountId,
                      ".botToken/appToken or SLACK_BOT_TOKEN/SLACK_APP_TOKEN for default).",
                    );
            throw new Error(missing);
          }
          if (slackMode === "http" && !signingSecret) {
            throw new Error(
              'Slack signing secret missing for account "'
                .concat(
                  account.accountId,
                  '" (set channels.slack.signingSecret or channels.slack.accounts.',
                )
                .concat(account.accountId, ".signingSecret)."),
            );
          }
          runtime =
            (_o = opts.runtime) !== null && _o !== void 0
              ? _o
              : {
                  log: console.log,
                  error: console.error,
                  exit: function (code) {
                    throw new Error("exit ".concat(code));
                  },
                };
          slackCfg = account.config;
          dmConfig = slackCfg.dm;
          dmEnabled =
            (_p = dmConfig === null || dmConfig === void 0 ? void 0 : dmConfig.enabled) !== null &&
            _p !== void 0
              ? _p
              : true;
          dmPolicy =
            (_q = dmConfig === null || dmConfig === void 0 ? void 0 : dmConfig.policy) !== null &&
            _q !== void 0
              ? _q
              : "pairing";
          allowFrom = dmConfig === null || dmConfig === void 0 ? void 0 : dmConfig.allowFrom;
          groupDmEnabled =
            (_r = dmConfig === null || dmConfig === void 0 ? void 0 : dmConfig.groupEnabled) !==
              null && _r !== void 0
              ? _r
              : false;
          groupDmChannels =
            dmConfig === null || dmConfig === void 0 ? void 0 : dmConfig.groupChannels;
          channelsConfig = slackCfg.channels;
          defaultGroupPolicy =
            (_t = (_s = cfg.channels) === null || _s === void 0 ? void 0 : _s.defaults) === null ||
            _t === void 0
              ? void 0
              : _t.groupPolicy;
          groupPolicy =
            (_v =
              (_u = slackCfg.groupPolicy) !== null && _u !== void 0 ? _u : defaultGroupPolicy) !==
              null && _v !== void 0
              ? _v
              : "open";
          if (
            slackCfg.groupPolicy === undefined &&
            slackCfg.channels === undefined &&
            defaultGroupPolicy === undefined &&
            groupPolicy === "open"
          ) {
            (_w = runtime.log) === null || _w === void 0
              ? void 0
              : _w.call(
                  runtime,
                  (0, globals_js_1.warn)(
                    'slack: groupPolicy defaults to "open" when channels.slack is missing; set channels.slack.groupPolicy (or channels.defaults.groupPolicy) or add channels.slack.channels to restrict access.',
                  ),
                );
          }
          resolveToken =
            ((_x = slackCfg.userToken) === null || _x === void 0 ? void 0 : _x.trim()) || botToken;
          useAccessGroups =
            ((_y = cfg.commands) === null || _y === void 0 ? void 0 : _y.useAccessGroups) !== false;
          reactionMode =
            (_z = slackCfg.reactionNotifications) !== null && _z !== void 0 ? _z : "own";
          reactionAllowlist = (_0 = slackCfg.reactionAllowlist) !== null && _0 !== void 0 ? _0 : [];
          replyToMode = (_1 = slackCfg.replyToMode) !== null && _1 !== void 0 ? _1 : "off";
          threadHistoryScope =
            (_3 = (_2 = slackCfg.thread) === null || _2 === void 0 ? void 0 : _2.historyScope) !==
              null && _3 !== void 0
              ? _3
              : "thread";
          threadInheritParent =
            (_5 = (_4 = slackCfg.thread) === null || _4 === void 0 ? void 0 : _4.inheritParent) !==
              null && _5 !== void 0
              ? _5
              : false;
          slashCommand = (0, commands_js_1.resolveSlackSlashCommandConfig)(
            (_6 = opts.slashCommand) !== null && _6 !== void 0 ? _6 : slackCfg.slashCommand,
          );
          textLimit = (0, chunk_js_1.resolveTextChunkLimit)(cfg, "slack", account.accountId);
          ackReactionScope =
            (_8 = (_7 = cfg.messages) === null || _7 === void 0 ? void 0 : _7.ackReactionScope) !==
              null && _8 !== void 0
              ? _8
              : "group-mentions";
          mediaMaxBytes =
            ((_10 = (_9 = opts.mediaMaxMb) !== null && _9 !== void 0 ? _9 : slackCfg.mediaMaxMb) !==
              null && _10 !== void 0
              ? _10
              : 20) *
            1024 *
            1024;
          removeAckAfterReply =
            (_12 =
              (_11 = cfg.messages) === null || _11 === void 0
                ? void 0
                : _11.removeAckAfterReply) !== null && _12 !== void 0
              ? _12
              : false;
          receiver =
            slackMode === "http"
              ? new HTTPReceiver({
                  signingSecret:
                    signingSecret !== null && signingSecret !== void 0 ? signingSecret : "",
                  endpoints: slackWebhookPath,
                })
              : null;
          clientOptions = (0, client_js_1.resolveSlackWebClientOptions)();
          app = new App(
            slackMode === "socket"
              ? {
                  token: botToken,
                  appToken: appToken,
                  socketMode: true,
                  clientOptions: clientOptions,
                }
              : {
                  token: botToken,
                  receiver: receiver !== null && receiver !== void 0 ? receiver : undefined,
                  clientOptions: clientOptions,
                },
          );
          slackHttpHandler =
            slackMode === "http" && receiver
              ? function (req, res) {
                  return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [4 /*yield*/, Promise.resolve(receiver.requestListener(req, res))];
                        case 1:
                          _a.sent();
                          return [2 /*return*/];
                      }
                    });
                  });
                }
              : null;
          unregisterHttpHandler = null;
          botUserId = "";
          teamId = "";
          apiAppId = "";
          expectedApiAppIdFromAppToken = parseApiAppIdFromAppToken(appToken);
          _22.label = 1;
        case 1:
          _22.trys.push([1, 3, , 4]);
          return [4 /*yield*/, app.client.auth.test({ token: botToken })];
        case 2:
          auth = _22.sent();
          botUserId = (_13 = auth.user_id) !== null && _13 !== void 0 ? _13 : "";
          teamId = (_14 = auth.team_id) !== null && _14 !== void 0 ? _14 : "";
          apiAppId = (_15 = auth.api_app_id) !== null && _15 !== void 0 ? _15 : "";
          return [3 /*break*/, 4];
        case 3:
          _a = _22.sent();
          return [3 /*break*/, 4];
        case 4:
          if (
            apiAppId &&
            expectedApiAppIdFromAppToken &&
            apiAppId !== expectedApiAppIdFromAppToken
          ) {
            (_16 = runtime.error) === null || _16 === void 0
              ? void 0
              : _16.call(
                  runtime,
                  "slack token mismatch: bot token api_app_id="
                    .concat(apiAppId, " but app token looks like api_app_id=")
                    .concat(expectedApiAppIdFromAppToken),
                );
          }
          ctx = (0, context_js_1.createSlackMonitorContext)({
            cfg: cfg,
            accountId: account.accountId,
            botToken: botToken,
            app: app,
            runtime: runtime,
            botUserId: botUserId,
            teamId: teamId,
            apiAppId: apiAppId,
            historyLimit: historyLimit,
            sessionScope: sessionScope,
            mainKey: mainKey,
            dmEnabled: dmEnabled,
            dmPolicy: dmPolicy,
            allowFrom: allowFrom,
            groupDmEnabled: groupDmEnabled,
            groupDmChannels: groupDmChannels,
            defaultRequireMention: slackCfg.requireMention,
            channelsConfig: channelsConfig,
            groupPolicy: groupPolicy,
            useAccessGroups: useAccessGroups,
            reactionMode: reactionMode,
            reactionAllowlist: reactionAllowlist,
            replyToMode: replyToMode,
            threadHistoryScope: threadHistoryScope,
            threadInheritParent: threadInheritParent,
            slashCommand: slashCommand,
            textLimit: textLimit,
            ackReactionScope: ackReactionScope,
            mediaMaxBytes: mediaMaxBytes,
            removeAckAfterReply: removeAckAfterReply,
          });
          handleSlackMessage = (0, message_handler_js_1.createSlackMessageHandler)({
            ctx: ctx,
            account: account,
          });
          (0, events_js_1.registerSlackMonitorEvents)({
            ctx: ctx,
            account: account,
            handleSlackMessage: handleSlackMessage,
          });
          (0, slash_js_1.registerSlackMonitorSlashCommands)({ ctx: ctx, account: account });
          if (slackMode === "http" && slackHttpHandler) {
            unregisterHttpHandler = (0, index_js_1.registerSlackHttpHandler)({
              path: slackWebhookPath,
              handler: slackHttpHandler,
              log: runtime.log,
              accountId: account.accountId,
            });
          }
          if (resolveToken) {
            void (function () {
              return __awaiter(_this, void 0, void 0, function () {
                var entries,
                  resolved,
                  nextChannels,
                  mapping,
                  unresolved,
                  _i,
                  resolved_1,
                  entry,
                  source,
                  existing,
                  err_1,
                  allowEntries,
                  resolvedUsers,
                  mapping,
                  unresolved,
                  additions,
                  _a,
                  resolvedUsers_1,
                  entry,
                  note,
                  err_2,
                  userEntries,
                  _b,
                  _c,
                  channel,
                  channelUsers,
                  _d,
                  channelUsers_1,
                  entry,
                  trimmed,
                  resolvedUsers,
                  resolvedMap,
                  mapping,
                  unresolved,
                  nextChannels,
                  _e,
                  _f,
                  _g,
                  channelKey,
                  channelConfig,
                  channelUsers,
                  additions,
                  _h,
                  channelUsers_2,
                  entry,
                  trimmed,
                  resolved,
                  err_3;
                var _j, _k, _l, _m, _o, _p;
                return __generator(this, function (_q) {
                  switch (_q.label) {
                    case 0:
                      if ((_j = opts.abortSignal) === null || _j === void 0 ? void 0 : _j.aborted) {
                        return [2 /*return*/];
                      }
                      if (!(channelsConfig && Object.keys(channelsConfig).length > 0)) {
                        return [3 /*break*/, 5];
                      }
                      _q.label = 1;
                    case 1:
                      _q.trys.push([1, 4, , 5]);
                      entries = Object.keys(channelsConfig).filter(function (key) {
                        return key !== "*";
                      });
                      if (!(entries.length > 0)) {
                        return [3 /*break*/, 3];
                      }
                      return [
                        4 /*yield*/,
                        (0, resolve_channels_js_1.resolveSlackChannelAllowlist)({
                          token: resolveToken,
                          entries: entries,
                        }),
                      ];
                    case 2:
                      resolved = _q.sent();
                      nextChannels = __assign({}, channelsConfig);
                      mapping = [];
                      unresolved = [];
                      for (_i = 0, resolved_1 = resolved; _i < resolved_1.length; _i++) {
                        entry = resolved_1[_i];
                        source =
                          channelsConfig === null || channelsConfig === void 0
                            ? void 0
                            : channelsConfig[entry.input];
                        if (!source) {
                          continue;
                        }
                        if (!entry.resolved || !entry.id) {
                          unresolved.push(entry.input);
                          continue;
                        }
                        mapping.push(
                          ""
                            .concat(entry.input, "\u2192")
                            .concat(entry.id)
                            .concat(entry.archived ? " (archived)" : ""),
                        );
                        existing =
                          (_k = nextChannels[entry.id]) !== null && _k !== void 0 ? _k : {};
                        nextChannels[entry.id] = __assign(__assign({}, source), existing);
                      }
                      channelsConfig = nextChannels;
                      ctx.channelsConfig = nextChannels;
                      (0, resolve_utils_js_1.summarizeMapping)(
                        "slack channels",
                        mapping,
                        unresolved,
                        runtime,
                      );
                      _q.label = 3;
                    case 3:
                      return [3 /*break*/, 5];
                    case 4:
                      err_1 = _q.sent();
                      (_l = runtime.log) === null || _l === void 0
                        ? void 0
                        : _l.call(
                            runtime,
                            "slack channel resolve failed; using config entries. ".concat(
                              String(err_1),
                            ),
                          );
                      return [3 /*break*/, 5];
                    case 5:
                      allowEntries =
                        (_m =
                          allowFrom === null || allowFrom === void 0
                            ? void 0
                            : allowFrom.filter(function (entry) {
                                return String(entry).trim() && String(entry).trim() !== "*";
                              })) !== null && _m !== void 0
                          ? _m
                          : [];
                      if (!(allowEntries.length > 0)) {
                        return [3 /*break*/, 9];
                      }
                      _q.label = 6;
                    case 6:
                      _q.trys.push([6, 8, , 9]);
                      return [
                        4 /*yield*/,
                        (0, resolve_users_js_1.resolveSlackUserAllowlist)({
                          token: resolveToken,
                          entries: allowEntries.map(function (entry) {
                            return String(entry);
                          }),
                        }),
                      ];
                    case 7:
                      resolvedUsers = _q.sent();
                      mapping = [];
                      unresolved = [];
                      additions = [];
                      for (
                        _a = 0, resolvedUsers_1 = resolvedUsers;
                        _a < resolvedUsers_1.length;
                        _a++
                      ) {
                        entry = resolvedUsers_1[_a];
                        if (entry.resolved && entry.id) {
                          note = entry.note ? " (".concat(entry.note, ")") : "";
                          mapping.push(
                            "".concat(entry.input, "\u2192").concat(entry.id).concat(note),
                          );
                          additions.push(entry.id);
                        } else {
                          unresolved.push(entry.input);
                        }
                      }
                      allowFrom = (0, resolve_utils_js_1.mergeAllowlist)({
                        existing: allowFrom,
                        additions: additions,
                      });
                      ctx.allowFrom = (0, allow_list_js_1.normalizeAllowList)(allowFrom);
                      (0, resolve_utils_js_1.summarizeMapping)(
                        "slack users",
                        mapping,
                        unresolved,
                        runtime,
                      );
                      return [3 /*break*/, 9];
                    case 8:
                      err_2 = _q.sent();
                      (_o = runtime.log) === null || _o === void 0
                        ? void 0
                        : _o.call(
                            runtime,
                            "slack user resolve failed; using config entries. ".concat(
                              String(err_2),
                            ),
                          );
                      return [3 /*break*/, 9];
                    case 9:
                      if (!(channelsConfig && Object.keys(channelsConfig).length > 0)) {
                        return [3 /*break*/, 13];
                      }
                      userEntries = new Set();
                      for (_b = 0, _c = Object.values(channelsConfig); _b < _c.length; _b++) {
                        channel = _c[_b];
                        if (!channel || typeof channel !== "object") {
                          continue;
                        }
                        channelUsers = channel.users;
                        if (!Array.isArray(channelUsers)) {
                          continue;
                        }
                        for (
                          _d = 0, channelUsers_1 = channelUsers;
                          _d < channelUsers_1.length;
                          _d++
                        ) {
                          entry = channelUsers_1[_d];
                          trimmed = String(entry).trim();
                          if (trimmed && trimmed !== "*") {
                            userEntries.add(trimmed);
                          }
                        }
                      }
                      if (!(userEntries.size > 0)) {
                        return [3 /*break*/, 13];
                      }
                      _q.label = 10;
                    case 10:
                      _q.trys.push([10, 12, , 13]);
                      return [
                        4 /*yield*/,
                        (0, resolve_users_js_1.resolveSlackUserAllowlist)({
                          token: resolveToken,
                          entries: Array.from(userEntries),
                        }),
                      ];
                    case 11:
                      resolvedUsers = _q.sent();
                      resolvedMap = new Map(
                        resolvedUsers.map(function (entry) {
                          return [entry.input, entry];
                        }),
                      );
                      mapping = resolvedUsers
                        .filter(function (entry) {
                          return entry.resolved && entry.id;
                        })
                        .map(function (entry) {
                          return "".concat(entry.input, "\u2192").concat(entry.id);
                        });
                      unresolved = resolvedUsers
                        .filter(function (entry) {
                          return !entry.resolved;
                        })
                        .map(function (entry) {
                          return entry.input;
                        });
                      nextChannels = __assign({}, channelsConfig);
                      for (_e = 0, _f = Object.entries(channelsConfig); _e < _f.length; _e++) {
                        ((_g = _f[_e]), (channelKey = _g[0]), (channelConfig = _g[1]));
                        if (!channelConfig || typeof channelConfig !== "object") {
                          continue;
                        }
                        channelUsers = channelConfig.users;
                        if (!Array.isArray(channelUsers) || channelUsers.length === 0) {
                          continue;
                        }
                        additions = [];
                        for (
                          _h = 0, channelUsers_2 = channelUsers;
                          _h < channelUsers_2.length;
                          _h++
                        ) {
                          entry = channelUsers_2[_h];
                          trimmed = String(entry).trim();
                          resolved = resolvedMap.get(trimmed);
                          if (
                            (resolved === null || resolved === void 0
                              ? void 0
                              : resolved.resolved) &&
                            resolved.id
                          ) {
                            additions.push(resolved.id);
                          }
                        }
                        nextChannels[channelKey] = __assign(__assign({}, channelConfig), {
                          users: (0, resolve_utils_js_1.mergeAllowlist)({
                            existing: channelUsers,
                            additions: additions,
                          }),
                        });
                      }
                      channelsConfig = nextChannels;
                      ctx.channelsConfig = nextChannels;
                      (0, resolve_utils_js_1.summarizeMapping)(
                        "slack channel users",
                        mapping,
                        unresolved,
                        runtime,
                      );
                      return [3 /*break*/, 13];
                    case 12:
                      err_3 = _q.sent();
                      (_p = runtime.log) === null || _p === void 0
                        ? void 0
                        : _p.call(
                            runtime,
                            "slack channel user resolve failed; using config entries. ".concat(
                              String(err_3),
                            ),
                          );
                      return [3 /*break*/, 13];
                    case 13:
                      return [2 /*return*/];
                  }
                });
              });
            })();
          }
          stopOnAbort = function () {
            var _a;
            if (
              ((_a = opts.abortSignal) === null || _a === void 0 ? void 0 : _a.aborted) &&
              slackMode === "socket"
            ) {
              void app.stop();
            }
          };
          (_17 = opts.abortSignal) === null || _17 === void 0
            ? void 0
            : _17.addEventListener("abort", stopOnAbort, { once: true });
          _22.label = 5;
        case 5:
          _22.trys.push([5, , 10, 12]);
          if (!(slackMode === "socket")) {
            return [3 /*break*/, 7];
          }
          return [4 /*yield*/, app.start()];
        case 6:
          _22.sent();
          (_18 = runtime.log) === null || _18 === void 0
            ? void 0
            : _18.call(runtime, "slack socket mode connected");
          return [3 /*break*/, 8];
        case 7:
          (_19 = runtime.log) === null || _19 === void 0
            ? void 0
            : _19.call(runtime, "slack http mode listening at ".concat(slackWebhookPath));
          _22.label = 8;
        case 8:
          if ((_20 = opts.abortSignal) === null || _20 === void 0 ? void 0 : _20.aborted) {
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            new Promise(function (resolve) {
              var _a;
              (_a = opts.abortSignal) === null || _a === void 0
                ? void 0
                : _a.addEventListener(
                    "abort",
                    function () {
                      return resolve();
                    },
                    {
                      once: true,
                    },
                  );
            }),
          ];
        case 9:
          _22.sent();
          return [3 /*break*/, 12];
        case 10:
          (_21 = opts.abortSignal) === null || _21 === void 0
            ? void 0
            : _21.removeEventListener("abort", stopOnAbort);
          unregisterHttpHandler === null || unregisterHttpHandler === void 0
            ? void 0
            : unregisterHttpHandler();
          return [
            4 /*yield*/,
            app.stop().catch(function () {
              return undefined;
            }),
          ];
        case 11:
          _22.sent();
          return [7 /*endfinally*/];
        case 12:
          return [2 /*return*/];
      }
    });
  });
}
