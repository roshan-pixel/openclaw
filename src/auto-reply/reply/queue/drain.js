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
exports.scheduleFollowupDrain = scheduleFollowupDrain;
var runtime_js_1 = require("../../../runtime.js");
var queue_helpers_js_1 = require("../../../utils/queue-helpers.js");
var route_reply_js_1 = require("../route-reply.js");
var state_js_1 = require("./state.js");
function scheduleFollowupDrain(key, runFollowup) {
  var _this = this;
  var queue = state_js_1.FOLLOWUP_QUEUES.get(key);
  if (!queue || queue.draining) {
    return;
  }
  queue.draining = true;
  void (function () {
    return __awaiter(_this, void 0, void 0, function () {
      var forceIndividualCollect,
        next_1,
        isCrossChannel,
        next_2,
        items,
        summary,
        run,
        originatingChannel,
        originatingTo,
        originatingAccountId,
        originatingThreadId,
        prompt_1,
        summaryPrompt,
        run,
        next,
        err_1;
      var _a, _b, _c, _d, _e, _f, _g;
      return __generator(this, function (_h) {
        switch (_h.label) {
          case 0:
            _h.trys.push([0, 13, 14, 15]);
            forceIndividualCollect = false;
            _h.label = 1;
          case 1:
            if (!(queue.items.length > 0 || queue.droppedCount > 0)) {
              return [3 /*break*/, 12];
            }
            return [4 /*yield*/, (0, queue_helpers_js_1.waitForQueueDebounce)(queue)];
          case 2:
            _h.sent();
            if (!(queue.mode === "collect")) {
              return [3 /*break*/, 8];
            }
            if (!forceIndividualCollect) {
              return [3 /*break*/, 4];
            }
            next_1 = queue.items.shift();
            if (!next_1) {
              return [3 /*break*/, 12];
            }
            return [4 /*yield*/, runFollowup(next_1)];
          case 3:
            _h.sent();
            return [3 /*break*/, 1];
          case 4:
            isCrossChannel = (0, queue_helpers_js_1.hasCrossChannelItems)(
              queue.items,
              function (item) {
                var channel = item.originatingChannel;
                var to = item.originatingTo;
                var accountId = item.originatingAccountId;
                var threadId = item.originatingThreadId;
                if (!channel && !to && !accountId && typeof threadId !== "number") {
                  return {};
                }
                if (!(0, route_reply_js_1.isRoutableChannel)(channel) || !to) {
                  return { cross: true };
                }
                var threadKey = typeof threadId === "number" ? String(threadId) : "";
                return {
                  key: [channel, to, accountId || "", threadKey].join("|"),
                };
              },
            );
            if (!isCrossChannel) {
              return [3 /*break*/, 6];
            }
            forceIndividualCollect = true;
            next_2 = queue.items.shift();
            if (!next_2) {
              return [3 /*break*/, 12];
            }
            return [4 /*yield*/, runFollowup(next_2)];
          case 5:
            _h.sent();
            return [3 /*break*/, 1];
          case 6:
            items = queue.items.splice(0, queue.items.length);
            summary = (0, queue_helpers_js_1.buildQueueSummaryPrompt)({
              state: queue,
              noun: "message",
            });
            run =
              (_b = (_a = items.at(-1)) === null || _a === void 0 ? void 0 : _a.run) !== null &&
              _b !== void 0
                ? _b
                : queue.lastRun;
            if (!run) {
              return [3 /*break*/, 12];
            }
            originatingChannel =
              (_c = items.find(function (i) {
                return i.originatingChannel;
              })) === null || _c === void 0
                ? void 0
                : _c.originatingChannel;
            originatingTo =
              (_d = items.find(function (i) {
                return i.originatingTo;
              })) === null || _d === void 0
                ? void 0
                : _d.originatingTo;
            originatingAccountId =
              (_e = items.find(function (i) {
                return i.originatingAccountId;
              })) === null || _e === void 0
                ? void 0
                : _e.originatingAccountId;
            originatingThreadId =
              (_f = items.find(function (i) {
                return typeof i.originatingThreadId === "number";
              })) === null || _f === void 0
                ? void 0
                : _f.originatingThreadId;
            prompt_1 = (0, queue_helpers_js_1.buildCollectPrompt)({
              title: "[Queued messages while agent was busy]",
              items: items,
              summary: summary,
              renderItem: function (item, idx) {
                return "---\nQueued #"
                  .concat(idx + 1, "\n")
                  .concat(item.prompt)
                  .trim();
              },
            });
            return [
              4 /*yield*/,
              runFollowup({
                prompt: prompt_1,
                run: run,
                enqueuedAt: Date.now(),
                originatingChannel: originatingChannel,
                originatingTo: originatingTo,
                originatingAccountId: originatingAccountId,
                originatingThreadId: originatingThreadId,
              }),
            ];
          case 7:
            _h.sent();
            return [3 /*break*/, 1];
          case 8:
            summaryPrompt = (0, queue_helpers_js_1.buildQueueSummaryPrompt)({
              state: queue,
              noun: "message",
            });
            if (!summaryPrompt) {
              return [3 /*break*/, 10];
            }
            run = queue.lastRun;
            if (!run) {
              return [3 /*break*/, 12];
            }
            return [
              4 /*yield*/,
              runFollowup({
                prompt: summaryPrompt,
                run: run,
                enqueuedAt: Date.now(),
              }),
            ];
          case 9:
            _h.sent();
            return [3 /*break*/, 1];
          case 10:
            next = queue.items.shift();
            if (!next) {
              return [3 /*break*/, 12];
            }
            return [4 /*yield*/, runFollowup(next)];
          case 11:
            _h.sent();
            return [3 /*break*/, 1];
          case 12:
            return [3 /*break*/, 15];
          case 13:
            err_1 = _h.sent();
            (_g = runtime_js_1.defaultRuntime.error) === null || _g === void 0
              ? void 0
              : _g.call(
                  runtime_js_1.defaultRuntime,
                  "followup queue drain failed for ".concat(key, ": ").concat(String(err_1)),
                );
            return [3 /*break*/, 15];
          case 14:
            queue.draining = false;
            if (queue.items.length === 0 && queue.droppedCount === 0) {
              state_js_1.FOLLOWUP_QUEUES.delete(key);
            } else {
              scheduleFollowupDrain(key, runFollowup);
            }
            return [7 /*endfinally*/];
          case 15:
            return [2 /*return*/];
        }
      });
    });
  })();
}
