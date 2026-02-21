"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidProfileName = isValidProfileName;
exports.normalizeProfileName = normalizeProfileName;
var PROFILE_NAME_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
function isValidProfileName(value) {
  if (!value) {
    return false;
  }
  // Keep it path-safe + shell-friendly.
  return PROFILE_NAME_RE.test(value);
}
function normalizeProfileName(raw) {
  var profile = raw === null || raw === void 0 ? void 0 : raw.trim();
  if (!profile) {
    return null;
  }
  if (profile.toLowerCase() === "default") {
    return null;
  }
  if (!isValidProfileName(profile)) {
    return null;
  }
  return profile;
}
