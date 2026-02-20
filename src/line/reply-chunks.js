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
exports.sendLineReplyChunks = sendLineReplyChunks;
function sendLineReplyChunks(params) {
    return __awaiter(this, void 0, void 0, function () {
        var hasQuickReplies, replyTokenUsed, replyBatch, remaining, replyMessages, lastIndex, i, isLastChunk, err_1, i, isLastChunk;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    hasQuickReplies = Boolean((_a = params.quickReplies) === null || _a === void 0 ? void 0 : _a.length);
                    replyTokenUsed = Boolean(params.replyTokenUsed);
                    if (params.chunks.length === 0) {
                        return [2 /*return*/, { replyTokenUsed: replyTokenUsed }];
                    }
                    if (!(params.replyToken && !replyTokenUsed)) return [3 /*break*/, 10];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 9, , 10]);
                    replyBatch = params.chunks.slice(0, 5);
                    remaining = params.chunks.slice(replyBatch.length);
                    replyMessages = replyBatch.map(function (chunk) { return ({
                        type: "text",
                        text: chunk,
                    }); });
                    if (hasQuickReplies && remaining.length === 0 && replyMessages.length > 0) {
                        lastIndex = replyMessages.length - 1;
                        replyMessages[lastIndex] = params.createTextMessageWithQuickReplies(replyBatch[lastIndex], params.quickReplies);
                    }
                    return [4 /*yield*/, params.replyMessageLine(params.replyToken, replyMessages, {
                            accountId: params.accountId,
                        })];
                case 2:
                    _c.sent();
                    replyTokenUsed = true;
                    i = 0;
                    _c.label = 3;
                case 3:
                    if (!(i < remaining.length)) return [3 /*break*/, 8];
                    isLastChunk = i === remaining.length - 1;
                    if (!(isLastChunk && hasQuickReplies)) return [3 /*break*/, 5];
                    return [4 /*yield*/, params.pushTextMessageWithQuickReplies(params.to, remaining[i], params.quickReplies, { accountId: params.accountId })];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, params.pushMessageLine(params.to, remaining[i], {
                        accountId: params.accountId,
                    })];
                case 6:
                    _c.sent();
                    _c.label = 7;
                case 7:
                    i += 1;
                    return [3 /*break*/, 3];
                case 8: return [2 /*return*/, { replyTokenUsed: replyTokenUsed }];
                case 9:
                    err_1 = _c.sent();
                    (_b = params.onReplyError) === null || _b === void 0 ? void 0 : _b.call(params, err_1);
                    replyTokenUsed = true;
                    return [3 /*break*/, 10];
                case 10:
                    i = 0;
                    _c.label = 11;
                case 11:
                    if (!(i < params.chunks.length)) return [3 /*break*/, 16];
                    isLastChunk = i === params.chunks.length - 1;
                    if (!(isLastChunk && hasQuickReplies)) return [3 /*break*/, 13];
                    return [4 /*yield*/, params.pushTextMessageWithQuickReplies(params.to, params.chunks[i], params.quickReplies, { accountId: params.accountId })];
                case 12:
                    _c.sent();
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, params.pushMessageLine(params.to, params.chunks[i], {
                        accountId: params.accountId,
                    })];
                case 14:
                    _c.sent();
                    _c.label = 15;
                case 15:
                    i += 1;
                    return [3 /*break*/, 11];
                case 16: return [2 /*return*/, { replyTokenUsed: replyTokenUsed }];
            }
        });
    });
}
