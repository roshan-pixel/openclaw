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
exports.createChannelDiscord = createChannelDiscord;
exports.editChannelDiscord = editChannelDiscord;
exports.deleteChannelDiscord = deleteChannelDiscord;
exports.moveChannelDiscord = moveChannelDiscord;
exports.setChannelPermissionDiscord = setChannelPermissionDiscord;
exports.removeChannelPermissionDiscord = removeChannelPermissionDiscord;
var v10_1 = require("discord-api-types/v10");
var send_shared_js_1 = require("./send.shared.js");
function createChannelDiscord(payload_1) {
  return __awaiter(this, arguments, void 0, function (payload, opts) {
    var rest, body;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          body = {
            name: payload.name,
          };
          if (payload.type !== undefined) {
            body.type = payload.type;
          }
          if (payload.parentId) {
            body.parent_id = payload.parentId;
          }
          if (payload.topic) {
            body.topic = payload.topic;
          }
          if (payload.position !== undefined) {
            body.position = payload.position;
          }
          if (payload.nsfw !== undefined) {
            body.nsfw = payload.nsfw;
          }
          return [
            4 /*yield*/,
            rest.post(v10_1.Routes.guildChannels(payload.guildId), {
              body: body,
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function editChannelDiscord(payload_1) {
  return __awaiter(this, arguments, void 0, function (payload, opts) {
    var rest, body;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          body = {};
          if (payload.name !== undefined) {
            body.name = payload.name;
          }
          if (payload.topic !== undefined) {
            body.topic = payload.topic;
          }
          if (payload.position !== undefined) {
            body.position = payload.position;
          }
          if (payload.parentId !== undefined) {
            body.parent_id = payload.parentId;
          }
          if (payload.nsfw !== undefined) {
            body.nsfw = payload.nsfw;
          }
          if (payload.rateLimitPerUser !== undefined) {
            body.rate_limit_per_user = payload.rateLimitPerUser;
          }
          return [
            4 /*yield*/,
            rest.patch(v10_1.Routes.channel(payload.channelId), {
              body: body,
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function deleteChannelDiscord(channelId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, opts) {
    var rest;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          return [4 /*yield*/, rest.delete(v10_1.Routes.channel(channelId))];
        case 1:
          _a.sent();
          return [2 /*return*/, { ok: true, channelId: channelId }];
      }
    });
  });
}
function moveChannelDiscord(payload_1) {
  return __awaiter(this, arguments, void 0, function (payload, opts) {
    var rest, body;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          body = [
            __assign(
              __assign(
                { id: payload.channelId },
                payload.parentId !== undefined && { parent_id: payload.parentId },
              ),
              payload.position !== undefined && { position: payload.position },
            ),
          ];
          return [
            4 /*yield*/,
            rest.patch(v10_1.Routes.guildChannels(payload.guildId), { body: body }),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/, { ok: true }];
      }
    });
  });
}
function setChannelPermissionDiscord(payload_1) {
  return __awaiter(this, arguments, void 0, function (payload, opts) {
    var rest, body;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
          body = {
            type: payload.targetType,
          };
          if (payload.allow !== undefined) {
            body.allow = payload.allow;
          }
          if (payload.deny !== undefined) {
            body.deny = payload.deny;
          }
          return [
            4 /*yield*/,
            rest.put(
              "/channels/".concat(payload.channelId, "/permissions/").concat(payload.targetId),
              { body: body },
            ),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/, { ok: true }];
      }
    });
  });
}
function removeChannelPermissionDiscord(channelId_1, targetId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, targetId, opts) {
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
            rest.delete("/channels/".concat(channelId, "/permissions/").concat(targetId)),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/, { ok: true }];
      }
    });
  });
}
