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
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) {
            throw t[1];
          }
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) {
        throw new TypeError("Generator is already executing.");
      }
      while ((g && ((g = 0), op[0] && (_ = 0)), _)) {
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      }
      if (op[0] & 5) {
        throw op[1];
      }
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeToolsForGoogle = sanitizeToolsForGoogle;
exports.logToolSchemasForGoogle = logToolSchemasForGoogle;
exports.onUnhandledCompactionFailure = onUnhandledCompactionFailure;
exports.applyGoogleTurnOrderingFix = applyGoogleTurnOrderingFix;
exports.sanitizeSessionHistory = sanitizeSessionHistory;
var node_events_1 = require("node:events");
var unhandled_rejections_js_1 = require("../../infra/unhandled-rejections.js");
var pi_embedded_helpers_js_1 = require("../pi-embedded-helpers.js");
var session_transcript_repair_js_1 = require("../session-transcript-repair.js");
var logger_js_1 = require("./logger.js");
var utils_js_1 = require("./utils.js");
var pi_tools_schema_js_1 = require("../pi-tools.schema.js");
var transcript_policy_js_1 = require("../transcript-policy.js");
var GOOGLE_TURN_ORDERING_CUSTOM_TYPE = "google-turn-ordering-bootstrap";
var GOOGLE_SCHEMA_UNSUPPORTED_KEYWORDS = new Set([
  "patternProperties",
  "additionalProperties",
  "$schema",
  "$id",
  "$ref",
  "$defs",
  "definitions",
  "examples",
  "minLength",
  "maxLength",
  "minimum",
  "maximum",
  "multipleOf",
  "pattern",
  "format",
  "minItems",
  "maxItems",
  "uniqueItems",
  "minProperties",
  "maxProperties",
]);
var ANTIGRAVITY_SIGNATURE_RE = /^[A-Za-z0-9+/]+={0,2}$/;
function isValidAntigravitySignature(value) {
  if (typeof value !== "string") {
    return false;
  }
  var trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  if (trimmed.length % 4 !== 0) {
    return false;
  }
  return ANTIGRAVITY_SIGNATURE_RE.test(trimmed);
}
function sanitizeAntigravityThinkingBlocks(messages) {
  var _a, _b, _c;
  var touched = false;
  var out = [];
  for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
    var msg = messages_1[_i];
    if (!msg || typeof msg !== "object" || msg.role !== "assistant") {
      out.push(msg);
      continue;
    }
    var assistant = msg;
    if (!Array.isArray(assistant.content)) {
      out.push(msg);
      continue;
    }
    var nextContent = [];
    var contentChanged = false;
    for (var _d = 0, _e = assistant.content; _d < _e.length; _d++) {
      var block = _e[_d];
      if (!block || typeof block !== "object" || block.type !== "thinking") {
        nextContent.push(block);
        continue;
      }
      var rec = block;
      var candidate =
        (_c =
          (_b = (_a = rec.thinkingSignature) !== null && _a !== void 0 ? _a : rec.signature) !==
            null && _b !== void 0
            ? _b
            : rec.thought_signature) !== null && _c !== void 0
          ? _c
          : rec.thoughtSignature;
      if (!isValidAntigravitySignature(candidate)) {
        contentChanged = true;
        continue;
      }
      if (rec.thinkingSignature !== candidate) {
        var nextBlock = __assign(__assign({}, block), { thinkingSignature: candidate });
        nextContent.push(nextBlock);
        contentChanged = true;
      } else {
        nextContent.push(block);
      }
    }
    if (contentChanged) {
      touched = true;
    }
    if (nextContent.length === 0) {
      touched = true;
      continue;
    }
    out.push(contentChanged ? __assign(__assign({}, assistant), { content: nextContent }) : msg);
  }
  return touched ? out : messages;
}
function findUnsupportedSchemaKeywords(schema, path) {
  if (!schema || typeof schema !== "object") {
    return [];
  }
  if (Array.isArray(schema)) {
    return schema.flatMap(function (item, index) {
      return findUnsupportedSchemaKeywords(item, "".concat(path, "[").concat(index, "]"));
    });
  }
  var record = schema;
  var violations = [];
  var properties =
    record.properties && typeof record.properties === "object" && !Array.isArray(record.properties)
      ? record.properties
      : undefined;
  if (properties) {
    for (var _i = 0, _a = Object.entries(properties); _i < _a.length; _i++) {
      var _b = _a[_i],
        key = _b[0],
        value = _b[1];
      violations.push.apply(
        violations,
        findUnsupportedSchemaKeywords(value, "".concat(path, ".properties.").concat(key)),
      );
    }
  }
  for (var _c = 0, _d = Object.entries(record); _c < _d.length; _c++) {
    var _e = _d[_c],
      key = _e[0],
      value = _e[1];
    if (key === "properties") {
      continue;
    }
    if (GOOGLE_SCHEMA_UNSUPPORTED_KEYWORDS.has(key)) {
      violations.push("".concat(path, ".").concat(key));
    }
    if (value && typeof value === "object") {
      violations.push.apply(
        violations,
        findUnsupportedSchemaKeywords(value, "".concat(path, ".").concat(key)),
      );
    }
  }
  return violations;
}
function sanitizeToolsForGoogle(params) {
  if (params.provider !== "google-antigravity" && params.provider !== "google-gemini-cli") {
    return params.tools;
  }
  return params.tools.map(function (tool) {
    if (!tool.parameters || typeof tool.parameters !== "object") {
      return tool;
    }
    return __assign(__assign({}, tool), {
      parameters: (0, pi_tools_schema_js_1.cleanToolSchemaForGemini)(tool.parameters),
    });
  });
}
function logToolSchemasForGoogle(params) {
  if (params.provider !== "google-antigravity" && params.provider !== "google-gemini-cli") {
    return;
  }
  var toolNames = params.tools.map(function (tool, index) {
    return "".concat(index, ":").concat(tool.name);
  });
  var tools = sanitizeToolsForGoogle(params);
  logger_js_1.log.info("google tool schema snapshot", {
    provider: params.provider,
    toolCount: tools.length,
    tools: toolNames,
  });
  for (var _i = 0, _a = tools.entries(); _i < _a.length; _i++) {
    var _b = _a[_i],
      index = _b[0],
      tool = _b[1];
    var violations = findUnsupportedSchemaKeywords(
      tool.parameters,
      "".concat(tool.name, ".parameters"),
    );
    if (violations.length > 0) {
      logger_js_1.log.warn("google tool schema has unsupported keywords", {
        index: index,
        tool: tool.name,
        violations: violations.slice(0, 12),
        violationCount: violations.length,
      });
    }
  }
}
// Event emitter for unhandled compaction failures that escape try-catch blocks.
// Listeners can use this to trigger session recovery with retry.
var compactionFailureEmitter = new node_events_1.EventEmitter();
/**
 * Register a listener for unhandled compaction failures.
 * Called when auto-compaction fails in a way that escapes the normal try-catch,
 * e.g., when the summarization request itself exceeds the model's token limit.
 * Returns an unsubscribe function.
 */
