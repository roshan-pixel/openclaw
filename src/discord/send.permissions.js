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
exports.isThreadChannelType = isThreadChannelType;
exports.fetchChannelPermissionsDiscord = fetchChannelPermissionsDiscord;
var carbon_1 = require("@buape/carbon");
var v10_1 = require("discord-api-types/v10");
var config_js_1 = require("../config/config.js");
var accounts_js_1 = require("./accounts.js");
var token_js_1 = require("./token.js");
var PERMISSION_ENTRIES = Object.entries(v10_1.PermissionFlagsBits).filter(function (_a) {
  var value = _a[1];
  return typeof value === "bigint";
});
function resolveToken(params) {
  var explicit = (0, token_js_1.normalizeDiscordToken)(params.explicit);
  if (explicit) {
    return explicit;
  }
  var fallback = (0, token_js_1.normalizeDiscordToken)(params.fallbackToken);
  if (!fallback) {
    throw new Error(
      'Discord bot token missing for account "'
        .concat(params.accountId, '" (set discord.accounts.')
        .concat(params.accountId, ".token or DISCORD_BOT_TOKEN for default)."),
    );
  }
  return fallback;
}
function resolveRest(token, rest) {
  return rest !== null && rest !== void 0 ? rest : new carbon_1.RequestClient(token);
}
function resolveDiscordRest(opts) {
  var cfg = (0, config_js_1.loadConfig)();
  var account = (0, accounts_js_1.resolveDiscordAccount)({ cfg: cfg, accountId: opts.accountId });
  var token = resolveToken({
    explicit: opts.token,
    accountId: account.accountId,
    fallbackToken: account.token,
  });
  return resolveRest(token, opts.rest);
}
function addPermissionBits(base, add) {
  if (!add) {
    return base;
  }
  return base | BigInt(add);
}
function removePermissionBits(base, deny) {
  if (!deny) {
    return base;
  }
  return base & ~BigInt(deny);
}
function bitfieldToPermissions(bitfield) {
  return PERMISSION_ENTRIES.filter(function (_a) {
    var value = _a[1];
    return (bitfield & value) === value;
  })
    .map(function (_a) {
      var name = _a[0];
      return name;
    })
    .toSorted();
}
function isThreadChannelType(channelType) {
  return (
    channelType === v10_1.ChannelType.GuildNewsThread ||
    channelType === v10_1.ChannelType.GuildPublicThread ||
    channelType === v10_1.ChannelType.GuildPrivateThread
  );
}
function fetchBotUserId(rest) {
  return __awaiter(this, void 0, void 0, function () {
    var me;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, rest.get(v10_1.Routes.user("@me"))];
        case 1:
          me = _a.sent();
          if (!(me === null || me === void 0 ? void 0 : me.id)) {
            throw new Error("Failed to resolve bot user id");
          }
          return [2 /*return*/, me.id];
      }
    });
  });
}
function fetchChannelPermissionsDiscord(channelId_1) {
  return __awaiter(this, arguments, void 0, function (channelId, opts) {
    var rest,
      channel,
      channelType,
      guildId,
      botId,
      _a,
      guild,
      member,
      rolesById,
      everyoneRole,
      base,
      _i,
      _b,
      roleId,
      role,
      permissions,
      overwrites,
      _c,
      overwrites_1,
      overwrite,
      _d,
      overwrites_2,
      overwrite,
      _e,
      overwrites_3,
      overwrite;
    var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_r) {
      switch (_r.label) {
        case 0:
          rest = resolveDiscordRest(opts);
          return [4 /*yield*/, rest.get(v10_1.Routes.channel(channelId))];
        case 1:
          channel = _r.sent();
          channelType = "type" in channel ? channel.type : undefined;
          guildId = "guild_id" in channel ? channel.guild_id : undefined;
          if (!guildId) {
            return [
              2 /*return*/,
              {
                channelId: channelId,
                permissions: [],
                raw: "0",
                isDm: true,
                channelType: channelType,
              },
            ];
          }
          return [4 /*yield*/, fetchBotUserId(rest)];
        case 2:
          botId = _r.sent();
          return [
            4 /*yield*/,
            Promise.all([
              rest.get(v10_1.Routes.guild(guildId)),
              rest.get(v10_1.Routes.guildMember(guildId, botId)),
            ]),
          ];
        case 3:
          ((_a = _r.sent()), (guild = _a[0]), (member = _a[1]));
          rolesById = new Map(
            ((_f = guild.roles) !== null && _f !== void 0 ? _f : []).map(function (role) {
              return [role.id, role];
            }),
          );
          everyoneRole = rolesById.get(guildId);
          base = 0n;
          if (
            everyoneRole === null || everyoneRole === void 0 ? void 0 : everyoneRole.permissions
          ) {
            base = addPermissionBits(base, everyoneRole.permissions);
          }
          for (
            _i = 0, _b = (_g = member.roles) !== null && _g !== void 0 ? _g : [];
            _i < _b.length;
            _i++
          ) {
            roleId = _b[_i];
            role = rolesById.get(roleId);
            if (role === null || role === void 0 ? void 0 : role.permissions) {
              base = addPermissionBits(base, role.permissions);
            }
          }
          permissions = base;
          overwrites =
            "permission_overwrites" in channel
              ? (_h = channel.permission_overwrites) !== null && _h !== void 0
                ? _h
                : []
              : [];
          for (_c = 0, overwrites_1 = overwrites; _c < overwrites_1.length; _c++) {
            overwrite = overwrites_1[_c];
            if (overwrite.id === guildId) {
              permissions = removePermissionBits(
                permissions,
                (_j = overwrite.deny) !== null && _j !== void 0 ? _j : "0",
              );
              permissions = addPermissionBits(
                permissions,
                (_k = overwrite.allow) !== null && _k !== void 0 ? _k : "0",
              );
            }
          }
          for (_d = 0, overwrites_2 = overwrites; _d < overwrites_2.length; _d++) {
            overwrite = overwrites_2[_d];
            if (
              (_l = member.roles) === null || _l === void 0 ? void 0 : _l.includes(overwrite.id)
            ) {
              permissions = removePermissionBits(
                permissions,
                (_m = overwrite.deny) !== null && _m !== void 0 ? _m : "0",
              );
              permissions = addPermissionBits(
                permissions,
                (_o = overwrite.allow) !== null && _o !== void 0 ? _o : "0",
              );
            }
          }
          for (_e = 0, overwrites_3 = overwrites; _e < overwrites_3.length; _e++) {
            overwrite = overwrites_3[_e];
            if (overwrite.id === botId) {
              permissions = removePermissionBits(
                permissions,
                (_p = overwrite.deny) !== null && _p !== void 0 ? _p : "0",
              );
              permissions = addPermissionBits(
                permissions,
                (_q = overwrite.allow) !== null && _q !== void 0 ? _q : "0",
              );
            }
          }
          return [
            2 /*return*/,
            {
              channelId: channelId,
              guildId: guildId,
              permissions: bitfieldToPermissions(permissions),
              raw: permissions.toString(),
              isDm: false,
              channelType: channelType,
            },
          ];
      }
    });
  });
}
