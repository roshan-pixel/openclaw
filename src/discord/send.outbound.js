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
exports.sendMessageDiscord = sendMessageDiscord;
exports.sendStickerDiscord = sendStickerDiscord;
exports.sendPollDiscord = sendPollDiscord;
var v10_1 = require("discord-api-types/v10");
var chunk_js_1 = require("../auto-reply/chunk.js");
var config_js_1 = require("../config/config.js");
var markdown_tables_js_1 = require("../config/markdown-tables.js");
var channel_activity_js_1 = require("../infra/channel-activity.js");
var tables_js_1 = require("../markdown/tables.js");
var accounts_js_1 = require("./accounts.js");
var send_shared_js_1 = require("./send.shared.js");
function sendMessageDiscord(to_1, text_1) {
    return __awaiter(this, arguments, void 0, function (to, text, opts) {
        var cfg, accountInfo, tableMode, chunkMode, textWithTables, _a, token, rest, request, recipient, channelId, result, err_1;
        var _b;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = (0, config_js_1.loadConfig)();
                    accountInfo = (0, accounts_js_1.resolveDiscordAccount)({
                        cfg: cfg,
                        accountId: opts.accountId,
                    });
                    tableMode = (0, markdown_tables_js_1.resolveMarkdownTableMode)({
                        cfg: cfg,
                        channel: "discord",
                        accountId: accountInfo.accountId,
                    });
                    chunkMode = (0, chunk_js_1.resolveChunkMode)(cfg, "discord", accountInfo.accountId);
                    textWithTables = (0, tables_js_1.convertMarkdownTables)(text !== null && text !== void 0 ? text : "", tableMode);
                    _a = (0, send_shared_js_1.createDiscordClient)(opts, cfg), token = _a.token, rest = _a.rest, request = _a.request;
                    return [4 /*yield*/, (0, send_shared_js_1.parseAndResolveRecipient)(to, opts.accountId)];
                case 1:
                    recipient = _c.sent();
                    return [4 /*yield*/, (0, send_shared_js_1.resolveChannelId)(rest, recipient, request)];
                case 2:
                    channelId = (_c.sent()).channelId;
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 8, , 10]);
                    if (!opts.mediaUrl) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, send_shared_js_1.sendDiscordMedia)(rest, channelId, textWithTables, opts.mediaUrl, opts.replyTo, request, accountInfo.config.maxLinesPerMessage, opts.embeds, chunkMode)];
                case 4:
                    result = _c.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, (0, send_shared_js_1.sendDiscordText)(rest, channelId, textWithTables, opts.replyTo, request, accountInfo.config.maxLinesPerMessage, opts.embeds, chunkMode)];
                case 6:
                    result = _c.sent();
                    _c.label = 7;
                case 7: return [3 /*break*/, 10];
                case 8:
                    err_1 = _c.sent();
                    return [4 /*yield*/, (0, send_shared_js_1.buildDiscordSendError)(err_1, {
                            channelId: channelId,
                            rest: rest,
                            token: token,
                            hasMedia: Boolean(opts.mediaUrl),
                        })];
                case 9: throw _c.sent();
                case 10:
                    (0, channel_activity_js_1.recordChannelActivity)({
                        channel: "discord",
                        accountId: accountInfo.accountId,
                        direction: "outbound",
                    });
                    return [2 /*return*/, {
                            messageId: result.id ? String(result.id) : "unknown",
                            channelId: String((_b = result.channel_id) !== null && _b !== void 0 ? _b : channelId),
                        }];
            }
        });
    });
}
function sendStickerDiscord(to_1, stickerIds_1) {
    return __awaiter(this, arguments, void 0, function (to, stickerIds, opts) {
        var cfg, _a, rest, request, recipient, channelId, content, stickers, res;
        var _b, _c;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    cfg = (0, config_js_1.loadConfig)();
                    _a = (0, send_shared_js_1.createDiscordClient)(opts, cfg), rest = _a.rest, request = _a.request;
                    return [4 /*yield*/, (0, send_shared_js_1.parseAndResolveRecipient)(to, opts.accountId)];
                case 1:
                    recipient = _d.sent();
                    return [4 /*yield*/, (0, send_shared_js_1.resolveChannelId)(rest, recipient, request)];
                case 2:
                    channelId = (_d.sent()).channelId;
                    content = (_b = opts.content) === null || _b === void 0 ? void 0 : _b.trim();
                    stickers = (0, send_shared_js_1.normalizeStickerIds)(stickerIds);
                    return [4 /*yield*/, request(function () {
                            return rest.post(v10_1.Routes.channelMessages(channelId), {
                                body: {
                                    content: content || undefined,
                                    sticker_ids: stickers,
                                },
                            });
                        }, "sticker")];
                case 3:
                    res = (_d.sent());
                    return [2 /*return*/, {
                            messageId: res.id ? String(res.id) : "unknown",
                            channelId: String((_c = res.channel_id) !== null && _c !== void 0 ? _c : channelId),
                        }];
            }
        });
    });
}
function sendPollDiscord(to_1, poll_1) {
    return __awaiter(this, arguments, void 0, function (to, poll, opts) {
        var cfg, _a, rest, request, recipient, channelId, content, payload, res;
        var _b, _c;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    cfg = (0, config_js_1.loadConfig)();
                    _a = (0, send_shared_js_1.createDiscordClient)(opts, cfg), rest = _a.rest, request = _a.request;
                    return [4 /*yield*/, (0, send_shared_js_1.parseAndResolveRecipient)(to, opts.accountId)];
                case 1:
                    recipient = _d.sent();
                    return [4 /*yield*/, (0, send_shared_js_1.resolveChannelId)(rest, recipient, request)];
                case 2:
                    channelId = (_d.sent()).channelId;
                    content = (_b = opts.content) === null || _b === void 0 ? void 0 : _b.trim();
                    payload = (0, send_shared_js_1.normalizeDiscordPollInput)(poll);
                    return [4 /*yield*/, request(function () {
                            return rest.post(v10_1.Routes.channelMessages(channelId), {
                                body: {
                                    content: content || undefined,
                                    poll: payload,
                                },
                            });
                        }, "poll")];
                case 3:
                    res = (_d.sent());
                    return [2 /*return*/, {
                            messageId: res.id ? String(res.id) : "unknown",
                            channelId: String((_c = res.channel_id) !== null && _c !== void 0 ? _c : channelId),
                        }];
            }
        });
    });
}
