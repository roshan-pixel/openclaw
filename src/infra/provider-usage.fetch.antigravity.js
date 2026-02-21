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
exports.fetchAntigravityUsage = fetchAntigravityUsage;
var logger_js_1 = require("../logger.js");
var provider_usage_fetch_shared_js_1 = require("./provider-usage.fetch.shared.js");
var provider_usage_shared_js_1 = require("./provider-usage.shared.js");
var BASE_URL = "https://cloudcode-pa.googleapis.com";
var LOAD_CODE_ASSIST_PATH = "/v1internal:loadCodeAssist";
var FETCH_AVAILABLE_MODELS_PATH = "/v1internal:fetchAvailableModels";
var METADATA = {
  ideType: "ANTIGRAVITY",
  platform: "PLATFORM_UNSPECIFIED",
  pluginType: "GEMINI",
};
function parseNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    var parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}
function parseEpochMs(isoString) {
  if (!(isoString === null || isoString === void 0 ? void 0 : isoString.trim())) {
    return undefined;
  }
  try {
    var ms = Date.parse(isoString);
    if (Number.isFinite(ms)) {
      return ms;
    }
  } catch (_a) {
    // ignore parse errors
  }
  return undefined;
}
function parseErrorMessage(res) {
  return __awaiter(this, void 0, void 0, function () {
    var data, message, _a;
    var _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          _d.trys.push([0, 2, , 3]);
          return [4 /*yield*/, res.json()];
        case 1:
          data = _d.sent();
          message =
            (_c =
              (_b = data === null || data === void 0 ? void 0 : data.error) === null ||
              _b === void 0
                ? void 0
                : _b.message) === null || _c === void 0
              ? void 0
              : _c.trim();
          if (message) {
            return [2 /*return*/, message];
          }
          return [3 /*break*/, 3];
        case 2:
          _a = _d.sent();
          return [3 /*break*/, 3];
        case 3:
          return [2 /*return*/, "HTTP ".concat(res.status)];
      }
    });
  });
}
function extractCredits(data) {
  var _a;
  var available = parseNumber(data.availablePromptCredits);
  var monthly = parseNumber(
    (_a = data.planInfo) === null || _a === void 0 ? void 0 : _a.monthlyPromptCredits,
  );
  if (available === undefined || monthly === undefined || monthly <= 0) {
    return undefined;
  }
  return { available: available, monthly: monthly };
}
function extractPlanInfo(data) {
  var _a, _b, _c;
  var tierName =
    (_b = (_a = data.currentTier) === null || _a === void 0 ? void 0 : _a.name) === null ||
    _b === void 0
      ? void 0
      : _b.trim();
  if (tierName) {
    return tierName;
  }
  var planType = (_c = data.planType) === null || _c === void 0 ? void 0 : _c.trim();
  if (planType) {
    return planType;
  }
  return undefined;
}
function extractProjectId(data) {
  var project = data.cloudaicompanionProject;
  if (!project) {
    return undefined;
  }
  if (typeof project === "string") {
    return project.trim() ? project : undefined;
  }
  var projectId = typeof project.id === "string" ? project.id.trim() : undefined;
  return projectId || undefined;
}
function extractModelQuotas(data) {
  var result = new Map();
  if (!data.models || typeof data.models !== "object") {
    return result;
  }
  for (var _i = 0, _a = Object.entries(data.models); _i < _a.length; _i++) {
    var _b = _a[_i],
      modelId = _b[0],
      modelInfo = _b[1];
    var quotaInfo = modelInfo.quotaInfo;
    if (!quotaInfo) {
      continue;
    }
    var remainingFraction = parseNumber(quotaInfo.remainingFraction);
    if (remainingFraction === undefined) {
      continue;
    }
    var resetTime = parseEpochMs(quotaInfo.resetTime);
    result.set(modelId, { remainingFraction: remainingFraction, resetTime: resetTime });
  }
  return result;
}
function buildUsageWindows(opts) {
  var windows = [];
  // Credits window (overall)
  if (opts.credits) {
    var _a = opts.credits,
      available = _a.available,
      monthly = _a.monthly;
    var used = monthly - available;
    var usedPercent = (0, provider_usage_shared_js_1.clampPercent)((used / monthly) * 100);
    windows.push({ label: "Credits", usedPercent: usedPercent });
  }
  // Individual model windows
  if (opts.modelQuotas && opts.modelQuotas.size > 0) {
    var modelWindows = [];
    for (var _i = 0, _b = opts.modelQuotas; _i < _b.length; _i++) {
      var _c = _b[_i],
        modelId = _c[0],
        quota = _c[1];
      var lowerModelId = modelId.toLowerCase();
      // Skip internal models
      if (lowerModelId.includes("chat_") || lowerModelId.includes("tab_")) {
        continue;
      }
      var usedPercent = (0, provider_usage_shared_js_1.clampPercent)(
        (1 - quota.remainingFraction) * 100,
      );
      var window_1 = { label: modelId, usedPercent: usedPercent };
      if (quota.resetTime) {
        window_1.resetAt = quota.resetTime;
      }
      modelWindows.push(window_1);
    }
    // Sort by usage (highest first) and take top 10
    modelWindows.sort(function (a, b) {
      return b.usedPercent - a.usedPercent;
    });
    var topModels = modelWindows.slice(0, 10);
    (0, logger_js_1.logDebug)(
      "[antigravity] Built "
        .concat(topModels.length, " model windows from ")
        .concat(opts.modelQuotas.size, " total models"),
    );
    for (var _d = 0, topModels_1 = topModels; _d < topModels_1.length; _d++) {
      var w = topModels_1[_d];
      (0, logger_js_1.logDebug)(
        "[antigravity]   "
          .concat(w.label, ": ")
          .concat(w.usedPercent.toFixed(1), "% used")
          .concat(w.resetAt ? " (resets at ".concat(new Date(w.resetAt).toISOString(), ")") : ""),
      );
    }
    windows.push.apply(windows, topModels);
  }
  return windows;
}
function fetchAntigravityUsage(token, timeoutMs, fetchFn) {
  return __awaiter(this, void 0, void 0, function () {
    var headers,
      credits,
      modelQuotas,
      planInfo,
      lastError,
      projectId,
      res,
      data,
      _a,
      body,
      res,
      data,
      _i,
      modelQuotas_1,
      _b,
      modelId,
      quota,
      err,
      _c,
      windows,
      snapshot;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          headers = {
            Authorization: "Bearer ".concat(token),
            "Content-Type": "application/json",
            "User-Agent": "antigravity",
            "X-Goog-Api-Client": "google-cloud-sdk vscode_cloudshelleditor/0.1",
          };
          _d.label = 1;
        case 1:
          _d.trys.push([1, 7, , 8]);
          return [
            4 /*yield*/,
            (0, provider_usage_fetch_shared_js_1.fetchJson)(
              "".concat(BASE_URL).concat(LOAD_CODE_ASSIST_PATH),
              { method: "POST", headers: headers, body: JSON.stringify({ metadata: METADATA }) },
              timeoutMs,
              fetchFn,
            ),
          ];
        case 2:
          res = _d.sent();
          if (!res.ok) {
            return [3 /*break*/, 4];
          }
          return [4 /*yield*/, res.json()];
        case 3:
          data = _d.sent();
          // Extract project ID for subsequent calls
          projectId = extractProjectId(data);
          credits = extractCredits(data);
          planInfo = extractPlanInfo(data);
          (0, logger_js_1.logDebug)(
            "[antigravity] Credits: "
              .concat(credits ? "".concat(credits.available, "/").concat(credits.monthly) : "none")
              .concat(planInfo ? " (plan: ".concat(planInfo, ")") : ""),
          );
          return [3 /*break*/, 6];
        case 4:
          return [4 /*yield*/, parseErrorMessage(res)];
        case 5:
          lastError = _d.sent();
          // Fatal auth errors - stop early
          if (res.status === 401) {
            return [
              2 /*return*/,
              {
                provider: "google-antigravity",
                displayName: provider_usage_shared_js_1.PROVIDER_LABELS["google-antigravity"],
                windows: [],
                error: "Token expired",
              },
            ];
          }
          _d.label = 6;
        case 6:
          return [3 /*break*/, 8];
        case 7:
          _a = _d.sent();
          lastError = "Network error";
          return [3 /*break*/, 8];
        case 8:
          // Fetch fetchAvailableModels (model quotas)
          if (!projectId) {
            (0, logger_js_1.logDebug)(
              "[antigravity] Missing project id; requesting available models without project",
            );
          }
          _d.label = 9;
        case 9:
          _d.trys.push([9, 15, , 16]);
          body = JSON.stringify(projectId ? { project: projectId } : {});
          return [
            4 /*yield*/,
            (0, provider_usage_fetch_shared_js_1.fetchJson)(
              "".concat(BASE_URL).concat(FETCH_AVAILABLE_MODELS_PATH),
              { method: "POST", headers: headers, body: body },
              timeoutMs,
              fetchFn,
            ),
          ];
        case 10:
          res = _d.sent();
          if (!res.ok) {
            return [3 /*break*/, 12];
          }
          return [4 /*yield*/, res.json()];
        case 11:
          data = _d.sent();
          modelQuotas = extractModelQuotas(data);
          (0, logger_js_1.logDebug)(
            "[antigravity] Extracted ".concat(modelQuotas.size, " model quotas from API"),
          );
          for (_i = 0, modelQuotas_1 = modelQuotas; _i < modelQuotas_1.length; _i++) {
            ((_b = modelQuotas_1[_i]), (modelId = _b[0]), (quota = _b[1]));
            (0, logger_js_1.logDebug)(
              "[antigravity]   "
                .concat(modelId, ": ")
                .concat((quota.remainingFraction * 100).toFixed(1), "% remaining")
                .concat(
                  quota.resetTime
                    ? " (resets ".concat(new Date(quota.resetTime).toISOString(), ")")
                    : "",
                ),
            );
          }
          return [3 /*break*/, 14];
        case 12:
          return [4 /*yield*/, parseErrorMessage(res)];
        case 13:
          err = _d.sent();
          if (res.status === 401) {
            lastError = "Token expired";
          } else if (!lastError) {
            lastError = err;
          }
          _d.label = 14;
        case 14:
          return [3 /*break*/, 16];
        case 15:
          _c = _d.sent();
          if (!lastError) {
            lastError = "Network error";
          }
          return [3 /*break*/, 16];
        case 16:
          windows = buildUsageWindows({ credits: credits, modelQuotas: modelQuotas });
          // Return error only if we got nothing
          if (windows.length === 0 && lastError) {
            (0, logger_js_1.logDebug)("[antigravity] Returning error snapshot: ".concat(lastError));
            return [
              2 /*return*/,
              {
                provider: "google-antigravity",
                displayName: provider_usage_shared_js_1.PROVIDER_LABELS["google-antigravity"],
                windows: [],
                error: lastError,
              },
            ];
          }
          snapshot = {
            provider: "google-antigravity",
            displayName: provider_usage_shared_js_1.PROVIDER_LABELS["google-antigravity"],
            windows: windows,
            plan: planInfo,
          };
          (0, logger_js_1.logDebug)(
            "[antigravity] Returning snapshot with "
              .concat(windows.length, " windows")
              .concat(planInfo ? " (plan: ".concat(planInfo, ")") : ""),
          );
          (0, logger_js_1.logDebug)(
            "[antigravity] Snapshot: ".concat(JSON.stringify(snapshot, null, 2)),
          );
          return [2 /*return*/, snapshot];
      }
    });
  });
}
