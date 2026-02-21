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
exports.createImageMessage = createImageMessage;
exports.createLocationMessage = createLocationMessage;
exports.sendMessageLine = sendMessageLine;
exports.pushMessageLine = pushMessageLine;
exports.replyMessageLine = replyMessageLine;
exports.pushMessagesLine = pushMessagesLine;
exports.createFlexMessage = createFlexMessage;
exports.pushImageMessage = pushImageMessage;
exports.pushLocationMessage = pushLocationMessage;
exports.pushFlexMessage = pushFlexMessage;
exports.pushTemplateMessage = pushTemplateMessage;
exports.pushTextMessageWithQuickReplies = pushTextMessageWithQuickReplies;
exports.createQuickReplyItems = createQuickReplyItems;
exports.createTextMessageWithQuickReplies = createTextMessageWithQuickReplies;
exports.showLoadingAnimation = showLoadingAnimation;
exports.getUserProfile = getUserProfile;
exports.getUserDisplayName = getUserDisplayName;
var bot_sdk_1 = require("@line/bot-sdk");
var config_js_1 = require("../config/config.js");
var globals_js_1 = require("../globals.js");
var channel_activity_js_1 = require("../infra/channel-activity.js");
var accounts_js_1 = require("./accounts.js");
// Cache for user profiles
var userProfileCache = new Map();
var PROFILE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
function resolveToken(explicit, params) {
  if (explicit === null || explicit === void 0 ? void 0 : explicit.trim()) {
    return explicit.trim();
  }
  if (!params.channelAccessToken) {
    throw new Error(
      'LINE channel access token missing for account "'.concat(
        params.accountId,
        '" (set channels.line.channelAccessToken or LINE_CHANNEL_ACCESS_TOKEN).',
      ),
    );
  }
  return params.channelAccessToken.trim();
}
function normalizeTarget(to) {
  var trimmed = to.trim();
  if (!trimmed) {
    throw new Error("Recipient is required for LINE sends");
  }
  // Strip internal prefixes
  var normalized = trimmed
    .replace(/^line:group:/i, "")
    .replace(/^line:room:/i, "")
    .replace(/^line:user:/i, "")
    .replace(/^line:/i, "");
  if (!normalized) {
    throw new Error("Recipient is required for LINE sends");
  }
  return normalized;
}
function createTextMessage(text) {
  return { type: "text", text: text };
}
function createImageMessage(originalContentUrl, previewImageUrl) {
  return {
    type: "image",
    originalContentUrl: originalContentUrl,
    previewImageUrl:
      previewImageUrl !== null && previewImageUrl !== void 0 ? previewImageUrl : originalContentUrl,
  };
}
function createLocationMessage(location) {
  return {
    type: "location",
    title: location.title.slice(0, 100), // LINE limit
    address: location.address.slice(0, 100), // LINE limit
    latitude: location.latitude,
    longitude: location.longitude,
  };
}
function logLineHttpError(err, context) {
  if (!err || typeof err !== "object") {
    return;
  }
  var _a = err,
    status = _a.status,
    statusText = _a.statusText,
    body = _a.body;
  if (typeof body === "string") {
    var summary = status
      ? ""
          .concat(status, " ")
          .concat(statusText !== null && statusText !== void 0 ? statusText : "")
          .trim()
      : "unknown status";
    (0, globals_js_1.logVerbose)(
      "line: ".concat(context, " failed (").concat(summary, "): ").concat(body),
    );
  }
}
function sendMessageLine(to_1, text_1) {
  return __awaiter(this, arguments, void 0, function (to, text, opts) {
    var cfg, account, token, chatId, client, messages;
    var _a;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          cfg = (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveLineAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          token = resolveToken(opts.channelAccessToken, account);
          chatId = normalizeTarget(to);
          client = new bot_sdk_1.messagingApi.MessagingApiClient({
            channelAccessToken: token,
          });
          messages = [];
          // Add media if provided
          if ((_a = opts.mediaUrl) === null || _a === void 0 ? void 0 : _a.trim()) {
            messages.push(createImageMessage(opts.mediaUrl.trim()));
          }
          // Add text message
          if (text === null || text === void 0 ? void 0 : text.trim()) {
            messages.push(createTextMessage(text.trim()));
          }
          if (messages.length === 0) {
            throw new Error("Message must be non-empty for LINE sends");
          }
          if (!opts.replyToken) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            client.replyMessage({
              replyToken: opts.replyToken,
              messages: messages,
            }),
          ];
        case 1:
          _b.sent();
          (0, channel_activity_js_1.recordChannelActivity)({
            channel: "line",
            accountId: account.accountId,
            direction: "outbound",
          });
          if (opts.verbose) {
            (0, globals_js_1.logVerbose)("line: replied to ".concat(chatId));
          }
          return [
            2 /*return*/,
            {
              messageId: "reply",
              chatId: chatId,
            },
          ];
        case 2:
          // Push message (for proactive messaging)
          return [
            4 /*yield*/,
            client.pushMessage({
              to: chatId,
              messages: messages,
            }),
          ];
        case 3:
          // Push message (for proactive messaging)
          _b.sent();
          (0, channel_activity_js_1.recordChannelActivity)({
            channel: "line",
            accountId: account.accountId,
            direction: "outbound",
          });
          if (opts.verbose) {
            (0, globals_js_1.logVerbose)("line: pushed message to ".concat(chatId));
          }
          return [
            2 /*return*/,
            {
              messageId: "push",
              chatId: chatId,
            },
          ];
      }
    });
  });
}
function pushMessageLine(to_1, text_1) {
  return __awaiter(this, arguments, void 0, function (to, text, opts) {
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      // Force push (no reply token)
      return [
        2 /*return*/,
        sendMessageLine(to, text, __assign(__assign({}, opts), { replyToken: undefined })),
      ];
    });
  });
}
function replyMessageLine(replyToken_1, messages_1) {
  return __awaiter(this, arguments, void 0, function (replyToken, messages, opts) {
    var cfg, account, token, client;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          cfg = (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveLineAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          token = resolveToken(opts.channelAccessToken, account);
          client = new bot_sdk_1.messagingApi.MessagingApiClient({
            channelAccessToken: token,
          });
          return [
            4 /*yield*/,
            client.replyMessage({
              replyToken: replyToken,
              messages: messages,
            }),
          ];
        case 1:
          _a.sent();
          (0, channel_activity_js_1.recordChannelActivity)({
            channel: "line",
            accountId: account.accountId,
            direction: "outbound",
          });
          if (opts.verbose) {
            (0, globals_js_1.logVerbose)(
              "line: replied with ".concat(messages.length, " messages"),
            );
          }
          return [2 /*return*/];
      }
    });
  });
}
function pushMessagesLine(to_1, messages_1) {
  return __awaiter(this, arguments, void 0, function (to, messages, opts) {
    var cfg, account, token, chatId, client;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (messages.length === 0) {
            throw new Error("Message must be non-empty for LINE sends");
          }
          cfg = (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveLineAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          token = resolveToken(opts.channelAccessToken, account);
          chatId = normalizeTarget(to);
          client = new bot_sdk_1.messagingApi.MessagingApiClient({
            channelAccessToken: token,
          });
          return [
            4 /*yield*/,
            client
              .pushMessage({
                to: chatId,
                messages: messages,
              })
              .catch(function (err) {
                logLineHttpError(err, "push message");
                throw err;
              }),
          ];
        case 1:
          _a.sent();
          (0, channel_activity_js_1.recordChannelActivity)({
            channel: "line",
            accountId: account.accountId,
            direction: "outbound",
          });
          if (opts.verbose) {
            (0, globals_js_1.logVerbose)(
              "line: pushed ".concat(messages.length, " messages to ").concat(chatId),
            );
          }
          return [
            2 /*return*/,
            {
              messageId: "push",
              chatId: chatId,
            },
          ];
      }
    });
  });
}
function createFlexMessage(altText, contents) {
  return {
    type: "flex",
    altText: altText,
    contents: contents,
  };
}
/**
 * Push an image message to a user/group
 */
