"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveWebAccountId = resolveWebAccountId;
exports.requireActiveWebListener = requireActiveWebListener;
exports.setActiveWebListener = setActiveWebListener;
exports.getActiveWebListener = getActiveWebListener;
var command_format_js_1 = require("../cli/command-format.js");
var session_key_js_1 = require("../routing/session-key.js");
var _currentListener = null;
var listeners = new Map();
function resolveWebAccountId(accountId) {
    return (accountId !== null && accountId !== void 0 ? accountId : "").trim() || session_key_js_1.DEFAULT_ACCOUNT_ID;
}
function requireActiveWebListener(accountId) {
    var _a;
    var id = resolveWebAccountId(accountId);
    var listener = (_a = listeners.get(id)) !== null && _a !== void 0 ? _a : null;
    if (!listener) {
        throw new Error("No active WhatsApp Web listener (account: ".concat(id, "). Start the gateway, then link WhatsApp with: ").concat((0, command_format_js_1.formatCliCommand)("openclaw channels login --channel whatsapp --account ".concat(id)), "."));
    }
    return { accountId: id, listener: listener };
}
function setActiveWebListener(accountIdOrListener, maybeListener) {
    var _a = typeof accountIdOrListener === "string"
        ? { accountId: accountIdOrListener, listener: maybeListener !== null && maybeListener !== void 0 ? maybeListener : null }
        : {
            accountId: session_key_js_1.DEFAULT_ACCOUNT_ID,
            listener: accountIdOrListener !== null && accountIdOrListener !== void 0 ? accountIdOrListener : null,
        }, accountId = _a.accountId, listener = _a.listener;
    var id = resolveWebAccountId(accountId);
    if (!listener) {
        listeners.delete(id);
    }
    else {
        listeners.set(id, listener);
    }
    if (id === session_key_js_1.DEFAULT_ACCOUNT_ID) {
        _currentListener = listener;
    }
}
function getActiveWebListener(accountId) {
    var _a;
    var id = resolveWebAccountId(accountId);
    return (_a = listeners.get(id)) !== null && _a !== void 0 ? _a : null;
}
