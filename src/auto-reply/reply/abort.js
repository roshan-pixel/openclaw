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
exports.isAbortTrigger = isAbortTrigger;
exports.getAbortMemory = getAbortMemory;
exports.setAbortMemory = setAbortMemory;
exports.formatAbortReplyText = formatAbortReplyText;
exports.stopSubagentsForRequester = stopSubagentsForRequester;
exports.tryFastAbortFromMessage = tryFastAbortFromMessage;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var pi_embedded_js_1 = require("../../agents/pi-embedded.js");
var subagent_registry_js_1 = require("../../agents/subagent-registry.js");
var sessions_js_1 = require("../../config/sessions.js");
var session_key_js_1 = require("../../routing/session-key.js");
var command_auth_js_1 = require("../command-auth.js");
var commands_registry_js_1 = require("../commands-registry.js");
var globals_js_1 = require("../../globals.js");
var mentions_js_1 = require("./mentions.js");
var queue_js_1 = require("./queue.js");
var sessions_helpers_js_1 = require("../../agents/tools/sessions-helpers.js");
var ABORT_TRIGGERS = new Set(["stop", "esc", "abort", "wait", "exit", "interrupt"]);
var ABORT_MEMORY = new Map();
function isAbortTrigger(text) {
  if (!text) {
    return false;
  }
  var normalized = text.trim().toLowerCase();
  return ABORT_TRIGGERS.has(normalized);
}
function getAbortMemory(key) {
  return ABORT_MEMORY.get(key);
}
function setAbortMemory(key, value) {
  ABORT_MEMORY.set(key, value);
}
function formatAbortReplyText(stoppedSubagents) {
  if (typeof stoppedSubagents !== "number" || stoppedSubagents <= 0) {
    return "⚙️ Agent was aborted.";
  }
  var label = stoppedSubagents === 1 ? "sub-agent" : "sub-agents";
  return "\u2699\uFE0F Agent was aborted. Stopped "
    .concat(stoppedSubagents, " ")
    .concat(label, ".");
}
function resolveSessionEntryForKey(store, sessionKey) {
  if (!store || !sessionKey) {
    return {};
  }
  var direct = store[sessionKey];
  if (direct) {
    return { entry: direct, key: sessionKey };
  }
  return {};
}
function resolveAbortTargetKey(ctx) {
  var _a, _b;
  var target = (_a = ctx.CommandTargetSessionKey) === null || _a === void 0 ? void 0 : _a.trim();
  if (target) {
    return target;
  }
  var sessionKey = (_b = ctx.SessionKey) === null || _b === void 0 ? void 0 : _b.trim();
  return sessionKey || undefined;
}
function normalizeRequesterSessionKey(cfg, key) {
  var cleaned = key === null || key === void 0 ? void 0 : key.trim();
  if (!cleaned) {
    return undefined;
  }
  var _a = (0, sessions_helpers_js_1.resolveMainSessionAlias)(cfg),
    mainKey = _a.mainKey,
    alias = _a.alias;
  return (0, sessions_helpers_js_1.resolveInternalSessionKey)({
    key: cleaned,
    alias: alias,
    mainKey: mainKey,
  });
}
function stopSubagentsForRequester(params) {
  var _a, _b;
  var requesterKey = normalizeRequesterSessionKey(params.cfg, params.requesterSessionKey);
  if (!requesterKey) {
    return { stopped: 0 };
  }
  var runs = (0, subagent_registry_js_1.listSubagentRunsForRequester)(requesterKey);
  if (runs.length === 0) {
    return { stopped: 0 };
  }
  var storeCache = new Map();
  var seenChildKeys = new Set();
  var stopped = 0;
  for (var _i = 0, runs_1 = runs; _i < runs_1.length; _i++) {
    var run = runs_1[_i];
    if (run.endedAt) {
      continue;
    }
    var childKey = (_a = run.childSessionKey) === null || _a === void 0 ? void 0 : _a.trim();
    if (!childKey || seenChildKeys.has(childKey)) {
      continue;
    }
    seenChildKeys.add(childKey);
    var cleared = (0, queue_js_1.clearSessionQueues)([childKey]);
    var parsed = (0, session_key_js_1.parseAgentSessionKey)(childKey);
    var storePath = (0, sessions_js_1.resolveStorePath)(
      (_b = params.cfg.session) === null || _b === void 0 ? void 0 : _b.store,
      { agentId: parsed === null || parsed === void 0 ? void 0 : parsed.agentId },
    );
    var store = storeCache.get(storePath);
    if (!store) {
      store = (0, sessions_js_1.loadSessionStore)(storePath);
      storeCache.set(storePath, store);
    }
    var entry = store[childKey];
    var sessionId = entry === null || entry === void 0 ? void 0 : entry.sessionId;
    var aborted = sessionId ? (0, pi_embedded_js_1.abortEmbeddedPiRun)(sessionId) : false;
    if (aborted || cleared.followupCleared > 0 || cleared.laneCleared > 0) {
      stopped += 1;
    }
  }
  if (stopped > 0) {
    (0, globals_js_1.logVerbose)(
      "abort: stopped ".concat(stopped, " subagent run(s) for ").concat(requesterKey),
    );
  }
  return { stopped: stopped };
}
function tryFastAbortFromMessage(params) {
  return __awaiter(this, void 0, void 0, function () {
    var ctx,
      cfg,
      targetKey,
      agentId,
      raw,
      isGroup,
      stripped,
      normalized,
      abortRequested,
      commandAuthorized,
      auth,
      abortKey,
      requesterSessionKey,
      storePath,
      store,
      _a,
      entry_1,
      key_1,
      sessionId,
      aborted,
      cleared,
      stopped_1,
      stopped;
    var _b, _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
      switch (_k.label) {
        case 0:
          ((ctx = params.ctx), (cfg = params.cfg));
          targetKey = resolveAbortTargetKey(ctx);
          agentId = (0, agent_scope_js_1.resolveSessionAgentId)({
            sessionKey:
              (_b = targetKey !== null && targetKey !== void 0 ? targetKey : ctx.SessionKey) !==
                null && _b !== void 0
                ? _b
                : "",
            config: cfg,
          });
          raw = (0, mentions_js_1.stripStructuralPrefixes)(
            (_e =
              (_d = (_c = ctx.CommandBody) !== null && _c !== void 0 ? _c : ctx.RawBody) !== null &&
              _d !== void 0
                ? _d
                : ctx.Body) !== null && _e !== void 0
              ? _e
              : "",
          );
          isGroup =
            ((_f = ctx.ChatType) === null || _f === void 0 ? void 0 : _f.trim().toLowerCase()) ===
            "group";
          stripped = isGroup ? (0, mentions_js_1.stripMentions)(raw, ctx, cfg, agentId) : raw;
          normalized = (0, commands_registry_js_1.normalizeCommandBody)(stripped);
          abortRequested = normalized === "/stop" || isAbortTrigger(stripped);
          if (!abortRequested) {
            return [2 /*return*/, { handled: false, aborted: false }];
          }
          commandAuthorized = ctx.CommandAuthorized;
          auth = (0, command_auth_js_1.resolveCommandAuthorization)({
            ctx: ctx,
            cfg: cfg,
            commandAuthorized: commandAuthorized,
          });
          if (!auth.isAuthorizedSender) {
            return [2 /*return*/, { handled: false, aborted: false }];
          }
          abortKey =
            (_g = targetKey !== null && targetKey !== void 0 ? targetKey : auth.from) !== null &&
            _g !== void 0
              ? _g
              : auth.to;
          requesterSessionKey =
            (_h = targetKey !== null && targetKey !== void 0 ? targetKey : ctx.SessionKey) !==
              null && _h !== void 0
              ? _h
              : abortKey;
          if (!targetKey) {
            return [3 /*break*/, 4];
          }
          storePath = (0, sessions_js_1.resolveStorePath)(
            (_j = cfg.session) === null || _j === void 0 ? void 0 : _j.store,
            { agentId: agentId },
          );
          store = (0, sessions_js_1.loadSessionStore)(storePath);
          ((_a = resolveSessionEntryForKey(store, targetKey)),
            (entry_1 = _a.entry),
            (key_1 = _a.key));
          sessionId = entry_1 === null || entry_1 === void 0 ? void 0 : entry_1.sessionId;
          aborted = sessionId ? (0, pi_embedded_js_1.abortEmbeddedPiRun)(sessionId) : false;
          cleared = (0, queue_js_1.clearSessionQueues)([
            key_1 !== null && key_1 !== void 0 ? key_1 : targetKey,
            sessionId,
          ]);
          if (cleared.followupCleared > 0 || cleared.laneCleared > 0) {
            (0, globals_js_1.logVerbose)(
              "abort: cleared followups="
                .concat(cleared.followupCleared, " lane=")
                .concat(cleared.laneCleared, " keys=")
                .concat(cleared.keys.join(",")),
            );
          }
          if (!(entry_1 && key_1)) {
            return [3 /*break*/, 2];
          }
          entry_1.abortedLastRun = true;
          entry_1.updatedAt = Date.now();
          store[key_1] = entry_1;
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(storePath, function (nextStore) {
              var _a;
              var nextEntry = (_a = nextStore[key_1]) !== null && _a !== void 0 ? _a : entry_1;
              if (!nextEntry) {
                return;
              }
              nextEntry.abortedLastRun = true;
              nextEntry.updatedAt = Date.now();
              nextStore[key_1] = nextEntry;
            }),
          ];
        case 1:
          _k.sent();
          return [3 /*break*/, 3];
        case 2:
          if (abortKey) {
            setAbortMemory(abortKey, true);
          }
          _k.label = 3;
        case 3:
          stopped_1 = stopSubagentsForRequester({
            cfg: cfg,
            requesterSessionKey: requesterSessionKey,
          }).stopped;
          return [2 /*return*/, { handled: true, aborted: aborted, stoppedSubagents: stopped_1 }];
        case 4:
          if (abortKey) {
            setAbortMemory(abortKey, true);
          }
          stopped = stopSubagentsForRequester({
            cfg: cfg,
            requesterSessionKey: requesterSessionKey,
          }).stopped;
          return [2 /*return*/, { handled: true, aborted: false, stoppedSubagents: stopped }];
      }
    });
  });
}
