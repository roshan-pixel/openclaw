"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRuntime = resolveRuntime;
exports.normalizeAllowList = normalizeAllowList;
function resolveRuntime(opts) {
    var _a;
    return ((_a = opts.runtime) !== null && _a !== void 0 ? _a : {
        log: console.log,
        error: console.error,
        exit: function (code) {
            throw new Error("exit ".concat(code));
        },
    });
}
function normalizeAllowList(list) {
    return (list !== null && list !== void 0 ? list : []).map(function (entry) { return String(entry).trim(); }).filter(Boolean);
}
