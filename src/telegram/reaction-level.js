"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTelegramReactionLevel = resolveTelegramReactionLevel;
var accounts_js_1 = require("./accounts.js");
/**
 * Resolve the effective reaction level and its implications.
 */
function resolveTelegramReactionLevel(params) {
    var _a;
    var account = (0, accounts_js_1.resolveTelegramAccount)({
        cfg: params.cfg,
        accountId: params.accountId,
    });
    var level = ((_a = account.config.reactionLevel) !== null && _a !== void 0 ? _a : "minimal");
    switch (level) {
        case "off":
            return {
                level: level,
                ackEnabled: false,
                agentReactionsEnabled: false,
            };
        case "ack":
            return {
                level: level,
                ackEnabled: true,
                agentReactionsEnabled: false,
            };
        case "minimal":
            return {
                level: level,
                ackEnabled: false,
                agentReactionsEnabled: true,
                agentReactionGuidance: "minimal",
            };
        case "extensive":
            return {
                level: level,
                ackEnabled: false,
                agentReactionsEnabled: true,
                agentReactionGuidance: "extensive",
            };
        default:
            // Fallback to ack behavior
            return {
                level: "ack",
                ackEnabled: true,
                agentReactionsEnabled: false,
            };
    }
}
