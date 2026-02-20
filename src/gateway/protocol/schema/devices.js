"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicePairResolvedEventSchema = exports.DevicePairRequestedEventSchema = exports.DeviceTokenRevokeParamsSchema = exports.DeviceTokenRotateParamsSchema = exports.DevicePairRejectParamsSchema = exports.DevicePairApproveParamsSchema = exports.DevicePairListParamsSchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var primitives_js_1 = require("./primitives.js");
exports.DevicePairListParamsSchema = typebox_1.Type.Object({}, { additionalProperties: false });
exports.DevicePairApproveParamsSchema = typebox_1.Type.Object({ requestId: primitives_js_1.NonEmptyString }, { additionalProperties: false });
exports.DevicePairRejectParamsSchema = typebox_1.Type.Object({ requestId: primitives_js_1.NonEmptyString }, { additionalProperties: false });
exports.DeviceTokenRotateParamsSchema = typebox_1.Type.Object({
    deviceId: primitives_js_1.NonEmptyString,
    role: primitives_js_1.NonEmptyString,
    scopes: typebox_1.Type.Optional(typebox_1.Type.Array(primitives_js_1.NonEmptyString)),
}, { additionalProperties: false });
exports.DeviceTokenRevokeParamsSchema = typebox_1.Type.Object({
    deviceId: primitives_js_1.NonEmptyString,
    role: primitives_js_1.NonEmptyString,
}, { additionalProperties: false });
exports.DevicePairRequestedEventSchema = typebox_1.Type.Object({
    requestId: primitives_js_1.NonEmptyString,
    deviceId: primitives_js_1.NonEmptyString,
    publicKey: primitives_js_1.NonEmptyString,
    displayName: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    platform: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    clientId: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    clientMode: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    role: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    roles: typebox_1.Type.Optional(typebox_1.Type.Array(primitives_js_1.NonEmptyString)),
    scopes: typebox_1.Type.Optional(typebox_1.Type.Array(primitives_js_1.NonEmptyString)),
    remoteIp: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    silent: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    isRepair: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    ts: typebox_1.Type.Integer({ minimum: 0 }),
}, { additionalProperties: false });
exports.DevicePairResolvedEventSchema = typebox_1.Type.Object({
    requestId: primitives_js_1.NonEmptyString,
    deviceId: primitives_js_1.NonEmptyString,
    decision: primitives_js_1.NonEmptyString,
    ts: typebox_1.Type.Integer({ minimum: 0 }),
}, { additionalProperties: false });
