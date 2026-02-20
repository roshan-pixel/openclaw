"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInboundDrop = logInboundDrop;
exports.logTypingFailure = logTypingFailure;
exports.logAckFailure = logAckFailure;
function logInboundDrop(params) {
    var target = params.target ? " target=".concat(params.target) : "";
    params.log("".concat(params.channel, ": drop ").concat(params.reason).concat(target));
}
function logTypingFailure(params) {
    var target = params.target ? " target=".concat(params.target) : "";
    var action = params.action ? " action=".concat(params.action) : "";
    params.log("".concat(params.channel, " typing").concat(action, " failed").concat(target, ": ").concat(String(params.error)));
}
function logAckFailure(params) {
    var target = params.target ? " target=".concat(params.target) : "";
    params.log("".concat(params.channel, " ack cleanup failed").concat(target, ": ").concat(String(params.error)));
}
