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
exports.MissingEnvVarError = exports.ConfigIncludeError = exports.CircularIncludeError = void 0;
exports.resolveConfigSnapshotHash = resolveConfigSnapshotHash;
exports.parseConfigJson5 = parseConfigJson5;
exports.createConfigIO = createConfigIO;
exports.loadConfig = loadConfig;
exports.readConfigFileSnapshot = readConfigFileSnapshot;
exports.writeConfigFile = writeConfigFile;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var json5_1 = require("json5");
var shell_env_js_1 = require("../infra/shell-env.js");
var agent_dirs_js_1 = require("./agent-dirs.js");
var defaults_js_1 = require("./defaults.js");
var version_js_1 = require("../version.js");
var env_substitution_js_1 = require("./env-substitution.js");
var env_vars_js_1 = require("./env-vars.js");
var includes_js_1 = require("./includes.js");
var legacy_js_1 = require("./legacy.js");
var normalize_paths_js_1 = require("./normalize-paths.js");
var paths_js_1 = require("./paths.js");
var runtime_overrides_js_1 = require("./runtime-overrides.js");
var validation_js_1 = require("./validation.js");
var version_js_2 = require("./version.js");
// Re-export for backwards compatibility
var includes_js_2 = require("./includes.js");
Object.defineProperty(exports, "CircularIncludeError", {
  enumerable: true,
  get: function () {
    return includes_js_2.CircularIncludeError;
  },
});
Object.defineProperty(exports, "ConfigIncludeError", {
  enumerable: true,
  get: function () {
    return includes_js_2.ConfigIncludeError;
  },
});
var env_substitution_js_2 = require("./env-substitution.js");
Object.defineProperty(exports, "MissingEnvVarError", {
  enumerable: true,
  get: function () {
    return env_substitution_js_2.MissingEnvVarError;
  },
});
var SHELL_ENV_EXPECTED_KEYS = [
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "ANTHROPIC_OAUTH_TOKEN",
  "GEMINI_API_KEY",
  "ZAI_API_KEY",
  "OPENROUTER_API_KEY",
  "AI_GATEWAY_API_KEY",
  "MINIMAX_API_KEY",
  "SYNTHETIC_API_KEY",
  "ELEVENLABS_API_KEY",
  "TELEGRAM_BOT_TOKEN",
  "DISCORD_BOT_TOKEN",
  "SLACK_BOT_TOKEN",
  "SLACK_APP_TOKEN",
  "OPENCLAW_GATEWAY_TOKEN",
  "OPENCLAW_GATEWAY_PASSWORD",
];
var CONFIG_BACKUP_COUNT = 5;
var loggedInvalidConfigs = new Set();
function hashConfigRaw(raw) {
  return node_crypto_1.default
    .createHash("sha256")
    .update(raw !== null && raw !== void 0 ? raw : "")
    .digest("hex");
}
function resolveConfigSnapshotHash(snapshot) {
  if (typeof snapshot.hash === "string") {
    var trimmed = snapshot.hash.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  if (typeof snapshot.raw !== "string") {
    return null;
  }
  return hashConfigRaw(snapshot.raw);
}
function coerceConfig(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value;
}
function rotateConfigBackups(configPath, ioFs) {
  return __awaiter(this, void 0, void 0, function () {
    var backupBase, maxIndex, index;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (CONFIG_BACKUP_COUNT <= 1) {
            return [2 /*return*/];
          }
          backupBase = "".concat(configPath, ".bak");
          maxIndex = CONFIG_BACKUP_COUNT - 1;
          return [
            4 /*yield*/,
            ioFs.unlink("".concat(backupBase, ".").concat(maxIndex)).catch(function () {
              // best-effort
            }),
          ];
        case 1:
          _a.sent();
          index = maxIndex - 1;
          _a.label = 2;
        case 2:
          if (!(index >= 1)) {
            return [3 /*break*/, 5];
          }
          return [
            4 /*yield*/,
            ioFs
              .rename(
                "".concat(backupBase, ".").concat(index),
                "".concat(backupBase, ".").concat(index + 1),
              )
              .catch(function () {
                // best-effort
              }),
          ];
        case 3:
          _a.sent();
          _a.label = 4;
        case 4:
          index -= 1;
          return [3 /*break*/, 2];
        case 5:
          return [
            4 /*yield*/,
            ioFs.rename(backupBase, "".concat(backupBase, ".1")).catch(function () {
              // best-effort
            }),
          ];
        case 6:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function warnOnConfigMiskeys(raw, logger) {
  if (!raw || typeof raw !== "object") {
    return;
  }
  var gateway = raw.gateway;
  if (!gateway || typeof gateway !== "object") {
    return;
  }
  if ("token" in gateway) {
    logger.warn(
      'Config uses "gateway.token". This key is ignored; use "gateway.auth.token" instead.',
    );
  }
}
function stampConfigVersion(cfg) {
  var now = new Date().toISOString();
  return __assign(__assign({}, cfg), {
    meta: __assign(__assign({}, cfg.meta), {
      lastTouchedVersion: version_js_1.VERSION,
      lastTouchedAt: now,
    }),
  });
}
function warnIfConfigFromFuture(cfg, logger) {
  var _a;
  var touched = (_a = cfg.meta) === null || _a === void 0 ? void 0 : _a.lastTouchedVersion;
  if (!touched) {
    return;
  }
  var cmp = (0, version_js_2.compareOpenClawVersions)(version_js_1.VERSION, touched);
  if (cmp === null) {
    return;
  }
  if (cmp < 0) {
    logger.warn(
      "Config was last written by a newer OpenClaw ("
        .concat(touched, "); current version is ")
        .concat(version_js_1.VERSION, "."),
    );
  }
}
function applyConfigEnv(cfg, env) {
  var _a;
  var entries = (0, env_vars_js_1.collectConfigEnvVars)(cfg);
  for (var _i = 0, _b = Object.entries(entries); _i < _b.length; _i++) {
    var _c = _b[_i],
      key = _c[0],
      value = _c[1];
    if ((_a = env[key]) === null || _a === void 0 ? void 0 : _a.trim()) {
      continue;
    }
    env[key] = value;
  }
}
function resolveConfigPathForDeps(deps) {
  if (deps.configPath) {
    return deps.configPath;
  }
  return (0, paths_js_1.resolveConfigPath)(
    deps.env,
    (0, paths_js_1.resolveStateDir)(deps.env, deps.homedir),
  );
}
function normalizeDeps(overrides) {
  var _a, _b, _c, _d, _e, _f;
  if (overrides === void 0) {
    overrides = {};
  }
  return {
    fs: (_a = overrides.fs) !== null && _a !== void 0 ? _a : node_fs_1.default,
    json5: (_b = overrides.json5) !== null && _b !== void 0 ? _b : json5_1.default,
    env: (_c = overrides.env) !== null && _c !== void 0 ? _c : process.env,
    homedir: (_d = overrides.homedir) !== null && _d !== void 0 ? _d : node_os_1.default.homedir,
    configPath: (_e = overrides.configPath) !== null && _e !== void 0 ? _e : "",
    logger: (_f = overrides.logger) !== null && _f !== void 0 ? _f : console,
  };
}
function parseConfigJson5(raw, json5) {
  if (json5 === void 0) {
    json5 = json5_1.default;
  }
  try {
    return { ok: true, parsed: json5.parse(raw) };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
function createConfigIO(overrides) {
  var _a;
  if (overrides === void 0) {
    overrides = {};
  }
  var deps = normalizeDeps(overrides);
  var requestedConfigPath = resolveConfigPathForDeps(deps);
  var candidatePaths = deps.configPath
    ? [requestedConfigPath]
    : (0, paths_js_1.resolveDefaultConfigCandidates)(deps.env, deps.homedir);
  var configPath =
    (_a = candidatePaths.find(function (candidate) {
      return deps.fs.existsSync(candidate);
    })) !== null && _a !== void 0
      ? _a
      : requestedConfigPath;
  function loadConfig() {
    var _a, _b, _c, _d, _e;
    try {
      if (!deps.fs.existsSync(configPath)) {
        if (
          (0, shell_env_js_1.shouldEnableShellEnvFallback)(deps.env) &&
          !(0, shell_env_js_1.shouldDeferShellEnvFallback)(deps.env)
        ) {
          (0, shell_env_js_1.loadShellEnvFallback)({
            enabled: true,
            env: deps.env,
            expectedKeys: SHELL_ENV_EXPECTED_KEYS,
            logger: deps.logger,
            timeoutMs: (0, shell_env_js_1.resolveShellEnvFallbackTimeoutMs)(deps.env),
          });
        }
        return {};
      }
      var raw = deps.fs.readFileSync(configPath, "utf-8");
      var parsed = deps.json5.parse(raw);
      // Resolve $include directives before validation
      var resolved = (0, includes_js_1.resolveConfigIncludes)(parsed, configPath, {
        readFile: function (p) {
          return deps.fs.readFileSync(p, "utf-8");
        },
        parseJson: function (raw) {
          return deps.json5.parse(raw);
        },
      });
      // Apply config.env to process.env BEFORE substitution so ${VAR} can reference config-defined vars
      if (resolved && typeof resolved === "object" && "env" in resolved) {
        applyConfigEnv(resolved, deps.env);
      }
      // Substitute ${VAR} env var references
      var substituted = (0, env_substitution_js_1.resolveConfigEnvVars)(resolved, deps.env);
      var resolvedConfig = substituted;
      warnOnConfigMiskeys(resolvedConfig, deps.logger);
      if (typeof resolvedConfig !== "object" || resolvedConfig === null) {
        return {};
      }
      var preValidationDuplicates = (0, agent_dirs_js_1.findDuplicateAgentDirs)(resolvedConfig, {
        env: deps.env,
        homedir: deps.homedir,
      });
      if (preValidationDuplicates.length > 0) {
        throw new agent_dirs_js_1.DuplicateAgentDirError(preValidationDuplicates);
      }
      var validated = (0, validation_js_1.validateConfigObjectWithPlugins)(resolvedConfig);
      if (!validated.ok) {
        var details = validated.issues
          .map(function (iss) {
            return "- ".concat(iss.path || "<root>", ": ").concat(iss.message);
          })
          .join("\n");
        if (!loggedInvalidConfigs.has(configPath)) {
          loggedInvalidConfigs.add(configPath);
          deps.logger.error("Invalid config at ".concat(configPath, ":\\n").concat(details));
        }
        var error = new Error("Invalid config");
        error.code = "INVALID_CONFIG";
        error.details = details;
        throw error;
      }
      if (validated.warnings.length > 0) {
        var details = validated.warnings
          .map(function (iss) {
            return "- ".concat(iss.path || "<root>", ": ").concat(iss.message);
          })
          .join("\n");
        deps.logger.warn("Config warnings:\\n".concat(details));
      }
      warnIfConfigFromFuture(validated.config, deps.logger);
      var cfg = (0, defaults_js_1.applyModelDefaults)(
        (0, defaults_js_1.applyCompactionDefaults)(
          (0, defaults_js_1.applyContextPruningDefaults)(
            (0, defaults_js_1.applyAgentDefaults)(
              (0, defaults_js_1.applySessionDefaults)(
                (0, defaults_js_1.applyLoggingDefaults)(
                  (0, defaults_js_1.applyMessageDefaults)(validated.config),
                ),
              ),
            ),
          ),
        ),
      );
      (0, normalize_paths_js_1.normalizeConfigPaths)(cfg);
      var duplicates = (0, agent_dirs_js_1.findDuplicateAgentDirs)(cfg, {
        env: deps.env,
        homedir: deps.homedir,
      });
      if (duplicates.length > 0) {
        throw new agent_dirs_js_1.DuplicateAgentDirError(duplicates);
      }
      applyConfigEnv(cfg, deps.env);
      var enabled =
        (0, shell_env_js_1.shouldEnableShellEnvFallback)(deps.env) ||
        ((_b = (_a = cfg.env) === null || _a === void 0 ? void 0 : _a.shellEnv) === null ||
        _b === void 0
          ? void 0
          : _b.enabled) === true;
      if (enabled && !(0, shell_env_js_1.shouldDeferShellEnvFallback)(deps.env)) {
        (0, shell_env_js_1.loadShellEnvFallback)({
          enabled: true,
          env: deps.env,
          expectedKeys: SHELL_ENV_EXPECTED_KEYS,
          logger: deps.logger,
          timeoutMs:
            (_e =
              (_d = (_c = cfg.env) === null || _c === void 0 ? void 0 : _c.shellEnv) === null ||
              _d === void 0
                ? void 0
                : _d.timeoutMs) !== null && _e !== void 0
              ? _e
              : (0, shell_env_js_1.resolveShellEnvFallbackTimeoutMs)(deps.env),
        });
      }
      return (0, runtime_overrides_js_1.applyConfigOverrides)(cfg);
    } catch (err) {
      if (err instanceof agent_dirs_js_1.DuplicateAgentDirError) {
        deps.logger.error(err.message);
        throw err;
      }
      var error = err;
      if ((error === null || error === void 0 ? void 0 : error.code) === "INVALID_CONFIG") {
        return {};
      }
      deps.logger.error("Failed to read config at ".concat(configPath), err);
      return {};
    }
  }
  function readConfigFileSnapshot() {
    return __awaiter(this, void 0, void 0, function () {
      var exists,
        hash,
        config,
        legacyIssues,
        raw,
        hash,
        parsedRes,
        resolved,
        message,
        substituted,
        message,
        resolvedConfigRaw,
        legacyIssues,
        validated;
      return __generator(this, function (_a) {
        exists = deps.fs.existsSync(configPath);
        if (!exists) {
          hash = hashConfigRaw(null);
          config = (0, defaults_js_1.applyTalkApiKey)(
            (0, defaults_js_1.applyModelDefaults)(
              (0, defaults_js_1.applyCompactionDefaults)(
                (0, defaults_js_1.applyContextPruningDefaults)(
                  (0, defaults_js_1.applyAgentDefaults)(
                    (0, defaults_js_1.applySessionDefaults)(
                      (0, defaults_js_1.applyMessageDefaults)({}),
                    ),
                  ),
                ),
              ),
            ),
          );
          legacyIssues = [];
          return [
            2 /*return*/,
            {
              path: configPath,
              exists: false,
              raw: null,
              parsed: {},
              valid: true,
              config: config,
              hash: hash,
              issues: [],
              warnings: [],
              legacyIssues: legacyIssues,
            },
          ];
        }
        try {
          raw = deps.fs.readFileSync(configPath, "utf-8");
          hash = hashConfigRaw(raw);
          parsedRes = parseConfigJson5(raw, deps.json5);
          if (!parsedRes.ok) {
            return [
              2 /*return*/,
              {
                path: configPath,
                exists: true,
                raw: raw,
                parsed: {},
                valid: false,
                config: {},
                hash: hash,
                issues: [{ path: "", message: "JSON5 parse failed: ".concat(parsedRes.error) }],
                warnings: [],
                legacyIssues: [],
              },
            ];
          }
          resolved = void 0;
          try {
            resolved = (0, includes_js_1.resolveConfigIncludes)(parsedRes.parsed, configPath, {
              readFile: function (p) {
                return deps.fs.readFileSync(p, "utf-8");
              },
              parseJson: function (raw) {
                return deps.json5.parse(raw);
              },
            });
          } catch (err) {
            message =
              err instanceof includes_js_1.ConfigIncludeError
                ? err.message
                : "Include resolution failed: ".concat(String(err));
            return [
              2 /*return*/,
              {
                path: configPath,
                exists: true,
                raw: raw,
                parsed: parsedRes.parsed,
                valid: false,
                config: coerceConfig(parsedRes.parsed),
                hash: hash,
                issues: [{ path: "", message: message }],
                warnings: [],
                legacyIssues: [],
              },
            ];
          }
          // Apply config.env to process.env BEFORE substitution so ${VAR} can reference config-defined vars
          if (resolved && typeof resolved === "object" && "env" in resolved) {
            applyConfigEnv(resolved, deps.env);
          }
          substituted = void 0;
          try {
            substituted = (0, env_substitution_js_1.resolveConfigEnvVars)(resolved, deps.env);
          } catch (err) {
            message =
              err instanceof env_substitution_js_1.MissingEnvVarError
                ? err.message
                : "Env var substitution failed: ".concat(String(err));
            return [
              2 /*return*/,
              {
                path: configPath,
                exists: true,
                raw: raw,
                parsed: parsedRes.parsed,
                valid: false,
                config: coerceConfig(resolved),
                hash: hash,
                issues: [{ path: "", message: message }],
                warnings: [],
                legacyIssues: [],
              },
            ];
          }
          resolvedConfigRaw = substituted;
          legacyIssues = (0, legacy_js_1.findLegacyConfigIssues)(resolvedConfigRaw);
          validated = (0, validation_js_1.validateConfigObjectWithPlugins)(resolvedConfigRaw);
          if (!validated.ok) {
            return [
              2 /*return*/,
              {
                path: configPath,
                exists: true,
                raw: raw,
                parsed: parsedRes.parsed,
                valid: false,
                config: coerceConfig(resolvedConfigRaw),
                hash: hash,
                issues: validated.issues,
                warnings: validated.warnings,
                legacyIssues: legacyIssues,
              },
            ];
          }
          warnIfConfigFromFuture(validated.config, deps.logger);
          return [
            2 /*return*/,
            {
              path: configPath,
              exists: true,
              raw: raw,
              parsed: parsedRes.parsed,
              valid: true,
              config: (0, normalize_paths_js_1.normalizeConfigPaths)(
                (0, defaults_js_1.applyTalkApiKey)(
                  (0, defaults_js_1.applyModelDefaults)(
                    (0, defaults_js_1.applyAgentDefaults)(
                      (0, defaults_js_1.applySessionDefaults)(
                        (0, defaults_js_1.applyLoggingDefaults)(
                          (0, defaults_js_1.applyMessageDefaults)(validated.config),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              hash: hash,
              issues: [],
              warnings: validated.warnings,
              legacyIssues: legacyIssues,
            },
          ];
        } catch (err) {
          return [
            2 /*return*/,
            {
              path: configPath,
              exists: true,
              raw: null,
              parsed: {},
              valid: false,
              config: {},
              hash: hashConfigRaw(null),
              issues: [{ path: "", message: "read failed: ".concat(String(err)) }],
              warnings: [],
              legacyIssues: [],
            },
          ];
        }
        return [2 /*return*/];
      });
    });
  }
  function writeConfigFile(cfg) {
    return __awaiter(this, void 0, void 0, function () {
      var validated, issue, pathLabel, details, dir, json, tmp, err_1, code;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            clearConfigCache();
            validated = (0, validation_js_1.validateConfigObjectWithPlugins)(cfg);
            if (!validated.ok) {
              issue = validated.issues[0];
              pathLabel = (issue === null || issue === void 0 ? void 0 : issue.path)
                ? issue.path
                : "<root>";
              throw new Error(
                "Config validation failed: "
                  .concat(pathLabel, ": ")
                  .concat(
                    (_a = issue === null || issue === void 0 ? void 0 : issue.message) !== null &&
                      _a !== void 0
                      ? _a
                      : "invalid",
                  ),
              );
            }
            if (validated.warnings.length > 0) {
              details = validated.warnings
                .map(function (warning) {
                  return "- ".concat(warning.path, ": ").concat(warning.message);
                })
                .join("\n");
              deps.logger.warn("Config warnings:\n".concat(details));
            }
            dir = node_path_1.default.dirname(configPath);
            return [4 /*yield*/, deps.fs.promises.mkdir(dir, { recursive: true, mode: 448 })];
          case 1:
            _b.sent();
            json = JSON.stringify(
              (0, defaults_js_1.applyModelDefaults)(stampConfigVersion(cfg)),
              null,
              2,
            )
              .trimEnd()
              .concat("\n");
            tmp = node_path_1.default.join(
              dir,
              ""
                .concat(node_path_1.default.basename(configPath), ".")
                .concat(process.pid, ".")
                .concat(node_crypto_1.default.randomUUID(), ".tmp"),
            );
            return [
              4 /*yield*/,
              deps.fs.promises.writeFile(tmp, json, {
                encoding: "utf-8",
                mode: 384,
              }),
            ];
          case 2:
            _b.sent();
            if (!deps.fs.existsSync(configPath)) {
              return [3 /*break*/, 5];
            }
            return [4 /*yield*/, rotateConfigBackups(configPath, deps.fs.promises)];
          case 3:
            _b.sent();
            return [
              4 /*yield*/,
              deps.fs.promises
                .copyFile(configPath, "".concat(configPath, ".bak"))
                .catch(function () {
                  // best-effort
                }),
            ];
          case 4:
            _b.sent();
            _b.label = 5;
          case 5:
            _b.trys.push([5, 7, , 13]);
            return [4 /*yield*/, deps.fs.promises.rename(tmp, configPath)];
          case 6:
            _b.sent();
            return [3 /*break*/, 13];
          case 7:
            err_1 = _b.sent();
            code = err_1.code;
            if (!(code === "EPERM" || code === "EEXIST")) {
              return [3 /*break*/, 11];
            }
            return [4 /*yield*/, deps.fs.promises.copyFile(tmp, configPath)];
          case 8:
            _b.sent();
            return [
              4 /*yield*/,
              deps.fs.promises.chmod(configPath, 384).catch(function () {
                // best-effort
              }),
            ];
          case 9:
            _b.sent();
            return [
              4 /*yield*/,
              deps.fs.promises.unlink(tmp).catch(function () {
                // best-effort
              }),
            ];
          case 10:
            _b.sent();
            return [2 /*return*/];
          case 11:
            return [
              4 /*yield*/,
              deps.fs.promises.unlink(tmp).catch(function () {
                // best-effort
              }),
            ];
          case 12:
            _b.sent();
            throw err_1;
          case 13:
            return [2 /*return*/];
        }
      });
    });
  }
  return {
    configPath: configPath,
    loadConfig: loadConfig,
    readConfigFileSnapshot: readConfigFileSnapshot,
    writeConfigFile: writeConfigFile,
  };
}
// NOTE: These wrappers intentionally do *not* cache the resolved config path at
// module scope. `OPENCLAW_CONFIG_PATH` (and friends) are expected to work even
// when set after the module has been imported (tests, one-off scripts, etc.).
var DEFAULT_CONFIG_CACHE_MS = 200;
var configCache = null;
function resolveConfigCacheMs(env) {
  var _a;
  var raw = (_a = env.OPENCLAW_CONFIG_CACHE_MS) === null || _a === void 0 ? void 0 : _a.trim();
  if (raw === "" || raw === "0") {
    return 0;
  }
  if (!raw) {
    return DEFAULT_CONFIG_CACHE_MS;
  }
  var parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_CONFIG_CACHE_MS;
  }
  return Math.max(0, parsed);
}
function shouldUseConfigCache(env) {
  var _a;
  if ((_a = env.OPENCLAW_DISABLE_CONFIG_CACHE) === null || _a === void 0 ? void 0 : _a.trim()) {
    return false;
  }
  return resolveConfigCacheMs(env) > 0;
}
function clearConfigCache() {
  configCache = null;
}
function loadConfig() {
  var io = createConfigIO();
  var configPath = io.configPath;
  var now = Date.now();
  if (shouldUseConfigCache(process.env)) {
    var cached = configCache;
    if (cached && cached.configPath === configPath && cached.expiresAt > now) {
      return cached.config;
    }
  }
  var config = io.loadConfig();
  if (shouldUseConfigCache(process.env)) {
    var cacheMs = resolveConfigCacheMs(process.env);
    if (cacheMs > 0) {
      configCache = {
        configPath: configPath,
        expiresAt: now + cacheMs,
        config: config,
      };
    }
  }
  return config;
}
function readConfigFileSnapshot() {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, createConfigIO().readConfigFileSnapshot()];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function writeConfigFile(cfg) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          clearConfigCache();
          return [4 /*yield*/, createConfigIO().writeConfigFile(cfg)];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
