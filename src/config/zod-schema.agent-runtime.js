"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolsSchema =
  exports.AgentEntrySchema =
  exports.AgentModelSchema =
  exports.MemorySearchSchema =
  exports.AgentToolsSchema =
  exports.AgentSandboxSchema =
  exports.ElevatedAllowFromSchema =
  exports.ToolPolicyWithProfileSchema =
  exports.ToolProfileSchema =
  exports.ToolsWebSchema =
  exports.ToolsWebFetchSchema =
  exports.ToolsWebSearchSchema =
  exports.ToolPolicySchema =
  exports.SandboxPruneSchema =
  exports.SandboxBrowserSchema =
  exports.SandboxDockerSchema =
  exports.HeartbeatSchema =
    void 0;
var zod_1 = require("zod");
var parse_duration_js_1 = require("../cli/parse-duration.js");
var zod_schema_core_js_1 = require("./zod-schema.core.js");
exports.HeartbeatSchema = zod_1.z
  .object({
    every: zod_1.z.string().optional(),
    activeHours: zod_1.z
      .object({
        start: zod_1.z.string().optional(),
        end: zod_1.z.string().optional(),
        timezone: zod_1.z.string().optional(),
      })
      .strict()
      .optional(),
    model: zod_1.z.string().optional(),
    session: zod_1.z.string().optional(),
    includeReasoning: zod_1.z.boolean().optional(),
    target: zod_1.z.string().optional(),
    to: zod_1.z.string().optional(),
    prompt: zod_1.z.string().optional(),
    ackMaxChars: zod_1.z.number().int().nonnegative().optional(),
  })
  .strict()
  .superRefine(function (val, ctx) {
    if (!val.every) {
      return;
    }
    try {
      (0, parse_duration_js_1.parseDurationMs)(val.every, { defaultUnit: "m" });
    } catch (_a) {
      ctx.addIssue({
        code: zod_1.z.ZodIssueCode.custom,
        path: ["every"],
        message: "invalid duration (use ms, s, m, h)",
      });
    }
    var active = val.activeHours;
    if (!active) {
      return;
    }
    var timePattern = /^([01]\d|2[0-3]|24):([0-5]\d)$/;
    var validateTime = function (raw, opts, path) {
      if (!raw) {
        return;
      }
      if (!timePattern.test(raw)) {
        ctx.addIssue({
          code: zod_1.z.ZodIssueCode.custom,
          path: ["activeHours", path],
          message: 'invalid time (use "HH:MM" 24h format)',
        });
        return;
      }
      var _a = raw.split(":"),
        hourStr = _a[0],
        minuteStr = _a[1];
      var hour = Number(hourStr);
      var minute = Number(minuteStr);
      if (hour === 24 && minute !== 0) {
        ctx.addIssue({
          code: zod_1.z.ZodIssueCode.custom,
          path: ["activeHours", path],
          message: "invalid time (24:00 is the only allowed 24:xx value)",
        });
        return;
      }
      if (hour === 24 && !opts.allow24) {
        ctx.addIssue({
          code: zod_1.z.ZodIssueCode.custom,
          path: ["activeHours", path],
          message: "invalid time (start cannot be 24:00)",
        });
      }
    };
    validateTime(active.start, { allow24: false }, "start");
    validateTime(active.end, { allow24: true }, "end");
  })
  .optional();
