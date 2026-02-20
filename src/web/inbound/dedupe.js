"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetWebInboundDedupe = resetWebInboundDedupe;
exports.isRecentInboundMessage = isRecentInboundMessage;
var dedupe_js_1 = require("../../infra/dedupe.js");
var RECENT_WEB_MESSAGE_TTL_MS = 20 * 60000;
var RECENT_WEB_MESSAGE_MAX = 5000;
var recentInboundMessages = (0, dedupe_js_1.createDedupeCache)({
    ttlMs: RECENT_WEB_MESSAGE_TTL_MS,
    maxSize: RECENT_WEB_MESSAGE_MAX,
});
function resetWebInboundDedupe() {
    recentInboundMessages.clear();
}
function isRecentInboundMessage(key) {
    return recentInboundMessages.check(key);
}
