"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueEmbeddedPiMessage = queueEmbeddedPiMessage;
exports.abortEmbeddedPiRun = abortEmbeddedPiRun;
exports.isEmbeddedPiRunActive = isEmbeddedPiRunActive;
exports.isEmbeddedPiRunStreaming = isEmbeddedPiRunStreaming;
exports.waitForEmbeddedPiRunEnd = waitForEmbeddedPiRunEnd;
exports.setActiveEmbeddedRun = setActiveEmbeddedRun;
exports.clearActiveEmbeddedRun = clearActiveEmbeddedRun;
var diagnostic_js_1 = require("../../logging/diagnostic.js");
var ACTIVE_EMBEDDED_RUNS = new Map();
var EMBEDDED_RUN_WAITERS = new Map();
function queueEmbeddedPiMessage(sessionId, text) {
  var handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
  if (!handle) {
    diagnostic_js_1.diagnosticLogger.debug(
      "queue message failed: sessionId=".concat(sessionId, " reason=no_active_run"),
    );
    return false;
  }
  if (!handle.isStreaming()) {
    diagnostic_js_1.diagnosticLogger.debug(
      "queue message failed: sessionId=".concat(sessionId, " reason=not_streaming"),
    );
    return false;
  }
  if (handle.isCompacting()) {
    diagnostic_js_1.diagnosticLogger.debug(
      "queue message failed: sessionId=".concat(sessionId, " reason=compacting"),
    );
    return false;
  }
  (0, diagnostic_js_1.logMessageQueued)({ sessionId: sessionId, source: "pi-embedded-runner" });
  void handle.queueMessage(text);
  return true;
}
function abortEmbeddedPiRun(sessionId) {
  var handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
  if (!handle) {
    diagnostic_js_1.diagnosticLogger.debug(
      "abort failed: sessionId=".concat(sessionId, " reason=no_active_run"),
    );
    return false;
  }
  diagnostic_js_1.diagnosticLogger.debug("aborting run: sessionId=".concat(sessionId));
  handle.abort();
  return true;
}
function isEmbeddedPiRunActive(sessionId) {
  var active = ACTIVE_EMBEDDED_RUNS.has(sessionId);
  if (active) {
    diagnostic_js_1.diagnosticLogger.debug(
      "run active check: sessionId=".concat(sessionId, " active=true"),
    );
  }
  return active;
}
function isEmbeddedPiRunStreaming(sessionId) {
  var handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
  if (!handle) {
    return false;
  }
  return handle.isStreaming();
}
function waitForEmbeddedPiRunEnd(sessionId, timeoutMs) {
  if (timeoutMs === void 0) {
    timeoutMs = 15000;
  }
  if (!sessionId || !ACTIVE_EMBEDDED_RUNS.has(sessionId)) {
    return Promise.resolve(true);
  }
  diagnostic_js_1.diagnosticLogger.debug(
    "waiting for run end: sessionId=".concat(sessionId, " timeoutMs=").concat(timeoutMs),
  );
  return new Promise(function (resolve) {
    var _a;
    var waiters =
      (_a = EMBEDDED_RUN_WAITERS.get(sessionId)) !== null && _a !== void 0 ? _a : new Set();
    var waiter = {
      resolve: resolve,
      timer: setTimeout(
        function () {
          waiters.delete(waiter);
          if (waiters.size === 0) {
            EMBEDDED_RUN_WAITERS.delete(sessionId);
          }
          diagnostic_js_1.diagnosticLogger.warn(
            "wait timeout: sessionId=".concat(sessionId, " timeoutMs=").concat(timeoutMs),
          );
          resolve(false);
        },
        Math.max(100, timeoutMs),
      ),
    };
    waiters.add(waiter);
    EMBEDDED_RUN_WAITERS.set(sessionId, waiters);
    if (!ACTIVE_EMBEDDED_RUNS.has(sessionId)) {
      waiters.delete(waiter);
      if (waiters.size === 0) {
        EMBEDDED_RUN_WAITERS.delete(sessionId);
      }
      clearTimeout(waiter.timer);
      resolve(true);
    }
  });
}
function notifyEmbeddedRunEnded(sessionId) {
  var waiters = EMBEDDED_RUN_WAITERS.get(sessionId);
  if (!waiters || waiters.size === 0) {
    return;
  }
  EMBEDDED_RUN_WAITERS.delete(sessionId);
  diagnostic_js_1.diagnosticLogger.debug(
    "notifying waiters: sessionId=".concat(sessionId, " waiterCount=").concat(waiters.size),
  );
  for (var _i = 0, waiters_1 = waiters; _i < waiters_1.length; _i++) {
    var waiter = waiters_1[_i];
    clearTimeout(waiter.timer);
    waiter.resolve(true);
  }
}
function setActiveEmbeddedRun(sessionId, handle) {
  var wasActive = ACTIVE_EMBEDDED_RUNS.has(sessionId);
  ACTIVE_EMBEDDED_RUNS.set(sessionId, handle);
  (0, diagnostic_js_1.logSessionStateChange)({
    sessionId: sessionId,
    state: "processing",
    reason: wasActive ? "run_replaced" : "run_started",
  });
  if (!sessionId.startsWith("probe-")) {
    diagnostic_js_1.diagnosticLogger.debug(
      "run registered: sessionId="
        .concat(sessionId, " totalActive=")
        .concat(ACTIVE_EMBEDDED_RUNS.size),
    );
  }
}
function clearActiveEmbeddedRun(sessionId, handle) {
  if (ACTIVE_EMBEDDED_RUNS.get(sessionId) === handle) {
    ACTIVE_EMBEDDED_RUNS.delete(sessionId);
    (0, diagnostic_js_1.logSessionStateChange)({
      sessionId: sessionId,
      state: "idle",
      reason: "run_completed",
    });
    if (!sessionId.startsWith("probe-")) {
      diagnostic_js_1.diagnosticLogger.debug(
        "run cleared: sessionId="
          .concat(sessionId, " totalActive=")
          .concat(ACTIVE_EMBEDDED_RUNS.size),
      );
    }
    notifyEmbeddedRunEnded(sessionId);
  } else {
    diagnostic_js_1.diagnosticLogger.debug(
      "run clear skipped: sessionId=".concat(sessionId, " reason=handle_mismatch"),
    );
  }
}
