"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveBundledPluginsDir = resolveBundledPluginsDir;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
function resolveBundledPluginsDir() {
  var _a;
  var override =
    (_a = process.env.OPENCLAW_BUNDLED_PLUGINS_DIR) === null || _a === void 0 ? void 0 : _a.trim();
  if (override) {
    return override;
  }
  // bun --compile: ship a sibling `extensions/` next to the executable.
  try {
    var execDir = node_path_1.default.dirname(process.execPath);
    var sibling = node_path_1.default.join(execDir, "extensions");
    if (node_fs_1.default.existsSync(sibling)) {
      return sibling;
    }
  } catch (_b) {
    // ignore
  }
  // npm/dev: walk up from this module to find `extensions/` at the package root.
  try {
    var cursor = node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url));
    for (var i = 0; i < 6; i += 1) {
      var candidate = node_path_1.default.join(cursor, "extensions");
      if (node_fs_1.default.existsSync(candidate)) {
        return candidate;
      }
      var parent_1 = node_path_1.default.dirname(cursor);
      if (parent_1 === cursor) {
        break;
      }
      cursor = parent_1;
    }
  } catch (_c) {
    // ignore
  }
  return undefined;
}
