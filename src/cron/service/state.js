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
exports.createCronServiceState = createCronServiceState;
function createCronServiceState(deps) {
    var _a;
    return {
        deps: __assign(__assign({}, deps), { nowMs: (_a = deps.nowMs) !== null && _a !== void 0 ? _a : (function () { return Date.now(); }) }),
        store: null,
        timer: null,
        running: false,
        op: Promise.resolve(),
        warnedDisabled: false,
    };
}
