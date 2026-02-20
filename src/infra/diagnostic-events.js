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
exports.isDiagnosticsEnabled = isDiagnosticsEnabled;
exports.emitDiagnosticEvent = emitDiagnosticEvent;
exports.onDiagnosticEvent = onDiagnosticEvent;
exports.resetDiagnosticEventsForTest = resetDiagnosticEventsForTest;
var seq = 0;
var listeners = new Set();
function isDiagnosticsEnabled(config) {
    var _a;
    return ((_a = config === null || config === void 0 ? void 0 : config.diagnostics) === null || _a === void 0 ? void 0 : _a.enabled) === true;
}
function emitDiagnosticEvent(event) {
    var enriched = __assign(__assign({}, event), { seq: (seq += 1), ts: Date.now() });
    for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
        var listener = listeners_1[_i];
        try {
            listener(enriched);
        }
        catch (_a) {
            // Ignore listener failures.
        }
    }
}
function onDiagnosticEvent(listener) {
    listeners.add(listener);
    return function () { return listeners.delete(listener); };
}
function resetDiagnosticEventsForTest() {
    seq = 0;
    listeners.clear();
}
