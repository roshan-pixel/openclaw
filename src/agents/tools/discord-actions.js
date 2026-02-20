"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDiscordAction = handleDiscordAction;
var common_js_1 = require("./common.js");
var discord_actions_guild_js_1 = require("./discord-actions-guild.js");
var discord_actions_messaging_js_1 = require("./discord-actions-messaging.js");
var discord_actions_moderation_js_1 = require("./discord-actions-moderation.js");
var messagingActions = new Set([
    "react",
    "reactions",
    "sticker",
    "poll",
    "permissions",
    "fetchMessage",
    "readMessages",
    "sendMessage",
    "editMessage",
    "deleteMessage",
    "threadCreate",
    "threadList",
    "threadReply",
    "pinMessage",
    "unpinMessage",
    "listPins",
    "searchMessages",
]);
var guildActions = new Set([
    "memberInfo",
    "roleInfo",
    "emojiList",
    "emojiUpload",
    "stickerUpload",
    "roleAdd",
    "roleRemove",
    "channelInfo",
    "channelList",
    "voiceStatus",
    "eventList",
    "eventCreate",
    "channelCreate",
    "channelEdit",
    "channelDelete",
    "channelMove",
    "categoryCreate",
    "categoryEdit",
    "categoryDelete",
    "channelPermissionSet",
    "channelPermissionRemove",
]);
var moderationActions = new Set(["timeout", "kick", "ban"]);
function handleDiscordAction(params, cfg) {
    return __awaiter(this, void 0, void 0, function () {
        var action, isActionEnabled;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    action = (0, common_js_1.readStringParam)(params, "action", { required: true });
                    isActionEnabled = (0, common_js_1.createActionGate)((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.discord) === null || _b === void 0 ? void 0 : _b.actions);
                    if (!messagingActions.has(action)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, discord_actions_messaging_js_1.handleDiscordMessagingAction)(action, params, isActionEnabled)];
                case 1: return [2 /*return*/, _c.sent()];
                case 2:
                    if (!guildActions.has(action)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, discord_actions_guild_js_1.handleDiscordGuildAction)(action, params, isActionEnabled)];
                case 3: return [2 /*return*/, _c.sent()];
                case 4:
                    if (!moderationActions.has(action)) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, discord_actions_moderation_js_1.handleDiscordModerationAction)(action, params, isActionEnabled)];
                case 5: return [2 /*return*/, _c.sent()];
                case 6: throw new Error("Unknown action: ".concat(action));
            }
        });
    });
}
