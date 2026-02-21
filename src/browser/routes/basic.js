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
exports.registerBrowserBasicRoutes = registerBrowserBasicRoutes;
var chrome_executables_js_1 = require("../chrome.executables.js");
var profiles_service_js_1 = require("../profiles-service.js");
var utils_js_1 = require("./utils.js");
function registerBrowserBasicRoutes(app, ctx) {
  var _this = this;
  // List all profiles with their status
  app.get("/profiles", function (_req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var service, profiles, err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            service = (0, profiles_service_js_1.createBrowserProfilesService)(ctx);
            return [4 /*yield*/, service.listProfiles()];
          case 1:
            profiles = _a.sent();
            res.json({ profiles: profiles });
            return [3 /*break*/, 3];
          case 2:
            err_1 = _a.sent();
            (0, utils_js_1.jsonError)(res, 500, String(err_1));
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  });
  // Get status (profile-aware)
  app.get("/", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var current,
        profileCtx,
        _a,
        cdpHttp,
        cdpReady,
        profileState,
        detectedBrowser,
        detectedExecutablePath,
        detectError,
        detected;
      var _b, _c, _d, _e, _f, _g, _h;
      return __generator(this, function (_j) {
        switch (_j.label) {
          case 0:
            try {
              current = ctx.state();
            } catch (_k) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, 503, "browser server not started"),
              ];
            }
            profileCtx = (0, utils_js_1.getProfileContext)(req, ctx);
            if ("error" in profileCtx) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, profileCtx.status, profileCtx.error),
              ];
            }
            return [
              4 /*yield*/,
              Promise.all([profileCtx.isHttpReachable(300), profileCtx.isReachable(600)]),
            ];
          case 1:
            ((_a = _j.sent()), (cdpHttp = _a[0]), (cdpReady = _a[1]));
            profileState = current.profiles.get(profileCtx.profile.name);
            detectedBrowser = null;
            detectedExecutablePath = null;
            detectError = null;
            try {
              detected = (0, chrome_executables_js_1.resolveBrowserExecutableForPlatform)(
                current.resolved,
                process.platform,
              );
              if (detected) {
                detectedBrowser = detected.kind;
                detectedExecutablePath = detected.path;
              }
            } catch (err) {
              detectError = String(err);
            }
            res.json({
              enabled: current.resolved.enabled,
              profile: profileCtx.profile.name,
              running: cdpReady,
              cdpReady: cdpReady,
              cdpHttp: cdpHttp,
              pid:
                (_c =
                  (_b =
                    profileState === null || profileState === void 0
                      ? void 0
                      : profileState.running) === null || _b === void 0
                    ? void 0
                    : _b.pid) !== null && _c !== void 0
                  ? _c
                  : null,
              cdpPort: profileCtx.profile.cdpPort,
              cdpUrl: profileCtx.profile.cdpUrl,
              chosenBrowser:
                (_e =
                  (_d =
                    profileState === null || profileState === void 0
                      ? void 0
                      : profileState.running) === null || _d === void 0
                    ? void 0
                    : _d.exe.kind) !== null && _e !== void 0
                  ? _e
                  : null,
              detectedBrowser: detectedBrowser,
              detectedExecutablePath: detectedExecutablePath,
              detectError: detectError,
              userDataDir:
                (_g =
                  (_f =
                    profileState === null || profileState === void 0
                      ? void 0
                      : profileState.running) === null || _f === void 0
                    ? void 0
                    : _f.userDataDir) !== null && _g !== void 0
                  ? _g
                  : null,
              color: profileCtx.profile.color,
              headless: current.resolved.headless,
              noSandbox: current.resolved.noSandbox,
              executablePath:
                (_h = current.resolved.executablePath) !== null && _h !== void 0 ? _h : null,
              attachOnly: current.resolved.attachOnly,
            });
            return [2 /*return*/];
        }
      });
    });
  });
  // Start browser (profile-aware)
  app.post("/start", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, err_2;
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
            _a.trys.push([1, 3, , 4]);
            return [4 /*yield*/, profileCtx.ensureBrowserAvailable()];
          case 2:
            _a.sent();
            res.json({ ok: true, profile: profileCtx.profile.name });
            return [3 /*break*/, 4];
          case 3:
            err_2 = _a.sent();
            (0, utils_js_1.jsonError)(res, 500, String(err_2));
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  });
  // Stop browser (profile-aware)
  app.post("/stop", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, result, err_3;
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
            _a.trys.push([1, 3, , 4]);
            return [4 /*yield*/, profileCtx.stopRunningBrowser()];
          case 2:
            result = _a.sent();
            res.json({
              ok: true,
              stopped: result.stopped,
              profile: profileCtx.profile.name,
            });
            return [3 /*break*/, 4];
          case 3:
            err_3 = _a.sent();
            (0, utils_js_1.jsonError)(res, 500, String(err_3));
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  });
  // Reset profile (profile-aware)
  app.post("/reset-profile", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, result, err_4;
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
            _a.trys.push([1, 3, , 4]);
            return [4 /*yield*/, profileCtx.resetProfile()];
          case 2:
            result = _a.sent();
            res.json(__assign({ ok: true, profile: profileCtx.profile.name }, result));
            return [3 /*break*/, 4];
          case 3:
            err_4 = _a.sent();
            (0, utils_js_1.jsonError)(res, 500, String(err_4));
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  });
  // Create a new profile
  app.post("/profiles/create", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var name, color, cdpUrl, driver, service, result, err_5, msg;
      var _a, _b, _c, _d;
      return __generator(this, function (_e) {
        switch (_e.label) {
          case 0:
            name = (0, utils_js_1.toStringOrEmpty)(
              (_a = req.body) === null || _a === void 0 ? void 0 : _a.name,
            );
            color = (0, utils_js_1.toStringOrEmpty)(
              (_b = req.body) === null || _b === void 0 ? void 0 : _b.color,
            );
            cdpUrl = (0, utils_js_1.toStringOrEmpty)(
              (_c = req.body) === null || _c === void 0 ? void 0 : _c.cdpUrl,
            );
            driver = (0, utils_js_1.toStringOrEmpty)(
              (_d = req.body) === null || _d === void 0 ? void 0 : _d.driver,
            );
            if (!name) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "name is required")];
            }
            _e.label = 1;
          case 1:
            _e.trys.push([1, 3, , 4]);
            service = (0, profiles_service_js_1.createBrowserProfilesService)(ctx);
            return [
              4 /*yield*/,
              service.createProfile({
                name: name,
                color: color || undefined,
                cdpUrl: cdpUrl || undefined,
                driver: driver === "extension" ? "extension" : undefined,
              }),
            ];
          case 2:
            result = _e.sent();
            res.json(result);
            return [3 /*break*/, 4];
          case 3:
            err_5 = _e.sent();
            msg = String(err_5);
            if (msg.includes("already exists")) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 409, msg)];
            }
            if (msg.includes("invalid profile name")) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, msg)];
            }
            if (msg.includes("no available CDP ports")) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 507, msg)];
            }
            if (msg.includes("cdpUrl")) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, msg)];
            }
            (0, utils_js_1.jsonError)(res, 500, msg);
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  });
  // Delete a profile
  app.delete("/profiles/:name", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var name, service, result, err_6, msg;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            name = (0, utils_js_1.toStringOrEmpty)(req.params.name);
            if (!name) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, 400, "profile name is required"),
              ];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            service = (0, profiles_service_js_1.createBrowserProfilesService)(ctx);
            return [4 /*yield*/, service.deleteProfile(name)];
          case 2:
            result = _a.sent();
            res.json(result);
            return [3 /*break*/, 4];
          case 3:
            err_6 = _a.sent();
            msg = String(err_6);
            if (msg.includes("invalid profile name")) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, msg)];
            }
            if (msg.includes("default profile")) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, msg)];
            }
            if (msg.includes("not found")) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 404, msg)];
            }
            (0, utils_js_1.jsonError)(res, 500, msg);
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  });
}
