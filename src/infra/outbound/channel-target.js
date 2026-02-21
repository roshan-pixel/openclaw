"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHANNEL_TARGETS_DESCRIPTION = exports.CHANNEL_TARGET_DESCRIPTION = void 0;
exports.applyTargetToParams = applyTargetToParams;
var message_action_spec_js_1 = require("./message-action-spec.js");
exports.CHANNEL_TARGET_DESCRIPTION =
  "Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack channel/user, or iMessage handle/chat_id";
exports.CHANNEL_TARGETS_DESCRIPTION =
  "Recipient/channel targets (same format as --target); accepts ids or names when the directory is available.";
function applyTargetToParams(params) {
  var _a;
  var target = typeof params.args.target === "string" ? params.args.target.trim() : "";
  var hasLegacyTo = typeof params.args.to === "string";
  var hasLegacyChannelId = typeof params.args.channelId === "string";
  var mode =
    (_a = message_action_spec_js_1.MESSAGE_ACTION_TARGET_MODE[params.action]) !== null &&
    _a !== void 0
      ? _a
      : "none";
  if (mode !== "none") {
    if (hasLegacyTo || hasLegacyChannelId) {
      throw new Error("Use `target` instead of `to`/`channelId`.");
    }
  } else if (hasLegacyTo) {
    throw new Error("Use `target` for actions that accept a destination.");
  }
  if (!target) {
    return;
  }
  if (mode === "channelId") {
    params.args.channelId = target;
    return;
  }
  if (mode === "to") {
    params.args.to = target;
    return;
  }
  throw new Error("Action ".concat(params.action, " does not accept a target."));
}
