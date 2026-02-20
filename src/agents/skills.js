"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncSkillsToWorkspace = exports.resolveSkillsPromptForRun = exports.loadWorkspaceSkillEntries = exports.filterWorkspaceSkillEntries = exports.buildWorkspaceSkillCommandSpecs = exports.buildWorkspaceSkillsPrompt = exports.buildWorkspaceSkillSnapshot = exports.applySkillEnvOverridesFromSnapshot = exports.applySkillEnvOverrides = exports.resolveSkillConfig = exports.resolveRuntimePlatform = exports.resolveConfigPath = exports.resolveBundledAllowlist = exports.isConfigPathTruthy = exports.isBundledSkillAllowed = exports.hasBinary = void 0;
exports.resolveSkillsInstallPreferences = resolveSkillsInstallPreferences;
var config_js_1 = require("./skills/config.js");
Object.defineProperty(exports, "hasBinary", { enumerable: true, get: function () { return config_js_1.hasBinary; } });
Object.defineProperty(exports, "isBundledSkillAllowed", { enumerable: true, get: function () { return config_js_1.isBundledSkillAllowed; } });
Object.defineProperty(exports, "isConfigPathTruthy", { enumerable: true, get: function () { return config_js_1.isConfigPathTruthy; } });
Object.defineProperty(exports, "resolveBundledAllowlist", { enumerable: true, get: function () { return config_js_1.resolveBundledAllowlist; } });
Object.defineProperty(exports, "resolveConfigPath", { enumerable: true, get: function () { return config_js_1.resolveConfigPath; } });
Object.defineProperty(exports, "resolveRuntimePlatform", { enumerable: true, get: function () { return config_js_1.resolveRuntimePlatform; } });
Object.defineProperty(exports, "resolveSkillConfig", { enumerable: true, get: function () { return config_js_1.resolveSkillConfig; } });
var env_overrides_js_1 = require("./skills/env-overrides.js");
Object.defineProperty(exports, "applySkillEnvOverrides", { enumerable: true, get: function () { return env_overrides_js_1.applySkillEnvOverrides; } });
Object.defineProperty(exports, "applySkillEnvOverridesFromSnapshot", { enumerable: true, get: function () { return env_overrides_js_1.applySkillEnvOverridesFromSnapshot; } });
var workspace_js_1 = require("./skills/workspace.js");
Object.defineProperty(exports, "buildWorkspaceSkillSnapshot", { enumerable: true, get: function () { return workspace_js_1.buildWorkspaceSkillSnapshot; } });
Object.defineProperty(exports, "buildWorkspaceSkillsPrompt", { enumerable: true, get: function () { return workspace_js_1.buildWorkspaceSkillsPrompt; } });
Object.defineProperty(exports, "buildWorkspaceSkillCommandSpecs", { enumerable: true, get: function () { return workspace_js_1.buildWorkspaceSkillCommandSpecs; } });
Object.defineProperty(exports, "filterWorkspaceSkillEntries", { enumerable: true, get: function () { return workspace_js_1.filterWorkspaceSkillEntries; } });
Object.defineProperty(exports, "loadWorkspaceSkillEntries", { enumerable: true, get: function () { return workspace_js_1.loadWorkspaceSkillEntries; } });
Object.defineProperty(exports, "resolveSkillsPromptForRun", { enumerable: true, get: function () { return workspace_js_1.resolveSkillsPromptForRun; } });
Object.defineProperty(exports, "syncSkillsToWorkspace", { enumerable: true, get: function () { return workspace_js_1.syncSkillsToWorkspace; } });
function resolveSkillsInstallPreferences(config) {
    var _a, _b;
    var raw = (_a = config === null || config === void 0 ? void 0 : config.skills) === null || _a === void 0 ? void 0 : _a.install;
    var preferBrew = (_b = raw === null || raw === void 0 ? void 0 : raw.preferBrew) !== null && _b !== void 0 ? _b : true;
    var managerRaw = typeof (raw === null || raw === void 0 ? void 0 : raw.nodeManager) === "string" ? raw.nodeManager.trim() : "";
    var manager = managerRaw.toLowerCase();
    var nodeManager = manager === "pnpm" || manager === "yarn" || manager === "bun" || manager === "npm"
        ? manager
        : "npm";
    return { preferBrew: preferBrew, nodeManager: nodeManager };
}
