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
exports.fetchMinimaxUsage = fetchMinimaxUsage;
var provider_usage_fetch_shared_js_1 = require("./provider-usage.fetch.shared.js");
var provider_usage_shared_js_1 = require("./provider-usage.shared.js");
var RESET_KEYS = [
  "reset_at",
  "resetAt",
  "reset_time",
  "resetTime",
  "next_reset_at",
  "nextResetAt",
  "next_reset_time",
  "nextResetTime",
  "expires_at",
  "expiresAt",
  "expire_at",
  "expireAt",
  "end_time",
  "endTime",
  "window_end",
  "windowEnd",
];
var PERCENT_KEYS = [
  "used_percent",
  "usedPercent",
  "usage_percent",
  "usagePercent",
  "used_rate",
  "usage_rate",
  "used_ratio",
  "usage_ratio",
  "usedRatio",
  "usageRatio",
];
var USED_KEYS = [
  "used",
  "usage",
  "used_amount",
  "usedAmount",
  "used_tokens",
  "usedTokens",
  "used_quota",
  "usedQuota",
  "used_times",
  "usedTimes",
  "prompt_used",
  "promptUsed",
  "used_prompt",
  "usedPrompt",
  "prompts_used",
  "promptsUsed",
  "current_interval_usage_count",
  "currentIntervalUsageCount",
  "consumed",
];
var TOTAL_KEYS = [
  "total",
  "total_amount",
  "totalAmount",
  "total_tokens",
  "totalTokens",
  "total_quota",
  "totalQuota",
  "total_times",
  "totalTimes",
  "prompt_total",
  "promptTotal",
  "total_prompt",
  "totalPrompt",
  "prompt_limit",
  "promptLimit",
  "limit_prompt",
  "limitPrompt",
  "prompts_total",
  "promptsTotal",
  "total_prompts",
  "totalPrompts",
  "current_interval_total_count",
  "currentIntervalTotalCount",
  "limit",
  "quota",
  "quota_limit",
  "quotaLimit",
  "max",
];
var REMAINING_KEYS = [
  "remain",
  "remaining",
  "remain_amount",
  "remainingAmount",
  "remaining_amount",
  "remain_tokens",
  "remainingTokens",
  "remaining_tokens",
  "remain_quota",
  "remainingQuota",
  "remaining_quota",
  "remain_times",
  "remainingTimes",
  "remaining_times",
  "prompt_remain",
  "promptRemain",
  "remain_prompt",
  "remainPrompt",
  "prompt_remaining",
  "promptRemaining",
  "remaining_prompt",
  "remainingPrompt",
  "prompts_remaining",
  "promptsRemaining",
  "prompt_left",
  "promptLeft",
  "prompts_left",
  "promptsLeft",
  "left",
];
var PLAN_KEYS = ["plan", "plan_name", "planName", "product", "tier"];
var WINDOW_HOUR_KEYS = ["window_hours", "windowHours", "duration_hours", "durationHours", "hours"];
var WINDOW_MINUTE_KEYS = [
  "window_minutes",
  "windowMinutes",
  "duration_minutes",
  "durationMinutes",
  "minutes",
];
function isRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function pickNumber(record, keys) {
  for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
    var key = keys_1[_i];
    var value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string") {
      var parsed = Number.parseFloat(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
}
function pickString(record, keys) {
  for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
    var key = keys_2[_i];
    var value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}
function parseEpoch(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value < 1e12) {
      return Math.floor(value * 1000);
    }
    return Math.floor(value);
  }
  if (typeof value === "string" && value.trim()) {
    var parsed = Date.parse(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}
function hasAny(record, keys) {
  return keys.some(function (key) {
    return key in record;
  });
}
function scoreUsageRecord(record) {
  var score = 0;
  if (hasAny(record, PERCENT_KEYS)) {
    score += 4;
  }
  if (hasAny(record, TOTAL_KEYS)) {
    score += 3;
  }
  if (hasAny(record, USED_KEYS) || hasAny(record, REMAINING_KEYS)) {
    score += 2;
  }
  if (hasAny(record, RESET_KEYS)) {
    score += 1;
  }
  if (hasAny(record, PLAN_KEYS)) {
    score += 1;
  }
  return score;
}
function collectUsageCandidates(root) {
  var MAX_SCAN_DEPTH = 4;
  var MAX_SCAN_NODES = 60;
  var queue = [{ value: root, depth: 0 }];
  var seen = new Set();
  var candidates = [];
  var scanned = 0;
  while (queue.length && scanned < MAX_SCAN_NODES) {
    var next = queue.shift();
    if (!next) {
      break;
    }
    scanned += 1;
    var value = next.value,
      depth = next.depth;
    if (isRecord(value)) {
      if (seen.has(value)) {
        continue;
      }
      seen.add(value);
      var score = scoreUsageRecord(value);
      if (score > 0) {
        candidates.push({ record: value, score: score, depth: depth });
      }
      if (depth < MAX_SCAN_DEPTH) {
        for (var _i = 0, _a = Object.values(value); _i < _a.length; _i++) {
          var nested = _a[_i];
          if (isRecord(nested) || Array.isArray(nested)) {
            queue.push({ value: nested, depth: depth + 1 });
          }
        }
      }
      continue;
    }
    if (Array.isArray(value) && depth < MAX_SCAN_DEPTH) {
      for (var _b = 0, value_1 = value; _b < value_1.length; _b++) {
        var nested = value_1[_b];
        if (isRecord(nested) || Array.isArray(nested)) {
          queue.push({ value: nested, depth: depth + 1 });
        }
      }
    }
  }
  candidates.sort(function (a, b) {
    return b.score - a.score || a.depth - b.depth;
  });
  return candidates.map(function (candidate) {
    return candidate.record;
  });
}
function deriveWindowLabel(payload) {
  var hours = pickNumber(payload, WINDOW_HOUR_KEYS);
  if (hours && Number.isFinite(hours)) {
    return "".concat(hours, "h");
  }
  var minutes = pickNumber(payload, WINDOW_MINUTE_KEYS);
  if (minutes && Number.isFinite(minutes)) {
    return "".concat(minutes, "m");
  }
  return "5h";
}
function deriveUsedPercent(payload) {
  var total = pickNumber(payload, TOTAL_KEYS);
  var used = pickNumber(payload, USED_KEYS);
  var remaining = pickNumber(payload, REMAINING_KEYS);
  if (used === undefined && remaining !== undefined && total !== undefined) {
    used = total - remaining;
  }
  var fromCounts =
    total && total > 0 && used !== undefined && Number.isFinite(used)
      ? (0, provider_usage_shared_js_1.clampPercent)((used / total) * 100)
      : null;
  var percentRaw = pickNumber(payload, PERCENT_KEYS);
  if (percentRaw !== undefined) {
    var normalized = (0, provider_usage_shared_js_1.clampPercent)(
      percentRaw <= 1 ? percentRaw * 100 : percentRaw,
    );
    if (fromCounts !== null) {
      var inverted = (0, provider_usage_shared_js_1.clampPercent)(100 - normalized);
      if (Math.abs(normalized - fromCounts) <= 1 || Math.abs(inverted - fromCounts) <= 1) {
        return fromCounts;
      }
      return fromCounts;
    }
    return normalized;
  }
  return fromCounts;
}
function fetchMinimaxUsage(apiKey, timeoutMs, fetchFn) {
  return __awaiter(this, void 0, void 0, function () {
    var res,
      data,
      baseResp,
      payload,
      candidates,
      usageRecord,
      usedPercent,
      _i,
      candidates_1,
      candidate,
      candidatePercent,
      resetAt,
      windows;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, provider_usage_fetch_shared_js_1.fetchJson)(
              "https://api.minimaxi.com/v1/api/openplatform/coding_plan/remains",
              {
                method: "GET",
                headers: {
                  Authorization: "Bearer ".concat(apiKey),
                  "Content-Type": "application/json",
                  "MM-API-Source": "OpenClaw",
                },
              },
              timeoutMs,
              fetchFn,
            ),
          ];
        case 1:
          res = _f.sent();
          if (!res.ok) {
            return [
              2 /*return*/,
              {
                provider: "minimax",
                displayName: provider_usage_shared_js_1.PROVIDER_LABELS.minimax,
                windows: [],
                error: "HTTP ".concat(res.status),
              },
            ];
          }
          return [
            4 /*yield*/,
            res.json().catch(function () {
              return null;
            }),
          ];
        case 2:
          data = _f.sent();
          if (!isRecord(data)) {
            return [
              2 /*return*/,
              {
                provider: "minimax",
                displayName: provider_usage_shared_js_1.PROVIDER_LABELS.minimax,
                windows: [],
                error: "Invalid JSON",
              },
            ];
          }
          baseResp = isRecord(data.base_resp) ? data.base_resp : undefined;
          if (baseResp && typeof baseResp.status_code === "number" && baseResp.status_code !== 0) {
            return [
              2 /*return*/,
              {
                provider: "minimax",
                displayName: provider_usage_shared_js_1.PROVIDER_LABELS.minimax,
                windows: [],
                error:
                  ((_a = baseResp.status_msg) === null || _a === void 0 ? void 0 : _a.trim()) ||
                  "API error",
              },
            ];
          }
          payload = isRecord(data.data) ? data.data : data;
          candidates = collectUsageCandidates(payload);
          usageRecord = payload;
          usedPercent = null;
          for (_i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
            candidate = candidates_1[_i];
            candidatePercent = deriveUsedPercent(candidate);
            if (candidatePercent !== null) {
              usageRecord = candidate;
              usedPercent = candidatePercent;
              break;
            }
          }
          if (usedPercent === null) {
            usedPercent = deriveUsedPercent(payload);
          }
          if (usedPercent === null) {
            return [
              2 /*return*/,
              {
                provider: "minimax",
                displayName: provider_usage_shared_js_1.PROVIDER_LABELS.minimax,
                windows: [],
                error: "Unsupported response shape",
              },
            ];
          }
          resetAt =
            (_d =
              (_c =
                (_b = parseEpoch(pickString(usageRecord, RESET_KEYS))) !== null && _b !== void 0
                  ? _b
                  : parseEpoch(pickNumber(usageRecord, RESET_KEYS))) !== null && _c !== void 0
                ? _c
                : parseEpoch(pickString(payload, RESET_KEYS))) !== null && _d !== void 0
              ? _d
              : parseEpoch(pickNumber(payload, RESET_KEYS));
          windows = [
            {
              label: deriveWindowLabel(usageRecord),
              usedPercent: usedPercent,
              resetAt: resetAt,
            },
          ];
          return [
            2 /*return*/,
            {
              provider: "minimax",
              displayName: provider_usage_shared_js_1.PROVIDER_LABELS.minimax,
              windows: windows,
              plan:
                (_e = pickString(usageRecord, PLAN_KEYS)) !== null && _e !== void 0
                  ? _e
                  : pickString(payload, PLAN_KEYS),
            },
          ];
      }
    });
  });
}
