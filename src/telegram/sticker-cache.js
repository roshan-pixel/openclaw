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
exports.getCachedSticker = getCachedSticker;
exports.cacheSticker = cacheSticker;
exports.searchStickers = searchStickers;
exports.getAllCachedStickers = getAllCachedStickers;
exports.getCacheStats = getCacheStats;
exports.describeStickerImage = describeStickerImage;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var paths_js_1 = require("../config/paths.js");
var json_file_js_1 = require("../infra/json-file.js");
var globals_js_1 = require("../globals.js");
var model_catalog_js_1 = require("../agents/model-catalog.js");
var model_auth_js_1 = require("../agents/model-auth.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var runner_js_1 = require("../media-understanding/runner.js");
var CACHE_FILE = node_path_1.default.join(paths_js_1.STATE_DIR, "telegram", "sticker-cache.json");
var CACHE_VERSION = 1;
function loadCache() {
  var data = (0, json_file_js_1.loadJsonFile)(CACHE_FILE);
  if (!data || typeof data !== "object") {
    return { version: CACHE_VERSION, stickers: {} };
  }
  var cache = data;
  if (cache.version !== CACHE_VERSION) {
    // Future: handle migration if needed
    return { version: CACHE_VERSION, stickers: {} };
  }
  return cache;
}
function saveCache(cache) {
  (0, json_file_js_1.saveJsonFile)(CACHE_FILE, cache);
}
/**
 * Get a cached sticker by its unique ID.
 */
function getCachedSticker(fileUniqueId) {
  var _a;
  var cache = loadCache();
  return (_a = cache.stickers[fileUniqueId]) !== null && _a !== void 0 ? _a : null;
}
/**
 * Add or update a sticker in the cache.
 */
function cacheSticker(sticker) {
  var cache = loadCache();
  cache.stickers[sticker.fileUniqueId] = sticker;
  saveCache(cache);
}
/**
 * Search cached stickers by text query (fuzzy match on description + emoji + setName).
 */
function searchStickers(query, limit) {
  var _a;
  if (limit === void 0) {
    limit = 10;
  }
  var cache = loadCache();
  var queryLower = query.toLowerCase();
  var results = [];
  for (var _i = 0, _b = Object.values(cache.stickers); _i < _b.length; _i++) {
    var sticker = _b[_i];
    var score = 0;
    var descLower = sticker.description.toLowerCase();
    // Exact substring match in description
    if (descLower.includes(queryLower)) {
      score += 10;
    }
    // Word-level matching
    var queryWords = queryLower.split(/\s+/).filter(Boolean);
    var descWords = descLower.split(/\s+/);
    var _loop_1 = function (qWord) {
      if (
        descWords.some(function (dWord) {
          return dWord.includes(qWord);
        })
      ) {
        score += 5;
      }
    };
    for (var _c = 0, queryWords_1 = queryWords; _c < queryWords_1.length; _c++) {
      var qWord = queryWords_1[_c];
      _loop_1(qWord);
    }
    // Emoji match
    if (sticker.emoji && query.includes(sticker.emoji)) {
      score += 8;
    }
    // Set name match
    if (
      (_a = sticker.setName) === null || _a === void 0
        ? void 0
        : _a.toLowerCase().includes(queryLower)
    ) {
      score += 3;
    }
    if (score > 0) {
      results.push({ sticker: sticker, score: score });
    }
  }
  return results
    .toSorted(function (a, b) {
      return b.score - a.score;
    })
    .slice(0, limit)
    .map(function (r) {
      return r.sticker;
    });
}
/**
 * Get all cached stickers (for debugging/listing).
 */
function getAllCachedStickers() {
  var cache = loadCache();
  return Object.values(cache.stickers);
}
/**
 * Get cache statistics.
 */
function getCacheStats() {
  var _a, _b;
  var cache = loadCache();
  var stickers = Object.values(cache.stickers);
  if (stickers.length === 0) {
    return { count: 0 };
  }
  var sorted = __spreadArray([], stickers, true).toSorted(function (a, b) {
    return new Date(a.cachedAt).getTime() - new Date(b.cachedAt).getTime();
  });
  return {
    count: stickers.length,
    oldestAt: (_a = sorted[0]) === null || _a === void 0 ? void 0 : _a.cachedAt,
    newestAt: (_b = sorted[sorted.length - 1]) === null || _b === void 0 ? void 0 : _b.cachedAt,
  };
}
var STICKER_DESCRIPTION_PROMPT =
  "Describe this sticker image in 1-2 sentences. Focus on what the sticker depicts (character, object, action, emotion). Be concise and objective.";
var VISION_PROVIDERS = ["openai", "anthropic", "google", "minimax"];
/**
 * Describe a sticker image using vision API.
 * Auto-detects an available vision provider based on configured API keys.
 * Returns null if no vision provider is available.
 */
function describeStickerImage(params) {
  return __awaiter(this, void 0, void 0, function () {
    var imagePath,
      cfg,
      agentDir,
      agentId,
      defaultModel,
      activeModel,
      catalog,
      entry,
      supportsVision,
      _a,
      hasProviderKey,
      selectCatalogModel,
      resolved,
      _b,
      _i,
      VISION_PROVIDERS_1,
      provider_1,
      entry,
      provider,
      model,
      buffer,
      describeImageWithModel,
      result,
      err_1;
    var _this = this;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          ((imagePath = params.imagePath),
            (cfg = params.cfg),
            (agentDir = params.agentDir),
            (agentId = params.agentId));
          defaultModel = (0, model_selection_js_1.resolveDefaultModelForAgent)({
            cfg: cfg,
            agentId: agentId,
          });
          activeModel = undefined;
          catalog = [];
          _c.label = 1;
        case 1:
          _c.trys.push([1, 3, , 4]);
          return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: cfg })];
        case 2:
          catalog = _c.sent();
          entry = (0, model_catalog_js_1.findModelInCatalog)(
            catalog,
            defaultModel.provider,
            defaultModel.model,
          );
          supportsVision = (0, model_catalog_js_1.modelSupportsVision)(entry);
          if (supportsVision) {
            activeModel = { provider: defaultModel.provider, model: defaultModel.model };
          }
          return [3 /*break*/, 4];
        case 3:
          _a = _c.sent();
          return [3 /*break*/, 4];
        case 4:
          hasProviderKey = function (provider) {
            return __awaiter(_this, void 0, void 0, function () {
              var _a;
              return __generator(this, function (_b) {
                switch (_b.label) {
                  case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [
                      4 /*yield*/,
                      (0, model_auth_js_1.resolveApiKeyForProvider)({
                        provider: provider,
                        cfg: cfg,
                        agentDir: agentDir,
                      }),
                    ];
                  case 1:
                    _b.sent();
                    return [2 /*return*/, true];
                  case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                  case 3:
                    return [2 /*return*/];
                }
              });
            });
          };
          selectCatalogModel = function (provider) {
            var entries = catalog.filter(function (entry) {
              return (
                entry.provider.toLowerCase() === provider.toLowerCase() &&
                (0, model_catalog_js_1.modelSupportsVision)(entry)
              );
            });
            if (entries.length === 0) {
              return undefined;
            }
            var defaultId =
              provider === "openai"
                ? "gpt-5-mini"
                : provider === "anthropic"
                  ? "claude-opus-4-5"
                  : provider === "google"
                    ? "gemini-3-flash-preview"
                    : "MiniMax-VL-01";
            var preferred = entries.find(function (entry) {
              return entry.id === defaultId;
            });
            return preferred !== null && preferred !== void 0 ? preferred : entries[0];
          };
          resolved = null;
          _b = activeModel && VISION_PROVIDERS.includes(activeModel.provider);
          if (!_b) {
            return [3 /*break*/, 6];
          }
          return [4 /*yield*/, hasProviderKey(activeModel.provider)];
        case 5:
          _b = _c.sent();
          _c.label = 6;
        case 6:
          if (_b) {
            resolved = activeModel;
          }
          if (!!resolved) {
            return [3 /*break*/, 10];
          }
          ((_i = 0), (VISION_PROVIDERS_1 = VISION_PROVIDERS));
          _c.label = 7;
        case 7:
          if (!(_i < VISION_PROVIDERS_1.length)) {
            return [3 /*break*/, 10];
          }
          provider_1 = VISION_PROVIDERS_1[_i];
          return [4 /*yield*/, hasProviderKey(provider_1)];
        case 8:
          if (!_c.sent()) {
            return [3 /*break*/, 9];
          }
          entry = selectCatalogModel(provider_1);
          if (entry) {
            resolved = { provider: provider_1, model: entry.id };
            return [3 /*break*/, 10];
          }
          _c.label = 9;
        case 9:
          _i++;
          return [3 /*break*/, 7];
        case 10:
          if (!!resolved) {
            return [3 /*break*/, 12];
          }
          return [
            4 /*yield*/,
            (0, runner_js_1.resolveAutoImageModel)({
              cfg: cfg,
              agentDir: agentDir,
              activeModel: activeModel,
            }),
          ];
        case 11:
          resolved = _c.sent();
          _c.label = 12;
        case 12:
          if (!(resolved === null || resolved === void 0 ? void 0 : resolved.model)) {
            (0, globals_js_1.logVerbose)(
              "telegram: no vision provider available for sticker description",
            );
            return [2 /*return*/, null];
          }
          ((provider = resolved.provider), (model = resolved.model));
          (0, globals_js_1.logVerbose)(
            "telegram: describing sticker with ".concat(provider, "/").concat(model),
          );
          _c.label = 13;
        case 13:
          _c.trys.push([13, 17, , 18]);
          return [4 /*yield*/, promises_1.default.readFile(imagePath)];
        case 14:
          buffer = _c.sent();
          return [
            4 /*yield*/,
            Promise.resolve().then(function () {
              return require("../media-understanding/providers/image.js");
            }),
          ];
        case 15:
          describeImageWithModel = _c.sent().describeImageWithModel;
          return [
            4 /*yield*/,
            describeImageWithModel({
              buffer: buffer,
              fileName: "sticker.webp",
              mime: "image/webp",
              prompt: STICKER_DESCRIPTION_PROMPT,
              cfg: cfg,
              agentDir: agentDir !== null && agentDir !== void 0 ? agentDir : "",
              provider: provider,
              model: model,
              maxTokens: 150,
              timeoutMs: 30000,
            }),
          ];
        case 16:
          result = _c.sent();
          return [2 /*return*/, result.text];
        case 17:
          err_1 = _c.sent();
          (0, globals_js_1.logVerbose)(
            "telegram: failed to describe sticker: ".concat(String(err_1)),
          );
          return [2 /*return*/, null];
        case 18:
          return [2 /*return*/];
      }
    });
  });
}
