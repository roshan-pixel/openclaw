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
exports.isProfileDecorated =
  exports.ensureProfileCleanExit =
  exports.decorateOpenClawProfile =
  exports.resolveBrowserExecutableForPlatform =
  exports.findChromeExecutableWindows =
  exports.findChromeExecutableMac =
  exports.findChromeExecutableLinux =
    void 0;
exports.resolveOpenClawUserDataDir = resolveOpenClawUserDataDir;
exports.isChromeReachable = isChromeReachable;
exports.getChromeWebSocketUrl = getChromeWebSocketUrl;
exports.isChromeCdpReady = isChromeCdpReady;
exports.launchOpenClawChrome = launchOpenClawChrome;
exports.stopOpenClawChrome = stopOpenClawChrome;
var node_child_process_1 = require("node:child_process");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var ws_1 = require("ws");
var ports_js_1 = require("../infra/ports.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var utils_js_1 = require("../utils.js");
var cdp_js_1 = require("./cdp.js");
var cdp_helpers_js_1 = require("./cdp.helpers.js");
var chrome_executables_js_1 = require("./chrome.executables.js");
var chrome_profile_decoration_js_1 = require("./chrome.profile-decoration.js");
var constants_js_1 = require("./constants.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("browser").child("chrome");
var chrome_executables_js_2 = require("./chrome.executables.js");
Object.defineProperty(exports, "findChromeExecutableLinux", {
  enumerable: true,
  get: function () {
    return chrome_executables_js_2.findChromeExecutableLinux;
  },
});
Object.defineProperty(exports, "findChromeExecutableMac", {
  enumerable: true,
  get: function () {
    return chrome_executables_js_2.findChromeExecutableMac;
  },
});
Object.defineProperty(exports, "findChromeExecutableWindows", {
  enumerable: true,
  get: function () {
    return chrome_executables_js_2.findChromeExecutableWindows;
  },
});
Object.defineProperty(exports, "resolveBrowserExecutableForPlatform", {
  enumerable: true,
  get: function () {
    return chrome_executables_js_2.resolveBrowserExecutableForPlatform;
  },
});
var chrome_profile_decoration_js_2 = require("./chrome.profile-decoration.js");
Object.defineProperty(exports, "decorateOpenClawProfile", {
  enumerable: true,
  get: function () {
    return chrome_profile_decoration_js_2.decorateOpenClawProfile;
  },
});
Object.defineProperty(exports, "ensureProfileCleanExit", {
  enumerable: true,
  get: function () {
    return chrome_profile_decoration_js_2.ensureProfileCleanExit;
  },
});
Object.defineProperty(exports, "isProfileDecorated", {
  enumerable: true,
  get: function () {
    return chrome_profile_decoration_js_2.isProfileDecorated;
  },
});
function exists(filePath) {
  try {
    return node_fs_1.default.existsSync(filePath);
  } catch (_a) {
    return false;
  }
}
function resolveBrowserExecutable(resolved) {
  return (0, chrome_executables_js_1.resolveBrowserExecutableForPlatform)(
    resolved,
    process.platform,
  );
}
function resolveOpenClawUserDataDir(profileName) {
  if (profileName === void 0) {
    profileName = constants_js_1.DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME;
  }
  return node_path_1.default.join(utils_js_1.CONFIG_DIR, "browser", profileName, "user-data");
}
function cdpUrlForPort(cdpPort) {
  return "http://127.0.0.1:".concat(cdpPort);
}
function isChromeReachable(cdpUrl_1) {
  return __awaiter(this, arguments, void 0, function (cdpUrl, timeoutMs) {
    var version;
    if (timeoutMs === void 0) {
      timeoutMs = 500;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, fetchChromeVersion(cdpUrl, timeoutMs)];
        case 1:
          version = _a.sent();
          return [2 /*return*/, Boolean(version)];
      }
    });
  });
}
function fetchChromeVersion(cdpUrl_1) {
  return __awaiter(this, arguments, void 0, function (cdpUrl, timeoutMs) {
    var ctrl, t, versionUrl, res, data, _a;
    if (timeoutMs === void 0) {
      timeoutMs = 500;
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ctrl = new AbortController();
          t = setTimeout(function () {
            return ctrl.abort();
          }, timeoutMs);
          _b.label = 1;
        case 1:
          _b.trys.push([1, 4, 5, 6]);
          versionUrl = (0, cdp_helpers_js_1.appendCdpPath)(cdpUrl, "/json/version");
          return [
            4 /*yield*/,
            fetch(versionUrl, {
              signal: ctrl.signal,
              headers: (0, cdp_js_1.getHeadersWithAuth)(versionUrl),
            }),
          ];
        case 2:
          res = _b.sent();
          if (!res.ok) {
            return [2 /*return*/, null];
          }
          return [4 /*yield*/, res.json()];
        case 3:
          data = _b.sent();
          if (!data || typeof data !== "object") {
            return [2 /*return*/, null];
          }
          return [2 /*return*/, data];
        case 4:
          _a = _b.sent();
          return [2 /*return*/, null];
        case 5:
          clearTimeout(t);
          return [7 /*endfinally*/];
        case 6:
          return [2 /*return*/];
      }
    });
  });
}
function getChromeWebSocketUrl(cdpUrl_1) {
  return __awaiter(this, arguments, void 0, function (cdpUrl, timeoutMs) {
    var version, wsUrl;
    var _a;
    if (timeoutMs === void 0) {
      timeoutMs = 500;
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, fetchChromeVersion(cdpUrl, timeoutMs)];
        case 1:
          version = _b.sent();
          wsUrl = String(
            (_a =
              version === null || version === void 0 ? void 0 : version.webSocketDebuggerUrl) !==
              null && _a !== void 0
              ? _a
              : "",
          ).trim();
          if (!wsUrl) {
            return [2 /*return*/, null];
          }
          return [2 /*return*/, (0, cdp_js_1.normalizeCdpWsUrl)(wsUrl, cdpUrl)];
      }
    });
  });
}
function canOpenWebSocket(wsUrl_1) {
  return __awaiter(this, arguments, void 0, function (wsUrl, timeoutMs) {
    if (timeoutMs === void 0) {
      timeoutMs = 800;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            new Promise(function (resolve) {
              var headers = (0, cdp_js_1.getHeadersWithAuth)(wsUrl);
              var ws = new ws_1.default(
                wsUrl,
                __assign(
                  { handshakeTimeout: timeoutMs },
                  Object.keys(headers).length ? { headers: headers } : {},
                ),
              );
              var timer = setTimeout(
                function () {
                  try {
                    ws.terminate();
                  } catch (_a) {
                    // ignore
                  }
                  resolve(false);
                },
                Math.max(50, timeoutMs + 25),
              );
              ws.once("open", function () {
                clearTimeout(timer);
                try {
                  ws.close();
                } catch (_a) {
                  // ignore
                }
                resolve(true);
              });
              ws.once("error", function () {
                clearTimeout(timer);
                resolve(false);
              });
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function isChromeCdpReady(cdpUrl_1) {
  return __awaiter(this, arguments, void 0, function (cdpUrl, timeoutMs, handshakeTimeoutMs) {
    var wsUrl;
    if (timeoutMs === void 0) {
      timeoutMs = 500;
    }
    if (handshakeTimeoutMs === void 0) {
      handshakeTimeoutMs = 800;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, getChromeWebSocketUrl(cdpUrl, timeoutMs)];
        case 1:
          wsUrl = _a.sent();
          if (!wsUrl) {
            return [2 /*return*/, false];
          }
          return [4 /*yield*/, canOpenWebSocket(wsUrl, handshakeTimeoutMs)];
        case 2:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function launchOpenClawChrome(resolved, profile) {
  return __awaiter(this, void 0, void 0, function () {
    var exe,
      userDataDir,
      needsDecorate,
      spawnOnce,
      startedAt,
      localStatePath,
      preferencesPath,
      needsBootstrap,
      bootstrap,
      deadline,
      exitDeadline,
      proc,
      readyDeadline,
      pid;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          if (!profile.cdpIsLoopback) {
            throw new Error(
              'Profile "'.concat(profile.name, '" is remote; cannot launch local Chrome.'),
            );
          }
          return [4 /*yield*/, (0, ports_js_1.ensurePortAvailable)(profile.cdpPort)];
        case 1:
          _c.sent();
          exe = resolveBrowserExecutable(resolved);
          if (!exe) {
            throw new Error(
              "No supported browser found (Chrome/Brave/Edge/Chromium on macOS, Linux, or Windows).",
            );
          }
          userDataDir = resolveOpenClawUserDataDir(profile.name);
          node_fs_1.default.mkdirSync(userDataDir, { recursive: true });
          needsDecorate = !(0, chrome_profile_decoration_js_1.isProfileDecorated)(
            userDataDir,
            profile.name,
            ((_a = profile.color) !== null && _a !== void 0
              ? _a
              : constants_js_1.DEFAULT_OPENCLAW_BROWSER_COLOR
            ).toUpperCase(),
          );
          spawnOnce = function () {
            var args = [
              "--remote-debugging-port=".concat(profile.cdpPort),
              "--user-data-dir=".concat(userDataDir),
              "--no-first-run",
              "--no-default-browser-check",
              "--disable-sync",
              "--disable-background-networking",
              "--disable-component-update",
              "--disable-features=Translate,MediaRouter",
              "--disable-session-crashed-bubble",
              "--hide-crash-restore-bubble",
              "--password-store=basic",
            ];
            if (resolved.headless) {
              // Best-effort; older Chromes may ignore.
              args.push("--headless=new");
              args.push("--disable-gpu");
            }
            if (resolved.noSandbox) {
              args.push("--no-sandbox");
              args.push("--disable-setuid-sandbox");
            }
            if (process.platform === "linux") {
              args.push("--disable-dev-shm-usage");
            }
            // Always open a blank tab to ensure a target exists.
            args.push("about:blank");
            return (0, node_child_process_1.spawn)(exe.path, args, {
              stdio: "pipe",
              env: __assign(__assign({}, process.env), {
                // Reduce accidental sharing with the user's env.
                HOME: node_os_1.default.homedir(),
              }),
            });
          };
          startedAt = Date.now();
          localStatePath = node_path_1.default.join(userDataDir, "Local State");
          preferencesPath = node_path_1.default.join(userDataDir, "Default", "Preferences");
          needsBootstrap = !exists(localStatePath) || !exists(preferencesPath);
          if (!needsBootstrap) {
            return [3 /*break*/, 7];
          }
          bootstrap = spawnOnce();
          deadline = Date.now() + 10000;
          _c.label = 2;
        case 2:
          if (!(Date.now() < deadline)) {
            return [3 /*break*/, 4];
          }
          if (exists(localStatePath) && exists(preferencesPath)) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            new Promise(function (r) {
              return setTimeout(r, 100);
            }),
          ];
        case 3:
          _c.sent();
          return [3 /*break*/, 2];
        case 4:
          try {
            bootstrap.kill("SIGTERM");
          } catch (_d) {
            // ignore
          }
          exitDeadline = Date.now() + 5000;
          _c.label = 5;
        case 5:
          if (!(Date.now() < exitDeadline)) {
            return [3 /*break*/, 7];
          }
          if (bootstrap.exitCode != null) {
            return [3 /*break*/, 7];
          }
          return [
            4 /*yield*/,
            new Promise(function (r) {
              return setTimeout(r, 50);
            }),
          ];
        case 6:
          _c.sent();
          return [3 /*break*/, 5];
        case 7:
          if (needsDecorate) {
            try {
              (0, chrome_profile_decoration_js_1.decorateOpenClawProfile)(userDataDir, {
                name: profile.name,
                color: profile.color,
              });
              log.info(
                "\uD83E\uDD9E openclaw browser profile decorated (".concat(profile.color, ")"),
              );
            } catch (err) {
              log.warn("openclaw browser profile decoration failed: ".concat(String(err)));
            }
          }
          try {
            (0, chrome_profile_decoration_js_1.ensureProfileCleanExit)(userDataDir);
          } catch (err) {
            log.warn("openclaw browser clean-exit prefs failed: ".concat(String(err)));
          }
          proc = spawnOnce();
          readyDeadline = Date.now() + 15000;
          _c.label = 8;
        case 8:
          if (!(Date.now() < readyDeadline)) {
            return [3 /*break*/, 11];
          }
          return [4 /*yield*/, isChromeReachable(profile.cdpUrl, 500)];
        case 9:
          if (_c.sent()) {
            return [3 /*break*/, 11];
          }
          return [
            4 /*yield*/,
            new Promise(function (r) {
              return setTimeout(r, 200);
            }),
          ];
        case 10:
          _c.sent();
          return [3 /*break*/, 8];
        case 11:
          return [4 /*yield*/, isChromeReachable(profile.cdpUrl, 500)];
        case 12:
          if (!_c.sent()) {
            try {
              proc.kill("SIGKILL");
            } catch (_e) {
              // ignore
            }
            throw new Error(
              "Failed to start Chrome CDP on port "
                .concat(profile.cdpPort, ' for profile "')
                .concat(profile.name, '".'),
            );
          }
          pid = (_b = proc.pid) !== null && _b !== void 0 ? _b : -1;
          log.info(
            "\uD83E\uDD9E openclaw browser started ("
              .concat(exe.kind, ') profile "')
              .concat(profile.name, '" on 127.0.0.1:')
              .concat(profile.cdpPort, " (pid ")
              .concat(pid, ")"),
          );
          return [
            2 /*return*/,
            {
              pid: pid,
              exe: exe,
              userDataDir: userDataDir,
              cdpPort: profile.cdpPort,
              startedAt: startedAt,
              proc: proc,
            },
          ];
      }
    });
  });
}
function stopOpenClawChrome(running_1) {
  return __awaiter(this, arguments, void 0, function (running, timeoutMs) {
    var proc, start;
    if (timeoutMs === void 0) {
      timeoutMs = 2500;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          proc = running.proc;
          if (proc.killed) {
            return [2 /*return*/];
          }
          try {
            proc.kill("SIGTERM");
          } catch (_b) {
            // ignore
          }
          start = Date.now();
          _a.label = 1;
        case 1:
          if (!(Date.now() - start < timeoutMs)) {
            return [3 /*break*/, 4];
          }
          if (!proc.exitCode && proc.killed) {
            return [3 /*break*/, 4];
          }
          return [4 /*yield*/, isChromeReachable(cdpUrlForPort(running.cdpPort), 200)];
        case 2:
          if (!_a.sent()) {
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            new Promise(function (r) {
              return setTimeout(r, 100);
            }),
          ];
        case 3:
          _a.sent();
          return [3 /*break*/, 1];
        case 4:
          try {
            proc.kill("SIGKILL");
          } catch (_c) {
            // ignore
          }
          return [2 /*return*/];
      }
    });
  });
}
