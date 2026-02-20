"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPairingReply = buildPairingReply;
var command_format_js_1 = require("../cli/command-format.js");
function buildPairingReply(params) {
    var channel = params.channel, idLine = params.idLine, code = params.code;
    return [
        "OpenClaw: access not configured.",
        "",
        idLine,
        "",
        "Pairing code: ".concat(code),
        "",
        "Ask the bot owner to approve with:",
        (0, command_format_js_1.formatCliCommand)("openclaw pairing approve ".concat(channel, " <code>")),
    ].join("\n");
}
