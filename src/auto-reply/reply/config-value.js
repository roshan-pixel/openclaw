"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseConfigValue = parseConfigValue;
function parseConfigValue(raw) {
  var trimmed = raw.trim();
  if (!trimmed) {
    return { error: "Missing value." };
  }
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return { value: JSON.parse(trimmed) };
    } catch (err) {
      return { error: "Invalid JSON: ".concat(String(err)) };
    }
  }
  if (trimmed === "true") {
    return { value: true };
  }
  if (trimmed === "false") {
    return { value: false };
  }
  if (trimmed === "null") {
    return { value: null };
  }
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    var num = Number(trimmed);
    if (Number.isFinite(num)) {
      return { value: num };
    }
  }
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    try {
      return { value: JSON.parse(trimmed) };
    } catch (_a) {
      var unquoted = trimmed.slice(1, -1);
      return { value: unquoted };
    }
  }
  return { value: trimmed };
}
