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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMentionGating = resolveMentionGating;
exports.resolveMentionGatingWithBypass = resolveMentionGatingWithBypass;
function resolveMentionGating(params) {
    var implicit = params.implicitMention === true;
    var bypass = params.shouldBypassMention === true;
    var effectiveWasMentioned = params.wasMentioned || implicit || bypass;
    var shouldSkip = params.requireMention && params.canDetectMention && !effectiveWasMentioned;
    return { effectiveWasMentioned: effectiveWasMentioned, shouldSkip: shouldSkip };
}
function resolveMentionGatingWithBypass(params) {
    var _a;
    var shouldBypassMention = params.isGroup &&
        params.requireMention &&
        !params.wasMentioned &&
        !((_a = params.hasAnyMention) !== null && _a !== void 0 ? _a : false) &&
        params.allowTextCommands &&
        params.commandAuthorized &&
        params.hasControlCommand;
    return __assign(__assign({}, resolveMentionGating({
        requireMention: params.requireMention,
        canDetectMention: params.canDetectMention,
        wasMentioned: params.wasMentioned,
        implicitMention: params.implicitMention,
        shouldBypassMention: shouldBypassMention,
    })), { shouldBypassMention: shouldBypassMention });
}
