"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TELEGRAM_MAX_CAPTION_LENGTH = void 0;
exports.splitTelegramCaption = splitTelegramCaption;
exports.TELEGRAM_MAX_CAPTION_LENGTH = 1024;
function splitTelegramCaption(text) {
    var _a;
    var trimmed = (_a = text === null || text === void 0 ? void 0 : text.trim()) !== null && _a !== void 0 ? _a : "";
    if (!trimmed) {
        return { caption: undefined, followUpText: undefined };
    }
    if (trimmed.length > exports.TELEGRAM_MAX_CAPTION_LENGTH) {
        return { caption: undefined, followUpText: trimmed };
    }
    return { caption: trimmed, followUpText: undefined };
}
