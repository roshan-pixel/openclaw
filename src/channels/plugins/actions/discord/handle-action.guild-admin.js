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
exports.tryHandleDiscordMessageActionGuildAdmin = tryHandleDiscordMessageActionGuildAdmin;
var common_js_1 = require("../../../../agents/tools/common.js");
var discord_actions_js_1 = require("../../../../agents/tools/discord-actions.js");
function tryHandleDiscordMessageActionGuildAdmin(params) {
    return __awaiter(this, void 0, void 0, function () {
        var ctx, resolveChannelId, readParentIdParam, action, actionParams, cfg, accountId, userId, guildId, guildId, guildId, guildId, name_1, mediaUrl, roleIds, guildId, name_2, description, tags, mediaUrl, guildId, userId, roleId, channelId, guildId, guildId, name_3, type, parentId, topic, position, nsfw, channelId, name_4, topic, position, parentId, nsfw, rateLimitPerUser, channelId, guildId, channelId, parentId, position, guildId, name_5, position, categoryId, name_6, position, categoryId, guildId, userId, guildId, guildId, name_7, startTime, endTime, description, channelId, location_1, entityType, guildId, userId, durationMinutes, until, reason, deleteMessageDays, discordAction, guildId, channelId, includeArchived, before, limit, content, mediaUrl, replyTo, threadId, channelId, guildId, query;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ctx = params.ctx, resolveChannelId = params.resolveChannelId, readParentIdParam = params.readParentIdParam;
                    action = ctx.action, actionParams = ctx.params, cfg = ctx.cfg;
                    accountId = (_a = ctx.accountId) !== null && _a !== void 0 ? _a : (0, common_js_1.readStringParam)(actionParams, "accountId");
                    if (!(action === "member-info")) return [3 /*break*/, 2];
                    userId = (0, common_js_1.readStringParam)(actionParams, "userId", { required: true });
                    guildId = (0, common_js_1.readStringParam)(actionParams, "guildId", {
                        required: true,
                    });
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({ action: "memberInfo", accountId: accountId !== null && accountId !== void 0 ? accountId : undefined, guildId: guildId, userId: userId }, cfg)];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    if (!(action === "role-info")) return [3 /*break*/, 4];
                    guildId = (0, common_js_1.readStringParam)(actionParams, "guildId", {
                        required: true,
                    });
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({ action: "roleInfo", accountId: accountId !== null && accountId !== void 0 ? accountId : undefined, guildId: guildId }, cfg)];
                case 3: return [2 /*return*/, _b.sent()];
                case 4:
                    if (!(action === "emoji-list")) return [3 /*break*/, 6];
                    guildId = (0, common_js_1.readStringParam)(actionParams, "guildId", {
                        required: true,
                    });
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({ action: "emojiList", accountId: accountId !== null && accountId !== void 0 ? accountId : undefined, guildId: guildId }, cfg)];
                case 5: return [2 /*return*/, _b.sent()];
                case 6:
                    if (!(action === "emoji-upload")) return [3 /*break*/, 8];
                    guildId = (0, common_js_1.readStringParam)(actionParams, "guildId", {
                        required: true,
                    });
                    name_1 = (0, common_js_1.readStringParam)(actionParams, "emojiName", { required: true });
                    mediaUrl = (0, common_js_1.readStringParam)(actionParams, "media", {
                        required: true,
                        trim: false,
                    });
                    roleIds = (0, common_js_1.readStringArrayParam)(actionParams, "roleIds");
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({
                            action: "emojiUpload",
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            guildId: guildId,
                            name: name_1,
                            mediaUrl: mediaUrl,
                            roleIds: roleIds,
                        }, cfg)];
                case 7: return [2 /*return*/, _b.sent()];
                case 8:
                    if (!(action === "sticker-upload")) return [3 /*break*/, 10];
                    guildId = (0, common_js_1.readStringParam)(actionParams, "guildId", {
                        required: true,
                    });
                    name_2 = (0, common_js_1.readStringParam)(actionParams, "stickerName", {
                        required: true,
                    });
                    description = (0, common_js_1.readStringParam)(actionParams, "stickerDesc", {
                        required: true,
                    });
                    tags = (0, common_js_1.readStringParam)(actionParams, "stickerTags", {
                        required: true,
                    });
                    mediaUrl = (0, common_js_1.readStringParam)(actionParams, "media", {
                        required: true,
                        trim: false,
                    });
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({
                            action: "stickerUpload",
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            guildId: guildId,
                            name: name_2,
                            description: description,
                            tags: tags,
                            mediaUrl: mediaUrl,
                        }, cfg)];
                case 9: return [2 /*return*/, _b.sent()];
                case 10:
                    if (!(action === "role-add" || action === "role-remove")) return [3 /*break*/, 12];
                    guildId = (0, common_js_1.readStringParam)(actionParams, "guildId", {
                        required: true,
                    });
                    userId = (0, common_js_1.readStringParam)(actionParams, "userId", { required: true });
                    roleId = (0, common_js_1.readStringParam)(actionParams, "roleId", { required: true });
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({
                            action: action === "role-add" ? "roleAdd" : "roleRemove",
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            guildId: guildId,
                            userId: userId,
                            roleId: roleId,
                        }, cfg)];
                case 11: return [2 /*return*/, _b.sent()];
                case 12:
                    if (!(action === "channel-info")) return [3 /*break*/, 14];
                    channelId = (0, common_js_1.readStringParam)(actionParams, "channelId", {
                        required: true,
                    });
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({ action: "channelInfo", accountId: accountId !== null && accountId !== void 0 ? accountId : undefined, channelId: channelId }, cfg)];
                case 13: return [2 /*return*/, _b.sent()];
                case 14:
                    if (!(action === "channel-list")) return [3 /*break*/, 16];
                    guildId = (0, common_js_1.readStringParam)(actionParams, "guildId", {
                        required: true,
                    });
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({ action: "channelList", accountId: accountId !== null && accountId !== void 0 ? accountId : undefined, guildId: guildId }, cfg)];
                case 15: return [2 /*return*/, _b.sent()];
                case 16:
                    if (!(action === "channel-create")) return [3 /*break*/, 18];
                    guildId = (0, common_js_1.readStringParam)(actionParams, "guildId", {
                        required: true,
                    });
                    name_3 = (0, common_js_1.readStringParam)(actionParams, "name", { required: true });
                    type = (0, common_js_1.readNumberParam)(actionParams, "type", { integer: true });
                    parentId = readParentIdParam(actionParams);
                    topic = (0, common_js_1.readStringParam)(actionParams, "topic");
                    position = (0, common_js_1.readNumberParam)(actionParams, "position", {
                        integer: true,
                    });
                    nsfw = typeof actionParams.nsfw === "boolean" ? actionParams.nsfw : undefined;
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({
                            action: "channelCreate",
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            guildId: guildId,
                            name: name_3,
                            type: type !== null && type !== void 0 ? type : undefined,
                            parentId: parentId !== null && parentId !== void 0 ? parentId : undefined,
                            topic: topic !== null && topic !== void 0 ? topic : undefined,
                            position: position !== null && position !== void 0 ? position : undefined,
                            nsfw: nsfw,
                        }, cfg)];
                case 17: return [2 /*return*/, _b.sent()];
                case 18:
                    if (!(action === "channel-edit")) return [3 /*break*/, 20];
                    channelId = (0, common_js_1.readStringParam)(actionParams, "channelId", {
                        required: true,
                    });
                    name_4 = (0, common_js_1.readStringParam)(actionParams, "name");
                    topic = (0, common_js_1.readStringParam)(actionParams, "topic");
                    position = (0, common_js_1.readNumberParam)(actionParams, "position", {
                        integer: true,
                    });
                    parentId = readParentIdParam(actionParams);
                    nsfw = typeof actionParams.nsfw === "boolean" ? actionParams.nsfw : undefined;
                    rateLimitPerUser = (0, common_js_1.readNumberParam)(actionParams, "rateLimitPerUser", {
                        integer: true,
                    });
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({
                            action: "channelEdit",
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            channelId: channelId,
                            name: name_4 !== null && name_4 !== void 0 ? name_4 : undefined,
                            topic: topic !== null && topic !== void 0 ? topic : undefined,
                            position: position !== null && position !== void 0 ? position : undefined,
                            parentId: parentId === undefined ? undefined : parentId,
                            nsfw: nsfw,
                            rateLimitPerUser: rateLimitPerUser !== null && rateLimitPerUser !== void 0 ? rateLimitPerUser : undefined,
                        }, cfg)];
                case 19: return [2 /*return*/, _b.sent()];
                case 20:
                    if (!(action === "channel-delete")) return [3 /*break*/, 22];
                    channelId = (0, common_js_1.readStringParam)(actionParams, "channelId", {
                        required: true,
                    });
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({ action: "channelDelete", accountId: accountId !== null && accountId !== void 0 ? accountId : undefined, channelId: channelId }, cfg)];
                case 21: return [2 /*return*/, _b.sent()];
                case 22:
                    if (!(action === "channel-move")) return [3 /*break*/, 24];
                    guildId = (0, common_js_1.readStringParam)(actionParams, "guildId", {
                        required: true,
                    });
                    channelId = (0, common_js_1.readStringParam)(actionParams, "channelId", {
                        required: true,
                    });
                    parentId = readParentIdParam(actionParams);
                    position = (0, common_js_1.readNumberParam)(actionParams, "position", {
                        integer: true,
                    });
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({
                            action: "channelMove",
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            guildId: guildId,
                            channelId: channelId,
                            parentId: parentId === undefined ? undefined : parentId,
                            position: position !== null && position !== void 0 ? position : undefined,
                        }, cfg)];
                case 23: return [2 /*return*/, _b.sent()];
                case 24:
                    if (!(action === "category-create")) return [3 /*break*/, 26];
                    guildId = (0, common_js_1.readStringParam)(actionParams, "guildId", {
                        required: true,
                    });
                    name_5 = (0, common_js_1.readStringParam)(actionParams, "name", { required: true });
                    position = (0, common_js_1.readNumberParam)(actionParams, "position", {
                        integer: true,
                    });
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({
                            action: "categoryCreate",
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            guildId: guildId,
                            name: name_5,
                            position: position !== null && position !== void 0 ? position : undefined,
                        }, cfg)];
                case 25: return [2 /*return*/, _b.sent()];
                case 26:
                    if (!(action === "category-edit")) return [3 /*break*/, 28];
                    categoryId = (0, common_js_1.readStringParam)(actionParams, "categoryId", {
                        required: true,
                    });
                    name_6 = (0, common_js_1.readStringParam)(actionParams, "name");
                    position = (0, common_js_1.readNumberParam)(actionParams, "position", {
                        integer: true,
                    });
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({
                            action: "categoryEdit",
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            categoryId: categoryId,
                            name: name_6 !== null && name_6 !== void 0 ? name_6 : undefined,
                            position: position !== null && position !== void 0 ? position : undefined,
                        }, cfg)];
                case 27: return [2 /*return*/, _b.sent()];
                case 28:
                    if (!(action === "category-delete")) return [3 /*break*/, 30];
                    categoryId = (0, common_js_1.readStringParam)(actionParams, "categoryId", {
                        required: true,
                    });
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({ action: "categoryDelete", accountId: accountId !== null && accountId !== void 0 ? accountId : undefined, categoryId: categoryId }, cfg)];
                case 29: return [2 /*return*/, _b.sent()];
                case 30:
                    if (!(action === "voice-status")) return [3 /*break*/, 32];
                    guildId = (0, common_js_1.readStringParam)(actionParams, "guildId", {
                        required: true,
                    });
                    userId = (0, common_js_1.readStringParam)(actionParams, "userId", { required: true });
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({ action: "voiceStatus", accountId: accountId !== null && accountId !== void 0 ? accountId : undefined, guildId: guildId, userId: userId }, cfg)];
                case 31: return [2 /*return*/, _b.sent()];
                case 32:
                    if (!(action === "event-list")) return [3 /*break*/, 34];
                    guildId = (0, common_js_1.readStringParam)(actionParams, "guildId", {
                        required: true,
                    });
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({ action: "eventList", accountId: accountId !== null && accountId !== void 0 ? accountId : undefined, guildId: guildId }, cfg)];
                case 33: return [2 /*return*/, _b.sent()];
                case 34:
                    if (!(action === "event-create")) return [3 /*break*/, 36];
                    guildId = (0, common_js_1.readStringParam)(actionParams, "guildId", {
                        required: true,
                    });
                    name_7 = (0, common_js_1.readStringParam)(actionParams, "eventName", { required: true });
                    startTime = (0, common_js_1.readStringParam)(actionParams, "startTime", {
                        required: true,
                    });
                    endTime = (0, common_js_1.readStringParam)(actionParams, "endTime");
                    description = (0, common_js_1.readStringParam)(actionParams, "desc");
                    channelId = (0, common_js_1.readStringParam)(actionParams, "channelId");
                    location_1 = (0, common_js_1.readStringParam)(actionParams, "location");
                    entityType = (0, common_js_1.readStringParam)(actionParams, "eventType");
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({
                            action: "eventCreate",
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            guildId: guildId,
                            name: name_7,
                            startTime: startTime,
                            endTime: endTime,
                            description: description,
                            channelId: channelId,
                            location: location_1,
                            entityType: entityType,
                        }, cfg)];
                case 35: return [2 /*return*/, _b.sent()];
                case 36:
                    if (!(action === "timeout" || action === "kick" || action === "ban")) return [3 /*break*/, 38];
                    guildId = (0, common_js_1.readStringParam)(actionParams, "guildId", {
                        required: true,
                    });
                    userId = (0, common_js_1.readStringParam)(actionParams, "userId", { required: true });
                    durationMinutes = (0, common_js_1.readNumberParam)(actionParams, "durationMin", {
                        integer: true,
                    });
                    until = (0, common_js_1.readStringParam)(actionParams, "until");
                    reason = (0, common_js_1.readStringParam)(actionParams, "reason");
                    deleteMessageDays = (0, common_js_1.readNumberParam)(actionParams, "deleteDays", {
                        integer: true,
                    });
                    discordAction = action;
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({
                            action: discordAction,
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            guildId: guildId,
                            userId: userId,
                            durationMinutes: durationMinutes,
                            until: until,
                            reason: reason,
                            deleteMessageDays: deleteMessageDays,
                        }, cfg)];
                case 37: return [2 /*return*/, _b.sent()];
                case 38:
                    if (!(action === "thread-list")) return [3 /*break*/, 40];
                    guildId = (0, common_js_1.readStringParam)(actionParams, "guildId", {
                        required: true,
                    });
                    channelId = (0, common_js_1.readStringParam)(actionParams, "channelId");
                    includeArchived = typeof actionParams.includeArchived === "boolean" ? actionParams.includeArchived : undefined;
                    before = (0, common_js_1.readStringParam)(actionParams, "before");
                    limit = (0, common_js_1.readNumberParam)(actionParams, "limit", { integer: true });
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({
                            action: "threadList",
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            guildId: guildId,
                            channelId: channelId,
                            includeArchived: includeArchived,
                            before: before,
                            limit: limit,
                        }, cfg)];
                case 39: return [2 /*return*/, _b.sent()];
                case 40:
                    if (!(action === "thread-reply")) return [3 /*break*/, 42];
                    content = (0, common_js_1.readStringParam)(actionParams, "message", {
                        required: true,
                    });
                    mediaUrl = (0, common_js_1.readStringParam)(actionParams, "media", { trim: false });
                    replyTo = (0, common_js_1.readStringParam)(actionParams, "replyTo");
                    threadId = (0, common_js_1.readStringParam)(actionParams, "threadId");
                    channelId = threadId !== null && threadId !== void 0 ? threadId : resolveChannelId();
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({
                            action: "threadReply",
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            channelId: channelId,
                            content: content,
                            mediaUrl: mediaUrl !== null && mediaUrl !== void 0 ? mediaUrl : undefined,
                            replyTo: replyTo !== null && replyTo !== void 0 ? replyTo : undefined,
                        }, cfg)];
                case 41: return [2 /*return*/, _b.sent()];
                case 42:
                    if (!(action === "search")) return [3 /*break*/, 44];
                    guildId = (0, common_js_1.readStringParam)(actionParams, "guildId", {
                        required: true,
                    });
                    query = (0, common_js_1.readStringParam)(actionParams, "query", { required: true });
                    return [4 /*yield*/, (0, discord_actions_js_1.handleDiscordAction)({
                            action: "searchMessages",
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            guildId: guildId,
                            content: query,
                            channelId: (0, common_js_1.readStringParam)(actionParams, "channelId"),
                            channelIds: (0, common_js_1.readStringArrayParam)(actionParams, "channelIds"),
                            authorId: (0, common_js_1.readStringParam)(actionParams, "authorId"),
                            authorIds: (0, common_js_1.readStringArrayParam)(actionParams, "authorIds"),
                            limit: (0, common_js_1.readNumberParam)(actionParams, "limit", { integer: true }),
                        }, cfg)];
                case 43: return [2 /*return*/, _b.sent()];
                case 44: return [2 /*return*/, undefined];
            }
        });
    });
}
