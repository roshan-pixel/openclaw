"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_HISTORY_KEYS =
  exports.DEFAULT_GROUP_HISTORY_LIMIT =
  exports.HISTORY_CONTEXT_MARKER =
    void 0;
exports.evictOldHistoryKeys = evictOldHistoryKeys;
exports.buildHistoryContext = buildHistoryContext;
exports.appendHistoryEntry = appendHistoryEntry;
exports.recordPendingHistoryEntry = recordPendingHistoryEntry;
exports.recordPendingHistoryEntryIfEnabled = recordPendingHistoryEntryIfEnabled;
exports.buildPendingHistoryContextFromMap = buildPendingHistoryContextFromMap;
exports.buildHistoryContextFromMap = buildHistoryContextFromMap;
exports.clearHistoryEntries = clearHistoryEntries;
exports.clearHistoryEntriesIfEnabled = clearHistoryEntriesIfEnabled;
exports.buildHistoryContextFromEntries = buildHistoryContextFromEntries;
var mentions_js_1 = require("./mentions.js");
exports.HISTORY_CONTEXT_MARKER = "[Chat messages since your last reply - for context]";
exports.DEFAULT_GROUP_HISTORY_LIMIT = 50;
/** Maximum number of group history keys to retain (LRU eviction when exceeded). */
exports.MAX_HISTORY_KEYS = 1000;
/**
 * Evict oldest keys from a history map when it exceeds MAX_HISTORY_KEYS.
 * Uses Map's insertion order for LRU-like behavior.
 */
function evictOldHistoryKeys(historyMap, maxKeys) {
  if (maxKeys === void 0) {
    maxKeys = exports.MAX_HISTORY_KEYS;
  }
  if (historyMap.size <= maxKeys) {
    return;
  }
  var keysToDelete = historyMap.size - maxKeys;
  var iterator = historyMap.keys();
  for (var i = 0; i < keysToDelete; i++) {
    var key = iterator.next().value;
    if (key !== undefined) {
      historyMap.delete(key);
    }
  }
}
function buildHistoryContext(params) {
  var _a;
  var historyText = params.historyText,
    currentMessage = params.currentMessage;
  var lineBreak = (_a = params.lineBreak) !== null && _a !== void 0 ? _a : "\n";
  if (!historyText.trim()) {
    return currentMessage;
  }
  return [
    exports.HISTORY_CONTEXT_MARKER,
    historyText,
    "",
    mentions_js_1.CURRENT_MESSAGE_MARKER,
    currentMessage,
  ].join(lineBreak);
}
function appendHistoryEntry(params) {
  var _a;
  var historyMap = params.historyMap,
    historyKey = params.historyKey,
    entry = params.entry;
  if (params.limit <= 0) {
    return [];
  }
  var history = (_a = historyMap.get(historyKey)) !== null && _a !== void 0 ? _a : [];
  history.push(entry);
  while (history.length > params.limit) {
    history.shift();
  }
  if (historyMap.has(historyKey)) {
    // Refresh insertion order so eviction keeps recently used histories.
    historyMap.delete(historyKey);
  }
  historyMap.set(historyKey, history);
  // Evict oldest keys if map exceeds max size to prevent unbounded memory growth
  evictOldHistoryKeys(historyMap);
  return history;
}
function recordPendingHistoryEntry(params) {
  return appendHistoryEntry(params);
}
function recordPendingHistoryEntryIfEnabled(params) {
  if (!params.entry) {
    return [];
  }
  if (params.limit <= 0) {
    return [];
  }
  return recordPendingHistoryEntry({
    historyMap: params.historyMap,
    historyKey: params.historyKey,
    entry: params.entry,
    limit: params.limit,
  });
}
function buildPendingHistoryContextFromMap(params) {
  var _a;
  if (params.limit <= 0) {
    return params.currentMessage;
  }
  var entries = (_a = params.historyMap.get(params.historyKey)) !== null && _a !== void 0 ? _a : [];
  return buildHistoryContextFromEntries({
    entries: entries,
    currentMessage: params.currentMessage,
    formatEntry: params.formatEntry,
    lineBreak: params.lineBreak,
    excludeLast: false,
  });
}
function buildHistoryContextFromMap(params) {
  var _a;
  if (params.limit <= 0) {
    return params.currentMessage;
  }
  var entries = params.entry
    ? appendHistoryEntry({
        historyMap: params.historyMap,
        historyKey: params.historyKey,
        entry: params.entry,
        limit: params.limit,
      })
    : (_a = params.historyMap.get(params.historyKey)) !== null && _a !== void 0
      ? _a
      : [];
  return buildHistoryContextFromEntries({
    entries: entries,
    currentMessage: params.currentMessage,
    formatEntry: params.formatEntry,
    lineBreak: params.lineBreak,
    excludeLast: params.excludeLast,
  });
}
function clearHistoryEntries(params) {
  params.historyMap.set(params.historyKey, []);
}
function clearHistoryEntriesIfEnabled(params) {
  if (params.limit <= 0) {
    return;
  }
  clearHistoryEntries({ historyMap: params.historyMap, historyKey: params.historyKey });
}
function buildHistoryContextFromEntries(params) {
  var _a;
  var lineBreak = (_a = params.lineBreak) !== null && _a !== void 0 ? _a : "\n";
  var entries = params.excludeLast === false ? params.entries : params.entries.slice(0, -1);
  if (entries.length === 0) {
    return params.currentMessage;
  }
  var historyText = entries.map(params.formatEntry).join(lineBreak);
  return buildHistoryContext({
    historyText: historyText,
    currentMessage: params.currentMessage,
    lineBreak: lineBreak,
  });
}
