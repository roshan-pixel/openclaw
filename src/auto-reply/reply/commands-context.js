"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCommandContext = buildCommandContext;
var command_auth_js_1 = require("../command-auth.js");
var commands_registry_js_1 = require("../commands-registry.js");
var mentions_js_1 = require("./mentions.js");
function buildCommandContext(params) {
    var _a, _b, _c, _d;
    var ctx = params.ctx, cfg = params.cfg, agentId = params.agentId, sessionKey = params.sessionKey, isGroup = params.isGroup, triggerBodyNormalized = params.triggerBodyNormalized;
    var auth = (0, command_auth_js_1.resolveCommandAuthorization)({
        ctx: ctx,
        cfg: cfg,
        commandAuthorized: params.commandAuthorized,
    });
    var surface = ((_b = (_a = ctx.Surface) !== null && _a !== void 0 ? _a : ctx.Provider) !== null && _b !== void 0 ? _b : "").trim().toLowerCase();
    var channel = ((_c = ctx.Provider) !== null && _c !== void 0 ? _c : surface).trim().toLowerCase();
    var abortKey = (_d = sessionKey !== null && sessionKey !== void 0 ? sessionKey : (auth.from || undefined)) !== null && _d !== void 0 ? _d : (auth.to || undefined);
    var rawBodyNormalized = triggerBodyNormalized;
    var commandBodyNormalized = (0, commands_registry_js_1.normalizeCommandBody)(isGroup ? (0, mentions_js_1.stripMentions)(rawBodyNormalized, ctx, cfg, agentId) : rawBodyNormalized);
    return {
        surface: surface,
        channel: channel,
        channelId: auth.providerId,
        ownerList: auth.ownerList,
        isAuthorizedSender: auth.isAuthorizedSender,
        senderId: auth.senderId,
        abortKey: abortKey,
        rawBodyNormalized: rawBodyNormalized,
        commandBodyNormalized: commandBodyNormalized,
        from: auth.from,
        to: auth.to,
    };
}
