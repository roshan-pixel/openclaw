"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractReplyToTag = extractReplyToTag;
var directive_tags_js_1 = require("../../utils/directive-tags.js");
function extractReplyToTag(text, currentMessageId) {
    var result = (0, directive_tags_js_1.parseInlineDirectives)(text, {
        currentMessageId: currentMessageId,
        stripAudioTag: false,
    });
    return {
        cleaned: result.text,
        replyToId: result.replyToId,
        replyToCurrent: result.replyToCurrent,
        hasTag: result.hasReplyTag,
    };
}
