"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAuthDoctorHint = formatAuthDoctorHint;
var command_format_js_1 = require("../../cli/command-format.js");
var model_selection_js_1 = require("../model-selection.js");
var profiles_js_1 = require("./profiles.js");
var repair_js_1 = require("./repair.js");
function formatAuthDoctorHint(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j;
  var providerKey = (0, model_selection_js_1.normalizeProviderId)(params.provider);
  if (providerKey !== "anthropic") {
    return "";
  }
  var legacyProfileId =
    (_a = params.profileId) !== null && _a !== void 0 ? _a : "anthropic:default";
  var suggested = (0, repair_js_1.suggestOAuthProfileIdForLegacyDefault)({
    cfg: params.cfg,
    store: params.store,
    provider: providerKey,
    legacyProfileId: legacyProfileId,
  });
  if (!suggested || suggested === legacyProfileId) {
    return "";
  }
  var storeOauthProfiles = (0, profiles_js_1.listProfilesForProvider)(params.store, providerKey)
    .filter(function (id) {
      var _a;
      return (
        ((_a = params.store.profiles[id]) === null || _a === void 0 ? void 0 : _a.type) === "oauth"
      );
    })
    .join(", ");
  var cfgMode =
    (_e =
      (_d =
        (_c = (_b = params.cfg) === null || _b === void 0 ? void 0 : _b.auth) === null ||
        _c === void 0
          ? void 0
          : _c.profiles) === null || _d === void 0
        ? void 0
        : _d[legacyProfileId]) === null || _e === void 0
      ? void 0
      : _e.mode;
  var cfgProvider =
    (_j =
      (_h =
        (_g = (_f = params.cfg) === null || _f === void 0 ? void 0 : _f.auth) === null ||
        _g === void 0
          ? void 0
          : _g.profiles) === null || _h === void 0
        ? void 0
        : _h[legacyProfileId]) === null || _j === void 0
      ? void 0
      : _j.provider;
  return [
    "Doctor hint (for GitHub issue):",
    "- provider: ".concat(providerKey),
    "- config: "
      .concat(legacyProfileId)
      .concat(
        cfgProvider || cfgMode
          ? " (provider="
              .concat(cfgProvider !== null && cfgProvider !== void 0 ? cfgProvider : "?", ", mode=")
              .concat(cfgMode !== null && cfgMode !== void 0 ? cfgMode : "?", ")")
          : "",
      ),
    "- auth store oauth profiles: ".concat(storeOauthProfiles || "(none)"),
    "- suggested profile: ".concat(suggested),
    'Fix: run "'.concat((0, command_format_js_1.formatCliCommand)("openclaw doctor --yes"), '"'),
  ].join("\n");
}
