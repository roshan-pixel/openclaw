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
exports.maybePruneSandboxes = maybePruneSandboxes;
exports.ensureDockerContainerIsRunning = ensureDockerContainerIsRunning;
var bridge_server_js_1 = require("../../browser/bridge-server.js");
var runtime_js_1 = require("../../runtime.js");
var browser_bridges_js_1 = require("./browser-bridges.js");
var docker_js_1 = require("./docker.js");
var registry_js_1 = require("./registry.js");
var lastPruneAtMs = 0;
function pruneSandboxContainers(cfg) {
  return __awaiter(this, void 0, void 0, function () {
    var now, idleHours, maxAgeDays, registry, _i, _a, entry, idleMs, ageMs, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          now = Date.now();
          idleHours = cfg.prune.idleHours;
          maxAgeDays = cfg.prune.maxAgeDays;
          if (idleHours === 0 && maxAgeDays === 0) {
            return [2 /*return*/];
          }
          return [4 /*yield*/, (0, registry_js_1.readRegistry)()];
        case 1:
          registry = _c.sent();
          ((_i = 0), (_a = registry.entries));
          _c.label = 2;
        case 2:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 9];
          }
          entry = _a[_i];
          idleMs = now - entry.lastUsedAtMs;
          ageMs = now - entry.createdAtMs;
          if (
            !(
              (idleHours > 0 && idleMs > idleHours * 60 * 60 * 1000) ||
              (maxAgeDays > 0 && ageMs > maxAgeDays * 24 * 60 * 60 * 1000)
            )
          ) {
            return [3 /*break*/, 8];
          }
          _c.label = 3;
        case 3:
          _c.trys.push([3, 5, 6, 8]);
          return [
            4 /*yield*/,
            (0, docker_js_1.execDocker)(["rm", "-f", entry.containerName], {
              allowFailure: true,
            }),
          ];
        case 4:
          _c.sent();
          return [3 /*break*/, 8];
        case 5:
          _b = _c.sent();
          return [3 /*break*/, 8];
        case 6:
          return [4 /*yield*/, (0, registry_js_1.removeRegistryEntry)(entry.containerName)];
        case 7:
          _c.sent();
          return [7 /*endfinally*/];
        case 8:
          _i++;
          return [3 /*break*/, 2];
        case 9:
          return [2 /*return*/];
      }
    });
  });
}
function pruneSandboxBrowsers(cfg) {
  return __awaiter(this, void 0, void 0, function () {
    var now, idleHours, maxAgeDays, registry, _i, _a, entry, idleMs, ageMs, _b, bridge;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          now = Date.now();
          idleHours = cfg.prune.idleHours;
          maxAgeDays = cfg.prune.maxAgeDays;
          if (idleHours === 0 && maxAgeDays === 0) {
            return [2 /*return*/];
          }
          return [4 /*yield*/, (0, registry_js_1.readBrowserRegistry)()];
        case 1:
          registry = _c.sent();
          ((_i = 0), (_a = registry.entries));
          _c.label = 2;
        case 2:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 11];
          }
          entry = _a[_i];
          idleMs = now - entry.lastUsedAtMs;
          ageMs = now - entry.createdAtMs;
          if (
            !(
              (idleHours > 0 && idleMs > idleHours * 60 * 60 * 1000) ||
              (maxAgeDays > 0 && ageMs > maxAgeDays * 24 * 60 * 60 * 1000)
            )
          ) {
            return [3 /*break*/, 10];
          }
          _c.label = 3;
        case 3:
          _c.trys.push([3, 5, 6, 10]);
          return [
            4 /*yield*/,
            (0, docker_js_1.execDocker)(["rm", "-f", entry.containerName], {
              allowFailure: true,
            }),
          ];
        case 4:
          _c.sent();
          return [3 /*break*/, 10];
        case 5:
          _b = _c.sent();
          return [3 /*break*/, 10];
        case 6:
          return [4 /*yield*/, (0, registry_js_1.removeBrowserRegistryEntry)(entry.containerName)];
        case 7:
          _c.sent();
          bridge = browser_bridges_js_1.BROWSER_BRIDGES.get(entry.sessionKey);
          if (
            !(
              (bridge === null || bridge === void 0 ? void 0 : bridge.containerName) ===
              entry.containerName
            )
          ) {
            return [3 /*break*/, 9];
          }
          return [
            4 /*yield*/,
            (0, bridge_server_js_1.stopBrowserBridgeServer)(bridge.bridge.server).catch(
              function () {
                return undefined;
              },
            ),
          ];
        case 8:
          _c.sent();
          browser_bridges_js_1.BROWSER_BRIDGES.delete(entry.sessionKey);
          _c.label = 9;
        case 9:
          return [7 /*endfinally*/];
        case 10:
          _i++;
          return [3 /*break*/, 2];
        case 11:
          return [2 /*return*/];
      }
    });
  });
}
function maybePruneSandboxes(cfg) {
  return __awaiter(this, void 0, void 0, function () {
    var now, error_1, message;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          now = Date.now();
          if (now - lastPruneAtMs < 5 * 60 * 1000) {
            return [2 /*return*/];
          }
          lastPruneAtMs = now;
          _b.label = 1;
        case 1:
          _b.trys.push([1, 4, , 5]);
          return [4 /*yield*/, pruneSandboxContainers(cfg)];
        case 2:
          _b.sent();
          return [4 /*yield*/, pruneSandboxBrowsers(cfg)];
        case 3:
          _b.sent();
          return [3 /*break*/, 5];
        case 4:
          error_1 = _b.sent();
          message =
            error_1 instanceof Error
              ? error_1.message
              : typeof error_1 === "string"
                ? error_1
                : JSON.stringify(error_1);
          (_a = runtime_js_1.defaultRuntime.error) === null || _a === void 0
            ? void 0
            : _a.call(
                runtime_js_1.defaultRuntime,
                "Sandbox prune failed: ".concat(
                  message !== null && message !== void 0 ? message : "unknown error",
                ),
              );
          return [3 /*break*/, 5];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function ensureDockerContainerIsRunning(containerName) {
  return __awaiter(this, void 0, void 0, function () {
    var state;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, docker_js_1.dockerContainerState)(containerName)];
        case 1:
          state = _a.sent();
          if (!(state.exists && !state.running)) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, (0, docker_js_1.execDocker)(["start", containerName])];
        case 2:
          _a.sent();
          _a.label = 3;
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
