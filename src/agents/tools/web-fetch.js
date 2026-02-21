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
exports.extractReadableContent = void 0;
exports.fetchFirecrawlContent = fetchFirecrawlContent;
exports.createWebFetchTool = createWebFetchTool;
var typebox_1 = require("@sinclair/typebox");
var ssrf_js_1 = require("../../infra/net/ssrf.js");
var typebox_js_1 = require("../schema/typebox.js");
var common_js_1 = require("./common.js");
var web_shared_js_1 = require("./web-shared.js");
var web_fetch_utils_js_1 = require("./web-fetch-utils.js");
var web_fetch_utils_js_2 = require("./web-fetch-utils.js");
Object.defineProperty(exports, "extractReadableContent", {
  enumerable: true,
  get: function () {
    return web_fetch_utils_js_2.extractReadableContent;
  },
});
var EXTRACT_MODES = ["markdown", "text"];
var DEFAULT_FETCH_MAX_CHARS = 50000;
var DEFAULT_FETCH_MAX_REDIRECTS = 3;
var DEFAULT_ERROR_MAX_CHARS = 4000;
var DEFAULT_FIRECRAWL_BASE_URL = "https://api.firecrawl.dev";
var DEFAULT_FIRECRAWL_MAX_AGE_MS = 172800000;
var DEFAULT_FETCH_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
var FETCH_CACHE = new Map();
var WebFetchSchema = typebox_1.Type.Object({
  url: typebox_1.Type.String({ description: "HTTP or HTTPS URL to fetch." }),
  extractMode: typebox_1.Type.Optional(
    (0, typebox_js_1.stringEnum)(EXTRACT_MODES, {
      description: 'Extraction mode ("markdown" or "text").',
      default: "markdown",
    }),
  ),
  maxChars: typebox_1.Type.Optional(
    typebox_1.Type.Number({
      description: "Maximum characters to return (truncates when exceeded).",
      minimum: 100,
    }),
  ),
});
function resolveFetchConfig(cfg) {
  var _a, _b;
  var fetch =
    (_b =
      (_a = cfg === null || cfg === void 0 ? void 0 : cfg.tools) === null || _a === void 0
        ? void 0
        : _a.web) === null || _b === void 0
      ? void 0
      : _b.fetch;
  if (!fetch || typeof fetch !== "object") {
    return undefined;
  }
  return fetch;
}
function resolveFetchEnabled(params) {
  var _a;
  if (typeof ((_a = params.fetch) === null || _a === void 0 ? void 0 : _a.enabled) === "boolean") {
    return params.fetch.enabled;
  }
  return true;
}
function resolveFetchReadabilityEnabled(fetch) {
  if (typeof (fetch === null || fetch === void 0 ? void 0 : fetch.readability) === "boolean") {
    return fetch.readability;
  }
  return true;
}
function resolveFirecrawlConfig(fetch) {
  if (!fetch || typeof fetch !== "object") {
    return undefined;
  }
  var firecrawl = "firecrawl" in fetch ? fetch.firecrawl : undefined;
  if (!firecrawl || typeof firecrawl !== "object") {
    return undefined;
  }
  return firecrawl;
}
function resolveFirecrawlApiKey(firecrawl) {
  var _a;
  var fromConfig =
    firecrawl && "apiKey" in firecrawl && typeof firecrawl.apiKey === "string"
      ? firecrawl.apiKey.trim()
      : "";
  var fromEnv = ((_a = process.env.FIRECRAWL_API_KEY) !== null && _a !== void 0 ? _a : "").trim();
  return fromConfig || fromEnv || undefined;
}
function resolveFirecrawlEnabled(params) {
  var _a;
  if (
    typeof ((_a = params.firecrawl) === null || _a === void 0 ? void 0 : _a.enabled) === "boolean"
  ) {
    return params.firecrawl.enabled;
  }
  return Boolean(params.apiKey);
}
function resolveFirecrawlBaseUrl(firecrawl) {
  var raw =
    firecrawl && "baseUrl" in firecrawl && typeof firecrawl.baseUrl === "string"
      ? firecrawl.baseUrl.trim()
      : "";
  return raw || DEFAULT_FIRECRAWL_BASE_URL;
}
function resolveFirecrawlOnlyMainContent(firecrawl) {
  if (
    typeof (firecrawl === null || firecrawl === void 0 ? void 0 : firecrawl.onlyMainContent) ===
    "boolean"
  ) {
    return firecrawl.onlyMainContent;
  }
  return true;
}
function resolveFirecrawlMaxAgeMs(firecrawl) {
  var raw =
    firecrawl && "maxAgeMs" in firecrawl && typeof firecrawl.maxAgeMs === "number"
      ? firecrawl.maxAgeMs
      : undefined;
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return undefined;
  }
  var parsed = Math.max(0, Math.floor(raw));
  return parsed > 0 ? parsed : undefined;
}
function resolveFirecrawlMaxAgeMsOrDefault(firecrawl) {
  var resolved = resolveFirecrawlMaxAgeMs(firecrawl);
  if (typeof resolved === "number") {
    return resolved;
  }
  return DEFAULT_FIRECRAWL_MAX_AGE_MS;
}
function resolveMaxChars(value, fallback) {
  var parsed = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.max(100, Math.floor(parsed));
}
function resolveMaxRedirects(value, fallback) {
  var parsed = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.max(0, Math.floor(parsed));
}
function looksLikeHtml(value) {
  var trimmed = value.trimStart();
  if (!trimmed) {
    return false;
  }
  var head = trimmed.slice(0, 256).toLowerCase();
  return head.startsWith("<!doctype html") || head.startsWith("<html");
}
function isRedirectStatus(status) {
  return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}
