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
exports.DEFAULT_OPENAI_EMBEDDING_MODEL = void 0;
exports.normalizeOpenAiModel = normalizeOpenAiModel;
exports.createOpenAiEmbeddingProvider = createOpenAiEmbeddingProvider;
exports.resolveOpenAiEmbeddingClient = resolveOpenAiEmbeddingClient;
var model_auth_js_1 = require("../agents/model-auth.js");
exports.DEFAULT_OPENAI_EMBEDDING_MODEL = "text-embedding-3-small";
var DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
function normalizeOpenAiModel(model) {
  var trimmed = model.trim();
  if (!trimmed) {
    return exports.DEFAULT_OPENAI_EMBEDDING_MODEL;
  }
  if (trimmed.startsWith("openai/")) {
    return trimmed.slice("openai/".length);
  }
  return trimmed;
}
function createOpenAiEmbeddingProvider(options) {
  return __awaiter(this, void 0, void 0, function () {
    var client, url, embed;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, resolveOpenAiEmbeddingClient(options)];
        case 1:
          client = _a.sent();
          url = "".concat(client.baseUrl.replace(/\/$/, ""), "/embeddings");
          embed = function (input) {
            return __awaiter(_this, void 0, void 0, function () {
              var res, text, payload, data;
              var _a;
              return __generator(this, function (_b) {
                switch (_b.label) {
                  case 0:
                    if (input.length === 0) {
                      return [2 /*return*/, []];
                    }
                    return [
                      4 /*yield*/,
                      fetch(url, {
                        method: "POST",
                        headers: client.headers,
                        body: JSON.stringify({ model: client.model, input: input }),
                      }),
                    ];
                  case 1:
                    res = _b.sent();
                    if (!!res.ok) {
                      return [3 /*break*/, 3];
                    }
                    return [4 /*yield*/, res.text()];
                  case 2:
                    text = _b.sent();
                    throw new Error(
                      "openai embeddings failed: ".concat(res.status, " ").concat(text),
                    );
                  case 3:
                    return [4 /*yield*/, res.json()];
                  case 4:
                    payload = _b.sent();
                    data = (_a = payload.data) !== null && _a !== void 0 ? _a : [];
                    return [
                      2 /*return*/,
                      data.map(function (entry) {
                        var _a;
                        return (_a = entry.embedding) !== null && _a !== void 0 ? _a : [];
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
                id: "openai",
                model: client.model,
                embedQuery: function (text) {
                  return __awaiter(_this, void 0, void 0, function () {
                    var vec;
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [4 /*yield*/, embed([text])];
                        case 1:
                          vec = _a.sent()[0];
                          return [2 /*return*/, vec !== null && vec !== void 0 ? vec : []];
                      }
                    });
                  });
                },
                embedBatch: embed,
              },
              client: client,
            },
          ];
      }
    });
  });
}
function resolveOpenAiEmbeddingClient(options) {
  return __awaiter(this, void 0, void 0, function () {
    var remote,
      remoteApiKey,
      remoteBaseUrl,
      apiKey,
      _a,
      _b,
      providerConfig,
      baseUrl,
      headerOverrides,
      headers,
      model;
    var _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          remote = options.remote;
          remoteApiKey =
            (_c = remote === null || remote === void 0 ? void 0 : remote.apiKey) === null ||
            _c === void 0
              ? void 0
              : _c.trim();
          remoteBaseUrl =
            (_d = remote === null || remote === void 0 ? void 0 : remote.baseUrl) === null ||
            _d === void 0
              ? void 0
              : _d.trim();
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
              provider: "openai",
              cfg: options.config,
              agentDir: options.agentDir,
            }),
          ];
        case 2:
          _a = _b.apply(void 0, [_h.sent(), "openai"]);
          _h.label = 3;
        case 3:
          apiKey = _a;
          providerConfig =
            (_f =
              (_e = options.config.models) === null || _e === void 0 ? void 0 : _e.providers) ===
              null || _f === void 0
              ? void 0
              : _f.openai;
          baseUrl =
            remoteBaseUrl ||
            ((_g =
              providerConfig === null || providerConfig === void 0
                ? void 0
                : providerConfig.baseUrl) === null || _g === void 0
              ? void 0
              : _g.trim()) ||
            DEFAULT_OPENAI_BASE_URL;
          headerOverrides = Object.assign(
            {},
            providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.headers,
            remote === null || remote === void 0 ? void 0 : remote.headers,
          );
          headers = __assign(
            { "Content-Type": "application/json", Authorization: "Bearer ".concat(apiKey) },
            headerOverrides,
          );
          model = normalizeOpenAiModel(options.model);
          return [2 /*return*/, { baseUrl: baseUrl, headers: headers, model: model }];
      }
    });
  });
}
