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
exports.collectDiscordAuditChannelIds = collectDiscordAuditChannelIds;
exports.auditDiscordChannelPermissions = auditDiscordChannelPermissions;
var accounts_js_1 = require("./accounts.js");
var send_js_1 = require("./send.js");
var REQUIRED_CHANNEL_PERMISSIONS = ["ViewChannel", "SendMessages"];
function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function shouldAuditChannelConfig(config) {
  if (!config) {
    return true;
  }
  if (config.allow === false) {
    return false;
  }
  if (config.enabled === false) {
    return false;
  }
  return true;
}
function listConfiguredGuildChannelKeys(guilds) {
  if (!guilds) {
    return [];
  }
  var ids = new Set();
  for (var _i = 0, _a = Object.values(guilds); _i < _a.length; _i++) {
    var entry = _a[_i];
    if (!entry || typeof entry !== "object") {
      continue;
    }
    var channelsRaw = entry.channels;
    if (!isRecord(channelsRaw)) {
      continue;
    }
    for (var _b = 0, _c = Object.entries(channelsRaw); _b < _c.length; _b++) {
      var _d = _c[_b],
        key = _d[0],
        value = _d[1];
      var channelId = String(key).trim();
      if (!channelId) {
        continue;
      }
      if (!shouldAuditChannelConfig(value)) {
        continue;
      }
      ids.add(channelId);
    }
  }
  return __spreadArray([], ids, true).toSorted(function (a, b) {
    return a.localeCompare(b);
  });
}
function collectDiscordAuditChannelIds(params) {
  var account = (0, accounts_js_1.resolveDiscordAccount)({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  var keys = listConfiguredGuildChannelKeys(account.config.guilds);
  var channelIds = keys.filter(function (key) {
    return /^\d+$/.test(key);
  });
  var unresolvedChannels = keys.length - channelIds.length;
  return { channelIds: channelIds, unresolvedChannels: unresolvedChannels };
}
function auditDiscordChannelPermissions(params) {
  return __awaiter(this, void 0, void 0, function () {
    var started, token, required, channels, _loop_1, _i, _a, channelId;
    var _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          started = Date.now();
          token =
            (_c = (_b = params.token) === null || _b === void 0 ? void 0 : _b.trim()) !== null &&
            _c !== void 0
              ? _c
              : "";
          if (!token || params.channelIds.length === 0) {
            return [
              2 /*return*/,
              {
                ok: true,
                checkedChannels: 0,
                unresolvedChannels: 0,
                channels: [],
                elapsedMs: Date.now() - started,
              },
            ];
          }
          required = __spreadArray([], REQUIRED_CHANNEL_PERMISSIONS, true);
          channels = [];
          _loop_1 = function (channelId) {
            var perms_1, missing, err_1;
            return __generator(this, function (_f) {
              switch (_f.label) {
                case 0:
                  _f.trys.push([0, 2, , 3]);
                  return [
                    4 /*yield*/,
                    (0, send_js_1.fetchChannelPermissionsDiscord)(channelId, {
                      token: token,
                      accountId: (_d = params.accountId) !== null && _d !== void 0 ? _d : undefined,
                    }),
                  ];
                case 1:
                  perms_1 = _f.sent();
                  missing = required.filter(function (p) {
                    return !perms_1.permissions.includes(p);
                  });
                  channels.push({
                    channelId: channelId,
                    ok: missing.length === 0,
                    missing: missing.length ? missing : undefined,
                    error: null,
                    matchKey: channelId,
                    matchSource: "id",
                  });
                  return [3 /*break*/, 3];
                case 2:
                  err_1 = _f.sent();
                  channels.push({
                    channelId: channelId,
                    ok: false,
                    error: err_1 instanceof Error ? err_1.message : String(err_1),
                    matchKey: channelId,
                    matchSource: "id",
                  });
                  return [3 /*break*/, 3];
                case 3:
                  return [2 /*return*/];
              }
            });
          };
          ((_i = 0), (_a = params.channelIds));
          _e.label = 1;
        case 1:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 4];
          }
          channelId = _a[_i];
          return [5 /*yield**/, _loop_1(channelId)];
        case 2:
          _e.sent();
          _e.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          return [
            2 /*return*/,
            {
              ok: channels.every(function (c) {
                return c.ok;
              }),
              checkedChannels: channels.length,
              unresolvedChannels: 0,
              channels: channels,
              elapsedMs: Date.now() - started,
            },
          ];
      }
    });
  });
}
