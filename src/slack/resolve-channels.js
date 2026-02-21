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
exports.resolveSlackChannelAllowlist = resolveSlackChannelAllowlist;
var client_js_1 = require("./client.js");
function parseSlackChannelMention(raw) {
  var _a, _b;
  var trimmed = raw.trim();
  if (!trimmed) {
    return {};
  }
  var mention = trimmed.match(/^<#([A-Z0-9]+)(?:\|([^>]+))?>$/i);
  if (mention) {
    var id = (_a = mention[1]) === null || _a === void 0 ? void 0 : _a.toUpperCase();
    var name_1 = (_b = mention[2]) === null || _b === void 0 ? void 0 : _b.trim();
    return { id: id, name: name_1 };
  }
  var prefixed = trimmed.replace(/^(slack:|channel:)/i, "");
  if (/^[CG][A-Z0-9]+$/i.test(prefixed)) {
    return { id: prefixed.toUpperCase() };
  }
  var name = prefixed.replace(/^#/, "").trim();
  return name ? { name: name } : {};
}
function listSlackChannels(client) {
  return __awaiter(this, void 0, void 0, function () {
    var channels, cursor, res, _i, _a, channel, id, name_2, next;
    var _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          channels = [];
          _g.label = 1;
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
          res = _g.sent();
          for (
            _i = 0, _a = (_b = res.channels) !== null && _b !== void 0 ? _b : [];
            _i < _a.length;
            _i++
          ) {
            channel = _a[_i];
            id = (_c = channel.id) === null || _c === void 0 ? void 0 : _c.trim();
            name_2 = (_d = channel.name) === null || _d === void 0 ? void 0 : _d.trim();
            if (!id || !name_2) {
              continue;
            }
            channels.push({
              id: id,
              name: name_2,
              archived: Boolean(channel.is_archived),
              isPrivate: Boolean(channel.is_private),
            });
          }
          next =
            (_f =
              (_e = res.response_metadata) === null || _e === void 0 ? void 0 : _e.next_cursor) ===
              null || _f === void 0
              ? void 0
              : _f.trim();
          cursor = next ? next : undefined;
          _g.label = 3;
        case 3:
          if (cursor) {
            return [3 /*break*/, 1];
          }
          _g.label = 4;
        case 4:
          return [2 /*return*/, channels];
      }
    });
  });
}
function resolveByName(name, channels) {
  var target = name.trim().toLowerCase();
  if (!target) {
    return undefined;
  }
  var matches = channels.filter(function (channel) {
    return channel.name.toLowerCase() === target;
  });
  if (matches.length === 0) {
    return undefined;
  }
  var active = matches.find(function (channel) {
    return !channel.archived;
  });
  return active !== null && active !== void 0 ? active : matches[0];
}
function resolveSlackChannelAllowlist(params) {
  return __awaiter(this, void 0, void 0, function () {
    var client, channels, results, _loop_1, _i, _a, input;
    var _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          client =
            (_b = params.client) !== null && _b !== void 0
              ? _b
              : (0, client_js_1.createSlackWebClient)(params.token);
          return [4 /*yield*/, listSlackChannels(client)];
        case 1:
          channels = _d.sent();
          results = [];
          _loop_1 = function (input) {
            var parsed = parseSlackChannelMention(input);
            if (parsed.id) {
              var match = channels.find(function (channel) {
                return channel.id === parsed.id;
              });
              results.push({
                input: input,
                resolved: true,
                id: parsed.id,
                name:
                  (_c = match === null || match === void 0 ? void 0 : match.name) !== null &&
                  _c !== void 0
                    ? _c
                    : parsed.name,
                archived: match === null || match === void 0 ? void 0 : match.archived,
              });
              return "continue";
            }
            if (parsed.name) {
              var match = resolveByName(parsed.name, channels);
              if (match) {
                results.push({
                  input: input,
                  resolved: true,
                  id: match.id,
                  name: match.name,
                  archived: match.archived,
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
