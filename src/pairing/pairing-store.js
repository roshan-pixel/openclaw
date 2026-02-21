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
exports.readChannelAllowFromStore = readChannelAllowFromStore;
exports.addChannelAllowFromStoreEntry = addChannelAllowFromStoreEntry;
exports.removeChannelAllowFromStoreEntry = removeChannelAllowFromStoreEntry;
exports.listChannelPairingRequests = listChannelPairingRequests;
exports.upsertChannelPairingRequest = upsertChannelPairingRequest;
exports.approveChannelPairingCode = approveChannelPairingCode;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var proper_lockfile_1 = require("proper-lockfile");
var pairing_js_1 = require("../channels/plugins/pairing.js");
var paths_js_1 = require("../config/paths.js");
var PAIRING_CODE_LENGTH = 8;
var PAIRING_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
var PAIRING_PENDING_TTL_MS = 60 * 60 * 1000;
var PAIRING_PENDING_MAX = 3;
var PAIRING_STORE_LOCK_OPTIONS = {
  retries: {
    retries: 10,
    factor: 2,
    minTimeout: 100,
    maxTimeout: 10000,
    randomize: true,
  },
  stale: 30000,
};
function resolveCredentialsDir(env) {
  if (env === void 0) {
    env = process.env;
  }
  var stateDir = (0, paths_js_1.resolveStateDir)(env, node_os_1.default.homedir);
  return (0, paths_js_1.resolveOAuthDir)(env, stateDir);
}
/** Sanitize channel ID for use in filenames (prevent path traversal). */
function safeChannelKey(channel) {
  var raw = String(channel).trim().toLowerCase();
  if (!raw) {
    throw new Error("invalid pairing channel");
  }
  var safe = raw.replace(/[\\/:*?"<>|]/g, "_").replace(/\.\./g, "_");
  if (!safe || safe === "_") {
    throw new Error("invalid pairing channel");
  }
  return safe;
}
function resolvePairingPath(channel, env) {
  if (env === void 0) {
    env = process.env;
  }
  return node_path_1.default.join(
    resolveCredentialsDir(env),
    "".concat(safeChannelKey(channel), "-pairing.json"),
  );
}
function resolveAllowFromPath(channel, env) {
  if (env === void 0) {
    env = process.env;
  }
  return node_path_1.default.join(
    resolveCredentialsDir(env),
    "".concat(safeChannelKey(channel), "-allowFrom.json"),
  );
}
function safeParseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch (_a) {
    return null;
  }
}
function readJsonFile(filePath, fallback) {
  return __awaiter(this, void 0, void 0, function () {
    var raw, parsed, err_1, code;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          return [4 /*yield*/, node_fs_1.default.promises.readFile(filePath, "utf-8")];
        case 1:
          raw = _a.sent();
          parsed = safeParseJson(raw);
          if (parsed == null) {
            return [2 /*return*/, { value: fallback, exists: true }];
          }
          return [2 /*return*/, { value: parsed, exists: true }];
        case 2:
          err_1 = _a.sent();
          code = err_1.code;
          if (code === "ENOENT") {
            return [2 /*return*/, { value: fallback, exists: false }];
          }
          return [2 /*return*/, { value: fallback, exists: false }];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function writeJsonFile(filePath, value) {
  return __awaiter(this, void 0, void 0, function () {
    var dir, tmp;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          dir = node_path_1.default.dirname(filePath);
          return [
            4 /*yield*/,
            node_fs_1.default.promises.mkdir(dir, { recursive: true, mode: 448 }),
          ];
        case 1:
          _a.sent();
          tmp = node_path_1.default.join(
            dir,
            ""
              .concat(node_path_1.default.basename(filePath), ".")
              .concat(node_crypto_1.default.randomUUID(), ".tmp"),
          );
          return [
            4 /*yield*/,
            node_fs_1.default.promises.writeFile(
              tmp,
              "".concat(JSON.stringify(value, null, 2), "\n"),
              {
                encoding: "utf-8",
              },
            ),
          ];
        case 2:
          _a.sent();
          return [4 /*yield*/, node_fs_1.default.promises.chmod(tmp, 384)];
        case 3:
          _a.sent();
          return [4 /*yield*/, node_fs_1.default.promises.rename(tmp, filePath)];
        case 4:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function ensureJsonFile(filePath, fallback) {
  return __awaiter(this, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 4]);
          return [4 /*yield*/, node_fs_1.default.promises.access(filePath)];
        case 1:
          _b.sent();
          return [3 /*break*/, 4];
        case 2:
          _a = _b.sent();
          return [4 /*yield*/, writeJsonFile(filePath, fallback)];
        case 3:
          _b.sent();
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function withFileLock(filePath, fallback, fn) {
  return __awaiter(this, void 0, void 0, function () {
    var release, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, ensureJsonFile(filePath, fallback)];
        case 1:
          _b.sent();
          _b.label = 2;
        case 2:
          _b.trys.push([2, , 5, 10]);
          return [
            4 /*yield*/,
            proper_lockfile_1.default.lock(filePath, PAIRING_STORE_LOCK_OPTIONS),
          ];
        case 3:
          release = _b.sent();
          return [4 /*yield*/, fn()];
        case 4:
          return [2 /*return*/, _b.sent()];
        case 5:
          if (!release) {
            return [3 /*break*/, 9];
          }
          _b.label = 6;
        case 6:
          _b.trys.push([6, 8, , 9]);
          return [4 /*yield*/, release()];
        case 7:
          _b.sent();
          return [3 /*break*/, 9];
        case 8:
          _a = _b.sent();
          return [3 /*break*/, 9];
        case 9:
          return [7 /*endfinally*/];
        case 10:
          return [2 /*return*/];
      }
    });
  });
}
function parseTimestamp(value) {
  if (!value) {
    return null;
  }
  var parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
}
function isExpired(entry, nowMs) {
  var createdAt = parseTimestamp(entry.createdAt);
  if (!createdAt) {
    return true;
  }
  return nowMs - createdAt > PAIRING_PENDING_TTL_MS;
}
function pruneExpiredRequests(reqs, nowMs) {
  var kept = [];
  var removed = false;
  for (var _i = 0, reqs_1 = reqs; _i < reqs_1.length; _i++) {
    var req = reqs_1[_i];
    if (isExpired(req, nowMs)) {
      removed = true;
      continue;
    }
    kept.push(req);
  }
  return { requests: kept, removed: removed };
}
function resolveLastSeenAt(entry) {
  var _a, _b;
  return (_b =
    (_a = parseTimestamp(entry.lastSeenAt)) !== null && _a !== void 0
      ? _a
      : parseTimestamp(entry.createdAt)) !== null && _b !== void 0
    ? _b
    : 0;
}
function pruneExcessRequests(reqs, maxPending) {
  if (maxPending <= 0 || reqs.length <= maxPending) {
    return { requests: reqs, removed: false };
  }
  var sorted = reqs.slice().toSorted(function (a, b) {
    return resolveLastSeenAt(a) - resolveLastSeenAt(b);
  });
  return { requests: sorted.slice(-maxPending), removed: true };
}
function randomCode() {
  // Human-friendly: 8 chars, upper, no ambiguous chars (0O1I).
  var out = "";
  for (var i = 0; i < PAIRING_CODE_LENGTH; i++) {
    var idx = node_crypto_1.default.randomInt(0, PAIRING_CODE_ALPHABET.length);
    out += PAIRING_CODE_ALPHABET[idx];
  }
  return out;
}
function generateUniqueCode(existing) {
  for (var attempt = 0; attempt < 500; attempt += 1) {
    var code = randomCode();
    if (!existing.has(code)) {
      return code;
    }
  }
  throw new Error("failed to generate unique pairing code");
}
function normalizeId(value) {
  return String(value).trim();
}
function normalizeAllowEntry(channel, entry) {
  var trimmed = entry.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed === "*") {
    return "";
  }
  var adapter = (0, pairing_js_1.getPairingAdapter)(channel);
  var normalized = (adapter === null || adapter === void 0 ? void 0 : adapter.normalizeAllowEntry)
    ? adapter.normalizeAllowEntry(trimmed)
    : trimmed;
  return String(normalized).trim();
}
function readChannelAllowFromStore(channel_1) {
  return __awaiter(this, arguments, void 0, function (channel, env) {
    var filePath, value, list;
    if (env === void 0) {
      env = process.env;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          filePath = resolveAllowFromPath(channel, env);
          return [
            4 /*yield*/,
            readJsonFile(filePath, {
              version: 1,
              allowFrom: [],
            }),
          ];
        case 1:
          value = _a.sent().value;
          list = Array.isArray(value.allowFrom) ? value.allowFrom : [];
          return [
            2 /*return*/,
            list
              .map(function (v) {
                return normalizeAllowEntry(channel, String(v));
              })
              .filter(Boolean),
          ];
      }
    });
  });
}
function addChannelAllowFromStoreEntry(params) {
  return __awaiter(this, void 0, void 0, function () {
    var env, filePath;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
          filePath = resolveAllowFromPath(params.channel, env);
          return [
            4 /*yield*/,
            withFileLock(filePath, { version: 1, allowFrom: [] }, function () {
              return __awaiter(_this, void 0, void 0, function () {
                var value, current, normalized, next;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [
                        4 /*yield*/,
                        readJsonFile(filePath, {
                          version: 1,
                          allowFrom: [],
                        }),
                      ];
                    case 1:
                      value = _a.sent().value;
                      current = (Array.isArray(value.allowFrom) ? value.allowFrom : [])
                        .map(function (v) {
                          return normalizeAllowEntry(params.channel, String(v));
                        })
                        .filter(Boolean);
                      normalized = normalizeAllowEntry(params.channel, normalizeId(params.entry));
                      if (!normalized) {
                        return [2 /*return*/, { changed: false, allowFrom: current }];
                      }
                      if (current.includes(normalized)) {
                        return [2 /*return*/, { changed: false, allowFrom: current }];
                      }
                      next = __spreadArray(__spreadArray([], current, true), [normalized], false);
                      return [
                        4 /*yield*/,
                        writeJsonFile(filePath, {
                          version: 1,
                          allowFrom: next,
                        }),
                      ];
                    case 2:
                      _a.sent();
                      return [2 /*return*/, { changed: true, allowFrom: next }];
                  }
                });
              });
            }),
          ];
        case 1:
          return [2 /*return*/, _b.sent()];
      }
    });
  });
}
function removeChannelAllowFromStoreEntry(params) {
  return __awaiter(this, void 0, void 0, function () {
    var env, filePath;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
          filePath = resolveAllowFromPath(params.channel, env);
          return [
            4 /*yield*/,
            withFileLock(filePath, { version: 1, allowFrom: [] }, function () {
              return __awaiter(_this, void 0, void 0, function () {
                var value, current, normalized, next;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [
                        4 /*yield*/,
                        readJsonFile(filePath, {
                          version: 1,
                          allowFrom: [],
                        }),
                      ];
                    case 1:
                      value = _a.sent().value;
                      current = (Array.isArray(value.allowFrom) ? value.allowFrom : [])
                        .map(function (v) {
                          return normalizeAllowEntry(params.channel, String(v));
                        })
                        .filter(Boolean);
                      normalized = normalizeAllowEntry(params.channel, normalizeId(params.entry));
                      if (!normalized) {
                        return [2 /*return*/, { changed: false, allowFrom: current }];
                      }
                      next = current.filter(function (entry) {
                        return entry !== normalized;
                      });
                      if (next.length === current.length) {
                        return [2 /*return*/, { changed: false, allowFrom: current }];
                      }
                      return [
                        4 /*yield*/,
                        writeJsonFile(filePath, {
                          version: 1,
                          allowFrom: next,
                        }),
                      ];
                    case 2:
                      _a.sent();
                      return [2 /*return*/, { changed: true, allowFrom: next }];
                  }
                });
              });
            }),
          ];
        case 1:
          return [2 /*return*/, _b.sent()];
      }
    });
  });
}
function listChannelPairingRequests(channel_1) {
  return __awaiter(this, arguments, void 0, function (channel, env) {
    var filePath;
    var _this = this;
    if (env === void 0) {
      env = process.env;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          filePath = resolvePairingPath(channel, env);
          return [
            4 /*yield*/,
            withFileLock(filePath, { version: 1, requests: [] }, function () {
              return __awaiter(_this, void 0, void 0, function () {
                var value,
                  reqs,
                  nowMs,
                  _a,
                  prunedExpired,
                  expiredRemoved,
                  _b,
                  pruned,
                  cappedRemoved;
                return __generator(this, function (_c) {
                  switch (_c.label) {
                    case 0:
                      return [
                        4 /*yield*/,
                        readJsonFile(filePath, {
                          version: 1,
                          requests: [],
                        }),
                      ];
                    case 1:
                      value = _c.sent().value;
                      reqs = Array.isArray(value.requests) ? value.requests : [];
                      nowMs = Date.now();
                      ((_a = pruneExpiredRequests(reqs, nowMs)),
                        (prunedExpired = _a.requests),
                        (expiredRemoved = _a.removed));
                      ((_b = pruneExcessRequests(prunedExpired, PAIRING_PENDING_MAX)),
                        (pruned = _b.requests),
                        (cappedRemoved = _b.removed));
                      if (!(expiredRemoved || cappedRemoved)) {
                        return [3 /*break*/, 3];
                      }
                      return [
                        4 /*yield*/,
                        writeJsonFile(filePath, {
                          version: 1,
                          requests: pruned,
                        }),
                      ];
                    case 2:
                      _c.sent();
                      _c.label = 3;
                    case 3:
                      return [
                        2 /*return*/,
                        pruned
                          .filter(function (r) {
                            return (
                              r &&
                              typeof r.id === "string" &&
                              typeof r.code === "string" &&
                              typeof r.createdAt === "string"
                            );
                          })
                          .slice()
                          .toSorted(function (a, b) {
                            return a.createdAt.localeCompare(b.createdAt);
                          }),
                      ];
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
function upsertChannelPairingRequest(params) {
  return __awaiter(this, void 0, void 0, function () {
    var env, filePath;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
          filePath = resolvePairingPath(params.channel, env);
          return [
            4 /*yield*/,
            withFileLock(filePath, { version: 1, requests: [] }, function () {
              return __awaiter(_this, void 0, void 0, function () {
                var value,
                  now,
                  nowMs,
                  id,
                  meta,
                  reqs,
                  _a,
                  prunedExpired,
                  expiredRemoved,
                  existingIdx,
                  existingCodes,
                  existing,
                  existingCode,
                  code_1,
                  next_1,
                  capped_1,
                  _b,
                  capped,
                  cappedRemoved,
                  code,
                  next;
                var _c;
                return __generator(this, function (_d) {
                  switch (_d.label) {
                    case 0:
                      return [
                        4 /*yield*/,
                        readJsonFile(filePath, {
                          version: 1,
                          requests: [],
                        }),
                      ];
                    case 1:
                      value = _d.sent().value;
                      now = new Date().toISOString();
                      nowMs = Date.now();
                      id = normalizeId(params.id);
                      meta =
                        params.meta && typeof params.meta === "object"
                          ? Object.fromEntries(
                              Object.entries(params.meta)
                                .map(function (_a) {
                                  var k = _a[0],
                                    v = _a[1];
                                  return [k, String(v !== null && v !== void 0 ? v : "").trim()];
                                })
                                .filter(function (_a) {
                                  var _ = _a[0],
                                    v = _a[1];
                                  return Boolean(v);
                                }),
                            )
                          : undefined;
                      reqs = Array.isArray(value.requests) ? value.requests : [];
                      ((_a = pruneExpiredRequests(reqs, nowMs)),
                        (prunedExpired = _a.requests),
                        (expiredRemoved = _a.removed));
                      reqs = prunedExpired;
                      existingIdx = reqs.findIndex(function (r) {
                        return r.id === id;
                      });
                      existingCodes = new Set(
                        reqs.map(function (req) {
                          var _a;
                          return String((_a = req.code) !== null && _a !== void 0 ? _a : "")
                            .trim()
                            .toUpperCase();
                        }),
                      );
                      if (!(existingIdx >= 0)) {
                        return [3 /*break*/, 3];
                      }
                      existing = reqs[existingIdx];
                      existingCode =
                        existing && typeof existing.code === "string" ? existing.code.trim() : "";
                      code_1 = existingCode || generateUniqueCode(existingCodes);
                      next_1 = {
                        id: id,
                        code: code_1,
                        createdAt:
                          (_c =
                            existing === null || existing === void 0
                              ? void 0
                              : existing.createdAt) !== null && _c !== void 0
                            ? _c
                            : now,
                        lastSeenAt: now,
                        meta:
                          meta !== null && meta !== void 0
                            ? meta
                            : existing === null || existing === void 0
                              ? void 0
                              : existing.meta,
                      };
                      reqs[existingIdx] = next_1;
                      capped_1 = pruneExcessRequests(reqs, PAIRING_PENDING_MAX).requests;
                      return [
                        4 /*yield*/,
                        writeJsonFile(filePath, {
                          version: 1,
                          requests: capped_1,
                        }),
                      ];
                    case 2:
                      _d.sent();
                      return [2 /*return*/, { code: code_1, created: false }];
                    case 3:
                      ((_b = pruneExcessRequests(reqs, PAIRING_PENDING_MAX)),
                        (capped = _b.requests),
                        (cappedRemoved = _b.removed));
                      reqs = capped;
                      if (!(PAIRING_PENDING_MAX > 0 && reqs.length >= PAIRING_PENDING_MAX)) {
                        return [3 /*break*/, 6];
                      }
                      if (!(expiredRemoved || cappedRemoved)) {
                        return [3 /*break*/, 5];
                      }
                      return [
                        4 /*yield*/,
                        writeJsonFile(filePath, {
                          version: 1,
                          requests: reqs,
                        }),
                      ];
                    case 4:
                      _d.sent();
                      _d.label = 5;
                    case 5:
                      return [2 /*return*/, { code: "", created: false }];
                    case 6:
                      code = generateUniqueCode(existingCodes);
                      next = __assign(
                        { id: id, code: code, createdAt: now, lastSeenAt: now },
                        meta ? { meta: meta } : {},
                      );
                      return [
                        4 /*yield*/,
                        writeJsonFile(filePath, {
                          version: 1,
                          requests: __spreadArray(__spreadArray([], reqs, true), [next], false),
                        }),
                      ];
                    case 7:
                      _d.sent();
                      return [2 /*return*/, { code: code, created: true }];
                  }
                });
              });
            }),
          ];
        case 1:
          return [2 /*return*/, _b.sent()];
      }
    });
  });
}
function approveChannelPairingCode(params) {
  return __awaiter(this, void 0, void 0, function () {
    var env, code, filePath;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
          code = params.code.trim().toUpperCase();
          if (!code) {
            return [2 /*return*/, null];
          }
          filePath = resolvePairingPath(params.channel, env);
          return [
            4 /*yield*/,
            withFileLock(filePath, { version: 1, requests: [] }, function () {
              return __awaiter(_this, void 0, void 0, function () {
                var value, reqs, nowMs, _a, pruned, removed, idx, entry;
                return __generator(this, function (_b) {
                  switch (_b.label) {
                    case 0:
                      return [
                        4 /*yield*/,
                        readJsonFile(filePath, {
                          version: 1,
                          requests: [],
                        }),
                      ];
                    case 1:
                      value = _b.sent().value;
                      reqs = Array.isArray(value.requests) ? value.requests : [];
                      nowMs = Date.now();
                      ((_a = pruneExpiredRequests(reqs, nowMs)),
                        (pruned = _a.requests),
                        (removed = _a.removed));
                      idx = pruned.findIndex(function (r) {
                        var _a;
                        return (
                          String(
                            (_a = r.code) !== null && _a !== void 0 ? _a : "",
                          ).toUpperCase() === code
                        );
                      });
                      if (!(idx < 0)) {
                        return [3 /*break*/, 4];
                      }
                      if (!removed) {
                        return [3 /*break*/, 3];
                      }
                      return [
                        4 /*yield*/,
                        writeJsonFile(filePath, {
                          version: 1,
                          requests: pruned,
                        }),
                      ];
                    case 2:
                      _b.sent();
                      _b.label = 3;
                    case 3:
                      return [2 /*return*/, null];
                    case 4:
                      entry = pruned[idx];
                      if (!entry) {
                        return [2 /*return*/, null];
                      }
                      pruned.splice(idx, 1);
                      return [
                        4 /*yield*/,
                        writeJsonFile(filePath, {
                          version: 1,
                          requests: pruned,
                        }),
                      ];
                    case 5:
                      _b.sent();
                      return [
                        4 /*yield*/,
                        addChannelAllowFromStoreEntry({
                          channel: params.channel,
                          entry: entry.id,
                          env: env,
                        }),
                      ];
                    case 6:
                      _b.sent();
                      return [2 /*return*/, { id: entry.id, entry: entry }];
                  }
                });
              });
            }),
          ];
        case 1:
          return [2 /*return*/, _b.sent()];
      }
    });
  });
}
