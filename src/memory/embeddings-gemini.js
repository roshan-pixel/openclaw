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
exports.DEFAULT_GEMINI_EMBEDDING_MODEL = void 0;
exports.createGeminiEmbeddingProvider = createGeminiEmbeddingProvider;
exports.resolveGeminiEmbeddingClient = resolveGeminiEmbeddingClient;
var model_auth_js_1 = require("../agents/model-auth.js");
var env_js_1 = require("../infra/env.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var DEFAULT_GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
exports.DEFAULT_GEMINI_EMBEDDING_MODEL = "gemini-embedding-001";
var debugEmbeddings = (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_DEBUG_MEMORY_EMBEDDINGS);
var log = (0, subsystem_js_1.createSubsystemLogger)("memory/embeddings");
var debugLog = function (message, meta) {
  if (!debugEmbeddings) {
    return;
  }
  var suffix = meta ? " ".concat(JSON.stringify(meta)) : "";
  log.raw("".concat(message).concat(suffix));
};
function resolveRemoteApiKey(remoteApiKey) {
  var _a;
  var trimmed = remoteApiKey === null || remoteApiKey === void 0 ? void 0 : remoteApiKey.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed === "GOOGLE_API_KEY" || trimmed === "GEMINI_API_KEY") {
    return (_a = process.env[trimmed]) === null || _a === void 0 ? void 0 : _a.trim();
  }
  return trimmed;
}
function normalizeGeminiModel(model) {
  var trimmed = model.trim();
  if (!trimmed) {
    return exports.DEFAULT_GEMINI_EMBEDDING_MODEL;
  }
  var withoutPrefix = trimmed.replace(/^models\//, "");
  if (withoutPrefix.startsWith("gemini/")) {
    return withoutPrefix.slice("gemini/".length);
  }
  if (withoutPrefix.startsWith("google/")) {
    return withoutPrefix.slice("google/".length);
  }
  return withoutPrefix;
}
function normalizeGeminiBaseUrl(raw) {
  var trimmed = raw.replace(/\/+$/, "");
  var openAiIndex = trimmed.indexOf("/openai");
  if (openAiIndex > -1) {
    return trimmed.slice(0, openAiIndex);
  }
  return trimmed;
}
function buildGeminiModelPath(model) {
  return model.startsWith("models/") ? model : "models/".concat(model);
}
function createGeminiEmbeddingProvider(options) {
  return __awaiter(this, void 0, void 0, function () {
    var client, baseUrl, embedUrl, batchUrl, embedQuery, embedBatch;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, resolveGeminiEmbeddingClient(options)];
        case 1:
          client = _a.sent();
          baseUrl = client.baseUrl.replace(/\/$/, "");
          embedUrl = "".concat(baseUrl, "/").concat(client.modelPath, ":embedContent");
          batchUrl = "".concat(baseUrl, "/").concat(client.modelPath, ":batchEmbedContents");
          embedQuery = function (text) {
            return __awaiter(_this, void 0, void 0, function () {
              var res, payload_1, payload;
              var _a, _b;
              return __generator(this, function (_c) {
                switch (_c.label) {
                  case 0:
                    if (!text.trim()) {
                      return [2 /*return*/, []];
                    }
                    return [
                      4 /*yield*/,
                      fetch(embedUrl, {
                        method: "POST",
                        headers: client.headers,
                        body: JSON.stringify({
                          content: { parts: [{ text: text }] },
                          taskType: "RETRIEVAL_QUERY",
                        }),
                      }),
                    ];
                  case 1:
                    res = _c.sent();
                    if (!!res.ok) {
                      return [3 /*break*/, 3];
                    }
                    return [4 /*yield*/, res.text()];
                  case 2:
                    payload_1 = _c.sent();
                    throw new Error(
                      "gemini embeddings failed: ".concat(res.status, " ").concat(payload_1),
                    );
                  case 3:
                    return [4 /*yield*/, res.json()];
                  case 4:
                    payload = _c.sent();
                    return [
                      2 /*return*/,
                      (_b =
                        (_a = payload.embedding) === null || _a === void 0 ? void 0 : _a.values) !==
                        null && _b !== void 0
                        ? _b
                        : [],
                    ];
                }
              });
            });
          };
          embedBatch = function (texts) {
            return __awaiter(_this, void 0, void 0, function () {
              var requests, res, payload_2, payload, embeddings;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    if (texts.length === 0) {
                      return [2 /*return*/, []];
                    }
                    requests = texts.map(function (text) {
                      return {
                        model: client.modelPath,
                        content: { parts: [{ text: text }] },
                        taskType: "RETRIEVAL_DOCUMENT",
                      };
                    });
                    return [
                      4 /*yield*/,
                      fetch(batchUrl, {
                        method: "POST",
                        headers: client.headers,
                        body: JSON.stringify({ requests: requests }),
                      }),
                    ];
                  case 1:
                    res = _a.sent();
                    if (!!res.ok) {
                      return [3 /*break*/, 3];
                    }
                    return [4 /*yield*/, res.text()];
                  case 2:
                    payload_2 = _a.sent();
                    throw new Error(
                      "gemini embeddings failed: ".concat(res.status, " ").concat(payload_2),
                    );
                  case 3:
                    return [4 /*yield*/, res.json()];
                  case 4:
                    payload = _a.sent();
                    embeddings = Array.isArray(payload.embeddings) ? payload.embeddings : [];
                    return [
                      2 /*return*/,
                      texts.map(function (_, index) {
                        var _a, _b;
                        return (_b =
                          (_a = embeddings[index]) === null || _a === void 0
                            ? void 0
                            : _a.values) !== null && _b !== void 0
                          ? _b
                          : [];
                      }),
                    ];
                }
              });
            });
          };
          return [
            2 /*return*/,
            {
              provider: {
                id: "gemini",
                model: client.model,
                embedQuery: embedQuery,
                embedBatch: embedBatch,
              },
              client: client,
            },
          ];
      }
    });
  });
}
function resolveGeminiEmbeddingClient(options) {
  return __awaiter(this, void 0, void 0, function () {
    var remote,
      remoteApiKey,
      remoteBaseUrl,
      apiKey,
      _a,
      _b,
      providerConfig,
      rawBaseUrl,
      baseUrl,
      headerOverrides,
      headers,
      model,
      modelPath;
    var _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          remote = options.remote;
          remoteApiKey = resolveRemoteApiKey(
            remote === null || remote === void 0 ? void 0 : remote.apiKey,
          );
          remoteBaseUrl =
            (_c = remote === null || remote === void 0 ? void 0 : remote.baseUrl) === null ||
            _c === void 0
              ? void 0
              : _c.trim();
          if (!remoteApiKey) {
            return [3 /*break*/, 1];
          }
          _a = remoteApiKey;
          return [3 /*break*/, 3];
        case 1:
          _b = model_auth_js_1.requireApiKey;
          return [
            4 /*yield*/,
            (0, model_auth_js_1.resolveApiKeyForProvider)({
              provider: "google",
              cfg: options.config,
              agentDir: options.agentDir,
            }),
          ];
        case 2:
          _a = _b.apply(void 0, [_g.sent(), "google"]);
          _g.label = 3;
        case 3:
          apiKey = _a;
          providerConfig =
            (_e =
              (_d = options.config.models) === null || _d === void 0 ? void 0 : _d.providers) ===
              null || _e === void 0
              ? void 0
              : _e.google;
          rawBaseUrl =
            remoteBaseUrl ||
            ((_f =
              providerConfig === null || providerConfig === void 0
                ? void 0
                : providerConfig.baseUrl) === null || _f === void 0
              ? void 0
              : _f.trim()) ||
            DEFAULT_GEMINI_BASE_URL;
          baseUrl = normalizeGeminiBaseUrl(rawBaseUrl);
          headerOverrides = Object.assign(
            {},
            providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.headers,
            remote === null || remote === void 0 ? void 0 : remote.headers,
          );
          headers = __assign(
            { "Content-Type": "application/json", "x-goog-api-key": apiKey },
            headerOverrides,
          );
          model = normalizeGeminiModel(options.model);
          modelPath = buildGeminiModelPath(model);
          debugLog("memory embeddings: gemini client", {
            rawBaseUrl: rawBaseUrl,
            baseUrl: baseUrl,
            model: model,
            modelPath: modelPath,
            embedEndpoint: "".concat(baseUrl, "/").concat(modelPath, ":embedContent"),
            batchEndpoint: "".concat(baseUrl, "/").concat(modelPath, ":batchEmbedContents"),
          });
          return [
            2 /*return*/,
            { baseUrl: baseUrl, headers: headers, model: model, modelPath: modelPath },
          ];
      }
    });
  });
}
