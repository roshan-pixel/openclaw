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
exports.readMessagesDiscord = readMessagesDiscord;
exports.fetchMessageDiscord = fetchMessageDiscord;
exports.editMessageDiscord = editMessageDiscord;
exports.deleteMessageDiscord = deleteMessageDiscord;
exports.pinMessageDiscord = pinMessageDiscord;
exports.unpinMessageDiscord = unpinMessageDiscord;
exports.listPinsDiscord = listPinsDiscord;
exports.createThreadDiscord = createThreadDiscord;
exports.listThreadsDiscord = listThreadsDiscord;
exports.searchMessagesDiscord = searchMessagesDiscord;
var v10_1 = require("discord-api-types/v10");
var send_shared_js_1 = require("./send.shared.js");
function readMessagesDiscord(channelId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, query, opts) {
    var rest, limit, params;
    if (query === void 0) {
      query = {};
    }
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          limit =
            typeof query.limit === "number" && Number.isFinite(query.limit)
              ? Math.min(Math.max(Math.floor(query.limit), 1), 100)
              : undefined;
          params = {};
          if (limit) {
            params.limit = limit;
          }
          if (query.before) {
            params.before = query.before;
          }
          if (query.after) {
            params.after = query.after;
          }
          if (query.around) {
            params.around = query.around;
          }
          return [4 /*yield*/, rest.get(v10_1.Routes.channelMessages(channelId), params)];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function fetchMessageDiscord(channelId_1, messageId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, messageId, opts) {
    var rest;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          return [4 /*yield*/, rest.get(v10_1.Routes.channelMessage(channelId, messageId))];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function editMessageDiscord(channelId_1, messageId_1, payload_1) {
  return __awaiter(this, arguments, void 0, function (channelId, messageId, payload, opts) {
    var rest;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          return [
            4 /*yield*/,
            rest.patch(v10_1.Routes.channelMessage(channelId, messageId), {
              body: { content: payload.content },
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function deleteMessageDiscord(channelId_1, messageId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, messageId, opts) {
    var rest;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          return [4 /*yield*/, rest.delete(v10_1.Routes.channelMessage(channelId, messageId))];
        case 1:
          _a.sent();
          return [2 /*return*/, { ok: true }];
      }
    });
  });
}
function pinMessageDiscord(channelId_1, messageId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, messageId, opts) {
    var rest;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          return [4 /*yield*/, rest.put(v10_1.Routes.channelPin(channelId, messageId))];
        case 1:
          _a.sent();
          return [2 /*return*/, { ok: true }];
      }
    });
  });
}
function unpinMessageDiscord(channelId_1, messageId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, messageId, opts) {
    var rest;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          return [4 /*yield*/, rest.delete(v10_1.Routes.channelPin(channelId, messageId))];
        case 1:
          _a.sent();
          return [2 /*return*/, { ok: true }];
      }
    });
  });
}
function listPinsDiscord(channelId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, opts) {
    var rest;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          return [4 /*yield*/, rest.get(v10_1.Routes.channelPins(channelId))];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function createThreadDiscord(channelId_1, payload_1) {
  return __awaiter(this, arguments, void 0, function (channelId, payload, opts) {
    var rest, body, route;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          body = { name: payload.name };
          if (payload.autoArchiveMinutes) {
            body.auto_archive_duration = payload.autoArchiveMinutes;
          }
          route = v10_1.Routes.threads(channelId, payload.messageId);
          return [4 /*yield*/, rest.post(route, { body: body })];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function listThreadsDiscord(payload_1) {
  return __awaiter(this, arguments, void 0, function (payload, opts) {
    var rest, params;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          if (!payload.includeArchived) {
            return [3 /*break*/, 2];
          }
          if (!payload.channelId) {
            throw new Error("channelId required to list archived threads");
          }
          params = {};
          if (payload.before) {
            params.before = payload.before;
          }
          if (payload.limit) {
            params.limit = payload.limit;
          }
          return [
            4 /*yield*/,
            rest.get(v10_1.Routes.channelThreads(payload.channelId, "public"), params),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
        case 2:
          return [4 /*yield*/, rest.get(v10_1.Routes.guildActiveThreads(payload.guildId))];
        case 3:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function searchMessagesDiscord(query_1) {
  return __awaiter(this, arguments, void 0, function (query, opts) {
    var rest, params, _i, _a, channelId, _b, _c, authorId, limit;
    var _d, _e;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          params = new URLSearchParams();
          params.set("content", query.content);
          if ((_d = query.channelIds) === null || _d === void 0 ? void 0 : _d.length) {
            for (_i = 0, _a = query.channelIds; _i < _a.length; _i++) {
              channelId = _a[_i];
              params.append("channel_id", channelId);
            }
          }
          if ((_e = query.authorIds) === null || _e === void 0 ? void 0 : _e.length) {
            for (_b = 0, _c = query.authorIds; _b < _c.length; _b++) {
              authorId = _c[_b];
              params.append("author_id", authorId);
            }
          }
          if (query.limit) {
            limit = Math.min(Math.max(Math.floor(query.limit), 1), 25);
            params.set("limit", String(limit));
          }
          return [
            4 /*yield*/,
            rest.get(
              "/guilds/".concat(query.guildId, "/messages/search?").concat(params.toString()),
            ),
          ];
        case 1:
          return [2 /*return*/, _f.sent()];
      }
    });
  });
}
