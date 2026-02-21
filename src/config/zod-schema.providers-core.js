"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSTeamsConfigSchema =
  exports.MSTeamsTeamSchema =
  exports.MSTeamsChannelSchema =
  exports.BlueBubblesConfigSchema =
  exports.BlueBubblesAccountSchema =
  exports.BlueBubblesAccountSchemaBase =
  exports.IMessageConfigSchema =
  exports.IMessageAccountSchema =
  exports.IMessageAccountSchemaBase =
  exports.SignalConfigSchema =
  exports.SignalAccountSchema =
  exports.SignalAccountSchemaBase =
  exports.SlackConfigSchema =
  exports.SlackAccountSchema =
  exports.SlackThreadSchema =
  exports.SlackChannelSchema =
  exports.SlackDmSchema =
  exports.GoogleChatConfigSchema =
  exports.GoogleChatAccountSchema =
  exports.GoogleChatGroupSchema =
  exports.GoogleChatDmSchema =
  exports.DiscordConfigSchema =
  exports.DiscordAccountSchema =
  exports.DiscordGuildSchema =
  exports.DiscordGuildChannelSchema =
  exports.DiscordDmSchema =
  exports.TelegramConfigSchema =
  exports.TelegramAccountSchema =
  exports.TelegramAccountSchemaBase =
  exports.TelegramGroupSchema =
  exports.TelegramTopicSchema =
    void 0;
var zod_1 = require("zod");
var zod_schema_core_js_1 = require("./zod-schema.core.js");
var zod_schema_agent_runtime_js_1 = require("./zod-schema.agent-runtime.js");
var zod_schema_channels_js_1 = require("./zod-schema.channels.js");
var telegram_custom_commands_js_1 = require("./telegram-custom-commands.js");
var ToolPolicyBySenderSchema = zod_1.z
  .record(zod_1.z.string(), zod_schema_agent_runtime_js_1.ToolPolicySchema)
  .optional();
var TelegramInlineButtonsScopeSchema = zod_1.z.enum(["off", "dm", "group", "all", "allowlist"]);
var TelegramCapabilitiesSchema = zod_1.z.union([
  zod_1.z.array(zod_1.z.string()),
  zod_1.z
    .object({
      inlineButtons: TelegramInlineButtonsScopeSchema.optional(),
    })
    .strict(),
]);
exports.TelegramTopicSchema = zod_1.z
  .object({
    requireMention: zod_1.z.boolean().optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    enabled: zod_1.z.boolean().optional(),
    allowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    systemPrompt: zod_1.z.string().optional(),
  })
  .strict();
exports.TelegramGroupSchema = zod_1.z
  .object({
    requireMention: zod_1.z.boolean().optional(),
    tools: zod_schema_agent_runtime_js_1.ToolPolicySchema,
    toolsBySender: ToolPolicyBySenderSchema,
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    enabled: zod_1.z.boolean().optional(),
    allowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    systemPrompt: zod_1.z.string().optional(),
    topics: zod_1.z.record(zod_1.z.string(), exports.TelegramTopicSchema.optional()).optional(),
  })
  .strict();
var TelegramCustomCommandSchema = zod_1.z
  .object({
    command: zod_1.z.string().transform(telegram_custom_commands_js_1.normalizeTelegramCommandName),
    description: zod_1.z
      .string()
      .transform(telegram_custom_commands_js_1.normalizeTelegramCommandDescription),
  })
  .strict();
