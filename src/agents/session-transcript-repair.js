"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMissingToolResult = makeMissingToolResult;
exports.sanitizeToolUseResultPairing = sanitizeToolUseResultPairing;
exports.repairToolUseResultPairing = repairToolUseResultPairing;
function extractToolCallsFromAssistant(msg) {
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
function makeMissingToolResult(params) {
  var _a;
  return {
    role: "toolResult",
    toolCallId: params.toolCallId,
    toolName: (_a = params.toolName) !== null && _a !== void 0 ? _a : "unknown",
    content: [
      {
        type: "text",
        text: "[openclaw] missing tool result in session history; inserted synthetic error result for transcript repair.",
      },
    ],
    isError: true,
    timestamp: Date.now(),
  };
}
function sanitizeToolUseResultPairing(messages) {
  return repairToolUseResultPairing(messages).messages;
}
function repairToolUseResultPairing(messages) {
  // Anthropic (and Cloud Code Assist) reject transcripts where assistant tool calls are not
  // immediately followed by matching tool results. Session files can end up with results
  // displaced (e.g. after user turns) or duplicated. Repair by:
  // - moving matching toolResult messages directly after their assistant toolCall turn
  // - inserting synthetic error toolResults for missing ids
  // - dropping duplicate toolResults for the same id (anywhere in the transcript)
  var out = [];
  var added = [];
  var seenToolResultIds = new Set();
  var droppedDuplicateCount = 0;
  var droppedOrphanCount = 0;
  var moved = false;
  var changed = false;
  var pushToolResult = function (msg) {
    var id = extractToolResultId(msg);
    if (id && seenToolResultIds.has(id)) {
      droppedDuplicateCount += 1;
      changed = true;
      return;
    }
    if (id) {
      seenToolResultIds.add(id);
    }
    out.push(msg);
  };
  for (var i = 0; i < messages.length; i += 1) {
    var msg = messages[i];
    if (!msg || typeof msg !== "object") {
      out.push(msg);
      continue;
    }
    var role = msg.role;
    if (role !== "assistant") {
      // Tool results must only appear directly after the matching assistant tool call turn.
      // Any "free-floating" toolResult entries in session history can make strict providers
      // (Anthropic-compatible APIs, MiniMax, Cloud Code Assist) reject the entire request.
      if (role !== "toolResult") {
        out.push(msg);
      } else {
        droppedOrphanCount += 1;
        changed = true;
      }
      continue;
    }
    var assistant = msg;
    var toolCalls = extractToolCallsFromAssistant(assistant);
    if (toolCalls.length === 0) {
      out.push(msg);
      continue;
    }
    var toolCallIds = new Set(
      toolCalls.map(function (t) {
        return t.id;
      }),
    );
    var spanResultsById = new Map();
    var remainder = [];
    var j = i + 1;
    for (; j < messages.length; j += 1) {
      var next = messages[j];
      if (!next || typeof next !== "object") {
        remainder.push(next);
        continue;
      }
      var nextRole = next.role;
      if (nextRole === "assistant") {
        break;
      }
      if (nextRole === "toolResult") {
        var toolResult = next;
        var id = extractToolResultId(toolResult);
        if (id && toolCallIds.has(id)) {
          if (seenToolResultIds.has(id)) {
            droppedDuplicateCount += 1;
            changed = true;
            continue;
          }
          if (!spanResultsById.has(id)) {
            spanResultsById.set(id, toolResult);
          }
          continue;
        }
      }
      // Drop tool results that don't match the current assistant tool calls.
      if (nextRole !== "toolResult") {
        remainder.push(next);
      } else {
        droppedOrphanCount += 1;
        changed = true;
      }
    }
    out.push(msg);
    if (spanResultsById.size > 0 && remainder.length > 0) {
      moved = true;
      changed = true;
    }
    for (var _i = 0, toolCalls_1 = toolCalls; _i < toolCalls_1.length; _i++) {
      var call = toolCalls_1[_i];
      var existing = spanResultsById.get(call.id);
      if (existing) {
        pushToolResult(existing);
      } else {
        var missing = makeMissingToolResult({
          toolCallId: call.id,
          toolName: call.name,
        });
        added.push(missing);
        changed = true;
        pushToolResult(missing);
      }
    }
    for (var _a = 0, remainder_1 = remainder; _a < remainder_1.length; _a++) {
      var rem = remainder_1[_a];
      if (!rem || typeof rem !== "object") {
        out.push(rem);
        continue;
      }
      out.push(rem);
    }
    i = j - 1;
  }
  var changedOrMoved = changed || moved;
  return {
    messages: changedOrMoved ? out : messages,
    added: added,
    droppedDuplicateCount: droppedDuplicateCount,
    droppedOrphanCount: droppedOrphanCount,
    moved: changedOrMoved,
  };
}
