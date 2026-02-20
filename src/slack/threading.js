"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSlackThreadContext = resolveSlackThreadContext;
exports.resolveSlackThreadTargets = resolveSlackThreadTargets;
function resolveSlackThreadContext(params) {
    var _a;
    var incomingThreadTs = params.message.thread_ts;
    var eventTs = params.message.event_ts;
    var messageTs = (_a = params.message.ts) !== null && _a !== void 0 ? _a : eventTs;
    var hasThreadTs = typeof incomingThreadTs === "string" && incomingThreadTs.length > 0;
    var isThreadReply = hasThreadTs && (incomingThreadTs !== messageTs || Boolean(params.message.parent_user_id));
    var replyToId = incomingThreadTs !== null && incomingThreadTs !== void 0 ? incomingThreadTs : messageTs;
    var messageThreadId = isThreadReply
        ? incomingThreadTs
        : params.replyToMode === "all"
            ? messageTs
            : undefined;
    return {
        incomingThreadTs: incomingThreadTs,
        messageTs: messageTs,
        isThreadReply: isThreadReply,
        replyToId: replyToId,
        messageThreadId: messageThreadId,
    };
}
function resolveSlackThreadTargets(params) {
    var _a = resolveSlackThreadContext(params), incomingThreadTs = _a.incomingThreadTs, messageTs = _a.messageTs;
    var replyThreadTs = incomingThreadTs !== null && incomingThreadTs !== void 0 ? incomingThreadTs : (params.replyToMode === "all" ? messageTs : undefined);
    var statusThreadTs = replyThreadTs !== null && replyThreadTs !== void 0 ? replyThreadTs : messageTs;
    return { replyThreadTs: replyThreadTs, statusThreadTs: statusThreadTs };
}