var validateTelegramCustomCommands = function (value, ctx) {
  if (!value.customCommands || value.customCommands.length === 0) {
    return;
  }
  var issues = (0, telegram_custom_commands_js_1.resolveTelegramCustomCommands)({
    commands: value.customCommands,
    checkReserved: false,
    checkDuplicates: false,
  }).issues;
  for (var _i = 0, issues_1 = issues; _i < issues_1.length; _i++) {
    var issue = issues_1[_i];
    ctx.addIssue({
      code: zod_1.z.ZodIssueCode.custom,
      path: ["customCommands", issue.index, issue.field],
      message: issue.message,
    });
  }
};
exports.TelegramAccountSchemaBase = zod_1.z
  .object({
    name: zod_1.z.string().optional(),
    capabilities: TelegramCapabilitiesSchema.optional(),
    markdown: zod_schema_core_js_1.MarkdownConfigSchema,
    enabled: zod_1.z.boolean().optional(),
    commands: zod_schema_core_js_1.ProviderCommandsSchema,
    customCommands: zod_1.z.array(TelegramCustomCommandSchema).optional(),
    configWrites: zod_1.z.boolean().optional(),
    dmPolicy: zod_schema_core_js_1.DmPolicySchema.optional().default("pairing"),
    botToken: zod_1.z.string().optional(),
    tokenFile: zod_1.z.string().optional(),
    replyToMode: zod_schema_core_js_1.ReplyToModeSchema.optional(),
    groups: zod_1.z.record(zod_1.z.string(), exports.TelegramGroupSchema.optional()).optional(),
    allowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    groupAllowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    groupPolicy: zod_schema_core_js_1.GroupPolicySchema.optional().default("allowlist"),
    historyLimit: zod_1.z.number().int().min(0).optional(),
    dmHistoryLimit: zod_1.z.number().int().min(0).optional(),
    dms: zod_1.z
      .record(zod_1.z.string(), zod_schema_core_js_1.DmConfigSchema.optional())
      .optional(),
    textChunkLimit: zod_1.z.number().int().positive().optional(),
    chunkMode: zod_1.z.enum(["length", "newline"]).optional(),
    blockStreaming: zod_1.z.boolean().optional(),
    draftChunk: zod_schema_core_js_1.BlockStreamingChunkSchema.optional(),
    blockStreamingCoalesce: zod_schema_core_js_1.BlockStreamingCoalesceSchema.optional(),
    streamMode: zod_1.z.enum(["off", "partial", "block"]).optional().default("partial"),
    mediaMaxMb: zod_1.z.number().positive().optional(),
    timeoutSeconds: zod_1.z.number().int().positive().optional(),
    retry: zod_schema_core_js_1.RetryConfigSchema,
    network: zod_1.z
      .object({
        autoSelectFamily: zod_1.z.boolean().optional(),
      })
      .strict()
      .optional(),
    proxy: zod_1.z.string().optional(),
    webhookUrl: zod_1.z.string().optional(),
    webhookSecret: zod_1.z.string().optional(),
    webhookPath: zod_1.z.string().optional(),
    actions: zod_1.z
      .object({
        reactions: zod_1.z.boolean().optional(),
        sendMessage: zod_1.z.boolean().optional(),
        deleteMessage: zod_1.z.boolean().optional(),
        sticker: zod_1.z.boolean().optional(),
      })
      .strict()
      .optional(),
    reactionNotifications: zod_1.z.enum(["off", "own", "all"]).optional(),
    reactionLevel: zod_1.z.enum(["off", "ack", "minimal", "extensive"]).optional(),
    heartbeat: zod_schema_channels_js_1.ChannelHeartbeatVisibilitySchema,
    linkPreview: zod_1.z.boolean().optional(),
  })
  .strict();
exports.TelegramAccountSchema = exports.TelegramAccountSchemaBase.superRefine(
  function (value, ctx) {
    (0, zod_schema_core_js_1.requireOpenAllowFrom)({
      policy: value.dmPolicy,
      allowFrom: value.allowFrom,
      ctx: ctx,
      path: ["allowFrom"],
      message:
        'channels.telegram.dmPolicy="open" requires channels.telegram.allowFrom to include "*"',
    });
    validateTelegramCustomCommands(value, ctx);
  },
);
exports.TelegramConfigSchema = exports.TelegramAccountSchemaBase.extend({
  accounts: zod_1.z.record(zod_1.z.string(), exports.TelegramAccountSchema.optional()).optional(),
}).superRefine(function (value, ctx) {
  (0, zod_schema_core_js_1.requireOpenAllowFrom)({
    policy: value.dmPolicy,
    allowFrom: value.allowFrom,
    ctx: ctx,
    path: ["allowFrom"],
    message:
      'channels.telegram.dmPolicy="open" requires channels.telegram.allowFrom to include "*"',
  });
  validateTelegramCustomCommands(value, ctx);
});
exports.DiscordDmSchema = zod_1.z
  .object({
    enabled: zod_1.z.boolean().optional(),
    policy: zod_schema_core_js_1.DmPolicySchema.optional().default("pairing"),
    allowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    groupEnabled: zod_1.z.boolean().optional(),
    groupChannels: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
  })
  .strict()
  .superRefine(function (value, ctx) {
    (0, zod_schema_core_js_1.requireOpenAllowFrom)({
      policy: value.policy,
      allowFrom: value.allowFrom,
      ctx: ctx,
      path: ["allowFrom"],
      message:
        'channels.discord.dm.policy="open" requires channels.discord.dm.allowFrom to include "*"',
    });
  });
exports.DiscordGuildChannelSchema = zod_1.z
  .object({
    allow: zod_1.z.boolean().optional(),
    requireMention: zod_1.z.boolean().optional(),
    tools: zod_schema_agent_runtime_js_1.ToolPolicySchema,
    toolsBySender: ToolPolicyBySenderSchema,
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    enabled: zod_1.z.boolean().optional(),
    users: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    systemPrompt: zod_1.z.string().optional(),
    autoThread: zod_1.z.boolean().optional(),
  })
  .strict();