exports.SandboxDockerSchema = zod_1.z
  .object({
    image: zod_1.z.string().optional(),
    containerPrefix: zod_1.z.string().optional(),
    workdir: zod_1.z.string().optional(),
    readOnlyRoot: zod_1.z.boolean().optional(),
    tmpfs: zod_1.z.array(zod_1.z.string()).optional(),
    network: zod_1.z.string().optional(),
    user: zod_1.z.string().optional(),
    capDrop: zod_1.z.array(zod_1.z.string()).optional(),
    env: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    setupCommand: zod_1.z.string().optional(),
    pidsLimit: zod_1.z.number().int().positive().optional(),
    memory: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).optional(),
    memorySwap: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).optional(),
    cpus: zod_1.z.number().positive().optional(),
    ulimits: zod_1.z
      .record(
        zod_1.z.string(),
        zod_1.z.union([
          zod_1.z.string(),
          zod_1.z.number(),
          zod_1.z
            .object({
              soft: zod_1.z.number().int().nonnegative().optional(),
              hard: zod_1.z.number().int().nonnegative().optional(),
            })
            .strict(),
        ]),
      )
      .optional(),
    seccompProfile: zod_1.z.string().optional(),
    apparmorProfile: zod_1.z.string().optional(),
    dns: zod_1.z.array(zod_1.z.string()).optional(),
    extraHosts: zod_1.z.array(zod_1.z.string()).optional(),
    binds: zod_1.z.array(zod_1.z.string()).optional(),
  })
  .strict()
  .optional();
exports.SandboxBrowserSchema = zod_1.z
  .object({
    enabled: zod_1.z.boolean().optional(),
    image: zod_1.z.string().optional(),
    containerPrefix: zod_1.z.string().optional(),
    cdpPort: zod_1.z.number().int().positive().optional(),
    vncPort: zod_1.z.number().int().positive().optional(),
    noVncPort: zod_1.z.number().int().positive().optional(),
    headless: zod_1.z.boolean().optional(),
    enableNoVnc: zod_1.z.boolean().optional(),
    allowHostControl: zod_1.z.boolean().optional(),
    autoStart: zod_1.z.boolean().optional(),
    autoStartTimeoutMs: zod_1.z.number().int().positive().optional(),
  })
  .strict()
  .optional();
exports.SandboxPruneSchema = zod_1.z
  .object({
    idleHours: zod_1.z.number().int().nonnegative().optional(),
    maxAgeDays: zod_1.z.number().int().nonnegative().optional(),
  })
  .strict()
  .optional();
var ToolPolicyBaseSchema = zod_1.z
  .object({
    allow: zod_1.z.array(zod_1.z.string()).optional(),
    alsoAllow: zod_1.z.array(zod_1.z.string()).optional(),
    deny: zod_1.z.array(zod_1.z.string()).optional(),
  })
  .strict();
