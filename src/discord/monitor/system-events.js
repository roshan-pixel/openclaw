"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDiscordSystemEvent = resolveDiscordSystemEvent;
var carbon_1 = require("@buape/carbon");
var format_js_1 = require("./format.js");
function resolveDiscordSystemEvent(message, location) {
    switch (message.type) {
        case carbon_1.MessageType.ChannelPinnedMessage:
            return buildDiscordSystemEvent(message, location, "pinned a message");
        case carbon_1.MessageType.RecipientAdd:
            return buildDiscordSystemEvent(message, location, "added a recipient");
        case carbon_1.MessageType.RecipientRemove:
            return buildDiscordSystemEvent(message, location, "removed a recipient");
        case carbon_1.MessageType.UserJoin:
            return buildDiscordSystemEvent(message, location, "user joined");
        case carbon_1.MessageType.GuildBoost:
            return buildDiscordSystemEvent(message, location, "boosted the server");
        case carbon_1.MessageType.GuildBoostTier1:
            return buildDiscordSystemEvent(message, location, "boosted the server (Tier 1 reached)");
        case carbon_1.MessageType.GuildBoostTier2:
            return buildDiscordSystemEvent(message, location, "boosted the server (Tier 2 reached)");
        case carbon_1.MessageType.GuildBoostTier3:
            return buildDiscordSystemEvent(message, location, "boosted the server (Tier 3 reached)");
        case carbon_1.MessageType.ThreadCreated:
            return buildDiscordSystemEvent(message, location, "created a thread");
        case carbon_1.MessageType.AutoModerationAction:
            return buildDiscordSystemEvent(message, location, "auto moderation action");
        case carbon_1.MessageType.GuildIncidentAlertModeEnabled:
            return buildDiscordSystemEvent(message, location, "raid protection enabled");
        case carbon_1.MessageType.GuildIncidentAlertModeDisabled:
            return buildDiscordSystemEvent(message, location, "raid protection disabled");
        case carbon_1.MessageType.GuildIncidentReportRaid:
            return buildDiscordSystemEvent(message, location, "raid reported");
        case carbon_1.MessageType.GuildIncidentReportFalseAlarm:
            return buildDiscordSystemEvent(message, location, "raid report marked false alarm");
        case carbon_1.MessageType.StageStart:
            return buildDiscordSystemEvent(message, location, "stage started");
        case carbon_1.MessageType.StageEnd:
            return buildDiscordSystemEvent(message, location, "stage ended");
        case carbon_1.MessageType.StageSpeaker:
            return buildDiscordSystemEvent(message, location, "stage speaker updated");
        case carbon_1.MessageType.StageTopic:
            return buildDiscordSystemEvent(message, location, "stage topic updated");
        case carbon_1.MessageType.PollResult:
            return buildDiscordSystemEvent(message, location, "poll results posted");
        case carbon_1.MessageType.PurchaseNotification:
            return buildDiscordSystemEvent(message, location, "purchase notification");
        default:
            return null;
    }
}
function buildDiscordSystemEvent(message, location, action) {
    var authorLabel = message.author ? (0, format_js_1.formatDiscordUserTag)(message.author) : "";
    var actor = authorLabel ? "".concat(authorLabel, " ") : "";
    return "Discord system: ".concat(actor).concat(action, " in ").concat(location);
}
