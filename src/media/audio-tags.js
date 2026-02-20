"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAudioTag = parseAudioTag;
var directive_tags_js_1 = require("../utils/directive-tags.js");
/**
 * Extract audio mode tag from text.
 * Supports [[audio_as_voice]] to send audio as voice bubble instead of file.
 * Default is file (preserves backward compatibility).
 */
function parseAudioTag(text) {
    var result = (0, directive_tags_js_1.parseInlineDirectives)(text, { stripReplyTags: false });
    return {
        text: result.text,
        audioAsVoice: result.audioAsVoice,
        hadTag: result.hasAudioTag,
    };
}
