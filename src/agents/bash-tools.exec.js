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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.execTool = void 0;
exports.createExecTool = createExecTool;
var node_crypto_1 = require("node:crypto");
var node_path_1 = require("node:path");
var typebox_1 = require("@sinclair/typebox");
var exec_approvals_js_1 = require("../infra/exec-approvals.js");
var heartbeat_wake_js_1 = require("../infra/heartbeat-wake.js");
var node_shell_js_1 = require("../infra/node-shell.js");
var shell_env_js_1 = require("../infra/shell-env.js");
var system_events_js_1 = require("../infra/system-events.js");
var logger_js_1 = require("../logger.js");
var spawn_utils_js_1 = require("../process/spawn-utils.js");
var bash_process_registry_js_1 = require("./bash-process-registry.js");
var bash_tools_shared_js_1 = require("./bash-tools.shared.js");
var gateway_js_1 = require("./tools/gateway.js");
var nodes_utils_js_1 = require("./tools/nodes-utils.js");
var shell_utils_js_1 = require("./shell-utils.js");
var pty_dsr_js_1 = require("./pty-dsr.js");
var session_key_js_1 = require("../routing/session-key.js");
var DEFAULT_MAX_OUTPUT = (0, bash_tools_shared_js_1.clampNumber)(
  (0, bash_tools_shared_js_1.readEnvInt)("PI_BASH_MAX_OUTPUT_CHARS"),
  200000,
  1000,
  200000,
);
var DEFAULT_PENDING_MAX_OUTPUT = (0, bash_tools_shared_js_1.clampNumber)(
  (0, bash_tools_shared_js_1.readEnvInt)("OPENCLAW_BASH_PENDING_MAX_OUTPUT_CHARS"),
  200000,
  1000,
  200000,
);
var DEFAULT_PATH =
  (_a = process.env.PATH) !== null && _a !== void 0
    ? _a
    : "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin";
