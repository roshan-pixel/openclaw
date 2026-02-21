"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onSessionTranscriptUpdate = onSessionTranscriptUpdate;
exports.emitSessionTranscriptUpdate = emitSessionTranscriptUpdate;
var SESSION_TRANSCRIPT_LISTENERS = new Set();
function onSessionTranscriptUpdate(listener) {
  SESSION_TRANSCRIPT_LISTENERS.add(listener);
  return function () {
    SESSION_TRANSCRIPT_LISTENERS.delete(listener);
  };
}
function emitSessionTranscriptUpdate(sessionFile) {
  var trimmed = sessionFile.trim();
  if (!trimmed) {
    return;
  }
  var update = { sessionFile: trimmed };
  for (
    var _i = 0, SESSION_TRANSCRIPT_LISTENERS_1 = SESSION_TRANSCRIPT_LISTENERS;
    _i < SESSION_TRANSCRIPT_LISTENERS_1.length;
    _i++
  ) {
    var listener = SESSION_TRANSCRIPT_LISTENERS_1[_i];
    listener(update);
  }
}