function onUnhandledCompactionFailure(cb) {
  compactionFailureEmitter.on("failure", cb);
  return function () {
    return compactionFailureEmitter.off("failure", cb);
  };
}
(0, unhandled_rejections_js_1.registerUnhandledRejectionHandler)(function (reason) {
  var message = (0, utils_js_1.describeUnknownError)(reason);
  if (!(0, pi_embedded_helpers_js_1.isCompactionFailureError)(message)) {
    return false;
  }
  logger_js_1.log.error("Auto-compaction failed (unhandled): ".concat(message));
  compactionFailureEmitter.emit("failure", message);
  return true;
});
var MODEL_SNAPSHOT_CUSTOM_TYPE = "model-snapshot";
function readLastModelSnapshot(sessionManager) {
  try {
    var entries = sessionManager.getEntries();
    for (var i = entries.length - 1; i >= 0; i--) {
      var entry = entries[i];
      if (
        (entry === null || entry === void 0 ? void 0 : entry.type) !== "custom" ||
        (entry === null || entry === void 0 ? void 0 : entry.customType) !==
          MODEL_SNAPSHOT_CUSTOM_TYPE
      ) {
        continue;
      }
      var data = entry === null || entry === void 0 ? void 0 : entry.data;
      if (data && typeof data === "object") {
        return data;
      }
    }
  } catch (_a) {
    return null;
  }
  return null;
}
function appendModelSnapshot(sessionManager, data) {
  try {
    sessionManager.appendCustomEntry(MODEL_SNAPSHOT_CUSTOM_TYPE, data);
  } catch (_a) {
    // ignore persistence failures
  }
}
function isSameModelSnapshot(a, b) {
  var normalize = function (value) {
    return value !== null && value !== void 0 ? value : "";
  };
  return (
    normalize(a.provider) === normalize(b.provider) &&
    normalize(a.modelApi) === normalize(b.modelApi) &&
    normalize(a.modelId) === normalize(b.modelId)
  );
}
function hasGoogleTurnOrderingMarker(sessionManager) {
  try {
    return sessionManager.getEntries().some(function (entry) {
      return (
        (entry === null || entry === void 0 ? void 0 : entry.type) === "custom" &&
        (entry === null || entry === void 0 ? void 0 : entry.customType) ===
          GOOGLE_TURN_ORDERING_CUSTOM_TYPE
      );
    });
  } catch (_a) {
    return false;
  }
}
function markGoogleTurnOrderingMarker(sessionManager) {
  try {
    sessionManager.appendCustomEntry(GOOGLE_TURN_ORDERING_CUSTOM_TYPE, {
      timestamp: Date.now(),
    });
  } catch (_a) {
    // ignore marker persistence failures
  }
}
function applyGoogleTurnOrderingFix(params) {
  var _a;
  if (!(0, pi_embedded_helpers_js_1.isGoogleModelApi)(params.modelApi)) {
    return { messages: params.messages, didPrepend: false };
  }
  var first = params.messages[0];
  if ((first === null || first === void 0 ? void 0 : first.role) !== "assistant") {
    return { messages: params.messages, didPrepend: false };
  }
  var sanitized = (0, pi_embedded_helpers_js_1.sanitizeGoogleTurnOrdering)(params.messages);
  var didPrepend = sanitized !== params.messages;
  if (didPrepend && !hasGoogleTurnOrderingMarker(params.sessionManager)) {
    var warn =
      (_a = params.warn) !== null && _a !== void 0
        ? _a
        : function (message) {
            return logger_js_1.log.warn(message);
          };
    warn(
      "google turn ordering fixup: prepended user bootstrap (sessionId=".concat(
        params.sessionId,
        ")",
      ),
    );
    markGoogleTurnOrderingMarker(params.sessionManager);
  }
  return { messages: sanitized, didPrepend: didPrepend };
}
function sanitizeSessionHistory(params) {
  return __awaiter(this, void 0, void 0, function () {
    var policy,
      sanitizedImages,
      sanitizedThinking,
      repairedTools,
      isOpenAIResponsesApi,
      hasSnapshot,
      priorSnapshot,
      modelChanged,
      sanitizedOpenAI;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          policy =
            (_a = params.policy) !== null && _a !== void 0
              ? _a
              : (0, transcript_policy_js_1.resolveTranscriptPolicy)({
                  modelApi: params.modelApi,
                  provider: params.provider,
                  modelId: params.modelId,
                });
          return [
            4 /*yield*/,
            (0, pi_embedded_helpers_js_1.sanitizeSessionMessagesImages)(
              params.messages,
              "session:history",
              {
                sanitizeMode: policy.sanitizeMode,
                sanitizeToolCallIds: policy.sanitizeToolCallIds,
                toolCallIdMode: policy.toolCallIdMode,
                preserveSignatures: policy.preserveSignatures,
                sanitizeThoughtSignatures: policy.sanitizeThoughtSignatures,
              },
            ),
          ];
        case 1:
          sanitizedImages = _b.sent();
          sanitizedThinking = policy.normalizeAntigravityThinkingBlocks
            ? sanitizeAntigravityThinkingBlocks(sanitizedImages)
            : sanitizedImages;
          repairedTools = policy.repairToolUseResultPairing
            ? (0, session_transcript_repair_js_1.sanitizeToolUseResultPairing)(sanitizedThinking)
            : sanitizedThinking;
          isOpenAIResponsesApi =
            params.modelApi === "openai-responses" || params.modelApi === "openai-codex-responses";
          hasSnapshot = Boolean(params.provider || params.modelApi || params.modelId);
          priorSnapshot = hasSnapshot ? readLastModelSnapshot(params.sessionManager) : null;
          modelChanged = priorSnapshot
            ? !isSameModelSnapshot(priorSnapshot, {
                timestamp: 0,
                provider: params.provider,
                modelApi: params.modelApi,
                modelId: params.modelId,
              })
            : false;
          sanitizedOpenAI =
            isOpenAIResponsesApi && modelChanged
              ? (0, pi_embedded_helpers_js_1.downgradeOpenAIReasoningBlocks)(repairedTools)
              : repairedTools;
          if (hasSnapshot && (!priorSnapshot || modelChanged)) {
            appendModelSnapshot(params.sessionManager, {
              timestamp: Date.now(),
              provider: params.provider,
              modelApi: params.modelApi,
              modelId: params.modelId,
            });
          }
          if (!policy.applyGoogleTurnOrdering) {
            return [2 /*return*/, sanitizedOpenAI];
          }
          return [
            2 /*return*/,
            applyGoogleTurnOrderingFix({
              messages: sanitizedOpenAI,
              modelApi: params.modelApi,
              sessionManager: params.sessionManager,
              sessionId: params.sessionId,
            }).messages,
          ];
      }
    });
  });
}
