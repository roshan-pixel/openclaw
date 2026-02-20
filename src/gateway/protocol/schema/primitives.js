"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayClientModeSchema = exports.GatewayClientIdSchema = exports.SessionLabelString = exports.NonEmptyString = void 0;
var typebox_1 = require("@sinclair/typebox");
var session_label_js_1 = require("../../../sessions/session-label.js");
var client_info_js_1 = require("../client-info.js");
exports.NonEmptyString = typebox_1.Type.String({ minLength: 1 });
exports.SessionLabelString = typebox_1.Type.String({
    minLength: 1,
    maxLength: session_label_js_1.SESSION_LABEL_MAX_LENGTH,
});
exports.GatewayClientIdSchema = typebox_1.Type.Union(Object.values(client_info_js_1.GATEWAY_CLIENT_IDS).map(function (value) { return typebox_1.Type.Literal(value); }));
exports.GatewayClientModeSchema = typebox_1.Type.Union(Object.values(client_info_js_1.GATEWAY_CLIENT_MODES).map(function (value) { return typebox_1.Type.Literal(value); }));
