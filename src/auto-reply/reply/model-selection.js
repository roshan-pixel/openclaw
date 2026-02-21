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
exports.createModelSelectionState = createModelSelectionState;
exports.resolveModelDirectiveSelection = resolveModelDirectiveSelection;
exports.resolveContextTokens = resolveContextTokens;
var context_js_1 = require("../../agents/context.js");
var defaults_js_1 = require("../../agents/defaults.js");
var model_catalog_js_1 = require("../../agents/model-catalog.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var sessions_js_1 = require("../../config/sessions.js");
var session_override_js_1 = require("../../agents/auth-profiles/session-override.js");
var model_overrides_js_1 = require("../../sessions/model-overrides.js");
var session_key_utils_js_1 = require("../../sessions/session-key-utils.js");
var FUZZY_VARIANT_TOKENS = [
  "lightning",
  "preview",
  "mini",
  "fast",
  "turbo",
  "lite",
  "beta",
  "small",
  "nano",
];
function boundedLevenshteinDistance(a, b, maxDistance) {
  var _a, _b;
  if (a === b) {
    return 0;
  }
  if (!a || !b) {
    return null;
  }
  var aLen = a.length;
  var bLen = b.length;
  if (Math.abs(aLen - bLen) > maxDistance) {
    return null;
  }
  // Standard DP with early exit. O(maxDistance * minLen) in common cases.
  var prev = Array.from({ length: bLen + 1 }, function (_, idx) {
    return idx;
  });
  var curr = Array.from({ length: bLen + 1 }, function () {
    return 0;
  });
  for (var i = 1; i <= aLen; i++) {
    curr[0] = i;
    var rowMin = curr[0];
    var aChar = a.charCodeAt(i - 1);
    for (var j = 1; j <= bLen; j++) {
      var cost = aChar === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (curr[j] < rowMin) {
        rowMin = curr[j];
      }
    }
    if (rowMin > maxDistance) {
      return null;
    }
    for (var j = 0; j <= bLen; j++) {
      prev[j] = (_a = curr[j]) !== null && _a !== void 0 ? _a : 0;
    }
  }
  var dist = (_b = prev[bLen]) !== null && _b !== void 0 ? _b : null;
  if (dist == null || dist > maxDistance) {
    return null;
  }
  return dist;
}
function resolveModelOverrideFromEntry(entry) {
  var _a, _b;
  var model =
    (_a = entry === null || entry === void 0 ? void 0 : entry.modelOverride) === null ||
    _a === void 0
      ? void 0
      : _a.trim();
  if (!model) {
    return null;
  }
  var provider =
    ((_b = entry === null || entry === void 0 ? void 0 : entry.providerOverride) === null ||
    _b === void 0
      ? void 0
      : _b.trim()) || undefined;
  return { provider: provider, model: model };
}
function resolveParentSessionKeyCandidate(params) {
  var _a;
  var explicit = (_a = params.parentSessionKey) === null || _a === void 0 ? void 0 : _a.trim();
  if (explicit && explicit !== params.sessionKey) {
    return explicit;
  }
  var derived = (0, session_key_utils_js_1.resolveThreadParentSessionKey)(params.sessionKey);
  if (derived && derived !== params.sessionKey) {
    return derived;
  }
  return null;
}
function resolveStoredModelOverride(params) {
  var direct = resolveModelOverrideFromEntry(params.sessionEntry);
  if (direct) {
    return __assign(__assign({}, direct), { source: "session" });
  }
  var parentKey = resolveParentSessionKeyCandidate({
    sessionKey: params.sessionKey,
    parentSessionKey: params.parentSessionKey,
  });
  if (!parentKey || !params.sessionStore) {
    return null;
  }
  var parentEntry = params.sessionStore[parentKey];
  var parentOverride = resolveModelOverrideFromEntry(parentEntry);
  if (!parentOverride) {
    return null;
  }
  return __assign(__assign({}, parentOverride), { source: "parent" });
}
function scoreFuzzyMatch(params) {
  var _a;
  var provider = (0, model_selection_js_1.normalizeProviderId)(params.provider);
  var model = params.model;
  var fragment = params.fragment.trim().toLowerCase();
  var providerLower = provider.toLowerCase();
  var modelLower = model.toLowerCase();
  var haystack = "".concat(providerLower, "/").concat(modelLower);
  var key = (0, model_selection_js_1.modelKey)(provider, model);
  var scoreFragment = function (value, weights) {
    if (!fragment) {
      return 0;
    }
    var score = 0;
    if (value === fragment) {
      score = Math.max(score, weights.exact);
    }
    if (value.startsWith(fragment)) {
      score = Math.max(score, weights.starts);
    }
    if (value.includes(fragment)) {
      score = Math.max(score, weights.includes);
    }
    return score;
  };
  var score = 0;
  score += scoreFragment(haystack, { exact: 220, starts: 140, includes: 110 });
  score += scoreFragment(providerLower, {
    exact: 180,
    starts: 120,
    includes: 90,
  });
  score += scoreFragment(modelLower, {
    exact: 160,
    starts: 110,
    includes: 80,
  });
  // Best-effort typo tolerance for common near-misses like "claud" vs "claude".
  // Bounded to keep this cheap across large model sets.
  var distModel = boundedLevenshteinDistance(fragment, modelLower, 3);
  if (distModel != null) {
    score += (3 - distModel) * 70;
  }
  var aliases = (_a = params.aliasIndex.byKey.get(key)) !== null && _a !== void 0 ? _a : [];
  for (var _i = 0, aliases_1 = aliases; _i < aliases_1.length; _i++) {
    var alias = aliases_1[_i];
    score += scoreFragment(alias.toLowerCase(), {
      exact: 140,
      starts: 90,
      includes: 60,
    });
  }
  if (modelLower.startsWith(providerLower)) {
    score += 30;
  }
  var fragmentVariants = FUZZY_VARIANT_TOKENS.filter(function (token) {
    return fragment.includes(token);
  });
  var modelVariants = FUZZY_VARIANT_TOKENS.filter(function (token) {
    return modelLower.includes(token);
  });
  var variantMatchCount = fragmentVariants.filter(function (token) {
    return modelLower.includes(token);
  }).length;
  var variantCount = modelVariants.length;
  if (fragmentVariants.length === 0 && variantCount > 0) {
    score -= variantCount * 30;
  } else if (fragmentVariants.length > 0) {
    if (variantMatchCount > 0) {
      score += variantMatchCount * 40;
    }
    if (variantMatchCount === 0) {
      score -= 20;
    }
  }
  var defaultProvider = (0, model_selection_js_1.normalizeProviderId)(params.defaultProvider);
  var isDefault = provider === defaultProvider && model === params.defaultModel;
  if (isDefault) {
    score += 20;
  }
  return {
    score: score,
    isDefault: isDefault,
    variantCount: variantCount,
    variantMatchCount: variantMatchCount,
    modelLength: modelLower.length,
    key: key,
  };
}
function createModelSelectionState(params) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      agentCfg,
      sessionEntry,
      sessionStore,
      sessionKey,
      parentSessionKey,
      storePath,
      defaultProvider,
      defaultModel,
      provider,
      model,
      hasAllowlist,
      initialStoredOverride,
      hasStoredOverride,
      needsModelCatalog,
      allowedModelKeys,
      allowedModelCatalog,
      modelCatalog,
      resetModelOverride,
      allowed,
      overrideProvider,
      overrideModel,
      key,
      updated,
      storedOverride,
      candidateProvider,
      key,
      ensureAuthProfileStore,
      store,
      profile,
      providerKey,
      defaultThinkingLevel,
      resolveDefaultThinkingLevel;
    var _this = this;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          ((cfg = params.cfg),
            (agentCfg = params.agentCfg),
            (sessionEntry = params.sessionEntry),
            (sessionStore = params.sessionStore),
            (sessionKey = params.sessionKey),
            (parentSessionKey = params.parentSessionKey),
            (storePath = params.storePath),
            (defaultProvider = params.defaultProvider),
            (defaultModel = params.defaultModel));
          provider = params.provider;
          model = params.model;
          hasAllowlist =
            (agentCfg === null || agentCfg === void 0 ? void 0 : agentCfg.models) &&
            Object.keys(agentCfg.models).length > 0;
          initialStoredOverride = resolveStoredModelOverride({
            sessionEntry: sessionEntry,
            sessionStore: sessionStore,
            sessionKey: sessionKey,
            parentSessionKey: parentSessionKey,
          });
          hasStoredOverride = Boolean(initialStoredOverride);
          needsModelCatalog = params.hasModelDirective || hasAllowlist || hasStoredOverride;
          allowedModelKeys = new Set();
          allowedModelCatalog = [];
          modelCatalog = null;
          resetModelOverride = false;
          if (!needsModelCatalog) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: cfg })];
        case 1:
          modelCatalog = _c.sent();
          allowed = (0, model_selection_js_1.buildAllowedModelSet)({
            cfg: cfg,
            catalog: modelCatalog,
            defaultProvider: defaultProvider,
            defaultModel: defaultModel,
          });
          allowedModelCatalog = allowed.allowedCatalog;
          allowedModelKeys = allowed.allowedKeys;
          _c.label = 2;
        case 2:
          if (!(sessionEntry && sessionStore && sessionKey && hasStoredOverride)) {
            return [3 /*break*/, 5];
          }
          overrideProvider =
            ((_a = sessionEntry.providerOverride) === null || _a === void 0 ? void 0 : _a.trim()) ||
            defaultProvider;
          overrideModel =
            (_b = sessionEntry.modelOverride) === null || _b === void 0 ? void 0 : _b.trim();
          if (!overrideModel) {
            return [3 /*break*/, 5];
          }
          key = (0, model_selection_js_1.modelKey)(overrideProvider, overrideModel);
          if (!(allowedModelKeys.size > 0 && !allowedModelKeys.has(key))) {
            return [3 /*break*/, 5];
          }
          updated = (0, model_overrides_js_1.applyModelOverrideToSessionEntry)({
            entry: sessionEntry,
            selection: { provider: defaultProvider, model: defaultModel, isDefault: true },
          }).updated;
          if (!updated) {
            return [3 /*break*/, 4];
          }
          sessionStore[sessionKey] = sessionEntry;
          if (!storePath) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
              store[sessionKey] = sessionEntry;
            }),
          ];
        case 3:
          _c.sent();
          _c.label = 4;
        case 4:
          resetModelOverride = updated;
          _c.label = 5;
        case 5:
          storedOverride = resolveStoredModelOverride({
            sessionEntry: sessionEntry,
            sessionStore: sessionStore,
            sessionKey: sessionKey,
            parentSessionKey: parentSessionKey,
          });
          if (
            storedOverride === null || storedOverride === void 0 ? void 0 : storedOverride.model
          ) {
            candidateProvider = storedOverride.provider || defaultProvider;
            key = (0, model_selection_js_1.modelKey)(candidateProvider, storedOverride.model);
            if (allowedModelKeys.size === 0 || allowedModelKeys.has(key)) {
              provider = candidateProvider;
              model = storedOverride.model;
            }
          }
          if (!(sessionEntry && sessionStore && sessionKey && sessionEntry.authProfileOverride)) {
            return [3 /*break*/, 8];
          }
          return [
            4 /*yield*/,
            Promise.resolve().then(function () {
              return require("../../agents/auth-profiles.js");
            }),
          ];
        case 6:
          ensureAuthProfileStore = _c.sent().ensureAuthProfileStore;
          store = ensureAuthProfileStore(undefined, {
            allowKeychainPrompt: false,
          });
          profile = store.profiles[sessionEntry.authProfileOverride];
          providerKey = (0, model_selection_js_1.normalizeProviderId)(provider);
          if (
            !(
              !profile ||
              (0, model_selection_js_1.normalizeProviderId)(profile.provider) !== providerKey
            )
          ) {
            return [3 /*break*/, 8];
          }
          return [
            4 /*yield*/,
            (0, session_override_js_1.clearSessionAuthProfileOverride)({
              sessionEntry: sessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
            }),
          ];
        case 7:
          _c.sent();
          _c.label = 8;
        case 8:
          resolveDefaultThinkingLevel = function () {
            return __awaiter(_this, void 0, void 0, function () {
              var catalogForThinking, resolved;
              var _a;
              return __generator(this, function (_b) {
                switch (_b.label) {
                  case 0:
                    if (defaultThinkingLevel) {
                      return [2 /*return*/, defaultThinkingLevel];
                    }
                    catalogForThinking =
                      modelCatalog !== null && modelCatalog !== void 0
                        ? modelCatalog
                        : allowedModelCatalog;
                    if (!(!catalogForThinking || catalogForThinking.length === 0)) {
                      return [3 /*break*/, 2];
                    }
                    return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: cfg })];
                  case 1:
                    modelCatalog = _b.sent();
                    catalogForThinking = modelCatalog;
                    _b.label = 2;
                  case 2:
                    resolved = (0, model_selection_js_1.resolveThinkingDefault)({
                      cfg: cfg,
                      provider: provider,
                      model: model,
                      catalog: catalogForThinking,
                    });
                    defaultThinkingLevel =
                      (_a =
                        resolved !== null && resolved !== void 0
                          ? resolved
                          : agentCfg === null || agentCfg === void 0
                            ? void 0
                            : agentCfg.thinkingDefault) !== null && _a !== void 0
                        ? _a
                        : "off";
                    return [2 /*return*/, defaultThinkingLevel];
                }
              });
            });
          };
          return [
            2 /*return*/,
            {
              provider: provider,
              model: model,
              allowedModelKeys: allowedModelKeys,
              allowedModelCatalog: allowedModelCatalog,
              resetModelOverride: resetModelOverride,
              resolveDefaultThinkingLevel: resolveDefaultThinkingLevel,
              needsModelCatalog: needsModelCatalog,
            },
          ];
      }
    });
  });
}
function resolveModelDirectiveSelection(params) {
  var raw = params.raw,
    defaultProvider = params.defaultProvider,
    defaultModel = params.defaultModel,
    aliasIndex = params.aliasIndex,
    allowedModelKeys = params.allowedModelKeys;
  var rawTrimmed = raw.trim();
  var rawLower = rawTrimmed.toLowerCase();
  var pickAliasForKey = function (provider, model) {
    var _a;
    return (_a = aliasIndex.byKey.get((0, model_selection_js_1.modelKey)(provider, model))) ===
      null || _a === void 0
      ? void 0
      : _a[0];
  };
  var buildSelection = function (provider, model) {
    var alias = pickAliasForKey(provider, model);
    return __assign(
      {
        provider: provider,
        model: model,
        isDefault: provider === defaultProvider && model === defaultModel,
      },
      alias ? { alias: alias } : undefined,
    );
  };
  var resolveFuzzy = function (params) {
    var fragment = params.fragment.trim().toLowerCase();
    if (!fragment) {
      return {};
    }
    var providerFilter = params.provider
      ? (0, model_selection_js_1.normalizeProviderId)(params.provider)
      : undefined;
    var candidates = [];
    for (var _i = 0, allowedModelKeys_1 = allowedModelKeys; _i < allowedModelKeys_1.length; _i++) {
      var key = allowedModelKeys_1[_i];
      var slash = key.indexOf("/");
      if (slash <= 0) {
        continue;
      }
      var provider = (0, model_selection_js_1.normalizeProviderId)(key.slice(0, slash));
      var model = key.slice(slash + 1);
      if (providerFilter && provider !== providerFilter) {
        continue;
      }
      candidates.push({ provider: provider, model: model });
    }
    // Also allow partial alias matches when the user didn't specify a provider.
    if (!params.provider) {
      var aliasMatches = [];
      for (var _a = 0, _b = aliasIndex.byAlias.entries(); _a < _b.length; _a++) {
        var _c = _b[_a],
          aliasKey = _c[0],
          entry = _c[1];
        if (!aliasKey.includes(fragment)) {
          continue;
        }
        aliasMatches.push({
          provider: entry.ref.provider,
          model: entry.ref.model,
        });
      }
      var _loop_1 = function (match) {
        var key = (0, model_selection_js_1.modelKey)(match.provider, match.model);
        if (!allowedModelKeys.has(key)) {
          return "continue";
        }
        if (
          !candidates.some(function (c) {
            return c.provider === match.provider && c.model === match.model;
          })
        ) {
          candidates.push(match);
        }
      };
      for (var _d = 0, aliasMatches_1 = aliasMatches; _d < aliasMatches_1.length; _d++) {
        var match = aliasMatches_1[_d];
        _loop_1(match);
      }
    }
    if (candidates.length === 0) {
      return {};
    }
    var scored = candidates
      .map(function (candidate) {
        var details = scoreFuzzyMatch({
          provider: candidate.provider,
          model: candidate.model,
          fragment: fragment,
          aliasIndex: aliasIndex,
          defaultProvider: defaultProvider,
          defaultModel: defaultModel,
        });
        return __assign({ candidate: candidate }, details);
      })
      .toSorted(function (a, b) {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        if (a.isDefault !== b.isDefault) {
          return a.isDefault ? -1 : 1;
        }
        if (a.variantMatchCount !== b.variantMatchCount) {
          return b.variantMatchCount - a.variantMatchCount;
        }
        if (a.variantCount !== b.variantCount) {
          return a.variantCount - b.variantCount;
        }
        if (a.modelLength !== b.modelLength) {
          return a.modelLength - b.modelLength;
        }
        return a.key.localeCompare(b.key);
      });
    var bestScored = scored[0];
    var best = bestScored === null || bestScored === void 0 ? void 0 : bestScored.candidate;
    if (!best || !bestScored) {
      return {};
    }
    var minScore = providerFilter ? 90 : 120;
    if (bestScored.score < minScore) {
      return {};
    }
    return { selection: buildSelection(best.provider, best.model) };
  };
  var resolved = (0, model_selection_js_1.resolveModelRefFromString)({
    raw: rawTrimmed,
    defaultProvider: defaultProvider,
    aliasIndex: aliasIndex,
  });
  if (!resolved) {
    var fuzzy_1 = resolveFuzzy({ fragment: rawTrimmed });
    if (fuzzy_1.selection || fuzzy_1.error) {
      return fuzzy_1;
    }
    return {
      error: 'Unrecognized model "'.concat(
        rawTrimmed,
        '". Use /models to list providers, or /models <provider> to list models.',
      ),
    };
  }
  var resolvedKey = (0, model_selection_js_1.modelKey)(resolved.ref.provider, resolved.ref.model);
  if (allowedModelKeys.size === 0 || allowedModelKeys.has(resolvedKey)) {
    return {
      selection: {
        provider: resolved.ref.provider,
        model: resolved.ref.model,
        isDefault: resolved.ref.provider === defaultProvider && resolved.ref.model === defaultModel,
        alias: resolved.alias,
      },
    };
  }
  // If the user specified a provider/model but the exact model isn't allowed,
  // attempt a fuzzy match within that provider.
  if (rawLower.includes("/")) {
    var slash = rawTrimmed.indexOf("/");
    var provider = (0, model_selection_js_1.normalizeProviderId)(rawTrimmed.slice(0, slash).trim());
    var fragment = rawTrimmed.slice(slash + 1).trim();
    var fuzzy_2 = resolveFuzzy({ provider: provider, fragment: fragment });
    if (fuzzy_2.selection || fuzzy_2.error) {
      return fuzzy_2;
    }
  }
  // Otherwise, try fuzzy matching across allowlisted models.
  var fuzzy = resolveFuzzy({ fragment: rawTrimmed });
  if (fuzzy.selection || fuzzy.error) {
    return fuzzy;
  }
  return {
    error: 'Model "'
      .concat(resolved.ref.provider, "/")
      .concat(
        resolved.ref.model,
        '" is not allowed. Use /models to list providers, or /models <provider> to list models.',
      ),
  };
}
function resolveContextTokens(params) {
  var _a, _b, _c;
  return (_c =
    (_b = (_a = params.agentCfg) === null || _a === void 0 ? void 0 : _a.contextTokens) !== null &&
    _b !== void 0
      ? _b
      : (0, context_js_1.lookupContextTokens)(params.model)) !== null && _c !== void 0
    ? _c
    : defaults_js_1.DEFAULT_CONTEXT_TOKENS;
}
