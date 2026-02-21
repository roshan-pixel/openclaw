"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSlackMessagingTarget = normalizeSlackMessagingTarget;
exports.looksLikeSlackTargetId = looksLikeSlackTargetId;
var targets_js_1 = require("../../../slack/targets.js");
function normalizeSlackMessagingTarget(raw) {
  var target = (0, targets_js_1.parseSlackTarget)(raw, { defaultKind: "channel" });
  return target === null || target === void 0 ? void 0 : target.normalized;
}
function looksLikeSlackTargetId(raw) {
  var trimmed = raw.trim();
  if (!trimmed) {
    return false;
  }
  if (/^<@([A-Z0-9]+)>$/i.test(trimmed)) {
    return true;
  }
  if (/^(user|channel):/i.test(trimmed)) {
    return true;
  }
  if (/^slack:/i.test(trimmed)) {
    return true;
  }
  if (/^[@#]/.test(trimmed)) {
    return true;
  }
  return /^[CUWGD][A-Z0-9]{8,}$/i.test(trimmed);
}
