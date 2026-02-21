"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAgentIdentity = resolveAgentIdentity;
exports.resolveAckReaction = resolveAckReaction;
exports.resolveIdentityNamePrefix = resolveIdentityNamePrefix;
exports.resolveIdentityName = resolveIdentityName;
exports.resolveMessagePrefix = resolveMessagePrefix;
exports.resolveResponsePrefix = resolveResponsePrefix;
exports.resolveEffectiveMessagesConfig = resolveEffectiveMessagesConfig;
exports.resolveHumanDelayConfig = resolveHumanDelayConfig;
var agent_scope_js_1 = require("./agent-scope.js");
var DEFAULT_ACK_REACTION = "👀";
function resolveAgentIdentity(cfg, agentId) {
  var _a;
  return (_a = (0, agent_scope_js_1.resolveAgentConfig)(cfg, agentId)) === null || _a === void 0
    ? void 0
    : _a.identity;
}
function resolveAckReaction(cfg, agentId) {
  var _a, _b, _c;
  var configured = (_a = cfg.messages) === null || _a === void 0 ? void 0 : _a.ackReaction;
  if (configured !== undefined) {
    return configured.trim();
  }
  var emoji =
    (_c =
      (_b = resolveAgentIdentity(cfg, agentId)) === null || _b === void 0 ? void 0 : _b.emoji) ===
      null || _c === void 0
      ? void 0
      : _c.trim();
  return emoji || DEFAULT_ACK_REACTION;
}
function resolveIdentityNamePrefix(cfg, agentId) {
  var _a, _b;
  var name =
    (_b =
      (_a = resolveAgentIdentity(cfg, agentId)) === null || _a === void 0 ? void 0 : _a.name) ===
      null || _b === void 0
      ? void 0
      : _b.trim();
  if (!name) {
    return undefined;
  }
  return "[".concat(name, "]");
}
/** Returns just the identity name (without brackets) for template context. */
function resolveIdentityName(cfg, agentId) {
  var _a, _b;
  return (
    ((_b =
      (_a = resolveAgentIdentity(cfg, agentId)) === null || _a === void 0 ? void 0 : _a.name) ===
      null || _b === void 0
      ? void 0
      : _b.trim()) || undefined
  );
}
function resolveMessagePrefix(cfg, agentId, opts) {
  var _a, _b, _c, _d;
  var configured =
    (_a = opts === null || opts === void 0 ? void 0 : opts.configured) !== null && _a !== void 0
      ? _a
      : (_b = cfg.messages) === null || _b === void 0
        ? void 0
        : _b.messagePrefix;
  if (configured !== undefined) {
    return configured;
  }
  var hasAllowFrom = (opts === null || opts === void 0 ? void 0 : opts.hasAllowFrom) === true;
  if (hasAllowFrom) {
    return "";
  }
  return (_d =
    (_c = resolveIdentityNamePrefix(cfg, agentId)) !== null && _c !== void 0
      ? _c
      : opts === null || opts === void 0
        ? void 0
        : opts.fallback) !== null && _d !== void 0
    ? _d
    : "[openclaw]";
}
function resolveResponsePrefix(cfg, agentId) {
  var _a;
  var configured = (_a = cfg.messages) === null || _a === void 0 ? void 0 : _a.responsePrefix;
  if (configured !== undefined) {
    if (configured === "auto") {
      return resolveIdentityNamePrefix(cfg, agentId);
    }
    return configured;
  }
  return undefined;
}
function resolveEffectiveMessagesConfig(cfg, agentId, opts) {
  return {
    messagePrefix: resolveMessagePrefix(cfg, agentId, {
      hasAllowFrom: opts === null || opts === void 0 ? void 0 : opts.hasAllowFrom,
      fallback: opts === null || opts === void 0 ? void 0 : opts.fallbackMessagePrefix,
    }),
    responsePrefix: resolveResponsePrefix(cfg, agentId),
  };
}
function resolveHumanDelayConfig(cfg, agentId) {
  var _a, _b, _c, _d, _e, _f;
  var defaults =
    (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null ||
    _b === void 0
      ? void 0
      : _b.humanDelay;
  var overrides =
    (_c = (0, agent_scope_js_1.resolveAgentConfig)(cfg, agentId)) === null || _c === void 0
      ? void 0
      : _c.humanDelay;
  if (!defaults && !overrides) {
    return undefined;
  }
  return {
    mode:
      (_d = overrides === null || overrides === void 0 ? void 0 : overrides.mode) !== null &&
      _d !== void 0
        ? _d
        : defaults === null || defaults === void 0
          ? void 0
          : defaults.mode,
    minMs:
      (_e = overrides === null || overrides === void 0 ? void 0 : overrides.minMs) !== null &&
      _e !== void 0
        ? _e
        : defaults === null || defaults === void 0
          ? void 0
          : defaults.minMs,
    maxMs:
      (_f = overrides === null || overrides === void 0 ? void 0 : overrides.maxMs) !== null &&
      _f !== void 0
        ? _f
        : defaults === null || defaults === void 0
          ? void 0
          : defaults.maxMs,
  };
}
