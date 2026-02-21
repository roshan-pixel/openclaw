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
exports.resolveSlackUserAllowlist = resolveSlackUserAllowlist;
var client_js_1 = require("./client.js");
function parseSlackUserInput(raw) {
  var _a;
  var trimmed = raw.trim();
  if (!trimmed) {
    return {};
  }
  var mention = trimmed.match(/^<@([A-Z0-9]+)>$/i);
  if (mention) {
    return { id: (_a = mention[1]) === null || _a === void 0 ? void 0 : _a.toUpperCase() };
  }
  var prefixed = trimmed.replace(/^(slack:|user:)/i, "");
  if (/^[A-Z][A-Z0-9]+$/i.test(prefixed)) {
    return { id: prefixed.toUpperCase() };
  }
  if (trimmed.includes("@") && !trimmed.startsWith("@")) {
    return { email: trimmed.toLowerCase() };
  }
  var name = trimmed.replace(/^@/, "").trim();
  return name ? { name: name } : {};
}
function listSlackUsers(client) {
  return __awaiter(this, void 0, void 0, function () {
    var users, cursor, res, _i, _a, member, id, name_1, profile, next;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return __generator(this, function (_o) {
      switch (_o.label) {
        case 0:
          users = [];
          _o.label = 1;
        case 1:
          return [
            4 /*yield*/,
            client.users.list({
              limit: 200,
              cursor: cursor,
            }),
          ];
        case 2:
          res = _o.sent();
          for (
            _i = 0, _a = (_b = res.members) !== null && _b !== void 0 ? _b : [];
            _i < _a.length;
            _i++
          ) {
            member = _a[_i];
            id = (_c = member.id) === null || _c === void 0 ? void 0 : _c.trim();
            name_1 = (_d = member.name) === null || _d === void 0 ? void 0 : _d.trim();
            if (!id || !name_1) {
              continue;
            }
            profile = (_e = member.profile) !== null && _e !== void 0 ? _e : {};
            users.push({
              id: id,
              name: name_1,
              displayName:
                ((_f = profile.display_name) === null || _f === void 0 ? void 0 : _f.trim()) ||
                undefined,
              realName:
                ((_g = profile.real_name) === null || _g === void 0 ? void 0 : _g.trim()) ||
                ((_h = member.real_name) === null || _h === void 0 ? void 0 : _h.trim()) ||
                undefined,
              email:
                ((_k = (_j = profile.email) === null || _j === void 0 ? void 0 : _j.trim()) ===
                  null || _k === void 0
                  ? void 0
                  : _k.toLowerCase()) || undefined,
              deleted: Boolean(member.deleted),
              isBot: Boolean(member.is_bot),
              isAppUser: Boolean(member.is_app_user),
            });
          }
          next =
            (_m =
              (_l = res.response_metadata) === null || _l === void 0 ? void 0 : _l.next_cursor) ===
              null || _m === void 0
              ? void 0
              : _m.trim();
          cursor = next ? next : undefined;
          _o.label = 3;
        case 3:
          if (cursor) {
            return [3 /*break*/, 1];
          }
          _o.label = 4;
        case 4:
          return [2 /*return*/, users];
      }
    });
  });
}
function scoreSlackUser(user, match) {
  var score = 0;
  if (!user.deleted) {
    score += 3;
  }
  if (!user.isBot && !user.isAppUser) {
    score += 2;
  }
  if (match.email && user.email === match.email) {
    score += 5;
  }
  if (match.name) {
    var target_1 = match.name.toLowerCase();
    var candidates = [user.name, user.displayName, user.realName]
      .map(function (value) {
        return value === null || value === void 0 ? void 0 : value.toLowerCase();
      })
      .filter(Boolean);
    if (
      candidates.some(function (value) {
        return value === target_1;
      })
    ) {
      score += 2;
    }
  }
  return score;
}
function resolveSlackUserAllowlist(params) {
  return __awaiter(this, void 0, void 0, function () {
    var client, users, results, _loop_1, _i, _a, input;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return __generator(this, function (_o) {
      switch (_o.label) {
        case 0:
          client =
            (_b = params.client) !== null && _b !== void 0
              ? _b
              : (0, client_js_1.createSlackWebClient)(params.token);
          return [4 /*yield*/, listSlackUsers(client)];
        case 1:
          users = _o.sent();
          results = [];
          _loop_1 = function (input) {
            var parsed = parseSlackUserInput(input);
            if (parsed.id) {
              var match = users.find(function (user) {
                return user.id === parsed.id;
              });
              results.push({
                input: input,
                resolved: true,
                id: parsed.id,
                name:
                  (_d =
                    (_c = match === null || match === void 0 ? void 0 : match.displayName) !==
                      null && _c !== void 0
                      ? _c
                      : match === null || match === void 0
                        ? void 0
                        : match.realName) !== null && _d !== void 0
                    ? _d
                    : match === null || match === void 0
                      ? void 0
                      : match.name,
                email: match === null || match === void 0 ? void 0 : match.email,
                deleted: match === null || match === void 0 ? void 0 : match.deleted,
                isBot: match === null || match === void 0 ? void 0 : match.isBot,
              });
              return "continue";
            }
            if (parsed.email) {
              var matches = users.filter(function (user) {
                return user.email === parsed.email;
              });
              if (matches.length > 0) {
                var scored = matches
                  .map(function (user) {
                    return { user: user, score: scoreSlackUser(user, parsed) };
                  })
                  .toSorted(function (a, b) {
                    return b.score - a.score;
                  });
                var best =
                  (_f = (_e = scored[0]) === null || _e === void 0 ? void 0 : _e.user) !== null &&
                  _f !== void 0
                    ? _f
                    : matches[0];
                results.push({
                  input: input,
                  resolved: true,
                  id: best.id,
                  name:
                    (_h =
                      (_g = best.displayName) !== null && _g !== void 0 ? _g : best.realName) !==
                      null && _h !== void 0
                      ? _h
                      : best.name,
                  email: best.email,
                  deleted: best.deleted,
                  isBot: best.isBot,
                  note: matches.length > 1 ? "multiple matches; chose best" : undefined,
                });
                return "continue";
              }
            }
            if (parsed.name) {
              var target_2 = parsed.name.toLowerCase();
              var matches = users.filter(function (user) {
                var candidates = [user.name, user.displayName, user.realName]
                  .map(function (value) {
                    return value === null || value === void 0 ? void 0 : value.toLowerCase();
                  })
                  .filter(Boolean);
                return candidates.includes(target_2);
              });
              if (matches.length > 0) {
                var scored = matches
                  .map(function (user) {
                    return { user: user, score: scoreSlackUser(user, parsed) };
                  })
                  .toSorted(function (a, b) {
                    return b.score - a.score;
                  });
                var best =
                  (_k = (_j = scored[0]) === null || _j === void 0 ? void 0 : _j.user) !== null &&
                  _k !== void 0
                    ? _k
                    : matches[0];
                results.push({
                  input: input,
                  resolved: true,
                  id: best.id,
                  name:
                    (_m =
                      (_l = best.displayName) !== null && _l !== void 0 ? _l : best.realName) !==
                      null && _m !== void 0
                      ? _m
                      : best.name,
                  email: best.email,
                  deleted: best.deleted,
                  isBot: best.isBot,
                  note: matches.length > 1 ? "multiple matches; chose best" : undefined,
                });
                return "continue";
              }
            }
            results.push({ input: input, resolved: false });
          };
          for (_i = 0, _a = params.entries; _i < _a.length; _i++) {
            input = _a[_i];
            _loop_1(input);
          }
          return [2 /*return*/, results];
      }
    });
  });
}
