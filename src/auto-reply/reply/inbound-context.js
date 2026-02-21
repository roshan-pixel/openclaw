"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizeInboundContext = finalizeInboundContext;
var chat_type_js_1 = require("../../channels/chat-type.js");
var conversation_label_js_1 = require("../../channels/conversation-label.js");
var inbound_sender_meta_js_1 = require("./inbound-sender-meta.js");
var inbound_text_js_1 = require("./inbound-text.js");
function normalizeTextField(value) {
  if (typeof value !== "string") {
    return undefined;
  }
  return (0, inbound_text_js_1.normalizeInboundTextNewlines)(value);
}
function finalizeInboundContext(ctx, opts) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  if (opts === void 0) {
    opts = {};
  }
  var normalized = ctx;
  normalized.Body = (0, inbound_text_js_1.normalizeInboundTextNewlines)(
    typeof normalized.Body === "string" ? normalized.Body : "",
  );
  normalized.RawBody = normalizeTextField(normalized.RawBody);
  normalized.CommandBody = normalizeTextField(normalized.CommandBody);
  normalized.Transcript = normalizeTextField(normalized.Transcript);
  normalized.ThreadStarterBody = normalizeTextField(normalized.ThreadStarterBody);
  var chatType = (0, chat_type_js_1.normalizeChatType)(normalized.ChatType);
  if (chatType && (opts.forceChatType || normalized.ChatType !== chatType)) {
    normalized.ChatType = chatType;
  }
  var bodyForAgentSource = opts.forceBodyForAgent
    ? normalized.Body
    : (_a = normalized.BodyForAgent) !== null && _a !== void 0
      ? _a
      : normalized.Body;
  normalized.BodyForAgent = (0, inbound_text_js_1.normalizeInboundTextNewlines)(bodyForAgentSource);
  var bodyForCommandsSource = opts.forceBodyForCommands
    ? (_c = (_b = normalized.CommandBody) !== null && _b !== void 0 ? _b : normalized.RawBody) !==
        null && _c !== void 0
      ? _c
      : normalized.Body
    : (_f =
          (_e =
            (_d = normalized.BodyForCommands) !== null && _d !== void 0
              ? _d
              : normalized.CommandBody) !== null && _e !== void 0
            ? _e
            : normalized.RawBody) !== null && _f !== void 0
      ? _f
      : normalized.Body;
  normalized.BodyForCommands = (0, inbound_text_js_1.normalizeInboundTextNewlines)(
    bodyForCommandsSource,
  );
  var explicitLabel =
    (_g = normalized.ConversationLabel) === null || _g === void 0 ? void 0 : _g.trim();
  if (opts.forceConversationLabel || !explicitLabel) {
    var resolved =
      (_h = (0, conversation_label_js_1.resolveConversationLabel)(normalized)) === null ||
      _h === void 0
        ? void 0
        : _h.trim();
    if (resolved) {
      normalized.ConversationLabel = resolved;
    }
  } else {
    normalized.ConversationLabel = explicitLabel;
  }
  // Ensure group/channel messages retain a sender meta line even when the body is a
  // structured envelope (e.g. "[Signal ...] Alice: hi").
  normalized.Body = (0, inbound_sender_meta_js_1.formatInboundBodyWithSenderMeta)({
    ctx: normalized,
    body: normalized.Body,
  });
  normalized.BodyForAgent = (0, inbound_sender_meta_js_1.formatInboundBodyWithSenderMeta)({
    ctx: normalized,
    body: normalized.BodyForAgent,
  });
  // Always set. Default-deny when upstream forgets to populate it.
  normalized.CommandAuthorized = normalized.CommandAuthorized === true;
  return normalized;
}
