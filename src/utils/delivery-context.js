"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDeliveryContext = normalizeDeliveryContext;
exports.normalizeSessionDeliveryFields = normalizeSessionDeliveryFields;
exports.deliveryContextFromSession = deliveryContextFromSession;
exports.mergeDeliveryContext = mergeDeliveryContext;
exports.deliveryContextKey = deliveryContextKey;
var account_id_js_1 = require("./account-id.js");
var message_channel_js_1 = require("./message-channel.js");
function normalizeDeliveryContext(context) {
  var _a;
  if (!context) {
    return undefined;
  }
  var channel =
    typeof context.channel === "string"
      ? (_a = (0, message_channel_js_1.normalizeMessageChannel)(context.channel)) !== null &&
        _a !== void 0
        ? _a
        : context.channel.trim()
      : undefined;
  var to = typeof context.to === "string" ? context.to.trim() : undefined;
  var accountId = (0, account_id_js_1.normalizeAccountId)(context.accountId);
  var threadId =
    typeof context.threadId === "number" && Number.isFinite(context.threadId)
      ? Math.trunc(context.threadId)
      : typeof context.threadId === "string"
        ? context.threadId.trim()
        : undefined;
  var normalizedThreadId =
    typeof threadId === "string" ? (threadId ? threadId : undefined) : threadId;
  if (!channel && !to && !accountId && normalizedThreadId == null) {
    return undefined;
  }
  var normalized = {
    channel: channel || undefined,
    to: to || undefined,
    accountId: accountId,
  };
  if (normalizedThreadId != null) {
    normalized.threadId = normalizedThreadId;
  }
  return normalized;
}
function normalizeSessionDeliveryFields(source) {
  var _a;
  if (!source) {
    return {
      deliveryContext: undefined,
      lastChannel: undefined,
      lastTo: undefined,
      lastAccountId: undefined,
      lastThreadId: undefined,
    };
  }
  var merged = mergeDeliveryContext(
    normalizeDeliveryContext({
      channel: (_a = source.lastChannel) !== null && _a !== void 0 ? _a : source.channel,
      to: source.lastTo,
      accountId: source.lastAccountId,
      threadId: source.lastThreadId,
    }),
    normalizeDeliveryContext(source.deliveryContext),
  );
  if (!merged) {
    return {
      deliveryContext: undefined,
      lastChannel: undefined,
      lastTo: undefined,
      lastAccountId: undefined,
      lastThreadId: undefined,
    };
  }
  return {
    deliveryContext: merged,
    lastChannel: merged.channel,
    lastTo: merged.to,
    lastAccountId: merged.accountId,
    lastThreadId: merged.threadId,
  };
}
function deliveryContextFromSession(entry) {
  if (!entry) {
    return undefined;
  }
  return normalizeSessionDeliveryFields(entry).deliveryContext;
}
function mergeDeliveryContext(primary, fallback) {
  var _a, _b, _c, _d;
  var normalizedPrimary = normalizeDeliveryContext(primary);
  var normalizedFallback = normalizeDeliveryContext(fallback);
  if (!normalizedPrimary && !normalizedFallback) {
    return undefined;
  }
  return normalizeDeliveryContext({
    channel:
      (_a =
        normalizedPrimary === null || normalizedPrimary === void 0
          ? void 0
          : normalizedPrimary.channel) !== null && _a !== void 0
        ? _a
        : normalizedFallback === null || normalizedFallback === void 0
          ? void 0
          : normalizedFallback.channel,
    to:
      (_b =
        normalizedPrimary === null || normalizedPrimary === void 0
          ? void 0
          : normalizedPrimary.to) !== null && _b !== void 0
        ? _b
        : normalizedFallback === null || normalizedFallback === void 0
          ? void 0
          : normalizedFallback.to,
    accountId:
      (_c =
        normalizedPrimary === null || normalizedPrimary === void 0
          ? void 0
          : normalizedPrimary.accountId) !== null && _c !== void 0
        ? _c
        : normalizedFallback === null || normalizedFallback === void 0
          ? void 0
          : normalizedFallback.accountId,
    threadId:
      (_d =
        normalizedPrimary === null || normalizedPrimary === void 0
          ? void 0
          : normalizedPrimary.threadId) !== null && _d !== void 0
        ? _d
        : normalizedFallback === null || normalizedFallback === void 0
          ? void 0
          : normalizedFallback.threadId,
  });
}
function deliveryContextKey(context) {
  var _a;
  var normalized = normalizeDeliveryContext(context);
  if (
    !(normalized === null || normalized === void 0 ? void 0 : normalized.channel) ||
    !(normalized === null || normalized === void 0 ? void 0 : normalized.to)
  ) {
    return undefined;
  }
  var threadId =
    normalized.threadId != null && normalized.threadId !== "" ? String(normalized.threadId) : "";
  return ""
    .concat(normalized.channel, "|")
    .concat(normalized.to, "|")
    .concat((_a = normalized.accountId) !== null && _a !== void 0 ? _a : "", "|")
    .concat(threadId);
}
