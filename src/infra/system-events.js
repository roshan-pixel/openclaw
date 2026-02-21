"use strict";
// Lightweight in-memory queue for human-readable system events that should be
// prefixed to the next prompt. We intentionally avoid persistence to keep
// events ephemeral. Events are session-scoped and require an explicit key.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSystemEventContextChanged = isSystemEventContextChanged;
exports.enqueueSystemEvent = enqueueSystemEvent;
exports.drainSystemEventEntries = drainSystemEventEntries;
exports.drainSystemEvents = drainSystemEvents;
exports.peekSystemEvents = peekSystemEvents;
exports.hasSystemEvents = hasSystemEvents;
exports.resetSystemEventsForTest = resetSystemEventsForTest;
var MAX_EVENTS = 20;
var queues = new Map();
function requireSessionKey(key) {
  var trimmed = typeof key === "string" ? key.trim() : "";
  if (!trimmed) {
    throw new Error("system events require a sessionKey");
  }
  return trimmed;
}
function normalizeContextKey(key) {
  if (!key) {
    return null;
  }
  var trimmed = key.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed.toLowerCase();
}
function isSystemEventContextChanged(sessionKey, contextKey) {
  var _a;
  var key = requireSessionKey(sessionKey);
  var existing = queues.get(key);
  var normalized = normalizeContextKey(contextKey);
  return (
    normalized !==
    ((_a = existing === null || existing === void 0 ? void 0 : existing.lastContextKey) !== null &&
    _a !== void 0
      ? _a
      : null)
  );
}
function enqueueSystemEvent(text, options) {
  var _a;
  var key = requireSessionKey(options === null || options === void 0 ? void 0 : options.sessionKey);
  var entry =
    (_a = queues.get(key)) !== null && _a !== void 0
      ? _a
      : (function () {
          var created = {
            queue: [],
            lastText: null,
            lastContextKey: null,
          };
          queues.set(key, created);
          return created;
        })();
  var cleaned = text.trim();
  if (!cleaned) {
    return;
  }
  entry.lastContextKey = normalizeContextKey(
    options === null || options === void 0 ? void 0 : options.contextKey,
  );
  if (entry.lastText === cleaned) {
    return;
  } // skip consecutive duplicates
  entry.lastText = cleaned;
  entry.queue.push({ text: cleaned, ts: Date.now() });
  if (entry.queue.length > MAX_EVENTS) {
    entry.queue.shift();
  }
}
function drainSystemEventEntries(sessionKey) {
  var key = requireSessionKey(sessionKey);
  var entry = queues.get(key);
  if (!entry || entry.queue.length === 0) {
    return [];
  }
  var out = entry.queue.slice();
  entry.queue.length = 0;
  entry.lastText = null;
  entry.lastContextKey = null;
  queues.delete(key);
  return out;
}
function drainSystemEvents(sessionKey) {
  return drainSystemEventEntries(sessionKey).map(function (event) {
    return event.text;
  });
}
function peekSystemEvents(sessionKey) {
  var _a, _b;
  var key = requireSessionKey(sessionKey);
  return (_b =
    (_a = queues.get(key)) === null || _a === void 0
      ? void 0
      : _a.queue.map(function (e) {
          return e.text;
        })) !== null && _b !== void 0
    ? _b
    : [];
}
function hasSystemEvents(sessionKey) {
  var _a, _b;
  var key = requireSessionKey(sessionKey);
  return (
    ((_b = (_a = queues.get(key)) === null || _a === void 0 ? void 0 : _a.queue.length) !== null &&
    _b !== void 0
      ? _b
      : 0) > 0
  );
}
function resetSystemEventsForTest() {
  queues.clear();
}
