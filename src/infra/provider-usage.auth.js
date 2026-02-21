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
exports.resolveProviderAuths = resolveProviderAuths;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var auth_profiles_js_1 = require("../agents/auth-profiles.js");
var model_auth_js_1 = require("../agents/model-auth.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var config_js_1 = require("../config/config.js");
function parseGoogleToken(apiKey) {
  if (!apiKey) {
    return null;
  }
  try {
    var parsed = JSON.parse(apiKey);
    if (parsed && typeof parsed.token === "string") {
      return { token: parsed.token };
    }
  } catch (_a) {
    // ignore
  }
  return null;
}
function resolveZaiApiKey() {
  var _a, _b, _c, _d, _e;
  var envDirect =
    ((_a = process.env.ZAI_API_KEY) === null || _a === void 0 ? void 0 : _a.trim()) ||
    ((_b = process.env.Z_AI_API_KEY) === null || _b === void 0 ? void 0 : _b.trim());
  if (envDirect) {
    return envDirect;
  }
  var envResolved = (0, model_auth_js_1.resolveEnvApiKey)("zai");
  if (envResolved === null || envResolved === void 0 ? void 0 : envResolved.apiKey) {
    return envResolved.apiKey;
  }
  var cfg = (0, config_js_1.loadConfig)();
  var key =
    (0, model_auth_js_1.getCustomProviderApiKey)(cfg, "zai") ||
    (0, model_auth_js_1.getCustomProviderApiKey)(cfg, "z-ai");
  if (key) {
    return key;
  }
  var store = (0, auth_profiles_js_1.ensureAuthProfileStore)();
  var apiProfile = __spreadArray(
    __spreadArray([], (0, auth_profiles_js_1.listProfilesForProvider)(store, "zai"), true),
    (0, auth_profiles_js_1.listProfilesForProvider)(store, "z-ai"),
    true,
  ).find(function (id) {
    var _a;
    return ((_a = store.profiles[id]) === null || _a === void 0 ? void 0 : _a.type) === "api_key";
  });
  if (apiProfile) {
    var cred = store.profiles[apiProfile];
    if (
      (cred === null || cred === void 0 ? void 0 : cred.type) === "api_key" &&
      ((_c = cred.key) === null || _c === void 0 ? void 0 : _c.trim())
    ) {
      return cred.key.trim();
    }
  }
  try {
    var authPath = node_path_1.default.join(
      node_os_1.default.homedir(),
      ".pi",
      "agent",
      "auth.json",
    );
    if (!node_fs_1.default.existsSync(authPath)) {
      return undefined;
    }
    var data = JSON.parse(node_fs_1.default.readFileSync(authPath, "utf-8"));
    return (
      ((_d = data["z-ai"]) === null || _d === void 0 ? void 0 : _d.access) ||
      ((_e = data.zai) === null || _e === void 0 ? void 0 : _e.access)
    );
  } catch (_f) {
    return undefined;
  }
}
function resolveMinimaxApiKey() {
  var _a, _b, _c, _d;
  var envDirect =
    ((_a = process.env.MINIMAX_CODE_PLAN_KEY) === null || _a === void 0 ? void 0 : _a.trim()) ||
    ((_b = process.env.MINIMAX_API_KEY) === null || _b === void 0 ? void 0 : _b.trim());
  if (envDirect) {
    return envDirect;
  }
  var envResolved = (0, model_auth_js_1.resolveEnvApiKey)("minimax");
  if (envResolved === null || envResolved === void 0 ? void 0 : envResolved.apiKey) {
    return envResolved.apiKey;
  }
  var cfg = (0, config_js_1.loadConfig)();
  var key = (0, model_auth_js_1.getCustomProviderApiKey)(cfg, "minimax");
  if (key) {
    return key;
  }
  var store = (0, auth_profiles_js_1.ensureAuthProfileStore)();
  var apiProfile = (0, auth_profiles_js_1.listProfilesForProvider)(store, "minimax").find(
    function (id) {
      var cred = store.profiles[id];
      return (
        (cred === null || cred === void 0 ? void 0 : cred.type) === "api_key" ||
        (cred === null || cred === void 0 ? void 0 : cred.type) === "token"
      );
    },
  );
  if (!apiProfile) {
    return undefined;
  }
  var cred = store.profiles[apiProfile];
  if (
    (cred === null || cred === void 0 ? void 0 : cred.type) === "api_key" &&
    ((_c = cred.key) === null || _c === void 0 ? void 0 : _c.trim())
  ) {
    return cred.key.trim();
  }
  if (
    (cred === null || cred === void 0 ? void 0 : cred.type) === "token" &&
    ((_d = cred.token) === null || _d === void 0 ? void 0 : _d.trim())
  ) {
    return cred.token.trim();
  }
  return undefined;
}
function resolveXiaomiApiKey() {
  var _a, _b, _c;
  var envDirect = (_a = process.env.XIAOMI_API_KEY) === null || _a === void 0 ? void 0 : _a.trim();
  if (envDirect) {
    return envDirect;
  }
  var envResolved = (0, model_auth_js_1.resolveEnvApiKey)("xiaomi");
  if (envResolved === null || envResolved === void 0 ? void 0 : envResolved.apiKey) {
    return envResolved.apiKey;
  }
  var cfg = (0, config_js_1.loadConfig)();
  var key = (0, model_auth_js_1.getCustomProviderApiKey)(cfg, "xiaomi");
  if (key) {
    return key;
  }
  var store = (0, auth_profiles_js_1.ensureAuthProfileStore)();
  var apiProfile = (0, auth_profiles_js_1.listProfilesForProvider)(store, "xiaomi").find(
    function (id) {
      var cred = store.profiles[id];
      return (
        (cred === null || cred === void 0 ? void 0 : cred.type) === "api_key" ||
        (cred === null || cred === void 0 ? void 0 : cred.type) === "token"
      );
    },
  );
  if (!apiProfile) {
    return undefined;
  }
  var cred = store.profiles[apiProfile];
  if (
    (cred === null || cred === void 0 ? void 0 : cred.type) === "api_key" &&
    ((_b = cred.key) === null || _b === void 0 ? void 0 : _b.trim())
  ) {
    return cred.key.trim();
  }
  if (
    (cred === null || cred === void 0 ? void 0 : cred.type) === "token" &&
    ((_c = cred.token) === null || _c === void 0 ? void 0 : _c.trim())
  ) {
    return cred.token.trim();
  }
  return undefined;
}
function resolveOAuthToken(params) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      store,
      order,
      candidates,
      deduped,
      _i,
      candidates_1,
      entry,
      _a,
      deduped_1,
      profileId,
      cred,
      resolved,
      token,
      parsed,
      _b;
    var _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          cfg = (0, config_js_1.loadConfig)();
          store = (0, auth_profiles_js_1.ensureAuthProfileStore)(params.agentDir, {
            allowKeychainPrompt: false,
          });
          order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: cfg,
            store: store,
            provider: params.provider,
          });
          candidates = order;
          deduped = [];
          for (_i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
            entry = candidates_1[_i];
            if (!deduped.includes(entry)) {
              deduped.push(entry);
            }
          }
          ((_a = 0), (deduped_1 = deduped));
          _d.label = 1;
        case 1:
          if (!(_a < deduped_1.length)) {
            return [3 /*break*/, 6];
          }
          profileId = deduped_1[_a];
          cred = store.profiles[profileId];
          if (!cred || (cred.type !== "oauth" && cred.type !== "token")) {
            return [3 /*break*/, 5];
          }
          _d.label = 2;
        case 2:
          _d.trys.push([2, 4, , 5]);
          return [
            4 /*yield*/,
            (0, auth_profiles_js_1.resolveApiKeyForProfile)({
              // Usage snapshots should work even if config profile metadata is stale.
              // (e.g. config says api_key but the store has a token profile.)
              cfg: undefined,
              store: store,
              profileId: profileId,
              agentDir: params.agentDir,
            }),
          ];
        case 3:
          resolved = _d.sent();
          if (!(resolved === null || resolved === void 0 ? void 0 : resolved.apiKey)) {
            return [3 /*break*/, 5];
          }
          token = resolved.apiKey;
          if (params.provider === "google-gemini-cli" || params.provider === "google-antigravity") {
            parsed = parseGoogleToken(resolved.apiKey);
            token =
              (_c = parsed === null || parsed === void 0 ? void 0 : parsed.token) !== null &&
              _c !== void 0
                ? _c
                : resolved.apiKey;
          }
          return [
            2 /*return*/,
            {
              provider: params.provider,
              token: token,
              accountId: cred.type === "oauth" && "accountId" in cred ? cred.accountId : undefined,
            },
          ];
        case 4:
          _b = _d.sent();
          return [3 /*break*/, 5];
        case 5:
          _a++;
          return [3 /*break*/, 1];
        case 6:
          return [2 /*return*/, null];
      }
    });
  });
}
function resolveOAuthProviders(agentDir) {
  var store = (0, auth_profiles_js_1.ensureAuthProfileStore)(agentDir, {
    allowKeychainPrompt: false,
  });
  var cfg = (0, config_js_1.loadConfig)();
  var providers = [
    "anthropic",
    "github-copilot",
    "google-gemini-cli",
    "google-antigravity",
    "openai-codex",
  ];
  var isOAuthLikeCredential = function (id) {
    var cred = store.profiles[id];
    return (
      (cred === null || cred === void 0 ? void 0 : cred.type) === "oauth" ||
      (cred === null || cred === void 0 ? void 0 : cred.type) === "token"
    );
  };
  return providers.filter(function (provider) {
    var _a, _b;
    var profiles = (0, auth_profiles_js_1.listProfilesForProvider)(store, provider).filter(
      isOAuthLikeCredential,
    );
    if (profiles.length > 0) {
      return true;
    }
    var normalized = (0, model_selection_js_1.normalizeProviderId)(provider);
    var configuredProfiles = Object.entries(
      (_b = (_a = cfg.auth) === null || _a === void 0 ? void 0 : _a.profiles) !== null &&
        _b !== void 0
        ? _b
        : {},
    )
      .filter(function (_a) {
        var profile = _a[1];
        return (0, model_selection_js_1.normalizeProviderId)(profile.provider) === normalized;
      })
      .map(function (_a) {
        var id = _a[0];
        return id;
      })
      .filter(isOAuthLikeCredential);
    return configuredProfiles.length > 0;
  });
}
function resolveProviderAuths(params) {
  return __awaiter(this, void 0, void 0, function () {
    var oauthProviders, auths, _i, _a, provider, apiKey, apiKey, apiKey, auth;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (params.auth) {
            return [2 /*return*/, params.auth];
          }
          oauthProviders = resolveOAuthProviders(params.agentDir);
          auths = [];
          ((_i = 0), (_a = params.providers));
          _b.label = 1;
        case 1:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 4];
          }
          provider = _a[_i];
          if (provider === "zai") {
            apiKey = resolveZaiApiKey();
            if (apiKey) {
              auths.push({ provider: provider, token: apiKey });
            }
            return [3 /*break*/, 3];
          }
          if (provider === "minimax") {
            apiKey = resolveMinimaxApiKey();
            if (apiKey) {
              auths.push({ provider: provider, token: apiKey });
            }
            return [3 /*break*/, 3];
          }
          if (provider === "xiaomi") {
            apiKey = resolveXiaomiApiKey();
            if (apiKey) {
              auths.push({ provider: provider, token: apiKey });
            }
            return [3 /*break*/, 3];
          }
          if (!oauthProviders.includes(provider)) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            resolveOAuthToken({
              provider: provider,
              agentDir: params.agentDir,
            }),
          ];
        case 2:
          auth = _b.sent();
          if (auth) {
            auths.push(auth);
          }
          _b.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          return [2 /*return*/, auths];
      }
    });
  });
}
