"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionSlug = createSessionSlug;
exports.addSession = addSession;
exports.getSession = getSession;
exports.getFinishedSession = getFinishedSession;
exports.deleteSession = deleteSession;
exports.appendOutput = appendOutput;
exports.drainSession = drainSession;
exports.markExited = markExited;
exports.markBackgrounded = markBackgrounded;
exports.tail = tail;
exports.trimWithCap = trimWithCap;
exports.listRunningSessions = listRunningSessions;
exports.listFinishedSessions = listFinishedSessions;
exports.clearFinished = clearFinished;
exports.resetProcessRegistryForTests = resetProcessRegistryForTests;
exports.setJobTtlMs = setJobTtlMs;
var session_slug_js_1 = require("./session-slug.js");
var DEFAULT_JOB_TTL_MS = 30 * 60 * 1000; // 30 minutes
var MIN_JOB_TTL_MS = 60 * 1000; // 1 minute
var MAX_JOB_TTL_MS = 3 * 60 * 60 * 1000; // 3 hours
var DEFAULT_PENDING_OUTPUT_CHARS = 30000;
function clampTtl(value) {
  if (!value || Number.isNaN(value)) {
    return DEFAULT_JOB_TTL_MS;
  }
  return Math.min(Math.max(value, MIN_JOB_TTL_MS), MAX_JOB_TTL_MS);
}
var jobTtlMs = clampTtl(
  Number.parseInt((_a = process.env.PI_BASH_JOB_TTL_MS) !== null && _a !== void 0 ? _a : "", 10),
);
var runningSessions = new Map();
var finishedSessions = new Map();
var sweeper = null;
function isSessionIdTaken(id) {
  return runningSessions.has(id) || finishedSessions.has(id);
}
function createSessionSlug() {
  return (0, session_slug_js_1.createSessionSlug)(isSessionIdTaken);
}
function addSession(session) {
  runningSessions.set(session.id, session);
  startSweeper();
}
function getSession(id) {
  return runningSessions.get(id);
}
function getFinishedSession(id) {
  return finishedSessions.get(id);
}
function deleteSession(id) {
  runningSessions.delete(id);
  finishedSessions.delete(id);
}
function appendOutput(session, stream, chunk) {
  var _a, _b, _c, _d, _e;
  (_a = session.pendingStdout) !== null && _a !== void 0 ? _a : (session.pendingStdout = []);
  (_b = session.pendingStderr) !== null && _b !== void 0 ? _b : (session.pendingStderr = []);
  (_c = session.pendingStdoutChars) !== null && _c !== void 0
    ? _c
    : (session.pendingStdoutChars = sumPendingChars(session.pendingStdout));
  (_d = session.pendingStderrChars) !== null && _d !== void 0
    ? _d
    : (session.pendingStderrChars = sumPendingChars(session.pendingStderr));
  var buffer = stream === "stdout" ? session.pendingStdout : session.pendingStderr;
  var bufferChars = stream === "stdout" ? session.pendingStdoutChars : session.pendingStderrChars;
  var pendingCap = Math.min(
    (_e = session.pendingMaxOutputChars) !== null && _e !== void 0
      ? _e
      : DEFAULT_PENDING_OUTPUT_CHARS,
    session.maxOutputChars,
  );
  buffer.push(chunk);
  var pendingChars = bufferChars + chunk.length;
  if (pendingChars > pendingCap) {
    session.truncated = true;
    pendingChars = capPendingBuffer(buffer, pendingChars, pendingCap);
  }
  if (stream === "stdout") {
    session.pendingStdoutChars = pendingChars;
  } else {
    session.pendingStderrChars = pendingChars;
  }
  session.totalOutputChars += chunk.length;
  var aggregated = trimWithCap(session.aggregated + chunk, session.maxOutputChars);
  session.truncated =
    session.truncated || aggregated.length < session.aggregated.length + chunk.length;
  session.aggregated = aggregated;
  session.tail = tail(session.aggregated, 2000);
}
function drainSession(session) {
  var stdout = session.pendingStdout.join("");
  var stderr = session.pendingStderr.join("");
  session.pendingStdout = [];
  session.pendingStderr = [];
  session.pendingStdoutChars = 0;
  session.pendingStderrChars = 0;
  return { stdout: stdout, stderr: stderr };
}
function markExited(session, exitCode, exitSignal, status) {
  session.exited = true;
  session.exitCode = exitCode;
  session.exitSignal = exitSignal;
  session.tail = tail(session.aggregated, 2000);
  moveToFinished(session, status);
}
function markBackgrounded(session) {
  session.backgrounded = true;
}
function moveToFinished(session, status) {
  runningSessions.delete(session.id);
  if (!session.backgrounded) {
    return;
  }
  finishedSessions.set(session.id, {
    id: session.id,
    command: session.command,
    scopeKey: session.scopeKey,
    startedAt: session.startedAt,
    endedAt: Date.now(),
    cwd: session.cwd,
    status: status,
    exitCode: session.exitCode,
    exitSignal: session.exitSignal,
    aggregated: session.aggregated,
    tail: session.tail,
    truncated: session.truncated,
    totalOutputChars: session.totalOutputChars,
  });
}
function tail(text, max) {
  if (max === void 0) {
    max = 2000;
  }
  if (text.length <= max) {
    return text;
  }
  return text.slice(text.length - max);
}
function sumPendingChars(buffer) {
  var total = 0;
  for (var _i = 0, buffer_1 = buffer; _i < buffer_1.length; _i++) {
    var chunk = buffer_1[_i];
    total += chunk.length;
  }
  return total;
}
function capPendingBuffer(buffer, pendingChars, cap) {
  if (pendingChars <= cap) {
    return pendingChars;
  }
  var last = buffer.at(-1);
  if (last && last.length >= cap) {
    buffer.length = 0;
    buffer.push(last.slice(last.length - cap));
    return cap;
  }
  while (buffer.length && pendingChars - buffer[0].length >= cap) {
    pendingChars -= buffer[0].length;
    buffer.shift();
  }
  if (buffer.length && pendingChars > cap) {
    var overflow = pendingChars - cap;
    buffer[0] = buffer[0].slice(overflow);
    pendingChars = cap;
  }
  return pendingChars;
}
function trimWithCap(text, max) {
  if (text.length <= max) {
    return text;
  }
  return text.slice(text.length - max);
}
function listRunningSessions() {
  return Array.from(runningSessions.values()).filter(function (s) {
    return s.backgrounded;
  });
}
function listFinishedSessions() {
  return Array.from(finishedSessions.values());
}
function clearFinished() {
  finishedSessions.clear();
}
function resetProcessRegistryForTests() {
  runningSessions.clear();
  finishedSessions.clear();
  stopSweeper();
}
function setJobTtlMs(value) {
  if (value === undefined || Number.isNaN(value)) {
    return;
  }
  jobTtlMs = clampTtl(value);
  stopSweeper();
  startSweeper();
}
function pruneFinishedSessions() {
  var cutoff = Date.now() - jobTtlMs;
  for (var _i = 0, _a = finishedSessions.entries(); _i < _a.length; _i++) {
    var _b = _a[_i],
      id = _b[0],
      session = _b[1];
    if (session.endedAt < cutoff) {
      finishedSessions.delete(id);
    }
  }
}
function startSweeper() {
  var _a;
  if (sweeper) {
    return;
  }
  sweeper = setInterval(pruneFinishedSessions, Math.max(30000, jobTtlMs / 6));
  (_a = sweeper.unref) === null || _a === void 0 ? void 0 : _a.call(sweeper);
}
function stopSweeper() {
  if (!sweeper) {
    return;
  }
  clearInterval(sweeper);
  sweeper = null;
}
