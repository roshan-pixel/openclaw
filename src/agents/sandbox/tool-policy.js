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
exports.isToolAllowed = isToolAllowed;
exports.resolveSandboxToolPolicyForAgent = resolveSandboxToolPolicyForAgent;
var agent_scope_js_1 = require("../agent-scope.js");
var tool_policy_js_1 = require("../tool-policy.js");
var constants_js_1 = require("./constants.js");
function compilePattern(pattern) {
  var normalized = pattern.trim().toLowerCase();
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
function isToolAllowed(policy, name) {
  var normalized = name.trim().toLowerCase();
  var deny = compilePatterns(policy.deny);
  if (matchesAny(normalized, deny)) {
    return false;
  }
  var allow = compilePatterns(policy.allow);
  if (allow.length === 0) {
    return true;
  }
  return matchesAny(normalized, allow);
}
function resolveSandboxToolPolicyForAgent(cfg, agentId) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
  var agentConfig =
    cfg && agentId ? (0, agent_scope_js_1.resolveAgentConfig)(cfg, agentId) : undefined;
  var agentAllow =
    (_c =
      (_b =
        (_a = agentConfig === null || agentConfig === void 0 ? void 0 : agentConfig.tools) ===
          null || _a === void 0
          ? void 0
          : _a.sandbox) === null || _b === void 0
        ? void 0
        : _b.tools) === null || _c === void 0
      ? void 0
      : _c.allow;
  var agentDeny =
    (_f =
      (_e =
        (_d = agentConfig === null || agentConfig === void 0 ? void 0 : agentConfig.tools) ===
          null || _d === void 0
          ? void 0
          : _d.sandbox) === null || _e === void 0
        ? void 0
        : _e.tools) === null || _f === void 0
      ? void 0
      : _f.deny;
  var globalAllow =
    (_j =
      (_h =
        (_g = cfg === null || cfg === void 0 ? void 0 : cfg.tools) === null || _g === void 0
          ? void 0
          : _g.sandbox) === null || _h === void 0
        ? void 0
        : _h.tools) === null || _j === void 0
      ? void 0
      : _j.allow;
  var globalDeny =
    (_m =
      (_l =
        (_k = cfg === null || cfg === void 0 ? void 0 : cfg.tools) === null || _k === void 0
          ? void 0
          : _k.sandbox) === null || _l === void 0
        ? void 0
        : _l.tools) === null || _m === void 0
      ? void 0
      : _m.deny;
  var allowSource = Array.isArray(agentAllow)
    ? {
        source: "agent",
        key: "agents.list[].tools.sandbox.tools.allow",
      }
    : Array.isArray(globalAllow)
      ? {
          source: "global",
          key: "tools.sandbox.tools.allow",
        }
      : {
          source: "default",
          key: "tools.sandbox.tools.allow",
        };
  var denySource = Array.isArray(agentDeny)
    ? {
        source: "agent",
        key: "agents.list[].tools.sandbox.tools.deny",
      }
    : Array.isArray(globalDeny)
      ? {
          source: "global",
          key: "tools.sandbox.tools.deny",
        }
      : {
          source: "default",
          key: "tools.sandbox.tools.deny",
        };
  var deny = Array.isArray(agentDeny)
    ? agentDeny
    : Array.isArray(globalDeny)
      ? globalDeny
      : __spreadArray([], constants_js_1.DEFAULT_TOOL_DENY, true);
  var allow = Array.isArray(agentAllow)
    ? agentAllow
    : Array.isArray(globalAllow)
      ? globalAllow
      : __spreadArray([], constants_js_1.DEFAULT_TOOL_ALLOW, true);
  var expandedDeny = (0, tool_policy_js_1.expandToolGroups)(deny);
  var expandedAllow = (0, tool_policy_js_1.expandToolGroups)(allow);
  // `image` is essential for multimodal workflows; always include it in sandboxed
  // sessions unless explicitly denied.
  if (
    !expandedDeny
      .map(function (v) {
        return v.toLowerCase();
      })
      .includes("image") &&
    !expandedAllow
      .map(function (v) {
        return v.toLowerCase();
      })
      .includes("image")
  ) {
    expandedAllow = __spreadArray(__spreadArray([], expandedAllow, true), ["image"], false);
  }
  return {
    allow: expandedAllow,
    deny: expandedDeny,
    sources: {
      allow: allowSource,
      deny: denySource,
    },
  };
}
