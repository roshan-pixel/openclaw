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
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestOAuthProfileIdForLegacyDefault = suggestOAuthProfileIdForLegacyDefault;
exports.repairOAuthProfileIdMismatch = repairOAuthProfileIdMismatch;
var model_selection_js_1 = require("../model-selection.js");
var profiles_js_1 = require("./profiles.js");
function getProfileSuffix(profileId) {
  var idx = profileId.indexOf(":");
  if (idx < 0) {
    return "";
  }
  return profileId.slice(idx + 1);
}
function isEmailLike(value) {
  var trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  return trimmed.includes("@") && trimmed.includes(".");
}
function suggestOAuthProfileIdForLegacyDefault(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j;
  var providerKey = (0, model_selection_js_1.normalizeProviderId)(params.provider);
  var legacySuffix = getProfileSuffix(params.legacyProfileId);
  if (legacySuffix !== "default") {
    return null;
  }
  var legacyCfg =
    (_c =
      (_b = (_a = params.cfg) === null || _a === void 0 ? void 0 : _a.auth) === null ||
      _b === void 0
        ? void 0
        : _b.profiles) === null || _c === void 0
      ? void 0
      : _c[params.legacyProfileId];
  if (
    legacyCfg &&
    (0, model_selection_js_1.normalizeProviderId)(legacyCfg.provider) === providerKey &&
    legacyCfg.mode !== "oauth"
  ) {
    return null;
  }
  var oauthProfiles = (0, profiles_js_1.listProfilesForProvider)(params.store, providerKey).filter(
    function (id) {
      var _a;
      return (
        ((_a = params.store.profiles[id]) === null || _a === void 0 ? void 0 : _a.type) === "oauth"
      );
    },
  );
  if (oauthProfiles.length === 0) {
    return null;
  }
  var configuredEmail =
    (_d = legacyCfg === null || legacyCfg === void 0 ? void 0 : legacyCfg.email) === null ||
    _d === void 0
      ? void 0
      : _d.trim();
  if (configuredEmail) {
    var byEmail = oauthProfiles.find(function (id) {
      var _a;
      var cred = params.store.profiles[id];
      if (!cred || cred.type !== "oauth") {
        return false;
      }
      var email = (_a = cred.email) === null || _a === void 0 ? void 0 : _a.trim();
      return (
        email === configuredEmail || id === "".concat(providerKey, ":").concat(configuredEmail)
      );
    });
    if (byEmail) {
      return byEmail;
    }
  }
  var lastGood =
    (_f = (_e = params.store.lastGood) === null || _e === void 0 ? void 0 : _e[providerKey]) !==
      null && _f !== void 0
      ? _f
      : (_g = params.store.lastGood) === null || _g === void 0
        ? void 0
        : _g[params.provider];
  if (lastGood && oauthProfiles.includes(lastGood)) {
    return lastGood;
  }
  var nonLegacy = oauthProfiles.filter(function (id) {
    return id !== params.legacyProfileId;
  });
  if (nonLegacy.length === 1) {
    return (_h = nonLegacy[0]) !== null && _h !== void 0 ? _h : null;
  }
  var emailLike = nonLegacy.filter(function (id) {
    return isEmailLike(getProfileSuffix(id));
  });
  if (emailLike.length === 1) {
    return (_j = emailLike[0]) !== null && _j !== void 0 ? _j : null;
  }
  return null;
}
function repairOAuthProfileIdMismatch(params) {
  var _a, _b, _c, _d, _e;
  var legacyProfileId =
    (_a = params.legacyProfileId) !== null && _a !== void 0
      ? _a
      : "".concat((0, model_selection_js_1.normalizeProviderId)(params.provider), ":default");
  var legacyCfg =
    (_c = (_b = params.cfg.auth) === null || _b === void 0 ? void 0 : _b.profiles) === null ||
    _c === void 0
      ? void 0
      : _c[legacyProfileId];
  if (!legacyCfg) {
    return { config: params.cfg, changes: [], migrated: false };
  }
  if (legacyCfg.mode !== "oauth") {
    return { config: params.cfg, changes: [], migrated: false };
  }
  if (
    (0, model_selection_js_1.normalizeProviderId)(legacyCfg.provider) !==
    (0, model_selection_js_1.normalizeProviderId)(params.provider)
  ) {
    return { config: params.cfg, changes: [], migrated: false };
  }
  var toProfileId = suggestOAuthProfileIdForLegacyDefault({
    cfg: params.cfg,
    store: params.store,
    provider: params.provider,
    legacyProfileId: legacyProfileId,
  });
  if (!toProfileId || toProfileId === legacyProfileId) {
    return { config: params.cfg, changes: [], migrated: false };
  }
  var toCred = params.store.profiles[toProfileId];
  var toEmail =
    (toCred === null || toCred === void 0 ? void 0 : toCred.type) === "oauth"
      ? (_d = toCred.email) === null || _d === void 0
        ? void 0
        : _d.trim()
      : undefined;
  var nextProfiles = __assign(
    {},
    (_e = params.cfg.auth) === null || _e === void 0 ? void 0 : _e.profiles,
  );
  delete nextProfiles[legacyProfileId];
  nextProfiles[toProfileId] = __assign(__assign({}, legacyCfg), toEmail ? { email: toEmail } : {});
  var providerKey = (0, model_selection_js_1.normalizeProviderId)(params.provider);
  var nextOrder = (function () {
    var _a;
    var _b;
    var order = (_b = params.cfg.auth) === null || _b === void 0 ? void 0 : _b.order;
    if (!order) {
      return undefined;
    }
    var resolvedKey = Object.keys(order).find(function (key) {
      return (0, model_selection_js_1.normalizeProviderId)(key) === providerKey;
    });
    if (!resolvedKey) {
      return order;
    }
    var existing = order[resolvedKey];
    if (!Array.isArray(existing)) {
      return order;
    }
    var replaced = existing
      .map(function (id) {
        return id === legacyProfileId ? toProfileId : id;
      })
      .filter(function (id) {
        return typeof id === "string" && id.trim().length > 0;
      });
    var deduped = [];
    for (var _i = 0, replaced_1 = replaced; _i < replaced_1.length; _i++) {
      var entry = replaced_1[_i];
      if (!deduped.includes(entry)) {
        deduped.push(entry);
      }
    }
    return __assign(__assign({}, order), ((_a = {}), (_a[resolvedKey] = deduped), _a));
  })();
  var nextCfg = __assign(__assign({}, params.cfg), {
    auth: __assign(
      __assign(__assign({}, params.cfg.auth), { profiles: nextProfiles }),
      nextOrder ? { order: nextOrder } : {},
    ),
  });
  var changes = [
    "Auth: migrate ".concat(legacyProfileId, " \u2192 ").concat(toProfileId, " (OAuth profile id)"),
  ];
  return {
    config: nextCfg,
    changes: changes,
    migrated: true,
    fromProfileId: legacyProfileId,
    toProfileId: toProfileId,
  };
}
