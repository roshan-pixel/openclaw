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
exports.createBrowserRouteContext = createBrowserRouteContext;
var node_fs_1 = require("node:fs");
var cdp_js_1 = require("./cdp.js");
var chrome_js_1 = require("./chrome.js");
var config_js_1 = require("./config.js");
var extension_relay_js_1 = require("./extension-relay.js");
var pw_ai_module_js_1 = require("./pw-ai-module.js");
var target_id_js_1 = require("./target-id.js");
var trash_js_1 = require("./trash.js");
/**
 * Normalize a CDP WebSocket URL to use the correct base URL.
 */
function normalizeWsUrl(raw, cdpBaseUrl) {
  if (!raw) {
    return undefined;
  }
  try {
    return (0, cdp_js_1.normalizeCdpWsUrl)(raw, cdpBaseUrl);
  } catch (_a) {
    return raw;
  }
}
function fetchJson(url_1) {
  return __awaiter(this, arguments, void 0, function (url, timeoutMs, init) {
    var ctrl, t, headers, res;
    if (timeoutMs === void 0) {
      timeoutMs = 1500;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          ctrl = new AbortController();
          t = setTimeout(function () {
            return ctrl.abort();
          }, timeoutMs);
          _a.label = 1;
        case 1:
          _a.trys.push([1, , 4, 5]);
          headers = (0, cdp_js_1.getHeadersWithAuth)(
            url,
            (init === null || init === void 0 ? void 0 : init.headers) || {},
          );
          return [
            4 /*yield*/,
            fetch(url, __assign(__assign({}, init), { headers: headers, signal: ctrl.signal })),
          ];
        case 2:
          res = _a.sent();
          if (!res.ok) {
            throw new Error("HTTP ".concat(res.status));
          }
          return [4 /*yield*/, res.json()];
        case 3:
          return [2 /*return*/, _a.sent()];
        case 4:
          clearTimeout(t);
          return [7 /*endfinally*/];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function fetchOk(url_1) {
  return __awaiter(this, arguments, void 0, function (url, timeoutMs, init) {
    var ctrl, t, headers, res;
    if (timeoutMs === void 0) {
      timeoutMs = 1500;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          ctrl = new AbortController();
          t = setTimeout(function () {
            return ctrl.abort();
          }, timeoutMs);
          _a.label = 1;
        case 1:
          _a.trys.push([1, , 3, 4]);
          headers = (0, cdp_js_1.getHeadersWithAuth)(
            url,
            (init === null || init === void 0 ? void 0 : init.headers) || {},
          );
          return [
            4 /*yield*/,
            fetch(url, __assign(__assign({}, init), { headers: headers, signal: ctrl.signal })),
          ];
        case 2:
          res = _a.sent();
          if (!res.ok) {
            throw new Error("HTTP ".concat(res.status));
          }
          return [3 /*break*/, 4];
        case 3:
          clearTimeout(t);
          return [7 /*endfinally*/];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
/**
 * Create a profile-scoped context for browser operations.
 */
function createProfileContext(opts, profile) {
  var _this = this;
  var state = function () {
    var current = opts.getState();
    if (!current) {
      throw new Error("Browser server not started");
    }
    return current;
  };
  var getProfileState = function () {
    var current = state();
    var profileState = current.profiles.get(profile.name);
    if (!profileState) {
      profileState = { profile: profile, running: null, lastTargetId: null };
      current.profiles.set(profile.name, profileState);
    }
    return profileState;
  };
  var setProfileRunning = function (running) {
    var profileState = getProfileState();
    profileState.running = running;
  };
  var listTabs = function () {
    return __awaiter(_this, void 0, void 0, function () {
      var mod, listPagesViaPlaywright, pages, raw;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!!profile.cdpIsLoopback) {
              return [3 /*break*/, 3];
            }
            return [4 /*yield*/, (0, pw_ai_module_js_1.getPwAiModule)({ mode: "strict" })];
          case 1:
            mod = _a.sent();
            listPagesViaPlaywright =
              mod === null || mod === void 0 ? void 0 : mod.listPagesViaPlaywright;
            if (!(typeof listPagesViaPlaywright === "function")) {
              return [3 /*break*/, 3];
            }
            return [4 /*yield*/, listPagesViaPlaywright({ cdpUrl: profile.cdpUrl })];
          case 2:
            pages = _a.sent();
            return [
              2 /*return*/,
              pages.map(function (p) {
                return {
                  targetId: p.targetId,
                  title: p.title,
                  url: p.url,
                  type: p.type,
                };
              }),
            ];
          case 3:
            return [
              4 /*yield*/,
              fetchJson((0, cdp_js_1.appendCdpPath)(profile.cdpUrl, "/json/list")),
            ];
          case 4:
            raw = _a.sent();
            return [
              2 /*return*/,
              raw
                .map(function (t) {
                  var _a, _b, _c;
                  return {
                    targetId: (_a = t.id) !== null && _a !== void 0 ? _a : "",
                    title: (_b = t.title) !== null && _b !== void 0 ? _b : "",
                    url: (_c = t.url) !== null && _c !== void 0 ? _c : "",
                    wsUrl: normalizeWsUrl(t.webSocketDebuggerUrl, profile.cdpUrl),
                    type: t.type,
                  };
                })
                .filter(function (t) {
                  return Boolean(t.targetId);
                }),
            ];
        }
      });
    });
  };
  var openTab = function (url) {
    return __awaiter(_this, void 0, void 0, function () {
      var mod,
        createPageViaPlaywright,
        page,
        profileState_1,
        createdViaCdp,
        profileState_2,
        deadline,
        tabs,
        found,
        encoded,
        endpointUrl,
        endpoint,
        created,
        profileState;
      var _this = this;
      var _a, _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            if (!!profile.cdpIsLoopback) {
              return [3 /*break*/, 3];
            }
            return [4 /*yield*/, (0, pw_ai_module_js_1.getPwAiModule)({ mode: "strict" })];
          case 1:
            mod = _c.sent();
            createPageViaPlaywright =
              mod === null || mod === void 0 ? void 0 : mod.createPageViaPlaywright;
            if (!(typeof createPageViaPlaywright === "function")) {
              return [3 /*break*/, 3];
            }
            return [4 /*yield*/, createPageViaPlaywright({ cdpUrl: profile.cdpUrl, url: url })];
          case 2:
            page = _c.sent();
            profileState_1 = getProfileState();
            profileState_1.lastTargetId = page.targetId;
            return [
              2 /*return*/,
              {
                targetId: page.targetId,
                title: page.title,
                url: page.url,
                type: page.type,
              },
            ];
          case 3:
            return [
              4 /*yield*/,
              (0, cdp_js_1.createTargetViaCdp)({
                cdpUrl: profile.cdpUrl,
                url: url,
              })
                .then(function (r) {
                  return r.targetId;
                })
                .catch(function () {
                  return null;
                }),
            ];
          case 4:
            createdViaCdp = _c.sent();
            if (!createdViaCdp) {
              return [3 /*break*/, 9];
            }
            profileState_2 = getProfileState();
            profileState_2.lastTargetId = createdViaCdp;
            deadline = Date.now() + 2000;
            _c.label = 5;
          case 5:
            if (!(Date.now() < deadline)) {
              return [3 /*break*/, 8];
            }
            return [
              4 /*yield*/,
              listTabs().catch(function () {
                return [];
              }),
            ];
          case 6:
            tabs = _c.sent();
            found = tabs.find(function (t) {
              return t.targetId === createdViaCdp;
            });
            if (found) {
              return [2 /*return*/, found];
            }
            return [
              4 /*yield*/,
              new Promise(function (r) {
                return setTimeout(r, 100);
              }),
            ];
          case 7:
            _c.sent();
            return [3 /*break*/, 5];
          case 8:
            return [2 /*return*/, { targetId: createdViaCdp, title: "", url: url, type: "page" }];
          case 9:
            encoded = encodeURIComponent(url);
            endpointUrl = new URL((0, cdp_js_1.appendCdpPath)(profile.cdpUrl, "/json/new"));
            endpoint = endpointUrl.search
              ? (function () {
                  endpointUrl.searchParams.set("url", url);
                  return endpointUrl.toString();
                })()
              : "".concat(endpointUrl.toString(), "?").concat(encoded);
            return [
              4 /*yield*/,
              fetchJson(endpoint, 1500, {
                method: "PUT",
              }).catch(function (err) {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        if (!String(err).includes("HTTP 405")) {
                          return [3 /*break*/, 2];
                        }
                        return [4 /*yield*/, fetchJson(endpoint, 1500)];
                      case 1:
                        return [2 /*return*/, _a.sent()];
                      case 2:
                        throw err;
                    }
                  });
                });
              }),
            ];
          case 10:
            created = _c.sent();
            if (!created.id) {
              throw new Error("Failed to open tab (missing id)");
            }
            profileState = getProfileState();
            profileState.lastTargetId = created.id;
            return [
              2 /*return*/,
              {
                targetId: created.id,
                title: (_a = created.title) !== null && _a !== void 0 ? _a : "",
                url: (_b = created.url) !== null && _b !== void 0 ? _b : url,
                wsUrl: normalizeWsUrl(created.webSocketDebuggerUrl, profile.cdpUrl),
                type: created.type,
              },
            ];
        }
      });
    });
  };
  var resolveRemoteHttpTimeout = function (timeoutMs) {
    if (profile.cdpIsLoopback) {
      return timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : 300;
    }
    var resolved = state().resolved;
    if (typeof timeoutMs === "number" && Number.isFinite(timeoutMs)) {
      return Math.max(Math.floor(timeoutMs), resolved.remoteCdpTimeoutMs);
    }
    return resolved.remoteCdpTimeoutMs;
  };
  var resolveRemoteWsTimeout = function (timeoutMs) {
    if (profile.cdpIsLoopback) {
      var base = timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : 300;
      return Math.max(200, Math.min(2000, base * 2));
    }
    var resolved = state().resolved;
    if (typeof timeoutMs === "number" && Number.isFinite(timeoutMs)) {
      return Math.max(Math.floor(timeoutMs) * 2, resolved.remoteCdpHandshakeTimeoutMs);
    }
    return resolved.remoteCdpHandshakeTimeoutMs;
  };
  var isReachable = function (timeoutMs) {
    return __awaiter(_this, void 0, void 0, function () {
      var httpTimeout, wsTimeout;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            httpTimeout = resolveRemoteHttpTimeout(timeoutMs);
            wsTimeout = resolveRemoteWsTimeout(timeoutMs);
            return [
              4 /*yield*/,
              (0, chrome_js_1.isChromeCdpReady)(profile.cdpUrl, httpTimeout, wsTimeout),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  var isHttpReachable = function (timeoutMs) {
    return __awaiter(_this, void 0, void 0, function () {
      var httpTimeout;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            httpTimeout = resolveRemoteHttpTimeout(timeoutMs);
            return [4 /*yield*/, (0, chrome_js_1.isChromeReachable)(profile.cdpUrl, httpTimeout)];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  var attachRunning = function (running) {
    setProfileRunning(running);
    running.proc.on("exit", function () {
      var _a;
      // Guard against server teardown (e.g., SIGUSR1 restart)
      if (!opts.getState()) {
        return;
      }
      var profileState = getProfileState();
      if (
        ((_a = profileState.running) === null || _a === void 0 ? void 0 : _a.pid) === running.pid
      ) {
        setProfileRunning(null);
      }
    });
  };
  var ensureBrowserAvailable = function () {
    return __awaiter(_this, void 0, void 0, function () {
      var current, remoteCdp, isExtension, profileState, httpReachable, launched, relaunched;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            current = state();
            remoteCdp = !profile.cdpIsLoopback;
            isExtension = profile.driver === "extension";
            profileState = getProfileState();
            return [4 /*yield*/, isHttpReachable()];
          case 1:
            httpReachable = _a.sent();
            if (isExtension && remoteCdp) {
              throw new Error(
                'Profile "'
                  .concat(profile.name, '" uses driver=extension but cdpUrl is not loopback (')
                  .concat(profile.cdpUrl, ")."),
              );
            }
            if (!isExtension) {
              return [3 /*break*/, 6];
            }
            if (!!httpReachable) {
              return [3 /*break*/, 4];
            }
            return [
              4 /*yield*/,
              (0, extension_relay_js_1.ensureChromeExtensionRelayServer)({
                cdpUrl: profile.cdpUrl,
              }),
            ];
          case 2:
            _a.sent();
            return [4 /*yield*/, isHttpReachable(1200)];
          case 3:
            if (_a.sent()) {
              // continue: we still need the extension to connect for CDP websocket.
            } else {
              throw new Error(
                'Chrome extension relay for profile "'
                  .concat(profile.name, '" is not reachable at ')
                  .concat(profile.cdpUrl, "."),
              );
            }
            _a.label = 4;
          case 4:
            return [4 /*yield*/, isReachable(600)];
          case 5:
            if (_a.sent()) {
              return [2 /*return*/];
            }
            // Relay server is up, but no attached tab yet. Prompt user to attach.
            throw new Error(
              'Chrome extension relay is running, but no tab is connected. Click the OpenClaw Chrome extension icon on a tab to attach it (profile "'.concat(
                profile.name,
                '").',
              ),
            );
          case 6:
            if (!!httpReachable) {
              return [3 /*break*/, 11];
            }
            if (!((current.resolved.attachOnly || remoteCdp) && opts.onEnsureAttachTarget)) {
              return [3 /*break*/, 9];
            }
            return [4 /*yield*/, opts.onEnsureAttachTarget(profile)];
          case 7:
            _a.sent();
            return [4 /*yield*/, isHttpReachable(1200)];
          case 8:
            if (_a.sent()) {
              return [2 /*return*/];
            }
            _a.label = 9;
          case 9:
            if (current.resolved.attachOnly || remoteCdp) {
              throw new Error(
                remoteCdp
                  ? 'Remote CDP for profile "'
                      .concat(profile.name, '" is not reachable at ')
                      .concat(profile.cdpUrl, ".")
                  : 'Browser attachOnly is enabled and profile "'.concat(
                      profile.name,
                      '" is not running.',
                    ),
              );
            }
            return [4 /*yield*/, (0, chrome_js_1.launchOpenClawChrome)(current.resolved, profile)];
          case 10:
            launched = _a.sent();
            attachRunning(launched);
            return [2 /*return*/];
          case 11:
            return [4 /*yield*/, isReachable()];
          case 12:
            // Port is reachable - check if we own it
            if (_a.sent()) {
              return [2 /*return*/];
            }
            // HTTP responds but WebSocket fails - port in use by something else
            if (!profileState.running) {
              throw new Error(
                "Port "
                  .concat(profile.cdpPort, ' is in use for profile "')
                  .concat(profile.name, '" but not by openclaw. ') +
                  "Run action=reset-profile profile=".concat(profile.name, " to kill the process."),
              );
            }
            if (!(current.resolved.attachOnly || remoteCdp)) {
              return [3 /*break*/, 16];
            }
            if (!opts.onEnsureAttachTarget) {
              return [3 /*break*/, 15];
            }
            return [4 /*yield*/, opts.onEnsureAttachTarget(profile)];
          case 13:
            _a.sent();
            return [4 /*yield*/, isReachable(1200)];
          case 14:
            if (_a.sent()) {
              return [2 /*return*/];
            }
            _a.label = 15;
          case 15:
            throw new Error(
              remoteCdp
                ? 'Remote CDP websocket for profile "'.concat(profile.name, '" is not reachable.')
                : 'Browser attachOnly is enabled and CDP websocket for profile "'.concat(
                    profile.name,
                    '" is not reachable.',
                  ),
            );
          case 16:
            return [4 /*yield*/, (0, chrome_js_1.stopOpenClawChrome)(profileState.running)];
          case 17:
            _a.sent();
            setProfileRunning(null);
            return [4 /*yield*/, (0, chrome_js_1.launchOpenClawChrome)(current.resolved, profile)];
          case 18:
            relaunched = _a.sent();
            attachRunning(relaunched);
            return [4 /*yield*/, isReachable(600)];
          case 19:
            if (!_a.sent()) {
              throw new Error(
                'Chrome CDP websocket for profile "'.concat(
                  profile.name,
                  '" is not reachable after restart.',
                ),
              );
            }
            return [2 /*return*/];
        }
      });
    });
  };
  var ensureTabAvailable = function (targetId) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileState, tabs1, tabs, candidates, resolveById, pickDefault, chosen;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4 /*yield*/, ensureBrowserAvailable()];
          case 1:
            _b.sent();
            profileState = getProfileState();
            return [4 /*yield*/, listTabs()];
          case 2:
            tabs1 = _b.sent();
            if (!(tabs1.length === 0)) {
              return [3 /*break*/, 4];
            }
            if (profile.driver === "extension") {
              throw new Error(
                'tab not found (no attached Chrome tabs for profile "'.concat(
                  profile.name,
                  '"). ',
                ) +
                  "Click the OpenClaw Browser Relay toolbar icon on the tab you want to control (badge ON).",
              );
            }
            return [4 /*yield*/, openTab("about:blank")];
          case 3:
            _b.sent();
            _b.label = 4;
          case 4:
            return [4 /*yield*/, listTabs()];
          case 5:
            tabs = _b.sent();
            candidates =
              profile.driver === "extension" || !profile.cdpIsLoopback
                ? tabs
                : tabs.filter(function (t) {
                    return Boolean(t.wsUrl);
                  });
            resolveById = function (raw) {
              var _a;
              var resolved = (0, target_id_js_1.resolveTargetIdFromTabs)(raw, candidates);
              if (!resolved.ok) {
                if (resolved.reason === "ambiguous") {
                  return "AMBIGUOUS";
                }
                return null;
              }
              return (_a = candidates.find(function (t) {
                return t.targetId === resolved.targetId;
              })) !== null && _a !== void 0
                ? _a
                : null;
            };
            pickDefault = function () {
              var _a, _b;
              var last =
                ((_a = profileState.lastTargetId) === null || _a === void 0 ? void 0 : _a.trim()) ||
                "";
              var lastResolved = last ? resolveById(last) : null;
              if (lastResolved && lastResolved !== "AMBIGUOUS") {
                return lastResolved;
              }
              // Prefer a real page tab first (avoid service workers/background targets).
              var page = candidates.find(function (t) {
                var _a;
                return ((_a = t.type) !== null && _a !== void 0 ? _a : "page") === "page";
              });
              return (_b = page !== null && page !== void 0 ? page : candidates.at(0)) !== null &&
                _b !== void 0
                ? _b
                : null;
            };
            chosen = targetId ? resolveById(targetId) : pickDefault();
            if (!chosen && profile.driver === "extension" && candidates.length === 1) {
              // If an agent passes a stale/foreign targetId but we only have a single attached tab,
              // recover by using that tab instead of failing hard.
              chosen = (_a = candidates[0]) !== null && _a !== void 0 ? _a : null;
            }
            if (chosen === "AMBIGUOUS") {
              throw new Error("ambiguous target id prefix");
            }
            if (!chosen) {
              throw new Error("tab not found");
            }
            profileState.lastTargetId = chosen.targetId;
            return [2 /*return*/, chosen];
        }
      });
    });
  };
  var focusTab = function (targetId) {
    return __awaiter(_this, void 0, void 0, function () {
      var tabs, resolved, mod, focusPageByTargetIdViaPlaywright, profileState_3, profileState;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, listTabs()];
          case 1:
            tabs = _a.sent();
            resolved = (0, target_id_js_1.resolveTargetIdFromTabs)(targetId, tabs);
            if (!resolved.ok) {
              if (resolved.reason === "ambiguous") {
                throw new Error("ambiguous target id prefix");
              }
              throw new Error("tab not found");
            }
            if (!!profile.cdpIsLoopback) {
              return [3 /*break*/, 4];
            }
            return [4 /*yield*/, (0, pw_ai_module_js_1.getPwAiModule)({ mode: "strict" })];
          case 2:
            mod = _a.sent();
            focusPageByTargetIdViaPlaywright =
              mod === null || mod === void 0 ? void 0 : mod.focusPageByTargetIdViaPlaywright;
            if (!(typeof focusPageByTargetIdViaPlaywright === "function")) {
              return [3 /*break*/, 4];
            }
            return [
              4 /*yield*/,
              focusPageByTargetIdViaPlaywright({
                cdpUrl: profile.cdpUrl,
                targetId: resolved.targetId,
              }),
            ];
          case 3:
            _a.sent();
            profileState_3 = getProfileState();
            profileState_3.lastTargetId = resolved.targetId;
            return [2 /*return*/];
          case 4:
            return [
              4 /*yield*/,
              fetchOk(
                (0, cdp_js_1.appendCdpPath)(
                  profile.cdpUrl,
                  "/json/activate/".concat(resolved.targetId),
                ),
              ),
            ];
          case 5:
            _a.sent();
            profileState = getProfileState();
            profileState.lastTargetId = resolved.targetId;
            return [2 /*return*/];
        }
      });
    });
  };
  var closeTab = function (targetId) {
    return __awaiter(_this, void 0, void 0, function () {
      var tabs, resolved, mod, closePageByTargetIdViaPlaywright;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, listTabs()];
          case 1:
            tabs = _a.sent();
            resolved = (0, target_id_js_1.resolveTargetIdFromTabs)(targetId, tabs);
            if (!resolved.ok) {
              if (resolved.reason === "ambiguous") {
                throw new Error("ambiguous target id prefix");
              }
              throw new Error("tab not found");
            }
            if (!!profile.cdpIsLoopback) {
              return [3 /*break*/, 4];
            }
            return [4 /*yield*/, (0, pw_ai_module_js_1.getPwAiModule)({ mode: "strict" })];
          case 2:
            mod = _a.sent();
            closePageByTargetIdViaPlaywright =
              mod === null || mod === void 0 ? void 0 : mod.closePageByTargetIdViaPlaywright;
            if (!(typeof closePageByTargetIdViaPlaywright === "function")) {
              return [3 /*break*/, 4];
            }
            return [
              4 /*yield*/,
              closePageByTargetIdViaPlaywright({
                cdpUrl: profile.cdpUrl,
                targetId: resolved.targetId,
              }),
            ];
          case 3:
            _a.sent();
            return [2 /*return*/];
          case 4:
            return [
              4 /*yield*/,
              fetchOk(
                (0, cdp_js_1.appendCdpPath)(
                  profile.cdpUrl,
                  "/json/close/".concat(resolved.targetId),
                ),
              ),
            ];
          case 5:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  var stopRunningBrowser = function () {
    return __awaiter(_this, void 0, void 0, function () {
      var stopped, profileState;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!(profile.driver === "extension")) {
              return [3 /*break*/, 2];
            }
            return [
              4 /*yield*/,
              (0, extension_relay_js_1.stopChromeExtensionRelayServer)({
                cdpUrl: profile.cdpUrl,
              }),
            ];
          case 1:
            stopped = _a.sent();
            return [2 /*return*/, { stopped: stopped }];
          case 2:
            profileState = getProfileState();
            if (!profileState.running) {
              return [2 /*return*/, { stopped: false }];
            }
            return [4 /*yield*/, (0, chrome_js_1.stopOpenClawChrome)(profileState.running)];
          case 3:
            _a.sent();
            setProfileRunning(null);
            return [2 /*return*/, { stopped: true }];
        }
      });
    });
  };
  var resetProfile = function () {
    return __awaiter(_this, void 0, void 0, function () {
      var userDataDir, profileState, httpReachable, mod, _a, mod, _b, moved;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            if (!(profile.driver === "extension")) {
              return [3 /*break*/, 2];
            }
            return [
              4 /*yield*/,
              (0, extension_relay_js_1.stopChromeExtensionRelayServer)({
                cdpUrl: profile.cdpUrl,
              }).catch(function () {}),
            ];
          case 1:
            _c.sent();
            return [2 /*return*/, { moved: false, from: profile.cdpUrl }];
          case 2:
            if (!profile.cdpIsLoopback) {
              throw new Error(
                'reset-profile is only supported for local profiles (profile "'.concat(
                  profile.name,
                  '" is remote).',
                ),
              );
            }
            userDataDir = (0, chrome_js_1.resolveOpenClawUserDataDir)(profile.name);
            profileState = getProfileState();
            return [4 /*yield*/, isHttpReachable(300)];
          case 3:
            httpReachable = _c.sent();
            if (!(httpReachable && !profileState.running)) {
              return [3 /*break*/, 8];
            }
            _c.label = 4;
          case 4:
            _c.trys.push([4, 7, , 8]);
            return [
              4 /*yield*/,
              Promise.resolve().then(function () {
                return require("./pw-ai.js");
              }),
            ];
          case 5:
            mod = _c.sent();
            return [4 /*yield*/, mod.closePlaywrightBrowserConnection()];
          case 6:
            _c.sent();
            return [3 /*break*/, 8];
          case 7:
            _a = _c.sent();
            return [3 /*break*/, 8];
          case 8:
            if (!profileState.running) {
              return [3 /*break*/, 10];
            }
            return [4 /*yield*/, stopRunningBrowser()];
          case 9:
            _c.sent();
            _c.label = 10;
          case 10:
            _c.trys.push([10, 13, , 14]);
            return [
              4 /*yield*/,
              Promise.resolve().then(function () {
                return require("./pw-ai.js");
              }),
            ];
          case 11:
            mod = _c.sent();
            return [4 /*yield*/, mod.closePlaywrightBrowserConnection()];
          case 12:
            _c.sent();
            return [3 /*break*/, 14];
          case 13:
            _b = _c.sent();
            return [3 /*break*/, 14];
          case 14:
            if (!node_fs_1.default.existsSync(userDataDir)) {
              return [2 /*return*/, { moved: false, from: userDataDir }];
            }
            return [4 /*yield*/, (0, trash_js_1.movePathToTrash)(userDataDir)];
          case 15:
            moved = _c.sent();
            return [2 /*return*/, { moved: true, from: userDataDir, to: moved }];
        }
      });
    });
  };
  return {
    profile: profile,
    ensureBrowserAvailable: ensureBrowserAvailable,
    ensureTabAvailable: ensureTabAvailable,
    isHttpReachable: isHttpReachable,
    isReachable: isReachable,
    listTabs: listTabs,
    openTab: openTab,
    focusTab: focusTab,
    closeTab: closeTab,
    stopRunningBrowser: stopRunningBrowser,
    resetProfile: resetProfile,
  };
}
function createBrowserRouteContext(opts) {
  var _this = this;
  var state = function () {
    var current = opts.getState();
    if (!current) {
      throw new Error("Browser server not started");
    }
    return current;
  };
  var forProfile = function (profileName) {
    var current = state();
    var name =
      profileName !== null && profileName !== void 0
        ? profileName
        : current.resolved.defaultProfile;
    var profile = (0, config_js_1.resolveProfile)(current.resolved, name);
    if (!profile) {
      var available = Object.keys(current.resolved.profiles).join(", ");
      throw new Error(
        'Profile "'.concat(name, '" not found. Available profiles: ').concat(available || "(none)"),
      );
    }
    return createProfileContext(opts, profile);
  };
  var listProfiles = function () {
    return __awaiter(_this, void 0, void 0, function () {
      var current,
        result,
        _i,
        _a,
        name_1,
        profileState,
        profile,
        tabCount,
        running,
        ctx,
        tabs,
        _b,
        reachable,
        ctx,
        tabs,
        _c;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            current = state();
            result = [];
            ((_i = 0), (_a = Object.keys(current.resolved.profiles)));
            _d.label = 1;
          case 1:
            if (!(_i < _a.length)) {
              return [3 /*break*/, 13];
            }
            name_1 = _a[_i];
            profileState = current.profiles.get(name_1);
            profile = (0, config_js_1.resolveProfile)(current.resolved, name_1);
            if (!profile) {
              return [3 /*break*/, 12];
            }
            tabCount = 0;
            running = false;
            if (
              !(profileState === null || profileState === void 0 ? void 0 : profileState.running)
            ) {
              return [3 /*break*/, 6];
            }
            running = true;
            _d.label = 2;
          case 2:
            _d.trys.push([2, 4, , 5]);
            ctx = createProfileContext(opts, profile);
            return [4 /*yield*/, ctx.listTabs()];
          case 3:
            tabs = _d.sent();
            tabCount = tabs.filter(function (t) {
              return t.type === "page";
            }).length;
            return [3 /*break*/, 5];
          case 4:
            _b = _d.sent();
            return [3 /*break*/, 5];
          case 5:
            return [3 /*break*/, 11];
          case 6:
            _d.trys.push([6, 10, , 11]);
            return [4 /*yield*/, (0, chrome_js_1.isChromeReachable)(profile.cdpUrl, 200)];
          case 7:
            reachable = _d.sent();
            if (!reachable) {
              return [3 /*break*/, 9];
            }
            running = true;
            ctx = createProfileContext(opts, profile);
            return [
              4 /*yield*/,
              ctx.listTabs().catch(function () {
                return [];
              }),
            ];
          case 8:
            tabs = _d.sent();
            tabCount = tabs.filter(function (t) {
              return t.type === "page";
            }).length;
            _d.label = 9;
          case 9:
            return [3 /*break*/, 11];
          case 10:
            _c = _d.sent();
            return [3 /*break*/, 11];
          case 11:
            result.push({
              name: name_1,
              cdpPort: profile.cdpPort,
              cdpUrl: profile.cdpUrl,
              color: profile.color,
              running: running,
              tabCount: tabCount,
              isDefault: name_1 === current.resolved.defaultProfile,
              isRemote: !profile.cdpIsLoopback,
            });
            _d.label = 12;
          case 12:
            _i++;
            return [3 /*break*/, 1];
          case 13:
            return [2 /*return*/, result];
        }
      });
    });
  };
  // Create default profile context for backward compatibility
  var getDefaultContext = function () {
    return forProfile();
  };
  var mapTabError = function (err) {
    var msg = String(err);
    if (msg.includes("ambiguous target id prefix")) {
      return { status: 409, message: "ambiguous target id prefix" };
    }
    if (msg.includes("tab not found")) {
      return { status: 404, message: msg };
    }
    if (msg.includes("not found")) {
      return { status: 404, message: msg };
    }
    return null;
  };
  return {
    state: state,
    forProfile: forProfile,
    listProfiles: listProfiles,
    // Legacy methods delegate to default profile
    ensureBrowserAvailable: function () {
      return getDefaultContext().ensureBrowserAvailable();
    },
    ensureTabAvailable: function (targetId) {
      return getDefaultContext().ensureTabAvailable(targetId);
    },
    isHttpReachable: function (timeoutMs) {
      return getDefaultContext().isHttpReachable(timeoutMs);
    },
    isReachable: function (timeoutMs) {
      return getDefaultContext().isReachable(timeoutMs);
    },
    listTabs: function () {
      return getDefaultContext().listTabs();
    },
    openTab: function (url) {
      return getDefaultContext().openTab(url);
    },
    focusTab: function (targetId) {
      return getDefaultContext().focusTab(targetId);
    },
    closeTab: function (targetId) {
      return getDefaultContext().closeTab(targetId);
    },
    stopRunningBrowser: function () {
      return getDefaultContext().stopRunningBrowser();
    },
    resetProfile: function () {
      return getDefaultContext().resetProfile();
    },
    mapTabError: mapTabError,
  };
}
