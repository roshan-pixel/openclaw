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
exports.buildSubagentSystemPrompt = buildSubagentSystemPrompt;
exports.runSubagentAnnounceFlow = runSubagentAnnounceFlow;
var node_crypto_1 = require("node:crypto");
var node_path_1 = require("node:path");
var config_js_1 = require("../config/config.js");
var sessions_js_1 = require("../config/sessions.js");
var session_key_js_1 = require("../routing/session-key.js");
var queue_js_1 = require("../auto-reply/reply/queue.js");
var call_js_1 = require("../gateway/call.js");
var runtime_js_1 = require("../runtime.js");
var delivery_context_js_1 = require("../utils/delivery-context.js");
var pi_embedded_js_1 = require("./pi-embedded.js");
var subagent_announce_queue_js_1 = require("./subagent-announce-queue.js");
var agent_step_js_1 = require("./tools/agent-step.js");
function formatDurationShort(valueMs) {
  if (!valueMs || !Number.isFinite(valueMs) || valueMs <= 0) {
    return undefined;
  }
  var totalSeconds = Math.round(valueMs / 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;
  if (hours > 0) {
    return "".concat(hours, "h").concat(minutes, "m");
  }
  if (minutes > 0) {
    return "".concat(minutes, "m").concat(seconds, "s");
  }
  return "".concat(seconds, "s");
}
function formatTokenCount(value) {
  if (!value || !Number.isFinite(value)) {
    return "0";
  }
  if (value >= 1000000) {
    return "".concat((value / 1000000).toFixed(1), "m");
  }
  if (value >= 1000) {
    return "".concat((value / 1000).toFixed(1), "k");
  }
  return String(Math.round(value));
}
function formatUsd(value) {
  if (value === undefined || !Number.isFinite(value)) {
    return undefined;
  }
  if (value >= 1) {
    return "$".concat(value.toFixed(2));
  }
  if (value >= 0.01) {
    return "$".concat(value.toFixed(2));
  }
  return "$".concat(value.toFixed(4));
}
function resolveModelCost(params) {
  var _a, _b, _c, _d, _e, _f;
  var provider = (_a = params.provider) === null || _a === void 0 ? void 0 : _a.trim();
  var model = (_b = params.model) === null || _b === void 0 ? void 0 : _b.trim();
  if (!provider || !model) {
    return undefined;
  }
  var models =
    (_f =
      (_e =
        (_d = (_c = params.config.models) === null || _c === void 0 ? void 0 : _c.providers) ===
          null || _d === void 0
          ? void 0
          : _d[provider]) === null || _e === void 0
        ? void 0
        : _e.models) !== null && _f !== void 0
      ? _f
      : [];
  var entry = models.find(function (candidate) {
    return candidate.id === model;
  });
  return entry === null || entry === void 0 ? void 0 : entry.cost;
}
function waitForSessionUsage(params) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg, agentId, storePath, entry, hasTokens, attempt;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          cfg = (0, config_js_1.loadConfig)();
          agentId = (0, sessions_js_1.resolveAgentIdFromSessionKey)(params.sessionKey);
          storePath = (0, sessions_js_1.resolveStorePath)(
            (_a = cfg.session) === null || _a === void 0 ? void 0 : _a.store,
            { agentId: agentId },
          );
          entry = (0, sessions_js_1.loadSessionStore)(storePath)[params.sessionKey];
          if (!entry) {
            return [2 /*return*/, { entry: entry, storePath: storePath }];
          }
          hasTokens = function () {
            return (
              entry &&
              (typeof entry.totalTokens === "number" ||
                typeof entry.inputTokens === "number" ||
                typeof entry.outputTokens === "number")
            );
          };
          if (hasTokens()) {
            return [2 /*return*/, { entry: entry, storePath: storePath }];
          }
          attempt = 0;
          _b.label = 1;
        case 1:
          if (!(attempt < 4)) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            new Promise(function (resolve) {
              return setTimeout(resolve, 200);
            }),
          ];
        case 2:
          _b.sent();
          entry = (0, sessions_js_1.loadSessionStore)(storePath)[params.sessionKey];
          if (hasTokens()) {
            return [3 /*break*/, 4];
          }
          _b.label = 3;
        case 3:
          attempt += 1;
          return [3 /*break*/, 1];
        case 4:
          return [2 /*return*/, { entry: entry, storePath: storePath }];
      }
    });
  });
}
function resolveAnnounceOrigin(entry, requesterOrigin) {
  // requesterOrigin (captured at spawn time) reflects the channel the user is
  // actually on and must take priority over the session entry, which may carry
  // stale lastChannel / lastTo values from a previous channel interaction.
  return (0, delivery_context_js_1.mergeDeliveryContext)(
    requesterOrigin,
    (0, delivery_context_js_1.deliveryContextFromSession)(entry),
  );
}
function sendAnnounce(item) {
  return __awaiter(this, void 0, void 0, function () {
    var origin, threadId;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          origin = item.origin;
          threadId =
            (origin === null || origin === void 0 ? void 0 : origin.threadId) != null &&
            origin.threadId !== ""
              ? String(origin.threadId)
              : undefined;
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              method: "agent",
              params: {
                sessionKey: item.sessionKey,
                message: item.prompt,
                channel: origin === null || origin === void 0 ? void 0 : origin.channel,
                accountId: origin === null || origin === void 0 ? void 0 : origin.accountId,
                to: origin === null || origin === void 0 ? void 0 : origin.to,
                threadId: threadId,
                deliver: true,
                idempotencyKey: node_crypto_1.default.randomUUID(),
              },
              expectFinal: true,
              timeoutMs: 60000,
            }),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function resolveRequesterStoreKey(cfg, requesterSessionKey) {
  var _a;
  var raw = requesterSessionKey.trim();
  if (!raw) {
    return raw;
  }
  if (raw === "global" || raw === "unknown") {
    return raw;
  }
  if (raw.startsWith("agent:")) {
    return raw;
  }
  var mainKey = (0, session_key_js_1.normalizeMainKey)(
    (_a = cfg.session) === null || _a === void 0 ? void 0 : _a.mainKey,
  );
  if (raw === "main" || raw === mainKey) {
    return (0, sessions_js_1.resolveMainSessionKey)(cfg);
  }
  var agentId = (0, sessions_js_1.resolveAgentIdFromSessionKey)(raw);
  return "agent:".concat(agentId, ":").concat(raw);
}
function loadRequesterSessionEntry(requesterSessionKey) {
  var _a;
  var cfg = (0, config_js_1.loadConfig)();
  var canonicalKey = resolveRequesterStoreKey(cfg, requesterSessionKey);
  var agentId = (0, sessions_js_1.resolveAgentIdFromSessionKey)(canonicalKey);
  var storePath = (0, sessions_js_1.resolveStorePath)(
    (_a = cfg.session) === null || _a === void 0 ? void 0 : _a.store,
    { agentId: agentId },
  );
  var store = (0, sessions_js_1.loadSessionStore)(storePath);
  var entry = store[canonicalKey];
  return { cfg: cfg, entry: entry, canonicalKey: canonicalKey };
}
function maybeQueueSubagentAnnounce(params) {
  return __awaiter(this, void 0, void 0, function () {
    var _a,
      cfg,
      entry,
      canonicalKey,
      sessionId,
      queueSettings,
      isActive,
      shouldSteer,
      steered,
      shouldFollowup,
      origin_1;
    var _b;
    return __generator(this, function (_c) {
      ((_a = loadRequesterSessionEntry(params.requesterSessionKey)),
        (cfg = _a.cfg),
        (entry = _a.entry));
      canonicalKey = resolveRequesterStoreKey(cfg, params.requesterSessionKey);
      sessionId = entry === null || entry === void 0 ? void 0 : entry.sessionId;
      if (!sessionId) {
        return [2 /*return*/, "none"];
      }
      queueSettings = (0, queue_js_1.resolveQueueSettings)({
        cfg: cfg,
        channel:
          (_b = entry === null || entry === void 0 ? void 0 : entry.channel) !== null &&
          _b !== void 0
            ? _b
            : entry === null || entry === void 0
              ? void 0
              : entry.lastChannel,
        sessionEntry: entry,
      });
      isActive = (0, pi_embedded_js_1.isEmbeddedPiRunActive)(sessionId);
      shouldSteer = queueSettings.mode === "steer" || queueSettings.mode === "steer-backlog";
      if (shouldSteer) {
        steered = (0, pi_embedded_js_1.queueEmbeddedPiMessage)(sessionId, params.triggerMessage);
        if (steered) {
          return [2 /*return*/, "steered"];
        }
      }
      shouldFollowup =
        queueSettings.mode === "followup" ||
        queueSettings.mode === "collect" ||
        queueSettings.mode === "steer-backlog" ||
        queueSettings.mode === "interrupt";
      if (isActive && (shouldFollowup || queueSettings.mode === "steer")) {
        origin_1 = resolveAnnounceOrigin(entry, params.requesterOrigin);
        (0, subagent_announce_queue_js_1.enqueueAnnounce)({
          key: canonicalKey,
          item: {
            prompt: params.triggerMessage,
            summaryLine: params.summaryLine,
            enqueuedAt: Date.now(),
            sessionKey: canonicalKey,
            origin: origin_1,
          },
          settings: queueSettings,
          send: sendAnnounce,
        });
        return [2 /*return*/, "queued"];
      }
      return [2 /*return*/, "none"];
    });
  });
}
function buildSubagentStatsLine(params) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      _a,
      entry,
      storePath,
      sessionId,
      transcriptPath,
      input,
      output,
      total,
      runtimeMs,
      provider,
      model,
      costConfig,
      cost,
      parts,
      runtime,
      inputText,
      outputText,
      totalText,
      costText;
    var _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          cfg = (0, config_js_1.loadConfig)();
          return [
            4 /*yield*/,
            waitForSessionUsage({
              sessionKey: params.sessionKey,
            }),
          ];
        case 1:
          ((_a = _c.sent()), (entry = _a.entry), (storePath = _a.storePath));
          sessionId = entry === null || entry === void 0 ? void 0 : entry.sessionId;
          transcriptPath =
            sessionId && storePath
              ? node_path_1.default.join(
                  node_path_1.default.dirname(storePath),
                  "".concat(sessionId, ".jsonl"),
                )
              : undefined;
          input = entry === null || entry === void 0 ? void 0 : entry.inputTokens;
          output = entry === null || entry === void 0 ? void 0 : entry.outputTokens;
          total =
            (_b = entry === null || entry === void 0 ? void 0 : entry.totalTokens) !== null &&
            _b !== void 0
              ? _b
              : typeof input === "number" && typeof output === "number"
                ? input + output
                : undefined;
          runtimeMs =
            typeof params.startedAt === "number" && typeof params.endedAt === "number"
              ? Math.max(0, params.endedAt - params.startedAt)
              : undefined;
          provider = entry === null || entry === void 0 ? void 0 : entry.modelProvider;
          model = entry === null || entry === void 0 ? void 0 : entry.model;
          costConfig = resolveModelCost({ provider: provider, model: model, config: cfg });
          cost =
            costConfig && typeof input === "number" && typeof output === "number"
              ? (input * costConfig.input + output * costConfig.output) / 1000000
              : undefined;
          parts = [];
          runtime = formatDurationShort(runtimeMs);
          parts.push("runtime ".concat(runtime !== null && runtime !== void 0 ? runtime : "n/a"));
          if (typeof total === "number") {
            inputText = typeof input === "number" ? formatTokenCount(input) : "n/a";
            outputText = typeof output === "number" ? formatTokenCount(output) : "n/a";
            totalText = formatTokenCount(total);
            parts.push(
              "tokens "
                .concat(totalText, " (in ")
                .concat(inputText, " / out ")
                .concat(outputText, ")"),
            );
          } else {
            parts.push("tokens n/a");
          }
          costText = formatUsd(cost);
          if (costText) {
            parts.push("est ".concat(costText));
          }
          parts.push("sessionKey ".concat(params.sessionKey));
          if (sessionId) {
            parts.push("sessionId ".concat(sessionId));
          }
          if (transcriptPath) {
            parts.push("transcript ".concat(transcriptPath));
          }
          return [2 /*return*/, "Stats: ".concat(parts.join(" \u2022 "))];
      }
    });
  });
}
function buildSubagentSystemPrompt(params) {
  var _a;
  var taskText =
    typeof params.task === "string" && params.task.trim()
      ? params.task.replace(/\s+/g, " ").trim()
      : "{{TASK_DESCRIPTION}}";
  var lines = [
    "# Subagent Context",
    "",
    "You are a **subagent** spawned by the main agent for a specific task.",
    "",
    "## Your Role",
    "- You were created to handle: ".concat(taskText),
    "- Complete this task. That's your entire purpose.",
    "- You are NOT the main agent. Don't try to be.",
    "",
    "## Rules",
    "1. **Stay focused** - Do your assigned task, nothing else",
    "2. **Complete the task** - Your final message will be automatically reported to the main agent",
    "3. **Don't initiate** - No heartbeats, no proactive actions, no side quests",
    "4. **Be ephemeral** - You may be terminated after task completion. That's fine.",
    "",
    "## Output Format",
    "When complete, your final response should include:",
    "- What you accomplished or found",
    "- Any relevant details the main agent should know",
    "- Keep it concise but informative",
    "",
    "## What You DON'T Do",
    "- NO user conversations (that's main agent's job)",
    "- NO external messages (email, tweets, etc.) unless explicitly tasked",
    "- NO cron jobs or persistent state",
    "- NO pretending to be the main agent",
    "- NO using the `message` tool directly",
    "",
    "## Session Context",
    params.label ? "- Label: ".concat(params.label) : undefined,
    params.requesterSessionKey
      ? "- Requester session: ".concat(params.requesterSessionKey, ".")
      : undefined,
    ((_a = params.requesterOrigin) === null || _a === void 0 ? void 0 : _a.channel)
      ? "- Requester channel: ".concat(params.requesterOrigin.channel, ".")
      : undefined,
    "- Your session: ".concat(params.childSessionKey, "."),
    "",
  ].filter(function (line) {
    return line !== undefined;
  });
  return lines.join("\n");
}
function runSubagentAnnounceFlow(params) {
  return __awaiter(this, void 0, void 0, function () {
    var didAnnounce,
      requesterOrigin,
      reply,
      outcome,
      waitMs,
      wait,
      statsLine,
      statusLabel,
      taskLabel,
      triggerMessage,
      queued,
      directOrigin,
      entry,
      err_1,
      _a,
      _b;
    var _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          didAnnounce = false;
          _d.label = 1;
        case 1:
          _d.trys.push([1, 10, 11, 20]);
          requesterOrigin = (0, delivery_context_js_1.normalizeDeliveryContext)(
            params.requesterOrigin,
          );
          reply = params.roundOneReply;
          outcome = params.outcome;
          if (!(!reply && params.waitForCompletion !== false)) {
            return [3 /*break*/, 4];
          }
          waitMs = Math.min(params.timeoutMs, 60000);
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              method: "agent.wait",
              params: {
                runId: params.childRunId,
                timeoutMs: waitMs,
              },
              timeoutMs: waitMs + 2000,
            }),
          ];
        case 2:
          wait = _d.sent();
          if ((wait === null || wait === void 0 ? void 0 : wait.status) === "timeout") {
            outcome = { status: "timeout" };
          } else if ((wait === null || wait === void 0 ? void 0 : wait.status) === "error") {
            outcome = { status: "error", error: wait.error };
          } else if ((wait === null || wait === void 0 ? void 0 : wait.status) === "ok") {
            outcome = { status: "ok" };
          }
          if (
            typeof (wait === null || wait === void 0 ? void 0 : wait.startedAt) === "number" &&
            !params.startedAt
          ) {
            params.startedAt = wait.startedAt;
          }
          if (
            typeof (wait === null || wait === void 0 ? void 0 : wait.endedAt) === "number" &&
            !params.endedAt
          ) {
            params.endedAt = wait.endedAt;
          }
          if ((wait === null || wait === void 0 ? void 0 : wait.status) === "timeout") {
            if (!outcome) {
              outcome = { status: "timeout" };
            }
          }
          return [
            4 /*yield*/,
            (0, agent_step_js_1.readLatestAssistantReply)({
              sessionKey: params.childSessionKey,
            }),
          ];
        case 3:
          reply = _d.sent();
          _d.label = 4;
        case 4:
          if (!!reply) {
            return [3 /*break*/, 6];
          }
          return [
            4 /*yield*/,
            (0, agent_step_js_1.readLatestAssistantReply)({
              sessionKey: params.childSessionKey,
            }),
          ];
        case 5:
          reply = _d.sent();
          _d.label = 6;
        case 6:
          if (!outcome) {
            outcome = { status: "unknown" };
          }
          return [
            4 /*yield*/,
            buildSubagentStatsLine({
              sessionKey: params.childSessionKey,
              startedAt: params.startedAt,
              endedAt: params.endedAt,
            }),
          ];
        case 7:
          statsLine = _d.sent();
          statusLabel =
            outcome.status === "ok"
              ? "completed successfully"
              : outcome.status === "timeout"
                ? "timed out"
                : outcome.status === "error"
                  ? "failed: ".concat(outcome.error || "unknown error")
                  : "finished with unknown status";
          taskLabel = params.label || params.task || "background task";
          triggerMessage = [
            'A background task "'.concat(taskLabel, '" just ').concat(statusLabel, "."),
            "",
            "Findings:",
            reply || "(no output)",
            "",
            statsLine,
            "",
            "Summarize this naturally for the user. Keep it brief (1-2 sentences). Flow it into the conversation naturally.",
            "Do not mention technical details like tokens, stats, or that this was a background task.",
            "You can respond with NO_REPLY if no announcement is needed (e.g., internal task with no user-facing result).",
          ].join("\n");
          return [
            4 /*yield*/,
            maybeQueueSubagentAnnounce({
              requesterSessionKey: params.requesterSessionKey,
              triggerMessage: triggerMessage,
              summaryLine: taskLabel,
              requesterOrigin: requesterOrigin,
            }),
          ];
        case 8:
          queued = _d.sent();
          if (queued === "steered") {
            didAnnounce = true;
            return [2 /*return*/, true];
          }
          if (queued === "queued") {
            didAnnounce = true;
            return [2 /*return*/, true];
          }
          directOrigin = requesterOrigin;
          if (!directOrigin) {
            entry = loadRequesterSessionEntry(params.requesterSessionKey).entry;
            directOrigin = (0, delivery_context_js_1.deliveryContextFromSession)(entry);
          }
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              method: "agent",
              params: {
                sessionKey: params.requesterSessionKey,
                message: triggerMessage,
                deliver: true,
                channel:
                  directOrigin === null || directOrigin === void 0 ? void 0 : directOrigin.channel,
                accountId:
                  directOrigin === null || directOrigin === void 0
                    ? void 0
                    : directOrigin.accountId,
                to: directOrigin === null || directOrigin === void 0 ? void 0 : directOrigin.to,
                threadId:
                  (directOrigin === null || directOrigin === void 0
                    ? void 0
                    : directOrigin.threadId) != null && directOrigin.threadId !== ""
                    ? String(directOrigin.threadId)
                    : undefined,
                idempotencyKey: node_crypto_1.default.randomUUID(),
              },
              expectFinal: true,
              timeoutMs: 60000,
            }),
          ];
        case 9:
          _d.sent();
          didAnnounce = true;
          return [3 /*break*/, 20];
        case 10:
          err_1 = _d.sent();
          (_c = runtime_js_1.defaultRuntime.error) === null || _c === void 0
            ? void 0
            : _c.call(
                runtime_js_1.defaultRuntime,
                "Subagent announce failed: ".concat(String(err_1)),
              );
          return [3 /*break*/, 20];
        case 11:
          if (!params.label) {
            return [3 /*break*/, 15];
          }
          _d.label = 12;
        case 12:
          _d.trys.push([12, 14, , 15]);
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              method: "sessions.patch",
              params: { key: params.childSessionKey, label: params.label },
              timeoutMs: 10000,
            }),
          ];
        case 13:
          _d.sent();
          return [3 /*break*/, 15];
        case 14:
          _a = _d.sent();
          return [3 /*break*/, 15];
        case 15:
          if (!(params.cleanup === "delete")) {
            return [3 /*break*/, 19];
          }
          _d.label = 16;
        case 16:
          _d.trys.push([16, 18, , 19]);
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              method: "sessions.delete",
              params: { key: params.childSessionKey, deleteTranscript: true },
              timeoutMs: 10000,
            }),
          ];
        case 17:
          _d.sent();
          return [3 /*break*/, 19];
        case 18:
          _b = _d.sent();
          return [3 /*break*/, 19];
        case 19:
          return [7 /*endfinally*/];
        case 20:
          return [2 /*return*/, didAnnounce];
      }
    });
  });
}
