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
exports.registerSubagentRun = registerSubagentRun;
exports.resetSubagentRegistryForTests = resetSubagentRegistryForTests;
exports.addSubagentRunForTests = addSubagentRunForTests;
exports.releaseSubagentRun = releaseSubagentRun;
exports.listSubagentRunsForRequester = listSubagentRunsForRequester;
exports.initSubagentRegistry = initSubagentRegistry;
var config_js_1 = require("../config/config.js");
var call_js_1 = require("../gateway/call.js");
var agent_events_js_1 = require("../infra/agent-events.js");
var delivery_context_js_1 = require("../utils/delivery-context.js");
var subagent_announce_js_1 = require("./subagent-announce.js");
var subagent_registry_store_js_1 = require("./subagent-registry.store.js");
var timeout_js_1 = require("./timeout.js");
var subagentRuns = new Map();
var sweeper = null;
var listenerStarted = false;
var listenerStop = null;
// Use var to avoid TDZ when init runs across circular imports during bootstrap.
var restoreAttempted = false;
function persistSubagentRuns() {
  try {
    (0, subagent_registry_store_js_1.saveSubagentRegistryToDisk)(subagentRuns);
  } catch (_a) {
    // ignore persistence failures
  }
}
var resumedRuns = new Set();
function resumeSubagentRun(runId) {
  if (!runId || resumedRuns.has(runId)) {
    return;
  }
  var entry = subagentRuns.get(runId);
  if (!entry) {
    return;
  }
  if (entry.cleanupCompletedAt) {
    return;
  }
  if (typeof entry.endedAt === "number" && entry.endedAt > 0) {
    if (!beginSubagentCleanup(runId)) {
      return;
    }
    var requesterOrigin = (0, delivery_context_js_1.normalizeDeliveryContext)(
      entry.requesterOrigin,
    );
    void (0, subagent_announce_js_1.runSubagentAnnounceFlow)({
      childSessionKey: entry.childSessionKey,
      childRunId: entry.runId,
      requesterSessionKey: entry.requesterSessionKey,
      requesterOrigin: requesterOrigin,
      requesterDisplayKey: entry.requesterDisplayKey,
      task: entry.task,
      timeoutMs: 30000,
      cleanup: entry.cleanup,
      waitForCompletion: false,
      startedAt: entry.startedAt,
      endedAt: entry.endedAt,
      label: entry.label,
      outcome: entry.outcome,
    }).then(function (didAnnounce) {
      finalizeSubagentCleanup(runId, entry.cleanup, didAnnounce);
    });
    resumedRuns.add(runId);
    return;
  }
  // Wait for completion again after restart.
  var cfg = (0, config_js_1.loadConfig)();
  var waitTimeoutMs = resolveSubagentWaitTimeoutMs(cfg, undefined);
  void waitForSubagentCompletion(runId, waitTimeoutMs);
  resumedRuns.add(runId);
}
function restoreSubagentRunsOnce() {
  if (restoreAttempted) {
    return;
  }
  restoreAttempted = true;
  try {
    var restored = (0, subagent_registry_store_js_1.loadSubagentRegistryFromDisk)();
    if (restored.size === 0) {
      return;
    }
    for (var _i = 0, _a = restored.entries(); _i < _a.length; _i++) {
      var _b = _a[_i],
        runId = _b[0],
        entry = _b[1];
      if (!runId || !entry) {
        continue;
      }
      // Keep any newer in-memory entries.
      if (!subagentRuns.has(runId)) {
        subagentRuns.set(runId, entry);
      }
    }
    // Resume pending work.
    ensureListener();
    if (
      __spreadArray([], subagentRuns.values(), true).some(function (entry) {
        return entry.archiveAtMs;
      })
    ) {
      startSweeper();
    }
    for (var _c = 0, _d = subagentRuns.keys(); _c < _d.length; _c++) {
      var runId = _d[_c];
      resumeSubagentRun(runId);
    }
  } catch (_e) {
    // ignore restore failures
  }
}
function resolveArchiveAfterMs(cfg) {
  var _a, _b, _c, _d;
  var config = cfg !== null && cfg !== void 0 ? cfg : (0, config_js_1.loadConfig)();
  var minutes =
    (_d =
      (_c =
        (_b = (_a = config.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null ||
        _b === void 0
          ? void 0
          : _b.subagents) === null || _c === void 0
        ? void 0
        : _c.archiveAfterMinutes) !== null && _d !== void 0
      ? _d
      : 60;
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return undefined;
  }
  return Math.max(1, Math.floor(minutes)) * 60000;
}
function resolveSubagentWaitTimeoutMs(cfg, runTimeoutSeconds) {
  return (0, timeout_js_1.resolveAgentTimeoutMs)({ cfg: cfg, overrideSeconds: runTimeoutSeconds });
}
function startSweeper() {
  var _a;
  if (sweeper) {
    return;
  }
  sweeper = setInterval(function () {
    void sweepSubagentRuns();
  }, 60000);
  (_a = sweeper.unref) === null || _a === void 0 ? void 0 : _a.call(sweeper);
}
function stopSweeper() {
  if (!sweeper) {
    return;
  }
  clearInterval(sweeper);
  sweeper = null;
}
function sweepSubagentRuns() {
  return __awaiter(this, void 0, void 0, function () {
    var now, mutated, _i, _a, _b, runId, entry, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          now = Date.now();
          mutated = false;
          ((_i = 0), (_a = subagentRuns.entries()));
          _d.label = 1;
        case 1:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 6];
          }
          ((_b = _a[_i]), (runId = _b[0]), (entry = _b[1]));
          if (!entry.archiveAtMs || entry.archiveAtMs > now) {
            return [3 /*break*/, 5];
          }
          subagentRuns.delete(runId);
          mutated = true;
          _d.label = 2;
        case 2:
          _d.trys.push([2, 4, , 5]);
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              method: "sessions.delete",
              params: { key: entry.childSessionKey, deleteTranscript: true },
              timeoutMs: 10000,
            }),
          ];
        case 3:
          _d.sent();
          return [3 /*break*/, 5];
        case 4:
          _c = _d.sent();
          return [3 /*break*/, 5];
        case 5:
          _i++;
          return [3 /*break*/, 1];
        case 6:
          if (mutated) {
            persistSubagentRuns();
          }
          if (subagentRuns.size === 0) {
            stopSweeper();
          }
          return [2 /*return*/];
      }
    });
  });
}
function ensureListener() {
  if (listenerStarted) {
    return;
  }
  listenerStarted = true;
  listenerStop = (0, agent_events_js_1.onAgentEvent)(function (evt) {
    var _a, _b, _c, _d;
    if (!evt || evt.stream !== "lifecycle") {
      return;
    }
    var entry = subagentRuns.get(evt.runId);
    if (!entry) {
      return;
    }
    var phase = (_a = evt.data) === null || _a === void 0 ? void 0 : _a.phase;
    if (phase === "start") {
      var startedAt =
        typeof ((_b = evt.data) === null || _b === void 0 ? void 0 : _b.startedAt) === "number"
          ? evt.data.startedAt
          : undefined;
      if (startedAt) {
        entry.startedAt = startedAt;
        persistSubagentRuns();
      }
      return;
    }
    if (phase !== "end" && phase !== "error") {
      return;
    }
    var endedAt =
      typeof ((_c = evt.data) === null || _c === void 0 ? void 0 : _c.endedAt) === "number"
        ? evt.data.endedAt
        : Date.now();
    entry.endedAt = endedAt;
    if (phase === "error") {
      var error =
        typeof ((_d = evt.data) === null || _d === void 0 ? void 0 : _d.error) === "string"
          ? evt.data.error
          : undefined;
      entry.outcome = { status: "error", error: error };
    } else {
      entry.outcome = { status: "ok" };
    }
    persistSubagentRuns();
    if (!beginSubagentCleanup(evt.runId)) {
      return;
    }
    var requesterOrigin = (0, delivery_context_js_1.normalizeDeliveryContext)(
      entry.requesterOrigin,
    );
    void (0, subagent_announce_js_1.runSubagentAnnounceFlow)({
      childSessionKey: entry.childSessionKey,
      childRunId: entry.runId,
      requesterSessionKey: entry.requesterSessionKey,
      requesterOrigin: requesterOrigin,
      requesterDisplayKey: entry.requesterDisplayKey,
      task: entry.task,
      timeoutMs: 30000,
      cleanup: entry.cleanup,
      waitForCompletion: false,
      startedAt: entry.startedAt,
      endedAt: entry.endedAt,
      label: entry.label,
      outcome: entry.outcome,
    }).then(function (didAnnounce) {
      finalizeSubagentCleanup(evt.runId, entry.cleanup, didAnnounce);
    });
  });
}
function finalizeSubagentCleanup(runId, cleanup, didAnnounce) {
  var entry = subagentRuns.get(runId);
  if (!entry) {
    return;
  }
  if (cleanup === "delete") {
    subagentRuns.delete(runId);
    persistSubagentRuns();
    return;
  }
  if (!didAnnounce) {
    // Allow retry on the next wake if the announce failed.
    entry.cleanupHandled = false;
    persistSubagentRuns();
    return;
  }
  entry.cleanupCompletedAt = Date.now();
  persistSubagentRuns();
}
function beginSubagentCleanup(runId) {
  var entry = subagentRuns.get(runId);
  if (!entry) {
    return false;
  }
  if (entry.cleanupCompletedAt) {
    return false;
  }
  if (entry.cleanupHandled) {
    return false;
  }
  entry.cleanupHandled = true;
  persistSubagentRuns();
  return true;
}
function registerSubagentRun(params) {
  var now = Date.now();
  var cfg = (0, config_js_1.loadConfig)();
  var archiveAfterMs = resolveArchiveAfterMs(cfg);
  var archiveAtMs = archiveAfterMs ? now + archiveAfterMs : undefined;
  var waitTimeoutMs = resolveSubagentWaitTimeoutMs(cfg, params.runTimeoutSeconds);
  var requesterOrigin = (0, delivery_context_js_1.normalizeDeliveryContext)(params.requesterOrigin);
  subagentRuns.set(params.runId, {
    runId: params.runId,
    childSessionKey: params.childSessionKey,
    requesterSessionKey: params.requesterSessionKey,
    requesterOrigin: requesterOrigin,
    requesterDisplayKey: params.requesterDisplayKey,
    task: params.task,
    cleanup: params.cleanup,
    label: params.label,
    createdAt: now,
    startedAt: now,
    archiveAtMs: archiveAtMs,
    cleanupHandled: false,
  });
  ensureListener();
  persistSubagentRuns();
  if (archiveAfterMs) {
    startSweeper();
  }
  // Wait for subagent completion via gateway RPC (cross-process).
  // The in-process lifecycle listener is a fallback for embedded runs.
  void waitForSubagentCompletion(params.runId, waitTimeoutMs);
}
function waitForSubagentCompletion(runId, waitTimeoutMs) {
  return __awaiter(this, void 0, void 0, function () {
    var timeoutMs, wait, entry_1, mutated, requesterOrigin, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          timeoutMs = Math.max(1, Math.floor(waitTimeoutMs));
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              method: "agent.wait",
              params: {
                runId: runId,
                timeoutMs: timeoutMs,
              },
              timeoutMs: timeoutMs + 10000,
            }),
          ];
        case 1:
          wait = _b.sent();
          if (
            (wait === null || wait === void 0 ? void 0 : wait.status) !== "ok" &&
            (wait === null || wait === void 0 ? void 0 : wait.status) !== "error"
          ) {
            return [2 /*return*/];
          }
          entry_1 = subagentRuns.get(runId);
          if (!entry_1) {
            return [2 /*return*/];
          }
          mutated = false;
          if (typeof wait.startedAt === "number") {
            entry_1.startedAt = wait.startedAt;
            mutated = true;
          }
          if (typeof wait.endedAt === "number") {
            entry_1.endedAt = wait.endedAt;
            mutated = true;
          }
          if (!entry_1.endedAt) {
            entry_1.endedAt = Date.now();
            mutated = true;
          }
          entry_1.outcome =
            wait.status === "error" ? { status: "error", error: wait.error } : { status: "ok" };
          mutated = true;
          if (mutated) {
            persistSubagentRuns();
          }
          if (!beginSubagentCleanup(runId)) {
            return [2 /*return*/];
          }
          requesterOrigin = (0, delivery_context_js_1.normalizeDeliveryContext)(
            entry_1.requesterOrigin,
          );
          void (0, subagent_announce_js_1.runSubagentAnnounceFlow)({
            childSessionKey: entry_1.childSessionKey,
            childRunId: entry_1.runId,
            requesterSessionKey: entry_1.requesterSessionKey,
            requesterOrigin: requesterOrigin,
            requesterDisplayKey: entry_1.requesterDisplayKey,
            task: entry_1.task,
            timeoutMs: 30000,
            cleanup: entry_1.cleanup,
            waitForCompletion: false,
            startedAt: entry_1.startedAt,
            endedAt: entry_1.endedAt,
            label: entry_1.label,
            outcome: entry_1.outcome,
          }).then(function (didAnnounce) {
            finalizeSubagentCleanup(runId, entry_1.cleanup, didAnnounce);
          });
          return [3 /*break*/, 3];
        case 2:
          _a = _b.sent();
          return [3 /*break*/, 3];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function resetSubagentRegistryForTests() {
  subagentRuns.clear();
  resumedRuns.clear();
  stopSweeper();
  restoreAttempted = false;
  if (listenerStop) {
    listenerStop();
    listenerStop = null;
  }
  listenerStarted = false;
  persistSubagentRuns();
}
function addSubagentRunForTests(entry) {
  subagentRuns.set(entry.runId, entry);
  persistSubagentRuns();
}
function releaseSubagentRun(runId) {
  var didDelete = subagentRuns.delete(runId);
  if (didDelete) {
    persistSubagentRuns();
  }
  if (subagentRuns.size === 0) {
    stopSweeper();
  }
}
function listSubagentRunsForRequester(requesterSessionKey) {
  var key = requesterSessionKey.trim();
  if (!key) {
    return [];
  }
  return __spreadArray([], subagentRuns.values(), true).filter(function (entry) {
    return entry.requesterSessionKey === key;
  });
}
function initSubagentRegistry() {
  restoreSubagentRunsOnce();
}
