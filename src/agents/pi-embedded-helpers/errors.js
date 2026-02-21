"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isContextOverflowError = isContextOverflowError;
exports.isLikelyContextOverflowError = isLikelyContextOverflowError;
exports.isCompactionFailureError = isCompactionFailureError;
exports.getApiErrorPayloadFingerprint = getApiErrorPayloadFingerprint;
exports.isRawApiErrorPayload = isRawApiErrorPayload;
exports.parseApiErrorInfo = parseApiErrorInfo;
exports.formatRawAssistantErrorForUi = formatRawAssistantErrorForUi;
exports.formatAssistantErrorText = formatAssistantErrorText;
exports.sanitizeUserFacingText = sanitizeUserFacingText;
exports.isRateLimitAssistantError = isRateLimitAssistantError;
exports.isRateLimitErrorMessage = isRateLimitErrorMessage;
exports.isTimeoutErrorMessage = isTimeoutErrorMessage;
exports.isBillingErrorMessage = isBillingErrorMessage;
exports.isBillingAssistantError = isBillingAssistantError;
exports.isAuthErrorMessage = isAuthErrorMessage;
exports.isOverloadedErrorMessage = isOverloadedErrorMessage;
exports.parseImageDimensionError = parseImageDimensionError;
exports.isImageDimensionErrorMessage = isImageDimensionErrorMessage;
exports.parseImageSizeError = parseImageSizeError;
exports.isImageSizeError = isImageSizeError;
exports.isCloudCodeAssistFormatError = isCloudCodeAssistFormatError;
exports.isAuthAssistantError = isAuthAssistantError;
exports.classifyFailoverReason = classifyFailoverReason;
exports.isFailoverErrorMessage = isFailoverErrorMessage;
exports.isFailoverAssistantError = isFailoverAssistantError;
var sandbox_js_1 = require("../sandbox.js");
function isContextOverflowError(errorMessage) {
  if (!errorMessage) {
    return false;
  }
  var lower = errorMessage.toLowerCase();
  var hasRequestSizeExceeds = lower.includes("request size exceeds");
  var hasContextWindow =
    lower.includes("context window") ||
    lower.includes("context length") ||
    lower.includes("maximum context length");
  return (
    lower.includes("request_too_large") ||
    lower.includes("request exceeds the maximum size") ||
    lower.includes("context length exceeded") ||
    lower.includes("maximum context length") ||
    lower.includes("prompt is too long") ||
    lower.includes("exceeds model context window") ||
    (hasRequestSizeExceeds && hasContextWindow) ||
    lower.includes("context overflow") ||
    (lower.includes("413") && lower.includes("too large"))
  );
}
var CONTEXT_WINDOW_TOO_SMALL_RE = /context window.*(too small|minimum is)/i;
var CONTEXT_OVERFLOW_HINT_RE =
  /context.*overflow|context window.*(too (?:large|long)|exceed|over|limit|max(?:imum)?|requested|sent|tokens)|(?:prompt|request|input).*(too (?:large|long)|exceed|over|limit|max(?:imum)?)/i;
function isLikelyContextOverflowError(errorMessage) {
  if (!errorMessage) {
    return false;
  }
  if (CONTEXT_WINDOW_TOO_SMALL_RE.test(errorMessage)) {
    return false;
  }
  if (isContextOverflowError(errorMessage)) {
    return true;
  }
  return CONTEXT_OVERFLOW_HINT_RE.test(errorMessage);
}
function isCompactionFailureError(errorMessage) {
  if (!errorMessage) {
    return false;
  }
  if (!isContextOverflowError(errorMessage)) {
    return false;
  }
  var lower = errorMessage.toLowerCase();
  return (
    lower.includes("summarization failed") ||
    lower.includes("auto-compaction") ||
    lower.includes("compaction failed") ||
    lower.includes("compaction")
  );
}
var ERROR_PAYLOAD_PREFIX_RE =
  /^(?:error|api\s*error|apierror|openai\s*error|anthropic\s*error|gateway\s*error)[:\s-]+/i;
var FINAL_TAG_RE = /<\s*\/?\s*final\s*>/gi;
var ERROR_PREFIX_RE =
  /^(?:error|api\s*error|openai\s*error|anthropic\s*error|gateway\s*error|request failed|failed|exception)[:\s-]+/i;
