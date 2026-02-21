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
exports.listChatCommands = listChatCommands;
exports.isCommandEnabled = isCommandEnabled;
exports.listChatCommandsForConfig = listChatCommandsForConfig;
exports.listNativeCommandSpecs = listNativeCommandSpecs;
exports.listNativeCommandSpecsForConfig = listNativeCommandSpecsForConfig;
exports.findCommandByNativeName = findCommandByNativeName;
exports.buildCommandText = buildCommandText;
exports.parseCommandArgs = parseCommandArgs;
exports.serializeCommandArgs = serializeCommandArgs;
exports.buildCommandTextFromArgs = buildCommandTextFromArgs;
exports.resolveCommandArgChoices = resolveCommandArgChoices;
exports.resolveCommandArgMenu = resolveCommandArgMenu;
exports.normalizeCommandBody = normalizeCommandBody;
exports.isCommandMessage = isCommandMessage;
exports.getCommandDetection = getCommandDetection;
exports.maybeResolveTextAlias = maybeResolveTextAlias;
exports.resolveTextCommand = resolveTextCommand;
exports.isNativeCommandSurface = isNativeCommandSurface;
exports.shouldHandleTextCommands = shouldHandleTextCommands;
var commands_registry_data_js_1 = require("./commands-registry.data.js");
var defaults_js_1 = require("../agents/defaults.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var cachedTextAliasMap = null;
var cachedTextAliasCommands = null;
var cachedDetection;
var cachedDetectionCommands = null;
function getTextAliasMap() {
  var _a;
  var commands = (0, commands_registry_data_js_1.getChatCommands)();
  if (cachedTextAliasMap && cachedTextAliasCommands === commands) {
    return cachedTextAliasMap;
  }
  var map = new Map();
  for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
    var command = commands_1[_i];
    // Canonicalize to the *primary* text alias, not `/${key}`. Some command keys are
    // internal identifiers (e.g. `dock:telegram`) while the public text command is
    // the alias (e.g. `/dock-telegram`).
    var canonical =
      ((_a = command.textAliases[0]) === null || _a === void 0 ? void 0 : _a.trim()) ||
      "/".concat(command.key);
    var acceptsArgs = Boolean(command.acceptsArgs);
    for (var _b = 0, _c = command.textAliases; _b < _c.length; _b++) {
      var alias = _c[_b];
      var normalized = alias.trim().toLowerCase();
      if (!normalized) {
        continue;
      }
      if (!map.has(normalized)) {
        map.set(normalized, { key: command.key, canonical: canonical, acceptsArgs: acceptsArgs });
      }
    }
  }
  cachedTextAliasMap = map;
  cachedTextAliasCommands = commands;
  return map;
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function buildSkillCommandDefinitions(skillCommands) {
  if (!skillCommands || skillCommands.length === 0) {
    return [];
  }
  return skillCommands.map(function (spec) {
    return {
      key: "skill:".concat(spec.skillName),
      nativeName: spec.name,
      description: spec.description,
      textAliases: ["/".concat(spec.name)],
      acceptsArgs: true,
      argsParsing: "none",
      scope: "both",
    };
  });
}
function listChatCommands(params) {
  var _a;
  var commands = (0, commands_registry_data_js_1.getChatCommands)();
  if (
    !((_a = params === null || params === void 0 ? void 0 : params.skillCommands) === null ||
    _a === void 0
      ? void 0
      : _a.length)
  ) {
    return __spreadArray([], commands, true);
  }
  return __spreadArray(
    __spreadArray([], commands, true),
    buildSkillCommandDefinitions(params.skillCommands),
    true,
  );
}
function isCommandEnabled(cfg, commandKey) {
  var _a, _b, _c;
  if (commandKey === "config") {
    return ((_a = cfg.commands) === null || _a === void 0 ? void 0 : _a.config) === true;
  }
  if (commandKey === "debug") {
    return ((_b = cfg.commands) === null || _b === void 0 ? void 0 : _b.debug) === true;
  }
  if (commandKey === "bash") {
    return ((_c = cfg.commands) === null || _c === void 0 ? void 0 : _c.bash) === true;
  }
  return true;
}
function listChatCommandsForConfig(cfg, params) {
  var _a;
  var base = (0, commands_registry_data_js_1.getChatCommands)().filter(function (command) {
    return isCommandEnabled(cfg, command.key);
  });
  if (
    !((_a = params === null || params === void 0 ? void 0 : params.skillCommands) === null ||
    _a === void 0
      ? void 0
      : _a.length)
  ) {
    return base;
  }
  return __spreadArray(
    __spreadArray([], base, true),
    buildSkillCommandDefinitions(params.skillCommands),
    true,
  );
}
var NATIVE_NAME_OVERRIDES = {
  discord: {
    tts: "voice",
  },
};
function resolveNativeName(command, provider) {
  var _a;
  if (!command.nativeName) {
    return undefined;
  }
  if (provider) {
    var override =
      (_a = NATIVE_NAME_OVERRIDES[provider]) === null || _a === void 0 ? void 0 : _a[command.key];
    if (override) {
      return override;
    }
  }
  return command.nativeName;
}
function listNativeCommandSpecs(params) {
  return listChatCommands({
    skillCommands: params === null || params === void 0 ? void 0 : params.skillCommands,
  })
    .filter(function (command) {
      return command.scope !== "text" && command.nativeName;
    })
    .map(function (command) {
      var _a;
      return {
        name:
          (_a = resolveNativeName(
            command,
            params === null || params === void 0 ? void 0 : params.provider,
          )) !== null && _a !== void 0
            ? _a
            : command.key,
        description: command.description,
        acceptsArgs: Boolean(command.acceptsArgs),
        args: command.args,
      };
    });
}
function listNativeCommandSpecsForConfig(cfg, params) {
  return listChatCommandsForConfig(cfg, params)
    .filter(function (command) {
      return command.scope !== "text" && command.nativeName;
    })
    .map(function (command) {
      var _a;
      return {
        name:
          (_a = resolveNativeName(
            command,
            params === null || params === void 0 ? void 0 : params.provider,
          )) !== null && _a !== void 0
            ? _a
            : command.key,
        description: command.description,
        acceptsArgs: Boolean(command.acceptsArgs),
        args: command.args,
      };
    });
}
function findCommandByNativeName(name, provider) {
  var normalized = name.trim().toLowerCase();
  return (0, commands_registry_data_js_1.getChatCommands)().find(function (command) {
    var _a;
    return (
      command.scope !== "text" &&
      ((_a = resolveNativeName(command, provider)) === null || _a === void 0
        ? void 0
        : _a.toLowerCase()) === normalized
    );
  });
}
function buildCommandText(commandName, args) {
  var trimmedArgs = args === null || args === void 0 ? void 0 : args.trim();
  return trimmedArgs ? "/".concat(commandName, " ").concat(trimmedArgs) : "/".concat(commandName);
}
function parsePositionalArgs(definitions, raw) {
  var values = {};
  var trimmed = raw.trim();
  if (!trimmed) {
    return values;
  }
  var tokens = trimmed.split(/\s+/).filter(Boolean);
  var index = 0;
  for (var _i = 0, definitions_1 = definitions; _i < definitions_1.length; _i++) {
    var definition = definitions_1[_i];
    if (index >= tokens.length) {
      break;
    }
    if (definition.captureRemaining) {
      values[definition.name] = tokens.slice(index).join(" ");
      index = tokens.length;
      break;
    }
    values[definition.name] = tokens[index];
    index += 1;
  }
  return values;
}
function formatPositionalArgs(definitions, values) {
  var parts = [];
  for (var _i = 0, definitions_2 = definitions; _i < definitions_2.length; _i++) {
    var definition = definitions_2[_i];
    var value = values[definition.name];
    if (value == null) {
      continue;
    }
    var rendered = void 0;
    if (typeof value === "string") {
      rendered = value.trim();
    } else {
      rendered = String(value);
    }
    if (!rendered) {
      continue;
    }
    parts.push(rendered);
    if (definition.captureRemaining) {
      break;
    }
  }
  return parts.length > 0 ? parts.join(" ") : undefined;
}
function parseCommandArgs(command, raw) {
  var trimmed = raw === null || raw === void 0 ? void 0 : raw.trim();
  if (!trimmed) {
    return undefined;
  }
  if (!command.args || command.argsParsing === "none") {
    return { raw: trimmed };
  }
  return {
    raw: trimmed,
    values: parsePositionalArgs(command.args, trimmed),
  };
}
function serializeCommandArgs(command, args) {
  var _a;
  if (!args) {
    return undefined;
  }
  var raw = (_a = args.raw) === null || _a === void 0 ? void 0 : _a.trim();
  if (raw) {
    return raw;
  }
  if (!args.values || !command.args) {
    return undefined;
  }
  if (command.formatArgs) {
    return command.formatArgs(args.values);
  }
  return formatPositionalArgs(command.args, args.values);
}
function buildCommandTextFromArgs(command, args) {
  var _a;
  var commandName = (_a = command.nativeName) !== null && _a !== void 0 ? _a : command.key;
  return buildCommandText(commandName, serializeCommandArgs(command, args));
}
function resolveDefaultCommandContext(cfg) {
  var _a, _b;
  var resolved = (0, model_selection_js_1.resolveConfiguredModelRef)({
    cfg: cfg !== null && cfg !== void 0 ? cfg : {},
    defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
    defaultModel: defaults_js_1.DEFAULT_MODEL,
  });
  return {
    provider:
      (_a = resolved.provider) !== null && _a !== void 0 ? _a : defaults_js_1.DEFAULT_PROVIDER,
    model: (_b = resolved.model) !== null && _b !== void 0 ? _b : defaults_js_1.DEFAULT_MODEL,
  };
}
function resolveCommandArgChoices(params) {
  var command = params.command,
    arg = params.arg,
    cfg = params.cfg;
  if (!arg.choices) {
    return [];
  }
  var provided = arg.choices;
  var raw = Array.isArray(provided)
    ? provided
    : (function () {
        var _a, _b;
        var defaults = resolveDefaultCommandContext(cfg);
        var context = {
          cfg: cfg,
          provider: (_a = params.provider) !== null && _a !== void 0 ? _a : defaults.provider,
          model: (_b = params.model) !== null && _b !== void 0 ? _b : defaults.model,
          command: command,
          arg: arg,
        };
        return provided(context);
      })();
  return raw.map(function (choice) {
    return typeof choice === "string" ? { value: choice, label: choice } : choice;
  });
}
function resolveCommandArgMenu(params) {
  var _a;
  var command = params.command,
    args = params.args,
    cfg = params.cfg;
  if (!command.args || !command.argsMenu) {
    return null;
  }
  if (command.argsParsing === "none") {
    return null;
  }
  var argSpec = command.argsMenu;
  var argName =
    argSpec === "auto"
      ? (_a = command.args.find(function (arg) {
          return resolveCommandArgChoices({ command: command, arg: arg, cfg: cfg }).length > 0;
        })) === null || _a === void 0
        ? void 0
        : _a.name
      : argSpec.arg;
  if (!argName) {
    return null;
  }
  if ((args === null || args === void 0 ? void 0 : args.values) && args.values[argName] != null) {
    return null;
  }
  if ((args === null || args === void 0 ? void 0 : args.raw) && !args.values) {
    return null;
  }
  var arg = command.args.find(function (entry) {
    return entry.name === argName;
  });
  if (!arg) {
    return null;
  }
  var choices = resolveCommandArgChoices({ command: command, arg: arg, cfg: cfg });
  if (choices.length === 0) {
    return null;
  }
  var title = argSpec !== "auto" ? argSpec.title : undefined;
  return { arg: arg, choices: choices, title: title };
}
function normalizeCommandBody(raw, options) {
  var _a, _b;
  var trimmed = raw.trim();
  if (!trimmed.startsWith("/")) {
    return trimmed;
  }
  var newline = trimmed.indexOf("\n");
  var singleLine = newline === -1 ? trimmed : trimmed.slice(0, newline).trim();
  var colonMatch = singleLine.match(/^\/([^\s:]+)\s*:(.*)$/);
  var normalized = colonMatch
    ? (function () {
        var command = colonMatch[1],
          rest = colonMatch[2];
        var normalizedRest = rest.trimStart();
        return normalizedRest
          ? "/".concat(command, " ").concat(normalizedRest)
          : "/".concat(command);
      })()
    : singleLine;
  var normalizedBotUsername =
    (_a = options === null || options === void 0 ? void 0 : options.botUsername) === null ||
    _a === void 0
      ? void 0
      : _a.trim().toLowerCase();
  var mentionMatch = normalizedBotUsername ? normalized.match(/^\/([^\s@]+)@([^\s]+)(.*)$/) : null;
  var commandBody =
    mentionMatch && mentionMatch[2].toLowerCase() === normalizedBotUsername
      ? "/"
          .concat(mentionMatch[1])
          .concat((_b = mentionMatch[3]) !== null && _b !== void 0 ? _b : "")
      : normalized;
  var lowered = commandBody.toLowerCase();
  var textAliasMap = getTextAliasMap();
  var exact = textAliasMap.get(lowered);
  if (exact) {
    return exact.canonical;
  }
  var tokenMatch = commandBody.match(/^\/([^\s]+)(?:\s+([\s\S]+))?$/);
  if (!tokenMatch) {
    return commandBody;
  }
  var token = tokenMatch[1],
    rest = tokenMatch[2];
  var tokenKey = "/".concat(token.toLowerCase());
  var tokenSpec = textAliasMap.get(tokenKey);
  if (!tokenSpec) {
    return commandBody;
  }
  if (rest && !tokenSpec.acceptsArgs) {
    return commandBody;
  }
  var normalizedRest = rest === null || rest === void 0 ? void 0 : rest.trimStart();
  return normalizedRest
    ? "".concat(tokenSpec.canonical, " ").concat(normalizedRest)
    : tokenSpec.canonical;
}
function isCommandMessage(raw) {
  var trimmed = normalizeCommandBody(raw);
  return trimmed.startsWith("/");
}
function getCommandDetection(_cfg) {
  var commands = (0, commands_registry_data_js_1.getChatCommands)();
  if (cachedDetection && cachedDetectionCommands === commands) {
    return cachedDetection;
  }
  var exact = new Set();
  var patterns = [];
  for (var _i = 0, commands_2 = commands; _i < commands_2.length; _i++) {
    var cmd = commands_2[_i];
    for (var _a = 0, _b = cmd.textAliases; _a < _b.length; _a++) {
      var alias = _b[_a];
      var normalized = alias.trim().toLowerCase();
      if (!normalized) {
        continue;
      }
      exact.add(normalized);
      var escaped = escapeRegExp(normalized);
      if (!escaped) {
        continue;
      }
      if (cmd.acceptsArgs) {
        patterns.push("".concat(escaped, "(?:\\s+.+|\\s*:\\s*.*)?"));
      } else {
        patterns.push("".concat(escaped, "(?:\\s*:\\s*)?"));
      }
    }
  }
  cachedDetection = {
    exact: exact,
    regex: patterns.length ? new RegExp("^(?:".concat(patterns.join("|"), ")$"), "i") : /$^/,
  };
  cachedDetectionCommands = commands;
  return cachedDetection;
}
function maybeResolveTextAlias(raw, cfg) {
  var trimmed = normalizeCommandBody(raw).trim();
  if (!trimmed.startsWith("/")) {
    return null;
  }
  var detection = getCommandDetection(cfg);
  var normalized = trimmed.toLowerCase();
  if (detection.exact.has(normalized)) {
    return normalized;
  }
  if (!detection.regex.test(normalized)) {
    return null;
  }
  var tokenMatch = normalized.match(/^\/([^\s:]+)(?:\s|$)/);
  if (!tokenMatch) {
    return null;
  }
  var tokenKey = "/".concat(tokenMatch[1]);
  return getTextAliasMap().has(tokenKey) ? tokenKey : null;
}
function resolveTextCommand(raw, cfg) {
  var trimmed = normalizeCommandBody(raw).trim();
  var alias = maybeResolveTextAlias(trimmed, cfg);
  if (!alias) {
    return null;
  }
  var spec = getTextAliasMap().get(alias);
  if (!spec) {
    return null;
  }
  var command = (0, commands_registry_data_js_1.getChatCommands)().find(function (entry) {
    return entry.key === spec.key;
  });
  if (!command) {
    return null;
  }
  if (!spec.acceptsArgs) {
    return { command: command };
  }
  var args = trimmed.slice(alias.length).trim();
  return { command: command, args: args || undefined };
}
function isNativeCommandSurface(surface) {
  if (!surface) {
    return false;
  }
  return (0, commands_registry_data_js_1.getNativeCommandSurfaces)().has(surface.toLowerCase());
}
function shouldHandleTextCommands(params) {
  var _a;
  if (params.commandSource === "native") {
    return true;
  }
  if (((_a = params.cfg.commands) === null || _a === void 0 ? void 0 : _a.text) !== false) {
    return true;
  }
  return !isNativeCommandSurface(params.surface);
}
