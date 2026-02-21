"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAnnounceTargetFromKey = resolveAnnounceTargetFromKey;
exports.buildAgentToAgentMessageContext = buildAgentToAgentMessageContext;
exports.buildAgentToAgentReplyContext = buildAgentToAgentReplyContext;
exports.buildAgentToAgentAnnounceContext = buildAgentToAgentAnnounceContext;
exports.isAnnounceSkip = isAnnounceSkip;
exports.isReplySkip = isReplySkip;
exports.resolvePingPongTurns = resolvePingPongTurns;
var index_js_1 = require("../../channels/plugins/index.js");
var registry_js_1 = require("../../channels/registry.js");
var ANNOUNCE_SKIP_TOKEN = "ANNOUNCE_SKIP";
var REPLY_SKIP_TOKEN = "REPLY_SKIP";
var DEFAULT_PING_PONG_TURNS = 5;
var MAX_PING_PONG_TURNS = 5;
function resolveAnnounceTargetFromKey(sessionKey) {
  var _a, _b, _c, _d;
  var rawParts = sessionKey.split(":").filter(Boolean);
  var parts = rawParts.length >= 3 && rawParts[0] === "agent" ? rawParts.slice(2) : rawParts;
  if (parts.length < 3) {
    return null;
  }
  var channelRaw = parts[0],
    kind = parts[1],
    rest = parts.slice(2);
  if (kind !== "group" && kind !== "channel") {
    return null;
  }
  // Extract topic/thread ID from rest (supports both :topic: and :thread:)
  // Telegram uses :topic:, other platforms use :thread:
  var threadId;
  var restJoined = rest.join(":");
  var topicMatch = restJoined.match(/:topic:(\d+)$/);
  var threadMatch = restJoined.match(/:thread:(\d+)$/);
  var match = topicMatch || threadMatch;
  if (match) {
    threadId = match[1]; // Keep as string to match AgentCommandOpts.threadId
  }
  // Remove :topic:N or :thread:N suffix from ID for target
  var id = match ? restJoined.replace(/:(topic|thread):\d+$/, "") : restJoined.trim();
  if (!id) {
    return null;
  }
  if (!channelRaw) {
    return null;
  }
  var normalizedChannel =
    (_a = (0, index_js_1.normalizeChannelId)(channelRaw)) !== null && _a !== void 0
      ? _a
      : (0, registry_js_1.normalizeChannelId)(channelRaw);
  var channel =
    normalizedChannel !== null && normalizedChannel !== void 0
      ? normalizedChannel
      : channelRaw.toLowerCase();
  var kindTarget = (function () {
    if (!normalizedChannel) {
      return id;
    }
    if (normalizedChannel === "discord" || normalizedChannel === "slack") {
      return "channel:".concat(id);
    }
    return kind === "channel" ? "channel:".concat(id) : "group:".concat(id);
  })();
  var normalized = normalizedChannel
    ? (_d =
        (_c =
          (_b = (0, index_js_1.getChannelPlugin)(normalizedChannel)) === null || _b === void 0
            ? void 0
            : _b.messaging) === null || _c === void 0
          ? void 0
          : _c.normalizeTarget) === null || _d === void 0
      ? void 0
      : _d.call(_c, kindTarget)
    : undefined;
  return {
    channel: channel,
    to: normalized !== null && normalized !== void 0 ? normalized : kindTarget,
    threadId: threadId,
  };
}
function buildAgentToAgentMessageContext(params) {
  var lines = [
    "Agent-to-agent message context:",
    params.requesterSessionKey
      ? "Agent 1 (requester) session: ".concat(params.requesterSessionKey, ".")
      : undefined,
    params.requesterChannel
      ? "Agent 1 (requester) channel: ".concat(params.requesterChannel, ".")
      : undefined,
    "Agent 2 (target) session: ".concat(params.targetSessionKey, "."),
  ].filter(Boolean);
  return lines.join("\n");
}
function buildAgentToAgentReplyContext(params) {
  var currentLabel =
    params.currentRole === "requester" ? "Agent 1 (requester)" : "Agent 2 (target)";
  var lines = [
    "Agent-to-agent reply step:",
    "Current agent: ".concat(currentLabel, "."),
    "Turn ".concat(params.turn, " of ").concat(params.maxTurns, "."),
    params.requesterSessionKey
      ? "Agent 1 (requester) session: ".concat(params.requesterSessionKey, ".")
      : undefined,
    params.requesterChannel
      ? "Agent 1 (requester) channel: ".concat(params.requesterChannel, ".")
      : undefined,
    "Agent 2 (target) session: ".concat(params.targetSessionKey, "."),
    params.targetChannel
      ? "Agent 2 (target) channel: ".concat(params.targetChannel, ".")
      : undefined,
    'If you want to stop the ping-pong, reply exactly "'.concat(REPLY_SKIP_TOKEN, '".'),
  ].filter(Boolean);
  return lines.join("\n");
}
function buildAgentToAgentAnnounceContext(params) {
  var lines = [
    "Agent-to-agent announce step:",
    params.requesterSessionKey
      ? "Agent 1 (requester) session: ".concat(params.requesterSessionKey, ".")
      : undefined,
    params.requesterChannel
      ? "Agent 1 (requester) channel: ".concat(params.requesterChannel, ".")
      : undefined,
    "Agent 2 (target) session: ".concat(params.targetSessionKey, "."),
    params.targetChannel
      ? "Agent 2 (target) channel: ".concat(params.targetChannel, ".")
      : undefined,
    "Original request: ".concat(params.originalMessage),
    params.roundOneReply
      ? "Round 1 reply: ".concat(params.roundOneReply)
      : "Round 1 reply: (not available).",
    params.latestReply
      ? "Latest reply: ".concat(params.latestReply)
      : "Latest reply: (not available).",
    'If you want to remain silent, reply exactly "'.concat(ANNOUNCE_SKIP_TOKEN, '".'),
    "Any other reply will be posted to the target channel.",
    "After this reply, the agent-to-agent conversation is over.",
  ].filter(Boolean);
  return lines.join("\n");
}
function isAnnounceSkip(text) {
  return (text !== null && text !== void 0 ? text : "").trim() === ANNOUNCE_SKIP_TOKEN;
}
function isReplySkip(text) {
  return (text !== null && text !== void 0 ? text : "").trim() === REPLY_SKIP_TOKEN;
}
function resolvePingPongTurns(cfg) {
  var _a, _b;
  var raw =
    (_b =
      (_a = cfg === null || cfg === void 0 ? void 0 : cfg.session) === null || _a === void 0
        ? void 0
        : _a.agentToAgent) === null || _b === void 0
      ? void 0
      : _b.maxPingPongTurns;
  var fallback = DEFAULT_PING_PONG_TURNS;
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return fallback;
  }
  var rounded = Math.floor(raw);
  return Math.max(0, Math.min(MAX_PING_PONG_TURNS, rounded));
}
