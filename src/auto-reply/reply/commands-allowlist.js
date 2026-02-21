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
exports.handleAllowlistCommand = void 0;
var config_js_1 = require("../../config/config.js");
var config_writes_js_1 = require("../../channels/plugins/config-writes.js");
var dock_js_1 = require("../../channels/dock.js");
var registry_js_1 = require("../../channels/registry.js");
var pairing_js_1 = require("../../channels/plugins/pairing.js");
var globals_js_1 = require("../../globals.js");
var session_key_js_1 = require("../../routing/session-key.js");
var accounts_js_1 = require("../../discord/accounts.js");
var accounts_js_2 = require("../../imessage/accounts.js");
var accounts_js_3 = require("../../signal/accounts.js");
var accounts_js_4 = require("../../slack/accounts.js");
var accounts_js_5 = require("../../telegram/accounts.js");
var accounts_js_6 = require("../../web/accounts.js");
var resolve_users_js_1 = require("../../slack/resolve-users.js");
var resolve_users_js_2 = require("../../discord/resolve-users.js");
var pairing_store_js_1 = require("../../pairing/pairing-store.js");
var ACTIONS = new Set(["list", "add", "remove"]);
var SCOPES = new Set(["dm", "group", "all"]);
function parseAllowlistCommand(raw) {
  var _a, _b;
  var trimmed = raw.trim();
  if (!trimmed.toLowerCase().startsWith("/allowlist")) {
    return null;
  }
  var rest = trimmed.slice("/allowlist".length).trim();
  if (!rest) {
    return { action: "list", scope: "dm" };
  }
  var tokens = rest.split(/\s+/);
  var action = "list";
  var scope = "dm";
  var resolve = false;
  var target = "both";
  var channel;
  var account;
  var entryTokens = [];
  var i = 0;
  if (tokens[i] && ACTIONS.has(tokens[i].toLowerCase())) {
    action = tokens[i].toLowerCase();
    i += 1;
  }
  if (tokens[i] && SCOPES.has(tokens[i].toLowerCase())) {
    scope = tokens[i].toLowerCase();
    i += 1;
  }
  for (; i < tokens.length; i += 1) {
    var token = tokens[i];
    var lowered = token.toLowerCase();
    if (lowered === "--resolve" || lowered === "resolve") {
      resolve = true;
      continue;
    }
    if (lowered === "--config" || lowered === "config") {
      target = "config";
      continue;
    }
    if (lowered === "--store" || lowered === "store") {
      target = "store";
      continue;
    }
    if (lowered === "--channel" && tokens[i + 1]) {
      channel = tokens[i + 1];
      i += 1;
      continue;
    }
    if (lowered === "--account" && tokens[i + 1]) {
      account = tokens[i + 1];
      i += 1;
      continue;
    }
    var kv = token.split("=");
    if (kv.length === 2) {
      var key = (_a = kv[0]) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
      var value = (_b = kv[1]) === null || _b === void 0 ? void 0 : _b.trim();
      if (key === "channel") {
        if (value) {
          channel = value;
        }
        continue;
      }
      if (key === "account") {
        if (value) {
          account = value;
        }
        continue;
      }
      if (key === "scope" && value && SCOPES.has(value.toLowerCase())) {
        scope = value.toLowerCase();
        continue;
      }
    }
    entryTokens.push(token);
  }
  if (action === "add" || action === "remove") {
    var entry = entryTokens.join(" ").trim();
    if (!entry) {
      return { action: "error", message: "Usage: /allowlist add|remove <entry>" };
    }
    return {
      action: action,
      scope: scope,
      entry: entry,
      channel: channel,
      account: account,
      resolve: resolve,
      target: target,
    };
  }
  return { action: "list", scope: scope, channel: channel, account: account, resolve: resolve };
}
function normalizeAllowFrom(params) {
  var _a;
  var dock = (0, dock_js_1.getChannelDock)(params.channelId);
  if (
    (_a = dock === null || dock === void 0 ? void 0 : dock.config) === null || _a === void 0
      ? void 0
      : _a.formatAllowFrom
  ) {
    return dock.config.formatAllowFrom({
      cfg: params.cfg,
      accountId: params.accountId,
      allowFrom: params.values,
    });
  }
  return params.values
    .map(function (entry) {
      return String(entry).trim();
    })
    .filter(Boolean);
}
function formatEntryList(entries, resolved) {
  if (entries.length === 0) {
    return "(none)";
  }
  return entries
    .map(function (entry) {
      var name = resolved === null || resolved === void 0 ? void 0 : resolved.get(entry);
      return name ? "".concat(entry, " (").concat(name, ")") : entry;
    })
    .join(", ");
}
function resolveAccountTarget(parsed, channelId, accountId) {
  var _a, _b, _c, _d;
  var channels = (_a = parsed.channels) !== null && _a !== void 0 ? _a : (parsed.channels = {});
  var channel =
    (_b = channels[channelId]) !== null && _b !== void 0 ? _b : (channels[channelId] = {});
  var normalizedAccountId = (0, session_key_js_1.normalizeAccountId)(accountId);
  var hasAccounts = Boolean(channel.accounts && typeof channel.accounts === "object");
  var useAccount = normalizedAccountId !== session_key_js_1.DEFAULT_ACCOUNT_ID || hasAccounts;
  if (!useAccount) {
    return {
      target: channel,
      pathPrefix: "channels.".concat(channelId),
      accountId: normalizedAccountId,
    };
  }
  var accounts = (_c = channel.accounts) !== null && _c !== void 0 ? _c : (channel.accounts = {});
  var account =
    (_d = accounts[normalizedAccountId]) !== null && _d !== void 0
      ? _d
      : (accounts[normalizedAccountId] = {});
  return {
    target: account,
    pathPrefix: "channels.".concat(channelId, ".accounts.").concat(normalizedAccountId),
    accountId: normalizedAccountId,
  };
}
function getNestedValue(root, path) {
  var current = root;
  for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
    var key = path_1[_i];
    if (!current || typeof current !== "object") {
      return undefined;
    }
    current = current[key];
  }
  return current;
}
function ensureNestedObject(root, path) {
  var current = root;
  for (var _i = 0, path_2 = path; _i < path_2.length; _i++) {
    var key = path_2[_i];
    var existing = current[key];
    if (!existing || typeof existing !== "object") {
      current[key] = {};
    }
    current = current[key];
  }
  return current;
}
function setNestedValue(root, path, value) {
  if (path.length === 0) {
    return;
  }
  if (path.length === 1) {
    root[path[0]] = value;
    return;
  }
  var parent = ensureNestedObject(root, path.slice(0, -1));
  parent[path[path.length - 1]] = value;
}
function deleteNestedValue(root, path) {
  if (path.length === 0) {
    return;
  }
  if (path.length === 1) {
    delete root[path[0]];
    return;
  }
  var parent = getNestedValue(root, path.slice(0, -1));
  if (!parent || typeof parent !== "object") {
    return;
  }
  delete parent[path[path.length - 1]];
}
function resolveChannelAllowFromPaths(channelId, scope) {
  if (scope === "all") {
    return null;
  }
  if (scope === "dm") {
    if (channelId === "slack" || channelId === "discord") {
      return ["dm", "allowFrom"];
    }
    if (
      channelId === "telegram" ||
      channelId === "whatsapp" ||
      channelId === "signal" ||
      channelId === "imessage"
    ) {
      return ["allowFrom"];
    }
    return null;
  }
  if (scope === "group") {
    if (
      channelId === "telegram" ||
      channelId === "whatsapp" ||
      channelId === "signal" ||
      channelId === "imessage"
    ) {
      return ["groupAllowFrom"];
    }
    return null;
  }
  return null;
}
function resolveSlackNames(params) {
  return __awaiter(this, void 0, void 0, function () {
    var account, token, resolved, map, _i, resolved_1, entry;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          account = (0, accounts_js_4.resolveSlackAccount)({
            cfg: params.cfg,
            accountId: params.accountId,
          });
          token =
            ((_a = account.config.userToken) === null || _a === void 0 ? void 0 : _a.trim()) ||
            ((_b = account.botToken) === null || _b === void 0 ? void 0 : _b.trim());
          if (!token) {
            return [2 /*return*/, new Map()];
          }
          return [
            4 /*yield*/,
            (0, resolve_users_js_1.resolveSlackUserAllowlist)({
              token: token,
              entries: params.entries,
            }),
          ];
        case 1:
          resolved = _c.sent();
          map = new Map();
          for (_i = 0, resolved_1 = resolved; _i < resolved_1.length; _i++) {
            entry = resolved_1[_i];
            if (entry.resolved && entry.name) {
              map.set(entry.input, entry.name);
            }
          }
          return [2 /*return*/, map];
      }
    });
  });
}
function resolveDiscordNames(params) {
  return __awaiter(this, void 0, void 0, function () {
    var account, token, resolved, map, _i, resolved_2, entry;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          account = (0, accounts_js_1.resolveDiscordAccount)({
            cfg: params.cfg,
            accountId: params.accountId,
          });
          token = (_a = account.token) === null || _a === void 0 ? void 0 : _a.trim();
          if (!token) {
            return [2 /*return*/, new Map()];
          }
          return [
            4 /*yield*/,
            (0, resolve_users_js_2.resolveDiscordUserAllowlist)({
              token: token,
              entries: params.entries,
            }),
          ];
        case 1:
          resolved = _b.sent();
          map = new Map();
          for (_i = 0, resolved_2 = resolved; _i < resolved_2.length; _i++) {
            entry = resolved_2[_i];
            if (entry.resolved && entry.name) {
              map.set(entry.input, entry.name);
            }
          }
          return [2 /*return*/, map];
      }
    });
  });
}
var handleAllowlistCommand = function (params, allowTextCommands) {
  return __awaiter(void 0, void 0, void 0, function () {
    var parsed,
      channelId,
      accountId,
      scope,
      pairingChannels,
      supportsStore,
      storeAllowFrom,
      _a,
      dmAllowFrom,
      groupAllowFrom,
      groupOverrides,
      dmPolicy,
      groupPolicy,
      account,
      groups,
      _i,
      _b,
      _c,
      groupId,
      groupCfg,
      entries,
      topics,
      _d,
      _e,
      _f,
      topicId,
      topicCfg,
      topicEntries,
      account,
      account,
      account,
      account,
      channels,
      account,
      guilds,
      _g,
      _h,
      _j,
      guildKey,
      guildCfg,
      entries,
      channels,
      _k,
      _l,
      _m,
      channelKey,
      channelCfg,
      channelEntries,
      dmDisplay,
      groupDisplay,
      groupOverrideEntries,
      groupOverrideDisplay,
      resolvedDm,
      _o,
      _p,
      resolvedGroup,
      _q,
      _r,
      lines,
      showDm,
      showGroup,
      storeLabel,
      _s,
      groupOverrides_1,
      entry,
      normalized,
      shouldUpdateConfig,
      shouldTouchStore,
      allowWrites,
      hint,
      allowlistPath,
      snapshot,
      parsedConfig,
      _t,
      target,
      pathPrefix,
      normalizedAccountId,
      existingRaw,
      existing,
      normalizedEntry_1,
      existingNormalized,
      shouldMatch_1,
      configChanged,
      next,
      configHasEntry,
      keep,
      _u,
      existing_1,
      entry,
      normalized,
      validated,
      issue,
      message,
      actionLabel_1,
      scopeLabel_1,
      locations,
      targetLabel,
      actionLabel,
      scopeLabel;
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
      _19;
    return __generator(this, function (_20) {
      switch (_20.label) {
        case 0:
          if (!allowTextCommands) {
            return [2 /*return*/, null];
          }
          parsed = parseAllowlistCommand(params.command.commandBodyNormalized);
          if (!parsed) {
            return [2 /*return*/, null];
          }
          if (parsed.action === "error") {
            return [
              2 /*return*/,
              { shouldContinue: false, reply: { text: "\u26A0\uFE0F ".concat(parsed.message) } },
            ];
          }
          if (!params.command.isAuthorizedSender) {
            (0, globals_js_1.logVerbose)(
              "Ignoring /allowlist from unauthorized sender: ".concat(
                params.command.senderId || "<unknown>",
              ),
            );
            return [2 /*return*/, { shouldContinue: false }];
          }
          channelId =
            (_w =
              (_v = (0, registry_js_1.normalizeChannelId)(parsed.channel)) !== null && _v !== void 0
                ? _v
                : params.command.channelId) !== null && _w !== void 0
              ? _w
              : (0, registry_js_1.normalizeChannelId)(params.command.channel);
          if (!channelId) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: { text: "⚠️ Unknown channel. Add channel=<id> to the command." },
              },
            ];
          }
          accountId = (0, session_key_js_1.normalizeAccountId)(
            (_x = parsed.account) !== null && _x !== void 0 ? _x : params.ctx.AccountId,
          );
          scope = parsed.scope;
          if (!(parsed.action === "list")) {
            return [3 /*break*/, 16];
          }
          pairingChannels = (0, pairing_js_1.listPairingChannels)();
          supportsStore = pairingChannels.includes(channelId);
          if (!supportsStore) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, pairing_store_js_1.readChannelAllowFromStore)(channelId).catch(function () {
              return [];
            }),
          ];
        case 1:
          _a = _20.sent();
          return [3 /*break*/, 3];
        case 2:
          _a = [];
          _20.label = 3;
        case 3:
          storeAllowFrom = _a;
          dmAllowFrom = [];
          groupAllowFrom = [];
          groupOverrides = [];
          dmPolicy = void 0;
          groupPolicy = void 0;
          if (channelId === "telegram") {
            account = (0, accounts_js_5.resolveTelegramAccount)({
              cfg: params.cfg,
              accountId: accountId,
            });
            dmAllowFrom = ((_y = account.config.allowFrom) !== null && _y !== void 0 ? _y : []).map(
              String,
            );
            groupAllowFrom = (
              (_z = account.config.groupAllowFrom) !== null && _z !== void 0 ? _z : []
            ).map(String);
            dmPolicy = account.config.dmPolicy;
            groupPolicy = account.config.groupPolicy;
            groups = (_0 = account.config.groups) !== null && _0 !== void 0 ? _0 : {};
            for (_i = 0, _b = Object.entries(groups); _i < _b.length; _i++) {
              ((_c = _b[_i]), (groupId = _c[0]), (groupCfg = _c[1]));
              entries = (
                (_1 = groupCfg === null || groupCfg === void 0 ? void 0 : groupCfg.allowFrom) !==
                  null && _1 !== void 0
                  ? _1
                  : []
              )
                .map(String)
                .filter(Boolean);
              if (entries.length > 0) {
                groupOverrides.push({ label: groupId, entries: entries });
              }
              topics =
                (_2 = groupCfg === null || groupCfg === void 0 ? void 0 : groupCfg.topics) !==
                  null && _2 !== void 0
                  ? _2
                  : {};
              for (_d = 0, _e = Object.entries(topics); _d < _e.length; _d++) {
                ((_f = _e[_d]), (topicId = _f[0]), (topicCfg = _f[1]));
                topicEntries = (
                  (_3 = topicCfg === null || topicCfg === void 0 ? void 0 : topicCfg.allowFrom) !==
                    null && _3 !== void 0
                    ? _3
                    : []
                )
                  .map(String)
                  .filter(Boolean);
                if (topicEntries.length > 0) {
                  groupOverrides.push({
                    label: "".concat(groupId, " topic ").concat(topicId),
                    entries: topicEntries,
                  });
                }
              }
            }
          } else if (channelId === "whatsapp") {
            account = (0, accounts_js_6.resolveWhatsAppAccount)({
              cfg: params.cfg,
              accountId: accountId,
            });
            dmAllowFrom = ((_4 = account.allowFrom) !== null && _4 !== void 0 ? _4 : []).map(
              String,
            );
            groupAllowFrom = (
              (_5 = account.groupAllowFrom) !== null && _5 !== void 0 ? _5 : []
            ).map(String);
            dmPolicy = account.dmPolicy;
            groupPolicy = account.groupPolicy;
          } else if (channelId === "signal") {
            account = (0, accounts_js_3.resolveSignalAccount)({
              cfg: params.cfg,
              accountId: accountId,
            });
            dmAllowFrom = ((_6 = account.config.allowFrom) !== null && _6 !== void 0 ? _6 : []).map(
              String,
            );
            groupAllowFrom = (
              (_7 = account.config.groupAllowFrom) !== null && _7 !== void 0 ? _7 : []
            ).map(String);
            dmPolicy = account.config.dmPolicy;
            groupPolicy = account.config.groupPolicy;
          } else if (channelId === "imessage") {
            account = (0, accounts_js_2.resolveIMessageAccount)({
              cfg: params.cfg,
              accountId: accountId,
            });
            dmAllowFrom = ((_8 = account.config.allowFrom) !== null && _8 !== void 0 ? _8 : []).map(
              String,
            );
            groupAllowFrom = (
              (_9 = account.config.groupAllowFrom) !== null && _9 !== void 0 ? _9 : []
            ).map(String);
            dmPolicy = account.config.dmPolicy;
            groupPolicy = account.config.groupPolicy;
          } else if (channelId === "slack") {
            account = (0, accounts_js_4.resolveSlackAccount)({
              cfg: params.cfg,
              accountId: accountId,
            });
            dmAllowFrom = (
              (_11 = (_10 = account.dm) === null || _10 === void 0 ? void 0 : _10.allowFrom) !==
                null && _11 !== void 0
                ? _11
                : []
            ).map(String);
            groupPolicy = account.groupPolicy;
            channels = (_12 = account.channels) !== null && _12 !== void 0 ? _12 : {};
            groupOverrides = Object.entries(channels)
              .map(function (_a) {
                var _b;
                var key = _a[0],
                  value = _a[1];
                var entries = (
                  (_b = value === null || value === void 0 ? void 0 : value.users) !== null &&
                  _b !== void 0
                    ? _b
                    : []
                )
                  .map(String)
                  .filter(Boolean);
                return entries.length > 0 ? { label: key, entries: entries } : null;
              })
              .filter(Boolean);
          } else if (channelId === "discord") {
            account = (0, accounts_js_1.resolveDiscordAccount)({
              cfg: params.cfg,
              accountId: accountId,
            });
            dmAllowFrom = (
              (_14 =
                (_13 = account.config.dm) === null || _13 === void 0 ? void 0 : _13.allowFrom) !==
                null && _14 !== void 0
                ? _14
                : []
            ).map(String);
            groupPolicy = account.config.groupPolicy;
            guilds = (_15 = account.config.guilds) !== null && _15 !== void 0 ? _15 : {};
            for (_g = 0, _h = Object.entries(guilds); _g < _h.length; _g++) {
              ((_j = _h[_g]), (guildKey = _j[0]), (guildCfg = _j[1]));
              entries = (
                (_16 = guildCfg === null || guildCfg === void 0 ? void 0 : guildCfg.users) !==
                  null && _16 !== void 0
                  ? _16
                  : []
              )
                .map(String)
                .filter(Boolean);
              if (entries.length > 0) {
                groupOverrides.push({ label: "guild ".concat(guildKey), entries: entries });
              }
              channels =
                (_17 = guildCfg === null || guildCfg === void 0 ? void 0 : guildCfg.channels) !==
                  null && _17 !== void 0
                  ? _17
                  : {};
              for (_k = 0, _l = Object.entries(channels); _k < _l.length; _k++) {
                ((_m = _l[_k]), (channelKey = _m[0]), (channelCfg = _m[1]));
                channelEntries = (
                  (_18 =
                    channelCfg === null || channelCfg === void 0 ? void 0 : channelCfg.users) !==
                    null && _18 !== void 0
                    ? _18
                    : []
                )
                  .map(String)
                  .filter(Boolean);
                if (channelEntries.length > 0) {
                  groupOverrides.push({
                    label: "guild ".concat(guildKey, " / channel ").concat(channelKey),
                    entries: channelEntries,
                  });
                }
              }
            }
          }
          dmDisplay = normalizeAllowFrom({
            cfg: params.cfg,
            channelId: channelId,
            accountId: accountId,
            values: dmAllowFrom,
          });
          groupDisplay = normalizeAllowFrom({
            cfg: params.cfg,
            channelId: channelId,
            accountId: accountId,
            values: groupAllowFrom,
          });
          groupOverrideEntries = groupOverrides.flatMap(function (entry) {
            return entry.entries;
          });
          groupOverrideDisplay = normalizeAllowFrom({
            cfg: params.cfg,
            channelId: channelId,
            accountId: accountId,
            values: groupOverrideEntries,
          });
          if (!(parsed.resolve && dmDisplay.length > 0 && channelId === "slack")) {
            return [3 /*break*/, 5];
          }
          return [
            4 /*yield*/,
            resolveSlackNames({ cfg: params.cfg, accountId: accountId, entries: dmDisplay }),
          ];
        case 4:
          _o = _20.sent();
          return [3 /*break*/, 9];
        case 5:
          if (!(parsed.resolve && dmDisplay.length > 0 && channelId === "discord")) {
            return [3 /*break*/, 7];
          }
          return [
            4 /*yield*/,
            resolveDiscordNames({ cfg: params.cfg, accountId: accountId, entries: dmDisplay }),
          ];
        case 6:
          _p = _20.sent();
          return [3 /*break*/, 8];
        case 7:
          _p = undefined;
          _20.label = 8;
        case 8:
          _o = _p;
          _20.label = 9;
        case 9:
          resolvedDm = _o;
          if (!(parsed.resolve && groupOverrideDisplay.length > 0 && channelId === "slack")) {
            return [3 /*break*/, 11];
          }
          return [
            4 /*yield*/,
            resolveSlackNames({
              cfg: params.cfg,
              accountId: accountId,
              entries: groupOverrideDisplay,
            }),
          ];
        case 10:
          _q = _20.sent();
          return [3 /*break*/, 15];
        case 11:
          if (!(parsed.resolve && groupOverrideDisplay.length > 0 && channelId === "discord")) {
            return [3 /*break*/, 13];
          }
          return [
            4 /*yield*/,
            resolveDiscordNames({
              cfg: params.cfg,
              accountId: accountId,
              entries: groupOverrideDisplay,
            }),
          ];
        case 12:
          _r = _20.sent();
          return [3 /*break*/, 14];
        case 13:
          _r = undefined;
          _20.label = 14;
        case 14:
          _q = _r;
          _20.label = 15;
        case 15:
          resolvedGroup = _q;
          lines = ["🧾 Allowlist"];
          lines.push(
            "Channel: "
              .concat(channelId)
              .concat(accountId ? " (account ".concat(accountId, ")") : ""),
          );
          if (dmPolicy) {
            lines.push("DM policy: ".concat(dmPolicy));
          }
          if (groupPolicy) {
            lines.push("Group policy: ".concat(groupPolicy));
          }
          showDm = scope === "dm" || scope === "all";
          showGroup = scope === "group" || scope === "all";
          if (showDm) {
            lines.push("DM allowFrom (config): ".concat(formatEntryList(dmDisplay, resolvedDm)));
          }
          if (supportsStore && storeAllowFrom.length > 0) {
            storeLabel = normalizeAllowFrom({
              cfg: params.cfg,
              channelId: channelId,
              accountId: accountId,
              values: storeAllowFrom,
            });
            lines.push("Paired allowFrom (store): ".concat(formatEntryList(storeLabel)));
          }
          if (showGroup) {
            if (groupAllowFrom.length > 0) {
              lines.push("Group allowFrom (config): ".concat(formatEntryList(groupDisplay)));
            }
            if (groupOverrides.length > 0) {
              lines.push("Group overrides:");
              for (_s = 0, groupOverrides_1 = groupOverrides; _s < groupOverrides_1.length; _s++) {
                entry = groupOverrides_1[_s];
                normalized = normalizeAllowFrom({
                  cfg: params.cfg,
                  channelId: channelId,
                  accountId: accountId,
                  values: entry.entries,
                });
                lines.push(
                  "- ".concat(entry.label, ": ").concat(formatEntryList(normalized, resolvedGroup)),
                );
              }
            }
          }
          return [2 /*return*/, { shouldContinue: false, reply: { text: lines.join("\n") } }];
        case 16:
          if (
            ((_19 = params.cfg.commands) === null || _19 === void 0 ? void 0 : _19.config) !== true
          ) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text: "⚠️ /allowlist edits are disabled. Set commands.config=true to enable.",
                },
              },
            ];
          }
          shouldUpdateConfig = parsed.target !== "store";
          shouldTouchStore =
            parsed.target !== "config" &&
            (0, pairing_js_1.listPairingChannels)().includes(channelId);
          if (!shouldUpdateConfig) {
            return [3 /*break*/, 24];
          }
          allowWrites = (0, config_writes_js_1.resolveChannelConfigWrites)({
            cfg: params.cfg,
            channelId: channelId,
            accountId: params.ctx.AccountId,
          });
          if (!allowWrites) {
            hint = "channels.".concat(channelId, ".configWrites=true");
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text: "\u26A0\uFE0F Config writes are disabled for "
                    .concat(channelId, ". Set ")
                    .concat(hint, " to enable."),
                },
              },
            ];
          }
          allowlistPath = resolveChannelAllowFromPaths(channelId, scope);
          if (!allowlistPath) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text: "\u26A0\uFE0F "
                    .concat(channelId, " does not support ")
                    .concat(scope, " allowlist edits via /allowlist."),
                },
              },
            ];
          }
          return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
        case 17:
          snapshot = _20.sent();
          if (!snapshot.valid || !snapshot.parsed || typeof snapshot.parsed !== "object") {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: { text: "⚠️ Config file is invalid; fix it before using /allowlist." },
              },
            ];
          }
          parsedConfig = structuredClone(snapshot.parsed);
          ((_t = resolveAccountTarget(parsedConfig, channelId, accountId)),
            (target = _t.target),
            (pathPrefix = _t.pathPrefix),
            (normalizedAccountId = _t.accountId));
          existingRaw = getNestedValue(target, allowlistPath);
          existing = Array.isArray(existingRaw)
            ? existingRaw
                .map(function (entry) {
                  return String(entry).trim();
                })
                .filter(Boolean)
            : [];
          normalizedEntry_1 = normalizeAllowFrom({
            cfg: params.cfg,
            channelId: channelId,
            accountId: normalizedAccountId,
            values: [parsed.entry],
          });
          if (normalizedEntry_1.length === 0) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: { text: "⚠️ Invalid allowlist entry." },
              },
            ];
          }
          existingNormalized = normalizeAllowFrom({
            cfg: params.cfg,
            channelId: channelId,
            accountId: normalizedAccountId,
            values: existing,
          });
          shouldMatch_1 = function (value) {
            return normalizedEntry_1.includes(value);
          };
          configChanged = false;
          next = existing;
          configHasEntry = existingNormalized.some(function (value) {
            return shouldMatch_1(value);
          });
          if (parsed.action === "add") {
            if (!configHasEntry) {
              next = __spreadArray(__spreadArray([], existing, true), [parsed.entry.trim()], false);
              configChanged = true;
            }
          }
          if (parsed.action === "remove") {
            keep = [];
            for (_u = 0, existing_1 = existing; _u < existing_1.length; _u++) {
              entry = existing_1[_u];
              normalized = normalizeAllowFrom({
                cfg: params.cfg,
                channelId: channelId,
                accountId: normalizedAccountId,
                values: [entry],
              });
              if (
                normalized.some(function (value) {
                  return shouldMatch_1(value);
                })
              ) {
                configChanged = true;
                continue;
              }
              keep.push(entry);
            }
            next = keep;
          }
          if (configChanged) {
            if (next.length === 0) {
              deleteNestedValue(target, allowlistPath);
            } else {
              setNestedValue(target, allowlistPath, next);
            }
          }
          if (!configChanged) {
            return [3 /*break*/, 19];
          }
          validated = (0, config_js_1.validateConfigObjectWithPlugins)(parsedConfig);
          if (!validated.ok) {
            issue = validated.issues[0];
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text: "\u26A0\uFE0F Config invalid after update ("
                    .concat(issue.path, ": ")
                    .concat(issue.message, ")."),
                },
              },
            ];
          }
          return [4 /*yield*/, (0, config_js_1.writeConfigFile)(validated.config)];
        case 18:
          _20.sent();
          _20.label = 19;
        case 19:
          if (!configChanged && !shouldTouchStore) {
            message = parsed.action === "add" ? "✅ Already allowlisted." : "⚠️ Entry not found.";
            return [2 /*return*/, { shouldContinue: false, reply: { text: message } }];
          }
          if (!shouldTouchStore) {
            return [3 /*break*/, 23];
          }
          if (!(parsed.action === "add")) {
            return [3 /*break*/, 21];
          }
          return [
            4 /*yield*/,
            (0, pairing_store_js_1.addChannelAllowFromStoreEntry)({
              channel: channelId,
              entry: parsed.entry,
            }),
          ];
        case 20:
          _20.sent();
          return [3 /*break*/, 23];
        case 21:
          if (!(parsed.action === "remove")) {
            return [3 /*break*/, 23];
          }
          return [
            4 /*yield*/,
            (0, pairing_store_js_1.removeChannelAllowFromStoreEntry)({
              channel: channelId,
              entry: parsed.entry,
            }),
          ];
        case 22:
          _20.sent();
          _20.label = 23;
        case 23:
          actionLabel_1 = parsed.action === "add" ? "added" : "removed";
          scopeLabel_1 = scope === "dm" ? "DM" : "group";
          locations = [];
          if (configChanged) {
            locations.push("".concat(pathPrefix, ".").concat(allowlistPath.join(".")));
          }
          if (shouldTouchStore) {
            locations.push("pairing store");
          }
          targetLabel = locations.length > 0 ? locations.join(" + ") : "no-op";
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: {
                text: "\u2705 "
                  .concat(scopeLabel_1, " allowlist ")
                  .concat(actionLabel_1, ": ")
                  .concat(targetLabel, "."),
              },
            },
          ];
        case 24:
          if (!shouldTouchStore) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: { text: "⚠️ This channel does not support allowlist storage." },
              },
            ];
          }
          if (!(parsed.action === "add")) {
            return [3 /*break*/, 26];
          }
          return [
            4 /*yield*/,
            (0, pairing_store_js_1.addChannelAllowFromStoreEntry)({
              channel: channelId,
              entry: parsed.entry,
            }),
          ];
        case 25:
          _20.sent();
          return [3 /*break*/, 28];
        case 26:
          if (!(parsed.action === "remove")) {
            return [3 /*break*/, 28];
          }
          return [
            4 /*yield*/,
            (0, pairing_store_js_1.removeChannelAllowFromStoreEntry)({
              channel: channelId,
              entry: parsed.entry,
            }),
          ];
        case 27:
          _20.sent();
          _20.label = 28;
        case 28:
          actionLabel = parsed.action === "add" ? "added" : "removed";
          scopeLabel = scope === "dm" ? "DM" : "group";
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: {
                text: "\u2705 "
                  .concat(scopeLabel, " allowlist ")
                  .concat(actionLabel, " in pairing store."),
              },
            },
          ];
      }
    });
  });
};
exports.handleAllowlistCommand = handleAllowlistCommand;
