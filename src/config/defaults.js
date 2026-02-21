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
exports.applyMessageDefaults = applyMessageDefaults;
exports.applySessionDefaults = applySessionDefaults;
exports.applyTalkApiKey = applyTalkApiKey;
exports.applyModelDefaults = applyModelDefaults;
exports.applyAgentDefaults = applyAgentDefaults;
exports.applyLoggingDefaults = applyLoggingDefaults;
exports.applyContextPruningDefaults = applyContextPruningDefaults;
exports.applyCompactionDefaults = applyCompactionDefaults;
exports.resetSessionDefaultsWarningForTests = resetSessionDefaultsWarningForTests;
var defaults_js_1 = require("../agents/defaults.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var talk_js_1 = require("./talk.js");
var agent_limits_js_1 = require("./agent-limits.js");
var defaultWarnState = { warned: false };
var DEFAULT_MODEL_ALIASES = {
  // Anthropic (pi-ai catalog uses "latest" ids without date suffix)
  opus: "anthropic/claude-opus-4-5",
  sonnet: "anthropic/claude-sonnet-4-5",
  // OpenAI
  gpt: "openai/gpt-5.2",
  "gpt-mini": "openai/gpt-5-mini",
  // Google Gemini (3.x are preview ids in the catalog)
  gemini: "google/gemini-3-pro-preview",
  "gemini-flash": "google/gemini-3-flash-preview",
};
var DEFAULT_MODEL_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};
var DEFAULT_MODEL_INPUT = ["text"];
var DEFAULT_MODEL_MAX_TOKENS = 8192;
function isPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function resolveModelCost(raw) {
  return {
    input:
      typeof (raw === null || raw === void 0 ? void 0 : raw.input) === "number"
        ? raw.input
        : DEFAULT_MODEL_COST.input,
    output:
      typeof (raw === null || raw === void 0 ? void 0 : raw.output) === "number"
        ? raw.output
        : DEFAULT_MODEL_COST.output,
    cacheRead:
      typeof (raw === null || raw === void 0 ? void 0 : raw.cacheRead) === "number"
        ? raw.cacheRead
        : DEFAULT_MODEL_COST.cacheRead,
    cacheWrite:
      typeof (raw === null || raw === void 0 ? void 0 : raw.cacheWrite) === "number"
        ? raw.cacheWrite
        : DEFAULT_MODEL_COST.cacheWrite,
  };
}
function resolveAnthropicDefaultAuthMode(cfg) {
  var _a, _b, _c, _d, _e, _f, _g;
  var profiles =
    (_b = (_a = cfg.auth) === null || _a === void 0 ? void 0 : _a.profiles) !== null &&
    _b !== void 0
      ? _b
      : {};
  var anthropicProfiles = Object.entries(profiles).filter(function (_a) {
    var profile = _a[1];
    return (profile === null || profile === void 0 ? void 0 : profile.provider) === "anthropic";
  });
  var order =
    (_e =
      (_d = (_c = cfg.auth) === null || _c === void 0 ? void 0 : _c.order) === null || _d === void 0
        ? void 0
        : _d.anthropic) !== null && _e !== void 0
      ? _e
      : [];
  for (var _i = 0, order_1 = order; _i < order_1.length; _i++) {
    var profileId = order_1[_i];
    var entry = profiles[profileId];
    if (!entry || entry.provider !== "anthropic") {
      continue;
    }
    if (entry.mode === "api_key") {
      return "api_key";
    }
    if (entry.mode === "oauth" || entry.mode === "token") {
      return "oauth";
    }
  }
  var hasApiKey = anthropicProfiles.some(function (_a) {
    var profile = _a[1];
    return (profile === null || profile === void 0 ? void 0 : profile.mode) === "api_key";
  });
  var hasOauth = anthropicProfiles.some(function (_a) {
    var profile = _a[1];
    return (
      (profile === null || profile === void 0 ? void 0 : profile.mode) === "oauth" ||
      (profile === null || profile === void 0 ? void 0 : profile.mode) === "token"
    );
  });
  if (hasApiKey && !hasOauth) {
    return "api_key";
  }
  if (hasOauth && !hasApiKey) {
    return "oauth";
  }
  if ((_f = process.env.ANTHROPIC_OAUTH_TOKEN) === null || _f === void 0 ? void 0 : _f.trim()) {
    return "oauth";
  }
  if ((_g = process.env.ANTHROPIC_API_KEY) === null || _g === void 0 ? void 0 : _g.trim()) {
    return "api_key";
  }
  return null;
}
function resolvePrimaryModelRef(raw) {
  var _a;
  if (!raw || typeof raw !== "string") {
    return null;
  }
  var trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  var aliasKey = trimmed.toLowerCase();
  return (_a = DEFAULT_MODEL_ALIASES[aliasKey]) !== null && _a !== void 0 ? _a : trimmed;
}
function applyMessageDefaults(cfg) {
  var messages = cfg.messages;
  var hasAckScope =
    (messages === null || messages === void 0 ? void 0 : messages.ackReactionScope) !== undefined;
  if (hasAckScope) {
    return cfg;
  }
  var nextMessages = messages ? __assign({}, messages) : {};
  nextMessages.ackReactionScope = "group-mentions";
  return __assign(__assign({}, cfg), { messages: nextMessages });
}
function applySessionDefaults(cfg, options) {
  var _a, _b;
  if (options === void 0) {
    options = {};
  }
  var session = cfg.session;
  if (!session || session.mainKey === undefined) {
    return cfg;
  }
  var trimmed = session.mainKey.trim();
  var warn = (_a = options.warn) !== null && _a !== void 0 ? _a : console.warn;
  var warnState = (_b = options.warnState) !== null && _b !== void 0 ? _b : defaultWarnState;
  var next = __assign(__assign({}, cfg), {
    session: __assign(__assign({}, session), { mainKey: "main" }),
  });
  if (trimmed && trimmed !== "main" && !warnState.warned) {
    warnState.warned = true;
    warn('session.mainKey is ignored; main session is always "main".');
  }
  return next;
}
function applyTalkApiKey(config) {
  var _a, _b;
  var resolved = (0, talk_js_1.resolveTalkApiKey)();
  if (!resolved) {
    return config;
  }
  var existing =
    (_b = (_a = config.talk) === null || _a === void 0 ? void 0 : _a.apiKey) === null ||
    _b === void 0
      ? void 0
      : _b.trim();
  if (existing) {
    return config;
  }
  return __assign(__assign({}, config), {
    talk: __assign(__assign({}, config.talk), { apiKey: resolved }),
  });
}
function applyModelDefaults(cfg) {
  var _a, _b, _c;
  var mutated = false;
  var nextCfg = cfg;
  var providerConfig = (_a = nextCfg.models) === null || _a === void 0 ? void 0 : _a.providers;
  if (providerConfig) {
    var nextProviders = __assign({}, providerConfig);
    var _loop_1 = function (providerId, provider) {
      var models = provider.models;
      if (!Array.isArray(models) || models.length === 0) {
        return "continue";
      }
      var providerMutated = false;
      var nextModels_1 = models.map(function (model) {
        var _a;
        var raw = model;
        var modelMutated = false;
        var reasoning = typeof raw.reasoning === "boolean" ? raw.reasoning : false;
        if (raw.reasoning !== reasoning) {
          modelMutated = true;
        }
        var input =
          (_a = raw.input) !== null && _a !== void 0
            ? _a
            : __spreadArray([], DEFAULT_MODEL_INPUT, true);
        if (raw.input === undefined) {
          modelMutated = true;
        }
        var cost = resolveModelCost(raw.cost);
        var costMutated =
          !raw.cost ||
          raw.cost.input !== cost.input ||
          raw.cost.output !== cost.output ||
          raw.cost.cacheRead !== cost.cacheRead ||
          raw.cost.cacheWrite !== cost.cacheWrite;
        if (costMutated) {
          modelMutated = true;
        }
        var contextWindow = isPositiveNumber(raw.contextWindow)
          ? raw.contextWindow
          : defaults_js_1.DEFAULT_CONTEXT_TOKENS;
        if (raw.contextWindow !== contextWindow) {
          modelMutated = true;
        }
        var defaultMaxTokens = Math.min(DEFAULT_MODEL_MAX_TOKENS, contextWindow);
        var maxTokens = isPositiveNumber(raw.maxTokens) ? raw.maxTokens : defaultMaxTokens;
        if (raw.maxTokens !== maxTokens) {
          modelMutated = true;
        }
        if (!modelMutated) {
          return model;
        }
        providerMutated = true;
        return __assign(__assign({}, raw), {
          reasoning: reasoning,
          input: input,
          cost: cost,
          contextWindow: contextWindow,
          maxTokens: maxTokens,
        });
      });
      if (!providerMutated) {
        return "continue";
      }
      nextProviders[providerId] = __assign(__assign({}, provider), { models: nextModels_1 });
      mutated = true;
    };
    for (var _i = 0, _d = Object.entries(providerConfig); _i < _d.length; _i++) {
      var _e = _d[_i],
        providerId = _e[0],
        provider = _e[1];
      _loop_1(providerId, provider);
    }
    if (mutated) {
      nextCfg = __assign(__assign({}, nextCfg), {
        models: __assign(__assign({}, nextCfg.models), { providers: nextProviders }),
      });
    }
  }
  var existingAgent = (_b = nextCfg.agents) === null || _b === void 0 ? void 0 : _b.defaults;
  if (!existingAgent) {
    return mutated ? nextCfg : cfg;
  }
  var existingModels = (_c = existingAgent.models) !== null && _c !== void 0 ? _c : {};
  if (Object.keys(existingModels).length === 0) {
    return mutated ? nextCfg : cfg;
  }
  var nextModels = __assign({}, existingModels);
  for (var _f = 0, _g = Object.entries(DEFAULT_MODEL_ALIASES); _f < _g.length; _f++) {
    var _h = _g[_f],
      alias = _h[0],
      target = _h[1];
    var entry = nextModels[target];
    if (!entry) {
      continue;
    }
    if (entry.alias !== undefined) {
      continue;
    }
    nextModels[target] = __assign(__assign({}, entry), { alias: alias });
    mutated = true;
  }
  if (!mutated) {
    return cfg;
  }
  return __assign(__assign({}, nextCfg), {
    agents: __assign(__assign({}, nextCfg.agents), {
      defaults: __assign(__assign({}, existingAgent), { models: nextModels }),
    }),
  });
}
function applyAgentDefaults(cfg) {
  var _a;
  var agents = cfg.agents;
  var defaults = agents === null || agents === void 0 ? void 0 : agents.defaults;
  var hasMax =
    typeof (defaults === null || defaults === void 0 ? void 0 : defaults.maxConcurrent) ===
      "number" && Number.isFinite(defaults.maxConcurrent);
  var hasSubMax =
    typeof ((_a = defaults === null || defaults === void 0 ? void 0 : defaults.subagents) ===
      null || _a === void 0
      ? void 0
      : _a.maxConcurrent) === "number" && Number.isFinite(defaults.subagents.maxConcurrent);
  if (hasMax && hasSubMax) {
    return cfg;
  }
  var mutated = false;
  var nextDefaults = defaults ? __assign({}, defaults) : {};
  if (!hasMax) {
    nextDefaults.maxConcurrent = agent_limits_js_1.DEFAULT_AGENT_MAX_CONCURRENT;
    mutated = true;
  }
  var nextSubagents = (defaults === null || defaults === void 0 ? void 0 : defaults.subagents)
    ? __assign({}, defaults.subagents)
    : {};
  if (!hasSubMax) {
    nextSubagents.maxConcurrent = agent_limits_js_1.DEFAULT_SUBAGENT_MAX_CONCURRENT;
    mutated = true;
  }
  if (!mutated) {
    return cfg;
  }
  return __assign(__assign({}, cfg), {
    agents: __assign(__assign({}, agents), {
      defaults: __assign(__assign({}, nextDefaults), { subagents: nextSubagents }),
    }),
  });
}
function applyLoggingDefaults(cfg) {
  var logging = cfg.logging;
  if (!logging) {
    return cfg;
  }
  if (logging.redactSensitive) {
    return cfg;
  }
  return __assign(__assign({}, cfg), {
    logging: __assign(__assign({}, logging), { redactSensitive: "tools" }),
  });
}
function applyContextPruningDefaults(cfg) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
  var defaults = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults;
  if (!defaults) {
    return cfg;
  }
  var authMode = resolveAnthropicDefaultAuthMode(cfg);
  if (!authMode) {
    return cfg;
  }
  var mutated = false;
  var nextDefaults = __assign({}, defaults);
  var contextPruning = (_b = defaults.contextPruning) !== null && _b !== void 0 ? _b : {};
  var heartbeat = (_c = defaults.heartbeat) !== null && _c !== void 0 ? _c : {};
  if (((_d = defaults.contextPruning) === null || _d === void 0 ? void 0 : _d.mode) === undefined) {
    nextDefaults.contextPruning = __assign(__assign({}, contextPruning), {
      mode: "cache-ttl",
      ttl:
        (_f = (_e = defaults.contextPruning) === null || _e === void 0 ? void 0 : _e.ttl) !==
          null && _f !== void 0
          ? _f
          : "1h",
    });
    mutated = true;
  }
  if (((_g = defaults.heartbeat) === null || _g === void 0 ? void 0 : _g.every) === undefined) {
    nextDefaults.heartbeat = __assign(__assign({}, heartbeat), {
      every: authMode === "oauth" ? "1h" : "30m",
    });
    mutated = true;
  }
  if (authMode === "api_key") {
    var nextModels = defaults.models ? __assign({}, defaults.models) : {};
    var modelsMutated = false;
    for (var _i = 0, _m = Object.entries(nextModels); _i < _m.length; _i++) {
      var _o = _m[_i],
        key = _o[0],
        entry = _o[1];
      var parsed = (0, model_selection_js_1.parseModelRef)(key, "anthropic");
      if (!parsed || parsed.provider !== "anthropic") {
        continue;
      }
      var current = entry !== null && entry !== void 0 ? entry : {};
      var params = (_h = current.params) !== null && _h !== void 0 ? _h : {};
      if (typeof params.cacheControlTtl === "string") {
        continue;
      }
      nextModels[key] = __assign(__assign({}, current), {
        params: __assign(__assign({}, params), { cacheControlTtl: "1h" }),
      });
      modelsMutated = true;
    }
    var primary = resolvePrimaryModelRef(
      (_k = (_j = defaults.model) === null || _j === void 0 ? void 0 : _j.primary) !== null &&
        _k !== void 0
        ? _k
        : undefined,
    );
    if (primary) {
      var parsedPrimary = (0, model_selection_js_1.parseModelRef)(primary, "anthropic");
      if (
        (parsedPrimary === null || parsedPrimary === void 0 ? void 0 : parsedPrimary.provider) ===
        "anthropic"
      ) {
        var key = "".concat(parsedPrimary.provider, "/").concat(parsedPrimary.model);
        var entry = nextModels[key];
        var current = entry !== null && entry !== void 0 ? entry : {};
        var params = (_l = current.params) !== null && _l !== void 0 ? _l : {};
        if (typeof params.cacheControlTtl !== "string") {
          nextModels[key] = __assign(__assign({}, current), {
            params: __assign(__assign({}, params), { cacheControlTtl: "1h" }),
          });
          modelsMutated = true;
        }
      }
    }
    if (modelsMutated) {
      nextDefaults.models = nextModels;
      mutated = true;
    }
  }
  if (!mutated) {
    return cfg;
  }
  return __assign(__assign({}, cfg), {
    agents: __assign(__assign({}, cfg.agents), { defaults: nextDefaults }),
  });
}
function applyCompactionDefaults(cfg) {
  var _a;
  var defaults = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults;
  if (!defaults) {
    return cfg;
  }
  var compaction = defaults === null || defaults === void 0 ? void 0 : defaults.compaction;
  if (compaction === null || compaction === void 0 ? void 0 : compaction.mode) {
    return cfg;
  }
  return __assign(__assign({}, cfg), {
    agents: __assign(__assign({}, cfg.agents), {
      defaults: __assign(__assign({}, defaults), {
        compaction: __assign(__assign({}, compaction), { mode: "safeguard" }),
      }),
    }),
  });
}
function resetSessionDefaultsWarningForTests() {
  defaultWarnState = { warned: false };
}
