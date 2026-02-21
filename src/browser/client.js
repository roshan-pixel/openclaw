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
exports.browserStatus = browserStatus;
exports.browserProfiles = browserProfiles;
exports.browserStart = browserStart;
exports.browserStop = browserStop;
exports.browserResetProfile = browserResetProfile;
exports.browserCreateProfile = browserCreateProfile;
exports.browserDeleteProfile = browserDeleteProfile;
exports.browserTabs = browserTabs;
exports.browserOpenTab = browserOpenTab;
exports.browserFocusTab = browserFocusTab;
exports.browserCloseTab = browserCloseTab;
exports.browserTabAction = browserTabAction;
exports.browserSnapshot = browserSnapshot;
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
function browserStatus(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts === null || opts === void 0 ? void 0 : opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(withBaseUrl(baseUrl, "/".concat(q)), {
              timeoutMs: 1500,
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserProfiles(baseUrl) {
  return __awaiter(this, void 0, void 0, function () {
    var res;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(withBaseUrl(baseUrl, "/profiles"), {
              timeoutMs: 3000,
            }),
          ];
        case 1:
          res = _b.sent();
          return [2 /*return*/, (_a = res.profiles) !== null && _a !== void 0 ? _a : []];
      }
    });
  });
}
function browserStart(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts === null || opts === void 0 ? void 0 : opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(withBaseUrl(baseUrl, "/start".concat(q)), {
              method: "POST",
              timeoutMs: 15000,
            }),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function browserStop(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts === null || opts === void 0 ? void 0 : opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(withBaseUrl(baseUrl, "/stop".concat(q)), {
              method: "POST",
              timeoutMs: 15000,
            }),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function browserResetProfile(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts === null || opts === void 0 ? void 0 : opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(
              withBaseUrl(baseUrl, "/reset-profile".concat(q)),
              {
                method: "POST",
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
function browserCreateProfile(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(withBaseUrl(baseUrl, "/profiles/create"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: opts.name,
                color: opts.color,
                cdpUrl: opts.cdpUrl,
                driver: opts.driver,
              }),
              timeoutMs: 10000,
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserDeleteProfile(baseUrl, profile) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(
              withBaseUrl(baseUrl, "/profiles/".concat(encodeURIComponent(profile))),
              {
                method: "DELETE",
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
function browserTabs(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q, res;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          q = buildProfileQuery(opts === null || opts === void 0 ? void 0 : opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(withBaseUrl(baseUrl, "/tabs".concat(q)), {
              timeoutMs: 3000,
            }),
          ];
        case 1:
          res = _b.sent();
          return [2 /*return*/, (_a = res.tabs) !== null && _a !== void 0 ? _a : []];
      }
    });
  });
}
function browserOpenTab(baseUrl, url, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts === null || opts === void 0 ? void 0 : opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(withBaseUrl(baseUrl, "/tabs/open".concat(q)), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: url }),
              timeoutMs: 15000,
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserFocusTab(baseUrl, targetId, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts === null || opts === void 0 ? void 0 : opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(withBaseUrl(baseUrl, "/tabs/focus".concat(q)), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ targetId: targetId }),
              timeoutMs: 5000,
            }),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function browserCloseTab(baseUrl, targetId, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts === null || opts === void 0 ? void 0 : opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(
              withBaseUrl(baseUrl, "/tabs/".concat(encodeURIComponent(targetId)).concat(q)),
              {
                method: "DELETE",
                timeoutMs: 5000,
              },
            ),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function browserTabAction(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = buildProfileQuery(opts.profile);
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(
              withBaseUrl(baseUrl, "/tabs/action".concat(q)),
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  action: opts.action,
                  index: opts.index,
                }),
                timeoutMs: 10000,
              },
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function browserSnapshot(baseUrl, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var q;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          q = new URLSearchParams();
          q.set("format", opts.format);
          if (opts.targetId) {
            q.set("targetId", opts.targetId);
          }
          if (typeof opts.limit === "number") {
            q.set("limit", String(opts.limit));
          }
          if (typeof opts.maxChars === "number" && Number.isFinite(opts.maxChars)) {
            q.set("maxChars", String(opts.maxChars));
          }
          if (opts.refs === "aria" || opts.refs === "role") {
            q.set("refs", opts.refs);
          }
          if (typeof opts.interactive === "boolean") {
            q.set("interactive", String(opts.interactive));
          }
          if (typeof opts.compact === "boolean") {
            q.set("compact", String(opts.compact));
          }
          if (typeof opts.depth === "number" && Number.isFinite(opts.depth)) {
            q.set("depth", String(opts.depth));
          }
          if ((_a = opts.selector) === null || _a === void 0 ? void 0 : _a.trim()) {
            q.set("selector", opts.selector.trim());
          }
          if ((_b = opts.frame) === null || _b === void 0 ? void 0 : _b.trim()) {
            q.set("frame", opts.frame.trim());
          }
          if (opts.labels === true) {
            q.set("labels", "1");
          }
          if (opts.mode) {
            q.set("mode", opts.mode);
          }
          if (opts.profile) {
            q.set("profile", opts.profile);
          }
          return [
            4 /*yield*/,
            (0, client_fetch_js_1.fetchBrowserJson)(
              withBaseUrl(baseUrl, "/snapshot?".concat(q.toString())),
              {
                timeoutMs: 20000,
              },
            ),
          ];
        case 1:
          return [2 /*return*/, _c.sent()];
      }
    });
  });
}
// Actions beyond the basic read-only commands live in client-actions.ts.
