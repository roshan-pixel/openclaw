"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WizardStatusResultSchema = exports.WizardStartResultSchema = exports.WizardNextResultSchema = exports.WizardStepSchema = exports.WizardStepOptionSchema = exports.WizardStatusParamsSchema = exports.WizardCancelParamsSchema = exports.WizardNextParamsSchema = exports.WizardAnswerSchema = exports.WizardStartParamsSchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var primitives_js_1 = require("./primitives.js");
exports.WizardStartParamsSchema = typebox_1.Type.Object({
    mode: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal("local"), typebox_1.Type.Literal("remote")])),
    workspace: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
exports.WizardAnswerSchema = typebox_1.Type.Object({
    stepId: primitives_js_1.NonEmptyString,
    value: typebox_1.Type.Optional(typebox_1.Type.Unknown()),
}, { additionalProperties: false });
exports.WizardNextParamsSchema = typebox_1.Type.Object({
    sessionId: primitives_js_1.NonEmptyString,
    answer: typebox_1.Type.Optional(exports.WizardAnswerSchema),
}, { additionalProperties: false });
exports.WizardCancelParamsSchema = typebox_1.Type.Object({
    sessionId: primitives_js_1.NonEmptyString,
}, { additionalProperties: false });
exports.WizardStatusParamsSchema = typebox_1.Type.Object({
    sessionId: primitives_js_1.NonEmptyString,
}, { additionalProperties: false });
exports.WizardStepOptionSchema = typebox_1.Type.Object({
    value: typebox_1.Type.Unknown(),
    label: primitives_js_1.NonEmptyString,
    hint: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
exports.WizardStepSchema = typebox_1.Type.Object({
    id: primitives_js_1.NonEmptyString,
    type: typebox_1.Type.Union([
        typebox_1.Type.Literal("note"),
        typebox_1.Type.Literal("select"),
        typebox_1.Type.Literal("text"),
        typebox_1.Type.Literal("confirm"),
        typebox_1.Type.Literal("multiselect"),
        typebox_1.Type.Literal("progress"),
        typebox_1.Type.Literal("action"),
    ]),
    title: typebox_1.Type.Optional(typebox_1.Type.String()),
    message: typebox_1.Type.Optional(typebox_1.Type.String()),
    options: typebox_1.Type.Optional(typebox_1.Type.Array(exports.WizardStepOptionSchema)),
    initialValue: typebox_1.Type.Optional(typebox_1.Type.Unknown()),
    placeholder: typebox_1.Type.Optional(typebox_1.Type.String()),
    sensitive: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    executor: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal("gateway"), typebox_1.Type.Literal("client")])),
}, { additionalProperties: false });
exports.WizardNextResultSchema = typebox_1.Type.Object({
    done: typebox_1.Type.Boolean(),
    step: typebox_1.Type.Optional(exports.WizardStepSchema),
    status: typebox_1.Type.Optional(typebox_1.Type.Union([
        typebox_1.Type.Literal("running"),
        typebox_1.Type.Literal("done"),
        typebox_1.Type.Literal("cancelled"),
        typebox_1.Type.Literal("error"),
    ])),
    error: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
exports.WizardStartResultSchema = typebox_1.Type.Object({
    sessionId: primitives_js_1.NonEmptyString,
    done: typebox_1.Type.Boolean(),
    step: typebox_1.Type.Optional(exports.WizardStepSchema),
    status: typebox_1.Type.Optional(typebox_1.Type.Union([
        typebox_1.Type.Literal("running"),
        typebox_1.Type.Literal("done"),
        typebox_1.Type.Literal("cancelled"),
        typebox_1.Type.Literal("error"),
    ])),
    error: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
exports.WizardStatusResultSchema = typebox_1.Type.Object({
    status: typebox_1.Type.Union([
        typebox_1.Type.Literal("running"),
        typebox_1.Type.Literal("done"),
        typebox_1.Type.Literal("cancelled"),
        typebox_1.Type.Literal("error"),
    ]),
    error: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
