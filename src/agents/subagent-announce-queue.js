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
exports.enqueueAnnounce = enqueueAnnounce;
var runtime_js_1 = require("../runtime.js");
var delivery_context_js_1 = require("../utils/delivery-context.js");
var queue_helpers_js_1 = require("../utils/queue-helpers.js");
var ANNOUNCE_QUEUES = new Map();
function getAnnounceQueue(key, settings, send) {
  var _a, _b;
  var existing = ANNOUNCE_QUEUES.get(key);
  if (existing) {
    existing.mode = settings.mode;
    existing.debounceMs =
      typeof settings.debounceMs === "number"
        ? Math.max(0, settings.debounceMs)
        : existing.debounceMs;
    existing.cap =
      typeof settings.cap === "number" && settings.cap > 0
        ? Math.floor(settings.cap)
        : existing.cap;
    existing.dropPolicy =
      (_a = settings.dropPolicy) !== null && _a !== void 0 ? _a : existing.dropPolicy;
    existing.send = send;
    return existing;
  }
  var created = {
    items: [],
    draining: false,
    lastEnqueuedAt: 0,
    mode: settings.mode,
    debounceMs: typeof settings.debounceMs === "number" ? Math.max(0, settings.debounceMs) : 1000,
    cap: typeof settings.cap === "number" && settings.cap > 0 ? Math.floor(settings.cap) : 20,
    dropPolicy: (_b = settings.dropPolicy) !== null && _b !== void 0 ? _b : "summarize",
    droppedCount: 0,
    summaryLines: [],
    send: send,
  };
  ANNOUNCE_QUEUES.set(key, created);
  return created;
}
function scheduleAnnounceDrain(key) {
  var _this = this;
  var queue = ANNOUNCE_QUEUES.get(key);
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
        prompt_1,
        last,
        summaryPrompt,
        next_3,
        next,
        err_1;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 13, 14, 15]);
            forceIndividualCollect = false;
            _b.label = 1;
          case 1:
            if (!(queue.items.length > 0 || queue.droppedCount > 0)) {
              return [3 /*break*/, 12];
            }
            return [4 /*yield*/, (0, queue_helpers_js_1.waitForQueueDebounce)(queue)];
          case 2:
            _b.sent();
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
            return [4 /*yield*/, queue.send(next_1)];
          case 3:
            _b.sent();
            return [3 /*break*/, 1];
          case 4:
            isCrossChannel = (0, queue_helpers_js_1.hasCrossChannelItems)(
              queue.items,
              function (item) {
                if (!item.origin) {
                  return {};
                }
                if (!item.originKey) {
                  return { cross: true };
                }
                return { key: item.originKey };
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
            return [4 /*yield*/, queue.send(next_2)];
          case 5:
            _b.sent();
            return [3 /*break*/, 1];
          case 6:
            items = queue.items.splice(0, queue.items.length);
            summary = (0, queue_helpers_js_1.buildQueueSummaryPrompt)({
              state: queue,
              noun: "announce",
            });
            prompt_1 = (0, queue_helpers_js_1.buildCollectPrompt)({
              title: "[Queued announce messages while agent was busy]",
              items: items,
              summary: summary,
              renderItem: function (item, idx) {
                return "---\nQueued #"
                  .concat(idx + 1, "\n")
                  .concat(item.prompt)
                  .trim();
              },
            });
            last = items.at(-1);
            if (!last) {
              return [3 /*break*/, 12];
            }
            return [4 /*yield*/, queue.send(__assign(__assign({}, last), { prompt: prompt_1 }))];
          case 7:
            _b.sent();
            return [3 /*break*/, 1];
          case 8:
            summaryPrompt = (0, queue_helpers_js_1.buildQueueSummaryPrompt)({
              state: queue,
              noun: "announce",
            });
            if (!summaryPrompt) {
              return [3 /*break*/, 10];
            }
            next_3 = queue.items.shift();
            if (!next_3) {
              return [3 /*break*/, 12];
            }
            return [
              4 /*yield*/,
              queue.send(__assign(__assign({}, next_3), { prompt: summaryPrompt })),
            ];
          case 9:
            _b.sent();
            return [3 /*break*/, 1];
          case 10:
            next = queue.items.shift();
            if (!next) {
              return [3 /*break*/, 12];
            }
            return [4 /*yield*/, queue.send(next)];
          case 11:
            _b.sent();
            return [3 /*break*/, 1];
          case 12:
            return [3 /*break*/, 15];
          case 13:
            err_1 = _b.sent();
            (_a = runtime_js_1.defaultRuntime.error) === null || _a === void 0
              ? void 0
              : _a.call(
                  runtime_js_1.defaultRuntime,
                  "announce queue drain failed for ".concat(key, ": ").concat(String(err_1)),
                );
            return [3 /*break*/, 15];
          case 14:
            queue.draining = false;
            if (queue.items.length === 0 && queue.droppedCount === 0) {
              ANNOUNCE_QUEUES.delete(key);
            } else {
              scheduleAnnounceDrain(key);
            }
            return [7 /*endfinally*/];
          case 15:
            return [2 /*return*/];
        }
      });
    });
  })();
}
function enqueueAnnounce(params) {
  var queue = getAnnounceQueue(params.key, params.settings, params.send);
  queue.lastEnqueuedAt = Date.now();
  var shouldEnqueue = (0, queue_helpers_js_1.applyQueueDropPolicy)({
    queue: queue,
    summarize: function (item) {
      var _a;
      return (
        ((_a = item.summaryLine) === null || _a === void 0 ? void 0 : _a.trim()) ||
        item.prompt.trim()
      );
    },
  });
  if (!shouldEnqueue) {
    if (queue.dropPolicy === "new") {
      scheduleAnnounceDrain(params.key);
    }
    return false;
  }
  var origin = (0, delivery_context_js_1.normalizeDeliveryContext)(params.item.origin);
  var originKey = (0, delivery_context_js_1.deliveryContextKey)(origin);
  queue.items.push(__assign(__assign({}, params.item), { origin: origin, originKey: originKey }));
  scheduleAnnounceDrain(params.key);
  return true;
}
