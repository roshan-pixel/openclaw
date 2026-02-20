"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNativeDependencyHint = formatNativeDependencyHint;
function formatNativeDependencyHint(params) {
    var _a, _b, _c;
    var manager = (_a = params.manager) !== null && _a !== void 0 ? _a : "pnpm";
    var rebuildCommand = (_b = params.rebuildCommand) !== null && _b !== void 0 ? _b : (manager === "npm"
        ? "npm rebuild ".concat(params.packageName)
        : manager === "yarn"
            ? "yarn rebuild ".concat(params.packageName)
            : "pnpm rebuild ".concat(params.packageName));
    var approveBuildsCommand = (_c = params.approveBuildsCommand) !== null && _c !== void 0 ? _c : (manager === "pnpm" ? "pnpm approve-builds (select ".concat(params.packageName, ")") : undefined);
    var steps = [approveBuildsCommand, rebuildCommand, params.downloadCommand].filter(function (step) { return Boolean(step); });
    if (steps.length === 0) {
        return "Install ".concat(params.packageName, " and rebuild its native module.");
    }
    return "Install ".concat(params.packageName, " and rebuild its native module (").concat(steps.join("; "), ").");
}
