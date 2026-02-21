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
exports.clearSessionStoreCacheForTest = clearSessionStoreCacheForTest;
exports.loadSessionStore = loadSessionStore;
exports.readSessionUpdatedAt = readSessionUpdatedAt;
exports.saveSessionStore = saveSessionStore;
exports.updateSessionStore = updateSessionStore;
exports.updateSessionStoreEntry = updateSessionStoreEntry;
exports.recordSessionMetaFromInbound = recordSessionMetaFromInbound;
exports.updateLastRoute = updateLastRoute;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var json5_1 = require("json5");
var cache_utils_js_1 = require("../cache-utils.js");
var delivery_context_js_1 = require("../../utils/delivery-context.js");
var metadata_js_1 = require("./metadata.js");
var types_js_1 = require("./types.js");
var SESSION_STORE_CACHE = new Map();
var DEFAULT_SESSION_STORE_TTL_MS = 45000; // 45 seconds (between 30-60s)
function isSessionStoreRecord(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function getSessionStoreTtl() {
  return (0, cache_utils_js_1.resolveCacheTtlMs)({
    envValue: process.env.OPENCLAW_SESSION_CACHE_TTL_MS,
    defaultTtlMs: DEFAULT_SESSION_STORE_TTL_MS,
  });
}
function isSessionStoreCacheEnabled() {
  return (0, cache_utils_js_1.isCacheEnabled)(getSessionStoreTtl());
}
function isSessionStoreCacheValid(entry) {
  var now = Date.now();
  var ttl = getSessionStoreTtl();
  return now - entry.loadedAt <= ttl;
}
function invalidateSessionStoreCache(storePath) {
  SESSION_STORE_CACHE.delete(storePath);
}
function normalizeSessionEntryDelivery(entry) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  var normalized = (0, delivery_context_js_1.normalizeSessionDeliveryFields)(entry);
  var nextDelivery = normalized.deliveryContext;
  var sameDelivery =
    ((_b = (_a = entry.deliveryContext) === null || _a === void 0 ? void 0 : _a.channel) !== null &&
    _b !== void 0
      ? _b
      : undefined) ===
      (nextDelivery === null || nextDelivery === void 0 ? void 0 : nextDelivery.channel) &&
    ((_d = (_c = entry.deliveryContext) === null || _c === void 0 ? void 0 : _c.to) !== null &&
    _d !== void 0
      ? _d
      : undefined) ===
      (nextDelivery === null || nextDelivery === void 0 ? void 0 : nextDelivery.to) &&
    ((_f = (_e = entry.deliveryContext) === null || _e === void 0 ? void 0 : _e.accountId) !==
      null && _f !== void 0
      ? _f
      : undefined) ===
      (nextDelivery === null || nextDelivery === void 0 ? void 0 : nextDelivery.accountId) &&
    ((_h = (_g = entry.deliveryContext) === null || _g === void 0 ? void 0 : _g.threadId) !==
      null && _h !== void 0
      ? _h
      : undefined) ===
      (nextDelivery === null || nextDelivery === void 0 ? void 0 : nextDelivery.threadId);
  var sameLast =
    entry.lastChannel === normalized.lastChannel &&
    entry.lastTo === normalized.lastTo &&
    entry.lastAccountId === normalized.lastAccountId &&
    entry.lastThreadId === normalized.lastThreadId;
  if (sameDelivery && sameLast) {
    return entry;
  }
  return __assign(__assign({}, entry), {
    deliveryContext: nextDelivery,
    lastChannel: normalized.lastChannel,
    lastTo: normalized.lastTo,
    lastAccountId: normalized.lastAccountId,
    lastThreadId: normalized.lastThreadId,
  });
}
function normalizeSessionStore(store) {
  for (var _i = 0, _a = Object.entries(store); _i < _a.length; _i++) {
    var _b = _a[_i],
      key = _b[0],
      entry = _b[1];
    if (!entry) {
      continue;
    }
    var normalized = normalizeSessionEntryDelivery(entry);
    if (normalized !== entry) {
      store[key] = normalized;
    }
  }
}
function clearSessionStoreCacheForTest() {
  SESSION_STORE_CACHE.clear();
}
function loadSessionStore(storePath, opts) {
  var _a;
  if (opts === void 0) {
    opts = {};
  }
  // Check cache first if enabled
  if (!opts.skipCache && isSessionStoreCacheEnabled()) {
    var cached = SESSION_STORE_CACHE.get(storePath);
    if (cached && isSessionStoreCacheValid(cached)) {
      var currentMtimeMs = (0, cache_utils_js_1.getFileMtimeMs)(storePath);
      if (currentMtimeMs === cached.mtimeMs) {
        // Return a deep copy to prevent external mutations affecting cache
        return structuredClone(cached.store);
      }
      invalidateSessionStoreCache(storePath);
    }
  }
  // Cache miss or disabled - load from disk
  var store = {};
  var mtimeMs = (0, cache_utils_js_1.getFileMtimeMs)(storePath);
  try {
    var raw = node_fs_1.default.readFileSync(storePath, "utf-8");
    var parsed = json5_1.default.parse(raw);
    if (isSessionStoreRecord(parsed)) {
      store = parsed;
    }
    mtimeMs =
      (_a = (0, cache_utils_js_1.getFileMtimeMs)(storePath)) !== null && _a !== void 0
        ? _a
        : mtimeMs;
  } catch (_b) {
    // ignore missing/invalid store; we'll recreate it
  }
  // Best-effort migration: message provider → channel naming.
  for (var _i = 0, _c = Object.values(store); _i < _c.length; _i++) {
    var entry = _c[_i];
    if (!entry || typeof entry !== "object") {
      continue;
    }
    var rec = entry;
    if (typeof rec.channel !== "string" && typeof rec.provider === "string") {
      rec.channel = rec.provider;
      delete rec.provider;
    }
    if (typeof rec.lastChannel !== "string" && typeof rec.lastProvider === "string") {
      rec.lastChannel = rec.lastProvider;
      delete rec.lastProvider;
    }
    // Best-effort migration: legacy `room` field → `groupChannel` (keep value, prune old key).
    if (typeof rec.groupChannel !== "string" && typeof rec.room === "string") {
      rec.groupChannel = rec.room;
      delete rec.room;
    } else if ("room" in rec) {
      delete rec.room;
    }
  }
  // Cache the result if caching is enabled
  if (!opts.skipCache && isSessionStoreCacheEnabled()) {
    SESSION_STORE_CACHE.set(storePath, {
      store: structuredClone(store), // Store a copy to prevent external mutations
      loadedAt: Date.now(),
      storePath: storePath,
      mtimeMs: mtimeMs,
    });
  }
  return structuredClone(store);
}
function readSessionUpdatedAt(params) {
  var _a;
  try {
    var store = loadSessionStore(params.storePath);
    return (_a = store[params.sessionKey]) === null || _a === void 0 ? void 0 : _a.updatedAt;
  } catch (_b) {
    return undefined;
  }
}
function saveSessionStoreUnlocked(storePath, store) {
  return __awaiter(this, void 0, void 0, function () {
    var json, err_1, code, tmp, err_2, code, err2_1, code2;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          // Invalidate cache on write to ensure consistency
          invalidateSessionStoreCache(storePath);
          normalizeSessionStore(store);
          return [
            4 /*yield*/,
            node_fs_1.default.promises.mkdir(node_path_1.default.dirname(storePath), {
              recursive: true,
            }),
          ];
        case 1:
          _a.sent();
          json = JSON.stringify(store, null, 2);
          if (!(process.platform === "win32")) {
            return [3 /*break*/, 6];
          }
          _a.label = 2;
        case 2:
          _a.trys.push([2, 4, , 5]);
          return [4 /*yield*/, node_fs_1.default.promises.writeFile(storePath, json, "utf-8")];
        case 3:
          _a.sent();
          return [3 /*break*/, 5];
        case 4:
          err_1 = _a.sent();
          code = err_1 && typeof err_1 === "object" && "code" in err_1 ? String(err_1.code) : null;
          if (code === "ENOENT") {
            return [2 /*return*/];
          }
          throw err_1;
        case 5:
          return [2 /*return*/];
        case 6:
          tmp = ""
            .concat(storePath, ".")
            .concat(process.pid, ".")
            .concat(node_crypto_1.default.randomUUID(), ".tmp");
          _a.label = 7;
        case 7:
          _a.trys.push([7, 11, 19, 21]);
          return [
            4 /*yield*/,
            node_fs_1.default.promises.writeFile(tmp, json, { mode: 384, encoding: "utf-8" }),
          ];
        case 8:
          _a.sent();
          return [4 /*yield*/, node_fs_1.default.promises.rename(tmp, storePath)];
        case 9:
          _a.sent();
          // Ensure permissions are set even if rename loses them
          return [4 /*yield*/, node_fs_1.default.promises.chmod(storePath, 384)];
        case 10:
          // Ensure permissions are set even if rename loses them
          _a.sent();
          return [3 /*break*/, 21];
        case 11:
          err_2 = _a.sent();
          code = err_2 && typeof err_2 === "object" && "code" in err_2 ? String(err_2.code) : null;
          if (!(code === "ENOENT")) {
            return [3 /*break*/, 18];
          }
          _a.label = 12;
        case 12:
          _a.trys.push([12, 16, , 17]);
          return [
            4 /*yield*/,
            node_fs_1.default.promises.mkdir(node_path_1.default.dirname(storePath), {
              recursive: true,
            }),
          ];
        case 13:
          _a.sent();
          return [
            4 /*yield*/,
            node_fs_1.default.promises.writeFile(storePath, json, { mode: 384, encoding: "utf-8" }),
          ];
        case 14:
          _a.sent();
          return [4 /*yield*/, node_fs_1.default.promises.chmod(storePath, 384)];
        case 15:
          _a.sent();
          return [3 /*break*/, 17];
        case 16:
          err2_1 = _a.sent();
          code2 =
            err2_1 && typeof err2_1 === "object" && "code" in err2_1 ? String(err2_1.code) : null;
          if (code2 === "ENOENT") {
            return [2 /*return*/];
          }
          throw err2_1;
        case 17:
          return [2 /*return*/];
        case 18:
          throw err_2;
        case 19:
          return [4 /*yield*/, node_fs_1.default.promises.rm(tmp, { force: true })];
        case 20:
          _a.sent();
          return [7 /*endfinally*/];
        case 21:
          return [2 /*return*/];
      }
    });
  });
}
function saveSessionStore(storePath, store) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            withSessionStoreLock(storePath, function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4 /*yield*/, saveSessionStoreUnlocked(storePath, store)];
                    case 1:
                      _a.sent();
                      return [2 /*return*/];
                  }
                });
              });
            }),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function updateSessionStore(storePath, mutator) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            withSessionStoreLock(storePath, function () {
              return __awaiter(_this, void 0, void 0, function () {
                var store, result;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      store = loadSessionStore(storePath, { skipCache: true });
                      return [4 /*yield*/, mutator(store)];
                    case 1:
                      result = _a.sent();
                      return [4 /*yield*/, saveSessionStoreUnlocked(storePath, store)];
                    case 2:
                      _a.sent();
                      return [2 /*return*/, result];
                  }
                });
              });
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function withSessionStoreLock(storePath_1, fn_1) {
  return __awaiter(this, arguments, void 0, function (storePath, fn, opts) {
    var timeoutMs,
      pollIntervalMs,
      staleMs,
      lockPath,
      startedAt,
      handle,
      _a,
      err_3,
      code,
      now,
      st,
      ageMs,
      _b;
    var _c, _d, _e;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          timeoutMs = (_c = opts.timeoutMs) !== null && _c !== void 0 ? _c : 10000;
          pollIntervalMs = (_d = opts.pollIntervalMs) !== null && _d !== void 0 ? _d : 25;
          staleMs = (_e = opts.staleMs) !== null && _e !== void 0 ? _e : 30000;
          lockPath = "".concat(storePath, ".lock");
          startedAt = Date.now();
          return [
            4 /*yield*/,
            node_fs_1.default.promises.mkdir(node_path_1.default.dirname(storePath), {
              recursive: true,
            }),
          ];
        case 1:
          _f.sent();
          _f.label = 2;
        case 2:
          if (!true) {
            return [3 /*break*/, 22];
          }
          _f.label = 3;
        case 3:
          _f.trys.push([3, 10, , 21]);
          return [4 /*yield*/, node_fs_1.default.promises.open(lockPath, "wx")];
        case 4:
          handle = _f.sent();
          _f.label = 5;
        case 5:
          _f.trys.push([5, 7, , 8]);
          return [
            4 /*yield*/,
            handle.writeFile(JSON.stringify({ pid: process.pid, startedAt: Date.now() }), "utf-8"),
          ];
        case 6:
          _f.sent();
          return [3 /*break*/, 8];
        case 7:
          _a = _f.sent();
          return [3 /*break*/, 8];
        case 8:
          return [4 /*yield*/, handle.close()];
        case 9:
          _f.sent();
          return [3 /*break*/, 22];
        case 10:
          err_3 = _f.sent();
          code = err_3 && typeof err_3 === "object" && "code" in err_3 ? String(err_3.code) : null;
          if (!(code === "ENOENT")) {
            return [3 /*break*/, 13];
          }
          // Store directory may be deleted/recreated in tests while writes are in-flight.
          // Best-effort: recreate the parent dir and retry until timeout.
          return [
            4 /*yield*/,
            node_fs_1.default.promises
              .mkdir(node_path_1.default.dirname(storePath), { recursive: true })
              .catch(function () {
                return undefined;
              }),
          ];
        case 11:
          // Store directory may be deleted/recreated in tests while writes are in-flight.
          // Best-effort: recreate the parent dir and retry until timeout.
          _f.sent();
          return [
            4 /*yield*/,
            new Promise(function (r) {
              return setTimeout(r, pollIntervalMs);
            }),
          ];
        case 12:
          _f.sent();
          return [3 /*break*/, 2];
        case 13:
          if (code !== "EEXIST") {
            throw err_3;
          }
          now = Date.now();
          if (now - startedAt > timeoutMs) {
            throw new Error("timeout acquiring session store lock: ".concat(lockPath));
          }
          _f.label = 14;
        case 14:
          _f.trys.push([14, 18, , 19]);
          return [4 /*yield*/, node_fs_1.default.promises.stat(lockPath)];
        case 15:
          st = _f.sent();
          ageMs = now - st.mtimeMs;
          if (!(ageMs > staleMs)) {
            return [3 /*break*/, 17];
          }
          return [4 /*yield*/, node_fs_1.default.promises.unlink(lockPath)];
        case 16:
          _f.sent();
          return [3 /*break*/, 2];
        case 17:
          return [3 /*break*/, 19];
        case 18:
          _b = _f.sent();
          return [3 /*break*/, 19];
        case 19:
          return [
            4 /*yield*/,
            new Promise(function (r) {
              return setTimeout(r, pollIntervalMs);
            }),
          ];
        case 20:
          _f.sent();
          return [3 /*break*/, 21];
        case 21:
          return [3 /*break*/, 2];
        case 22:
          _f.trys.push([22, , 24, 26]);
          return [4 /*yield*/, fn()];
        case 23:
          return [2 /*return*/, _f.sent()];
        case 24:
          return [
            4 /*yield*/,
            node_fs_1.default.promises.unlink(lockPath).catch(function () {
              return undefined;
            }),
          ];
        case 25:
          _f.sent();
          return [7 /*endfinally*/];
        case 26:
          return [2 /*return*/];
      }
    });
  });
}
function updateSessionStoreEntry(params) {
  return __awaiter(this, void 0, void 0, function () {
    var storePath, sessionKey, update;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          ((storePath = params.storePath),
            (sessionKey = params.sessionKey),
            (update = params.update));
          return [
            4 /*yield*/,
            withSessionStoreLock(storePath, function () {
              return __awaiter(_this, void 0, void 0, function () {
                var store, existing, patch, next;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      store = loadSessionStore(storePath);
                      existing = store[sessionKey];
                      if (!existing) {
                        return [2 /*return*/, null];
                      }
                      return [4 /*yield*/, update(existing)];
                    case 1:
                      patch = _a.sent();
                      if (!patch) {
                        return [2 /*return*/, existing];
                      }
                      next = (0, types_js_1.mergeSessionEntry)(existing, patch);
                      store[sessionKey] = next;
                      return [4 /*yield*/, saveSessionStoreUnlocked(storePath, store)];
                    case 2:
                      _a.sent();
                      return [2 /*return*/, next];
                  }
                });
              });
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function recordSessionMetaFromInbound(params) {
  return __awaiter(this, void 0, void 0, function () {
    var storePath, sessionKey, ctx, createIfMissing;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ((storePath = params.storePath), (sessionKey = params.sessionKey), (ctx = params.ctx));
          createIfMissing = (_a = params.createIfMissing) !== null && _a !== void 0 ? _a : true;
          return [
            4 /*yield*/,
            updateSessionStore(storePath, function (store) {
              var existing = store[sessionKey];
              var patch = (0, metadata_js_1.deriveSessionMetaPatch)({
                ctx: ctx,
                sessionKey: sessionKey,
                existing: existing,
                groupResolution: params.groupResolution,
              });
              if (!patch) {
                return existing !== null && existing !== void 0 ? existing : null;
              }
              if (!existing && !createIfMissing) {
                return null;
              }
              var next = (0, types_js_1.mergeSessionEntry)(existing, patch);
              store[sessionKey] = next;
              return next;
            }),
          ];
        case 1:
          return [2 /*return*/, _b.sent()];
      }
    });
  });
}
function updateLastRoute(params) {
  return __awaiter(this, void 0, void 0, function () {
    var storePath, sessionKey, channel, to, accountId, threadId, ctx;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          ((storePath = params.storePath),
            (sessionKey = params.sessionKey),
            (channel = params.channel),
            (to = params.to),
            (accountId = params.accountId),
            (threadId = params.threadId),
            (ctx = params.ctx));
          return [
            4 /*yield*/,
            withSessionStoreLock(storePath, function () {
              return __awaiter(_this, void 0, void 0, function () {
                var store,
                  existing,
                  now,
                  explicitContext,
                  inlineContext,
                  mergedInput,
                  merged,
                  normalized,
                  metaPatch,
                  basePatch,
                  next;
                var _a;
                return __generator(this, function (_b) {
                  switch (_b.label) {
                    case 0:
                      store = loadSessionStore(storePath);
                      existing = store[sessionKey];
                      now = Date.now();
                      explicitContext = (0, delivery_context_js_1.normalizeDeliveryContext)(
                        params.deliveryContext,
                      );
                      inlineContext = (0, delivery_context_js_1.normalizeDeliveryContext)({
                        channel: channel,
                        to: to,
                        accountId: accountId,
                        threadId: threadId,
                      });
                      mergedInput = (0, delivery_context_js_1.mergeDeliveryContext)(
                        explicitContext,
                        inlineContext,
                      );
                      merged = (0, delivery_context_js_1.mergeDeliveryContext)(
                        mergedInput,
                        (0, delivery_context_js_1.deliveryContextFromSession)(existing),
                      );
                      normalized = (0, delivery_context_js_1.normalizeSessionDeliveryFields)({
                        deliveryContext: {
                          channel: merged === null || merged === void 0 ? void 0 : merged.channel,
                          to: merged === null || merged === void 0 ? void 0 : merged.to,
                          accountId:
                            merged === null || merged === void 0 ? void 0 : merged.accountId,
                          threadId: merged === null || merged === void 0 ? void 0 : merged.threadId,
                        },
                      });
                      metaPatch = ctx
                        ? (0, metadata_js_1.deriveSessionMetaPatch)({
                            ctx: ctx,
                            sessionKey: sessionKey,
                            existing: existing,
                            groupResolution: params.groupResolution,
                          })
                        : null;
                      basePatch = {
                        updatedAt: Math.max(
                          (_a =
                            existing === null || existing === void 0
                              ? void 0
                              : existing.updatedAt) !== null && _a !== void 0
                            ? _a
                            : 0,
                          now,
                        ),
                        deliveryContext: normalized.deliveryContext,
                        lastChannel: normalized.lastChannel,
                        lastTo: normalized.lastTo,
                        lastAccountId: normalized.lastAccountId,
                        lastThreadId: normalized.lastThreadId,
                      };
                      next = (0, types_js_1.mergeSessionEntry)(
                        existing,
                        metaPatch ? __assign(__assign({}, basePatch), metaPatch) : basePatch,
                      );
                      store[sessionKey] = next;
                      return [4 /*yield*/, saveSessionStoreUnlocked(storePath, store)];
                    case 1:
                      _b.sent();
                      return [2 /*return*/, next];
                  }
                });
              });
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
