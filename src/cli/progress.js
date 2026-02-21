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
exports.createCliProgress = createCliProgress;
exports.withProgress = withProgress;
exports.withProgressTotals = withProgressTotals;
var prompts_1 = require("@clack/prompts");
var osc_progress_1 = require("osc-progress");
var theme_js_1 = require("../terminal/theme.js");
var progress_line_js_1 = require("../terminal/progress-line.js");
var DEFAULT_DELAY_MS = 0;
var activeProgress = 0;
var noopReporter = {
  setLabel: function () {},
  setPercent: function () {},
  tick: function () {},
  done: function () {},
};
function createCliProgress(options) {
  var _a, _b, _c;
  if (options.enabled === false) {
    return noopReporter;
  }
  if (activeProgress > 0) {
    return noopReporter;
  }
  var stream = (_a = options.stream) !== null && _a !== void 0 ? _a : process.stderr;
  var isTty = stream.isTTY;
  var allowLog = !isTty && options.fallback === "log";
  if (!isTty && !allowLog) {
    return noopReporter;
  }
  var delayMs = typeof options.delayMs === "number" ? options.delayMs : DEFAULT_DELAY_MS;
  var canOsc = isTty && (0, osc_progress_1.supportsOscProgress)(process.env, isTty);
  var allowSpinner = isTty && (options.fallback === undefined || options.fallback === "spinner");
  var allowLine = isTty && options.fallback === "line";
  var started = false;
  var label = options.label;
  var total = (_b = options.total) !== null && _b !== void 0 ? _b : null;
  var completed = 0;
  var percent = 0;
  var indeterminate =
    (_c = options.indeterminate) !== null && _c !== void 0
      ? _c
      : options.total === undefined || options.total === null;
  activeProgress += 1;
  if (isTty) {
    (0, progress_line_js_1.registerActiveProgressLine)(stream);
  }
  var controller = canOsc
    ? (0, osc_progress_1.createOscProgressController)({
        env: process.env,
        isTty: stream.isTTY,
        write: function (chunk) {
          return stream.write(chunk);
        },
      })
    : null;
  var spin = allowSpinner ? (0, prompts_1.spinner)() : null;
  var renderLine = allowLine
    ? function () {
        if (!started) {
          return;
        }
        var suffix = indeterminate ? "" : " ".concat(percent, "%");
        (0, progress_line_js_1.clearActiveProgressLine)();
        stream.write("".concat(theme_js_1.theme.accent(label)).concat(suffix));
      }
    : null;
  var renderLog = allowLog
    ? (function () {
        var lastLine = "";
        var lastAt = 0;
        var throttleMs = 250;
        return function () {
          if (!started) {
            return;
          }
          var suffix = indeterminate ? "" : " ".concat(percent, "%");
          var nextLine = "".concat(label).concat(suffix);
          var now = Date.now();
          if (nextLine === lastLine && now - lastAt < throttleMs) {
            return;
          }
          lastLine = nextLine;
          lastAt = now;
          stream.write("".concat(nextLine, "\n"));
        };
      })()
    : null;
  var timer = null;
  var applyState = function () {
    if (!started) {
      return;
    }
    if (controller) {
      if (indeterminate) {
        controller.setIndeterminate(label);
      } else {
        controller.setPercent(label, percent);
      }
    }
    if (spin) {
      spin.message(theme_js_1.theme.accent(label));
    }
    if (renderLine) {
      renderLine();
    }
    if (renderLog) {
      renderLog();
    }
  };
  var start = function () {
    if (started) {
      return;
    }
    started = true;
    if (spin) {
      spin.start(theme_js_1.theme.accent(label));
    }
    applyState();
  };
  if (delayMs === 0) {
    start();
  } else {
    timer = setTimeout(start, delayMs);
  }
  var setLabel = function (next) {
    label = next;
    applyState();
  };
  var setPercent = function (nextPercent) {
    percent = Math.max(0, Math.min(100, Math.round(nextPercent)));
    indeterminate = false;
    applyState();
  };
  var tick = function (delta) {
    if (delta === void 0) {
      delta = 1;
    }
    if (!total) {
      return;
    }
    completed = Math.min(total, completed + delta);
    var nextPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    setPercent(nextPercent);
  };
  var done = function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (!started) {
      activeProgress = Math.max(0, activeProgress - 1);
      return;
    }
    if (controller) {
      controller.clear();
    }
    if (spin) {
      spin.stop();
    }
    (0, progress_line_js_1.clearActiveProgressLine)();
    if (isTty) {
      (0, progress_line_js_1.unregisterActiveProgressLine)(stream);
    }
    activeProgress = Math.max(0, activeProgress - 1);
  };
  return { setLabel: setLabel, setPercent: setPercent, tick: tick, done: done };
}
function withProgress(options, work) {
  return __awaiter(this, void 0, void 0, function () {
    var progress;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          progress = createCliProgress(options);
          _a.label = 1;
        case 1:
          _a.trys.push([1, , 3, 4]);
          return [4 /*yield*/, work(progress)];
        case 2:
          return [2 /*return*/, _a.sent()];
        case 3:
          progress.done();
          return [7 /*endfinally*/];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function withProgressTotals(options, work) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            withProgress(options, function (progress) {
              return __awaiter(_this, void 0, void 0, function () {
                var update;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      update = function (_a) {
                        var completed = _a.completed,
                          total = _a.total,
                          label = _a.label;
                        if (label) {
                          progress.setLabel(label);
                        }
                        if (!Number.isFinite(total) || total <= 0) {
                          return;
                        }
                        progress.setPercent((completed / total) * 100);
                      };
                      return [4 /*yield*/, work(update, progress)];
                    case 1:
                      return [2 /*return*/, _a.sent()];
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
