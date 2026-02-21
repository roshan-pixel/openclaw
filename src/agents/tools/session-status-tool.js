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
exports.createSessionStatusTool = createSessionStatusTool;
var typebox_1 = require("@sinclair/typebox");
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var auth_profiles_js_1 = require("../../agents/auth-profiles.js");
var model_auth_js_1 = require("../../agents/model-auth.js");
var model_catalog_js_1 = require("../../agents/model-catalog.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var date_time_js_1 = require("../date-time.js");
var group_activation_js_1 = require("../../auto-reply/group-activation.js");
var queue_js_1 = require("../../auto-reply/reply/queue.js");
var status_js_1 = require("../../auto-reply/status.js");
var config_js_1 = require("../../config/config.js");
var sessions_js_1 = require("../../config/sessions.js");
var provider_usage_js_1 = require("../../infra/provider-usage.js");
var session_key_js_1 = require("../../routing/session-key.js");
var model_overrides_js_1 = require("../../sessions/model-overrides.js");
var common_js_1 = require("./common.js");
var sessions_helpers_js_1 = require("./sessions-helpers.js");
var session_utils_js_1 = require("../../gateway/session-utils.js");
var SessionStatusToolSchema = typebox_1.Type.Object({
  sessionKey: typebox_1.Type.Optional(typebox_1.Type.String()),
  model: typebox_1.Type.Optional(typebox_1.Type.String()),
});
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
function resolveModelAuthLabel(params) {
  var _a, _b, _c;
  var resolvedProvider = (_a = params.provider) === null || _a === void 0 ? void 0 : _a.trim();
  if (!resolvedProvider) {
    return undefined;
  }
  var providerKey = (0, model_selection_js_1.normalizeProviderId)(resolvedProvider);
  var store = (0, auth_profiles_js_1.ensureAuthProfileStore)(params.agentDir, {
    allowKeychainPrompt: false,
  });
  var profileOverride =
    (_c =
      (_b = params.sessionEntry) === null || _b === void 0 ? void 0 : _b.authProfileOverride) ===
      null || _c === void 0
      ? void 0
      : _c.trim();
  var order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
    cfg: params.cfg,
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
      cfg: params.cfg,
      store: store,
      profileId: profileId,
    });
    if (profile.type === "oauth") {
      return "oauth".concat(label ? " (".concat(label, ")") : "");
    }
    if (profile.type === "token") {
      return "token "
        .concat(formatApiKeySnippet(profile.token))
        .concat(label ? " (".concat(label, ")") : "");
    }
    return "api-key "
      .concat(formatApiKeySnippet(profile.key))
      .concat(label ? " (".concat(label, ")") : "");
  }
  var envKey = (0, model_auth_js_1.resolveEnvApiKey)(providerKey);
  if (envKey === null || envKey === void 0 ? void 0 : envKey.apiKey) {
    if (envKey.source.includes("OAUTH_TOKEN")) {
      return "oauth (".concat(envKey.source, ")");
    }
    return "api-key ".concat(formatApiKeySnippet(envKey.apiKey), " (").concat(envKey.source, ")");
  }
  var customKey = (0, model_auth_js_1.getCustomProviderApiKey)(params.cfg, providerKey);
  if (customKey) {
    return "api-key ".concat(formatApiKeySnippet(customKey), " (models.json)");
  }
  return "unknown";
}
function resolveSessionEntry(params) {
  var keyRaw = params.keyRaw.trim();
  if (!keyRaw) {
    return null;
  }
  var internal = (0, sessions_helpers_js_1.resolveInternalSessionKey)({
    key: keyRaw,
    alias: params.alias,
    mainKey: params.mainKey,
  });
  var candidates = new Set([keyRaw, internal]);
  if (!keyRaw.startsWith("agent:")) {
    candidates.add("agent:".concat(session_key_js_1.DEFAULT_AGENT_ID, ":").concat(keyRaw));
    candidates.add("agent:".concat(session_key_js_1.DEFAULT_AGENT_ID, ":").concat(internal));
  }
  if (keyRaw === "main") {
    candidates.add(
      (0, session_key_js_1.buildAgentMainSessionKey)({
        agentId: session_key_js_1.DEFAULT_AGENT_ID,
        mainKey: params.mainKey,
      }),
    );
  }
  for (var _i = 0, candidates_2 = candidates; _i < candidates_2.length; _i++) {
    var key = candidates_2[_i];
    var entry = params.store[key];
    if (entry) {
      return { key: key, entry: entry };
    }
  }
  return null;
}
function resolveSessionKeyFromSessionId(params) {
  var _a;
  var trimmed = params.sessionId.trim();
  if (!trimmed) {
    return null;
  }
  var store = (0, session_utils_js_1.loadCombinedSessionStoreForGateway)(params.cfg).store;
  var match = Object.entries(store).find(function (_a) {
    var key = _a[0],
      entry = _a[1];
    if ((entry === null || entry === void 0 ? void 0 : entry.sessionId) !== trimmed) {
      return false;
    }
    if (!params.agentId) {
      return true;
    }
    return (0, session_key_js_1.resolveAgentIdFromSessionKey)(key) === params.agentId;
  });
  return (_a = match === null || match === void 0 ? void 0 : match[0]) !== null && _a !== void 0
    ? _a
    : null;
}
function resolveModelOverride(params) {
  return __awaiter(this, void 0, void 0, function () {
    var raw,
      configDefault,
      currentProvider,
      currentModel,
      aliasIndex,
      catalog,
      allowed,
      resolved,
      key,
      isDefault;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          raw = params.raw.trim();
          if (!raw) {
            return [2 /*return*/, { kind: "reset" }];
          }
          if (raw.toLowerCase() === "default") {
            return [2 /*return*/, { kind: "reset" }];
          }
          configDefault = (0, model_selection_js_1.resolveDefaultModelForAgent)({
            cfg: params.cfg,
            agentId: params.agentId,
          });
          currentProvider =
            ((_b =
              (_a = params.sessionEntry) === null || _a === void 0
                ? void 0
                : _a.providerOverride) === null || _b === void 0
              ? void 0
              : _b.trim()) || configDefault.provider;
          currentModel =
            ((_d =
              (_c = params.sessionEntry) === null || _c === void 0 ? void 0 : _c.modelOverride) ===
              null || _d === void 0
              ? void 0
              : _d.trim()) || configDefault.model;
          aliasIndex = (0, model_selection_js_1.buildModelAliasIndex)({
            cfg: params.cfg,
            defaultProvider: currentProvider,
          });
          return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: params.cfg })];
        case 1:
          catalog = _e.sent();
          allowed = (0, model_selection_js_1.buildAllowedModelSet)({
            cfg: params.cfg,
            catalog: catalog,
            defaultProvider: currentProvider,
            defaultModel: currentModel,
          });
          resolved = (0, model_selection_js_1.resolveModelRefFromString)({
            raw: raw,
            defaultProvider: currentProvider,
            aliasIndex: aliasIndex,
          });
          if (!resolved) {
            throw new Error('Unrecognized model "'.concat(raw, '".'));
          }
          key = (0, model_selection_js_1.modelKey)(resolved.ref.provider, resolved.ref.model);
          if (allowed.allowedKeys.size > 0 && !allowed.allowedKeys.has(key)) {
            throw new Error('Model "'.concat(key, '" is not allowed.'));
          }
          isDefault =
            resolved.ref.provider === configDefault.provider &&
            resolved.ref.model === configDefault.model;
          return [
            2 /*return*/,
            {
              kind: "set",
              provider: resolved.ref.provider,
              model: resolved.ref.model,
              isDefault: isDefault,
            },
          ];
      }
    });
  });
}
function createSessionStatusTool(opts) {
  var _this = this;
  return {
    label: "Session Status",
    name: "session_status",
    description:
      "Show a /status-equivalent session status card (usage + time + cost when available). Use for model-use questions (📊 session_status). Optional: set per-session model override (model=default resets overrides).",
    parameters: SessionStatusToolSchema,
    execute: function (_toolCallId, args) {
      return __awaiter(_this, void 0, void 0, function () {
        var params,
          cfg,
          _a,
          mainKey,
          alias,
          a2aPolicy,
          requestedKeyParam,
          requestedKeyRaw,
          requesterAgentId,
          ensureAgentAccess,
          isExplicitAgentKey,
          agentId,
          storePath,
          store,
          resolved,
          resolvedKey,
          kind,
          configured,
          modelRaw,
          changedModel,
          selection,
          nextEntry_1,
          applied,
          agentDir,
          providerForCard,
          usageProvider,
          usageLine,
          usageSummary,
          snapshot,
          formatted,
          _b,
          isGroup,
          groupActivation,
          queueSettings,
          queueKey,
          queueDepth,
          queueOverrides,
          userTimezone,
          userTimeFormat,
          userTime,
          timeLine,
          agentDefaults,
          defaultLabel,
          agentModel,
          statusText;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        return __generator(this, function (_v) {
          switch (_v.label) {
            case 0:
              params = args;
              cfg =
                (_c = opts === null || opts === void 0 ? void 0 : opts.config) !== null &&
                _c !== void 0
                  ? _c
                  : (0, config_js_1.loadConfig)();
              ((_a = (0, sessions_helpers_js_1.resolveMainSessionAlias)(cfg)),
                (mainKey = _a.mainKey),
                (alias = _a.alias));
              a2aPolicy = (0, sessions_helpers_js_1.createAgentToAgentPolicy)(cfg);
              requestedKeyParam = (0, common_js_1.readStringParam)(params, "sessionKey");
              requestedKeyRaw =
                requestedKeyParam !== null && requestedKeyParam !== void 0
                  ? requestedKeyParam
                  : opts === null || opts === void 0
                    ? void 0
                    : opts.agentSessionKey;
              if (
                !(requestedKeyRaw === null || requestedKeyRaw === void 0
                  ? void 0
                  : requestedKeyRaw.trim())
              ) {
                throw new Error("sessionKey required");
              }
              requesterAgentId = (0, session_key_js_1.resolveAgentIdFromSessionKey)(
                (_d = opts === null || opts === void 0 ? void 0 : opts.agentSessionKey) !== null &&
                  _d !== void 0
                  ? _d
                  : requestedKeyRaw,
              );
              ensureAgentAccess = function (targetAgentId) {
                if (targetAgentId === requesterAgentId) {
                  return;
                }
                // Gate cross-agent access behind tools.agentToAgent settings.
                if (!a2aPolicy.enabled) {
                  throw new Error(
                    "Agent-to-agent status is disabled. Set tools.agentToAgent.enabled=true to allow cross-agent access.",
                  );
                }
                if (!a2aPolicy.isAllowed(requesterAgentId, targetAgentId)) {
                  throw new Error(
                    "Agent-to-agent session status denied by tools.agentToAgent.allow.",
                  );
                }
              };
              if (requestedKeyRaw.startsWith("agent:")) {
                ensureAgentAccess(
                  (0, session_key_js_1.resolveAgentIdFromSessionKey)(requestedKeyRaw),
                );
              }
              isExplicitAgentKey = requestedKeyRaw.startsWith("agent:");
              agentId = isExplicitAgentKey
                ? (0, session_key_js_1.resolveAgentIdFromSessionKey)(requestedKeyRaw)
                : requesterAgentId;
              storePath = (0, sessions_js_1.resolveStorePath)(
                (_e = cfg.session) === null || _e === void 0 ? void 0 : _e.store,
                { agentId: agentId },
              );
              store = (0, sessions_js_1.loadSessionStore)(storePath);
              resolved = resolveSessionEntry({
                store: store,
                keyRaw: requestedKeyRaw,
                alias: alias,
                mainKey: mainKey,
              });
              if (
                !resolved &&
                (0, sessions_helpers_js_1.shouldResolveSessionIdInput)(requestedKeyRaw)
              ) {
                resolvedKey = resolveSessionKeyFromSessionId({
                  cfg: cfg,
                  sessionId: requestedKeyRaw,
                  agentId: a2aPolicy.enabled ? undefined : requesterAgentId,
                });
                if (resolvedKey) {
                  // If resolution points at another agent, enforce A2A policy before switching stores.
                  ensureAgentAccess(
                    (0, session_key_js_1.resolveAgentIdFromSessionKey)(resolvedKey),
                  );
                  requestedKeyRaw = resolvedKey;
                  agentId = (0, session_key_js_1.resolveAgentIdFromSessionKey)(resolvedKey);
                  storePath = (0, sessions_js_1.resolveStorePath)(
                    (_f = cfg.session) === null || _f === void 0 ? void 0 : _f.store,
                    { agentId: agentId },
                  );
                  store = (0, sessions_js_1.loadSessionStore)(storePath);
                  resolved = resolveSessionEntry({
                    store: store,
                    keyRaw: requestedKeyRaw,
                    alias: alias,
                    mainKey: mainKey,
                  });
                }
              }
              if (!resolved) {
                kind = (0, sessions_helpers_js_1.shouldResolveSessionIdInput)(requestedKeyRaw)
                  ? "sessionId"
                  : "sessionKey";
                throw new Error("Unknown ".concat(kind, ": ").concat(requestedKeyRaw));
              }
              configured = (0, model_selection_js_1.resolveDefaultModelForAgent)({
                cfg: cfg,
                agentId: agentId,
              });
              modelRaw = (0, common_js_1.readStringParam)(params, "model");
              changedModel = false;
              if (!(typeof modelRaw === "string")) {
                return [3 /*break*/, 3];
              }
              return [
                4 /*yield*/,
                resolveModelOverride({
                  cfg: cfg,
                  raw: modelRaw,
                  sessionEntry: resolved.entry,
                  agentId: agentId,
                }),
              ];
            case 1:
              selection = _v.sent();
              nextEntry_1 = __assign({}, resolved.entry);
              applied = (0, model_overrides_js_1.applyModelOverrideToSessionEntry)({
                entry: nextEntry_1,
                selection:
                  selection.kind === "reset"
                    ? {
                        provider: configured.provider,
                        model: configured.model,
                        isDefault: true,
                      }
                    : {
                        provider: selection.provider,
                        model: selection.model,
                        isDefault: selection.isDefault,
                      },
              });
              if (!applied.updated) {
                return [3 /*break*/, 3];
              }
              store[resolved.key] = nextEntry_1;
              return [
                4 /*yield*/,
                (0, sessions_js_1.updateSessionStore)(storePath, function (nextStore) {
                  nextStore[resolved.key] = nextEntry_1;
                }),
              ];
            case 2:
              _v.sent();
              resolved.entry = nextEntry_1;
              changedModel = true;
              _v.label = 3;
            case 3:
              agentDir = (0, agent_scope_js_1.resolveAgentDir)(cfg, agentId);
              providerForCard =
                ((_g = resolved.entry.providerOverride) === null || _g === void 0
                  ? void 0
                  : _g.trim()) || configured.provider;
              usageProvider = (0, provider_usage_js_1.resolveUsageProviderId)(providerForCard);
              if (!usageProvider) {
                return [3 /*break*/, 7];
              }
              _v.label = 4;
            case 4:
              _v.trys.push([4, 6, , 7]);
              return [
                4 /*yield*/,
                (0, provider_usage_js_1.loadProviderUsageSummary)({
                  timeoutMs: 3500,
                  providers: [usageProvider],
                  agentDir: agentDir,
                }),
              ];
            case 5:
              usageSummary = _v.sent();
              snapshot = usageSummary.providers.find(function (entry) {
                return entry.provider === usageProvider;
              });
              if (snapshot) {
                formatted = (0, provider_usage_js_1.formatUsageWindowSummary)(snapshot, {
                  now: Date.now(),
                  maxWindows: 2,
                  includeResets: true,
                });
                if (formatted && !formatted.startsWith("error:")) {
                  usageLine = "\uD83D\uDCCA Usage: ".concat(formatted);
                }
              }
              return [3 /*break*/, 7];
            case 6:
              _b = _v.sent();
              return [3 /*break*/, 7];
            case 7:
              isGroup =
                resolved.entry.chatType === "group" ||
                resolved.entry.chatType === "channel" ||
                resolved.key.includes(":group:") ||
                resolved.key.includes(":channel:");
              groupActivation = isGroup
                ? (_h = (0, group_activation_js_1.normalizeGroupActivation)(
                    resolved.entry.groupActivation,
                  )) !== null && _h !== void 0
                  ? _h
                  : "mention"
                : undefined;
              queueSettings = (0, queue_js_1.resolveQueueSettings)({
                cfg: cfg,
                channel:
                  (_k =
                    (_j = resolved.entry.channel) !== null && _j !== void 0
                      ? _j
                      : resolved.entry.lastChannel) !== null && _k !== void 0
                    ? _k
                    : "unknown",
                sessionEntry: resolved.entry,
              });
              queueKey =
                (_l = resolved.key) !== null && _l !== void 0 ? _l : resolved.entry.sessionId;
              queueDepth = queueKey ? (0, queue_js_1.getFollowupQueueDepth)(queueKey) : 0;
              queueOverrides = Boolean(
                (_o =
                  (_m = resolved.entry.queueDebounceMs) !== null && _m !== void 0
                    ? _m
                    : resolved.entry.queueCap) !== null && _o !== void 0
                  ? _o
                  : resolved.entry.queueDrop,
              );
              userTimezone = (0, date_time_js_1.resolveUserTimezone)(
                (_q = (_p = cfg.agents) === null || _p === void 0 ? void 0 : _p.defaults) ===
                  null || _q === void 0
                  ? void 0
                  : _q.userTimezone,
              );
              userTimeFormat = (0, date_time_js_1.resolveUserTimeFormat)(
                (_s = (_r = cfg.agents) === null || _r === void 0 ? void 0 : _r.defaults) ===
                  null || _s === void 0
                  ? void 0
                  : _s.timeFormat,
              );
              userTime = (0, date_time_js_1.formatUserTime)(
                new Date(),
                userTimezone,
                userTimeFormat,
              );
              timeLine = userTime
                ? "\uD83D\uDD52 Time: ".concat(userTime, " (").concat(userTimezone, ")")
                : "\uD83D\uDD52 Time zone: ".concat(userTimezone);
              agentDefaults =
                (_u = (_t = cfg.agents) === null || _t === void 0 ? void 0 : _t.defaults) !==
                  null && _u !== void 0
                  ? _u
                  : {};
              defaultLabel = "".concat(configured.provider, "/").concat(configured.model);
              agentModel =
                typeof agentDefaults.model === "object" && agentDefaults.model
                  ? __assign(__assign({}, agentDefaults.model), { primary: defaultLabel })
                  : { primary: defaultLabel };
              statusText = (0, status_js_1.buildStatusMessage)({
                config: cfg,
                agent: __assign(__assign({}, agentDefaults), { model: agentModel }),
                sessionEntry: resolved.entry,
                sessionKey: resolved.key,
                groupActivation: groupActivation,
                modelAuth: resolveModelAuthLabel({
                  provider: providerForCard,
                  cfg: cfg,
                  sessionEntry: resolved.entry,
                  agentDir: agentDir,
                }),
                usageLine: usageLine,
                timeLine: timeLine,
                queue: {
                  mode: queueSettings.mode,
                  depth: queueDepth,
                  debounceMs: queueSettings.debounceMs,
                  cap: queueSettings.cap,
                  dropPolicy: queueSettings.dropPolicy,
                  showDetails: queueOverrides,
                },
                includeTranscriptUsage: false,
              });
              return [
                2 /*return*/,
                {
                  content: [{ type: "text", text: statusText }],
                  details: {
                    ok: true,
                    sessionKey: resolved.key,
                    changedModel: changedModel,
                    statusText: statusText,
                  },
                },
              ];
          }
        });
      });
    },
  };
}
