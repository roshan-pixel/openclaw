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
exports.start = start;
exports.stop = stop;
exports.status = status;
exports.list = list;
exports.add = add;
exports.update = update;
exports.remove = remove;
exports.run = run;
exports.wakeNow = wakeNow;
var jobs_js_1 = require("./jobs.js");
var locked_js_1 = require("./locked.js");
var store_js_1 = require("./store.js");
var timer_js_1 = require("./timer.js");
function start(state) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, locked_js_1.locked)(state, function () {
              return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                  switch (_d.label) {
                    case 0:
                      if (!state.deps.cronEnabled) {
                        state.deps.log.info({ enabled: false }, "cron: disabled");
                        return [2 /*return*/];
                      }
                      return [4 /*yield*/, (0, store_js_1.ensureLoaded)(state)];
                    case 1:
                      _d.sent();
                      (0, jobs_js_1.recomputeNextRuns)(state);
                      return [4 /*yield*/, (0, store_js_1.persist)(state)];
                    case 2:
                      _d.sent();
                      (0, timer_js_1.armTimer)(state);
                      state.deps.log.info(
                        {
                          enabled: true,
                          jobs:
                            (_b =
                              (_a = state.store) === null || _a === void 0
                                ? void 0
                                : _a.jobs.length) !== null && _b !== void 0
                              ? _b
                              : 0,
                          nextWakeAtMs:
                            (_c = (0, jobs_js_1.nextWakeAtMs)(state)) !== null && _c !== void 0
                              ? _c
                              : null,
                        },
                        "cron: started",
                      );
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
function stop(state) {
  (0, timer_js_1.stopTimer)(state);
}
function status(state) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, locked_js_1.locked)(state, function () {
              return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                  switch (_d.label) {
                    case 0:
                      return [4 /*yield*/, (0, store_js_1.ensureLoaded)(state)];
                    case 1:
                      _d.sent();
                      return [
                        2 /*return*/,
                        {
                          enabled: state.deps.cronEnabled,
                          storePath: state.deps.storePath,
                          jobs:
                            (_b =
                              (_a = state.store) === null || _a === void 0
                                ? void 0
                                : _a.jobs.length) !== null && _b !== void 0
                              ? _b
                              : 0,
                          nextWakeAtMs:
                            state.deps.cronEnabled === true
                              ? (_c = (0, jobs_js_1.nextWakeAtMs)(state)) !== null && _c !== void 0
                                ? _c
                                : null
                              : null,
                        },
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
function list(state, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, locked_js_1.locked)(state, function () {
              return __awaiter(_this, void 0, void 0, function () {
                var includeDisabled, jobs;
                var _a, _b;
                return __generator(this, function (_c) {
                  switch (_c.label) {
                    case 0:
                      return [4 /*yield*/, (0, store_js_1.ensureLoaded)(state)];
                    case 1:
                      _c.sent();
                      includeDisabled =
                        (opts === null || opts === void 0 ? void 0 : opts.includeDisabled) === true;
                      jobs = (
                        (_b = (_a = state.store) === null || _a === void 0 ? void 0 : _a.jobs) !==
                          null && _b !== void 0
                          ? _b
                          : []
                      ).filter(function (j) {
                        return includeDisabled || j.enabled;
                      });
                      return [
                        2 /*return*/,
                        jobs.toSorted(function (a, b) {
                          var _a, _b;
                          return (
                            ((_a = a.state.nextRunAtMs) !== null && _a !== void 0 ? _a : 0) -
                            ((_b = b.state.nextRunAtMs) !== null && _b !== void 0 ? _b : 0)
                          );
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
function add(state, input) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, locked_js_1.locked)(state, function () {
              return __awaiter(_this, void 0, void 0, function () {
                var job;
                var _a;
                return __generator(this, function (_b) {
                  switch (_b.label) {
                    case 0:
                      (0, store_js_1.warnIfDisabled)(state, "add");
                      return [4 /*yield*/, (0, store_js_1.ensureLoaded)(state)];
                    case 1:
                      _b.sent();
                      job = (0, jobs_js_1.createJob)(state, input);
                      (_a = state.store) === null || _a === void 0 ? void 0 : _a.jobs.push(job);
                      return [4 /*yield*/, (0, store_js_1.persist)(state)];
                    case 2:
                      _b.sent();
                      (0, timer_js_1.armTimer)(state);
                      (0, timer_js_1.emit)(state, {
                        jobId: job.id,
                        action: "added",
                        nextRunAtMs: job.state.nextRunAtMs,
                      });
                      return [2 /*return*/, job];
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
function update(state, id, patch) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, locked_js_1.locked)(state, function () {
              return __awaiter(_this, void 0, void 0, function () {
                var job, now;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      (0, store_js_1.warnIfDisabled)(state, "update");
                      return [4 /*yield*/, (0, store_js_1.ensureLoaded)(state)];
                    case 1:
                      _a.sent();
                      job = (0, jobs_js_1.findJobOrThrow)(state, id);
                      now = state.deps.nowMs();
                      (0, jobs_js_1.applyJobPatch)(job, patch);
                      job.updatedAtMs = now;
                      if (job.enabled) {
                        job.state.nextRunAtMs = (0, jobs_js_1.computeJobNextRunAtMs)(job, now);
                      } else {
                        job.state.nextRunAtMs = undefined;
                        job.state.runningAtMs = undefined;
                      }
                      return [4 /*yield*/, (0, store_js_1.persist)(state)];
                    case 2:
                      _a.sent();
                      (0, timer_js_1.armTimer)(state);
                      (0, timer_js_1.emit)(state, {
                        jobId: id,
                        action: "updated",
                        nextRunAtMs: job.state.nextRunAtMs,
                      });
                      return [2 /*return*/, job];
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
function remove(state, id) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, locked_js_1.locked)(state, function () {
              return __awaiter(_this, void 0, void 0, function () {
                var before, removed;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                  switch (_d.label) {
                    case 0:
                      (0, store_js_1.warnIfDisabled)(state, "remove");
                      return [4 /*yield*/, (0, store_js_1.ensureLoaded)(state)];
                    case 1:
                      _d.sent();
                      before =
                        (_b =
                          (_a = state.store) === null || _a === void 0
                            ? void 0
                            : _a.jobs.length) !== null && _b !== void 0
                          ? _b
                          : 0;
                      if (!state.store) {
                        return [2 /*return*/, { ok: false, removed: false }];
                      }
                      state.store.jobs = state.store.jobs.filter(function (j) {
                        return j.id !== id;
                      });
                      removed =
                        ((_c = state.store.jobs.length) !== null && _c !== void 0 ? _c : 0) !==
                        before;
                      return [4 /*yield*/, (0, store_js_1.persist)(state)];
                    case 2:
                      _d.sent();
                      (0, timer_js_1.armTimer)(state);
                      if (removed) {
                        (0, timer_js_1.emit)(state, { jobId: id, action: "removed" });
                      }
                      return [2 /*return*/, { ok: true, removed: removed }];
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
function run(state, id, mode) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, locked_js_1.locked)(state, function () {
              return __awaiter(_this, void 0, void 0, function () {
                var job, now, due;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      (0, store_js_1.warnIfDisabled)(state, "run");
                      return [4 /*yield*/, (0, store_js_1.ensureLoaded)(state)];
                    case 1:
                      _a.sent();
                      job = (0, jobs_js_1.findJobOrThrow)(state, id);
                      now = state.deps.nowMs();
                      due = (0, jobs_js_1.isJobDue)(job, now, { forced: mode === "force" });
                      if (!due) {
                        return [2 /*return*/, { ok: true, ran: false, reason: "not-due" }];
                      }
                      return [
                        4 /*yield*/,
                        (0, timer_js_1.executeJob)(state, job, now, { forced: mode === "force" }),
                      ];
                    case 2:
                      _a.sent();
                      return [4 /*yield*/, (0, store_js_1.persist)(state)];
                    case 3:
                      _a.sent();
                      (0, timer_js_1.armTimer)(state);
                      return [2 /*return*/, { ok: true, ran: true }];
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
function wakeNow(state, opts) {
  return (0, timer_js_1.wake)(state, opts);
}
