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
exports.isProfileInCooldown = isProfileInCooldown;
exports.markAuthProfileUsed = markAuthProfileUsed;
exports.calculateAuthProfileCooldownMs = calculateAuthProfileCooldownMs;
exports.resolveProfileUnusableUntilForDisplay = resolveProfileUnusableUntilForDisplay;
exports.markAuthProfileFailure = markAuthProfileFailure;
exports.markAuthProfileCooldown = markAuthProfileCooldown;
exports.clearAuthProfileCooldown = clearAuthProfileCooldown;
var model_selection_js_1 = require("../model-selection.js");
var store_js_1 = require("./store.js");
function resolveProfileUnusableUntil(stats) {
  var values = [stats.cooldownUntil, stats.disabledUntil]
    .filter(function (value) {
      return typeof value === "number";
    })
    .filter(function (value) {
      return Number.isFinite(value) && value > 0;
    });
  if (values.length === 0) {
    return null;
  }
  return Math.max.apply(Math, values);
}
/**
 * Check if a profile is currently in cooldown (due to rate limiting or errors).
 */
function isProfileInCooldown(store, profileId) {
  var _a;
  var stats = (_a = store.usageStats) === null || _a === void 0 ? void 0 : _a[profileId];
  if (!stats) {
    return false;
  }
  var unusableUntil = resolveProfileUnusableUntil(stats);
  return unusableUntil ? Date.now() < unusableUntil : false;
}
/**
 * Mark a profile as successfully used. Resets error count and updates lastUsed.
 * Uses store lock to avoid overwriting concurrent usage updates.
 */
