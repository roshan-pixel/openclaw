"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSlackThreadingToolContext = buildSlackThreadingToolContext;
var accounts_js_1 = require("./accounts.js");
function buildSlackThreadingToolContext(params) {
    var _a, _b;
    var account = (0, accounts_js_1.resolveSlackAccount)({
        cfg: params.cfg,
        accountId: params.accountId,
    });
    var configuredReplyToMode = (0, accounts_js_1.resolveSlackReplyToMode)(account, params.context.ChatType);
    var effectiveReplyToMode = params.context.ThreadLabel ? "all" : configuredReplyToMode;
    var threadId = (_a = params.context.MessageThreadId) !== null && _a !== void 0 ? _a : params.context.ReplyToId;
    return {
        currentChannelId: ((_b = params.context.To) === null || _b === void 0 ? void 0 : _b.startsWith("channel:"))
            ? params.context.To.slice("channel:".length)
            : undefined,
        currentThreadTs: threadId != null ? String(threadId) : undefined,
        replyToMode: effectiveReplyToMode,
        hasRepliedRef: params.hasRepliedRef,
    };
}
