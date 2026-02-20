"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSignalReactionLevel = resolveSignalReactionLevel;
var accounts_js_1 = require("./accounts.js");
/**
 * Resolve the effective reaction level and its implications for Signal.
 *
 * Levels:
 * - "off": No reactions at all
 * - "ack": Only automatic ack reactions (👀 when processing), no agent reactions
 * - "minimal": Agent can react, but sparingly (default)
 * - "extensive": Agent can react liberally
 */
function resolveSignalReactionLevel(params) {
    var _a;
    var account = (0, accounts_js_1.resolveSignalAccount)({
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
            // Fallback to minimal behavior
            return {
                level: "minimal",
                ackEnabled: false,
                agentReactionsEnabled: true,
                agentReactionGuidance: "minimal",
            };
    }
}
