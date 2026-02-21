"use strict";
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAgentSystemPrompt = buildAgentSystemPrompt;
exports.buildRuntimeLine = buildRuntimeLine;
var tokens_js_1 = require("../auto-reply/tokens.js");
var message_channel_js_1 = require("../utils/message-channel.js");
function buildSkillsSection(params) {
  var _a;
  if (params.isMinimal) {
    return [];
  }
  var trimmed = (_a = params.skillsPrompt) === null || _a === void 0 ? void 0 : _a.trim();
  if (!trimmed) {
    return [];
  }
  return [
    "## Skills (mandatory)",
    "Before replying: scan <available_skills> <description> entries.",
    "- If exactly one skill clearly applies: read its SKILL.md at <location> with `".concat(
      params.readToolName,
      "`, then follow it.",
    ),
    "- If multiple could apply: choose the most specific one, then read/follow it.",
    "- If none clearly apply: do not read any SKILL.md.",
    "Constraints: never read more than one skill up front; only read after selecting.",
    trimmed,
    "",
  ];
}
function buildMemorySection(params) {
  if (params.isMinimal) {
    return [];
  }
  if (!params.availableTools.has("memory_search") && !params.availableTools.has("memory_get")) {
    return [];
  }
  return [
    "## Memory Recall",
    "Before answering anything about prior work, decisions, dates, people, preferences, or todos: run memory_search on MEMORY.md + memory/*.md; then use memory_get to pull only the needed lines. If low confidence after search, say you checked.",
    "",
  ];
}
function buildUserIdentitySection(ownerLine, isMinimal) {
  if (!ownerLine || isMinimal) {
    return [];
  }
  return ["## User Identity", ownerLine, ""];
}
function buildTimeSection(params) {
  if (!params.userTimezone) {
    return [];
  }
  return ["## Current Date & Time", "Time zone: ".concat(params.userTimezone), ""];
}
function buildReplyTagsSection(isMinimal) {
  if (isMinimal) {
    return [];
  }
  return [
    "## Reply Tags",
    "To request a native reply/quote on supported surfaces, include one tag in your reply:",
    "- [[reply_to_current]] replies to the triggering message.",
    "- [[reply_to:<id>]] replies to a specific message id when you have it.",
    "Whitespace inside the tag is allowed (e.g. [[ reply_to_current ]] / [[ reply_to: 123 ]]).",
    "Tags are stripped before sending; support depends on the current channel config.",
    "",
  ];
}
function buildMessagingSection(params) {
  var _a;
  if (params.isMinimal) {
    return [];
  }
  return [
    "## Messaging",
    "- Reply in current session → automatically routes to the source channel (Signal, Telegram, etc.)",
    "- Cross-session messaging → use sessions_send(sessionKey, message)",
    "- Never use exec/curl for provider messaging; OpenClaw handles all routing internally.",
    params.availableTools.has("message")
      ? __spreadArray(
          [
            "",
            "### message tool",
            "- Use `message` for proactive sends + channel actions (polls, reactions, etc.).",
            "- For `action=send`, include `to` and `message`.",
            "- If multiple channels are configured, pass `channel` (".concat(
              params.messageChannelOptions,
              ").",
            ),
            "- If you use `message` (`action=send`) to deliver your user-visible reply, respond with ONLY: ".concat(
              tokens_js_1.SILENT_REPLY_TOKEN,
              " (avoid duplicate replies).",
            ),
            params.inlineButtonsEnabled
              ? "- Inline buttons supported. Use `action=send` with `buttons=[[{text,callback_data}]]` (callback_data routes back as a user message)."
              : params.runtimeChannel
                ? "- Inline buttons not enabled for "
                    .concat(params.runtimeChannel, ". If you need them, ask to set ")
                    .concat(
                      params.runtimeChannel,
                      '.capabilities.inlineButtons ("dm"|"group"|"all"|"allowlist").',
                    )
                : "",
          ],
          (_a = params.messageToolHints) !== null && _a !== void 0 ? _a : [],
          true,
        )
          .filter(Boolean)
          .join("\n")
      : "",
    "",
  ];
}
function buildVoiceSection(params) {
  var _a;
  if (params.isMinimal) {
    return [];
  }
  var hint = (_a = params.ttsHint) === null || _a === void 0 ? void 0 : _a.trim();
  if (!hint) {
    return [];
  }
  return ["## Voice (TTS)", hint, ""];
}
function buildDocsSection(params) {
  var _a;
  var docsPath = (_a = params.docsPath) === null || _a === void 0 ? void 0 : _a.trim();
  if (!docsPath || params.isMinimal) {
    return [];
  }
  return [
    "## Documentation",
    "OpenClaw docs: ".concat(docsPath),
    "Mirror: https://docs.openclaw.ai",
    "Source: https://github.com/openclaw/openclaw",
    "Community: https://discord.com/invite/clawd",
    "Find new skills: https://clawhub.com",
    "For OpenClaw behavior, commands, config, or architecture: consult local docs first.",
    "When diagnosing issues, run `openclaw status` yourself when possible; only ask the user if you lack access (e.g., sandboxed).",
    "",
  ];
}
function buildAgentSystemPrompt(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
  var coreToolSummaries = {
    read: "Read file contents",
    write: "Create or overwrite files",
    edit: "Make precise edits to files",
    apply_patch: "Apply multi-file patches",
    grep: "Search file contents for patterns",
    find: "Find files by glob pattern",
    ls: "List directory contents",
    exec: "Run shell commands (pty available for TTY-required CLIs)",
    process: "Manage background exec sessions",
    web_search: "Search the web (Brave API)",
    web_fetch: "Fetch and extract readable content from a URL",
    // Channel docking: add login tools here when a channel needs interactive linking.
    browser: "Control web browser",
    canvas: "Present/eval/snapshot the Canvas",
    nodes: "List/describe/notify/camera/screen on paired nodes",
    cron: "Manage cron jobs and wake events (use for reminders; when scheduling a reminder, write the systemEvent text as something that will read like a reminder when it fires, and mention that it is a reminder depending on the time gap between setting and firing; include recent context in reminder text if appropriate)",
    message: "Send messages and channel actions",
    gateway: "Restart, apply config, or run updates on the running OpenClaw process",
    agents_list: "List agent ids allowed for sessions_spawn",
    sessions_list: "List other sessions (incl. sub-agents) with filters/last",
    sessions_history: "Fetch history for another session/sub-agent",
    sessions_send: "Send a message to another session/sub-agent",
    sessions_spawn: "Spawn a sub-agent session",
    session_status:
      "Show a /status-equivalent status card (usage + time + Reasoning/Verbose/Elevated); use for model-use questions (📊 session_status); optional per-session model override",
    image: "Analyze an image with the configured image model",
  };
  var toolOrder = [
    "read",
    "write",
    "edit",
    "apply_patch",
    "grep",
    "find",
    "ls",
    "exec",
    "process",
    "web_search",
    "web_fetch",
    "browser",
    "canvas",
    "nodes",
    "cron",
    "message",
    "gateway",
    "agents_list",
    "sessions_list",
    "sessions_history",
    "sessions_send",
    "session_status",
    "image",
  ];
  var rawToolNames = ((_a = params.toolNames) !== null && _a !== void 0 ? _a : []).map(
    function (tool) {
      return tool.trim();
    },
  );
  var canonicalToolNames = rawToolNames.filter(Boolean);
  // Preserve caller casing while deduping tool names by lowercase.
  var canonicalByNormalized = new Map();
  for (
    var _i = 0, canonicalToolNames_1 = canonicalToolNames;
    _i < canonicalToolNames_1.length;
    _i++
  ) {
    var name_1 = canonicalToolNames_1[_i];
    var normalized = name_1.toLowerCase();
    if (!canonicalByNormalized.has(normalized)) {
      canonicalByNormalized.set(normalized, name_1);
    }
  }
  var resolveToolName = function (normalized) {
    var _a;
    return (_a = canonicalByNormalized.get(normalized)) !== null && _a !== void 0 ? _a : normalized;
  };
  var normalizedTools = canonicalToolNames.map(function (tool) {
    return tool.toLowerCase();
  });
  var availableTools = new Set(normalizedTools);
  var externalToolSummaries = new Map();
  for (
    var _x = 0,
      _y = Object.entries((_b = params.toolSummaries) !== null && _b !== void 0 ? _b : {});
    _x < _y.length;
    _x++
  ) {
    var _z = _y[_x],
      key = _z[0],
      value = _z[1];
    var normalized = key.trim().toLowerCase();
    if (!normalized || !(value === null || value === void 0 ? void 0 : value.trim())) {
      continue;
    }
    externalToolSummaries.set(normalized, value.trim());
  }
  var extraTools = Array.from(
    new Set(
      normalizedTools.filter(function (tool) {
        return !toolOrder.includes(tool);
      }),
    ),
  );
  var enabledTools = toolOrder.filter(function (tool) {
    return availableTools.has(tool);
  });
  var toolLines = enabledTools.map(function (tool) {
    var _a;
    var summary =
      (_a = coreToolSummaries[tool]) !== null && _a !== void 0
        ? _a
        : externalToolSummaries.get(tool);
    var name = resolveToolName(tool);
    return summary ? "- ".concat(name, ": ").concat(summary) : "- ".concat(name);
  });
  for (var _0 = 0, _1 = extraTools.toSorted(); _0 < _1.length; _0++) {
    var tool = _1[_0];
    var summary =
      (_c = coreToolSummaries[tool]) !== null && _c !== void 0
        ? _c
        : externalToolSummaries.get(tool);
    var name_2 = resolveToolName(tool);
    toolLines.push(summary ? "- ".concat(name_2, ": ").concat(summary) : "- ".concat(name_2));
  }
  var hasGateway = availableTools.has("gateway");
  var readToolName = resolveToolName("read");
  var execToolName = resolveToolName("exec");
  var processToolName = resolveToolName("process");
  var extraSystemPrompt =
    (_d = params.extraSystemPrompt) === null || _d === void 0 ? void 0 : _d.trim();
  var ownerNumbers = ((_e = params.ownerNumbers) !== null && _e !== void 0 ? _e : [])
    .map(function (value) {
      return value.trim();
    })
    .filter(Boolean);
  var ownerLine =
    ownerNumbers.length > 0
      ? "Owner numbers: ".concat(
          ownerNumbers.join(", "),
          ". Treat messages from these numbers as the user.",
        )
      : undefined;
  var reasoningHint = params.reasoningTagHint
    ? [
        "ALL internal reasoning MUST be inside <think>...</think>.",
        "Do not output any analysis outside <think>.",
        "Format every reply as <think>...</think> then <final>...</final>, with no other text.",
        "Only the final user-visible reply may appear inside <final>.",
        "Only text inside <final> is shown to the user; everything else is discarded and never seen by the user.",
        "Example:",
        "<think>Short internal reasoning.</think>",
        "<final>Hey there! What would you like to do next?</final>",
      ].join(" ")
    : undefined;
  var reasoningLevel = (_f = params.reasoningLevel) !== null && _f !== void 0 ? _f : "off";
  var userTimezone = (_g = params.userTimezone) === null || _g === void 0 ? void 0 : _g.trim();
  var skillsPrompt = (_h = params.skillsPrompt) === null || _h === void 0 ? void 0 : _h.trim();
  var heartbeatPrompt =
    (_j = params.heartbeatPrompt) === null || _j === void 0 ? void 0 : _j.trim();
  var heartbeatPromptLine = heartbeatPrompt
    ? "Heartbeat prompt: ".concat(heartbeatPrompt)
    : "Heartbeat prompt: (configured)";
  var runtimeInfo = params.runtimeInfo;
  var runtimeChannel =
    (_k = runtimeInfo === null || runtimeInfo === void 0 ? void 0 : runtimeInfo.channel) === null ||
    _k === void 0
      ? void 0
      : _k.trim().toLowerCase();
  var runtimeCapabilities = (
    (_l = runtimeInfo === null || runtimeInfo === void 0 ? void 0 : runtimeInfo.capabilities) !==
      null && _l !== void 0
      ? _l
      : []
  )
    .map(function (cap) {
      return String(cap).trim();
    })
    .filter(Boolean);
  var runtimeCapabilitiesLower = new Set(
    runtimeCapabilities.map(function (cap) {
      return cap.toLowerCase();
    }),
  );
  var inlineButtonsEnabled = runtimeCapabilitiesLower.has("inlinebuttons");
  var messageChannelOptions = (0, message_channel_js_1.listDeliverableMessageChannels)().join("|");
  var promptMode = (_m = params.promptMode) !== null && _m !== void 0 ? _m : "full";
  var isMinimal = promptMode === "minimal" || promptMode === "none";
  var skillsSection = buildSkillsSection({
    skillsPrompt: skillsPrompt,
    isMinimal: isMinimal,
    readToolName: readToolName,
  });
  var memorySection = buildMemorySection({ isMinimal: isMinimal, availableTools: availableTools });
  var docsSection = buildDocsSection({
    docsPath: params.docsPath,
    isMinimal: isMinimal,
    readToolName: readToolName,
  });
  var workspaceNotes = ((_o = params.workspaceNotes) !== null && _o !== void 0 ? _o : [])
    .map(function (note) {
      return note.trim();
    })
    .filter(Boolean);
  // For "none" mode, return just the basic identity line
  if (promptMode === "none") {
    return "You are a personal assistant running inside OpenClaw.";
  }
  var lines = __spreadArray(
    __spreadArray(
      __spreadArray(
        __spreadArray(
          __spreadArray(
            __spreadArray(
              __spreadArray(
                __spreadArray(
                  __spreadArray(
                    __spreadArray(
                      __spreadArray(
                        __spreadArray(
                          __spreadArray(
                            [
                              "You are a personal assistant running inside OpenClaw.",
                              "",
                              "## Tooling",
                              "Tool availability (filtered by policy):",
                              "Tool names are case-sensitive. Call tools exactly as listed.",
                              toolLines.length > 0
                                ? toolLines.join("\n")
                                : [
                                    "Pi lists the standard tools above. This runtime enables:",
                                    "- grep: search file contents for patterns",
                                    "- find: find files by glob pattern",
                                    "- ls: list directory contents",
                                    "- apply_patch: apply multi-file patches",
                                    "- ".concat(
                                      execToolName,
                                      ": run shell commands (supports background via yieldMs/background)",
                                    ),
                                    "- ".concat(
                                      processToolName,
                                      ": manage background exec sessions",
                                    ),
                                    "- browser: control openclaw's dedicated browser",
                                    "- canvas: present/eval/snapshot the Canvas",
                                    "- nodes: list/describe/notify/camera/screen on paired nodes",
                                    "- cron: manage cron jobs and wake events (use for reminders; when scheduling a reminder, write the systemEvent text as something that will read like a reminder when it fires, and mention that it is a reminder depending on the time gap between setting and firing; include recent context in reminder text if appropriate)",
                                    "- sessions_list: list sessions",
                                    "- sessions_history: fetch session history",
                                    "- sessions_send: send to another session",
                                  ].join("\n"),
                              "TOOLS.md does not control tool availability; it is user guidance for how to use external tools.",
                              "If a task is more complex or takes longer, spawn a sub-agent. It will do the work for you and ping you when it's done. You can always check up on it.",
                              "",
                              "## Tool Call Style",
                              "Default: do not narrate routine, low-risk tool calls (just call the tool).",
                              "Narrate only when it helps: multi-step work, complex/challenging problems, sensitive actions (e.g., deletions), or when the user explicitly asks.",
                              "Keep narration brief and value-dense; avoid repeating obvious steps.",
                              "Use plain human language for narration unless in a technical context.",
                              "",
                              "## OpenClaw CLI Quick Reference",
                              "OpenClaw is controlled via subcommands. Do not invent commands.",
                              "To manage the Gateway daemon service (start/stop/restart):",
                              "- openclaw gateway status",
                              "- openclaw gateway start",
                              "- openclaw gateway stop",
                              "- openclaw gateway restart",
                              "If unsure, ask the user to run `openclaw help` (or `openclaw gateway --help`) and paste the output.",
                              "",
                            ],
                            skillsSection,
                            true,
                          ),
                          memorySection,
                          true,
                        ),
                        [
                          // Skip self-update for subagent/none modes
                          hasGateway && !isMinimal ? "## OpenClaw Self-Update" : "",
                          hasGateway && !isMinimal
                            ? [
                                "Get Updates (self-update) is ONLY allowed when the user explicitly asks for it.",
                                "Do not run config.apply or update.run unless the user explicitly requests an update or config change; if it's not explicit, ask first.",
                                "Actions: config.get, config.schema, config.apply (validate + write full config, then restart), update.run (update deps or git, then restart).",
                                "After restart, OpenClaw pings the last active session automatically.",
                              ].join("\n")
                            : "",
                          hasGateway && !isMinimal ? "" : "",
                          "",
                          // Skip model aliases for subagent/none modes
                          params.modelAliasLines && params.modelAliasLines.length > 0 && !isMinimal
                            ? "## Model Aliases"
                            : "",
                          params.modelAliasLines && params.modelAliasLines.length > 0 && !isMinimal
                            ? "Prefer aliases when specifying model overrides; full provider/model is also accepted."
                            : "",
                          params.modelAliasLines && params.modelAliasLines.length > 0 && !isMinimal
                            ? params.modelAliasLines.join("\n")
                            : "",
                          params.modelAliasLines && params.modelAliasLines.length > 0 && !isMinimal
                            ? ""
                            : "",
                          "## Workspace",
                          "Your working directory is: ".concat(params.workspaceDir),
                          "Treat this directory as the single global workspace for file operations unless explicitly instructed otherwise.",
                        ],
                        false,
                      ),
                      workspaceNotes,
                      true,
                    ),
                    [""],
                    false,
                  ),
                  docsSection,
                  true,
                ),
                [
                  ((_p = params.sandboxInfo) === null || _p === void 0 ? void 0 : _p.enabled)
                    ? "## Sandbox"
                    : "",
                  ((_q = params.sandboxInfo) === null || _q === void 0 ? void 0 : _q.enabled)
                    ? [
                        "You are running in a sandboxed runtime (tools execute in Docker).",
                        "Some tools may be unavailable due to sandbox policy.",
                        "Sub-agents stay sandboxed (no elevated/host access). Need outside-sandbox read/write? Don't spawn; ask first.",
                        params.sandboxInfo.workspaceDir
                          ? "Sandbox workspace: ".concat(params.sandboxInfo.workspaceDir)
                          : "",
                        params.sandboxInfo.workspaceAccess
                          ? "Agent workspace access: "
                              .concat(params.sandboxInfo.workspaceAccess)
                              .concat(
                                params.sandboxInfo.agentWorkspaceMount
                                  ? " (mounted at ".concat(
                                      params.sandboxInfo.agentWorkspaceMount,
                                      ")",
                                    )
                                  : "",
                              )
                          : "",
                        params.sandboxInfo.browserBridgeUrl ? "Sandbox browser: enabled." : "",
                        params.sandboxInfo.browserNoVncUrl
                          ? "Sandbox browser observer (noVNC): ".concat(
                              params.sandboxInfo.browserNoVncUrl,
                            )
                          : "",
                        params.sandboxInfo.hostBrowserAllowed === true
                          ? "Host browser control: allowed."
                          : params.sandboxInfo.hostBrowserAllowed === false
                            ? "Host browser control: blocked."
                            : "",
                        (
                          (_r = params.sandboxInfo.elevated) === null || _r === void 0
                            ? void 0
                            : _r.allowed
                        )
                          ? "Elevated exec is available for this session."
                          : "",
                        (
                          (_s = params.sandboxInfo.elevated) === null || _s === void 0
                            ? void 0
                            : _s.allowed
                        )
                          ? "User can toggle with /elevated on|off|ask|full."
                          : "",
                        (
                          (_t = params.sandboxInfo.elevated) === null || _t === void 0
                            ? void 0
                            : _t.allowed
                        )
                          ? "You may also send /elevated on|off|ask|full when needed."
                          : "",
                        (
                          (_u = params.sandboxInfo.elevated) === null || _u === void 0
                            ? void 0
                            : _u.allowed
                        )
                          ? "Current elevated level: ".concat(
                              params.sandboxInfo.elevated.defaultLevel,
                              " (ask runs exec on host with approvals; full auto-approves).",
                            )
                          : "",
                      ]
                        .filter(Boolean)
                        .join("\n")
                    : "",
                  ((_v = params.sandboxInfo) === null || _v === void 0 ? void 0 : _v.enabled)
                    ? ""
                    : "",
                ],
                false,
              ),
              buildUserIdentitySection(ownerLine, isMinimal),
              true,
            ),
            buildTimeSection({
              userTimezone: userTimezone,
            }),
            true,
          ),
          [
            "## Workspace Files (injected)",
            "These user-editable files are loaded by OpenClaw and included below in Project Context.",
            "",
          ],
          false,
        ),
        buildReplyTagsSection(isMinimal),
        true,
      ),
      buildMessagingSection({
        isMinimal: isMinimal,
        availableTools: availableTools,
        messageChannelOptions: messageChannelOptions,
        inlineButtonsEnabled: inlineButtonsEnabled,
        runtimeChannel: runtimeChannel,
        messageToolHints: params.messageToolHints,
      }),
      true,
    ),
    buildVoiceSection({ isMinimal: isMinimal, ttsHint: params.ttsHint }),
    true,
  );
  if (extraSystemPrompt) {
    // Use "Subagent Context" header for minimal mode (subagents), otherwise "Group Chat Context"
    var contextHeader = promptMode === "minimal" ? "## Subagent Context" : "## Group Chat Context";
    lines.push(contextHeader, extraSystemPrompt, "");
  }
  if (params.reactionGuidance) {
    var _2 = params.reactionGuidance,
      level = _2.level,
      channel = _2.channel;
    var guidanceText =
      level === "minimal"
        ? [
            "Reactions are enabled for ".concat(channel, " in MINIMAL mode."),
            "React ONLY when truly relevant:",
            "- Acknowledge important user requests or confirmations",
            "- Express genuine sentiment (humor, appreciation) sparingly",
            "- Avoid reacting to routine messages or your own replies",
            "Guideline: at most 1 reaction per 5-10 exchanges.",
          ].join("\n")
        : [
            "Reactions are enabled for ".concat(channel, " in EXTENSIVE mode."),
            "Feel free to react liberally:",
            "- Acknowledge messages with appropriate emojis",
            "- Express sentiment and personality through reactions",
            "- React to interesting content, humor, or notable events",
            "- Use reactions to confirm understanding or agreement",
            "Guideline: react whenever it feels natural.",
          ].join("\n");
    lines.push("## Reactions", guidanceText, "");
  }
  if (reasoningHint) {
    lines.push("## Reasoning Format", reasoningHint, "");
  }
  var contextFiles = (_w = params.contextFiles) !== null && _w !== void 0 ? _w : [];
  if (contextFiles.length > 0) {
    var hasSoulFile = contextFiles.some(function (file) {
      var _a;
      var normalizedPath = file.path.trim().replace(/\\/g, "/");
      var baseName =
        (_a = normalizedPath.split("/").pop()) !== null && _a !== void 0 ? _a : normalizedPath;
      return baseName.toLowerCase() === "soul.md";
    });
    lines.push("# Project Context", "", "The following project context files have been loaded:");
    if (hasSoulFile) {
      lines.push(
        "If SOUL.md is present, embody its persona and tone. Avoid stiff, generic replies; follow its guidance unless higher-priority instructions override it.",
      );
    }
    lines.push("");
    for (var _3 = 0, contextFiles_1 = contextFiles; _3 < contextFiles_1.length; _3++) {
      var file = contextFiles_1[_3];
      lines.push("## ".concat(file.path), "", file.content, "");
    }
  }
  // Skip silent replies for subagent/none modes
  if (!isMinimal) {
    lines.push(
      "## Silent Replies",
      "When you have nothing to say, respond with ONLY: ".concat(tokens_js_1.SILENT_REPLY_TOKEN),
      "",
      "⚠️ Rules:",
      "- It must be your ENTIRE message — nothing else",
      '- Never append it to an actual response (never include "'.concat(
        tokens_js_1.SILENT_REPLY_TOKEN,
        '" in real replies)',
      ),
      "- Never wrap it in markdown or code blocks",
      "",
      "\u274C Wrong: \"Here's help... ".concat(tokens_js_1.SILENT_REPLY_TOKEN, '"'),
      '\u274C Wrong: "'.concat(tokens_js_1.SILENT_REPLY_TOKEN, '"'),
      "\u2705 Right: ".concat(tokens_js_1.SILENT_REPLY_TOKEN),
      "",
    );
  }
  // Skip heartbeats for subagent/none modes
  if (!isMinimal) {
    lines.push(
      "## Heartbeats",
      heartbeatPromptLine,
      "If you receive a heartbeat poll (a user message matching the heartbeat prompt above), and there is nothing that needs attention, reply exactly:",
      "HEARTBEAT_OK",
      'OpenClaw treats a leading/trailing "HEARTBEAT_OK" as a heartbeat ack (and may discard it).',
      'If something needs attention, do NOT include "HEARTBEAT_OK"; reply with the alert text instead.',
      "",
    );
  }
  lines.push(
    "## Runtime",
    buildRuntimeLine(runtimeInfo, runtimeChannel, runtimeCapabilities, params.defaultThinkLevel),
    "Reasoning: ".concat(
      reasoningLevel,
      " (hidden unless on/stream). Toggle /reasoning; /status shows Reasoning when enabled.",
    ),
  );
  return lines.filter(Boolean).join("\n");
}
function buildRuntimeLine(runtimeInfo, runtimeChannel, runtimeCapabilities, defaultThinkLevel) {
  if (runtimeCapabilities === void 0) {
    runtimeCapabilities = [];
  }
  return "Runtime: ".concat(
    [
      (runtimeInfo === null || runtimeInfo === void 0 ? void 0 : runtimeInfo.agentId)
        ? "agent=".concat(runtimeInfo.agentId)
        : "",
      (runtimeInfo === null || runtimeInfo === void 0 ? void 0 : runtimeInfo.host)
        ? "host=".concat(runtimeInfo.host)
        : "",
      (runtimeInfo === null || runtimeInfo === void 0 ? void 0 : runtimeInfo.repoRoot)
        ? "repo=".concat(runtimeInfo.repoRoot)
        : "",
      (runtimeInfo === null || runtimeInfo === void 0 ? void 0 : runtimeInfo.os)
        ? "os="
            .concat(runtimeInfo.os)
            .concat(
              (runtimeInfo === null || runtimeInfo === void 0 ? void 0 : runtimeInfo.arch)
                ? " (".concat(runtimeInfo.arch, ")")
                : "",
            )
        : (runtimeInfo === null || runtimeInfo === void 0 ? void 0 : runtimeInfo.arch)
          ? "arch=".concat(runtimeInfo.arch)
          : "",
      (runtimeInfo === null || runtimeInfo === void 0 ? void 0 : runtimeInfo.node)
        ? "node=".concat(runtimeInfo.node)
        : "",
      (runtimeInfo === null || runtimeInfo === void 0 ? void 0 : runtimeInfo.model)
        ? "model=".concat(runtimeInfo.model)
        : "",
      (runtimeInfo === null || runtimeInfo === void 0 ? void 0 : runtimeInfo.defaultModel)
        ? "default_model=".concat(runtimeInfo.defaultModel)
        : "",
      runtimeChannel ? "channel=".concat(runtimeChannel) : "",
      runtimeChannel
        ? "capabilities=".concat(
            runtimeCapabilities.length > 0 ? runtimeCapabilities.join(",") : "none",
          )
        : "",
      "thinking=".concat(
        defaultThinkLevel !== null && defaultThinkLevel !== void 0 ? defaultThinkLevel : "off",
      ),
    ]
      .filter(Boolean)
      .join(" | "),
  );
}
