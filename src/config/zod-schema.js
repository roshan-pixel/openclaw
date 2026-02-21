"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenClawSchema = void 0;
var zod_1 = require("zod");
var zod_schema_agent_runtime_js_1 = require("./zod-schema.agent-runtime.js");
var zod_schema_approvals_js_1 = require("./zod-schema.approvals.js");
var zod_schema_agents_js_1 = require("./zod-schema.agents.js");
var zod_schema_core_js_1 = require("./zod-schema.core.js");
var zod_schema_hooks_js_1 = require("./zod-schema.hooks.js");
var zod_schema_providers_js_1 = require("./zod-schema.providers.js");
var zod_schema_session_js_1 = require("./zod-schema.session.js");
var BrowserSnapshotDefaultsSchema = zod_1.z
  .object({
    mode: zod_1.z.literal("efficient").optional(),
  })
  .strict()
  .optional();
var NodeHostSchema = zod_1.z
  .object({
    browserProxy: zod_1.z
      .object({
        enabled: zod_1.z.boolean().optional(),
        allowProfiles: zod_1.z.array(zod_1.z.string()).optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .optional();
exports.OpenClawSchema = zod_1.z
  .object({
    meta: zod_1.z
      .object({
        lastTouchedVersion: zod_1.z.string().optional(),
        lastTouchedAt: zod_1.z.string().optional(),
      })
      .strict()
      .optional(),
    env: zod_1.z
      .object({
        shellEnv: zod_1.z
          .object({
            enabled: zod_1.z.boolean().optional(),
            timeoutMs: zod_1.z.number().int().nonnegative().optional(),
          })
          .strict()
          .optional(),
        vars: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
      })
      .catchall(zod_1.z.string())
      .optional(),
    wizard: zod_1.z
      .object({
        lastRunAt: zod_1.z.string().optional(),
        lastRunVersion: zod_1.z.string().optional(),
        lastRunCommit: zod_1.z.string().optional(),
        lastRunCommand: zod_1.z.string().optional(),
        lastRunMode: zod_1.z
          .union([zod_1.z.literal("local"), zod_1.z.literal("remote")])
          .optional(),
      })
      .strict()
      .optional(),
    diagnostics: zod_1.z
      .object({
        enabled: zod_1.z.boolean().optional(),
        flags: zod_1.z.array(zod_1.z.string()).optional(),
        otel: zod_1.z
          .object({
            enabled: zod_1.z.boolean().optional(),
            endpoint: zod_1.z.string().optional(),
            protocol: zod_1.z
              .union([zod_1.z.literal("http/protobuf"), zod_1.z.literal("grpc")])
              .optional(),
            headers: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
            serviceName: zod_1.z.string().optional(),
            traces: zod_1.z.boolean().optional(),
            metrics: zod_1.z.boolean().optional(),
            logs: zod_1.z.boolean().optional(),
            sampleRate: zod_1.z.number().min(0).max(1).optional(),
            flushIntervalMs: zod_1.z.number().int().nonnegative().optional(),
          })
          .strict()
          .optional(),
        cacheTrace: zod_1.z
          .object({
            enabled: zod_1.z.boolean().optional(),
            filePath: zod_1.z.string().optional(),
            includeMessages: zod_1.z.boolean().optional(),
            includePrompt: zod_1.z.boolean().optional(),
            includeSystem: zod_1.z.boolean().optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    logging: zod_1.z
      .object({
        level: zod_1.z
          .union([
            zod_1.z.literal("silent"),
            zod_1.z.literal("fatal"),
            zod_1.z.literal("error"),
            zod_1.z.literal("warn"),
            zod_1.z.literal("info"),
            zod_1.z.literal("debug"),
            zod_1.z.literal("trace"),
          ])
          .optional(),
        file: zod_1.z.string().optional(),
        consoleLevel: zod_1.z
          .union([
            zod_1.z.literal("silent"),
            zod_1.z.literal("fatal"),
            zod_1.z.literal("error"),
            zod_1.z.literal("warn"),
            zod_1.z.literal("info"),
            zod_1.z.literal("debug"),
            zod_1.z.literal("trace"),
          ])
          .optional(),
        consoleStyle: zod_1.z
          .union([zod_1.z.literal("pretty"), zod_1.z.literal("compact"), zod_1.z.literal("json")])
          .optional(),
        redactSensitive: zod_1.z
          .union([zod_1.z.literal("off"), zod_1.z.literal("tools")])
          .optional(),
        redactPatterns: zod_1.z.array(zod_1.z.string()).optional(),
      })
      .strict()
      .optional(),
    update: zod_1.z
      .object({
        channel: zod_1.z
          .union([zod_1.z.literal("stable"), zod_1.z.literal("beta"), zod_1.z.literal("dev")])
          .optional(),
        checkOnStart: zod_1.z.boolean().optional(),
      })
      .strict()
      .optional(),
    browser: zod_1.z
      .object({
        enabled: zod_1.z.boolean().optional(),
        evaluateEnabled: zod_1.z.boolean().optional(),
        cdpUrl: zod_1.z.string().optional(),
        remoteCdpTimeoutMs: zod_1.z.number().int().nonnegative().optional(),
        remoteCdpHandshakeTimeoutMs: zod_1.z.number().int().nonnegative().optional(),
        color: zod_1.z.string().optional(),
        executablePath: zod_1.z.string().optional(),
        headless: zod_1.z.boolean().optional(),
        noSandbox: zod_1.z.boolean().optional(),
        attachOnly: zod_1.z.boolean().optional(),
        defaultProfile: zod_1.z.string().optional(),
        snapshotDefaults: BrowserSnapshotDefaultsSchema,
        profiles: zod_1.z
          .record(
            zod_1.z
              .string()
              .regex(/^[a-z0-9-]+$/, "Profile names must be alphanumeric with hyphens only"),
            zod_1.z
              .object({
                cdpPort: zod_1.z.number().int().min(1).max(65535).optional(),
                cdpUrl: zod_1.z.string().optional(),
                driver: zod_1.z
                  .union([zod_1.z.literal("openclaw"), zod_1.z.literal("extension")])
                  .optional(),
                color: zod_schema_core_js_1.HexColorSchema,
              })
              .strict()
              .refine(
                function (value) {
                  return value.cdpPort || value.cdpUrl;
                },
                {
                  message: "Profile must set cdpPort or cdpUrl",
                },
              ),
          )
          .optional(),
      })
      .strict()
      .optional(),
    ui: zod_1.z
      .object({
        seamColor: zod_schema_core_js_1.HexColorSchema.optional(),
        assistant: zod_1.z
          .object({
            name: zod_1.z.string().max(50).optional(),
            avatar: zod_1.z.string().max(200).optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    auth: zod_1.z
      .object({
        profiles: zod_1.z
          .record(
            zod_1.z.string(),
            zod_1.z
              .object({
                provider: zod_1.z.string(),
                mode: zod_1.z.union([
                  zod_1.z.literal("api_key"),
                  zod_1.z.literal("oauth"),
                  zod_1.z.literal("token"),
                ]),
                email: zod_1.z.string().optional(),
              })
              .strict(),
          )
          .optional(),
        order: zod_1.z.record(zod_1.z.string(), zod_1.z.array(zod_1.z.string())).optional(),
        cooldowns: zod_1.z
          .object({
            billingBackoffHours: zod_1.z.number().positive().optional(),
            billingBackoffHoursByProvider: zod_1.z
              .record(zod_1.z.string(), zod_1.z.number().positive())
              .optional(),
            billingMaxHours: zod_1.z.number().positive().optional(),
            failureWindowHours: zod_1.z.number().positive().optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    models: zod_schema_core_js_1.ModelsConfigSchema,
    nodeHost: NodeHostSchema,
    agents: zod_schema_agents_js_1.AgentsSchema,
    tools: zod_schema_agent_runtime_js_1.ToolsSchema,
    bindings: zod_schema_agents_js_1.BindingsSchema,
    broadcast: zod_schema_agents_js_1.BroadcastSchema,
    audio: zod_schema_agents_js_1.AudioSchema,
    media: zod_1.z
      .object({
        preserveFilenames: zod_1.z.boolean().optional(),
      })
      .strict()
      .optional(),
    messages: zod_schema_session_js_1.MessagesSchema,
    commands: zod_schema_session_js_1.CommandsSchema,
    approvals: zod_schema_approvals_js_1.ApprovalsSchema,
    session: zod_schema_session_js_1.SessionSchema,
    cron: zod_1.z
      .object({
        enabled: zod_1.z.boolean().optional(),
        store: zod_1.z.string().optional(),
        maxConcurrentRuns: zod_1.z.number().int().positive().optional(),
      })
      .strict()
      .optional(),
    hooks: zod_1.z
      .object({
        enabled: zod_1.z.boolean().optional(),
        path: zod_1.z.string().optional(),
        token: zod_1.z.string().optional(),
        maxBodyBytes: zod_1.z.number().int().positive().optional(),
        presets: zod_1.z.array(zod_1.z.string()).optional(),
        transformsDir: zod_1.z.string().optional(),
        mappings: zod_1.z.array(zod_schema_hooks_js_1.HookMappingSchema).optional(),
        gmail: zod_schema_hooks_js_1.HooksGmailSchema,
        internal: zod_schema_hooks_js_1.InternalHooksSchema,
      })
      .strict()
      .optional(),
    web: zod_1.z
      .object({
        enabled: zod_1.z.boolean().optional(),
        heartbeatSeconds: zod_1.z.number().int().positive().optional(),
        reconnect: zod_1.z
          .object({
            initialMs: zod_1.z.number().positive().optional(),
            maxMs: zod_1.z.number().positive().optional(),
            factor: zod_1.z.number().positive().optional(),
            jitter: zod_1.z.number().min(0).max(1).optional(),
            maxAttempts: zod_1.z.number().int().min(0).optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    channels: zod_schema_providers_js_1.ChannelsSchema,
    discovery: zod_1.z
      .object({
        wideArea: zod_1.z
          .object({
            enabled: zod_1.z.boolean().optional(),
            domain: zod_1.z.string().optional(),
          })
          .strict()
          .optional(),
        mdns: zod_1.z
          .object({
            mode: zod_1.z.enum(["off", "minimal", "full"]).optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    canvasHost: zod_1.z
      .object({
        enabled: zod_1.z.boolean().optional(),
        root: zod_1.z.string().optional(),
        port: zod_1.z.number().int().positive().optional(),
        liveReload: zod_1.z.boolean().optional(),
      })
      .strict()
      .optional(),
    talk: zod_1.z
      .object({
        voiceId: zod_1.z.string().optional(),
        voiceAliases: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
        modelId: zod_1.z.string().optional(),
        outputFormat: zod_1.z.string().optional(),
        apiKey: zod_1.z.string().optional(),
        interruptOnSpeech: zod_1.z.boolean().optional(),
      })
      .strict()
      .optional(),
    gateway: zod_1.z
      .object({
        port: zod_1.z.number().int().positive().optional(),
        mode: zod_1.z.union([zod_1.z.literal("local"), zod_1.z.literal("remote")]).optional(),
        bind: zod_1.z
          .union([
            zod_1.z.literal("auto"),
            zod_1.z.literal("lan"),
            zod_1.z.literal("loopback"),
            zod_1.z.literal("custom"),
            zod_1.z.literal("tailnet"),
          ])
          .optional(),
        controlUi: zod_1.z
          .object({
            enabled: zod_1.z.boolean().optional(),
            basePath: zod_1.z.string().optional(),
            allowInsecureAuth: zod_1.z.boolean().optional(),
            dangerouslyDisableDeviceAuth: zod_1.z.boolean().optional(),
          })
          .strict()
          .optional(),
        auth: zod_1.z
          .object({
            mode: zod_1.z.union([zod_1.z.literal("token"), zod_1.z.literal("password")]).optional(),
            token: zod_1.z.string().optional(),
            password: zod_1.z.string().optional(),
            allowTailscale: zod_1.z.boolean().optional(),
          })
          .strict()
          .optional(),
        trustedProxies: zod_1.z.array(zod_1.z.string()).optional(),
        tailscale: zod_1.z
          .object({
            mode: zod_1.z
              .union([zod_1.z.literal("off"), zod_1.z.literal("serve"), zod_1.z.literal("funnel")])
              .optional(),
            resetOnExit: zod_1.z.boolean().optional(),
          })
          .strict()
          .optional(),
        remote: zod_1.z
          .object({
            url: zod_1.z.string().optional(),
            transport: zod_1.z
              .union([zod_1.z.literal("ssh"), zod_1.z.literal("direct")])
              .optional(),
            token: zod_1.z.string().optional(),
            password: zod_1.z.string().optional(),
            tlsFingerprint: zod_1.z.string().optional(),
            sshTarget: zod_1.z.string().optional(),
            sshIdentity: zod_1.z.string().optional(),
          })
          .strict()
          .optional(),
        reload: zod_1.z
          .object({
            mode: zod_1.z
              .union([
                zod_1.z.literal("off"),
                zod_1.z.literal("restart"),
                zod_1.z.literal("hot"),
                zod_1.z.literal("hybrid"),
              ])
              .optional(),
            debounceMs: zod_1.z.number().int().min(0).optional(),
          })
          .strict()
          .optional(),
        tls: zod_1.z
          .object({
            enabled: zod_1.z.boolean().optional(),
            autoGenerate: zod_1.z.boolean().optional(),
            certPath: zod_1.z.string().optional(),
            keyPath: zod_1.z.string().optional(),
            caPath: zod_1.z.string().optional(),
          })
          .optional(),
        http: zod_1.z
          .object({
            endpoints: zod_1.z
              .object({
                chatCompletions: zod_1.z
                  .object({
                    enabled: zod_1.z.boolean().optional(),
                  })
                  .strict()
                  .optional(),
                responses: zod_1.z
                  .object({
                    enabled: zod_1.z.boolean().optional(),
                    maxBodyBytes: zod_1.z.number().int().positive().optional(),
                    files: zod_1.z
                      .object({
                        allowUrl: zod_1.z.boolean().optional(),
                        allowedMimes: zod_1.z.array(zod_1.z.string()).optional(),
                        maxBytes: zod_1.z.number().int().positive().optional(),
                        maxChars: zod_1.z.number().int().positive().optional(),
                        maxRedirects: zod_1.z.number().int().nonnegative().optional(),
                        timeoutMs: zod_1.z.number().int().positive().optional(),
                        pdf: zod_1.z
                          .object({
                            maxPages: zod_1.z.number().int().positive().optional(),
                            maxPixels: zod_1.z.number().int().positive().optional(),
                            minTextChars: zod_1.z.number().int().nonnegative().optional(),
                          })
                          .strict()
                          .optional(),
                      })
                      .strict()
                      .optional(),
                    images: zod_1.z
                      .object({
                        allowUrl: zod_1.z.boolean().optional(),
                        allowedMimes: zod_1.z.array(zod_1.z.string()).optional(),
                        maxBytes: zod_1.z.number().int().positive().optional(),
                        maxRedirects: zod_1.z.number().int().nonnegative().optional(),
                        timeoutMs: zod_1.z.number().int().positive().optional(),
                      })
                      .strict()
                      .optional(),
                  })
                  .strict()
                  .optional(),
              })
              .strict()
              .optional(),
          })
          .strict()
          .optional(),
        nodes: zod_1.z
          .object({
            browser: zod_1.z
              .object({
                mode: zod_1.z
                  .union([
                    zod_1.z.literal("auto"),
                    zod_1.z.literal("manual"),
                    zod_1.z.literal("off"),
                  ])
                  .optional(),
                node: zod_1.z.string().optional(),
              })
              .strict()
              .optional(),
            allowCommands: zod_1.z.array(zod_1.z.string()).optional(),
            denyCommands: zod_1.z.array(zod_1.z.string()).optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    skills: zod_1.z
      .object({
        allowBundled: zod_1.z.array(zod_1.z.string()).optional(),
        load: zod_1.z
          .object({
            extraDirs: zod_1.z.array(zod_1.z.string()).optional(),
            watch: zod_1.z.boolean().optional(),
            watchDebounceMs: zod_1.z.number().int().min(0).optional(),
          })
          .strict()
          .optional(),
        install: zod_1.z
          .object({
            preferBrew: zod_1.z.boolean().optional(),
            nodeManager: zod_1.z
              .union([
                zod_1.z.literal("npm"),
                zod_1.z.literal("pnpm"),
                zod_1.z.literal("yarn"),
                zod_1.z.literal("bun"),
              ])
              .optional(),
          })
          .strict()
          .optional(),
        entries: zod_1.z
          .record(
            zod_1.z.string(),
            zod_1.z
              .object({
                enabled: zod_1.z.boolean().optional(),
                apiKey: zod_1.z.string().optional(),
                env: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
                config: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
              })
              .strict(),
          )
          .optional(),
      })
      .strict()
      .optional(),
    plugins: zod_1.z
      .object({
        enabled: zod_1.z.boolean().optional(),
        allow: zod_1.z.array(zod_1.z.string()).optional(),
        deny: zod_1.z.array(zod_1.z.string()).optional(),
        load: zod_1.z
          .object({
            paths: zod_1.z.array(zod_1.z.string()).optional(),
          })
          .strict()
          .optional(),
        slots: zod_1.z
          .object({
            memory: zod_1.z.string().optional(),
          })
          .strict()
          .optional(),
        entries: zod_1.z
          .record(
            zod_1.z.string(),
            zod_1.z
              .object({
                enabled: zod_1.z.boolean().optional(),
                config: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
              })
              .strict(),
          )
          .optional(),
        installs: zod_1.z
          .record(
            zod_1.z.string(),
            zod_1.z
              .object({
                source: zod_1.z.union([
                  zod_1.z.literal("npm"),
                  zod_1.z.literal("archive"),
                  zod_1.z.literal("path"),
                ]),
                spec: zod_1.z.string().optional(),
                sourcePath: zod_1.z.string().optional(),
                installPath: zod_1.z.string().optional(),
                version: zod_1.z.string().optional(),
                installedAt: zod_1.z.string().optional(),
              })
              .strict(),
          )
          .optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .superRefine(function (cfg, ctx) {
    var _a, _b;
    var agents =
      (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.list) !== null &&
      _b !== void 0
        ? _b
        : [];
    if (agents.length === 0) {
      return;
    }
    var agentIds = new Set(
      agents.map(function (agent) {
        return agent.id;
      }),
    );
    var broadcast = cfg.broadcast;
    if (!broadcast) {
      return;
    }
    for (var _i = 0, _c = Object.entries(broadcast); _i < _c.length; _i++) {
      var _d = _c[_i],
        peerId = _d[0],
        ids = _d[1];
      if (peerId === "strategy") {
        continue;
      }
      if (!Array.isArray(ids)) {
        continue;
      }
      for (var idx = 0; idx < ids.length; idx += 1) {
        var agentId = ids[idx];
        if (!agentIds.has(agentId)) {
          ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["broadcast", peerId, idx],
            message: 'Unknown agent id "'.concat(agentId, '" (not in agents.list).'),
          });
        }
      }
    }
  });
