"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAgentTimeoutSeconds = resolveAgentTimeoutSeconds;
exports.resolveAgentTimeoutMs = resolveAgentTimeoutMs;
var DEFAULT_AGENT_TIMEOUT_SECONDS = 600;
var normalizeNumber = function (value) {
  return typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : undefined;
};
function resolveAgentTimeoutSeconds(cfg) {
  var _a, _b;
  var raw = normalizeNumber(
    (_b =
      (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0
        ? void 0
        : _a.defaults) === null || _b === void 0
      ? void 0
      : _b.timeoutSeconds,
  );
  var seconds = raw !== null && raw !== void 0 ? raw : DEFAULT_AGENT_TIMEOUT_SECONDS;
  return Math.max(seconds, 1);
}
function resolveAgentTimeoutMs(opts) {
  var _a;
  var minMs = Math.max((_a = normalizeNumber(opts.minMs)) !== null && _a !== void 0 ? _a : 1, 1);
  var defaultMs = resolveAgentTimeoutSeconds(opts.cfg) * 1000;
  var overrideMs = normalizeNumber(opts.overrideMs);
  if (overrideMs !== undefined) {
    if (overrideMs <= 0) {
      return defaultMs;
    }
    return Math.max(overrideMs, minMs);
  }
  var overrideSeconds = normalizeNumber(opts.overrideSeconds);
  if (overrideSeconds !== undefined) {
    if (overrideSeconds <= 0) {
      return defaultMs;
    }
    return Math.max(overrideSeconds * 1000, minMs);
  }
  return Math.max(defaultMs, minMs);
}
