"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasNonzeroUsage = hasNonzeroUsage;
exports.normalizeUsage = normalizeUsage;
exports.derivePromptTokens = derivePromptTokens;
var asFiniteNumber = function (value) {
  if (typeof value !== "number") {
    return undefined;
  }
  if (!Number.isFinite(value)) {
    return undefined;
  }
  return value;
};
function hasNonzeroUsage(usage) {
  if (!usage) {
    return false;
  }
  return [usage.input, usage.output, usage.cacheRead, usage.cacheWrite, usage.total].some(
    function (v) {
      return typeof v === "number" && Number.isFinite(v) && v > 0;
    },
  );
}
function normalizeUsage(raw) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
  if (!raw) {
    return undefined;
  }
  var input = asFiniteNumber(
    (_d =
      (_c =
        (_b = (_a = raw.input) !== null && _a !== void 0 ? _a : raw.inputTokens) !== null &&
        _b !== void 0
          ? _b
          : raw.input_tokens) !== null && _c !== void 0
        ? _c
        : raw.promptTokens) !== null && _d !== void 0
      ? _d
      : raw.prompt_tokens,
  );
  var output = asFiniteNumber(
    (_h =
      (_g =
        (_f = (_e = raw.output) !== null && _e !== void 0 ? _e : raw.outputTokens) !== null &&
        _f !== void 0
          ? _f
          : raw.output_tokens) !== null && _g !== void 0
        ? _g
        : raw.completionTokens) !== null && _h !== void 0
      ? _h
      : raw.completion_tokens,
  );
  var cacheRead = asFiniteNumber(
    (_k = (_j = raw.cacheRead) !== null && _j !== void 0 ? _j : raw.cache_read) !== null &&
      _k !== void 0
      ? _k
      : raw.cache_read_input_tokens,
  );
  var cacheWrite = asFiniteNumber(
    (_m = (_l = raw.cacheWrite) !== null && _l !== void 0 ? _l : raw.cache_write) !== null &&
      _m !== void 0
      ? _m
      : raw.cache_creation_input_tokens,
  );
  var total = asFiniteNumber(
    (_p = (_o = raw.total) !== null && _o !== void 0 ? _o : raw.totalTokens) !== null &&
      _p !== void 0
      ? _p
      : raw.total_tokens,
  );
  if (
    input === undefined &&
    output === undefined &&
    cacheRead === undefined &&
    cacheWrite === undefined &&
    total === undefined
  ) {
    return undefined;
  }
  return {
    input: input,
    output: output,
    cacheRead: cacheRead,
    cacheWrite: cacheWrite,
    total: total,
  };
}
function derivePromptTokens(usage) {
  var _a, _b, _c;
  if (!usage) {
    return undefined;
  }
  var input = (_a = usage.input) !== null && _a !== void 0 ? _a : 0;
  var cacheRead = (_b = usage.cacheRead) !== null && _b !== void 0 ? _b : 0;
  var cacheWrite = (_c = usage.cacheWrite) !== null && _c !== void 0 ? _c : 0;
  var sum = input + cacheRead + cacheWrite;
  return sum > 0 ? sum : undefined;
}
