"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCacheTtlMs = resolveCacheTtlMs;
exports.isCacheEnabled = isCacheEnabled;
exports.getFileMtimeMs = getFileMtimeMs;
var node_fs_1 = require("node:fs");
function resolveCacheTtlMs(params) {
    var envValue = params.envValue, defaultTtlMs = params.defaultTtlMs;
    if (envValue) {
        var parsed = Number.parseInt(envValue, 10);
        if (Number.isFinite(parsed) && parsed >= 0) {
            return parsed;
        }
    }
    return defaultTtlMs;
}
function isCacheEnabled(ttlMs) {
    return ttlMs > 0;
}
function getFileMtimeMs(filePath) {
    try {
        return node_fs_1.default.statSync(filePath).mtimeMs;
    }
    catch (_a) {
        return undefined;
    }
}
