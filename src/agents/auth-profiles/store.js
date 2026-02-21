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
exports.updateAuthProfileStoreWithLock = updateAuthProfileStoreWithLock;
exports.loadAuthProfileStore = loadAuthProfileStore;
exports.ensureAuthProfileStore = ensureAuthProfileStore;
exports.saveAuthProfileStore = saveAuthProfileStore;
var node_fs_1 = require("node:fs");
var proper_lockfile_1 = require("proper-lockfile");
var paths_js_1 = require("../../config/paths.js");
var json_file_js_1 = require("../../infra/json-file.js");
var constants_js_1 = require("./constants.js");
var external_cli_sync_js_1 = require("./external-cli-sync.js");
var paths_js_2 = require("./paths.js");
function _syncAuthProfileStore(target, source) {
  target.version = source.version;
  target.profiles = source.profiles;
  target.order = source.order;
  target.lastGood = source.lastGood;
  target.usageStats = source.usageStats;
}
function updateAuthProfileStoreWithLock(params) {
  return __awaiter(this, void 0, void 0, function () {
    var authPath, release, store, shouldSave, _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          authPath = (0, paths_js_2.resolveAuthStorePath)(params.agentDir);
          (0, paths_js_2.ensureAuthStoreFile)(authPath);
          _c.label = 1;
        case 1:
          _c.trys.push([1, 3, 4, 9]);
          return [
            4 /*yield*/,
            proper_lockfile_1.default.lock(authPath, constants_js_1.AUTH_STORE_LOCK_OPTIONS),
          ];
        case 2:
          release = _c.sent();
          store = ensureAuthProfileStore(params.agentDir);
          shouldSave = params.updater(store);
          if (shouldSave) {
            saveAuthProfileStore(store, params.agentDir);
          }
          return [2 /*return*/, store];
        case 3:
          _a = _c.sent();
          return [2 /*return*/, null];
        case 4:
          if (!release) {
            return [3 /*break*/, 8];
          }
          _c.label = 5;
        case 5:
          _c.trys.push([5, 7, , 8]);
          return [4 /*yield*/, release()];
        case 6:
          _c.sent();
          return [3 /*break*/, 8];
        case 7:
          _b = _c.sent();
          return [3 /*break*/, 8];
        case 8:
          return [7 /*endfinally*/];
        case 9:
          return [2 /*return*/];
      }
    });
  });
}
function coerceLegacyStore(raw) {
  var _a;
  if (!raw || typeof raw !== "object") {
    return null;
  }
  var record = raw;
  if ("profiles" in record) {
    return null;
  }
  var entries = {};
  for (var _i = 0, _b = Object.entries(record); _i < _b.length; _i++) {
    var _c = _b[_i],
      key = _c[0],
      value = _c[1];
    if (!value || typeof value !== "object") {
      continue;
    }
    var typed = value;
    if (typed.type !== "api_key" && typed.type !== "oauth" && typed.type !== "token") {
      continue;
    }
    entries[key] = __assign(__assign({}, typed), {
      provider: String((_a = typed.provider) !== null && _a !== void 0 ? _a : key),
    });
  }
  return Object.keys(entries).length > 0 ? entries : null;
}
function coerceAuthStore(raw) {
  var _a;
  if (!raw || typeof raw !== "object") {
    return null;
  }
  var record = raw;
  if (!record.profiles || typeof record.profiles !== "object") {
    return null;
  }
  var profiles = record.profiles;
  var normalized = {};
  for (var _i = 0, _b = Object.entries(profiles); _i < _b.length; _i++) {
    var _c = _b[_i],
      key = _c[0],
      value = _c[1];
    if (!value || typeof value !== "object") {
      continue;
    }
    var typed = value;
    if (typed.type !== "api_key" && typed.type !== "oauth" && typed.type !== "token") {
      continue;
    }
    if (!typed.provider) {
      continue;
    }
    normalized[key] = typed;
  }
  var order =
    record.order && typeof record.order === "object"
      ? Object.entries(record.order).reduce(function (acc, _a) {
          var provider = _a[0],
            value = _a[1];
          if (!Array.isArray(value)) {
            return acc;
          }
          var list = value
            .map(function (entry) {
              return typeof entry === "string" ? entry.trim() : "";
            })
            .filter(Boolean);
          if (list.length === 0) {
            return acc;
          }
          acc[provider] = list;
          return acc;
        }, {})
      : undefined;
  return {
    version: Number(
      (_a = record.version) !== null && _a !== void 0 ? _a : constants_js_1.AUTH_STORE_VERSION,
    ),
    profiles: normalized,
    order: order,
    lastGood: record.lastGood && typeof record.lastGood === "object" ? record.lastGood : undefined,
    usageStats:
      record.usageStats && typeof record.usageStats === "object" ? record.usageStats : undefined,
  };
}
function mergeRecord(base, override) {
  if (!base && !override) {
    return undefined;
  }
  if (!base) {
    return __assign({}, override);
  }
  if (!override) {
    return __assign({}, base);
  }
  return __assign(__assign({}, base), override);
}
function mergeAuthProfileStores(base, override) {
  var _a;
  if (
    Object.keys(override.profiles).length === 0 &&
    !override.order &&
    !override.lastGood &&
    !override.usageStats
  ) {
    return base;
  }
  return {
    version: Math.max(
      base.version,
      (_a = override.version) !== null && _a !== void 0 ? _a : base.version,
    ),
    profiles: __assign(__assign({}, base.profiles), override.profiles),
    order: mergeRecord(base.order, override.order),
    lastGood: mergeRecord(base.lastGood, override.lastGood),
    usageStats: mergeRecord(base.usageStats, override.usageStats),
  };
}
function mergeOAuthFileIntoStore(store) {
  var oauthPath = (0, paths_js_1.resolveOAuthPath)();
  var oauthRaw = (0, json_file_js_1.loadJsonFile)(oauthPath);
  if (!oauthRaw || typeof oauthRaw !== "object") {
    return false;
  }
  var oauthEntries = oauthRaw;
  var mutated = false;
  for (var _i = 0, _a = Object.entries(oauthEntries); _i < _a.length; _i++) {
    var _b = _a[_i],
      provider = _b[0],
      creds = _b[1];
    if (!creds || typeof creds !== "object") {
      continue;
    }
    var profileId = "".concat(provider, ":default");
    if (store.profiles[profileId]) {
      continue;
    }
    store.profiles[profileId] = __assign({ type: "oauth", provider: provider }, creds);
    mutated = true;
  }
  return mutated;
}
function loadAuthProfileStore() {
  var _a, _b, _c;
  var authPath = (0, paths_js_2.resolveAuthStorePath)();
  var raw = (0, json_file_js_1.loadJsonFile)(authPath);
  var asStore = coerceAuthStore(raw);
  if (asStore) {
    // Sync from external CLI tools on every load
    var synced = (0, external_cli_sync_js_1.syncExternalCliCredentials)(asStore);
    if (synced) {
      (0, json_file_js_1.saveJsonFile)(authPath, asStore);
    }
    return asStore;
  }
  var legacyRaw = (0, json_file_js_1.loadJsonFile)((0, paths_js_2.resolveLegacyAuthStorePath)());
  var legacy = coerceLegacyStore(legacyRaw);
  if (legacy) {
    var store_1 = {
      version: constants_js_1.AUTH_STORE_VERSION,
      profiles: {},
    };
    for (var _i = 0, _d = Object.entries(legacy); _i < _d.length; _i++) {
      var _e = _d[_i],
        provider = _e[0],
        cred = _e[1];
      var profileId = "".concat(provider, ":default");
      if (cred.type === "api_key") {
        store_1.profiles[profileId] = __assign(
          {
            type: "api_key",
            provider: String((_a = cred.provider) !== null && _a !== void 0 ? _a : provider),
            key: cred.key,
          },
          cred.email ? { email: cred.email } : {},
        );
      } else if (cred.type === "token") {
        store_1.profiles[profileId] = __assign(
          __assign(
            {
              type: "token",
              provider: String((_b = cred.provider) !== null && _b !== void 0 ? _b : provider),
              token: cred.token,
            },
            typeof cred.expires === "number" ? { expires: cred.expires } : {},
          ),
          cred.email ? { email: cred.email } : {},
        );
      } else {
        store_1.profiles[profileId] = __assign(
          __assign(
            __assign(
              __assign(
                {
                  type: "oauth",
                  provider: String((_c = cred.provider) !== null && _c !== void 0 ? _c : provider),
                  access: cred.access,
                  refresh: cred.refresh,
                  expires: cred.expires,
                },
                cred.enterpriseUrl ? { enterpriseUrl: cred.enterpriseUrl } : {},
              ),
              cred.projectId ? { projectId: cred.projectId } : {},
            ),
            cred.accountId ? { accountId: cred.accountId } : {},
          ),
          cred.email ? { email: cred.email } : {},
        );
      }
    }
    (0, external_cli_sync_js_1.syncExternalCliCredentials)(store_1);
    return store_1;
  }
  var store = { version: constants_js_1.AUTH_STORE_VERSION, profiles: {} };
  (0, external_cli_sync_js_1.syncExternalCliCredentials)(store);
  return store;
}
function loadAuthProfileStoreForAgent(agentDir, _options) {
  var _a, _b, _c;
  var authPath = (0, paths_js_2.resolveAuthStorePath)(agentDir);
  var raw = (0, json_file_js_1.loadJsonFile)(authPath);
  var asStore = coerceAuthStore(raw);
  if (asStore) {
    // Sync from external CLI tools on every load
    var synced = (0, external_cli_sync_js_1.syncExternalCliCredentials)(asStore);
    if (synced) {
      (0, json_file_js_1.saveJsonFile)(authPath, asStore);
    }
    return asStore;
  }
  // Fallback: inherit auth-profiles from main agent if subagent has none
  if (agentDir) {
    var mainAuthPath = (0, paths_js_2.resolveAuthStorePath)(); // without agentDir = main
    var mainRaw = (0, json_file_js_1.loadJsonFile)(mainAuthPath);
    var mainStore = coerceAuthStore(mainRaw);
    if (mainStore && Object.keys(mainStore.profiles).length > 0) {
      // Clone main store to subagent directory for auth inheritance
      (0, json_file_js_1.saveJsonFile)(authPath, mainStore);
      constants_js_1.log.info("inherited auth-profiles from main agent", { agentDir: agentDir });
      return mainStore;
    }
  }
  var legacyRaw = (0, json_file_js_1.loadJsonFile)(
    (0, paths_js_2.resolveLegacyAuthStorePath)(agentDir),
  );
  var legacy = coerceLegacyStore(legacyRaw);
  var store = {
    version: constants_js_1.AUTH_STORE_VERSION,
    profiles: {},
  };
  if (legacy) {
    for (var _i = 0, _d = Object.entries(legacy); _i < _d.length; _i++) {
      var _e = _d[_i],
        provider = _e[0],
        cred = _e[1];
      var profileId = "".concat(provider, ":default");
      if (cred.type === "api_key") {
        store.profiles[profileId] = __assign(
          {
            type: "api_key",
            provider: String((_a = cred.provider) !== null && _a !== void 0 ? _a : provider),
            key: cred.key,
          },
          cred.email ? { email: cred.email } : {},
        );
      } else if (cred.type === "token") {
        store.profiles[profileId] = __assign(
          __assign(
            {
              type: "token",
              provider: String((_b = cred.provider) !== null && _b !== void 0 ? _b : provider),
              token: cred.token,
            },
            typeof cred.expires === "number" ? { expires: cred.expires } : {},
          ),
          cred.email ? { email: cred.email } : {},
        );
      } else {
        store.profiles[profileId] = __assign(
          __assign(
            __assign(
              __assign(
                {
                  type: "oauth",
                  provider: String((_c = cred.provider) !== null && _c !== void 0 ? _c : provider),
                  access: cred.access,
                  refresh: cred.refresh,
                  expires: cred.expires,
                },
                cred.enterpriseUrl ? { enterpriseUrl: cred.enterpriseUrl } : {},
              ),
              cred.projectId ? { projectId: cred.projectId } : {},
            ),
            cred.accountId ? { accountId: cred.accountId } : {},
          ),
          cred.email ? { email: cred.email } : {},
        );
      }
    }
  }
  var mergedOAuth = mergeOAuthFileIntoStore(store);
  var syncedCli = (0, external_cli_sync_js_1.syncExternalCliCredentials)(store);
  var shouldWrite = legacy !== null || mergedOAuth || syncedCli;
  if (shouldWrite) {
    (0, json_file_js_1.saveJsonFile)(authPath, store);
  }
  // PR #368: legacy auth.json could get re-migrated from other agent dirs,
  // overwriting fresh OAuth creds with stale tokens (fixes #363). Delete only
  // after we've successfully written auth-profiles.json.
  if (shouldWrite && legacy !== null) {
    var legacyPath = (0, paths_js_2.resolveLegacyAuthStorePath)(agentDir);
    try {
      node_fs_1.default.unlinkSync(legacyPath);
    } catch (err) {
      if ((err === null || err === void 0 ? void 0 : err.code) !== "ENOENT") {
        constants_js_1.log.warn("failed to delete legacy auth.json after migration", {
          err: err,
          legacyPath: legacyPath,
        });
      }
    }
  }
  return store;
}
function ensureAuthProfileStore(agentDir, options) {
  var store = loadAuthProfileStoreForAgent(agentDir, options);
  var authPath = (0, paths_js_2.resolveAuthStorePath)(agentDir);
  var mainAuthPath = (0, paths_js_2.resolveAuthStorePath)();
  if (!agentDir || authPath === mainAuthPath) {
    return store;
  }
  var mainStore = loadAuthProfileStoreForAgent(undefined, options);
  var merged = mergeAuthProfileStores(mainStore, store);
  return merged;
}
function saveAuthProfileStore(store, agentDir) {
  var _a, _b, _c;
  var authPath = (0, paths_js_2.resolveAuthStorePath)(agentDir);
  var payload = {
    version: constants_js_1.AUTH_STORE_VERSION,
    profiles: store.profiles,
    order: (_a = store.order) !== null && _a !== void 0 ? _a : undefined,
    lastGood: (_b = store.lastGood) !== null && _b !== void 0 ? _b : undefined,
    usageStats: (_c = store.usageStats) !== null && _c !== void 0 ? _c : undefined,
  };
  (0, json_file_js_1.saveJsonFile)(authPath, payload);
}
