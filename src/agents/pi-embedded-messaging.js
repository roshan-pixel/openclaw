"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMessagingTool = isMessagingTool;
exports.isMessagingToolSendAction = isMessagingToolSendAction;
var index_js_1 = require("../channels/plugins/index.js");
var CORE_MESSAGING_TOOLS = new Set(["sessions_send", "message"]);
// Provider docking: any plugin with `actions` opts into messaging tool handling.
function isMessagingTool(toolName) {
  var _a;
  if (CORE_MESSAGING_TOOLS.has(toolName)) {
    return true;
  }
  var providerId = (0, index_js_1.normalizeChannelId)(toolName);
  return Boolean(
    providerId &&
    ((_a = (0, index_js_1.getChannelPlugin)(providerId)) === null || _a === void 0
      ? void 0
      : _a.actions),
  );
}
function isMessagingToolSendAction(toolName, args) {
  var _a, _b;
  var action = typeof args.action === "string" ? args.action.trim() : "";
  if (toolName === "sessions_send") {
    return true;
  }
  if (toolName === "message") {
    return action === "send" || action === "thread-reply";
  }
  var providerId = (0, index_js_1.normalizeChannelId)(toolName);
  if (!providerId) {
    return false;
  }
  var plugin = (0, index_js_1.getChannelPlugin)(providerId);
  if (
    !((_a = plugin === null || plugin === void 0 ? void 0 : plugin.actions) === null ||
    _a === void 0
      ? void 0
      : _a.extractToolSend)
  ) {
    return false;
  }
  return Boolean(
    (_b = plugin.actions.extractToolSend({ args: args })) === null || _b === void 0
      ? void 0
      : _b.to,
  );
}
