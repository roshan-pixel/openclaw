"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsUpdateParamsSchema = exports.SkillsInstallParamsSchema = exports.SkillsBinsResultSchema = exports.SkillsBinsParamsSchema = exports.SkillsStatusParamsSchema = exports.ModelsListResultSchema = exports.ModelsListParamsSchema = exports.AgentsListResultSchema = exports.AgentsListParamsSchema = exports.AgentSummarySchema = exports.ModelChoiceSchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var primitives_js_1 = require("./primitives.js");
exports.ModelChoiceSchema = typebox_1.Type.Object({
    id: primitives_js_1.NonEmptyString,
    name: primitives_js_1.NonEmptyString,
    provider: primitives_js_1.NonEmptyString,
    contextWindow: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1 })),
    reasoning: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
}, { additionalProperties: false });
exports.AgentSummarySchema = typebox_1.Type.Object({
    id: primitives_js_1.NonEmptyString,
    name: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    identity: typebox_1.Type.Optional(typebox_1.Type.Object({
        name: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
        theme: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
        emoji: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
        avatar: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
        avatarUrl: typebox_1.Type.Optional(primitives_js_1.NonEmptyString),
    }, { additionalProperties: false })),
}, { additionalProperties: false });
exports.AgentsListParamsSchema = typebox_1.Type.Object({}, { additionalProperties: false });
exports.AgentsListResultSchema = typebox_1.Type.Object({
    defaultId: primitives_js_1.NonEmptyString,
    mainKey: primitives_js_1.NonEmptyString,
    scope: typebox_1.Type.Union([typebox_1.Type.Literal("per-sender"), typebox_1.Type.Literal("global")]),
    agents: typebox_1.Type.Array(exports.AgentSummarySchema),
}, { additionalProperties: false });
exports.ModelsListParamsSchema = typebox_1.Type.Object({}, { additionalProperties: false });
exports.ModelsListResultSchema = typebox_1.Type.Object({
    models: typebox_1.Type.Array(exports.ModelChoiceSchema),
}, { additionalProperties: false });
exports.SkillsStatusParamsSchema = typebox_1.Type.Object({}, { additionalProperties: false });
exports.SkillsBinsParamsSchema = typebox_1.Type.Object({}, { additionalProperties: false });
exports.SkillsBinsResultSchema = typebox_1.Type.Object({
    bins: typebox_1.Type.Array(primitives_js_1.NonEmptyString),
}, { additionalProperties: false });
exports.SkillsInstallParamsSchema = typebox_1.Type.Object({
    name: primitives_js_1.NonEmptyString,
    installId: primitives_js_1.NonEmptyString,
    timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1000 })),
}, { additionalProperties: false });
exports.SkillsUpdateParamsSchema = typebox_1.Type.Object({
    skillKey: primitives_js_1.NonEmptyString,
    enabled: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    apiKey: typebox_1.Type.Optional(typebox_1.Type.String()),
    env: typebox_1.Type.Optional(typebox_1.Type.Record(primitives_js_1.NonEmptyString, typebox_1.Type.String())),
}, { additionalProperties: false });
