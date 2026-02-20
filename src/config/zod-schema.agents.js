"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioSchema = exports.BroadcastSchema = exports.BroadcastStrategySchema = exports.BindingsSchema = exports.AgentsSchema = void 0;
var zod_1 = require("zod");
var zod_schema_agent_defaults_js_1 = require("./zod-schema.agent-defaults.js");
var zod_schema_agent_runtime_js_1 = require("./zod-schema.agent-runtime.js");
var zod_schema_core_js_1 = require("./zod-schema.core.js");
exports.AgentsSchema = zod_1.z
    .object({
    defaults: zod_1.z.lazy(function () { return zod_schema_agent_defaults_js_1.AgentDefaultsSchema; }).optional(),
    list: zod_1.z.array(zod_schema_agent_runtime_js_1.AgentEntrySchema).optional(),
})
    .strict()
    .optional();
exports.BindingsSchema = zod_1.z
    .array(zod_1.z
    .object({
    agentId: zod_1.z.string(),
    match: zod_1.z
        .object({
        channel: zod_1.z.string(),
        accountId: zod_1.z.string().optional(),
        peer: zod_1.z
            .object({
            kind: zod_1.z.union([zod_1.z.literal("dm"), zod_1.z.literal("group"), zod_1.z.literal("channel")]),
            id: zod_1.z.string(),
        })
            .strict()
            .optional(),
        guildId: zod_1.z.string().optional(),
        teamId: zod_1.z.string().optional(),
    })
        .strict(),
})
    .strict())
    .optional();
exports.BroadcastStrategySchema = zod_1.z.enum(["parallel", "sequential"]);
exports.BroadcastSchema = zod_1.z
    .object({
    strategy: exports.BroadcastStrategySchema.optional(),
})
    .catchall(zod_1.z.array(zod_1.z.string()))
    .optional();
exports.AudioSchema = zod_1.z
    .object({
    transcription: zod_schema_core_js_1.TranscribeAudioSchema,
})
    .strict()
    .optional();
