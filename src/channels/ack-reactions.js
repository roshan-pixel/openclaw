"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldAckReaction = shouldAckReaction;
exports.shouldAckReactionForWhatsApp = shouldAckReactionForWhatsApp;
exports.removeAckReactionAfterReply = removeAckReactionAfterReply;
function shouldAckReaction(params) {
  var _a;
  var scope = (_a = params.scope) !== null && _a !== void 0 ? _a : "group-mentions";
  if (scope === "off" || scope === "none") {
    return false;
  }
  if (scope === "all") {
    return true;
  }
  if (scope === "direct") {
    return params.isDirect;
  }
  if (scope === "group-all") {
    return params.isGroup;
  }
  if (scope === "group-mentions") {
    if (!params.isMentionableGroup) {
      return false;
    }
    if (!params.requireMention) {
      return false;
    }
    if (!params.canDetectMention) {
      return false;
    }
    return params.effectiveWasMentioned || params.shouldBypassMention === true;
  }
  return false;
}
function shouldAckReactionForWhatsApp(params) {
  if (!params.emoji) {
    return false;
  }
  if (params.isDirect) {
    return params.directEnabled;
  }
  if (!params.isGroup) {
    return false;
  }
  if (params.groupMode === "never") {
    return false;
  }
  if (params.groupMode === "always") {
    return true;
  }
  return shouldAckReaction({
    scope: "group-mentions",
    isDirect: false,
    isGroup: true,
    isMentionableGroup: true,
    requireMention: true,
    canDetectMention: true,
    effectiveWasMentioned: params.wasMentioned,
    shouldBypassMention: params.groupActivated,
  });
}
function removeAckReactionAfterReply(params) {
  if (!params.removeAfterReply) {
    return;
  }
  if (!params.ackReactionPromise) {
    return;
  }
  if (!params.ackReactionValue) {
    return;
  }
  void params.ackReactionPromise.then(function (didAck) {
    if (!didAck) {
      return;
    }
    params.remove().catch(function (err) {
      var _a;
      return (_a = params.onError) === null || _a === void 0 ? void 0 : _a.call(params, err);
    });
  });
}
