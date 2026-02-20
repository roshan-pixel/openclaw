"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAllowlistMatchMeta = formatAllowlistMatchMeta;
function formatAllowlistMatchMeta(match) {
    var _a, _b;
    return "matchKey=".concat((_a = match === null || match === void 0 ? void 0 : match.matchKey) !== null && _a !== void 0 ? _a : "none", " matchSource=").concat((_b = match === null || match === void 0 ? void 0 : match.matchSource) !== null && _b !== void 0 ? _b : "none");
}
