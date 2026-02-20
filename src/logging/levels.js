"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_LOG_LEVELS = void 0;
exports.normalizeLogLevel = normalizeLogLevel;
exports.levelToMinLevel = levelToMinLevel;
exports.ALLOWED_LOG_LEVELS = [
    "silent",
    "fatal",
    "error",
    "warn",
    "info",
    "debug",
    "trace",
];
function normalizeLogLevel(level, fallback) {
    if (fallback === void 0) { fallback = "info"; }
    var candidate = (level !== null && level !== void 0 ? level : fallback).trim();
    return exports.ALLOWED_LOG_LEVELS.includes(candidate) ? candidate : fallback;
}
function levelToMinLevel(level) {
    // tslog level ordering: fatal=0, error=1, warn=2, info=3, debug=4, trace=5
    var map = {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        trace: 5,
        silent: Number.POSITIVE_INFINITY,
    };
    return map[level];
}
