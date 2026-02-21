"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveReplyContext = resolveReplyContext;
exports.buildDirectLabel = buildDirectLabel;
exports.buildGuildLabel = buildGuildLabel;
var envelope_js_1 = require("../../auto-reply/envelope.js");
var format_js_1 = require("./format.js");
function resolveReplyContext(message, resolveDiscordMessageText, options) {
  var _a, _b;
  var referenced = message.referencedMessage;
  if (!(referenced === null || referenced === void 0 ? void 0 : referenced.author)) {
    return null;
  }
  var referencedText = resolveDiscordMessageText(referenced, {
    includeForwarded: true,
  });
  if (!referencedText) {
    return null;
  }
  var fromLabel = referenced.author ? buildDirectLabel(referenced.author) : "Unknown";
  var body = ""
    .concat(referencedText, "\n[discord message id: ")
    .concat(referenced.id, " channel: ")
    .concat(referenced.channelId, " from: ")
    .concat((0, format_js_1.formatDiscordUserTag)(referenced.author), " user id:")
    .concat(
      (_b = (_a = referenced.author) === null || _a === void 0 ? void 0 : _a.id) !== null &&
        _b !== void 0
        ? _b
        : "unknown",
      "]",
    );
  return (0, envelope_js_1.formatAgentEnvelope)({
    channel: "Discord",
    from: fromLabel,
    timestamp: (0, format_js_1.resolveTimestampMs)(referenced.timestamp),
    body: body,
    envelope: options === null || options === void 0 ? void 0 : options.envelope,
  });
}
function buildDirectLabel(author) {
  var username = (0, format_js_1.formatDiscordUserTag)(author);
  return "".concat(username, " user id:").concat(author.id);
}
function buildGuildLabel(params) {
  var _a;
  var guild = params.guild,
    channelName = params.channelName,
    channelId = params.channelId;
  return ""
    .concat(
      (_a = guild === null || guild === void 0 ? void 0 : guild.name) !== null && _a !== void 0
        ? _a
        : "Guild",
      " #",
    )
    .concat(channelName, " channel id:")
    .concat(channelId);
}
