"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PI_COMPACTION_RESERVE_TOKENS_FLOOR = void 0;
exports.ensurePiCompactionReserveTokens = ensurePiCompactionReserveTokens;
exports.resolveCompactionReserveTokensFloor = resolveCompactionReserveTokensFloor;
exports.DEFAULT_PI_COMPACTION_RESERVE_TOKENS_FLOOR = 20000;
function ensurePiCompactionReserveTokens(params) {
    var _a;
    var minReserveTokens = (_a = params.minReserveTokens) !== null && _a !== void 0 ? _a : exports.DEFAULT_PI_COMPACTION_RESERVE_TOKENS_FLOOR;
    var current = params.settingsManager.getCompactionReserveTokens();
    if (current >= minReserveTokens) {
        return { didOverride: false, reserveTokens: current };
    }
    params.settingsManager.applyOverrides({
        compaction: { reserveTokens: minReserveTokens },
    });
    return { didOverride: true, reserveTokens: minReserveTokens };
}
function resolveCompactionReserveTokensFloor(cfg) {
    var _a, _b, _c;
    var raw = (_c = (_b = (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.compaction) === null || _c === void 0 ? void 0 : _c.reserveTokensFloor;
    if (typeof raw === "number" && Number.isFinite(raw) && raw >= 0) {
        return Math.floor(raw);
    }
    return exports.DEFAULT_PI_COMPACTION_RESERVE_TOKENS_FLOOR;
}
