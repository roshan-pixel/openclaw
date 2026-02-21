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
exports.browserCookies = browserCookies;
exports.browserCookiesSet = browserCookiesSet;
exports.browserCookiesClear = browserCookiesClear;
exports.browserStorageGet = browserStorageGet;
exports.browserStorageSet = browserStorageSet;
exports.browserStorageClear = browserStorageClear;
exports.browserSetOffline = browserSetOffline;
exports.browserSetHeaders = browserSetHeaders;
exports.browserSetHttpCredentials = browserSetHttpCredentials;
exports.browserSetGeolocation = browserSetGeolocation;
exports.browserSetMedia = browserSetMedia;
exports.browserSetTimezone = browserSetTimezone;
exports.browserSetLocale = browserSetLocale;
exports.browserSetDevice = browserSetDevice;
exports.browserClearPermissions = browserClearPermissions;
var client_fetch_js_1 = require("./client-fetch.js");
function buildProfileQuery(profile) {
  return profile ? "?profile=".concat(encodeURIComponent(profile)) : "";
}
function withBaseUrl(baseUrl, path) {
  var trimmed = baseUrl === null || baseUrl === void 0 ? void 0 : baseUrl.trim();
  if (!trimmed) {
    return path;
  }
  return "".concat(trimmed.replace(/\/$/, "")).concat(path);
}
function browserCookies(baseUrl_1) {
  return __awaiter(this, arguments, void 0, function (baseUrl, opts) {
    var q, suffix;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = new URLSearchParams();
          if (opts.targetId) {
            q.set("targetId", opts.targetId);
          }
          if (opts.profile) {
            q.set("profile", opts.profile);
          }
          suffix = q.toString() ? "?".concat(q.toString()) : "";
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(
              withBaseUrl(baseUrl, "/cookies".concat(suffix)),
              { timeoutMs: 20000 },
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserCookiesSet(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(
              withBaseUrl(baseUrl, "/cookies/set".concat(q)),
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetId: opts.targetId, cookie: opts.cookie }),
                timeoutMs: 20000,
              },
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserCookiesClear(baseUrl_1) {
  return __awaiter(this, arguments, void 0, function (baseUrl, opts) {
    var q;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(
              withBaseUrl(baseUrl, "/cookies/clear".concat(q)),
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetId: opts.targetId }),
                timeoutMs: 20000,
              },
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserStorageGet(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q, suffix;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = new URLSearchParams();
          if (opts.targetId) {
            q.set("targetId", opts.targetId);
          }
          if (opts.key) {
            q.set("key", opts.key);
          }
          if (opts.profile) {
            q.set("profile", opts.profile);
          }
          suffix = q.toString() ? "?".concat(q.toString()) : "";
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(
              withBaseUrl(baseUrl, "/storage/".concat(opts.kind).concat(suffix)),
              { timeoutMs: 20000 },
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserStorageSet(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(
              withBaseUrl(baseUrl, "/storage/".concat(opts.kind, "/set").concat(q)),
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  targetId: opts.targetId,
                  key: opts.key,
                  value: opts.value,
                }),
                timeoutMs: 20000,
              },
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserStorageClear(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(
              withBaseUrl(baseUrl, "/storage/".concat(opts.kind, "/clear").concat(q)),
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetId: opts.targetId }),
                timeoutMs: 20000,
              },
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserSetOffline(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(
              withBaseUrl(baseUrl, "/set/offline".concat(q)),
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetId: opts.targetId, offline: opts.offline }),
                timeoutMs: 20000,
              },
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserSetHeaders(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(
              withBaseUrl(baseUrl, "/set/headers".concat(q)),
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetId: opts.targetId, headers: opts.headers }),
                timeoutMs: 20000,
              },
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserSetHttpCredentials(baseUrl_1) {
  return __awaiter(this, arguments, void 0, function (baseUrl, opts) {
    var q;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(
              withBaseUrl(baseUrl, "/set/credentials".concat(q)),
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  targetId: opts.targetId,
                  username: opts.username,
                  password: opts.password,
                  clear: opts.clear,
                }),
                timeoutMs: 20000,
              },
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserSetGeolocation(baseUrl_1) {
  return __awaiter(this, arguments, void 0, function (baseUrl, opts) {
    var q;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(
              withBaseUrl(baseUrl, "/set/geolocation".concat(q)),
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  targetId: opts.targetId,
                  latitude: opts.latitude,
                  longitude: opts.longitude,
                  accuracy: opts.accuracy,
                  origin: opts.origin,
                  clear: opts.clear,
                }),
                timeoutMs: 20000,
              },
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserSetMedia(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(withBaseUrl(baseUrl, "/set/media".concat(q)), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                targetId: opts.targetId,
                colorScheme: opts.colorScheme,
              }),
              timeoutMs: 20000,
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserSetTimezone(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(
              withBaseUrl(baseUrl, "/set/timezone".concat(q)),
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  targetId: opts.targetId,
                  timezoneId: opts.timezoneId,
                }),
                timeoutMs: 20000,
              },
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserSetLocale(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(withBaseUrl(baseUrl, "/set/locale".concat(q)), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ targetId: opts.targetId, locale: opts.locale }),
              timeoutMs: 20000,
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserSetDevice(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(withBaseUrl(baseUrl, "/set/device".concat(q)), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ targetId: opts.targetId, name: opts.name }),
              timeoutMs: 20000,
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserClearPermissions(baseUrl_1) {
  return __awaiter(this, arguments, void 0, function (baseUrl, opts) {
    var q;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(
              withBaseUrl(baseUrl, "/set/geolocation".concat(q)),
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetId: opts.targetId, clear: true }),
                timeoutMs: 20000,
              },
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
