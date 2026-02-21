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
exports.setOfflineViaPlaywright = setOfflineViaPlaywright;
exports.setExtraHTTPHeadersViaPlaywright = setExtraHTTPHeadersViaPlaywright;
exports.setHttpCredentialsViaPlaywright = setHttpCredentialsViaPlaywright;
exports.setGeolocationViaPlaywright = setGeolocationViaPlaywright;
exports.emulateMediaViaPlaywright = emulateMediaViaPlaywright;
exports.setLocaleViaPlaywright = setLocaleViaPlaywright;
exports.setTimezoneViaPlaywright = setTimezoneViaPlaywright;
exports.setDeviceViaPlaywright = setDeviceViaPlaywright;
var playwright_core_1 = require("playwright-core");
var pw_session_js_1 = require("./pw-session.js");
function withCdpSession(page, fn) {
  return __awaiter(this, void 0, void 0, function () {
    var session;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, page.context().newCDPSession(page)];
        case 1:
          session = _a.sent();
          _a.label = 2;
        case 2:
          _a.trys.push([2, , 4, 6]);
          return [4 /*yield*/, fn(session)];
        case 3:
          return [2 /*return*/, _a.sent()];
        case 4:
          return [4 /*yield*/, session.detach().catch(function () {})];
        case 5:
          _a.sent();
          return [7 /*endfinally*/];
        case 6:
          return [2 /*return*/];
      }
    });
  });
}
function setOfflineViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _a.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          return [4 /*yield*/, page.context().setOffline(Boolean(opts.offline))];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function setExtraHTTPHeadersViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _a.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          return [4 /*yield*/, page.context().setExtraHTTPHeaders(opts.headers)];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function setHttpCredentialsViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, username, password;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _c.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          if (!opts.clear) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, page.context().setHTTPCredentials(null)];
        case 2:
          _c.sent();
          return [2 /*return*/];
        case 3:
          username = String((_a = opts.username) !== null && _a !== void 0 ? _a : "");
          password = String((_b = opts.password) !== null && _b !== void 0 ? _b : "");
          if (!username) {
            throw new Error("username is required (or set clear=true)");
          }
          return [
            4 /*yield*/,
            page.context().setHTTPCredentials({ username: username, password: password }),
          ];
        case 4:
          _c.sent();
          return [2 /*return*/];
      }
    });
  });
}
function setGeolocationViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, context, origin;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _b.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          context = page.context();
          if (!opts.clear) {
            return [3 /*break*/, 4];
          }
          return [4 /*yield*/, context.setGeolocation(null)];
        case 2:
          _b.sent();
          return [4 /*yield*/, context.clearPermissions().catch(function () {})];
        case 3:
          _b.sent();
          return [2 /*return*/];
        case 4:
          if (typeof opts.latitude !== "number" || typeof opts.longitude !== "number") {
            throw new Error("latitude and longitude are required (or set clear=true)");
          }
          return [
            4 /*yield*/,
            context.setGeolocation({
              latitude: opts.latitude,
              longitude: opts.longitude,
              accuracy: typeof opts.accuracy === "number" ? opts.accuracy : undefined,
            }),
          ];
        case 5:
          _b.sent();
          origin =
            ((_a = opts.origin) === null || _a === void 0 ? void 0 : _a.trim()) ||
            (function () {
              try {
                return new URL(page.url()).origin;
              } catch (_a) {
                return "";
              }
            })();
          if (!origin) {
            return [3 /*break*/, 7];
          }
          return [
            4 /*yield*/,
            context.grantPermissions(["geolocation"], { origin: origin }).catch(function () {}),
          ];
        case 6:
          _b.sent();
          _b.label = 7;
        case 7:
          return [2 /*return*/];
      }
    });
  });
}
function emulateMediaViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _a.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          return [4 /*yield*/, page.emulateMedia({ colorScheme: opts.colorScheme })];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function setLocaleViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, locale;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _b.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          locale = String((_a = opts.locale) !== null && _a !== void 0 ? _a : "").trim();
          if (!locale) {
            throw new Error("locale is required");
          }
          return [
            4 /*yield*/,
            withCdpSession(page, function (session) {
              return __awaiter(_this, void 0, void 0, function () {
                var err_1;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      _a.trys.push([0, 2, , 3]);
                      return [
                        4 /*yield*/,
                        session.send("Emulation.setLocaleOverride", { locale: locale }),
                      ];
                    case 1:
                      _a.sent();
                      return [3 /*break*/, 3];
                    case 2:
                      err_1 = _a.sent();
                      if (String(err_1).includes("Another locale override is already in effect")) {
                        return [2 /*return*/];
                      }
                      throw err_1;
                    case 3:
                      return [2 /*return*/];
                  }
                });
              });
            }),
          ];
        case 2:
          _b.sent();
          return [2 /*return*/];
      }
    });
  });
}
function setTimezoneViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, timezoneId;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _b.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          timezoneId = String((_a = opts.timezoneId) !== null && _a !== void 0 ? _a : "").trim();
          if (!timezoneId) {
            throw new Error("timezoneId is required");
          }
          return [
            4 /*yield*/,
            withCdpSession(page, function (session) {
              return __awaiter(_this, void 0, void 0, function () {
                var err_2, msg;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      _a.trys.push([0, 2, , 3]);
                      return [
                        4 /*yield*/,
                        session.send("Emulation.setTimezoneOverride", { timezoneId: timezoneId }),
                      ];
                    case 1:
                      _a.sent();
                      return [3 /*break*/, 3];
                    case 2:
                      err_2 = _a.sent();
                      msg = String(err_2);
                      if (msg.includes("Timezone override is already in effect")) {
                        return [2 /*return*/];
                      }
                      if (msg.includes("Invalid timezone")) {
                        throw new Error("Invalid timezone ID: ".concat(timezoneId));
                      }
                      throw err_2;
                    case 3:
                      return [2 /*return*/];
                  }
                });
              });
            }),
          ];
        case 2:
          _b.sent();
          return [2 /*return*/];
      }
    });
  });
}
function setDeviceViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, name, descriptor;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _b.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          name = String((_a = opts.name) !== null && _a !== void 0 ? _a : "").trim();
          if (!name) {
            throw new Error("device name is required");
          }
          descriptor = playwright_core_1.devices[name];
          if (!descriptor) {
            throw new Error('Unknown device "'.concat(name, '".'));
          }
          if (!descriptor.viewport) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            page.setViewportSize({
              width: descriptor.viewport.width,
              height: descriptor.viewport.height,
            }),
          ];
        case 2:
          _b.sent();
          _b.label = 3;
        case 3:
          return [
            4 /*yield*/,
            withCdpSession(page, function (session) {
              return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                  switch (_d.label) {
                    case 0:
                      if (!(descriptor.userAgent || descriptor.locale)) {
                        return [3 /*break*/, 2];
                      }
                      return [
                        4 /*yield*/,
                        session.send("Emulation.setUserAgentOverride", {
                          userAgent:
                            (_a = descriptor.userAgent) !== null && _a !== void 0 ? _a : "",
                          acceptLanguage:
                            (_b = descriptor.locale) !== null && _b !== void 0 ? _b : undefined,
                        }),
                      ];
                    case 1:
                      _d.sent();
                      _d.label = 2;
                    case 2:
                      if (!descriptor.viewport) {
                        return [3 /*break*/, 4];
                      }
                      return [
                        4 /*yield*/,
                        session.send("Emulation.setDeviceMetricsOverride", {
                          mobile: Boolean(descriptor.isMobile),
                          width: descriptor.viewport.width,
                          height: descriptor.viewport.height,
                          deviceScaleFactor:
                            (_c = descriptor.deviceScaleFactor) !== null && _c !== void 0 ? _c : 1,
                          screenWidth: descriptor.viewport.width,
                          screenHeight: descriptor.viewport.height,
                        }),
                      ];
                    case 3:
                      _d.sent();
                      _d.label = 4;
                    case 4:
                      if (!descriptor.hasTouch) {
                        return [3 /*break*/, 6];
                      }
                      return [
                        4 /*yield*/,
                        session.send("Emulation.setTouchEmulationEnabled", {
                          enabled: true,
                        }),
                      ];
                    case 5:
                      _d.sent();
                      _d.label = 6;
                    case 6:
                      return [2 /*return*/];
                  }
                });
              });
            }),
          ];
        case 4:
          _b.sent();
          return [2 /*return*/];
      }
    });
  });
}
