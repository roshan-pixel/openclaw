"use strict";
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
exports.resolveElevatedPermissions = resolveElevatedPermissions;
exports.formatElevatedUnavailableMessage = formatElevatedUnavailableMessage;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var dock_js_1 = require("../../channels/dock.js");
var index_js_1 = require("../../channels/plugins/index.js");
var registry_js_1 = require("../../channels/registry.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var command_format_js_1 = require("../../cli/command-format.js");
function normalizeAllowToken(value) {
  if (!value) {
    return "";
  }
  return value.trim().toLowerCase();
}
function slugAllowToken(value) {
  if (!value) {
    return "";
  }
  var text = value.trim().toLowerCase();
  if (!text) {
    return "";
  }
  text = text.replace(/^[@#]+/, "");
  text = text.replace(/[\s_]+/g, "-");
  text = text.replace(/[^a-z0-9-]+/g, "-");
  return text.replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
}
var SENDER_PREFIXES = __spreadArray(
  __spreadArray([], registry_js_1.CHAT_CHANNEL_ORDER, true),
  [message_channel_js_1.INTERNAL_MESSAGE_CHANNEL, "user", "group", "channel"],
  false,
);
var SENDER_PREFIX_RE = new RegExp("^(".concat(SENDER_PREFIXES.join("|"), "):"), "i");
function stripSenderPrefix(value) {
  if (!value) {
    return "";
  }
  var trimmed = value.trim();
  return trimmed.replace(SENDER_PREFIX_RE, "");
}
function resolveElevatedAllowList(allowFrom, provider, fallbackAllowFrom) {
  if (!allowFrom) {
    return fallbackAllowFrom;
  }
  var value = allowFrom[provider];
  return Array.isArray(value) ? value : fallbackAllowFrom;
}
function isApprovedElevatedSender(params) {
  var rawAllow = resolveElevatedAllowList(
    params.allowFrom,
    params.provider,
    params.fallbackAllowFrom,
  );
  if (!rawAllow || rawAllow.length === 0) {
    return false;
  }
  var allowTokens = rawAllow
    .map(function (entry) {
      return String(entry).trim();
    })
    .filter(Boolean);
  if (allowTokens.length === 0) {
    return false;
  }
  if (
    allowTokens.some(function (entry) {
      return entry === "*";
    })
  ) {
    return true;
  }
  var tokens = new Set();
  var addToken = function (value) {
    if (!value) {
      return;
    }
    var trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    tokens.add(trimmed);
    var normalized = normalizeAllowToken(trimmed);
    if (normalized) {
      tokens.add(normalized);
    }
    var slugged = slugAllowToken(trimmed);
    if (slugged) {
      tokens.add(slugged);
    }
  };
  addToken(params.ctx.SenderName);
  addToken(params.ctx.SenderUsername);
  addToken(params.ctx.SenderTag);
  addToken(params.ctx.SenderE164);
  addToken(params.ctx.From);
  addToken(stripSenderPrefix(params.ctx.From));
  addToken(params.ctx.To);
  addToken(stripSenderPrefix(params.ctx.To));
  for (var _i = 0, allowTokens_1 = allowTokens; _i < allowTokens_1.length; _i++) {
    var rawEntry = allowTokens_1[_i];
    var entry = rawEntry.trim();
    if (!entry) {
      continue;
    }
    var stripped = stripSenderPrefix(entry);
    if (tokens.has(entry) || tokens.has(stripped)) {
      return true;
    }
    var normalized = normalizeAllowToken(stripped);
    if (normalized && tokens.has(normalized)) {
      return true;
    }
    var slugged = slugAllowToken(stripped);
    if (slugged && tokens.has(slugged)) {
      return true;
    }
  }
  return false;
}
function resolveElevatedPermissions(params) {
  var _a, _b, _c, _d, _e, _f;
  var globalConfig = (_a = params.cfg.tools) === null || _a === void 0 ? void 0 : _a.elevated;
  var agentConfig =
    (_c =
      (_b = (0, agent_scope_js_1.resolveAgentConfig)(params.cfg, params.agentId)) === null ||
      _b === void 0
        ? void 0
        : _b.tools) === null || _c === void 0
      ? void 0
      : _c.elevated;
  var globalEnabled =
    (globalConfig === null || globalConfig === void 0 ? void 0 : globalConfig.enabled) !== false;
  var agentEnabled =
    (agentConfig === null || agentConfig === void 0 ? void 0 : agentConfig.enabled) !== false;
  var enabled = globalEnabled && agentEnabled;
  var failures = [];
  if (!globalEnabled) {
    failures.push({ gate: "enabled", key: "tools.elevated.enabled" });
  }
  if (!agentEnabled) {
    failures.push({
      gate: "enabled",
      key: "agents.list[].tools.elevated.enabled",
    });
  }
  if (!enabled) {
    return { enabled: enabled, allowed: false, failures: failures };
  }
  if (!params.provider) {
    failures.push({ gate: "provider", key: "ctx.Provider" });
    return { enabled: enabled, allowed: false, failures: failures };
  }
  var normalizedProvider = (0, index_js_1.normalizeChannelId)(params.provider);
  var dockFallbackAllowFrom = normalizedProvider
    ? (_f =
        (_e =
          (_d = (0, dock_js_1.getChannelDock)(normalizedProvider)) === null || _d === void 0
            ? void 0
            : _d.elevated) === null || _e === void 0
          ? void 0
          : _e.allowFromFallback) === null || _f === void 0
      ? void 0
      : _f.call(_e, {
          cfg: params.cfg,
          accountId: params.ctx.AccountId,
        })
    : undefined;
  var fallbackAllowFrom = dockFallbackAllowFrom;
  var globalAllowed = isApprovedElevatedSender({
    provider: params.provider,
    ctx: params.ctx,
    allowFrom: globalConfig === null || globalConfig === void 0 ? void 0 : globalConfig.allowFrom,
    fallbackAllowFrom: fallbackAllowFrom,
  });
  if (!globalAllowed) {
    failures.push({
      gate: "allowFrom",
      key: "tools.elevated.allowFrom.".concat(params.provider),
    });
    return { enabled: enabled, allowed: false, failures: failures };
  }
  var agentAllowed = (
    agentConfig === null || agentConfig === void 0 ? void 0 : agentConfig.allowFrom
  )
    ? isApprovedElevatedSender({
        provider: params.provider,
        ctx: params.ctx,
        allowFrom: agentConfig.allowFrom,
        fallbackAllowFrom: fallbackAllowFrom,
      })
    : true;
  if (!agentAllowed) {
    failures.push({
      gate: "allowFrom",
      key: "agents.list[].tools.elevated.allowFrom.".concat(params.provider),
    });
  }
  return { enabled: enabled, allowed: globalAllowed && agentAllowed, failures: failures };
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
