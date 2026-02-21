"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAuthStorePath = resolveAuthStorePath;
exports.resolveLegacyAuthStorePath = resolveLegacyAuthStorePath;
exports.resolveAuthStorePathForDisplay = resolveAuthStorePathForDisplay;
exports.ensureAuthStoreFile = ensureAuthStoreFile;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var json_file_js_1 = require("../../infra/json-file.js");
var utils_js_1 = require("../../utils.js");
var agent_paths_js_1 = require("../agent-paths.js");
var constants_js_1 = require("./constants.js");
function resolveAuthStorePath(agentDir) {
  var resolved = (0, utils_js_1.resolveUserPath)(
    agentDir !== null && agentDir !== void 0
      ? agentDir
      : (0, agent_paths_js_1.resolveOpenClawAgentDir)(),
  );
  return node_path_1.default.join(resolved, constants_js_1.AUTH_PROFILE_FILENAME);
}
function resolveLegacyAuthStorePath(agentDir) {
  var resolved = (0, utils_js_1.resolveUserPath)(
    agentDir !== null && agentDir !== void 0
      ? agentDir
      : (0, agent_paths_js_1.resolveOpenClawAgentDir)(),
  );
  return node_path_1.default.join(resolved, constants_js_1.LEGACY_AUTH_FILENAME);
}
function resolveAuthStorePathForDisplay(agentDir) {
  var pathname = resolveAuthStorePath(agentDir);
  return pathname.startsWith("~") ? pathname : (0, utils_js_1.resolveUserPath)(pathname);
}
function ensureAuthStoreFile(pathname) {
  if (node_fs_1.default.existsSync(pathname)) {
    return;
  }
  var payload = {
    version: constants_js_1.AUTH_STORE_VERSION,
    profiles: {},
  };
  (0, json_file_js_1.saveJsonFile)(pathname, payload);
}
