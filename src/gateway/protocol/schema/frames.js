"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayFrameSchema = exports.EventFrameSchema = exports.ResponseFrameSchema = exports.RequestFrameSchema = exports.ErrorShapeSchema = exports.HelloOkSchema = exports.ConnectParamsSchema = exports.ShutdownEventSchema = exports.TickEventSchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var primitives_js_1 = require("./primitives.js");
var snapshot_js_1 = require("./snapshot.js");
exports.TickEventSchema = typebox_1.Type.Object({
    ts: typebox_1.Type.Integer({ minimum: 0 }),
}, { additionalProperties: false });
exports.ShutdownEventSchema = typebox_1.Type.Object({
    reason: primitives_js_1.NonEmptyString,
    restartExpectedMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
}, { additionalProperties: false });
exports.ConnectParamsSchema = typebox_1.Type.Object({
    minProtocol: typebox_1.Type.Integer({ minimum: 1 }),
    maxProtocol: typebox_1.Type.Integer({ minimum: 1 }),
    client: typebox_1.Type.Object({
        id: primitives_js_1.GatewayClientIdSchema,
        displayName: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
        version: primitives_js_1.NonEmptyString,
        platform: primitives_js_1.NonEmptyString,
        deviceFamily: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
        modelIdentifier: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
        mode: primitives_js_1.GatewayClientModeSchema,
        instanceId: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    }, { additionalProperties: false }),
    caps: typebox_1.Type.Optional(typebox_1.Type.Array(primitives_js_1.NonEmptyString, { default: [] })),
    commands: typebox_1.Type.Optional(typebox_1.Type.Array(primitives_js_1.NonEmptyString)),
    permissions: typebox_1.Type.Optional(typebox_1.Type.Record(primitives_js_1.NonEmptyString, typebox_1.Type.Boolean())),
    pathEnv: typebox_1.Type.Optional(typebox_1.Type.String()),
    role: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    scopes: typebox_1.Type.Optional(typebox_1.Type.Array(primitives_js_1.NonEmptyString)),
    device: typebox_1.Type.Optional(typebox_1.Type.Object({
        id: primitives_js_1.NonEmptyString,
        publicKey: primitives_js_1.NonEmptyString,
        signature: primitives_js_1.NonEmptyString,
        signedAt: typebox_1.Type.Integer({ minimum: 0 }),
        nonce: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    }, { additionalProperties: false })),
    auth: typebox_1.Type.Optional(typebox_1.Type.Object({
        token: typebox_1.Type.Optional(typebox_1.Type.String()),
        password: typebox_1.Type.Optional(typebox_1.Type.String()),
    }, { additionalProperties: false })),
    locale: typebox_1.Type.Optional(typebox_1.Type.String()),
    userAgent: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
exports.HelloOkSchema = typebox_1.Type.Object({
    type: typebox_1.Type.Literal("hello-ok"),
    protocol: typebox_1.Type.Integer({ minimum: 1 }),
    server: typebox_1.Type.Object({
        version: primitives_js_1.NonEmptyString,
        commit: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
        host: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
        connId: primitives_js_1.NonEmptyString,
    }, { additionalProperties: false }),
    features: typebox_1.Type.Object({
        methods: typebox_1.Type.Array(primitives_js_1.NonEmptyString),
        events: typebox_1.Type.Array(primitives_js_1.NonEmptyString),
    }, { additionalProperties: false }),
    snapshot: snapshot_js_1.SnapshotSchema,
    canvasHostUrl: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    auth: typebox_1.Type.Optional(typebox_1.Type.Object({
        deviceToken: primitives_js_1.NonEmptyString,
        role: primitives_js_1.NonEmptyString,
        scopes: typebox_1.Type.Array(primitives_js_1.NonEmptyString),
        issuedAtMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    }, { additionalProperties: false })),
    policy: typebox_1.Type.Object({
        maxPayload: typebox_1.Type.Integer({ minimum: 1 }),
        maxBufferedBytes: typebox_1.Type.Integer({ minimum: 1 }),
        tickIntervalMs: typebox_1.Type.Integer({ minimum: 1 }),
    }, { additionalProperties: false }),
}, { additionalProperties: false });
exports.ErrorShapeSchema = typebox_1.Type.Object({
    code: primitives_js_1.NonEmptyString,
    message: primitives_js_1.NonEmptyString,
    details: typebox_1.Type.Optional(typebox_1.Type.Unknown()),
    retryable: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    retryAfterMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
}, { additionalProperties: false });
exports.RequestFrameSchema = typebox_1.Type.Object({
    type: typebox_1.Type.Literal("req"),
    id: primitives_js_1.NonEmptyString,
    method: primitives_js_1.NonEmptyString,
    params: typebox_1.Type.Optional(typebox_1.Type.Unknown()),
}, { additionalProperties: false });
exports.ResponseFrameSchema = typebox_1.Type.Object({
    type: typebox_1.Type.Literal("res"),
    id: primitives_js_1.NonEmptyString,
    ok: typebox_1.Type.Boolean(),
    payload: typebox_1.Type.Optional(typebox_1.Type.Unknown()),
    error: typebox_1.Type.Optional(exports.ErrorShapeSchema),
}, { additionalProperties: false });
exports.EventFrameSchema = typebox_1.Type.Object({
    type: typebox_1.Type.Literal("event"),
    event: primitives_js_1.NonEmptyString,
    payload: typebox_1.Type.Optional(typebox_1.Type.Unknown()),
    seq: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    stateVersion: typebox_1.Type.Optional(snapshot_js_1.StateVersionSchema),
}, { additionalProperties: false });
// Discriminated union of all top-level frames. Using a discriminator makes
// downstream codegen (quicktype) produce tighter types instead of all-optional
// blobs.
exports.GatewayFrameSchema = typebox_1.Type.Union([exports.RequestFrameSchema, exports.ResponseFrameSchema, exports.EventFrameSchema], { discriminator: "type" });