function pushImageMessage(to_1, originalContentUrl_1, previewImageUrl_1) {
  return __awaiter(
    this,
    arguments,
    void 0,
    function (to, originalContentUrl, previewImageUrl, opts) {
      var cfg, account, token, chatId, client, imageMessage;
      if (opts === void 0) {
        opts = {};
      }
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            cfg = (0, config_js_1.loadConfig)();
            account = (0, accounts_js_1.resolveLineAccount)({
              cfg: cfg,
              accountId: opts.accountId,
            });
            token = resolveToken(opts.channelAccessToken, account);
            chatId = normalizeTarget(to);
            client = new bot_sdk_1.messagingApi.MessagingApiClient({
              channelAccessToken: token,
            });
            imageMessage = createImageMessage(originalContentUrl, previewImageUrl);
            return [
              4 /*yield*/,
              client.pushMessage({
                to: chatId,
                messages: [imageMessage],
              }),
            ];
          case 1:
            _a.sent();
            (0, channel_activity_js_1.recordChannelActivity)({
              channel: "line",
              accountId: account.accountId,
              direction: "outbound",
            });
            if (opts.verbose) {
              (0, globals_js_1.logVerbose)("line: pushed image to ".concat(chatId));
            }
            return [
              2 /*return*/,
              {
                messageId: "push",
                chatId: chatId,
              },
            ];
        }
      });
    },
  );
}
/**
 * Push a location message to a user/group
 */
