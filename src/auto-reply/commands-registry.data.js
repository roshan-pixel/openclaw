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
exports.getChatCommands = getChatCommands;
exports.getNativeCommandSurfaces = getNativeCommandSurfaces;
var dock_js_1 = require("../channels/dock.js");
var runtime_js_1 = require("../plugins/runtime.js");
var thinking_js_1 = require("./thinking.js");
var commands_args_js_1 = require("./commands-args.js");
function defineChatCommand(command) {
  var _a, _b, _c, _d, _e, _f;
  var aliases = (
    (_a = command.textAliases) !== null && _a !== void 0
      ? _a
      : command.textAlias
        ? [command.textAlias]
        : []
  )
    .map(function (alias) {
      return alias.trim();
    })
    .filter(Boolean);
  var scope =
    (_b = command.scope) !== null && _b !== void 0
      ? _b
      : command.nativeName
        ? aliases.length
          ? "both"
          : "native"
        : "text";
  var acceptsArgs =
    (_c = command.acceptsArgs) !== null && _c !== void 0
      ? _c
      : Boolean((_d = command.args) === null || _d === void 0 ? void 0 : _d.length);
  var argsParsing =
    (_e = command.argsParsing) !== null && _e !== void 0
      ? _e
      : ((_f = command.args) === null || _f === void 0 ? void 0 : _f.length)
        ? "positional"
        : "none";
  return {
    key: command.key,
    nativeName: command.nativeName,
    description: command.description,
    acceptsArgs: acceptsArgs,
    args: command.args,
    argsParsing: argsParsing,
    formatArgs: command.formatArgs,
    argsMenu: command.argsMenu,
    textAliases: aliases,
    scope: scope,
    category: command.category,
  };
}
function defineDockCommand(dock) {
  return defineChatCommand({
    key: "dock:".concat(dock.id),
    nativeName: "dock_".concat(dock.id),
    description: "Switch to ".concat(dock.id, " for replies."),
    textAliases: ["/dock-".concat(dock.id), "/dock_".concat(dock.id)],
    category: "docks",
  });
}
function registerAlias(commands, key) {
  var aliases = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    aliases[_i - 2] = arguments[_i];
  }
  var command = commands.find(function (entry) {
    return entry.key === key;
  });
  if (!command) {
    throw new Error("registerAlias: unknown command key: ".concat(key));
  }
  var existing = new Set(
    command.textAliases.map(function (alias) {
      return alias.trim().toLowerCase();
    }),
  );
  for (var _a = 0, aliases_1 = aliases; _a < aliases_1.length; _a++) {
    var alias = aliases_1[_a];
    var trimmed = alias.trim();
    if (!trimmed) {
      continue;
    }
    var lowered = trimmed.toLowerCase();
    if (existing.has(lowered)) {
      continue;
    }
    existing.add(lowered);
    command.textAliases.push(trimmed);
  }
}
function assertCommandRegistry(commands) {
  var _a;
  var keys = new Set();
  var nativeNames = new Set();
  var textAliases = new Set();
  for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
    var command = commands_1[_i];
    if (keys.has(command.key)) {
      throw new Error("Duplicate command key: ".concat(command.key));
    }
    keys.add(command.key);
    var nativeName = (_a = command.nativeName) === null || _a === void 0 ? void 0 : _a.trim();
    if (command.scope === "text") {
      if (nativeName) {
        throw new Error("Text-only command has native name: ".concat(command.key));
      }
      if (command.textAliases.length === 0) {
        throw new Error("Text-only command missing text alias: ".concat(command.key));
      }
    } else if (!nativeName) {
      throw new Error("Native command missing native name: ".concat(command.key));
    } else {
      var nativeKey = nativeName.toLowerCase();
      if (nativeNames.has(nativeKey)) {
        throw new Error("Duplicate native command: ".concat(nativeName));
      }
      nativeNames.add(nativeKey);
    }
    if (command.scope === "native" && command.textAliases.length > 0) {
      throw new Error("Native-only command has text aliases: ".concat(command.key));
    }
    for (var _b = 0, _c = command.textAliases; _b < _c.length; _b++) {
      var alias = _c[_b];
      if (!alias.startsWith("/")) {
        throw new Error("Command alias missing leading '/': ".concat(alias));
      }
      var aliasKey = alias.toLowerCase();
      if (textAliases.has(aliasKey)) {
        throw new Error("Duplicate command alias: ".concat(alias));
      }
      textAliases.add(aliasKey);
    }
  }
}
var cachedCommands = null;
var cachedRegistry = null;
var cachedNativeCommandSurfaces = null;
var cachedNativeRegistry = null;
function buildChatCommands() {
  var commands = __spreadArray(
    [
      defineChatCommand({
        key: "help",
        nativeName: "help",
        description: "Show available commands.",
        textAlias: "/help",
        category: "status",
      }),
      defineChatCommand({
        key: "commands",
        nativeName: "commands",
        description: "List all slash commands.",
        textAlias: "/commands",
        category: "status",
      }),
      defineChatCommand({
        key: "skill",
        nativeName: "skill",
        description: "Run a skill by name.",
        textAlias: "/skill",
        category: "tools",
        args: [
          {
            name: "name",
            description: "Skill name",
            type: "string",
            required: true,
          },
          {
            name: "input",
            description: "Skill input",
            type: "string",
            captureRemaining: true,
          },
        ],
      }),
      defineChatCommand({
        key: "status",
        nativeName: "status",
        description: "Show current status.",
        textAlias: "/status",
        category: "status",
      }),
      defineChatCommand({
        key: "allowlist",
        description: "List/add/remove allowlist entries.",
        textAlias: "/allowlist",
        acceptsArgs: true,
        scope: "text",
        category: "management",
      }),
      defineChatCommand({
        key: "approve",
        nativeName: "approve",
        description: "Approve or deny exec requests.",
        textAlias: "/approve",
        acceptsArgs: true,
        category: "management",
      }),
      defineChatCommand({
        key: "context",
        nativeName: "context",
        description: "Explain how context is built and used.",
        textAlias: "/context",
        acceptsArgs: true,
        category: "status",
      }),
      defineChatCommand({
        key: "tts",
        nativeName: "tts",
        description: "Control text-to-speech (TTS).",
        textAlias: "/tts",
        category: "media",
        args: [
          {
            name: "action",
            description: "TTS action",
            type: "string",
            choices: [
              { value: "on", label: "On" },
              { value: "off", label: "Off" },
              { value: "status", label: "Status" },
              { value: "provider", label: "Provider" },
              { value: "limit", label: "Limit" },
              { value: "summary", label: "Summary" },
              { value: "audio", label: "Audio" },
              { value: "help", label: "Help" },
            ],
          },
          {
            name: "value",
            description: "Provider, limit, or text",
            type: "string",
            captureRemaining: true,
          },
        ],
        argsMenu: {
          arg: "action",
          title:
            "TTS Actions:\n" +
            "• On – Enable TTS for responses\n" +
            "• Off – Disable TTS\n" +
            "• Status – Show current settings\n" +
            "• Provider – Set voice provider (edge, elevenlabs, openai)\n" +
            "• Limit – Set max characters for TTS\n" +
            "• Summary – Toggle AI summary for long texts\n" +
            "• Audio – Generate TTS from custom text\n" +
            "• Help – Show usage guide",
        },
      }),
      defineChatCommand({
        key: "whoami",
        nativeName: "whoami",
        description: "Show your sender id.",
        textAlias: "/whoami",
        category: "status",
      }),
      defineChatCommand({
        key: "subagents",
        nativeName: "subagents",
        description: "List/stop/log/info subagent runs for this session.",
        textAlias: "/subagents",
        category: "management",
        args: [
          {
            name: "action",
            description: "list | stop | log | info | send",
            type: "string",
            choices: ["list", "stop", "log", "info", "send"],
          },
          {
            name: "target",
            description: "Run id, index, or session key",
            type: "string",
          },
          {
            name: "value",
            description: "Additional input (limit/message)",
            type: "string",
            captureRemaining: true,
          },
        ],
        argsMenu: "auto",
      }),
      defineChatCommand({
        key: "config",
        nativeName: "config",
        description: "Show or set config values.",
        textAlias: "/config",
        category: "management",
        args: [
          {
            name: "action",
            description: "show | get | set | unset",
            type: "string",
            choices: ["show", "get", "set", "unset"],
          },
          {
            name: "path",
            description: "Config path",
            type: "string",
          },
          {
            name: "value",
            description: "Value for set",
            type: "string",
            captureRemaining: true,
          },
        ],
        argsParsing: "none",
        formatArgs: commands_args_js_1.COMMAND_ARG_FORMATTERS.config,
      }),
      defineChatCommand({
        key: "debug",
        nativeName: "debug",
        description: "Set runtime debug overrides.",
        textAlias: "/debug",
        category: "management",
        args: [
          {
            name: "action",
            description: "show | reset | set | unset",
            type: "string",
            choices: ["show", "reset", "set", "unset"],
          },
          {
            name: "path",
            description: "Debug path",
            type: "string",
          },
          {
            name: "value",
            description: "Value for set",
            type: "string",
            captureRemaining: true,
          },
        ],
        argsParsing: "none",
        formatArgs: commands_args_js_1.COMMAND_ARG_FORMATTERS.debug,
      }),
      defineChatCommand({
        key: "usage",
        nativeName: "usage",
        description: "Usage footer or cost summary.",
        textAlias: "/usage",
        category: "options",
        args: [
          {
            name: "mode",
            description: "off, tokens, full, or cost",
            type: "string",
            choices: ["off", "tokens", "full", "cost"],
          },
        ],
        argsMenu: "auto",
      }),
      defineChatCommand({
        key: "stop",
        nativeName: "stop",
        description: "Stop the current run.",
        textAlias: "/stop",
        category: "session",
      }),
      defineChatCommand({
        key: "restart",
        nativeName: "restart",
        description: "Restart OpenClaw.",
        textAlias: "/restart",
        category: "tools",
      }),
      defineChatCommand({
        key: "activation",
        nativeName: "activation",
        description: "Set group activation mode.",
        textAlias: "/activation",
        category: "management",
        args: [
          {
            name: "mode",
            description: "mention or always",
            type: "string",
            choices: ["mention", "always"],
          },
        ],
        argsMenu: "auto",
      }),
      defineChatCommand({
        key: "send",
        nativeName: "send",
        description: "Set send policy.",
        textAlias: "/send",
        category: "management",
        args: [
          {
            name: "mode",
            description: "on, off, or inherit",
            type: "string",
            choices: ["on", "off", "inherit"],
          },
        ],
        argsMenu: "auto",
      }),
      defineChatCommand({
        key: "reset",
        nativeName: "reset",
        description: "Reset the current session.",
        textAlias: "/reset",
        acceptsArgs: true,
        category: "session",
      }),
      defineChatCommand({
        key: "new",
        nativeName: "new",
        description: "Start a new session.",
        textAlias: "/new",
        acceptsArgs: true,
        category: "session",
      }),
      defineChatCommand({
        key: "compact",
        description: "Compact the session context.",
        textAlias: "/compact",
        scope: "text",
        category: "session",
        args: [
          {
            name: "instructions",
            description: "Extra compaction instructions",
            type: "string",
            captureRemaining: true,
          },
        ],
      }),
      defineChatCommand({
        key: "think",
        nativeName: "think",
        description: "Set thinking level.",
        textAlias: "/think",
        category: "options",
        args: [
          {
            name: "level",
            description: "off, minimal, low, medium, high, xhigh",
            type: "string",
            choices: function (_a) {
              var provider = _a.provider,
                model = _a.model;
              return (0, thinking_js_1.listThinkingLevels)(provider, model);
            },
          },
        ],
        argsMenu: "auto",
      }),
      defineChatCommand({
        key: "verbose",
        nativeName: "verbose",
        description: "Toggle verbose mode.",
        textAlias: "/verbose",
        category: "options",
        args: [
          {
            name: "mode",
            description: "on or off",
            type: "string",
            choices: ["on", "off"],
          },
        ],
        argsMenu: "auto",
      }),
      defineChatCommand({
        key: "reasoning",
        nativeName: "reasoning",
        description: "Toggle reasoning visibility.",
        textAlias: "/reasoning",
        category: "options",
        args: [
          {
            name: "mode",
            description: "on, off, or stream",
            type: "string",
            choices: ["on", "off", "stream"],
          },
        ],
        argsMenu: "auto",
      }),
      defineChatCommand({
        key: "elevated",
        nativeName: "elevated",
        description: "Toggle elevated mode.",
        textAlias: "/elevated",
        category: "options",
        args: [
          {
            name: "mode",
            description: "on, off, ask, or full",
            type: "string",
            choices: ["on", "off", "ask", "full"],
          },
        ],
        argsMenu: "auto",
      }),
      defineChatCommand({
        key: "exec",
        nativeName: "exec",
        description: "Set exec defaults for this session.",
        textAlias: "/exec",
        category: "options",
        args: [
          {
            name: "options",
            description: "host=... security=... ask=... node=...",
            type: "string",
          },
        ],
        argsParsing: "none",
      }),
      defineChatCommand({
        key: "model",
        nativeName: "model",
        description: "Show or set the model.",
        textAlias: "/model",
        category: "options",
        args: [
          {
            name: "model",
            description: "Model id (provider/model or id)",
            type: "string",
          },
        ],
      }),
      defineChatCommand({
        key: "models",
        nativeName: "models",
        description: "List model providers or provider models.",
        textAlias: "/models",
        argsParsing: "none",
        acceptsArgs: true,
        category: "options",
      }),
      defineChatCommand({
        key: "queue",
        nativeName: "queue",
        description: "Adjust queue settings.",
        textAlias: "/queue",
        category: "options",
        args: [
          {
            name: "mode",
            description: "queue mode",
            type: "string",
            choices: ["steer", "interrupt", "followup", "collect", "steer-backlog"],
          },
          {
            name: "debounce",
            description: "debounce duration (e.g. 500ms, 2s)",
            type: "string",
          },
          {
            name: "cap",
            description: "queue cap",
            type: "number",
          },
          {
            name: "drop",
            description: "drop policy",
            type: "string",
            choices: ["old", "new", "summarize"],
          },
        ],
        argsParsing: "none",
        formatArgs: commands_args_js_1.COMMAND_ARG_FORMATTERS.queue,
      }),
      defineChatCommand({
        key: "bash",
        description: "Run host shell commands (host-only).",
        textAlias: "/bash",
        scope: "text",
        category: "tools",
        args: [
          {
            name: "command",
            description: "Shell command",
            type: "string",
            captureRemaining: true,
          },
        ],
      }),
    ],
    (0, dock_js_1.listChannelDocks)()
      .filter(function (dock) {
        return dock.capabilities.nativeCommands;
      })
      .map(function (dock) {
        return defineDockCommand(dock);
      }),
    true,
  );
  registerAlias(commands, "whoami", "/id");
  registerAlias(commands, "think", "/thinking", "/t");
  registerAlias(commands, "verbose", "/v");
  registerAlias(commands, "reasoning", "/reason");
  registerAlias(commands, "elevated", "/elev");
  assertCommandRegistry(commands);
  return commands;
}
function getChatCommands() {
  var registry = (0, runtime_js_1.getActivePluginRegistry)();
  if (cachedCommands && registry === cachedRegistry) {
    return cachedCommands;
  }
  var commands = buildChatCommands();
  cachedCommands = commands;
  cachedRegistry = registry;
  cachedNativeCommandSurfaces = null;
  return commands;
}
function getNativeCommandSurfaces() {
  var registry = (0, runtime_js_1.getActivePluginRegistry)();
  if (cachedNativeCommandSurfaces && registry === cachedNativeRegistry) {
    return cachedNativeCommandSurfaces;
  }
  cachedNativeCommandSurfaces = new Set(
    (0, dock_js_1.listChannelDocks)()
      .filter(function (dock) {
        return dock.capabilities.nativeCommands;
      })
      .map(function (dock) {
        return dock.id;
      }),
  );
  cachedNativeRegistry = registry;
  return cachedNativeCommandSurfaces;
}
