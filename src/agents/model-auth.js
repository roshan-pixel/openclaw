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
exports.resolveAuthProfileOrder = exports.ensureAuthProfileStore = void 0;
exports.getCustomProviderApiKey = getCustomProviderApiKey;
exports.resolveAwsSdkEnvVarName = resolveAwsSdkEnvVarName;
exports.resolveApiKeyForProvider = resolveApiKeyForProvider;
exports.resolveEnvApiKey = resolveEnvApiKey;
exports.resolveModelAuthMode = resolveModelAuthMode;
exports.getApiKeyForModel = getApiKeyForModel;
exports.requireApiKey = requireApiKey;
var node_path_1 = require("node:path");
var pi_ai_1 = require("@mariozechner/pi-ai");
var shell_env_js_1 = require("../infra/shell-env.js");
var command_format_js_1 = require("../cli/command-format.js");
var auth_profiles_js_1 = require("./auth-profiles.js");
var model_selection_js_1 = require("./model-selection.js");
var auth_profiles_js_2 = require("./auth-profiles.js");
Object.defineProperty(exports, "ensureAuthProfileStore", {
  enumerable: true,
  get: function () {
    return auth_profiles_js_2.ensureAuthProfileStore;
  },
});
Object.defineProperty(exports, "resolveAuthProfileOrder", {
  enumerable: true,
  get: function () {
    return auth_profiles_js_2.resolveAuthProfileOrder;
  },
});
var AWS_BEARER_ENV = "AWS_BEARER_TOKEN_BEDROCK";
var AWS_ACCESS_KEY_ENV = "AWS_ACCESS_KEY_ID";
var AWS_SECRET_KEY_ENV = "AWS_SECRET_ACCESS_KEY";
var AWS_PROFILE_ENV = "AWS_PROFILE";
function resolveProviderConfig(cfg, provider) {
  var _a, _b, _c, _d;
  var providers =
    (_b =
      (_a = cfg === null || cfg === void 0 ? void 0 : cfg.models) === null || _a === void 0
        ? void 0
        : _a.providers) !== null && _b !== void 0
      ? _b
      : {};
  var direct = providers[provider];
  if (direct) {
    return direct;
  }
  var normalized = (0, model_selection_js_1.normalizeProviderId)(provider);
  if (normalized === provider) {
    var matched = Object.entries(providers).find(function (_a) {
      var key = _a[0];
      return (0, model_selection_js_1.normalizeProviderId)(key) === normalized;
    });
    return matched === null || matched === void 0 ? void 0 : matched[1];
  }
  return (_c = providers[normalized]) !== null && _c !== void 0
    ? _c
    : (_d = Object.entries(providers).find(function (_a) {
          var key = _a[0];
          return (0, model_selection_js_1.normalizeProviderId)(key) === normalized;
        })) === null || _d === void 0
      ? void 0
      : _d[1];
}
function getCustomProviderApiKey(cfg, provider) {
  var _a;
  var entry = resolveProviderConfig(cfg, provider);
  var key =
    (_a = entry === null || entry === void 0 ? void 0 : entry.apiKey) === null || _a === void 0
      ? void 0
      : _a.trim();
  return key || undefined;
}
function resolveProviderAuthOverride(cfg, provider) {
  var entry = resolveProviderConfig(cfg, provider);
  var auth = entry === null || entry === void 0 ? void 0 : entry.auth;
  if (auth === "api-key" || auth === "aws-sdk" || auth === "oauth" || auth === "token") {
    return auth;
  }
  return undefined;
}
function resolveEnvSourceLabel(params) {
  var shellApplied = params.envVars.some(function (envVar) {
    return params.applied.has(envVar);
  });
  var prefix = shellApplied ? "shell env: " : "env: ";
  return "".concat(prefix).concat(params.label);
}
function resolveAwsSdkEnvVarName(env) {
  var _a, _b, _c, _d;
  if (env === void 0) {
    env = process.env;
  }
  if ((_a = env[AWS_BEARER_ENV]) === null || _a === void 0 ? void 0 : _a.trim()) {
    return AWS_BEARER_ENV;
  }
  if (
    ((_b = env[AWS_ACCESS_KEY_ENV]) === null || _b === void 0 ? void 0 : _b.trim()) &&
    ((_c = env[AWS_SECRET_KEY_ENV]) === null || _c === void 0 ? void 0 : _c.trim())
  ) {
    return AWS_ACCESS_KEY_ENV;
  }
  if ((_d = env[AWS_PROFILE_ENV]) === null || _d === void 0 ? void 0 : _d.trim()) {
    return AWS_PROFILE_ENV;
  }
  return undefined;
}
function resolveAwsSdkAuthInfo() {
  var _a, _b, _c, _d;
  var applied = new Set((0, shell_env_js_1.getShellEnvAppliedKeys)());
  if ((_a = process.env[AWS_BEARER_ENV]) === null || _a === void 0 ? void 0 : _a.trim()) {
    return {
      mode: "aws-sdk",
      source: resolveEnvSourceLabel({
        applied: applied,
        envVars: [AWS_BEARER_ENV],
        label: AWS_BEARER_ENV,
      }),
    };
  }
  if (
    ((_b = process.env[AWS_ACCESS_KEY_ENV]) === null || _b === void 0 ? void 0 : _b.trim()) &&
    ((_c = process.env[AWS_SECRET_KEY_ENV]) === null || _c === void 0 ? void 0 : _c.trim())
  ) {
    return {
      mode: "aws-sdk",
      source: resolveEnvSourceLabel({
        applied: applied,
        envVars: [AWS_ACCESS_KEY_ENV, AWS_SECRET_KEY_ENV],
        label: "".concat(AWS_ACCESS_KEY_ENV, " + ").concat(AWS_SECRET_KEY_ENV),
      }),
    };
  }
  if ((_d = process.env[AWS_PROFILE_ENV]) === null || _d === void 0 ? void 0 : _d.trim()) {
    return {
      mode: "aws-sdk",
      source: resolveEnvSourceLabel({
        applied: applied,
        envVars: [AWS_PROFILE_ENV],
        label: AWS_PROFILE_ENV,
      }),
    };
  }
  return { mode: "aws-sdk", source: "aws-sdk default chain" };
}
function resolveApiKeyForProvider(params) {
  return __awaiter(this, void 0, void 0, function () {
    var provider,
      cfg,
      profileId,
      preferredProfile,
      store,
      resolved,
      mode,
      authOverride,
      order,
      _i,
      order_1,
      candidate,
      resolved,
      mode,
      _a,
      envResolved,
      customKey,
      normalized,
      hasCodex,
      authStorePath,
      resolvedAgentDir;
    var _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          ((provider = params.provider),
            (cfg = params.cfg),
            (profileId = params.profileId),
            (preferredProfile = params.preferredProfile));
          store =
            (_b = params.store) !== null && _b !== void 0
              ? _b
              : (0, auth_profiles_js_1.ensureAuthProfileStore)(params.agentDir);
          if (!profileId) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, auth_profiles_js_1.resolveApiKeyForProfile)({
              cfg: cfg,
              store: store,
              profileId: profileId,
              agentDir: params.agentDir,
            }),
          ];
        case 1:
          resolved = _e.sent();
          if (!resolved) {
            throw new Error('No credentials found for profile "'.concat(profileId, '".'));
          }
          mode = (_c = store.profiles[profileId]) === null || _c === void 0 ? void 0 : _c.type;
          return [
            2 /*return*/,
            {
              apiKey: resolved.apiKey,
              profileId: profileId,
              source: "profile:".concat(profileId),
              mode: mode === "oauth" ? "oauth" : mode === "token" ? "token" : "api-key",
            },
          ];
        case 2:
          authOverride = resolveProviderAuthOverride(cfg, provider);
          if (authOverride === "aws-sdk") {
            return [2 /*return*/, resolveAwsSdkAuthInfo()];
          }
          order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
            cfg: cfg,
            store: store,
            provider: provider,
            preferredProfile: preferredProfile,
          });
          ((_i = 0), (order_1 = order));
          _e.label = 3;
        case 3:
          if (!(_i < order_1.length)) {
            return [3 /*break*/, 8];
          }
          candidate = order_1[_i];
          _e.label = 4;
        case 4:
          _e.trys.push([4, 6, , 7]);
          return [
            4 /*yield*/,
            (0, auth_profiles_js_1.resolveApiKeyForProfile)({
              cfg: cfg,
              store: store,
              profileId: candidate,
              agentDir: params.agentDir,
            }),
          ];
        case 5:
          resolved = _e.sent();
          if (resolved) {
            mode = (_d = store.profiles[candidate]) === null || _d === void 0 ? void 0 : _d.type;
            return [
              2 /*return*/,
              {
                apiKey: resolved.apiKey,
                profileId: candidate,
                source: "profile:".concat(candidate),
                mode: mode === "oauth" ? "oauth" : mode === "token" ? "token" : "api-key",
              },
            ];
          }
          return [3 /*break*/, 7];
        case 6:
          _a = _e.sent();
          return [3 /*break*/, 7];
        case 7:
          _i++;
          return [3 /*break*/, 3];
        case 8:
          envResolved = resolveEnvApiKey(provider);
          if (envResolved) {
            return [
              2 /*return*/,
              {
                apiKey: envResolved.apiKey,
                source: envResolved.source,
                mode: envResolved.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key",
              },
            ];
          }
          customKey = getCustomProviderApiKey(cfg, provider);
          if (customKey) {
            return [2 /*return*/, { apiKey: customKey, source: "models.json", mode: "api-key" }];
          }
          normalized = (0, model_selection_js_1.normalizeProviderId)(provider);
          if (authOverride === undefined && normalized === "amazon-bedrock") {
            return [2 /*return*/, resolveAwsSdkAuthInfo()];
          }
          if (provider === "openai") {
            hasCodex =
              (0, auth_profiles_js_1.listProfilesForProvider)(store, "openai-codex").length > 0;
            if (hasCodex) {
              throw new Error(
                'No API key found for provider "openai". You are authenticated with OpenAI Codex OAuth. Use openai-codex/gpt-5.2 (ChatGPT OAuth) or set OPENAI_API_KEY for openai/gpt-5.2.',
              );
            }
          }
          authStorePath = (0, auth_profiles_js_1.resolveAuthStorePathForDisplay)(params.agentDir);
          resolvedAgentDir = node_path_1.default.dirname(authStorePath);
          throw new Error(
            [
              'No API key found for provider "'.concat(provider, '".'),
              "Auth store: ".concat(authStorePath, " (agentDir: ").concat(resolvedAgentDir, ")."),
              "Configure auth for this agent (".concat(
                (0, command_format_js_1.formatCliCommand)("openclaw agents add <id>"),
                ") or copy auth-profiles.json from the main agentDir.",
              ),
            ].join(" "),
          );
      }
    });
  });
}
function resolveEnvApiKey(provider) {
  var _a, _b, _c, _d, _e, _f, _g;
  var normalized = (0, model_selection_js_1.normalizeProviderId)(provider);
  var applied = new Set((0, shell_env_js_1.getShellEnvAppliedKeys)());
  var pick = function (envVar) {
    var _a;
    var value = (_a = process.env[envVar]) === null || _a === void 0 ? void 0 : _a.trim();
    if (!value) {
      return null;
    }
    var source = applied.has(envVar) ? "shell env: ".concat(envVar) : "env: ".concat(envVar);
    return { apiKey: value, source: source };
  };
  if (normalized === "github-copilot") {
    return (_b =
      (_a = pick("COPILOT_GITHUB_TOKEN")) !== null && _a !== void 0 ? _a : pick("GH_TOKEN")) !==
      null && _b !== void 0
      ? _b
      : pick("GITHUB_TOKEN");
  }
  if (normalized === "anthropic") {
    return (_c = pick("ANTHROPIC_OAUTH_TOKEN")) !== null && _c !== void 0
      ? _c
      : pick("ANTHROPIC_API_KEY");
  }
  if (normalized === "chutes") {
    return (_d = pick("CHUTES_OAUTH_TOKEN")) !== null && _d !== void 0
      ? _d
      : pick("CHUTES_API_KEY");
  }
  if (normalized === "zai") {
    return (_e = pick("ZAI_API_KEY")) !== null && _e !== void 0 ? _e : pick("Z_AI_API_KEY");
  }
  if (normalized === "google-vertex") {
    var envKey = (0, pi_ai_1.getEnvApiKey)(normalized);
    if (!envKey) {
      return null;
    }
    return { apiKey: envKey, source: "gcloud adc" };
  }
  if (normalized === "opencode") {
    return (_f = pick("OPENCODE_API_KEY")) !== null && _f !== void 0
      ? _f
      : pick("OPENCODE_ZEN_API_KEY");
  }
  if (normalized === "qwen-portal") {
    return (_g = pick("QWEN_OAUTH_TOKEN")) !== null && _g !== void 0
      ? _g
      : pick("QWEN_PORTAL_API_KEY");
  }
  var envMap = {
    openai: "OPENAI_API_KEY",
    google: "GEMINI_API_KEY",
    groq: "GROQ_API_KEY",
    deepgram: "DEEPGRAM_API_KEY",
    cerebras: "CEREBRAS_API_KEY",
    xai: "XAI_API_KEY",
    openrouter: "OPENROUTER_API_KEY",
    "vercel-ai-gateway": "AI_GATEWAY_API_KEY",
    moonshot: "MOONSHOT_API_KEY",
    "kimi-code": "KIMICODE_API_KEY",
    minimax: "MINIMAX_API_KEY",
    xiaomi: "XIAOMI_API_KEY",
    synthetic: "SYNTHETIC_API_KEY",
    venice: "VENICE_API_KEY",
    mistral: "MISTRAL_API_KEY",
    opencode: "OPENCODE_API_KEY",
  };
  var envVar = envMap[normalized];
  if (!envVar) {
    return null;
  }
  return pick(envVar);
}
function resolveModelAuthMode(provider, cfg, store) {
  var resolved = provider === null || provider === void 0 ? void 0 : provider.trim();
  if (!resolved) {
    return undefined;
  }
  var authOverride = resolveProviderAuthOverride(cfg, resolved);
  if (authOverride === "aws-sdk") {
    return "aws-sdk";
  }
  var authStore =
    store !== null && store !== void 0 ? store : (0, auth_profiles_js_1.ensureAuthProfileStore)();
  var profiles = (0, auth_profiles_js_1.listProfilesForProvider)(authStore, resolved);
  if (profiles.length > 0) {
    var modes_1 = new Set(
      profiles
        .map(function (id) {
          var _a;
          return (_a = authStore.profiles[id]) === null || _a === void 0 ? void 0 : _a.type;
        })
        .filter(function (mode) {
          return Boolean(mode);
        }),
    );
    var distinct = ["oauth", "token", "api_key"].filter(function (k) {
      return modes_1.has(k);
    });
    if (distinct.length >= 2) {
      return "mixed";
    }
    if (modes_1.has("oauth")) {
      return "oauth";
    }
    if (modes_1.has("token")) {
      return "token";
    }
    if (modes_1.has("api_key")) {
      return "api-key";
    }
  }
  if (
    authOverride === undefined &&
    (0, model_selection_js_1.normalizeProviderId)(resolved) === "amazon-bedrock"
  ) {
    return "aws-sdk";
  }
  var envKey = resolveEnvApiKey(resolved);
  if (envKey === null || envKey === void 0 ? void 0 : envKey.apiKey) {
    return envKey.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key";
  }
  if (getCustomProviderApiKey(cfg, resolved)) {
    return "api-key";
  }
  return "unknown";
}
function getApiKeyForModel(params) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [
        2 /*return*/,
        resolveApiKeyForProvider({
          provider: params.model.provider,
          cfg: params.cfg,
          profileId: params.profileId,
          preferredProfile: params.preferredProfile,
          store: params.store,
          agentDir: params.agentDir,
        }),
      ];
    });
  });
}
function requireApiKey(auth, provider) {
  var _a;
  var key = (_a = auth.apiKey) === null || _a === void 0 ? void 0 : _a.trim();
  if (key) {
    return key;
  }
  throw new Error(
    'No API key resolved for provider "'.concat(provider, '" (auth mode: ').concat(auth.mode, ")."),
  );
}
