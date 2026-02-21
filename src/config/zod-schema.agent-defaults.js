"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentDefaultsSchema = void 0;
var zod_1 = require("zod");
var zod_schema_agent_runtime_js_1 = require("./zod-schema.agent-runtime.js");
var zod_schema_core_js_1 = require("./zod-schema.core.js");
exports.AgentDefaultsSchema = zod_1.z
  .object({
    model: zod_1.z
      .object({
        primary: zod_1.z.string().optional(),
        fallbacks: zod_1.z.array(zod_1.z.string()).optional(),
      })
      .strict()
      .optional(),
    imageModel: zod_1.z
      .object({
        primary: zod_1.z.string().optional(),
        fallbacks: zod_1.z.array(zod_1.z.string()).optional(),
      })
      .strict()
      .optional(),
    models: zod_1.z
      .record(
        zod_1.z.string(),
        zod_1.z
          .object({
            alias: zod_1.z.string().optional(),
            /** Provider-specific API parameters (e.g., GLM-4.7 thinking mode). */
            params: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
          })
          .strict(),
      )
      .optional(),
    workspace: zod_1.z.string().optional(),
    repoRoot: zod_1.z.string().optional(),
    skipBootstrap: zod_1.z.boolean().optional(),
    bootstrapMaxChars: zod_1.z.number().int().positive().optional(),
    userTimezone: zod_1.z.string().optional(),
    timeFormat: zod_1.z
      .union([zod_1.z.literal("auto"), zod_1.z.literal("12"), zod_1.z.literal("24")])
      .optional(),
    envelopeTimezone: zod_1.z.string().optional(),
    envelopeTimestamp: zod_1.z.union([zod_1.z.literal("on"), zod_1.z.literal("off")]).optional(),
    envelopeElapsed: zod_1.z.union([zod_1.z.literal("on"), zod_1.z.literal("off")]).optional(),
    contextTokens: zod_1.z.number().int().positive().optional(),
    cliBackends: zod_1.z.record(zod_1.z.string(), zod_schema_core_js_1.CliBackendSchema).optional(),
    memorySearch: zod_schema_agent_runtime_js_1.MemorySearchSchema,
    contextPruning: zod_1.z
      .object({
        mode: zod_1.z.union([zod_1.z.literal("off"), zod_1.z.literal("cache-ttl")]).optional(),
        ttl: zod_1.z.string().optional(),
        keepLastAssistants: zod_1.z.number().int().nonnegative().optional(),
        softTrimRatio: zod_1.z.number().min(0).max(1).optional(),
        hardClearRatio: zod_1.z.number().min(0).max(1).optional(),
        minPrunableToolChars: zod_1.z.number().int().nonnegative().optional(),
        tools: zod_1.z
          .object({
            allow: zod_1.z.array(zod_1.z.string()).optional(),
            deny: zod_1.z.array(zod_1.z.string()).optional(),
          })
          .strict()
          .optional(),
        softTrim: zod_1.z
          .object({
            maxChars: zod_1.z.number().int().nonnegative().optional(),
            headChars: zod_1.z.number().int().nonnegative().optional(),
            tailChars: zod_1.z.number().int().nonnegative().optional(),
          })
          .strict()
          .optional(),
        hardClear: zod_1.z
          .object({
            enabled: zod_1.z.boolean().optional(),
            placeholder: zod_1.z.string().optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    compaction: zod_1.z
      .object({
        mode: zod_1.z.union([zod_1.z.literal("default"), zod_1.z.literal("safeguard")]).optional(),
        reserveTokensFloor: zod_1.z.number().int().nonnegative().optional(),
        maxHistoryShare: zod_1.z.number().min(0.1).max(0.9).optional(),
        memoryFlush: zod_1.z
          .object({
            enabled: zod_1.z.boolean().optional(),
            softThresholdTokens: zod_1.z.number().int().nonnegative().optional(),
            prompt: zod_1.z.string().optional(),
            systemPrompt: zod_1.z.string().optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    thinkingDefault: zod_1.z
      .union([
        zod_1.z.literal("off"),
        zod_1.z.literal("minimal"),
        zod_1.z.literal("low"),
        zod_1.z.literal("medium"),
        zod_1.z.literal("high"),
        zod_1.z.literal("xhigh"),
      ])
      .optional(),
    verboseDefault: zod_1.z
      .union([zod_1.z.literal("off"), zod_1.z.literal("on"), zod_1.z.literal("full")])
      .optional(),
    elevatedDefault: zod_1.z
      .union([
        zod_1.z.literal("off"),
        zod_1.z.literal("on"),
        zod_1.z.literal("ask"),
        zod_1.z.literal("full"),
      ])
      .optional(),
    blockStreamingDefault: zod_1.z
      .union([zod_1.z.literal("off"), zod_1.z.literal("on")])
      .optional(),
    blockStreamingBreak: zod_1.z
      .union([zod_1.z.literal("text_end"), zod_1.z.literal("message_end")])
      .optional(),
    blockStreamingChunk: zod_schema_core_js_1.BlockStreamingChunkSchema.optional(),
    blockStreamingCoalesce: zod_schema_core_js_1.BlockStreamingCoalesceSchema.optional(),
    humanDelay: zod_schema_core_js_1.HumanDelaySchema.optional(),
    timeoutSeconds: zod_1.z.number().int().positive().optional(),
    mediaMaxMb: zod_1.z.number().positive().optional(),
    typingIntervalSeconds: zod_1.z.number().int().positive().optional(),
    typingMode: zod_1.z
      .union([
        zod_1.z.literal("never"),
        zod_1.z.literal("instant"),
        zod_1.z.literal("thinking"),
        zod_1.z.literal("message"),
      ])
      .optional(),
    heartbeat: zod_schema_agent_runtime_js_1.HeartbeatSchema,
    maxConcurrent: zod_1.z.number().int().positive().optional(),
    subagents: zod_1.z
      .object({
        maxConcurrent: zod_1.z.number().int().positive().optional(),
        archiveAfterMinutes: zod_1.z.number().int().positive().optional(),
        model: zod_1.z
          .union([
            zod_1.z.string(),
            zod_1.z
              .object({
                primary: zod_1.z.string().optional(),
                fallbacks: zod_1.z.array(zod_1.z.string()).optional(),
              })
              .strict(),
          ])
          .optional(),
      })
      .strict()
      .optional(),
    sandbox: zod_1.z
      .object({
        mode: zod_1.z
          .union([zod_1.z.literal("off"), zod_1.z.literal("non-main"), zod_1.z.literal("all")])
          .optional(),
        workspaceAccess: zod_1.z
          .union([zod_1.z.literal("none"), zod_1.z.literal("ro"), zod_1.z.literal("rw")])
          .optional(),
        sessionToolsVisibility: zod_1.z
          .union([zod_1.z.literal("spawned"), zod_1.z.literal("all")])
          .optional(),
        scope: zod_1.z
          .union([zod_1.z.literal("session"), zod_1.z.literal("agent"), zod_1.z.literal("shared")])
          .optional(),
        perSession: zod_1.z.boolean().optional(),
        workspaceRoot: zod_1.z.string().optional(),
        docker: zod_schema_agent_runtime_js_1.SandboxDockerSchema,
        browser: zod_schema_agent_runtime_js_1.SandboxBrowserSchema,
        prune: zod_schema_agent_runtime_js_1.SandboxPruneSchema,
      })
      .strict()
      .optional(),
  })
  .strict()
  .optional();
