"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLUGIN_MANIFEST_FILENAMES = exports.PLUGIN_MANIFEST_FILENAME = void 0;
exports.resolvePluginManifestPath = resolvePluginManifestPath;
exports.loadPluginManifest = loadPluginManifest;
exports.getPackageManifestMetadata = getPackageManifestMetadata;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var legacy_names_js_1 = require("../compat/legacy-names.js");
exports.PLUGIN_MANIFEST_FILENAME = "openclaw.plugin.json";
exports.PLUGIN_MANIFEST_FILENAMES = [exports.PLUGIN_MANIFEST_FILENAME];
function normalizeStringList(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map(function (entry) {
      return typeof entry === "string" ? entry.trim() : "";
    })
    .filter(Boolean);
}
function isRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function resolvePluginManifestPath(rootDir) {
  for (
    var _i = 0, PLUGIN_MANIFEST_FILENAMES_1 = exports.PLUGIN_MANIFEST_FILENAMES;
    _i < PLUGIN_MANIFEST_FILENAMES_1.length;
    _i++
  ) {
    var filename = PLUGIN_MANIFEST_FILENAMES_1[_i];
    var candidate = node_path_1.default.join(rootDir, filename);
    if (node_fs_1.default.existsSync(candidate)) {
      return candidate;
    }
  }
  return node_path_1.default.join(rootDir, exports.PLUGIN_MANIFEST_FILENAME);
}
function loadPluginManifest(rootDir) {
  var manifestPath = resolvePluginManifestPath(rootDir);
  if (!node_fs_1.default.existsSync(manifestPath)) {
    return {
      ok: false,
      error: "plugin manifest not found: ".concat(manifestPath),
      manifestPath: manifestPath,
    };
  }
  var raw;
  try {
    raw = JSON.parse(node_fs_1.default.readFileSync(manifestPath, "utf-8"));
  } catch (err) {
    return {
      ok: false,
      error: "failed to parse plugin manifest: ".concat(String(err)),
      manifestPath: manifestPath,
    };
  }
  if (!isRecord(raw)) {
    return { ok: false, error: "plugin manifest must be an object", manifestPath: manifestPath };
  }
  var id = typeof raw.id === "string" ? raw.id.trim() : "";
  if (!id) {
    return { ok: false, error: "plugin manifest requires id", manifestPath: manifestPath };
  }
  var configSchema = isRecord(raw.configSchema) ? raw.configSchema : null;
  if (!configSchema) {
    return {
      ok: false,
      error: "plugin manifest requires configSchema",
      manifestPath: manifestPath,
    };
  }
  var kind = typeof raw.kind === "string" ? raw.kind : undefined;
  var name = typeof raw.name === "string" ? raw.name.trim() : undefined;
  var description = typeof raw.description === "string" ? raw.description.trim() : undefined;
  var version = typeof raw.version === "string" ? raw.version.trim() : undefined;
  var channels = normalizeStringList(raw.channels);
  var providers = normalizeStringList(raw.providers);
  var skills = normalizeStringList(raw.skills);
  var uiHints;
  if (isRecord(raw.uiHints)) {
    uiHints = raw.uiHints;
  }
  return {
    ok: true,
    manifest: {
      id: id,
      configSchema: configSchema,
      kind: kind,
      channels: channels,
      providers: providers,
      skills: skills,
      name: name,
      description: description,
      version: version,
      uiHints: uiHints,
    },
    manifestPath: manifestPath,
  };
}
function getPackageManifestMetadata(manifest) {
  if (!manifest) {
    return undefined;
  }
  return manifest[legacy_names_js_1.MANIFEST_KEY];
}
