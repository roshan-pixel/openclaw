"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HooksGmailSchema = exports.InternalHooksSchema = exports.InternalHookHandlerSchema = exports.HookMappingSchema = void 0;
var zod_1 = require("zod");
exports.HookMappingSchema = zod_1.z
    .object({
    id: zod_1.z.string().optional(),
    match: zod_1.z
        .object({
        path: zod_1.z.string().optional(),
        source: zod_1.z.string().optional(),
    })
        .optional(),
    action: zod_1.z.union([zod_1.z.literal("wake"), zod_1.z.literal("agent")]).optional(),
    wakeMode: zod_1.z.union([zod_1.z.literal("now"), zod_1.z.literal("next-heartbeat")]).optional(),
    name: zod_1.z.string().optional(),
    sessionKey: zod_1.z.string().optional(),
    messageTemplate: zod_1.z.string().optional(),
    textTemplate: zod_1.z.string().optional(),
    deliver: zod_1.z.boolean().optional(),
    allowUnsafeExternalContent: zod_1.z.boolean().optional(),
    channel: zod_1.z
        .union([
        zod_1.z.literal("last"),
        zod_1.z.literal("whatsapp"),
        zod_1.z.literal("telegram"),
        zod_1.z.literal("discord"),
        zod_1.z.literal("slack"),
        zod_1.z.literal("signal"),
        zod_1.z.literal("imessage"),
        zod_1.z.literal("msteams"),
    ])
        .optional(),
    to: zod_1.z.string().optional(),
    model: zod_1.z.string().optional(),
    thinking: zod_1.z.string().optional(),
    timeoutSeconds: zod_1.z.number().int().positive().optional(),
    transform: zod_1.z
        .object({
        module: zod_1.z.string(),
        export: zod_1.z.string().optional(),
    })
        .strict()
        .optional(),
})
    .strict()
    .optional();
exports.InternalHookHandlerSchema = zod_1.z
    .object({
    event: zod_1.z.string(),
    module: zod_1.z.string(),
    export: zod_1.z.string().optional(),
})
    .strict();
var HookConfigSchema = zod_1.z
    .object({
    enabled: zod_1.z.boolean().optional(),
    env: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
})
    .strict();
var HookInstallRecordSchema = zod_1.z
    .object({
    source: zod_1.z.union([zod_1.z.literal("npm"), zod_1.z.literal("archive"), zod_1.z.literal("path")]),
    spec: zod_1.z.string().optional(),
    sourcePath: zod_1.z.string().optional(),
    installPath: zod_1.z.string().optional(),
    version: zod_1.z.string().optional(),
    installedAt: zod_1.z.string().optional(),
    hooks: zod_1.z.array(zod_1.z.string()).optional(),
})
    .strict();
exports.InternalHooksSchema = zod_1.z
    .object({
    enabled: zod_1.z.boolean().optional(),
    handlers: zod_1.z.array(exports.InternalHookHandlerSchema).optional(),
    entries: zod_1.z.record(zod_1.z.string(), HookConfigSchema).optional(),
    load: zod_1.z
        .object({
        extraDirs: zod_1.z.array(zod_1.z.string()).optional(),
    })
        .strict()
        .optional(),
    installs: zod_1.z.record(zod_1.z.string(), HookInstallRecordSchema).optional(),
})
    .strict()
    .optional();
exports.HooksGmailSchema = zod_1.z
    .object({
    account: zod_1.z.string().optional(),
    label: zod_1.z.string().optional(),
    topic: zod_1.z.string().optional(),
    subscription: zod_1.z.string().optional(),
    pushToken: zod_1.z.string().optional(),
    hookUrl: zod_1.z.string().optional(),
    includeBody: zod_1.z.boolean().optional(),
    maxBytes: zod_1.z.number().int().positive().optional(),
    renewEveryMinutes: zod_1.z.number().int().positive().optional(),
    allowUnsafeExternalContent: zod_1.z.boolean().optional(),
    serve: zod_1.z
        .object({
        bind: zod_1.z.string().optional(),
        port: zod_1.z.number().int().positive().optional(),
        path: zod_1.z.string().optional(),
    })
        .strict()
        .optional(),
    tailscale: zod_1.z
        .object({
        mode: zod_1.z.union([zod_1.z.literal("off"), zod_1.z.literal("serve"), zod_1.z.literal("funnel")]).optional(),
        path: zod_1.z.string().optional(),
        target: zod_1.z.string().optional(),
    })
        .strict()
        .optional(),
    model: zod_1.z.string().optional(),
    thinking: zod_1.z
        .union([
        zod_1.z.literal("off"),
        zod_1.z.literal("minimal"),
        zod_1.z.literal("low"),
        zod_1.z.literal("medium"),
        zod_1.z.literal("high"),
    ])
        .optional(),
})
    .strict()
    .optional();
