"use strict";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) {
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
          }
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== "function" && b !== null) {
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      }
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
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
exports.DuplicateAgentDirError = void 0;
exports.findDuplicateAgentDirs = findDuplicateAgentDirs;
exports.formatDuplicateAgentDirError = formatDuplicateAgentDirError;
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var session_key_js_1 = require("../routing/session-key.js");
var utils_js_1 = require("../utils.js");
var paths_js_1 = require("./paths.js");
var DuplicateAgentDirError = /** @class */ (function (_super) {
  __extends(DuplicateAgentDirError, _super);
  function DuplicateAgentDirError(duplicates) {
    var _this = _super.call(this, formatDuplicateAgentDirError(duplicates)) || this;
    _this.name = "DuplicateAgentDirError";
    _this.duplicates = duplicates;
    return _this;
  }
  return DuplicateAgentDirError;
})(Error);
exports.DuplicateAgentDirError = DuplicateAgentDirError;
function canonicalizeAgentDir(agentDir) {
  var resolved = node_path_1.default.resolve(agentDir);
  if (process.platform === "darwin" || process.platform === "win32") {
    return resolved.toLowerCase();
  }
  return resolved;
}
function collectReferencedAgentIds(cfg) {
  var _a, _b, _c, _d, _e, _f;
  var ids = new Set();
  var agents = Array.isArray((_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.list)
    ? (_b = cfg.agents) === null || _b === void 0
      ? void 0
      : _b.list
    : [];
  var defaultAgentId =
    (_f =
      (_d =
        (_c = agents.find(function (agent) {
          return agent === null || agent === void 0 ? void 0 : agent.default;
        })) === null || _c === void 0
          ? void 0
          : _c.id) !== null && _d !== void 0
        ? _d
        : (_e = agents[0]) === null || _e === void 0
          ? void 0
          : _e.id) !== null && _f !== void 0
      ? _f
      : session_key_js_1.DEFAULT_AGENT_ID;
  ids.add((0, session_key_js_1.normalizeAgentId)(defaultAgentId));
  for (var _i = 0, agents_1 = agents; _i < agents_1.length; _i++) {
    var entry = agents_1[_i];
    if (entry === null || entry === void 0 ? void 0 : entry.id) {
      ids.add((0, session_key_js_1.normalizeAgentId)(entry.id));
    }
  }
  var bindings = cfg.bindings;
  if (Array.isArray(bindings)) {
    for (var _g = 0, bindings_1 = bindings; _g < bindings_1.length; _g++) {
      var binding = bindings_1[_g];
      var id = binding === null || binding === void 0 ? void 0 : binding.agentId;
      if (typeof id === "string" && id.trim()) {
        ids.add((0, session_key_js_1.normalizeAgentId)(id));
      }
    }
  }
  return __spreadArray([], ids, true);
}
function resolveEffectiveAgentDir(cfg, agentId, deps) {
  var _a, _b, _c, _d, _e;
  var id = (0, session_key_js_1.normalizeAgentId)(agentId);
  var configured = Array.isArray((_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.list)
    ? (_c =
        (_b = cfg.agents) === null || _b === void 0
          ? void 0
          : _b.list.find(function (agent) {
              return (0, session_key_js_1.normalizeAgentId)(agent.id) === id;
            })) === null || _c === void 0
      ? void 0
      : _c.agentDir
    : undefined;
  var trimmed = configured === null || configured === void 0 ? void 0 : configured.trim();
  if (trimmed) {
    return (0, utils_js_1.resolveUserPath)(trimmed);
  }
  var root = (0, paths_js_1.resolveStateDir)(
    (_d = deps === null || deps === void 0 ? void 0 : deps.env) !== null && _d !== void 0
      ? _d
      : process.env,
    (_e = deps === null || deps === void 0 ? void 0 : deps.homedir) !== null && _e !== void 0
      ? _e
      : node_os_1.default.homedir,
  );
  return node_path_1.default.join(root, "agents", id, "agent");
}
function findDuplicateAgentDirs(cfg, deps) {
  var byDir = new Map();
  for (var _i = 0, _a = collectReferencedAgentIds(cfg); _i < _a.length; _i++) {
    var agentId = _a[_i];
    var agentDir = resolveEffectiveAgentDir(cfg, agentId, deps);
    var key = canonicalizeAgentDir(agentDir);
    var entry = byDir.get(key);
    if (entry) {
      entry.agentIds.push(agentId);
    } else {
      byDir.set(key, { agentDir: agentDir, agentIds: [agentId] });
    }
  }
  return __spreadArray([], byDir.values(), true).filter(function (v) {
    return v.agentIds.length > 1;
  });
}
function formatDuplicateAgentDirError(dups) {
  var lines = __spreadArray(
    __spreadArray(
      [
        "Duplicate agentDir detected (multi-agent config).",
        "Each agent must have a unique agentDir; sharing it causes auth/session state collisions and token invalidation.",
        "",
        "Conflicts:",
      ],
      dups.map(function (d) {
        return "- ".concat(d.agentDir, ": ").concat(
          d.agentIds
            .map(function (id) {
              return '"'.concat(id, '"');
            })
            .join(", "),
        );
      }),
      true,
    ),
    [
      "",
      "Fix: remove the shared agents.list[].agentDir override (or give each agent its own directory).",
      "If you want to share credentials, copy auth-profiles.json instead of sharing the entire agentDir.",
    ],
    false,
  );
  return lines.join("\n");
}
