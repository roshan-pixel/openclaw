"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeInvokeRequestEventSchema = exports.NodeEventParamsSchema = exports.NodeInvokeResultParamsSchema = exports.NodeInvokeParamsSchema = exports.NodeDescribeParamsSchema = exports.NodeListParamsSchema = exports.NodeRenameParamsSchema = exports.NodePairVerifyParamsSchema = exports.NodePairRejectParamsSchema = exports.NodePairApproveParamsSchema = exports.NodePairListParamsSchema = exports.NodePairRequestParamsSchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var primitives_js_1 = require("./primitives.js");
exports.NodePairRequestParamsSchema = typebox_1.Type.Object({
    nodeId: primitives_js_1.NonEmptyString,
    displayName: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    platform: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    version: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    coreVersion: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    uiVersion: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    deviceFamily: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    modelIdentifier: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    caps: typebox_1.Type.Optional(typebox_1.Type.Array(primitives_js_1.NonEmptyString)),
    commands: typebox_1.Type.Optional(typebox_1.Type.Array(primitives_js_1.NonEmptyString)),
    remoteIp: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    silent: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
}, { additionalProperties: false });
exports.NodePairListParamsSchema = typebox_1.Type.Object({}, { additionalProperties: false });
exports.NodePairApproveParamsSchema = typebox_1.Type.Object({ requestId: primitives_js_1.NonEmptyString }, { additionalProperties: false });
exports.NodePairRejectParamsSchema = typebox_1.Type.Object({ requestId: primitives_js_1.NonEmptyString }, { additionalProperties: false });
exports.NodePairVerifyParamsSchema = typebox_1.Type.Object({ nodeId: primitives_js_1.NonEmptyString, token: primitives_js_1.NonEmptyString }, { additionalProperties: false });
exports.NodeRenameParamsSchema = typebox_1.Type.Object({ nodeId: primitives_js_1.NonEmptyString, displayName: primitives_js_1.NonEmptyString }, { additionalProperties: false });
exports.NodeListParamsSchema = typebox_1.Type.Object({}, { additionalProperties: false });
exports.NodeDescribeParamsSchema = typebox_1.Type.Object({ nodeId: primitives_js_1.NonEmptyString }, { additionalProperties: false });
exports.NodeInvokeParamsSchema = typebox_1.Type.Object({
    nodeId: primitives_js_1.NonEmptyString,
    command: primitives_js_1.NonEmptyString,
    params: typebox_1.Type.Optional(typebox_1.Type.Unknown()),
    timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    idempotencyKey: primitives_js_1.NonEmptyString,
}, { additionalProperties: false });
exports.NodeInvokeResultParamsSchema = typebox_1.Type.Object({
    id: primitives_js_1.NonEmptyString,
    nodeId: primitives_js_1.NonEmptyString,
    ok: typebox_1.Type.Boolean(),
    payload: typebox_1.Type.Optional(typebox_1.Type.Unknown()),
    payloadJSON: typebox_1.Type.Optional(typebox_1.Type.String()),
    error: typebox_1.Type.Optional(typebox_1.Type.Object({
        code: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
        message: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    }, { additionalProperties: false })),
}, { additionalProperties: false });
exports.NodeEventParamsSchema = typebox_1.Type.Object({
    event: primitives_js_1.NonEmptyString,
    payload: typebox_1.Type.Optional(typebox_1.Type.Unknown()),
    payloadJSON: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
exports.NodeInvokeRequestEventSchema = typebox_1.Type.Object({
    id: primitives_js_1.NonEmptyString,
    nodeId: primitives_js_1.NonEmptyString,
    command: primitives_js_1.NonEmptyString,
    paramsJSON: typebox_1.Type.Optional(typebox_1.Type.String()),
    timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    idempotencyKey: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
}, { additionalProperties: false });
