"use strict";
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
exports.DEFAULT_GATEWAY_PORT = exports.CONFIG_PATH = exports.STATE_DIR = exports.isNixMode = void 0;
exports.resolveIsNixMode = resolveIsNixMode;
exports.resolveLegacyStateDir = resolveLegacyStateDir;
exports.resolveLegacyStateDirs = resolveLegacyStateDirs;
exports.resolveNewStateDir = resolveNewStateDir;
exports.resolveStateDir = resolveStateDir;
exports.resolveCanonicalConfigPath = resolveCanonicalConfigPath;
exports.resolveConfigPathCandidate = resolveConfigPathCandidate;
exports.resolveConfigPath = resolveConfigPath;
exports.resolveDefaultConfigCandidates = resolveDefaultConfigCandidates;
exports.resolveGatewayLockDir = resolveGatewayLockDir;
exports.resolveOAuthDir = resolveOAuthDir;
exports.resolveOAuthPath = resolveOAuthPath;
exports.resolveGatewayPort = resolveGatewayPort;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
/**
 * Nix mode detection: When OPENCLAW_NIX_MODE=1, the gateway is running under Nix.
 * In this mode:
 * - No auto-install flows should be attempted
 * - Missing dependencies should produce actionable Nix-specific error messages
 * - Config is managed externally (read-only from Nix perspective)
 */
function resolveIsNixMode(env) {
  if (env === void 0) {
    env = process.env;
  }
  return env.OPENCLAW_NIX_MODE === "1";
}
exports.isNixMode = resolveIsNixMode();
var LEGACY_STATE_DIRNAMES = [".clawdbot", ".moltbot", ".moldbot"];
var NEW_STATE_DIRNAME = ".openclaw";
var CONFIG_FILENAME = "openclaw.json";
var LEGACY_CONFIG_FILENAMES = ["clawdbot.json", "moltbot.json", "moldbot.json"];
function legacyStateDirs(homedir) {
  if (homedir === void 0) {
    homedir = node_os_1.default.homedir;
  }
  return LEGACY_STATE_DIRNAMES.map(function (dir) {
    return node_path_1.default.join(homedir(), dir);
  });
}
function newStateDir(homedir) {
  if (homedir === void 0) {
    homedir = node_os_1.default.homedir;
  }
  return node_path_1.default.join(homedir(), NEW_STATE_DIRNAME);
}
function resolveLegacyStateDir(homedir) {
  var _a;
  if (homedir === void 0) {
    homedir = node_os_1.default.homedir;
  }
  return (_a = legacyStateDirs(homedir)[0]) !== null && _a !== void 0 ? _a : newStateDir(homedir);
}
function resolveLegacyStateDirs(homedir) {
  if (homedir === void 0) {
    homedir = node_os_1.default.homedir;
  }
  return legacyStateDirs(homedir);
}
function resolveNewStateDir(homedir) {
  if (homedir === void 0) {
    homedir = node_os_1.default.homedir;
  }
  return newStateDir(homedir);
}
/**
 * State directory for mutable data (sessions, logs, caches).
 * Can be overridden via OPENCLAW_STATE_DIR.
 * Default: ~/.openclaw
 */
function resolveStateDir(env, homedir) {
  var _a, _b;
  if (env === void 0) {
    env = process.env;
  }
  if (homedir === void 0) {
    homedir = node_os_1.default.homedir;
  }
  var override =
    ((_a = env.OPENCLAW_STATE_DIR) === null || _a === void 0 ? void 0 : _a.trim()) ||
    ((_b = env.CLAWDBOT_STATE_DIR) === null || _b === void 0 ? void 0 : _b.trim());
  if (override) {
    return resolveUserPath(override);
  }
  var newDir = newStateDir(homedir);
  var legacyDirs = legacyStateDirs(homedir);
  var hasNew = node_fs_1.default.existsSync(newDir);
  if (hasNew) {
    return newDir;
  }
  var existingLegacy = legacyDirs.find(function (dir) {
    try {
      return node_fs_1.default.existsSync(dir);
    } catch (_a) {
      return false;
    }
  });
  if (existingLegacy) {
    return existingLegacy;
  }
  return newDir;
}
function resolveUserPath(input) {
  var trimmed = input.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (trimmed.startsWith("~")) {
    var expanded = trimmed.replace(/^~(?=$|[\\/])/, node_os_1.default.homedir());
    return node_path_1.default.resolve(expanded);
  }
  return node_path_1.default.resolve(trimmed);
}
exports.STATE_DIR = resolveStateDir();
/**
 * Config file path (JSON5).
 * Can be overridden via OPENCLAW_CONFIG_PATH.
 * Default: ~/.openclaw/openclaw.json (or $OPENCLAW_STATE_DIR/openclaw.json)
 */
