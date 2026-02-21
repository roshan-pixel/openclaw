"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderCommandsSchema =
  exports.NativeCommandsSettingSchema =
  exports.ToolsLinksSchema =
  exports.LinkModelSchema =
  exports.ToolsMediaSchema =
  exports.ToolsMediaUnderstandingSchema =
  exports.MediaUnderstandingModelSchema =
  exports.MediaUnderstandingAttachmentsSchema =
  exports.MediaUnderstandingCapabilitiesSchema =
  exports.MediaUnderstandingScopeSchema =
  exports.ExecutableTokenSchema =
  exports.HexColorSchema =
  exports.TranscribeAudioSchema =
  exports.InboundDebounceSchema =
  exports.QueueSchema =
  exports.DebounceMsBySurfaceSchema =
  exports.QueueModeBySurfaceSchema =
  exports.RetryConfigSchema =
  exports.MSTeamsReplyStyleSchema =
  exports.requireOpenAllowFrom =
  exports.normalizeAllowFrom =
  exports.CliBackendSchema =
  exports.HumanDelaySchema =
  exports.TtsConfigSchema =
  exports.TtsAutoSchema =
  exports.TtsModeSchema =
  exports.TtsProviderSchema =
  exports.MarkdownConfigSchema =
  exports.MarkdownTableModeSchema =
  exports.BlockStreamingChunkSchema =
  exports.BlockStreamingCoalesceSchema =
  exports.DmPolicySchema =
  exports.GroupPolicySchema =
  exports.ReplyToModeSchema =
  exports.QueueDropSchema =
  exports.QueueModeSchema =
  exports.IdentitySchema =
  exports.DmConfigSchema =
  exports.GroupChatSchema =
  exports.ModelsConfigSchema =
  exports.BedrockDiscoverySchema =
  exports.ModelProviderSchema =
  exports.ModelDefinitionSchema =
  exports.ModelCompatSchema =
  exports.ModelApiSchema =
    void 0;
var zod_1 = require("zod");
var exec_safety_js_1 = require("../infra/exec-safety.js");
exports.ModelApiSchema = zod_1.z.union([
  zod_1.z.literal("openai-completions"),
  zod_1.z.literal("openai-responses"),
  zod_1.z.literal("anthropic-messages"),
  zod_1.z.literal("google-generative-ai"),
  zod_1.z.literal("github-copilot"),
  zod_1.z.literal("bedrock-converse-stream"),
]);
exports.ModelCompatSchema = zod_1.z
  .object({
    supportsStore: zod_1.z.boolean().optional(),
    supportsDeveloperRole: zod_1.z.boolean().optional(),
    supportsReasoningEffort: zod_1.z.boolean().optional(),
    maxTokensField: zod_1.z
      .union([zod_1.z.literal("max_completion_tokens"), zod_1.z.literal("max_tokens")])
      .optional(),
  })
  .strict()
  .optional();
exports.ModelDefinitionSchema = zod_1.z
  .object({
    id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    api: exports.ModelApiSchema.optional(),
    reasoning: zod_1.z.boolean().optional(),
    input: zod_1.z
      .array(zod_1.z.union([zod_1.z.literal("text"), zod_1.z.literal("image")]))
      .optional(),
    cost: zod_1.z
      .object({
        input: zod_1.z.number().optional(),
        output: zod_1.z.number().optional(),
        cacheRead: zod_1.z.number().optional(),
        cacheWrite: zod_1.z.number().optional(),
      })
      .strict()
      .optional(),
    contextWindow: zod_1.z.number().positive().optional(),
    maxTokens: zod_1.z.number().positive().optional(),
    headers: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    compat: exports.ModelCompatSchema,
  })
  .strict();
exports.ModelProviderSchema = zod_1.z
  .object({
    baseUrl: zod_1.z.string().min(1),
    apiKey: zod_1.z.string().optional(),
    auth: zod_1.z
      .union([
        zod_1.z.literal("api-key"),
        zod_1.z.literal("aws-sdk"),
        zod_1.z.literal("oauth"),
        zod_1.z.literal("token"),
      ])
      .optional(),
    api: exports.ModelApiSchema.optional(),
    headers: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    authHeader: zod_1.z.boolean().optional(),
    models: zod_1.z.array(exports.ModelDefinitionSchema),
  })
  .strict();
