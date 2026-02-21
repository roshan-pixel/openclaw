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
exports.setSkillsRemoteRegistry = setSkillsRemoteRegistry;
exports.primeRemoteSkillsCache = primeRemoteSkillsCache;
exports.recordRemoteNodeInfo = recordRemoteNodeInfo;
exports.recordRemoteNodeBins = recordRemoteNodeBins;
exports.refreshRemoteNodeBins = refreshRemoteNodeBins;
exports.getRemoteSkillEligibility = getRemoteSkillEligibility;
exports.refreshRemoteBinsForConnectedNodes = refreshRemoteBinsForConnectedNodes;
var skills_js_1 = require("../agents/skills.js");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var node_pairing_js_1 = require("./node-pairing.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var refresh_js_1 = require("../agents/skills/refresh.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("gateway/skills-remote");
var remoteNodes = new Map();
var remoteRegistry = null;
function describeNode(nodeId) {
  var _a, _b;
  var record = remoteNodes.get(nodeId);
  var name =
    (_a = record === null || record === void 0 ? void 0 : record.displayName) === null ||
    _a === void 0
      ? void 0
      : _a.trim();
  var base = name && name !== nodeId ? "".concat(name, " (").concat(nodeId, ")") : nodeId;
  var ip =
    (_b = record === null || record === void 0 ? void 0 : record.remoteIp) === null || _b === void 0
      ? void 0
      : _b.trim();
  return ip ? "".concat(base, " @ ").concat(ip) : base;
}
function extractErrorMessage(err) {
  if (!err) {
    return undefined;
  }
  if (typeof err === "string") {
    return err;
  }
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === "object" && "message" in err && typeof err.message === "string") {
    return err.message;
  }
  if (typeof err === "number" || typeof err === "boolean" || typeof err === "bigint") {
    return String(err);
  }
  if (typeof err === "symbol") {
    return err.toString();
  }
  if (typeof err === "object") {
    try {
      return JSON.stringify(err);
    } catch (_a) {
      return undefined;
    }
  }
  return undefined;
}
function logRemoteBinProbeFailure(nodeId, err) {
  var message = extractErrorMessage(err);
  var label = describeNode(nodeId);
  // Node unavailable errors (not connected or disconnected mid-operation) are expected
  // when nodes have transient connections - log at info level instead of warn
  if (
    (message === null || message === void 0 ? void 0 : message.includes("node not connected")) ||
    (message === null || message === void 0 ? void 0 : message.includes("node disconnected"))
  ) {
    log.info("remote bin probe skipped: node unavailable (".concat(label, ")"));
    return;
  }
  if (
    (message === null || message === void 0 ? void 0 : message.includes("invoke timed out")) ||
    (message === null || message === void 0 ? void 0 : message.includes("timeout"))
  ) {
    log.warn(
      "remote bin probe timed out (".concat(label, "); check node connectivity for ").concat(label),
    );
    return;
  }
  log.warn(
    "remote bin probe error ("
      .concat(label, "): ")
      .concat(message !== null && message !== void 0 ? message : "unknown"),
  );
}
function isMacPlatform(platform, deviceFamily) {
  var platformNorm = String(platform !== null && platform !== void 0 ? platform : "")
    .trim()
    .toLowerCase();
  var familyNorm = String(deviceFamily !== null && deviceFamily !== void 0 ? deviceFamily : "")
    .trim()
    .toLowerCase();
  if (platformNorm.includes("mac")) {
    return true;
  }
  if (platformNorm.includes("darwin")) {
    return true;
  }
  if (familyNorm === "mac") {
    return true;
  }
  return false;
}
function supportsSystemRun(commands) {
  return Array.isArray(commands) && commands.includes("system.run");
}
function supportsSystemWhich(commands) {
  return Array.isArray(commands) && commands.includes("system.which");
}
function upsertNode(record) {
  var _a, _b, _c, _d, _e, _f, _g;
  var existing = remoteNodes.get(record.nodeId);
  var bins = new Set(
    (_b =
      (_a = record.bins) !== null && _a !== void 0
        ? _a
        : existing === null || existing === void 0
          ? void 0
          : existing.bins) !== null && _b !== void 0
      ? _b
      : [],
  );
  remoteNodes.set(record.nodeId, {
    nodeId: record.nodeId,
    displayName:
      (_c = record.displayName) !== null && _c !== void 0
        ? _c
        : existing === null || existing === void 0
          ? void 0
          : existing.displayName,
    platform:
      (_d = record.platform) !== null && _d !== void 0
        ? _d
        : existing === null || existing === void 0
          ? void 0
          : existing.platform,
    deviceFamily:
      (_e = record.deviceFamily) !== null && _e !== void 0
        ? _e
        : existing === null || existing === void 0
          ? void 0
          : existing.deviceFamily,
    commands:
      (_f = record.commands) !== null && _f !== void 0
        ? _f
        : existing === null || existing === void 0
          ? void 0
          : existing.commands,
    remoteIp:
      (_g = record.remoteIp) !== null && _g !== void 0
        ? _g
        : existing === null || existing === void 0
          ? void 0
          : existing.remoteIp,
    bins: bins,
  });
}
function setSkillsRemoteRegistry(registry) {
  remoteRegistry = registry;
}
function primeRemoteSkillsCache() {
  return __awaiter(this, void 0, void 0, function () {
    var list, sawMac, _i, _a, node, err_1;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          return [4 /*yield*/, (0, node_pairing_js_1.listNodePairing)()];
        case 1:
          list = _b.sent();
          sawMac = false;
          for (_i = 0, _a = list.paired; _i < _a.length; _i++) {
            node = _a[_i];
            upsertNode({
              nodeId: node.nodeId,
              displayName: node.displayName,
              platform: node.platform,
              deviceFamily: node.deviceFamily,
              commands: node.commands,
              remoteIp: node.remoteIp,
              bins: node.bins,
            });
            if (
              isMacPlatform(node.platform, node.deviceFamily) &&
              supportsSystemRun(node.commands)
            ) {
              sawMac = true;
            }
          }
          if (sawMac) {
            (0, refresh_js_1.bumpSkillsSnapshotVersion)({ reason: "remote-node" });
          }
          return [3 /*break*/, 3];
        case 2:
          err_1 = _b.sent();
          log.warn("failed to prime remote skills cache: ".concat(String(err_1)));
          return [3 /*break*/, 3];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function recordRemoteNodeInfo(node) {
  upsertNode(node);
}
function recordRemoteNodeBins(nodeId, bins) {
  upsertNode({ nodeId: nodeId, bins: bins });
}
function listWorkspaceDirs(cfg) {
  var _a;
  var dirs = new Set();
  var list = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.list;
  if (Array.isArray(list)) {
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
      var entry = list_1[_i];
      if (entry && typeof entry === "object" && typeof entry.id === "string") {
        dirs.add((0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, entry.id));
      }
    }
  }
  dirs.add(
    (0, agent_scope_js_1.resolveAgentWorkspaceDir)(
      cfg,
      (0, agent_scope_js_1.resolveDefaultAgentId)(cfg),
    ),
  );
  return __spreadArray([], dirs, true);
}
function collectRequiredBins(entries, targetPlatform) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  var bins = new Set();
  for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
    var entry = entries_1[_i];
    var os =
      (_b = (_a = entry.metadata) === null || _a === void 0 ? void 0 : _a.os) !== null &&
      _b !== void 0
        ? _b
        : [];
    if (os.length > 0 && !os.includes(targetPlatform)) {
      continue;
    }
    var required =
      (_e =
        (_d = (_c = entry.metadata) === null || _c === void 0 ? void 0 : _c.requires) === null ||
        _d === void 0
          ? void 0
          : _d.bins) !== null && _e !== void 0
        ? _e
        : [];
    var anyBins =
      (_h =
        (_g = (_f = entry.metadata) === null || _f === void 0 ? void 0 : _f.requires) === null ||
        _g === void 0
          ? void 0
          : _g.anyBins) !== null && _h !== void 0
        ? _h
        : [];
    for (var _j = 0, required_1 = required; _j < required_1.length; _j++) {
      var bin = required_1[_j];
      if (bin.trim()) {
        bins.add(bin.trim());
      }
    }
    for (var _k = 0, anyBins_1 = anyBins; _k < anyBins_1.length; _k++) {
      var bin = anyBins_1[_k];
      if (bin.trim()) {
        bins.add(bin.trim());
      }
    }
  }
  return __spreadArray([], bins, true);
}
function buildBinProbeScript(bins) {
  var escaped = bins
    .map(function (bin) {
      return "'".concat(bin.replace(/'/g, "'\\''"), "'");
    })
    .join(" ");
  return "for b in ".concat(
    escaped,
    '; do if command -v "$b" >/dev/null 2>&1; then echo "$b"; fi; done',
  );
}
function parseBinProbePayload(payloadJSON, payload) {
  if (!payloadJSON && !payload) {
    return [];
  }
  try {
    var parsed = payloadJSON ? JSON.parse(payloadJSON) : payload;
    if (Array.isArray(parsed.bins)) {
      return parsed.bins
        .map(function (bin) {
          return String(bin).trim();
        })
        .filter(Boolean);
    }
    if (typeof parsed.stdout === "string") {
      return parsed.stdout
        .split(/\r?\n/)
        .map(function (line) {
          return line.trim();
        })
        .filter(Boolean);
    }
  } catch (_a) {
    return [];
  }
  return [];
}
function areBinSetsEqual(a, b) {
  if (!a) {
    return false;
  }
  if (a.size !== b.size) {
    return false;
  }
  for (var _i = 0, b_1 = b; _i < b_1.length; _i++) {
    var bin = b_1[_i];
    if (!a.has(bin)) {
      return false;
    }
  }
  return true;
}
function refreshRemoteNodeBins(params) {
  return __awaiter(this, void 0, void 0, function () {
    var canWhich,
      canRun,
      workspaceDirs,
      requiredBins,
      _i,
      workspaceDirs_1,
      workspaceDir,
      entries,
      _a,
      _b,
      bin,
      binsList,
      res,
      bins,
      existingBins,
      nextBins,
      hasChanged,
      err_2;
    var _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          if (!remoteRegistry) {
            return [2 /*return*/];
          }
          if (!isMacPlatform(params.platform, params.deviceFamily)) {
            return [2 /*return*/];
          }
          canWhich = supportsSystemWhich(params.commands);
          canRun = supportsSystemRun(params.commands);
          if (!canWhich && !canRun) {
            return [2 /*return*/];
          }
          workspaceDirs = listWorkspaceDirs(params.cfg);
          requiredBins = new Set();
          for (_i = 0, workspaceDirs_1 = workspaceDirs; _i < workspaceDirs_1.length; _i++) {
            workspaceDir = workspaceDirs_1[_i];
            entries = (0, skills_js_1.loadWorkspaceSkillEntries)(workspaceDir, {
              config: params.cfg,
            });
            for (_a = 0, _b = collectRequiredBins(entries, "darwin"); _a < _b.length; _a++) {
              bin = _b[_a];
              requiredBins.add(bin);
            }
          }
          if (requiredBins.size === 0) {
            return [2 /*return*/];
          }
          _h.label = 1;
        case 1:
          _h.trys.push([1, 4, , 5]);
          binsList = __spreadArray([], requiredBins, true);
          return [
            4 /*yield*/,
            remoteRegistry.invoke(
              canWhich
                ? {
                    nodeId: params.nodeId,
                    command: "system.which",
                    params: { bins: binsList },
                    timeoutMs: (_c = params.timeoutMs) !== null && _c !== void 0 ? _c : 15000,
                  }
                : {
                    nodeId: params.nodeId,
                    command: "system.run",
                    params: {
                      command: ["/bin/sh", "-lc", buildBinProbeScript(binsList)],
                    },
                    timeoutMs: (_d = params.timeoutMs) !== null && _d !== void 0 ? _d : 15000,
                  },
            ),
          ];
        case 2:
          res = _h.sent();
          if (!res.ok) {
            logRemoteBinProbeFailure(
              params.nodeId,
              (_f = (_e = res.error) === null || _e === void 0 ? void 0 : _e.message) !== null &&
                _f !== void 0
                ? _f
                : "unknown",
            );
            return [2 /*return*/];
          }
          bins = parseBinProbePayload(res.payloadJSON, res.payload);
          existingBins =
            (_g = remoteNodes.get(params.nodeId)) === null || _g === void 0 ? void 0 : _g.bins;
          nextBins = new Set(bins);
          hasChanged = !areBinSetsEqual(existingBins, nextBins);
          recordRemoteNodeBins(params.nodeId, bins);
          if (!hasChanged) {
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            (0, node_pairing_js_1.updatePairedNodeMetadata)(params.nodeId, { bins: bins }),
          ];
        case 3:
          _h.sent();
          (0, refresh_js_1.bumpSkillsSnapshotVersion)({ reason: "remote-node" });
          return [3 /*break*/, 5];
        case 4:
          err_2 = _h.sent();
          logRemoteBinProbeFailure(params.nodeId, err_2);
          return [3 /*break*/, 5];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function getRemoteSkillEligibility() {
  var macNodes = __spreadArray([], remoteNodes.values(), true).filter(function (node) {
    return isMacPlatform(node.platform, node.deviceFamily) && supportsSystemRun(node.commands);
  });
  if (macNodes.length === 0) {
    return undefined;
  }
  var bins = new Set();
  for (var _i = 0, macNodes_1 = macNodes; _i < macNodes_1.length; _i++) {
    var node = macNodes_1[_i];
    for (var _a = 0, _b = node.bins; _a < _b.length; _a++) {
      var bin = _b[_a];
      bins.add(bin);
    }
  }
  var labels = macNodes
    .map(function (node) {
      var _a;
      return (_a = node.displayName) !== null && _a !== void 0 ? _a : node.nodeId;
    })
    .filter(Boolean);
  var note =
    labels.length > 0
      ? "Remote macOS node available (".concat(
          labels.join(", "),
          "). Run macOS-only skills via nodes.run on that node.",
        )
      : "Remote macOS node available. Run macOS-only skills via nodes.run on that node.";
  return {
    platforms: ["darwin"],
    hasBin: function (bin) {
      return bins.has(bin);
    },
    hasAnyBin: function (required) {
      return required.some(function (bin) {
        return bins.has(bin);
      });
    },
    note: note,
  };
}
function refreshRemoteBinsForConnectedNodes(cfg) {
  return __awaiter(this, void 0, void 0, function () {
    var connected, _i, connected_1, node;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!remoteRegistry) {
            return [2 /*return*/];
          }
          connected = remoteRegistry.listConnected();
          ((_i = 0), (connected_1 = connected));
          _a.label = 1;
        case 1:
          if (!(_i < connected_1.length)) {
            return [3 /*break*/, 4];
          }
          node = connected_1[_i];
          return [
            4 /*yield*/,
            refreshRemoteNodeBins({
              nodeId: node.nodeId,
              platform: node.platform,
              deviceFamily: node.deviceFamily,
              commands: node.commands,
              cfg: cfg,
            }),
          ];
        case 2:
          _a.sent();
          _a.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