function markAuthProfileUsed(params) {
  return __awaiter(this, void 0, void 0, function () {
    var store, profileId, agentDir, updated;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ((store = params.store), (profileId = params.profileId), (agentDir = params.agentDir));
          return [
            4 /*yield*/,
            (0, store_js_1.updateAuthProfileStoreWithLock)({
              agentDir: agentDir,
              updater: function (freshStore) {
                var _a;
                if (!freshStore.profiles[profileId]) {
                  return false;
                }
                freshStore.usageStats =
                  (_a = freshStore.usageStats) !== null && _a !== void 0 ? _a : {};
                freshStore.usageStats[profileId] = __assign(
                  __assign({}, freshStore.usageStats[profileId]),
                  {
                    lastUsed: Date.now(),
                    errorCount: 0,
                    cooldownUntil: undefined,
                    disabledUntil: undefined,
                    disabledReason: undefined,
                    failureCounts: undefined,
                  },
                );
                return true;
              },
            }),
          ];
        case 1:
          updated = _b.sent();
          if (updated) {
            store.usageStats = updated.usageStats;
            return [2 /*return*/];
          }
          if (!store.profiles[profileId]) {
            return [2 /*return*/];
          }
          store.usageStats = (_a = store.usageStats) !== null && _a !== void 0 ? _a : {};
          store.usageStats[profileId] = __assign(__assign({}, store.usageStats[profileId]), {
            lastUsed: Date.now(),
            errorCount: 0,
            cooldownUntil: undefined,
            disabledUntil: undefined,
            disabledReason: undefined,
            failureCounts: undefined,
          });
          (0, store_js_1.saveAuthProfileStore)(store, agentDir);
          return [2 /*return*/];
      }
    });
  });
}
function calculateAuthProfileCooldownMs(errorCount) {
  var normalized = Math.max(1, errorCount);
  return Math.min(
    60 * 60 * 1000, // 1 hour max
    60 * 1000 * Math.pow(5, Math.min(normalized - 1, 3)),
  );
}
function resolveAuthCooldownConfig(params) {
  var _a, _b;
  var defaults = {
    billingBackoffHours: 5,
    billingMaxHours: 24,
    failureWindowHours: 24,
  };
  var resolveHours = function (value, fallback) {
    return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
  };
  var cooldowns =
    (_b = (_a = params.cfg) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0
      ? void 0
      : _b.cooldowns;
  var billingOverride = (function () {
    var map =
      cooldowns === null || cooldowns === void 0 ? void 0 : cooldowns.billingBackoffHoursByProvider;
    if (!map) {
      return undefined;
    }
    for (var _i = 0, _a = Object.entries(map); _i < _a.length; _i++) {
      var _b = _a[_i],
        key = _b[0],
        value = _b[1];
      if ((0, model_selection_js_1.normalizeProviderId)(key) === params.providerId) {
        return value;
      }
    }
    return undefined;
  })();
  var billingBackoffHours = resolveHours(
    billingOverride !== null && billingOverride !== void 0
      ? billingOverride
      : cooldowns === null || cooldowns === void 0
        ? void 0
        : cooldowns.billingBackoffHours,
    defaults.billingBackoffHours,
  );
  var billingMaxHours = resolveHours(
    cooldowns === null || cooldowns === void 0 ? void 0 : cooldowns.billingMaxHours,
    defaults.billingMaxHours,
  );
  var failureWindowHours = resolveHours(
    cooldowns === null || cooldowns === void 0 ? void 0 : cooldowns.failureWindowHours,
    defaults.failureWindowHours,
  );
  return {
    billingBackoffMs: billingBackoffHours * 60 * 60 * 1000,
    billingMaxMs: billingMaxHours * 60 * 60 * 1000,
    failureWindowMs: failureWindowHours * 60 * 60 * 1000,
  };
}
function calculateAuthProfileBillingDisableMsWithConfig(params) {
  var normalized = Math.max(1, params.errorCount);
  var baseMs = Math.max(60000, params.baseMs);
  var maxMs = Math.max(baseMs, params.maxMs);
  var exponent = Math.min(normalized - 1, 10);
  var raw = baseMs * Math.pow(2, exponent);
  return Math.min(maxMs, raw);
}
function resolveProfileUnusableUntilForDisplay(store, profileId) {
  var _a;
  var stats = (_a = store.usageStats) === null || _a === void 0 ? void 0 : _a[profileId];
  if (!stats) {
    return null;
  }
  return resolveProfileUnusableUntil(stats);
}
function computeNextProfileUsageStats(params) {
  var _a, _b, _c;
  var windowMs = params.cfgResolved.failureWindowMs;
  var windowExpired =
    typeof params.existing.lastFailureAt === "number" &&
    params.existing.lastFailureAt > 0 &&
    params.now - params.existing.lastFailureAt > windowMs;
  var baseErrorCount = windowExpired
    ? 0
    : (_a = params.existing.errorCount) !== null && _a !== void 0
      ? _a
      : 0;
  var nextErrorCount = baseErrorCount + 1;
  var failureCounts = windowExpired ? {} : __assign({}, params.existing.failureCounts);
  failureCounts[params.reason] =
    ((_b = failureCounts[params.reason]) !== null && _b !== void 0 ? _b : 0) + 1;
  var updatedStats = __assign(__assign({}, params.existing), {
    errorCount: nextErrorCount,
    failureCounts: failureCounts,
    lastFailureAt: params.now,
  });
  if (params.reason === "billing") {
    var billingCount = (_c = failureCounts.billing) !== null && _c !== void 0 ? _c : 1;
    var backoffMs = calculateAuthProfileBillingDisableMsWithConfig({
      errorCount: billingCount,
      baseMs: params.cfgResolved.billingBackoffMs,
      maxMs: params.cfgResolved.billingMaxMs,
    });
    updatedStats.disabledUntil = params.now + backoffMs;
    updatedStats.disabledReason = "billing";
  } else {
    var backoffMs = calculateAuthProfileCooldownMs(nextErrorCount);
    updatedStats.cooldownUntil = params.now + backoffMs;
  }
  return updatedStats;
}
/**
 * Mark a profile as failed for a specific reason. Billing failures are treated
 * as "disabled" (longer backoff) vs the regular cooldown window.
 */
function markAuthProfileFailure(params) {
  return __awaiter(this, void 0, void 0, function () {
    var store, profileId, reason, agentDir, cfg, updated, existing, now, providerKey, cfgResolved;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          ((store = params.store),
            (profileId = params.profileId),
            (reason = params.reason),
            (agentDir = params.agentDir),
            (cfg = params.cfg));
          return [
            4 /*yield*/,
            (0, store_js_1.updateAuthProfileStoreWithLock)({
              agentDir: agentDir,
              updater: function (freshStore) {
                var _a, _b;
                var profile = freshStore.profiles[profileId];
                if (!profile) {
                  return false;
                }
                freshStore.usageStats =
                  (_a = freshStore.usageStats) !== null && _a !== void 0 ? _a : {};
                var existing =
                  (_b = freshStore.usageStats[profileId]) !== null && _b !== void 0 ? _b : {};
                var now = Date.now();
                var providerKey = (0, model_selection_js_1.normalizeProviderId)(profile.provider);
                var cfgResolved = resolveAuthCooldownConfig({
                  cfg: cfg,
                  providerId: providerKey,
                });
                freshStore.usageStats[profileId] = computeNextProfileUsageStats({
                  existing: existing,
                  now: now,
                  reason: reason,
                  cfgResolved: cfgResolved,
                });
                return true;
              },
            }),
          ];
        case 1:
          updated = _e.sent();
          if (updated) {
            store.usageStats = updated.usageStats;
            return [2 /*return*/];
          }
          if (!store.profiles[profileId]) {
            return [2 /*return*/];
          }
          store.usageStats = (_a = store.usageStats) !== null && _a !== void 0 ? _a : {};
          existing = (_b = store.usageStats[profileId]) !== null && _b !== void 0 ? _b : {};
          now = Date.now();
          providerKey = (0, model_selection_js_1.normalizeProviderId)(
            (_d =
              (_c = store.profiles[profileId]) === null || _c === void 0 ? void 0 : _c.provider) !==
              null && _d !== void 0
              ? _d
              : "",
          );
          cfgResolved = resolveAuthCooldownConfig({
            cfg: cfg,
            providerId: providerKey,
          });
          store.usageStats[profileId] = computeNextProfileUsageStats({
            existing: existing,
            now: now,
            reason: reason,
            cfgResolved: cfgResolved,
          });
          (0, store_js_1.saveAuthProfileStore)(store, agentDir);
          return [2 /*return*/];
      }
    });
  });
}
/**
 * Mark a profile as failed/rate-limited. Applies exponential backoff cooldown.
 * Cooldown times: 1min, 5min, 25min, max 1 hour.
 * Uses store lock to avoid overwriting concurrent usage updates.
 */