var DEFAULT_NOTIFY_TAIL_CHARS = 400;
var DEFAULT_APPROVAL_TIMEOUT_MS = 120000;
var DEFAULT_APPROVAL_REQUEST_TIMEOUT_MS = 130000;
var DEFAULT_APPROVAL_RUNNING_NOTICE_MS = 10000;
var APPROVAL_SLUG_LENGTH = 8;
var execSchema = typebox_1.Type.Object({
  command: typebox_1.Type.String({ description: "Shell command to execute" }),
  workdir: typebox_1.Type.Optional(
    typebox_1.Type.String({ description: "Working directory (defaults to cwd)" }),
  ),
  env: typebox_1.Type.Optional(
    typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.String()),
  ),
  yieldMs: typebox_1.Type.Optional(
    typebox_1.Type.Number({
      description: "Milliseconds to wait before backgrounding (default 10000)",
    }),
  ),
  background: typebox_1.Type.Optional(
    typebox_1.Type.Boolean({ description: "Run in background immediately" }),
  ),
  timeout: typebox_1.Type.Optional(
    typebox_1.Type.Number({
      description: "Timeout in seconds (optional, kills process on expiry)",
    }),
  ),
  pty: typebox_1.Type.Optional(
    typebox_1.Type.Boolean({
      description:
        "Run in a pseudo-terminal (PTY) when available (TTY-required CLIs, coding agents)",
    }),
  ),
  elevated: typebox_1.Type.Optional(
    typebox_1.Type.Boolean({
      description: "Run on the host with elevated permissions (if allowed)",
    }),
  ),
  host: typebox_1.Type.Optional(
    typebox_1.Type.String({
      description: "Exec host (sandbox|gateway|node).",
    }),
  ),
  security: typebox_1.Type.Optional(
    typebox_1.Type.String({
      description: "Exec security mode (deny|allowlist|full).",
    }),
  ),
  ask: typebox_1.Type.Optional(
    typebox_1.Type.String({
      description: "Exec ask mode (off|on-miss|always).",
    }),
  ),
  node: typebox_1.Type.Optional(
    typebox_1.Type.String({
      description: "Node id/name for host=node.",
    }),
  ),
});
function normalizeExecHost(value) {
  var normalized = value === null || value === void 0 ? void 0 : value.trim().toLowerCase();
  if (normalized === "sandbox" || normalized === "gateway" || normalized === "node") {
    return normalized;
  }
  return null;
}
function normalizeExecSecurity(value) {
  var normalized = value === null || value === void 0 ? void 0 : value.trim().toLowerCase();
  if (normalized === "deny" || normalized === "allowlist" || normalized === "full") {
    return normalized;
  }
  return null;
}
function normalizeExecAsk(value) {
  var normalized = value === null || value === void 0 ? void 0 : value.trim().toLowerCase();
  if (normalized === "off" || normalized === "on-miss" || normalized === "always") {
    return normalized;
  }
  return null;
}
function renderExecHostLabel(host) {
  return host === "sandbox" ? "sandbox" : host === "gateway" ? "gateway" : "node";
}
function normalizeNotifyOutput(value) {
  return value.replace(/\s+/g, " ").trim();
}
function normalizePathPrepend(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }
  var seen = new Set();
  var normalized = [];
  for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
    var entry = entries_1[_i];
    if (typeof entry !== "string") {
      continue;
    }
    var trimmed = entry.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    normalized.push(trimmed);
  }
  return normalized;
}
function mergePathPrepend(existing, prepend) {
  if (prepend.length === 0) {
    return existing;
  }
  var partsExisting = (existing !== null && existing !== void 0 ? existing : "")
    .split(node_path_1.default.delimiter)
    .map(function (part) {
      return part.trim();
    })
    .filter(Boolean);
  var merged = [];
  var seen = new Set();
  for (
    var _i = 0, _a = __spreadArray(__spreadArray([], prepend, true), partsExisting, true);
    _i < _a.length;
    _i++
  ) {
    var part = _a[_i];
    if (seen.has(part)) {
      continue;
    }
    seen.add(part);
    merged.push(part);
  }
  return merged.join(node_path_1.default.delimiter);
}
function applyPathPrepend(env, prepend, options) {
  if (prepend.length === 0) {
    return;
  }
  if ((options === null || options === void 0 ? void 0 : options.requireExisting) && !env.PATH) {
    return;
  }
  var merged = mergePathPrepend(env.PATH, prepend);
  if (merged) {
    env.PATH = merged;
  }
}
function applyShellPath(env, shellPath) {
  if (!shellPath) {
    return;
  }
  var entries = shellPath
    .split(node_path_1.default.delimiter)
    .map(function (part) {
      return part.trim();
    })
    .filter(Boolean);
  if (entries.length === 0) {
    return;
  }
  var merged = mergePathPrepend(env.PATH, entries);
  if (merged) {
    env.PATH = merged;
  }
}
function maybeNotifyOnExit(session, status) {
  var _a, _b;
  if (!session.backgrounded || !session.notifyOnExit || session.exitNotified) {
    return;
  }
  var sessionKey = (_a = session.sessionKey) === null || _a === void 0 ? void 0 : _a.trim();
  if (!sessionKey) {
    return;
  }
  session.exitNotified = true;
  var exitLabel = session.exitSignal
    ? "signal ".concat(session.exitSignal)
    : "code ".concat((_b = session.exitCode) !== null && _b !== void 0 ? _b : 0);
  var output = normalizeNotifyOutput(
    (0, bash_process_registry_js_1.tail)(
      session.tail || session.aggregated || "",
      DEFAULT_NOTIFY_TAIL_CHARS,
    ),
  );
  var summary = output
    ? "Exec "
        .concat(status, " (")
        .concat(session.id.slice(0, 8), ", ")
        .concat(exitLabel, ") :: ")
        .concat(output)
    : "Exec ".concat(status, " (").concat(session.id.slice(0, 8), ", ").concat(exitLabel, ")");
  (0, system_events_js_1.enqueueSystemEvent)(summary, { sessionKey: sessionKey });
  (0, heartbeat_wake_js_1.requestHeartbeatNow)({ reason: "exec:".concat(session.id, ":exit") });
}
function createApprovalSlug(id) {
  return id.slice(0, APPROVAL_SLUG_LENGTH);
}
function resolveApprovalRunningNoticeMs(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_APPROVAL_RUNNING_NOTICE_MS;
  }
  if (value <= 0) {
    return 0;
  }
  return Math.floor(value);
}
function emitExecSystemEvent(text, opts) {
  var _a;
  var sessionKey = (_a = opts.sessionKey) === null || _a === void 0 ? void 0 : _a.trim();
  if (!sessionKey) {
    return;
  }
  (0, system_events_js_1.enqueueSystemEvent)(text, {
    sessionKey: sessionKey,
    contextKey: opts.contextKey,
  });
  (0, heartbeat_wake_js_1.requestHeartbeatNow)({ reason: "exec-event" });
}
function runExecProcess(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var startedAt,
      sessionId,
      child,
      pty,
      stdin,
      spawned,
      _a,
      shell,
      shellArgs,
      ptyModule,
      spawnPty,
      err_1,
      errText,
      warning,
      spawned,
      _b,
      shell,
      shellArgs,
      spawned,
      session,
      settled,
      timeoutTimer,
      timeoutFinalizeTimer,
      timedOut,
      timeoutFinalizeMs,
      resolveFn,
      settle,
      finalizeTimeout,
      onTimeout,
      emitUpdate,
      handleStdout,
      handleStderr,
      cursorResponse_1,
      promise;
    var _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
      switch (_j.label) {
        case 0:
          startedAt = Date.now();
          sessionId = (0, bash_process_registry_js_1.createSessionSlug)();
          child = null;
          pty = null;
          if (!opts.sandbox) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, spawn_utils_js_1.spawnWithFallback)({
              argv: __spreadArray(
                ["docker"],
                (0, bash_tools_shared_js_1.buildDockerExecArgs)({
                  containerName: opts.sandbox.containerName,
                  command: opts.command,
                  workdir:
                    (_c = opts.containerWorkdir) !== null && _c !== void 0
                      ? _c
                      : opts.sandbox.containerWorkdir,
                  env: opts.env,
                  tty: opts.usePty,
                }),
                true,
              ),
              options: {
                cwd: opts.workdir,
                env: process.env,
                detached: process.platform !== "win32",
                stdio: ["pipe", "pipe", "pipe"],
                windowsHide: true,
              },
              fallbacks: [
                {
                  label: "no-detach",
                  options: { detached: false },
                },
              ],
              onFallback: function (err, fallback) {
                var errText = (0, spawn_utils_js_1.formatSpawnError)(err);
                var warning = "Warning: spawn failed ("
                  .concat(errText, "); retrying with ")
                  .concat(fallback.label, ".");
                (0, logger_js_1.logWarn)(
                  "exec: spawn failed ("
                    .concat(errText, "); retrying with ")
                    .concat(fallback.label, "."),
                );
                opts.warnings.push(warning);
              },
            }),
          ];
        case 1:
          spawned = _j.sent().child;
          child = spawned;
          stdin = child.stdin;
          return [3 /*break*/, 10];
        case 2:
          if (!opts.usePty) {
            return [3 /*break*/, 8];
          }
          ((_a = (0, shell_utils_js_1.getShellConfig)()),
            (shell = _a.shell),
            (shellArgs = _a.args));
          _j.label = 3;
        case 3:
          _j.trys.push([3, 5, , 7]);
          return [
            4 /*yield*/,
            Promise.resolve().then(function () {
              return require("@lydell/node-pty");
            }),
          ];
        case 4:
          ptyModule = _j.sent();
          spawnPty =
            (_d = ptyModule.spawn) !== null && _d !== void 0
              ? _d
              : (_e = ptyModule.default) === null || _e === void 0
                ? void 0
                : _e.spawn;
          if (!spawnPty) {
            throw new Error("PTY support is unavailable (node-pty spawn not found).");
          }
          pty = spawnPty(
            shell,
            __spreadArray(__spreadArray([], shellArgs, true), [opts.command], false),
            {
              cwd: opts.workdir,
              env: opts.env,
              name: (_f = process.env.TERM) !== null && _f !== void 0 ? _f : "xterm-256color",
              cols: 120,
              rows: 30,
            },
          );
          stdin = {
            destroyed: false,
            write: function (data, cb) {
              try {
                pty === null || pty === void 0 ? void 0 : pty.write(data);
                cb === null || cb === void 0 ? void 0 : cb(null);
              } catch (err) {
                cb === null || cb === void 0 ? void 0 : cb(err);
              }
            },
            end: function () {
              try {
                var eof = process.platform === "win32" ? "\x1a" : "\x04";
                pty === null || pty === void 0 ? void 0 : pty.write(eof);
              } catch (_a) {
                // ignore EOF errors
              }
            },
          };
          return [3 /*break*/, 7];
        case 5:
          err_1 = _j.sent();
          errText = String(err_1);
          warning = "Warning: PTY spawn failed ("
            .concat(errText, "); retrying without PTY for `")
            .concat(opts.command, "`.");
          (0, logger_js_1.logWarn)(
            "exec: PTY spawn failed ("
              .concat(errText, '); retrying without PTY for "')
              .concat(opts.command, '".'),
          );
          opts.warnings.push(warning);
          return [
            4 /*yield*/,
            (0, spawn_utils_js_1.spawnWithFallback)({
              argv: __spreadArray(__spreadArray([shell], shellArgs, true), [opts.command], false),
              options: {
                cwd: opts.workdir,
                env: opts.env,
                detached: process.platform !== "win32",
                stdio: ["pipe", "pipe", "pipe"],
                windowsHide: true,
              },
              fallbacks: [
                {
                  label: "no-detach",
                  options: { detached: false },
                },
              ],
              onFallback: function (fallbackErr, fallback) {
                var fallbackText = (0, spawn_utils_js_1.formatSpawnError)(fallbackErr);
                var fallbackWarning = "Warning: spawn failed ("
                  .concat(fallbackText, "); retrying with ")
                  .concat(fallback.label, ".");
                (0, logger_js_1.logWarn)(
                  "exec: spawn failed ("
                    .concat(fallbackText, "); retrying with ")
                    .concat(fallback.label, "."),
                );
                opts.warnings.push(fallbackWarning);
              },
            }),
          ];
        case 6:
          spawned = _j.sent().child;
          child = spawned;
          stdin = child.stdin;
          return [3 /*break*/, 7];
        case 7:
          return [3 /*break*/, 10];
        case 8:
          ((_b = (0, shell_utils_js_1.getShellConfig)()),
            (shell = _b.shell),
            (shellArgs = _b.args));
          return [
            4 /*yield*/,
            (0, spawn_utils_js_1.spawnWithFallback)({
              argv: __spreadArray(__spreadArray([shell], shellArgs, true), [opts.command], false),
              options: {
                cwd: opts.workdir,
                env: opts.env,
                detached: process.platform !== "win32",
                stdio: ["pipe", "pipe", "pipe"],
                windowsHide: true,
              },
              fallbacks: [
                {
                  label: "no-detach",
                  options: { detached: false },
                },
              ],
              onFallback: function (err, fallback) {
                var errText = (0, spawn_utils_js_1.formatSpawnError)(err);
                var warning = "Warning: spawn failed ("
                  .concat(errText, "); retrying with ")
                  .concat(fallback.label, ".");
                (0, logger_js_1.logWarn)(
                  "exec: spawn failed ("
                    .concat(errText, "); retrying with ")
                    .concat(fallback.label, "."),
                );
                opts.warnings.push(warning);
              },
            }),
          ];
        case 9:
          spawned = _j.sent().child;
          child = spawned;
          stdin = child.stdin;
          _j.label = 10;
        case 10:
          session = {
            id: sessionId,
            command: opts.command,
            scopeKey: opts.scopeKey,
            sessionKey: opts.sessionKey,
            notifyOnExit: opts.notifyOnExit,
            exitNotified: false,
            child: child !== null && child !== void 0 ? child : undefined,
            stdin: stdin,
            pid:
              (_g = child === null || child === void 0 ? void 0 : child.pid) !== null &&
              _g !== void 0
                ? _g
                : pty === null || pty === void 0
                  ? void 0
                  : pty.pid,
            startedAt: startedAt,
            cwd: opts.workdir,
            maxOutputChars: opts.maxOutput,
            pendingMaxOutputChars: opts.pendingMaxOutput,
            totalOutputChars: 0,
            pendingStdout: [],
            pendingStderr: [],
            pendingStdoutChars: 0,
            pendingStderrChars: 0,
            aggregated: "",
            tail: "",
            exited: false,
            exitCode: undefined,
            exitSignal: undefined,
            truncated: false,
            backgrounded: false,
          };
          (0, bash_process_registry_js_1.addSession)(session);
          settled = false;
          timeoutTimer = null;
          timeoutFinalizeTimer = null;
          timedOut = false;
          timeoutFinalizeMs = 1000;
          resolveFn = null;
          settle = function (outcome) {
            if (settled) {
              return;
            }
            settled = true;
            resolveFn === null || resolveFn === void 0 ? void 0 : resolveFn(outcome);
          };
          finalizeTimeout = function () {
            if (session.exited) {
              return;
            }
            (0, bash_process_registry_js_1.markExited)(session, null, "SIGKILL", "failed");
            maybeNotifyOnExit(session, "failed");
            var aggregated = session.aggregated.trim();
            var reason = "Command timed out after ".concat(opts.timeoutSec, " seconds");
            settle({
              status: "failed",
              exitCode: null,
              exitSignal: "SIGKILL",
              durationMs: Date.now() - startedAt,
              aggregated: aggregated,
              timedOut: true,
              reason: aggregated ? "".concat(aggregated, "\n\n").concat(reason) : reason,
            });
          };
          onTimeout = function () {
            timedOut = true;
            (0, bash_tools_shared_js_1.killSession)(session);
            if (!timeoutFinalizeTimer) {
              timeoutFinalizeTimer = setTimeout(function () {
                finalizeTimeout();
              }, timeoutFinalizeMs);
            }
          };
          if (opts.timeoutSec > 0) {
            timeoutTimer = setTimeout(function () {
              onTimeout();
            }, opts.timeoutSec * 1000);
          }
          emitUpdate = function () {
            var _a;
            if (!opts.onUpdate) {
              return;
            }
            var tailText = session.tail || session.aggregated;
            var warningText = opts.warnings.length
              ? "".concat(opts.warnings.join("\n"), "\n\n")
              : "";
            opts.onUpdate({
              content: [{ type: "text", text: warningText + (tailText || "") }],
              details: {
                status: "running",
                sessionId: sessionId,
                pid: (_a = session.pid) !== null && _a !== void 0 ? _a : undefined,
                startedAt: startedAt,
                cwd: session.cwd,
                tail: session.tail,
              },
            });
          };
          handleStdout = function (data) {
            var str = (0, shell_utils_js_1.sanitizeBinaryOutput)(data.toString());
            for (
              var _i = 0, _a = (0, bash_tools_shared_js_1.chunkString)(str);
              _i < _a.length;
              _i++
            ) {
              var chunk = _a[_i];
              (0, bash_process_registry_js_1.appendOutput)(session, "stdout", chunk);
              emitUpdate();
            }
          };
          handleStderr = function (data) {
            var str = (0, shell_utils_js_1.sanitizeBinaryOutput)(data.toString());
            for (
              var _i = 0, _a = (0, bash_tools_shared_js_1.chunkString)(str);
              _i < _a.length;
              _i++
            ) {
              var chunk = _a[_i];
              (0, bash_process_registry_js_1.appendOutput)(session, "stderr", chunk);
              emitUpdate();
            }
          };
          if (pty) {
            cursorResponse_1 = (0, pty_dsr_js_1.buildCursorPositionResponse)();
            pty.onData(function (data) {
              var raw = data.toString();
              var _a = (0, pty_dsr_js_1.stripDsrRequests)(raw),
                cleaned = _a.cleaned,
                requests = _a.requests;
              if (requests > 0) {
                for (var i = 0; i < requests; i += 1) {
                  pty.write(cursorResponse_1);
                }
              }
              handleStdout(cleaned);
            });
          } else if (child) {
            child.stdout.on("data", handleStdout);
            child.stderr.on("data", handleStderr);
          }
          promise = new Promise(function (resolve) {
            resolveFn = resolve;
            var handleExit = function (code, exitSignal) {
              if (timeoutTimer) {
                clearTimeout(timeoutTimer);
              }
              if (timeoutFinalizeTimer) {
                clearTimeout(timeoutFinalizeTimer);
              }
              var durationMs = Date.now() - startedAt;
              var wasSignal = exitSignal != null;
              var isSuccess = code === 0 && !wasSignal && !timedOut;
              var status = isSuccess ? "completed" : "failed";
              (0, bash_process_registry_js_1.markExited)(session, code, exitSignal, status);
              maybeNotifyOnExit(session, status);
              if (!session.child && session.stdin) {
                session.stdin.destroyed = true;
              }
              if (settled) {
                return;
              }
              var aggregated = session.aggregated.trim();
              if (!isSuccess) {
                var reason = timedOut
                  ? "Command timed out after ".concat(opts.timeoutSec, " seconds")
                  : wasSignal && exitSignal
                    ? "Command aborted by signal ".concat(exitSignal)
                    : code === null
                      ? "Command aborted before exit code was captured"
                      : "Command exited with code ".concat(code);
                var message = aggregated ? "".concat(aggregated, "\n\n").concat(reason) : reason;
                settle({
                  status: "failed",
                  exitCode: code !== null && code !== void 0 ? code : null,
                  exitSignal: exitSignal !== null && exitSignal !== void 0 ? exitSignal : null,
                  durationMs: durationMs,
                  aggregated: aggregated,
                  timedOut: timedOut,
                  reason: message,
                });
                return;
              }
              settle({
                status: "completed",
                exitCode: code !== null && code !== void 0 ? code : 0,
                exitSignal: exitSignal !== null && exitSignal !== void 0 ? exitSignal : null,
                durationMs: durationMs,
                aggregated: aggregated,
                timedOut: false,
              });
            };
            if (pty) {
              pty.onExit(function (event) {
                var _a, _b;
                var rawSignal = (_a = event.signal) !== null && _a !== void 0 ? _a : null;
                var normalizedSignal = rawSignal === 0 ? null : rawSignal;
                handleExit(
                  (_b = event.exitCode) !== null && _b !== void 0 ? _b : null,
                  normalizedSignal,
                );
              });
            } else if (child) {
              child.once("close", function (code, exitSignal) {
                handleExit(code, exitSignal);
              });
              child.once("error", function (err) {
                if (timeoutTimer) {
                  clearTimeout(timeoutTimer);
                }
                if (timeoutFinalizeTimer) {
                  clearTimeout(timeoutFinalizeTimer);
                }
                (0, bash_process_registry_js_1.markExited)(session, null, null, "failed");
                maybeNotifyOnExit(session, "failed");
                var aggregated = session.aggregated.trim();
                var message = aggregated
                  ? "".concat(aggregated, "\n\n").concat(String(err))
                  : String(err);
                settle({
                  status: "failed",
                  exitCode: null,
                  exitSignal: null,
                  durationMs: Date.now() - startedAt,
                  aggregated: aggregated,
                  timedOut: timedOut,
                  reason: message,
                });
              });
            }
          });
          return [
            2 /*return*/,
            {
              session: session,
              startedAt: startedAt,
              pid: (_h = session.pid) !== null && _h !== void 0 ? _h : undefined,
              promise: promise,
              kill: function () {
                return (0, bash_tools_shared_js_1.killSession)(session);
              },
            },
          ];
      }
    });
  });
}
function createExecTool(defaults) {
  var _this = this;
  var _a, _b, _c, _d;
  var defaultBackgroundMs = (0, bash_tools_shared_js_1.clampNumber)(
    (_a = defaults === null || defaults === void 0 ? void 0 : defaults.backgroundMs) !== null &&
      _a !== void 0
      ? _a
      : (0, bash_tools_shared_js_1.readEnvInt)("PI_BASH_YIELD_MS"),
    10000,
    10,
    120000,
  );
  var allowBackground =
    (_b = defaults === null || defaults === void 0 ? void 0 : defaults.allowBackground) !== null &&
    _b !== void 0
      ? _b
      : true;
  var defaultTimeoutSec =
    typeof (defaults === null || defaults === void 0 ? void 0 : defaults.timeoutSec) === "number" &&
    defaults.timeoutSec > 0
      ? defaults.timeoutSec
      : 1800;
  var defaultPathPrepend = normalizePathPrepend(
    defaults === null || defaults === void 0 ? void 0 : defaults.pathPrepend,
  );
  var safeBins = (0, exec_approvals_js_1.resolveSafeBins)(
    defaults === null || defaults === void 0 ? void 0 : defaults.safeBins,
  );
  var notifyOnExit =
    (defaults === null || defaults === void 0 ? void 0 : defaults.notifyOnExit) !== false;
  var notifySessionKey =
    ((_c = defaults === null || defaults === void 0 ? void 0 : defaults.sessionKey) === null ||
    _c === void 0
      ? void 0
      : _c.trim()) || undefined;
  var approvalRunningNoticeMs = resolveApprovalRunningNoticeMs(
    defaults === null || defaults === void 0 ? void 0 : defaults.approvalRunningNoticeMs,
  );
  // Derive agentId only when sessionKey is an agent session key.
  var parsedAgentSession = (0, session_key_js_1.parseAgentSessionKey)(
    defaults === null || defaults === void 0 ? void 0 : defaults.sessionKey,
  );
  var agentId =
    (_d = defaults === null || defaults === void 0 ? void 0 : defaults.agentId) !== null &&
    _d !== void 0
      ? _d
      : parsedAgentSession
        ? (0, session_key_js_1.resolveAgentIdFromSessionKey)(
            defaults === null || defaults === void 0 ? void 0 : defaults.sessionKey,
          )
        : undefined;
  return {
    name: "exec",
    label: "exec",
    description:
      "Execute shell commands with background continuation. Use yieldMs/background to continue later via process tool. Use pty=true for TTY-required commands (terminal UIs, coding agents).",
    parameters: execSchema,
    execute: function (_toolCallId, args, signal, onUpdate) {
      return __awaiter(_this, void 0, void 0, function () {
        var params,
          maxOutput,
          pendingMaxOutput,
          warnings,
          backgroundRequested,
          yieldRequested,
          yieldWindow,
          elevatedDefaults,
          elevatedAllowed,
          elevatedDefaultMode,
          effectiveDefaultMode,
          elevatedMode,
          elevatedRequested,
          runtime,
          gates,
          contextParts,
          provider,
          sessionKey,
          configuredHost,
          requestedHost,
          host,
          configuredSecurity,
          requestedSecurity,
          security,
          configuredAsk,
          requestedAsk,
          ask,
          bypassApprovals,
          sandbox,
          rawWorkdir,
          workdir,
          containerWorkdir,
          resolved,
          baseEnv,
          mergedEnv,
          env,
          shellPath,
          approvals,
          hostSecurity_1,
          hostAsk_1,
          askFallback_1,
          boundNode,
          requestedNode,
          nodeQuery,
          nodes,
          nodeId_1,
          nodeInfo,
          supportsSystemRun,
          argv_1,
          nodeEnv_1,
          baseAllowlistEval,
          analysisOk,
          allowlistSatisfied,
          approvalsSnapshot,
          approvalsFile,
          resolved,
          allowlistEval,
          _a,
          requiresAsk,
          commandText_1,
          invokeTimeoutMs_1,
          buildInvokeParams_1,
          approvalId_1,
          approvalSlug,
          expiresAtMs,
          contextKey_1,
          noticeSeconds_1,
          warningText,
          startedAt,
          raw,
          payload,
          approvals_1,
          hostSecurity_2,
          hostAsk_2,
          askFallback_2,
          allowlistEval_1,
          allowlistMatches_2,
          analysisOk_1,
          allowlistSatisfied_1,
          requiresAsk,
          approvalId_2,
          approvalSlug,
          expiresAtMs,
          contextKey_2,
          resolvedPath_1,
          noticeSeconds_2,
          commandText_2,
          effectiveTimeout_1,
          warningText,
          seen,
          _i,
          allowlistMatches_1,
          match,
          effectiveTimeout,
          getWarningText,
          usePty,
          run,
          yielded,
          yieldTimer,
          onAbortSignal;
        var _this = this;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        return __generator(this, function (_v) {
          switch (_v.label) {
            case 0:
              params = args;
              if (!params.command) {
                throw new Error("Provide a command to start.");
              }
              maxOutput = DEFAULT_MAX_OUTPUT;
              pendingMaxOutput = DEFAULT_PENDING_MAX_OUTPUT;
              warnings = [];
              backgroundRequested = params.background === true;
              yieldRequested = typeof params.yieldMs === "number";
              if (!allowBackground && (backgroundRequested || yieldRequested)) {
                warnings.push("Warning: background execution is disabled; running synchronously.");
              }
              yieldWindow = allowBackground
                ? backgroundRequested
                  ? 0
                  : (0, bash_tools_shared_js_1.clampNumber)(
                      (_b = params.yieldMs) !== null && _b !== void 0 ? _b : defaultBackgroundMs,
                      defaultBackgroundMs,
                      10,
                      120000,
                    )
                : null;
              elevatedDefaults =
                defaults === null || defaults === void 0 ? void 0 : defaults.elevated;
              elevatedAllowed = Boolean(
                (elevatedDefaults === null || elevatedDefaults === void 0
                  ? void 0
                  : elevatedDefaults.enabled) && elevatedDefaults.allowed,
              );
              elevatedDefaultMode =
                (elevatedDefaults === null || elevatedDefaults === void 0
                  ? void 0
                  : elevatedDefaults.defaultLevel) === "full"
                  ? "full"
                  : (elevatedDefaults === null || elevatedDefaults === void 0
                        ? void 0
                        : elevatedDefaults.defaultLevel) === "ask"
                    ? "ask"
                    : (elevatedDefaults === null || elevatedDefaults === void 0
                          ? void 0
                          : elevatedDefaults.defaultLevel) === "on"
                      ? "ask"
                      : "off";
              effectiveDefaultMode = elevatedAllowed ? elevatedDefaultMode : "off";
              elevatedMode =
                typeof params.elevated === "boolean"
                  ? params.elevated
                    ? elevatedDefaultMode === "full"
                      ? "full"
                      : "ask"
                    : "off"
                  : effectiveDefaultMode;
              elevatedRequested = elevatedMode !== "off";
              if (elevatedRequested) {
                if (
                  !(elevatedDefaults === null || elevatedDefaults === void 0
                    ? void 0
                    : elevatedDefaults.enabled) ||
                  !elevatedDefaults.allowed
                ) {
                  runtime = (defaults === null || defaults === void 0 ? void 0 : defaults.sandbox)
                    ? "sandboxed"
                    : "direct";
                  gates = [];
                  contextParts = [];
                  provider =
                    (_c =
                      defaults === null || defaults === void 0
                        ? void 0
                        : defaults.messageProvider) === null || _c === void 0
                      ? void 0
                      : _c.trim();
                  sessionKey =
                    (_d =
                      defaults === null || defaults === void 0 ? void 0 : defaults.sessionKey) ===
                      null || _d === void 0
                      ? void 0
                      : _d.trim();
                  if (provider) {
                    contextParts.push("provider=".concat(provider));
                  }
                  if (sessionKey) {
                    contextParts.push("session=".concat(sessionKey));
                  }
                  if (
                    !(elevatedDefaults === null || elevatedDefaults === void 0
                      ? void 0
                      : elevatedDefaults.enabled)
                  ) {
                    gates.push(
                      "enabled (tools.elevated.enabled / agents.list[].tools.elevated.enabled)",
                    );
                  } else {
                    gates.push(
                      "allowFrom (tools.elevated.allowFrom.<provider> / agents.list[].tools.elevated.allowFrom.<provider>)",
                    );
                  }
                  throw new Error(
                    [
                      "elevated is not available right now (runtime=".concat(runtime, ")."),
                      "Failing gates: ".concat(gates.join(", ")),
                      contextParts.length > 0
                        ? "Context: ".concat(contextParts.join(" "))
                        : undefined,
                      "Fix-it keys:",
                      "- tools.elevated.enabled",
                      "- tools.elevated.allowFrom.<provider>",
                      "- agents.list[].tools.elevated.enabled",
                      "- agents.list[].tools.elevated.allowFrom.<provider>",
                    ]
                      .filter(Boolean)
                      .join("\n"),
                  );
                }
              }
              if (elevatedRequested) {
                (0, logger_js_1.logInfo)(
                  "exec: elevated command ".concat(
                    (0, bash_tools_shared_js_1.truncateMiddle)(params.command, 120),
                  ),
                );
              }
              configuredHost =
                (_e = defaults === null || defaults === void 0 ? void 0 : defaults.host) !== null &&
                _e !== void 0
                  ? _e
                  : "sandbox";
              requestedHost =
                (_f = normalizeExecHost(params.host)) !== null && _f !== void 0 ? _f : null;
              host =
                requestedHost !== null && requestedHost !== void 0 ? requestedHost : configuredHost;
              if (!elevatedRequested && requestedHost && requestedHost !== configuredHost) {
                throw new Error(
                  "exec host not allowed (requested ".concat(
                    renderExecHostLabel(requestedHost),
                    "; ",
                  ) +
                    "configure tools.exec.host=".concat(
                      renderExecHostLabel(configuredHost),
                      " to allow).",
                    ),
                );
              }
              if (elevatedRequested) {
                host = "gateway";
              }
              configuredSecurity =
                (_g = defaults === null || defaults === void 0 ? void 0 : defaults.security) !==
                  null && _g !== void 0
                  ? _g
                  : host === "sandbox"
                    ? "deny"
                    : "allowlist";
              requestedSecurity = normalizeExecSecurity(params.security);
              security = (0, exec_approvals_js_1.minSecurity)(
                configuredSecurity,
                requestedSecurity !== null && requestedSecurity !== void 0
                  ? requestedSecurity
                  : configuredSecurity,
              );
              if (elevatedRequested && elevatedMode === "full") {
                security = "full";
              }
              configuredAsk =
                (_h = defaults === null || defaults === void 0 ? void 0 : defaults.ask) !== null &&
                _h !== void 0
                  ? _h
                  : "on-miss";
              requestedAsk = normalizeExecAsk(params.ask);
              ask = (0, exec_approvals_js_1.maxAsk)(
                configuredAsk,
                requestedAsk !== null && requestedAsk !== void 0 ? requestedAsk : configuredAsk,
              );
              bypassApprovals = elevatedRequested && elevatedMode === "full";
              if (bypassApprovals) {
                ask = "off";
              }
              sandbox =
                host === "sandbox"
                  ? defaults === null || defaults === void 0
                    ? void 0
                    : defaults.sandbox
                  : undefined;
              rawWorkdir =
                ((_j = params.workdir) === null || _j === void 0 ? void 0 : _j.trim()) ||
                (defaults === null || defaults === void 0 ? void 0 : defaults.cwd) ||
                process.cwd();
              workdir = rawWorkdir;
              containerWorkdir =
                sandbox === null || sandbox === void 0 ? void 0 : sandbox.containerWorkdir;
              if (!sandbox) {
                return [3 /*break*/, 2];
              }
              return [
                4 /*yield*/,
                (0, bash_tools_shared_js_1.resolveSandboxWorkdir)({
                  workdir: rawWorkdir,
                  sandbox: sandbox,
                  warnings: warnings,
                }),
              ];
            case 1:
              resolved = _v.sent();
              workdir = resolved.hostWorkdir;
              containerWorkdir = resolved.containerWorkdir;
              return [3 /*break*/, 3];
            case 2:
              workdir = (0, bash_tools_shared_js_1.resolveWorkdir)(rawWorkdir, warnings);
              _v.label = 3;
            case 3:
              baseEnv = (0, bash_tools_shared_js_1.coerceEnv)(process.env);
              mergedEnv = params.env ? __assign(__assign({}, baseEnv), params.env) : baseEnv;
              env = sandbox
                ? (0, bash_tools_shared_js_1.buildSandboxEnv)({
                    defaultPath: DEFAULT_PATH,
                    paramsEnv: params.env,
                    sandboxEnv: sandbox.env,
                    containerWorkdir:
                      containerWorkdir !== null && containerWorkdir !== void 0
                        ? containerWorkdir
                        : sandbox.containerWorkdir,
                  })
                : mergedEnv;
              if (
                !sandbox &&
                host === "gateway" &&
                !((_k = params.env) === null || _k === void 0 ? void 0 : _k.PATH)
              ) {
                shellPath = (0, shell_env_js_1.getShellPathFromLoginShell)({
                  env: process.env,
                  timeoutMs: (0, shell_env_js_1.resolveShellEnvFallbackTimeoutMs)(process.env),
                });
                applyShellPath(env, shellPath);
              }
              applyPathPrepend(env, defaultPathPrepend);
              if (!(host === "node")) {
                return [3 /*break*/, 10];
              }
              approvals = (0, exec_approvals_js_1.resolveExecApprovals)(agentId, {
                security: security,
                ask: ask,
              });
              hostSecurity_1 = (0, exec_approvals_js_1.minSecurity)(
                security,
                approvals.agent.security,
              );
              hostAsk_1 = (0, exec_approvals_js_1.maxAsk)(ask, approvals.agent.ask);
              askFallback_1 = approvals.agent.askFallback;
              if (hostSecurity_1 === "deny") {
                throw new Error("exec denied: host=node security=deny");
              }
              boundNode =
                (_l = defaults === null || defaults === void 0 ? void 0 : defaults.node) === null ||
                _l === void 0
                  ? void 0
                  : _l.trim();
              requestedNode = (_m = params.node) === null || _m === void 0 ? void 0 : _m.trim();
              if (boundNode && requestedNode && boundNode !== requestedNode) {
                throw new Error("exec node not allowed (bound to ".concat(boundNode, ")"));
              }
              nodeQuery = boundNode || requestedNode;
              return [4 /*yield*/, (0, nodes_utils_js_1.listNodes)({})];
            case 4:
              nodes = _v.sent();
              if (nodes.length === 0) {
                throw new Error(
                  "exec host=node requires a paired node (none available). This requires a companion app or node host.",
                );
              }
              try {
                nodeId_1 = (0, nodes_utils_js_1.resolveNodeIdFromList)(
                  nodes,
                  nodeQuery,
                  !nodeQuery,
                );
              } catch (err) {
                if (!nodeQuery && String(err).includes("node required")) {
                  throw new Error(
                    "exec host=node requires a node id when multiple nodes are available (set tools.exec.node or exec.node).",
                    { cause: err },
                  );
                }
                throw err;
              }
              nodeInfo = nodes.find(function (entry) {
                return entry.nodeId === nodeId_1;
              });
              supportsSystemRun = Array.isArray(
                nodeInfo === null || nodeInfo === void 0 ? void 0 : nodeInfo.commands,
              )
                ? (_o = nodeInfo === null || nodeInfo === void 0 ? void 0 : nodeInfo.commands) ===
                    null || _o === void 0
                  ? void 0
                  : _o.includes("system.run")
                : false;
              if (!supportsSystemRun) {
                throw new Error(
                  "exec host=node requires a node that supports system.run (companion app or node host).",
                );
              }
              argv_1 = (0, node_shell_js_1.buildNodeShellCommand)(
                params.command,
                nodeInfo === null || nodeInfo === void 0 ? void 0 : nodeInfo.platform,
              );
              nodeEnv_1 = params.env ? __assign({}, params.env) : undefined;
              if (nodeEnv_1) {
                applyPathPrepend(nodeEnv_1, defaultPathPrepend, { requireExisting: true });
              }
              baseAllowlistEval = (0, exec_approvals_js_1.evaluateShellAllowlist)({
                command: params.command,
                allowlist: [],
                safeBins: new Set(),
                cwd: workdir,
                env: env,
              });
              analysisOk = baseAllowlistEval.analysisOk;
              allowlistSatisfied = false;
              if (!(hostAsk_1 === "on-miss" && hostSecurity_1 === "allowlist" && analysisOk)) {
                return [3 /*break*/, 8];
              }
              _v.label = 5;
            case 5:
              _v.trys.push([5, 7, , 8]);
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)(
                  "exec.approvals.node.get",
                  { timeoutMs: 10000 },
                  { nodeId: nodeId_1 },
                ),
              ];
            case 6:
              approvalsSnapshot = _v.sent();
              approvalsFile =
                approvalsSnapshot && typeof approvalsSnapshot === "object"
                  ? approvalsSnapshot.file
                  : undefined;
              if (approvalsFile && typeof approvalsFile === "object") {
                resolved = (0, exec_approvals_js_1.resolveExecApprovalsFromFile)({
                  file: approvalsFile,
                  agentId: agentId,
                  overrides: { security: "allowlist" },
                });
                allowlistEval = (0, exec_approvals_js_1.evaluateShellAllowlist)({
                  command: params.command,
                  allowlist: resolved.allowlist,
                  safeBins: new Set(),
                  cwd: workdir,
                  env: env,
                });
                allowlistSatisfied = allowlistEval.allowlistSatisfied;
                analysisOk = allowlistEval.analysisOk;
              }
              return [3 /*break*/, 8];
            case 7:
              _a = _v.sent();
              return [3 /*break*/, 8];
            case 8:
              requiresAsk = (0, exec_approvals_js_1.requiresExecApproval)({
                ask: hostAsk_1,
                security: hostSecurity_1,
                analysisOk: analysisOk,
                allowlistSatisfied: allowlistSatisfied,
              });
              commandText_1 = params.command;
              invokeTimeoutMs_1 = Math.max(
                10000,
                (typeof params.timeout === "number" ? params.timeout : defaultTimeoutSec) * 1000 +
                  5000,
              );
              buildInvokeParams_1 = function (approvedByAsk, approvalDecision, runId) {
                return {
                  nodeId: nodeId_1,
                  command: "system.run",
                  params: {
                    command: argv_1,
                    rawCommand: params.command,
                    cwd: workdir,
                    env: nodeEnv_1,
                    timeoutMs:
                      typeof params.timeout === "number" ? params.timeout * 1000 : undefined,
                    agentId: agentId,
                    sessionKey:
                      defaults === null || defaults === void 0 ? void 0 : defaults.sessionKey,
                    approved: approvedByAsk,
                    approvalDecision:
                      approvalDecision !== null && approvalDecision !== void 0
                        ? approvalDecision
                        : undefined,
                    runId: runId !== null && runId !== void 0 ? runId : undefined,
                  },
                  idempotencyKey: node_crypto_1.default.randomUUID(),
                };
              };
              if (requiresAsk) {
                approvalId_1 = node_crypto_1.default.randomUUID();
                approvalSlug = createApprovalSlug(approvalId_1);
                expiresAtMs = Date.now() + DEFAULT_APPROVAL_TIMEOUT_MS;
                contextKey_1 = "exec:".concat(approvalId_1);
                noticeSeconds_1 = Math.max(1, Math.round(approvalRunningNoticeMs / 1000));
                warningText = warnings.length ? "".concat(warnings.join("\n"), "\n\n") : "";
                void (function () {
                  return __awaiter(_this, void 0, void 0, function () {
                    var decision,
                      decisionResult,
                      _a,
                      approvedByAsk,
                      approvalDecision,
                      deniedReason,
                      runningTimer,
                      _b;
                    var _c;
                    return __generator(this, function (_d) {
                      switch (_d.label) {
                        case 0:
                          decision = null;
                          _d.label = 1;
                        case 1:
                          _d.trys.push([1, 3, , 4]);
                          return [
                            4 /*yield*/,
                            (0, gateway_js_1.callGatewayTool)(
                              "exec.approval.request",
                              { timeoutMs: DEFAULT_APPROVAL_REQUEST_TIMEOUT_MS },
                              {
                                id: approvalId_1,
                                command: commandText_1,
                                cwd: workdir,
                                host: "node",
                                security: hostSecurity_1,
                                ask: hostAsk_1,
                                agentId: agentId,
                                resolvedPath: undefined,
                                sessionKey:
                                  defaults === null || defaults === void 0
                                    ? void 0
                                    : defaults.sessionKey,
                                timeoutMs: DEFAULT_APPROVAL_TIMEOUT_MS,
                              },
                            ),
                          ];
                        case 2:
                          decisionResult = _d.sent();
                          decision =
                            decisionResult && typeof decisionResult === "object"
                              ? (_c = decisionResult.decision) !== null && _c !== void 0
                                ? _c
                                : null
                              : null;
                          return [3 /*break*/, 4];
                        case 3:
                          _a = _d.sent();
                          emitExecSystemEvent(
                            "Exec denied (node="
                              .concat(nodeId_1, " id=")
                              .concat(approvalId_1, ", approval-request-failed): ")
                              .concat(commandText_1),
                            { sessionKey: notifySessionKey, contextKey: contextKey_1 },
                          );
                          return [2 /*return*/];
                        case 4:
                          approvedByAsk = false;
                          approvalDecision = null;
                          deniedReason = null;
                          if (decision === "deny") {
                            deniedReason = "user-denied";
                          } else if (!decision) {
                            if (askFallback_1 === "full") {
                              approvedByAsk = true;
                              approvalDecision = "allow-once";
                            } else if (askFallback_1 === "allowlist") {
                              // Defer allowlist enforcement to the node host.
                            } else {
                              deniedReason = "approval-timeout";
                            }
                          } else if (decision === "allow-once") {
                            approvedByAsk = true;
                            approvalDecision = "allow-once";
                          } else if (decision === "allow-always") {
                            approvedByAsk = true;
                            approvalDecision = "allow-always";
                          }
                          if (deniedReason) {
                            emitExecSystemEvent(
                              "Exec denied (node="
                                .concat(nodeId_1, " id=")
                                .concat(approvalId_1, ", ")
                                .concat(deniedReason, "): ")
                                .concat(commandText_1),
                              { sessionKey: notifySessionKey, contextKey: contextKey_1 },
                            );
                            return [2 /*return*/];
                          }
                          runningTimer = null;
                          if (approvalRunningNoticeMs > 0) {
                            runningTimer = setTimeout(function () {
                              emitExecSystemEvent(
                                "Exec running (node="
                                  .concat(nodeId_1, " id=")
                                  .concat(approvalId_1, ", >")
                                  .concat(noticeSeconds_1, "s): ")
                                  .concat(commandText_1),
                                { sessionKey: notifySessionKey, contextKey: contextKey_1 },
                              );
                            }, approvalRunningNoticeMs);
                          }
                          _d.label = 5;
                        case 5:
                          _d.trys.push([5, 7, 8, 9]);
                          return [
                            4 /*yield*/,
                            (0, gateway_js_1.callGatewayTool)(
                              "node.invoke",
                              { timeoutMs: invokeTimeoutMs_1 },
                              buildInvokeParams_1(approvedByAsk, approvalDecision, approvalId_1),
                            ),
                          ];
                        case 6:
                          _d.sent();
                          return [3 /*break*/, 9];
                        case 7:
                          _b = _d.sent();
                          emitExecSystemEvent(
                            "Exec denied (node="
                              .concat(nodeId_1, " id=")
                              .concat(approvalId_1, ", invoke-failed): ")
                              .concat(commandText_1),
                            { sessionKey: notifySessionKey, contextKey: contextKey_1 },
                          );
                          return [3 /*break*/, 9];
                        case 8:
                          if (runningTimer) {
                            clearTimeout(runningTimer);
                          }
                          return [7 /*endfinally*/];
                        case 9:
                          return [2 /*return*/];
                      }
                    });
                  });
                })();
                return [
                  2 /*return*/,
                  {
                    content: [
                      {
                        type: "text",
                        text:
                          ""
                            .concat(warningText, "Approval required (id ")
                            .concat(approvalSlug, "). ") +
                          "Approve to run; updates will arrive after completion.",
                      },
                    ],
                    details: {
                      status: "approval-pending",
                      approvalId: approvalId_1,
                      approvalSlug: approvalSlug,
                      expiresAtMs: expiresAtMs,
                      host: "node",
                      command: commandText_1,
                      cwd: workdir,
                      nodeId: nodeId_1,
                    },
                  },
                ];
              }
              startedAt = Date.now();
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)(
                  "node.invoke",
                  { timeoutMs: invokeTimeoutMs_1 },
                  buildInvokeParams_1(false, null),
                ),
              ];
            case 9:
              raw = _v.sent();
              payload =
                (_p = raw === null || raw === void 0 ? void 0 : raw.payload) !== null &&
                _p !== void 0
                  ? _p
                  : {};
              return [
                2 /*return*/,
                {
                  content: [
                    {
                      type: "text",
                      text: payload.stdout || payload.stderr || payload.error || "",
                    },
                  ],
                  details: {
                    status: payload.success ? "completed" : "failed",
                    exitCode: (_q = payload.exitCode) !== null && _q !== void 0 ? _q : null,
                    durationMs: Date.now() - startedAt,
                    aggregated: [payload.stdout, payload.stderr, payload.error]
                      .filter(Boolean)
                      .join("\n"),
                    cwd: workdir,
                  },
                },
              ];
            case 10:
              if (host === "gateway" && !bypassApprovals) {
                approvals_1 = (0, exec_approvals_js_1.resolveExecApprovals)(agentId, {
                  security: security,
                  ask: ask,
                });
                hostSecurity_2 = (0, exec_approvals_js_1.minSecurity)(
                  security,
                  approvals_1.agent.security,
                );
                hostAsk_2 = (0, exec_approvals_js_1.maxAsk)(ask, approvals_1.agent.ask);
                askFallback_2 = approvals_1.agent.askFallback;
                if (hostSecurity_2 === "deny") {
                  throw new Error("exec denied: host=gateway security=deny");
                }
                allowlistEval_1 = (0, exec_approvals_js_1.evaluateShellAllowlist)({
                  command: params.command,
                  allowlist: approvals_1.allowlist,
                  safeBins: safeBins,
                  cwd: workdir,
                  env: env,
                });
                allowlistMatches_2 = allowlistEval_1.allowlistMatches;
                analysisOk_1 = allowlistEval_1.analysisOk;
                allowlistSatisfied_1 =
                  hostSecurity_2 === "allowlist" && analysisOk_1
                    ? allowlistEval_1.allowlistSatisfied
                    : false;
                requiresAsk = (0, exec_approvals_js_1.requiresExecApproval)({
                  ask: hostAsk_2,
                  security: hostSecurity_2,
                  analysisOk: analysisOk_1,
                  allowlistSatisfied: allowlistSatisfied_1,
                });
                if (requiresAsk) {
                  approvalId_2 = node_crypto_1.default.randomUUID();
                  approvalSlug = createApprovalSlug(approvalId_2);
                  expiresAtMs = Date.now() + DEFAULT_APPROVAL_TIMEOUT_MS;
                  contextKey_2 = "exec:".concat(approvalId_2);
                  resolvedPath_1 =
                    (_s =
                      (_r = allowlistEval_1.segments[0]) === null || _r === void 0
                        ? void 0
                        : _r.resolution) === null || _s === void 0
                      ? void 0
                      : _s.resolvedPath;
                  noticeSeconds_2 = Math.max(1, Math.round(approvalRunningNoticeMs / 1000));
                  commandText_2 = params.command;
                  effectiveTimeout_1 =
                    typeof params.timeout === "number" ? params.timeout : defaultTimeoutSec;
                  warningText = warnings.length ? "".concat(warnings.join("\n"), "\n\n") : "";
                  void (function () {
                    return __awaiter(_this, void 0, void 0, function () {
                      var decision,
                        decisionResult,
                        _a,
                        approvedByAsk,
                        deniedReason,
                        _i,
                        _b,
                        segment,
                        pattern,
                        seen,
                        _c,
                        allowlistMatches_3,
                        match,
                        run,
                        _d,
                        runningTimer,
                        outcome,
                        output,
                        exitLabel,
                        summary;
                      var _e, _f, _g, _h;
                      return __generator(this, function (_j) {
                        switch (_j.label) {
                          case 0:
                            decision = null;
                            _j.label = 1;
                          case 1:
                            _j.trys.push([1, 3, , 4]);
                            return [
                              4 /*yield*/,
                              (0, gateway_js_1.callGatewayTool)(
                                "exec.approval.request",
                                { timeoutMs: DEFAULT_APPROVAL_REQUEST_TIMEOUT_MS },
                                {
                                  id: approvalId_2,
                                  command: commandText_2,
                                  cwd: workdir,
                                  host: "gateway",
                                  security: hostSecurity_2,
                                  ask: hostAsk_2,
                                  agentId: agentId,
                                  resolvedPath: resolvedPath_1,
                                  sessionKey:
                                    defaults === null || defaults === void 0
                                      ? void 0
                                      : defaults.sessionKey,
                                  timeoutMs: DEFAULT_APPROVAL_TIMEOUT_MS,
                                },
                              ),
                            ];
                          case 2:
                            decisionResult = _j.sent();
                            decision =
                              decisionResult && typeof decisionResult === "object"
                                ? (_e = decisionResult.decision) !== null && _e !== void 0
                                  ? _e
                                  : null
                                : null;
                            return [3 /*break*/, 4];
                          case 3:
                            _a = _j.sent();
                            emitExecSystemEvent(
                              "Exec denied (gateway id="
                                .concat(approvalId_2, ", approval-request-failed): ")
                                .concat(commandText_2),
                              { sessionKey: notifySessionKey, contextKey: contextKey_2 },
                            );
                            return [2 /*return*/];
                          case 4:
                            approvedByAsk = false;
                            deniedReason = null;
                            if (decision === "deny") {
                              deniedReason = "user-denied";
                            } else if (!decision) {
                              if (askFallback_2 === "full") {
                                approvedByAsk = true;
                              } else if (askFallback_2 === "allowlist") {
                                if (!analysisOk_1 || !allowlistSatisfied_1) {
                                  deniedReason = "approval-timeout (allowlist-miss)";
                                } else {
                                  approvedByAsk = true;
                                }
                              } else {
                                deniedReason = "approval-timeout";
                              }
                            } else if (decision === "allow-once") {
                              approvedByAsk = true;
                            } else if (decision === "allow-always") {
                              approvedByAsk = true;
                              if (hostSecurity_2 === "allowlist") {
                                for (_i = 0, _b = allowlistEval_1.segments; _i < _b.length; _i++) {
                                  segment = _b[_i];
                                  pattern =
                                    (_g =
                                      (_f = segment.resolution) === null || _f === void 0
                                        ? void 0
                                        : _f.resolvedPath) !== null && _g !== void 0
                                      ? _g
                                      : "";
                                  if (pattern) {
                                    (0, exec_approvals_js_1.addAllowlistEntry)(
                                      approvals_1.file,
                                      agentId,
                                      pattern,
                                    );
                                  }
                                }
                              }
                            }
                            if (
                              hostSecurity_2 === "allowlist" &&
                              (!analysisOk_1 || !allowlistSatisfied_1) &&
                              !approvedByAsk
                            ) {
                              deniedReason =
                                deniedReason !== null && deniedReason !== void 0
                                  ? deniedReason
                                  : "allowlist-miss";
                            }
                            if (deniedReason) {
                              emitExecSystemEvent(
                                "Exec denied (gateway id="
                                  .concat(approvalId_2, ", ")
                                  .concat(deniedReason, "): ")
                                  .concat(commandText_2),
                                { sessionKey: notifySessionKey, contextKey: contextKey_2 },
                              );
                              return [2 /*return*/];
                            }
                            if (allowlistMatches_2.length > 0) {
                              seen = new Set();
                              for (
                                _c = 0, allowlistMatches_3 = allowlistMatches_2;
                                _c < allowlistMatches_3.length;
                                _c++
                              ) {
                                match = allowlistMatches_3[_c];
                                if (seen.has(match.pattern)) {
                                  continue;
                                }
                                seen.add(match.pattern);
                                (0, exec_approvals_js_1.recordAllowlistUse)(
                                  approvals_1.file,
                                  agentId,
                                  match,
                                  commandText_2,
                                  resolvedPath_1 !== null && resolvedPath_1 !== void 0
                                    ? resolvedPath_1
                                    : undefined,
                                );
                              }
                            }
                            run = null;
                            _j.label = 5;
                          case 5:
                            _j.trys.push([5, 7, , 8]);
                            return [
                              4 /*yield*/,
                              runExecProcess({
                                command: commandText_2,
                                workdir: workdir,
                                env: env,
                                sandbox: undefined,
                                containerWorkdir: null,
                                usePty: params.pty === true && !sandbox,
                                warnings: warnings,
                                maxOutput: maxOutput,
                                pendingMaxOutput: pendingMaxOutput,
                                notifyOnExit: false,
                                scopeKey:
                                  defaults === null || defaults === void 0
                                    ? void 0
                                    : defaults.scopeKey,
                                sessionKey: notifySessionKey,
                                timeoutSec: effectiveTimeout_1,
                              }),
                            ];
                          case 6:
                            run = _j.sent();
                            return [3 /*break*/, 8];
                          case 7:
                            _d = _j.sent();
                            emitExecSystemEvent(
                              "Exec denied (gateway id="
                                .concat(approvalId_2, ", spawn-failed): ")
                                .concat(commandText_2),
                              { sessionKey: notifySessionKey, contextKey: contextKey_2 },
                            );
                            return [2 /*return*/];
                          case 8:
                            (0, bash_process_registry_js_1.markBackgrounded)(run.session);
                            runningTimer = null;
                            if (approvalRunningNoticeMs > 0) {
                              runningTimer = setTimeout(function () {
                                emitExecSystemEvent(
                                  "Exec running (gateway id="
                                    .concat(approvalId_2, ", session=")
                                    .concat(
                                      run === null || run === void 0 ? void 0 : run.session.id,
                                      ", >",
                                    )
                                    .concat(noticeSeconds_2, "s): ")
                                    .concat(commandText_2),
                                  { sessionKey: notifySessionKey, contextKey: contextKey_2 },
                                );
                              }, approvalRunningNoticeMs);
                            }
                            return [4 /*yield*/, run.promise];
                          case 9:
                            outcome = _j.sent();
                            if (runningTimer) {
                              clearTimeout(runningTimer);
                            }
                            output = normalizeNotifyOutput(
                              (0, bash_process_registry_js_1.tail)(
                                outcome.aggregated || "",
                                DEFAULT_NOTIFY_TAIL_CHARS,
                              ),
                            );
                            exitLabel = outcome.timedOut
                              ? "timeout"
                              : "code ".concat(
                                  (_h = outcome.exitCode) !== null && _h !== void 0 ? _h : "?",
                                );
                            summary = output
                              ? "Exec finished (gateway id="
                                  .concat(approvalId_2, ", session=")
                                  .concat(run.session.id, ", ")
                                  .concat(exitLabel, ")\n")
                                  .concat(output)
                              : "Exec finished (gateway id="
                                  .concat(approvalId_2, ", session=")
                                  .concat(run.session.id, ", ")
                                  .concat(exitLabel, ")");
                            emitExecSystemEvent(summary, {
                              sessionKey: notifySessionKey,
                              contextKey: contextKey_2,
                            });
                            return [2 /*return*/];
                        }
                      });
                    });
                  })();
                  return [
                    2 /*return*/,
                    {
                      content: [
                        {
                          type: "text",
                          text:
                            "".concat(warningText) +
                            "Approval required (id ".concat(approvalSlug, "). ") +
                            "Approve to run; updates will arrive after completion.",
                        },
                      ],
                      details: {
                        status: "approval-pending",
                        approvalId: approvalId_2,
                        approvalSlug: approvalSlug,
                        expiresAtMs: expiresAtMs,
                        host: "gateway",
                        command: params.command,
                        cwd: workdir,
                      },
                    },
                  ];
                }
                if (hostSecurity_2 === "allowlist" && (!analysisOk_1 || !allowlistSatisfied_1)) {
                  throw new Error("exec denied: allowlist miss");
                }
                if (allowlistMatches_2.length > 0) {
                  seen = new Set();
                  for (
                    _i = 0, allowlistMatches_1 = allowlistMatches_2;
                    _i < allowlistMatches_1.length;
                    _i++
                  ) {
                    match = allowlistMatches_1[_i];
                    if (seen.has(match.pattern)) {
                      continue;
                    }
                    seen.add(match.pattern);
                    (0, exec_approvals_js_1.recordAllowlistUse)(
                      approvals_1.file,
                      agentId,
                      match,
                      params.command,
                      (_u =
                        (_t = allowlistEval_1.segments[0]) === null || _t === void 0
                          ? void 0
                          : _t.resolution) === null || _u === void 0
                        ? void 0
                        : _u.resolvedPath,
                    );
                  }
                }
              }
              effectiveTimeout =
                typeof params.timeout === "number" ? params.timeout : defaultTimeoutSec;
              getWarningText = function () {
                return warnings.length ? "".concat(warnings.join("\n"), "\n\n") : "";
              };
              usePty = params.pty === true && !sandbox;
              return [
                4 /*yield*/,
                runExecProcess({
                  command: params.command,
                  workdir: workdir,
                  env: env,
                  sandbox: sandbox,
                  containerWorkdir: containerWorkdir,
                  usePty: usePty,
                  warnings: warnings,
                  maxOutput: maxOutput,
                  pendingMaxOutput: pendingMaxOutput,
                  notifyOnExit: notifyOnExit,
                  scopeKey: defaults === null || defaults === void 0 ? void 0 : defaults.scopeKey,
                  sessionKey: notifySessionKey,
                  timeoutSec: effectiveTimeout,
                  onUpdate: onUpdate,
                }),
              ];
            case 11:
              run = _v.sent();
              yielded = false;
              yieldTimer = null;
              onAbortSignal = function () {
                if (yielded || run.session.backgrounded) {
                  return;
                }
                run.kill();
              };
              if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
                onAbortSignal();
              } else if (signal) {
                signal.addEventListener("abort", onAbortSignal, { once: true });
              }
              return [
                2 /*return*/,
                new Promise(function (resolve, reject) {
                  var resolveRunning = function () {
                    var _a, _b;
                    return resolve({
                      content: [
                        {
                          type: "text",
                          text:
                            "".concat(getWarningText()) +
                            "Command still running (session "
                              .concat(run.session.id, ", pid ")
                              .concat(
                                (_a = run.session.pid) !== null && _a !== void 0 ? _a : "n/a",
                                "). ",
                              ) +
                            "Use process (list/poll/log/write/kill/clear/remove) for follow-up.",
                        },
                      ],
                      details: {
                        status: "running",
                        sessionId: run.session.id,
                        pid: (_b = run.session.pid) !== null && _b !== void 0 ? _b : undefined,
                        startedAt: run.startedAt,
                        cwd: run.session.cwd,
                        tail: run.session.tail,
                      },
                    });
                  };
                  var onYieldNow = function () {
                    if (yieldTimer) {
                      clearTimeout(yieldTimer);
                    }
                    if (yielded) {
                      return;
                    }
                    yielded = true;
                    (0, bash_process_registry_js_1.markBackgrounded)(run.session);
                    resolveRunning();
                  };
                  if (allowBackground && yieldWindow !== null) {
                    if (yieldWindow === 0) {
                      onYieldNow();
                    } else {
                      yieldTimer = setTimeout(function () {
                        if (yielded) {
                          return;
                        }
                        yielded = true;
                        (0, bash_process_registry_js_1.markBackgrounded)(run.session);
                        resolveRunning();
                      }, yieldWindow);
                    }
                  }
                  run.promise
                    .then(function (outcome) {
                      var _a, _b;
                      if (yieldTimer) {
                        clearTimeout(yieldTimer);
                      }
                      if (yielded || run.session.backgrounded) {
                        return;
                      }
                      if (outcome.status === "failed") {
                        reject(
                          new Error(
                            (_a = outcome.reason) !== null && _a !== void 0
                              ? _a
                              : "Command failed.",
                          ),
                        );
                        return;
                      }
                      resolve({
                        content: [
                          {
                            type: "text",
                            text: ""
                              .concat(getWarningText())
                              .concat(outcome.aggregated || "(no output)"),
                          },
                        ],
                        details: {
                          status: "completed",
                          exitCode: (_b = outcome.exitCode) !== null && _b !== void 0 ? _b : 0,
                          durationMs: outcome.durationMs,
                          aggregated: outcome.aggregated,
                          cwd: run.session.cwd,
                        },
                      });
                    })
                    .catch(function (err) {
                      if (yieldTimer) {
                        clearTimeout(yieldTimer);
                      }
                      if (yielded || run.session.backgrounded) {
                        return;
                      }
                      reject(err);
                    });
                }),
              ];
          }
        });
      });
    },
  };
}
exports.execTool = createExecTool();
