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
exports.fetchZaiUsage = fetchZaiUsage;
var provider_usage_fetch_shared_js_1 = require("./provider-usage.fetch.shared.js");
var provider_usage_shared_js_1 = require("./provider-usage.shared.js");
function fetchZaiUsage(apiKey, timeoutMs, fetchFn) {
  return __awaiter(this, void 0, void 0, function () {
    var res, data, windows, limits, _i, limits_1, limit, percent, nextReset, windowLabel, planName;
    var _a, _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, provider_usage_fetch_shared_js_1.fetchJson)(
              "https://api.z.ai/api/monitor/usage/quota/limit",
              {
                method: "GET",
                headers: {
                  Authorization: "Bearer ".concat(apiKey),
                  Accept: "application/json",
                },
              },
              timeoutMs,
              fetchFn,
            ),
          ];
        case 1:
          res = _d.sent();
          if (!res.ok) {
            return [
              2 /*return*/,
              {
                provider: "zai",
                displayName: provider_usage_shared_js_1.PROVIDER_LABELS.zai,
                windows: [],
                error: "HTTP ".concat(res.status),
              },
            ];
          }
          return [4 /*yield*/, res.json()];
        case 2:
          data = _d.sent();
          if (!data.success || data.code !== 200) {
            return [
              2 /*return*/,
              {
                provider: "zai",
                displayName: provider_usage_shared_js_1.PROVIDER_LABELS.zai,
                windows: [],
                error: data.msg || "API error",
              },
            ];
          }
          windows = [];
          limits = ((_a = data.data) === null || _a === void 0 ? void 0 : _a.limits) || [];
          for (_i = 0, limits_1 = limits; _i < limits_1.length; _i++) {
            limit = limits_1[_i];
            percent = (0, provider_usage_shared_js_1.clampPercent)(limit.percentage || 0);
            nextReset = limit.nextResetTime ? new Date(limit.nextResetTime).getTime() : undefined;
            windowLabel = "Limit";
            if (limit.unit === 1) {
              windowLabel = "".concat(limit.number, "d");
            } else if (limit.unit === 3) {
              windowLabel = "".concat(limit.number, "h");
            } else if (limit.unit === 5) {
              windowLabel = "".concat(limit.number, "m");
            }
            if (limit.type === "TOKENS_LIMIT") {
              windows.push({
                label: "Tokens (".concat(windowLabel, ")"),
                usedPercent: percent,
                resetAt: nextReset,
              });
            } else if (limit.type === "TIME_LIMIT") {
              windows.push({
                label: "Monthly",
                usedPercent: percent,
                resetAt: nextReset,
              });
            }
          }
          planName =
            ((_b = data.data) === null || _b === void 0 ? void 0 : _b.planName) ||
            ((_c = data.data) === null || _c === void 0 ? void 0 : _c.plan) ||
            undefined;
          return [
            2 /*return*/,
            {
              provider: "zai",
              displayName: provider_usage_shared_js_1.PROVIDER_LABELS.zai,
              windows: windows,
              plan: planName,
            },
          ];
      }
    });
  });
}
