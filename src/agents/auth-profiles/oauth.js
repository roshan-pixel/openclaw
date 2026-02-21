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
exports.resolveApiKeyForProfile = resolveApiKeyForProfile;
var pi_ai_1 = require("@mariozechner/pi-ai");
var proper_lockfile_1 = require("proper-lockfile");
var chutes_oauth_js_1 = require("../chutes-oauth.js");
var qwen_portal_oauth_js_1 = require("../../providers/qwen-portal-oauth.js");
var constants_js_1 = require("./constants.js");
var doctor_js_1 = require("./doctor.js");
var paths_js_1 = require("./paths.js");
var repair_js_1 = require("./repair.js");
var store_js_1 = require("./store.js");
function buildOAuthApiKey(provider, credentials) {
  var needsProjectId = provider === "google-gemini-cli" || provider === "google-antigravity";
  return needsProjectId
    ? JSON.stringify({
        token: credentials.access,
        projectId: credentials.projectId,
      })
    : credentials.access;
}
function refreshOAuthTokenWithLock(params) {
  return __awaiter(this, void 0, void 0, function () {
    var authPath, release, store, cred_1, oauthCreds, result, _a, _b, _c;
    var _d;
    var _this = this;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          authPath = (0, paths_js_1.resolveAuthStorePath)(params.agentDir);
          (0, paths_js_1.ensureAuthStoreFile)(authPath);
          _e.label = 1;
        case 1:
          _e.trys.push([1, , 10, 15]);
          return [
            4 /*yield*/,
            proper_lockfile_1.default.lock(
              authPath,
              __assign({}, constants_js_1.AUTH_STORE_LOCK_OPTIONS),
            ),
          ];
        case 2:
          release = _e.sent();
          store = (0, store_js_1.ensureAuthProfileStore)(params.agentDir);
          cred_1 = store.profiles[params.profileId];
          if (!cred_1 || cred_1.type !== "oauth") {
            return [2 /*return*/, null];
          }
          if (Date.now() < cred_1.expires) {
            return [
              2 /*return*/,
              {
                apiKey: buildOAuthApiKey(cred_1.provider, cred_1),
                newCredentials: cred_1,
              },
            ];
          }
          oauthCreds = ((_d = {}), (_d[cred_1.provider] = cred_1), _d);
          if (!(String(cred_1.provider) === "chutes")) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            (function () {
              return __awaiter(_this, void 0, void 0, function () {
                var newCredentials;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [
                        4 /*yield*/,
                        (0, chutes_oauth_js_1.refreshChutesTokens)({
                          credential: cred_1,
                        }),
                      ];
                    case 1:
                      newCredentials = _a.sent();
                      return [
                        2 /*return*/,
                        { apiKey: newCredentials.access, newCredentials: newCredentials },
                      ];
                  }
                });
              });
            })(),
          ];
        case 3:
          _a = _e.sent();
          return [3 /*break*/, 9];
        case 4:
          if (!(String(cred_1.provider) === "qwen-portal")) {
            return [3 /*break*/, 6];
          }
          return [
            4 /*yield*/,
            (function () {
              return __awaiter(_this, void 0, void 0, function () {
                var newCredentials;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [
                        4 /*yield*/,
                        (0, qwen_portal_oauth_js_1.refreshQwenPortalCredentials)(cred_1),
                      ];
                    case 1:
                      newCredentials = _a.sent();
                      return [
                        2 /*return*/,
                        { apiKey: newCredentials.access, newCredentials: newCredentials },
                      ];
                  }
                });
              });
            })(),
          ];
        case 5:
          _b = _e.sent();
          return [3 /*break*/, 8];
        case 6:
          return [4 /*yield*/, (0, pi_ai_1.getOAuthApiKey)(cred_1.provider, oauthCreds)];
        case 7:
          _b = _e.sent();
          _e.label = 8;
        case 8:
          _a = _b;
          _e.label = 9;
        case 9:
          result = _a;
          if (!result) {
            return [2 /*return*/, null];
          }
          store.profiles[params.profileId] = __assign(
            __assign(__assign({}, cred_1), result.newCredentials),
            { type: "oauth" },
          );
          (0, store_js_1.saveAuthProfileStore)(store, params.agentDir);
          return [2 /*return*/, result];
        case 10:
          if (!release) {
            return [3 /*break*/, 14];
          }
          _e.label = 11;
        case 11:
          _e.trys.push([11, 13, , 14]);
          return [4 /*yield*/, release()];
        case 12:
          _e.sent();
          return [3 /*break*/, 14];
        case 13:
          _c = _e.sent();
          return [3 /*break*/, 14];
        case 14:
          return [7 /*endfinally*/];
        case 15:
          return [2 /*return*/];
      }
    });
  });
}
function tryResolveOAuthProfile(params) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg, store, profileId, cred, profileConfig, refreshed;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          ((cfg = params.cfg), (store = params.store), (profileId = params.profileId));
          cred = store.profiles[profileId];
          if (!cred || cred.type !== "oauth") {
            return [2 /*return*/, null];
          }
          profileConfig =
            (_b =
              (_a = cfg === null || cfg === void 0 ? void 0 : cfg.auth) === null || _a === void 0
                ? void 0
                : _a.profiles) === null || _b === void 0
              ? void 0
              : _b[profileId];
          if (profileConfig && profileConfig.provider !== cred.provider) {
            return [2 /*return*/, null];
          }
          if (profileConfig && profileConfig.mode !== cred.type) {
            return [2 /*return*/, null];
          }
          if (Date.now() < cred.expires) {
            return [
              2 /*return*/,
              {
                apiKey: buildOAuthApiKey(cred.provider, cred),
                provider: cred.provider,
                email: cred.email,
              },
            ];
          }
          return [
            4 /*yield*/,
            refreshOAuthTokenWithLock({
              profileId: profileId,
              agentDir: params.agentDir,
            }),
          ];
        case 1:
          refreshed = _c.sent();
          if (!refreshed) {
            return [2 /*return*/, null];
          }
          return [
            2 /*return*/,
            {
              apiKey: refreshed.apiKey,
              provider: cred.provider,
              email: cred.email,
            },
          ];
      }
    });
  });
}
function resolveApiKeyForProfile(params) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      store,
      profileId,
      cred,
      profileConfig,
      token,
      result,
      error_1,
      refreshedStore,
      refreshed,
      fallbackProfileId,
      fallbackResolved,
      _a,
      mainStore,
      mainCred,
      message,
      hint;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          ((cfg = params.cfg), (store = params.store), (profileId = params.profileId));
          cred = store.profiles[profileId];
          if (!cred) {
            return [2 /*return*/, null];
          }
          profileConfig =
            (_c =
              (_b = cfg === null || cfg === void 0 ? void 0 : cfg.auth) === null || _b === void 0
                ? void 0
                : _b.profiles) === null || _c === void 0
              ? void 0
              : _c[profileId];
          if (profileConfig && profileConfig.provider !== cred.provider) {
            return [2 /*return*/, null];
          }
          if (profileConfig && profileConfig.mode !== cred.type) {
            // Compatibility: treat "oauth" config as compatible with stored token profiles.
            if (!(profileConfig.mode === "oauth" && cred.type === "token")) {
              return [2 /*return*/, null];
            }
          }
          if (cred.type === "api_key") {
            return [2 /*return*/, { apiKey: cred.key, provider: cred.provider, email: cred.email }];
          }
          if (cred.type === "token") {
            token = (_d = cred.token) === null || _d === void 0 ? void 0 : _d.trim();
            if (!token) {
              return [2 /*return*/, null];
            }
            if (
              typeof cred.expires === "number" &&
              Number.isFinite(cred.expires) &&
              cred.expires > 0 &&
              Date.now() >= cred.expires
            ) {
              return [2 /*return*/, null];
            }
            return [2 /*return*/, { apiKey: token, provider: cred.provider, email: cred.email }];
          }
          if (Date.now() < cred.expires) {
            return [
              2 /*return*/,
              {
                apiKey: buildOAuthApiKey(cred.provider, cred),
                provider: cred.provider,
                email: cred.email,
              },
            ];
          }
          _f.label = 1;
        case 1:
          _f.trys.push([1, 3, , 8]);
          return [
            4 /*yield*/,
            refreshOAuthTokenWithLock({
              profileId: profileId,
              agentDir: params.agentDir,
            }),
          ];
        case 2:
          result = _f.sent();
          if (!result) {
            return [2 /*return*/, null];
          }
          return [
            2 /*return*/,
            {
              apiKey: result.apiKey,
              provider: cred.provider,
              email: cred.email,
            },
          ];
        case 3:
          error_1 = _f.sent();
          refreshedStore = (0, store_js_1.ensureAuthProfileStore)(params.agentDir);
          refreshed = refreshedStore.profiles[profileId];
          if (
            (refreshed === null || refreshed === void 0 ? void 0 : refreshed.type) === "oauth" &&
            Date.now() < refreshed.expires
          ) {
            return [
              2 /*return*/,
              {
                apiKey: buildOAuthApiKey(refreshed.provider, refreshed),
                provider: refreshed.provider,
                email: (_e = refreshed.email) !== null && _e !== void 0 ? _e : cred.email,
              },
            ];
          }
          fallbackProfileId = (0, repair_js_1.suggestOAuthProfileIdForLegacyDefault)({
            cfg: cfg,
            store: refreshedStore,
            provider: cred.provider,
            legacyProfileId: profileId,
          });
          if (!(fallbackProfileId && fallbackProfileId !== profileId)) {
            return [3 /*break*/, 7];
          }
          _f.label = 4;
        case 4:
          _f.trys.push([4, 6, , 7]);
          return [
            4 /*yield*/,
            tryResolveOAuthProfile({
              cfg: cfg,
              store: refreshedStore,
              profileId: fallbackProfileId,
              agentDir: params.agentDir,
            }),
          ];
        case 5:
          fallbackResolved = _f.sent();
          if (fallbackResolved) {
            return [2 /*return*/, fallbackResolved];
          }
          return [3 /*break*/, 7];
        case 6:
          _a = _f.sent();
          return [3 /*break*/, 7];
        case 7:
          // Fallback: if this is a secondary agent, try using the main agent's credentials
          if (params.agentDir) {
            try {
              mainStore = (0, store_js_1.ensureAuthProfileStore)(undefined);
              mainCred = mainStore.profiles[profileId];
              if (
                (mainCred === null || mainCred === void 0 ? void 0 : mainCred.type) === "oauth" &&
                Date.now() < mainCred.expires
              ) {
                // Main agent has fresh credentials - copy them to this agent and use them
                refreshedStore.profiles[profileId] = __assign({}, mainCred);
                (0, store_js_1.saveAuthProfileStore)(refreshedStore, params.agentDir);
                constants_js_1.log.info("inherited fresh OAuth credentials from main agent", {
                  profileId: profileId,
                  agentDir: params.agentDir,
                  expires: new Date(mainCred.expires).toISOString(),
                });
                return [
                  2 /*return*/,
                  {
                    apiKey: buildOAuthApiKey(mainCred.provider, mainCred),
                    provider: mainCred.provider,
                    email: mainCred.email,
                  },
                ];
              }
            } catch (_g) {
              // keep original error if main agent fallback also fails
            }
          }
          message = error_1 instanceof Error ? error_1.message : String(error_1);
          hint = (0, doctor_js_1.formatAuthDoctorHint)({
            cfg: cfg,
            store: refreshedStore,
            provider: cred.provider,
            profileId: profileId,
          });
          throw new Error(
            "OAuth token refresh failed for ".concat(cred.provider, ": ").concat(message, ". ") +
              "Please try again or re-authenticate." +
              (hint ? "\n\n".concat(hint) : ""),
          );
        case 8:
          return [2 /*return*/];
      }
    });
  });
}
