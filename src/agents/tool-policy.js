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
exports.TOOL_GROUPS = void 0;
exports.normalizeToolName = normalizeToolName;
exports.normalizeToolList = normalizeToolList;
exports.expandToolGroups = expandToolGroups;
exports.collectExplicitAllowlist = collectExplicitAllowlist;
exports.buildPluginToolGroups = buildPluginToolGroups;
exports.expandPluginGroups = expandPluginGroups;
exports.expandPolicyWithPluginGroups = expandPolicyWithPluginGroups;
exports.stripPluginOnlyAllowlist = stripPluginOnlyAllowlist;
exports.resolveToolProfilePolicy = resolveToolProfilePolicy;
var TOOL_NAME_ALIASES = {
  bash: "exec",
  "apply-patch": "apply_patch",
};
exports.TOOL_GROUPS = {
  // NOTE: Keep canonical (lowercase) tool names here.
  "group:memory": ["memory_search", "memory_get"],
  "group:web": ["web_search", "web_fetch"],
  // Basic workspace/file tools
  "group:fs": ["read", "write", "edit", "apply_patch"],
  // Host/runtime execution tools
  "group:runtime": ["exec", "process"],
  // Session management tools
  "group:sessions": [
    "sessions_list",
    "sessions_history",
    "sessions_send",
    "sessions_spawn",
    "session_status",
  ],
  // UI helpers
  "group:ui": ["browser", "canvas"],
  // Automation + infra
  "group:automation": ["cron", "gateway"],
  // Messaging surface
  "group:messaging": ["message"],
  // Nodes + device tools
  "group:nodes": ["nodes"],
  // All OpenClaw native tools (excludes provider plugins).
  "group:openclaw": [
    "browser",
    "canvas",
    "nodes",
    "cron",
    "message",
    "gateway",
    "agents_list",
    "sessions_list",
    "sessions_history",
    "sessions_send",
    "sessions_spawn",
    "session_status",
    "memory_search",
    "memory_get",
    "web_search",
    "web_fetch",
    "image",
  ],
};
var TOOL_PROFILES = {
  minimal: {
    allow: ["session_status"],
  },
  coding: {
    allow: ["group:fs", "group:runtime", "group:sessions", "group:memory", "image"],
  },
  messaging: {
    allow: [
      "group:messaging",
      "sessions_list",
      "sessions_history",
      "sessions_send",
      "session_status",
    ],
  },
  full: {},
};
function normalizeToolName(name) {
  var _a;
  var normalized = name.trim().toLowerCase();
  return (_a = TOOL_NAME_ALIASES[normalized]) !== null && _a !== void 0 ? _a : normalized;
}
function normalizeToolList(list) {
  if (!list) {
    return [];
  }
  return list.map(normalizeToolName).filter(Boolean);
}
function expandToolGroups(list) {
  var normalized = normalizeToolList(list);
  var expanded = [];
  for (var _i = 0, normalized_1 = normalized; _i < normalized_1.length; _i++) {
    var value = normalized_1[_i];
    var group = exports.TOOL_GROUPS[value];
    if (group) {
      expanded.push.apply(expanded, group);
      continue;
    }
    expanded.push(value);
  }
  return Array.from(new Set(expanded));
}
function collectExplicitAllowlist(policies) {
  var entries = [];
  for (var _i = 0, policies_1 = policies; _i < policies_1.length; _i++) {
    var policy = policies_1[_i];
    if (!(policy === null || policy === void 0 ? void 0 : policy.allow)) {
      continue;
    }
    for (var _a = 0, _b = policy.allow; _a < _b.length; _a++) {
      var value = _b[_a];
      if (typeof value !== "string") {
        continue;
      }
      var trimmed = value.trim();
      if (trimmed) {
        entries.push(trimmed);
      }
    }
  }
  return entries;
}
function buildPluginToolGroups(params) {
  var _a;
  var all = [];
  var byPlugin = new Map();
  for (var _i = 0, _b = params.tools; _i < _b.length; _i++) {
    var tool = _b[_i];
    var meta = params.toolMeta(tool);
    if (!meta) {
      continue;
    }
    var name_1 = normalizeToolName(tool.name);
    all.push(name_1);
    var pluginId = meta.pluginId.toLowerCase();
    var list = (_a = byPlugin.get(pluginId)) !== null && _a !== void 0 ? _a : [];
    list.push(name_1);
    byPlugin.set(pluginId, list);
  }
  return { all: all, byPlugin: byPlugin };
}
function expandPluginGroups(list, groups) {
  if (!list || list.length === 0) {
    return list;
  }
  var expanded = [];
  for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
    var entry = list_1[_i];
    var normalized = normalizeToolName(entry);
    if (normalized === "group:plugins") {
      if (groups.all.length > 0) {
        expanded.push.apply(expanded, groups.all);
      } else {
        expanded.push(normalized);
      }
      continue;
    }
    var tools = groups.byPlugin.get(normalized);
    if (tools && tools.length > 0) {
      expanded.push.apply(expanded, tools);
      continue;
    }
    expanded.push(normalized);
  }
  return Array.from(new Set(expanded));
}
function expandPolicyWithPluginGroups(policy, groups) {
  if (!policy) {
    return undefined;
  }
  return {
    allow: expandPluginGroups(policy.allow, groups),
    deny: expandPluginGroups(policy.deny, groups),
  };
}
function stripPluginOnlyAllowlist(policy, groups, coreTools) {
  if (
    !(policy === null || policy === void 0 ? void 0 : policy.allow) ||
    policy.allow.length === 0
  ) {
    return { policy: policy, unknownAllowlist: [], strippedAllowlist: false };
  }
  var normalized = normalizeToolList(policy.allow);
  if (normalized.length === 0) {
    return { policy: policy, unknownAllowlist: [], strippedAllowlist: false };
  }
  var pluginIds = new Set(groups.byPlugin.keys());
  var pluginTools = new Set(groups.all);
  var unknownAllowlist = [];
  var hasCoreEntry = false;
  for (var _i = 0, normalized_2 = normalized; _i < normalized_2.length; _i++) {
    var entry = normalized_2[_i];
    var isPluginEntry = entry === "group:plugins" || pluginIds.has(entry) || pluginTools.has(entry);
    var expanded = expandToolGroups([entry]);
    var isCoreEntry = expanded.some(function (tool) {
      return coreTools.has(tool);
    });
    if (isCoreEntry) {
      hasCoreEntry = true;
    }
    if (!isCoreEntry && !isPluginEntry) {
      unknownAllowlist.push(entry);
    }
  }
  var strippedAllowlist = !hasCoreEntry;
  // When an allowlist contains only plugin tools, we strip it to avoid accidentally
  // disabling core tools. Users who want additive behavior should prefer `tools.alsoAllow`.
  if (strippedAllowlist) {
    // Note: logging happens in the caller (pi-tools/tools-invoke) after this function returns.
    // We keep this note here for future maintainers.
  }
  return {
    policy: strippedAllowlist ? __assign(__assign({}, policy), { allow: undefined }) : policy,
    unknownAllowlist: Array.from(new Set(unknownAllowlist)),
    strippedAllowlist: strippedAllowlist,
  };
}
function resolveToolProfilePolicy(profile) {
  if (!profile) {
    return undefined;
  }
  var resolved = TOOL_PROFILES[profile];
  if (!resolved) {
    return undefined;
  }
  if (!resolved.allow && !resolved.deny) {
    return undefined;
  }
  return {
    allow: resolved.allow ? __spreadArray([], resolved.allow, true) : undefined,
    deny: resolved.deny ? __spreadArray([], resolved.deny, true) : undefined,
  };
}