exports.ToolPolicySchema = ToolPolicyBaseSchema.superRefine(function (value, ctx) {
  if (value.allow && value.allow.length > 0 && value.alsoAllow && value.alsoAllow.length > 0) {
    ctx.addIssue({
      code: zod_1.z.ZodIssueCode.custom,
      message:
        "tools policy cannot set both allow and alsoAllow in the same scope (merge alsoAllow into allow, or remove allow and use profile + alsoAllow)",
    });
  }
}).optional();
exports.ToolsWebSearchSchema = zod_1.z
  .object({
    enabled: zod_1.z.boolean().optional(),
    provider: zod_1.z.union([zod_1.z.literal("brave"), zod_1.z.literal("perplexity")]).optional(),
    apiKey: zod_1.z.string().optional(),
    maxResults: zod_1.z.number().int().positive().optional(),
    timeoutSeconds: zod_1.z.number().int().positive().optional(),
    cacheTtlMinutes: zod_1.z.number().nonnegative().optional(),
    perplexity: zod_1.z
      .object({
        apiKey: zod_1.z.string().optional(),
        baseUrl: zod_1.z.string().optional(),
        model: zod_1.z.string().optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .optional();
exports.ToolsWebFetchSchema = zod_1.z
  .object({
    enabled: zod_1.z.boolean().optional(),
    maxChars: zod_1.z.number().int().positive().optional(),
    timeoutSeconds: zod_1.z.number().int().positive().optional(),
    cacheTtlMinutes: zod_1.z.number().nonnegative().optional(),
    maxRedirects: zod_1.z.number().int().nonnegative().optional(),
    userAgent: zod_1.z.string().optional(),
  })
  .strict()
  .optional();
exports.ToolsWebSchema = zod_1.z
  .object({
    search: exports.ToolsWebSearchSchema,
    fetch: exports.ToolsWebFetchSchema,
  })
  .strict()
  .optional();
exports.ToolProfileSchema = zod_1.z
  .union([
    zod_1.z.literal("minimal"),
    zod_1.z.literal("coding"),
    zod_1.z.literal("messaging"),
    zod_1.z.literal("full"),
  ])
  .optional();
exports.ToolPolicyWithProfileSchema = zod_1.z
  .object({
    allow: zod_1.z.array(zod_1.z.string()).optional(),
    alsoAllow: zod_1.z.array(zod_1.z.string()).optional(),
    deny: zod_1.z.array(zod_1.z.string()).optional(),
    profile: exports.ToolProfileSchema,
  })
  .strict()
  .superRefine(function (value, ctx) {
    if (value.allow && value.allow.length > 0 && value.alsoAllow && value.alsoAllow.length > 0) {
      ctx.addIssue({
        code: zod_1.z.ZodIssueCode.custom,
        message:
          "tools.byProvider policy cannot set both allow and alsoAllow in the same scope (merge alsoAllow into allow, or remove allow and use profile + alsoAllow)",
      });
    }
  });
// Provider docking: allowlists keyed by provider id (no schema updates when adding providers).
exports.ElevatedAllowFromSchema = zod_1.z
  .record(zod_1.z.string(), zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])))
  .optional();
exports.AgentSandboxSchema = zod_1.z
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
    docker: exports.SandboxDockerSchema,
    browser: exports.SandboxBrowserSchema,
    prune: exports.SandboxPruneSchema,
  })
  .strict()
  .optional();
