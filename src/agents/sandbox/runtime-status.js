"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSandboxRuntimeStatus = resolveSandboxRuntimeStatus;
exports.formatSandboxToolPolicyBlockedMessage = formatSandboxToolPolicyBlockedMessage;
var sessions_js_1 = require("../../config/sessions.js");
var agent_scope_js_1 = require("../agent-scope.js");
var tool_policy_js_1 = require("../tool-policy.js");
var command_format_js_1 = require("../../cli/command-format.js");
var config_js_1 = require("./config.js");
var tool_policy_js_2 = require("./tool-policy.js");
function shouldSandboxSession(cfg, sessionKey, mainSessionKey) {
  if (cfg.mode === "off") {
    return false;
  }
  if (cfg.mode === "all") {
    return true;
  }
  return sessionKey.trim() !== mainSessionKey.trim();
}
function resolveMainSessionKeyForSandbox(params) {
  var _a, _b;
  if (
    ((_b = (_a = params.cfg) === null || _a === void 0 ? void 0 : _a.session) === null ||
    _b === void 0
      ? void 0
      : _b.scope) === "global"
  ) {
    return "global";
  }
  return (0, sessions_js_1.resolveAgentMainSessionKey)({
    cfg: params.cfg,
    agentId: params.agentId,
  });
}
function resolveComparableSessionKeyForSandbox(params) {
  return (0, sessions_js_1.canonicalizeMainSessionAlias)({
    cfg: params.cfg,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
  });
}
function resolveSandboxRuntimeStatus(params) {
  var _a, _b;
  var sessionKey =
    (_b = (_a = params.sessionKey) === null || _a === void 0 ? void 0 : _a.trim()) !== null &&
    _b !== void 0
      ? _b
      : "";
  var agentId = (0, agent_scope_js_1.resolveSessionAgentId)({
    sessionKey: sessionKey,
    config: params.cfg,
  });
  var cfg = params.cfg;
  var sandboxCfg = (0, config_js_1.resolveSandboxConfigForAgent)(cfg, agentId);
  var mainSessionKey = resolveMainSessionKeyForSandbox({ cfg: cfg, agentId: agentId });
  var sandboxed = sessionKey
    ? shouldSandboxSession(
        sandboxCfg,
        resolveComparableSessionKeyForSandbox({
          cfg: cfg,
          agentId: agentId,
          sessionKey: sessionKey,
        }),
        mainSessionKey,
      )
    : false;
  return {
    agentId: agentId,
    sessionKey: sessionKey,
    mainSessionKey: mainSessionKey,
    mode: sandboxCfg.mode,
    sandboxed: sandboxed,
    toolPolicy: (0, tool_policy_js_2.resolveSandboxToolPolicyForAgent)(cfg, agentId),
  };
}
function formatSandboxToolPolicyBlockedMessage(params) {
  var tool = params.toolName.trim().toLowerCase();
  if (!tool) {
    return undefined;
  }
  var runtime = resolveSandboxRuntimeStatus({
    cfg: params.cfg,
    sessionKey: params.sessionKey,
  });
  if (!runtime.sandboxed) {
    return undefined;
  }
  var deny = new Set((0, tool_policy_js_1.expandToolGroups)(runtime.toolPolicy.deny));
  var allow = (0, tool_policy_js_1.expandToolGroups)(runtime.toolPolicy.allow);
  var allowSet = allow.length > 0 ? new Set(allow) : null;
  var blockedByDeny = deny.has(tool);
  var blockedByAllow = allowSet ? !allowSet.has(tool) : false;
  if (!blockedByDeny && !blockedByAllow) {
    return undefined;
  }
  var reasons = [];
  var fixes = [];
  if (blockedByDeny) {
    reasons.push("deny list");
    fixes.push('Remove "'.concat(tool, '" from ').concat(runtime.toolPolicy.sources.deny.key, "."));
  }
  if (blockedByAllow) {
    reasons.push("allow list");
    fixes.push(
      'Add "'
        .concat(tool, '" to ')
        .concat(runtime.toolPolicy.sources.allow.key, " (or set it to [] to allow all)."),
    );
  }
  var lines = [];
  lines.push(
    'Tool "'.concat(tool, '" blocked by sandbox tool policy (mode=').concat(runtime.mode, ")."),
  );
  lines.push("Session: ".concat(runtime.sessionKey || "(unknown)"));
  lines.push("Reason: ".concat(reasons.join(" + ")));
  lines.push("Fix:");
  lines.push("- agents.defaults.sandbox.mode=off (disable sandbox)");
  for (var _i = 0, fixes_1 = fixes; _i < fixes_1.length; _i++) {
    var fix = fixes_1[_i];
    lines.push("- ".concat(fix));
  }
  if (runtime.mode === "non-main") {
    lines.push("- Use main session key (direct): ".concat(runtime.mainSessionKey));
  }
  lines.push(
    "- See: ".concat(
      (0, command_format_js_1.formatCliCommand)(
        "openclaw sandbox explain --session ".concat(runtime.sessionKey),
      ),
    ),
  );
  return lines.join("\n");
}
