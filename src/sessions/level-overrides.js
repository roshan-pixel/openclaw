"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVerboseOverride = parseVerboseOverride;
exports.applyVerboseOverride = applyVerboseOverride;
var thinking_js_1 = require("../auto-reply/thinking.js");
function parseVerboseOverride(raw) {
  if (raw === null) {
    return { ok: true, value: null };
  }
  if (raw === undefined) {
    return { ok: true, value: undefined };
  }
  if (typeof raw !== "string") {
    return { ok: false, error: 'invalid verboseLevel (use "on"|"off")' };
  }
  var normalized = (0, thinking_js_1.normalizeVerboseLevel)(raw);
  if (!normalized) {
    return { ok: false, error: 'invalid verboseLevel (use "on"|"off")' };
  }
  return { ok: true, value: normalized };
}
function applyVerboseOverride(entry, level) {
  if (level === undefined) {
    return;
  }
  if (level === null) {
    delete entry.verboseLevel;
    return;
  }
  entry.verboseLevel = level;
}