exports.DiscordGuildSchema = zod_1.z
  .object({
    slug: zod_1.z.string().optional(),
    requireMention: zod_1.z.boolean().optional(),
    tools: zod_schema_agent_runtime_js_1.ToolPolicySchema,
    toolsBySender: ToolPolicyBySenderSchema,
    reactionNotifications: zod_1.z.enum(["off", "own", "all", "allowlist"]).optional(),
    users: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    channels: zod_1.z
      .record(zod_1.z.string(), exports.DiscordGuildChannelSchema.optional())
      .optional(),
  })
  .strict();
exports.DiscordAccountSchema = zod_1.z
  .object({
    name: zod_1.z.string().optional(),
    capabilities: zod_1.z.array(zod_1.z.string()).optional(),
    markdown: zod_schema_core_js_1.MarkdownConfigSchema,
    enabled: zod_1.z.boolean().optional(),
    commands: zod_schema_core_js_1.ProviderCommandsSchema,
    configWrites: zod_1.z.boolean().optional(),
    token: zod_1.z.string().optional(),
    allowBots: zod_1.z.boolean().optional(),
    groupPolicy: zod_schema_core_js_1.GroupPolicySchema.optional().default("allowlist"),
    historyLimit: zod_1.z.number().int().min(0).optional(),
    dmHistoryLimit: zod_1.z.number().int().min(0).optional(),
    dms: zod_1.z
      .record(zod_1.z.string(), zod_schema_core_js_1.DmConfigSchema.optional())
      .optional(),
    textChunkLimit: zod_1.z.number().int().positive().optional(),
    chunkMode: zod_1.z.enum(["length", "newline"]).optional(),
    blockStreaming: zod_1.z.boolean().optional(),
    blockStreamingCoalesce: zod_schema_core_js_1.BlockStreamingCoalesceSchema.optional(),
    maxLinesPerMessage: zod_1.z.number().int().positive().optional(),
    mediaMaxMb: zod_1.z.number().positive().optional(),
    retry: zod_schema_core_js_1.RetryConfigSchema,
    actions: zod_1.z
      .object({
        reactions: zod_1.z.boolean().optional(),
        stickers: zod_1.z.boolean().optional(),
        emojiUploads: zod_1.z.boolean().optional(),
        stickerUploads: zod_1.z.boolean().optional(),
        polls: zod_1.z.boolean().optional(),
        permissions: zod_1.z.boolean().optional(),
        messages: zod_1.z.boolean().optional(),
        threads: zod_1.z.boolean().optional(),
        pins: zod_1.z.boolean().optional(),
        search: zod_1.z.boolean().optional(),
        memberInfo: zod_1.z.boolean().optional(),
        roleInfo: zod_1.z.boolean().optional(),
        roles: zod_1.z.boolean().optional(),
        channelInfo: zod_1.z.boolean().optional(),
        voiceStatus: zod_1.z.boolean().optional(),
        events: zod_1.z.boolean().optional(),
        moderation: zod_1.z.boolean().optional(),
        channels: zod_1.z.boolean().optional(),
      })
      .strict()
      .optional(),
    replyToMode: zod_schema_core_js_1.ReplyToModeSchema.optional(),
    dm: exports.DiscordDmSchema.optional(),
    guilds: zod_1.z.record(zod_1.z.string(), exports.DiscordGuildSchema.optional()).optional(),
    heartbeat: zod_schema_channels_js_1.ChannelHeartbeatVisibilitySchema,
    execApprovals: zod_1.z
      .object({
        enabled: zod_1.z.boolean().optional(),
        approvers: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
        agentFilter: zod_1.z.array(zod_1.z.string()).optional(),
        sessionFilter: zod_1.z.array(zod_1.z.string()).optional(),
      })
      .strict()
      .optional(),
    intents: zod_1.z
      .object({
        presence: zod_1.z.boolean().optional(),
        guildMembers: zod_1.z.boolean().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();
exports.DiscordConfigSchema = exports.DiscordAccountSchema.extend({
  accounts: zod_1.z.record(zod_1.z.string(), exports.DiscordAccountSchema.optional()).optional(),
});
exports.GoogleChatDmSchema = zod_1.z
  .object({
    enabled: zod_1.z.boolean().optional(),
    policy: zod_schema_core_js_1.DmPolicySchema.optional().default("pairing"),
    allowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
  })
  .strict()
  .superRefine(function (value, ctx) {
    (0, zod_schema_core_js_1.requireOpenAllowFrom)({
      policy: value.policy,
      allowFrom: value.allowFrom,
      ctx: ctx,
      path: ["allowFrom"],
      message:
        'channels.googlechat.dm.policy="open" requires channels.googlechat.dm.allowFrom to include "*"',
    });
  });
exports.GoogleChatGroupSchema = zod_1.z
  .object({
    enabled: zod_1.z.boolean().optional(),
    allow: zod_1.z.boolean().optional(),
    requireMention: zod_1.z.boolean().optional(),
    users: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    systemPrompt: zod_1.z.string().optional(),
  })
  .strict();
exports.GoogleChatAccountSchema = zod_1.z
  .object({
    name: zod_1.z.string().optional(),
    capabilities: zod_1.z.array(zod_1.z.string()).optional(),
    enabled: zod_1.z.boolean().optional(),
    configWrites: zod_1.z.boolean().optional(),
    allowBots: zod_1.z.boolean().optional(),
    requireMention: zod_1.z.boolean().optional(),
    groupPolicy: zod_schema_core_js_1.GroupPolicySchema.optional().default("allowlist"),
    groupAllowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    groups: zod_1.z.record(zod_1.z.string(), exports.GoogleChatGroupSchema.optional()).optional(),
    serviceAccount: zod_1.z
      .union([zod_1.z.string(), zod_1.z.record(zod_1.z.string(), zod_1.z.unknown())])
      .optional(),
    serviceAccountFile: zod_1.z.string().optional(),
    audienceType: zod_1.z.enum(["app-url", "project-number"]).optional(),
    audience: zod_1.z.string().optional(),
    webhookPath: zod_1.z.string().optional(),
    webhookUrl: zod_1.z.string().optional(),
    botUser: zod_1.z.string().optional(),
    historyLimit: zod_1.z.number().int().min(0).optional(),
    dmHistoryLimit: zod_1.z.number().int().min(0).optional(),
    dms: zod_1.z
      .record(zod_1.z.string(), zod_schema_core_js_1.DmConfigSchema.optional())
      .optional(),
    textChunkLimit: zod_1.z.number().int().positive().optional(),
    chunkMode: zod_1.z.enum(["length", "newline"]).optional(),
    blockStreaming: zod_1.z.boolean().optional(),
    blockStreamingCoalesce: zod_schema_core_js_1.BlockStreamingCoalesceSchema.optional(),
    mediaMaxMb: zod_1.z.number().positive().optional(),
    replyToMode: zod_schema_core_js_1.ReplyToModeSchema.optional(),
    actions: zod_1.z
      .object({
        reactions: zod_1.z.boolean().optional(),
      })
      .strict()
      .optional(),
    dm: exports.GoogleChatDmSchema.optional(),
    typingIndicator: zod_1.z.enum(["none", "message", "reaction"]).optional(),
  })
  .strict();
exports.GoogleChatConfigSchema = exports.GoogleChatAccountSchema.extend({
  accounts: zod_1.z.record(zod_1.z.string(), exports.GoogleChatAccountSchema.optional()).optional(),
  defaultAccount: zod_1.z.string().optional(),
});
exports.SlackDmSchema = zod_1.z
  .object({
    enabled: zod_1.z.boolean().optional(),
    policy: zod_schema_core_js_1.DmPolicySchema.optional().default("pairing"),
    allowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    groupEnabled: zod_1.z.boolean().optional(),
    groupChannels: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    replyToMode: zod_schema_core_js_1.ReplyToModeSchema.optional(),
  })
  .strict()
  .superRefine(function (value, ctx) {
    (0, zod_schema_core_js_1.requireOpenAllowFrom)({
      policy: value.policy,
      allowFrom: value.allowFrom,
      ctx: ctx,
      path: ["allowFrom"],
      message:
        'channels.slack.dm.policy="open" requires channels.slack.dm.allowFrom to include "*"',
    });
  });
exports.SlackChannelSchema = zod_1.z
  .object({
    enabled: zod_1.z.boolean().optional(),
    allow: zod_1.z.boolean().optional(),
    requireMention: zod_1.z.boolean().optional(),
    tools: zod_schema_agent_runtime_js_1.ToolPolicySchema,
    toolsBySender: ToolPolicyBySenderSchema,
    allowBots: zod_1.z.boolean().optional(),
    users: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    systemPrompt: zod_1.z.string().optional(),
  })
  .strict();
exports.SlackThreadSchema = zod_1.z
  .object({
    historyScope: zod_1.z.enum(["thread", "channel"]).optional(),
    inheritParent: zod_1.z.boolean().optional(),
  })
  .strict();
var SlackReplyToModeByChatTypeSchema = zod_1.z
  .object({
    direct: zod_schema_core_js_1.ReplyToModeSchema.optional(),
    group: zod_schema_core_js_1.ReplyToModeSchema.optional(),
    channel: zod_schema_core_js_1.ReplyToModeSchema.optional(),
  })
  .strict();
exports.SlackAccountSchema = zod_1.z
  .object({
    name: zod_1.z.string().optional(),
    mode: zod_1.z.enum(["socket", "http"]).optional(),
    signingSecret: zod_1.z.string().optional(),
    webhookPath: zod_1.z.string().optional(),
    capabilities: zod_1.z.array(zod_1.z.string()).optional(),
    markdown: zod_schema_core_js_1.MarkdownConfigSchema,
    enabled: zod_1.z.boolean().optional(),
    commands: zod_schema_core_js_1.ProviderCommandsSchema,
    configWrites: zod_1.z.boolean().optional(),
    botToken: zod_1.z.string().optional(),
    appToken: zod_1.z.string().optional(),
    userToken: zod_1.z.string().optional(),
    userTokenReadOnly: zod_1.z.boolean().optional().default(true),
    allowBots: zod_1.z.boolean().optional(),
    requireMention: zod_1.z.boolean().optional(),
    groupPolicy: zod_schema_core_js_1.GroupPolicySchema.optional().default("allowlist"),
    historyLimit: zod_1.z.number().int().min(0).optional(),
    dmHistoryLimit: zod_1.z.number().int().min(0).optional(),
    dms: zod_1.z
      .record(zod_1.z.string(), zod_schema_core_js_1.DmConfigSchema.optional())
      .optional(),
    textChunkLimit: zod_1.z.number().int().positive().optional(),
    chunkMode: zod_1.z.enum(["length", "newline"]).optional(),
    blockStreaming: zod_1.z.boolean().optional(),
    blockStreamingCoalesce: zod_schema_core_js_1.BlockStreamingCoalesceSchema.optional(),
    mediaMaxMb: zod_1.z.number().positive().optional(),
    reactionNotifications: zod_1.z.enum(["off", "own", "all", "allowlist"]).optional(),
    reactionAllowlist: zod_1.z
      .array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()]))
      .optional(),
    replyToMode: zod_schema_core_js_1.ReplyToModeSchema.optional(),
    replyToModeByChatType: SlackReplyToModeByChatTypeSchema.optional(),
    thread: exports.SlackThreadSchema.optional(),
    actions: zod_1.z
      .object({
        reactions: zod_1.z.boolean().optional(),
        messages: zod_1.z.boolean().optional(),
        pins: zod_1.z.boolean().optional(),
        search: zod_1.z.boolean().optional(),
        permissions: zod_1.z.boolean().optional(),
        memberInfo: zod_1.z.boolean().optional(),
        channelInfo: zod_1.z.boolean().optional(),
        emojiList: zod_1.z.boolean().optional(),
      })
      .strict()
      .optional(),
    slashCommand: zod_1.z
      .object({
        enabled: zod_1.z.boolean().optional(),
        name: zod_1.z.string().optional(),
        sessionPrefix: zod_1.z.string().optional(),
        ephemeral: zod_1.z.boolean().optional(),
      })
      .strict()
      .optional(),
    dm: exports.SlackDmSchema.optional(),
    channels: zod_1.z.record(zod_1.z.string(), exports.SlackChannelSchema.optional()).optional(),
    heartbeat: zod_schema_channels_js_1.ChannelHeartbeatVisibilitySchema,
  })
  .strict();
exports.SlackConfigSchema = exports.SlackAccountSchema.extend({
  mode: zod_1.z.enum(["socket", "http"]).optional().default("socket"),
  signingSecret: zod_1.z.string().optional(),
  webhookPath: zod_1.z.string().optional().default("/slack/events"),
  accounts: zod_1.z.record(zod_1.z.string(), exports.SlackAccountSchema.optional()).optional(),
}).superRefine(function (value, ctx) {
  var _a, _b, _c;
  var baseMode = (_a = value.mode) !== null && _a !== void 0 ? _a : "socket";
  if (baseMode === "http" && !value.signingSecret) {
    ctx.addIssue({
      code: zod_1.z.ZodIssueCode.custom,
      message: 'channels.slack.mode="http" requires channels.slack.signingSecret',
      path: ["signingSecret"],
    });
  }
  if (!value.accounts) {
    return;
  }
  for (var _i = 0, _d = Object.entries(value.accounts); _i < _d.length; _i++) {
    var _e = _d[_i],
      accountId = _e[0],
      account = _e[1];
    if (!account) {
      continue;
    }
    if (account.enabled === false) {
      continue;
    }
    var accountMode = (_b = account.mode) !== null && _b !== void 0 ? _b : baseMode;
    if (accountMode !== "http") {
      continue;
    }
    var accountSecret =
      (_c = account.signingSecret) !== null && _c !== void 0 ? _c : value.signingSecret;
    if (!accountSecret) {
      ctx.addIssue({
        code: zod_1.z.ZodIssueCode.custom,
        message:
          'channels.slack.accounts.*.mode="http" requires channels.slack.signingSecret or channels.slack.accounts.*.signingSecret',
        path: ["accounts", accountId, "signingSecret"],
      });
    }
  }
});
exports.SignalAccountSchemaBase = zod_1.z
  .object({
    name: zod_1.z.string().optional(),
    capabilities: zod_1.z.array(zod_1.z.string()).optional(),
    markdown: zod_schema_core_js_1.MarkdownConfigSchema,
    enabled: zod_1.z.boolean().optional(),
    configWrites: zod_1.z.boolean().optional(),
    account: zod_1.z.string().optional(),
    httpUrl: zod_1.z.string().optional(),
    httpHost: zod_1.z.string().optional(),
    httpPort: zod_1.z.number().int().positive().optional(),
    cliPath: zod_schema_core_js_1.ExecutableTokenSchema.optional(),
    autoStart: zod_1.z.boolean().optional(),
    startupTimeoutMs: zod_1.z.number().int().min(1000).max(120000).optional(),
    receiveMode: zod_1.z.union([zod_1.z.literal("on-start"), zod_1.z.literal("manual")]).optional(),
    ignoreAttachments: zod_1.z.boolean().optional(),
    ignoreStories: zod_1.z.boolean().optional(),
    sendReadReceipts: zod_1.z.boolean().optional(),
    dmPolicy: zod_schema_core_js_1.DmPolicySchema.optional().default("pairing"),
    allowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    groupAllowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    groupPolicy: zod_schema_core_js_1.GroupPolicySchema.optional().default("allowlist"),
    historyLimit: zod_1.z.number().int().min(0).optional(),
    dmHistoryLimit: zod_1.z.number().int().min(0).optional(),
    dms: zod_1.z
      .record(zod_1.z.string(), zod_schema_core_js_1.DmConfigSchema.optional())
      .optional(),
    textChunkLimit: zod_1.z.number().int().positive().optional(),
    chunkMode: zod_1.z.enum(["length", "newline"]).optional(),
    blockStreaming: zod_1.z.boolean().optional(),
    blockStreamingCoalesce: zod_schema_core_js_1.BlockStreamingCoalesceSchema.optional(),
    mediaMaxMb: zod_1.z.number().int().positive().optional(),
    reactionNotifications: zod_1.z.enum(["off", "own", "all", "allowlist"]).optional(),
    reactionAllowlist: zod_1.z
      .array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()]))
      .optional(),
    actions: zod_1.z
      .object({
        reactions: zod_1.z.boolean().optional(),
      })
      .strict()
      .optional(),
    reactionLevel: zod_1.z.enum(["off", "ack", "minimal", "extensive"]).optional(),
    heartbeat: zod_schema_channels_js_1.ChannelHeartbeatVisibilitySchema,
  })
  .strict();
