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
exports.resolveSubagentToolPolicy = resolveSubagentToolPolicy;
exports.isToolAllowedByPolicyName = isToolAllowedByPolicyName;
exports.filterToolsByPolicy = filterToolsByPolicy;
exports.resolveEffectiveToolPolicy = resolveEffectiveToolPolicy;
exports.resolveGroupToolPolicy = resolveGroupToolPolicy;
exports.isToolAllowedByPolicies = isToolAllowedByPolicies;
var dock_js_1 = require("../channels/dock.js");
var group_policy_js_1 = require("../config/group-policy.js");
var agent_scope_js_1 = require("./agent-scope.js");
var tool_policy_js_1 = require("./tool-policy.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var session_key_utils_js_1 = require("../sessions/session-key-utils.js");
function compilePattern(pattern) {
  var normalized = (0, tool_policy_js_1.normalizeToolName)(pattern);
  if (!normalized) {
    return { kind: "exact", value: "" };
  }
  if (normalized === "*") {
    return { kind: "all" };
  }
  if (!normalized.includes("*")) {
    return { kind: "exact", value: normalized };
  }
  var escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return {
    kind: "regex",
    value: new RegExp("^".concat(escaped.replaceAll("\\*", ".*"), "$")),
  };
}
function compilePatterns(patterns) {
  if (!Array.isArray(patterns)) {
    return [];
  }
  return (0, tool_policy_js_1.expandToolGroups)(patterns)
    .map(compilePattern)
    .filter(function (pattern) {
      return pattern.kind !== "exact" || pattern.value;
    });
}
function matchesAny(name, patterns) {
  for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
    var pattern = patterns_1[_i];
    if (pattern.kind === "all") {
      return true;
    }
    if (pattern.kind === "exact" && name === pattern.value) {
      return true;
    }
    if (pattern.kind === "regex" && pattern.value.test(name)) {
      return true;
    }
  }
  return false;
}
function makeToolPolicyMatcher(policy) {
  var deny = compilePatterns(policy.deny);
  var allow = compilePatterns(policy.allow);
  return function (name) {
    var normalized = (0, tool_policy_js_1.normalizeToolName)(name);
    if (matchesAny(normalized, deny)) {
      return false;
    }
    if (allow.length === 0) {
      return true;
    }
    if (matchesAny(normalized, allow)) {
      return true;
    }
    if (normalized === "apply_patch" && matchesAny("exec", allow)) {
      return true;
    }
    return false;
  };
}
var DEFAULT_SUBAGENT_TOOL_DENY = [
  // Session management - main agent orchestrates
  "sessions_list",
  "sessions_history",
  "sessions_send",
  "sessions_spawn",
  // System admin - dangerous from subagent
  "gateway",
  "agents_list",
  // Interactive setup - not a task
  "whatsapp_login",
  // Status/scheduling - main agent coordinates
  "session_status",
  "cron",
  // Memory - pass relevant info in spawn prompt instead
  "memory_search",
  "memory_get",
];
function resolveSubagentToolPolicy(cfg) {
  var _a, _b;
  var configured =
    (_b =
      (_a = cfg === null || cfg === void 0 ? void 0 : cfg.tools) === null || _a === void 0
        ? void 0
        : _a.subagents) === null || _b === void 0
      ? void 0
      : _b.tools;
  var deny = __spreadArray(
    __spreadArray([], DEFAULT_SUBAGENT_TOOL_DENY, true),
    Array.isArray(configured === null || configured === void 0 ? void 0 : configured.deny)
      ? configured.deny
      : [],
    true,
  );
  var allow = Array.isArray(
    configured === null || configured === void 0 ? void 0 : configured.allow,
  )
    ? configured.allow
    : undefined;
  return { allow: allow, deny: deny };
}
function isToolAllowedByPolicyName(name, policy) {
  if (!policy) {
    return true;
  }
  return makeToolPolicyMatcher(policy)(name);
}
function filterToolsByPolicy(tools, policy) {
  if (!policy) {
    return tools;
  }
  var matcher = makeToolPolicyMatcher(policy);
  return tools.filter(function (tool) {
    return matcher(tool.name);
  });
}
function unionAllow(base, extra) {
  if (!Array.isArray(extra) || extra.length === 0) {
    return base;
  }
  // If the user is using alsoAllow without an allowlist, treat it as additive on top of
  // an implicit allow-all policy.
  if (!Array.isArray(base) || base.length === 0) {
    return Array.from(new Set(__spreadArray(["*"], extra, true)));
  }
  return Array.from(new Set(__spreadArray(__spreadArray([], base, true), extra, true)));
}
function pickToolPolicy(config) {
  if (!config) {
    return undefined;
  }
  var allow = Array.isArray(config.allow)
    ? unionAllow(config.allow, config.alsoAllow)
    : Array.isArray(config.alsoAllow) && config.alsoAllow.length > 0
      ? unionAllow(undefined, config.alsoAllow)
      : undefined;
  var deny = Array.isArray(config.deny) ? config.deny : undefined;
  if (!allow && !deny) {
    return undefined;
  }
  return { allow: allow, deny: deny };
}
function normalizeProviderKey(value) {
  return value.trim().toLowerCase();
}
function resolveGroupContextFromSessionKey(sessionKey) {
  var _a;
  var raw = (sessionKey !== null && sessionKey !== void 0 ? sessionKey : "").trim();
  if (!raw) {
    return {};
  }
  var base =
    (_a = (0, session_key_utils_js_1.resolveThreadParentSessionKey)(raw)) !== null && _a !== void 0
      ? _a
      : raw;
  var parts = base.split(":").filter(Boolean);
  var body = parts[0] === "agent" ? parts.slice(2) : parts;
  if (body[0] === "subagent") {
    body = body.slice(1);
  }
  if (body.length < 3) {
    return {};
  }
  var channel = body[0],
    kind = body[1],
    rest = body.slice(2);
  if (kind !== "group" && kind !== "channel") {
    return {};
  }
  var groupId = rest.join(":").trim();
  if (!groupId) {
    return {};
  }
  return { channel: channel.trim().toLowerCase(), groupId: groupId };
}
function resolveProviderToolPolicy(params) {
  var _a, _b;
  var provider = (_a = params.modelProvider) === null || _a === void 0 ? void 0 : _a.trim();
  if (!provider || !params.byProvider) {
    return undefined;
  }
  var entries = Object.entries(params.byProvider);
  if (entries.length === 0) {
    return undefined;
  }
  var lookup = new Map();
  for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
    var _c = entries_1[_i],
      key = _c[0],
      value = _c[1];
    var normalized = normalizeProviderKey(key);
    if (!normalized) {
      continue;
    }
    lookup.set(normalized, value);
  }
  var normalizedProvider = normalizeProviderKey(provider);
  var rawModelId =
    (_b = params.modelId) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase();
  var fullModelId =
    rawModelId && !rawModelId.includes("/")
      ? "".concat(normalizedProvider, "/").concat(rawModelId)
      : rawModelId;
  var candidates = __spreadArray(
    __spreadArray([], fullModelId ? [fullModelId] : [], true),
    [normalizedProvider],
    false,
  );
  for (var _d = 0, candidates_1 = candidates; _d < candidates_1.length; _d++) {
    var key = candidates_1[_d];
    var match = lookup.get(key);
    if (match) {
      return match;
    }
  }
  return undefined;
}
function resolveEffectiveToolPolicy(params) {
  var _a, _b, _c;
  var agentId = params.sessionKey
    ? (0, agent_scope_js_1.resolveAgentIdFromSessionKey)(params.sessionKey)
    : undefined;
  var agentConfig =
    params.config && agentId
      ? (0, agent_scope_js_1.resolveAgentConfig)(params.config, agentId)
      : undefined;
  var agentTools = agentConfig === null || agentConfig === void 0 ? void 0 : agentConfig.tools;
  var globalTools = (_a = params.config) === null || _a === void 0 ? void 0 : _a.tools;
  var profile =
    (_b = agentTools === null || agentTools === void 0 ? void 0 : agentTools.profile) !== null &&
    _b !== void 0
      ? _b
      : globalTools === null || globalTools === void 0
        ? void 0
        : globalTools.profile;
  var providerPolicy = resolveProviderToolPolicy({
    byProvider: globalTools === null || globalTools === void 0 ? void 0 : globalTools.byProvider,
    modelProvider: params.modelProvider,
    modelId: params.modelId,
  });
  var agentProviderPolicy = resolveProviderToolPolicy({
    byProvider: agentTools === null || agentTools === void 0 ? void 0 : agentTools.byProvider,
    modelProvider: params.modelProvider,
    modelId: params.modelId,
  });
  return {
    agentId: agentId,
    globalPolicy: pickToolPolicy(globalTools),
    globalProviderPolicy: pickToolPolicy(providerPolicy),
    agentPolicy: pickToolPolicy(agentTools),
    agentProviderPolicy: pickToolPolicy(agentProviderPolicy),
    profile: profile,
    providerProfile:
      (_c =
        agentProviderPolicy === null || agentProviderPolicy === void 0
          ? void 0
          : agentProviderPolicy.profile) !== null && _c !== void 0
        ? _c
        : providerPolicy === null || providerPolicy === void 0
          ? void 0
          : providerPolicy.profile,
    // alsoAllow is applied at the profile stage (to avoid being filtered out early).
    profileAlsoAllow: Array.isArray(
      agentTools === null || agentTools === void 0 ? void 0 : agentTools.alsoAllow,
    )
      ? agentTools === null || agentTools === void 0
        ? void 0
        : agentTools.alsoAllow
      : Array.isArray(
            globalTools === null || globalTools === void 0 ? void 0 : globalTools.alsoAllow,
          )
        ? globalTools === null || globalTools === void 0
          ? void 0
          : globalTools.alsoAllow
        : undefined,
    providerProfileAlsoAllow: Array.isArray(
      agentProviderPolicy === null || agentProviderPolicy === void 0
        ? void 0
        : agentProviderPolicy.alsoAllow,
    )
      ? agentProviderPolicy === null || agentProviderPolicy === void 0
        ? void 0
        : agentProviderPolicy.alsoAllow
      : Array.isArray(
            providerPolicy === null || providerPolicy === void 0
              ? void 0
              : providerPolicy.alsoAllow,
          )
        ? providerPolicy === null || providerPolicy === void 0
          ? void 0
          : providerPolicy.alsoAllow
        : undefined,
  };
}
function resolveGroupToolPolicy(params) {
  var _a, _b, _c, _d, _e, _f, _g;
  if (!params.config) {
    return undefined;
  }
  var sessionContext = resolveGroupContextFromSessionKey(params.sessionKey);
  var spawnedContext = resolveGroupContextFromSessionKey(params.spawnedBy);
  var groupId =
    (_b = (_a = params.groupId) !== null && _a !== void 0 ? _a : sessionContext.groupId) !== null &&
    _b !== void 0
      ? _b
      : spawnedContext.groupId;
  if (!groupId) {
    return undefined;
  }
  var channelRaw =
    (_d = (_c = params.messageProvider) !== null && _c !== void 0 ? _c : sessionContext.channel) !==
      null && _d !== void 0
      ? _d
      : spawnedContext.channel;
  var channel = (0, message_channel_js_1.normalizeMessageChannel)(channelRaw);
  if (!channel) {
    return undefined;
  }
  var dock;
  try {
    dock = (0, dock_js_1.getChannelDock)(channel);
  } catch (_h) {
    dock = undefined;
  }
  var toolsConfig =
    (_g =
      (_f =
        (_e = dock === null || dock === void 0 ? void 0 : dock.groups) === null || _e === void 0
          ? void 0
          : _e.resolveToolPolicy) === null || _f === void 0
        ? void 0
        : _f.call(_e, {
            cfg: params.config,
            groupId: groupId,
            groupChannel: params.groupChannel,
            groupSpace: params.groupSpace,
            accountId: params.accountId,
            senderId: params.senderId,
            senderName: params.senderName,
            senderUsername: params.senderUsername,
            senderE164: params.senderE164,
          })) !== null && _g !== void 0
      ? _g
      : (0, group_policy_js_1.resolveChannelGroupToolsPolicy)({
          cfg: params.config,
          channel: channel,
          groupId: groupId,
          accountId: params.accountId,
          senderId: params.senderId,
          senderName: params.senderName,
          senderUsername: params.senderUsername,
          senderE164: params.senderE164,
        });
  return pickToolPolicy(toolsConfig);
}
function isToolAllowedByPolicies(name, policies) {
  return policies.every(function (policy) {
    return isToolAllowedByPolicyName(name, policy);
  });
}
