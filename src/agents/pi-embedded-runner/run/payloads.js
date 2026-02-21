"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEmbeddedRunPayloads = buildEmbeddedRunPayloads;
var reply_directives_js_1 = require("../../../auto-reply/reply/reply-directives.js");
var tokens_js_1 = require("../../../auto-reply/tokens.js");
var tool_meta_js_1 = require("../../../auto-reply/tool-meta.js");
var pi_embedded_helpers_js_1 = require("../../pi-embedded-helpers.js");
var pi_embedded_utils_js_1 = require("../../pi-embedded-utils.js");
function buildEmbeddedRunPayloads(params) {
  var _a, _b, _c, _d, _e, _f, _g;
  var replyItems = [];
  var useMarkdown = params.toolResultFormat === "markdown";
  var lastAssistantErrored =
    ((_a = params.lastAssistant) === null || _a === void 0 ? void 0 : _a.stopReason) === "error";
  var errorText = params.lastAssistant
    ? (0, pi_embedded_helpers_js_1.formatAssistantErrorText)(params.lastAssistant, {
        cfg: params.config,
        sessionKey: params.sessionKey,
      })
    : undefined;
  var rawErrorMessage = lastAssistantErrored
    ? ((_c = (_b = params.lastAssistant) === null || _b === void 0 ? void 0 : _b.errorMessage) ===
        null || _c === void 0
        ? void 0
        : _c.trim()) || undefined
    : undefined;
  var rawErrorFingerprint = rawErrorMessage
    ? (0, pi_embedded_helpers_js_1.getApiErrorPayloadFingerprint)(rawErrorMessage)
    : null;
  var formattedRawErrorMessage = rawErrorMessage
    ? (0, pi_embedded_helpers_js_1.formatRawAssistantErrorForUi)(rawErrorMessage)
    : null;
  var normalizedFormattedRawErrorMessage = formattedRawErrorMessage
    ? (0, pi_embedded_helpers_js_1.normalizeTextForComparison)(formattedRawErrorMessage)
    : null;
  var normalizedRawErrorText = rawErrorMessage
    ? (0, pi_embedded_helpers_js_1.normalizeTextForComparison)(rawErrorMessage)
    : null;
  var normalizedErrorText = errorText
    ? (0, pi_embedded_helpers_js_1.normalizeTextForComparison)(errorText)
    : null;
  var genericErrorText = "The AI service returned an error. Please try again.";
  if (errorText) {
    replyItems.push({ text: errorText, isError: true });
  }
  var inlineToolResults =
    params.inlineToolResultsAllowed && params.verboseLevel !== "off" && params.toolMetas.length > 0;
  if (inlineToolResults) {
    for (var _i = 0, _h = params.toolMetas; _i < _h.length; _i++) {
      var _j = _h[_i],
        toolName = _j.toolName,
        meta = _j.meta;
      var agg = (0, tool_meta_js_1.formatToolAggregate)(toolName, meta ? [meta] : [], {
        markdown: useMarkdown,
      });
      var _k = (0, reply_directives_js_1.parseReplyDirectives)(agg),
        cleanedText = _k.text,
        mediaUrls = _k.mediaUrls,
        audioAsVoice = _k.audioAsVoice,
        replyToId = _k.replyToId,
        replyToTag = _k.replyToTag,
        replyToCurrent = _k.replyToCurrent;
      if (cleanedText) {
        replyItems.push({
          text: cleanedText,
          media: mediaUrls,
          audioAsVoice: audioAsVoice,
          replyToId: replyToId,
          replyToTag: replyToTag,
          replyToCurrent: replyToCurrent,
        });
      }
    }
  }
  var reasoningText =
    params.lastAssistant && params.reasoningLevel === "on"
      ? (0, pi_embedded_utils_js_1.formatReasoningMessage)(
          (0, pi_embedded_utils_js_1.extractAssistantThinking)(params.lastAssistant),
        )
      : "";
  if (reasoningText) {
    replyItems.push({ text: reasoningText });
  }
  var fallbackAnswerText = params.lastAssistant
    ? (0, pi_embedded_utils_js_1.extractAssistantText)(params.lastAssistant)
    : "";
  var shouldSuppressRawErrorText = function (text) {
    if (!lastAssistantErrored) {
      return false;
    }
    var trimmed = text.trim();
    if (!trimmed) {
      return false;
    }
    if (errorText) {
      var normalized = (0, pi_embedded_helpers_js_1.normalizeTextForComparison)(trimmed);
      if (normalized && normalizedErrorText && normalized === normalizedErrorText) {
        return true;
      }
      if (trimmed === genericErrorText) {
        return true;
      }
    }
    if (rawErrorMessage && trimmed === rawErrorMessage) {
      return true;
    }
    if (formattedRawErrorMessage && trimmed === formattedRawErrorMessage) {
      return true;
    }
    if (normalizedRawErrorText) {
      var normalized = (0, pi_embedded_helpers_js_1.normalizeTextForComparison)(trimmed);
      if (normalized && normalized === normalizedRawErrorText) {
        return true;
      }
    }
    if (normalizedFormattedRawErrorMessage) {
      var normalized = (0, pi_embedded_helpers_js_1.normalizeTextForComparison)(trimmed);
      if (normalized && normalized === normalizedFormattedRawErrorMessage) {
        return true;
      }
    }
    if (rawErrorFingerprint) {
      var fingerprint = (0, pi_embedded_helpers_js_1.getApiErrorPayloadFingerprint)(trimmed);
      if (fingerprint && fingerprint === rawErrorFingerprint) {
        return true;
      }
    }
    return (0, pi_embedded_helpers_js_1.isRawApiErrorPayload)(trimmed);
  };
  var answerTexts = (
    params.assistantTexts.length
      ? params.assistantTexts
      : fallbackAnswerText
        ? [fallbackAnswerText]
        : []
  ).filter(function (text) {
    return !shouldSuppressRawErrorText(text);
  });
  for (var _l = 0, answerTexts_1 = answerTexts; _l < answerTexts_1.length; _l++) {
    var text = answerTexts_1[_l];
    var _m = (0, reply_directives_js_1.parseReplyDirectives)(text),
      cleanedText = _m.text,
      mediaUrls = _m.mediaUrls,
      audioAsVoice = _m.audioAsVoice,
      replyToId = _m.replyToId,
      replyToTag = _m.replyToTag,
      replyToCurrent = _m.replyToCurrent;
    if (!cleanedText && (!mediaUrls || mediaUrls.length === 0) && !audioAsVoice) {
      continue;
    }
    replyItems.push({
      text: cleanedText,
      media: mediaUrls,
      audioAsVoice: audioAsVoice,
      replyToId: replyToId,
      replyToTag: replyToTag,
      replyToCurrent: replyToCurrent,
    });
  }
  if (params.lastToolError) {
    var lastAssistantHasToolCalls =
      Array.isArray((_d = params.lastAssistant) === null || _d === void 0 ? void 0 : _d.content) &&
      ((_e = params.lastAssistant) === null || _e === void 0
        ? void 0
        : _e.content.some(function (block) {
            return block && typeof block === "object" ? block.type === "toolCall" : false;
          }));
    var lastAssistantWasToolUse =
      ((_f = params.lastAssistant) === null || _f === void 0 ? void 0 : _f.stopReason) ===
      "toolUse";
    var hasUserFacingReply =
      replyItems.length > 0 && !lastAssistantHasToolCalls && !lastAssistantWasToolUse;
    // Check if this is a recoverable/internal tool error that shouldn't be shown to users
    // when there's already a user-facing reply (the model should have retried).
    var errorLower = (
      (_g = params.lastToolError.error) !== null && _g !== void 0 ? _g : ""
    ).toLowerCase();
    var isRecoverableError =
      errorLower.includes("required") ||
      errorLower.includes("missing") ||
      errorLower.includes("invalid") ||
      errorLower.includes("must be") ||
      errorLower.includes("must have") ||
      errorLower.includes("needs") ||
      errorLower.includes("requires");
    // Show tool errors only when:
    // 1. There's no user-facing reply AND the error is not recoverable
    // Recoverable errors (validation, missing params) are already in the model's context
    // and shouldn't be surfaced to users since the model should retry.
    if (!hasUserFacingReply && !isRecoverableError) {
      var toolSummary = (0, tool_meta_js_1.formatToolAggregate)(
        params.lastToolError.toolName,
        params.lastToolError.meta ? [params.lastToolError.meta] : undefined,
        { markdown: useMarkdown },
      );
      var errorSuffix = params.lastToolError.error ? ": ".concat(params.lastToolError.error) : "";
      replyItems.push({
        text: "\u26A0\uFE0F ".concat(toolSummary, " failed").concat(errorSuffix),
        isError: true,
      });
    }
  }
  var hasAudioAsVoiceTag = replyItems.some(function (item) {
    return item.audioAsVoice;
  });
  return replyItems
    .map(function (item) {
      var _a, _b, _c, _d;
      return {
        text: ((_a = item.text) === null || _a === void 0 ? void 0 : _a.trim())
          ? item.text.trim()
          : undefined,
        mediaUrls: ((_b = item.media) === null || _b === void 0 ? void 0 : _b.length)
          ? item.media
          : undefined,
        mediaUrl: (_c = item.media) === null || _c === void 0 ? void 0 : _c[0],
        isError: item.isError,
        replyToId: item.replyToId,
        replyToTag: item.replyToTag,
        replyToCurrent: item.replyToCurrent,
        audioAsVoice:
          item.audioAsVoice ||
          Boolean(
            hasAudioAsVoiceTag &&
            ((_d = item.media) === null || _d === void 0 ? void 0 : _d.length),
          ),
      };
    })
    .filter(function (p) {
      if (!p.text && !p.mediaUrl && (!p.mediaUrls || p.mediaUrls.length === 0)) {
        return false;
      }
      if (p.text && (0, tokens_js_1.isSilentReplyText)(p.text, tokens_js_1.SILENT_REPLY_TOKEN)) {
        return false;
      }
      return true;
    });
}
