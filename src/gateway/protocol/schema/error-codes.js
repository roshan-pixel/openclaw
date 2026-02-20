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
exports.ErrorCodes = void 0;
exports.errorShape = errorShape;
exports.ErrorCodes = {
    NOT_LINKED: "NOT_LINKED",
    NOT_PAIRED: "NOT_PAIRED",
    AGENT_TIMEOUT: "AGENT_TIMEOUT",
    INVALID_REQUEST: "INVALID_REQUEST",
    UNAVAILABLE: "UNAVAILABLE",
};
function errorShape(code, message, opts) {
    return __assign({ code: code, message: message }, opts);
}
