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
exports.loadProviderUsageSummary = loadProviderUsageSummary;
var provider_usage_auth_js_1 = require("./provider-usage.auth.js");
var provider_usage_fetch_js_1 = require("./provider-usage.fetch.js");
var provider_usage_shared_js_1 = require("./provider-usage.shared.js");
var fetch_js_1 = require("./fetch.js");
function loadProviderUsageSummary() {
  return __awaiter(this, arguments, void 0, function (opts) {
    var now, timeoutMs, fetchFn, auths, tasks, snapshots, providers;
    var _this = this;
    var _a, _b, _c;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          now = (_a = opts.now) !== null && _a !== void 0 ? _a : Date.now();
          timeoutMs =
            (_b = opts.timeoutMs) !== null && _b !== void 0
              ? _b
              : provider_usage_shared_js_1.DEFAULT_TIMEOUT_MS;
          fetchFn = (0, fetch_js_1.resolveFetch)(opts.fetch);
          if (!fetchFn) {
            throw new Error("fetch is not available");
          }
          return [
            4 /*yield*/,
            (0, provider_usage_auth_js_1.resolveProviderAuths)({
              providers:
                (_c = opts.providers) !== null && _c !== void 0
                  ? _c
                  : provider_usage_shared_js_1.usageProviders,
              auth: opts.auth,
              agentDir: opts.agentDir,
            }),
          ];
        case 1:
          auths = _d.sent();
          if (auths.length === 0) {
            return [2 /*return*/, { updatedAt: now, providers: [] }];
          }
          tasks = auths.map(function (auth) {
            return (0, provider_usage_shared_js_1.withTimeout)(
              (function () {
                return __awaiter(_this, void 0, void 0, function () {
                  var _a;
                  return __generator(this, function (_b) {
                    switch (_b.label) {
                      case 0:
                        _a = auth.provider;
                        switch (_a) {
                          case "anthropic":
                            return [3 /*break*/, 1];
                          case "github-copilot":
                            return [3 /*break*/, 3];
                          case "google-antigravity":
                            return [3 /*break*/, 5];
                          case "google-gemini-cli":
                            return [3 /*break*/, 7];
                          case "openai-codex":
                            return [3 /*break*/, 9];
                          case "minimax":
                            return [3 /*break*/, 11];
                          case "xiaomi":
                            return [3 /*break*/, 13];
                          case "zai":
                            return [3 /*break*/, 14];
                        }
                        return [3 /*break*/, 16];
                      case 1:
                        return [
                          4 /*yield*/,
                          (0, provider_usage_fetch_js_1.fetchClaudeUsage)(
                            auth.token,
                            timeoutMs,
                            fetchFn,
                          ),
                        ];
                      case 2:
                        return [2 /*return*/, _b.sent()];
                      case 3:
                        return [
                          4 /*yield*/,
                          (0, provider_usage_fetch_js_1.fetchCopilotUsage)(
                            auth.token,
                            timeoutMs,
                            fetchFn,
                          ),
                        ];
                      case 4:
                        return [2 /*return*/, _b.sent()];
                      case 5:
                        return [
                          4 /*yield*/,
                          (0, provider_usage_fetch_js_1.fetchAntigravityUsage)(
                            auth.token,
                            timeoutMs,
                            fetchFn,
                          ),
                        ];
                      case 6:
                        return [2 /*return*/, _b.sent()];
                      case 7:
                        return [
                          4 /*yield*/,
                          (0, provider_usage_fetch_js_1.fetchGeminiUsage)(
                            auth.token,
                            timeoutMs,
                            fetchFn,
                            auth.provider,
                          ),
                        ];
                      case 8:
                        return [2 /*return*/, _b.sent()];
                      case 9:
                        return [
                          4 /*yield*/,
                          (0, provider_usage_fetch_js_1.fetchCodexUsage)(
                            auth.token,
                            auth.accountId,
                            timeoutMs,
                            fetchFn,
                          ),
                        ];
                      case 10:
                        return [2 /*return*/, _b.sent()];
                      case 11:
                        return [
                          4 /*yield*/,
                          (0, provider_usage_fetch_js_1.fetchMinimaxUsage)(
                            auth.token,
                            timeoutMs,
                            fetchFn,
                          ),
                        ];
                      case 12:
                        return [2 /*return*/, _b.sent()];
                      case 13:
                        return [
                          2 /*return*/,
                          {
                            provider: "xiaomi",
                            displayName: provider_usage_shared_js_1.PROVIDER_LABELS.xiaomi,
                            windows: [],
                          },
                        ];
                      case 14:
                        return [
                          4 /*yield*/,
                          (0, provider_usage_fetch_js_1.fetchZaiUsage)(
                            auth.token,
                            timeoutMs,
                            fetchFn,
                          ),
                        ];
                      case 15:
                        return [2 /*return*/, _b.sent()];
                      case 16:
                        return [
                          2 /*return*/,
                          {
                            provider: auth.provider,
                            displayName: provider_usage_shared_js_1.PROVIDER_LABELS[auth.provider],
                            windows: [],
                            error: "Unsupported provider",
                          },
                        ];
                    }
                  });
                });
              })(),
              timeoutMs + 1000,
              {
                provider: auth.provider,
                displayName: provider_usage_shared_js_1.PROVIDER_LABELS[auth.provider],
                windows: [],
                error: "Timeout",
              },
            );
          });
          return [4 /*yield*/, Promise.all(tasks)];
        case 2:
          snapshots = _d.sent();
          providers = snapshots.filter(function (entry) {
            if (entry.windows.length > 0) {
              return true;
            }
            if (!entry.error) {
              return true;
            }
            return !provider_usage_shared_js_1.ignoredErrors.has(entry.error);
          });
          return [2 /*return*/, { updatedAt: now, providers: providers }];
      }
    });
  });
}
