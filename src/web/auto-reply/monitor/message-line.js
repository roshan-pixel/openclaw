"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatReplyContext = formatReplyContext;
exports.buildInboundLine = buildInboundLine;
var identity_js_1 = require("../../../agents/identity.js");
var envelope_js_1 = require("../../../auto-reply/envelope.js");
function formatReplyContext(msg) {
  var _a;
  if (!msg.replyToBody) {
    return null;
  }
  var sender = (_a = msg.replyToSender) !== null && _a !== void 0 ? _a : "unknown sender";
  var idPart = msg.replyToId ? " id:".concat(msg.replyToId) : "";
  return "[Replying to "
    .concat(sender)
    .concat(idPart, "]\n")
    .concat(msg.replyToBody, "\n[/Replying]");
}
function buildInboundLine(params) {
  var _a, _b, _c, _d, _e, _f, _g;
  var cfg = params.cfg,
    msg = params.msg,
    agentId = params.agentId,
    previousTimestamp = params.previousTimestamp,
    envelope = params.envelope;
  // WhatsApp inbound prefix: channels.whatsapp.messagePrefix > legacy messages.messagePrefix > identity/defaults
  var messagePrefix = (0, identity_js_1.resolveMessagePrefix)(cfg, agentId, {
    configured:
      (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.whatsapp) === null ||
      _b === void 0
        ? void 0
        : _b.messagePrefix,
    hasAllowFrom:
      ((_f =
        (_e =
          (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.whatsapp) === null ||
          _d === void 0
            ? void 0
            : _d.allowFrom) === null || _e === void 0
          ? void 0
          : _e.length) !== null && _f !== void 0
        ? _f
        : 0) > 0,
  });
  var prefixStr = messagePrefix ? "".concat(messagePrefix, " ") : "";
  var replyContext = formatReplyContext(msg);
  var baseLine = ""
    .concat(prefixStr)
    .concat(msg.body)
    .concat(replyContext ? "\n\n".concat(replyContext) : "");
  // Wrap with standardized envelope for the agent.
  return (0, envelope_js_1.formatInboundEnvelope)({
    channel: "WhatsApp",
    from:
      msg.chatType === "group"
        ? msg.from
        : (_g = msg.from) === null || _g === void 0
          ? void 0
          : _g.replace(/^whatsapp:/, ""),
    timestamp: msg.timestamp,
    body: baseLine,
    chatType: msg.chatType,
    sender: {
      name: msg.senderName,
      e164: msg.senderE164,
      id: msg.senderJid,
    },
    previousTimestamp: previousTimestamp,
    envelope: envelope,
  });
}