exports.BedrockDiscoverySchema = zod_1.z
  .object({
    enabled: zod_1.z.boolean().optional(),
    region: zod_1.z.string().optional(),
    providerFilter: zod_1.z.array(zod_1.z.string()).optional(),
    refreshInterval: zod_1.z.number().int().nonnegative().optional(),
    defaultContextWindow: zod_1.z.number().int().positive().optional(),
    defaultMaxTokens: zod_1.z.number().int().positive().optional(),
  })
  .strict()
  .optional();
exports.ModelsConfigSchema = zod_1.z
  .object({
    mode: zod_1.z.union([zod_1.z.literal("merge"), zod_1.z.literal("replace")]).optional(),
    providers: zod_1.z.record(zod_1.z.string(), exports.ModelProviderSchema).optional(),
    bedrockDiscovery: exports.BedrockDiscoverySchema,
  })
  .strict()
  .optional();
exports.GroupChatSchema = zod_1.z
  .object({
    mentionPatterns: zod_1.z.array(zod_1.z.string()).optional(),
    historyLimit: zod_1.z.number().int().positive().optional(),
  })
  .strict()
  .optional();
exports.DmConfigSchema = zod_1.z
  .object({
    historyLimit: zod_1.z.number().int().min(0).optional(),
  })
  .strict();
exports.IdentitySchema = zod_1.z
  .object({
    name: zod_1.z.string().optional(),
    theme: zod_1.z.string().optional(),
    emoji: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional(),
  })
  .strict()
  .optional();
exports.QueueModeSchema = zod_1.z.union([
  zod_1.z.literal("steer"),
  zod_1.z.literal("followup"),
  zod_1.z.literal("collect"),
  zod_1.z.literal("steer-backlog"),
  zod_1.z.literal("steer+backlog"),
  zod_1.z.literal("queue"),
  zod_1.z.literal("interrupt"),
]);
exports.QueueDropSchema = zod_1.z.union([
  zod_1.z.literal("old"),
  zod_1.z.literal("new"),
  zod_1.z.literal("summarize"),
]);
exports.ReplyToModeSchema = zod_1.z.union([
  zod_1.z.literal("off"),
  zod_1.z.literal("first"),
  zod_1.z.literal("all"),
]);
// GroupPolicySchema: controls how group messages are handled
// Used with .default("allowlist").optional() pattern:
//   - .optional() allows field omission in input config
//   - .default("allowlist") ensures runtime always resolves to "allowlist" if not provided
exports.GroupPolicySchema = zod_1.z.enum(["open", "disabled", "allowlist"]);
exports.DmPolicySchema = zod_1.z.enum(["pairing", "allowlist", "open", "disabled"]);
exports.BlockStreamingCoalesceSchema = zod_1.z
  .object({
    minChars: zod_1.z.number().int().positive().optional(),
    maxChars: zod_1.z.number().int().positive().optional(),
    idleMs: zod_1.z.number().int().nonnegative().optional(),
  })
  .strict();
exports.BlockStreamingChunkSchema = zod_1.z
  .object({
    minChars: zod_1.z.number().int().positive().optional(),
    maxChars: zod_1.z.number().int().positive().optional(),
    breakPreference: zod_1.z
      .union([
        zod_1.z.literal("paragraph"),
        zod_1.z.literal("newline"),
        zod_1.z.literal("sentence"),
      ])
      .optional(),
  })
  .strict();
exports.MarkdownTableModeSchema = zod_1.z.enum(["off", "bullets", "code"]);
exports.MarkdownConfigSchema = zod_1.z
  .object({
    tables: exports.MarkdownTableModeSchema.optional(),
  })
  .strict()
  .optional();
