"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePeerId = resolvePeerId;
var utils_js_1 = require("../../../utils.js");
function resolvePeerId(msg) {
  var _a, _b, _c, _d;
  if (msg.chatType === "group") {
    return (_a = msg.conversationId) !== null && _a !== void 0 ? _a : msg.from;
  }
  if (msg.senderE164) {
    return (_b = (0, utils_js_1.normalizeE164)(msg.senderE164)) !== null && _b !== void 0
      ? _b
      : msg.senderE164;
  }
  if (msg.from.includes("@")) {
    return (_c = (0, utils_js_1.jidToE164)(msg.from)) !== null && _c !== void 0 ? _c : msg.from;
  }
  return (_d = (0, utils_js_1.normalizeE164)(msg.from)) !== null && _d !== void 0 ? _d : msg.from;
}
