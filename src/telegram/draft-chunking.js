"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTelegramDraftStreamingChunking = resolveTelegramDraftStreamingChunking;
var chunk_js_1 = require("../auto-reply/chunk.js");
var dock_js_1 = require("../channels/dock.js");
var session_key_js_1 = require("../routing/session-key.js");
var DEFAULT_TELEGRAM_DRAFT_STREAM_MIN = 200;
var DEFAULT_TELEGRAM_DRAFT_STREAM_MAX = 800;
function resolveTelegramDraftStreamingChunking(cfg, accountId) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var providerChunkLimit = (_b = (_a = (0, dock_js_1.getChannelDock)("telegram")) === null || _a === void 0 ? void 0 : _a.outbound) === null || _b === void 0 ? void 0 : _b.textChunkLimit;
    var textLimit = (0, chunk_js_1.resolveTextChunkLimit)(cfg, "telegram", accountId, {
        fallbackLimit: providerChunkLimit,
    });
    var normalizedAccountId = (0, session_key_js_1.normalizeAccountId)(accountId);
    var draftCfg = (_g = (_f = (_e = (_d = (_c = cfg === null || cfg === void 0 ? void 0 : cfg.channels) === null || _c === void 0 ? void 0 : _c.telegram) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e[normalizedAccountId]) === null || _f === void 0 ? void 0 : _f.draftChunk) !== null && _g !== void 0 ? _g : (_j = (_h = cfg === null || cfg === void 0 ? void 0 : cfg.channels) === null || _h === void 0 ? void 0 : _h.telegram) === null || _j === void 0 ? void 0 : _j.draftChunk;
    var maxRequested = Math.max(1, Math.floor((_k = draftCfg === null || draftCfg === void 0 ? void 0 : draftCfg.maxChars) !== null && _k !== void 0 ? _k : DEFAULT_TELEGRAM_DRAFT_STREAM_MAX));
    var maxChars = Math.max(1, Math.min(maxRequested, textLimit));
    var minRequested = Math.max(1, Math.floor((_l = draftCfg === null || draftCfg === void 0 ? void 0 : draftCfg.minChars) !== null && _l !== void 0 ? _l : DEFAULT_TELEGRAM_DRAFT_STREAM_MIN));
    var minChars = Math.min(minRequested, maxChars);
    var breakPreference = (draftCfg === null || draftCfg === void 0 ? void 0 : draftCfg.breakPreference) === "newline" || (draftCfg === null || draftCfg === void 0 ? void 0 : draftCfg.breakPreference) === "sentence"
        ? draftCfg.breakPreference
        : "paragraph";
    return { minChars: minChars, maxChars: maxChars, breakPreference: breakPreference };
}
