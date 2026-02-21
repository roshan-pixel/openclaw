"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveConversationLabel = resolveConversationLabel;
var chat_type_js_1 = require("./chat-type.js");
function extractConversationId(from) {
  var trimmed = from === null || from === void 0 ? void 0 : from.trim();
  if (!trimmed) {
    return undefined;
  }
  var parts = trimmed.split(":").filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : trimmed;
}
function shouldAppendId(id) {
  if (/^[0-9]+$/.test(id)) {
    return true;
  }
  if (id.includes("@g.us")) {
    return true;
  }
  return false;
}
function resolveConversationLabel(ctx) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  var explicit = (_a = ctx.ConversationLabel) === null || _a === void 0 ? void 0 : _a.trim();
  if (explicit) {
    return explicit;
  }
  var threadLabel = (_b = ctx.ThreadLabel) === null || _b === void 0 ? void 0 : _b.trim();
  if (threadLabel) {
    return threadLabel;
  }
  var chatType = (0, chat_type_js_1.normalizeChatType)(ctx.ChatType);
  if (chatType === "direct") {
    return (
      ((_c = ctx.SenderName) === null || _c === void 0 ? void 0 : _c.trim()) ||
      ((_d = ctx.From) === null || _d === void 0 ? void 0 : _d.trim()) ||
      undefined
    );
  }
  var base =
    ((_e = ctx.GroupChannel) === null || _e === void 0 ? void 0 : _e.trim()) ||
    ((_f = ctx.GroupSubject) === null || _f === void 0 ? void 0 : _f.trim()) ||
    ((_g = ctx.GroupSpace) === null || _g === void 0 ? void 0 : _g.trim()) ||
    ((_h = ctx.From) === null || _h === void 0 ? void 0 : _h.trim()) ||
    "";
  if (!base) {
    return undefined;
  }
  var id = extractConversationId(ctx.From);
  if (!id) {
    return base;
  }
  if (!shouldAppendId(id)) {
    return base;
  }
  if (base === id) {
    return base;
  }
  if (base.includes(id)) {
    return base;
  }
  if (base.toLowerCase().includes(" id:")) {
    return base;
  }
  if (base.startsWith("#") || base.startsWith("@")) {
    return base;
  }
  return "".concat(base, " id:").concat(id);
}
