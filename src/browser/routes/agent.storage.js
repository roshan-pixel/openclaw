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
exports.registerBrowserAgentStorageRoutes = registerBrowserAgentStorageRoutes;
var agent_shared_js_1 = require("./agent.shared.js");
var utils_js_1 = require("./utils.js");
function registerBrowserAgentStorageRoutes(app, ctx) {
  var _this = this;
  app.get("/cookies", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, targetId, tab, pw, result, err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            targetId = typeof req.query.targetId === "string" ? req.query.targetId.trim() : "";
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId || undefined)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "cookies")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.cookiesGetViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
              }),
            ];
          case 4:
            result = _a.sent();
            res.json(__assign({ ok: true, targetId: tab.targetId }, result));
            return [3 /*break*/, 6];
          case 5:
            err_1 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_1);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/cookies/set", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, cookie, tab, pw, err_2;
      var _a, _b, _c;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            cookie =
              body.cookie && typeof body.cookie === "object" && !Array.isArray(body.cookie)
                ? body.cookie
                : null;
            if (!cookie) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "cookie is required")];
            }
            _d.label = 1;
          case 1:
            _d.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _d.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "cookies set")];
          case 3:
            pw = _d.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.cookiesSetViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                cookie: {
                  name: (0, utils_js_1.toStringOrEmpty)(cookie.name),
                  value: (0, utils_js_1.toStringOrEmpty)(cookie.value),
                  url: (0, utils_js_1.toStringOrEmpty)(cookie.url) || undefined,
                  domain: (0, utils_js_1.toStringOrEmpty)(cookie.domain) || undefined,
                  path: (0, utils_js_1.toStringOrEmpty)(cookie.path) || undefined,
                  expires:
                    (_a = (0, utils_js_1.toNumber)(cookie.expires)) !== null && _a !== void 0
                      ? _a
                      : undefined,
                  httpOnly:
                    (_b = (0, utils_js_1.toBoolean)(cookie.httpOnly)) !== null && _b !== void 0
                      ? _b
                      : undefined,
                  secure:
                    (_c = (0, utils_js_1.toBoolean)(cookie.secure)) !== null && _c !== void 0
                      ? _c
                      : undefined,
                  sameSite:
                    cookie.sameSite === "Lax" ||
                    cookie.sameSite === "None" ||
                    cookie.sameSite === "Strict"
                      ? cookie.sameSite
                      : undefined,
                },
              }),
            ];
          case 4:
            _d.sent();
            res.json({ ok: true, targetId: tab.targetId });
            return [3 /*break*/, 6];
          case 5:
            err_2 = _d.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_2);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/cookies/clear", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, tab, pw, err_3;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "cookies clear")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.cookiesClearViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
              }),
            ];
          case 4:
            _a.sent();
            res.json({ ok: true, targetId: tab.targetId });
            return [3 /*break*/, 6];
          case 5:
            err_3 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_3);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.get("/storage/:kind", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, kind, targetId, key, tab, pw, result, err_4;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            kind = (0, utils_js_1.toStringOrEmpty)(req.params.kind);
            if (kind !== "local" && kind !== "session") {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, 400, "kind must be local|session"),
              ];
            }
            targetId = typeof req.query.targetId === "string" ? req.query.targetId.trim() : "";
            key = typeof req.query.key === "string" ? req.query.key : "";
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId || undefined)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "storage get")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.storageGetViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                kind: kind,
                key: key.trim() || undefined,
              }),
            ];
          case 4:
            result = _a.sent();
            res.json(__assign({ ok: true, targetId: tab.targetId }, result));
            return [3 /*break*/, 6];
          case 5:
            err_4 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_4);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/storage/:kind/set", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, kind, body, targetId, key, value, tab, pw, err_5;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            kind = (0, utils_js_1.toStringOrEmpty)(req.params.kind);
            if (kind !== "local" && kind !== "session") {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, 400, "kind must be local|session"),
              ];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            key = (0, utils_js_1.toStringOrEmpty)(body.key);
            if (!key) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "key is required")];
            }
            value = typeof body.value === "string" ? body.value : "";
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "storage set")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.storageSetViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                kind: kind,
                key: key,
                value: value,
              }),
            ];
          case 4:
            _a.sent();
            res.json({ ok: true, targetId: tab.targetId });
            return [3 /*break*/, 6];
          case 5:
            err_5 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_5);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/storage/:kind/clear", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, kind, body, targetId, tab, pw, err_6;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            kind = (0, utils_js_1.toStringOrEmpty)(req.params.kind);
            if (kind !== "local" && kind !== "session") {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, 400, "kind must be local|session"),
              ];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "storage clear")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.storageClearViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                kind: kind,
              }),
            ];
          case 4:
            _a.sent();
            res.json({ ok: true, targetId: tab.targetId });
            return [3 /*break*/, 6];
          case 5:
            err_6 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_6);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/set/offline", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, offline, tab, pw, err_7;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            offline = (0, utils_js_1.toBoolean)(body.offline);
            if (offline === undefined) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "offline is required")];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "offline")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.setOfflineViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                offline: offline,
              }),
            ];
          case 4:
            _a.sent();
            res.json({ ok: true, targetId: tab.targetId });
            return [3 /*break*/, 6];
          case 5:
            err_7 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_7);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/set/headers", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, headers, parsed, _i, _a, _b, k, v, tab, pw, err_8;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            headers =
              body.headers && typeof body.headers === "object" && !Array.isArray(body.headers)
                ? body.headers
                : null;
            if (!headers) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "headers is required")];
            }
            parsed = {};
            for (_i = 0, _a = Object.entries(headers); _i < _a.length; _i++) {
              ((_b = _a[_i]), (k = _b[0]), (v = _b[1]));
              if (typeof v === "string") {
                parsed[k] = v;
              }
            }
            _c.label = 1;
          case 1:
            _c.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _c.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "headers")];
          case 3:
            pw = _c.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.setExtraHTTPHeadersViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                headers: parsed,
              }),
            ];
          case 4:
            _c.sent();
            res.json({ ok: true, targetId: tab.targetId });
            return [3 /*break*/, 6];
          case 5:
            err_8 = _c.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_8);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/set/credentials", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, clear, username, password, tab, pw, err_9;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            clear =
              (_a = (0, utils_js_1.toBoolean)(body.clear)) !== null && _a !== void 0 ? _a : false;
            username = (0, utils_js_1.toStringOrEmpty)(body.username) || undefined;
            password = typeof body.password === "string" ? body.password : undefined;
            _b.label = 1;
          case 1:
            _b.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _b.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "http credentials")];
          case 3:
            pw = _b.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.setHttpCredentialsViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                username: username,
                password: password,
                clear: clear,
              }),
            ];
          case 4:
            _b.sent();
            res.json({ ok: true, targetId: tab.targetId });
            return [3 /*break*/, 6];
          case 5:
            err_9 = _b.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_9);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/set/geolocation", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, clear, latitude, longitude, accuracy, origin, tab, pw, err_10;
      var _a, _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            clear =
              (_a = (0, utils_js_1.toBoolean)(body.clear)) !== null && _a !== void 0 ? _a : false;
            latitude = (0, utils_js_1.toNumber)(body.latitude);
            longitude = (0, utils_js_1.toNumber)(body.longitude);
            accuracy =
              (_b = (0, utils_js_1.toNumber)(body.accuracy)) !== null && _b !== void 0
                ? _b
                : undefined;
            origin = (0, utils_js_1.toStringOrEmpty)(body.origin) || undefined;
            _c.label = 1;
          case 1:
            _c.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _c.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "geolocation")];
          case 3:
            pw = _c.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.setGeolocationViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                latitude: latitude,
                longitude: longitude,
                accuracy: accuracy,
                origin: origin,
                clear: clear,
              }),
            ];
          case 4:
            _c.sent();
            res.json({ ok: true, targetId: tab.targetId });
            return [3 /*break*/, 6];
          case 5:
            err_10 = _c.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_10);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/set/media", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, schemeRaw, colorScheme, tab, pw, err_11;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            schemeRaw = (0, utils_js_1.toStringOrEmpty)(body.colorScheme);
            colorScheme =
              schemeRaw === "dark" || schemeRaw === "light" || schemeRaw === "no-preference"
                ? schemeRaw
                : schemeRaw === "none"
                  ? null
                  : undefined;
            if (colorScheme === undefined) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(
                  res,
                  400,
                  "colorScheme must be dark|light|no-preference|none",
                ),
              ];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "media emulation")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.emulateMediaViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                colorScheme: colorScheme,
              }),
            ];
          case 4:
            _a.sent();
            res.json({ ok: true, targetId: tab.targetId });
            return [3 /*break*/, 6];
          case 5:
            err_11 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_11);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/set/timezone", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, timezoneId, tab, pw, err_12;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            timezoneId = (0, utils_js_1.toStringOrEmpty)(body.timezoneId);
            if (!timezoneId) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "timezoneId is required")];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "timezone")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.setTimezoneViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                timezoneId: timezoneId,
              }),
            ];
          case 4:
            _a.sent();
            res.json({ ok: true, targetId: tab.targetId });
            return [3 /*break*/, 6];
          case 5:
            err_12 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_12);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/set/locale", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, locale, tab, pw, err_13;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            locale = (0, utils_js_1.toStringOrEmpty)(body.locale);
            if (!locale) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "locale is required")];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "locale")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.setLocaleViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                locale: locale,
              }),
            ];
          case 4:
            _a.sent();
            res.json({ ok: true, targetId: tab.targetId });
            return [3 /*break*/, 6];
          case 5:
            err_13 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_13);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/set/device", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, name, tab, pw, err_14;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            name = (0, utils_js_1.toStringOrEmpty)(body.name);
            if (!name) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "name is required")];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "device emulation")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.setDeviceViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                name: name,
              }),
            ];
          case 4:
            _a.sent();
            res.json({ ok: true, targetId: tab.targetId });
            return [3 /*break*/, 6];
          case 5:
            err_14 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_14);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
}
