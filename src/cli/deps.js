"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWebSelfId = void 0;
exports.createDefaultDeps = createDefaultDeps;
exports.createOutboundSendDeps = createOutboundSendDeps;
var index_js_1 = require("../channels/web/index.js");
Object.defineProperty(exports, "logWebSelfId", { enumerable: true, get: function () { return index_js_1.logWebSelfId; } });
var send_js_1 = require("../discord/send.js");
var send_js_2 = require("../imessage/send.js");
var send_js_3 = require("../signal/send.js");
var send_js_4 = require("../slack/send.js");
var send_js_5 = require("../telegram/send.js");
function createDefaultDeps() {
    return {
        sendMessageWhatsApp: index_js_1.sendMessageWhatsApp,
        sendMessageTelegram: send_js_5.sendMessageTelegram,
        sendMessageDiscord: send_js_1.sendMessageDiscord,
        sendMessageSlack: send_js_4.sendMessageSlack,
        sendMessageSignal: send_js_3.sendMessageSignal,
        sendMessageIMessage: send_js_2.sendMessageIMessage,
    };
}
// Provider docking: extend this mapping when adding new outbound send deps.
function createOutboundSendDeps(deps) {
    return {
        sendWhatsApp: deps.sendMessageWhatsApp,
        sendTelegram: deps.sendMessageTelegram,
        sendDiscord: deps.sendMessageDiscord,
        sendSlack: deps.sendMessageSlack,
        sendSignal: deps.sendMessageSignal,
        sendIMessage: deps.sendMessageIMessage,
    };
}
