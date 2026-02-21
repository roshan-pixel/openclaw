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
exports.fetchClaudeUsage = fetchClaudeUsage;
var provider_usage_fetch_shared_js_1 = require("./provider-usage.fetch.shared.js");
var provider_usage_shared_js_1 = require("./provider-usage.shared.js");
function resolveClaudeWebSessionKey() {
  var _a, _b, _c, _d, _e;
  var direct =
    (_b =
      (_a = process.env.CLAUDE_AI_SESSION_KEY) === null || _a === void 0 ? void 0 : _a.trim()) !==
      null && _b !== void 0
      ? _b
      : (_c = process.env.CLAUDE_WEB_SESSION_KEY) === null || _c === void 0
        ? void 0
        : _c.trim();
  if (direct === null || direct === void 0 ? void 0 : direct.startsWith("sk-ant-")) {
    return direct;
  }
  var cookieHeader =
    (_d = process.env.CLAUDE_WEB_COOKIE) === null || _d === void 0 ? void 0 : _d.trim();
  if (!cookieHeader) {
    return undefined;
  }
  var stripped = cookieHeader.replace(/^cookie:\\s*/i, "");
  var match = stripped.match(/(?:^|;\\s*)sessionKey=([^;\\s]+)/i);
  var value =
    (_e = match === null || match === void 0 ? void 0 : match[1]) === null || _e === void 0
      ? void 0
      : _e.trim();
  return (value === null || value === void 0 ? void 0 : value.startsWith("sk-ant-"))
    ? value
    : undefined;
}
function fetchClaudeWebUsage(sessionKey, timeoutMs, fetchFn) {
  return __awaiter(this, void 0, void 0, function () {
    var headers, orgRes, orgs, orgId, usageRes, data, windows, modelWindow;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          headers = {
            Cookie: "sessionKey=".concat(sessionKey),
            Accept: "application/json",
          };
          return [
            4 /*yield*/,
            (0, provider_usage_fetch_shared_js_1.fetchJson)(
              "https://claude.ai/api/organizations",
              { headers: headers },
              timeoutMs,
              fetchFn,
            ),
          ];
        case 1:
          orgRes = _e.sent();
          if (!orgRes.ok) {
            return [2 /*return*/, null];
          }
          return [4 /*yield*/, orgRes.json()];
        case 2:
          orgs = _e.sent();
          orgId =
            (_b =
              (_a = orgs === null || orgs === void 0 ? void 0 : orgs[0]) === null || _a === void 0
                ? void 0
                : _a.uuid) === null || _b === void 0
              ? void 0
              : _b.trim();
          if (!orgId) {
            return [2 /*return*/, null];
          }
          return [
            4 /*yield*/,
            (0, provider_usage_fetch_shared_js_1.fetchJson)(
              "https://claude.ai/api/organizations/".concat(orgId, "/usage"),
              { headers: headers },
              timeoutMs,
              fetchFn,
            ),
          ];
        case 3:
          usageRes = _e.sent();
          if (!usageRes.ok) {
            return [2 /*return*/, null];
          }
          return [4 /*yield*/, usageRes.json()];
        case 4:
          data = _e.sent();
          windows = [];
          if (
            ((_c = data.five_hour) === null || _c === void 0 ? void 0 : _c.utilization) !==
            undefined
          ) {
            windows.push({
              label: "5h",
              usedPercent: (0, provider_usage_shared_js_1.clampPercent)(data.five_hour.utilization),
              resetAt: data.five_hour.resets_at
                ? new Date(data.five_hour.resets_at).getTime()
                : undefined,
            });
          }
          if (
            ((_d = data.seven_day) === null || _d === void 0 ? void 0 : _d.utilization) !==
            undefined
          ) {
            windows.push({
              label: "Week",
              usedPercent: (0, provider_usage_shared_js_1.clampPercent)(data.seven_day.utilization),
              resetAt: data.seven_day.resets_at
                ? new Date(data.seven_day.resets_at).getTime()
                : undefined,
            });
          }
          modelWindow = data.seven_day_sonnet || data.seven_day_opus;
          if (
            (modelWindow === null || modelWindow === void 0 ? void 0 : modelWindow.utilization) !==
            undefined
          ) {
            windows.push({
              label: data.seven_day_sonnet ? "Sonnet" : "Opus",
              usedPercent: (0, provider_usage_shared_js_1.clampPercent)(modelWindow.utilization),
            });
          }
          if (windows.length === 0) {
            return [2 /*return*/, null];
          }
          return [
            2 /*return*/,
            {
              provider: "anthropic",
              displayName: provider_usage_shared_js_1.PROVIDER_LABELS.anthropic,
              windows: windows,
            },
          ];
      }
    });
  });
}
function fetchClaudeUsage(token, timeoutMs, fetchFn) {
  return __awaiter(this, void 0, void 0, function () {
    var res, message, data_1, raw, _a, sessionKey, web, suffix, data, windows, modelWindow;
    var _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, provider_usage_fetch_shared_js_1.fetchJson)(
              "https://api.anthropic.com/api/oauth/usage",
              {
                headers: {
                  Authorization: "Bearer ".concat(token),
                  "User-Agent": "openclaw",
                  Accept: "application/json",
                  "anthropic-version": "2023-06-01",
                  "anthropic-beta": "oauth-2025-04-20",
                },
              },
              timeoutMs,
              fetchFn,
            ),
          ];
        case 1:
          res = _e.sent();
          if (!!res.ok) {
            return [3 /*break*/, 8];
          }
          message = void 0;
          _e.label = 2;
        case 2:
          _e.trys.push([2, 4, , 5]);
          return [4 /*yield*/, res.json()];
        case 3:
          data_1 = _e.sent();
          raw =
            (_b = data_1 === null || data_1 === void 0 ? void 0 : data_1.error) === null ||
            _b === void 0
              ? void 0
              : _b.message;
          if (typeof raw === "string" && raw.trim()) {
            message = raw.trim();
          }
          return [3 /*break*/, 5];
        case 4:
          _a = _e.sent();
          return [3 /*break*/, 5];
        case 5:
          if (
            !(
              res.status === 403 &&
              (message === null || message === void 0
                ? void 0
                : message.includes("scope requirement user:profile"))
            )
          ) {
            return [3 /*break*/, 7];
          }
          sessionKey = resolveClaudeWebSessionKey();
          if (!sessionKey) {
            return [3 /*break*/, 7];
          }
          return [4 /*yield*/, fetchClaudeWebUsage(sessionKey, timeoutMs, fetchFn)];
        case 6:
          web = _e.sent();
          if (web) {
            return [2 /*return*/, web];
          }
          _e.label = 7;
        case 7:
          suffix = message ? ": ".concat(message) : "";
          return [
            2 /*return*/,
            {
              provider: "anthropic",
              displayName: provider_usage_shared_js_1.PROVIDER_LABELS.anthropic,
              windows: [],
              error: "HTTP ".concat(res.status).concat(suffix),
            },
          ];
        case 8:
          return [4 /*yield*/, res.json()];
        case 9:
          data = _e.sent();
          windows = [];
          if (
            ((_c = data.five_hour) === null || _c === void 0 ? void 0 : _c.utilization) !==
            undefined
          ) {
            windows.push({
              label: "5h",
              usedPercent: (0, provider_usage_shared_js_1.clampPercent)(data.five_hour.utilization),
              resetAt: data.five_hour.resets_at
                ? new Date(data.five_hour.resets_at).getTime()
                : undefined,
            });
          }
          if (
            ((_d = data.seven_day) === null || _d === void 0 ? void 0 : _d.utilization) !==
            undefined
          ) {
            windows.push({
              label: "Week",
              usedPercent: (0, provider_usage_shared_js_1.clampPercent)(data.seven_day.utilization),
              resetAt: data.seven_day.resets_at
                ? new Date(data.seven_day.resets_at).getTime()
                : undefined,
            });
          }
          modelWindow = data.seven_day_sonnet || data.seven_day_opus;
          if (
            (modelWindow === null || modelWindow === void 0 ? void 0 : modelWindow.utilization) !==
            undefined
          ) {
            windows.push({
              label: data.seven_day_sonnet ? "Sonnet" : "Opus",
              usedPercent: (0, provider_usage_shared_js_1.clampPercent)(modelWindow.utilization),
            });
          }
          return [
            2 /*return*/,
            {
              provider: "anthropic",
              displayName: provider_usage_shared_js_1.PROVIDER_LABELS.anthropic,
              windows: windows,
            },
          ];
      }
    });
  });
}
