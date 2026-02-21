"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatInboundBodyWithSenderMeta = formatInboundBodyWithSenderMeta;
var chat_type_js_1 = require("../../channels/chat-type.js");
var sender_label_js_1 = require("../../channels/sender-label.js");
function formatInboundBodyWithSenderMeta(params) {
  var body = params.body;
  if (!body.trim()) {
    return body;
  }
  var chatType = (0, chat_type_js_1.normalizeChatType)(params.ctx.ChatType);
  if (!chatType || chatType === "direct") {
    return body;
  }
  if (hasSenderMetaLine(body, params.ctx)) {
    return body;
  }
  var senderLabel = (0, sender_label_js_1.resolveSenderLabel)({
    name: params.ctx.SenderName,
    username: params.ctx.SenderUsername,
    tag: params.ctx.SenderTag,
    e164: params.ctx.SenderE164,
    id: params.ctx.SenderId,
  });
  if (!senderLabel) {
    return body;
  }
  return "".concat(body, "\n[from: ").concat(senderLabel, "]");
}
function hasSenderMetaLine(body, ctx) {
  if (/(^|\n)\[from:/i.test(body)) {
    return true;
  }
  var candidates = (0, sender_label_js_1.listSenderLabelCandidates)({
    name: ctx.SenderName,
    username: ctx.SenderUsername,
    tag: ctx.SenderTag,
    e164: ctx.SenderE164,
    id: ctx.SenderId,
  });
  if (candidates.length === 0) {
    return false;
  }
  return candidates.some(function (candidate) {
    var escaped = escapeRegExp(candidate);
    // Envelope bodies look like "[Signal ...] Alice: hi".
    // Treat the post-header sender prefix as already having sender metadata.
    var pattern = new RegExp("(^|\\n|\\]\\s*)".concat(escaped, ":\\s"), "i");
    return pattern.test(body);
  });
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
