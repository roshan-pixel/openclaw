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
exports.listDiscordDirectoryGroupsLive = listDiscordDirectoryGroupsLive;
exports.listDiscordDirectoryPeersLive = listDiscordDirectoryPeersLive;
var accounts_js_1 = require("./accounts.js");
var api_js_1 = require("./api.js");
var allow_list_js_1 = require("./monitor/allow-list.js");
var token_js_1 = require("./token.js");
function normalizeQuery(value) {
  var _a;
  return (_a = value === null || value === void 0 ? void 0 : value.trim().toLowerCase()) !== null &&
    _a !== void 0
    ? _a
    : "";
}
function buildUserRank(user) {
  return user.bot ? 0 : 1;
}
function listDiscordDirectoryGroupsLive(params) {
  return __awaiter(this, void 0, void 0, function () {
    var account,
      token,
      query,
      guilds,
      rows,
      _i,
      guilds_1,
      guild,
      channels,
      _a,
      channels_1,
      channel,
      name_1;
    var _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          account = (0, accounts_js_1.resolveDiscordAccount)({
            cfg: params.cfg,
            accountId: params.accountId,
          });
          token = (0, token_js_1.normalizeDiscordToken)(account.token);
          if (!token) {
            return [2 /*return*/, []];
          }
          query = normalizeQuery(params.query);
          return [4 /*yield*/, (0, api_js_1.fetchDiscord)("/users/@me/guilds", token)];
        case 1:
          guilds = _c.sent();
          rows = [];
          ((_i = 0), (guilds_1 = guilds));
          _c.label = 2;
        case 2:
          if (!(_i < guilds_1.length)) {
            return [3 /*break*/, 5];
          }
          guild = guilds_1[_i];
          return [
            4 /*yield*/,
            (0, api_js_1.fetchDiscord)("/guilds/".concat(guild.id, "/channels"), token),
          ];
        case 3:
          channels = _c.sent();
          for (_a = 0, channels_1 = channels; _a < channels_1.length; _a++) {
            channel = channels_1[_a];
            name_1 = (_b = channel.name) === null || _b === void 0 ? void 0 : _b.trim();
            if (!name_1) {
              continue;
            }
            if (
              query &&
              !(0, allow_list_js_1.normalizeDiscordSlug)(name_1).includes(
                (0, allow_list_js_1.normalizeDiscordSlug)(query),
              )
            ) {
              continue;
            }
            rows.push({
              kind: "group",
              id: "channel:".concat(channel.id),
              name: name_1,
              handle: "#".concat(name_1),
              raw: channel,
            });
            if (
              typeof params.limit === "number" &&
              params.limit > 0 &&
              rows.length >= params.limit
            ) {
              return [2 /*return*/, rows];
            }
          }
          _c.label = 4;
        case 4:
          _i++;
          return [3 /*break*/, 2];
        case 5:
          return [2 /*return*/, rows];
      }
    });
  });
}
function listDiscordDirectoryPeersLive(params) {
  return __awaiter(this, void 0, void 0, function () {
    var account,
      token,
      query,
      guilds,
      rows,
      limit,
      _i,
      guilds_2,
      guild,
      paramsObj,
      members,
      _a,
      members_1,
      member,
      user,
      name_2;
    var _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          account = (0, accounts_js_1.resolveDiscordAccount)({
            cfg: params.cfg,
            accountId: params.accountId,
          });
          token = (0, token_js_1.normalizeDiscordToken)(account.token);
          if (!token) {
            return [2 /*return*/, []];
          }
          query = normalizeQuery(params.query);
          if (!query) {
            return [2 /*return*/, []];
          }
          return [4 /*yield*/, (0, api_js_1.fetchDiscord)("/users/@me/guilds", token)];
        case 1:
          guilds = _e.sent();
          rows = [];
          limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : 25;
          ((_i = 0), (guilds_2 = guilds));
          _e.label = 2;
        case 2:
          if (!(_i < guilds_2.length)) {
            return [3 /*break*/, 5];
          }
          guild = guilds_2[_i];
          paramsObj = new URLSearchParams({
            query: query,
            limit: String(Math.min(limit, 100)),
          });
          return [
            4 /*yield*/,
            (0, api_js_1.fetchDiscord)(
              "/guilds/".concat(guild.id, "/members/search?").concat(paramsObj.toString()),
              token,
            ),
          ];
        case 3:
          members = _e.sent();
          for (_a = 0, members_1 = members; _a < members_1.length; _a++) {
            member = members_1[_a];
            user = member.user;
            if (!(user === null || user === void 0 ? void 0 : user.id)) {
              continue;
            }
            name_2 =
              ((_b = member.nick) === null || _b === void 0 ? void 0 : _b.trim()) ||
              ((_c = user.global_name) === null || _c === void 0 ? void 0 : _c.trim()) ||
              ((_d = user.username) === null || _d === void 0 ? void 0 : _d.trim());
            rows.push({
              kind: "user",
              id: "user:".concat(user.id),
              name: name_2 || undefined,
              handle: user.username ? "@".concat(user.username) : undefined,
              rank: buildUserRank(user),
              raw: member,
            });
            if (rows.length >= limit) {
              return [2 /*return*/, rows];
            }
          }
          _e.label = 4;
        case 4:
          _i++;
          return [3 /*break*/, 2];
        case 5:
          return [2 /*return*/, rows];
      }
    });
  });
}
