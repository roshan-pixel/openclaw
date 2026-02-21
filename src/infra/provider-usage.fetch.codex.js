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
exports.fetchCodexUsage = fetchCodexUsage;
var provider_usage_fetch_shared_js_1 = require("./provider-usage.fetch.shared.js");
var provider_usage_shared_js_1 = require("./provider-usage.shared.js");
function fetchCodexUsage(token, accountId, timeoutMs, fetchFn) {
  return __awaiter(this, void 0, void 0, function () {
    var headers, res, data, windows, pw, windowHours, sw, windowHours, label, plan, balance;
    var _a, _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          headers = {
            Authorization: "Bearer ".concat(token),
            "User-Agent": "CodexBar",
            Accept: "application/json",
          };
          if (accountId) {
            headers["ChatGPT-Account-Id"] = accountId;
          }
          return [
            4 /*yield*/,
            (0, provider_usage_fetch_shared_js_1.fetchJson)(
              "https://chatgpt.com/backend-api/wham/usage",
              { method: "GET", headers: headers },
              timeoutMs,
              fetchFn,
            ),
          ];
        case 1:
          res = _d.sent();
          if (res.status === 401 || res.status === 403) {
            return [
              2 /*return*/,
              {
                provider: "openai-codex",
                displayName: provider_usage_shared_js_1.PROVIDER_LABELS["openai-codex"],
                windows: [],
                error: "Token expired",
              },
            ];
          }
          if (!res.ok) {
            return [
              2 /*return*/,
              {
                provider: "openai-codex",
                displayName: provider_usage_shared_js_1.PROVIDER_LABELS["openai-codex"],
                windows: [],
                error: "HTTP ".concat(res.status),
              },
            ];
          }
          return [4 /*yield*/, res.json()];
        case 2:
          data = _d.sent();
          windows = [];
          if ((_a = data.rate_limit) === null || _a === void 0 ? void 0 : _a.primary_window) {
            pw = data.rate_limit.primary_window;
            windowHours = Math.round((pw.limit_window_seconds || 10800) / 3600);
            windows.push({
              label: "".concat(windowHours, "h"),
              usedPercent: (0, provider_usage_shared_js_1.clampPercent)(pw.used_percent || 0),
              resetAt: pw.reset_at ? pw.reset_at * 1000 : undefined,
            });
          }
          if ((_b = data.rate_limit) === null || _b === void 0 ? void 0 : _b.secondary_window) {
            sw = data.rate_limit.secondary_window;
            windowHours = Math.round((sw.limit_window_seconds || 86400) / 3600);
            label = windowHours >= 24 ? "Day" : "".concat(windowHours, "h");
            windows.push({
              label: label,
              usedPercent: (0, provider_usage_shared_js_1.clampPercent)(sw.used_percent || 0),
              resetAt: sw.reset_at ? sw.reset_at * 1000 : undefined,
            });
          }
          plan = data.plan_type;
          if (
            ((_c = data.credits) === null || _c === void 0 ? void 0 : _c.balance) !== undefined &&
            data.credits.balance !== null
          ) {
            balance =
              typeof data.credits.balance === "number"
                ? data.credits.balance
                : parseFloat(data.credits.balance) || 0;
            plan = plan
              ? "".concat(plan, " ($").concat(balance.toFixed(2), ")")
              : "$".concat(balance.toFixed(2));
          }
          return [
            2 /*return*/,
            {
              provider: "openai-codex",
              displayName: provider_usage_shared_js_1.PROVIDER_LABELS["openai-codex"],
              windows: windows,
              plan: plan,
            },
          ];
      }
    });
  });
}
