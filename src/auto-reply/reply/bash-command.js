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
exports.handleBashChatCommand = handleBashChatCommand;
exports.resetBashChatCommandForTests = resetBashChatCommandForTests;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var bash_process_registry_js_1 = require("../../agents/bash-process-registry.js");
var bash_tools_js_1 = require("../../agents/bash-tools.js");
var sandbox_js_1 = require("../../agents/sandbox.js");
var shell_utils_js_1 = require("../../agents/shell-utils.js");
var command_format_js_1 = require("../../cli/command-format.js");
var globals_js_1 = require("../../globals.js");
var utils_js_1 = require("../../utils.js");
var mentions_js_1 = require("./mentions.js");
var CHAT_BASH_SCOPE_KEY = "chat:bash";
var DEFAULT_FOREGROUND_MS = 2000;
var MAX_FOREGROUND_MS = 30000;
var activeJob = null;
function resolveForegroundMs(cfg) {
  var _a;
  var raw = (_a = cfg.commands) === null || _a === void 0 ? void 0 : _a.bashForegroundMs;
  if (typeof raw !== "number" || Number.isNaN(raw)) {
    return DEFAULT_FOREGROUND_MS;
  }
  return (0, utils_js_1.clampInt)(raw, 0, MAX_FOREGROUND_MS);
}
function formatSessionSnippet(sessionId) {
  var trimmed = sessionId.trim();
  if (trimmed.length <= 12) {
    return trimmed;
  }
  return "".concat(trimmed.slice(0, 8), "\u2026");
}
function formatOutputBlock(text) {
  var trimmed = text.trim();
  if (!trimmed) {
    return "(no output)";
  }
  return "```txt\n".concat(trimmed, "\n```");
}
function parseBashRequest(raw) {
  var _a, _b, _c, _d, _e;
  var trimmed = raw.trimStart();
  var restSource = "";
  if (trimmed.toLowerCase().startsWith("/bash")) {
    var match = trimmed.match(/^\/bash(?:\s*:\s*|\s+|$)([\s\S]*)$/i);
    if (!match) {
      return null;
    }
    restSource = (_a = match[1]) !== null && _a !== void 0 ? _a : "";
  } else if (trimmed.startsWith("!")) {
    restSource = trimmed.slice(1);
    if (restSource.trimStart().startsWith(":")) {
      restSource = restSource.trimStart().slice(1);
    }
  } else {
    return null;
  }
  var rest = restSource.trimStart();
  if (!rest) {
    return { action: "help" };
  }
  var tokenMatch = rest.match(/^(\S+)(?:\s+([\s\S]+))?$/);
  var token =
    (_c =
      (_b = tokenMatch === null || tokenMatch === void 0 ? void 0 : tokenMatch[1]) === null ||
      _b === void 0
        ? void 0
        : _b.trim()) !== null && _c !== void 0
      ? _c
      : "";
  var remainder =
    (_e =
      (_d = tokenMatch === null || tokenMatch === void 0 ? void 0 : tokenMatch[2]) === null ||
      _d === void 0
        ? void 0
        : _d.trim()) !== null && _e !== void 0
      ? _e
      : "";
  var lowered = token.toLowerCase();
  if (lowered === "poll") {
    return { action: "poll", sessionId: remainder || undefined };
  }
  if (lowered === "stop") {
    return { action: "stop", sessionId: remainder || undefined };
  }
  if (lowered === "help") {
    return { action: "help" };
  }
  return { action: "run", command: rest };
}
function resolveRawCommandBody(params) {
  var _a, _b, _c;
  var source =
    (_c =
      (_b = (_a = params.ctx.CommandBody) !== null && _a !== void 0 ? _a : params.ctx.RawBody) !==
        null && _b !== void 0
        ? _b
        : params.ctx.Body) !== null && _c !== void 0
      ? _c
      : "";
  var stripped = (0, mentions_js_1.stripStructuralPrefixes)(source);
  return params.isGroup
    ? (0, mentions_js_1.stripMentions)(stripped, params.ctx, params.cfg, params.agentId)
    : stripped;
}
function getScopedSession(sessionId) {
  var running = (0, bash_process_registry_js_1.getSession)(sessionId);
  if (running && running.scopeKey === CHAT_BASH_SCOPE_KEY) {
    return { running: running };
  }
  var finished = (0, bash_process_registry_js_1.getFinishedSession)(sessionId);
  if (finished && finished.scopeKey === CHAT_BASH_SCOPE_KEY) {
    return { finished: finished };
  }
  return {};
}
function ensureActiveJobState() {
  if (!activeJob) {
    return null;
  }
  if (activeJob.state === "starting") {
    return activeJob;
  }
  var _a = getScopedSession(activeJob.sessionId),
    running = _a.running,
    finished = _a.finished;
  if (running) {
    return activeJob;
  }
  if (finished) {
    activeJob = null;
    return null;
  }
  activeJob = null;
  return null;
}
function attachActiveWatcher(sessionId) {
  if (!activeJob || activeJob.state !== "running") {
    return;
  }
  if (activeJob.sessionId !== sessionId) {
    return;
  }
  if (activeJob.watcherAttached) {
    return;
  }
  var running = getScopedSession(sessionId).running;
  var child = running === null || running === void 0 ? void 0 : running.child;
  if (!child) {
    return;
  }
  activeJob.watcherAttached = true;
  child.once("close", function () {
    if (
      (activeJob === null || activeJob === void 0 ? void 0 : activeJob.state) === "running" &&
      activeJob.sessionId === sessionId
    ) {
      activeJob = null;
    }
  });
}
function buildUsageReply() {
  return {
    text: [
      "⚙️ Usage:",
      "- ! <command>",
      "- !poll | ! poll",
      "- !stop | ! stop",
      "- /bash ... (alias; same subcommands as !)",
    ].join("\n"),
  };
}
function formatElevatedUnavailableMessage(params) {
  var lines = [];
  lines.push(
    "elevated is not available right now (runtime=".concat(
      params.runtimeSandboxed ? "sandboxed" : "direct",
      ").",
    ),
  );
  if (params.failures.length > 0) {
    lines.push(
      "Failing gates: ".concat(
        params.failures
          .map(function (f) {
            return "".concat(f.gate, " (").concat(f.key, ")");
          })
          .join(", "),
      ),
    );
  } else {
    lines.push(
      "Failing gates: enabled (tools.elevated.enabled / agents.list[].tools.elevated.enabled), allowFrom (tools.elevated.allowFrom.<provider>).",
    );
  }
  lines.push("Fix-it keys:");
  lines.push("- tools.elevated.enabled");
  lines.push("- tools.elevated.allowFrom.<provider>");
  lines.push("- agents.list[].tools.elevated.enabled");
  lines.push("- agents.list[].tools.elevated.allowFrom.<provider>");
  if (params.sessionKey) {
    lines.push(
      "See: ".concat(
        (0, command_format_js_1.formatCliCommand)(
          "openclaw sandbox explain --session ".concat(params.sessionKey),
        ),
      ),
    );
  }
  return lines.join("\n");
}
function handleBashChatCommand(params) {
  return __awaiter(this, void 0, void 0, function () {
    var agentId,
      runtimeSandboxed,
      rawBody,
      request,
      liveJob,
      sessionId,
      _a,
      running,
      finished,
      runtimeSec,
      tail,
      exitLabel,
      prefix,
      sessionId,
      running,
      pid,
      label,
      commandText,
      foregroundMs,
      shouldBackgroundImmediately,
      timeoutSec,
      notifyOnExit,
      execTool,
      result,
      sessionId,
      snippet,
      exitCode,
      output,
      err_1,
      message;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    return __generator(this, function (_r) {
      switch (_r.label) {
        case 0:
          if (((_b = params.cfg.commands) === null || _b === void 0 ? void 0 : _b.bash) !== true) {
            return [
              2 /*return*/,
              {
                text: "⚠️ bash is disabled. Set commands.bash=true to enable. Docs: https://docs.openclaw.ai/tools/slash-commands#config",
              },
            ];
          }
          agentId =
            (_c = params.agentId) !== null && _c !== void 0
              ? _c
              : (0, agent_scope_js_1.resolveSessionAgentId)({
                  sessionKey: params.sessionKey,
                  config: params.cfg,
                });
          if (!params.elevated.enabled || !params.elevated.allowed) {
            runtimeSandboxed = (0, sandbox_js_1.resolveSandboxRuntimeStatus)({
              cfg: params.cfg,
              sessionKey: params.ctx.SessionKey,
            }).sandboxed;
            return [
              2 /*return*/,
              {
                text: formatElevatedUnavailableMessage({
                  runtimeSandboxed: runtimeSandboxed,
                  failures: params.elevated.failures,
                  sessionKey: params.ctx.SessionKey,
                }),
              },
            ];
          }
          rawBody = resolveRawCommandBody({
            ctx: params.ctx,
            cfg: params.cfg,
            agentId: agentId,
            isGroup: params.isGroup,
          }).trim();
          request = parseBashRequest(rawBody);
          if (!request) {
            return [2 /*return*/, { text: "⚠️ Unrecognized bash request." }];
          }
          liveJob = ensureActiveJobState();
          if (request.action === "help") {
            return [2 /*return*/, buildUsageReply()];
          }
          if (request.action === "poll") {
            sessionId =
              ((_d = request.sessionId) === null || _d === void 0 ? void 0 : _d.trim()) ||
              ((liveJob === null || liveJob === void 0 ? void 0 : liveJob.state) === "running"
                ? liveJob.sessionId
                : "");
            if (!sessionId) {
              return [2 /*return*/, { text: "⚙️ No active bash job." }];
            }
            ((_a = getScopedSession(sessionId)), (running = _a.running), (finished = _a.finished));
            if (running) {
              attachActiveWatcher(sessionId);
              runtimeSec = Math.max(0, Math.floor((Date.now() - running.startedAt) / 1000));
              tail = running.tail || "(no output yet)";
              return [
                2 /*return*/,
                {
                  text: [
                    "\u2699\uFE0F bash still running (session "
                      .concat(formatSessionSnippet(sessionId), ", ")
                      .concat(runtimeSec, "s)."),
                    formatOutputBlock(tail),
                    "Hint: !stop (or /bash stop)",
                  ].join("\n"),
                },
              ];
            }
            if (finished) {
              if (
                (activeJob === null || activeJob === void 0 ? void 0 : activeJob.state) ===
                  "running" &&
                activeJob.sessionId === sessionId
              ) {
                activeJob = null;
              }
              exitLabel = finished.exitSignal
                ? "signal ".concat(String(finished.exitSignal))
                : "code ".concat(
                    String((_e = finished.exitCode) !== null && _e !== void 0 ? _e : 0),
                  );
              prefix = finished.status === "completed" ? "⚙️" : "⚠️";
              return [
                2 /*return*/,
                {
                  text: [
                    ""
                      .concat(prefix, " bash finished (session ")
                      .concat(formatSessionSnippet(sessionId), ")."),
                    "Exit: ".concat(exitLabel),
                    formatOutputBlock(finished.aggregated || finished.tail),
                  ].join("\n"),
                },
              ];
            }
            if (
              (activeJob === null || activeJob === void 0 ? void 0 : activeJob.state) ===
                "running" &&
              activeJob.sessionId === sessionId
            ) {
              activeJob = null;
            }
            return [
              2 /*return*/,
              {
                text: "\u2699\uFE0F No bash session found for ".concat(
                  formatSessionSnippet(sessionId),
                  ".",
                ),
              },
            ];
          }
          if (request.action === "stop") {
            sessionId =
              ((_f = request.sessionId) === null || _f === void 0 ? void 0 : _f.trim()) ||
              ((liveJob === null || liveJob === void 0 ? void 0 : liveJob.state) === "running"
                ? liveJob.sessionId
                : "");
            if (!sessionId) {
              return [2 /*return*/, { text: "⚙️ No active bash job." }];
            }
            running = getScopedSession(sessionId).running;
            if (!running) {
              if (
                (activeJob === null || activeJob === void 0 ? void 0 : activeJob.state) ===
                  "running" &&
                activeJob.sessionId === sessionId
              ) {
                activeJob = null;
              }
              return [
                2 /*return*/,
                {
                  text: "\u2699\uFE0F No running bash job found for ".concat(
                    formatSessionSnippet(sessionId),
                    ".",
                  ),
                },
              ];
            }
            if (!running.backgrounded) {
              return [
                2 /*return*/,
                {
                  text: "\u26A0\uFE0F Session ".concat(
                    formatSessionSnippet(sessionId),
                    " is not backgrounded.",
                  ),
                },
              ];
            }
            pid =
              (_g = running.pid) !== null && _g !== void 0
                ? _g
                : (_h = running.child) === null || _h === void 0
                  ? void 0
                  : _h.pid;
            if (pid) {
              (0, shell_utils_js_1.killProcessTree)(pid);
            }
            (0, bash_process_registry_js_1.markExited)(running, null, "SIGKILL", "failed");
            if (
              (activeJob === null || activeJob === void 0 ? void 0 : activeJob.state) ===
                "running" &&
              activeJob.sessionId === sessionId
            ) {
              activeJob = null;
            }
            return [
              2 /*return*/,
              {
                text: "\u2699\uFE0F bash stopped (session ".concat(
                  formatSessionSnippet(sessionId),
                  ").",
                ),
              },
            ];
          }
          // request.action === "run"
          if (liveJob) {
            label =
              liveJob.state === "running" ? formatSessionSnippet(liveJob.sessionId) : "starting";
            return [
              2 /*return*/,
              {
                text: "\u26A0\uFE0F A bash job is already running (".concat(
                  label,
                  "). Use !poll / !stop (or /bash poll / /bash stop).",
                ),
              },
            ];
          }
          commandText = request.command.trim();
          if (!commandText) {
            return [2 /*return*/, buildUsageReply()];
          }
          activeJob = {
            state: "starting",
            startedAt: Date.now(),
            command: commandText,
          };
          _r.label = 1;
        case 1:
          _r.trys.push([1, 3, , 4]);
          foregroundMs = resolveForegroundMs(params.cfg);
          shouldBackgroundImmediately = foregroundMs <= 0;
          timeoutSec =
            (_k = (_j = params.cfg.tools) === null || _j === void 0 ? void 0 : _j.exec) === null ||
            _k === void 0
              ? void 0
              : _k.timeoutSec;
          notifyOnExit =
            (_m = (_l = params.cfg.tools) === null || _l === void 0 ? void 0 : _l.exec) === null ||
            _m === void 0
              ? void 0
              : _m.notifyOnExit;
          execTool = (0, bash_tools_js_1.createExecTool)({
            scopeKey: CHAT_BASH_SCOPE_KEY,
            allowBackground: true,
            timeoutSec: timeoutSec,
            sessionKey: params.sessionKey,
            notifyOnExit: notifyOnExit,
            elevated: {
              enabled: params.elevated.enabled,
              allowed: params.elevated.allowed,
              defaultLevel: "on",
            },
          });
          return [
            4 /*yield*/,
            execTool.execute("chat-bash", {
              command: commandText,
              background: shouldBackgroundImmediately,
              yieldMs: shouldBackgroundImmediately ? undefined : foregroundMs,
              timeout: timeoutSec,
              elevated: true,
            }),
          ];
        case 2:
          result = _r.sent();
          if (
            ((_o = result.details) === null || _o === void 0 ? void 0 : _o.status) === "running"
          ) {
            sessionId = result.details.sessionId;
            activeJob = {
              state: "running",
              sessionId: sessionId,
              startedAt: result.details.startedAt,
              command: commandText,
              watcherAttached: false,
            };
            attachActiveWatcher(sessionId);
            snippet = formatSessionSnippet(sessionId);
            (0, globals_js_1.logVerbose)(
              "Started bash session ".concat(snippet, ": ").concat(commandText),
            );
            return [
              2 /*return*/,
              {
                text: "\u2699\uFE0F bash started (session ".concat(
                  sessionId,
                  "). Still running; use !poll / !stop (or /bash poll / /bash stop).",
                ),
              },
            ];
          }
          // Completed in foreground.
          activeJob = null;
          exitCode =
            ((_p = result.details) === null || _p === void 0 ? void 0 : _p.status) === "completed"
              ? result.details.exitCode
              : 0;
          output =
            ((_q = result.details) === null || _q === void 0 ? void 0 : _q.status) === "completed"
              ? result.details.aggregated
              : result.content
                  .map(function (chunk) {
                    return chunk.type === "text" ? chunk.text : "";
                  })
                  .join("\n");
          return [
            2 /*return*/,
            {
              text: [
                "\u2699\uFE0F bash: ".concat(commandText),
                "Exit: ".concat(exitCode),
                formatOutputBlock(output || "(no output)"),
              ].join("\n"),
            },
          ];
        case 3:
          err_1 = _r.sent();
          activeJob = null;
          message = err_1 instanceof Error ? err_1.message : String(err_1);
          return [
            2 /*return*/,
            {
              text: [
                "\u26A0\uFE0F bash failed: ".concat(commandText),
                formatOutputBlock(message),
              ].join("\n"),
            },
          ];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function resetBashChatCommandForTests() {
  activeJob = null;
}
