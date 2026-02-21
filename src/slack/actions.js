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
exports.reactSlackMessage = reactSlackMessage;
exports.removeSlackReaction = removeSlackReaction;
exports.removeOwnSlackReactions = removeOwnSlackReactions;
exports.listSlackReactions = listSlackReactions;
exports.sendSlackMessage = sendSlackMessage;
exports.editSlackMessage = editSlackMessage;
exports.deleteSlackMessage = deleteSlackMessage;
exports.readSlackMessages = readSlackMessages;
exports.getSlackMemberInfo = getSlackMemberInfo;
exports.listSlackEmojis = listSlackEmojis;
exports.pinSlackMessage = pinSlackMessage;
exports.unpinSlackMessage = unpinSlackMessage;
exports.listSlackPins = listSlackPins;
var config_js_1 = require("../config/config.js");
var globals_js_1 = require("../globals.js");
var accounts_js_1 = require("./accounts.js");
var client_js_1 = require("./client.js");
var send_js_1 = require("./send.js");
var token_js_1 = require("./token.js");
function resolveToken(explicit, accountId) {
  var _a, _b;
  var cfg = (0, config_js_1.loadConfig)();
  var account = (0, accounts_js_1.resolveSlackAccount)({ cfg: cfg, accountId: accountId });
  var token = (0, token_js_1.resolveSlackBotToken)(
    (_a = explicit !== null && explicit !== void 0 ? explicit : account.botToken) !== null &&
      _a !== void 0
      ? _a
      : undefined,
  );
  if (!token) {
    (0, globals_js_1.logVerbose)(
      "slack actions: missing bot token for account="
        .concat(account.accountId, " explicit=")
        .concat(Boolean(explicit), " source=")
        .concat((_b = account.botTokenSource) !== null && _b !== void 0 ? _b : "unknown"),
    );
    throw new Error("SLACK_BOT_TOKEN or channels.slack.botToken is required for Slack actions");
  }
  return token;
}
function normalizeEmoji(raw) {
  var trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("Emoji is required for Slack reactions");
  }
  return trimmed.replace(/^:+|:+$/g, "");
}
function getClient() {
  return __awaiter(this, arguments, void 0, function (opts) {
    var token;
    var _a;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_b) {
      token = resolveToken(opts.token, opts.accountId);
      return [
        2 /*return*/,
        (_a = opts.client) !== null && _a !== void 0
          ? _a
          : (0, client_js_1.createSlackWebClient)(token),
      ];
    });
  });
}
function resolveBotUserId(client) {
  return __awaiter(this, void 0, void 0, function () {
    var auth;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, client.auth.test()];
        case 1:
          auth = _a.sent();
          if (!(auth === null || auth === void 0 ? void 0 : auth.user_id)) {
            throw new Error("Failed to resolve Slack bot user id");
          }
          return [2 /*return*/, auth.user_id];
      }
    });
  });
}
function reactSlackMessage(channelId_1, messageId_1, emoji_1) {
  return __awaiter(this, arguments, void 0, function (channelId, messageId, emoji, opts) {
    var client;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, getClient(opts)];
        case 1:
          client = _a.sent();
          return [
            4 /*yield*/,
            client.reactions.add({
              channel: channelId,
              timestamp: messageId,
              name: normalizeEmoji(emoji),
            }),
          ];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function removeSlackReaction(channelId_1, messageId_1, emoji_1) {
  return __awaiter(this, arguments, void 0, function (channelId, messageId, emoji, opts) {
    var client;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, getClient(opts)];
        case 1:
          client = _a.sent();
          return [
            4 /*yield*/,
            client.reactions.remove({
              channel: channelId,
              timestamp: messageId,
              name: normalizeEmoji(emoji),
            }),
          ];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function removeOwnSlackReactions(channelId_1, messageId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, messageId, opts) {
    var client, userId, reactions, toRemove, _i, _a, reaction, name_1, users;
    var _b;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [4 /*yield*/, getClient(opts)];
        case 1:
          client = _c.sent();
          return [4 /*yield*/, resolveBotUserId(client)];
        case 2:
          userId = _c.sent();
          return [4 /*yield*/, listSlackReactions(channelId, messageId, { client: client })];
        case 3:
          reactions = _c.sent();
          toRemove = new Set();
          for (
            _i = 0, _a = reactions !== null && reactions !== void 0 ? reactions : [];
            _i < _a.length;
            _i++
          ) {
            reaction = _a[_i];
            name_1 = reaction === null || reaction === void 0 ? void 0 : reaction.name;
            if (!name_1) {
              continue;
            }
            users =
              (_b = reaction === null || reaction === void 0 ? void 0 : reaction.users) !== null &&
              _b !== void 0
                ? _b
                : [];
            if (users.includes(userId)) {
              toRemove.add(name_1);
            }
          }
          if (toRemove.size === 0) {
            return [2 /*return*/, []];
          }
          return [
            4 /*yield*/,
            Promise.all(
              Array.from(toRemove, function (name) {
                return client.reactions.remove({
                  channel: channelId,
                  timestamp: messageId,
                  name: name,
                });
              }),
            ),
          ];
        case 4:
          _c.sent();
          return [2 /*return*/, Array.from(toRemove)];
      }
    });
  });
}
function listSlackReactions(channelId_1, messageId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, messageId, opts) {
    var client, result, message;
    var _a;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, getClient(opts)];
        case 1:
          client = _b.sent();
          return [
            4 /*yield*/,
            client.reactions.get({
              channel: channelId,
              timestamp: messageId,
              full: true,
            }),
          ];
        case 2:
          result = _b.sent();
          message = result.message;
          return [
            2 /*return*/,
            (_a = message === null || message === void 0 ? void 0 : message.reactions) !== null &&
            _a !== void 0
              ? _a
              : [],
          ];
      }
    });
  });
}
function sendSlackMessage(to_1, content_1) {
  return __awaiter(this, arguments, void 0, function (to, content, opts) {
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, send_js_1.sendMessageSlack)(to, content, {
              accountId: opts.accountId,
              token: opts.token,
              mediaUrl: opts.mediaUrl,
              client: opts.client,
              threadTs: opts.threadTs,
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function editSlackMessage(channelId_1, messageId_1, content_1) {
  return __awaiter(this, arguments, void 0, function (channelId, messageId, content, opts) {
    var client;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, getClient(opts)];
        case 1:
          client = _a.sent();
          return [
            4 /*yield*/,
            client.chat.update({
              channel: channelId,
              ts: messageId,
              text: content,
            }),
          ];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function deleteSlackMessage(channelId_1, messageId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, messageId, opts) {
    var client;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, getClient(opts)];
        case 1:
          client = _a.sent();
          return [
            4 /*yield*/,
            client.chat.delete({
              channel: channelId,
              ts: messageId,
            }),
          ];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function readSlackMessages(channelId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, opts) {
    var client, result_1, result;
    var _a, _b;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [4 /*yield*/, getClient(opts)];
        case 1:
          client = _c.sent();
          if (!opts.threadId) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            client.conversations.replies({
              channel: channelId,
              ts: opts.threadId,
              limit: opts.limit,
              latest: opts.before,
              oldest: opts.after,
            }),
          ];
        case 2:
          result_1 = _c.sent();
          return [
            2 /*return*/,
            {
              // conversations.replies includes the parent message; drop it for replies-only reads.
              messages: ((_a = result_1.messages) !== null && _a !== void 0 ? _a : []).filter(
                function (message) {
                  return (
                    (message === null || message === void 0 ? void 0 : message.ts) !== opts.threadId
                  );
                },
              ),
              hasMore: Boolean(result_1.has_more),
            },
          ];
        case 3:
          return [
            4 /*yield*/,
            client.conversations.history({
              channel: channelId,
              limit: opts.limit,
              latest: opts.before,
              oldest: opts.after,
            }),
          ];
        case 4:
          result = _c.sent();
          return [
            2 /*return*/,
            {
              messages: (_b = result.messages) !== null && _b !== void 0 ? _b : [],
              hasMore: Boolean(result.has_more),
            },
          ];
      }
    });
  });
}
function getSlackMemberInfo(userId_1) {
  return __awaiter(this, arguments, void 0, function (userId, opts) {
    var client;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, getClient(opts)];
        case 1:
          client = _a.sent();
          return [4 /*yield*/, client.users.info({ user: userId })];
        case 2:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function listSlackEmojis() {
  return __awaiter(this, arguments, void 0, function (opts) {
    var client;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, getClient(opts)];
        case 1:
          client = _a.sent();
          return [4 /*yield*/, client.emoji.list()];
        case 2:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function pinSlackMessage(channelId_1, messageId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, messageId, opts) {
    var client;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, getClient(opts)];
        case 1:
          client = _a.sent();
          return [4 /*yield*/, client.pins.add({ channel: channelId, timestamp: messageId })];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function unpinSlackMessage(channelId_1, messageId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, messageId, opts) {
    var client;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, getClient(opts)];
        case 1:
          client = _a.sent();
          return [4 /*yield*/, client.pins.remove({ channel: channelId, timestamp: messageId })];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function listSlackPins(channelId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, opts) {
    var client, result;
    var _a;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, getClient(opts)];
        case 1:
          client = _b.sent();
          return [4 /*yield*/, client.pins.list({ channel: channelId })];
        case 2:
          result = _b.sent();
          return [2 /*return*/, (_a = result.items) !== null && _a !== void 0 ? _a : []];
      }
    });
  });
}
