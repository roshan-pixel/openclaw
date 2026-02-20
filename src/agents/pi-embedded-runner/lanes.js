"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSessionLane = resolveSessionLane;
exports.resolveGlobalLane = resolveGlobalLane;
exports.resolveEmbeddedSessionLane = resolveEmbeddedSessionLane;
function resolveSessionLane(key) {
    var cleaned = key.trim() || "main" /* CommandLane.Main */;
    return cleaned.startsWith("session:") ? cleaned : "session:".concat(cleaned);
}
function resolveGlobalLane(lane) {
    var cleaned = lane === null || lane === void 0 ? void 0 : lane.trim();
    return cleaned ? cleaned : "main" /* CommandLane.Main */;
}
function resolveEmbeddedSessionLane(key) {
    return resolveSessionLane(key);
}
