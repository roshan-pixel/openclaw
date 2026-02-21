"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log =
  exports.EXTERNAL_CLI_NEAR_EXPIRY_MS =
  exports.EXTERNAL_CLI_SYNC_TTL_MS =
  exports.AUTH_STORE_LOCK_OPTIONS =
  exports.QWEN_CLI_PROFILE_ID =
  exports.CODEX_CLI_PROFILE_ID =
  exports.CLAUDE_CLI_PROFILE_ID =
  exports.LEGACY_AUTH_FILENAME =
  exports.AUTH_PROFILE_FILENAME =
  exports.AUTH_STORE_VERSION =
    void 0;
var subsystem_js_1 = require("../../logging/subsystem.js");
exports.AUTH_STORE_VERSION = 1;
exports.AUTH_PROFILE_FILENAME = "auth-profiles.json";
exports.LEGACY_AUTH_FILENAME = "auth.json";
exports.CLAUDE_CLI_PROFILE_ID = "anthropic:claude-cli";
exports.CODEX_CLI_PROFILE_ID = "openai-codex:codex-cli";
exports.QWEN_CLI_PROFILE_ID = "qwen-portal:qwen-cli";
exports.AUTH_STORE_LOCK_OPTIONS = {
  retries: {
    retries: 10,
    factor: 2,
    minTimeout: 100,
    maxTimeout: 10000,
    randomize: true,
  },
  stale: 30000,
};
exports.EXTERNAL_CLI_SYNC_TTL_MS = 15 * 60 * 1000;
exports.EXTERNAL_CLI_NEAR_EXPIRY_MS = 10 * 60 * 1000;
exports.log = (0, subsystem_js_1.createSubsystemLogger)("agents/auth-profiles");
