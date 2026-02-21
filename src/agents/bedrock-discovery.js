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
exports.resetBedrockDiscoveryCacheForTest = resetBedrockDiscoveryCacheForTest;
exports.discoverBedrockModels = discoverBedrockModels;
var client_bedrock_1 = require("@aws-sdk/client-bedrock");
var DEFAULT_REFRESH_INTERVAL_SECONDS = 3600;
var DEFAULT_CONTEXT_WINDOW = 32000;
var DEFAULT_MAX_TOKENS = 4096;
var DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};
var discoveryCache = new Map();
var hasLoggedBedrockError = false;
function normalizeProviderFilter(filter) {
  if (!filter || filter.length === 0) {
    return [];
  }
  var normalized = new Set(
    filter
      .map(function (entry) {
        return entry.trim().toLowerCase();
      })
      .filter(function (entry) {
        return entry.length > 0;
      }),
  );
  return Array.from(normalized).toSorted();
}
function buildCacheKey(params) {
  return JSON.stringify(params);
}
function includesTextModalities(modalities) {
  return (modalities !== null && modalities !== void 0 ? modalities : []).some(function (entry) {
    return entry.toLowerCase() === "text";
  });
}
function isActive(summary) {
  var _a;
  var status = (_a = summary.modelLifecycle) === null || _a === void 0 ? void 0 : _a.status;
  return typeof status === "string" ? status.toUpperCase() === "ACTIVE" : false;
}
function mapInputModalities(summary) {
  var _a;
  var inputs = (_a = summary.inputModalities) !== null && _a !== void 0 ? _a : [];
  var mapped = new Set();
  for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
    var modality = inputs_1[_i];
    var lower = modality.toLowerCase();
    if (lower === "text") {
      mapped.add("text");
    }
    if (lower === "image") {
      mapped.add("image");
    }
  }
  if (mapped.size === 0) {
    mapped.add("text");
  }
  return Array.from(mapped);
}
function inferReasoningSupport(summary) {
  var _a, _b;
  var haystack = ""
    .concat((_a = summary.modelId) !== null && _a !== void 0 ? _a : "", " ")
    .concat((_b = summary.modelName) !== null && _b !== void 0 ? _b : "")
    .toLowerCase();
  return haystack.includes("reasoning") || haystack.includes("thinking");
}
function resolveDefaultContextWindow(config) {
  var _a;
  var value = Math.floor(
    (_a = config === null || config === void 0 ? void 0 : config.defaultContextWindow) !== null &&
      _a !== void 0
      ? _a
      : DEFAULT_CONTEXT_WINDOW,
  );
  return value > 0 ? value : DEFAULT_CONTEXT_WINDOW;
}
function resolveDefaultMaxTokens(config) {
  var _a;
  var value = Math.floor(
    (_a = config === null || config === void 0 ? void 0 : config.defaultMaxTokens) !== null &&
      _a !== void 0
      ? _a
      : DEFAULT_MAX_TOKENS,
  );
  return value > 0 ? value : DEFAULT_MAX_TOKENS;
}
function matchesProviderFilter(summary, filter) {
  var _a;
  if (filter.length === 0) {
    return true;
  }
  var providerName =
    (_a = summary.providerName) !== null && _a !== void 0
      ? _a
      : typeof summary.modelId === "string"
        ? summary.modelId.split(".")[0]
        : undefined;
  var normalized =
    providerName === null || providerName === void 0 ? void 0 : providerName.trim().toLowerCase();
  if (!normalized) {
    return false;
  }
  return filter.includes(normalized);
}
function shouldIncludeSummary(summary, filter) {
  var _a;
  if (!((_a = summary.modelId) === null || _a === void 0 ? void 0 : _a.trim())) {
    return false;
  }
  if (!matchesProviderFilter(summary, filter)) {
    return false;
  }
  if (summary.responseStreamingSupported !== true) {
    return false;
  }
  if (!includesTextModalities(summary.outputModalities)) {
    return false;
  }
  if (!isActive(summary)) {
    return false;
  }
  return true;
}
function toModelDefinition(summary, defaults) {
  var _a, _b, _c;
  var id =
    (_b = (_a = summary.modelId) === null || _a === void 0 ? void 0 : _a.trim()) !== null &&
    _b !== void 0
      ? _b
      : "";
  return {
    id: id,
    name: ((_c = summary.modelName) === null || _c === void 0 ? void 0 : _c.trim()) || id,
    reasoning: inferReasoningSupport(summary),
    input: mapInputModalities(summary),
    cost: DEFAULT_COST,
    contextWindow: defaults.contextWindow,
    maxTokens: defaults.maxTokens,
  };
}
function resetBedrockDiscoveryCacheForTest() {
  discoveryCache.clear();
  hasLoggedBedrockError = false;
}
function discoverBedrockModels(params) {
  return __awaiter(this, void 0, void 0, function () {
    var refreshIntervalSeconds,
      providerFilter,
      defaultContextWindow,
      defaultMaxTokens,
      cacheKey,
      now,
      cached,
      clientFactory,
      client,
      discoveryPromise,
      value,
      error_1;
    var _this = this;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          refreshIntervalSeconds = Math.max(
            0,
            Math.floor(
              (_b =
                (_a = params.config) === null || _a === void 0 ? void 0 : _a.refreshInterval) !==
                null && _b !== void 0
                ? _b
                : DEFAULT_REFRESH_INTERVAL_SECONDS,
            ),
          );
          providerFilter = normalizeProviderFilter(
            (_c = params.config) === null || _c === void 0 ? void 0 : _c.providerFilter,
          );
          defaultContextWindow = resolveDefaultContextWindow(params.config);
          defaultMaxTokens = resolveDefaultMaxTokens(params.config);
          cacheKey = buildCacheKey({
            region: params.region,
            providerFilter: providerFilter,
            refreshIntervalSeconds: refreshIntervalSeconds,
            defaultContextWindow: defaultContextWindow,
            defaultMaxTokens: defaultMaxTokens,
          });
          now =
            (_e = (_d = params.now) === null || _d === void 0 ? void 0 : _d.call(params)) !==
              null && _e !== void 0
              ? _e
              : Date.now();
          if (refreshIntervalSeconds > 0) {
            cached = discoveryCache.get(cacheKey);
            if (
              (cached === null || cached === void 0 ? void 0 : cached.value) &&
              cached.expiresAt > now
            ) {
              return [2 /*return*/, cached.value];
            }
            if (cached === null || cached === void 0 ? void 0 : cached.inFlight) {
              return [2 /*return*/, cached.inFlight];
            }
          }
          clientFactory =
            (_f = params.clientFactory) !== null && _f !== void 0
              ? _f
              : function (region) {
                  return new client_bedrock_1.BedrockClient({ region: region });
                };
          client = clientFactory(params.region);
          discoveryPromise = (function () {
            return __awaiter(_this, void 0, void 0, function () {
              var response, discovered, _i, _a, summary;
              var _b;
              return __generator(this, function (_c) {
                switch (_c.label) {
                  case 0:
                    return [
                      4 /*yield*/,
                      client.send(new client_bedrock_1.ListFoundationModelsCommand({})),
                    ];
                  case 1:
                    response = _c.sent();
                    discovered = [];
                    for (
                      _i = 0,
                        _a = (_b = response.modelSummaries) !== null && _b !== void 0 ? _b : [];
                      _i < _a.length;
                      _i++
                    ) {
                      summary = _a[_i];
                      if (!shouldIncludeSummary(summary, providerFilter)) {
                        continue;
                      }
                      discovered.push(
                        toModelDefinition(summary, {
                          contextWindow: defaultContextWindow,
                          maxTokens: defaultMaxTokens,
                        }),
                      );
                    }
                    return [
                      2 /*return*/,
                      discovered.toSorted(function (a, b) {
                        return a.name.localeCompare(b.name);
                      }),
                    ];
                }
              });
            });
          })();
          if (refreshIntervalSeconds > 0) {
            discoveryCache.set(cacheKey, {
              expiresAt: now + refreshIntervalSeconds * 1000,
              inFlight: discoveryPromise,
            });
          }
          _g.label = 1;
        case 1:
          _g.trys.push([1, 3, , 4]);
          return [4 /*yield*/, discoveryPromise];
        case 2:
          value = _g.sent();
          if (refreshIntervalSeconds > 0) {
            discoveryCache.set(cacheKey, {
              expiresAt: now + refreshIntervalSeconds * 1000,
              value: value,
            });
          }
          return [2 /*return*/, value];
        case 3:
          error_1 = _g.sent();
          if (refreshIntervalSeconds > 0) {
            discoveryCache.delete(cacheKey);
          }
          if (!hasLoggedBedrockError) {
            hasLoggedBedrockError = true;
            console.warn("[bedrock-discovery] Failed to list models: ".concat(String(error_1)));
          }
          return [2 /*return*/, []];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
