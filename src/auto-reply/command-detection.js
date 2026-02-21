"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasControlCommand = hasControlCommand;
exports.isControlCommandMessage = isControlCommandMessage;
exports.hasInlineCommandTokens = hasInlineCommandTokens;
exports.shouldComputeCommandAuthorized = shouldComputeCommandAuthorized;
var commands_registry_js_1 = require("./commands-registry.js");
var abort_js_1 = require("./reply/abort.js");
function hasControlCommand(text, cfg, options) {
  if (!text) {
    return false;
  }
  var trimmed = text.trim();
  if (!trimmed) {
    return false;
  }
  var normalizedBody = (0, commands_registry_js_1.normalizeCommandBody)(trimmed, options);
  if (!normalizedBody) {
    return false;
  }
  var lowered = normalizedBody.toLowerCase();
  var commands = cfg
    ? (0, commands_registry_js_1.listChatCommandsForConfig)(cfg)
    : (0, commands_registry_js_1.listChatCommands)();
  for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
    var command = commands_1[_i];
    for (var _a = 0, _b = command.textAliases; _a < _b.length; _a++) {
      var alias = _b[_a];
      var normalized = alias.trim().toLowerCase();
      if (!normalized) {
        continue;
      }
      if (lowered === normalized) {
        return true;
      }
      if (command.acceptsArgs && lowered.startsWith(normalized)) {
        var nextChar = normalizedBody.charAt(normalized.length);
        if (nextChar && /\s/.test(nextChar)) {
          return true;
        }
      }
    }
  }
  return false;
}
function isControlCommandMessage(text, cfg, options) {
  if (!text) {
    return false;
  }
  var trimmed = text.trim();
  if (!trimmed) {
    return false;
  }
  if (hasControlCommand(trimmed, cfg, options)) {
    return true;
  }
  var normalized = (0, commands_registry_js_1.normalizeCommandBody)(trimmed, options)
    .trim()
    .toLowerCase();
  return (0, abort_js_1.isAbortTrigger)(normalized);
}
/**
 * Coarse detection for inline directives/shortcuts (e.g. "hey /status") so channel monitors
 * can decide whether to compute CommandAuthorized for a message.
 *
 * This intentionally errs on the side of false positives; CommandAuthorized only gates
 * command/directive execution, not normal chat replies.
 */
function hasInlineCommandTokens(text) {
  var body = text !== null && text !== void 0 ? text : "";
  if (!body.trim()) {
    return false;
  }
  return /(?:^|\s)[/!][a-z]/i.test(body);
}
function shouldComputeCommandAuthorized(text, cfg, options) {
  return isControlCommandMessage(text, cfg, options) || hasInlineCommandTokens(text);
}
