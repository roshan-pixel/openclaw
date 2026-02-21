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
exports.ensureSandboxBrowser = ensureSandboxBrowser;
var bridge_server_js_1 = require("../../browser/bridge-server.js");
var config_js_1 = require("../../browser/config.js");
var constants_js_1 = require("../../browser/constants.js");
var browser_bridges_js_1 = require("./browser-bridges.js");
var constants_js_2 = require("./constants.js");
var docker_js_1 = require("./docker.js");
var registry_js_1 = require("./registry.js");
var shared_js_1 = require("./shared.js");
var tool_policy_js_1 = require("./tool-policy.js");
function waitForSandboxCdp(params) {
  return __awaiter(this, void 0, void 0, function () {
    var deadline, url, _loop_1, state_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          deadline = Date.now() + Math.max(0, params.timeoutMs);
          url = "http://127.0.0.1:".concat(params.cdpPort, "/json/version");
          _loop_1 = function () {
            var ctrl_1, t, res, _b;
            return __generator(this, function (_c) {
              switch (_c.label) {
                case 0:
                  _c.trys.push([0, 5, , 6]);
                  ctrl_1 = new AbortController();
                  t = setTimeout(function () {
                    return ctrl_1.abort();
                  }, 1000);
                  _c.label = 1;
                case 1:
                  _c.trys.push([1, , 3, 4]);
                  return [4 /*yield*/, fetch(url, { signal: ctrl_1.signal })];
                case 2:
                  res = _c.sent();
                  if (res.ok) {
                    return [2 /*return*/, { value: true }];
                  }
                  return [3 /*break*/, 4];
                case 3:
                  clearTimeout(t);
                  return [7 /*endfinally*/];
                case 4:
                  return [3 /*break*/, 6];
                case 5:
                  _b = _c.sent();
                  return [3 /*break*/, 6];
                case 6:
                  return [
                    4 /*yield*/,
                    new Promise(function (r) {
                      return setTimeout(r, 150);
                    }),
                  ];
                case 7:
                  _c.sent();
                  return [2 /*return*/];
              }
            });
          };
          _a.label = 1;
        case 1:
          if (!(Date.now() < deadline)) {
            return [3 /*break*/, 3];
          }
          return [5 /*yield**/, _loop_1()];
        case 2:
          state_1 = _a.sent();
          if (typeof state_1 === "object") {
            return [2 /*return*/, state_1.value];
          }
          return [3 /*break*/, 1];
        case 3:
          return [2 /*return*/, false];
      }
    });
  });
}
function buildSandboxBrowserResolvedConfig(params) {
  var _a;
  var cdpHost = "127.0.0.1";
  return {
    enabled: true,
    evaluateEnabled: params.evaluateEnabled,
    controlPort: params.controlPort,
    cdpProtocol: "http",
    cdpHost: cdpHost,
    cdpIsLoopback: true,
    remoteCdpTimeoutMs: 1500,
    remoteCdpHandshakeTimeoutMs: 3000,
    color: constants_js_1.DEFAULT_OPENCLAW_BROWSER_COLOR,
    executablePath: undefined,
    headless: params.headless,
    noSandbox: false,
    attachOnly: true,
    defaultProfile: constants_js_1.DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME,
    profiles:
      ((_a = {}),
      (_a[constants_js_1.DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME] = {
        cdpPort: params.cdpPort,
        color: constants_js_1.DEFAULT_OPENCLAW_BROWSER_COLOR,
      }),
      _a),
  };
}
function ensureSandboxBrowserImage(image) {
  return __awaiter(this, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, docker_js_1.execDocker)(["image", "inspect", image], {
              allowFailure: true,
            }),
          ];
        case 1:
          result = _a.sent();
          if (result.code === 0) {
            return [2 /*return*/];
          }
          throw new Error(
            "Sandbox browser image not found: ".concat(
              image,
              ". Build it with scripts/sandbox-browser-setup.sh.",
            ),
          );
      }
    });
  });
}
function ensureSandboxBrowser(params) {
  return __awaiter(this, void 0, void 0, function () {
    var slug,
      name,
      containerName,
      state,
      args,
      mainMountSuffix,
      agentMountSuffix,
      mappedCdp,
      mappedNoVnc,
      _a,
      existing,
      existingProfile,
      shouldReuse,
      bridge,
      ensureBridge,
      resolvedBridge,
      now,
      noVncUrl;
    var _this = this;
    var _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          if (!params.cfg.browser.enabled) {
            return [2 /*return*/, null];
          }
          if (!(0, tool_policy_js_1.isToolAllowed)(params.cfg.tools, "browser")) {
            return [2 /*return*/, null];
          }
          slug =
            params.cfg.scope === "shared"
              ? "shared"
              : (0, shared_js_1.slugifySessionKey)(params.scopeKey);
          name = "".concat(params.cfg.browser.containerPrefix).concat(slug);
          containerName = name.slice(0, 63);
          return [4 /*yield*/, (0, docker_js_1.dockerContainerState)(containerName)];
        case 1:
          state = _c.sent();
          if (!!state.exists) {
            return [3 /*break*/, 5];
          }
          return [
            4 /*yield*/,
            ensureSandboxBrowserImage(
              (_b = params.cfg.browser.image) !== null && _b !== void 0
                ? _b
                : constants_js_2.DEFAULT_SANDBOX_BROWSER_IMAGE,
            ),
          ];
        case 2:
          _c.sent();
          args = (0, docker_js_1.buildSandboxCreateArgs)({
            name: containerName,
            cfg: params.cfg.docker,
            scopeKey: params.scopeKey,
            labels: { "openclaw.sandboxBrowser": "1" },
          });
          mainMountSuffix =
            params.cfg.workspaceAccess === "ro" && params.workspaceDir === params.agentWorkspaceDir
              ? ":ro"
              : "";
          args.push(
            "-v",
            ""
              .concat(params.workspaceDir, ":")
              .concat(params.cfg.docker.workdir)
              .concat(mainMountSuffix),
          );
          if (
            params.cfg.workspaceAccess !== "none" &&
            params.workspaceDir !== params.agentWorkspaceDir
          ) {
            agentMountSuffix = params.cfg.workspaceAccess === "ro" ? ":ro" : "";
            args.push(
              "-v",
              ""
                .concat(params.agentWorkspaceDir, ":")
                .concat(constants_js_2.SANDBOX_AGENT_WORKSPACE_MOUNT)
                .concat(agentMountSuffix),
            );
          }
          args.push("-p", "127.0.0.1::".concat(params.cfg.browser.cdpPort));
          if (params.cfg.browser.enableNoVnc && !params.cfg.browser.headless) {
            args.push("-p", "127.0.0.1::".concat(params.cfg.browser.noVncPort));
          }
          args.push(
            "-e",
            "OPENCLAW_BROWSER_HEADLESS=".concat(params.cfg.browser.headless ? "1" : "0"),
          );
          args.push(
            "-e",
            "OPENCLAW_BROWSER_ENABLE_NOVNC=".concat(params.cfg.browser.enableNoVnc ? "1" : "0"),
          );
          args.push("-e", "OPENCLAW_BROWSER_CDP_PORT=".concat(params.cfg.browser.cdpPort));
          args.push("-e", "OPENCLAW_BROWSER_VNC_PORT=".concat(params.cfg.browser.vncPort));
          args.push("-e", "OPENCLAW_BROWSER_NOVNC_PORT=".concat(params.cfg.browser.noVncPort));
          args.push(params.cfg.browser.image);
          return [4 /*yield*/, (0, docker_js_1.execDocker)(args)];
        case 3:
          _c.sent();
          return [4 /*yield*/, (0, docker_js_1.execDocker)(["start", containerName])];
        case 4:
          _c.sent();
          return [3 /*break*/, 7];
        case 5:
          if (!!state.running) {
            return [3 /*break*/, 7];
          }
          return [4 /*yield*/, (0, docker_js_1.execDocker)(["start", containerName])];
        case 6:
          _c.sent();
          _c.label = 7;
        case 7:
          return [
            4 /*yield*/,
            (0, docker_js_1.readDockerPort)(containerName, params.cfg.browser.cdpPort),
          ];
        case 8:
          mappedCdp = _c.sent();
          if (!mappedCdp) {
            throw new Error("Failed to resolve CDP port mapping for ".concat(containerName, "."));
          }
          if (!(params.cfg.browser.enableNoVnc && !params.cfg.browser.headless)) {
            return [3 /*break*/, 10];
          }
          return [
            4 /*yield*/,
            (0, docker_js_1.readDockerPort)(containerName, params.cfg.browser.noVncPort),
          ];
        case 9:
          _a = _c.sent();
          return [3 /*break*/, 11];
        case 10:
          _a = null;
          _c.label = 11;
        case 11:
          mappedNoVnc = _a;
          existing = browser_bridges_js_1.BROWSER_BRIDGES.get(params.scopeKey);
          existingProfile = existing
            ? (0, config_js_1.resolveProfile)(
                existing.bridge.state.resolved,
                constants_js_1.DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME,
              )
            : null;
          shouldReuse =
            existing &&
            existing.containerName === containerName &&
            (existingProfile === null || existingProfile === void 0
              ? void 0
              : existingProfile.cdpPort) === mappedCdp;
          if (!(existing && !shouldReuse)) {
            return [3 /*break*/, 13];
          }
          return [
            4 /*yield*/,
            (0, bridge_server_js_1.stopBrowserBridgeServer)(existing.bridge.server).catch(
              function () {
                return undefined;
              },
            ),
          ];
        case 12:
          _c.sent();
          browser_bridges_js_1.BROWSER_BRIDGES.delete(params.scopeKey);
          _c.label = 13;
        case 13:
          bridge = (function () {
            if (shouldReuse && existing) {
              return existing.bridge;
            }
            return null;
          })();
          ensureBridge = function () {
            return __awaiter(_this, void 0, void 0, function () {
              var onEnsureAttachTarget;
              var _this = this;
              var _a;
              return __generator(this, function (_b) {
                switch (_b.label) {
                  case 0:
                    if (bridge) {
                      return [2 /*return*/, bridge];
                    }
                    onEnsureAttachTarget = params.cfg.browser.autoStart
                      ? function () {
                          return __awaiter(_this, void 0, void 0, function () {
                            var state, ok;
                            return __generator(this, function (_a) {
                              switch (_a.label) {
                                case 0:
                                  return [
                                    4 /*yield*/,
                                    (0, docker_js_1.dockerContainerState)(containerName),
                                  ];
                                case 1:
                                  state = _a.sent();
                                  if (!(state.exists && !state.running)) {
                                    return [3 /*break*/, 3];
                                  }
                                  return [
                                    4 /*yield*/,
                                    (0, docker_js_1.execDocker)(["start", containerName]),
                                  ];
                                case 2:
                                  _a.sent();
                                  _a.label = 3;
                                case 3:
                                  return [
                                    4 /*yield*/,
                                    waitForSandboxCdp({
                                      cdpPort: mappedCdp,
                                      timeoutMs: params.cfg.browser.autoStartTimeoutMs,
                                    }),
                                  ];
                                case 4:
                                  ok = _a.sent();
                                  if (!ok) {
                                    throw new Error(
                                      "Sandbox browser CDP did not become reachable on 127.0.0.1:"
                                        .concat(mappedCdp, " within ")
                                        .concat(params.cfg.browser.autoStartTimeoutMs, "ms."),
                                    );
                                  }
                                  return [2 /*return*/];
                              }
                            });
                          });
                        }
                      : undefined;
                    return [
                      4 /*yield*/,
                      (0, bridge_server_js_1.startBrowserBridgeServer)({
                        resolved: buildSandboxBrowserResolvedConfig({
                          controlPort: 0,
                          cdpPort: mappedCdp,
                          headless: params.cfg.browser.headless,
                          evaluateEnabled:
                            (_a = params.evaluateEnabled) !== null && _a !== void 0
                              ? _a
                              : constants_js_1.DEFAULT_BROWSER_EVALUATE_ENABLED,
                        }),
                        onEnsureAttachTarget: onEnsureAttachTarget,
                      }),
                    ];
                  case 1:
                    return [2 /*return*/, _b.sent()];
                }
              });
            });
          };
          return [4 /*yield*/, ensureBridge()];
        case 14:
          resolvedBridge = _c.sent();
          if (!shouldReuse) {
            browser_bridges_js_1.BROWSER_BRIDGES.set(params.scopeKey, {
              bridge: resolvedBridge,
              containerName: containerName,
            });
          }
          now = Date.now();
          return [
            4 /*yield*/,
            (0, registry_js_1.updateBrowserRegistry)({
              containerName: containerName,
              sessionKey: params.scopeKey,
              createdAtMs: now,
              lastUsedAtMs: now,
              image: params.cfg.browser.image,
              cdpPort: mappedCdp,
              noVncPort: mappedNoVnc !== null && mappedNoVnc !== void 0 ? mappedNoVnc : undefined,
            }),
          ];
        case 15:
          _c.sent();
          noVncUrl =
            mappedNoVnc && params.cfg.browser.enableNoVnc && !params.cfg.browser.headless
              ? "http://127.0.0.1:".concat(mappedNoVnc, "/vnc.html?autoconnect=1&resize=remote")
              : undefined;
          return [
            2 /*return*/,
            {
              bridgeUrl: resolvedBridge.baseUrl,
              noVncUrl: noVncUrl,
              containerName: containerName,
            },
          ];
      }
    });
  });
}
