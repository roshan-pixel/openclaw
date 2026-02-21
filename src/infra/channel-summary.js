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
exports.buildChannelSummary = buildChannelSummary;
exports.formatAge = formatAge;
var index_js_1 = require("../channels/plugins/index.js");
var config_js_1 = require("../config/config.js");
var session_key_js_1 = require("../routing/session-key.js");
var theme_js_1 = require("../terminal/theme.js");
var DEFAULT_OPTIONS = {
  colorize: false,
  includeAllowFrom: false,
};
var formatAccountLabel = function (params) {
  var _a;
  var base = params.accountId || session_key_js_1.DEFAULT_ACCOUNT_ID;
  if ((_a = params.name) === null || _a === void 0 ? void 0 : _a.trim()) {
    return "".concat(base, " (").concat(params.name.trim(), ")");
  }
  return base;
};
var accountLine = function (label, details) {
  return "  - ".concat(label).concat(details.length ? " (".concat(details.join(", "), ")") : "");
};
var resolveAccountEnabled = function (plugin, account, cfg) {
  if (plugin.config.isEnabled) {
    return plugin.config.isEnabled(account, cfg);
  }
  if (!account || typeof account !== "object") {
    return true;
  }
  var enabled = account.enabled;
  return enabled !== false;
};
var resolveAccountConfigured = function (plugin, account, cfg) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!plugin.config.isConfigured) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, plugin.config.isConfigured(account, cfg)];
        case 1:
          return [2 /*return*/, _a.sent()];
        case 2:
          return [2 /*return*/, true];
      }
    });
  });
};
var buildAccountSnapshot = function (params) {
  var described = params.plugin.config.describeAccount
    ? params.plugin.config.describeAccount(params.account, params.cfg)
    : undefined;
  return __assign(__assign({ enabled: params.enabled, configured: params.configured }, described), {
    accountId: params.accountId,
  });
};
var formatAllowFrom = function (params) {
  if (params.plugin.config.formatAllowFrom) {
    return params.plugin.config.formatAllowFrom({
      cfg: params.cfg,
      accountId: params.accountId,
      allowFrom: params.allowFrom,
    });
  }
  return params.allowFrom
    .map(function (entry) {
      return String(entry).trim();
    })
    .filter(Boolean);
};
var buildAccountDetails = function (params) {
  var _a;
  var details = [];
  var snapshot = params.entry.snapshot;
  if (snapshot.enabled === false) {
    details.push("disabled");
  }
  if (snapshot.dmPolicy) {
    details.push("dm:".concat(snapshot.dmPolicy));
  }
  if (snapshot.tokenSource && snapshot.tokenSource !== "none") {
    details.push("token:".concat(snapshot.tokenSource));
  }
  if (snapshot.botTokenSource && snapshot.botTokenSource !== "none") {
    details.push("bot:".concat(snapshot.botTokenSource));
  }
  if (snapshot.appTokenSource && snapshot.appTokenSource !== "none") {
    details.push("app:".concat(snapshot.appTokenSource));
  }
  if (snapshot.baseUrl) {
    details.push(snapshot.baseUrl);
  }
  if (snapshot.port != null) {
    details.push("port:".concat(snapshot.port));
  }
  if (snapshot.cliPath) {
    details.push("cli:".concat(snapshot.cliPath));
  }
  if (snapshot.dbPath) {
    details.push("db:".concat(snapshot.dbPath));
  }
  if (
    params.includeAllowFrom &&
    ((_a = snapshot.allowFrom) === null || _a === void 0 ? void 0 : _a.length)
  ) {
    var formatted = formatAllowFrom({
      plugin: params.plugin,
      cfg: params.cfg,
      accountId: snapshot.accountId,
      allowFrom: snapshot.allowFrom,
    }).slice(0, 2);
    if (formatted.length > 0) {
      details.push("allow:".concat(formatted.join(",")));
    }
  }
  return details;
};
function buildChannelSummary(cfg, options) {
  return __awaiter(this, void 0, void 0, function () {
    var effective, lines, resolved, tint, _loop_1, _i, _a, plugin;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
      switch (_l.label) {
        case 0:
          effective = cfg !== null && cfg !== void 0 ? cfg : (0, config_js_1.loadConfig)();
          lines = [];
          resolved = __assign(__assign({}, DEFAULT_OPTIONS), options);
          tint = function (value, color) {
            return resolved.colorize && color ? color(value) : value;
          };
          _loop_1 = function (plugin) {
            var accountIds,
              defaultAccountId,
              resolvedAccountIds,
              entries,
              _m,
              resolvedAccountIds_1,
              accountId,
              account,
              enabled,
              configured_1,
              snapshot,
              configuredEntries,
              anyEnabled,
              fallbackEntry,
              summary,
              _o,
              summaryRecord,
              linked,
              configured,
              status_1,
              statusColor,
              baseLabel,
              line,
              authAgeMs,
              self_1,
              _p,
              configuredEntries_1,
              entry,
              details;
            return __generator(this, function (_q) {
              switch (_q.label) {
                case 0:
                  accountIds = plugin.config.listAccountIds(effective);
                  defaultAccountId =
                    (_e =
                      (_d =
                        (_c = (_b = plugin.config).defaultAccountId) === null || _c === void 0
                          ? void 0
                          : _c.call(_b, effective)) !== null && _d !== void 0
                        ? _d
                        : accountIds[0]) !== null && _e !== void 0
                      ? _e
                      : session_key_js_1.DEFAULT_ACCOUNT_ID;
                  resolvedAccountIds = accountIds.length > 0 ? accountIds : [defaultAccountId];
                  entries = [];
                  ((_m = 0), (resolvedAccountIds_1 = resolvedAccountIds));
                  _q.label = 1;
                case 1:
                  if (!(_m < resolvedAccountIds_1.length)) {
                    return [3 /*break*/, 4];
                  }
                  accountId = resolvedAccountIds_1[_m];
                  account = plugin.config.resolveAccount(effective, accountId);
                  enabled = resolveAccountEnabled(plugin, account, effective);
                  return [4 /*yield*/, resolveAccountConfigured(plugin, account, effective)];
                case 2:
                  configured_1 = _q.sent();
                  snapshot = buildAccountSnapshot({
                    plugin: plugin,
                    account: account,
                    cfg: effective,
                    accountId: accountId,
                    enabled: enabled,
                    configured: configured_1,
                  });
                  entries.push({
                    accountId: accountId,
                    account: account,
                    enabled: enabled,
                    configured: configured_1,
                    snapshot: snapshot,
                  });
                  _q.label = 3;
                case 3:
                  _m++;
                  return [3 /*break*/, 1];
                case 4:
                  configuredEntries = entries.filter(function (entry) {
                    return entry.configured;
                  });
                  anyEnabled = entries.some(function (entry) {
                    return entry.enabled;
                  });
                  fallbackEntry =
                    (_f = entries.find(function (entry) {
                      return entry.accountId === defaultAccountId;
                    })) !== null && _f !== void 0
                      ? _f
                      : entries[0];
                  if (
                    !((_g = plugin.status) === null || _g === void 0
                      ? void 0
                      : _g.buildChannelSummary)
                  ) {
                    return [3 /*break*/, 6];
                  }
                  return [
                    4 /*yield*/,
                    plugin.status.buildChannelSummary({
                      account:
                        (_h =
                          fallbackEntry === null || fallbackEntry === void 0
                            ? void 0
                            : fallbackEntry.account) !== null && _h !== void 0
                          ? _h
                          : {},
                      cfg: effective,
                      defaultAccountId: defaultAccountId,
                      snapshot:
                        (_j =
                          fallbackEntry === null || fallbackEntry === void 0
                            ? void 0
                            : fallbackEntry.snapshot) !== null && _j !== void 0
                          ? _j
                          : { accountId: defaultAccountId },
                    }),
                  ];
                case 5:
                  _o = _q.sent();
                  return [3 /*break*/, 7];
                case 6:
                  _o = undefined;
                  _q.label = 7;
                case 7:
                  summary = _o;
                  summaryRecord = summary;
                  linked =
                    summaryRecord && typeof summaryRecord.linked === "boolean"
                      ? summaryRecord.linked
                      : null;
                  configured =
                    summaryRecord && typeof summaryRecord.configured === "boolean"
                      ? summaryRecord.configured
                      : configuredEntries.length > 0;
                  status_1 = !anyEnabled
                    ? "disabled"
                    : linked !== null
                      ? linked
                        ? "linked"
                        : "not linked"
                      : configured
                        ? "configured"
                        : "not configured";
                  statusColor =
                    status_1 === "linked" || status_1 === "configured"
                      ? theme_js_1.theme.success
                      : status_1 === "not linked"
                        ? theme_js_1.theme.error
                        : theme_js_1.theme.muted;
                  baseLabel = (_k = plugin.meta.label) !== null && _k !== void 0 ? _k : plugin.id;
                  line = "".concat(baseLabel, ": ").concat(status_1);
                  authAgeMs =
                    summaryRecord && typeof summaryRecord.authAgeMs === "number"
                      ? summaryRecord.authAgeMs
                      : null;
                  self_1 =
                    summaryRecord === null || summaryRecord === void 0
                      ? void 0
                      : summaryRecord.self;
                  if (self_1 === null || self_1 === void 0 ? void 0 : self_1.e164) {
                    line += " ".concat(self_1.e164);
                  }
                  if (authAgeMs != null && authAgeMs >= 0) {
                    line += " auth ".concat(formatAge(authAgeMs));
                  }
                  lines.push(tint(line, statusColor));
                  if (configuredEntries.length > 0) {
                    for (
                      _p = 0, configuredEntries_1 = configuredEntries;
                      _p < configuredEntries_1.length;
                      _p++
                    ) {
                      entry = configuredEntries_1[_p];
                      details = buildAccountDetails({
                        entry: entry,
                        plugin: plugin,
                        cfg: effective,
                        includeAllowFrom: resolved.includeAllowFrom,
                      });
                      lines.push(
                        accountLine(
                          formatAccountLabel({
                            accountId: entry.accountId,
                            name: entry.snapshot.name,
                          }),
                          details,
                        ),
                      );
                    }
                  }
                  return [2 /*return*/];
              }
            });
          };
          ((_i = 0), (_a = (0, index_js_1.listChannelPlugins)()));
          _l.label = 1;
        case 1:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 4];
          }
          plugin = _a[_i];
          return [5 /*yield**/, _loop_1(plugin)];
        case 2:
          _l.sent();
          _l.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          return [2 /*return*/, lines];
      }
    });
  });
}
function formatAge(ms) {
  if (ms < 0) {
    return "unknown";
  }
  var minutes = Math.round(ms / 60000);
  if (minutes < 1) {
    return "just now";
  }
  if (minutes < 60) {
    return "".concat(minutes, "m ago");
  }
  var hours = Math.round(minutes / 60);
  if (hours < 48) {
    return "".concat(hours, "h ago");
  }
  var days = Math.round(hours / 24);
  return "".concat(days, "d ago");
}
