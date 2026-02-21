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
exports.execDocker = execDocker;
exports.readDockerPort = readDockerPort;
exports.ensureDockerImage = ensureDockerImage;
exports.dockerContainerState = dockerContainerState;
exports.buildSandboxCreateArgs = buildSandboxCreateArgs;
exports.ensureSandboxContainer = ensureSandboxContainer;
var node_child_process_1 = require("node:child_process");
var runtime_js_1 = require("../../runtime.js");
var command_format_js_1 = require("../../cli/command-format.js");
var constants_js_1 = require("./constants.js");
var registry_js_1 = require("./registry.js");
var config_hash_js_1 = require("./config-hash.js");
var shared_js_1 = require("./shared.js");
var HOT_CONTAINER_WINDOW_MS = 5 * 60 * 1000;
function execDocker(args, opts) {
  return new Promise(function (resolve, reject) {
    var _a, _b;
    var child = (0, node_child_process_1.spawn)("docker", args, {
      stdio: ["ignore", "pipe", "pipe"],
    });
    var stdout = "";
    var stderr = "";
    (_a = child.stdout) === null || _a === void 0
      ? void 0
      : _a.on("data", function (chunk) {
          stdout += chunk.toString();
        });
    (_b = child.stderr) === null || _b === void 0
      ? void 0
      : _b.on("data", function (chunk) {
          stderr += chunk.toString();
        });
    child.on("close", function (code) {
      var exitCode = code !== null && code !== void 0 ? code : 0;
      if (exitCode !== 0 && !(opts === null || opts === void 0 ? void 0 : opts.allowFailure)) {
        reject(new Error(stderr.trim() || "docker ".concat(args.join(" "), " failed")));
        return;
      }
      resolve({ stdout: stdout, stderr: stderr, code: exitCode });
    });
  });
}
function readDockerPort(containerName, port) {
  return __awaiter(this, void 0, void 0, function () {
    var result, line, match, mapped;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [
            4 /*yield*/,
            execDocker(["port", containerName, "".concat(port, "/tcp")], {
              allowFailure: true,
            }),
          ];
        case 1:
          result = _c.sent();
          if (result.code !== 0) {
            return [2 /*return*/, null];
          }
          line = (_a = result.stdout.trim().split(/\r?\n/)[0]) !== null && _a !== void 0 ? _a : "";
          match = line.match(/:(\d+)\s*$/);
          if (!match) {
            return [2 /*return*/, null];
          }
          mapped = Number.parseInt((_b = match[1]) !== null && _b !== void 0 ? _b : "", 10);
          return [2 /*return*/, Number.isFinite(mapped) ? mapped : null];
      }
    });
  });
}
function dockerImageExists(image) {
  return __awaiter(this, void 0, void 0, function () {
    var result, stderr;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            execDocker(["image", "inspect", image], {
              allowFailure: true,
            }),
          ];
        case 1:
          result = _a.sent();
          if (result.code === 0) {
            return [2 /*return*/, true];
          }
          stderr = result.stderr.trim();
          if (stderr.includes("No such image")) {
            return [2 /*return*/, false];
          }
          throw new Error("Failed to inspect sandbox image: ".concat(stderr));
      }
    });
  });
}
function ensureDockerImage(image) {
  return __awaiter(this, void 0, void 0, function () {
    var exists;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, dockerImageExists(image)];
        case 1:
          exists = _a.sent();
          if (exists) {
            return [2 /*return*/];
          }
          if (!(image === constants_js_1.DEFAULT_SANDBOX_IMAGE)) {
            return [3 /*break*/, 4];
          }
          return [4 /*yield*/, execDocker(["pull", "debian:bookworm-slim"])];
        case 2:
          _a.sent();
          return [
            4 /*yield*/,
            execDocker(["tag", "debian:bookworm-slim", constants_js_1.DEFAULT_SANDBOX_IMAGE]),
          ];
        case 3:
          _a.sent();
          return [2 /*return*/];
        case 4:
          throw new Error("Sandbox image not found: ".concat(image, ". Build or pull it first."));
      }
    });
  });
}
function dockerContainerState(name) {
  return __awaiter(this, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            execDocker(["inspect", "-f", "{{.State.Running}}", name], {
              allowFailure: true,
            }),
          ];
        case 1:
          result = _a.sent();
          if (result.code !== 0) {
            return [2 /*return*/, { exists: false, running: false }];
          }
          return [2 /*return*/, { exists: true, running: result.stdout.trim() === "true" }];
      }
    });
  });
}
function normalizeDockerLimit(value) {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : undefined;
  }
  var trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}
