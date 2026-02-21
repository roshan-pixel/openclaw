"use strict";
/**
 * Plugin Command Registry
 *
 * Manages commands registered by plugins that bypass the LLM agent.
 * These commands are processed before built-in commands and before agent invocation.
 */
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) {
            throw t[1];
          }
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) {
        throw new TypeError("Generator is already executing.");
      }
      while ((g && ((g = 0), op[0] && (_ = 0)), _)) {
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      }
      if (op[0] & 5) {
        throw op[1];
      }
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommandName = validateCommandName;
exports.registerPluginCommand = registerPluginCommand;
exports.clearPluginCommands = clearPluginCommands;
exports.clearPluginCommandsForPlugin = clearPluginCommandsForPlugin;
exports.matchPluginCommand = matchPluginCommand;
exports.executePluginCommand = executePluginCommand;
exports.listPluginCommands = listPluginCommands;
exports.getPluginCommandSpecs = getPluginCommandSpecs;
var globals_js_1 = require("../globals.js");
// Registry of plugin commands
var pluginCommands = new Map();
// Lock to prevent modifications during command execution
var registryLocked = false;
// Maximum allowed length for command arguments (defense in depth)
var MAX_ARGS_LENGTH = 4096;
/**
 * Reserved command names that plugins cannot override.
 * These are built-in commands from commands-registry.data.ts.
 */
var RESERVED_COMMANDS = new Set([
  // Core commands
  "help",
  "commands",
  "status",
  "whoami",
  "context",
  // Session management
  "stop",
  "restart",
  "reset",
  "new",
  "compact",
  // Configuration
  "config",
  "debug",
  "allowlist",
  "activation",
  // Agent control
  "skill",
  "subagents",
  "model",
  "models",
  "queue",
  // Messaging
  "send",
  // Execution
  "bash",
  "exec",
  // Mode toggles
  "think",
  "verbose",
  "reasoning",
  "elevated",
  // Billing
  "usage",
]);
/**
 * Validate a command name.
 * Returns an error message if invalid, or null if valid.
 */
function validateCommandName(name) {
  var trimmed = name.trim().toLowerCase();
  if (!trimmed) {
    return "Command name cannot be empty";
  }
  // Must start with a letter, contain only letters, numbers, hyphens, underscores
  // Note: trimmed is already lowercased, so no need for /i flag
  if (!/^[a-z][a-z0-9_-]*$/.test(trimmed)) {
    return "Command name must start with a letter and contain only letters, numbers, hyphens, and underscores";
  }
  // Check reserved commands
  if (RESERVED_COMMANDS.has(trimmed)) {
    return 'Command name "'.concat(trimmed, '" is reserved by a built-in command');
  }
  return null;
}
/**
 * Register a plugin command.
 * Returns an error if the command name is invalid or reserved.
 */
function registerPluginCommand(pluginId, command) {
  // Prevent registration while commands are being processed
  if (registryLocked) {
    return { ok: false, error: "Cannot register commands while processing is in progress" };
  }
  // Validate handler is a function
  if (typeof command.handler !== "function") {
    return { ok: false, error: "Command handler must be a function" };
  }
  var validationError = validateCommandName(command.name);
  if (validationError) {
    return { ok: false, error: validationError };
  }
  var key = "/".concat(command.name.toLowerCase());
  // Check for duplicate registration
  if (pluginCommands.has(key)) {
    var existing = pluginCommands.get(key);
    return {
      ok: false,
      error: 'Command "'
        .concat(command.name, '" already registered by plugin "')
        .concat(existing.pluginId, '"'),
    };
  }
  pluginCommands.set(key, __assign(__assign({}, command), { pluginId: pluginId }));
  (0, globals_js_1.logVerbose)(
    "Registered plugin command: ".concat(key, " (plugin: ").concat(pluginId, ")"),
  );
  return { ok: true };
}
/**
 * Clear all registered plugin commands.
 * Called during plugin reload.
 */
function clearPluginCommands() {
  pluginCommands.clear();
}
/**
 * Clear plugin commands for a specific plugin.
 */
function clearPluginCommandsForPlugin(pluginId) {
  for (var _i = 0, _a = pluginCommands.entries(); _i < _a.length; _i++) {
    var _b = _a[_i],
      key = _b[0],
      cmd = _b[1];
    if (cmd.pluginId === pluginId) {
      pluginCommands.delete(key);
    }
  }
}
/**
 * Check if a command body matches a registered plugin command.
 * Returns the command definition and parsed args if matched.
 *
 * Note: If a command has `acceptsArgs: false` and the user provides arguments,
 * the command will not match. This allows the message to fall through to
 * built-in handlers or the agent. Document this behavior to plugin authors.
 */
