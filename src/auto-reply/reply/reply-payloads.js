"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyReplyTagsToPayload = applyReplyTagsToPayload;
exports.isRenderablePayload = isRenderablePayload;
exports.applyReplyThreading = applyReplyThreading;
exports.filterMessagingToolDuplicates = filterMessagingToolDuplicates;
exports.shouldSuppressMessagingToolReplies = shouldSuppressMessagingToolReplies;
var pi_embedded_helpers_js_1 = require("../../agents/pi-embedded-helpers.js");
var target_normalization_js_1 = require("../../infra/outbound/target-normalization.js");
var reply_tags_js_1 = require("./reply-tags.js");
var reply_threading_js_1 = require("./reply-threading.js");
function applyReplyTagsToPayload(payload, currentMessageId) {
  var _a;
  if (typeof payload.text !== "string") {
    if (!payload.replyToCurrent || payload.replyToId) {
      return payload;
    }
    return __assign(__assign({}, payload), {
      replyToId:
        (currentMessageId === null || currentMessageId === void 0
          ? void 0
          : currentMessageId.trim()) || undefined,
    });
  }
  var shouldParseTags = payload.text.includes("[[");
  if (!shouldParseTags) {
    if (!payload.replyToCurrent || payload.replyToId) {
      return payload;
    }
    return __assign(__assign({}, payload), {
      replyToId:
        (currentMessageId === null || currentMessageId === void 0
          ? void 0
          : currentMessageId.trim()) || undefined,
      replyToTag: (_a = payload.replyToTag) !== null && _a !== void 0 ? _a : true,
    });
  }
  var _b = (0, reply_tags_js_1.extractReplyToTag)(payload.text, currentMessageId),
    cleaned = _b.cleaned,
    replyToId = _b.replyToId,
    replyToCurrent = _b.replyToCurrent,
    hasTag = _b.hasTag;
  return __assign(__assign({}, payload), {
    text: cleaned ? cleaned : undefined,
    replyToId: replyToId !== null && replyToId !== void 0 ? replyToId : payload.replyToId,
    replyToTag: hasTag || payload.replyToTag,
    replyToCurrent: replyToCurrent || payload.replyToCurrent,
  });
}
function isRenderablePayload(payload) {
  return Boolean(
    payload.text ||
    payload.mediaUrl ||
    (payload.mediaUrls && payload.mediaUrls.length > 0) ||
    payload.audioAsVoice ||
    payload.channelData,
  );
}
function applyReplyThreading(params) {
  var payloads = params.payloads,
    replyToMode = params.replyToMode,
    replyToChannel = params.replyToChannel,
    currentMessageId = params.currentMessageId;
  var applyReplyToMode = (0, reply_threading_js_1.createReplyToModeFilterForChannel)(
    replyToMode,
    replyToChannel,
  );
  return payloads
    .map(function (payload) {
      return applyReplyTagsToPayload(payload, currentMessageId);
    })
    .filter(isRenderablePayload)
    .map(applyReplyToMode);
}
function filterMessagingToolDuplicates(params) {
  var payloads = params.payloads,
    sentTexts = params.sentTexts;
  if (sentTexts.length === 0) {
    return payloads;
  }
  return payloads.filter(function (payload) {
    var _a;
    return !(0, pi_embedded_helpers_js_1.isMessagingToolDuplicate)(
      (_a = payload.text) !== null && _a !== void 0 ? _a : "",
      sentTexts,
    );
  });
}
function normalizeAccountId(value) {
  var trimmed = value === null || value === void 0 ? void 0 : value.trim();
  return trimmed ? trimmed.toLowerCase() : undefined;
}
function shouldSuppressMessagingToolReplies(params) {
  var _a, _b;
  var provider =
    (_a = params.messageProvider) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
  if (!provider) {
    return false;
  }
  var originTarget = (0, target_normalization_js_1.normalizeTargetForProvider)(
    provider,
    params.originatingTo,
  );
  if (!originTarget) {
    return false;
  }
  var originAccount = normalizeAccountId(params.accountId);
  var sentTargets = (_b = params.messagingToolSentTargets) !== null && _b !== void 0 ? _b : [];
  if (sentTargets.length === 0) {
    return false;
  }
  return sentTargets.some(function (target) {
    if (!(target === null || target === void 0 ? void 0 : target.provider)) {
      return false;
    }
    if (target.provider.trim().toLowerCase() !== provider) {
      return false;
    }
    var targetKey = (0, target_normalization_js_1.normalizeTargetForProvider)(provider, target.to);
    if (!targetKey) {
      return false;
    }
    var targetAccount = normalizeAccountId(target.accountId);
    if (originAccount && targetAccount && originAccount !== targetAccount) {
      return false;
    }
    return targetKey === originTarget;
  });
}
