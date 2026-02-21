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
exports.resolveSandboxScope = resolveSandboxScope;
exports.resolveSandboxDockerConfig = resolveSandboxDockerConfig;
exports.resolveSandboxBrowserConfig = resolveSandboxBrowserConfig;
exports.resolveSandboxPruneConfig = resolveSandboxPruneConfig;
exports.resolveSandboxConfigForAgent = resolveSandboxConfigForAgent;
var agent_scope_js_1 = require("../agent-scope.js");
var constants_js_1 = require("./constants.js");
var tool_policy_js_1 = require("./tool-policy.js");
function resolveSandboxScope(params) {
  if (params.scope) {
    return params.scope;
  }
  if (typeof params.perSession === "boolean") {
    return params.perSession ? "session" : "shared";
  }
  return "agent";
}
function resolveSandboxDockerConfig(params) {
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
    _3;
  var agentDocker = params.scope === "shared" ? undefined : params.agentDocker;
  var globalDocker = params.globalDocker;
  var env = (agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.env)
    ? __assign(
        __assign(
          {},
          (_a = globalDocker === null || globalDocker === void 0 ? void 0 : globalDocker.env) !==
            null && _a !== void 0
            ? _a
            : { LANG: "C.UTF-8" },
        ),
        agentDocker.env,
      )
    : (_b = globalDocker === null || globalDocker === void 0 ? void 0 : globalDocker.env) !==
          null && _b !== void 0
      ? _b
      : { LANG: "C.UTF-8" };
  var ulimits = (agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.ulimits)
    ? __assign(
        __assign(
          {},
          globalDocker === null || globalDocker === void 0 ? void 0 : globalDocker.ulimits,
        ),
        agentDocker.ulimits,
      )
    : globalDocker === null || globalDocker === void 0
      ? void 0
      : globalDocker.ulimits;
  var binds = __spreadArray(
    __spreadArray(
      [],
      (_c = globalDocker === null || globalDocker === void 0 ? void 0 : globalDocker.binds) !==
        null && _c !== void 0
        ? _c
        : [],
      true,
    ),
    (_d = agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.binds) !== null &&
      _d !== void 0
      ? _d
      : [],
    true,
  );
  return {
    image:
      (_f =
        (_e = agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.image) !==
          null && _e !== void 0
          ? _e
          : globalDocker === null || globalDocker === void 0
            ? void 0
            : globalDocker.image) !== null && _f !== void 0
        ? _f
        : constants_js_1.DEFAULT_SANDBOX_IMAGE,
    containerPrefix:
      (_h =
        (_g =
          agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.containerPrefix) !==
          null && _g !== void 0
          ? _g
          : globalDocker === null || globalDocker === void 0
            ? void 0
            : globalDocker.containerPrefix) !== null && _h !== void 0
        ? _h
        : constants_js_1.DEFAULT_SANDBOX_CONTAINER_PREFIX,
    workdir:
      (_k =
        (_j = agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.workdir) !==
          null && _j !== void 0
          ? _j
          : globalDocker === null || globalDocker === void 0
            ? void 0
            : globalDocker.workdir) !== null && _k !== void 0
        ? _k
        : constants_js_1.DEFAULT_SANDBOX_WORKDIR,
    readOnlyRoot:
      (_m =
        (_l =
          agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.readOnlyRoot) !==
          null && _l !== void 0
          ? _l
          : globalDocker === null || globalDocker === void 0
            ? void 0
            : globalDocker.readOnlyRoot) !== null && _m !== void 0
        ? _m
        : true,
    tmpfs:
      (_p =
        (_o = agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.tmpfs) !==
          null && _o !== void 0
          ? _o
          : globalDocker === null || globalDocker === void 0
            ? void 0
            : globalDocker.tmpfs) !== null && _p !== void 0
        ? _p
        : ["/tmp", "/var/tmp", "/run"],
    network:
      (_r =
        (_q = agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.network) !==
          null && _q !== void 0
          ? _q
          : globalDocker === null || globalDocker === void 0
            ? void 0
            : globalDocker.network) !== null && _r !== void 0
        ? _r
        : "none",
    user:
      (_s = agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.user) !== null &&
      _s !== void 0
        ? _s
        : globalDocker === null || globalDocker === void 0
          ? void 0
          : globalDocker.user,
    capDrop:
      (_u =
        (_t = agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.capDrop) !==
          null && _t !== void 0
          ? _t
          : globalDocker === null || globalDocker === void 0
            ? void 0
            : globalDocker.capDrop) !== null && _u !== void 0
        ? _u
        : ["ALL"],
    env: env,
    setupCommand:
      (_v = agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.setupCommand) !==
        null && _v !== void 0
        ? _v
        : globalDocker === null || globalDocker === void 0
          ? void 0
          : globalDocker.setupCommand,
    pidsLimit:
      (_w = agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.pidsLimit) !==
        null && _w !== void 0
        ? _w
        : globalDocker === null || globalDocker === void 0
          ? void 0
          : globalDocker.pidsLimit,
    memory:
      (_x = agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.memory) !==
        null && _x !== void 0
        ? _x
        : globalDocker === null || globalDocker === void 0
          ? void 0
          : globalDocker.memory,
    memorySwap:
      (_y = agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.memorySwap) !==
        null && _y !== void 0
        ? _y
        : globalDocker === null || globalDocker === void 0
          ? void 0
          : globalDocker.memorySwap,
    cpus:
      (_z = agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.cpus) !== null &&
      _z !== void 0
        ? _z
        : globalDocker === null || globalDocker === void 0
          ? void 0
          : globalDocker.cpus,
    ulimits: ulimits,
    seccompProfile:
      (_0 =
        agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.seccompProfile) !==
        null && _0 !== void 0
        ? _0
        : globalDocker === null || globalDocker === void 0
          ? void 0
          : globalDocker.seccompProfile,
    apparmorProfile:
      (_1 =
        agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.apparmorProfile) !==
        null && _1 !== void 0
        ? _1
        : globalDocker === null || globalDocker === void 0
          ? void 0
          : globalDocker.apparmorProfile,
    dns:
      (_2 = agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.dns) !== null &&
      _2 !== void 0
        ? _2
        : globalDocker === null || globalDocker === void 0
          ? void 0
          : globalDocker.dns,
    extraHosts:
      (_3 = agentDocker === null || agentDocker === void 0 ? void 0 : agentDocker.extraHosts) !==
        null && _3 !== void 0
        ? _3
        : globalDocker === null || globalDocker === void 0
          ? void 0
          : globalDocker.extraHosts,
    binds: binds.length ? binds : undefined,
  };
}
function resolveSandboxBrowserConfig(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
  var agentBrowser = params.scope === "shared" ? undefined : params.agentBrowser;
  var globalBrowser = params.globalBrowser;
  return {
    enabled:
      (_b =
        (_a = agentBrowser === null || agentBrowser === void 0 ? void 0 : agentBrowser.enabled) !==
          null && _a !== void 0
          ? _a
          : globalBrowser === null || globalBrowser === void 0
            ? void 0
            : globalBrowser.enabled) !== null && _b !== void 0
        ? _b
        : false,
    image:
      (_d =
        (_c = agentBrowser === null || agentBrowser === void 0 ? void 0 : agentBrowser.image) !==
          null && _c !== void 0
          ? _c
          : globalBrowser === null || globalBrowser === void 0
            ? void 0
            : globalBrowser.image) !== null && _d !== void 0
        ? _d
        : constants_js_1.DEFAULT_SANDBOX_BROWSER_IMAGE,
    containerPrefix:
      (_f =
        (_e =
          agentBrowser === null || agentBrowser === void 0
            ? void 0
            : agentBrowser.containerPrefix) !== null && _e !== void 0
          ? _e
          : globalBrowser === null || globalBrowser === void 0
            ? void 0
            : globalBrowser.containerPrefix) !== null && _f !== void 0
        ? _f
        : constants_js_1.DEFAULT_SANDBOX_BROWSER_PREFIX,
    cdpPort:
      (_h =
        (_g = agentBrowser === null || agentBrowser === void 0 ? void 0 : agentBrowser.cdpPort) !==
          null && _g !== void 0
          ? _g
          : globalBrowser === null || globalBrowser === void 0
            ? void 0
            : globalBrowser.cdpPort) !== null && _h !== void 0
        ? _h
        : constants_js_1.DEFAULT_SANDBOX_BROWSER_CDP_PORT,
    vncPort:
      (_k =
        (_j = agentBrowser === null || agentBrowser === void 0 ? void 0 : agentBrowser.vncPort) !==
          null && _j !== void 0
          ? _j
          : globalBrowser === null || globalBrowser === void 0
            ? void 0
            : globalBrowser.vncPort) !== null && _k !== void 0
        ? _k
        : constants_js_1.DEFAULT_SANDBOX_BROWSER_VNC_PORT,
    noVncPort:
      (_m =
        (_l =
          agentBrowser === null || agentBrowser === void 0 ? void 0 : agentBrowser.noVncPort) !==
          null && _l !== void 0
          ? _l
          : globalBrowser === null || globalBrowser === void 0
            ? void 0
            : globalBrowser.noVncPort) !== null && _m !== void 0
        ? _m
        : constants_js_1.DEFAULT_SANDBOX_BROWSER_NOVNC_PORT,
    headless:
      (_p =
        (_o = agentBrowser === null || agentBrowser === void 0 ? void 0 : agentBrowser.headless) !==
          null && _o !== void 0
          ? _o
          : globalBrowser === null || globalBrowser === void 0
            ? void 0
            : globalBrowser.headless) !== null && _p !== void 0
        ? _p
        : false,
    enableNoVnc:
      (_r =
        (_q =
          agentBrowser === null || agentBrowser === void 0 ? void 0 : agentBrowser.enableNoVnc) !==
          null && _q !== void 0
          ? _q
          : globalBrowser === null || globalBrowser === void 0
            ? void 0
            : globalBrowser.enableNoVnc) !== null && _r !== void 0
        ? _r
        : true,
    allowHostControl:
      (_t =
        (_s =
          agentBrowser === null || agentBrowser === void 0
            ? void 0
            : agentBrowser.allowHostControl) !== null && _s !== void 0
          ? _s
          : globalBrowser === null || globalBrowser === void 0
            ? void 0
            : globalBrowser.allowHostControl) !== null && _t !== void 0
        ? _t
        : false,
    autoStart:
      (_v =
        (_u =
          agentBrowser === null || agentBrowser === void 0 ? void 0 : agentBrowser.autoStart) !==
          null && _u !== void 0
          ? _u
          : globalBrowser === null || globalBrowser === void 0
            ? void 0
            : globalBrowser.autoStart) !== null && _v !== void 0
        ? _v
        : true,
    autoStartTimeoutMs:
      (_x =
        (_w =
          agentBrowser === null || agentBrowser === void 0
            ? void 0
            : agentBrowser.autoStartTimeoutMs) !== null && _w !== void 0
          ? _w
          : globalBrowser === null || globalBrowser === void 0
            ? void 0
            : globalBrowser.autoStartTimeoutMs) !== null && _x !== void 0
        ? _x
        : constants_js_1.DEFAULT_SANDBOX_BROWSER_AUTOSTART_TIMEOUT_MS,
  };
}
function resolveSandboxPruneConfig(params) {
  var _a, _b, _c, _d;
  var agentPrune = params.scope === "shared" ? undefined : params.agentPrune;
  var globalPrune = params.globalPrune;
  return {
    idleHours:
      (_b =
        (_a = agentPrune === null || agentPrune === void 0 ? void 0 : agentPrune.idleHours) !==
          null && _a !== void 0
          ? _a
          : globalPrune === null || globalPrune === void 0
            ? void 0
            : globalPrune.idleHours) !== null && _b !== void 0
        ? _b
        : constants_js_1.DEFAULT_SANDBOX_IDLE_HOURS,
    maxAgeDays:
      (_d =
        (_c = agentPrune === null || agentPrune === void 0 ? void 0 : agentPrune.maxAgeDays) !==
          null && _c !== void 0
          ? _c
          : globalPrune === null || globalPrune === void 0
            ? void 0
            : globalPrune.maxAgeDays) !== null && _d !== void 0
        ? _d
        : constants_js_1.DEFAULT_SANDBOX_MAX_AGE_DAYS,
  };
}
function resolveSandboxConfigForAgent(cfg, agentId) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
  var agent =
    (_b =
      (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0
        ? void 0
        : _a.defaults) === null || _b === void 0
      ? void 0
      : _b.sandbox;
  // Agent-specific sandbox config overrides global
  var agentSandbox;
  var agentConfig =
    cfg && agentId ? (0, agent_scope_js_1.resolveAgentConfig)(cfg, agentId) : undefined;
  if (agentConfig === null || agentConfig === void 0 ? void 0 : agentConfig.sandbox) {
    agentSandbox = agentConfig.sandbox;
  }
  var scope = resolveSandboxScope({
    scope:
      (_c = agentSandbox === null || agentSandbox === void 0 ? void 0 : agentSandbox.scope) !==
        null && _c !== void 0
        ? _c
        : agent === null || agent === void 0
          ? void 0
          : agent.scope,
    perSession:
      (_d = agentSandbox === null || agentSandbox === void 0 ? void 0 : agentSandbox.perSession) !==
        null && _d !== void 0
        ? _d
        : agent === null || agent === void 0
          ? void 0
          : agent.perSession,
  });
  var toolPolicy = (0, tool_policy_js_1.resolveSandboxToolPolicyForAgent)(cfg, agentId);
  return {
    mode:
      (_f =
        (_e = agentSandbox === null || agentSandbox === void 0 ? void 0 : agentSandbox.mode) !==
          null && _e !== void 0
          ? _e
          : agent === null || agent === void 0
            ? void 0
            : agent.mode) !== null && _f !== void 0
        ? _f
        : "off",
    scope: scope,
    workspaceAccess:
      (_h =
        (_g =
          agentSandbox === null || agentSandbox === void 0
            ? void 0
            : agentSandbox.workspaceAccess) !== null && _g !== void 0
          ? _g
          : agent === null || agent === void 0
            ? void 0
            : agent.workspaceAccess) !== null && _h !== void 0
        ? _h
        : "none",
    workspaceRoot:
      (_k =
        (_j =
          agentSandbox === null || agentSandbox === void 0
            ? void 0
            : agentSandbox.workspaceRoot) !== null && _j !== void 0
          ? _j
          : agent === null || agent === void 0
            ? void 0
            : agent.workspaceRoot) !== null && _k !== void 0
        ? _k
        : constants_js_1.DEFAULT_SANDBOX_WORKSPACE_ROOT,
    docker: resolveSandboxDockerConfig({
      scope: scope,
      globalDocker: agent === null || agent === void 0 ? void 0 : agent.docker,
      agentDocker: agentSandbox === null || agentSandbox === void 0 ? void 0 : agentSandbox.docker,
    }),
    browser: resolveSandboxBrowserConfig({
      scope: scope,
      globalBrowser: agent === null || agent === void 0 ? void 0 : agent.browser,
      agentBrowser:
        agentSandbox === null || agentSandbox === void 0 ? void 0 : agentSandbox.browser,
    }),
    tools: {
      allow: toolPolicy.allow,
      deny: toolPolicy.deny,
    },
    prune: resolveSandboxPruneConfig({
      scope: scope,
      globalPrune: agent === null || agent === void 0 ? void 0 : agent.prune,
      agentPrune: agentSandbox === null || agentSandbox === void 0 ? void 0 : agentSandbox.prune,
    }),
  };
}