exports.SignalAccountSchema = exports.SignalAccountSchemaBase.superRefine(function (value, ctx) {
  (0, zod_schema_core_js_1.requireOpenAllowFrom)({
    policy: value.dmPolicy,
    allowFrom: value.allowFrom,
    ctx: ctx,
    path: ["allowFrom"],
    message: 'channels.signal.dmPolicy="open" requires channels.signal.allowFrom to include "*"',
  });
});
exports.SignalConfigSchema = exports.SignalAccountSchemaBase.extend({
  accounts: zod_1.z.record(zod_1.z.string(), exports.SignalAccountSchema.optional()).optional(),
}).superRefine(function (value, ctx) {
  (0, zod_schema_core_js_1.requireOpenAllowFrom)({
    policy: value.dmPolicy,
    allowFrom: value.allowFrom,
    ctx: ctx,
    path: ["allowFrom"],
    message: 'channels.signal.dmPolicy="open" requires channels.signal.allowFrom to include "*"',
  });
});
exports.IMessageAccountSchemaBase = zod_1.z
  .object({
    name: zod_1.z.string().optional(),
    capabilities: zod_1.z.array(zod_1.z.string()).optional(),
    markdown: zod_schema_core_js_1.MarkdownConfigSchema,
    enabled: zod_1.z.boolean().optional(),
    configWrites: zod_1.z.boolean().optional(),
    cliPath: zod_schema_core_js_1.ExecutableTokenSchema.optional(),
    dbPath: zod_1.z.string().optional(),
    remoteHost: zod_1.z.string().optional(),
    service: zod_1.z
      .union([zod_1.z.literal("imessage"), zod_1.z.literal("sms"), zod_1.z.literal("auto")])
      .optional(),
    region: zod_1.z.string().optional(),
    dmPolicy: zod_schema_core_js_1.DmPolicySchema.optional().default("pairing"),
    allowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    groupAllowFrom: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
    groupPolicy: zod_schema_core_js_1.GroupPolicySchema.optional().default("allowlist"),
    historyLimit: zod_1.z.number().int().min(0).optional(),
    dmHistoryLimit: zod_1.z.number().int().min(0).optional(),
    dms: zod_1.z
      .record(zod_1.z.string(), zod_schema_core_js_1.DmConfigSchema.optional())
      .optional(),
    includeAttachments: zod_1.z.boolean().optional(),
    mediaMaxMb: zod_1.z.number().int().positive().optional(),
    textChunkLimit: zod_1.z.number().int().positive().optional(),
    chunkMode: zod_1.z.enum(["length", "newline"]).optional(),
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
    heartbeat: zod_schema_channels_js_1.ChannelHeartbeatVisibilitySchema,
  })
  .strict();
