"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionSnapshot = getSessionSnapshot;
var sessions_js_1 = require("../../config/sessions.js");
var session_key_js_1 = require("../../routing/session-key.js");
function getSessionSnapshot(cfg, from, _isHeartbeat, ctx) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (_isHeartbeat === void 0) { _isHeartbeat = false; }
    var sessionCfg = cfg.session;
    var scope = (_a = sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.scope) !== null && _a !== void 0 ? _a : "per-sender";
    var key = (_c = (_b = ctx === null || ctx === void 0 ? void 0 : ctx.sessionKey) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : (0, sessions_js_1.resolveSessionKey)(scope, { From: from, To: "", Body: "" }, (0, session_key_js_1.normalizeMainKey)(sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.mainKey));
    var store = (0, sessions_js_1.loadSessionStore)((0, sessions_js_1.resolveStorePath)(sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.store));
    var entry = store[key];
    var isThread = (0, sessions_js_1.resolveThreadFlag)({
        sessionKey: key,
        messageThreadId: (_d = ctx === null || ctx === void 0 ? void 0 : ctx.messageThreadId) !== null && _d !== void 0 ? _d : null,
        threadLabel: (_e = ctx === null || ctx === void 0 ? void 0 : ctx.threadLabel) !== null && _e !== void 0 ? _e : null,
        threadStarterBody: (_f = ctx === null || ctx === void 0 ? void 0 : ctx.threadStarterBody) !== null && _f !== void 0 ? _f : null,
        parentSessionKey: (_g = ctx === null || ctx === void 0 ? void 0 : ctx.parentSessionKey) !== null && _g !== void 0 ? _g : null,
    });
    var resetType = (0, sessions_js_1.resolveSessionResetType)({ sessionKey: key, isGroup: ctx === null || ctx === void 0 ? void 0 : ctx.isGroup, isThread: isThread });
    var channelReset = (0, sessions_js_1.resolveChannelResetConfig)({
        sessionCfg: sessionCfg,
        channel: (_h = entry === null || entry === void 0 ? void 0 : entry.lastChannel) !== null && _h !== void 0 ? _h : entry === null || entry === void 0 ? void 0 : entry.channel,
    });
    var resetPolicy = (0, sessions_js_1.resolveSessionResetPolicy)({
        sessionCfg: sessionCfg,
        resetType: resetType,
        resetOverride: channelReset,
    });
    var now = Date.now();
    var freshness = entry
        ? (0, sessions_js_1.evaluateSessionFreshness)({ updatedAt: entry.updatedAt, now: now, policy: resetPolicy })
        : { fresh: false };
    return {
        key: key,
        entry: entry,
        fresh: freshness.fresh,
        resetPolicy: resetPolicy,
        resetType: resetType,
        dailyResetAt: freshness.dailyResetAt,
        idleExpiresAt: freshness.idleExpiresAt,
    };
}
