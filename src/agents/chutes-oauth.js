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
exports.CHUTES_USERINFO_ENDPOINT =
  exports.CHUTES_TOKEN_ENDPOINT =
  exports.CHUTES_AUTHORIZE_ENDPOINT =
  exports.CHUTES_OAUTH_ISSUER =
    void 0;
exports.generateChutesPkce = generateChutesPkce;
exports.parseOAuthCallbackInput = parseOAuthCallbackInput;
exports.fetchChutesUserInfo = fetchChutesUserInfo;
exports.exchangeChutesCodeForTokens = exchangeChutesCodeForTokens;
exports.refreshChutesTokens = refreshChutesTokens;
var node_crypto_1 = require("node:crypto");
exports.CHUTES_OAUTH_ISSUER = "https://api.chutes.ai";
exports.CHUTES_AUTHORIZE_ENDPOINT = "".concat(exports.CHUTES_OAUTH_ISSUER, "/idp/authorize");
exports.CHUTES_TOKEN_ENDPOINT = "".concat(exports.CHUTES_OAUTH_ISSUER, "/idp/token");
exports.CHUTES_USERINFO_ENDPOINT = "".concat(exports.CHUTES_OAUTH_ISSUER, "/idp/userinfo");
var DEFAULT_EXPIRES_BUFFER_MS = 5 * 60 * 1000;
function generateChutesPkce() {
  var verifier = (0, node_crypto_1.randomBytes)(32).toString("hex");
  var challenge = (0, node_crypto_1.createHash)("sha256").update(verifier).digest("base64url");
  return { verifier: verifier, challenge: challenge };
}
function parseOAuthCallbackInput(input, expectedState) {
  var trimmed = input.trim();
  if (!trimmed) {
    return { error: "No input provided" };
  }
  try {
    var url = new URL(trimmed);
    var code = url.searchParams.get("code");
    var state = url.searchParams.get("state");
    if (!code) {
      return { error: "Missing 'code' parameter in URL" };
    }
    if (!state) {
      return { error: "Missing 'state' parameter. Paste the full URL." };
    }
    return { code: code, state: state };
  } catch (_a) {
    if (!expectedState) {
      return { error: "Paste the full redirect URL, not just the code." };
    }
    return { code: trimmed, state: expectedState };
  }
}
function coerceExpiresAt(expiresInSeconds, now) {
  var value = now + Math.max(0, Math.floor(expiresInSeconds)) * 1000 - DEFAULT_EXPIRES_BUFFER_MS;
  return Math.max(value, now + 30000);
}
function fetchChutesUserInfo(params) {
  return __awaiter(this, void 0, void 0, function () {
    var fetchFn, response, data, typed;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          fetchFn = (_a = params.fetchFn) !== null && _a !== void 0 ? _a : fetch;
          return [
            4 /*yield*/,
            fetchFn(exports.CHUTES_USERINFO_ENDPOINT, {
              headers: { Authorization: "Bearer ".concat(params.accessToken) },
            }),
          ];
        case 1:
          response = _b.sent();
          if (!response.ok) {
            return [2 /*return*/, null];
          }
          return [4 /*yield*/, response.json()];
        case 2:
          data = _b.sent();
          if (!data || typeof data !== "object") {
            return [2 /*return*/, null];
          }
          typed = data;
          return [2 /*return*/, typed];
      }
    });
  });
}
function exchangeChutesCodeForTokens(params) {
  return __awaiter(this, void 0, void 0, function () {
    var fetchFn, now, body, response, text, data, access, refresh, expiresIn, info;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          fetchFn = (_a = params.fetchFn) !== null && _a !== void 0 ? _a : fetch;
          now = (_b = params.now) !== null && _b !== void 0 ? _b : Date.now();
          body = new URLSearchParams({
            grant_type: "authorization_code",
            client_id: params.app.clientId,
            code: params.code,
            redirect_uri: params.app.redirectUri,
            code_verifier: params.codeVerifier,
          });
          if (params.app.clientSecret) {
            body.set("client_secret", params.app.clientSecret);
          }
          return [
            4 /*yield*/,
            fetchFn(exports.CHUTES_TOKEN_ENDPOINT, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: body,
            }),
          ];
        case 1:
          response = _f.sent();
          if (!!response.ok) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, response.text()];
        case 2:
          text = _f.sent();
          throw new Error("Chutes token exchange failed: ".concat(text));
        case 3:
          return [4 /*yield*/, response.json()];
        case 4:
          data = _f.sent();
          access = (_c = data.access_token) === null || _c === void 0 ? void 0 : _c.trim();
          refresh = (_d = data.refresh_token) === null || _d === void 0 ? void 0 : _d.trim();
          expiresIn = (_e = data.expires_in) !== null && _e !== void 0 ? _e : 0;
          if (!access) {
            throw new Error("Chutes token exchange returned no access_token");
          }
          if (!refresh) {
            throw new Error("Chutes token exchange returned no refresh_token");
          }
          return [4 /*yield*/, fetchChutesUserInfo({ accessToken: access, fetchFn: fetchFn })];
        case 5:
          info = _f.sent();
          return [
            2 /*return*/,
            {
              access: access,
              refresh: refresh,
              expires: coerceExpiresAt(expiresIn, now),
              email: info === null || info === void 0 ? void 0 : info.username,
              accountId: info === null || info === void 0 ? void 0 : info.sub,
              clientId: params.app.clientId,
            },
          ];
      }
    });
  });
}
function refreshChutesTokens(params) {
  return __awaiter(this, void 0, void 0, function () {
    var fetchFn,
      now,
      refreshToken,
      clientId,
      clientSecret,
      body,
      response,
      text,
      data,
      access,
      newRefresh,
      expiresIn;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
      switch (_l.label) {
        case 0:
          fetchFn = (_a = params.fetchFn) !== null && _a !== void 0 ? _a : fetch;
          now = (_b = params.now) !== null && _b !== void 0 ? _b : Date.now();
          refreshToken =
            (_c = params.credential.refresh) === null || _c === void 0 ? void 0 : _c.trim();
          if (!refreshToken) {
            throw new Error("Chutes OAuth credential is missing refresh token");
          }
          clientId =
            (_e =
              (_d = params.credential.clientId) === null || _d === void 0 ? void 0 : _d.trim()) !==
              null && _e !== void 0
              ? _e
              : (_f = process.env.CHUTES_CLIENT_ID) === null || _f === void 0
                ? void 0
                : _f.trim();
          if (!clientId) {
            throw new Error(
              "Missing CHUTES_CLIENT_ID for Chutes OAuth refresh (set env var or re-auth).",
            );
          }
          clientSecret =
            ((_g = process.env.CHUTES_CLIENT_SECRET) === null || _g === void 0
              ? void 0
              : _g.trim()) || undefined;
          body = new URLSearchParams({
            grant_type: "refresh_token",
            client_id: clientId,
            refresh_token: refreshToken,
          });
          if (clientSecret) {
            body.set("client_secret", clientSecret);
          }
          return [
            4 /*yield*/,
            fetchFn(exports.CHUTES_TOKEN_ENDPOINT, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: body,
            }),
          ];
        case 1:
          response = _l.sent();
          if (!!response.ok) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, response.text()];
        case 2:
          text = _l.sent();
          throw new Error("Chutes token refresh failed: ".concat(text));
        case 3:
          return [4 /*yield*/, response.json()];
        case 4:
          data = _l.sent();
          access = (_h = data.access_token) === null || _h === void 0 ? void 0 : _h.trim();
          newRefresh = (_j = data.refresh_token) === null || _j === void 0 ? void 0 : _j.trim();
          expiresIn = (_k = data.expires_in) !== null && _k !== void 0 ? _k : 0;
          if (!access) {
            throw new Error("Chutes token refresh returned no access_token");
          }
          return [
            2 /*return*/,
            __assign(__assign({}, params.credential), {
              access: access,
              refresh: newRefresh || refreshToken,
              expires: coerceExpiresAt(expiresIn, now),
              clientId: clientId,
            }),
          ];
      }
    });
  });
}
