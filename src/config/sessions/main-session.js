"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAgentIdFromSessionKey = void 0;
exports.resolveMainSessionKey = resolveMainSessionKey;
exports.resolveMainSessionKeyFromConfig = resolveMainSessionKeyFromConfig;
exports.resolveAgentMainSessionKey = resolveAgentMainSessionKey;
exports.resolveExplicitAgentSessionKey = resolveExplicitAgentSessionKey;
exports.canonicalizeMainSessionAlias = canonicalizeMainSessionAlias;
var session_key_js_1 = require("../../routing/session-key.js");
Object.defineProperty(exports, "resolveAgentIdFromSessionKey", {
  enumerable: true,
  get: function () {
    return session_key_js_1.resolveAgentIdFromSessionKey;
  },
});
var config_js_1 = require("../config.js");
function resolveMainSessionKey(cfg) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  if (
    ((_a = cfg === null || cfg === void 0 ? void 0 : cfg.session) === null || _a === void 0
      ? void 0
      : _a.scope) === "global"
  ) {
    return "global";
  }
  var agents =
    (_c =
      (_b = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _b === void 0
        ? void 0
        : _b.list) !== null && _c !== void 0
      ? _c
      : [];
  var defaultAgentId =
    (_g =
      (_e =
        (_d = agents.find(function (agent) {
          return agent === null || agent === void 0 ? void 0 : agent.default;
        })) === null || _d === void 0
          ? void 0
          : _d.id) !== null && _e !== void 0
        ? _e
        : (_f = agents[0]) === null || _f === void 0
          ? void 0
          : _f.id) !== null && _g !== void 0
      ? _g
      : session_key_js_1.DEFAULT_AGENT_ID;
  var agentId = (0, session_key_js_1.normalizeAgentId)(defaultAgentId);
  var mainKey = (0, session_key_js_1.normalizeMainKey)(
    (_h = cfg === null || cfg === void 0 ? void 0 : cfg.session) === null || _h === void 0
      ? void 0
      : _h.mainKey,
  );
  return (0, session_key_js_1.buildAgentMainSessionKey)({ agentId: agentId, mainKey: mainKey });
}
function resolveMainSessionKeyFromConfig() {
  return resolveMainSessionKey((0, config_js_1.loadConfig)());
}
function resolveAgentMainSessionKey(params) {
  var _a, _b;
  var mainKey = (0, session_key_js_1.normalizeMainKey)(
    (_b = (_a = params.cfg) === null || _a === void 0 ? void 0 : _a.session) === null ||
      _b === void 0
      ? void 0
      : _b.mainKey,
  );
  return (0, session_key_js_1.buildAgentMainSessionKey)({
    agentId: params.agentId,
    mainKey: mainKey,
  });
}
function resolveExplicitAgentSessionKey(params) {
  var _a;
  var agentId = (_a = params.agentId) === null || _a === void 0 ? void 0 : _a.trim();
  if (!agentId) {
    return undefined;
  }
  return resolveAgentMainSessionKey({ cfg: params.cfg, agentId: agentId });
}
function canonicalizeMainSessionAlias(params) {
  var _a, _b, _c, _d;
  var raw = params.sessionKey.trim();
  if (!raw) {
    return raw;
  }
  var agentId = (0, session_key_js_1.normalizeAgentId)(params.agentId);
  var mainKey = (0, session_key_js_1.normalizeMainKey)(
    (_b = (_a = params.cfg) === null || _a === void 0 ? void 0 : _a.session) === null ||
      _b === void 0
      ? void 0
      : _b.mainKey,
  );
  var agentMainSessionKey = (0, session_key_js_1.buildAgentMainSessionKey)({
    agentId: agentId,
    mainKey: mainKey,
  });
  var agentMainAliasKey = (0, session_key_js_1.buildAgentMainSessionKey)({
    agentId: agentId,
    mainKey: "main",
  });
  var isMainAlias =
    raw === "main" || raw === mainKey || raw === agentMainSessionKey || raw === agentMainAliasKey;
  if (
    ((_d = (_c = params.cfg) === null || _c === void 0 ? void 0 : _c.session) === null ||
    _d === void 0
      ? void 0
      : _d.scope) === "global" &&
    isMainAlias
  ) {
    return "global";
  }
  if (isMainAlias) {
    return agentMainSessionKey;
  }
  return raw;
}
