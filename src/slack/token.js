"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSlackToken = normalizeSlackToken;
exports.resolveSlackBotToken = resolveSlackBotToken;
exports.resolveSlackAppToken = resolveSlackAppToken;
function normalizeSlackToken(raw) {
    var trimmed = raw === null || raw === void 0 ? void 0 : raw.trim();
    return trimmed ? trimmed : undefined;
}
function resolveSlackBotToken(raw) {
    return normalizeSlackToken(raw);
}
function resolveSlackAppToken(raw) {
    return normalizeSlackToken(raw);
}
