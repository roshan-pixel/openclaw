"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppConfigSchema = exports.WhatsAppAccountSchema = void 0;
var zod_1 = require("zod");
var zod_schema_core_js_1 = require("./zod-schema.core.js");
var zod_schema_agent_runtime_js_1 = require("./zod-schema.agent-runtime.js");
var zod_schema_channels_js_1 = require("./zod-schema.channels.js");
var ToolPolicyBySenderSchema = zod_1.z
  .record(zod_1.z.string(), zod_schema_agent_runtime_js_1.ToolPolicySchema)
  .optional();
exports.WhatsAppAccountSchema = zod_1.z
  .object({
    name: zod_1.z.string().optional(),
    capabilities: zod_1.z.array(zod_1.z.string()).optional(),
    markdown: zod_schema_core_js_1.MarkdownConfigSchema,
    configWrites: zod_1.z.boolean().optional(),
    enabled: zod_1.z.boolean().optional(),
    sendReadReceipts: zod_1.z.boolean().optional(),
    messagePrefix: zod_1.z.string().optional(),
    /** Override auth directory for this WhatsApp account (Baileys multi-file auth state). */
    authDir: zod_1.z.string().optional(),
    dmPolicy: zod_schema_core_js_1.DmPolicySchema.optional().default("pairing"),
    selfChatMode: zod_1.z.boolean().optional(),
    allowFrom: zod_1.z.array(zod_1.z.string()).optional(),
    groupAllowFrom: zod_1.z.array(zod_1.z.string()).optional(),
    groupPolicy: zod_schema_core_js_1.GroupPolicySchema.optional().default("allowlist"),
    historyLimit: zod_1.z.number().int().min(0).optional(),
    dmHistoryLimit: zod_1.z.number().int().min(0).optional(),
    dms: zod_1.z
      .record(zod_1.z.string(), zod_schema_core_js_1.DmConfigSchema.optional())
      .optional(),
    textChunkLimit: zod_1.z.number().int().positive().optional(),
    chunkMode: zod_1.z.enum(["length", "newline"]).optional(),
    mediaMaxMb: zod_1.z.number().int().positive().optional(),
    blockStreaming: zod_1.z.boolean().optional(),
    blockStreamingCoalesce: zod_schema_core_js_1.BlockStreamingCoalesceSchema.optional(),
    groups: zod_1.z
      .record(
        zod_1.z.string(),
        zod_1.z
          .object({
            requireMention: zod_1.z.boolean().optional(),
            tools: zod_schema_agent_runtime_js_1.ToolPolicySchema,
            toolsBySender: ToolPolicyBySenderSchema,
          })
          .strict()
          .optional(),
      )
      .optional(),
    ackReaction: zod_1.z
      .object({
        emoji: zod_1.z.string().optional(),
        direct: zod_1.z.boolean().optional().default(true),
        group: zod_1.z.enum(["always", "mentions", "never"]).optional().default("mentions"),
      })
      .strict()
      .optional(),
    debounceMs: zod_1.z.number().int().nonnegative().optional().default(0),
    heartbeat: zod_schema_channels_js_1.ChannelHeartbeatVisibilitySchema,
  })
  .strict()
  .superRefine(function (value, ctx) {
    var _a;
    if (value.dmPolicy !== "open") {
      return;
    }
    var allow = ((_a = value.allowFrom) !== null && _a !== void 0 ? _a : [])
      .map(function (v) {
        return String(v).trim();
      })
      .filter(Boolean);
    if (allow.includes("*")) {
      return;
    }
    ctx.addIssue({
      code: zod_1.z.ZodIssueCode.custom,
      path: ["allowFrom"],
      message: 'channels.whatsapp.accounts.*.dmPolicy="open" requires allowFrom to include "*"',
    });
  });
exports.WhatsAppConfigSchema = zod_1.z
  .object({
    accounts: zod_1.z.record(zod_1.z.string(), exports.WhatsAppAccountSchema.optional()).optional(),
    capabilities: zod_1.z.array(zod_1.z.string()).optional(),
    markdown: zod_schema_core_js_1.MarkdownConfigSchema,
    configWrites: zod_1.z.boolean().optional(),
    sendReadReceipts: zod_1.z.boolean().optional(),
    dmPolicy: zod_schema_core_js_1.DmPolicySchema.optional().default("pairing"),
    messagePrefix: zod_1.z.string().optional(),
    selfChatMode: zod_1.z.boolean().optional(),
    allowFrom: zod_1.z.array(zod_1.z.string()).optional(),
    groupAllowFrom: zod_1.z.array(zod_1.z.string()).optional(),
    groupPolicy: zod_schema_core_js_1.GroupPolicySchema.optional().default("allowlist"),
    historyLimit: zod_1.z.number().int().min(0).optional(),
    dmHistoryLimit: zod_1.z.number().int().min(0).optional(),
    dms: zod_1.z
      .record(zod_1.z.string(), zod_schema_core_js_1.DmConfigSchema.optional())
      .optional(),
    textChunkLimit: zod_1.z.number().int().positive().optional(),
    chunkMode: zod_1.z.enum(["length", "newline"]).optional(),
    mediaMaxMb: zod_1.z.number().int().positive().optional().default(50),
    blockStreaming: zod_1.z.boolean().optional(),
    blockStreamingCoalesce: zod_schema_core_js_1.BlockStreamingCoalesceSchema.optional(),
    actions: zod_1.z
      .object({
        reactions: zod_1.z.boolean().optional(),
        sendMessage: zod_1.z.boolean().optional(),
        polls: zod_1.z.boolean().optional(),
      })
      .strict()
      .optional(),
    groups: zod_1.z
      .record(
        zod_1.z.string(),
        zod_1.z
          .object({
            requireMention: zod_1.z.boolean().optional(),
            tools: zod_schema_agent_runtime_js_1.ToolPolicySchema,
            toolsBySender: ToolPolicyBySenderSchema,
          })
          .strict()
          .optional(),
      )
      .optional(),
    ackReaction: zod_1.z
      .object({
        emoji: zod_1.z.string().optional(),
        direct: zod_1.z.boolean().optional().default(true),
        group: zod_1.z.enum(["always", "mentions", "never"]).optional().default("mentions"),
      })
      .strict()
      .optional(),
    debounceMs: zod_1.z.number().int().nonnegative().optional().default(0),
    heartbeat: zod_schema_channels_js_1.ChannelHeartbeatVisibilitySchema,
  })
  .strict()
  .superRefine(function (value, ctx) {
    var _a;
    if (value.dmPolicy !== "open") {
      return;
    }
    var allow = ((_a = value.allowFrom) !== null && _a !== void 0 ? _a : [])
      .map(function (v) {
        return String(v).trim();
      })
      .filter(Boolean);
    if (allow.includes("*")) {
      return;
    }
    ctx.addIssue({
      code: zod_1.z.ZodIssueCode.custom,
      path: ["allowFrom"],
      message:
        'channels.whatsapp.dmPolicy="open" requires channels.whatsapp.allowFrom to include "*"',
    });
  });
