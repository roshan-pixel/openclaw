"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronRunLogEntrySchema = exports.CronRunsParamsSchema = exports.CronRunParamsSchema = exports.CronRemoveParamsSchema = exports.CronUpdateParamsSchema = exports.CronJobPatchSchema = exports.CronAddParamsSchema = exports.CronStatusParamsSchema = exports.CronListParamsSchema = exports.CronJobSchema = exports.CronJobStateSchema = exports.CronIsolationSchema = exports.CronPayloadPatchSchema = exports.CronPayloadSchema = exports.CronScheduleSchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var primitives_js_1 = require("./primitives.js");
exports.CronScheduleSchema = typebox_1.Type.Union([
    typebox_1.Type.Object({
        kind: typebox_1.Type.Literal("at"),
        atMs: typebox_1.Type.Integer({ minimum: 0 }),
    }, { additionalProperties: false }),
    typebox_1.Type.Object({
        kind: typebox_1.Type.Literal("every"),
        everyMs: typebox_1.Type.Integer({ minimum: 1 }),
        anchorMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    }, { additionalProperties: false }),
    typebox_1.Type.Object({
        kind: typebox_1.Type.Literal("cron"),
        expr: primitives_js_1.NonEmptyString,
        tz: typebox_1.Type.Optional(typebox_1.Type.String()),
    }, { additionalProperties: false }),
]);
exports.CronPayloadSchema = typebox_1.Type.Union([
    typebox_1.Type.Object({
        kind: typebox_1.Type.Literal("systemEvent"),
        text: primitives_js_1.NonEmptyString,
    }, { additionalProperties: false }),
    typebox_1.Type.Object({
        kind: typebox_1.Type.Literal("agentTurn"),
        message: primitives_js_1.NonEmptyString,
        model: typebox_1.Type.Optional(typebox_1.Type.String()),
        thinking: typebox_1.Type.Optional(typebox_1.Type.String()),
        timeoutSeconds: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1 })),
        deliver: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
        channel: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal("last"), primitives_js_1.NonEmptyString])),
        to: typebox_1.Type.Optional(typebox_1.Type.String()),
        bestEffortDeliver: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    }, { additionalProperties: false }),
]);
exports.CronPayloadPatchSchema = typebox_1.Type.Union([
    typebox_1.Type.Object({
        kind: typebox_1.Type.Literal("systemEvent"),
        text: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    }, { additionalProperties: false }),
    typebox_1.Type.Object({
        kind: typebox_1.Type.Literal("agentTurn"),
        message: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
        model: typebox_1.Type.Optional(typebox_1.Type.String()),
        thinking: typebox_1.Type.Optional(typebox_1.Type.String()),
        timeoutSeconds: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1 })),
        deliver: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
        channel: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal("last"), primitives_js_1.NonEmptyString])),
        to: typebox_1.Type.Optional(typebox_1.Type.String()),
        bestEffortDeliver: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    }, { additionalProperties: false }),
]);
exports.CronIsolationSchema = typebox_1.Type.Object({
    postToMainPrefix: typebox_1.Type.Optional(typebox_1.Type.String()),
    postToMainMode: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal("summary"), typebox_1.Type.Literal("full")])),
    postToMainMaxChars: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
}, { additionalProperties: false });
exports.CronJobStateSchema = typebox_1.Type.Object({
    nextRunAtMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    runningAtMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    lastRunAtMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    lastStatus: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal("ok"), typebox_1.Type.Literal("error"), typebox_1.Type.Literal("skipped")])),
    lastError: typebox_1.Type.Optional(typebox_1.Type.String()),
    lastDurationMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
}, { additionalProperties: false });
exports.CronJobSchema = typebox_1.Type.Object({
    id: primitives_js_1.NonEmptyString,
    agentId: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    name: primitives_js_1.NonEmptyString,
    description: typebox_1.Type.Optional(typebox_1.Type.String()),
    enabled: typebox_1.Type.Boolean(),
    deleteAfterRun: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    createdAtMs: typebox_1.Type.Integer({ minimum: 0 }),
    updatedAtMs: typebox_1.Type.Integer({ minimum: 0 }),
    schedule: exports.CronScheduleSchema,
    sessionTarget: typebox_1.Type.Union([typebox_1.Type.Literal("main"), typebox_1.Type.Literal("isolated")]),
    wakeMode: typebox_1.Type.Union([typebox_1.Type.Literal("next-heartbeat"), typebox_1.Type.Literal("now")]),
    payload: exports.CronPayloadSchema,
    isolation: typebox_1.Type.Optional(exports.CronIsolationSchema),
    state: exports.CronJobStateSchema,
}, { additionalProperties: false });
exports.CronListParamsSchema = typebox_1.Type.Object({
    includeDisabled: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
}, { additionalProperties: false });
exports.CronStatusParamsSchema = typebox_1.Type.Object({}, { additionalProperties: false });
exports.CronAddParamsSchema = typebox_1.Type.Object({
    name: primitives_js_1.NonEmptyString,
    agentId: typebox_1.Type.Optional(typebox_1.Type.Union([primitives_js_1.NonEmptyString, typebox_1.Type.Null()])),
    description: typebox_1.Type.Optional(typebox_1.Type.String()),
    enabled: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    deleteAfterRun: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    schedule: exports.CronScheduleSchema,
    sessionTarget: typebox_1.Type.Union([typebox_1.Type.Literal("main"), typebox_1.Type.Literal("isolated")]),
    wakeMode: typebox_1.Type.Union([typebox_1.Type.Literal("next-heartbeat"), typebox_1.Type.Literal("now")]),
    payload: exports.CronPayloadSchema,
    isolation: typebox_1.Type.Optional(exports.CronIsolationSchema),
}, { additionalProperties: false });
exports.CronJobPatchSchema = typebox_1.Type.Object({
    name: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    agentId: typebox_1.Type.Optional(typebox_1.Type.Union([primitives_js_1.NonEmptyString, typebox_1.Type.Null()])),
    description: typebox_1.Type.Optional(typebox_1.Type.String()),
    enabled: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    deleteAfterRun: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    schedule: typebox_1.Type.Optional(exports.CronScheduleSchema),
    sessionTarget: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal("main"), typebox_1.Type.Literal("isolated")])),
    wakeMode: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal("next-heartbeat"), typebox_1.Type.Literal("now")])),
    payload: typebox_1.Type.Optional(exports.CronPayloadPatchSchema),
    isolation: typebox_1.Type.Optional(exports.CronIsolationSchema),
    state: typebox_1.Type.Optional(typebox_1.Type.Partial(exports.CronJobStateSchema)),
}, { additionalProperties: false });
exports.CronUpdateParamsSchema = typebox_1.Type.Union([
    typebox_1.Type.Object({
        id: primitives_js_1.NonEmptyString,
        patch: exports.CronJobPatchSchema,
    }, { additionalProperties: false }),
    typebox_1.Type.Object({
        jobId: primitives_js_1.NonEmptyString,
        patch: exports.CronJobPatchSchema,
    }, { additionalProperties: false }),
]);
exports.CronRemoveParamsSchema = typebox_1.Type.Union([
    typebox_1.Type.Object({
        id: primitives_js_1.NonEmptyString,
    }, { additionalProperties: false }),
    typebox_1.Type.Object({
        jobId: primitives_js_1.NonEmptyString,
    }, { additionalProperties: false }),
]);
exports.CronRunParamsSchema = typebox_1.Type.Union([
    typebox_1.Type.Object({
        id: primitives_js_1.NonEmptyString,
        mode: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal("due"), typebox_1.Type.Literal("force")])),
    }, { additionalProperties: false }),
    typebox_1.Type.Object({
        jobId: primitives_js_1.NonEmptyString,
        mode: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal("due"), typebox_1.Type.Literal("force")])),
    }, { additionalProperties: false }),
]);
exports.CronRunsParamsSchema = typebox_1.Type.Union([
    typebox_1.Type.Object({
        id: primitives_js_1.NonEmptyString,
        limit: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1, maximum: 5000 })),
    }, { additionalProperties: false }),
    typebox_1.Type.Object({
        jobId: primitives_js_1.NonEmptyString,
        limit: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1, maximum: 5000 })),
    }, { additionalProperties: false }),
]);
exports.CronRunLogEntrySchema = typebox_1.Type.Object({
    ts: typebox_1.Type.Integer({ minimum: 0 }),
    jobId: primitives_js_1.NonEmptyString,
    action: typebox_1.Type.Literal("finished"),
    status: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal("ok"), typebox_1.Type.Literal("error"), typebox_1.Type.Literal("skipped")])),
    error: typebox_1.Type.Optional(typebox_1.Type.String()),
    summary: typebox_1.Type.Optional(typebox_1.Type.String()),
    runAtMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    durationMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    nextRunAtMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
}, { additionalProperties: false });
