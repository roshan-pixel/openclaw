"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTargetId = normalizeTargetId;
exports.buildMessagingTarget = buildMessagingTarget;
exports.ensureTargetId = ensureTargetId;
exports.requireTargetKind = requireTargetKind;
function normalizeTargetId(kind, id) {
    return "".concat(kind, ":").concat(id).toLowerCase();
}
function buildMessagingTarget(kind, id, raw) {
    return {
        kind: kind,
        id: id,
        raw: raw,
        normalized: normalizeTargetId(kind, id),
    };
}
function ensureTargetId(params) {
    if (!params.pattern.test(params.candidate)) {
        throw new Error(params.errorMessage);
    }
    return params.candidate;
}
function requireTargetKind(params) {
    var kindLabel = params.kind;
    if (!params.target) {
        throw new Error("".concat(params.platform, " ").concat(kindLabel, " id is required."));
    }
    if (params.target.kind !== params.kind) {
        throw new Error("".concat(params.platform, " ").concat(kindLabel, " id is required (use ").concat(kindLabel, ":<id>)."));
    }
    return params.target.id;
}
