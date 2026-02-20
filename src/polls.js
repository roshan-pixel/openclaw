"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePollInput = normalizePollInput;
exports.normalizePollDurationHours = normalizePollDurationHours;
function normalizePollInput(input, options) {
    var _a;
    if (options === void 0) { options = {}; }
    var question = input.question.trim();
    if (!question) {
        throw new Error("Poll question is required");
    }
    var pollOptions = ((_a = input.options) !== null && _a !== void 0 ? _a : []).map(function (option) { return option.trim(); });
    var cleaned = pollOptions.filter(Boolean);
    if (cleaned.length < 2) {
        throw new Error("Poll requires at least 2 options");
    }
    if (options.maxOptions !== undefined && cleaned.length > options.maxOptions) {
        throw new Error("Poll supports at most ".concat(options.maxOptions, " options"));
    }
    var maxSelectionsRaw = input.maxSelections;
    var maxSelections = typeof maxSelectionsRaw === "number" && Number.isFinite(maxSelectionsRaw)
        ? Math.floor(maxSelectionsRaw)
        : 1;
    if (maxSelections < 1) {
        throw new Error("maxSelections must be at least 1");
    }
    if (maxSelections > cleaned.length) {
        throw new Error("maxSelections cannot exceed option count");
    }
    var durationRaw = input.durationHours;
    var durationHours = typeof durationRaw === "number" && Number.isFinite(durationRaw)
        ? Math.floor(durationRaw)
        : undefined;
    if (durationHours !== undefined && durationHours < 1) {
        throw new Error("durationHours must be at least 1");
    }
    return {
        question: question,
        options: cleaned,
        maxSelections: maxSelections,
        durationHours: durationHours,
    };
}
function normalizePollDurationHours(value, options) {
    var base = typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : options.defaultHours;
    return Math.min(Math.max(base, 1), options.maxHours);
}