exports.IMessageAccountSchema = exports.IMessageAccountSchemaBase.superRefine(
  function (value, ctx) {
    (0, zod_schema_core_js_1.requireOpenAllowFrom)({
      policy: value.dmPolicy,
      allowFrom: value.allowFrom,
      ctx: ctx,
      path: ["allowFrom"],
      message:
        'channels.imessage.dmPolicy="open" requires channels.imessage.allowFrom to include "*"',
    });
  },
);
exports.IMessageConfigSchema = exports.IMessageAccountSchemaBase.extend({
  accounts: zod_1.z.record(zod_1.z.string(), exports.IMessageAccountSchema.optional()).optional(),
}).superRefine(function (value, ctx) {
  (0, zod_schema_core_js_1.requireOpenAllowFrom)({
    policy: value.dmPolicy,
    allowFrom: value.allowFrom,
    ctx: ctx,
    path: ["allowFrom"],
    message:
      'channels.imessage.dmPolicy="open" requires channels.imessage.allowFrom to include "*"',
  });
});
var BlueBubblesAllowFromEntry = zod_1.z.union([zod_1.z.string(), zod_1.z.number()]);
var BlueBubblesActionSchema = zod_1.z
  .object({
    reactions: zod_1.z.boolean().optional(),
    edit: zod_1.z.boolean().optional(),
    unsend: zod_1.z.boolean().optional(),
    reply: zod_1.z.boolean().optional(),
    sendWithEffect: zod_1.z.boolean().optional(),
    renameGroup: zod_1.z.boolean().optional(),
    setGroupIcon: zod_1.z.boolean().optional(),
    addParticipant: zod_1.z.boolean().optional(),
    removeParticipant: zod_1.z.boolean().optional(),
    leaveGroup: zod_1.z.boolean().optional(),
    sendAttachment: zod_1.z.boolean().optional(),
  })
  .strict()
  .optional();