function markAuthProfileCooldown(params) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            markAuthProfileFailure({
              store: params.store,
              profileId: params.profileId,
              reason: "unknown",
              agentDir: params.agentDir,
            }),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
/**
 * Clear cooldown for a profile (e.g., manual reset).
 * Uses store lock to avoid overwriting concurrent usage updates.
 */
function clearAuthProfileCooldown(params) {
  return __awaiter(this, void 0, void 0, function () {
    var store, profileId, agentDir, updated;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ((store = params.store), (profileId = params.profileId), (agentDir = params.agentDir));
          return [
            4 /*yield*/,
            (0, store_js_1.updateAuthProfileStoreWithLock)({
              agentDir: agentDir,
              updater: function (freshStore) {
                var _a;
                if (
                  !((_a = freshStore.usageStats) === null || _a === void 0 ? void 0 : _a[profileId])
                ) {
                  return false;
                }
                freshStore.usageStats[profileId] = __assign(
                  __assign({}, freshStore.usageStats[profileId]),
                  { errorCount: 0, cooldownUntil: undefined },
                );
                return true;
              },
            }),
          ];
        case 1:
          updated = _b.sent();
          if (updated) {
            store.usageStats = updated.usageStats;
            return [2 /*return*/];
          }
          if (!((_a = store.usageStats) === null || _a === void 0 ? void 0 : _a[profileId])) {
            return [2 /*return*/];
          }
          store.usageStats[profileId] = __assign(__assign({}, store.usageStats[profileId]), {
            errorCount: 0,
            cooldownUntil: undefined,
          });
          (0, store_js_1.saveAuthProfileStore)(store, agentDir);
          return [2 /*return*/];
      }
    });
  });
}
