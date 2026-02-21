"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) {
            throw t[1];
          }
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) {
        throw new TypeError("Generator is already executing.");
      }
      while ((g && ((g = 0), op[0] && (_ = 0)), _)) {
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      }
      if (op[0] & 5) {
        throw op[1];
      }
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.WA_WEB_AUTH_DIR = void 0;
exports.resolveDefaultWebAuthDir = resolveDefaultWebAuthDir;
exports.resolveWebCredsPath = resolveWebCredsPath;
exports.resolveWebCredsBackupPath = resolveWebCredsBackupPath;
exports.hasWebCredsSync = hasWebCredsSync;
exports.maybeRestoreCredsFromBackup = maybeRestoreCredsFromBackup;
exports.webAuthExists = webAuthExists;
exports.logoutWeb = logoutWeb;
exports.readWebSelfId = readWebSelfId;
exports.getWebAuthAgeMs = getWebAuthAgeMs;
exports.logWebSelfId = logWebSelfId;
exports.pickWebChannel = pickWebChannel;
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var paths_js_1 = require("../config/paths.js");
var globals_js_1 = require("../globals.js");
var logging_js_1 = require("../logging.js");
var session_key_js_1 = require("../routing/session-key.js");
var runtime_js_1 = require("../runtime.js");
var command_format_js_1 = require("../cli/command-format.js");
var utils_js_1 = require("../utils.js");
function resolveDefaultWebAuthDir() {
  return node_path_1.default.join(
    (0, paths_js_1.resolveOAuthDir)(),
    "whatsapp",
    session_key_js_1.DEFAULT_ACCOUNT_ID,
  );
}
exports.WA_WEB_AUTH_DIR = resolveDefaultWebAuthDir();
function resolveWebCredsPath(authDir) {
  return node_path_1.default.join(authDir, "creds.json");
}
function resolveWebCredsBackupPath(authDir) {
  return node_path_1.default.join(authDir, "creds.json.bak");
}
function hasWebCredsSync(authDir) {
  try {
    var stats = node_fs_1.default.statSync(resolveWebCredsPath(authDir));
    return stats.isFile() && stats.size > 1;
  } catch (_a) {
    return false;
  }
}
function readCredsJsonRaw(filePath) {
  try {
    if (!node_fs_1.default.existsSync(filePath)) {
      return null;
    }
    var stats = node_fs_1.default.statSync(filePath);
    if (!stats.isFile() || stats.size <= 1) {
      return null;
    }
    return node_fs_1.default.readFileSync(filePath, "utf-8");
  } catch (_a) {
    return null;
  }
}
function maybeRestoreCredsFromBackup(authDir) {
  var logger = (0, logging_js_1.getChildLogger)({ module: "web-session" });
  try {
    var credsPath = resolveWebCredsPath(authDir);
    var backupPath = resolveWebCredsBackupPath(authDir);
    var raw = readCredsJsonRaw(credsPath);
    if (raw) {
      // Validate that creds.json is parseable.
      JSON.parse(raw);
      return;
    }
    var backupRaw = readCredsJsonRaw(backupPath);
    if (!backupRaw) {
      return;
    }
    // Ensure backup is parseable before restoring.
    JSON.parse(backupRaw);
    node_fs_1.default.copyFileSync(backupPath, credsPath);
    logger.warn({ credsPath: credsPath }, "restored corrupted WhatsApp creds.json from backup");
  } catch (_a) {
    // ignore
  }
}
function webAuthExists() {
  return __awaiter(this, arguments, void 0, function (authDir) {
    var resolvedAuthDir, credsPath, _a, stats, raw, _b;
    if (authDir === void 0) {
      authDir = resolveDefaultWebAuthDir();
    }
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          resolvedAuthDir = (0, utils_js_1.resolveUserPath)(authDir);
          maybeRestoreCredsFromBackup(resolvedAuthDir);
          credsPath = resolveWebCredsPath(resolvedAuthDir);
          _c.label = 1;
        case 1:
          _c.trys.push([1, 3, , 4]);
          return [4 /*yield*/, promises_1.default.access(resolvedAuthDir)];
        case 2:
          _c.sent();
          return [3 /*break*/, 4];
        case 3:
          _a = _c.sent();
          return [2 /*return*/, false];
        case 4:
          _c.trys.push([4, 7, , 8]);
          return [4 /*yield*/, promises_1.default.stat(credsPath)];
        case 5:
          stats = _c.sent();
          if (!stats.isFile() || stats.size <= 1) {
            return [2 /*return*/, false];
          }
          return [4 /*yield*/, promises_1.default.readFile(credsPath, "utf-8")];
        case 6:
          raw = _c.sent();
          JSON.parse(raw);
          return [2 /*return*/, true];
        case 7:
          _b = _c.sent();
          return [2 /*return*/, false];
        case 8:
          return [2 /*return*/];
      }
    });
  });
}
function clearLegacyBaileysAuthState(authDir) {
  return __awaiter(this, void 0, void 0, function () {
    var entries, shouldDelete;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, promises_1.default.readdir(authDir, { withFileTypes: true })];
        case 1:
          entries = _a.sent();
          shouldDelete = function (name) {
            if (name === "oauth.json") {
              return false;
            }
            if (name === "creds.json" || name === "creds.json.bak") {
              return true;
            }
            if (!name.endsWith(".json")) {
              return false;
            }
            return /^(app-state-sync|session|sender-key|pre-key)-/.test(name);
          };
          return [
            4 /*yield*/,
            Promise.all(
              entries.map(function (entry) {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        if (!entry.isFile()) {
                          return [2 /*return*/];
                        }
                        if (!shouldDelete(entry.name)) {
                          return [2 /*return*/];
                        }
                        return [
                          4 /*yield*/,
                          promises_1.default.rm(node_path_1.default.join(authDir, entry.name), {
                            force: true,
                          }),
                        ];
                      case 1:
                        _a.sent();
                        return [2 /*return*/];
                    }
                  });
                });
              }),
            ),
          ];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function logoutWeb(params) {
  return __awaiter(this, void 0, void 0, function () {
    var runtime, resolvedAuthDir, exists;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          runtime =
            (_a = params.runtime) !== null && _a !== void 0 ? _a : runtime_js_1.defaultRuntime;
          resolvedAuthDir = (0, utils_js_1.resolveUserPath)(
            (_b = params.authDir) !== null && _b !== void 0 ? _b : resolveDefaultWebAuthDir(),
          );
          return [4 /*yield*/, webAuthExists(resolvedAuthDir)];
        case 1:
          exists = _c.sent();
          if (!exists) {
            runtime.log(
              (0, globals_js_1.info)("No WhatsApp Web session found; nothing to delete."),
            );
            return [2 /*return*/, false];
          }
          if (!params.isLegacyAuthDir) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, clearLegacyBaileysAuthState(resolvedAuthDir)];
        case 2:
          _c.sent();
          return [3 /*break*/, 5];
        case 3:
          return [
            4 /*yield*/,
            promises_1.default.rm(resolvedAuthDir, { recursive: true, force: true }),
          ];
        case 4:
          _c.sent();
          _c.label = 5;
        case 5:
          runtime.log((0, globals_js_1.success)("Cleared WhatsApp Web credentials."));
          return [2 /*return*/, true];
      }
    });
  });
}
function readWebSelfId(authDir) {
  var _a, _b;
  if (authDir === void 0) {
    authDir = resolveDefaultWebAuthDir();
  }
  // Read the cached WhatsApp Web identity (jid + E.164) from disk if present.
  try {
    var credsPath = resolveWebCredsPath((0, utils_js_1.resolveUserPath)(authDir));
    if (!node_fs_1.default.existsSync(credsPath)) {
      return { e164: null, jid: null };
    }
    var raw = node_fs_1.default.readFileSync(credsPath, "utf-8");
    var parsed = JSON.parse(raw);
    var jid =
      (_b =
        (_a = parsed === null || parsed === void 0 ? void 0 : parsed.me) === null || _a === void 0
          ? void 0
          : _a.id) !== null && _b !== void 0
        ? _b
        : null;
    var e164 = jid ? (0, utils_js_1.jidToE164)(jid, { authDir: authDir }) : null;
    return { e164: e164, jid: jid };
  } catch (_c) {
    return { e164: null, jid: null };
  }
}
/**
 * Return the age (in milliseconds) of the cached WhatsApp web auth state, or null when missing.
 * Helpful for heartbeats/observability to spot stale credentials.
 */
