"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePluginSkillDirs = resolvePluginSkillDirs;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var subsystem_js_1 = require("../../logging/subsystem.js");
var config_state_js_1 = require("../../plugins/config-state.js");
var manifest_registry_js_1 = require("../../plugins/manifest-registry.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("skills");
function resolvePluginSkillDirs(params) {
  var _a;
  var workspaceDir = params.workspaceDir.trim();
  if (!workspaceDir) return [];
  var registry = (0, manifest_registry_js_1.loadPluginManifestRegistry)({
    workspaceDir: workspaceDir,
    config: params.config,
  });
  if (registry.plugins.length === 0) return [];
  var normalizedPlugins = (0, config_state_js_1.normalizePluginsConfig)(
    (_a = params.config) === null || _a === void 0 ? void 0 : _a.plugins,
  );
  var memorySlot = normalizedPlugins.slots.memory;
  var selectedMemoryPluginId = null;
  var seen = new Set();
  var resolved = [];
  for (var _i = 0, _b = registry.plugins; _i < _b.length; _i++) {
    var record = _b[_i];
    if (!record.skills || record.skills.length === 0) continue;
    var enableState = (0, config_state_js_1.resolveEnableState)(
      record.id,
      record.origin,
      normalizedPlugins,
    );
    if (!enableState.enabled) continue;
    var memoryDecision = (0, config_state_js_1.resolveMemorySlotDecision)({
      id: record.id,
      kind: record.kind,
      slot: memorySlot,
      selectedId: selectedMemoryPluginId,
    });
    if (!memoryDecision.enabled) continue;
    if (memoryDecision.selected && record.kind === "memory") {
      selectedMemoryPluginId = record.id;
    }
    for (var _c = 0, _d = record.skills; _c < _d.length; _c++) {
      var raw = _d[_c];
      var trimmed = raw.trim();
      if (!trimmed) continue;
      var candidate = node_path_1.default.resolve(record.rootDir, trimmed);
      if (!node_fs_1.default.existsSync(candidate)) {
        log.warn("plugin skill path not found (".concat(record.id, "): ").concat(candidate));
        continue;
      }
      if (seen.has(candidate)) continue;
      seen.add(candidate);
      resolved.push(candidate);
    }
  }
  return resolved;
}
