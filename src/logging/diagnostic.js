"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diagnosticLogger = void 0;
exports.logWebhookReceived = logWebhookReceived;
exports.logWebhookProcessed = logWebhookProcessed;
exports.logWebhookError = logWebhookError;
exports.logMessageQueued = logMessageQueued;
exports.logMessageProcessed = logMessageProcessed;
exports.logSessionStateChange = logSessionStateChange;
exports.logSessionStuck = logSessionStuck;
exports.logLaneEnqueue = logLaneEnqueue;
exports.logLaneDequeue = logLaneDequeue;
exports.logRunAttempt = logRunAttempt;
exports.logActiveRuns = logActiveRuns;
exports.startDiagnosticHeartbeat = startDiagnosticHeartbeat;
exports.stopDiagnosticHeartbeat = stopDiagnosticHeartbeat;
var diagnostic_events_js_1 = require("../infra/diagnostic-events.js");
var subsystem_js_1 = require("./subsystem.js");
var diag = (0, subsystem_js_1.createSubsystemLogger)("diagnostic");
exports.diagnosticLogger = diag;
var sessionStates = new Map();
var webhookStats = {
  received: 0,
  processed: 0,
  errors: 0,
  lastReceived: 0,
};
var lastActivityAt = 0;
function markActivity() {
  lastActivityAt = Date.now();
}
function resolveSessionKey(_a) {
  var _b;
  var sessionKey = _a.sessionKey,
    sessionId = _a.sessionId;
  return (_b = sessionKey !== null && sessionKey !== void 0 ? sessionKey : sessionId) !== null &&
    _b !== void 0
    ? _b
    : "unknown";
}
function getSessionState(ref) {
  var key = resolveSessionKey(ref);
  var existing = sessionStates.get(key);
  if (existing) {
    if (ref.sessionId) {
      existing.sessionId = ref.sessionId;
    }
    if (ref.sessionKey) {
      existing.sessionKey = ref.sessionKey;
    }
    return existing;
  }
  var created = {
    sessionId: ref.sessionId,
    sessionKey: ref.sessionKey,
    lastActivity: Date.now(),
    state: "idle",
    queueDepth: 0,
  };
  sessionStates.set(key, created);
  return created;
}
function logWebhookReceived(params) {
  var _a, _b;
  webhookStats.received += 1;
  webhookStats.lastReceived = Date.now();
  diag.debug(
    "webhook received: channel="
      .concat(params.channel, " type=")
      .concat((_a = params.updateType) !== null && _a !== void 0 ? _a : "unknown", " chatId=")
      .concat((_b = params.chatId) !== null && _b !== void 0 ? _b : "unknown", " total=")
      .concat(webhookStats.received),
  );
  (0, diagnostic_events_js_1.emitDiagnosticEvent)({
    type: "webhook.received",
    channel: params.channel,
    updateType: params.updateType,
    chatId: params.chatId,
  });
  markActivity();
}
function logWebhookProcessed(params) {
  var _a, _b, _c;
  webhookStats.processed += 1;
  diag.debug(
    "webhook processed: channel="
      .concat(params.channel, " type=")
      .concat((_a = params.updateType) !== null && _a !== void 0 ? _a : "unknown", " chatId=")
      .concat((_b = params.chatId) !== null && _b !== void 0 ? _b : "unknown", " duration=")
      .concat((_c = params.durationMs) !== null && _c !== void 0 ? _c : 0, "ms processed=")
      .concat(webhookStats.processed),
  );
  (0, diagnostic_events_js_1.emitDiagnosticEvent)({
    type: "webhook.processed",
    channel: params.channel,
    updateType: params.updateType,
    chatId: params.chatId,
    durationMs: params.durationMs,
  });
  markActivity();
}
function logWebhookError(params) {
  var _a, _b;
  webhookStats.errors += 1;
  diag.error(
    "webhook error: channel="
      .concat(params.channel, " type=")
      .concat((_a = params.updateType) !== null && _a !== void 0 ? _a : "unknown", " chatId=")
      .concat((_b = params.chatId) !== null && _b !== void 0 ? _b : "unknown", ' error="')
      .concat(params.error, '" errors=')
      .concat(webhookStats.errors),
  );
  (0, diagnostic_events_js_1.emitDiagnosticEvent)({
    type: "webhook.error",
    channel: params.channel,
    updateType: params.updateType,
    chatId: params.chatId,
    error: params.error,
  });
  markActivity();
}
function logMessageQueued(params) {
  var _a, _b;
  var state = getSessionState(params);
  state.queueDepth += 1;
  state.lastActivity = Date.now();
  diag.debug(
    "message queued: sessionId="
      .concat((_a = state.sessionId) !== null && _a !== void 0 ? _a : "unknown", " sessionKey=")
      .concat((_b = state.sessionKey) !== null && _b !== void 0 ? _b : "unknown", " source=")
      .concat(params.source, " queueDepth=")
      .concat(state.queueDepth, " sessionState=")
      .concat(state.state),
  );
  (0, diagnostic_events_js_1.emitDiagnosticEvent)({
    type: "message.queued",
    sessionId: state.sessionId,
    sessionKey: state.sessionKey,
    channel: params.channel,
    source: params.source,
    queueDepth: state.queueDepth,
  });
  markActivity();
}
function logMessageProcessed(params) {
  var _a, _b, _c, _d, _e;
  var payload = "message processed: channel="
    .concat(params.channel, " chatId=")
    .concat((_a = params.chatId) !== null && _a !== void 0 ? _a : "unknown", " messageId=")
    .concat((_b = params.messageId) !== null && _b !== void 0 ? _b : "unknown", " sessionId=")
    .concat((_c = params.sessionId) !== null && _c !== void 0 ? _c : "unknown", " sessionKey=")
    .concat((_d = params.sessionKey) !== null && _d !== void 0 ? _d : "unknown", " outcome=")
    .concat(params.outcome, " duration=")
    .concat((_e = params.durationMs) !== null && _e !== void 0 ? _e : 0, "ms")
    .concat(params.reason ? " reason=".concat(params.reason) : "")
    .concat(params.error ? ' error="'.concat(params.error, '"') : "");
  if (params.outcome === "error") {
    diag.error(payload);
  } else if (params.outcome === "skipped") {
    diag.debug(payload);
  } else {
    diag.debug(payload);
  }
  (0, diagnostic_events_js_1.emitDiagnosticEvent)({
    type: "message.processed",
    channel: params.channel,
    chatId: params.chatId,
    messageId: params.messageId,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    durationMs: params.durationMs,
    outcome: params.outcome,
    reason: params.reason,
    error: params.error,
  });
  markActivity();
}
function logSessionStateChange(params) {
  var _a, _b, _c, _d, _e;
  var state = getSessionState(params);
  var isProbeSession =
    (_b = (_a = state.sessionId) === null || _a === void 0 ? void 0 : _a.startsWith("probe-")) !==
      null && _b !== void 0
      ? _b
      : false;
  var prevState = state.state;
  state.state = params.state;
  state.lastActivity = Date.now();
  if (params.state === "idle") {
    state.queueDepth = Math.max(0, state.queueDepth - 1);
  }
  if (!isProbeSession) {
    diag.debug(
      "session state: sessionId="
        .concat((_c = state.sessionId) !== null && _c !== void 0 ? _c : "unknown", " sessionKey=")
        .concat((_d = state.sessionKey) !== null && _d !== void 0 ? _d : "unknown", " prev=")
        .concat(prevState, " new=")
        .concat(params.state, ' reason="')
        .concat((_e = params.reason) !== null && _e !== void 0 ? _e : "", '" queueDepth=')
        .concat(state.queueDepth),
    );
  }
  (0, diagnostic_events_js_1.emitDiagnosticEvent)({
    type: "session.state",
    sessionId: state.sessionId,
    sessionKey: state.sessionKey,
    prevState: prevState,
    state: params.state,
    reason: params.reason,
    queueDepth: state.queueDepth,
  });
  markActivity();
}
function logSessionStuck(params) {
  var _a, _b;
  var state = getSessionState(params);
  diag.warn(
    "stuck session: sessionId="
      .concat((_a = state.sessionId) !== null && _a !== void 0 ? _a : "unknown", " sessionKey=")
      .concat((_b = state.sessionKey) !== null && _b !== void 0 ? _b : "unknown", " state=")
      .concat(params.state, " age=")
      .concat(Math.round(params.ageMs / 1000), "s queueDepth=")
      .concat(state.queueDepth),
  );
  (0, diagnostic_events_js_1.emitDiagnosticEvent)({
    type: "session.stuck",
    sessionId: state.sessionId,
    sessionKey: state.sessionKey,
    state: params.state,
    ageMs: params.ageMs,
    queueDepth: state.queueDepth,
  });
  markActivity();
}
function logLaneEnqueue(lane, queueSize) {
  diag.debug("lane enqueue: lane=".concat(lane, " queueSize=").concat(queueSize));
  (0, diagnostic_events_js_1.emitDiagnosticEvent)({
    type: "queue.lane.enqueue",
    lane: lane,
    queueSize: queueSize,
  });
  markActivity();
}
function logLaneDequeue(lane, waitMs, queueSize) {
  diag.debug(
    "lane dequeue: lane=".concat(lane, " waitMs=").concat(waitMs, " queueSize=").concat(queueSize),
  );
  (0, diagnostic_events_js_1.emitDiagnosticEvent)({
    type: "queue.lane.dequeue",
    lane: lane,
    queueSize: queueSize,
    waitMs: waitMs,
  });
  markActivity();
}
function logRunAttempt(params) {
  var _a, _b;
  diag.debug(
    "run attempt: sessionId="
      .concat((_a = params.sessionId) !== null && _a !== void 0 ? _a : "unknown", " sessionKey=")
      .concat((_b = params.sessionKey) !== null && _b !== void 0 ? _b : "unknown", " runId=")
      .concat(params.runId, " attempt=")
      .concat(params.attempt),
  );
  (0, diagnostic_events_js_1.emitDiagnosticEvent)({
    type: "run.attempt",
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    runId: params.runId,
    attempt: params.attempt,
  });
  markActivity();
}
function logActiveRuns() {
  var activeSessions = Array.from(sessionStates.entries())
    .filter(function (_a) {
      var s = _a[1];
      return s.state === "processing";
    })
    .map(function (_a) {
      var id = _a[0],
        s = _a[1];
      return ""
        .concat(id, "(q=")
        .concat(s.queueDepth, ",age=")
        .concat(Math.round((Date.now() - s.lastActivity) / 1000), "s)");
    });
  diag.debug(
    "active runs: count="
      .concat(activeSessions.length, " sessions=[")
      .concat(activeSessions.join(", "), "]"),
  );
  markActivity();
}
var heartbeatInterval = null;
function startDiagnosticHeartbeat() {
  var _a;
  if (heartbeatInterval) {
    return;
  }
  heartbeatInterval = setInterval(function () {
    var now = Date.now();
    var activeCount = Array.from(sessionStates.values()).filter(function (s) {
      return s.state === "processing";
    }).length;
    var waitingCount = Array.from(sessionStates.values()).filter(function (s) {
      return s.state === "waiting";
    }).length;
    var totalQueued = Array.from(sessionStates.values()).reduce(function (sum, s) {
      return sum + s.queueDepth;
    }, 0);
    var hasActivity =
      lastActivityAt > 0 ||
      webhookStats.received > 0 ||
      activeCount > 0 ||
      waitingCount > 0 ||
      totalQueued > 0;
    if (!hasActivity) {
      return;
    }
    if (now - lastActivityAt > 120000 && activeCount === 0 && waitingCount === 0) {
      return;
    }
    diag.debug(
      "heartbeat: webhooks="
        .concat(webhookStats.received, "/")
        .concat(webhookStats.processed, "/")
        .concat(webhookStats.errors, " active=")
        .concat(activeCount, " waiting=")
        .concat(waitingCount, " queued=")
        .concat(totalQueued),
    );
    (0, diagnostic_events_js_1.emitDiagnosticEvent)({
      type: "diagnostic.heartbeat",
      webhooks: {
        received: webhookStats.received,
        processed: webhookStats.processed,
        errors: webhookStats.errors,
      },
      active: activeCount,
      waiting: waitingCount,
      queued: totalQueued,
    });
    for (var _i = 0, sessionStates_1 = sessionStates; _i < sessionStates_1.length; _i++) {
      var _a = sessionStates_1[_i],
        state = _a[1];
      var ageMs = now - state.lastActivity;
      if (state.state === "processing" && ageMs > 120000) {
        logSessionStuck({
          sessionId: state.sessionId,
          sessionKey: state.sessionKey,
          state: state.state,
          ageMs: ageMs,
        });
      }
    }
  }, 30000);
  (_a = heartbeatInterval.unref) === null || _a === void 0 ? void 0 : _a.call(heartbeatInterval);
}
function stopDiagnosticHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}
