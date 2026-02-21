"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildInboundDedupeKey = buildInboundDedupeKey;
exports.shouldSkipDuplicateInbound = shouldSkipDuplicateInbound;
exports.resetInboundDedupe = resetInboundDedupe;
var globals_js_1 = require("../../globals.js");
var dedupe_js_1 = require("../../infra/dedupe.js");
var DEFAULT_INBOUND_DEDUPE_TTL_MS = 20 * 60000;
var DEFAULT_INBOUND_DEDUPE_MAX = 5000;
var inboundDedupeCache = (0, dedupe_js_1.createDedupeCache)({
  ttlMs: DEFAULT_INBOUND_DEDUPE_TTL_MS,
  maxSize: DEFAULT_INBOUND_DEDUPE_MAX,
});
var normalizeProvider = function (value) {
  return (value === null || value === void 0 ? void 0 : value.trim().toLowerCase()) || "";
};
var resolveInboundPeerId = function (ctx) {
  var _a, _b, _c;
  return (_c =
    (_b = (_a = ctx.OriginatingTo) !== null && _a !== void 0 ? _a : ctx.To) !== null &&
    _b !== void 0
      ? _b
      : ctx.From) !== null && _c !== void 0
    ? _c
    : ctx.SessionKey;
};
function buildInboundDedupeKey(ctx) {
  var _a, _b, _c, _d, _e, _f, _g;
  var provider = normalizeProvider(
    (_b = (_a = ctx.OriginatingChannel) !== null && _a !== void 0 ? _a : ctx.Provider) !== null &&
      _b !== void 0
      ? _b
      : ctx.Surface,
  );
  var messageId = (_c = ctx.MessageSid) === null || _c === void 0 ? void 0 : _c.trim();
  if (!provider || !messageId) {
    return null;
  }
  var peerId = resolveInboundPeerId(ctx);
  if (!peerId) {
    return null;
  }
  var sessionKey =
    (_e = (_d = ctx.SessionKey) === null || _d === void 0 ? void 0 : _d.trim()) !== null &&
    _e !== void 0
      ? _e
      : "";
  var accountId =
    (_g = (_f = ctx.AccountId) === null || _f === void 0 ? void 0 : _f.trim()) !== null &&
    _g !== void 0
      ? _g
      : "";
  var threadId =
    ctx.MessageThreadId !== undefined && ctx.MessageThreadId !== null
      ? String(ctx.MessageThreadId)
      : "";
  return [provider, accountId, sessionKey, peerId, threadId, messageId].filter(Boolean).join("|");
}
function shouldSkipDuplicateInbound(ctx, opts) {
  var _a;
  var key = buildInboundDedupeKey(ctx);
  if (!key) {
    return false;
  }
  var cache =
    (_a = opts === null || opts === void 0 ? void 0 : opts.cache) !== null && _a !== void 0
      ? _a
      : inboundDedupeCache;
  var skipped = cache.check(key, opts === null || opts === void 0 ? void 0 : opts.now);
  if (skipped && (0, globals_js_1.shouldLogVerbose)()) {
    (0, globals_js_1.logVerbose)("inbound dedupe: skipped ".concat(key));
  }
  return skipped;
}
function resetInboundDedupe() {
  inboundDedupeCache.clear();
}
