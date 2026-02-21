"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetCliCredentialCachesForTest = resetCliCredentialCachesForTest;
exports.readClaudeCliCredentials = readClaudeCliCredentials;
exports.readClaudeCliCredentialsCached = readClaudeCliCredentialsCached;
exports.writeClaudeCliKeychainCredentials = writeClaudeCliKeychainCredentials;
exports.writeClaudeCliFileCredentials = writeClaudeCliFileCredentials;
exports.writeClaudeCliCredentials = writeClaudeCliCredentials;
exports.readCodexCliCredentials = readCodexCliCredentials;
exports.readCodexCliCredentialsCached = readCodexCliCredentialsCached;
exports.readQwenCliCredentialsCached = readQwenCliCredentialsCached;
var node_child_process_1 = require("node:child_process");
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var json_file_js_1 = require("../infra/json-file.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var utils_js_1 = require("../utils.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("agents/auth-profiles");
var CLAUDE_CLI_CREDENTIALS_RELATIVE_PATH = ".claude/.credentials.json";
var CODEX_CLI_AUTH_FILENAME = "auth.json";
var QWEN_CLI_CREDENTIALS_RELATIVE_PATH = ".qwen/oauth_creds.json";
var CLAUDE_CLI_KEYCHAIN_SERVICE = "Claude Code-credentials";
var CLAUDE_CLI_KEYCHAIN_ACCOUNT = "Claude Code";
var claudeCliCache = null;
var codexCliCache = null;
var qwenCliCache = null;
function resetCliCredentialCachesForTest() {
  claudeCliCache = null;
  codexCliCache = null;
  qwenCliCache = null;
}
function resolveClaudeCliCredentialsPath(homeDir) {
  var baseDir =
    homeDir !== null && homeDir !== void 0 ? homeDir : (0, utils_js_1.resolveUserPath)("~");
  return node_path_1.default.join(baseDir, CLAUDE_CLI_CREDENTIALS_RELATIVE_PATH);
}
function resolveCodexCliAuthPath() {
  return node_path_1.default.join(resolveCodexHomePath(), CODEX_CLI_AUTH_FILENAME);
}
function resolveCodexHomePath() {
  var configured = process.env.CODEX_HOME;
  var home = configured
    ? (0, utils_js_1.resolveUserPath)(configured)
    : (0, utils_js_1.resolveUserPath)("~/.codex");
  try {
    return node_fs_1.default.realpathSync.native(home);
  } catch (_a) {
    return home;
  }
}
function resolveQwenCliCredentialsPath(homeDir) {
  var baseDir =
    homeDir !== null && homeDir !== void 0 ? homeDir : (0, utils_js_1.resolveUserPath)("~");
  return node_path_1.default.join(baseDir, QWEN_CLI_CREDENTIALS_RELATIVE_PATH);
}
function computeCodexKeychainAccount(codexHome) {
  var hash = (0, node_crypto_1.createHash)("sha256").update(codexHome).digest("hex");
  return "cli|".concat(hash.slice(0, 16));
}
function readCodexKeychainCredentials(options) {
  var _a, _b;
  var platform =
    (_a = options === null || options === void 0 ? void 0 : options.platform) !== null &&
    _a !== void 0
      ? _a
      : process.platform;
  if (platform !== "darwin") {
    return null;
  }
  var execSyncImpl =
    (_b = options === null || options === void 0 ? void 0 : options.execSync) !== null &&
    _b !== void 0
      ? _b
      : node_child_process_1.execSync;
  var codexHome = resolveCodexHomePath();
  var account = computeCodexKeychainAccount(codexHome);
  try {
    var secret = execSyncImpl(
      'security find-generic-password -s "Codex Auth" -a "'.concat(account, '" -w'),
      {
        encoding: "utf8",
        timeout: 5000,
        stdio: ["pipe", "pipe", "pipe"],
      },
    ).trim();
    var parsed = JSON.parse(secret);
    var tokens = parsed.tokens;
    var accessToken = tokens === null || tokens === void 0 ? void 0 : tokens.access_token;
    var refreshToken = tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token;
    if (typeof accessToken !== "string" || !accessToken) {
      return null;
    }
    if (typeof refreshToken !== "string" || !refreshToken) {
      return null;
    }
    // No explicit expiry stored; treat as fresh for an hour from last_refresh or now.
    var lastRefreshRaw = parsed.last_refresh;
    var lastRefresh =
      typeof lastRefreshRaw === "string" || typeof lastRefreshRaw === "number"
        ? new Date(lastRefreshRaw).getTime()
        : Date.now();
    var expires = Number.isFinite(lastRefresh)
      ? lastRefresh + 60 * 60 * 1000
      : Date.now() + 60 * 60 * 1000;
    var accountId =
      typeof (tokens === null || tokens === void 0 ? void 0 : tokens.account_id) === "string"
        ? tokens.account_id
        : undefined;
    log.info("read codex credentials from keychain", {
      source: "keychain",
      expires: new Date(expires).toISOString(),
    });
    return {
      type: "oauth",
      provider: "openai-codex",
      access: accessToken,
      refresh: refreshToken,
      expires: expires,
      accountId: accountId,
    };
  } catch (_c) {
    return null;
  }
}
function readQwenCliCredentials(options) {
  var credPath = resolveQwenCliCredentialsPath(
    options === null || options === void 0 ? void 0 : options.homeDir,
  );
  var raw = (0, json_file_js_1.loadJsonFile)(credPath);
  if (!raw || typeof raw !== "object") {
    return null;
  }
  var data = raw;
  var accessToken = data.access_token;
  var refreshToken = data.refresh_token;
  var expiresAt = data.expiry_date;
  if (typeof accessToken !== "string" || !accessToken) {
    return null;
  }
  if (typeof refreshToken !== "string" || !refreshToken) {
    return null;
  }
  if (typeof expiresAt !== "number" || !Number.isFinite(expiresAt)) {
    return null;
  }
  return {
    type: "oauth",
    provider: "qwen-portal",
    access: accessToken,
    refresh: refreshToken,
    expires: expiresAt,
  };
}
function readClaudeCliKeychainCredentials(execSyncImpl) {
  if (execSyncImpl === void 0) {
    execSyncImpl = node_child_process_1.execSync;
  }
  try {
    var result = execSyncImpl(
      'security find-generic-password -s "'.concat(CLAUDE_CLI_KEYCHAIN_SERVICE, '" -w'),
      { encoding: "utf8", timeout: 5000, stdio: ["pipe", "pipe", "pipe"] },
    );
    var data = JSON.parse(result.trim());
    var claudeOauth = data === null || data === void 0 ? void 0 : data.claudeAiOauth;
    if (!claudeOauth || typeof claudeOauth !== "object") {
      return null;
    }
    var accessToken = claudeOauth.accessToken;
    var refreshToken = claudeOauth.refreshToken;
    var expiresAt = claudeOauth.expiresAt;
    if (typeof accessToken !== "string" || !accessToken) {
      return null;
    }
    if (typeof expiresAt !== "number" || expiresAt <= 0) {
      return null;
    }
    if (typeof refreshToken === "string" && refreshToken) {
      return {
        type: "oauth",
        provider: "anthropic",
        access: accessToken,
        refresh: refreshToken,
        expires: expiresAt,
      };
    }
    return {
      type: "token",
      provider: "anthropic",
      token: accessToken,
      expires: expiresAt,
    };
  } catch (_a) {
    return null;
  }
}
function readClaudeCliCredentials(options) {
  var _a;
  var platform =
    (_a = options === null || options === void 0 ? void 0 : options.platform) !== null &&
    _a !== void 0
      ? _a
      : process.platform;
  if (
    platform === "darwin" &&
    (options === null || options === void 0 ? void 0 : options.allowKeychainPrompt) !== false
  ) {
    var keychainCreds = readClaudeCliKeychainCredentials(
      options === null || options === void 0 ? void 0 : options.execSync,
    );
    if (keychainCreds) {
      log.info("read anthropic credentials from claude cli keychain", {
        type: keychainCreds.type,
      });
      return keychainCreds;
    }
  }
  var credPath = resolveClaudeCliCredentialsPath(
    options === null || options === void 0 ? void 0 : options.homeDir,
  );
  var raw = (0, json_file_js_1.loadJsonFile)(credPath);
  if (!raw || typeof raw !== "object") {
    return null;
  }
  var data = raw;
  var claudeOauth = data.claudeAiOauth;
  if (!claudeOauth || typeof claudeOauth !== "object") {
    return null;
  }
  var accessToken = claudeOauth.accessToken;
  var refreshToken = claudeOauth.refreshToken;
  var expiresAt = claudeOauth.expiresAt;
  if (typeof accessToken !== "string" || !accessToken) {
    return null;
  }
  if (typeof expiresAt !== "number" || expiresAt <= 0) {
    return null;
  }
  if (typeof refreshToken === "string" && refreshToken) {
    return {
      type: "oauth",
      provider: "anthropic",
      access: accessToken,
      refresh: refreshToken,
      expires: expiresAt,
    };
  }
  return {
    type: "token",
    provider: "anthropic",
    token: accessToken,
    expires: expiresAt,
  };
}
function readClaudeCliCredentialsCached(options) {
  var _a;
  var ttlMs =
    (_a = options === null || options === void 0 ? void 0 : options.ttlMs) !== null && _a !== void 0
      ? _a
      : 0;
  var now = Date.now();
  var cacheKey = resolveClaudeCliCredentialsPath(
    options === null || options === void 0 ? void 0 : options.homeDir,
  );
  if (
    ttlMs > 0 &&
    claudeCliCache &&
    claudeCliCache.cacheKey === cacheKey &&
    now - claudeCliCache.readAt < ttlMs
  ) {
    return claudeCliCache.value;
  }
  var value = readClaudeCliCredentials({
    allowKeychainPrompt:
      options === null || options === void 0 ? void 0 : options.allowKeychainPrompt,
    platform: options === null || options === void 0 ? void 0 : options.platform,
    homeDir: options === null || options === void 0 ? void 0 : options.homeDir,
    execSync: options === null || options === void 0 ? void 0 : options.execSync,
  });
  if (ttlMs > 0) {
    claudeCliCache = { value: value, readAt: now, cacheKey: cacheKey };
  }
  return value;
}
function writeClaudeCliKeychainCredentials(newCredentials, options) {
  var _a;
  var execSyncImpl =
    (_a = options === null || options === void 0 ? void 0 : options.execSync) !== null &&
    _a !== void 0
      ? _a
      : node_child_process_1.execSync;
  try {
    var existingResult = execSyncImpl(
      'security find-generic-password -s "'.concat(CLAUDE_CLI_KEYCHAIN_SERVICE, '" -w 2>/dev/null'),
      { encoding: "utf8", timeout: 5000, stdio: ["pipe", "pipe", "pipe"] },
    );
    var existingData = JSON.parse(existingResult.trim());
    var existingOauth =
      existingData === null || existingData === void 0 ? void 0 : existingData.claudeAiOauth;
    if (!existingOauth || typeof existingOauth !== "object") {
      return false;
    }
    existingData.claudeAiOauth = __assign(__assign({}, existingOauth), {
      accessToken: newCredentials.access,
      refreshToken: newCredentials.refresh,
      expiresAt: newCredentials.expires,
    });
    var newValue = JSON.stringify(existingData);
    execSyncImpl(
      'security add-generic-password -U -s "'
        .concat(CLAUDE_CLI_KEYCHAIN_SERVICE, '" -a "')
        .concat(CLAUDE_CLI_KEYCHAIN_ACCOUNT, "\" -w '")
        .concat(newValue.replace(/'/g, "'\"'\"'"), "'"),
      { encoding: "utf8", timeout: 5000, stdio: ["pipe", "pipe", "pipe"] },
    );
    log.info("wrote refreshed credentials to claude cli keychain", {
      expires: new Date(newCredentials.expires).toISOString(),
    });
    return true;
  } catch (error) {
    log.warn("failed to write credentials to claude cli keychain", {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
function writeClaudeCliFileCredentials(newCredentials, options) {
  var credPath = resolveClaudeCliCredentialsPath(
    options === null || options === void 0 ? void 0 : options.homeDir,
  );
  if (!node_fs_1.default.existsSync(credPath)) {
    return false;
  }
  try {
    var raw = (0, json_file_js_1.loadJsonFile)(credPath);
    if (!raw || typeof raw !== "object") {
      return false;
    }
    var data = raw;
    var existingOauth = data.claudeAiOauth;
    if (!existingOauth || typeof existingOauth !== "object") {
      return false;
    }
    data.claudeAiOauth = __assign(__assign({}, existingOauth), {
      accessToken: newCredentials.access,
      refreshToken: newCredentials.refresh,
      expiresAt: newCredentials.expires,
    });
    (0, json_file_js_1.saveJsonFile)(credPath, data);
    log.info("wrote refreshed credentials to claude cli file", {
      expires: new Date(newCredentials.expires).toISOString(),
    });
    return true;
  } catch (error) {
    log.warn("failed to write credentials to claude cli file", {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
function writeClaudeCliCredentials(newCredentials, options) {
  var _a, _b, _c;
  var platform =
    (_a = options === null || options === void 0 ? void 0 : options.platform) !== null &&
    _a !== void 0
      ? _a
      : process.platform;
  var writeKeychain =
    (_b = options === null || options === void 0 ? void 0 : options.writeKeychain) !== null &&
    _b !== void 0
      ? _b
      : writeClaudeCliKeychainCredentials;
  var writeFile =
    (_c = options === null || options === void 0 ? void 0 : options.writeFile) !== null &&
    _c !== void 0
      ? _c
      : function (credentials, fileOptions) {
          return writeClaudeCliFileCredentials(credentials, fileOptions);
        };
  if (platform === "darwin") {
    var didWriteKeychain = writeKeychain(newCredentials);
    if (didWriteKeychain) {
      return true;
    }
  }
  return writeFile(newCredentials, {
    homeDir: options === null || options === void 0 ? void 0 : options.homeDir,
  });
}
function readCodexCliCredentials(options) {
  var keychain = readCodexKeychainCredentials({
    platform: options === null || options === void 0 ? void 0 : options.platform,
    execSync: options === null || options === void 0 ? void 0 : options.execSync,
  });
  if (keychain) {
    return keychain;
  }
  var authPath = resolveCodexCliAuthPath();
  var raw = (0, json_file_js_1.loadJsonFile)(authPath);
  if (!raw || typeof raw !== "object") {
    return null;
  }
  var data = raw;
  var tokens = data.tokens;
  if (!tokens || typeof tokens !== "object") {
    return null;
  }
  var accessToken = tokens.access_token;
  var refreshToken = tokens.refresh_token;
  if (typeof accessToken !== "string" || !accessToken) {
    return null;
  }
  if (typeof refreshToken !== "string" || !refreshToken) {
    return null;
  }
  var expires;
  try {
    var stat = node_fs_1.default.statSync(authPath);
    expires = stat.mtimeMs + 60 * 60 * 1000;
  } catch (_a) {
    expires = Date.now() + 60 * 60 * 1000;
  }
  return {
    type: "oauth",
    provider: "openai-codex",
    access: accessToken,
    refresh: refreshToken,
    expires: expires,
    accountId: typeof tokens.account_id === "string" ? tokens.account_id : undefined,
  };
}
function readCodexCliCredentialsCached(options) {
  var _a, _b;
  var ttlMs =
    (_a = options === null || options === void 0 ? void 0 : options.ttlMs) !== null && _a !== void 0
      ? _a
      : 0;
  var now = Date.now();
  var cacheKey = ""
    .concat(
      (_b = options === null || options === void 0 ? void 0 : options.platform) !== null &&
        _b !== void 0
        ? _b
        : process.platform,
      "|",
    )
    .concat(resolveCodexCliAuthPath());
  if (
    ttlMs > 0 &&
    codexCliCache &&
    codexCliCache.cacheKey === cacheKey &&
    now - codexCliCache.readAt < ttlMs
  ) {
    return codexCliCache.value;
  }
  var value = readCodexCliCredentials({
    platform: options === null || options === void 0 ? void 0 : options.platform,
    execSync: options === null || options === void 0 ? void 0 : options.execSync,
  });
  if (ttlMs > 0) {
    codexCliCache = { value: value, readAt: now, cacheKey: cacheKey };
  }
  return value;
}
function readQwenCliCredentialsCached(options) {
  var _a;
  var ttlMs =
    (_a = options === null || options === void 0 ? void 0 : options.ttlMs) !== null && _a !== void 0
      ? _a
      : 0;
  var now = Date.now();
  var cacheKey = resolveQwenCliCredentialsPath(
    options === null || options === void 0 ? void 0 : options.homeDir,
  );
  if (
    ttlMs > 0 &&
    qwenCliCache &&
    qwenCliCache.cacheKey === cacheKey &&
    now - qwenCliCache.readAt < ttlMs
  ) {
    return qwenCliCache.value;
  }
  var value = readQwenCliCredentials({
    homeDir: options === null || options === void 0 ? void 0 : options.homeDir,
  });
  if (ttlMs > 0) {
    qwenCliCache = { value: value, readAt: now, cacheKey: cacheKey };
  }
  return value;
}
