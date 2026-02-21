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
exports.listNodePairing = listNodePairing;
exports.getPairedNode = getPairedNode;
exports.requestNodePairing = requestNodePairing;
exports.approveNodePairing = approveNodePairing;
exports.rejectNodePairing = rejectNodePairing;
exports.verifyNodeToken = verifyNodeToken;
exports.updatePairedNodeMetadata = updatePairedNodeMetadata;
exports.renamePairedNode = renamePairedNode;
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var paths_js_1 = require("../config/paths.js");
var PENDING_TTL_MS = 5 * 60 * 1000;
function resolvePaths(baseDir) {
  var root = baseDir !== null && baseDir !== void 0 ? baseDir : (0, paths_js_1.resolveStateDir)();
  var dir = node_path_1.default.join(root, "nodes");
  return {
    dir: dir,
    pendingPath: node_path_1.default.join(dir, "pending.json"),
    pairedPath: node_path_1.default.join(dir, "paired.json"),
  };
}
function readJSON(filePath) {
  return __awaiter(this, void 0, void 0, function () {
    var raw, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          return [4 /*yield*/, promises_1.default.readFile(filePath, "utf8")];
        case 1:
          raw = _b.sent();
          return [2 /*return*/, JSON.parse(raw)];
        case 2:
          _a = _b.sent();
          return [2 /*return*/, null];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function writeJSONAtomic(filePath, value) {
  return __awaiter(this, void 0, void 0, function () {
    var dir, tmp, _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          dir = node_path_1.default.dirname(filePath);
          return [4 /*yield*/, promises_1.default.mkdir(dir, { recursive: true })];
        case 1:
          _c.sent();
          tmp = "".concat(filePath, ".").concat((0, node_crypto_1.randomUUID)(), ".tmp");
          return [
            4 /*yield*/,
            promises_1.default.writeFile(tmp, JSON.stringify(value, null, 2), "utf8"),
          ];
        case 2:
          _c.sent();
          _c.label = 3;
        case 3:
          _c.trys.push([3, 5, , 6]);
          return [4 /*yield*/, promises_1.default.chmod(tmp, 384)];
        case 4:
          _c.sent();
          return [3 /*break*/, 6];
        case 5:
          _a = _c.sent();
          return [3 /*break*/, 6];
        case 6:
          return [4 /*yield*/, promises_1.default.rename(tmp, filePath)];
        case 7:
          _c.sent();
          _c.label = 8;
        case 8:
          _c.trys.push([8, 10, , 11]);
          return [4 /*yield*/, promises_1.default.chmod(filePath, 384)];
        case 9:
          _c.sent();
          return [3 /*break*/, 11];
        case 10:
          _b = _c.sent();
          return [3 /*break*/, 11];
        case 11:
          return [2 /*return*/];
      }
    });
  });
}
function pruneExpiredPending(pendingById, nowMs) {
  for (var _i = 0, _a = Object.entries(pendingById); _i < _a.length; _i++) {
    var _b = _a[_i],
      id = _b[0],
      req = _b[1];
    if (nowMs - req.ts > PENDING_TTL_MS) {
      delete pendingById[id];
    }
  }
}
var lock = Promise.resolve();
function withLock(fn) {
  return __awaiter(this, void 0, void 0, function () {
    var prev, release;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          prev = lock;
          lock = new Promise(function (resolve) {
            release = resolve;
          });
          return [4 /*yield*/, prev];
        case 1:
          _a.sent();
          _a.label = 2;
        case 2:
          _a.trys.push([2, , 4, 5]);
          return [4 /*yield*/, fn()];
        case 3:
          return [2 /*return*/, _a.sent()];
        case 4:
          release === null || release === void 0 ? void 0 : release();
          return [7 /*endfinally*/];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function loadState(baseDir) {
  return __awaiter(this, void 0, void 0, function () {
    var _a, pendingPath, pairedPath, _b, pending, paired, state;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          ((_a = resolvePaths(baseDir)),
            (pendingPath = _a.pendingPath),
            (pairedPath = _a.pairedPath));
          return [4 /*yield*/, Promise.all([readJSON(pendingPath), readJSON(pairedPath)])];
        case 1:
          ((_b = _c.sent()), (pending = _b[0]), (paired = _b[1]));
          state = {
            pendingById: pending !== null && pending !== void 0 ? pending : {},
            pairedByNodeId: paired !== null && paired !== void 0 ? paired : {},
          };
          pruneExpiredPending(state.pendingById, Date.now());
          return [2 /*return*/, state];
      }
    });
  });
}
function persistState(state, baseDir) {
  return __awaiter(this, void 0, void 0, function () {
    var _a, pendingPath, pairedPath;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ((_a = resolvePaths(baseDir)),
            (pendingPath = _a.pendingPath),
            (pairedPath = _a.pairedPath));
          return [
            4 /*yield*/,
            Promise.all([
              writeJSONAtomic(pendingPath, state.pendingById),
              writeJSONAtomic(pairedPath, state.pairedByNodeId),
            ]),
          ];
        case 1:
          _b.sent();
          return [2 /*return*/];
      }
    });
  });
}
function normalizeNodeId(nodeId) {
  return nodeId.trim();
}
function newToken() {
  return (0, node_crypto_1.randomUUID)().replaceAll("-", "");
}
function listNodePairing(baseDir) {
  return __awaiter(this, void 0, void 0, function () {
    var state, pending, paired;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, loadState(baseDir)];
        case 1:
          state = _a.sent();
          pending = Object.values(state.pendingById).toSorted(function (a, b) {
            return b.ts - a.ts;
          });
          paired = Object.values(state.pairedByNodeId).toSorted(function (a, b) {
            return b.approvedAtMs - a.approvedAtMs;
          });
          return [2 /*return*/, { pending: pending, paired: paired }];
      }
    });
  });
}
function getPairedNode(nodeId, baseDir) {
  return __awaiter(this, void 0, void 0, function () {
    var state;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, loadState(baseDir)];
        case 1:
          state = _b.sent();
          return [
            2 /*return*/,
            (_a = state.pairedByNodeId[normalizeNodeId(nodeId)]) !== null && _a !== void 0
              ? _a
              : null,
          ];
      }
    });
  });
}
function requestNodePairing(req, baseDir) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            withLock(function () {
              return __awaiter(_this, void 0, void 0, function () {
                var state, nodeId, existing, isRepair, request;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4 /*yield*/, loadState(baseDir)];
                    case 1:
                      state = _a.sent();
                      nodeId = normalizeNodeId(req.nodeId);
                      if (!nodeId) {
                        throw new Error("nodeId required");
                      }
                      existing = Object.values(state.pendingById).find(function (p) {
                        return p.nodeId === nodeId;
                      });
                      if (existing) {
                        return [
                          2 /*return*/,
                          { status: "pending", request: existing, created: false },
                        ];
                      }
                      isRepair = Boolean(state.pairedByNodeId[nodeId]);
                      request = {
                        requestId: (0, node_crypto_1.randomUUID)(),
                        nodeId: nodeId,
                        displayName: req.displayName,
                        platform: req.platform,
                        version: req.version,
                        coreVersion: req.coreVersion,
                        uiVersion: req.uiVersion,
                        deviceFamily: req.deviceFamily,
                        modelIdentifier: req.modelIdentifier,
                        caps: req.caps,
                        commands: req.commands,
                        permissions: req.permissions,
                        remoteIp: req.remoteIp,
                        silent: req.silent,
                        isRepair: isRepair,
                        ts: Date.now(),
                      };
                      state.pendingById[request.requestId] = request;
                      return [4 /*yield*/, persistState(state, baseDir)];
                    case 2:
                      _a.sent();
                      return [2 /*return*/, { status: "pending", request: request, created: true }];
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
function approveNodePairing(requestId, baseDir) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            withLock(function () {
              return __awaiter(_this, void 0, void 0, function () {
                var state, pending, now, existing, node;
                var _a;
                return __generator(this, function (_b) {
                  switch (_b.label) {
                    case 0:
                      return [4 /*yield*/, loadState(baseDir)];
                    case 1:
                      state = _b.sent();
                      pending = state.pendingById[requestId];
                      if (!pending) {
                        return [2 /*return*/, null];
                      }
                      now = Date.now();
                      existing = state.pairedByNodeId[pending.nodeId];
                      node = {
                        nodeId: pending.nodeId,
                        token: newToken(),
                        displayName: pending.displayName,
                        platform: pending.platform,
                        version: pending.version,
                        coreVersion: pending.coreVersion,
                        uiVersion: pending.uiVersion,
                        deviceFamily: pending.deviceFamily,
                        modelIdentifier: pending.modelIdentifier,
                        caps: pending.caps,
                        commands: pending.commands,
                        permissions: pending.permissions,
                        remoteIp: pending.remoteIp,
                        createdAtMs:
                          (_a =
                            existing === null || existing === void 0
                              ? void 0
                              : existing.createdAtMs) !== null && _a !== void 0
                            ? _a
                            : now,
                        approvedAtMs: now,
                      };
                      delete state.pendingById[requestId];
                      state.pairedByNodeId[pending.nodeId] = node;
                      return [4 /*yield*/, persistState(state, baseDir)];
                    case 2:
                      _b.sent();
                      return [2 /*return*/, { requestId: requestId, node: node }];
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
function rejectNodePairing(requestId, baseDir) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            withLock(function () {
              return __awaiter(_this, void 0, void 0, function () {
                var state, pending;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4 /*yield*/, loadState(baseDir)];
                    case 1:
                      state = _a.sent();
                      pending = state.pendingById[requestId];
                      if (!pending) {
                        return [2 /*return*/, null];
                      }
                      delete state.pendingById[requestId];
                      return [4 /*yield*/, persistState(state, baseDir)];
                    case 2:
                      _a.sent();
                      return [2 /*return*/, { requestId: requestId, nodeId: pending.nodeId }];
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
function verifyNodeToken(nodeId, token, baseDir) {
  return __awaiter(this, void 0, void 0, function () {
    var state, normalized, node;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, loadState(baseDir)];
        case 1:
          state = _a.sent();
          normalized = normalizeNodeId(nodeId);
          node = state.pairedByNodeId[normalized];
          if (!node) {
            return [2 /*return*/, { ok: false }];
          }
          return [2 /*return*/, node.token === token ? { ok: true, node: node } : { ok: false }];
      }
    });
  });
}
function updatePairedNodeMetadata(nodeId, patch, baseDir) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            withLock(function () {
              return __awaiter(_this, void 0, void 0, function () {
                var state, normalized, existing, next;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                return __generator(this, function (_p) {
                  switch (_p.label) {
                    case 0:
                      return [4 /*yield*/, loadState(baseDir)];
                    case 1:
                      state = _p.sent();
                      normalized = normalizeNodeId(nodeId);
                      existing = state.pairedByNodeId[normalized];
                      if (!existing) {
                        return [2 /*return*/];
                      }
                      next = __assign(__assign({}, existing), {
                        displayName:
                          (_a = patch.displayName) !== null && _a !== void 0
                            ? _a
                            : existing.displayName,
                        platform:
                          (_b = patch.platform) !== null && _b !== void 0 ? _b : existing.platform,
                        version:
                          (_c = patch.version) !== null && _c !== void 0 ? _c : existing.version,
                        coreVersion:
                          (_d = patch.coreVersion) !== null && _d !== void 0
                            ? _d
                            : existing.coreVersion,
                        uiVersion:
                          (_e = patch.uiVersion) !== null && _e !== void 0
                            ? _e
                            : existing.uiVersion,
                        deviceFamily:
                          (_f = patch.deviceFamily) !== null && _f !== void 0
                            ? _f
                            : existing.deviceFamily,
                        modelIdentifier:
                          (_g = patch.modelIdentifier) !== null && _g !== void 0
                            ? _g
                            : existing.modelIdentifier,
                        remoteIp:
                          (_h = patch.remoteIp) !== null && _h !== void 0 ? _h : existing.remoteIp,
                        caps: (_j = patch.caps) !== null && _j !== void 0 ? _j : existing.caps,
                        commands:
                          (_k = patch.commands) !== null && _k !== void 0 ? _k : existing.commands,
                        bins: (_l = patch.bins) !== null && _l !== void 0 ? _l : existing.bins,
                        permissions:
                          (_m = patch.permissions) !== null && _m !== void 0
                            ? _m
                            : existing.permissions,
                        lastConnectedAtMs:
                          (_o = patch.lastConnectedAtMs) !== null && _o !== void 0
                            ? _o
                            : existing.lastConnectedAtMs,
                      });
                      state.pairedByNodeId[normalized] = next;
                      return [4 /*yield*/, persistState(state, baseDir)];
                    case 2:
                      _p.sent();
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
function renamePairedNode(nodeId, displayName, baseDir) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            withLock(function () {
              return __awaiter(_this, void 0, void 0, function () {
                var state, normalized, existing, trimmed, next;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4 /*yield*/, loadState(baseDir)];
                    case 1:
                      state = _a.sent();
                      normalized = normalizeNodeId(nodeId);
                      existing = state.pairedByNodeId[normalized];
                      if (!existing) {
                        return [2 /*return*/, null];
                      }
                      trimmed = displayName.trim();
                      if (!trimmed) {
                        throw new Error("displayName required");
                      }
                      next = __assign(__assign({}, existing), { displayName: trimmed });
                      state.pairedByNodeId[normalized] = next;
                      return [4 /*yield*/, persistState(state, baseDir)];
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
