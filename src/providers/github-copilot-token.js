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
exports.DEFAULT_COPILOT_API_BASE_URL = void 0;
exports.deriveCopilotApiBaseUrlFromToken = deriveCopilotApiBaseUrlFromToken;
exports.resolveCopilotApiToken = resolveCopilotApiToken;
var node_path_1 = require("node:path");
var paths_js_1 = require("../config/paths.js");
var json_file_js_1 = require("../infra/json-file.js");
var COPILOT_TOKEN_URL = "https://api.github.com/copilot_internal/v2/token";
function resolveCopilotTokenCachePath(env) {
  if (env === void 0) {
    env = process.env;
  }
  return node_path_1.default.join(
    (0, paths_js_1.resolveStateDir)(env),
    "credentials",
    "github-copilot.token.json",
  );
}
function isTokenUsable(cache, now) {
  if (now === void 0) {
    now = Date.now();
  }
  // Keep a small safety margin when checking expiry.
  return cache.expiresAt - now > 5 * 60 * 1000;
}
function parseCopilotTokenResponse(value) {
  if (!value || typeof value !== "object") {
    throw new Error("Unexpected response from GitHub Copilot token endpoint");
  }
  var asRecord = value;
  var token = asRecord.token;
  var expiresAt = asRecord.expires_at;
  if (typeof token !== "string" || token.trim().length === 0) {
    throw new Error("Copilot token response missing token");
  }
  // GitHub returns a unix timestamp (seconds), but we defensively accept ms too.
  var expiresAtMs;
  if (typeof expiresAt === "number" && Number.isFinite(expiresAt)) {
    expiresAtMs = expiresAt > 10000000000 ? expiresAt : expiresAt * 1000;
  } else if (typeof expiresAt === "string" && expiresAt.trim().length > 0) {
    var parsed = Number.parseInt(expiresAt, 10);
    if (!Number.isFinite(parsed)) {
      throw new Error("Copilot token response has invalid expires_at");
    }
    expiresAtMs = parsed > 10000000000 ? parsed : parsed * 1000;
  } else {
    throw new Error("Copilot token response missing expires_at");
  }
  return { token: token, expiresAt: expiresAtMs };
}
exports.DEFAULT_COPILOT_API_BASE_URL = "https://api.individual.githubcopilot.com";
function deriveCopilotApiBaseUrlFromToken(token) {
  var _a;
  var trimmed = token.trim();
  if (!trimmed) {
    return null;
  }
  // The token returned from the Copilot token endpoint is a semicolon-delimited
  // set of key/value pairs. One of them is `proxy-ep=...`.
  var match = trimmed.match(/(?:^|;)\s*proxy-ep=([^;\s]+)/i);
  var proxyEp =
    (_a = match === null || match === void 0 ? void 0 : match[1]) === null || _a === void 0
      ? void 0
      : _a.trim();
  if (!proxyEp) {
    return null;
  }
  // pi-ai expects converting proxy.* -> api.*
  // (see upstream getGitHubCopilotBaseUrl).
  var host = proxyEp.replace(/^https?:\/\//, "").replace(/^proxy\./i, "api.");
  if (!host) {
    return null;
  }
  return "https://".concat(host);
}
function resolveCopilotApiToken(params) {
  return __awaiter(this, void 0, void 0, function () {
    var env, cachePath, cached, fetchImpl, res, json, _a, payload;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          env = (_b = params.env) !== null && _b !== void 0 ? _b : process.env;
          cachePath = resolveCopilotTokenCachePath(env);
          cached = (0, json_file_js_1.loadJsonFile)(cachePath);
          if (cached && typeof cached.token === "string" && typeof cached.expiresAt === "number") {
            if (isTokenUsable(cached)) {
              return [
                2 /*return*/,
                {
                  token: cached.token,
                  expiresAt: cached.expiresAt,
                  source: "cache:".concat(cachePath),
                  baseUrl:
                    (_c = deriveCopilotApiBaseUrlFromToken(cached.token)) !== null && _c !== void 0
                      ? _c
                      : exports.DEFAULT_COPILOT_API_BASE_URL,
                },
              ];
            }
          }
          fetchImpl = (_d = params.fetchImpl) !== null && _d !== void 0 ? _d : fetch;
          return [
            4 /*yield*/,
            fetchImpl(COPILOT_TOKEN_URL, {
              method: "GET",
              headers: {
                Accept: "application/json",
                Authorization: "Bearer ".concat(params.githubToken),
              },
            }),
          ];
        case 1:
          res = _f.sent();
          if (!res.ok) {
            throw new Error("Copilot token exchange failed: HTTP ".concat(res.status));
          }
          _a = parseCopilotTokenResponse;
          return [4 /*yield*/, res.json()];
        case 2:
          json = _a.apply(void 0, [_f.sent()]);
          payload = {
            token: json.token,
            expiresAt: json.expiresAt,
            updatedAt: Date.now(),
          };
          (0, json_file_js_1.saveJsonFile)(cachePath, payload);
          return [
            2 /*return*/,
            {
              token: payload.token,
              expiresAt: payload.expiresAt,
              source: "fetched:".concat(COPILOT_TOKEN_URL),
              baseUrl:
                (_e = deriveCopilotApiBaseUrlFromToken(payload.token)) !== null && _e !== void 0
                  ? _e
                  : exports.DEFAULT_COPILOT_API_BASE_URL,
            },
          ];
      }
    });
  });
}
