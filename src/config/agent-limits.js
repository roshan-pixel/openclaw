"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SUBAGENT_MAX_CONCURRENT = exports.DEFAULT_AGENT_MAX_CONCURRENT = void 0;
exports.resolveAgentMaxConcurrent = resolveAgentMaxConcurrent;
exports.resolveSubagentMaxConcurrent = resolveSubagentMaxConcurrent;
exports.DEFAULT_AGENT_MAX_CONCURRENT = 4;
exports.DEFAULT_SUBAGENT_MAX_CONCURRENT = 8;
function resolveAgentMaxConcurrent(cfg) {
    var _a, _b;
    var raw = (_b = (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.maxConcurrent;
    if (typeof raw === "number" && Number.isFinite(raw)) {
        return Math.max(1, Math.floor(raw));
    }
    return exports.DEFAULT_AGENT_MAX_CONCURRENT;
}
function resolveSubagentMaxConcurrent(cfg) {
    var _a, _b, _c;
    var raw = (_c = (_b = (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.subagents) === null || _c === void 0 ? void 0 : _c.maxConcurrent;
    if (typeof raw === "number" && Number.isFinite(raw)) {
        return Math.max(1, Math.floor(raw));
    }
    return exports.DEFAULT_SUBAGENT_MAX_CONCURRENT;
}
