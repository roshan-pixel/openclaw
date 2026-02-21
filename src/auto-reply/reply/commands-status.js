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
exports.buildStatusReply = buildStatusReply;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var subagent_registry_js_1 = require("../../agents/subagent-registry.js");
var auth_profiles_js_1 = require("../../agents/auth-profiles.js");
var model_auth_js_1 = require("../../agents/model-auth.js");
var sessions_helpers_js_1 = require("../../agents/tools/sessions-helpers.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var globals_js_1 = require("../../globals.js");
var provider_usage_js_1 = require("../../infra/provider-usage.js");
var group_activation_js_1 = require("../group-activation.js");
var status_js_1 = require("../status.js");
var queue_js_1 = require("./queue.js");
var subagents_utils_js_1 = require("./subagents-utils.js");
function formatApiKeySnippet(apiKey) {
  var compact = apiKey.replace(/\s+/g, "");
  if (!compact) {
    return "unknown";
  }
  var edge = compact.length >= 12 ? 6 : 4;
  var head = compact.slice(0, edge);
  var tail = compact.slice(-edge);
  return "".concat(head, "\u2026").concat(tail);
}
function resolveModelAuthLabel(provider, cfg, sessionEntry, agentDir) {
  var _a;
  var resolved = provider === null || provider === void 0 ? void 0 : provider.trim();
  if (!resolved) {
    return undefined;
  }
  var providerKey = (0, model_selection_js_1.normalizeProviderId)(resolved);
  var store = (0, auth_profiles_js_1.ensureAuthProfileStore)(agentDir, {
    allowKeychainPrompt: false,
  });
  var profileOverride =
    (_a =
      sessionEntry === null || sessionEntry === void 0
        ? void 0
        : sessionEntry.authProfileOverride) === null || _a === void 0
      ? void 0
      : _a.trim();
  var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
    cfg: cfg,
    store: store,
    provider: providerKey,
    preferredProfile: profileOverride,
  });
  var candidates = __spreadArray([profileOverride], order, true).filter(Boolean);
  for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
    var profileId = candidates_1[_i];
    var profile = store.profiles[profileId];
    if (
      !profile ||
      (0, model_selection_js_1.normalizeProviderId)(profile.provider) !== providerKey
    ) {
      continue;
    }
    var label = (0, auth_profiles_js_1.resolveAuthProfileDisplayLabel)({
      cfg: cfg,
      store: store,
      profileId: profileId,
    });
    if (profile.type === "oauth") {
      return "oauth".concat(label ? " (".concat(label, ")") : "");
    }
    if (profile.type === "token") {
      var snippet_1 = formatApiKeySnippet(profile.token);
      return "token ".concat(snippet_1).concat(label ? " (".concat(label, ")") : "");
    }
    var snippet = formatApiKeySnippet(profile.key);
    return "api-key ".concat(snippet).concat(label ? " (".concat(label, ")") : "");
  }
  var envKey = (0, model_auth_js_1.resolveEnvApiKey)(providerKey);
  if (envKey === null || envKey === void 0 ? void 0 : envKey.apiKey) {
    if (envKey.source.includes("OAUTH_TOKEN")) {
      return "oauth (".concat(envKey.source, ")");
    }
    return "api-key ".concat(formatApiKeySnippet(envKey.apiKey), " (").concat(envKey.source, ")");
  }
  var customKey = (0, model_auth_js_1.getCustomProviderApiKey)(cfg, providerKey);
  if (customKey) {
    return "api-key ".concat(formatApiKeySnippet(customKey), " (models.json)");
  }
  return "unknown";
}
function buildStatusReply(params) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      command,
      sessionEntry,
      sessionKey,
      sessionScope,
      provider,
      model,
      contextTokens,
      resolvedThinkLevel,
      resolvedVerboseLevel,
      resolvedReasoningLevel,
      resolvedElevatedLevel,
      resolveDefaultThinkingLevel,
      isGroup,
      defaultGroupActivation,
      statusAgentId,
      statusAgentDir,
      currentUsageProvider,
      usageLine,
      usageSummary,
      usageEntry,
      summaryLine,
      _a,
      queueSettings,
      queueKey,
      queueDepth,
      queueOverrides,
      subagentsLine,
      _b,
      mainKey,
      alias,
      requesterKey,
      runs,
      verboseEnabled,
      active,
      done,
      labels,
      labelText,
      groupActivation,
      agentDefaults,
      statusText,
      _c,
      _d;
    var _e;
    var _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
      switch (_l.label) {
        case 0:
          ((cfg = params.cfg),
            (command = params.command),
            (sessionEntry = params.sessionEntry),
            (sessionKey = params.sessionKey),
            (sessionScope = params.sessionScope),
            (provider = params.provider),
            (model = params.model),
            (contextTokens = params.contextTokens),
            (resolvedThinkLevel = params.resolvedThinkLevel),
            (resolvedVerboseLevel = params.resolvedVerboseLevel),
            (resolvedReasoningLevel = params.resolvedReasoningLevel),
            (resolvedElevatedLevel = params.resolvedElevatedLevel),
            (resolveDefaultThinkingLevel = params.resolveDefaultThinkingLevel),
            (isGroup = params.isGroup),
            (defaultGroupActivation = params.defaultGroupActivation));
          if (!command.isAuthorizedSender) {
            (0, globals_js_1.logVerbose)(
              "Ignoring /status from unauthorized sender: ".concat(command.senderId || "<unknown>"),
            );
            return [2 /*return*/, undefined];
          }
          statusAgentId = sessionKey
            ? (0, agent_scope_js_1.resolveSessionAgentId)({ sessionKey: sessionKey, config: cfg })
            : (0, agent_scope_js_1.resolveDefaultAgentId)(cfg);
          statusAgentDir = (0, agent_scope_js_1.resolveAgentDir)(cfg, statusAgentId);
          currentUsageProvider = (function () {
            try {
              return (0, provider_usage_js_1.resolveUsageProviderId)(provider);
            } catch (_a) {
              return undefined;
            }
          })();
          usageLine = null;
          if (!currentUsageProvider) {
            return [3 /*break*/, 4];
          }
          _l.label = 1;
        case 1:
          _l.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            (0, provider_usage_js_1.loadProviderUsageSummary)({
              timeoutMs: 3500,
              providers: [currentUsageProvider],
              agentDir: statusAgentDir,
            }),
          ];
        case 2:
          usageSummary = _l.sent();
          usageEntry = usageSummary.providers[0];
          if (usageEntry && !usageEntry.error && usageEntry.windows.length > 0) {
            summaryLine = (0, provider_usage_js_1.formatUsageWindowSummary)(usageEntry, {
              now: Date.now(),
              maxWindows: 2,
              includeResets: true,
            });
            if (summaryLine) {
              usageLine = "\uD83D\uDCCA Usage: ".concat(summaryLine);
            }
          }
          return [3 /*break*/, 4];
        case 3:
          _a = _l.sent();
          usageLine = null;
          return [3 /*break*/, 4];
        case 4:
          queueSettings = (0, queue_js_1.resolveQueueSettings)({
            cfg: cfg,
            channel: command.channel,
            sessionEntry: sessionEntry,
          });
          queueKey =
            sessionKey !== null && sessionKey !== void 0
              ? sessionKey
              : sessionEntry === null || sessionEntry === void 0
                ? void 0
                : sessionEntry.sessionId;
          queueDepth = queueKey ? (0, queue_js_1.getFollowupQueueDepth)(queueKey) : 0;
          queueOverrides = Boolean(
            (_g =
              (_f =
                sessionEntry === null || sessionEntry === void 0
                  ? void 0
                  : sessionEntry.queueDebounceMs) !== null && _f !== void 0
                ? _f
                : sessionEntry === null || sessionEntry === void 0
                  ? void 0
                  : sessionEntry.queueCap) !== null && _g !== void 0
              ? _g
              : sessionEntry === null || sessionEntry === void 0
                ? void 0
                : sessionEntry.queueDrop,
          );
          if (sessionKey) {
            ((_b = (0, sessions_helpers_js_1.resolveMainSessionAlias)(cfg)),
              (mainKey = _b.mainKey),
              (alias = _b.alias));
            requesterKey = (0, sessions_helpers_js_1.resolveInternalSessionKey)({
              key: sessionKey,
              alias: alias,
              mainKey: mainKey,
            });
            runs = (0, subagent_registry_js_1.listSubagentRunsForRequester)(requesterKey);
            verboseEnabled = resolvedVerboseLevel && resolvedVerboseLevel !== "off";
            if (runs.length > 0) {
              active = runs.filter(function (entry) {
                return !entry.endedAt;
              });
              done = runs.length - active.length;
              if (verboseEnabled) {
                labels = active
                  .map(function (entry) {
                    return (0, subagents_utils_js_1.resolveSubagentLabel)(entry, "");
                  })
                  .filter(Boolean)
                  .slice(0, 3);
                labelText = labels.length ? " (".concat(labels.join(", "), ")") : "";
                subagentsLine = "\uD83E\uDD16 Subagents: "
                  .concat(active.length, " active")
                  .concat(labelText, " \u00B7 ")
                  .concat(done, " done");
              } else if (active.length > 0) {
                subagentsLine = "\uD83E\uDD16 Subagents: ".concat(active.length, " active");
              }
            }
          }
          groupActivation = isGroup
            ? (_h = (0, group_activation_js_1.normalizeGroupActivation)(
                sessionEntry === null || sessionEntry === void 0
                  ? void 0
                  : sessionEntry.groupActivation,
              )) !== null && _h !== void 0
              ? _h
              : defaultGroupActivation()
            : undefined;
          agentDefaults =
            (_k = (_j = cfg.agents) === null || _j === void 0 ? void 0 : _j.defaults) !== null &&
            _k !== void 0
              ? _k
              : {};
          _c = status_js_1.buildStatusMessage;
          _e = {
            config: cfg,
            agent: __assign(__assign({}, agentDefaults), {
              model: __assign(__assign({}, agentDefaults.model), {
                primary: "".concat(provider, "/").concat(model),
              }),
              contextTokens: contextTokens,
              thinkingDefault: agentDefaults.thinkingDefault,
              verboseDefault: agentDefaults.verboseDefault,
              elevatedDefault: agentDefaults.elevatedDefault,
            }),
            sessionEntry: sessionEntry,
            sessionKey: sessionKey,
            sessionScope: sessionScope,
            groupActivation: groupActivation,
          };
          if (!(resolvedThinkLevel !== null && resolvedThinkLevel !== void 0)) {
            return [3 /*break*/, 5];
          }
          _d = resolvedThinkLevel;
          return [3 /*break*/, 7];
        case 5:
          return [4 /*yield*/, resolveDefaultThinkingLevel()];
        case 6:
          _d = _l.sent();
          _l.label = 7;
        case 7:
          statusText = _c.apply(void 0, [
            ((_e.resolvedThink = _d),
            (_e.resolvedVerbose = resolvedVerboseLevel),
            (_e.resolvedReasoning = resolvedReasoningLevel),
            (_e.resolvedElevated = resolvedElevatedLevel),
            (_e.modelAuth = resolveModelAuthLabel(provider, cfg, sessionEntry, statusAgentDir)),
            (_e.usageLine = usageLine !== null && usageLine !== void 0 ? usageLine : undefined),
            (_e.queue = {
              mode: queueSettings.mode,
              depth: queueDepth,
              debounceMs: queueSettings.debounceMs,
              cap: queueSettings.cap,
              dropPolicy: queueSettings.dropPolicy,
              showDetails: queueOverrides,
            }),
            (_e.subagentsLine = subagentsLine),
            (_e.mediaDecisions = params.mediaDecisions),
            (_e.includeTranscriptUsage = false),
            _e),
          ]);
          return [2 /*return*/, { text: statusText }];
      }
    });
  });
}
