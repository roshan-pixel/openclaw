"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAuthProfileDisplayLabel = resolveAuthProfileDisplayLabel;
function resolveAuthProfileDisplayLabel(params) {
  var _a, _b, _c, _d, _e;
  var cfg = params.cfg,
    store = params.store,
    profileId = params.profileId;
  var profile = store.profiles[profileId];
  var configEmail =
    (_d =
      (_c =
        (_b =
          (_a = cfg === null || cfg === void 0 ? void 0 : cfg.auth) === null || _a === void 0
            ? void 0
            : _a.profiles) === null || _b === void 0
          ? void 0
          : _b[profileId]) === null || _c === void 0
        ? void 0
        : _c.email) === null || _d === void 0
      ? void 0
      : _d.trim();
  var email =
    configEmail ||
    (profile && "email" in profile
      ? (_e = profile.email) === null || _e === void 0
        ? void 0
        : _e.trim()
      : undefined);
  if (email) {
    return "".concat(profileId, " (").concat(email, ")");
  }
  return profileId;
}
