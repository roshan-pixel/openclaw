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
exports.__testing = void 0;
exports.createWebSearchTool = createWebSearchTool;
var typebox_1 = require("@sinclair/typebox");
var command_format_js_1 = require("../../cli/command-format.js");
var common_js_1 = require("./common.js");
var web_shared_js_1 = require("./web-shared.js");
var SEARCH_PROVIDERS = ["brave", "perplexity"];
var DEFAULT_SEARCH_COUNT = 5;
var MAX_SEARCH_COUNT = 10;
var BRAVE_SEARCH_ENDPOINT = "https://api.search.brave.com/res/v1/web/search";
var DEFAULT_PERPLEXITY_BASE_URL = "https://openrouter.ai/api/v1";
var PERPLEXITY_DIRECT_BASE_URL = "https://api.perplexity.ai";
var DEFAULT_PERPLEXITY_MODEL = "perplexity/sonar-pro";
var PERPLEXITY_KEY_PREFIXES = ["pplx-"];
var OPENROUTER_KEY_PREFIXES = ["sk-or-"];
var SEARCH_CACHE = new Map();
var BRAVE_FRESHNESS_SHORTCUTS = new Set(["pd", "pw", "pm", "py"]);
var BRAVE_FRESHNESS_RANGE = /^(\d{4}-\d{2}-\d{2})to(\d{4}-\d{2}-\d{2})$/;
var WebSearchSchema = typebox_1.Type.Object({
  query: typebox_1.Type.String({ description: "Search query string." }),
  count: typebox_1.Type.Optional(
    typebox_1.Type.Number({
      description: "Number of results to return (1-10).",
      minimum: 1,
      maximum: MAX_SEARCH_COUNT,
    }),
  ),
  country: typebox_1.Type.Optional(
    typebox_1.Type.String({
      description:
        "2-letter country code for region-specific results (e.g., 'DE', 'US', 'ALL'). Default: 'US'.",
    }),
  ),
  search_lang: typebox_1.Type.Optional(
    typebox_1.Type.String({
      description: "ISO language code for search results (e.g., 'de', 'en', 'fr').",
    }),
  ),
  ui_lang: typebox_1.Type.Optional(
    typebox_1.Type.String({
      description: "ISO language code for UI elements.",
    }),
  ),
  freshness: typebox_1.Type.Optional(
    typebox_1.Type.String({
      description:
        "Filter results by discovery time (Brave only). Values: 'pd' (past 24h), 'pw' (past week), 'pm' (past month), 'py' (past year), or date range 'YYYY-MM-DDtoYYYY-MM-DD'.",
    }),
  ),
});
function resolveSearchConfig(cfg) {
  var _a, _b;
  var search =
    (_b =
      (_a = cfg === null || cfg === void 0 ? void 0 : cfg.tools) === null || _a === void 0
        ? void 0
        : _a.web) === null || _b === void 0
      ? void 0
      : _b.search;
  if (!search || typeof search !== "object") {
    return undefined;
  }
  return search;
}
function resolveSearchEnabled(params) {
  var _a;
  if (typeof ((_a = params.search) === null || _a === void 0 ? void 0 : _a.enabled) === "boolean") {
    return params.search.enabled;
  }
  if (params.sandboxed) {
    return true;
  }
  return true;
}
function resolveSearchApiKey(search) {
  var _a;
  var fromConfig =
    search && "apiKey" in search && typeof search.apiKey === "string" ? search.apiKey.trim() : "";
  var fromEnv = ((_a = process.env.BRAVE_API_KEY) !== null && _a !== void 0 ? _a : "").trim();
  return fromConfig || fromEnv || undefined;
}
function missingSearchKeyPayload(provider) {
  if (provider === "perplexity") {
    return {
      error: "missing_perplexity_api_key",
      message:
        "web_search (perplexity) needs an API key. Set PERPLEXITY_API_KEY or OPENROUTER_API_KEY in the Gateway environment, or configure tools.web.search.perplexity.apiKey.",
      docs: "https://docs.openclaw.ai/tools/web",
    };
  }
  return {
    error: "missing_brave_api_key",
    message: "web_search needs a Brave Search API key. Run `".concat(
      (0, command_format_js_1.formatCliCommand)("openclaw configure --section web"),
      "` to store it, or set BRAVE_API_KEY in the Gateway environment.",
    ),
    docs: "https://docs.openclaw.ai/tools/web",
  };
}
function resolveSearchProvider(search) {
  var raw =
    search && "provider" in search && typeof search.provider === "string"
      ? search.provider.trim().toLowerCase()
      : "";
  if (raw === "perplexity") {
    return "perplexity";
  }
  if (raw === "brave") {
    return "brave";
  }
  return "brave";
}
function resolvePerplexityConfig(search) {
  if (!search || typeof search !== "object") {
    return {};
  }
  var perplexity = "perplexity" in search ? search.perplexity : undefined;
  if (!perplexity || typeof perplexity !== "object") {
    return {};
  }
  return perplexity;
}
function resolvePerplexityApiKey(perplexity) {
  var fromConfig = normalizeApiKey(
    perplexity === null || perplexity === void 0 ? void 0 : perplexity.apiKey,
  );
  if (fromConfig) {
    return { apiKey: fromConfig, source: "config" };
  }
  var fromEnvPerplexity = normalizeApiKey(process.env.PERPLEXITY_API_KEY);
  if (fromEnvPerplexity) {
    return { apiKey: fromEnvPerplexity, source: "perplexity_env" };
  }
  var fromEnvOpenRouter = normalizeApiKey(process.env.OPENROUTER_API_KEY);
  if (fromEnvOpenRouter) {
    return { apiKey: fromEnvOpenRouter, source: "openrouter_env" };
  }
  return { apiKey: undefined, source: "none" };
}
function normalizeApiKey(key) {
  return typeof key === "string" ? key.trim() : "";
}
function inferPerplexityBaseUrlFromApiKey(apiKey) {
  if (!apiKey) {
    return undefined;
  }
  var normalized = apiKey.toLowerCase();
  if (
    PERPLEXITY_KEY_PREFIXES.some(function (prefix) {
      return normalized.startsWith(prefix);
    })
  ) {
    return "direct";
  }
  if (
    OPENROUTER_KEY_PREFIXES.some(function (prefix) {
      return normalized.startsWith(prefix);
    })
  ) {
    return "openrouter";
  }
  return undefined;
}
function resolvePerplexityBaseUrl(perplexity, apiKeySource, apiKey) {
  if (apiKeySource === void 0) {
    apiKeySource = "none";
  }
  var fromConfig =
    perplexity && "baseUrl" in perplexity && typeof perplexity.baseUrl === "string"
      ? perplexity.baseUrl.trim()
      : "";
  if (fromConfig) {
    return fromConfig;
  }
  if (apiKeySource === "perplexity_env") {
    return PERPLEXITY_DIRECT_BASE_URL;
  }
  if (apiKeySource === "openrouter_env") {
    return DEFAULT_PERPLEXITY_BASE_URL;
  }
  if (apiKeySource === "config") {
    var inferred = inferPerplexityBaseUrlFromApiKey(apiKey);
    if (inferred === "direct") {
      return PERPLEXITY_DIRECT_BASE_URL;
    }
    if (inferred === "openrouter") {
      return DEFAULT_PERPLEXITY_BASE_URL;
    }
  }
  return DEFAULT_PERPLEXITY_BASE_URL;
}
function resolvePerplexityModel(perplexity) {
  var fromConfig =
    perplexity && "model" in perplexity && typeof perplexity.model === "string"
      ? perplexity.model.trim()
      : "";
  return fromConfig || DEFAULT_PERPLEXITY_MODEL;
}
function resolveSearchCount(value, fallback) {
  var parsed = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  var clamped = Math.max(1, Math.min(MAX_SEARCH_COUNT, Math.floor(parsed)));
  return clamped;
}
function normalizeFreshness(value) {
  if (!value) {
    return undefined;
  }
  var trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  var lower = trimmed.toLowerCase();
  if (BRAVE_FRESHNESS_SHORTCUTS.has(lower)) {
    return lower;
  }
  var match = trimmed.match(BRAVE_FRESHNESS_RANGE);
  if (!match) {
    return undefined;
  }
  var start = match[1],
    end = match[2];
  if (!isValidIsoDate(start) || !isValidIsoDate(end)) {
    return undefined;
  }
  if (start > end) {
    return undefined;
  }
  return "".concat(start, "to").concat(end);
}
function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  var _a = value.split("-").map(function (part) {
      return Number.parseInt(part, 10);
    }),
    year = _a[0],
    month = _a[1],
    day = _a[2];
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return false;
  }
  var date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}
