"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTelegramAllowedUpdates = resolveTelegramAllowedUpdates;
var grammy_1 = require("grammy");
function resolveTelegramAllowedUpdates() {
    var updates = __spreadArray([], grammy_1.API_CONSTANTS.DEFAULT_UPDATE_TYPES, true);
    if (!updates.includes("message_reaction")) {
        updates.push("message_reaction");
    }
    return updates;
}
