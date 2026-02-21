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
exports.runWithModelFallback = runWithModelFallback;
exports.runWithImageModelFallback = runWithImageModelFallback;
var defaults_js_1 = require("./defaults.js");
var failover_error_js_1 = require("./failover-error.js");
var model_selection_js_1 = require("./model-selection.js");
var auth_profiles_js_1 = require("./auth-profiles.js");
function isAbortError(err) {
  if (!err || typeof err !== "object") {
    return false;
  }
  if ((0, failover_error_js_1.isFailoverError)(err)) {
    return false;
  }
  var name = "name" in err ? String(err.name) : "";
  // Only treat explicit AbortError names as user aborts.
  // Message-based checks (e.g., "aborted") can mask timeouts and skip fallback.
  return name === "AbortError";
}
function shouldRethrowAbort(err) {
  return isAbortError(err) && !(0, failover_error_js_1.isTimeoutError)(err);
}
function buildAllowedModelKeys(cfg, defaultProvider) {
  var rawAllowlist = (function () {
    var _a, _b, _c;
    var modelMap =
      (_c =
        (_b =
          (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0
            ? void 0
            : _a.defaults) === null || _b === void 0
          ? void 0
          : _b.models) !== null && _c !== void 0
        ? _c
        : {};
    return Object.keys(modelMap);
  })();
  if (rawAllowlist.length === 0) {
    return null;
  }
  var keys = new Set();
  for (var _i = 0, rawAllowlist_1 = rawAllowlist; _i < rawAllowlist_1.length; _i++) {
    var raw = rawAllowlist_1[_i];
    var parsed = (0, model_selection_js_1.parseModelRef)(
      String(raw !== null && raw !== void 0 ? raw : ""),
      defaultProvider,
    );
    if (!parsed) {
      continue;
    }
    keys.add((0, model_selection_js_1.modelKey)(parsed.provider, parsed.model));
  }
  return keys.size > 0 ? keys : null;
}
function resolveImageFallbackCandidates(params) {
  var _a, _b, _c, _d, _e;
  var aliasIndex = (0, model_selection_js_1.buildModelAliasIndex)({
    cfg: (_a = params.cfg) !== null && _a !== void 0 ? _a : {},
    defaultProvider: params.defaultProvider,
  });
  var allowlist = buildAllowedModelKeys(params.cfg, params.defaultProvider);
  var seen = new Set();
  var candidates = [];
  var addCandidate = function (candidate, enforceAllowlist) {
    if (!candidate.provider || !candidate.model) {
      return;
    }
    var key = (0, model_selection_js_1.modelKey)(candidate.provider, candidate.model);
    if (seen.has(key)) {
      return;
    }
    if (enforceAllowlist && allowlist && !allowlist.has(key)) {
      return;
    }
    seen.add(key);
    candidates.push(candidate);
  };
  var addRaw = function (raw, enforceAllowlist) {
    var resolved = (0, model_selection_js_1.resolveModelRefFromString)({
      raw: String(raw !== null && raw !== void 0 ? raw : ""),
      defaultProvider: params.defaultProvider,
      aliasIndex: aliasIndex,
    });
    if (!resolved) {
      return;
    }
    addCandidate(resolved.ref, enforceAllowlist);
  };
  if ((_b = params.modelOverride) === null || _b === void 0 ? void 0 : _b.trim()) {
    addRaw(params.modelOverride, false);
  } else {
    var imageModel =
      (_e =
        (_d = (_c = params.cfg) === null || _c === void 0 ? void 0 : _c.agents) === null ||
        _d === void 0
          ? void 0
          : _d.defaults) === null || _e === void 0
        ? void 0
        : _e.imageModel;
    var primary =
      typeof imageModel === "string"
        ? imageModel.trim()
        : imageModel === null || imageModel === void 0
          ? void 0
          : imageModel.primary;
    if (primary === null || primary === void 0 ? void 0 : primary.trim()) {
      addRaw(primary, false);
    }
  }
  var imageFallbacks = (function () {
    var _a, _b, _c, _d;
    var imageModel =
      (_c =
        (_b = (_a = params.cfg) === null || _a === void 0 ? void 0 : _a.agents) === null ||
        _b === void 0
          ? void 0
          : _b.defaults) === null || _c === void 0
        ? void 0
        : _c.imageModel;
    if (imageModel && typeof imageModel === "object") {
      return (_d = imageModel.fallbacks) !== null && _d !== void 0 ? _d : [];
    }
    return [];
  })();
  for (var _i = 0, imageFallbacks_1 = imageFallbacks; _i < imageFallbacks_1.length; _i++) {
    var raw = imageFallbacks_1[_i];
    addRaw(raw, true);
  }
  return candidates;
}
function resolveFallbackCandidates(params) {
  var _a, _b, _c, _d, _e;
  var primary = params.cfg
    ? (0, model_selection_js_1.resolveConfiguredModelRef)({
        cfg: params.cfg,
        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
        defaultModel: defaults_js_1.DEFAULT_MODEL,
      })
    : null;
  var defaultProvider =
    (_a = primary === null || primary === void 0 ? void 0 : primary.provider) !== null &&
    _a !== void 0
      ? _a
      : defaults_js_1.DEFAULT_PROVIDER;
  var defaultModel =
    (_b = primary === null || primary === void 0 ? void 0 : primary.model) !== null && _b !== void 0
      ? _b
      : defaults_js_1.DEFAULT_MODEL;
  var provider =
    String((_c = params.provider) !== null && _c !== void 0 ? _c : "").trim() || defaultProvider;
  var model =
    String((_d = params.model) !== null && _d !== void 0 ? _d : "").trim() || defaultModel;
  var aliasIndex = (0, model_selection_js_1.buildModelAliasIndex)({
    cfg: (_e = params.cfg) !== null && _e !== void 0 ? _e : {},
    defaultProvider: defaultProvider,
  });
  var allowlist = buildAllowedModelKeys(params.cfg, defaultProvider);
  var seen = new Set();
  var candidates = [];
  var addCandidate = function (candidate, enforceAllowlist) {
    if (!candidate.provider || !candidate.model) {
      return;
    }
    var key = (0, model_selection_js_1.modelKey)(candidate.provider, candidate.model);
    if (seen.has(key)) {
      return;
    }
    if (enforceAllowlist && allowlist && !allowlist.has(key)) {
      return;
    }
    seen.add(key);
    candidates.push(candidate);
  };
  addCandidate({ provider: provider, model: model }, false);
  var modelFallbacks = (function () {
    var _a, _b, _c, _d;
    if (params.fallbacksOverride !== undefined) {
      return params.fallbacksOverride;
    }
    var model =
      (_c =
        (_b = (_a = params.cfg) === null || _a === void 0 ? void 0 : _a.agents) === null ||
        _b === void 0
          ? void 0
          : _b.defaults) === null || _c === void 0
        ? void 0
        : _c.model;
    if (model && typeof model === "object") {
      return (_d = model.fallbacks) !== null && _d !== void 0 ? _d : [];
    }
    return [];
  })();
  for (var _i = 0, modelFallbacks_1 = modelFallbacks; _i < modelFallbacks_1.length; _i++) {
    var raw = modelFallbacks_1[_i];
    var resolved = (0, model_selection_js_1.resolveModelRefFromString)({
      raw: String(raw !== null && raw !== void 0 ? raw : ""),
      defaultProvider: defaultProvider,
      aliasIndex: aliasIndex,
    });
    if (!resolved) {
      continue;
    }
    addCandidate(resolved.ref, true);
  }
  if (
    params.fallbacksOverride === undefined &&
    (primary === null || primary === void 0 ? void 0 : primary.provider) &&
    primary.model
  ) {
    addCandidate({ provider: primary.provider, model: primary.model }, false);
  }
  return candidates;
}
function runWithModelFallback(params) {
  return __awaiter(this, void 0, void 0, function () {
    var candidates,
      authStore,
      attempts,
      lastError,
      i,
      candidate,
      profileIds,
      isAnyProfileAvailable,
      result,
      err_1,
      normalized,
      described,
      summary;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          candidates = resolveFallbackCandidates({
            cfg: params.cfg,
            provider: params.provider,
            model: params.model,
            fallbacksOverride: params.fallbacksOverride,
          });
          authStore = params.cfg
            ? (0, auth_profiles_js_1.ensureAuthProfileStore)(params.agentDir, {
                allowKeychainPrompt: false,
              })
            : null;
          attempts = [];
          i = 0;
          _c.label = 1;
        case 1:
          if (!(i < candidates.length)) {
            return [3 /*break*/, 7];
          }
          candidate = candidates[i];
          if (authStore) {
            profileIds = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
              cfg: params.cfg,
              store: authStore,
              provider: candidate.provider,
            });
            isAnyProfileAvailable = profileIds.some(function (id) {
              return !(0, auth_profiles_js_1.isProfileInCooldown)(authStore, id);
            });
            if (profileIds.length > 0 && !isAnyProfileAvailable) {
              // All profiles for this provider are in cooldown; skip without attempting
              attempts.push({
                provider: candidate.provider,
                model: candidate.model,
                error: "Provider ".concat(
                  candidate.provider,
                  " is in cooldown (all profiles unavailable)",
                ),
                reason: "rate_limit",
              });
              return [3 /*break*/, 6];
            }
          }
          _c.label = 2;
        case 2:
          _c.trys.push([2, 4, , 6]);
          return [4 /*yield*/, params.run(candidate.provider, candidate.model)];
        case 3:
          result = _c.sent();
          return [
            2 /*return*/,
            {
              result: result,
              provider: candidate.provider,
              model: candidate.model,
              attempts: attempts,
            },
          ];
        case 4:
          err_1 = _c.sent();
          if (shouldRethrowAbort(err_1)) {
            throw err_1;
          }
          normalized =
            (_a = (0, failover_error_js_1.coerceToFailoverError)(err_1, {
              provider: candidate.provider,
              model: candidate.model,
            })) !== null && _a !== void 0
              ? _a
              : err_1;
          if (!(0, failover_error_js_1.isFailoverError)(normalized)) {
            throw err_1;
          }
          lastError = normalized;
          described = (0, failover_error_js_1.describeFailoverError)(normalized);
          attempts.push({
            provider: candidate.provider,
            model: candidate.model,
            error: described.message,
            reason: described.reason,
            status: described.status,
            code: described.code,
          });
          return [
            4 /*yield*/,
            (_b = params.onError) === null || _b === void 0
              ? void 0
              : _b.call(params, {
                  provider: candidate.provider,
                  model: candidate.model,
                  error: normalized,
                  attempt: i + 1,
                  total: candidates.length,
                }),
          ];
        case 5:
          _c.sent();
          return [3 /*break*/, 6];
        case 6:
          i += 1;
          return [3 /*break*/, 1];
        case 7:
          if (attempts.length <= 1 && lastError) {
            throw lastError;
          }
          summary =
            attempts.length > 0
              ? attempts
                  .map(function (attempt) {
                    return ""
                      .concat(attempt.provider, "/")
                      .concat(attempt.model, ": ")
                      .concat(attempt.error)
                      .concat(attempt.reason ? " (".concat(attempt.reason, ")") : "");
                  })
                  .join(" | ")
              : "unknown";
          throw new Error(
            "All models failed ("
              .concat(attempts.length || candidates.length, "): ")
              .concat(summary),
            {
              cause: lastError instanceof Error ? lastError : undefined,
            },
          );
      }
    });
  });
}
function runWithImageModelFallback(params) {
  return __awaiter(this, void 0, void 0, function () {
    var candidates, attempts, lastError, i, candidate, result, err_2, summary;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          candidates = resolveImageFallbackCandidates({
            cfg: params.cfg,
            defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
            modelOverride: params.modelOverride,
          });
          if (candidates.length === 0) {
            throw new Error(
              "No image model configured. Set agents.defaults.imageModel.primary or agents.defaults.imageModel.fallbacks.",
            );
          }
          attempts = [];
          i = 0;
          _b.label = 1;
        case 1:
          if (!(i < candidates.length)) {
            return [3 /*break*/, 7];
          }
          candidate = candidates[i];
          _b.label = 2;
        case 2:
          _b.trys.push([2, 4, , 6]);
          return [4 /*yield*/, params.run(candidate.provider, candidate.model)];
        case 3:
          result = _b.sent();
          return [
            2 /*return*/,
            {
              result: result,
              provider: candidate.provider,
              model: candidate.model,
              attempts: attempts,
            },
          ];
        case 4:
          err_2 = _b.sent();
          if (shouldRethrowAbort(err_2)) {
            throw err_2;
          }
          lastError = err_2;
          attempts.push({
            provider: candidate.provider,
            model: candidate.model,
            error: err_2 instanceof Error ? err_2.message : String(err_2),
          });
          return [
            4 /*yield*/,
            (_a = params.onError) === null || _a === void 0
              ? void 0
              : _a.call(params, {
                  provider: candidate.provider,
                  model: candidate.model,
                  error: err_2,
                  attempt: i + 1,
                  total: candidates.length,
                }),
          ];
        case 5:
          _b.sent();
          return [3 /*break*/, 6];
        case 6:
          i += 1;
          return [3 /*break*/, 1];
        case 7:
          if (attempts.length <= 1 && lastError) {
            throw lastError;
          }
          summary =
            attempts.length > 0
              ? attempts
                  .map(function (attempt) {
                    return ""
                      .concat(attempt.provider, "/")
                      .concat(attempt.model, ": ")
                      .concat(attempt.error);
                  })
                  .join(" | ")
              : "unknown";
          throw new Error(
            "All image models failed ("
              .concat(attempts.length || candidates.length, "): ")
              .concat(summary),
            {
              cause: lastError instanceof Error ? lastError : undefined,
            },
          );
      }
    });
  });
}
