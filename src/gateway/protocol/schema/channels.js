"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebLoginWaitParamsSchema = exports.WebLoginStartParamsSchema = exports.ChannelsLogoutParamsSchema = exports.ChannelsStatusResultSchema = exports.ChannelUiMetaSchema = exports.ChannelAccountSnapshotSchema = exports.ChannelsStatusParamsSchema = exports.TalkModeParamsSchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var primitives_js_1 = require("./primitives.js");
exports.TalkModeParamsSchema = typebox_1.Type.Object({
    enabled: typebox_1.Type.Boolean(),
    phase: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
exports.ChannelsStatusParamsSchema = typebox_1.Type.Object({
    probe: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
}, { additionalProperties: false });
// Channel docking: channels.status is intentionally schema-light so new
// channels can ship without protocol updates.
exports.ChannelAccountSnapshotSchema = typebox_1.Type.Object({
    accountId: primitives_js_1.NonEmptyString,
    name: typebox_1.Type.Optional(typebox_1.Type.String()),
    enabled: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    configured: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    linked: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    running: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    connected: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    reconnectAttempts: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    lastConnectedAt: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    lastError: typebox_1.Type.Optional(typebox_1.Type.String()),
    lastStartAt: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    lastStopAt: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    lastInboundAt: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    lastOutboundAt: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    lastProbeAt: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    mode: typebox_1.Type.Optional(typebox_1.Type.String()),
    dmPolicy: typebox_1.Type.Optional(typebox_1.Type.String()),
    allowFrom: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    tokenSource: typebox_1.Type.Optional(typebox_1.Type.String()),
    botTokenSource: typebox_1.Type.Optional(typebox_1.Type.String()),
    appTokenSource: typebox_1.Type.Optional(typebox_1.Type.String()),
    baseUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
    allowUnmentionedGroups: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    cliPath: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()])),
    dbPath: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()])),
    port: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Integer({ minimum: 0 }), typebox_1.Type.Null()])),
    probe: typebox_1.Type.Optional(typebox_1.Type.Unknown()),
    audit: typebox_1.Type.Optional(typebox_1.Type.Unknown()),
    application: typebox_1.Type.Optional(typebox_1.Type.Unknown()),
}, { additionalProperties: true });
exports.ChannelUiMetaSchema = typebox_1.Type.Object({
    id: primitives_js_1.NonEmptyString,
    label: primitives_js_1.NonEmptyString,
    detailLabel: primitives_js_1.NonEmptyString,
    systemImage: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
exports.ChannelsStatusResultSchema = typebox_1.Type.Object({
    ts: typebox_1.Type.Integer({ minimum: 0 }),
    channelOrder: typebox_1.Type.Array(primitives_js_1.NonEmptyString),
    channelLabels: typebox_1.Type.Record(primitives_js_1.NonEmptyString, primitives_js_1.NonEmptyString),
    channelDetailLabels: typebox_1.Type.Optional(typebox_1.Type.Record(primitives_js_1.NonEmptyString, primitives_js_1.NonEmptyString)),
    channelSystemImages: typebox_1.Type.Optional(typebox_1.Type.Record(primitives_js_1.NonEmptyString, primitives_js_1.NonEmptyString)),
    channelMeta: typebox_1.Type.Optional(typebox_1.Type.Array(exports.ChannelUiMetaSchema)),
    channels: typebox_1.Type.Record(primitives_js_1.NonEmptyString, typebox_1.Type.Unknown()),
    channelAccounts: typebox_1.Type.Record(primitives_js_1.NonEmptyString, typebox_1.Type.Array(exports.ChannelAccountSnapshotSchema)),
    channelDefaultAccountId: typebox_1.Type.Record(primitives_js_1.NonEmptyString, primitives_js_1.NonEmptyString),
}, { additionalProperties: false });
exports.ChannelsLogoutParamsSchema = typebox_1.Type.Object({
    channel: primitives_js_1.NonEmptyString,
    accountId: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
exports.WebLoginStartParamsSchema = typebox_1.Type.Object({
    force: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    verbose: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    accountId: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
exports.WebLoginWaitParamsSchema = typebox_1.Type.Object({
    timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 0 })),
    accountId: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
