"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSlackSlashCommandName = normalizeSlackSlashCommandName;
exports.resolveSlackSlashCommandConfig = resolveSlackSlashCommandConfig;
exports.buildSlackSlashCommandMatcher = buildSlackSlashCommandMatcher;
function normalizeSlackSlashCommandName(raw) {
    return raw.replace(/^\/+/, "");
}
function resolveSlackSlashCommandConfig(raw) {
    var _a, _b;
    var normalizedName = normalizeSlackSlashCommandName(((_a = raw === null || raw === void 0 ? void 0 : raw.name) === null || _a === void 0 ? void 0 : _a.trim()) || "openclaw");
    var name = normalizedName || "openclaw";
    return {
        enabled: (raw === null || raw === void 0 ? void 0 : raw.enabled) === true,
        name: name,
        sessionPrefix: ((_b = raw === null || raw === void 0 ? void 0 : raw.sessionPrefix) === null || _b === void 0 ? void 0 : _b.trim()) || "slack:slash",
        ephemeral: (raw === null || raw === void 0 ? void 0 : raw.ephemeral) !== false,
    };
}
function buildSlackSlashCommandMatcher(name) {
    var normalized = normalizeSlackSlashCommandName(name);
    var escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp("^/?".concat(escaped, "$"));
}
