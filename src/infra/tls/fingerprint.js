"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeFingerprint = normalizeFingerprint;
function normalizeFingerprint(input) {
    var trimmed = input.trim();
    var withoutPrefix = trimmed.replace(/^sha-?256\s*:?\s*/i, "");
    return withoutPrefix.replace(/[^a-fA-F0-9]/g, "").toLowerCase();
}
