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
exports.monitorDiscordProvider = monitorDiscordProvider;
var node_util_1 = require("node:util");
var carbon_1 = require("@buape/carbon");
var gateway_1 = require("@buape/carbon/gateway");
var v10_1 = require("discord-api-types/v10");
var chunk_js_1 = require("../../auto-reply/chunk.js");
var commands_registry_js_1 = require("../../auto-reply/commands-registry.js");
var skill_commands_js_1 = require("../../auto-reply/skill-commands.js");
var resolve_utils_js_1 = require("../../channels/allowlists/resolve-utils.js");
var commands_js_1 = require("../../config/commands.js");
var config_js_1 = require("../../config/config.js");
var globals_js_1 = require("../../globals.js");
var errors_js_1 = require("../../infra/errors.js");
var retry_policy_js_1 = require("../../infra/retry-policy.js");
var subsystem_js_1 = require("../../logging/subsystem.js");
var accounts_js_1 = require("../accounts.js");
var gateway_logging_js_1 = require("../gateway-logging.js");
var monitor_gateway_js_1 = require("../monitor.gateway.js");
var probe_js_1 = require("../probe.js");
var resolve_channels_js_1 = require("../resolve-channels.js");
var resolve_users_js_1 = require("../resolve-users.js");
var token_js_1 = require("../token.js");
var listeners_js_1 = require("./listeners.js");
var message_handler_js_1 = require("./message-handler.js");
var native_command_js_1 = require("./native-command.js");
var exec_approvals_js_1 = require("./exec-approvals.js");
function summarizeAllowList(list) {
  if (!list || list.length === 0) {
    return "any";
  }
  var sample = list.slice(0, 4).map(function (entry) {
    return String(entry);
  });
  var suffix = list.length > sample.length ? " (+".concat(list.length - sample.length, ")") : "";
  return "".concat(sample.join(", ")).concat(suffix);
}
function summarizeGuilds(entries) {
  if (!entries || Object.keys(entries).length === 0) {
    return "any";
  }
  var keys = Object.keys(entries);
  var sample = keys.slice(0, 4);
  var suffix = keys.length > sample.length ? " (+".concat(keys.length - sample.length, ")") : "";
  return "".concat(sample.join(", ")).concat(suffix);
}
function deployDiscordCommands(params) {
  return __awaiter(this, void 0, void 0, function () {
    var runWithRetry, err_1, details;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          if (!params.enabled) {
            return [2 /*return*/];
          }
          runWithRetry = (0, retry_policy_js_1.createDiscordRetryRunner)({
            verbose: (0, globals_js_1.shouldLogVerbose)(),
          });
          _c.label = 1;
        case 1:
          _c.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            runWithRetry(function () {
              return params.client.handleDeployRequest();
            }, "command deploy"),
          ];
        case 2:
          _c.sent();
          return [3 /*break*/, 4];
        case 3:
          err_1 = _c.sent();
          details = formatDiscordDeployErrorDetails(err_1);
          (_b = (_a = params.runtime).error) === null || _b === void 0
            ? void 0
            : _b.call(
                _a,
                (0, globals_js_1.danger)(
                  "discord: failed to deploy native commands: "
                    .concat((0, errors_js_1.formatErrorMessage)(err_1))
                    .concat(details),
                ),
              );
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function formatDiscordDeployErrorDetails(err) {
  if (!err || typeof err !== "object") {
    return "";
  }
  var status = err.status;
  var discordCode = err.discordCode;
  var rawBody = err.rawBody;
  var details = [];
  if (typeof status === "number") {
    details.push("status=".concat(status));
  }
  if (typeof discordCode === "number" || typeof discordCode === "string") {
    details.push("code=".concat(discordCode));
  }
  if (rawBody !== undefined) {
    var bodyText = "";
    try {
      bodyText = JSON.stringify(rawBody);
    } catch (_a) {
      bodyText =
        typeof rawBody === "string"
          ? rawBody
          : (0, node_util_1.inspect)(rawBody, { depth: 3, breakLength: 120 });
    }
    if (bodyText) {
      var maxLen = 800;
      var trimmed =
        bodyText.length > maxLen ? "".concat(bodyText.slice(0, maxLen), "...") : bodyText;
      details.push("body=".concat(trimmed));
    }
  }
  return details.length > 0 ? " (".concat(details.join(", "), ")") : "";
}
function resolveDiscordGatewayIntents(intentsConfig) {
  var intents =
    gateway_1.GatewayIntents.Guilds |
    gateway_1.GatewayIntents.GuildMessages |
    gateway_1.GatewayIntents.MessageContent |
    gateway_1.GatewayIntents.DirectMessages |
    gateway_1.GatewayIntents.GuildMessageReactions |
    gateway_1.GatewayIntents.DirectMessageReactions;
  if (intentsConfig === null || intentsConfig === void 0 ? void 0 : intentsConfig.presence) {
    intents |= gateway_1.GatewayIntents.GuildPresences;
  }
  if (intentsConfig === null || intentsConfig === void 0 ? void 0 : intentsConfig.guildMembers) {
    intents |= gateway_1.GatewayIntents.GuildMembers;
  }
  return intents;
}
function monitorDiscordProvider() {
  return __awaiter(this, arguments, void 0, function (opts) {
    var cfg,
      account,
      token,
      runtime,
      discordCfg,
      dmConfig,
      guildEntries,
      defaultGroupPolicy,
      groupPolicy,
      allowFrom,
      mediaMaxBytes,
      textLimit,
      historyLimit,
      replyToMode,
      dmEnabled,
      dmPolicy,
      groupDmEnabled,
      groupDmChannels,
      nativeEnabled,
      nativeSkillsEnabled,
      nativeDisabledExplicit,
      useAccessGroups,
      sessionPrefix,
      ephemeralDefault,
      entries,
      _i,
      _a,
      _b,
      guildKey,
      guildCfg,
      channels,
      channelKeys,
      _c,
      channelKeys_1,
      channelKey,
      resolved,
      nextGuilds,
      mapping,
      unresolved,
      _loop_1,
      _d,
      resolved_1,
      entry,
      err_2,
      allowEntries,
      resolvedUsers,
      mapping,
      unresolved,
      additions,
      _e,
      resolvedUsers_1,
      entry,
      err_3,
      userEntries,
      _f,
      _g,
      guild,
      users,
      _h,
      users_1,
      entry,
      trimmed,
      channels,
      _j,
      _k,
      channel,
      channelUsers,
      _l,
      channelUsers_1,
      entry,
      trimmed,
      resolvedUsers,
      resolvedMap,
      mapping,
      unresolved,
      nextGuilds,
      _m,
      _o,
      _p,
      guildKey,
      guildConfig,
      nextGuild,
      users,
      additions,
      _q,
      users_2,
      entry,
      trimmed,
      resolved,
      channels,
      nextChannels,
      _r,
      _s,
      _t,
      channelKey,
      channelConfig,
      channelUsers,
      additions,
      _u,
      channelUsers_2,
      entry,
      trimmed,
      resolved,
      err_4,
      applicationId,
      maxDiscordCommands,
      skillCommands,
      commandSpecs,
      initialCommandCount,
      commands,
      execApprovalsConfig,
      execApprovalsHandler,
      components,
      client,
      logger,
      guildHistories,
      botUserId,
      botUser,
      err_5,
      messageHandler,
      gateway,
      gatewayEmitter,
      stopGatewayLogging,
      abortSignal,
      onAbort,
      HELLO_TIMEOUT_MS,
      helloTimeoutId,
      onGatewayDebug;
    var _v,
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
      _23,
      _24,
      _25,
      _26,
      _27,
      _28,
      _29,
      _30,
      _31,
      _32,
      _33,
      _34,
      _35,
      _36,
      _37,
      _38,
      _39;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_40) {
      switch (_40.label) {
        case 0:
          cfg = (_v = opts.config) !== null && _v !== void 0 ? _v : (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveDiscordAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          token =
            (_x = (0, token_js_1.normalizeDiscordToken)(
              (_w = opts.token) !== null && _w !== void 0 ? _w : undefined,
            )) !== null && _x !== void 0
              ? _x
              : account.token;
          if (!token) {
            throw new Error(
              'Discord bot token missing for account "'
                .concat(account.accountId, '" (set discord.accounts.')
                .concat(account.accountId, ".token or DISCORD_BOT_TOKEN for default)."),
            );
          }
          runtime =
            (_y = opts.runtime) !== null && _y !== void 0
              ? _y
              : {
                  log: console.log,
                  error: console.error,
                  exit: function (code) {
                    throw new Error("exit ".concat(code));
                  },
                };
          discordCfg = account.config;
          dmConfig = discordCfg.dm;
          guildEntries = discordCfg.guilds;
          defaultGroupPolicy =
            (_0 = (_z = cfg.channels) === null || _z === void 0 ? void 0 : _z.defaults) === null ||
            _0 === void 0
              ? void 0
              : _0.groupPolicy;
          groupPolicy =
            (_2 =
              (_1 = discordCfg.groupPolicy) !== null && _1 !== void 0 ? _1 : defaultGroupPolicy) !==
              null && _2 !== void 0
              ? _2
              : "open";
          if (
            discordCfg.groupPolicy === undefined &&
            discordCfg.guilds === undefined &&
            defaultGroupPolicy === undefined &&
            groupPolicy === "open"
          ) {
            (_3 = runtime.log) === null || _3 === void 0
              ? void 0
              : _3.call(
                  runtime,
                  (0, globals_js_1.warn)(
                    'discord: groupPolicy defaults to "open" when channels.discord is missing; set channels.discord.groupPolicy (or channels.defaults.groupPolicy) or add channels.discord.guilds to restrict access.',
                  ),
                );
          }
          allowFrom = dmConfig === null || dmConfig === void 0 ? void 0 : dmConfig.allowFrom;
          mediaMaxBytes =
            ((_5 =
              (_4 = opts.mediaMaxMb) !== null && _4 !== void 0 ? _4 : discordCfg.mediaMaxMb) !==
              null && _5 !== void 0
              ? _5
              : 8) *
            1024 *
            1024;
          textLimit = (0, chunk_js_1.resolveTextChunkLimit)(cfg, "discord", account.accountId, {
            fallbackLimit: 2000,
          });
          historyLimit = Math.max(
            0,
            (_10 =
              (_7 =
                (_6 = opts.historyLimit) !== null && _6 !== void 0
                  ? _6
                  : discordCfg.historyLimit) !== null && _7 !== void 0
                ? _7
                : (_9 = (_8 = cfg.messages) === null || _8 === void 0 ? void 0 : _8.groupChat) ===
                      null || _9 === void 0
                  ? void 0
                  : _9.historyLimit) !== null && _10 !== void 0
              ? _10
              : 20,
          );
          replyToMode =
            (_12 =
              (_11 = opts.replyToMode) !== null && _11 !== void 0
                ? _11
                : discordCfg.replyToMode) !== null && _12 !== void 0
              ? _12
              : "off";
          dmEnabled =
            (_13 = dmConfig === null || dmConfig === void 0 ? void 0 : dmConfig.enabled) !== null &&
            _13 !== void 0
              ? _13
              : true;
          dmPolicy =
            (_14 = dmConfig === null || dmConfig === void 0 ? void 0 : dmConfig.policy) !== null &&
            _14 !== void 0
              ? _14
              : "pairing";
          groupDmEnabled =
            (_15 = dmConfig === null || dmConfig === void 0 ? void 0 : dmConfig.groupEnabled) !==
              null && _15 !== void 0
              ? _15
              : false;
          groupDmChannels =
            dmConfig === null || dmConfig === void 0 ? void 0 : dmConfig.groupChannels;
          nativeEnabled = (0, commands_js_1.resolveNativeCommandsEnabled)({
            providerId: "discord",
            providerSetting:
              (_16 = discordCfg.commands) === null || _16 === void 0 ? void 0 : _16.native,
            globalSetting: (_17 = cfg.commands) === null || _17 === void 0 ? void 0 : _17.native,
          });
          nativeSkillsEnabled = (0, commands_js_1.resolveNativeSkillsEnabled)({
            providerId: "discord",
            providerSetting:
              (_18 = discordCfg.commands) === null || _18 === void 0 ? void 0 : _18.nativeSkills,
            globalSetting:
              (_19 = cfg.commands) === null || _19 === void 0 ? void 0 : _19.nativeSkills,
          });
          nativeDisabledExplicit = (0, commands_js_1.isNativeCommandsExplicitlyDisabled)({
            providerSetting:
              (_20 = discordCfg.commands) === null || _20 === void 0 ? void 0 : _20.native,
            globalSetting: (_21 = cfg.commands) === null || _21 === void 0 ? void 0 : _21.native,
          });
          useAccessGroups =
            ((_22 = cfg.commands) === null || _22 === void 0 ? void 0 : _22.useAccessGroups) !==
            false;
          sessionPrefix = "discord:slash";
          ephemeralDefault = true;
          if (!token) {
            return [3 /*break*/, 13];
          }
          if (!(guildEntries && Object.keys(guildEntries).length > 0)) {
            return [3 /*break*/, 5];
          }
          _40.label = 1;
        case 1:
          _40.trys.push([1, 4, , 5]);
          entries = [];
          for (_i = 0, _a = Object.entries(guildEntries); _i < _a.length; _i++) {
            ((_b = _a[_i]), (guildKey = _b[0]), (guildCfg = _b[1]));
            if (guildKey === "*") {
              continue;
            }
            channels =
              (_23 = guildCfg === null || guildCfg === void 0 ? void 0 : guildCfg.channels) !==
                null && _23 !== void 0
                ? _23
                : {};
            channelKeys = Object.keys(channels).filter(function (key) {
              return key !== "*";
            });
            if (channelKeys.length === 0) {
              entries.push({ input: guildKey, guildKey: guildKey });
              continue;
            }
            for (_c = 0, channelKeys_1 = channelKeys; _c < channelKeys_1.length; _c++) {
              channelKey = channelKeys_1[_c];
              entries.push({
                input: "".concat(guildKey, "/").concat(channelKey),
                guildKey: guildKey,
                channelKey: channelKey,
              });
            }
          }
          if (!(entries.length > 0)) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            (0, resolve_channels_js_1.resolveDiscordChannelAllowlist)({
              token: token,
              entries: entries.map(function (entry) {
                return entry.input;
              }),
            }),
          ];
        case 2:
          resolved = _40.sent();
          nextGuilds = __assign({}, guildEntries);
          mapping = [];
          unresolved = [];
          _loop_1 = function (entry) {
            var _41;
            var source = entries.find(function (item) {
              return item.input === entry.input;
            });
            if (!source) {
              return "continue";
            }
            var sourceGuild =
              (_24 =
                guildEntries === null || guildEntries === void 0
                  ? void 0
                  : guildEntries[source.guildKey]) !== null && _24 !== void 0
                ? _24
                : {};
            if (!entry.resolved || !entry.guildId) {
              unresolved.push(entry.input);
              return "continue";
            }
            mapping.push(
              entry.channelId
                ? ""
                    .concat(entry.input, "\u2192")
                    .concat(entry.guildId, "/")
                    .concat(entry.channelId)
                : "".concat(entry.input, "\u2192").concat(entry.guildId),
            );
            var existing = (_25 = nextGuilds[entry.guildId]) !== null && _25 !== void 0 ? _25 : {};
            var mergedChannels = __assign(__assign({}, sourceGuild.channels), existing.channels);
            var mergedGuild = __assign(__assign(__assign({}, sourceGuild), existing), {
              channels: mergedChannels,
            });
            nextGuilds[entry.guildId] = mergedGuild;
            if (source.channelKey && entry.channelId) {
              var sourceChannel =
                (_26 = sourceGuild.channels) === null || _26 === void 0
                  ? void 0
                  : _26[source.channelKey];
              if (sourceChannel) {
                nextGuilds[entry.guildId] = __assign(__assign({}, mergedGuild), {
                  channels: __assign(
                    __assign({}, mergedChannels),
                    ((_41 = {}),
                    (_41[entry.channelId] = __assign(
                      __assign({}, sourceChannel),
                      mergedChannels === null || mergedChannels === void 0
                        ? void 0
                        : mergedChannels[entry.channelId],
                    )),
                    _41),
                  ),
                });
              }
            }
          };
          for (_d = 0, resolved_1 = resolved; _d < resolved_1.length; _d++) {
            entry = resolved_1[_d];
            _loop_1(entry);
          }
          guildEntries = nextGuilds;
          (0, resolve_utils_js_1.summarizeMapping)(
            "discord channels",
            mapping,
            unresolved,
            runtime,
          );
          _40.label = 3;
        case 3:
          return [3 /*break*/, 5];
        case 4:
          err_2 = _40.sent();
          (_27 = runtime.log) === null || _27 === void 0
            ? void 0
            : _27.call(
                runtime,
                "discord channel resolve failed; using config entries. ".concat(
                  (0, errors_js_1.formatErrorMessage)(err_2),
                ),
              );
          return [3 /*break*/, 5];
        case 5:
          allowEntries =
            (_28 =
              allowFrom === null || allowFrom === void 0
                ? void 0
                : allowFrom.filter(function (entry) {
                    return String(entry).trim() && String(entry).trim() !== "*";
                  })) !== null && _28 !== void 0
              ? _28
              : [];
          if (!(allowEntries.length > 0)) {
            return [3 /*break*/, 9];
          }
          _40.label = 6;
        case 6:
          _40.trys.push([6, 8, , 9]);
          return [
            4 /*yield*/,
            (0, resolve_users_js_1.resolveDiscordUserAllowlist)({
              token: token,
              entries: allowEntries.map(function (entry) {
                return String(entry);
              }),
            }),
          ];
        case 7:
          resolvedUsers = _40.sent();
          mapping = [];
          unresolved = [];
          additions = [];
          for (_e = 0, resolvedUsers_1 = resolvedUsers; _e < resolvedUsers_1.length; _e++) {
            entry = resolvedUsers_1[_e];
            if (entry.resolved && entry.id) {
              mapping.push("".concat(entry.input, "\u2192").concat(entry.id));
              additions.push(entry.id);
            } else {
              unresolved.push(entry.input);
            }
          }
          allowFrom = (0, resolve_utils_js_1.mergeAllowlist)({
            existing: allowFrom,
            additions: additions,
          });
          (0, resolve_utils_js_1.summarizeMapping)("discord users", mapping, unresolved, runtime);
          return [3 /*break*/, 9];
        case 8:
          err_3 = _40.sent();
          (_29 = runtime.log) === null || _29 === void 0
            ? void 0
            : _29.call(
                runtime,
                "discord user resolve failed; using config entries. ".concat(
                  (0, errors_js_1.formatErrorMessage)(err_3),
                ),
              );
          return [3 /*break*/, 9];
        case 9:
          if (!(guildEntries && Object.keys(guildEntries).length > 0)) {
            return [3 /*break*/, 13];
          }
          userEntries = new Set();
          for (_f = 0, _g = Object.values(guildEntries); _f < _g.length; _f++) {
            guild = _g[_f];
            if (!guild || typeof guild !== "object") {
              continue;
            }
            users = guild.users;
            if (Array.isArray(users)) {
              for (_h = 0, users_1 = users; _h < users_1.length; _h++) {
                entry = users_1[_h];
                trimmed = String(entry).trim();
                if (trimmed && trimmed !== "*") {
                  userEntries.add(trimmed);
                }
              }
            }
            channels = (_30 = guild.channels) !== null && _30 !== void 0 ? _30 : {};
            for (_j = 0, _k = Object.values(channels); _j < _k.length; _j++) {
              channel = _k[_j];
              if (!channel || typeof channel !== "object") {
                continue;
              }
              channelUsers = channel.users;
              if (!Array.isArray(channelUsers)) {
                continue;
              }
              for (_l = 0, channelUsers_1 = channelUsers; _l < channelUsers_1.length; _l++) {
                entry = channelUsers_1[_l];
                trimmed = String(entry).trim();
                if (trimmed && trimmed !== "*") {
                  userEntries.add(trimmed);
                }
              }
            }
          }
          if (!(userEntries.size > 0)) {
            return [3 /*break*/, 13];
          }
          _40.label = 10;
        case 10:
          _40.trys.push([10, 12, , 13]);
          return [
            4 /*yield*/,
            (0, resolve_users_js_1.resolveDiscordUserAllowlist)({
              token: token,
              entries: Array.from(userEntries),
            }),
          ];
        case 11:
          resolvedUsers = _40.sent();
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
          nextGuilds = __assign({}, guildEntries);
          for (
            _m = 0,
              _o = Object.entries(
                guildEntries !== null && guildEntries !== void 0 ? guildEntries : {},
              );
            _m < _o.length;
            _m++
          ) {
            ((_p = _o[_m]), (guildKey = _p[0]), (guildConfig = _p[1]));
            if (!guildConfig || typeof guildConfig !== "object") {
              continue;
            }
            nextGuild = __assign({}, guildConfig);
            users = guildConfig.users;
            if (Array.isArray(users) && users.length > 0) {
              additions = [];
              for (_q = 0, users_2 = users; _q < users_2.length; _q++) {
                entry = users_2[_q];
                trimmed = String(entry).trim();
                resolved = resolvedMap.get(trimmed);
                if (
                  (resolved === null || resolved === void 0 ? void 0 : resolved.resolved) &&
                  resolved.id
                ) {
                  additions.push(resolved.id);
                }
              }
              nextGuild.users = (0, resolve_utils_js_1.mergeAllowlist)({
                existing: users,
                additions: additions,
              });
            }
            channels = (_31 = guildConfig.channels) !== null && _31 !== void 0 ? _31 : {};
            if (channels && typeof channels === "object") {
              nextChannels = __assign({}, channels);
              for (_r = 0, _s = Object.entries(channels); _r < _s.length; _r++) {
                ((_t = _s[_r]), (channelKey = _t[0]), (channelConfig = _t[1]));
                if (!channelConfig || typeof channelConfig !== "object") {
                  continue;
                }
                channelUsers = channelConfig.users;
                if (!Array.isArray(channelUsers) || channelUsers.length === 0) {
                  continue;
                }
                additions = [];
                for (_u = 0, channelUsers_2 = channelUsers; _u < channelUsers_2.length; _u++) {
                  entry = channelUsers_2[_u];
                  trimmed = String(entry).trim();
                  resolved = resolvedMap.get(trimmed);
                  if (
                    (resolved === null || resolved === void 0 ? void 0 : resolved.resolved) &&
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
              nextGuild.channels = nextChannels;
            }
            nextGuilds[guildKey] = nextGuild;
          }
          guildEntries = nextGuilds;
          (0, resolve_utils_js_1.summarizeMapping)(
            "discord channel users",
            mapping,
            unresolved,
            runtime,
          );
          return [3 /*break*/, 13];
        case 12:
          err_4 = _40.sent();
          (_32 = runtime.log) === null || _32 === void 0
            ? void 0
            : _32.call(
                runtime,
                "discord channel user resolve failed; using config entries. ".concat(
                  (0, errors_js_1.formatErrorMessage)(err_4),
                ),
              );
          return [3 /*break*/, 13];
        case 13:
          if ((0, globals_js_1.shouldLogVerbose)()) {
            (0, globals_js_1.logVerbose)(
              "discord: config dm="
                .concat(dmEnabled ? "on" : "off", " dmPolicy=")
                .concat(dmPolicy, " allowFrom=")
                .concat(summarizeAllowList(allowFrom), " groupDm=")
                .concat(groupDmEnabled ? "on" : "off", " groupDmChannels=")
                .concat(summarizeAllowList(groupDmChannels), " groupPolicy=")
                .concat(groupPolicy, " guilds=")
                .concat(summarizeGuilds(guildEntries), " historyLimit=")
                .concat(historyLimit, " mediaMaxMb=")
                .concat(Math.round(mediaMaxBytes / (1024 * 1024)), " native=")
                .concat(nativeEnabled ? "on" : "off", " nativeSkills=")
                .concat(nativeSkillsEnabled ? "on" : "off", " accessGroups=")
                .concat(useAccessGroups ? "on" : "off"),
            );
          }
          return [4 /*yield*/, (0, probe_js_1.fetchDiscordApplicationId)(token, 4000)];
        case 14:
          applicationId = _40.sent();
          if (!applicationId) {
            throw new Error("Failed to resolve Discord application id");
          }
          maxDiscordCommands = 100;
          skillCommands =
            nativeEnabled && nativeSkillsEnabled
              ? (0, skill_commands_js_1.listSkillCommandsForAgents)({ cfg: cfg })
              : [];
          commandSpecs = nativeEnabled
            ? (0, commands_registry_js_1.listNativeCommandSpecsForConfig)(cfg, {
                skillCommands: skillCommands,
                provider: "discord",
              })
            : [];
          initialCommandCount = commandSpecs.length;
          if (nativeEnabled && nativeSkillsEnabled && commandSpecs.length > maxDiscordCommands) {
            skillCommands = [];
            commandSpecs = (0, commands_registry_js_1.listNativeCommandSpecsForConfig)(cfg, {
              skillCommands: [],
              provider: "discord",
            });
            (_33 = runtime.log) === null || _33 === void 0
              ? void 0
              : _33.call(
                  runtime,
                  (0, globals_js_1.warn)(
                    "discord: ".concat(
                      initialCommandCount,
                      " commands exceeds limit; removing per-skill commands and keeping /skill.",
                    ),
                  ),
                );
          }
          if (nativeEnabled && commandSpecs.length > maxDiscordCommands) {
            (_34 = runtime.log) === null || _34 === void 0
              ? void 0
              : _34.call(
                  runtime,
                  (0, globals_js_1.warn)(
                    "discord: ".concat(
                      commandSpecs.length,
                      " commands exceeds limit; some commands may fail to deploy.",
                    ),
                  ),
                );
          }
          commands = commandSpecs.map(function (spec) {
            return (0, native_command_js_1.createDiscordNativeCommand)({
              command: spec,
              cfg: cfg,
              discordConfig: discordCfg,
              accountId: account.accountId,
              sessionPrefix: sessionPrefix,
              ephemeralDefault: ephemeralDefault,
            });
          });
          execApprovalsConfig =
            (_35 = discordCfg.execApprovals) !== null && _35 !== void 0 ? _35 : {};
          execApprovalsHandler = execApprovalsConfig.enabled
            ? new exec_approvals_js_1.DiscordExecApprovalHandler({
                token: token,
                accountId: account.accountId,
                config: execApprovalsConfig,
                cfg: cfg,
                runtime: runtime,
              })
            : null;
          components = [
            (0, native_command_js_1.createDiscordCommandArgFallbackButton)({
              cfg: cfg,
              discordConfig: discordCfg,
              accountId: account.accountId,
              sessionPrefix: sessionPrefix,
            }),
          ];
          if (execApprovalsHandler) {
            components.push(
              (0, exec_approvals_js_1.createExecApprovalButton)({ handler: execApprovalsHandler }),
            );
          }
          client = new carbon_1.Client(
            {
              baseUrl: "http://localhost",
              deploySecret: "a",
              clientId: applicationId,
              publicKey: "a",
              token: token,
              autoDeploy: false,
            },
            {
              commands: commands,
              listeners: [],
              components: components,
            },
            [
              new gateway_1.GatewayPlugin({
                reconnect: {
                  maxAttempts: Number.POSITIVE_INFINITY,
                },
                intents: resolveDiscordGatewayIntents(discordCfg.intents),
                autoInteractions: true,
              }),
            ],
          );
          return [
            4 /*yield*/,
            deployDiscordCommands({ client: client, runtime: runtime, enabled: nativeEnabled }),
          ];
        case 15:
          _40.sent();
          logger = (0, subsystem_js_1.createSubsystemLogger)("discord/monitor");
          guildHistories = new Map();
          if (!nativeDisabledExplicit) {
            return [3 /*break*/, 17];
          }
          return [
            4 /*yield*/,
            clearDiscordNativeCommands({
              client: client,
              applicationId: applicationId,
              runtime: runtime,
            }),
          ];
        case 16:
          _40.sent();
          _40.label = 17;
        case 17:
          _40.trys.push([17, 19, , 20]);
          return [4 /*yield*/, client.fetchUser("@me")];
        case 18:
          botUser = _40.sent();
          botUserId = botUser === null || botUser === void 0 ? void 0 : botUser.id;
          return [3 /*break*/, 20];
        case 19:
          err_5 = _40.sent();
          (_36 = runtime.error) === null || _36 === void 0
            ? void 0
            : _36.call(
                runtime,
                (0, globals_js_1.danger)(
                  "discord: failed to fetch bot identity: ".concat(String(err_5)),
                ),
              );
          return [3 /*break*/, 20];
        case 20:
          messageHandler = (0, message_handler_js_1.createDiscordMessageHandler)({
            cfg: cfg,
            discordConfig: discordCfg,
            accountId: account.accountId,
            token: token,
            runtime: runtime,
            botUserId: botUserId,
            guildHistories: guildHistories,
            historyLimit: historyLimit,
            mediaMaxBytes: mediaMaxBytes,
            textLimit: textLimit,
            replyToMode: replyToMode,
            dmEnabled: dmEnabled,
            groupDmEnabled: groupDmEnabled,
            groupDmChannels: groupDmChannels,
            allowFrom: allowFrom,
            guildEntries: guildEntries,
          });
          (0, listeners_js_1.registerDiscordListener)(
            client.listeners,
            new listeners_js_1.DiscordMessageListener(messageHandler, logger),
          );
          (0, listeners_js_1.registerDiscordListener)(
            client.listeners,
            new listeners_js_1.DiscordReactionListener({
              cfg: cfg,
              accountId: account.accountId,
              runtime: runtime,
              botUserId: botUserId,
              guildEntries: guildEntries,
              logger: logger,
            }),
          );
          (0, listeners_js_1.registerDiscordListener)(
            client.listeners,
            new listeners_js_1.DiscordReactionRemoveListener({
              cfg: cfg,
              accountId: account.accountId,
              runtime: runtime,
              botUserId: botUserId,
              guildEntries: guildEntries,
              logger: logger,
            }),
          );
          if ((_37 = discordCfg.intents) === null || _37 === void 0 ? void 0 : _37.presence) {
            (0, listeners_js_1.registerDiscordListener)(
              client.listeners,
              new listeners_js_1.DiscordPresenceListener({
                logger: logger,
                accountId: account.accountId,
              }),
            );
            (_38 = runtime.log) === null || _38 === void 0
              ? void 0
              : _38.call(
                  runtime,
                  "discord: GuildPresences intent enabled — presence listener registered",
                );
          }
          (_39 = runtime.log) === null || _39 === void 0
            ? void 0
            : _39.call(
                runtime,
                "logged in to discord".concat(botUserId ? " as ".concat(botUserId) : ""),
              );
          if (!execApprovalsHandler) {
            return [3 /*break*/, 22];
          }
          return [4 /*yield*/, execApprovalsHandler.start()];
        case 21:
          _40.sent();
          _40.label = 22;
        case 22:
          gateway = client.getPlugin("gateway");
          gatewayEmitter = (0, monitor_gateway_js_1.getDiscordGatewayEmitter)(gateway);
          stopGatewayLogging = (0, gateway_logging_js_1.attachDiscordGatewayLogging)({
            emitter: gatewayEmitter,
            runtime: runtime,
          });
          abortSignal = opts.abortSignal;
          onAbort = function () {
            if (!gateway) {
              return;
            }
            // Carbon emits an error when maxAttempts is 0; keep a one-shot listener to avoid
            // an unhandled error after we tear down listeners during abort.
            gatewayEmitter === null || gatewayEmitter === void 0
              ? void 0
              : gatewayEmitter.once("error", function () {});
            gateway.options.reconnect = { maxAttempts: 0 };
            gateway.disconnect();
          };
          if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
            onAbort();
          } else {
            abortSignal === null || abortSignal === void 0
              ? void 0
              : abortSignal.addEventListener("abort", onAbort, { once: true });
          }
          HELLO_TIMEOUT_MS = 30000;
          onGatewayDebug = function (msg) {
            var message = String(msg);
            if (!message.includes("WebSocket connection opened")) {
              return;
            }
            if (helloTimeoutId) {
              clearTimeout(helloTimeoutId);
            }
            helloTimeoutId = setTimeout(function () {
              var _a;
              if (!(gateway === null || gateway === void 0 ? void 0 : gateway.isConnected)) {
                (_a = runtime.log) === null || _a === void 0
                  ? void 0
                  : _a.call(
                      runtime,
                      (0, globals_js_1.danger)(
                        "connection stalled: no HELLO received within ".concat(
                          HELLO_TIMEOUT_MS,
                          "ms, forcing reconnect",
                        ),
                      ),
                    );
                gateway === null || gateway === void 0 ? void 0 : gateway.disconnect();
                gateway === null || gateway === void 0 ? void 0 : gateway.connect(false);
              }
              helloTimeoutId = undefined;
            }, HELLO_TIMEOUT_MS);
          };
          gatewayEmitter === null || gatewayEmitter === void 0
            ? void 0
            : gatewayEmitter.on("debug", onGatewayDebug);
          _40.label = 23;
        case 23:
          _40.trys.push([23, , 25, 28]);
          return [
            4 /*yield*/,
            (0, monitor_gateway_js_1.waitForDiscordGatewayStop)({
              gateway: gateway
                ? {
                    emitter: gatewayEmitter,
                    disconnect: function () {
                      return gateway.disconnect();
                    },
                  }
                : undefined,
              abortSignal: abortSignal,
              onGatewayError: function (err) {
                var _a;
                (_a = runtime.error) === null || _a === void 0
                  ? void 0
                  : _a.call(
                      runtime,
                      (0, globals_js_1.danger)("discord gateway error: ".concat(String(err))),
                    );
              },
              shouldStopOnError: function (err) {
                var message = String(err);
                return (
                  message.includes("Max reconnect attempts") ||
                  message.includes("Fatal Gateway error")
                );
              },
            }),
          ];
        case 24:
          _40.sent();
          return [3 /*break*/, 28];
        case 25:
          stopGatewayLogging();
          if (helloTimeoutId) {
            clearTimeout(helloTimeoutId);
          }
          gatewayEmitter === null || gatewayEmitter === void 0
            ? void 0
            : gatewayEmitter.removeListener("debug", onGatewayDebug);
          abortSignal === null || abortSignal === void 0
            ? void 0
            : abortSignal.removeEventListener("abort", onAbort);
          if (!execApprovalsHandler) {
            return [3 /*break*/, 27];
          }
          return [4 /*yield*/, execApprovalsHandler.stop()];
        case 26:
          _40.sent();
          _40.label = 27;
        case 27:
          return [7 /*endfinally*/];
        case 28:
          return [2 /*return*/];
      }
    });
  });
}
function clearDiscordNativeCommands(params) {
  return __awaiter(this, void 0, void 0, function () {
    var err_6;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          _c.trys.push([0, 2, , 3]);
          return [
            4 /*yield*/,
            params.client.rest.put(v10_1.Routes.applicationCommands(params.applicationId), {
              body: [],
            }),
          ];
        case 1:
          _c.sent();
          (0, globals_js_1.logVerbose)("discord: cleared native commands (commands.native=false)");
          return [3 /*break*/, 3];
        case 2:
          err_6 = _c.sent();
          (_b = (_a = params.runtime).error) === null || _b === void 0
            ? void 0
            : _b.call(
                _a,
                (0, globals_js_1.danger)(
                  "discord: failed to clear native commands: ".concat(String(err_6)),
                ),
              );
          return [3 /*break*/, 3];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
