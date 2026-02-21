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
exports.maybeHandleModelDirectiveInfo = maybeHandleModelDirectiveInfo;
exports.resolveModelSelectionFromDirective = resolveModelSelectionFromDirective;
var auth_profiles_js_1 = require("../../agents/auth-profiles.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var utils_js_1 = require("../../utils.js");
var directive_handling_auth_js_1 = require("./directive-handling.auth.js");
var directive_handling_model_picker_js_1 = require("./directive-handling.model-picker.js");
var commands_models_js_1 = require("./commands-models.js");
var model_selection_js_2 = require("./model-selection.js");
function buildModelPickerCatalog(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  var resolvedDefault = (0, model_selection_js_1.resolveConfiguredModelRef)({
    cfg: params.cfg,
    defaultProvider: params.defaultProvider,
    defaultModel: params.defaultModel,
  });
  var buildConfiguredCatalog = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var out = [];
    var keys = new Set();
    var pushRef = function (ref, name) {
      var _a;
      var provider = (0, model_selection_js_1.normalizeProviderId)(ref.provider);
      var id = String((_a = ref.model) !== null && _a !== void 0 ? _a : "").trim();
      if (!provider || !id) {
        return;
      }
      var key = (0, model_selection_js_1.modelKey)(provider, id);
      if (keys.has(key)) {
        return;
      }
      keys.add(key);
      out.push({ provider: provider, id: id, name: name !== null && name !== void 0 ? name : id });
    };
    var pushRaw = function (raw) {
      var value = String(raw !== null && raw !== void 0 ? raw : "").trim();
      if (!value) {
        return;
      }
      var resolved = (0, model_selection_js_1.resolveModelRefFromString)({
        raw: value,
        defaultProvider: params.defaultProvider,
        aliasIndex: params.aliasIndex,
      });
      if (!resolved) {
        return;
      }
      pushRef(resolved.ref);
    };
    pushRef(resolvedDefault);
    var modelConfig =
      (_b = (_a = params.cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null ||
      _b === void 0
        ? void 0
        : _b.model;
    var modelFallbacks =
      modelConfig && typeof modelConfig === "object"
        ? (_c = modelConfig.fallbacks) !== null && _c !== void 0
          ? _c
          : []
        : [];
    for (var _i = 0, modelFallbacks_1 = modelFallbacks; _i < modelFallbacks_1.length; _i++) {
      var fallback = modelFallbacks_1[_i];
      pushRaw(String(fallback !== null && fallback !== void 0 ? fallback : ""));
    }
    var imageConfig =
      (_e = (_d = params.cfg.agents) === null || _d === void 0 ? void 0 : _d.defaults) === null ||
      _e === void 0
        ? void 0
        : _e.imageModel;
    if (imageConfig && typeof imageConfig === "object") {
      pushRaw(imageConfig.primary);
      for (
        var _k = 0, _l = (_f = imageConfig.fallbacks) !== null && _f !== void 0 ? _f : [];
        _k < _l.length;
        _k++
      ) {
        var fallback = _l[_k];
        pushRaw(String(fallback !== null && fallback !== void 0 ? fallback : ""));
      }
    }
    for (
      var _m = 0,
        _o = Object.keys(
          (_j =
            (_h = (_g = params.cfg.agents) === null || _g === void 0 ? void 0 : _g.defaults) ===
              null || _h === void 0
              ? void 0
              : _h.models) !== null && _j !== void 0
            ? _j
            : {},
        );
      _m < _o.length;
      _m++
    ) {
      var raw = _o[_m];
      pushRaw(raw);
    }
    return out;
  };
  var keys = new Set();
  var out = [];
  var push = function (entry) {
    var _a;
    var provider = (0, model_selection_js_1.normalizeProviderId)(entry.provider);
    var id = String((_a = entry.id) !== null && _a !== void 0 ? _a : "").trim();
    if (!provider || !id) {
      return;
    }
    var key = (0, model_selection_js_1.modelKey)(provider, id);
    if (keys.has(key)) {
      return;
    }
    keys.add(key);
    out.push({ provider: provider, id: id, name: entry.name });
  };
  var hasAllowlist =
    Object.keys(
      (_c =
        (_b = (_a = params.cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null ||
        _b === void 0
          ? void 0
          : _b.models) !== null && _c !== void 0
        ? _c
        : {},
    ).length > 0;
  if (!hasAllowlist) {
    for (var _i = 0, _j = params.allowedModelCatalog; _i < _j.length; _i++) {
      var entry = _j[_i];
      push({
        provider: entry.provider,
        id: (_d = entry.id) !== null && _d !== void 0 ? _d : "",
        name: entry.name,
      });
    }
    for (var _k = 0, _l = buildConfiguredCatalog(); _k < _l.length; _k++) {
      var entry = _l[_k];
      push(entry);
    }
    return out;
  }
  // Prefer catalog entries (when available), but always merge in config-only
  // allowlist entries. This keeps custom providers/models visible in /model.
  for (var _m = 0, _o = params.allowedModelCatalog; _m < _o.length; _m++) {
    var entry = _o[_m];
    push({
      provider: entry.provider,
      id: (_e = entry.id) !== null && _e !== void 0 ? _e : "",
      name: entry.name,
    });
  }
  // Merge any configured allowlist keys that the catalog doesn't know about.
  for (
    var _p = 0,
      _q = Object.keys(
        (_h =
          (_g = (_f = params.cfg.agents) === null || _f === void 0 ? void 0 : _f.defaults) ===
            null || _g === void 0
            ? void 0
            : _g.models) !== null && _h !== void 0
          ? _h
          : {},
      );
    _p < _q.length;
    _p++
  ) {
    var raw = _q[_p];
    var resolved = (0, model_selection_js_1.resolveModelRefFromString)({
      raw: String(raw),
      defaultProvider: params.defaultProvider,
      aliasIndex: params.aliasIndex,
    });
    if (!resolved) {
      continue;
    }
    push({
      provider: resolved.ref.provider,
      id: resolved.ref.model,
      name: resolved.ref.model,
    });
  }
  // Ensure the configured default is always present (even when no allowlist).
  if (resolvedDefault.model) {
    push({
      provider: resolvedDefault.provider,
      id: resolvedDefault.model,
      name: resolvedDefault.model,
    });
  }
  return out;
}
function maybeHandleModelDirectiveInfo(params) {
  return __awaiter(this, void 0, void 0, function () {
    var rawDirective,
      directive,
      wantsStatus,
      wantsSummary,
      wantsLegacyList,
      pickerCatalog,
      reply,
      current_1,
      modelsPath,
      formatPath,
      authMode,
      authByProvider,
      _i,
      pickerCatalog_1,
      entry,
      provider,
      auth,
      current,
      defaultLabel,
      lines,
      byProvider,
      _a,
      pickerCatalog_2,
      entry,
      provider,
      models,
      _b,
      _c,
      provider,
      models,
      authLabel,
      endpoint,
      endpointSuffix,
      apiSuffix,
      _d,
      models_1,
      entry,
      label,
      aliases,
      aliasSuffix;
    var _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          if (!params.directives.hasModelDirective) {
            return [2 /*return*/, undefined];
          }
          rawDirective =
            (_e = params.directives.rawModelDirective) === null || _e === void 0
              ? void 0
              : _e.trim();
          directive =
            rawDirective === null || rawDirective === void 0 ? void 0 : rawDirective.toLowerCase();
          wantsStatus = directive === "status";
          wantsSummary = !rawDirective;
          wantsLegacyList = directive === "list";
          if (!wantsSummary && !wantsStatus && !wantsLegacyList) {
            return [2 /*return*/, undefined];
          }
          if (params.directives.rawModelProfile) {
            return [2 /*return*/, { text: "Auth profile override requires a model selection." }];
          }
          pickerCatalog = buildModelPickerCatalog({
            cfg: params.cfg,
            defaultProvider: params.defaultProvider,
            defaultModel: params.defaultModel,
            aliasIndex: params.aliasIndex,
            allowedModelCatalog: params.allowedModelCatalog,
          });
          if (!wantsLegacyList) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, commands_models_js_1.resolveModelsCommandReply)({
              cfg: params.cfg,
              commandBodyNormalized: "/models",
            }),
          ];
        case 1:
          reply = _g.sent();
          return [
            2 /*return*/,
            reply !== null && reply !== void 0 ? reply : { text: "No models available." },
          ];
        case 2:
          if (wantsSummary) {
            current_1 = "".concat(params.provider, "/").concat(params.model);
            return [
              2 /*return*/,
              {
                text: [
                  "Current: ".concat(current_1),
                  "",
                  "Switch: /model <provider/model>",
                  "Browse: /models (providers) or /models <provider> (models)",
                  "More: /model status",
                ].join("\n"),
              },
            ];
          }
          modelsPath = "".concat(params.agentDir, "/models.json");
          formatPath = function (value) {
            return (0, utils_js_1.shortenHomePath)(value);
          };
          authMode = "verbose";
          if (pickerCatalog.length === 0) {
            return [2 /*return*/, { text: "No models available." }];
          }
          authByProvider = new Map();
          ((_i = 0), (pickerCatalog_1 = pickerCatalog));
          _g.label = 3;
        case 3:
          if (!(_i < pickerCatalog_1.length)) {
            return [3 /*break*/, 6];
          }
          entry = pickerCatalog_1[_i];
          provider = (0, model_selection_js_1.normalizeProviderId)(entry.provider);
          if (authByProvider.has(provider)) {
            return [3 /*break*/, 5];
          }
          return [
            4 /*yield*/,
            (0, directive_handling_auth_js_1.resolveAuthLabel)(
              provider,
              params.cfg,
              modelsPath,
              params.agentDir,
              authMode,
            ),
          ];
        case 4:
          auth = _g.sent();
          authByProvider.set(provider, (0, directive_handling_auth_js_1.formatAuthLabel)(auth));
          _g.label = 5;
        case 5:
          _i++;
          return [3 /*break*/, 3];
        case 6:
          current = "".concat(params.provider, "/").concat(params.model);
          defaultLabel = "".concat(params.defaultProvider, "/").concat(params.defaultModel);
          lines = [
            "Current: ".concat(current),
            "Default: ".concat(defaultLabel),
            "Agent: ".concat(params.activeAgentId),
            "Auth file: ".concat(
              formatPath((0, auth_profiles_js_1.resolveAuthStorePathForDisplay)(params.agentDir)),
            ),
          ];
          if (params.resetModelOverride) {
            lines.push("(previous selection reset to default)");
          }
          byProvider = new Map();
          for (_a = 0, pickerCatalog_2 = pickerCatalog; _a < pickerCatalog_2.length; _a++) {
            entry = pickerCatalog_2[_a];
            provider = (0, model_selection_js_1.normalizeProviderId)(entry.provider);
            models = byProvider.get(provider);
            if (models) {
              models.push(entry);
              continue;
            }
            byProvider.set(provider, [entry]);
          }
          for (_b = 0, _c = byProvider.keys(); _b < _c.length; _b++) {
            provider = _c[_b];
            models = byProvider.get(provider);
            if (!models) {
              continue;
            }
            authLabel =
              (_f = authByProvider.get(provider)) !== null && _f !== void 0 ? _f : "missing";
            endpoint = (0, directive_handling_model_picker_js_1.resolveProviderEndpointLabel)(
              provider,
              params.cfg,
            );
            endpointSuffix = endpoint.endpoint
              ? " endpoint: ".concat(endpoint.endpoint)
              : " endpoint: default";
            apiSuffix = endpoint.api ? " api: ".concat(endpoint.api) : "";
            lines.push("");
            lines.push(
              "["
                .concat(provider, "]")
                .concat(endpointSuffix)
                .concat(apiSuffix, " auth: ")
                .concat(authLabel),
            );
            for (_d = 0, models_1 = models; _d < models_1.length; _d++) {
              entry = models_1[_d];
              label = "".concat(provider, "/").concat(entry.id);
              aliases = params.aliasIndex.byKey.get(label);
              aliasSuffix =
                aliases && aliases.length > 0 ? " (".concat(aliases.join(", "), ")") : "";
              lines.push("  \u2022 ".concat(label).concat(aliasSuffix));
            }
          }
          return [2 /*return*/, { text: lines.join("\n") }];
      }
    });
  });
}
function resolveModelSelectionFromDirective(params) {
  if (!params.directives.hasModelDirective || !params.directives.rawModelDirective) {
    if (params.directives.rawModelProfile) {
      return { errorText: "Auth profile override requires a model selection." };
    }
    return {};
  }
  var raw = params.directives.rawModelDirective.trim();
  var modelSelection;
  if (/^[0-9]+$/.test(raw)) {
    return {
      errorText: [
        "Numeric model selection is not supported in chat.",
        "",
        "Browse: /models or /models <provider>",
        "Switch: /model <provider/model>",
      ].join("\n"),
    };
  }
  var explicit = (0, model_selection_js_1.resolveModelRefFromString)({
    raw: raw,
    defaultProvider: params.defaultProvider,
    aliasIndex: params.aliasIndex,
  });
  if (explicit) {
    var explicitKey = (0, model_selection_js_1.modelKey)(explicit.ref.provider, explicit.ref.model);
    if (params.allowedModelKeys.size === 0 || params.allowedModelKeys.has(explicitKey)) {
      modelSelection = __assign(
        {
          provider: explicit.ref.provider,
          model: explicit.ref.model,
          isDefault:
            explicit.ref.provider === params.defaultProvider &&
            explicit.ref.model === params.defaultModel,
        },
        explicit.alias ? { alias: explicit.alias } : {},
      );
    }
  }
  if (!modelSelection) {
    var resolved = (0, model_selection_js_2.resolveModelDirectiveSelection)({
      raw: raw,
      defaultProvider: params.defaultProvider,
      defaultModel: params.defaultModel,
      aliasIndex: params.aliasIndex,
      allowedModelKeys: params.allowedModelKeys,
    });
    if (resolved.error) {
      return { errorText: resolved.error };
    }
    if (resolved.selection) {
      modelSelection = resolved.selection;
    }
  }
  var profileOverride;
  if (modelSelection && params.directives.rawModelProfile) {
    var profileResolved = (0, directive_handling_auth_js_1.resolveProfileOverride)({
      rawProfile: params.directives.rawModelProfile,
      provider: modelSelection.provider,
      cfg: params.cfg,
      agentDir: params.agentDir,
    });
    if (profileResolved.error) {
      return { errorText: profileResolved.error };
    }
    profileOverride = profileResolved.profileId;
  }
  return { modelSelection: modelSelection, profileOverride: profileOverride };
}
