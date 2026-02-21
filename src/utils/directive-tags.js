"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInlineDirectives = parseInlineDirectives;
var AUDIO_TAG_RE = /\[\[\s*audio_as_voice\s*\]\]/gi;
var REPLY_TAG_RE = /\[\[\s*(?:reply_to_current|reply_to\s*:\s*([^\]\n]+))\s*\]\]/gi;
function normalizeDirectiveWhitespace(text) {
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .trim();
}
function parseInlineDirectives(text, options) {
  if (options === void 0) {
    options = {};
  }
  var currentMessageId = options.currentMessageId,
    _a = options.stripAudioTag,
    stripAudioTag = _a === void 0 ? true : _a,
    _b = options.stripReplyTags,
    stripReplyTags = _b === void 0 ? true : _b;
  if (!text) {
    return {
      text: "",
      audioAsVoice: false,
      replyToCurrent: false,
      hasAudioTag: false,
      hasReplyTag: false,
    };
  }
  var cleaned = text;
  var audioAsVoice = false;
  var hasAudioTag = false;
  var hasReplyTag = false;
  var sawCurrent = false;
  var lastExplicitId;
  cleaned = cleaned.replace(AUDIO_TAG_RE, function (match) {
    audioAsVoice = true;
    hasAudioTag = true;
    return stripAudioTag ? " " : match;
  });
  cleaned = cleaned.replace(REPLY_TAG_RE, function (match, idRaw) {
    hasReplyTag = true;
    if (idRaw === undefined) {
      sawCurrent = true;
    } else {
      var id = idRaw.trim();
      if (id) {
        lastExplicitId = id;
      }
    }
    return stripReplyTags ? " " : match;
  });
  cleaned = normalizeDirectiveWhitespace(cleaned);
  var replyToId =
    lastExplicitId !== null && lastExplicitId !== void 0
      ? lastExplicitId
      : sawCurrent
        ? (currentMessageId === null || currentMessageId === void 0
            ? void 0
            : currentMessageId.trim()) || undefined
        : undefined;
  return {
    text: cleaned,
    audioAsVoice: audioAsVoice,
    replyToId: replyToId,
    replyToExplicitId: lastExplicitId,
    replyToCurrent: sawCurrent,
    hasAudioTag: hasAudioTag,
    hasReplyTag: hasReplyTag,
  };
}
