"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSlackTarget = parseSlackTarget;
exports.resolveSlackChannelId = resolveSlackChannelId;
var targets_js_1 = require("../channels/targets.js");
function parseSlackTarget(raw, options) {
  if (options === void 0) {
    options = {};
  }
  var trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }
  var mentionMatch = trimmed.match(/^<@([A-Z0-9]+)>$/i);
  if (mentionMatch) {
    return (0, targets_js_1.buildMessagingTarget)("user", mentionMatch[1], trimmed);
  }
  if (trimmed.startsWith("user:")) {
    var id = trimmed.slice("user:".length).trim();
    return id ? (0, targets_js_1.buildMessagingTarget)("user", id, trimmed) : undefined;
  }
  if (trimmed.startsWith("channel:")) {
    var id = trimmed.slice("channel:".length).trim();
    return id ? (0, targets_js_1.buildMessagingTarget)("channel", id, trimmed) : undefined;
  }
  if (trimmed.startsWith("slack:")) {
    var id = trimmed.slice("slack:".length).trim();
    return id ? (0, targets_js_1.buildMessagingTarget)("user", id, trimmed) : undefined;
  }
  if (trimmed.startsWith("@")) {
    var candidate = trimmed.slice(1).trim();
    var id = (0, targets_js_1.ensureTargetId)({
      candidate: candidate,
      pattern: /^[A-Z0-9]+$/i,
      errorMessage: "Slack DMs require a user id (use user:<id> or <@id>)",
    });
    return (0, targets_js_1.buildMessagingTarget)("user", id, trimmed);
  }
  if (trimmed.startsWith("#")) {
    var candidate = trimmed.slice(1).trim();
    var id = (0, targets_js_1.ensureTargetId)({
      candidate: candidate,
      pattern: /^[A-Z0-9]+$/i,
      errorMessage: "Slack channels require a channel id (use channel:<id>)",
    });
    return (0, targets_js_1.buildMessagingTarget)("channel", id, trimmed);
  }
  if (options.defaultKind) {
    return (0, targets_js_1.buildMessagingTarget)(options.defaultKind, trimmed, trimmed);
  }
  return (0, targets_js_1.buildMessagingTarget)("channel", trimmed, trimmed);
}
function resolveSlackChannelId(raw) {
  var target = parseSlackTarget(raw, { defaultKind: "channel" });
  return (0, targets_js_1.requireTargetKind)({
    platform: "Slack",
    target: target,
    kind: "channel",
  });
}
