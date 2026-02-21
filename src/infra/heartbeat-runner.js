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
exports.setHeartbeatsEnabled = setHeartbeatsEnabled;
exports.isHeartbeatEnabledForAgent = isHeartbeatEnabledForAgent;
exports.resolveHeartbeatSummaryForAgent = resolveHeartbeatSummaryForAgent;
exports.resolveHeartbeatIntervalMs = resolveHeartbeatIntervalMs;
exports.resolveHeartbeatPrompt = resolveHeartbeatPrompt;
exports.runHeartbeatOnce = runHeartbeatOnce;
exports.startHeartbeatRunner = startHeartbeatRunner;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var date_time_js_1 = require("../agents/date-time.js");
var identity_js_1 = require("../agents/identity.js");
var workspace_js_1 = require("../agents/workspace.js");
var heartbeat_js_1 = require("../auto-reply/heartbeat.js");
var tokens_js_1 = require("../auto-reply/tokens.js");
var reply_js_1 = require("../auto-reply/reply.js");
var index_js_1 = require("../channels/plugins/index.js");
var parse_duration_js_1 = require("../cli/parse-duration.js");
var config_js_1 = require("../config/config.js");
var sessions_js_1 = require("../config/sessions.js");
var errors_js_1 = require("../infra/errors.js");
var system_events_js_1 = require("../infra/system-events.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var command_queue_js_1 = require("../process/command-queue.js");
var runtime_js_1 = require("../runtime.js");
var session_key_js_1 = require("../routing/session-key.js");
var heartbeat_events_js_1 = require("./heartbeat-events.js");
var heartbeat_visibility_js_1 = require("./heartbeat-visibility.js");
var heartbeat_wake_js_1 = require("./heartbeat-wake.js");
var deliver_js_1 = require("./outbound/deliver.js");
var targets_js_1 = require("./outbound/targets.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("gateway/heartbeat");
var heartbeatsEnabled = true;
function setHeartbeatsEnabled(enabled) {
  heartbeatsEnabled = enabled;
}
var DEFAULT_HEARTBEAT_TARGET = "last";
var ACTIVE_HOURS_TIME_PATTERN = /^([01]\d|2[0-3]|24):([0-5]\d)$/;
// Prompt used when an async exec has completed and the result should be relayed to the user.
// This overrides the standard heartbeat prompt to ensure the model responds with the exec result
// instead of just "HEARTBEAT_OK".
var EXEC_EVENT_PROMPT =
  "An async command you ran earlier has completed. The result is shown in the system messages above. " +
  "Please relay the command output to the user in a helpful way. If the command succeeded, share the relevant output. " +
  "If it failed, explain what went wrong.";
function resolveActiveHoursTimezone(cfg, raw) {
  var _a, _b, _c, _d;
  var trimmed = raw === null || raw === void 0 ? void 0 : raw.trim();
  if (!trimmed || trimmed === "user") {
    return (0, date_time_js_1.resolveUserTimezone)(
      (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null ||
        _b === void 0
        ? void 0
        : _b.userTimezone,
    );
  }
  if (trimmed === "local") {
    var host = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (host === null || host === void 0 ? void 0 : host.trim()) || "UTC";
  }
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: trimmed }).format(new Date());
    return trimmed;
  } catch (_e) {
    return (0, date_time_js_1.resolveUserTimezone)(
      (_d = (_c = cfg.agents) === null || _c === void 0 ? void 0 : _c.defaults) === null ||
        _d === void 0
        ? void 0
        : _d.userTimezone,
    );
  }
}
function parseActiveHoursTime(opts, raw) {
  if (!raw || !ACTIVE_HOURS_TIME_PATTERN.test(raw)) {
    return null;
  }
  var _a = raw.split(":"),
    hourStr = _a[0],
    minuteStr = _a[1];
  var hour = Number(hourStr);
  var minute = Number(minuteStr);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return null;
  }
  if (hour === 24) {
    if (!opts.allow24 || minute !== 0) {
      return null;
    }
    return 24 * 60;
  }
  return hour * 60 + minute;
}
function resolveMinutesInTimeZone(nowMs, timeZone) {
  try {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(nowMs));
    var map = {};
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
      var part = parts_1[_i];
      if (part.type !== "literal") {
        map[part.type] = part.value;
      }
    }
    var hour = Number(map.hour);
    var minute = Number(map.minute);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
      return null;
    }
    return hour * 60 + minute;
  } catch (_a) {
    return null;
  }
}
function isWithinActiveHours(cfg, heartbeat, nowMs) {
  var active = heartbeat === null || heartbeat === void 0 ? void 0 : heartbeat.activeHours;
  if (!active) {
    return true;
  }
  var startMin = parseActiveHoursTime({ allow24: false }, active.start);
  var endMin = parseActiveHoursTime({ allow24: true }, active.end);
  if (startMin === null || endMin === null) {
    return true;
  }
  if (startMin === endMin) {
    return true;
  }
  var timeZone = resolveActiveHoursTimezone(cfg, active.timezone);
  var currentMin = resolveMinutesInTimeZone(
    nowMs !== null && nowMs !== void 0 ? nowMs : Date.now(),
    timeZone,
  );
  if (currentMin === null) {
    return true;
  }
  if (endMin > startMin) {
    return currentMin >= startMin && currentMin < endMin;
  }
  return currentMin >= startMin || currentMin < endMin;
}
function hasExplicitHeartbeatAgents(cfg) {
  var _a, _b;
  var list =
    (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.list) !== null && _b !== void 0
      ? _b
      : [];
  return list.some(function (entry) {
    return Boolean(entry === null || entry === void 0 ? void 0 : entry.heartbeat);
  });
}
function isHeartbeatEnabledForAgent(cfg, agentId) {
  var _a, _b;
  var resolvedAgentId = (0, session_key_js_1.normalizeAgentId)(
    agentId !== null && agentId !== void 0
      ? agentId
      : (0, agent_scope_js_1.resolveDefaultAgentId)(cfg),
  );
  var list =
    (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.list) !== null && _b !== void 0
      ? _b
      : [];
  var hasExplicit = hasExplicitHeartbeatAgents(cfg);
  if (hasExplicit) {
    return list.some(function (entry) {
      return (
        Boolean(entry === null || entry === void 0 ? void 0 : entry.heartbeat) &&
        (0, session_key_js_1.normalizeAgentId)(
          entry === null || entry === void 0 ? void 0 : entry.id,
        ) === resolvedAgentId
      );
    });
  }
  return resolvedAgentId === (0, agent_scope_js_1.resolveDefaultAgentId)(cfg);
}
function resolveHeartbeatConfig(cfg, agentId) {
  var _a, _b, _c;
  var defaults =
    (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null ||
    _b === void 0
      ? void 0
      : _b.heartbeat;
  if (!agentId) {
    return defaults;
  }
  var overrides =
    (_c = (0, agent_scope_js_1.resolveAgentConfig)(cfg, agentId)) === null || _c === void 0
      ? void 0
      : _c.heartbeat;
  if (!defaults && !overrides) {
    return overrides;
  }
  return __assign(__assign({}, defaults), overrides);
}
function resolveHeartbeatSummaryForAgent(cfg, agentId) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
  var defaults =
    (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null ||
    _b === void 0
      ? void 0
      : _b.heartbeat;
  var overrides = agentId
    ? (_c = (0, agent_scope_js_1.resolveAgentConfig)(cfg, agentId)) === null || _c === void 0
      ? void 0
      : _c.heartbeat
    : undefined;
  var enabled = isHeartbeatEnabledForAgent(cfg, agentId);
  if (!enabled) {
    return {
      enabled: false,
      every: "disabled",
      everyMs: null,
      prompt: (0, heartbeat_js_1.resolveHeartbeatPrompt)(
        defaults === null || defaults === void 0 ? void 0 : defaults.prompt,
      ),
      target:
        (_d = defaults === null || defaults === void 0 ? void 0 : defaults.target) !== null &&
        _d !== void 0
          ? _d
          : DEFAULT_HEARTBEAT_TARGET,
      model: defaults === null || defaults === void 0 ? void 0 : defaults.model,
      ackMaxChars: Math.max(
        0,
        (_e = defaults === null || defaults === void 0 ? void 0 : defaults.ackMaxChars) !== null &&
          _e !== void 0
          ? _e
          : heartbeat_js_1.DEFAULT_HEARTBEAT_ACK_MAX_CHARS,
      ),
    };
  }
  var merged = defaults || overrides ? __assign(__assign({}, defaults), overrides) : undefined;
  var every =
    (_h =
      (_g =
        (_f = merged === null || merged === void 0 ? void 0 : merged.every) !== null &&
        _f !== void 0
          ? _f
          : defaults === null || defaults === void 0
            ? void 0
            : defaults.every) !== null && _g !== void 0
        ? _g
        : overrides === null || overrides === void 0
          ? void 0
          : overrides.every) !== null && _h !== void 0
      ? _h
      : heartbeat_js_1.DEFAULT_HEARTBEAT_EVERY;
  var everyMs = resolveHeartbeatIntervalMs(cfg, undefined, merged);
  var prompt = (0, heartbeat_js_1.resolveHeartbeatPrompt)(
    (_k =
      (_j = merged === null || merged === void 0 ? void 0 : merged.prompt) !== null && _j !== void 0
        ? _j
        : defaults === null || defaults === void 0
          ? void 0
          : defaults.prompt) !== null && _k !== void 0
      ? _k
      : overrides === null || overrides === void 0
        ? void 0
        : overrides.prompt,
  );
  var target =
    (_o =
      (_m =
        (_l = merged === null || merged === void 0 ? void 0 : merged.target) !== null &&
        _l !== void 0
          ? _l
          : defaults === null || defaults === void 0
            ? void 0
            : defaults.target) !== null && _m !== void 0
        ? _m
        : overrides === null || overrides === void 0
          ? void 0
          : overrides.target) !== null && _o !== void 0
      ? _o
      : DEFAULT_HEARTBEAT_TARGET;
  var model =
    (_q =
      (_p = merged === null || merged === void 0 ? void 0 : merged.model) !== null && _p !== void 0
        ? _p
        : defaults === null || defaults === void 0
          ? void 0
          : defaults.model) !== null && _q !== void 0
      ? _q
      : overrides === null || overrides === void 0
        ? void 0
        : overrides.model;
  var ackMaxChars = Math.max(
    0,
    (_t =
      (_s =
        (_r = merged === null || merged === void 0 ? void 0 : merged.ackMaxChars) !== null &&
        _r !== void 0
          ? _r
          : defaults === null || defaults === void 0
            ? void 0
            : defaults.ackMaxChars) !== null && _s !== void 0
        ? _s
        : overrides === null || overrides === void 0
          ? void 0
          : overrides.ackMaxChars) !== null && _t !== void 0
      ? _t
      : heartbeat_js_1.DEFAULT_HEARTBEAT_ACK_MAX_CHARS,
  );
  return {
    enabled: true,
    every: every,
    everyMs: everyMs,
    prompt: prompt,
    target: target,
    model: model,
    ackMaxChars: ackMaxChars,
  };
}
function resolveHeartbeatAgents(cfg) {
  var _a, _b;
  var list =
    (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.list) !== null && _b !== void 0
      ? _b
      : [];
  if (hasExplicitHeartbeatAgents(cfg)) {
    return list
      .filter(function (entry) {
        return entry === null || entry === void 0 ? void 0 : entry.heartbeat;
      })
      .map(function (entry) {
        var id = (0, session_key_js_1.normalizeAgentId)(entry.id);
        return { agentId: id, heartbeat: resolveHeartbeatConfig(cfg, id) };
      })
      .filter(function (entry) {
        return entry.agentId;
      });
  }
  var fallbackId = (0, agent_scope_js_1.resolveDefaultAgentId)(cfg);
  return [{ agentId: fallbackId, heartbeat: resolveHeartbeatConfig(cfg, fallbackId) }];
}
function resolveHeartbeatIntervalMs(cfg, overrideEvery, heartbeat) {
  var _a, _b, _c, _d, _e;
  var raw =
    (_e =
      (_a =
        overrideEvery !== null && overrideEvery !== void 0
          ? overrideEvery
          : heartbeat === null || heartbeat === void 0
            ? void 0
            : heartbeat.every) !== null && _a !== void 0
        ? _a
        : (_d =
              (_c = (_b = cfg.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null ||
              _c === void 0
                ? void 0
                : _c.heartbeat) === null || _d === void 0
          ? void 0
          : _d.every) !== null && _e !== void 0
      ? _e
      : heartbeat_js_1.DEFAULT_HEARTBEAT_EVERY;
  if (!raw) {
    return null;
  }
  var trimmed = String(raw).trim();
  if (!trimmed) {
    return null;
  }
  var ms;
  try {
    ms = (0, parse_duration_js_1.parseDurationMs)(trimmed, { defaultUnit: "m" });
  } catch (_f) {
    return null;
  }
  if (ms <= 0) {
    return null;
  }
  return ms;
}
function resolveHeartbeatPrompt(cfg, heartbeat) {
  var _a, _b, _c, _d;
  return (0, heartbeat_js_1.resolveHeartbeatPrompt)(
    (_a = heartbeat === null || heartbeat === void 0 ? void 0 : heartbeat.prompt) !== null &&
      _a !== void 0
      ? _a
      : (_d =
            (_c = (_b = cfg.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null ||
            _c === void 0
              ? void 0
              : _c.heartbeat) === null || _d === void 0
        ? void 0
        : _d.prompt,
  );
}
function resolveHeartbeatAckMaxChars(cfg, heartbeat) {
  var _a, _b, _c, _d, _e;
  return Math.max(
    0,
    (_e =
      (_a = heartbeat === null || heartbeat === void 0 ? void 0 : heartbeat.ackMaxChars) !== null &&
      _a !== void 0
        ? _a
        : (_d =
              (_c = (_b = cfg.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null ||
              _c === void 0
                ? void 0
                : _c.heartbeat) === null || _d === void 0
          ? void 0
          : _d.ackMaxChars) !== null && _e !== void 0
      ? _e
      : heartbeat_js_1.DEFAULT_HEARTBEAT_ACK_MAX_CHARS,
  );
}
function resolveHeartbeatSession(cfg, agentId, heartbeat) {
  var _a, _b, _c, _d;
  var sessionCfg = cfg.session;
  var scope =
    (_a = sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.scope) !== null &&
    _a !== void 0
      ? _a
      : "per-sender";
  var resolvedAgentId = (0, session_key_js_1.normalizeAgentId)(
    agentId !== null && agentId !== void 0
      ? agentId
      : (0, agent_scope_js_1.resolveDefaultAgentId)(cfg),
  );
  var mainSessionKey =
    scope === "global"
      ? "global"
      : (0, sessions_js_1.resolveAgentMainSessionKey)({ cfg: cfg, agentId: resolvedAgentId });
  var storeAgentId =
    scope === "global" ? (0, agent_scope_js_1.resolveDefaultAgentId)(cfg) : resolvedAgentId;
  var storePath = (0, sessions_js_1.resolveStorePath)(
    sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.store,
    { agentId: storeAgentId },
  );
  var store = (0, sessions_js_1.loadSessionStore)(storePath);
  var mainEntry = store[mainSessionKey];
  if (scope === "global") {
    return { sessionKey: mainSessionKey, storePath: storePath, store: store, entry: mainEntry };
  }
  var trimmed =
    (_c =
      (_b = heartbeat === null || heartbeat === void 0 ? void 0 : heartbeat.session) === null ||
      _b === void 0
        ? void 0
        : _b.trim()) !== null && _c !== void 0
      ? _c
      : "";
  if (!trimmed) {
    return { sessionKey: mainSessionKey, storePath: storePath, store: store, entry: mainEntry };
  }
  var normalized = trimmed.toLowerCase();
  if (normalized === "main" || normalized === "global") {
    return { sessionKey: mainSessionKey, storePath: storePath, store: store, entry: mainEntry };
  }
  var candidate = (0, session_key_js_1.toAgentStoreSessionKey)({
    agentId: resolvedAgentId,
    requestKey: trimmed,
    mainKey: (_d = cfg.session) === null || _d === void 0 ? void 0 : _d.mainKey,
  });
  var canonical = (0, sessions_js_1.canonicalizeMainSessionAlias)({
    cfg: cfg,
    agentId: resolvedAgentId,
    sessionKey: candidate,
  });
  if (canonical !== "global") {
    var sessionAgentId = (0, sessions_js_1.resolveAgentIdFromSessionKey)(canonical);
    if (sessionAgentId === (0, session_key_js_1.normalizeAgentId)(resolvedAgentId)) {
      return { sessionKey: canonical, storePath: storePath, store: store, entry: store[canonical] };
    }
  }
  return { sessionKey: mainSessionKey, storePath: storePath, store: store, entry: mainEntry };
}
function resolveHeartbeatReplyPayload(replyResult) {
  if (!replyResult) {
    return undefined;
  }
  if (!Array.isArray(replyResult)) {
    return replyResult;
  }
  for (var idx = replyResult.length - 1; idx >= 0; idx -= 1) {
    var payload = replyResult[idx];
    if (!payload) {
      continue;
    }
    if (payload.text || payload.mediaUrl || (payload.mediaUrls && payload.mediaUrls.length > 0)) {
      return payload;
    }
  }
  return undefined;
}
function resolveHeartbeatReasoningPayloads(replyResult) {
  var payloads = Array.isArray(replyResult) ? replyResult : replyResult ? [replyResult] : [];
  return payloads.filter(function (payload) {
    var text = typeof payload.text === "string" ? payload.text : "";
    return text.trimStart().startsWith("Reasoning:");
  });
}
function restoreHeartbeatUpdatedAt(params) {
  return __awaiter(this, void 0, void 0, function () {
    var storePath, sessionKey, updatedAt, store, entry, nextUpdatedAt;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ((storePath = params.storePath),
            (sessionKey = params.sessionKey),
            (updatedAt = params.updatedAt));
          if (typeof updatedAt !== "number") {
            return [2 /*return*/];
          }
          store = (0, sessions_js_1.loadSessionStore)(storePath);
          entry = store[sessionKey];
          if (!entry) {
            return [2 /*return*/];
          }
          nextUpdatedAt = Math.max(
            (_a = entry.updatedAt) !== null && _a !== void 0 ? _a : 0,
            updatedAt,
          );
          if (entry.updatedAt === nextUpdatedAt) {
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(storePath, function (nextStore) {
              var _a, _b;
              var nextEntry = (_a = nextStore[sessionKey]) !== null && _a !== void 0 ? _a : entry;
              if (!nextEntry) {
                return;
              }
              var resolvedUpdatedAt = Math.max(
                (_b = nextEntry.updatedAt) !== null && _b !== void 0 ? _b : 0,
                updatedAt,
              );
              if (nextEntry.updatedAt === resolvedUpdatedAt) {
                return;
              }
              nextStore[sessionKey] = __assign(__assign({}, nextEntry), {
                updatedAt: resolvedUpdatedAt,
              });
            }),
          ];
        case 1:
          _b.sent();
          return [2 /*return*/];
      }
    });
  });
}
function normalizeHeartbeatReply(payload, responsePrefix, ackMaxChars) {
  var _a, _b;
  var stripped = (0, heartbeat_js_1.stripHeartbeatToken)(payload.text, {
    mode: "heartbeat",
    maxAckChars: ackMaxChars,
  });
  var hasMedia = Boolean(
    payload.mediaUrl ||
    ((_b = (_a = payload.mediaUrls) === null || _a === void 0 ? void 0 : _a.length) !== null &&
    _b !== void 0
      ? _b
      : 0) > 0,
  );
  if (stripped.shouldSkip && !hasMedia) {
    return {
      shouldSkip: true,
      text: "",
      hasMedia: hasMedia,
    };
  }
  var finalText = stripped.text;
  if (responsePrefix && finalText && !finalText.startsWith(responsePrefix)) {
    finalText = "".concat(responsePrefix, " ").concat(finalText);
  }
  return { shouldSkip: false, text: finalText, hasMedia: hasMedia };
}
function runHeartbeatOnce(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      agentId,
      heartbeat,
      startedAt,
      queueSize,
      isExecEventReason,
      workspaceDir,
      heartbeatFilePath,
      heartbeatFileContent,
      _a,
      _b,
      entry,
      sessionKey,
      storePath,
      previousUpdatedAt,
      delivery,
      visibility,
      sender,
      responsePrefix,
      isExecEvent,
      pendingEvents,
      hasExecCompletion,
      prompt,
      ctx,
      heartbeatOkText,
      canAttemptHeartbeatOk,
      maybeSendHeartbeatOk,
      replyResult,
      replyPayload_1,
      includeReasoning,
      reasoningPayloads,
      okSent,
      ackMaxChars,
      normalized,
      execFallbackText,
      shouldSkipMain,
      okSent,
      mediaUrls,
      prevHeartbeatText,
      prevHeartbeatAt,
      isDuplicateMain,
      previewText,
      deliveryAccountId,
      heartbeatPlugin,
      readiness,
      store,
      current,
      err_1,
      reason;
    var _this = this;
    var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    return __generator(this, function (_r) {
      switch (_r.label) {
        case 0:
          cfg = (_c = opts.cfg) !== null && _c !== void 0 ? _c : (0, config_js_1.loadConfig)();
          agentId = (0, session_key_js_1.normalizeAgentId)(
            (_d = opts.agentId) !== null && _d !== void 0
              ? _d
              : (0, agent_scope_js_1.resolveDefaultAgentId)(cfg),
          );
          heartbeat =
            (_e = opts.heartbeat) !== null && _e !== void 0
              ? _e
              : resolveHeartbeatConfig(cfg, agentId);
          if (!heartbeatsEnabled) {
            return [2 /*return*/, { status: "skipped", reason: "disabled" }];
          }
          if (!isHeartbeatEnabledForAgent(cfg, agentId)) {
            return [2 /*return*/, { status: "skipped", reason: "disabled" }];
          }
          if (!resolveHeartbeatIntervalMs(cfg, undefined, heartbeat)) {
            return [2 /*return*/, { status: "skipped", reason: "disabled" }];
          }
          startedAt =
            (_h =
              (_g = (_f = opts.deps) === null || _f === void 0 ? void 0 : _f.nowMs) === null ||
              _g === void 0
                ? void 0
                : _g.call(_f)) !== null && _h !== void 0
              ? _h
              : Date.now();
          if (!isWithinActiveHours(cfg, heartbeat, startedAt)) {
            return [2 /*return*/, { status: "skipped", reason: "quiet-hours" }];
          }
          queueSize = (
            (_k = (_j = opts.deps) === null || _j === void 0 ? void 0 : _j.getQueueSize) !== null &&
              _k !== void 0
              ? _k
              : command_queue_js_1.getQueueSize
          )("main" /* CommandLane.Main */);
          if (queueSize > 0) {
            return [2 /*return*/, { status: "skipped", reason: "requests-in-flight" }];
          }
          isExecEventReason = opts.reason === "exec-event";
          workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, agentId);
          heartbeatFilePath = node_path_1.default.join(
            workspaceDir,
            workspace_js_1.DEFAULT_HEARTBEAT_FILENAME,
          );
          _r.label = 1;
        case 1:
          _r.trys.push([1, 3, , 4]);
          return [4 /*yield*/, promises_1.default.readFile(heartbeatFilePath, "utf-8")];
        case 2:
          heartbeatFileContent = _r.sent();
          if (
            (0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)(heartbeatFileContent) &&
            !isExecEventReason
          ) {
            (0, heartbeat_events_js_1.emitHeartbeatEvent)({
              status: "skipped",
              reason: "empty-heartbeat-file",
              durationMs: Date.now() - startedAt,
            });
            return [2 /*return*/, { status: "skipped", reason: "empty-heartbeat-file" }];
          }
          return [3 /*break*/, 4];
        case 3:
          _a = _r.sent();
          return [3 /*break*/, 4];
        case 4:
          ((_b = resolveHeartbeatSession(cfg, agentId, heartbeat)),
            (entry = _b.entry),
            (sessionKey = _b.sessionKey),
            (storePath = _b.storePath));
          previousUpdatedAt = entry === null || entry === void 0 ? void 0 : entry.updatedAt;
          delivery = (0, targets_js_1.resolveHeartbeatDeliveryTarget)({
            cfg: cfg,
            entry: entry,
            heartbeat: heartbeat,
          });
          visibility =
            delivery.channel !== "none"
              ? (0, heartbeat_visibility_js_1.resolveHeartbeatVisibility)({
                  cfg: cfg,
                  channel: delivery.channel,
                  accountId: delivery.accountId,
                })
              : { showOk: false, showAlerts: true, useIndicator: true };
          sender = (0, targets_js_1.resolveHeartbeatSenderContext)({
            cfg: cfg,
            entry: entry,
            delivery: delivery,
          }).sender;
          responsePrefix = (0, identity_js_1.resolveEffectiveMessagesConfig)(
            cfg,
            agentId,
          ).responsePrefix;
          isExecEvent = opts.reason === "exec-event";
          pendingEvents = isExecEvent ? (0, system_events_js_1.peekSystemEvents)(sessionKey) : [];
          hasExecCompletion = pendingEvents.some(function (evt) {
            return evt.includes("Exec finished");
          });
          prompt = hasExecCompletion ? EXEC_EVENT_PROMPT : resolveHeartbeatPrompt(cfg, heartbeat);
          ctx = {
            Body: prompt,
            From: sender,
            To: sender,
            Provider: hasExecCompletion ? "exec-event" : "heartbeat",
            SessionKey: sessionKey,
          };
          if (!visibility.showAlerts && !visibility.showOk && !visibility.useIndicator) {
            (0, heartbeat_events_js_1.emitHeartbeatEvent)({
              status: "skipped",
              reason: "alerts-disabled",
              durationMs: Date.now() - startedAt,
              channel: delivery.channel !== "none" ? delivery.channel : undefined,
            });
            return [2 /*return*/, { status: "skipped", reason: "alerts-disabled" }];
          }
          heartbeatOkText = responsePrefix
            ? "".concat(responsePrefix, " ").concat(tokens_js_1.HEARTBEAT_TOKEN)
            : tokens_js_1.HEARTBEAT_TOKEN;
          canAttemptHeartbeatOk = Boolean(
            visibility.showOk && delivery.channel !== "none" && delivery.to,
          );
          maybeSendHeartbeatOk = function () {
            return __awaiter(_this, void 0, void 0, function () {
              var heartbeatPlugin, readiness;
              var _a;
              return __generator(this, function (_b) {
                switch (_b.label) {
                  case 0:
                    if (!canAttemptHeartbeatOk || delivery.channel === "none" || !delivery.to) {
                      return [2 /*return*/, false];
                    }
                    heartbeatPlugin = (0, index_js_1.getChannelPlugin)(delivery.channel);
                    if (
                      !((_a =
                        heartbeatPlugin === null || heartbeatPlugin === void 0
                          ? void 0
                          : heartbeatPlugin.heartbeat) === null || _a === void 0
                        ? void 0
                        : _a.checkReady)
                    ) {
                      return [3 /*break*/, 2];
                    }
                    return [
                      4 /*yield*/,
                      heartbeatPlugin.heartbeat.checkReady({
                        cfg: cfg,
                        accountId: delivery.accountId,
                        deps: opts.deps,
                      }),
                    ];
                  case 1:
                    readiness = _b.sent();
                    if (!readiness.ok) {
                      return [2 /*return*/, false];
                    }
                    _b.label = 2;
                  case 2:
                    return [
                      4 /*yield*/,
                      (0, deliver_js_1.deliverOutboundPayloads)({
                        cfg: cfg,
                        channel: delivery.channel,
                        to: delivery.to,
                        accountId: delivery.accountId,
                        payloads: [{ text: heartbeatOkText }],
                        deps: opts.deps,
                      }),
                    ];
                  case 3:
                    _b.sent();
                    return [2 /*return*/, true];
                }
              });
            });
          };
          _r.label = 5;
        case 5:
          _r.trys.push([5, 22, , 23]);
          return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)(ctx, { isHeartbeat: true }, cfg)];
        case 6:
          replyResult = _r.sent();
          replyPayload_1 = resolveHeartbeatReplyPayload(replyResult);
          includeReasoning =
            (heartbeat === null || heartbeat === void 0 ? void 0 : heartbeat.includeReasoning) ===
            true;
          reasoningPayloads = includeReasoning
            ? resolveHeartbeatReasoningPayloads(replyResult).filter(function (payload) {
                return payload !== replyPayload_1;
              })
            : [];
          if (
            !(
              !replyPayload_1 ||
              (!replyPayload_1.text &&
                !replyPayload_1.mediaUrl &&
                !((_l = replyPayload_1.mediaUrls) === null || _l === void 0 ? void 0 : _l.length))
            )
          ) {
            return [3 /*break*/, 9];
          }
          return [
            4 /*yield*/,
            restoreHeartbeatUpdatedAt({
              storePath: storePath,
              sessionKey: sessionKey,
              updatedAt: previousUpdatedAt,
            }),
          ];
        case 7:
          _r.sent();
          return [4 /*yield*/, maybeSendHeartbeatOk()];
        case 8:
          okSent = _r.sent();
          (0, heartbeat_events_js_1.emitHeartbeatEvent)({
            status: "ok-empty",
            reason: opts.reason,
            durationMs: Date.now() - startedAt,
            channel: delivery.channel !== "none" ? delivery.channel : undefined,
            silent: !okSent,
            indicatorType: visibility.useIndicator
              ? (0, heartbeat_events_js_1.resolveIndicatorType)("ok-empty")
              : undefined,
          });
          return [2 /*return*/, { status: "ran", durationMs: Date.now() - startedAt }];
        case 9:
          ackMaxChars = resolveHeartbeatAckMaxChars(cfg, heartbeat);
          normalized = normalizeHeartbeatReply(replyPayload_1, responsePrefix, ackMaxChars);
          execFallbackText =
            hasExecCompletion &&
            !normalized.text.trim() &&
            ((_m = replyPayload_1.text) === null || _m === void 0 ? void 0 : _m.trim())
              ? replyPayload_1.text.trim()
              : null;
          if (execFallbackText) {
            normalized.text = execFallbackText;
            normalized.shouldSkip = false;
          }
          shouldSkipMain = normalized.shouldSkip && !normalized.hasMedia && !hasExecCompletion;
          if (!(shouldSkipMain && reasoningPayloads.length === 0)) {
            return [3 /*break*/, 12];
          }
          return [
            4 /*yield*/,
            restoreHeartbeatUpdatedAt({
              storePath: storePath,
              sessionKey: sessionKey,
              updatedAt: previousUpdatedAt,
            }),
          ];
        case 10:
          _r.sent();
          return [4 /*yield*/, maybeSendHeartbeatOk()];
        case 11:
          okSent = _r.sent();
          (0, heartbeat_events_js_1.emitHeartbeatEvent)({
            status: "ok-token",
            reason: opts.reason,
            durationMs: Date.now() - startedAt,
            channel: delivery.channel !== "none" ? delivery.channel : undefined,
            silent: !okSent,
            indicatorType: visibility.useIndicator
              ? (0, heartbeat_events_js_1.resolveIndicatorType)("ok-token")
              : undefined,
          });
          return [2 /*return*/, { status: "ran", durationMs: Date.now() - startedAt }];
        case 12:
          mediaUrls =
            (_o = replyPayload_1.mediaUrls) !== null && _o !== void 0
              ? _o
              : replyPayload_1.mediaUrl
                ? [replyPayload_1.mediaUrl]
                : [];
          prevHeartbeatText =
            typeof (entry === null || entry === void 0 ? void 0 : entry.lastHeartbeatText) ===
            "string"
              ? entry.lastHeartbeatText
              : "";
          prevHeartbeatAt =
            typeof (entry === null || entry === void 0 ? void 0 : entry.lastHeartbeatSentAt) ===
            "number"
              ? entry.lastHeartbeatSentAt
              : undefined;
          isDuplicateMain =
            !shouldSkipMain &&
            !mediaUrls.length &&
            Boolean(prevHeartbeatText.trim()) &&
            normalized.text.trim() === prevHeartbeatText.trim() &&
            typeof prevHeartbeatAt === "number" &&
            startedAt - prevHeartbeatAt < 24 * 60 * 60 * 1000;
          if (!isDuplicateMain) {
            return [3 /*break*/, 14];
          }
          return [
            4 /*yield*/,
            restoreHeartbeatUpdatedAt({
              storePath: storePath,
              sessionKey: sessionKey,
              updatedAt: previousUpdatedAt,
            }),
          ];
        case 13:
          _r.sent();
          (0, heartbeat_events_js_1.emitHeartbeatEvent)({
            status: "skipped",
            reason: "duplicate",
            preview: normalized.text.slice(0, 200),
            durationMs: Date.now() - startedAt,
            hasMedia: false,
            channel: delivery.channel !== "none" ? delivery.channel : undefined,
          });
          return [2 /*return*/, { status: "ran", durationMs: Date.now() - startedAt }];
        case 14:
          previewText = shouldSkipMain
            ? reasoningPayloads
                .map(function (payload) {
                  return payload.text;
                })
                .filter(function (text) {
                  return Boolean(text === null || text === void 0 ? void 0 : text.trim());
                })
                .join("\n")
            : normalized.text;
          if (delivery.channel === "none" || !delivery.to) {
            (0, heartbeat_events_js_1.emitHeartbeatEvent)({
              status: "skipped",
              reason: (_p = delivery.reason) !== null && _p !== void 0 ? _p : "no-target",
              preview:
                previewText === null || previewText === void 0 ? void 0 : previewText.slice(0, 200),
              durationMs: Date.now() - startedAt,
              hasMedia: mediaUrls.length > 0,
            });
            return [2 /*return*/, { status: "ran", durationMs: Date.now() - startedAt }];
          }
          if (!!visibility.showAlerts) {
            return [3 /*break*/, 16];
          }
          return [
            4 /*yield*/,
            restoreHeartbeatUpdatedAt({
              storePath: storePath,
              sessionKey: sessionKey,
              updatedAt: previousUpdatedAt,
            }),
          ];
        case 15:
          _r.sent();
          (0, heartbeat_events_js_1.emitHeartbeatEvent)({
            status: "skipped",
            reason: "alerts-disabled",
            preview:
              previewText === null || previewText === void 0 ? void 0 : previewText.slice(0, 200),
            durationMs: Date.now() - startedAt,
            channel: delivery.channel,
            hasMedia: mediaUrls.length > 0,
            indicatorType: visibility.useIndicator
              ? (0, heartbeat_events_js_1.resolveIndicatorType)("sent")
              : undefined,
          });
          return [2 /*return*/, { status: "ran", durationMs: Date.now() - startedAt }];
        case 16:
          deliveryAccountId = delivery.accountId;
          heartbeatPlugin = (0, index_js_1.getChannelPlugin)(delivery.channel);
          if (
            !((_q =
              heartbeatPlugin === null || heartbeatPlugin === void 0
                ? void 0
                : heartbeatPlugin.heartbeat) === null || _q === void 0
              ? void 0
              : _q.checkReady)
          ) {
            return [3 /*break*/, 18];
          }
          return [
            4 /*yield*/,
            heartbeatPlugin.heartbeat.checkReady({
              cfg: cfg,
              accountId: deliveryAccountId,
              deps: opts.deps,
            }),
          ];
        case 17:
          readiness = _r.sent();
          if (!readiness.ok) {
            (0, heartbeat_events_js_1.emitHeartbeatEvent)({
              status: "skipped",
              reason: readiness.reason,
              preview:
                previewText === null || previewText === void 0 ? void 0 : previewText.slice(0, 200),
              durationMs: Date.now() - startedAt,
              hasMedia: mediaUrls.length > 0,
              channel: delivery.channel,
            });
            log.info("heartbeat: channel not ready", {
              channel: delivery.channel,
              reason: readiness.reason,
            });
            return [2 /*return*/, { status: "skipped", reason: readiness.reason }];
          }
          _r.label = 18;
        case 18:
          return [
            4 /*yield*/,
            (0, deliver_js_1.deliverOutboundPayloads)({
              cfg: cfg,
              channel: delivery.channel,
              to: delivery.to,
              accountId: deliveryAccountId,
              payloads: __spreadArray(
                __spreadArray([], reasoningPayloads, true),
                shouldSkipMain
                  ? []
                  : [
                      {
                        text: normalized.text,
                        mediaUrls: mediaUrls,
                      },
                    ],
                true,
              ),
              deps: opts.deps,
            }),
          ];
        case 19:
          _r.sent();
          if (!(!shouldSkipMain && normalized.text.trim())) {
            return [3 /*break*/, 21];
          }
          store = (0, sessions_js_1.loadSessionStore)(storePath);
          current = store[sessionKey];
          if (!current) {
            return [3 /*break*/, 21];
          }
          store[sessionKey] = __assign(__assign({}, current), {
            lastHeartbeatText: normalized.text,
            lastHeartbeatSentAt: startedAt,
          });
          return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, store)];
        case 20:
          _r.sent();
          _r.label = 21;
        case 21:
          (0, heartbeat_events_js_1.emitHeartbeatEvent)({
            status: "sent",
            to: delivery.to,
            preview:
              previewText === null || previewText === void 0 ? void 0 : previewText.slice(0, 200),
            durationMs: Date.now() - startedAt,
            hasMedia: mediaUrls.length > 0,
            channel: delivery.channel,
            indicatorType: visibility.useIndicator
              ? (0, heartbeat_events_js_1.resolveIndicatorType)("sent")
              : undefined,
          });
          return [2 /*return*/, { status: "ran", durationMs: Date.now() - startedAt }];
        case 22:
          err_1 = _r.sent();
          reason = (0, errors_js_1.formatErrorMessage)(err_1);
          (0, heartbeat_events_js_1.emitHeartbeatEvent)({
            status: "failed",
            reason: reason,
            durationMs: Date.now() - startedAt,
            channel: delivery.channel !== "none" ? delivery.channel : undefined,
            indicatorType: visibility.useIndicator
              ? (0, heartbeat_events_js_1.resolveIndicatorType)("failed")
              : undefined,
          });
          log.error("heartbeat failed: ".concat(reason), { error: reason });
          return [2 /*return*/, { status: "failed", reason: reason }];
        case 23:
          return [2 /*return*/];
      }
    });
  });
}
function startHeartbeatRunner(opts) {
  var _this = this;
  var _a, _b, _c, _d;
  var runtime = (_a = opts.runtime) !== null && _a !== void 0 ? _a : runtime_js_1.defaultRuntime;
  var runOnce = (_b = opts.runOnce) !== null && _b !== void 0 ? _b : runHeartbeatOnce;
  var state = {
    cfg: (_c = opts.cfg) !== null && _c !== void 0 ? _c : (0, config_js_1.loadConfig)(),
    runtime: runtime,
    agents: new Map(),
    timer: null,
    stopped: false,
  };
  var initialized = false;
  var resolveNextDue = function (now, intervalMs, prevState) {
    if (
      typeof (prevState === null || prevState === void 0 ? void 0 : prevState.lastRunMs) ===
      "number"
    ) {
      return prevState.lastRunMs + intervalMs;
    }
    if (prevState && prevState.intervalMs === intervalMs && prevState.nextDueMs > now) {
      return prevState.nextDueMs;
    }
    return now + intervalMs;
  };
  var scheduleNext = function () {
    var _a, _b;
    if (state.stopped) {
      return;
    }
    if (state.timer) {
      clearTimeout(state.timer);
      state.timer = null;
    }
    if (state.agents.size === 0) {
      return;
    }
    var now = Date.now();
    var nextDue = Number.POSITIVE_INFINITY;
    for (var _i = 0, _c = state.agents.values(); _i < _c.length; _i++) {
      var agent = _c[_i];
      if (agent.nextDueMs < nextDue) {
        nextDue = agent.nextDueMs;
      }
    }
    if (!Number.isFinite(nextDue)) {
      return;
    }
    var delay = Math.max(0, nextDue - now);
    state.timer = setTimeout(function () {
      (0, heartbeat_wake_js_1.requestHeartbeatNow)({ reason: "interval", coalesceMs: 0 });
    }, delay);
    (_b = (_a = state.timer).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
  };
  var updateConfig = function (cfg) {
    if (state.stopped) {
      return;
    }
    var now = Date.now();
    var prevAgents = state.agents;
    var prevEnabled = prevAgents.size > 0;
    var nextAgents = new Map();
    var intervals = [];
    for (var _i = 0, _a = resolveHeartbeatAgents(cfg); _i < _a.length; _i++) {
      var agent = _a[_i];
      var intervalMs = resolveHeartbeatIntervalMs(cfg, undefined, agent.heartbeat);
      if (!intervalMs) {
        continue;
      }
      intervals.push(intervalMs);
      var prevState = prevAgents.get(agent.agentId);
      var nextDueMs = resolveNextDue(now, intervalMs, prevState);
      nextAgents.set(agent.agentId, {
        agentId: agent.agentId,
        heartbeat: agent.heartbeat,
        intervalMs: intervalMs,
        lastRunMs: prevState === null || prevState === void 0 ? void 0 : prevState.lastRunMs,
        nextDueMs: nextDueMs,
      });
    }
    state.cfg = cfg;
    state.agents = nextAgents;
    var nextEnabled = nextAgents.size > 0;
    if (!initialized) {
      if (!nextEnabled) {
        log.info("heartbeat: disabled", { enabled: false });
      } else {
        log.info("heartbeat: started", { intervalMs: Math.min.apply(Math, intervals) });
      }
      initialized = true;
    } else if (prevEnabled !== nextEnabled) {
      if (!nextEnabled) {
        log.info("heartbeat: disabled", { enabled: false });
      } else {
        log.info("heartbeat: started", { intervalMs: Math.min.apply(Math, intervals) });
      }
    }
    scheduleNext();
  };
  var run = function (params) {
    return __awaiter(_this, void 0, void 0, function () {
      var reason, isInterval, startedAt, now, ran, _i, _a, agent, res;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            if (!heartbeatsEnabled) {
              return [2 /*return*/, { status: "skipped", reason: "disabled" }];
            }
            if (state.agents.size === 0) {
              return [2 /*return*/, { status: "skipped", reason: "disabled" }];
            }
            reason = params === null || params === void 0 ? void 0 : params.reason;
            isInterval = reason === "interval";
            startedAt = Date.now();
            now = startedAt;
            ran = false;
            ((_i = 0), (_a = state.agents.values()));
            _b.label = 1;
          case 1:
            if (!(_i < _a.length)) {
              return [3 /*break*/, 4];
            }
            agent = _a[_i];
            if (isInterval && now < agent.nextDueMs) {
              return [3 /*break*/, 3];
            }
            return [
              4 /*yield*/,
              runOnce({
                cfg: state.cfg,
                agentId: agent.agentId,
                heartbeat: agent.heartbeat,
                reason: reason,
                deps: { runtime: state.runtime },
              }),
            ];
          case 2:
            res = _b.sent();
            if (res.status === "skipped" && res.reason === "requests-in-flight") {
              return [2 /*return*/, res];
            }
            if (res.status !== "skipped" || res.reason !== "disabled") {
              agent.lastRunMs = now;
              agent.nextDueMs = now + agent.intervalMs;
            }
            if (res.status === "ran") {
              ran = true;
            }
            _b.label = 3;
          case 3:
            _i++;
            return [3 /*break*/, 1];
          case 4:
            scheduleNext();
            if (ran) {
              return [2 /*return*/, { status: "ran", durationMs: Date.now() - startedAt }];
            }
            return [
              2 /*return*/,
              { status: "skipped", reason: isInterval ? "not-due" : "disabled" },
            ];
        }
      });
    });
  };
  (0, heartbeat_wake_js_1.setHeartbeatWakeHandler)(function (params) {
    return __awaiter(_this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, run({ reason: params.reason })];
      });
    });
  });
  updateConfig(state.cfg);
  var cleanup = function () {
    state.stopped = true;
    (0, heartbeat_wake_js_1.setHeartbeatWakeHandler)(null);
    if (state.timer) {
      clearTimeout(state.timer);
    }
    state.timer = null;
  };
  (_d = opts.abortSignal) === null || _d === void 0
    ? void 0
    : _d.addEventListener("abort", cleanup, { once: true });
  return { stop: cleanup, updateConfig: updateConfig };
}
