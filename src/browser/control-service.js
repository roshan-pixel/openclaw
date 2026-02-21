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
exports.getBrowserControlState = getBrowserControlState;
exports.createBrowserControlContext = createBrowserControlContext;
exports.startBrowserControlServiceFromConfig = startBrowserControlServiceFromConfig;
exports.stopBrowserControlService = stopBrowserControlService;
var config_js_1 = require("../config/config.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var config_js_2 = require("./config.js");
var extension_relay_js_1 = require("./extension-relay.js");
var server_context_js_1 = require("./server-context.js");
var state = null;
var log = (0, subsystem_js_1.createSubsystemLogger)("browser");
var logService = log.child("service");
function getBrowserControlState() {
  return state;
}
function createBrowserControlContext() {
  return (0, server_context_js_1.createBrowserRouteContext)({
    getState: function () {
      return state;
    },
  });
}
function startBrowserControlServiceFromConfig() {
  return __awaiter(this, void 0, void 0, function () {
    var cfg, resolved, _loop_1, _i, _a, name_1;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (state) {
            return [2 /*return*/, state];
          }
          cfg = (0, config_js_1.loadConfig)();
          resolved = (0, config_js_2.resolveBrowserConfig)(cfg.browser, cfg);
          if (!resolved.enabled) {
            return [2 /*return*/, null];
          }
          state = {
            server: null,
            port: resolved.controlPort,
            resolved: resolved,
            profiles: new Map(),
          };
          _loop_1 = function (name_1) {
            var profile;
            return __generator(this, function (_c) {
              switch (_c.label) {
                case 0:
                  profile = (0, config_js_2.resolveProfile)(resolved, name_1);
                  if (!profile || profile.driver !== "extension") {
                    return [2 /*return*/, "continue"];
                  }
                  return [
                    4 /*yield*/,
                    (0, extension_relay_js_1.ensureChromeExtensionRelayServer)({
                      cdpUrl: profile.cdpUrl,
                    }).catch(function (err) {
                      logService.warn(
                        'Chrome extension relay init failed for profile "'
                          .concat(name_1, '": ')
                          .concat(String(err)),
                      );
                    }),
                  ];
                case 1:
                  _c.sent();
                  return [2 /*return*/];
              }
            });
          };
          ((_i = 0), (_a = Object.keys(resolved.profiles)));
          _b.label = 1;
        case 1:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 4];
          }
          name_1 = _a[_i];
          return [5 /*yield**/, _loop_1(name_1)];
        case 2:
          _b.sent();
          _b.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          logService.info(
            "Browser control service ready (profiles=".concat(
              Object.keys(resolved.profiles).length,
              ")",
            ),
          );
          return [2 /*return*/, state];
      }
    });
  });
}
function stopBrowserControlService() {
  return __awaiter(this, void 0, void 0, function () {
    var current, ctx, _i, _a, name_2, _b, err_1, mod, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          current = state;
          if (!current) {
            return [2 /*return*/];
          }
          ctx = (0, server_context_js_1.createBrowserRouteContext)({
            getState: function () {
              return state;
            },
          });
          _d.label = 1;
        case 1:
          _d.trys.push([1, 8, , 9]);
          ((_i = 0), (_a = Object.keys(current.resolved.profiles)));
          _d.label = 2;
        case 2:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 7];
          }
          name_2 = _a[_i];
          _d.label = 3;
        case 3:
          _d.trys.push([3, 5, , 6]);
          return [4 /*yield*/, ctx.forProfile(name_2).stopRunningBrowser()];
        case 4:
          _d.sent();
          return [3 /*break*/, 6];
        case 5:
          _b = _d.sent();
          return [3 /*break*/, 6];
        case 6:
          _i++;
          return [3 /*break*/, 2];
        case 7:
          return [3 /*break*/, 9];
        case 8:
          err_1 = _d.sent();
          logService.warn("openclaw browser stop failed: ".concat(String(err_1)));
          return [3 /*break*/, 9];
        case 9:
          state = null;
          _d.label = 10;
        case 10:
          _d.trys.push([10, 13, , 14]);
          return [
            4 /*yield*/,
            Promise.resolve().then(function () {
              return require("./pw-ai.js");
            }),
          ];
        case 11:
          mod = _d.sent();
          return [4 /*yield*/, mod.closePlaywrightBrowserConnection()];
        case 12:
          _d.sent();
          return [3 /*break*/, 14];
        case 13:
          _c = _d.sent();
          return [3 /*break*/, 14];
        case 14:
          return [2 /*return*/];
      }
    });
  });
}
