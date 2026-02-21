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
exports.handleSubagentsCommand = void 0;
exports.extractMessageText = extractMessageText;
var node_crypto_1 = require("node:crypto");
var pi_embedded_js_1 = require("../../agents/pi-embedded.js");
var lanes_js_1 = require("../../agents/lanes.js");
var subagent_registry_js_1 = require("../../agents/subagent-registry.js");
var sessions_helpers_js_1 = require("../../agents/tools/sessions-helpers.js");
var sessions_js_1 = require("../../config/sessions.js");
var call_js_1 = require("../../gateway/call.js");
var globals_js_1 = require("../../globals.js");
var session_key_js_1 = require("../../routing/session-key.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var subagents_utils_js_1 = require("./subagents-utils.js");
var abort_js_1 = require("./abort.js");
var queue_js_1 = require("./queue.js");
var COMMAND = "/subagents";
var ACTIONS = new Set(["list", "stop", "log", "send", "info", "help"]);
function formatTimestamp(valueMs) {
  if (!valueMs || !Number.isFinite(valueMs) || valueMs <= 0) {
    return "n/a";
  }
  return new Date(valueMs).toISOString();
}
function formatTimestampWithAge(valueMs) {
  if (!valueMs || !Number.isFinite(valueMs) || valueMs <= 0) {
    return "n/a";
  }
  return ""
    .concat(formatTimestamp(valueMs), " (")
    .concat((0, subagents_utils_js_1.formatAgeShort)(Date.now() - valueMs), ")");
}
function resolveRequesterSessionKey(params) {
  var _a, _b;
  var raw =
    ((_a = params.sessionKey) === null || _a === void 0 ? void 0 : _a.trim()) ||
    ((_b = params.ctx.CommandTargetSessionKey) === null || _b === void 0 ? void 0 : _b.trim());
  if (!raw) {
    return undefined;
  }
  var _c = (0, sessions_helpers_js_1.resolveMainSessionAlias)(params.cfg),
    mainKey = _c.mainKey,
    alias = _c.alias;
  return (0, sessions_helpers_js_1.resolveInternalSessionKey)({
    key: raw,
    alias: alias,
    mainKey: mainKey,
  });
}
function resolveSubagentTarget(runs, token) {
  var trimmed = token === null || token === void 0 ? void 0 : token.trim();
  if (!trimmed) {
    return { error: "Missing subagent id." };
  }
  if (trimmed === "last") {
    var sorted_1 = (0, subagents_utils_js_1.sortSubagentRuns)(runs);
    return { entry: sorted_1[0] };
  }
  var sorted = (0, subagents_utils_js_1.sortSubagentRuns)(runs);
  if (/^\d+$/.test(trimmed)) {
    var idx = Number.parseInt(trimmed, 10);
    if (!Number.isFinite(idx) || idx <= 0 || idx > sorted.length) {
      return { error: "Invalid subagent index: ".concat(trimmed) };
    }
    return { entry: sorted[idx - 1] };
  }
  if (trimmed.includes(":")) {
    var match = runs.find(function (entry) {
      return entry.childSessionKey === trimmed;
    });
    return match ? { entry: match } : { error: "Unknown subagent session: ".concat(trimmed) };
  }
  var byRunId = runs.filter(function (entry) {
    return entry.runId.startsWith(trimmed);
  });
  if (byRunId.length === 1) {
    return { entry: byRunId[0] };
  }
  if (byRunId.length > 1) {
    return { error: "Ambiguous run id prefix: ".concat(trimmed) };
  }
  return { error: "Unknown subagent id: ".concat(trimmed) };
}
function buildSubagentsHelp() {
  return [
    "🧭 Subagents",
    "Usage:",
    "- /subagents list",
    "- /subagents stop <id|#|all>",
    "- /subagents log <id|#> [limit] [tools]",
    "- /subagents info <id|#>",
    "- /subagents send <id|#> <message>",
    "",
    "Ids: use the list index (#), runId prefix, or full session key.",
  ].join("\n");
}
function normalizeMessageText(text) {
  return text.replace(/\s+/g, " ").trim();
}
function extractMessageText(message) {
  var role = typeof message.role === "string" ? message.role : "";
  var shouldSanitize = role === "assistant";
  var content = message.content;
  if (typeof content === "string") {
    var normalized = normalizeMessageText(
      shouldSanitize ? (0, sessions_helpers_js_1.sanitizeTextContent)(content) : content,
    );
    return normalized ? { role: role, text: normalized } : null;
  }
  if (!Array.isArray(content)) {
    return null;
  }
  var chunks = [];
  for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
    var block = content_1[_i];
    if (!block || typeof block !== "object") {
      continue;
    }
    if (block.type !== "text") {
      continue;
    }
    var text = block.text;
    if (typeof text === "string") {
      var value = shouldSanitize ? (0, sessions_helpers_js_1.sanitizeTextContent)(text) : text;
      if (value.trim()) {
        chunks.push(value);
      }
    }
  }
  var joined = normalizeMessageText(chunks.join(" "));
  return joined ? { role: role, text: joined } : null;
}
function formatLogLines(messages) {
  var lines = [];
  for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
    var msg = messages_1[_i];
    var extracted = extractMessageText(msg);
    if (!extracted) {
      continue;
    }
    var label = extracted.role === "assistant" ? "Assistant" : "User";
    lines.push("".concat(label, ": ").concat(extracted.text));
  }
  return lines;
}
function loadSubagentSessionEntry(params, childKey) {
  var _a;
  var parsed = (0, session_key_js_1.parseAgentSessionKey)(childKey);
  var storePath = (0, sessions_js_1.resolveStorePath)(
    (_a = params.cfg.session) === null || _a === void 0 ? void 0 : _a.store,
    { agentId: parsed === null || parsed === void 0 ? void 0 : parsed.agentId },
  );
  var store = (0, sessions_js_1.loadSessionStore)(storePath);
  return { storePath: storePath, store: store, entry: store[childKey] };
}
var handleSubagentsCommand = function (params, allowTextCommands) {
  return __awaiter(void 0, void 0, void 0, function () {
    var normalized,
      rest,
      _a,
      actionRaw,
      restTokens,
      action,
      requesterKey,
      runs,
      sorted,
      active,
      done,
      lines_1,
      target,
      stopped,
      label,
      resolved,
      childKey_1,
      _b,
      storePath,
      store,
      entry_1,
      sessionId,
      cleared,
      target,
      resolved,
      run,
      sessionEntry,
      runtime,
      outcome,
      lines,
      target,
      includeTools,
      limitToken,
      limit,
      resolved,
      history_1,
      rawMessages,
      filtered,
      lines,
      header,
      target,
      message,
      resolved,
      idempotencyKey,
      runId,
      response,
      err_1,
      messageText,
      waitMs,
      wait,
      history_2,
      filtered,
      last,
      replyText;
    var _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
      switch (_l.label) {
        case 0:
          if (!allowTextCommands) {
            return [2 /*return*/, null];
          }
          normalized = params.command.commandBodyNormalized;
          if (!normalized.startsWith(COMMAND)) {
            return [2 /*return*/, null];
          }
          if (!params.command.isAuthorizedSender) {
            (0, globals_js_1.logVerbose)(
              "Ignoring /subagents from unauthorized sender: ".concat(
                params.command.senderId || "<unknown>",
              ),
            );
            return [2 /*return*/, { shouldContinue: false }];
          }
          rest = normalized.slice(COMMAND.length).trim();
          ((_a = rest.split(/\s+/).filter(Boolean)),
            (actionRaw = _a[0]),
            (restTokens = _a.slice(1)));
          action =
            (actionRaw === null || actionRaw === void 0 ? void 0 : actionRaw.toLowerCase()) ||
            "list";
          if (!ACTIONS.has(action)) {
            return [2 /*return*/, { shouldContinue: false, reply: { text: buildSubagentsHelp() } }];
          }
          requesterKey = resolveRequesterSessionKey(params);
          if (!requesterKey) {
            return [
              2 /*return*/,
              { shouldContinue: false, reply: { text: "⚠️ Missing session key." } },
            ];
          }
          runs = (0, subagent_registry_js_1.listSubagentRunsForRequester)(requesterKey);
          if (action === "help") {
            return [2 /*return*/, { shouldContinue: false, reply: { text: buildSubagentsHelp() } }];
          }
          if (action === "list") {
            if (runs.length === 0) {
              return [
                2 /*return*/,
                { shouldContinue: false, reply: { text: "🧭 Subagents: none for this session." } },
              ];
            }
            sorted = (0, subagents_utils_js_1.sortSubagentRuns)(runs);
            active = sorted.filter(function (entry) {
              return !entry.endedAt;
            });
            done = sorted.length - active.length;
            lines_1 = [
              "🧭 Subagents (current session)",
              "Active: ".concat(active.length, " \u00B7 Done: ").concat(done),
            ];
            sorted.forEach(function (entry, index) {
              var _a;
              var status = (0, subagents_utils_js_1.formatRunStatus)(entry);
              var label = (0, subagents_utils_js_1.formatRunLabel)(entry);
              var runtime =
                entry.endedAt && entry.startedAt
                  ? (0, subagents_utils_js_1.formatDurationShort)(entry.endedAt - entry.startedAt)
                  : (0, subagents_utils_js_1.formatAgeShort)(
                      Date.now() -
                        ((_a = entry.startedAt) !== null && _a !== void 0 ? _a : entry.createdAt),
                    );
              var runId = entry.runId.slice(0, 8);
              lines_1.push(
                ""
                  .concat(index + 1, ") ")
                  .concat(status, " \u00B7 ")
                  .concat(label, " \u00B7 ")
                  .concat(runtime, " \u00B7 run ")
                  .concat(runId, " \u00B7 ")
                  .concat(entry.childSessionKey),
              );
            });
            return [2 /*return*/, { shouldContinue: false, reply: { text: lines_1.join("\n") } }];
          }
          if (!(action === "stop")) {
            return [3 /*break*/, 3];
          }
          target = restTokens[0];
          if (!target) {
            return [
              2 /*return*/,
              { shouldContinue: false, reply: { text: "⚙️ Usage: /subagents stop <id|#|all>" } },
            ];
          }
          if (target === "all" || target === "*") {
            stopped = (0, abort_js_1.stopSubagentsForRequester)({
              cfg: params.cfg,
              requesterSessionKey: requesterKey,
            }).stopped;
            label = stopped === 1 ? "subagent" : "subagents";
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: { text: "\u2699\uFE0F Stopped ".concat(stopped, " ").concat(label, ".") },
              },
            ];
          }
          resolved = resolveSubagentTarget(runs, target);
          if (!resolved.entry) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text: "\u26A0\uFE0F ".concat(
                    (_c = resolved.error) !== null && _c !== void 0 ? _c : "Unknown subagent.",
                  ),
                },
              },
            ];
          }
          if (resolved.entry.endedAt) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: { text: "⚙️ Subagent already finished." },
              },
            ];
          }
          childKey_1 = resolved.entry.childSessionKey;
          ((_b = loadSubagentSessionEntry(params, childKey_1)),
            (storePath = _b.storePath),
            (store = _b.store),
            (entry_1 = _b.entry));
          sessionId = entry_1 === null || entry_1 === void 0 ? void 0 : entry_1.sessionId;
          if (sessionId) {
            (0, pi_embedded_js_1.abortEmbeddedPiRun)(sessionId);
          }
          cleared = (0, queue_js_1.clearSessionQueues)([childKey_1, sessionId]);
          if (cleared.followupCleared > 0 || cleared.laneCleared > 0) {
            (0, globals_js_1.logVerbose)(
              "subagents stop: cleared followups="
                .concat(cleared.followupCleared, " lane=")
                .concat(cleared.laneCleared, " keys=")
                .concat(cleared.keys.join(",")),
            );
          }
          if (!entry_1) {
            return [3 /*break*/, 2];
          }
          entry_1.abortedLastRun = true;
          entry_1.updatedAt = Date.now();
          store[childKey_1] = entry_1;
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(storePath, function (nextStore) {
              nextStore[childKey_1] = entry_1;
            }),
          ];
        case 1:
          _l.sent();
          _l.label = 2;
        case 2:
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: {
                text: "\u2699\uFE0F Stop requested for ".concat(
                  (0, subagents_utils_js_1.formatRunLabel)(resolved.entry),
                  ".",
                ),
              },
            },
          ];
        case 3:
          if (action === "info") {
            target = restTokens[0];
            if (!target) {
              return [
                2 /*return*/,
                { shouldContinue: false, reply: { text: "ℹ️ Usage: /subagents info <id|#>" } },
              ];
            }
            resolved = resolveSubagentTarget(runs, target);
            if (!resolved.entry) {
              return [
                2 /*return*/,
                {
                  shouldContinue: false,
                  reply: {
                    text: "\u26A0\uFE0F ".concat(
                      (_d = resolved.error) !== null && _d !== void 0 ? _d : "Unknown subagent.",
                    ),
                  },
                },
              ];
            }
            run = resolved.entry;
            sessionEntry = loadSubagentSessionEntry(params, run.childSessionKey).entry;
            runtime =
              run.startedAt && Number.isFinite(run.startedAt)
                ? (0, subagents_utils_js_1.formatDurationShort)(
                    ((_e = run.endedAt) !== null && _e !== void 0 ? _e : Date.now()) -
                      run.startedAt,
                  )
                : "n/a";
            outcome = run.outcome
              ? ""
                  .concat(run.outcome.status)
                  .concat(run.outcome.error ? " (".concat(run.outcome.error, ")") : "")
              : "n/a";
            lines = [
              "ℹ️ Subagent info",
              "Status: ".concat((0, subagents_utils_js_1.formatRunStatus)(run)),
              "Label: ".concat((0, subagents_utils_js_1.formatRunLabel)(run)),
              "Task: ".concat(run.task),
              "Run: ".concat(run.runId),
              "Session: ".concat(run.childSessionKey),
              "SessionId: ".concat(
                (_f =
                  sessionEntry === null || sessionEntry === void 0
                    ? void 0
                    : sessionEntry.sessionId) !== null && _f !== void 0
                  ? _f
                  : "n/a",
              ),
              "Transcript: ".concat(
                (_g =
                  sessionEntry === null || sessionEntry === void 0
                    ? void 0
                    : sessionEntry.sessionFile) !== null && _g !== void 0
                  ? _g
                  : "n/a",
              ),
              "Runtime: ".concat(runtime),
              "Created: ".concat(formatTimestampWithAge(run.createdAt)),
              "Started: ".concat(formatTimestampWithAge(run.startedAt)),
              "Ended: ".concat(formatTimestampWithAge(run.endedAt)),
              "Cleanup: ".concat(run.cleanup),
              run.archiveAtMs
                ? "Archive: ".concat(formatTimestampWithAge(run.archiveAtMs))
                : undefined,
              run.cleanupHandled ? "Cleanup handled: yes" : undefined,
              "Outcome: ".concat(outcome),
            ].filter(Boolean);
            return [2 /*return*/, { shouldContinue: false, reply: { text: lines.join("\n") } }];
          }
          if (!(action === "log")) {
            return [3 /*break*/, 5];
          }
          target = restTokens[0];
          if (!target) {
            return [
              2 /*return*/,
              { shouldContinue: false, reply: { text: "📜 Usage: /subagents log <id|#> [limit]" } },
            ];
          }
          includeTools = restTokens.some(function (token) {
            return token.toLowerCase() === "tools";
          });
          limitToken = restTokens.find(function (token) {
            return /^\d+$/.test(token);
          });
          limit = limitToken ? Math.min(200, Math.max(1, Number.parseInt(limitToken, 10))) : 20;
          resolved = resolveSubagentTarget(runs, target);
          if (!resolved.entry) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text: "\u26A0\uFE0F ".concat(
                    (_h = resolved.error) !== null && _h !== void 0 ? _h : "Unknown subagent.",
                  ),
                },
              },
            ];
          }
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              method: "chat.history",
              params: { sessionKey: resolved.entry.childSessionKey, limit: limit },
            }),
          ];
        case 4:
          history_1 = _l.sent();
          rawMessages = Array.isArray(
            history_1 === null || history_1 === void 0 ? void 0 : history_1.messages,
          )
            ? history_1.messages
            : [];
          filtered = includeTools
            ? rawMessages
            : (0, sessions_helpers_js_1.stripToolMessages)(rawMessages);
          lines = formatLogLines(filtered);
          header = "\uD83D\uDCDC Subagent log: ".concat(
            (0, subagents_utils_js_1.formatRunLabel)(resolved.entry),
          );
          if (lines.length === 0) {
            return [
              2 /*return*/,
              { shouldContinue: false, reply: { text: "".concat(header, "\n(no messages)") } },
            ];
          }
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: { text: __spreadArray([header], lines, true).join("\n") },
            },
          ];
        case 5:
          if (!(action === "send")) {
            return [3 /*break*/, 12];
          }
          target = restTokens[0];
          message = restTokens.slice(1).join(" ").trim();
          if (!target || !message) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: { text: "✉️ Usage: /subagents send <id|#> <message>" },
              },
            ];
          }
          resolved = resolveSubagentTarget(runs, target);
          if (!resolved.entry) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text: "\u26A0\uFE0F ".concat(
                    (_j = resolved.error) !== null && _j !== void 0 ? _j : "Unknown subagent.",
                  ),
                },
              },
            ];
          }
          idempotencyKey = node_crypto_1.default.randomUUID();
          runId = idempotencyKey;
          _l.label = 6;
        case 6:
          _l.trys.push([6, 8, , 9]);
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              method: "agent",
              params: {
                message: message,
                sessionKey: resolved.entry.childSessionKey,
                idempotencyKey: idempotencyKey,
                deliver: false,
                channel: message_channel_js_1.INTERNAL_MESSAGE_CHANNEL,
                lane: lanes_js_1.AGENT_LANE_SUBAGENT,
              },
              timeoutMs: 10000,
            }),
          ];
        case 7:
          response = _l.sent();
          if (response === null || response === void 0 ? void 0 : response.runId) {
            runId = response.runId;
          }
          return [3 /*break*/, 9];
        case 8:
          err_1 = _l.sent();
          messageText =
            err_1 instanceof Error ? err_1.message : typeof err_1 === "string" ? err_1 : "error";
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: { text: "\u26A0\uFE0F Send failed: ".concat(messageText) },
            },
          ];
        case 9:
          waitMs = 30000;
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              method: "agent.wait",
              params: { runId: runId, timeoutMs: waitMs },
              timeoutMs: waitMs + 2000,
            }),
          ];
        case 10:
          wait = _l.sent();
          if ((wait === null || wait === void 0 ? void 0 : wait.status) === "timeout") {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text: "\u23F3 Subagent still running (run ".concat(runId.slice(0, 8), ")."),
                },
              },
            ];
          }
          if ((wait === null || wait === void 0 ? void 0 : wait.status) === "error") {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text: "\u26A0\uFE0F Subagent error: "
                    .concat(
                      (_k = wait.error) !== null && _k !== void 0 ? _k : "unknown error",
                      " (run ",
                    )
                    .concat(runId.slice(0, 8), ")."),
                },
              },
            ];
          }
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              method: "chat.history",
              params: { sessionKey: resolved.entry.childSessionKey, limit: 50 },
            }),
          ];
        case 11:
          history_2 = _l.sent();
          filtered = (0, sessions_helpers_js_1.stripToolMessages)(
            Array.isArray(history_2 === null || history_2 === void 0 ? void 0 : history_2.messages)
              ? history_2.messages
              : [],
          );
          last = filtered.length > 0 ? filtered[filtered.length - 1] : undefined;
          replyText = last ? (0, sessions_helpers_js_1.extractAssistantText)(last) : undefined;
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: {
                text:
                  replyText !== null && replyText !== void 0
                    ? replyText
                    : "\u2705 Sent to "
                        .concat((0, subagents_utils_js_1.formatRunLabel)(resolved.entry), " (run ")
                        .concat(runId.slice(0, 8), ")."),
              },
            },
          ];
        case 12:
          return [2 /*return*/, { shouldContinue: false, reply: { text: buildSubagentsHelp() } }];
      }
    });
  });
};
exports.handleSubagentsCommand = handleSubagentsCommand;
