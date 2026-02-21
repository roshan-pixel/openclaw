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
exports.resolveDiscordChannelAllowlist = resolveDiscordChannelAllowlist;
var api_js_1 = require("./api.js");
var allow_list_js_1 = require("./monitor/allow-list.js");
var token_js_1 = require("./token.js");
function parseDiscordChannelInput(raw) {
  var _a;
  var trimmed = raw.trim();
  if (!trimmed) {
    return {};
  }
  var mention = trimmed.match(/^<#(\d+)>$/);
  if (mention) {
    return { channelId: mention[1] };
  }
  var channelPrefix = trimmed.match(/^(?:channel:|discord:)?(\d+)$/i);
  if (channelPrefix) {
    return { channelId: channelPrefix[1] };
  }
  var guildPrefix = trimmed.match(/^(?:guild:|server:)?(\d+)$/i);
  if (guildPrefix && !trimmed.includes("/") && !trimmed.includes("#")) {
    return { guildId: guildPrefix[1], guildOnly: true };
  }
  var split = trimmed.includes("/") ? trimmed.split("/") : trimmed.split("#");
  if (split.length >= 2) {
    var guild = (_a = split[0]) === null || _a === void 0 ? void 0 : _a.trim();
    var channel = split.slice(1).join("#").trim();
    if (!channel) {
      return guild ? { guild: guild.trim(), guildOnly: true } : {};
    }
    if (guild && /^\d+$/.test(guild)) {
      return { guildId: guild, channel: channel };
    }
    return { guild: guild, channel: channel };
  }
  return { guild: trimmed, guildOnly: true };
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
function listGuildChannels(token, fetcher, guildId) {
  return __awaiter(this, void 0, void 0, function () {
    var raw;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, api_js_1.fetchDiscord)("/guilds/".concat(guildId, "/channels"), token, fetcher),
          ];
        case 1:
          raw = _a.sent();
          return [
            2 /*return*/,
            raw
              .filter(function (channel) {
                return Boolean(channel.id) && "name" in channel;
              })
              .map(function (channel) {
                var _a, _b;
                var archived =
                  "thread_metadata" in channel
                    ? (_a = channel.thread_metadata) === null || _a === void 0
                      ? void 0
                      : _a.archived
                    : undefined;
                return {
                  id: channel.id,
                  name:
                    "name" in channel
                      ? (_b = channel.name) !== null && _b !== void 0
                        ? _b
                        : ""
                      : "",
                  guildId: guildId,
                  type: channel.type,
                  archived: archived,
                };
              })
              .filter(function (channel) {
                return Boolean(channel.name);
              }),
          ];
      }
    });
  });
}
function fetchChannel(token, fetcher, channelId) {
  return __awaiter(this, void 0, void 0, function () {
    var raw;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, api_js_1.fetchDiscord)("/channels/".concat(channelId), token, fetcher),
          ];
        case 1:
          raw = _c.sent();
          if (!raw || !("guild_id" in raw)) {
            return [2 /*return*/, null];
          }
          return [
            2 /*return*/,
            {
              id: raw.id,
              name: "name" in raw ? ((_a = raw.name) !== null && _a !== void 0 ? _a : "") : "",
              guildId: (_b = raw.guild_id) !== null && _b !== void 0 ? _b : "",
              type: raw.type,
            },
          ];
      }
    });
  });
}
function preferActiveMatch(candidates) {
  var _a, _b;
  if (candidates.length === 0) {
    return undefined;
  }
  var scored = candidates.map(function (channel) {
    var isThread = channel.type === 11 || channel.type === 12;
    var archived = Boolean(channel.archived);
    var score = (archived ? 0 : 2) + (isThread ? 0 : 1);
    return { channel: channel, score: score };
  });
  scored.sort(function (a, b) {
    return b.score - a.score;
  });
  return (_b = (_a = scored[0]) === null || _a === void 0 ? void 0 : _a.channel) !== null &&
    _b !== void 0
    ? _b
    : candidates[0];
}
function resolveGuildByName(guilds, input) {
  var slug = (0, allow_list_js_1.normalizeDiscordSlug)(input);
  if (!slug) {
    return undefined;
  }
  return guilds.find(function (guild) {
    return guild.slug === slug;
  });
}
function resolveDiscordChannelAllowlist(params) {
  return __awaiter(this, void 0, void 0, function () {
    var token, fetcher, guilds, channelsByGuild, getChannels, results, _loop_1, _i, _a, input;
    var _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
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
          guilds = _d.sent();
          channelsByGuild = new Map();
          getChannels = function (guildId) {
            var existing = channelsByGuild.get(guildId);
            if (existing) {
              return existing;
            }
            var promise = listGuildChannels(token, fetcher, guildId);
            channelsByGuild.set(guildId, promise);
            return promise;
          };
          results = [];
          _loop_1 = function (input) {
            var parsed,
              guild,
              channel_1,
              guild,
              guild,
              channelQuery_1,
              channels,
              matches,
              match_1,
              channelName,
              candidates,
              _e,
              guilds_1,
              guild,
              channels,
              _f,
              channels_1,
              channel,
              match,
              guild;
            return __generator(this, function (_g) {
              switch (_g.label) {
                case 0:
                  parsed = parseDiscordChannelInput(input);
                  if (parsed.guildOnly) {
                    guild =
                      parsed.guildId &&
                      guilds.find(function (entry) {
                        return entry.id === parsed.guildId;
                      })
                        ? guilds.find(function (entry) {
                            return entry.id === parsed.guildId;
                          })
                        : parsed.guild
                          ? resolveGuildByName(guilds, parsed.guild)
                          : undefined;
                    if (guild) {
                      results.push({
                        input: input,
                        resolved: true,
                        guildId: guild.id,
                        guildName: guild.name,
                      });
                    } else {
                      results.push({
                        input: input,
                        resolved: false,
                        guildId: parsed.guildId,
                        guildName: parsed.guild,
                      });
                    }
                    return [2 /*return*/, "continue"];
                  }
                  if (!parsed.channelId) {
                    return [3 /*break*/, 2];
                  }
                  return [4 /*yield*/, fetchChannel(token, fetcher, parsed.channelId)];
                case 1:
                  channel_1 = _g.sent();
                  if (channel_1 === null || channel_1 === void 0 ? void 0 : channel_1.guildId) {
                    guild = guilds.find(function (entry) {
                      return entry.id === channel_1.guildId;
                    });
                    results.push({
                      input: input,
                      resolved: true,
                      guildId: channel_1.guildId,
                      guildName: guild === null || guild === void 0 ? void 0 : guild.name,
                      channelId: channel_1.id,
                      channelName: channel_1.name,
                      archived: channel_1.archived,
                    });
                  } else {
                    results.push({
                      input: input,
                      resolved: false,
                      channelId: parsed.channelId,
                    });
                  }
                  return [2 /*return*/, "continue"];
                case 2:
                  if (!(parsed.guildId || parsed.guild)) {
                    return [3 /*break*/, 4];
                  }
                  guild =
                    parsed.guildId &&
                    guilds.find(function (entry) {
                      return entry.id === parsed.guildId;
                    })
                      ? guilds.find(function (entry) {
                          return entry.id === parsed.guildId;
                        })
                      : parsed.guild
                        ? resolveGuildByName(guilds, parsed.guild)
                        : undefined;
                  channelQuery_1 =
                    (_c = parsed.channel) === null || _c === void 0 ? void 0 : _c.trim();
                  if (!guild || !channelQuery_1) {
                    results.push({
                      input: input,
                      resolved: false,
                      guildId: parsed.guildId,
                      guildName: parsed.guild,
                      channelName:
                        channelQuery_1 !== null && channelQuery_1 !== void 0
                          ? channelQuery_1
                          : parsed.channel,
                    });
                    return [2 /*return*/, "continue"];
                  }
                  return [4 /*yield*/, getChannels(guild.id)];
                case 3:
                  channels = _g.sent();
                  matches = channels.filter(function (channel) {
                    return (
                      (0, allow_list_js_1.normalizeDiscordSlug)(channel.name) ===
                      (0, allow_list_js_1.normalizeDiscordSlug)(channelQuery_1)
                    );
                  });
                  match_1 = preferActiveMatch(matches);
                  if (match_1) {
                    results.push({
                      input: input,
                      resolved: true,
                      guildId: guild.id,
                      guildName: guild.name,
                      channelId: match_1.id,
                      channelName: match_1.name,
                      archived: match_1.archived,
                    });
                  } else {
                    results.push({
                      input: input,
                      resolved: false,
                      guildId: guild.id,
                      guildName: guild.name,
                      channelName: parsed.channel,
                      note: "channel not found in guild ".concat(guild.name),
                    });
                  }
                  return [2 /*return*/, "continue"];
                case 4:
                  channelName = input.trim().replace(/^#/, "");
                  if (!channelName) {
                    results.push({
                      input: input,
                      resolved: false,
                      channelName: channelName,
                    });
                    return [2 /*return*/, "continue"];
                  }
                  candidates = [];
                  ((_e = 0), (guilds_1 = guilds));
                  _g.label = 5;
                case 5:
                  if (!(_e < guilds_1.length)) {
                    return [3 /*break*/, 8];
                  }
                  guild = guilds_1[_e];
                  return [4 /*yield*/, getChannels(guild.id)];
                case 6:
                  channels = _g.sent();
                  for (_f = 0, channels_1 = channels; _f < channels_1.length; _f++) {
                    channel = channels_1[_f];
                    if (
                      (0, allow_list_js_1.normalizeDiscordSlug)(channel.name) ===
                      (0, allow_list_js_1.normalizeDiscordSlug)(channelName)
                    ) {
                      candidates.push(channel);
                    }
                  }
                  _g.label = 7;
                case 7:
                  _e++;
                  return [3 /*break*/, 5];
                case 8:
                  match = preferActiveMatch(candidates);
                  if (match) {
                    guild = guilds.find(function (entry) {
                      return entry.id === match.guildId;
                    });
                    results.push({
                      input: input,
                      resolved: true,
                      guildId: match.guildId,
                      guildName: guild === null || guild === void 0 ? void 0 : guild.name,
                      channelId: match.id,
                      channelName: match.name,
                      archived: match.archived,
                      note:
                        candidates.length > 1 &&
                        (guild === null || guild === void 0 ? void 0 : guild.name)
                          ? "matched multiple; chose ".concat(guild.name)
                          : undefined,
                    });
                    return [2 /*return*/, "continue"];
                  }
                  results.push({
                    input: input,
                    resolved: false,
                    channelName: channelName,
                  });
                  return [2 /*return*/];
              }
            });
          };
          ((_i = 0), (_a = params.entries));
          _d.label = 2;
        case 2:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 5];
          }
          input = _a[_i];
          return [5 /*yield**/, _loop_1(input)];
        case 3:
          _d.sent();
          _d.label = 4;
        case 4:
          _i++;
          return [3 /*break*/, 2];
        case 5:
          return [2 /*return*/, results];
      }
    });
  });
}
