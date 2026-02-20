"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = void 0;
var node_module_1 = require("node:module");
function readVersionFromPackageJson() {
    var _a;
    try {
        var require_1 = (0, node_module_1.createRequire)(import.meta.url);
        var pkg = require_1("../package.json");
        return (_a = pkg.version) !== null && _a !== void 0 ? _a : null;
    }
    catch (_b) {
        return null;
    }
}
// Single source of truth for the current OpenClaw version.
// - Embedded/bundled builds: injected define or env var.
// - Dev/npm builds: package.json.
exports.VERSION = (typeof __OPENCLAW_VERSION__ === "string" && __OPENCLAW_VERSION__) ||
    process.env.OPENCLAW_BUNDLED_VERSION ||
    readVersionFromPackageJson() ||
    "0.0.0";
