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
exports.setCommandLaneConcurrency = setCommandLaneConcurrency;
exports.enqueueCommandInLane = enqueueCommandInLane;
exports.enqueueCommand = enqueueCommand;
exports.getQueueSize = getQueueSize;
exports.getTotalQueueSize = getTotalQueueSize;
exports.clearCommandLane = clearCommandLane;
var diagnostic_js_1 = require("../logging/diagnostic.js");
var lanes = new Map();
function getLaneState(lane) {
  var existing = lanes.get(lane);
  if (existing) {
    return existing;
  }
  var created = {
    lane: lane,
    queue: [],
    active: 0,
    maxConcurrent: 1,
    draining: false,
  };
  lanes.set(lane, created);
  return created;
}
function drainLane(lane) {
  var _this = this;
  var state = getLaneState(lane);
  if (state.draining) {
    return;
  }
  state.draining = true;
  var pump = function () {
    var _a;
    var _loop_1 = function () {
      var entry = state.queue.shift();
      var waitedMs = Date.now() - entry.enqueuedAt;
      if (waitedMs >= entry.warnAfterMs) {
        (_a = entry.onWait) === null || _a === void 0
          ? void 0
          : _a.call(entry, waitedMs, state.queue.length);
        diagnostic_js_1.diagnosticLogger.warn(
          "lane wait exceeded: lane="
            .concat(lane, " waitedMs=")
            .concat(waitedMs, " queueAhead=")
            .concat(state.queue.length),
        );
      }
      (0, diagnostic_js_1.logLaneDequeue)(lane, waitedMs, state.queue.length);
      state.active += 1;
      void (function () {
        return __awaiter(_this, void 0, void 0, function () {
          var startTime, result, err_1, isProbeLane;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                startTime = Date.now();
                _a.label = 1;
              case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, entry.task()];
              case 2:
                result = _a.sent();
                state.active -= 1;
                diagnostic_js_1.diagnosticLogger.debug(
                  "lane task done: lane="
                    .concat(lane, " durationMs=")
                    .concat(Date.now() - startTime, " active=")
                    .concat(state.active, " queued=")
                    .concat(state.queue.length),
                );
                pump();
                entry.resolve(result);
                return [3 /*break*/, 4];
              case 3:
                err_1 = _a.sent();
                state.active -= 1;
                isProbeLane = lane.startsWith("auth-probe:") || lane.startsWith("session:probe-");
                if (!isProbeLane) {
                  diagnostic_js_1.diagnosticLogger.error(
                    "lane task error: lane="
                      .concat(lane, " durationMs=")
                      .concat(Date.now() - startTime, ' error="')
                      .concat(String(err_1), '"'),
                  );
                }
                pump();
                entry.reject(err_1);
                return [3 /*break*/, 4];
              case 4:
                return [2 /*return*/];
            }
          });
        });
      })();
    };
    while (state.active < state.maxConcurrent && state.queue.length > 0) {
      _loop_1();
    }
    state.draining = false;
  };
  pump();
}
function setCommandLaneConcurrency(lane, maxConcurrent) {
  var cleaned = lane.trim() || "main" /* CommandLane.Main */;
  var state = getLaneState(cleaned);
  state.maxConcurrent = Math.max(1, Math.floor(maxConcurrent));
  drainLane(cleaned);
}
function enqueueCommandInLane(lane, task, opts) {
  var _a;
  var cleaned = lane.trim() || "main" /* CommandLane.Main */;
  var warnAfterMs =
    (_a = opts === null || opts === void 0 ? void 0 : opts.warnAfterMs) !== null && _a !== void 0
      ? _a
      : 2000;
  var state = getLaneState(cleaned);
  return new Promise(function (resolve, reject) {
    state.queue.push({
      task: function () {
        return task();
      },
      resolve: function (value) {
        return resolve(value);
      },
      reject: reject,
      enqueuedAt: Date.now(),
      warnAfterMs: warnAfterMs,
      onWait: opts === null || opts === void 0 ? void 0 : opts.onWait,
    });
    (0, diagnostic_js_1.logLaneEnqueue)(cleaned, state.queue.length + state.active);
    drainLane(cleaned);
  });
}
function enqueueCommand(task, opts) {
  return enqueueCommandInLane("main" /* CommandLane.Main */, task, opts);
}
function getQueueSize(lane) {
  if (lane === void 0) {
    lane = "main" /* CommandLane.Main */;
  }
  var resolved = lane.trim() || "main" /* CommandLane.Main */;
  var state = lanes.get(resolved);
  if (!state) {
    return 0;
  }
  return state.queue.length + state.active;
}
function getTotalQueueSize() {
  var total = 0;
  for (var _i = 0, _a = lanes.values(); _i < _a.length; _i++) {
    var s = _a[_i];
    total += s.queue.length + s.active;
  }
  return total;
}
function clearCommandLane(lane) {
  if (lane === void 0) {
    lane = "main" /* CommandLane.Main */;
  }
  var cleaned = lane.trim() || "main" /* CommandLane.Main */;
  var state = lanes.get(cleaned);
  if (!state) {
    return 0;
  }
  var removed = state.queue.length;
  state.queue.length = 0;
  return removed;
}
