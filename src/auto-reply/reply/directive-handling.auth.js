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
exports.resolveProfileOverride = exports.formatAuthLabel = exports.resolveAuthLabel = void 0;
var auth_profiles_js_1 = require("../../agents/auth-profiles.js");
var model_auth_js_1 = require("../../agents/model-auth.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var utils_js_1 = require("../../utils.js");
var maskApiKey = function (value) {
  var trimmed = value.trim();
  if (!trimmed) {
    return "missing";
  }
  if (trimmed.length <= 16) {
    return trimmed;
  }
  return "".concat(trimmed.slice(0, 8), "...").concat(trimmed.slice(-8));
};
var resolveAuthLabel = function (provider_1, cfg_1, modelsPath_1, agentDir_1) {
  var args_1 = [];
  for (var _i = 4; _i < arguments.length; _i++) {
    args_1[_i - 4] = arguments[_i];
  }
  return __awaiter(
    void 0,
    __spreadArray([provider_1, cfg_1, modelsPath_1, agentDir_1], args_1, true),
    void 0,
    function (provider, cfg, modelsPath, agentDir, mode) {
      var formatPath,
        store,
        order,
        providerKey,
        lastGood,
        nextProfileId,
        now,
        formatUntil,
        profileId,
        profile,
        configProfile,
        missing,
        more,
        exp_1,
        display,
        label,
        exp,
        labels,
        envKey,
        isOAuthEnv,
        label,
        customKey;
      var _a, _b;
      if (mode === void 0) {
        mode = "compact";
      }
      return __generator(this, function (_c) {
        formatPath = function (value) {
          return (0, utils_js_1.shortenHomePath)(value);
        };
        store = (0, model_auth_js_1.ensureAuthProfileStore)(agentDir, {
          allowKeychainPrompt: false,
        });
        order = (0, model_auth_js_1.resolveAuthProfileOrder)({
          cfg: cfg,
          store: store,
          provider: provider,
        });
        providerKey = (0, model_selection_js_1.normalizeProviderId)(provider);
        lastGood = (function () {
          var map = store.lastGood;
          if (!map) {
            return undefined;
          }
          for (var _i = 0, _a = Object.entries(map); _i < _a.length; _i++) {
            var _b = _a[_i],
              key = _b[0],
              value = _b[1];
            if ((0, model_selection_js_1.normalizeProviderId)(key) === providerKey) {
              return value;
            }
          }
          return undefined;
        })();
        nextProfileId = order[0];
        now = Date.now();
        formatUntil = function (timestampMs) {
          var remainingMs = Math.max(0, timestampMs - now);
          var minutes = Math.round(remainingMs / 60000);
          if (minutes < 1) {
            return "soon";
          }
          if (minutes < 60) {
            return "".concat(minutes, "m");
          }
          var hours = Math.round(minutes / 60);
          if (hours < 48) {
            return "".concat(hours, "h");
          }
          var days = Math.round(hours / 24);
          return "".concat(days, "d");
        };
        if (order.length > 0) {
          if (mode === "compact") {
            profileId = nextProfileId;
            if (!profileId) {
              return [2 /*return*/, { label: "missing", source: "missing" }];
            }
            profile = store.profiles[profileId];
            configProfile =
              (_b = (_a = cfg.auth) === null || _a === void 0 ? void 0 : _a.profiles) === null ||
              _b === void 0
                ? void 0
                : _b[profileId];
            missing =
              !profile ||
              ((configProfile === null || configProfile === void 0
                ? void 0
                : configProfile.provider) &&
                configProfile.provider !== profile.provider) ||
              ((configProfile === null || configProfile === void 0 ? void 0 : configProfile.mode) &&
                configProfile.mode !== profile.type &&
                !(configProfile.mode === "oauth" && profile.type === "token"));
            more = order.length > 1 ? " (+".concat(order.length - 1, ")") : "";
            if (missing) {
              return [
                2 /*return*/,
                { label: "".concat(profileId, " missing").concat(more), source: "" },
              ];
            }
            if (profile.type === "api_key") {
              return [
                2 /*return*/,
                {
                  label: ""
                    .concat(profileId, " api-key ")
                    .concat(maskApiKey(profile.key))
                    .concat(more),
                  source: "",
                },
              ];
            }
            if (profile.type === "token") {
              exp_1 =
                typeof profile.expires === "number" &&
                Number.isFinite(profile.expires) &&
                profile.expires > 0
                  ? profile.expires <= now
                    ? " expired"
                    : " exp ".concat(formatUntil(profile.expires))
                  : "";
              return [
                2 /*return*/,
                {
                  label: ""
                    .concat(profileId, " token ")
                    .concat(maskApiKey(profile.token))
                    .concat(exp_1)
                    .concat(more),
                  source: "",
                },
              ];
            }
            display = (0, auth_profiles_js_1.resolveAuthProfileDisplayLabel)({
              cfg: cfg,
              store: store,
              profileId: profileId,
            });
            label = display === profileId ? profileId : display;
            exp =
              typeof profile.expires === "number" &&
              Number.isFinite(profile.expires) &&
              profile.expires > 0
                ? profile.expires <= now
                  ? " expired"
                  : " exp ".concat(formatUntil(profile.expires))
                : "";
            return [
              2 /*return*/,
              { label: "".concat(label, " oauth").concat(exp).concat(more), source: "" },
            ];
          }
          labels = order.map(function (profileId) {
            var _a, _b, _c, _d;
            var profile = store.profiles[profileId];
            var configProfile =
              (_b = (_a = cfg.auth) === null || _a === void 0 ? void 0 : _a.profiles) === null ||
              _b === void 0
                ? void 0
                : _b[profileId];
            var flags = [];
            if (profileId === nextProfileId) {
              flags.push("next");
            }
            if (lastGood && profileId === lastGood) {
              flags.push("lastGood");
            }
            if ((0, auth_profiles_js_1.isProfileInCooldown)(store, profileId)) {
              var until =
                (_d =
                  (_c = store.usageStats) === null || _c === void 0 ? void 0 : _c[profileId]) ===
                  null || _d === void 0
                  ? void 0
                  : _d.cooldownUntil;
              if (typeof until === "number" && Number.isFinite(until) && until > now) {
                flags.push("cooldown ".concat(formatUntil(until)));
              } else {
                flags.push("cooldown");
              }
            }
            if (
              !profile ||
              ((configProfile === null || configProfile === void 0
                ? void 0
                : configProfile.provider) &&
                configProfile.provider !== profile.provider) ||
              ((configProfile === null || configProfile === void 0 ? void 0 : configProfile.mode) &&
                configProfile.mode !== profile.type &&
                !(configProfile.mode === "oauth" && profile.type === "token"))
            ) {
              var suffix_1 = flags.length > 0 ? " (".concat(flags.join(", "), ")") : "";
              return "".concat(profileId, "=missing").concat(suffix_1);
            }
            if (profile.type === "api_key") {
              var suffix_2 = flags.length > 0 ? " (".concat(flags.join(", "), ")") : "";
              return "".concat(profileId, "=").concat(maskApiKey(profile.key)).concat(suffix_2);
            }
            if (profile.type === "token") {
              if (
                typeof profile.expires === "number" &&
                Number.isFinite(profile.expires) &&
                profile.expires > 0
              ) {
                flags.push(
                  profile.expires <= now ? "expired" : "exp ".concat(formatUntil(profile.expires)),
                );
              }
              var suffix_3 = flags.length > 0 ? " (".concat(flags.join(", "), ")") : "";
              return ""
                .concat(profileId, "=token:")
                .concat(maskApiKey(profile.token))
                .concat(suffix_3);
            }
            var display = (0, auth_profiles_js_1.resolveAuthProfileDisplayLabel)({
              cfg: cfg,
              store: store,
              profileId: profileId,
            });
            var suffix =
              display === profileId
                ? ""
                : display.startsWith(profileId)
                  ? display.slice(profileId.length).trim()
                  : "(".concat(display, ")");
            if (
              typeof profile.expires === "number" &&
              Number.isFinite(profile.expires) &&
              profile.expires > 0
            ) {
              flags.push(
                profile.expires <= now ? "expired" : "exp ".concat(formatUntil(profile.expires)),
              );
            }
            var suffixLabel = suffix ? " ".concat(suffix) : "";
            var suffixFlags = flags.length > 0 ? " (".concat(flags.join(", "), ")") : "";
            return "".concat(profileId, "=OAuth").concat(suffixLabel).concat(suffixFlags);
          });
          return [
            2 /*return*/,
            {
              label: labels.join(", "),
              source: "auth-profiles.json: ".concat(
                formatPath((0, auth_profiles_js_1.resolveAuthStorePathForDisplay)(agentDir)),
              ),
            },
          ];
        }
        envKey = (0, model_auth_js_1.resolveEnvApiKey)(provider);
        if (envKey) {
          isOAuthEnv =
            envKey.source.includes("ANTHROPIC_OAUTH_TOKEN") ||
            envKey.source.toLowerCase().includes("oauth");
          label = isOAuthEnv ? "OAuth (env)" : maskApiKey(envKey.apiKey);
          return [2 /*return*/, { label: label, source: mode === "verbose" ? envKey.source : "" }];
        }
        customKey = (0, model_auth_js_1.getCustomProviderApiKey)(cfg, provider);
        if (customKey) {
          return [
            2 /*return*/,
            {
              label: maskApiKey(customKey),
              source: mode === "verbose" ? "models.json: ".concat(formatPath(modelsPath)) : "",
            },
          ];
        }
        return [2 /*return*/, { label: "missing", source: "missing" }];
      });
    },
  );
};
exports.resolveAuthLabel = resolveAuthLabel;
var formatAuthLabel = function (auth) {
  if (!auth.source || auth.source === auth.label || auth.source === "missing") {
    return auth.label;
  }
  return "".concat(auth.label, " (").concat(auth.source, ")");
};
exports.formatAuthLabel = formatAuthLabel;
var resolveProfileOverride = function (params) {
  var _a;
  var raw = (_a = params.rawProfile) === null || _a === void 0 ? void 0 : _a.trim();
  if (!raw) {
    return {};
  }
  var store = (0, model_auth_js_1.ensureAuthProfileStore)(params.agentDir, {
    allowKeychainPrompt: false,
  });
  var profile = store.profiles[raw];
  if (!profile) {
    return { error: 'Auth profile "'.concat(raw, '" not found.') };
  }
  if (profile.provider !== params.provider) {
    return {
      error: 'Auth profile "'
        .concat(raw, '" is for ')
        .concat(profile.provider, ", not ")
        .concat(params.provider, "."),
    };
  }
  return { profileId: raw };
};
exports.resolveProfileOverride = resolveProfileOverride;
