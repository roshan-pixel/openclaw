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
exports.resolveDiscordPrivilegedIntentsFromFlags = resolveDiscordPrivilegedIntentsFromFlags;
exports.fetchDiscordApplicationSummary = fetchDiscordApplicationSummary;
exports.probeDiscord = probeDiscord;
exports.fetchDiscordApplicationId = fetchDiscordApplicationId;
var fetch_js_1 = require("../infra/fetch.js");
var token_js_1 = require("./token.js");
var DISCORD_API_BASE = "https://discord.com/api/v10";
var DISCORD_APP_FLAG_GATEWAY_PRESENCE = 1 << 12;
var DISCORD_APP_FLAG_GATEWAY_PRESENCE_LIMITED = 1 << 13;
var DISCORD_APP_FLAG_GATEWAY_GUILD_MEMBERS = 1 << 14;
var DISCORD_APP_FLAG_GATEWAY_GUILD_MEMBERS_LIMITED = 1 << 15;
var DISCORD_APP_FLAG_GATEWAY_MESSAGE_CONTENT = 1 << 18;
var DISCORD_APP_FLAG_GATEWAY_MESSAGE_CONTENT_LIMITED = 1 << 19;
function resolveDiscordPrivilegedIntentsFromFlags(flags) {
  var resolve = function (enabledBit, limitedBit) {
    if ((flags & enabledBit) !== 0) {
      return "enabled";
    }
    if ((flags & limitedBit) !== 0) {
      return "limited";
    }
    return "disabled";
  };
  return {
    presence: resolve(DISCORD_APP_FLAG_GATEWAY_PRESENCE, DISCORD_APP_FLAG_GATEWAY_PRESENCE_LIMITED),
    guildMembers: resolve(
      DISCORD_APP_FLAG_GATEWAY_GUILD_MEMBERS,
      DISCORD_APP_FLAG_GATEWAY_GUILD_MEMBERS_LIMITED,
    ),
    messageContent: resolve(
      DISCORD_APP_FLAG_GATEWAY_MESSAGE_CONTENT,
      DISCORD_APP_FLAG_GATEWAY_MESSAGE_CONTENT_LIMITED,
    ),
  };
}
function fetchDiscordApplicationSummary(token_1, timeoutMs_1) {
  return __awaiter(this, arguments, void 0, function (token, timeoutMs, fetcher) {
    var normalized, res, json, flags, _a;
    var _b;
    if (fetcher === void 0) {
      fetcher = fetch;
    }
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          normalized = (0, token_js_1.normalizeDiscordToken)(token);
          if (!normalized) {
            return [2 /*return*/, undefined];
          }
          _c.label = 1;
        case 1:
          _c.trys.push([1, 4, , 5]);
          return [
            4 /*yield*/,
            fetchWithTimeout(
              "".concat(DISCORD_API_BASE, "/oauth2/applications/@me"),
              timeoutMs,
              fetcher,
              {
                Authorization: "Bot ".concat(normalized),
              },
            ),
          ];
        case 2:
          res = _c.sent();
          if (!res.ok) {
            return [2 /*return*/, undefined];
          }
          return [4 /*yield*/, res.json()];
        case 3:
          json = _c.sent();
          flags =
            typeof json.flags === "number" && Number.isFinite(json.flags) ? json.flags : undefined;
          return [
            2 /*return*/,
            {
              id: (_b = json.id) !== null && _b !== void 0 ? _b : null,
              flags: flags !== null && flags !== void 0 ? flags : null,
              intents:
                typeof flags === "number"
                  ? resolveDiscordPrivilegedIntentsFromFlags(flags)
                  : undefined,
            },
          ];
        case 4:
          _a = _c.sent();
          return [2 /*return*/, undefined];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function fetchWithTimeout(url, timeoutMs, fetcher, headers) {
  return __awaiter(this, void 0, void 0, function () {
    var fetchImpl, controller, timer;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          fetchImpl = (0, fetch_js_1.resolveFetch)(fetcher);
          if (!fetchImpl) {
            throw new Error("fetch is not available");
          }
          controller = new AbortController();
          timer = setTimeout(function () {
            return controller.abort();
          }, timeoutMs);
          _a.label = 1;
        case 1:
          _a.trys.push([1, , 3, 4]);
          return [4 /*yield*/, fetchImpl(url, { signal: controller.signal, headers: headers })];
        case 2:
          return [2 /*return*/, _a.sent()];
        case 3:
          clearTimeout(timer);
          return [7 /*endfinally*/];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function probeDiscord(token, timeoutMs, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var started, fetcher, includeApplication, normalized, result, res, json, _a, err_1;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          started = Date.now();
          fetcher =
            (_b = opts === null || opts === void 0 ? void 0 : opts.fetcher) !== null &&
            _b !== void 0
              ? _b
              : fetch;
          includeApplication =
            (opts === null || opts === void 0 ? void 0 : opts.includeApplication) === true;
          normalized = (0, token_js_1.normalizeDiscordToken)(token);
          result = {
            ok: false,
            status: null,
            error: null,
            elapsedMs: 0,
          };
          if (!normalized) {
            return [
              2 /*return*/,
              __assign(__assign({}, result), {
                error: "missing token",
                elapsedMs: Date.now() - started,
              }),
            ];
          }
          _f.label = 1;
        case 1:
          _f.trys.push([1, 6, , 7]);
          return [
            4 /*yield*/,
            fetchWithTimeout("".concat(DISCORD_API_BASE, "/users/@me"), timeoutMs, fetcher, {
              Authorization: "Bot ".concat(normalized),
            }),
          ];
        case 2:
          res = _f.sent();
          if (!res.ok) {
            result.status = res.status;
            result.error = "getMe failed (".concat(res.status, ")");
            return [
              2 /*return*/,
              __assign(__assign({}, result), { elapsedMs: Date.now() - started }),
            ];
          }
          return [4 /*yield*/, res.json()];
        case 3:
          json = _f.sent();
          result.ok = true;
          result.bot = {
            id: (_c = json.id) !== null && _c !== void 0 ? _c : null,
            username: (_d = json.username) !== null && _d !== void 0 ? _d : null,
          };
          if (!includeApplication) {
            return [3 /*break*/, 5];
          }
          _a = result;
          return [4 /*yield*/, fetchDiscordApplicationSummary(normalized, timeoutMs, fetcher)];
        case 4:
          _a.application = (_e = _f.sent()) !== null && _e !== void 0 ? _e : undefined;
          _f.label = 5;
        case 5:
          return [
            2 /*return*/,
            __assign(__assign({}, result), { elapsedMs: Date.now() - started }),
          ];
        case 6:
          err_1 = _f.sent();
          return [
            2 /*return*/,
            __assign(__assign({}, result), {
              status: err_1 instanceof Response ? err_1.status : result.status,
              error: err_1 instanceof Error ? err_1.message : String(err_1),
              elapsedMs: Date.now() - started,
            }),
          ];
        case 7:
          return [2 /*return*/];
      }
    });
  });
}
function fetchDiscordApplicationId(token_1, timeoutMs_1) {
  return __awaiter(this, arguments, void 0, function (token, timeoutMs, fetcher) {
    var normalized, res, json, _a;
    var _b;
    if (fetcher === void 0) {
      fetcher = fetch;
    }
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          normalized = (0, token_js_1.normalizeDiscordToken)(token);
          if (!normalized) {
            return [2 /*return*/, undefined];
          }
          _c.label = 1;
        case 1:
          _c.trys.push([1, 4, , 5]);
          return [
            4 /*yield*/,
            fetchWithTimeout(
              "".concat(DISCORD_API_BASE, "/oauth2/applications/@me"),
              timeoutMs,
              fetcher,
              {
                Authorization: "Bot ".concat(normalized),
              },
            ),
          ];
        case 2:
          res = _c.sent();
          if (!res.ok) {
            return [2 /*return*/, undefined];
          }
          return [4 /*yield*/, res.json()];
        case 3:
          json = _c.sent();
          return [2 /*return*/, (_b = json.id) !== null && _b !== void 0 ? _b : undefined];
        case 4:
          _a = _c.sent();
          return [2 /*return*/, undefined];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
