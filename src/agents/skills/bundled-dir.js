"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveBundledSkillsDir = resolveBundledSkillsDir;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
function resolveBundledSkillsDir() {
  var _a;
  var override =
    (_a = process.env.OPENCLAW_BUNDLED_SKILLS_DIR) === null || _a === void 0 ? void 0 : _a.trim();
  if (override) return override;
  // bun --compile: ship a sibling `skills/` next to the executable.
  try {
    var execDir = node_path_1.default.dirname(process.execPath);
    var sibling = node_path_1.default.join(execDir, "skills");
    if (node_fs_1.default.existsSync(sibling)) return sibling;
  } catch (_b) {
    // ignore
  }
  // npm/dev: resolve `<packageRoot>/skills` relative to this module.
  try {
    var moduleDir = node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url));
    var root = node_path_1.default.resolve(moduleDir, "..", "..", "..");
    var candidate = node_path_1.default.join(root, "skills");
    if (node_fs_1.default.existsSync(candidate)) return candidate;
  } catch (_c) {
    // ignore
  }
  return undefined;
}
