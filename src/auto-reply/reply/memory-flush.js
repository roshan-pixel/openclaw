"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MEMORY_FLUSH_SYSTEM_PROMPT =
  exports.DEFAULT_MEMORY_FLUSH_PROMPT =
  exports.DEFAULT_MEMORY_FLUSH_SOFT_TOKENS =
    void 0;
exports.resolveMemoryFlushSettings = resolveMemoryFlushSettings;
exports.resolveMemoryFlushContextWindowTokens = resolveMemoryFlushContextWindowTokens;
exports.shouldRunMemoryFlush = shouldRunMemoryFlush;
var context_js_1 = require("../../agents/context.js");
var defaults_js_1 = require("../../agents/defaults.js");
var pi_settings_js_1 = require("../../agents/pi-settings.js");
var tokens_js_1 = require("../tokens.js");
exports.DEFAULT_MEMORY_FLUSH_SOFT_TOKENS = 4000;
exports.DEFAULT_MEMORY_FLUSH_PROMPT = [
  "Pre-compaction memory flush.",
  "Store durable memories now (use memory/YYYY-MM-DD.md; create memory/ if needed).",
  "If nothing to store, reply with ".concat(tokens_js_1.SILENT_REPLY_TOKEN, "."),
].join(" ");
exports.DEFAULT_MEMORY_FLUSH_SYSTEM_PROMPT = [
  "Pre-compaction memory flush turn.",
  "The session is near auto-compaction; capture durable memories to disk.",
  "You may reply, but usually ".concat(tokens_js_1.SILENT_REPLY_TOKEN, " is correct."),
].join(" ");
var normalizeNonNegativeInt = function (value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }
  var int = Math.floor(value);
  return int >= 0 ? int : null;
};
function resolveMemoryFlushSettings(cfg) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
  var defaults =
    (_c =
      (_b =
        (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0
          ? void 0
          : _a.defaults) === null || _b === void 0
        ? void 0
        : _b.compaction) === null || _c === void 0
      ? void 0
      : _c.memoryFlush;
  var enabled =
    (_d = defaults === null || defaults === void 0 ? void 0 : defaults.enabled) !== null &&
    _d !== void 0
      ? _d
      : true;
  if (!enabled) {
    return null;
  }
  var softThresholdTokens =
    (_e = normalizeNonNegativeInt(
      defaults === null || defaults === void 0 ? void 0 : defaults.softThresholdTokens,
    )) !== null && _e !== void 0
      ? _e
      : exports.DEFAULT_MEMORY_FLUSH_SOFT_TOKENS;
  var prompt =
    ((_f = defaults === null || defaults === void 0 ? void 0 : defaults.prompt) === null ||
    _f === void 0
      ? void 0
      : _f.trim()) || exports.DEFAULT_MEMORY_FLUSH_PROMPT;
  var systemPrompt =
    ((_g = defaults === null || defaults === void 0 ? void 0 : defaults.systemPrompt) === null ||
    _g === void 0
      ? void 0
      : _g.trim()) || exports.DEFAULT_MEMORY_FLUSH_SYSTEM_PROMPT;
  var reserveTokensFloor =
    (_l = normalizeNonNegativeInt(
      (_k =
        (_j =
          (_h = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _h === void 0
            ? void 0
            : _h.defaults) === null || _j === void 0
          ? void 0
          : _j.compaction) === null || _k === void 0
        ? void 0
        : _k.reserveTokensFloor,
    )) !== null && _l !== void 0
      ? _l
      : pi_settings_js_1.DEFAULT_PI_COMPACTION_RESERVE_TOKENS_FLOOR;
  return {
    enabled: enabled,
    softThresholdTokens: softThresholdTokens,
    prompt: ensureNoReplyHint(prompt),
    systemPrompt: ensureNoReplyHint(systemPrompt),
    reserveTokensFloor: reserveTokensFloor,
  };
}
function ensureNoReplyHint(text) {
  if (text.includes(tokens_js_1.SILENT_REPLY_TOKEN)) {
    return text;
  }
  return ""
    .concat(text, "\n\nIf no user-visible reply is needed, start with ")
    .concat(tokens_js_1.SILENT_REPLY_TOKEN, ".");
}
function resolveMemoryFlushContextWindowTokens(params) {
  var _a, _b;
  return (_b =
    (_a = (0, context_js_1.lookupContextTokens)(params.modelId)) !== null && _a !== void 0
      ? _a
      : params.agentCfgContextTokens) !== null && _b !== void 0
    ? _b
    : defaults_js_1.DEFAULT_CONTEXT_TOKENS;
}
function shouldRunMemoryFlush(params) {
  var _a, _b, _c, _d;
  var totalTokens = (_a = params.entry) === null || _a === void 0 ? void 0 : _a.totalTokens;
  if (!totalTokens || totalTokens <= 0) {
    return false;
  }
  var contextWindow = Math.max(1, Math.floor(params.contextWindowTokens));
  var reserveTokens = Math.max(0, Math.floor(params.reserveTokensFloor));
  var softThreshold = Math.max(0, Math.floor(params.softThresholdTokens));
  var threshold = Math.max(0, contextWindow - reserveTokens - softThreshold);
  if (threshold <= 0) {
    return false;
  }
  if (totalTokens < threshold) {
    return false;
  }
  var compactionCount =
    (_c = (_b = params.entry) === null || _b === void 0 ? void 0 : _b.compactionCount) !== null &&
    _c !== void 0
      ? _c
      : 0;
  var lastFlushAt =
    (_d = params.entry) === null || _d === void 0 ? void 0 : _d.memoryFlushCompactionCount;
  if (typeof lastFlushAt === "number" && lastFlushAt === compactionCount) {
    return false;
  }
  return true;
}
