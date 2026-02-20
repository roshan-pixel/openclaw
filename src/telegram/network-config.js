"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TELEGRAM_ENABLE_AUTO_SELECT_FAMILY_ENV = exports.TELEGRAM_DISABLE_AUTO_SELECT_FAMILY_ENV = void 0;
exports.resolveTelegramAutoSelectFamilyDecision = resolveTelegramAutoSelectFamilyDecision;
var node_process_1 = require("node:process");
var env_js_1 = require("../infra/env.js");
exports.TELEGRAM_DISABLE_AUTO_SELECT_FAMILY_ENV = "OPENCLAW_TELEGRAM_DISABLE_AUTO_SELECT_FAMILY";
exports.TELEGRAM_ENABLE_AUTO_SELECT_FAMILY_ENV = "OPENCLAW_TELEGRAM_ENABLE_AUTO_SELECT_FAMILY";
function resolveTelegramAutoSelectFamilyDecision(params) {
    var _a, _b;
    var env = (_a = params === null || params === void 0 ? void 0 : params.env) !== null && _a !== void 0 ? _a : node_process_1.default.env;
    var nodeMajor = typeof (params === null || params === void 0 ? void 0 : params.nodeMajor) === "number"
        ? params.nodeMajor
        : Number(node_process_1.default.versions.node.split(".")[0]);
    if ((0, env_js_1.isTruthyEnvValue)(env[exports.TELEGRAM_ENABLE_AUTO_SELECT_FAMILY_ENV])) {
        return { value: true, source: "env:".concat(exports.TELEGRAM_ENABLE_AUTO_SELECT_FAMILY_ENV) };
    }
    if ((0, env_js_1.isTruthyEnvValue)(env[exports.TELEGRAM_DISABLE_AUTO_SELECT_FAMILY_ENV])) {
        return { value: false, source: "env:".concat(exports.TELEGRAM_DISABLE_AUTO_SELECT_FAMILY_ENV) };
    }
    if (typeof ((_b = params === null || params === void 0 ? void 0 : params.network) === null || _b === void 0 ? void 0 : _b.autoSelectFamily) === "boolean") {
        return { value: params.network.autoSelectFamily, source: "config" };
    }
    if (Number.isFinite(nodeMajor) && nodeMajor >= 22) {
        return { value: false, source: "default-node22" };
    }
    return { value: null };
}
