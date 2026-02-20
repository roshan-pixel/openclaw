"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSlackMonitorEvents = registerSlackMonitorEvents;
var channels_js_1 = require("./events/channels.js");
var members_js_1 = require("./events/members.js");
var messages_js_1 = require("./events/messages.js");
var pins_js_1 = require("./events/pins.js");
var reactions_js_1 = require("./events/reactions.js");
function registerSlackMonitorEvents(params) {
    (0, messages_js_1.registerSlackMessageEvents)({
        ctx: params.ctx,
        handleSlackMessage: params.handleSlackMessage,
    });
    (0, reactions_js_1.registerSlackReactionEvents)({ ctx: params.ctx });
    (0, members_js_1.registerSlackMemberEvents)({ ctx: params.ctx });
    (0, channels_js_1.registerSlackChannelEvents)({ ctx: params.ctx });
    (0, pins_js_1.registerSlackPinEvents)({ ctx: params.ctx });
}
