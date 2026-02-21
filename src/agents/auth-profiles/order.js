"use strict";
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAuthProfileOrder = resolveAuthProfileOrder;
var model_selection_js_1 = require("../model-selection.js");
var profiles_js_1 = require("./profiles.js");
var usage_js_1 = require("./usage.js");
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
function resolveAuthProfileOrder(params) {
  var _a, _b, _c, _d;
  var cfg = params.cfg,
    store = params.store,
    provider = params.provider,
    preferredProfile = params.preferredProfile;
  var providerKey = (0, model_selection_js_1.normalizeProviderId)(provider);
  var now = Date.now();
  var storedOrder = (function () {
    var order = store.order;
    if (!order) {
      return undefined;
    }
    for (var _i = 0, _a = Object.entries(order); _i < _a.length; _i++) {
      var _b = _a[_i],
        key = _b[0],
        value = _b[1];
      if ((0, model_selection_js_1.normalizeProviderId)(key) === providerKey) {
        return value;
      }
    }
    return undefined;
  })();
  var configuredOrder = (function () {
    var _a;
    var order =
      (_a = cfg === null || cfg === void 0 ? void 0 : cfg.auth) === null || _a === void 0
        ? void 0
        : _a.order;
    if (!order) {
      return undefined;
    }
    for (var _i = 0, _b = Object.entries(order); _i < _b.length; _i++) {
      var _c = _b[_i],
        key = _c[0],
        value = _c[1];
      if ((0, model_selection_js_1.normalizeProviderId)(key) === providerKey) {
        return value;
      }
    }
    return undefined;
  })();
  var explicitOrder =
    storedOrder !== null && storedOrder !== void 0 ? storedOrder : configuredOrder;
  var explicitProfiles = (
    (_a = cfg === null || cfg === void 0 ? void 0 : cfg.auth) === null || _a === void 0
      ? void 0
      : _a.profiles
  )
    ? Object.entries(cfg.auth.profiles)
        .filter(function (_a) {
          var profile = _a[1];
          return (0, model_selection_js_1.normalizeProviderId)(profile.provider) === providerKey;
        })
        .map(function (_a) {
          var profileId = _a[0];
          return profileId;
        })
    : [];
  var baseOrder =
    explicitOrder !== null && explicitOrder !== void 0
      ? explicitOrder
      : explicitProfiles.length > 0
        ? explicitProfiles
        : (0, profiles_js_1.listProfilesForProvider)(store, providerKey);
  if (baseOrder.length === 0) {
    return [];
  }
  var filtered = baseOrder.filter(function (profileId) {
    var _a, _b, _c, _d, _e, _f;
    var cred = store.profiles[profileId];
    if (!cred) {
      return false;
    }
    if ((0, model_selection_js_1.normalizeProviderId)(cred.provider) !== providerKey) {
      return false;
    }
    var profileConfig =
      (_b =
        (_a = cfg === null || cfg === void 0 ? void 0 : cfg.auth) === null || _a === void 0
          ? void 0
          : _a.profiles) === null || _b === void 0
        ? void 0
        : _b[profileId];
    if (profileConfig) {
      if ((0, model_selection_js_1.normalizeProviderId)(profileConfig.provider) !== providerKey) {
        return false;
      }
      if (profileConfig.mode !== cred.type) {
        var oauthCompatible = profileConfig.mode === "oauth" && cred.type === "token";
        if (!oauthCompatible) {
          return false;
        }
      }
    }
    if (cred.type === "api_key") {
      return Boolean((_c = cred.key) === null || _c === void 0 ? void 0 : _c.trim());
    }
    if (cred.type === "token") {
      if (!((_d = cred.token) === null || _d === void 0 ? void 0 : _d.trim())) {
        return false;
      }
      if (
        typeof cred.expires === "number" &&
        Number.isFinite(cred.expires) &&
        cred.expires > 0 &&
        now >= cred.expires
      ) {
        return false;
      }
      return true;
    }
    if (cred.type === "oauth") {
      return Boolean(
        ((_e = cred.access) === null || _e === void 0 ? void 0 : _e.trim()) ||
        ((_f = cred.refresh) === null || _f === void 0 ? void 0 : _f.trim()),
      );
    }
    return false;
  });
  var deduped = [];
  for (var _i = 0, filtered_1 = filtered; _i < filtered_1.length; _i++) {
    var entry = filtered_1[_i];
    if (!deduped.includes(entry)) {
      deduped.push(entry);
    }
  }
  // If user specified explicit order (store override or config), respect it
  // exactly, but still apply cooldown sorting to avoid repeatedly selecting
  // known-bad/rate-limited keys as the first candidate.
  if (explicitOrder && explicitOrder.length > 0) {
    // ...but still respect cooldown tracking to avoid repeatedly selecting a
    // known-bad/rate-limited key as the first candidate.
    var available = [];
    var inCooldown = [];
    for (var _e = 0, deduped_1 = deduped; _e < deduped_1.length; _e++) {
      var profileId = deduped_1[_e];
      var cooldownUntil =
        (_d = resolveProfileUnusableUntil(
          (_c = (_b = store.usageStats) === null || _b === void 0 ? void 0 : _b[profileId]) !==
            null && _c !== void 0
            ? _c
            : {},
        )) !== null && _d !== void 0
          ? _d
          : 0;
      if (
        typeof cooldownUntil === "number" &&
        Number.isFinite(cooldownUntil) &&
        cooldownUntil > 0 &&
        now < cooldownUntil
      ) {
        inCooldown.push({ profileId: profileId, cooldownUntil: cooldownUntil });
      } else {
        available.push(profileId);
      }
    }
    var cooldownSorted = inCooldown
      .toSorted(function (a, b) {
        return a.cooldownUntil - b.cooldownUntil;
      })
      .map(function (entry) {
        return entry.profileId;
      });
    var ordered = __spreadArray(__spreadArray([], available, true), cooldownSorted, true);
    // Still put preferredProfile first if specified
    if (preferredProfile && ordered.includes(preferredProfile)) {
      return __spreadArray(
        [preferredProfile],
        ordered.filter(function (e) {
          return e !== preferredProfile;
        }),
        true,
      );
    }
    return ordered;
  }
  // Otherwise, use round-robin: sort by lastUsed (oldest first)
  // preferredProfile goes first if specified (for explicit user choice)
  // lastGood is NOT prioritized - that would defeat round-robin
  var sorted = orderProfilesByMode(deduped, store);
  if (preferredProfile && sorted.includes(preferredProfile)) {
    return __spreadArray(
      [preferredProfile],
      sorted.filter(function (e) {
        return e !== preferredProfile;
      }),
      true,
    );
  }
  return sorted;
}
function orderProfilesByMode(order, store) {
  var now = Date.now();
  // Partition into available and in-cooldown
  var available = [];
  var inCooldown = [];
  for (var _i = 0, order_1 = order; _i < order_1.length; _i++) {
    var profileId = order_1[_i];
    if ((0, usage_js_1.isProfileInCooldown)(store, profileId)) {
      inCooldown.push(profileId);
    } else {
      available.push(profileId);
    }
  }
  // Sort available profiles by lastUsed (oldest first = round-robin)
  // Then by lastUsed (oldest first = round-robin within type)
  var scored = available.map(function (profileId) {
    var _a, _b, _c, _d;
    var type = (_a = store.profiles[profileId]) === null || _a === void 0 ? void 0 : _a.type;
    var typeScore = type === "oauth" ? 0 : type === "token" ? 1 : type === "api_key" ? 2 : 3;
    var lastUsed =
      (_d =
        (_c = (_b = store.usageStats) === null || _b === void 0 ? void 0 : _b[profileId]) ===
          null || _c === void 0
          ? void 0
          : _c.lastUsed) !== null && _d !== void 0
        ? _d
        : 0;
    return { profileId: profileId, typeScore: typeScore, lastUsed: lastUsed };
  });
  // Primary sort: type preference (oauth > token > api_key).
  // Secondary sort: lastUsed (oldest first for round-robin within type).
  var sorted = scored
    .toSorted(function (a, b) {
      // First by type (oauth > token > api_key)
      if (a.typeScore !== b.typeScore) {
        return a.typeScore - b.typeScore;
      }
      // Then by lastUsed (oldest first)
      return a.lastUsed - b.lastUsed;
    })
    .map(function (entry) {
      return entry.profileId;
    });
  // Append cooldown profiles at the end (sorted by cooldown expiry, soonest first)
  var cooldownSorted = inCooldown
    .map(function (profileId) {
      var _a, _b, _c;
      return {
        profileId: profileId,
        cooldownUntil:
          (_c = resolveProfileUnusableUntil(
            (_b = (_a = store.usageStats) === null || _a === void 0 ? void 0 : _a[profileId]) !==
              null && _b !== void 0
              ? _b
              : {},
          )) !== null && _c !== void 0
            ? _c
            : now,
      };
    })
    .toSorted(function (a, b) {
      return a.cooldownUntil - b.cooldownUntil;
    })
    .map(function (entry) {
      return entry.profileId;
    });
  return __spreadArray(__spreadArray([], sorted, true), cooldownSorted, true);
}
