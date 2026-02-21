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
exports.XIAOMI_DEFAULT_MODEL_ID = void 0;
exports.normalizeGoogleModelId = normalizeGoogleModelId;
exports.normalizeProviders = normalizeProviders;
exports.buildXiaomiProvider = buildXiaomiProvider;
exports.resolveImplicitProviders = resolveImplicitProviders;
exports.resolveImplicitCopilotProvider = resolveImplicitCopilotProvider;
exports.resolveImplicitBedrockProvider = resolveImplicitBedrockProvider;
var github_copilot_token_js_1 = require("../providers/github-copilot-token.js");
var auth_profiles_js_1 = require("./auth-profiles.js");
var model_auth_js_1 = require("./model-auth.js");
var bedrock_discovery_js_1 = require("./bedrock-discovery.js");
var synthetic_models_js_1 = require("./synthetic-models.js");
var venice_models_js_1 = require("./venice-models.js");
var MINIMAX_API_BASE_URL = "https://api.minimax.chat/v1";
var MINIMAX_DEFAULT_MODEL_ID = "MiniMax-M2.1";
var MINIMAX_DEFAULT_VISION_MODEL_ID = "MiniMax-VL-01";
var MINIMAX_DEFAULT_CONTEXT_WINDOW = 200000;
var MINIMAX_DEFAULT_MAX_TOKENS = 8192;
// Pricing: MiniMax doesn't publish public rates. Override in models.json for accurate costs.
var MINIMAX_API_COST = {
  input: 15,
  output: 60,
  cacheRead: 2,
  cacheWrite: 10,
};
var XIAOMI_BASE_URL = "https://api.xiaomimimo.com/anthropic";
exports.XIAOMI_DEFAULT_MODEL_ID = "mimo-v2-flash";
var XIAOMI_DEFAULT_CONTEXT_WINDOW = 262144;
var XIAOMI_DEFAULT_MAX_TOKENS = 8192;
var XIAOMI_DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};
var MOONSHOT_BASE_URL = "https://api.moonshot.ai/v1";
var MOONSHOT_DEFAULT_MODEL_ID = "kimi-k2.5";
var MOONSHOT_DEFAULT_CONTEXT_WINDOW = 256000;
var MOONSHOT_DEFAULT_MAX_TOKENS = 8192;
var MOONSHOT_DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};
var KIMI_CODE_BASE_URL = "https://api.kimi.com/coding/v1";
var KIMI_CODE_MODEL_ID = "kimi-for-coding";
var KIMI_CODE_CONTEXT_WINDOW = 262144;
var KIMI_CODE_MAX_TOKENS = 32768;
var KIMI_CODE_HEADERS = { "User-Agent": "KimiCLI/0.77" };
var KIMI_CODE_COMPAT = { supportsDeveloperRole: false };
var KIMI_CODE_DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};
var QWEN_PORTAL_BASE_URL = "https://portal.qwen.ai/v1";
var QWEN_PORTAL_OAUTH_PLACEHOLDER = "qwen-oauth";
var QWEN_PORTAL_DEFAULT_CONTEXT_WINDOW = 128000;
var QWEN_PORTAL_DEFAULT_MAX_TOKENS = 8192;
var QWEN_PORTAL_DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};
var OLLAMA_BASE_URL = "http://127.0.0.1:11434/v1";
var OLLAMA_API_BASE_URL = "http://127.0.0.1:11434";
var OLLAMA_DEFAULT_CONTEXT_WINDOW = 128000;
var OLLAMA_DEFAULT_MAX_TOKENS = 8192;
var OLLAMA_DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};
function discoverOllamaModels() {
  return __awaiter(this, void 0, void 0, function () {
    var response, data, error_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          // Skip Ollama discovery in test environments
          if (process.env.VITEST || process.env.NODE_ENV === "test") {
            return [2 /*return*/, []];
          }
          _a.label = 1;
        case 1:
          _a.trys.push([1, 4, , 5]);
          return [
            4 /*yield*/,
            fetch("".concat(OLLAMA_API_BASE_URL, "/api/tags"), {
              signal: AbortSignal.timeout(5000),
            }),
          ];
        case 2:
          response = _a.sent();
          if (!response.ok) {
            console.warn("Failed to discover Ollama models: ".concat(response.status));
            return [2 /*return*/, []];
          }
          return [4 /*yield*/, response.json()];
        case 3:
          data = _a.sent();
          if (!data.models || data.models.length === 0) {
            console.warn("No Ollama models found on local instance");
            return [2 /*return*/, []];
          }
          return [
            2 /*return*/,
            data.models.map(function (model) {
              var modelId = model.name;
              var isReasoning =
                modelId.toLowerCase().includes("r1") || modelId.toLowerCase().includes("reasoning");
              return {
                id: modelId,
                name: modelId,
                reasoning: isReasoning,
                input: ["text"],
                cost: OLLAMA_DEFAULT_COST,
                contextWindow: OLLAMA_DEFAULT_CONTEXT_WINDOW,
                maxTokens: OLLAMA_DEFAULT_MAX_TOKENS,
              };
            }),
          ];
        case 4:
          error_1 = _a.sent();
          console.warn("Failed to discover Ollama models: ".concat(String(error_1)));
          return [2 /*return*/, []];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function normalizeApiKeyConfig(value) {
  var _a;
  var trimmed = value.trim();
  var match = /^\$\{([A-Z0-9_]+)\}$/.exec(trimmed);
  return (_a = match === null || match === void 0 ? void 0 : match[1]) !== null && _a !== void 0
    ? _a
    : trimmed;
}
function resolveEnvApiKeyVarName(provider) {
  var resolved = (0, model_auth_js_1.resolveEnvApiKey)(provider);
  if (!resolved) {
    return undefined;
  }
  var match = /^(?:env: |shell env: )([A-Z0-9_]+)$/.exec(resolved.source);
  return match ? match[1] : undefined;
}
function resolveAwsSdkApiKeyVarName() {
  var _a;
  return (_a = (0, model_auth_js_1.resolveAwsSdkEnvVarName)()) !== null && _a !== void 0
    ? _a
    : "AWS_PROFILE";
}
function resolveApiKeyFromProfiles(params) {
  var ids = (0, auth_profiles_js_1.listProfilesForProvider)(params.store, params.provider);
  for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
    var id = ids_1[_i];
    var cred = params.store.profiles[id];
    if (!cred) {
      continue;
    }
    if (cred.type === "api_key") {
      return cred.key;
    }
    if (cred.type === "token") {
      return cred.token;
    }
  }
  return undefined;
}
function normalizeGoogleModelId(id) {
  if (id === "gemini-3-pro") {
    return "gemini-3-pro-preview";
  }
  if (id === "gemini-3-flash") {
    return "gemini-3-flash-preview";
  }
  return id;
}
function normalizeGoogleProvider(provider) {
  var mutated = false;
  var models = provider.models.map(function (model) {
    var nextId = normalizeGoogleModelId(model.id);
    if (nextId === model.id) {
      return model;
    }
    mutated = true;
    return __assign(__assign({}, model), { id: nextId });
  });
  return mutated ? __assign(__assign({}, provider), { models: models }) : provider;
}
function normalizeProviders(params) {
  var _a, _b;
  var providers = params.providers;
  if (!providers) {
    return providers;
  }
  var authStore = (0, auth_profiles_js_1.ensureAuthProfileStore)(params.agentDir, {
    allowKeychainPrompt: false,
  });
  var mutated = false;
  var next = {};
  for (var _i = 0, _c = Object.entries(providers); _i < _c.length; _i++) {
    var _d = _c[_i],
      key = _d[0],
      provider = _d[1];
    var normalizedKey = key.trim();
    var normalizedProvider = provider;
    // Fix common misconfig: apiKey set to "${ENV_VAR}" instead of "ENV_VAR".
    if (
      normalizedProvider.apiKey &&
      normalizeApiKeyConfig(normalizedProvider.apiKey) !== normalizedProvider.apiKey
    ) {
      mutated = true;
      normalizedProvider = __assign(__assign({}, normalizedProvider), {
        apiKey: normalizeApiKeyConfig(normalizedProvider.apiKey),
      });
    }
    // If a provider defines models, pi's ModelRegistry requires apiKey to be set.
    // Fill it from the environment or auth profiles when possible.
    var hasModels =
      Array.isArray(normalizedProvider.models) && normalizedProvider.models.length > 0;
    if (
      hasModels &&
      !((_a = normalizedProvider.apiKey) === null || _a === void 0 ? void 0 : _a.trim())
    ) {
      var authMode =
        (_b = normalizedProvider.auth) !== null && _b !== void 0
          ? _b
          : normalizedKey === "amazon-bedrock"
            ? "aws-sdk"
            : undefined;
      if (authMode === "aws-sdk") {
        var apiKey = resolveAwsSdkApiKeyVarName();
        mutated = true;
        normalizedProvider = __assign(__assign({}, normalizedProvider), { apiKey: apiKey });
      } else {
        var fromEnv = resolveEnvApiKeyVarName(normalizedKey);
        var fromProfiles = resolveApiKeyFromProfiles({
          provider: normalizedKey,
          store: authStore,
        });
        var apiKey = fromEnv !== null && fromEnv !== void 0 ? fromEnv : fromProfiles;
        if (apiKey === null || apiKey === void 0 ? void 0 : apiKey.trim()) {
          mutated = true;
          normalizedProvider = __assign(__assign({}, normalizedProvider), { apiKey: apiKey });
        }
      }
    }
    if (normalizedKey === "google") {
      var googleNormalized = normalizeGoogleProvider(normalizedProvider);
      if (googleNormalized !== normalizedProvider) {
        mutated = true;
      }
      normalizedProvider = googleNormalized;
    }
    next[key] = normalizedProvider;
  }
  return mutated ? next : providers;
}
function buildMinimaxProvider() {
  return {
    baseUrl: MINIMAX_API_BASE_URL,
    api: "openai-completions",
    models: [
      {
        id: MINIMAX_DEFAULT_MODEL_ID,
        name: "MiniMax M2.1",
        reasoning: false,
        input: ["text"],
        cost: MINIMAX_API_COST,
        contextWindow: MINIMAX_DEFAULT_CONTEXT_WINDOW,
        maxTokens: MINIMAX_DEFAULT_MAX_TOKENS,
      },
      {
        id: MINIMAX_DEFAULT_VISION_MODEL_ID,
        name: "MiniMax VL 01",
        reasoning: false,
        input: ["text", "image"],
        cost: MINIMAX_API_COST,
        contextWindow: MINIMAX_DEFAULT_CONTEXT_WINDOW,
        maxTokens: MINIMAX_DEFAULT_MAX_TOKENS,
      },
    ],
  };
}
function buildMoonshotProvider() {
  return {
    baseUrl: MOONSHOT_BASE_URL,
    api: "openai-completions",
    models: [
      {
        id: MOONSHOT_DEFAULT_MODEL_ID,
        name: "Kimi K2.5",
        reasoning: false,
        input: ["text"],
        cost: MOONSHOT_DEFAULT_COST,
        contextWindow: MOONSHOT_DEFAULT_CONTEXT_WINDOW,
        maxTokens: MOONSHOT_DEFAULT_MAX_TOKENS,
      },
    ],
  };
}
function buildKimiCodeProvider() {
  return {
    baseUrl: KIMI_CODE_BASE_URL,
    api: "openai-completions",
    models: [
      {
        id: KIMI_CODE_MODEL_ID,
        name: "Kimi For Coding",
        reasoning: true,
        input: ["text"],
        cost: KIMI_CODE_DEFAULT_COST,
        contextWindow: KIMI_CODE_CONTEXT_WINDOW,
        maxTokens: KIMI_CODE_MAX_TOKENS,
        headers: KIMI_CODE_HEADERS,
        compat: KIMI_CODE_COMPAT,
      },
    ],
  };
}
function buildQwenPortalProvider() {
  return {
    baseUrl: QWEN_PORTAL_BASE_URL,
    api: "openai-completions",
    models: [
      {
        id: "coder-model",
        name: "Qwen Coder",
        reasoning: false,
        input: ["text"],
        cost: QWEN_PORTAL_DEFAULT_COST,
        contextWindow: QWEN_PORTAL_DEFAULT_CONTEXT_WINDOW,
        maxTokens: QWEN_PORTAL_DEFAULT_MAX_TOKENS,
      },
      {
        id: "vision-model",
        name: "Qwen Vision",
        reasoning: false,
        input: ["text", "image"],
        cost: QWEN_PORTAL_DEFAULT_COST,
        contextWindow: QWEN_PORTAL_DEFAULT_CONTEXT_WINDOW,
        maxTokens: QWEN_PORTAL_DEFAULT_MAX_TOKENS,
      },
    ],
  };
}
function buildSyntheticProvider() {
  return {
    baseUrl: synthetic_models_js_1.SYNTHETIC_BASE_URL,
    api: "anthropic-messages",
    models: synthetic_models_js_1.SYNTHETIC_MODEL_CATALOG.map(
      synthetic_models_js_1.buildSyntheticModelDefinition,
    ),
  };
}
function buildXiaomiProvider() {
  return {
    baseUrl: XIAOMI_BASE_URL,
    api: "anthropic-messages",
    models: [
      {
        id: exports.XIAOMI_DEFAULT_MODEL_ID,
        name: "Xiaomi MiMo V2 Flash",
        reasoning: false,
        input: ["text"],
        cost: XIAOMI_DEFAULT_COST,
        contextWindow: XIAOMI_DEFAULT_CONTEXT_WINDOW,
        maxTokens: XIAOMI_DEFAULT_MAX_TOKENS,
      },
    ],
  };
}
function buildVeniceProvider() {
  return __awaiter(this, void 0, void 0, function () {
    var models;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, venice_models_js_1.discoverVeniceModels)()];
        case 1:
          models = _a.sent();
          return [
            2 /*return*/,
            {
              baseUrl: venice_models_js_1.VENICE_BASE_URL,
              api: "openai-completions",
              models: models,
            },
          ];
      }
    });
  });
}
function buildOllamaProvider() {
  return __awaiter(this, void 0, void 0, function () {
    var models;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, discoverOllamaModels()];
        case 1:
          models = _a.sent();
          return [
            2 /*return*/,
            {
              baseUrl: OLLAMA_BASE_URL,
              api: "openai-completions",
              models: models,
            },
          ];
      }
    });
  });
}
function resolveImplicitProviders(params) {
  return __awaiter(this, void 0, void 0, function () {
    var providers,
      authStore,
      minimaxKey,
      moonshotKey,
      kimiCodeKey,
      syntheticKey,
      veniceKey,
      _a,
      _b,
      qwenProfiles,
      xiaomiKey,
      ollamaKey,
      _c,
      _d;
    var _e, _f, _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
      switch (_m.label) {
        case 0:
          providers = {};
          authStore = (0, auth_profiles_js_1.ensureAuthProfileStore)(params.agentDir, {
            allowKeychainPrompt: false,
          });
          minimaxKey =
            (_e = resolveEnvApiKeyVarName("minimax")) !== null && _e !== void 0
              ? _e
              : resolveApiKeyFromProfiles({ provider: "minimax", store: authStore });
          if (minimaxKey) {
            providers.minimax = __assign(__assign({}, buildMinimaxProvider()), {
              apiKey: minimaxKey,
            });
          }
          moonshotKey =
            (_f = resolveEnvApiKeyVarName("moonshot")) !== null && _f !== void 0
              ? _f
              : resolveApiKeyFromProfiles({ provider: "moonshot", store: authStore });
          if (moonshotKey) {
            providers.moonshot = __assign(__assign({}, buildMoonshotProvider()), {
              apiKey: moonshotKey,
            });
          }
          kimiCodeKey =
            (_g = resolveEnvApiKeyVarName("kimi-code")) !== null && _g !== void 0
              ? _g
              : resolveApiKeyFromProfiles({ provider: "kimi-code", store: authStore });
          if (kimiCodeKey) {
            providers["kimi-code"] = __assign(__assign({}, buildKimiCodeProvider()), {
              apiKey: kimiCodeKey,
            });
          }
          syntheticKey =
            (_h = resolveEnvApiKeyVarName("synthetic")) !== null && _h !== void 0
              ? _h
              : resolveApiKeyFromProfiles({ provider: "synthetic", store: authStore });
          if (syntheticKey) {
            providers.synthetic = __assign(__assign({}, buildSyntheticProvider()), {
              apiKey: syntheticKey,
            });
          }
          veniceKey =
            (_j = resolveEnvApiKeyVarName("venice")) !== null && _j !== void 0
              ? _j
              : resolveApiKeyFromProfiles({ provider: "venice", store: authStore });
          if (!veniceKey) {
            return [3 /*break*/, 2];
          }
          _a = providers;
          _b = [{}];
          return [4 /*yield*/, buildVeniceProvider()];
        case 1:
          _a.venice = __assign.apply(void 0, [
            __assign.apply(void 0, _b.concat([_m.sent()])),
            { apiKey: veniceKey },
          ]);
          _m.label = 2;
        case 2:
          qwenProfiles = (0, auth_profiles_js_1.listProfilesForProvider)(authStore, "qwen-portal");
          if (qwenProfiles.length > 0) {
            providers["qwen-portal"] = __assign(__assign({}, buildQwenPortalProvider()), {
              apiKey: QWEN_PORTAL_OAUTH_PLACEHOLDER,
            });
          }
          xiaomiKey =
            (_k = resolveEnvApiKeyVarName("xiaomi")) !== null && _k !== void 0
              ? _k
              : resolveApiKeyFromProfiles({ provider: "xiaomi", store: authStore });
          if (xiaomiKey) {
            providers.xiaomi = __assign(__assign({}, buildXiaomiProvider()), { apiKey: xiaomiKey });
          }
          ollamaKey =
            (_l = resolveEnvApiKeyVarName("ollama")) !== null && _l !== void 0
              ? _l
              : resolveApiKeyFromProfiles({ provider: "ollama", store: authStore });
          if (!ollamaKey) {
            return [3 /*break*/, 4];
          }
          _c = providers;
          _d = [{}];
          return [4 /*yield*/, buildOllamaProvider()];
        case 3:
          _c.ollama = __assign.apply(void 0, [
            __assign.apply(void 0, _d.concat([_m.sent()])),
            { apiKey: ollamaKey },
          ]);
          _m.label = 4;
        case 4:
          return [2 /*return*/, providers];
      }
    });
  });
}
function resolveImplicitCopilotProvider(params) {
  return __awaiter(this, void 0, void 0, function () {
    var env,
      authStore,
      hasProfile,
      envToken,
      githubToken,
      selectedGithubToken,
      profileId,
      profile,
      baseUrl,
      token,
      _a;
    var _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          env = (_b = params.env) !== null && _b !== void 0 ? _b : process.env;
          authStore = (0, auth_profiles_js_1.ensureAuthProfileStore)(params.agentDir, {
            allowKeychainPrompt: false,
          });
          hasProfile =
            (0, auth_profiles_js_1.listProfilesForProvider)(authStore, "github-copilot").length > 0;
          envToken =
            (_d = (_c = env.COPILOT_GITHUB_TOKEN) !== null && _c !== void 0 ? _c : env.GH_TOKEN) !==
              null && _d !== void 0
              ? _d
              : env.GITHUB_TOKEN;
          githubToken = (envToken !== null && envToken !== void 0 ? envToken : "").trim();
          if (!hasProfile && !githubToken) {
            return [2 /*return*/, null];
          }
          selectedGithubToken = githubToken;
          if (!selectedGithubToken && hasProfile) {
            profileId = (0, auth_profiles_js_1.listProfilesForProvider)(
              authStore,
              "github-copilot",
            )[0];
            profile = profileId ? authStore.profiles[profileId] : undefined;
            if (profile && profile.type === "token") {
              selectedGithubToken = profile.token;
            }
          }
          baseUrl = github_copilot_token_js_1.DEFAULT_COPILOT_API_BASE_URL;
          if (!selectedGithubToken) {
            return [3 /*break*/, 4];
          }
          _e.label = 1;
        case 1:
          _e.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            (0, github_copilot_token_js_1.resolveCopilotApiToken)({
              githubToken: selectedGithubToken,
              env: env,
            }),
          ];
        case 2:
          token = _e.sent();
          baseUrl = token.baseUrl;
          return [3 /*break*/, 4];
        case 3:
          _a = _e.sent();
          baseUrl = github_copilot_token_js_1.DEFAULT_COPILOT_API_BASE_URL;
          return [3 /*break*/, 4];
        case 4:
          // pi-coding-agent's ModelRegistry marks a model "available" only if its
          // `AuthStorage` has auth configured for that provider (via auth.json/env/etc).
          // Our Copilot auth lives in OpenClaw's auth-profiles store instead, so we also
          // write a runtime-only auth.json entry for pi-coding-agent to pick up.
          //
          // This is safe because it's (1) within OpenClaw's agent dir, (2) contains the
          // GitHub token (not the exchanged Copilot token), and (3) matches existing
          // patterns for OAuth-like providers in pi-coding-agent.
          // Note: we deliberately do not write pi-coding-agent's `auth.json` here.
          // OpenClaw uses its own auth store and exchanges tokens at runtime.
          // `models list` uses OpenClaw's auth heuristics for availability.
          // We intentionally do NOT define custom models for Copilot in models.json.
          // pi-coding-agent treats providers with models as replacements requiring apiKey.
          // We only override baseUrl; the model list comes from pi-ai built-ins.
          return [
            2 /*return*/,
            {
              baseUrl: baseUrl,
              models: [],
            },
          ];
      }
    });
  });
}
function resolveImplicitBedrockProvider(params) {
  return __awaiter(this, void 0, void 0, function () {
    var env, discoveryConfig, enabled, hasAwsCreds, region, models;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
          discoveryConfig =
            (_c = (_b = params.config) === null || _b === void 0 ? void 0 : _b.models) === null ||
            _c === void 0
              ? void 0
              : _c.bedrockDiscovery;
          enabled =
            discoveryConfig === null || discoveryConfig === void 0
              ? void 0
              : discoveryConfig.enabled;
          hasAwsCreds = (0, model_auth_js_1.resolveAwsSdkEnvVarName)(env) !== undefined;
          if (enabled === false) {
            return [2 /*return*/, null];
          }
          if (enabled !== true && !hasAwsCreds) {
            return [2 /*return*/, null];
          }
          region =
            (_f =
              (_e =
                (_d =
                  discoveryConfig === null || discoveryConfig === void 0
                    ? void 0
                    : discoveryConfig.region) !== null && _d !== void 0
                  ? _d
                  : env.AWS_REGION) !== null && _e !== void 0
                ? _e
                : env.AWS_DEFAULT_REGION) !== null && _f !== void 0
              ? _f
              : "us-east-1";
          return [
            4 /*yield*/,
            (0, bedrock_discovery_js_1.discoverBedrockModels)({
              region: region,
              config: discoveryConfig,
            }),
          ];
        case 1:
          models = _g.sent();
          if (models.length === 0) {
            return [2 /*return*/, null];
          }
          return [
            2 /*return*/,
            {
              baseUrl: "https://bedrock-runtime.".concat(region, ".amazonaws.com"),
              api: "bedrock-converse-stream",
              auth: "aws-sdk",
              models: models,
            },
          ];
      }
    });
  });
}
