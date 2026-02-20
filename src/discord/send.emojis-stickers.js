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
exports.listGuildEmojisDiscord = listGuildEmojisDiscord;
exports.uploadEmojiDiscord = uploadEmojiDiscord;
exports.uploadStickerDiscord = uploadStickerDiscord;
var v10_1 = require("discord-api-types/v10");
var media_js_1 = require("../web/media.js");
var send_shared_js_1 = require("./send.shared.js");
var send_types_js_1 = require("./send.types.js");
function listGuildEmojisDiscord(guildId_1) {
    return __awaiter(this, arguments, void 0, function (guildId, opts) {
        var rest;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
                    return [4 /*yield*/, rest.get(v10_1.Routes.guildEmojis(guildId))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function uploadEmojiDiscord(payload_1) {
    return __awaiter(this, arguments, void 0, function (payload, opts) {
        var rest, media, contentType, image, roleIds;
        var _a, _b;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
                    return [4 /*yield*/, (0, media_js_1.loadWebMediaRaw)(payload.mediaUrl, send_types_js_1.DISCORD_MAX_EMOJI_BYTES)];
                case 1:
                    media = _c.sent();
                    contentType = (_a = media.contentType) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                    if (!contentType ||
                        !["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(contentType)) {
                        throw new Error("Discord emoji uploads require a PNG, JPG, or GIF image");
                    }
                    image = "data:".concat(contentType, ";base64,").concat(media.buffer.toString("base64"));
                    roleIds = ((_b = payload.roleIds) !== null && _b !== void 0 ? _b : []).map(function (id) { return id.trim(); }).filter(Boolean);
                    return [4 /*yield*/, rest.post(v10_1.Routes.guildEmojis(payload.guildId), {
                            body: {
                                name: (0, send_shared_js_1.normalizeEmojiName)(payload.name, "Emoji name"),
                                image: image,
                                roles: roleIds.length ? roleIds : undefined,
                            },
                        })];
                case 2: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
function uploadStickerDiscord(payload_1) {
    return __awaiter(this, arguments, void 0, function (payload, opts) {
        var rest, media, contentType;
        var _a, _b;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    rest = (0, send_shared_js_1.resolveDiscordRest)(opts);
                    return [4 /*yield*/, (0, media_js_1.loadWebMediaRaw)(payload.mediaUrl, send_types_js_1.DISCORD_MAX_STICKER_BYTES)];
                case 1:
                    media = _c.sent();
                    contentType = (_a = media.contentType) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                    if (!contentType || !["image/png", "image/apng", "application/json"].includes(contentType)) {
                        throw new Error("Discord sticker uploads require a PNG, APNG, or Lottie JSON file");
                    }
                    return [4 /*yield*/, rest.post(v10_1.Routes.guildStickers(payload.guildId), {
                            body: {
                                name: (0, send_shared_js_1.normalizeEmojiName)(payload.name, "Sticker name"),
                                description: (0, send_shared_js_1.normalizeEmojiName)(payload.description, "Sticker description"),
                                tags: (0, send_shared_js_1.normalizeEmojiName)(payload.tags, "Sticker tags"),
                                files: [
                                    {
                                        data: media.buffer,
                                        name: (_b = media.fileName) !== null && _b !== void 0 ? _b : "sticker",
                                        contentType: contentType,
                                    },
                                ],
                            },
                        })];
                case 2: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
