"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installSessionToolResultGuard = installSessionToolResultGuard;
var session_transcript_repair_js_1 = require("./session-transcript-repair.js");
var transcript_events_js_1 = require("../sessions/transcript-events.js");
function extractAssistantToolCalls(msg) {
  var content = msg.content;
  if (!Array.isArray(content)) {
    return [];
  }
  var toolCalls = [];
  for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
    var block = content_1[_i];
    if (!block || typeof block !== "object") {
      continue;
    }
    var rec = block;
    if (typeof rec.id !== "string" || !rec.id) {
      continue;
    }
    if (rec.type === "toolCall" || rec.type === "toolUse" || rec.type === "functionCall") {
      toolCalls.push({
        id: rec.id,
        name: typeof rec.name === "string" ? rec.name : undefined,
      });
    }
  }
  return toolCalls;
}
function extractToolResultId(msg) {
  var toolCallId = msg.toolCallId;
  if (typeof toolCallId === "string" && toolCallId) {
    return toolCallId;
  }
  var toolUseId = msg.toolUseId;
  if (typeof toolUseId === "string" && toolUseId) {
    return toolUseId;
  }
  return null;
}
function installSessionToolResultGuard(sessionManager, opts) {
  var _a;
  var originalAppend = sessionManager.appendMessage.bind(sessionManager);
  var pending = new Map();
  var persistToolResult = function (message, meta) {
    var transformer =
      opts === null || opts === void 0 ? void 0 : opts.transformToolResultForPersistence;
    return transformer ? transformer(message, meta) : message;
  };
  var allowSyntheticToolResults =
    (_a = opts === null || opts === void 0 ? void 0 : opts.allowSyntheticToolResults) !== null &&
    _a !== void 0
      ? _a
      : true;
  var flushPendingToolResults = function () {
    if (pending.size === 0) {
      return;
    }
    if (allowSyntheticToolResults) {
      for (var _i = 0, _a = pending.entries(); _i < _a.length; _i++) {
        var _b = _a[_i],
          id = _b[0],
          name_1 = _b[1];
        var synthetic = (0, session_transcript_repair_js_1.makeMissingToolResult)({
          toolCallId: id,
          toolName: name_1,
        });
        originalAppend(
          persistToolResult(synthetic, {
            toolCallId: id,
            toolName: name_1,
            isSynthetic: true,
          }),
        );
      }
    }
    pending.clear();
  };
  var guardedAppend = function (message) {
    var _a, _b;
    var role = message.role;
    if (role === "toolResult") {
      var id = extractToolResultId(message);
      var toolName = id ? pending.get(id) : undefined;
      if (id) {
        pending.delete(id);
      }
      return originalAppend(
        persistToolResult(message, {
          toolCallId: id !== null && id !== void 0 ? id : undefined,
          toolName: toolName,
          isSynthetic: false,
        }),
      );
    }
    var toolCalls = role === "assistant" ? extractAssistantToolCalls(message) : [];
    if (allowSyntheticToolResults) {
      // If previous tool calls are still pending, flush before non-tool results.
      if (pending.size > 0 && (toolCalls.length === 0 || role !== "assistant")) {
        flushPendingToolResults();
      }
      // If new tool calls arrive while older ones are pending, flush the old ones first.
      if (pending.size > 0 && toolCalls.length > 0) {
        flushPendingToolResults();
      }
    }
    var result = originalAppend(message);
    var sessionFile =
      (_b = (_a = sessionManager).getSessionFile) === null || _b === void 0 ? void 0 : _b.call(_a);
    if (sessionFile) {
      (0, transcript_events_js_1.emitSessionTranscriptUpdate)(sessionFile);
    }
    if (toolCalls.length > 0) {
      for (var _i = 0, toolCalls_1 = toolCalls; _i < toolCalls_1.length; _i++) {
        var call = toolCalls_1[_i];
        pending.set(call.id, call.name);
      }
    }
    return result;
  };
  // Monkey-patch appendMessage with our guarded version.
  sessionManager.appendMessage = guardedAppend;
  return {
    flushPendingToolResults: flushPendingToolResults,
    getPendingIds: function () {
      return Array.from(pending.keys());
    },
  };
}
