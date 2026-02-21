"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDiscordSystemLocation = resolveDiscordSystemLocation;
exports.formatDiscordReactionEmoji = formatDiscordReactionEmoji;
exports.formatDiscordUserTag = formatDiscordUserTag;
exports.resolveTimestampMs = resolveTimestampMs;
function resolveDiscordSystemLocation(params) {
  var isDirectMessage = params.isDirectMessage,
    isGroupDm = params.isGroupDm,
    guild = params.guild,
    channelName = params.channelName;
  if (isDirectMessage) {
    return "DM";
  }
  if (isGroupDm) {
    return "Group DM #".concat(channelName);
  }
  return (guild === null || guild === void 0 ? void 0 : guild.name)
    ? "".concat(guild.name, " #").concat(channelName)
    : "#".concat(channelName);
}
function formatDiscordReactionEmoji(emoji) {
  var _a;
  if (emoji.id && emoji.name) {
    return "".concat(emoji.name, ":").concat(emoji.id);
  }
  return (_a = emoji.name) !== null && _a !== void 0 ? _a : "emoji";
}
function formatDiscordUserTag(user) {
  var _a, _b;
  var discriminator = ((_a = user.discriminator) !== null && _a !== void 0 ? _a : "").trim();
  if (discriminator && discriminator !== "0") {
    return "".concat(user.username, "#").concat(discriminator);
  }
  return (_b = user.username) !== null && _b !== void 0 ? _b : user.id;
}
function resolveTimestampMs(timestamp) {
  if (!timestamp) {
    return undefined;
  }
  var parsed = Date.parse(timestamp);
  return Number.isNaN(parsed) ? undefined : parsed;
}
