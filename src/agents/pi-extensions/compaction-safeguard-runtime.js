"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCompactionSafeguardRuntime = setCompactionSafeguardRuntime;
exports.getCompactionSafeguardRuntime = getCompactionSafeguardRuntime;
// Session-scoped runtime registry keyed by object identity.
// Follows the same WeakMap pattern as context-pruning/runtime.ts.
var REGISTRY = new WeakMap();
function setCompactionSafeguardRuntime(sessionManager, value) {
    if (!sessionManager || typeof sessionManager !== "object") {
        return;
    }
    var key = sessionManager;
    if (value === null) {
        REGISTRY.delete(key);
        return;
    }
    REGISTRY.set(key, value);
}
function getCompactionSafeguardRuntime(sessionManager) {
    var _a;
    if (!sessionManager || typeof sessionManager !== "object") {
        return null;
    }
    return (_a = REGISTRY.get(sessionManager)) !== null && _a !== void 0 ? _a : null;
}
