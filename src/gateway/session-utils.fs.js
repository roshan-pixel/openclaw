"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSessionMessages = readSessionMessages;
exports.resolveSessionTranscriptCandidates = resolveSessionTranscriptCandidates;
exports.archiveFileOnDisk = archiveFileOnDisk;
exports.capArrayByJsonBytes = capArrayByJsonBytes;
exports.readFirstUserMessageFromTranscript = readFirstUserMessageFromTranscript;
exports.readLastMessagePreviewFromTranscript = readLastMessagePreviewFromTranscript;
exports.readSessionPreviewItemsFromTranscript = readSessionPreviewItemsFromTranscript;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var sessions_js_1 = require("../config/sessions.js");
var chat_sanitize_js_1 = require("./chat-sanitize.js");
function readSessionMessages(sessionId, storePath, sessionFile) {
  var candidates = resolveSessionTranscriptCandidates(sessionId, storePath, sessionFile);
  var filePath = candidates.find(function (p) {
    return node_fs_1.default.existsSync(p);
  });
  if (!filePath) {
    return [];
  }
  var lines = node_fs_1.default.readFileSync(filePath, "utf-8").split(/\r?\n/);
  var messages = [];
  for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
    var line = lines_1[_i];
    if (!line.trim()) {
      continue;
    }
    try {
      var parsed = JSON.parse(line);
      if (parsed === null || parsed === void 0 ? void 0 : parsed.message) {
        messages.push(parsed.message);
      }
    } catch (_a) {
      // ignore bad lines
    }
  }
  return messages;
}
function resolveSessionTranscriptCandidates(sessionId, storePath, sessionFile, agentId) {
  var candidates = [];
  if (sessionFile) {
    candidates.push(sessionFile);
  }
  if (storePath) {
    var dir = node_path_1.default.dirname(storePath);
    candidates.push(node_path_1.default.join(dir, "".concat(sessionId, ".jsonl")));
  }
  if (agentId) {
    candidates.push((0, sessions_js_1.resolveSessionTranscriptPath)(sessionId, agentId));
  }
  var home = node_os_1.default.homedir();
  candidates.push(
    node_path_1.default.join(home, ".openclaw", "sessions", "".concat(sessionId, ".jsonl")),
  );
  return candidates;
}
function archiveFileOnDisk(filePath, reason) {
  var ts = new Date().toISOString().replaceAll(":", "-");
  var archived = "".concat(filePath, ".").concat(reason, ".").concat(ts);
  node_fs_1.default.renameSync(filePath, archived);
  return archived;
}
function jsonUtf8Bytes(value) {
  try {
    return Buffer.byteLength(JSON.stringify(value), "utf8");
  } catch (_a) {
    return Buffer.byteLength(String(value), "utf8");
  }
}
function capArrayByJsonBytes(items, maxBytes) {
  if (items.length === 0) {
    return { items: items, bytes: 2 };
  }
  var parts = items.map(function (item) {
    return jsonUtf8Bytes(item);
  });
  var bytes =
    2 +
    parts.reduce(function (a, b) {
      return a + b;
    }, 0) +
    (items.length - 1);
  var start = 0;
  while (bytes > maxBytes && start < items.length - 1) {
    bytes -= parts[start] + 1;
    start += 1;
  }
  var next = start > 0 ? items.slice(start) : items;
  return { items: next, bytes: bytes };
}
var MAX_LINES_TO_SCAN = 10;
function extractTextFromContent(content) {
  if (typeof content === "string") {
    return content.trim() || null;
  }
  if (!Array.isArray(content)) {
    return null;
  }
  for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
    var part = content_1[_i];
    if (!part || typeof part.text !== "string") {
      continue;
    }
    if (part.type === "text" || part.type === "output_text" || part.type === "input_text") {
      var trimmed = part.text.trim();
      if (trimmed) {
        return trimmed;
      }
    }
  }
  return null;
}
function readFirstUserMessageFromTranscript(sessionId, storePath, sessionFile, agentId) {
  var candidates = resolveSessionTranscriptCandidates(sessionId, storePath, sessionFile, agentId);
  var filePath = candidates.find(function (p) {
    return node_fs_1.default.existsSync(p);
  });
  if (!filePath) {
    return null;
  }
  var fd = null;
  try {
    fd = node_fs_1.default.openSync(filePath, "r");
    var buf = Buffer.alloc(8192);
    var bytesRead = node_fs_1.default.readSync(fd, buf, 0, buf.length, 0);
    if (bytesRead === 0) {
      return null;
    }
    var chunk = buf.toString("utf-8", 0, bytesRead);
    var lines = chunk.split(/\r?\n/).slice(0, MAX_LINES_TO_SCAN);
    for (var _i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
      var line = lines_2[_i];
      if (!line.trim()) {
        continue;
      }
      try {
        var parsed = JSON.parse(line);
        var msg = parsed === null || parsed === void 0 ? void 0 : parsed.message;
        if ((msg === null || msg === void 0 ? void 0 : msg.role) === "user") {
          var text = extractTextFromContent(msg.content);
          if (text) {
            return text;
          }
        }
      } catch (_a) {
        // skip malformed lines
      }
    }
  } catch (_b) {
    // file read error
  } finally {
    if (fd !== null) {
      node_fs_1.default.closeSync(fd);
    }
  }
  return null;
}
var LAST_MSG_MAX_BYTES = 16384;
var LAST_MSG_MAX_LINES = 20;
function readLastMessagePreviewFromTranscript(sessionId, storePath, sessionFile, agentId) {
  var candidates = resolveSessionTranscriptCandidates(sessionId, storePath, sessionFile, agentId);
  var filePath = candidates.find(function (p) {
    return node_fs_1.default.existsSync(p);
  });
  if (!filePath) {
    return null;
  }
  var fd = null;
  try {
    fd = node_fs_1.default.openSync(filePath, "r");
    var stat = node_fs_1.default.fstatSync(fd);
    var size = stat.size;
    if (size === 0) {
      return null;
    }
    var readStart = Math.max(0, size - LAST_MSG_MAX_BYTES);
    var readLen = Math.min(size, LAST_MSG_MAX_BYTES);
    var buf = Buffer.alloc(readLen);
    node_fs_1.default.readSync(fd, buf, 0, readLen, readStart);
    var chunk = buf.toString("utf-8");
    var lines = chunk.split(/\r?\n/).filter(function (l) {
      return l.trim();
    });
    var tailLines = lines.slice(-LAST_MSG_MAX_LINES);
    for (var i = tailLines.length - 1; i >= 0; i--) {
      var line = tailLines[i];
      try {
        var parsed = JSON.parse(line);
        var msg = parsed === null || parsed === void 0 ? void 0 : parsed.message;
        if (
          (msg === null || msg === void 0 ? void 0 : msg.role) === "user" ||
          (msg === null || msg === void 0 ? void 0 : msg.role) === "assistant"
        ) {
          var text = extractTextFromContent(msg.content);
          if (text) {
            return text;
          }
        }
      } catch (_a) {
        // skip malformed
      }
    }
  } catch (_b) {
    // file error
  } finally {
    if (fd !== null) {
      node_fs_1.default.closeSync(fd);
    }
  }
  return null;
}
var PREVIEW_READ_SIZES = [64 * 1024, 256 * 1024, 1024 * 1024];
var PREVIEW_MAX_LINES = 200;
function normalizeRole(role, isTool) {
  if (isTool) {
    return "tool";
  }
  switch ((role !== null && role !== void 0 ? role : "").toLowerCase()) {
    case "user":
      return "user";
    case "assistant":
      return "assistant";
    case "system":
      return "system";
    case "tool":
      return "tool";
    default:
      return "other";
  }
}
function truncatePreviewText(text, maxChars) {
  if (maxChars <= 0 || text.length <= maxChars) {
    return text;
  }
  if (maxChars <= 3) {
    return text.slice(0, maxChars);
  }
  return "".concat(text.slice(0, maxChars - 3), "...");
}
function extractPreviewText(message) {
  if (typeof message.content === "string") {
    var trimmed = message.content.trim();
    return trimmed ? trimmed : null;
  }
  if (Array.isArray(message.content)) {
    var parts = message.content
      .map(function (entry) {
        return typeof (entry === null || entry === void 0 ? void 0 : entry.text) === "string"
          ? entry.text
          : "";
      })
      .filter(function (text) {
        return text.trim().length > 0;
      });
    if (parts.length > 0) {
      return parts.join("\n").trim();
    }
  }
  if (typeof message.text === "string") {
    var trimmed = message.text.trim();
    return trimmed ? trimmed : null;
  }
  return null;
}
function isToolCall(message) {
  if (message.toolName || message.tool_name) {
    return true;
  }
  if (!Array.isArray(message.content)) {
    return false;
  }
  return message.content.some(function (entry) {
    if (entry === null || entry === void 0 ? void 0 : entry.name) {
      return true;
    }
    var raw =
      typeof (entry === null || entry === void 0 ? void 0 : entry.type) === "string"
        ? entry.type.toLowerCase()
        : "";
    return raw === "toolcall" || raw === "tool_call";
  });
}
function extractToolNames(message) {
  var names = [];
  if (Array.isArray(message.content)) {
    for (var _i = 0, _a = message.content; _i < _a.length; _i++) {
      var entry = _a[_i];
      if (
        typeof (entry === null || entry === void 0 ? void 0 : entry.name) === "string" &&
        entry.name.trim()
      ) {
        names.push(entry.name.trim());
      }
    }
  }
  var toolName = typeof message.toolName === "string" ? message.toolName : message.tool_name;
  if (typeof toolName === "string" && toolName.trim()) {
    names.push(toolName.trim());
  }
  return names;
}
function extractMediaSummary(message) {
  if (!Array.isArray(message.content)) {
    return null;
  }
  for (var _i = 0, _a = message.content; _i < _a.length; _i++) {
    var entry = _a[_i];
    var raw =
      typeof (entry === null || entry === void 0 ? void 0 : entry.type) === "string"
        ? entry.type.trim().toLowerCase()
        : "";
    if (!raw || raw === "text" || raw === "toolcall" || raw === "tool_call") {
      continue;
    }
    return "[".concat(raw, "]");
  }
  return null;
}
function buildPreviewItems(messages, maxItems, maxChars) {
  var items = [];
  for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
    var message = messages_1[_i];
    var toolCall = isToolCall(message);
    var role = normalizeRole(message.role, toolCall);
    var text = extractPreviewText(message);
    if (!text) {
      var toolNames = extractToolNames(message);
      if (toolNames.length > 0) {
        var shown = toolNames.slice(0, 2);
        var overflow = toolNames.length - shown.length;
        text = "call ".concat(shown.join(", "));
        if (overflow > 0) {
          text += " +".concat(overflow);
        }
      }
    }
    if (!text) {
      text = extractMediaSummary(message);
    }
    if (!text) {
      continue;
    }
    var trimmed = text.trim();
    if (!trimmed) {
      continue;
    }
    if (role === "user") {
      trimmed = (0, chat_sanitize_js_1.stripEnvelope)(trimmed);
    }
    trimmed = truncatePreviewText(trimmed, maxChars);
    items.push({ role: role, text: trimmed });
  }
  if (items.length <= maxItems) {
    return items;
  }
  return items.slice(-maxItems);
}
function readRecentMessagesFromTranscript(filePath, maxMessages, readBytes) {
  var fd = null;
  try {
    fd = node_fs_1.default.openSync(filePath, "r");
    var stat = node_fs_1.default.fstatSync(fd);
    var size = stat.size;
    if (size === 0) {
      return [];
    }
    var readStart = Math.max(0, size - readBytes);
    var readLen = Math.min(size, readBytes);
    var buf = Buffer.alloc(readLen);
    node_fs_1.default.readSync(fd, buf, 0, readLen, readStart);
    var chunk = buf.toString("utf-8");
    var lines = chunk.split(/\r?\n/).filter(function (l) {
      return l.trim();
    });
    var tailLines = lines.slice(-PREVIEW_MAX_LINES);
    var collected = [];
    for (var i = tailLines.length - 1; i >= 0; i--) {
      var line = tailLines[i];
      try {
        var parsed = JSON.parse(line);
        var msg = parsed === null || parsed === void 0 ? void 0 : parsed.message;
        if (msg && typeof msg === "object") {
          collected.push(msg);
          if (collected.length >= maxMessages) {
            break;
          }
        }
      } catch (_a) {
        // skip malformed lines
      }
    }
    return collected.toReversed();
  } catch (_b) {
    return [];
  } finally {
    if (fd !== null) {
      node_fs_1.default.closeSync(fd);
    }
  }
}
function readSessionPreviewItemsFromTranscript(
  sessionId,
  storePath,
  sessionFile,
  agentId,
  maxItems,
  maxChars,
) {
  var candidates = resolveSessionTranscriptCandidates(sessionId, storePath, sessionFile, agentId);
  var filePath = candidates.find(function (p) {
    return node_fs_1.default.existsSync(p);
  });
  if (!filePath) {
    return [];
  }
  var boundedItems = Math.max(1, Math.min(maxItems, 50));
  var boundedChars = Math.max(20, Math.min(maxChars, 2000));
  for (
    var _i = 0, PREVIEW_READ_SIZES_1 = PREVIEW_READ_SIZES;
    _i < PREVIEW_READ_SIZES_1.length;
    _i++
  ) {
    var readSize = PREVIEW_READ_SIZES_1[_i];
    var messages = readRecentMessagesFromTranscript(filePath, boundedItems, readSize);
    if (messages.length > 0 || readSize === PREVIEW_READ_SIZES[PREVIEW_READ_SIZES.length - 1]) {
      return buildPreviewItems(messages, boundedItems, boundedChars);
    }
  }
  return [];
}
