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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }
    if (s != null && typeof Object.getOwnPropertySymbols === "function") {
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    }
    return t;
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBrowserProfilesService = createBrowserProfilesService;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var config_js_1 = require("../config/config.js");
var port_defaults_js_1 = require("../config/port-defaults.js");
var constants_js_1 = require("./constants.js");
var chrome_js_1 = require("./chrome.js");
var config_js_2 = require("./config.js");
var profiles_js_1 = require("./profiles.js");
var trash_js_1 = require("./trash.js");
var HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$/;
function createBrowserProfilesService(ctx) {
  var _this = this;
  var listProfiles = function () {
    return __awaiter(_this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, ctx.listProfiles()];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  var createProfile = function (params) {
    return __awaiter(_this, void 0, void 0, function () {
      var name,
        rawCdpUrl,
        driver,
        state,
        resolvedProfiles,
        cfg,
        rawProfiles,
        usedColors,
        profileColor,
        profileConfig,
        parsed,
        usedPorts,
        range,
        cdpPort,
        nextConfig,
        resolved;
      var _a;
      var _b, _c, _d;
      return __generator(this, function (_e) {
        switch (_e.label) {
          case 0:
            name = params.name.trim();
            rawCdpUrl =
              ((_b = params.cdpUrl) === null || _b === void 0 ? void 0 : _b.trim()) || undefined;
            driver = params.driver === "extension" ? "extension" : undefined;
            if (!(0, profiles_js_1.isValidProfileName)(name)) {
              throw new Error(
                "invalid profile name: use lowercase letters, numbers, and hyphens only",
              );
            }
            state = ctx.state();
            resolvedProfiles = state.resolved.profiles;
            if (name in resolvedProfiles) {
              throw new Error('profile "'.concat(name, '" already exists'));
            }
            cfg = (0, config_js_1.loadConfig)();
            rawProfiles =
              (_d = (_c = cfg.browser) === null || _c === void 0 ? void 0 : _c.profiles) !== null &&
              _d !== void 0
                ? _d
                : {};
            if (name in rawProfiles) {
              throw new Error('profile "'.concat(name, '" already exists'));
            }
            usedColors = (0, profiles_js_1.getUsedColors)(resolvedProfiles);
            profileColor =
              params.color && HEX_COLOR_RE.test(params.color)
                ? params.color
                : (0, profiles_js_1.allocateColor)(usedColors);
            if (rawCdpUrl) {
              parsed = (0, config_js_2.parseHttpUrl)(rawCdpUrl, "browser.profiles.cdpUrl");
              profileConfig = __assign(
                __assign({ cdpUrl: parsed.normalized }, driver ? { driver: driver } : {}),
                { color: profileColor },
              );
            } else {
              usedPorts = (0, profiles_js_1.getUsedPorts)(resolvedProfiles);
              range = (0, port_defaults_js_1.deriveDefaultBrowserCdpPortRange)(
                state.resolved.controlPort,
              );
              cdpPort = (0, profiles_js_1.allocateCdpPort)(usedPorts, range);
              if (cdpPort === null) {
                throw new Error("no available CDP ports in range");
              }
              profileConfig = __assign(
                __assign({ cdpPort: cdpPort }, driver ? { driver: driver } : {}),
                { color: profileColor },
              );
            }
            nextConfig = __assign(__assign({}, cfg), {
              browser: __assign(__assign({}, cfg.browser), {
                profiles: __assign(
                  __assign({}, rawProfiles),
                  ((_a = {}), (_a[name] = profileConfig), _a),
                ),
              }),
            });
            return [4 /*yield*/, (0, config_js_1.writeConfigFile)(nextConfig)];
          case 1:
            _e.sent();
            state.resolved.profiles[name] = profileConfig;
            resolved = (0, config_js_2.resolveProfile)(state.resolved, name);
            if (!resolved) {
              throw new Error('profile "'.concat(name, '" not found after creation'));
            }
            return [
              2 /*return*/,
              {
                ok: true,
                profile: name,
                cdpPort: resolved.cdpPort,
                cdpUrl: resolved.cdpUrl,
                color: resolved.color,
                isRemote: !resolved.cdpIsLoopback,
              },
            ];
        }
      });
    });
  };
  var deleteProfile = function (nameRaw) {
    return __awaiter(_this, void 0, void 0, function () {
      var name,
        cfg,
        profiles,
        defaultProfile,
        deleted,
        state,
        resolved,
        _a,
        userDataDir,
        profileDir,
        _b,
        _c,
        _removed,
        remainingProfiles,
        nextConfig;
      var _d, _e, _f, _g;
      return __generator(this, function (_h) {
        switch (_h.label) {
          case 0:
            name = nameRaw.trim();
            if (!name) {
              throw new Error("profile name is required");
            }
            if (!(0, profiles_js_1.isValidProfileName)(name)) {
              throw new Error("invalid profile name");
            }
            cfg = (0, config_js_1.loadConfig)();
            profiles =
              (_e = (_d = cfg.browser) === null || _d === void 0 ? void 0 : _d.profiles) !== null &&
              _e !== void 0
                ? _e
                : {};
            if (!(name in profiles)) {
              throw new Error('profile "'.concat(name, '" not found'));
            }
            defaultProfile =
              (_g = (_f = cfg.browser) === null || _f === void 0 ? void 0 : _f.defaultProfile) !==
                null && _g !== void 0
                ? _g
                : constants_js_1.DEFAULT_BROWSER_DEFAULT_PROFILE_NAME;
            if (name === defaultProfile) {
              throw new Error(
                'cannot delete the default profile "'.concat(
                  name,
                  '"; change browser.defaultProfile first',
                ),
              );
            }
            deleted = false;
            state = ctx.state();
            resolved = (0, config_js_2.resolveProfile)(state.resolved, name);
            if (!(resolved === null || resolved === void 0 ? void 0 : resolved.cdpIsLoopback)) {
              return [3 /*break*/, 6];
            }
            _h.label = 1;
          case 1:
            _h.trys.push([1, 3, , 4]);
            return [4 /*yield*/, ctx.forProfile(name).stopRunningBrowser()];
          case 2:
            _h.sent();
            return [3 /*break*/, 4];
          case 3:
            _a = _h.sent();
            return [3 /*break*/, 4];
          case 4:
            userDataDir = (0, chrome_js_1.resolveOpenClawUserDataDir)(name);
            profileDir = node_path_1.default.dirname(userDataDir);
            if (!node_fs_1.default.existsSync(profileDir)) {
              return [3 /*break*/, 6];
            }
            return [4 /*yield*/, (0, trash_js_1.movePathToTrash)(profileDir)];
          case 5:
            _h.sent();
            deleted = true;
            _h.label = 6;
          case 6:
            ((_b = profiles),
              (_c = name),
              (_removed = _b[_c]),
              (remainingProfiles = __rest(_b, [typeof _c === "symbol" ? _c : _c + ""])));
            nextConfig = __assign(__assign({}, cfg), {
              browser: __assign(__assign({}, cfg.browser), { profiles: remainingProfiles }),
            });
            return [4 /*yield*/, (0, config_js_1.writeConfigFile)(nextConfig)];
          case 7:
            _h.sent();
            delete state.resolved.profiles[name];
            state.profiles.delete(name);
            return [2 /*return*/, { ok: true, profile: name, deleted: deleted }];
        }
      });
    });
  };
  return {
    listProfiles: listProfiles,
    createProfile: createProfile,
    deleteProfile: deleteProfile,
  };
}
