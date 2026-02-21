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
exports.loadShellEnvFallback = loadShellEnvFallback;
exports.shouldEnableShellEnvFallback = shouldEnableShellEnvFallback;
exports.shouldDeferShellEnvFallback = shouldDeferShellEnvFallback;
exports.resolveShellEnvFallbackTimeoutMs = resolveShellEnvFallbackTimeoutMs;
exports.getShellPathFromLoginShell = getShellPathFromLoginShell;
exports.resetShellPathCacheForTests = resetShellPathCacheForTests;
exports.getShellEnvAppliedKeys = getShellEnvAppliedKeys;
var node_child_process_1 = require("node:child_process");
var env_js_1 = require("./env.js");
var DEFAULT_TIMEOUT_MS = 15000;
var DEFAULT_MAX_BUFFER_BYTES = 2 * 1024 * 1024;
var lastAppliedKeys = [];
var cachedShellPath;
function resolveShell(env) {
  var _a;
  var shell = (_a = env.SHELL) === null || _a === void 0 ? void 0 : _a.trim();
  return shell && shell.length > 0 ? shell : "/bin/sh";
}
function parseShellEnv(stdout) {
  var shellEnv = new Map();
  var parts = stdout.toString("utf8").split("\0");
  for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
    var part = parts_1[_i];
    if (!part) {
      continue;
    }
    var eq = part.indexOf("=");
    if (eq <= 0) {
      continue;
    }
    var key = part.slice(0, eq);
    var value = part.slice(eq + 1);
    if (!key) {
      continue;
    }
    shellEnv.set(key, value);
  }
  return shellEnv;
}
function loadShellEnvFallback(opts) {
  var _a, _b, _c;
  var logger = (_a = opts.logger) !== null && _a !== void 0 ? _a : console;
  var exec = (_b = opts.exec) !== null && _b !== void 0 ? _b : node_child_process_1.execFileSync;
  if (!opts.enabled) {
    lastAppliedKeys = [];
    return { ok: true, applied: [], skippedReason: "disabled" };
  }
  var hasAnyKey = opts.expectedKeys.some(function (key) {
    var _a;
    return Boolean((_a = opts.env[key]) === null || _a === void 0 ? void 0 : _a.trim());
  });
  if (hasAnyKey) {
    lastAppliedKeys = [];
    return { ok: true, applied: [], skippedReason: "already-has-keys" };
  }
  var timeoutMs =
    typeof opts.timeoutMs === "number" && Number.isFinite(opts.timeoutMs)
      ? Math.max(0, opts.timeoutMs)
      : DEFAULT_TIMEOUT_MS;
  var shell = resolveShell(opts.env);
  var stdout;
  try {
    stdout = exec(shell, ["-l", "-c", "env -0"], {
      encoding: "buffer",
      timeout: timeoutMs,
      maxBuffer: DEFAULT_MAX_BUFFER_BYTES,
      env: opts.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (err) {
    var msg = err instanceof Error ? err.message : String(err);
    logger.warn("[openclaw] shell env fallback failed: ".concat(msg));
    lastAppliedKeys = [];
    return { ok: false, error: msg, applied: [] };
  }
  var shellEnv = parseShellEnv(stdout);
  var applied = [];
  for (var _i = 0, _d = opts.expectedKeys; _i < _d.length; _i++) {
    var key = _d[_i];
    if ((_c = opts.env[key]) === null || _c === void 0 ? void 0 : _c.trim()) {
      continue;
    }
    var value = shellEnv.get(key);
    if (!(value === null || value === void 0 ? void 0 : value.trim())) {
      continue;
    }
    opts.env[key] = value;
    applied.push(key);
  }
  lastAppliedKeys = applied;
  return { ok: true, applied: applied };
}
function shouldEnableShellEnvFallback(env) {
  return (0, env_js_1.isTruthyEnvValue)(env.OPENCLAW_LOAD_SHELL_ENV);
}
function shouldDeferShellEnvFallback(env) {
  return (0, env_js_1.isTruthyEnvValue)(env.OPENCLAW_DEFER_SHELL_ENV_FALLBACK);
}
function resolveShellEnvFallbackTimeoutMs(env) {
  var _a;
  var raw = (_a = env.OPENCLAW_SHELL_ENV_TIMEOUT_MS) === null || _a === void 0 ? void 0 : _a.trim();
  if (!raw) {
    return DEFAULT_TIMEOUT_MS;
  }
  var parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_TIMEOUT_MS;
  }
  return Math.max(0, parsed);
}
function getShellPathFromLoginShell(opts) {
  var _a, _b;
  if (cachedShellPath !== undefined) {
    return cachedShellPath;
  }
  if (process.platform === "win32") {
    cachedShellPath = null;
    return cachedShellPath;
  }
  var exec = (_a = opts.exec) !== null && _a !== void 0 ? _a : node_child_process_1.execFileSync;
  var timeoutMs =
    typeof opts.timeoutMs === "number" && Number.isFinite(opts.timeoutMs)
      ? Math.max(0, opts.timeoutMs)
      : DEFAULT_TIMEOUT_MS;
  var shell = resolveShell(opts.env);
  var stdout;
  try {
    stdout = exec(shell, ["-l", "-c", "env -0"], {
      encoding: "buffer",
      timeout: timeoutMs,
      maxBuffer: DEFAULT_MAX_BUFFER_BYTES,
      env: opts.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (_c) {
    cachedShellPath = null;
    return cachedShellPath;
  }
  var shellEnv = parseShellEnv(stdout);
  var shellPath = (_b = shellEnv.get("PATH")) === null || _b === void 0 ? void 0 : _b.trim();
  cachedShellPath = shellPath && shellPath.length > 0 ? shellPath : null;
  return cachedShellPath;
}
function resetShellPathCacheForTests() {
  cachedShellPath = undefined;
}
function getShellEnvAppliedKeys() {
  return __spreadArray([], lastAppliedKeys, true);
}
