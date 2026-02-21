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
exports.createStreamingDirectiveAccumulator = createStreamingDirectiveAccumulator;
var parse_js_1 = require("../../media/parse.js");
var directive_tags_js_1 = require("../../utils/directive-tags.js");
var tokens_js_1 = require("../tokens.js");
var splitTrailingDirective = function (text) {
  var openIndex = text.lastIndexOf("[[");
  if (openIndex < 0) {
    return { text: text, tail: "" };
  }
  var closeIndex = text.indexOf("]]", openIndex + 2);
  if (closeIndex >= 0) {
    return { text: text, tail: "" };
  }
  return {
    text: text.slice(0, openIndex),
    tail: text.slice(openIndex),
  };
};
var parseChunk = function (raw, options) {
  var _a, _b;
  var split = (0, parse_js_1.splitMediaFromOutput)(raw);
  var text = (_a = split.text) !== null && _a !== void 0 ? _a : "";
  var replyParsed = (0, directive_tags_js_1.parseInlineDirectives)(text, {
    stripAudioTag: false,
    stripReplyTags: true,
  });
  if (replyParsed.hasReplyTag) {
    text = replyParsed.text;
  }
  var silentToken =
    (_b = options === null || options === void 0 ? void 0 : options.silentToken) !== null &&
    _b !== void 0
      ? _b
      : tokens_js_1.SILENT_REPLY_TOKEN;
  var isSilent = (0, tokens_js_1.isSilentReplyText)(text, silentToken);
  if (isSilent) {
    text = "";
  }
  return {
    text: text,
    mediaUrls: split.mediaUrls,
    mediaUrl: split.mediaUrl,
    replyToId: replyParsed.replyToId,
    replyToExplicitId: replyParsed.replyToExplicitId,
    replyToCurrent: replyParsed.replyToCurrent,
    replyToTag: replyParsed.hasReplyTag,
    audioAsVoice: split.audioAsVoice,
    isSilent: isSilent,
  };
};
var hasRenderableContent = function (parsed) {
  var _a, _b;
  return (
    Boolean(parsed.text) ||
    Boolean(parsed.mediaUrl) ||
    ((_b = (_a = parsed.mediaUrls) === null || _a === void 0 ? void 0 : _a.length) !== null &&
    _b !== void 0
      ? _b
      : 0) > 0 ||
    Boolean(parsed.audioAsVoice)
  );
};
function createStreamingDirectiveAccumulator() {
  var pendingTail = "";
  var pendingReply = { sawCurrent: false, hasTag: false };
  var reset = function () {
    pendingTail = "";
    pendingReply = { sawCurrent: false, hasTag: false };
  };
  var consume = function (raw, options) {
    var _a;
    if (options === void 0) {
      options = {};
    }
    var combined = "".concat(pendingTail).concat(raw !== null && raw !== void 0 ? raw : "");
    pendingTail = "";
    if (!options.final) {
      var split = splitTrailingDirective(combined);
      combined = split.text;
      pendingTail = split.tail;
    }
    if (!combined) {
      return null;
    }
    var parsed = parseChunk(combined, { silentToken: options.silentToken });
    var hasTag = pendingReply.hasTag || parsed.replyToTag;
    var sawCurrent = pendingReply.sawCurrent || parsed.replyToCurrent;
    var explicitId =
      (_a = parsed.replyToExplicitId) !== null && _a !== void 0 ? _a : pendingReply.explicitId;
    var combinedResult = __assign(__assign({}, parsed), {
      replyToId: explicitId,
      replyToCurrent: sawCurrent,
      replyToTag: hasTag,
    });
    if (!hasRenderableContent(combinedResult)) {
      if (hasTag) {
        pendingReply = {
          explicitId: explicitId,
          sawCurrent: sawCurrent,
          hasTag: hasTag,
        };
      }
      return null;
    }
    pendingReply = { sawCurrent: false, hasTag: false };
    return combinedResult;
  };
  return {
    consume: consume,
    reset: reset,
  };
}
