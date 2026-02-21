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
exports.normalizeReplyPayloadsForDelivery = normalizeReplyPayloadsForDelivery;
exports.normalizeOutboundPayloads = normalizeOutboundPayloads;
exports.normalizeOutboundPayloadsForJson = normalizeOutboundPayloadsForJson;
exports.formatOutboundPayloadLog = formatOutboundPayloadLog;
var reply_directives_js_1 = require("../../auto-reply/reply/reply-directives.js");
var reply_payloads_js_1 = require("../../auto-reply/reply/reply-payloads.js");
function mergeMediaUrls() {
  var lists = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    lists[_i] = arguments[_i];
  }
  var seen = new Set();
  var merged = [];
  for (var _a = 0, lists_1 = lists; _a < lists_1.length; _a++) {
    var list = lists_1[_a];
    if (!list) {
      continue;
    }
    for (var _b = 0, list_1 = list; _b < list_1.length; _b++) {
      var entry = list_1[_b];
      var trimmed = entry === null || entry === void 0 ? void 0 : entry.trim();
      if (!trimmed) {
        continue;
      }
      if (seen.has(trimmed)) {
        continue;
      }
      seen.add(trimmed);
      merged.push(trimmed);
    }
  }
  return merged;
}
function normalizeReplyPayloadsForDelivery(payloads) {
  return payloads.flatMap(function (payload) {
    var _a, _b, _c, _d, _e, _f;
    var parsed = (0, reply_directives_js_1.parseReplyDirectives)(
      (_a = payload.text) !== null && _a !== void 0 ? _a : "",
    );
    var explicitMediaUrls =
      (_b = payload.mediaUrls) !== null && _b !== void 0 ? _b : parsed.mediaUrls;
    var explicitMediaUrl = (_c = payload.mediaUrl) !== null && _c !== void 0 ? _c : parsed.mediaUrl;
    var mergedMedia = mergeMediaUrls(
      explicitMediaUrls,
      explicitMediaUrl ? [explicitMediaUrl] : undefined,
    );
    var hasMultipleMedia =
      ((_d =
        explicitMediaUrls === null || explicitMediaUrls === void 0
          ? void 0
          : explicitMediaUrls.length) !== null && _d !== void 0
        ? _d
        : 0) > 1;
    var resolvedMediaUrl = hasMultipleMedia ? undefined : explicitMediaUrl;
    var next = __assign(__assign({}, payload), {
      text: (_e = parsed.text) !== null && _e !== void 0 ? _e : "",
      mediaUrls: mergedMedia.length ? mergedMedia : undefined,
      mediaUrl: resolvedMediaUrl,
      replyToId: (_f = payload.replyToId) !== null && _f !== void 0 ? _f : parsed.replyToId,
      replyToTag: payload.replyToTag || parsed.replyToTag,
      replyToCurrent: payload.replyToCurrent || parsed.replyToCurrent,
      audioAsVoice: Boolean(payload.audioAsVoice || parsed.audioAsVoice),
    });
    if (parsed.isSilent && mergedMedia.length === 0) {
      return [];
    }
    if (!(0, reply_payloads_js_1.isRenderablePayload)(next)) {
      return [];
    }
    return [next];
  });
}
function normalizeOutboundPayloads(payloads) {
  return normalizeReplyPayloadsForDelivery(payloads)
    .map(function (payload) {
      var _a, _b;
      var channelData = payload.channelData;
      var normalized = {
        text: (_a = payload.text) !== null && _a !== void 0 ? _a : "",
        mediaUrls:
          (_b = payload.mediaUrls) !== null && _b !== void 0
            ? _b
            : payload.mediaUrl
              ? [payload.mediaUrl]
              : [],
      };
      if (channelData && Object.keys(channelData).length > 0) {
        normalized.channelData = channelData;
      }
      return normalized;
    })
    .filter(function (payload) {
      return (
        payload.text ||
        payload.mediaUrls.length > 0 ||
        Boolean(payload.channelData && Object.keys(payload.channelData).length > 0)
      );
    });
}
function normalizeOutboundPayloadsForJson(payloads) {
  return normalizeReplyPayloadsForDelivery(payloads).map(function (payload) {
    var _a, _b, _c;
    return {
      text: (_a = payload.text) !== null && _a !== void 0 ? _a : "",
      mediaUrl: (_b = payload.mediaUrl) !== null && _b !== void 0 ? _b : null,
      mediaUrls:
        (_c = payload.mediaUrls) !== null && _c !== void 0
          ? _c
          : payload.mediaUrl
            ? [payload.mediaUrl]
            : undefined,
      channelData: payload.channelData,
    };
  });
}
function formatOutboundPayloadLog(payload) {
  var lines = [];
  if (payload.text) {
    lines.push(payload.text.trimEnd());
  }
  for (var _i = 0, _a = payload.mediaUrls; _i < _a.length; _i++) {
    var url = _a[_i];
    lines.push("MEDIA:".concat(url));
  }
  return lines.join("\n");
}
