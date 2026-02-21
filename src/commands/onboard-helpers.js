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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_WORKSPACE = void 0;
exports.guardCancel = guardCancel;
exports.summarizeExistingConfig = summarizeExistingConfig;
exports.randomToken = randomToken;
exports.normalizeGatewayTokenInput = normalizeGatewayTokenInput;
exports.printWizardHeader = printWizardHeader;
exports.applyWizardMetadata = applyWizardMetadata;
exports.resolveBrowserOpenCommand = resolveBrowserOpenCommand;
exports.detectBrowserOpenSupport = detectBrowserOpenSupport;
exports.formatControlUiSshHint = formatControlUiSshHint;
exports.openUrl = openUrl;
exports.openUrlInBackground = openUrlInBackground;
exports.ensureWorkspaceAndSessions = ensureWorkspaceAndSessions;
exports.resolveNodeManagerOptions = resolveNodeManagerOptions;
exports.moveToTrash = moveToTrash;
exports.handleReset = handleReset;
exports.detectBinary = detectBinary;
exports.probeGatewayReachable = probeGatewayReachable;
exports.waitForGatewayReachable = waitForGatewayReachable;
exports.resolveControlUiLinks = resolveControlUiLinks;
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var prompts_1 = require("@clack/prompts");
var workspace_js_1 = require("../agents/workspace.js");
var config_js_1 = require("../config/config.js");
var sessions_js_1 = require("../config/sessions.js");
var call_js_1 = require("../gateway/call.js");
var control_ui_shared_js_1 = require("../gateway/control-ui-shared.js");
var exec_safety_js_1 = require("../infra/exec-safety.js");
var tailnet_js_1 = require("../infra/tailnet.js");
var wsl_js_1 = require("../infra/wsl.js");
var exec_js_1 = require("../process/exec.js");
var prompt_style_js_1 = require("../terminal/prompt-style.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var utils_js_1 = require("../utils.js");
var version_js_1 = require("../version.js");
function guardCancel(value, runtime) {
  var _a;
  if ((0, prompts_1.isCancel)(value)) {
    (0, prompts_1.cancel)(
      (_a = (0, prompt_style_js_1.stylePromptTitle)("Setup cancelled.")) !== null && _a !== void 0
        ? _a
        : "Setup cancelled.",
    );
    runtime.exit(0);
  }
  return value;
}
function summarizeExistingConfig(config) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  var rows = [];
  var defaults = (_a = config.agents) === null || _a === void 0 ? void 0 : _a.defaults;
  if (defaults === null || defaults === void 0 ? void 0 : defaults.workspace) {
    rows.push((0, utils_js_1.shortenHomeInString)("workspace: ".concat(defaults.workspace)));
  }
  if (defaults === null || defaults === void 0 ? void 0 : defaults.model) {
    var model = typeof defaults.model === "string" ? defaults.model : defaults.model.primary;
    if (model) {
      rows.push((0, utils_js_1.shortenHomeInString)("model: ".concat(model)));
    }
  }
  if ((_b = config.gateway) === null || _b === void 0 ? void 0 : _b.mode) {
    rows.push((0, utils_js_1.shortenHomeInString)("gateway.mode: ".concat(config.gateway.mode)));
  }
  if (typeof ((_c = config.gateway) === null || _c === void 0 ? void 0 : _c.port) === "number") {
    rows.push((0, utils_js_1.shortenHomeInString)("gateway.port: ".concat(config.gateway.port)));
  }
  if ((_d = config.gateway) === null || _d === void 0 ? void 0 : _d.bind) {
    rows.push((0, utils_js_1.shortenHomeInString)("gateway.bind: ".concat(config.gateway.bind)));
  }
  if (
    (_f = (_e = config.gateway) === null || _e === void 0 ? void 0 : _e.remote) === null ||
    _f === void 0
      ? void 0
      : _f.url
  ) {
    rows.push(
      (0, utils_js_1.shortenHomeInString)("gateway.remote.url: ".concat(config.gateway.remote.url)),
    );
  }
  if (
    (_h = (_g = config.skills) === null || _g === void 0 ? void 0 : _g.install) === null ||
    _h === void 0
      ? void 0
      : _h.nodeManager
  ) {
    rows.push(
      (0, utils_js_1.shortenHomeInString)(
        "skills.nodeManager: ".concat(config.skills.install.nodeManager),
      ),
    );
  }
  return rows.length ? rows.join("\n") : "No key settings detected.";
}
function randomToken() {
  return node_crypto_1.default.randomBytes(24).toString("hex");
}
function normalizeGatewayTokenInput(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}
function printWizardHeader(runtime) {
  var header = [
    "▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄",
    "██░▄▄▄░██░▄▄░██░▄▄▄██░▀██░██░▄▄▀██░████░▄▄▀██░███░██",
    "██░███░██░▀▀░██░▄▄▄██░█░█░██░█████░████░▀▀░██░█░█░██",
    "██░▀▀▀░██░█████░▀▀▀██░██▄░██░▀▀▄██░▀▀░█░██░██▄▀▄▀▄██",
    "▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀",
    "                  🦞 OPENCLAW 🦞                    ",
    " ",
  ].join("\n");
  runtime.log(header);
}
function applyWizardMetadata(cfg, params) {
  var _a, _b;
  var commit =
    ((_a = process.env.GIT_COMMIT) === null || _a === void 0 ? void 0 : _a.trim()) ||
    ((_b = process.env.GIT_SHA) === null || _b === void 0 ? void 0 : _b.trim()) ||
    undefined;
  return __assign(__assign({}, cfg), {
    wizard: __assign(__assign({}, cfg.wizard), {
      lastRunAt: new Date().toISOString(),
      lastRunVersion: version_js_1.VERSION,
      lastRunCommit: commit,
      lastRunCommand: params.command,
      lastRunMode: params.mode,
    }),
  });
}
function resolveBrowserOpenCommand() {
  return __awaiter(this, void 0, void 0, function () {
    var platform, hasDisplay, isSsh, hasOpen, wsl, hasWslview, hasXdgOpen;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          platform = process.platform;
          hasDisplay = Boolean(process.env.DISPLAY || process.env.WAYLAND_DISPLAY);
          isSsh =
            Boolean(process.env.SSH_CLIENT) ||
            Boolean(process.env.SSH_TTY) ||
            Boolean(process.env.SSH_CONNECTION);
          if (isSsh && !hasDisplay && platform !== "win32") {
            return [2 /*return*/, { argv: null, reason: "ssh-no-display" }];
          }
          if (platform === "win32") {
            return [
              2 /*return*/,
              {
                argv: ["cmd", "/c", "start", ""],
                command: "cmd",
                quoteUrl: true,
              },
            ];
          }
          if (!(platform === "darwin")) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, detectBinary("open")];
        case 1:
          hasOpen = _a.sent();
          return [
            2 /*return*/,
            hasOpen ? { argv: ["open"], command: "open" } : { argv: null, reason: "missing-open" },
          ];
        case 2:
          if (!(platform === "linux")) {
            return [3 /*break*/, 7];
          }
          return [4 /*yield*/, (0, wsl_js_1.isWSL)()];
        case 3:
          wsl = _a.sent();
          if (!hasDisplay && !wsl) {
            return [2 /*return*/, { argv: null, reason: "no-display" }];
          }
          if (!wsl) {
            return [3 /*break*/, 5];
          }
          return [4 /*yield*/, detectBinary("wslview")];
        case 4:
          hasWslview = _a.sent();
          if (hasWslview) {
            return [2 /*return*/, { argv: ["wslview"], command: "wslview" }];
          }
          if (!hasDisplay) {
            return [2 /*return*/, { argv: null, reason: "wsl-no-wslview" }];
          }
          _a.label = 5;
        case 5:
          return [4 /*yield*/, detectBinary("xdg-open")];
        case 6:
          hasXdgOpen = _a.sent();
          return [
            2 /*return*/,
            hasXdgOpen
              ? { argv: ["xdg-open"], command: "xdg-open" }
              : { argv: null, reason: "missing-xdg-open" },
          ];
        case 7:
          return [2 /*return*/, { argv: null, reason: "unsupported-platform" }];
      }
    });
  });
}
function detectBrowserOpenSupport() {
  return __awaiter(this, void 0, void 0, function () {
    var resolved;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, resolveBrowserOpenCommand()];
        case 1:
          resolved = _a.sent();
          if (!resolved.argv) {
            return [2 /*return*/, { ok: false, reason: resolved.reason }];
          }
          return [2 /*return*/, { ok: true, command: resolved.command }];
      }
    });
  });
}
function formatControlUiSshHint(params) {
  var basePath = (0, control_ui_shared_js_1.normalizeControlUiBasePath)(params.basePath);
  var uiPath = basePath ? "".concat(basePath, "/") : "/";
  var localUrl = "http://localhost:".concat(params.port).concat(uiPath);
  var tokenParam = params.token ? "?token=".concat(encodeURIComponent(params.token)) : "";
  var authedUrl = params.token ? "".concat(localUrl).concat(tokenParam) : undefined;
  var sshTarget = resolveSshTargetHint();
  return [
    "No GUI detected. Open from your computer:",
    "ssh -N -L ".concat(params.port, ":127.0.0.1:").concat(params.port, " ").concat(sshTarget),
    "Then open:",
    localUrl,
    authedUrl,
    "Docs:",
    "https://docs.openclaw.ai/gateway/remote",
    "https://docs.openclaw.ai/web/control-ui",
  ]
    .filter(Boolean)
    .join("\n");
}
function resolveSshTargetHint() {
  var _a, _b;
  var user = process.env.USER || process.env.LOGNAME || "user";
  var conn =
    (_a = process.env.SSH_CONNECTION) === null || _a === void 0 ? void 0 : _a.trim().split(/\s+/);
  var host =
    (_b = conn === null || conn === void 0 ? void 0 : conn[2]) !== null && _b !== void 0
      ? _b
      : "<host>";
  return "".concat(user, "@").concat(host);
}
function openUrl(url) {
  return __awaiter(this, void 0, void 0, function () {
    var resolved, quoteUrl, command, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (shouldSkipBrowserOpenInTests()) {
            return [2 /*return*/, false];
          }
          return [4 /*yield*/, resolveBrowserOpenCommand()];
        case 1:
          resolved = _b.sent();
          if (!resolved.argv) {
            return [2 /*return*/, false];
          }
          quoteUrl = resolved.quoteUrl === true;
          command = __spreadArray([], resolved.argv, true);
          if (quoteUrl) {
            if (command.at(-1) === "") {
              // Preserve the empty title token for `start` when using verbatim args.
              command[command.length - 1] = '""';
            }
            command.push('"'.concat(url, '"'));
          } else {
            command.push(url);
          }
          _b.label = 2;
        case 2:
          _b.trys.push([2, 4, , 5]);
          return [
            4 /*yield*/,
            (0, exec_js_1.runCommandWithTimeout)(command, {
              timeoutMs: 5000,
              windowsVerbatimArguments: quoteUrl,
            }),
          ];
        case 3:
          _b.sent();
          return [2 /*return*/, true];
        case 4:
          _a = _b.sent();
          // ignore; we still print the URL for manual open
          return [2 /*return*/, false];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function openUrlInBackground(url) {
  return __awaiter(this, void 0, void 0, function () {
    var resolved, command, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (shouldSkipBrowserOpenInTests()) {
            return [2 /*return*/, false];
          }
          if (process.platform !== "darwin") {
            return [2 /*return*/, false];
          }
          return [4 /*yield*/, resolveBrowserOpenCommand()];
        case 1:
          resolved = _b.sent();
          if (!resolved.argv || resolved.command !== "open") {
            return [2 /*return*/, false];
          }
          command = ["open", "-g", url];
          _b.label = 2;
        case 2:
          _b.trys.push([2, 4, , 5]);
          return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(command, { timeoutMs: 5000 })];
        case 3:
          _b.sent();
          return [2 /*return*/, true];
        case 4:
          _a = _b.sent();
          return [2 /*return*/, false];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function ensureWorkspaceAndSessions(workspaceDir, runtime, options) {
  return __awaiter(this, void 0, void 0, function () {
    var ws, sessionsDir;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, workspace_js_1.ensureAgentWorkspace)({
              dir: workspaceDir,
              ensureBootstrapFiles: !(options === null || options === void 0
                ? void 0
                : options.skipBootstrap),
            }),
          ];
        case 1:
          ws = _a.sent();
          runtime.log("Workspace OK: ".concat((0, utils_js_1.shortenHomePath)(ws.dir)));
          sessionsDir = (0, sessions_js_1.resolveSessionTranscriptsDirForAgent)(
            options === null || options === void 0 ? void 0 : options.agentId,
          );
          return [4 /*yield*/, promises_1.default.mkdir(sessionsDir, { recursive: true })];
        case 2:
          _a.sent();
          runtime.log("Sessions OK: ".concat((0, utils_js_1.shortenHomePath)(sessionsDir)));
          return [2 /*return*/];
      }
    });
  });
}
function resolveNodeManagerOptions() {
  return [
    { value: "npm", label: "npm" },
    { value: "pnpm", label: "pnpm" },
    { value: "bun", label: "bun" },
  ];
}
function moveToTrash(pathname, runtime) {
  return __awaiter(this, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          if (!pathname) {
            return [2 /*return*/];
          }
          _c.label = 1;
        case 1:
          _c.trys.push([1, 3, , 4]);
          return [4 /*yield*/, promises_1.default.access(pathname)];
        case 2:
          _c.sent();
          return [3 /*break*/, 4];
        case 3:
          _a = _c.sent();
          return [2 /*return*/];
        case 4:
          _c.trys.push([4, 6, , 7]);
          return [
            4 /*yield*/,
            (0, exec_js_1.runCommandWithTimeout)(["trash", pathname], { timeoutMs: 5000 }),
          ];
        case 5:
          _c.sent();
          runtime.log("Moved to Trash: ".concat((0, utils_js_1.shortenHomePath)(pathname)));
          return [3 /*break*/, 7];
        case 6:
          _b = _c.sent();
          runtime.log(
            "Failed to move to Trash (manual delete): ".concat(
              (0, utils_js_1.shortenHomePath)(pathname),
            ),
          );
          return [3 /*break*/, 7];
        case 7:
          return [2 /*return*/];
      }
    });
  });
}
function handleReset(scope, workspaceDir, runtime) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, moveToTrash(config_js_1.CONFIG_PATH, runtime)];
        case 1:
          _a.sent();
          if (scope === "config") {
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            moveToTrash(node_path_1.default.join(utils_js_1.CONFIG_DIR, "credentials"), runtime),
          ];
        case 2:
          _a.sent();
          return [
            4 /*yield*/,
            moveToTrash((0, sessions_js_1.resolveSessionTranscriptsDirForAgent)(), runtime),
          ];
        case 3:
          _a.sent();
          if (!(scope === "full")) {
            return [3 /*break*/, 5];
          }
          return [4 /*yield*/, moveToTrash(workspaceDir, runtime)];
        case 4:
          _a.sent();
          _a.label = 5;
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function detectBinary(name) {
  return __awaiter(this, void 0, void 0, function () {
    var resolved, _a, command, result, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          if (!(name === null || name === void 0 ? void 0 : name.trim())) {
            return [2 /*return*/, false];
          }
          if (!(0, exec_safety_js_1.isSafeExecutableValue)(name)) {
            return [2 /*return*/, false];
          }
          resolved = name.startsWith("~") ? (0, utils_js_1.resolveUserPath)(name) : name;
          if (
            !(
              node_path_1.default.isAbsolute(resolved) ||
              resolved.startsWith(".") ||
              resolved.includes("/") ||
              resolved.includes("\\")
            )
          ) {
            return [3 /*break*/, 4];
          }
          _c.label = 1;
        case 1:
          _c.trys.push([1, 3, , 4]);
          return [4 /*yield*/, promises_1.default.access(resolved)];
        case 2:
          _c.sent();
          return [2 /*return*/, true];
        case 3:
          _a = _c.sent();
          return [2 /*return*/, false];
        case 4:
          command =
            process.platform === "win32" ? ["where", name] : ["/usr/bin/env", "which", name];
          _c.label = 5;
        case 5:
          _c.trys.push([5, 7, , 8]);
          return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(command, { timeoutMs: 2000 })];
        case 6:
          result = _c.sent();
          return [2 /*return*/, result.code === 0 && result.stdout.trim().length > 0];
        case 7:
          _b = _c.sent();
          return [2 /*return*/, false];
        case 8:
          return [2 /*return*/];
      }
    });
  });
}
function shouldSkipBrowserOpenInTests() {
  if (process.env.VITEST) {
    return true;
  }
  return process.env.NODE_ENV === "test";
}
function probeGatewayReachable(params) {
  return __awaiter(this, void 0, void 0, function () {
    var url, timeoutMs, err_1;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          url = params.url.trim();
          timeoutMs = (_a = params.timeoutMs) !== null && _a !== void 0 ? _a : 1500;
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              url: url,
              token: params.token,
              password: params.password,
              method: "health",
              timeoutMs: timeoutMs,
              clientName: message_channel_js_1.GATEWAY_CLIENT_NAMES.PROBE,
              mode: message_channel_js_1.GATEWAY_CLIENT_MODES.PROBE,
            }),
          ];
        case 2:
          _b.sent();
          return [2 /*return*/, { ok: true }];
        case 3:
          err_1 = _b.sent();
          return [2 /*return*/, { ok: false, detail: summarizeError(err_1) }];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function waitForGatewayReachable(params) {
  return __awaiter(this, void 0, void 0, function () {
    var deadlineMs, pollMs, probeTimeoutMs, startedAt, lastDetail, probe;
    var _a, _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          deadlineMs = (_a = params.deadlineMs) !== null && _a !== void 0 ? _a : 15000;
          pollMs = (_b = params.pollMs) !== null && _b !== void 0 ? _b : 400;
          probeTimeoutMs = (_c = params.probeTimeoutMs) !== null && _c !== void 0 ? _c : 1500;
          startedAt = Date.now();
          _d.label = 1;
        case 1:
          if (!(Date.now() - startedAt < deadlineMs)) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            probeGatewayReachable({
              url: params.url,
              token: params.token,
              password: params.password,
              timeoutMs: probeTimeoutMs,
            }),
          ];
        case 2:
          probe = _d.sent();
          if (probe.ok) {
            return [2 /*return*/, probe];
          }
          lastDetail = probe.detail;
          return [4 /*yield*/, (0, utils_js_1.sleep)(pollMs)];
        case 3:
          _d.sent();
          return [3 /*break*/, 1];
        case 4:
          return [2 /*return*/, { ok: false, detail: lastDetail }];
      }
    });
  });
}
function summarizeError(err) {
  var _a;
  var raw = "unknown error";
  if (err instanceof Error) {
    raw = err.message || raw;
  } else if (typeof err === "string") {
    raw = err || raw;
  } else if (err !== undefined) {
    raw = (0, node_util_1.inspect)(err, { depth: 2 });
  }
  var line =
    (_a = raw
      .split("\n")
      .map(function (s) {
        return s.trim();
      })
      .find(Boolean)) !== null && _a !== void 0
      ? _a
      : raw;
  return line.length > 120 ? "".concat(line.slice(0, 119), "\u2026") : line;
}
exports.DEFAULT_WORKSPACE = workspace_js_1.DEFAULT_AGENT_WORKSPACE_DIR;
function resolveControlUiLinks(params) {
  var _a, _b;
  var port = params.port;
  var bind = (_a = params.bind) !== null && _a !== void 0 ? _a : "loopback";
  var customBindHost = (_b = params.customBindHost) === null || _b === void 0 ? void 0 : _b.trim();
  var tailnetIPv4 = (0, tailnet_js_1.pickPrimaryTailnetIPv4)();
  var host = (function () {
    if (bind === "custom" && customBindHost && isValidIPv4(customBindHost)) {
      return customBindHost;
    }
    if (bind === "tailnet" && tailnetIPv4) {
      return tailnetIPv4 !== null && tailnetIPv4 !== void 0 ? tailnetIPv4 : "127.0.0.1";
    }
    return "127.0.0.1";
  })();
  var basePath = (0, control_ui_shared_js_1.normalizeControlUiBasePath)(params.basePath);
  var uiPath = basePath ? "".concat(basePath, "/") : "/";
  var wsPath = basePath ? basePath : "";
  return {
    httpUrl: "http://".concat(host, ":").concat(port).concat(uiPath),
    wsUrl: "ws://".concat(host, ":").concat(port).concat(wsPath),
  };
}
function isValidIPv4(host) {
  var parts = host.split(".");
  if (parts.length !== 4) {
    return false;
  }
  return parts.every(function (part) {
    var n = Number.parseInt(part, 10);
    return !Number.isNaN(n) && n >= 0 && n <= 255 && part === String(n);
  });
}