function resolveCanonicalConfigPath(env, stateDir) {
  var _a, _b;
  if (env === void 0) {
    env = process.env;
  }
  if (stateDir === void 0) {
    stateDir = resolveStateDir(env, node_os_1.default.homedir);
  }
  var override =
    ((_a = env.OPENCLAW_CONFIG_PATH) === null || _a === void 0 ? void 0 : _a.trim()) ||
    ((_b = env.CLAWDBOT_CONFIG_PATH) === null || _b === void 0 ? void 0 : _b.trim());
  if (override) {
    return resolveUserPath(override);
  }
  return node_path_1.default.join(stateDir, CONFIG_FILENAME);
}
/**
 * Resolve the active config path by preferring existing config candidates
 * before falling back to the canonical path.
 */
function resolveConfigPathCandidate(env, homedir) {
  if (env === void 0) {
    env = process.env;
  }
  if (homedir === void 0) {
    homedir = node_os_1.default.homedir;
  }
  var candidates = resolveDefaultConfigCandidates(env, homedir);
  var existing = candidates.find(function (candidate) {
    try {
      return node_fs_1.default.existsSync(candidate);
    } catch (_a) {
      return false;
    }
  });
  if (existing) {
    return existing;
  }
  return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
}
/**
 * Active config path (prefers existing config files).
 */
function resolveConfigPath(env, stateDir, homedir) {
  var _a, _b;
  if (env === void 0) {
    env = process.env;
  }
  if (stateDir === void 0) {
    stateDir = resolveStateDir(env, node_os_1.default.homedir);
  }
  if (homedir === void 0) {
    homedir = node_os_1.default.homedir;
  }
  var override = (_a = env.OPENCLAW_CONFIG_PATH) === null || _a === void 0 ? void 0 : _a.trim();
  if (override) {
    return resolveUserPath(override);
  }
  var stateOverride = (_b = env.OPENCLAW_STATE_DIR) === null || _b === void 0 ? void 0 : _b.trim();
  var candidates = __spreadArray(
    [node_path_1.default.join(stateDir, CONFIG_FILENAME)],
    LEGACY_CONFIG_FILENAMES.map(function (name) {
      return node_path_1.default.join(stateDir, name);
    }),
    true,
  );
  var existing = candidates.find(function (candidate) {
    try {
      return node_fs_1.default.existsSync(candidate);
    } catch (_a) {
      return false;
    }
  });
  if (existing) {
    return existing;
  }
  if (stateOverride) {
    return node_path_1.default.join(stateDir, CONFIG_FILENAME);
  }
  var defaultStateDir = resolveStateDir(env, homedir);
  if (node_path_1.default.resolve(stateDir) === node_path_1.default.resolve(defaultStateDir)) {
    return resolveConfigPathCandidate(env, homedir);
  }
  return node_path_1.default.join(stateDir, CONFIG_FILENAME);
}
exports.CONFIG_PATH = resolveConfigPathCandidate();
/**
 * Resolve default config path candidates across default locations.
 * Order: explicit config path → state-dir-derived paths → new default.
 */
