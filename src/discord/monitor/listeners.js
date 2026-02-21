"use strict";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) {
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
          }
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== "function" && b !== null) {
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      }
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
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
exports.DiscordPresenceListener =
  exports.DiscordReactionRemoveListener =
  exports.DiscordReactionListener =
  exports.DiscordMessageListener =
    void 0;
exports.registerDiscordListener = registerDiscordListener;
var carbon_1 = require("@buape/carbon");
var globals_js_1 = require("../../globals.js");
var format_duration_js_1 = require("../../infra/format-duration.js");
var system_events_js_1 = require("../../infra/system-events.js");
var presence_cache_js_1 = require("./presence-cache.js");
var subsystem_js_1 = require("../../logging/subsystem.js");
var resolve_route_js_1 = require("../../routing/resolve-route.js");
var allow_list_js_1 = require("./allow-list.js");
var format_js_1 = require("./format.js");
var message_utils_js_1 = require("./message-utils.js");
var DISCORD_SLOW_LISTENER_THRESHOLD_MS = 30000;
var discordEventQueueLog = (0, subsystem_js_1.createSubsystemLogger)("discord/event-queue");
function logSlowDiscordListener(params) {
  var _a;
  if (params.durationMs < DISCORD_SLOW_LISTENER_THRESHOLD_MS) {
    return;
  }
  var duration = (0, format_duration_js_1.formatDurationSeconds)(params.durationMs, {
    decimals: 1,
    unit: "seconds",
  });
  var message = "Slow listener detected: "
    .concat(params.listener, " took ")
    .concat(duration, " for event ")
    .concat(params.event);
  var logger = (_a = params.logger) !== null && _a !== void 0 ? _a : discordEventQueueLog;
  logger.warn("Slow listener detected", {
    listener: params.listener,
    event: params.event,
    durationMs: params.durationMs,
    duration: duration,
    consoleMessage: message,
  });
}
function registerDiscordListener(listeners, listener) {
  if (
    listeners.some(function (existing) {
      return existing.constructor === listener.constructor;
    })
  ) {
    return false;
  }
  listeners.push(listener);
  return true;
}
var DiscordMessageListener = /** @class */ (function (_super) {
  __extends(DiscordMessageListener, _super);
  function DiscordMessageListener(handler, logger) {
    var _this = _super.call(this) || this;
    _this.handler = handler;
    _this.logger = logger;
    return _this;
  }
  DiscordMessageListener.prototype.handle = function (data, client) {
    return __awaiter(this, void 0, void 0, function () {
      var startedAt, task;
      var _this = this;
      return __generator(this, function (_a) {
        startedAt = Date.now();
        task = Promise.resolve(this.handler(data, client));
        void task
          .catch(function (err) {
            var _a;
            var logger = (_a = _this.logger) !== null && _a !== void 0 ? _a : discordEventQueueLog;
            logger.error((0, globals_js_1.danger)("discord handler failed: ".concat(String(err))));
          })
          .finally(function () {
            logSlowDiscordListener({
              logger: _this.logger,
              listener: _this.constructor.name,
              event: _this.type,
              durationMs: Date.now() - startedAt,
            });
          });
        return [2 /*return*/];
      });
    });
  };
  return DiscordMessageListener;
})(carbon_1.MessageCreateListener);
exports.DiscordMessageListener = DiscordMessageListener;
var DiscordReactionListener = /** @class */ (function (_super) {
  __extends(DiscordReactionListener, _super);
  function DiscordReactionListener(params) {
    var _this = _super.call(this) || this;
    _this.params = params;
    return _this;
  }
  DiscordReactionListener.prototype.handle = function (data, client) {
    return __awaiter(this, void 0, void 0, function () {
      var startedAt;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            startedAt = Date.now();
            _a.label = 1;
          case 1:
            _a.trys.push([1, , 3, 4]);
            return [
              4 /*yield*/,
              handleDiscordReactionEvent({
                data: data,
                client: client,
                action: "added",
                cfg: this.params.cfg,
                accountId: this.params.accountId,
                botUserId: this.params.botUserId,
                guildEntries: this.params.guildEntries,
                logger: this.params.logger,
              }),
            ];
          case 2:
            _a.sent();
            return [3 /*break*/, 4];
          case 3:
            logSlowDiscordListener({
              logger: this.params.logger,
              listener: this.constructor.name,
              event: this.type,
              durationMs: Date.now() - startedAt,
            });
            return [7 /*endfinally*/];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  return DiscordReactionListener;
})(carbon_1.MessageReactionAddListener);
exports.DiscordReactionListener = DiscordReactionListener;
var DiscordReactionRemoveListener = /** @class */ (function (_super) {
  __extends(DiscordReactionRemoveListener, _super);
  function DiscordReactionRemoveListener(params) {
    var _this = _super.call(this) || this;
    _this.params = params;
    return _this;
  }
  DiscordReactionRemoveListener.prototype.handle = function (data, client) {
    return __awaiter(this, void 0, void 0, function () {
      var startedAt;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            startedAt = Date.now();
            _a.label = 1;
          case 1:
            _a.trys.push([1, , 3, 4]);
            return [
              4 /*yield*/,
              handleDiscordReactionEvent({
                data: data,
                client: client,
                action: "removed",
                cfg: this.params.cfg,
                accountId: this.params.accountId,
                botUserId: this.params.botUserId,
                guildEntries: this.params.guildEntries,
                logger: this.params.logger,
              }),
            ];
          case 2:
            _a.sent();
            return [3 /*break*/, 4];
          case 3:
            logSlowDiscordListener({
              logger: this.params.logger,
              listener: this.constructor.name,
              event: this.type,
              durationMs: Date.now() - startedAt,
            });
            return [7 /*endfinally*/];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  return DiscordReactionRemoveListener;
})(carbon_1.MessageReactionRemoveListener);
exports.DiscordReactionRemoveListener = DiscordReactionRemoveListener;
function handleDiscordReactionEvent(params) {
  return __awaiter(this, void 0, void 0, function () {
    var data,
      client,
      action,
      botUserId,
      guildEntries,
      user,
      guildInfo,
      channel,
      channelName,
      channelSlug,
      channelType,
      isThreadChannel,
      parentId,
      parentName,
      parentSlug,
      channelInfo,
      parentInfo,
      channelConfig,
      reactionMode,
      message,
      messageAuthorId,
      shouldNotify,
      emojiLabel,
      actorLabel,
      guildSlug,
      channelLabel,
      authorLabel,
      baseText,
      text,
      route,
      err_1;
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
      switch (_j.label) {
        case 0:
          _j.trys.push([0, 7, , 8]);
          ((data = params.data),
            (client = params.client),
            (action = params.action),
            (botUserId = params.botUserId),
            (guildEntries = params.guildEntries));
          if (!("user" in data)) {
            return [2 /*return*/];
          }
          user = data.user;
          if (!user || user.bot) {
            return [2 /*return*/];
          }
          if (!data.guild_id) {
            return [2 /*return*/];
          }
          guildInfo = (0, allow_list_js_1.resolveDiscordGuildEntry)({
            guild: (_a = data.guild) !== null && _a !== void 0 ? _a : undefined,
            guildEntries: guildEntries,
          });
          if (guildEntries && Object.keys(guildEntries).length > 0 && !guildInfo) {
            return [2 /*return*/];
          }
          return [4 /*yield*/, client.fetchChannel(data.channel_id)];
        case 1:
          channel = _j.sent();
          if (!channel) {
            return [2 /*return*/];
          }
          channelName =
            "name" in channel
              ? (_b = channel.name) !== null && _b !== void 0
                ? _b
                : undefined
              : undefined;
          channelSlug = channelName ? (0, allow_list_js_1.normalizeDiscordSlug)(channelName) : "";
          channelType = "type" in channel ? channel.type : undefined;
          isThreadChannel =
            channelType === carbon_1.ChannelType.PublicThread ||
            channelType === carbon_1.ChannelType.PrivateThread ||
            channelType === carbon_1.ChannelType.AnnouncementThread;
          parentId =
            "parentId" in channel
              ? (_c = channel.parentId) !== null && _c !== void 0
                ? _c
                : undefined
              : undefined;
          parentName = void 0;
          parentSlug = "";
          if (!isThreadChannel) {
            return [3 /*break*/, 5];
          }
          if (!!parentId) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            (0, message_utils_js_1.resolveDiscordChannelInfo)(client, data.channel_id),
          ];
        case 2:
          channelInfo = _j.sent();
          parentId = channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.parentId;
          _j.label = 3;
        case 3:
          if (!parentId) {
            return [3 /*break*/, 5];
          }
          return [4 /*yield*/, (0, message_utils_js_1.resolveDiscordChannelInfo)(client, parentId)];
        case 4:
          parentInfo = _j.sent();
          parentName = parentInfo === null || parentInfo === void 0 ? void 0 : parentInfo.name;
          parentSlug = parentName ? (0, allow_list_js_1.normalizeDiscordSlug)(parentName) : "";
          _j.label = 5;
        case 5:
          channelConfig = (0, allow_list_js_1.resolveDiscordChannelConfigWithFallback)({
            guildInfo: guildInfo,
            channelId: data.channel_id,
            channelName: channelName,
            channelSlug: channelSlug,
            parentId: parentId,
            parentName: parentName,
            parentSlug: parentSlug,
            scope: isThreadChannel ? "thread" : "channel",
          });
          if (
            (channelConfig === null || channelConfig === void 0
              ? void 0
              : channelConfig.allowed) === false
          ) {
            return [2 /*return*/];
          }
          if (botUserId && user.id === botUserId) {
            return [2 /*return*/];
          }
          reactionMode =
            (_d =
              guildInfo === null || guildInfo === void 0
                ? void 0
                : guildInfo.reactionNotifications) !== null && _d !== void 0
              ? _d
              : "own";
          return [
            4 /*yield*/,
            data.message.fetch().catch(function () {
              return null;
            }),
          ];
        case 6:
          message = _j.sent();
          messageAuthorId =
            (_f =
              (_e = message === null || message === void 0 ? void 0 : message.author) === null ||
              _e === void 0
                ? void 0
                : _e.id) !== null && _f !== void 0
              ? _f
              : undefined;
          shouldNotify = (0, allow_list_js_1.shouldEmitDiscordReactionNotification)({
            mode: reactionMode,
            botId: botUserId,
            messageAuthorId: messageAuthorId,
            userId: user.id,
            userName: user.username,
            userTag: (0, format_js_1.formatDiscordUserTag)(user),
            allowlist: guildInfo === null || guildInfo === void 0 ? void 0 : guildInfo.users,
          });
          if (!shouldNotify) {
            return [2 /*return*/];
          }
          emojiLabel = (0, format_js_1.formatDiscordReactionEmoji)(data.emoji);
          actorLabel = (0, format_js_1.formatDiscordUserTag)(user);
          guildSlug =
            (guildInfo === null || guildInfo === void 0 ? void 0 : guildInfo.slug) ||
            (((_g = data.guild) === null || _g === void 0 ? void 0 : _g.name)
              ? (0, allow_list_js_1.normalizeDiscordSlug)(data.guild.name)
              : data.guild_id);
          channelLabel = channelSlug
            ? "#".concat(channelSlug)
            : channelName
              ? "#".concat((0, allow_list_js_1.normalizeDiscordSlug)(channelName))
              : "#".concat(data.channel_id);
          authorLabel = (message === null || message === void 0 ? void 0 : message.author)
            ? (0, format_js_1.formatDiscordUserTag)(message.author)
            : undefined;
          baseText = "Discord reaction "
            .concat(action, ": ")
            .concat(emojiLabel, " by ")
            .concat(actorLabel, " on ")
            .concat(guildSlug, " ")
            .concat(channelLabel, " msg ")
            .concat(data.message_id);
          text = authorLabel ? "".concat(baseText, " from ").concat(authorLabel) : baseText;
          route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: params.cfg,
            channel: "discord",
            accountId: params.accountId,
            guildId: (_h = data.guild_id) !== null && _h !== void 0 ? _h : undefined,
            peer: { kind: "channel", id: data.channel_id },
          });
          (0, system_events_js_1.enqueueSystemEvent)(text, {
            sessionKey: route.sessionKey,
            contextKey: "discord:reaction:"
              .concat(action, ":")
              .concat(data.message_id, ":")
              .concat(user.id, ":")
              .concat(emojiLabel),
          });
          return [3 /*break*/, 8];
        case 7:
          err_1 = _j.sent();
          params.logger.error(
            (0, globals_js_1.danger)("discord reaction handler failed: ".concat(String(err_1))),
          );
          return [3 /*break*/, 8];
        case 8:
          return [2 /*return*/];
      }
    });
  });
}
var DiscordPresenceListener = /** @class */ (function (_super) {
  __extends(DiscordPresenceListener, _super);
  function DiscordPresenceListener(params) {
    var _this = _super.call(this) || this;
    _this.logger = params.logger;
    _this.accountId = params.accountId;
    return _this;
  }
  DiscordPresenceListener.prototype.handle = function (data) {
    return __awaiter(this, void 0, void 0, function () {
      var userId, logger;
      var _a;
      return __generator(this, function (_b) {
        try {
          userId =
            "user" in data && data.user && typeof data.user === "object" && "id" in data.user
              ? String(data.user.id)
              : undefined;
          if (!userId) {
            return [2 /*return*/];
          }
          (0, presence_cache_js_1.setPresence)(this.accountId, userId, data);
        } catch (err) {
          logger = (_a = this.logger) !== null && _a !== void 0 ? _a : discordEventQueueLog;
          logger.error(
            (0, globals_js_1.danger)("discord presence handler failed: ".concat(String(err))),
          );
        }
        return [2 /*return*/];
      });
    });
  };
  return DiscordPresenceListener;
})(carbon_1.PresenceUpdateListener);
exports.DiscordPresenceListener = DiscordPresenceListener;
