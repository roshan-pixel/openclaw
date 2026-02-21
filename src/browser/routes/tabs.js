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
exports.registerBrowserTabRoutes = registerBrowserTabRoutes;
var utils_js_1 = require("./utils.js");
function registerBrowserTabRoutes(app, ctx) {
  var _this = this;
  app.get("/tabs", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, reachable, tabs, err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, utils_js_1.getProfileContext)(req, ctx);
            if ("error" in profileCtx) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, profileCtx.status, profileCtx.error),
              ];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 4, , 5]);
            return [4 /*yield*/, profileCtx.isReachable(300)];
          case 2:
            reachable = _a.sent();
            if (!reachable) {
              return [2 /*return*/, res.json({ running: false, tabs: [] })];
            }
            return [4 /*yield*/, profileCtx.listTabs()];
          case 3:
            tabs = _a.sent();
            res.json({ running: true, tabs: tabs });
            return [3 /*break*/, 5];
          case 4:
            err_1 = _a.sent();
            (0, utils_js_1.jsonError)(res, 500, String(err_1));
            return [3 /*break*/, 5];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/tabs/open", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, url, tab, err_2;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            profileCtx = (0, utils_js_1.getProfileContext)(req, ctx);
            if ("error" in profileCtx) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, profileCtx.status, profileCtx.error),
              ];
            }
            url = (0, utils_js_1.toStringOrEmpty)(
              (_a = req.body) === null || _a === void 0 ? void 0 : _a.url,
            );
            if (!url) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "url is required")];
            }
            _b.label = 1;
          case 1:
            _b.trys.push([1, 4, , 5]);
            return [4 /*yield*/, profileCtx.ensureBrowserAvailable()];
          case 2:
            _b.sent();
            return [4 /*yield*/, profileCtx.openTab(url)];
          case 3:
            tab = _b.sent();
            res.json(tab);
            return [3 /*break*/, 5];
          case 4:
            err_2 = _b.sent();
            (0, utils_js_1.jsonError)(res, 500, String(err_2));
            return [3 /*break*/, 5];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/tabs/focus", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, targetId, err_3, mapped;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            profileCtx = (0, utils_js_1.getProfileContext)(req, ctx);
            if ("error" in profileCtx) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, profileCtx.status, profileCtx.error),
              ];
            }
            targetId = (0, utils_js_1.toStringOrEmpty)(
              (_a = req.body) === null || _a === void 0 ? void 0 : _a.targetId,
            );
            if (!targetId) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "targetId is required")];
            }
            _b.label = 1;
          case 1:
            _b.trys.push([1, 4, , 5]);
            return [4 /*yield*/, profileCtx.isReachable(300)];
          case 2:
            if (!_b.sent()) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 409, "browser not running")];
            }
            return [4 /*yield*/, profileCtx.focusTab(targetId)];
          case 3:
            _b.sent();
            res.json({ ok: true });
            return [3 /*break*/, 5];
          case 4:
            err_3 = _b.sent();
            mapped = ctx.mapTabError(err_3);
            if (mapped) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, mapped.status, mapped.message)];
            }
            (0, utils_js_1.jsonError)(res, 500, String(err_3));
            return [3 /*break*/, 5];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  });
  app.delete("/tabs/:targetId", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, targetId, err_4, mapped;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, utils_js_1.getProfileContext)(req, ctx);
            if ("error" in profileCtx) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, profileCtx.status, profileCtx.error),
              ];
            }
            targetId = (0, utils_js_1.toStringOrEmpty)(req.params.targetId);
            if (!targetId) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "targetId is required")];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 4, , 5]);
            return [4 /*yield*/, profileCtx.isReachable(300)];
          case 2:
            if (!_a.sent()) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 409, "browser not running")];
            }
            return [4 /*yield*/, profileCtx.closeTab(targetId)];
          case 3:
            _a.sent();
            res.json({ ok: true });
            return [3 /*break*/, 5];
          case 4:
            err_4 = _a.sent();
            mapped = ctx.mapTabError(err_4);
            if (mapped) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, mapped.status, mapped.message)];
            }
            (0, utils_js_1.jsonError)(res, 500, String(err_4));
            return [3 /*break*/, 5];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/tabs/action", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx,
        action,
        index,
        reachable,
        tabs,
        tab,
        tabs,
        target,
        tabs,
        target,
        err_5,
        mapped;
      var _a, _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            profileCtx = (0, utils_js_1.getProfileContext)(req, ctx);
            if ("error" in profileCtx) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, profileCtx.status, profileCtx.error),
              ];
            }
            action = (0, utils_js_1.toStringOrEmpty)(
              (_a = req.body) === null || _a === void 0 ? void 0 : _a.action,
            );
            index = (0, utils_js_1.toNumber)(
              (_b = req.body) === null || _b === void 0 ? void 0 : _b.index,
            );
            _c.label = 1;
          case 1:
            _c.trys.push([1, 14, , 15]);
            if (!(action === "list")) {
              return [3 /*break*/, 4];
            }
            return [4 /*yield*/, profileCtx.isReachable(300)];
          case 2:
            reachable = _c.sent();
            if (!reachable) {
              return [2 /*return*/, res.json({ ok: true, tabs: [] })];
            }
            return [4 /*yield*/, profileCtx.listTabs()];
          case 3:
            tabs = _c.sent();
            return [2 /*return*/, res.json({ ok: true, tabs: tabs })];
          case 4:
            if (!(action === "new")) {
              return [3 /*break*/, 7];
            }
            return [4 /*yield*/, profileCtx.ensureBrowserAvailable()];
          case 5:
            _c.sent();
            return [4 /*yield*/, profileCtx.openTab("about:blank")];
          case 6:
            tab = _c.sent();
            return [2 /*return*/, res.json({ ok: true, tab: tab })];
          case 7:
            if (!(action === "close")) {
              return [3 /*break*/, 10];
            }
            return [4 /*yield*/, profileCtx.listTabs()];
          case 8:
            tabs = _c.sent();
            target = typeof index === "number" ? tabs[index] : tabs.at(0);
            if (!target) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 404, "tab not found")];
            }
            return [4 /*yield*/, profileCtx.closeTab(target.targetId)];
          case 9:
            _c.sent();
            return [2 /*return*/, res.json({ ok: true, targetId: target.targetId })];
          case 10:
            if (!(action === "select")) {
              return [3 /*break*/, 13];
            }
            if (typeof index !== "number") {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "index is required")];
            }
            return [4 /*yield*/, profileCtx.listTabs()];
          case 11:
            tabs = _c.sent();
            target = tabs[index];
            if (!target) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 404, "tab not found")];
            }
            return [4 /*yield*/, profileCtx.focusTab(target.targetId)];
          case 12:
            _c.sent();
            return [2 /*return*/, res.json({ ok: true, targetId: target.targetId })];
          case 13:
            return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "unknown tab action")];
          case 14:
            err_5 = _c.sent();
            mapped = ctx.mapTabError(err_5);
            if (mapped) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, mapped.status, mapped.message)];
            }
            (0, utils_js_1.jsonError)(res, 500, String(err_5));
            return [3 /*break*/, 15];
          case 15:
            return [2 /*return*/];
        }
      });
    });
  });
}
