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
exports.resolveIndicatorType = resolveIndicatorType;
exports.emitHeartbeatEvent = emitHeartbeatEvent;
exports.onHeartbeatEvent = onHeartbeatEvent;
exports.getLastHeartbeatEvent = getLastHeartbeatEvent;
function resolveIndicatorType(status) {
    switch (status) {
        case "ok-empty":
        case "ok-token":
            return "ok";
        case "sent":
            return "alert";
        case "failed":
            return "error";
        case "skipped":
            return undefined;
    }
}
var lastHeartbeat = null;
var listeners = new Set();
function emitHeartbeatEvent(evt) {
    var enriched = __assign({ ts: Date.now() }, evt);
    lastHeartbeat = enriched;
    for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
        var listener = listeners_1[_i];
        try {
            listener(enriched);
        }
        catch (_a) {
            /* ignore */
        }
    }
}
function onHeartbeatEvent(listener) {
    listeners.add(listener);
    return function () { return listeners.delete(listener); };
}
function getLastHeartbeatEvent() {
    return lastHeartbeat;
}