function getWebAuthAgeMs(authDir) {
  if (authDir === void 0) {
    authDir = resolveDefaultWebAuthDir();
  }
  try {
    var stats = node_fs_1.default.statSync(
      resolveWebCredsPath((0, utils_js_1.resolveUserPath)(authDir)),
    );
    return Date.now() - stats.mtimeMs;
  } catch (_a) {
    return null;
  }
}
function logWebSelfId(authDir, runtime, includeChannelPrefix) {
  if (authDir === void 0) {
    authDir = resolveDefaultWebAuthDir();
  }
  if (runtime === void 0) {
    runtime = runtime_js_1.defaultRuntime;
  }
  if (includeChannelPrefix === void 0) {
    includeChannelPrefix = false;
  }
  // Human-friendly log of the currently linked personal web session.
  var _a = readWebSelfId(authDir),
    e164 = _a.e164,
    jid = _a.jid;
  var details =
    e164 || jid
      ? ""
          .concat(e164 !== null && e164 !== void 0 ? e164 : "unknown")
          .concat(jid ? " (jid ".concat(jid, ")") : "")
      : "unknown";
  var prefix = includeChannelPrefix ? "Web Channel: " : "";
  runtime.log((0, globals_js_1.info)("".concat(prefix).concat(details)));
}
function pickWebChannel(pref_1) {
  return __awaiter(this, arguments, void 0, function (pref, authDir) {
    var choice, hasWeb;
    if (authDir === void 0) {
      authDir = resolveDefaultWebAuthDir();
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          choice = pref === "auto" ? "web" : pref;
          return [4 /*yield*/, webAuthExists(authDir)];
        case 1:
          hasWeb = _a.sent();
          if (!hasWeb) {
            throw new Error(
              "No WhatsApp Web session found. Run `".concat(
                (0, command_format_js_1.formatCliCommand)(
                  "openclaw channels login --channel whatsapp --verbose",
                ),
                "` to link.",
              ),
            );
          }
          return [2 /*return*/, choice];
      }
    });
  });
}
