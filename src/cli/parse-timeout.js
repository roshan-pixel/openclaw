"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeoutMs = parseTimeoutMs;
function parseTimeoutMs(raw) {
  if (raw === undefined || raw === null) {
    return undefined;
  }
  var value = Number.NaN;
  if (typeof raw === "number") {
    value = raw;
  } else if (typeof raw === "bigint") {
    value = Number(raw);
  } else if (typeof raw === "string") {
    var trimmed = raw.trim();
    if (!trimmed) {
      return undefined;
    }
    value = Number.parseInt(trimmed, 10);
  }
  return Number.isFinite(value) ? value : undefined;
}
