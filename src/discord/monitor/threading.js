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
exports.__resetDiscordThreadStarterCacheForTest = __resetDiscordThreadStarterCacheForTest;
exports.resolveDiscordThreadChannel = resolveDiscordThreadChannel;
exports.resolveDiscordThreadParentInfo = resolveDiscordThreadParentInfo;
exports.resolveDiscordThreadStarter = resolveDiscordThreadStarter;
exports.resolveDiscordReplyTarget = resolveDiscordReplyTarget;
exports.sanitizeDiscordThreadName = sanitizeDiscordThreadName;
exports.resolveDiscordAutoThreadContext = resolveDiscordAutoThreadContext;
exports.resolveDiscordAutoThreadReplyPlan = resolveDiscordAutoThreadReplyPlan;
exports.maybeCreateDiscordAutoThread = maybeCreateDiscordAutoThread;
exports.resolveDiscordReplyDeliveryPlan = resolveDiscordReplyDeliveryPlan;
var carbon_1 = require("@buape/carbon");
var v10_1 = require("discord-api-types/v10");
var reply_reference_js_1 = require("../../auto-reply/reply/reply-reference.js");
var globals_js_1 = require("../../globals.js");
var resolve_route_js_1 = require("../../routing/resolve-route.js");
var utils_js_1 = require("../../utils.js");
var message_utils_js_1 = require("./message-utils.js");
var DISCORD_THREAD_STARTER_CACHE = new Map();
function __resetDiscordThreadStarterCacheForTest() {
  DISCORD_THREAD_STARTER_CACHE.clear();
}
function isDiscordThreadType(type) {
  return (
    type === carbon_1.ChannelType.PublicThread ||
    type === carbon_1.ChannelType.PrivateThread ||
    type === carbon_1.ChannelType.AnnouncementThread
  );
}
function resolveDiscordThreadChannel(params) {
  var _a, _b, _c;
  if (!params.isGuildMessage) {
    return null;
  }
  var message = params.message,
    channelInfo = params.channelInfo;
  var channel = "channel" in message ? message.channel : undefined;
  var isThreadChannel =
    channel &&
    typeof channel === "object" &&
    "isThread" in channel &&
    typeof channel.isThread === "function" &&
    channel.isThread();
  if (isThreadChannel) {
    return channel;
  }
  if (
    !isDiscordThreadType(channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.type)
  ) {
    return null;
  }
  return {
    id: message.channelId,
    name:
      (_a = channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name) !== null &&
      _a !== void 0
        ? _a
        : undefined,
    parentId:
      (_b = channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.parentId) !==
        null && _b !== void 0
        ? _b
        : undefined,
    parent: undefined,
    ownerId:
      (_c = channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.ownerId) !==
        null && _c !== void 0
        ? _c
        : undefined,
  };
}
function resolveDiscordThreadParentInfo(params) {
  return __awaiter(this, void 0, void 0, function () {
    var threadChannel, channelInfo, client, parentId, parentName, parentInfo, parentType;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          ((threadChannel = params.threadChannel),
            (channelInfo = params.channelInfo),
            (client = params.client));
          parentId =
            (_d =
              (_c =
                (_a = threadChannel.parentId) !== null && _a !== void 0
                  ? _a
                  : (_b = threadChannel.parent) === null || _b === void 0
                    ? void 0
                    : _b.id) !== null && _c !== void 0
                ? _c
                : channelInfo === null || channelInfo === void 0
                  ? void 0
                  : channelInfo.parentId) !== null && _d !== void 0
              ? _d
              : undefined;
          if (!parentId) {
            return [2 /*return*/, {}];
          }
          parentName = (_e = threadChannel.parent) === null || _e === void 0 ? void 0 : _e.name;
          return [4 /*yield*/, (0, message_utils_js_1.resolveDiscordChannelInfo)(client, parentId)];
        case 1:
          parentInfo = _f.sent();
          parentName =
            parentName !== null && parentName !== void 0
              ? parentName
              : parentInfo === null || parentInfo === void 0
                ? void 0
                : parentInfo.name;
          parentType = parentInfo === null || parentInfo === void 0 ? void 0 : parentInfo.type;
          return [2 /*return*/, { id: parentId, name: parentName, type: parentType }];
      }
    });
  });
}
function resolveDiscordThreadStarter(params) {
  return __awaiter(this, void 0, void 0, function () {
    var cacheKey,
      cached,
      parentType,
      isForumParent,
      messageChannelId,
      starter,
      text,
      author,
      timestamp,
      payload,
      _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    return __generator(this, function (_q) {
      switch (_q.label) {
        case 0:
          cacheKey = params.channel.id;
          cached = DISCORD_THREAD_STARTER_CACHE.get(cacheKey);
          if (cached) {
            return [2 /*return*/, cached];
          }
          _q.label = 1;
        case 1:
          _q.trys.push([1, 3, , 4]);
          parentType = params.parentType;
          isForumParent =
            parentType === carbon_1.ChannelType.GuildForum ||
            parentType === carbon_1.ChannelType.GuildMedia;
          messageChannelId = isForumParent ? params.channel.id : params.parentId;
          if (!messageChannelId) {
            return [2 /*return*/, null];
          }
          return [
            4 /*yield*/,
            params.client.rest.get(
              v10_1.Routes.channelMessage(messageChannelId, params.channel.id),
            ),
          ];
        case 2:
          starter = _q.sent();
          if (!starter) {
            return [2 /*return*/, null];
          }
          text =
            (_g =
              (_c = (_b = starter.content) === null || _b === void 0 ? void 0 : _b.trim()) !==
                null && _c !== void 0
                ? _c
                : (_f =
                      (_e = (_d = starter.embeds) === null || _d === void 0 ? void 0 : _d[0]) ===
                        null || _e === void 0
                        ? void 0
                        : _e.description) === null || _f === void 0
                  ? void 0
                  : _f.trim()) !== null && _g !== void 0
              ? _g
              : "";
          if (!text) {
            return [2 /*return*/, null];
          }
          author =
            (_l =
              (_j = (_h = starter.member) === null || _h === void 0 ? void 0 : _h.nick) !== null &&
              _j !== void 0
                ? _j
                : (_k = starter.member) === null || _k === void 0
                  ? void 0
                  : _k.displayName) !== null && _l !== void 0
              ? _l
              : starter.author
                ? starter.author.discriminator && starter.author.discriminator !== "0"
                  ? ""
                      .concat(
                        (_m = starter.author.username) !== null && _m !== void 0 ? _m : "Unknown",
                        "#",
                      )
                      .concat(starter.author.discriminator)
                  : (_p =
                        (_o = starter.author.username) !== null && _o !== void 0
                          ? _o
                          : starter.author.id) !== null && _p !== void 0
                    ? _p
                    : "Unknown"
                : "Unknown";
          timestamp = params.resolveTimestampMs(starter.timestamp);
          payload = {
            text: text,
            author: author,
            timestamp: timestamp !== null && timestamp !== void 0 ? timestamp : undefined,
          };
          DISCORD_THREAD_STARTER_CACHE.set(cacheKey, payload);
          return [2 /*return*/, payload];
        case 3:
          _a = _q.sent();
          return [2 /*return*/, null];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function resolveDiscordReplyTarget(opts) {
  var _a;
  if (opts.replyToMode === "off") {
    return undefined;
  }
  var replyToId = (_a = opts.replyToId) === null || _a === void 0 ? void 0 : _a.trim();
  if (!replyToId) {
    return undefined;
  }
  if (opts.replyToMode === "all") {
    return replyToId;
  }
  return opts.hasReplied ? undefined : replyToId;
}
function sanitizeDiscordThreadName(rawName, fallbackId) {
  var cleanedName = rawName
    .replace(/<@!?\d+>/g, "") // user mentions
    .replace(/<@&\d+>/g, "") // role mentions
    .replace(/<#\d+>/g, "") // channel mentions
    .replace(/\s+/g, " ")
    .trim();
  var baseSource = cleanedName || "Thread ".concat(fallbackId);
  var base = (0, utils_js_1.truncateUtf16Safe)(baseSource, 80);
  return (0, utils_js_1.truncateUtf16Safe)(base, 100) || "Thread ".concat(fallbackId);
}
function resolveDiscordAutoThreadContext(params) {
  var _a;
  var createdThreadId = String(
    (_a = params.createdThreadId) !== null && _a !== void 0 ? _a : "",
  ).trim();
  if (!createdThreadId) {
    return null;
  }
  var messageChannelId = params.messageChannelId.trim();
  if (!messageChannelId) {
    return null;
  }
  var threadSessionKey = (0, resolve_route_js_1.buildAgentSessionKey)({
    agentId: params.agentId,
    channel: params.channel,
    peer: { kind: "channel", id: createdThreadId },
  });
  var parentSessionKey = (0, resolve_route_js_1.buildAgentSessionKey)({
    agentId: params.agentId,
    channel: params.channel,
    peer: { kind: "channel", id: messageChannelId },
  });
  return {
    createdThreadId: createdThreadId,
    From: "".concat(params.channel, ":channel:").concat(createdThreadId),
    To: "channel:".concat(createdThreadId),
    OriginatingTo: "channel:".concat(createdThreadId),
    SessionKey: threadSessionKey,
    ParentSessionKey: parentSessionKey,
  };
}
function resolveDiscordAutoThreadReplyPlan(params) {
  return __awaiter(this, void 0, void 0, function () {
    var originalReplyTarget, createdThreadId, deliveryPlan, autoThreadContext;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          originalReplyTarget = "channel:".concat(params.message.channelId);
          return [
            4 /*yield*/,
            maybeCreateDiscordAutoThread({
              client: params.client,
              message: params.message,
              isGuildMessage: params.isGuildMessage,
              channelConfig: params.channelConfig,
              threadChannel: params.threadChannel,
              baseText: params.baseText,
              combinedBody: params.combinedBody,
            }),
          ];
        case 1:
          createdThreadId = _a.sent();
          deliveryPlan = resolveDiscordReplyDeliveryPlan({
            replyTarget: originalReplyTarget,
            replyToMode: params.replyToMode,
            messageId: params.message.id,
            threadChannel: params.threadChannel,
            createdThreadId: createdThreadId,
          });
          autoThreadContext = params.isGuildMessage
            ? resolveDiscordAutoThreadContext({
                agentId: params.agentId,
                channel: params.channel,
                messageChannelId: params.message.channelId,
                createdThreadId: createdThreadId,
              })
            : null;
          return [
            2 /*return*/,
            __assign(__assign({}, deliveryPlan), {
              createdThreadId: createdThreadId,
              autoThreadContext: autoThreadContext,
            }),
          ];
      }
    });
  });
}
function maybeCreateDiscordAutoThread(params) {
  return __awaiter(this, void 0, void 0, function () {
    var threadName, created, createdId, err_1;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (!params.isGuildMessage) {
            return [2 /*return*/, undefined];
          }
          if (!((_a = params.channelConfig) === null || _a === void 0 ? void 0 : _a.autoThread)) {
            return [2 /*return*/, undefined];
          }
          if (params.threadChannel) {
            return [2 /*return*/, undefined];
          }
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          threadName = sanitizeDiscordThreadName(
            params.baseText || params.combinedBody || "Thread",
            params.message.id,
          );
          return [
            4 /*yield*/,
            params.client.rest.post(
              "".concat(
                v10_1.Routes.channelMessage(params.message.channelId, params.message.id),
                "/threads",
              ),
              {
                body: {
                  name: threadName,
                  auto_archive_duration: 60,
                },
              },
            ),
          ];
        case 2:
          created = _b.sent();
          createdId = (created === null || created === void 0 ? void 0 : created.id)
            ? String(created.id)
            : "";
          return [2 /*return*/, createdId || undefined];
        case 3:
          err_1 = _b.sent();
          (0, globals_js_1.logVerbose)(
            "discord: autoThread failed for "
              .concat(params.message.channelId, "/")
              .concat(params.message.id, ": ")
              .concat(String(err_1)),
          );
          return [2 /*return*/, undefined];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function resolveDiscordReplyDeliveryPlan(params) {
  var originalReplyTarget = params.replyTarget;
  var deliverTarget = originalReplyTarget;
  var replyTarget = originalReplyTarget;
  if (params.createdThreadId) {
    deliverTarget = "channel:".concat(params.createdThreadId);
    replyTarget = deliverTarget;
  }
  var allowReference = deliverTarget === originalReplyTarget;
  var replyReference = (0, reply_reference_js_1.createReplyReferencePlanner)({
    replyToMode: allowReference ? params.replyToMode : "off",
    existingId: params.threadChannel ? params.messageId : undefined,
    startId: params.messageId,
    allowReference: allowReference,
  });
  return { deliverTarget: deliverTarget, replyTarget: replyTarget, replyReference: replyReference };
}
