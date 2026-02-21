"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAbsoluteTimeMs = parseAbsoluteTimeMs;
var ISO_TZ_RE = /(Z|[+-]\d{2}:?\d{2})$/i;
var ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
var ISO_DATE_TIME_RE = /^\d{4}-\d{2}-\d{2}T/;
function normalizeUtcIso(raw) {
  if (ISO_TZ_RE.test(raw)) {
    return raw;
  }
  if (ISO_DATE_RE.test(raw)) {
    return "".concat(raw, "T00:00:00Z");
  }
  if (ISO_DATE_TIME_RE.test(raw)) {
    return "".concat(raw, "Z");
  }
  return raw;
}
function parseAbsoluteTimeMs(input) {
  var raw = input.trim();
  if (!raw) {
    return null;
  }
  if (/^\d+$/.test(raw)) {
    var n = Number(raw);
    if (Number.isFinite(n) && n > 0) {
      return Math.floor(n);
    }
  }
  var parsed = Date.parse(normalizeUtcIso(raw));
  return Number.isFinite(parsed) ? parsed : null;
}
