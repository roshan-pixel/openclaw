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
exports.createEmbeddingProvider = createEmbeddingProvider;
var node_fs_1 = require("node:fs");
var utils_js_1 = require("../utils.js");
var embeddings_gemini_js_1 = require("./embeddings-gemini.js");
var embeddings_openai_js_1 = require("./embeddings-openai.js");
var node_llama_js_1 = require("./node-llama.js");
var DEFAULT_LOCAL_MODEL = "hf:ggml-org/embeddinggemma-300M-GGUF/embeddinggemma-300M-Q8_0.gguf";
function canAutoSelectLocal(options) {
  var _a, _b;
  var modelPath =
    (_b = (_a = options.local) === null || _a === void 0 ? void 0 : _a.modelPath) === null ||
    _b === void 0
      ? void 0
      : _b.trim();
  if (!modelPath) {
    return false;
  }
  if (/^(hf:|https?:)/i.test(modelPath)) {
    return false;
  }
  var resolved = (0, utils_js_1.resolveUserPath)(modelPath);
  try {
    return node_fs_1.default.statSync(resolved).isFile();
  } catch (_c) {
    return false;
  }
}
function isMissingApiKeyError(err) {
  var message = formatError(err);
  return message.includes("No API key found for provider");
}
function createLocalEmbeddingProvider(options) {
  return __awaiter(this, void 0, void 0, function () {
    var modelPath,
      modelCacheDir,
      _a,
      getLlama,
      resolveModelFile,
      LlamaLogLevel,
      llama,
      embeddingModel,
      embeddingContext,
      ensureContext;
    var _this = this;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          modelPath =
            ((_c = (_b = options.local) === null || _b === void 0 ? void 0 : _b.modelPath) ===
              null || _c === void 0
              ? void 0
              : _c.trim()) || DEFAULT_LOCAL_MODEL;
          modelCacheDir =
            (_e = (_d = options.local) === null || _d === void 0 ? void 0 : _d.modelCacheDir) ===
              null || _e === void 0
              ? void 0
              : _e.trim();
          return [4 /*yield*/, (0, node_llama_js_1.importNodeLlamaCpp)()];
        case 1:
          ((_a = _f.sent()),
            (getLlama = _a.getLlama),
            (resolveModelFile = _a.resolveModelFile),
            (LlamaLogLevel = _a.LlamaLogLevel));
          llama = null;
          embeddingModel = null;
          embeddingContext = null;
          ensureContext = function () {
            return __awaiter(_this, void 0, void 0, function () {
              var resolved;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    if (!!llama) {
                      return [3 /*break*/, 2];
                    }
                    return [4 /*yield*/, getLlama({ logLevel: LlamaLogLevel.error })];
                  case 1:
                    llama = _a.sent();
                    _a.label = 2;
                  case 2:
                    if (!!embeddingModel) {
                      return [3 /*break*/, 5];
                    }
                    return [4 /*yield*/, resolveModelFile(modelPath, modelCacheDir || undefined)];
                  case 3:
                    resolved = _a.sent();
                    return [4 /*yield*/, llama.loadModel({ modelPath: resolved })];
                  case 4:
                    embeddingModel = _a.sent();
                    _a.label = 5;
                  case 5:
                    if (!!embeddingContext) {
                      return [3 /*break*/, 7];
                    }
                    return [4 /*yield*/, embeddingModel.createEmbeddingContext()];
                  case 6:
                    embeddingContext = _a.sent();
                    _a.label = 7;
                  case 7:
                    return [2 /*return*/, embeddingContext];
                }
              });
            });
          };
          return [
            2 /*return*/,
            {
              id: "local",
              model: modelPath,
              embedQuery: function (text) {
                return __awaiter(_this, void 0, void 0, function () {
                  var ctx, embedding;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4 /*yield*/, ensureContext()];
                      case 1:
                        ctx = _a.sent();
                        return [4 /*yield*/, ctx.getEmbeddingFor(text)];
                      case 2:
                        embedding = _a.sent();
                        return [2 /*return*/, Array.from(embedding.vector)];
                    }
                  });
                });
              },
              embedBatch: function (texts) {
                return __awaiter(_this, void 0, void 0, function () {
                  var ctx, embeddings;
                  var _this = this;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4 /*yield*/, ensureContext()];
                      case 1:
                        ctx = _a.sent();
                        return [
                          4 /*yield*/,
                          Promise.all(
                            texts.map(function (text) {
                              return __awaiter(_this, void 0, void 0, function () {
                                var embedding;
                                return __generator(this, function (_a) {
                                  switch (_a.label) {
                                    case 0:
                                      return [4 /*yield*/, ctx.getEmbeddingFor(text)];
                                    case 1:
                                      embedding = _a.sent();
                                      return [2 /*return*/, Array.from(embedding.vector)];
                                  }
                                });
                              });
                            }),
                          ),
                        ];
                      case 2:
                        embeddings = _a.sent();
                        return [2 /*return*/, embeddings];
                    }
                  });
                });
              },
            },
          ];
      }
    });
  });
}
function createEmbeddingProvider(options) {
  return __awaiter(this, void 0, void 0, function () {
    var requestedProvider,
      fallback,
      createProvider,
      formatPrimaryError,
      missingKeyErrors,
      localError,
      local,
      err_1,
      _i,
      _a,
      provider,
      result,
      err_2,
      message,
      details,
      primary,
      primaryErr_1,
      reason,
      fallbackResult,
      fallbackErr_1;
    var _this = this;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          requestedProvider = options.provider;
          fallback = options.fallback;
          createProvider = function (id) {
            return __awaiter(_this, void 0, void 0, function () {
              var provider_1, _a, provider_2, client_1, _b, provider, client;
              return __generator(this, function (_c) {
                switch (_c.label) {
                  case 0:
                    if (!(id === "local")) {
                      return [3 /*break*/, 2];
                    }
                    return [4 /*yield*/, createLocalEmbeddingProvider(options)];
                  case 1:
                    provider_1 = _c.sent();
                    return [2 /*return*/, { provider: provider_1 }];
                  case 2:
                    if (!(id === "gemini")) {
                      return [3 /*break*/, 4];
                    }
                    return [
                      4 /*yield*/,
                      (0, embeddings_gemini_js_1.createGeminiEmbeddingProvider)(options),
                    ];
                  case 3:
                    ((_a = _c.sent()), (provider_2 = _a.provider), (client_1 = _a.client));
                    return [2 /*return*/, { provider: provider_2, gemini: client_1 }];
                  case 4:
                    return [
                      4 /*yield*/,
                      (0, embeddings_openai_js_1.createOpenAiEmbeddingProvider)(options),
                    ];
                  case 5:
                    ((_b = _c.sent()), (provider = _b.provider), (client = _b.client));
                    return [2 /*return*/, { provider: provider, openAi: client }];
                }
              });
            });
          };
          formatPrimaryError = function (err, provider) {
            return provider === "local" ? formatLocalSetupError(err) : formatError(err);
          };
          if (!(requestedProvider === "auto")) {
            return [3 /*break*/, 11];
          }
          missingKeyErrors = [];
          localError = null;
          if (!canAutoSelectLocal(options)) {
            return [3 /*break*/, 4];
          }
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          return [4 /*yield*/, createProvider("local")];
        case 2:
          local = _b.sent();
          return [
            2 /*return*/,
            __assign(__assign({}, local), { requestedProvider: requestedProvider }),
          ];
        case 3:
          err_1 = _b.sent();
          localError = formatLocalSetupError(err_1);
          return [3 /*break*/, 4];
        case 4:
          ((_i = 0), (_a = ["openai", "gemini"]));
          _b.label = 5;
        case 5:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 10];
          }
          provider = _a[_i];
          _b.label = 6;
        case 6:
          _b.trys.push([6, 8, , 9]);
          return [4 /*yield*/, createProvider(provider)];
        case 7:
          result = _b.sent();
          return [
            2 /*return*/,
            __assign(__assign({}, result), { requestedProvider: requestedProvider }),
          ];
        case 8:
          err_2 = _b.sent();
          message = formatPrimaryError(err_2, provider);
          if (isMissingApiKeyError(err_2)) {
            missingKeyErrors.push(message);
            return [3 /*break*/, 9];
          }
          throw new Error(message);
        case 9:
          _i++;
          return [3 /*break*/, 5];
        case 10:
          details = __spreadArray(
            __spreadArray([], missingKeyErrors, true),
            [localError],
            false,
          ).filter(Boolean);
          if (details.length > 0) {
            throw new Error(details.join("\n\n"));
          }
          throw new Error("No embeddings provider available.");
        case 11:
          _b.trys.push([11, 13, , 18]);
          return [4 /*yield*/, createProvider(requestedProvider)];
        case 12:
          primary = _b.sent();
          return [
            2 /*return*/,
            __assign(__assign({}, primary), { requestedProvider: requestedProvider }),
          ];
        case 13:
          primaryErr_1 = _b.sent();
          reason = formatPrimaryError(primaryErr_1, requestedProvider);
          if (!(fallback && fallback !== "none" && fallback !== requestedProvider)) {
            return [3 /*break*/, 17];
          }
          _b.label = 14;
        case 14:
          _b.trys.push([14, 16, , 17]);
          return [4 /*yield*/, createProvider(fallback)];
        case 15:
          fallbackResult = _b.sent();
          return [
            2 /*return*/,
            __assign(__assign({}, fallbackResult), {
              requestedProvider: requestedProvider,
              fallbackFrom: requestedProvider,
              fallbackReason: reason,
            }),
          ];
        case 16:
          fallbackErr_1 = _b.sent();
          throw new Error(
            ""
              .concat(reason, "\n\nFallback to ")
              .concat(fallback, " failed: ")
              .concat(formatError(fallbackErr_1)),
          );
        case 17:
          throw new Error(reason);
        case 18:
          return [2 /*return*/];
      }
    });
  });
}
function formatError(err) {
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}
function isNodeLlamaCppMissing(err) {
  if (!(err instanceof Error)) {
    return false;
  }
  var code = err.code;
  if (code === "ERR_MODULE_NOT_FOUND") {
    return err.message.includes("node-llama-cpp");
  }
  return false;
}
function formatLocalSetupError(err) {
  var detail = formatError(err);
  var missing = isNodeLlamaCppMissing(err);
  return [
    "Local embeddings unavailable.",
    missing
      ? "Reason: optional dependency node-llama-cpp is missing (or failed to install)."
      : detail
        ? "Reason: ".concat(detail)
        : undefined,
    missing && detail ? "Detail: ".concat(detail) : null,
    "To enable local embeddings:",
    "1) Use Node 22 LTS (recommended for installs/updates)",
    missing
      ? "2) Reinstall OpenClaw (this should install node-llama-cpp): npm i -g openclaw@latest"
      : null,
    "3) If you use pnpm: pnpm approve-builds (select node-llama-cpp), then pnpm rebuild node-llama-cpp",
    'Or set agents.defaults.memorySearch.provider = "openai" (remote).',
  ]
    .filter(Boolean)
    .join("\n");
}
