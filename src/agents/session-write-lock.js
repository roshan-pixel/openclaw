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
exports.__testing = void 0;
exports.acquireSessionWriteLock = acquireSessionWriteLock;
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var HELD_LOCKS = new Map();
var CLEANUP_SIGNALS = ["SIGINT", "SIGTERM", "SIGQUIT", "SIGABRT"];
var cleanupHandlers = new Map();
function isAlive(pid) {
  if (!Number.isFinite(pid) || pid <= 0) {
    return false;
  }
  try {
    process.kill(pid, 0);
    return true;
  } catch (_a) {
    return false;
  }
}
/**
 * Synchronously release all held locks.
 * Used during process exit when async operations aren't reliable.
 */
function releaseAllLocksSync() {
  for (var _i = 0, HELD_LOCKS_1 = HELD_LOCKS; _i < HELD_LOCKS_1.length; _i++) {
    var _a = HELD_LOCKS_1[_i],
      sessionFile = _a[0],
      held = _a[1];
    try {
      if (typeof held.handle.close === "function") {
        void held.handle.close().catch(function () {});
      }
    } catch (_b) {
      // Ignore errors during cleanup - best effort
    }
    try {
      node_fs_1.default.rmSync(held.lockPath, { force: true });
    } catch (_c) {
      // Ignore errors during cleanup - best effort
    }
    HELD_LOCKS.delete(sessionFile);
  }
}
var cleanupRegistered = false;
function handleTerminationSignal(signal) {
  releaseAllLocksSync();
  var shouldReraise = process.listenerCount(signal) === 1;
  if (shouldReraise) {
    var handler = cleanupHandlers.get(signal);
    if (handler) {
      process.off(signal, handler);
    }
    try {
      process.kill(process.pid, signal);
    } catch (_a) {
      // Ignore errors during shutdown
    }
  }
}
function registerCleanupHandlers() {
  if (cleanupRegistered) {
    return;
  }
  cleanupRegistered = true;
  // Cleanup on normal exit and process.exit() calls
  process.on("exit", function () {
    releaseAllLocksSync();
  });
  var _loop_1 = function (signal) {
    try {
      var handler = function () {
        return handleTerminationSignal(signal);
      };
      cleanupHandlers.set(signal, handler);
      process.on(signal, handler);
    } catch (_a) {
      // Ignore unsupported signals on this platform.
    }
  };
  // Handle termination signals
  for (var _i = 0, CLEANUP_SIGNALS_1 = CLEANUP_SIGNALS; _i < CLEANUP_SIGNALS_1.length; _i++) {
    var signal = CLEANUP_SIGNALS_1[_i];
    _loop_1(signal);
  }
}
function readLockPayload(lockPath) {
  return __awaiter(this, void 0, void 0, function () {
    var raw, parsed, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          return [4 /*yield*/, promises_1.default.readFile(lockPath, "utf8")];
        case 1:
          raw = _b.sent();
          parsed = JSON.parse(raw);
          if (typeof parsed.pid !== "number") {
            return [2 /*return*/, null];
          }
          if (typeof parsed.createdAt !== "string") {
            return [2 /*return*/, null];
          }
          return [2 /*return*/, { pid: parsed.pid, createdAt: parsed.createdAt }];
        case 2:
          _a = _b.sent();
          return [2 /*return*/, null];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function acquireSessionWriteLock(params) {
  return __awaiter(this, void 0, void 0, function () {
    var timeoutMs,
      staleMs,
      sessionFile,
      sessionDir,
      normalizedDir,
      _a,
      normalizedSessionFile,
      lockPath,
      held,
      startedAt,
      attempt,
      _loop_2,
      state_1,
      payload,
      owner;
    var _this = this;
    var _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          registerCleanupHandlers();
          timeoutMs = (_b = params.timeoutMs) !== null && _b !== void 0 ? _b : 10000;
          staleMs = (_c = params.staleMs) !== null && _c !== void 0 ? _c : 30 * 60 * 1000;
          sessionFile = node_path_1.default.resolve(params.sessionFile);
          sessionDir = node_path_1.default.dirname(sessionFile);
          return [4 /*yield*/, promises_1.default.mkdir(sessionDir, { recursive: true })];
        case 1:
          _d.sent();
          normalizedDir = sessionDir;
          _d.label = 2;
        case 2:
          _d.trys.push([2, 4, , 5]);
          return [4 /*yield*/, promises_1.default.realpath(sessionDir)];
        case 3:
          normalizedDir = _d.sent();
          return [3 /*break*/, 5];
        case 4:
          _a = _d.sent();
          return [3 /*break*/, 5];
        case 5:
          normalizedSessionFile = node_path_1.default.join(
            normalizedDir,
            node_path_1.default.basename(sessionFile),
          );
          lockPath = "".concat(normalizedSessionFile, ".lock");
          held = HELD_LOCKS.get(normalizedSessionFile);
          if (held) {
            held.count += 1;
            return [
              2 /*return*/,
              {
                release: function () {
                  return __awaiter(_this, void 0, void 0, function () {
                    var current;
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          current = HELD_LOCKS.get(normalizedSessionFile);
                          if (!current) {
                            return [2 /*return*/];
                          }
                          current.count -= 1;
                          if (current.count > 0) {
                            return [2 /*return*/];
                          }
                          HELD_LOCKS.delete(normalizedSessionFile);
                          return [4 /*yield*/, current.handle.close()];
                        case 1:
                          _a.sent();
                          return [
                            4 /*yield*/,
                            promises_1.default.rm(current.lockPath, { force: true }),
                          ];
                        case 2:
                          _a.sent();
                          return [2 /*return*/];
                      }
                    });
                  });
                },
              },
            ];
          }
          startedAt = Date.now();
          attempt = 0;
          _loop_2 = function () {
            var handle, err_1, code, payload_1, createdAt, stale, alive, delay_1;
            return __generator(this, function (_e) {
              switch (_e.label) {
                case 0:
                  attempt += 1;
                  _e.label = 1;
                case 1:
                  _e.trys.push([1, 4, , 9]);
                  return [4 /*yield*/, promises_1.default.open(lockPath, "wx")];
                case 2:
                  handle = _e.sent();
                  return [
                    4 /*yield*/,
                    handle.writeFile(
                      JSON.stringify(
                        { pid: process.pid, createdAt: new Date().toISOString() },
                        null,
                        2,
                      ),
                      "utf8",
                    ),
                  ];
                case 3:
                  _e.sent();
                  HELD_LOCKS.set(normalizedSessionFile, {
                    count: 1,
                    handle: handle,
                    lockPath: lockPath,
                  });
                  return [
                    2 /*return*/,
                    {
                      value: {
                        release: function () {
                          return __awaiter(_this, void 0, void 0, function () {
                            var current;
                            return __generator(this, function (_a) {
                              switch (_a.label) {
                                case 0:
                                  current = HELD_LOCKS.get(normalizedSessionFile);
                                  if (!current) {
                                    return [2 /*return*/];
                                  }
                                  current.count -= 1;
                                  if (current.count > 0) {
                                    return [2 /*return*/];
                                  }
                                  HELD_LOCKS.delete(normalizedSessionFile);
                                  return [4 /*yield*/, current.handle.close()];
                                case 1:
                                  _a.sent();
                                  return [
                                    4 /*yield*/,
                                    promises_1.default.rm(current.lockPath, { force: true }),
                                  ];
                                case 2:
                                  _a.sent();
                                  return [2 /*return*/];
                              }
                            });
                          });
                        },
                      },
                    },
                  ];
                case 4:
                  err_1 = _e.sent();
                  code = err_1.code;
                  if (code !== "EEXIST") {
                    throw err_1;
                  }
                  return [4 /*yield*/, readLockPayload(lockPath)];
                case 5:
                  payload_1 = _e.sent();
                  createdAt = (
                    payload_1 === null || payload_1 === void 0 ? void 0 : payload_1.createdAt
                  )
                    ? Date.parse(payload_1.createdAt)
                    : NaN;
                  stale = !Number.isFinite(createdAt) || Date.now() - createdAt > staleMs;
                  alive = (payload_1 === null || payload_1 === void 0 ? void 0 : payload_1.pid)
                    ? isAlive(payload_1.pid)
                    : false;
                  if (!(stale || !alive)) {
                    return [3 /*break*/, 7];
                  }
                  return [4 /*yield*/, promises_1.default.rm(lockPath, { force: true })];
                case 6:
                  _e.sent();
                  return [2 /*return*/, "continue"];
                case 7:
                  delay_1 = Math.min(1000, 50 * attempt);
                  return [
                    4 /*yield*/,
                    new Promise(function (r) {
                      return setTimeout(r, delay_1);
                    }),
                  ];
                case 8:
                  _e.sent();
                  return [3 /*break*/, 9];
                case 9:
                  return [2 /*return*/];
              }
            });
          };
          _d.label = 6;
        case 6:
          if (!(Date.now() - startedAt < timeoutMs)) {
            return [3 /*break*/, 8];
          }
          return [5 /*yield**/, _loop_2()];
        case 7:
          state_1 = _d.sent();
          if (typeof state_1 === "object") {
            return [2 /*return*/, state_1.value];
          }
          return [3 /*break*/, 6];
        case 8:
          return [4 /*yield*/, readLockPayload(lockPath)];
        case 9:
          payload = _d.sent();
          owner = (payload === null || payload === void 0 ? void 0 : payload.pid)
            ? "pid=".concat(payload.pid)
            : "unknown";
          throw new Error(
            "session file locked (timeout "
              .concat(timeoutMs, "ms): ")
              .concat(owner, " ")
              .concat(lockPath),
          );
      }
    });
  });
}
exports.__testing = {
  cleanupSignals: __spreadArray([], CLEANUP_SIGNALS, true),
  handleTerminationSignal: handleTerminationSignal,
  releaseAllLocksSync: releaseAllLocksSync,
};