var BlueBubblesGroupConfigSchema = zod_1.z
  .object({
    requireMention: zod_1.z.boolean().optional(),
    tools: zod_schema_agent_runtime_js_1.ToolPolicySchema,
    toolsBySender: ToolPolicyBySenderSchema,
  })
  .strict();
exports.BlueBubblesAccountSchemaBase = zod_1.z
  .object({
    name: zod_1.z.string().optional(),
    capabilities: zod_1.z.array(zod_1.z.string()).optional(),
    markdown: zod_schema_core_js_1.MarkdownConfigSchema,
    configWrites: zod_1.z.boolean().optional(),
    enabled: zod_1.z.boolean().optional(),
    serverUrl: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    webhookPath: zod_1.z.string().optional(),
    dmPolicy: zod_schema_core_js_1.DmPolicySchema.optional().default("pairing"),
    allowFrom: zod_1.z.array(BlueBubblesAllowFromEntry).optional(),
    groupAllowFrom: zod_1.z.array(BlueBubblesAllowFromEntry).optional(),
    groupPolicy: zod_schema_core_js_1.GroupPolicySchema.optional().default("allowlist"),
    historyLimit: zod_1.z.number().int().min(0).optional(),
    dmHistoryLimit: zod_1.z.number().int().min(0).optional(),
    dms: zod_1.z
      .record(zod_1.z.string(), zod_schema_core_js_1.DmConfigSchema.optional())
      .optional(),
    textChunkLimit: zod_1.z.number().int().positive().optional(),
    chunkMode: zod_1.z.enum(["length", "newline"]).optional(),
    mediaMaxMb: zod_1.z.number().int().positive().optional(),
    sendReadReceipts: zod_1.z.boolean().optional(),
    blockStreaming: zod_1.z.boolean().optional(),
    blockStreamingCoalesce: zod_schema_core_js_1.BlockStreamingCoalesceSchema.optional(),
    groups: zod_1.z.record(zod_1.z.string(), BlueBubblesGroupConfigSchema.optional()).optional(),
    heartbeat: zod_schema_channels_js_1.ChannelHeartbeatVisibilitySchema,
  })
  .strict();