function pushLocationMessage(to_1, location_1) {
  return __awaiter(this, arguments, void 0, function (to, location, opts) {
    var cfg, account, token, chatId, client, locationMessage;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          cfg = (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveLineAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          token = resolveToken(opts.channelAccessToken, account);
          chatId = normalizeTarget(to);
          client = new bot_sdk_1.messagingApi.MessagingApiClient({
            channelAccessToken: token,
          });
          locationMessage = createLocationMessage(location);
          return [
            4 /*yield*/,
            client.pushMessage({
              to: chatId,
              messages: [locationMessage],
            }),
          ];
        case 1:
          _a.sent();
          (0, channel_activity_js_1.recordChannelActivity)({
            channel: "line",
            accountId: account.accountId,
            direction: "outbound",
          });
          if (opts.verbose) {
            (0, globals_js_1.logVerbose)("line: pushed location to ".concat(chatId));
          }
          return [
            2 /*return*/,
            {
              messageId: "push",
              chatId: chatId,
            },
          ];
      }
    });
  });
}
/**
 * Push a Flex Message to a user/group
 */
function pushFlexMessage(to_1, altText_1, contents_1) {
  return __awaiter(this, arguments, void 0, function (to, altText, contents, opts) {
    var cfg, account, token, chatId, client, flexMessage;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          cfg = (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveLineAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          token = resolveToken(opts.channelAccessToken, account);
          chatId = normalizeTarget(to);
          client = new bot_sdk_1.messagingApi.MessagingApiClient({
            channelAccessToken: token,
          });
          flexMessage = {
            type: "flex",
            altText: altText.slice(0, 400), // LINE limit
            contents: contents,
          };
          return [
            4 /*yield*/,
            client
              .pushMessage({
                to: chatId,
                messages: [flexMessage],
              })
              .catch(function (err) {
                logLineHttpError(err, "push flex message");
                throw err;
              }),
          ];
        case 1:
          _a.sent();
          (0, channel_activity_js_1.recordChannelActivity)({
            channel: "line",
            accountId: account.accountId,
            direction: "outbound",
          });
          if (opts.verbose) {
            (0, globals_js_1.logVerbose)("line: pushed flex message to ".concat(chatId));
          }
          return [
            2 /*return*/,
            {
              messageId: "push",
              chatId: chatId,
            },
          ];
      }
    });
  });
}
/**
 * Push a Template Message to a user/group
 */
function pushTemplateMessage(to_1, template_1) {
  return __awaiter(this, arguments, void 0, function (to, template, opts) {
    var cfg, account, token, chatId, client;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          cfg = (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveLineAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          token = resolveToken(opts.channelAccessToken, account);
          chatId = normalizeTarget(to);
          client = new bot_sdk_1.messagingApi.MessagingApiClient({
            channelAccessToken: token,
          });
          return [
            4 /*yield*/,
            client.pushMessage({
              to: chatId,
              messages: [template],
            }),
          ];
        case 1:
          _a.sent();
          (0, channel_activity_js_1.recordChannelActivity)({
            channel: "line",
            accountId: account.accountId,
            direction: "outbound",
          });
          if (opts.verbose) {
            (0, globals_js_1.logVerbose)("line: pushed template message to ".concat(chatId));
          }
          return [
            2 /*return*/,
            {
              messageId: "push",
              chatId: chatId,
            },
          ];
      }
    });
  });
}
/**
 * Push a text message with quick reply buttons
 */
