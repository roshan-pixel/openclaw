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
exports.handleDirectiveOnly = handleDirectiveOnly;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var sandbox_js_1 = require("../../agents/sandbox.js");
var sessions_js_1 = require("../../config/sessions.js");
var system_events_js_1 = require("../../infra/system-events.js");
var level_overrides_js_1 = require("../../sessions/level-overrides.js");
var model_overrides_js_1 = require("../../sessions/model-overrides.js");
var thinking_js_1 = require("../thinking.js");
var directive_handling_model_js_1 = require("./directive-handling.model.js");
var directive_handling_queue_validation_js_1 = require("./directive-handling.queue-validation.js");
var directive_handling_shared_js_1 = require("./directive-handling.shared.js");
function resolveExecDefaults(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
  var globalExec = (_a = params.cfg.tools) === null || _a === void 0 ? void 0 : _a.exec;
  var agentExec = params.agentId
    ? (_c =
        (_b = (0, agent_scope_js_1.resolveAgentConfig)(params.cfg, params.agentId)) === null ||
        _b === void 0
          ? void 0
          : _b.tools) === null || _c === void 0
      ? void 0
      : _c.exec
    : undefined;
  return {
    host:
      (_g =
        (_f =
          (_e = (_d = params.sessionEntry) === null || _d === void 0 ? void 0 : _d.execHost) !==
            null && _e !== void 0
            ? _e
            : agentExec === null || agentExec === void 0
              ? void 0
              : agentExec.host) !== null && _f !== void 0
          ? _f
          : globalExec === null || globalExec === void 0
            ? void 0
            : globalExec.host) !== null && _g !== void 0
        ? _g
        : "sandbox",
    security:
      (_l =
        (_k =
          (_j = (_h = params.sessionEntry) === null || _h === void 0 ? void 0 : _h.execSecurity) !==
            null && _j !== void 0
            ? _j
            : agentExec === null || agentExec === void 0
              ? void 0
              : agentExec.security) !== null && _k !== void 0
          ? _k
          : globalExec === null || globalExec === void 0
            ? void 0
            : globalExec.security) !== null && _l !== void 0
        ? _l
        : "deny",
    ask:
      (_q =
        (_p =
          (_o = (_m = params.sessionEntry) === null || _m === void 0 ? void 0 : _m.execAsk) !==
            null && _o !== void 0
            ? _o
            : agentExec === null || agentExec === void 0
              ? void 0
              : agentExec.ask) !== null && _p !== void 0
          ? _p
          : globalExec === null || globalExec === void 0
            ? void 0
            : globalExec.ask) !== null && _q !== void 0
        ? _q
        : "on-miss",
    node:
      (_t =
        (_s = (_r = params.sessionEntry) === null || _r === void 0 ? void 0 : _r.execNode) !==
          null && _s !== void 0
          ? _s
          : agentExec === null || agentExec === void 0
            ? void 0
            : agentExec.node) !== null && _t !== void 0
        ? _t
        : globalExec === null || globalExec === void 0
          ? void 0
          : globalExec.node,
  };
}
function handleDirectiveOnly(params) {
  return __awaiter(this, void 0, void 0, function () {
    var directives,
      sessionEntry,
      sessionStore,
      sessionKey,
      storePath,
      elevatedEnabled,
      elevatedAllowed,
      defaultProvider,
      defaultModel,
      aliasIndex,
      allowedModelKeys,
      allowedModelCatalog,
      resetModelOverride,
      provider,
      model,
      initialModelLabel,
      formatModelSwitchEvent,
      currentThinkLevel,
      currentVerboseLevel,
      currentReasoningLevel,
      currentElevatedLevel,
      activeAgentId,
      agentDir,
      runtimeIsSandboxed,
      shouldHintDirectRuntime,
      modelInfo,
      modelResolution,
      modelSelection,
      profileOverride,
      resolvedProvider,
      resolvedModel,
      level,
      level,
      level,
      level,
      execDefaults,
      nodeLabel,
      queueAck,
      nextThinkLevel,
      shouldDowngradeXHigh,
      prevElevatedLevel,
      prevReasoningLevel,
      elevatedChanged,
      reasoningChanged,
      nextLabel,
      nextElevated,
      nextReasoning,
      parts,
      execParts,
      label,
      labelWithAlias,
      ack;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
      switch (_l.label) {
        case 0:
          ((directives = params.directives),
            (sessionEntry = params.sessionEntry),
            (sessionStore = params.sessionStore),
            (sessionKey = params.sessionKey),
            (storePath = params.storePath),
            (elevatedEnabled = params.elevatedEnabled),
            (elevatedAllowed = params.elevatedAllowed),
            (defaultProvider = params.defaultProvider),
            (defaultModel = params.defaultModel),
            (aliasIndex = params.aliasIndex),
            (allowedModelKeys = params.allowedModelKeys),
            (allowedModelCatalog = params.allowedModelCatalog),
            (resetModelOverride = params.resetModelOverride),
            (provider = params.provider),
            (model = params.model),
            (initialModelLabel = params.initialModelLabel),
            (formatModelSwitchEvent = params.formatModelSwitchEvent),
            (currentThinkLevel = params.currentThinkLevel),
            (currentVerboseLevel = params.currentVerboseLevel),
            (currentReasoningLevel = params.currentReasoningLevel),
            (currentElevatedLevel = params.currentElevatedLevel));
          activeAgentId = (0, agent_scope_js_1.resolveSessionAgentId)({
            sessionKey: params.sessionKey,
            config: params.cfg,
          });
          agentDir = (0, agent_scope_js_1.resolveAgentDir)(params.cfg, activeAgentId);
          runtimeIsSandboxed = (0, sandbox_js_1.resolveSandboxRuntimeStatus)({
            cfg: params.cfg,
            sessionKey: params.sessionKey,
          }).sandboxed;
          shouldHintDirectRuntime = directives.hasElevatedDirective && !runtimeIsSandboxed;
          return [
            4 /*yield*/,
            (0, directive_handling_model_js_1.maybeHandleModelDirectiveInfo)({
              directives: directives,
              cfg: params.cfg,
              agentDir: agentDir,
              activeAgentId: activeAgentId,
              provider: provider,
              model: model,
              defaultProvider: defaultProvider,
              defaultModel: defaultModel,
              aliasIndex: aliasIndex,
              allowedModelCatalog: allowedModelCatalog,
              resetModelOverride: resetModelOverride,
            }),
          ];
        case 1:
          modelInfo = _l.sent();
          if (modelInfo) {
            return [2 /*return*/, modelInfo];
          }
          modelResolution = (0, directive_handling_model_js_1.resolveModelSelectionFromDirective)({
            directives: directives,
            cfg: params.cfg,
            agentDir: agentDir,
            defaultProvider: defaultProvider,
            defaultModel: defaultModel,
            aliasIndex: aliasIndex,
            allowedModelKeys: allowedModelKeys,
            allowedModelCatalog: allowedModelCatalog,
            provider: provider,
          });
          if (modelResolution.errorText) {
            return [2 /*return*/, { text: modelResolution.errorText }];
          }
          modelSelection = modelResolution.modelSelection;
          profileOverride = modelResolution.profileOverride;
          resolvedProvider =
            (_a =
              modelSelection === null || modelSelection === void 0
                ? void 0
                : modelSelection.provider) !== null && _a !== void 0
              ? _a
              : provider;
          resolvedModel =
            (_b =
              modelSelection === null || modelSelection === void 0
                ? void 0
                : modelSelection.model) !== null && _b !== void 0
              ? _b
              : model;
          if (directives.hasThinkDirective && !directives.thinkLevel) {
            // If no argument was provided, show the current level
            if (!directives.rawThinkLevel) {
              level =
                currentThinkLevel !== null && currentThinkLevel !== void 0
                  ? currentThinkLevel
                  : "off";
              return [
                2 /*return*/,
                {
                  text: (0, directive_handling_shared_js_1.withOptions)(
                    "Current thinking level: ".concat(level, "."),
                    (0, thinking_js_1.formatThinkingLevels)(resolvedProvider, resolvedModel),
                  ),
                },
              ];
            }
            return [
              2 /*return*/,
              {
                text: 'Unrecognized thinking level "'
                  .concat(directives.rawThinkLevel, '". Valid levels: ')
                  .concat(
                    (0, thinking_js_1.formatThinkingLevels)(resolvedProvider, resolvedModel),
                    ".",
                  ),
              },
            ];
          }
          if (directives.hasVerboseDirective && !directives.verboseLevel) {
            if (!directives.rawVerboseLevel) {
              level =
                currentVerboseLevel !== null && currentVerboseLevel !== void 0
                  ? currentVerboseLevel
                  : "off";
              return [
                2 /*return*/,
                {
                  text: (0, directive_handling_shared_js_1.withOptions)(
                    "Current verbose level: ".concat(level, "."),
                    "on, full, off",
                  ),
                },
              ];
            }
            return [
              2 /*return*/,
              {
                text: 'Unrecognized verbose level "'.concat(
                  directives.rawVerboseLevel,
                  '". Valid levels: off, on, full.',
                ),
              },
            ];
          }
          if (directives.hasReasoningDirective && !directives.reasoningLevel) {
            if (!directives.rawReasoningLevel) {
              level =
                currentReasoningLevel !== null && currentReasoningLevel !== void 0
                  ? currentReasoningLevel
                  : "off";
              return [
                2 /*return*/,
                {
                  text: (0, directive_handling_shared_js_1.withOptions)(
                    "Current reasoning level: ".concat(level, "."),
                    "on, off, stream",
                  ),
                },
              ];
            }
            return [
              2 /*return*/,
              {
                text: 'Unrecognized reasoning level "'.concat(
                  directives.rawReasoningLevel,
                  '". Valid levels: on, off, stream.',
                ),
              },
            ];
          }
          if (directives.hasElevatedDirective && !directives.elevatedLevel) {
            if (!directives.rawElevatedLevel) {
              if (!elevatedEnabled || !elevatedAllowed) {
                return [
                  2 /*return*/,
                  {
                    text: (0, directive_handling_shared_js_1.formatElevatedUnavailableText)({
                      runtimeSandboxed: runtimeIsSandboxed,
                      failures: params.elevatedFailures,
                      sessionKey: params.sessionKey,
                    }),
                  },
                ];
              }
              level =
                currentElevatedLevel !== null && currentElevatedLevel !== void 0
                  ? currentElevatedLevel
                  : "off";
              return [
                2 /*return*/,
                {
                  text: [
                    (0, directive_handling_shared_js_1.withOptions)(
                      "Current elevated level: ".concat(level, "."),
                      "on, off, ask, full",
                    ),
                    shouldHintDirectRuntime
                      ? (0, directive_handling_shared_js_1.formatElevatedRuntimeHint)()
                      : null,
                  ]
                    .filter(Boolean)
                    .join("\n"),
                },
              ];
            }
            return [
              2 /*return*/,
              {
                text: 'Unrecognized elevated level "'.concat(
                  directives.rawElevatedLevel,
                  '". Valid levels: off, on, ask, full.',
                ),
              },
            ];
          }
          if (directives.hasElevatedDirective && (!elevatedEnabled || !elevatedAllowed)) {
            return [
              2 /*return*/,
              {
                text: (0, directive_handling_shared_js_1.formatElevatedUnavailableText)({
                  runtimeSandboxed: runtimeIsSandboxed,
                  failures: params.elevatedFailures,
                  sessionKey: params.sessionKey,
                }),
              },
            ];
          }
          if (directives.hasExecDirective) {
            if (directives.invalidExecHost) {
              return [
                2 /*return*/,
                {
                  text: 'Unrecognized exec host "'.concat(
                    (_c = directives.rawExecHost) !== null && _c !== void 0 ? _c : "",
                    '". Valid hosts: sandbox, gateway, node.',
                  ),
                },
              ];
            }
            if (directives.invalidExecSecurity) {
              return [
                2 /*return*/,
                {
                  text: 'Unrecognized exec security "'.concat(
                    (_d = directives.rawExecSecurity) !== null && _d !== void 0 ? _d : "",
                    '". Valid: deny, allowlist, full.',
                  ),
                },
              ];
            }
            if (directives.invalidExecAsk) {
              return [
                2 /*return*/,
                {
                  text: 'Unrecognized exec ask "'.concat(
                    (_e = directives.rawExecAsk) !== null && _e !== void 0 ? _e : "",
                    '". Valid: off, on-miss, always.',
                  ),
                },
              ];
            }
            if (directives.invalidExecNode) {
              return [
                2 /*return*/,
                {
                  text: "Exec node requires a value.",
                },
              ];
            }
            if (!directives.hasExecOptions) {
              execDefaults = resolveExecDefaults({
                cfg: params.cfg,
                sessionEntry: sessionEntry,
                agentId: activeAgentId,
              });
              nodeLabel = execDefaults.node ? "node=".concat(execDefaults.node) : "node=(unset)";
              return [
                2 /*return*/,
                {
                  text: (0, directive_handling_shared_js_1.withOptions)(
                    "Current exec defaults: host="
                      .concat(execDefaults.host, ", security=")
                      .concat(execDefaults.security, ", ask=")
                      .concat(execDefaults.ask, ", ")
                      .concat(nodeLabel, "."),
                    "host=sandbox|gateway|node, security=deny|allowlist|full, ask=off|on-miss|always, node=<id>",
                  ),
                },
              ];
            }
          }
          queueAck = (0, directive_handling_queue_validation_js_1.maybeHandleQueueDirective)({
            directives: directives,
            cfg: params.cfg,
            channel: provider,
            sessionEntry: sessionEntry,
          });
          if (queueAck) {
            return [2 /*return*/, queueAck];
          }
          if (
            directives.hasThinkDirective &&
            directives.thinkLevel === "xhigh" &&
            !(0, thinking_js_1.supportsXHighThinking)(resolvedProvider, resolvedModel)
          ) {
            return [
              2 /*return*/,
              {
                text: 'Thinking level "xhigh" is only supported for '.concat(
                  (0, thinking_js_1.formatXHighModelHint)(),
                  ".",
                ),
              },
            ];
          }
          nextThinkLevel = directives.hasThinkDirective
            ? directives.thinkLevel
            : (_f =
                  sessionEntry === null || sessionEntry === void 0
                    ? void 0
                    : sessionEntry.thinkingLevel) !== null && _f !== void 0
              ? _f
              : currentThinkLevel;
          shouldDowngradeXHigh =
            !directives.hasThinkDirective &&
            nextThinkLevel === "xhigh" &&
            !(0, thinking_js_1.supportsXHighThinking)(resolvedProvider, resolvedModel);
          prevElevatedLevel =
            (_g =
              currentElevatedLevel !== null && currentElevatedLevel !== void 0
                ? currentElevatedLevel
                : sessionEntry.elevatedLevel) !== null && _g !== void 0
              ? _g
              : elevatedAllowed
                ? "on"
                : "off";
          prevReasoningLevel =
            (_h =
              currentReasoningLevel !== null && currentReasoningLevel !== void 0
                ? currentReasoningLevel
                : sessionEntry.reasoningLevel) !== null && _h !== void 0
              ? _h
              : "off";
          elevatedChanged =
            directives.hasElevatedDirective &&
            directives.elevatedLevel !== undefined &&
            elevatedEnabled &&
            elevatedAllowed;
          reasoningChanged =
            directives.hasReasoningDirective && directives.reasoningLevel !== undefined;
          if (directives.hasThinkDirective && directives.thinkLevel) {
            if (directives.thinkLevel === "off") {
              delete sessionEntry.thinkingLevel;
            } else {
              sessionEntry.thinkingLevel = directives.thinkLevel;
            }
          }
          if (shouldDowngradeXHigh) {
            sessionEntry.thinkingLevel = "high";
          }
          if (directives.hasVerboseDirective && directives.verboseLevel) {
            (0, level_overrides_js_1.applyVerboseOverride)(sessionEntry, directives.verboseLevel);
          }
          if (directives.hasReasoningDirective && directives.reasoningLevel) {
            if (directives.reasoningLevel === "off") {
              delete sessionEntry.reasoningLevel;
            } else {
              sessionEntry.reasoningLevel = directives.reasoningLevel;
            }
            reasoningChanged =
              directives.reasoningLevel !== prevReasoningLevel &&
              directives.reasoningLevel !== undefined;
          }
          if (directives.hasElevatedDirective && directives.elevatedLevel) {
            // Unlike other toggles, elevated defaults can be "on".
            // Persist "off" explicitly so `/elevated off` actually overrides defaults.
            sessionEntry.elevatedLevel = directives.elevatedLevel;
            elevatedChanged =
              elevatedChanged ||
              (directives.elevatedLevel !== prevElevatedLevel &&
                directives.elevatedLevel !== undefined);
          }
          if (directives.hasExecDirective && directives.hasExecOptions) {
            if (directives.execHost) {
              sessionEntry.execHost = directives.execHost;
            }
            if (directives.execSecurity) {
              sessionEntry.execSecurity = directives.execSecurity;
            }
            if (directives.execAsk) {
              sessionEntry.execAsk = directives.execAsk;
            }
            if (directives.execNode) {
              sessionEntry.execNode = directives.execNode;
            }
          }
          if (modelSelection) {
            (0, model_overrides_js_1.applyModelOverrideToSessionEntry)({
              entry: sessionEntry,
              selection: modelSelection,
              profileOverride: profileOverride,
            });
          }
          if (directives.hasQueueDirective && directives.queueReset) {
            delete sessionEntry.queueMode;
            delete sessionEntry.queueDebounceMs;
            delete sessionEntry.queueCap;
            delete sessionEntry.queueDrop;
          } else if (directives.hasQueueDirective) {
            if (directives.queueMode) {
              sessionEntry.queueMode = directives.queueMode;
            }
            if (typeof directives.debounceMs === "number") {
              sessionEntry.queueDebounceMs = directives.debounceMs;
            }
            if (typeof directives.cap === "number") {
              sessionEntry.queueCap = directives.cap;
            }
            if (directives.dropPolicy) {
              sessionEntry.queueDrop = directives.dropPolicy;
            }
          }
          sessionEntry.updatedAt = Date.now();
          sessionStore[sessionKey] = sessionEntry;
          if (!storePath) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
              store[sessionKey] = sessionEntry;
            }),
          ];
        case 2:
          _l.sent();
          _l.label = 3;
        case 3:
          if (modelSelection) {
            nextLabel = "".concat(modelSelection.provider, "/").concat(modelSelection.model);
            if (nextLabel !== initialModelLabel) {
              (0, system_events_js_1.enqueueSystemEvent)(
                formatModelSwitchEvent(nextLabel, modelSelection.alias),
                {
                  sessionKey: sessionKey,
                  contextKey: "model:".concat(nextLabel),
                },
              );
            }
          }
          if (elevatedChanged) {
            nextElevated = (_j = sessionEntry.elevatedLevel) !== null && _j !== void 0 ? _j : "off";
            (0, system_events_js_1.enqueueSystemEvent)(
              (0, directive_handling_shared_js_1.formatElevatedEvent)(nextElevated),
              {
                sessionKey: sessionKey,
                contextKey: "mode:elevated",
              },
            );
          }
          if (reasoningChanged) {
            nextReasoning =
              (_k = sessionEntry.reasoningLevel) !== null && _k !== void 0 ? _k : "off";
            (0, system_events_js_1.enqueueSystemEvent)(
              (0, directive_handling_shared_js_1.formatReasoningEvent)(nextReasoning),
              {
                sessionKey: sessionKey,
                contextKey: "mode:reasoning",
              },
            );
          }
          parts = [];
          if (directives.hasThinkDirective && directives.thinkLevel) {
            parts.push(
              directives.thinkLevel === "off"
                ? "Thinking disabled."
                : "Thinking level set to ".concat(directives.thinkLevel, "."),
            );
          }
          if (directives.hasVerboseDirective && directives.verboseLevel) {
            parts.push(
              directives.verboseLevel === "off"
                ? (0, directive_handling_shared_js_1.formatDirectiveAck)(
                    "Verbose logging disabled.",
                  )
                : directives.verboseLevel === "full"
                  ? (0, directive_handling_shared_js_1.formatDirectiveAck)(
                      "Verbose logging set to full.",
                    )
                  : (0, directive_handling_shared_js_1.formatDirectiveAck)(
                      "Verbose logging enabled.",
                    ),
            );
          }
          if (directives.hasReasoningDirective && directives.reasoningLevel) {
            parts.push(
              directives.reasoningLevel === "off"
                ? (0, directive_handling_shared_js_1.formatDirectiveAck)(
                    "Reasoning visibility disabled.",
                  )
                : directives.reasoningLevel === "stream"
                  ? (0, directive_handling_shared_js_1.formatDirectiveAck)(
                      "Reasoning stream enabled (Telegram only).",
                    )
                  : (0, directive_handling_shared_js_1.formatDirectiveAck)(
                      "Reasoning visibility enabled.",
                    ),
            );
          }
          if (directives.hasElevatedDirective && directives.elevatedLevel) {
            parts.push(
              directives.elevatedLevel === "off"
                ? (0, directive_handling_shared_js_1.formatDirectiveAck)("Elevated mode disabled.")
                : directives.elevatedLevel === "full"
                  ? (0, directive_handling_shared_js_1.formatDirectiveAck)(
                      "Elevated mode set to full (auto-approve).",
                    )
                  : (0, directive_handling_shared_js_1.formatDirectiveAck)(
                      "Elevated mode set to ask (approvals may still apply).",
                    ),
            );
            if (shouldHintDirectRuntime) {
              parts.push((0, directive_handling_shared_js_1.formatElevatedRuntimeHint)());
            }
          }
          if (directives.hasExecDirective && directives.hasExecOptions) {
            execParts = [];
            if (directives.execHost) {
              execParts.push("host=".concat(directives.execHost));
            }
            if (directives.execSecurity) {
              execParts.push("security=".concat(directives.execSecurity));
            }
            if (directives.execAsk) {
              execParts.push("ask=".concat(directives.execAsk));
            }
            if (directives.execNode) {
              execParts.push("node=".concat(directives.execNode));
            }
            if (execParts.length > 0) {
              parts.push(
                (0, directive_handling_shared_js_1.formatDirectiveAck)(
                  "Exec defaults set (".concat(execParts.join(", "), ")."),
                ),
              );
            }
          }
          if (shouldDowngradeXHigh) {
            parts.push(
              "Thinking level set to high (xhigh not supported for "
                .concat(resolvedProvider, "/")
                .concat(resolvedModel, ")."),
            );
          }
          if (modelSelection) {
            label = "".concat(modelSelection.provider, "/").concat(modelSelection.model);
            labelWithAlias = modelSelection.alias
              ? "".concat(modelSelection.alias, " (").concat(label, ")")
              : label;
            parts.push(
              modelSelection.isDefault
                ? "Model reset to default (".concat(labelWithAlias, ").")
                : "Model set to ".concat(labelWithAlias, "."),
            );
            if (profileOverride) {
              parts.push("Auth profile set to ".concat(profileOverride, "."));
            }
          }
          if (directives.hasQueueDirective && directives.queueMode) {
            parts.push(
              (0, directive_handling_shared_js_1.formatDirectiveAck)(
                "Queue mode set to ".concat(directives.queueMode, "."),
              ),
            );
          } else if (directives.hasQueueDirective && directives.queueReset) {
            parts.push(
              (0, directive_handling_shared_js_1.formatDirectiveAck)(
                "Queue mode reset to default.",
              ),
            );
          }
          if (directives.hasQueueDirective && typeof directives.debounceMs === "number") {
            parts.push(
              (0, directive_handling_shared_js_1.formatDirectiveAck)(
                "Queue debounce set to ".concat(directives.debounceMs, "ms."),
              ),
            );
          }
          if (directives.hasQueueDirective && typeof directives.cap === "number") {
            parts.push(
              (0, directive_handling_shared_js_1.formatDirectiveAck)(
                "Queue cap set to ".concat(directives.cap, "."),
              ),
            );
          }
          if (directives.hasQueueDirective && directives.dropPolicy) {
            parts.push(
              (0, directive_handling_shared_js_1.formatDirectiveAck)(
                "Queue drop set to ".concat(directives.dropPolicy, "."),
              ),
            );
          }
          ack = parts.join(" ").trim();
          if (!ack && directives.hasStatusDirective) {
            return [2 /*return*/, undefined];
          }
          return [2 /*return*/, { text: ack || "OK." }];
      }
    });
  });
}