function fetchWithRedirects(params) {
  return __awaiter(this, void 0, void 0, function () {
    var signal,
      visited,
      currentUrl,
      redirectCount,
      parsedUrl,
      pinned,
      dispatcher,
      res,
      err_1,
      location_1,
      nextUrl;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          signal = (0, web_shared_js_1.withTimeout)(undefined, params.timeoutSeconds * 1000);
          visited = new Set();
          currentUrl = params.url;
          redirectCount = 0;
          _b.label = 1;
        case 1:
          if (!true) {
            return [3 /*break*/, 16];
          }
          parsedUrl = void 0;
          try {
            parsedUrl = new URL(currentUrl);
          } catch (_c) {
            throw new Error("Invalid URL: must be http or https", { cause: _c });
          }
          if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            throw new Error("Invalid URL: must be http or https");
          }
          return [4 /*yield*/, (0, ssrf_js_1.resolvePinnedHostname)(parsedUrl.hostname)];
        case 2:
          pinned = _b.sent();
          dispatcher = (0, ssrf_js_1.createPinnedDispatcher)(pinned);
          res = void 0;
          _b.label = 3;
        case 3:
          _b.trys.push([3, 5, , 7]);
          return [
            4 /*yield*/,
            fetch(parsedUrl.toString(), {
              method: "GET",
              headers: {
                Accept: "*/*",
                "User-Agent": params.userAgent,
                "Accept-Language": "en-US,en;q=0.9",
              },
              signal: signal,
              redirect: "manual",
              dispatcher: dispatcher,
            }),
          ];
        case 4:
          res = _b.sent();
          return [3 /*break*/, 7];
        case 5:
          err_1 = _b.sent();
          return [4 /*yield*/, (0, ssrf_js_1.closeDispatcher)(dispatcher)];
        case 6:
          _b.sent();
          throw err_1;
        case 7:
          if (!isRedirectStatus(res.status)) {
            return [3 /*break*/, 15];
          }
          location_1 = res.headers.get("location");
          if (!!location_1) {
            return [3 /*break*/, 9];
          }
          return [4 /*yield*/, (0, ssrf_js_1.closeDispatcher)(dispatcher)];
        case 8:
          _b.sent();
          throw new Error("Redirect missing location header (".concat(res.status, ")"));
        case 9:
          redirectCount += 1;
          if (!(redirectCount > params.maxRedirects)) {
            return [3 /*break*/, 11];
          }
          return [4 /*yield*/, (0, ssrf_js_1.closeDispatcher)(dispatcher)];
        case 10:
          _b.sent();
          throw new Error("Too many redirects (limit: ".concat(params.maxRedirects, ")"));
        case 11:
          nextUrl = new URL(location_1, parsedUrl).toString();
          if (!visited.has(nextUrl)) {
            return [3 /*break*/, 13];
          }
          return [4 /*yield*/, (0, ssrf_js_1.closeDispatcher)(dispatcher)];
        case 12:
          _b.sent();
          throw new Error("Redirect loop detected");
        case 13:
          visited.add(nextUrl);
          void ((_a = res.body) === null || _a === void 0 ? void 0 : _a.cancel());
          return [4 /*yield*/, (0, ssrf_js_1.closeDispatcher)(dispatcher)];
        case 14:
          _b.sent();
          currentUrl = nextUrl;
          return [3 /*break*/, 1];
        case 15:
          return [2 /*return*/, { response: res, finalUrl: currentUrl, dispatcher: dispatcher }];
        case 16:
          return [2 /*return*/];
      }
    });
  });
}
function formatWebFetchErrorDetail(params) {
  var detail = params.detail,
    contentType = params.contentType,
    maxChars = params.maxChars;
  if (!detail) {
    return "";
  }
  var text = detail;
  var contentTypeLower =
    contentType === null || contentType === void 0 ? void 0 : contentType.toLowerCase();
  if (
    (contentTypeLower === null || contentTypeLower === void 0
      ? void 0
      : contentTypeLower.includes("text/html")) ||
    looksLikeHtml(detail)
  ) {
    var rendered = (0, web_fetch_utils_js_1.htmlToMarkdown)(detail);
    var withTitle = rendered.title
      ? "".concat(rendered.title, "\n").concat(rendered.text)
      : rendered.text;
    text = (0, web_fetch_utils_js_1.markdownToText)(withTitle);
  }
  var truncated = (0, web_fetch_utils_js_1.truncateText)(text.trim(), maxChars);
  return truncated.text;
}
function fetchFirecrawlContent(params) {
  return __awaiter(this, void 0, void 0, function () {
    var endpoint, body, res, payload, detail, data, rawText, text;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          endpoint = resolveFirecrawlEndpoint(params.baseUrl);
          body = {
            url: params.url,
            formats: ["markdown"],
            onlyMainContent: params.onlyMainContent,
            timeout: params.timeoutSeconds * 1000,
            maxAge: params.maxAgeMs,
            proxy: params.proxy,
            storeInCache: params.storeInCache,
          };
          return [
            4 /*yield*/,
            fetch(endpoint, {
              method: "POST",
              headers: {
                Authorization: "Bearer ".concat(params.apiKey),
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
              signal: (0, web_shared_js_1.withTimeout)(undefined, params.timeoutSeconds * 1000),
            }),
          ];
        case 1:
          res = _e.sent();
          return [4 /*yield*/, res.json()];
        case 2:
          payload = _e.sent();
          if (
            !res.ok ||
            (payload === null || payload === void 0 ? void 0 : payload.success) === false
          ) {
            detail =
              (payload === null || payload === void 0 ? void 0 : payload.error) || res.statusText;
            throw new Error(
              "Firecrawl fetch failed (".concat(res.status, "): ").concat(detail).trim(),
            );
          }
          data =
            (_a = payload === null || payload === void 0 ? void 0 : payload.data) !== null &&
            _a !== void 0
              ? _a
              : {};
          rawText =
            typeof data.markdown === "string"
              ? data.markdown
              : typeof data.content === "string"
                ? data.content
                : "";
          text =
            params.extractMode === "text"
              ? (0, web_fetch_utils_js_1.markdownToText)(rawText)
              : rawText;
          return [
            2 /*return*/,
            {
              text: text,
              title: (_b = data.metadata) === null || _b === void 0 ? void 0 : _b.title,
              finalUrl: (_c = data.metadata) === null || _c === void 0 ? void 0 : _c.sourceURL,
              status: (_d = data.metadata) === null || _d === void 0 ? void 0 : _d.statusCode,
              warning: payload === null || payload === void 0 ? void 0 : payload.warning,
            },
          ];
      }
    });
  });
}
function runWebFetch(params) {
  return __awaiter(this, void 0, void 0, function () {
    var cacheKey,
      cached,
      parsedUrl,
      start,
      res,
      dispatcher,
      finalUrl,
      result,
      error_1,
      firecrawl,
      truncated,
      payload,
      firecrawl,
      truncated_1,
      payload_1,
      rawDetail,
      detail,
      contentType,
      body,
      title,
      extractor,
      text,
      readable,
      firecrawl,
      truncated,
      payload;
    var _a, _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          cacheKey = (0, web_shared_js_1.normalizeCacheKey)(
            "fetch:"
              .concat(params.url, ":")
              .concat(params.extractMode, ":")
              .concat(params.maxChars),
          );
          cached = (0, web_shared_js_1.readCache)(FETCH_CACHE, cacheKey);
          if (cached) {
            return [2 /*return*/, __assign(__assign({}, cached.value), { cached: true })];
          }
          try {
            parsedUrl = new URL(params.url);
          } catch (_e) {
            throw new Error("Invalid URL: must be http or https", { cause: _e });
          }
          if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            throw new Error("Invalid URL: must be http or https");
          }
          start = Date.now();
          dispatcher = null;
          finalUrl = params.url;
          _d.label = 1;
        case 1:
          _d.trys.push([1, 3, , 6]);
          return [
            4 /*yield*/,
            fetchWithRedirects({
              url: params.url,
              maxRedirects: params.maxRedirects,
              timeoutSeconds: params.timeoutSeconds,
              userAgent: params.userAgent,
            }),
          ];
        case 2:
          result = _d.sent();
          res = result.response;
          finalUrl = result.finalUrl;
          dispatcher = result.dispatcher;
          return [3 /*break*/, 6];
        case 3:
          error_1 = _d.sent();
          if (error_1 instanceof ssrf_js_1.SsrFBlockedError) {
            throw error_1;
          }
          if (!(params.firecrawlEnabled && params.firecrawlApiKey)) {
            return [3 /*break*/, 5];
          }
          return [
            4 /*yield*/,
            fetchFirecrawlContent({
              url: finalUrl,
              extractMode: params.extractMode,
              apiKey: params.firecrawlApiKey,
              baseUrl: params.firecrawlBaseUrl,
              onlyMainContent: params.firecrawlOnlyMainContent,
              maxAgeMs: params.firecrawlMaxAgeMs,
              proxy: params.firecrawlProxy,
              storeInCache: params.firecrawlStoreInCache,
              timeoutSeconds: params.firecrawlTimeoutSeconds,
            }),
          ];
        case 4:
          firecrawl = _d.sent();
          truncated = (0, web_fetch_utils_js_1.truncateText)(firecrawl.text, params.maxChars);
          payload = {
            url: params.url,
            finalUrl: firecrawl.finalUrl || finalUrl,
            status: (_a = firecrawl.status) !== null && _a !== void 0 ? _a : 200,
            contentType: "text/markdown",
            title: firecrawl.title,
            extractMode: params.extractMode,
            extractor: "firecrawl",
            truncated: truncated.truncated,
            length: truncated.text.length,
            fetchedAt: new Date().toISOString(),
            tookMs: Date.now() - start,
            text: truncated.text,
            warning: firecrawl.warning,
          };
          (0, web_shared_js_1.writeCache)(FETCH_CACHE, cacheKey, payload, params.cacheTtlMs);
          return [2 /*return*/, payload];
        case 5:
          throw error_1;
        case 6:
          _d.trys.push([6, , 20, 22]);
          if (!!res.ok) {
            return [3 /*break*/, 10];
          }
          if (!(params.firecrawlEnabled && params.firecrawlApiKey)) {
            return [3 /*break*/, 8];
          }
          return [
            4 /*yield*/,
            fetchFirecrawlContent({
              url: params.url,
              extractMode: params.extractMode,
              apiKey: params.firecrawlApiKey,
              baseUrl: params.firecrawlBaseUrl,
              onlyMainContent: params.firecrawlOnlyMainContent,
              maxAgeMs: params.firecrawlMaxAgeMs,
              proxy: params.firecrawlProxy,
              storeInCache: params.firecrawlStoreInCache,
              timeoutSeconds: params.firecrawlTimeoutSeconds,
            }),
          ];
        case 7:
          firecrawl = _d.sent();
          truncated_1 = (0, web_fetch_utils_js_1.truncateText)(firecrawl.text, params.maxChars);
          payload_1 = {
            url: params.url,
            finalUrl: firecrawl.finalUrl || finalUrl,
            status: (_b = firecrawl.status) !== null && _b !== void 0 ? _b : res.status,
            contentType: "text/markdown",
            title: firecrawl.title,
            extractMode: params.extractMode,
            extractor: "firecrawl",
            truncated: truncated_1.truncated,
            length: truncated_1.text.length,
            fetchedAt: new Date().toISOString(),
            tookMs: Date.now() - start,
            text: truncated_1.text,
            warning: firecrawl.warning,
          };
          (0, web_shared_js_1.writeCache)(FETCH_CACHE, cacheKey, payload_1, params.cacheTtlMs);
          return [2 /*return*/, payload_1];
        case 8:
          return [4 /*yield*/, (0, web_shared_js_1.readResponseText)(res)];
        case 9:
          rawDetail = _d.sent();
          detail = formatWebFetchErrorDetail({
            detail: rawDetail,
            contentType: res.headers.get("content-type"),
            maxChars: DEFAULT_ERROR_MAX_CHARS,
          });
          throw new Error(
            "Web fetch failed (".concat(res.status, "): ").concat(detail || res.statusText),
          );
        case 10:
          contentType =
            (_c = res.headers.get("content-type")) !== null && _c !== void 0
              ? _c
              : "application/octet-stream";
          return [4 /*yield*/, (0, web_shared_js_1.readResponseText)(res)];
        case 11:
          body = _d.sent();
          title = void 0;
          extractor = "raw";
          text = body;
          if (!contentType.includes("text/html")) {
            return [3 /*break*/, 18];
          }
          if (!params.readabilityEnabled) {
            return [3 /*break*/, 16];
          }
          return [
            4 /*yield*/,
            (0, web_fetch_utils_js_1.extractReadableContent)({
              html: body,
              url: finalUrl,
              extractMode: params.extractMode,
            }),
          ];
        case 12:
          readable = _d.sent();
          if (!(readable === null || readable === void 0 ? void 0 : readable.text)) {
            return [3 /*break*/, 13];
          }
          text = readable.text;
          title = readable.title;
          extractor = "readability";
          return [3 /*break*/, 15];
        case 13:
          return [
            4 /*yield*/,
            tryFirecrawlFallback(__assign(__assign({}, params), { url: finalUrl })),
          ];
        case 14:
          firecrawl = _d.sent();
          if (firecrawl) {
            text = firecrawl.text;
            title = firecrawl.title;
            extractor = "firecrawl";
          } else {
            throw new Error(
              "Web fetch extraction failed: Readability and Firecrawl returned no content.",
            );
          }
          _d.label = 15;
        case 15:
          return [3 /*break*/, 17];
        case 16:
          throw new Error(
            "Web fetch extraction failed: Readability disabled and Firecrawl unavailable.",
          );
        case 17:
          return [3 /*break*/, 19];
        case 18:
          if (contentType.includes("application/json")) {
            try {
              text = JSON.stringify(JSON.parse(body), null, 2);
              extractor = "json";
            } catch (_f) {
              text = body;
              extractor = "raw";
            }
          }
          _d.label = 19;
        case 19:
          truncated = (0, web_fetch_utils_js_1.truncateText)(text, params.maxChars);
          payload = {
            url: params.url,
            finalUrl: finalUrl,
            status: res.status,
            contentType: contentType,
            title: title,
            extractMode: params.extractMode,
            extractor: extractor,
            truncated: truncated.truncated,
            length: truncated.text.length,
            fetchedAt: new Date().toISOString(),
            tookMs: Date.now() - start,
            text: truncated.text,
          };
          (0, web_shared_js_1.writeCache)(FETCH_CACHE, cacheKey, payload, params.cacheTtlMs);
          return [2 /*return*/, payload];
        case 20:
          return [4 /*yield*/, (0, ssrf_js_1.closeDispatcher)(dispatcher)];
        case 21:
          _d.sent();
          return [7 /*endfinally*/];
        case 22:
          return [2 /*return*/];
      }
    });
  });
}
function tryFirecrawlFallback(params) {
  return __awaiter(this, void 0, void 0, function () {
    var firecrawl, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (!params.firecrawlEnabled || !params.firecrawlApiKey) {
            return [2 /*return*/, null];
          }
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            fetchFirecrawlContent({
              url: params.url,
              extractMode: params.extractMode,
              apiKey: params.firecrawlApiKey,
              baseUrl: params.firecrawlBaseUrl,
              onlyMainContent: params.firecrawlOnlyMainContent,
              maxAgeMs: params.firecrawlMaxAgeMs,
              proxy: params.firecrawlProxy,
              storeInCache: params.firecrawlStoreInCache,
              timeoutSeconds: params.firecrawlTimeoutSeconds,
            }),
          ];
        case 2:
          firecrawl = _b.sent();
          return [2 /*return*/, { text: firecrawl.text, title: firecrawl.title }];
        case 3:
          _a = _b.sent();
          return [2 /*return*/, null];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function resolveFirecrawlEndpoint(baseUrl) {
  var trimmed = baseUrl.trim();
  if (!trimmed) {
    return "".concat(DEFAULT_FIRECRAWL_BASE_URL, "/v2/scrape");
  }
  try {
    var url = new URL(trimmed);
    if (url.pathname && url.pathname !== "/") {
      return url.toString();
    }
    url.pathname = "/v2/scrape";
    return url.toString();
  } catch (_a) {
    return "".concat(DEFAULT_FIRECRAWL_BASE_URL, "/v2/scrape");
  }
}
function createWebFetchTool(options) {
  var _this = this;
  var _a;
  var fetch = resolveFetchConfig(options === null || options === void 0 ? void 0 : options.config);
  if (
    !resolveFetchEnabled({
      fetch: fetch,
      sandboxed: options === null || options === void 0 ? void 0 : options.sandboxed,
    })
  ) {
    return null;
  }
  var readabilityEnabled = resolveFetchReadabilityEnabled(fetch);
  var firecrawl = resolveFirecrawlConfig(fetch);
  var firecrawlApiKey = resolveFirecrawlApiKey(firecrawl);
  var firecrawlEnabled = resolveFirecrawlEnabled({ firecrawl: firecrawl, apiKey: firecrawlApiKey });
  var firecrawlBaseUrl = resolveFirecrawlBaseUrl(firecrawl);
  var firecrawlOnlyMainContent = resolveFirecrawlOnlyMainContent(firecrawl);
  var firecrawlMaxAgeMs = resolveFirecrawlMaxAgeMsOrDefault(firecrawl);
  var firecrawlTimeoutSeconds = (0, web_shared_js_1.resolveTimeoutSeconds)(
    (_a = firecrawl === null || firecrawl === void 0 ? void 0 : firecrawl.timeoutSeconds) !==
      null && _a !== void 0
      ? _a
      : fetch === null || fetch === void 0
        ? void 0
        : fetch.timeoutSeconds,
    web_shared_js_1.DEFAULT_TIMEOUT_SECONDS,
  );
  var userAgent =
    (fetch && "userAgent" in fetch && typeof fetch.userAgent === "string" && fetch.userAgent) ||
    DEFAULT_FETCH_USER_AGENT;
  return {
    label: "Web Fetch",
    name: "web_fetch",
    description:
      "Fetch and extract readable content from a URL (HTML → markdown/text). Use for lightweight page access without browser automation.",
    parameters: WebFetchSchema,
    execute: function (_toolCallId, args) {
      return __awaiter(_this, void 0, void 0, function () {
        var params, url, extractMode, maxChars, result;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              params = args;
              url = (0, common_js_1.readStringParam)(params, "url", { required: true });
              extractMode =
                (0, common_js_1.readStringParam)(params, "extractMode") === "text"
                  ? "text"
                  : "markdown";
              maxChars = (0, common_js_1.readNumberParam)(params, "maxChars", { integer: true });
              return [
                4 /*yield*/,
                runWebFetch({
                  url: url,
                  extractMode: extractMode,
                  maxChars: resolveMaxChars(
                    maxChars !== null && maxChars !== void 0
                      ? maxChars
                      : fetch === null || fetch === void 0
                        ? void 0
                        : fetch.maxChars,
                    DEFAULT_FETCH_MAX_CHARS,
                  ),
                  maxRedirects: resolveMaxRedirects(
                    fetch === null || fetch === void 0 ? void 0 : fetch.maxRedirects,
                    DEFAULT_FETCH_MAX_REDIRECTS,
                  ),
                  timeoutSeconds: (0, web_shared_js_1.resolveTimeoutSeconds)(
                    fetch === null || fetch === void 0 ? void 0 : fetch.timeoutSeconds,
                    web_shared_js_1.DEFAULT_TIMEOUT_SECONDS,
                  ),
                  cacheTtlMs: (0, web_shared_js_1.resolveCacheTtlMs)(
                    fetch === null || fetch === void 0 ? void 0 : fetch.cacheTtlMinutes,
                    web_shared_js_1.DEFAULT_CACHE_TTL_MINUTES,
                  ),
                  userAgent: userAgent,
                  readabilityEnabled: readabilityEnabled,
                  firecrawlEnabled: firecrawlEnabled,
                  firecrawlApiKey: firecrawlApiKey,
                  firecrawlBaseUrl: firecrawlBaseUrl,
                  firecrawlOnlyMainContent: firecrawlOnlyMainContent,
                  firecrawlMaxAgeMs: firecrawlMaxAgeMs,
                  firecrawlProxy: "auto",
                  firecrawlStoreInCache: true,
                  firecrawlTimeoutSeconds: firecrawlTimeoutSeconds,
                }),
              ];
            case 1:
              result = _a.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)(result)];
          }
        });
      });
    },
  };
}
