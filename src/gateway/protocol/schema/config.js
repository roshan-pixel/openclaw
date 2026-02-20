"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigSchemaResponseSchema = exports.ConfigUiHintSchema = exports.UpdateRunParamsSchema = exports.ConfigSchemaParamsSchema = exports.ConfigPatchParamsSchema = exports.ConfigApplyParamsSchema = exports.ConfigSetParamsSchema = exports.ConfigGetParamsSchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var primitives_js_1 = require("./primitives.js");
exports.ConfigGetParamsSchema = typebox_1.Type.Object({}, { additionalProperties: false });
exports.ConfigSetParamsSchema = typebox_1.Type.Object({
    raw: primitives_js_1.NonEmptyString,
    baseHash: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
}, { additionalProperties: false });
exports.ConfigApplyParamsSchema = typebox_1.Type.Object({
    raw: primitives_js_1.NonEmptyString,
    baseHash: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    sessionKey: typebox_1.Type.Optional(typebox_1.Type.String()),
    note: typebox_1.Type.Optional(typebox_1.Type.String()),
    restartDelayMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
}, { additionalProperties: false });
exports.ConfigPatchParamsSchema = typebox_1.Type.Object({
    raw: primitives_js_1.NonEmptyString,
    baseHash: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    sessionKey: typebox_1.Type.Optional(typebox_1.Type.String()),
    note: typebox_1.Type.Optional(typebox_1.Type.String()),
    restartDelayMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
}, { additionalProperties: false });
exports.ConfigSchemaParamsSchema = typebox_1.Type.Object({}, { additionalProperties: false });
exports.UpdateRunParamsSchema = typebox_1.Type.Object({
    sessionKey: typebox_1.Type.Optional(typebox_1.Type.String()),
    note: typebox_1.Type.Optional(typebox_1.Type.String()),
    restartDelayMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1 })),
}, { additionalProperties: false });
exports.ConfigUiHintSchema = typebox_1.Type.Object({
    label: typebox_1.Type.Optional(typebox_1.Type.String()),
    help: typebox_1.Type.Optional(typebox_1.Type.String()),
    group: typebox_1.Type.Optional(typebox_1.Type.String()),
    order: typebox_1.Type.Optional(typebox_1.Type.Integer()),
    advanced: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    sensitive: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    placeholder: typebox_1.Type.Optional(typebox_1.Type.String()),
    itemTemplate: typebox_1.Type.Optional(typebox_1.Type.Unknown()),
}, { additionalProperties: false });
exports.ConfigSchemaResponseSchema = typebox_1.Type.Object({
    schema: typebox_1.Type.Unknown(),
    uiHints: typebox_1.Type.Record(typebox_1.Type.String(), exports.ConfigUiHintSchema),
    version: primitives_js_1.NonEmptyString,
    generatedAt: primitives_js_1.NonEmptyString,
}, { additionalProperties: false });
