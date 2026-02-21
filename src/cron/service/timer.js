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
exports.armTimer = armTimer;
exports.onTimer = onTimer;
exports.runDueJobs = runDueJobs;
exports.executeJob = executeJob;
exports.wake = wake;
exports.stopTimer = stopTimer;
exports.emit = emit;
var jobs_js_1 = require("./jobs.js");
var locked_js_1 = require("./locked.js");
var store_js_1 = require("./store.js");
var MAX_TIMEOUT_MS = Math.pow(2, 31) - 1;
function armTimer(state) {
  var _a, _b;
  if (state.timer) {
    clearTimeout(state.timer);
  }
  state.timer = null;
  if (!state.deps.cronEnabled) {
    return;
  }
  var nextAt = (0, jobs_js_1.nextWakeAtMs)(state);
  if (!nextAt) {
    return;
  }
  var delay = Math.max(nextAt - state.deps.nowMs(), 0);
  // Avoid TimeoutOverflowWarning when a job is far in the future.
  var clampedDelay = Math.min(delay, MAX_TIMEOUT_MS);
  state.timer = setTimeout(function () {
    void onTimer(state).catch(function (err) {
      state.deps.log.error({ err: String(err) }, "cron: timer tick failed");
    });
  }, clampedDelay);
  (_b = (_a = state.timer).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
}
function onTimer(state) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (state.running) {
            return [2 /*return*/];
          }
          state.running = true;
          _a.label = 1;
        case 1:
          _a.trys.push([1, , 3, 4]);
          return [
            4 /*yield*/,
            (0, locked_js_1.locked)(state, function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4 /*yield*/, (0, store_js_1.ensureLoaded)(state)];
                    case 1:
                      _a.sent();
                      return [4 /*yield*/, runDueJobs(state)];
                    case 2:
                      _a.sent();
                      return [4 /*yield*/, (0, store_js_1.persist)(state)];
                    case 3:
                      _a.sent();
                      armTimer(state);
                      return [2 /*return*/];
                  }
                });
              });
            }),
          ];
        case 2:
          _a.sent();
          return [3 /*break*/, 4];
        case 3:
          state.running = false;
          return [7 /*endfinally*/];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function runDueJobs(state) {
  return __awaiter(this, void 0, void 0, function () {
    var now, due, _i, due_1, job;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!state.store) {
            return [2 /*return*/];
          }
          now = state.deps.nowMs();
          due = state.store.jobs.filter(function (j) {
            if (!j.enabled) {
              return false;
            }
            if (typeof j.state.runningAtMs === "number") {
              return false;
            }
            var next = j.state.nextRunAtMs;
            return typeof next === "number" && now >= next;
          });
          ((_i = 0), (due_1 = due));
          _a.label = 1;
        case 1:
          if (!(_i < due_1.length)) {
            return [3 /*break*/, 4];
          }
          job = due_1[_i];
          return [4 /*yield*/, executeJob(state, job, now, { forced: false })];
        case 2:
          _a.sent();
          _a.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function executeJob(state, job, nowMs, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var startedAt,
      deleted,
      finish,
      text,
      kind,
      reason,
      delay,
      maxWaitMs,
      waitStartedAt,
      heartbeatResult,
      res,
      err_1;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          startedAt = state.deps.nowMs();
          job.state.runningAtMs = startedAt;
          job.state.lastError = undefined;
          emit(state, { jobId: job.id, action: "started", runAtMs: startedAt });
          deleted = false;
          finish = function (status, err, summary, outputText) {
            return __awaiter(_this, void 0, void 0, function () {
              var endedAt,
                shouldDelete,
                prefix,
                mode,
                body,
                maxCharsRaw,
                maxChars,
                fullText,
                statusPrefix;
              var _a, _b, _c, _d, _e, _f;
              return __generator(this, function (_g) {
                endedAt = state.deps.nowMs();
                job.state.runningAtMs = undefined;
                job.state.lastRunAtMs = startedAt;
                job.state.lastStatus = status;
                job.state.lastDurationMs = Math.max(0, endedAt - startedAt);
                job.state.lastError = err;
                shouldDelete =
                  job.schedule.kind === "at" && status === "ok" && job.deleteAfterRun === true;
                if (!shouldDelete) {
                  if (job.schedule.kind === "at" && status === "ok") {
                    // One-shot job completed successfully; disable it.
                    job.enabled = false;
                    job.state.nextRunAtMs = undefined;
                  } else if (job.enabled) {
                    job.state.nextRunAtMs = (0, jobs_js_1.computeJobNextRunAtMs)(job, endedAt);
                  } else {
                    job.state.nextRunAtMs = undefined;
                  }
                }
                emit(state, {
                  jobId: job.id,
                  action: "finished",
                  status: status,
                  error: err,
                  summary: summary,
                  runAtMs: startedAt,
                  durationMs: job.state.lastDurationMs,
                  nextRunAtMs: job.state.nextRunAtMs,
                });
                if (shouldDelete && state.store) {
                  state.store.jobs = state.store.jobs.filter(function (j) {
                    return j.id !== job.id;
                  });
                  deleted = true;
                  emit(state, { jobId: job.id, action: "removed" });
                }
                if (job.sessionTarget === "isolated") {
                  prefix =
                    ((_b =
                      (_a = job.isolation) === null || _a === void 0
                        ? void 0
                        : _a.postToMainPrefix) === null || _b === void 0
                      ? void 0
                      : _b.trim()) || "Cron";
                  mode =
                    (_d =
                      (_c = job.isolation) === null || _c === void 0
                        ? void 0
                        : _c.postToMainMode) !== null && _d !== void 0
                      ? _d
                      : "summary";
                  body = (
                    (_e = summary !== null && summary !== void 0 ? summary : err) !== null &&
                    _e !== void 0
                      ? _e
                      : status
                  ).trim();
                  if (mode === "full") {
                    maxCharsRaw =
                      (_f = job.isolation) === null || _f === void 0
                        ? void 0
                        : _f.postToMainMaxChars;
                    maxChars = Number.isFinite(maxCharsRaw) ? Math.max(0, maxCharsRaw) : 8000;
                    fullText = (
                      outputText !== null && outputText !== void 0 ? outputText : ""
                    ).trim();
                    if (fullText) {
                      body =
                        fullText.length > maxChars
                          ? "".concat(fullText.slice(0, maxChars), "\u2026")
                          : fullText;
                    }
                  }
                  statusPrefix =
                    status === "ok" ? prefix : "".concat(prefix, " (").concat(status, ")");
                  state.deps.enqueueSystemEvent("".concat(statusPrefix, ": ").concat(body), {
                    agentId: job.agentId,
                  });
                  if (job.wakeMode === "now") {
                    state.deps.requestHeartbeatNow({ reason: "cron:".concat(job.id, ":post") });
                  }
                }
                return [2 /*return*/];
              });
            });
          };
          _b.label = 1;
        case 1:
          _b.trys.push([1, 28, 30, 31]);
          if (!(job.sessionTarget === "main")) {
            return [3 /*break*/, 18];
          }
          text = (0, jobs_js_1.resolveJobPayloadTextForMain)(job);
          if (!!text) {
            return [3 /*break*/, 3];
          }
          kind = job.payload.kind;
          return [
            4 /*yield*/,
            finish(
              "skipped",
              kind === "systemEvent"
                ? "main job requires non-empty systemEvent text"
                : 'main job requires payload.kind="systemEvent"',
            ),
          ];
        case 2:
          _b.sent();
          return [2 /*return*/];
        case 3:
          state.deps.enqueueSystemEvent(text, { agentId: job.agentId });
          if (!(job.wakeMode === "now" && state.deps.runHeartbeatOnce)) {
            return [3 /*break*/, 15];
          }
          reason = "cron:".concat(job.id);
          delay = function (ms) {
            return new Promise(function (resolve) {
              return setTimeout(resolve, ms);
            });
          };
          maxWaitMs = 2 * 60000;
          waitStartedAt = state.deps.nowMs();
          heartbeatResult = void 0;
          _b.label = 4;
        case 4:
          return [4 /*yield*/, state.deps.runHeartbeatOnce({ reason: reason })];
        case 5:
          heartbeatResult = _b.sent();
          if (
            heartbeatResult.status !== "skipped" ||
            heartbeatResult.reason !== "requests-in-flight"
          ) {
            return [3 /*break*/, 8];
          }
          if (state.deps.nowMs() - waitStartedAt > maxWaitMs) {
            heartbeatResult = {
              status: "skipped",
              reason: "timeout waiting for main lane to become idle",
            };
            return [3 /*break*/, 8];
          }
          return [4 /*yield*/, delay(250)];
        case 6:
          _b.sent();
          _b.label = 7;
        case 7:
          return [3 /*break*/, 4];
        case 8:
          if (!(heartbeatResult.status === "ran")) {
            return [3 /*break*/, 10];
          }
          return [4 /*yield*/, finish("ok", undefined, text)];
        case 9:
          _b.sent();
          return [3 /*break*/, 14];
        case 10:
          if (!(heartbeatResult.status === "skipped")) {
            return [3 /*break*/, 12];
          }
          return [4 /*yield*/, finish("skipped", heartbeatResult.reason, text)];
        case 11:
          _b.sent();
          return [3 /*break*/, 14];
        case 12:
          return [4 /*yield*/, finish("error", heartbeatResult.reason, text)];
        case 13:
          _b.sent();
          _b.label = 14;
        case 14:
          return [3 /*break*/, 17];
        case 15:
          // wakeMode is "next-heartbeat" or runHeartbeatOnce not available
          state.deps.requestHeartbeatNow({ reason: "cron:".concat(job.id) });
          return [4 /*yield*/, finish("ok", undefined, text)];
        case 16:
          _b.sent();
          _b.label = 17;
        case 17:
          return [2 /*return*/];
        case 18:
          if (!(job.payload.kind !== "agentTurn")) {
            return [3 /*break*/, 20];
          }
          return [4 /*yield*/, finish("skipped", "isolated job requires payload.kind=agentTurn")];
        case 19:
          _b.sent();
          return [2 /*return*/];
        case 20:
          return [
            4 /*yield*/,
            state.deps.runIsolatedAgentJob({
              job: job,
              message: job.payload.message,
            }),
          ];
        case 21:
          res = _b.sent();
          if (!(res.status === "ok")) {
            return [3 /*break*/, 23];
          }
          return [4 /*yield*/, finish("ok", undefined, res.summary, res.outputText)];
        case 22:
          _b.sent();
          return [3 /*break*/, 27];
        case 23:
          if (!(res.status === "skipped")) {
            return [3 /*break*/, 25];
          }
          return [4 /*yield*/, finish("skipped", undefined, res.summary, res.outputText)];
        case 24:
          _b.sent();
          return [3 /*break*/, 27];
        case 25:
          return [
            4 /*yield*/,
            finish(
              "error",
              (_a = res.error) !== null && _a !== void 0 ? _a : "cron job failed",
              res.summary,
              res.outputText,
            ),
          ];
        case 26:
          _b.sent();
          _b.label = 27;
        case 27:
          return [3 /*break*/, 31];
        case 28:
          err_1 = _b.sent();
          return [4 /*yield*/, finish("error", String(err_1))];
        case 29:
          _b.sent();
          return [3 /*break*/, 31];
        case 30:
          job.updatedAtMs = nowMs;
          if (!opts.forced && job.enabled && !deleted) {
            // Keep nextRunAtMs in sync in case the schedule advanced during a long run.
            job.state.nextRunAtMs = (0, jobs_js_1.computeJobNextRunAtMs)(job, state.deps.nowMs());
          }
          return [7 /*endfinally*/];
        case 31:
          return [2 /*return*/];
      }
    });
  });
}
function wake(state, opts) {
  var text = opts.text.trim();
  if (!text) {
    return { ok: false };
  }
  state.deps.enqueueSystemEvent(text);
  if (opts.mode === "now") {
    state.deps.requestHeartbeatNow({ reason: "wake" });
  }
  return { ok: true };
}
function stopTimer(state) {
  if (state.timer) {
    clearTimeout(state.timer);
  }
  state.timer = null;
}
function emit(state, evt) {
  var _a, _b;
  try {
    (_b = (_a = state.deps).onEvent) === null || _b === void 0 ? void 0 : _b.call(_a, evt);
  } catch (_c) {
    /* ignore */
  }
}
