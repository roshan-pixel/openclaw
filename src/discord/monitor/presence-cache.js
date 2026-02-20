"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPresence = setPresence;
exports.getPresence = getPresence;
exports.clearPresences = clearPresences;
exports.presenceCacheSize = presenceCacheSize;
/**
 * In-memory cache of Discord user presence data.
 * Populated by PRESENCE_UPDATE gateway events when the GuildPresences intent is enabled.
 */
var presenceCache = new Map();
function resolveAccountKey(accountId) {
    return accountId !== null && accountId !== void 0 ? accountId : "default";
}
/** Update cached presence for a user. */
function setPresence(accountId, userId, data) {
    var accountKey = resolveAccountKey(accountId);
    var accountCache = presenceCache.get(accountKey);
    if (!accountCache) {
        accountCache = new Map();
        presenceCache.set(accountKey, accountCache);
    }
    accountCache.set(userId, data);
}
/** Get cached presence for a user. Returns undefined if not cached. */
function getPresence(accountId, userId) {
    var _a;
    return (_a = presenceCache.get(resolveAccountKey(accountId))) === null || _a === void 0 ? void 0 : _a.get(userId);
}
/** Clear cached presence data. */
function clearPresences(accountId) {
    if (accountId) {
        presenceCache.delete(resolveAccountKey(accountId));
        return;
    }
    presenceCache.clear();
}
/** Get the number of cached presence entries. */
function presenceCacheSize() {
    var total = 0;
    for (var _i = 0, _a = presenceCache.values(); _i < _a.length; _i++) {
        var accountCache = _a[_i];
        total += accountCache.size;
    }
    return total;
}
