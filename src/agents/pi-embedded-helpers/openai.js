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
exports.downgradeOpenAIReasoningBlocks = downgradeOpenAIReasoningBlocks;
function parseOpenAIReasoningSignature(value) {
  if (!value) {
    return null;
  }
  var candidate = null;
  if (typeof value === "string") {
    var trimmed = value.trim();
    if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
      return null;
    }
    try {
      candidate = JSON.parse(trimmed);
    } catch (_a) {
      return null;
    }
  } else if (typeof value === "object") {
    candidate = value;
  }
  if (!candidate) {
    return null;
  }
  var id = typeof candidate.id === "string" ? candidate.id : "";
  var type = typeof candidate.type === "string" ? candidate.type : "";
  if (!id.startsWith("rs_")) {
    return null;
  }
  if (type === "reasoning" || type.startsWith("reasoning.")) {
    return { id: id, type: type };
  }
  return null;
}
function hasFollowingNonThinkingBlock(content, index) {
  for (var i = index + 1; i < content.length; i++) {
    var block = content[i];
    if (!block || typeof block !== "object") {
      return true;
    }
    if (block.type !== "thinking") {
      return true;
    }
  }
  return false;
}
/**
 * OpenAI Responses API can reject transcripts that contain a standalone `reasoning` item id
 * without the required following item.
 *
 * OpenClaw persists provider-specific reasoning metadata in `thinkingSignature`; if that metadata
 * is incomplete, drop the block to keep history usable.
 */
function downgradeOpenAIReasoningBlocks(messages) {
  var out = [];
  for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
    var msg = messages_1[_i];
    if (!msg || typeof msg !== "object") {
      out.push(msg);
      continue;
    }
    var role = msg.role;
    if (role !== "assistant") {
      out.push(msg);
      continue;
    }
    var assistantMsg = msg;
    if (!Array.isArray(assistantMsg.content)) {
      out.push(msg);
      continue;
    }
    var changed = false;
    var nextContent = [];
    for (var i = 0; i < assistantMsg.content.length; i++) {
      var block = assistantMsg.content[i];
      if (!block || typeof block !== "object") {
        nextContent.push(block);
        continue;
      }
      var record = block;
      if (record.type !== "thinking") {
        nextContent.push(block);
        continue;
      }
      var signature = parseOpenAIReasoningSignature(record.thinkingSignature);
      if (!signature) {
        nextContent.push(block);
        continue;
      }
      if (hasFollowingNonThinkingBlock(assistantMsg.content, i)) {
        nextContent.push(block);
        continue;
      }
      changed = true;
    }
    if (!changed) {
      out.push(msg);
      continue;
    }
    if (nextContent.length === 0) {
      continue;
    }
    out.push(__assign(__assign({}, assistantMsg), { content: nextContent }));
  }
  return out;
}
