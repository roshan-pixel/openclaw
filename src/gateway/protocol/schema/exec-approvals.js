"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecApprovalResolveParamsSchema = exports.ExecApprovalRequestParamsSchema = exports.ExecApprovalsNodeSetParamsSchema = exports.ExecApprovalsNodeGetParamsSchema = exports.ExecApprovalsSetParamsSchema = exports.ExecApprovalsGetParamsSchema = exports.ExecApprovalsSnapshotSchema = exports.ExecApprovalsFileSchema = exports.ExecApprovalsAgentSchema = exports.ExecApprovalsDefaultsSchema = exports.ExecApprovalsAllowlistEntrySchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var primitives_js_1 = require("./primitives.js");
exports.ExecApprovalsAllowlistEntrySchema = typebox_1.Type.Object({
    id: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    pattern: typebox_1.Type.String(),
    lastUsedAt: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    lastUsedCommand: typebox_1.Type.Optional(typebox_1.Type.String()),
    lastResolvedPath: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
exports.ExecApprovalsDefaultsSchema = typebox_1.Type.Object({
    security: typebox_1.Type.Optional(typebox_1.Type.String()),
    ask: typebox_1.Type.Optional(typebox_1.Type.String()),
    askFallback: typebox_1.Type.Optional(typebox_1.Type.String()),
    autoAllowSkills: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
}, { additionalProperties: false });
exports.ExecApprovalsAgentSchema = typebox_1.Type.Object({
    security: typebox_1.Type.Optional(typebox_1.Type.String()),
    ask: typebox_1.Type.Optional(typebox_1.Type.String()),
    askFallback: typebox_1.Type.Optional(typebox_1.Type.String()),
    autoAllowSkills: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    allowlist: typebox_1.Type.Optional(typebox_1.Type.Array(exports.ExecApprovalsAllowlistEntrySchema)),
}, { additionalProperties: false });
exports.ExecApprovalsFileSchema = typebox_1.Type.Object({
    version: typebox_1.Type.Literal(1),
    socket: typebox_1.Type.Optional(typebox_1.Type.Object({
        path: typebox_1.Type.Optional(typebox_1.Type.String()),
        token: typebox_1.Type.Optional(typebox_1.Type.String()),
    }, { additionalProperties: false })),
    defaults: typebox_1.Type.Optional(exports.ExecApprovalsDefaultsSchema),
    agents: typebox_1.Type.Optional(typebox_1.Type.Record(typebox_1.Type.String(), exports.ExecApprovalsAgentSchema)),
}, { additionalProperties: false });
exports.ExecApprovalsSnapshotSchema = typebox_1.Type.Object({
    path: primitives_js_1.NonEmptyString,
    exists: typebox_1.Type.Boolean(),
    hash: primitives_js_1.NonEmptyString,
    file: exports.ExecApprovalsFileSchema,
}, { additionalProperties: false });
exports.ExecApprovalsGetParamsSchema = typebox_1.Type.Object({}, { additionalProperties: false });
exports.ExecApprovalsSetParamsSchema = typebox_1.Type.Object({
    file: exports.ExecApprovalsFileSchema,
    baseHash: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
}, { additionalProperties: false });
exports.ExecApprovalsNodeGetParamsSchema = typebox_1.Type.Object({
    nodeId: primitives_js_1.NonEmptyString,
}, { additionalProperties: false });
exports.ExecApprovalsNodeSetParamsSchema = typebox_1.Type.Object({
    nodeId: primitives_js_1.NonEmptyString,
    file: exports.ExecApprovalsFileSchema,
    baseHash: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
}, { additionalProperties: false });
exports.ExecApprovalRequestParamsSchema = typebox_1.Type.Object({
    id: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    command: primitives_js_1.NonEmptyString,
    cwd: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()])),
    host: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()])),
    security: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()])),
    ask: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()])),
    agentId: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()])),
    resolvedPath: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()])),
    sessionKey: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()])),
    timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1 })),
}, { additionalProperties: false });
exports.ExecApprovalResolveParamsSchema = typebox_1.Type.Object({
    id: primitives_js_1.NonEmptyString,
    decision: primitives_js_1.NonEmptyString,
}, { additionalProperties: false });
