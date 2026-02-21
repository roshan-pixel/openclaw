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
exports.formatHealthChannelLines = void 0;
exports.getHealthSnapshot = getHealthSnapshot;
exports.healthCommand = healthCommand;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var helpers_js_1 = require("../channels/plugins/helpers.js");
var index_js_1 = require("../channels/plugins/index.js");
var progress_js_1 = require("../cli/progress.js");
var config_js_1 = require("../config/config.js");
var sessions_js_1 = require("../config/sessions.js");
var call_js_1 = require("../gateway/call.js");
var globals_js_1 = require("../globals.js");
var errors_js_1 = require("../infra/errors.js");
var env_js_1 = require("../infra/env.js");
var heartbeat_runner_js_1 = require("../infra/heartbeat-runner.js");
var bindings_js_1 = require("../routing/bindings.js");
var session_key_js_1 = require("../routing/session-key.js");
var theme_js_1 = require("../terminal/theme.js");
var DEFAULT_TIMEOUT_MS = 10000;
var debugHealth = function () {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  if ((0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_DEBUG_HEALTH)) {
    console.warn.apply(console, __spreadArray(["[health:debug]"], args, false));
  }
};
var formatDurationParts = function (ms) {
  if (!Number.isFinite(ms)) {
    return "unknown";
  }
  if (ms < 1000) {
    return "".concat(Math.max(0, Math.round(ms)), "ms");
  }
  var units = [
    { label: "w", size: 7 * 24 * 60 * 60 * 1000 },
    { label: "d", size: 24 * 60 * 60 * 1000 },
    { label: "h", size: 60 * 60 * 1000 },
    { label: "m", size: 60 * 1000 },
    { label: "s", size: 1000 },
  ];
  var remaining = Math.max(0, Math.floor(ms));
  var parts = [];
  for (var _i = 0, units_1 = units; _i < units_1.length; _i++) {
    var unit = units_1[_i];
    var value = Math.floor(remaining / unit.size);
    if (value > 0) {
      parts.push("".concat(value).concat(unit.label));
      remaining -= value * unit.size;
    }
  }
  if (parts.length === 0) {
    return "0s";
  }
  return parts.join(" ");
};
var resolveHeartbeatSummary = function (cfg, agentId) {
  return (0, heartbeat_runner_js_1.resolveHeartbeatSummaryForAgent)(cfg, agentId);
};
var resolveAgentOrder = function (cfg) {
  var _a;
  var defaultAgentId = (0, agent_scope_js_1.resolveDefaultAgentId)(cfg);
  var entries = Array.isArray((_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.list)
    ? cfg.agents.list
    : [];
  var seen = new Set();
  var ordered = [];
  for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
    var entry = entries_1[_i];
    if (!entry || typeof entry !== "object") {
      continue;
    }
    if (typeof entry.id !== "string" || !entry.id.trim()) {
      continue;
    }
    var id = (0, session_key_js_1.normalizeAgentId)(entry.id);
    if (!id || seen.has(id)) {
      continue;
    }
    seen.add(id);
    ordered.push({ id: id, name: typeof entry.name === "string" ? entry.name : undefined });
  }
  if (!seen.has(defaultAgentId)) {
    ordered.unshift({ id: defaultAgentId });
  }
  if (ordered.length === 0) {
    ordered.push({ id: defaultAgentId });
  }
  return { defaultAgentId: defaultAgentId, ordered: ordered };
};
var buildSessionSummary = function (storePath) {
  var store = (0, sessions_js_1.loadSessionStore)(storePath);
  var sessions = Object.entries(store)
    .filter(function (_a) {
      var key = _a[0];
      return key !== "global" && key !== "unknown";
    })
    .map(function (_a) {
      var _b;
      var key = _a[0],
        entry = _a[1];
      return {
        key: key,
        updatedAt:
          (_b = entry === null || entry === void 0 ? void 0 : entry.updatedAt) !== null &&
          _b !== void 0
            ? _b
            : 0,
      };
    })
    .toSorted(function (a, b) {
      return b.updatedAt - a.updatedAt;
    });
  var recent = sessions.slice(0, 5).map(function (s) {
    return {
      key: s.key,
      updatedAt: s.updatedAt || null,
      age: s.updatedAt ? Date.now() - s.updatedAt : null,
    };
  });
  return {
    path: storePath,
    count: sessions.length,
    recent: recent,
  };
};
var isAccountEnabled = function (account) {
  if (!account || typeof account !== "object") {
    return true;
  }
  var enabled = account.enabled;
  return enabled !== false;
};
var asRecord = function (value) {
  return value && typeof value === "object" ? value : null;
};
var formatProbeLine = function (probe, opts) {
  var _a;
  if (opts === void 0) {
    opts = {};
  }
  var record = asRecord(probe);
  if (!record) {
    return null;
  }
  var ok = typeof record.ok === "boolean" ? record.ok : undefined;
  if (ok === undefined) {
    return null;
  }
  var elapsedMs = typeof record.elapsedMs === "number" ? record.elapsedMs : null;
  var status = typeof record.status === "number" ? record.status : null;
  var error = typeof record.error === "string" ? record.error : null;
  var bot = asRecord(record.bot);
  var botUsername = bot && typeof bot.username === "string" ? bot.username : null;
  var webhook = asRecord(record.webhook);
  var webhookUrl = webhook && typeof webhook.url === "string" ? webhook.url : null;
  var usernames = new Set();
  if (botUsername) {
    usernames.add(botUsername);
  }
  for (
    var _i = 0, _b = (_a = opts.botUsernames) !== null && _a !== void 0 ? _a : [];
    _i < _b.length;
    _i++
  ) {
    var extra = _b[_i];
    if (extra) {
      usernames.add(extra);
    }
  }
  if (ok) {
    var label_1 = "ok";
    if (usernames.size > 0) {
      label_1 += " (@".concat(Array.from(usernames).join(", @"), ")");
    }
    if (elapsedMs != null) {
      label_1 += " (".concat(elapsedMs, "ms)");
    }
    if (webhookUrl) {
      label_1 += " - webhook ".concat(webhookUrl);
    }
    return label_1;
  }
  var label = "failed (".concat(status !== null && status !== void 0 ? status : "unknown", ")");
  if (error) {
    label += " - ".concat(error);
  }
  return label;
};
var formatAccountProbeTiming = function (summary) {
  var probe = asRecord(summary.probe);
  if (!probe) {
    return null;
  }
  var elapsedMs = typeof probe.elapsedMs === "number" ? Math.round(probe.elapsedMs) : null;
  var ok = typeof probe.ok === "boolean" ? probe.ok : null;
  if (elapsedMs == null && ok !== true) {
    return null;
  }
  var accountId = summary.accountId || "default";
  var botRecord = asRecord(probe.bot);
  var botUsername = botRecord && typeof botRecord.username === "string" ? botRecord.username : null;
  var handle = botUsername ? "@".concat(botUsername) : accountId;
  var timing = elapsedMs != null ? "".concat(elapsedMs, "ms") : "ok";
  return "".concat(handle, ":").concat(accountId, ":").concat(timing);
};
var isProbeFailure = function (summary) {
  var probe = asRecord(summary.probe);
  if (!probe) {
    return false;
  }
  var ok = typeof probe.ok === "boolean" ? probe.ok : null;
  return ok === false;
};
function styleHealthChannelLine(line) {
  var colon = line.indexOf(":");
  if (colon === -1) {
    return line;
  }
  var label = line.slice(0, colon + 1);
  var detail = line.slice(colon + 1).trimStart();
  var normalized = detail.toLowerCase();
  var applyPrefix = function (prefix, color) {
    return ""
      .concat(label, " ")
      .concat(color(detail.slice(0, prefix.length)))
      .concat(detail.slice(prefix.length));
  };
  if (normalized.startsWith("failed")) {
    return applyPrefix("failed", theme_js_1.theme.error);
  }
  if (normalized.startsWith("ok")) {
    return applyPrefix("ok", theme_js_1.theme.success);
  }
  if (normalized.startsWith("linked")) {
    return applyPrefix("linked", theme_js_1.theme.success);
  }
  if (normalized.startsWith("configured")) {
    return applyPrefix("configured", theme_js_1.theme.success);
  }
  if (normalized.startsWith("not linked")) {
    return applyPrefix("not linked", theme_js_1.theme.warn);
  }
  if (normalized.startsWith("not configured")) {
    return applyPrefix("not configured", theme_js_1.theme.muted);
  }
  if (normalized.startsWith("unknown")) {
    return applyPrefix("unknown", theme_js_1.theme.warn);
  }
  return line;
}
var formatHealthChannelLines = function (summary, opts) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  if (opts === void 0) {
    opts = {};
  }
  var channels = (_a = summary.channels) !== null && _a !== void 0 ? _a : {};
  var channelOrder =
    ((_b = summary.channelOrder) === null || _b === void 0 ? void 0 : _b.length) > 0
      ? summary.channelOrder
      : Object.keys(channels);
  var accountMode = (_c = opts.accountMode) !== null && _c !== void 0 ? _c : "default";
  var lines = [];
  var _loop_1 = function (channelId) {
    var channelSummary = channels[channelId];
    if (!channelSummary) {
      return "continue";
    }
    var plugin = (0, index_js_1.getChannelPlugin)(channelId);
    var label =
      (_f =
        (_e = (_d = summary.channelLabels) === null || _d === void 0 ? void 0 : _d[channelId]) !==
          null && _e !== void 0
          ? _e
          : plugin === null || plugin === void 0
            ? void 0
            : plugin.meta.label) !== null && _f !== void 0
        ? _f
        : channelId;
    var accountSummaries = (_g = channelSummary.accounts) !== null && _g !== void 0 ? _g : {};
    var accountIds =
      (_h = opts.accountIdsByChannel) === null || _h === void 0 ? void 0 : _h[channelId];
    var filteredSummaries =
      accountIds && accountIds.length > 0
        ? accountIds
            .map(function (accountId) {
              return accountSummaries[accountId];
            })
            .filter(function (entry) {
              return Boolean(entry);
            })
        : undefined;
    var listSummaries =
      accountMode === "all"
        ? Object.values(accountSummaries)
        : filteredSummaries !== null && filteredSummaries !== void 0
          ? filteredSummaries
          : channelSummary.accounts
            ? Object.values(accountSummaries)
            : [];
    var baseSummary =
      filteredSummaries && filteredSummaries.length > 0 ? filteredSummaries[0] : channelSummary;
    var botUsernames = listSummaries
      ? listSummaries
          .map(function (account) {
            var probeRecord = asRecord(account.probe);
            var bot = probeRecord ? asRecord(probeRecord.bot) : null;
            return bot && typeof bot.username === "string" ? bot.username : null;
          })
          .filter(function (value) {
            return Boolean(value);
          })
      : [];
    var linked = typeof baseSummary.linked === "boolean" ? baseSummary.linked : null;
    if (linked !== null) {
      if (linked) {
        var authAgeMs = typeof baseSummary.authAgeMs === "number" ? baseSummary.authAgeMs : null;
        var authLabel =
          authAgeMs != null ? " (auth age ".concat(Math.round(authAgeMs / 60000), "m)") : "";
        lines.push("".concat(label, ": linked").concat(authLabel));
      } else {
        lines.push("".concat(label, ": not linked"));
      }
      return "continue";
    }
    var configured = typeof baseSummary.configured === "boolean" ? baseSummary.configured : null;
    if (configured === false) {
      lines.push("".concat(label, ": not configured"));
      return "continue";
    }
    var accountTimings =
      accountMode === "all"
        ? listSummaries
            .map(function (account) {
              return formatAccountProbeTiming(account);
            })
            .filter(function (value) {
              return Boolean(value);
            })
        : [];
    var failedSummary = listSummaries.find(function (summary) {
      return isProbeFailure(summary);
    });
    if (failedSummary) {
      var failureLine = formatProbeLine(failedSummary.probe, { botUsernames: botUsernames });
      if (failureLine) {
        lines.push("".concat(label, ": ").concat(failureLine));
        return "continue";
      }
    }
    if (accountTimings.length > 0) {
      lines.push("".concat(label, ": ok (").concat(accountTimings.join(", "), ")"));
      return "continue";
    }
    var probeLine = formatProbeLine(baseSummary.probe, { botUsernames: botUsernames });
    if (probeLine) {
      lines.push("".concat(label, ": ").concat(probeLine));
      return "continue";
    }
    if (configured === true) {
      lines.push("".concat(label, ": configured"));
      return "continue";
    }
    lines.push("".concat(label, ": unknown"));
  };
  for (var _i = 0, channelOrder_1 = channelOrder; _i < channelOrder_1.length; _i++) {
    var channelId = channelOrder_1[_i];
    _loop_1(channelId);
  }
  return lines;
};
exports.formatHealthChannelLines = formatHealthChannelLines;
function getHealthSnapshot(params) {
  return __awaiter(this, void 0, void 0, function () {
    var timeoutMs,
      cfg,
      _a,
      defaultAgentId,
      ordered,
      channelBindings,
      sessionCache,
      agents,
      defaultAgent,
      heartbeatSeconds,
      sessions,
      start,
      cappedTimeout,
      doProbe,
      channels,
      channelOrder,
      channelLabels,
      _i,
      _b,
      plugin,
      accountIds,
      defaultAccountId,
      boundAccounts,
      preferredAccountId,
      boundAccountIdsAll,
      accountIdsToProbe,
      accountSummaries,
      _c,
      accountIdsToProbe_1,
      accountId,
      account,
      enabled,
      configured,
      _d,
      probe,
      lastProbeAt,
      err_1,
      probeRecord,
      bot,
      snapshot,
      summary_1,
      _e,
      record,
      defaultSummary,
      fallbackSummary,
      summary;
    var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    return __generator(this, function (_u) {
      switch (_u.label) {
        case 0:
          timeoutMs = params === null || params === void 0 ? void 0 : params.timeoutMs;
          cfg = (0, config_js_1.loadConfig)();
          ((_a = resolveAgentOrder(cfg)),
            (defaultAgentId = _a.defaultAgentId),
            (ordered = _a.ordered));
          channelBindings = (0, bindings_js_1.buildChannelAccountBindings)(cfg);
          sessionCache = new Map();
          agents = ordered.map(function (entry) {
            var _a, _b;
            var storePath = (0, sessions_js_1.resolveStorePath)(
              (_a = cfg.session) === null || _a === void 0 ? void 0 : _a.store,
              { agentId: entry.id },
            );
            var sessions =
              (_b = sessionCache.get(storePath)) !== null && _b !== void 0
                ? _b
                : buildSessionSummary(storePath);
            sessionCache.set(storePath, sessions);
            return {
              agentId: entry.id,
              name: entry.name,
              isDefault: entry.id === defaultAgentId,
              heartbeat: resolveHeartbeatSummary(cfg, entry.id),
              sessions: sessions,
            };
          });
          defaultAgent =
            (_f = agents.find(function (agent) {
              return agent.isDefault;
            })) !== null && _f !== void 0
              ? _f
              : agents[0];
          heartbeatSeconds = (
            defaultAgent === null || defaultAgent === void 0
              ? void 0
              : defaultAgent.heartbeat.everyMs
          )
            ? Math.round(defaultAgent.heartbeat.everyMs / 1000)
            : 0;
          sessions =
            (_g =
              defaultAgent === null || defaultAgent === void 0 ? void 0 : defaultAgent.sessions) !==
              null && _g !== void 0
              ? _g
              : buildSessionSummary(
                  (0, sessions_js_1.resolveStorePath)(
                    (_h = cfg.session) === null || _h === void 0 ? void 0 : _h.store,
                    { agentId: defaultAgentId },
                  ),
                );
          start = Date.now();
          cappedTimeout = Math.max(
            1000,
            timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : DEFAULT_TIMEOUT_MS,
          );
          doProbe = (params === null || params === void 0 ? void 0 : params.probe) !== false;
          channels = {};
          channelOrder = (0, index_js_1.listChannelPlugins)().map(function (plugin) {
            return plugin.id;
          });
          channelLabels = {};
          ((_i = 0), (_b = (0, index_js_1.listChannelPlugins)()));
          _u.label = 1;
        case 1:
          if (!(_i < _b.length)) {
            return [3 /*break*/, 16];
          }
          plugin = _b[_i];
          channelLabels[plugin.id] =
            (_j = plugin.meta.label) !== null && _j !== void 0 ? _j : plugin.id;
          accountIds = plugin.config.listAccountIds(cfg);
          defaultAccountId = (0, helpers_js_1.resolveChannelDefaultAccountId)({
            plugin: plugin,
            cfg: cfg,
            accountIds: accountIds,
          });
          boundAccounts =
            (_l =
              (_k = channelBindings.get(plugin.id)) === null || _k === void 0
                ? void 0
                : _k.get(defaultAgentId)) !== null && _l !== void 0
              ? _l
              : [];
          preferredAccountId = (0, bindings_js_1.resolvePreferredAccountId)({
            accountIds: accountIds,
            defaultAccountId: defaultAccountId,
            boundAccounts: boundAccounts,
          });
          boundAccountIdsAll = Array.from(
            new Set(
              Array.from(
                (_o =
                  (_m = channelBindings.get(plugin.id)) === null || _m === void 0
                    ? void 0
                    : _m.values()) !== null && _o !== void 0
                  ? _o
                  : [],
              ).flatMap(function (ids) {
                return ids;
              }),
            ),
          );
          accountIdsToProbe = Array.from(
            new Set(
              __spreadArray(
                __spreadArray([preferredAccountId, defaultAccountId], accountIds, true),
                boundAccountIdsAll,
                true,
              ).filter(function (value) {
                return value && value.trim();
              }),
            ),
          );
          debugHealth("channel", {
            id: plugin.id,
            accountIds: accountIds,
            defaultAccountId: defaultAccountId,
            boundAccounts: boundAccounts,
            preferredAccountId: preferredAccountId,
            accountIdsToProbe: accountIdsToProbe,
          });
          accountSummaries = {};
          ((_c = 0), (accountIdsToProbe_1 = accountIdsToProbe));
          _u.label = 2;
        case 2:
          if (!(_c < accountIdsToProbe_1.length)) {
            return [3 /*break*/, 14];
          }
          accountId = accountIdsToProbe_1[_c];
          account = plugin.config.resolveAccount(cfg, accountId);
          enabled = plugin.config.isEnabled
            ? plugin.config.isEnabled(account, cfg)
            : isAccountEnabled(account);
          if (!plugin.config.isConfigured) {
            return [3 /*break*/, 4];
          }
          return [4 /*yield*/, plugin.config.isConfigured(account, cfg)];
        case 3:
          _d = _u.sent();
          return [3 /*break*/, 5];
        case 4:
          _d = true;
          _u.label = 5;
        case 5:
          configured = _d;
          probe = void 0;
          lastProbeAt = null;
          if (
            !(
              enabled &&
              configured &&
              doProbe &&
              ((_p = plugin.status) === null || _p === void 0 ? void 0 : _p.probeAccount)
            )
          ) {
            return [3 /*break*/, 9];
          }
          _u.label = 6;
        case 6:
          _u.trys.push([6, 8, , 9]);
          return [
            4 /*yield*/,
            plugin.status.probeAccount({
              account: account,
              timeoutMs: cappedTimeout,
              cfg: cfg,
            }),
          ];
        case 7:
          probe = _u.sent();
          lastProbeAt = Date.now();
          return [3 /*break*/, 9];
        case 8:
          err_1 = _u.sent();
          probe = { ok: false, error: (0, errors_js_1.formatErrorMessage)(err_1) };
          lastProbeAt = Date.now();
          return [3 /*break*/, 9];
        case 9:
          probeRecord = probe && typeof probe === "object" ? probe : null;
          bot = probeRecord && typeof probeRecord.bot === "object" ? probeRecord.bot : null;
          if (bot === null || bot === void 0 ? void 0 : bot.username) {
            debugHealth("probe.bot", {
              channel: plugin.id,
              accountId: accountId,
              username: bot.username,
            });
          }
          snapshot = {
            accountId: accountId,
            enabled: enabled,
            configured: configured,
          };
          if (probe !== undefined) {
            snapshot.probe = probe;
          }
          if (lastProbeAt) {
            snapshot.lastProbeAt = lastProbeAt;
          }
          if (!((_q = plugin.status) === null || _q === void 0 ? void 0 : _q.buildChannelSummary)) {
            return [3 /*break*/, 11];
          }
          return [
            4 /*yield*/,
            plugin.status.buildChannelSummary({
              account: account,
              cfg: cfg,
              defaultAccountId: accountId,
              snapshot: snapshot,
            }),
          ];
        case 10:
          _e = _u.sent();
          return [3 /*break*/, 12];
        case 11:
          _e = undefined;
          _u.label = 12;
        case 12:
          summary_1 = _e;
          record =
            summary_1 && typeof summary_1 === "object"
              ? summary_1
              : {
                  accountId: accountId,
                  configured: configured,
                  probe: probe,
                  lastProbeAt: lastProbeAt,
                };
          if (record.configured === undefined) {
            record.configured = configured;
          }
          if (record.lastProbeAt === undefined && lastProbeAt) {
            record.lastProbeAt = lastProbeAt;
          }
          record.accountId = accountId;
          accountSummaries[accountId] = record;
          _u.label = 13;
        case 13:
          _c++;
          return [3 /*break*/, 2];
        case 14:
          defaultSummary =
            (_s =
              (_r = accountSummaries[preferredAccountId]) !== null && _r !== void 0
                ? _r
                : accountSummaries[defaultAccountId]) !== null && _s !== void 0
              ? _s
              : accountSummaries[
                  (_t = accountIdsToProbe[0]) !== null && _t !== void 0 ? _t : preferredAccountId
                ];
          fallbackSummary =
            defaultSummary !== null && defaultSummary !== void 0
              ? defaultSummary
              : accountSummaries[Object.keys(accountSummaries)[0]];
          if (fallbackSummary) {
            channels[plugin.id] = __assign(__assign({}, fallbackSummary), {
              accounts: accountSummaries,
            });
          }
          _u.label = 15;
        case 15:
          _i++;
          return [3 /*break*/, 1];
        case 16:
          summary = {
            ok: true,
            ts: Date.now(),
            durationMs: Date.now() - start,
            channels: channels,
            channelOrder: channelOrder,
            channelLabels: channelLabels,
            heartbeatSeconds: heartbeatSeconds,
            defaultAgentId: defaultAgentId,
            agents: agents,
            sessions: {
              path: sessions.path,
              count: sessions.count,
              recent: sessions.recent,
            },
          };
          return [2 /*return*/, summary];
      }
    });
  });
}
function healthCommand(opts, runtime) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      summary,
      fatal,
      debugEnabled,
      details,
      _i,
      _a,
      line,
      localAgents_1,
      defaultAgentId_1,
      agents,
      fallbackAgents,
      resolvedAgents_1,
      displayAgents_2,
      channelBindings_1,
      _b,
      _c,
      plugin,
      accountIds,
      defaultAccountId,
      _d,
      accountIds_1,
      accountId,
      account,
      record,
      tokenSource,
      configured,
      _e,
      _f,
      _g,
      _h,
      channelId,
      byAgent,
      entries,
      _j,
      _k,
      _l,
      channelId,
      channelSummary,
      accounts,
      probes,
      channelAccountFallbacks_1,
      accountIdsByChannel,
      channelLines,
      _m,
      channelLines_1,
      line,
      _o,
      _p,
      plugin,
      channelSummary,
      boundAccounts,
      accountIds,
      defaultAccountId,
      accountId,
      account,
      agentLabels,
      heartbeatParts,
      _q,
      _r,
      r,
      _s,
      displayAgents_1,
      agent,
      _t,
      _u,
      r;
    var _this = this;
    var _v, _w, _x, _y, _z, _0, _1, _2;
    return __generator(this, function (_3) {
      switch (_3.label) {
        case 0:
          cfg = (_v = opts.config) !== null && _v !== void 0 ? _v : (0, config_js_1.loadConfig)();
          return [
            4 /*yield*/,
            (0, progress_js_1.withProgress)(
              {
                label: "Checking gateway health…",
                indeterminate: true,
                enabled: opts.json !== true,
              },
              function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [
                          4 /*yield*/,
                          (0, call_js_1.callGateway)({
                            method: "health",
                            params: opts.verbose ? { probe: true } : undefined,
                            timeoutMs: opts.timeoutMs,
                            config: cfg,
                          }),
                        ];
                      case 1:
                        return [2 /*return*/, _a.sent()];
                    }
                  });
                });
              },
            ),
          ];
        case 1:
          summary = _3.sent();
          fatal = false;
          if (!opts.json) {
            return [3 /*break*/, 2];
          }
          runtime.log(JSON.stringify(summary, null, 2));
          return [3 /*break*/, 12];
        case 2:
          debugEnabled = (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_DEBUG_HEALTH);
          if (opts.verbose) {
            details = (0, call_js_1.buildGatewayConnectionDetails)({ config: cfg });
            runtime.log((0, globals_js_1.info)("Gateway connection:"));
            for (_i = 0, _a = details.message.split("\n"); _i < _a.length; _i++) {
              line = _a[_i];
              runtime.log("  ".concat(line));
            }
          }
          localAgents_1 = resolveAgentOrder(cfg);
          defaultAgentId_1 =
            (_w = summary.defaultAgentId) !== null && _w !== void 0
              ? _w
              : localAgents_1.defaultAgentId;
          agents = Array.isArray(summary.agents) ? summary.agents : [];
          fallbackAgents = localAgents_1.ordered.map(function (entry) {
            var _a;
            var storePath = (0, sessions_js_1.resolveStorePath)(
              (_a = cfg.session) === null || _a === void 0 ? void 0 : _a.store,
              { agentId: entry.id },
            );
            return {
              agentId: entry.id,
              name: entry.name,
              isDefault: entry.id === localAgents_1.defaultAgentId,
              heartbeat: resolveHeartbeatSummary(cfg, entry.id),
              sessions: buildSessionSummary(storePath),
            };
          });
          resolvedAgents_1 = agents.length > 0 ? agents : fallbackAgents;
          displayAgents_2 = opts.verbose
            ? resolvedAgents_1
            : resolvedAgents_1.filter(function (agent) {
                return agent.agentId === defaultAgentId_1;
              });
          channelBindings_1 = (0, bindings_js_1.buildChannelAccountBindings)(cfg);
          if (!debugEnabled) {
            return [3 /*break*/, 11];
          }
          runtime.log((0, globals_js_1.info)("[debug] local channel accounts"));
          ((_b = 0), (_c = (0, index_js_1.listChannelPlugins)()));
          _3.label = 3;
        case 3:
          if (!(_b < _c.length)) {
            return [3 /*break*/, 10];
          }
          plugin = _c[_b];
          accountIds = plugin.config.listAccountIds(cfg);
          defaultAccountId = (0, helpers_js_1.resolveChannelDefaultAccountId)({
            plugin: plugin,
            cfg: cfg,
            accountIds: accountIds,
          });
          runtime.log(
            "  "
              .concat(plugin.id, ": accounts=")
              .concat(accountIds.join(", ") || "(none)", " default=")
              .concat(defaultAccountId),
          );
          ((_d = 0), (accountIds_1 = accountIds));
          _3.label = 4;
        case 4:
          if (!(_d < accountIds_1.length)) {
            return [3 /*break*/, 9];
          }
          accountId = accountIds_1[_d];
          account = plugin.config.resolveAccount(cfg, accountId);
          record = asRecord(account);
          tokenSource =
            record && typeof record.tokenSource === "string" ? record.tokenSource : undefined;
          if (!plugin.config.isConfigured) {
            return [3 /*break*/, 6];
          }
          return [4 /*yield*/, plugin.config.isConfigured(account, cfg)];
        case 5:
          _e = _3.sent();
          return [3 /*break*/, 7];
        case 6:
          _e = true;
          _3.label = 7;
        case 7:
          configured = _e;
          runtime.log(
            "    - "
              .concat(accountId, ": configured=")
              .concat(configured)
              .concat(tokenSource ? " tokenSource=".concat(tokenSource) : ""),
          );
          _3.label = 8;
        case 8:
          _d++;
          return [3 /*break*/, 4];
        case 9:
          _b++;
          return [3 /*break*/, 3];
        case 10:
          runtime.log((0, globals_js_1.info)("[debug] bindings map"));
          for (_f = 0, _g = channelBindings_1.entries(); _f < _g.length; _f++) {
            ((_h = _g[_f]), (channelId = _h[0]), (byAgent = _h[1]));
            entries = Array.from(byAgent.entries()).map(function (_a) {
              var agentId = _a[0],
                ids = _a[1];
              return "".concat(agentId, "=[").concat(ids.join(", "), "]");
            });
            runtime.log("  ".concat(channelId, ": ").concat(entries.join(" ")));
          }
          runtime.log((0, globals_js_1.info)("[debug] gateway channel probes"));
          for (
            _j = 0,
              _k = Object.entries((_x = summary.channels) !== null && _x !== void 0 ? _x : {});
            _j < _k.length;
            _j++
          ) {
            ((_l = _k[_j]), (channelId = _l[0]), (channelSummary = _l[1]));
            accounts = (_y = channelSummary.accounts) !== null && _y !== void 0 ? _y : {};
            probes = Object.entries(accounts).map(function (_a) {
              var accountId = _a[0],
                accountSummary = _a[1];
              var probe = asRecord(accountSummary.probe);
              var bot = probe ? asRecord(probe.bot) : null;
              var username = bot && typeof bot.username === "string" ? bot.username : null;
              return ""
                .concat(accountId, "=")
                .concat(username !== null && username !== void 0 ? username : "(no bot)");
            });
            runtime.log("  ".concat(channelId, ": ").concat(probes.join(", ") || "(none)"));
          }
          _3.label = 11;
        case 11:
          channelAccountFallbacks_1 = Object.fromEntries(
            (0, index_js_1.listChannelPlugins)().map(function (plugin) {
              var _a, _b;
              var accountIds = plugin.config.listAccountIds(cfg);
              var defaultAccountId = (0, helpers_js_1.resolveChannelDefaultAccountId)({
                plugin: plugin,
                cfg: cfg,
                accountIds: accountIds,
              });
              var preferred = (0, bindings_js_1.resolvePreferredAccountId)({
                accountIds: accountIds,
                defaultAccountId: defaultAccountId,
                boundAccounts:
                  (_b =
                    (_a = channelBindings_1.get(plugin.id)) === null || _a === void 0
                      ? void 0
                      : _a.get(defaultAgentId_1)) !== null && _b !== void 0
                    ? _b
                    : [],
              });
              return [plugin.id, [preferred]];
            }),
          );
          accountIdsByChannel = (function () {
            var _a;
            var entries = displayAgents_2.length > 0 ? displayAgents_2 : resolvedAgents_1;
            var byChannel = {};
            for (var _i = 0, _b = channelBindings_1.entries(); _i < _b.length; _i++) {
              var _c = _b[_i],
                channelId = _c[0],
                byAgent = _c[1];
              var accountIds = [];
              for (var _d = 0, entries_2 = entries; _d < entries_2.length; _d++) {
                var agent = entries_2[_d];
                var ids = (_a = byAgent.get(agent.agentId)) !== null && _a !== void 0 ? _a : [];
                for (var _e = 0, ids_1 = ids; _e < ids_1.length; _e++) {
                  var id = ids_1[_e];
                  if (!accountIds.includes(id)) {
                    accountIds.push(id);
                  }
                }
              }
              if (accountIds.length > 0) {
                byChannel[channelId] = accountIds;
              }
            }
            for (var _f = 0, _g = Object.entries(channelAccountFallbacks_1); _f < _g.length; _f++) {
              var _h = _g[_f],
                channelId = _h[0],
                fallbackIds = _h[1];
              if (!byChannel[channelId] || byChannel[channelId].length === 0) {
                byChannel[channelId] = fallbackIds;
              }
            }
            return byChannel;
          })();
          channelLines =
            Object.keys(accountIdsByChannel).length > 0
              ? (0, exports.formatHealthChannelLines)(summary, {
                  accountMode: opts.verbose ? "all" : "default",
                  accountIdsByChannel: accountIdsByChannel,
                })
              : (0, exports.formatHealthChannelLines)(summary, {
                  accountMode: opts.verbose ? "all" : "default",
                });
          for (_m = 0, channelLines_1 = channelLines; _m < channelLines_1.length; _m++) {
            line = channelLines_1[_m];
            runtime.log(styleHealthChannelLine(line));
          }
          for (_o = 0, _p = (0, index_js_1.listChannelPlugins)(); _o < _p.length; _o++) {
            plugin = _p[_o];
            channelSummary =
              (_z = summary.channels) === null || _z === void 0 ? void 0 : _z[plugin.id];
            if (!channelSummary || channelSummary.linked !== true) {
              continue;
            }
            if (!((_0 = plugin.status) === null || _0 === void 0 ? void 0 : _0.logSelfId)) {
              continue;
            }
            boundAccounts =
              (_2 =
                (_1 = channelBindings_1.get(plugin.id)) === null || _1 === void 0
                  ? void 0
                  : _1.get(defaultAgentId_1)) !== null && _2 !== void 0
                ? _2
                : [];
            accountIds = plugin.config.listAccountIds(cfg);
            defaultAccountId = (0, helpers_js_1.resolveChannelDefaultAccountId)({
              plugin: plugin,
              cfg: cfg,
              accountIds: accountIds,
            });
            accountId = (0, bindings_js_1.resolvePreferredAccountId)({
              accountIds: accountIds,
              defaultAccountId: defaultAccountId,
              boundAccounts: boundAccounts,
            });
            account = plugin.config.resolveAccount(cfg, accountId);
            plugin.status.logSelfId({
              account: account,
              cfg: cfg,
              runtime: runtime,
              includeChannelPrefix: true,
            });
          }
          if (resolvedAgents_1.length > 0) {
            agentLabels = resolvedAgents_1.map(function (agent) {
              return agent.isDefault ? "".concat(agent.agentId, " (default)") : agent.agentId;
            });
            runtime.log((0, globals_js_1.info)("Agents: ".concat(agentLabels.join(", "))));
          }
          heartbeatParts = displayAgents_2
            .map(function (agent) {
              var _a;
              var everyMs = (_a = agent.heartbeat) === null || _a === void 0 ? void 0 : _a.everyMs;
              var label = everyMs ? formatDurationParts(everyMs) : "disabled";
              return "".concat(label, " (").concat(agent.agentId, ")");
            })
            .filter(Boolean);
          if (heartbeatParts.length > 0) {
            runtime.log(
              (0, globals_js_1.info)("Heartbeat interval: ".concat(heartbeatParts.join(", "))),
            );
          }
          if (displayAgents_2.length === 0) {
            runtime.log(
              (0, globals_js_1.info)(
                "Session store: "
                  .concat(summary.sessions.path, " (")
                  .concat(summary.sessions.count, " entries)"),
              ),
            );
            if (summary.sessions.recent.length > 0) {
              for (_q = 0, _r = summary.sessions.recent; _q < _r.length; _q++) {
                r = _r[_q];
                runtime.log(
                  "- "
                    .concat(r.key, " (")
                    .concat(
                      r.updatedAt
                        ? "".concat(Math.round((Date.now() - r.updatedAt) / 60000), "m ago")
                        : "no activity",
                      ")",
                    ),
                );
              }
            }
          } else {
            for (_s = 0, displayAgents_1 = displayAgents_2; _s < displayAgents_1.length; _s++) {
              agent = displayAgents_1[_s];
              runtime.log(
                (0, globals_js_1.info)(
                  "Session store ("
                    .concat(agent.agentId, "): ")
                    .concat(agent.sessions.path, " (")
                    .concat(agent.sessions.count, " entries)"),
                ),
              );
              if (agent.sessions.recent.length > 0) {
                for (_t = 0, _u = agent.sessions.recent; _t < _u.length; _t++) {
                  r = _u[_t];
                  runtime.log(
                    "- "
                      .concat(r.key, " (")
                      .concat(
                        r.updatedAt
                          ? "".concat(Math.round((Date.now() - r.updatedAt) / 60000), "m ago")
                          : "no activity",
                        ")",
                      ),
                  );
                }
              }
            }
          }
          _3.label = 12;
        case 12:
          if (fatal) {
            runtime.exit(1);
          }
          return [2 /*return*/];
      }
    });
  });
}
