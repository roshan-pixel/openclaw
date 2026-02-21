"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeSendAckReaction = maybeSendAckReaction;
var globals_js_1 = require("../../../globals.js");
var ack_reactions_js_1 = require("../../../channels/ack-reactions.js");
var outbound_js_1 = require("../../outbound.js");
var session_js_1 = require("../../session.js");
var group_activation_js_1 = require("./group-activation.js");
function maybeSendAckReaction(params) {
  var _a, _b, _c, _d, _e, _f;
  if (!params.msg.id) {
    return;
  }
  var ackConfig =
    (_b = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.whatsapp) === null ||
    _b === void 0
      ? void 0
      : _b.ackReaction;
  var emoji = (
    (_c = ackConfig === null || ackConfig === void 0 ? void 0 : ackConfig.emoji) !== null &&
    _c !== void 0
      ? _c
      : ""
  ).trim();
  var directEnabled =
    (_d = ackConfig === null || ackConfig === void 0 ? void 0 : ackConfig.direct) !== null &&
    _d !== void 0
      ? _d
      : true;
  var groupMode =
    (_e = ackConfig === null || ackConfig === void 0 ? void 0 : ackConfig.group) !== null &&
    _e !== void 0
      ? _e
      : "mentions";
  var conversationIdForCheck =
    (_f = params.msg.conversationId) !== null && _f !== void 0 ? _f : params.msg.from;
  var activation =
    params.msg.chatType === "group"
      ? (0, group_activation_js_1.resolveGroupActivationFor)({
          cfg: params.cfg,
          agentId: params.agentId,
          sessionKey: params.sessionKey,
          conversationId: conversationIdForCheck,
        })
      : null;
  var shouldSendReaction = function () {
    return (0, ack_reactions_js_1.shouldAckReactionForWhatsApp)({
      emoji: emoji,
      isDirect: params.msg.chatType === "direct",
      isGroup: params.msg.chatType === "group",
      directEnabled: directEnabled,
      groupMode: groupMode,
      wasMentioned: params.msg.wasMentioned === true,
      groupActivated: activation === "always",
    });
  };
  if (!shouldSendReaction()) {
    return;
  }
  params.info(
    { chatId: params.msg.chatId, messageId: params.msg.id, emoji: emoji },
    "sending ack reaction",
  );
  (0, outbound_js_1.sendReactionWhatsApp)(params.msg.chatId, params.msg.id, emoji, {
    verbose: params.verbose,
    fromMe: false,
    participant: params.msg.senderJid,
    accountId: params.accountId,
  }).catch(function (err) {
    params.warn(
      {
        error: (0, session_js_1.formatError)(err),
        chatId: params.msg.chatId,
        messageId: params.msg.id,
      },
      "failed to send ack reaction",
    );
    (0, globals_js_1.logVerbose)(
      "WhatsApp ack reaction failed for chat "
        .concat(params.msg.chatId, ": ")
        .concat((0, session_js_1.formatError)(err)),
    );
  });
}
