"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setActivePluginRegistry = setActivePluginRegistry;
exports.getActivePluginRegistry = getActivePluginRegistry;
exports.requireActivePluginRegistry = requireActivePluginRegistry;
exports.getActivePluginRegistryKey = getActivePluginRegistryKey;
var createEmptyRegistry = function () { return ({
    plugins: [],
    tools: [],
    hooks: [],
    typedHooks: [],
    channels: [],
    providers: [],
    gatewayHandlers: {},
    httpHandlers: [],
    httpRoutes: [],
    cliRegistrars: [],
    services: [],
    commands: [],
    diagnostics: [],
}); };
var REGISTRY_STATE = Symbol.for("openclaw.pluginRegistryState");
var state = (function () {
    var globalState = globalThis;
    if (!globalState[REGISTRY_STATE]) {
        globalState[REGISTRY_STATE] = {
            registry: createEmptyRegistry(),
            key: null,
        };
    }
    return globalState[REGISTRY_STATE];
})();
function setActivePluginRegistry(registry, cacheKey) {
    state.registry = registry;
    state.key = cacheKey !== null && cacheKey !== void 0 ? cacheKey : null;
}
function getActivePluginRegistry() {
    return state.registry;
}
function requireActivePluginRegistry() {
    if (!state.registry) {
        state.registry = createEmptyRegistry();
    }
    return state.registry;
}
function getActivePluginRegistryKey() {
    return state.key;
}
