"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsCompactParamsSchema = exports.SessionsDeleteParamsSchema = exports.SessionsResetParamsSchema = exports.SessionsPatchParamsSchema = exports.SessionsResolveParamsSchema = exports.SessionsPreviewParamsSchema = exports.SessionsListParamsSchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var primitives_js_1 = require("./primitives.js");
exports.SessionsListParamsSchema = typebox_1.Type.Object({
    limit: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1 })),
    activeMinutes: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1 })),
    includeGlobal: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    includeUnknown: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    /**
     * Read first 8KB of each session transcript to derive title from first user message.
     * Performs a file read per session - use `limit` to bound result set on large stores.
     */
    includeDerivedTitles: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    /**
     * Read last 16KB of each session transcript to extract most recent message preview.
     * Performs a file read per session - use `limit` to bound result set on large stores.
     */
    includeLastMessage: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    label: typebox_1.Type.Optional(primitives_js_1.SessionLabelString),
    spawnedBy: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    agentId: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    search: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
exports.SessionsPreviewParamsSchema = typebox_1.Type.Object({
    keys: typebox_1.Type.Array(primitives_js_1.NonEmptyString, { minItems: 1 }),
    limit: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1 })),
    maxChars: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 20 })),
}, { additionalProperties: false });
exports.SessionsResolveParamsSchema = typebox_1.Type.Object({
    key: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    sessionId: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    label: typebox_1.Type.Optional(primitives_js_1.SessionLabelString),
    agentId: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    spawnedBy: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    includeGlobal: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    includeUnknown: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
}, { additionalProperties: false });
exports.SessionsPatchParamsSchema = typebox_1.Type.Object({
    key: primitives_js_1.NonEmptyString,
    label: typebox_1.Type.Optional(typebox_1.Type.Union([primitives_js_1.SessionLabelString, typebox_1.Type.Null()])),
    thinkingLevel: typebox_1.Type.Optional(typebox_1.Type.Union([primitives_js_1.NonEmptyString, typebox_1.Type.Null()])),
    verboseLevel: typebox_1.Type.Optional(typebox_1.Type.Union([primitives_js_1.NonEmptyString, typebox_1.Type.Null()])),
    reasoningLevel: typebox_1.Type.Optional(typebox_1.Type.Union([primitives_js_1.NonEmptyString, typebox_1.Type.Null()])),
    responseUsage: typebox_1.Type.Optional(typebox_1.Type.Union([
        typebox_1.Type.Literal("off"),
        typebox_1.Type.Literal("tokens"),
        typebox_1.Type.Literal("full"),
        // Backward compat with older clients/stores.
        typebox_1.Type.Literal("on"),
        typebox_1.Type.Null(),
    ])),
    elevatedLevel: typebox_1.Type.Optional(typebox_1.Type.Union([primitives_js_1.NonEmptyString, typebox_1.Type.Null()])),
    execHost: typebox_1.Type.Optional(typebox_1.Type.Union([primitives_js_1.NonEmptyString, typebox_1.Type.Null()])),
    execSecurity: typebox_1.Type.Optional(typebox_1.Type.Union([primitives_js_1.NonEmptyString, typebox_1.Type.Null()])),
    execAsk: typebox_1.Type.Optional(typebox_1.Type.Union([primitives_js_1.NonEmptyString, typebox_1.Type.Null()])),
    execNode: typebox_1.Type.Optional(typebox_1.Type.Union([primitives_js_1.NonEmptyString, typebox_1.Type.Null()])),
    model: typebox_1.Type.Optional(typebox_1.Type.Union([primitives_js_1.NonEmptyString, typebox_1.Type.Null()])),
    spawnedBy: typebox_1.Type.Optional(typebox_1.Type.Union([primitives_js_1.NonEmptyString, typebox_1.Type.Null()])),
    sendPolicy: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal("allow"), typebox_1.Type.Literal("deny"), typebox_1.Type.Null()])),
    groupActivation: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal("mention"), typebox_1.Type.Literal("always"), typebox_1.Type.Null()])),
}, { additionalProperties: false });
exports.SessionsResetParamsSchema = typebox_1.Type.Object({ key: primitives_js_1.NonEmptyString }, { additionalProperties: false });
exports.SessionsDeleteParamsSchema = typebox_1.Type.Object({
    key: primitives_js_1.NonEmptyString,
    deleteTranscript: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
}, { additionalProperties: false });
exports.SessionsCompactParamsSchema = typebox_1.Type.Object({
    key: primitives_js_1.NonEmptyString,
    maxLines: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1 })),
}, { additionalProperties: false });
