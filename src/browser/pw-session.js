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
exports.rememberRoleRefsForTarget = rememberRoleRefsForTarget;
exports.storeRoleRefsForTarget = storeRoleRefsForTarget;
exports.restoreRoleRefsForTarget = restoreRoleRefsForTarget;
exports.ensurePageState = ensurePageState;
exports.ensureContextState = ensureContextState;
exports.getPageForTargetId = getPageForTargetId;
exports.refLocator = refLocator;
exports.closePlaywrightBrowserConnection = closePlaywrightBrowserConnection;
exports.listPagesViaPlaywright = listPagesViaPlaywright;
exports.createPageViaPlaywright = createPageViaPlaywright;
exports.closePageByTargetIdViaPlaywright = closePageByTargetIdViaPlaywright;
exports.focusPageByTargetIdViaPlaywright = focusPageByTargetIdViaPlaywright;
var playwright_core_1 = require("playwright-core");
var errors_js_1 = require("../infra/errors.js");
var cdp_helpers_js_1 = require("./cdp.helpers.js");
var chrome_js_1 = require("./chrome.js");
var pageStates = new WeakMap();
var contextStates = new WeakMap();
var observedContexts = new WeakSet();
var observedPages = new WeakSet();
// Best-effort cache to make role refs stable even if Playwright returns a different Page object
// for the same CDP target across requests.
var roleRefsByTarget = new Map();
var MAX_ROLE_REFS_CACHE = 50;
var MAX_CONSOLE_MESSAGES = 500;
var MAX_PAGE_ERRORS = 200;
var MAX_NETWORK_REQUESTS = 500;
var cached = null;
var connecting = null;
function normalizeCdpUrl(raw) {
  return raw.replace(/\/$/, "");
}
function roleRefsKey(cdpUrl, targetId) {
  return "".concat(normalizeCdpUrl(cdpUrl), "::").concat(targetId);
}
function rememberRoleRefsForTarget(opts) {
  var targetId = opts.targetId.trim();
  if (!targetId) {
    return;
  }
  roleRefsByTarget.set(
    roleRefsKey(opts.cdpUrl, targetId),
    __assign(
      __assign(
        { refs: opts.refs },
        opts.frameSelector ? { frameSelector: opts.frameSelector } : {},
      ),
      opts.mode ? { mode: opts.mode } : {},
    ),
  );
  while (roleRefsByTarget.size > MAX_ROLE_REFS_CACHE) {
    var first = roleRefsByTarget.keys().next();
    if (first.done) {
      break;
    }
    roleRefsByTarget.delete(first.value);
  }
}
function storeRoleRefsForTarget(opts) {
  var _a;
  var state = ensurePageState(opts.page);
  state.roleRefs = opts.refs;
  state.roleRefsFrameSelector = opts.frameSelector;
  state.roleRefsMode = opts.mode;
  if (!((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim())) {
    return;
  }
  rememberRoleRefsForTarget({
    cdpUrl: opts.cdpUrl,
    targetId: opts.targetId,
    refs: opts.refs,
    frameSelector: opts.frameSelector,
    mode: opts.mode,
  });
}
function restoreRoleRefsForTarget(opts) {
  var _a;
  var targetId = ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || "";
  if (!targetId) {
    return;
  }
  var cached = roleRefsByTarget.get(roleRefsKey(opts.cdpUrl, targetId));
  if (!cached) {
    return;
  }
  var state = ensurePageState(opts.page);
  if (state.roleRefs) {
    return;
  }
  state.roleRefs = cached.refs;
  state.roleRefsFrameSelector = cached.frameSelector;
  state.roleRefsMode = cached.mode;
}
function ensurePageState(page) {
  var existing = pageStates.get(page);
  if (existing) {
    return existing;
  }
  var state = {
    console: [],
    errors: [],
    requests: [],
    requestIds: new WeakMap(),
    nextRequestId: 0,
    armIdUpload: 0,
    armIdDialog: 0,
    armIdDownload: 0,
  };
  pageStates.set(page, state);
  if (!observedPages.has(page)) {
    observedPages.add(page);
    page.on("console", function (msg) {
      var entry = {
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString(),
        location: msg.location(),
      };
      state.console.push(entry);
      if (state.console.length > MAX_CONSOLE_MESSAGES) {
        state.console.shift();
      }
    });
    page.on("pageerror", function (err) {
      state.errors.push({
        message: (err === null || err === void 0 ? void 0 : err.message)
          ? String(err.message)
          : String(err),
        name: (err === null || err === void 0 ? void 0 : err.name) ? String(err.name) : undefined,
        stack: (err === null || err === void 0 ? void 0 : err.stack)
          ? String(err.stack)
          : undefined,
        timestamp: new Date().toISOString(),
      });
      if (state.errors.length > MAX_PAGE_ERRORS) {
        state.errors.shift();
      }
    });
    page.on("request", function (req) {
      state.nextRequestId += 1;
      var id = "r".concat(state.nextRequestId);
      state.requestIds.set(req, id);
      state.requests.push({
        id: id,
        timestamp: new Date().toISOString(),
        method: req.method(),
        url: req.url(),
        resourceType: req.resourceType(),
      });
      if (state.requests.length > MAX_NETWORK_REQUESTS) {
        state.requests.shift();
      }
    });
    page.on("response", function (resp) {
      var req = resp.request();
      var id = state.requestIds.get(req);
      if (!id) {
        return;
      }
      var rec;
      for (var i = state.requests.length - 1; i >= 0; i -= 1) {
        var candidate = state.requests[i];
        if (candidate && candidate.id === id) {
          rec = candidate;
          break;
        }
      }
      if (!rec) {
        return;
      }
      rec.status = resp.status();
      rec.ok = resp.ok();
    });
    page.on("requestfailed", function (req) {
      var _a;
      var id = state.requestIds.get(req);
      if (!id) {
        return;
      }
      var rec;
      for (var i = state.requests.length - 1; i >= 0; i -= 1) {
        var candidate = state.requests[i];
        if (candidate && candidate.id === id) {
          rec = candidate;
          break;
        }
      }
      if (!rec) {
        return;
      }
      rec.failureText = (_a = req.failure()) === null || _a === void 0 ? void 0 : _a.errorText;
      rec.ok = false;
    });
    page.on("close", function () {
      pageStates.delete(page);
      observedPages.delete(page);
    });
  }
  return state;
}
function observeContext(context) {
  if (observedContexts.has(context)) {
    return;
  }
  observedContexts.add(context);
  ensureContextState(context);
  for (var _i = 0, _a = context.pages(); _i < _a.length; _i++) {
    var page = _a[_i];
    ensurePageState(page);
  }
  context.on("page", function (page) {
    return ensurePageState(page);
  });
}
function ensureContextState(context) {
  var existing = contextStates.get(context);
  if (existing) {
    return existing;
  }
  var state = { traceActive: false };
  contextStates.set(context, state);
  return state;
}
function observeBrowser(browser) {
  for (var _i = 0, _a = browser.contexts(); _i < _a.length; _i++) {
    var context = _a[_i];
    observeContext(context);
  }
}
function connectBrowser(cdpUrl) {
  return __awaiter(this, void 0, void 0, function () {
    var normalized, connectWithRetry;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          normalized = normalizeCdpUrl(cdpUrl);
          if ((cached === null || cached === void 0 ? void 0 : cached.cdpUrl) === normalized) {
            return [2 /*return*/, cached];
          }
          if (!connecting) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, connecting];
        case 1:
          return [2 /*return*/, _a.sent()];
        case 2:
          connectWithRetry = function () {
            return __awaiter(_this, void 0, void 0, function () {
              var lastErr, _loop_1, attempt, state_1, message;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    _loop_1 = function (attempt) {
                      var timeout, wsUrl, endpoint, headers, browser_1, connected, err_1, delay_1;
                      return __generator(this, function (_b) {
                        switch (_b.label) {
                          case 0:
                            _b.trys.push([0, 3, , 5]);
                            timeout = 5000 + attempt * 2000;
                            return [
                              4 /*yield*/,
                              (0, chrome_js_1.getChromeWebSocketUrl)(normalized, timeout).catch(
                                function () {
                                  return null;
                                },
                              ),
                            ];
                          case 1:
                            wsUrl = _b.sent();
                            endpoint = wsUrl !== null && wsUrl !== void 0 ? wsUrl : normalized;
                            headers = (0, cdp_helpers_js_1.getHeadersWithAuth)(endpoint);
                            return [
                              4 /*yield*/,
                              playwright_core_1.chromium.connectOverCDP(endpoint, {
                                timeout: timeout,
                                headers: headers,
                              }),
                            ];
                          case 2:
                            browser_1 = _b.sent();
                            connected = { browser: browser_1, cdpUrl: normalized };
                            cached = connected;
                            observeBrowser(browser_1);
                            browser_1.on("disconnected", function () {
                              if (
                                (cached === null || cached === void 0 ? void 0 : cached.browser) ===
                                browser_1
                              ) {
                                cached = null;
                              }
                            });
                            return [2 /*return*/, { value: connected }];
                          case 3:
                            err_1 = _b.sent();
                            lastErr = err_1;
                            delay_1 = 250 + attempt * 250;
                            return [
                              4 /*yield*/,
                              new Promise(function (r) {
                                return setTimeout(r, delay_1);
                              }),
                            ];
                          case 4:
                            _b.sent();
                            return [3 /*break*/, 5];
                          case 5:
                            return [2 /*return*/];
                        }
                      });
                    };
                    attempt = 0;
                    _a.label = 1;
                  case 1:
                    if (!(attempt < 3)) {
                      return [3 /*break*/, 4];
                    }
                    return [5 /*yield**/, _loop_1(attempt)];
                  case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object") {
                      return [2 /*return*/, state_1.value];
                    }
                    _a.label = 3;
                  case 3:
                    attempt += 1;
                    return [3 /*break*/, 1];
                  case 4:
                    if (lastErr instanceof Error) {
                      throw lastErr;
                    }
                    message = lastErr
                      ? (0, errors_js_1.formatErrorMessage)(lastErr)
                      : "CDP connect failed";
                    throw new Error(message);
                }
              });
            });
          };
          connecting = connectWithRetry().finally(function () {
            connecting = null;
          });
          return [4 /*yield*/, connecting];
        case 3:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function getAllPages(browser) {
  return __awaiter(this, void 0, void 0, function () {
    var contexts, pages;
    return __generator(this, function (_a) {
      contexts = browser.contexts();
      pages = contexts.flatMap(function (c) {
        return c.pages();
      });
      return [2 /*return*/, pages];
    });
  });
}
function pageTargetId(page) {
  return __awaiter(this, void 0, void 0, function () {
    var session, info, targetId;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [4 /*yield*/, page.context().newCDPSession(page)];
        case 1:
          session = _c.sent();
          _c.label = 2;
        case 2:
          _c.trys.push([2, , 4, 6]);
          return [4 /*yield*/, session.send("Target.getTargetInfo")];
        case 3:
          info = _c.sent();
          targetId = String(
            (_b =
              (_a = info === null || info === void 0 ? void 0 : info.targetInfo) === null ||
              _a === void 0
                ? void 0
                : _a.targetId) !== null && _b !== void 0
              ? _b
              : "",
          ).trim();
          return [2 /*return*/, targetId || null];
        case 4:
          return [4 /*yield*/, session.detach().catch(function () {})];
        case 5:
          _c.sent();
          return [7 /*endfinally*/];
        case 6:
          return [2 /*return*/];
      }
    });
  });
}
function findPageByTargetId(browser, targetId, cdpUrl) {
  return __awaiter(this, void 0, void 0, function () {
    var pages,
      _i,
      pages_1,
      page,
      tid,
      baseUrl,
      response,
      targets,
      target_1,
      urlMatch,
      sameUrlTargets,
      idx,
      _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, getAllPages(browser)];
        case 1:
          pages = _b.sent();
          ((_i = 0), (pages_1 = pages));
          _b.label = 2;
        case 2:
          if (!(_i < pages_1.length)) {
            return [3 /*break*/, 5];
          }
          page = pages_1[_i];
          return [
            4 /*yield*/,
            pageTargetId(page).catch(function () {
              return null;
            }),
          ];
        case 3:
          tid = _b.sent();
          if (tid && tid === targetId) {
            return [2 /*return*/, page];
          }
          _b.label = 4;
        case 4:
          _i++;
          return [3 /*break*/, 2];
        case 5:
          if (!cdpUrl) {
            return [3 /*break*/, 11];
          }
          _b.label = 6;
        case 6:
          _b.trys.push([6, 10, , 11]);
          baseUrl = cdpUrl
            .replace(/\/+$/, "")
            .replace(/^ws:/, "http:")
            .replace(/\/cdp$/, "");
          return [4 /*yield*/, fetch("".concat(baseUrl, "/json/list"))];
        case 7:
          response = _b.sent();
          if (!response.ok) {
            return [3 /*break*/, 9];
          }
          return [4 /*yield*/, response.json()];
        case 8:
          targets = _b.sent();
          target_1 = targets.find(function (t) {
            return t.id === targetId;
          });
          if (target_1) {
            urlMatch = pages.filter(function (p) {
              return p.url() === target_1.url;
            });
            if (urlMatch.length === 1) {
              return [2 /*return*/, urlMatch[0]];
            }
            // If multiple URL matches, use index-based matching as fallback
            // This works when Playwright and the relay enumerate tabs in the same order
            if (urlMatch.length > 1) {
              sameUrlTargets = targets.filter(function (t) {
                return t.url === target_1.url;
              });
              if (sameUrlTargets.length === urlMatch.length) {
                idx = sameUrlTargets.findIndex(function (t) {
                  return t.id === targetId;
                });
                if (idx >= 0 && idx < urlMatch.length) {
                  return [2 /*return*/, urlMatch[idx]];
                }
              }
            }
          }
          _b.label = 9;
        case 9:
          return [3 /*break*/, 11];
        case 10:
          _a = _b.sent();
          return [3 /*break*/, 11];
        case 11:
          return [2 /*return*/, null];
      }
    });
  });
}
function getPageForTargetId(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var browser, pages, first, found;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, connectBrowser(opts.cdpUrl)];
        case 1:
          browser = _a.sent().browser;
          return [4 /*yield*/, getAllPages(browser)];
        case 2:
          pages = _a.sent();
          if (!pages.length) {
            throw new Error("No pages available in the connected browser.");
          }
          first = pages[0];
          if (!opts.targetId) {
            return [2 /*return*/, first];
          }
          return [4 /*yield*/, findPageByTargetId(browser, opts.targetId, opts.cdpUrl)];
        case 3:
          found = _a.sent();
          if (!found) {
            // Extension relays can block CDP attachment APIs (e.g. Target.attachToBrowserTarget),
            // which prevents us from resolving a page's targetId via newCDPSession(). If Playwright
            // only exposes a single Page, use it as a best-effort fallback.
            if (pages.length === 1) {
              return [2 /*return*/, first];
            }
            throw new Error("tab not found");
          }
          return [2 /*return*/, found];
      }
    });
  });
}
function refLocator(page, ref) {
  var _a;
  var normalized = ref.startsWith("@") ? ref.slice(1) : ref.startsWith("ref=") ? ref.slice(4) : ref;
  if (/^e\d+$/.test(normalized)) {
    var state = pageStates.get(page);
    if ((state === null || state === void 0 ? void 0 : state.roleRefsMode) === "aria") {
      var scope_1 = state.roleRefsFrameSelector
        ? page.frameLocator(state.roleRefsFrameSelector)
        : page;
      return scope_1.locator("aria-ref=".concat(normalized));
    }
    var info =
      (_a = state === null || state === void 0 ? void 0 : state.roleRefs) === null || _a === void 0
        ? void 0
        : _a[normalized];
    if (!info) {
      throw new Error(
        'Unknown ref "'.concat(
          normalized,
          '". Run a new snapshot and use a ref from that snapshot.',
        ),
      );
    }
    var scope = (state === null || state === void 0 ? void 0 : state.roleRefsFrameSelector)
      ? page.frameLocator(state.roleRefsFrameSelector)
      : page;
    var locAny = scope;
    var locator = info.name
      ? locAny.getByRole(info.role, { name: info.name, exact: true })
      : locAny.getByRole(info.role);
    return info.nth !== undefined ? locator.nth(info.nth) : locator;
  }
  return page.locator("aria-ref=".concat(normalized));
}
function closePlaywrightBrowserConnection() {
  return __awaiter(this, void 0, void 0, function () {
    var cur;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          cur = cached;
          cached = null;
          if (!cur) {
            return [2 /*return*/];
          }
          return [4 /*yield*/, cur.browser.close().catch(function () {})];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
/**
 * List all pages/tabs from the persistent Playwright connection.
 * Used for remote profiles where HTTP-based /json/list is ephemeral.
 */
function listPagesViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var browser, pages, results, _i, pages_2, page, tid, _a, _b;
    var _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          return [4 /*yield*/, connectBrowser(opts.cdpUrl)];
        case 1:
          browser = _d.sent().browser;
          return [4 /*yield*/, getAllPages(browser)];
        case 2:
          pages = _d.sent();
          results = [];
          ((_i = 0), (pages_2 = pages));
          _d.label = 3;
        case 3:
          if (!(_i < pages_2.length)) {
            return [3 /*break*/, 7];
          }
          page = pages_2[_i];
          return [
            4 /*yield*/,
            pageTargetId(page).catch(function () {
              return null;
            }),
          ];
        case 4:
          tid = _d.sent();
          if (!tid) {
            return [3 /*break*/, 6];
          }
          _b = (_a = results).push;
          _c = {
            targetId: tid,
          };
          return [
            4 /*yield*/,
            page.title().catch(function () {
              return "";
            }),
          ];
        case 5:
          _b.apply(_a, [((_c.title = _d.sent()), (_c.url = page.url()), (_c.type = "page"), _c)]);
          _d.label = 6;
        case 6:
          _i++;
          return [3 /*break*/, 3];
        case 7:
          return [2 /*return*/, results];
      }
    });
  });
}
/**
 * Create a new page/tab using the persistent Playwright connection.
 * Used for remote profiles where HTTP-based /json/new is ephemeral.
 * Returns the new page's targetId and metadata.
 */
function createPageViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var browser, context, _a, page, targetUrl, tid;
    var _b;
    var _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          return [4 /*yield*/, connectBrowser(opts.cdpUrl)];
        case 1:
          browser = _d.sent().browser;
          if (!((_c = browser.contexts()[0]) !== null && _c !== void 0)) {
            return [3 /*break*/, 2];
          }
          _a = _c;
          return [3 /*break*/, 4];
        case 2:
          return [4 /*yield*/, browser.newContext()];
        case 3:
          _a = _d.sent();
          _d.label = 4;
        case 4:
          context = _a;
          ensureContextState(context);
          return [4 /*yield*/, context.newPage()];
        case 5:
          page = _d.sent();
          ensurePageState(page);
          targetUrl = opts.url.trim() || "about:blank";
          if (!(targetUrl !== "about:blank")) {
            return [3 /*break*/, 7];
          }
          return [
            4 /*yield*/,
            page.goto(targetUrl, { timeout: 30000 }).catch(function () {
              // Navigation might fail for some URLs, but page is still created
            }),
          ];
        case 6:
          _d.sent();
          _d.label = 7;
        case 7:
          return [
            4 /*yield*/,
            pageTargetId(page).catch(function () {
              return null;
            }),
          ];
        case 8:
          tid = _d.sent();
          if (!tid) {
            throw new Error("Failed to get targetId for new page");
          }
          _b = {
            targetId: tid,
          };
          return [
            4 /*yield*/,
            page.title().catch(function () {
              return "";
            }),
          ];
        case 9:
          return [
            2 /*return*/,
            ((_b.title = _d.sent()), (_b.url = page.url()), (_b.type = "page"), _b),
          ];
      }
    });
  });
}
/**
 * Close a page/tab by targetId using the persistent Playwright connection.
 * Used for remote profiles where HTTP-based /json/close is ephemeral.
 */
function closePageByTargetIdViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var browser, page;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, connectBrowser(opts.cdpUrl)];
        case 1:
          browser = _a.sent().browser;
          return [4 /*yield*/, findPageByTargetId(browser, opts.targetId, opts.cdpUrl)];
        case 2:
          page = _a.sent();
          if (!page) {
            throw new Error("tab not found");
          }
          return [4 /*yield*/, page.close()];
        case 3:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
/**
 * Focus a page/tab by targetId using the persistent Playwright connection.
 * Used for remote profiles where HTTP-based /json/activate can be ephemeral.
 */
function focusPageByTargetIdViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var browser, page, err_2, session, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, connectBrowser(opts.cdpUrl)];
        case 1:
          browser = _b.sent().browser;
          return [4 /*yield*/, findPageByTargetId(browser, opts.targetId, opts.cdpUrl)];
        case 2:
          page = _b.sent();
          if (!page) {
            throw new Error("tab not found");
          }
          _b.label = 3;
        case 3:
          _b.trys.push([3, 5, , 13]);
          return [4 /*yield*/, page.bringToFront()];
        case 4:
          _b.sent();
          return [3 /*break*/, 13];
        case 5:
          err_2 = _b.sent();
          return [4 /*yield*/, page.context().newCDPSession(page)];
        case 6:
          session = _b.sent();
          _b.label = 7;
        case 7:
          _b.trys.push([7, 9, 10, 12]);
          return [4 /*yield*/, session.send("Page.bringToFront")];
        case 8:
          _b.sent();
          return [2 /*return*/];
        case 9:
          _a = _b.sent();
          throw err_2;
        case 10:
          return [4 /*yield*/, session.detach().catch(function () {})];
        case 11:
          _b.sent();
          return [7 /*endfinally*/];
        case 12:
          return [3 /*break*/, 13];
        case 13:
          return [2 /*return*/];
      }
    });
  });
}
