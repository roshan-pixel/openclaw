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
exports.sanitizeToolCallId = sanitizeToolCallId;
exports.isValidCloudCodeAssistToolId = isValidCloudCodeAssistToolId;
exports.sanitizeToolCallIdsForCloudCodeAssist = sanitizeToolCallIdsForCloudCodeAssist;
var node_crypto_1 = require("node:crypto");
var STRICT9_LEN = 9;
/**
 * Sanitize a tool call ID to be compatible with various providers.
 *
 * - "strict" mode: only [a-zA-Z0-9]
 * - "strict9" mode: only [a-zA-Z0-9], length 9 (Mistral tool call requirement)
 */
function sanitizeToolCallId(id, mode) {
  if (mode === void 0) {
    mode = "strict";
  }
  if (!id || typeof id !== "string") {
    if (mode === "strict9") {
      return "defaultid";
    }
    return "defaulttoolid";
  }
  if (mode === "strict9") {
    var alphanumericOnly_1 = id.replace(/[^a-zA-Z0-9]/g, "");
    if (alphanumericOnly_1.length >= STRICT9_LEN) {
      return alphanumericOnly_1.slice(0, STRICT9_LEN);
    }
    if (alphanumericOnly_1.length > 0) {
      return shortHash(alphanumericOnly_1, STRICT9_LEN);
    }
    return shortHash("sanitized", STRICT9_LEN);
  }
  // Some providers require strictly alphanumeric tool call IDs.
  var alphanumericOnly = id.replace(/[^a-zA-Z0-9]/g, "");
  return alphanumericOnly.length > 0 ? alphanumericOnly : "sanitizedtoolid";
}
function isValidCloudCodeAssistToolId(id, mode) {
  if (mode === void 0) {
    mode = "strict";
  }
  if (!id || typeof id !== "string") {
    return false;
  }
  if (mode === "strict9") {
    return /^[a-zA-Z0-9]{9}$/.test(id);
  }
  // Strictly alphanumeric for providers with tighter tool ID constraints
  return /^[a-zA-Z0-9]+$/.test(id);
}
function shortHash(text, length) {
  if (length === void 0) {
    length = 8;
  }
  return (0, node_crypto_1.createHash)("sha1").update(text).digest("hex").slice(0, length);
}
function makeUniqueToolId(params) {
  if (params.mode === "strict9") {
    var base_1 = sanitizeToolCallId(params.id, params.mode);
    var candidate_1 = base_1.length >= STRICT9_LEN ? base_1.slice(0, STRICT9_LEN) : "";
    if (candidate_1 && !params.used.has(candidate_1)) {
      return candidate_1;
    }
    for (var i = 0; i < 1000; i += 1) {
      var hashed = shortHash("".concat(params.id, ":").concat(i), STRICT9_LEN);
      if (!params.used.has(hashed)) {
        return hashed;
      }
    }
    return shortHash("".concat(params.id, ":").concat(Date.now()), STRICT9_LEN);
  }
  var MAX_LEN = 40;
  var base = sanitizeToolCallId(params.id, params.mode).slice(0, MAX_LEN);
  if (!params.used.has(base)) {
    return base;
  }
  var hash = shortHash(params.id);
  // Use separator based on mode: none for strict, underscore for non-strict variants
  var separator = params.mode === "strict" ? "" : "_";
  var maxBaseLen = MAX_LEN - separator.length - hash.length;
  var clippedBase = base.length > maxBaseLen ? base.slice(0, maxBaseLen) : base;
  var candidate = "".concat(clippedBase).concat(separator).concat(hash);
  if (!params.used.has(candidate)) {
    return candidate;
  }
  for (var i = 2; i < 1000; i += 1) {
    var suffix = params.mode === "strict" ? "x".concat(i) : "_".concat(i);
    var next = "".concat(candidate.slice(0, MAX_LEN - suffix.length)).concat(suffix);
    if (!params.used.has(next)) {
      return next;
    }
  }
  var ts = params.mode === "strict" ? "t".concat(Date.now()) : "_".concat(Date.now());
  return "".concat(candidate.slice(0, MAX_LEN - ts.length)).concat(ts);
}
function rewriteAssistantToolCallIds(params) {
  var content = params.message.content;
  if (!Array.isArray(content)) {
    return params.message;
  }
  var changed = false;
  var next = content.map(function (block) {
    if (!block || typeof block !== "object") {
      return block;
    }
    var rec = block;
    var type = rec.type;
    var id = rec.id;
    if (
      (type !== "functionCall" && type !== "toolUse" && type !== "toolCall") ||
      typeof id !== "string" ||
      !id
    ) {
      return block;
    }
    var nextId = params.resolve(id);
    if (nextId === id) {
      return block;
    }
    changed = true;
    return __assign(__assign({}, block), { id: nextId });
  });
  if (!changed) {
    return params.message;
  }
  return __assign(__assign({}, params.message), { content: next });
}
function rewriteToolResultIds(params) {
  var toolCallId =
    typeof params.message.toolCallId === "string" && params.message.toolCallId
      ? params.message.toolCallId
      : undefined;
  var toolUseId = params.message.toolUseId;
  var toolUseIdStr = typeof toolUseId === "string" && toolUseId ? toolUseId : undefined;
  var nextToolCallId = toolCallId ? params.resolve(toolCallId) : undefined;
  var nextToolUseId = toolUseIdStr ? params.resolve(toolUseIdStr) : undefined;
  if (nextToolCallId === toolCallId && nextToolUseId === toolUseIdStr) {
    return params.message;
  }
  return __assign(
    __assign(__assign({}, params.message), nextToolCallId && { toolCallId: nextToolCallId }),
    nextToolUseId && { toolUseId: nextToolUseId },
  );
}
/**
 * Sanitize tool call IDs for provider compatibility.
 *
 * @param messages - The messages to sanitize
 * @param mode - "strict" (alphanumeric only) or "strict9" (alphanumeric length 9)
 */
function sanitizeToolCallIdsForCloudCodeAssist(messages, mode) {
  if (mode === void 0) {
    mode = "strict";
  }
  // Strict mode: only [a-zA-Z0-9]
  // Strict9 mode: only [a-zA-Z0-9], length 9 (Mistral tool call requirement)
  // Sanitization can introduce collisions (e.g. `a|b` and `a:b` -> `ab`).
  // Fix by applying a stable, transcript-wide mapping and de-duping via suffix.
  var map = new Map();
  var used = new Set();
  var resolve = function (id) {
    var existing = map.get(id);
    if (existing) {
      return existing;
    }
    var next = makeUniqueToolId({ id: id, used: used, mode: mode });
    map.set(id, next);
    used.add(next);
    return next;
  };
  var changed = false;
  var out = messages.map(function (msg) {
    if (!msg || typeof msg !== "object") {
      return msg;
    }
    var role = msg.role;
    if (role === "assistant") {
      var next = rewriteAssistantToolCallIds({
        message: msg,
        resolve: resolve,
      });
      if (next !== msg) {
        changed = true;
      }
      return next;
    }
    if (role === "toolResult") {
      var next = rewriteToolResultIds({
        message: msg,
        resolve: resolve,
      });
      if (next !== msg) {
        changed = true;
      }
      return next;
    }
    return msg;
  });
  return changed ? out : messages;
}
