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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChannelManager = createChannelManager;
var helpers_js_1 = require("../channels/plugins/helpers.js");
var index_js_1 = require("../channels/plugins/index.js");
var errors_js_1 = require("../infra/errors.js");
var target_resolver_js_1 = require("../infra/outbound/target-resolver.js");
var session_key_js_1 = require("../routing/session-key.js");
function createRuntimeStore() {
  return {
    aborts: new Map(),
    tasks: new Map(),
    runtimes: new Map(),
  };
}
function isAccountEnabled(account) {
  if (!account || typeof account !== "object") {
    return true;
  }
  var enabled = account.enabled;
  return enabled !== false;
}
function resolveDefaultRuntime(channelId) {
  var _a, _b;
  var plugin = (0, index_js_1.getChannelPlugin)(channelId);
  return (_b =
    (_a = plugin === null || plugin === void 0 ? void 0 : plugin.status) === null || _a === void 0
      ? void 0
      : _a.defaultRuntime) !== null && _b !== void 0
    ? _b
    : { accountId: session_key_js_1.DEFAULT_ACCOUNT_ID };
}
function cloneDefaultRuntime(channelId, accountId) {
  return __assign(__assign({}, resolveDefaultRuntime(channelId)), { accountId: accountId });
}
// Channel docking: lifecycle hooks (`plugin.gateway`) flow through this manager.
function createChannelManager(opts) {
  var _this = this;
  var loadConfig = opts.loadConfig,
    channelLogs = opts.channelLogs,
    channelRuntimeEnvs = opts.channelRuntimeEnvs;
  var channelStores = new Map();
  var getStore = function (channelId) {
    var existing = channelStores.get(channelId);
    if (existing) {
      return existing;
    }
    var next = createRuntimeStore();
    channelStores.set(channelId, next);
    return next;
  };
  var getRuntime = function (channelId, accountId) {
    var _a;
    var store = getStore(channelId);
    return (_a = store.runtimes.get(accountId)) !== null && _a !== void 0
      ? _a
      : cloneDefaultRuntime(channelId, accountId);
  };
  var setRuntime = function (channelId, accountId, patch) {
    var store = getStore(channelId);
    var current = getRuntime(channelId, accountId);
    var next = __assign(__assign(__assign({}, current), patch), { accountId: accountId });
    store.runtimes.set(accountId, next);
    return next;
  };
  var startChannel = function (channelId, accountId) {
    return __awaiter(_this, void 0, void 0, function () {
      var plugin, startAccount, cfg, store, accountIds;
      var _this = this;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            plugin = (0, index_js_1.getChannelPlugin)(channelId);
            startAccount =
              (_a = plugin === null || plugin === void 0 ? void 0 : plugin.gateway) === null ||
              _a === void 0
                ? void 0
                : _a.startAccount;
            if (!startAccount) {
              return [2 /*return*/];
            }
            cfg = loadConfig();
            (0, target_resolver_js_1.resetDirectoryCache)({
              channel: channelId,
              accountId: accountId,
            });
            store = getStore(channelId);
            accountIds = accountId ? [accountId] : plugin.config.listAccountIds(cfg);
            if (accountIds.length === 0) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              Promise.all(
                accountIds.map(function (id) {
                  return __awaiter(_this, void 0, void 0, function () {
                    var account, enabled, configured, abort, log, task, tracked;
                    var _a, _b, _c, _d, _e, _f;
                    return __generator(this, function (_g) {
                      switch (_g.label) {
                        case 0:
                          if (store.tasks.has(id)) {
                            return [2 /*return*/];
                          }
                          account = plugin.config.resolveAccount(cfg, id);
                          enabled = plugin.config.isEnabled
                            ? plugin.config.isEnabled(account, cfg)
                            : isAccountEnabled(account);
                          if (!enabled) {
                            setRuntime(channelId, id, {
                              accountId: id,
                              running: false,
                              lastError:
                                (_c =
                                  (_b = (_a = plugin.config).disabledReason) === null ||
                                  _b === void 0
                                    ? void 0
                                    : _b.call(_a, account, cfg)) !== null && _c !== void 0
                                  ? _c
                                  : "disabled",
                            });
                            return [2 /*return*/];
                          }
                          configured = true;
                          if (!plugin.config.isConfigured) {
                            return [3 /*break*/, 2];
                          }
                          return [4 /*yield*/, plugin.config.isConfigured(account, cfg)];
                        case 1:
                          configured = _g.sent();
                          _g.label = 2;
                        case 2:
                          if (!configured) {
                            setRuntime(channelId, id, {
                              accountId: id,
                              running: false,
                              lastError:
                                (_f =
                                  (_e = (_d = plugin.config).unconfiguredReason) === null ||
                                  _e === void 0
                                    ? void 0
                                    : _e.call(_d, account, cfg)) !== null && _f !== void 0
                                  ? _f
                                  : "not configured",
                            });
                            return [2 /*return*/];
                          }
                          abort = new AbortController();
                          store.aborts.set(id, abort);
                          setRuntime(channelId, id, {
                            accountId: id,
                            running: true,
                            lastStartAt: Date.now(),
                            lastError: null,
                          });
                          log = channelLogs[channelId];
                          task = startAccount({
                            cfg: cfg,
                            accountId: id,
                            account: account,
                            runtime: channelRuntimeEnvs[channelId],
                            abortSignal: abort.signal,
                            log: log,
                            getStatus: function () {
                              return getRuntime(channelId, id);
                            },
                            setStatus: function (next) {
                              return setRuntime(channelId, id, next);
                            },
                          });
                          tracked = Promise.resolve(task)
                            .catch(function (err) {
                              var _a;
                              var message = (0, errors_js_1.formatErrorMessage)(err);
                              setRuntime(channelId, id, { accountId: id, lastError: message });
                              (_a = log.error) === null || _a === void 0
                                ? void 0
                                : _a.call(
                                    log,
                                    "[".concat(id, "] channel exited: ").concat(message),
                                  );
                            })
                            .finally(function () {
                              store.aborts.delete(id);
                              store.tasks.delete(id);
                              setRuntime(channelId, id, {
                                accountId: id,
                                running: false,
                                lastStopAt: Date.now(),
                              });
                            });
                          store.tasks.set(id, tracked);
                          return [2 /*return*/];
                      }
                    });
                  });
                }),
              ),
            ];
          case 1:
            _b.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  var stopChannel = function (channelId, accountId) {
    return __awaiter(_this, void 0, void 0, function () {
      var plugin, cfg, store, knownIds;
      var _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            plugin = (0, index_js_1.getChannelPlugin)(channelId);
            cfg = loadConfig();
            store = getStore(channelId);
            knownIds = new Set(
              __spreadArray(
                __spreadArray(
                  __spreadArray([], store.aborts.keys(), true),
                  store.tasks.keys(),
                  true,
                ),
                plugin ? plugin.config.listAccountIds(cfg) : [],
                true,
              ),
            );
            if (accountId) {
              knownIds.clear();
              knownIds.add(accountId);
            }
            return [
              4 /*yield*/,
              Promise.all(
                Array.from(knownIds.values()).map(function (id) {
                  return __awaiter(_this, void 0, void 0, function () {
                    var abort, task, account, _a;
                    var _b, _c, _d;
                    return __generator(this, function (_e) {
                      switch (_e.label) {
                        case 0:
                          abort = store.aborts.get(id);
                          task = store.tasks.get(id);
                          if (
                            !abort &&
                            !task &&
                            !((_b =
                              plugin === null || plugin === void 0 ? void 0 : plugin.gateway) ===
                              null || _b === void 0
                              ? void 0
                              : _b.stopAccount)
                          ) {
                            return [2 /*return*/];
                          }
                          abort === null || abort === void 0 ? void 0 : abort.abort();
                          if (
                            !((_c =
                              plugin === null || plugin === void 0 ? void 0 : plugin.gateway) ===
                              null || _c === void 0
                              ? void 0
                              : _c.stopAccount)
                          ) {
                            return [3 /*break*/, 2];
                          }
                          account = plugin.config.resolveAccount(cfg, id);
                          return [
                            4 /*yield*/,
                            plugin.gateway.stopAccount({
                              cfg: cfg,
                              accountId: id,
                              account: account,
                              runtime: channelRuntimeEnvs[channelId],
                              abortSignal:
                                (_d =
                                  abort === null || abort === void 0 ? void 0 : abort.signal) !==
                                  null && _d !== void 0
                                  ? _d
                                  : new AbortController().signal,
                              log: channelLogs[channelId],
                              getStatus: function () {
                                return getRuntime(channelId, id);
                              },
                              setStatus: function (next) {
                                return setRuntime(channelId, id, next);
                              },
                            }),
                          ];
                        case 1:
                          _e.sent();
                          _e.label = 2;
                        case 2:
                          _e.trys.push([2, 4, , 5]);
                          return [4 /*yield*/, task];
                        case 3:
                          _e.sent();
                          return [3 /*break*/, 5];
                        case 4:
                          _a = _e.sent();
                          return [3 /*break*/, 5];
                        case 5:
                          store.aborts.delete(id);
                          store.tasks.delete(id);
                          setRuntime(channelId, id, {
                            accountId: id,
                            running: false,
                            lastStopAt: Date.now(),
                          });
                          return [2 /*return*/];
                      }
                    });
                  });
                }),
              ),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  var startChannels = function () {
    return __awaiter(_this, void 0, void 0, function () {
      var _i, _a, plugin;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            ((_i = 0), (_a = (0, index_js_1.listChannelPlugins)()));
            _b.label = 1;
          case 1:
            if (!(_i < _a.length)) {
              return [3 /*break*/, 4];
            }
            plugin = _a[_i];
            return [4 /*yield*/, startChannel(plugin.id)];
          case 2:
            _b.sent();
            _b.label = 3;
          case 3:
            _i++;
            return [3 /*break*/, 1];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  var markChannelLoggedOut = function (channelId, cleared, accountId) {
    var plugin = (0, index_js_1.getChannelPlugin)(channelId);
    if (!plugin) {
      return;
    }
    var cfg = loadConfig();
    var resolvedId =
      accountId !== null && accountId !== void 0
        ? accountId
        : (0, helpers_js_1.resolveChannelDefaultAccountId)({
            plugin: plugin,
            cfg: cfg,
          });
    var current = getRuntime(channelId, resolvedId);
    var next = {
      accountId: resolvedId,
      running: false,
      lastError: cleared ? "logged out" : current.lastError,
    };
    if (typeof current.connected === "boolean") {
      next.connected = false;
    }
    setRuntime(channelId, resolvedId, next);
  };
  var getRuntimeSnapshot = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var cfg = loadConfig();
    var channels = {};
    var channelAccounts = {};
    for (var _i = 0, _o = (0, index_js_1.listChannelPlugins)(); _i < _o.length; _i++) {
      var plugin = _o[_i];
      var store = getStore(plugin.id);
      var accountIds = plugin.config.listAccountIds(cfg);
      var defaultAccountId = (0, helpers_js_1.resolveChannelDefaultAccountId)({
        plugin: plugin,
        cfg: cfg,
        accountIds: accountIds,
      });
      var accounts = {};
      for (var _p = 0, accountIds_1 = accountIds; _p < accountIds_1.length; _p++) {
        var id = accountIds_1[_p];
        var account = plugin.config.resolveAccount(cfg, id);
        var enabled = plugin.config.isEnabled
          ? plugin.config.isEnabled(account, cfg)
          : isAccountEnabled(account);
        var described =
          (_b = (_a = plugin.config).describeAccount) === null || _b === void 0
            ? void 0
            : _b.call(_a, account, cfg);
        var configured = described === null || described === void 0 ? void 0 : described.configured;
        var current =
          (_c = store.runtimes.get(id)) !== null && _c !== void 0
            ? _c
            : cloneDefaultRuntime(plugin.id, id);
        var next = __assign(__assign({}, current), { accountId: id });
        if (!next.running) {
          if (!enabled) {
            (_d = next.lastError) !== null && _d !== void 0
              ? _d
              : (next.lastError =
                  (_g =
                    (_f = (_e = plugin.config).disabledReason) === null || _f === void 0
                      ? void 0
                      : _f.call(_e, account, cfg)) !== null && _g !== void 0
                    ? _g
                    : "disabled");
          } else if (configured === false) {
            (_h = next.lastError) !== null && _h !== void 0
              ? _h
              : (next.lastError =
                  (_l =
                    (_k = (_j = plugin.config).unconfiguredReason) === null || _k === void 0
                      ? void 0
                      : _k.call(_j, account, cfg)) !== null && _l !== void 0
                    ? _l
                    : "not configured");
          }
        }
        accounts[id] = next;
      }
      var defaultAccount =
        (_m = accounts[defaultAccountId]) !== null && _m !== void 0
          ? _m
          : cloneDefaultRuntime(plugin.id, defaultAccountId);
      channels[plugin.id] = defaultAccount;
      channelAccounts[plugin.id] = accounts;
    }
    return { channels: channels, channelAccounts: channelAccounts };
  };
  return {
    getRuntimeSnapshot: getRuntimeSnapshot,
    startChannels: startChannels,
    startChannel: startChannel,
    stopChannel: stopChannel,
    markChannelLoggedOut: markChannelLoggedOut,
  };
}
