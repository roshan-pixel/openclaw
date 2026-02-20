"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGeminiTurns = validateGeminiTurns;
exports.mergeConsecutiveUserTurns = mergeConsecutiveUserTurns;
exports.validateAnthropicTurns = validateAnthropicTurns;
/**
 * Validates and fixes conversation turn sequences for Gemini API.
 * Gemini requires strict alternating user→assistant→tool→user pattern.
 * Merges consecutive assistant messages together.
 */
function validateGeminiTurns(messages) {
    if (!Array.isArray(messages) || messages.length === 0) {
        return messages;
    }
    var result = [];
    var lastRole;
    for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
        var msg = messages_1[_i];
        if (!msg || typeof msg !== "object") {
            result.push(msg);
            continue;
        }
        var msgRole = msg.role;
        if (!msgRole) {
            result.push(msg);
            continue;
        }
        if (msgRole === lastRole && lastRole === "assistant") {
            var lastMsg = result[result.length - 1];
            var currentMsg = msg;
            if (lastMsg && typeof lastMsg === "object") {
                var lastAsst = lastMsg;
                var mergedContent = __spreadArray(__spreadArray([], (Array.isArray(lastAsst.content) ? lastAsst.content : []), true), (Array.isArray(currentMsg.content) ? currentMsg.content : []), true);
                var merged = __assign(__assign(__assign(__assign(__assign({}, lastAsst), { content: mergedContent }), (currentMsg.usage && { usage: currentMsg.usage })), (currentMsg.stopReason && { stopReason: currentMsg.stopReason })), (currentMsg.errorMessage && {
                    errorMessage: currentMsg.errorMessage,
                }));
                result[result.length - 1] = merged;
                continue;
            }
        }
        result.push(msg);
        lastRole = msgRole;
    }
    return result;
}
function mergeConsecutiveUserTurns(previous, current) {
    var _a;
    var mergedContent = __spreadArray(__spreadArray([], (Array.isArray(previous.content) ? previous.content : []), true), (Array.isArray(current.content) ? current.content : []), true);
    return __assign(__assign({}, current), { content: mergedContent, timestamp: (_a = current.timestamp) !== null && _a !== void 0 ? _a : previous.timestamp });
}
/**
 * Validates and fixes conversation turn sequences for Anthropic API.
 * Anthropic requires strict alternating user→assistant pattern.
 * Merges consecutive user messages together.
 */
function validateAnthropicTurns(messages) {
    if (!Array.isArray(messages) || messages.length === 0) {
        return messages;
    }
    var result = [];
    var lastRole;
    for (var _i = 0, messages_2 = messages; _i < messages_2.length; _i++) {
        var msg = messages_2[_i];
        if (!msg || typeof msg !== "object") {
            result.push(msg);
            continue;
        }
        var msgRole = msg.role;
        if (!msgRole) {
            result.push(msg);
            continue;
        }
        if (msgRole === lastRole && lastRole === "user") {
            var lastMsg = result[result.length - 1];
            var currentMsg = msg;
            if (lastMsg && typeof lastMsg === "object") {
                var lastUser = lastMsg;
                var merged = mergeConsecutiveUserTurns(lastUser, currentMsg);
                result[result.length - 1] = merged;
                continue;
            }
        }
        result.push(msg);
        lastRole = msgRole;
    }
    return result;
}
