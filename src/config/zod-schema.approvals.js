"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalsSchema = void 0;
var zod_1 = require("zod");
var ExecApprovalForwardTargetSchema = zod_1.z
    .object({
    channel: zod_1.z.string().min(1),
    to: zod_1.z.string().min(1),
    accountId: zod_1.z.string().optional(),
    threadId: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).optional(),
})
    .strict();
var ExecApprovalForwardingSchema = zod_1.z
    .object({
    enabled: zod_1.z.boolean().optional(),
    mode: zod_1.z.union([zod_1.z.literal("session"), zod_1.z.literal("targets"), zod_1.z.literal("both")]).optional(),
    agentFilter: zod_1.z.array(zod_1.z.string()).optional(),
    sessionFilter: zod_1.z.array(zod_1.z.string()).optional(),
    targets: zod_1.z.array(ExecApprovalForwardTargetSchema).optional(),
})
    .strict()
    .optional();
exports.ApprovalsSchema = zod_1.z
    .object({
    exec: ExecApprovalForwardingSchema,
})
    .strict()
    .optional();
