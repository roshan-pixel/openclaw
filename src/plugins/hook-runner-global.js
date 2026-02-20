"use strict";
/**
 * Global Plugin Hook Runner
 *
 * Singleton hook runner that's initialized when plugins are loaded
 * and can be called from anywhere in the codebase.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGlobalHookRunner = initializeGlobalHookRunner;
exports.getGlobalHookRunner = getGlobalHookRunner;
exports.getGlobalPluginRegistry = getGlobalPluginRegistry;
exports.hasGlobalHooks = hasGlobalHooks;
exports.resetGlobalHookRunner = resetGlobalHookRunner;
var subsystem_js_1 = require("../logging/subsystem.js");
var hooks_js_1 = require("./hooks.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("plugins");
var globalHookRunner = null;
var globalRegistry = null;
/**
 * Initialize the global hook runner with a plugin registry.
 * Called once when plugins are loaded during gateway startup.
 */
function initializeGlobalHookRunner(registry) {
    globalRegistry = registry;
    globalHookRunner = (0, hooks_js_1.createHookRunner)(registry, {
        logger: {
            debug: function (msg) { return log.debug(msg); },
            warn: function (msg) { return log.warn(msg); },
            error: function (msg) { return log.error(msg); },
        },
        catchErrors: true,
    });
    var hookCount = registry.hooks.length;
    if (hookCount > 0) {
        log.info("hook runner initialized with ".concat(hookCount, " registered hooks"));
    }
}
/**
 * Get the global hook runner.
 * Returns null if plugins haven't been loaded yet.
 */
function getGlobalHookRunner() {
    return globalHookRunner;
}
/**
 * Get the global plugin registry.
 * Returns null if plugins haven't been loaded yet.
 */
function getGlobalPluginRegistry() {
    return globalRegistry;
}
/**
 * Check if any hooks are registered for a given hook name.
 */
function hasGlobalHooks(hookName) {
    var _a;
    return (_a = globalHookRunner === null || globalHookRunner === void 0 ? void 0 : globalHookRunner.hasHooks(hookName)) !== null && _a !== void 0 ? _a : false;
}
/**
 * Reset the global hook runner (for testing).
 */
function resetGlobalHookRunner() {
    globalHookRunner = null;
    globalRegistry = null;
}