function pushTextMessageWithQuickReplies(to_1, text_1, quickReplyLabels_1) {
  return __awaiter(this, arguments, void 0, function (to, text, quickReplyLabels, opts) {
    var cfg, account, token, chatId, client, message;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          cfg = (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveLineAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          token = resolveToken(opts.channelAccessToken, account);
          chatId = normalizeTarget(to);
          client = new bot_sdk_1.messagingApi.MessagingApiClient({
            channelAccessToken: token,
          });
          message = createTextMessageWithQuickReplies(text, quickReplyLabels);
          return [
            4 /*yield*/,
            client.pushMessage({
              to: chatId,
              messages: [message],
            }),
          ];
        case 1:
          _a.sent();
          (0, channel_activity_js_1.recordChannelActivity)({
            channel: "line",
            accountId: account.accountId,
            direction: "outbound",
          });
          if (opts.verbose) {
            (0, globals_js_1.logVerbose)(
              "line: pushed message with quick replies to ".concat(chatId),
            );
          }
          return [
            2 /*return*/,
            {
              messageId: "push",
              chatId: chatId,
            },
          ];
      }
    });
  });
}
/**
 * Create quick reply buttons to attach to a message
 */
function createQuickReplyItems(labels) {
  var items = labels.slice(0, 13).map(function (label) {
    return {
      type: "action",
      action: {
        type: "message",
        label: label.slice(0, 20), // LINE limit: 20 chars
        text: label,
      },
    };
  });
  return { items: items };
}
/**
 * Create a text message with quick reply buttons
 */
function createTextMessageWithQuickReplies(text, quickReplyLabels) {
  return {
    type: "text",
    text: text,
    quickReply: createQuickReplyItems(quickReplyLabels),
  };
}
/**
 * Show loading animation to user (lasts up to 20 seconds or until next message)
 */
function showLoadingAnimation(chatId_1) {
  return __awaiter(this, arguments, void 0, function (chatId, opts) {
    var cfg, account, token, client, err_1;
    var _a;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          cfg = (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveLineAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          token = resolveToken(opts.channelAccessToken, account);
          client = new bot_sdk_1.messagingApi.MessagingApiClient({
            channelAccessToken: token,
          });
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            client.showLoadingAnimation({
              chatId: normalizeTarget(chatId),
              loadingSeconds: (_a = opts.loadingSeconds) !== null && _a !== void 0 ? _a : 20,
            }),
          ];
        case 2:
          _b.sent();
          (0, globals_js_1.logVerbose)("line: showing loading animation to ".concat(chatId));
          return [3 /*break*/, 4];
        case 3:
          err_1 = _b.sent();
          // Loading animation may fail for groups or unsupported clients - ignore
          (0, globals_js_1.logVerbose)(
            "line: loading animation failed (non-fatal): ".concat(String(err_1)),
          );
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
/**
 * Fetch user profile (display name, picture URL)
 */
function getUserProfile(userId_1) {
  return __awaiter(this, arguments, void 0, function (userId, opts) {
    var useCache, cached, cfg, account, token, client, profile, result, err_2;
    var _a;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          useCache = (_a = opts.useCache) !== null && _a !== void 0 ? _a : true;
          // Check cache first
          if (useCache) {
            cached = userProfileCache.get(userId);
            if (cached && Date.now() - cached.fetchedAt < PROFILE_CACHE_TTL_MS) {
              return [
                2 /*return*/,
                { displayName: cached.displayName, pictureUrl: cached.pictureUrl },
              ];
            }
          }
          cfg = (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveLineAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          token = resolveToken(opts.channelAccessToken, account);
          client = new bot_sdk_1.messagingApi.MessagingApiClient({
            channelAccessToken: token,
          });
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          return [4 /*yield*/, client.getProfile(userId)];
        case 2:
          profile = _b.sent();
          result = {
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
          };
          // Cache the result
          userProfileCache.set(userId, __assign(__assign({}, result), { fetchedAt: Date.now() }));
          return [2 /*return*/, result];
        case 3:
          err_2 = _b.sent();
          (0, globals_js_1.logVerbose)(
            "line: failed to fetch profile for ".concat(userId, ": ").concat(String(err_2)),
          );
          return [2 /*return*/, null];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
/**
 * Get user's display name (with fallback to userId)
 */
function getUserDisplayName(userId_1) {
  return __awaiter(this, arguments, void 0, function (userId, opts) {
    var profile;
    var _a;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, getUserProfile(userId, opts)];
        case 1:
          profile = _b.sent();
          return [
            2 /*return*/,
            (_a = profile === null || profile === void 0 ? void 0 : profile.displayName) !== null &&
            _a !== void 0
              ? _a
              : userId,
          ];
      }
    });
  });
}
