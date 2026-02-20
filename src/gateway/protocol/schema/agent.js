"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WakeParamsSchema = exports.AgentWaitParamsSchema = exports.AgentIdentityResultSchema = exports.AgentIdentityParamsSchema = exports.AgentParamsSchema = exports.PollParamsSchema = exports.SendParamsSchema = exports.AgentEventSchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var primitives_js_1 = require("./primitives.js");
exports.AgentEventSchema = typebox_1.Type.Object({
    runId: primitives_js_1.NonEmptyString,
    seq: typebox_1.Type.Integer({ minimum: 0 }),
    stream: primitives_js_1.NonEmptyString,
    ts: typebox_1.Type.Integer({ minimum: 0 }),
    data: typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Unknown()),
}, { additionalProperties: false });
exports.SendParamsSchema = typebox_1.Type.Object({
    to: primitives_js_1.NonEmptyString,
    message: primitives_js_1.NonEmptyString,
    mediaUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
    mediaUrls: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    gifPlayback: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    channel: typebox_1.Type.Optional(typebox_1.Type.String()),
    accountId: typebox_1.Type.Optional(typebox_1.Type.String()),
    /** Optional session key for mirroring delivered output back into the transcript. */
    sessionKey: typebox_1.Type.Optional(typebox_1.Type.String()),
    idempotencyKey: primitives_js_1.NonEmptyString,
}, { additionalProperties: false });
exports.PollParamsSchema = typebox_1.Type.Object({
    to: primitives_js_1.NonEmptyString,
    question: primitives_js_1.NonEmptyString,
    options: typebox_1.Type.Array(primitives_js_1.NonEmptyString, { minItems: 2, maxItems: 12 }),
    maxSelections: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1, maximum: 12 })),
    durationHours: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1 })),
    channel: typebox_1.Type.Optional(typebox_1.Type.String()),
    accountId: typebox_1.Type.Optional(typebox_1.Type.String()),
    idempotencyKey: primitives_js_1.NonEmptyString,
}, { additionalProperties: false });
exports.AgentParamsSchema = typebox_1.Type.Object({
    message: primitives_js_1.NonEmptyString,
    agentId: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    to: typebox_1.Type.Optional(typebox_1.Type.String()),
    replyTo: typebox_1.Type.Optional(typebox_1.Type.String()),
    sessionId: typebox_1.Type.Optional(typebox_1.Type.String()),
    sessionKey: typebox_1.Type.Optional(typebox_1.Type.String()),
    thinking: typebox_1.Type.Optional(typebox_1.Type.String()),
    deliver: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    attachments: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Unknown())),
    channel: typebox_1.Type.Optional(typebox_1.Type.String()),
    replyChannel: typebox_1.Type.Optional(typebox_1.Type.String()),
    accountId: typebox_1.Type.Optional(typebox_1.Type.String()),
    replyAccountId: typebox_1.Type.Optional(typebox_1.Type.String()),
    threadId: typebox_1.Type.Optional(typebox_1.Type.String()),
    groupId: typebox_1.Type.Optional(typebox_1.Type.String()),
    groupChannel: typebox_1.Type.Optional(typebox_1.Type.String()),
    groupSpace: typebox_1.Type.Optional(typebox_1.Type.String()),
    timeout: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    lane: typebox_1.Type.Optional(typebox_1.Type.String()),
    extraSystemPrompt: typebox_1.Type.Optional(typebox_1.Type.String()),
    idempotencyKey: primitives_js_1.NonEmptyString,
    label: typebox_1.Type.Optional(primitives_js_1.SessionLabelString),
    spawnedBy: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
exports.AgentIdentityParamsSchema = typebox_1.Type.Object({
    agentId: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    sessionKey: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
exports.AgentIdentityResultSchema = typebox_1.Type.Object({
    agentId: primitives_js_1.NonEmptyString,
    name: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    avatar: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
}, { additionalProperties: false });
exports.AgentWaitParamsSchema = typebox_1.Type.Object({
    runId: primitives_js_1.NonEmptyString,
    timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
}, { additionalProperties: false });
exports.WakeParamsSchema = typebox_1.Type.Object({
    mode: typebox_1.Type.Union([typebox_1.Type.Literal("now"), typebox_1.Type.Literal("next-heartbeat")]),
    text: primitives_js_1.NonEmptyString,
}, { additionalProperties: false });