exports.BlueBubblesAccountSchema = exports.BlueBubblesAccountSchemaBase.superRefine(
  function (value, ctx) {
    (0, zod_schema_core_js_1.requireOpenAllowFrom)({
      policy: value.dmPolicy,
      allowFrom: value.allowFrom,
      ctx: ctx,
      path: ["allowFrom"],
      message: 'channels.bluebubbles.accounts.*.dmPolicy="open" requires allowFrom to include "*"',
    });
  },
);
exports.BlueBubblesConfigSchema = exports.BlueBubblesAccountSchemaBase.extend({
  accounts: zod_1.z
    .record(zod_1.z.string(), exports.BlueBubblesAccountSchema.optional())
    .optional(),
  actions: BlueBubblesActionSchema,
}).superRefine(function (value, ctx) {
  (0, zod_schema_core_js_1.requireOpenAllowFrom)({
    policy: value.dmPolicy,
    allowFrom: value.allowFrom,
    ctx: ctx,
    path: ["allowFrom"],
    message:
      'channels.bluebubbles.dmPolicy="open" requires channels.bluebubbles.allowFrom to include "*"',
  });
});
exports.MSTeamsChannelSchema = zod_1.z
  .object({
    requireMention: zod_1.z.boolean().optional(),
    tools: zod_schema_agent_runtime_js_1.ToolPolicySchema,
    toolsBySender: ToolPolicyBySenderSchema,
    replyStyle: zod_schema_core_js_1.MSTeamsReplyStyleSchema.optional(),
  })
  .strict();
