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
exports.registerBrowserAgentDebugRoutes = registerBrowserAgentDebugRoutes;
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var agent_shared_js_1 = require("./agent.shared.js");
var utils_js_1 = require("./utils.js");
function registerBrowserAgentDebugRoutes(app, ctx) {
  var _this = this;
  app.get("/console", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, targetId, level, tab, pw, messages, err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            targetId = typeof req.query.targetId === "string" ? req.query.targetId.trim() : "";
            level = typeof req.query.level === "string" ? req.query.level : "";
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId || undefined)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "console messages")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.getConsoleMessagesViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                level: level.trim() || undefined,
              }),
            ];
          case 4:
            messages = _a.sent();
            res.json({ ok: true, messages: messages, targetId: tab.targetId });
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
  app.get("/errors", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, targetId, clear, tab, pw, result, err_2;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            targetId = typeof req.query.targetId === "string" ? req.query.targetId.trim() : "";
            clear =
              (_a = (0, utils_js_1.toBoolean)(req.query.clear)) !== null && _a !== void 0
                ? _a
                : false;
            _b.label = 1;
          case 1:
            _b.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId || undefined)];
          case 2:
            tab = _b.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "page errors")];
          case 3:
            pw = _b.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.getPageErrorsViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                clear: clear,
              }),
            ];
          case 4:
            result = _b.sent();
            res.json(__assign({ ok: true, targetId: tab.targetId }, result));
            return [3 /*break*/, 6];
          case 5:
            err_2 = _b.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_2);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.get("/requests", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, targetId, filter, clear, tab, pw, result, err_3;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            targetId = typeof req.query.targetId === "string" ? req.query.targetId.trim() : "";
            filter = typeof req.query.filter === "string" ? req.query.filter : "";
            clear =
              (_a = (0, utils_js_1.toBoolean)(req.query.clear)) !== null && _a !== void 0
                ? _a
                : false;
            _b.label = 1;
          case 1:
            _b.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId || undefined)];
          case 2:
            tab = _b.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "network requests")];
          case 3:
            pw = _b.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.getNetworkRequestsViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                filter: filter.trim() || undefined,
                clear: clear,
              }),
            ];
          case 4:
            result = _b.sent();
            res.json(__assign({ ok: true, targetId: tab.targetId }, result));
            return [3 /*break*/, 6];
          case 5:
            err_3 = _b.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_3);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/trace/start", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, screenshots, snapshots, sources, tab, pw, err_4;
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
            screenshots =
              (_a = (0, utils_js_1.toBoolean)(body.screenshots)) !== null && _a !== void 0
                ? _a
                : undefined;
            snapshots =
              (_b = (0, utils_js_1.toBoolean)(body.snapshots)) !== null && _b !== void 0
                ? _b
                : undefined;
            sources =
              (_c = (0, utils_js_1.toBoolean)(body.sources)) !== null && _c !== void 0
                ? _c
                : undefined;
            _d.label = 1;
          case 1:
            _d.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _d.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "trace start")];
          case 3:
            pw = _d.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.traceStartViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                screenshots: screenshots,
                snapshots: snapshots,
                sources: sources,
              }),
            ];
          case 4:
            _d.sent();
            res.json({ ok: true, targetId: tab.targetId });
            return [3 /*break*/, 6];
          case 5:
            err_4 = _d.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_4);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/trace/stop", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, out, tab, pw, id, dir, tracePath, err_5;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            out = (0, utils_js_1.toStringOrEmpty)(body.path) || "";
            _a.label = 1;
          case 1:
            _a.trys.push([1, 6, , 7]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "trace stop")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            id = node_crypto_1.default.randomUUID();
            dir = "/tmp/openclaw";
            return [4 /*yield*/, promises_1.default.mkdir(dir, { recursive: true })];
          case 4:
            _a.sent();
            tracePath =
              out.trim() || node_path_1.default.join(dir, "browser-trace-".concat(id, ".zip"));
            return [
              4 /*yield*/,
              pw.traceStopViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                path: tracePath,
              }),
            ];
          case 5:
            _a.sent();
            res.json({
              ok: true,
              targetId: tab.targetId,
              path: node_path_1.default.resolve(tracePath),
            });
            return [3 /*break*/, 7];
          case 6:
            err_5 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_5);
            return [3 /*break*/, 7];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  });
}
