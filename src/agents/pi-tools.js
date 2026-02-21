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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }
    if (s != null && typeof Object.getOwnPropertySymbols === "function") {
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    }
    return t;
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
exports.__testing = void 0;
exports.createOpenClawCodingTools = createOpenClawCodingTools;
var pi_coding_agent_1 = require("@mariozechner/pi-coding-agent");
var session_key_js_1 = require("../routing/session-key.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var apply_patch_js_1 = require("./apply-patch.js");
var bash_tools_js_1 = require("./bash-tools.js");
var channel_tools_js_1 = require("./channel-tools.js");
var openclaw_tools_js_1 = require("./openclaw-tools.js");
var pi_tools_abort_js_1 = require("./pi-tools.abort.js");
var pi_tools_policy_js_1 = require("./pi-tools.policy.js");
var pi_tools_read_js_1 = require("./pi-tools.read.js");
var pi_tools_schema_js_1 = require("./pi-tools.schema.js");
var tool_policy_js_1 = require("./tool-policy.js");
var tools_js_1 = require("../plugins/tools.js");
var logger_js_1 = require("../logger.js");
function isOpenAIProvider(provider) {
  var normalized =
    provider === null || provider === void 0 ? void 0 : provider.trim().toLowerCase();
  return normalized === "openai" || normalized === "openai-codex";
}
function isApplyPatchAllowedForModel(params) {
  var _a, _b;
  var allowModels = Array.isArray(params.allowModels) ? params.allowModels : [];
  if (allowModels.length === 0) {
    return true;
  }
  var modelId = (_a = params.modelId) === null || _a === void 0 ? void 0 : _a.trim();
  if (!modelId) {
    return false;
  }
  var normalizedModelId = modelId.toLowerCase();
  var provider =
    (_b = params.modelProvider) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase();
  var normalizedFull =
    provider && !normalizedModelId.includes("/")
      ? "".concat(provider, "/").concat(normalizedModelId)
      : normalizedModelId;
  return allowModels.some(function (entry) {
    var normalized = entry.trim().toLowerCase();
    if (!normalized) {
      return false;
    }
    return normalized === normalizedModelId || normalized === normalizedFull;
  });
}
function resolveExecConfig(cfg) {
  var _a;
  var globalExec =
    (_a = cfg === null || cfg === void 0 ? void 0 : cfg.tools) === null || _a === void 0
      ? void 0
      : _a.exec;
  return {
    host: globalExec === null || globalExec === void 0 ? void 0 : globalExec.host,
    security: globalExec === null || globalExec === void 0 ? void 0 : globalExec.security,
    ask: globalExec === null || globalExec === void 0 ? void 0 : globalExec.ask,
    node: globalExec === null || globalExec === void 0 ? void 0 : globalExec.node,
    pathPrepend: globalExec === null || globalExec === void 0 ? void 0 : globalExec.pathPrepend,
    safeBins: globalExec === null || globalExec === void 0 ? void 0 : globalExec.safeBins,
    backgroundMs: globalExec === null || globalExec === void 0 ? void 0 : globalExec.backgroundMs,
    timeoutSec: globalExec === null || globalExec === void 0 ? void 0 : globalExec.timeoutSec,
    approvalRunningNoticeMs:
      globalExec === null || globalExec === void 0 ? void 0 : globalExec.approvalRunningNoticeMs,
    cleanupMs: globalExec === null || globalExec === void 0 ? void 0 : globalExec.cleanupMs,
    notifyOnExit: globalExec === null || globalExec === void 0 ? void 0 : globalExec.notifyOnExit,
    applyPatch: globalExec === null || globalExec === void 0 ? void 0 : globalExec.applyPatch,
  };
}
exports.__testing = {
  cleanToolSchemaForGemini: pi_tools_schema_js_1.cleanToolSchemaForGemini,
  normalizeToolParams: pi_tools_read_js_1.normalizeToolParams,
  patchToolSchemaForClaudeCompatibility: pi_tools_read_js_1.patchToolSchemaForClaudeCompatibility,
  wrapToolParamNormalization: pi_tools_read_js_1.wrapToolParamNormalization,
  assertRequiredParams: pi_tools_read_js_1.assertRequiredParams,
};
function createOpenClawCodingTools(options) {
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
    _7;
  var execToolName = "exec";
  var sandbox = (
    (_a = options === null || options === void 0 ? void 0 : options.sandbox) === null ||
    _a === void 0
      ? void 0
      : _a.enabled
  )
    ? options.sandbox
    : undefined;
  var _8 = (0, pi_tools_policy_js_1.resolveEffectiveToolPolicy)({
      config: options === null || options === void 0 ? void 0 : options.config,
      sessionKey: options === null || options === void 0 ? void 0 : options.sessionKey,
      modelProvider: options === null || options === void 0 ? void 0 : options.modelProvider,
      modelId: options === null || options === void 0 ? void 0 : options.modelId,
    }),
    agentId = _8.agentId,
    globalPolicy = _8.globalPolicy,
    globalProviderPolicy = _8.globalProviderPolicy,
    agentPolicy = _8.agentPolicy,
    agentProviderPolicy = _8.agentProviderPolicy,
    profile = _8.profile,
    providerProfile = _8.providerProfile,
    profileAlsoAllow = _8.profileAlsoAllow,
    providerProfileAlsoAllow = _8.providerProfileAlsoAllow;
  var groupPolicy = (0, pi_tools_policy_js_1.resolveGroupToolPolicy)({
    config: options === null || options === void 0 ? void 0 : options.config,
    sessionKey: options === null || options === void 0 ? void 0 : options.sessionKey,
    spawnedBy: options === null || options === void 0 ? void 0 : options.spawnedBy,
    messageProvider: options === null || options === void 0 ? void 0 : options.messageProvider,
    groupId: options === null || options === void 0 ? void 0 : options.groupId,
    groupChannel: options === null || options === void 0 ? void 0 : options.groupChannel,
    groupSpace: options === null || options === void 0 ? void 0 : options.groupSpace,
    accountId: options === null || options === void 0 ? void 0 : options.agentAccountId,
    senderId: options === null || options === void 0 ? void 0 : options.senderId,
    senderName: options === null || options === void 0 ? void 0 : options.senderName,
    senderUsername: options === null || options === void 0 ? void 0 : options.senderUsername,
    senderE164: options === null || options === void 0 ? void 0 : options.senderE164,
  });
  var profilePolicy = (0, tool_policy_js_1.resolveToolProfilePolicy)(profile);
  var providerProfilePolicy = (0, tool_policy_js_1.resolveToolProfilePolicy)(providerProfile);
  var mergeAlsoAllow = function (policy, alsoAllow) {
    if (
      !(policy === null || policy === void 0 ? void 0 : policy.allow) ||
      !Array.isArray(alsoAllow) ||
      alsoAllow.length === 0
    ) {
      return policy;
    }
    return __assign(__assign({}, policy), {
      allow: Array.from(
        new Set(__spreadArray(__spreadArray([], policy.allow, true), alsoAllow, true)),
      ),
    });
  };
  var profilePolicyWithAlsoAllow = mergeAlsoAllow(profilePolicy, profileAlsoAllow);
  var providerProfilePolicyWithAlsoAllow = mergeAlsoAllow(
    providerProfilePolicy,
    providerProfileAlsoAllow,
  );
  var scopeKey =
    (_c =
      (_b = options === null || options === void 0 ? void 0 : options.exec) === null ||
      _b === void 0
        ? void 0
        : _b.scopeKey) !== null && _c !== void 0
      ? _c
      : agentId
        ? "agent:".concat(agentId)
        : undefined;
  var subagentPolicy =
    (0, session_key_js_1.isSubagentSessionKey)(
      options === null || options === void 0 ? void 0 : options.sessionKey,
    ) && (options === null || options === void 0 ? void 0 : options.sessionKey)
      ? (0, pi_tools_policy_js_1.resolveSubagentToolPolicy)(options.config)
      : undefined;
  var allowBackground = (0, pi_tools_policy_js_1.isToolAllowedByPolicies)("process", [
    profilePolicyWithAlsoAllow,
    providerProfilePolicyWithAlsoAllow,
    globalPolicy,
    globalProviderPolicy,
    agentPolicy,
    agentProviderPolicy,
    groupPolicy,
    sandbox === null || sandbox === void 0 ? void 0 : sandbox.tools,
    subagentPolicy,
  ]);
  var execConfig = resolveExecConfig(
    options === null || options === void 0 ? void 0 : options.config,
  );
  var sandboxRoot = sandbox === null || sandbox === void 0 ? void 0 : sandbox.workspaceDir;
  var allowWorkspaceWrites =
    (sandbox === null || sandbox === void 0 ? void 0 : sandbox.workspaceAccess) !== "ro";
  var workspaceRoot =
    (_d = options === null || options === void 0 ? void 0 : options.workspaceDir) !== null &&
    _d !== void 0
      ? _d
      : process.cwd();
  var applyPatchConfig =
    (_g =
      (_f =
        (_e = options === null || options === void 0 ? void 0 : options.config) === null ||
        _e === void 0
          ? void 0
          : _e.tools) === null || _f === void 0
        ? void 0
        : _f.exec) === null || _g === void 0
      ? void 0
      : _g.applyPatch;
  var applyPatchEnabled =
    !!(applyPatchConfig === null || applyPatchConfig === void 0
      ? void 0
      : applyPatchConfig.enabled) &&
    isOpenAIProvider(options === null || options === void 0 ? void 0 : options.modelProvider) &&
    isApplyPatchAllowedForModel({
      modelProvider: options === null || options === void 0 ? void 0 : options.modelProvider,
      modelId: options === null || options === void 0 ? void 0 : options.modelId,
      allowModels:
        applyPatchConfig === null || applyPatchConfig === void 0
          ? void 0
          : applyPatchConfig.allowModels,
    });
  var base = pi_coding_agent_1.codingTools.flatMap(function (tool) {
    if (tool.name === pi_coding_agent_1.readTool.name) {
      if (sandboxRoot) {
        return [(0, pi_tools_read_js_1.createSandboxedReadTool)(sandboxRoot)];
      }
      var freshReadTool = (0, pi_coding_agent_1.createReadTool)(workspaceRoot);
      return [(0, pi_tools_read_js_1.createOpenClawReadTool)(freshReadTool)];
    }
    if (tool.name === "bash" || tool.name === execToolName) {
      return [];
    }
    if (tool.name === "write") {
      if (sandboxRoot) {
        return [];
      }
      // Wrap with param normalization for Claude Code compatibility
      return [
        (0, pi_tools_read_js_1.wrapToolParamNormalization)(
          (0, pi_coding_agent_1.createWriteTool)(workspaceRoot),
          pi_tools_read_js_1.CLAUDE_PARAM_GROUPS.write,
        ),
      ];
    }
    if (tool.name === "edit") {
      if (sandboxRoot) {
        return [];
      }
      // Wrap with param normalization for Claude Code compatibility
      return [
        (0, pi_tools_read_js_1.wrapToolParamNormalization)(
          (0, pi_coding_agent_1.createEditTool)(workspaceRoot),
          pi_tools_read_js_1.CLAUDE_PARAM_GROUPS.edit,
        ),
      ];
    }
    return [tool];
  });
  var _9 =
      (_h = options === null || options === void 0 ? void 0 : options.exec) !== null &&
      _h !== void 0
        ? _h
        : {},
    cleanupMsOverride = _9.cleanupMs,
    execDefaults = __rest(_9, ["cleanupMs"]);
  var execTool = (0, bash_tools_js_1.createExecTool)(
    __assign(__assign({}, execDefaults), {
      host:
        (_k =
          (_j = options === null || options === void 0 ? void 0 : options.exec) === null ||
          _j === void 0
            ? void 0
            : _j.host) !== null && _k !== void 0
          ? _k
          : execConfig.host,
      security:
        (_m =
          (_l = options === null || options === void 0 ? void 0 : options.exec) === null ||
          _l === void 0
            ? void 0
            : _l.security) !== null && _m !== void 0
          ? _m
          : execConfig.security,
      ask:
        (_p =
          (_o = options === null || options === void 0 ? void 0 : options.exec) === null ||
          _o === void 0
            ? void 0
            : _o.ask) !== null && _p !== void 0
          ? _p
          : execConfig.ask,
      node:
        (_r =
          (_q = options === null || options === void 0 ? void 0 : options.exec) === null ||
          _q === void 0
            ? void 0
            : _q.node) !== null && _r !== void 0
          ? _r
          : execConfig.node,
      pathPrepend:
        (_t =
          (_s = options === null || options === void 0 ? void 0 : options.exec) === null ||
          _s === void 0
            ? void 0
            : _s.pathPrepend) !== null && _t !== void 0
          ? _t
          : execConfig.pathPrepend,
      safeBins:
        (_v =
          (_u = options === null || options === void 0 ? void 0 : options.exec) === null ||
          _u === void 0
            ? void 0
            : _u.safeBins) !== null && _v !== void 0
          ? _v
          : execConfig.safeBins,
      agentId: agentId,
      cwd: options === null || options === void 0 ? void 0 : options.workspaceDir,
      allowBackground: allowBackground,
      scopeKey: scopeKey,
      sessionKey: options === null || options === void 0 ? void 0 : options.sessionKey,
      messageProvider: options === null || options === void 0 ? void 0 : options.messageProvider,
      backgroundMs:
        (_x =
          (_w = options === null || options === void 0 ? void 0 : options.exec) === null ||
          _w === void 0
            ? void 0
            : _w.backgroundMs) !== null && _x !== void 0
          ? _x
          : execConfig.backgroundMs,
      timeoutSec:
        (_z =
          (_y = options === null || options === void 0 ? void 0 : options.exec) === null ||
          _y === void 0
            ? void 0
            : _y.timeoutSec) !== null && _z !== void 0
          ? _z
          : execConfig.timeoutSec,
      approvalRunningNoticeMs:
        (_1 =
          (_0 = options === null || options === void 0 ? void 0 : options.exec) === null ||
          _0 === void 0
            ? void 0
            : _0.approvalRunningNoticeMs) !== null && _1 !== void 0
          ? _1
          : execConfig.approvalRunningNoticeMs,
      notifyOnExit:
        (_3 =
          (_2 = options === null || options === void 0 ? void 0 : options.exec) === null ||
          _2 === void 0
            ? void 0
            : _2.notifyOnExit) !== null && _3 !== void 0
          ? _3
          : execConfig.notifyOnExit,
      sandbox: sandbox
        ? {
            containerName: sandbox.containerName,
            workspaceDir: sandbox.workspaceDir,
            containerWorkdir: sandbox.containerWorkdir,
            env: sandbox.docker.env,
          }
        : undefined,
    }),
  );
  var processTool = (0, bash_tools_js_1.createProcessTool)({
    cleanupMs:
      cleanupMsOverride !== null && cleanupMsOverride !== void 0
        ? cleanupMsOverride
        : execConfig.cleanupMs,
    scopeKey: scopeKey,
  });
  var applyPatchTool =
    !applyPatchEnabled || (sandboxRoot && !allowWorkspaceWrites)
      ? null
      : (0, apply_patch_js_1.createApplyPatchTool)({
          cwd: sandboxRoot !== null && sandboxRoot !== void 0 ? sandboxRoot : workspaceRoot,
          sandboxRoot: sandboxRoot && allowWorkspaceWrites ? sandboxRoot : undefined,
        });
  var tools = __spreadArray(
    __spreadArray(
      __spreadArray(
        __spreadArray(
          __spreadArray(
            __spreadArray([], base, true),
            sandboxRoot
              ? allowWorkspaceWrites
                ? [
                    (0, pi_tools_read_js_1.createSandboxedEditTool)(sandboxRoot),
                    (0, pi_tools_read_js_1.createSandboxedWriteTool)(sandboxRoot),
                  ]
                : []
              : [],
            true,
          ),
          applyPatchTool ? [applyPatchTool] : [],
          true,
        ),
        [execTool, processTool],
        false,
      ),
      (0, channel_tools_js_1.listChannelAgentTools)({
        cfg: options === null || options === void 0 ? void 0 : options.config,
      }),
      true,
    ),
    (0, openclaw_tools_js_1.createOpenClawTools)({
      sandboxBrowserBridgeUrl:
        (_4 = sandbox === null || sandbox === void 0 ? void 0 : sandbox.browser) === null ||
        _4 === void 0
          ? void 0
          : _4.bridgeUrl,
      allowHostBrowserControl: sandbox ? sandbox.browserAllowHostControl : true,
      agentSessionKey: options === null || options === void 0 ? void 0 : options.sessionKey,
      agentChannel: (0, message_channel_js_1.resolveGatewayMessageChannel)(
        options === null || options === void 0 ? void 0 : options.messageProvider,
      ),
      agentAccountId: options === null || options === void 0 ? void 0 : options.agentAccountId,
      agentTo: options === null || options === void 0 ? void 0 : options.messageTo,
      agentThreadId: options === null || options === void 0 ? void 0 : options.messageThreadId,
      agentGroupId:
        (_5 = options === null || options === void 0 ? void 0 : options.groupId) !== null &&
        _5 !== void 0
          ? _5
          : null,
      agentGroupChannel:
        (_6 = options === null || options === void 0 ? void 0 : options.groupChannel) !== null &&
        _6 !== void 0
          ? _6
          : null,
      agentGroupSpace:
        (_7 = options === null || options === void 0 ? void 0 : options.groupSpace) !== null &&
        _7 !== void 0
          ? _7
          : null,
      agentDir: options === null || options === void 0 ? void 0 : options.agentDir,
      sandboxRoot: sandboxRoot,
      workspaceDir: options === null || options === void 0 ? void 0 : options.workspaceDir,
      sandboxed: !!sandbox,
      config: options === null || options === void 0 ? void 0 : options.config,
      pluginToolAllowlist: (0, tool_policy_js_1.collectExplicitAllowlist)([
        profilePolicy,
        providerProfilePolicy,
        globalPolicy,
        globalProviderPolicy,
        agentPolicy,
        agentProviderPolicy,
        groupPolicy,
        sandbox === null || sandbox === void 0 ? void 0 : sandbox.tools,
        subagentPolicy,
      ]),
      currentChannelId: options === null || options === void 0 ? void 0 : options.currentChannelId,
      currentThreadTs: options === null || options === void 0 ? void 0 : options.currentThreadTs,
      replyToMode: options === null || options === void 0 ? void 0 : options.replyToMode,
      hasRepliedRef: options === null || options === void 0 ? void 0 : options.hasRepliedRef,
      modelHasVision: options === null || options === void 0 ? void 0 : options.modelHasVision,
      requesterAgentIdOverride: agentId,
    }),
    true,
  );
  var coreToolNames = new Set(
    tools
      .filter(function (tool) {
        return !(0, tools_js_1.getPluginToolMeta)(tool);
      })
      .map(function (tool) {
        return (0, tool_policy_js_1.normalizeToolName)(tool.name);
      })
      .filter(Boolean),
  );
  var pluginGroups = (0, tool_policy_js_1.buildPluginToolGroups)({
    tools: tools,
    toolMeta: function (tool) {
      return (0, tools_js_1.getPluginToolMeta)(tool);
    },
  });
  var resolvePolicy = function (policy, label) {
    var resolved = (0, tool_policy_js_1.stripPluginOnlyAllowlist)(
      policy,
      pluginGroups,
      coreToolNames,
    );
    if (resolved.unknownAllowlist.length > 0) {
      var entries = resolved.unknownAllowlist.join(", ");
      var suffix = resolved.strippedAllowlist
        ? "Ignoring allowlist so core tools remain available. Use tools.alsoAllow for additive plugin tool enablement."
        : "These entries won't match any tool unless the plugin is enabled.";
      (0, logger_js_1.logWarn)(
        "tools: "
          .concat(label, " allowlist contains unknown entries (")
          .concat(entries, "). ")
          .concat(suffix),
      );
    }
    return (0, tool_policy_js_1.expandPolicyWithPluginGroups)(resolved.policy, pluginGroups);
  };
  var profilePolicyExpanded = resolvePolicy(
    profilePolicyWithAlsoAllow,
    profile ? "tools.profile (".concat(profile, ")") : "tools.profile",
  );
  var providerProfileExpanded = resolvePolicy(
    providerProfilePolicyWithAlsoAllow,
    providerProfile
      ? "tools.byProvider.profile (".concat(providerProfile, ")")
      : "tools.byProvider.profile",
  );
  var globalPolicyExpanded = resolvePolicy(globalPolicy, "tools.allow");
  var globalProviderExpanded = resolvePolicy(globalProviderPolicy, "tools.byProvider.allow");
  var agentPolicyExpanded = resolvePolicy(
    agentPolicy,
    agentId ? "agents.".concat(agentId, ".tools.allow") : "agent tools.allow",
  );
  var agentProviderExpanded = resolvePolicy(
    agentProviderPolicy,
    agentId ? "agents.".concat(agentId, ".tools.byProvider.allow") : "agent tools.byProvider.allow",
  );
  var groupPolicyExpanded = resolvePolicy(groupPolicy, "group tools.allow");
  var sandboxPolicyExpanded = (0, tool_policy_js_1.expandPolicyWithPluginGroups)(
    sandbox === null || sandbox === void 0 ? void 0 : sandbox.tools,
    pluginGroups,
  );
  var subagentPolicyExpanded = (0, tool_policy_js_1.expandPolicyWithPluginGroups)(
    subagentPolicy,
    pluginGroups,
  );
  var toolsFiltered = profilePolicyExpanded
    ? (0, pi_tools_policy_js_1.filterToolsByPolicy)(tools, profilePolicyExpanded)
    : tools;
  var providerProfileFiltered = providerProfileExpanded
    ? (0, pi_tools_policy_js_1.filterToolsByPolicy)(toolsFiltered, providerProfileExpanded)
    : toolsFiltered;
  var globalFiltered = globalPolicyExpanded
    ? (0, pi_tools_policy_js_1.filterToolsByPolicy)(providerProfileFiltered, globalPolicyExpanded)
    : providerProfileFiltered;
  var globalProviderFiltered = globalProviderExpanded
    ? (0, pi_tools_policy_js_1.filterToolsByPolicy)(globalFiltered, globalProviderExpanded)
    : globalFiltered;
  var agentFiltered = agentPolicyExpanded
    ? (0, pi_tools_policy_js_1.filterToolsByPolicy)(globalProviderFiltered, agentPolicyExpanded)
    : globalProviderFiltered;
  var agentProviderFiltered = agentProviderExpanded
    ? (0, pi_tools_policy_js_1.filterToolsByPolicy)(agentFiltered, agentProviderExpanded)
    : agentFiltered;
  var groupFiltered = groupPolicyExpanded
    ? (0, pi_tools_policy_js_1.filterToolsByPolicy)(agentProviderFiltered, groupPolicyExpanded)
    : agentProviderFiltered;
  var sandboxed = sandboxPolicyExpanded
    ? (0, pi_tools_policy_js_1.filterToolsByPolicy)(groupFiltered, sandboxPolicyExpanded)
    : groupFiltered;
  var subagentFiltered = subagentPolicyExpanded
    ? (0, pi_tools_policy_js_1.filterToolsByPolicy)(sandboxed, subagentPolicyExpanded)
    : sandboxed;
  // Always normalize tool JSON Schemas before handing them to pi-agent/pi-ai.
  // Without this, some providers (notably OpenAI) will reject root-level union schemas.
  var normalized = subagentFiltered.map(pi_tools_schema_js_1.normalizeToolParameters);
  var withAbort = (options === null || options === void 0 ? void 0 : options.abortSignal)
    ? normalized.map(function (tool) {
        return (0, pi_tools_abort_js_1.wrapToolWithAbortSignal)(tool, options.abortSignal);
      })
    : normalized;
  // NOTE: Keep canonical (lowercase) tool names here.
  // pi-ai's Anthropic OAuth transport remaps tool names to Claude Code-style names
  // on the wire and maps them back for tool dispatch.
  return withAbort;
}
