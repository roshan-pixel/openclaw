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
exports.trackSessionManagerAccess = trackSessionManagerAccess;
exports.prewarmSessionFile = prewarmSessionFile;
var node_buffer_1 = require("node:buffer");
var promises_1 = require("node:fs/promises");
var cache_utils_js_1 = require("../../config/cache-utils.js");
var SESSION_MANAGER_CACHE = new Map();
var DEFAULT_SESSION_MANAGER_TTL_MS = 45000; // 45 seconds
function getSessionManagerTtl() {
  return (0, cache_utils_js_1.resolveCacheTtlMs)({
    envValue: process.env.OPENCLAW_SESSION_MANAGER_CACHE_TTL_MS,
    defaultTtlMs: DEFAULT_SESSION_MANAGER_TTL_MS,
  });
}
function isSessionManagerCacheEnabled() {
  return (0, cache_utils_js_1.isCacheEnabled)(getSessionManagerTtl());
}
function trackSessionManagerAccess(sessionFile) {
  if (!isSessionManagerCacheEnabled()) {
    return;
  }
  var now = Date.now();
  SESSION_MANAGER_CACHE.set(sessionFile, {
    sessionFile: sessionFile,
    loadedAt: now,
  });
}
function isSessionManagerCached(sessionFile) {
  if (!isSessionManagerCacheEnabled()) {
    return false;
  }
  var entry = SESSION_MANAGER_CACHE.get(sessionFile);
  if (!entry) {
    return false;
  }
  var now = Date.now();
  var ttl = getSessionManagerTtl();
  return now - entry.loadedAt <= ttl;
}
function prewarmSessionFile(sessionFile) {
  return __awaiter(this, void 0, void 0, function () {
    var handle, buffer, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (!isSessionManagerCacheEnabled()) {
            return [2 /*return*/];
          }
          if (isSessionManagerCached(sessionFile)) {
            return [2 /*return*/];
          }
          _b.label = 1;
        case 1:
          _b.trys.push([1, 8, , 9]);
          return [4 /*yield*/, promises_1.default.open(sessionFile, "r")];
        case 2:
          handle = _b.sent();
          _b.label = 3;
        case 3:
          _b.trys.push([3, , 5, 7]);
          buffer = node_buffer_1.Buffer.alloc(4096);
          return [4 /*yield*/, handle.read(buffer, 0, buffer.length, 0)];
        case 4:
          _b.sent();
          return [3 /*break*/, 7];
        case 5:
          return [4 /*yield*/, handle.close()];
        case 6:
          _b.sent();
          return [7 /*endfinally*/];
        case 7:
          trackSessionManagerAccess(sessionFile);
          return [3 /*break*/, 9];
        case 8:
          _a = _b.sent();
          return [3 /*break*/, 9];
        case 9:
          return [2 /*return*/];
      }
    });
  });
}
