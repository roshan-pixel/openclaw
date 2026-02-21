"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChatStopCommandText = isChatStopCommandText;
exports.resolveChatRunExpiresAtMs = resolveChatRunExpiresAtMs;
exports.abortChatRunById = abortChatRunById;
exports.abortChatRunsForSessionKey = abortChatRunsForSessionKey;
var abort_js_1 = require("../auto-reply/reply/abort.js");
function isChatStopCommandText(text) {
  var trimmed = text.trim();
  if (!trimmed) {
    return false;
  }
  return trimmed.toLowerCase() === "/stop" || (0, abort_js_1.isAbortTrigger)(trimmed);
}
function resolveChatRunExpiresAtMs(params) {
  var now = params.now,
    timeoutMs = params.timeoutMs,
    _a = params.graceMs,
    graceMs = _a === void 0 ? 60000 : _a,
    _b = params.minMs,
    minMs = _b === void 0 ? 2 * 60000 : _b,
    _c = params.maxMs,
    maxMs = _c === void 0 ? 24 * 60 * 60000 : _c;
  var boundedTimeoutMs = Math.max(0, timeoutMs);
  var target = now + boundedTimeoutMs + graceMs;
  var min = now + minMs;
  var max = now + maxMs;
  return Math.min(max, Math.max(min, target));
}
function broadcastChatAborted(ops, params) {
  var _a;
  var runId = params.runId,
    sessionKey = params.sessionKey,
    stopReason = params.stopReason;
  var payload = {
    runId: runId,
    sessionKey: sessionKey,
    seq: ((_a = ops.agentRunSeq.get(runId)) !== null && _a !== void 0 ? _a : 0) + 1,
    state: "aborted",
    stopReason: stopReason,
  };
  ops.broadcast("chat", payload);
  ops.nodeSendToSession(sessionKey, "chat", payload);
}
function abortChatRunById(ops, params) {
  var runId = params.runId,
    sessionKey = params.sessionKey,
    stopReason = params.stopReason;
  var active = ops.chatAbortControllers.get(runId);
  if (!active) {
    return { aborted: false };
  }
  if (active.sessionKey !== sessionKey) {
    return { aborted: false };
  }
  ops.chatAbortedRuns.set(runId, Date.now());
  active.controller.abort();
  ops.chatAbortControllers.delete(runId);
  ops.chatRunBuffers.delete(runId);
  ops.chatDeltaSentAt.delete(runId);
  ops.removeChatRun(runId, runId, sessionKey);
  broadcastChatAborted(ops, { runId: runId, sessionKey: sessionKey, stopReason: stopReason });
  return { aborted: true };
}
function abortChatRunsForSessionKey(ops, params) {
  var sessionKey = params.sessionKey,
    stopReason = params.stopReason;
  var runIds = [];
  for (var _i = 0, _a = ops.chatAbortControllers; _i < _a.length; _i++) {
    var _b = _a[_i],
      runId = _b[0],
      active = _b[1];
    if (active.sessionKey !== sessionKey) {
      continue;
    }
    var res = abortChatRunById(ops, {
      runId: runId,
      sessionKey: sessionKey,
      stopReason: stopReason,
    });
    if (res.aborted) {
      runIds.push(runId);
    }
  }
  return { aborted: runIds.length > 0, runIds: runIds };
}
