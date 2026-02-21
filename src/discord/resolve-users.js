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
exports.resolveDiscordUserAllowlist = resolveDiscordUserAllowlist;
var api_js_1 = require("./api.js");
var allow_list_js_1 = require("./monitor/allow-list.js");
var token_js_1 = require("./token.js");
function parseDiscordUserInput(raw) {
  var _a;
  var trimmed = raw.trim();
  if (!trimmed) {
    return {};
  }
  var mention = trimmed.match(/^<@!?(\d+)>$/);
  if (mention) {
    return { userId: mention[1] };
  }
  var prefixed = trimmed.match(/^(?:user:|discord:)?(\d+)$/i);
  if (prefixed) {
    return { userId: prefixed[1] };
  }
  var split = trimmed.includes("/") ? trimmed.split("/") : trimmed.split("#");
  if (split.length >= 2) {
    var guild = (_a = split[0]) === null || _a === void 0 ? void 0 : _a.trim();
    var user = split.slice(1).join("#").trim();
    if (guild && /^\d+$/.test(guild)) {
      return { guildId: guild, userName: user };
    }
    return { guildName: guild, userName: user };
  }
  return { userName: trimmed.replace(/^@/, "") };
}
function listGuilds(token, fetcher) {
  return __awaiter(this, void 0, void 0, function () {
    var raw;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, api_js_1.fetchDiscord)("/users/@me/guilds", token, fetcher)];
        case 1:
          raw = _a.sent();
          return [
            2 /*return*/,
            raw.map(function (guild) {
              return {
                id: guild.id,
                name: guild.name,
                slug: (0, allow_list_js_1.normalizeDiscordSlug)(guild.name),
              };
            }),
          ];
      }
    });
  });
}
function scoreDiscordMember(member, query) {
  var _a;
  var q = query.toLowerCase();
  var user = member.user;
  var candidates = [
    user.username,
    user.global_name,
    (_a = member.nick) !== null && _a !== void 0 ? _a : undefined,
  ]
    .map(function (value) {
      return value === null || value === void 0 ? void 0 : value.toLowerCase();
    })
    .filter(Boolean);
  var score = 0;
  if (
    candidates.some(function (value) {
      return value === q;
    })
  ) {
    score += 3;
  }
  if (
    candidates.some(function (value) {
      return value === null || value === void 0 ? void 0 : value.includes(q);
    })
  ) {
    score += 1;
  }
  if (!user.bot) {
    score += 1;
  }
  return score;
}
function resolveDiscordUserAllowlist(params) {
  return __awaiter(this, void 0, void 0, function () {
    var token, fetcher, guilds, results, _loop_1, _i, _a, input;
    var _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          token = (0, token_js_1.normalizeDiscordToken)(params.token);
          if (!token) {
            return [
              2 /*return*/,
              params.entries.map(function (input) {
                return {
                  input: input,
                  resolved: false,
                };
              }),
            ];
          }
          fetcher = (_b = params.fetcher) !== null && _b !== void 0 ? _b : fetch;
          return [4 /*yield*/, listGuilds(token, fetcher)];
        case 1:
          guilds = _h.sent();
          results = [];
          _loop_1 = function (input) {
            var parsed,
              query,
              guildName,
              guildList,
              best,
              matches,
              _j,
              guildList_1,
              guild,
              paramsObj,
              members,
              _k,
              members_1,
              member,
              score,
              user,
              name_1;
            return __generator(this, function (_l) {
              switch (_l.label) {
                case 0:
                  parsed = parseDiscordUserInput(input);
                  if (parsed.userId) {
                    results.push({
                      input: input,
                      resolved: true,
                      id: parsed.userId,
                    });
                    return [2 /*return*/, "continue"];
                  }
                  query = (_c = parsed.userName) === null || _c === void 0 ? void 0 : _c.trim();
                  if (!query) {
                    results.push({ input: input, resolved: false });
                    return [2 /*return*/, "continue"];
                  }
                  guildName =
                    (_d = parsed.guildName) === null || _d === void 0 ? void 0 : _d.trim();
                  guildList = parsed.guildId
                    ? guilds.filter(function (g) {
                        return g.id === parsed.guildId;
                      })
                    : guildName
                      ? guilds.filter(function (g) {
                          return g.slug === (0, allow_list_js_1.normalizeDiscordSlug)(guildName);
                        })
                      : guilds;
                  best = null;
                  matches = 0;
                  ((_j = 0), (guildList_1 = guildList));
                  _l.label = 1;
                case 1:
                  if (!(_j < guildList_1.length)) {
                    return [3 /*break*/, 4];
                  }
                  guild = guildList_1[_j];
                  paramsObj = new URLSearchParams({
                    query: query,
                    limit: "25",
                  });
                  return [
                    4 /*yield*/,
                    (0, api_js_1.fetchDiscord)(
                      "/guilds/".concat(guild.id, "/members/search?").concat(paramsObj.toString()),
                      token,
                      fetcher,
                    ),
                  ];
                case 2:
                  members = _l.sent();
                  for (_k = 0, members_1 = members; _k < members_1.length; _k++) {
                    member = members_1[_k];
                    score = scoreDiscordMember(member, query);
                    if (score === 0) {
                      continue;
                    }
                    matches += 1;
                    if (!best || score > best.score) {
                      best = { member: member, guild: guild, score: score };
                    }
                  }
                  _l.label = 3;
                case 3:
                  _j++;
                  return [3 /*break*/, 1];
                case 4:
                  if (best) {
                    user = best.member.user;
                    name_1 =
                      ((_e = best.member.nick) === null || _e === void 0 ? void 0 : _e.trim()) ||
                      ((_f = user.global_name) === null || _f === void 0 ? void 0 : _f.trim()) ||
                      ((_g = user.username) === null || _g === void 0 ? void 0 : _g.trim()) ||
                      undefined;
                    results.push({
                      input: input,
                      resolved: true,
                      id: user.id,
                      name: name_1,
                      guildId: best.guild.id,
                      guildName: best.guild.name,
                      note: matches > 1 ? "multiple matches; chose best" : undefined,
                    });
                  } else {
                    results.push({ input: input, resolved: false });
                  }
                  return [2 /*return*/];
              }
            });
          };
          ((_i = 0), (_a = params.entries));
          _h.label = 2;
        case 2:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 5];
          }
          input = _a[_i];
          return [5 /*yield**/, _loop_1(input)];
        case 3:
          _h.sent();
          _h.label = 4;
        case 4:
          _i++;
          return [3 /*break*/, 2];
        case 5:
          return [2 /*return*/, results];
      }
    });
  });
}
