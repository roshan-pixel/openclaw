"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveHeartbeatVisibility = resolveHeartbeatVisibility;
var DEFAULT_VISIBILITY = {
    showOk: false, // Silent by default
    showAlerts: true, // Show content messages
    useIndicator: true, // Emit indicator events
};
/**
 * Resolve heartbeat visibility settings for a channel.
 * Supports both deliverable channels (telegram, signal, etc.) and webchat.
 * For webchat, uses channels.defaults.heartbeat since webchat doesn't have per-channel config.
 */
function resolveHeartbeatVisibility(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    var cfg = params.cfg, channel = params.channel, accountId = params.accountId;
    // Webchat uses channel defaults only (no per-channel or per-account config)
    if (channel === "webchat") {
        var channelDefaults_1 = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.heartbeat;
        return {
            showOk: (_c = channelDefaults_1 === null || channelDefaults_1 === void 0 ? void 0 : channelDefaults_1.showOk) !== null && _c !== void 0 ? _c : DEFAULT_VISIBILITY.showOk,
            showAlerts: (_d = channelDefaults_1 === null || channelDefaults_1 === void 0 ? void 0 : channelDefaults_1.showAlerts) !== null && _d !== void 0 ? _d : DEFAULT_VISIBILITY.showAlerts,
            useIndicator: (_e = channelDefaults_1 === null || channelDefaults_1 === void 0 ? void 0 : channelDefaults_1.useIndicator) !== null && _e !== void 0 ? _e : DEFAULT_VISIBILITY.useIndicator,
        };
    }
    // Layer 1: Global channel defaults
    var channelDefaults = (_g = (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f.defaults) === null || _g === void 0 ? void 0 : _g.heartbeat;
    // Layer 2: Per-channel config (at channel root level)
    var channelCfg = (_h = cfg.channels) === null || _h === void 0 ? void 0 : _h[channel];
    var perChannel = channelCfg === null || channelCfg === void 0 ? void 0 : channelCfg.heartbeat;
    // Layer 3: Per-account config (most specific)
    var accountCfg = accountId ? (_j = channelCfg === null || channelCfg === void 0 ? void 0 : channelCfg.accounts) === null || _j === void 0 ? void 0 : _j[accountId] : undefined;
    var perAccount = accountCfg === null || accountCfg === void 0 ? void 0 : accountCfg.heartbeat;
    // Precedence: per-account > per-channel > channel-defaults > global defaults
    return {
        showOk: (_m = (_l = (_k = perAccount === null || perAccount === void 0 ? void 0 : perAccount.showOk) !== null && _k !== void 0 ? _k : perChannel === null || perChannel === void 0 ? void 0 : perChannel.showOk) !== null && _l !== void 0 ? _l : channelDefaults === null || channelDefaults === void 0 ? void 0 : channelDefaults.showOk) !== null && _m !== void 0 ? _m : DEFAULT_VISIBILITY.showOk,
        showAlerts: (_q = (_p = (_o = perAccount === null || perAccount === void 0 ? void 0 : perAccount.showAlerts) !== null && _o !== void 0 ? _o : perChannel === null || perChannel === void 0 ? void 0 : perChannel.showAlerts) !== null && _p !== void 0 ? _p : channelDefaults === null || channelDefaults === void 0 ? void 0 : channelDefaults.showAlerts) !== null && _q !== void 0 ? _q : DEFAULT_VISIBILITY.showAlerts,
        useIndicator: (_t = (_s = (_r = perAccount === null || perAccount === void 0 ? void 0 : perAccount.useIndicator) !== null && _r !== void 0 ? _r : perChannel === null || perChannel === void 0 ? void 0 : perChannel.useIndicator) !== null && _s !== void 0 ? _s : channelDefaults === null || channelDefaults === void 0 ? void 0 : channelDefaults.useIndicator) !== null && _t !== void 0 ? _t : DEFAULT_VISIBILITY.useIndicator,
    };
}
