"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAgentRunContext = registerAgentRunContext;
exports.getAgentRunContext = getAgentRunContext;
exports.clearAgentRunContext = clearAgentRunContext;
exports.resetAgentRunContextForTest = resetAgentRunContextForTest;
exports.emitAgentEvent = emitAgentEvent;
exports.onAgentEvent = onAgentEvent;
// Keep per-run counters so streams stay strictly monotonic per runId.
var seqByRun = new Map();
var listeners = new Set();
var runContextById = new Map();
function registerAgentRunContext(runId, context) {
  if (!runId) {
    return;
  }
  var existing = runContextById.get(runId);
  if (!existing) {
    runContextById.set(runId, __assign({}, context));
    return;
  }
  if (context.sessionKey && existing.sessionKey !== context.sessionKey) {
    existing.sessionKey = context.sessionKey;
  }
  if (context.verboseLevel && existing.verboseLevel !== context.verboseLevel) {
    existing.verboseLevel = context.verboseLevel;
  }
  if (context.isHeartbeat !== undefined && existing.isHeartbeat !== context.isHeartbeat) {
    existing.isHeartbeat = context.isHeartbeat;
  }
}
function getAgentRunContext(runId) {
  return runContextById.get(runId);
}
function clearAgentRunContext(runId) {
  runContextById.delete(runId);
}
function resetAgentRunContextForTest() {
  runContextById.clear();
}
function emitAgentEvent(event) {
  var _a;
  var nextSeq = ((_a = seqByRun.get(event.runId)) !== null && _a !== void 0 ? _a : 0) + 1;
  seqByRun.set(event.runId, nextSeq);
  var context = runContextById.get(event.runId);
  var sessionKey =
    typeof event.sessionKey === "string" && event.sessionKey.trim()
      ? event.sessionKey
      : context === null || context === void 0
        ? void 0
        : context.sessionKey;
  var enriched = __assign(__assign({}, event), {
    sessionKey: sessionKey,
    seq: nextSeq,
    ts: Date.now(),
  });
  for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
    var listener = listeners_1[_i];
    try {
      listener(enriched);
    } catch (_b) {
      /* ignore */
    }
  }
}
function onAgentEvent(listener) {
  listeners.add(listener);
  return function () {
    return listeners.delete(listener);
  };
}
