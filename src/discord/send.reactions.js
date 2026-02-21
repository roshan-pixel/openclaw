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
exports.fetchChannelPermissionsDiscord = void 0;
exports.reactMessageDiscord = reactMessageDiscord;
exports.removeReactionDiscord = removeReactionDiscord;
exports.removeOwnReactionsDiscord = removeOwnReactionsDiscord;
exports.fetchReactionsDiscord = fetchReactionsDiscord;
var v10_1 = require("discord-api-types/v10");
var config_js_1 = require("../config/config.js");
var send_shared_js_1 = require("./send.shared.js");
function reactMessageDiscord(channelId_1, messageId_1, emoji_1) {
  return __awaiter(this, arguments, void 0, function (channelId, messageId, emoji, opts) {
    var cfg, _a, rest, request, encoded;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          cfg = (0, config_js_1.loadConfig)();
          ((_a = (0, send_shared_js_1.createDiscordClient)(opts, cfg)),
            (rest = _a.rest),
            (request = _a.request));
          encoded = (0, send_shared_js_1.normalizeReactionEmoji)(emoji);
          return [
            4 /*yield*/,
            request(function () {
              return rest.put(
                v10_1.Routes.channelMessageOwnReaction(channelId, messageId, encoded),
              );
            }, "react"),
          ];
        case 1:
          _b.sent();
          return [2 /*return*/, { ok: true }];
      }
    });
  });
}
function removeReactionDiscord(channelId_1, messageId_1, emoji_1) {
  return __awaiter(this, arguments, void 0, function (channelId, messageId, emoji, opts) {
    var rest, encoded;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          encoded = (0, send_shared_js_1.normalizeReactionEmoji)(emoji);
          return [
            4 /*yield*/,
            rest.delete(v10_1.Routes.channelMessageOwnReaction(channelId, messageId, encoded)),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/, { ok: true }];
      }
    });
  });
}
function removeOwnReactionsDiscord(channelId_1, messageId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, messageId, opts) {
    var rest, message, identifiers, _i, _a, reaction, identifier, removed;
    var _b;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          return [4 /*yield*/, rest.get(v10_1.Routes.channelMessage(channelId, messageId))];
        case 1:
          message = _c.sent();
          identifiers = new Set();
          for (
            _i = 0, _a = (_b = message.reactions) !== null && _b !== void 0 ? _b : [];
            _i < _a.length;
            _i++
          ) {
            reaction = _a[_i];
            identifier = (0, send_shared_js_1.buildReactionIdentifier)(reaction.emoji);
            if (identifier) {
              identifiers.add(identifier);
            }
          }
          if (identifiers.size === 0) {
            return [2 /*return*/, { ok: true, removed: [] }];
          }
          removed = [];
          return [
            4 /*yield*/,
            Promise.allSettled(
              Array.from(identifiers, function (identifier) {
                removed.push(identifier);
                return rest.delete(
                  v10_1.Routes.channelMessageOwnReaction(
                    channelId,
                    messageId,
                    (0, send_shared_js_1.normalizeReactionEmoji)(identifier),
                  ),
                );
              }),
            ),
          ];
        case 2:
          _c.sent();
          return [2 /*return*/, { ok: true, removed: removed }];
      }
    });
  });
}
function fetchReactionsDiscord(channelId_1, messageId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, messageId, opts) {
    var rest,
      message,
      reactions,
      limit,
      summaries,
      _i,
      reactions_1,
      reaction,
      identifier,
      encoded,
      users;
    var _a, _b, _c;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          return [4 /*yield*/, rest.get(v10_1.Routes.channelMessage(channelId, messageId))];
        case 1:
          message = _d.sent();
          reactions = (_a = message.reactions) !== null && _a !== void 0 ? _a : [];
          if (reactions.length === 0) {
            return [2 /*return*/, []];
          }
          limit =
            typeof opts.limit === "number" && Number.isFinite(opts.limit)
              ? Math.min(Math.max(Math.floor(opts.limit), 1), 100)
              : 100;
          summaries = [];
          ((_i = 0), (reactions_1 = reactions));
          _d.label = 2;
        case 2:
          if (!(_i < reactions_1.length)) {
            return [3 /*break*/, 5];
          }
          reaction = reactions_1[_i];
          identifier = (0, send_shared_js_1.buildReactionIdentifier)(reaction.emoji);
          if (!identifier) {
            return [3 /*break*/, 4];
          }
          encoded = encodeURIComponent(identifier);
          return [
            4 /*yield*/,
            rest.get(v10_1.Routes.channelMessageReaction(channelId, messageId, encoded), {
              limit: limit,
            }),
          ];
        case 3:
          users = _d.sent();
          summaries.push({
            emoji: {
              id: (_b = reaction.emoji.id) !== null && _b !== void 0 ? _b : null,
              name: (_c = reaction.emoji.name) !== null && _c !== void 0 ? _c : null,
              raw: (0, send_shared_js_1.formatReactionEmoji)(reaction.emoji),
            },
            count: reaction.count,
            users: users.map(function (user) {
              return {
                id: user.id,
                username: user.username,
                tag:
                  user.username && user.discriminator
                    ? "".concat(user.username, "#").concat(user.discriminator)
                    : user.username,
              };
            }),
          });
          _d.label = 4;
        case 4:
          _i++;
          return [3 /*break*/, 2];
        case 5:
          return [2 /*return*/, summaries];
      }
    });
  });
}
var send_permissions_js_1 = require("./send.permissions.js");
Object.defineProperty(exports, "fetchChannelPermissionsDiscord", {
  enumerable: true,
  get: function () {
    return send_permissions_js_1.fetchChannelPermissionsDiscord;
  },
});
