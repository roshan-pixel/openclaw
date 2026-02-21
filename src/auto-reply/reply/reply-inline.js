"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractInlineSimpleCommand = extractInlineSimpleCommand;
exports.stripInlineStatus = stripInlineStatus;
var INLINE_SIMPLE_COMMAND_ALIASES = new Map([
  ["/help", "/help"],
  ["/commands", "/commands"],
  ["/whoami", "/whoami"],
  ["/id", "/whoami"],
]);
var INLINE_SIMPLE_COMMAND_RE = /(?:^|\s)\/(help|commands|whoami|id)(?=$|\s|:)/i;
var INLINE_STATUS_RE = /(?:^|\s)\/status(?=$|\s|:)(?:\s*:\s*)?/gi;
function extractInlineSimpleCommand(body) {
  if (!body) {
    return null;
  }
  var match = body.match(INLINE_SIMPLE_COMMAND_RE);
  if (!match || match.index === undefined) {
    return null;
  }
  var alias = "/".concat(match[1].toLowerCase());
  var command = INLINE_SIMPLE_COMMAND_ALIASES.get(alias);
  if (!command) {
    return null;
  }
  var cleaned = body.replace(match[0], " ").replace(/\s+/g, " ").trim();
  return { command: command, cleaned: cleaned };
}
function stripInlineStatus(body) {
  var trimmed = body.trim();
  if (!trimmed) {
    return { cleaned: "", didStrip: false };
  }
  var cleaned = trimmed.replace(INLINE_STATUS_RE, " ").replace(/\s+/g, " ").trim();
  return { cleaned: cleaned, didStrip: cleaned !== trimmed };
}
