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
exports.resetModelCatalogCacheForTest = resetModelCatalogCacheForTest;
exports.__setModelCatalogImportForTest = __setModelCatalogImportForTest;
exports.loadModelCatalog = loadModelCatalog;
exports.modelSupportsVision = modelSupportsVision;
exports.findModelInCatalog = findModelInCatalog;
var config_js_1 = require("../config/config.js");
var agent_paths_js_1 = require("./agent-paths.js");
var models_config_js_1 = require("./models-config.js");
var modelCatalogPromise = null;
var hasLoggedModelCatalogError = false;
var defaultImportPiSdk = function () {
  return Promise.resolve().then(function () {
    return require("@mariozechner/pi-coding-agent");
  });
};
var importPiSdk = defaultImportPiSdk;
function resetModelCatalogCacheForTest() {
  modelCatalogPromise = null;
  hasLoggedModelCatalogError = false;
  importPiSdk = defaultImportPiSdk;
}
// Test-only escape hatch: allow mocking the dynamic import to simulate transient failures.
function __setModelCatalogImportForTest(loader) {
  importPiSdk = loader !== null && loader !== void 0 ? loader : defaultImportPiSdk;
}
function loadModelCatalog(params) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      if ((params === null || params === void 0 ? void 0 : params.useCache) === false) {
        modelCatalogPromise = null;
      }
      if (modelCatalogPromise) {
        return [2 /*return*/, modelCatalogPromise];
      }
      modelCatalogPromise = (function () {
        return __awaiter(_this, void 0, void 0, function () {
          var models,
            sortModels,
            cfg,
            piSdk,
            agentDir,
            authStorage,
            registry,
            entries,
            _i,
            entries_1,
            entry,
            id,
            provider,
            name_1,
            contextWindow,
            reasoning,
            input,
            error_1;
          var _a, _b, _c, _d;
          return __generator(this, function (_e) {
            switch (_e.label) {
              case 0:
                models = [];
                sortModels = function (entries) {
                  return entries.toSorted(function (a, b) {
                    var p = a.provider.localeCompare(b.provider);
                    if (p !== 0) {
                      return p;
                    }
                    return a.name.localeCompare(b.name);
                  });
                };
                _e.label = 1;
              case 1:
                _e.trys.push([1, 4, , 5]);
                cfg =
                  (_a = params === null || params === void 0 ? void 0 : params.config) !== null &&
                  _a !== void 0
                    ? _a
                    : (0, config_js_1.loadConfig)();
                return [4 /*yield*/, (0, models_config_js_1.ensureOpenClawModelsJson)(cfg)];
              case 2:
                _e.sent();
                return [4 /*yield*/, importPiSdk()];
              case 3:
                piSdk = _e.sent();
                agentDir = (0, agent_paths_js_1.resolveOpenClawAgentDir)();
                authStorage = piSdk.discoverAuthStorage(agentDir);
                registry = piSdk.discoverModels(authStorage, agentDir);
                entries = Array.isArray(registry) ? registry : registry.getAll();
                for (_i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                  entry = entries_1[_i];
                  id = String(
                    (_b = entry === null || entry === void 0 ? void 0 : entry.id) !== null &&
                      _b !== void 0
                      ? _b
                      : "",
                  ).trim();
                  if (!id) {
                    continue;
                  }
                  provider = String(
                    (_c = entry === null || entry === void 0 ? void 0 : entry.provider) !== null &&
                      _c !== void 0
                      ? _c
                      : "",
                  ).trim();
                  if (!provider) {
                    continue;
                  }
                  name_1 =
                    String(
                      (_d = entry === null || entry === void 0 ? void 0 : entry.name) !== null &&
                        _d !== void 0
                        ? _d
                        : id,
                    ).trim() || id;
                  contextWindow =
                    typeof (entry === null || entry === void 0 ? void 0 : entry.contextWindow) ===
                      "number" && entry.contextWindow > 0
                      ? entry.contextWindow
                      : undefined;
                  reasoning =
                    typeof (entry === null || entry === void 0 ? void 0 : entry.reasoning) ===
                    "boolean"
                      ? entry.reasoning
                      : undefined;
                  input = Array.isArray(entry === null || entry === void 0 ? void 0 : entry.input)
                    ? entry.input
                    : undefined;
                  models.push({
                    id: id,
                    name: name_1,
                    provider: provider,
                    contextWindow: contextWindow,
                    reasoning: reasoning,
                    input: input,
                  });
                }
                if (models.length === 0) {
                  // If we found nothing, don't cache this result so we can try again.
                  modelCatalogPromise = null;
                }
                return [2 /*return*/, sortModels(models)];
              case 4:
                error_1 = _e.sent();
                if (!hasLoggedModelCatalogError) {
                  hasLoggedModelCatalogError = true;
                  console.warn(
                    "[model-catalog] Failed to load model catalog: ".concat(String(error_1)),
                  );
                }
                // Don't poison the cache on transient dependency/filesystem issues.
                modelCatalogPromise = null;
                if (models.length > 0) {
                  return [2 /*return*/, sortModels(models)];
                }
                return [2 /*return*/, []];
              case 5:
                return [2 /*return*/];
            }
          });
        });
      })();
      return [2 /*return*/, modelCatalogPromise];
    });
  });
}
/**
 * Check if a model supports image input based on its catalog entry.
 */
function modelSupportsVision(entry) {
  var _a, _b;
  return (_b =
    (_a = entry === null || entry === void 0 ? void 0 : entry.input) === null || _a === void 0
      ? void 0
      : _a.includes("image")) !== null && _b !== void 0
    ? _b
    : false;
}
/**
 * Find a model in the catalog by provider and model ID.
 */
function findModelInCatalog(catalog, provider, modelId) {
  var normalizedProvider = provider.toLowerCase().trim();
  var normalizedModelId = modelId.toLowerCase().trim();
  return catalog.find(function (entry) {
    return (
      entry.provider.toLowerCase() === normalizedProvider &&
      entry.id.toLowerCase() === normalizedModelId
    );
  });
}