var HTTP_STATUS_PREFIX_RE = /^(?:http\s*)?(\d{3})\s+(.+)$/i;
var HTTP_ERROR_HINTS = [
  "error",
  "bad request",
  "not found",
  "unauthorized",
  "forbidden",
  "internal server",
  "service unavailable",
  "gateway",
  "rate limit",
  "overloaded",
  "timeout",
  "timed out",
  "invalid",
  "too many requests",
  "permission",
];
function stripFinalTagsFromText(text) {
  if (!text) {
    return text;
  }
  return text.replace(FINAL_TAG_RE, "");
}
function collapseConsecutiveDuplicateBlocks(text) {
  var trimmed = text.trim();
  if (!trimmed) {
    return text;
  }
  var blocks = trimmed.split(/\n{2,}/);
  if (blocks.length < 2) {
    return text;
  }
  var normalizeBlock = function (value) {
    return value.trim().replace(/\s+/g, " ");
  };
  var result = [];
  var lastNormalized = null;
  for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
    var block = blocks_1[_i];
    var normalized = normalizeBlock(block);
    if (lastNormalized && normalized === lastNormalized) {
      continue;
    }
    result.push(block.trim());
    lastNormalized = normalized;
  }
  if (result.length === blocks.length) {
    return text;
  }
  return result.join("\n\n");
}
function isLikelyHttpErrorText(raw) {
  var match = raw.match(HTTP_STATUS_PREFIX_RE);
  if (!match) {
    return false;
  }
  var code = Number(match[1]);
  if (!Number.isFinite(code) || code < 400) {
    return false;
  }
  var message = match[2].toLowerCase();
  return HTTP_ERROR_HINTS.some(function (hint) {
    return message.includes(hint);
  });
}
function isErrorPayloadObject(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return false;
  }
  var record = payload;
  if (record.type === "error") {
    return true;
  }
  if (typeof record.request_id === "string" || typeof record.requestId === "string") {
    return true;
  }
  if ("error" in record) {
    var err = record.error;
    if (err && typeof err === "object" && !Array.isArray(err)) {
      var errRecord = err;
      if (
        typeof errRecord.message === "string" ||
        typeof errRecord.type === "string" ||
        typeof errRecord.code === "string"
      ) {
        return true;
      }
    }
  }
  return false;
}
function parseApiErrorPayload(raw) {
  if (!raw) {
    return null;
  }
  var trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  var candidates = [trimmed];
  if (ERROR_PAYLOAD_PREFIX_RE.test(trimmed)) {
    candidates.push(trimmed.replace(ERROR_PAYLOAD_PREFIX_RE, "").trim());
  }
  for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
    var candidate = candidates_1[_i];
    if (!candidate.startsWith("{") || !candidate.endsWith("}")) {
      continue;
    }
    try {
      var parsed = JSON.parse(candidate);
      if (isErrorPayloadObject(parsed)) {
        return parsed;
      }
    } catch (_a) {
      // ignore parse errors
    }
  }
  return null;
}
function stableStringify(value) {
  var _a;
  if (!value || typeof value !== "object") {
    return (_a = JSON.stringify(value)) !== null && _a !== void 0 ? _a : "null";
  }
  if (Array.isArray(value)) {
    return "[".concat(
      value
        .map(function (entry) {
          return stableStringify(entry);
        })
        .join(","),
      "]",
    );
  }
  var record = value;
  var keys = Object.keys(record).toSorted();
  var entries = keys.map(function (key) {
    return "".concat(JSON.stringify(key), ":").concat(stableStringify(record[key]));
  });
  return "{".concat(entries.join(","), "}");
}
function getApiErrorPayloadFingerprint(raw) {
  if (!raw) {
    return null;
  }
  var payload = parseApiErrorPayload(raw);
  if (!payload) {
    return null;
  }
  return stableStringify(payload);
}
function isRawApiErrorPayload(raw) {
  return getApiErrorPayloadFingerprint(raw) !== null;
}
function parseApiErrorInfo(raw) {
  if (!raw) {
    return null;
  }
  var trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  var httpCode;
  var candidate = trimmed;
  var httpPrefixMatch = candidate.match(/^(\d{3})\s+(.+)$/s);
  if (httpPrefixMatch) {
    httpCode = httpPrefixMatch[1];
    candidate = httpPrefixMatch[2].trim();
  }
  var payload = parseApiErrorPayload(candidate);
  if (!payload) {
    return null;
  }
  var requestId =
    typeof payload.request_id === "string"
      ? payload.request_id
      : typeof payload.requestId === "string"
        ? payload.requestId
        : undefined;
  var topType = typeof payload.type === "string" ? payload.type : undefined;
  var topMessage = typeof payload.message === "string" ? payload.message : undefined;
  var errType;
  var errMessage;
  if (payload.error && typeof payload.error === "object" && !Array.isArray(payload.error)) {
    var err = payload.error;
    if (typeof err.type === "string") {
      errType = err.type;
    }
    if (typeof err.code === "string" && !errType) {
      errType = err.code;
    }
    if (typeof err.message === "string") {
      errMessage = err.message;
    }
  }
  return {
    httpCode: httpCode,
    type: errType !== null && errType !== void 0 ? errType : topType,
    message: errMessage !== null && errMessage !== void 0 ? errMessage : topMessage,
    requestId: requestId,
  };
}
function formatRawAssistantErrorForUi(raw) {
  var trimmed = (raw !== null && raw !== void 0 ? raw : "").trim();
  if (!trimmed) {
    return "LLM request failed with an unknown error.";
  }
  var httpMatch = trimmed.match(HTTP_STATUS_PREFIX_RE);
  if (httpMatch) {
    var rest = httpMatch[2].trim();
    if (!rest.startsWith("{")) {
      return "HTTP ".concat(httpMatch[1], ": ").concat(rest);
    }
  }
  var info = parseApiErrorInfo(trimmed);
  if (info === null || info === void 0 ? void 0 : info.message) {
    var prefix = info.httpCode ? "HTTP ".concat(info.httpCode) : "LLM error";
    var type = info.type ? " ".concat(info.type) : "";
    var requestId = info.requestId ? " (request_id: ".concat(info.requestId, ")") : "";
    return "".concat(prefix).concat(type, ": ").concat(info.message).concat(requestId);
  }
  return trimmed.length > 600 ? "".concat(trimmed.slice(0, 600), "\u2026") : trimmed;
}
function formatAssistantErrorText(msg, opts) {
  var _a, _b;
  // Also format errors if errorMessage is present, even if stopReason isn't "error"
  var raw = ((_a = msg.errorMessage) !== null && _a !== void 0 ? _a : "").trim();
  if (msg.stopReason !== "error" && !raw) {
    return undefined;
  }
  if (!raw) {
    return "LLM request failed with an unknown error.";
  }
  var unknownTool =
    (_b = raw.match(/unknown tool[:\s]+["']?([a-z0-9_-]+)["']?/i)) !== null && _b !== void 0
      ? _b
      : raw.match(/tool\s+["']?([a-z0-9_-]+)["']?\s+(?:not found|is not available)/i);
  if (unknownTool === null || unknownTool === void 0 ? void 0 : unknownTool[1]) {
    var rewritten = (0, sandbox_js_1.formatSandboxToolPolicyBlockedMessage)({
      cfg: opts === null || opts === void 0 ? void 0 : opts.cfg,
      sessionKey: opts === null || opts === void 0 ? void 0 : opts.sessionKey,
      toolName: unknownTool[1],
    });
    if (rewritten) {
      return rewritten;
    }
  }
  if (isContextOverflowError(raw)) {
    return (
      "Context overflow: prompt too large for the model. " +
      "Try again with less input or a larger-context model."
    );
  }
  // Catch role ordering errors - including JSON-wrapped and "400" prefix variants
  if (
    /incorrect role information|roles must alternate|400.*role|"message".*role.*information/i.test(
      raw,
    )
  ) {
    return (
      "Message ordering conflict - please try again. " +
      "If this persists, use /new to start a fresh session."
    );
  }
  var invalidRequest = raw.match(/"type":"invalid_request_error".*?"message":"([^"]+)"/);
  if (invalidRequest === null || invalidRequest === void 0 ? void 0 : invalidRequest[1]) {
    return "LLM request rejected: ".concat(invalidRequest[1]);
  }
  if (isOverloadedErrorMessage(raw)) {
    return "The AI service is temporarily overloaded. Please try again in a moment.";
  }
  if (isLikelyHttpErrorText(raw) || isRawApiErrorPayload(raw)) {
    return formatRawAssistantErrorForUi(raw);
  }
  // Never return raw unhandled errors - log for debugging but return safe message
  if (raw.length > 600) {
    console.warn("[formatAssistantErrorText] Long error truncated:", raw.slice(0, 200));
  }
  return raw.length > 600 ? "".concat(raw.slice(0, 600), "\u2026") : raw;
}
function sanitizeUserFacingText(text) {
  if (!text) {
    return text;
  }
  var stripped = stripFinalTagsFromText(text);
  var trimmed = stripped.trim();
  if (!trimmed) {
    return stripped;
  }
  if (/incorrect role information|roles must alternate/i.test(trimmed)) {
    return (
      "Message ordering conflict - please try again. " +
      "If this persists, use /new to start a fresh session."
    );
  }
  if (isContextOverflowError(trimmed)) {
    return (
      "Context overflow: prompt too large for the model. " +
      "Try again with less input or a larger-context model."
    );
  }
  if (isRawApiErrorPayload(trimmed) || isLikelyHttpErrorText(trimmed)) {
    return formatRawAssistantErrorForUi(trimmed);
  }
  if (ERROR_PREFIX_RE.test(trimmed)) {
    if (isOverloadedErrorMessage(trimmed) || isRateLimitErrorMessage(trimmed)) {
      return "The AI service is temporarily overloaded. Please try again in a moment.";
    }
    if (isTimeoutErrorMessage(trimmed)) {
      return "LLM request timed out.";
    }
    return formatRawAssistantErrorForUi(trimmed);
  }
  return collapseConsecutiveDuplicateBlocks(stripped);
}
function isRateLimitAssistantError(msg) {
  var _a;
  if (!msg || msg.stopReason !== "error") {
    return false;
  }
  return isRateLimitErrorMessage((_a = msg.errorMessage) !== null && _a !== void 0 ? _a : "");
}
var ERROR_PATTERNS = {
  rateLimit: [
    /rate[_ ]limit|too many requests|429/,
    "exceeded your current quota",
    "resource has been exhausted",
    "quota exceeded",
    "resource_exhausted",
    "usage limit",
  ],
  overloaded: [/overloaded_error|"type"\s*:\s*"overloaded_error"/i, "overloaded"],
  timeout: ["timeout", "timed out", "deadline exceeded", "context deadline exceeded"],
  billing: [
    /\b402\b/,
    "payment required",
    "insufficient credits",
    "credit balance",
    "plans & billing",
  ],
  auth: [
    /invalid[_ ]?api[_ ]?key/,
    "incorrect api key",
    "invalid token",
    "authentication",
    "re-authenticate",
    "oauth token refresh failed",
    "unauthorized",
    "forbidden",
    "access denied",
    "expired",
    "token has expired",
    /\b401\b/,
    /\b403\b/,
    "no credentials found",
    "no api key found",
  ],
  format: [
    "string should match pattern",
    "tool_use.id",
    "tool_use_id",
    "messages.1.content.1.tool_use.id",
    "invalid request format",
  ],
};
var IMAGE_DIMENSION_ERROR_RE =
  /image dimensions exceed max allowed size for many-image requests:\s*(\d+)\s*pixels/i;
var IMAGE_DIMENSION_PATH_RE = /messages\.(\d+)\.content\.(\d+)\.image/i;
var IMAGE_SIZE_ERROR_RE = /image exceeds\s*(\d+(?:\.\d+)?)\s*mb/i;
function matchesErrorPatterns(raw, patterns) {
  if (!raw) {
    return false;
  }
  var value = raw.toLowerCase();
  return patterns.some(function (pattern) {
    return pattern instanceof RegExp ? pattern.test(value) : value.includes(pattern);
  });
}
function isRateLimitErrorMessage(raw) {
  return matchesErrorPatterns(raw, ERROR_PATTERNS.rateLimit);
}
function isTimeoutErrorMessage(raw) {
  return matchesErrorPatterns(raw, ERROR_PATTERNS.timeout);
}
function isBillingErrorMessage(raw) {
  var value = raw.toLowerCase();
  if (!value) {
    return false;
  }
  if (matchesErrorPatterns(value, ERROR_PATTERNS.billing)) {
    return true;
  }
  return (
    value.includes("billing") &&
    (value.includes("upgrade") ||
      value.includes("credits") ||
      value.includes("payment") ||
      value.includes("plan"))
  );
}
function isBillingAssistantError(msg) {
  var _a;
  if (!msg || msg.stopReason !== "error") {
    return false;
  }
  return isBillingErrorMessage((_a = msg.errorMessage) !== null && _a !== void 0 ? _a : "");
}
function isAuthErrorMessage(raw) {
  return matchesErrorPatterns(raw, ERROR_PATTERNS.auth);
}
function isOverloadedErrorMessage(raw) {
  return matchesErrorPatterns(raw, ERROR_PATTERNS.overloaded);
}
function parseImageDimensionError(raw) {
  if (!raw) {
    return null;
  }
  var lower = raw.toLowerCase();
  if (!lower.includes("image dimensions exceed max allowed size")) {
    return null;
  }
  var limitMatch = raw.match(IMAGE_DIMENSION_ERROR_RE);
  var pathMatch = raw.match(IMAGE_DIMENSION_PATH_RE);
  return {
    maxDimensionPx: (limitMatch === null || limitMatch === void 0 ? void 0 : limitMatch[1])
      ? Number.parseInt(limitMatch[1], 10)
      : undefined,
    messageIndex: (pathMatch === null || pathMatch === void 0 ? void 0 : pathMatch[1])
      ? Number.parseInt(pathMatch[1], 10)
      : undefined,
    contentIndex: (pathMatch === null || pathMatch === void 0 ? void 0 : pathMatch[2])
      ? Number.parseInt(pathMatch[2], 10)
      : undefined,
    raw: raw,
  };
}
function isImageDimensionErrorMessage(raw) {
  return Boolean(parseImageDimensionError(raw));
}
function parseImageSizeError(raw) {
  if (!raw) {
    return null;
  }
  var lower = raw.toLowerCase();
  if (!lower.includes("image exceeds") || !lower.includes("mb")) {
    return null;
  }
  var match = raw.match(IMAGE_SIZE_ERROR_RE);
  return {
    maxMb: (match === null || match === void 0 ? void 0 : match[1])
      ? Number.parseFloat(match[1])
      : undefined,
    raw: raw,
  };
}
function isImageSizeError(errorMessage) {
  if (!errorMessage) {
    return false;
  }
  return Boolean(parseImageSizeError(errorMessage));
}
function isCloudCodeAssistFormatError(raw) {
  return !isImageDimensionErrorMessage(raw) && matchesErrorPatterns(raw, ERROR_PATTERNS.format);
}
function isAuthAssistantError(msg) {
  var _a;
  if (!msg || msg.stopReason !== "error") {
    return false;
  }
  return isAuthErrorMessage((_a = msg.errorMessage) !== null && _a !== void 0 ? _a : "");
}
function classifyFailoverReason(raw) {
  if (isImageDimensionErrorMessage(raw)) {
    return null;
  }
  if (isImageSizeError(raw)) {
    return null;
  }
  if (isRateLimitErrorMessage(raw)) {
    return "rate_limit";
  }
  if (isOverloadedErrorMessage(raw)) {
    return "rate_limit";
  }
  if (isCloudCodeAssistFormatError(raw)) {
    return "format";
  }
  if (isBillingErrorMessage(raw)) {
    return "billing";
  }
  if (isTimeoutErrorMessage(raw)) {
    return "timeout";
  }
  if (isAuthErrorMessage(raw)) {
    return "auth";
  }
  return null;
}
function isFailoverErrorMessage(raw) {
  return classifyFailoverReason(raw) !== null;
}
function isFailoverAssistantError(msg) {
  var _a;
  if (!msg || msg.stopReason !== "error") {
    return false;
  }
  return isFailoverErrorMessage((_a = msg.errorMessage) !== null && _a !== void 0 ? _a : "");
}
