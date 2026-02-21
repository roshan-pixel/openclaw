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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSlackDirectoryPeersFromConfig = listSlackDirectoryPeersFromConfig;
exports.listSlackDirectoryGroupsFromConfig = listSlackDirectoryGroupsFromConfig;
exports.listDiscordDirectoryPeersFromConfig = listDiscordDirectoryPeersFromConfig;
exports.listDiscordDirectoryGroupsFromConfig = listDiscordDirectoryGroupsFromConfig;
exports.listTelegramDirectoryPeersFromConfig = listTelegramDirectoryPeersFromConfig;
exports.listTelegramDirectoryGroupsFromConfig = listTelegramDirectoryGroupsFromConfig;
exports.listWhatsAppDirectoryPeersFromConfig = listWhatsAppDirectoryPeersFromConfig;
exports.listWhatsAppDirectoryGroupsFromConfig = listWhatsAppDirectoryGroupsFromConfig;
var accounts_js_1 = require("../../slack/accounts.js");
var accounts_js_2 = require("../../discord/accounts.js");
var accounts_js_3 = require("../../telegram/accounts.js");
var accounts_js_4 = require("../../web/accounts.js");
var slack_js_1 = require("./normalize/slack.js");
var normalize_js_1 = require("../../whatsapp/normalize.js");
function listSlackDirectoryPeersFromConfig(params) {
  return __awaiter(this, void 0, void 0, function () {
    var account,
      q,
      ids,
      _i,
      _a,
      entry,
      raw,
      _b,
      _c,
      id,
      trimmed,
      _d,
      _e,
      channel,
      _f,
      _g,
      user,
      raw;
    var _h, _j, _k, _l, _m, _o;
    return __generator(this, function (_p) {
      account = (0, accounts_js_1.resolveSlackAccount)({
        cfg: params.cfg,
        accountId: params.accountId,
      });
      q = ((_h = params.query) === null || _h === void 0 ? void 0 : _h.trim().toLowerCase()) || "";
      ids = new Set();
      for (
        _i = 0,
          _a =
            (_k = (_j = account.dm) === null || _j === void 0 ? void 0 : _j.allowFrom) !== null &&
            _k !== void 0
              ? _k
              : [];
        _i < _a.length;
        _i++
      ) {
        entry = _a[_i];
        raw = String(entry).trim();
        if (!raw || raw === "*") {
          continue;
        }
        ids.add(raw);
      }
      for (
        _b = 0, _c = Object.keys((_l = account.config.dms) !== null && _l !== void 0 ? _l : {});
        _b < _c.length;
        _b++
      ) {
        id = _c[_b];
        trimmed = id.trim();
        if (trimmed) {
          ids.add(trimmed);
        }
      }
      for (
        _d = 0,
          _e = Object.values((_m = account.config.channels) !== null && _m !== void 0 ? _m : {});
        _d < _e.length;
        _d++
      ) {
        channel = _e[_d];
        for (
          _f = 0, _g = (_o = channel.users) !== null && _o !== void 0 ? _o : [];
          _f < _g.length;
          _f++
        ) {
          user = _g[_f];
          raw = String(user).trim();
          if (raw) {
            ids.add(raw);
          }
        }
      }
      return [
        2 /*return*/,
        Array.from(ids)
          .map(function (raw) {
            return raw.trim();
          })
          .filter(Boolean)
          .map(function (raw) {
            var _a, _b;
            var mention = raw.match(/^<@([A-Z0-9]+)>$/i);
            var normalizedUserId = (
              (_a = mention === null || mention === void 0 ? void 0 : mention[1]) !== null &&
              _a !== void 0
                ? _a
                : raw
            )
              .replace(/^(slack|user):/i, "")
              .trim();
            if (!normalizedUserId) {
              return null;
            }
            var target = "user:".concat(normalizedUserId);
            return (_b = (0, slack_js_1.normalizeSlackMessagingTarget)(target)) !== null &&
              _b !== void 0
              ? _b
              : target.toLowerCase();
          })
          .filter(function (id) {
            return Boolean(id);
          })
          .filter(function (id) {
            return id.startsWith("user:");
          })
          .filter(function (id) {
            return q ? id.toLowerCase().includes(q) : true;
          })
          .slice(0, params.limit && params.limit > 0 ? params.limit : undefined)
          .map(function (id) {
            return { kind: "user", id: id };
          }),
      ];
    });
  });
}
function listSlackDirectoryGroupsFromConfig(params) {
  return __awaiter(this, void 0, void 0, function () {
    var account, q;
    var _a, _b;
    return __generator(this, function (_c) {
      account = (0, accounts_js_1.resolveSlackAccount)({
        cfg: params.cfg,
        accountId: params.accountId,
      });
      q = ((_a = params.query) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) || "";
      return [
        2 /*return*/,
        Object.keys((_b = account.config.channels) !== null && _b !== void 0 ? _b : {})
          .map(function (raw) {
            return raw.trim();
          })
          .filter(Boolean)
          .map(function (raw) {
            var _a;
            return (_a = (0, slack_js_1.normalizeSlackMessagingTarget)(raw)) !== null &&
              _a !== void 0
              ? _a
              : raw.toLowerCase();
          })
          .filter(function (id) {
            return id.startsWith("channel:");
          })
          .filter(function (id) {
            return q ? id.toLowerCase().includes(q) : true;
          })
          .slice(0, params.limit && params.limit > 0 ? params.limit : undefined)
          .map(function (id) {
            return { kind: "group", id: id };
          }),
      ];
    });
  });
}
function listDiscordDirectoryPeersFromConfig(params) {
  return __awaiter(this, void 0, void 0, function () {
    var account,
      q,
      ids,
      _i,
      _a,
      entry,
      raw,
      _b,
      _c,
      id,
      trimmed,
      _d,
      _e,
      guild,
      _f,
      _g,
      entry,
      raw,
      _h,
      _j,
      channel,
      _k,
      _l,
      user,
      raw;
    var _m, _o, _p, _q, _r, _s, _t, _u;
    return __generator(this, function (_v) {
      account = (0, accounts_js_2.resolveDiscordAccount)({
        cfg: params.cfg,
        accountId: params.accountId,
      });
      q = ((_m = params.query) === null || _m === void 0 ? void 0 : _m.trim().toLowerCase()) || "";
      ids = new Set();
      for (
        _i = 0,
          _a =
            (_p = (_o = account.config.dm) === null || _o === void 0 ? void 0 : _o.allowFrom) !==
              null && _p !== void 0
              ? _p
              : [];
        _i < _a.length;
        _i++
      ) {
        entry = _a[_i];
        raw = String(entry).trim();
        if (!raw || raw === "*") {
          continue;
        }
        ids.add(raw);
      }
      for (
        _b = 0, _c = Object.keys((_q = account.config.dms) !== null && _q !== void 0 ? _q : {});
        _b < _c.length;
        _b++
      ) {
        id = _c[_b];
        trimmed = id.trim();
        if (trimmed) {
          ids.add(trimmed);
        }
      }
      for (
        _d = 0,
          _e = Object.values((_r = account.config.guilds) !== null && _r !== void 0 ? _r : {});
        _d < _e.length;
        _d++
      ) {
        guild = _e[_d];
        for (
          _f = 0, _g = (_s = guild.users) !== null && _s !== void 0 ? _s : [];
          _f < _g.length;
          _f++
        ) {
          entry = _g[_f];
          raw = String(entry).trim();
          if (raw) {
            ids.add(raw);
          }
        }
        for (
          _h = 0, _j = Object.values((_t = guild.channels) !== null && _t !== void 0 ? _t : {});
          _h < _j.length;
          _h++
        ) {
          channel = _j[_h];
          for (
            _k = 0, _l = (_u = channel.users) !== null && _u !== void 0 ? _u : [];
            _k < _l.length;
            _k++
          ) {
            user = _l[_k];
            raw = String(user).trim();
            if (raw) {
              ids.add(raw);
            }
          }
        }
      }
      return [
        2 /*return*/,
        Array.from(ids)
          .map(function (raw) {
            return raw.trim();
          })
          .filter(Boolean)
          .map(function (raw) {
            var _a;
            var mention = raw.match(/^<@!?(\d+)>$/);
            var cleaned = (
              (_a = mention === null || mention === void 0 ? void 0 : mention[1]) !== null &&
              _a !== void 0
                ? _a
                : raw
            )
              .replace(/^(discord|user):/i, "")
              .trim();
            if (!/^\d+$/.test(cleaned)) {
              return null;
            }
            return "user:".concat(cleaned);
          })
          .filter(function (id) {
            return Boolean(id);
          })
          .filter(function (id) {
            return q ? id.toLowerCase().includes(q) : true;
          })
          .slice(0, params.limit && params.limit > 0 ? params.limit : undefined)
          .map(function (id) {
            return { kind: "user", id: id };
          }),
      ];
    });
  });
}
function listDiscordDirectoryGroupsFromConfig(params) {
  return __awaiter(this, void 0, void 0, function () {
    var account, q, ids, _i, _a, guild, _b, _c, channelId, trimmed;
    var _d, _e, _f;
    return __generator(this, function (_g) {
      account = (0, accounts_js_2.resolveDiscordAccount)({
        cfg: params.cfg,
        accountId: params.accountId,
      });
      q = ((_d = params.query) === null || _d === void 0 ? void 0 : _d.trim().toLowerCase()) || "";
      ids = new Set();
      for (
        _i = 0,
          _a = Object.values((_e = account.config.guilds) !== null && _e !== void 0 ? _e : {});
        _i < _a.length;
        _i++
      ) {
        guild = _a[_i];
        for (
          _b = 0, _c = Object.keys((_f = guild.channels) !== null && _f !== void 0 ? _f : {});
          _b < _c.length;
          _b++
        ) {
          channelId = _c[_b];
          trimmed = channelId.trim();
          if (trimmed) {
            ids.add(trimmed);
          }
        }
      }
      return [
        2 /*return*/,
        Array.from(ids)
          .map(function (raw) {
            return raw.trim();
          })
          .filter(Boolean)
          .map(function (raw) {
            var _a;
            var mention = raw.match(/^<#(\d+)>$/);
            var cleaned = (
              (_a = mention === null || mention === void 0 ? void 0 : mention[1]) !== null &&
              _a !== void 0
                ? _a
                : raw
            )
              .replace(/^(discord|channel|group):/i, "")
              .trim();
            if (!/^\d+$/.test(cleaned)) {
              return null;
            }
            return "channel:".concat(cleaned);
          })
          .filter(function (id) {
            return Boolean(id);
          })
          .filter(function (id) {
            return q ? id.toLowerCase().includes(q) : true;
          })
          .slice(0, params.limit && params.limit > 0 ? params.limit : undefined)
          .map(function (id) {
            return { kind: "group", id: id };
          }),
      ];
    });
  });
}
function listTelegramDirectoryPeersFromConfig(params) {
  return __awaiter(this, void 0, void 0, function () {
    var account, q, raw;
    var _a, _b, _c;
    return __generator(this, function (_d) {
      account = (0, accounts_js_3.resolveTelegramAccount)({
        cfg: params.cfg,
        accountId: params.accountId,
      });
      q = ((_a = params.query) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) || "";
      raw = __spreadArray(
        __spreadArray(
          [],
          ((_b = account.config.allowFrom) !== null && _b !== void 0 ? _b : []).map(
            function (entry) {
              return String(entry);
            },
          ),
          true,
        ),
        Object.keys((_c = account.config.dms) !== null && _c !== void 0 ? _c : {}),
        true,
      );
      return [
        2 /*return*/,
        Array.from(
          new Set(
            raw
              .map(function (entry) {
                return entry.trim();
              })
              .filter(Boolean)
              .map(function (entry) {
                return entry.replace(/^(telegram|tg):/i, "");
              }),
          ),
        )
          .map(function (entry) {
            var trimmed = entry.trim();
            if (!trimmed) {
              return null;
            }
            if (/^-?\d+$/.test(trimmed)) {
              return trimmed;
            }
            var withAt = trimmed.startsWith("@") ? trimmed : "@".concat(trimmed);
            return withAt;
          })
          .filter(function (id) {
            return Boolean(id);
          })
          .filter(function (id) {
            return q ? id.toLowerCase().includes(q) : true;
          })
          .slice(0, params.limit && params.limit > 0 ? params.limit : undefined)
          .map(function (id) {
            return { kind: "user", id: id };
          }),
      ];
    });
  });
}
function listTelegramDirectoryGroupsFromConfig(params) {
  return __awaiter(this, void 0, void 0, function () {
    var account, q;
    var _a, _b;
    return __generator(this, function (_c) {
      account = (0, accounts_js_3.resolveTelegramAccount)({
        cfg: params.cfg,
        accountId: params.accountId,
      });
      q = ((_a = params.query) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) || "";
      return [
        2 /*return*/,
        Object.keys((_b = account.config.groups) !== null && _b !== void 0 ? _b : {})
          .map(function (id) {
            return id.trim();
          })
          .filter(function (id) {
            return Boolean(id) && id !== "*";
          })
          .filter(function (id) {
            return q ? id.toLowerCase().includes(q) : true;
          })
          .slice(0, params.limit && params.limit > 0 ? params.limit : undefined)
          .map(function (id) {
            return { kind: "group", id: id };
          }),
      ];
    });
  });
}
function listWhatsAppDirectoryPeersFromConfig(params) {
  return __awaiter(this, void 0, void 0, function () {
    var account, q;
    var _a, _b;
    return __generator(this, function (_c) {
      account = (0, accounts_js_4.resolveWhatsAppAccount)({
        cfg: params.cfg,
        accountId: params.accountId,
      });
      q = ((_a = params.query) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) || "";
      return [
        2 /*return*/,
        ((_b = account.allowFrom) !== null && _b !== void 0 ? _b : [])
          .map(function (entry) {
            return String(entry).trim();
          })
          .filter(function (entry) {
            return Boolean(entry) && entry !== "*";
          })
          .map(function (entry) {
            var _a;
            return (_a = (0, normalize_js_1.normalizeWhatsAppTarget)(entry)) !== null &&
              _a !== void 0
              ? _a
              : "";
          })
          .filter(Boolean)
          .filter(function (id) {
            return !(0, normalize_js_1.isWhatsAppGroupJid)(id);
          })
          .filter(function (id) {
            return q ? id.toLowerCase().includes(q) : true;
          })
          .slice(0, params.limit && params.limit > 0 ? params.limit : undefined)
          .map(function (id) {
            return { kind: "user", id: id };
          }),
      ];
    });
  });
}
function listWhatsAppDirectoryGroupsFromConfig(params) {
  return __awaiter(this, void 0, void 0, function () {
    var account, q;
    var _a, _b;
    return __generator(this, function (_c) {
      account = (0, accounts_js_4.resolveWhatsAppAccount)({
        cfg: params.cfg,
        accountId: params.accountId,
      });
      q = ((_a = params.query) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) || "";
      return [
        2 /*return*/,
        Object.keys((_b = account.groups) !== null && _b !== void 0 ? _b : {})
          .map(function (id) {
            return id.trim();
          })
          .filter(function (id) {
            return Boolean(id) && id !== "*";
          })
          .filter(function (id) {
            return q ? id.toLowerCase().includes(q) : true;
          })
          .slice(0, params.limit && params.limit > 0 ? params.limit : undefined)
          .map(function (id) {
            return { kind: "group", id: id };
          }),
      ];
    });
  });
}
