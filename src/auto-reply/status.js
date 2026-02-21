"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatContextUsageShort = exports.formatTokenCount = void 0;
exports.buildStatusMessage = buildStatusMessage;
exports.buildHelpMessage = buildHelpMessage;
exports.buildCommandsMessage = buildCommandsMessage;
exports.buildCommandsMessagePaginated = buildCommandsMessagePaginated;
var node_fs_1 = require("node:fs");
var context_js_1 = require("../agents/context.js");
var defaults_js_1 = require("../agents/defaults.js");
var model_auth_js_1 = require("../agents/model-auth.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var sandbox_js_1 = require("../agents/sandbox.js");
var usage_js_1 = require("../agents/usage.js");
var sessions_js_1 = require("../config/sessions.js");
var tts_js_1 = require("../tts/tts.js");
var git_commit_js_1 = require("../infra/git-commit.js");
var usage_format_js_1 = require("../utils/usage-format.js");
var version_js_1 = require("../version.js");
var commands_registry_js_1 = require("./commands-registry.js");
var commands_js_1 = require("../plugins/commands.js");
exports.formatTokenCount = usage_format_js_1.formatTokenCount;
function resolveRuntimeLabel(args) {
  var _a, _b, _c, _d, _e;
  var sessionKey = (_a = args.sessionKey) === null || _a === void 0 ? void 0 : _a.trim();
  if (args.config && sessionKey) {
    var runtimeStatus = (0, sandbox_js_1.resolveSandboxRuntimeStatus)({
      cfg: args.config,
      sessionKey: sessionKey,
    });
    var sandboxMode_1 = (_b = runtimeStatus.mode) !== null && _b !== void 0 ? _b : "off";
    if (sandboxMode_1 === "off") {
      return "direct";
    }
    var runtime_1 = runtimeStatus.sandboxed ? "docker" : sessionKey ? "direct" : "unknown";
    return "".concat(runtime_1, "/").concat(sandboxMode_1);
  }
  var sandboxMode =
    (_e =
      (_d = (_c = args.agent) === null || _c === void 0 ? void 0 : _c.sandbox) === null ||
      _d === void 0
        ? void 0
        : _d.mode) !== null && _e !== void 0
      ? _e
      : "off";
  if (sandboxMode === "off") {
    return "direct";
  }
  var sandboxed = (function () {
    var _a;
    if (!sessionKey) {
      return false;
    }
    if (sandboxMode === "all") {
      return true;
    }
    if (args.config) {
      return (0, sandbox_js_1.resolveSandboxRuntimeStatus)({
        cfg: args.config,
        sessionKey: sessionKey,
      }).sandboxed;
    }
    var sessionScope = (_a = args.sessionScope) !== null && _a !== void 0 ? _a : "per-sender";
    var mainKey = (0, sessions_js_1.resolveMainSessionKey)({
      session: { scope: sessionScope },
    });
    return sessionKey !== mainKey.trim();
  })();
  var runtime = sandboxed ? "docker" : sessionKey ? "direct" : "unknown";
  return "".concat(runtime, "/").concat(sandboxMode);
}
var formatTokens = function (total, contextTokens) {
  var ctx = contextTokens !== null && contextTokens !== void 0 ? contextTokens : null;
  if (total == null) {
    var ctxLabel_1 = ctx ? (0, exports.formatTokenCount)(ctx) : "?";
    return "?/".concat(ctxLabel_1);
  }
  var pct = ctx ? Math.min(999, Math.round((total / ctx) * 100)) : null;
  var totalLabel = (0, exports.formatTokenCount)(total);
  var ctxLabel = ctx ? (0, exports.formatTokenCount)(ctx) : "?";
  return ""
    .concat(totalLabel, "/")
    .concat(ctxLabel)
    .concat(pct !== null ? " (".concat(pct, "%)") : "");
};
var formatContextUsageShort = function (total, contextTokens) {
  return "Context ".concat(
    formatTokens(total, contextTokens !== null && contextTokens !== void 0 ? contextTokens : null),
  );
};
exports.formatContextUsageShort = formatContextUsageShort;
var formatAge = function (ms) {
  if (!ms || ms < 0) {
    return "unknown";
  }
  var minutes = Math.round(ms / 60000);
  if (minutes < 1) {
    return "just now";
  }
  if (minutes < 60) {
    return "".concat(minutes, "m ago");
  }
  var hours = Math.round(minutes / 60);
  if (hours < 48) {
    return "".concat(hours, "h ago");
  }
  var days = Math.round(hours / 24);
  return "".concat(days, "d ago");
};
var formatQueueDetails = function (queue) {
  if (!queue) {
    return "";
  }
  var depth = typeof queue.depth === "number" ? "depth ".concat(queue.depth) : null;
  if (!queue.showDetails) {
    return depth ? " (".concat(depth, ")") : "";
  }
  var detailParts = [];
  if (depth) {
    detailParts.push(depth);
  }
  if (typeof queue.debounceMs === "number") {
    var ms = Math.max(0, Math.round(queue.debounceMs));
    var label =
      ms >= 1000
        ? "".concat(ms % 1000 === 0 ? ms / 1000 : (ms / 1000).toFixed(1), "s")
        : "".concat(ms, "ms");
    detailParts.push("debounce ".concat(label));
  }
  if (typeof queue.cap === "number") {
    detailParts.push("cap ".concat(queue.cap));
  }
  if (queue.dropPolicy) {
    detailParts.push("drop ".concat(queue.dropPolicy));
  }
  return detailParts.length ? " (".concat(detailParts.join(" · "), ")") : "";
};
var readUsageFromSessionLog = function (sessionId, sessionEntry) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
  // Transcripts are stored at the session file path (fallback: ~/.openclaw/sessions/<SessionId>.jsonl)
  if (!sessionId) {
    return undefined;
  }
  var logPath = (0, sessions_js_1.resolveSessionFilePath)(sessionId, sessionEntry);
  if (!node_fs_1.default.existsSync(logPath)) {
    return undefined;
  }
  try {
    var lines = node_fs_1.default.readFileSync(logPath, "utf-8").split(/\n+/);
    var input = 0;
    var output = 0;
    var promptTokens = 0;
    var model = void 0;
    var lastUsage = void 0;
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
      var line = lines_1[_i];
      if (!line.trim()) {
        continue;
      }
      try {
        var parsed = JSON.parse(line);
        var usageRaw =
          (_b = (_a = parsed.message) === null || _a === void 0 ? void 0 : _a.usage) !== null &&
          _b !== void 0
            ? _b
            : parsed.usage;
        var usage = (0, usage_js_1.normalizeUsage)(usageRaw);
        if (usage) {
          lastUsage = usage;
        }
        model =
          (_e =
            (_d = (_c = parsed.message) === null || _c === void 0 ? void 0 : _c.model) !== null &&
            _d !== void 0
              ? _d
              : parsed.model) !== null && _e !== void 0
            ? _e
            : model;
      } catch (_l) {
        // ignore bad lines
      }
    }
    if (!lastUsage) {
      return undefined;
    }
    input = (_f = lastUsage.input) !== null && _f !== void 0 ? _f : 0;
    output = (_g = lastUsage.output) !== null && _g !== void 0 ? _g : 0;
    promptTokens =
      (_j =
        (_h = (0, usage_js_1.derivePromptTokens)(lastUsage)) !== null && _h !== void 0
          ? _h
          : lastUsage.total) !== null && _j !== void 0
        ? _j
        : input + output;
    var total = (_k = lastUsage.total) !== null && _k !== void 0 ? _k : promptTokens + output;
    if (promptTokens === 0 && total === 0) {
      return undefined;
    }
    return { input: input, output: output, promptTokens: promptTokens, total: total, model: model };
  } catch (_m) {
    return undefined;
  }
};
var formatUsagePair = function (input, output) {
  if (input == null && output == null) {
    return null;
  }
  var inputLabel = typeof input === "number" ? (0, exports.formatTokenCount)(input) : "?";
  var outputLabel = typeof output === "number" ? (0, exports.formatTokenCount)(output) : "?";
  return "\uD83E\uDDEE Tokens: ".concat(inputLabel, " in / ").concat(outputLabel, " out");
};
var formatMediaUnderstandingLine = function (decisions) {
  if (!decisions || decisions.length === 0) {
    return null;
  }
  var parts = decisions
    .map(function (decision) {
      var _a, _b, _c, _d;
      var count = decision.attachments.length;
      var countLabel = count > 1 ? " x".concat(count) : "";
      if (decision.outcome === "success") {
        var chosen =
          (_a = decision.attachments.find(function (entry) {
            return entry.chosen;
          })) === null || _a === void 0
            ? void 0
            : _a.chosen;
        var provider =
          (_b = chosen === null || chosen === void 0 ? void 0 : chosen.provider) === null ||
          _b === void 0
            ? void 0
            : _b.trim();
        var model =
          (_c = chosen === null || chosen === void 0 ? void 0 : chosen.model) === null ||
          _c === void 0
            ? void 0
            : _c.trim();
        var modelLabel = provider
          ? model
            ? "".concat(provider, "/").concat(model)
            : provider
          : null;
        return ""
          .concat(decision.capability)
          .concat(countLabel, " ok")
          .concat(modelLabel ? " (".concat(modelLabel, ")") : "");
      }
      if (decision.outcome === "no-attachment") {
        return "".concat(decision.capability, " none");
      }
      if (decision.outcome === "disabled") {
        return "".concat(decision.capability, " off");
      }
      if (decision.outcome === "scope-deny") {
        return "".concat(decision.capability, " denied");
      }
      if (decision.outcome === "skipped") {
        var reason = decision.attachments
          .flatMap(function (entry) {
            return entry.attempts
              .map(function (attempt) {
                return attempt.reason;
              })
              .filter(Boolean);
          })
          .find(Boolean);
        var shortReason = reason
          ? (_d = reason.split(":")[0]) === null || _d === void 0
            ? void 0
            : _d.trim()
          : undefined;
        return ""
          .concat(decision.capability, " skipped")
          .concat(shortReason ? " (".concat(shortReason, ")") : "");
      }
      return null;
    })
    .filter(function (part) {
      return part != null;
    });
  if (parts.length === 0) {
    return null;
  }
  if (
    parts.every(function (part) {
      return part.endsWith(" none");
    })
  ) {
    return null;
  }
  return "\uD83D\uDCCE Media: ".concat(parts.join(" · "));
};
var formatVoiceModeLine = function (config, sessionEntry) {
  if (!config) {
    return null;
  }
  var ttsConfig = (0, tts_js_1.resolveTtsConfig)(config);
  var prefsPath = (0, tts_js_1.resolveTtsPrefsPath)(ttsConfig);
  var autoMode = (0, tts_js_1.resolveTtsAutoMode)({
    config: ttsConfig,
    prefsPath: prefsPath,
    sessionAuto: sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.ttsAuto,
  });
  if (autoMode === "off") {
    return null;
  }
  var provider = (0, tts_js_1.getTtsProvider)(ttsConfig, prefsPath);
  var maxLength = (0, tts_js_1.getTtsMaxLength)(prefsPath);
  var summarize = (0, tts_js_1.isSummarizationEnabled)(prefsPath) ? "on" : "off";
  return "\uD83D\uDD0A Voice: "
    .concat(autoMode, " \u00B7 provider=")
    .concat(provider, " \u00B7 limit=")
    .concat(maxLength, " \u00B7 summary=")
    .concat(summarize);
};
function buildStatusMessage(args) {
  var _a,
    _b,
    _c,
    _d,
    _e,
    _f,
    _g,
    _h,
    _j,
    _k,
    _l,
    _m,
    _o,
    _p,
    _q,
    _r,
    _s,
    _t,
    _u,
    _v,
    _w,
    _x,
    _y,
    _z,
    _0,
    _1,
    _2,
    _3,
    _4,
    _5,
    _6,
    _7,
    _8,
    _9,
    _10,
    _11;
  var now = (_a = args.now) !== null && _a !== void 0 ? _a : Date.now();
  var entry = args.sessionEntry;
  var resolved = (0, model_selection_js_1.resolveConfiguredModelRef)({
    cfg: {
      agents: {
        defaults: (_b = args.agent) !== null && _b !== void 0 ? _b : {},
      },
    },
    defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
    defaultModel: defaults_js_1.DEFAULT_MODEL,
  });
  var provider =
    (_d =
      (_c = entry === null || entry === void 0 ? void 0 : entry.providerOverride) !== null &&
      _c !== void 0
        ? _c
        : resolved.provider) !== null && _d !== void 0
      ? _d
      : defaults_js_1.DEFAULT_PROVIDER;
  var model =
    (_f =
      (_e = entry === null || entry === void 0 ? void 0 : entry.modelOverride) !== null &&
      _e !== void 0
        ? _e
        : resolved.model) !== null && _f !== void 0
      ? _f
      : defaults_js_1.DEFAULT_MODEL;
  var contextTokens =
    (_k =
      (_j =
        (_g = entry === null || entry === void 0 ? void 0 : entry.contextTokens) !== null &&
        _g !== void 0
          ? _g
          : (_h = args.agent) === null || _h === void 0
            ? void 0
            : _h.contextTokens) !== null && _j !== void 0
        ? _j
        : (0, context_js_1.lookupContextTokens)(model)) !== null && _k !== void 0
      ? _k
      : defaults_js_1.DEFAULT_CONTEXT_TOKENS;
  var inputTokens = entry === null || entry === void 0 ? void 0 : entry.inputTokens;
  var outputTokens = entry === null || entry === void 0 ? void 0 : entry.outputTokens;
  var totalTokens =
    (_l = entry === null || entry === void 0 ? void 0 : entry.totalTokens) !== null && _l !== void 0
      ? _l
      : ((_m = entry === null || entry === void 0 ? void 0 : entry.inputTokens) !== null &&
        _m !== void 0
          ? _m
          : 0) +
        ((_o = entry === null || entry === void 0 ? void 0 : entry.outputTokens) !== null &&
        _o !== void 0
          ? _o
          : 0);
  // Prefer prompt-size tokens from the session transcript when it looks larger
  // (cached prompt tokens are often missing from agent meta/store).
  if (args.includeTranscriptUsage) {
    var logUsage = readUsageFromSessionLog(
      entry === null || entry === void 0 ? void 0 : entry.sessionId,
      entry,
    );
    if (logUsage) {
      var candidate = logUsage.promptTokens || logUsage.total;
      if (!totalTokens || totalTokens === 0 || candidate > totalTokens) {
        totalTokens = candidate;
      }
      if (!model) {
        model = (_p = logUsage.model) !== null && _p !== void 0 ? _p : model;
      }
      if (!contextTokens && logUsage.model) {
        contextTokens =
          (_q = (0, context_js_1.lookupContextTokens)(logUsage.model)) !== null && _q !== void 0
            ? _q
            : contextTokens;
      }
      if (!inputTokens || inputTokens === 0) {
        inputTokens = logUsage.input;
      }
      if (!outputTokens || outputTokens === 0) {
        outputTokens = logUsage.output;
      }
    }
  }
  var thinkLevel =
    (_t =
      (_r = args.resolvedThink) !== null && _r !== void 0
        ? _r
        : (_s = args.agent) === null || _s === void 0
          ? void 0
          : _s.thinkingDefault) !== null && _t !== void 0
      ? _t
      : "off";
  var verboseLevel =
    (_w =
      (_u = args.resolvedVerbose) !== null && _u !== void 0
        ? _u
        : (_v = args.agent) === null || _v === void 0
          ? void 0
          : _v.verboseDefault) !== null && _w !== void 0
      ? _w
      : "off";
  var reasoningLevel = (_x = args.resolvedReasoning) !== null && _x !== void 0 ? _x : "off";
  var elevatedLevel =
    (_2 =
      (_0 =
        (_y = args.resolvedElevated) !== null && _y !== void 0
          ? _y
          : (_z = args.sessionEntry) === null || _z === void 0
            ? void 0
            : _z.elevatedLevel) !== null && _0 !== void 0
        ? _0
        : (_1 = args.agent) === null || _1 === void 0
          ? void 0
          : _1.elevatedDefault) !== null && _2 !== void 0
      ? _2
      : "on";
  var runtime = { label: resolveRuntimeLabel(args) };
  var updatedAt = entry === null || entry === void 0 ? void 0 : entry.updatedAt;
  var sessionLine = [
    "Session: ".concat((_3 = args.sessionKey) !== null && _3 !== void 0 ? _3 : "unknown"),
    typeof updatedAt === "number" ? "updated ".concat(formatAge(now - updatedAt)) : "no activity",
  ]
    .filter(Boolean)
    .join(" • ");
  var isGroupSession =
    (entry === null || entry === void 0 ? void 0 : entry.chatType) === "group" ||
    (entry === null || entry === void 0 ? void 0 : entry.chatType) === "channel" ||
    Boolean((_4 = args.sessionKey) === null || _4 === void 0 ? void 0 : _4.includes(":group:")) ||
    Boolean((_5 = args.sessionKey) === null || _5 === void 0 ? void 0 : _5.includes(":channel:"));
  var groupActivationValue = isGroupSession
    ? (_7 =
        (_6 = args.groupActivation) !== null && _6 !== void 0
          ? _6
          : entry === null || entry === void 0
            ? void 0
            : entry.groupActivation) !== null && _7 !== void 0
      ? _7
      : "mention"
    : undefined;
  var contextLine = [
    "Context: ".concat(
      formatTokens(
        totalTokens,
        contextTokens !== null && contextTokens !== void 0 ? contextTokens : null,
      ),
    ),
    "\uD83E\uDDF9 Compactions: ".concat(
      (_8 = entry === null || entry === void 0 ? void 0 : entry.compactionCount) !== null &&
        _8 !== void 0
        ? _8
        : 0,
    ),
  ]
    .filter(Boolean)
    .join(" · ");
  var queueMode =
    (_10 = (_9 = args.queue) === null || _9 === void 0 ? void 0 : _9.mode) !== null &&
    _10 !== void 0
      ? _10
      : "unknown";
  var queueDetails = formatQueueDetails(args.queue);
  var verboseLabel =
    verboseLevel === "full" ? "verbose:full" : verboseLevel === "on" ? "verbose" : null;
  var elevatedLabel =
    elevatedLevel && elevatedLevel !== "off"
      ? elevatedLevel === "on"
        ? "elevated"
        : "elevated:".concat(elevatedLevel)
      : null;
  var optionParts = [
    "Runtime: ".concat(runtime.label),
    "Think: ".concat(thinkLevel),
    verboseLabel,
    reasoningLevel !== "off" ? "Reasoning: ".concat(reasoningLevel) : null,
    elevatedLabel,
  ];
  var optionsLine = optionParts.filter(Boolean).join(" · ");
  var activationParts = [
    groupActivationValue ? "\uD83D\uDC65 Activation: ".concat(groupActivationValue) : null,
    "\uD83E\uDEA2 Queue: ".concat(queueMode).concat(queueDetails),
  ];
  var activationLine = activationParts.filter(Boolean).join(" · ");
  var authMode = (0, model_auth_js_1.resolveModelAuthMode)(provider, args.config);
  var authLabelValue =
    (_11 = args.modelAuth) !== null && _11 !== void 0
      ? _11
      : authMode && authMode !== "unknown"
        ? authMode
        : undefined;
  var showCost = authLabelValue === "api-key" || authLabelValue === "mixed";
  var costConfig = showCost
    ? (0, usage_format_js_1.resolveModelCostConfig)({
        provider: provider,
        model: model,
        config: args.config,
      })
    : undefined;
  var hasUsage = typeof inputTokens === "number" || typeof outputTokens === "number";
  var cost =
    showCost && hasUsage
      ? (0, usage_format_js_1.estimateUsageCost)({
          usage: {
            input: inputTokens !== null && inputTokens !== void 0 ? inputTokens : undefined,
            output: outputTokens !== null && outputTokens !== void 0 ? outputTokens : undefined,
          },
          cost: costConfig,
        })
      : undefined;
  var costLabel = showCost && hasUsage ? (0, usage_format_js_1.formatUsd)(cost) : undefined;
  var modelLabel = model ? "".concat(provider, "/").concat(model) : "unknown";
  var authLabel = authLabelValue ? " \u00B7 \uD83D\uDD11 ".concat(authLabelValue) : "";
  var modelLine = "\uD83E\uDDE0 Model: ".concat(modelLabel).concat(authLabel);
  var commit = (0, git_commit_js_1.resolveCommitHash)();
  var versionLine = "\uD83E\uDD9E OpenClaw "
    .concat(version_js_1.VERSION)
    .concat(commit ? " (".concat(commit, ")") : "");
  var usagePair = formatUsagePair(inputTokens, outputTokens);
  var costLine = costLabel ? "\uD83D\uDCB5 Cost: ".concat(costLabel) : null;
  var usageCostLine =
    usagePair && costLine
      ? "".concat(usagePair, " \u00B7 ").concat(costLine)
      : usagePair !== null && usagePair !== void 0
        ? usagePair
        : costLine;
  var mediaLine = formatMediaUnderstandingLine(args.mediaDecisions);
  var voiceLine = formatVoiceModeLine(args.config, args.sessionEntry);
  return [
    versionLine,
    args.timeLine,
    modelLine,
    usageCostLine,
    "\uD83D\uDCDA ".concat(contextLine),
    mediaLine,
    args.usageLine,
    "\uD83E\uDDF5 ".concat(sessionLine),
    args.subagentsLine,
    "\u2699\uFE0F ".concat(optionsLine),
    voiceLine,
    activationLine,
  ]
    .filter(Boolean)
    .join("\n");
}
var CATEGORY_LABELS = {
  session: "Session",
  options: "Options",
  status: "Status",
  management: "Management",
  media: "Media",
  tools: "Tools",
  docks: "Docks",
};
var CATEGORY_ORDER = ["session", "options", "status", "management", "media", "tools", "docks"];
function groupCommandsByCategory(commands) {
  var _a, _b;
  var grouped = new Map();
  for (var _i = 0, CATEGORY_ORDER_1 = CATEGORY_ORDER; _i < CATEGORY_ORDER_1.length; _i++) {
    var category = CATEGORY_ORDER_1[_i];
    grouped.set(category, []);
  }
  for (var _c = 0, commands_1 = commands; _c < commands_1.length; _c++) {
    var command = commands_1[_c];
    var category = (_a = command.category) !== null && _a !== void 0 ? _a : "tools";
    var list = (_b = grouped.get(category)) !== null && _b !== void 0 ? _b : [];
    list.push(command);
    grouped.set(category, list);
  }
  return grouped;
}
function buildHelpMessage(cfg) {
  var _a, _b;
  var lines = ["ℹ️ Help", ""];
  lines.push("Session");
  lines.push("  /new  |  /reset  |  /compact [instructions]  |  /stop");
  lines.push("");
  var optionParts = ["/think <level>", "/model <id>", "/verbose on|off"];
  if (
    ((_a = cfg === null || cfg === void 0 ? void 0 : cfg.commands) === null || _a === void 0
      ? void 0
      : _a.config) === true
  ) {
    optionParts.push("/config");
  }
  if (
    ((_b = cfg === null || cfg === void 0 ? void 0 : cfg.commands) === null || _b === void 0
      ? void 0
      : _b.debug) === true
  ) {
    optionParts.push("/debug");
  }
  lines.push("Options");
  lines.push("  ".concat(optionParts.join("  |  ")));
  lines.push("");
  lines.push("Status");
  lines.push("  /status  |  /whoami  |  /context");
  lines.push("");
  lines.push("Skills");
  lines.push("  /skill <name> [input]");
  lines.push("");
  lines.push("More: /commands for full list");
  return lines.join("\n");
}
var COMMANDS_PER_PAGE = 8;
function formatCommandEntry(command) {
  var _a;
  var primary = command.nativeName
    ? "/".concat(command.nativeName)
    : ((_a = command.textAliases[0]) === null || _a === void 0 ? void 0 : _a.trim()) ||
      "/".concat(command.key);
  var seen = new Set();
  var aliases = command.textAliases
    .map(function (alias) {
      return alias.trim();
    })
    .filter(Boolean)
    .filter(function (alias) {
      return alias.toLowerCase() !== primary.toLowerCase();
    })
    .filter(function (alias) {
      var key = alias.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  var aliasLabel = aliases.length ? " (".concat(aliases.join(", "), ")") : "";
  var scopeLabel = command.scope === "text" ? " [text]" : "";
  return ""
    .concat(primary)
    .concat(aliasLabel)
    .concat(scopeLabel, " - ")
    .concat(command.description);
}
function buildCommandItems(commands, pluginCommands) {
  var _a;
  var grouped = groupCommandsByCategory(commands);
  var items = [];
  for (var _i = 0, CATEGORY_ORDER_2 = CATEGORY_ORDER; _i < CATEGORY_ORDER_2.length; _i++) {
    var category = CATEGORY_ORDER_2[_i];
    var categoryCommands = (_a = grouped.get(category)) !== null && _a !== void 0 ? _a : [];
    if (categoryCommands.length === 0) {
      continue;
    }
    var label = CATEGORY_LABELS[category];
    for (var _b = 0, categoryCommands_1 = categoryCommands; _b < categoryCommands_1.length; _b++) {
      var command = categoryCommands_1[_b];
      items.push({ label: label, text: formatCommandEntry(command) });
    }
  }
  for (var _c = 0, pluginCommands_1 = pluginCommands; _c < pluginCommands_1.length; _c++) {
    var command = pluginCommands_1[_c];
    var pluginLabel = command.pluginId ? " (".concat(command.pluginId, ")") : "";
    items.push({
      label: "Plugins",
      text: "/".concat(command.name).concat(pluginLabel, " - ").concat(command.description),
    });
  }
  return items;
}
function formatCommandList(items) {
  var lines = [];
  var currentLabel = null;
  for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
    var item = items_1[_i];
    if (item.label !== currentLabel) {
      if (lines.length > 0) {
        lines.push("");
      }
      lines.push(item.label);
      currentLabel = item.label;
    }
    lines.push("  ".concat(item.text));
  }
  return lines.join("\n");
}
function buildCommandsMessage(cfg, skillCommands, options) {
  var result = buildCommandsMessagePaginated(cfg, skillCommands, options);
  return result.text;
}
function buildCommandsMessagePaginated(cfg, skillCommands, options) {
  var _a, _b;
  var page = Math.max(
    1,
    (_a = options === null || options === void 0 ? void 0 : options.page) !== null && _a !== void 0
      ? _a
      : 1,
  );
  var surface =
    (_b = options === null || options === void 0 ? void 0 : options.surface) === null ||
    _b === void 0
      ? void 0
      : _b.toLowerCase();
  var isTelegram = surface === "telegram";
  var commands = cfg
    ? (0, commands_registry_js_1.listChatCommandsForConfig)(cfg, { skillCommands: skillCommands })
    : (0, commands_registry_js_1.listChatCommands)({ skillCommands: skillCommands });
  var pluginCommands = (0, commands_js_1.listPluginCommands)();
  var items = buildCommandItems(commands, pluginCommands);
  if (!isTelegram) {
    var lines_2 = ["ℹ️ Slash commands", ""];
    lines_2.push(formatCommandList(items));
    return {
      text: lines_2.join("\n").trim(),
      totalPages: 1,
      currentPage: 1,
      hasNext: false,
      hasPrev: false,
    };
  }
  var totalCommands = items.length;
  var totalPages = Math.max(1, Math.ceil(totalCommands / COMMANDS_PER_PAGE));
  var currentPage = Math.min(page, totalPages);
  var startIndex = (currentPage - 1) * COMMANDS_PER_PAGE;
  var endIndex = startIndex + COMMANDS_PER_PAGE;
  var pageItems = items.slice(startIndex, endIndex);
  var lines = ["\u2139\uFE0F Commands (".concat(currentPage, "/").concat(totalPages, ")"), ""];
  lines.push(formatCommandList(pageItems));
  return {
    text: lines.join("\n").trim(),
    totalPages: totalPages,
    currentPage: currentPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}
