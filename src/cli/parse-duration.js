"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDurationMs = parseDurationMs;
function parseDurationMs(raw, opts) {
  var _a, _b;
  var trimmed = String(raw !== null && raw !== void 0 ? raw : "")
    .trim()
    .toLowerCase();
  if (!trimmed) {
    throw new Error("invalid duration (empty)");
  }
  var m = /^(\d+(?:\.\d+)?)(ms|s|m|h|d)?$/.exec(trimmed);
  if (!m) {
    throw new Error("invalid duration: ".concat(raw));
  }
  var value = Number(m[1]);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error("invalid duration: ".concat(raw));
  }
  var unit =
    (_b =
      (_a = m[2]) !== null && _a !== void 0
        ? _a
        : opts === null || opts === void 0
          ? void 0
          : opts.defaultUnit) !== null && _b !== void 0
      ? _b
      : "ms";
  var multiplier =
    unit === "ms"
      ? 1
      : unit === "s"
        ? 1000
        : unit === "m"
          ? 60000
          : unit === "h"
            ? 3600000
            : 86400000;
  var ms = Math.round(value * multiplier);
  if (!Number.isFinite(ms)) {
    throw new Error("invalid duration: ".concat(raw));
  }
  return ms;
}
