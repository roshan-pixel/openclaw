"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readLoggingConfig = readLoggingConfig;
var node_fs_1 = require("node:fs");
var json5_1 = require("json5");
var paths_js_1 = require("../config/paths.js");
function readLoggingConfig() {
  var configPath = (0, paths_js_1.resolveConfigPath)();
  try {
    if (!node_fs_1.default.existsSync(configPath)) {
      return undefined;
    }
    var raw = node_fs_1.default.readFileSync(configPath, "utf-8");
    var parsed = json5_1.default.parse(raw);
    var logging = parsed === null || parsed === void 0 ? void 0 : parsed.logging;
    if (!logging || typeof logging !== "object" || Array.isArray(logging)) {
      return undefined;
    }
    return logging;
  } catch (_a) {
    return undefined;
  }
}
