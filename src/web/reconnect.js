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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleepWithAbort =
  exports.computeBackoff =
  exports.DEFAULT_RECONNECT_POLICY =
  exports.DEFAULT_HEARTBEAT_SECONDS =
    void 0;
exports.resolveHeartbeatSeconds = resolveHeartbeatSeconds;
exports.resolveReconnectPolicy = resolveReconnectPolicy;
exports.newConnectionId = newConnectionId;
var node_crypto_1 = require("node:crypto");
var backoff_js_1 = require("../infra/backoff.js");
Object.defineProperty(exports, "computeBackoff", {
  enumerable: true,
  get: function () {
    return backoff_js_1.computeBackoff;
  },
});
Object.defineProperty(exports, "sleepWithAbort", {
  enumerable: true,
  get: function () {
    return backoff_js_1.sleepWithAbort;
  },
});
exports.DEFAULT_HEARTBEAT_SECONDS = 60;
exports.DEFAULT_RECONNECT_POLICY = {
  initialMs: 2000,
  maxMs: 30000,
  factor: 1.8,
  jitter: 0.25,
  maxAttempts: 12,
};
var clamp = function (val, min, max) {
  return Math.max(min, Math.min(max, val));
};
function resolveHeartbeatSeconds(cfg, overrideSeconds) {
  var _a;
  var candidate =
    overrideSeconds !== null && overrideSeconds !== void 0
      ? overrideSeconds
      : (_a = cfg.web) === null || _a === void 0
        ? void 0
        : _a.heartbeatSeconds;
  if (typeof candidate === "number" && candidate > 0) {
    return candidate;
  }
  return exports.DEFAULT_HEARTBEAT_SECONDS;
}
function resolveReconnectPolicy(cfg, overrides) {
  var _a, _b;
  var reconnectOverrides =
    (_b = (_a = cfg.web) === null || _a === void 0 ? void 0 : _a.reconnect) !== null &&
    _b !== void 0
      ? _b
      : {};
  var overrideConfig = overrides !== null && overrides !== void 0 ? overrides : {};
  var merged = __assign(
    __assign(__assign({}, exports.DEFAULT_RECONNECT_POLICY), reconnectOverrides),
    overrideConfig,
  );
  merged.initialMs = Math.max(250, merged.initialMs);
  merged.maxMs = Math.max(merged.initialMs, merged.maxMs);
  merged.factor = clamp(merged.factor, 1.1, 10);
  merged.jitter = clamp(merged.jitter, 0, 1);
  merged.maxAttempts = Math.max(0, Math.floor(merged.maxAttempts));
  return merged;
}
function newConnectionId() {
  return (0, node_crypto_1.randomUUID)();
}
