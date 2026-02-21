"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FOLLOWUP_QUEUES =
  exports.DEFAULT_QUEUE_DROP =
  exports.DEFAULT_QUEUE_CAP =
  exports.DEFAULT_QUEUE_DEBOUNCE_MS =
    void 0;
exports.getFollowupQueue = getFollowupQueue;
exports.clearFollowupQueue = clearFollowupQueue;
exports.DEFAULT_QUEUE_DEBOUNCE_MS = 1000;
exports.DEFAULT_QUEUE_CAP = 20;
exports.DEFAULT_QUEUE_DROP = "summarize";
exports.FOLLOWUP_QUEUES = new Map();
function getFollowupQueue(key, settings) {
  var _a, _b;
  var existing = exports.FOLLOWUP_QUEUES.get(key);
  if (existing) {
    existing.mode = settings.mode;
    existing.debounceMs =
      typeof settings.debounceMs === "number"
        ? Math.max(0, settings.debounceMs)
        : existing.debounceMs;
    existing.cap =
      typeof settings.cap === "number" && settings.cap > 0
        ? Math.floor(settings.cap)
        : existing.cap;
    existing.dropPolicy =
      (_a = settings.dropPolicy) !== null && _a !== void 0 ? _a : existing.dropPolicy;
    return existing;
  }
  var created = {
    items: [],
    draining: false,
    lastEnqueuedAt: 0,
    mode: settings.mode,
    debounceMs:
      typeof settings.debounceMs === "number"
        ? Math.max(0, settings.debounceMs)
        : exports.DEFAULT_QUEUE_DEBOUNCE_MS,
    cap:
      typeof settings.cap === "number" && settings.cap > 0
        ? Math.floor(settings.cap)
        : exports.DEFAULT_QUEUE_CAP,
    dropPolicy:
      (_b = settings.dropPolicy) !== null && _b !== void 0 ? _b : exports.DEFAULT_QUEUE_DROP,
    droppedCount: 0,
    summaryLines: [],
  };
  exports.FOLLOWUP_QUEUES.set(key, created);
  return created;
}
function clearFollowupQueue(key) {
  var cleaned = key.trim();
  if (!cleaned) {
    return 0;
  }
  var queue = exports.FOLLOWUP_QUEUES.get(cleaned);
  if (!queue) {
    return 0;
  }
  var cleared = queue.items.length + queue.droppedCount;
  queue.items.length = 0;
  queue.droppedCount = 0;
  queue.summaryLines = [];
  queue.lastRun = undefined;
  queue.lastEnqueuedAt = 0;
  exports.FOLLOWUP_QUEUES.delete(cleaned);
  return cleared;
}
