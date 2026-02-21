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
exports.handleAbortTrigger =
  exports.handleStopCommand =
  exports.handleRestartCommand =
  exports.handleUsageCommand =
  exports.handleSendPolicyCommand =
  exports.handleActivationCommand =
    void 0;
var pi_embedded_js_1 = require("../../agents/pi-embedded.js");
var sessions_js_1 = require("../../config/sessions.js");
var globals_js_1 = require("../../globals.js");
var internal_hooks_js_1 = require("../../hooks/internal-hooks.js");
var restart_js_1 = require("../../infra/restart.js");
var group_activation_js_1 = require("../group-activation.js");
var send_policy_js_1 = require("../send-policy.js");
var thinking_js_1 = require("../thinking.js");
var session_cost_usage_js_1 = require("../../infra/session-cost-usage.js");
var usage_format_js_1 = require("../../utils/usage-format.js");
var abort_js_1 = require("./abort.js");
var queue_js_1 = require("./queue.js");
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
function resolveAbortTarget(params) {
  var _a;
  var targetSessionKey =
    ((_a = params.ctx.CommandTargetSessionKey) === null || _a === void 0 ? void 0 : _a.trim()) ||
    params.sessionKey;
  var _b = resolveSessionEntryForKey(params.sessionStore, targetSessionKey),
    entry = _b.entry,
    key = _b.key;
  if (entry && key) {
    return { entry: entry, key: key, sessionId: entry.sessionId };
  }
  if (params.sessionEntry && params.sessionKey) {
    return {
      entry: params.sessionEntry,
      key: params.sessionKey,
      sessionId: params.sessionEntry.sessionId,
    };
  }
  return { entry: undefined, key: targetSessionKey, sessionId: undefined };
}
var handleActivationCommand = function (params, allowTextCommands) {
  return __awaiter(void 0, void 0, void 0, function () {
    var activationCommand;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!allowTextCommands) {
            return [2 /*return*/, null];
          }
          activationCommand = (0, group_activation_js_1.parseActivationCommand)(
            params.command.commandBodyNormalized,
          );
          if (!activationCommand.hasCommand) {
            return [2 /*return*/, null];
          }
          if (!params.isGroup) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: { text: "⚙️ Group activation only applies to group chats." },
              },
            ];
          }
          if (!params.command.isAuthorizedSender) {
            (0, globals_js_1.logVerbose)(
              "Ignoring /activation from unauthorized sender in group: ".concat(
                params.command.senderId || "<unknown>",
              ),
            );
            return [2 /*return*/, { shouldContinue: false }];
          }
          if (!activationCommand.mode) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: { text: "⚙️ Usage: /activation mention|always" },
              },
            ];
          }
          if (!(params.sessionEntry && params.sessionStore && params.sessionKey)) {
            return [3 /*break*/, 2];
          }
          params.sessionEntry.groupActivation = activationCommand.mode;
          params.sessionEntry.groupActivationNeedsSystemIntro = true;
          params.sessionEntry.updatedAt = Date.now();
          params.sessionStore[params.sessionKey] = params.sessionEntry;
          if (!params.storePath) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(params.storePath, function (store) {
              store[params.sessionKey] = params.sessionEntry;
            }),
          ];
        case 1:
          _a.sent();
          _a.label = 2;
        case 2:
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: {
                text: "\u2699\uFE0F Group activation set to ".concat(activationCommand.mode, "."),
              },
            },
          ];
      }
    });
  });
};
exports.handleActivationCommand = handleActivationCommand;
var handleSendPolicyCommand = function (params, allowTextCommands) {
  return __awaiter(void 0, void 0, void 0, function () {
    var sendPolicyCommand, label;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!allowTextCommands) {
            return [2 /*return*/, null];
          }
          sendPolicyCommand = (0, send_policy_js_1.parseSendPolicyCommand)(
            params.command.commandBodyNormalized,
          );
          if (!sendPolicyCommand.hasCommand) {
            return [2 /*return*/, null];
          }
          if (!params.command.isAuthorizedSender) {
            (0, globals_js_1.logVerbose)(
              "Ignoring /send from unauthorized sender: ".concat(
                params.command.senderId || "<unknown>",
              ),
            );
            return [2 /*return*/, { shouldContinue: false }];
          }
          if (!sendPolicyCommand.mode) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: { text: "⚙️ Usage: /send on|off|inherit" },
              },
            ];
          }
          if (!(params.sessionEntry && params.sessionStore && params.sessionKey)) {
            return [3 /*break*/, 2];
          }
          if (sendPolicyCommand.mode === "inherit") {
            delete params.sessionEntry.sendPolicy;
          } else {
            params.sessionEntry.sendPolicy = sendPolicyCommand.mode;
          }
          params.sessionEntry.updatedAt = Date.now();
          params.sessionStore[params.sessionKey] = params.sessionEntry;
          if (!params.storePath) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(params.storePath, function (store) {
              store[params.sessionKey] = params.sessionEntry;
            }),
          ];
        case 1:
          _a.sent();
          _a.label = 2;
        case 2:
          label =
            sendPolicyCommand.mode === "inherit"
              ? "inherit"
              : sendPolicyCommand.mode === "allow"
                ? "on"
                : "off";
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: { text: "\u2699\uFE0F Send policy set to ".concat(label, ".") },
            },
          ];
      }
    });
  });
};
exports.handleSendPolicyCommand = handleSendPolicyCommand;
var handleUsageCommand = function (params, allowTextCommands) {
  return __awaiter(void 0, void 0, void 0, function () {
    var normalized,
      rawArgs,
      requested,
      sessionSummary,
      summary,
      sessionCost,
      sessionTokens,
      sessionMissing,
      sessionSuffix,
      sessionLine,
      todayKey_1,
      todayEntry,
      todayCost,
      todayMissing,
      todaySuffix,
      todayLine,
      last30Cost,
      last30Missing,
      last30Suffix,
      last30Line,
      currentRaw,
      current,
      next;
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
      switch (_j.label) {
        case 0:
          if (!allowTextCommands) {
            return [2 /*return*/, null];
          }
          normalized = params.command.commandBodyNormalized;
          if (normalized !== "/usage" && !normalized.startsWith("/usage ")) {
            return [2 /*return*/, null];
          }
          if (!params.command.isAuthorizedSender) {
            (0, globals_js_1.logVerbose)(
              "Ignoring /usage from unauthorized sender: ".concat(
                params.command.senderId || "<unknown>",
              ),
            );
            return [2 /*return*/, { shouldContinue: false }];
          }
          rawArgs = normalized === "/usage" ? "" : normalized.slice("/usage".length).trim();
          requested = rawArgs ? (0, thinking_js_1.normalizeUsageDisplay)(rawArgs) : undefined;
          if (!rawArgs.toLowerCase().startsWith("cost")) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            (0, session_cost_usage_js_1.loadSessionCostSummary)({
              sessionId:
                (_a = params.sessionEntry) === null || _a === void 0 ? void 0 : _a.sessionId,
              sessionEntry: params.sessionEntry,
              sessionFile:
                (_b = params.sessionEntry) === null || _b === void 0 ? void 0 : _b.sessionFile,
              config: params.cfg,
            }),
          ];
        case 1:
          sessionSummary = _j.sent();
          return [
            4 /*yield*/,
            (0, session_cost_usage_js_1.loadCostUsageSummary)({ days: 30, config: params.cfg }),
          ];
        case 2:
          summary = _j.sent();
          sessionCost = (0, usage_format_js_1.formatUsd)(
            sessionSummary === null || sessionSummary === void 0
              ? void 0
              : sessionSummary.totalCost,
          );
          sessionTokens = (
            sessionSummary === null || sessionSummary === void 0
              ? void 0
              : sessionSummary.totalTokens
          )
            ? (0, usage_format_js_1.formatTokenCount)(sessionSummary.totalTokens)
            : undefined;
          sessionMissing =
            (_c =
              sessionSummary === null || sessionSummary === void 0
                ? void 0
                : sessionSummary.missingCostEntries) !== null && _c !== void 0
              ? _c
              : 0;
          sessionSuffix = sessionMissing > 0 ? " (partial)" : "";
          sessionLine =
            sessionCost || sessionTokens
              ? "Session "
                  .concat(sessionCost !== null && sessionCost !== void 0 ? sessionCost : "n/a")
                  .concat(sessionSuffix)
                  .concat(sessionTokens ? " \u00B7 ".concat(sessionTokens, " tokens") : "")
              : "Session n/a";
          todayKey_1 = new Date().toLocaleDateString("en-CA");
          todayEntry = summary.daily.find(function (entry) {
            return entry.date === todayKey_1;
          });
          todayCost = (0, usage_format_js_1.formatUsd)(
            todayEntry === null || todayEntry === void 0 ? void 0 : todayEntry.totalCost,
          );
          todayMissing =
            (_d =
              todayEntry === null || todayEntry === void 0
                ? void 0
                : todayEntry.missingCostEntries) !== null && _d !== void 0
              ? _d
              : 0;
          todaySuffix = todayMissing > 0 ? " (partial)" : "";
          todayLine = "Today "
            .concat(todayCost !== null && todayCost !== void 0 ? todayCost : "n/a")
            .concat(todaySuffix);
          last30Cost = (0, usage_format_js_1.formatUsd)(summary.totals.totalCost);
          last30Missing = summary.totals.missingCostEntries;
          last30Suffix = last30Missing > 0 ? " (partial)" : "";
          last30Line = "Last 30d "
            .concat(last30Cost !== null && last30Cost !== void 0 ? last30Cost : "n/a")
            .concat(last30Suffix);
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: {
                text: "\uD83D\uDCB8 Usage cost\n"
                  .concat(sessionLine, "\n")
                  .concat(todayLine, "\n")
                  .concat(last30Line),
              },
            },
          ];
        case 3:
          if (rawArgs && !requested) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: { text: "⚙️ Usage: /usage off|tokens|full|cost" },
              },
            ];
          }
          currentRaw =
            (_f =
              (_e = params.sessionEntry) === null || _e === void 0 ? void 0 : _e.responseUsage) !==
              null && _f !== void 0
              ? _f
              : params.sessionKey
                ? (_h =
                    (_g = params.sessionStore) === null || _g === void 0
                      ? void 0
                      : _g[params.sessionKey]) === null || _h === void 0
                  ? void 0
                  : _h.responseUsage
                : undefined;
          current = (0, thinking_js_1.resolveResponseUsageMode)(currentRaw);
          next =
            requested !== null && requested !== void 0
              ? requested
              : current === "off"
                ? "tokens"
                : current === "tokens"
                  ? "full"
                  : "off";
          if (!(params.sessionEntry && params.sessionStore && params.sessionKey)) {
            return [3 /*break*/, 5];
          }
          if (next === "off") {
            delete params.sessionEntry.responseUsage;
          } else {
            params.sessionEntry.responseUsage = next;
          }
          params.sessionEntry.updatedAt = Date.now();
          params.sessionStore[params.sessionKey] = params.sessionEntry;
          if (!params.storePath) {
            return [3 /*break*/, 5];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(params.storePath, function (store) {
              store[params.sessionKey] = params.sessionEntry;
            }),
          ];
        case 4:
          _j.sent();
          _j.label = 5;
        case 5:
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: {
                text: "\u2699\uFE0F Usage footer: ".concat(next, "."),
              },
            },
          ];
      }
    });
  });
};
exports.handleUsageCommand = handleUsageCommand;
var handleRestartCommand = function (params, allowTextCommands) {
  return __awaiter(void 0, void 0, void 0, function () {
    var hasSigusr1Listener, restartMethod, detail;
    var _a;
    return __generator(this, function (_b) {
      if (!allowTextCommands) {
        return [2 /*return*/, null];
      }
      if (params.command.commandBodyNormalized !== "/restart") {
        return [2 /*return*/, null];
      }
      if (!params.command.isAuthorizedSender) {
        (0, globals_js_1.logVerbose)(
          "Ignoring /restart from unauthorized sender: ".concat(
            params.command.senderId || "<unknown>",
          ),
        );
        return [2 /*return*/, { shouldContinue: false }];
      }
      if (((_a = params.cfg.commands) === null || _a === void 0 ? void 0 : _a.restart) !== true) {
        return [
          2 /*return*/,
          {
            shouldContinue: false,
            reply: {
              text: "⚠️ /restart is disabled. Set commands.restart=true to enable.",
            },
          },
        ];
      }
      hasSigusr1Listener = process.listenerCount("SIGUSR1") > 0;
      if (hasSigusr1Listener) {
        (0, restart_js_1.scheduleGatewaySigusr1Restart)({ reason: "/restart" });
        return [
          2 /*return*/,
          {
            shouldContinue: false,
            reply: {
              text: "⚙️ Restarting OpenClaw in-process (SIGUSR1); back in a few seconds.",
            },
          },
        ];
      }
      restartMethod = (0, restart_js_1.triggerOpenClawRestart)();
      if (!restartMethod.ok) {
        detail = restartMethod.detail ? " Details: ".concat(restartMethod.detail) : "";
        return [
          2 /*return*/,
          {
            shouldContinue: false,
            reply: {
              text: "\u26A0\uFE0F Restart failed ("
                .concat(restartMethod.method, ").")
                .concat(detail),
            },
          },
        ];
      }
      return [
        2 /*return*/,
        {
          shouldContinue: false,
          reply: {
            text: "\u2699\uFE0F Restarting OpenClaw via ".concat(
              restartMethod.method,
              "; give me a few seconds to come back online.",
            ),
          },
        },
      ];
    });
  });
};
exports.handleRestartCommand = handleRestartCommand;
var handleStopCommand = function (params, allowTextCommands) {
  return __awaiter(void 0, void 0, void 0, function () {
    var abortTarget, cleared, hookEvent, stopped;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          if (!allowTextCommands) {
            return [2 /*return*/, null];
          }
          if (params.command.commandBodyNormalized !== "/stop") {
            return [2 /*return*/, null];
          }
          if (!params.command.isAuthorizedSender) {
            (0, globals_js_1.logVerbose)(
              "Ignoring /stop from unauthorized sender: ".concat(
                params.command.senderId || "<unknown>",
              ),
            );
            return [2 /*return*/, { shouldContinue: false }];
          }
          abortTarget = resolveAbortTarget({
            ctx: params.ctx,
            sessionKey: params.sessionKey,
            sessionEntry: params.sessionEntry,
            sessionStore: params.sessionStore,
          });
          if (abortTarget.sessionId) {
            (0, pi_embedded_js_1.abortEmbeddedPiRun)(abortTarget.sessionId);
          }
          cleared = (0, queue_js_1.clearSessionQueues)([abortTarget.key, abortTarget.sessionId]);
          if (cleared.followupCleared > 0 || cleared.laneCleared > 0) {
            (0, globals_js_1.logVerbose)(
              "stop: cleared followups="
                .concat(cleared.followupCleared, " lane=")
                .concat(cleared.laneCleared, " keys=")
                .concat(cleared.keys.join(",")),
            );
          }
          if (!(abortTarget.entry && params.sessionStore && abortTarget.key)) {
            return [3 /*break*/, 3];
          }
          abortTarget.entry.abortedLastRun = true;
          abortTarget.entry.updatedAt = Date.now();
          params.sessionStore[abortTarget.key] = abortTarget.entry;
          if (!params.storePath) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(params.storePath, function (store) {
              store[abortTarget.key] = abortTarget.entry;
            }),
          ];
        case 1:
          _e.sent();
          _e.label = 2;
        case 2:
          return [3 /*break*/, 4];
        case 3:
          if (params.command.abortKey) {
            (0, abort_js_1.setAbortMemory)(params.command.abortKey, true);
          }
          _e.label = 4;
        case 4:
          hookEvent = (0, internal_hooks_js_1.createInternalHookEvent)(
            "command",
            "stop",
            (_b = (_a = abortTarget.key) !== null && _a !== void 0 ? _a : params.sessionKey) !==
              null && _b !== void 0
              ? _b
              : "",
            {
              sessionEntry:
                (_c = abortTarget.entry) !== null && _c !== void 0 ? _c : params.sessionEntry,
              sessionId: abortTarget.sessionId,
              commandSource: params.command.surface,
              senderId: params.command.senderId,
            },
          );
          return [4 /*yield*/, (0, internal_hooks_js_1.triggerInternalHook)(hookEvent)];
        case 5:
          _e.sent();
          stopped = (0, abort_js_1.stopSubagentsForRequester)({
            cfg: params.cfg,
            requesterSessionKey:
              (_d = abortTarget.key) !== null && _d !== void 0 ? _d : params.sessionKey,
          }).stopped;
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: { text: (0, abort_js_1.formatAbortReplyText)(stopped) },
            },
          ];
      }
    });
  });
};
exports.handleStopCommand = handleStopCommand;
var handleAbortTrigger = function (params, allowTextCommands) {
  return __awaiter(void 0, void 0, void 0, function () {
    var abortTarget;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!allowTextCommands) {
            return [2 /*return*/, null];
          }
          if (!(0, abort_js_1.isAbortTrigger)(params.command.rawBodyNormalized)) {
            return [2 /*return*/, null];
          }
          abortTarget = resolveAbortTarget({
            ctx: params.ctx,
            sessionKey: params.sessionKey,
            sessionEntry: params.sessionEntry,
            sessionStore: params.sessionStore,
          });
          if (abortTarget.sessionId) {
            (0, pi_embedded_js_1.abortEmbeddedPiRun)(abortTarget.sessionId);
          }
          if (!(abortTarget.entry && params.sessionStore && abortTarget.key)) {
            return [3 /*break*/, 3];
          }
          abortTarget.entry.abortedLastRun = true;
          abortTarget.entry.updatedAt = Date.now();
          params.sessionStore[abortTarget.key] = abortTarget.entry;
          if (!params.storePath) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(params.storePath, function (store) {
              store[abortTarget.key] = abortTarget.entry;
            }),
          ];
        case 1:
          _a.sent();
          _a.label = 2;
        case 2:
          return [3 /*break*/, 4];
        case 3:
          if (params.command.abortKey) {
            (0, abort_js_1.setAbortMemory)(params.command.abortKey, true);
          }
          _a.label = 4;
        case 4:
          return [
            2 /*return*/,
            { shouldContinue: false, reply: { text: "⚙️ Agent was aborted." } },
          ];
      }
    });
  });
};
exports.handleAbortTrigger = handleAbortTrigger;
