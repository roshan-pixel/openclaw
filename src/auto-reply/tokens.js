"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SILENT_REPLY_TOKEN = exports.HEARTBEAT_TOKEN = void 0;
exports.isSilentReplyText = isSilentReplyText;
exports.HEARTBEAT_TOKEN = "HEARTBEAT_OK";
exports.SILENT_REPLY_TOKEN = "NO_REPLY";
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function isSilentReplyText(text, token) {
  if (token === void 0) {
    token = exports.SILENT_REPLY_TOKEN;
  }
  if (!text) {
    return false;
  }
  var escaped = escapeRegExp(token);
  var prefix = new RegExp("^\\s*".concat(escaped, "(?=$|\\W)"));
  if (prefix.test(text)) {
    return true;
  }
  var suffix = new RegExp("\\b".concat(escaped, "\\b\\W*$"));
  return suffix.test(text);
}
