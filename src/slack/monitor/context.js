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
exports.inferSlackChannelType = inferSlackChannelType;
exports.normalizeSlackChannelType = normalizeSlackChannelType;
exports.createSlackMonitorContext = createSlackMonitorContext;
var sessions_js_1 = require("../../config/sessions.js");
var globals_js_1 = require("../../globals.js");
var dedupe_js_1 = require("../../infra/dedupe.js");
var logging_js_1 = require("../../logging.js");
var allowlist_match_js_1 = require("../../channels/allowlist-match.js");
var allow_list_js_1 = require("./allow-list.js");
var channel_config_js_1 = require("./channel-config.js");
var policy_js_1 = require("./policy.js");
function inferSlackChannelType(channelId) {
  var trimmed = channelId === null || channelId === void 0 ? void 0 : channelId.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.startsWith("D")) {
    return "im";
  }
  if (trimmed.startsWith("C")) {
    return "channel";
  }
  if (trimmed.startsWith("G")) {
    return "group";
  }
  return undefined;
}
function normalizeSlackChannelType(channelType, channelId) {
  var _a;
  var normalized =
    channelType === null || channelType === void 0 ? void 0 : channelType.trim().toLowerCase();
  if (
    normalized === "im" ||
    normalized === "mpim" ||
    normalized === "channel" ||
    normalized === "group"
  ) {
    return normalized;
  }
  return (_a = inferSlackChannelType(channelId)) !== null && _a !== void 0 ? _a : "channel";
}
function createSlackMonitorContext(params) {
  var _this = this;
  var _a;
  var channelHistories = new Map();
  var logger = (0, logging_js_1.getChildLogger)({ module: "slack-auto-reply" });
  var channelCache = new Map();
  var userCache = new Map();
  var seenMessages = (0, dedupe_js_1.createDedupeCache)({ ttlMs: 60000, maxSize: 500 });
  var allowFrom = (0, allow_list_js_1.normalizeAllowList)(params.allowFrom);
  var groupDmChannels = (0, allow_list_js_1.normalizeAllowList)(params.groupDmChannels);
  var defaultRequireMention =
    (_a = params.defaultRequireMention) !== null && _a !== void 0 ? _a : true;
  var markMessageSeen = function (channelId, ts) {
    if (!channelId || !ts) {
      return false;
    }
    return seenMessages.check("".concat(channelId, ":").concat(ts));
  };
  var resolveSlackSystemEventSessionKey = function (p) {
    var _a, _b;
    var channelId =
      (_b = (_a = p.channelId) === null || _a === void 0 ? void 0 : _a.trim()) !== null &&
      _b !== void 0
        ? _b
        : "";
    if (!channelId) {
      return params.mainKey;
    }
    var channelType = normalizeSlackChannelType(p.channelType, channelId);
    var isDirectMessage = channelType === "im";
    var isGroup = channelType === "mpim";
    var from = isDirectMessage
      ? "slack:".concat(channelId)
      : isGroup
        ? "slack:group:".concat(channelId)
        : "slack:channel:".concat(channelId);
    var chatType = isDirectMessage ? "direct" : isGroup ? "group" : "channel";
    return (0, sessions_js_1.resolveSessionKey)(
      params.sessionScope,
      { From: from, ChatType: chatType, Provider: "slack" },
      params.mainKey,
    );
  };
  var resolveChannelName = function (channelId) {
    return __awaiter(_this, void 0, void 0, function () {
      var cached, info, name_1, channel, type, topic, purpose, entry, _a;
      var _b, _c, _d, _e, _f;
      return __generator(this, function (_g) {
        switch (_g.label) {
          case 0:
            cached = channelCache.get(channelId);
            if (cached) {
              return [2 /*return*/, cached];
            }
            _g.label = 1;
          case 1:
            _g.trys.push([1, 3, , 4]);
            return [
              4 /*yield*/,
              params.app.client.conversations.info({
                token: params.botToken,
                channel: channelId,
              }),
            ];
          case 2:
            info = _g.sent();
            name_1 = info.channel && "name" in info.channel ? info.channel.name : undefined;
            channel = (_b = info.channel) !== null && _b !== void 0 ? _b : undefined;
            type = (channel === null || channel === void 0 ? void 0 : channel.is_im)
              ? "im"
              : (channel === null || channel === void 0 ? void 0 : channel.is_mpim)
                ? "mpim"
                : (channel === null || channel === void 0 ? void 0 : channel.is_channel)
                  ? "channel"
                  : (channel === null || channel === void 0 ? void 0 : channel.is_group)
                    ? "group"
                    : undefined;
            topic =
              channel && "topic" in channel
                ? (_d = (_c = channel.topic) === null || _c === void 0 ? void 0 : _c.value) !==
                    null && _d !== void 0
                  ? _d
                  : undefined
                : undefined;
            purpose =
              channel && "purpose" in channel
                ? (_f = (_e = channel.purpose) === null || _e === void 0 ? void 0 : _e.value) !==
                    null && _f !== void 0
                  ? _f
                  : undefined
                : undefined;
            entry = { name: name_1, type: type, topic: topic, purpose: purpose };
            channelCache.set(channelId, entry);
            return [2 /*return*/, entry];
          case 3:
            _a = _g.sent();
            return [2 /*return*/, {}];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  var resolveUserName = function (userId) {
    return __awaiter(_this, void 0, void 0, function () {
      var cached, info, profile, name_2, entry, _a;
      var _b, _c;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            cached = userCache.get(userId);
            if (cached) {
              return [2 /*return*/, cached];
            }
            _d.label = 1;
          case 1:
            _d.trys.push([1, 3, , 4]);
            return [
              4 /*yield*/,
              params.app.client.users.info({
                token: params.botToken,
                user: userId,
              }),
            ];
          case 2:
            info = _d.sent();
            profile = (_b = info.user) === null || _b === void 0 ? void 0 : _b.profile;
            name_2 =
              (profile === null || profile === void 0 ? void 0 : profile.display_name) ||
              (profile === null || profile === void 0 ? void 0 : profile.real_name) ||
              ((_c = info.user) === null || _c === void 0 ? void 0 : _c.name) ||
              undefined;
            entry = { name: name_2 };
            userCache.set(userId, entry);
            return [2 /*return*/, entry];
          case 3:
            _a = _d.sent();
            return [2 /*return*/, {}];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  var setSlackThreadStatus = function (p) {
    return __awaiter(_this, void 0, void 0, function () {
      var payload, client, err_1;
      var _a, _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            if (!p.threadTs) {
              return [2 /*return*/];
            }
            payload = {
              token: params.botToken,
              channel_id: p.channelId,
              thread_ts: p.threadTs,
              status: p.status,
            };
            client = params.app.client;
            _c.label = 1;
          case 1:
            _c.trys.push([1, 6, , 7]);
            if (
              !((_b = (_a = client.assistant) === null || _a === void 0 ? void 0 : _a.threads) ===
                null || _b === void 0
                ? void 0
                : _b.setStatus)
            ) {
              return [3 /*break*/, 3];
            }
            return [4 /*yield*/, client.assistant.threads.setStatus(payload)];
          case 2:
            _c.sent();
            return [2 /*return*/];
          case 3:
            if (!(typeof client.apiCall === "function")) {
              return [3 /*break*/, 5];
            }
            return [4 /*yield*/, client.apiCall("assistant.threads.setStatus", payload)];
          case 4:
            _c.sent();
            _c.label = 5;
          case 5:
            return [3 /*break*/, 7];
          case 6:
            err_1 = _c.sent();
            (0, globals_js_1.logVerbose)(
              "slack status update failed for channel "
                .concat(p.channelId, ": ")
                .concat(String(err_1)),
            );
            return [3 /*break*/, 7];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  var isChannelAllowed = function (p) {
    var _a;
    var channelType = normalizeSlackChannelType(p.channelType, p.channelId);
    var isDirectMessage = channelType === "im";
    var isGroupDm = channelType === "mpim";
    var isRoom = channelType === "channel" || channelType === "group";
    if (isDirectMessage && !params.dmEnabled) {
      return false;
    }
    if (isGroupDm && !params.groupDmEnabled) {
      return false;
    }
    if (isGroupDm && groupDmChannels.length > 0) {
      var allowList_1 = (0, allow_list_js_1.normalizeAllowListLower)(groupDmChannels);
      var candidates = [
        p.channelId,
        p.channelName ? "#".concat(p.channelName) : undefined,
        p.channelName,
        p.channelName ? (0, allow_list_js_1.normalizeSlackSlug)(p.channelName) : undefined,
      ]
        .filter(function (value) {
          return Boolean(value);
        })
        .map(function (value) {
          return value.toLowerCase();
        });
      var permitted =
        allowList_1.includes("*") ||
        candidates.some(function (candidate) {
          return allowList_1.includes(candidate);
        });
      if (!permitted) {
        return false;
      }
    }
    if (isRoom && p.channelId) {
      var channelConfig = (0, channel_config_js_1.resolveSlackChannelConfig)({
        channelId: p.channelId,
        channelName: p.channelName,
        channels: params.channelsConfig,
        defaultRequireMention: defaultRequireMention,
      });
      var channelMatchMeta = (0, allowlist_match_js_1.formatAllowlistMatchMeta)(channelConfig);
      var channelAllowed =
        (channelConfig === null || channelConfig === void 0 ? void 0 : channelConfig.allowed) !==
        false;
      var channelAllowlistConfigured =
        Boolean(params.channelsConfig) &&
        Object.keys((_a = params.channelsConfig) !== null && _a !== void 0 ? _a : {}).length > 0;
      if (
        !(0, policy_js_1.isSlackChannelAllowedByPolicy)({
          groupPolicy: params.groupPolicy,
          channelAllowlistConfigured: channelAllowlistConfigured,
          channelAllowed: channelAllowed,
        })
      ) {
        (0, globals_js_1.logVerbose)(
          "slack: drop channel "
            .concat(p.channelId, " (groupPolicy=")
            .concat(params.groupPolicy, ", ")
            .concat(channelMatchMeta, ")"),
        );
        return false;
      }
      // When groupPolicy is "open", only block channels that are EXPLICITLY denied
      // (i.e., have a matching config entry with allow:false). Channels not in the
      // config (matchSource undefined) should be allowed under open policy.
      var hasExplicitConfig = Boolean(
        channelConfig === null || channelConfig === void 0 ? void 0 : channelConfig.matchSource,
      );
      if (!channelAllowed && (params.groupPolicy !== "open" || hasExplicitConfig)) {
        (0, globals_js_1.logVerbose)(
          "slack: drop channel ".concat(p.channelId, " (").concat(channelMatchMeta, ")"),
        );
        return false;
      }
      (0, globals_js_1.logVerbose)(
        "slack: allow channel ".concat(p.channelId, " (").concat(channelMatchMeta, ")"),
      );
    }
    return true;
  };
  var shouldDropMismatchedSlackEvent = function (body) {
    if (!body || typeof body !== "object") {
      return false;
    }
    var raw = body;
    var incomingApiAppId = typeof raw.api_app_id === "string" ? raw.api_app_id : "";
    var incomingTeamId = typeof raw.team_id === "string" ? raw.team_id : "";
    if (params.apiAppId && incomingApiAppId && incomingApiAppId !== params.apiAppId) {
      (0, globals_js_1.logVerbose)(
        "slack: drop event with api_app_id="
          .concat(incomingApiAppId, " (expected ")
          .concat(params.apiAppId, ")"),
      );
      return true;
    }
    if (params.teamId && incomingTeamId && incomingTeamId !== params.teamId) {
      (0, globals_js_1.logVerbose)(
        "slack: drop event with team_id="
          .concat(incomingTeamId, " (expected ")
          .concat(params.teamId, ")"),
      );
      return true;
    }
    return false;
  };
  return {
    cfg: params.cfg,
    accountId: params.accountId,
    botToken: params.botToken,
    app: params.app,
    runtime: params.runtime,
    botUserId: params.botUserId,
    teamId: params.teamId,
    apiAppId: params.apiAppId,
    historyLimit: params.historyLimit,
    channelHistories: channelHistories,
    sessionScope: params.sessionScope,
    mainKey: params.mainKey,
    dmEnabled: params.dmEnabled,
    dmPolicy: params.dmPolicy,
    allowFrom: allowFrom,
    groupDmEnabled: params.groupDmEnabled,
    groupDmChannels: groupDmChannels,
    defaultRequireMention: defaultRequireMention,
    channelsConfig: params.channelsConfig,
    groupPolicy: params.groupPolicy,
    useAccessGroups: params.useAccessGroups,
    reactionMode: params.reactionMode,
    reactionAllowlist: params.reactionAllowlist,
    replyToMode: params.replyToMode,
    threadHistoryScope: params.threadHistoryScope,
    threadInheritParent: params.threadInheritParent,
    slashCommand: params.slashCommand,
    textLimit: params.textLimit,
    ackReactionScope: params.ackReactionScope,
    mediaMaxBytes: params.mediaMaxBytes,
    removeAckAfterReply: params.removeAckAfterReply,
    logger: logger,
    markMessageSeen: markMessageSeen,
    shouldDropMismatchedSlackEvent: shouldDropMismatchedSlackEvent,
    resolveSlackSystemEventSessionKey: resolveSlackSystemEventSessionKey,
    isChannelAllowed: isChannelAllowed,
    resolveChannelName: resolveChannelName,
    resolveUserName: resolveUserName,
    setSlackThreadStatus: setSlackThreadStatus,
  };
}