exports.MSTeamsTeamSchema = zod_1.z
  .object({
    requireMention: zod_1.z.boolean().optional(),
    tools: zod_schema_agent_runtime_js_1.ToolPolicySchema,
    toolsBySender: ToolPolicyBySenderSchema,
    replyStyle: zod_schema_core_js_1.MSTeamsReplyStyleSchema.optional(),
    channels: zod_1.z.record(zod_1.z.string(), exports.MSTeamsChannelSchema.optional()).optional(),
  })
  .strict();
exports.MSTeamsConfigSchema = zod_1.z
  .object({
    enabled: zod_1.z.boolean().optional(),
    capabilities: zod_1.z.array(zod_1.z.string()).optional(),
    markdown: zod_schema_core_js_1.MarkdownConfigSchema,
    configWrites: zod_1.z.boolean().optional(),
    appId: zod_1.z.string().optional(),
    appPassword: zod_1.z.string().optional(),
    tenantId: zod_1.z.string().optional(),
    webhook: zod_1.z
      .object({
        port: zod_1.z.number().int().positive().optional(),
        path: zod_1.z.string().optional(),
      })
      .strict()
      .optional(),
    dmPolicy: zod_schema_core_js_1.DmPolicySchema.optional().default("pairing"),
    allowFrom: zod_1.z.array(zod_1.z.string()).optional(),
    groupAllowFrom: zod_1.z.array(zod_1.z.string()).optional(),
    groupPolicy: zod_schema_core_js_1.GroupPolicySchema.optional().default("allowlist"),
    textChunkLimit: zod_1.z.number().int().positive().optional(),
    chunkMode: zod_1.z.enum(["length", "newline"]).optional(),
    blockStreamingCoalesce: zod_schema_core_js_1.BlockStreamingCoalesceSchema.optional(),
    mediaAllowHosts: zod_1.z.array(zod_1.z.string()).optional(),
    requireMention: zod_1.z.boolean().optional(),
    historyLimit: zod_1.z.number().int().min(0).optional(),
    dmHistoryLimit: zod_1.z.number().int().min(0).optional(),
    dms: zod_1.z
      .record(zod_1.z.string(), zod_schema_core_js_1.DmConfigSchema.optional())
      .optional(),
    replyStyle: zod_schema_core_js_1.MSTeamsReplyStyleSchema.optional(),
    teams: zod_1.z.record(zod_1.z.string(), exports.MSTeamsTeamSchema.optional()).optional(),
    /** Max media size in MB (default: 100MB for OneDrive upload support). */
    mediaMaxMb: zod_1.z.number().positive().optional(),
    /** SharePoint site ID for file uploads in group chats/channels (e.g., "contoso.sharepoint.com,guid1,guid2") */
    sharePointSiteId: zod_1.z.string().optional(),
    heartbeat: zod_schema_channels_js_1.ChannelHeartbeatVisibilitySchema,
  })
  .strict()
  .superRefine(function (value, ctx) {
    (0, zod_schema_core_js_1.requireOpenAllowFrom)({
      policy: value.dmPolicy,
      allowFrom: value.allowFrom,
      ctx: ctx,
      path: ["allowFrom"],
      message:
        'channels.msteams.dmPolicy="open" requires channels.msteams.allowFrom to include "*"',
    });
  });
