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
exports.loadPluginManifestRegistry = loadPluginManifestRegistry;
var node_fs_1 = require("node:fs");
var utils_js_1 = require("../utils.js");
var config_state_js_1 = require("./config-state.js");
var discovery_js_1 = require("./discovery.js");
var manifest_js_1 = require("./manifest.js");
var registryCache = new Map();
var DEFAULT_MANIFEST_CACHE_MS = 200;
function resolveManifestCacheMs(env) {
  var _a;
  var raw =
    (_a = env.OPENCLAW_PLUGIN_MANIFEST_CACHE_MS) === null || _a === void 0 ? void 0 : _a.trim();
  if (raw === "" || raw === "0") {
    return 0;
  }
  if (!raw) {
    return DEFAULT_MANIFEST_CACHE_MS;
  }
  var parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_MANIFEST_CACHE_MS;
  }
  return Math.max(0, parsed);
}
function shouldUseManifestCache(env) {
  var _a;
  var disabled =
    (_a = env.OPENCLAW_DISABLE_PLUGIN_MANIFEST_CACHE) === null || _a === void 0
      ? void 0
      : _a.trim();
  if (disabled) {
    return false;
  }
  return resolveManifestCacheMs(env) > 0;
}
function buildCacheKey(params) {
  var workspaceKey = params.workspaceDir
    ? (0, utils_js_1.resolveUserPath)(params.workspaceDir)
    : "";
  return "".concat(workspaceKey, "::").concat(JSON.stringify(params.plugins));
}
function safeStatMtimeMs(filePath) {
  try {
    return node_fs_1.default.statSync(filePath).mtimeMs;
  } catch (_a) {
    return null;
  }
}
function normalizeManifestLabel(raw) {
  var trimmed = raw === null || raw === void 0 ? void 0 : raw.trim();
  return trimmed ? trimmed : undefined;
}
function buildRecord(params) {
  var _a, _b, _c, _d, _e, _f;
  return {
    id: params.manifest.id,
    name:
      (_a = normalizeManifestLabel(params.manifest.name)) !== null && _a !== void 0
        ? _a
        : params.candidate.packageName,
    description:
      (_b = normalizeManifestLabel(params.manifest.description)) !== null && _b !== void 0
        ? _b
        : params.candidate.packageDescription,
    version:
      (_c = normalizeManifestLabel(params.manifest.version)) !== null && _c !== void 0
        ? _c
        : params.candidate.packageVersion,
    kind: params.manifest.kind,
    channels: (_d = params.manifest.channels) !== null && _d !== void 0 ? _d : [],
    providers: (_e = params.manifest.providers) !== null && _e !== void 0 ? _e : [],
    skills: (_f = params.manifest.skills) !== null && _f !== void 0 ? _f : [],
    origin: params.candidate.origin,
    workspaceDir: params.candidate.workspaceDir,
    rootDir: params.candidate.rootDir,
    source: params.candidate.source,
    manifestPath: params.manifestPath,
    schemaCacheKey: params.schemaCacheKey,
    configSchema: params.configSchema,
    configUiHints: params.manifest.uiHints,
  };
}
function loadPluginManifestRegistry(params) {
  var _a, _b, _c;
  var config = (_a = params.config) !== null && _a !== void 0 ? _a : {};
  var normalized = (0, config_state_js_1.normalizePluginsConfig)(config.plugins);
  var cacheKey = buildCacheKey({ workspaceDir: params.workspaceDir, plugins: normalized });
  var env = (_b = params.env) !== null && _b !== void 0 ? _b : process.env;
  var cacheEnabled = params.cache !== false && shouldUseManifestCache(env);
  if (cacheEnabled) {
    var cached = registryCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.registry;
    }
  }
  var discovery = params.candidates
    ? {
        candidates: params.candidates,
        diagnostics: (_c = params.diagnostics) !== null && _c !== void 0 ? _c : [],
      }
    : (0, discovery_js_1.discoverOpenClawPlugins)({
        workspaceDir: params.workspaceDir,
        extraPaths: normalized.loadPaths,
      });
  var diagnostics = __spreadArray([], discovery.diagnostics, true);
  var candidates = discovery.candidates;
  var records = [];
  var seenIds = new Set();
  for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
    var candidate = candidates_1[_i];
    var manifestRes = (0, manifest_js_1.loadPluginManifest)(candidate.rootDir);
    if (!manifestRes.ok) {
      diagnostics.push({
        level: "error",
        message: manifestRes.error,
        source: manifestRes.manifestPath,
      });
      continue;
    }
    var manifest = manifestRes.manifest;
    if (candidate.idHint && candidate.idHint !== manifest.id) {
      diagnostics.push({
        level: "warn",
        pluginId: manifest.id,
        source: candidate.source,
        message: 'plugin id mismatch (manifest uses "'
          .concat(manifest.id, '", entry hints "')
          .concat(candidate.idHint, '")'),
      });
    }
    if (seenIds.has(manifest.id)) {
      diagnostics.push({
        level: "warn",
        pluginId: manifest.id,
        source: candidate.source,
        message: "duplicate plugin id detected; later plugin may be overridden (".concat(
          candidate.source,
          ")",
        ),
      });
    } else {
      seenIds.add(manifest.id);
    }
    var configSchema = manifest.configSchema;
    var manifestMtime = safeStatMtimeMs(manifestRes.manifestPath);
    var schemaCacheKey = manifestMtime
      ? "".concat(manifestRes.manifestPath, ":").concat(manifestMtime)
      : manifestRes.manifestPath;
    records.push(
      buildRecord({
        manifest: manifest,
        candidate: candidate,
        manifestPath: manifestRes.manifestPath,
        schemaCacheKey: schemaCacheKey,
        configSchema: configSchema,
      }),
    );
  }
  var registry = { plugins: records, diagnostics: diagnostics };
  if (cacheEnabled) {
    var ttl = resolveManifestCacheMs(env);
    if (ttl > 0) {
      registryCache.set(cacheKey, { expiresAt: Date.now() + ttl, registry: registry });
    }
  }
  return registry;
}
