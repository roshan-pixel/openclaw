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
exports.handleModelsCommand = void 0;
exports.resolveModelsCommandReply = resolveModelsCommandReply;
var model_catalog_js_1 = require("../../agents/model-catalog.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var defaults_js_1 = require("../../agents/defaults.js");
var PAGE_SIZE_DEFAULT = 20;
var PAGE_SIZE_MAX = 100;
function formatProviderLine(params) {
  return "- ".concat(params.provider, " (").concat(params.count, ")");
}
function parseModelsArgs(raw) {
  var _a;
  var trimmed = raw.trim();
  if (!trimmed) {
    return { page: 1, pageSize: PAGE_SIZE_DEFAULT, all: false };
  }
  var tokens = trimmed.split(/\s+/g).filter(Boolean);
  var provider = (_a = tokens[0]) === null || _a === void 0 ? void 0 : _a.trim();
  var page = 1;
  var all = false;
  for (var _i = 0, _b = tokens.slice(1); _i < _b.length; _i++) {
    var token = _b[_i];
    var lower = token.toLowerCase();
    if (lower === "all" || lower === "--all") {
      all = true;
      continue;
    }
    if (lower.startsWith("page=")) {
      var value = Number.parseInt(lower.slice("page=".length), 10);
      if (Number.isFinite(value) && value > 0) {
        page = value;
      }
      continue;
    }
    if (/^[0-9]+$/.test(lower)) {
      var value = Number.parseInt(lower, 10);
      if (Number.isFinite(value) && value > 0) {
        page = value;
      }
    }
  }
  var pageSize = PAGE_SIZE_DEFAULT;
  for (var _c = 0, tokens_1 = tokens; _c < tokens_1.length; _c++) {
    var token = tokens_1[_c];
    var lower = token.toLowerCase();
    if (lower.startsWith("limit=") || lower.startsWith("size=")) {
      var rawValue = lower.slice(lower.indexOf("=") + 1);
      var value = Number.parseInt(rawValue, 10);
      if (Number.isFinite(value) && value > 0) {
        pageSize = Math.min(PAGE_SIZE_MAX, value);
      }
    }
  }
  return {
    provider: provider ? (0, model_selection_js_1.normalizeProviderId)(provider) : undefined,
    page: page,
    pageSize: pageSize,
    all: all,
  };
}
function resolveModelsCommandReply(params) {
  return __awaiter(this, void 0, void 0, function () {
    var body,
      argText,
      _a,
      provider,
      page,
      pageSize,
      all,
      resolvedDefault,
      catalog,
      allowed,
      aliasIndex,
      byProvider,
      add,
      addRawModelRef,
      addModelConfigEntries,
      _i,
      _b,
      entry,
      _c,
      _d,
      raw,
      providers,
      lines_1,
      lines_2,
      models,
      total,
      lines_3,
      effectivePageSize,
      pageCount,
      safePage,
      lines_4,
      startIndex,
      endIndexExclusive,
      pageModels,
      header,
      lines,
      _e,
      pageModels_1,
      id,
      payload;
    var _f, _g, _h, _j;
    return __generator(this, function (_k) {
      switch (_k.label) {
        case 0:
          body = params.commandBodyNormalized.trim();
          if (!body.startsWith("/models")) {
            return [2 /*return*/, null];
          }
          argText = body.replace(/^\/models\b/i, "").trim();
          ((_a = parseModelsArgs(argText)),
            (provider = _a.provider),
            (page = _a.page),
            (pageSize = _a.pageSize),
            (all = _a.all));
          resolvedDefault = (0, model_selection_js_1.resolveConfiguredModelRef)({
            cfg: params.cfg,
            defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
            defaultModel: defaults_js_1.DEFAULT_MODEL,
          });
          return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: params.cfg })];
        case 1:
          catalog = _k.sent();
          allowed = (0, model_selection_js_1.buildAllowedModelSet)({
            cfg: params.cfg,
            catalog: catalog,
            defaultProvider: resolvedDefault.provider,
            defaultModel: resolvedDefault.model,
          });
          aliasIndex = (0, model_selection_js_1.buildModelAliasIndex)({
            cfg: params.cfg,
            defaultProvider: resolvedDefault.provider,
          });
          byProvider = new Map();
          add = function (p, m) {
            var _a;
            var key = (0, model_selection_js_1.normalizeProviderId)(p);
            var set = (_a = byProvider.get(key)) !== null && _a !== void 0 ? _a : new Set();
            set.add(m);
            byProvider.set(key, set);
          };
          addRawModelRef = function (raw) {
            var trimmed = raw === null || raw === void 0 ? void 0 : raw.trim();
            if (!trimmed) {
              return;
            }
            var resolved = (0, model_selection_js_1.resolveModelRefFromString)({
              raw: trimmed,
              defaultProvider: resolvedDefault.provider,
              aliasIndex: aliasIndex,
            });
            if (!resolved) {
              return;
            }
            add(resolved.ref.provider, resolved.ref.model);
          };
          addModelConfigEntries = function () {
            var _a, _b, _c, _d, _e, _f;
            var modelConfig =
              (_b = (_a = params.cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) ===
                null || _b === void 0
                ? void 0
                : _b.model;
            if (typeof modelConfig === "string") {
              addRawModelRef(modelConfig);
            } else if (modelConfig && typeof modelConfig === "object") {
              addRawModelRef(modelConfig.primary);
              for (
                var _i = 0, _g = (_c = modelConfig.fallbacks) !== null && _c !== void 0 ? _c : [];
                _i < _g.length;
                _i++
              ) {
                var fallback = _g[_i];
                addRawModelRef(fallback);
              }
            }
            var imageConfig =
              (_e = (_d = params.cfg.agents) === null || _d === void 0 ? void 0 : _d.defaults) ===
                null || _e === void 0
                ? void 0
                : _e.imageModel;
            if (typeof imageConfig === "string") {
              addRawModelRef(imageConfig);
            } else if (imageConfig && typeof imageConfig === "object") {
              addRawModelRef(imageConfig.primary);
              for (
                var _h = 0, _j = (_f = imageConfig.fallbacks) !== null && _f !== void 0 ? _f : [];
                _h < _j.length;
                _h++
              ) {
                var fallback = _j[_h];
                addRawModelRef(fallback);
              }
            }
          };
          for (_i = 0, _b = allowed.allowedCatalog; _i < _b.length; _i++) {
            entry = _b[_i];
            add(entry.provider, entry.id);
          }
          // Include config-only allowlist keys that aren't in the curated catalog.
          for (
            _c = 0,
              _d = Object.keys(
                (_h =
                  (_g =
                    (_f = params.cfg.agents) === null || _f === void 0 ? void 0 : _f.defaults) ===
                    null || _g === void 0
                    ? void 0
                    : _g.models) !== null && _h !== void 0
                  ? _h
                  : {},
              );
            _c < _d.length;
            _c++
          ) {
            raw = _d[_c];
            addRawModelRef(raw);
          }
          // Ensure configured defaults/fallbacks/image models show up even when the
          // curated catalog doesn't know about them (custom providers, dev builds, etc.).
          add(resolvedDefault.provider, resolvedDefault.model);
          addModelConfigEntries();
          providers = __spreadArray([], byProvider.keys(), true).toSorted();
          if (!provider) {
            lines_1 = __spreadArray(
              __spreadArray(
                ["Providers:"],
                providers.map(function (p) {
                  var _a, _b;
                  return formatProviderLine({
                    provider: p,
                    count:
                      (_b =
                        (_a = byProvider.get(p)) === null || _a === void 0 ? void 0 : _a.size) !==
                        null && _b !== void 0
                        ? _b
                        : 0,
                  });
                }),
                true,
              ),
              ["", "Use: /models <provider>", "Switch: /model <provider/model>"],
              false,
            );
            return [2 /*return*/, { text: lines_1.join("\n") }];
          }
          if (!byProvider.has(provider)) {
            lines_2 = __spreadArray(
              __spreadArray(
                ["Unknown provider: ".concat(provider), "", "Available providers:"],
                providers.map(function (p) {
                  return "- ".concat(p);
                }),
                true,
              ),
              ["", "Use: /models <provider>"],
              false,
            );
            return [2 /*return*/, { text: lines_2.join("\n") }];
          }
          models = __spreadArray(
            [],
            (_j = byProvider.get(provider)) !== null && _j !== void 0 ? _j : new Set(),
            true,
          ).toSorted();
          total = models.length;
          if (total === 0) {
            lines_3 = [
              "Models (".concat(provider, ") \u2014 none"),
              "",
              "Browse: /models",
              "Switch: /model <provider/model>",
            ];
            return [2 /*return*/, { text: lines_3.join("\n") }];
          }
          effectivePageSize = all ? total : pageSize;
          pageCount = effectivePageSize > 0 ? Math.ceil(total / effectivePageSize) : 1;
          safePage = all ? 1 : Math.max(1, Math.min(page, pageCount));
          if (!all && page !== safePage) {
            lines_4 = [
              "Page out of range: ".concat(page, " (valid: 1-").concat(pageCount, ")"),
              "",
              "Try: /models ".concat(provider, " ").concat(safePage),
              "All: /models ".concat(provider, " all"),
            ];
            return [2 /*return*/, { text: lines_4.join("\n") }];
          }
          startIndex = (safePage - 1) * effectivePageSize;
          endIndexExclusive = Math.min(total, startIndex + effectivePageSize);
          pageModels = models.slice(startIndex, endIndexExclusive);
          header = "Models ("
            .concat(provider, ") \u2014 showing ")
            .concat(startIndex + 1, "-")
            .concat(endIndexExclusive, " of ")
            .concat(total, " (page ")
            .concat(safePage, "/")
            .concat(pageCount, ")");
          lines = [header];
          for (_e = 0, pageModels_1 = pageModels; _e < pageModels_1.length; _e++) {
            id = pageModels_1[_e];
            lines.push("- ".concat(provider, "/").concat(id));
          }
          lines.push("", "Switch: /model <provider/model>");
          if (!all && safePage < pageCount) {
            lines.push("More: /models ".concat(provider, " ").concat(safePage + 1));
          }
          if (!all) {
            lines.push("All: /models ".concat(provider, " all"));
          }
          payload = { text: lines.join("\n") };
          return [2 /*return*/, payload];
      }
    });
  });
}
var handleModelsCommand = function (params, allowTextCommands) {
  return __awaiter(void 0, void 0, void 0, function () {
    var reply;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!allowTextCommands) {
            return [2 /*return*/, null];
          }
          return [
            4 /*yield*/,
            resolveModelsCommandReply({
              cfg: params.cfg,
              commandBodyNormalized: params.command.commandBodyNormalized,
            }),
          ];
        case 1:
          reply = _a.sent();
          if (!reply) {
            return [2 /*return*/, null];
          }
          return [2 /*return*/, { reply: reply, shouldContinue: false }];
      }
    });
  });
};
exports.handleModelsCommand = handleModelsCommand;