exports.AgentToolsSchema = zod_1.z
  .object({
    profile: exports.ToolProfileSchema,
    allow: zod_1.z.array(zod_1.z.string()).optional(),
    alsoAllow: zod_1.z.array(zod_1.z.string()).optional(),
    deny: zod_1.z.array(zod_1.z.string()).optional(),
    byProvider: zod_1.z.record(zod_1.z.string(), exports.ToolPolicyWithProfileSchema).optional(),
    elevated: zod_1.z
      .object({
        enabled: zod_1.z.boolean().optional(),
        allowFrom: exports.ElevatedAllowFromSchema,
      })
      .strict()
      .optional(),
    exec: zod_1.z
      .object({
        host: zod_1.z.enum(["sandbox", "gateway", "node"]).optional(),
        security: zod_1.z.enum(["deny", "allowlist", "full"]).optional(),
        ask: zod_1.z.enum(["off", "on-miss", "always"]).optional(),
        node: zod_1.z.string().optional(),
        pathPrepend: zod_1.z.array(zod_1.z.string()).optional(),
        safeBins: zod_1.z.array(zod_1.z.string()).optional(),
        backgroundMs: zod_1.z.number().int().positive().optional(),
        timeoutSec: zod_1.z.number().int().positive().optional(),
        approvalRunningNoticeMs: zod_1.z.number().int().nonnegative().optional(),
        cleanupMs: zod_1.z.number().int().positive().optional(),
        notifyOnExit: zod_1.z.boolean().optional(),
        applyPatch: zod_1.z
          .object({
            enabled: zod_1.z.boolean().optional(),
            allowModels: zod_1.z.array(zod_1.z.string()).optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    sandbox: zod_1.z
      .object({
        tools: exports.ToolPolicySchema,
      })
      .strict()
      .optional(),
  })
  .strict()
  .superRefine(function (value, ctx) {
    if (value.allow && value.allow.length > 0 && value.alsoAllow && value.alsoAllow.length > 0) {
      ctx.addIssue({
        code: zod_1.z.ZodIssueCode.custom,
        message:
          "agent tools cannot set both allow and alsoAllow in the same scope (merge alsoAllow into allow, or remove allow and use profile + alsoAllow)",
      });
    }
  })
  .optional();
exports.MemorySearchSchema = zod_1.z
  .object({
    enabled: zod_1.z.boolean().optional(),
    sources: zod_1.z
      .array(zod_1.z.union([zod_1.z.literal("memory"), zod_1.z.literal("sessions")]))
      .optional(),
    extraPaths: zod_1.z.array(zod_1.z.string()).optional(),
    experimental: zod_1.z
      .object({
        sessionMemory: zod_1.z.boolean().optional(),
      })
      .strict()
      .optional(),
    provider: zod_1.z
      .union([zod_1.z.literal("openai"), zod_1.z.literal("local"), zod_1.z.literal("gemini")])
      .optional(),
    remote: zod_1.z
      .object({
        baseUrl: zod_1.z.string().optional(),
        apiKey: zod_1.z.string().optional(),
        headers: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
        batch: zod_1.z
          .object({
            enabled: zod_1.z.boolean().optional(),
            wait: zod_1.z.boolean().optional(),
            concurrency: zod_1.z.number().int().positive().optional(),
            pollIntervalMs: zod_1.z.number().int().nonnegative().optional(),
            timeoutMinutes: zod_1.z.number().int().positive().optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    fallback: zod_1.z
      .union([
        zod_1.z.literal("openai"),
        zod_1.z.literal("gemini"),
        zod_1.z.literal("local"),
        zod_1.z.literal("none"),
      ])
      .optional(),
    model: zod_1.z.string().optional(),
    local: zod_1.z
      .object({
        modelPath: zod_1.z.string().optional(),
        modelCacheDir: zod_1.z.string().optional(),
      })
      .strict()
      .optional(),
    store: zod_1.z
      .object({
        driver: zod_1.z.literal("sqlite").optional(),
        path: zod_1.z.string().optional(),
        vector: zod_1.z
          .object({
            enabled: zod_1.z.boolean().optional(),
            extensionPath: zod_1.z.string().optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    chunking: zod_1.z
      .object({
        tokens: zod_1.z.number().int().positive().optional(),
        overlap: zod_1.z.number().int().nonnegative().optional(),
      })
      .strict()
      .optional(),
    sync: zod_1.z
      .object({
        onSessionStart: zod_1.z.boolean().optional(),
        onSearch: zod_1.z.boolean().optional(),
        watch: zod_1.z.boolean().optional(),
        watchDebounceMs: zod_1.z.number().int().nonnegative().optional(),
        intervalMinutes: zod_1.z.number().int().nonnegative().optional(),
        sessions: zod_1.z
          .object({
            deltaBytes: zod_1.z.number().int().nonnegative().optional(),
            deltaMessages: zod_1.z.number().int().nonnegative().optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    query: zod_1.z
      .object({
        maxResults: zod_1.z.number().int().positive().optional(),
        minScore: zod_1.z.number().min(0).max(1).optional(),
        hybrid: zod_1.z
          .object({
            enabled: zod_1.z.boolean().optional(),
            vectorWeight: zod_1.z.number().min(0).max(1).optional(),
            textWeight: zod_1.z.number().min(0).max(1).optional(),
            candidateMultiplier: zod_1.z.number().int().positive().optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    cache: zod_1.z
      .object({
        enabled: zod_1.z.boolean().optional(),
        maxEntries: zod_1.z.number().int().positive().optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .optional();
exports.AgentModelSchema = zod_1.z.union([
  zod_1.z.string(),
  zod_1.z
    .object({
      primary: zod_1.z.string().optional(),
      fallbacks: zod_1.z.array(zod_1.z.string()).optional(),
    })
    .strict(),
]);
exports.AgentEntrySchema = zod_1.z
  .object({
    id: zod_1.z.string(),
    default: zod_1.z.boolean().optional(),
    name: zod_1.z.string().optional(),
    workspace: zod_1.z.string().optional(),
    agentDir: zod_1.z.string().optional(),
    model: exports.AgentModelSchema.optional(),
    memorySearch: exports.MemorySearchSchema,
    humanDelay: zod_schema_core_js_1.HumanDelaySchema.optional(),
    heartbeat: exports.HeartbeatSchema,
    identity: zod_schema_core_js_1.IdentitySchema,
    groupChat: zod_schema_core_js_1.GroupChatSchema,
    subagents: zod_1.z
      .object({
        allowAgents: zod_1.z.array(zod_1.z.string()).optional(),
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
    sandbox: exports.AgentSandboxSchema,
    tools: exports.AgentToolsSchema,
  })
  .strict();
exports.ToolsSchema = zod_1.z
  .object({
    profile: exports.ToolProfileSchema,
    allow: zod_1.z.array(zod_1.z.string()).optional(),
    alsoAllow: zod_1.z.array(zod_1.z.string()).optional(),
    deny: zod_1.z.array(zod_1.z.string()).optional(),
    byProvider: zod_1.z.record(zod_1.z.string(), exports.ToolPolicyWithProfileSchema).optional(),
    web: exports.ToolsWebSchema,
    media: zod_schema_core_js_1.ToolsMediaSchema,
    links: zod_schema_core_js_1.ToolsLinksSchema,
    message: zod_1.z
      .object({
        allowCrossContextSend: zod_1.z.boolean().optional(),
        crossContext: zod_1.z
          .object({
            allowWithinProvider: zod_1.z.boolean().optional(),
            allowAcrossProviders: zod_1.z.boolean().optional(),
            marker: zod_1.z
              .object({
                enabled: zod_1.z.boolean().optional(),
                prefix: zod_1.z.string().optional(),
                suffix: zod_1.z.string().optional(),
              })
              .strict()
              .optional(),
          })
          .strict()
          .optional(),
        broadcast: zod_1.z
          .object({
            enabled: zod_1.z.boolean().optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    agentToAgent: zod_1.z
      .object({
        enabled: zod_1.z.boolean().optional(),
        allow: zod_1.z.array(zod_1.z.string()).optional(),
      })
      .strict()
      .optional(),
    elevated: zod_1.z
      .object({
        enabled: zod_1.z.boolean().optional(),
        allowFrom: exports.ElevatedAllowFromSchema,
      })
      .strict()
      .optional(),
    exec: zod_1.z
      .object({
        host: zod_1.z.enum(["sandbox", "gateway", "node"]).optional(),
        security: zod_1.z.enum(["deny", "allowlist", "full"]).optional(),
        ask: zod_1.z.enum(["off", "on-miss", "always"]).optional(),
        node: zod_1.z.string().optional(),
        pathPrepend: zod_1.z.array(zod_1.z.string()).optional(),
        safeBins: zod_1.z.array(zod_1.z.string()).optional(),
        backgroundMs: zod_1.z.number().int().positive().optional(),
        timeoutSec: zod_1.z.number().int().positive().optional(),
        cleanupMs: zod_1.z.number().int().positive().optional(),
        notifyOnExit: zod_1.z.boolean().optional(),
        applyPatch: zod_1.z
          .object({
            enabled: zod_1.z.boolean().optional(),
            allowModels: zod_1.z.array(zod_1.z.string()).optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    subagents: zod_1.z
      .object({
        tools: exports.ToolPolicySchema,
      })
      .strict()
      .optional(),
    sandbox: zod_1.z
      .object({
        tools: exports.ToolPolicySchema,
      })
      .strict()
      .optional(),
  })
  .strict()
  .superRefine(function (value, ctx) {
    if (value.allow && value.allow.length > 0 && value.alsoAllow && value.alsoAllow.length > 0) {
      ctx.addIssue({
        code: zod_1.z.ZodIssueCode.custom,
        message:
          "tools cannot set both allow and alsoAllow in the same scope (merge alsoAllow into allow, or remove allow and use profile + alsoAllow)",
      });
    }
  })
  .optional();
