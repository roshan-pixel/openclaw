"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_RESET_AT_HOUR = exports.DEFAULT_RESET_MODE = void 0;
exports.isThreadSessionKey = isThreadSessionKey;
exports.resolveSessionResetType = resolveSessionResetType;
exports.resolveThreadFlag = resolveThreadFlag;
exports.resolveDailyResetAtMs = resolveDailyResetAtMs;
exports.resolveSessionResetPolicy = resolveSessionResetPolicy;
exports.resolveChannelResetConfig = resolveChannelResetConfig;
exports.evaluateSessionFreshness = evaluateSessionFreshness;
var types_js_1 = require("./types.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
exports.DEFAULT_RESET_MODE = "daily";
exports.DEFAULT_RESET_AT_HOUR = 4;
var THREAD_SESSION_MARKERS = [":thread:", ":topic:"];
var GROUP_SESSION_MARKERS = [":group:", ":channel:"];
function isThreadSessionKey(sessionKey) {
  var normalized = (sessionKey !== null && sessionKey !== void 0 ? sessionKey : "").toLowerCase();
  if (!normalized) {
    return false;
  }
  return THREAD_SESSION_MARKERS.some(function (marker) {
    return normalized.includes(marker);
  });
}
function resolveSessionResetType(params) {
  var _a;
  if (params.isThread || isThreadSessionKey(params.sessionKey)) {
    return "thread";
  }
  if (params.isGroup) {
    return "group";
  }
  var normalized = ((_a = params.sessionKey) !== null && _a !== void 0 ? _a : "").toLowerCase();
  if (
    GROUP_SESSION_MARKERS.some(function (marker) {
      return normalized.includes(marker);
    })
  ) {
    return "group";
  }
  return "dm";
}
function resolveThreadFlag(params) {
  var _a, _b, _c;
  if (params.messageThreadId != null) {
    return true;
  }
  if ((_a = params.threadLabel) === null || _a === void 0 ? void 0 : _a.trim()) {
    return true;
  }
  if ((_b = params.threadStarterBody) === null || _b === void 0 ? void 0 : _b.trim()) {
    return true;
  }
  if ((_c = params.parentSessionKey) === null || _c === void 0 ? void 0 : _c.trim()) {
    return true;
  }
  return isThreadSessionKey(params.sessionKey);
}
function resolveDailyResetAtMs(now, atHour) {
  var normalizedAtHour = normalizeResetAtHour(atHour);
  var resetAt = new Date(now);
  resetAt.setHours(normalizedAtHour, 0, 0, 0);
  if (now < resetAt.getTime()) {
    resetAt.setDate(resetAt.getDate() - 1);
  }
  return resetAt.getTime();
}
function resolveSessionResetPolicy(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  var sessionCfg = params.sessionCfg;
  var baseReset =
    (_a = params.resetOverride) !== null && _a !== void 0
      ? _a
      : sessionCfg === null || sessionCfg === void 0
        ? void 0
        : sessionCfg.reset;
  var typeReset = params.resetOverride
    ? undefined
    : (_b = sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.resetByType) ===
          null || _b === void 0
      ? void 0
      : _b[params.resetType];
  var hasExplicitReset = Boolean(
    baseReset || (sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.resetByType),
  );
  var legacyIdleMinutes = params.resetOverride
    ? undefined
    : sessionCfg === null || sessionCfg === void 0
      ? void 0
      : sessionCfg.idleMinutes;
  var mode =
    (_d =
      (_c = typeReset === null || typeReset === void 0 ? void 0 : typeReset.mode) !== null &&
      _c !== void 0
        ? _c
        : baseReset === null || baseReset === void 0
          ? void 0
          : baseReset.mode) !== null && _d !== void 0
      ? _d
      : !hasExplicitReset && legacyIdleMinutes != null
        ? "idle"
        : exports.DEFAULT_RESET_MODE;
  var atHour = normalizeResetAtHour(
    (_f =
      (_e = typeReset === null || typeReset === void 0 ? void 0 : typeReset.atHour) !== null &&
      _e !== void 0
        ? _e
        : baseReset === null || baseReset === void 0
          ? void 0
          : baseReset.atHour) !== null && _f !== void 0
      ? _f
      : exports.DEFAULT_RESET_AT_HOUR,
  );
  var idleMinutesRaw =
    (_h =
      (_g = typeReset === null || typeReset === void 0 ? void 0 : typeReset.idleMinutes) !== null &&
      _g !== void 0
        ? _g
        : baseReset === null || baseReset === void 0
          ? void 0
          : baseReset.idleMinutes) !== null && _h !== void 0
      ? _h
      : legacyIdleMinutes;
  var idleMinutes;
  if (idleMinutesRaw != null) {
    var normalized = Math.floor(idleMinutesRaw);
    if (Number.isFinite(normalized)) {
      idleMinutes = Math.max(normalized, 1);
    }
  } else if (mode === "idle") {
    idleMinutes = types_js_1.DEFAULT_IDLE_MINUTES;
  }
  return { mode: mode, atHour: atHour, idleMinutes: idleMinutes };
}
function resolveChannelResetConfig(params) {
  var _a, _b, _c;
  var resetByChannel =
    (_a = params.sessionCfg) === null || _a === void 0 ? void 0 : _a.resetByChannel;
  if (!resetByChannel) {
    return undefined;
  }
  var normalized = (0, message_channel_js_1.normalizeMessageChannel)(params.channel);
  var fallback = (_b = params.channel) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase();
  var key = normalized !== null && normalized !== void 0 ? normalized : fallback;
  if (!key) {
    return undefined;
  }
  return (_c = resetByChannel[key]) !== null && _c !== void 0
    ? _c
    : resetByChannel[key.toLowerCase()];
}
function evaluateSessionFreshness(params) {
  var dailyResetAt =
    params.policy.mode === "daily"
      ? resolveDailyResetAtMs(params.now, params.policy.atHour)
      : undefined;
  var idleExpiresAt =
    params.policy.idleMinutes != null
      ? params.updatedAt + params.policy.idleMinutes * 60000
      : undefined;
  var staleDaily = dailyResetAt != null && params.updatedAt < dailyResetAt;
  var staleIdle = idleExpiresAt != null && params.now > idleExpiresAt;
  return {
    fresh: !(staleDaily || staleIdle),
    dailyResetAt: dailyResetAt,
    idleExpiresAt: idleExpiresAt,
  };
}
function normalizeResetAtHour(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return exports.DEFAULT_RESET_AT_HOUR;
  }
  var normalized = Math.floor(value);
  if (!Number.isFinite(normalized)) {
    return exports.DEFAULT_RESET_AT_HOUR;
  }
  if (normalized < 0) {
    return 0;
  }
  if (normalized > 23) {
    return 23;
  }
  return normalized;
}
