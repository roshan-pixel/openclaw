"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setContextPruningRuntime = setContextPruningRuntime;
exports.getContextPruningRuntime = getContextPruningRuntime;
// Session-scoped runtime registry keyed by object identity.
// Important: this relies on Pi passing the same SessionManager object instance into
// ExtensionContext (ctx.sessionManager) that we used when calling setContextPruningRuntime.
var REGISTRY = new WeakMap();
function setContextPruningRuntime(sessionManager, value) {
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
function getContextPruningRuntime(sessionManager) {
    var _a;
    if (!sessionManager || typeof sessionManager !== "object") {
        return null;
    }
    return (_a = REGISTRY.get(sessionManager)) !== null && _a !== void 0 ? _a : null;
}
