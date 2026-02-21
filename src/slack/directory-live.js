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
exports.listSlackDirectoryPeersLive = listSlackDirectoryPeersLive;
exports.listSlackDirectoryGroupsLive = listSlackDirectoryGroupsLive;
var client_js_1 = require("./client.js");
var accounts_js_1 = require("./accounts.js");
function resolveReadToken(params) {
  var _a, _b;
  var account = (0, accounts_js_1.resolveSlackAccount)({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  var userToken =
    ((_a = account.config.userToken) === null || _a === void 0 ? void 0 : _a.trim()) || undefined;
  return userToken !== null && userToken !== void 0
    ? userToken
    : (_b = account.botToken) === null || _b === void 0
      ? void 0
      : _b.trim();
}
function normalizeQuery(value) {
  var _a;
  return (_a = value === null || value === void 0 ? void 0 : value.trim().toLowerCase()) !== null &&
    _a !== void 0
    ? _a
    : "";
}
function buildUserRank(user) {
  var rank = 0;
  if (!user.deleted) {
    rank += 2;
  }
  if (!user.is_bot && !user.is_app_user) {
    rank += 1;
  }
  return rank;
}
function buildChannelRank(channel) {
  return channel.is_archived ? 0 : 1;
}
function listSlackDirectoryPeersLive(params) {
  return __awaiter(this, void 0, void 0, function () {
    var token, client, query, members, cursor, res, next, filtered, rows;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          token = resolveReadToken(params);
          if (!token) {
            return [2 /*return*/, []];
          }
          client = (0, client_js_1.createSlackWebClient)(token);
          query = normalizeQuery(params.query);
          members = [];
          _c.label = 1;
        case 1:
          return [
            4 /*yield*/,
            client.users.list({
              limit: 200,
              cursor: cursor,
            }),
          ];
        case 2:
          res = _c.sent();
          if (Array.isArray(res.members)) {
            members.push.apply(members, res.members);
          }
          next =
            (_b =
              (_a = res.response_metadata) === null || _a === void 0 ? void 0 : _a.next_cursor) ===
              null || _b === void 0
              ? void 0
              : _b.trim();
          cursor = next ? next : undefined;
          _c.label = 3;
        case 3:
          if (cursor) {
            return [3 /*break*/, 1];
          }
          _c.label = 4;
        case 4:
          filtered = members.filter(function (member) {
            var _a, _b, _c;
            var name =
              ((_a = member.profile) === null || _a === void 0 ? void 0 : _a.display_name) ||
              ((_b = member.profile) === null || _b === void 0 ? void 0 : _b.real_name) ||
              member.real_name;
            var handle = member.name;
            var email = (_c = member.profile) === null || _c === void 0 ? void 0 : _c.email;
            var candidates = [name, handle, email]
              .map(function (item) {
                return item === null || item === void 0 ? void 0 : item.trim().toLowerCase();
              })
              .filter(Boolean);
            if (!query) {
              return true;
            }
            return candidates.some(function (candidate) {
              return candidate === null || candidate === void 0
                ? void 0
                : candidate.includes(query);
            });
          });
          rows = filtered
            .map(function (member) {
              var _a, _b, _c, _d, _e, _f, _g;
              var id = (_a = member.id) === null || _a === void 0 ? void 0 : _a.trim();
              if (!id) {
                return null;
              }
              var handle = (_b = member.name) === null || _b === void 0 ? void 0 : _b.trim();
              var display =
                ((_d =
                  (_c = member.profile) === null || _c === void 0 ? void 0 : _c.display_name) ===
                  null || _d === void 0
                  ? void 0
                  : _d.trim()) ||
                ((_f = (_e = member.profile) === null || _e === void 0 ? void 0 : _e.real_name) ===
                  null || _f === void 0
                  ? void 0
                  : _f.trim()) ||
                ((_g = member.real_name) === null || _g === void 0 ? void 0 : _g.trim()) ||
                handle;
              return {
                kind: "user",
                id: "user:".concat(id),
                name: display || undefined,
                handle: handle ? "@".concat(handle) : undefined,
                rank: buildUserRank(member),
                raw: member,
              };
            })
            .filter(Boolean);
          if (typeof params.limit === "number" && params.limit > 0) {
            return [2 /*return*/, rows.slice(0, params.limit)];
          }
          return [2 /*return*/, rows];
      }
    });
  });
}
function listSlackDirectoryGroupsLive(params) {
  return __awaiter(this, void 0, void 0, function () {
    var token, client, query, channels, cursor, res, next, filtered, rows;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          token = resolveReadToken(params);
          if (!token) {
            return [2 /*return*/, []];
          }
          client = (0, client_js_1.createSlackWebClient)(token);
          query = normalizeQuery(params.query);
          channels = [];
          _c.label = 1;
        case 1:
          return [
            4 /*yield*/,
            client.conversations.list({
              types: "public_channel,private_channel",
              exclude_archived: false,
              limit: 1000,
              cursor: cursor,
            }),
          ];
        case 2:
          res = _c.sent();
          if (Array.isArray(res.channels)) {
            channels.push.apply(channels, res.channels);
          }
          next =
            (_b =
              (_a = res.response_metadata) === null || _a === void 0 ? void 0 : _a.next_cursor) ===
              null || _b === void 0
              ? void 0
              : _b.trim();
          cursor = next ? next : undefined;
          _c.label = 3;
        case 3:
          if (cursor) {
            return [3 /*break*/, 1];
          }
          _c.label = 4;
        case 4:
          filtered = channels.filter(function (channel) {
            var _a;
            var name =
              (_a = channel.name) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
            if (!query) {
              return true;
            }
            return Boolean(name && name.includes(query));
          });
          rows = filtered
            .map(function (channel) {
              var _a, _b;
              var id = (_a = channel.id) === null || _a === void 0 ? void 0 : _a.trim();
              var name = (_b = channel.name) === null || _b === void 0 ? void 0 : _b.trim();
              if (!id || !name) {
                return null;
              }
              return {
                kind: "group",
                id: "channel:".concat(id),
                name: name,
                handle: "#".concat(name),
                rank: buildChannelRank(channel),
                raw: channel,
              };
            })
            .filter(Boolean);
          if (typeof params.limit === "number" && params.limit > 0) {
            return [2 /*return*/, rows.slice(0, params.limit)];
          }
          return [2 /*return*/, rows];
      }
    });
  });
}
