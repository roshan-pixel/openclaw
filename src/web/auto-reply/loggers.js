"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappHeartbeatLog = exports.whatsappOutboundLog = exports.whatsappInboundLog = exports.whatsappLog = void 0;
var subsystem_js_1 = require("../../logging/subsystem.js");
exports.whatsappLog = (0, subsystem_js_1.createSubsystemLogger)("gateway/channels/whatsapp");
exports.whatsappInboundLog = exports.whatsappLog.child("inbound");
exports.whatsappOutboundLog = exports.whatsappLog.child("outbound");
exports.whatsappHeartbeatLog = exports.whatsappLog.child("heartbeat");
