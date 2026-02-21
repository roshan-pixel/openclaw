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
exports.createSlackThreadTsResolver = createSlackThreadTsResolver;
var globals_js_1 = require("../../globals.js");
var DEFAULT_THREAD_TS_CACHE_TTL_MS = 60000;
var DEFAULT_THREAD_TS_CACHE_MAX = 500;
var normalizeThreadTs = function (threadTs) {
  var trimmed = threadTs === null || threadTs === void 0 ? void 0 : threadTs.trim();
  return trimmed ? trimmed : undefined;
};
function resolveThreadTsFromHistory(params) {
  return __awaiter(this, void 0, void 0, function () {
    var response, message, err_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          _d.trys.push([0, 2, , 3]);
          return [
            4 /*yield*/,
            params.client.conversations.history({
              channel: params.channelId,
              latest: params.messageTs,
              oldest: params.messageTs,
              inclusive: true,
              limit: 1,
            }),
          ];
        case 1:
          response = _d.sent();
          message =
            (_b =
              (_a = response.messages) === null || _a === void 0
                ? void 0
                : _a.find(function (entry) {
                    return entry.ts === params.messageTs;
                  })) !== null && _b !== void 0
              ? _b
              : (_c = response.messages) === null || _c === void 0
                ? void 0
                : _c[0];
          return [
            2 /*return*/,
            normalizeThreadTs(message === null || message === void 0 ? void 0 : message.thread_ts),
          ];
        case 2:
          err_1 = _d.sent();
          if ((0, globals_js_1.shouldLogVerbose)()) {
            (0, globals_js_1.logVerbose)(
              "slack inbound: failed to resolve thread_ts via conversations.history for channel="
                .concat(params.channelId, " ts=")
                .concat(params.messageTs, ": ")
                .concat(String(err_1)),
            );
          }
          return [2 /*return*/, undefined];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function createSlackThreadTsResolver(params) {
  var _this = this;
  var _a, _b;
  var ttlMs = Math.max(
    0,
    (_a = params.cacheTtlMs) !== null && _a !== void 0 ? _a : DEFAULT_THREAD_TS_CACHE_TTL_MS,
  );
  var maxSize = Math.max(
    0,
    (_b = params.maxSize) !== null && _b !== void 0 ? _b : DEFAULT_THREAD_TS_CACHE_MAX,
  );
  var cache = new Map();
  var inflight = new Map();
  var getCached = function (key, now) {
    var entry = cache.get(key);
    if (!entry) {
      return undefined;
    }
    if (ttlMs > 0 && now - entry.updatedAt > ttlMs) {
      cache.delete(key);
      return undefined;
    }
    cache.delete(key);
    cache.set(key, __assign(__assign({}, entry), { updatedAt: now }));
    return entry.threadTs;
  };
  var setCached = function (key, threadTs, now) {
    cache.delete(key);
    cache.set(key, { threadTs: threadTs, updatedAt: now });
    if (maxSize <= 0) {
      cache.clear();
      return;
    }
    while (cache.size > maxSize) {
      var oldestKey = cache.keys().next().value;
      if (!oldestKey) {
        break;
      }
      cache.delete(oldestKey);
    }
  };
  return {
    resolve: function (request) {
      return __awaiter(_this, void 0, void 0, function () {
        var message, cacheKey, now, cached, pending, resolved;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              message = request.message;
              if (!message.parent_user_id || message.thread_ts || !message.ts) {
                return [2 /*return*/, message];
              }
              cacheKey = "".concat(message.channel, ":").concat(message.ts);
              now = Date.now();
              cached = getCached(cacheKey, now);
              if (cached !== undefined) {
                return [
                  2 /*return*/,
                  cached ? __assign(__assign({}, message), { thread_ts: cached }) : message,
                ];
              }
              if ((0, globals_js_1.shouldLogVerbose)()) {
                (0, globals_js_1.logVerbose)(
                  "slack inbound: missing thread_ts for thread reply channel="
                    .concat(message.channel, " ts=")
                    .concat(message.ts, " source=")
                    .concat(request.source),
                );
              }
              pending = inflight.get(cacheKey);
              if (!pending) {
                pending = resolveThreadTsFromHistory({
                  client: params.client,
                  channelId: message.channel,
                  messageTs: message.ts,
                });
                inflight.set(cacheKey, pending);
              }
              _a.label = 1;
            case 1:
              _a.trys.push([1, , 3, 4]);
              return [4 /*yield*/, pending];
            case 2:
              resolved = _a.sent();
              return [3 /*break*/, 4];
            case 3:
              inflight.delete(cacheKey);
              return [7 /*endfinally*/];
            case 4:
              setCached(
                cacheKey,
                resolved !== null && resolved !== void 0 ? resolved : null,
                Date.now(),
              );
              if (resolved) {
                if ((0, globals_js_1.shouldLogVerbose)()) {
                  (0, globals_js_1.logVerbose)(
                    "slack inbound: resolved missing thread_ts channel="
                      .concat(message.channel, " ts=")
                      .concat(message.ts, " -> thread_ts=")
                      .concat(resolved),
                  );
                }
                return [2 /*return*/, __assign(__assign({}, message), { thread_ts: resolved })];
              }
              if ((0, globals_js_1.shouldLogVerbose)()) {
                (0, globals_js_1.logVerbose)(
                  "slack inbound: could not resolve missing thread_ts channel="
                    .concat(message.channel, " ts=")
                    .concat(message.ts),
                );
              }
              return [2 /*return*/, message];
          }
        });
      });
    },
  };
}