function formatUlimitValue(name, value) {
  if (!name.trim()) {
    return null;
  }
  if (typeof value === "number" || typeof value === "string") {
    var raw = String(value).trim();
    return raw ? "".concat(name, "=").concat(raw) : null;
  }
  var soft = typeof value.soft === "number" ? Math.max(0, value.soft) : undefined;
  var hard = typeof value.hard === "number" ? Math.max(0, value.hard) : undefined;
  if (soft === undefined && hard === undefined) {
    return null;
  }
  if (soft === undefined) {
    return "".concat(name, "=").concat(hard);
  }
  if (hard === undefined) {
    return "".concat(name, "=").concat(soft);
  }
  return "".concat(name, "=").concat(soft, ":").concat(hard);
}
function buildSandboxCreateArgs(params) {
  var _a, _b, _c, _d, _e, _f;
  var createdAtMs = (_a = params.createdAtMs) !== null && _a !== void 0 ? _a : Date.now();
  var args = ["create", "--name", params.name];
  args.push("--label", "openclaw.sandbox=1");
  args.push("--label", "openclaw.sessionKey=".concat(params.scopeKey));
  args.push("--label", "openclaw.createdAtMs=".concat(createdAtMs));
  if (params.configHash) {
    args.push("--label", "openclaw.configHash=".concat(params.configHash));
  }
  for (
    var _i = 0, _g = Object.entries((_b = params.labels) !== null && _b !== void 0 ? _b : {});
    _i < _g.length;
    _i++
  ) {
    var _h = _g[_i],
      key = _h[0],
      value = _h[1];
    if (key && value) {
      args.push("--label", "".concat(key, "=").concat(value));
    }
  }
  if (params.cfg.readOnlyRoot) {
    args.push("--read-only");
  }
  for (var _j = 0, _k = params.cfg.tmpfs; _j < _k.length; _j++) {
    var entry = _k[_j];
    args.push("--tmpfs", entry);
  }
  if (params.cfg.network) {
    args.push("--network", params.cfg.network);
  }
  if (params.cfg.user) {
    args.push("--user", params.cfg.user);
  }
  for (var _l = 0, _m = params.cfg.capDrop; _l < _m.length; _l++) {
    var cap = _m[_l];
    args.push("--cap-drop", cap);
  }
  args.push("--security-opt", "no-new-privileges");
  if (params.cfg.seccompProfile) {
    args.push("--security-opt", "seccomp=".concat(params.cfg.seccompProfile));
  }
  if (params.cfg.apparmorProfile) {
    args.push("--security-opt", "apparmor=".concat(params.cfg.apparmorProfile));
  }
  for (
    var _o = 0, _p = (_c = params.cfg.dns) !== null && _c !== void 0 ? _c : [];
    _o < _p.length;
    _o++
  ) {
    var entry = _p[_o];
    if (entry.trim()) {
      args.push("--dns", entry);
    }
  }
  for (
    var _q = 0, _r = (_d = params.cfg.extraHosts) !== null && _d !== void 0 ? _d : [];
    _q < _r.length;
    _q++
  ) {
    var entry = _r[_q];
    if (entry.trim()) {
      args.push("--add-host", entry);
    }
  }
  if (typeof params.cfg.pidsLimit === "number" && params.cfg.pidsLimit > 0) {
    args.push("--pids-limit", String(params.cfg.pidsLimit));
  }
  var memory = normalizeDockerLimit(params.cfg.memory);
  if (memory) {
    args.push("--memory", memory);
  }
  var memorySwap = normalizeDockerLimit(params.cfg.memorySwap);
  if (memorySwap) {
    args.push("--memory-swap", memorySwap);
  }
  if (typeof params.cfg.cpus === "number" && params.cfg.cpus > 0) {
    args.push("--cpus", String(params.cfg.cpus));
  }
  for (
    var _s = 0, _t = Object.entries((_e = params.cfg.ulimits) !== null && _e !== void 0 ? _e : {});
    _s < _t.length;
    _s++
  ) {
    var _u = _t[_s],
      name_1 = _u[0],
      value = _u[1];
    var formatted = formatUlimitValue(name_1, value);
    if (formatted) {
      args.push("--ulimit", formatted);
    }
  }
  if ((_f = params.cfg.binds) === null || _f === void 0 ? void 0 : _f.length) {
    for (var _v = 0, _w = params.cfg.binds; _v < _w.length; _v++) {
      var bind = _w[_v];
      args.push("-v", bind);
    }
  }
  return args;
}
function createSandboxContainer(params) {
  return __awaiter(this, void 0, void 0, function () {
    var name, cfg, workspaceDir, scopeKey, args, mainMountSuffix, agentMountSuffix;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ((name = params.name),
            (cfg = params.cfg),
            (workspaceDir = params.workspaceDir),
            (scopeKey = params.scopeKey));
          return [4 /*yield*/, ensureDockerImage(cfg.image)];
        case 1:
          _b.sent();
          args = buildSandboxCreateArgs({
            name: name,
            cfg: cfg,
            scopeKey: scopeKey,
            configHash: params.configHash,
          });
          args.push("--workdir", cfg.workdir);
          mainMountSuffix =
            params.workspaceAccess === "ro" && workspaceDir === params.agentWorkspaceDir
              ? ":ro"
              : "";
          args.push("-v", "".concat(workspaceDir, ":").concat(cfg.workdir).concat(mainMountSuffix));
          if (params.workspaceAccess !== "none" && workspaceDir !== params.agentWorkspaceDir) {
            agentMountSuffix = params.workspaceAccess === "ro" ? ":ro" : "";
            args.push(
              "-v",
              ""
                .concat(params.agentWorkspaceDir, ":")
                .concat(constants_js_1.SANDBOX_AGENT_WORKSPACE_MOUNT)
                .concat(agentMountSuffix),
            );
          }
          args.push(cfg.image, "sleep", "infinity");
          return [4 /*yield*/, execDocker(args)];
        case 2:
          _b.sent();
          return [4 /*yield*/, execDocker(["start", name])];
        case 3:
          _b.sent();
          if (!((_a = cfg.setupCommand) === null || _a === void 0 ? void 0 : _a.trim())) {
            return [3 /*break*/, 5];
          }
          return [4 /*yield*/, execDocker(["exec", "-i", name, "sh", "-lc", cfg.setupCommand])];
        case 4:
          _b.sent();
          _b.label = 5;
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function readContainerConfigHash(containerName) {
  return __awaiter(this, void 0, void 0, function () {
    var readLabel;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          readLabel = function (label) {
            return __awaiter(_this, void 0, void 0, function () {
              var result, raw;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    return [
                      4 /*yield*/,
                      execDocker(
                        [
                          "inspect",
                          "-f",
                          '{{ index .Config.Labels "'.concat(label, '" }}'),
                          containerName,
                        ],
                        { allowFailure: true },
                      ),
                    ];
                  case 1:
                    result = _a.sent();
                    if (result.code !== 0) {
                      return [2 /*return*/, null];
                    }
                    raw = result.stdout.trim();
                    if (!raw || raw === "<no value>") {
                      return [2 /*return*/, null];
                    }
                    return [2 /*return*/, raw];
                }
              });
            });
          };
          return [4 /*yield*/, readLabel("openclaw.configHash")];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function formatSandboxRecreateHint(params) {
  var _a;
  if (params.scope === "session") {
    return (0, command_format_js_1.formatCliCommand)(
      "openclaw sandbox recreate --session ".concat(params.sessionKey),
    );
  }
  if (params.scope === "agent") {
    var agentId =
      (_a = (0, shared_js_1.resolveSandboxAgentId)(params.sessionKey)) !== null && _a !== void 0
        ? _a
        : "main";
    return (0, command_format_js_1.formatCliCommand)(
      "openclaw sandbox recreate --agent ".concat(agentId),
    );
  }
  return (0, command_format_js_1.formatCliCommand)("openclaw sandbox recreate --all");
}
function ensureSandboxContainer(params) {
  return __awaiter(this, void 0, void 0, function () {
    var scopeKey,
      slug,
      name,
      containerName,
      expectedHash,
      now,
      state,
      hasContainer,
      running,
      currentHash,
      hashMismatch,
      registryEntry,
      registry,
      lastUsedAtMs,
      isHot,
      hint;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          scopeKey = (0, shared_js_1.resolveSandboxScopeKey)(params.cfg.scope, params.sessionKey);
          slug =
            params.cfg.scope === "shared" ? "shared" : (0, shared_js_1.slugifySessionKey)(scopeKey);
          name = "".concat(params.cfg.docker.containerPrefix).concat(slug);
          containerName = name.slice(0, 63);
          expectedHash = (0, config_hash_js_1.computeSandboxConfigHash)({
            docker: params.cfg.docker,
            workspaceAccess: params.cfg.workspaceAccess,
            workspaceDir: params.workspaceDir,
            agentWorkspaceDir: params.agentWorkspaceDir,
          });
          now = Date.now();
          return [4 /*yield*/, dockerContainerState(containerName)];
        case 1:
          state = _b.sent();
          hasContainer = state.exists;
          running = state.running;
          currentHash = null;
          hashMismatch = false;
          if (!hasContainer) {
            return [3 /*break*/, 6];
          }
          return [4 /*yield*/, (0, registry_js_1.readRegistry)()];
        case 2:
          registry = _b.sent();
          registryEntry = registry.entries.find(function (entry) {
            return entry.containerName === containerName;
          });
          return [4 /*yield*/, readContainerConfigHash(containerName)];
        case 3:
          currentHash = _b.sent();
          if (!currentHash) {
            currentHash =
              (_a =
                registryEntry === null || registryEntry === void 0
                  ? void 0
                  : registryEntry.configHash) !== null && _a !== void 0
                ? _a
                : null;
          }
          hashMismatch = !currentHash || currentHash !== expectedHash;
          if (!hashMismatch) {
            return [3 /*break*/, 6];
          }
          lastUsedAtMs =
            registryEntry === null || registryEntry === void 0
              ? void 0
              : registryEntry.lastUsedAtMs;
          isHot =
            running &&
            (typeof lastUsedAtMs !== "number" || now - lastUsedAtMs < HOT_CONTAINER_WINDOW_MS);
          if (!isHot) {
            return [3 /*break*/, 4];
          }
          hint = formatSandboxRecreateHint({ scope: params.cfg.scope, sessionKey: scopeKey });
          runtime_js_1.defaultRuntime.log(
            "Sandbox config changed for "
              .concat(containerName, " (recently used). Recreate to apply: ")
              .concat(hint),
          );
          return [3 /*break*/, 6];
        case 4:
          return [4 /*yield*/, execDocker(["rm", "-f", containerName], { allowFailure: true })];
        case 5:
          _b.sent();
          hasContainer = false;
          running = false;
          _b.label = 6;
        case 6:
          if (!!hasContainer) {
            return [3 /*break*/, 8];
          }
          return [
            4 /*yield*/,
            createSandboxContainer({
              name: containerName,
              cfg: params.cfg.docker,
              workspaceDir: params.workspaceDir,
              workspaceAccess: params.cfg.workspaceAccess,
              agentWorkspaceDir: params.agentWorkspaceDir,
              scopeKey: scopeKey,
              configHash: expectedHash,
            }),
          ];
        case 7:
          _b.sent();
          return [3 /*break*/, 10];
        case 8:
          if (!!running) {
            return [3 /*break*/, 10];
          }
          return [4 /*yield*/, execDocker(["start", containerName])];
        case 9:
          _b.sent();
          _b.label = 10;
        case 10:
          return [
            4 /*yield*/,
            (0, registry_js_1.updateRegistry)({
              containerName: containerName,
              sessionKey: scopeKey,
              createdAtMs: now,
              lastUsedAtMs: now,
              image: params.cfg.docker.image,
              configHash:
                hashMismatch && running
                  ? currentHash !== null && currentHash !== void 0
                    ? currentHash
                    : undefined
                  : expectedHash,
            }),
          ];
        case 11:
          _b.sent();
          return [2 /*return*/, containerName];
      }
    });
  });
}
