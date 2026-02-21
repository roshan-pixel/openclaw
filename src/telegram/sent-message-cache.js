"use strict";
/**
 * In-memory cache of sent message IDs per chat.
 * Used to identify bot's own messages for reaction filtering ("own" mode).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordSentMessage = recordSentMessage;
exports.wasSentByBot = wasSentByBot;
exports.clearSentMessageCache = clearSentMessageCache;
var TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
var sentMessages = new Map();
function getChatKey(chatId) {
  return String(chatId);
}
function cleanupExpired(entry) {
  var now = Date.now();
  for (var _i = 0, _a = entry.timestamps; _i < _a.length; _i++) {
    var _b = _a[_i],
      msgId = _b[0],
      timestamp = _b[1];
    if (now - timestamp > TTL_MS) {
      entry.messageIds.delete(msgId);
      entry.timestamps.delete(msgId);
    }
  }
}
/**
 * Record a message ID as sent by the bot.
 */
function recordSentMessage(chatId, messageId) {
  var key = getChatKey(chatId);
  var entry = sentMessages.get(key);
  if (!entry) {
    entry = { messageIds: new Set(), timestamps: new Map() };
    sentMessages.set(key, entry);
  }
  entry.messageIds.add(messageId);
  entry.timestamps.set(messageId, Date.now());
  // Periodic cleanup
  if (entry.messageIds.size > 100) {
    cleanupExpired(entry);
  }
}
/**
 * Check if a message was sent by the bot.
 */
function wasSentByBot(chatId, messageId) {
  var key = getChatKey(chatId);
  var entry = sentMessages.get(key);
  if (!entry) {
    return false;
  }
  // Clean up expired entries on read
  cleanupExpired(entry);
  return entry.messageIds.has(messageId);
}
/**
 * Clear all cached entries (for testing).
 */
function clearSentMessageCache() {
  sentMessages.clear();
}