function matchPluginCommand(commandBody) {
  var trimmed = commandBody.trim();
  if (!trimmed.startsWith("/")) {
    return null;
  }
  // Extract command name and args
  var spaceIndex = trimmed.indexOf(" ");
  var commandName = spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex);
  var args = spaceIndex === -1 ? undefined : trimmed.slice(spaceIndex + 1).trim();
  var key = commandName.toLowerCase();
  var command = pluginCommands.get(key);
  if (!command) {
    return null;
  }
  // If command doesn't accept args but args were provided, don't match
  if (args && !command.acceptsArgs) {
    return null;
  }
  return { command: command, args: args || undefined };
}
/**
 * Sanitize command arguments to prevent injection attacks.
 * Removes control characters and enforces length limits.
 */
function sanitizeArgs(args) {
  if (!args) {
    return undefined;
  }
  // Enforce length limit
  if (args.length > MAX_ARGS_LENGTH) {
    return args.slice(0, MAX_ARGS_LENGTH);
  }
  // Remove control characters (except newlines and tabs which may be intentional)
  var sanitized = "";
  for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
    var char = args_1[_i];
    var code = char.charCodeAt(0);
    var isControl = (code <= 0x1f && code !== 0x09 && code !== 0x0a) || code === 0x7f;
    if (!isControl) {
      sanitized += char;
    }
  }
  return sanitized;
}
/**
 * Execute a plugin command handler.
 *
 * Note: Plugin authors should still validate and sanitize ctx.args for their
 * specific use case. This function provides basic defense-in-depth sanitization.
 */
function executePluginCommand(params) {
  return __awaiter(this, void 0, void 0, function () {
    var command,
      args,
      senderId,
      channel,
      isAuthorizedSender,
      commandBody,
      config,
      requireAuth,
      sanitizedArgs,
      ctx,
      result,
      err_1,
      error;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          ((command = params.command),
            (args = params.args),
            (senderId = params.senderId),
            (channel = params.channel),
            (isAuthorizedSender = params.isAuthorizedSender),
            (commandBody = params.commandBody),
            (config = params.config));
          requireAuth = command.requireAuth !== false;
          if (requireAuth && !isAuthorizedSender) {
            (0, globals_js_1.logVerbose)(
              "Plugin command /"
                .concat(command.name, " blocked: unauthorized sender ")
                .concat(senderId || "<unknown>"),
            );
            return [2 /*return*/, { text: "⚠️ This command requires authorization." }];
          }
          sanitizedArgs = sanitizeArgs(args);
          ctx = {
            senderId: senderId,
            channel: channel,
            isAuthorizedSender: isAuthorizedSender,
            args: sanitizedArgs,
            commandBody: commandBody,
            config: config,
          };
          // Lock registry during execution to prevent concurrent modifications
          registryLocked = true;
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, 4, 5]);
          return [4 /*yield*/, command.handler(ctx)];
        case 2:
          result = _a.sent();
          (0, globals_js_1.logVerbose)(
            "Plugin command /"
              .concat(command.name, " executed successfully for ")
              .concat(senderId || "unknown"),
          );
          return [2 /*return*/, result];
        case 3:
          err_1 = _a.sent();
          error = err_1;
          (0, globals_js_1.logVerbose)(
            "Plugin command /".concat(command.name, " error: ").concat(error.message),
          );
          // Don't leak internal error details - return a safe generic message
          return [2 /*return*/, { text: "⚠️ Command failed. Please try again later." }];
        case 4:
          registryLocked = false;
          return [7 /*endfinally*/];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
/**
 * List all registered plugin commands.
 * Used for /help and /commands output.
 */
function listPluginCommands() {
  return Array.from(pluginCommands.values()).map(function (cmd) {
    return {
      name: cmd.name,
      description: cmd.description,
      pluginId: cmd.pluginId,
    };
  });
}
/**
 * Get plugin command specs for native command registration (e.g., Telegram).
 */
function getPluginCommandSpecs() {
  return Array.from(pluginCommands.values()).map(function (cmd) {
    return {
      name: cmd.name,
      description: cmd.description,
    };
  });
}
