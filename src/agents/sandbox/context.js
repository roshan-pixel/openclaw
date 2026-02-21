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
exports.resolveSandboxContext = resolveSandboxContext;
exports.ensureSandboxWorkspaceForSession = ensureSandboxWorkspaceForSession;
var promises_1 = require("node:fs/promises");
var runtime_js_1 = require("../../runtime.js");
var utils_js_1 = require("../../utils.js");
var constants_js_1 = require("../../browser/constants.js");
var skills_js_1 = require("../skills.js");
var workspace_js_1 = require("../workspace.js");
var browser_js_1 = require("./browser.js");
var config_js_1 = require("./config.js");
var docker_js_1 = require("./docker.js");
var prune_js_1 = require("./prune.js");
var runtime_status_js_1 = require("./runtime-status.js");
var shared_js_1 = require("./shared.js");
var workspace_js_2 = require("./workspace.js");
function resolveSandboxContext(params) {
  return __awaiter(this, void 0, void 0, function () {
    var rawSessionKey,
      runtime,
      cfg,
      agentWorkspaceDir,
      workspaceRoot,
      scopeKey,
      sandboxWorkspaceDir,
      workspaceDir,
      error_1,
      message,
      containerName,
      evaluateEnabled,
      browser;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
      switch (_k.label) {
        case 0:
          rawSessionKey = (_a = params.sessionKey) === null || _a === void 0 ? void 0 : _a.trim();
          if (!rawSessionKey) {
            return [2 /*return*/, null];
          }
          runtime = (0, runtime_status_js_1.resolveSandboxRuntimeStatus)({
            cfg: params.config,
            sessionKey: rawSessionKey,
          });
          if (!runtime.sandboxed) {
            return [2 /*return*/, null];
          }
          cfg = (0, config_js_1.resolveSandboxConfigForAgent)(params.config, runtime.agentId);
          return [4 /*yield*/, (0, prune_js_1.maybePruneSandboxes)(cfg)];
        case 1:
          _k.sent();
          agentWorkspaceDir = (0, utils_js_1.resolveUserPath)(
            ((_b = params.workspaceDir) === null || _b === void 0 ? void 0 : _b.trim()) ||
              workspace_js_1.DEFAULT_AGENT_WORKSPACE_DIR,
          );
          workspaceRoot = (0, utils_js_1.resolveUserPath)(cfg.workspaceRoot);
          scopeKey = (0, shared_js_1.resolveSandboxScopeKey)(cfg.scope, rawSessionKey);
          sandboxWorkspaceDir =
            cfg.scope === "shared"
              ? workspaceRoot
              : (0, shared_js_1.resolveSandboxWorkspaceDir)(workspaceRoot, scopeKey);
          workspaceDir = cfg.workspaceAccess === "rw" ? agentWorkspaceDir : sandboxWorkspaceDir;
          if (!(workspaceDir === sandboxWorkspaceDir)) {
            return [3 /*break*/, 7];
          }
          return [
            4 /*yield*/,
            (0, workspace_js_2.ensureSandboxWorkspace)(
              sandboxWorkspaceDir,
              agentWorkspaceDir,
              (_e =
                (_d = (_c = params.config) === null || _c === void 0 ? void 0 : _c.agents) ===
                  null || _d === void 0
                  ? void 0
                  : _d.defaults) === null || _e === void 0
                ? void 0
                : _e.skipBootstrap,
            ),
          ];
        case 2:
          _k.sent();
          if (!(cfg.workspaceAccess !== "rw")) {
            return [3 /*break*/, 6];
          }
          _k.label = 3;
        case 3:
          _k.trys.push([3, 5, , 6]);
          return [
            4 /*yield*/,
            (0, skills_js_1.syncSkillsToWorkspace)({
              sourceWorkspaceDir: agentWorkspaceDir,
              targetWorkspaceDir: sandboxWorkspaceDir,
              config: params.config,
            }),
          ];
        case 4:
          _k.sent();
          return [3 /*break*/, 6];
        case 5:
          error_1 = _k.sent();
          message = error_1 instanceof Error ? error_1.message : JSON.stringify(error_1);
          (_f = runtime_js_1.defaultRuntime.error) === null || _f === void 0
            ? void 0
            : _f.call(runtime_js_1.defaultRuntime, "Sandbox skill sync failed: ".concat(message));
          return [3 /*break*/, 6];
        case 6:
          return [3 /*break*/, 9];
        case 7:
          return [4 /*yield*/, promises_1.default.mkdir(workspaceDir, { recursive: true })];
        case 8:
          _k.sent();
          _k.label = 9;
        case 9:
          return [
            4 /*yield*/,
            (0, docker_js_1.ensureSandboxContainer)({
              sessionKey: rawSessionKey,
              workspaceDir: workspaceDir,
              agentWorkspaceDir: agentWorkspaceDir,
              cfg: cfg,
            }),
          ];
        case 10:
          containerName = _k.sent();
          evaluateEnabled =
            (_j =
              (_h = (_g = params.config) === null || _g === void 0 ? void 0 : _g.browser) ===
                null || _h === void 0
                ? void 0
                : _h.evaluateEnabled) !== null && _j !== void 0
              ? _j
              : constants_js_1.DEFAULT_BROWSER_EVALUATE_ENABLED;
          return [
            4 /*yield*/,
            (0, browser_js_1.ensureSandboxBrowser)({
              scopeKey: scopeKey,
              workspaceDir: workspaceDir,
              agentWorkspaceDir: agentWorkspaceDir,
              cfg: cfg,
              evaluateEnabled: evaluateEnabled,
            }),
          ];
        case 11:
          browser = _k.sent();
          return [
            2 /*return*/,
            {
              enabled: true,
              sessionKey: rawSessionKey,
              workspaceDir: workspaceDir,
              agentWorkspaceDir: agentWorkspaceDir,
              workspaceAccess: cfg.workspaceAccess,
              containerName: containerName,
              containerWorkdir: cfg.docker.workdir,
              docker: cfg.docker,
              tools: cfg.tools,
              browserAllowHostControl: cfg.browser.allowHostControl,
              browser: browser !== null && browser !== void 0 ? browser : undefined,
            },
          ];
      }
    });
  });
}
function ensureSandboxWorkspaceForSession(params) {
  return __awaiter(this, void 0, void 0, function () {
    var rawSessionKey,
      runtime,
      cfg,
      agentWorkspaceDir,
      workspaceRoot,
      scopeKey,
      sandboxWorkspaceDir,
      workspaceDir,
      error_2,
      message;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          rawSessionKey = (_a = params.sessionKey) === null || _a === void 0 ? void 0 : _a.trim();
          if (!rawSessionKey) {
            return [2 /*return*/, null];
          }
          runtime = (0, runtime_status_js_1.resolveSandboxRuntimeStatus)({
            cfg: params.config,
            sessionKey: rawSessionKey,
          });
          if (!runtime.sandboxed) {
            return [2 /*return*/, null];
          }
          cfg = (0, config_js_1.resolveSandboxConfigForAgent)(params.config, runtime.agentId);
          agentWorkspaceDir = (0, utils_js_1.resolveUserPath)(
            ((_b = params.workspaceDir) === null || _b === void 0 ? void 0 : _b.trim()) ||
              workspace_js_1.DEFAULT_AGENT_WORKSPACE_DIR,
          );
          workspaceRoot = (0, utils_js_1.resolveUserPath)(cfg.workspaceRoot);
          scopeKey = (0, shared_js_1.resolveSandboxScopeKey)(cfg.scope, rawSessionKey);
          sandboxWorkspaceDir =
            cfg.scope === "shared"
              ? workspaceRoot
              : (0, shared_js_1.resolveSandboxWorkspaceDir)(workspaceRoot, scopeKey);
          workspaceDir = cfg.workspaceAccess === "rw" ? agentWorkspaceDir : sandboxWorkspaceDir;
          if (!(workspaceDir === sandboxWorkspaceDir)) {
            return [3 /*break*/, 6];
          }
          return [
            4 /*yield*/,
            (0, workspace_js_2.ensureSandboxWorkspace)(
              sandboxWorkspaceDir,
              agentWorkspaceDir,
              (_e =
                (_d = (_c = params.config) === null || _c === void 0 ? void 0 : _c.agents) ===
                  null || _d === void 0
                  ? void 0
                  : _d.defaults) === null || _e === void 0
                ? void 0
                : _e.skipBootstrap,
            ),
          ];
        case 1:
          _g.sent();
          if (!(cfg.workspaceAccess !== "rw")) {
            return [3 /*break*/, 5];
          }
          _g.label = 2;
        case 2:
          _g.trys.push([2, 4, , 5]);
          return [
            4 /*yield*/,
            (0, skills_js_1.syncSkillsToWorkspace)({
              sourceWorkspaceDir: agentWorkspaceDir,
              targetWorkspaceDir: sandboxWorkspaceDir,
              config: params.config,
            }),
          ];
        case 3:
          _g.sent();
          return [3 /*break*/, 5];
        case 4:
          error_2 = _g.sent();
          message = error_2 instanceof Error ? error_2.message : JSON.stringify(error_2);
          (_f = runtime_js_1.defaultRuntime.error) === null || _f === void 0
            ? void 0
            : _f.call(runtime_js_1.defaultRuntime, "Sandbox skill sync failed: ".concat(message));
          return [3 /*break*/, 5];
        case 5:
          return [3 /*break*/, 8];
        case 6:
          return [4 /*yield*/, promises_1.default.mkdir(workspaceDir, { recursive: true })];
        case 7:
          _g.sent();
          _g.label = 8;
        case 8:
          return [
            2 /*return*/,
            {
              workspaceDir: workspaceDir,
              containerWorkdir: cfg.docker.workdir,
            },
          ];
      }
    });
  });
}
