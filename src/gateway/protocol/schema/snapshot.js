"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotSchema = exports.StateVersionSchema = exports.SessionDefaultsSchema = exports.HealthSnapshotSchema = exports.PresenceEntrySchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var primitives_js_1 = require("./primitives.js");
exports.PresenceEntrySchema = typebox_1.Type.Object({
    host: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    ip: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    version: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    platform: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    deviceFamily: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    modelIdentifier: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    mode: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    lastInputSeconds: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    reason: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    tags: typebox_1.Type.Optional(typebox_1.Type.Array(primitives_js_1.NonEmptyString)),
    text: typebox_1.Type.Optional(typebox_1.Type.String()),
    ts: typebox_1.Type.Integer({ minimum: 0 }),
    deviceId: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    roles: typebox_1.Type.Optional(typebox_1.Type.Array(primitives_js_1.NonEmptyString)),
    scopes: typebox_1.Type.Optional(typebox_1.Type.Array(primitives_js_1.NonEmptyString)),
    instanceId: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
}, { additionalProperties: false });
exports.HealthSnapshotSchema = typebox_1.Type.Any();
exports.SessionDefaultsSchema = typebox_1.Type.Object({
    defaultAgentId: primitives_js_1.NonEmptyString,
    mainKey: primitives_js_1.NonEmptyString,
    mainSessionKey: primitives_js_1.NonEmptyString,
    scope: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
}, { additionalProperties: false });
exports.StateVersionSchema = typebox_1.Type.Object({
    presence: typebox_1.Type.Integer({ minimum: 0 }),
    health: typebox_1.Type.Integer({ minimum: 0 }),
}, { additionalProperties: false });
exports.SnapshotSchema = typebox_1.Type.Object({
    presence: typebox_1.Type.Array(exports.PresenceEntrySchema),
    health: exports.HealthSnapshotSchema,
    stateVersion: exports.StateVersionSchema,
    uptimeMs: typebox_1.Type.Integer({ minimum: 0 }),
    configPath: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    stateDir: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    sessionDefaults: typebox_1.Type.Optional(exports.SessionDefaultsSchema),
}, { additionalProperties: false });