function resolveDefaultConfigCandidates(env, homedir) {
  var _a, _b, _c, _d;
  if (env === void 0) {
    env = process.env;
  }
  if (homedir === void 0) {
    homedir = node_os_1.default.homedir;
  }
  var explicit =
    ((_a = env.OPENCLAW_CONFIG_PATH) === null || _a === void 0 ? void 0 : _a.trim()) ||
    ((_b = env.CLAWDBOT_CONFIG_PATH) === null || _b === void 0 ? void 0 : _b.trim());
  if (explicit) {
    return [resolveUserPath(explicit)];
  }
  var candidates = [];
  var openclawStateDir =
    ((_c = env.OPENCLAW_STATE_DIR) === null || _c === void 0 ? void 0 : _c.trim()) ||
    ((_d = env.CLAWDBOT_STATE_DIR) === null || _d === void 0 ? void 0 : _d.trim());
  if (openclawStateDir) {
    var resolved_1 = resolveUserPath(openclawStateDir);
    candidates.push(node_path_1.default.join(resolved_1, CONFIG_FILENAME));
    candidates.push.apply(
      candidates,
      LEGACY_CONFIG_FILENAMES.map(function (name) {
        return node_path_1.default.join(resolved_1, name);
      }),
    );
  }
  var defaultDirs = __spreadArray([newStateDir(homedir)], legacyStateDirs(homedir), true);
  var _loop_1 = function (dir) {
    candidates.push(node_path_1.default.join(dir, CONFIG_FILENAME));
    candidates.push.apply(
      candidates,
      LEGACY_CONFIG_FILENAMES.map(function (name) {
        return node_path_1.default.join(dir, name);
      }),
    );
  };
  for (var _i = 0, defaultDirs_1 = defaultDirs; _i < defaultDirs_1.length; _i++) {
    var dir = defaultDirs_1[_i];
    _loop_1(dir);
  }
  return candidates;
}
exports.DEFAULT_GATEWAY_PORT = 18789;
/**
 * Gateway lock directory (ephemeral).
 * Default: os.tmpdir()/openclaw-<uid> (uid suffix when available).
 */
function resolveGatewayLockDir(tmpdir) {
  if (tmpdir === void 0) {
    tmpdir = node_os_1.default.tmpdir;
  }
  var base = tmpdir();
  var uid = typeof process.getuid === "function" ? process.getuid() : undefined;
  var suffix = uid != null ? "openclaw-".concat(uid) : "openclaw";
  return node_path_1.default.join(base, suffix);
}
var OAUTH_FILENAME = "oauth.json";
/**
 * OAuth credentials storage directory.
 *
 * Precedence:
 * - `OPENCLAW_OAUTH_DIR` (explicit override)
 * - `$*_STATE_DIR/credentials` (canonical server/default)
 */
function resolveOAuthDir(env, stateDir) {
  var _a;
  if (env === void 0) {
    env = process.env;
  }
  if (stateDir === void 0) {
    stateDir = resolveStateDir(env, node_os_1.default.homedir);
  }
  var override = (_a = env.OPENCLAW_OAUTH_DIR) === null || _a === void 0 ? void 0 : _a.trim();
  if (override) {
    return resolveUserPath(override);
  }
  return node_path_1.default.join(stateDir, "credentials");
}
function resolveOAuthPath(env, stateDir) {
  if (env === void 0) {
    env = process.env;
  }
  if (stateDir === void 0) {
    stateDir = resolveStateDir(env, node_os_1.default.homedir);
  }
  return node_path_1.default.join(resolveOAuthDir(env, stateDir), OAUTH_FILENAME);
}
function resolveGatewayPort(cfg, env) {
  var _a, _b, _c;
  if (env === void 0) {
    env = process.env;
  }
  var envRaw =
    ((_a = env.OPENCLAW_GATEWAY_PORT) === null || _a === void 0 ? void 0 : _a.trim()) ||
    ((_b = env.CLAWDBOT_GATEWAY_PORT) === null || _b === void 0 ? void 0 : _b.trim());
  if (envRaw) {
    var parsed = Number.parseInt(envRaw, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }
  var configPort =
    (_c = cfg === null || cfg === void 0 ? void 0 : cfg.gateway) === null || _c === void 0
      ? void 0
      : _c.port;
  if (typeof configPort === "number" && Number.isFinite(configPort)) {
    if (configPort > 0) {
      return configPort;
    }
  }
  return exports.DEFAULT_GATEWAY_PORT;
}
