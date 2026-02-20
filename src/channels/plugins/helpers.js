"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveChannelDefaultAccountId = resolveChannelDefaultAccountId;
exports.formatPairingApproveHint = formatPairingApproveHint;
var command_format_js_1 = require("../../cli/command-format.js");
var session_key_js_1 = require("../../routing/session-key.js");
// Channel docking helper: use this when selecting the default account for a plugin.
function resolveChannelDefaultAccountId(params) {
    var _a, _b, _c, _d, _e;
    var accountIds = (_a = params.accountIds) !== null && _a !== void 0 ? _a : params.plugin.config.listAccountIds(params.cfg);
    return (_e = (_d = (_c = (_b = params.plugin.config).defaultAccountId) === null || _c === void 0 ? void 0 : _c.call(_b, params.cfg)) !== null && _d !== void 0 ? _d : accountIds[0]) !== null && _e !== void 0 ? _e : session_key_js_1.DEFAULT_ACCOUNT_ID;
}
function formatPairingApproveHint(channelId) {
    var listCmd = (0, command_format_js_1.formatCliCommand)("openclaw pairing list ".concat(channelId));
    var approveCmd = (0, command_format_js_1.formatCliCommand)("openclaw pairing approve ".concat(channelId, " <code>"));
    return "Approve via: ".concat(listCmd, " / ").concat(approveCmd);
}
