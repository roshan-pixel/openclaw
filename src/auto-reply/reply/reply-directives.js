"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseReplyDirectives = parseReplyDirectives;
var parse_js_1 = require("../../media/parse.js");
var directive_tags_js_1 = require("../../utils/directive-tags.js");
var tokens_js_1 = require("../tokens.js");
function parseReplyDirectives(raw, options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    var split = (0, parse_js_1.splitMediaFromOutput)(raw);
    var text = (_a = split.text) !== null && _a !== void 0 ? _a : "";
    var replyParsed = (0, directive_tags_js_1.parseInlineDirectives)(text, {
        currentMessageId: options.currentMessageId,
        stripAudioTag: false,
        stripReplyTags: true,
    });
    if (replyParsed.hasReplyTag) {
        text = replyParsed.text;
    }
    var silentToken = (_b = options.silentToken) !== null && _b !== void 0 ? _b : tokens_js_1.SILENT_REPLY_TOKEN;
    var isSilent = (0, tokens_js_1.isSilentReplyText)(text, silentToken);
    if (isSilent) {
        text = "";
    }
    return {
        text: text,
        mediaUrls: split.mediaUrls,
        mediaUrl: split.mediaUrl,
        replyToId: replyParsed.replyToId,
        replyToCurrent: replyParsed.replyToCurrent,
        replyToTag: replyParsed.hasReplyTag,
        audioAsVoice: split.audioAsVoice,
        isSilent: isSilent,
    };
}