function resolveSiteName(url) {
  if (!url) {
    return undefined;
  }
  try {
    return new URL(url).hostname;
  } catch (_a) {
    return undefined;
  }
}
function runPerplexitySearch(params) {
  return __awaiter(this, void 0, void 0, function () {
    var endpoint, res, detail, data, content, citations;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          endpoint = "".concat(params.baseUrl.replace(/\/$/, ""), "/chat/completions");
          return [
            4 /*yield*/,
            fetch(endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer ".concat(params.apiKey),
                "HTTP-Referer": "https://openclaw.ai",
                "X-Title": "OpenClaw Web Search",
              },
              body: JSON.stringify({
                model: params.model,
                messages: [
                  {
                    role: "user",
                    content: params.query,
                  },
                ],
              }),
              signal: (0, web_shared_js_1.withTimeout)(undefined, params.timeoutSeconds * 1000),
            }),
          ];
        case 1:
          res = _f.sent();
          if (!!res.ok) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, (0, web_shared_js_1.readResponseText)(res)];
        case 2:
          detail = _f.sent();
          throw new Error(
            "Perplexity API error (".concat(res.status, "): ").concat(detail || res.statusText),
          );
        case 3:
          return [4 /*yield*/, res.json()];
        case 4:
          data = _f.sent();
          content =
            (_d =
              (_c =
                (_b = (_a = data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null ||
                _b === void 0
                  ? void 0
                  : _b.message) === null || _c === void 0
                ? void 0
                : _c.content) !== null && _d !== void 0
              ? _d
              : "No response";
          citations = (_e = data.citations) !== null && _e !== void 0 ? _e : [];
          return [2 /*return*/, { content: content, citations: citations }];
      }
    });
  });
}
function runWebSearch(params) {
  return __awaiter(this, void 0, void 0, function () {
    var cacheKey,
      cached,
      start,
      _a,
      content,
      citations,
      payload_1,
      url,
      res,
      detail,
      data,
      results,
      mapped,
      payload;
    var _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          cacheKey = (0, web_shared_js_1.normalizeCacheKey)(
            params.provider === "brave"
              ? ""
                  .concat(params.provider, ":")
                  .concat(params.query, ":")
                  .concat(params.count, ":")
                  .concat(params.country || "default", ":")
                  .concat(params.search_lang || "default", ":")
                  .concat(params.ui_lang || "default", ":")
                  .concat(params.freshness || "default")
              : ""
                  .concat(params.provider, ":")
                  .concat(params.query, ":")
                  .concat(params.count, ":")
                  .concat(params.country || "default", ":")
                  .concat(params.search_lang || "default", ":")
                  .concat(params.ui_lang || "default"),
          );
          cached = (0, web_shared_js_1.readCache)(SEARCH_CACHE, cacheKey);
          if (cached) {
            return [2 /*return*/, __assign(__assign({}, cached.value), { cached: true })];
          }
          start = Date.now();
          if (!(params.provider === "perplexity")) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            runPerplexitySearch({
              query: params.query,
              apiKey: params.apiKey,
              baseUrl:
                (_b = params.perplexityBaseUrl) !== null && _b !== void 0
                  ? _b
                  : DEFAULT_PERPLEXITY_BASE_URL,
              model:
                (_c = params.perplexityModel) !== null && _c !== void 0
                  ? _c
                  : DEFAULT_PERPLEXITY_MODEL,
              timeoutSeconds: params.timeoutSeconds,
            }),
          ];
        case 1:
          ((_a = _h.sent()), (content = _a.content), (citations = _a.citations));
          payload_1 = {
            query: params.query,
            provider: params.provider,
            model:
              (_d = params.perplexityModel) !== null && _d !== void 0
                ? _d
                : DEFAULT_PERPLEXITY_MODEL,
            tookMs: Date.now() - start,
            content: content,
            citations: citations,
          };
          (0, web_shared_js_1.writeCache)(SEARCH_CACHE, cacheKey, payload_1, params.cacheTtlMs);
          return [2 /*return*/, payload_1];
        case 2:
          if (params.provider !== "brave") {
            throw new Error("Unsupported web search provider.");
          }
          url = new URL(BRAVE_SEARCH_ENDPOINT);
          url.searchParams.set("q", params.query);
          url.searchParams.set("count", String(params.count));
          if (params.country) {
            url.searchParams.set("country", params.country);
          }
          if (params.search_lang) {
            url.searchParams.set("search_lang", params.search_lang);
          }
          if (params.ui_lang) {
            url.searchParams.set("ui_lang", params.ui_lang);
          }
          if (params.freshness) {
            url.searchParams.set("freshness", params.freshness);
          }
          return [
            4 /*yield*/,
            fetch(url.toString(), {
              method: "GET",
              headers: {
                Accept: "application/json",
                "X-Subscription-Token": params.apiKey,
              },
              signal: (0, web_shared_js_1.withTimeout)(undefined, params.timeoutSeconds * 1000),
            }),
          ];
        case 3:
          res = _h.sent();
          if (!!res.ok) {
            return [3 /*break*/, 5];
          }
          return [4 /*yield*/, (0, web_shared_js_1.readResponseText)(res)];
        case 4:
          detail = _h.sent();
          throw new Error(
            "Brave Search API error (".concat(res.status, "): ").concat(detail || res.statusText),
          );
        case 5:
          return [4 /*yield*/, res.json()];
        case 6:
          data = _h.sent();
          results = Array.isArray((_e = data.web) === null || _e === void 0 ? void 0 : _e.results)
            ? (_g = (_f = data.web) === null || _f === void 0 ? void 0 : _f.results) !== null &&
              _g !== void 0
              ? _g
              : []
            : [];
          mapped = results.map(function (entry) {
            var _a, _b, _c, _d, _e;
            return {
              title: (_a = entry.title) !== null && _a !== void 0 ? _a : "",
              url: (_b = entry.url) !== null && _b !== void 0 ? _b : "",
              description: (_c = entry.description) !== null && _c !== void 0 ? _c : "",
              published: (_d = entry.age) !== null && _d !== void 0 ? _d : undefined,
              siteName: resolveSiteName((_e = entry.url) !== null && _e !== void 0 ? _e : ""),
            };
          });
          payload = {
            query: params.query,
            provider: params.provider,
            count: mapped.length,
            tookMs: Date.now() - start,
            results: mapped,
          };
          (0, web_shared_js_1.writeCache)(SEARCH_CACHE, cacheKey, payload, params.cacheTtlMs);
          return [2 /*return*/, payload];
      }
    });
  });
}
function createWebSearchTool(options) {
  var _this = this;
  var search = resolveSearchConfig(
    options === null || options === void 0 ? void 0 : options.config,
  );
  if (
    !resolveSearchEnabled({
      search: search,
      sandboxed: options === null || options === void 0 ? void 0 : options.sandboxed,
    })
  ) {
    return null;
  }
  var provider = resolveSearchProvider(search);
  var perplexityConfig = resolvePerplexityConfig(search);
  var description =
    provider === "perplexity"
      ? "Search the web using Perplexity Sonar (direct or via OpenRouter). Returns AI-synthesized answers with citations from real-time web search."
      : "Search the web using Brave Search API. Supports region-specific and localized search via country and language parameters. Returns titles, URLs, and snippets for fast research.";
  return {
    label: "Web Search",
    name: "web_search",
    description: description,
    parameters: WebSearchSchema,
    execute: function (_toolCallId, args) {
      return __awaiter(_this, void 0, void 0, function () {
        var perplexityAuth,
          apiKey,
          params,
          query,
          count,
          country,
          search_lang,
          ui_lang,
          rawFreshness,
          freshness,
          result;
        var _a, _b;
        return __generator(this, function (_c) {
          switch (_c.label) {
            case 0:
              perplexityAuth =
                provider === "perplexity" ? resolvePerplexityApiKey(perplexityConfig) : undefined;
              apiKey =
                provider === "perplexity"
                  ? perplexityAuth === null || perplexityAuth === void 0
                    ? void 0
                    : perplexityAuth.apiKey
                  : resolveSearchApiKey(search);
              if (!apiKey) {
                return [
                  2 /*return*/,
                  (0, common_js_1.jsonResult)(missingSearchKeyPayload(provider)),
                ];
              }
              params = args;
              query = (0, common_js_1.readStringParam)(params, "query", { required: true });
              count =
                (_b =
                  (_a = (0, common_js_1.readNumberParam)(params, "count", { integer: true })) !==
                    null && _a !== void 0
                    ? _a
                    : search === null || search === void 0
                      ? void 0
                      : search.maxResults) !== null && _b !== void 0
                  ? _b
                  : undefined;
              country = (0, common_js_1.readStringParam)(params, "country");
              search_lang = (0, common_js_1.readStringParam)(params, "search_lang");
              ui_lang = (0, common_js_1.readStringParam)(params, "ui_lang");
              rawFreshness = (0, common_js_1.readStringParam)(params, "freshness");
              if (rawFreshness && provider !== "brave") {
                return [
                  2 /*return*/,
                  (0, common_js_1.jsonResult)({
                    error: "unsupported_freshness",
                    message: "freshness is only supported by the Brave web_search provider.",
                    docs: "https://docs.openclaw.ai/tools/web",
                  }),
                ];
              }
              freshness = rawFreshness ? normalizeFreshness(rawFreshness) : undefined;
              if (rawFreshness && !freshness) {
                return [
                  2 /*return*/,
                  (0, common_js_1.jsonResult)({
                    error: "invalid_freshness",
                    message:
                      "freshness must be one of pd, pw, pm, py, or a range like YYYY-MM-DDtoYYYY-MM-DD.",
                    docs: "https://docs.openclaw.ai/tools/web",
                  }),
                ];
              }
              return [
                4 /*yield*/,
                runWebSearch({
                  query: query,
                  count: resolveSearchCount(count, DEFAULT_SEARCH_COUNT),
                  apiKey: apiKey,
                  timeoutSeconds: (0, web_shared_js_1.resolveTimeoutSeconds)(
                    search === null || search === void 0 ? void 0 : search.timeoutSeconds,
                    web_shared_js_1.DEFAULT_TIMEOUT_SECONDS,
                  ),
                  cacheTtlMs: (0, web_shared_js_1.resolveCacheTtlMs)(
                    search === null || search === void 0 ? void 0 : search.cacheTtlMinutes,
                    web_shared_js_1.DEFAULT_CACHE_TTL_MINUTES,
                  ),
                  provider: provider,
                  country: country,
                  search_lang: search_lang,
                  ui_lang: ui_lang,
                  freshness: freshness,
                  perplexityBaseUrl: resolvePerplexityBaseUrl(
                    perplexityConfig,
                    perplexityAuth === null || perplexityAuth === void 0
                      ? void 0
                      : perplexityAuth.source,
                    perplexityAuth === null || perplexityAuth === void 0
                      ? void 0
                      : perplexityAuth.apiKey,
                  ),
                  perplexityModel: resolvePerplexityModel(perplexityConfig),
                }),
              ];
            case 1:
              result = _c.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)(result)];
          }
        });
      });
    },
  };
}
exports.__testing = {
  inferPerplexityBaseUrlFromApiKey: inferPerplexityBaseUrlFromApiKey,
  resolvePerplexityBaseUrl: resolvePerplexityBaseUrl,
  normalizeFreshness: normalizeFreshness,
};
