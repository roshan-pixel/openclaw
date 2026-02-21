"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discoverOpenClawPlugins = discoverOpenClawPlugins;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var utils_js_1 = require("../utils.js");
var bundled_dir_js_1 = require("./bundled-dir.js");
var manifest_js_1 = require("./manifest.js");
var EXTENSION_EXTS = new Set([".ts", ".js", ".mts", ".cts", ".mjs", ".cjs"]);
function isExtensionFile(filePath) {
  var ext = node_path_1.default.extname(filePath);
  if (!EXTENSION_EXTS.has(ext)) {
    return false;
  }
  return !filePath.endsWith(".d.ts");
}
function readPackageManifest(dir) {
  var manifestPath = node_path_1.default.join(dir, "package.json");
  if (!node_fs_1.default.existsSync(manifestPath)) {
    return null;
  }
  try {
    var raw = node_fs_1.default.readFileSync(manifestPath, "utf-8");
    return JSON.parse(raw);
  } catch (_a) {
    return null;
  }
}
function resolvePackageExtensions(manifest) {
  var _a;
  var raw =
    (_a = (0, manifest_js_1.getPackageManifestMetadata)(manifest)) === null || _a === void 0
      ? void 0
      : _a.extensions;
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map(function (entry) {
      return typeof entry === "string" ? entry.trim() : "";
    })
    .filter(Boolean);
}
function deriveIdHint(params) {
  var _a, _b;
  var base = node_path_1.default.basename(
    params.filePath,
    node_path_1.default.extname(params.filePath),
  );
  var rawPackageName = (_a = params.packageName) === null || _a === void 0 ? void 0 : _a.trim();
  if (!rawPackageName) {
    return base;
  }
  // Prefer the unscoped name so config keys stay stable even when the npm
  // package is scoped (example: @openclaw/voice-call -> voice-call).
  var unscoped = rawPackageName.includes("/")
    ? (_b = rawPackageName.split("/").pop()) !== null && _b !== void 0
      ? _b
      : rawPackageName
    : rawPackageName;
  if (!params.hasMultipleExtensions) {
    return unscoped;
  }
  return "".concat(unscoped, "/").concat(base);
}
function addCandidate(params) {
  var _a, _b, _c, _d;
  var resolved = node_path_1.default.resolve(params.source);
  if (params.seen.has(resolved)) {
    return;
  }
  params.seen.add(resolved);
  var manifest = (_a = params.manifest) !== null && _a !== void 0 ? _a : null;
  params.candidates.push({
    idHint: params.idHint,
    source: resolved,
    rootDir: node_path_1.default.resolve(params.rootDir),
    origin: params.origin,
    workspaceDir: params.workspaceDir,
    packageName:
      ((_b = manifest === null || manifest === void 0 ? void 0 : manifest.name) === null ||
      _b === void 0
        ? void 0
        : _b.trim()) || undefined,
    packageVersion:
      ((_c = manifest === null || manifest === void 0 ? void 0 : manifest.version) === null ||
      _c === void 0
        ? void 0
        : _c.trim()) || undefined,
    packageDescription:
      ((_d = manifest === null || manifest === void 0 ? void 0 : manifest.description) === null ||
      _d === void 0
        ? void 0
        : _d.trim()) || undefined,
    packageDir: params.packageDir,
    packageManifest: (0, manifest_js_1.getPackageManifestMetadata)(
      manifest !== null && manifest !== void 0 ? manifest : undefined,
    ),
  });
}
function discoverInDirectory(params) {
  if (!node_fs_1.default.existsSync(params.dir)) {
    return;
  }
  var entries = [];
  try {
    entries = node_fs_1.default.readdirSync(params.dir, { withFileTypes: true });
  } catch (err) {
    params.diagnostics.push({
      level: "warn",
      message: "failed to read extensions dir: ".concat(params.dir, " (").concat(String(err), ")"),
      source: params.dir,
    });
    return;
  }
  var _loop_1 = function (entry) {
    var fullPath = node_path_1.default.join(params.dir, entry.name);
    if (entry.isFile()) {
      if (!isExtensionFile(fullPath)) {
        return "continue";
      }
      addCandidate({
        candidates: params.candidates,
        seen: params.seen,
        idHint: node_path_1.default.basename(entry.name, node_path_1.default.extname(entry.name)),
        source: fullPath,
        rootDir: node_path_1.default.dirname(fullPath),
        origin: params.origin,
        workspaceDir: params.workspaceDir,
      });
    }
    if (!entry.isDirectory()) {
      return "continue";
    }
    var manifest = readPackageManifest(fullPath);
    var extensions = manifest ? resolvePackageExtensions(manifest) : [];
    if (extensions.length > 0) {
      for (var _a = 0, extensions_1 = extensions; _a < extensions_1.length; _a++) {
        var extPath = extensions_1[_a];
        var resolved = node_path_1.default.resolve(fullPath, extPath);
        addCandidate({
          candidates: params.candidates,
          seen: params.seen,
          idHint: deriveIdHint({
            filePath: resolved,
            packageName: manifest === null || manifest === void 0 ? void 0 : manifest.name,
            hasMultipleExtensions: extensions.length > 1,
          }),
          source: resolved,
          rootDir: fullPath,
          origin: params.origin,
          workspaceDir: params.workspaceDir,
          manifest: manifest,
          packageDir: fullPath,
        });
      }
      return "continue";
    }
    var indexCandidates = ["index.ts", "index.js", "index.mjs", "index.cjs"];
    var indexFile = indexCandidates
      .map(function (candidate) {
        return node_path_1.default.join(fullPath, candidate);
      })
      .find(function (candidate) {
        return node_fs_1.default.existsSync(candidate);
      });
    if (indexFile && isExtensionFile(indexFile)) {
      addCandidate({
        candidates: params.candidates,
        seen: params.seen,
        idHint: entry.name,
        source: indexFile,
        rootDir: fullPath,
        origin: params.origin,
        workspaceDir: params.workspaceDir,
        manifest: manifest,
        packageDir: fullPath,
      });
    }
  };
  for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
    var entry = entries_1[_i];
    _loop_1(entry);
  }
}
function discoverFromPath(params) {
  var resolved = (0, utils_js_1.resolveUserPath)(params.rawPath);
  if (!node_fs_1.default.existsSync(resolved)) {
    params.diagnostics.push({
      level: "error",
      message: "plugin path not found: ".concat(resolved),
      source: resolved,
    });
    return;
  }
  var stat = node_fs_1.default.statSync(resolved);
  if (stat.isFile()) {
    if (!isExtensionFile(resolved)) {
      params.diagnostics.push({
        level: "error",
        message: "plugin path is not a supported file: ".concat(resolved),
        source: resolved,
      });
      return;
    }
    addCandidate({
      candidates: params.candidates,
      seen: params.seen,
      idHint: node_path_1.default.basename(resolved, node_path_1.default.extname(resolved)),
      source: resolved,
      rootDir: node_path_1.default.dirname(resolved),
      origin: params.origin,
      workspaceDir: params.workspaceDir,
    });
    return;
  }
  if (stat.isDirectory()) {
    var manifest = readPackageManifest(resolved);
    var extensions = manifest ? resolvePackageExtensions(manifest) : [];
    if (extensions.length > 0) {
      for (var _i = 0, extensions_2 = extensions; _i < extensions_2.length; _i++) {
        var extPath = extensions_2[_i];
        var source = node_path_1.default.resolve(resolved, extPath);
        addCandidate({
          candidates: params.candidates,
          seen: params.seen,
          idHint: deriveIdHint({
            filePath: source,
            packageName: manifest === null || manifest === void 0 ? void 0 : manifest.name,
            hasMultipleExtensions: extensions.length > 1,
          }),
          source: source,
          rootDir: resolved,
          origin: params.origin,
          workspaceDir: params.workspaceDir,
          manifest: manifest,
          packageDir: resolved,
        });
      }
      return;
    }
    var indexCandidates = ["index.ts", "index.js", "index.mjs", "index.cjs"];
    var indexFile = indexCandidates
      .map(function (candidate) {
        return node_path_1.default.join(resolved, candidate);
      })
      .find(function (candidate) {
        return node_fs_1.default.existsSync(candidate);
      });
    if (indexFile && isExtensionFile(indexFile)) {
      addCandidate({
        candidates: params.candidates,
        seen: params.seen,
        idHint: node_path_1.default.basename(resolved),
        source: indexFile,
        rootDir: resolved,
        origin: params.origin,
        workspaceDir: params.workspaceDir,
        manifest: manifest,
        packageDir: resolved,
      });
      return;
    }
    discoverInDirectory({
      dir: resolved,
      origin: params.origin,
      workspaceDir: params.workspaceDir,
      candidates: params.candidates,
      diagnostics: params.diagnostics,
      seen: params.seen,
    });
    return;
  }
}
function discoverOpenClawPlugins(params) {
  var _a, _b;
  var candidates = [];
  var diagnostics = [];
  var seen = new Set();
  var workspaceDir = (_a = params.workspaceDir) === null || _a === void 0 ? void 0 : _a.trim();
  var extra = (_b = params.extraPaths) !== null && _b !== void 0 ? _b : [];
  for (var _i = 0, extra_1 = extra; _i < extra_1.length; _i++) {
    var extraPath = extra_1[_i];
    if (typeof extraPath !== "string") {
      continue;
    }
    var trimmed = extraPath.trim();
    if (!trimmed) {
      continue;
    }
    discoverFromPath({
      rawPath: trimmed,
      origin: "config",
      workspaceDir:
        (workspaceDir === null || workspaceDir === void 0 ? void 0 : workspaceDir.trim()) ||
        undefined,
      candidates: candidates,
      diagnostics: diagnostics,
      seen: seen,
    });
  }
  if (workspaceDir) {
    var workspaceRoot = (0, utils_js_1.resolveUserPath)(workspaceDir);
    var workspaceExtDirs = [node_path_1.default.join(workspaceRoot, ".openclaw", "extensions")];
    for (var _c = 0, workspaceExtDirs_1 = workspaceExtDirs; _c < workspaceExtDirs_1.length; _c++) {
      var dir = workspaceExtDirs_1[_c];
      discoverInDirectory({
        dir: dir,
        origin: "workspace",
        workspaceDir: workspaceRoot,
        candidates: candidates,
        diagnostics: diagnostics,
        seen: seen,
      });
    }
  }
  var globalDir = node_path_1.default.join((0, utils_js_1.resolveConfigDir)(), "extensions");
  discoverInDirectory({
    dir: globalDir,
    origin: "global",
    candidates: candidates,
    diagnostics: diagnostics,
    seen: seen,
  });
  var bundledDir = (0, bundled_dir_js_1.resolveBundledPluginsDir)();
  if (bundledDir) {
    discoverInDirectory({
      dir: bundledDir,
      origin: "bundled",
      candidates: candidates,
      diagnostics: diagnostics,
      seen: seen,
    });
  }
  return { candidates: candidates, diagnostics: diagnostics };
}