exports.TtsProviderSchema = zod_1.z.enum(["elevenlabs", "openai", "edge"]);
exports.TtsModeSchema = zod_1.z.enum(["final", "all"]);
exports.TtsAutoSchema = zod_1.z.enum(["off", "always", "inbound", "tagged"]);
exports.TtsConfigSchema = zod_1.z
  .object({
    auto: exports.TtsAutoSchema.optional(),
    enabled: zod_1.z.boolean().optional(),
    mode: exports.TtsModeSchema.optional(),
    provider: exports.TtsProviderSchema.optional(),
    summaryModel: zod_1.z.string().optional(),
    modelOverrides: zod_1.z
      .object({
        enabled: zod_1.z.boolean().optional(),
        allowText: zod_1.z.boolean().optional(),
        allowProvider: zod_1.z.boolean().optional(),
        allowVoice: zod_1.z.boolean().optional(),
        allowModelId: zod_1.z.boolean().optional(),
        allowVoiceSettings: zod_1.z.boolean().optional(),
        allowNormalization: zod_1.z.boolean().optional(),
        allowSeed: zod_1.z.boolean().optional(),
      })
      .strict()
      .optional(),
    elevenlabs: zod_1.z
      .object({
        apiKey: zod_1.z.string().optional(),
        baseUrl: zod_1.z.string().optional(),
        voiceId: zod_1.z.string().optional(),
        modelId: zod_1.z.string().optional(),
        seed: zod_1.z.number().int().min(0).max(4294967295).optional(),
        applyTextNormalization: zod_1.z.enum(["auto", "on", "off"]).optional(),
        languageCode: zod_1.z.string().optional(),
        voiceSettings: zod_1.z
          .object({
            stability: zod_1.z.number().min(0).max(1).optional(),
            similarityBoost: zod_1.z.number().min(0).max(1).optional(),
            style: zod_1.z.number().min(0).max(1).optional(),
            useSpeakerBoost: zod_1.z.boolean().optional(),
            speed: zod_1.z.number().min(0.5).max(2).optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    openai: zod_1.z
      .object({
        apiKey: zod_1.z.string().optional(),
        model: zod_1.z.string().optional(),
        voice: zod_1.z.string().optional(),
      })
      .strict()
      .optional(),
    edge: zod_1.z
      .object({
        enabled: zod_1.z.boolean().optional(),
        voice: zod_1.z.string().optional(),
        lang: zod_1.z.string().optional(),
        outputFormat: zod_1.z.string().optional(),
        pitch: zod_1.z.string().optional(),
        rate: zod_1.z.string().optional(),
        volume: zod_1.z.string().optional(),
        saveSubtitles: zod_1.z.boolean().optional(),
        proxy: zod_1.z.string().optional(),
        timeoutMs: zod_1.z.number().int().min(1000).max(120000).optional(),
      })
      .strict()
      .optional(),
    prefsPath: zod_1.z.string().optional(),
    maxTextLength: zod_1.z.number().int().min(1).optional(),
    timeoutMs: zod_1.z.number().int().min(1000).max(120000).optional(),
  })
  .strict()
  .optional();
exports.HumanDelaySchema = zod_1.z
  .object({
    mode: zod_1.z
      .union([zod_1.z.literal("off"), zod_1.z.literal("natural"), zod_1.z.literal("custom")])
      .optional(),
    minMs: zod_1.z.number().int().nonnegative().optional(),
    maxMs: zod_1.z.number().int().nonnegative().optional(),
  })
  .strict();
exports.CliBackendSchema = zod_1.z
  .object({
    command: zod_1.z.string(),
    args: zod_1.z.array(zod_1.z.string()).optional(),
    output: zod_1.z
      .union([zod_1.z.literal("json"), zod_1.z.literal("text"), zod_1.z.literal("jsonl")])
      .optional(),
    resumeOutput: zod_1.z
      .union([zod_1.z.literal("json"), zod_1.z.literal("text"), zod_1.z.literal("jsonl")])
      .optional(),
    input: zod_1.z.union([zod_1.z.literal("arg"), zod_1.z.literal("stdin")]).optional(),
    maxPromptArgChars: zod_1.z.number().int().positive().optional(),
    env: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    clearEnv: zod_1.z.array(zod_1.z.string()).optional(),
    modelArg: zod_1.z.string().optional(),
    modelAliases: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    sessionArg: zod_1.z.string().optional(),
    sessionArgs: zod_1.z.array(zod_1.z.string()).optional(),
    resumeArgs: zod_1.z.array(zod_1.z.string()).optional(),
    sessionMode: zod_1.z
      .union([zod_1.z.literal("always"), zod_1.z.literal("existing"), zod_1.z.literal("none")])
      .optional(),
    sessionIdFields: zod_1.z.array(zod_1.z.string()).optional(),
    systemPromptArg: zod_1.z.string().optional(),
    systemPromptMode: zod_1.z
      .union([zod_1.z.literal("append"), zod_1.z.literal("replace")])
      .optional(),
    systemPromptWhen: zod_1.z
      .union([zod_1.z.literal("first"), zod_1.z.literal("always"), zod_1.z.literal("never")])
      .optional(),
    imageArg: zod_1.z.string().optional(),
    imageMode: zod_1.z.union([zod_1.z.literal("repeat"), zod_1.z.literal("list")]).optional(),
    serialize: zod_1.z.boolean().optional(),
  })
  .strict();
var normalizeAllowFrom = function (values) {
  return (values !== null && values !== void 0 ? values : [])
    .map(function (v) {
      return String(v).trim();
    })
    .filter(Boolean);
};
exports.normalizeAllowFrom = normalizeAllowFrom;
var requireOpenAllowFrom = function (params) {
  if (params.policy !== "open") {
    return;
  }
  var allow = (0, exports.normalizeAllowFrom)(params.allowFrom);
  if (allow.includes("*")) {
    return;
  }
  params.ctx.addIssue({
    code: zod_1.z.ZodIssueCode.custom,
    path: params.path,
    message: params.message,
  });
};
exports.requireOpenAllowFrom = requireOpenAllowFrom;
exports.MSTeamsReplyStyleSchema = zod_1.z.enum(["thread", "top-level"]);
exports.RetryConfigSchema = zod_1.z
  .object({
    attempts: zod_1.z.number().int().min(1).optional(),
    minDelayMs: zod_1.z.number().int().min(0).optional(),
    maxDelayMs: zod_1.z.number().int().min(0).optional(),
    jitter: zod_1.z.number().min(0).max(1).optional(),
  })
  .strict()
  .optional();
exports.QueueModeBySurfaceSchema = zod_1.z
  .object({
    whatsapp: exports.QueueModeSchema.optional(),
    telegram: exports.QueueModeSchema.optional(),
    discord: exports.QueueModeSchema.optional(),
    slack: exports.QueueModeSchema.optional(),
    mattermost: exports.QueueModeSchema.optional(),
    signal: exports.QueueModeSchema.optional(),
    imessage: exports.QueueModeSchema.optional(),
    msteams: exports.QueueModeSchema.optional(),
    webchat: exports.QueueModeSchema.optional(),
  })
  .strict()
  .optional();
exports.DebounceMsBySurfaceSchema = zod_1.z
  .record(zod_1.z.string(), zod_1.z.number().int().nonnegative())
  .optional();
exports.QueueSchema = zod_1.z
  .object({
    mode: exports.QueueModeSchema.optional(),
    byChannel: exports.QueueModeBySurfaceSchema,
    debounceMs: zod_1.z.number().int().nonnegative().optional(),
    debounceMsByChannel: exports.DebounceMsBySurfaceSchema,
    cap: zod_1.z.number().int().positive().optional(),
    drop: exports.QueueDropSchema.optional(),
  })
  .strict()
  .optional();
exports.InboundDebounceSchema = zod_1.z
  .object({
    debounceMs: zod_1.z.number().int().nonnegative().optional(),
    byChannel: exports.DebounceMsBySurfaceSchema,
  })
  .strict()
  .optional();
exports.TranscribeAudioSchema = zod_1.z
  .object({
    command: zod_1.z.array(zod_1.z.string()).superRefine(function (value, ctx) {
      var executable = value[0];
      if (!(0, exec_safety_js_1.isSafeExecutableValue)(executable)) {
        ctx.addIssue({
          code: zod_1.z.ZodIssueCode.custom,
          path: [0],
          message: "expected safe executable name or path",
        });
      }
    }),
    timeoutSeconds: zod_1.z.number().int().positive().optional(),
  })
  .strict()
  .optional();
exports.HexColorSchema = zod_1.z
  .string()
  .regex(/^#?[0-9a-fA-F]{6}$/, "expected hex color (RRGGBB)");
exports.ExecutableTokenSchema = zod_1.z
  .string()
  .refine(exec_safety_js_1.isSafeExecutableValue, "expected safe executable name or path");
exports.MediaUnderstandingScopeSchema = zod_1.z
  .object({
    default: zod_1.z.union([zod_1.z.literal("allow"), zod_1.z.literal("deny")]).optional(),
    rules: zod_1.z
      .array(
        zod_1.z
          .object({
            action: zod_1.z.union([zod_1.z.literal("allow"), zod_1.z.literal("deny")]),
            match: zod_1.z
              .object({
                channel: zod_1.z.string().optional(),
                chatType: zod_1.z
                  .union([
                    zod_1.z.literal("direct"),
                    zod_1.z.literal("group"),
                    zod_1.z.literal("channel"),
                  ])
                  .optional(),
                keyPrefix: zod_1.z.string().optional(),
              })
              .strict()
              .optional(),
          })
          .strict(),
      )
      .optional(),
  })
  .strict()
  .optional();
exports.MediaUnderstandingCapabilitiesSchema = zod_1.z
  .array(
    zod_1.z.union([zod_1.z.literal("image"), zod_1.z.literal("audio"), zod_1.z.literal("video")]),
  )
  .optional();
exports.MediaUnderstandingAttachmentsSchema = zod_1.z
  .object({
    mode: zod_1.z.union([zod_1.z.literal("first"), zod_1.z.literal("all")]).optional(),
    maxAttachments: zod_1.z.number().int().positive().optional(),
    prefer: zod_1.z
      .union([
        zod_1.z.literal("first"),
        zod_1.z.literal("last"),
        zod_1.z.literal("path"),
        zod_1.z.literal("url"),
      ])
      .optional(),
  })
  .strict()
  .optional();
var DeepgramAudioSchema = zod_1.z
  .object({
    detectLanguage: zod_1.z.boolean().optional(),
    punctuate: zod_1.z.boolean().optional(),
    smartFormat: zod_1.z.boolean().optional(),
  })
  .strict()
  .optional();
var ProviderOptionValueSchema = zod_1.z.union([
  zod_1.z.string(),
  zod_1.z.number(),
  zod_1.z.boolean(),
]);
var ProviderOptionsSchema = zod_1.z
  .record(zod_1.z.string(), zod_1.z.record(zod_1.z.string(), ProviderOptionValueSchema))
  .optional();
exports.MediaUnderstandingModelSchema = zod_1.z
  .object({
    provider: zod_1.z.string().optional(),
    model: zod_1.z.string().optional(),
    capabilities: exports.MediaUnderstandingCapabilitiesSchema,
    type: zod_1.z.union([zod_1.z.literal("provider"), zod_1.z.literal("cli")]).optional(),
    command: zod_1.z.string().optional(),
    args: zod_1.z.array(zod_1.z.string()).optional(),
    prompt: zod_1.z.string().optional(),
    maxChars: zod_1.z.number().int().positive().optional(),
    maxBytes: zod_1.z.number().int().positive().optional(),
    timeoutSeconds: zod_1.z.number().int().positive().optional(),
    language: zod_1.z.string().optional(),
    providerOptions: ProviderOptionsSchema,
    deepgram: DeepgramAudioSchema,
    baseUrl: zod_1.z.string().optional(),
    headers: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    profile: zod_1.z.string().optional(),
    preferredProfile: zod_1.z.string().optional(),
  })
  .strict()
  .optional();
exports.ToolsMediaUnderstandingSchema = zod_1.z
  .object({
    enabled: zod_1.z.boolean().optional(),
    scope: exports.MediaUnderstandingScopeSchema,
    maxBytes: zod_1.z.number().int().positive().optional(),
    maxChars: zod_1.z.number().int().positive().optional(),
    prompt: zod_1.z.string().optional(),
    timeoutSeconds: zod_1.z.number().int().positive().optional(),
    language: zod_1.z.string().optional(),
    providerOptions: ProviderOptionsSchema,
    deepgram: DeepgramAudioSchema,
    baseUrl: zod_1.z.string().optional(),
    headers: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    attachments: exports.MediaUnderstandingAttachmentsSchema,
    models: zod_1.z.array(exports.MediaUnderstandingModelSchema).optional(),
  })
  .strict()
  .optional();
exports.ToolsMediaSchema = zod_1.z
  .object({
    models: zod_1.z.array(exports.MediaUnderstandingModelSchema).optional(),
    concurrency: zod_1.z.number().int().positive().optional(),
    image: exports.ToolsMediaUnderstandingSchema.optional(),
    audio: exports.ToolsMediaUnderstandingSchema.optional(),
    video: exports.ToolsMediaUnderstandingSchema.optional(),
  })
  .strict()
  .optional();
exports.LinkModelSchema = zod_1.z
  .object({
    type: zod_1.z.literal("cli").optional(),
    command: zod_1.z.string().min(1),
    args: zod_1.z.array(zod_1.z.string()).optional(),
    timeoutSeconds: zod_1.z.number().int().positive().optional(),
  })
  .strict();
exports.ToolsLinksSchema = zod_1.z
  .object({
    enabled: zod_1.z.boolean().optional(),
    scope: exports.MediaUnderstandingScopeSchema,
    maxLinks: zod_1.z.number().int().positive().optional(),
    timeoutSeconds: zod_1.z.number().int().positive().optional(),
    models: zod_1.z.array(exports.LinkModelSchema).optional(),
  })
  .strict()
  .optional();
exports.NativeCommandsSettingSchema = zod_1.z.union([zod_1.z.boolean(), zod_1.z.literal("auto")]);
exports.ProviderCommandsSchema = zod_1.z
  .object({
    native: exports.NativeCommandsSettingSchema.optional(),
    nativeSkills: exports.NativeCommandsSettingSchema.optional(),
  })
  .strict()
  .optional();
