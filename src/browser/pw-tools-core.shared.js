"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bumpUploadArmId = bumpUploadArmId;
exports.bumpDialogArmId = bumpDialogArmId;
exports.bumpDownloadArmId = bumpDownloadArmId;
exports.requireRef = requireRef;
exports.normalizeTimeoutMs = normalizeTimeoutMs;
exports.toAIFriendlyError = toAIFriendlyError;
var pw_role_snapshot_js_1 = require("./pw-role-snapshot.js");
var nextUploadArmId = 0;
var nextDialogArmId = 0;
var nextDownloadArmId = 0;
function bumpUploadArmId() {
  nextUploadArmId += 1;
  return nextUploadArmId;
}
function bumpDialogArmId() {
  nextDialogArmId += 1;
  return nextDialogArmId;
}
function bumpDownloadArmId() {
  nextDownloadArmId += 1;
  return nextDownloadArmId;
}
function requireRef(value) {
  var raw = typeof value === "string" ? value.trim() : "";
  var roleRef = raw ? (0, pw_role_snapshot_js_1.parseRoleRef)(raw) : null;
  var ref =
    roleRef !== null && roleRef !== void 0 ? roleRef : raw.startsWith("@") ? raw.slice(1) : raw;
  if (!ref) {
    throw new Error("ref is required");
  }
  return ref;
}
function normalizeTimeoutMs(timeoutMs, fallback) {
  return Math.max(
    500,
    Math.min(120000, timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : fallback),
  );
}
function toAIFriendlyError(error, selector) {
  var message = error instanceof Error ? error.message : String(error);
  if (message.includes("strict mode violation")) {
    var countMatch = message.match(/resolved to (\d+) elements/);
    var count = countMatch ? countMatch[1] : "multiple";
    return new Error(
      'Selector "'.concat(selector, '" matched ').concat(count, " elements. ") +
        "Run a new snapshot to get updated refs, or use a different ref.",
    );
  }
  if (
    (message.includes("Timeout") || message.includes("waiting for")) &&
    (message.includes("to be visible") || message.includes("not visible"))
  ) {
    return new Error(
      'Element "'.concat(selector, '" not found or not visible. ') +
        "Run a new snapshot to see current page elements.",
    );
  }
  if (
    message.includes("intercepts pointer events") ||
    message.includes("not visible") ||
    message.includes("not receive pointer events")
  ) {
    return new Error(
      'Element "'.concat(selector, '" is not interactable (hidden or covered). ') +
        "Try scrolling it into view, closing overlays, or re-snapshotting.",
    );
  }
  return error instanceof Error ? error : new Error(message);
}
