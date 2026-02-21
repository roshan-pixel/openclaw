"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSlackChannelAllowedByPolicy = isSlackChannelAllowedByPolicy;
function isSlackChannelAllowedByPolicy(params) {
  var groupPolicy = params.groupPolicy,
    channelAllowlistConfigured = params.channelAllowlistConfigured,
    channelAllowed = params.channelAllowed;
  if (groupPolicy === "disabled") {
    return false;
  }
  if (groupPolicy === "open") {
    return true;
  }
  if (!channelAllowlistConfigured) {
    return false;
  }
  return channelAllowed;
}
