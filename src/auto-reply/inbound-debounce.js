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
exports.resolveInboundDebounceMs = resolveInboundDebounceMs;
exports.createInboundDebouncer = createInboundDebouncer;
var resolveMs = function (value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }
  return Math.max(0, Math.trunc(value));
};
var resolveChannelOverride = function (params) {
  if (!params.byChannel) {
    return undefined;
  }
  return resolveMs(params.byChannel[params.channel]);
};
function resolveInboundDebounceMs(params) {
  var _a, _b, _c;
  var inbound = (_a = params.cfg.messages) === null || _a === void 0 ? void 0 : _a.inbound;
  var override = resolveMs(params.overrideMs);
  var byChannel = resolveChannelOverride({
    byChannel: inbound === null || inbound === void 0 ? void 0 : inbound.byChannel,
    channel: params.channel,
  });
  var base = resolveMs(inbound === null || inbound === void 0 ? void 0 : inbound.debounceMs);
  return (_c =
    (_b = override !== null && override !== void 0 ? override : byChannel) !== null && _b !== void 0
      ? _b
      : base) !== null && _c !== void 0
    ? _c
    : 0;
}
function createInboundDebouncer(params) {
  var _this = this;
  var buffers = new Map();
  var debounceMs = Math.max(0, Math.trunc(params.debounceMs));
  var flushBuffer = function (key, buffer) {
    return __awaiter(_this, void 0, void 0, function () {
      var err_1;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            buffers.delete(key);
            if (buffer.timeout) {
              clearTimeout(buffer.timeout);
              buffer.timeout = null;
            }
            if (buffer.items.length === 0) {
              return [2 /*return*/];
            }
            _b.label = 1;
          case 1:
            _b.trys.push([1, 3, , 4]);
            return [4 /*yield*/, params.onFlush(buffer.items)];
          case 2:
            _b.sent();
            return [3 /*break*/, 4];
          case 3:
            err_1 = _b.sent();
            (_a = params.onError) === null || _a === void 0
              ? void 0
              : _a.call(params, err_1, buffer.items);
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  var flushKey = function (key) {
    return __awaiter(_this, void 0, void 0, function () {
      var buffer;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            buffer = buffers.get(key);
            if (!buffer) {
              return [2 /*return*/];
            }
            return [4 /*yield*/, flushBuffer(key, buffer)];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  var scheduleFlush = function (key, buffer) {
    var _a, _b;
    if (buffer.timeout) {
      clearTimeout(buffer.timeout);
    }
    buffer.timeout = setTimeout(function () {
      void flushBuffer(key, buffer);
    }, debounceMs);
    (_b = (_a = buffer.timeout).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
  };
  var enqueue = function (item) {
    return __awaiter(_this, void 0, void 0, function () {
      var key, canDebounce, existing, buffer;
      var _a, _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            key = params.buildKey(item);
            canDebounce =
              debounceMs > 0 &&
              ((_b =
                (_a = params.shouldDebounce) === null || _a === void 0
                  ? void 0
                  : _a.call(params, item)) !== null && _b !== void 0
                ? _b
                : true);
            if (!(!canDebounce || !key)) {
              return [3 /*break*/, 4];
            }
            if (!(key && buffers.has(key))) {
              return [3 /*break*/, 2];
            }
            return [4 /*yield*/, flushKey(key)];
          case 1:
            _c.sent();
            _c.label = 2;
          case 2:
            return [4 /*yield*/, params.onFlush([item])];
          case 3:
            _c.sent();
            return [2 /*return*/];
          case 4:
            existing = buffers.get(key);
            if (existing) {
              existing.items.push(item);
              scheduleFlush(key, existing);
              return [2 /*return*/];
            }
            buffer = { items: [item], timeout: null };
            buffers.set(key, buffer);
            scheduleFlush(key, buffer);
            return [2 /*return*/];
        }
      });
    });
  };
  return { enqueue: enqueue, flushKey: flushKey };
}
