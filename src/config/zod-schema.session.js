"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandsSchema = exports.MessagesSchema = exports.SessionSchema = void 0;
var zod_1 = require("zod");
var zod_schema_core_js_1 = require("./zod-schema.core.js");
var SessionResetConfigSchema = zod_1.z
    .object({
    mode: zod_1.z.union([zod_1.z.literal("daily"), zod_1.z.literal("idle")]).optional(),
    atHour: zod_1.z.number().int().min(0).max(23).optional(),
    idleMinutes: zod_1.z.number().int().positive().optional(),
})
    .strict();
exports.SessionSchema = zod_1.z
    .object({
    scope: zod_1.z.union([zod_1.z.literal("per-sender"), zod_1.z.literal("global")]).optional(),
    dmScope: zod_1.z
        .union([
        zod_1.z.literal("main"),
        zod_1.z.literal("per-peer"),
        zod_1.z.literal("per-channel-peer"),
        zod_1.z.literal("per-account-channel-peer"),
    ])
        .optional(),
    identityLinks: zod_1.z.record(zod_1.z.string(), zod_1.z.array(zod_1.z.string())).optional(),
    resetTriggers: zod_1.z.array(zod_1.z.string()).optional(),
    idleMinutes: zod_1.z.number().int().positive().optional(),
    reset: SessionResetConfigSchema.optional(),
    resetByType: zod_1.z
        .object({
        dm: SessionResetConfigSchema.optional(),
        group: SessionResetConfigSchema.optional(),
        thread: SessionResetConfigSchema.optional(),
    })
        .strict()
        .optional(),
    resetByChannel: zod_1.z.record(zod_1.z.string(), SessionResetConfigSchema).optional(),
    store: zod_1.z.string().optional(),
    typingIntervalSeconds: zod_1.z.number().int().positive().optional(),
    typingMode: zod_1.z
        .union([
        zod_1.z.literal("never"),
        zod_1.z.literal("instant"),
        zod_1.z.literal("thinking"),
        zod_1.z.literal("message"),
    ])
        .optional(),
    mainKey: zod_1.z.string().optional(),
    sendPolicy: zod_1.z
        .object({
        default: zod_1.z.union([zod_1.z.literal("allow"), zod_1.z.literal("deny")]).optional(),
        rules: zod_1.z
            .array(zod_1.z
            .object({
            action: zod_1.z.union([zod_1.z.literal("allow"), zod_1.z.literal("deny")]),
            match: zod_1.z
                .object({
                channel: zod_1.z.string().optional(),
                chatType: zod_1.z
                    .union([zod_1.z.literal("direct"), zod_1.z.literal("group"), zod_1.z.literal("channel")])
                    .optional(),
                keyPrefix: zod_1.z.string().optional(),
            })
                .strict()
                .optional(),
        })
            .strict())
            .optional(),
    })
        .strict()
        .optional(),
    agentToAgent: zod_1.z
        .object({
        maxPingPongTurns: zod_1.z.number().int().min(0).max(5).optional(),
    })
        .strict()
        .optional(),
})
    .strict()
    .optional();
exports.MessagesSchema = zod_1.z
    .object({
    messagePrefix: zod_1.z.string().optional(),
    responsePrefix: zod_1.z.string().optional(),
    groupChat: zod_schema_core_js_1.GroupChatSchema,
    queue: zod_schema_core_js_1.QueueSchema,
    inbound: zod_schema_core_js_1.InboundDebounceSchema,
    ackReaction: zod_1.z.string().optional(),
    ackReactionScope: zod_1.z.enum(["group-mentions", "group-all", "direct", "all"]).optional(),
    removeAckAfterReply: zod_1.z.boolean().optional(),
    tts: zod_schema_core_js_1.TtsConfigSchema,
})
    .strict()
    .optional();
exports.CommandsSchema = zod_1.z
    .object({
    native: zod_schema_core_js_1.NativeCommandsSettingSchema.optional().default("auto"),
    nativeSkills: zod_schema_core_js_1.NativeCommandsSettingSchema.optional().default("auto"),
    text: zod_1.z.boolean().optional(),
    bash: zod_1.z.boolean().optional(),
    bashForegroundMs: zod_1.z.number().int().min(0).max(30000).optional(),
    config: zod_1.z.boolean().optional(),
    debug: zod_1.z.boolean().optional(),
    restart: zod_1.z.boolean().optional(),
    useAccessGroups: zod_1.z.boolean().optional(),
})
    .strict()
    .optional()
    .default({ native: "auto", nativeSkills: "auto" });
