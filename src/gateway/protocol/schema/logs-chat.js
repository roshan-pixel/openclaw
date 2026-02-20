"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatEventSchema = exports.ChatInjectParamsSchema = exports.ChatAbortParamsSchema = exports.ChatSendParamsSchema = exports.ChatHistoryParamsSchema = exports.LogsTailResultSchema = exports.LogsTailParamsSchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var primitives_js_1 = require("./primitives.js");
exports.LogsTailParamsSchema = typebox_1.Type.Object({
    cursor: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    limit: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1, maximum: 5000 })),
    maxBytes: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1, maximum: 1000000 })),
}, { additionalProperties: false });
exports.LogsTailResultSchema = typebox_1.Type.Object({
    file: primitives_js_1.NonEmptyString,
    cursor: typebox_1.Type.Integer({ minimum: 0 }),
    size: typebox_1.Type.Integer({ minimum: 0 }),
    lines: typebox_1.Type.Array(typebox_1.Type.String()),
    truncated: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    reset: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
}, { additionalProperties: false });
// WebChat/WebSocket-native chat methods
exports.ChatHistoryParamsSchema = typebox_1.Type.Object({
    sessionKey: primitives_js_1.NonEmptyString,
    limit: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1, maximum: 1000 })),
}, { additionalProperties: false });
exports.ChatSendParamsSchema = typebox_1.Type.Object({
    sessionKey: primitives_js_1.NonEmptyString,
    message: typebox_1.Type.String(),
    thinking: typebox_1.Type.Optional(typebox_1.Type.String()),
    deliver: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    attachments: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Unknown())),
    timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    idempotencyKey: primitives_js_1.NonEmptyString,
}, { additionalProperties: false });
exports.ChatAbortParamsSchema = typebox_1.Type.Object({
    sessionKey: primitives_js_1.NonEmptyString,
    runId: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
}, { additionalProperties: false });
exports.ChatInjectParamsSchema = typebox_1.Type.Object({
    sessionKey: primitives_js_1.NonEmptyString,
    message: primitives_js_1.NonEmptyString,
    label: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 100 })),
}, { additionalProperties: false });
exports.ChatEventSchema = typebox_1.Type.Object({
    runId: primitives_js_1.NonEmptyString,
    sessionKey: primitives_js_1.NonEmptyString,
    seq: typebox_1.Type.Integer({ minimum: 0 }),
    state: typebox_1.Type.Union([
        typebox_1.Type.Literal("delta"),
        typebox_1.Type.Literal("final"),
        typebox_1.Type.Literal("aborted"),
        typebox_1.Type.Literal("error"),
    ]),
    message: typebox_1.Type.Optional(typebox_1.Type.Unknown()),
    errorMessage: typebox_1.Type.Optional(typebox_1.Type.String()),
    usage: typebox_1.Type.Optional(typebox_1.Type.Unknown()),
    stopReason: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
